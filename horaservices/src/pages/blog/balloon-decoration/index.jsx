import Head from "next/head";
import Link from "next/link";
import { getAllDecorationBlogArticles } from "../../../utils/decorationBlogData";
import "./DecorationBlog.css";

export default function DecorationBlogIndex({ articles }) {
  const canonicalUrl = "https://www.horaservices.com/blog/balloon-decoration";

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
        item: canonicalUrl,
      },
    ],
  };

  return (
    <>
      <Head>
        <title>Balloon Decoration Blog — Ideas, Tips & Guides | HORA</title>
        <meta
          name="description"
          content="Expert balloon decoration ideas, cost guides, and party planning tips for birthdays, kids parties, anniversaries and more. Real advice from India's top decorators."
        />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Balloon Decoration Blog — Ideas, Tips & Guides | HORA"
        />
        <meta
          property="og:description"
          content="Expert balloon decoration ideas, cost guides, and party planning tips for birthdays, kids parties, anniversaries and more."
        />
        <meta property="og:url" content={canonicalUrl} />
        <meta name="robots" content="index, follow" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      </Head>

      <main className="decoration-listing">
        <header className="decoration-listing__header">
          <div className="decoration-listing__header-inner">
            <nav className="decoration-listing__breadcrumb" aria-label="Breadcrumb">
              <Link href="/">Home</Link>
              <span>›</span>
              <Link href="/balloon-decoration">Balloon Decoration</Link>
              <span>›</span>
              <span>Blog</span>
            </nav>
            <h1 className="decoration-listing__heading">
              Balloon Decoration Blog
            </h1>
            <p className="decoration-listing__subheading">
              Ideas, cost guides, and planning tips from India&apos;s top decorators
            </p>
          </div>
        </header>

        <div className="decoration-listing__grid">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/blog/balloon-decoration/${article.slug}`}
              className="decoration-listing__card"
            >
              <div className="decoration-listing__card-meta">
                <span className="decoration-listing__category">
                  {article.category}
                </span>
                <span className="decoration-listing__reading-time">
                  {article.readingTime} min read
                </span>
              </div>
              <h2 className="decoration-listing__card-title">{article.title}</h2>
              <p className="decoration-listing__card-excerpt">{article.excerpt}</p>
              <span className="decoration-listing__read-more">Read article →</span>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}

export async function getServerSideProps() {
  const articles = getAllDecorationBlogArticles();
  return {
    props: {
      articles: articles.map(({ slug, title, category, readingTime, excerpt, publishedDate }) => ({
        slug,
        title,
        category,
        readingTime,
        excerpt,
        publishedDate,
      })),
    },
  };
}
