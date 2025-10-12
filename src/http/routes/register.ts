import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { db } from "../../db/connection.ts";
import { schema } from "../../db/schema/index.ts";
import { eq } from "drizzle-orm";

export const registerRoute: FastifyPluginCallbackZod = (app) => {
  app.post(
    "/auth/register",
    {
      schema: {
        body: z.object({
          name: z.string().min(2, "Name must be at least 2 characters"),
          email: z.string().email("Invalid email format"),
          password: z.string().min(6, "Password must be at least 6 characters"),
        }),
      },
    },
    async (request, reply) => {
      const { name, email, password } = request.body;

      // Check if user already exists
      const existingUser = await db
        .select()
        .from(schema.users)
        .where(eq(schema.users.email, email))
        .limit(1);

      if (existingUser.length > 0) {
        return reply.status(409).send({
          error: "User with this email already exists",
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create user
      const result = await db
        .insert(schema.users)
        .values({
          name,
          email,
          password: hashedPassword,
        })
        .returning();

      const user = result[0];

      if (!user) {
        return reply.status(500).send({
          error: "Failed to create user",
        });
      }

      // Generate JWT token
      const token = request.server.jwt.sign(
        { 
          userId: user.id,
          email: user.email,
        },
        { expiresIn: "7d" }
      );

      return reply.status(201).send({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        token,
      });
    }
  );
};
