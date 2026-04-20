import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../config/database.js";
import { Venue, Event, Category, User, Itinerary } from "../models/index.js";

dotenv.config();

// Sample Users (Data Entry Team)
const users = [
  {
    email: "admin@arbeitnexus.com",
    password: "Admin@123456", // Hash this in production!
    role: "admin",
    profile: {
      firstName: "Admin",
      lastName: "User",
      phone: "+919876543210",
    },
    permissions: {
      canCreate: true,
      canEdit: true,
      canDelete: true,
      canPublish: true,
    },
    status: "active",
  },
  {
    email: "dataentry@arbeitnexus.com",
    password: "DataEntry@123",
    role: "data_entry",
    profile: {
      firstName: "Data",
      lastName: "Entry",
      phone: "+919876543211",
    },
    permissions: {
      canCreate: true,
      canEdit: true,
      canDelete: false,
      canPublish: false,
    },
    status: "active",
  },
];

// Categories
const categories = [
  {
    name: "Cafes & Coffee Shops",
    slug: "cafes",
    type: "venue",
    description: "Coffee shops and cafes for relaxed dining",
    icon: "coffee",
    order: 1,
    isActive: true,
    metadata: {
      defaultVisitDuration: 60,
      typicalCrowdLevel: "moderate",
      commonTags: ["coffee", "breakfast", "wifi"],
    },
  },
  {
    name: "Restaurants",
    slug: "restaurants",
    type: "venue",
    description: "Dining establishments",
    icon: "restaurant",
    order: 2,
    isActive: true,
    metadata: {
      defaultVisitDuration: 90,
      typicalCrowdLevel: "high",
      commonTags: ["lunch", "dinner", "cuisine"],
    },
  },
  {
    name: "Parks & Playgrounds",
    slug: "parks",
    type: "venue",
    description: "Outdoor spaces for recreation",
    icon: "park",
    order: 3,
    isActive: true,
    metadata: {
      defaultVisitDuration: 120,
      typicalCrowdLevel: "moderate",
      commonTags: ["outdoor", "family", "kids"],
    },
  },
  {
    name: "Museums & Culture",
    slug: "museums",
    type: "venue",
    description: "Cultural and historical sites",
    icon: "museum",
    order: 4,
    isActive: true,
    metadata: {
      defaultVisitDuration: 120,
      typicalCrowdLevel: "low",
      commonTags: ["history", "culture", "education"],
    },
  },
  {
    name: "Festivals",
    slug: "festivals",
    type: "event",
    description: "Cultural and seasonal festivals",
    icon: "celebration",
    order: 5,
    isActive: true,
  },
  {
    name: "Concerts & Shows",
    slug: "concerts",
    type: "event",
    description: "Live music and performances",
    icon: "music",
    order: 6,
    isActive: true,
  },
];

