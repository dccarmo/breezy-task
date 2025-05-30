import { useTRPC } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";
import { Link } from "expo-router";
import { FlatList, Pressable, Text, View } from "react-native";



export default function ProjectListScreen() {
  const trpc = useTRPC();

  const { data: projects = [] } = useQuery(trpc.getProjects.queryOptions());

  return (
    <FlatList
      data={projects}
      contentContainerStyle={{
        padding: 16,
      }}
      renderItem={({ item }) => (
        <Link
          href={{
            pathname: "/[projectId]",
            params: { projectId: item.id },
          }}
          asChild
        >
          <Pressable
            style={{
              padding: 16,
              borderRadius: 8,
              backgroundColor: "#fff",
              marginBottom: 16,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                {item.name}
              </Text>
              <Text style={{ fontSize: 14, color: "#666" }}>{item.status}</Text>
            </View>
            <Text style={{ fontSize: 14, color: "#666" }}>{item.assignee}</Text>
          </Pressable>
        </Link>
      )}
    />
  );
}
