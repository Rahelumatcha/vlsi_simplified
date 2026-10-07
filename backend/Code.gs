/**
 * ============================================================================
 * VLSI Simplified - Google Apps Script Serverless API Backend
 * ============================================================================
 * Zero-Cost Shared Backend for Trainer Portfolio, YouTube Courses & Quiz Platform.
 * 
 * Target Spreadsheet Tabs:
 *  1. Subjects (id, name, slug, description, thumbnailUrl, published, createdAt, updatedAt)
 *  2. Classes (id, subjectId, classNumber, title, description, youtubeUrl, thumbnailUrl, notesUrl, published, createdAt, updatedAt)
 *  3. Quizzes (id, title, subjectId, description, difficulty, timeLimit, published, createdAt, updatedAt)
 *  4. QuizQuestions (id, quizId, question, optionA, optionB, optionC, optionD, correctAnswer, explanation, questionOrder)
 *  5. TrainerProfile (key, value)
 * 
 * Security:
 *  - Public GET operations provide read-only access (published content only for students).
 *  - Admin write operations (create, update, delete, publish) REQUIRE a valid Admin Key
 *    verified against Script Properties ('ADMIN_KEY').
 *  - Zero hardcoded passwords or deployment secrets in client code.
 *  - Automated deployment triggers via GitHub Actions dispatch or Deploy Hooks (Vercel/Netlify).
 * ============================================================================
 */

// ----------------------------------------------------------------------------
// Utilities & CORS Response Helpers
// ----------------------------------------------------------------------------

function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function getSpreadsheet() {
  try {
    var active = SpreadsheetApp.getActiveSpreadsheet();
    if (active) return active;
  } catch (e) {}
  
  var id = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
  if (id) {
    return SpreadsheetApp.openById(id);
  }
  throw new Error('No active spreadsheet or SPREADSHEET_ID script property configured.');
}

function getSheet(sheetName) {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    throw new Error('Sheet "' + sheetName + '" not found in spreadsheet.');
  }
  return sheet;
}

function getRowsAsObjects(sheetName) {
  var sheet = getSheet(sheetName);
  var values = sheet.getDataRange().getValues();
  if (values.length <= 1) return [];
  
  var headers = values[0];
  var rows = [];
  
  for (var i = 1; i < values.length; i++) {
    var row = values[i];
    if (!row[0] && row[0] !== 0) continue; // Skip empty rows
    var obj = {};
    for (var j = 0; j < headers.length; j++) {
      var header = headers[j];
      var val = row[j];
      // Robust boolean normalization
      if (typeof val === 'boolean') {
        // already boolean
      } else if (typeof val === 'string') {
        var strUpper = val.trim().toUpperCase();
        if (strUpper === 'TRUE') val = true;
        else if (strUpper === 'FALSE') val = false;
      } else if (val === 1 && header === 'published') {
        val = true;
      } else if (val === 0 && header === 'published') {
        val = false;
      }
      obj[header] = val;
    }
    rows.push(obj);
  }
  return rows;
}

function generateId(prefix) {
  var ts = new Date().getTime().toString(36).toUpperCase();
  var rand = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return prefix + '-' + ts + rand;
}

// ----------------------------------------------------------------------------
// Security / Admin Verification
// ----------------------------------------------------------------------------

function isAuthorized(adminToken) {
  if (!adminToken) return false;
  var configuredKey = PropertiesService.getScriptProperties().getProperty('ADMIN_KEY');
  if (!configuredKey) {
    return false;
  }
  return adminToken.toString().trim() === configuredKey.toString().trim();
}

// ----------------------------------------------------------------------------
// Modification & Publishing Triggers
// ----------------------------------------------------------------------------

function recordModification() {
  try {
    var props = PropertiesService.getScriptProperties();
    props.setProperty('LAST_MODIFIED_AT', new Date().toISOString());
  } catch (err) {
    Logger.log('Could not update LAST_MODIFIED_AT: ' + err);
  }
}

