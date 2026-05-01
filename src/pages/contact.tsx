import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, MessageSquare } from 'lucide-react'

export function ContactPage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container max-w-3xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-semibold tracking-tight mb-4">
            Contact
          </h1>
          <p className="text-muted-foreground">
            We'd love to hear from you
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Card>
            <CardHeader>
              <Mail className="size-10 mb-3 text-primary" />
              <CardTitle>Email Us</CardTitle>
              <CardDescription>
                Send us a message anytime
              </CardDescription>
            </CardHeader>
            <CardContent>
              <a
                href="mailto:info@listmio.com"
                className="text-primary hover:underline"
              >
                info@listmio.com
              </a>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <MessageSquare className="size-10 mb-3 text-primary" />
              <CardTitle>General Inquiries</CardTitle>
              <CardDescription>
                Questions about the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                For general questions, partnership opportunities, or feedback about our platform.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">How do I list my business?</h3>
              <p className="text-muted-foreground">
                Click on "List Your Business" in the navigation menu or on the homepage, fill out the form with your business details, and submit. It's completely free!
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Is there a cost to list my business?</h3>
              <p className="text-muted-foreground">
                No, listing your business is completely free. We believe in supporting local businesses and entrepreneurs.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Can I update my business information?</h3>
              <p className="text-muted-foreground">
                Please contact us with any updates to your business listing and we'll make the changes for you.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">How do I get featured?</h3>
              <p className="text-muted-foreground">
                Featured listings are selected based on various factors. Contact us to learn more about featuring your business.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
