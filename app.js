// 🔮 雲端資料庫連線鎖匙
var firebaseConfig = {
    apiKey: "AIzaSyCsfaqMDLYAxXMW5ivDHAgJEwnFA5MuvqM",
    authDomain: "cp-schedule.firebaseapp.com",
    databaseURL: "https://cp-schedule-default-rtdb.firebaseio.com/",
    projectId: "cp-schedule",
    storageBucket: "cp-schedule.firebasestorage.app",
    messagingSenderId: "136891249500",
    appId: "1:136891249500:web:f3278b3ce642dc8d454799",
    measurementId: "G-W0L45WCMV2"
};

// 1. 預設員工備用名冊
const defaultEmployees = [
    { "name": "阿平", "p_shops": "G2, G38, GK3, F79", "role": "Full-time", "times": "12:00, 13:00" },
    { "name": "RUBY", "p_shops": "G2, G38, GK3", "role": "Part-time", "times": "11:00, 18:00" },
    { "name": "如意", "p_shops": "F79", "role": "Full-time", "times": "12:00" },
    { "name": "影", "p_shops": "F79", "role": "Full-time", "times": "13:00, 14:00" },
    { "name": "慧嫻", "p_shops": "F79", "role": "Full-time", "times": "13:00" },
    { "name": "二妹", "p_shops": "G2, G38, GK3", "role": "Full-time", "times": "12:00, 11:00, 13:00" },
    { "name": "TT", "p_shops": "G38", "role": "Part-time", "times": "10:30, 11:00" },
    { "name": "Cici", "p_shops": "G38", "role": "Full-time", "times": "11:00, 12:00, 10:30" },
    { "name": "珍", "p_shops": "GK3, G2, G38", "role": "Full-time", "times": "11:00, 12:00, 13:00" },
    { "name": "Jackie", "p_shops": "G38", "role": "Part-time", "times": "13:00, 14:00" },
    { "name": "澄澄", "p_shops": "G2, GK3", "role": "Full-time", "times": "11:00" },
    { "name": "ALICE", "p_shops": "G2, G38, GK3", "role": "Full-time", "times": "12:00, 13:00" },
    { "name": "阿璇", "p_shops": "G2, G38, GK3, F79", "role": "Full-time", "times": "13:00, 12:00" },
    { "name": "Mandy婷", "p_shops": "G2, GK3, G38, F79", "role": "Full-time", "times": "12:00, 11:00, 13:00" },
    { "name": "妙妙", "p_shops": "G2, GK3, F79, G38", "role": "Part-time", "times": "13:00, 12:00" },
    { "name": "葉子", "p_shops": "GK3, G38, G2", "role": "Full-time", "times": "12:00, 13:00" },
    { "name": "Lucia", "p_shops": "GK3, G38, G2, F79", "role": "Full-time", "times": "13:00, 12:00" },
    { "name": "AMY", "p_shops": "G2, G38, GK3", "role": "Full-time", "times": "13:00, 12:00" },
    { "name": "小茹", "p_shops": "G2, G38, GK3, F79", "role": "學徒", "times": "13:00" },
    { "name": "文君", "p_shops": "G2, G38, GK3", "role": "學徒", "times": "11:00, 12:00, 13:00" }
];

// 2. 預設對應工號庫 (自動補全用)
const defaultStaffIds = {
    "阿平": "101", "RUBY": "102", "如意": "103", "影": "105", "慧嫻": "106",
    "二妹": "107", "TT": "108", "Cici": "109", "CICI": "109", "珍": "110", "Jackie": "111", "JACKIE": "111",
    "澄澄": "113", "ALICE": "115", "阿璇": "116", "Mandy婷": "117", "MANDY婷": "117", "妙妙": "118",
    "葉子": "119", "Lucia": "120", "LUCIA": "120", "AMY": "121", "小茹": "122", "文君": "123"
};

const defaultHolidaysData = {
    "ALICE": [8, 17, 27, 7], "AMY": [9, 18, 19, 20, 1, 2, 3, 4], 
    "Jackie": [1, 2, 3, 7, 8, 9, 10, 14, 15, 19, 20, 21, 22, 23, 24, 28, 29], 
    "Lucia": [19, 27, 28], "Mandy婷": [5, 12, 19, 20, 21, 28], 
    "RUBY": [1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 16, 17, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30], 
    "TT": [2, 3, 4, 7, 9, 10, 11, 12, 14, 16, 17, 18, 19, 21, 22, 23, 24, 25, 26, 28, 30], 
    "二妹": [2, 3], "如意": [2, 3, 8, 10, 11, 17, 24, 30], "妙妙": [4, 16, 23, 24, 30, 12], 
    "小茹": [3, 4], "影": [13, 14, 15, 16, 10], "慧嫻": [6, 7, 21, 22, 15, 29], 
    "澄澄": [3, 4, 17, 18], "葉子": [29, 30], "阿平": [1, 2, 3, 4, 5, 6, 7], "阿璇": [13, 14, 15, 16], "Cici": [], "珍": [], "文君": []
};

const defaultSystemSettings = {
    passManager: "8888", passEmployee: "1234", webTitle: "分店智能排班系統 V10.0",
    lockDay: 26, maxFtLeave: 5, maxPtLeave: 20, limitLow: 3, limitHigh: 5
};

var database = null; var isCloudMode = false;
let state = { 
    employees: [], currentYear: 2026, currentMonth: 5, currentDay: 1, 
    holidays: {}, overrides: {}, notes: {}, pendingApprovals: {}, 
    currentRole: 'none', localHolidaysDraft: {}, settings: JSON.parse(JSON.stringify(defaultSystemSettings))
};

var empRef, holRef, ovrRef, appRef, noteRef, cfgRef;
let cloudLoads = { emp: false, hol: false, ovr: false, note: false };
let draggedSourceData = null;
let loggedInEmployeeName = ""; // 若非管理員，登入後在此紀錄對應姓名
let pendingConfirmCallback = null; // 人手不足繼續請假的回調

// ==================== 🔐 新版安全登入核心認證 (支援管理員與員工自編帳密) ====================
function triggerGateLogin() {
    const usernameInput = document.getElementById('login-username-input');
    const passwordInput = document.getElementById('login-password-input');
    const failHint = document.getElementById('login-fail-hint');

    if (!usernameInput || !passwordInput) return;

    const uVal = usernameInput.value.trim();
    const pVal = passwordInput.value.trim();

    if (!uVal || !pVal) {
        alert('❌ 請輸入您的帳號與密碼！');
        return;
    }

    // A. 驗證管理員門禁 (主機固定口令 9343 / 密碼 6973)
    if (uVal === "9343" && pVal === "6973") {
        state.currentRole = 'manager'; 
        loggedInEmployeeName = "";
        document.body.classList.add('is-manager');
        document.getElementById('login-overlay').style.display = 'none'; 
        document.getElementById('main-system-tab-bar').style.display = 'flex';
        document.getElementById('role-display-text').innerText = "👑 權限狀態：最高管理層模式（全系統已解鎖）";
        
        // 顯示管理員專屬的所有導航標籤
        document.querySelectorAll('.tab-btn').forEach(btn => {
            if (btn.id !== 'nav-bookings') { // 確保預約對接中心不佔位
                btn.style.setProperty('display', 'inline-block', 'important');
            }
        });
        
        document.getElementById('manager-backup-zone').style.display = 'block';
        document.getElementById('btn-restore-auto-id').style.display = 'inline-block'; 
        if (failHint) failHint.style.display = 'none'; 
        switchTab('tab-schedule');
        showToastMessage("🎉 歡迎回來，親愛的管理員！");
        return;
    }

    // B. 驗證普通員工
    const matchedEmployee = state.employees.find(e => e && String(e.id || "").trim() === uVal);
    if (matchedEmployee) {
        const expectedPass = String(matchedEmployee.password || (matchedEmployee.id + "22")).trim();
        
        if (pVal === expectedPass) {
            state.currentRole = 'employee'; 
            loggedInEmployeeName = matchedEmployee.name;
            document.body.classList.remove('is-manager');
            document.getElementById('login-overlay').style.display = 'none'; 
            document.getElementById('main-system-tab-bar').style.display = 'flex';
            document.getElementById('role-display-text').innerText = `🔑 目前權限：員工 (${matchedEmployee.name})`;
            
            // 員工只能看「每日排班」與「個人當月排班」
            document.querySelectorAll('.tab-btn').forEach(btn => {
                if (btn.id === 'nav-schedule' || btn.id === 'nav-my-month') {
                    btn.style.setProperty('display', 'inline-block', 'important');
                } else {
                    btn.style.setProperty('display', 'none', 'important');
                }
            });
            
            document.getElementById('manager-backup-zone').style.display = 'none';
            document.getElementById('btn-restore-auto-id').style.display = 'none'; 
            if (failHint) failHint.style.display = 'none'; 
            switchTab('tab-schedule');
            showToastMessage(`🎉 登入成功！歡迎您，${matchedEmployee.name} 老師`);
            return;
        }
    }

    if (failHint) failHint.style.display = 'block';
}

function triggerGlobalLogout() {
    state.currentRole = 'none'; 
    loggedInEmployeeName = "";
    document.body.classList.remove('is-manager'); 
    document.getElementById('login-username-input').value = '';
    document.getElementById('login-password-input').value = '';
    document.getElementById('login-overlay').style.display = 'flex'; 
    document.getElementById('main-system-tab-bar').style.display = 'none';
    document.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none'); 
    document.getElementById('role-display-text').innerText = "🔑 目前權限：未登入";
}

// ==================== ⚙️ 系統核心微調參數與同步監聽 ====================
function setupSettingsListener() {
    if(!database || !isCloudMode) return;
    cfgRef = database.ref('v8_settings');
    cfgRef.on('value', (snapshot) => {
        state.settings = snapshot.exists() ? Object.assign({}, defaultSystemSettings, snapshot.val()) : JSON.parse(JSON.stringify(defaultSystemSettings));
        applyDynamicSettingsToUI();
    });
}

