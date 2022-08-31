<p align="center"><img src="https://i.imgur.com/a9QWW0v.png"></p>

## Usage

### Create an App

```
# with npx
$ npx create-nextron-app my-app --example with-typescript-tailwindcss

# with yarn
$ yarn create nextron-app my-app --example with-typescript-tailwindcss

# with pnpx
$ pnpx create-nextron-app my-app --example with-typescript-tailwindcss
```

### Install Dependencies

```
$ cd my-app

# using yarn or npm
$ yarn (or `npm install`)

# using pnpm
$ pnpm install --shamefully-hoist
```

### Use it

```
# development mode
$ yarn dev (or `npm run dev` or `pnpm run dev`)

# production build
$ yarn build (or `npm run build` or `pnpm run build`)
```

## Database File Location

The SQLite database file is found in different locations on different platforms:

### Windows

Development: `%APPDATA%\time-tracking (development)\timetracking.sqlite`  

Production: `%APPDATA%\time-tracking\timetracking.sqlite`

### Linux

TODO

### MacOS

TODO

## Creating a Knex Migration

```
cd main
npx knex migrate:make whatever_you_want_to_name_it
```

## Running Database Migrations

You can manually run database migrations on a SQLite database from the command line. For example:

```
cd main
npx knex migrate:latest --connection '%APPDATA%\time-tracking (development)\timetracking.sqlite' 
```

You can also roll back migrations:

```
cd main
npx knex migrate:rollback --connection '%APPDATA%\time-tracking (development)\timetracking.sqlite' 
```
