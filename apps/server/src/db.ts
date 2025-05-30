export type Project = {
  id: string;
  name: string;
  status: "backlog" | "todo" | "in-progress" | "completed";
  assignee: string | null;
};

const db: { projects: Project[] } = {
  projects: [],
};

export const createProject = (project: Project) => {
  db.projects.push(project);
};

export const getProjects = () => {
  return db.projects;
};

export const updateProject = (project: Project) => {
  db.projects = db.projects.map((p) => (p.id === project.id ? project : p));
};

export const getProject = (id: string) => {
  return db.projects.find((p) => p.id === id);
};

export const deleteProject = (id: string) => {
  db.projects = db.projects.filter((p) => p.id !== id);
};
