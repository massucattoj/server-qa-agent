import { fastifyCors } from "@fastify/cors";
import { fastifyMultipart } from "@fastify/multipart";
import { fastifyJwt } from "@fastify/jwt";
import { fastify } from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { env } from "./env.ts";
import { createQuestionRoute } from "./http/routes/create-question.ts";
import { createRoomRoute } from "./http/routes/create-room.ts";
import { getRoomQuestions } from "./http/routes/get-room-questions.ts";
import { getRoomsRoute } from "./http/routes/get-rooms.ts";
import { uploadAudioRoute } from "./http/routes/upload-audio.ts";
import { registerRoute } from "./http/routes/register.ts";
import { loginRoute } from "./http/routes/login.ts";
import { authenticateUser } from "./http/middleware/auth.ts";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.register(fastifyCors, {
  origin: "http://localhost:5173",
});

app.register(fastifyMultipart);

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
});

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

// Public routes (no auth required)
app.get("/health", () => {
  return "OK";
});

app.register(registerRoute);
app.register(loginRoute);

// Protected routes plugin
app.register(async function (fastify) {
  // Add auth middleware only to this plugin
  fastify.addHook('preHandler', async (request, reply) => {
    try {
      await authenticateUser(request);
    } catch {
      return reply.status(401).send({ error: 'Unauthorized' });
    }
  });

  // Register protected routes
  fastify.register(getRoomsRoute);
  fastify.register(createRoomRoute);
  fastify.register(getRoomQuestions);
  fastify.register(createQuestionRoute);
  fastify.register(uploadAudioRoute);
});

app.listen({ port: env.PORT });
