import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@/backend/server.ts";

export const trpc = createTRPCReact<AppRouter>();
