import { Link, Stack, useRouter } from "expo-router";
import { Platform, Pressable } from "react-native";
import { X, Plus } from "lucide-react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import React from "react";
import { TRPCProvider } from "../utils/trpc";
import { AppRouter } from "@breezy-task/server";

export default function RootLayout() {
  const router = useRouter();

  const [trpcClient] = React.useState(() =>
    createTRPCClient<AppRouter>({
      links: [
        httpBatchLink({
          url:
            Platform.OS === "android"
              ? "http://10.0.2.2:4000/trpc"
              : "http://localhost:4000/trpc",
        }),
      ],
    })
  );

  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        <Stack>
          <Stack.Screen
            name="index"
            options={{
              title: "Projects",
              headerRight: () => (
                <Link href="/add" asChild>
                  <Pressable>
                    <Plus size={24} />
                  </Pressable>
                </Link>
              ),
            }}
          />
          <Stack.Screen
            name="[projectId]/index"
            options={{
              title: "Project Details",
            }}
          />
          <Stack.Screen
            name="add"
            options={{
              title: "Add Project",
              presentation: "modal",
              headerRight: () => (
                <Pressable onPress={() => router.dismiss()}>
                  <X size={24} />
                </Pressable>
              ),
            }}
          />
          <Stack.Screen
            name="[projectId]/edit"
            options={{
              title: "Edit Project",
              presentation: "modal",
              headerRight: () => (
                <Pressable onPress={() => router.dismiss()}>
                  <X size={24} />
                </Pressable>
              ),
            }}
          />
        </Stack>
      </TRPCProvider>
    </QueryClientProvider>
  );
}
