import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Helper to read .env file or process.env for VITE_API_BASE_URL
function getApiBaseUrl() {
  if (process.env.VITE_API_BASE_URL) {
    return process.env.VITE_API_BASE_URL.trim().replace(/^['"]|['"]$/g, '');
  }

  const envPath = path.join(rootDir, '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/VITE_API_BASE_URL\s*=\s*(.*)/);
    if (match && match[1]) {
      return match[1].trim().replace(/^['"]|['"]$/g, '');
    }
  }

  return '';
}

async function fetchFromAppsScript(apiUrl, action, params = {}, retries = 3) {
  const cleanApiUrl = apiUrl.trim().replace(/^['"]|['"]$/g, '');
  const url = new URL(cleanApiUrl);
  url.searchParams.set('action', action);
  Object.keys(params).forEach(k => {
    if (params[k] !== undefined && params[k] !== null && params[k] !== '') {
      url.searchParams.set(k, params[k]);
    }
  });

  for (let attempt = 1; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 45000); // 45s for Apps Script cold starts

    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        signal: controller.signal
      });

      clearTimeout(timeout);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status} ${response.statusText}`);
      }

      const text = await response.text();
      let json;
      try {
        json = JSON.parse(text);
      } catch (parseErr) {
        throw new Error(`Invalid JSON received from Google Apps Script (${text.slice(0, 120)})`);
      }

      if (!json || typeof json !== 'object') {
        throw new Error('Empty response from Google Apps Script');
      }

      if (!json.success) {
        throw new Error(json.error || `Failed to fetch action "${action}"`);
      }

      return json.data;
    } catch (err) {
      clearTimeout(timeout);
      const isAbort = err.name === 'AbortError';
      const msg = isAbort ? `Request timed out after 45s (cold start)` : err.message;
      if (attempt < retries) {
        console.warn(`  ⚠️ Attempt ${attempt} failed for action "${action}": ${msg}. Retrying in 2s...`);
        await new Promise(resolve => setTimeout(resolve, 2000));
      } else {
        throw new Error(`Action "${action}" failed after ${retries} attempts: ${msg}`);
      }
    }
  }
}

// ----------------------------------------------------------------------------
// Strict Schema Validators
// ----------------------------------------------------------------------------

function normalizeBoolean(val) {
  if (typeof val === 'boolean') return val;
  if (typeof val === 'string') {
    const s = val.trim().toUpperCase();
    return s === 'TRUE' || s === '1' || s === 'YES';
  }
  return Boolean(val);
}

function validateSubjects(subjects) {
  if (!Array.isArray(subjects)) {
    throw new Error('Subjects data is not an array.');
  }
  const seenIds = new Set();
  for (const s of subjects) {
    if (!s.id || typeof s.id !== 'string') {
      throw new Error(`Subject missing valid "id": ${JSON.stringify(s)}`);
    }
    if (seenIds.has(s.id)) {
      throw new Error(`Duplicate Subject ID detected: "${s.id}"`);
    }
    seenIds.add(s.id);
    if (!s.name || typeof s.name !== 'string') {
      throw new Error(`Subject missing valid "name": ${JSON.stringify(s)}`);
    }
    if (!s.slug || typeof s.slug !== 'string') {
      throw new Error(`Subject missing valid "slug": ${JSON.stringify(s)}`);
    }
    s.published = normalizeBoolean(s.published);
  }
  return true;
}

function validateClasses(classes) {
  if (!Array.isArray(classes)) {
    throw new Error('Classes data is not an array.');
  }
  const seenIds = new Set();
  for (const c of classes) {
    if (!c.id || typeof c.id !== 'string') {
      throw new Error(`Class missing valid "id": ${JSON.stringify(c)}`);
    }
    if (seenIds.has(c.id)) {
      throw new Error(`Duplicate Class ID detected: "${c.id}"`);
    }
    seenIds.add(c.id);
    if (!c.subjectId || typeof c.subjectId !== 'string') {
      throw new Error(`Class "${c.title}" (${c.id}) missing valid "subjectId": ${JSON.stringify(c)}`);
    }
    if (!c.title || typeof c.title !== 'string') {
      throw new Error(`Class missing valid "title": ${JSON.stringify(c)}`);
    }
    c.published = normalizeBoolean(c.published);
  }
  return true;
}

function filterValidClasses(classes, subjects) {
  const publishedSubjectIds = new Set(
    subjects.filter(s => s.published).map(s => String(s.id))
  );

  const validClasses = [];
  for (const c of classes) {
    if (!c.subjectId) {
      console.warn(`  ⚠️ Warning: Class "${c.title}" (${c.id}) has missing subjectId. Skipping.`);
      continue;
    }
    if (!publishedSubjectIds.has(String(c.subjectId))) {
      console.warn(`  ⚠️ Warning: Class "${c.title}" (${c.id}) references unpublished or unknown subjectId "${c.subjectId}". Skipping.`);
      continue;
    }
    validClasses.push(c);
  }
  return validClasses;
}

function validateQuizzes(quizzes) {
  if (!Array.isArray(quizzes)) {
    throw new Error('Quizzes data is not an array.');
  }
  const seenIds = new Set();
  for (const q of quizzes) {
    if (!q.id || typeof q.id !== 'string') {
      throw new Error(`Quiz missing valid "id": ${JSON.stringify(q)}`);
    }
    if (seenIds.has(q.id)) {
      throw new Error(`Duplicate Quiz ID detected: "${q.id}"`);
    }
    seenIds.add(q.id);
    if (!q.title || typeof q.title !== 'string') {
      throw new Error(`Quiz missing valid "title": ${JSON.stringify(q)}`);
    }
    if (!q.subjectId || typeof q.subjectId !== 'string') {
      throw new Error(`Quiz missing valid "subjectId": ${JSON.stringify(q)}`);
    }
    q.published = normalizeBoolean(q.published);
  }
  return true;
}

function validateTrainer(profile) {
  if (!profile || typeof profile !== 'object') {
    throw new Error('Trainer profile is not an object.');
  }
  if (!profile.trainerName || typeof profile.trainerName !== 'string') {
    throw new Error('Trainer profile missing valid "trainerName".');
  }
  return true;
}

// ----------------------------------------------------------------------------
// Main Sync Routine
// ----------------------------------------------------------------------------

async function sync() {
  console.log('\n==================================================');
  console.log('🔄 Syncing public data from Google Sheets...');
  console.log('==================================================\n');

  const apiUrl = getApiBaseUrl();

  if (!apiUrl) {
    // Check if static data already exists
    const dataDir = path.join(rootDir, 'src', 'data');
    const existing = fs.existsSync(path.join(dataDir, 'subjects.json')) &&
                     fs.existsSync(path.join(dataDir, 'classes.json'));

    if (existing) {
      console.warn('⚠️  VITE_API_BASE_URL is not set. Preserving existing static JSON files for build.');
      return;
    } else {
      console.error('❌ VITE_API_BASE_URL not configured and no existing static JSON found.');
      process.exit(1);
    }
  }

  const dataDir = path.join(rootDir, 'src', 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  try {
    // 1. Fetch Subjects
    const rawSubjects = await fetchFromAppsScript(apiUrl, 'getSubjects');
    validateSubjects(rawSubjects);
    console.log(`✓ Subjects synced (${rawSubjects.length} items)`);

    // 2. Fetch Classes
    const rawClasses = await fetchFromAppsScript(apiUrl, 'getClasses');
    validateClasses(rawClasses);
    const validClasses = filterValidClasses(rawClasses, rawSubjects);
    console.log(`✓ Classes synced (${validClasses.length} valid items)`);

    // 3. Fetch Quizzes & Questions
    const rawQuizzes = await fetchFromAppsScript(apiUrl, 'getQuizzes');
    validateQuizzes(rawQuizzes);

    const detailedQuizzes = [];
    for (const quiz of rawQuizzes) {
      try {
        const detail = await fetchFromAppsScript(apiUrl, 'getQuiz', { id: quiz.id }, 2);
        detailedQuizzes.push({
          ...quiz,
          questions: (detail && Array.isArray(detail.questions)) ? detail.questions : []
        });
      } catch (err) {
        console.warn(`  ⚠️ Could not fetch questions for quiz "${quiz.title}": ${err.message}`);
        detailedQuizzes.push({ ...quiz, questions: [] });
      }
    }
    console.log(`✓ Quizzes synced (${detailedQuizzes.length} items)`);

    // 4. Fetch Trainer Profile
    const rawTrainer = await fetchFromAppsScript(apiUrl, 'getTrainerProfile');
    validateTrainer(rawTrainer);
    console.log(`✓ Trainer profile synced (${rawTrainer.trainerName})`);

    // ATOMIC WRITE: Write files ONLY after all 4 datasets are successfully validated!
    fs.writeFileSync(path.join(dataDir, 'subjects.json'), JSON.stringify(rawSubjects, null, 2) + '\n', 'utf8');
    fs.writeFileSync(path.join(dataDir, 'classes.json'), JSON.stringify(validClasses, null, 2) + '\n', 'utf8');
    fs.writeFileSync(path.join(dataDir, 'quizzes.json'), JSON.stringify(detailedQuizzes, null, 2) + '\n', 'utf8');
    fs.writeFileSync(path.join(dataDir, 'trainer.json'), JSON.stringify(rawTrainer, null, 2) + '\n', 'utf8');

    // Post-write disk verification: assert no silently dropped rows
    const savedClasses = JSON.parse(fs.readFileSync(path.join(dataDir, 'classes.json'), 'utf8'));
    if (savedClasses.length !== validClasses.length) {
      throw new Error(`Disk verification error: expected ${validClasses.length} classes, found ${savedClasses.length}.`);
    }

    console.log('\n==================================================');
    console.log(`✨ Public data sync completed successfully (${savedClasses.length} total classes verified).`);
    console.log('==================================================\n');
  } catch (error) {
    console.error('\n✗ Public data sync encountered an issue:');
    console.error(`  ${error.message}`);

    const existing = fs.existsSync(path.join(dataDir, 'subjects.json')) &&
                     fs.existsSync(path.join(dataDir, 'classes.json'));

    if (existing) {
      console.warn('\n⚠️ Preserving existing verified static JSON files in src/data/ to allow production build to proceed.');
      console.warn('The public site will continue serving the existing curriculum until the next publish.\n');
      return;
    } else {
      console.error('\n❌ No existing static JSON fallback found. Aborting build.\n');
      process.exit(1);
    }
  }
}

sync();
