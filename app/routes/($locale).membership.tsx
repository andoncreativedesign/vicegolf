import { useLoaderData, useNavigate } from 'react-router';
import type { Route } from './+types/membership';
import { CUSTOMER_DETAILS_QUERY } from '~/graphql/customer-account/CustomerDetailsQuery';
import type { CustomerFragment } from 'customer-accountapi.generated';
import { MembershipPerks } from '~/components/MembershipPerks';
import { MembershipQuestionnaire } from '~/components/MembershipQuestionnaire';
import { MembershipHero } from '~/components/MembershipHero';
import { MembershipIntro } from '~/components/MembershipIntro';

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
            <MembershipIntro />

            {/* Membership Perks Section */}
            <MembershipPerks />

            {/* Questionnaire Section */}
            <MembershipQuestionnaire customer={customer} isLoggedIn={isLoggedIn} />
        </div>
    );
}