function applyDynamicSettingsToUI() {
    document.getElementById('cfg-pass-manager').value = state.settings.passManager || "8888";
    document.getElementById('cfg-pass-employee').value = state.settings.passEmployee || "1234";
    document.getElementById('cfg-web-title').value = state.settings.webTitle || "分店智能排班系統 V10.0";
    document.getElementById('cfg-lock-day').value = state.settings.lockDay || 26;
    document.getElementById('cfg-max-ft-leave').value = state.settings.maxFtLeave || 5;
    document.getElementById('cfg-max-pt-leave').value = state.settings.maxPtLeave || 20;
    document.getElementById('cfg-limit-low').value = state.settings.limitLow || 3;
    document.getElementById('cfg-limit-high').value = state.settings.limitHigh || 5;
    document.title = state.settings.webTitle; 
    document.getElementById('web-title-tag').innerText = state.settings.webTitle;
    document.getElementById('login-box-title').innerText = state.settings.webTitle;
    document.getElementById('page-main-title').innerHTML = `${state.settings.webTitle} <span style="color:var(--warning);">[動態體]</span>`;
    if (cloudLoads.emp && cloudLoads.hol && cloudLoads.ovr && cloudLoads.note) runScheduler();
}

function saveGlobalSystemSettings() {
    if (state.currentRole !== 'manager') return;
    state.settings = {
        passManager: document.getElementById('cfg-pass-manager').value.trim(),
        passEmployee: document.getElementById('cfg-pass-employee').value.trim(),
        webTitle: document.getElementById('cfg-web-title').value.trim(),
        lockDay: parseInt(document.getElementById('cfg-lock-day').value),
        maxFtLeave: parseInt(document.getElementById('cfg-max-ft-leave').value),
        maxPtLeave: parseInt(document.getElementById('cfg-max-pt-leave').value),
        limitLow: parseInt(document.getElementById('cfg-limit-low').value),
        limitHigh: parseInt(document.getElementById('cfg-limit-high').value)
    };
    if (isCloudMode && database) {
        database.ref('v8_settings').set(state.settings).then(() => { showToastMessage('⚙️ 全局配置已成功發佈至雲端！'); });
    } else {
        localStorage.setItem('v8_settings', JSON.stringify(state.settings)); 
        showToastMessage('💾 配置已成功儲存至本地快取中！'); 
        applyDynamicSettingsToUI();
    }
}

// ==================== 👤 「個人每月排班頁」選單初始化與同步 ====================
function initializeMyMonthSelectors() {
    const mainYr = document.getElementById('schedule-year-select');
    const mainMo = document.getElementById('schedule-month-select');
    const myYr = document.getElementById('my-month-year-select');
    const myMo = document.getElementById('my-month-month-select');

    if (mainYr && myYr && myYr.options.length === 0) {
        myYr.innerHTML = mainYr.innerHTML;
        myYr.value = mainYr.value;
    }
    if (mainMo && myMo && myMo.options.length === 0) {
        myMo.innerHTML = mainMo.innerHTML;
        myMo.value = mainMo.value;
    }
}

window.syncMyMonthToMainDate = function() {
    const myYr = document.getElementById('my-month-year-select');
    const myMo = document.getElementById('my-month-month-select');
    const mainYr = document.getElementById('schedule-year-select');
    const mainMo = document.getElementById('schedule-month-select');

    if (myYr && myMo && mainYr && mainMo) {
        mainYr.value = myYr.value;
        mainMo.value = myMo.value;
        handleDateContextChange();
        setTimeout(() => {
            renderIndividualMonthCalendar();
        }, 200);
    }
};

function syncMainToMyMonthDate() {
    const myYr = document.getElementById('my-month-year-select');
    const myMo = document.getElementById('my-month-month-select');
    const mainYr = document.getElementById('schedule-year-select');
    const mainMo = document.getElementById('schedule-month-select');

    if (myYr && myMo && mainYr && mainMo) {
        if (document.activeElement !== myYr && document.activeElement !== myMo) {
            myYr.value = mainYr.value;
            myMo.value = mainMo.value;
        }
    }
}

// ==================== 🏖️ 員工請假防撞與人手告急判定邏輯 ====================
function isManpowerShortageOnDay(dayNum, staffName) {
    // 學徒請假，直接免除人手告急判斷限制
    const empInfo = state.employees.find(e => e && e.name === staffName);
    if (empInfo && empInfo.role === "學徒") return false;

    const monthKey = `${state.currentYear}-${state.currentMonth < 10 ? '0'+state.currentMonth : state.currentMonth}`;
    const holidays = state.holidays || {};
    const employees = state.employees || [];

    let alertThreshold = state.settings.limitLow || 3;

    const manicurists = employees.filter(e => e && e.role !== "學徒");
    const totalMani = manicurists.length;

    let offManiCount = 0;
    Object.keys(holidays).forEach(name => {
        const emp = employees.find(e => e && e.name === name);
        if (emp && emp.role === "學徒") return;

        const daysOff = holidays[name] || [];
        const daysOffNums = daysOff.map(Number);
        if (daysOffNums.includes(Number(dayNum))) {
            offManiCount++;
        }
    });

    const currentWorkingCount = totalMani - offManiCount;
    // 扣除該申請人後，上班美甲師是否會低於或等於告急線
    return (currentWorkingCount - 1) <= alertThreshold;
}

// ==================== 📅 每日排班沙盒渲染 ====================
function generateTimeOptions(selectedValue) {
    let optionsHtml = `<option value="">無班次</option>`; let tClean = selectedValue || '';
    if (tClean.includes('(')) { let matches = tClean.match(/\(([^)]+)\)/); if (matches && matches[1]) tClean = matches[1]; }
    tClean = tClean.trim();
    for (let h = 9; h <= 19; h++) {
        ['00', '30'].forEach(m => {
            let timeStr = `${h < 10 ? '0' + h : h}:${m}`; let isSel = (tClean === timeStr) ? 'selected' : '';
            optionsHtml += `<option value="${timeStr}" ${isSel}>${timeStr}</option>`;
        });
    }
    return optionsHtml;
}

function handleSlotDragStart(e, shop, index) {
    let report = JSON.parse(document.getElementById('current-rendered-data-cache').value);
    draggedSourceData = { shop: shop, index: index, payload: report[shop][index] }; e.currentTarget.classList.add('dragging'); e.dataTransfer.effectAllowed = 'move';
}
function handleSlotDragOver(e) { e.preventDefault(); e.currentTarget.classList.add('drag-over'); }
function handleSlotDragLeave(e) { e.currentTarget.classList.remove('drag-over'); }
function handleSlotDrop(e, targetShop, targetIndex) {
    e.preventDefault(); e.currentTarget.classList.remove('drag-over'); document.querySelectorAll('.slot-box').forEach(el => el.classList.remove('dragging'));
    if (!draggedSourceData) return; const sourceShop = draggedSourceData.shop; const sourceIndex = draggedSourceData.index; if (sourceShop === targetShop && sourceIndex === targetIndex) return;
    const dayKey = `day_${state.currentDay}`; if (!state.overrides[dayKey]) { state.overrides[dayKey] = JSON.parse(document.getElementById('current-rendered-data-cache').value); }
    let temp = state.overrides[dayKey][targetShop][targetIndex]; state.overrides[dayKey][targetShop][targetIndex] = state.overrides[dayKey][sourceShop][sourceIndex]; state.overrides[dayKey][sourceShop][sourceIndex] = temp;
    const monthKey = `${state.currentYear}-${state.currentMonth < 10 ? '0'+state.currentMonth : state.currentMonth}`;
    if(isCloudMode && database) { database.ref(`v8_overrides/${monthKey}/${dayKey}`).set(state.overrides[dayKey]); } 
    else { localStorage.setItem(`v8_overrides_${monthKey}`, JSON.stringify(state.overrides)); runScheduler(); }
    draggedSourceData = null;
}

function toggleLocalHolidayDraft(name, day, btn) {
    if (!state.localHolidaysDraft[name]) state.localHolidaysDraft[name] = [];
    const idx = state.localHolidaysDraft[name].indexOf(day);
    const isAddingHoliday = (idx === -1);

    if (isAddingHoliday) {
        // 請假核心攔截：如果店內人手不足，彈出正中心遮罩警告
        if (isManpowerShortageOnDay(day, name)) {
            const modal = document.getElementById('manpower-warning-modal');
            if (modal) {
                modal.style.setProperty('display', 'flex', 'important');
            }
            pendingConfirmCallback = function() {
                state.localHolidaysDraft[name].push(day);
                btn.classList.add('active');
                
                // 將對應日期行的備註標紅，強制填寫理由
                const tr = btn.closest('tr');
                const remarkInput = tr ? tr.querySelector('.calendar-special-note-input') : null;
                if (remarkInput) {
                    remarkInput.placeholder = "⚠️ 當天人手告急，此處必須填寫請假理由！";
                    remarkInput.style.setProperty('border', '2px solid #dc2626', 'important');
                    remarkInput.classList.add('reason-required');
                    remarkInput.focus();
                }
                renderIndividualMonthCalendar();
            };
        } else {
            state.localHolidaysDraft[name].push(day);
            btn.classList.add('active');
            renderIndividualMonthCalendar();
        }
    } else {
        // 取消放假
        state.localHolidaysDraft[name].splice(idx, 1);
        btn.classList.remove('active');
        
        // 移除標紅必填樣式
        const tr = btn.closest('tr');
        const remarkInput = tr ? tr.querySelector('.calendar-special-note-input') : null;
        if (remarkInput) {
            remarkInput.placeholder = "原因...";
            remarkInput.style.border = '';
            remarkInput.classList.remove('reason-required');
        }
        renderIndividualMonthCalendar();
    }
}