// Venues (Hyderabad locations with real coordinates)
const venues = [
  {
    name: "Charminar",
    slug: "charminar-old-city",
    status: "published",
    category: {
      primary: "cultural",
      subcategory: "monument",
    },
    location: {
      type: "Point",
      coordinates: [78.4747, 17.3616], // [longitude, latitude]
    },
    address: {
      fullAddress: "Charminar Road, Char Kaman, Ghansi Bazaar, Hyderabad",
      street: "Charminar Road",
      neighborhood: "Old City",
      city: "Hyderabad",
      state: "Telangana",
      postalCode: "500002",
      country: "India",
    },
    operationalDetails: {
      openingHours: [
        {
          day: "monday",
          isOpen: true,
          slots: [{ open: "09:00", close: "17:30" }],
        },
        {
          day: "tuesday",
          isOpen: true,
          slots: [{ open: "09:00", close: "17:30" }],
        },
        {
          day: "wednesday",
          isOpen: true,
          slots: [{ open: "09:00", close: "17:30" }],
        },
        {
          day: "thursday",
          isOpen: true,
          slots: [{ open: "09:00", close: "17:30" }],
        },
        {
          day: "friday",
          isOpen: true,
          slots: [{ open: "09:00", close: "17:30" }],
        },
        {
          day: "saturday",
          isOpen: true,
          slots: [{ open: "09:00", close: "17:30" }],
        },
        {
          day: "sunday",
          isOpen: true,
          slots: [{ open: "09:00", close: "17:30" }],
        },
      ],
      averageVisitDuration: 60,
      bestTimeToVisit: ["early_morning", "evening"],
    },
    ratings: {
      overall: 4.5,
      totalReviews: 15000,
      breakdown: {
        cleanliness: 3.5,
        ambiance: 5,
        service: 4,
        valueForMoney: 5,
        accessibility: 3,
      },
    },
    pricing: {
      level: "$",
      entryFee: 5,
      isFree: false,
    },
    attributes: {
      amenities: ["parking", "wheelchair_accessible"],
      vibe: ["instagrammable", "family_friendly"],
      crowdLevel: {
        typical: "very_high",
        peakHours: ["10:00-12:00", "16:00-18:00"],
      },
      suitableFor: ["solo", "couples", "families", "groups"],
      activityType: ["culture", "education"],
      weatherDependent: true,
      indoorOutdoor: "outdoor",
    },
    media: {
      coverImage: "https://example.com/charminar.jpg",
      images: [
        "https://example.com/charminar1.jpg",
        "https://example.com/charminar2.jpg",
      ],
    },
    tags: ["heritage", "monument", "iconic", "photography", "history"],
    keywords: ["charminar", "hyderabad icon", "old city"],
    itineraryMeta: {
      position: ["morning_start", "afternoon_activity"],
      requiredTimeBefore: 30,
    },
  },
  {
    name: "Hussain Sagar Lake",
    slug: "hussain-sagar-lake",
    status: "published",
    category: {
      primary: "park",
      subcategory: "lake",
    },
    location: {
      type: "Point",
      coordinates: [78.4744, 17.4239],
    },
    address: {
      fullAddress: "Tank Bund Road, Hyderabad",
      street: "Tank Bund Road",
      neighborhood: "Secunderabad",
      city: "Hyderabad",
      state: "Telangana",
      postalCode: "500080",
      country: "India",
    },
    operationalDetails: {
      openingHours: [
        {
          day: "monday",
          isOpen: true,
          slots: [{ open: "06:00", close: "21:00" }],
        },
        {
          day: "tuesday",
          isOpen: true,
          slots: [{ open: "06:00", close: "21:00" }],
        },
        {
          day: "wednesday",
          isOpen: true,
          slots: [{ open: "06:00", close: "21:00" }],
        },
        {
          day: "thursday",
          isOpen: true,
          slots: [{ open: "06:00", close: "21:00" }],
        },
        {
          day: "friday",
          isOpen: true,
          slots: [{ open: "06:00", close: "21:00" }],
        },
        {
          day: "saturday",
          isOpen: true,
          slots: [{ open: "06:00", close: "21:00" }],
        },
        {
          day: "sunday",
          isOpen: true,
          slots: [{ open: "06:00", close: "21:00" }],
        },
      ],
      averageVisitDuration: 90,
      bestTimeToVisit: ["early_morning", "evening"],
    },
    ratings: {
      overall: 4.3,
      totalReviews: 8500,
      breakdown: {
        cleanliness: 3.8,
        ambiance: 4.5,
        accessibility: 4,
      },
    },
    pricing: {
      level: "$",
      isFree: true,
    },
    attributes: {
      amenities: ["parking", "outdoor_seating"],
      vibe: ["relaxing", "romantic", "family_friendly"],
      crowdLevel: {
        typical: "moderate",
        peakHours: ["17:00-19:00"],
      },
      suitableFor: ["couples", "families", "groups"],
      activityType: ["relaxation"],
      weatherDependent: true,
      indoorOutdoor: "outdoor",
    },
    tags: ["lake", "boating", "walking", "sunset", "buddha_statue"],
    keywords: ["hussain sagar", "tank bund", "boating"],
    itineraryMeta: {
      position: ["evening_destination"],
      requiredTimeBefore: 20,
    },
  },
  {
    name: "Concu - The Cake Shop",
    slug: "concu-cake-shop-jubilee-hills",
    status: "published",
    category: {
      primary: "cafe",
      subcategory: "bakery",
    },
    location: {
      type: "Point",
      coordinates: [78.4063, 17.4316],
    },
    address: {
      fullAddress: "Road No 36, Jubilee Hills, Hyderabad",
      street: "Road No 36",
      neighborhood: "Jubilee Hills",
      city: "Hyderabad",
      state: "Telangana",
      postalCode: "500033",
      country: "India",
    },
    operationalDetails: {
      openingHours: [
        {
          day: "monday",
          isOpen: true,
          slots: [{ open: "08:00", close: "22:00" }],
        },
        {
          day: "tuesday",
          isOpen: true,
          slots: [{ open: "08:00", close: "22:00" }],
        },
        {
          day: "wednesday",
          isOpen: true,
          slots: [{ open: "08:00", close: "22:00" }],
        },
        {
          day: "thursday",
          isOpen: true,
          slots: [{ open: "08:00", close: "22:00" }],
        },
        {
          day: "friday",
          isOpen: true,
          slots: [{ open: "08:00", close: "23:00" }],
        },
        {
          day: "saturday",
          isOpen: true,
          slots: [{ open: "08:00", close: "23:00" }],
        },
        {
          day: "sunday",
          isOpen: true,
          slots: [{ open: "08:00", close: "23:00" }],
        },
      ],
      phoneNumber: "+914023555666",
      websiteUrl: "https://concu.in",
      socialMedia: {
        instagram: "@concucakeshop",
      },
      averageVisitDuration: 60,
      bestTimeToVisit: ["morning", "afternoon"],
    },
    ratings: {
      overall: 4.6,
      totalReviews: 2340,
      breakdown: {
        cleanliness: 4.5,
        ambiance: 4.7,
        service: 4.4,
        valueForMoney: 4.2,
        accessibility: 4.8,
      },
    },
    pricing: {
      level: "$$",
      range: {
        min: 300,
        max: 1000,
        currency: "INR",
      },
      isFree: false,
    },
    attributes: {
      amenities: ["wifi", "ac", "card_accepted", "outdoor_seating"],
      vibe: ["cozy", "instagrammable", "trendy"],
      crowdLevel: {
        typical: "moderate",
        peakHours: ["11:00-13:00", "16:00-18:00"],
      },
      suitableFor: ["couples", "groups", "business"],
      activityType: ["dining"],
      weatherDependent: false,
      indoorOutdoor: "both",
    },
    tags: ["cakes", "desserts", "coffee", "breakfast", "brunch"],
    keywords: ["concu", "cake shop", "jubilee hills"],
    itineraryMeta: {
      position: ["morning_start", "afternoon_activity"],
      canCombineWith: ["shopping", "entertainment"],
      requiredTimeBefore: 15,
    },
  },
  {
    name: "Salar Jung Museum",
    slug: "salar-jung-museum",
    status: "published",
    category: {
      primary: "museum",
      subcategory: "art_museum",
    },
    location: {
      type: "Point",
      coordinates: [78.48, 17.3713],
    },
    address: {
      fullAddress: "Salar Jung Road, Darulshifa, Hyderabad",
      street: "Salar Jung Road",
      neighborhood: "Darulshifa",
      city: "Hyderabad",
      state: "Telangana",
      postalCode: "500002",
      country: "India",
    },
    operationalDetails: {
      openingHours: [
        { day: "monday", isOpen: false },
        {
          day: "tuesday",
          isOpen: true,
          slots: [{ open: "10:00", close: "17:00" }],
        },
        {
          day: "wednesday",
          isOpen: true,
          slots: [{ open: "10:00", close: "17:00" }],
        },
        {
          day: "thursday",
          isOpen: true,
          slots: [{ open: "10:00", close: "17:00" }],
        },
        { day: "friday", isOpen: false },
        {
          day: "saturday",
          isOpen: true,
          slots: [{ open: "10:00", close: "17:00" }],
        },
        {
          day: "sunday",
          isOpen: true,
          slots: [{ open: "10:00", close: "17:00" }],
        },
      ],
      phoneNumber: "+914024521211",
      websiteUrl: "http://www.salarjungmuseum.in",
      averageVisitDuration: 150,
      bestTimeToVisit: ["morning", "afternoon", "weekdays"],
    },
    ratings: {
      overall: 4.4,
      totalReviews: 12000,
      breakdown: {
        cleanliness: 4.2,
        ambiance: 4.6,
        service: 4.1,
        valueForMoney: 4.5,
        accessibility: 3.8,
      },
    },
    pricing: {
      level: "$",
      entryFee: 50,
      isFree: false,
    },
    attributes: {
      amenities: ["parking", "wheelchair_accessible"],
      vibe: ["quiet", "family_friendly"],
      crowdLevel: {
        typical: "moderate",
        peakHours: ["11:00-13:00"],
      },
      suitableFor: ["solo", "families", "groups", "elderly"],
      activityType: ["culture", "education"],
      weatherDependent: false,
      indoorOutdoor: "indoor",
    },
    tags: ["museum", "art", "history", "artifacts", "education"],
    keywords: ["salar jung", "museum", "antiques"],
    itineraryMeta: {
      position: ["morning_start", "afternoon_activity"],
      requiredTimeBefore: 30,
    },
  },
  {
    name: "Inorbit Mall",
    slug: "inorbit-mall-madhapur",
    status: "published",
    category: {
      primary: "shopping",
      subcategory: "mall",
    },
    location: {
      type: "Point",
      coordinates: [78.3893, 17.4357],
    },
    address: {
      fullAddress: "Mindspace, HITEC City, Madhapur, Hyderabad",
      street: "Mindspace",
      neighborhood: "Madhapur",
      city: "Hyderabad",
      state: "Telangana",
      postalCode: "500081",
      country: "India",
    },
    operationalDetails: {
      openingHours: [
        {
          day: "monday",
          isOpen: true,
          slots: [{ open: "11:00", close: "22:00" }],
        },
        {
          day: "tuesday",
          isOpen: true,
          slots: [{ open: "11:00", close: "22:00" }],
        },
        {
          day: "wednesday",
          isOpen: true,
          slots: [{ open: "11:00", close: "22:00" }],
        },
        {
          day: "thursday",
          isOpen: true,
          slots: [{ open: "11:00", close: "22:00" }],
        },
        {
          day: "friday",
          isOpen: true,
          slots: [{ open: "11:00", close: "23:00" }],
        },
        {
          day: "saturday",
          isOpen: true,
          slots: [{ open: "11:00", close: "23:00" }],
        },
        {
          day: "sunday",
          isOpen: true,
          slots: [{ open: "11:00", close: "23:00" }],
        },
      ],
      phoneNumber: "+914044332288",
      websiteUrl: "https://www.inorbit.in",
      averageVisitDuration: 180,
      bestTimeToVisit: ["afternoon", "evening", "weekdays"],
    },
    ratings: {
      overall: 4.3,
      totalReviews: 18500,
      breakdown: {
        cleanliness: 4.5,
        ambiance: 4.4,
        service: 4.2,
        valueForMoney: 4.0,
        accessibility: 4.7,
      },
    },
    pricing: {
      level: "$$",
      range: {
        min: 500,
        max: 5000,
        currency: "INR",
      },
      isFree: true,
    },
    attributes: {
      amenities: [
        "wifi",
        "parking",
        "wheelchair_accessible",
        "kids_area",
        "ac",
        "charging_point",
      ],
      vibe: ["lively", "family_friendly", "trendy"],
      crowdLevel: {
        typical: "high",
        peakHours: ["18:00-21:00"],
      },
      suitableFor: ["couples", "families", "groups"],
      activityType: ["shopping", "dining", "entertainment"],
      weatherDependent: false,
      indoorOutdoor: "indoor",
    },
    tags: ["shopping", "mall", "brands", "food_court", "movies"],
    keywords: ["inorbit", "madhapur mall", "hitec city"],
    itineraryMeta: {
      position: ["afternoon_activity", "evening_destination"],
      canCombineWith: ["cafe", "restaurant"],
      requiredTimeBefore: 25,
    },
  },
];

