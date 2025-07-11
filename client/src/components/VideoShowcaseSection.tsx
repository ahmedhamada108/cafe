import { useLanguage } from "@/hooks/useLanguage";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

export function VideoShowcaseSection() {
  const { isRTL } = useLanguage();
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [showText, setShowText] = useState(false);

  // Fetch experience section data
  const { data: experienceSection } = useQuery({
    queryKey: ["/api/experience-section"],
  });

  const videos = [
    experienceSection?.video1Url || "/assets/rolls-royce-video.mp4",
    experienceSection?.video2Url || "/assets/g-class-video.mp4"
  ];

  const textMessages = [
    { 
      ar: experienceSection?.text1Ar || "سيارتك متميزة معانا", 
      en: experienceSection?.text1En || "YOUR CAR IS SPECIAL WITH US" 
    },
    { 
      ar: experienceSection?.text2Ar || "حماية فائقة للسيارات الفاخرة", 
      en: experienceSection?.text2En || "SUPERIOR PROTECTION FOR LUXURY CARS" 
    }
  ];

  // Simplified rotation logic using timeout sequence
  useEffect(() => {
    if (videos.length === 0) return;

    let timeout1: NodeJS.Timeout;
    let timeout2: NodeJS.Timeout;

    const startCycle = () => {
      // Phase 1: Show video (hide text)
      setShowText(false);
      
      // Phase 2: After 8 seconds, show text
      timeout1 = setTimeout(() => {
        setShowText(true);
        
        // Phase 3: After 3 more seconds, switch to next video and repeat
        timeout2 = setTimeout(() => {
          setCurrentVideoIndex(prev => (prev + 1) % videos.length);
          startCycle(); // Restart the cycle
        }, 3000);
      }, 8000);
    };

    startCycle();

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
    };
  }, [videos.length]);

  return (
    <section className="py-20 bg-gradient-to-b from-black via-gray-900 to-black">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className={`text-4xl md:text-5xl font-bold text-white mb-6 ${
            isRTL ? 'font-arabic' : ''
          }`}>
            {isRTL 
              ? (experienceSection?.titleAr || "تجربة الرفاهية الحقيقية")
              : (experienceSection?.titleEn || "EXPERIENCE TRUE LUXURY")
            }
          </h2>
          <p className={`text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed ${
            isRTL ? 'font-arabic' : ''
          }`}>
            {isRTL 
              ? (experienceSection?.descriptionAr || "اكتشف مستوى جديد من الحماية والأناقة مع خدماتنا المتخصصة للسيارات الفاخرة")
              : (experienceSection?.descriptionEn || "Discover a new level of protection and elegance with our specialized luxury vehicle services")
            }
          </p>
        </div>

        {/* Video Container */}
        <div className="relative max-w-6xl mx-auto">
          {/* Decorative frame */}
          <div className="absolute -inset-4 rounded-2xl blur-xl" style={{ background: 'linear-gradient(to right, hsla(30, 100%, 55%, 0.2), hsla(220, 91%, 58%, 0.2), hsla(30, 100%, 55%, 0.2))' }}></div>
          
          <div className="relative bg-black/50 rounded-xl overflow-hidden shadow-2xl">
            {/* Videos */}
            {videos.map((video, index) => (
              <video
                key={video}
                className={`w-full h-auto max-h-[70vh] object-cover transition-opacity duration-500 ${
                  index === currentVideoIndex && !showText ? 'opacity-100' : 'opacity-0'
                } ${index !== currentVideoIndex ? 'absolute inset-0' : ''}`}
                autoPlay
                muted
                loop
                playsInline
                controls={false}
              >
                <source src={video} type="video/mp4" />
                {isRTL 
                  ? "متصفحك لا يدعم تشغيل الفيديو"
                  : "Your browser does not support the video tag."
                }
              </video>
            ))}

            {/* Text Transition */}
            <div className={`absolute inset-0 bg-black flex items-center justify-center transition-opacity duration-500 ${
              showText ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}>
              <div className="text-center px-8">
                <h3 className={`text-4xl md:text-6xl font-bold text-white mb-4 ${
                  isRTL ? 'font-arabic' : ''
                } animate-pulse`}>
                  {isRTL ? textMessages[currentVideoIndex]?.ar : textMessages[currentVideoIndex]?.en}
                </h3>
                
                {/* Decorative elements */}
                <div className="flex justify-center items-center space-x-4 rtl:space-x-reverse">
                  <div className="w-12 h-0.5" style={{ background: 'linear-gradient(to right, transparent, hsl(30, 100%, 55%))' }}></div>
                  <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: 'hsl(30, 100%, 55%)' }}></div>
                  <div className="w-12 h-0.5" style={{ background: 'linear-gradient(to left, transparent, #3B82F6)' }}></div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className={`inline-flex flex-col sm:flex-row gap-4 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
            <button 
              style={{ background: 'linear-gradient(to right, hsl(30, 100%, 55%), hsl(30, 100%, 50%))' }}
              className="px-8 py-4 text-white font-semibold rounded-lg hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {isRTL ? "احجز موعدك الآن" : "Book Your Appointment"}
            </button>
            <button className="px-8 py-4 border-2 border-blue-500 text-blue-400 font-semibold rounded-lg hover:bg-blue-500 hover:text-white transition-all duration-300">
              {isRTL ? "استكشف خدماتنا" : "Explore Our Services"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}