import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus, ShoppingCart, CreditCard, Users, Truck, Package } from "lucide-react";
import BulkPurchaseModal from "./modals/BulkPurchaseModal";
import type { Product } from "@shared/schema";

export default function ProductSection() {
  const [quantity, setQuantity] = useState(1);
  const [showBulkModal, setShowBulkModal] = useState(false);

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const product = products[0]; // Get first product
  const unitPrice = product?.price || 19500;
  const totalPrice = unitPrice * quantity;

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () => setQuantity((prev) => Math.max(1, prev - 1));

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

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Product Image */}
          <div className="text-center">
            <img
              src={product.imageUrl || "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=600"}
              alt="TAPMOVE 공식 매트"
              className="rounded-2xl shadow-lg w-full max-w-md mx-auto"
            />
            <div className="mt-6">
              <Badge className="bg-primary text-white px-4 py-2 rounded-full text-sm font-semibold">
                공식 정품
              </Badge>
              <Badge className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold ml-2">
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
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span>논슬립 소재로 안전한 운동</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span>6mm 두께로 관절 보호</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span>공식 TAPMOVE 로고</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span>친환경 소재 사용</span>
              </div>
            </div>

            {/* Price and Purchase */}
            <Card className="border-2 border-gray-200 mb-6">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-semibold">개수</span>
                  <div className="flex items-center border border-gray-300 rounded-xl">
                    <Button
                      data-testid="button-decrease-quantity"
                      onClick={decreaseQuantity}
                      variant="ghost"
                      size="sm"
                      className="px-4 py-2 text-gray-600 hover:text-gray-800"
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
                  <span data-testid="text-total-price" className="text-2xl font-bold text-primary">
                    {totalPrice.toLocaleString()}원
                  </span>
                </div>

                {/* Purchase Buttons */}
                <div className="space-y-3">
                  <Button
                    data-testid="button-add-to-cart"
                    className="w-full py-4 text-lg font-semibold rounded-2xl"
                  >
                    장바구니에 담기
                    <ShoppingCart className="ml-2 h-5 w-5" />
                  </Button>
                  <Button
                    data-testid="button-buy-now"
                    variant="secondary"
                    className="w-full bg-gray-900 hover:bg-gray-800 text-white py-4 text-lg font-semibold rounded-2xl"
                  >
                    바로 구매하기
                    <CreditCard className="ml-2 h-5 w-5" />
                  </Button>
                  <Button
                    data-testid="button-bulk-purchase"
                    onClick={() => setShowBulkModal(true)}
                    variant="outline"
                    className="w-full border-2 border-primary text-primary hover:bg-primary hover:text-white py-4 text-lg font-semibold rounded-2xl"
                  >
                    대량구매 (수료자 전용)
                    <Users className="ml-2 h-5 w-5" />
                  </Button>
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

      <BulkPurchaseModal
        isOpen={showBulkModal}
        onClose={() => setShowBulkModal(false)}
        unitPrice={unitPrice}
      />
    </section>
  );
}
