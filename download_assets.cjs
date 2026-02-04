const fs = require('fs');
const https = require('http'); // Wayback redirects to https usually, but the URL is http://web.archive.org...
const { exec } = require('child_process');

const assets = [
    { url: "http://web.archive.org/web/20251016222004im_/https://storage.googleapis.com/msgsndr/O8tlYEQIUn4z3qPCt1FX/media/688019c09a4c2d4b4398bf3c.png", file: "src/assets/logo.png" },
    { url: "http://web.archive.org/web/20251016222004im_/https://storage.googleapis.com/msgsndr/O8tlYEQIUn4z3qPCt1FX/media/689697db3b96f7dfadc2b0c6.png", file: "src/assets/icon-leads.png" },
    { url: "http://web.archive.org/web/20251016222004im_/https://storage.googleapis.com/msgsndr/O8tlYEQIUn4z3qPCt1FX/media/689697db6346f41abf5634f5.png", file: "src/assets/icon-comm.png" },
    { url: "http://web.archive.org/web/20251016222004im_/https://storage.googleapis.com/msgsndr/O8tlYEQIUn4z3qPCt1FX/media/689697db48d9ff2bd218bab5.png", file: "src/assets/icon-sales.png" },
    { url: "http://web.archive.org/web/20251016222004im_/https://storage.googleapis.com/msgsndr/O8tlYEQIUn4z3qPCt1FX/media/689697db6346f46b0a5634f3.png", file: "src/assets/icon-auto.png" },
    { url: "http://web.archive.org/web/20251016222004im_/https://storage.googleapis.com/msgsndr/O8tlYEQIUn4z3qPCt1FX/media/689697dba1ed26466abb3609.png", file: "src/assets/icon-bot.png" },
    { url: "http://web.archive.org/web/20251016222004im_/https://storage.googleapis.com/msgsndr/O8tlYEQIUn4z3qPCt1FX/media/689697da6346f473045634f2.png", file: "src/assets/icon-dash.png" }
];

const download = (url, dest) => {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        const request = https.get(url, (response) => {
            // Handle redirects
            if (response.statusCode === 301 || response.statusCode === 302 || response.statusCode === 307 || response.statusCode === 308) {
                download(response.headers.location, dest).then(resolve).catch(reject);
                return;
            }
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to download ${url}, status code: ${response.statusCode}`));
                return;
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close(() => resolve(dest));
            });
        }).on('error', (err) => {
            fs.unlink(dest, () => reject(err));
        });
    });
};

(async () => {
    for (const asset of assets) {
        try {
            console.log(`Downloading ${asset.file}...`);
            await download(asset.url, asset.file);
            console.log(`Successfully downloaded ${asset.file}`);
        } catch (error) {
            console.error(`Error downloading ${asset.file}:`, error.message);
        }
    }
})();
