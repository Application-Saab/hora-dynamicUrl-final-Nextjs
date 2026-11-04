import Head from "next/head";
import Link from "next/link";
import { getDecorationBlogArticle } from "@/utils/decorationBlogData";
import "./DecorationBlogArticle.css";

// ---------- SSR ----------
export async function getServerSideProps({ params }) {
  const { slug } = params || {};
  const article = getDecorationBlogArticle(slug);

  if (!article) {
    return { notFound: true };
  }

  return { props: { article } };
}

// ---------- Page ----------
export default function DecorationBlogArticle({ article }) {
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

  const canonicalUrl = `https://www.horaservices.com/blog/balloon-decoration/${slug}`;

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
        <meta property="article:published_time" content={publishedDate} />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
        />
      </Head>

      <main className="dec-article">
        <article className="dec-article__content">
          {/* Breadcrumb */}
          <nav className="dec-article__breadcrumb" aria-label="Breadcrumb">
            <Link href="/balloon-decoration">Balloon Decoration</Link>
            <span aria-hidden="true"> / </span>
            <Link href="/blog/balloon-decoration">Blog</Link>
            {categorySlug && (
              <>
                <span aria-hidden="true"> / </span>
                <Link href={`/balloon-decoration/${categorySlug}`}>
                  {category}
                </Link>
              </>
            )}
          </nav>

          {/* Header */}
          <header className="dec-article__header">
            <div className="dec-article__meta-row">
              <span className="dec-article__category">{category}</span>
              <span className="dec-article__dot" aria-hidden="true">·</span>
              <span className="dec-article__reading-time">
                {readingTime} min read
              </span>
              <span className="dec-article__dot" aria-hidden="true">·</span>
              <time dateTime={publishedDate} className="dec-article__date">
                {formattedDate}
              </time>
            </div>

            <h1 className="dec-article__title">{title}</h1>
            <p className="dec-article__excerpt">{excerpt}</p>
          </header>

          {/* Body */}
          <div className="dec-article__body">
            {sections.map((section, idx) => (
              <section key={idx} className="dec-article__section">
                <h2 className="dec-article__section-heading">
                  {section.heading}
                </h2>
                <p className="dec-article__section-body">{section.body}</p>
              </section>
            ))}

            {/* CTA */}
            {closingCta && (
              <div className="dec-article__cta">
                <p className="dec-article__cta-text">{closingCta}</p>
                <Link
                  href={`/balloon-decoration/${categorySlug}`}
                  className="dec-article__cta-button"
                >
                  Browse {category} designs →
                </Link>
              </div>
            )}
          </div>

          {/* Back link */}
          <div className="dec-article__back">
            <Link
              href="/blog/balloon-decoration"
              className="dec-article__back-link"
            >
              ← All decoration articles
            </Link>
          </div>
        </article>
      </main>
    </>
  );
}
