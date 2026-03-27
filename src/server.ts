import "dotenv/config"; // Must be first — loads .env before anything else
import { env } from "./config/env";
import { logger } from "./config/logger";
import { connectDatabase, disconnectDatabase } from "./config/database";
import app from "./app";

// ================================
// SERVER ENTRY POINT
// Starts the HTTP server and handles graceful shutdown.
//
// Graceful shutdown means:
//   1. Stop accepting new requests
//   2. Wait for in-flight requests to finish
//   3. Close DB connections cleanly
// This prevents data corruption during deployments.
// ================================

const startServer = async () => {
  try {
    // Connect to database first — if this fails, don't start the server
    await connectDatabase();
    logger.info("✅ Database connected");

    const server = app.listen(env.PORT, () => {
      logger.info(
        `🚀 Server running on port ${env.PORT} in ${env.NODE_ENV} mode`,
      );
      logger.info(`📍 Health check: http://localhost:${env.PORT}/health`);
    });

    // ================================
    // GRACEFUL SHUTDOWN
    // Handles: Ctrl+C (SIGINT), systemd stop (SIGTERM), nodemon restart (SIGUSR2)
    // ================================
    const gracefulShutdown = async (signal: string) => {
      logger.info(`\n${signal} received. Starting graceful shutdown...`);

      // Stop accepting new connections
      server.close(async () => {
        logger.info("HTTP server closed");

        // Close database connection
        await disconnectDatabase();
        logger.info("Database disconnected");

        logger.info("Graceful shutdown complete");
        process.exit(0);
      });

      // Force shutdown after 30 seconds if graceful shutdown takes too long
      setTimeout(() => {
        logger.error("Graceful shutdown timed out. Forcing exit.");
        process.exit(1);
      }, 30_000);
    };

    process.on("SIGTERM", () => gracefulShutdown("SIGTERM")); // systemd stop
    process.on("SIGINT", () => gracefulShutdown("SIGINT")); // Ctrl+C

    // Handle uncaught errors — log them but don't crash
    process.on("unhandledRejection", (reason: unknown) => {
      logger.error("Unhandled Promise Rejection:", reason);
    });

    process.on("uncaughtException", (error: Error) => {
      logger.error("Uncaught Exception:", error);
      // Uncaught exceptions leave the app in an unknown state — must exit
      process.exit(1);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

void startServer();
