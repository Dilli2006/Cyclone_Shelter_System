import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 p-4">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-navy mb-2">404</h1>
                <p className="text-xl text-muted-foreground mb-6">Page not found</p>
                <Button asChild className="bg-navy hover:bg-navy-dark">
                    <Link to="/">
                        <Home className="w-4 h-4 mr-2" />
                        Back to Shelter Map
                    </Link>
                </Button>
            </div>
        </div>
    );
}
