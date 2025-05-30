export function getFriendlyStatus(status: string) {
  switch (status) {
    case "todo":
      return "To Do";
    case "backlog":
      return "Backlog";
    case "inProgress":
      return "In Progress";
    case "completed":
      return "Completed";
  }
}
