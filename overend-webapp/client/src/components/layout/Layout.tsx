import { Outlet, Link, useLocation } from 'react-router-dom';
import { Library, Search, FileText } from 'lucide-react';

export default function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Library className="h-8 w-8 text-blue-600" />
              <h1 className="ml-2 text-2xl font-bold text-gray-900">
                Overend
              </h1>
              <span className="ml-2 text-sm text-gray-500">Reference Manager</span>
            </div>

            <nav className="flex space-x-4">
              <Link
                to="/libraries"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname.startsWith('/libraries') ||
                  location.pathname.startsWith('/library')
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Libraries
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-gray-500">
            Overend - Modern Reference Manager based on JabRef
          </p>
        </div>
      </footer>
    </div>
  );
}
