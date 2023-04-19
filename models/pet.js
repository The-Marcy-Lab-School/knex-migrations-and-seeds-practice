const knex = require('./knex');

class Pet {
  constructor({ id, name, species, is_hungry }) {
    this.id = id;
    this.name = name;
    this.species = species;
    this.isHungry = is_hungry;
  }

  // this is not ideal, these properties have to match the hardcoded
  // strings in Owner, when using ORMs or knex Queries we can
  // get around this but for now we have to do it manually
  static renameJoinProperties = (row) => ({
    id: row.petId,
    name: row.petName,
    species: row.petSpecies,
    is_hungry: row.petIsHungry,
  });

  static async list() {
    const query = `select * from pets;`;
    const { rows } = await knex.raw(query);
    console.log(rows);
    return rows;
  }

  static async find(id) {
    const query = `select * from pets WHERE id = ?;`;
    const { rows: [pet] } = await knex.raw(query, [id]);
    return pet ? new Pet(pet) : null;
  }
}

module.exports = Pet;
