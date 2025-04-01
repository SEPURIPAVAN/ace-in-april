import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { 
  BrowserRouter, 
  Routes, 
  Route, 
  Navigate,
  createRoutesFromElements,
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Login from "@/pages/Login";
import Home from "@/pages/Home";
import Submit from "@/pages/Submit";
import Admin from "@/pages/Admin";
import NotFound from "@/pages/NotFound";
import ProtectedRoute from "@/components/ProtectedRoute";

const queryClient = new QueryClient();

// Create router with data router
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<AuthProvider />}>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/submit" element={<ProtectedRoute><Submit /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute requireAdmin><Admin /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Route>
  )
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <RouterProvider router={router} />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
