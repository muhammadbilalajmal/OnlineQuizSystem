// // ── AUTH CHECK ──
// const session = JSON.parse(localStorage.getItem('qc_session') || 'null');
// if (!session || session.role !== 'teacher') window.location.href = '../index.html';

// document.getElementById('sidebarName').textContent = session.name;
// document.getElementById('sidebarAvatar').textContent = session.name[0].toUpperCase();

// // ── DATA HELPERS ──
// function getQuizzes() { return JSON.parse(localStorage.getItem('qc_quizzes') || '[]'); }
// function saveQuizzes(q) { localStorage.setItem('qc_quizzes', JSON.stringify(q)); }
// function getResults() { return JSON.parse(localStorage.getItem('qc_results') || '[]'); }
// function getUsers() { return JSON.parse(localStorage.getItem('qc_users') || '{}'); }

// // ── NAV ──
// window.showSection = function (section, btn) {
//     document.querySelectorAll('.main > div').forEach(el => el.style.display = 'none');
//     document.getElementById('section' + section.charAt(0).toUpperCase() + section.slice(1)).style.display = 'block';
//     document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
//     btn.classList.add('active');
//     if (section === 'results') renderResults();
//     if (section === 'students') renderStudents();
// };

// window.handleLogout = function () {
//     localStorage.removeItem('qc_session');
//     window.location.href = '../index.html';
// };

// // ── QUIZ LIST ──
// let questionCount = 0;

// function renderQuizList() {
//     const quizzes = getQuizzes().filter(q => q.createdBy === session.email);
//     const results = getResults().filter(r => r.teacherEmail === session.email);
//     const el = document.getElementById('quizList');

//     document.getElementById('statTotal').textContent = quizzes.length;
//     document.getElementById('statActive').textContent = quizzes.filter(q => q.status === 'active').length;
//     document.getElementById('statSubs').textContent = results.length;
//     if (results.length) {
//         const avg = results.reduce((s, r) => s + r.percentage, 0) / results.length;
//         document.getElementById('statAvg').textContent = Math.round(avg) + '%';
//     }

//     if (!quizzes.length) {
//         el.innerHTML = `<div class="empty-state"><div class="empty-icon">📋</div><div class="empty-text">No quizzes yet</div><div class="empty-sub">Create your first quiz to get started</div></div>`;
//         return;
//     }
//     el.innerHTML = quizzes.map(q => `
//       <div class="quiz-card">
//         <div class="quiz-meta">
//           <div class="quiz-name">${q.title}</div>
//           <div class="quiz-info">
//             <span>⏱ ${q.timeLimit} mins</span>
//             <span>❓ ${q.questions.length} questions</span>
//             <span>🎯 Pass: ${q.passmark}%</span>
//             <span class="badge badge-${q.status}">${q.status}</span>
//           </div>
//         </div>
//         <div class="quiz-actions">
//           <button class="btn btn-secondary btn-sm" onclick="viewQuiz('${q.id}')">View</button>
//           <button class="btn btn-danger btn-sm" onclick="deleteQuiz('${q.id}')">Delete</button>
//         </div>
//       </div>
//     `).join('');
// }

// window.openCreateModal = function () {
//     questionCount = 0;
//     document.getElementById('questionsContainer').innerHTML = '';
//     document.getElementById('quizTitle').value = '';
//     document.getElementById('quizDesc').value = '';
//     document.getElementById('quizTime').value = '30';
//     document.getElementById('quizPass').value = '60';
//     addQuestion();
//     document.getElementById('createModal').classList.add('open');
// };

// window.addQuestion = function () {
//     questionCount++;
//     const i = questionCount;
//     const block = document.createElement('div');
//     block.className = 'question-block';
//     block.id = 'qblock-' + i;
//     block.innerHTML = `
//       <div class="q-number">Question ${i}</div>
//       <div class="form-group">
//         <input type="text" id="q-text-${i}" placeholder="Enter question text..." />
//       </div>
//       ${[0, 1, 2, 3].map(j => `
//         <div class="option-row">
//           <input type="radio" name="correct-${i}" value="${j}" ${j === 0 ? 'checked' : ''} />
//           <input type="text" id="q-opt-${i}-${j}" placeholder="Option ${j + 1}" />
//         </div>
//       `).join('')}
//       <div style="margin-top:8px;font-family:'Space Mono',monospace;font-size:11px;color:var(--muted);">● = Correct answer</div>
//     `;
//     document.getElementById('questionsContainer').appendChild(block);
// };

