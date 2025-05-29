import { ScrollView, View } from "react-native";
import React from "react";
import ProjectForm from "@/components/ProjectForm";

export default function AddScreen() {
  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <View style={{ gap: 16 }}>
        <ProjectForm />
      </View>
    </ScrollView>
  );
}
