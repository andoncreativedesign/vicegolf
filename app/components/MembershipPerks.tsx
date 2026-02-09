
import React from 'react';

const ViceLogo = ({ className, color }: { className?: string; color: string }) => (
    <svg
        viewBox="0 0 427.54 293"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={{ fill: color }}
    >
        <path d="M422.58,77.46c-47.15-97.64-204.94,16.83-284.73,7.33,3.9-7.33,22.18-45.26,22.47-61.6.55-32.45-35.29-26.32-50.36-9.08-57.67,65.94,10.47,78.85,10.47,78.85-15.64,27.6-86.24,127.08-93.61,122.82-7.36-4.26-4.62-110.18,5.58-149.93,4.88-18.96-20.83-15.21-20.83-15.21-23.42,138.99-4.92,170.01.41,178.2,18.5,28.37,108.8-117.18,120.37-134.05,60.78,8.98,220.87-83.62,269.37-16.45,40.43,56.03-99.71,206.87-128.17,128.77,0,0,87.1-57,86.22-75.99-3.51-75.66-104.12,11.96-101.12,69.19-65.74,41.07-117.71,30.53-78.1-28.45,33.54-50.75,55.3-55.67,62.97-53.86,11.01,3.76,4.03,18.31-2.05,25.74,0,0,12.65,3.92,17.85-4.84,3.22-5.91,9.92-20.39-5.29-29.61-7.24-4.43-39.89-17.91-88.49,58.84-14.92,24.75-33.3,67.37-44.02,58.02-10.71-9.35,28.51-83.3,33.96-94.37,5.26-10.68-11.39-13.59-11.39-13.59-43.46,83.43-41.55,107.66-22.6,114.52,14.62,5.28,31.17-22.28,31.17-22.28-2.15,42.26,71.33,25.45,108.06,3.04,29.78,86.42,197.59-62.03,161.85-135.99M126.51,82.64s-12.35-1.04-21.76-12.09c-11.02-12.9,18.91-58.23,36.63-57.65,23.75.78-14.87,69.74-14.87,69.74M321.46,123.29c17.91-11.23,29.05.29,28.12,7.09-1.31,9.46-54.56,50.93-77.32,64.09-2.1-12.86,29.53-58.84,49.2-71.19" />
    </svg>
);

const PERKS_DATA = [
    {
        tier: 'CREW',
        // Neon Lime
        color: '#D4E913',
        subtitle: 'Welcome to the club.\nLet\'s get you rolling.',
        rewards: [
            '5% off all purchases'
        ],
        footer: 'Activates on 3rd purchase\nTo retain, spend AED 1000 within 3 months'
    },
    {
        tier: 'SQUAD',
        // Orange
        color: '#FF9E16',
        subtitle: 'You\'re a regular.\nPerks unlocked.',
        rewards: [
            '10% off all purchases',
            'Early access to selected launches',
            'Priority restock alerts'
        ],
        footer: 'Activates when you spend AED 10,000 within a rolling 12 months or make 25+ purchases within 12 months'
    },
    {
        tier: 'LEGENDS',
        // Reddish Pink
        color: '#FF3333',
        subtitle: 'Welcome to the club.\nLet\'s get you rolling.',
        rewards: [
            '15% off all purchases',
            'First access to all limited editions & pre-orders',
            'Exclusive invites, drops & surprises',
            'Complimentary birthday goodie bag'
        ],
        footer: 'Activates when spend exceeds AED 15,000 within a rolling 12 months'
    }
];

export function MembershipPerks() {
    return (
        <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4">
                <h2 className="text-3xl md:text-5xl font-extrabold text-center uppercase tracking-tighter mb-16">
                    Our Membership Plans
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {PERKS_DATA.map((perk, index) => (
                        <div
                            key={perk.tier}
                            className="bg-white p-10 shadow-[0_4px_20px_rgba(0,0,0,0.05)] flex flex-col items-center text-center h-full border border-gray-100 hover:shadow-xl transition-shadow duration-300"
                        >
                            {/* Logo Section */}
                            <div className="mb-8 w-full flex flex-col items-center border-b-2 border-[#bfbfbf] pb-8">
                                <ViceLogo className="w-48 h-auto mb-2" color={perk.color} />
                                <span
                                    className="font-bold uppercase tracking-[0.2em] text-sm"
                                    style={{ color: perk.color }}
                                >
                                    {perk.tier}
                                </span>
                            </div>

                            {/* Subtitle */}
                            <div className="mb-8 w-full text-left pl-4">
                                <p className="text-[30px] font-bold leading-[40px] whitespace-pre-line text-black font-sans">
                                    {perk.subtitle}
                                </p>
                            </div>

                            {/* Rewards */}
                            <div className="w-full text-left mb-auto pl-4">
                                <p className="text-sm font-bold mb-2 text-black font-sans">Rewards:</p>
                                <ul className="space-y-1">
                                    {perk.rewards.map((reward, i) => (
                                        <li key={i} className="flex items-start text-[21px] font-light leading-[40px] text-black font-sans">
                                            <span className="mr-3 mt-[14px] w-1.5 h-1.5 bg-black rounded-full flex-shrink-0"></span>
                                            <span className="">{reward}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Footer */}
                            <div className="w-full mt-10 pt-8 border-t border-gray-200 text-left pl-4">
                                <p className="text-[21px] font-light leading-[40px] text-black font-sans">
                                    {perk.footer}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
