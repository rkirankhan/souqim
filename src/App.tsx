import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import { Layout } from '@/components/layout'
import { ProtectedRoute } from '@/components/protected-route'
import { ScrollToTop } from '@/components/scroll-to-top'
import { HomePage } from '@/pages/home'
import { BrowsePage } from '@/pages/browse'
import { CategoriesPage } from '@/pages/categories'
import { BusinessProfilePage } from '@/pages/business-profile'
import { ListPage } from '@/pages/list'
import { AboutPage } from '@/pages/about'
import { ContactPage } from '@/pages/contact'
import { SignInPage } from '@/pages/signin'
import { AuthCallbackPage } from '@/pages/auth-callback'
import { DashboardPage } from '@/pages/dashboard'
import { AccountPage } from '@/pages/account'
import { AdminPage } from '@/pages/admin'

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
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
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

export default App
