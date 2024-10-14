const dotenv = require('dotenv');

// Определяем, в каком режиме запущено приложение

// Загружаем переменные окружения из соответствующего файла
dotenv.config();

module.exports = {
  apps: [
    {
      name: 'admin',
      script: 'node_modules/.bin/react-scripts',
      args: 'start',
      exec_mode: 'fork', // или 'cluster' в зависимости от ваших потребностей
      instances: 1,
      autorestart: true,
      watch: true,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development',
        PORT: 4000, // Задайте нужный вам порт
        REACT_APP_BASE_URL: process.env.REACT_APP_BASE_URL,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 4000, // Задайте нужный вам порт
        REACT_APP_BASE_URL: process.env.REACT_APP_BASE_URL_PROD,
      },
    },
  ],
};
