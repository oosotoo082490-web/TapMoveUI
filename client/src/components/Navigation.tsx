import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export default function Navigation() {
  const [, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-gray-900">TAPMOVE</h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <button
                data-testid="nav-home"
                onClick={() => scrollToSection("home")}
                className="text-gray-900 hover:text-primary transition-colors px-3 py-2 text-sm font-medium"
              >
                홈
              </button>
              <button
                data-testid="nav-seminar"
                onClick={() => scrollToSection("seminar")}
                className="text-gray-600 hover:text-primary transition-colors px-3 py-2 text-sm font-medium"
              >
                세미나 일정
              </button>
              <button
                data-testid="nav-apply"
                onClick={() => scrollToSection("apply")}
                className="text-gray-600 hover:text-primary transition-colors px-3 py-2 text-sm font-medium"
              >
                신청
              </button>
              <button
                data-testid="nav-reviews"
                onClick={() => scrollToSection("reviews")}
                className="text-gray-600 hover:text-primary transition-colors px-3 py-2 text-sm font-medium"
              >
                후기
              </button>
              <button
                data-testid="nav-location"
                onClick={() => scrollToSection("location")}
                className="text-gray-600 hover:text-primary transition-colors px-3 py-2 text-sm font-medium"
              >
                센터 위치
              </button>
              <Button
                data-testid="nav-login"
                onClick={() => setLocation("/login")}
                className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700"
              >
                로그인
              </Button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              data-testid="button-mobile-menu"
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-4 pt-2 pb-3 space-y-1">
            <button
              data-testid="nav-mobile-home"
              onClick={() => scrollToSection("home")}
              className="block px-3 py-2 text-base font-medium text-gray-900 w-full text-left"
            >
              홈
            </button>
            <button
              data-testid="nav-mobile-seminar"
              onClick={() => scrollToSection("seminar")}
              className="block px-3 py-2 text-base font-medium text-gray-600 w-full text-left"
            >
              세미나 일정
            </button>
            <button
              data-testid="nav-mobile-apply"
              onClick={() => scrollToSection("apply")}
              className="block px-3 py-2 text-base font-medium text-gray-600 w-full text-left"
            >
              신청
            </button>
            <button
              data-testid="nav-mobile-reviews"
              onClick={() => scrollToSection("reviews")}
              className="block px-3 py-2 text-base font-medium text-gray-600 w-full text-left"
            >
              후기
            </button>
            <button
              data-testid="nav-mobile-location"
              onClick={() => scrollToSection("location")}
              className="block px-3 py-2 text-base font-medium text-gray-600 w-full text-left"
            >
              센터 위치
            </button>
            <Button
              data-testid="nav-mobile-login"
              onClick={() => setLocation("/login")}
              className="block px-3 py-2 text-base font-medium text-primary w-full text-left"
              variant="ghost"
            >
              로그인
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
