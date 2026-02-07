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

    // Calculate the best TRUE GLOBAL discount available from the filtered list (applies to everything)
    let bestGlobalPct = 0;
    let bestGlobalAmt = 0;
    let bestGlobalCurrency = null;

    automaticDiscounts.forEach((d: any) => {
        // ONLY consider it 'Global' for the total display if it applies to everything
        if (d.appliesToAll) {
            if (d.percentage > bestGlobalPct) {
                bestGlobalPct = d.percentage;
            }
            if (d.amount > bestGlobalAmt) {
                bestGlobalAmt = d.amount;
                bestGlobalCurrency = d.currencyCode;
            }
        }
    });

    // If the membership tier discount itself is in the filtered list and matches appliesToAll, 
    // it will be caught above. 

    const discountPercentage = bestGlobalPct;
    const discountAmount = bestGlobalAmt;

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

        // Check all automatic discounts (which root.tsx already filtered to be Member-Tiers + Global)
        automaticDiscounts.forEach((discount: any) => {
            // IF it's a fixed amount discount that only applies ONCE per order,
            // we skip it for product-level displays to avoid confusion.
            if (!discount.appliesOnEachItem && discount.amount > 0) {
                return;
            }

            const isEligible =
                discount.appliesToAll ||
                discount.eligibleProducts?.includes(productId) ||
                collectionIds.some(id => discount.eligibleCollections?.includes(id));

            if (isEligible) {
                const savingsFromPct = (discount.percentage || 0) * basePrice;
                const savingsFromAmt = discount.amount || 0;
                const currentBestSavings = (bestPercentage * basePrice) || bestAmount;

                // Compare which one provides more actual savings
                if (savingsFromPct > currentBestSavings || savingsFromAmt > currentBestSavings) {
                    if (savingsFromPct >= savingsFromAmt) {
                        bestPercentage = discount.percentage;
                        bestAmount = 0;
                    } else {
                        bestAmount = discount.amount;
                        bestPercentage = 0;
                    }
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
