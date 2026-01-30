import { useNavigate } from "react-router-dom";
import { AlertCircle, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function NotFound() {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate("/dashboard");
    };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full border-0 shadow-none">
        <CardContent className="p-8 md:p-12">
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="relative">
              <div className="absolute inset-0 bg-red-100 rounded-full blur-2xl opacity-50"></div>
              <AlertCircle className="w-24 h-24 text-red-500 relative" strokeWidth={1.5} />
            </div>

            <div className="space-y-2">
              <h1 className="text-7xl md:text-8xl font-bold text-primary tracking-tight">
                404
              </h1>
              <h2 className="text-2xl md:text-3xl font-semibold text-primary">
                Page not found
              </h2>
            </div>

            <p className="text-secondary text-lg max-w-md">
              Sorry, we couldn't find the page you're looking for.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-4 w-full sm:w-auto">
              <Button 
                onClick={handleGoHome}
                className="gap-2 bg-blue-600 hover:bg-blue-700 cursor-pointer"
                size="lg"
              >
                <LayoutDashboard className="w-4 h-4" />
                Back to Dashboard
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}