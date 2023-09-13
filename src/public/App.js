console.log(
  "This from App.js, from client's side, and log form browser console. Need to make `public` as static for reading."
);

// МАКС, ЧТОБЫ РАБОТАЛО, ПЕРЕЙДИ В ПАПКУ src.

// После вывода поста в браузере добавляем событие удаления нативом:

document.addEventListener("click", (ev) => {
  if (ev.target.dataset.type === "remove") {
    //
    ev.target.closest("li").remove(); // при клике на клиенте удаляется запись. Теперь надо очистить БД на сервере.

    // id нужен для проверки и fetch запроса
    const id = ev.target.dataset.id;
    /* console.log("remove id: ", id); */ // теперь при клике в консоли браузера вылазит id

    // Удаление на сервере через fetch (отправка delete запроса)
    remove(id);
  }
  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // ++++++++++++++++++ Домашка, редактирование заметки ++++++++++++++++++++
  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  if (ev.target.dataset.type === "edit") {
    //
    const newTitle = { title: prompt() };
    // Форматирование в ЖСОН, но вроде бы не работает, потому что миддлвеир по умолчанию
    // обрабатывает апликейшн\жсон, а у меня не работало, и заработал лишь "text"
    const newTitleInJSON = JSON.stringify(newTitle);
    /* console.log(newTitle, newTitleInJSON); */ // www "www"

    const id = ev.target.dataset.id;

    // Изменение в ДОМе (на клиенте)
    /* console.log(ev.target.closest("li").querySelector("p")); */
    ev.target.closest("li").querySelector("p").textContent = newTitle.title;

    // Добавление в БД сервера через fetch (отправка put запроса)
    edit(id, newTitleInJSON);
  }
});

const remove = async (id) => {
  await fetch(`/${id}`, { method: "DELETE" });
};

// Домаха
const edit = async (id, title) => {
  console.log(id, title, 222); // 1694457583232 {"title":"222"}
  await fetch(`/${id}`, { method: "PUT", body: title });
};
