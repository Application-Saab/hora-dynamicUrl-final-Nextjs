import "./PhotographyComparison.css";

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

const PhotographyComparison = () => {
  return (
    <section
      className="photography-comparison"
      aria-label="HORA photography vs freelance photographer comparison"
    >
      <div className="photography-comparison__inner">
        <h2 className="photography-comparison__heading">
          Why book through HORA?
        </h2>

        <p className="photography-comparison__subheading">
          How we compare to hiring a freelance photographer directly
        </p>

        <div
          className="photography-comparison__table"
          role="table"
          aria-label="Comparison table"
        >
          {/* Header */}
          <div
            className="photography-comparison__header-row"
            role="row"
          >
            <div
              className="photography-comparison__header-aspect"
              role="columnheader"
            >
              &nbsp;
            </div>

            <div
              className="photography-comparison__header-cell photography-comparison__hora-header"
              role="columnheader"
            >
              <span className="photography-comparison__hora-tag">
                HORA
              </span>
            </div>

            <div
              className="photography-comparison__header-cell photography-comparison__freelancer-header"
              role="columnheader"
            >
              photographers
            </div>
          </div>

          {/* Rows */}
          {COMPARISON_ROWS.map((row, idx) => (
            <div
              key={row.aspect}
              className={`photography-comparison__row ${
                idx % 2 === 0
                  ? "photography-comparison__row-alt"
                  : ""
              }`}
              role="row"
            >
              <div
                className="photography-comparison__aspect"
                role="rowheader"
              >
                {row.aspect}
              </div>

              <div
                className="photography-comparison__cell photography-comparison__hora-cell"
                role="cell"
              >
                <span
                  className="photography-comparison__check-icon"
                  aria-hidden="true"
                >
                  ✓
                </span>
                {row.hora}
              </div>

              <div
                className="photography-comparison__cell photography-comparison__freelancer-cell"
                role="cell"
              >
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