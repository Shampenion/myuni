// ==================== 1. FIREBASE КОНФІГУРАЦІЯ ТА АДМІНІСТРАТОР ====================
const ADMIN_EMAIL = "brigadir1904@gmail.com";

const firebaseConfig = {
    apiKey: "AIzaSyDMEY3nyIYXpwtfBnLJANUkRzWWf73zdVg",
    authDomain: "myuni-dc1a4.firebaseapp.com",
    projectId: "myuni-dc1a4",
    storageBucket: "myuni-dc1a4.firebasestorage.app",
    messagingSenderId: "190606665331",
    appId: "1:190606665331:web:8fc6f1b3d68d5efc72ac06",
    measurementId: "G-QL7PBB6GPG"
};

// Ініціалізація
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

let currentUser = null;
let isSignUpMode = false;

function isAdmin() {
    return currentUser && currentUser.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
}

// ==================== 2. БАЗА ДАНИХ РОЗКЛАДУ ====================
const scheduleDB = {
    upper: [
        { day: 'Понеділок', time: '08:00–09:20', subject: 'Теорія держави і права', type: 'Лекція', teacher: 'Дубов', room: '340', link: 'https://us06web.zoom.us/j/3503721966' },
        { day: 'Понеділок', time: '09:40–11:00', subject: 'Логіка', type: 'Лекція', teacher: 'Комаха', room: '332', link: 'https://meet.google.com/ihw-vszf-ixs' },
        { day: 'Понеділок', time: '11:20–12:40', subject: 'Основи національного супротиву', type: 'Лекція', teacher: 'Савков', room: '332', link: '' },
        { day: 'Вівторок', time: '08:00–09:20', subject: 'Римське право', type: 'Лекція', teacher: 'Безклубий', room: '340', link: 'https://us04web.zoom.us/j/75180834815' },
        { day: 'Вівторок', time: '09:40–11:00', subject: 'Історія держави і права зарубіжних країн', type: 'Лекція', teacher: 'Крижевський', room: '461', link: 'https://meet.google.com/keb-xdrf-ejg' },
        { day: 'Вівторок', time: '11:20–12:40', subject: 'Історія держави і права України', type: 'Лекція', teacher: 'Самохвалов', room: '243', link: 'https://us05web.zoom.us/j/6279745556' },
        { day: 'Вівторок', time: '13:05–14:25', subject: 'Історія держави і права зарубіжних країн', type: 'Семінар', teacher: 'Крижевський', room: '434', link: 'https://meet.google.com/gqt-fpct-yox' },
        { day: 'Середа', time: '08:00–09:20', subject: 'Професійна іноземна мова', type: 'Практика', teacher: 'dynamic', room: '408/418', link: 'dynamic' },
        { day: 'Середа', time: '09:40–11:00', subject: 'Українська та зарубіжна культура', type: 'Лекція', teacher: 'Ляшенко', room: '325', link: 'https://us05web.zoom.us/j/87491532380' },
        { day: 'Середа', time: '11:20–12:40', subject: 'Основи національного супротиву', type: 'Семінар', teacher: 'Савков', room: '461', link: '' },
        { day: 'Четвер', time: '08:00–09:20', subject: 'Теорія держави і права', type: 'Семінар', teacher: 'Дубов', room: '150', link: 'https://meet.google.com/myx-mrms-tsi' },
        { day: 'Четвер', time: '09:40–11:00', subject: 'Римське право', type: 'Семінар', teacher: 'Безклубий', room: '160', link: 'https://us04web.zoom.us/j/72697932211' },
        { day: 'Четвер', time: '11:20–12:40', subject: 'Вступ до університетських студій', type: 'Лекція', teacher: 'Сергійчук', room: '234', link: 'https://us04web.zoom.us/j/3679214484' },
        { day: 'П\'ятниця', time: '09:40–11:00', subject: 'Українська правнича термінологія', type: 'Лекція', teacher: 'Карпічков', room: '234', link: 'https://knu-ua.zoom.us/j/84233734410' },
        { day: 'П\'ятниця', time: '11:20–12:40', subject: 'Класичні вчення про право та державу', type: 'Лекція', teacher: 'Кабанець', room: '234', link: 'https://us04web.zoom.us/j/9282524461' },
        { day: 'П\'ятниця', time: '13:05–14:25', subject: 'Українська правнича термінологія', type: 'Семінар', teacher: 'Карпічкова', room: '450', link: 'https://knu-ua.zoom.us/j/84233734410' }
    ],
    lower: [
        { day: 'Понеділок', time: '08:00–09:20', subject: 'Теорія держави і права', type: 'Лекція', teacher: 'Дубов', room: '340', link: 'https://us05web.zoom.us/j/3503721966' },
        { day: 'Понеділок', time: '09:40–11:00', subject: 'Логіка', type: 'Лекція', teacher: 'Комаха', room: '332', link: 'https://meet.google.com/ihw-vszf-ixs' },
        { day: 'Понеділок', time: '11:20–12:40', subject: 'Основи національного супротиву', type: 'Лекція', teacher: 'Савков', room: '332', link: '' },
        { day: 'Понеділок', time: '13:05–14:25', subject: 'ВІКНО', type: 'window' },
        { day: 'Вівторок', time: '08:00–09:20', subject: 'Римське право', type: 'Лекція', teacher: 'Безклубий', room: '340', link: '' },
        { day: 'Вівторок', time: '09:40–11:00', subject: 'Історія держави і права зарубіжних країн', type: 'Лекція', teacher: 'Крижевський', room: '461', link: 'https://meet.google.com/keb-xdrf-ejg' },
        { day: 'Вівторок', time: '11:20–12:40', subject: 'Історія держави і права України', type: 'Лекція', teacher: 'Самохвалов', room: '243', link: 'https://us05web.zoom.us/j/6279745556' },
        { day: 'Вівторок', time: '13:05–14:25', subject: 'ВІКНО', type: 'window' },
        { day: 'Середа', time: '08:00–09:20', subject: 'Професійна іноземна мова', type: 'Практика', teacher: 'dynamic', room: '408/418', link: 'dynamic' },
        { day: 'Середа', time: '09:40–11:00', subject: 'Історія держави і права України', type: 'Семінар', teacher: 'Теремцова', room: '108', link: 'https://meet.google.com/keb-xdrf-ejg' },
        { day: 'Середа', time: '11:20–12:40', subject: 'Основи національного супротиву', type: 'Семінар', teacher: 'Савков', room: '461', link: '' },
        { day: 'Середа', time: '13:05–14:25', subject: 'ВІКНО', type: 'window' },
        { day: 'Четвер', time: '08:00–09:20', subject: 'Теорія держави і права', type: 'Семінар', teacher: 'Дубов', room: '150', link: 'https://us05web.zoom.us/j/3503721966' },
        { day: 'Четвер', time: '09:40–11:00', subject: 'ВІКНО', type: 'window' },
        { day: 'Четвер', time: '11:20–12:40', subject: 'Вступ до університетських студій', type: 'Лекція', teacher: 'Сергійчук', room: '234', link: 'https://us04web.zoom.us/j/3679214484' },
        { day: 'Четвер', time: '13:05–14:25', subject: 'Логіка', type: 'Семінар', teacher: 'Гайдич', room: '436', link: '' },
        { day: 'П\'ятниця', time: '08:00–09:20', subject: 'Українська та зарубіжна культура', type: 'Семінар', teacher: 'Ляшенко', room: '160', link: '' },
        { day: 'П\'ятниця', time: '09:40–11:00', subject: 'Українська правнича термінологія', type: 'Лекція', teacher: 'Карпічков', room: '234', link: 'https://knu-ua.zoom.us/j/84233734410' },
        { day: 'П\'ятниця', time: '11:20–12:40', subject: 'ВІКНО', type: 'window' },
        { day: 'П\'ятниця', time: '13:05–14:25', subject: 'Класичні вчення про право та державу', type: 'Семінар', teacher: 'Кабанець', room: '449', link: 'https://us04web.zoom.us/j/9282524461' }
    ]
};

const allSubjectsList = [...new Set([...scheduleDB.upper, ...scheduleDB.lower]
    .filter(c => c.type !== 'window').map(c => c.subject.split('(')[0].trim()))];