// Events
const events = [
  {
    name: "Hyderabad Food Festival 2025",
    slug: "hyderabad-food-festival-2025",
    status: "upcoming",
    description: {
      short:
        "A celebration of Hyderabadi and global cuisines with live cooking shows and tastings",
      full: "Join us for the biggest food festival in Hyderabad featuring celebrity chefs, food stalls from 100+ vendors, live music, and cooking competitions.",
      highlights: [
        "100+ food vendors",
        "Live cooking shows",
        "Celebrity chefs",
        "Kids zone",
      ],
    },
    schedule: {
      startDate: new Date("2025-12-15"),
      endDate: new Date("2025-12-17"),
      isRecurring: false,
      timings: [
        { date: new Date("2025-12-15"), startTime: "16:00", endTime: "22:00" },
        { date: new Date("2025-12-16"), startTime: "16:00", endTime: "22:00" },
        { date: new Date("2025-12-17"), startTime: "16:00", endTime: "22:00" },
      ],
    },
    location: {
      type: "Point",
      coordinates: [78.4041, 17.4399],
    },
    venueName: "Shilparamam Cultural Village",
    address: {
      fullAddress: "Shilparamam, Madhapur, Hyderabad",
      neighborhood: "Madhapur",
      city: "Hyderabad",
      state: "Telangana",
    },
    category: {
      primary: "festival",
      subcategory: "food_festival",
      genre: ["cultural", "entertainment"],
    },
    ticketing: {
      isFree: false,
      tickets: [
        { type: "general", price: 200, currency: "INR", available: true },
        { type: "vip", price: 500, currency: "INR", available: true },
        { type: "group", price: 150, currency: "INR", available: true },
      ],
      registrationRequired: false,
    },
    capacity: {
      total: 10000,
      expectedAttendance: 8000,
      ageRestriction: "all_ages",
    },
    organizer: {
      name: "Hyderabad Events & Tourism",
      contact: {
        phone: "+914023456789",
        email: "info@hydfoodfest.com",
        website: "https://hydfoodfest.com",
      },
    },
    attributes: {
      targetAudience: ["families", "young_adults", "professionals"],
      suitableFor: ["couples", "groups", "families"],
      eventType: ["outdoor"],
      vibeEnergy: "high_energy",
      weatherDependent: true,
    },
    media: {
      posterImage: "https://example.com/food-fest-poster.jpg",
      images: [
        "https://example.com/food1.jpg",
        "https://example.com/food2.jpg",
      ],
    },
    itineraryMeta: {
      duration: 180,
      bestTimeSlot: ["evening"],
      canCombineWith: ["shopping"],
    },
    tags: ["food", "festival", "cuisine", "family", "entertainment"],
    keywords: ["hyderabad food festival", "food carnival"],
  },
];

