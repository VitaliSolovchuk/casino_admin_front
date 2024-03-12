const dotenv = require('dotenv');

// Load environment variables from .env.dev
dotenv.config({ path: '.env.dev' });
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
        REACT_APP_BASE_URL: process.env.REACT_APP_BASE_URL,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 4000, // Задайте нужный вам порт
        REACT_APP_BASE_URL: process.env.REACT_APP_BASE_URL,
      },
    },
  ],
};
