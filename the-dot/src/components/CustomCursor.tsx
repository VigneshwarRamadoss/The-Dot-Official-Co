"use client";

import { useEffect, useRef, useState } from "react";

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorTextRef = useRef<HTMLSpanElement>(null);
  const [cursorState, setCursorState] = useState<{
    text: string;
    variant: "default" | "hover" | "view" | "drag" | "next" | "prev";
    visible: boolean;
  }>({
    text: "",
    variant: "default",
    visible: false,
  });

  useEffect(() => {
    // Disable on mobile/touch devices or reduced motion
    if (typeof window === "undefined") return;
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (isTouch || prefersReducedMotion) return;

    setCursorState((s) => ({ ...s, visible: true }));

    let pos = { x: 0, y: 0 };
    let mouse = { x: 0, y: 0 };
    let speed = { x: 0, y: 0 };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      // Check element under cursor for cursor attributes
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Check if target or parent is text input or form
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable ||
        target.closest("input, textarea, select")
      ) {
        setCursorState((s) => ({ ...s, visible: false }));
        return;
      } else {
        setCursorState((s) => ({ ...s, visible: true }));
      }

      const cursorAttr = target.closest("[data-cursor]")?.getAttribute("data-cursor");
      const cursorText = target.closest("[data-cursor-text]")?.getAttribute("data-cursor-text");

      if (cursorAttr === "view" || cursorText === "VIEW") {
        setCursorState({ text: cursorText || "VIEW", variant: "view", visible: true });
      } else if (cursorAttr === "drag") {
        setCursorState({ text: "DRAG", variant: "drag", visible: true });
      } else if (cursorAttr === "next") {
        setCursorState({ text: "NEXT", variant: "next", visible: true });
      } else if (cursorAttr === "prev") {
        setCursorState({ text: "PREV", variant: "prev", visible: true });
      } else if (
        target.closest("a, button, [role='button'], input[type='submit']")
      ) {
        setCursorState({ text: "", variant: "hover", visible: true });
      } else {
        setCursorState({ text: "", variant: "default", visible: true });
      }
    };

    const handleMouseLeave = () => {
      setCursorState((s) => ({ ...s, visible: false }));
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    let rafId: number;

    const render = () => {
      speed.x = (mouse.x - pos.x) * 0.15;
      speed.y = (mouse.y - pos.y) * 0.15;

      pos.x += speed.x;
      pos.y += speed.y;

      if (cursorRef.current) {
        const vel = Math.hypot(speed.x, speed.y);
        const scaleX = Math.min(1.4, Math.max(0.8, 1 + vel * 0.015));
        const scaleY = Math.min(1.4, Math.max(0.8, 1 - vel * 0.015));
        const angle = Math.atan2(speed.y, speed.x) * (180 / Math.PI);

        cursorRef.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) rotate(${angle}deg) scale(${scaleX}, ${scaleY})`;
      }

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(rafId);
    };
  }, []);

  if (!cursorState.visible) return null;

  const isViewOrCustom = cursorState.variant === "view" || cursorState.variant === "drag" || cursorState.variant === "next" || cursorState.variant === "prev";

  return (
    <div
      ref={cursorRef}
      className={`fixed top-0 left-0 pointer-events-none z-[9999] -ml-3 -mt-3 flex items-center justify-center rounded-full transition-all duration-200 ease-out ${
        isViewOrCustom
          ? "w-20 h-20 bg-[#0B0D0E]/90 text-white backdrop-blur-sm -ml-10 -mt-10"
          : cursorState.variant === "hover"
          ? "w-10 h-10 bg-[#0B0D0E]/20 border border-[#0B0D0E]/40 -ml-5 -mt-5"
          : "w-3 h-3 bg-[#0B0D0E] shadow-sm"
      }`}
    >
      {isViewOrCustom && (
        <span
          ref={cursorTextRef}
          className="text-[11px] font-semibold tracking-wider text-white uppercase"
        >
          {cursorState.text}
        </span>
      )}
    </div>
  );
}
