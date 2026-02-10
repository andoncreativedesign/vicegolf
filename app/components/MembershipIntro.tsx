interface MembershipIntroProps {
    title?: string;
    description?: string;
}

export function MembershipIntro({
    title = 'Earn it. Own it. Embrace your Vice.',
    description = 'The more you play with Vice, the more Vice gives back. Your membership status is based on purchase frequency and total spend, unlocking exclusive discounts as you move up the tiers. No sign-up fees. No gimmicks. Just rewards that hit harder every time you return.',
}: MembershipIntroProps) {
    return (
        <section className="w-full bg-white py-16 md:py-20">
            <div className="max-w-4xl mx-auto px-6 md:px-8 text-center">
                <p className="!text-[20px] !leading-[36px] !mb-12">
                    {description}
                </p>
                <h2
                    className="text-center font-extrabold tracking-tight leading-none mb-6 text-black"
                    style={{ fontSize: '40px' }}
                >
                    {title}
                </h2>
            </div>
        </section>
    );
}
