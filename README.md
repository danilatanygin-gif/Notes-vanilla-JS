# Notes

Небольшое приложение для заметок с категориями и drag&drop, написанное на чистом JavaScript (без фреймворков).

## Возможности

- Создание, редактирование и удаление заметок
- Создание, редактирование и удаление категорий
- Привязка категории к заметке перетаскиванием (drag&drop)
- Открепление категории от заметки перетаскиванием за пределы заметки
- Автосохранение всех данных в `localStorage`

## Технологии

- Vanilla JavaScript (ES-модули, без сборщика)
- HTML5 Drag and Drop API
- CSS (Flexbox, `clamp()` для адаптивности)
- Шрифт [Roboto Mono](https://fonts.google.com/specimen/Roboto+Mono)

## Структура проекта

```
├── index.html          # точка входа
├── app.js              # инициализация, рендер, обработка drag&drop
├── model.js             # модели данных (CategoryModel, NoteModel)
├── components.js         # UI-компоненты (BaseComponent, CategoryComponent, NoteComponent)
├── StorageDriver.js      # обёртка над localStorage
├── DragAndDrop.js        # переиспользуемый класс для drag&drop
├── style.css             # общие стили
├── category.css          # стили категорий
└── note.css              # стили заметок
```
