export function PrivacyPage() {
  return (
    <div className="min-h-screen py-12 md:py-16 px-4">
      <div className="container max-w-3xl mx-auto">
        <div className="mb-10">
          <h1
            className="text-4xl md:text-5xl font-medium tracking-tight mb-3"
            style={{ fontFamily: '"DM Serif Display", serif' }}
          >
            Privacy Policy
          </h1>
          <p className="text-sm text-muted-foreground">
            Last updated: 1 May 2026
          </p>
        </div>

        <div className="prose prose-neutral max-w-none space-y-6 text-foreground leading-7">
          <p>
            Nizvio (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;us&rdquo;)
            respects your privacy. This policy explains what information we
            collect when you use nizvio.com, how we use it, and the choices
            you have.
          </p>

          <h2 className="text-2xl font-medium pt-4" style={{ fontFamily: '"DM Serif Display", serif' }}>
            Information we collect
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <span className="font-medium">Account information:</span> when
              you sign in with Google we receive your name and email address.
            </li>
            <li>
              <span className="font-medium">Listing content:</span> the
              business details, photos and contact information you submit when
              creating or editing a listing.
            </li>
            <li>
              <span className="font-medium">Usage data:</span> standard server
              logs, basic page-view counts, and information your browser sends
              automatically (IP address, user agent).
            </li>
          </ul>

          <h2 className="text-2xl font-medium pt-4" style={{ fontFamily: '"DM Serif Display", serif' }}>
            How we use it
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>To operate the directory and display the listings you create.</li>
            <li>To authenticate you and let you manage your listings.</li>
            <li>To improve the service and diagnose issues.</li>
            <li>To contact you about your account or listing if needed.</li>
          </ul>

          <h2 className="text-2xl font-medium pt-4" style={{ fontFamily: '"DM Serif Display", serif' }}>
            Service providers
          </h2>
          <p>
            We use Supabase for authentication, database and file storage, and
            Hostinger for hosting. These providers process information on our
            behalf under their own privacy policies.
          </p>

          <h2 className="text-2xl font-medium pt-4" style={{ fontFamily: '"DM Serif Display", serif' }}>
            Cookies
          </h2>
          <p>
            We use a small number of cookies and local-storage entries that are
            necessary to keep you signed in and remember interface preferences.
            We do not use advertising cookies.
          </p>

          <h2 className="text-2xl font-medium pt-4" style={{ fontFamily: '"DM Serif Display", serif' }}>
            Your rights
          </h2>
          <p>
            You can review, edit or remove your listings from your dashboard at
            any time. To request deletion of your account or a copy of the data
            we hold on you, email{' '}
            <a className="text-primary hover:underline" href="mailto:info@nizvio.com">
              info@nizvio.com
            </a>
            .
          </p>

          <h2 className="text-2xl font-medium pt-4" style={{ fontFamily: '"DM Serif Display", serif' }}>
            Contact
          </h2>
          <p>
            Questions about this policy?{' '}
            <a className="text-primary hover:underline" href="mailto:info@nizvio.com">
              info@nizvio.com
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
