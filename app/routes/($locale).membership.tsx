import { useLoaderData, useNavigate } from 'react-router';
import type { Route } from './+types/membership';
import { CUSTOMER_DETAILS_QUERY } from '~/graphql/customer-account/CustomerDetailsQuery';
import type { CustomerFragment } from 'customer-accountapi.generated';
import { MembershipPerks } from '~/components/MembershipPerks';
import { MembershipQuestionnaire } from '~/components/MembershipQuestionnaire';

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
            <section className="relative h-[600px] w-full overflow-hidden">
                <img
                    src="https://cdn.shopify.com/s/files/1/0645/4253/9870/files/Vice_Banner_No_Text_v2-03_1.png?v=1770707811"
                    alt="Vice Golf Membership"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 z-20 flex px-[clamp(1rem,4vw,3rem)] text-white items-end justify-center md:justify-start pb-12 md:pb-6">
                    <div className="max-w-2xl lg:max-w-4xl xl:max-w-5xl py-10 md:py-14 bg-transparent text-center md:text-left" style={{ width: '90vw', maxWidth: '1200px' }}>
                        <h2
                            className="!text-3xl md:!text-4xl lg:!text-5xl xl:!text-5xl uppercase tracking-tight leading-none mb-1 font-extralight"
                            style={{ color: '#FFFFFF', fontWeight: 200 }}
                        >
                            Built for performance.
                        </h2>
                        <h2
                            className="!text-3xl md:!text-4xl lg:!text-5xl xl:!text-5xl uppercase tracking-tight leading-none mb-1 font-normal"
                            style={{ color: '#c5e517' }}
                        >
                            Trusted on the course.
                        </h2>
                        <p
                            className="!text-base md:!text-lg lg:!text-xl xl:!text-xl font-thin mb-6 leading-tight"
                            style={{ color: '#FFFFFF' }}
                        >
                            Explore our range of precision-engineered golf gear.
                        </p>
                    </div>
                </div>
            </section>

            {/* Membership Perks Section */}
            <MembershipPerks />

            {/* Questionnaire Section */}
            <MembershipQuestionnaire customer={customer} isLoggedIn={isLoggedIn} />
        </div>
    );
}
