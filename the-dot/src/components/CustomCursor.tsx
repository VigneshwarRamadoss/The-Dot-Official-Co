"use client";

import { useEffect, useRef, useState } from "react";

type CursorTheme = "light" | "dark";

type CursorVariant =
  | "default"
  | "hover"
  | "view"
  | "drag"
  | "next"
  | "prev"
  | "beacon";

interface CursorState {
  text: string;
  variant: CursorVariant;
  visible: boolean;
}

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  const [theme, setTheme] =
    useState<CursorTheme>("light");

  const [cursorState, setCursorState] =
    useState<CursorState>({
      text: "",
      variant: "default",
      visible: false,
    });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const isTouch =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0;

    if (isTouch) return;

    let mouse = { x: 0, y: 0 };
    let pos = { x: 0, y: 0 };
    let velocity = { x: 0, y: 0 };

    setCursorState((prev) => ({
      ...prev,
      visible: true,
    }));

    const updateState = (
      next: CursorState
    ) => {
      setCursorState((prev) => {
        if (
          prev.text === next.text &&
          prev.variant === next.variant &&
          prev.visible === next.visible
        ) {
          return prev;
        }

        return next;
      });
    };

    const handleMouseMove = (
      event: MouseEvent
    ) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;

      const target =
        event.target as HTMLElement | null;

      if (!target) return;

      /*
      |--------------------------------------------------------------------------
      | FORM CONTROLS
      |--------------------------------------------------------------------------
      */

      if (
        target.closest(
          "input, textarea, select, [contenteditable='true']"
        )
      ) {
        updateState({
          text: "",
          variant: "default",
          visible: false,
        });

        return;
      }

      /*
      |--------------------------------------------------------------------------
      | BEACON
      |--------------------------------------------------------------------------
      |
      | ABSOLUTELY NO CUSTOM CURSOR.
      |
      | Not transparent.
      | Not faded.
      | Not 30%.
      |
      | REMOVED.
      |
      */

      const cursorElement =
        target.closest<HTMLElement>(
          "[data-cursor]"
        );

      const cursorType =
        cursorElement?.dataset.cursor;

      if (cursorType === "beacon") {
        updateState({
          text: "",
          variant: "beacon",
          visible: false,
        });

        return;
      }

      /*
      |--------------------------------------------------------------------------
      | THEME
      |--------------------------------------------------------------------------
      |
      | light background → dark cursor
      | dark background  → light cursor
      |
      */

      const themedElement =
        target.closest<HTMLElement>(
          "[data-cursor-theme]"
        );

      const detectedTheme =
        themedElement?.dataset
          .cursorTheme as CursorTheme | undefined;

      if (detectedTheme === "light") {
        setTheme("light");
      } else if (
        detectedTheme === "dark"
      ) {
        setTheme("dark");
      } else if (
        target.closest("#fullscreen-menu")
      ) {
        setTheme("dark");
      } else {
        setTheme("light");
      }

      /*
      |--------------------------------------------------------------------------
      | SEMANTIC CURSOR
      |--------------------------------------------------------------------------
      */

      const textElement =
        target.closest<HTMLElement>(
          "[data-cursor-text]"
        );

      const cursorText =
        textElement?.dataset.cursorText ?? "";

      if (
        cursorType === "view" ||
        cursorText === "VIEW"
      ) {
        updateState({
          text: cursorText || "VIEW",
          variant: "view",
          visible: true,
        });

        return;
      }

      if (cursorType === "drag") {
        updateState({
          text: cursorText || "DRAG",
          variant: "drag",
          visible: true,
        });

        return;
      }

      if (cursorType === "next") {
        updateState({
          text: cursorText || "NEXT",
          variant: "next",
          visible: true,
        });

        return;
      }

      if (cursorType === "prev") {
        updateState({
          text: cursorText || "PREV",
          variant: "prev",
          visible: true,
        });

        return;
      }

      if (
        target.closest(
          "a, button, [role='button'], input[type='submit']"
        )
      ) {
        updateState({
          text: cursorText,
          variant: "hover",
          visible: true,
        });

        return;
      }

      updateState({
        text: "",
        variant: "default",
        visible: true,
      });
    };

    const handleMouseLeave = () => {
      setCursorState((prev) => ({
        ...prev,
        visible: false,
      }));
    };

    window.addEventListener(
      "mousemove",
      handleMouseMove
    );

    document.addEventListener(
      "mouseleave",
      handleMouseLeave
    );

    let rafId = 0;

    const render = () => {
      velocity.x =
        (mouse.x - pos.x) * 0.18;

      velocity.y =
        (mouse.y - pos.y) * 0.18;

      pos.x += velocity.x;
      pos.y += velocity.y;

      if (cursorRef.current) {
        const speed = Math.hypot(
          velocity.x,
          velocity.y
        );

        const stretch = Math.min(
          0.26,
          speed * 0.012
        );

        const scaleX =
          1 + stretch;

        const scaleY =
          1 - stretch * 0.55;

        const angle =
          Math.atan2(
            velocity.y,
            velocity.x
          ) *
          (180 / Math.PI);

        cursorRef.current.style.transform = `
          translate3d(
            ${pos.x}px,
            ${pos.y}px,
            0
          )
          rotate(${angle}deg)
          scale(${scaleX}, ${scaleY})
        `;
      }

      rafId =
        requestAnimationFrame(render);
    };

    rafId =
      requestAnimationFrame(render);

    return () => {
      window.removeEventListener(
        "mousemove",
        handleMouseMove
      );

      document.removeEventListener(
        "mouseleave",
        handleMouseLeave
      );

      cancelAnimationFrame(rafId);
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | CRITICAL
  |--------------------------------------------------------------------------
  */

  if (
    !cursorState.visible ||
    cursorState.variant === "beacon"
  ) {
    return null;
  }

  const isLarge =
    cursorState.variant === "view" ||
    cursorState.variant === "drag" ||
    cursorState.variant === "next" ||
    cursorState.variant === "prev";

  /*
   * light = light background
   * therefore use DARK cursor
   */
  const darkCursor =
    theme === "light";

  let appearance = "";

  if (isLarge) {
    appearance = darkCursor
      ? `
        w-20 h-20
        -ml-10 -mt-10
        bg-[#0B0D0E]/92
        text-white
      `
      : `
        w-20 h-20
        -ml-10 -mt-10
        bg-white/92
        text-[#0B0D0E]
      `;
  } else if (
    cursorState.variant === "hover"
  ) {
    appearance = darkCursor
      ? `
        w-10 h-10
        -ml-5 -mt-5
        bg-[#0B0D0E]/10
        border border-[#0B0D0E]/25
      `
      : `
        w-10 h-10
        -ml-5 -mt-5
        bg-white/15
        border border-white/35
      `;
  } else {
    appearance = darkCursor
      ? `
        w-3 h-3
        -ml-1.5 -mt-1.5
        bg-[#0B0D0E]
      `
      : `
        w-3 h-3
        -ml-1.5 -mt-1.5
        bg-white
      `;
  }

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      className={`
        fixed
        left-0
        top-0

        z-[9999]

        pointer-events-none

        rounded-full

        flex
        items-center
        justify-center

        will-change-transform

        transition-[width,height,background-color,border-color]
        duration-200
        ease-out

        ${appearance}
      `}
    >
      {isLarge &&
        cursorState.text && (
          <span
            className={`
              text-[10px]
              font-semibold
              tracking-[0.12em]
              uppercase
              whitespace-nowrap

              ${
                darkCursor
                  ? "text-white"
                  : "text-[#0B0D0E]"
              }
            `}
          >
            {cursorState.text}
          </span>
        )}
    </div>
  );
}