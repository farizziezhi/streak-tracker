import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'streak_records'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.integer('user_id').unsigned().notNullable()
      table.date('date_recorded').notNullable()
      
      table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE')
      table.unique(['user_id', 'date_recorded'])
      
      table.timestamps(true, true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}