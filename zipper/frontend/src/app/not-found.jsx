import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        {/* 404 Icon */}
        <div className="mb-8">
          <div className="w-32 h-32 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="h-16 w-16 text-slate-400" />
          </div>
        </div>

        {/* 404 Text */}
        <h1 className="text-6xl font-bold text-slate-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-slate-700 mb-4">Page Not Found</h2>
        <p className="text-slate-600 mb-8 leading-relaxed">
          Sorry, we couldn't find the page you're looking for. It might have been moved, 
          deleted, or you entered the wrong URL.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/dashboard/Home">
            <Button className="w-full sm:w-auto">
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Button>
          </Link>
          
          <Link href="/dashboard/products">
            <Button variant="outline" className="w-full sm:w-auto">
              <Search className="h-4 w-4 mr-2" />
              Browse Products
            </Button>
          </Link>
        </div>

        {/* Back Button */}
        <div className="mt-8">
          <button 
            onClick={() => window.history.back()}
            className="inline-flex items-center text-slate-600 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
