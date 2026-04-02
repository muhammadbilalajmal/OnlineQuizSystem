// // ── AUTH CHECK ──
// const session = JSON.parse(localStorage.getItem('qc_session') || 'null');
// if (!session || session.role !== 'student') window.location.href = '../index.html';

// document.getElementById('sidebarName').textContent = session.name;
// document.getElementById('sidebarAvatar').textContent = session.name[0].toUpperCase();

// // ── DATA HELPERS ──
// function getQuizzes() { return JSON.parse(localStorage.getItem('qc_quizzes') || '[]'); }
// function getResults() { return JSON.parse(localStorage.getItem('qc_results') || '[]'); }
// function saveResults(r) { localStorage.setItem('qc_results', JSON.stringify(r)); }

// // ── NAV ──
// window.showSection = function (section, btn) {
//     document.querySelectorAll('.main > div').forEach(el => el.style.display = 'none');
//     document.getElementById('section' + section.charAt(0).toUpperCase() + section.slice(1)).style.display = 'block';
//     document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
//     if (btn) btn.classList.add('active');
//     if (section === 'history') renderHistory();
// };

// window.handleLogout = function () {
//     localStorage.removeItem('qc_session');
//     window.location.href = '../index.html';
// };

// // ── AVAILABLE QUIZZES ──
// function renderAvailable() {
//     const quizzes = getQuizzes().filter(q => q.status === 'active');
//     const myResults = getResults().filter(r => r.studentEmail === session.email);
//     const attemptedIds = new Set(myResults.map(r => r.quizId));

//     document.getElementById('statAvail').textContent = quizzes.length;
//     document.getElementById('statAttempted').textContent = myResults.length;
//     document.getElementById('statPassed').textContent = myResults.filter(r => r.passed).length;
//     if (myResults.length) {
//         const best = Math.max(...myResults.map(r => r.percentage));
//         document.getElementById('statBest').textContent = best + '%';
//     }

//     const el = document.getElementById('availableList');
//     if (!quizzes.length) {
//         el.innerHTML = `<div class="empty-state"><div class="empty-icon">📋</div><div class="empty-text">No quizzes available yet</div><div class="empty-sub">Ask your teacher to publish a quiz</div></div>`;
//         return;
//     }
//     el.innerHTML = quizzes.map(q => {
//         const done = attemptedIds.has(q.id);
//         const res = myResults.find(r => r.quizId === q.id);
//         return `
//         <div class="quiz-card">
//           <div class="quiz-meta">
//             <div class="quiz-name">${q.title}</div>
//             <div class="quiz-info">
//               <span>By ${q.teacherName}</span>
//               <span>⏱ ${q.timeLimit} mins</span>
//               <span>❓ ${q.questions.length} questions</span>
//               <span>🎯 Pass: ${q.passmark}%</span>
//               ${done ? `<span class="badge ${res.passed ? 'badge-active' : 'badge-closed'}">${res.passed ? 'PASSED' : 'FAILED'} · ${res.percentage}%</span>` : ''}
//             </div>
//           </div>
//           <div>
//             ${!done
//                 ? `<button class="btn btn-primary btn-sm" onclick="startQuiz('${q.id}')">Attempt →</button>`
//                 : `<button class="btn btn-secondary btn-sm" disabled style="opacity:0.5;cursor:not-allowed;">Done</button>`
//             }
//           </div>
//         </div>
//       `;
//     }).join('');
// }

// // ── QUIZ ATTEMPT ──
// let activeQuiz = null, userAnswers = [], timerInterval = null, timeLeft = 0;

// window.startQuiz = function (id) {
//     activeQuiz = getQuizzes().find(q => q.id === id);
//     if (!activeQuiz) return;
//     userAnswers = new Array(activeQuiz.questions.length).fill(null);
//     timeLeft = activeQuiz.timeLimit * 60;

//     document.querySelectorAll('.main > div').forEach(el => el.style.display = 'none');
//     document.getElementById('sectionAttempt').style.display = 'block';
//     renderAttempt();
//     startTimer();
// };

