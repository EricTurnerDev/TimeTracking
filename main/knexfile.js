// When running knex migrations from the command line, you must be in the main/ directory, so it can find this
// knexfile.js file. It will find the migration and seed files underneath ./db/migrations/ and ./db/seeds/ specified
// in the migrations.directory and seeds.directory properties defined in this file.
//
// When running knex migrations from the code, the code must change migrations.directory and seeds.directory
// to be from the root of the application (e.g. main/db/migrations). You can see this happening in main/db/knex.ts.
// This works fine when running locally in development mode because the files exist in those locations, but when
// the project is built, the migration files and seed files have to be explicitly added to main/db/migrations and main/db/seeds
// in the built app. We accomplish this using the extraFiles option in electron-builder.yml.

// Note that we don't set the location of the SQLite database file here in the connection property because its location
// is based electron's userData path, which is only available when the application is running. When running migrations
// from the command line you must use the --connection option to tell knex where to find the SQLite database file (see
// the main README.md file in the project). When running the app, the code sets the connection property in the configuration
// so knex knows  where to find it (see main/db/knex.ts).

module.exports = {
    client: 'sqlite3',
    migrations: {
        directory: './db/migrations'
    },
    seeds: {
        directory: './db/seeds'
    },
    useNullAsDefault: true // Knex doesn't support default values with sqlite3 yet, so this suppresses that warning.
}