import { SiteLinksDto } from "./sitelinks.dto";
import { SiteColorsDto } from "./sitecolors.dto";

export class SiteDto {
  colors: SiteColorsDto;
  links: SiteLinksDto[];
}