function renderMonitorBadges(shopCounts) {
    const monitorPanel = document.getElementById('monitor-panel'); if(!monitorPanel) return; monitorPanel.innerHTML = '';
    ['F79', 'GK3', 'G38', 'G2'].forEach(shop => {
        const count = shopCounts[shop]; let badgeClass = 'bg-ok'; let txt = '正常';
        if(shop === 'F79') { badgeClass = (count >= 2 && count <= 3) ? 'bg-ok' : 'bg-warn'; txt = `指標:${count}人`; } 
        else { if (count < 3) { badgeClass = 'bg-warn'; txt = '缺美甲師'; } else if (count > 6) { badgeClass = 'bg-low'; txt = '爆人(多於6)'; } }
        monitorPanel.innerHTML += `<div class="badge ${badgeClass}"><div style="font-weight:bold;">${shop}</div><div style="font-size:18px; font-weight:900; margin:2px 0;">${count}人</div><div style="font-size:10px; opacity:0.8;">${txt}</div></div>`;
    });
}

function setupFirebaseListeners() {
    if(!database || !isCloudMode) return; const monthKey = `${state.currentYear}-${state.currentMonth < 10 ? '0'+state.currentMonth : state.currentMonth}`;
    cloudLoads = { emp: false, hol: false, ovr: false, note: false };
    if(empRef) empRef.off(); if(holRef) holRef.off(); if(ovrRef) ovrRef.off(); if(appRef) appRef.off(); if(noteRef) noteRef.off();
    empRef = database.ref('v8_employees');
    empRef.on('value', (snapshot) => { 
        const data = snapshot.exists() ? snapshot.val() : JSON.parse(JSON.stringify(defaultEmployees)); 
        state.employees = Array.isArray(data) ? data.filter(Boolean) : Object.values(data).filter(Boolean);
        
        // 雲端帳號及密碼自校正算法
        let needAutoCorrect = false;
        state.employees.forEach(e => {
            if (!e) return;
            if (!e.id || e.id === "100" || e.id === "") {
                e.id = defaultStaffIds[e.name] || "124";
                needAutoCorrect = true;
            }
            if (!e.password || e.password === "" || e.password === "123456" || e.password === "10022") {
                e.password = e.id + String(Math.floor(Math.random() * 90 + 10));
                needAutoCorrect = true;
            }
        });
        if (needAutoCorrect && isCloudMode) {
            database.ref('v8_employees').set(state.employees);
        }
        cloudLoads.emp = true; 
        triggerSafeUIRender(); 
    });
    holRef = database.ref(`v8_holidays/${monthKey}`);
    holRef.on('value', (snapshot) => { state.holidays = snapshot.exists() ? snapshot.val() : JSON.parse(JSON.stringify(defaultHolidaysData)); state.localHolidaysDraft = JSON.parse(JSON.stringify(state.holidays)); cloudLoads.hol = true; triggerSafeUIRender(); });
    ovrRef = database.ref(`v8_overrides/${monthKey}`);
    ovrRef.on('value', (snapshot) => { state.overrides = snapshot.exists() ? snapshot.val() : {}; cloudLoads.ovr = true; triggerSafeUIRender(); });
    noteRef = database.ref(`v8_special_notes/${monthKey}`);
    noteRef.on('value', (snapshot) => { state.notes = snapshot.exists() ? snapshot.val() : {}; cloudLoads.note = true; triggerSafeUIRender(); });
    appRef = database.ref(`v8_pending_approvals/${monthKey}`); appRef.on('value', (snapshot) => { state.pendingApprovals = snapshot.exists() ? snapshot.val() : {}; renderPendingApprovalsBox(); });
}

function initYearMonthDropdowns() {
    const yrSel = document.getElementById('schedule-year-select'); const moSel = document.getElementById('schedule-month-select'); if(!yrSel || !moSel) return;
    yrSel.innerHTML = ''; moSel.innerHTML = ''; for(let y=2026; y<=2028; y++) { yrSel.innerHTML += `<option value="${y}">${y} 年</option>`; }
    for(let m=1; m<=12; m++) { moSel.innerHTML += `<option value="${m}">${m} 月</option>`; }
    yrSel.value = state.currentYear; moSel.value = state.currentMonth; syncDayDropdown();
}

function syncDayDropdown() {
    const daySel = document.getElementById('schedule-day-select'); if(!daySel) return; daySel.innerHTML = ''; let totalDays = getDaysInMonth(state.currentYear, state.currentMonth);
    for(let d = 1; d <= totalDays; d++) { daySel.innerHTML += `<option value="${d}">${d} 日 (星期${getDayOfWeekText(state.currentYear, state.currentMonth, d)})</option>`; }
    daySel.value = state.currentDay; daySel.onchange = function() { state.currentDay = parseInt(this.value); runScheduler(); };
}

function handleDateContextChange() {
    const yrSel = document.getElementById('schedule-year-select'); const moSel = document.getElementById('schedule-month-select'); if(!yrSel || !moSel) return;
    state.currentYear = parseInt(yrSel.value) || 2026; state.currentMonth = parseInt(moSel.value) || 5;
    if (database && isCloudMode) { setupFirebaseListeners(); } else { loadLocalFallbackContext(); }
    syncDayDropdown(); const titleEl = document.getElementById('holiday-title-text'); if(titleEl) titleEl.innerText = `${state.currentYear}年${state.currentMonth}月份放假表 (管理層大表)`;
}

function populateStaffDropdown() {
    const sel = document.getElementById('my-month-staff-select'); if(!sel) return; const currentSelected = sel.value; sel.innerHTML = '';
    state.employees.forEach(e => { sel.innerHTML += `<option value="${e.name}">${e.name} [${e.role}]</option>`; });
    if (currentSelected && state.employees.some(e => e.name === currentSelected)) { sel.value = currentSelected; }
}

function getDaysInMonth(year, month) { return new Date(year, month, 0).getDate(); }
function getDayOfWeekText(year, month, day) { return ['日', '一', '二', '三', '四', '五', '六'][new Date(year, month - 1, day).getDay()]; }
function isSunday(year, month, day) { return new Date(year, month - 1, day).getDay() === 0; }

function renderInteractiveReport(report) {
    let cacheInput = document.getElementById('current-rendered-data-cache');
    if(!cacheInput) { cacheInput = document.createElement('input'); cacheInput.id = 'current-rendered-data-cache'; cacheInput.type = 'hidden'; document.body.appendChild(cacheInput); }
    cacheInput.value = JSON.stringify(report); const reportContainer = document.getElementById('shops-report-container'); if(!reportContainer) return; reportContainer.innerHTML = '';
    const headerColors = { F79: '#4f46e5', GK3: '#9333ea', G38: '#d97706', G2: '#0d9488' };
    let nameOptionsHtml = `<option value="">-- 空缺 --</option>`; state.employees.forEach(e => { nameOptionsHtml += `<option value="${e.name}">${e.name}</option>`; });
    const isManager = (state.currentRole === 'manager');
    ['F79', 'GK3', 'G38', 'G2'].forEach(shop => {
        let slotsHtml = '';
        for (let i = 0; i < 6; i++) {
            let slot = report[shop][i] || { name: '', time: '' }; let currentSelectHtml = nameOptionsHtml.replace(`value="${slot.name}"`, `value="${slot.name}" selected`);
            const isDisabled = !isManager ? 'disabled style="opacity:0.8; background:#f3f4f6;"' : ''; let noteTextHtml = '';
            if (slot.name && state.notes[slot.name] && state.notes[slot.name][`day_${state.currentDay}`]) { noteTextHtml = `<div class="slot-note-text" title="${state.notes[slot.name][`day_${state.currentDay}`]}">📝 ${state.notes[slot.name][`day_${state.currentDay}`]}</div>`; }
            let timeDropdownHtml = `<select class="manual-time-select" ${isDisabled} onchange="handleManualSlotChange('${shop}', ${i}, 'time', this.value)">${generateTimeOptions(slot.time)}</select>`;
            let dragAttributes = isManager ? `draggable="true" ondragstart="handleSlotDragStart(event, '${shop}', ${i})" ondragover="handleSlotDragOver(event)" ondragleave="handleSlotDragLeave(event)" ondrop="handleSlotDrop(event, '${shop}', ${i})"` : '';
            slotsHtml += `<div class="slot-box" ${dragAttributes} data-shop="${shop}" data-index="${i}"><select class="manual-name-select" ${isDisabled} onchange="handleManualSlotChange('${shop}', ${i}, 'name', this.value)">${currentSelectHtml}</select>${timeDropdownHtml}${noteTextHtml}</div>`;
        }
        let currentCount = 0; report[shop].forEach(s => { if(s.name) currentCount++; });
        reportContainer.innerHTML += `<div class="shop-box"><div class="shop-header" style="background: ${headerColors[shop]};"><span>${shop} 店鋪</span><span>當前共：${currentCount} 人</span></div><div class="grid-6">${slotsHtml}</div></div>`;
    });
}

