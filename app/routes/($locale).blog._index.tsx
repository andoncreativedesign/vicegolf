import { useLoaderData } from 'react-router';
import type { LoaderFunctionArgs, MetaFunction } from 'react-router';
import { getAllBlogPosts, getAllCategories } from '~/lib/sanity/blog';
import BlogCard from '~/components/Blog/BlogCard.tsx';
import '~/components/Blog/blog.css';
import { useRef } from 'react';

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

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.clientWidth * 0.8;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="blog-category-section">
      <div className="blog-category-header">
        <h2 className="blog-category-title">{categoryGroup.title}</h2>
        {categoryGroup.posts.length > 1 && (
          <div className="blog-carousel-controls" data-count={categoryGroup.posts.length}>
            <button onClick={() => scroll('left')} className="blog-carousel-btn">&lt;</button>
            <button onClick={() => scroll('right')} className="blog-carousel-btn">&gt;</button>
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
