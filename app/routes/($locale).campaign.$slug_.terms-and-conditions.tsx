import { useLoaderData } from 'react-router';
import type { LoaderFunctionArgs } from 'react-router';
import { getCampaignDataBySlug } from '~/lib/sanity/campaign';
import { PortableText } from '@portabletext/react';
import type { PortableTextBlock } from '@portabletext/types';

export async function loader({ params, context }: LoaderFunctionArgs) {
  const slug = params.slug;
  if (!slug) {
    throw new Response('Not Found', { status: 404 });
  }

  const campaign = await getCampaignDataBySlug(slug, context.env);
  
  if (!campaign) {
    throw new Response('Campaign Not Found', { status: 404 });
  }

  return { campaign };
}

export const meta = ({ data }: any) => {
  return [{ title: `${data?.campaign?.title || 'Campaign'} Terms and Conditions | Vice Golf` }];
};

const portableTextComponents = {
  block: {
    normal: ({ children }: any) => <p className="mb-6">{children}</p>,
    h1: ({ children }: any) => <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center uppercase">{children}</h1>,
    h2: ({ children }: any) => <h2 className="text-2xl font-bold text-gray-900 mb-5">{children}</h2>,
    h3: ({ children }: any) => <h3 className="text-[1.2rem] font-semibold text-gray-900 mb-4">{children}</h3>,
  },
  list: {
    bullet: ({ children }: any) => <ul className="list-disc pl-5 mb-4">{children}</ul>,
    number: ({ children }: any) => <ol className="list-decimal pl-5 mb-4">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }: any) => <li className="mb-1">{children}</li>,
    number: ({ children }: any) => <li className="mb-1">{children}</li>,
  },
  marks: {
    linkExternal: ({ children, value }: any) => (
      <a href={value?.url || value?.href} target="_blank" rel="noopener noreferrer" className="text-[#3b82f6] hover:underline">
        {children}
      </a>
    ),
    linkEmail: ({ children, value }: any) => (
      <a href={`mailto:${value?.email}`} className="text-[#3b82f6] hover:underline">
        {children}
      </a>
    ),
    linkInternal: ({ children, value }: any) => (
      <a href={value?.slug?.current || value?.href || '#'} className="text-[#3b82f6] hover:underline">
        {children}
      </a>
    ),
    link: ({ children, value }: any) => (
      <a href={value?.href} target={value?.newWindow ? "_blank" : undefined} rel={value?.newWindow ? "noopener noreferrer" : undefined} className="text-[#3b82f6] hover:underline">
        {children}
      </a>
    )
  },
};

export default function CampaignTermsAndConditions() {
  const { campaign } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen">
      <div className="max-w-[91rem] mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        {campaign.termsAndConditions?.heading && (
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-2 uppercase">
              {campaign.termsAndConditions.heading}
            </h1>
          </div>
        )}

        {/* Content */}
        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
          <div className="space-y">
            {campaign.termsAndConditions ? (
              <>
                {campaign.termsAndConditions.introText && (
                  <div className="mb-6">
                    <PortableText 
                      value={campaign.termsAndConditions.introText as PortableTextBlock[]} 
                      components={portableTextComponents} 
                    />
                  </div>
                )}
                
                {campaign.termsAndConditions.sections?.map((section: any, index: number) => (
                  <section key={index} className="mb-8">
                    {section.title && (
                      <h3 className="text-[1.2rem] font-semibold text-gray-900 mb-4">{section.title}</h3>
                    )}
                    {section.body && (
                      <PortableText 
                        value={section.body as PortableTextBlock[]} 
                        components={portableTextComponents} 
                      />
                    )}
                  </section>
                ))}
              </>
            ) : (
              <p>No terms and conditions found for this campaign.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