let state = {
    weekType: localStorage.getItem('weekType') || 'upper',
    tasks: JSON.parse(localStorage.getItem('tasks')) || [],
    completedTaskIds: JSON.parse(localStorage.getItem('myCompletedTaskIds')) || [],
    subjectData: JSON.parse(localStorage.getItem('subjectData')) || {},
    settings: JSON.parse(localStorage.getItem('settings')) || { name: 'Студент', langGroup: '1', darkTheme: false },
    currentViewParams: null,
    uploadTarget: null,
    taskFilter: 'pending', taskSearch: '', taskSort: 'deadline',
    calendarDate: new Date(),
    currentDetailTaskId: null
};

allSubjectsList.forEach(sub => {
    if(!state.subjectData[sub]) state.subjectData[sub] = { notes: [], literature: [], seminars: [], additional_info: { text: '', files: [] } };
});

// ==================== 3. СИНХРОНІЗАЦІЯ ДАНИХ (ADMIN vs USER) ====================
function updateAdminUI() {
    const adminMode = isAdmin();

    const btnAddTask = document.getElementById('btnAddTask');
    if (btnAddTask) btnAddTask.style.display = adminMode ? 'inline-flex' : 'none';

    const uploadButtons = document.querySelectorAll('.panel-card button, #subject-details button:not(#btnBackToSubjects), #seminar-details button:not(#btnBackToSeminars)');
    uploadButtons.forEach(btn => {
        if (btn.innerText.includes('Зберегти')) {
            btn.style.display = adminMode ? 'inline-block' : 'none';
        }
        if (btn.querySelector('.fa-plus') || btn.querySelector('.fa-file-upload') || btn.querySelector('.fa-link') || btn.querySelector('.fa-google-drive')) {
            btn.style.display = adminMode ? 'inline-flex' : 'none';
        }
    });

    const editBtn = document.getElementById('detailBtnEdit');
    const deleteBtn = document.getElementById('detailBtnDelete');
    const addFileBtn = document.getElementById('btnAddTaskFile') || document.getElementById('btnAddDetailTaskFile');
    const addDriveBtn = document.getElementById('btnAddTaskDriveLink');
    if (editBtn) editBtn.style.display = adminMode ? 'inline-block' : 'none';
    if (deleteBtn) deleteBtn.style.display = adminMode ? 'inline-block' : 'none';
    if (addFileBtn) addFileBtn.style.display = adminMode ? 'inline-block' : 'none';
    if (addDriveBtn) addDriveBtn.style.display = adminMode ? 'inline-flex' : 'none';

    const additionalInfoArea = document.getElementById('additionalInfoText');
    if (additionalInfoArea) additionalInfoArea.readOnly = !adminMode;
}

// 🛡️ БЕЗПЕЧНЕ ЗБЕРЕЖЕННЯ ДАНИХ 🛡️
function saveData() {
    // 1. Локальний кеш
    localStorage.setItem('weekType', state.weekType);
    localStorage.setItem('tasks', JSON.stringify(state.tasks));
    localStorage.setItem('myCompletedTaskIds', JSON.stringify(state.completedTaskIds));
    localStorage.setItem('subjectData', JSON.stringify(state.subjectData));
    localStorage.setItem('settings', JSON.stringify(state.settings));

    if (!db) return;

    // 2. Оновлення глобальної хмари (ТІЛЬКИ з перевіркою на порожнечу)
    if (isAdmin()) {
        const updatePayload = {
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        if (Array.isArray(state.tasks) && state.tasks.length > 0) {
            updatePayload.tasks = state.tasks;
        }

        if (state.subjectData && Object.keys(state.subjectData).length > 0) {
            updatePayload.subjectData = state.subjectData;
        }

        db.collection('global_content').doc('main_data').set(updatePayload, { merge: true })
            .catch(err => console.error("Помилка запису в Firestore:", err));
    }

    // 3. Збереження персональних відміток
    if (currentUser) {
        db.collection('students').doc(currentUser.uid).set({
            completedTaskIds: state.completedTaskIds,
            settings: state.settings,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true }).catch(err => console.error("Помилка збереження студента:", err));
    }
}

// 🛡️ БЕЗПЕЧНЕ ЗАВАНТАЖЕННЯ ДАНИХ 🛡️
async function loadGlobalContent() {
    if (!db) return;
    try {
        const docRef = db.collection('global_content').doc('main_data');
        const doc = await docRef.get();
        if (doc.exists) {
            const data = doc.data();
            if (data.tasks && data.tasks.length > 0) {
                state.tasks = data.tasks;
                localStorage.setItem('tasks', JSON.stringify(state.tasks));
            }
            if (data.subjectData && Object.keys(data.subjectData).length > 0) {
                state.subjectData = { ...state.subjectData, ...data.subjectData };
                localStorage.setItem('subjectData', JSON.stringify(state.subjectData));
            }
        } else if (isAdmin()) {
            saveData();
        }
        syncTasksCompletion();
        renderTasks();
        renderCalendar();
        renderSubjectsGrid();
        renderSeminarsGrid();
    } catch (e) {
        console.error("Помилка завантаження глобальних даних:", e);
    }
}

async function loadUserData() {
    if (!currentUser || !db) return;
    try {
        const docRef = db.collection('students').doc(currentUser.uid);
        const doc = await docRef.get();
        if (doc.exists) {
            const data = doc.data();
            if (data.completedTaskIds) state.completedTaskIds = data.completedTaskIds;
            if (data.settings) {
                state.settings = { ...state.settings, ...data.settings };
                initSettings();
            }
        }
        syncTasksCompletion();
        renderTasks();
        renderCalendar();
    } catch (e) {
        console.error("Помилка завантаження даних студента:", e);
    }
}

function syncTasksCompletion() {
    state.tasks.forEach(t => {
        t.completed = state.completedTaskIds.includes(t.id);
    });
}

// ==================== 4. АВТОРИЗАЦІЯ FIREBASE ====================
auth.onAuthStateChanged(user => {
    currentUser = user;
    const userDisplay = document.getElementById('userDisplay');
    const btnAuthAction = document.getElementById('btnAuthAction');

    if (user) {
        const isAdm = isAdmin();
        if (userDisplay) {
            userDisplay.innerHTML = isAdm
                ? `<strong>👑 Адміністратор</strong><br><small>${user.email}</small>`
                : `<strong>Студент</strong><br><small>${user.email}</small>`;
        }
        if (btnAuthAction) btnAuthAction.innerHTML = '<i class="fas fa-sign-out-alt"></i> Вийти';
        loadUserData();
    } else {
        if (userDisplay) userDisplay.innerText = 'Гість (лише перегляд)';
        if (btnAuthAction) btnAuthAction.innerHTML = '<i class="fas fa-sign-in-alt"></i> Увійти';
    }

    updateAdminUI();
    renderTasks();
});

function setupAuthEventListeners() {
    const btnAuthAction = document.getElementById('btnAuthAction');
    const authModal = document.getElementById('authModal');
    const closeAuthModal = document.getElementById('closeAuthModal');
    const btnToggleAuthMode = document.getElementById('btnToggleAuthMode');
    const authForm = document.getElementById('authForm');

    if (btnAuthAction) {
        btnAuthAction.addEventListener('click', () => {
            if (currentUser) {
                auth.signOut();
            } else if (authModal) {
                authModal.style.display = 'flex';
            }
        });
    }

    if (closeAuthModal && authModal) {
        closeAuthModal.addEventListener('click', () => authModal.style.display = 'none');
    }

    if (btnToggleAuthMode) {
        btnToggleAuthMode.addEventListener('click', () => {
            isSignUpMode = !isSignUpMode;
            document.getElementById('authModalTitle').innerText = isSignUpMode ? 'Реєстрація' : 'Вхід до кабінету';
            document.getElementById('btnAuthSubmit').innerText = isSignUpMode ? 'Зареєструватися' : 'Увійти';
            btnToggleAuthMode.innerText = isSignUpMode ? 'Вже маєте акаунт? Увійти' : 'Немає акаунта? Зареєструватися';
            const authError = document.getElementById('authError');
            if (authError) authError.style.display = 'none';
        });
    }

    if (authForm) {
        authForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('authEmail').value;
            const pass = document.getElementById('authPassword').value;
            const errorEl = document.getElementById('authError');
            if (errorEl) errorEl.style.display = 'none';

            try {
                if (isSignUpMode) {
                    await auth.createUserWithEmailAndPassword(email, pass);
                } else {
                    await auth.signInWithEmailAndPassword(email, pass);
                }
                if (authModal) authModal.style.display = 'none';
                authForm.reset();
            } catch (err) {
                if (errorEl) {
                    errorEl.innerText = err.message;
                    errorEl.style.display = 'block';
                }
            }
        });
    }
}

