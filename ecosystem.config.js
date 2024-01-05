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
          PORT: 3001, // Задайте нужный вам порт
        },
        env_production: {
          NODE_ENV: 'production',
          PORT: 3001, // Задайте нужный вам порт
        },
      },
    ],
  };
  