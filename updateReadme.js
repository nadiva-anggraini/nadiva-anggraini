import fs from 'fs';
const fetch = (await import('node-fetch')).default;

// Ganti dengan username GitHub Anda
const username = 'nadiva-anggraini';
const readmeFilePath = 'README.md';

async function getDistinctContributionDays() {
    const response = await fetch(`https://api.github.com/users/${username}/events`);
    if (!response.ok) {
        throw new Error('Failed to fetch events');
    }
    const events = await response.json();

    const distinctContributionDays = new Set();

    // Mengambil tanggal dari setiap event
    events.forEach(event => {
        const date = new Date(event.created_at).toISOString().split('T')[0];
        distinctContributionDays.add(date);  // Menghitung hari yang unik untuk kontribusi
    });

    return distinctContributionDays.size;
}

async function updateReadme() {
    try {
        const distinctDaysCount = await getDistinctContributionDays();
        const readmeContent = fs.readFileSync(readmeFilePath, 'utf-8');

        // Mencari dan mengganti baris Total Distinct Days of Contribution
        const updatedContent = readmeContent
            .replace(/(## Total Distinct Days of Contribution: )\d+/, `$1${distinctDaysCount}`);

        // Menyimpan perubahan ke README.md
        fs.writeFileSync(readmeFilePath, updatedContent, 'utf-8');
        console.log(`Updated README.md with Total Distinct Days of Contribution: ${distinctDaysCount}`);
    } catch (error) {
        console.error(error);
    }
}

updateReadme();
