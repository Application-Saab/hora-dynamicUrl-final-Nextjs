"use client";
import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import ArrowImg from "../../../assets/arrow.svg";
import nextIcon from "../../../assets/nextIcon.svg";
import Image from "next/image";
import "./VenueImagePopup.css";

const PrevArrow = ({ className, onClick }) => (
  <div className={`${className} custom-arrow prev-arrow`} onClick={onClick}>
    <Image src={ArrowImg} alt="Back" width={30} height={30} />
  </div>
);

const NextArrow = ({ className, onClick }) => (
  <div className={`${className} custom-arrow next-arrow`} onClick={onClick}>
    <Image src={nextIcon} alt="Next" width={30} height={30} />
  </div>
);

const pauseAllVideos = () => {
  const videos = document.querySelectorAll(".venue-img-pop-content video");
  videos.forEach((video) => {
    video.pause();
    video.currentTime = 0;
  });
};

const MAX_SCALE = 4;
const DOUBLE_TAP_SCALE = 2.5;
const isVideoItem = (item) => item?.type === "video";

/* -------------------------------------------------------------------------- */
/*  ZoomableImage: pinch / wheel / double-tap zoom (focal point based)         */
/*  - transform direct DOM pe lagta hai (no React re-render while zooming)     */
/*  - sirf isi slide ka transform change hota hai                              */
/* -------------------------------------------------------------------------- */
const ZoomableImage = memo(function ZoomableImage({
  src,
  alt,
  active,
  onZoomChange,
}) {
  const viewportRef = useRef(null);
  const layerRef = useRef(null);
  const t = useRef({ scale: 1, tx: 0, ty: 0 });
  const rafRef = useRef(null);
  const zoomedRef = useRef(false);
  const cbRef = useRef(onZoomChange);
  const resetRef = useRef(null);
  cbRef.current = onZoomChange;

  useEffect(() => {
    const viewport = viewportRef.current;
    const layer = layerRef.current;
    if (!viewport || !layer) return;

    const render = () => {
      rafRef.current = null;
      const { scale, tx, ty } = t.current;
      layer.style.transform =
        scale === 1 ? "" : `translate3d(${tx}px, ${ty}px, 0) scale(${scale})`;
    };
    const schedule = () => {
      if (rafRef.current == null)
        rafRef.current = requestAnimationFrame(render);
    };
    const notify = () => {
      const z = t.current.scale > 1.01;
      if (z !== zoomedRef.current) {
        zoomedRef.current = z;
        cbRef.current && cbRef.current(z);
      }
    };
    const clampPan = () => {
      const s = t.current;
      const w = viewport.clientWidth;
      const h = viewport.clientHeight;
      s.tx = Math.min(0, Math.max(w - w * s.scale, s.tx));
      s.ty = Math.min(0, Math.max(h - h * s.scale, s.ty));
    };
    const local = (cx, cy) => {
      const r = viewport.getBoundingClientRect();
      return { x: cx - r.left, y: cy - r.top };
    };

    // (fx, fy) = viewport ke andar wo point jo zoom ke time fixed rahega
    const zoomTo = (next, fx, fy) => {
      const s = t.current;
      let ns = Math.min(MAX_SCALE, Math.max(1, next));
      if (ns < 1.02) ns = 1;
      const r = ns / s.scale;
      s.tx = fx - (fx - s.tx) * r;
      s.ty = fy - (fy - s.ty) * r;
      s.scale = ns;
      if (ns === 1) {
        s.tx = 0;
        s.ty = 0;
      } else {
        clampPan();
      }
      notify();
      schedule();
    };

    resetRef.current = () => {
      t.current = { scale: 1, tx: 0, ty: 0 };
      notify();
      schedule();
    };

    /* ----------------------------- touch ----------------------------- */
    let pinch = null;
    let pan = null;
    let gestureLock = false; // pinch ke baad saari ungliyan uthne tak slick ko events nahi jayenge
    let tapStart = null;
    let lastTap = null;

    const dist = (a, b) =>
      Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
    const mid = (a, b) =>
      local((a.clientX + b.clientX) / 2, (a.clientY + b.clientY) / 2);

    const onTouchStart = (e) => {
      if (e.touches.length === 2) {
        e.stopPropagation();
        gestureLock = true;
        const m = mid(e.touches[0], e.touches[1]);
        pinch = { d: dist(e.touches[0], e.touches[1]), mx: m.x, my: m.y };
        pan = null;
        tapStart = null;
      } else if (e.touches.length === 1) {
        const p = e.touches[0];
        tapStart = { x: p.clientX, y: p.clientY, time: Date.now() };
        if (t.current.scale > 1) {
          e.stopPropagation(); // zoomed hai to slick swipe nahi karega
          pan = { x: p.clientX, y: p.clientY };
        }
      }
    };

    const onTouchMove = (e) => {
      if (gestureLock) e.stopPropagation();

      if (pinch && e.touches.length === 2) {
        e.preventDefault();
        const d = dist(e.touches[0], e.touches[1]);
        const m = mid(e.touches[0], e.touches[1]);
        const s = t.current;
        s.tx += m.x - pinch.mx; // do ungliyon ka beech ka point hilne se pan
        s.ty += m.y - pinch.my;
        zoomTo(s.scale * (d / pinch.d), m.x, m.y);
        pinch.d = d;
        pinch.mx = m.x;
        pinch.my = m.y;
        return;
      }

      if (pan && e.touches.length === 1 && t.current.scale > 1) {
        e.stopPropagation();
        e.preventDefault();
        const p = e.touches[0];
        const s = t.current;
        s.tx += p.clientX - pan.x;
        s.ty += p.clientY - pan.y;
        pan = { x: p.clientX, y: p.clientY };
        clampPan();
        schedule();
      }
    };

    const onTouchEnd = (e) => {
      if (gestureLock) e.stopPropagation();
      if (e.touches.length < 2) pinch = null;

      if (e.touches.length === 1 && t.current.scale > 1) {
        pan = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }

      if (e.touches.length === 0) {
        pan = null;
        if (t.current.scale > 1 && t.current.scale < 1.05) zoomTo(1, 0, 0);

        // double tap
        const ct = e.changedTouches[0];
        if (!gestureLock && tapStart && ct) {
          const now = Date.now();
          const moved = Math.hypot(
            ct.clientX - tapStart.x,
            ct.clientY - tapStart.y,
          );
          if (moved < 10 && now - tapStart.time < 300) {
            if (
              lastTap &&
              now - lastTap.time < 300 &&
              Math.hypot(ct.clientX - lastTap.x, ct.clientY - lastTap.y) < 30
            ) {
              const p = local(ct.clientX, ct.clientY);
              if (t.current.scale > 1) zoomTo(1, p.x, p.y);
              else zoomTo(DOUBLE_TAP_SCALE, p.x, p.y);
              lastTap = null;
            } else {
              lastTap = { x: ct.clientX, y: ct.clientY, time: now };
            }
          }
        }
        gestureLock = false;
        tapStart = null;
      }
    };

    /* ----------------------------- mouse ----------------------------- */
    const onWheel = (e) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && t.current.scale === 1)
        return;
      e.preventDefault();
      const p = local(e.clientX, e.clientY);
      const k = e.ctrlKey ? 0.01 : 0.0025; // ctrlKey = trackpad pinch
      zoomTo(t.current.scale * Math.exp(-e.deltaY * k), p.x, p.y);
    };

    let drag = null;
    const onMouseMove = (e) => {
      if (!drag) return;
      const s = t.current;
      s.tx += e.clientX - drag.x;
      s.ty += e.clientY - drag.y;
      drag = { x: e.clientX, y: e.clientY };
      clampPan();
      schedule();
    };
    const onMouseUp = () => {
      drag = null;
      viewport.classList.remove("venue-img-pop-is-grabbing");
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
    const onMouseDown = (e) => {
      if (e.button !== 0 || t.current.scale <= 1) return;
      e.stopPropagation(); // slick ka mouse-drag nahi chalega
      e.preventDefault();
      drag = { x: e.clientX, y: e.clientY };
      viewport.classList.add("venue-img-pop-is-grabbing");
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    };
    const onDblClick = (e) => {
      const p = local(e.clientX, e.clientY);
      if (t.current.scale > 1) zoomTo(1, p.x, p.y);
      else zoomTo(DOUBLE_TAP_SCALE, p.x, p.y);
    };

    viewport.addEventListener("touchstart", onTouchStart, { passive: true });
    viewport.addEventListener("touchmove", onTouchMove, { passive: false });
    viewport.addEventListener("touchend", onTouchEnd, { passive: true });
    viewport.addEventListener("touchcancel", onTouchEnd, { passive: true });
    viewport.addEventListener("wheel", onWheel, { passive: false });
    viewport.addEventListener("mousedown", onMouseDown);
    viewport.addEventListener("dblclick", onDblClick);

    return () => {
      viewport.removeEventListener("touchstart", onTouchStart);
      viewport.removeEventListener("touchmove", onTouchMove);
      viewport.removeEventListener("touchend", onTouchEnd);
      viewport.removeEventListener("touchcancel", onTouchEnd);
      viewport.removeEventListener("wheel", onWheel);
      viewport.removeEventListener("mousedown", onMouseDown);
      viewport.removeEventListener("dblclick", onDblClick);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      if (zoomedRef.current) {
        zoomedRef.current = false;
        cbRef.current && cbRef.current(false);
      }
    };
  }, []);

  // slide change hone par zoom reset
  useEffect(() => {
    if (!active && resetRef.current) resetRef.current();
  }, [active]);

  return (
    <div ref={viewportRef} className="venue-img-pop-zoom-viewport">
      <div ref={layerRef} className="venue-img-pop-zoom-layer">
        <img src={src} alt={alt} loading="lazy" draggable={false} />
      </div>
    </div>
  );
});

