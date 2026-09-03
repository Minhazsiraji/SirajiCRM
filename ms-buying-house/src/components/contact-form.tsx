"use client";

import { useState } from "react";
import { ArrowRight, Check } from "./icons";
import { categories } from "@/content/products";

type Status = "idle" | "sending" | "sent" | "error";

const field =
  "h-12 w-full rounded-xl border border-ink-200 bg-white px-4 text-[15px] text-ink-900 placeholder:text-ink-300 transition-colors focus:border-brand-500 focus:outline-none";
const label = "mb-2 block text-[13px] font-semibold text-ink-700";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setError(null);

    const payload = Object.fromEntries(new FormData(event.currentTarget));

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };

      if (!res.ok || !data.ok) {
        throw new Error(data.error ?? "Something went wrong.");
      }
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setError(
        err instanceof Error ? err.message : "Something went wrong.",
      );
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-2xl border border-brand-200 bg-brand-50 p-8 sm:p-10">
        <span className="grid size-11 place-items-center rounded-full bg-brand-500 text-white">
          <Check width={20} height={20} strokeWidth={2} />
        </span>
        <h3 className="mt-5 font-display text-2xl font-semibold text-ink-900">
          Thank you — your enquiry is in.
        </h3>
        <p className="mt-3 max-w-md text-[15px] leading-relaxed text-ink-600">
          A merchandiser from the sourcing desk will reply within one working
          day (Sun–Thu, GMT+6). If your enquiry is urgent, call or message us on
          WhatsApp and reference your company name.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5 sm:grid-cols-2">
      <div>
        <label className={label} htmlFor="name">
          Your name *
        </label>
        <input id="name" name="name" required className={field} placeholder="Jane Whitfield" />
      </div>

      <div>
        <label className={label} htmlFor="company">
          Company *
        </label>
        <input id="company" name="company" required className={field} placeholder="Whitfield Apparel Ltd." />
      </div>

      <div>
        <label className={label} htmlFor="email">
          Work email *
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className={field}
          placeholder="jane@whitfield.com"
        />
      </div>

      <div>
        <label className={label} htmlFor="country">
          Country
        </label>
        <input id="country" name="country" className={field} placeholder="United Kingdom" />
      </div>

      <div>
        <label className={label} htmlFor="category">
          Product category
        </label>
        <select id="category" name="category" className={`${field} appearance-none`} defaultValue="">
          <option value="">Select a category</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.title}>
              {c.title}
            </option>
          ))}
          <option value="Other">Something else</option>
        </select>
      </div>

      <div>
        <label className={label} htmlFor="quantity">
          Approximate quantity
        </label>
        <input id="quantity" name="quantity" className={field} placeholder="5,000 pcs across 3 colours" />
      </div>

      <div className="sm:col-span-2">
        <label className={label} htmlFor="message">
          Tell us about the programme *
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="w-full resize-y rounded-xl border border-ink-200 bg-white px-4 py-3.5 text-[15px] text-ink-900 placeholder:text-ink-300 transition-colors focus:border-brand-500 focus:outline-none"
          placeholder="Product, fabric, target price, target delivery window, and whether you have a tech pack ready."
        />
      </div>

      {/* Honeypot — hidden from people, tempting to bots. */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="hidden"
      />

      <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-sm text-[13px] leading-relaxed text-ink-400">
          We reply to every genuine enquiry. Your details are used only to
          answer it — never sold or shared with a third party.
        </p>
        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex h-13 shrink-0 items-center justify-center gap-2 rounded-full bg-ink-900 px-7 text-[15px] font-medium text-paper transition-colors hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "sending" ? "Sending…" : "Send enquiry"}
          {status === "sending" ? null : <ArrowRight />}
        </button>
      </div>

      {error ? (
        <p
          role="alert"
          className="rounded-xl border border-clay-500/30 bg-clay-500/8 px-4 py-3 text-[14px] text-clay-600 sm:col-span-2"
        >
          {error} Please try again, or email us directly.
        </p>
      ) : null}
    </form>
  );
}
