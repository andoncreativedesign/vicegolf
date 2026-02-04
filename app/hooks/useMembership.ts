import { useRouteLoaderData } from 'react-router';
import type { RootLoader } from '~/root';

export function useMembership() {
    const data = useRouteLoaderData<RootLoader>('root');

    const customer = data?.customer;
    const membershipDiscount = data?.membershipDiscount || {
        percentage: 0,
        amount: null,
        currencyCode: null,
        title: '',
        appliesToAll: false,
        eligibleProducts: [],
        eligibleCollections: []
    };
    const automaticDiscounts = data?.automaticDiscounts || [];

    const customerTags = customer?.tags?.map((t: string) => t.toLowerCase()) || [];
    const segments = ['vice_crew', 'vice_squad', 'vice_legends'];
    const userSegment = segments.find(s => customerTags.includes(s));
    const isMember = !!userSegment;

    const discountPercentage = membershipDiscount?.percentage || 0;
    const discountAmount = membershipDiscount?.amount || 0;

    /**
     * Determine the best discount for a specific product
     */
    const getBestDiscountForProduct = (
        productId: string,
        collectionIds: string[] = [],
        basePrice: number = 0
    ) => {
        let bestPercentage = 0;
        let bestAmount = 0;

        // 1. Check membership-specific discount first (this is already the "best" global one we found in root)
        if (isMember) {
            // If it's a global discount or the product/collection is eligible
            const isEligible =
                membershipDiscount.appliesToAll ||
                membershipDiscount.eligibleProducts?.includes(productId) ||
                collectionIds.some(id => membershipDiscount.eligibleCollections?.includes(id));

            if (isEligible) {
                bestPercentage = membershipDiscount.percentage || 0;
                bestAmount = membershipDiscount.amount || 0;
            }
        }

        // 2. Compare with other automatic discounts that might apply to everyone
        automaticDiscounts.forEach((discount: any) => {
            // Skip if this is the one we already checked
            if (discount.title === membershipDiscount.title) return;

            const isEligible =
                discount.appliesToAll ||
                discount.eligibleProducts?.includes(productId) ||
                collectionIds.some(id => discount.eligibleCollections?.includes(id));

            if (isEligible) {
                if (discount.percentage > bestPercentage) {
                    bestPercentage = discount.percentage;
                    bestAmount = 0; // Prioritize percentage if higher
                } else if (discount.amount > bestAmount && bestPercentage === 0) {
                    bestAmount = discount.amount;
                }
            }
        });

        return {
            percentage: bestPercentage,
            amount: bestAmount,
        };
    };

    return {
        isMember,
        userSegment,
        discountPercentage,
        discountAmount,
        getBestDiscountForProduct,
        membershipDiscount,
    };
}
