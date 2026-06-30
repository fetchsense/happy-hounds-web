import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Happy Hounds Activity Centre | Dog Daycare & Play in Wrexham, LL12",
    template: "%s | Happy Hounds Activity Centre",
  },
  description:
    "Happy Hounds Activity Centre is a safe, professional indoor dog activity centre in Wrexham (LL12), offering structured play, daycare, enrichment and positive training.",
};

const navLinks = [
  { href: "/services", label: "Services" },
  { href: "/pricing", label: "Pricing" },
  { href: "/location", label: "Location & Hours" },
];

const ctaLink = { href: "/booking", label: "Book now" };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-amber-50 font-sans text-stone-900">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:rounded focus:bg-amber-700 focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to main content
        </a>

        <header className="border-b border-stone-200 bg-white">
          <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-6 py-4">
            <Link
              href="/"
              className="text-lg font-semibold tracking-tight text-stone-900 hover:text-amber-700"
            >
              Happy Hounds
            </Link>

            <nav aria-label="Main navigation">
              <ul className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm font-medium text-stone-600">
                {navLinks.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="hover:text-amber-700 focus:rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <Link
              href={ctaLink.href}
              className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
            >
              {ctaLink.label}
            </Link>
          </div>
        </header>

        <main id="main" className="flex flex-1 flex-col">
          {children}
        </main>

        <footer className="border-t border-stone-200 bg-white">
          <div className="mx-auto max-w-4xl px-6 py-8">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
              <div>
                <p className="font-semibold text-stone-900">Happy Hounds Activity Centre</p>
                <p className="mt-1 text-sm text-stone-500">
                  Indoor dog play, daycare &amp; training in Wrexham, LL12.
                </p>
              </div>
              <nav aria-label="Footer navigation">
                <p className="text-sm font-semibold uppercase tracking-wide text-stone-500">Pages</p>
                <ul className="mt-2 space-y-1 text-sm text-stone-600">
                  {navLinks.map(({ href, label }) => (
                    <li key={href}>
                      <Link href={href} className="hover:text-amber-700">
                        {label}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link href={ctaLink.href} className="hover:text-amber-700">
                      {ctaLink.label}
                    </Link>
                  </li>
                </ul>
              </nav>
              <div className="text-sm text-stone-500">
                <p className="font-semibold text-stone-900">Get in touch</p>
                <p className="mt-1">
                  <a href="mailto:hello@happyhoundscentre.co.uk" className="hover:text-amber-700">
                    hello@happyhoundscentre.co.uk
                  </a>
                </p>
              </div>
            </div>
            <p className="mt-8 border-t border-stone-100 pt-6 text-xs text-stone-400">
              &copy; {new Date().getFullYear()} Happy Hounds Activity Centre, Wrexham.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