function triggerGitHubWorkflow(repo, token, workflow, branch) {
  var url = 'https://api.github.com/repos/' + repo + '/actions/workflows/' + (workflow || 'publish.yml') + '/dispatches';
  var options = {
    method: 'post',
    contentType: 'application/json',
    headers: {
      'Authorization': 'token ' + token,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'VLSI-Simplified-AppsScript'
    },
    payload: JSON.stringify({
      ref: branch || 'main'
    }),
    muteHttpExceptions: true
  };
  var response = UrlFetchApp.fetch(url, options);
  var code = response.getResponseCode();
  if (code >= 200 && code < 300) {
    return { success: true, method: 'github_actions' };
  } else {
    throw new Error('GitHub API responded with HTTP ' + code + ': ' + response.getContentText());
  }
}

function triggerDeployHook(hookUrl) {
  var options = {
    method: 'post',
    muteHttpExceptions: true
  };
  var response = UrlFetchApp.fetch(hookUrl, options);
  var code = response.getResponseCode();
  if (code >= 200 && code < 300) {
    return { success: true, method: 'deploy_hook' };
  } else {
    throw new Error('Deploy hook responded with HTTP ' + code + ': ' + response.getContentText());
  }
}

// ----------------------------------------------------------------------------
// GET Requests: Read Endpoints
// ----------------------------------------------------------------------------

function doGet(e) {
  try {
    var params = e && e.parameter ? e.parameter : {};
    var action = params.action || 'ping';
    var adminToken = params.adminToken || '';
    var isAdmin = isAuthorized(adminToken);

    if (action === 'ping' || action === 'status') {
      return createJsonResponse({
        success: true,
        message: 'VLSI Simplified API is online.',
        timestamp: new Date().toISOString()
      });
    }

    if (action === 'getPublishStatus') {
      var props = PropertiesService.getScriptProperties();
      var lastModified = props.getProperty('LAST_MODIFIED_AT') || '';
      var lastPublished = props.getProperty('LAST_PUBLISHED_AT') || '';
      
      var hasPendingChanges = false;
      if (lastModified && lastPublished) {
        hasPendingChanges = new Date(lastModified).getTime() > new Date(lastPublished).getTime();
      } else if (lastModified && !lastPublished) {
        hasPendingChanges = true;
      }

      var hasDeployHook = Boolean(props.getProperty('DEPLOY_HOOK_URL'));
      var hasGitHub = Boolean(props.getProperty('GITHUB_TOKEN') && props.getProperty('GITHUB_REPO'));

      return createJsonResponse({
        success: true,
        data: {
          lastModifiedAt: lastModified,
          lastPublishedAt: lastPublished,
          hasPendingChanges: hasPendingChanges,
          deploymentTarget: hasGitHub ? 'github_actions' : (hasDeployHook ? 'deploy_hook' : 'standalone')
        }
      });
    }

    if (action === 'getSubjects') {
      var subjects = getRowsAsObjects('Subjects');
      if (!isAdmin) {
        subjects = subjects.filter(function(s) {
          return s.published === true || String(s.published).trim().toUpperCase() === 'TRUE';
        });
      }
      return createJsonResponse({ success: true, data: subjects });
    }

    if (action === 'getClasses') {
      var classes = getRowsAsObjects('Classes');
      var subjectId = params.subjectId;
      if (subjectId) {
        classes = classes.filter(function(c) { return String(c.subjectId) === String(subjectId); });
      }
      if (!isAdmin) {
        classes = classes.filter(function(c) {
          return c.published === true || String(c.published).trim().toUpperCase() === 'TRUE';
        });
      }
      classes.sort(function(a, b) {
        return Number(a.classNumber || 0) - Number(b.classNumber || 0);
      });
      return createJsonResponse({ success: true, data: classes });
    }

    if (action === 'getQuizzes') {
      var quizzes = getRowsAsObjects('Quizzes');
      if (!isAdmin) {
        quizzes = quizzes.filter(function(q) {
          return q.published === true || String(q.published).trim().toUpperCase() === 'TRUE';
        });
      }
      return createJsonResponse({ success: true, data: quizzes });
    }

    if (action === 'getQuiz') {
      var quizId = params.id;
      if (!quizId) {
        return createJsonResponse({ success: false, error: 'Missing quiz id parameter.' });
      }
      var allQuizzes = getRowsAsObjects('Quizzes');
      var quiz = allQuizzes.find(function(q) { return String(q.id) === String(quizId); });
      if (!quiz) {
        return createJsonResponse({ success: false, error: 'Quiz not found.' });
      }
      
      var allQuestions = getRowsAsObjects('QuizQuestions');
      var questions = allQuestions.filter(function(q) { return String(q.quizId) === String(quizId); });
      questions.sort(function(a, b) {
        return Number(a.questionOrder || 0) - Number(b.questionOrder || 0);
      });

      var formattedQuestions = questions.map(function(q) {
        return {
          id: q.id,
          quizId: q.quizId,
          question: q.question,
          options: [q.optionA, q.optionB, q.optionC, q.optionD],
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          questionOrder: q.questionOrder
        };
      });

      return createJsonResponse({
        success: true,
        data: {
          quiz: quiz,
          questions: formattedQuestions
        }
      });
    }

    if (action === 'getTrainerProfile') {
      var sheet = getSheet('TrainerProfile');
      var values = sheet.getDataRange().getValues();
      var profile = {};
      for (var i = 1; i < values.length; i++) {
        var k = values[i][0];
        var v = values[i][1];
        if (k) {
          try {
            if (typeof v === 'string' && (v.startsWith('[') || v.startsWith('{'))) {
              profile[k] = JSON.parse(v);
            } else {
              profile[k] = v;
            }
          } catch (err) {
            profile[k] = v;
          }
        }
      }
      return createJsonResponse({ success: true, data: profile });
    }

    return createJsonResponse({ success: false, error: 'Unknown action: ' + action });
  } catch (error) {
    return createJsonResponse({ success: false, error: error.toString() });
  }
}

