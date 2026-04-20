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
      type: [Number],
      required: true,
    },
  },
  { _id: false }
);

// Address Schema
const addressSchema = new Schema(
  {
    fullAddress: String,
    neighborhood: String,
    city: { type: String, required: true },
    state: String,
  },
  { _id: false }
);

// Ticket Schema
const ticketSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["general", "vip", "early_bird", "student", "senior", "group"],
      required: true,
    },
    price: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    available: { type: Boolean, default: true },
    bookingUrl: String,
  },
  { _id: false }
);

// Schedule Timing Schema
const timingSchema = new Schema(
  {
    date: Date,
    startTime: String, // "18:00"
    endTime: String, // "22:00"
  },
  { _id: false }
);

// Event Schema
const eventSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Event name is required"],
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
      enum: ["upcoming", "ongoing", "completed", "cancelled"],
      default: "upcoming",
      index: true,
    },

    // Event Details
    description: {
      short: {
        type: String,
        maxlength: 200,
      },
      full: String,
      highlights: [String],
    },

    // Schedule
    schedule: {
      startDate: {
        type: Date,
        required: true,
        index: true,
      },
      endDate: {
        type: Date,
        required: true,
        index: true,
      },
      isRecurring: { type: Boolean, default: false },
      recurrencePattern: {
        type: String,
        enum: ["daily", "weekly", "monthly", "yearly"],
      },
      specificDates: [Date],
      timings: [timingSchema],
    },

    // Location
    location: {
      type: pointSchema,
      required: true,
      index: "2dsphere",
    },
    venueId: {
      type: Schema.Types.ObjectId,
      ref: "Venue",
    },
    venueName: String,
    address: addressSchema,

    // Categorization
    category: {
      primary: {
        type: String,
        required: true,
        enum: [
          "festival",
          "concert",
          "exhibition",
          "workshop",
          "sports",
          "conference",
          "fair",
          "performance",
        ],
        index: true,
      },
      subcategory: String,
      genre: [
        {
          type: String,
          enum: [
            "cultural",
            "entertainment",
            "educational",
            "religious",
            "sports",
            "business",
            "social",
          ],
        },
      ],
    },

    // Ticketing
    ticketing: {
      isFree: { type: Boolean, default: false },
      tickets: [ticketSchema],
      registrationRequired: { type: Boolean, default: false },
      registrationUrl: String,
    },

    // Capacity
    capacity: {
      total: Number,
      expectedAttendance: Number,
      ageRestriction: {
        type: String,
        enum: ["all_ages", "13+", "18+", "21+"],
        default: "all_ages",
      },
    },

    // Organizer
    organizer: {
      name: { type: String, required: true },
      contact: {
        phone: String,
        email: String,
        website: String,
      },
    },

    // AI-Optimized Attributes
    attributes: {
      targetAudience: [
        {
          type: String,
          enum: [
            "families",
            "young_adults",
            "professionals",
            "students",
            "seniors",
            "children",
          ],
        },
      ],
      suitableFor: [
        {
          type: String,
          enum: ["kids", "couples", "groups", "solo", "corporate", "families"],
        },
      ],
      eventType: [
        {
          type: String,
          enum: ["indoor", "outdoor", "hybrid", "virtual"],
        },
      ],
      vibeEnergy: {
        type: String,
        enum: ["calm", "moderate", "high_energy", "party"],
      },
      weatherDependent: { type: Boolean, default: false },
    },

    // Media
    media: {
      posterImage: String,
      images: [String],
      videos: [String],
      socialMediaLinks: {
        instagram: String,
        facebook: String,
        twitter: String,
      },
    },

    // Itinerary Integration
    itineraryMeta: {
      duration: Number, // minutes
      bestTimeSlot: [
        {
          type: String,
          enum: ["morning", "afternoon", "evening", "night"],
        },
      ],
      canCombineWith: [
        {
          type: String,
          enum: ["dining", "shopping", "sightseeing", "entertainment"],
        },
      ],
      nearbyVenues: [
        {
          type: Schema.Types.ObjectId,
          ref: "Venue",
        },
      ],
    },

    // Tags & Discovery
    tags: {
      type: [String],
      index: true,
    },
    keywords: [String],

    // Admin
    admin: {
      sourceUrl: String,
      lastVerified: Date,
      verifiedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      addedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    },
  },
  {
    timestamps: true,
    collection: "events",
  }
);

// Indexes
eventSchema.index({ "schedule.startDate": 1, "schedule.endDate": 1 });
eventSchema.index({ status: 1, "category.primary": 1 });
eventSchema.index({ name: "text", tags: "text" });

// Pre-save hook for slug
eventSchema.pre("save", function (next) {
  if (this.isModified("name") && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }
  next();
});

const Event = mongoose.model("Event", eventSchema);

export default Event;
