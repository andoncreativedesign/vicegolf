import { HttpStatusCode } from "axios";
import { createAxiosSanity } from "~/utils/axiosInsatances";

export interface CampaignData {
  title?: string;
  slug?: { current: string };
  heroImageDesktop?: { asset: { url: string } };
  heroImageMobile?: { asset: { url: string } };
  heroAltText?: string;
  newsletterHeading?: string;
  newsletterDescription?: string;
  prizeImage?: { asset: { url: string } };
  successTitle?: string;
  successText?: string;
  alreadyRegisteredTitle?: string;
  alreadyRegisteredText?: string;
  inputPlaceholder?: string;
  inputBgColor?: { hex: string };
  inputTextColor?: { hex: string };
  buttonText?: string;
  buttonBgColor?: { hex: string };
  buttonTextColor?: { hex: string };
  benefitsHeading?: string;
  features?: Array<{
    icon: { asset: { url: string } };
    title: string;
  }>;
  disclaimerText?: string;
}

export async function getCampaignDataBySlug(slug: string, env?: any): Promise<CampaignData | null> {
  try {
    const axiosSanityInstance = createAxiosSanity(env);
    
    // Injecting slug directly since we are using a URL encoded string,
    // ensure slug is safe (basic alphanumeric/hyphen check)
    const safeSlug = slug.replace(/[^a-zA-Z0-9-]/g, '');
    
    const query = encodeURIComponent(`*[_type == "campaignPage" && slug.current == "${safeSlug}"][0]{
      title,
      slug,
      heroImageDesktop { asset->{url} },
      heroImageMobile { asset->{url} },
      heroAltText,
      newsletterHeading,
      newsletterDescription,
      prizeImage { asset->{url} },
      successTitle,
      successText,
      alreadyRegisteredTitle,
      alreadyRegisteredText,
      inputPlaceholder,
      inputBgColor,
      inputTextColor,
      buttonText,
      buttonBgColor,
      buttonTextColor,
      benefitsHeading,
      features[] {
        icon { asset->{url} },
        title
      },
      disclaimerText
    }`);
    
    const response = await axiosSanityInstance.get("/?query=" + query);

    if (response.status !== HttpStatusCode.Ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.data?.result || null;
  } catch (error) {
    console.error('Error fetching campaign data:', error);
    return null;
  }
}
