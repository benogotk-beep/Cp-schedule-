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
    lockDay: 26, maxFtLeave: 5, maxPtLeave: 20, limitLow: 12, limitHigh: 15
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

function triggerGateLogin() {
    const inputPass = document.getElementById('global-pass-input').value.trim();
    const hint = document.getElementById('login-fail-hint');
    if (inputPass === state.settings.passManager) {
        state.currentRole = 'manager'; document.body.classList.add('is-manager');
        document.getElementById('login-overlay').style.display = 'none'; document.getElementById('main-system-tab-bar').style.display = 'flex';
        document.getElementById('role-display-text').innerText = "👑 權限狀態：最高管理層模式（全系統已解鎖）";
        document.getElementById('nav-analysis').style.display = 'block'; document.getElementById('nav-employees').style.display = 'block';
        document.getElementById('nav-holidays').style.display = 'block'; document.getElementById('nav-approval-center').style.display = 'block';
        document.getElementById('nav-settings').style.display = 'block'; document.getElementById('manager-backup-zone').style.display = 'block';
        document.getElementById('btn-restore-auto-id').style.display = 'inline-block'; hint.style.display = 'none'; switchTab('tab-schedule');
    } else if (inputPass === state.settings.passEmployee) {
        state.currentRole = 'employee'; document.body.classList.remove('is-manager');
        document.getElementById('login-overlay').style.display = 'none'; document.getElementById('main-system-tab-bar').style.display = 'flex';
        document.getElementById('role-display-text').innerText = "🔑 目前權限：普通員工模式（⚠️ 安全防線運作中）";
        document.getElementById('nav-analysis').style.display = 'none'; document.getElementById('nav-employees').style.display = 'none';
        document.getElementById('nav-holidays').style.display = 'none'; document.getElementById('nav-approval-center').style.display = 'none';
        document.getElementById('nav-settings').style.display = 'none'; document.getElementById('manager-backup-zone').style.display = 'none';
        document.getElementById('btn-restore-auto-id').style.display = 'none'; hint.style.display = 'none'; switchTab('tab-schedule');
    } else { hint.style.display = 'block'; }
}

function triggerGlobalLogout() {
    state.currentRole = 'none'; document.body.classList.remove('is-manager'); document.getElementById('global-pass-input').value = '';
    document.getElementById('login-overlay').style.display = 'flex'; document.getElementById('main-system-tab-bar').style.display = 'none';
    document.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none'); document.getElementById('role-display-text').innerText = "🔑 目前權限：未登入";
}

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
    document.getElementById('cfg-limit-low').value = state.settings.limitLow || 12;
    document.getElementById('cfg-limit-high').value = state.settings.limitHigh || 15;
    document.title = state.settings.webTitle; document.getElementById('web-title-tag').innerText = state.settings.webTitle;
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
        database.ref('v8_settings').set(state.settings).then(() => { alert('⚙️ 全局配置已成功發佈至雲端！'); });
    } else {
        localStorage.setItem('v8_settings', JSON.stringify(state.settings)); alert('💾 配置已成功儲存至本地快取中！'); applyDynamicSettingsToUI();
    }
}

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
    if (idx > -1) { state.localHolidaysDraft[name].splice(idx, 1); btn.classList.remove('active'); } else { state.localHolidaysDraft[name].push(day); btn.classList.add('active'); }
    setTimeout(renderIndividualMonthCalendar, 100);
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
    empRef.on('value', (snapshot) => { state.employees = snapshot.exists() ? snapshot.val() : JSON.parse(JSON.stringify(defaultEmployees)); cloudLoads.emp = true; triggerSafeUIRender(); });
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
    let requiresApproval = false; let shortageTriggered = false; let limitShortageDay = null;
    if (!isManager) {
        const draftHols = state.localHolidaysDraft[staffName] || [];
        for(let d of draftHols) {
            let dayReport = state.overrides[`day_${d}`] || calculateDaySchedule(d).report; let activeUniqueManiSet = new Set();
            ['F79', 'GK3', 'G38', 'G2'].forEach(s => { dayReport[s].forEach(slot => { if(slot.name) { const staff = state.employees.find(e => e.name.replace(/\s+/g, '') === slot.name.replace(/\s+/g, '')); if(staff && staff.role !== '學徒') activeUniqueManiSet.add(staff.name); } }); });
            if (activeUniqueManiSet.size <= state.settings.limitLow + 1) { shortageTriggered = true; limitShortageDay = d; break; }
        }
        let limitYear = realYearNum; let limitMonth = realMonthNum + 1; if (limitMonth > 12) { limitMonth = 1; limitYear += 1; }
        if (realDayNum >= state.settings.lockDay && (state.currentYear < limitYear || (state.currentYear === limitYear && state.currentMonth <= limitMonth))) { requiresApproval = true; }
        if (shortageTriggered) requiresApproval = true;
    }
    if (requiresApproval) {
        if (isCloudMode && database) {
            let activeReasonNotes = {}; (state.localHolidaysDraft[staffName] || []).forEach(d => { let r = state.notes[staffName][`day_${d}`] || ''; if(r) activeReasonNotes[`day_${d}`] = r; });
            database.ref(`v8_pending_approvals/${monthKey}`).push({ name: staffName, requestedHolidays: state.localHolidaysDraft[staffName] || [], reasons: activeReasonNotes, timestamp: firebase.database.ServerValue.TIMESTAMP });
            database.ref(`v8_special_notes/${monthKey}/${staffName}`).set(state.notes[staffName]); alert(`⏳ 送往審批中心等待覆核。`);
        }
    } else {
        state.holidays[staffName] = JSON.parse(JSON.stringify(state.localHolidaysDraft[staffName]));
        if (isCloudMode && database) { database.ref(`v8_holidays/${monthKey}/${staffName}`).set(state.holidays[staffName]); database.ref(`v8_special_notes/${monthKey}/${staffName}`).set(state.notes[staffName]); alert(`🟢 變更成功！`); } 
        else { localStorage.setItem(`v8_holidays_${monthKey}`, JSON.stringify(state.holidays)); localStorage.setItem(`v8_notes_${monthKey}`, JSON.stringify(state.notes)); alert(`💾 本地儲存成功！`); runScheduler(); }
    }
}

