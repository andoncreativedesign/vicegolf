import React from 'react';
import { Link } from 'react-router';
import './blog.css';

export interface BlogCategory {
  _id?: string;
  _key?: string;
  title: string;
}

export interface HeroImage {
  asset?: { url?: string };
  url?: string;
  alt?: string;
}

export interface BlogPost {
  title: string;
  slug: string;
  heroImage?: HeroImage;
  excerpt?: string;
  categories?: BlogCategory[];
  author?: string;
  publishedAt?: string;
}

interface BlogCardProps {
  post: BlogPost;
}

const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  const { title, slug, heroImage, excerpt, categories, author, publishedAt } = post;
  return (
    <Link to={`/blog/${slug}`} className="blog-card" prefetch="intent">
      <div className="blog-card__image-wrap">
        <img
          src={heroImage?.asset?.url || heroImage?.url || ''}
          alt={heroImage?.alt || title}
          className="blog-card__image"
        />
      </div>
      <div className="blog-card__body">
        {categories && categories.length > 0 && (
          <div className="blog-card__categories">
            {categories.map((c) => (
              <span key={c._id || c._key} className="blog-card__cat-badge">
                {c.title}
              </span>
            ))}
          </div>
        )}
        <h3 className="blog-card__title">{title}</h3>
        {excerpt && <p className="blog-card__excerpt">{excerpt}</p>}
        <div className="blog-card__meta">
          <span className="blog-card__author">{author || 'Vice Golf Team'}</span>
          <span className="blog-card__date">
            {publishedAt &&
              new Intl.DateTimeFormat('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              }).format(new Date(publishedAt))}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
