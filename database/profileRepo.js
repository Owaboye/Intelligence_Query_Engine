const db = require("./db");

const ALLOWED_SORT_FIELDS = [
  "age",
  "created_at",
  "gender_probability"
];

const ALLOWED_ORDER = ["asc", "desc"];

function insertProfile(profile) {
  const stmt = db.prepare(`
    INSERT INTO profiles 
    (id,name,gender,gender_probability,age,age_group,country_id,country_name,country_probability,created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?)
  `);

  stmt.run(
    profile.id,
    profile.name,
    profile.gender,
    profile.gender_probability,
    profile.age,
    profile.age_group,
    profile.country_id,
    profile.country_name,
    profile.country_probability,
    profile.created_at
  );

  return profile;
}


function findByName(name) {
  const stmt = db.prepare(`SELECT * FROM profiles WHERE name = ?`);
  return stmt.get(name);
}

function findById(id) {
  const stmt = db.prepare(`SELECT * FROM profiles WHERE id = ?`);
  return stmt.get(id);
}


function getAll(filters = {}) {
  // let query = "SELECT * FROM profiles WHERE 1=1";
  let query = "FROM profiles WHERE 1=1";
  
  const params = [];

  // Filtering

  if (filters.gender) {
    query += " AND LOWER(gender) = ?";
    params.push(filters.gender);
  }

  if (filters.country_id) {
    query += " AND LOWER(country_id) = LOWER(?)";
    params.push(filters.country_id);
  }

  if (filters.age_group) {
    query += " AND LOWER(age_group) = LOWER(?)";
    params.push(filters.age_group);
  }

  if (filters.min_age){
    query += " AND age >= ?";
    params.push(Number(filters.min_age))
  }

  if (filters.max_age){
    query += " AND age <= ?";
    params.push(Number(filters.max_age))
  }

  if (filters.min_gender_probability){
    query += " AND gender_probability >= ?";
    params.push(Number(filters.min_gender_probability)); 
  }

  if (filters.min_country_probabilit){
    query += " AND country_probability >= ?";
    params.push(Number(filters.min_country_probability));
  }

  // Sorting
  let sortBy = "created_at"; // default
  let order = "desc";        // default

  if (filters.sort_by && ALLOWED_SORT_FIELDS.includes(filters.sort_by)) {
    sortBy = filters.sort_by;
  }

  if (filters.order && ALLOWED_ORDER.includes(filters.order.toLowerCase())) {
    order = filters.order.toUpperCase();
  } else {
    order = order.toUpperCase(); // default DESC
  }

   // Count Query
  const countQuery = `SELECT COUNT(*) as total ${query}`;
  const total = db.prepare(countQuery).get(...params).total;

  // Paginate
  const page = Math.max(Number(filters.page) || 1, 1);
  const limit = Math.min(Number(filters.limit) || 10, 50);

  const offset = (page - 1) * limit;

  const total_pages = Math.ceil(total / limit);

//  query += ` ORDER BY ${sortBy} ${order} LIMIT ? OFFSET ?`;

//   const data = db.prepare(query).all(...params, limit, offset);

  const dataQuery = `
    SELECT * ${query}
    ORDER BY ${sortBy} ${order}
    LIMIT ? OFFSET ?
  `;

  const data = db.prepare(dataQuery).all(...params, limit, offset);

  return {
    page,
    limit,
    total,
    data
  };

  // const stmt = db.prepare(query);
  // return stmt.all(...params);
}

function deleteProfile(id) {
  const stmt = db.prepare(`DELETE FROM profiles WHERE id = ?`);
  const result = stmt.run(id);
  return result.changes > 0;
}
module.exports = {
  insertProfile,
  findByName,
  findById,
  getAll,
  deleteProfile
};