// WITH LOCAL STORAGE (FOR DEMO PURPOSES ONLY - NOT SECURE FOR PRODUCTION)
// let roleLogin = 'teacher', roleReg = 'teacher';

// function getUsers() {
//     try { return JSON.parse(localStorage.getItem('qc_users') || '{}'); }
//     catch (e) { return {}; }
// }
// function saveUsers(u) { localStorage.setItem('qc_users', JSON.stringify(u)); }

// function showMsg(msg, type) {
//     const el = document.getElementById('message');
//     el.textContent = msg;
//     el.className = type;
//     el.style.display = msg ? 'block' : 'none';
// }

// window.switchTab = function (tab) {
//     document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
//     document.querySelectorAll('.form-panel').forEach(p => p.classList.remove('active'));
//     if (tab === 'login') {
//         document.querySelectorAll('.tab')[0].classList.add('active');
//         document.getElementById('loginPanel').classList.add('active');
//     } else {
//         document.querySelectorAll('.tab')[1].classList.add('active');
//         document.getElementById('registerPanel').classList.add('active');
//     }
//     showMsg('', '');
// };

// window.setRole = function (role, form) {
//     if (form === 'login') {
//         roleLogin = role;
//         document.getElementById('loginTeacherBtn').classList.toggle('active', role === 'teacher');
//         document.getElementById('loginStudentBtn').classList.toggle('active', role === 'student');
//     } else {
//         roleReg = role;
//         document.getElementById('regTeacherBtn').classList.toggle('active', role === 'teacher');
//         document.getElementById('regStudentBtn').classList.toggle('active', role === 'student');
//     }
// };

// window.handleRegister = function () {
//     const name = document.getElementById('regName').value.trim();
//     const email = document.getElementById('regEmail').value.trim().toLowerCase();
//     const password = document.getElementById('regPassword').value;

//     if (!name) return showMsg('Please enter your full name.', 'error');
//     if (!email || !email.includes('@')) return showMsg('Please enter a valid email address.', 'error');
//     if (password.length < 6) return showMsg('Password must be at least 6 characters.', 'error');

//     const users = getUsers();
//     if (users[email]) return showMsg('This email is already registered. Please sign in.', 'error');

//     users[email] = { name, email, password, role: roleReg, createdAt: new Date().toISOString() };
//     saveUsers(users);
//     localStorage.setItem('qc_session', JSON.stringify({ email, name, role: roleReg }));

//     showMsg('Account created! Redirecting...', 'success');
//     setTimeout(() => {
//         window.location.href = roleReg === 'teacher' ? 'teacher-dashboard.html' : 'student-dashboard.html';
//     }, 800);
// };

// window.handleLogin = function () {
//     const email = document.getElementById('loginEmail').value.trim().toLowerCase();
//     const password = document.getElementById('loginPassword').value;

//     if (!email || !password) return showMsg('Please fill in all fields.', 'error');

//     const users = getUsers();
//     const user = users[email];
//     if (!user) return showMsg('No account found. Please register first.', 'error');
//     if (user.password !== password) return showMsg('Incorrect password. Try again.', 'error');

//     localStorage.setItem('qc_session', JSON.stringify({ email, name: user.name, role: user.role }));
//     showMsg('Welcome back! Redirecting...', 'success');
//     setTimeout(() => {
//         window.location.href = user.role === 'teacher' ? 'teacher-dashboard.html' : 'student-dashboard.html';
//     }, 800);
// };

// // Auto-redirect if already logged in
// (function () {
//     try {
//         const session = JSON.parse(localStorage.getItem('qc_session') || 'null');
//         if (session && session.role) {
//             window.location.href = session.role === 'teacher' ? 'teacher-dashboard.html' : 'student-dashboard.html';
//         }
//     } catch (e) { }
// })();

// // Enter key support
// document.addEventListener('keydown', function (e) {
//     if (e.key === 'Enter') {
//         if (document.getElementById('loginPanel').classList.contains('active')) handleLogin();
//         else handleRegister();
//     }
// });











// WITH FIREBASE BACKEND (REQUIRES CONFIGURATION IN firebase-config.js)
import { db, collection, doc, setDoc, getDoc } from "./firebase-config.js";

let roleLogin = 'teacher', roleReg = 'teacher';

// ── FIREBASE HELPERS ──
async function getUser(email) {
    const snap = await getDoc(doc(db, "users", email));
    return snap.exists() ? snap.data() : null;
}

