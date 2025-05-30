import { Pressable, Text, View } from "react-native";
import { Link, useLocalSearchParams, useNavigation } from "expo-router";
import { Pencil } from "lucide-react-native";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/utils/trpc";

export default function DetailsScreen() {
  const navigation = useNavigation();
  const { projectId } = useLocalSearchParams<{ projectId: string }>();

  const trpc = useTRPC();

  const { data: project } = useQuery(
    trpc.getProject.queryOptions({ id: projectId })
  );

  React.useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Link
          href={{
            pathname: "/[projectId]/edit",
            params: { projectId },
          }}
          asChild
        >
          <Pressable>
            <Pencil size={20} />
          </Pressable>
        </Link>
      ),
    });
  }, [navigation, projectId]);

  return (
    <View
      style={{
        flex: 1,
        padding: 16,
      }}
    >
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 24 }}>
        {project?.name}
      </Text>
      <View style={{ gap: 16 }}>
        <Text style={{ fontSize: 16 }}>Status: {project?.status}</Text>
        <Text style={{ fontSize: 16 }}>Assignee: {project?.assignee}</Text>
      </View>
    </View>
  );
}
