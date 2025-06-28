import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { Footer } from "@/components/Footer";
import { SEO, getBreadcrumbSchema } from "@/components/SEO";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Phone, Mail, Clock, Send, MessageCircle, Loader2 } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";

interface ContactUs {
  id: number;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  addressAr: string;
  workingHours: string;
  workingHoursAr: string;
  socialMediaLinks: {
    instagram?: string;
    twitter?: string;
    facebook?: string;
    snapchat?: string;
    linkedin?: string;
    youtube?: string;
    tiktok?: string;
  };
  googleMapsUrl?: string;
  isActive: boolean;
}

export default function Contact() {
  const { t, isRTL } = useLanguage();
  const { toast } = useToast();

  const { data: contactData, isLoading } = useQuery<ContactUs>({
    queryKey: ["/api/contact"],
  });

  // Debug logging to check what data we're receiving
  console.log("Contact Data:", contactData);
  
  const breadcrumbItems = [
    { name: t("home"), url: "/" },
    { name: t("contact"), url: "/contact" }
  ];
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const submitMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to send message");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: isRTL ? "تم الإرسال بنجاح" : "Message Sent Successfully",
        description: isRTL 
          ? "شكراً لك! سنتواصل معك قريباً." 
          : "Thank you! We'll get back to you soon.",
      });
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
    },
    onError: () => {
      toast({
        title: isRTL ? "خطأ في إرسال الرسالة" : "Failed to Send Message",
        description: isRTL 
          ? "حدث خطأ. يرجى المحاولة مرة أخرى." 
          : "An error occurred. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    submitMutation.mutate(formData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };



  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 theme-transition">
      <SEO 
        title={isRTL ? "اتصل بنا" : "Contact Us"}
        description={isRTL 
          ? "تواصل مع أكشن بروتكشن - نحن هنا لحماية مركبتك. احجز موعدك لخدمات العزل الحراري والطلاء الواقي والتلميع المتقدم. مفتوح من الأحد للخميس."
          : "Contact Action Protection - We're here to protect your vehicle. Book your appointment for thermal insulation, protective coating, and advanced polishing services. Open Sunday to Thursday."
        }
        keywords={isRTL
          ? "اتصل بنا, أكشن بروتكشن, حماية السيارات, العزل الحراري, موعد, خدمات السيارات"
          : "contact us, Action Protection, car protection, thermal insulation, appointment, vehicle services"
        }
        url="/contact"
        type="website"
        structuredData={getBreadcrumbSchema(breadcrumbItems)}
      />
      <AnimatedBackground />
      {/* Hero Section */}
      <section className="relative h-64 gradient-hero overflow-hidden">
        <div className="absolute inset-0 bg-black/50"></div>
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1563720223185-11003d516935?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=600')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {isRTL ? "اتصل بنا" : "Contact Us"}
            </h1>
            <p className="text-xl text-gray-200 max-w-2xl">
              {isRTL 
                ? "نحن هنا للمساعدة! تواصل معنا لأي استفسارات أو تعليقات" 
                : "We're here to help! Reach out to us for any questions or feedback"
              }
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-white dark:bg-gray-900 theme-transition">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-1">
              <h2 className="text-2xl font-bold text-foreground mb-8">
                {isRTL ? "معلومات التواصل" : "Get in Touch"}
              </h2>
              
              <div className="space-y-6">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="flex items-start space-x-4 rtl:space-x-reverse">
                      <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-lg animate-pulse"></div>
                      <div className="flex-1">
                        <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-1/3 mb-2 animate-pulse"></div>
                        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-2/3 animate-pulse"></div>
                      </div>
                    </div>
                  ))
                ) : contactData ? (
                  [
                    {
                      icon: MapPin,
                      titleEn: "Address",
                      titleAr: "العنوان",
                      valueEn: contactData.address,
                      valueAr: contactData.addressAr,
                    },
                    {
                      icon: Phone,
                      titleEn: "Phone",
                      titleAr: "الهاتف",
                      valueEn: contactData.phone,
                      valueAr: contactData.phone,
                    },
                    {
                      icon: MessageCircle,
                      titleEn: "WhatsApp",
                      titleAr: "واتساب",
                      valueEn: contactData.whatsapp,
                      valueAr: contactData.whatsapp,
                    },
                    {
                      icon: Mail,
                      titleEn: "Email",
                      titleAr: "البريد الإلكتروني",
                      valueEn: contactData.email,
                      valueAr: contactData.email,
                    },
                    {
                      icon: Clock,
                      titleEn: "Hours",
                      titleAr: "ساعات العمل",
                      valueEn: contactData.workingHours,
                      valueAr: contactData.workingHoursAr,
                    },
                  ].map((info, index) => (
                    <div key={index} className="flex items-start space-x-4 rtl:space-x-reverse">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <info.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">
                          {isRTL ? info.titleAr : info.titleEn}
                        </h3>
                        <p className="text-muted-foreground">
                          {isRTL ? info.valueAr : info.valueEn}
                        </p>
                      </div>
                    </div>
                  ))
                ) : null}
              </div>

              {/* Quick Call Buttons */}
              <div className="mt-8 space-y-4">
                <h3 className="font-semibold text-foreground mb-4">
                  {isRTL ? "اتصل بنا مباشرة" : "Call Us Directly"}
                </h3>
                
                <div className="space-y-3">
                  {isLoading ? (
                    <>
                      <div className="h-12 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
                      <div className="h-12 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
                    </>
                  ) : contactData ? (
                    <>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start gap-3"
                        onClick={() => window.open(`tel:${contactData.phone}`)}
                      >
                        <Phone className="h-4 w-4" />
                        {isRTL ? "اتصال عادي" : "Regular Call"}
                        <span className="ml-auto text-muted-foreground">{contactData.phone}</span>
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="w-full justify-start gap-3"
                        onClick={() => {
                          const whatsappNumber = contactData.whatsapp?.replace(/[^\d]/g, '');
                          window.open(`https://wa.me/${whatsappNumber}`);
                        }}
                      >
                        <span className="text-green-500">📱</span>
                        {isRTL ? "واتساب" : "WhatsApp"}
                        <span className="ml-auto text-muted-foreground">{contactData.whatsapp}</span>
                      </Button>
                    </>
                  ) : null}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">
                    {isRTL ? "أرسل لنا رسالة" : "Send Us a Message"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">
                          {isRTL ? "الاسم" : "Name"} *
                        </Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleChange("name", e.target.value)}
                          required
                          placeholder={isRTL ? "اسمك الكامل" : "Your full name"}
                          className={isRTL ? "text-right" : ""}
                          dir={isRTL ? "rtl" : "ltr"}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone">
                          {isRTL ? "رقم الهاتف" : "Phone Number"}
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleChange("phone", e.target.value)}
                          placeholder={isRTL ? "رقم هاتفك" : "Your phone number"}
                          className={isRTL ? "text-right" : ""}
                          dir={isRTL ? "rtl" : "ltr"}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">
                        {isRTL ? "البريد الإلكتروني" : "Email"} *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        required
                        placeholder={isRTL ? "بريدك الإلكتروني" : "Your email address"}
                        className={isRTL ? "text-right" : ""}
                        dir={isRTL ? "rtl" : "ltr"}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">
                        {isRTL ? "الرسالة" : "Message"} *
                      </Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => handleChange("message", e.target.value)}
                        required
                        rows={5}
                        placeholder={isRTL 
                          ? "اكتب رسالتك هنا..."
                          : "Write your message here..."
                        }
                        className={isRTL ? "text-right" : ""}
                        dir={isRTL ? "rtl" : "ltr"}
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full gap-2" 
                      disabled={submitMutation.isPending}
                    >
                      {submitMutation?.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          {isRTL ? "جاري الإرسال..." : "Sending..."}
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          {isRTL ? "إرسال الرسالة" : "Send Message"}
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Map Section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-foreground text-center mb-8">
              {isRTL ? "موقعنا" : "Find Us"}
            </h2>
            
            <div 
              className={`bg-gray-200 dark:bg-gray-800 rounded-lg h-64 flex items-center justify-center ${contactData?.googleMapsUrl ? 'cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors' : ''}`}
              onClick={() => {
                if (contactData?.googleMapsUrl) {
                  window.open(contactData.googleMapsUrl, '_blank', 'noopener,noreferrer');
                }
              }}
            >
              {isLoading ? (
                <div className="text-center">
                  <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded mx-auto mb-4 animate-pulse"></div>
                  <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-32 mx-auto mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-48 mx-auto animate-pulse"></div>
                </div>
              ) : contactData ? (
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {isRTL ? "موقعنا" : "Our Location"}
                  </h3>
                  <p className="text-muted-foreground mb-2">
                    {isRTL ? contactData.addressAr : contactData.address}
                  </p>
                  {contactData.googleMapsUrl && (
                    <p className="text-sm text-primary">
                      {isRTL ? "انقر لفتح في خرائط جوجل" : "Click to open in Google Maps"}
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center text-muted-foreground">
                  {isRTL ? "لا توجد معلومات الموقع متاحة" : "No location information available"}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}