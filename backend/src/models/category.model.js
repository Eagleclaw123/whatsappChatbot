import mongoose from "mongoose";

const { Schema } = mongoose;

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["venue", "event"],
      required: true,
      index: true,
    },
    description: String,
    icon: String, // Icon name or URL
    parentCategory: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    metadata: {
      defaultVisitDuration: Number, // minutes
      typicalCrowdLevel: {
        type: String,
        enum: ["low", "moderate", "high"],
      },
      commonTags: [String],
    },
  },
  {
    timestamps: true,
    collection: "categories",
  }
);

// Indexes
categorySchema.index({ type: 1, isActive: 1 });

const Category = mongoose.model("Category", categorySchema);

export default Category;
