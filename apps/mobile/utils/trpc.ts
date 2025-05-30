import { createTRPCContext } from "@trpc/tanstack-react-query";
import type { AppRouter } from "@breezy-task/server";

export const { TRPCProvider, useTRPC, useTRPCClient } =
  createTRPCContext<AppRouter>();
