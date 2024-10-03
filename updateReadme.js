const fs = require('fs');
const fetch = require('node-fetch');

// Ganti dengan username GitHub Anda
const username = 'nadiva-anggraini';
const readmeFilePath = 'README.md';

async function getUniqueDays() {
    const response = await fetch(`https://api.github.com/users/${username}/events`);
    if (!response.ok) {
        throw new Error('Failed to fetch events');
    }
    const events = await response.json();
    const uniqueDays = new Set();

    events.forEach(event => {
        const date = new Date(event.created_at).toISOString().split('T')[0];
        uniqueDays.add(date);
    });

    return uniqueDays.size;
}

async function updateReadme() {
    try {
        const uniqueDays = await getUniqueDays();
        const readmeContent = fs.readFileSync(readmeFilePath, 'utf-8');

        // Mencari dan mengganti baris Total Unique Days
        const updatedContent = readmeContent.replace(/(## Total Unique Days of Activity: )\d+/, `$1${uniqueDays}`);

        // Menyimpan perubahan ke README.md
        fs.writeFileSync(readmeFilePath, updatedContent, 'utf-8');
        console.log(`Updated README.md with Total Unique Days: ${uniqueDays}`);
    } catch (error) {
        console.error(error);
    }
}

updateReadme();

