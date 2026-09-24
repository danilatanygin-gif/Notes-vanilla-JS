class BaseComponent {
  constructor(model, callback = {}, isEditing = true) {
    this.model = model;

    this.onSave = callback.onSave;
    this.onDelete = callback.onDelete;

    this.element = document.createElement("div");
    this.isEditing = isEditing;

    this.initBaseEvent();
  }

  initBaseEvent() {
    this.element.addEventListener("click", (e) => {
      if (this.isEditing || e.target.tagName === "BUTTON") return;
      this.isEditing = true;
      this.render();
    });
  }

  mountTo(container) {
    if (container && !container.contains(this.element)) {
      container.appendChild(this.element);
    }
    this.render();
  }

  render() {
    this.element.classList.remove("visible");
    this.element.replaceChildren();
    if (this.isEditing) {
      this.renderEditMode();
    } else {
      this.renderViewMode();
    }
    setTimeout(() => {
      this.element.classList.add("visible");
    }, 0);
  }

  renderEditMode() {
    throw new Error("Метод должен быть реализован");
  }
  renderViewMode() {
    throw new Error("Метод должен быть реализован");
  }
}

export class CategoryComponent extends BaseComponent {
  constructor(model, callback, isEditing) {
    super(model, callback, isEditing);
    this.element.classList.add("category");
    this.element.setAttribute("draggable", true);
  }

  renderEditMode() {
    const textArea = document.createElement("textarea");
    textArea.classList.add("categoryLabel");
    textArea.placeholder = "Категория";
    textArea.maxLength = 15;
    textArea.value = this.model.label;

    textArea.addEventListener("blur", (e) => {
      this.save(textArea.value);
    });

    textArea.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        this.save(textArea.value);
      }
    });
    this.element.appendChild(textArea);
    textArea.focus();
  }

  renderViewMode() {
    const span = document.createElement("span");
    span.textContent = this.model.label;
    this.element.dataset.id = this.model.id;
    this.element.appendChild(span);
  }

  save(newLabel) {
    if (!newLabel.trim()) {
      this.delete();
      return;
    }
    this.model.label = newLabel;
    this.isEditing = false;

    if (typeof this.onSave === "function") this.onSave(this.model);
    this.render();
  }

  delete() {
    this.element.remove();
    if (typeof this.onDelete === "function") this.onDelete(this.model.id);
  }
}



export class NoteComponent extends BaseComponent {
  constructor(model, callback = {}, isEditing = true, categories = []) {
    super(model, callback, isEditing);
    this.element.classList.add("note");
    this.categories = categories;

    this.element.addEventListener("focusout", (e) => {
      if(!this.isEditing) return;
      if (!this.element.contains(e.relatedTarget)) {
        const label = this.element.querySelector(".noteLabel").value;
        const content = this.element.querySelector(".noteSpan").value;
        this.save(label, content);
      }
    });

    this.element.addEventListener("keydown", (e) => {
      if(!this.isEditing) return;
      if (e.key === "Enter") {
        e.preventDefault();
        const label = this.element.querySelector(".noteLabel").value;
        const content = this.element.querySelector(".noteSpan").value;
        this.save(label, content);
      }
    });
  }

  renderEditMode() {
    let labelElement = document.createElement("textarea");
    labelElement.classList.add("noteLabel");
    labelElement.placeholder = "Заголовок";
    labelElement.value = this.model.label;

    let contentElement = document.createElement("textarea");
    contentElement.classList.add("noteSpan");
    contentElement.placeholder = "Текст";
    contentElement.value = this.model.content;

    

    let dropZoneElement = document.createElement("div");
    dropZoneElement.classList.add("dropZone");

    this.categories.forEach(category => {
      const categoryUI = new CategoryComponent(category, {}, false);
      categoryUI.mountTo(dropZoneElement);
    })

    this.element.appendChild(labelElement);
    this.element.appendChild(contentElement);
    this.element.appendChild(dropZoneElement);
    labelElement.focus();
  }

  renderViewMode() {
    let deleteButton = document.createElement("button");
    deleteButton.classList.add("deleteBtn");
    deleteButton.innerHTML = "&#x2715;";
    deleteButton.addEventListener("click", () => {
      this.delete();
    });

    let h1Element = document.createElement("h1");
    h1Element.textContent = this.model.label;
    let spanElement = document.createElement("span");
    spanElement.textContent = this.model.content;
    let dropZoneElement = document.createElement("div");
    dropZoneElement.classList.add("dropZone");

    this.categories.forEach(category => {
      const categoryUI = new CategoryComponent(category, {}, false);
      categoryUI.mountTo(dropZoneElement);
    })

    this.element.dataset.id = this.model.id;
    this.element.appendChild(deleteButton);
    this.element.appendChild(h1Element);
    this.element.appendChild(spanElement);
    this.element.appendChild(dropZoneElement);
  }


  save(newLabel, newContent) {
    if (!newLabel.trim() || !newContent.trim()) {
      this.delete();
      return;
    }

    this.model.label = newLabel;
    this.model.content = newContent;
    this.isEditing = false;

    if (typeof this.onSave === "function") this.onSave(this.model);

    this.render();
  }

  delete() {
    this.element.remove();
    if (typeof this.onDelete === "function") this.onDelete(this.model.id);
  }
}