// ----------------------------------------------------------------------------
// POST Requests: Mutation & Write Endpoints (Admin Protected)
// ----------------------------------------------------------------------------

function doPost(e) {
  try {
    var payload = {};
    if (e && e.postData && e.postData.contents) {
      try {
        payload = JSON.parse(e.postData.contents);
      } catch (err) {
        payload = e.parameter || {};
      }
    } else if (e && e.parameter) {
      payload = e.parameter;
    }

    var action = payload.action;
    var adminToken = payload.adminToken;

    // Verify Admin Credentials for all write actions
    if (action === 'verifyAdmin') {
      var valid = isAuthorized(adminToken);
      return createJsonResponse({ success: valid, message: valid ? 'Authorized' : 'Invalid admin key' });
    }

    if (!isAuthorized(adminToken)) {
      return createJsonResponse({
        success: false,
        error: 'Unauthorized: Valid admin credentials required for modification.'
      });
    }

    // ---------------- Publish Trigger ----------------
    if (action === 'publish') {
      var props = PropertiesService.getScriptProperties();
      var now = new Date().toISOString();
      var deployHookUrl = props.getProperty('DEPLOY_HOOK_URL');
      var ghToken = props.getProperty('GITHUB_TOKEN');
      var ghRepo = props.getProperty('GITHUB_REPO');
      var ghWorkflow = props.getProperty('GITHUB_WORKFLOW') || 'publish.yml';
      var ghBranch = props.getProperty('GITHUB_BRANCH') || 'main';

      var triggerResult = null;

      try {
        if (ghToken && ghRepo) {
          triggerResult = triggerGitHubWorkflow(ghRepo, ghToken, ghWorkflow, ghBranch);
        } else if (deployHookUrl) {
          triggerResult = triggerDeployHook(deployHookUrl);
        } else {
          triggerResult = {
            success: true,
            method: 'standalone',
            note: 'Published timestamp recorded. Set DEPLOY_HOOK_URL or GITHUB_TOKEN in Script Properties for automatic cloud deployment.'
          };
        }

        props.setProperty('LAST_PUBLISHED_AT', now);

        var publishMessage = 'Publish started — changes will be live after deployment completes.';
        if (triggerResult.method === 'standalone') {
          publishMessage = 'Publish recorded. Notice: No DEPLOY_HOOK_URL or GITHUB_TOKEN configured in Apps Script Script Properties. Automatic cloud rebuild was not triggered.';
        }

        return createJsonResponse({
          success: true,
          message: publishMessage,
          lastPublishedAt: now,
          details: triggerResult
        });
      } catch (deployErr) {
        return createJsonResponse({
          success: false,
          error: 'Deployment trigger failed: ' + deployErr.message
        });
      }
    }

    var ss = getSpreadsheet();
    var now = new Date().toISOString();

    // ---------------- Subjects ----------------
    if (action === 'createSubject') {
      var data = payload.data || {};
      var sheet = getSheet('Subjects');
      var id = data.id || generateId('SUB');
      sheet.appendRow([
        id,
        data.name || '',
        data.slug || '',
        data.description || '',
        data.thumbnailUrl || '',
        data.published === true || data.published === 'TRUE' ? true : false,
        now,
        now
      ]);
      recordModification();
      return createJsonResponse({ success: true, data: { id: id } });
    }

    if (action === 'updateSubject') {
      var id = payload.id;
      var data = payload.data || {};
      var sheet = getSheet('Subjects');
      var values = sheet.getDataRange().getValues();
      for (var i = 1; i < values.length; i++) {
        if (String(values[i][0]) === String(id)) {
          var row = i + 1;
          if (data.name !== undefined) sheet.getRange(row, 2).setValue(data.name);
          if (data.slug !== undefined) sheet.getRange(row, 3).setValue(data.slug);
          if (data.description !== undefined) sheet.getRange(row, 4).setValue(data.description);
          if (data.thumbnailUrl !== undefined) sheet.getRange(row, 5).setValue(data.thumbnailUrl);
          if (data.published !== undefined) sheet.getRange(row, 6).setValue(data.published ? true : false);
          sheet.getRange(row, 8).setValue(now);
          recordModification();
          return createJsonResponse({ success: true, message: 'Subject updated.' });
        }
      }
      return createJsonResponse({ success: false, error: 'Subject not found.' });
    }

    if (action === 'deleteSubject') {
      var id = payload.id;
      var sheet = getSheet('Subjects');
      var values = sheet.getDataRange().getValues();
      for (var i = 1; i < values.length; i++) {
        if (String(values[i][0]) === String(id)) {
          sheet.deleteRow(i + 1);
          recordModification();
          return createJsonResponse({ success: true, message: 'Subject deleted.' });
        }
      }
      return createJsonResponse({ success: false, error: 'Subject not found.' });
    }

    // ---------------- Classes ----------------
    if (action === 'createClass') {
      var data = payload.data || {};
      var sheet = getSheet('Classes');
      var id = data.id || generateId('CLS');
      sheet.appendRow([
        id,
        data.subjectId || '',
        data.classNumber || 1,
        data.title || '',
        data.description || '',
        data.youtubeUrl || '',
        data.thumbnailUrl || '',
        data.notesUrl || '',
        data.published === true || data.published === 'TRUE' ? true : false,
        now,
        now
      ]);
      recordModification();
      return createJsonResponse({ success: true, data: { id: id } });
    }

    if (action === 'updateClass') {
      var id = payload.id;
      var data = payload.data || {};
      var sheet = getSheet('Classes');
      var values = sheet.getDataRange().getValues();
      for (var i = 1; i < values.length; i++) {
        if (String(values[i][0]) === String(id)) {
          var row = i + 1;
          if (data.subjectId !== undefined) sheet.getRange(row, 2).setValue(data.subjectId);
          if (data.classNumber !== undefined) sheet.getRange(row, 3).setValue(data.classNumber);
          if (data.title !== undefined) sheet.getRange(row, 4).setValue(data.title);
          if (data.description !== undefined) sheet.getRange(row, 5).setValue(data.description);
          if (data.youtubeUrl !== undefined) sheet.getRange(row, 6).setValue(data.youtubeUrl);
          if (data.thumbnailUrl !== undefined) sheet.getRange(row, 7).setValue(data.thumbnailUrl);
          if (data.notesUrl !== undefined) sheet.getRange(row, 8).setValue(data.notesUrl);
          if (data.published !== undefined) sheet.getRange(row, 9).setValue(data.published ? true : false);
          sheet.getRange(row, 11).setValue(now);
          recordModification();
          return createJsonResponse({ success: true, message: 'Class updated.' });
        }
      }
      return createJsonResponse({ success: false, error: 'Class not found.' });
    }

    if (action === 'deleteClass') {
      var id = payload.id;
      var sheet = getSheet('Classes');
      var values = sheet.getDataRange().getValues();
      for (var i = 1; i < values.length; i++) {
        if (String(values[i][0]) === String(id)) {
          sheet.deleteRow(i + 1);
          recordModification();
          return createJsonResponse({ success: true, message: 'Class deleted.' });
        }
      }
      return createJsonResponse({ success: false, error: 'Class not found.' });
    }

    // ---------------- Quizzes & Questions ----------------
    if (action === 'createQuiz') {
      var data = payload.data || {};
      var sheet = getSheet('Quizzes');
      var id = data.id || generateId('QZ');
      sheet.appendRow([
        id,
        data.title || '',
        data.subjectId || '',
        data.description || '',
        data.difficulty || 'Intermediate',
        data.timeLimit || 15,
        data.published === true || data.published === 'TRUE' ? true : false,
        now,
        now
      ]);

      if (Array.isArray(data.questions) && data.questions.length > 0) {
        var qSheet = getSheet('QuizQuestions');
        for (var k = 0; k < data.questions.length; k++) {
          var q = data.questions[k];
          var qId = q.id || generateId('QUES');
          var opts = q.options || ['', '', '', ''];
          qSheet.appendRow([
            qId,
            id,
            q.question || '',
            opts[0] || '',
            opts[1] || '',
            opts[2] || '',
            opts[3] || '',
            q.correctAnswer || 'A',
            q.explanation || '',
            k + 1
          ]);
        }
      }
      recordModification();
      return createJsonResponse({ success: true, data: { id: id } });
    }

    if (action === 'updateQuiz') {
      var id = payload.id;
      var data = payload.data || {};
      var sheet = getSheet('Quizzes');
      var values = sheet.getDataRange().getValues();
      for (var i = 1; i < values.length; i++) {
        if (String(values[i][0]) === String(id)) {
          var row = i + 1;
          if (data.title !== undefined) sheet.getRange(row, 2).setValue(data.title);
          if (data.subjectId !== undefined) sheet.getRange(row, 3).setValue(data.subjectId);
          if (data.description !== undefined) sheet.getRange(row, 4).setValue(data.description);
          if (data.difficulty !== undefined) sheet.getRange(row, 5).setValue(data.difficulty);
          if (data.timeLimit !== undefined) sheet.getRange(row, 6).setValue(data.timeLimit);
          if (data.published !== undefined) sheet.getRange(row, 7).setValue(data.published ? true : false);
          sheet.getRange(row, 9).setValue(now);
          break;
        }
      }

      if (Array.isArray(data.questions)) {
        var qSheet = getSheet('QuizQuestions');
        var qValues = qSheet.getDataRange().getValues();
        for (var r = qValues.length - 1; r >= 1; r--) {
          if (String(qValues[r][1]) === String(id)) {
            qSheet.deleteRow(r + 1);
          }
        }
        for (var m = 0; m < data.questions.length; m++) {
          var q = data.questions[m];
          var qId = q.id || generateId('QUES');
          var opts = q.options || ['', '', '', ''];
          qSheet.appendRow([
            qId,
            id,
            q.question || '',
            opts[0] || '',
            opts[1] || '',
            opts[2] || '',
            opts[3] || '',
            q.correctAnswer || 'A',
            q.explanation || '',
            m + 1
          ]);
        }
      }
      recordModification();
      return createJsonResponse({ success: true, message: 'Quiz updated.' });
    }

    if (action === 'deleteQuiz') {
      var id = payload.id;
      var sheet = getSheet('Quizzes');
      var values = sheet.getDataRange().getValues();
      for (var i = 1; i < values.length; i++) {
        if (String(values[i][0]) === String(id)) {
          sheet.deleteRow(i + 1);
          break;
        }
      }
      var qSheet = getSheet('QuizQuestions');
      var qValues = qSheet.getDataRange().getValues();
      for (var r = qValues.length - 1; r >= 1; r--) {
        if (String(qValues[r][1]) === String(id)) {
          qSheet.deleteRow(r + 1);
        }
      }
      recordModification();
      return createJsonResponse({ success: true, message: 'Quiz deleted.' });
    }

    // ---------------- Trainer Profile ----------------
    if (action === 'updateTrainerProfile') {
      var profileData = payload.data || {};
      var sheet = getSheet('TrainerProfile');
      var values = sheet.getDataRange().getValues();
      var keyRowMap = {};
      for (var i = 1; i < values.length; i++) {
        var k = values[i][0];
        if (k) keyRowMap[k] = i + 1;
      }

      for (var key in profileData) {
        var val = profileData[key];
        if (typeof val === 'object') {
          val = JSON.stringify(val);
        }
        if (keyRowMap[key]) {
          sheet.getRange(keyRowMap[key], 2).setValue(val);
        } else {
          sheet.appendRow([key, val]);
        }
      }
      recordModification();
      return createJsonResponse({ success: true, message: 'Trainer profile updated.' });
    }

    return createJsonResponse({ success: false, error: 'Unknown POST action: ' + action });
  } catch (error) {
    return createJsonResponse({ success: false, error: error.toString() });
  }
}

