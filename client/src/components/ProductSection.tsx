import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus, CreditCard, Truck, Package } from "lucide-react";
import SeminarVerificationModal from "./modals/SeminarVerificationModal";
import type { Product, User } from "@shared/schema";

export default function ProductSection() {
  const [quantity, setQuantity] = useState(10);
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: user } = useQuery<User>({
    queryKey: ["/api/auth/me"],
  });

  const product = products[0]; // Get first product
  const unitPrice = 17500; // 세미나 회원가 적용 (세미나 참석자 전용)
  const totalPrice = unitPrice * quantity;

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () => setQuantity((prev) => Math.max(10, prev - 1));

  if (isLoading) {
    return (
      <section id="product" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">제품 구매</h2>
            <p className="text-xl text-gray-600">공식 TAPMOVE 매트를 만나보세요</p>
          </div>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-pulse">
              <div className="w-full h-96 bg-gray-300 rounded-2xl"></div>
            </div>
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-300 rounded w-3/4"></div>
              <div className="h-6 bg-gray-300 rounded w-full"></div>
              <div className="h-6 bg-gray-300 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!product) {
    return (
      <section id="product" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-gray-500">제품 정보를 불러올 수 없습니다.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="product" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">제품 구매</h2>
          <p className="text-xl text-gray-600">공식 TAPMOVE 매트를 만나보세요</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Product Image */}
          <div className="text-center lg:sticky lg:top-20">
            <img
              src="/tapmove.jpg"
              alt="TAPMOVE 공식 매트"
              className="rounded-2xl shadow-lg w-full max-w-md mx-auto"
            />
            <div className="mt-6">
              <Badge className="bg-gradient-to-r from-slate-700 to-slate-800 text-amber-100 px-4 py-2 rounded-full text-sm font-semibold">
                공식 정품
              </Badge>
              <Badge className="bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800 px-4 py-2 rounded-full text-sm font-semibold ml-2">
                6mm 두께
              </Badge>
            </div>
          </div>

          {/* Product Info */}
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h3>
            <p className="text-xl text-gray-600 mb-6">{product.description}</p>

            {/* Features */}
            <div className="space-y-3 mb-8">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-emerald-600 rounded-full mr-3"></div>
                <span>논슬립 소재로 안전한 운동</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-emerald-600 rounded-full mr-3"></div>
                <span>6mm 두께로 관절 보호</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-emerald-600 rounded-full mr-3"></div>
                <span>공식 TAPMOVE 로고</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-emerald-600 rounded-full mr-3"></div>
                <span>친환경 소재 사용</span>
              </div>
            </div>

            {/* 가격 안내 카드 */}
            <div className="mb-8">
              <div className="flex items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">탭무브 상품 판매 안내</h3>
              </div>
              
              <div className="grid gap-4 mb-6">
                {/* 정상가 */}
                <Card className="border border-gray-200 hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold text-gray-900">정상가</h4>
                        <p className="text-sm text-gray-600">기본 가격</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-gray-600 line-through">22,500원</p>
                        <p className="text-sm text-gray-500">-</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 일반 판매가 */}
                <Card className="border border-emerald-200 bg-emerald-50 hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold text-emerald-800">일반 판매가</h4>
                        <p className="text-sm text-emerald-600">온라인 구매가</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-emerald-700">19,500원</p>
                        <Badge className="bg-emerald-100 text-emerald-800">13% 할인</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 세미나 회원가 */}
                <Card className="border-2 border-amber-300 bg-gradient-to-r from-amber-50 to-amber-100 hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold text-amber-800">세미나 회원가</h4>
                        <p className="text-sm text-amber-600">세미나 참석자 전용 특별 혜택</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-amber-700">17,500원</p>
                        <Badge className="bg-amber-200 text-amber-800">22.2% 할인</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 배송비 */}
                <Card className="border border-slate-200 bg-slate-50 hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold text-slate-800">배송비</h4>
                        <p className="text-sm text-slate-600">10개당 부과</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-slate-700">3,200원</p>
                        <p className="text-sm text-slate-500">-</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Price and Purchase */}
            <Card className="border-2 border-gray-200 mb-6">
              <CardContent className="p-6">
                {/* 대량구매 전용 안내 */}
                <div className="text-center mb-6">
                  <h4 className="text-lg font-bold text-amber-700 mb-2">대량구매 (세미나 참석자 전용)</h4>
                  <p className="text-sm text-gray-600">최소 10개부터 구매 가능합니다</p>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-semibold">개수</span>
                  <div className="flex items-center border border-gray-300 rounded-xl">
                    <Button
                      data-testid="button-decrease-quantity"
                      onClick={decreaseQuantity}
                      variant="ghost"
                      size="sm"
                      className="px-4 py-2 text-gray-600 hover:text-gray-800"
                      disabled={quantity <= 10}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span data-testid="text-quantity" className="px-4 py-2 border-x border-gray-300">
                      {quantity}
                    </span>
                    <Button
                      data-testid="button-increase-quantity"
                      onClick={increaseQuantity}
                      variant="ghost"
                      size="sm"
                      className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-lg font-semibold">총 상품 금액</span>
                  <span data-testid="text-total-price" className="text-2xl font-bold text-emerald-700">
                    {totalPrice.toLocaleString()}원
                  </span>
                </div>

                {/* Purchase Button */}
                <div className="space-y-3">
                  {!user ? (
                    <div className="text-center py-4">
                      <p className="text-gray-600 mb-2">제품을 구매하려면 로그인이 필요합니다</p>
                      <Button
                        data-testid="button-need-login"
                        onClick={() => window.location.href = "/login"}
                        variant="outline"
                        className="px-8 py-2 rounded-xl"
                      >
                        로그인하러 가기
                      </Button>
                    </div>
                  ) : (
                    <Button
                      data-testid="button-buy-now"
                      onClick={() => setShowVerificationModal(true)}
                      className="w-full bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black text-amber-100 py-4 text-lg font-semibold rounded-2xl transition-all duration-300"
                    >
                      바로 구매하기
                      <CreditCard className="ml-2 h-5 w-5" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Shipping Info */}
            <div className="text-sm text-gray-600 space-y-1">
              <p className="flex items-center">
                <Truck className="mr-2 h-4 w-4" />
                배송기간: 주문 후 2-3일
              </p>
              <p className="flex items-center">
                <Package className="mr-2 h-4 w-4" />
                배송비: 3,000원 (3만원 이상 무료)
              </p>
            </div>
          </div>
        </div>
      </div>

      <SeminarVerificationModal
        isOpen={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
        quantity={quantity}
        totalPrice={totalPrice}
      />
    </section>
  );
}
