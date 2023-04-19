const knex = require('./knex');

class Owner {
  constructor({ id, name, age }, pets) {
    this.id = id;
    this.name = name;
    this.age = age;
    if (Array.isArray(pets)) this.pets = pets;
  }

  static renameJoinProperties = (row) => ({
    id: row.ownerId,
    name: row.ownerName,
    age: row.ownerAge,
  });

  static async list() {
    const query = `select * from owners;`;
    const { rows } = await knex.raw(query);
    return rows.map((row) => new Owner(row));
  }

  static async create(name, age) {
    const query = `INSERT INTO owners (name, age) values (?, ?) RETURNING *;`;
    const { rows: [owner] } = await knex.raw(query, [name, age]);
    console.log('owner:', owner);
    return new Owner(owner);
  }

  static async find(id) {
    const query = `select * from owners where id = ?;`;
    const { rows: [owner] } = await knex.raw(query, [id]);
    return owner ? new Owner(owner) : null;
  }

  static async findWithPets(ownerId, Pet) {
    const query = `
    SELECT
      owners.id "ownerId", owners.name "ownerName", owners.age "ownerAge",
      pets.id "petId", pets.name "petName", pets.species "petSpecies", pets.is_hungry "petIsHungry"
    FROM owners
    JOIN owner_pets
    ON owners.id = owner_pets.owner_id
    JOIN pets
    ON owner_pets.pet_id = pets.id
    WHERE owners.id = ?;`;

    const { rows } = await knex.raw(query, [ownerId]);
    console.log('rows:', rows);
    const ownerProperties = Owner.renameJoinProperties(rows[0]);
    if (!rows.length) return null;
    const pets = rows.map((row) => {
      const petProperties = Pet.renameJoinProperties(row);
      return new Pet(petProperties);
    });
    return new Owner(ownerProperties, pets);
  }

  // This is not a static method, it's an instance method!
  async createPet(petName, petSpecies, Pet) {
    // look, we're doing something a little tough, so we're using 2 queries
    // that's ok for complex creations, but when SELECTing, try to keep it to one
    const createPetQuery = `INSERT INTO pets (name, species) VALUES (?, ?) RETURNING *;`;
    const { rows: [pet] } = await knex.raw(createPetQuery, [petName, petSpecies]);

    const associatePetQuery = `INSERT INTO owner_pets (owner_id, pet_id) VALUES (?, ?);`;
    await knex.raw(associatePetQuery, [this.id, pet.id]);

    return new Pet(pet); // return the pet, not the join table row
  }

  async addPet(petId) {
    const associatePetQuery = `INSERT INTO owner_pets (owner_id, pet_id) VALUES (?, ?);`;
    await knex.raw(associatePetQuery, [this.id, petId]);
    return true; // return the pet, not the join table row
  }

  // This is not a static method, it's an instance method!
  async findPets(Pet) {
    // Notice that if we don't need the owner's properties,
    // we don't need to join the owners table
    const query = `
    SELECT
      pets.id "petId", pets.name "petName", pets.species "petSpecies", pets.is_hungry "petIsHungry"
    FROM pets
    JOIN owner_pets
    ON pets.id = owner_pets.pet_id
    WHERE owner_pets.owner_id = ?;`;

    const { rows } = await knex.raw(query, [this.id]);
    return rows.map((row) => {
      const petProperties = Pet.renameJoinProperties(row);
      return new Pet(petProperties);
    });
  }

  async getPets(Pet) {
    const query = `
    SELECT
      owners.id "ownerId", owners.name "ownerName", owners.age "ownerAge",
      pets.id "petId", pets.name "petName", pets.species "petSpecies", pets.is_hungry "petIsHungry"
    FROM owners
    JOIN owner_pets
    ON owners.id = owner_pets.owner_id
    JOIN pets
    ON owner_pets.pet_id = pets.id
    WHERE owners.id = ?;`;

    const { rows } = await knex.raw(query, [this.id]);
    const ownerProperties = Owner.renameJoinProperties(rows[0]);
    if (!rows.length) return null;
    const pets = rows.map((row) => {
      const petProperties = Pet.renameJoinProperties(row);
      return new Pet(petProperties);
    });
    return new Owner(ownerProperties, pets);
  }
}

module.exports = Owner;
