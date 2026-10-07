"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

interface ContactDialogProps {
  open: boolean;
  onClose: () => void;
}

export function ContactDialog({ open, onClose }: ContactDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!open) return;

    setSubmitted(false);
    const previousActive = document.activeElement as HTMLElement | null;
    const timer = window.setTimeout(() => firstInputRef.current?.focus(), 60);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'input, textarea, button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );

      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", handleKeyDown);
      previousActive?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-[#0B0C0D]/65 p-4 backdrop-blur-md"
      data-cursor-theme="dark"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-dialog-title"
        data-cursor-theme="light"
        className="relative w-full max-w-[680px] rounded-[30px] border border-[#E5E6E9] bg-[#F5F5F5] p-6 shadow-2xl md:p-9"
      >
        <div className="mb-8 flex items-start justify-between gap-6">
          <div>
            <p className="mb-2 font-sora text-[11px] font-semibold uppercase tracking-[0.16em] text-[#818084]">
              Start a conversation
            </p>
            <h2
              id="contact-dialog-title"
              className="max-w-[520px] font-sora text-[30px] font-bold leading-tight tracking-[-0.03em] text-[#040404] md:text-[40px]"
            >
              Tell us what you are trying to build.
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close contact dialog"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[#D7D8DA] font-sora text-[18px] text-[#040404] transition-colors hover:bg-[#0B0D0E] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B0D0E]"
          >
            ×
          </button>
        </div>

        {submitted ? (
          <div className="rounded-[22px] border border-[#D7D8DA] bg-white p-7">
            <p className="font-sora text-[18px] font-semibold text-[#040404]">
              Prototype submitted.
            </p>
            <p className="mt-2 font-sora text-[14px] leading-relaxed text-[#505354]">
              This form is UI-only for now, so no message has been sent yet.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 rounded-full bg-[#0B0D0E] px-5 py-3 font-sora text-[13px] font-semibold text-white"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 font-sora text-[12px] font-semibold uppercase tracking-[0.08em] text-[#505354]">
                Name
                <input
                  ref={firstInputRef}
                  required
                  name="name"
                  autoComplete="name"
                  className="h-12 rounded-[14px] border border-[#D7D8DA] bg-white px-4 font-sora text-[14px] font-normal normal-case tracking-normal text-[#040404] outline-none transition focus:border-[#0B0D0E]"
                />
              </label>

              <label className="grid gap-2 font-sora text-[12px] font-semibold uppercase tracking-[0.08em] text-[#505354]">
                Email
                <input
                  required
                  type="email"
                  name="email"
                  autoComplete="email"
                  className="h-12 rounded-[14px] border border-[#D7D8DA] bg-white px-4 font-sora text-[14px] font-normal normal-case tracking-normal text-[#040404] outline-none transition focus:border-[#0B0D0E]"
                />
              </label>
            </div>

            <label className="grid gap-2 font-sora text-[12px] font-semibold uppercase tracking-[0.08em] text-[#505354]">
              Company
              <input
                required
                name="company"
                autoComplete="organization"
                className="h-12 rounded-[14px] border border-[#D7D8DA] bg-white px-4 font-sora text-[14px] font-normal normal-case tracking-normal text-[#040404] outline-none transition focus:border-[#0B0D0E]"
              />
            </label>

            <label className="grid gap-2 font-sora text-[12px] font-semibold uppercase tracking-[0.08em] text-[#505354]">
              What are you looking to build?
              <textarea
                required
                name="project"
                rows={5}
                className="resize-none rounded-[14px] border border-[#D7D8DA] bg-white px-4 py-3 font-sora text-[14px] font-normal normal-case tracking-normal text-[#040404] outline-none transition focus:border-[#0B0D0E]"
              />
            </label>

            <div className="mt-2 flex items-center justify-between gap-4">
              <span className="font-sora text-[11px] text-[#818084]">
                Prototype only — no data is sent.
              </span>
              <button
                type="submit"
                className="rounded-full bg-[#0B0D0E] px-6 py-3 font-sora text-[13px] font-semibold text-white transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Submit
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
