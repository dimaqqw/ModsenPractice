# Используем официальный образ Node.js версии LTS (14.x в настоящее время)
FROM node:14

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /app

# Копируем package.json и package-lock.json (или yarn.lock, если используете Yarn)
COPY package*.json ./

# Устанавливаем зависимости проекта
RUN npm install

# Копируем все файлы проекта в текущую директорию внутри контейнера
COPY . .

# Опционально: если вам нужно выполнить какие-то дополнительные команды при сборке, добавьте их здесь

# Команда по умолчанию для запуска приложения
CMD ["node", "app.js"]  # Замените на ваш главный файл приложения, если он называется иначе
