import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle } from 'lucide-react';

/**
 * NotFound (404) Page
 * 
 * Displayed when user navigates to a route that doesn't exist.
 * Provides friendly messaging and navigation options.
 */
export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <AlertCircle size={80} className="text-blue-600" />
        </div>

        {/* 404 Text */}
        <h1 className="text-6xl sm:text-7xl font-bold text-gray-900 mb-4">
          404
        </h1>

        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h2>

        {/* Description */}
        <p className="text-lg text-gray-600 mb-8">
          Oops! The page you're looking for doesn't exist or has been moved. Don't worry, you can always return home.
        </p>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => navigate('/')}
            className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Home
          </button>

          <button
            onClick={() => navigate(-1)}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-12 pt-8 border-t border-gray-300">
          <p className="text-sm text-gray-600">
            If you believe this is a mistake, please{' '}
            <a href="/contact" className="text-blue-600 hover:text-blue-700 font-semibold">
              contact us
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
