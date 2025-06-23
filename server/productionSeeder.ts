import { db } from "./db";
import { 
  users, categories, products, aboutUs, contactUs, footerContent, 
  widgetSettings, privacyPolicy, termsOfService, smtpSettings 
} from "@shared/schema";
import bcrypt from "bcryptjs";

export async function seedProductionData() {
  try {
    console.log("🌱 Starting production data seeding...");

    // Seed Categories
    console.log("📂 Seeding categories...");
    const categoriesData = [
      {
        id: 1,
        nameEn: "Coffee & Espresso",
        nameAr: "القهوة والإسبريسو",
        descriptionEn: "Premium coffee blends and specialty drinks",
        descriptionAr: "خلطات قهوة فاخرة ومشروبات مميزة",
        slug: "coffee",
        image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        isActive: true,
        sortOrder: 1
      },
      {
        id: 2,
        nameEn: "Hot Beverages",
        nameAr: "المشروبات الساخنة",
        descriptionEn: "Warm and comforting drinks for cozy moments",
        descriptionAr: "مشروبات دافئة ومريحة للحظات الدافئة",
        slug: "hot-drinks",
        image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        isActive: true,
        sortOrder: 3
      },
      {
        id: 3,
        nameEn: "Cold Beverages",
        nameAr: "المشروبات الباردة",
        descriptionEn: "Refreshing cold drinks to beat the heat",
        descriptionAr: "مشروبات باردة منعشة لمقاومة الحر",
        slug: "cold-drinks",
        image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        isActive: true,
        sortOrder: 5
      },
      {
        id: 4,
        nameEn: "Breakfast",
        nameAr: "الإفطار",
        descriptionEn: "Fresh and healthy breakfast options",
        descriptionAr: "خيارات إفطار طازجة وصحية",
        slug: "breakfast",
        image: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        isActive: true,
        sortOrder: 2
      },
      {
        id: 5,
        nameEn: "Main Dishes",
        nameAr: "الأطباق الرئيسية",
        descriptionEn: "Hearty meals and savory delights",
        descriptionAr: "وجبات شهية ولذائذ مالحة",
        slug: "main-dishes",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        isActive: true,
        sortOrder: 6
      },
      {
        id: 6,
        nameEn: "Desserts",
        nameAr: "الحلويات",
        descriptionEn: "Sweet treats and indulgent desserts",
        descriptionAr: "حلويات حلوة ولذائذ منغمسة",
        slug: "desserts",
        image: "/uploads/image-1750619962137-575065094.png",
        isActive: true,
        sortOrder: 7
      }
    ];

    await db.insert(categories).values(categoriesData).onConflictDoNothing();

    // Seed Products
    console.log("🍽️ Seeding products...");
    const productsData = [
      // Coffee & Espresso
      {
        id: 1,
        nameEn: "Espresso",
        nameAr: "إسبريسو",
        descriptionEn: "Rich and bold espresso shot with perfect crema",
        descriptionAr: "جرعة إسبريسو غنية وجريئة مع كريما مثالية",
        price: "15.00",
        categoryId: 1,
        image: "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        stock: 100,
        isActive: true,
        isFeatured: true,
        isAvailable: true,
        sortOrder: 1
      },
      {
        id: 2,
        nameEn: "Cappuccino",
        nameAr: "كابتشينو",
        descriptionEn: "Classic Italian coffee with steamed milk and foam",
        descriptionAr: "قهوة إيطالية كلاسيكية مع حليب مبخر ورغوة",
        price: "22.00",
        categoryId: 1,
        image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        stock: 100,
        isActive: true,
        isFeatured: false,
        isAvailable: true,
        sortOrder: 4
      },
      {
        id: 3,
        nameEn: "Latte",
        nameAr: "لاتيه",
        descriptionEn: "Smooth espresso with steamed milk and light foam",
        descriptionAr: "إسبريسو ناعم مع حليب مبخر ورغوة خفيفة",
        price: "25.00",
        categoryId: 1,
        image: "https://images.unsplash.com/photo-1561882468-9110e03e0f78?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        stock: 100,
        isActive: true,
        isFeatured: true,
        isAvailable: true,
        sortOrder: 2
      },
      {
        id: 4,
        nameEn: "Turkish Coffee",
        nameAr: "قهوة تركية",
        descriptionEn: "Traditional Turkish coffee served with authentic preparation",
        descriptionAr: "قهوة تركية تقليدية تُقدم بالتحضير الأصيل",
        price: "20.00",
        categoryId: 1,
        image: "https://images.unsplash.com/photo-1497636577773-f1231844b336?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        stock: 50,
        isActive: true,
        isFeatured: true,
        isAvailable: true,
        sortOrder: 3
      },
      {
        id: 5,
        nameEn: "Arabic Coffee",
        nameAr: "قهوة عربية",
        descriptionEn: "Traditional Arabic coffee with cardamom and dates",
        descriptionAr: "قهوة عربية تقليدية مع الهيل والتمر",
        price: "18.00",
        categoryId: 1,
        image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        stock: 50,
        isActive: true,
        isFeatured: true,
        isAvailable: true,
        sortOrder: 5
      },
      
      // Hot Beverages
      {
        id: 6,
        nameEn: "Green Tea",
        nameAr: "شاي أخضر",
        descriptionEn: "Premium organic green tea with antioxidants",
        descriptionAr: "شاي أخضر عضوي فاخر مع مضادات الأكسدة",
        price: "18.00",
        categoryId: 2,
        image: "https://images.unsplash.com/photo-1556881286-fc6915169721?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        stock: 75,
        isActive: true,
        isFeatured: false,
        isAvailable: true,
        sortOrder: 8
      },
      {
        id: 7,
        nameEn: "Earl Grey",
        nameAr: "إيرل جراي",
        descriptionEn: "Classic black tea with bergamot oil",
        descriptionAr: "شاي أسود كلاسيكي مع زيت البرغموت",
        price: "20.00",
        categoryId: 2,
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        stock: 60,
        isActive: true,
        isFeatured: false,
        isAvailable: true,
        sortOrder: 6
      },
      {
        id: 8,
        nameEn: "Moroccan Mint Tea",
        nameAr: "شاي النعناع المغربي",
        descriptionEn: "Refreshing mint tea with traditional Moroccan preparation",
        descriptionAr: "شاي النعناع المنعش بالتحضير المغربي التقليدي",
        price: "22.00",
        categoryId: 2,
        image: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        stock: 40,
        isActive: true,
        isFeatured: true,
        isAvailable: true,
        sortOrder: 7
      },
      {
        id: 9,
        nameEn: "Hot Chocolate",
        nameAr: "شوكولاتة ساخنة",
        descriptionEn: "Rich hot chocolate with whipped cream and marshmallows",
        descriptionAr: "شوكولاتة ساخنة غنية مع كريمة مخفوقة ومارشميلو",
        price: "25.00",
        categoryId: 2,
        image: "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        stock: 80,
        isActive: true,
        isFeatured: false,
        isAvailable: true,
        sortOrder: 10
      },

      // Cold Beverages
      {
        id: 10,
        nameEn: "Iced Americano",
        nameAr: "أمريكانو مثلج",
        descriptionEn: "Refreshing iced coffee with bold espresso flavor",
        descriptionAr: "قهوة مثلجة منعشة بنكهة إسبريسو جريئة",
        price: "20.00",
        categoryId: 3,
        image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        stock: 90,
        isActive: true,
        isFeatured: true,
        isAvailable: true,
        sortOrder: 9
      },
      {
        id: 11,
        nameEn: "Iced Latte",
        nameAr: "لاتيه مثلج",
        descriptionEn: "Cold espresso with chilled milk over ice",
        descriptionAr: "إسبريسو بارد مع حليب مبرد على الثلج",
        price: "25.00",
        categoryId: 3,
        image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        stock: 85,
        isActive: true,
        isFeatured: false,
        isAvailable: true,
        sortOrder: 11
      },
      {
        id: 13,
        nameEn: "Iced Tea",
        nameAr: "شاي مثلج",
        descriptionEn: "Refreshing iced tea with lemon and mint",
        descriptionAr: "شاي مثلج منعش مع الليمون والنعناع",
        price: "15.00",
        categoryId: 3,
        image: "/uploads/image-1750619979661-922502826.avif",
        stock: 70,
        isActive: true,
        isFeatured: false,
        isAvailable: true,
        sortOrder: 15
      },

      // Breakfast
      {
        id: 14,
        nameEn: "Avocado Toast",
        nameAr: "توست الأفوكادو",
        descriptionEn: "Fresh avocado on toasted artisan bread with herbs",
        descriptionAr: "أفوكادو طازج على خبز حرفي محمص مع الأعشاب",
        price: "28.00",
        categoryId: 4,
        image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        stock: 30,
        isActive: true,
        isFeatured: true,
        isAvailable: true,
        sortOrder: 14
      },
      {
        id: 15,
        nameEn: "Croissant",
        nameAr: "كرواسون",
        descriptionEn: "Buttery, flaky French pastry baked fresh daily",
        descriptionAr: "معجنات فرنسية مقرمشة بالزبدة مخبوزة طازجة يومياً",
        price: "15.00",
        categoryId: 4,
        image: "https://images.unsplash.com/photo-1549903072-7e6e0bedb7fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        stock: 25,
        isActive: true,
        isFeatured: false,
        isAvailable: true,
        sortOrder: 13
      },

      // Main Dishes
      {
        id: 16,
        nameEn: "Grilled Chicken Sandwich",
        nameAr: "ساندويتش دجاج مشوي",
        descriptionEn: "Tender grilled chicken with fresh vegetables",
        descriptionAr: "دجاج مشوي طري مع خضروات طازجة",
        price: "45.00",
        categoryId: 5,
        image: "/uploads/image-1750619498223-468154478.png",
        stock: 20,
        isActive: true,
        isFeatured: true,
        isAvailable: true,
        sortOrder: 17
      },
      {
        id: 17,
        nameEn: "Caesar Salad",
        nameAr: "سلطة قيصر",
        descriptionEn: "Crisp romaine lettuce with parmesan and croutons",
        descriptionAr: "خس روماني مقرمش مع البارميزان والخبز المحمص",
        price: "35.00",
        categoryId: 5,
        image: "/uploads/image-1750619698116-866726810.png",
        stock: 25,
        isActive: true,
        isFeatured: false,
        isAvailable: true,
        sortOrder: 16
      },

      // Desserts
      {
        id: 18,
        nameEn: "Chocolate Cake",
        nameAr: "كعكة الشوكولاتة",
        descriptionEn: "Rich dark chocolate cake with smooth ganache",
        descriptionAr: "كعكة شوكولاتة داكنة غنية مع جاناش ناعم",
        price: "25.00",
        categoryId: 6,
        image: "/uploads/image-1750619092534-536966498.png",
        stock: 15,
        isActive: true,
        isFeatured: true,
        isAvailable: true,
        sortOrder: 18
      },
      {
        id: 19,
        nameEn: "Tiramisu",
        nameAr: "تيراميسو",
        descriptionEn: "Classic Italian dessert with coffee and mascarpone",
        descriptionAr: "حلوى إيطالية كلاسيكية مع القهوة والماسكاربوني",
        price: "30.00",
        categoryId: 6,
        image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        stock: 12,
        isActive: true,
        isFeatured: false,
        isAvailable: true,
        sortOrder: 20
      }
    ];

    await db.insert(products).values(productsData).onConflictDoNothing();

    // Seed Admin User
    console.log("👤 Seeding admin user...");
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await db.insert(users).values({
      id: "admin_seed_production",
      username: "admin",
      email: "admin@latelounge.sa",
      password: hashedPassword,
      firstName: "System",
      lastName: "Administrator", 
      role: "administrator",
      isActive: true
    }).onConflictDoNothing();

    // Seed About Us
    console.log("ℹ️ Seeding about us...");
    await db.insert(aboutUs).values({
      id: 1,
      titleEn: "About LateLounge",
      titleAr: "حول ليت لاونج",
      contentEn: `Welcome to LateLounge, where exceptional coffee meets warm hospitality. Our passion for quality drives everything we do, from sourcing the finest beans to creating memorable experiences for every guest.

Founded with a vision to bring authentic coffeehouse culture to our community, we take pride in our artisanal approach to coffee preparation and our commitment to excellence.

Our skilled baristas craft each cup with precision and care, ensuring that every sip delivers the perfect balance of flavor and aroma. Whether you're seeking a quiet moment of reflection or a vibrant space to connect with friends, LateLounge offers the ideal atmosphere.

We believe in supporting local communities and sustainable practices, which is why we carefully select our suppliers and ingredients. Our menu features a diverse selection of specialty drinks, fresh pastries, and wholesome meals prepared with the finest ingredients.

Join us for an unforgettable culinary journey where tradition meets innovation, and every visit becomes a cherished memory.`,
      contentAr: `مرحباً بكم في ليت لاونج، حيث تلتقي القهوة الاستثنائية بالضيافة الدافئة. شغفنا بالجودة يقود كل ما نقوم به، من مصادر أجود حبوب القهوة إلى خلق تجارب لا تُنسى لكل ضيف.

تأسسنا برؤية لجلب ثقافة المقاهي الأصيلة إلى مجتمعنا، ونفخر بنهجنا الحرفي في تحضير القهوة والتزامنا بالتميز.

يحضر باريستا ماهرون كل كوب بدقة وعناية، مما يضمن أن كل رشفة تقدم التوازن المثالي للنكهة والرائحة. سواء كنتم تبحثون عن لحظة هدوء للتأمل أو مساحة نابضة بالحياة للتواصل مع الأصدقاء، يقدم ليت لاونج الأجواء المثالية.

نؤمن بدعم المجتمعات المحلية والممارسات المستدامة، ولهذا نختار بعناية موردينا ومكوناتنا. تتميز قائمتنا بتشكيلة متنوعة من المشروبات المتخصصة والمعجنات الطازجة والوجبات الصحية المحضرة بأجود المكونات.

انضموا إلينا لرحلة طهي لا تُنسى حيث يلتقي التقليد بالابتكار، وتصبح كل زيارة ذكرى عزيزة.`,
      isActive: true
    }).onConflictDoNothing();

    // Seed Contact Us
    console.log("📞 Seeding contact us...");
    await db.insert(contactUs).values({
      id: 1,
      phone: "+966 11 555 1234",
      whatsapp: "966555555555",
      email: "contact@latelounge.sa",
      address: "456 Coffee Street, Riyadh",
      addressAr: "456 شارع القهوة، الرياض",
      workingHours: "Daily: 6AM-12AM",
      workingHoursAr: "يومياً: 6ص-12م",
      socialMediaLinks: JSON.stringify({
        twitter: "https://twitter.com/latelounge_sa",
        facebook: "https://facebook.com/latelounge",
        instagram: "https://instagram.com/latelounge_sa"
      }),
      isActive: true
    }).onConflictDoNothing();

    // Seed Footer Content
    console.log("🦶 Seeding footer content...");
    await db.insert(footerContent).values({
      id: 1,
      companyNameEn: "LateLounge",
      companyNameAr: "ليت لاونج",
      descriptionEn: "Your premium destination for exceptional coffee and memorable moments.",
      descriptionAr: "وجهتكم المميزة للقهوة الاستثنائية واللحظات التي لا تُنسى.",
      copyrightText: "© 2024 LateLounge. All rights reserved.",
      quickLinks: JSON.stringify([
        { nameEn: "About Us", nameAr: "من نحن", url: "/about" },
        { nameEn: "Menu", nameAr: "القائمة", url: "/menu" },
        { nameEn: "Contact", nameAr: "اتصل بنا", url: "/contact" },
        { nameEn: "Privacy Policy", nameAr: "سياسة الخصوصية", url: "/privacy-policy" }
      ]),
      isActive: true
    }).onConflictDoNothing();

    // Seed Widget Settings
    console.log("🎛️ Seeding widget settings...");
    const widgetData = [
      {
        name: "site_logo",
        titleEn: "Site Logo",
        titleAr: "شعار الموقع",
        settings: JSON.stringify({
          valueEn: "/assets/english-white.png",
          valueAr: "/assets/arabic-white.png"
        }),
        isActive: true
      },
      {
        name: "site_logo_dark",
        titleEn: "Site Logo Dark",
        titleAr: "شعار الموقع الداكن",
        settings: JSON.stringify({
          valueEn: "/assets/english-dark.png",
          valueAr: "/assets/arabic-dark.png"
        }),
        isActive: true
      },
      {
        name: "hero_title",
        titleEn: "Hero Title",
        titleAr: "عنوان البطل",
        settings: JSON.stringify({
          valueEn: "Welcome to LateLounge",
          valueAr: "مرحباً بكم في ليت لاونج"
        }),
        isActive: true
      },
      {
        name: "tawk_chat",
        titleEn: "Tawk.to Chat Widget",
        titleAr: "ودجت الدردشة",
        settings: JSON.stringify({
          valueEn: "67667a234304e3196ae82c84",
          valueAr: "67667a234304e3196ae82c84",
          descriptionEn: "Tawk.to Property ID for chat widget",
          descriptionAr: "معرف خاصية Tawk.to لودجت الدردشة"
        }),
        isActive: true
      }
    ];

    await db.insert(widgetSettings).values(widgetData).onConflictDoNothing();

    // Seed Privacy Policy
    console.log("🔒 Seeding privacy policy...");
    await db.insert(privacyPolicy).values({
      id: 1,
      titleEn: "Privacy Policy",
      titleAr: "سياسة الخصوصية",
      contentEn: `At LateLounge, we value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you visit our website or use our services.

**Information We Collect**
- Personal information such as name, email, and phone number when you contact us
- Usage data including IP address, browser type, and pages visited
- Cookies and similar tracking technologies for website functionality

**How We Use Your Information**
- To provide and improve our services
- To respond to your inquiries and requests
- To send promotional materials (with your consent)
- To analyze website usage and improve user experience

**Data Protection**
We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.

**Your Rights**
You have the right to access, update, or delete your personal information. Contact us if you wish to exercise these rights.

**Contact Us**
For any privacy-related questions, please contact us at privacy@latelounge.sa`,
      contentAr: `في ليت لاونج، نقدر خصوصيتكم ونلتزم بحماية معلوماتكم الشخصية. توضح سياسة الخصوصية هذه كيفية جمع واستخدام وحماية بياناتكم عند زيارة موقعنا أو استخدام خدماتنا.

**المعلومات التي نجمعها**
- المعلومات الشخصية مثل الاسم والبريد الإلكتروني ورقم الهاتف عند التواصل معنا
- بيانات الاستخدام بما في ذلك عنوان IP ونوع المتصفح والصفحات المزارة
- ملفات تعريف الارتباط والتقنيات المشابهة لوظائف الموقع

**كيفية استخدام معلوماتكم**
- لتقديم وتحسين خدماتنا
- للرد على استفساراتكم وطلباتكم
- لإرسال المواد الترويجية (بموافقتكم)
- لتحليل استخدام الموقع وتحسين تجربة المستخدم

**حماية البيانات**
نطبق التدابير الأمنية المناسبة لحماية معلوماتكم الشخصية ضد الوصول غير المصرح به أو التعديل أو الكشف أو التدمير.

**حقوقكم**
لديكم الحق في الوصول إلى معلوماتكم الشخصية أو تحديثها أو حذفها. اتصلوا بنا إذا كنتم ترغبون في ممارسة هذه الحقوق.

**اتصلوا بنا**
لأي أسئلة متعلقة بالخصوصية، يرجى التواصل معنا على privacy@latelounge.sa`,
      isActive: true
    }).onConflictDoNothing();

    // Seed Terms of Service
    console.log("📋 Seeding terms of service...");
    await db.insert(termsOfService).values({
      id: 1,
      titleEn: "Terms of Service",
      titleAr: "شروط الخدمة",
      contentEn: `Welcome to LateLounge. By accessing our website and using our services, you agree to comply with these Terms of Service.

**Use of Services**
- Our services are provided for personal, non-commercial use
- You must be at least 18 years old to use our services
- You agree to provide accurate information when requested

**Prohibited Activities**
- Violating any applicable laws or regulations
- Interfering with the proper functioning of our website
- Attempting to gain unauthorized access to our systems

**Intellectual Property**
All content on our website, including text, images, logos, and designs, is protected by copyright and other intellectual property laws.

**Limitation of Liability**
LateLounge shall not be liable for any indirect, incidental, or consequential damages arising from your use of our services.

**Modifications**
We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting.

**Contact Information**
For questions about these Terms of Service, contact us at legal@latelounge.sa`,
      contentAr: `مرحباً بكم في ليت لاونج. من خلال الوصول إلى موقعنا واستخدام خدماتنا، فإنكم توافقون على الامتثال لشروط الخدمة هذه.

**استخدام الخدمات**
- تُقدم خدماتنا للاستخدام الشخصي غير التجاري
- يجب أن تكونوا بعمر 18 عاماً على الأقل لاستخدام خدماتنا
- توافقون على تقديم معلومات دقيقة عند الطلب

**الأنشطة المحظورة**
- انتهاك أي قوانين أو لوائح سارية
- التدخل في الأداء السليم لموقعنا
- محاولة الحصول على وصول غير مصرح به لأنظمتنا

**الملكية الفكرية**
جميع المحتويات على موقعنا، بما في ذلك النصوص والصور والشعارات والتصاميم، محمية بحقوق الطبع والنشر وقوانين الملكية الفكرية الأخرى.

**تحديد المسؤولية**
لن يكون ليت لاونج مسؤولاً عن أي أضرار غير مباشرة أو عرضية أو تبعية تنشأ من استخدامكم لخدماتنا.

**التعديلات**
نحتفظ بالحق في تعديل هذه الشروط في أي وقت. ستصبح التغييرات سارية فور النشر.

**معلومات الاتصال**
للأسئلة حول شروط الخدمة هذه، اتصلوا بنا على legal@latelounge.sa`,
      isActive: true
    }).onConflictDoNothing();

    console.log("✅ Production data seeding completed successfully!");

  } catch (error) {
    console.error("❌ Error seeding production data:", error);
    throw error;
  }
}