"use client";

import { useEffect, useId, useReducer, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { ServiceType } from "@/lib/session-types";
import {
  SERVICE_DESCRIPTIONS,
  SERVICE_LABELS,
  SERVICE_ORDER,
  SERVICE_PRICES_PENCE,
  SERVICE_TIMES,
} from "@/lib/session-types";

// ── Types ─────────────────────────────────────────────────────────────────────

interface ApiSession {
  id: number;
  service_type: ServiceType;
  date: string;
  start_time: string;
  end_time: string;
  capacity: number;
  booked: number;
  available: number;
}

type Step = "service" | "slot" | "details" | "review";

interface FormState {
  step: Step;
  serviceType: ServiceType | null;
  selectedSession: ApiSession | null;
  customerName: string;
  customerEmail: string;
  dogName: string;
  dogBreed: string;
  notes: string;
}

const initialState: FormState = {
  step: "service",
  serviceType: null,
  selectedSession: null,
  customerName: "",
  customerEmail: "",
  dogName: "",
  dogBreed: "",
  notes: "",
};

type Action =
  | { type: "SET_SERVICE"; serviceType: ServiceType }
  | { type: "SET_SESSION"; session: ApiSession }
  | { type: "SET_FIELD"; field: keyof FormState; value: string }
  | { type: "GOTO_STEP"; step: Step }
  | { type: "BACK" };

const stepOrder: Step[] = ["service", "slot", "details", "review"];

function reducer(state: FormState, action: Action): FormState {
  switch (action.type) {
    case "SET_SERVICE":
      return { ...state, serviceType: action.serviceType, selectedSession: null, step: "slot" };
    case "SET_SESSION":
      return { ...state, selectedSession: action.session, step: "details" };
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "GOTO_STEP":
      return { ...state, step: action.step };
    case "BACK": {
      const idx = stepOrder.indexOf(state.step);
      return { ...state, step: stepOrder[Math.max(0, idx - 1)] };
    }
    default:
      return state;
  }
}

// ── Utilities ─────────────────────────────────────────────────────────────────

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatTime(t: string): string {
  const [h, m] = t.split(":").map(Number);
  const suffix = h >= 12 ? "pm" : "am";
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, "0")}${suffix}`;
}

function formatPrice(pence: number): string {
  return `£${(pence / 100).toFixed(0)}`;
}

// ── Sub-components ─────────────────────────────────────────────────────────────

const inputCls =
  "mt-1.5 block w-full rounded-lg border border-stone-300 px-3 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500";
const labelCls = "block text-sm font-semibold text-stone-800";

function Field({
  id,
  label,
  required,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className={labelCls}>
        {label}
        {required && <span className="ml-1 text-amber-600">*</span>}
      </label>
      {children}
    </div>
  );
}

function StepIndicator({ current }: { current: Step }) {
  const steps: { key: Step; label: string }[] = [
    { key: "service", label: "Service" },
    { key: "slot", label: "Slot" },
    { key: "details", label: "Details" },
    { key: "review", label: "Confirm" },
  ];
  const currentIdx = stepOrder.indexOf(current);
  return (
    <ol
      aria-label="Booking steps"
      className="mb-8 flex items-center gap-0"
    >
      {steps.map(({ key, label }, i) => {
        const done = i < currentIdx;
        const active = i === currentIdx;
        return (
          <li key={key} className="flex flex-1 items-center">
            <div className="flex flex-col items-center">
              <div
                aria-current={active ? "step" : undefined}
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                  done
                    ? "bg-amber-600 text-white"
                    : active
                    ? "border-2 border-amber-600 bg-white text-amber-700"
                    : "border-2 border-stone-200 bg-white text-stone-400"
                }`}
              >
                {done ? "✓" : i + 1}
              </div>
              <span
                className={`mt-1 hidden text-xs font-medium sm:block ${
                  active ? "text-amber-700" : done ? "text-stone-600" : "text-stone-400"
                }`}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`h-0.5 flex-1 transition-colors ${
                  done ? "bg-amber-600" : "bg-stone-200"
                }`}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}

// ── Step 1: Service selection ─────────────────────────────────────────────────

