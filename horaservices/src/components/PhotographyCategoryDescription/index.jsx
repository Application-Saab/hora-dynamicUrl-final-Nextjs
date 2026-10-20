import styles from "./PhotographyCategoryDescription.module.css";

/**
 * PhotographyCategoryDescription
 * Renders the long-form category description below the product grid.
 * Data comes from photographyCategoryDescriptions.js
 *
 * Props:
 *   description: { intro, sections: [{ heading, body }], closingCta }
 *   catLabel: string — display name for the category (e.g. "Birthday Photography")
 *   city: string | null — city name for localisation
 */
const PhotographyCategoryDescription = ({ description, catLabel, city }) => {
  if (!description) return null;

  const { intro, sections = [], closingCta } = description;
  const cityLabel = city
    ? ` in ${String(city).replace(/\b\w/g, (c) => c.toUpperCase())}`
    : "";

  return (
    <section className={styles.wrapper} aria-label={`About ${catLabel}`}>
      <div className={styles.inner}>
        <h2 className={styles.sectionTitle}>
          {catLabel}
          {cityLabel} — Everything You Need to Know
        </h2>

        {intro && <p className={styles.intro}>{intro}</p>}

        {sections.map((section, idx) => (
          <div key={idx} className={styles.section}>
            <h3 className={styles.sectionHeading}>{section.heading}</h3>
            <p className={styles.sectionBody}>{section.body}</p>
          </div>
        ))}

        {closingCta && (
          <p className={styles.closingCta}>{closingCta}</p>
        )}
      </div>
    </section>
  );
};

export default PhotographyCategoryDescription;
