# ModsenPractice

## Функционал Web API

1. Получение списка всех митапов; // get
2. Получение определённого митапа по его Id; // get
3. Регистрация нового митапа; // post
4. Изменение информации о существующем митапе; // patch
5. Удаление митапа. // delete

## Информация о митапе

1. Название / тема;
2. Описание;
3. Набор тегов / ключевых слов;
4. Время и место проведения.

## Стек

1. Node.js;
2. Express;
3. PostgreSQL 14.

## Дополнительный функционал

1. Валидация DTO (достаточно будет использовать joi).
2. Переработать запрос на получение списка митапов так, чтобы с его помощью можно было осуществить поиск по митапам, отфильтровать их, отсортировать. Результат также должен быть разбит на страницы.
3. Добавить документацию к API через Swagger.
4. Система аутентификации (предлагается к использованию библиотека PassportJS). Систему аутентификации можно разрабатывать поэтапно, постепенно расширяя и усложняя её:
   - Пользователь регистрируется, авторизуется (получая JWT Access Token). Используя Access Token можно получить информацию о владельце токена (т.е. получить текущего пользователя по токену) и записаться на митап.
   - Добавить персистентный JWT Refresh Token.
   - Разделить авторизованных пользователей на 2 типа: обычные пользователи (описаны в пунке 3.a) и организаторы митапов (только они могут регистрировать новые митапы, редактировать/удалять зарегистрированные ими митапы)

## Примечания

1. Очень часто допускаются следующие проблемы:
   - Качество кода (в том числе нейминг и форматирования) оставляют желать лучшего;
   - Некорректно ведётся работа с Git (указан не тот email пользователя, весь код залит 1м коммитом, закоммичены не те файлы);
   - DTO не используются вообще, или используются некорректно
   - Нарушается REST принцип, или общие правила использования HTTP методов, статус кодов и, особенно, правила формирования URL
2. Не стоит разрабатывать большое и сложное решение. Начните с простого – напишите весь код в сразу контроллерах, приведите его в порядок. Если после этого у вас останется время и желание для усовершенствования задания, обратите внимание на возможные направления расширения (описаны далее). Приступайте к решению архитектурно-организационных вопросов только если вы полностью реализовали все перечисленные расширения.
3. Внимательно читайте описание задания – задание состоит в том, чтобы реализовать REST Web API, а не полноценное Full Stack Web приложение (не нужно добавлять веб-интерфейс).

docker-compose up --build
docker-compose exec app npx sequelize-cli db:migrate
