// const countries = require("../utils/countries");

// function parseQuery(q) {
//   if (!q || typeof q !== "string") {
//     throw new Error("Unable to interpret query");
//   }

//   const text = q.toLowerCase();

//   const filters = {};

//     // rules
//     if (text.includes("male") && text.includes("female")) {
//         // no gender filter
//     } else if (text.includes("female")) {
//         filters.gender = "female";
//     } else if (text.includes("male")) {
//         filters.gender = "male";
//     }
    
//     if (text.includes("child")) {
//         filters.age_group = "child";
//     }

//     if (text.includes("teen")) {
//         filters.age_group = "teenager";
//     }

//     if (text.includes("adult")) {
//         filters.age_group = "adult";
//     }

//     if (text.includes("senior")) {
//         filters.age_group = "senior";
//     }

//     if (text.includes("young")) {
//         filters.min_age = 16;
//         filters.max_age = 24;
//     }

//     const aboveMatch = text.match(/above (\d+)/);
//     if (aboveMatch) {
//         filters.min_age = Number(aboveMatch[1]);
//     }

//     for (const country in countries) {
//         if (text.includes(country)) {
//             filters.country_id = countries[country];
//         }
//     }

//     if (Object.keys(filters).length === 0) {
//         throw new Error("Unable to interpret query");
//     }

//   return filters;
// }

// module.exports = { parseQuery };

const countries = require("../utils/countries");

function parseQuery(q) {
  if (!q || typeof q !== "string") {
    throw new Error("Unable to interpret query");
  }

  const text = q.toLowerCase();
  const filters = {};

  // =====================
  // GENDER 
  // =====================

  if (text.includes("female")) {
    filters.gender = "female";
  } else if (text.includes("male")) {
    filters.gender = "male";
  }

  // =====================
  // AGE GROUPS
  // =====================

  if (text.includes("child")) filters.age_group = "child";
  if (text.includes("teen")) filters.age_group = "teenager";
  if (text.includes("adult")) filters.age_group = "adult";
  if (text.includes("senior")) filters.age_group = "senior";

  // =====================
  // NATURAL LANGUAGE RULES
  // =====================

  if (text.includes("young")) {
    filters.min_age = 16;
    filters.max_age = 24;
  }

  const aboveMatch = text.match(/above (\d+)/);
  if (aboveMatch) {
    filters.min_age = Number(aboveMatch[1]);
  }

  // =====================
  // COUNTRIES
  // =====================

  for (const country in countries) {
    if (text.includes(country)) {
      filters.country_id = countries[country];
    }
  }

  // =====================
  // VALIDATION
  // =====================

  if (Object.keys(filters).length === 0) {
    throw new Error("Unable to interpret query");
  }

  return filters;
}

module.exports = { parseQuery };