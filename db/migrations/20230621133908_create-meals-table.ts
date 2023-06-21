import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('meals', (table) => {
        table.uuid('meal_id').primary()
        table.uuid('user_id').notNullable()
        table.text('meal_name').notNullable()
        table.text('meal_description').notNullable()
        table.text('date').defaultTo(knex.fn.now()).notNullable()
        table.boolean('inside_diet').notNullable()      
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('meals')
}

