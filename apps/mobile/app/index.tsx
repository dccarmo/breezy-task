import { useTRPC } from "@/utils/trpc";
import { onlineManager, useQuery } from "@tanstack/react-query";
import { Link } from "expo-router";
import React from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { CircleSmall } from "lucide-react-native";
import * as Network from "expo-network";
import { getFriendlyStatus } from "@/utils/project";

export default function ProjectListScreen() {
  const trpc = useTRPC();

  const {
    data: projects = [],
    refetch,
  } = useQuery(trpc.getProjects.queryOptions());

  const [isOnline, setIsOnline] = React.useState(onlineManager.isOnline());

  React.useEffect(() => {
    const eventSubscription = Network.addNetworkStateListener((state) => {
      setIsOnline(!!state.isConnected);
      onlineManager.setOnline(!!state.isConnected);
    });
    return eventSubscription.remove;
  }, []);

  const toggleOnline = () => {
    onlineManager.setOnline(!isOnline);
    setIsOnline(!isOnline);
  };

  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const onRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  return (
    <FlatList
      data={projects}
      contentContainerStyle={{
        padding: 16,
      }}
      refreshing={isRefreshing}
      onRefresh={onRefresh}
      ListEmptyComponent={() => (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>
            No projects found
          </Text>
        </View>
      )}
      ListHeaderComponent={() => (
        <View style={{ marginBottom: 16 }}>
          <Pressable
            onPress={toggleOnline}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
              padding: 8,
              backgroundColor: "white",
              borderRadius: 8,
              alignSelf: "flex-start",
            }}
          >
            <CircleSmall
              size={16}
              fill={isOnline ? "green" : "red"}
              color={isOnline ? "green" : "red"}
            />
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>
              {isOnline ? "online" : "offline"}
            </Text>
          </Pressable>
        </View>
      )}
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
              <Text style={{ fontSize: 14, color: "#666" }}>
                {getFriendlyStatus(item.status)}
              </Text>
            </View>
            <Text style={{ fontSize: 14, color: "#666" }}>{item.assignee}</Text>
          </Pressable>
        </Link>
      )}
    />
  );
}
