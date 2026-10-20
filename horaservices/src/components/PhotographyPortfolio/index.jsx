import styles from "./PhotographyPortfolio.module.css";

/**
 * PLACEHOLDER DATA — replace with real case studies.
 * Each entry: { id, title, category, location, description, highlights[] }
 * Add a real imageUrl once assets are ready.
 */
const PORTFOLIO_ITEMS = [
  {
    id: "case-1",
    title: "Arjun & Priya's Wedding",
    category: "Wedding Photography",
    location: "Delhi",
    description:
      "A 2-day wedding at a South Delhi farmhouse — mehendi, sangeet and wedding ceremony. 900+ edited images, cinematic reel, delivered within 48 hours.",
    highlights: ["2 photographers", "900 edited photos", "Cinematic reel", "48-hour delivery"],
  },
  {
    id: "case-2",
    title: "Rhea's First Birthday",
    category: "Birthday Photography",
    location: "Mumbai",
    description:
      "Smash cake setup, balloon arch backdrop and 60 guests. 150 colour-corrected images and a 60-second Instagram reel delivered within 24 hours.",
    highlights: ["Smash cake session", "150 edited photos", "Instagram reel", "24-hour delivery"],
  },
  {
    id: "case-3",
    title: "Sneha's Maternity Session",
    category: "Maternity Photography",
    location: "Bangalore",
    description:
      "Outdoor session at Lalbagh Garden, 32 weeks. Soft morning light, flowing gown and 3 outfit changes. 80 print-ready images.",
    highlights: ["Outdoor golden hour", "80 print-ready photos", "Female photographer", "3 outfits"],
  },
];

/**
 * PhotographyPortfolio
 * Case studies / portfolio section — placeholder structure.
 * Fill PORTFOLIO_ITEMS with real data and add real images via imageUrl.
 */
const PhotographyPortfolio = () => {
  return (
    <section
      className={styles.wrapper}
      aria-label="Photography portfolio and case studies"
    >
      <div className={styles.inner}>
        <h2 className={styles.heading}>Real Shoots, Real Results</h2>
        <p className={styles.subheading}>
          A look at some of the events we've helped document
        </p>

        <div className={styles.grid}>
          {PORTFOLIO_ITEMS.map((item) => (
            <div key={item.id} className={styles.card}>
              {/* Image placeholder — replace with <Image> once assets are ready */}
              <div className={styles.imagePlaceholder} aria-hidden="true">
                <span className={styles.placeholderLabel}>📷</span>
              </div>

              <div className={styles.cardBody}>
                <div className={styles.cardMeta}>
                  <span className={styles.category}>{item.category}</span>
                  <span className={styles.location}>{item.location}</span>
                </div>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <p className={styles.cardDesc}>{item.description}</p>

                <ul className={styles.highlights}>
                  {item.highlights.map((h, idx) => (
                    <li key={idx} className={styles.highlight}>
                      <span className={styles.checkMark} aria-hidden="true">✓</span>
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PhotographyPortfolio;
