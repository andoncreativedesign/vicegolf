import { XIcon } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useFetcher } from 'react-router';
import type { CustomerFragment } from 'storefrontapi.generated';

interface MembershipRequestModalProps {
    isOpen: boolean;
    onClose: () => void;
    customer: CustomerFragment;
}

export function MembershipRequestModal({ isOpen, onClose, customer }: MembershipRequestModalProps) {
    const fetcher = useFetcher();
    const formRef = useRef<HTMLFormElement>(null);
    const isSubmitting = fetcher.state !== 'idle';
    const isSuccess = fetcher.data?.success;

    // Close on success
    useEffect(() => {
        if (isSuccess) {
            onClose();
        }
    }, [isSuccess, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl animate-fade-in relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <XIcon className="w-5 h-5 text-gray-500" />
                </button>

                <div className="p-8">
                    <div className="mb-6 text-center">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">JOIN US</h2>
                        <p className="text-gray-500 text-sm">To apply for your status, please complete the form below:</p>
                    </div>

                    <fetcher.Form method="post" action="/account/membership" ref={formRef} className="space-y-4">
                        <input type="hidden" name="customerId" value={customer.id} />

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="firstName" className="block text-xs font-bold uppercase text-gray-500 mb-1">First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    id="firstName"
                                    defaultValue={customer.firstName || ''}
                                    required
                                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-1 focus:ring-black focus:border-black transition-colors"
                                />
                            </div>
                            <div>
                                <label htmlFor="lastName" className="block text-xs font-bold uppercase text-gray-500 mb-1">Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    id="lastName"
                                    defaultValue={customer.lastName || ''}
                                    required
                                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-1 focus:ring-black focus:border-black transition-colors"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="email" className="block text-xs font-bold uppercase text-gray-500 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    defaultValue={customer.email || ''}
                                    required
                                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-1 focus:ring-black focus:border-black transition-colors"
                                />
                            </div>
                            <div>
                                <label htmlFor="phone" className="block text-xs font-bold uppercase text-gray-500 mb-1">Phone Number</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    id="phone"
                                    defaultValue={customer.numberOfOrders > 0 ? '' : ''} // Default empty for phone usually
                                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-1 focus:ring-black focus:border-black transition-colors"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="birthday" className="block text-xs font-bold uppercase text-gray-500 mb-1">Birthday</label>
                            <input
                                type="date"
                                name="birthday"
                                id="birthday"
                                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-1 focus:ring-black focus:border-black transition-colors"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-xs font-bold uppercase text-gray-500">Are you part of a golfing society?</label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="golfSociety" value="yes" className="accent-black" />
                                    <span className="text-sm">Yes</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="golfSociety" value="no" defaultChecked className="accent-black" />
                                    <span className="text-sm">No</span>
                                </label>
                            </div>
                            <input
                                type="text"
                                name="golfSocietyName"
                                placeholder="If yes, please specify"
                                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 mt-2 text-sm focus:ring-1 focus:ring-black focus:border-black transition-colors"
                            />
                        </div>

                        <div>
                            <label htmlFor="frequency" className="block text-xs font-bold uppercase text-gray-500 mb-1">How frequently do you play golf?</label>
                            <select
                                name="frequency"
                                id="frequency"
                                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-white focus:ring-1 focus:ring-black focus:border-black transition-colors"
                            >
                                <option value="">Select frequency</option>
                                <option value="Weekly">Weekly</option>
                                <option value="Monthly">Monthly</option>
                                <option value="Occasionally">Occasionally</option>
                                <option value="Rarely">Rarely</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-xs font-bold uppercase text-gray-500">Are you left handed or right handed?</label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="handedness" value="Right Handed" defaultChecked className="accent-black" />
                                    <span className="text-sm">Right Handed</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="handedness" value="Left Handed" className="accent-black" />
                                    <span className="text-sm">Left Handed</span>
                                </label>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="currentBall" className="block text-xs font-bold uppercase text-gray-500 mb-1">What ball do you currently use?</label>
                            <input
                                type="text"
                                name="currentBall"
                                id="currentBall"
                                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-1 focus:ring-black focus:border-black transition-colors"
                            />
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-black text-white py-3.5 rounded-full font-bold uppercase tracking-wider text-sm hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit Request'}
                            </button>
                        </div>
                    </fetcher.Form>
                </div>
            </div>
        </div>
    );
}
