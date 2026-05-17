export function TermsPage() {
  return (
    <div className="min-h-screen py-12 md:py-16 px-4">
      <div className="container max-w-3xl mx-auto">
        <div className="mb-10">
          <h1
            className="text-4xl md:text-5xl font-medium tracking-tight mb-3"
            style={{ fontFamily: '"DM Serif Display", serif' }}
          >
            Terms of Service
          </h1>
          <p className="text-sm text-muted-foreground">
            Last updated: 1 May 2026
          </p>
        </div>

        <div className="prose prose-neutral max-w-none space-y-6 text-foreground leading-7">
          <p>
            By using Nizvio (&ldquo;the service&rdquo;), you agree to these
            terms. If you don&rsquo;t agree, please don&rsquo;t use the
            service.
          </p>

          <h2 className="text-2xl font-medium pt-4" style={{ fontFamily: '"DM Serif Display", serif' }}>
            Eligibility
          </h2>
          <p>
            You must be at least 18 years old, or the legal owner or authorised
            representative of the business you&rsquo;re listing.
          </p>

          <h2 className="text-2xl font-medium pt-4" style={{ fontFamily: '"DM Serif Display", serif' }}>
            Your account and listings
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>You&rsquo;re responsible for keeping your account secure.</li>
            <li>
              The information you submit must be accurate and not misleading.
            </li>
            <li>
              You retain ownership of the content you upload (descriptions,
              photos, logo) and grant us a non-exclusive licence to display it
              on the directory.
            </li>
            <li>
              We may review listings before they go live and may decline,
              pause or remove a listing that violates these terms.
            </li>
          </ul>

          <h2 className="text-2xl font-medium pt-4" style={{ fontFamily: '"DM Serif Display", serif' }}>
            Acceptable use
          </h2>
          <p>You agree not to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Submit content that is unlawful, infringing or harmful.</li>
            <li>
              Impersonate another business or list a business you don&rsquo;t
              represent.
            </li>
            <li>
              Use the service to spam, scrape or interfere with normal
              operation.
            </li>
          </ul>

          <h2 className="text-2xl font-medium pt-4" style={{ fontFamily: '"DM Serif Display", serif' }}>
            Free service
          </h2>
          <p>
            Listings are free at the time of writing. If we introduce paid
            features in the future, we&rsquo;ll give clear notice and
            won&rsquo;t silently start charging existing listings.
          </p>

          <h2 className="text-2xl font-medium pt-4" style={{ fontFamily: '"DM Serif Display", serif' }}>
            Disclaimer
          </h2>
          <p>
            Nizvio is provided &ldquo;as is&rdquo;. We make no warranty about
            the accuracy of listings or that the service will be uninterrupted
            or error-free. Information about businesses comes from those
            businesses themselves &mdash; verify anything important before
            relying on it.
          </p>

          <h2 className="text-2xl font-medium pt-4" style={{ fontFamily: '"DM Serif Display", serif' }}>
            Limitation of liability
          </h2>
          <p>
            To the maximum extent permitted by law, Nizvio is not liable for
            indirect, incidental or consequential damages arising from your
            use of the service.
          </p>

          <h2 className="text-2xl font-medium pt-4" style={{ fontFamily: '"DM Serif Display", serif' }}>
            Changes
          </h2>
          <p>
            We may update these terms over time. Material changes will be
            announced on the site. Continued use of the service after a change
            means you accept the updated terms.
          </p>

          <h2 className="text-2xl font-medium pt-4" style={{ fontFamily: '"DM Serif Display", serif' }}>
            Contact
          </h2>
          <p>
            Questions about these terms?{' '}
            <a className="text-primary hover:underline" href="mailto:info@listmio.com">
              info@listmio.com
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
