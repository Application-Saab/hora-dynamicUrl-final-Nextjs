import Head from "next/head";
import Link from "next/link";
import {
  getDecorationBlogArticle,
  getAllDecorationBlogArticles,
} from "../../../utils/decorationBlogData";
import "./DecorationBlogArticle.css";

const CITY_LABELS = {
  mumbai: "Mumbai",
  bangalore: "Bangalore",
  delhi: "Delhi",
  hyderabad: "Hyderabad",
  noida: "Noida",
  gurugram: "Gurugram",
  ghaziabad: "Ghaziabad",
  faridabad: "Faridabad",
};

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function DecorationBlogArticle({ article }) {
  if (!article) return null;

  const canonicalUrl = `https://www.horaservices.com/blog/balloon-decoration/${article.slug}`;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.horaservices.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Balloon Decoration",
        item: "https://www.horaservices.com/balloon-decoration",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Blog",
        item: "https://www.horaservices.com/blog/balloon-decoration",
      },
      {
        "@type": "ListItem",
        position: 4,
        name: article.title,
        item: canonicalUrl,
      },
    ],
  };

  const blogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.metaDescription,
    url: canonicalUrl,
    datePublished: article.publishedDate,
    dateModified: article.publishedDate,
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
        url: "https://www.horaservices.com/logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
  };

  return (
    <>
      <Head>
        <title>{article.metaTitle}</title>
        <meta name="description" content={article.metaDescription} />
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={article.metaTitle} />
        <meta property="og:description" content={article.metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content="HORA Services" />
        <meta
          property="article:published_time"
          content={`${article.publishedDate}T00:00:00+05:30`}
        />
        <meta property="article:section" content={article.category} />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={article.metaTitle} />
        <meta name="twitter:description" content={article.metaDescription} />

        <meta name="robots" content="index, follow" />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(blogPostingSchema),
          }}
        />
      </Head>

      <main className="decoration-article">
        <div className="decoration-article__content">
          {/* Breadcrumb */}
          <nav
            className="decoration-article__breadcrumb"
            aria-label="Breadcrumb"
          >
            <Link href="/">Home</Link>
            <span>›</span>
            <Link href="/balloon-decoration">Balloon Decoration</Link>
            <span>›</span>
            <Link href="/blog/balloon-decoration">Blog</Link>
            <span>›</span>
            <span>{article.category}</span>
          </nav>

          {/* Article Header */}
          <header className="decoration-article__header">
            <div className="decoration-article__meta-row">
              <span className="decoration-article__category">
                {article.category}
              </span>
              <span className="decoration-article__dot">·</span>
              <span className="decoration-article__reading-time">
                {article.readingTime} min read
              </span>
              <span className="decoration-article__dot">·</span>
              <time
                className="decoration-article__date"
                dateTime={article.publishedDate}
              >
                {formatDate(article.publishedDate)}
              </time>
            </div>
            <h1 className="decoration-article__title">{article.title}</h1>
            <p className="decoration-article__excerpt">{article.excerpt}</p>
          </header>

          {/* Article Sections */}
          <div className="decoration-article__body">
            {article.sections.map((section, i) => (
              <section key={i} className="decoration-article__section">
                <h2 className="decoration-article__section-heading">
                  {section.heading}
                </h2>
                <p className="decoration-article__section-body">{section.body}</p>
              </section>
            ))}

            {/* City Links */}
            {article.relatedCities && article.relatedCities.length > 0 && (
              <div className="decoration-article__cities">
                <p className="decoration-article__cities-heading">
                  Book in your city
                </p>
                <ul className="decoration-article__cities-list">
                  {article.relatedCities.map((city) => (
                    <li key={city}>
                      <Link
                        href={`/${city}/balloon-decoration/${article.catValue}`}
                      >
                        {CITY_LABELS[city] || city}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Closing CTA */}
            {article.closingCta && (
              <div className="decoration-article__cta">
                <p className="decoration-article__cta-text">
                  {article.closingCta}
                </p>
                <Link
                  href={article.closingCtaLink}
                  className="decoration-article__cta-button"
                >
                  {article.closingCtaLabel}
                </Link>
              </div>
            )}
          </div>

          {/* Back Link */}
          <div className="decoration-article__back">
            <Link
              href="/blog/balloon-decoration"
              className="decoration-article__back-link"
            >
              ← Back to Balloon Decoration Blog
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}

export async function getServerSideProps({ params }) {
  const article = getDecorationBlogArticle(params.slug);
  if (!article) {
    return { notFound: true };
  }
  return {
    props: { article },
  };
}
