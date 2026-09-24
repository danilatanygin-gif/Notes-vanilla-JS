import { CategoryModel, NoteModel } from "./modul/model.js";
import { CategoryComponent, NoteComponent } from "./modul/components.js";
import { StorageDriver } from "./StorageDriver.js";
import { DragAndDrop } from "./DragAndDrop.js";


const createStorage = (key = "") => {
  const load = () => {
    const data = StorageDriver.get(key);
    return data || [];
  }

  return {
    load,
    onSave: (item) => {
      if (!item) return;
      let data = load();

      const index = data.findIndex((data) => data.id === item.id);
      if (index !== -1) {
        data[index] = item;
      } else {
        data.push(item);
      }
      StorageDriver.set(key, data);
    },
    onDelete: (id) => {
      if (!id) return;
      let data = load();

      data = data.filter((data) => data.id !== id);
      StorageDriver.set(key, data);
    }
  };
};


const addNoteElement = document.getElementById("addNote");
const addCategoryElement = document.getElementById("addCategory");

const noteStorage = createStorage("notes");
const categoryStorage = createStorage("categories");

const categoryContainer = document.getElementById("categories");
const noteContainer = document.getElementById("notes");

function renderNotes() {
  const allCategories = categoryStorage.load();
  noteStorage.load().forEach(note => {
    const noteData = new NoteModel(note.id, note.label, note.content, note.categories);

    const noteCategory = new Set(note.categories || []);
    const sampleCategory = allCategories.filter(category => noteCategory.has(category.id));

    const noteUI = new NoteComponent(noteData, noteStorage, false, sampleCategory);
    noteUI.mountTo(noteContainer);
  });
}

function renderCategories() {
  categoryStorage.load().forEach(category => {
    const categoryData = new CategoryModel(category.id, category.label);
    const categoryUI = new CategoryComponent(categoryData, categoryStorage, false);
    categoryUI.mountTo(categoryContainer);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  addNoteElement.addEventListener("click", () => {
    const noteData = new NoteModel();
    const noteUI = new NoteComponent(noteData, noteStorage, true);
    noteUI.mountTo(noteContainer);
  });

  addCategoryElement.addEventListener("click", () => {
    const categoryData = new CategoryModel();
    const categoryUI = new CategoryComponent(categoryData, categoryStorage, true);
    categoryUI.mountTo(categoryContainer);
  });

  renderCategories();
  renderNotes();
});

const dndCategoryToNote = new DragAndDrop(
  categoryContainer,
  noteContainer,
  {
    startFunc: (e) => {
      const dragElement = e.target.closest(".category");
      if (dragElement) {
        e.dataTransfer.setData("text/plain", dragElement.dataset.id);
      }
    },
    overFunc: (e) => {
      const receiveElement = e.target.closest(".note");
      if (receiveElement) {
        e.preventDefault();
      }
    },
    dropFunc: (e) => {
      const dragId = e.dataTransfer.getData("text/plain");
      const receiveElement = e.target.closest(".note");
      if (!receiveElement || !dragId) return;

      const receiveId = receiveElement.dataset.id;
      //Получаем все заметки из ls 
      const notes = noteStorage.load();
      //Находим нужный индекс заметки по id
      const noteIndex = notes.findIndex(note => note.id == receiveId);
      if (noteIndex === -1) return;

      const numDragId = dragId;
      //Проверяем существует ли массив кактегорий у заметки, если нет, создаем пустой массив
      notes[noteIndex].categories = notes[noteIndex].categories || [];
      if (!notes[noteIndex].categories.includes(numDragId)) {
        notes[noteIndex].categories.push(numDragId);
        noteStorage.onSave(notes[noteIndex]);
      }

      const allCategories = categoryStorage.load();
      const noteCategory = new Set(notes[noteIndex].categories || []);
      const sampleCategory = allCategories.filter(category => noteCategory.has(category.id));

      const oldNote = noteContainer.querySelector(`[data-id="${receiveId}"]`);
      const noteUI = new NoteComponent(notes[noteIndex], noteStorage, false, sampleCategory);
      noteUI.render();

      if (oldNote) {
        oldNote.replaceWith(noteUI.element);
      } else {
        noteUI.mountTo(noteContainer);
      }
    }
  }
);

const dndCategoryFromNote = new DragAndDrop(
  noteContainer,
  document.body,
  {
    startFunc: (e) => {
      const dragElement = e.target.closest(".category");
      const dragNoteElement = e.target.closest(".note");
      //Создаем объект с id категории и id заметки, чтобы при удалении категории из заметки мы знали, из какой заметки удалять категорию
      const dataId = {
        categoryId: dragElement ? dragElement.dataset.id : null,
        noteId: dragNoteElement ? dragNoteElement.dataset.id : null
      };

      if (dataId.categoryId !== null && dataId.noteId !== null) {
        const payload = JSON.stringify(dataId);
        e.dataTransfer.setData("application/json", payload);
      }
    },
    overFunc: (e) => {
      if (!e.target.closest(".note")) {
        e.preventDefault();
      }
    },
    dropFunc: (e) => {
      const raw = e.dataTransfer.getData("application/json");
      if (!raw) return;
      const dataId = JSON.parse(raw);

      const notes = noteStorage.load();
      const noteIndex = notes.findIndex(note => note.id == dataId.noteId);
      if (noteIndex === -1) return;

      notes[noteIndex].categories = notes[noteIndex].categories || [];
      //Обращаемя к нужной заметке по индексу и ищем индекс категории в массиве категорий заметки, чтобы удалить категорию из заметки
      const categoryIndex = notes[noteIndex].categories.indexOf(dataId.categoryId);
      if (categoryIndex !== -1) {
        notes[noteIndex].categories.splice(categoryIndex, 1);
        noteStorage.onSave(notes[noteIndex]);
      }

      const allCategories = categoryStorage.load();
      const noteCategory = new Set(notes[noteIndex].categories || []);
      const sampleCategory = allCategories.filter(category => noteCategory.has(category.id));

      const oldNote = noteContainer.querySelector(`[data-id="${notes[noteIndex].id}"]`);
      const noteUI = new NoteComponent(notes[noteIndex], noteStorage, false, sampleCategory);
      noteUI.render();

      if (oldNote) {
        oldNote.replaceWith(noteUI.element);
      }
    }
  }
);

dndCategoryToNote.init();
dndCategoryFromNote.init();