import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Pen, User, ChevronDown } from "lucide-react";
import ReviewPasscodeModal from "./modals/ReviewPasscodeModal";
import type { Review } from "@shared/schema";

export default function ReviewsSection() {
  const [showPasscodeModal, setShowPasscodeModal] = useState(false);
  const [visibleReviews, setVisibleReviews] = useState(6);

  const { data: reviews = [], isLoading } = useQuery<Review[]>({
    queryKey: ["/api/reviews"],
  });

  const loadMore = () => {
    setVisibleReviews((prev) => prev + 6);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? "text-yellow-400" : "text-gray-300"}>
        ★
      </span>
    ));
  };

  const formatDate = (dateStr: string | Date) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("ko-KR", {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <section id="reviews" className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">후기</h2>
          <p className="text-xl text-gray-600">세미나 참석자들의 생생한 후기를 확인해보세요</p>
        </div>

        {/* Write Review Button */}
        <div className="text-center mb-12">
          <Button
            data-testid="button-write-review"
            onClick={() => setShowPasscodeModal(true)}
            className="bg-primary hover:bg-blue-700 text-white px-8 py-3 rounded-2xl text-lg font-semibold transition-all duration-300 shadow-lg"
          >
            후기 작성하기
            <Pen className="ml-2 h-5 w-5" />
          </Button>
        </div>

        {/* Reviews Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }, (_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                    <div className="ml-3">
                      <div className="h-4 bg-gray-300 rounded w-20 mb-2"></div>
                      <div className="h-3 bg-gray-300 rounded w-16"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-300 rounded"></div>
                    <div className="h-4 bg-gray-300 rounded"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.slice(0, visibleReviews).map((review) => (
              <Card key={review.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Avatar className="w-12 h-12 bg-gray-300">
                      <AvatarFallback>
                        <User className="h-6 w-6 text-gray-600" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="ml-3">
                      <h4 className="font-semibold text-gray-900">{review.authorName}</h4>
                      <p className="text-sm text-gray-600">{formatDate(review.createdAt)}</p>
                    </div>
                    <div className="ml-auto flex">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  <p
                    data-testid={`review-body-${review.id}`}
                    className="text-gray-700 leading-relaxed line-clamp-4"
                  >
                    {review.reviewBody}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {reviews.length === 0 && !isLoading && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-xl">아직 등록된 후기가 없습니다.</p>
            <p className="mt-2">첫 번째 후기를 작성해보세요!</p>
          </div>
        )}

        {/* Load More Button */}
        {reviews.length > visibleReviews && (
          <div className="text-center mt-12">
            <Button
              data-testid="button-load-more"
              onClick={loadMore}
              variant="outline"
              className="px-8 py-3 rounded-2xl font-semibold"
            >
              더보기
              <ChevronDown className="ml-2 h-5 w-5" />
            </Button>
          </div>
        )}
      </div>

      <ReviewPasscodeModal
        isOpen={showPasscodeModal}
        onClose={() => setShowPasscodeModal(false)}
      />
    </section>
  );
}
