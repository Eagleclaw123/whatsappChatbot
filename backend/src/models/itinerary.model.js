import mongoose from "mongoose";

const { Schema } = mongoose;

// Travel Info Schema
const travelInfoSchema = new Schema(
  {
    toNextVenue: {
      distance: Number, // in km
      estimatedTime: Number, // in minutes
      mode: {
        type: String,
        enum: ["walk", "drive", "auto", "metro", "bus"],
      },
    },
  },
  { _id: false }
);

// Itinerary Item Schema
const itineraryItemSchema = new Schema(
  {
    sequence: {
      type: Number,
      required: true,
    },
    timeSlot: String, // "09:00-11:00"
    venueId: {
      type: Schema.Types.ObjectId,
      ref: "Venue",
    },
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
    },
    venueName: String,
    activity: String, // "Breakfast at...", "Visit..."
    duration: Number, // minutes
    reasoning: String, // Why AI suggested this
    travelInfo: travelInfoSchema,
  },
  { _id: false }
);

// User Feedback Schema
const feedbackSchema = new Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    followed: Boolean,
    comments: String,
    submittedAt: Date,
  },
  { _id: false }
);

// Main Itinerary Schema
const itinerarySchema = new Schema(
  {
    userId: {
      type: String, // WhatsApp phone number or user ID
      required: true,
      index: true,
    },

    // Request Details
    requestDetails: {
      city: {
        type: String,
        required: true,
        index: true,
      },
      date: Date,
      duration: {
        type: String,
        enum: ["half_day", "full_day", "evening", "custom"],
        default: "full_day",
      },
      preferences: {
        interests: [
          {
            type: String,
            enum: [
              "culture",
              "food",
              "shopping",
              "entertainment",
              "nature",
              "sports",
              "history",
              "nightlife",
            ],
          },
        ],
        budget: {
          type: String,
          enum: ["low", "medium", "high", "luxury"],
          default: "medium",
        },
        groupType: {
          type: String,
          enum: ["solo", "couple", "family", "friends", "group"],
          default: "solo",
        },
        pace: {
          type: String,
          enum: ["relaxed", "moderate", "packed"],
          default: "moderate",
        },
      },
    },

    // Generated Plan
    plan: [itineraryItemSchema],

    // Metadata
    generatedAt: {
      type: Date,
      default: Date.now,
    },
    aiModel: String, // "gpt-4", "claude", etc.
    userFeedback: feedbackSchema,
    status: {
      type: String,
      enum: ["generated", "in_progress", "completed", "abandoned"],
      default: "generated",
      index: true,
    },

    // Analytics
    totalDistance: Number, // km
    totalDuration: Number, // minutes
    estimatedCost: {
      min: Number,
      max: Number,
      currency: { type: String, default: "INR" },
    },
  },
  {
    timestamps: true,
    collection: "itineraries",
  }
);

// Indexes
itinerarySchema.index({ userId: 1, createdAt: -1 });
itinerarySchema.index({ "requestDetails.city": 1, status: 1 });

const Itinerary = mongoose.model("Itinerary", itinerarySchema);

export default Itinerary;
