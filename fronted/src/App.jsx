import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./pages/SignUp";
import Login from "./pages/Login";
import VerifyEmail from "./pages/VerifyEmail";
import Dashboard from "./pages/Dashboard";
import ResetPasswordRequest from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";
import NoPageFound from "./pages/NoPageFound";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Workspaces from './pages/Workspaces';
import MyTasks from './pages/MyTasks';
import Members from './pages/Members';
import Settings from './pages/Settings';
import Achieved from './pages/Achieved';
import DashboardLayout from './components/layouts/DashboardLayout';
import Tasks from './pages/Tasks';

function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* Public routes (without sidebar) */}
          <Route path="/" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/reset-password-request" element={<ResetPasswordRequest />} />
          <Route path="/reset-password" element={<ForgotPassword />} />

          {/* Dashboard routes (with main sidebar) */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/workspaces" element={<Workspaces />} />
            <Route path="/my-tasks" element={<MyTasks />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/members" element={<Members />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/achieved" element={<Achieved />} />
          </Route>

          <Route path="*" element={<NoPageFound />} />
        </Routes>
      </Router>

      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default App;