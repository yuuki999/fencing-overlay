import { FencingOverlay } from "@/components/fencing/FencingOverlay";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <div className="min-h-screen p-4 pb-12 bg-gray-50 dark:bg-gray-900">
      <FencingOverlay />
      <Footer />
    </div>
  );
}
