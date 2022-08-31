// TODO: Figure out how to enforce the project for the time record to be one of the client's projects. Otherwise
//       we could mistakenly assign a project from a different client.

exports.up = function(knex) {
    return knex.schema.createTable('clients', (table) => {
        table.increments('id').primary();
        table.string('client_name').unique().notNullable();
    }).createTable('projects', (table) => {
        table.increments('id').primary();
        table.string('project_name').notNullable();
        table.integer('client_id')
            .references('clients.id')
            .onUpdate('CASCADE')
            .onDelete('CASCADE')
            .notNullable();
        table.unique(['project_name', 'client_id']);
    }).createTable('time_records', (table) => {
        table.increments('id').primary();
        table.boolean('billable').notNullable().defaultTo(false); // defaultTo doesn't work with sqlite3
        table.timestamp('start_ts').notNullable().defaultTo(knex.fn.now()); // defaultTo doesn't work with sqlite3
        table.timestamp('end_ts').notNullable().defaultTo(knex.fn.now()); // defaultTo doesn't work with sqlite3
        table.decimal('adjustment', 2, 4).notNullable().defaultTo(0.0); // defaultTo doesn't work with sqlite3
        table.text('invoice_activity');
        table.text('work_description');
        table.text('notes');
        table.integer('client_id')
            .references('clients.id')
            .onUpdate('CASCADE')
            .onDelete('CASCADE')
            .notNullable();
        table.integer('project_id')
            .references('projects.id')
            .onDelete('SET NULL');
        table.check('?? >= ??', ['end_ts', 'start_ts']);
    })
};

exports.down = function(knex) {
    return knex.schema
        .dropTable('time_records')
        .dropTable('projects')
        .dropTable('clients');
};
