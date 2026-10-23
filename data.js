// Apple Finder Uzbekistan - Data Store

const PRODUCTS_DATA = [
  {
    id: "iphone-16-pro-max",
    name: "iPhone 16 Pro Max",
    category: "iPhone",
    series: "iPhone 16",
    price: 15499000,
    priceFormatted: "15,499,000 UZS",
    rating: 4.9,
    reviewsCount: 358,
    image: "assets/images/iphone.jpg",
    chip: "A18 Pro chip",
    chipType: "A-series",
    screen: '6.9" Super Retina XDR OLED',
    battery: "Up to 33 hours video playback",
    camera: "48MP Fusion + 48MP Ultra Wide + 12MP 5x Telephoto",
    weight: "227 g",
    condition: "New",
    colors: [
      { name: "Black Titanium", hex: "#1f2022" },
      { name: "White Titanium", hex: "#f2f1ed" },
      { name: "Natural Titanium", hex: "#9f9990" },
      { name: "Desert Titanium", hex: "#c7b198" }
    ],
    storage: ["256 GB", "512 GB", "1 TB"],
    pricesByStorage: {
      "256 GB": 15499000,
      "512 GB": 17800000,
      "1 TB": 20900000
    },
    popularity: 99,
    isPopular: true,
    releaseYear: 2024,
    advantages: [
      "Exceptional performance with the latest A18 Pro chip",
      "Stunning 6.9\" Super Retina XDR display with 120Hz ProMotion",
      "Professional-grade 48MP triple camera system with 5x optical zoom",
      "Class-leading all-day battery life (up to 33 hours)",
      "Ultra-durable, lightweight Grade 5 titanium design"
    ],
    limitations: [
      "Higher price point compared to standard models",
      "Large form factor may be bulky for single-handed use",
      "Power adapter not included in the retail box"
    ],
    bestFor: [
      "Content creators & vloggers",
      "Mobile photography & filmmaking",
      "High-end mobile gaming & multitasking",
      "Power business users"
    ],
    sellers: [
      {
        id: "techzone",
        storeName: "TechZone",
        price: 15499000,
        address: "A. Temur St, 108, Tashkent",
        phone: "+998 71 234 56 78",
        verified: true,
        inStock: true,
        city: "Tashkent",
        warranty: "1 Year Official Apple Warranty"
      },
      {
        id: "istore",
        storeName: "iStore",
        price: 15650000,
        address: "Mustaqillik Ave, 77, Tashkent",
        phone: "+998 71 204 56 77",
        verified: true,
        inStock: true,
        city: "Tashkent",
        warranty: "1 Year Official Apple Warranty"
      },
      {
        id: "apple-world",
        storeName: "Apple World",
        price: 15700000,
        address: "Amir Temur St, 42, Tashkent",
        phone: "+998 71 785 45 21",
        verified: true,
        inStock: true,
        city: "Tashkent",
        warranty: "1 Year Official Apple Warranty"
      }
    ]
  },
  {
    id: "iphone-16-pro",
    name: "iPhone 16 Pro",
    category: "iPhone",
    series: "iPhone 16",
    price: 13899000,
    priceFormatted: "13,899,000 UZS",
    rating: 4.8,
    reviewsCount: 290,
    image: "assets/images/iphone.jpg",
    chip: "A18 Pro chip",
    chipType: "A-series",
    screen: '6.3" Super Retina XDR OLED',
    battery: "Up to 27 hours video playback",
    camera: "48MP Fusion + 48MP Ultra Wide + 12MP 5x Telephoto",
    weight: "199 g",
    condition: "New",
    colors: [
      { name: "Black Titanium", hex: "#1f2022" },
      { name: "White Titanium", hex: "#f2f1ed" },
      { name: "Natural Titanium", hex: "#9f9990" },
      { name: "Desert Titanium", hex: "#c7b198" }
    ],
    storage: ["128 GB", "256 GB", "512 GB", "1 TB"],
    pricesByStorage: {
      "128 GB": 13899000,
      "256 GB": 14999000,
      "512 GB": 17200000,
      "1 TB": 19800000
    },
    popularity: 98,
    isPopular: true,
    releaseYear: 2024,
    advantages: [
      "Compact pro flagship with Grade 5 Titanium body",
      "Brand-new Camera Control button with instant shutter",
      "Superb 5x optical tetraprism telephoto lens",
      "A18 Pro chip with 6-core GPU ray tracing support"
    ],
    limitations: [
      "Smaller screen than Pro Max",
      "Base 128GB version fills up quickly with 4K ProRes"
    ],
    bestFor: [
      "Users looking for compact pro flagship",
      "Everyday high performance & photography",
      "Students & professionals wanting premium build"
    ],
    sellers: [
      {
        id: "techzone",
        storeName: "TechZone",
        price: 13899000,
        address: "A. Temur St, 108, Tashkent",
        phone: "+998 71 234 56 78",
        verified: true,
        inStock: true,
        city: "Tashkent",
        warranty: "1 Year Official Apple Warranty"
      },
      {
        id: "istore",
        storeName: "iStore",
        price: 14100000,
        address: "Mustaqillik Ave, 77, Tashkent",
        phone: "+998 71 204 56 77",
        verified: true,
        inStock: true,
        city: "Tashkent",
        warranty: "1 Year Official Apple Warranty"
      }
    ]
  },
  {
    id: "macbook-air-13-m3",
    name: 'MacBook Air 13" M3',
    category: "MacBook",
    series: "MacBook Air",
    price: 13990000,
    priceFormatted: "13,990,000 UZS",
    rating: 4.9,
    reviewsCount: 412,
    image: "assets/images/macbook.jpg",
    chip: "M3 chip (8-core CPU / 10-core GPU)",
    chipType: "M-series",
    screen: '13.6" Liquid Retina Display (500 nits)',
    battery: "Up to 18 hours battery life",
    camera: "1080p FaceTime HD camera",
    weight: "1.24 kg",
    condition: "New",
    colors: [
      { name: "Midnight", hex: "#1e2430" },
      { name: "Starlight", hex: "#e5ded4" },
      { name: "Space Gray", hex: "#7d7e80" },
      { name: "Silver", hex: "#e0e1e2" }
    ],
    storage: ["256 GB", "512 GB", "1 TB", "2 TB"],
    pricesByStorage: {
      "256 GB": 13990000,
      "512 GB": 16490000,
      "1 TB": 19800000,
      "2 TB": 23500000
    },
    popularity: 96,
    isPopular: true,
    releaseYear: 2024,
    advantages: [
      "Incredibly thin (11.3mm) and whisper-quiet fanless design",
      "Power-efficient M3 chip with hardware-accelerated mesh shading",
      "Dual external display support (with clamshell closed)",
      "Unbeatable 18-hour real-world battery life"
    ],
    limitations: [
      "No internal fan (sustained heavy 3D rendering will throttle)",
      "Base model has 8GB/16GB unified memory depending on batch"
    ],
    bestFor: [
      "University students & school pupils",
      "Web developers, writers, marketers",
      "Travelers & mobile remote workers"
    ],
    sellers: [
      {
        id: "techzone",
        storeName: "TechZone",
        price: 13990000,
        address: "A. Temur St, 108, Tashkent",
        phone: "+998 71 234 56 78",
        verified: true,
        inStock: true,
        city: "Tashkent",
        warranty: "1 Year Official Apple Warranty"
      },
      {
        id: "apple-world",
        storeName: "Apple World",
        price: 14250000,
        address: "Amir Temur St, 42, Tashkent",
        phone: "+998 71 785 45 21",
        verified: true,
        inStock: true,
        city: "Tashkent",
        warranty: "1 Year Official Apple Warranty"
      }
    ]
  },
  {
    id: "ipad-air-11-m2",
    name: 'iPad Air 11" M2',
    category: "iPad",
    series: "iPad Air",
    price: 7890000,
    priceFormatted: "7,890,000 UZS",
    rating: 4.8,
    reviewsCount: 185,
    image: "assets/images/ipad.jpg",
    chip: "M2 chip (8-core CPU / 9-core GPU)",
    chipType: "M-series",
    screen: '11.0" Liquid Retina Display',
    battery: "Up to 10 hours surf/video",
    camera: "12MP Wide rear camera + 12MP Landscape Ultra Wide front",
    weight: "462 g",
    condition: "New",
    colors: [
      { name: "Space Gray", hex: "#68696b" },
      { name: "Starlight", hex: "#e5ded4" },
      { name: "Purple", hex: "#b4b2cb" },
      { name: "Blue", hex: "#95a8b7" }
    ],
    storage: ["128 GB", "256 GB", "512 GB", "1 TB"],
    pricesByStorage: {
      "128 GB": 7890000,
      "256 GB": 9200000,
      "512 GB": 11800000,
      "1 TB": 14500000
    },
    popularity: 92,
    isPopular: true,
    releaseYear: 2024,
    advantages: [
      "Blazing speed with Apple M2 Silicon desktop processor",
      "Landscape oriented front camera for optimal video calls",
      "Full support for Apple Pencil Pro with barrel roll & squeeze",
      "Support for Magic Keyboard turning it into a lightweight laptop"
    ],
    limitations: [
      "Standard 60Hz display refresh rate (no ProMotion 120Hz)",
      "Accessories (Pencil Pro & Magic Keyboard) sold separately"
    ],
    bestFor: [
      "Digital artists & illustrators",
      "Students taking handwritten notes and reading textbooks",
      "Casual content consumption, media & lightweight editing"
    ],
    sellers: [
      {
        id: "techzone",
        storeName: "TechZone",
        price: 7890000,
        address: "A. Temur St, 108, Tashkent",
        phone: "+998 71 234 56 78",
        verified: true,
        inStock: true,
        city: "Tashkent",
        warranty: "1 Year Official Apple Warranty"
      },
      {
        id: "istore",
        storeName: "iStore",
        price: 8100000,
        address: "Mustaqillik Ave, 77, Tashkent",
        phone: "+998 71 204 56 77",
        verified: true,
        inStock: true,
        city: "Tashkent",
        warranty: "1 Year Official Apple Warranty"
      }
    ]
  },
  {
    id: "apple-watch-series-10",
    name: "Apple Watch Series 10",
    category: "Apple Watch",
    series: "Series 10",
    price: 5490000,
    priceFormatted: "5,490,000 UZS",
    rating: 4.8,
    reviewsCount: 142,
    image: "assets/images/watch.jpg",
    chip: "S10 SiP 64-bit dual-core",
    chipType: "S-series",
    screen: "Wide-angle OLED Always-On Display (up to 2000 nits)",
    battery: "Up to 18 hours normal / 36 hours low power",
    camera: "N/A (Built-in Speaker & Mic with Voice Isolation)",
    weight: "30.0 g (42mm) / 36.4 g (46mm)",
    condition: "New",
    colors: [
      { name: "Jet Black", hex: "#101010" },
      { name: "Rose Gold", hex: "#e7b4a8" },
      { name: "Silver", hex: "#e0e1e2" }
    ],
    storage: ["64 GB"],
    pricesByStorage: {
      "64 GB": 5490000
    },
    popularity: 90,
    isPopular: true,
    releaseYear: 2024,
    advantages: [
      "Thinnest Apple Watch ever (nearly 10% slimmer than Series 9)",
      "Biggest and most advanced Wide-angle OLED display",
      "Fast charging: 0 to 80% battery in about 30 minutes",
      "Sleep apnea detection and water depth/temperature gauge"
    ],
    limitations: [
      "Requires daily charging compared to specialized sport watches",
      "Works only in pairing with Apple iPhone"
    ],
    bestFor: [
      "Fitness enthusiasts, runners & swimmers",
      "Health & heart monitoring, sleep tracking",
      "Everyday notifications, Apple Pay and calls"
    ],
    sellers: [
      {
        id: "istore",
        storeName: "iStore",
        price: 5490000,
        address: "Mustaqillik Ave, 77, Tashkent",
        phone: "+998 71 204 56 77",
        verified: true,
        inStock: true,
        city: "Tashkent",
        warranty: "1 Year Official Apple Warranty"
      },
      {
        id: "apple-world",
        storeName: "Apple World",
        price: 5600000,
        address: "Amir Temur St, 42, Tashkent",
        phone: "+998 71 785 45 21",
        verified: true,
        inStock: true,
        city: "Tashkent",
        warranty: "1 Year Official Apple Warranty"
      }
    ]
  },
  {
    id: "airpods-pro-2",
    name: "AirPods Pro (2nd Gen, USB-C)",
    category: "AirPods",
    series: "AirPods Pro",
    price: 3190000,
    priceFormatted: "3,190,000 UZS",
    rating: 4.9,
    reviewsCount: 520,
    image: "assets/images/airpods.jpg",
    chip: "H2 headphone chip",
    chipType: "H-series",
    screen: "MagSafe Case with speaker & lanyard loop",
    battery: "Up to 6 hours listening / 30 hours with case",
    camera: "N/A (Dual beamforming mics)",
    weight: "5.3 g per earbud, 50.8 g case",
    condition: "New",
    colors: [
      { name: "White", hex: "#ffffff" }
    ],
    storage: ["Standard"],
    pricesByStorage: {
      "Standard": 3190000
    },
    popularity: 97,
    isPopular: true,
    releaseYear: 2023,
    advantages: [
      "Up to 2x more Active Noise Cancellation than gen 1",
      "Adaptive Audio with Conversation Awareness",
      "USB-C charging with MagSafe and Apple Watch charger support",
      "IP54 dust, sweat, and water resistance"
    ],
    limitations: [
      "Only available in glossy white finish",
      "Lossless audio only with Apple Vision Pro"
    ],
    bestFor: [
      "Daily commuting & flights",
      "Calls, online meetings & gym workouts",
      "Audiophiles who value seamless Apple ecosystem switching"
    ],
    sellers: [
      {
        id: "techzone",
        storeName: "TechZone",
        price: 3190000,
        address: "A. Temur St, 108, Tashkent",
        phone: "+998 71 234 56 78",
        verified: true,
        inStock: true,
        city: "Tashkent",
        warranty: "1 Year Official Apple Warranty"
      },
      {
        id: "apple-world",
        storeName: "Apple World",
        price: 3250000,
        address: "Amir Temur St, 42, Tashkent",
        phone: "+998 71 785 45 21",
        verified: true,
        inStock: true,
        city: "Tashkent",
        warranty: "1 Year Official Apple Warranty"
      }
    ]
  },
  {
    id: "iphone-16-plus",
    name: "iPhone 16 Plus",
    category: "iPhone",
    series: "iPhone 16",
    price: 11990000,
    priceFormatted: "11,990,000 UZS",
    rating: 4.7,
    reviewsCount: 167,
    image: "assets/images/iphone.jpg",
    chip: "A18 chip",
    chipType: "A-series",
    screen: '6.7" Super Retina XDR OLED',
    battery: "Up to 27 hours video playback",
    camera: "48MP Fusion + 12MP Ultra Wide with Macro",
    weight: "199 g",
    condition: "New",
    colors: [
      { name: "Black", hex: "#222222" },
      { name: "White", hex: "#f5f5f7" },
      { name: "Pink", hex: "#f3c5c5" },
      { name: "Teal", hex: "#a4cfcf" },
      { name: "Ultramarine", hex: "#8799db" }
    ],
    storage: ["128 GB", "256 GB", "512 GB"],
    pricesByStorage: {
      "128 GB": 11990000,
      "256 GB": 13490000,
      "512 GB": 15990000
    },
    popularity: 88,
    isPopular: false,
    releaseYear: 2024,
    advantages: [
      "Massive 6.7\" display at significantly lower weight and price than Pro Max",
      "Outstanding battery endurance",
      "Action button + Camera Control button included",
      "Vibrant color infused glass back"
    ],
    limitations: [
      "60Hz refresh rate display",
      "No dedicated telephoto optical zoom lens"
    ],
    bestFor: [
      "Users wanting huge battery life and screen without paying Pro prices",
      "Media consumption, video streaming & social media",
      "Everyday casual users"
    ],
    sellers: [
      {
        id: "istore",
        storeName: "iStore",
        price: 11990000,
        address: "Mustaqillik Ave, 77, Tashkent",
        phone: "+998 71 204 56 77",
        verified: true,
        inStock: true,
        city: "Tashkent",
        warranty: "1 Year Official Apple Warranty"
      }
    ]
  },
  {
    id: "macbook-pro-14-m3-pro",
    name: 'MacBook Pro 14" M3 Pro',
    category: "MacBook",
    series: "MacBook Pro",
    price: 24500000,
    priceFormatted: "24,500,000 UZS",
    rating: 5.0,
    reviewsCount: 310,
    image: "assets/images/macbook.jpg",
    chip: "M3 Pro chip (11-core CPU / 14-core GPU)",
    chipType: "M-series",
    screen: '14.2" Liquid Retina XDR (1600 nits peak, 120Hz ProMotion)',
    battery: "Up to 18 hours battery life",
    camera: "1080p FaceTime HD camera with studio mics",
    weight: "1.61 kg",
    condition: "New",
    colors: [
      { name: "Space Black", hex: "#2b2b2e" },
      { name: "Silver", hex: "#e0e1e2" }
    ],
    storage: ["512 GB", "1 TB", "2 TB"],
    pricesByStorage: {
      "512 GB": 24500000,
      "1 TB": 27900000,
      "2 TB": 32500000
    },
    popularity: 94,
    isPopular: false,
    releaseYear: 2024,
    advantages: [
      "Extreme performance for video rendering, Xcode, Blender, Docker",
      "Liquid Retina XDR screen with incredible HDR contrast",
      "HDMI port, SDXC card slot, 3x Thunderbolt 4 ports & MagSafe 3",
      "Active high-efficiency dual fan cooling system"
    ],
    limitations: [
      "Substantially heavier than MacBook Air",
      "Premium investment price"
    ],
    bestFor: [
      "Software engineers & backend/frontend developers",
      "4K/8K video editors & sound designers",
      "3D animators & data scientists"
    ],
    sellers: [
      {
        id: "techzone",
        storeName: "TechZone",
        price: 24500000,
        address: "A. Temur St, 108, Tashkent",
        phone: "+998 71 234 56 78",
        verified: true,
        inStock: true,
        city: "Tashkent",
        warranty: "1 Year Official Apple Warranty"
      },
      {
        id: "apple-world",
        storeName: "Apple World",
        price: 24800000,
        address: "Amir Temur St, 42, Tashkent",
        phone: "+998 71 785 45 21",
        verified: true,
        inStock: true,
        city: "Tashkent",
        warranty: "1 Year Official Apple Warranty"
      }
    ]
  }
];

