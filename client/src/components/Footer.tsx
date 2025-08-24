import { MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-6">운동하는코끼리</h3>
          <div className="space-y-3 text-gray-300">
            <p className="flex items-center justify-center">
              <MapPin className="mr-2 h-4 w-4" />
              대구시 북구 침산남로 172 3층
            </p>
            <p className="flex items-center justify-center">
              <Phone className="mr-2 h-4 w-4" />
              0507-1403-3006
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
