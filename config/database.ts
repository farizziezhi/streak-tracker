import env from '#start/env'
import { defineConfig } from '@adonisjs/lucid'

const dbConfig = defineConfig({
  connection: 'mysql',
  connections: {
    mysql: {
      client: 'mysql2',
      connection: env.get('DATABASE_URL') || {
        host: env.get('MYSQLHOST') || env.get('DB_HOST') || 'localhost',
        port: env.get('MYSQLPORT') || env.get('DB_PORT') || 3306,
        user: env.get('MYSQLUSER') || env.get('DB_USER') || 'root',
        password: env.get('MYSQLPASSWORD') || env.get('DB_PASSWORD') || '',
        database: env.get('MYSQLDATABASE') || env.get('DB_DATABASE') || 'streak_tracker',
      },
      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
      },
    },
  },
})

export default dbConfig
