import { Link, Stack, useRouter } from "expo-router";
import { Pressable } from "react-native";
import { X, Plus } from "lucide-react-native";

export default function RootLayout() {
  const router = useRouter();

  return (
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
  );
}
