import { Image } from '@shopify/hydrogen';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';

type ImageType = {
  id: string;
  url: string;
  altText?: string;
  width?: number;
  height?: number;
};

type CategoriesType = {
  id: string,
  title: string,
  handle: string,
  description: string,
  image: ImageType
}

interface ShopByCategoriesProps {
  categories: CategoriesType[]
}

// Helper function to map any to the expected props
const mapToCategoryProps = (category: CategoriesType) => {
  const handle = decodeURIComponent(category.title)
  return {
    id: category.id,
    title: category.title,
    image: category.image,
    description: `Shop ${category.title}`,
    link: `/collections/${handle}`
  };
};

const ShopByCategories: React.FC<ShopByCategoriesProps> = ({ categories }) => {
  const navigate = useNavigate();

  const handleCategoryClick = (link: string) => {
    navigate(link);
  };

  // Map ProductCategory to the expected category format
  const mappedCategories = categories.map(mapToCategoryProps);

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-4 tracking-tight uppercase">SHOP BY CATEGORIES</h2>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {mappedCategories.map((category) => (
            <div
              key={category.id}
              onClick={() => handleCategoryClick(category.link)}
              className="relative cursor-pointer overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-xl transition-shadow duration-300"
            >
              {/* Category Image */}
              <div className="aspect-[4/3] overflow-hidden relative">
                <Image
                  className="w-full h-full object-cover"
                  data={category.image}
                  alt={category.image.altText || category.title}
                  sizes="(min-width: 768px) 50vw, 100vw"
                  loading="eager"
                />
              </div>

              {/* Category Info */}
              <div className="absolute inset-0 flex flex-col justify-start p-6">
                <div className="relative z-10">
                  <h3 className="text-2xl font-semibold text-black mb-2 tracking-tight">
                    {category.title}
                  </h3>
                  {category.description && (
                    <p className="text-gray-900 text-sm font-medium tracking-wide">
                      {category.description}
                    </p>
                  )}
                </div>

                {/* Arrow */}
                <div className="absolute bottom-6 right-6">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors duration-200">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopByCategories;