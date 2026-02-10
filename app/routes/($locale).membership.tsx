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
            <section className="relative h-[600px] w-full bg-black overflow-hidden">
                <img
                    src="https://cdn.shopify.com/s/files/1/0852/4351/1097/files/membership-hero.jpg?v=1738920000"
                    alt="Vice Golf Membership"
                    className="w-full h-full object-cover opacity-70"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                    <h1 className="text-white text-5xl md:text-7xl font-extrabold uppercase tracking-tighter mb-4 leading-none">
                        Built for performance.<br />Trusted on the course.
                    </h1>
                </div>
            </section>

            {/* Membership Perks Section */}
            <MembershipPerks />

            {/* Questionnaire Section */}
            <MembershipQuestionnaire customer={customer} isLoggedIn={isLoggedIn} />
        </div>
    );
}
