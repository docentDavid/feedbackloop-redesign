"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userName, setUserName] = useState<string>("");
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      if (user && user.email) {
        // Fetch teacher name from teachers table
        const { data, error } = await supabase
          .from("teachers")
          .select("name")
          .eq("email", user.email)
          .single();
        if (!error && data?.name) {
          setUserName(data.name);
        } else {
          setUserName("");
        }
      } else {
        setUserName("");
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setUserName("");
    setIsMenuOpen(false);
    router.push("/");
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <nav className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="text-xl font-semibold text-gray-800">
            FeedbackLoop
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <Link
              href="/dashboard"
              className={`${
                isActive("/dashboard")
                  ? "text-blue-600 font-medium"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/progress"
              className={`${
                isActive("/progress")
                  ? "text-blue-600 font-medium"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Progress
            </Link>
            <Link
              href="/admin"
              className={`${
                isActive("/admin")
                  ? "text-blue-600 font-medium"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Admin
            </Link>
          </div>

          {/* User Profile Section */}
          <div className="hidden md:flex items-center space-x-4">
            {user && userName ? (
              <>
                <span className="text-gray-600">{userName}</span>
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link href="/" className="text-gray-600 hover:text-gray-900">
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 space-y-4">
            <Link
              href="/dashboard"
              className={`block ${
                isActive("/dashboard")
                  ? "text-blue-600 font-medium"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              href="/progress"
              className={`block ${
                isActive("/progress")
                  ? "text-blue-600 font-medium"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Progress
            </Link>
            <Link
              href="/admin"
              className={`block ${
                isActive("/admin")
                  ? "text-blue-600 font-medium"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Admin
            </Link>
            <div className="pt-4 border-t border-gray-200">
              {user && userName ? (
                <>
                  <span className="block text-gray-600 mb-2">{userName}</span>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="block text-gray-600 hover:text-gray-900"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/"
                  className="block text-gray-600 hover:text-gray-900"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