function renderPendingApprovalsBox() {
    const container = document.getElementById('smart-approval-list-container'); if(!container) return; const quickDot = document.getElementById('quick-notify-dot'); container.innerHTML = ''; const keys = Object.keys(state.pendingApprovals);
    if (keys.length === 0) { container.innerHTML = `<div style="text-align:center; padding:30px; color:#9ca3af; font-weight:bold;">🙌 目前沒有待審批申請。</div>`; if(quickDot) quickDot.style.display = 'none'; return; }
    if(quickDot) quickDot.style.display = 'inline-block';
    keys.forEach(k => {
        const item = state.pendingApprovals[k]; let staffName = item.name; let draftHols = item.requestedHolidays || []; let reasonsObj = item.reasons || {}; let cardsHtml = '';
        draftHols.forEach(d => {
            let dayReport = state.overrides[`day_${d}`] || calculateDaySchedule(d).report; let totalManiSet = new Set(); let totalAppCount = 0; let shopImpact = { F79:0, GK3:0, G38:0, G2:0 };
            ['F79', 'GK3', 'G38', 'G2'].forEach(s => { dayReport[s].forEach(slot => { if(slot.name) { const staff = state.employees.find(e => e.name.replace(/\s+/g, '') === slot.name.replace(/\s+/g, '')); if(staff) { if(staff.role === '學徒') totalAppCount++; else { totalManiSet.add(staff.name); shopImpact[s]++; } } } }); });
            let isAlert = totalManiSet.size <= state.settings.limitLow ? 'background:#fde8e8; color:#9b1c1c;' : 'background:#f0fdf4; color:#03543f;';
            cardsHtml += `<div class="decision-info-block" style="margin-bottom:8px;"><b>📅 ${d} 號 (星期${getDayOfWeekText(state.currentYear, state.currentMonth, d)})</b><div style="padding:4px 8px; border-radius:6px; font-size:11px; ${isAlert}">美甲師 <b>${totalManiSet.size}</b> 人 ｜ 學徒 <b>${totalAppCount}</b> 人</div><div style="font-size:11px; color:#ea580c;">📝 備註：${reasonsObj[`day_${d}`] || '(無)'}</div></div>`;
        });
        container.innerHTML += `<div class="decision-card"><div class="decision-header"><div><b>👤 申請人：${staffName}</b></div><div style="display:flex; gap:6px;"><button class="btn" style="background:var(--success); color:white;" onclick="actionApproveHoliday('${k}', '${staffName}', [${draftHols}])">批准</button><button class="btn" style="background:var(--danger); color:white;" onclick="database.ref('v8_pending_approvals/${state.currentYear}-${state.currentMonth < 10 ? '0'+state.currentMonth : state.currentMonth}/${k}').remove()">拒絕</button></div></div><div class="decision-grid">${cardsHtml}</div></div>`;
    });
}