// ==================== 5. INDEXED DB (ЗБЕРЕЖЕННЯ ФАЙЛІВ) ====================
const dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open('UniAppFilesDB', 1);
    request.onupgradeneeded = e => e.target.result.createObjectStore('files', { keyPath: 'id' });
    request.onsuccess = e => resolve(e.target.result);
    request.onerror = e => reject('Помилка БД');
});
async function saveFileToDB(fileObj) { const dbInst = await dbPromise; dbInst.transaction('files', 'readwrite').objectStore('files').put(fileObj); }
async function getFileFromDB(id) { const dbInst = await dbPromise; return new Promise(res => { const req = dbInst.transaction('files', 'readonly').objectStore('files').get(id); req.onsuccess = () => res(req.result); }); }
async function deleteFileFromDB(id) { const dbInst = await dbPromise; dbInst.transaction('files', 'readwrite').objectStore('files').delete(id); }

// ==================== 6. ІНІЦІАЛІЗАЦІЯ ====================
document.addEventListener('DOMContentLoaded', () => {
    initSettings();
    updateDateAndTime();
    renderSchedule();
    renderTasks();
    renderSubjectsGrid();
    renderSeminarsGrid();
    renderCalendar();
    setupNavigation();
    setupEventListeners();
    setupAuthEventListeners();
    loadGlobalContent();

    setInterval(updateDateAndTime, 60000);
});

// ==================== 7. НАВІГАЦІЯ ====================
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.page-section');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            navItems.forEach(nav => nav.classList.remove('active'));
            sections.forEach(sec => sec.classList.remove('active'));
            item.classList.add('active');
            const target = item.getAttribute('data-target');
            const targetEl = document.getElementById(target);
            if(targetEl) targetEl.classList.add('active');

            if(window.innerWidth <= 768) {
                const sb = document.getElementById('sidebar');
                if(sb) sb.classList.remove('open');
            }
            if(target === 'schedule') {
                updateDateAndTime();
                renderSchedule();
            }
            if(target === 'tasks') renderTasks();
            if(target === 'calendar') renderCalendar();
            if(target === 'seminars-tab') renderSeminarsGrid();
            updateAdminUI();
        });
    });
    const mobBtn = document.getElementById('mobileMenuBtn');
    if(mobBtn) mobBtn.addEventListener('click', () => document.getElementById('sidebar').classList.add('open'));
    const closeSbBtn = document.getElementById('closeSidebar');
    if(closeSbBtn) closeSbBtn.addEventListener('click', () => document.getElementById('sidebar').classList.remove('open'));
}

// ==================== 8. ТИПИ ТА БЕЙДЖІ ЗАВДАНЬ ====================
function getTaskTypeClass(type) {
    if (type === 'Тест') return 'type-test';
    if (type === 'Семінар') return 'type-seminar';
    if (type === 'Перевірка') return 'type-check';
    return 'type-task';
}

function getTaskTypeBadgeName(type) {
    if (type === 'Тест') return 'badge-type-test';
    if (type === 'Семінар') return 'badge-type-seminar';
    if (type === 'Перевірка') return 'badge-type-check';
    return 'badge-type-task';
}

// ==================== 8.1 ДЕДЛАЙНИ ТА КАРТКИ ЗАВДАНЬ ====================
const UK_MONTHS_SHORT = ['січ', 'лют', 'бер', 'квіт', 'трав', 'черв', 'лип', 'серп', 'вер', 'жовт', 'лист', 'груд'];

function parseDateStr(dateStr) {
    const [y, m, d] = dateStr.split('-').map(Number);
    return new Date(y, m - 1, d);
}

function getDaysUntil(dateStr) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return Math.round((parseDateStr(dateStr) - today) / 86400000);
}

function formatDeadline(dateStr) {
    const diff = getDaysUntil(dateStr);
    if (diff === 0) return 'сьогодні';
    if (diff === 1) return 'завтра';
    if (diff >= 2 && diff <= 6) return `через ${diff} ${diff >= 5 ? 'днів' : 'дні'}`;
    const d = parseDateStr(dateStr);
    return `${d.getDate()} ${UK_MONTHS_SHORT[d.getMonth()]}`;
}

function getDeadlineBadge(t) {
    if (t.completed) return { cls: 'btn-join', text: 'Виконано' };
    const diff = getDaysUntil(t.deadline);
    if (diff < 0) return { cls: 'badge-danger', text: 'Прострочено' };
    if (diff <= 2) return { cls: 'badge-soon', text: formatDeadline(t.deadline) };
    return { cls: 'badge-neutral', text: formatDeadline(t.deadline) };
}

function buildTaskCard(t) {
    const isOverdue = !t.completed && getDaysUntil(t.deadline) < 0;
    const typeClass = getTaskTypeClass(t.type || 'Завдання');
    const typeBadgeClass = getTaskTypeBadgeName(t.type || 'Завдання');
    const dl = getDeadlineBadge(t);
    const fileCount = t.materials ? t.materials.length : 0;

    return `
        <div id="task-card-${t.id}" class="task-card ${t.completed ? 'completed' : ''} ${isOverdue ? 'overdue' : ''} ${typeClass}" onclick="openTaskDetailsModal(${t.id})">
            <div class="task-card-top">
                <div class="task-header">
                    <span class="task-subject" title="${t.subject}">
                        <span class="task-subject-name">${t.subject}</span>
                        <span class="type-badge ${typeBadgeClass}">${t.type || 'Завдання'}</span>
                    </span>
                    <span class="badge ${dl.cls}">${dl.text}</span>
                </div>
                <h4 class="task-card-title" title="${t.title}">${t.title}</h4>
                <div class="task-desc-preview">${t.desc || 'Без опису'}</div>
            </div>
            <div class="task-card-bottom">
                <div class="task-meta-row">
                    <span class="task-files-pill">${fileCount > 0 ? `<i class="fas fa-paperclip"></i> Файлів: ${fileCount}` : ''}</span>
                    <button class="btn-details" onclick="event.stopPropagation(); openTaskDetailsModal(${t.id})">Детальніше ↗</button>
                </div>
                <div class="task-card-footer" onclick="event.stopPropagation()">
                    <button class="btn ${t.completed ? 'btn-outline' : 'btn-primary'} btn-sm" onclick="toggleTaskStatus(${t.id})">${t.completed ? 'Відновити' : '✓ Виконати'}</button>
                    ${isAdmin() ? `
                    <div class="flex-end gap-10">
                        <button class="icon-btn" onclick="event.stopPropagation(); openEditTaskModal(${t.id})" title="Редагувати"><i class="fas fa-pen"></i></button>
                        <button class="icon-btn delete" onclick="event.stopPropagation(); confirmDelete(() => processDeleteTask(${t.id}))" title="Видалити"><i class="fas fa-trash"></i></button>
                    </div>` : ''}
                </div>
            </div>
        </div>`;
}

// ==================== 9. РОЗКЛАД ТА ІНДИКАТОРИ ====================
function getDynamicClassData(c) {
    let d = { ...c };
    if (d.teacher === 'dynamic') {
        d.teacher = state.settings.langGroup === '1' ? 'Ступенко М.' : 'Юзефович К.';
        d.room = state.settings.langGroup === '1' ? '408' : '418';
        d.link = state.settings.langGroup === '1' ? 'https://us04web.zoom.us/j/7282426220' : 'https://us02web.zoom.us/j/8144225837';
    } return d;
}

function getTaskAlertIndicator(subjectName) {
    const cleanSubj = subjectName.split('(')[0].trim();
    const hasPending = state.tasks.some(t => t.subject === cleanSubj && !t.completed);
    return hasPending ? `<i class="fas fa-fire task-alert-icon" title="Є невиконані завдання!"></i>` : '';
}

