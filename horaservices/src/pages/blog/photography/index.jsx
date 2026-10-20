import Head from "next/head";
import Link from "next/link";
import { getAllPhotographyBlogArticles } from "@/utils/photographyBlogData";
import styles from "./PhotographyBlog.module.css";

// ---------- SSR ----------
export async function getServerSideProps() {
  const articles = getAllPhotographyBlogArticles();
  return {
    props: { articles },
  };
}

// ---------- Page ----------
export default function PhotographyBlogIndex({ articles }) {
  return (
    <>
      <Head>
        <title>Photography Blog — Tips, Ideas & Guides | HORA</title>
        <meta
          name="description"
          content="Expert photography tips and guides for Indian couples and families — birthday, wedding, maternity, newborn, engagement and more. By HORA Photography."
        />
        <link rel="canonical" href="https://www.horaservices.com/blog/photography" />
        <meta property="og:title" content="Photography Blog — Tips & Guides | HORA" />
        <meta
          property="og:description"
          content="Photography tips, ideas and guides for every occasion — from booking your first photographer to planning a pre-wedding shoot."
        />
        <meta property="og:type" content="website" />
      </Head>

      <main className={styles.main}>
        <div className={styles.header}>
          <div className={styles.headerInner}>
            <p className={styles.breadcrumb}>
              <Link href="/photography">Photography</Link>
              <span aria-hidden="true"> / </span>
              Blog
            </p>
            <h1 className={styles.heading}>Photography Blog</h1>
            <p className={styles.subheading}>
              Tips, guides and ideas for every photography occasion
            </p>
          </div>
        </div>

        <div className={styles.grid}>
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/blog/photography/${article.slug}`}
              className={styles.card}
            >
              <div className={styles.cardMeta}>
                <span className={styles.category}>{article.category}</span>
                <span className={styles.readingTime}>{article.readingTime} min read</span>
              </div>
              <h2 className={styles.cardTitle}>{article.title}</h2>
              <p className={styles.cardExcerpt}>{article.excerpt}</p>
              <span className={styles.readMore}>Read article →</span>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
