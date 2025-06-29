import { storage } from "./storage";

export async function seedDatabase() {
  console.log("🌱 Starting database seeding...");

  try {
    // Seed Categories
    console.log("📂 Seeding categories...");
    const categoryData = [
      {
        nameEn: "Coffee & Espresso",
        nameAr: "القهوة والإسبريسو",
        descriptionEn: "Premium coffee blends and specialty drinks",
        descriptionAr: "خلطات قهوة فاخرة ومشروبات مميزة",
        slug: "coffee",
        image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        isActive: true
      },
      {
        nameEn: "Hot Beverages",
        nameAr: "المشروبات الساخنة",
        descriptionEn: "Warm and comforting drinks for cozy moments",
        descriptionAr: "مشروبات دافئة ومريحة للحظات الدافئة",
        slug: "hot-drinks",
        image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        isActive: true
      },
      {
        nameEn: "Cold Beverages",
        nameAr: "المشروبات الباردة",
        descriptionEn: "Refreshing cold drinks to beat the heat",
        descriptionAr: "مشروبات باردة منعشة لمقاومة الحر",
        slug: "cold-drinks",
        image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        isActive: true
      },
      {
        nameEn: "Breakfast",
        nameAr: "الإفطار",
        descriptionEn: "Fresh and healthy breakfast options",
        descriptionAr: "خيارات إفطار طازجة وصحية",
        slug: "breakfast",
        image: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        isActive: true
      },
      {
        nameEn: "Main Dishes",
        nameAr: "الأطباق الرئيسية",
        descriptionEn: "Hearty meals and savory delights",
        descriptionAr: "وجبات شهية ولذائذ مالحة",
        slug: "main-dishes",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        isActive: true
      },
      {
        nameEn: "Desserts",
        nameAr: "الحلويات",
        descriptionEn: "Sweet treats and indulgent desserts",
        descriptionAr: "حلويات حلوة ولذائذ منغمسة",
        slug: "desserts",
        image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        isActive: true
      }
    ];

    const categories = [];
    for (const category of categoryData) {
      const created = await storage.createCategory(category);
      categories.push(created);
      console.log(`✅ Created category: ${category.nameEn}`);
    }

    // Seed Products
    console.log("🍽️ Seeding products...");
    const productData = [
      // Coffee & Espresso (category 1)
      {
        nameEn: "Espresso",
        nameAr: "إسبريسو",
        descriptionEn: "Rich and bold espresso shot with perfect crema",
        descriptionAr: "جرعة إسبريسو غنية وجريئة مع كريما مثالية",
        price: "15.00",
        categoryId: categories[0].id,
        image: "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        stock: 100,
        isActive: true,
        isFeatured: true,
        isAvailable: true
      },
      {
        nameEn: "Cappuccino",
        nameAr: "كابتشينو",
        descriptionEn: "Classic Italian coffee with steamed milk and foam",
        descriptionAr: "قهوة إيطالية كلاسيكية مع حليب مبخر ورغوة",
        price: "22.00",
        categoryId: categories[0].id,
        image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        stock: 100,
        isActive: true,
        isFeatured: false,
        isAvailable: true
      },
      {
        nameEn: "Latte",
        nameAr: "لاتيه",
        descriptionEn: "Smooth espresso with steamed milk and light foam",
        descriptionAr: "إسبريسو ناعم مع حليب مبخر ورغوة خفيفة",
        price: "25.00",
        categoryId: categories[0].id,
        image: "https://images.unsplash.com/photo-1561882468-9110e03e0f78?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        stock: 100,
        isActive: true,
        isFeatured: true,
        isAvailable: true
      },
      {
        nameEn: "Turkish Coffee",
        nameAr: "قهوة تركية",
        descriptionEn: "Traditional Turkish coffee served with authentic preparation",
        descriptionAr: "قهوة تركية تقليدية تُقدم بالتحضير الأصيل",
        price: "20.00",
        categoryId: categories[0].id,
        image: "https://images.unsplash.com/photo-1497636577773-f1231844b336?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        stock: 50,
        isActive: true,
        isFeatured: true,
        isAvailable: true
      },
      {
        nameEn: "Arabic Coffee",
        nameAr: "قهوة عربية",
        descriptionEn: "Traditional Arabic coffee with cardamom and dates",
        descriptionAr: "قهوة عربية تقليدية مع الهيل والتمر",
        price: "18.00",
        categoryId: categories[0].id,
        image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        stock: 50,
        isActive: true,
        isFeatured: true,
        isAvailable: true
      },

      // Hot Beverages (category 2)
      {
        nameEn: "Green Tea",
        nameAr: "شاي أخضر",
        descriptionEn: "Premium organic green tea with antioxidants",
        descriptionAr: "شاي أخضر عضوي فاخر مع مضادات الأكسدة",
        price: "18.00",
        categoryId: categories[1].id,
        image: "https://images.unsplash.com/photo-1556881286-fc6915169721?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        stock: 75,
        isActive: true,
        isFeatured: false,
        isAvailable: true
      },
      {
        nameEn: "Earl Grey",
        nameAr: "إيرل جراي",
        descriptionEn: "Classic black tea with bergamot oil",
        descriptionAr: "شاي أسود كلاسيكي مع زيت البرغموت",
        price: "20.00",
        categoryId: categories[1].id,
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        stock: 60,
        isActive: true,
        isFeatured: false,
        isAvailable: true
      },
      {
        nameEn: "Moroccan Mint Tea",
        nameAr: "شاي النعناع المغربي",
        descriptionEn: "Refreshing mint tea with traditional Moroccan preparation",
        descriptionAr: "شاي النعناع المنعش بالتحضير المغربي التقليدي",
        price: "22.00",
        categoryId: categories[1].id,
        image: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        stock: 40,
        isActive: true,
        isFeatured: true,
        isAvailable: true
      },
      {
        nameEn: "Hot Chocolate",
        nameAr: "شوكولاتة ساخنة",
        descriptionEn: "Rich hot chocolate with whipped cream and marshmallows",
        descriptionAr: "شوكولاتة ساخنة غنية مع كريمة مخفوقة ومارشميلو",
        price: "25.00",
        categoryId: categories[1].id,
        image: "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        stock: 80,
        isActive: true,
        isFeatured: false,
        isAvailable: true
      },

      // Cold Beverages (category 3)
      {
        nameEn: "Iced Americano",
        nameAr: "أمريكانو مثلج",
        descriptionEn: "Refreshing iced coffee with bold espresso flavor",
        descriptionAr: "قهوة مثلجة منعشة بنكهة إسبريسو جريئة",
        price: "20.00",
        categoryId: categories[2].id,
        image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        stock: 90,
        isActive: true,
        isFeatured: true,
        isAvailable: true
      },
      {
        nameEn: "Iced Latte",
        nameAr: "لاتيه مثلج",
        descriptionEn: "Cold espresso with chilled milk over ice",
        descriptionAr: "إسبريسو بارد مع حليب مبرد على الثلج",
        price: "25.00",
        categoryId: categories[2].id,
        image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        stock: 85,
        isActive: true,
        isFeatured: false,
        isAvailable: true
      },
      {
        nameEn: "Fresh Orange Juice",
        nameAr: "عصير برتقال طازج",
        descriptionEn: "Freshly squeezed orange juice with natural pulp",
        descriptionAr: "عصير برتقال طازج مع اللب الطبيعي",
        price: "16.00",
        categoryId: categories[2].id,
        image: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        stock: 50,
        isActive: true,
        isFeatured: false,
        isAvailable: true
      },
      {
        nameEn: "Iced Tea",
        nameAr: "شاي مثلج",
        descriptionEn: "Refreshing iced tea with lemon and mint",
        descriptionAr: "شاي مثلج منعش مع الليمون والنعناع",
        price: "15.00",
        categoryId: categories[2].id,
        image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        stock: 70,
        isActive: true,
        isFeatured: false,
        isAvailable: true
      },

      // Breakfast (category 4)
      {
        nameEn: "Avocado Toast",
        nameAr: "توست الأفوكادو",
        descriptionEn: "Fresh avocado on toasted artisan bread with herbs",
        descriptionAr: "أفوكادو طازج على خبز حرفي محمص مع الأعشاب",
        price: "28.00",
        categoryId: categories[3].id,
        image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        stock: 30,
        isActive: true,
        isFeatured: true,
        isAvailable: true
      },
      {
        nameEn: "Croissant",
        nameAr: "كرواسون",
        descriptionEn: "Buttery, flaky French pastry baked fresh daily",
        descriptionAr: "معجنات فرنسية مقرمشة بالزبدة مخبوزة طازجة يومياً",
        price: "15.00",
        categoryId: categories[3].id,
        image: "https://images.unsplash.com/photo-1549903072-7e6e0bedb7fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        stock: 25,
        isActive: true,
        isFeatured: false,
        isAvailable: true
      },

      // Main Dishes (category 5)
      {
        nameEn: "Grilled Chicken Sandwich",
        nameAr: "ساندويتش دجاج مشوي",
        descriptionEn: "Tender grilled chicken with fresh vegetables",
        descriptionAr: "دجاج مشوي طري مع خضروات طازجة",
        price: "45.00",
        categoryId: categories[4].id,
        image: "https://images.unsplash.com/photo-1567234669003-dce7a7a88821?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        stock: 20,
        isActive: true,
        isFeatured: true,
        isAvailable: true
      },
      {
        nameEn: "Caesar Salad",
        nameAr: "سلطة قيصر",
        descriptionEn: "Crisp romaine lettuce with parmesan and croutons",
        descriptionAr: "خس روماني مقرمش مع البارميزان والخبز المحمص",
        price: "35.00",
        categoryId: categories[4].id,
        image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        stock: 25,
        isActive: true,
        isFeatured: false,
        isAvailable: true
      },

      // Desserts (category 6)
      {
        nameEn: "Chocolate Cake",
        nameAr: "كعكة الشوكولاتة",
        descriptionEn: "Rich dark chocolate cake with smooth ganache",
        descriptionAr: "كعكة شوكولاتة داكنة غنية مع جاناش ناعم",
        price: "25.00",
        categoryId: categories[5].id,
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        stock: 15,
        isActive: true,
        isFeatured: true,
        isAvailable: true
      },
      {
        nameEn: "Tiramisu",
        nameAr: "تيراميسو",
        descriptionEn: "Classic Italian dessert with coffee and mascarpone",
        descriptionAr: "حلوى إيطالية كلاسيكية مع القهوة والماسكاربوني",
        price: "30.00",
        categoryId: categories[5].id,
        image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        stock: 12,
        isActive: true,
        isFeatured: false,
        isAvailable: true
      }
    ];

    for (const product of productData) {
      await storage.createProduct(product);
      console.log(`✅ Created product: ${product.nameEn}`);
    }

    // Seed About Us
    console.log("ℹ️ Seeding About Us content...");
    await storage.createOrUpdateAboutUs({
      titleEn: "About LateLounge",
      titleAr: "حول ليت لاونج",
      contentEn: "<p>Welcome to LateLounge, where exceptional coffee meets warm hospitality. Since our founding, we have been dedicated to creating a unique coffee experience that brings people together in a comfortable and inviting atmosphere.</p><p>Our passion for coffee drives us to source the finest beans from renowned coffee regions around the world. Each cup is carefully crafted by our skilled baristas who understand that great coffee is both an art and a science.</p><p>At LateLounge, we believe that coffee is more than just a beverage – it is a moment of connection, a pause in your day, and a catalyst for meaningful conversations. Whether you are starting your morning, meeting with friends, or finding a quiet space to work, we are here to serve you with excellence.</p><p>Visit us and discover why LateLounge has become a beloved destination for coffee enthusiasts and community members alike.</p>",
      contentAr: "<p>مرحباً بكم في ليت لاونج، حيث تلتقي القهوة الاستثنائية مع الضيافة الدافئة. منذ تأسيسنا، كرسنا جهودنا لخلق تجربة قهوة فريدة تجمع الناس في أجواء مريحة ومرحبة.</p><p>شغفنا بالقهوة يدفعنا لاختيار أفضل حبوب القهوة من مناطق القهوة المشهورة حول العالم. كل كوب يتم تحضيره بعناية من قبل باريستا ماهرين يفهمون أن القهوة الرائعة هي فن وعلم في آن واحد.</p><p>في ليت لاونج، نؤمن أن القهوة أكثر من مجرد مشروب – إنها لحظة تواصل، استراحة في يومك، ومحفز للمحادثات الهادفة. سواء كنت تبدأ صباحك، أو تلتقي مع الأصدقاء، أو تبحث عن مساحة هادئة للعمل، نحن هنا لخدمتك بتميز.</p><p>زرنا واكتشف لماذا أصبح ليت لاونج وجهة محبوبة لعشاق القهوة وأفراد المجتمع على حد سواء.</p>",
      image: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3624.5!2d46.7386!3d24.7136!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjTCsDQyJzQ5LjAiTiA0NsKwNDQnMTkuMCJF!5e0!3m2!1sen!2ssa!4v1640000000000!5m2!1sen!2ssa",
      isActive: true
    });

    // Seed Contact Us
    console.log("📞 Seeding Contact Us information...");
    await storage.createOrUpdateContactUs({
      phone: "+966 11 123 4567",
      email: "info@latelounge.sa",
      address: "123 King Fahd Road, Riyadh, Saudi Arabia",
      addressAr: "123 طريق الملك فهد، الرياض، المملكة العربية السعودية",
      workingHours: "Sunday - Thursday: 7:00 AM - 11:00 PM, Friday - Saturday: 2:00 PM - 12:00 AM",
      workingHoursAr: "الأحد - الخميس: 7:00 ص - 11:00 م، الجمعة - السبت: 2:00 م - 12:00 ص",
      socialMediaLinks: {
        instagram: "https://instagram.com/latelounge",
        twitter: "https://twitter.com/latelounge",
        facebook: "https://facebook.com/latelounge",
        snapchat: "https://snapchat.com/add/latelounge"
      },
      isActive: true
    });

    // Seed Footer Content
    console.log("🦶 Seeding Footer content...");
    await storage.createOrUpdateFooterContent({
      companyNameEn: "LateLounge",
      companyNameAr: "ليت لاونج",
      descriptionEn: "Premium coffee experience with authentic flavors and warm hospitality",
      descriptionAr: "تجربة قهوة مميزة مع نكهات أصيلة وضيافة دافئة",
      copyrightText: "© 2024 LateLounge. All rights reserved.",
      quickLinks: [
        { nameEn: "Menu", nameAr: "القائمة", url: "/menu" },
        { nameEn: "About", nameAr: "حولنا", url: "/about" },
        { nameEn: "Contact", nameAr: "اتصل بنا", url: "/contact" },
        { nameEn: "Privacy Policy", nameAr: "سياسة الخصوصية", url: "/privacy" }
      ],
      isActive: true
    });

    // Seed Tawk.to Chat Widget
    console.log("🔧 Seeding Tawk.to Chat Widget...");
    await storage.createOrUpdateWidget({
      name: "tawk_chat",
      titleEn: "Tawk.to Chat Widget",
      titleAr: "ودجة الدردشة",
      settings: {
        propertyId: "6856e499f4cfc5190e97ea98",
        widgetId: "1iu9mpub8"
      },
      isActive: true
    });

    console.log("🎉 Database seeding completed successfully!");
    
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

// Run seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
    .then(() => {
      console.log("✅ Seeding completed!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Seeding failed:", error);
      process.exit(1);
    });
}