import {useLoaderData} from 'react-router';
import type {LoaderFunctionArgs, MetaFunction} from 'react-router';
import {getAllBlogPosts, getAllCategories} from '~/lib/sanity/blog';
import BlogCard from '~/components/Blog/BlogCard';
import '~/components/Blog/blog.css';

export const meta: MetaFunction = () => {
  return [{title: `Vice Golf | Blog`}];
};

export async function loader({context}: LoaderFunctionArgs) {
  const [posts, categories] = await Promise.all([
    getAllBlogPosts(context.env),
    getAllCategories(context.env)
  ]);
  return {posts, categories};
}

export default function BlogHome() {
  const {posts, categories} = useLoaderData<typeof loader>();
  
  return (
    <div className="blog-home">
      <div className="blog-home__header">
        <h1 className="blog-home__title">Vice Golf Blog</h1>
        <p className="blog-home__subtitle">Stories, tips, and updates from the green.</p>
      </div>
      
      {categories && categories.length > 0 && (
        <div className="blog-home__categories">
          <button className="blog-category-chip blog-category-chip--active">All</button>
          {categories.map(cat => (
            <button key={cat._id} className="blog-category-chip">{cat.title}</button>
          ))}
        </div>
      )}
      
      <div className={`blog-grid ${posts?.length > 0 ? 'blog-grid--with-featured' : ''}`}>
        {posts && posts.length > 0 ? (
          posts.map((post) => (
            <BlogCard key={post._id} post={post} />
          ))
        ) : (
          <div className="blog-empty">
            <div className="blog-empty__icon">🏌️‍♂️</div>
            <div className="blog-empty__text">No posts found yet. Check back soon!</div>
          </div>
        )}
      </div>
    </div>
  );
}
