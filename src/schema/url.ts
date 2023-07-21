import { z } from "zod";

/**
 * Schema can be defined on a shared folder
 * in order to be accessed by both client and server.
 */
export const createRedirectURLSchema = z.object({
  source: z.string().min(1),
  destination: z.string().min(1).url(),
});
