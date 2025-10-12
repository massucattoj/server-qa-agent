import type { FastifyRequest } from "fastify";

export interface AuthenticatedRequest extends FastifyRequest {
  user: {
    userId: string;
    email: string;
  };
}

export async function authenticateUser(request: FastifyRequest): Promise<AuthenticatedRequest> {
  try {
    const token = request.headers.authorization?.replace("Bearer ", "");
    
    if (!token) {
      throw new Error("No token provided");
    }

    const decoded = request.server.jwt.verify(token) as { userId: string; email: string };
    
    return {
      ...request,
      user: decoded,
    } as AuthenticatedRequest;
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
}
