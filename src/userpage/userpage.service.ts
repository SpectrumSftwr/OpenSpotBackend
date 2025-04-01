import { Injectable } from '@nestjs/common';
import { ProfileDetails } from './dto/ProfileDetails.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Business } from '@prisma/client';
import { ReviewBreakdownDto } from './dto/ReviewBreakdown.dto';
import { Filters } from 'src/common/dto/filters.dto';
import { PackageDto } from './dto/Package.dto';

@Injectable()
export class UserpageService {

  constructor(private prisma: PrismaService) {}

  /**
   * Get The Main Profile Business details.
   */
  async getProfileBusinessDetails(businessName: string) : Promise<ProfileDetails | {hasError: boolean}> {


    let businessDetails = await this.prisma.business.findFirst({where: {
      business_UID: businessName,
    }})

    if (businessDetails == null) {
      return {
        hasError: true
      };
    }

    let totalReview = await this.prisma.businessReviews.count({
      where: {
        business_id: businessDetails.id
      }
    })

    let reviewAverage = await this.prisma.businessReviews.aggregate({
      _avg: {
        rating: true,
      },
    })

    let reviewsBreakdown = await this.getReviewBreakdown(businessDetails);

    return this.buildProfileDetailsDto(businessDetails, 
                                       totalReview, 
                                       reviewAverage._avg.rating, 
                                       reviewsBreakdown);
  }


  /**
   * Gets the review breakdown for a business.
   */
  async getReviewBreakdown(businessDetails: Business) : Promise<ReviewBreakdownDto> {
    let results : number[] = []

    try {

      for (let i = 1; i < 6; i++) {
        let currentAggregation = await this.getReviewAggregation(businessDetails.id, i);
        results.push(currentAggregation)
      }

      return {
        fiveStarReviews: results[0],
        fourStarReviews: results[1],
        threeStarReviews: results[2],
        twoStarReviews: results[3],
        oneStarReviews: results[4],
      }

    } catch {
      return {
        fiveStarReviews: 0,
        fourStarReviews: 0,
        threeStarReviews:0,
        twoStarReviews:  0,
        oneStarReviews:  0,
      }
    }
  }

  /**
   * Gets the Review Breakdown For the Current User.
   */
  async getReviewAggregation(businessId: number, ratingCategory: number) : 
    Promise<number> {

    let aggregateData = await this.prisma.businessReviews.aggregate({
      _count: {
        _all: true,
      },
      where: {
        rating: ratingCategory,
        business_id: businessId,
      },
    })

    return aggregateData._count._all;
  }


  /**
   * Builds the profile details object from the inputed paramters.
   */
  buildProfileDetailsDto(business: Business, totalReview: number, reviewAverage: number, reviewsBreakdown: ReviewBreakdownDto) 
    : ProfileDetails {
      return {
        business_name: business.business_name,
        business_type: business.business_type,
        profilePicUrl: business.profile_picture_url,
        bannerPicUrl: business.business_banner_url,
        description: business.profileDescription,
        totalReviews: totalReview,
        overallRating: reviewAverage,
        reviewsBreakdown: reviewsBreakdown
      }
    }

    /**
     * fetches a business's FAQs
     */
    async getProfileBusinessFaqs(businessName: string): Promise<any> {
      let businessDetails = await this.prisma.business.findFirst({where: {
        business_UID: businessName,
      }})


      if (businessDetails == null) {
        return {
          hasError: true
        };
      }

      let faqs = await this.prisma.businessFAQs.findMany({
        where: {
          business_id: businessDetails.id
        }
      })

      return faqs;
    }

    /**
     * Gets the Business Gallery Preview of 8 Images.
     */
    async getProfileBusinessGalleryPreview(businessName: string): Promise<any> {
      let businessDetails = await this.prisma.business.findFirst({where: {
        business_UID: businessName,
      }})


      if (businessDetails == null) {
        return {
          hasError: true
        };
      }

      let imageUrls = await this.prisma.businessGallery.findMany({
        take: 8,
        where: {
          business_id: businessDetails.id
        },
        orderBy: {
          created_at: 'asc'
        }
      })

      return imageUrls;
    }

    /**
     * Gets the Business Gallery Preview of 8 Images.
     */
    async getProfileBusinessGallery(businessName: string): Promise<any> {
      let businessDetails = await this.prisma.business.findFirst({where: {
        business_UID: businessName,
      }})


      if (businessDetails == null) {
        return {
          hasError: true
        };
      }

      let imageUrls = await this.prisma.businessGallery.findMany({
        where: {
          business_id: businessDetails.id
        },
        orderBy: {
          created_at: 'asc'
        }
      })

      return imageUrls;
    }

    /**
     * Gets all the Reviews from the business
     */
    async getProfileBusinessReviews(businessName: string): Promise<any> {

      let businessDetails = await this.prisma.business.findFirst({where: {
        business_UID: businessName,
      }})


      if (businessDetails == null) {
        return {
          hasError: true
        };
      }

      let reviews = await this.prisma.businessReviews.findMany({
        where: {
          business_id: businessDetails.id
        },
      })

      const formattedReviews = reviews.map(review => ({
        ...review,
        event_date: new Date(review.event_date)
      }))

      return formattedReviews;
    }

    /**
     * Gets all the Reviews from the business
     */
    async getBusinessPackages(businessName: string): Promise<PackageDto[]|{hasError:boolean}> {

      let businessDetails = await this.prisma.business.findFirst({where: {
        business_UID: businessName,
      }})


      if (businessDetails == null) {
        return {
          hasError: true
        };
      }

      let dbPackages = await this.prisma.businessPackage.findMany({
        where: {
          business_id: businessDetails.id
        }
      })

      let convertedPackages = dbPackages.map((pkg, index) => {
        return {
          id: pkg.id,
          icon: pkg.icon,
          title: pkg.title,
          duration: pkg.duration_in_minutes,
          price: pkg.price,
          description: pkg.description,
          includes: pkg.features,
        }
      })

      return convertedPackages

    }

    async getPackageDetails(packageId: string): Promise<PackageDto|{hasError:boolean}> {
      let pkg = await this.prisma.businessPackage.findFirst({
        where: {
          id: parseInt(packageId)
        }
      })

      let convertedPackages = {
          id: pkg.id,
          icon: pkg.icon,
          title: pkg.title,
          duration: pkg.duration_in_minutes,
          price: pkg.price,
          description: pkg.description,
          includes: pkg.features,
      }

      return convertedPackages ? convertedPackages : {hasError: true};
    }
}
