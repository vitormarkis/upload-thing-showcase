import { z } from "zod"

export const uploadFileResponseSchema = z.object({
  fileName: z.string().optional(),
  name: z.string(),
  fileSize: z.number().optional(),
  size: z.number(),
  fileKey: z.string().optional(),
  key: z.string(),
  fileUrl: z.string().optional(),
  url: z.string(),
})
