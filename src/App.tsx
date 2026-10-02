import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import ContactPage from "./pages/ContactPage.tsx";
import LessonsPage from "./pages/LessonsPage.tsx";
import ChaptersPage from "./pages/ChaptersPage.tsx";
import MediaPage from "./pages/MediaPage.tsx";
import AboutPage from "./pages/AboutPage.tsx";
import ProgramsPage from "./pages/ProgramsPage.tsx";
import ImpactPage from "./pages/ImpactPage.tsx";
import TeamPage from "./pages/TeamPage.tsx";
import NotFound from "./pages/NotFound.tsx";
import ChapterDetailPage from "./pages/ChapterDetailPage.tsx";
import ChaptersAdminPage from "./pages/ChaptersAdminPage.tsx";
import ChapterAdminEditPage from "./pages/ChapterAdminEditPage.tsx";
import PartnersPage from "./pages/PartnersPage.tsx";
import HomeAdminPage from "./pages/HomeAdminPage.tsx";
import PartnersAdminPage from "./pages/PartnersAdminPage.tsx";
import EventsAdminPage from "./pages/EventsAdminPage.tsx";
import ProjectsPage from "./pages/ProjectsPage.tsx";
import ScrollToTop from "@/components/ScrollToTop";
import HashScroller from "@/components/HashScroller";
import GoogleTranslate from "@/components/GoogleTranslate";
import ProtectedAdminRoute from "@/components/ProtectedAdminRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <HashScroller />
        <GoogleTranslate />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/programs" element={<ProgramsPage />} />
          <Route path="/impact" element={<ImpactPage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/media" element={<MediaPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/lessons" element={<LessonsPage />} />
          <Route path="/chapters" element={<ChaptersPage />} />
          <Route path="/chapters/:id" element={<ChapterDetailPage />} />
          <Route path="/community/partners" element={<PartnersPage />} />
          <Route path="/community/projects" element={<ProjectsPage />} />
          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <ChaptersAdminPage />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/home"
            element={
              <ProtectedAdminRoute>
                <HomeAdminPage />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/partners"
            element={
              <ProtectedAdminRoute>
                <PartnersAdminPage />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/events"
            element={
              <ProtectedAdminRoute>
                <EventsAdminPage />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/:id"
            element={
              <ProtectedAdminRoute>
                <ChapterAdminEditPage />
              </ProtectedAdminRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
