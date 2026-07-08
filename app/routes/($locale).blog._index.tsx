import { useLoaderData } from 'react-router';
import type { LoaderFunctionArgs, MetaFunction } from 'react-router';
import { getAllBlogPosts, getAllCategories } from '~/lib/sanity/blog';
import BlogCard from '~/components/Blog/BlogCard.tsx';
import '~/components/Blog/blog.css';
import { useRef, useState, useEffect } from 'react';

export const meta: MetaFunction = () => {
  return [{ title: `Vice Golf | Blog` }];
};

export async function loader({ context }: LoaderFunctionArgs) {
  const [posts, categories] = await Promise.all([
    getAllBlogPosts(context.env),
    getAllCategories(context.env)
  ]);
  return { posts, categories };
}

function CategorySection({ categoryGroup }: { categoryGroup: any }) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollButtons = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      const isAtEnd = scrollLeft >= scrollWidth - clientWidth - 1;
      setCanScrollRight(!isAtEnd);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.clientWidth * 0.8;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
      setTimeout(checkScrollButtons, 300);
    }
  };

  useEffect(() => {
    const container = carouselRef.current;
    if (!container) return;

    const handleScroll = () => {
      checkScrollButtons();
    };

    container.addEventListener('scroll', handleScroll);
    checkScrollButtons();

    window.addEventListener('resize', checkScrollButtons);

    return () => {
      container.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', checkScrollButtons);
    };
  }, [categoryGroup.posts]);

  return (
    <section className="blog-category-section">
      <div className="blog-category-header">
        <h2 className="blog-category-title">{categoryGroup.title}</h2>
        {categoryGroup.posts.length > 1 && (
          <div className="blog-carousel-controls flex items-center space-x-2 sm:space-x-4" data-count={categoryGroup.posts.length}>
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={`rounded-full p-1 border-0 w-10 h-10 flex items-center justify-center transition-all duration-200 ${canScrollLeft
                ? 'bg-[#e2e2e2] hover:bg-[#d6d6d6] text-[#787878] cursor-pointer'
                : 'bg-[#f6f6f6] text-[#C0C0C0] cursor-not-allowed'
                }`}
              aria-label="Scroll left"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" className="w-8 h-8 transition-transform rotate-90">
                <title>Caret Left</title>
                <path d="M14 8L10 12L6 8" strokeWidth={1.25} />
              </svg>
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={`rounded-full p-1 border-0 w-10 h-10 flex items-center justify-center transition-all duration-200 ${canScrollRight
                ? 'bg-[#e2e2e2] hover:bg-[#d6d6d6] text-[#787878] cursor-pointer'
                : 'bg-[#f6f6f6] text-[#C0C0C0] cursor-not-allowed'
                }`}
              aria-label="Scroll right"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" className="w-8 h-8 transition-transform -rotate-90">
                <title>Caret Right</title>
                <path d="M14 8L10 12L6 8" strokeWidth={1.25} />
              </svg>
            </button>
          </div>
        )}
      </div>
      <div className="blog-carousel" ref={carouselRef}>
        {categoryGroup.posts.map((post: any) => (
          <BlogCard key={post._id} post={post} />
        ))}
      </div>
    </section>
  );
}

export default function BlogHome() {
  const { posts, categories } = useLoaderData<typeof loader>();

  // Group posts by category
  const categorizedPosts = categories?.map(cat => ({
    ...cat,
    posts: posts?.filter(post => post.categories?.some(c => c._id === cat._id)) || []
  })).filter(group => group.posts.length > 0) || [];

  return (
    <div className="blog-home">
      {categorizedPosts.length > 0 ? (
        categorizedPosts.map((categoryGroup) => (
          <CategorySection key={categoryGroup._id} categoryGroup={categoryGroup} />
        ))
      ) : (
        <div className="blog-empty">
          <div className="blog-empty__icon">🏌️‍♂️</div>
          <div className="blog-empty__text">No posts found yet. Check back soon!</div>
        </div>
      )}
    </div>
  );
}
