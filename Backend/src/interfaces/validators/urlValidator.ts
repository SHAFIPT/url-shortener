import { z } from "zod";

export const createShortUrlSchema = z.object({
  longUrl: z
    .string()
    .url({ message: "Invalid URL format." })
    .max(2048, { message: "URL is too long." })
    .refine(
      (url) => {
        const blockedHosts = ["localhost", "127.0.0.1"];
        try {
          const parsed = new URL(url);
          return !blockedHosts.includes(parsed.hostname);
        } catch {
          return false;
        }
      },
      { message: "Internal or unsafe URLs are not allowed." }
    ),
});
