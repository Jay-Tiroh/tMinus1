
const fs = require('fs');

const src = process.env.GOOGLE_SERVICES_JSON;
const dest = './android/app/google-services.json';

if (src && fs.existsSync(src)) {
  fs.copyFileSync(src, dest);
  console.log('google-services.json copied into android/app/');
} else {
  console.warn('GOOGLE_SERVICES_JSON not found — using local file if present.');
}
