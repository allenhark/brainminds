import { Routes, Route, useLocation } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import Pricing from './pages/Pricing'
import BecomeATutor from './pages/BecomeATutor'
import LoginSignup from './pages/LoginSignup'
import Tutor from './pages/Tutor'
import Welcome from './pages/Welcome'
import FaqPage from './pages/faq'
import ContactPage from './pages/contact'

// Subject pages
import IELTSCoursePage from './pages/subjects/ielts'
import GeneralEnglishCoursePage from './pages/subjects/general'
import BusinessEnglishPage from './pages/subjects/business'

// Location pages
import BeijingPage from './pages/beijing'
import BeijingBusinessEnglish from './pages/beijing/business-english'
import ShanghaiPage from './pages/shanghai'
import ShanghaiConversation from './pages/shanghai/conversation'
import GuangzhouPage from './pages/guangzhou'
import GuangzhouPronunciation from './pages/guangzhou/pronunciation'

// Admin imports
import AdminLayout from './admin/AdminLayout'
import Dashboard from './admin/Dashboard'
import TutorManagement from './admin/TutorManagement'
import StudentManagement from './admin/StudentManagement'
import ScheduleManagement from './admin/ScheduleManagement'
import PaymentsManagement from './admin/PaymentsManagement'
import MessagingManagement from './admin/MessagingManagement'
import Support from './admin/Support'
import StudentView from './admin/StudentView'

// Tutor management imports
import TutorDetails from './admin/tutors/TutorDetails'
import TutorEdit from './admin/tutors/TutorEdit'
import TutorSchedule from './admin/tutors/TutorSchedule'
import TutorStudents from './admin/tutors/TutorStudents'
import CreateTutor from './admin/tutors/CreateTutor'

// Student Study imports
import StudyLayout from './study/StudyLayout'
import StudentDashboard from './study/Dashboard'
import StudentTutors from './study/Tutors'
import StudentMessages from './study/Messages'
import Subscription from './study/Subscription'
import TutorView from './study/TutorView'

// UI Components Provider
import { Toaster } from 'react-hot-toast'

// Tutor routes
import TutorLayout from './tutor/TutorLayout'
import TutorMessaging from './tutor/TutorMessaging'
import TutorDashboard from './tutor/TutorDashboard'
import TutorProfile from './tutor/TutorProfile'
import TutorAvailability from './tutor/TutorAvailability'
import TutorSessions from './tutor/TutorSessions'
import TutorPayments from './tutor/TutorPayments'
import MyTutorStudents from './tutor/TutorStudents'
import TutorClassLinks from './tutor/TutorClassLinks'
import StudySettings from './study/StudySettings'
import TutorNotifications from './tutor/TutorNotifications'
import UserManagement from './admin/UserManagement'
import { useEffect } from 'react'

// ScrollToTop component to reset scroll position on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <ScrollToTop />
      <Routes>
        {/* Main site routes */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/become-tutor" element={<BecomeATutor />} />
          <Route path="/login" element={<LoginSignup />} />
          <Route path="/tutor/:slug" element={<Tutor />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Subject routes */}
          <Route path="/subjects/ielts" element={<IELTSCoursePage />} />
          <Route path="/subjects/general" element={<GeneralEnglishCoursePage />} />
          <Route path="/subjects/business" element={<BusinessEnglishPage />} />

          {/* Location-based routes */}
          {/* Beijing routes */}
          <Route path="/beijing" element={<BeijingPage />} />
          <Route path="/beijing/business-english" element={<BeijingBusinessEnglish />} />
          <Route path="/beijing/ielts" element={<BeijingPage />} />
          <Route path="/beijing/toefl" element={<BeijingPage />} />
          <Route path="/beijing/kids" element={<BeijingPage />} />

          {/* Shanghai routes */}
          <Route path="/shanghai" element={<ShanghaiPage />} />
          <Route path="/shanghai/business-english" element={<ShanghaiPage />} />
          <Route path="/shanghai/ielts" element={<ShanghaiPage />} />
          <Route path="/shanghai/toefl" element={<ShanghaiPage />} />
          <Route path="/shanghai/conversation" element={<ShanghaiConversation />} />

          {/* Guangzhou routes */}
          <Route path="/guangzhou" element={<GuangzhouPage />} />
          <Route path="/guangzhou/business-english" element={<GuangzhouPage />} />
          <Route path="/guangzhou/ielts" element={<GuangzhouPage />} />
          <Route path="/guangzhou/kids" element={<GuangzhouPage />} />
          <Route path="/guangzhou/pronunciation" element={<GuangzhouPronunciation />} />

          {/* Shenzhen routes */}
          <Route path="/shenzhen" element={<Home />} />
          <Route path="/shenzhen/business-english" element={<Home />} />
          <Route path="/shenzhen/toefl" element={<Home />} />
          <Route path="/shenzhen/conversation" element={<Home />} />
          <Route path="/shenzhen/grammar" element={<Home />} />
        </Route>

        {/* Admin routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path='dashboard' element={<Dashboard />} />
          <Route path="tutors" element={<TutorManagement />} />
          <Route path="tutors/:id" element={<TutorDetails />} />
          <Route path="tutors/:id/edit" element={<TutorEdit />} />
          <Route path="tutors/:id/schedule" element={<TutorSchedule />} />
          <Route path="tutors/:id/students" element={<TutorStudents />} />
          <Route path="tutors/create" element={<CreateTutor />} />
          <Route path="students" element={<StudentManagement />} />
          <Route path="students/:id" element={<StudentView />} />
          <Route path="schedule" element={<ScheduleManagement />} />
          <Route path="payments" element={<PaymentsManagement />} />
          <Route path="messaging" element={<MessagingManagement />} />
          <Route path="support" element={<Support />} />
          <Route path="admins" element={<UserManagement />} />
        </Route>

        {/* Tutor routes */}
        <Route path="/my-tutor" element={<TutorLayout />}>
          <Route index element={<TutorDashboard />} />
          <Route path="dashboard" element={<TutorDashboard />} />
          <Route path="messages" element={<TutorMessaging />} />
          <Route path="profile" element={<TutorProfile />} />
          <Route path="students" element={<MyTutorStudents />} />
          <Route path="sessions" element={<TutorSessions />} />
          <Route path="availability" element={<TutorAvailability />} />
          <Route path="payments" element={<TutorPayments />} />
          <Route path="class-links" element={<TutorClassLinks />} />
          <Route path="notifications" element={<TutorNotifications />} />
        </Route>

        {/* Student Study routes */}
        <Route path="/study" element={<StudyLayout />}>
          <Route index element={<StudentDashboard />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="tutors" element={<StudentTutors />} />
          <Route path="messages" element={<StudentMessages />} />
          <Route path="subscription/:mode" element={<Subscription />} />
          <Route path="subscription/new" element={<Subscription />} />
          <Route path="schedule" element={<TutorSessions />} />
          <Route path="payments" element={<Subscription />} />
          <Route path="settings" element={<StudySettings />} />
          <Route path="tutors/:id" element={<TutorView />} />
        </Route>
      </Routes>
    </>
  )
}

export default App