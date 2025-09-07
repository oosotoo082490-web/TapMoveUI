import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown } from "lucide-react";

export default function Navigation() {
  const [location, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [seminarDropdownOpen, setSeminarDropdownOpen] = useState(false);
  const [productDropdownOpen, setProductDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const productDropdownRef = useRef<HTMLDivElement>(null);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const navigateTo = (path: string) => {
    setLocation(path);
    closeMobileMenu();
  };

  const isActivePage = (path: string) => {
    return location === path;
  };

  const isSeminarActive = () => {
    return location === "/seminar" || location === "/seminar/schedule" || location === "/seminar/apply";
  };

  const isProductActive = () => {
    return location === "/products" || location === "/products/tapmove" || location === "/products/story";
  };

  const toggleSeminarDropdown = () => {
    setSeminarDropdownOpen(!seminarDropdownOpen);
    if (!seminarDropdownOpen) {
      setProductDropdownOpen(false);
    }
  };

  const closeSeminarDropdown = () => {
    setSeminarDropdownOpen(false);
  };

  const toggleProductDropdown = () => {
    setProductDropdownOpen(!productDropdownOpen);
    if (!productDropdownOpen) {
      setSeminarDropdownOpen(false);
    }
  };

  const closeProductDropdown = () => {
    setProductDropdownOpen(false);
  };

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setSeminarDropdownOpen(false);
      }
      if (productDropdownRef.current && !productDropdownRef.current.contains(event.target as Node)) {
        setProductDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/">
              <h1 className="text-2xl font-bold text-gray-900 cursor-pointer">TAPMOVE</h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link
                data-testid="nav-home"
                href="/"
                className={`transition-colors px-3 py-2 text-sm font-medium ${
                  isActivePage("/") 
                    ? "text-primary font-semibold" 
                    : "text-gray-600 hover:text-primary"
                }`}
              >
                홈
              </Link>
              {/* 세미나 드롭다운 메뉴 */}
              <div 
                ref={dropdownRef}
                className="relative"
                onMouseEnter={() => {
                  setSeminarDropdownOpen(true);
                  setProductDropdownOpen(false);
                }}
              >
                <button
                  data-testid="nav-seminar"
                  onClick={toggleSeminarDropdown}
                  className={`transition-colors px-3 py-2 text-sm font-medium flex items-center ${
                    isSeminarActive() 
                      ? "text-primary font-semibold" 
                      : "text-gray-600 hover:text-primary"
                  }`}
                >
                  세미나
                  <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${seminarDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {/* 드롭다운 메뉴 */}
                {seminarDropdownOpen && (
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 w-28 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50">
                    <Link
                      data-testid="nav-seminar-schedule"
                      href="/seminar/schedule"
                      onClick={closeSeminarDropdown}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                    >
                      세미나 일정
                    </Link>
                    <Link
                      data-testid="nav-seminar-apply"
                      href="/seminar/apply"
                      onClick={closeSeminarDropdown}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                    >
                      세미나 신청
                    </Link>
                  </div>
                )}
              </div>
              {/* 제품 드롭다운 메뉴 */}
              <div 
                ref={productDropdownRef}
                className="relative"
                onMouseEnter={() => {
                  setProductDropdownOpen(true);
                  setSeminarDropdownOpen(false);
                }}
              >
                <button
                  data-testid="nav-products"
                  onClick={toggleProductDropdown}
                  className={`transition-colors px-3 py-2 text-sm font-medium flex items-center ${
                    isProductActive() 
                      ? "text-primary font-semibold" 
                      : "text-gray-600 hover:text-primary"
                  }`}
                >
                  제품
                  <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${productDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {/* 드롭다운 메뉴 */}
                {productDropdownOpen && (
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 w-36 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50">
                    <Link
                      data-testid="nav-products-tapmove"
                      href="/products"
                      onClick={closeProductDropdown}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                    >
                      TAPMOVE
                    </Link>
                    <Link
                      data-testid="nav-products-story"
                      href="/products/story"
                      onClick={closeProductDropdown}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                    >
                      TAPMOVE Story
                    </Link>
                  </div>
                )}
              </div>
              <Link
                data-testid="nav-about"
                href="/about"
                className={`transition-colors px-3 py-2 text-sm font-medium ${
                  isActivePage("/about") 
                    ? "text-primary font-semibold" 
                    : "text-gray-600 hover:text-primary"
                }`}
              >
                센터 정보
              </Link>
              <Button
                data-testid="nav-login"
                onClick={() => setLocation("/login")}
                className="bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black text-amber-100 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300"
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
            <Link
              data-testid="nav-mobile-home"
              href="/"
              onClick={closeMobileMenu}
              className={`block px-3 py-2 text-base font-medium w-full text-left ${
                isActivePage("/") 
                  ? "text-primary font-semibold" 
                  : "text-gray-600"
              }`}
            >
              홈
            </Link>
            {/* 모바일 세미나 메뉴 */}
            <div className="space-y-1">
              <div className={`px-3 py-2 text-base font-medium ${
                isSeminarActive() 
                  ? "text-primary font-semibold" 
                  : "text-gray-600"
              }`}>
                세미나
              </div>
              <div className="pl-6 space-y-1">
                <Link
                  data-testid="nav-mobile-seminar-schedule"
                  href="/seminar/schedule"
                  onClick={closeMobileMenu}
                  className="block px-3 py-2 text-sm text-gray-600 hover:text-primary"
                >
                  세미나 일정
                </Link>
                <Link
                  data-testid="nav-mobile-seminar-apply"
                  href="/seminar/apply"
                  onClick={closeMobileMenu}
                  className="block px-3 py-2 text-sm text-gray-600 hover:text-primary"
                >
                  세미나 신청
                </Link>
              </div>
            </div>
            {/* 모바일 제품 메뉴 */}
            <div className="space-y-1">
              <div className={`px-3 py-2 text-base font-medium ${
                isProductActive() 
                  ? "text-primary font-semibold" 
                  : "text-gray-600"
              }`}>
                제품
              </div>
              <div className="pl-6 space-y-1">
                <Link
                  data-testid="nav-mobile-products-tapmove"
                  href="/products"
                  onClick={closeMobileMenu}
                  className="block px-3 py-2 text-sm text-gray-600 hover:text-primary"
                >
                  TAPMOVE
                </Link>
                <Link
                  data-testid="nav-mobile-products-story"
                  href="/products/story"
                  onClick={closeMobileMenu}
                  className="block px-3 py-2 text-sm text-gray-600 hover:text-primary"
                >
                  TAPMOVE Story
                </Link>
              </div>
            </div>
            <Link
              data-testid="nav-mobile-about"
              href="/about"
              onClick={closeMobileMenu}
              className={`block px-3 py-2 text-base font-medium w-full text-left ${
                isActivePage("/about") 
                  ? "text-primary font-semibold" 
                  : "text-gray-600"
              }`}
            >
              센터 정보
            </Link>
            <Button
              data-testid="nav-mobile-login"
              onClick={() => navigateTo("/login")}
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
