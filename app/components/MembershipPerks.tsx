import React from 'react';

const ViceLogo = ({ className, color }: { className?: string; color: string }) => (
    <svg
        viewBox="0 0 427.54 293"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={{ fill: color }}
    >
        <path d="M422.58,77.46c-47.15-97.64-204.94,16.83-284.73,7.33,3.9-7.33,22.18-45.26,22.47-61.6.55-32.45-35.29-26.32-50.36-9.08-57.67,65.94,10.47,78.85,10.47,78.85-15.64,27.6-86.24,127.08-93.61,122.82-7.36-4.26-4.62-110.18,5.58-149.93,4.88-18.96-20.83-15.21-20.83-15.21-23.42,138.99-4.92,170.01.41,178.2,18.5,28.37,108.8-117.18,120.37-134.05,60.78,8.98,220.87-83.62,269.37-16.45,40.43,56.03-99.71,206.87-128.17,128.77" />
    </svg>
);

const PERKS_DATA = [
    {
        tier: 'CREW',
        color: '#D4E913',
        logo: '/crew-main-green.png',
        tierImages: ['/C.png', '/R.png', '/E.png', '/W.png'],
        subtitle: 'Welcome to the club.\nLet’s get you rolling.',
        rewards: ['5% off all purchases'],
        footer: 'Activates on 3rd purchase\nTo retain, spend AED 1000 within 3 months',
    },
    {
        tier: 'SQUAD',
        color: '#FF9E16',
        logo: '/crew-main-orange.png',
        tierImages: ['/S.png', '/Q.png', '/U.png', '/A.png', '/D.png'],
        subtitle: 'You’re a regular.\nPerks unlocked.',
        rewards: [
            '10% off all purchases',
            'Early access to selected launches',
            'Priority restock alerts',
        ],
        footer:
            'Activates when you spend AED 10,000 within a rolling 12 months or make 25+ purchases within 12 months',
    },
    {
        tier: 'LEGENDS',
        color: '#FF3333',
        logo: '/crew-main-red.png',
        tierImages: ['/L-L.png', '/L-E.png', '/L-G.png', '/L-E.png', '/L-N.png', '/L-D.png', '/L-S.png'],
        subtitle: 'Top tier.\nTop treatment.',
        rewards: [
            '15% off all purchases',
            'First access to all limited editions & pre-orders',
            'Exclusive invites, drops & surprises',
            'Complimentary birthday goodie bag',
        ],
        footer:
            'Activates when spend exceeds AED 15,000 within a rolling 12 months',
    },
];

export function MembershipPerks() {
    return (
        <section className=" py-24">
            <div className="mx-auto max-w-[1300px] px-6">
                <h2
                    className="mb-20 text-center font-extrabold uppercase tracking-tight leading-none"
                    style={{ fontSize: '40px' }}
                >
                    Our Membership Perks
                </h2>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {PERKS_DATA.map((perk) => (
                        <div
                            key={perk.tier}
                            className="relative h-[780px] border border-[#E5E5E5] bg-white px-10 pt-12"
                        >
                            {/* Logo */}
                            <div className="flex flex-col items-center border-b border-[#BFBFBF] pb-8 h-[120px] justify-center">
                                {perk.logo ? (
                                    <img src={perk.logo} alt={perk.tier} className="w-[190px] h-auto object-contain" />
                                ) : (
                                    <ViceLogo className="w-[190px]" color={perk.color} />
                                )}

                                <div className="mt-2 flex items-center justify-center gap-1 min-h-[18px]">
                                    {(perk as any).tierImages ? (
                                        (perk as any).tierImages.map((img: string, idx: number) => (
                                            <img key={idx} src={img} alt="" className="h-3 w-auto object-contain" />
                                        ))
                                    ) : (
                                        <span
                                            className="text-[12px] font-bold uppercase tracking-[0.25em]"
                                            style={{ color: perk.color }}
                                        >
                                            {perk.tier}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Main content */}
                            <div className="mt-10">
                                <p
                                    className="whitespace-pre-line text-left leading-[36px] font-bold "
                                    style={{ fontSize: '20px' }}
                                >
                                    {perk.subtitle}
                                </p>

                                <div className="mt-10">
                                    <p className="mb-4 text-[14px] font-bold">Rewards:</p>
                                    <ul className="space-y-2">
                                        {perk.rewards.map((reward, i) => (
                                            <li
                                                key={i}
                                                className="flex items-start text-[16px] leading-[28px]"
                                            >
                                                <span className="mr-3 mt-[10px] h-[5px] w-[5px] rounded-full bg-black" />
                                                {reward}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Divider – fixed position */}
                            <div className="absolute left-10 right-10 bottom-[120px] border-t border-[#E5E5E5]" />

                            {/* Footer – TOP-ALIGNED to divider */}
                            <div className="absolute left-10 right-10 top-[675px]">
                                <p className="whitespace-pre-line text-left text-[21px] font-light leading-[32px]">
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
