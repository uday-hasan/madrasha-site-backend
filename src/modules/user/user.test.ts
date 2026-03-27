import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "../../app";
import { prisma } from "../../config/database";
import bcrypt from "bcryptjs";

// ================================
// AUTH TESTS
// We mock Prisma so tests don't need a real database.
// This makes tests fast and isolated.
// ================================

// Mock the entire prisma module
vi.mock("../../config/database", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    refreshToken: {
      create: vi.fn(),
      findUnique: vi.fn(),
      delete: vi.fn(),
      deleteMany: vi.fn(),
    },
  },
}));

const mockPrisma = prisma as unknown as {
  user: {
    findUnique: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
  };
  refreshToken: {
    create: ReturnType<typeof vi.fn>;
    deleteMany: ReturnType<typeof vi.fn>;
  };
};

describe("Auth Routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ---- REGISTER ----
  describe("POST /api/v1/auth/register", () => {
    it("should register a new user successfully", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null); // No existing user
      mockPrisma.user.create.mockResolvedValue({
        id: "user-1",
        name: "John Doe",
        email: "john@example.com",
        role: "USER",
        createdAt: new Date(),
      });

      const res = await request(app).post("/api/v1/auth/register").send({
        name: "John Doe",
        email: "john@example.com",
        password: "Password123",
        confirmPassword: "Password123",
      });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe("john@example.com");
    });

    it("should return 409 if email already exists", async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: "existing-user" });

      const res = await request(app).post("/api/v1/auth/register").send({
        name: "John Doe",
        email: "existing@example.com",
        password: "Password123",
        confirmPassword: "Password123",
      });

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
    });

    it("should return 422 for invalid email", async () => {
      const res = await request(app).post("/api/v1/auth/register").send({
        name: "John",
        email: "not-an-email",
        password: "Password123",
        confirmPassword: "Password123",
      });

      expect(res.status).toBe(422);
      expect(res.body.errors).toBeDefined();
    });

    it("should return 422 for weak password", async () => {
      const res = await request(app).post("/api/v1/auth/register").send({
        name: "John",
        email: "john@example.com",
        password: "weak",
        confirmPassword: "weak",
      });

      expect(res.status).toBe(422);
    });

    it("should return 422 when passwords do not match", async () => {
      const res = await request(app).post("/api/v1/auth/register").send({
        name: "John",
        email: "john@example.com",
        password: "Password123",
        confirmPassword: "Password456",
      });

      expect(res.status).toBe(422);
    });
  });

  // ---- LOGIN ----
  describe("POST /api/v1/auth/login", () => {
    it("should login successfully and set cookies", async () => {
      const hashedPassword = await bcrypt.hash("Password123", 12);

      mockPrisma.user.findUnique.mockResolvedValue({
        id: "user-1",
        name: "John Doe",
        email: "john@example.com",
        password: hashedPassword,
        role: "USER",
        isActive: true,
      });
      mockPrisma.refreshToken.create.mockResolvedValue({});

      const res = await request(app).post("/api/v1/auth/login").send({
        email: "john@example.com",
        password: "Password123",
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      // Cookies should be set
      expect(res.headers["set-cookie"]).toBeDefined();
    });

    it("should return 401 for wrong password", async () => {
      const hashedPassword = await bcrypt.hash("CorrectPassword123", 12);

      mockPrisma.user.findUnique.mockResolvedValue({
        id: "user-1",
        email: "john@example.com",
        password: hashedPassword,
        isActive: true,
      });

      const res = await request(app).post("/api/v1/auth/login").send({
        email: "john@example.com",
        password: "WrongPassword123",
      });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it("should return 401 for non-existent user", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      const res = await request(app).post("/api/v1/auth/login").send({
        email: "nobody@example.com",
        password: "Password123",
      });

      expect(res.status).toBe(401);
    });
  });

  // ---- LOGOUT ----
  describe("POST /api/v1/auth/logout", () => {
    it("should logout and clear cookies", async () => {
      mockPrisma.refreshToken.deleteMany.mockResolvedValue({});

      const res = await request(app).post("/api/v1/auth/logout");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  // ---- GET ME ----
  describe("GET /api/v1/auth/me", () => {
    it("should return 401 when not authenticated", async () => {
      const res = await request(app).get("/api/v1/auth/me");

      expect(res.status).toBe(401);
    });
  });
});
