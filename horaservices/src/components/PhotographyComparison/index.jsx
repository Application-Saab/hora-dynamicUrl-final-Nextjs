import styles from "./PhotographyComparison.module.css";

const COMPARISON_ROWS = [
  {
    aspect: "Price clarity",
    hora: "Fixed package price shown upfront. No surprises.",
    freelancer: "Quoted on call. Often changes after the shoot.",
  },
  {
    aspect: "Booking",
    hora: "Book online in minutes. Advance payment confirms the slot.",
    freelancer: "Multiple calls, negotiation, then a WhatsApp confirmation.",
  },
  {
    aspect: "Vetting",
    hora: "Every photographer is verified with portfolio checks.",
    freelancer: "You rely on referrals or Instagram profiles alone.",
  },
  {
    aspect: "Delivery time",
    hora: "Edited gallery delivered within 24 hours.",
    freelancer: "Typically 3–15 days. No contractual commitment.",
  },
  {
    aspect: "Gallery access",
    hora: "Permanent shareable web gallery. No files to manage.",
    freelancer: "Google Drive or WeTransfer links that expire.",
  },
  {
    aspect: "Backup & support",
    hora: "If your photographer can't make it, we arrange a replacement.",
    freelancer: "Last-minute cancellations with no recourse.",
  },
  {
    aspect: "Editing quality",
    hora: "Colour correction included in every package.",
    freelancer: "Varies. Basic edits often cost extra.",
  },
];

/**
 * PhotographyComparison
 * "HORA vs hiring a freelance photographer" table.
 * Used on the photography landing page.
 */
const PhotographyComparison = () => {
  return (
    <section
      className={styles.wrapper}
      aria-label="HORA photography vs freelance photographer comparison"
    >
      <div className={styles.inner}>
        <h2 className={styles.heading}>
          Why book through HORA?
        </h2>
        <p className={styles.subheading}>
          How we compare to hiring a freelance photographer directly
        </p>

        <div className={styles.table} role="table" aria-label="Comparison table">
          {/* Header */}
          <div className={styles.headerRow} role="row">
            <div className={styles.headerAspect} role="columnheader">
              &nbsp;
            </div>
            <div className={`${styles.headerCell} ${styles.horaHeader}`} role="columnheader">
              <span className={styles.horaTag}>HORA</span>
            </div>
            <div className={`${styles.headerCell} ${styles.freelancerHeader}`} role="columnheader">
              Freelancer
            </div>
          </div>

          {/* Rows */}
          {COMPARISON_ROWS.map((row, idx) => (
            <div
              key={idx}
              className={`${styles.row} ${idx % 2 === 0 ? styles.rowAlt : ""}`}
              role="row"
            >
              <div className={styles.aspect} role="rowheader">
                {row.aspect}
              </div>
              <div className={`${styles.cell} ${styles.horaCell}`} role="cell">
                <span className={styles.checkIcon} aria-hidden="true">✓</span>
                {row.hora}
              </div>
              <div className={`${styles.cell} ${styles.freelancerCell}`} role="cell">
                {row.freelancer}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PhotographyComparison;
