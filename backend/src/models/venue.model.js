import mongoose from "mongoose";

const { Schema } = mongoose;

// Point Schema for GeoJSON
const pointSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
      default: "Point",
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
      validate: {
        validator: function (v) {
          return (
            v.length === 2 &&
            v[0] >= -180 &&
            v[0] <= 180 && // longitude
            v[1] >= -90 &&
            v[1] <= 90
          ); // latitude
        },
        message: "Coordinates must be [longitude, latitude] with valid ranges",
      },
    },
  },
  { _id: false }
);

// Address Schema
const addressSchema = new Schema(
  {
    fullAddress: { type: String, required: true },
    street: String,
    neighborhood: String,
    city: { type: String, required: true },
    state: String,
    postalCode: String,
    country: { type: String, default: "India" },
  },
  { _id: false }
);

// Opening Hours Schema
const openingHoursSchema = new Schema(
  {
    day: {
      type: String,
      enum: [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
      ],
      required: true,
    },
    isOpen: { type: Boolean, default: true },
    slots: [
      {
        open: String, // "09:00"
        close: String, // "18:00"
      },
    ],
  },
  { _id: false }
);

// Main Venue Schema
const venueSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Venue name is required"],
      trim: true,
      index: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["draft", "published", "needs_review", "archived"],
      default: "draft",
      index: true,
    },

    // Category
    category: {
      primary: {
        type: String,
        required: true,
        enum: [
          "cafe",
          "restaurant",
          "playground",
          "museum",
          "park",
          "restroom",
          "shopping",
          "entertainment",
          "sports",
          "cultural",
        ],
        index: true,
      },
      subcategory: String,
    },

    // Geospatial Location
    location: {
      type: pointSchema,
      required: true,
      index: "2dsphere", // Critical for geospatial queries
    },
    address: {
      type: addressSchema,
      required: true,
    },

    // Operational Details
    operationalDetails: {
      openingHours: [openingHoursSchema],
      phoneNumber: String,
      email: {
        type: String,
        lowercase: true,
        trim: true,
      },
      websiteUrl: String,
      socialMedia: {
        instagram: String,
        facebook: String,
        twitter: String,
      },
      averageVisitDuration: {
        type: Number, // in minutes
        min: 15,
        max: 480,
      },
      bestTimeToVisit: [
        {
          type: String,
          enum: [
            "early_morning",
            "morning",
            "afternoon",
            "evening",
            "night",
            "weekdays",
            "weekends",
          ],
        },
      ],
    },

    // Ratings
    ratings: {
      overall: {
        type: Number,
        min: 1,
        max: 5,
        default: 3,
      },
      totalReviews: {
        type: Number,
        default: 0,
      },
      breakdown: {
        cleanliness: { type: Number, min: 1, max: 5 },
        ambiance: { type: Number, min: 1, max: 5 },
        service: { type: Number, min: 1, max: 5 },
        valueForMoney: { type: Number, min: 1, max: 5 },
        accessibility: { type: Number, min: 1, max: 5 },
      },
    },

    // Pricing
    pricing: {
      level: {
        type: String,
        enum: ["$", "$$", "$$$", "$$$$"],
        default: "$$",
      },
      range: {
        min: Number,
        max: Number,
        currency: { type: String, default: "INR" },
      },
      entryFee: Number,
      isFree: { type: Boolean, default: false },
    },

    // AI-Optimized Attributes
    attributes: {
      amenities: [
        {
          type: String,
          enum: [
            "wifi",
            "parking",
            "wheelchair_accessible",
            "kids_area",
            "outdoor_seating",
            "ac",
            "card_accepted",
            "valet_parking",
            "pet_friendly",
            "charging_point",
          ],
        },
      ],
      vibe: [
        {
          type: String,
          enum: [
            "cozy",
            "romantic",
            "family_friendly",
            "business_friendly",
            "lively",
            "quiet",
            "instagrammable",
            "luxurious",
            "casual",
            "trendy",
            "relaxing",
          ],
        },
      ],
      crowdLevel: {
        typical: {
          type: String,
          enum: ["low", "moderate", "high", "very_high"],
        },
        peakHours: [String],
      },
      suitableFor: [
        {
          type: String,
          enum: [
            "solo",
            "couples",
            "families",
            "groups",
            "kids",
            "elderly",
            "pets",
            "business",
          ],
        },
      ],
      activityType: [
        {
          type: String,
          enum: [
            "dining",
            "entertainment",
            "culture",
            "shopping",
            "sports",
            "relaxation",
            "adventure",
            "education",
            "worship",
            "nightlife",
          ],
        },
      ],
      weatherDependent: { type: Boolean, default: false },
      indoorOutdoor: {
        type: String,
        enum: ["indoor", "outdoor", "both"],
        default: "indoor",
      },
    },

    // Media
    media: {
      coverImage: String,
      images: [String],
      videos: [String],
    },

    // Admin & Quality Control
    admin: {
      sourceUrl: String,
      lastVerified: Date,
      verifiedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      dataQuality: {
        type: String,
        enum: ["verified", "unverified", "needs_update"],
        default: "unverified",
      },
      notes: String,
      addedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    },

    // SEO & Discovery
    tags: {
      type: [String],
      index: true,
    },
    keywords: [String],

    // Seasonal Info
    seasonal: {
      isSeasonallyOpen: { type: Boolean, default: false },
      openMonths: [
        {
          type: Number,
          min: 1,
          max: 12,
        },
      ],
      specialEvents: [String],
    },

    // Itinerary Planning Metadata
    itineraryMeta: {
      position: [
        {
          type: String,
          enum: [
            "morning_start",
            "afternoon_activity",
            "evening_destination",
            "night_spot",
            "any_time",
          ],
        },
      ],
      followUpSuggestions: [
        {
          type: Schema.Types.ObjectId,
          ref: "Venue",
        },
      ],
      requiredTimeBefore: Number, // minutes
      canCombineWith: [
        {
          type: String,
          enum: [
            "cafe",
            "restaurant",
            "playground",
            "museum",
            "park",
            "shopping",
            "entertainment",
          ],
        },
      ],
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
    collection: "venues",
  }
);

// Indexes
venueSchema.index({ "category.primary": 1, status: 1 });
venueSchema.index({ status: 1, "admin.lastVerified": -1 });
venueSchema.index({ name: "text", tags: "text", keywords: "text" });

// Pre-save hook to generate slug
venueSchema.pre("save", function (next) {
  if (this.isModified("name") && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }
  next();
});

// Virtual for full display name
venueSchema.virtual("displayName").get(function () {
  return `${this.name} - ${this.address.neighborhood}`;
});

const Venue = mongoose.model("Venue", venueSchema);

export default Venue;
