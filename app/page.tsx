export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <span className="text-lg font-semibold tracking-tight">
            Happy Hounds Activity Centre
          </span>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-12 px-6 py-16">
        <section className="flex flex-col gap-4">
          <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            A safe, professional indoor activity centre for dogs in Wrexham
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-stone-700">
            Structured play, enrichment and positive training, near LL12. Our
            dogs play, learn, socialise and thrive in a calm, supervised
            indoor space.
          </p>
          <div>
            <span className="inline-flex items-center rounded-full border border-stone-300 bg-stone-100 px-4 py-2 text-sm font-medium text-stone-700">
              Online booking is coming soon
            </span>
          </div>
        </section>

        <section aria-labelledby="services-heading" className="flex flex-col gap-3">
          <h2 id="services-heading" className="text-xl font-semibold">
            Services
          </h2>
          <p className="text-stone-700">
            Details on our daycare, play sessions and training coming soon.
            In the meantime, get in touch using the details below.
          </p>
        </section>

        <section aria-labelledby="location-heading" className="flex flex-col gap-3">
          <h2 id="location-heading" className="text-xl font-semibold">
            Location &amp; hours
          </h2>
          <p className="text-stone-700">Wrexham, LL12 &mdash; full address and opening hours coming soon.</p>
        </section>
      </main>

      <footer className="border-t border-stone-200 bg-white">
        <div className="mx-auto max-w-3xl px-6 py-6 text-sm text-stone-500">
          &copy; {new Date().getFullYear()} Happy Hounds Activity Centre, Wrexham.
        </div>
      </footer>
    </div>
  );
}
