const { default: axios } = require('axios');
const { v7: uuidv7 } = require('uuid');

const { parseQuery } = require("./queryParser");
const repo = require("../database/profileRepo");

const countryNames = {
  NG: "Nigeria",
  KE: "Kenya",
  AO: "Angola",
  UG: "Uganda",
  TZ: "Tanzania"
};

async function createProfile(name) {

  const cleanName = name.trim().toLowerCase();

  // Check duplicate
  const profile_exist = await repo.findByName(cleanName);
  if (profile_exist) {
    return {
      statusCode: 200,
      message: "Profile already exists",
      data: profile_exist
    };
  }

  // External APIs in parallel
  const [genderRes, ageRes, countryRes] = await Promise.all([
    axios.get(`https://api.genderize.io?name=${cleanName}`),
    axios.get(`https://api.agify.io?name=${cleanName}`),
    axios.get(`https://api.nationalize.io?name=${cleanName}`)
  ]);

  const genderData = genderRes.data;
  const ageData = ageRes.data;
  const countryData = countryRes.data;



  // Validation
  if (!genderData.gender || genderData.count === 0) {
    // throw new Error("Genderize returned an invalid response");
      throw {
        type: "EXTERNAL",
        source: "Genderize",
        message: "Genderize returned an invalid response"
      };
  }

  if (!ageData.age) {
    // throw new Error("Agify returned an invalid response");
      throw {
        type: "EXTERNAL",
        source: "Agify",
        message: "Agify returned an invalid response"
      };
  }

  if (!countryData.country || countryData.country.length === 0) {
    // throw new Error("Nationalize returned an invalid response");
    throw {
        type: "EXTERNAL",
        source: "Nationalize",
        message: "Nationalize returned an invalid response"
      };
  }

  // Age group
  let age_group;
  if (ageData.age <= 12) age_group = "child";
  else if (ageData.age <= 19) age_group = "teenager";
  else if (ageData.age <= 59) age_group = "adult";
  else age_group = "senior";

  // Top country
  const topCountry = countryData.country[0];

  // Build profile
  const profile = {
    id: uuidv7(),
    name: cleanName,
    gender: genderData.gender.toLowerCase(),
    gender_probability: genderData.probability,
    sample_size: genderData.count,
    age: ageData.age,
    age_group,
    country_id: topCountry.country_id,
    country_name: countryNames[topCountry.country_id] || "Unknown",
    country_probability: topCountry.probability,
    created_at: new Date().toISOString()
  };

  // Save to DB
  await repo.insertProfile(profile);

  return {
    statusCode: 201,
    data: profile
  };
}

async function getAllProfiles(filters) {
  const result = await repo.getAll(filters);

  return result;
}

async function getProfileById(id) {
  const profile = await repo.findById(id);

  return profile;
}

async function deleteProfile(id) {
  const deleted = await repo.deleteProfile(id);

  return deleted;
}

async function searchProfiles(queryParams) {
  const { q, page, limit } = queryParams;

  const filters = parseQuery(q);

  filters.page = page;
  filters.limit = limit;

  const result = repo.getAll(filters);

  return result;
}

module.exports = {
  createProfile,
  getAllProfiles,
  getProfileById,
  deleteProfile,
  searchProfiles
};
