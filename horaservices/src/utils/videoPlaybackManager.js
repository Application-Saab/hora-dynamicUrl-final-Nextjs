class VideoPlaybackManager {
  constructor() {
    this.registry = new Map();
    this.activeId = null;
    this.observer = null;
  }

  ensureObserver() {
    if (this.observer || typeof window === "undefined") return;

    this.observer = new IntersectionObserver(
      (entries) => {
        let stateChanged = false;

        entries.forEach((entry) => {
          const id = entry.target.dataset.videoCardId;
          const record = this.registry.get(id);
          if (!record) return;

          const visibleNow =
            entry.isIntersecting &&
            entry.intersectionRatio >= record.minThreshold;

          if (record.isVisible !== visibleNow) {
            record.isVisible = visibleNow;
            stateChanged = true;
          }
        });

        if (stateChanged) {
          this.reconcile();
        }
      },
      {
        threshold: [0, 0.75, 0.98, 1.0],
      },
    );
  }

  register(id, el, minThreshold, setShouldPlay) {
    if (!el) return;
    this.ensureObserver();

    el.dataset.videoCardId = id;
    this.registry.set(id, {
      id,
      el,
      minThreshold,
      setShouldPlay,
      isVisible: false,
    });

    this.observer?.observe(el);
  }

  unregister(id) {
    const record = this.registry.get(id);
    if (!record) return;

    this.observer?.unobserve(record.el);
    this.registry.delete(id);

    if (this.activeId === id) {
      this.activeId = null;
      this.reconcile();
    }
  }

  getVisibleSorted() {
    const visible = [];
    this.registry.forEach((rec) => {
      if (rec.isVisible && rec.el) {
        const rect = rec.el.getBoundingClientRect();
        visible.push({ ...rec, top: rect.top, left: rect.left });
      }
    });

    visible.sort((a, b) => {
      if (Math.abs(a.top - b.top) > 15) return a.top - b.top;
      return a.left - b.left;
    });

    return visible;
  }

  reconcile() {
    const visibleList = this.getVisibleSorted();

    if (visibleList.length === 0) {
      this.activeId = null;
      this.registry.forEach((rec) => rec.setShouldPlay(false));
      return;
    }

    const stillVisible = visibleList.some((v) => v.id === this.activeId);
    if (!stillVisible) {
      this.activeId = visibleList[0].id;
    }

    this.registry.forEach((rec) => {
      rec.setShouldPlay(rec.id === this.activeId);
    });
  }

  notifyEnded(endedId) {
    const visibleList = this.getVisibleSorted();
    if (visibleList.length === 0) {
      this.activeId = null;
      return;
    }

    const currentIndex = visibleList.findIndex((v) => v.id === endedId);
    const nextIndex =
      currentIndex === -1 ? 0 : (currentIndex + 1) % visibleList.length;
    const nextId = visibleList[nextIndex].id;

    if (nextId === endedId) {
      const rec = this.registry.get(endedId);
      if (rec) {
        rec.setShouldPlay(false);
        requestAnimationFrame(() => rec.setShouldPlay(true));
      }
      return;
    }

    this.activeId = nextId;
    this.registry.forEach((rec) => {
      rec.setShouldPlay(rec.id === this.activeId);
    });
  }
}

export const videoPlaybackManager = new VideoPlaybackManager();
