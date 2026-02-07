import { useLoaderData, useFetcher, useNavigate } from 'react-router';
import type { Route } from './+types/membership';
import { CUSTOMER_DETAILS_QUERY } from '~/graphql/customer-account/CustomerDetailsQuery';
import type { CustomerFragment } from 'customer-accountapi.generated';
import { CheckCircle2Icon } from 'lucide-react';

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
    const fetcher = useFetcher();
    const navigate = useNavigate();
    const isSubmitting = fetcher.state !== 'idle';
    const isSuccess = fetcher.data?.success;

    const perks = [
        {
            title: 'VICE CREW',
            image: 'https://cdn.shopify.com/s/files/1/0852/4351/1097/files/crew_logo.png?v=1738920000', // Placeholder or use dynamic ones
            subtitle: "Welcome to the club. Let's get you rolling.",
            benefits: ['5% off all purchases'],
        },
        {
            title: 'VICE SQUAD',
            image: 'https://cdn.shopify.com/s/files/1/0852/4351/1097/files/squad_logo.png?v=1738920000',
            subtitle: "You're a regular. Perks unlocked.",
            benefits: [
                '10% off all purchases',
                'Early access to selected launches',
                'Priority restock alerts',
            ],
        },
        {
            title: 'VICE LEGENDS',
            image: 'https://cdn.shopify.com/s/files/1/0852/4351/1097/files/legend_logo.png?v=1738920000',
            subtitle: 'The ultimate status for dedicated golfers.',
            benefits: [
                '15% off all purchases',
                'Early access to all launches',
                'Exclusive events invitation',
                'Personalized customer support',
            ],
        },
    ];

    if (isSuccess) {
        return (
            <div className="min-h-screen py-24 flex items-center justify-center bg-white px-4">
                <div className="max-w-md w-full text-center space-y-6">
                    <div className="flex justify-center">
                        <CheckCircle2Icon className="w-20 h-20 text-black" />
                    </div>
                    <h1 className="text-4xl font-bold uppercase tracking-tighter">Application Received</h1>
                    <p className="text-gray-600">
                        Thank you for applying. Our team will review your application and update your status shortly.
                    </p>
                    <button
                        onClick={() => navigate('/account/membership')}
                        className="inline-block bg-black text-white px-8 py-4 font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors"
                    >
                        Go to My Account
                    </button>
                </div>
            </div>
        );
    }

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

            {/* Intro Text */}
            <section className="py-20 px-4 max-w-4xl mx-auto text-center space-y-8">
                <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                    The more you play, the more you shop, the more you save. Your membership status is based on your purchase frequency and total spend, which gets you closer to the elite tiers as you go. Just remember to shop every year to maintain your status.
                </p>
                <h2 className="text-4xl md:text-6xl font-extrabold uppercase tracking-tighter italic">
                    Earn it. Own it. Embrace your Vice.
                </h2>
            </section>

            {/* Perks Section */}
            <section className="py-24 bg-white px-4 border-y border-gray-100">
                <div className="max-w-7xl mx-auto">
                    <h3 className="text-3xl font-extrabold uppercase tracking-widest text-center mb-16">
                        Our Membership Perks
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
                        {perks.map((perk) => (
                            <div key={perk.title} className="flex flex-col items-center text-center group">
                                <div className="h-24 flex items-center justify-center mb-8 grayscale group-hover:grayscale-0 transition-all duration-500">
                                    {/* Logo Placeholder */}
                                    <div className="flex flex-col items-center">
                                        <img src="/vice_logo.svg" alt="Vice Golf" className="h-10 w-auto mb-2" />
                                        <span className="text-xl font-bold tracking-[0.2em] italic uppercase">{perk.title.split(' ')[1]}</span>
                                    </div>
                                </div>
                                <h4 className="font-bold text-lg mb-6 max-w-[250px]">{perk.subtitle}</h4>
                                <div className="space-y-3">
                                    <p className="text-sm font-bold uppercase tracking-widest mb-4">Benefits</p>
                                    <ul className="space-y-2 text-gray-600">
                                        {perk.benefits.map((benefit, idx) => (
                                            <li key={idx} className="flex items-center justify-center gap-2">
                                                <span className="w-1.5 h-1.5 bg-black rounded-full" />
                                                {benefit}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Form Section */}
            <section id="apply-form" className="py-24 px-4 bg-[#F9F9F9]">
                <div className="max-w-2xl mx-auto bg-white p-8 md:p-16 shadow-2xl border border-gray-100">
                    <div className="mb-10 text-center">
                        <h2 className="text-4xl font-extrabold uppercase tracking-tighter mb-4 leading-none">Join Us</h2>
                        <p className="text-gray-500 font-medium">To apply for your status, please complete the form below:</p>
                    </div>

                    {!isLoggedIn ? (
                        <div className="text-center py-8">
                            <p className="mb-6 text-gray-600">Please sign in to your account to apply for membership status.</p>
                            <button
                                onClick={() => navigate('/account/login')}
                                className="bg-black text-white px-12 py-4 font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors"
                            >
                                Sign In
                            </button>
                        </div>
                    ) : (
                        <fetcher.Form method="post" action="/account/membership" className="space-y-6">
                            <input type="hidden" name="customerId" value={customer?.id} />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="firstName" className="text-xs font-bold uppercase tracking-widest text-gray-400">First Name</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        id="firstName"
                                        defaultValue={customer?.firstName || ''}
                                        required
                                        className="border-b-2 border-gray-200 py-3 focus:outline-none focus:border-black transition-colors"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="lastName" className="text-xs font-bold uppercase tracking-widest text-gray-400">Last Name</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        id="lastName"
                                        defaultValue={customer?.lastName || ''}
                                        required
                                        className="border-b-2 border-gray-200 py-3 focus:outline-none focus:border-black transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-gray-400">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        defaultValue={customer?.emailAddress?.emailAddress || ''}
                                        required
                                        className="border-b-2 border-gray-200 py-3 focus:outline-none focus:border-black transition-colors"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="phone" className="text-xs font-bold uppercase tracking-widest text-gray-400">Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        id="phone"
                                        className="border-b-2 border-gray-200 py-3 focus:outline-none focus:border-black transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label htmlFor="birthday" className="text-xs font-bold uppercase tracking-widest text-gray-400">Birthday</label>
                                <input
                                    type="date"
                                    name="birthday"
                                    id="birthday"
                                    className="border-b-2 border-gray-200 py-3 focus:outline-none focus:border-black transition-colors"
                                />
                            </div>

                            <div className="space-y-4">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Are you part of a golfing society?</label>
                                <div className="flex gap-8">
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <input type="radio" name="golfSociety" value="yes" className="w-4 h-4 accent-black" />
                                        <span className="text-sm font-bold uppercase">Yes</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <input type="radio" name="golfSociety" value="no" defaultChecked className="w-4 h-4 accent-black" />
                                        <span className="text-sm font-bold uppercase">No</span>
                                    </label>
                                </div>
                                <input
                                    type="text"
                                    name="golfSocietyName"
                                    placeholder="If yes, please specify"
                                    className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-black transition-colors"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label htmlFor="frequency" className="text-xs font-bold uppercase tracking-widest text-gray-400">How frequently do you play golf?</label>
                                <select
                                    name="frequency"
                                    id="frequency"
                                    className="border-b-2 border-gray-200 py-3 bg-transparent focus:outline-none focus:border-black transition-colors appearance-none"
                                >
                                    <option value="">Select frequency</option>
                                    <option value="Weekly">Weekly</option>
                                    <option value="Monthly">Monthly</option>
                                    <option value="Occasionally">Occasionally</option>
                                    <option value="Rarely">Rarely</option>
                                </select>
                            </div>

                            <div className="space-y-4">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Are you left handed or right handed?</label>
                                <div className="flex gap-8">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" name="handedness" value="Right Handed" defaultChecked className="w-4 h-4 accent-black" />
                                        <span className="text-sm font-bold uppercase">Right Handed</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" name="handedness" value="Left Handed" className="w-4 h-4 accent-black" />
                                        <span className="text-sm font-bold uppercase">Left Handed</span>
                                    </label>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label htmlFor="currentBall" className="text-xs font-bold uppercase tracking-widest text-gray-400">What ball do you currently use?</label>
                                <input
                                    type="text"
                                    name="currentBall"
                                    id="currentBall"
                                    className="border-b-2 border-gray-200 py-3 focus:outline-none focus:border-black transition-colors"
                                />
                            </div>

                            <div className="pt-8">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-black text-white py-5 font-extrabold uppercase tracking-[0.2em] hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98]"
                                >
                                    {isSubmitting ? 'Processing Application...' : 'Join Now'}
                                </button>
                            </div>
                        </fetcher.Form>
                    )}
                </div>
            </section>
        </div>
    );
}
