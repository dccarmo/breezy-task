import { initTRPC } from "@trpc/server";
import { z } from "zod";
import * as trpcExpress from "@trpc/server/adapters/express";
import express from "express";
import pino from "pino-http";
import { createProject, getProjects, updateProject, getProject } from "./db";

const t = initTRPC.create();

const appRouter = t.router({
  upsertProject: t.procedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().nonempty(),
        status: z.enum(["backlog", "todo", "inProgress", "completed"]),
        assignee: z.string().optional().nullable(),
      })
    )
    .mutation(async (opts) => {
      const { id, name, status, assignee } = opts.input;

      if (getProject(id)) {
        updateProject({ id, name, status, assignee: assignee ?? null });
      } else {
        createProject({ id, name, status, assignee: assignee ?? null });
      }

      return { id, name, status, assignee };
    }),

  getProjects: t.procedure.query(async (opts) => {
    return getProjects();
  }),

  getProject: t.procedure
    .input(z.object({ id: z.string() }))
    .query(async (opts) => {
      return getProject(opts.input.id);
    }),
});

export type AppRouter = typeof appRouter;

const app = express();

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
  })
);

app.use(pino());

app.listen(4000);
