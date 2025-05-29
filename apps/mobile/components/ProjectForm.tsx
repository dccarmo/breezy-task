import { Button, ScrollView, Text, TextInput, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import React from "react";

interface ProjectFormProps {
  projectId?: string | null;
}
export default function ProjectForm({ projectId }: ProjectFormProps) {
  const isEdit = !!projectId;

  const [projectName, setProjectName] = React.useState("");
  const [projectStatus, setProjectStatus] = React.useState("");
  const [projectAssignee, setProjectAssignee] = React.useState("");

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <View style={{ gap: 16 }}>
        <TextInput
          placeholder="Project Name"
          style={{
            borderWidth: 1,
            borderColor: "#ccc",
            padding: 16,
            borderRadius: 8,
            backgroundColor: "white",
            fontSize: 16,
          }}
          value={projectName}
          onChangeText={setProjectName}
        />
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>Project Status</Text>
        <Picker
          selectedValue={projectStatus}
          onValueChange={(itemValue, itemIndex) => setProjectStatus(itemValue)}
        >
          <Picker.Item label="Backlog" value="backlog" />
          <Picker.Item label="To Do" value="toDo" />
          <Picker.Item label="In Progress" value="inProgress" />
          <Picker.Item label="Completed" value="completed" />
        </Picker>
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>
          Project Assignee
        </Text>
        <Picker
          selectedValue={projectAssignee}
          onValueChange={(itemValue, itemIndex) =>
            setProjectAssignee(itemValue)
          }
        >
          <Picker.Item label="John Doe" value="johnDoe" />
        </Picker>
        <Button title={isEdit ? "Save" : "Create"} onPress={() => {}} />
      </View>
    </ScrollView>
  );
}
