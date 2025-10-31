import { Image } from '@shopify/hydrogen';
import React from 'react';
import { useNavigate } from 'react-router-dom';

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
  console.log("category\n\n")
  console.log(JSON.stringify(category.image))

  return {
    id: category.id,
    title: category.title,
    image: category.image,
    description: `Shop ${category.title}`,
    link: `/collections/${category.handle}`
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
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">SHOP BY CATEGORIES</h2>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mappedCategories.map((category) => (
            <div
              key={category.id}
              onClick={() => handleCategoryClick(category.link)}
            // className="relative group cursor-pointer overflow-hidden rounded-lg bg-gray-100 hover:shadow-xl transition-all duration-300"
              // ! image not 
              className=""
            >
              {/* Category Image */}
              <div className="aspect-[4/3] overflow-hidden">
                <Image
                  className="w-full h-full object-contain"
                  data={category.image}
                  alt={category.image.altText}
                  sizes="100vw"
                  loading="eager"
                />
              </div>

              {/* Category Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300">
                <div className="absolute top-6 left-6">
                  <h3 className="text-xl font-bold text-white mb-2 tracking-wide">
                    {category.title}
                  </h3>
                  {category.description && (
                    <p className="text-white text-sm opacity-90">
                      {category.description}
                    </p>
                  )}
                </div>

                {/* Hover Arrow */}
                <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-gray-900"
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