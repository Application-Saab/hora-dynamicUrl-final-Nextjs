import Head from "next/head";
import Link from "next/link";
import {
  getPhotographyBlogArticle,
  getAllPhotographyBlogArticles,
} from "@/utils/photographyBlogData";
import styles from "./PhotographyBlogArticle.module.css";

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
        <meta property="article:published_time" content={publishedDate} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
        />
      </Head>

      <main className={styles.main}>
        <article className={styles.article}>

          {/* Breadcrumb */}
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link href="/photography">Photography</Link>
            <span aria-hidden="true"> / </span>
            <Link href="/blog/photography">Blog</Link>
            {categorySlug && (
              <>
                <span aria-hidden="true"> / </span>
                <Link href={`/photography/${categorySlug}`}>{category}</Link>
              </>
            )}
          </nav>

          {/* Header */}
          <header className={styles.header}>
            <div className={styles.metaRow}>
              <span className={styles.category}>{category}</span>
              <span className={styles.dot} aria-hidden="true">·</span>
              <span className={styles.readingTime}>{readingTime} min read</span>
              <span className={styles.dot} aria-hidden="true">·</span>
              <time dateTime={publishedDate} className={styles.date}>
                {formattedDate}
              </time>
            </div>
            <h1 className={styles.title}>{title}</h1>
            <p className={styles.excerpt}>{excerpt}</p>
          </header>

          {/* Body */}
          <div className={styles.body}>
            {sections.map((section, idx) => (
              <section key={idx} className={styles.section}>
                <h2 className={styles.sectionHeading}>{section.heading}</h2>
                <p className={styles.sectionBody}>{section.body}</p>
              </section>
            ))}

            {closingCta && (
              <div className={styles.cta}>
                <p className={styles.ctaText}>{closingCta}</p>
                <Link href="/photography" className={styles.ctaButton}>
                  Browse photography packages →
                </Link>
              </div>
            )}
          </div>

          {/* Back link */}
          <div className={styles.back}>
            <Link href="/blog/photography" className={styles.backLink}>
              ← All photography articles
            </Link>
          </div>
        </article>
      </main>
    </>
  );
}
