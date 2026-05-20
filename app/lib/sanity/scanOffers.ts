import { HttpStatusCode } from "axios";
import { axiosSanity } from "~/utils/axiosInsatances";

export const scanOffersQuery = `*[_type == "scannedOffer"][0]{
  verificationCode,
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
  ctaButtons[] {
    name,
    url
  },
  secondaryCtaButtons[] {
    name,
    url
  },
  featuredProductTitle,
  featuredProductDiscountCode,
  descriptionSection {
    paragraphs
  },
  bookingTitle,
  seo,
  "products": products[]-> {
    "id": _id,
    "title": store.title,
    "handle": store.slug.current,
    "imageUrl": store.previewImageUrl,
    "priceRange": store.priceRange
  }
}`;

export const scanBookingQuery = `*[_type == "demoFitting"][0]{
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
}`;

export interface TextColorObject {
  text?: string;
  color?: string;
}

export interface ScanOffersData {
  verificationCode?: string;
  hero: {
    title?: TextColorObject;
    secondaryText?: TextColorObject;
    backgroundImage?: string;
    mobileBackgroundImage?: string;
  };
  ctaButtons?: Array<{ name?: string; url?: string }>;
  secondaryCtaButtons?: Array<{ name?: string; url?: string }>;
  featuredProductTitle?: string;
  featuredProductDiscountCode?: string;
  descriptionSection: {
    paragraphs?: string[];
  };
  bookingTitle?: string;
  booking?: Booking;
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

export interface BookingStore {
  name: string;
  phone: string;
  email: string;
  whatsappNumber?: string;
  buttonColor?: string;
  buttonTextColor?: string;
}

export interface Booking {
  title?: string;
  subtitle?: string;
  whatsappMessage?: string;
  emailSubject?: string;
  emailBody?: string;
  stores?: BookingStore[];
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
      verificationCode: result.verificationCode,
      hero: {
        title: result.hero?.title,
        secondaryText: result.hero?.secondaryText,
        backgroundImage: result.hero?.backgroundImage?.asset?.url,
        mobileBackgroundImage: result.hero?.mobileBackgroundImage?.asset?.url,
      },
      ctaButtons: result.ctaButtons,
      secondaryCtaButtons: result.secondaryCtaButtons,
      featuredProductTitle: result.featuredProductTitle,
      featuredProductDiscountCode: result.featuredProductDiscountCode,
      descriptionSection: {
        paragraphs: result.descriptionSection?.paragraphs,
      },
      bookingTitle: result.bookingTitle,
      seo: result.seo,
      products: result.products,
    };
  } catch (error) {
    console.error('Error fetching scan offers data:', error);
    return null;
  }
}

export async function getScanBookingData(): Promise<Booking | null> {
  try {
    const query = encodeURIComponent(scanBookingQuery);
    const response = await axiosSanity.get("/?query=" + query);

    if (response.status !== HttpStatusCode.Ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const { result } = response.data;
    return result?.booking || null;
  } catch (error) {
    console.error('Error fetching scan booking data:', error);
    return null;
  }
}