// function renderAttempt() {
//     const qs = activeQuiz.questions;
//     document.getElementById('attemptContainer').innerHTML = `
//       <div class="timer-bar">
//         <div>
//           <div style="font-size:15px;font-weight:800;">${activeQuiz.title}</div>
//           <div style="font-family:'Space Mono',monospace;font-size:11px;color:var(--muted);">${qs.length} questions · Pass: ${activeQuiz.passmark}%</div>
//         </div>
//         <div class="timer-display" id="timerDisplay">--:--</div>
//       </div>
//       <div class="progress-track"><div class="progress-fill" id="progressFill" style="width:0%"></div></div>
//       ${qs.map((q, i) => `
//         <div class="attempt-q">
//           <div class="q-num">Question ${i + 1} of ${qs.length}</div>
//           <div class="q-text">${q.text}</div>
//           ${q.options.map((opt, j) => `
//             <button class="opt-btn" id="opt-${i}-${j}" onclick="selectAns(${i},${j})">${opt || '(empty option)'}</button>
//           `).join('')}
//         </div>
//       `).join('')}
//       <div style="display:flex;gap:12px;margin-top:20px;">
//         <button class="btn btn-secondary" onclick="cancelAttempt()">← Cancel</button>
//         <button class="btn btn-primary" style="flex:1" onclick="submitQuiz()">Submit Quiz</button>
//       </div>
//     `;
// }

// window.selectAns = function (qi, oi) {
//     userAnswers[qi] = oi;
//     activeQuiz.questions[qi].options.forEach((_, j) => {
//         const btn = document.getElementById('opt-' + qi + '-' + j);
//         if (btn) btn.className = 'opt-btn' + (j === oi ? ' selected' : '');
//     });
//     const answered = userAnswers.filter(a => a !== null).length;
//     const pf = document.getElementById('progressFill');
//     if (pf) pf.style.width = (answered / activeQuiz.questions.length * 100) + '%';
// };

// function startTimer() {
//     clearInterval(timerInterval);
//     updateTimer();
//     timerInterval = setInterval(() => {
//         timeLeft--;
//         updateTimer();
//         if (timeLeft <= 0) { clearInterval(timerInterval); submitQuiz(true); }
//     }, 1000);
// }

// function updateTimer() {
//     const el = document.getElementById('timerDisplay');
//     if (!el) return;
//     const m = String(Math.floor(timeLeft / 60)).padStart(2, '0');
//     const s = String(timeLeft % 60).padStart(2, '0');
//     el.textContent = m + ':' + s;
//     el.className = 'timer-display' + (timeLeft < 60 ? ' danger' : timeLeft < 180 ? ' warn' : '');
// }

// window.cancelAttempt = function () {
//     clearInterval(timerInterval);
//     activeQuiz = null;
//     renderAvailable();
//     showSection('available', document.querySelectorAll('.nav-link')[0]);
// };

// window.submitQuiz = function (auto) {
//     clearInterval(timerInterval);
//     const unanswered = userAnswers.filter(a => a === null).length;
//     if (!auto && unanswered > 0) {
//         if (!confirm(unanswered + ' question(s) unanswered. Submit anyway?')) { startTimer(); return; }
//     }
//     const qs = activeQuiz.questions;
//     let score = 0;
//     userAnswers.forEach((ans, i) => { if (ans === qs[i].correct) score++; });
//     const total = qs.length;
//     const percentage = Math.round((score / total) * 100);
//     const passed = percentage >= activeQuiz.passmark;

//     // Save result
//     const results = getResults();
//     results.push({
//         id: 'r_' + Date.now(),
//         studentEmail: session.email,
//         studentName: session.name,
//         quizId: activeQuiz.id,
//         quizTitle: activeQuiz.title,
//         teacherEmail: activeQuiz.createdBy,
//         score, total, percentage, passed,
//         answers: userAnswers,
//         submittedAt: new Date().toISOString()
//     });
//     saveResults(results);
//     showResult(score, total, percentage, passed, qs);
// };

// function showResult(score, total, percentage, passed, qs) {
//     document.getElementById('attemptContainer').innerHTML = `
//       <div class="result-wrap">
//         <div class="result-icon">${passed ? '🎉' : '📚'}</div>
//         <h1 class="result-title">${passed ? 'Well Done!' : 'Keep Trying!'}</h1>
//         <p class="result-sub">${passed ? 'You passed the quiz!' : 'You did not pass. Review your answers below.'}</p>
//         <div class="score-ring ${passed ? 'pass' : 'fail'}">
//           <div class="score-pct">${percentage}%</div>
//           <div class="score-lbl">SCORE</div>
//         </div>
//         <div class="result-stats">
//           <div class="result-stat"><div class="result-stat-val" style="color:var(--success)">${score}</div><div class="result-stat-lbl">Correct</div></div>
//           <div class="result-stat"><div class="result-stat-val" style="color:var(--accent2)">${total - score}</div><div class="result-stat-lbl">Wrong</div></div>
//           <div class="result-stat"><div class="result-stat-val">${total}</div><div class="result-stat-lbl">Total</div></div>
//         </div>
//         <div style="margin-bottom:32px;text-align:left;">
//           <h3 style="font-size:16px;font-weight:800;margin-bottom:14px;">Answer Review</h3>
//           ${qs.map((q, i) => {
//         const ans = userAnswers[i];
//         const isRight = ans === q.correct;
//         return `
//               <div class="review-item" style="border:1px solid ${isRight ? 'rgba(78,204,163,0.2)' : 'rgba(252,92,125,0.2)'};">
//                 <div class="review-q">${i + 1}. ${q.text}</div>
//                 <div class="review-ans" style="color:${isRight ? 'var(--success)' : 'var(--accent2)'};">
//                   Your answer: ${ans !== null ? q.options[ans] : 'Not answered'}
//                   ${!isRight ? ' · Correct: ' + q.options[q.correct] : ' ✓'}
//                 </div>
//               </div>
//             `;
//     }).join('')}
//         </div>
//         <button class="btn btn-primary" style="width:100%" onclick="goBack()">← Back to Dashboard</button>
//       </div>
//     `;
// }