function renderSchedule() {
    const container = document.getElementById('scheduleContainer');
    if(!container) return;
    container.innerHTML = '';
    const days = ['Понеділок', 'Вівторок', 'Середа', 'Четвер', 'П\'ятниця'];

    const now = new Date();
    let currentDayIndex = now.getDay() - 1;

    if (currentDayIndex < 0 || currentDayIndex > 4) {
        currentDayIndex = 0;
    }

    const nextInfo = getNextClassInfo();

    days.forEach((day, index) => {
        const classes = scheduleDB[state.weekType].filter(c => c.day === day);
        if (classes.length === 0) return;

        const dayCard = document.createElement('div');
        dayCard.className = `day-card ${index === currentDayIndex ? 'current-day' : ''}`;
        dayCard.id = `day-card-${index}`;

        let html = `<h3 class="day-title">${day} ${index === currentDayIndex ? '<span style="font-size: 11px; float: right; padding: 2px 8px; background: rgba(67, 97, 238, 0.15); border-radius: 6px;">СЬОГОДНІ</span>' : ''}</h3><div>`;
        classes.forEach(c => {
            if (c.type === 'window') {
                html += `<div class="class-item window-slot">${c.time} — ВІКНО</div>`;
                return;
            }
            const dyn = getDynamicClassData(c);
            const badge = dyn.type.toLowerCase().includes('семінар') ? 'badge-seminar' : '';
            const taskAlert = getTaskAlertIndicator(dyn.subject);

            let liveIndicator = '';
            if (nextInfo.status === 'ongoing' && nextInfo.class.subject === c.subject && nextInfo.class.time === c.time) {
                liveIndicator = `<span style="color: #06d6a0; font-size: 10px; font-weight: 700; background: rgba(6, 214, 160, 0.15); padding: 3px 8px; border-radius: 12px; margin-left: 10px; display: inline-flex; align-items: center; gap: 5px; border: 1px solid rgba(6, 214, 160, 0.3);"><span style="display:inline-block; width:6px; height:6px; background:#06d6a0; border-radius:50%; animation: pulse 2s infinite;"></span>ТРИВАЄ ЗАРАЗ</span>`;
            }

            html += `
                <div class="class-item">
                    <div class="class-time">${dyn.time}</div>
                    <div class="class-info">
                        <div class="class-subject">${dyn.subject} ${taskAlert} ${liveIndicator}</div>
                        <div class="class-details">
                            <span class="badge-type ${badge}">${dyn.type.toUpperCase()}</span>
                            <span><i class="fas fa-user-tie"></i> ${dyn.teacher}</span>
                            <span><i class="fas fa-door-open"></i> ауд. ${dyn.room}</span>
                        </div>
                    </div>
                    ${dyn.link ? `<div class="class-actions"><a href="${dyn.link}" target="_blank" class="btn btn-join"><i class="fas fa-video"></i> Приєднатися</a></div>` : ''}
                </div>`;
        });
        dayCard.innerHTML = html + `</div>`;
        container.appendChild(dayCard);
    });

    if (window.innerWidth <= 768) {
        setTimeout(() => {
            const currentCard = document.getElementById(`day-card-${currentDayIndex}`);
            if (currentCard && container) {
                const scrollLeft = currentCard.offsetLeft - container.offsetLeft - 15;
                container.scrollTo({ left: Math.max(0, scrollLeft), behavior: 'smooth' });
            }
        }, 150);
    }
}

function parseClassTime(timeStr, baseDate = new Date()) {
    const parts = timeStr.split(/[-–]/);
    if(parts.length !== 2) return null;
    const [sh, sm] = parts[0].split(':').map(Number);
    const [eh, em] = parts[1].split(':').map(Number);
    const start = new Date(baseDate); start.setHours(sh, sm, 0, 0);
    const end = new Date(baseDate); end.setHours(eh, em, 0, 0);
    return { start, end };
}

function getNextClassInfo() {
    const now = new Date();
    const daysUk = ['Неділя', 'Понеділок', 'Вівторок', 'Середа', 'Четвер', 'П\'ятниця', 'Субота'];
    for (let offset = 0; offset < 14; offset++) {
        const targetDate = new Date(now); targetDate.setDate(now.getDate() + offset);
        const dayName = daysUk[targetDate.getDay()];
        let targetWeekType = state.weekType; let tempDate = new Date(now); let mondaysPassed = 0;
        for(let i = 1; i <= offset; i++){ tempDate.setDate(tempDate.getDate() + 1); if(tempDate.getDay() === 1) mondaysPassed++; }
        if (mondaysPassed % 2 !== 0) targetWeekType = targetWeekType === 'upper' ? 'lower' : 'upper';
        const classes = scheduleDB[targetWeekType].filter(c => c.day === dayName && c.type !== 'window');
        for (let i = 0; i < classes.length; i++) {
            const c = classes[i]; const times = parseClassTime(c.time, targetDate); if(!times) continue;
            if (offset === 0) {
                if (now >= times.start && now <= times.end) return { status: 'ongoing', class: c, end: times.end };
                if (now < times.start) return { status: 'next', class: c, start: times.start, isToday: true };
            } else return { status: 'next_day', class: c, start: times.start, dayName: dayName, isToday: false };
        }
    } return { status: 'none' };
}

function getTimeRemainingStr(targetDate) {
    const diffMs = targetDate - new Date(); if (diffMs <= 0) return '';
    const diffMins = Math.floor(diffMs / 60000);
    const hours = Math.floor(diffMins / 60); const mins = diffMins % 60;
    return hours > 0 ? `через ${hours} год ${mins} хв` : `через ${mins} хв`;
}

function updateDateAndTime() {
    const now = new Date();
    const dateEl = document.getElementById('currentDate');
    if (dateEl) dateEl.textContent = now.toLocaleDateString('uk-UA', { weekday: 'long', month: 'long', day: 'numeric' });

    const weekBadge = document.getElementById('currentWeekTypeBadge');
    if (weekBadge) weekBadge.textContent = state.weekType === 'upper' ? 'ВЕРХНІЙ ТИЖДЕНЬ' : 'НИЖНІЙ ТИЖДЕНЬ';

    const nextInfo = getNextClassInfo();
    const daysUk = ['Неділя', 'Понеділок', 'Вівторок', 'Середа', 'Четвер', 'П\'ятниця', 'Субота'];
    const todayClasses = scheduleDB[state.weekType].filter(c => c.day === daysUk[now.getDay()] && c.type !== 'window');
    const nextWidget = document.getElementById('nextClassWidget');

    if (nextWidget) {
        if (nextInfo.status === 'ongoing') {
            const dyn = getDynamicClassData(nextInfo.class);
            const badge = dyn.type.toLowerCase().includes('семінар') ? 'badge-seminar' : '';
            nextWidget.innerHTML = `<div style="margin-bottom: 12px; color: #06d6a0; font-weight: 700; font-size: 13px; display: flex; align-items: center; gap: 6px; border-bottom: 1px dashed var(--border-color); padding-bottom: 8px;"><span style="display:inline-block; width:8px; height:8px; background:#06d6a0; border-radius:50%; animation: pulse 2s infinite;"></span> ТРИВАЄ ЗАРАЗ (до ${nextInfo.end.toLocaleTimeString('uk-UA', {hour:'2-digit', minute:'2-digit'})})</div><div class="class-item p-0" style="border: none;"><div class="class-time">${dyn.time}</div><div class="class-info"><div class="class-subject">${dyn.subject}</div><div class="class-details" style="margin-top: 8px;"><span class="badge-type ${badge}">${dyn.type.toUpperCase()}</span><span><i class="fas fa-user-tie"></i> ${dyn.teacher}</span><span><i class="fas fa-door-open"></i> ауд. ${dyn.room}</span></div></div>${dyn.link ? `<div class="class-actions"><a href="${dyn.link}" target="_blank" class="btn btn-join btn-sm"><i class="fas fa-video"></i></a></div>` : ''}</div>`;
        } else if (nextInfo.status === 'next' || nextInfo.status === 'next_day') {
            const dyn = getDynamicClassData(nextInfo.class);
            const badge = dyn.type.toLowerCase().includes('семінар') ? 'badge-seminar' : '';
            const timeStr = nextInfo.isToday ? getTimeRemainingStr(nextInfo.start) : `у ${nextInfo.dayName.toLowerCase()}`;
            const preText = nextInfo.isToday ? 'НАСТУПНА ПАРА' : (todayClasses.length === 0 ? 'СЬОГОДНІ ПАР НЕМАЄ' : 'ПАРИ ЗАКІНЧИЛИСЬ');
            nextWidget.innerHTML = `<div style="margin-bottom: 12px; color: var(--primary-color); font-weight: 700; font-size: 13px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px dashed var(--border-color); padding-bottom: 8px;"><span>${preText}</span>${timeStr ? `<span style="font-weight: 600; font-size: 12px; color: var(--text-muted); background: var(--bg-color); padding: 3px 8px; border-radius: 6px;"><i class="fas fa-clock"></i> ${timeStr}</span>` : ''}</div><div class="class-item p-0" style="border: none;"><div class="class-time">${dyn.time}</div><div class="class-info"><div class="class-subject">${dyn.subject}</div><div class="class-details" style="margin-top: 8px;"><span class="badge-type ${badge}">${dyn.type.toUpperCase()}</span><span><i class="fas fa-user-tie"></i> ${dyn.teacher}</span><span><i class="fas fa-door-open"></i> ауд. ${dyn.room}</span></div></div></div>`;
        } else {
            nextWidget.innerHTML = '<p class="text-muted">Пар більше не знайдено в розкладі.</p>';
        }
    }
}

