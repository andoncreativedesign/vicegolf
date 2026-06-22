import {useLoaderData, Link} from 'react-router';
import type {LoaderFunctionArgs, MetaFunction} from 'react-router';
import {getBlogPostBySlug, getRelatedPosts} from '~/lib/sanity/blog';
import {PortableText} from '@portabletext/react';
import BlogCard from '~/components/Blog/BlogCard';
import '~/components/Blog/blog.css';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [
    {title: `Vice Golf | ${data?.post?.title ?? 'Blog'}`},
    {name: 'description', content: data?.post?.seoDescription || data?.post?.excerpt}
  ];
};

export async function loader({params, context}: LoaderFunctionArgs) {
  const {slug} = params;
  if (!slug) {
    throw new Response('Not found', {status: 404});
  }

  const post = await getBlogPostBySlug(slug, context.env);
  if (!post) {
    throw new Response('Post not found', {status: 404});
  }

  const categoryIds = post.categories?.map(c => c._id) || [];
  const relatedPosts = await getRelatedPosts(slug, categoryIds, context.env);

  return {post, relatedPosts};
}

export default function BlogPost() {
  const {post, relatedPosts} = useLoaderData<typeof loader>();

  return (
    <article className="blog-post">
      <Link to="/blog" className="blog-post__back" prefetch="intent">
        &larr; Back to Blog
      </Link>

      <header className="blog-post__header">
        {post.categories && post.categories.length > 0 && (
          <div className="blog-post__categories">
            {post.categories.map(c => (
              <span key={c._id} className="blog-post__cat-badge">{c.title}</span>
            ))}
          </div>
        )}
        <h1 className="blog-post__title">{post.title}</h1>

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
        <div className="blog-post__hero" style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)' }}>
          <img
            src={post.heroImage.asset?.url || post.heroImage.url}
            alt={post.heroImage.alt || post.title}
            style={{ width: '100%', maxHeight:'75vh',objectFit:'cover', objectPosition: 'center top' }}
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

      {relatedPosts && relatedPosts.length > 0 && (
        <section className="blog-related">
          <h2 className="blog-related__title">Discover More</h2>
          <div className="blog-related__grid">
            {relatedPosts.map(related => (
              <BlogCard key={related._id} post={related} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