async function saveUser(email, data) {
    await setDoc(doc(db, "users", email), data);
}

// ── UI MESSAGE ──
function showMsg(msg, type) {
    const el = document.getElementById('message');
    el.textContent = msg;
    el.className = type;
    el.style.display = msg ? 'block' : 'none';
}

// ── TAB SWITCHING ──
window.switchTab = function (tab) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.form-panel').forEach(p => p.classList.remove('active'));
    if (tab === 'login') {
        document.querySelectorAll('.tab')[0].classList.add('active');
        document.getElementById('loginPanel').classList.add('active');
    } else {
        document.querySelectorAll('.tab')[1].classList.add('active');
        document.getElementById('registerPanel').classList.add('active');
    }
    showMsg('', '');
};

// ── ROLE SELECT ──
window.setRole = function (role, form) {
    if (form === 'login') {
        roleLogin = role;
        document.getElementById('loginTeacherBtn').classList.toggle('active', role === 'teacher');
        document.getElementById('loginStudentBtn').classList.toggle('active', role === 'student');
    } else {
        roleReg = role;
        document.getElementById('regTeacherBtn').classList.toggle('active', role === 'teacher');
        document.getElementById('regStudentBtn').classList.toggle('active', role === 'student');
    }
};

// ── REGISTER ──
window.handleRegister = async function () {
    const name     = document.getElementById('regName').value.trim();
    const email    = document.getElementById('regEmail').value.trim().toLowerCase();
    const password = document.getElementById('regPassword').value;

    if (!name)                         return showMsg('Please enter your full name.', 'error');
    if (!email || !email.includes('@')) return showMsg('Please enter a valid email address.', 'error');
    if (password.length < 6)           return showMsg('Password must be at least 6 characters.', 'error');

    const btn = document.getElementById('regBtn');
    btn.disabled = true;
    btn.textContent = 'Creating account...';

    try {
        const existing = await getUser(email);
        if (existing) {
            showMsg('This email is already registered. Please sign in.', 'error');
            btn.disabled = false;
            btn.textContent = 'Create Account →';
            return;
        }

        await saveUser(email, {
            name, email, password,
            role: roleReg,
            createdAt: new Date().toISOString()
        });

        localStorage.setItem('qc_session', JSON.stringify({ email, name, role: roleReg }));
        showMsg('Account created! Redirecting...', 'success');

        setTimeout(() => {
            window.location.href = roleReg === 'teacher' ? 'teacher-dashboard.html' : 'student-dashboard.html';
        }, 800);
    } catch (err) {
        showMsg('Error: ' + err.message, 'error');
        btn.disabled = false;
        btn.textContent = 'Create Account →';
    }
};

// ── LOGIN ──
window.handleLogin = async function () {
    const email    = document.getElementById('loginEmail').value.trim().toLowerCase();
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) return showMsg('Please fill in all fields.', 'error');

    const btn = document.getElementById('loginBtn');
    btn.disabled = true;
    btn.textContent = 'Signing in...';

    try {
        const user = await getUser(email);
        if (!user) {
            showMsg('No account found. Please register first.', 'error');
            btn.disabled = false;
            btn.textContent = 'Sign In →';
            return;
        }
        if (user.password !== password) {
            showMsg('Incorrect password. Try again.', 'error');
            btn.disabled = false;
            btn.textContent = 'Sign In →';
            return;
        }

        localStorage.setItem('qc_session', JSON.stringify({ email, name: user.name, role: user.role }));
        showMsg('Welcome back! Redirecting...', 'success');

        setTimeout(() => {
            window.location.href = user.role === 'teacher' ? 'teacher-dashboard.html' : 'student-dashboard.html';
        }, 800);
    } catch (err) {
        showMsg('Error: ' + err.message, 'error');
        btn.disabled = false;
        btn.textContent = 'Sign In →';
    }
};

// ── AUTO REDIRECT ──
(function () {
    try {
        const session = JSON.parse(localStorage.getItem('qc_session') || 'null');
        if (session && session.role) {
            window.location.href = session.role === 'teacher' ? 'teacher-dashboard.html' : 'student-dashboard.html';
        }
    } catch (e) {}
})();

// ── ENTER KEY ──
document.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        if (document.getElementById('loginPanel').classList.contains('active')) handleLogin();
        else handleRegister();
    }
});