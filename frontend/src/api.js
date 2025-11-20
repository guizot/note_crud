const API_URL = "http://localhost:8000";

export const fetchNotes = async (includeArchived = false) => {
  const url = includeArchived
    ? `${API_URL}/notes?include_archived=true`
    : `${API_URL}/notes`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch notes");
  return response.json();
};

export const createNote = async (note) => {
  const response = await fetch(`${API_URL}/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(note),
  });
  if (!response.ok) throw new Error("Failed to create note");
  return response.json();
};

export const updateNote = async (id, note) => {
  const response = await fetch(`${API_URL}/notes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(note),
  });
  if (!response.ok) throw new Error("Failed to update note");
  return response.json();
};

export const deleteNote = async (id) => {
  const response = await fetch(`${API_URL}/notes/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete note");
  return response.json();
};

export const togglePinNote = async (id) => {
  const response = await fetch(`${API_URL}/notes/${id}/pin`, {
    method: "PATCH",
  });
  if (!response.ok) throw new Error("Failed to toggle pin");
  return response.json();
};

export const archiveNote = async (id) => {
  const response = await fetch(`${API_URL}/notes/${id}/archive`, {
    method: "PATCH",
  });
  if (!response.ok) throw new Error("Failed to archive note");
  return response.json();
};

export const restoreNote = async (id) => {
  const response = await fetch(`${API_URL}/notes/${id}/restore`, {
    method: "PATCH",
  });
  if (!response.ok) throw new Error("Failed to restore note");
  return response.json();
};

export const permanentDeleteNote = async (id) => {
  const response = await fetch(`${API_URL}/notes/${id}/permanent`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to permanently delete note");
  return response.json();
};

export const fetchTags = async () => {
  const response = await fetch(`${API_URL}/tags`);
  if (!response.ok) throw new Error("Failed to fetch tags");
  return response.json();
};

export const createTag = async (name) => {
  const response = await fetch(`${API_URL}/tags`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  if (!response.ok) throw new Error("Failed to create tag");
  return response.json();
};

export const fetchStats = async () => {
  const response = await fetch(`${API_URL}/notes/stats`);
  if (!response.ok) throw new Error("Failed to fetch stats");
  return response.json();
};