// ==================== 10. КАЛЕНДАР ====================
function isMobileView() {
    return window.innerWidth <= 768;
}

function renderCalendar() {
    const grid = document.getElementById('calendarGrid');
    if(!grid) return;
    grid.innerHTML = '';
    const year = state.calendarDate.getFullYear(); const month = state.calendarDate.getMonth();
    const monthNames = ['Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень', 'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'];
    const calMY = document.getElementById('calendarMonthYear');
    if(calMY) calMY.textContent = `${monthNames[month]} ${year}`;

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    let startDay = firstDay === 0 ? 6 : firstDay - 1;

    for (let i = 0; i < startDay; i++) grid.innerHTML += `<div class="cal-day empty"></div>`;
    const today = new Date(); today.setHours(0,0,0,0);
    const mobile = isMobileView();

    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const isToday = today.getTime() === new Date(year, month, day).getTime();
        const dayTasks = state.tasks.filter(t => t.deadline === dateStr);

        let tasksHtml = '';
        if (mobile) {
            if (dayTasks.length > 0) {
                const hasOpen = dayTasks.some(t => !t.completed);
                const hasOverdue = dayTasks.some(t => !t.completed && getDaysUntil(t.deadline) < 0);
                const dotCls = hasOverdue ? 'over' : (hasOpen ? '' : 'done');
                tasksHtml = `<div class="cal-dots"><span class="cal-dot ${dotCls}"></span>${dayTasks.length > 1 ? `<span class="cal-count">${dayTasks.length}</span>` : ''}</div>`;
            }
        } else {
            dayTasks.forEach(t => {
                const typeClass = getTaskTypeClass(t.type || 'Завдання');
                const doneClass = t.completed ? 'done' : '';
                const overdueClass = !t.completed && getDaysUntil(t.deadline) < 0 ? 'over' : '';
                const mark = t.completed ? '✓ ' : '';
                tasksHtml += `<div class="cal-task-label ${typeClass} ${doneClass} ${overdueClass}" title="${t.title}">${mark}${t.title}</div>`;
            });
        }

        const dayCell = document.createElement('div');
        dayCell.className = `cal-day ${isToday ? 'today' : ''}`;
        dayCell.innerHTML = `<div class="cal-date">${day}</div>${tasksHtml}`;
        dayCell.onclick = () => openDayDetailsView(dateStr);
        grid.appendChild(dayCell);
    }
}

const btnPrevMonth = document.getElementById('btnPrevMonth');
if(btnPrevMonth) btnPrevMonth.onclick = () => { state.calendarDate.setMonth(state.calendarDate.getMonth() - 1); renderCalendar(); };
const btnNextMonth = document.getElementById('btnNextMonth');
if(btnNextMonth) btnNextMonth.onclick = () => { state.calendarDate.setMonth(state.calendarDate.getMonth() + 1); renderCalendar(); };

let lastIsMobile = isMobileView();
window.addEventListener('resize', () => {
    const nowMobile = isMobileView();
    if (nowMobile !== lastIsMobile) {
        lastIsMobile = nowMobile;
        renderCalendar();
    }
});

function openDayDetailsView(dateStr) {
    document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
    const daySection = document.getElementById('day-details');
    if(daySection) daySection.classList.add('active');

    const dayTitle = document.getElementById('dayDetailTitle');
    if(dayTitle) dayTitle.textContent = parseDateStr(dateStr).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' });

    const container = document.getElementById('dayTasksGrid');
    if (!container) return;
    const dayTasks = state.tasks.filter(t => t.deadline === dateStr);

    container.innerHTML = dayTasks.length
        ? dayTasks.map(buildTaskCard).join('')
        : '<p class="text-muted" style="grid-column: 1/-1;">На цей день завдань немає.</p>';
}

const btnBackToCalendar = document.getElementById('btnBackToCalendar');
if(btnBackToCalendar) {
    btnBackToCalendar.onclick = () => {
        document.getElementById('day-details').classList.remove('active');
        document.getElementById('calendar').classList.add('active');
        renderCalendar();
    };
}

function jumpToTask(taskId) {
    document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
    const navTasks = document.querySelector('[data-target="tasks"]');
    if(navTasks) navTasks.classList.add('active');
    const tasksSec = document.getElementById('tasks');
    if(tasksSec) tasksSec.classList.add('active');

    state.taskFilter = 'all'; state.taskSearch = '';
    const searchInput = document.getElementById('taskSearchInput');
    if(searchInput) searchInput.value = '';
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    const filterAll = document.querySelector('.filter-btn[data-filter="all"]');
    if(filterAll) filterAll.classList.add('active');
    renderTasks();

    setTimeout(() => {
        const card = document.getElementById(`task-card-${taskId}`);
        if (card) {
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
            card.classList.add('highlight');
            setTimeout(() => card.classList.remove('highlight'), 3000);
        }
    }, 100);
}

// ==================== 11. ПРЕДМЕТИ ТА СЕМІНАРИ ====================
function renderSubjectsGrid() {
    const grid = document.getElementById('subjectsGrid');
    if(!grid) return;
    grid.innerHTML = '';
    allSubjectsList.forEach(sub => {
        const data = state.subjectData[sub];
        const card = document.createElement('div'); card.className = 'card subject-card';
        card.innerHTML = `<h3>${sub}</h3><div class="subject-meta"><span>📝 Конспекти: ${data.notes.length}</span><span>📚 Література: ${data.literature.length}</span></div>`;
        card.onclick = () => openDetailsView('subject', sub); grid.appendChild(card);
    });
    const taskSubSelect = document.getElementById('taskSubject');
    if(taskSubSelect) taskSubSelect.innerHTML = allSubjectsList.map(s => `<option value="${s}">${s}</option>`).join('');
}

function renderSeminarsGrid() {
    const grid = document.getElementById('seminarsGrid');
    if(!grid) return;
    grid.innerHTML = '';
    allSubjectsList.forEach(sub => {
        const card = document.createElement('div'); card.className = 'card subject-card';
        const tasksCount = state.tasks.filter(t => t.subject === sub && t.type === 'Семінар').length;
        card.innerHTML = `<h3>${sub}</h3><div class="subject-meta"><span>📝 Завдань: ${tasksCount}</span><span>📁 Матеріалів: ${state.subjectData[sub].seminars.length}</span></div>`;
        card.onclick = () => openDetailsView('seminar', sub); grid.appendChild(card);
    });
}

function openDetailsView(type, subjectName) {
    state.currentViewParams = { type, name: subjectName };
    document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
    if (type === 'subject') {
        document.getElementById('subject-details').classList.add('active');
        document.getElementById('subjectDetailTitle').textContent = subjectName;
        document.getElementById('additionalInfoText').value = state.subjectData[subjectName].additional_info.text;
        renderFileList('subjectNotesList', state.subjectData[subjectName].notes, {type: 'notes'});
        renderFileList('subjectLiteratureList', state.subjectData[subjectName].literature, {type: 'literature'});
        renderFileList('subjectAdditionalFilesList', state.subjectData[subjectName].additional_info.files, {type: 'additional'});
    } else {
        document.getElementById('seminar-details').classList.add('active');
        document.getElementById('seminarDetailTitle').textContent = subjectName;
        renderSeminarTasks(subjectName);
        renderFileList('seminarFilesList', state.subjectData[subjectName].seminars, {type: 'seminars'});
    }
    updateAdminUI();
}

const btnBackToSubjects = document.getElementById('btnBackToSubjects');
if(btnBackToSubjects) btnBackToSubjects.onclick = () => { document.getElementById('subject-details').classList.remove('active'); document.getElementById('subjects').classList.add('active'); renderSubjectsGrid(); };
const btnBackToSeminars = document.getElementById('btnBackToSeminars');
if(btnBackToSeminars) btnBackToSeminars.onclick = () => { document.getElementById('seminar-details').classList.remove('active'); document.getElementById('seminars-tab').classList.add('active'); renderSeminarsGrid(); };

