function generateId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export class CategoryModel {
  constructor(id = null, label = "") {
    this.id = id ?? generateId();
    this.label = label;
  }
}

export class NoteModel {
  constructor(id = null, label = "", content = "", categories = []) {
    this.id = id ?? generateId();
    this.label = label;
    this.content = content;
    this.categories = categories;
  }
}