const STORES_DATA = [
  {
    id: "techzone",
    name: "TechZone",
    verified: true,
    rating: 4.9,
    reviews: 1420,
    address: "Amir Temur St, 108, Tashkent",
    district: "Yunusabad",
    city: "Tashkent",
    phone: "+998 71 234 56 78",
    email: "info@techzone.uz",
    workingHours: "09:00 - 21:00 (Daily)",
    categories: ["iPhone", "MacBook", "iPad", "AirPods", "Apple Watch"],
    priceRange: "3,190,000 — 48,000,000 UZS",
    coords: { x: 38, y: 32 }, // Percentage map coordinates for visual SVG map
    latLng: "41.3385, 69.2842",
    features: ["Official Warranty", "Trade-In", "Installments (Nasiya)", "In-Store Pickup"]
  },
  {
    id: "istore",
    name: "iStore",
    verified: true,
    rating: 4.8,
    reviews: 980,
    address: "Mustaqillik Ave, 77, Tashkent",
    district: "Mirzo-Ulugbek",
    city: "Tashkent",
    phone: "+998 71 204 56 77",
    email: "sales@istore.uz",
    workingHours: "10:00 - 22:00 (Daily)",
    categories: ["iPhone", "iPad", "Apple Watch", "AirPods"],
    priceRange: "3,200,000 — 35,000,000 UZS",
    coords: { x: 58, y: 46 },
    latLng: "41.3168, 69.2985",
    features: ["Official Warranty", "Free Delivery across Tashkent", "Card Payment (Uzcard/Humo/Visa)"]
  },
  {
    id: "apple-world",
    name: "Apple World",
    verified: true,
    rating: 4.8,
    reviews: 1150,
    address: "Amir Temur St, 42, Tashkent",
    district: "Mirabad",
    city: "Tashkent",
    phone: "+998 71 785 45 21",
    email: "appleworld.uz@gmail.com",
    workingHours: "09:00 - 21:00 (Daily)",
    categories: ["iPhone", "MacBook", "iPad", "Apple Watch"],
    priceRange: "3,400,000 — 52,000,000 UZS",
    coords: { x: 44, y: 65 },
    latLng: "41.3021, 69.2789",
    features: ["Official Warranty", "Device Transfer & Setup", "Corporate Sales (B2B)"]
  },
  {
    id: "samarkand-apple-center",
    name: "Apple Center Samarkand",
    verified: true,
    rating: 4.9,
    reviews: 640,
    address: "Registan St, 14, Samarkand",
    district: "Central",
    city: "Samarkand",
    phone: "+998 66 233 44 55",
    email: "samarkand@applecenter.uz",
    workingHours: "09:30 - 20:30",
    categories: ["iPhone", "MacBook", "iPad", "Apple Watch", "AirPods"],
    priceRange: "3,300,000 — 46,000,000 UZS",
    coords: { x: 22, y: 78 },
    latLng: "39.6542, 66.9597",
    features: ["Official Warranty", "Express Delivery in Samarkand", "Trade-In"]
  }
];