function saveAdditionalInfo() {
    if (!isAdmin()) { alert("Лише адміністратор може редагувати матеріали."); return; }
    if(!state.currentViewParams) return;
    state.subjectData[state.currentViewParams.name].additional_info.text = document.getElementById('additionalInfoText').value;
    saveData(); alert("Текст збережено!");
}

function renderSeminarTasks(subjectName) {
    const container = document.getElementById('seminarTasksList');
    if(!container) return;
    const seminarTasks = state.tasks.filter(t => t.subject === subjectName && t.type === 'Семінар');
    const sc = document.getElementById('seminarTasksContainer');

    if (seminarTasks.length === 0) {
        if(sc) sc.style.display = 'none';
        return;
    }
    if(sc) sc.style.display = 'block';
    container.innerHTML = seminarTasks.map(buildTaskCard).join('');
}

// ==================== 12. РОБОТА З ФАЙЛАМИ ТА ДОКУМЕНТАМИ ====================

// ⚠️ ОНОВЛЕНА ФУНКЦІЯ: ІКОНКИ ДЛЯ GOOGLE ДИСКА
function getFileIcon(filename, type) {
    if (type === 'gdrive' || (filename && filename.includes('drive.google.com'))) {
        return '<i class="fab fa-google-drive" style="color: #0F9D58;"></i>';
    }
    if (type === 'link') return '<i class="fas fa-link" style="color: #4285F4;"></i>';
    if (filename && filename.endsWith('.pdf')) return '<i class="fas fa-file-pdf" style="color: #e23636;"></i>';
    if (filename && filename.match(/\.(jpg|jpeg|png)$/i)) return '<i class="fas fa-file-image" style="color: #00a8ff;"></i>';
    return '<i class="fas fa-file-alt"></i>';
}

function renderFileList(containerId, filesArray, sourceObj) {
    const container = document.getElementById(containerId);
    if(!container) return;
    if(!filesArray || filesArray.length === 0) { container.innerHTML = '<p class="text-muted">Поки порожньо</p>'; return; }
    const adminMode = isAdmin();

    container.innerHTML = filesArray.map(f => `
        <div class="file-row">
            <div class="file-name-col" onclick="viewFile('${f.id}', '${f.type}', '${f.name}', '${f.url || ''}')" title="Відкрити">
                ${getFileIcon(f.name, f.type)} <span class="file-name-text">${f.name}</span>
            </div>
            <div class="file-actions">
                <button class="icon-btn" onclick="viewFile('${f.id}', '${f.type}', '${f.name}', '${f.url || ''}')" title="Відкрити"><i class="fas fa-eye"></i></button>
                ${adminMode ? `
                <button class="icon-btn" onclick="renameFile('${f.id}', '${sourceObj.type}', '${sourceObj.taskId || ''}')" title="Перейменувати"><i class="fas fa-pen"></i></button>
                <button class="icon-btn delete" onclick="confirmDelete(() => processDeleteFile('${f.id}', '${sourceObj.type}', '${sourceObj.taskId || ''}'))" title="Видалити"><i class="fas fa-trash"></i></button>
                ` : ''}
            </div>
        </div>
    `).join('');
}

const globalInput = document.getElementById('globalFileInput');
function triggerFileUpload(type, taskId = null) {
    if (!isAdmin()) { alert("Лише адміністратор може додавати матеріали."); return; }
    state.uploadTarget = { type, id: taskId };
    if(globalInput) globalInput.click();
}

function triggerSubjectLink() {
    if (!isAdmin()) { alert("Лише адміністратор може додавати посилання."); return; }
    const url = prompt("Вставте посилання:"); if(!url) return;
    const name = prompt("Назва посилання:", "Корисний ресурс");
    state.subjectData[state.currentViewParams.name].literature.push({ id: 'lnk_'+Date.now(), name: name||"Посилання", type: 'link', url: url });
    saveData(); openDetailsView('subject', state.currentViewParams.name);
}

