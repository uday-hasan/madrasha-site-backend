import swaggerJsdoc from "swagger-jsdoc";
import { env } from "./env";

// ================================
// SWAGGER / OPENAPI CONFIGURATION
// Auto-generates API docs from JSDoc comments in route files.
// Available at /api/v1/docs
// ================================

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Madrasha Darul Arqam API",
      version: "1.0.0",
      description: "Production grade REST API for Madrasha Darul Arqam",
      contact: {
        name: "API Support",
        email: "support@madrasadarularqam.org",
      },
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}/api/${env.API_VERSION}`,
        description: "Development server",
      },
      {
        url: `https://api-staging.madrasadarularqam.org/api/${env.API_VERSION}`,
        description: "Staging server",
      },
      {
        url: `https://api.madrasadarularqam.org/api/${env.API_VERSION}`,
        description: "Production server",
      },
    ],
    components: {
      securitySchemes: {
        // Cookie-based auth — browser sends cookies automatically
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "accessToken",
        },
      },
      schemas: {
        // Reusable success response schema
        SuccessResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Operation successful" },
            data: { type: "object" },
          },
        },
        // Reusable error response schema
        ErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "Something went wrong" },
            errors: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  field: { type: "string" },
                  message: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
  },
  // Scan these files for JSDoc swagger comments
  apis: ["./src/modules/**/*.routes.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