function StepService({ dispatch }: { dispatch: React.Dispatch<Action> }) {
  return (
    <div>
      <h2 className="text-xl font-bold text-stone-900">Choose a service</h2>
      <p className="mt-1 text-sm text-stone-500">
        Select the type of session you&apos;d like to book.
      </p>
      <div className="mt-5 grid gap-3">
        {SERVICE_ORDER.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => dispatch({ type: "SET_SERVICE", serviceType: type })}
            className="group flex items-start justify-between rounded-xl border border-stone-200 bg-white p-4 text-left transition-colors hover:border-amber-400 hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <div>
              <p className="font-semibold text-stone-900">{SERVICE_LABELS[type]}</p>
              <p className="mt-0.5 text-sm text-stone-500">{SERVICE_DESCRIPTIONS[type]}</p>
              <p className="mt-1 text-xs text-stone-400">{SERVICE_TIMES[type]}</p>
            </div>
            <div className="ml-4 shrink-0 text-right">
              <p className="font-bold text-amber-700">
                {formatPrice(SERVICE_PRICES_PENCE[type])}
              </p>
              <p className="text-xs text-stone-400">confirm, pay later</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Step 2: Slot selection ─────────────────────────────────────────────────────

function StepSlot({
  serviceType,
  dispatch,
}: {
  serviceType: ServiceType;
  dispatch: React.Dispatch<Action>;
}) {
  const [sessions, setSessions] = useState<ApiSession[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const from = new Date().toISOString().slice(0, 10);
    const to = new Date(Date.now() + 42 * 86400_000).toISOString().slice(0, 10);

    fetch(`/api/sessions?from=${from}&to=${to}`)
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load sessions");
        return r.json() as Promise<ApiSession[]>;
      })
      .then((all) => setSessions(all.filter((s) => s.service_type === serviceType && s.available > 0)))
      .catch(() => setError("Couldn't load available slots. Please try again."));
  }, [serviceType]);

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {error}
      </div>
    );
  }

  if (!sessions) {
    return (
      <div className="flex items-center justify-center py-12 text-stone-400 text-sm">
        Loading available slots…
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div>
        <h2 className="text-xl font-bold text-stone-900">
          {SERVICE_LABELS[serviceType]}
        </h2>
        <div className="mt-5 rounded-xl border border-stone-200 bg-stone-50 px-5 py-8 text-center">
          <p className="font-medium text-stone-700">No slots available in the next 6 weeks</p>
          <p className="mt-2 text-sm text-stone-500">
            Please{" "}
            <a href="mailto:hello@happyhoundscentre.co.uk" className="text-amber-700 hover:underline">
              email us
            </a>{" "}
            and we&apos;ll find something that works.
          </p>
        </div>
        <button
          type="button"
          onClick={() => dispatch({ type: "BACK" })}
          className="mt-4 text-sm text-amber-700 hover:underline"
        >
          ← Choose a different service
        </button>
      </div>
    );
  }

  // Group by date
  const byDate = sessions.reduce<Record<string, ApiSession[]>>((acc, s) => {
    if (!acc[s.date]) acc[s.date] = [];
    acc[s.date].push(s);
    return acc;
  }, {});

  return (
    <div>
      <h2 className="text-xl font-bold text-stone-900">
        {SERVICE_LABELS[serviceType]} — choose a date
      </h2>
      <p className="mt-1 text-sm text-stone-500">
        Slots showing availability in the next 6 weeks.
      </p>

      <div className="mt-5 space-y-4">
        {Object.entries(byDate).map(([date, slots]) => (
          <div key={date}>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-stone-500">
              {formatDate(date)}
            </p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {slots.map((slot) => (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() => dispatch({ type: "SET_SESSION", session: slot })}
                  className="flex flex-col rounded-lg border border-stone-200 bg-white p-3 text-left hover:border-amber-400 hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <span className="text-sm font-semibold text-stone-900">
                    {formatTime(slot.start_time)} – {formatTime(slot.end_time)}
                  </span>
                  <span className="mt-1 text-xs text-stone-500">
                    {slot.available} of {slot.capacity} left
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => dispatch({ type: "BACK" })}
        className="mt-6 text-sm text-amber-700 hover:underline"
      >
        ← Choose a different service
      </button>
    </div>
  );
}

// ── Step 3: Details form ──────────────────────────────────────────────────────

function StepDetails({
  state,
  dispatch,
}: {
  state: FormState;
  dispatch: React.Dispatch<Action>;
}) {
  const nameId = useId();
  const emailId = useId();
  const dogNameId = useId();
  const dogBreedId = useId();
  const notesId = useId();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    dispatch({ type: "GOTO_STEP", step: "review" });
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-xl font-bold text-stone-900">Your details</h2>
      <p className="mt-1 text-sm text-stone-500">
        We only collect what we need to manage your booking.
      </p>

      <div className="mt-5 space-y-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">Your details</p>

        <Field id={nameId} label="Your full name" required>
          <input
            id={nameId}
            type="text"
            name="customer_name"
            value={state.customerName}
            onChange={(e) => dispatch({ type: "SET_FIELD", field: "customerName", value: e.target.value })}
            required
            autoComplete="name"
            placeholder="Jane Smith"
            className={inputCls}
          />
        </Field>

        <Field id={emailId} label="Email address" required>
          <input
            id={emailId}
            type="email"
            name="customer_email"
            value={state.customerEmail}
            onChange={(e) => dispatch({ type: "SET_FIELD", field: "customerEmail", value: e.target.value })}
            required
            autoComplete="email"
            placeholder="jane@example.com"
            className={inputCls}
          />
        </Field>

        <p className="pt-2 text-xs font-semibold uppercase tracking-wide text-stone-500">Your dog</p>

        <Field id={dogNameId} label="Dog's name" required>
          <input
            id={dogNameId}
            type="text"
            name="dog_name"
            value={state.dogName}
            onChange={(e) => dispatch({ type: "SET_FIELD", field: "dogName", value: e.target.value })}
            required
            placeholder="Bella"
            className={inputCls}
          />
        </Field>

        <Field id={dogBreedId} label="Breed (or rough mix)" required>
          <input
            id={dogBreedId}
            type="text"
            name="dog_breed"
            value={state.dogBreed}
            onChange={(e) => dispatch({ type: "SET_FIELD", field: "dogBreed", value: e.target.value })}
            required
            placeholder="Labrador"
            className={inputCls}
          />
        </Field>

        <Field id={notesId} label="Anything we should know?">
          <textarea
            id={notesId}
            name="notes"
            value={state.notes}
            onChange={(e) => dispatch({ type: "SET_FIELD", field: "notes", value: e.target.value })}
            rows={3}
            placeholder="Allergies, health conditions, behaviour notes, etc."
            className={`${inputCls} resize-none`}
          />
        </Field>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={() => dispatch({ type: "BACK" })}
          className="rounded-lg border border-stone-300 px-4 py-2.5 text-sm font-semibold text-stone-700 hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-stone-400"
        >
          Back
        </button>
        <button
          type="submit"
          className="flex-1 rounded-lg bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
        >
          Review booking →
        </button>
      </div>
    </form>
  );
}

// ── Step 4: Review & confirm ───────────────────────────────────────────────────

function StepReview({
  state,
  dispatch,
}: {
  state: FormState;
  dispatch: React.Dispatch<Action>;
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const idempotencyKey = useRef(crypto.randomUUID());

  const session = state.selectedSession!;
  const price = formatPrice(SERVICE_PRICES_PENCE[state.serviceType!]);

  async function confirm() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: session.id,
          customer_name: state.customerName,
          customer_email: state.customerEmail,
          dog_name: state.dogName,
          dog_breed: state.dogBreed,
          notes: state.notes || undefined,
          idempotency_key: idempotencyKey.current,
        }),
      });

      if (res.status === 409) {
        setError("This session is now fully booked. Please go back and choose another slot.");
        setSubmitting(false);
        return;
      }

      if (!res.ok) {
        throw new Error("Booking failed");
      }

      const { booking } = await res.json();
      router.push(`/booking/confirmation/${booking.confirmation_code}`);
    } catch {
      setError("Something went wrong. Please try again, or email us to book directly.");
      setSubmitting(false);
    }
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-stone-900">Review your booking</h2>
      <p className="mt-1 text-sm text-stone-500">
        Check everything looks right before confirming.
      </p>

      <div className="mt-5 overflow-hidden rounded-xl border border-stone-200 bg-white">
        <div className="px-5 py-4 border-b border-stone-100">
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-500 mb-2">Session</p>
          <p className="font-semibold text-stone-900">{SERVICE_LABELS[state.serviceType!]}</p>
          <p className="text-sm text-stone-600">{formatDate(session.date)}</p>
          <p className="text-sm text-stone-600">
            {formatTime(session.start_time)} – {formatTime(session.end_time)}
          </p>
          <p className="mt-1 text-sm font-semibold text-amber-700">{price} — confirm now, pay on the day</p>
        </div>

        <div className="px-5 py-4 border-b border-stone-100">
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-500 mb-2">Your details</p>
          <p className="text-sm text-stone-900">{state.customerName}</p>
          <p className="text-sm text-stone-600">{state.customerEmail}</p>
        </div>

        <div className="px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-500 mb-2">Your dog</p>
          <p className="text-sm text-stone-900">{state.dogName} ({state.dogBreed})</p>
          {state.notes && <p className="mt-1 text-sm text-stone-500 italic">{state.notes}</p>}
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        <strong>Payment:</strong> You&apos;ll pay on the day. We&apos;ll send your confirmation code to{" "}
        <strong>{state.customerEmail}</strong> so you can reference your booking.
      </div>

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={() => dispatch({ type: "BACK" })}
          disabled={submitting}
          className="rounded-lg border border-stone-300 px-4 py-2.5 text-sm font-semibold text-stone-700 hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-stone-400 disabled:opacity-50"
        >
          Back
        </button>
        <button
          type="button"
          onClick={confirm}
          disabled={submitting}
          className="flex-1 rounded-lg bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? "Confirming…" : "Confirm booking"}
        </button>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function BookingPage() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div className="px-6 py-12 sm:py-16">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
          Book a session
        </h1>
        <p className="mt-2 text-stone-500 text-sm">
          Confirm your place now and pay on the day. You&apos;ll receive a confirmation code by email.
        </p>

        <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-100 sm:p-8">
          <StepIndicator current={state.step} />

          {state.step === "service" && <StepService dispatch={dispatch} />}
          {state.step === "slot" && state.serviceType && (
            <StepSlot serviceType={state.serviceType} dispatch={dispatch} />
          )}
          {state.step === "details" && <StepDetails state={state} dispatch={dispatch} />}
          {state.step === "review" && <StepReview state={state} dispatch={dispatch} />}
        </div>

        <p className="mt-6 text-center text-xs text-stone-400">
          Need help?{" "}
          <a href="mailto:hello@happyhoundscentre.co.uk" className="text-amber-700 hover:underline">
            Email us
          </a>{" "}
          and we&apos;ll sort it out.
        </p>
      </div>
    </div>
  );
}
