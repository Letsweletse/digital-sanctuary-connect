
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { LogoProvider } from "./components/layout/LogoContext";

// Pages
import Index from "./pages/Index";
import Sermons from "./pages/Sermons";
import SermonSeries from "./pages/SermonSeries";
import Leadership from "./pages/Leadership";
import HouseChurch from "./pages/HouseChurch";
import About from "./pages/About";
import Events from "./pages/Events";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";
import Give from "./pages/Give"; 
import NotFound from "./pages/NotFound";
import EmailTest from "./components/email-test";
import RegistrationConfirmation from "./pages/RegistrationConfirmation";
import WhatsAppTester from "./components/examples/WhatsAppTester";
import CheckIn from "./pages/CheckIn";
import Conference from "./pages/Conference";
import KioskCheckIn from "./pages/KioskCheckIn";

const queryClient = new QueryClient();

// Title component to update document title based on route
const TitleUpdater = () => {
  const location = useLocation();
  
  useEffect(() => {
    let title = "Gate Gaborone";
    
    // Add page name to title
    if (location.pathname !== "/") {
      const pageName = location.pathname.substring(1);
      title += ` | ${pageName.charAt(0).toUpperCase() + pageName.slice(1).replace(/-/g, " ")}`;
    }
    
    document.title = title;
  }, [location]);
  
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <LogoProvider>
        <BrowserRouter>
          <TitleUpdater />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/sermons" element={<Sermons />} />
            <Route path="/sermon-series/:seriesName" element={<SermonSeries />} />
            <Route path="/leadership" element={<Leadership />} />
            <Route path="/house-church" element={<HouseChurch />} />
            <Route path="/about" element={<About />} />
            <Route path="/events" element={<Events />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/give" element={<Give />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/email-test" element={<EmailTest />} />
            <Route path="/registration-confirmation" element={<RegistrationConfirmation />} />
            <Route path="/whatsapp-test" element={<WhatsAppTester />} />
            <Route path="/check-in/:id" element={<CheckIn />} />
            <Route path="/conference" element={<Conference />} />
            <Route path="/kiosk-checkin" element={<KioskCheckIn />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </LogoProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
