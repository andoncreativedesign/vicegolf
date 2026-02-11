import React, { useState } from 'react';
import { useFetcher, useNavigate } from 'react-router';
import { CheckCircle2Icon } from 'lucide-react';
import { PhoneInputField } from '~/components/basic/PhoneInputField';

interface MembershipQuestionnaireProps {
    customer: any;
    isLoggedIn: boolean;
}

export function MembershipQuestionnaire({ customer, isLoggedIn }: MembershipQuestionnaireProps) {
    const fetcher = useFetcher();
    const navigate = useNavigate();
    const isSubmitting = fetcher.state !== 'idle';
    const [phone, setPhone] = useState(customer?.phoneNumber?.phoneNumber || '');

    const hasRequested = customer?.tags?.includes('membership_requested') || fetcher.data?.success;

    return (
        <section id="apply-form" className="py-24 bg-[#f5f5f5]">
            <div className="mx-auto max-w-[1300px] px-6 text-center">
                {hasRequested ? (
                    <div className="bg-[#fafafa] border border-[#E5E5E5] max-w-7xl p-12 flex flex-col items-center">
                        <CheckCircle2Icon className="w-16 h-16 text-black mb-6" />
                        <h2 className="text-3xl font-bold uppercase tracking-tighter mb-4">Application Received</h2>
                        <p className="text-gray-600 text-lg">
                            Thank you for applying. We've received your application and will be in touch shortly.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="mb-20 text-center">
                            <h2
                                className="text-center font-extrabold tracking-tight leading-none mb-4"
                                style={{ fontSize: '40px' }}
                            >
                                Join Us
                            </h2>
                        </div>

                        {!isLoggedIn ? (
                            <div className="bg-white border border-[#E5E5E5] max-w-2xl mx-auto p-12 text-center">
                                <p className="mb-8 text-[18px] font-medium text-gray-700">Please sign in to your account to apply for membership status.</p>
                                <button
                                    onClick={() => navigate('/account/login')}
                                    className="bg-black text-white px-12 py-4 font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors"
                                >
                                    Sign In
                                </button>
                            </div>
                        ) : (
                            <div className="w-full">
                                <fetcher.Form
                                    method="post"
                                    action="/account/membership"
                                    className="w-full space-y-12"
                                    style={{ maxWidth: 'none' }}
                                >
                                    <input type="hidden" name="customerId" value={customer?.id} />

                                    <p className="text-[16px] leading-[28px] text-gray-600 text-left" style={{ marginBottom: '2.5rem' }}>To apply for your status, please complete the form below:</p>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-10 w-full text-left">
                                        {/* Row 1 */}
                                        <div className="flex flex-col gap-3 w-full">
                                            <label htmlFor="firstName" className="text-[16px] leading-[28px] text-gray-600">First name</label>
                                            <input
                                                type="text"
                                                name="firstName"
                                                id="firstName"
                                                defaultValue={customer?.firstName || ''}
                                                required
                                                className="w-full block bg-[#fafafa] border-none py-4 px-5 focus:outline-none focus:ring-1 focus:ring-black transition-all"
                                                style={{ width: '100%', border: 'none', height: '50px' }}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-3 w-full">
                                            <label htmlFor="lastName" className="text-[16px] leading-[28px] text-gray-600">Second name</label>
                                            <input
                                                type="text"
                                                name="lastName"
                                                id="lastName"
                                                defaultValue={customer?.lastName || ''}
                                                required
                                                className="w-full block bg-[#fafafa] border-none py-4 px-5 focus:outline-none focus:ring-1 focus:ring-black transition-all"
                                                style={{ width: '100%', border: 'none', height: '50px' }}
                                            />
                                        </div>

                                        {/* Row 2 */}
                                        <div className="flex flex-col gap-3 w-full">
                                            <label htmlFor="phone" className="text-[16px] leading-[28px] text-gray-600">Phone No</label>
                                            <div className="membership-phone-wrapper">
                                                <style dangerouslySetInnerHTML={{
                                                    __html: `
                                                    .membership-phone-wrapper > div {
                                                        margin-top: 0 !important;
                                                        padding: 0 !important;
                                                    }
                                                    .membership-phone-wrapper .flex.flex-col {
                                                        gap: 0 !important;
                                                        margin: 0 !important;
                                                        padding: 0 !important;
                                                    }
                                                    .membership-phone-wrapper .flex.flex-col > * + * {
                                                        margin-top: 0 !important;
                                                    }
                                                    .membership-phone-wrapper label {
                                                        display: none !important;
                                                    }
                                                    .membership-phone-wrapper .PhoneInputCustom {
                                                        gap: 8px !important;
                                                        height: 50px !important;
                                                        align-items: stretch !important;
                                                        border-radius: 0 !important;
                                                    }
                                                    .membership-phone-wrapper .country-dropdown-button {
                                                        height: 50px !important;
                                                        background: #fafafa !important;
                                                        border-radius: 0 !important;
                                                        width: 80px !important;
                                                        display: flex !important;
                                                        align-items: center !important;
                                                        justify-content: center !important;
                                                        padding: 0 !important;
                                                    }
                                                    .membership-phone-wrapper .PhoneInputInput {
                                                        height: 50px !important;
                                                        background: #fafafa !important;
                                                        border-radius: 0 !important;
                                                        padding: 1rem 1.25rem !important;
                                                        font-size: 16px !important;
                                                        line-height: normal !important;
                                                        flex: 1 !important;
                                                    }
                                                    .membership-phone-wrapper .PhoneInputInput:focus {
                                                        box-shadow: 0 0 0 1px black !important;
                                                        background: #fafafa !important;
                                                    }
                                                `}} />
                                                <PhoneInputField
                                                    label=""
                                                    value={phone}
                                                    onChange={(val) => setPhone(val || '')}
                                                    placeholder="Enter phone number"
                                                    hasBorder={false}
                                                />
                                                <input type="hidden" name="phone" value={phone} />
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-3 w-full">
                                            <label htmlFor="email" className="text-[16px] leading-[28px] text-gray-600">Email</label>
                                            <input
                                                type="email"
                                                name="email"
                                                id="email"
                                                defaultValue={customer?.emailAddress?.emailAddress || ''}
                                                required
                                                className="w-full block bg-[#fafafa] border-none py-4 px-5 focus:outline-none focus:ring-1 focus:ring-black transition-all"
                                                style={{ width: '100%', border: 'none', height: '50px' }}
                                            />
                                        </div>

                                        {/* Row 3 */}
                                        <div className="flex flex-col gap-3 w-full">
                                            <label htmlFor="birthday" className="text-[16px] leading-[28px] text-gray-600">Birthday</label>
                                            <input
                                                type="date"
                                                name="birthday"
                                                id="birthday"
                                                className="w-full block bg-[#fafafa] border-none py-4 px-5 focus:outline-none focus:ring-1 focus:ring-black transition-all"
                                                style={{ width: '100%', border: 'none', height: '50px' }}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-3 w-full">
                                            <label htmlFor="golfSocietyName" className="text-[16px] leading-[28px] text-gray-600">
                                                Are you part of a golfing society? If yes, please specify
                                            </label>
                                            <input
                                                type="text"
                                                name="golfSocietyName"
                                                id="golfSocietyName"
                                                className="w-full block bg-[#fafafa] border-none py-4 px-5 focus:outline-none focus:ring-1 focus:ring-black transition-all"
                                                style={{ width: '100%', border: 'none', height: '50px' }}
                                            />
                                        </div>

                                        {/* Row 4 */}
                                        <div className="flex flex-col gap-3 w-full">
                                            <label htmlFor="handedness" className="text-[16px] leading-[28px] text-gray-600">
                                                Are you left handed or right handed?
                                            </label>
                                            <select
                                                name="handedness"
                                                id="handedness"
                                                className="w-full block bg-[#fafafa] border-none py-4 px-5 focus:outline-none focus:ring-1 focus:ring-black transition-all appearance-none"
                                                style={{ width: '100%', border: 'none', height: '50px' }}
                                            >
                                                <option value="Right Handed">Right Handed</option>
                                                <option value="Left Handed">Left Handed</option>
                                            </select>
                                        </div>
                                        <div className="flex flex-col gap-3 w-full">
                                            <label htmlFor="currentBall" className="text-[16px] leading-[28px] text-gray-600">
                                                What ball do you currently use?
                                            </label>
                                            <input
                                                type="text"
                                                name="currentBall"
                                                id="currentBall"
                                                className="w-full block bg-[#fafafa] border-none py-4 px-5 focus:outline-none focus:ring-1 focus:ring-black transition-all"
                                                style={{ width: '100%', border: 'none', height: '50px' }}
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-12 flex justify-center w-full">
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="bg-black text-white px-24 py-5 font-bold uppercase tracking-widest hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed min-w-[280px]"
                                        >
                                            {isSubmitting ? 'Processing...' : 'Apply'}
                                        </button>
                                    </div>
                                </fetcher.Form>
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    );
}
