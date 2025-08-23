import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Shield, Rocket, GraduationCap } from "lucide-react";

const features = [
  {
    id: 0,
    title: "안전한 운동",
    description: "스텝박스가 부담스러운 분들까지 안전하게 운동할 수 있는 혁신적인 솔루션입니다.",
    icon: Shield,
    gradient: "from-blue-500 to-blue-600",
    iconBg: "bg-white/20",
  },
  {
    id: 1,
    title: "새로운 카테고리",
    description: "단순 대안이 아닌, '높이'를 없앤 완전히 새로운 피트니스 카테고리를 만들었습니다.",
    icon: Rocket,
    gradient: "from-purple-500 to-purple-600",
    iconBg: "bg-white/20",
  },
  {
    id: 2,
    title: "즉시 적용",
    description: "세미나에서 배운 그대로, 수업에 바로 적용할 수 있는 실용적인 교육을 제공합니다.",
    icon: GraduationCap,
    gradient: "from-green-500 to-green-600",
    iconBg: "bg-white/20",
  },
];

export default function FeatureCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = features.length;

  useEffect(() => {
    const autoplayInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 2000);

    return () => clearInterval(autoplayInterval);
  }, [totalSlides]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">왜 TAPMOVE인가요?</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">탭무브의 핵심 장점을 확인해보세요</p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          <div className="overflow-hidden rounded-2xl">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {features.map((feature) => {
                const IconComponent = feature.icon;
                return (
                  <div key={feature.id} className="w-full flex-shrink-0">
                    <div
                      className={`bg-gradient-to-r ${feature.gradient} rounded-2xl p-8 md:p-12 text-white min-h-[400px] flex items-center`}
                    >
                      <div className="grid md:grid-cols-2 gap-8 items-center w-full">
                        <div>
                          <div className="text-6xl mb-6">
                            <IconComponent className="w-16 h-16" />
                          </div>
                          <h3 className="text-3xl font-bold mb-4">{feature.title}</h3>
                          <p className="text-xl leading-relaxed">{feature.description}</p>
                        </div>
                        <div className="text-center">
                          <div className={`${feature.iconBg} rounded-2xl p-8 backdrop-blur-sm`}>
                            <IconComponent className="w-20 h-20 text-white/80 mx-auto" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation Arrows */}
          <Button
            data-testid="button-prev-slide"
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg"
            size="sm"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            data-testid="button-next-slide"
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg"
            size="sm"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>

          {/* Pagination Dots */}
          <div className="flex justify-center mt-8 space-x-3">
            {features.map((_, index) => (
              <button
                key={index}
                data-testid={`dot-${index}`}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "bg-primary"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
