
import Head from "next/head";
import Link from "next/link";
import {
  getPhotographyBlogArticle,
} from "@/utils/photographyBlogData";
import "./PhotographyBlogArticle.css";

// ---------- SSR ----------
export async function getServerSideProps({ params }) {
  const { slug } = params || {};
  const article = getPhotographyBlogArticle(slug);

  if (!article) {
    return { notFound: true };
  }

  return {
    props: { article },
  };
}

// ---------- Page ----------
export default function PhotographyBlogArticle({ article }) {
  const {
    title,
    metaTitle,
    metaDescription,
    publishedDate,
    readingTime,
    category,
    categorySlug,
    excerpt,
    sections,
    closingCta,
    slug,
  } = article;

  const canonicalUrl = `https://www.horaservices.com/blog/photography/${slug}`;

  // Schema: BlogPosting
  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description: excerpt,
    datePublished: publishedDate,
    author: {
      "@type": "Organization",
      name: "HORA Services",
      url: "https://www.horaservices.com",
    },
    publisher: {
      "@type": "Organization",
      name: "HORA Services",
      url: "https://www.horaservices.com",
      logo: {
        "@type": "ImageObject",
        url: "https://www.horaservices.com/hora-logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
  };

  const formattedDate = new Date(publishedDate).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <Head>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />

        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonicalUrl} />
        <meta
          property="article:published_time"
          content={publishedDate}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(blogSchema),
          }}
        />
      </Head>

      <main className="photography-article">
        <article className="photography-article__content">
          {/* Breadcrumb */}
          <nav
            className="photography-article__breadcrumb"
            aria-label="Breadcrumb"
          >
            <Link href="/photography">Photography</Link>

            <span aria-hidden="true"> / </span>

            <Link href="/blog/photography">Blog</Link>

            {categorySlug && (
              <>
                <span aria-hidden="true"> / </span>

                <Link href={`/photography/${categorySlug}`}>
                  {category}
                </Link>
              </>
            )}
          </nav>

          {/* Header */}
          <header className="photography-article__header">
            <div className="photography-article__meta-row">
              <span className="photography-article__category">
                {category}
              </span>

              <span
                className="photography-article__dot"
                aria-hidden="true"
              >
                ·
              </span>

              <span className="photography-article__reading-time">
                {readingTime} min read
              </span>

              <span
                className="photography-article__dot"
                aria-hidden="true"
              >
                ·
              </span>

              <time
                dateTime={publishedDate}
                className="photography-article__date"
              >
                {formattedDate}
              </time>
            </div>

            <h1 className="photography-article__title">
              {title}
            </h1>

            <p className="photography-article__excerpt">
              {excerpt}
            </p>
          </header>

          {/* Body */}
          <div className="photography-article__body">
            {sections.map((section, idx) => (
              <section
                key={idx}
                className="photography-article__section"
              >
                <h2 className="photography-article__section-heading">
                  {section.heading}
                </h2>

                <p className="photography-article__section-body">
                  {section.body}
                </p>
              </section>
            ))}

            {/* CTA */}
            {closingCta && (
              <div className="photography-article__cta">
                <p className="photography-article__cta-text">
                  {closingCta}
                </p>

                <Link
                  href="/photography"
                  className="photography-article__cta-button"
                >
                  Browse photography packages →
                </Link>
              </div>
            )}
          </div>

          {/* Back link */}
          <div className="photography-article__back">
            <Link
              href="/blog/photography"
              className="photography-article__back-link"
            >
              ← All photography articles
            </Link>
          </div>
        </article>
      </main>
    </>
  );
}
