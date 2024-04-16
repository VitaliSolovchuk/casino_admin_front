// const dotenv = require('dotenv');

// Определяем, в каком режиме запущено приложение
// const isProduction = process.env.NODE_ENV === 'production';

// Загружаем переменные окружения из соответствующего файла
// dotenv.config({ path: isProduction ? '.env.prod' : '.env.dev' });

module.exports = {
  apps: [
    {
      name: 'casino_admin_panel_front',
      script: 'node_modules/.bin/react-scripts',
      args: 'start',
      exec_mode: 'fork', // или 'cluster' в зависимости от ваших потребностей
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development',
        PORT: 4000, // Задайте нужный вам порт
        // REACT_APP_BASE_URL: process.env.REACT_APP_BASE_URL,
        REACT_APP_BASE_URL: 'https://dev.jetgames.io',
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 4000, // Задайте нужный вам порт
        // REACT_APP_BASE_URL: process.env.REACT_APP_BASE_URL,
        REACT_APP_BASE_URL: 'https://prod.jetgames.io',
      },
    },
  ],
};
