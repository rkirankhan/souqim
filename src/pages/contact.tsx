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

      </div>
    </div>
  )
}
