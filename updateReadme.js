import fs from 'fs';
const fetch = (await import('node-fetch')).default;

// Ganti dengan username GitHub Anda
const username = 'nadiva-anggraini';
const readmeFilePath = 'README.md';

async function getActivityDays() {
    const response = await fetch(`https://api.github.com/users/${username}/events`);
    if (!response.ok) {
        throw new Error('Failed to fetch events');
    }
    const events = await response.json();
    
    const uniqueDays = new Set();
    const distinctDays = new Set();

    events.forEach(event => {
        const date = new Date(event.created_at).toISOString().split('T')[0];
        uniqueDays.add(date);  // Menghitung unique days
        distinctDays.add(date); // Menghitung distinct days (jika semua jenis event diinginkan)
    });

    return {
        uniqueDaysCount: uniqueDays.size,
        distinctDaysCount: distinctDays.size
    };
}

async function updateReadme() {
    try {
        const { uniqueDaysCount, distinctDaysCount } = await getActivityDays();
        const readmeContent = fs.readFileSync(readmeFilePath, 'utf-8');

        // Mencari dan mengganti baris Total Unique Days dan Total Distinct Days
        const updatedContent = readmeContent
            .replace(/(## Total Unique Days of Activity: )\d+/, `$1${uniqueDaysCount}`)
            .replace(/(## Total Distinct Days of Activity: )\d+/, `$1${distinctDaysCount}`);

        // Menyimpan perubahan ke README.md
        fs.writeFileSync(readmeFilePath, updatedContent, 'utf-8');
        console.log(`Updated README.md with Total Unique Days: ${uniqueDaysCount} and Total Distinct Days: ${distinctDaysCount}`);
    } catch (error) {
        console.error(error);
    }
}

updateReadme();