// ⚠️ ОНОВЛЕНА ФУНКЦІЯ: ДОДАВАННЯ ПОСИЛАННЯ З GOOGLE ДИСКА ДО ПРЕДМЕТУ
function triggerGoogleDriveLink(type) {
    if (!isAdmin()) { alert("Лише адміністратор може додавати матеріали."); return; }
    if (!state.currentViewParams) return;

    const url = prompt("Вставте посилання з Google Диска:");
    if (!url || !url.trim()) return;
    let cleanUrl = url.trim();
    if (!/^https?:\/\//i.test(cleanUrl)) { alert("Посилання має починатися з https://"); return; }
    
    if (cleanUrl.includes('drive.google.com/file/d/')) {
        cleanUrl = cleanUrl.replace(/\/view(\?.*)?$/, '/preview');
    }

    const name = prompt("Назва файлу:", "Файл з Google Диска") || "Файл з Google Диска";
    const item = { id: 'gdrive_' + Date.now(), name: name, type: 'gdrive', url: cleanUrl };

    const sub = state.currentViewParams.name;
    if (type === 'notes') state.subjectData[sub].notes.push(item);
    else if (type === 'literature') state.subjectData[sub].literature.push(item);
    else if (type === 'additional') state.subjectData[sub].additional_info.files.push(item);
    else if (type === 'seminars') state.subjectData[sub].seminars.push(item);

    saveData();
    openDetailsView(state.currentViewParams.type, sub);
}

// ⚠️ ОНОВЛЕНА ФУНКЦІЯ: ДОДАВАННЯ ПОСИЛАННЯ З GOOGLE ДИСКА ДО ЗАВДАННЯ
function addTaskDriveLink(taskId) {
    if (!isAdmin()) { alert("Лише адміністратор може додавати матеріали."); return; }
    const t = state.tasks.find(x => x.id === taskId);
    if (!t) return;

    const url = prompt("Вставте посилання з Google Диска:");
    if (!url || !url.trim()) return;
    let cleanUrl = url.trim();
    if (!/^https?:\/\//i.test(cleanUrl)) { alert("Посилання має починатися з https://"); return; }
    
    if (cleanUrl.includes('drive.google.com/file/d/')) {
        cleanUrl = cleanUrl.replace(/\/view(\?.*)?$/, '/preview');
    }

    const name = prompt("Назва файлу:", "Файл з Google Диска") || "Файл з Google Диска";
    if (!t.materials) t.materials = [];
    t.materials.push({ id: 'gdrive_' + Date.now(), name: name, type: 'gdrive', url: cleanUrl });

    saveData();
    renderTasks();
    openTaskDetailsModal(t.id);
}

if (globalInput) {
    globalInput.addEventListener('change', function(e) {
        if (!isAdmin()) return;
        const file = e.target.files[0]; if(!file) return;
        const reader = new FileReader();
        reader.onload = async function(ev) {
            const fileId = 'file_' + Date.now();
            const metaObj = { id: fileId, name: file.name, type: file.type || 'unknown' };
            await saveFileToDB({ id: fileId, data: ev.target.result });
            if (state.uploadTarget.type === 'task') {
                const t = state.tasks.find(x => x.id === state.uploadTarget.id);
                if(t) {
                    if(!t.materials) t.materials = [];
                    t.materials.push(metaObj);
                    renderTasks();
                    if (state.currentDetailTaskId === t.id) openTaskDetailsModal(t.id);
                    if (state.currentViewParams && state.currentViewParams.type === 'seminar') renderSeminarTasks(state.currentViewParams.name);
                }
            } else {
                const sub = state.currentViewParams.name;
                if(state.uploadTarget.type === 'notes') state.subjectData[sub].notes.push(metaObj);
                else if (state.uploadTarget.type === 'literature') state.subjectData[sub].literature.push(metaObj);
                else if (state.uploadTarget.type === 'additional') state.subjectData[sub].additional_info.files.push(metaObj);
                else if (state.uploadTarget.type === 'seminars') state.subjectData[sub].seminars.push(metaObj);
                openDetailsView(state.currentViewParams.type, sub);
            } saveData();
        }; reader.readAsDataURL(file); this.value = '';
    });
}

// ⚠️ ОНОВЛЕНА ФУНКЦІЯ: БЕЗПЕЧНЕ ВИДАЛЕННЯ ФАЙЛІВ
async function processDeleteFile(id, sourceType, taskId) {
    if (!isAdmin()) return;
    if(sourceType === 'task') {
        const t = state.tasks.find(x => x.id == taskId);
        if (t && t.materials) t.materials = t.materials.filter(f => f.id !== id);
    } else {
        const sub = state.currentViewParams.name;
        if(sourceType === 'notes') state.subjectData[sub].notes = state.subjectData[sub].notes.filter(f => f.id !== id);
        if(sourceType === 'literature') state.subjectData[sub].literature = state.subjectData[sub].literature.filter(f => f.id !== id);
        if(sourceType === 'additional') state.subjectData[sub].additional_info.files = state.subjectData[sub].additional_info.files.filter(f => f.id !== id);
        if(sourceType === 'seminars') state.subjectData[sub].seminars = state.subjectData[sub].seminars.filter(f => f.id !== id);
    }
    
    // ВАЖЛИВО: не видаляємо з локальної бази посилання та файли Google Drive
    if(!id.startsWith('lnk_') && !id.startsWith('gdrive_')) {
        await deleteFileFromDB(id);
    }
    
    saveData();
    if (sourceType === 'task') {
        renderTasks();
        if (state.currentDetailTaskId == taskId) openTaskDetailsModal(Number(taskId));
        if (state.currentViewParams && state.currentViewParams.type === 'seminar') renderSeminarTasks(state.currentViewParams.name);
    } else {
        openDetailsView(state.currentViewParams.type, state.currentViewParams.name);
    }
}

function renameFile(id, sourceType, taskId) {
    if (!isAdmin()) return;
    const newName = prompt("Введіть нову назву:"); if(!newName) return;
    let arr = [];
    if(sourceType === 'task') arr = state.tasks.find(x => x.id == taskId).materials;
    else {
        const sub = state.currentViewParams.name;
        if(sourceType === 'notes') arr = state.subjectData[sub].notes;
        if(sourceType === 'literature') arr = state.subjectData[sub].literature;
        if(sourceType === 'additional') arr = state.subjectData[sub].additional_info.files;
        if(sourceType === 'seminars') arr = state.subjectData[sub].seminars;
    }
    const file = arr.find(f => f.id === id);
    if(file) {
        file.name = newName;
        saveData();
        if (sourceType === 'task') {
            renderTasks();
            if (state.currentDetailTaskId == taskId) openTaskDetailsModal(Number(taskId));
        } else {
            openDetailsView(state.currentViewParams.type, state.currentViewParams.name);
        }
    }
}

// ⚠️ ОНОВЛЕНА ФУНКЦІЯ: ВБУДОВАНИЙ ПЕРЕГЛЯД GOOGLE ДИСКА
async function viewFile(id, type, name, url) {
    if (type === 'gdrive' || (url && url.includes('drive.google.com'))) {
        document.getElementById('viewerTitle').textContent = name;
        const body = document.getElementById('viewerBody');
        document.getElementById('btnDownloadViewer').onclick = () => window.open(url, '_blank');
        body.innerHTML = `<iframe src="${url}" style="width:100%; height:75vh; border:none; border-radius: 8px;" allow="autoplay"></iframe>`;
        document.getElementById('viewerModal').style.display = 'flex';
        return;
    }
    
    if(type === 'link') { window.open(url, '_blank'); return; }
    const dbFile = await getFileFromDB(id);
    if(!dbFile) { alert("Файл не знайдено"); return; }

    document.getElementById('viewerTitle').textContent = name;
    const body = document.getElementById('viewerBody');
    document.getElementById('btnDownloadViewer').onclick = () => downloadFileTrigger(id, name, type, url, dbFile.data);

    if (type === 'application/pdf') {
        body.innerHTML = `<iframe src="${dbFile.data}#toolbar=0" style="width:100%; height:75vh; border:none;"></iframe>`;
    } else if (type.startsWith('image/')) {
        body.innerHTML = `<img src="${dbFile.data}" style="max-width:100%; max-height:75vh; display:block; margin:auto; border-radius: 8px;">`;
    } else if (type.startsWith('text/') || name.endsWith('.txt')) {
        const text = atob(dbFile.data.split(',')[1]);
        body.innerHTML = `<pre style="white-space: pre-wrap; font-family: inherit;">${decodeURIComponent(escape(text))}</pre>`;
    } else {
        body.innerHTML = `<div style="padding: 40px; text-align: center;"><i class="fas fa-file-alt" style="font-size: 60px; color: var(--primary-color); margin-bottom: 20px;"></i><h4>Цей формат неможливо переглянути в браузері.</h4><p class="text-muted mt-2">Будь ласка, завантажте файл на комп'ютер.</p></div>`;
    }
    document.getElementById('viewerModal').style.display = 'flex';
}

const closeViewerBtn = document.getElementById('closeViewerBtn');
if(closeViewerBtn) {
    closeViewerBtn.onclick = () => { document.getElementById('viewerModal').style.display = 'none'; document.getElementById('viewerBody').innerHTML = ''; };
}

async function downloadFileTrigger(id, name, type, url, preloadedData = null) {
    if(type === 'link') { window.open(url, '_blank'); return; }
    let fileData = preloadedData || (await getFileFromDB(id))?.data;
    if(fileData) { const a = document.createElement('a'); a.href = fileData; a.download = name; a.click(); }
}

// ==================== 13. СИСТЕМА ЗАВДАНЬ ====================
function renderTasks() {
    const container = document.getElementById('tasksGrid');
    if(!container) return;
    let filtered = state.tasks;
    if (state.taskSearch) {
        const s = state.taskSearch.toLowerCase();
        filtered = filtered.filter(t => t.title.toLowerCase().includes(s) || (t.desc && t.desc.toLowerCase().includes(s)) || t.subject.toLowerCase().includes(s));
    }

    if (state.taskFilter === 'pending') filtered = filtered.filter(t => !t.completed);
    if (state.taskFilter === 'completed') filtered = filtered.filter(t => t.completed);
    if (state.taskFilter === 'overdue') filtered = filtered.filter(t => !t.completed && getDaysUntil(t.deadline) < 0);

    if (state.taskSort === 'deadline') filtered.sort((a, b) => parseDateStr(a.deadline) - parseDateStr(b.deadline));
    else if (state.taskSort === 'subject') filtered.sort((a, b) => a.subject.localeCompare(b.subject));
    else if (state.taskSort === 'date') filtered.sort((a, b) => b.id - a.id);

    if (filtered.length === 0) {
        container.innerHTML = `<div class="card" style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);">Завдань у цій категорії немає</div>`;
    } else {
        container.innerHTML = filtered.map(buildTaskCard).join('');
    }

    const count = state.tasks.filter(t => !t.completed).length;
    const taskBadge = document.getElementById('taskBadge');
    if(taskBadge) taskBadge.textContent = count;
    const uncompletedCount = document.getElementById('uncompletedCount');
    if(uncompletedCount) uncompletedCount.textContent = count;

    renderSchedule(); updateDateAndTime(); renderCalendar();
}

function openTaskDetailsModal(id) {
    const t = state.tasks.find(x => x.id === id);
    if (!t) return;
    state.currentDetailTaskId = id;

    const isOverdue = !t.completed && getDaysUntil(t.deadline) < 0;
    const typeBadgeClass = getTaskTypeBadgeName(t.type || 'Завдання');
    const statusBadgeClass = t.completed ? 'btn-join' : (isOverdue ? 'badge-danger' : '');
    const statusText = t.completed ? 'Виконано' : (isOverdue ? 'Прострочено' : 'Активне');

    document.getElementById('detailTaskBadges').innerHTML = `
        <span class="task-subject" style="max-width: unset;">${t.subject}</span>
        <span class="type-badge ${typeBadgeClass}" style="margin-left: 0;">${t.type || 'Завдання'}</span>
        <span class="badge ${statusBadgeClass}" style="margin-left: 0;">${statusText}</span>
    `;

    document.getElementById('detailTaskTitle').textContent = t.title;
    const fullDate = parseDateStr(t.deadline).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' });
    document.getElementById('detailTaskDeadline').innerHTML = `<i class="far fa-calendar-alt"></i> Дедлайн: <strong>${fullDate}</strong>`;
    document.getElementById('detailTaskDesc').textContent = t.desc || 'Опис до цього завдання відсутній.';

    if (!t.materials) t.materials = [];
    renderFileList('detailTaskFilesList', t.materials, { type: 'task', taskId: t.id });

    const btnAddFile = document.getElementById('btnAddTaskFile') || document.getElementById('btnAddDetailTaskFile');
    if (btnAddFile) {
        btnAddFile.onclick = () => triggerFileUpload('task', t.id);
        btnAddFile.style.display = isAdmin() ? 'inline-flex' : 'none';
    }

    const btnAddDrive = document.getElementById('btnAddTaskDriveLink');
    if (btnAddDrive) {
        btnAddDrive.onclick = () => addTaskDriveLink(t.id);
        btnAddDrive.style.display = isAdmin() ? 'inline-flex' : 'none';
    }

    const toggleBtn = document.getElementById('detailBtnToggleStatus');
    toggleBtn.className = `btn ${t.completed ? 'btn-outline' : 'btn-primary'}`;
    toggleBtn.innerHTML = t.completed ? '<i class="fas fa-undo"></i> Відновити завдання' : '<i class="fas fa-check"></i> Виконати завдання';
    toggleBtn.onclick = () => {
        toggleTaskStatus(t.id);
        openTaskDetailsModal(t.id);
    };

    const editBtn = document.getElementById('detailBtnEdit');
    const delBtn = document.getElementById('detailBtnDelete');

    if (editBtn) {
        editBtn.style.display = isAdmin() ? 'inline-block' : 'none';
        editBtn.onclick = () => {
            document.getElementById('taskDetailsModal').style.display = 'none';
            openEditTaskModal(t.id);
        };
    }

    if (delBtn) {
        delBtn.style.display = isAdmin() ? 'inline-block' : 'none';
        delBtn.onclick = () => {
            confirmDelete(() => {
                processDeleteTask(t.id);
                document.getElementById('taskDetailsModal').style.display = 'none';
            });
        };
    }

    document.getElementById('taskDetailsModal').style.display = 'flex';
}

const closeTaskDetailsModal = document.getElementById('closeTaskDetailsModal');
if(closeTaskDetailsModal) {
    closeTaskDetailsModal.onclick = () => {
        document.getElementById('taskDetailsModal').style.display = 'none';
        state.currentDetailTaskId = null;
    };
}

function toggleTaskStatus(id) {
    const idx = state.completedTaskIds.indexOf(id);
    if (idx > -1) {
        state.completedTaskIds.splice(idx, 1);
    } else {
        state.completedTaskIds.push(id);
    }
    syncTasksCompletion();
    saveData();
    renderTasks();
    if (state.currentViewParams && state.currentViewParams.type === 'seminar') renderSeminarTasks(state.currentViewParams.name);
}

function processDeleteTask(id) {
    if (!isAdmin()) { alert("Лише адміністратор може видаляти завдання."); return; }
    const t = state.tasks.find(x => x.id === id);
    if(t && t.materials) t.materials.forEach(f => deleteFileFromDB(f.id));
    state.tasks = state.tasks.filter(x => x.id !== id);
    state.completedTaskIds = state.completedTaskIds.filter(x => x !== id);
    saveData();
    renderTasks();
    renderSeminarsGrid();
    if (state.currentViewParams && state.currentViewParams.type === 'seminar') renderSeminarTasks(state.currentViewParams.name);
}

const btnAddTask = document.getElementById('btnAddTask');
if(btnAddTask) {
    btnAddTask.onclick = () => {
        if (!isAdmin()) { alert("Лише адміністратор може створювати завдання."); return; }
        document.getElementById('taskForm').reset();
        document.getElementById('editTaskId').value = '';
        document.getElementById('taskModalTitle').textContent = 'Нове завдання';
        document.getElementById('taskModal').style.display = 'flex';
    };
}

function openEditTaskModal(id) {
    if (!isAdmin()) return;
    const t = state.tasks.find(x => x.id === id); if(!t) return;
    document.getElementById('editTaskId').value = t.id;
    document.getElementById('taskSubject').value = t.subject;
    document.getElementById('taskType').value = t.type || 'Завдання';
    document.getElementById('taskTitle').value = t.title;
    document.getElementById('taskDesc').value = t.desc;
    document.getElementById('taskDeadline').value = t.deadline;
    document.getElementById('taskStatus').value = t.completed ? 'completed' : 'pending';
    document.getElementById('taskModalTitle').textContent = 'Редагувати завдання';
    document.getElementById('taskModal').style.display = 'flex';
}

const closeTaskModal = document.getElementById('closeTaskModal');
if(closeTaskModal) closeTaskModal.onclick = () => document.getElementById('taskModal').style.display = 'none';

const taskForm = document.getElementById('taskForm');
if(taskForm) {
    taskForm.onsubmit = (e) => {
        e.preventDefault();
        if (!isAdmin()) { alert("У вас немає прав на додавання або редагування завдань."); return; }

        const isEditId = document.getElementById('editTaskId').value;
        const taskData = {
            subject: document.getElementById('taskSubject').value,
            type: document.getElementById('taskType').value,
            title: document.getElementById('taskTitle').value,
            desc: document.getElementById('taskDesc').value,
            deadline: document.getElementById('taskDeadline').value
        };

        if (isEditId) {
            const t = state.tasks.find(x => x.id == isEditId);
            if (t) Object.assign(t, taskData);
        } else {
            const newId = Date.now();
            state.tasks.push({ id: newId, ...taskData, materials: [], completed: false });
        }
        saveData();
        renderTasks();
        renderSeminarsGrid();
        if (state.currentViewParams && state.currentViewParams.type === 'seminar') renderSeminarTasks(state.currentViewParams.name);
        document.getElementById('taskModal').style.display = 'none';
    };
}

const taskSearchInput = document.getElementById('taskSearchInput');
if(taskSearchInput) taskSearchInput.addEventListener('input', (e) => { state.taskSearch = e.target.value; renderTasks(); });
const taskSortSelect = document.getElementById('taskSortSelect');
if(taskSortSelect) taskSortSelect.addEventListener('change', (e) => { state.taskSort = e.target.value; renderTasks(); });
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.onclick = (e) => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        state.taskFilter = e.target.dataset.filter;
        renderTasks();
    };
});

