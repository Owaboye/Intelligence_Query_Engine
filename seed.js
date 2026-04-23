const fs = require('fs');
const path = require('path');
const { v7: uuidv7 } = require('uuid');

const repo = require('./database/profileRepo');

const filePath = path.join(__dirname, 'seed_profiles.json');
const rawData = fs.readFileSync(filePath);
const jsonData = JSON.parse(rawData);

const profiles = jsonData.profiles

async function seed(){
    for (const item of profiles){
        try {
            const existingProfile = await repo.findByName(item.name.toLowerCase());

            if (existingProfile){
                console.log( `Skip: ${item.name}`);
                continue;
            }

            const profile = {
                id: uuidv7(),
                name: item.name.toLowerCase(),
                gender: item.gender,
                gender_probability: item.gender_probability,
                age: item.age,
                age_group: item.age_group,
                country_id: item.country_id,
                country_name: item.country_name, // NOW INCLUDED
                country_probability: item.country_probability,
                created_at: new Date().toISOString()
            }

            await repo.insertProfile(profile)

            console.log(`Inserted ${item.name}`);

        } catch (error) {
            console.log(`Error: ${item.name}`, error.message);
        }
    }

    console.log("Seeding complete");
}

seed()