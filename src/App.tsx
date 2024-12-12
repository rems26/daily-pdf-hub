import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PDFView from "./pages/PDFView";
import Admin from "./pages/Admin";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Toaster />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/admin" replace />} />
        <Route path="/pdf/:id" element={<PDFView />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;