function actionApproveHoliday(key, name, hols) {
    const monthKey = `${state.currentYear}-${state.currentMonth < 10 ? '0'+state.currentMonth : state.currentMonth}`; state.holidays[name] = hols; state.localHolidaysDraft[name] = hols;
    if(database) database.ref(`v8_holidays/${monthKey}/${name}`).set(hols).then(() => { database.ref(`v8_pending_approvals/${monthKey}/${key}`).remove(); alert(`🟢 已核准發佈！`); });
}

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

function renderEmployeeTable() {
    const tbody = document.getElementById('employee-table-body'); if(!tbody) return; tbody.innerHTML = ''; const isReadonly = (state.currentRole !== 'manager') ? 'disabled' : '';
    state.employees.forEach((emp) => {
        let currentRole = emp.role || 'Full-time';
        tbody.innerHTML += `<tr><td><input type="text" class="emp-name-input" ${isReadonly} value="${emp.name}"></td><td><select class="emp-type-select" ${isReadonly}><option value="Full-time" ${currentRole === 'Full-time' ? 'selected' : ''}>Full-time</option><option value="Part-time" ${currentRole === 'Part-time' ? 'selected' : ''}>Part-time</option><option value="學徒" ${currentRole === '學徒' ? 'selected' : ''}>學徒</option></select></td><td><input type="text" class="emp-shops-input" ${isReadonly} value="${emp.p_shops || ''}"></td><td><input type="text" class="emp-times-input" ${isReadonly} value="${emp.times || ''}"></td><td><button class="btn btn-del" ${isReadonly} onclick="this.closest('tr').remove()">刪除</button></td></tr>`;
    });
}

function addEmployeeRow() {
    if(state.currentRole !== 'manager') return; const tbody = document.getElementById('employee-table-body'); if(!tbody) return;
    tbody.innerHTML += `<tr><td><input type="text" class="emp-name-input" placeholder="新名字"></td><td><select class="emp-type-select"><option value="Full-time" selected>Full-time</option><option value="Part-time">Part-time</option><option value="學徒">學徒</option></select></td><td><input type="text" class="emp-shops-input" value="G2, G38, GK3"></td><td><input type="text" class="emp-times-input" value="11:00, 12:00, 13:00"></td><td><button class="btn btn-del" onclick="this.closest('tr').remove()">刪除</button></td></tr>`;
}

function saveEmployeeData() {
    if (state.currentRole !== 'manager') return; const rows = document.querySelectorAll('#employee-table-body tr'); let newEmps = [];
    rows.forEach(row => { const name = row.querySelector('.emp-name-input').value.trim(); if(!name) return; newEmps.push({ name, role: row.querySelector('.emp-type-select').value, p_shops: row.querySelector('.emp-shops-input').value, times: row.querySelector('.emp-times-input').value }); });
    state.employees = newEmps;
    if(isCloudMode && database) { database.ref(`v8_employees`).set(state.employees); alert('👥 員工名單變更成功！'); } 
    else { localStorage.setItem('v8_employees', JSON.stringify(state.employees)); alert('💾 本地儲存成功！'); populateStaffDropdown(); }
}

function saveHolidayData() {
    if(state.currentRole !== 'manager') return; const monthKey = `${state.currentYear}-${state.currentMonth < 10 ? '0'+state.currentMonth : state.currentMonth}`;
    if(isCloudMode && database) { database.ref(`v8_holidays/${monthKey}`).set(state.holidays); alert('🏖️ 放假大表已同步發佈！'); } 
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

calculateAutoDefaultDate(); initYearMonthDropdowns();
if (typeof firebase !== 'undefined' && typeof firebaseConfig !== 'undefined') {
    try {
        if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
        database = firebase.database();
        database.ref(".info/connected").on("value", function(snap) { if (snap.val() === true) { isCloudMode = true; setupSettingsListener(); handleDateContextChange(); } });
    } catch(e) { isCloudMode = false; }
}
setTimeout(function() {
    if (!isCloudMode) {
        const ind = document.getElementById('cloud-indicator'); if(ind) { ind.className = "cloud-status status-offline"; ind.innerText = "⚠️ 獨立離線模式下運作（本地快取保護中）"; }
        state.settings = JSON.parse(localStorage.getItem('v8_settings')) || JSON.parse(JSON.stringify(defaultSystemSettings)); applyDynamicSettingsToUI(); loadLocalFallbackContext();
    }
}, 1500);

