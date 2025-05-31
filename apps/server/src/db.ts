export type Project = {
  id: string;
  name: string;
  status: "backlog" | "todo" | "inProgress" | "completed";
  assignee: string | null;
};

const db: { projects: Project[] } = {
  projects: [],
};

export const createProject = (project: Project) => {
  console.log("createProject", project);
  db.projects.push(project);
};

export const getProjects = () => {
  console.log("getProjects", db.projects);
  return db.projects;
};

export const updateProject = (project: Project) => {
  console.log("updateProject", project);
  db.projects = db.projects.map((p) => (p.id === project.id ? project : p));
};

export const getProject = (id: string) => {
  console.log("getProject", id);
  return db.projects.find((p) => p.id === id);
};
