import { useLoaderData, useNavigate } from 'react-router';
import type { Route } from './+types/membership';
import { CUSTOMER_DETAILS_QUERY } from '~/graphql/customer-account/CustomerDetailsQuery';
import type { CustomerFragment } from 'customer-accountapi.generated';
import { MembershipPerks } from '~/components/MembershipPerks';
import { MembershipQuestionnaire } from '~/components/MembershipQuestionnaire';
import { MembershipHero } from '~/components/MembershipHero';

type MembershipCustomer = CustomerFragment & {
    emailAddress?: {
        emailAddress: string;
    };
};

export const meta: Route.MetaFunction = () => {
    return [{ title: 'Membership | Vice Golf' }];
};

export async function loader({ context }: Route.LoaderArgs) {
    const { customerAccount } = context;
    const isLoggedIn = await customerAccount.isLoggedIn();

    let customer: MembershipCustomer | null = null;
    if (isLoggedIn) {
        const { data } = await customerAccount.query(CUSTOMER_DETAILS_QUERY);
        customer = data?.customer;
    }

    return { customer, isLoggedIn };
}

export default function MembershipPage() {
    const { customer, isLoggedIn } = useLoaderData<{ customer: MembershipCustomer | null; isLoggedIn: boolean }>();

    return (
        <div className="membership-page w-full bg-white">
            {/* Hero Section */}
            <MembershipHero />

            {/* Intro Section */}
            <section className="w-full bg-white py-16 md:py-20">
                <div className="max-w-4xl mx-auto px-6 md:px-8 text-center">
                    <p className="!text-[20px] !leading-[36px] !mb-12">
                        The more you play with Vice, the more Vice gives back. Your membership status is based on purchase frequency and total spend, unlocking exclusive discounts as you move up the tiers. No sign-up fees. No gimmicks. Just rewards that hit harder every time you return.
                    </p>
                    <h2
                        className="text-center font-extrabold tracking-tight leading-none mb-6 text-black"
                        style={{ fontSize: '40px' }}
                    >
                        Earn it. Own it. Embrace your Vice.
                    </h2>
                </div>
            </section>

            {/* Membership Perks Section */}
            <MembershipPerks />

            {/* Questionnaire Section */}
            <MembershipQuestionnaire customer={customer} isLoggedIn={isLoggedIn} />
        </div>
    );
}
