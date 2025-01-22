import { ReviewBreakdownDto } from "./ReviewBreakdown.dto";

export class ProfileDetails {
  profilePicUrl: string;
  bannerPicURl: string;
  description: string;
  overallRating: number;
  totalReviews: number;
  reviewsBreakdown: ReviewBreakdownDto 
}
