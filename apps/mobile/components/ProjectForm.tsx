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
import { getFriendlyStatus } from "@/utils/project";

interface ProjectFormProps {
  projectId?: string | null;
}

const formSchema = z.object({
  id: z.string().optional().nullable(),
  name: z.string().nonempty(),
  status: z.enum(["backlog", "todo", "inProgress", "completed"]),
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

  const { mutate: upsertProject } = useMutation(
    trpc.upsertProject.mutationOptions({
      onMutate: async (data) => {
        await queryClient.cancelQueries({
          queryKey: trpc.getProject.queryKey({ id: data.id }),
        });

        const previousProject = queryClient.getQueryData(
          trpc.getProject.queryKey({ id: data.id })
        );

        queryClient.setQueryData(
          trpc.getProject.queryKey({ id: data.id }),
          (old) => {
            return {
              ...old,
              ...{
                id: data.id,
                name: data.name,
                status: data.status,
                assignee: data.assignee ?? null,
              },
            };
          }
        );

        await queryClient.cancelQueries({
          queryKey: trpc.getProjects.queryKey(),
        });

        const previousProjects = queryClient.getQueryData(
          trpc.getProjects.queryKey()
        );

        queryClient.setQueryData(trpc.getProjects.queryKey(), (old) => {
          return [
            ...(old ?? []).filter((project) => project.id !== data.id),
            {
              id: data.id,
              name: data.name,
              status: data.status,
              assignee: data.assignee ?? null,
            },
          ];
        });

        return { previousProject, previousProjects };
      },
      onError: (error, data, context) => {
        queryClient.setQueryData(
          trpc.getProject.queryKey({ id: data.id }),
          context?.previousProject
        );

        queryClient.setQueryData(
          trpc.getProjects.queryKey(),
          context?.previousProjects
        );
      },
      onSettled: (data, error, variables) => {
        queryClient.invalidateQueries({
          queryKey: trpc.getProject.queryKey({ id: variables.id }),
        });

        queryClient.invalidateQueries({
          queryKey: trpc.getProjects.queryKey(),
        });
      },
    })
  );

  const { control, handleSubmit } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      id: project?.id,
      name: project?.name ?? "",
      status: project?.status ?? "backlog",
      assignee: project?.assignee,
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    upsertProject({
      id: data.id ?? uuidv4(),
      name: data.name,
      status: data.status ?? "backlog",
      assignee: data.assignee,
    });

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
              <Picker.Item
                label={getFriendlyStatus("backlog")}
                value="backlog"
              />
              <Picker.Item label={getFriendlyStatus("todo")} value="todo" />
              <Picker.Item
                label={getFriendlyStatus("inProgress")}
                value="inProgress"
              />
              <Picker.Item
                label={getFriendlyStatus("completed")}
                value="completed"
              />
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
