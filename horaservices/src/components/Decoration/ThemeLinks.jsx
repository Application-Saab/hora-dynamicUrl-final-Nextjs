import Link from "next/link";
import "./ThemeLinks.css";

/**
 * Crawlable text links to the theme pages of a category.
 *
 * The image pill carousel already links to these pages, but with
 * single-word anchor text ("Mermaid"). This block gives each theme page
 * a descriptive in-body anchor ("Mermaid Kids Birthday Decoration in
 * Gurugram"), which is a far stronger relevance signal and makes the
 * theme pages reachable from their own category page rather than only
 * from each other.
 */
const ThemeLinks = ({ links = [], heading = "Popular themes" }) => {
  if (!Array.isArray(links) || links.length === 0) return null;

  return (
    <nav className="theme-links" aria-label={heading}>
      <div className="theme-links__inner">
        <h2 className="theme-links__heading">{heading}</h2>
        <ul className="theme-links__list">
          {links.map((link) => (
            <li key={link.value} className="theme-links__item">
              <Link href={link.href} className="theme-links__link">
                {link.text}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default ThemeLinks;
