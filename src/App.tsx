import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Header from "@/components/Header";
import Index from "@/pages/Index";
import Admin from "@/pages/Admin";
import Dashboard from "@/pages/Dashboard";
import NotFound from "@/pages/NotFound";
import "./App.css";

function App() {
    return (
        <BrowserRouter>
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1">
                    <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="/admin" element={<Admin />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </main>
            </div>
            <Toaster position="top-right" />
        </BrowserRouter>
    );
}

export default App;