// window.goBack = function () {
//     activeQuiz = null;
//     renderAvailable();
//     showSection('available', document.querySelectorAll('.nav-link')[0]);
// };

// // ── HISTORY ──
// function renderHistory() {
//     const myResults = getResults().filter(r => r.studentEmail === session.email);
//     const el = document.getElementById('historyList');
//     if (!myResults.length) {
//         el.innerHTML = `<div class="empty-state"><div class="empty-icon">📊</div><div class="empty-text">No results yet</div><div class="empty-sub">Attempt a quiz first!</div></div>`;
//         return;
//     }
//     el.innerHTML = myResults.map(r => `
//       <div class="quiz-card">
//         <div class="quiz-meta">
//           <div class="quiz-name">${r.quizTitle}</div>
//           <div class="quiz-info">
//             <span>Score: ${r.score}/${r.total}</span>
//             <span>${r.percentage}%</span>
//             <span class="badge ${r.passed ? 'badge-active' : 'badge-closed'}">${r.passed ? 'PASSED' : 'FAILED'}</span>
//             <span>${new Date(r.submittedAt).toLocaleDateString()}</span>
//           </div>
//         </div>
//         <div style="font-size:28px;font-weight:800;color:${r.passed ? 'var(--success)' : 'var(--accent2)'};">${r.passed ? '✓' : '✕'}</div>
//       </div>
//     `).join('');
// }

// function showToast(msg, type) {
//     const t = document.getElementById('toast');
//     t.textContent = msg; t.className = 'show ' + (type || '');
//     setTimeout(() => t.className = '', 3000);
// }

// // Init
// renderAvailable();















import { db, collection, doc, getDoc, getDocs, addDoc, query, where } from "./firebase-config.js";

// ── AUTH CHECK ──
const session = JSON.parse(localStorage.getItem('qc_session') || 'null');
if (!session || session.role !== 'student') window.location.href = 'index.html';

document.getElementById('sidebarName').textContent = session.name;
document.getElementById('sidebarAvatar').textContent = session.name[0].toUpperCase();

