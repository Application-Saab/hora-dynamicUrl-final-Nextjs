
import Head from "next/head";
import Link from "next/link";
import { getAllPhotographyBlogArticles } from "@/utils/photographyBlogData";
import "./PhotographyBlog.css";

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

        <link
          rel="canonical"
          href="https://www.horaservices.com/blog/photography"
        />

        <meta
          property="og:title"
          content="Photography Blog — Tips & Guides | HORA"
        />

        <meta
          property="og:description"
          content="Photography tips, ideas and guides for every occasion — from booking your first photographer to planning a pre-wedding shoot."
        />

        <meta property="og:type" content="website" />
      </Head>

      <main className="photography-listing">
        <div className="photography-listing__header">
          <div className="photography-listing__header-inner">
            <p className="photography-listing__breadcrumb">
              <Link href="/photography">Photography</Link>
              <span aria-hidden="true"> / </span>
              Blog
            </p>

            <h1 className="photography-listing__heading">
              Photography Blog
            </h1>

            <p className="photography-listing__subheading">
              Tips, guides and ideas for every photography occasion
            </p>
          </div>
        </div>

        <div className="photography-listing__grid">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/blog/photography/${article.slug}`}
              className="photography-listing__card"
            >
              <div className="photography-listing__card-meta">
                <span className="photography-listing__category">
                  {article.category}
                </span>

                <span className="photography-listing__reading-time">
                  {article.readingTime} min read
                </span>
              </div>

              <h2 className="photography-listing__card-title">
                {article.title}
              </h2>

              <p className="photography-listing__card-excerpt">
                {article.excerpt}
              </p>

              <span className="photography-listing__read-more">
                Read article →
              </span>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