const CITIES = ["All Cities", "Tashkent", "Samarkand", "Bukhara", "Andijan", "Namangan", "Fergana", "Other"];

// Quiz Questions for "Help Me Choose"
const QUIZ_QUESTIONS = [
  {
    step: 1,
    title: "1. For what primary purpose will you use the Apple device?",
    subtitle: "Select the option that best reflects your main everyday routine.",
    options: [
      { id: "study", label: "Study / Education", icon: "🎓", recCategory: "MacBook", recSeries: "MacBook Air" },
      { id: "office", label: "Office Work", icon: "💼", recCategory: "MacBook", recSeries: "MacBook Air" },
      { id: "programming", label: "Programming", icon: "💻", recCategory: "MacBook", recSeries: "MacBook Pro" },
      { id: "design", label: "Design & Digital Art", icon: "🎨", recCategory: "iPad", recSeries: "iPad Air" },
      { id: "video", label: "Video Editing (4K/Pro)", icon: "🎬", recCategory: "MacBook", recSeries: "MacBook Pro" },
      { id: "photo", label: "Photography & Vlogs", icon: "📷", recCategory: "iPhone", recSeries: "iPhone 16" },
      { id: "social", label: "Social Media & Lifestyle", icon: "📱", recCategory: "iPhone", recSeries: "iPhone 16" },
      { id: "fitness", label: "Fitness & Health Tracker", icon: "⌚", recCategory: "Apple Watch", recSeries: "Series 10" },
      { id: "everyday", label: "Everyday General Use", icon: "☕", recCategory: "iPhone", recSeries: "iPhone 16" }
    ]
  },
  {
    step: 2,
    title: "2. Which device form factor do you prefer?",
    subtitle: "Choose the physical form factor you are looking for.",
    options: [
      { id: "phone", label: "Smartphone (iPhone)", icon: "📱", category: "iPhone" },
      { id: "laptop", label: "Laptop (MacBook)", icon: "💻", category: "MacBook" },
      { id: "tablet", label: "Tablet (iPad)", icon: "📋", category: "iPad" },
      { id: "watch", label: "Smartwatch (Apple Watch)", icon: "⌚", category: "Apple Watch" },
      { id: "audio", label: "Wireless Earbuds (AirPods)", icon: "🎧", category: "AirPods" },
      { id: "recommend", label: "I trust the advisor to choose", icon: "💡", category: "any" }
    ]
  },
  {
    step: 3,
    title: "3. What is your approximate planned budget?",
    subtitle: "We filter only verified sellers offering best prices in Uzbekistan.",
    options: [
      { id: "budget", label: "Under 6,000,000 UZS", desc: "AirPods, Apple Watch, basic configurations", maxPrice: 6000000 },
      { id: "mid", label: "6,000,000 – 12,000,000 UZS", desc: "iPad Air, standard iPhone series", maxPrice: 12000000 },
      { id: "pro", label: "12,000,000 – 18,000,000 UZS", desc: "iPhone 16 Pro, MacBook Air M3", maxPrice: 18000000 },
      { id: "unlimited", label: "18,000,000+ UZS (Top Flagships)", desc: "MacBook Pro M3 Pro, iPhone 16 Pro Max 1TB", maxPrice: 99999999 }
    ]
  },
  {
    step: 4,
    title: "4. Portability vs Maximum Screen Size?",
    subtitle: "How often will you carry the device on the go?",
    options: [
      { id: "ultraportable", label: "Ultra-portable & Light", icon: "🪶", desc: "Easy to carry anywhere all day" },
      { id: "balanced", label: "Balanced Standard Size", icon: "⚖️", desc: "Best compromise between screen and weight" },
      { id: "maxscreen", label: "Maximum Screen & Performance", icon: "🖥️", desc: "Immersion, multitasking, maximum workspace" }
    ]
  },
  {
    step: 5,
    title: "5. Storage Capacity Needed?",
    subtitle: "Think about your photos, 4K videos, games, or developer projects.",
    options: [
      { id: "st-standard", label: "128 GB - 256 GB", desc: "Sufficient for everyday apps, cloud photos and streaming" },
      { id: "st-large", label: "512 GB", desc: "Recommended for pro creators, large video libraries & games" },
      { id: "st-max", label: "1 TB - 2 TB", desc: "Heavy professional ProRes 4K footage and developer builds" }
    ]
  }
];
