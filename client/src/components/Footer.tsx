import { MapPin, Phone, Mail, Instagram, Youtube, Facebook } from "lucide-react";

export default function Footer() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">TAPMOVE</h3>
            <p className="text-gray-300 mb-4 leading-relaxed">
              새로운 피트니스의 혁신을 제공하는 TAPMOVE와 함께
              <br />
              안전하고 효과적인 운동을 경험해보세요.
            </p>
            <div className="space-y-2 text-gray-300">
              <p className="flex items-center">
                <MapPin className="mr-2 h-4 w-4" />
                대구시 북구 침산남로 172, 3층
              </p>
              <p className="flex items-center">
                <Phone className="mr-2 h-4 w-4" />
                053-XXX-XXXX
              </p>
              <p className="flex items-center">
                <Mail className="mr-2 h-4 w-4" />
                info@tapmove.co.kr
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">바로가기</h4>
            <ul className="space-y-2">
              <li>
                <button
                  data-testid="footer-link-seminar"
                  onClick={() => scrollToSection("seminar")}
                  className="text-gray-300 hover:text-white transition-colors text-left"
                >
                  세미나 일정
                </button>
              </li>
              <li>
                <button
                  data-testid="footer-link-apply"
                  onClick={() => scrollToSection("apply")}
                  className="text-gray-300 hover:text-white transition-colors text-left"
                >
                  세미나 신청
                </button>
              </li>
              <li>
                <button
                  data-testid="footer-link-reviews"
                  onClick={() => scrollToSection("reviews")}
                  className="text-gray-300 hover:text-white transition-colors text-left"
                >
                  후기
                </button>
              </li>
              <li>
                <button
                  data-testid="footer-link-product"
                  onClick={() => scrollToSection("product")}
                  className="text-gray-300 hover:text-white transition-colors text-left"
                >
                  제품 구매
                </button>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4">고객지원</h4>
            <ul className="space-y-2">
              <li>
                <button
                  data-testid="footer-link-policy"
                  onClick={() => scrollToSection("policy")}
                  className="text-gray-300 hover:text-white transition-colors text-left"
                >
                  이용약관
                </button>
              </li>
              <li>
                <a
                  data-testid="footer-link-privacy"
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  개인정보처리방침
                </a>
              </li>
              <li>
                <a
                  data-testid="footer-link-refund"
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  환불정책
                </a>
              </li>
              <li>
                <a
                  data-testid="footer-link-faq"
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 TAPMOVE. All rights reserved. | 상표등록번호: 제XX-XXXXXX호
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a
              data-testid="social-instagram"
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a
              data-testid="social-youtube"
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="YouTube"
            >
              <Youtube className="h-5 w-5" />
            </a>
            <a
              data-testid="social-facebook"
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
