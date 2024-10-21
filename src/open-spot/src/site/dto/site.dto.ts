import { SiteLinksDto } from "./sitelinks.dto";
import { SiteColorsDto } from "./sitecolors.dto";
import { UserPublicDetailsDto } from "./UserPublicDetails.dto";
import { OfferingsDto } from "./Offerings.dto";

export class SiteDto {
  colors: SiteColorsDto;
  personalDetails: UserPublicDetailsDto;
  links: SiteLinksDto[];
  offerings: OfferingsDto[];
}
