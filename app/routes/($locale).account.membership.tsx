import { data as remixData, useLoaderData, useFetcher, useOutletContext, useNavigate, Link } from 'react-router';
import type { CustomerFragment } from 'customer-accountapi.generated';
import { TicketPercentIcon, CheckCircle2Icon, Loader2Icon, CheckIcon } from 'lucide-react';
import { axiosShopifyAdmin } from '~/utils/axiosInsatances';
import type { Route } from './+types/account.membership';
import { useState } from 'react';

type TaggedCustomer = CustomerFragment & {
    tags?: string[];
};

export const meta: Route.MetaFunction = () => {
    return [{ title: 'Vice Status' }];
};

export async function loader({ context }: Route.LoaderArgs) {
    const { customerAccount } = context;
    const isLoggedIn = await customerAccount.isLoggedIn();

    if (!isLoggedIn) {
        throw new Error('Unauthorized');
    }

    return {};
}

export async function action({ request, context }: Route.ActionArgs) {
    const { customerAccount } = context;
    const isLoggedIn = await customerAccount.isLoggedIn();

    if (!isLoggedIn) {
        return remixData({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const customerId = formData.get('customerId') as string;

    if (!customerId) {
        return remixData({ error: 'Missing information' }, { status: 400 });
    }

    try {
        const adminId = customerId.replace('CustomerAccountCustomer', 'Customer');
        const tag = 'membership_requested';

        // Extract Questionnaire Data
        // Extract Questionnaire Data
        const firstName = formData.get('firstName');
        const lastName = formData.get('lastName');
        const email = formData.get('email');
        const phone = formData.get('phone');
        const birthday = formData.get('birthday');
        const golfSocietyName = formData.get('golfSocietyName');
        const handedness = formData.get('handedness');
        const currentBall = formData.get('currentBall');

        // Construct Note
        const note = `MEMBERSHIP APPLICATION DETAILS:
- Name: ${firstName} ${lastName}
- Email: ${email}
- Phone: ${phone || 'N/A'}
- Birthday: ${birthday || 'N/A'}
- Golf Society: ${golfSocietyName || 'No'}
- Handedness: ${handedness}
- Current Ball: ${currentBall || 'N/A'}
`;

        // 1. Update Customer Note
        const noteUpdateMutation = `#graphql
            mutation customerUpdate($input: CustomerInput!) {
                customerUpdate(input: $input) {
                    userErrors {
                        field
                        message
                    }
                }
            }
        `;

        await axiosShopifyAdmin.post("", {
            query: noteUpdateMutation,
            variables: {
                input: {
                    id: adminId,
                    note: note
                }
            }
        });

        // 2. Add Tag
        const tagsAddMutation = `#graphql
      mutation tagsAdd($id: ID!, $tags: [String!]!) {
        tagsAdd(id: $id, tags: $tags) {
          userErrors {
            field
            message
          }
          node {
            id
          }
        }
      }
    `;

        const response = await axiosShopifyAdmin.post("", {
            query: tagsAddMutation,
            variables: {
                id: adminId,
                tags: [tag],
            },
        });

        const responseJson = response.data;
        if (responseJson.errors) {
            console.error('GraphQL Mutation Errors:', responseJson.errors);
            return remixData({ error: 'Failed to request membership' }, { status: 400 });
        }

        if (responseJson.data?.tagsAdd?.userErrors?.length > 0) {
            return remixData({ error: responseJson.data.tagsAdd.userErrors[0].message }, { status: 400 });
        }

        return remixData({ success: true });
    } catch (error) {
        console.error('Action error:', error);
        return remixData({ error: 'Internal server error' }, { status: 500 });
    }
}

export default function MembershipTab() {
    const { customer } = useOutletContext<{ customer: TaggedCustomer }>();
    const navigate = useNavigate();
    const fetcher = useFetcher();

    const customerTags = customer?.tags || [];

    const segments = [
        {
            id: 'vice_crew',
            label: 'VICE CREW',
            subtitle: "Welcome to the club. Let's get you rolling.",
            benefits: ['5% off all purchases']
        },
        {
            id: 'vice_squad',
            label: 'VICE SQUAD',
            subtitle: "You're a regular. Perks unlocked.",
            benefits: [
                '10% off all purchases',
                'Early access to selected launches',
                'Priority restock alerts'
            ]
        },
        {
            id: 'vice_legends',
            label: 'VICE LEGENDS',
            subtitle: "Welcome to the club. Let's get you rolling.",
            benefits: [
                '15% off all purchases',
                'Early access to all launches',
                'Exclusive events invitation',
                'Personalized customer support'
            ]
        },
    ];

    const currentSegment = segments.find(s => customerTags.includes(s.id));
    const isRequested = customerTags.includes('membership_requested') || fetcher.data?.success;

    // 1. Accepted State UI
    if (currentSegment) {
        // Determine which logo to use based on segment
        const getLogoForSegment = () => {
            switch (currentSegment.id) {
                case 'vice_crew':
                    return '/crew.svg';
                case 'vice_squad':
                    return '/squad.svg';
                case 'vice_legends':
                    return '/legend.svg';
                default:
                    return '/vice_logo.svg';
            }
        };

        return (
            <div className="account-membership w-full">
                <div className="bg-[#F5F5F5] p-12 w-full min-h-[400px] flex flex-col items-start justify-center">
                    <div className="mb-8">
                        {/* Logo representation matching the design */}
                        <div className="mb-10">
                            <img src={getLogoForSegment()} alt="Vice Golf" className="w-auto h-40 mb-16" />
                        </div>
                        <h3 className="text-xl font-medium text-gray-900 mb-2">{currentSegment.subtitle}</h3>
                        <ul className="space-y-4">
                            {currentSegment.benefits.map((benefit, idx) => (
                                <li key={idx} className="flex items-center gap-3 text-gray-700">
                                    <div className="w-1.5 h-1.5 bg-black rounded-full" />
                                    <span>{benefit}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        );
    }

    // 2. Not Applied / Pending State UI
    return (
        <div className="account-membership w-full">
            <div className="bg-[#F5F5F5] p-16 w-full min-h-[400px] flex flex-col items-start">
                {isRequested ? (
                    <div className="space-y-6 mt-10">
                        <div className="flex items-center gap-3">
                            <CheckCircle2Icon className="w-10 h-10 text-black" />
                            <h2 className="text-3xl font-bold uppercase tracking-tighter">Application Pending</h2>
                        </div>
                        <p className="text-gray-600 text-lg max-w-md italic">
                            We've received your application. Our team is currently reviewing it. We'll update your status once you're accepted into a tier.
                        </p>
                        <button
                            onClick={() => window.location.href = '/membership'}
                            className="inline-block mt-35 bg-black  font-bold tracking-widest hover:bg-gray-800 transition-all transform active:scale-95 no-underline text-center"
                            style={{ color: 'white', textDecoration: 'none', width: '200px', height: '50px' }}
                        >
                            View Membership
                        </button>
                    </div>
                ) : (
                    <div className="space-y-12">
                        <div className="space-y-4">
                            <h2 className="text-5xl font-bold text-gray-900 tracking-tighter leading-tight">Apply for Vice status</h2>
                            <p className="text-gray-600 text-xl font-medium">Embrace your Vice and earn rewards</p>
                        </div>

                        <button
                            onClick={() => window.location.href = '/membership'}
                            className="inline-block mt-35 bg-black  font-bold tracking-widest hover:bg-gray-800 transition-all transform active:scale-95 no-underline text-center cursor-pointer"
                            style={{ color: 'white', textDecoration: 'none', width: '150px', height: '50px' }}
                        >
                            Apply
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

