import fs from 'fs';
const fetch = (await import('node-fetch')).default;

// Ganti dengan username GitHub Anda
const username = 'nadiva-anggraini';
const readmeFilePath = 'README.md';

async function getDistinctCommitDays() {
    // Mendapatkan semua repository milik user
    const reposResponse = await fetch(`https://api.github.com/users/${username}/repos`);
    if (!reposResponse.ok) {
        throw new Error('Failed to fetch repositories');
    }
    const repos = await reposResponse.json();

    const distinctCommitDays = new Set();

    // Mendapatkan commit dari setiap repository
    for (const repo of repos) {
        const commitsResponse = await fetch(`https://api.github.com/repos/${username}/${repo.name}/commits`);
        if (!commitsResponse.ok) {
            console.warn(`Failed to fetch commits for ${repo.name}`);
            continue; // Lanjutkan jika ada error untuk repository tertentu
        }
        const commits = await commitsResponse.json();

        // Mengambil tanggal dari setiap commit
        commits.forEach(commit => {
            const date = new Date(commit.commit.author.date).toISOString().split('T')[0];
            distinctCommitDays.add(date);  // Menghitung hari yang unik untuk commit
        });
    }

    return distinctCommitDays.size;
}

async function updateReadme() {
    try {
        const distinctDaysCount = await getDistinctCommitDays();
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