// ==================== 👤 個人當月排班月曆繪製 ====================
function renderIndividualMonthCalendar() {
    const tbody = document.getElementById('my-month-calendar-body'); if(!tbody) return; tbody.innerHTML = ''; const staffName = document.getElementById('my-month-staff-select').value; if(!staffName) return;
    let totalDays = getDaysInMonth(state.currentYear, state.currentMonth); const realToday = new Date(); const realDayNum = realToday.getDate(); const realMonthNum = realToday.getMonth() + 1; const realYearNum = realToday.getFullYear(); const isManager = (state.currentRole === 'manager');
    for (let d = 1; d <= totalDays; d++) {
        let isWknd = getDayOfWeekText(state.currentYear, state.currentMonth, d) === '日' ? 'background:#fef2f2; font-weight:bold; color:var(--danger);' : ''; let assignedShop = '<span style="color:#9ca3af;">-</span>'; let assignedTime = '<span style="color:#9ca3af;">-</span>';
        let isPastDay = (state.currentYear < realYearNum || (state.currentYear === realYearNum && state.currentMonth < realMonthNum) || (state.currentYear === realYearNum && state.currentMonth === realMonthNum && d < realDayNum));
        let dayKey = `day_${d}`; let dayReport = state.overrides[dayKey] || calculateDaySchedule(d).report; let activeUniqueManiSet = new Set();
        ['F79', 'GK3', 'G38', 'G2'].forEach(s => { dayReport[s].forEach(slot => { if(slot.name) { const staff = state.employees.find(e => e.name.replace(/\s+/g, '') === slot.name.replace(/\s+/g, '')); if(staff && staff.role !== '學徒') activeUniqueManiSet.add(staff.name); } }); });
        let activeManiCount = activeUniqueManiSet.size; const isHolidayDraft = (state.localHolidaysDraft[staffName] || []).includes(d);
        if (isHolidayDraft) { assignedShop = '<span style="color:var(--danger); font-weight:bold;">放假要求 🏖️</span>'; assignedTime = '<span style="color:var(--danger); font-size:11px;">(待存/放假)</span>'; } 
        else {
            ['F79', 'GK3', 'G38', 'G2'].forEach(s => { if (dayReport[s]) { dayReport[s].forEach(slot => { if (slot.name && slot.name.replace(/\s+/g, '') === staffName.replace(/\s+/g, '')) { assignedShop = `<b style="color:var(--primary);">${s} 店</b>`; let tClean = slot.time; if(tClean.includes('(')) { let m = tClean.match(/\(([^)]+)\)/); if(m && m[1]) tClean = m[1]; } assignedTime = `<span style="font-weight:bold; color:#1e3a8a;">${tClean}</span>`; } }); } });
        }
        let currentNote = (state.notes && state.notes[staffName] && state.notes[staffName][`day_${d}`]) ? state.notes[staffName][`day_${d}`] : ''; let btnHtml = ""; let inputDisabledHtml = "";
        if (isPastDay && !isManager) { let lockedActive = isHolidayDraft ? 'active' : ''; btnHtml = `<button class="holiday-btn locked ${lockedActive}" disabled>已鎖</button>`; inputDisabledHtml = `disabled style="background:#f3f4f6; color:#9ca3af; cursor:not-allowed;"`; } 
        else { let activeClass = isHolidayDraft ? 'active' : ''; btnHtml = `<button class="holiday-btn ${activeClass}" onclick="toggleLocalHolidayDraft('${staffName}', ${d}, this)">放假</button>`; }
        let maniBadgeStyle = "background:#cef7e5; color:#03543f;"; if(activeManiCount <= state.settings.limitLow) maniBadgeStyle = "background:#fde8e8; color:#9b1c1c; font-weight:bold;"; else if(activeManiCount < state.settings.limitHigh) maniBadgeStyle = "background:#e6fbf4; color:#0d9488;";
        tbody.innerHTML += `<tr><td style="text-align:center; font-weight:bold; ${isPastDay?'color:#9ca3af;':''}">${isPastDay ? '🔒 ' : ''}${d} 日</td><td style="text-align:center; ${isWknd}">${getDayOfWeekText(state.currentYear, state.currentMonth, d)}</td><td style="text-align:center;"><span style="padding:2px 6px; border-radius:6px; font-size:11px; ${maniBadgeStyle}">${activeManiCount} 師</span></td><td style="text-align:center;">${assignedShop}</td><td style="text-align:center;">${assignedTime}</td><td style="text-align:center;">${btnHtml}</td><td><input type="text" class="calendar-special-note-input" data-day="${d}" data-staff="${staffName}" ${inputDisabledHtml} value="${currentNote}" placeholder="原因..."></td></tr>`;
    }
    const invertBtn = document.getElementById('my-month-invert-btn'); if (invertBtn) { invertBtn.disabled = ((state.currentYear < realYearNum || (state.currentYear === realYearNum && state.currentMonth < realMonthNum)) && !isManager); invertBtn.style.opacity = invertBtn.disabled ? 0.4 : 1; }
}

function invertIndividualEmployeeHolidays() {
    const staffName = document.getElementById('my-month-staff-select').value; if(!staffName) return; const isManager = (state.currentRole === 'manager');
    let totalDays = getDaysInMonth(state.currentYear, state.currentMonth); if (!state.localHolidaysDraft[staffName]) state.localHolidaysDraft[staffName] = []; let inverted = [];
    for (let d = 1; d <= totalDays; d++) {
        let isPastDay = (state.currentYear < 2026 || (state.currentYear === 2026 && state.currentMonth < 5) || (state.currentYear === 2026 && state.currentMonth === 5 && d < 1));
        if (isPastDay && !isManager) { if ((state.holidays[staffName] || []).includes(d)) inverted.push(d); } else { if (!state.localHolidaysDraft[staffName].includes(d)) inverted.push(d); }
    }
    state.localHolidaysDraft[staffName] = inverted; renderIndividualMonthCalendar();
}

function saveSpecialNotesAndHolidaysData() {
    const inputs = document.querySelectorAll('.calendar-special-note-input'); if(inputs.length === 0) return; const staffName = inputs[0].getAttribute('data-staff');
    const monthKey = `${state.currentYear}-${state.currentMonth < 10 ? '0'+state.currentMonth : state.currentMonth}`; const realToday = new Date(); const realDayNum = realToday.getDate(); const realMonthNum = realToday.getMonth() + 1; const realYearNum = realToday.getFullYear();
    let isManager = (state.currentRole === 'manager'); let historyTamperTriggered = false;
    if (!isManager) {
        const originalHols = state.holidays[staffName] || []; const draftHols = state.localHolidaysDraft[staffName] || [];
        for (let d = 1; d <= getDaysInMonth(state.currentYear, state.currentMonth); d++) {
            let isPastDay = (state.currentYear < realYearNum || (state.currentYear === realYearNum && state.currentMonth < realMonthNum) || (state.currentYear === realYearNum && state.currentMonth === realMonthNum && d < realDayNum));
            if (isPastDay && (originalHols.includes(d) !== draftHols.includes(d))) { historyTamperTriggered = true; }
        }
    }
    if (historyTamperTriggered) { alert("❌ 系統攔截：歷史考勤已被安全鎖定！"); state.localHolidaysDraft[staffName] = JSON.parse(JSON.stringify(state.holidays)); renderIndividualMonthCalendar(); return; }
    if(!state.notes[staffName]) state.notes[staffName] = {}; inputs.forEach(input => { if (!input.disabled) { state.notes[staffName][`day_${input.getAttribute('data-day')}`] = input.value.trim(); } });
    let requiresApproval = false; let shortageTriggered = false;
    if (!isManager) {
        const draftHols = state.localHolidaysDraft[staffName] || [];
        for(let d of draftHols) {
            if (isManpowerShortageOnDay(d, staffName)) { shortageTriggered = true; break; }
        }
        let limitYear = realYearNum; let limitMonth = realMonthNum + 1; if (limitMonth > 12) { limitMonth = 1; limitYear += 1; }
        if (realDayNum >= state.settings.lockDay && (state.currentYear < limitYear || (state.currentYear === limitYear && state.currentMonth <= limitMonth))) { requiresApproval = true; }
        if (shortageTriggered) requiresApproval = true;
    }
    if (requiresApproval) {
        if (isCloudMode && database) {
            let activeReasonNotes = {}; (state.localHolidaysDraft[staffName] || []).forEach(d => { let r = state.notes[staffName][`day_${d}`] || ''; if(r) activeReasonNotes[`day_${d}`] = r; });
            database.ref(`v8_pending_approvals/${monthKey}`).push({ name: staffName, requestedHolidays: state.localHolidaysDraft[staffName] || [], reasons: activeReasonNotes, timestamp: firebase.database.ServerValue.TIMESTAMP });
            database.ref(`v8_special_notes/${monthKey}/${staffName}`).set(state.notes[staffName]); alert(`⏳ 當天人手不足或超出截止日，放假申請已成功送往智庫審批中心等待覆核。`);
        }
    } else {
        state.holidays[staffName] = JSON.parse(JSON.stringify(state.localHolidaysDraft[staffName]));
        if (isCloudMode && database) { database.ref(`v8_holidays/${monthKey}/${staffName}`).set(state.holidays[staffName]); database.ref(`v8_special_notes/${monthKey}/${staffName}`).set(state.notes[staffName]); alert(`🟢 變更成功！`); } 
        else { localStorage.setItem(`v8_holidays_${monthKey}`, JSON.stringify(state.holidays)); localStorage.setItem(`v8_notes_${monthKey}`, JSON.stringify(state.notes)); alert(`💾 本地儲存成功！`); runScheduler(); }
    }
}

