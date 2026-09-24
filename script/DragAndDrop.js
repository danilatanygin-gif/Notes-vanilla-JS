export class DragAndDrop {
    constructor(dragContainer, dropContainer, callback = {}) {
        this.dragContainer = dragContainer;
        this.dropContainer = dropContainer;
        this.startFunc = callback.startFunc;
        this.overFunc = callback.overFunc;
        this.enterFunc = callback.enterFunc;
        this.leaveFunc = callback.leaveFunc;
        this.endFunc = callback.endFunc;
        this.dropFunc = callback.dropFunc;
    }

    init = () => {
        if (!this.dragContainer || !this.dropContainer) return;

        this.dragContainer.addEventListener("dragstart", (e) => {
            if (typeof this.startFunc === "function") this.startFunc(e);
        });

        this.dropContainer.addEventListener("dragover", (e) => {
            if (typeof this.overFunc === "function") this.overFunc(e);
        });

        this.dropContainer.addEventListener("dragenter", (e) => {
            if (typeof this.enterFunc === "function") this.enterFunc(e);
        });

        this.dropContainer.addEventListener("dragleave", (e) => {
            if (typeof this.leaveFunc === "function") this.leaveFunc(e);
        });

        this.dragContainer.addEventListener("dragend", (e) => {
            if (typeof this.endFunc === "function") this.endFunc(e);
        });

        this.dropContainer.addEventListener("drop", (e) => {
            e.preventDefault();
            if (typeof this.dropFunc === "function") this.dropFunc(e);
        });

    }
}