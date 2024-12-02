import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Layout, LayoutGrid, BookOpen, Video, Music, Menu, X } from 'lucide-react';
import { useState } from 'react';
import BlogEditor from './components/blog/BlogEditor';
import SocialMediaDashboard from './components/social/SocialMediaDashboard';
import EbookWriter from './components/ebook/EbookWriter';
import VideoStudio from './components/video/VideoStudio';
import MusicGenerator from './components/music/MusicGenerator';

export default function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <Link to="/" className="flex items-center px-2 py-2 text-gray-900" onClick={closeMobileMenu}>
                  <Layout className="w-6 h-6 text-primary-600 mr-2" />
                  <span className="font-semibold">Content Studio</span>
                </Link>
                <div className="hidden md:ml-6 md:flex md:space-x-4">
                  <Link
                    to="/blog"
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary-600"
                  >
                    <LayoutGrid className="w-4 h-4 mr-2" />
                    Blog
                  </Link>
                  <Link
                    to="/social"
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary-600"
                  >
                    <Layout className="w-4 h-4 mr-2" />
                    Social Media
                  </Link>
                  <Link
                    to="/ebook"
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary-600"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    eBook
                  </Link>
                  <Link
                    to="/video"
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary-600"
                  >
                    <Video className="w-4 h-4 mr-2" />
                    Video
                  </Link>
                  <Link
                    to="/music"
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary-600"
                  >
                    <Music className="w-4 h-4 mr-2" />
                    Music
                  </Link>
                </div>
              </div>
              <div className="md:hidden flex items-center">
                <button
                  onClick={toggleMobileMenu}
                  className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
                >
                  {isMobileMenuOpen ? (
                    <X className="w-6 h-6" />
                  ) : (
                    <Menu className="w-6 h-6" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <Link
                  to="/blog"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  onClick={closeMobileMenu}
                >
                  <div className="flex items-center">
                    <LayoutGrid className="w-5 h-5 mr-3" />
                    Blog
                  </div>
                </Link>
                <Link
                  to="/social"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  onClick={closeMobileMenu}
                >
                  <div className="flex items-center">
                    <Layout className="w-5 h-5 mr-3" />
                    Social Media
                  </div>
                </Link>
                <Link
                  to="/ebook"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  onClick={closeMobileMenu}
                >
                  <div className="flex items-center">
                    <BookOpen className="w-5 h-5 mr-3" />
                    eBook
                  </div>
                </Link>
                <Link
                  to="/video"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  onClick={closeMobileMenu}
                >
                  <div className="flex items-center">
                    <Video className="w-5 h-5 mr-3" />
                    Video
                  </div>
                </Link>
                <Link
                  to="/music"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  onClick={closeMobileMenu}
                >
                  <div className="flex items-center">
                    <Music className="w-5 h-5 mr-3" />
                    Music
                  </div>
                </Link>
              </div>
            </div>
          )}
        </nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blog" element={<BlogEditor />} />
            <Route path="/social" element={<SocialMediaDashboard />} />
            <Route path="/ebook" element={<EbookWriter />} />
            <Route path="/video" element={<VideoStudio />} />
            <Route path="/music" element={<MusicGenerator />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function Home() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900">Welcome to Content Studio</h1>
        <p className="mt-4 text-xl text-gray-600">
          Your all-in-one platform for content creation and management
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          to="/blog"
          className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-200"
        >
          <LayoutGrid className="w-8 h-8 text-primary-600 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">Blog Editor</h2>
          <p className="mt-2 text-gray-600">
            Create and manage your blog content with AI assistance
          </p>
        </Link>

        <Link
          to="/social"
          className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-200"
        >
          <Layout className="w-8 h-8 text-primary-600 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">Social Media</h2>
          <p className="mt-2 text-gray-600">
            Generate and schedule content for multiple platforms
          </p>
        </Link>

        <Link
          to="/ebook"
          className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-200"
        >
          <BookOpen className="w-8 h-8 text-primary-600 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">eBook Creator</h2>
          <p className="mt-2 text-gray-600">
            Write and publish professional ebooks with ease
          </p>
        </Link>

        <Link
          to="/video"
          className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-200"
        >
          <Video className="w-8 h-8 text-primary-600 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">Video Studio</h2>
          <p className="mt-2 text-gray-600">
            Create engaging videos and YouTube Shorts
          </p>
        </Link>

        <Link
          to="/music"
          className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-200"
        >
          <Music className="w-8 h-8 text-primary-600 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">Music Generator</h2>
          <p className="mt-2 text-gray-600">
            Generate royalty-free music for your content
          </p>
        </Link>
      </div>
    </div>
  );
}