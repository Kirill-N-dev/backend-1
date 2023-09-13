// Код ниже - итоговый перед темой про Express

import http from "http";
import chalk from "chalk";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

// 0 копипаста со старого App.js
export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

const port = 3000;

// 2. создаём путь до папки с файлом
const basePath = path.join(__dirname, "pages/");
const server = http.createServer(async (req, res) => {
  // 1. проверяем тип запроса клиента
  if (req.method === "GET") {
    const content = await fs.readFile(path.join(basePath + "index.html"));
    // 3. Установка заголвока, чтобы браузеру было легче - ключ и значение строго такие
    // text/plain даст текст из всего хтмл
    res.setHeader("Content-Type", "text/html");
    // 4. Установка статуса ответа (а я думал, это идёт автоматом)
    // тут второй параметр - объект с ключом и значением из setHeader выше (с кавычками), но я оставлю так
    res.writeHead(200);
    res.end(content);

    // 5. Обработка POST
  } else if (req.method === "POST") {
    // 6. Создаём БД данных запроса
    // Вроде даже если сюда пушить, всё равно массив будет выдавать буффер (у Минина - нет)
    const body = [];
    let title;
    // 7. Формируем заголовок для браузера, облегчаем ему работу
    // данные ответа получаем в виде текста
    res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });

    // 8. Добавляем слушателей события
    // Событие отправки клиентом данных; data - строгое название события
    req.on("data", (data) => {
      console.log(data, typeof data); // dat - буфер, его надо переводить в строки
      // 9. Заполняю массив телом запроса с клиента
      body.push(Buffer.from(data));
    });

    // Событие конца приёма данных с клиента; end - строгое название события
    req.on("end", () => {
      console.log(Buffer.from(body).toString()); // без toString не переведёт
      // 10. Готовлю ответ на клиент, что отобразится на странице
      title = body.toString().split("=")[1].replaceAll("+", " ");
      console.log(title); // странно, но без вывода из буффера тоже всё работает
      res.end(`Send from client and got from server: ${title}`);
      // формат Number даёт ошибку + end именно внутри события, иначе title пустой
    });
    /* if (title) res.end(`Send from client and got from server: ${title}`); */ // почему так не работает?
  }
});

server.listen(port, () => console.log("теперь работает"));
