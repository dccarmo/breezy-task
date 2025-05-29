import { Link, useRouter } from "expo-router";
import { FlatList, Pressable, Text, View } from "react-native";

type ProjectStatus = "Backlog" | "To Do" | "In Progress" | "Completed";

const INITIAL_PROJECT = [
  {
    id: 1,
    name: "Project 1",
    status: "Backlog",
    assignee: "John Doe",
  },
];

export default function ProjectListScreen() {
  const router = useRouter();
  return (
    <FlatList
      data={INITIAL_PROJECT}
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