// ==================== 📥 智庫審批中心渲染大重構 (僅顯示申請放假的日子 + 精密放假數據) ====================
function renderPendingApprovalsBox() {
    const container = document.getElementById('smart-approval-list-container'); if(!container) return; const quickDot = document.getElementById('quick-notify-dot'); container.innerHTML = ''; const keys = Object.keys(state.pendingApprovals);
    if (keys.length === 0) { container.innerHTML = `<div style="text-align:center; padding:30px; color:#9ca3af; font-weight:bold;">🙌 目前沒有待審批申請。</div>`; if(quickDot) quickDot.style.display = 'none'; return; }
    if(quickDot) quickDot.style.display = 'inline-block';
    
    keys.forEach(k => {
        const item = state.pendingApprovals[k]; let staffName = item.name; let draftHols = item.requestedHolidays || []; let reasonsObj = item.reasons || {}; let cardsHtml = '';
        
        draftHols.forEach(d => {
            const stats = getManpowerStatsOnDay(d, staffName);
            let isAlert = stats.working <= state.settings.limitLow ? 'background:#fff1f2; border:1px solid #fca5a5; color:#9b1c1c;' : 'background:#f0fdf4; border:1px solid #bbf7d0; color:#03543f;';
            cardsHtml += `<div class="decision-info-block" style="margin-bottom:10px; padding:10px; border-radius:8px; ${isAlert}"><div style="font-size:13px; font-weight:bold; margin-bottom:4px;">📅 ${d} 號 (星期${getDayOfWeekText(state.currentYear, state.currentMonth, d)})</div><div style="font-size:12px; font-weight:bold; margin-bottom:4px;">🏖️ 當天不包括 ${staffName} 已有 <span style="color:#dc2626; font-size:13px;">${stats.offExcludingApplicant}</span> 位美甲師放假</div><div style="font-size:12px; font-weight:bold; margin-bottom:4px; color:#475569;">📢 可供申請人手：${d}號 (${stats.working}人上班)</div><div style="font-size:12px; margin-top:6px; padding-top:4px; border-top:1px dashed rgba(0,0,0,0.08); color:#ea580c; font-weight:bold;">📝 申請理由：${reasonsObj[`day_${d}`] || reasonsObj[d] || state.notes[staffName]?.[`day_${d}`] || '(未填寫原因)'}</div></div>`;
        });
        
        container.innerHTML += `<div class="decision-card" style="background:white; border:1px solid #cbd5e1; border-radius:12px; padding:16px; margin-bottom:16px; box-shadow:0 4px 6px -1px rgba(0,0,0,0.05);"><div class="decision-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; border-bottom:1px solid #f1f5f9; padding-bottom:8px;"><div><span style="font-size:15px; font-weight:bold; color:#1e293b;">👤 申請人：${staffName}</span></div><div style="display:flex; gap:8px;"><button class="btn" style="background:var(--success); color:white; font-weight:bold; padding:6px 12px; border-radius:6px; font-size:12px;" onclick="actionApproveHoliday('${k}', '${staffName}', [${draftHols}])">批准放假</button><button class="btn" style="background:var(--danger); color:white; font-weight:bold; padding:6px 12px; border-radius:6px; font-size:12px;" onclick="database.ref('v8_pending_approvals/${state.currentYear}-${state.currentMonth < 10 ? '0'+state.currentMonth : state.currentMonth}/${k}').remove()">拒絕申請</button></div></div><div class="decision-grid">${cardsHtml}</div></div>`;
    });
}

function actionApproveHoliday(key, name, hols) {
    const monthKey = `${state.currentYear}-${state.currentMonth < 10 ? '0'+state.currentMonth : state.currentMonth}`; state.holidays[name] = hols; state.localHolidaysDraft[name] = hols;
    if(database) database.ref(`v8_holidays/${monthKey}/${name}`).set(hols).then(() => { database.ref(`v8_pending_approvals/${monthKey}/${key}`).remove(); alert(`🟢 已核准發佈！`); });
}

function getManpowerStatsOnDay(dayNum, excludeName) {
    const monthKey = `${state.currentYear}-${state.currentMonth < 10 ? '0'+state.currentMonth : state.currentMonth}`;
    const holidays = state.holidays || {};
    const employees = state.employees || [];

    const manicurists = employees.filter(e => e && e.role !== "學徒");
    const totalMani = manicurists.length;

    let offManiCountExcludingApplicant = 0;
    let totalOffManiCount = 0;

    Object.keys(holidays).forEach(staffName => {
        const emp = employees.find(e => e && e.name === staffName);
        if (emp && emp.role === "學徒") return; 

        const daysOff = holidays[staffName] || [];
        const daysOffNums = daysOff.map(Number);
        if (daysOffNums.includes(Number(dayNum))) {
            totalOffManiCount++;
            if (staffName !== excludeName) {
                offManiCountExcludingApplicant++;
            }
        }
    });

    // 剩餘可上班的核心美甲師人數
    const workingManiCount = totalMani - totalOffManiCount;

    return {
        offExcludingApplicant: offManiCountExcludingApplicant,
        working: workingManiCount
    };
}

// ==================== 📊 人手統計分析大表與篩選 ====================
function applyColumnFilter(type) {
    document.querySelectorAll('.btn-filter').forEach(b => b.classList.remove('active')); document.getElementById('filter-' + type).classList.add('active');
    if(type === 'all') document.querySelectorAll('.col-mani, .col-app, .col-shops').forEach(el => el.style.display = '');
    else if(type === 'mani') { document.querySelectorAll('.col-mani').forEach(el => el.style.display = ''); document.querySelectorAll('.col-app, .col-shops').forEach(el => el.style.display = 'none'); }
    else if(type === 'app') { document.querySelectorAll('.col-app').forEach(el => el.style.display = ''); document.querySelectorAll('.col-mani, .col-shops').forEach(el => el.style.display = 'none'); }
    else if(type === 'shops') { document.querySelectorAll('.col-shops').forEach(el => el.style.display = ''); document.querySelectorAll('.col-mani, .col-app').forEach(el => el.style.display = 'none'); }
}

function renderMonthlyAnalysis() {
    const tbody = document.getElementById('analysis-table-body'); if(!tbody) return; tbody.innerHTML = '';
    const lowBody = document.getElementById('low-staff-table-body'); const highBody = document.getElementById('high-staff-table-body'); if(lowBody) lowBody.innerHTML = ''; if(highBody) highBody.innerHTML = '';
    let totalDays = getDaysInMonth(state.currentYear, state.currentMonth); let lowStaffHtml = ""; let highStaffHtml = ""; let attendanceCounters = {};
    state.employees.forEach(e => { attendanceCounters[e.name] = { totalLeave: 0, totalWork: 0, role: e.role || 'Full-time' }; });
    for (let d = 1; d <= totalDays; d++) {
        let dayKey = `day_${d}`; let finalCounts = { F79: 0, GK3: 0, G38: 0, G2: 0 }; let totalWorkingApprentices = 0; let dayReport = state.overrides[dayKey] || calculateDaySchedule(d).report;
        ['F79', 'GK3', 'G38', 'G2'].forEach(s => { dayReport[s].forEach(slot => { if(slot.name) { const staff = state.employees.find(e => e.name.replace(/\s+/g, '') === slot.name.replace(/\s+/g, '')); if(staff) { if(staff.role === '學徒') totalWorkingApprentices++; else finalCounts[s]++; } } }); });
        state.employees.forEach(e => { if ((state.holidays[e.name] || []).includes(d)) { if(attendanceCounters[e.name]) attendanceCounters[e.name].totalLeave++; } else { if(attendanceCounters[e.name]) attendanceCounters[e.name].totalWork++; } });
        let totalWorkingMani = finalCounts.F79 + finalCounts.GK3 + finalCounts.G38 + finalCounts.G2;
        let alertBgClass = totalWorkingMani <= state.settings.limitLow ? "bg-alert-red" : (totalWorkingMani >= state.settings.limitHigh ? "bg-alert-darkgreen" : "bg-alert-lightgreen");
        let isWknd = getDayOfWeekText(state.currentYear, state.currentMonth, d) === '日' ? 'background:#fef2f2; font-weight:bold; color:var(--danger);' : '';
        let rowHtml = `<tr><td style="text-align:center; font-weight:bold; width:65px;">${d} 日</td><td style="text-align:center; ${isWknd} width:55px;">${getDayOfWeekText(state.currentYear, state.currentMonth, d)}</td><td class="col-mani ${alertBgClass}" style="width:100px;">${totalWorkingMani} 師</td><td class="col-app" style="text-align:center; background:#f0fdf4; font-weight:bold; color:#0d9488; width:100px;">${totalWorkingApprentices} 徒</td><td class="col-shops normal-cell">${finalCounts.F79}人</td><td class="col-shops normal-cell">${finalCounts.GK3}人</td><td class="col-shops normal-cell">${finalCounts.G38}人</td><td class="col-shops normal-cell">${finalCounts.G2}人</td></tr>`;
        tbody.innerHTML += rowHtml; if(totalWorkingMani <= state.settings.limitLow) lowStaffHtml += rowHtml; if(totalWorkingMani >= state.settings.limitHigh) highStaffHtml += rowHtml;
    }
    if(lowBody) lowBody.innerHTML = lowStaffHtml || `<tr><td style='text-align:center; padding:10px; color:#9ca3af;'>🙌 本月人手充裕。</td></tr>`;
    if(highBody) highBody.innerHTML = highStaffHtml || `<tr><td style='text-align:center; padding:10px; color:#9ca3af;'>📊 本月無充沛日子。</td></tr>`;
    const summaryBody = document.getElementById('staff-month-summary-body');
    if(summaryBody) {
        summaryBody.innerHTML = ''; Object.keys(attendanceCounters).forEach(name => { let info = attendanceCounters[name];
            summaryBody.innerHTML += `<tr><td style="padding:6px 10px; font-weight:bold;">${name}</td><td style="text-align:center;">${info.role}</td><td style="text-align:center; color:var(--success);">${info.totalWork} 天</td><td style="text-align:center; color:var(--danger);">${info.totalLeave} 天</td></tr>`;
        });
    }
    applyColumnFilter('all'); 
}

