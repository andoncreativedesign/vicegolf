import { Image } from '@shopify/hydrogen';

interface MembershipHeroProps {
    desktopImage?: string;
    mobileImage?: string;
    title1?: string;
    title2?: string;
    description?: string;
}

export function MembershipHero({
    desktopImage = 'https://cdn.shopify.com/s/files/1/0645/4253/9870/files/Vice_Banner_No_Text_v2-03_1.png?v=1770707811',
    mobileImage = 'https://cdn.shopify.com/s/files/1/0645/4253/9870/files/homepage_mobilebanner_2x_edcd044b-c4c0-4718-8855-f4037be8b5a0.jpg?v=1770709743',
    title1 = 'Built for performance.',
    title2 = 'Trusted on the course.',
    description = 'Explore our range of precision-engineered golf gear.',
}: MembershipHeroProps) {
    return (
        <section className="relative w-full h-[74vh] min-h-[490px] max-h-[740px] mx-auto overflow-x-hidden">
            <div className="absolute inset-0 z-0">
                <picture>
                    <source media="(max-width: 767px)" srcSet={mobileImage} />
                    <Image
                        data={{
                            url: desktopImage,
                            altText: 'Vice Golf Membership',
                        }}
                        className="absolute inset-0 w-full h-full object-cover object-center"
                        sizes="100vw"
                        loading="eager"
                    />
                </picture>
            </div>
            <div className="absolute inset-0 z-20 flex px-[clamp(1rem,4vw,3rem)] text-white items-end justify-center md:justify-start pb-12 md:pb-6">
                <div
                    className="max-w-2xl lg:max-w-4xl xl:max-w-5xl py-10 md:py-14 bg-transparent text-center md:text-left"
                    style={{ width: '90vw', maxWidth: '1200px' }}
                >
                    <h2
                        className="!text-3xl md:!text-4xl lg:!text-5xl xl:!text-5xl uppercase tracking-tight leading-none mb-1 font-extralight"
                        style={{ color: '#FFFFFF', fontWeight: 200 }}
                    >
                        {title1}
                    </h2>
                    <h2
                        className="!text-3xl md:!text-4xl lg:!text-5xl xl:!text-5xl uppercase tracking-tight leading-none mb-1 font-normal"
                        style={{ color: '#c5e517' }}
                    >
                        {title2}
                    </h2>
                    <p
                        className="!text-base md:!text-lg lg:!text-xl xl:!text-xl font-thin mb-6 leading-tight"
                        style={{ color: '#FFFFFF' }}
                    >
                        {description}
                    </p>
                </div>
            </div>
        </section>
    );
}