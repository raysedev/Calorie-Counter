import * as api from "./api.js";

export async function getAllTasks() {
  return api.get("/jsonstore/tasks/");
}

export async function getTaskById(id) {
  return api.get("/jsonstore/tasks/" + id);
}

export async function createTask(data) {
    return api.post("/jsonstore/tasks/", data);
}

export async function updateTaskById(id, data) {
    return api.put("/jsonstore/tasks/" + id, data);
}
  
export async function deleteTaskById(id) {
    return api.del("/jsonstore/tasks/" + id);
}