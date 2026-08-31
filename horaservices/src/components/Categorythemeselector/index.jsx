import { useEffect, useState, useCallback } from "react";

import "./categorythemeselector.css";

export default function Categorythemeselector({
  themes = [],
  loading = false,
  error = null,
  maxSelect = 3,
  onSelectionChange,
}) {
  const [selectedIds, setSelectedIds] = useState([]);

  /*
   * Remove selected IDs which are
   * no longer available in themes
   * (e.g. themes prop changed/updated)
   */
  useEffect(() => {
    setSelectedIds((prev) =>
      prev.filter((id) =>
        themes.some((theme) => theme._id === id)
      )
    );
  }, [themes]);

  /*
   * Send selected themes to parent
   * whenever selection changes
   */
  useEffect(() => {
    const selectedThemes = themes.filter((theme) =>
      selectedIds.includes(theme._id)
    );

    onSelectionChange?.(selectedThemes);
  }, [selectedIds, themes, onSelectionChange]);

  /*
   * Select / Unselect Theme
   */
  const toggleTheme = useCallback(
    (id) => {
      setSelectedIds((prev) => {
        // Unselect
        if (prev.includes(id)) {
          return prev.filter((item) => item !== id);
        }

        // Maximum selection reached
        if (prev.length >= maxSelect) {
          return prev;
        }

        // Select
        return [...prev, id];
      });
    },
    [maxSelect]
  );

  return (
    <div className="theme-selector-wrapper">

      {/* Header */}
      <div className="theme-header">
        <h1 className="theme-title">
          Choose Your Baby Shoot Theme
        </h1>

        <p className="theme-subtitle">
          Select any {maxSelect} unique theme
          {maxSelect > 1 ? "s" : ""} as per your choice
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="theme-loading-row">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="theme-skeleton-card" />
          ))}
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="theme-error-box">
          Couldn&apos;t load themes: {error}
        </div>
      )}

      {/* Empty */}
      {!loading && !error && themes.length === 0 && (
        <div className="theme-empty-box">
          No themes available for this package.
        </div>
      )}

      {/* Theme Cards */}
      {!loading && !error && themes.length > 0 && (
        <div className="theme-cards-row">
          {themes.map((theme) => {
            const isSelected = selectedIds.includes(theme._id);
            const isDisabled = !isSelected && selectedIds.length >= maxSelect;

            const cardClass = [
              "theme-card",
              isSelected ? "theme-card-selected" : "",
              isDisabled ? "theme-card-disabled" : "",
            ]
              .filter(Boolean)
              .join(" ");

            const checkboxClass = [
              "theme-checkbox",
              isSelected ? "theme-checkbox-active" : "",
            ]
              .filter(Boolean)
              .join(" ");

            return (
              <div key={theme._id} className={cardClass}>
                {/* Image */}
                <div className="theme-image-box">
                  {theme.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={`https://horaservices.com/api/uploads/compressed_webp/${theme.image}`}
                      alt={theme.title || "Theme"}
                      className="theme-image"
                      loading="lazy"
                    />
                  ) : (
                    <div className="theme-no-image">No image</div>
                  )}
                </div>

                {/* Title */}
                <h3 className="theme-card-title">{theme.title}</h3>

                {/* Select Button */}
                <button
                  type="button"
                  disabled={isDisabled}
                  onClick={() => toggleTheme(theme._id)}
                  className="theme-select-btn"
                >
                  <span className={checkboxClass}>
                    {isSelected && (
                      <svg
                        viewBox="0 0 16 16"
                        className="theme-check-icon"
                        fill="currentColor"
                      >
                        <path d="M6.2 11.2 3.4 8.4l1.1-1.1 1.7 1.7 4.3-4.3 1.1 1.1z" />
                      </svg>
                    )}
                  </span>
                  Select Theme
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}