// ── FIREBASE HELPERS ──
async function getQuizzes() {
    const q = query(collection(db, "quizzes"), where("status", "==", "active"));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

async function getMyResults() {
    const q = query(collection(db, "results"), where("studentEmail", "==", session.email));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

async function saveResult(data) {
    await addDoc(collection(db, "results"), data);
}

// ── NAV ──
window.showSection = function (section, btn) {
    document.querySelectorAll('.main > div').forEach(el => el.style.display = 'none');
    document.getElementById('section' + section.charAt(0).toUpperCase() + section.slice(1)).style.display = 'block';
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    if (btn) btn.classList.add('active');
    if (section === 'history') renderHistory();
};

window.handleLogout = function () {
    localStorage.removeItem('qc_session');
    window.location.href = 'index.html';
};

// ── AVAILABLE QUIZZES ──
async function renderAvailable() {
    const el = document.getElementById('availableList');
    el.innerHTML = `<div style="text-align:center;padding:40px;color:var(--muted);font-family:'Space Mono',monospace;">Loading quizzes...</div>`;

    const quizzes = await getQuizzes();
    const myResults = await getMyResults();
    const attemptedIds = new Set(myResults.map(r => r.quizId));

    document.getElementById('statAvail').textContent = quizzes.length;
    document.getElementById('statAttempted').textContent = myResults.length;
    document.getElementById('statPassed').textContent = myResults.filter(r => r.passed).length;
    if (myResults.length) {
        const best = Math.max(...myResults.map(r => r.percentage));
        document.getElementById('statBest').textContent = best + '%';
    }

    if (!quizzes.length) {
        el.innerHTML = `<div class="empty-state"><div class="empty-icon">📋</div><div class="empty-text">No quizzes available yet</div><div class="empty-sub">Ask your teacher to publish a quiz</div></div>`;
        return;
    }

    el.innerHTML = quizzes.map(q => {
        const done = attemptedIds.has(q.id);
        const res = myResults.find(r => r.quizId === q.id);
        return `
        <div class="quiz-card">
          <div class="quiz-meta">
            <div class="quiz-name">${q.title}</div>
            <div class="quiz-info">
              <span>By ${q.teacherName}</span>
              <span>⏱ ${q.timeLimit} mins</span>
              <span>❓ ${q.questions.length} questions</span>
              <span>🎯 Pass: ${q.passmark}%</span>
              ${done ? `<span class="badge ${res.passed ? 'badge-active' : 'badge-closed'}">${res.passed ? 'PASSED' : 'FAILED'} · ${res.percentage}%</span>` : ''}
            </div>
          </div>
          <div>
            ${!done
                ? `<button class="btn btn-primary btn-sm" onclick="startQuiz('${q.id}')">Attempt →</button>`
                : `<button class="btn btn-secondary btn-sm" disabled style="opacity:0.5;cursor:not-allowed;">Done</button>`
            }
          </div>
        </div>
      `;
    }).join('');
}

// ── QUIZ ATTEMPT ──
let activeQuiz = null, userAnswers = [], timerInterval = null, timeLeft = 0;

window.startQuiz = async function (id) {
    const quizzes = await getQuizzes();
    activeQuiz = quizzes.find(q => q.id === id);
    if (!activeQuiz) return;

    userAnswers = new Array(activeQuiz.questions.length).fill(null);
    timeLeft = activeQuiz.timeLimit * 60;

    document.querySelectorAll('.main > div').forEach(el => el.style.display = 'none');
    document.getElementById('sectionAttempt').style.display = 'block';
    renderAttempt();
    startTimer();
};

function renderAttempt() {
    const qs = activeQuiz.questions;
    document.getElementById('attemptContainer').innerHTML = `
      <div class="timer-bar">
        <div>
          <div style="font-size:15px;font-weight:800;">${activeQuiz.title}</div>
          <div style="font-family:'Space Mono',monospace;font-size:11px;color:var(--muted);">${qs.length} questions · Pass: ${activeQuiz.passmark}%</div>
        </div>
        <div class="timer-display" id="timerDisplay">--:--</div>
      </div>
      <div class="progress-track"><div class="progress-fill" id="progressFill" style="width:0%"></div></div>
      ${qs.map((q, i) => `
        <div class="attempt-q">
          <div class="q-num">Question ${i + 1} of ${qs.length}</div>
          <div class="q-text">${q.text}</div>
          ${q.options.map((opt, j) => `
            <button class="opt-btn" id="opt-${i}-${j}" onclick="selectAns(${i},${j})">${opt || '(empty option)'}</button>
          `).join('')}
        </div>
      `).join('')}
      <div style="display:flex;gap:12px;margin-top:20px;">
        <button class="btn btn-secondary" onclick="cancelAttempt()">← Cancel</button>
        <button class="btn btn-primary" style="flex:1" onclick="submitQuiz()">Submit Quiz</button>
      </div>
    `;
}

window.selectAns = function (qi, oi) {
    userAnswers[qi] = oi;
    activeQuiz.questions[qi].options.forEach((_, j) => {
        const btn = document.getElementById('opt-' + qi + '-' + j);
        if (btn) btn.className = 'opt-btn' + (j === oi ? ' selected' : '');
    });
    const answered = userAnswers.filter(a => a !== null).length;
    const pf = document.getElementById('progressFill');
    if (pf) pf.style.width = (answered / activeQuiz.questions.length * 100) + '%';
};

function startTimer() {
    clearInterval(timerInterval);
    updateTimer();
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimer();
        if (timeLeft <= 0) { clearInterval(timerInterval); submitQuiz(true); }
    }, 1000);
}

function updateTimer() {
    const el = document.getElementById('timerDisplay');
    if (!el) return;
    const m = String(Math.floor(timeLeft / 60)).padStart(2, '0');
    const s = String(timeLeft % 60).padStart(2, '0');
    el.textContent = m + ':' + s;
    el.className = 'timer-display' + (timeLeft < 60 ? ' danger' : timeLeft < 180 ? ' warn' : '');
}

window.cancelAttempt = function () {
    clearInterval(timerInterval);
    activeQuiz = null;
    renderAvailable();
    showSection('available', document.querySelectorAll('.nav-link')[0]);
};

