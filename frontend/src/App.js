import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import LandingPage from "@/pages/LandingPage";
import AdminPage from "@/pages/AdminPage";

function App() {
  return (
    <div>
      <Toaster
        theme="light"
        position="top-center"
        toastOptions={{
          style: {
            background: '#FFFFFF',
            border: '1px solid rgba(0,0,0,0.06)',
            color: '#1A1A1A',
            fontFamily: 'Inter, sans-serif',
          },
        }}
      />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
