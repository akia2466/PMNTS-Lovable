import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { PublicLayout } from "@/components/layout/PublicLayout";
import Home from "./pages/Home";
import About from "./pages/About";
import Academics from "./pages/Academics";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import DashboardOverview from "./pages/dashboard/DashboardOverview";
import PerformanceSummary from "./pages/dashboard/PerformanceSummary";
import AssignmentsHub from "./pages/dashboard/AssignmentsHub";
import AttendanceRecord from "./pages/dashboard/AttendanceRecord";
import MyFiles from "./pages/dashboard/MyFiles";
import MyMessenger from "./pages/dashboard/MyMessenger";
import Community from "./pages/dashboard/Community";
import FriendsAndPeers from "./pages/dashboard/FriendsAndPeers";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/academics" element={<Academics />} />
              <Route path="/contact" element={<Contact />} />
            </Route>
            
            {/* Auth Route */}
            <Route path="/auth" element={<Auth />} />
            
            {/* Dashboard Routes */}
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardOverview />} />
              <Route path="performance" element={<PerformanceSummary />} />
              <Route path="assignments" element={<AssignmentsHub />} />
              <Route path="attendance" element={<AttendanceRecord />} />
              <Route path="files" element={<MyFiles />} />
              <Route path="messenger" element={<MyMessenger />} />
              <Route path="community" element={<Community />} />
              <Route path="friends" element={<FriendsAndPeers />} />
              <Route path="colleagues" element={<FriendsAndPeers />} />
            </Route>
            
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
