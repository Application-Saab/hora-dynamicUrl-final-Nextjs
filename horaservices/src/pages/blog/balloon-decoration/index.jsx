import Head from "next/head";
import Link from "next/link";
import { getAllDecorationBlogArticles } from "@/utils/decorationBlogData";
import "./DecorationBlog.css";

export async function getServerSideProps() {
  const articles = getAllDecorationBlogArticles();
  return { props: { articles } };
}

export default function DecorationBlogIndex({ articles }) {
  const canonicalUrl = "https://www.horaservices.com/blog/balloon-decoration";

  const listingSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "HORA Balloon Decoration Blog",
    description:
      "Tips, themes and decoration ideas for balloon decoration across all categories — birthdays, weddings, baby showers, festivals and more.",
    url: canonicalUrl,
    publisher: {
      "@type": "Organization",
      name: "HORA Services",
      url: "https://www.horaservices.com",
      logo: {
        "@type": "ImageObject",
        url: "https://www.horaservices.com/hora-logo.png",
      },
    },
    blogPost: articles.map((a) => ({
      "@type": "BlogPosting",
      headline: a.title,
      description: a.excerpt,
      datePublished: a.publishedDate,
      url: `${canonicalUrl}/${a.slug}`,
    })),
  };

  return (
    <>
      <Head>
        <title>Balloon Decoration Blog — Ideas, Themes & Tips | HORA Services</title>
        <meta
          name="description"
          content="Explore balloon decoration ideas, themes and tips for every occasion — birthdays, weddings, baby showers, Haldi, Mehendi, festivals and more. Professional setups across India."
        />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="Balloon Decoration Blog | HORA Services" />
        <meta
          property="og:description"
          content="Decoration ideas and tips for every occasion — birthdays, weddings, baby showers, Haldi, Mehendi, festivals and more."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(listingSchema) }}
        />
      </Head>

      <main className="dec-blog">
        {/* Hero */}
        <header className="dec-blog__hero">
          <span className="dec-blog__hero-tag">Balloon Decoration</span>
          <h1 className="dec-blog__hero-title">
            Decoration Ideas for Every Occasion
          </h1>
          <p className="dec-blog__hero-subtitle">
            From birthday balloon arches to wedding mandaps and Haldi ceremony
            setups — expert decoration tips, themes and ideas across all 28
            categories.
          </p>
        </header>

        {/* Grid */}
        {articles.length > 0 ? (
          <div className="dec-blog__grid">
            {articles.map((article) => (
              <Link
                key={article.slug}
                href={`/blog/balloon-decoration/${article.slug}`}
                className="dec-blog__card"
              >
                <div className="dec-blog__card-body">
                  <div className="dec-blog__card-meta">
                    <span className="dec-blog__card-category">
                      {article.category}
                    </span>
                    <span className="dec-blog__card-dot" aria-hidden="true">
                      ·
                    </span>
                    <span className="dec-blog__card-time">
                      {article.readingTime} min read
                    </span>
                  </div>
                  <h2 className="dec-blog__card-title">{article.title}</h2>
                  <p className="dec-blog__card-excerpt">{article.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="dec-blog__empty">
            <p>No articles yet — check back soon!</p>
          </div>
        )}
      </main>
    </>
  );
}
