import { z } from 'zod';

export const userDto = z.object({
  id: z.number(),
  name: z.string(),
});

export type User = z.infer<typeof userDto>;
