import { Button, ScrollView, Text, TextInput, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTRPC } from "@/utils/trpc";
import {
  skipToken,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "expo-router";

interface ProjectFormProps {
  projectId?: string | null;
}

const formSchema = z.object({
  id: z.string().optional().nullable(),
  name: z.string().nonempty(),
  status: z.enum(["backlog", "todo", "in-progress", "completed"]),
  assignee: z.string().optional().nullable(),
});

export default function ProjectForm({ projectId }: ProjectFormProps) {
  const isEdit = !!projectId;

  const router = useRouter();

  const trpc = useTRPC();

  const queryClient = useQueryClient();

  const { data: project } = useQuery(
    trpc.getProject.queryOptions(projectId ? { id: projectId } : skipToken)
  );

  const { mutateAsync: upsertProject } = useMutation(
    trpc.upsertProject.mutationOptions({
      onSuccess: ({ id }) => {
        queryClient.invalidateQueries({
          queryKey: trpc.getProjects.queryKey(),
        });

        queryClient.invalidateQueries({
          queryKey: trpc.getProject.queryKey({ id }),
        });
      },
    })
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      id: project?.id,
      name: project?.name ?? "",
      status: project?.status ?? "backlog",
      assignee: project?.assignee,
    },
  });

  console.log(errors);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log("onSubmit", data);
    try {
      await upsertProject({
        id: data.id ?? uuidv4(),
        name: data.name,
        status: data.status ?? "backlog",
        assignee: data.assignee,
      });
    } catch (error) {
      console.error(error);
    }

    router.dismiss();
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <View style={{ gap: 16 }}>
        <Controller
          control={control}
          name="name"
          render={({ field }) => (
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
              value={field.value}
              onChangeText={field.onChange}
            />
          )}
        />

        <Controller
          control={control}
          name="assignee"
          render={({ field }) => (
            <TextInput
              placeholder="Assignee"
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                padding: 16,
                borderRadius: 8,
                backgroundColor: "white",
                fontSize: 16,
              }}
              value={field.value ?? ""}
              onChangeText={field.onChange}
            />
          )}
        />

        <Text style={{ fontSize: 16, fontWeight: "bold" }}>Project Status</Text>
        <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <Picker
              selectedValue={field.value}
              onValueChange={(itemValue, itemIndex) =>
                field.onChange(itemValue)
              }
            >
              <Picker.Item label="Backlog" value="backlog" />
              <Picker.Item label="To Do" value="todo" />
              <Picker.Item label="In Progress" value="in-progress" />
              <Picker.Item label="Completed" value="completed" />
            </Picker>
          )}
        />

        <Button
          title={isEdit ? "Save" : "Create"}
          onPress={handleSubmit(onSubmit)}
        />
      </View>
    </ScrollView>
  );
}