window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
        if (e.target.id === 'taskDetailsModal') state.currentDetailTaskId = null;
        if (e.target.id === 'viewerModal') document.getElementById('viewerBody').innerHTML = '';
    }
});

// ==================== 14. ПІДТВЕРДЖЕННЯ ВИДАЛЕННЯ ====================
let pendingDeleteAction = null;
function confirmDelete(actionFn) {
    if (!isAdmin()) { alert("Лише адміністратор може видаляти матеріали."); return; }
    pendingDeleteAction = actionFn;
    document.getElementById('deleteConfirmModal').style.display = 'flex';
}
const btnCancelDelete = document.getElementById('btnCancelDelete');
if(btnCancelDelete) btnCancelDelete.onclick = () => { pendingDeleteAction = null; document.getElementById('deleteConfirmModal').style.display = 'none'; };
const btnConfirmDelete = document.getElementById('btnConfirmDelete');
if(btnConfirmDelete) btnConfirmDelete.onclick = () => { if(pendingDeleteAction) pendingDeleteAction(); document.getElementById('deleteConfirmModal').style.display = 'none'; pendingDeleteAction = null; };

// ==================== 15. НАЛАШТУВАННЯ ТА ТЕМА ====================
function setupEventListeners() {
    const btnUpper = document.getElementById('btnUpperWeek');
    if(btnUpper) btnUpper.onclick = (e) => switchWeek('upper', e.target);
    const btnLower = document.getElementById('btnLowerWeek');
    if(btnLower) btnLower.onclick = (e) => switchWeek('lower', e.target);
    if(state.weekType === 'lower') {
        if(btnLower) btnLower.classList.add('active');
        if(btnUpper) btnUpper.classList.remove('active');
    }

    const btnSaveSet = document.getElementById('btnSaveSettings');
    if(btnSaveSet) {
        btnSaveSet.onclick = () => {
            state.settings.langGroup = document.getElementById('setLangGroup').value;
            state.settings.darkTheme = document.getElementById('themeToggle').checked;
            if(state.settings.darkTheme) document.documentElement.setAttribute('data-theme', 'dark'); else document.documentElement.removeAttribute('data-theme');
            saveData(); updateDateAndTime(); renderSchedule(); alert('Налаштування збережено!');
        };
    }
}

function switchWeek(type, btn) {
    state.weekType = type;
    document.querySelectorAll('.btn-toggle').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    saveData();
    renderSchedule();
    updateDateAndTime();
}

function initSettings() {
    const setLangGroup = document.getElementById('setLangGroup');
    if (setLangGroup) setLangGroup.value = state.settings.langGroup || '1';
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle && state.settings.darkTheme) {
        themeToggle.checked = true;
        document.documentElement.setAttribute('data-theme', 'dark');
    }
}
