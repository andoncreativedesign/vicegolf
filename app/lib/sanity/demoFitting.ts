import { HttpStatusCode } from "axios";
import { axiosSanity } from "~/utils/axiosInsatances";

export const demoFittingQuery = `*[_type == "demoFitting"][0]{
  hero {
    "title": {
      "text": title.text,
      "color": title.color.hex
    },
    "secondaryText": {
      "text": secondaryText.text,
      "color": secondaryText.color.hex
    },
    backgroundImage {
      asset-> {
        _id,
        url
      }
    },
    mobileBackgroundImage {
      asset-> {
        _id,
        url
      }
    }
  },
  descriptionSection {
    paragraphs
  },
  booking {
    title,
    subtitle,
    whatsappMessage,
    emailSubject,
    emailBody,
    stores[] {
      name,
      phone,
      email,
      whatsappNumber,
      "buttonColor": buttonColor.hex,
      "buttonTextColor": buttonTextColor.hex
    }
  },
  seo
}`;

export interface TextColorObject {
  text?: string;
  color?: string;
}

export interface DemoFittingData {
  hero: {
    title?: TextColorObject;
    secondaryText?: TextColorObject;
    backgroundImage?: string;
    mobileBackgroundImage?: string;
  };
  descriptionSection: {
    paragraphs?: string[];
  };
  booking: {
    title?: string;
    subtitle?: string;
    whatsappMessage?: string;
    stores?: Array<{
      name: string;
      phone: string;
      email: string;
      whatsappNumber?: string;
      emailSubject?: string;
      emailBody?: string;
      buttonColor?: string;
      buttonTextColor?: string;
    }>;
  };
  seo?: any;
}

export async function getDemoFittingData(): Promise<DemoFittingData | null> {
  try {
    const query = encodeURIComponent(demoFittingQuery);
    const response = await axiosSanity.get("/?query=" + query);

    if (response.status !== HttpStatusCode.Ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const { result } = response.data;
    if (!result) return null;

    return {
      hero: {
        title: result.hero?.title,
        secondaryText: result.hero?.secondaryText,
        backgroundImage: result.hero?.backgroundImage?.asset?.url,
        mobileBackgroundImage: result.hero?.mobileBackgroundImage?.asset?.url,
      },
      descriptionSection: {
        paragraphs: result.descriptionSection?.paragraphs,
      },
      booking: result.booking,
      seo: result.seo,
    };
  } catch (error) {
    console.error('Error fetching demo fitting data:', error);
    return null;
  }
}