// ==================== 🏖️ 放假表大統計繪製 ====================
function renderHolidayTable() {
    const headerRow = document.getElementById('holiday-table-header-row'); const tbody = document.getElementById('holiday-table-body'); if(!headerRow || !tbody) return; headerRow.innerHTML = ''; tbody.innerHTML = '';
    let totalDays = getDaysInMonth(state.currentYear, state.currentMonth); headerRow.innerHTML += `<th class="sticky-col">員工放假總覽 📊</th>`;
    for(let d=1; d<=totalDays; d++) { 
        let dayReport = state.overrides[`day_${d}`] || calculateDaySchedule(d).report; let tMani = 0, tApp = 0; let activeUniqueManiSet = new Set();
        dayReport['F79'].concat(dayReport['GK3'], dayReport['G38'], dayReport['G2']).forEach(slot => { if(slot.name) { const staff = state.employees.find(e => e.name.replace(/\s+/g, '') === slot.name.replace(/\s+/g, '')); if(staff) { if(staff.role === '學徒') tApp++; else activeUniqueManiSet.add(staff.name); } } });
        headerRow.innerHTML += `<th style="text-align:center; min-width:42px; background:#f8fafc;"><span style="color:var(--primary); display:block;">${activeUniqueManiSet.size}師</span><span style="color:#0d9488; display:block;">${tApp}徒</span><b>${d}</b><br><span style="font-size:9px; font-weight:normal;">${getDayOfWeekText(state.currentYear, state.currentMonth, d)}</span></th>`; 
    }
    state.employees.forEach(emp => {
        let dotsHtml = ''; const userHols = state.holidays[emp.name] || [];
        for(let d = 1; d <= totalDays; d++) { let isActive = userHols.includes(d) ? 'active' : ''; let dotText = userHols.includes(d) ? '假' : '-'; dotsHtml += `<td><span class="holiday-display-dot ${isActive}">${dotText}</span></td>`; }
        tbody.innerHTML += `<tr><td class="sticky-col"><span class="count-badge">${userHols.length}天</span><b>${emp.name}</b></td>${dotsHtml}</tr>`;
    });
}

// ==================== 👥 員工資料庫表與自編帳密安全機制 ====================
function renderEmployeeTable() {
    const tbody = document.getElementById('employee-table-body'); if(!tbody) return; tbody.innerHTML = '';
    const isReadonly = (state.currentRole !== 'manager') ? 'disabled' : '';
    
    state.employees.forEach((emp, index) => {
        let currentRole = emp.role || 'Full-time';
        const code = emp.id || defaultStaffIds[emp.name] || "100";
        const pass = emp.password || (code + "22");
        
        tbody.innerHTML += `
            <tr>
                <td>
                    <input type="text" class="emp-id-input" ${isReadonly} style="width: 70px; text-align: center; font-weight: bold; border: 1px solid #cbd5e1; border-radius: 6px; padding: 4px;" value="${code}" oninput="updateEmployeeRowPassword(this, ${index})">
                </td>
                <td>
                    <input type="text" class="emp-name-input" ${isReadonly} style="width: 100px; border: 1px solid #cbd5e1; border-radius: 6px; padding: 4px;" value="${emp.name}">
                </td>
                <td>
                    <select class="emp-type-select" ${isReadonly} style="padding: 4px; border: 1px solid #cbd5e1; border-radius: 6px;">
                        <option value="Full-time" ${currentRole === 'Full-time' ? 'selected' : ''}>Full-time</option>
                        <option value="Part-time" ${currentRole === 'Part-time' ? 'selected' : ''}>Part-time</option>
                        <option value="學徒" ${currentRole === '學徒' ? 'selected' : ''}>學徒</option>
                    </select>
                </td>
                <td>
                    <input type="text" class="emp-shops-input" ${isReadonly} style="width: 150px; border: 1px solid #cbd5e1; border-radius: 6px; padding: 4px;" value="${emp.p_shops || ''}">
                </td>
                <td>
                    <input type="text" class="emp-times-input" ${isReadonly} style="width: 180px; border: 1px solid #cbd5e1; border-radius: 6px; padding: 4px;" value="${emp.times || ''}">
                </td>
                <td>
                    <div style="display:flex; align-items:center; gap:4px; justify-content:center;">
                        <input type="text" class="emp-pass-input" ${isReadonly} style="width: 90px; text-align: center; font-weight: bold; border: 1px solid #cbd5e1; border-radius: 6px; padding: 4px;" value="${pass}">
                        <button class="btn" ${isReadonly} style="background:#f1f5f9; color:#475569; border:1px solid #cbd5e1; padding:4px 6px; font-size:11px;" onclick="regenerateEmployeeRowPass(this)" title="重算密碼">🔄</button>
                    </div>
                </td>
                <td>
                    <button class="btn btn-del" ${isReadonly} style="background: var(--danger); color: white; padding: 4px 8px;" onclick="this.closest('tr').remove()">刪除</button>
                </td>
            </tr>
        `;
    });
}

function updateEmployeeRowPassword(idInput, index) {
    const tr = idInput.closest('tr');
    if (!tr) return;
    const passInput = tr.querySelector('.emp-pass-input');
    if (passInput) {
        const idVal = idInput.value.trim();
        if (idVal) {
            passInput.value = idVal + String(Math.floor(Math.random() * 90 + 10));
        }
    }
}

function regenerateEmployeeRowPass(btn) {
    const tr = btn.closest('tr');
    if (!tr) return;
    const idInput = tr.querySelector('.emp-id-input') || tr.querySelector('.sett-id-field');
    const passInput = tr.querySelector('.emp-pass-input') || tr.querySelector('.sett-pass-field');
    if (idInput && passInput) {
        const idVal = idInput.value.trim();
        if (idVal) {
            passInput.value = idVal + String(Math.floor(Math.random() * 90 + 10));
            showToastMessage("🔄 密碼重算完成！");
        } else {
            alert("⚠️ 請先輸入工號！");
        }
    }
}

function addEmployeeRow() {
    if(state.currentRole !== 'manager') return; const tbody = document.getElementById('employee-table-body'); if(!tbody) return;
    const randomSuffix = String(Math.floor(Math.random() * 90 + 10));
    tbody.innerHTML += `
        <tr>
            <td>
                <input type="text" class="emp-id-input" style="width: 70px; text-align: center; font-weight: bold; border: 1px solid #cbd5e1; border-radius: 6px; padding: 4px;" value="124" oninput="updateEmployeeRowPassword(this)">
            </td>
            <td>
                <input type="text" class="emp-name-input" style="width: 100px; border: 1px solid #cbd5e1; border-radius: 6px; padding: 4px;" placeholder="姓名">
            </td>
            <td>
                <select class="emp-type-select" style="padding: 4px; border: 1px solid #cbd5e1; border-radius: 6px;">
                    <option value="Full-time" selected>Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="學徒">學徒</option>
                </select>
            </td>
            <td>
                <input type="text" class="emp-shops-input" style="width: 150px; border: 1px solid #cbd5e1; border-radius: 6px; padding: 4px;" value="G2, G38, GK3">
            </td>
            <td>
                <input type="text" class="emp-times-input" style="width: 180px; border: 1px solid #cbd5e1; border-radius: 6px; padding: 4px;" value="11:00, 12:00, 13:00">
            </td>
            <td>
                <div style="display:flex; align-items:center; gap:4px; justify-content:center;">
                    <input type="text" class="emp-pass-input" style="width: 90px; text-align: center; font-weight: bold; border: 1px solid #cbd5e1; border-radius: 6px; padding: 4px;" value="124${randomSuffix}">
                    <button class="btn" style="background:#f1f5f9; color:#475569; border:1px solid #cbd5e1; padding:4px 6px; font-size:11px;" onclick="regenerateEmployeeRowPass(this)">🔄</button>
                </div>
            </td>
            <td>
                <button class="btn btn-del" style="background: var(--danger); color: white; padding: 4px 8px;" onclick="this.closest('tr').remove()">刪除</button>
            </td>
        </tr>
    `;
}

function saveEmployeeData() {
    if (state.currentRole !== 'manager') return; const rows = document.querySelectorAll('#employee-table-body tr'); let newEmps = [];
    rows.forEach(row => { 
        const id = row.querySelector('.emp-id-input').value.trim();
        const name = row.querySelector('.emp-name-input').value.trim(); 
        const role = row.querySelector('.emp-type-select').value;
        const p_shops = row.querySelector('.emp-shops-input').value;
        const times = row.querySelector('.emp-times-input').value;
        const password = row.querySelector('.emp-pass-input').value.trim();
        if(!name) return; 
        newEmps.push({ id, name, role, p_shops, times, password }); 
    });
    state.employees = newEmps;
    if(isCloudMode && database) { 
        database.ref(`v8_employees`).set(state.employees).then(() => { showToastMessage('👥 員工設定與安全帳密已成功發佈！'); }); 
    } else { 
        localStorage.setItem('v8_employees', JSON.stringify(state.employees)); 
        showToastMessage('💾 員工名單已儲存至本地！'); 
        populateStaffDropdown(); 
        renderSettingsAccountsList(state.employees);
    }
}

// ==================== ⚙️ 微調設定頁：員工帳密大腦控制台渲染與操作 ====================
function renderSettingsAccountsList(employees) {
    const tbody = document.getElementById('settings-accounts-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (employees.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding:20px; color:#94a3b8; font-weight:bold;">⚠️ 雲端尚無員工名單！請先在員工管理頁新增。</td></tr>`;
        return;
    }

    employees.forEach((e, idx) => {
        if (!e) return;
        const code = e.id || "100";
        const pass = e.password || (code + "22");

        tbody.innerHTML += `
            <tr style="border-bottom:1px solid #f1f5f9;" data-idx="${idx}">
                <td style="padding:10px; font-weight:bold; color:#1e293b;">${e.name || '未命名'}</td>
                <td style="padding:10px; text-align:center;">
                    <input type="text" class="sett-id-field" style="width:100px; text-align:center; font-weight:bold; border:1px solid #cbd5e1; border-radius:6px; padding:4px;" value="${code}" oninput="updateSettingsRowPassword(this)">
                </td>
                <td style="padding:10px; text-align:center;">
                    <input type="text" class="sett-pass-field" style="width:120px; text-align:center; font-weight:bold; border:1px solid #cbd5e1; border-radius:6px; padding:4px;" value="${pass}">
                </td>
                <td style="padding:10px; text-align:center;">
                    <button class="btn" style="background:#f1f5f9; color:#475569; border:1px solid #cbd5e1; padding:4px 8px; font-size:11px; border-radius:6px;" onclick="regenerateEmployeeRowPass(this)">🔄 重算</button>
                </td>
            </tr>
        `;
    });
}