// Sample Itinerary
const itineraries = [
  {
    userId: "+919876543210",
    requestDetails: {
      city: "Hyderabad",
      date: new Date("2025-11-10"),
      duration: "full_day",
      preferences: {
        interests: ["culture", "food"],
        budget: "medium",
        groupType: "family",
        pace: "relaxed",
      },
    },
    plan: [
      {
        sequence: 1,
        timeSlot: "09:00-10:30",
        venueName: "Charminar",
        activity: "Visit the iconic Charminar monument",
        duration: 90,
        reasoning: "Start the day with Hyderabad's most iconic landmark",
        travelInfo: {
          toNextVenue: {
            distance: 1.5,
            estimatedTime: 15,
            mode: "auto",
          },
        },
      },
      {
        sequence: 2,
        timeSlot: "11:00-13:00",
        venueName: "Salar Jung Museum",
        activity: "Explore art and artifacts",
        duration: 120,
        reasoning: "Nearby cultural attraction perfect for families",
        travelInfo: {
          toNextVenue: {
            distance: 8.2,
            estimatedTime: 25,
            mode: "auto",
          },
        },
      },
    ],
    status: "completed",
    totalDistance: 9.7,
    totalDuration: 330,
    estimatedCost: {
      min: 500,
      max: 1500,
      currency: "INR",
    },
  },
];

