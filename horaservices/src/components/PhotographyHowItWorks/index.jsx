import styles from "./PhotographyHowItWorks.module.css";

const PHOTOGRAPHY_STEPS = [
  {
    step: "1",
    title: "Browse & Choose",
    desc: "Pick the photography category that matches your event — birthday, wedding, maternity, corporate or more. Compare packages by price, hours and sample galleries.",
  },
  {
    step: "2",
    title: "Book Online in Minutes",
    desc: "Select your city and date, pay a small advance to confirm. No calls, no quotes to negotiate — what you see is what you pay.",
  },
  {
    step: "3",
    title: "Photographer Arrives",
    desc: "A verified local photographer arrives at your venue, fully equipped. You'll receive their contact details ahead of time so you can coordinate arrival.",
  },
  {
    step: "4",
    title: "Receive Your Gallery",
    desc: "Edited, colour-corrected photos are delivered via a permanent web gallery link within 24 hours. Share it instantly with anyone — no files to download or organise.",
  },
];

/**
 * PhotographyHowItWorks
 * Step-by-step guide for the photography booking flow.
 * Used on the landing page and category pages.
 */
const PhotographyHowItWorks = () => {
  return (
    <section className={styles.wrapper} aria-label="How HORA photography booking works">
      <div className={styles.inner}>
        <h2 className={styles.heading}>How It Works</h2>
        <p className={styles.subheading}>
          Book a professional photographer in 4 simple steps
        </p>

        <div className={styles.steps}>
          {PHOTOGRAPHY_STEPS.map((item) => (
            <div key={item.step} className={styles.step}>
              <div className={styles.stepNumber} aria-hidden="true">
                {item.step}
              </div>
              <div className={styles.stepContent}>
                <h3 className={styles.stepTitle}>{item.title}</h3>
                <p className={styles.stepDesc}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PhotographyHowItWorks;
