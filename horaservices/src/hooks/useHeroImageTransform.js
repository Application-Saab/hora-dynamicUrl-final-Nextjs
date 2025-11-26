import { useEffect } from "react";

export function useHeroImageTransform(
  heroTransform,
  setHeroTransform,
  fileInputRef,
  dependency = []
) {
  useEffect(() => {
    const wrapper = document.getElementById("heroImage");
    const imgEl = wrapper?.querySelector(".template-image");
    if (!wrapper || !imgEl) return;

    wrapper.style.touchAction = "none";
    imgEl.style.touchAction = "none";

    let dragging = false;
    let startX = 0;
    let startY = 0;
    let offsetX = 0;
    let offsetY = 0;
    let moved = false;
    // Pinch Zoom Support
let pointers = new Map();
let startDistance = 0;
let startScale = heroTransform.scale;

const getDistance = (p1, p2) =>
  Math.hypot(p1.clientX - p2.clientX, p1.clientY - p2.clientY);

const onPointerDown = (e) => {
  pointers.set(e.pointerId, e);
};

const onPointerMove = (e) => {
  if (!pointers.has(e.pointerId)) return;
  pointers.set(e.pointerId, e);

  if (pointers.size === 2) {
    const [a, b] = Array.from(pointers.values());
    const distance = getDistance(a, b);

    if (!startDistance) {
      startDistance = distance;
      startScale = heroTransform.scale;
    }

    let newScale = startScale * (distance / startDistance);
    newScale = Math.min(3, Math.max(0.5, newScale));

    heroTransform.scale = newScale;
    setHeroTransform({ ...heroTransform });

    applyTransform();
  }
};

const onPointerUp = (e) => {
  pointers.delete(e.pointerId);
  if (pointers.size < 2) startDistance = 0;
};

    const getPos = (e) =>
      e.touches ? { x: e.touches[0].clientX, y: e.touches[0].clientY } : { x: e.clientX, y: e.clientY };

    const start = (e) => {
      const { x, y } = getPos(e);
      dragging = true;
      moved = false;
      startX = x - offsetX;
      startY = y - offsetY;
      imgEl.style.cursor = "grabbing";
    };
    const applyTransform = () => {
      imgEl.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${heroTransform.scale})`;
    };
    
    const move = (e) => {
      if (!dragging) return;
      const { x, y } = getPos(e);
      offsetX = x - startX;
      offsetY = y - startY;
      imgEl.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${heroTransform.scale})`;
      moved = true;
    };

    const end = () => {
      dragging = false;
      imgEl.style.cursor = "grab";
      setTimeout(() => (moved = false), 50);
    };
    const clampScale = (value) => Math.min(3, Math.max(0.5, value));

    const onWheel = (e) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      heroTransform.scale = clampScale(heroTransform.scale + delta);
      setHeroTransform((prev) => ({ ...prev, scale: heroTransform.scale }));
      applyTransform();
    };
    
    const onGesture = (e) => {
      if (e.scale === undefined) return;
      heroTransform.scale = clampScale(e.scale);
      setHeroTransform((prev) => ({ ...prev, scale: heroTransform.scale }));
      applyTransform();
    };
    const openUpload = (e) => {
      if (!moved) fileInputRef.current?.click();
      e.stopPropagation();
    };

    wrapper.addEventListener("mousedown", start);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", end);
    wrapper.addEventListener("touchstart", start, { passive: false });
    window.addEventListener("touchmove", move, { passive: false });
    window.addEventListener("touchend", end);
    wrapper.addEventListener("click", openUpload);
    wrapper.addEventListener("wheel", onWheel, { passive: false });
     wrapper.addEventListener("gesturechange", onGesture);
     imgEl.addEventListener("pointerdown", onPointerDown);
     imgEl.addEventListener("pointermove", onPointerMove);
     imgEl.addEventListener("pointerup", onPointerUp);
     imgEl.addEventListener("pointercancel", onPointerUp);

    return () => {
      wrapper.removeEventListener("mousedown", start);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", end);
      wrapper.removeEventListener("touchstart", start);
      window.removeEventListener("touchmove", move);
      window.removeEventListener("touchend", end);
      wrapper.removeEventListener("click", openUpload);
      wrapper.removeEventListener("wheel", onWheel);
wrapper.removeEventListener("gesturechange", onGesture);
    };
  }, [dependency]);

}
