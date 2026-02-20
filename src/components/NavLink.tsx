import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NavLinkProps {
    to: string;
    children: React.ReactNode;
    className?: string;
}

export default function NavLink({ to, children, className }: NavLinkProps) {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <Link
            to={to}
            className={cn(
                "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                    ? "bg-white/15 text-white"
                    : "text-blue-200 hover:bg-white/10 hover:text-white",
                className
            )}
        >
            {children}
        </Link>
    );
}
