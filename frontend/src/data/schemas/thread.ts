import { z } from 'zod'

export const threadPreviewSchema = z.object({
  id: z.string(),
  likes: z.array(z.string()),
  message: z.string(),
  createdAt: z.date(),
  childrenIds: z.array(z.string()),
  parent: z.optional(z.string()),
  creator: z.string(),
})

export type ThreadPreview = z.infer<typeof threadPreviewSchema>

export const threadMessageSchema = z.object({
  message: z.string().min(1),
})

export type ThreadMessageData = z.infer<typeof threadMessageSchema>
