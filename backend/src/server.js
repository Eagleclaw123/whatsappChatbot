import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import mongoose from "mongoose";

import connectDB from "./config/database.js";
import models from "./models/index.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Root / misc routes to reduce noisy 404s
app.get("/", (req, res) => {
  res.status(200).send("WhatsApp chatbot server is running");
});

app.get("/favicon.ico", (req, res) => {
  res.status(204).end();
});

// WhatsApp Webhook Verification (GET)
app.get("/webhook/whatsapp", (req, res) => {
  console.log("hitting endpoint");

  const VERIFY_TOKEN =
    process.env.WHATSAPP_VERIFY_TOKEN || "myverificationsecret";
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token) {
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("✅ WhatsApp webhook verified");
      return res.status(200).send(challenge);
    } else {
      console.log("❌ WhatsApp webhook verification failed");
      return res.sendStatus(403);
    }
  }

  return res.sendStatus(400);
});

// Route-specific RAW parser for webhook debugging
app.post(
  "/webhook/whatsapp",
  express.urlencoded({ extended: true }),
  express.json(),
  (req, res) => {
    try {
      console.log("========== WHATSAPP WEBHOOK START ==========");
      console.log("Method:", req.method);
      console.log("URL:", req.originalUrl);
      console.log("Headers:", JSON.stringify(req.headers, null, 2));
      console.log("Content-Type:", req.headers["content-type"] || "N/A");
      console.log("Parsed Body:", JSON.stringify(req.body, null, 2));

      const body = req.body || {};

      // Handle URL-encoded provider format
      if (body.from || body.to || body.text || body.Message_ID) {
        console.log("✅ URL-encoded webhook received");
        console.log(`From: ${body.from || "N/A"}`);
        console.log(`To: ${body.to || "N/A"}`);
        console.log(`Text: ${body.text || "N/A"}`);
        console.log(`Message ID: ${body.Message_ID || "N/A"}`);

        return res.status(200).send("EVENT_RECEIVED");
      }

      // Handle native WhatsApp/Meta JSON format too
      if (body.object) {
        const changes = body.entry?.[0]?.changes?.[0];
        const value = changes?.value;
        const messages = value?.messages ?? [];

        if (messages.length > 0) {
          messages.forEach((message) => {
            console.log(
              `📱 Message from ${message.from}: ${message.text?.body || message.type}`,
            );
          });
        } else {
          console.log("ℹ️ JSON webhook received but no messages array present");
        }

        return res.status(200).send("EVENT_RECEIVED");
      }

      console.log("❌ Unknown webhook payload format");
      return res.status(400).json({
        status: "error",
        message: "Unknown webhook payload format",
      });
    } catch (error) {
      console.error("❌ Webhook processing error:", error);
      return res.status(500).json({
        status: "error",
        message: "Internal server error",
        error: error.message,
      });
    }
  },
);

// Global middleware for all other routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Main function to initialize server
const startServer = async () => {
  try {
    await connectDB();

    console.log("\n📋 Registered Models:");
    Object.keys(models).forEach((modelName) => {
      console.log(`   ✓ ${modelName}`);
    });

    console.log("\n🔍 Creating indexes...");
    await Promise.all([
      models.Venue.createIndexes(),
      models.Event.createIndexes(),
      models.Category.createIndexes(),
      models.User.createIndexes(),
      models.Itinerary.createIndexes(),
    ]);
    console.log("✅ All indexes created successfully");

    const venueCount = await models.Venue.countDocuments();
    if (venueCount === 0) {
      console.log("\n🌱 Database is empty. You can now:");
      console.log("   1. Use the admin panel to add data");
      console.log("   2. Connect Moon Modeler to visualize the schema");
      console.log("   3. Import seed data via API");
    } else {
      console.log(`\n📊 Database contains ${venueCount} venues`);
    }

    app.get("/health", (req, res) => {
      res.json({
        status: "ok",
        database: "connected",
        models: Object.keys(models),
        timestamp: new Date().toISOString(),
      });
    });

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

    // Final 404 handler
    app.use((req, res) => {
      res.status(404).json({
        status: "error",
        message: "Route not found",
      });
    });

    app.listen(PORT, () => {
      console.log(`\n🚀 Server running on port ${PORT}`);
      console.log(`\n📍 Endpoints:`);
      console.log(`   Root: http://localhost:${PORT}/`);
      console.log(`   Health: http://localhost:${PORT}/health`);
      console.log(`   Schema: http://localhost:${PORT}/schema`);
      console.log(
        `   WhatsApp Webhook: http://localhost:${PORT}/webhook/whatsapp`,
      );

      if (process.env.MONGODB_URI) {
        console.log(
          `\n💡 Your MongoDB URI: ${process.env.MONGODB_URI.replace(
            /\/\/.*@/,
            "//***:***@",
          )}`,
        );
      }

      console.log(`\n✨ Ready to connect Moon Modeler!`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on("SIGINT", async () => {
  try {
    console.log("\n\n⏸️  Shutting down gracefully...");
    await mongoose.connection.close();
    console.log("✅ MongoDB connection closed");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error while shutting down:", error);
    process.exit(1);
  }
});

process.on("SIGTERM", async () => {
  try {
    console.log("\n\n⏸️  SIGTERM received. Shutting down gracefully...");
    await mongoose.connection.close();
    console.log("✅ MongoDB connection closed");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error while shutting down:", error);
    process.exit(1);
  }
});

startServer();