// Seed function
const seedDatabase = async () => {
  try {
    console.log("🌱 Starting database seeding...\n");

    // Connect to database
    await connectDB();

    // Clear existing data
    console.log("🗑️  Clearing existing data...");
    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Venue.deleteMany({}),
      Event.deleteMany({}),
      Itinerary.deleteMany({}),
    ]);
    console.log("✅ Existing data cleared\n");

    // Insert Users
    console.log("👤 Seeding users...");
    const insertedUsers = await User.insertMany(users);
    console.log(`✅ ${insertedUsers.length} users created\n`);

    // Insert Categories
    console.log("📁 Seeding categories...");
    const insertedCategories = await Category.insertMany(categories);
    console.log(`✅ ${insertedCategories.length} categories created\n`);

    // Add user references to venues
    const adminUser = insertedUsers.find((u) => u.role === "admin");
    venues.forEach((venue) => {
      venue.admin = {
        ...venue.admin,
        addedBy: adminUser._id,
        verifiedBy: adminUser._id,
        lastVerified: new Date(),
        dataQuality: "verified",
      };
    });

    // Insert Venues
    console.log("📍 Seeding venues...");
    const insertedVenues = await Venue.insertMany(venues);
    console.log(`✅ ${insertedVenues.length} venues created\n`);

    // Add user references and venue references to events
    events.forEach((event) => {
      event.admin = {
        ...event.admin,
        addedBy: adminUser._id,
        verifiedBy: adminUser._id,
        lastVerified: new Date(),
      };
      // Link to Shilparamam if we had it in venues
      const linkedVenue = insertedVenues.find((v) =>
        v.name.includes("Shilparamam")
      );
      if (linkedVenue) {
        event.venueId = linkedVenue._id;
      }
    });

    // Insert Events
    console.log("🎉 Seeding events...");
    const insertedEvents = await Event.insertMany(events);
    console.log(`✅ ${insertedEvents.length} events created\n`);

    // Add venue references to itineraries
    itineraries.forEach((itinerary) => {
      itinerary.plan.forEach((item) => {
        const venue = insertedVenues.find((v) => v.name === item.venueName);
        if (venue) {
          item.venueId = venue._id;
        }
      });
    });

    // Insert Itineraries
    console.log("🗺️  Seeding itineraries...");
    const insertedItineraries = await Itinerary.insertMany(itineraries);
    console.log(`✅ ${insertedItineraries.length} itineraries created\n`);

    // Summary
    console.log("✨ Database seeding completed successfully!\n");
    console.log("📊 Summary:");
    console.log(`   - Users: ${insertedUsers.length}`);
    console.log(`   - Categories: ${insertedCategories.length}`);
    console.log(`   - Venues: ${insertedVenues.length}`);
    console.log(`   - Events: ${insertedEvents.length}`);
    console.log(`   - Itineraries: ${insertedItineraries.length}`);
    console.log(
      "\n🎯 You can now connect Moon Modeler to see the complete schema!\n"
    );

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

// Run seeding
seedDatabase();
