import { ArrowRight } from "lucide-react";
import { CategoryCard } from "@/components/CategoryCard";
import { KuwaitiHeroSection } from "@/components/KuwaitiHeroSection";
import { CarBrandSlider } from "@/components/CarBrandSlider";
import { VideoShowcaseSection } from "@/components/VideoShowcaseSection";
import { ReviewsSection } from "@/components/ReviewsSection";
import { Footer } from "@/components/Footer";
import { SEO, getOrganizationSchema, getBreadcrumbSchema } from "@/components/SEO";
import { useLanguage } from "@/hooks/useLanguage";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";

interface Category {
  id: number;
  nameEn: string;
  nameAr: string;
  descriptionEn: string;
  descriptionAr: string;
  slug: string;
  image: string;
  isActive: boolean;
}

export default function Home() {
  const { t, isRTL } = useLanguage();
  const [, setLocation] = useLocation();
  
  const breadcrumbItems = [
    { name: t("home"), url: "/" }
  ];

  // Fetch categories from database API
  const { data: categoriesResponse, isLoading } = useQuery<{ categories: Category[] }>({
    queryKey: ["/api/categories"],
  });

  // Fetch products to get category counts
  const { data: productsResponse } = useQuery<{ products: any[] }>({
    queryKey: ["/api/products"],
  });

  const categories = categoriesResponse?.categories || [];
  const activeCategories = categories.filter((cat: Category) => cat.isActive);
  const products = productsResponse?.products || [];

  // Calculate product count for each category
  const getCategoryProductCount = (categoryId: number) => {
    return products.filter(product => product.categoryId === categoryId && product.isActive).length;
  };

  const handleCategoryClick = (category: Category) => {
    setLocation(`/menu?category=${category.slug}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 theme-transition">
      <SEO 
        title={isRTL ? "الرئيسية" : "Home"}
        description={isRTL 
          ? "مرحباً بكم في أكشن بروتكشن - خدمات حماية مركبات متقدمة مع العزل الحراري وحماية الطلاء والتلميع الاحترافي. اكتشف خدماتنا الشاملة لحماية وعناية مركبتك."
          : "Welcome to Action Protection - Advanced vehicle protection services with thermal insulation, paint protection, and professional polishing. Discover our comprehensive services for vehicle protection and care."
        }
        keywords={isRTL
          ? "أكشن بروتكشن, حماية مركبات, عزل حراري, حماية طلاء, تلميع سيارات, طلاء سيراميكي, تنظيف سيارات, حماية داخلية"
          : "Action Protection, vehicle protection, thermal insulation, paint protection, car polishing, ceramic coating, car cleaning, interior protection"
        }
        url="/"
        type="website"
        structuredData={{
          ...getOrganizationSchema(isRTL),
          ...getBreadcrumbSchema(breadcrumbItems)
        }}
      />
      {/* Kuwaiti Hero Section */}
      <KuwaitiHeroSection />

      {/* Categories Section */}
      <section className="py-16 bg-white dark:bg-gray-900 theme-transition relative overflow-hidden">
        {/* Animated smoke background */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Base smoke gradients */}
          <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-b from-gray-200/30 via-gray-300/10 to-transparent dark:from-gray-700/20 dark:via-gray-600/5 dark:to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-gray-200/30 via-gray-300/10 to-transparent dark:from-gray-700/20 dark:via-gray-600/5 dark:to-transparent"></div>
          
          {/* Animated smoke wisps */}
          <div className="absolute top-1/4 left-1/4 w-96 h-64 bg-gradient-to-br from-gray-300/20 via-gray-200/10 to-transparent dark:from-gray-600/15 dark:via-gray-500/8 dark:to-transparent rounded-full blur-3xl animate-pulse opacity-60"
               style={{ animationDelay: '0s', animationDuration: '8s' }}></div>
          <div className="absolute top-1/3 right-1/4 w-80 h-48 bg-gradient-to-bl from-gray-400/15 via-gray-300/8 to-transparent dark:from-gray-500/12 dark:via-gray-400/6 dark:to-transparent rounded-full blur-2xl animate-pulse opacity-70"
               style={{ animationDelay: '3s', animationDuration: '10s' }}></div>
          <div className="absolute bottom-1/3 left-1/3 w-72 h-56 bg-gradient-to-tr from-gray-300/18 via-gray-200/9 to-transparent dark:from-gray-600/13 dark:via-gray-500/7 dark:to-transparent rounded-full blur-3xl animate-pulse opacity-50"
               style={{ animationDelay: '6s', animationDuration: '12s' }}></div>
          <div className="absolute top-1/2 right-1/3 w-64 h-40 bg-gradient-to-tl from-gray-200/16 via-gray-100/8 to-transparent dark:from-gray-700/11 dark:via-gray-600/5 dark:to-transparent rounded-full blur-2xl animate-pulse opacity-60"
               style={{ animationDelay: '9s', animationDuration: '7s' }}></div>
          
          {/* Floating particles */}
          <div className="absolute top-1/6 left-1/6 w-4 h-4 bg-gray-400/30 dark:bg-gray-500/20 rounded-full blur-sm animate-bounce opacity-40"
               style={{ animationDelay: '1s', animationDuration: '5s' }}></div>
          <div className="absolute top-2/3 right-1/5 w-3 h-3 bg-gray-300/25 dark:bg-gray-600/15 rounded-full blur-sm animate-bounce opacity-50"
               style={{ animationDelay: '4s', animationDuration: '6s' }}></div>
          <div className="absolute bottom-1/4 left-2/3 w-5 h-5 bg-gray-200/20 dark:bg-gray-700/12 rounded-full blur-sm animate-bounce opacity-35"
               style={{ animationDelay: '7s', animationDuration: '8s' }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              {t("ourCategories")}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("categoriesSubtitle")}
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activeCategories.map((category: Category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  productCount={getCategoryProductCount(category.id)}
                  onClick={() => handleCategoryClick(category)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Car Brand Slider */}
      <CarBrandSlider />

      {/* Video Showcase Section */}
      <VideoShowcaseSection />

      {/* Customer Reviews */}
      <ReviewsSection />

      <Footer />
    </div>
  );
}

function SocialIcon({ href, icon }: { href: string; icon: string }) {
  const iconMap = {
    facebook: "👥",
    instagram: "📸", 
    twitter: "🐦"
  };
  
  return (
    <a
      href={href}
      className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors"
    >
      <span className="text-lg">{iconMap[icon as keyof typeof iconMap]}</span>
    </a>
  );
}

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <li>
      <a
        href={href}
        className="text-gray-400 hover:text-white transition-colors"
      >
        {label}
      </a>
    </li>
  );
}

function ContactItem({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex items-center space-x-3 rtl:space-x-reverse">
      <span className="text-primary-400">{icon}</span>
      <span className="text-gray-400">{text}</span>
    </div>
  );
}
