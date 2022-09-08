# Developer Notes

This document contains information relevant to people who
want to help with the development of Time Tracking.

## Database File Location

The SQLite database file is found in different locations on different platforms:

### Windows

Development: `%APPDATA%\time-tracking (development)\timetracking.sqlite`

Production: `%APPDATA%\time-tracking\timetracking.sqlite`

### Linux

Development: `$HOME/.config/time-tracking (development)/timetracking.sqlite`

Production: `$HOME/.config/time-tracking/timetracking.sqlite`

### MacOS

TODO

## Database Migrations

IMPORTANT: It is extremely important that changes to the database structure
are done automatically, and do not break existing databases. When users update
their version of Time Tracking, we must not cause damage to or loss of their data.

### Creating a Knex Migration

```shell
cd main
npx knex migrate:make whatever_you_want_to_name_it
```

### Running Database Migrations

You can manually run database migrations on a SQLite database from the command line. For example:

```shell
cd main
npx knex migrate:latest --connection '%APPDATA%\time-tracking (development)\timetracking.sqlite' 
```

You can also roll back migrations:

```shell
cd main
npx knex migrate:rollback --connection '%APPDATA%\time-tracking (development)\timetracking.sqlite' 
```

## Seeding the Database with Sample Data

### Running
WARNING: Only do this in development with a new (empty) database.

```shell
cd main
npx knex seed:run --connection '%APPDATA%\time-tracking (development)\timetracking.sqlite'
```

### Notes

The seed data is loaded by Knex from CSV files that I generated at mockaroo.com:

* clients: https://www.mockaroo.com/b35306e0
* projects: https://www.mockaroo.com/05adf630
* time_records: https://www.mockaroo.com/cc7412b0

Mockaroo doesn't have a way of ensuring unique values, so I had to go through these by hand to do that.

I generated the seed file using:

```shell
cd main
npx knex seed:make seed_clients_projects_time_records
```
Then I modified it to import the data from `main/db/seeds/clients.csv`, `main/db/seeds/projects.csv`, and
`main/db/seeds/time_records.csv`.