// ----------------------------------------------------------------------------
// One-Click Spreadsheet Setup Helper Function
// ----------------------------------------------------------------------------

function setupSpreadsheet() {
  var ss = getSpreadsheet();
  
  // 1. Subjects
  var subjectsSheet = ss.getSheetByName('Subjects') || ss.insertSheet('Subjects');
  subjectsSheet.clear();
  subjectsSheet.appendRow(['id', 'name', 'slug', 'description', 'thumbnailUrl', 'published', 'createdAt', 'updatedAt']);
  
  // 2. Classes
  var classesSheet = ss.getSheetByName('Classes') || ss.insertSheet('Classes');
  classesSheet.clear();
  classesSheet.appendRow(['id', 'subjectId', 'classNumber', 'title', 'description', 'youtubeUrl', 'thumbnailUrl', 'notesUrl', 'published', 'createdAt', 'updatedAt']);
  
  // 3. Quizzes
  var quizzesSheet = ss.getSheetByName('Quizzes') || ss.insertSheet('Quizzes');
  quizzesSheet.clear();
  quizzesSheet.appendRow(['id', 'title', 'subjectId', 'description', 'difficulty', 'timeLimit', 'published', 'createdAt', 'updatedAt']);
  
  // 4. QuizQuestions
  var questionsSheet = ss.getSheetByName('QuizQuestions') || ss.insertSheet('QuizQuestions');
  questionsSheet.clear();
  questionsSheet.appendRow(['id', 'quizId', 'question', 'optionA', 'optionB', 'optionC', 'optionD', 'correctAnswer', 'explanation', 'questionOrder']);
  
  // 5. TrainerProfile
  var profileSheet = ss.getSheetByName('TrainerProfile') || ss.insertSheet('TrainerProfile');
  profileSheet.clear();
  profileSheet.appendRow(['key', 'value']);

  var props = PropertiesService.getScriptProperties();
  if (!props.getProperty('ADMIN_KEY')) {
    Logger.log('IMPORTANT: Please set your private ADMIN_KEY in Project Settings -> Script Properties.');
  }

  Logger.log('Spreadsheet successfully initialized with all required sheets and headers.');
}
