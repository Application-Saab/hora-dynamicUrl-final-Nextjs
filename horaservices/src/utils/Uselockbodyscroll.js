"use client";
import { useLayoutEffect } from "react";

export function useLockBodyScroll(locked = true) {
  useLayoutEffect(() => {
    if (!locked) return;

    const scrollY = window.scrollY;
    const { body } = document;

    const original = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
      overflow: body.style.overflow,
    };

    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
    body.style.overflow = "hidden";

    return () => {
      body.style.position = original.position;
      body.style.top = original.top;
      body.style.left = original.left;
      body.style.right = original.right;
      body.style.width = original.width;
      body.style.overflow = original.overflow;
      // scroll position exactly wahin restore karo jahan se lock hua tha
      window.scrollTo(0, scrollY);
    };
  }, [locked]);
}