// window.saveQuiz = function (status) {
//     const title = document.getElementById('quizTitle').value.trim();
//     if (!title) return showToast('Quiz title is required.', 'error');

//     const questions = [];
//     for (let i = 1; i <= questionCount; i++) {
//         const textEl = document.getElementById('q-text-' + i);
//         if (!textEl) continue;
//         const text = textEl.value.trim();
//         if (!text) continue;
//         const options = [0, 1, 2, 3].map(j => {
//             const el = document.getElementById('q-opt-' + i + '-' + j);
//             return el ? el.value.trim() : '';
//         });
//         const correctEl = document.querySelector('input[name="correct-' + i + '"]:checked');
//         questions.push({ text, options, correct: correctEl ? parseInt(correctEl.value) : 0 });
//     }
//     if (!questions.length) return showToast('Add at least one question.', 'error');

//     const quizzes = getQuizzes();
//     quizzes.push({
//         id: 'q_' + Date.now(),
//         title,
//         desc: document.getElementById('quizDesc').value.trim(),
//         timeLimit: parseInt(document.getElementById('quizTime').value) || 30,
//         passmark: parseInt(document.getElementById('quizPass').value) || 60,
//         questions, status,
//         createdBy: session.email,
//         teacherName: session.name,
//         createdAt: new Date().toISOString()
//     });
//     saveQuizzes(quizzes);
//     closeModal('createModal');
//     showToast('Quiz ' + (status === 'active' ? 'published!' : 'saved as draft!'), 'success');
//     renderQuizList();
// };

// window.viewQuiz = function (id) {
//     const q = getQuizzes().find(x => x.id === id);
//     if (!q) return;
//     document.getElementById('viewModalTitle').textContent = q.title;
//     document.getElementById('viewModalBody').innerHTML = `
//       <p style="font-family:'Space Mono',monospace;font-size:12px;color:var(--muted);margin-bottom:18px;">${q.desc || 'No description'}</p>
//       <div style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:20px;">
//         <span class="badge badge-${q.status}">${q.status}</span>
//         <span style="font-family:'Space Mono',monospace;font-size:12px;color:var(--muted);">⏱ ${q.timeLimit} mins &nbsp;🎯 Pass: ${q.passmark}% &nbsp;❓ ${q.questions.length} Qs</span>
//       </div>
//       <h3 style="font-size:15px;font-weight:800;margin-bottom:14px;">Questions</h3>
//       ${q.questions.map((qs, i) => `
//         <div class="question-block" style="margin-bottom:10px;">
//           <div class="q-number">Q${i + 1}</div>
//           <div style="font-size:14px;font-weight:700;margin-bottom:10px;">${qs.text}</div>
//           ${qs.options.map((opt, j) => `
//             <div style="padding:7px 12px;border-radius:8px;font-family:'Space Mono',monospace;font-size:12px;margin-bottom:6px;
//               background:${j === qs.correct ? 'rgba(78,204,163,0.1)' : 'var(--bg)'};
//               border:1px solid ${j === qs.correct ? 'rgba(78,204,163,0.3)' : 'var(--border)'};
//               color:${j === qs.correct ? 'var(--success)' : 'var(--muted)'};">
//               ${j === qs.correct ? '✓ ' : ''}${opt || '(empty)'}
//             </div>
//           `).join('')}
//         </div>
//       `).join('')}
//       <div style="display:flex;gap:10px;margin-top:16px;">
//         <button class="btn btn-success btn-sm" onclick="toggleStatus('${id}','${q.status}')">
//           ${q.status === 'active' ? 'Close Quiz' : 'Activate Quiz'}
//         </button>
//       </div>
//     `;
//     document.getElementById('viewModal').classList.add('open');
// };

// window.deleteQuiz = function (id) {
//     if (!confirm('Delete this quiz? This cannot be undone.')) return;
//     saveQuizzes(getQuizzes().filter(q => q.id !== id));
//     showToast('Quiz deleted.', 'success');
//     renderQuizList();
// };

// window.toggleStatus = function (id, current) {
//     const quizzes = getQuizzes();
//     const q = quizzes.find(x => x.id === id);
//     if (!q) return;
//     q.status = current === 'active' ? 'closed' : 'active';
//     saveQuizzes(quizzes);
//     closeModal('viewModal');
//     showToast('Quiz is now ' + q.status + '.', 'success');
//     renderQuizList();
// };

