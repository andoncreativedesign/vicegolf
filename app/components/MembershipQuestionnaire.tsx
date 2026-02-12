import React, { useState } from 'react';
import { useFetcher, useNavigate } from 'react-router';
import { CheckCircle2Icon } from 'lucide-react';
import { PhoneInputField } from '~/components/basic/PhoneInputField';
import { format, getDaysInMonth } from 'date-fns';

interface MembershipQuestionnaireProps {
    customer: any;
    isLoggedIn: boolean;
}

export function MembershipQuestionnaire({ customer, isLoggedIn }: MembershipQuestionnaireProps) {
    const fetcher = useFetcher();
    const navigate = useNavigate();
    const isSubmitting = fetcher.state !== 'idle';
    const [phone, setPhone] = useState(customer?.phoneNumber?.phoneNumber || '');

    const [birthDay, setBirthDay] = useState('');
    const [birthMonth, setBirthMonth] = useState('');
    const [birthYear, setBirthYear] = useState('');

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
    const months = Array.from({ length: 12 }, (_, i) => ({
        value: String(i + 1).padStart(2, '0'),
        label: format(new Date(2024, i, 1), 'MMMM')
    }));

    const daysInMonth = (birthMonth && birthYear)
        ? getDaysInMonth(new Date(parseInt(birthYear), parseInt(birthMonth) - 1))
        : 31;
    const days = Array.from({ length: daysInMonth }, (_, i) => String(i + 1).padStart(2, '0'));

    const birthdayValue = (birthYear && birthMonth && birthDay)
        ? `${birthYear}-${birthMonth}-${birthDay}`
        : '';

    const hasRequested = customer?.tags?.includes('membership_requested') || fetcher.data?.success;

    return (
        <section id="apply-form" className="py-24 bg-[#f5f5f5]">
            <div className="mx-auto max-w-[1300px] px-6 text-center">
                {hasRequested ? (
                    <div className="bg-[#fafafa] border border-[#E5E5E5] max-w-7xl p-12 flex flex-col items-center">
                        <CheckCircle2Icon className="w-16 h-16 text-black mb-6" />
                        <h2 className="text-3xl font-bold uppercase tracking-tighter mb-4">Application Received</h2>
                        <p className="text-gray-600 text-lg mb-12">
                            Thank you for applying. We've received your application and will be in touch shortly.
                        </p>
                        <button
                            onClick={() => navigate('/account')}
                            className="mt-4 bg-black text-white px-24 py-5 font-bold uppercase tracking-widest hover:bg-gray-800 transition-all min-w-[280px]"
                        >
                            Go to Profile
                        </button>
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
                                                style={{ width: '100%', border: 'none', height: '50px', borderRadius: '6px' }}
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
                                                style={{ width: '100%', border: 'none', height: '50px', borderRadius: '6px' }}
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
                                                        background: transparent !important;
                                                        display: flex !important;
                                                    }
                                                    .membership-phone-wrapper .country-dropdown-container {
                                                        height: 50px !important;
                                                        display: flex !important;
                                                        flex-shrink: 0 !important;
                                                    }
                                                    .membership-phone-wrapper .country-dropdown-button {
                                                        height: 50px !important;
                                                        min-height: 50px !important;
                                                        background: #fafafa !important;
                                                        border-radius: 6px !important;
                                                        width: 80px !important;
                                                        display: flex !important;
                                                        align-items: center !important;
                                                        justify-content: center !important;
                                                        padding: 0 !important;
                                                        border: none !important;
                                                        outline: none !important;
                                                    }
                                                    .membership-phone-wrapper .PhoneInputInput {
                                                        height: 50px !important;
                                                        min-height: 50px !important;
                                                        background: #fafafa !important;
                                                        border-radius: 6px !important;
                                                        padding: 0 1.25rem !important;
                                                        font-size: 16px !important;
                                                        line-height: 50px !important;
                                                        flex: 1 !important;
                                                        color: black !important;
                                                        border: none !important;
                                                        outline: none !important;
                                                        display: block !important;
                                                        margin: 0 !important;
                                                    }
                                                    .membership-phone-wrapper .PhoneInputInput::placeholder {
                                                        color: #6b7280 !important;
                                                    }
                                                    .membership-phone-wrapper .PhoneInputInput:focus {
                                                        box-shadow: 0 0 0 1px black !important;
                                                        background: #fafafa !important;
                                                        border: none !important;
                                                        outline: none !important;
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
                                                className="w-full block py-4 px-5 focus:outline-none focus:ring-1 focus:ring-black transition-all"
                                                style={{ width: '100%', border: 'none', height: '50px', background: '#fafafa', color: 'black', borderRadius: '6px' }}
                                            />
                                        </div>

                                        {/* Row 3 */}
                                        <div className="flex flex-col gap-3 w-full">
                                            <label htmlFor="birthday" className="text-[16px] leading-[28px] text-gray-600">Birthday</label>
                                            <div className="grid grid-cols-3 gap-3">
                                                <select
                                                    value={birthMonth}
                                                    onChange={(e) => setBirthMonth(e.target.value)}
                                                    required
                                                    className="w-full block bg-[#fafafa] border-none py-3 px-4 focus:outline-none focus:ring-1 focus:ring-black transition-all appearance-none"
                                                    style={{ border: 'none', height: '50px', borderRadius: '6px', cursor: 'pointer' }}
                                                >
                                                    <option value="">Month</option>
                                                    {months.map((m) => (
                                                        <option key={m.value} value={m.value}>{m.label}</option>
                                                    ))}
                                                </select>
                                                <select
                                                    value={birthDay}
                                                    onChange={(e) => setBirthDay(e.target.value)}
                                                    required
                                                    className="w-full block bg-[#fafafa] border-none py-3 px-4 focus:outline-none focus:ring-1 focus:ring-black transition-all appearance-none"
                                                    style={{ border: 'none', height: '50px', borderRadius: '6px', cursor: 'pointer' }}
                                                >
                                                    <option value="">Day</option>
                                                    {days.map((d) => (
                                                        <option key={d} value={d}>{d}</option>
                                                    ))}
                                                </select>
                                                <select
                                                    value={birthYear}
                                                    onChange={(e) => setBirthYear(e.target.value)}
                                                    required
                                                    className="w-full block bg-[#fafafa] border-none py-3 px-4 focus:outline-none focus:ring-1 focus:ring-black transition-all appearance-none"
                                                    style={{ border: 'none', height: '50px', borderRadius: '6px', cursor: 'pointer' }}
                                                >
                                                    <option value="">Year</option>
                                                    {years.map((y) => (
                                                        <option key={y} value={y}>{y}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <input type="hidden" name="birthday" value={birthdayValue} />
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
                                                style={{ width: '100%', border: 'none', height: '50px', borderRadius: '6px' }}
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
                                                style={{ width: '100%', border: 'none', height: '50px', borderRadius: '6px' }}
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
                                                style={{ width: '100%', border: 'none', height: '50px', borderRadius: '6px' }}
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
