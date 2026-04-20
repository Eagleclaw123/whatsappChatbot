import Venue from "./venue.model.js";
import Event from "./event.model.js";
import Category from "./category.model.js";
import User from "./user.model.js";
import Itinerary from "./itinerary.model.js";

// This file imports all models so they get registered with Mongoose
// when you import from this file, all models will be initialized

export { Venue, Event, Category, User, Itinerary };

// Export default for easy importing
export default {
  Venue,
  Event,
  Category,
  User,
  Itinerary,
};