// // ── RESULTS ──
// function renderResults() {
//     const results = getResults().filter(r => r.teacherEmail === session.email);
//     const el = document.getElementById('resultsList');
//     if (!results.length) {
//         el.innerHTML = `<div class="empty-state"><div class="empty-icon">📊</div><div class="empty-text">No submissions yet</div><div class="empty-sub">Students haven't attempted any quizzes</div></div>`;
//         return;
//     }
//     el.innerHTML = results.map(r => `
//       <div class="quiz-card">
//         <div class="quiz-meta">
//           <div class="quiz-name">${r.studentName} — ${r.quizTitle}</div>
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

// // ── STUDENTS ──
// function renderStudents() {
//     const users = getUsers();
//     const students = Object.values(users).filter(u => u.role === 'student');
//     const el = document.getElementById('studentList');
//     if (!students.length) {
//         el.innerHTML = `<div class="empty-state"><div class="empty-icon">🎓</div><div class="empty-text">No students registered yet</div></div>`;
//         return;
//     }
//     el.innerHTML = students.map(s => `
//       <div class="quiz-card">
//         <div class="quiz-meta">
//           <div class="quiz-name">${s.name}</div>
//           <div class="quiz-info"><span>${s.email}</span><span>Joined: ${s.createdAt.split('T')[0]}</span></div>
//         </div>
//         <div class="avatar">${s.name[0].toUpperCase()}</div>
//       </div>
//     `).join('');
// }

// // ── HELPERS ──
// window.closeModal = function (id) { document.getElementById(id).classList.remove('open'); };

// function showToast(msg, type) {
//     const t = document.getElementById('toast');
//     t.textContent = msg; t.className = 'show ' + type;
//     setTimeout(() => t.className = '', 3000);
// }

// // Init
// renderQuizList();

























import { db, collection, doc, getDocs, addDoc, query, where } from "./firebase-config.js";

// ── AUTH CHECK ──
const session = JSON.parse(localStorage.getItem('qc_session') || 'null');
if (!session || session.role !== 'teacher') window.location.href = 'index.html';

document.getElementById('sidebarName').textContent = session.name;
document.getElementById('sidebarAvatar').textContent = session.name[0].toUpperCase();

