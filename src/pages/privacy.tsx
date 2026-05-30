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
            Last updated: 30 May 2026
          </p>
        </div>

        <div className="prose prose-neutral max-w-none space-y-6 text-foreground leading-7">
          <p>
            This policy explains what information we collect when you use
            souqim.com, how we use it, the legal basis on which we rely, and the
            rights you have. souqim is a UK community business directory.
          </p>

          <h2 className="text-2xl font-medium pt-4" style={{ fontFamily: '"DM Serif Display", serif' }}>
            Who we are
          </h2>
          <p>
            souqim is operated by{' '}
            <span className="font-medium">Khaas Hub Ltd</span>, a company
            registered in England &amp; Wales (company number{' '}
            <span className="font-medium">16721132</span>), trading as
            &ldquo;souqim&rdquo;. Khaas Hub Ltd is the data controller
            responsible for your personal data.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <span className="font-medium">Registered office:</span>{' '}
              5th Floor, 167-169 Great Portland Street, London W1W 5PF
            </li>
            <li>
              <span className="font-medium">ICO registration reference:</span>{' '}
              ZC006982
            </li>
            <li>
              <span className="font-medium">Contact:</span>{' '}
              <a className="text-primary hover:underline" href="mailto:info@souqim.com">
                info@souqim.com
              </a>
            </li>
          </ul>

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
              <span className="font-medium">Inquiries:</span> when you send a
              service or quote request we collect the name, email, phone and
              message details you provide.
            </li>
            <li>
              <span className="font-medium">Usage data:</span> standard server
              logs, basic page-view counts, and information your browser sends
              automatically (IP address, user agent).
            </li>
          </ul>

          <h2 className="text-2xl font-medium pt-4" style={{ fontFamily: '"DM Serif Display", serif' }}>
            How we use it &amp; our legal basis
          </h2>
          <p>
            Under the UK GDPR we must have a lawful basis for using your
            personal data. We rely on the following:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <span className="font-medium">Contract:</span> to create and
              authenticate your account, publish and manage the listings you
              create, and respond to inquiries you send us.
            </li>
            <li>
              <span className="font-medium">Legitimate interests:</span> to
              operate, secure and improve the directory, keep basic page-view
              counts, diagnose problems, and prevent abuse &mdash; balanced
              against your rights.
            </li>
            <li>
              <span className="font-medium">Consent:</span> where you choose to
              submit a business listing or send us an inquiry. You can withdraw
              consent at any time by removing your listing or contacting us.
            </li>
            <li>
              <span className="font-medium">Legal obligation:</span> where we
              need to retain or disclose information to comply with the law.
            </li>
          </ul>

          <h2 className="text-2xl font-medium pt-4" style={{ fontFamily: '"DM Serif Display", serif' }}>
            Business listings
          </h2>
          <p>
            A directory listing may include the personal data of a sole trader
            or named business contact (for example a name, email, phone number
            or address). We display this so the community can find and contact
            the business, relying on legitimate interests and on the consent of
            the person who submits the listing. If you are named in a listing
            and want it corrected or removed, email{' '}
            <a className="text-primary hover:underline" href="mailto:info@souqim.com">
              info@souqim.com
            </a>{' '}
            and we will action it promptly.
          </p>

          <h2 className="text-2xl font-medium pt-4" style={{ fontFamily: '"DM Serif Display", serif' }}>
            Service providers &amp; international transfers
          </h2>
          <p>
            We use Supabase for authentication, database and file storage,
            Resend for transactional email, and Hostinger for hosting. These
            providers process information on our behalf under their own privacy
            policies and our instructions.
          </p>
          <p>
            Some of these providers may store or process data outside the UK. Where
            personal data is transferred outside the UK, we rely on appropriate
            safeguards such as the UK International Data Transfer Agreement or
            the UK Addendum to the EU Standard Contractual Clauses.
          </p>

          <h2 className="text-2xl font-medium pt-4" style={{ fontFamily: '"DM Serif Display", serif' }}>
            How long we keep it
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <span className="font-medium">Account data:</span> kept while your
              account is active, and deleted within 30 days of you closing your
              account or asking us to delete it.
            </li>
            <li>
              <span className="font-medium">Listings:</span> kept while live and
              removed when you delete them or close your account.
            </li>
            <li>
              <span className="font-medium">Inquiries:</span> kept for up to 24
              months so we can respond and follow up, then deleted.
            </li>
            <li>
              <span className="font-medium">Server logs:</span> kept for a short
              period for security and diagnostics, then routinely deleted.
            </li>
          </ul>

          <h2 className="text-2xl font-medium pt-4" style={{ fontFamily: '"DM Serif Display", serif' }}>
            Cookies
          </h2>
          <p>
            We use only a small number of strictly necessary cookies and
            local-storage entries that keep you signed in and remember interface
            preferences such as your theme. We do not use advertising or
            third-party analytics cookies, so no cookie consent banner is
            required. If we introduce analytics or other non-essential cookies
            in future, we will ask for your consent first.
          </p>

          <h2 className="text-2xl font-medium pt-4" style={{ fontFamily: '"DM Serif Display", serif' }}>
            Your rights
          </h2>
          <p>
            Under the UK GDPR you have the right to access, correct, delete,
            restrict or object to our use of your personal data, and to data
            portability. You can review, edit or remove your listings from your
            dashboard at any time. To exercise any of these rights, or to
            request a copy of the data we hold on you, email{' '}
            <a className="text-primary hover:underline" href="mailto:info@souqim.com">
              info@souqim.com
            </a>
            .
          </p>
          <p>
            If you are unhappy with how we have handled your data you can
            complain to the UK Information Commissioner&rsquo;s Office (ICO) at{' '}
            <a
              className="text-primary hover:underline"
              href="https://ico.org.uk/make-a-complaint/"
              target="_blank"
              rel="noopener noreferrer"
            >
              ico.org.uk/make-a-complaint
            </a>{' '}
            or by calling 0303 123 1113. We&rsquo;d appreciate the chance to
            address your concerns first, so do contact us before you approach
            the ICO.
          </p>

          <h2 className="text-2xl font-medium pt-4" style={{ fontFamily: '"DM Serif Display", serif' }}>
            Contact
          </h2>
          <p>
            Questions about this policy?{' '}
            <a className="text-primary hover:underline" href="mailto:info@souqim.com">
              info@souqim.com
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
