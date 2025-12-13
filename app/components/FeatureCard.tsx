interface FeatureCardProps {
  title: string;
  price: string;
  imageUrl: string;
  specifications: string[];
  link?: string;
}

export function FeatureCard({
  title,
  price,
  imageUrl,
  specifications,
  link = "#",
}: FeatureCardProps) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 text-center w-full max-w-sm mx-auto border border-gray-100 flex flex-col">
      {/* Product Image */}
      <div className="bg-gray-50 p-4">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-auto object-contain rounded-lg"
          loading="lazy"
        />
      </div>

      {/* Product Info */}
      <div className="px-6 pb-6 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mt-3">{title}</h3>
          <p className="text-gray-800 text-lg font-medium mb-4">{price}</p>
          <div className="border-t border-gray-200 mb-4"></div>

          <div className="space-y-3 text-left">
            {specifications.map((spec, index) => {
              const [label, ...rest] = spec.split(":");
              const value = rest.join(":").trim() || spec;
              return (
                <div key={index}>
                  <p className="text-sm font-semibold text-gray-700">
                    {label || `Spec ${index + 1}`}
                  </p>
                  <p className="text-sm text-gray-600">{value}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Learn More Button */}
        <div className="mt-6">
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-full !text-white bg-black hover:bg-gray-800 transition-colors duration-200 shadow-sm hover:shadow-md no-underline"
          >
            Learn More
          </a>
        </div>
      </div>
    </div>
  );
}