// ── FIREBASE HELPERS ──
async function getQuizzes() {
  const q = query(collection(db, "quizzes"), where("createdBy", "==", session.email));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

async function saveQuiz(quizData) {
  await addDoc(collection(db, "quizzes"), quizData);
}

async function getResults() {
  const q = query(collection(db, "results"), where("teacherEmail", "==", session.email));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

async function getStudents() {
  const q = query(collection(db, "users"), where("role", "==", "student"));
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data());
}

// ── NAV ──
window.showSection = function (section, btn) {
  document.querySelectorAll('.main > div').forEach(el => el.style.display = 'none');
  document.getElementById('section' + section.charAt(0).toUpperCase() + section.slice(1)).style.display = 'block';
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  btn.classList.add('active');
  if (section === 'results') renderResults();
  if (section === 'students') renderStudents();
};

window.handleLogout = function () {
  localStorage.removeItem('qc_session');
  window.location.href = 'index.html';
};

// ── QUIZ LIST ──
let questionCount = 0;
let allQuizzes = [];

async function renderQuizList() {
  const el = document.getElementById('quizList');
  el.innerHTML = `<div style="text-align:center;padding:40px;color:var(--muted);font-family:'Space Mono',monospace;">Loading...</div>`;

  allQuizzes = await getQuizzes();
  const results = await getResults();

  document.getElementById('statTotal').textContent = allQuizzes.length;
  document.getElementById('statActive').textContent = allQuizzes.filter(q => q.status === 'active').length;
  document.getElementById('statSubs').textContent = results.length;
  if (results.length) {
    const avg = results.reduce((s, r) => s + r.percentage, 0) / results.length;
    document.getElementById('statAvg').textContent = Math.round(avg) + '%';
  }

  if (!allQuizzes.length) {
    el.innerHTML = `<div class="empty-state"><div class="empty-icon">📋</div><div class="empty-text">No quizzes yet</div><div class="empty-sub">Create your first quiz to get started</div></div>`;
    return;
  }
  el.innerHTML = allQuizzes.map(q => `
      <div class="quiz-card">
        <div class="quiz-meta">
          <div class="quiz-name">${q.title}</div>
          <div class="quiz-info">
            <span>⏱ ${q.timeLimit} mins</span>
            <span>❓ ${q.questions.length} questions</span>
            <span>🎯 Pass: ${q.passmark}%</span>
            <span class="badge badge-${q.status}">${q.status}</span>
          </div>
        </div>
        <div class="quiz-actions">
          <button class="btn btn-secondary btn-sm" onclick="viewQuiz('${q.id}')">View</button>
          <button class="btn btn-danger btn-sm" onclick="deleteQuiz('${q.id}')">Delete</button>
        </div>
      </div>
    `).join('');
}

window.openCreateModal = function () {
  questionCount = 0;
  document.getElementById('questionsContainer').innerHTML = '';
  document.getElementById('quizTitle').value = '';
  document.getElementById('quizDesc').value = '';
  document.getElementById('quizTime').value = '30';
  document.getElementById('quizPass').value = '60';
  addQuestion();
  document.getElementById('createModal').classList.add('open');
};

window.addQuestion = function () {
  questionCount++;
  const i = questionCount;
  const block = document.createElement('div');
  block.className = 'question-block';
  block.id = 'qblock-' + i;
  block.innerHTML = `
      <div class="q-number">Question ${i}</div>
      <div class="form-group">
        <input type="text" id="q-text-${i}" placeholder="Enter question text..." />
      </div>
      ${[0, 1, 2, 3].map(j => `
        <div class="option-row">
          <input type="radio" name="correct-${i}" value="${j}" ${j === 0 ? 'checked' : ''} />
          <input type="text" id="q-opt-${i}-${j}" placeholder="Option ${j + 1}" />
        </div>
      `).join('')}
      <div style="margin-top:8px;font-family:'Space Mono',monospace;font-size:11px;color:var(--muted);">● = Correct answer</div>
    `;
  document.getElementById('questionsContainer').appendChild(block);
};

window.saveQuizBtn = async function (status) {
  const title = document.getElementById('quizTitle').value.trim();
  if (!title) return showToast('Quiz title is required.', 'error');

  const questions = [];
  for (let i = 1; i <= questionCount; i++) {
    const textEl = document.getElementById('q-text-' + i);
    if (!textEl) continue;
    const text = textEl.value.trim();
    if (!text) continue;
    const options = [0, 1, 2, 3].map(j => {
      const el = document.getElementById('q-opt-' + i + '-' + j);
      return el ? el.value.trim() : '';
    });
    const correctEl = document.querySelector('input[name="correct-' + i + '"]:checked');
    questions.push({ text, options, correct: correctEl ? parseInt(correctEl.value) : 0 });
  }
  if (!questions.length) return showToast('Add at least one question.', 'error');

  const saveBtn = document.querySelector(`button[onclick="saveQuizBtn('${status}')"]`);
  if (saveBtn) { saveBtn.disabled = true; saveBtn.textContent = 'Saving...'; }

  try {
    await saveQuiz({
      title,
      desc: document.getElementById('quizDesc').value.trim(),
      timeLimit: parseInt(document.getElementById('quizTime').value) || 30,
      passmark: parseInt(document.getElementById('quizPass').value) || 60,
      questions, status,
      createdBy: session.email,
      teacherName: session.name,
      createdAt: new Date().toISOString()
    });
    closeModal('createModal');
    showToast('Quiz ' + (status === 'active' ? 'published!' : 'saved as draft!'), 'success');
    renderQuizList();
  } catch (err) {
    showToast('Error: ' + err.message, 'error');
    if (saveBtn) { saveBtn.disabled = false; saveBtn.textContent = status === 'active' ? 'Publish Quiz' : 'Save as Draft'; }
  }
};

window.viewQuiz = function (id) {
  const q = allQuizzes.find(x => x.id === id);
  if (!q) return;
  document.getElementById('viewModalTitle').textContent = q.title;
  document.getElementById('viewModalBody').innerHTML = `
      <p style="font-family:'Space Mono',monospace;font-size:12px;color:var(--muted);margin-bottom:18px;">${q.desc || 'No description'}</p>
      <div style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:20px;">
        <span class="badge badge-${q.status}">${q.status}</span>
        <span style="font-family:'Space Mono',monospace;font-size:12px;color:var(--muted);">⏱ ${q.timeLimit} mins &nbsp;🎯 Pass: ${q.passmark}% &nbsp;❓ ${q.questions.length} Qs</span>
      </div>
      <h3 style="font-size:15px;font-weight:800;margin-bottom:14px;">Questions</h3>
      ${q.questions.map((qs, i) => `
        <div class="question-block" style="margin-bottom:10px;">
          <div class="q-number">Q${i + 1}</div>
          <div style="font-size:14px;font-weight:700;margin-bottom:10px;">${qs.text}</div>
          ${qs.options.map((opt, j) => `
            <div style="padding:7px 12px;border-radius:8px;font-family:'Space Mono',monospace;font-size:12px;margin-bottom:6px;
              background:${j === qs.correct ? 'rgba(78,204,163,0.1)' : 'var(--bg)'};
              border:1px solid ${j === qs.correct ? 'rgba(78,204,163,0.3)' : 'var(--border)'};
              color:${j === qs.correct ? 'var(--success)' : 'var(--muted)'};">
              ${j === qs.correct ? '✓ ' : ''}${opt || '(empty)'}
            </div>
          `).join('')}
        </div>
      `).join('')}
      <div style="display:flex;gap:10px;margin-top:16px;">
        <button class="btn btn-success btn-sm" onclick="toggleStatus('${id}','${q.status}')">
          ${q.status === 'active' ? 'Close Quiz' : 'Activate Quiz'}
        </button>
      </div>
    `;
  document.getElementById('viewModal').classList.add('open');
};

window.toggleStatus = async function (id, current) {
  const newStatus = current === 'active' ? 'closed' : 'active';
  try {
    // Update in Firestore using setDoc merge
    const { doc: fsDoc, setDoc: fsSetDoc } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");
    const { updateDoc } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");
    await updateDoc(fsDoc(db, "quizzes", id), { status: newStatus });
    closeModal('viewModal');
    showToast('Quiz is now ' + newStatus + '.', 'success');
    renderQuizList();
  } catch (err) {
    showToast('Error: ' + err.message, 'error');
  }
};

window.deleteQuiz = async function (id) {
  if (!confirm('Delete this quiz? This cannot be undone.')) return;
  try {
    const { doc: fsDoc, deleteDoc } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");
    await deleteDoc(fsDoc(db, "quizzes", id));
    showToast('Quiz deleted.', 'success');
    renderQuizList();
  } catch (err) {
    showToast('Error: ' + err.message, 'error');
  }
};

// ── RESULTS ──
async function renderResults() {
  const el = document.getElementById('resultsList');
  el.innerHTML = `<div style="text-align:center;padding:40px;color:var(--muted);font-family:'Space Mono',monospace;">Loading...</div>`;
  const results = await getResults();
  if (!results.length) {
    el.innerHTML = `<div class="empty-state"><div class="empty-icon">📊</div><div class="empty-text">No submissions yet</div><div class="empty-sub">Students haven't attempted any quizzes</div></div>`;
    return;
  }
  el.innerHTML = results.map(r => `
      <div class="quiz-card">
        <div class="quiz-meta">
          <div class="quiz-name">${r.studentName} — ${r.quizTitle}</div>
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

// ── STUDENTS ──
async function renderStudents() {
  const el = document.getElementById('studentList');
  el.innerHTML = `<div style="text-align:center;padding:40px;color:var(--muted);font-family:'Space Mono',monospace;">Loading...</div>`;
  const students = await getStudents();
  if (!students.length) {
    el.innerHTML = `<div class="empty-state"><div class="empty-icon">🎓</div><div class="empty-text">No students registered yet</div></div>`;
    return;
  }
  el.innerHTML = students.map(s => `
      <div class="quiz-card">
        <div class="quiz-meta">
          <div class="quiz-name">${s.name}</div>
          <div class="quiz-info"><span>${s.email}</span><span>Joined: ${s.createdAt.split('T')[0]}</span></div>
        </div>
        <div class="avatar">${s.name[0].toUpperCase()}</div>
      </div>
    `).join('');
}

// ── HELPERS ──
window.closeModal = function (id) { document.getElementById(id).classList.remove('open'); };

function showToast(msg, type) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.className = 'show ' + type;
  setTimeout(() => t.className = '', 3000);
}

// Init
renderQuizList();
