import { Link, useLocation } from "react-router-dom";
import { Shield, AlertTriangle } from "lucide-react";

export default function Header() {
    const location = useLocation();

    return (
        <header className="bg-navy text-white shadow-lg sticky top-0 z-[1000]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo and Title */}
                    <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
                        <Shield className="w-8 h-8 text-blue-300" />
                        <div>
                            <h1 className="text-lg font-bold leading-tight">Cyclone Shelter</h1>
                            <p className="text-xs text-blue-200 leading-tight">Availability System</p>
                        </div>
                    </Link>

                    {/* Alert Badge */}
                    <div className="flex items-center gap-2 bg-red-600/20 border border-red-500/40 rounded-full px-3 py-1.5 animate-blink">
                        <AlertTriangle className="w-4 h-4 text-red-400" />
                        <span className="text-xs font-bold text-red-300 uppercase tracking-wide">
                            Cyclone Alert Active
                        </span>
                    </div>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center gap-1">
                        <NavItem to="/" label="Map" active={location.pathname === "/"} />
                        <NavItem to="/dashboard" label="Dashboard" active={location.pathname === "/dashboard"} />
                        <NavItem to="/admin" label="Admin" active={location.pathname === "/admin"} />
                    </nav>

                    {/* Mobile nav */}
                    <nav className="flex md:hidden items-center gap-1">
                        <NavItem to="/" label="Map" active={location.pathname === "/"} compact />
                        <NavItem to="/dashboard" label="Stats" active={location.pathname === "/dashboard"} compact />
                        <NavItem to="/admin" label="Admin" active={location.pathname === "/admin"} compact />
                    </nav>
                </div>
            </div>
        </header>
    );
}

function NavItem({ to, label, active, compact }: { to: string; label: string; active: boolean; compact?: boolean }) {
    return (
        <Link
            to={to}
            className={`${compact ? "px-2 py-1 text-xs" : "px-3 py-2 text-sm"} rounded-md font-medium transition-colors ${active ? "bg-white/15 text-white" : "text-blue-200 hover:bg-white/10 hover:text-white"
                }`}
        >
            {label}
        </Link>
    );
}
