import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

const faqs = [
  {
    q: 'How do I list my business?',
    a: 'Click on "List your business" in the navigation menu or on the homepage, fill out the form with your business details, and submit. It’s completely free.',
  },
  {
    q: 'Is there a cost to list my business?',
    a: 'No, listing your business is completely free. We believe in supporting local businesses and entrepreneurs.',
  },
  {
    q: 'Can I update my business information?',
    a: 'Yes, you can edit yourself anytime. Or you can also contact us with any updates to your business listing and we’ll make the changes for you.',
  },
  {
    q: 'How do I get featured?',
    a: 'Featured listings are selected based on various factors. Contact us to learn more about featuring your business.',
  },
  {
    q: 'How long until my listing is live?',
    a: 'Listings go through a quick review before going live. Most are approved within 24 hours.',
  },
  {
    q: 'How do I delete my listing?',
    a: 'Sign in, go to your dashboard, and remove the listing from there. If you have trouble, contact us at info@nizvio.com.',
  },
]

export function FaqPage() {
  return (
    <div className="min-h-screen py-12 md:py-16 px-4">
      <div className="container max-w-3xl mx-auto">
        <div className="mb-10 text-center">
          <h1
            className="text-4xl md:text-5xl font-medium tracking-tight mb-3"
            style={{ fontFamily: '"DM Serif Display", serif' }}
          >
            Frequently Asked Questions
          </h1>
          <p className="text-muted-foreground">
            Answers to the most common questions about Nizvio.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map(({ q, a }) => (
            <div
              key={q}
              className="bg-card border border-border rounded-xl p-6"
            >
              <h2 className="font-medium mb-2">{q}</h2>
              <p className="text-muted-foreground leading-relaxed text-sm">{a}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            Still have questions?
          </p>
          <Button asChild variant="outline" className="rounded-full">
            <Link to="/contact">Contact us</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
