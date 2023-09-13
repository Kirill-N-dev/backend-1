/* const notes = []; */
import fs from "fs/promises";
import path from "path";
import chalk from "chalk";
/* import { __dirname } from "./index.js"; */
import { fileURLToPath } from "node:url"; // пришлось гуглить, автоимпорт не курит

// Дублёж, спросить куратора, без этого не работает, ошибка
// Cannot access '__dirname' before initialization
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const notesPath = path.join(__dirname, "db.json");
/* console.log(notesPath); */

export async function addNote(title) {
  // Получаем БД
  const notes = await getNotes();
  const note = {
    title,
    id: Date.now().toString(),
  };
  notes.push(note);

  // ЗАПИСЬ:
  await fs.writeFile(notesPath, JSON.stringify(notes));
  console.log(chalk.green("olololo"));
}

/* addNote("Test!"); */

export async function getNotes() {
  /* return require("./db.json"); */
  const notes = await fs.readFile(notesPath, { encoding: "utf-8" });
  return Array.isArray(JSON.parse(notes)) ? JSON.parse(notes) : [];
}

export const printNotes = async () => {
  const notes = await getNotes();

  // Домашка, вывод id
  // Макс, вопрос, откуда в терминале берётся пробел? Ведь для браузера мы его добавляли сами.
  console.log(chalk.green("Here is the list of notes:"));
  notes.forEach((n) => console.log(chalk.blue(n.id, n.title)));
};

// Домашка, удаление записи, функция для комманды index.js
export const deleteNote = async (id) => {
  /* console.log(typeof id);  */ // походу хэндлер даёт на выходе не то, что я передал, а {}
  const notes = await getNotes();
  /*   console.log("deleteNote command got id:", id); */
  const newNotes = Array.isArray(notes)
    ? notes.filter((g) => +g.id !== +id)
    : "Datebase is empty";
  /* console.log(newNotes, typeof id); */
  await fs.writeFile(notesPath, JSON.stringify(newNotes));
};

// Домашка, функция редактирования записи
export async function editNote(title, id) {
  // Получаем БД
  const notes = await getNotes();

  const editedNotes = notes.map((n) => {
    if (n.id === id) {
      n.title = title;
    }
    return n;
  });

  await fs.writeFile(notesPath, JSON.stringify(editedNotes));
  /* console.log(note, 111); */ // { title: '111', id: '1694457583232' } - при обновлении даст старую запись из БД
  /* notes.push(note); */
  /* console.log(title, id, 555); */

  // ЗАПИСЬ:
  /*  await fs.writeFile(notesPath, JSON.stringify(notes));
  console.log(chalk.green("olololo")); */
}
