import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import models from "./models/index.js";
import morgan from "morgan";
// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(morgan("dev"));

// Main function to initialize server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Log all registered models
    console.log("\n📋 Registered Models:");
    Object.keys(models).forEach((modelName) => {
      console.log(`   ✓ ${modelName}`);
    });

    // Create indexes explicitly (Mongoose does this automatically, but explicit is better)
    console.log("\n🔍 Creating indexes...");
    await Promise.all([
      models.Venue.createIndexes(),
      models.Event.createIndexes(),
      models.Category.createIndexes(),
      models.User.createIndexes(),
      models.Itinerary.createIndexes(),
    ]);
    console.log("✅ All indexes created successfully");

    // Optional: Seed some sample data to test
    const venueCount = await models.Venue.countDocuments();
    if (venueCount === 0) {
      console.log("\n🌱 Database is empty. You can now:");
      console.log("   1. Use the admin panel to add data");
      console.log("   2. Connect Moon Modeler to visualize the schema");
      console.log("   3. Import seed data via API");
    } else {
      console.log(`\n📊 Database contains ${venueCount} venues`);
    }

    // Simple health check endpoint
    app.get("/health", (req, res) => {
      res.json({
        status: "ok",
        database: "connected",
        models: Object.keys(models),
        timestamp: new Date().toISOString(),
      });
    });

    // WhatsApp Webhook Verification (GET)
    app.get("/webhook/whatsapp", (req, res) => {
      console.log("hitting endpoint");
      const VERIFY_TOKEN = "myverificationsecret";

      const mode = req.query["hub.mode"];
      const token = req.query["hub.verify_token"];
      const challenge = req.query["hub.challenge"];

      if (mode && token) {
        if (mode === "subscribe" && token === VERIFY_TOKEN) {
          console.log("✅ WhatsApp webhook verified");
          res.status(200).send(challenge);
        } else {
          console.log("❌ WhatsApp webhook verification failed");
          res.sendStatus(403);
        }
      } else {
        res.sendStatus(400);
      }
    });

    // WhatsApp Webhook Events (POST)
    app.post("/webhook/whatsapp", (req, res) => {
      const body = req.body;

      console.log(
        "📨 WhatsApp webhook received:",
        JSON.stringify(body, null, 2),
      );

      // Check if this is a WhatsApp message event
      if (body.object) {
        if (
          body.entry &&
          body.entry[0].changes &&
          body.entry[0].changes[0].value.messages
        ) {
          const messages = body.entry[0].changes[0].value.messages;

          messages.forEach((message) => {
            console.log(
              `📱 Message from ${message.from}: ${message.text?.body || message.type}`,
            );

            // Add your message processing logic here
            // For example: save to database, trigger actions, etc.
          });
        }

        res.status(200).send("EVENT_RECEIVED");
      } else {
        res.sendStatus(404);
      }
    });

    // Get schema info endpoint
    app.get("/schema", (req, res) => {
      const schemaInfo = {};
      Object.keys(models).forEach((modelName) => {
        const model = models[modelName];
        schemaInfo[modelName] = {
          collection: model.collection.name,
          fields: Object.keys(model.schema.paths),
          indexes: model.schema.indexes(),
        };
      });
      res.json(schemaInfo);
    });

    // Start server
    app.listen(PORT, () => {
      console.log(`\n🚀 Server running on port ${PORT}`);
      console.log(`\n📍 Endpoints:`);
      console.log(`   Health: http://localhost:${PORT}/health`);
      console.log(`   Schema: http://localhost:${PORT}/schema`);
      console.log(
        `   WhatsApp Webhook: http://localhost:${PORT}/webhook/whatsapp`,
      );
      console.log(
        `\n💡 Your MongoDB URI: ${process.env.MONGODB_URI.replace(
          /\/\/.*@/,
          "//***:***@",
        )}`,
      );
      console.log(`\n✨ Ready to connect Moon Modeler!`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n\n⏸️  Shutting down gracefully...");
  await mongoose.connection.close();
  console.log("✅ MongoDB connection closed");
  process.exit(0);
});

// Start the server
startServer();
