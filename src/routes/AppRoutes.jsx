import { Navigate, Route, Routes } from 'react-router-dom'
import BooksPage from '../pages/BooksPage.jsx'
import AdminBooksPage from '../pages/AdminBooksPage.jsx'
import AdminDashboardPage from '../pages/AdminDashboardPage.jsx'
import AdminIssuesPage from '../pages/AdminIssuesPage.jsx'
import AdminReservationsPage from '../pages/AdminReservationsPage.jsx'
import BookDetailsPage from '../pages/BookDetailsPage.jsx'
import DashboardPage from '../pages/DashboardPage.jsx'
import LoginPage from '../pages/LoginPage.jsx'
import MyBooksPage from '../pages/MyBooksPage.jsx'
import NotFoundPage from '../pages/NotFoundPage.jsx'
import RegisterPage from '../pages/RegisterPage.jsx'
import ReservationsPage from '../pages/ReservationsPage.jsx'
import ProtectedRoute from './ProtectedRoute.jsx'
import RequireRole from './RequireRole.jsx'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/books" replace />} />
      <Route path="/books" element={<BooksPage />} />
      <Route path="/books/:id" element={<BookDetailsPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/reservations" element={<ProtectedRoute><ReservationsPage /></ProtectedRoute>} />
      <Route path="/my-books" element={<ProtectedRoute><MyBooksPage /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/admin" element={<RequireRole><AdminDashboardPage /></RequireRole>} />
      <Route path="/admin/books" element={<RequireRole><AdminBooksPage /></RequireRole>} />
      <Route path="/admin/issues" element={<RequireRole><AdminIssuesPage /></RequireRole>} />
      <Route path="/admin/reservations" element={<RequireRole><AdminReservationsPage /></RequireRole>} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default AppRoutes
