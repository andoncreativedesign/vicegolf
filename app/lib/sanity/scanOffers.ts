import { HttpStatusCode } from "axios";
import { axiosSanity } from "~/utils/axiosInsatances";

export const scanOffersQuery = `*[_type == "scannedOffer"][0]{
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
    },
    cta1 {
      name,
      url
    },
    cta2 {
      name,
      url
    }
  },
  featuredProductTitle,
  featuredProductDiscountCode,
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
  seo,
  "products": products[]-> {
    "id": _id,
    "title": store.title,
    "handle": store.slug.current,
    "imageUrl": store.previewImageUrl,
    "priceRange": store.priceRange
  }
}`;

export interface TextColorObject {
  text?: string;
  color?: string;
}

export interface ScanOffersData {
  hero: {
    title?: TextColorObject;
    secondaryText?: TextColorObject;
    backgroundImage?: string;
    mobileBackgroundImage?: string;
    cta1?: { name?: string; url?: string };
    cta2?: { name?: string; url?: string };
  };
  featuredProductTitle?: string;
  featuredProductDiscountCode?: string;
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
  products?: Array<{
    id: string;
    title: string;
    handle: string;
    imageUrl?: string;
    priceRange?: {
      minVariantPrice: number;
      maxVariantPrice: number;
    };
  }>;
}

export async function getScanOffersData(): Promise<ScanOffersData | null> {
  try {
    const query = encodeURIComponent(scanOffersQuery);
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
        cta1: result.hero?.cta1,
        cta2: result.hero?.cta2,
      },
      featuredProductTitle: result.featuredProductTitle,
      featuredProductDiscountCode: result.featuredProductDiscountCode,
      descriptionSection: {
        paragraphs: result.descriptionSection?.paragraphs,
      },
      booking: result.booking,
      seo: result.seo,
      products: result.products,
    };
  } catch (error) {
    console.error('Error fetching demo fitting data:', error);
    return null;
  }
}