/* -------------------------------------------------------------------------- */
/*  Thumbnail strip                                                            */
/* -------------------------------------------------------------------------- */
const ThumbItem = memo(function ThumbItem({ item, index, isActive, onSelect }) {
  const poster =
    item?.postSmallThumbUrl ||
    item?.postWebpUrl ||
    item?.thumbnailImageUrl ||
    "";
  const video = isVideoItem(item);
  const fallback = poster || item?.postUrl || item?.originalUrl;

  return (
    <button
      type="button"
      data-index={index}
      className={`venue-img-pop-thumb-item ${isActive ? "venue-img-pop-active" : ""}`}
      onClick={() => onSelect(index)}
      aria-label={`Go to media ${index + 1}`}
    >
      {video && !poster ? (
        <video
          src={`${item?.postUrl || item?.originalUrl}#t=0.1`}
          preload="metadata"
          muted
          playsInline
          tabIndex={-1}
        />
      ) : (
        <img
          src={fallback}
          alt=""
          loading="lazy"
          decoding="async"
          draggable={false}
        />
      )}
      {video && (
        <span className="venue-img-pop-thumb-play" aria-hidden="true" />
      )}
    </button>
  );
});

const ThumbnailStrip = ({ images, selectedIndex, onSelect }) => {
  const ref = useRef(null);
  const firstRun = useRef(true);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const el = c.querySelector(`[data-index="${selectedIndex}"]`);
    if (!el) return;
    const left = el.offsetLeft + el.offsetWidth / 2 - c.clientWidth / 2;
    c.scrollTo({ left, behavior: firstRun.current ? "auto" : "smooth" });
    firstRun.current = false;
  }, [selectedIndex]);

  if (images.length < 2) return null;

  return (
    <div
      ref={ref}
      className={`venue-img-pop-thumb-strip ${
        images.length <= 5 ? "venue-img-pop-thumb-strip--few" : ""
      }`}
    >
      {images.map((item, i) => (
        <ThumbItem
          key={item?._id || item?.id || i}
          item={item}
          index={i}
          isActive={i === selectedIndex}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
};
/* -------------------------------------------------------------------------- */

const VenueImagePopup = ({
  images = [],
  selectedIndex,
  setSelectedIndex,
  renderActions,
  onClose,
  renderFooter,
  isEventWall = false,
}) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const slickRef = useRef(null);

  const handleZoomChange = useCallback((z) => setIsZoomed(z), []);

  const sliderSettings = {
    dots: false,
    infinite: images.length > 1,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: false,
    arrows: false, // New UI me arrows nahi hain (PrevArrow/NextArrow upar defined hain)
    swipe: !isZoomed, // zoomed ho to slide swipe band
    draggable: !isZoomed,
    // prevArrow: <PrevArrow />,
    // nextArrow: <NextArrow />,
    beforeChange: (current, next) => {
      pauseAllVideos();
      setImageNumber(next + 1);
      setSelectedIndex(next);
    },

    afterChange: () => {
      playActiveVideo();
    },
  };
  useEffect(() => {
    if (selectedIndex === null) {
      pauseAllVideos();
      setIsZoomed(false);
    }
  }, [selectedIndex]);

  const playActiveVideo = () => {
    const activeVideo = document.querySelector(
      ".venue-img-pop-slider-wrapper .slick-current video",
    );
    if (!activeVideo) return;

    activeVideo.currentTime = 0;

    const playWhenReady = () => {
      activeVideo.play().catch(console.error);
    };

    if (activeVideo.readyState >= 2) {
      playWhenReady();
    } else {
      activeVideo.addEventListener("loadeddata", playWhenReady, { once: true });
    }
  };

  const sliderRef = useRef(null);
  const [imageNumber, setImageNumber] = useState(0);
  const isVideoFile = (url = "") => /\.(mp4|mov|avi|mkv|webm|ogg)$/i.test(url);

  useEffect(() => {
    if (selectedIndex !== null) {
      setImageNumber(selectedIndex + 1);
      // Slight delay to ensure slider is mounted and classes are applied
      setTimeout(() => {
        playActiveVideo();
      }, 0);
    }
  }, [selectedIndex]);

  useEffect(() => {
    if (selectedIndex === null) {
      pauseAllVideos();
    }
  }, [selectedIndex]);

  useEffect(() => {
    if (!sliderRef.current) return;

    const videos = sliderRef.current.querySelectorAll("video");

    videos.forEach((video) => {
      const isActive = video
        .closest(".slick-slide")
        ?.classList.contains("slick-current");

      if (isActive) {
        video.muted = false;
        video.play().catch(() => {});
      } else {
        video.pause();
        video.currentTime = 0;
        video.muted = true;
      }
    });
  }, [selectedIndex]);

  useEffect(() => {
    if (selectedIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => (document.body.style.overflow = "");
  }, [selectedIndex]);

  // Desktop keyboard: ← → Esc
  useEffect(() => {
    if (selectedIndex === null) return;
    const onKey = (e) => {
      if (e.key === "ArrowLeft") slickRef.current?.slickPrev();
      else if (e.key === "ArrowRight") slickRef.current?.slickNext();
      else if (e.key === "Escape") onClose && onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedIndex, onClose]);

  const handleThumbSelect = useCallback((i) => {
    slickRef.current?.slickGoTo(i);
  }, []);

  if (selectedIndex === null || !images[selectedIndex]) return null;

return (
  <div
    className="venue-img-pop-overlay"
    onClick={() => setSelectedIndex(null)}
    role="dialog"
    aria-modal="true"
    style={{ zIndex: 10000 }}
  >
    <div className="venue-img-pop-content" onClick={(e) => e.stopPropagation()}>
      <div className="venue-img-pop-header">
        {/* OLD HEADER
        <div className="venue-img-pop-header-left">
          <button className="venue-img-pop-close" onClick={onClose}>
            <Image src={Crossicon} alt="Close" width={18} height={18} />
          </button>
          <div className="venue-img-pop-index">
            {`${imageNumber} / ${images.length}`}
          </div>
        </div>
        */}
        <div className="venue-img-pop-header-left">
          <button
            className="venue-img-pop-back-pill"
            onClick={onClose}
            aria-label="Close"
          >
            <span className="venue-img-pop-back-circle">
              <Image src={ArrowImg} alt="Back" width={16} height={16} />
            </span>
            <span className="venue-img-pop-index">
              {`${imageNumber} / ${images.length}`}
            </span>
          </button>
        </div>

        {renderActions && renderActions(images[selectedIndex], selectedIndex)}
      </div>

      {/* Slider */}
      <div className="venue-img-pop-slider-wrapper">
        <Slider
          {...sliderSettings}
          ref={slickRef}
          initialSlide={selectedIndex}
          key="eventwall-slider"
        >
          {images.map((item, idx) => {
            const isVisible = Math.abs(idx - selectedIndex) <= 1;

            if (!isVisible) {
              return <div key={idx} />;
            }

            const isVideo = item.type === "video";

            return (
              <div key={item._id || idx} className="venue-img-pop-slide-item">
                {isVideo ? (
                  <video
                    src={isEventWall ? item?.postUrl : item.originalUrl}
                    controls
                    playsInline
                    muted={false}
                    preload="metadata"
                    style={{
                      maxHeight: "100%",
                      maxWidth: "100%",
                      width: "100%",
                      objectFit: "contain",
                      background: "#000",
                    }}
                  />
                ) : (
                  <ZoomableImage
                    src={
                      isEventWall
                        ? item?.postWebpUrl || item?.postUrl
                        : item.thumbnailImageUrl || item.originalUrl
                    }
                    alt={`Media ${idx + 1}`}
                    active={idx === selectedIndex}
                    onZoomChange={handleZoomChange}
                  />
                )}
              </div>
            );
          })}
        </Slider>
      </div>

      <ThumbnailStrip
        images={images}
        selectedIndex={selectedIndex}
        onSelect={handleThumbSelect}
      />

      <div className="venue-img-pop-footer">
        {renderFooter && renderFooter(images[selectedIndex], selectedIndex)}
      </div>
    </div>
  </div>
);
};

export default VenueImagePopup;
