import { Route, Routes } from "react-router-dom";
import NotFound from "../components/NotFound";
import Profile from "../components/Profile";
import SavedNotes from "../components/SavedNotes";
import ChangeForgetPassword from "../components/auth/ChangeForgetPassword";
import ForgetPassword from "../components/auth/ForgotPassword";
import Login from "../components/auth/Login";
import Register from "../components/auth/Register";
import Verify from "../components/auth/Verify";
import DashboardLayout from "../layout/DashboardLayout";
import AddNote from "../pages/Dashboard/AddNote";
import Home from "../pages/Dashboard/Home";
import ListUsers from "../pages/Dashboard/ListUsers";
import Notes from "../pages/Dashboard/Notes";
import PostApproval from "../pages/Dashboard/PostApproval";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<Home />} />
        <Route path="/dashboard/uploads" element={<AddNote />} />
        <Route path="/dashboard/approvals" element={<PostApproval />} />
        <Route path="/dashboard/users" element={<ListUsers />} />
        <Route path="/dashboard/profile" element={<Profile />} />
        <Route path="/dashboard/notes" element={<Notes />} />
        <Route path="/dashboard/saved-notes" element={<SavedNotes />} />
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-email" element={<Verify />} />
      <Route path="/forgot-password" element={<ForgetPassword />} />
      <Route path="/change-password" element={<ChangeForgetPassword />} />


      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
