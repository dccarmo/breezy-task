import { ScrollView, View } from "react-native";
import React from "react";
import ProjectForm from "@/components/ProjectForm";
import { useLocalSearchParams } from "expo-router";

export default function EditScreen() {
  const { projectId } = useLocalSearchParams<{ projectId: string }>();

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <View style={{ gap: 16 }}>
        <ProjectForm projectId={projectId} />
      </View>
    </ScrollView>
  );
}
