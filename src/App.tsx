import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import Pricing from './pages/Pricing'
import BecomeATutor from './pages/BecomeATutor'
import LoginSignup from './pages/LoginSignup'
import Tutor from './pages/Tutor'

// Admin imports
import AdminLayout from './admin/AdminLayout'
import Dashboard from './admin/Dashboard'
import TutorManagement from './admin/TutorManagement'
import StudentManagement from './admin/StudentManagement'
import ScheduleManagement from './admin/ScheduleManagement'
import PaymentsManagement from './admin/PaymentsManagement'
import MessagingManagement from './admin/MessagingManagement'

// Tutor management imports
import TutorDetails from './admin/tutors/TutorDetails'
import TutorEdit from './admin/tutors/TutorEdit'
import TutorSchedule from './admin/tutors/TutorSchedule'
import TutorStudents from './admin/tutors/TutorStudents'
import CreateTutor from './admin/tutors/CreateTutor'

// UI Components Provider
import { Toaster } from 'react-hot-toast'

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        {/* Main site routes */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/become-tutor" element={<BecomeATutor />} />
          <Route path="/login" element={<LoginSignup />} />
          <Route path="/tutor/:slug" element={<Tutor />} />
        </Route>

        {/* Admin routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="tutors" element={<TutorManagement />} />
          <Route path="tutors/:id" element={<TutorDetails />} />
          <Route path="tutors/:id/edit" element={<TutorEdit />} />
          <Route path="tutors/:id/schedule" element={<TutorSchedule />} />
          <Route path="tutors/:id/students" element={<TutorStudents />} />
          <Route path="tutors/create" element={<CreateTutor />} />
          <Route path="students" element={<StudentManagement />} />
          <Route path="schedule" element={<ScheduleManagement />} />
          <Route path="payments" element={<PaymentsManagement />} />
          <Route path="messaging" element={<MessagingManagement />} />
        </Route>
      </Routes>
    </>
  )
}

export default App