window.submitQuiz = async function (auto) {
    clearInterval(timerInterval);
    const unanswered = userAnswers.filter(a => a === null).length;
    if (!auto && unanswered > 0) {
        if (!confirm(unanswered + ' question(s) unanswered. Submit anyway?')) { startTimer(); return; }
    }

    const qs = activeQuiz.questions;
    let score = 0;
    userAnswers.forEach((ans, i) => { if (ans === qs[i].correct) score++; });
    const total = qs.length;
    const percentage = Math.round((score / total) * 100);
    const passed = percentage >= activeQuiz.passmark;

    try {
        await saveResult({
            studentEmail: session.email,
            studentName: session.name,
            quizId: activeQuiz.id,
            quizTitle: activeQuiz.title,
            teacherEmail: activeQuiz.createdBy,
            score, total, percentage, passed,
            answers: userAnswers,
            submittedAt: new Date().toISOString()
        });
    } catch (err) {
        console.error('Could not save result:', err);
    }

    showResult(score, total, percentage, passed, qs);
};

function showResult(score, total, percentage, passed, qs) {
    document.getElementById('attemptContainer').innerHTML = `
      <div class="result-wrap">
        <div class="result-icon">${passed ? '🎉' : '📚'}</div>
        <h1 class="result-title">${passed ? 'Well Done!' : 'Keep Trying!'}</h1>
        <p class="result-sub">${passed ? 'You passed the quiz!' : 'You did not pass. Review your answers below.'}</p>
        <div class="score-ring ${passed ? 'pass' : 'fail'}">
          <div class="score-pct">${percentage}%</div>
          <div class="score-lbl">SCORE</div>
        </div>
        <div class="result-stats">
          <div class="result-stat"><div class="result-stat-val" style="color:var(--success)">${score}</div><div class="result-stat-lbl">Correct</div></div>
          <div class="result-stat"><div class="result-stat-val" style="color:var(--accent2)">${total - score}</div><div class="result-stat-lbl">Wrong</div></div>
          <div class="result-stat"><div class="result-stat-val">${total}</div><div class="result-stat-lbl">Total</div></div>
        </div>
        <div style="margin-bottom:32px;text-align:left;">
          <h3 style="font-size:16px;font-weight:800;margin-bottom:14px;">Answer Review</h3>
          ${qs.map((q, i) => {
            const ans = userAnswers[i];
            const isRight = ans === q.correct;
            return `
              <div class="review-item" style="border:1px solid ${isRight ? 'rgba(78,204,163,0.2)' : 'rgba(252,92,125,0.2)'};">
                <div class="review-q">${i + 1}. ${q.text}</div>
                <div class="review-ans" style="color:${isRight ? 'var(--success)' : 'var(--accent2)'};">
                  Your answer: ${ans !== null ? q.options[ans] : 'Not answered'}
                  ${!isRight ? ' · Correct: ' + q.options[q.correct] : ' ✓'}
                </div>
              </div>
            `;
          }).join('')}
        </div>
        <button class="btn btn-primary" style="width:100%" onclick="goBack()">← Back to Dashboard</button>
      </div>
    `;
}

window.goBack = function () {
    activeQuiz = null;
    renderAvailable();
    showSection('available', document.querySelectorAll('.nav-link')[0]);
};

// ── HISTORY ──
async function renderHistory() {
    const el = document.getElementById('historyList');
    el.innerHTML = `<div style="text-align:center;padding:40px;color:var(--muted);font-family:'Space Mono',monospace;">Loading...</div>`;
    const myResults = await getMyResults();
    if (!myResults.length) {
        el.innerHTML = `<div class="empty-state"><div class="empty-icon">📊</div><div class="empty-text">No results yet</div><div class="empty-sub">Attempt a quiz first!</div></div>`;
        return;
    }
    el.innerHTML = myResults.map(r => `
      <div class="quiz-card">
        <div class="quiz-meta">
          <div class="quiz-name">${r.quizTitle}</div>
          <div class="quiz-info">
            <span>Score: ${r.score}/${r.total}</span>
            <span>${r.percentage}%</span>
            <span class="badge ${r.passed ? 'badge-active' : 'badge-closed'}">${r.passed ? 'PASSED' : 'FAILED'}</span>
            <span>${new Date(r.submittedAt).toLocaleDateString()}</span>
          </div>
        </div>
        <div style="font-size:28px;font-weight:800;color:${r.passed ? 'var(--success)' : 'var(--accent2)'};">${r.passed ? '✓' : '✕'}</div>
      </div>
    `).join('');
}

// Init
renderAvailable();