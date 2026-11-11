import Head from "next/head";
import Link from "next/link";
import { getAllVenueBlogArticles } from "../../../utils/venueBlogData";
import "./VenueBlog.css";

export default function VenueBlogIndex({ articles }) {
  const canonicalUrl = "https://www.horaservices.com/blog/venue";

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
        name: "Party Venues",
        item: "https://www.horaservices.com/venue-list",
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
        <title>Party Venue Blog — Ideas, Tips &amp; Guides | HORA</title>
        <meta
          name="description"
          content="Expert guides on booking party venues in India — banquet halls, rooftops, farmhouses, kids party spaces and more. Real advice on cost, capacity and what to check before you book."
        />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Party Venue Blog — Ideas, Tips & Guides | HORA"
        />
        <meta
          property="og:description"
          content="Expert guides on booking party venues in India — banquet halls, rooftops, farmhouses and more."
        />
        <meta property="og:url" content={canonicalUrl} />
        <meta name="robots" content="index, follow" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      </Head>

      <main className="venue-listing">
        <header className="venue-listing__header">
          <div className="venue-listing__header-inner">
            <nav className="venue-listing__breadcrumb" aria-label="Breadcrumb">
              <Link href="/">Home</Link>
              <span>›</span>
              <Link href="/venue-list">Party Venues</Link>
              <span>›</span>
              <span>Blog</span>
            </nav>
            <h1 className="venue-listing__heading">Party Venue Blog</h1>
            <p className="venue-listing__subheading">
              Guides on choosing, booking and budgeting for party venues in India
            </p>
          </div>
        </header>

        <div className="venue-listing__grid">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/blog/venue/${article.slug}`}
              className="venue-listing__card"
            >
              <div className="venue-listing__card-meta">
                <span className="venue-listing__category">
                  {article.category}
                </span>
                <span className="venue-listing__reading-time">
                  {article.readingTime} min read
                </span>
              </div>
              <h2 className="venue-listing__card-title">{article.title}</h2>
              <p className="venue-listing__card-excerpt">{article.excerpt}</p>
              <span className="venue-listing__read-more">Read article →</span>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}

export async function getServerSideProps() {
  const articles = getAllVenueBlogArticles();
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
