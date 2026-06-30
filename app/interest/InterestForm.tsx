"use client";

import { useState, FormEvent } from "react";

// Get your free access key at web3forms.com — enter the email address you want
// submissions delivered to, copy the key they send you, and paste it here.
const WEB3FORMS_ACCESS_KEY = "REPLACE_WITH_YOUR_WEB3FORMS_ACCESS_KEY";

type Status = "idle" | "loading" | "success" | "error";

const USE_FOR_OPTIONS = [
  { value: "private_hire", label: "Private hire (book the whole space for your dog)" },
  { value: "puppy_sessions", label: "Puppy confidence & socialisation" },
  { value: "reactive_slots", label: "Reactive / nervous dog sessions" },
  { value: "social_play", label: "Structured social play" },
  { value: "training", label: "Training classes" },
  { value: "daycare", label: "Daycare" },
  { value: "wet_weather", label: "Wet-weather exercise" },
];

const FREQUENCY_OPTIONS = [
  { value: "weekly", label: "Weekly" },
  { value: "fortnightly", label: "Fortnightly" },
  { value: "monthly", label: "Monthly" },
  { value: "bad_weather", label: "Bad weather only" },
];

const PRICE_30_OPTIONS = ["£8", "£10", "£12", "£15+"];
const PRICE_60_OPTIONS = ["£15", "£18", "£20", "£25+"];
const PRICE_DAYCARE_OPTIONS = ["£25", "£30", "£35", "£40+"];

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const TIMES = ["Morning", "Afternoon", "Evening"];

const inputClass =
  "mt-1.5 block w-full rounded-lg border border-stone-300 px-3 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500";

const labelClass = "block text-sm font-semibold text-stone-800";

function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className={labelClass}>{label}</p>
      {children}
    </div>
  );
}

function RadioOption({
  name,
  value,
  label,
}: {
  name: string;
  value: string;
  label: string;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-700 hover:border-amber-400 hover:bg-amber-50 transition-colors">
      <input
        type="radio"
        name={name}
        value={value}
        required
        className="accent-amber-600 h-4 w-4 shrink-0"
      />
      {label}
    </label>
  );
}

function CheckOption({
  name,
  value,
  label,
}: {
  name: string;
  value: string;
  label: string;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-700 hover:border-amber-400 hover:bg-amber-50 transition-colors">
      <input
        type="checkbox"
        name={name}
        value={value}
        className="accent-amber-600 h-4 w-4 shrink-0"
      />
      {label}
    </label>
  );
}

