import { z } from "zod";

export const accountListSchema = z.array(
    z.object({
        name: z.string(),
    })
);
export type AccountListType = z.infer<typeof accountListSchema>;
