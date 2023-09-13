import http from "http";
import chalk from "chalk";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { addNote, getNotes, deleteNote, editNote } from "./notesController.js";
import express from "express";
import bodyParser from "body-parser";

/* export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename); */

const port = 3000;

/* const basePath = path.join(__dirname, "pages/"); */

// Создание сервера
const app = express();

// Копипасты, чтобы не морочиться с экспортами, с ними были пробелмы
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Установка ЕЖС шаблонизатора
app.set("view engine", "ejs");
// Показываем Экспрессу нужную папку со страницами
app.set("views", "pages");

// Метод use для работы Express с расширениями тела запроса
// urlencoded - видимо или настройка, или сам плагин
// теперь тело будет состоять из {} - значения атрибута name у input
// и самого тела запроса клиента (то, что он отправил формой)
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, "public")));

// Добавляю возможность слать жсон (из домашки)
// НА САЙТЕ НЕТ ПРИМЕРОВ КОДА, ИЗ УРОКОВ НЕЯСНО, КАК ЭТО ПРИМЕНЯТЬ.
// ПРОСТО ЗАПИСЬ НЕ ПОМОГАЕТ ОБРАБОТАТЬ У PUT JSON, REQ.BODY ДАЁТ UNDEFINED
// решение найдено методом тыка
app.use(express.json({ type: "text" }));

// Обработка GET
// С кодом ниже и лишь прослушкой хтмл отобразится на клиенте
// то есть код рабочий
app.get("/", async (req, res) => {
  // Метод sendFile это метод Express
  /* res.sendFile(path.join(basePath + "index.html")); */
  res.render("index", { ttt: "", notes: await getNotes(), created: false }); // файл именно текстом и без расширения
});

app.post("/", async (req, res) => {
  // Сначала сохраним в БД
  console.log(req.body, 666);
  await addNote(req.body.title);

  // И лишь затем - ответ
  /* res.sendFile(path.join(basePath + "index.html")); */
  res.render("index", { ttt: 555, notes: await getNotes(), created: true });
  console.log(req.body); // то, что отпрваляет клиент
  // тут undefined, т.к express дурак
  // чтобы научить его читать тело запроса, нужен middleware -
  // - плагин на дополнение, уже включённый в оное
  // теперь придёт объект, с которым работать удобнее, чем со строками
});

// Обработка запроса на удаление заметки
app.delete("/:id", async (req, res) => {
  /*  console.log(req.params.id, 111); */
  deleteNote(req.params.id);
  res.render("index", { ttt: "", notes: await getNotes(), created: false });
});

// Домашка, обработка PUT запроса
app.put("/:id", async (req, res) => {
  // Вычитал, что должен быть "Content-Type" (НЕ ПОМОГЛО)
  /* res.setHeader("Content-Type", "multipart/form-data"); */
  /* console.log(req.body, req.params.id, 777); */ // ПРОБЛЕЕЕЕЕЕЕЕЕЕЕЕЕЕЕЕЕЕЕЕЕЕЕЕЕЕЕЕЕЕЕЕЕЕЕЕЕЕЕЕЕЕЕЕЕМА UNDEFINED
  // при type: text всё заработало
  editNote(req.body.title, req.params.id);
  // ВОПРОС - ПОЧЕМУ БЕЗ ЭТОГ ОНЕ РАБОТАЕТ? ДАЖЕ НЕ ПЕРЕДАЁТСЯ СТАТУС ЗАПРОСА!
  res.render("index", { ttt: "", notes: await getNotes(), created: false });
});

// Прослушка сервера
app.listen(port, () => console.log("теперь работает"));
