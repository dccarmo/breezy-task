import { Pressable, Text, View } from "react-native";
import { Link, useLocalSearchParams, useNavigation } from "expo-router";
import { Pencil } from "lucide-react-native";
import React from "react";

export default function DetailsScreen() {
  const navigation = useNavigation();
  const { projectId } = useLocalSearchParams<{ projectId: string }>();

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
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
    </View>
  );
}
