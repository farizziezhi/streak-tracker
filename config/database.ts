import env from '#start/env'
import { defineConfig } from '@adonisjs/lucid'

const dbConfig = defineConfig({
  connection: 'mysql',
  connections: {
    mysql: {
      client: 'mysql2',
      connection: {
        host: env.get('MYSQLHOST') || env.get('DB_HOST'),
        port: env.get('MYSQLPORT') || env.get('DB_PORT'),
        user: env.get('MYSQLUSER') || env.get('DB_USER'),
        password: env.get('MYSQLPASSWORD') || env.get('DB_PASSWORD'),
        database: env.get('MYSQLDATABASE') || env.get('DB_DATABASE'),
      },
      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
      },
    },
  },
})

export default dbConfig
