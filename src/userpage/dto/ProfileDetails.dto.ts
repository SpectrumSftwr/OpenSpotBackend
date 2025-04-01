import { ReviewBreakdownDto } from "./ReviewBreakdown.dto";

export class ProfileDetails {
  business_name: string;
  business_type: string;
  profilePicUrl: string;
  bannerPicUrl: string;
  description: string;
  overallRating: number;
  totalReviews: number;
  reviewsBreakdown: ReviewBreakdownDto 
}