export default function InterestForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      const json = await res.json();
      if (json.success) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl bg-amber-600 px-8 py-12 text-center text-white">
        <p className="text-2xl font-bold">Thank you!</p>
        <p className="mt-3 text-amber-100 max-w-sm mx-auto">
          We&apos;ve received your response. We&apos;ll be in touch with updates before we open.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-100 sm:p-8">
      {/* Web3Forms fields */}
      <input type="hidden" name="access_key" value={WEB3FORMS_ACCESS_KEY} />
      <input type="hidden" name="_subject" value="Happy Hounds – Interest Registration" />
      <input type="hidden" name="from_name" value="Happy Hounds Interest Form" />
      {/* Honeypot */}
      <input type="checkbox" name="botcheck" className="hidden" aria-hidden="true" />

      <div className="flex flex-col gap-7">
        {/* Q1: Postcode */}
        <FieldGroup label="1. Your postcode">
          <input
            type="text"
            name="postcode"
            placeholder="e.g. LL12 8AB"
            required
            autoComplete="postal-code"
            className={inputClass}
          />
        </FieldGroup>

        {/* Q2: Dog details */}
        <FieldGroup label="2. Your dog(s) — breed, size and age">
          <textarea
            name="dog_details"
            placeholder="e.g. Labrador, medium, 2 years old"
            rows={2}
            required
            className={`${inputClass} resize-none`}
          />
        </FieldGroup>

        {/* Q3: Use case (multi-select) */}
        <FieldGroup label="3. What would you use it for? (tick all that apply)">
          <div className="mt-2 flex flex-col gap-2">
            {USE_FOR_OPTIONS.map((opt) => (
              <CheckOption
                key={opt.value}
                name="use_for"
                value={opt.value}
                label={opt.label}
              />
            ))}
          </div>
        </FieldGroup>

        {/* Q4: Frequency */}
        <FieldGroup label="4. How often would you realistically book?">
          <div className="mt-2 flex flex-col gap-2">
            {FREQUENCY_OPTIONS.map((opt) => (
              <RadioOption
                key={opt.value}
                name="frequency"
                value={opt.value}
                label={opt.label}
              />
            ))}
          </div>
        </FieldGroup>

        {/* Pricing block */}
        <div className="rounded-xl border border-stone-200 bg-stone-50 p-5">
          <p className="text-sm font-semibold text-stone-700 mb-4">Pricing — what would you pay?</p>

          <div className="flex flex-col gap-6">
            {/* Q5: 30-minute private hire */}
            <FieldGroup label="5. 30-minute private hire">
              <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {PRICE_30_OPTIONS.map((p) => (
                  <RadioOption key={p} name="price_30min" value={p} label={p} />
                ))}
              </div>
            </FieldGroup>

            {/* Q6: 60-minute private hire */}
            <FieldGroup label="6. 60-minute private hire">
              <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {PRICE_60_OPTIONS.map((p) => (
                  <RadioOption key={p} name="price_60min" value={p} label={p} />
                ))}
              </div>
            </FieldGroup>

            {/* Q7: Daycare day rate */}
            <FieldGroup label="7. Full day of daycare">
              <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {PRICE_DAYCARE_OPTIONS.map((p) => (
                  <RadioOption key={p} name="price_daycare" value={p} label={p} />
                ))}
              </div>
            </FieldGroup>
          </div>
        </div>

        {/* Q8: Deposit */}
        <FieldGroup label="8. Would you pay a £10 refundable deposit to secure priority access before we open?">
          <div className="mt-2 grid grid-cols-2 gap-2">
            <RadioOption name="deposit" value="yes" label="Yes" />
            <RadioOption name="deposit" value="no" label="No" />
          </div>
        </FieldGroup>

        {/* Q9: Days & times */}
        <FieldGroup label="9. When works best for you?">
          <div className="mt-3 flex flex-col gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-stone-500 mb-2">Days</p>
              <div className="flex flex-wrap gap-2">
                {DAYS.map((d) => (
                  <label
                    key={d}
                    className="flex cursor-pointer items-center gap-2 rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-stone-700 hover:border-amber-400 hover:bg-amber-50 transition-colors"
                  >
                    <input
                      type="checkbox"
                      name="days"
                      value={d.toLowerCase()}
                      className="accent-amber-600 h-4 w-4"
                    />
                    {d}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-stone-500 mb-2">Times</p>
              <div className="flex flex-wrap gap-2">
                {TIMES.map((t) => (
                  <label
                    key={t}
                    className="flex cursor-pointer items-center gap-2 rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-stone-700 hover:border-amber-400 hover:bg-amber-50 transition-colors"
                  >
                    <input
                      type="checkbox"
                      name="times"
                      value={t.toLowerCase()}
                      className="accent-amber-600 h-4 w-4"
                    />
                    {t}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </FieldGroup>

        {/* Q10: Contact */}
        <FieldGroup label="10. Stay in the loop">
          <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-stone-500" htmlFor="email">
                Email address <span className="text-amber-600">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-stone-500" htmlFor="mobile">
                Mobile number <span className="text-stone-400">(optional)</span>
              </label>
              <input
                type="tel"
                id="mobile"
                name="mobile"
                autoComplete="tel"
                placeholder="07700 000000"
                className={inputClass}
              />
            </div>
          </div>
          <p className="mt-2 text-xs text-stone-400">
            We&apos;ll only use your contact details to keep you updated about Happy Hounds. No spam.
          </p>
        </FieldGroup>

        {/* Submit */}
        {status === "error" && (
          <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Something went wrong — please try again or email us at{" "}
            <a href="mailto:hello@happyhoundscentre.co.uk" className="underline">
              hello@happyhoundscentre.co.uk
            </a>
            .
          </p>
        )}

        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full rounded-lg bg-amber-600 px-6 py-3.5 text-sm font-semibold text-white hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {status === "loading" ? "Sending…" : "Register my interest"}
        </button>
      </div>
    </form>
  );
}