function updateSettingsRowPassword(idInput) {
    const tr = idInput.closest('tr');
    if (!tr) return;
    const passInput = tr.querySelector('.sett-pass-field');
    if (passInput) {
        const idVal = idInput.value.trim();
        if (idVal) {
            passInput.value = idVal + String(Math.floor(Math.random() * 90 + 10));
        }
    }
}

function triggerRegenerateAllPasswords() {
    if (confirm("⚠️ 確定要為所有人「重新生成」隨機預設密碼嗎？\n生成後需要點擊右下角「儲存員工帳密變更」才會正式寫入雲端！")) {
        const rows = document.querySelectorAll('#settings-accounts-tbody tr');
        rows.forEach(tr => {
            const idInput = tr.querySelector('.sett-id-field');
            const passInput = tr.querySelector('.sett-pass-field');
            if (idInput && passInput) {
                const idVal = idInput.value.trim();
                passInput.value = idVal + String(Math.floor(Math.random() * 90 + 10));
            }
        });
        showToastMessage("⚡ 已在本機重算，請記得點擊儲存變更！");
    }
}

function saveEmployeesAccountsFromSettings() {
    const rows = document.querySelectorAll('#settings-accounts-tbody tr');
    const updatedList = [...state.employees]; 

    rows.forEach((tr, index) => {
        const idInput = tr.querySelector('.sett-id-field');
        const passInput = tr.querySelector('.sett-pass-field');
        if (idInput && passInput && updatedList[index]) {
            updatedList[index].id = idInput.value.trim();
            updatedList[index].password = passInput.value.trim();
        }
    });

    if (typeof firebase !== 'undefined' && firebase.apps.length > 0) {
        firebase.database().ref('v8_employees').set(updatedList).then(() => {
            showToastMessage('🎉 員工登入帳號及密碼成功同步至雲端大腦！');
        }).catch(err => {
            alert('儲存變更失敗: ' + err.message);
        });
    }
}

function saveHolidayData() {
    if(state.currentRole !== 'manager') return; const monthKey = `${state.currentYear}-${state.currentMonth < 10 ? '0'+state.currentMonth : state.currentMonth}`;
    if(isCloudMode && database) { database.ref(`v8_holidays/${monthKey}`).set(state.holidays).then(() => { showToastMessage('🏖️ 放假大表已成功發佈！'); }); } 
}

function handleManualSlotChange(shop, index, field, value) {
    const dayKey = `day_${state.currentDay}`; if (!state.overrides[dayKey]) { state.overrides[dayKey] = JSON.parse(document.getElementById('current-rendered-data-cache').value); }
    state.overrides[dayKey][shop][index][field] = value; const monthKey = `${state.currentYear}-${state.currentMonth < 10 ? '0'+state.currentMonth : state.currentMonth}`;
    if(isCloudMode && database) { database.ref(`v8_overrides/${monthKey}/${dayKey}`).set(state.overrides[dayKey]); } 
    else { localStorage.setItem(`v8_overrides_${monthKey}`, JSON.stringify(state.overrides)); refreshBadgesOnly(state.overrides[dayKey]); }
}

function resetCurrentDayToAuto() {
    const monthKey = `${state.currentYear}-${state.currentMonth < 10 ? '0'+state.currentMonth : state.currentMonth}`;
    if(isCloudMode && database) { database.ref(`v8_overrides/${monthKey}/day_${state.currentDay}`).remove(); } 
    else { if(state.overrides[`day_${state.currentDay}`]) { delete state.overrides[`day_${state.currentDay}`]; localStorage.setItem(`v8_overrides_${monthKey}`, JSON.stringify(state.overrides)); runScheduler(); } }
}

function refreshBadgesOnly(reportData) {
    let shopCounts = { F79: 0, GK3: 0, G38: 0, G2: 0 }; ['F79', 'GK3', 'G38', 'G2'].forEach(shop => { reportData[shop].forEach(slot => { if(slot.name) shopCounts[shop]++; }); });
    renderMonitorBadges(shopCounts);
}

// ==================== ⚙️ 演算法與每日排班邏輯核心 ====================
function runScheduler() {
    let leavesToday = []; state.employees.forEach(emp => { if ((state.holidays[emp.name] || []).includes(state.currentDay)) leavesToday.push(emp.name); });
    const dayKey = `day_${state.currentDay}`; let report = {}; let activeStaff = state.employees.filter(e => !(state.holidays[e.name] || []).includes(state.currentDay));
    let manicurists = activeStaff.filter(e => e.role !== '學徒'); let apprentices = activeStaff.filter(e => e.role === '學徒');
    const totalTextEl = document.getElementById('total-working-text'); const leaveBoxEl = document.getElementById('today-leave-names-box');
    if (state.overrides[dayKey]) {
        report = state.overrides[dayKey];
        if(totalTextEl) totalTextEl.innerHTML = `${state.currentMonth}月 ${state.currentDay} 日 (星期${getDayOfWeekText(state.currentYear, state.currentMonth, state.currentDay)}) 美甲師：<b>${manicurists.length}</b> 人 ｜ 學徒：<b>${apprentices.length}</b> 人 ｜ 總上班：<b>${activeStaff.length}</b> 人 (⚠️手動微調模式)`;
        if(leaveBoxEl) leaveBoxEl.innerHTML = `今日放假：${leavesToday.length > 0 ? leavesToday.join(', ') : '無'}`;
        refreshBadgesOnly(report); renderInteractiveReport(report); return;
    }
    let result = calculateDaySchedule(state.currentDay); report = result.report;
    if(totalTextEl) totalTextEl.innerHTML = `${state.currentMonth}月 ${state.currentDay} 日 (星期${getDayOfWeekText(state.currentYear, state.currentMonth, state.currentDay)}) 美甲師：<b>${result.manicuristCount}</b> 人 ｜ 學徒：<b>${apprentices.length}</b> 人 ｜ 總上班：<b>${result.totalCount}</b> 人`;
    if(leaveBoxEl) leaveBoxEl.innerHTML = `今日放假：${leavesToday.length > 0 ? leavesToday.join(', ') : '無'}`;
    refreshBadgesOnly(report); renderInteractiveReport(report);
}

function calculateDaySchedule(dayNumber) {
    let report = { F79: [], GK3: [], G38: [], G2: [] }; let isSun = isSunday(state.currentYear, state.currentMonth, dayNumber);
    const activeStaff = state.employees.filter(e => !(state.holidays[e.name] || []).includes(dayNumber)); const manicurists = activeStaff.filter(e => e.role !== '學徒'); const apprentices = activeStaff.filter(e => e.role === '學徒');
    let M = manicurists.length; let targets = { F79: 3, G2: 3, GK3: 3, G38: 3 };
    if (M <= 11) {
        targets.F79 = 2; let rem = M - 2; targets.G2 = Math.max(0, Math.min(3, rem)); rem -= targets.G2; targets.GK3 = Math.max(0, Math.min(3, rem)); rem -= targets.GK3; targets.G38 = Math.max(0, Math.min(3, rem)); rem -= targets.G38;
    } else {
        targets.F79 = 3; targets.GK3 = 3; let surplus = M - 12; let baseSurplus = Math.floor(surplus / 2); let remSurplus = surplus % 2; targets.G2 = 3 + baseSurplus + remSurplus; targets.G38 = 3 + baseSurplus;
    }
    let sortedMani = [...manicurists].sort((a,b) => (a.p_shops || 'G2').split(',').length - (b.p_shops || 'G2').split(',').length); let assignment = {}; let currentCounts = { F79: 0, GK3: 0, G38: 0, G2: 0 }; let unassignedMani = [];
    sortedMani.forEach(emp => { let allowed = (emp.p_shops || 'G2').split(',').map(s => s.trim()); let primaryShop = allowed[0] || 'G2'; if (currentCounts[primaryShop] < targets[primaryShop]) { currentCounts[primaryShop]++; assignment[emp.name] = primaryShop; } else { unassignedMani.push(emp); } });
    unassignedMani.forEach(emp => { let allowed = (emp.p_shops || 'G2').split(',').map(s => s.trim()); let assigned = false; for (let shop of allowed) { if (currentCounts[shop] < targets[shop]) { currentCounts[shop]++; assignment[emp.name] = shop; assigned = true; break; } } if (!assigned) { let primaryShop = allowed[0] || 'G2'; currentCounts[primaryShop]++; assignment[emp.name] = primaryShop; } });
    apprentices.forEach(app => { let allowed = (app.p_shops || 'G2').split(',').map(s => s.trim()); let bestShop = allowed[0] || 'G2'; let minCount = 999; for(let shop of allowed) { if(currentCounts[shop] < minCount) { minCount = currentCounts[shop]; bestShop = shop; } } assignment[app.name] = bestShop; currentCounts[bestShop]++; });
    let shopGroups = { F79: [], GK3: [], G38: [], G2: [] }; activeStaff.forEach(emp => { let shop = assignment[emp.name] || 'G2'; shopGroups[shop].push(emp); });
    shopGroups.F79.forEach((emp, idx) => { let shift = (idx === 0) ? "早班" : "晚班"; let t = autoExtractTime(emp, shift, isSun, 'F79'); report.F79.push({ name: emp.name, time: t }); });
    ['G2', 'GK3', 'G38'].forEach(shop => {
        let list = shopGroups[shop]; if (list.length === 0) return;
        let earlyIdx = list.findIndex(emp => emp.role !== '學徒' && (emp.times || '').split(',').map(t => t.trim()).some(t => parseInt(t.split(':')[0]) < 12)); if (earlyIdx === -1) earlyIdx = 0; let earlyEmp = list[earlyIdx]; let remainingWorkers = list.filter((_, idx) => idx !== earlyIdx);
        let earlyTime = autoExtractTime(earlyEmp, '早班', isSun, shop); report[shop].push({ name: earlyEmp.name, time: earlyTime });
        remainingWorkers.forEach((emp, remIdx) => { let shift = isSun ? "中班" : ((remIdx < Math.ceil(remainingWorkers.length / 2)) ? "中班" : "晚班"); let t = autoExtractTime(emp, shift, isSun, shop); report[shop].push({ name: emp.name, time: t }); });
    });
    ['F79', 'GK3', 'G38', 'G2'].forEach(shop => { while(report[shop].length < 6) { report[shop].push({ name: '', time: '' }); } }); return { report, manicuristCount: M, totalCount: activeStaff.length };
}

