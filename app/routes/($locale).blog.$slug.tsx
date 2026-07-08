import { useRef, useState, useEffect } from 'react';
import { useLoaderData, Link } from 'react-router';
import type { LoaderFunctionArgs, MetaFunction } from 'react-router';
import { getBlogPostBySlug, getRelatedPosts } from '~/lib/sanity/blog';
import { PortableText } from '@portabletext/react';
import BlogCard from '~/components/Blog/BlogCard';
import '~/components/Blog/blog.css';

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: `Vice Golf | ${data?.post?.title ?? 'Blog'}` },
    { name: 'description', content: data?.post?.seoDescription || data?.post?.excerpt }
  ];
};

export async function loader({ params, context }: LoaderFunctionArgs) {
  const { slug } = params;
  if (!slug) {
    throw new Response('Not found', { status: 404 });
  }

  const post = await getBlogPostBySlug(slug, context.env);
  if (!post) {
    throw new Response('Post not found', { status: 404 });
  }

  const categoryIds = post.categories?.map(c => c._id) || [];
  const relatedPosts = await getRelatedPosts(slug, categoryIds, context.env);

  return { post, relatedPosts };
}

export default function BlogPost() {
  const { post, relatedPosts } = useLoaderData<typeof loader>();
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
  }, [relatedPosts]);

  return (
    <article className="blog-post">
      <div className="blog-post__breadcrumb">
        <Link to="/blog" prefetch="intent">
          Blog
        </Link>
        {post.categories && post.categories.length > 0 && (
          <>
            {' > '}
            <span>{post.categories[0].title}</span>
          </>
        )}
      </div>

      <header className="blog-post__header">
        <h1 className="blog-post__title">{post.title}</h1>

        {post.excerpt && (
          <p className="blog-post__subtitle">
            {post.excerpt}
          </p>
        )}

        <div className="blog-post__meta">
          <span className="blog-post__date">
            Published: {new Intl.DateTimeFormat('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            }).format(new Date(post.publishedAt))}
          </span>
        </div>
      </header>

      {post.heroImage && (
        <div className="blog-post__hero">
          <img
            src={post.heroImage.asset?.url || post.heroImage.url}
            alt={post.heroImage.alt || post.title}
          />
        </div>
      )}

      <div className="blog-post__body">
        {post.body ? (
          <PortableText
            value={post.body}
            components={{
              types: {
                image: ({ value }) => {
                  return (
                    <figure>
                      <img src={value.asset?.url || value.url} alt={value.alt || ''} />
                      {value.caption && <figcaption>{value.caption}</figcaption>}
                    </figure>
                  );
                }
              }
            }}
          />
        ) : (
          <p>No content available.</p>
        )}
      </div>

      {post.showDiscoverMore !== false && relatedPosts && relatedPosts.length > 0 && (
        <section className="blog-related">
          <div className="blog-category-header">
            <h2 className="blog-category-title">Discover More</h2>
            {relatedPosts.length > 1 && (
              <div className="blog-carousel-controls flex items-center space-x-2 sm:space-x-4" data-count={relatedPosts.length}>
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
            {relatedPosts.map((related: any) => (
              <BlogCard key={related._id} post={related} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
