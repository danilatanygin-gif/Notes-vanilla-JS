export class StorageDriver {
    static set(key, value) {
        try {
            const serializedValue = JSON.stringify(value);
            localStorage.setItem(key, serializedValue);
        } catch (error) {
            console.log("Ошибка записи в localStorage", error);
        }
    }

    static get(key) {
        try {
            const serializedValue = localStorage.getItem(key);
            return serializedValue ? JSON.parse(serializedValue) : null;
        } catch (error) {
            console.log("Ошибка чтения из localStorage", error);
            return null;
        }
    }

    static remove(key) {
        localStorage.removeItem(key);
    }

    static clear() {
        localStorage.clear();
    }

}