function autoExtractTime(emp, shift, isSun, shop) {
    if (shop === 'F79') return (shift === '早班') ? (isSun ? '11:00' : '12:00') : '13:00';
    let userTimes = (emp.times || '').split(',').map(t => t.trim()); if (isSun) return (shift === '早班') ? '10:00' : '12:00';
    let primaryTime = userTimes[0] || '12:00'; let primaryHour = parseInt(primaryTime.split(':')[0]);
    if (shift === '早班') { return primaryHour < 12 ? primaryTime : (userTimes.find(t => parseInt(t.split(':')[0]) < 12) || '11:00'); } 
    else if (shift === '中班') { return primaryHour === 12 ? primaryTime : (userTimes.find(t => t === '12:00') || '12:00'); } 
    else { return primaryHour >= 13 ? primaryTime : (userTimes.find(t => parseInt(t.split(':')[0]) >= 13) || '13:00'); }
}

// ==================== 💾 備份數據封包 ====================
function downloadTimeCapsuleBackup() {
    const monthKey = `${state.currentYear}-${state.currentMonth < 10 ? '0'+state.currentMonth : state.currentMonth}`;
    const backupPackage = { v8_employees: state.employees, v8_holidays: state.holidays, v8_overrides: state.overrides, v8_settings: state.settings, v8_special_notes: state.notes };
    const blob = new Blob([JSON.stringify(backupPackage, null, 2)], { type: 'text/plain' });
    const anchor = document.createElement('a'); anchor.download = `Crystal_Pavilion_V10_Backup_[${monthKey}].txt`; anchor.href = window.URL.createObjectURL(blob); anchor.click();
}
function triggerBackupUploadClick() { document.getElementById('time-capsule-file-injector').click(); }
function restoreFromTimeCapsule(event) {
    const file = event.target.files[0]; if (!file) return; const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const pkg = JSON.parse(e.target.result); if (!pkg.v8_employees || !pkg.v8_holidays) { alert('❌ 備份檔格式不符！'); return; }
            if (confirm('確定要一鍵還原雲端所有資料？')) {
                const monthKey = `${state.currentYear}-${state.currentMonth < 10 ? '0'+state.currentMonth : state.currentMonth}`;
                if (isCloudMode && database) { 
                    database.ref('v8_employees').set(pkg.v8_employees); database.ref(`v8_holidays/${monthKey}`).set(pkg.v8_holidays); 
                    database.ref(`v8_overrides/${monthKey}`).set(pkg.v8_overrides || {}); database.ref(`v8_special_notes/${monthKey}`).set(pkg.v8_special_notes || {});
                    if(pkg.v8_settings) database.ref('v8_settings').set(pkg.v8_settings); alert('🟢 已完美還原覆蓋雲端！'); 
                } 
            }
        } catch(err) { alert('讀取檔案失敗。'); }
    }; reader.readAsText(file);
}

function calculateAutoDefaultDate() {
    const now = new Date(); let year = now.getFullYear(); let month = now.getMonth() + 1; let day = now.getDate(); let hour = now.getHours(); let isJumped = false;
    if (hour >= 20) { isJumped = true; const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000); year = tomorrow.getFullYear(); month = tomorrow.getMonth() + 1; day = tomorrow.getDate(); }
    state.currentYear = year; state.currentMonth = month; state.currentDay = day;
    const hintBanner = document.getElementById('time-switch-hint');
    if (hintBanner) {
        if (isJumped) { hintBanner.innerHTML = `🕗 系統提示：已過夜間 20:00，已自動預載【明天 ${month}月${day}日】排班表`; hintBanner.style.color = "#ea580c"; } 
        else { hintBanner.innerHTML = `🌞 系統提示：目前為日間時段，正顯示【今日 ${month}月${day}日】排班表`; hintBanner.style.color = "#059669"; }
    }
}

function loadLocalFallbackContext() {
    calculateAutoDefaultDate(); const y = state.currentYear; const m = state.currentMonth; const monthKey = `${y}-${m < 10 ? '0'+m : m}`;
    state.employees = JSON.parse(localStorage.getItem('v8_employees')) || JSON.parse(JSON.stringify(defaultEmployees));
    state.overrides = JSON.parse(localStorage.getItem(`v8_overrides_${monthKey}`)) || {};
    state.holidays = JSON.parse(localStorage.getItem(`v8_holidays_${monthKey}`)) || JSON.parse(JSON.stringify(defaultHolidaysData));
    state.notes = JSON.parse(localStorage.getItem(`v8_notes_${monthKey}`)) || {};
    state.localHolidaysDraft = JSON.parse(JSON.stringify(state.holidays));
    cloudLoads = { emp: true, hol: true, ovr: true, note: true }; triggerSafeUIRender();
}

function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none'); document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
    document.getElementById(tabId).style.display = 'block'; const navBtn = document.getElementById('nav-' + tabId.replace('tab-', '')); if(navBtn) navBtn.classList.add('active');
    if(tabId === 'tab-schedule') runScheduler(); if(tabId === 'tab-my-month') renderIndividualMonthCalendar(); if(tabId === 'tab-analysis') renderMonthlyAnalysis();
}

function triggerSafeUIRender() {
    if(cloudLoads.emp && cloudLoads.hol && cloudLoads.ovr && cloudLoads.note) {
        state.employees.forEach(e => { if(!state.holidays[e.name]) state.holidays[e.name] = []; if(!state.localHolidaysDraft[e.name]) state.localHolidaysDraft[e.name] = []; });
        renderEmployeeTable(); populateStaffDropdown(); renderMonthlyAnalysis(); renderIndividualMonthCalendar(); renderHolidayTable();
        const ind = document.getElementById('cloud-indicator'); if(ind && isCloudMode) { ind.className = "cloud-status status-online"; ind.innerText = "🟢 雲端連線成功！跨月份智能排班大腦運作中"; }
        runScheduler();
    }
}

function showToastMessage(msg) {
    const toast = document.createElement('div');
    toast.style.cssText = "position:fixed; bottom:30px; left:50%; transform:translateX(-50%); background:#1e293b; color:white; border:1px solid #db2777; padding:12px 24px; border-radius:12px; font-weight:bold; font-size:13px; box-shadow:0 10px 15px -3px rgba(0,0,0,0.3); z-index:999999; text-align:center;";
    toast.innerText = msg;
    document.body.appendChild(toast);
    setTimeout(() => { toast.remove(); }, 3000);
}

// ==================== 🛠️ 自訂初始化綁定器 (頁面加載完成時執行) ====================
document.addEventListener('DOMContentLoaded', () => {
    // 綁定人手不足 Modal 的確認與取消按鈕
    const warnCancel = document.getElementById('warning-cancel-btn');
    const warnConfirm = document.getElementById('warning-confirm-btn');
    if (warnCancel) {
        warnCancel.addEventListener('click', () => {
            const modal = document.getElementById('manpower-warning-modal');
            if (modal) modal.style.setProperty('display', 'none', 'important');
            pendingConfirmCallback = null;
        });
    }
    if (warnConfirm) {
        warnConfirm.addEventListener('click', () => {
            const modal = document.getElementById('manpower-warning-modal');
            if (modal) modal.style.setProperty('display', 'none', 'important');
            if (pendingConfirmCallback) {
                pendingConfirmCallback();
                pendingConfirmCallback = null;
            }
        });
    }

    // 重置並綁定個人排班儲存按鈕的 Click 攔截（強制原因備註）
    const saveBtn = document.getElementById('my-month-save-btn');
    if (saveBtn) {
        saveBtn.onclick = null; // 抹除行內
        saveBtn.addEventListener('click', function() {
            let checkFailed = false;
            const rows = document.querySelectorAll('#my-month-calendar-body tr');
            rows.forEach(tr => {
                const remarkInput = tr.querySelector('.calendar-special-note-input');
                if (remarkInput && remarkInput.classList.contains('reason-required')) {
                    const val = remarkInput.value.trim();
                    if (!val) {
                        remarkInput.style.setProperty('border', '2px solid #dc2626', 'important');
                        remarkInput.placeholder = "⚠️ 本日人手不足，必須填寫請假理由！";
                        checkFailed = true;
                    }
                }
            });

            if (checkFailed) {
                alert("❌ 儲存失敗：部分放假申請日期店內人手不足，請在備註欄填寫理由後再點擊儲存！");
            } else {
                saveSpecialNotesAndHolidaysData();
            }
        });
    }
});

// ==================== 🚀 啟動入口 ====================
calculateAutoDefaultDate(); 
initYearMonthDropdowns();

if (typeof firebase !== 'undefined' && typeof firebaseConfig !== 'undefined') {
    try {
        if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
        database = firebase.database();
        database.ref(".info/connected").on("value", function(snap) { 
            if (snap.val() === true) { 
                isCloudMode = true; 
                setupSettingsListener(); 
                handleDateContextChange(); 
            } 
        });
    } catch(e) { isCloudMode = false; }
}

setTimeout(function() {
    if (!isCloudMode) {
        const ind = document.getElementById('cloud-indicator'); if(ind) { ind.className = "cloud-status status-offline"; ind.innerText = "⚠️ 獨立離線模式下運作（本地快取保護中）"; }
        state.settings = JSON.parse(localStorage.getItem('v8_settings')) || JSON.parse(JSON.stringify(defaultSystemSettings)); applyDynamicSettingsToUI(); loadLocalFallbackContext();
    }
}, 1500);

// 常規拉齊維護
setInterval(() => {
    initializeMyMonthSelectors();
    syncMainToMyMonthDate();
}, 100);

```
