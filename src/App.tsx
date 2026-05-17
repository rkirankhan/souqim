// ────────────────────────────────────────────────────────────────────────────
// Live site is the default export (App).
//
// ComingSoonOnly is preserved below — to take the site offline temporarily
// (e.g. for a relaunch or maintenance window), change the default export
// from `App` to `ComingSoonOnly`. All page imports stay so nothing is lost.
// ────────────────────────────────────────────────────────────────────────────

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import { Layout } from '@/components/layout'
import { ProtectedRoute } from '@/components/protected-route'
import { ScrollToTop } from '@/components/scroll-to-top'
import { ComingSoonPage } from '@/pages/coming-soon'
import { HomePage } from '@/pages/home'
import { BrowsePage } from '@/pages/browse'
import { CategoriesPage } from '@/pages/categories'
import { BusinessProfilePage } from '@/pages/business-profile'
import { ListPage } from '@/pages/list'
import { ServicesPage } from '@/pages/services'
import { AboutPage } from '@/pages/about'
import { ContactPage } from '@/pages/contact'
import { FaqPage } from '@/pages/faq'
import { PrivacyPage } from '@/pages/privacy'
import { TermsPage } from '@/pages/terms'
import { SignInPage } from '@/pages/signin'
import { AuthCallbackPage } from '@/pages/auth-callback'
import { DashboardPage } from '@/pages/dashboard'
import { AccountPage } from '@/pages/account'
import { AdminPage } from '@/pages/admin'

// Full site — the default. Includes the layout (header + footer), all routes,
// and the toaster.
export function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/browse" element={<BrowsePage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/business/:id" element={<BusinessProfilePage />} />
          <Route path="/list" element={<ListPage />} />
          <Route path="/add-business" element={<Navigate to="/list" replace />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/dashboard/edit/:id" element={<ProtectedRoute><ListPage /></ProtectedRoute>} />
          <Route path="/dashboard/account" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
        </Routes>
      </Layout>
      <Toaster />
    </BrowserRouter>
  )
}

// Coming-soon-only mode. Swap the default export to this to take the live
// site down temporarily (the placeholder catches every URL).
export function ComingSoonOnly() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<ComingSoonPage />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  )
}

export default App
