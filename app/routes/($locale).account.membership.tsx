import { data as remixData, useLoaderData, useFetcher, useOutletContext } from 'react-router';
import type { CustomerFragment } from 'storefrontapi.generated';
import { TicketPercentIcon, CheckCircle2Icon, Loader2Icon } from 'lucide-react';
import { axiosShopifyAdmin } from '~/utils/axiosInsatances';
import type { Route } from './+types/account.membership';

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
    const { customer } = useOutletContext<{ customer: CustomerFragment }>();
    const fetcher = useFetcher();

    const customerTags = customer?.tags || [];

    const segments = [
        { id: 'vice_crew', label: 'Vice Crew', description: 'Join our exclusive crew for basic perks and community access.' },
        { id: 'vice_squad', label: 'Vice Squad', description: 'Level up to the squad for early access and special discounts.' },
        { id: 'vice_legends', label: 'Vice Legends', description: 'The ultimate status. Premium rewards, invitations, and more.' },
    ];

    const currentSegment = segments.find(s => customerTags.includes(s.id));
    const isRequested = customerTags.includes('membership_requested') || fetcher.data?.success;
    const isSubmitting = fetcher.state !== 'idle';

    return (
        <div className="account-membership w-full">
            <div className="bg-[#F5F5F5] p-10 w-full mb-8">
                <div className="flex items-center gap-3 mb-6">
                    <TicketPercentIcon className="w-8 h-8 text-gray-900" />
                    <h2 className="text-2xl font-bold text-gray-900">Vice Status</h2>
                </div>

                {currentSegment ? (
                    <div className="bg-black text-white p-8 rounded-2xl mb-8 flex items-center justify-between">
                        <div>
                            <p className="text-[#d1fa5a] font-bold uppercase tracking-widest text-sm mb-2">Current Status</p>
                            <h3 className="text-4xl font-bold mb-2">{currentSegment.label}</h3>
                            <p className="text-gray-400 max-w-md">{currentSegment.description}</p>
                        </div>
                        <div className="hidden md:block">
                            <CheckCircle2Icon className="w-20 h-20 text-[#d1fa5a]" />
                        </div>
                    </div>
                ) : (
                    <div className="bg-white p-8 rounded-2xl mb-8 border border-gray-100 shadow-sm text-center">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No Active Membership</h3>
                        <p className="text-gray-500 mb-0">Review the tiers below and request access to join.</p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {segments.map((segment) => {
                        const isCurrent = currentSegment?.id === segment.id;

                        return (
                            <div
                                key={segment.id}
                                className={`bg-white p-6 rounded-2xl border transition-all duration-300 flex flex-col h-full ${isCurrent ? 'border-gray-900 shadow-md ring-1 ring-gray-900' : 'border-gray-100 hover:border-gray-300'
                                    }`}
                            >
                                <div className="mb-4">
                                    <h4 className="text-lg font-bold text-gray-900 mb-2">{segment.label}</h4>
                                    <p className="text-sm text-gray-500 line-clamp-3">{segment.description}</p>
                                </div>

                                <div className="mt-auto pt-4">
                                    {isCurrent && (
                                        <div className="w-full bg-black text-white py-3 rounded-full text-center text-sm font-bold flex items-center justify-center gap-2">
                                            <CheckCircle2Icon className="w-4 h-4 text-[#d1fa5a]" />
                                            Active
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {!currentSegment && (
                    <div className="flex justify-center">
                        {isRequested ? (
                            <div className="w-full max-w-md bg-green-50 text-green-700 py-4 rounded-full text-center text-sm font-bold flex items-center justify-center gap-2 border border-green-100">
                                <CheckCircle2Icon className="w-5 h-5" />
                                Membership Requested
                            </div>
                        ) : (
                            <fetcher.Form method="post" className="w-full max-w-md">
                                <input type="hidden" name="customerId" value={customer.id} />
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-4 rounded-full text-base font-bold transition-all duration-300 flex items-center justify-center gap-2 bg-gray-900 text-white hover:bg-black active:scale-[0.98]"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2Icon className="w-5 h-5 animate-spin" />
                                            Requesting...
                                        </>
                                    ) : (
                                        'Request Membership'
                                    )}
                                </button>
                            </fetcher.Form>
                        )}
                    </div>
                )}

                {currentSegment && (
                    <div className="mt-12 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                        <h4 className="font-bold text-gray-900 mb-2">Want to change your status?</h4>
                        <p className="text-sm text-gray-600 mb-0">
                            Please contact our support team if you would like to upgrade or change your current membership tier.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
