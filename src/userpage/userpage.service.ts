import { Injectable } from '@nestjs/common';
import { ProfileDetails } from './dto/ProfileDetails.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Business, BusinessGallery, BusinessPackage } from '@prisma/client';
import { ReviewBreakdownDto } from './dto/ReviewBreakdown.dto';
import { Filters } from 'src/common/dto/filters.dto';
import { PackageDto } from './dto/Package.dto';
import { UserStorageService } from 'src/user-storage/user-storage.service';

@Injectable()
export class UserpageService {

  constructor(
    private prisma: PrismaService,
    private userStorageService: UserStorageService,
  ) {}

  /**
   * Get The Main Profile Business details.
   */
  async getProfileBusinessDetails(businessName: string) : Promise<ProfileDetails | {hasError: boolean}> {
    let businessDetails = await this.prisma.business.findFirst({where: {
      business_UID: {
        equals: businessName,
        mode: "insensitive"
      }
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
      where: {
        business_id: businessDetails.id
      }
    })

    let reviewsBreakdown = await this.getReviewBreakdown(businessDetails);

    return await this.buildProfileDetailsDto(businessDetails, 
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
        fiveStarReviews: results[4],
        fourStarReviews: results[3],
        threeStarReviews: results[2],
        twoStarReviews: results[1],
        oneStarReviews: results[0],
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
  async buildProfileDetailsDto(business: Business, totalReview: number, reviewAverage: number, reviewsBreakdown: ReviewBreakdownDto) 
    : Promise<ProfileDetails> {
      const profilePictureSignedUrl = await this.userStorageService.getSignedUrl(business.profile_picture_url);
      const bannerPicUrl = await this.userStorageService.getSignedUrl(business.business_banner_url);

      return {
        business_name: business.business_name,
        business_type: business.business_type,
        profilePicUrl: profilePictureSignedUrl,
        bannerPicUrl: bannerPicUrl,
        description: business.profileDescription,
        totalReviews: totalReview,
        overallRating: reviewAverage,
        reviewsBreakdown: reviewsBreakdown
      }
    }

    /**
     * fetches a business's FAQs
     */
    async getProfileBusinessFaqs(businessName: string, onlyCore : boolean): Promise<any> {
      let businessDetails = await this.prisma.business.findFirst({where: {
          business_UID: {
            equals: businessName,
            mode: "insensitive"
          },
      }})


      if (businessDetails == null) {
        return {
          hasError: true
        };
      }
      const where = {
        business_id: businessDetails.id,
      }

      if (onlyCore) {
        where['coreQ'] = true;
      }

      let faqs = await this.prisma.businessFAQs.findMany({where})

      return faqs;
    }

    /**
     * Gets the Business Gallery Preview of 8 Images.
     */
    async getProfileBusinessGalleryPreview(businessName: string): Promise<any> {

      let businessDetails = await this.prisma.business.findFirst({where: {
          business_UID: {
            equals: businessName,
            mode: "insensitive"
          }
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

      // generateSigned urls if not present or if url is expired.
      imageUrls = await this.validateCachedUrls(imageUrls)
      return imageUrls;
    }

    async validateCachedUrls(images: BusinessGallery[]) : Promise<BusinessGallery[]> {
      const results : BusinessGallery[] = [];

      for (let image of images) {
        
        // If the Presigned URL does not exist or the url has expired Regenerate the URL.
        if (!image.presignedUrl || image.expiresAt < new Date()){
          const updatedPreSignedUrl = await this.userStorageService.getSignedUrl(image.imageUrl);
          const now = new Date();
          const updatedExpireryDate = new Date(now);
          updatedExpireryDate.setMinutes(now.getMinutes() + 30);

          image = await this.prisma.businessGallery.update({
            where: {
              id: image.id
            },
            data: {
              presignedUrl: updatedPreSignedUrl,
              expiresAt: updatedExpireryDate 
            }
          })
        }

        results.push(image);
      }

      return results;
    }

    /**
     * Gets the Business Gallery Preview of 8 Images.
     */
    async getProfileBusinessGallery(businessName: string): Promise<any> {
      let businessDetails = await this.prisma.business.findFirst({where: {
          business_UID: {
            equals: businessName,
            mode: "insensitive"
          }
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

      imageUrls = await this.validateCachedUrls(imageUrls);
      return imageUrls;
    }

    /**
     * Gets all the Reviews from the business
     */
    async getProfileBusinessReviews(businessName: string): Promise<any> {

      let businessDetails = await this.prisma.business.findFirst({where: {
          business_UID: {
            equals: businessName,
            mode: "insensitive"
          }
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
          business_UID: {
            equals: businessName,
            mode: "insensitive"
          }
      }})


      if (businessDetails == null) {
        return {
          hasError: true
        };
      }

      let dbPackages = await this.prisma.businessPackage.findMany({
        where: {
          business_id: businessDetails.id
        },
        include: {
          packageFeatures: {
            include: {
              packageItem: {
                select : {name: true},
              }
            }
          },
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
          includes: pkg.packageFeatures.map(f => f.packageItem.name)
        }
      })

      return convertedPackages

    }

    async getPackageDetails(packageId: string): Promise<PackageDto|{hasError:boolean}> {

      let pkg = await this.prisma.businessPackage.findFirst({
        where: {
          id: parseInt(packageId)
        },
        include: {
          packageFeatures: {
            include: {
              packageItem: {
                select : {name: true},
              }
            }
          },
        }
      })

      if (!pkg) {
        throw Error("No Package Details found with given ID");
      }

      let convertedPackages = {
          id: pkg.id,
          icon: pkg.icon,
          title: pkg.title,
          duration: pkg.duration_in_minutes,
          price: pkg.price,
          description: pkg.description,
          includes: pkg.packageFeatures.map(f => f.packageItem.name)
      }

      return convertedPackages ? convertedPackages : {hasError: true};
    }
}
