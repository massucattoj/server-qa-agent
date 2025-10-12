import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { db } from "../../db/connection.ts";
import { schema } from "../../db/schema/index.ts";
import { eq } from "drizzle-orm";

export const loginRoute: FastifyPluginCallbackZod = (app) => {
  app.post(
    "/auth/login",
    {
      schema: {
        body: z.object({
          email: z.string().email("Invalid email format"),
          password: z.string().min(1, "Password is required"),
        }),
      },
    },
    async (request, reply) => {
      const { email, password } = request.body;

      // Find user by email
      const result = await db
        .select()
        .from(schema.users)
        .where(eq(schema.users.email, email))
        .limit(1);

      if (result.length === 0) {
        return reply.status(401).send({
          error: "Invalid email or password",
        });
      }

      const user = result[0];

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return reply.status(401).send({
          error: "Invalid email or password",
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

      return reply.status(200).send({
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
