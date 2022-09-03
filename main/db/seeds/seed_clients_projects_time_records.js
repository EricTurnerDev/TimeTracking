const path = require('path');
const csv = require('csvtojson');

async function seedClients(knex) {
  const seedFile = path.join(__dirname, '..', 'seed-data', 'clients.csv');
  const clients = await csv().fromFile(seedFile);
  await knex('clients').insert(clients);
}

async function seedProjects(knex) {
  const seedFile = path.join(__dirname, '..', 'seed-data', 'projects.csv');
  const projects = await csv().fromFile(seedFile);
  await knex('projects').insert(projects);
}

async function seedTimeRecords(knex) {
  const seedFile = path.join(__dirname, '..', 'seed-data', 'time_records.csv');
  const timeRecords = await csv().fromFile(seedFile);
  await knex('time_records').insert(timeRecords);
}

exports.seed = async function(knex) {
  await seedClients(knex);
  await seedProjects(knex);
  await seedTimeRecords(knex);
};
