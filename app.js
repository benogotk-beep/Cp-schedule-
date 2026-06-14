
// 🔮 雲端資料庫連線鎖匙 (與分店智能主機 100% 保持一致)
window.firebaseConfig = {
    apiKey: "AIzaSyCsfaqMDLYAxXMW5ivDHAgJEwnFA5MuvqM",
    authDomain: "cp-schedule.firebaseapp.com",
    databaseURL: "https://cp-schedule-default-rtdb.firebaseio.com/",
    projectId: "cp-schedule",
    storageBucket: "cp-schedule.firebasestorage.app",
    messagingSenderId: "136891249500",
    appId: "1:136891249500:web:f3278b3ce642dc8d454799",
    measurementId: "G-W0L45WCMV2"
};

// 1. 預設工號與密碼對應表
window.defaultStaffIds = {
    "阿平": "101", "RUBY": "102", "如意": "103", "影": "105", "慧嫻": "106",
    "二妹": "107", "TT": "108", "Cici": "109", "CICI": "109", "珍": "110", "Jackie": "111", "JACKIE": "111",
    "澄澄": "113", "ALICE": "115", "阿璇": "116", "Mandy婷": "117", "MANDY婷": "117", "妙妙": "118",
    "葉子": "119", "Lucia": "120", "LUCIA": "120", "AMY": "121", "小茹": "122", "文君": "123"
};

// 2. 預設備份員工名單 (在雲端數據尚未加載完成或處於離線狀態時自動啟用)
window.defaultEmployees = [
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

// 3. 預設原始放假數據 (僅作為離線備用)
window.defaultHolidaysData = {
    "ALICE": [8, 17, 27, 7], "AMY": [9, 18, 19, 20, 1, 2, 3, 4], 
    "Jackie": [1, 2, 3, 7, 8, 9, 10, 14, 15, 19, 20, 21, 22, 23, 24, 28, 29], 
    "Lucia": [19, 27, 28], "Mandy婷": [5, 12, 19, 20, 21, 28], 
    "RUBY": [1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 16, 17, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30], 
    "TT": [2, 3, 4, 7, 9, 10, 11, 12, 14, 16, 17, 18, 19, 21, 22, 23, 24, 25, 26, 28, 30], 
    "二妹": [2, 3], "如意": [2, 3, 8, 10, 11, 17, 24, 30], "妙妙": [4, 16, 23, 24, 30, 12], 
    "小茹": [3, 4], "影": [13, 14, 15, 16, 10], "慧嫻": [6, 7, 21, 22, 15, 29], 
    "澄澄": [3, 4, 17, 18], "葉子": [29, 30], "阿平": [1, 2, 3, 4, 5, 6, 7], "阿璇": [13, 14, 15, 16], "Cici": [], "珍": [], "文君": []
};

// 4. 預設全域系統微調設定
window.defaultSystemSettings = {
    passManager: "8888", passEmployee: "1234", webTitle: "分店智能排班系統 V10.0",
    lockDay: 26, maxFtLeave: 5, maxPtLeave: 20, limitLow: 3, limitHigh: 5
};

// 5. 系統大腦核心狀態變數
window.database = null; 
window.isCloudMode = false;
window.state = { 
    employees: [], currentYear: 2026, currentMonth: 5, currentDay: 1, 
    holidays: {}, overrides: {}, notes: {}, pendingApprovals: {}, 
    currentRole: 'none', localHolidaysDraft: {}, settings: JSON.parse(JSON.stringify(window.defaultSystemSettings))
};

window.empRef = null; window.holRef = null; window.ovrRef = null; 
window.appRef = null; window.noteRef = null; window.cfgRef = null;
window.cloudLoads = { emp: false, hol: false, ovr: false, note: false };
window.draggedSourceData = null;

// ==================== ⚙️ 系統核心微調參數與同步監聽 ====================
window.setupSettingsListener = function() {
    if(!window.database || !window.isCloudMode) return;
    window.cfgRef = window.database.ref('v8_settings');
    window.cfgRef.on('value', (snapshot) => {
        window.state.settings = snapshot.exists() ? Object.assign({}, window.defaultSystemSettings, snapshot.val()) : JSON.parse(JSON.stringify(window.defaultSystemSettings));
        window.applyDynamicSettingsToUI();
    });
};

window.applyDynamicSettingsToUI = function() {
    // 🛡️ 安全 DOM 哨兵守衛，防止 Null TypeError 造成執行序中斷崩潰
    const cfgMgr = document.getElementById('cfg-pass-manager');
    const cfgEmp = document.getElementById('cfg-pass-employee');
    const cfgTitle = document.getElementById('cfg-web-title');
    const cfgLock = document.getElementById('cfg-lock-day');
    const cfgMaxFt = document.getElementById('cfg-max-ft-leave');
    const cfgMaxPt = document.getElementById('cfg-max-pt-leave');
    const cfgLimitL = document.getElementById('cfg-limit-low');
    const cfgLimitH = document.getElementById('cfg-limit-high');

    if (cfgMgr) cfgMgr.value = window.state.settings.passManager || "8888";
    if (cfgEmp) cfgEmp.value = window.state.settings.passEmployee || "1234";
    if (cfgTitle) cfgTitle.value = window.state.settings.webTitle || "分店智能排班系統 V10.0";
    if (cfgLock) cfgLock.value = window.state.settings.lockDay || 26;
    if (cfgMaxFt) cfgMaxFt.value = window.state.settings.maxFtLeave || 5;
    if (cfgMaxPt) cfgMaxPt.value = window.state.settings.maxPtLeave || 20;
    if (cfgLimitL) cfgLimitL.value = window.state.settings.limitLow || 3;
    if (cfgLimitH) cfgLimitH.value = window.state.settings.limitHigh || 5;
    
    document.title = window.state.settings.webTitle; 
    const webTag = document.getElementById('web-title-tag');
    const loginTitle = document.getElementById('login-box-title');
    const mainTitle = document.getElementById('page-main-title');

    if (webTag) webTag.innerText = window.state.settings.webTitle;
    if (loginTitle) loginTitle.innerText = window.state.settings.webTitle;
    if (mainTitle) mainTitle.innerHTML = `${window.state.settings.webTitle} <span style="color:var(--warning);">[動態體]</span>`;
    
    if (window.cloudLoads.emp && window.cloudLoads.hol && window.cloudLoads.ovr && window.cloudLoads.note) {
        window.runScheduler();
    }
};

window.saveGlobalSystemSettings = function() {
    if (window.state.currentRole !== 'manager') return;
    
    const cfgMgrVal = document.getElementById('cfg-pass-manager')?.value.trim();
    const cfgEmpVal = document.getElementById('cfg-pass-employee')?.value.trim();
    const cfgTitleVal = document.getElementById('cfg-web-title')?.value.trim();
    const cfgLockVal = parseInt(document.getElementById('cfg-lock-day')?.value || 26);
    const cfgMaxFtVal = parseInt(document.getElementById('cfg-max-ft-leave')?.value || 5);
    const cfgMaxPtVal = parseInt(document.getElementById('cfg-max-pt-leave')?.value || 20);
    const cfgLimitLVal = parseInt(document.getElementById('cfg-limit-low')?.value || 3);
    const cfgLimitHVal = parseInt(document.getElementById('cfg-limit-high')?.value || 5);

    window.state.settings = {
        passManager: cfgMgrVal,
        passEmployee: cfgEmpVal,
        webTitle: cfgTitleVal,
        lockDay: cfgLockVal,
        maxFtLeave: cfgMaxFtVal,
        maxPtLeave: cfgMaxPtVal,
        limitLow: cfgLimitLVal,
        limitHigh: cfgLimitHVal
    };

    if (window.isCloudMode && window.database) {
        window.database.ref('v8_settings').set(window.state.settings).then(() => { 
            showToastMessage('⚙️ 全局配置已成功發佈至雲端！'); 
        });
    } else {
        localStorage.setItem('v8_settings', JSON.stringify(window.state.settings)); 
        showToastMessage('💾 配置已成功儲存至本地快取中！'); 
        window.applyDynamicSettingsToUI();
    }
};

// ==================== 📅 每日排班沙盒渲染與拖拽 ====================
window.generateTimeOptions = function(selectedValue) {
    let optionsHtml = `<option value="">無班次</option>`; 
    let tClean = selectedValue || '';
    if (tClean.includes('(')) { 
        let matches = tClean.match(/\(([^)]+)\)/); 
        if (matches && matches[1]) tClean = matches[1]; 
    }
    tClean = tClean.trim();
    for (let h = 9; h <= 19; h++) {
        ['00', '30'].forEach(m => {
            let timeStr = `${h < 10 ? '0' + h : h}:${m}`; 
            let isSel = (tClean === timeStr) ? 'selected' : '';
            optionsHtml += `<option value="${timeStr}" ${isSel}>${timeStr}</option>`;
        });
    }
    return optionsHtml;
};

window.handleSlotDragStart = function(e, shop, index) {
    const cacheInput = document.getElementById('current-rendered-data-cache');
    if (!cacheInput) return;
    let report = JSON.parse(cacheInput.value);
    window.draggedSourceData = { shop: shop, index: index, payload: report[shop][index] }; 
    e.currentTarget.classList.add('dragging'); 
    e.dataTransfer.effectAllowed = 'move';
};

window.handleSlotDragOver = function(e) { 
    e.preventDefault(); 
    e.currentTarget.classList.add('drag-over'); 
};

window.handleSlotDragLeave = function(e) { 
    e.currentTarget.classList.remove('drag-over'); 
};

window.handleSlotDrop = function(e, targetShop, targetIndex) {
    e.preventDefault(); 
    e.currentTarget.classList.remove('drag-over'); 
    document.querySelectorAll('.slot-box').forEach(el => el.classList.remove('dragging'));
    if (!window.draggedSourceData) return; 
    
    const sourceShop = window.draggedSourceData.shop; 
    const sourceIndex = window.draggedSourceData.index; 
    if (sourceShop === targetShop && sourceIndex === targetIndex) return;
    
    const dayKey = `day_${window.state.currentDay}`; 
    const cacheInput = document.getElementById('current-rendered-data-cache');
    if (!cacheInput) return;

    if (!window.state.overrides[dayKey]) { 
        window.state.overrides[dayKey] = JSON.parse(cacheInput.value); 
    }
    let temp = window.state.overrides[dayKey][targetShop][targetIndex]; 
    window.state.overrides[dayKey][targetShop][targetIndex] = window.state.overrides[dayKey][sourceShop][sourceIndex]; 
    window.state.overrides[dayKey][sourceShop][sourceIndex] = temp;
    
    const monthKey = `${window.state.currentYear}-${window.state.currentMonth < 10 ? '0'+window.state.currentMonth : window.state.currentMonth}`;
    if(window.isCloudMode && window.database) { 
        window.database.ref(`v8_overrides/${monthKey}/${dayKey}`).set(window.state.overrides[dayKey]); 
    } else { 
        localStorage.setItem(`v8_overrides_${monthKey}`, JSON.stringify(window.state.overrides)); 
        window.runScheduler(); 
    }
    window.draggedSourceData = null;
};

window.renderMonitorBadges = function(shopCounts) {
    const monitorPanel = document.getElementById('monitor-panel'); 
    if(!monitorPanel) return; 
    monitorPanel.innerHTML = '';
    ['F79', 'GK3', 'G38', 'G2'].forEach(shop => {
        const count = shopCounts[shop]; 
        let badgeClass = 'bg-ok'; 
        let txt = '正常';
        if(shop === 'F79') { 
            badgeClass = (count >= 2 && count <= 3) ? 'bg-ok' : 'bg-warn'; 
            txt = `指標:${count}人`; 
        } else { 
            if (count < 3) { 
                badgeClass = 'bg-warn'; 
                txt = '缺美甲師'; 
            } else if (count > 6) { 
                badgeClass = 'bg-low'; 
                txt = '爆人(多於6)'; 
            } 
        }
        monitorPanel.innerHTML += `<div class="badge ${badgeClass}"><div style="font-weight:bold;">${shop}</div><div style="font-size:18px; font-weight:900; margin:2px 0;">${count}人</div><div style="font-size:10px; opacity:0.8;">${txt}</div></div>`;
    });
};

window.setupFirebaseListeners = function() {
    if(!window.database || !window.isCloudMode) return; 
    const monthKey = `${window.state.currentYear}-${window.state.currentMonth < 10 ? '0'+window.state.currentMonth : window.state.currentMonth}`;
    window.cloudLoads = { emp: false, hol: false, ovr: false, note: false };
    
    if(window.empRef) window.empRef.off(); 
    if(window.holRef) window.holRef.off(); 
    if(window.ovrRef) window.ovrRef.off(); 
    if(window.appRef) window.appRef.off(); 
    if(window.noteRef) window.noteRef.off();
    
    window.empRef = window.database.ref('v8_employees');
    window.empRef.on('value', (snapshot) => { 
        const val = snapshot.exists() ? snapshot.val() : JSON.parse(JSON.stringify(window.defaultEmployees)); 
        window.state.employees = Array.isArray(val) ? val.filter(Boolean) : Object.values(val).filter(Boolean);
        window.cloudLoads.emp = true; 
        window.triggerSafeUIRender(); 
    });
    
    window.holRef = window.database.ref(`v8_holidays/${monthKey}`);
    window.holRef.on('value', (snapshot) => { 
        window.state.holidays = snapshot.exists() ? snapshot.val() : JSON.parse(JSON.stringify(window.defaultHolidaysData)); 
        window.state.localHolidaysDraft = JSON.parse(JSON.stringify(window.state.holidays)); 
        window.cloudLoads.hol = true; 
        window.triggerSafeUIRender(); 
    });
    
    window.ovrRef = window.database.ref(`v8_overrides/${monthKey}`);
    window.ovrRef.on('value', (snapshot) => { 
        window.state.overrides = snapshot.exists() ? snapshot.val() : {}; 
        window.cloudLoads.ovr = true; 
        window.triggerSafeUIRender(); 
    });
    
    window.noteRef = window.database.ref(`v8_special_notes/${monthKey}`);
    window.noteRef.on('value', (snapshot) => { 
        window.state.notes = snapshot.exists() ? snapshot.val() : {}; 
        window.cloudLoads.note = true; 
        window.triggerSafeUIRender(); 
    });
    
    window.appRef = window.database.ref(`v8_pending_approvals/${monthKey}`); 
    window.appRef.on('value', (snapshot) => { 
        window.state.pendingApprovals = snapshot.exists() ? snapshot.val() : {}; 
        if (typeof window.renderPendingApprovalsBox === 'function') {
            window.renderPendingApprovalsBox(); 
        }
    });
};

window.initYearMonthDropdowns = function() {
    const yrSel = document.getElementById('schedule-year-select'); 
    const moSel = document.getElementById('schedule-month-select'); 
    if(!yrSel || !moSel) return;
    
    yrSel.innerHTML = ''; 
    moSel.innerHTML = ''; 
    for(let y=2026; y<=2028; y++) { 
        yrSel.innerHTML += `<option value="${y}">${y} 年</option>`; 
    }
    for(let m=1; m<=12; m++) { 
        moSel.innerHTML += `<option value="${m}">${m} 月</option>`; 
    }
    yrSel.value = window.state.currentYear; 
    moSel.value = window.state.currentMonth; 
    window.syncDayDropdown();
};

window.syncDayDropdown = function() {
    const daySel = document.getElementById('schedule-day-select'); 
    if(!daySel) return; 
    daySel.innerHTML = ''; 
    let totalDays = window.getDaysInMonth(window.state.currentYear, window.state.currentMonth);
    for(let d = 1; d <= totalDays; d++) { 
        daySel.innerHTML += `<option value="${d}">${d} 日 (星期${window.getDayOfWeekText(window.state.currentYear, window.state.currentMonth, d)})</option>`; 
    }
    daySel.value = window.state.currentDay; 
    daySel.onchange = function() { 
        window.state.currentDay = parseInt(this.value); 
        window.runScheduler(); 
    };
};

window.handleDateContextChange = function() {
    const yrSel = document.getElementById('schedule-year-select'); 
    const moSel = document.getElementById('schedule-month-select'); 
    if(!yrSel || !moSel) return;
    
    window.state.currentYear = parseInt(yrSel.value) || 2026; 
    window.state.currentMonth = parseInt(moSel.value) || 5;
    
    if (window.database && window.isCloudMode) { 
        window.setupFirebaseListeners(); 
    } else { 
        window.loadLocalFallbackContext(); 
    }
    window.syncDayDropdown(); 
    
    const titleEl = document.getElementById('holiday-title-text'); 
    if(titleEl) titleEl.innerText = `${window.state.currentYear}年${window.state.currentMonth}月份放假表 (管理層大表)`;
};

window.populateStaffDropdown = function() {
    const sel = document.getElementById('my-month-staff-select'); 
    if(!sel) return; 
    const currentSelected = sel.value; 
    sel.innerHTML = '';
    window.state.employees.forEach(e => { 
        sel.innerHTML += `<option value="${e.name}">${e.name} [${e.role}]</option>`; 
    });
    if (currentSelected && window.state.employees.some(e => e.name === currentSelected)) { 
        sel.value = currentSelected; 
    }
};

window.getDaysInMonth = function(year, month) { return new Date(year, month, 0).getDate(); };
window.getDayOfWeekText = function(year, month, day) { return ['日', '一', '二', '三', '四', '五', '六'][new Date(year, month - 1, day).getDay()]; };
window.isSunday = function(year, month, day) { return new Date(year, month - 1, day).getDay() === 0; };

window.renderInteractiveReport = function(report) {
    let cacheInput = document.getElementById('current-rendered-data-cache');
    if(!cacheInput) { 
        cacheInput = document.createElement('input'); 
        cacheInput.id = 'current-rendered-data-cache'; 
        cacheInput.type = 'hidden'; 
        document.body.appendChild(cacheInput); 
    }
    cacheInput.value = JSON.stringify(report); 
    const reportContainer = document.getElementById('shops-report-container'); 
    if(!reportContainer) return; 
    reportContainer.innerHTML = '';
    
    const headerColors = { F79: '#4f46e5', GK3: '#9333ea', G38: '#d97706', G2: '#0d9488' };
    let nameOptionsHtml = `<option value="">-- 空缺 --</option>`; 
    window.state.employees.forEach(e => { nameOptionsHtml += `<option value="${e.name}">${e.name}</option>`; });
    
    const isManager = (window.state.currentRole === 'manager');
    ['F79', 'GK3', 'G38', 'G2'].forEach(shop => {
        let slotsHtml = '';
        for (let i = 0; i < 6; i++) {
            let slot = report[shop][i] || { name: '', time: '' }; 
            let currentSelectHtml = nameOptionsHtml.replace(`value="${slot.name}"`, `value="${slot.name}" selected`);
            const isDisabled = !isManager ? 'disabled style="opacity:0.8; background:#f3f4f6;"' : ''; 
            let noteTextHtml = '';
            
            if (slot.name && window.state.notes[slot.name] && window.state.notes[slot.name][`day_${window.state.currentDay}`]) { 
                noteTextHtml = `<div class="slot-note-text" title="${window.state.notes[slot.name][`day_${window.state.currentDay}`]}">📝 ${window.state.notes[slot.name][`day_${window.state.currentDay}`]}</div>`; 
            }
            let timeDropdownHtml = `<select class="manual-time-select" ${isDisabled} onchange="window.handleManualSlotChange('${shop}', ${i}, 'time', this.value)">${window.generateTimeOptions(slot.time)}</select>`;
            let dragAttributes = isManager ? `draggable="true" ondragstart="window.handleSlotDragStart(event, '${shop}', ${i})" ondragover="window.handleSlotDragOver(event)" ondragleave="window.handleSlotDragLeave(event)" ondrop="window.handleSlotDrop(event, '${shop}', ${i})"` : '';
            slotsHtml += `<div class="slot-box" ${dragAttributes} data-shop="${shop}" data-index="${i}"><select class="manual-name-select" ${isDisabled} onchange="window.handleManualSlotChange('${shop}', ${i}, 'name', this.value)">${currentSelectHtml}</select>${timeDropdownHtml}${noteTextHtml}</div>`;
        }
        let currentCount = 0; 
        report[shop].forEach(s => { if(s.name) currentCount++; });
        reportContainer.innerHTML += `<div class="shop-box"><div class="shop-header" style="background: ${headerColors[shop]};"><span>${shop} 店鋪</span><span>當前共：${currentCount} 人</span></div><div class="grid-6">${slotsHtml}</div></div>`;
    });
};

// ==================== 👤 個人當月排班月曆繪製 ====================
window.renderIndividualMonthCalendar = function() {
    const tbody = document.getElementById('my-month-calendar-body'); 
    if(!tbody) return; 
    tbody.innerHTML = ''; 
    const staffName = document.getElementById('my-month-staff-select')?.value; 
    if(!staffName) return;
    
    let totalDays = window.getDaysInMonth(window.state.currentYear, window.state.currentMonth); 
    const realToday = new Date(); 
    const realDayNum = realToday.getDate(); 
    const realMonthNum = realToday.getMonth() + 1; 
    const realYearNum = realToday.getFullYear(); 
    const isManager = (window.state.currentRole === 'manager');
    
    for (let d = 1; d <= totalDays; d++) {
        let isWknd = window.getDayOfWeekText(window.state.currentYear, window.state.currentMonth, d) === '日' ? 'background:#fef2f2; font-weight:bold; color:var(--danger);' : ''; 
        let assignedShop = '<span style="color:#9ca3af;">-</span>'; 
        let assignedTime = '<span style="color:#9ca3af;">-</span>';
        let isPastDay = (window.state.currentYear < realYearNum || (window.state.currentYear === realYearNum && window.state.currentMonth < realMonthNum) || (window.state.currentYear === realYearNum && window.state.currentMonth === realMonthNum && d < realDayNum));
        
        let dayKey = `day_${d}`; 
        let dayReport = window.state.overrides[dayKey] || window.calculateDaySchedule(d).report; 
        let activeUniqueManiSet = new Set();
        
        ['F79', 'GK3', 'G38', 'G2'].forEach(s => { 
            if (dayReport[s]) {
                dayReport[s].forEach(slot => { 
                    if(slot.name) { 
                        const staff = window.state.employees.find(e => e.name.replace(/\s+/g, '') === slot.name.replace(/\s+/g, '')); 
                        if(staff && staff.role !== '學徒') activeUniqueManiSet.add(staff.name); 
                    } 
                }); 
            }
        });
        
        let activeManiCount = activeUniqueManiSet.size; 
        const isHolidayDraft = (window.state.localHolidaysDraft[staffName] || []).includes(d);
        
        if (isHolidayDraft) { 
            assignedShop = '<span style="color:var(--danger); font-weight:bold;">放假要求 🏖️</span>'; 
            assignedTime = '<span style="color:var(--danger); font-size:11px;">(待存/放假)</span>'; 
        } else {
            ['F79', 'GK3', 'G38', 'G2'].forEach(s => { 
                if (dayReport[s]) { 
                    dayReport[s].forEach(slot => { 
                        if (slot.name && slot.name.replace(/\s+/g, '') === staffName.replace(/\s+/g, '')) { 
                            assignedShop = `<b style="color:var(--primary);">${s} 店</b>`; 
                            let tClean = slot.time; 
                            if(tClean.includes('(')) { 
                                let m = tClean.match(/\(([^)]+)\)/); 
                                if(m && m[1]) tClean = m[1]; 
                            } 
                            assignedTime = `<span style="font-weight:bold; color:#1e3a8a;">${tClean}</span>`; 
                        } 
                    }); 
                } 
            });
        }
        
        let currentNote = (window.state.notes && window.state.notes[staffName] && window.state.notes[staffName][`day_${d}`]) ? window.state.notes[staffName][`day_${d}`] : ''; 
        let btnHtml = ""; 
        let inputDisabledHtml = "";
        
        if (isPastDay && !isManager) { 
            let lockedActive = isHolidayDraft ? 'active' : ''; 
            btnHtml = `<button class="holiday-btn locked ${lockedActive}" disabled>已鎖</button>`; 
            inputDisabledHtml = `disabled style="background:#f3f4f6; color:#9ca3af; cursor:not-allowed;"`; 
        } else { 
            let activeClass = isHolidayDraft ? 'active' : ''; 
            btnHtml = `<button class="holiday-btn ${activeClass}" onclick="window.toggleLocalHolidayDraft('${staffName}', ${d}, this)">放假</button>`; 
        }
        
        let maniBadgeStyle = "background:#cef7e5; color:#03543f;"; 
        let limitLowVal = window.state.settings.limitLow || 3;
        let limitHighVal = window.state.settings.limitHigh || 5;

        if(activeManiCount <= limitLowVal) {
            maniBadgeStyle = "background:#fde8e8; color:#9b1c1c; font-weight:bold;"; 
        } else if(activeManiCount < limitHighVal) {
            maniBadgeStyle = "background:#e6fbf4; color:#0d9488;";
        }
        tbody.innerHTML += `<tr><td style="text-align:center; font-weight:bold; ${isPastDay?'color:#9ca3af;':''}">${isPastDay ? '🔒 ' : ''}${d} 日</td><td style="text-align:center; ${isWknd}">${window.getDayOfWeekText(window.state.currentYear, window.state.currentMonth, d)}</td><td style="text-align:center;"><span style="padding:2px 6px; border-radius:6px; font-size:11px; ${maniBadgeStyle}">${activeManiCount} 師</span></td><td style="text-align:center;">${assignedShop}</td><td style="text-align:center;">${assignedTime}</td><td style="text-align:center;">${btnHtml}</td><td><input type="text" class="calendar-special-note-input" data-day="${d}" data-staff="${staffName}" ${inputDisabledHtml} value="${currentNote}" placeholder="原因..."></td></tr>`;
    }
    const invertBtn = document.getElementById('my-month-invert-btn'); 
    if (invertBtn) { 
        invertBtn.disabled = ((window.state.currentYear < realYearNum || (window.state.currentYear === realYearNum && window.state.currentMonth < realMonthNum)) && !isManager); 
        invertBtn.style.opacity = invertBtn.disabled ? 0.4 : 1; 
    }
};

window.invertIndividualEmployeeHolidays = function() {
    const staffName = document.getElementById('my-month-staff-select')?.value; 
    if(!staffName) return; 
    const isManager = (window.state.currentRole === 'manager');
    let totalDays = window.getDaysInMonth(window.state.currentYear, window.state.currentMonth); 
    if (!window.state.localHolidaysDraft[staffName]) window.state.localHolidaysDraft[staffName] = []; 
    let inverted = [];
    
    for (let d = 1; d <= totalDays; d++) {
        let isPastDay = (window.state.currentYear < 2026 || (window.state.currentYear === 2026 && window.state.currentMonth < 5) || (window.state.currentYear === 2026 && window.state.currentMonth === 5 && d < 1));
        if (isPastDay && !isManager) { 
            if ((window.state.holidays[staffName] || []).includes(d)) inverted.push(d); 
        } else { 
            if (!window.state.localHolidaysDraft[staffName].includes(d)) inverted.push(d); 
        }
    }
    window.state.localHolidaysDraft[staffName] = inverted; 
    window.renderIndividualMonthCalendar();
};

// ==================== 📊 全月分析與排班人手統計 ====================
window.applyColumnFilter = function(type) {
    document.querySelectorAll('.btn-filter').forEach(b => b.classList.remove('active')); 
    const filterBtn = document.getElementById('filter-' + type);
    if (filterBtn) filterBtn.classList.add('active');
    
    if(type === 'all') {
        document.querySelectorAll('.col-mani, .col-app, .col-shops').forEach(el => el.style.display = '');
    } else if(type === 'mani') { 
        document.querySelectorAll('.col-mani').forEach(el => el.style.display = ''); 
        document.querySelectorAll('.col-app, .col-shops').forEach(el => el.style.display = 'none'); 
    } else if(type === 'app') { 
        document.querySelectorAll('.col-app').forEach(el => el.style.display = ''); 
        document.querySelectorAll('.col-mani, .col-shops').forEach(el => el.style.display = 'none'); 
    } else if(type === 'shops') { 
        document.querySelectorAll('.col-shops').forEach(el => el.style.display = ''); 
        document.querySelectorAll('.col-mani, .col-app').forEach(el => el.style.display = 'none'); 
    }
};

window.renderMonthlyAnalysis = function() {
    const tbody = document.getElementById('analysis-table-body'); 
    if(!tbody) return; 
    tbody.innerHTML = '';
    
    const lowBody = document.getElementById('low-staff-table-body'); 
    const highBody = document.getElementById('high-staff-table-body'); 
    if(lowBody) lowBody.innerHTML = ''; 
    if(highBody) highBody.innerHTML = '';
    
    let totalDays = window.getDaysInMonth(window.state.currentYear, window.state.currentMonth); 
    let lowStaffHtml = ""; 
    let highStaffHtml = ""; 
    let attendanceCounters = {};
    
    window.state.employees.forEach(e => { attendanceCounters[e.name] = { totalLeave: 0, totalWork: 0, role: e.role || 'Full-time' }; });
    
    for (let d = 1; d <= totalDays; d++) {
        let dayKey = `day_${d}`; 
        let finalCounts = { F79: 0, GK3: 0, G38: 0, G2: 0 }; 
        let totalWorkingApprentices = 0; 
        let dayReport = window.state.overrides[dayKey] || window.calculateDaySchedule(d).report;
        
        ['F79', 'GK3', 'G38', 'G2'].forEach(s => { 
            if (dayReport[s]) {
                dayReport[s].forEach(slot => { 
                    if(slot.name) { 
                        const staff = window.state.employees.find(e => e.name.replace(/\s+/g, '') === slot.name.replace(/\s+/g, '')); 
                        if(staff) { 
                            if(staff.role === '學徒') totalWorkingApprentices++; 
                            else finalCounts[s]++; 
                        } 
                    } 
                }); 
            }
        });
        
        window.state.employees.forEach(e => { 
            if ((window.state.holidays[e.name] || []).includes(d)) { 
                if(attendanceCounters[e.name]) attendanceCounters[e.name].totalLeave++; 
            } else { 
                if(attendanceCounters[e.name]) attendanceCounters[e.name].totalWork++; 
            } 
        });
        
        let totalWorkingMani = finalCounts.F79 + finalCounts.GK3 + finalCounts.G38 + finalCounts.G2;
        let alertBgClass = totalWorkingMani <= window.state.settings.limitLow ? "bg-alert-red" : (totalWorkingMani >= window.state.settings.limitHigh ? "bg-alert-darkgreen" : "bg-alert-lightgreen");
        let isWknd = window.getDayOfWeekText(window.state.currentYear, window.state.currentMonth, d) === '日' ? 'background:#fef2f2; font-weight:bold; color:var(--danger);' : '';
        
        let rowHtml = `<tr><td style="text-align:center; font-weight:bold; width:65px;">${d} 日</td><td style="text-align:center; ${isWknd} width:55px;">${window.getDayOfWeekText(window.state.currentYear, window.state.currentMonth, d)}</td><td class="col-mani ${alertBgClass}" style="width:100px;">${totalWorkingMani} 師</td><td class="col-app" style="text-align:center; background:#f0fdf4; font-weight:bold; color:#0d9488; width:100px;">${totalWorkingApprentices} 徒</td><td class="col-shops normal-cell">${finalCounts.F79}人</td><td class="col-shops normal-cell">${finalCounts.GK3}人</td><td class="col-shops normal-cell">${finalCounts.G38}人</td><td class="col-shops normal-cell">${finalCounts.G2}人</td></tr>`;
        tbody.innerHTML += rowHtml; 
        
        if(totalWorkingMani <= window.state.settings.limitLow) lowStaffHtml += rowHtml; 
        if(totalWorkingMani >= window.state.settings.limitHigh) highStaffHtml += rowHtml;
    }
    
    if(lowBody) lowBody.innerHTML = lowStaffHtml || `<tr><td style='text-align:center; padding:10px; color:#9ca3af;'>🙌 本月人手充裕。</td></tr>`;
    if(highBody) highBody.innerHTML = highStaffHtml || `<tr><td style='text-align:center; padding:10px; color:#9ca3af;'>📊 本月無充沛日子。</td></tr>`;
    
    const summaryBody = document.getElementById('staff-month-summary-body');
    if(summaryBody) {
        summaryBody.innerHTML = ''; 
        Object.keys(attendanceCounters).forEach(name => { 
            let info = attendanceCounters[name];
            summaryBody.innerHTML += `<tr><td style="padding:6px 10px; font-weight:bold;">${name}</td><td style="text-align:center;">${info.role}</td><td style="text-align:center; color:var(--success);">${info.totalWork} 天</td><td style="text-align:center; color:var(--danger);">${info.totalLeave} 天</td></tr>`;
        });
    }
    window.applyColumnFilter('all'); 
};

// ==================== 🏖️ 管理大表：全月放假表繪製 ====================
window.renderHolidayTable = function() {
    const headerRow = document.getElementById('holiday-table-header-row'); 
    const tbody = document.getElementById('holiday-table-body'); 
    if(!headerRow || !tbody) return; 
    headerRow.innerHTML = ''; 
    tbody.innerHTML = '';
    
    let totalDays = window.getDaysInMonth(window.state.currentYear, window.state.currentMonth); 
    headerRow.innerHTML += `<th class="sticky-col">員工放假總覽 📊</th>`;
    
    for(let d=1; d<=totalDays; d++) { 
        let dayReport = window.state.overrides[`day_${d}`] || window.calculateDaySchedule(d).report; 
        let tMani = 0, tApp = 0; 
        let activeUniqueManiSet = new Set();
        
        if (dayReport['F79']) {
            dayReport['F79'].concat(dayReport['GK3'] || [], dayReport['G38'] || [], dayReport['G2'] || []).forEach(slot => { 
                if(slot.name) { 
                    const staff = window.state.employees.find(e => e.name.replace(/\s+/g, '') === slot.name.replace(/\s+/g, '')); 
                    if(staff) { 
                        if(staff.role === '學徒') tApp++; 
                        else activeUniqueManiSet.add(staff.name); 
                    } 
                } 
            });
        }
        headerRow.innerHTML += `<th style="text-align:center; min-width:42px; background:#f8fafc;"><span style="color:var(--primary); display:block;">${activeUniqueManiSet.size}師</span><span style="color:#0d9488; display:block;">${tApp}徒</span><b>${d}</b><br><span style="font-size:9px; font-weight:normal;">${window.getDayOfWeekText(window.state.currentYear, window.state.currentMonth, d)}</span></th>`; 
    }
    window.state.employees.forEach(emp => {
        let dotsHtml = ''; 
        const userHols = window.state.holidays[emp.name] || [];
        for(let d = 1; d <= totalDays; d++) { 
            let isActive = userHols.includes(d) ? 'active' : ''; 
            let dotText = userHols.includes(d) ? '假' : '-'; 
            dotsHtml += `<td><span class="holiday-display-dot ${isActive}">${dotText}</span></td>`; 
        }
        tbody.innerHTML += `<tr><td class="sticky-col"><span class="count-badge">${userHols.length}天</span><b>${emp.name}</b></td>${dotsHtml}</tr>`;
    });
};

// ==================== 👥 員工資料庫表與安全帳密維護 ====================
window.renderEmployeeTable = function() {
    const tbody = document.getElementById('employee-table-body'); 
    if(!tbody) return; 
    tbody.innerHTML = '';
    const isReadonly = (window.state.currentRole !== 'manager') ? 'disabled' : '';
    
    window.state.employees.forEach((emp, index) => {
        let currentRole = emp.role || 'Full-time';
        const code = emp.id || window.defaultStaffIds[emp.name] || "100";
        const pass = emp.password || (code + "22");
        
        tbody.innerHTML += `
            <tr>
                <td>
                    <input type="text" class="emp-id-input" ${isReadonly} style="width: 70px; text-align: center; font-weight: bold; border: 1px solid #cbd5e1; border-radius: 6px; padding: 4px;" value="${code}" oninput="window.updateEmployeeRowPassword(this, ${index})">
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
                        <button class="btn" ${isReadonly} style="background:#f1f5f9; color:#475569; border:1px solid #cbd5e1; padding:4px 6px; font-size:11px;" onclick="window.regenerateEmployeeRowPass(this)" title="重算密碼">🔄</button>
                    </div>
                </td>
                <td>
                    <button class="btn btn-del" ${isReadonly} style="background: var(--danger); color: white; padding: 4px 8px;" onclick="this.closest('tr').remove()">刪除</button>
                </td>
            </tr>
        `;
    });
};

window.updateEmployeeRowPassword = function(idInput) {
    const tr = idInput.closest('tr');
    if (!tr) return;
    const passInput = tr.querySelector('.emp-pass-input');
    if (passInput) {
        const idVal = idInput.value.trim();
        if (idVal) {
            passInput.value = idVal + String(Math.floor(Math.random() * 90 + 10));
        }
    }
};

window.regenerateEmployeeRowPass = function(btn) {
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
};

window.addEmployeeRow = function() {
    if(window.state.currentRole !== 'manager') return; 
    const tbody = document.getElementById('employee-table-body'); 
    if(!tbody) return;
    const randomSuffix = String(Math.floor(Math.random() * 90 + 10));
    tbody.innerHTML += `
        <tr>
            <td>
                <input type="text" class="emp-id-input" style="width: 70px; text-align: center; font-weight: bold; border: 1px solid #cbd5e1; border-radius: 6px; padding: 4px;" value="124" oninput="window.updateEmployeeRowPassword(this)">
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
                    <button class="btn" style="background:#f1f5f9; color:#475569; border:1px solid #cbd5e1; padding:4px 6px; font-size:11px;" onclick="window.regenerateEmployeeRowPass(this)">🔄</button>
                </div>
            </td>
            <td>
                <button class="btn btn-del" style="background: var(--danger); color: white; padding: 4px 8px;" onclick="this.closest('tr').remove()">刪除</button>
            </td>
        </tr>
    `;
};

window.saveEmployeeData = function() {
    if (window.state.currentRole !== 'manager') return; 
    const rows = document.querySelectorAll('#employee-table-body tr'); 
    let newEmps = [];
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
    window.state.employees = newEmps;
    if(window.isCloudMode && window.database) { 
        window.database.ref(`v8_employees`).set(window.state.employees).then(() => { 
            showToastMessage('👥 員工設定與安全帳密已成功發佈！'); 
        }); 
    } else { 
        localStorage.setItem('v8_employees', JSON.stringify(window.state.employees)); 
        showToastMessage('💾 員工名單已儲存至本地！'); 
        window.populateStaffDropdown(); 
        window.renderSettingsAccountsList(window.state.employees);
    }
};

// ==================== ⚙️ 微調設定頁：員工帳密管理渲染與操作 ====================
window.renderSettingsAccountsList = function(employees) {
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
                    <input type="text" class="sett-id-field" style="width:100px; text-align:center; font-weight:bold; border:1px solid #cbd5e1; border-radius:6px; padding:4px;" value="${code}" oninput="window.updateSettingsRowPassword(this)">
                </td>
                <td style="padding:10px; text-align:center;">
                    <input type="text" class="sett-pass-field" style="width:120px; text-align:center; font-weight:bold; border:1px solid #cbd5e1; border-radius:6px; padding:4px;" value="${pass}">
                </td>
                <td style="padding:10px; text-align:center;">
                    <button class="btn" style="background:#f1f5f9; color:#475569; border:1px solid #cbd5e1; padding:4px 8px; font-size:11px; border-radius:6px;" onclick="window.regenerateEmployeeRowPass(this)">🔄 重算</button>
                </td>
            </tr>
        `;
    });
};

window.updateSettingsRowPassword = function(idInput) {
    const tr = idInput.closest('tr');
    if (!tr) return;
    const passInput = tr.querySelector('.sett-pass-field');
    if (passInput) {
        const idVal = idInput.value.trim();
        if (idVal) {
            passInput.value = idVal + String(Math.floor(Math.random() * 90 + 10));
        }
    }
};

window.triggerRegenerateAllPasswords = function() {
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
};

window.saveEmployeesAccountsFromSettings = function() {
    const rows = document.querySelectorAll('#settings-accounts-tbody tr');
    const updatedList = [...window.state.employees]; 

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
};

window.saveHolidayData = function() {
    if(window.state.currentRole !== 'manager') return; 
    const monthKey = `${window.state.currentYear}-${window.state.currentMonth < 10 ? '0'+window.state.currentMonth : window.state.currentMonth}`;
    if(window.isCloudMode && window.database) { 
        window.database.ref(`v8_holidays/${monthKey}`).set(window.state.holidays).then(() => { 
            showToastMessage('🏖️ 放假大表已成功發佈！'); 
        }); 
    } 
};

window.handleManualSlotChange = function(shop, index, field, value) {
    const dayKey = `day_${window.state.currentDay}`; 
    const cacheInput = document.getElementById('current-rendered-data-cache');
    if (!cacheInput) return;

    if (!window.state.overrides[dayKey]) { 
        window.state.overrides[dayKey] = JSON.parse(cacheInput.value); 
    }
    window.state.overrides[dayKey][shop][index][field] = value; 
    const monthKey = `${window.state.currentYear}-${window.state.currentMonth < 10 ? '0'+window.state.currentMonth : window.state.currentMonth}`;
    if(window.isCloudMode && window.database) { 
        window.database.ref(`v8_overrides/${monthKey}/${dayKey}`).set(window.state.overrides[dayKey]); 
    } else { 
        localStorage.setItem(`v8_overrides_${monthKey}`, JSON.stringify(window.state.overrides)); 
        window.refreshBadgesOnly(window.state.overrides[dayKey]); 
    }
};

window.resetCurrentDayToAuto = function() {
    const monthKey = `${window.state.currentYear}-${window.state.currentMonth < 10 ? '0'+window.state.currentMonth : window.state.currentMonth}`;
    if(window.isCloudMode && window.database) { 
        window.database.ref(`v8_overrides/${monthKey}/day_${window.state.currentDay}`).remove(); 
    } else { 
        if(window.state.overrides[`day_${window.state.currentDay}`]) { 
            delete window.state.overrides[`day_${window.state.currentDay}`]; 
            localStorage.setItem(`v8_overrides_${monthKey}`, JSON.stringify(window.state.overrides)); 
            window.runScheduler(); 
        } 
    }
};

window.refreshBadgesOnly = function(reportData) {
    let shopCounts = { F79: 0, GK3: 0, G38: 0, G2: 0 }; 
    ['F79', 'GK3', 'G38', 'G2'].forEach(shop => { 
        if (reportData[shop]) {
            reportData[shop].forEach(slot => { if(slot.name) shopCounts[shop]++; }); 
        }
    });
    window.renderMonitorBadges(shopCounts);
};

// ==================== 📥 智庫審批中心批准邏輯對接 ====================
window.actionApproveHoliday = function(key, staffName, requestedHolidays) {
    if (window.state.currentRole !== 'manager') return;
    const monthKey = `${window.state.currentYear}-${window.state.currentMonth < 10 ? '0'+window.state.currentMonth : window.state.currentMonth}`;
    
    let currentHols = window.state.holidays[staffName] || [];
    requestedHolidays.forEach(d => {
        if (!currentHols.includes(d)) {
            currentHols.push(d);
        }
    });
    window.state.holidays[staffName] = currentHols.sort((a, b) => a - b);
    
    if (window.isCloudMode && window.database) {
        window.database.ref(`v8_holidays/${monthKey}/${staffName}`).set(window.state.holidays[staffName])
        .then(() => {
            return window.database.ref(`v8_pending_approvals/${monthKey}/${key}`).remove();
        })
        .then(() => {
            showToastMessage(`🎉 已批准 ${staffName} 老師的放假申請！`);
        })
        .catch(err => {
            alert("審批失敗: " + err.message);
        });
    } else {
        localStorage.setItem(`v8_holidays_${monthKey}`, JSON.stringify(window.state.holidays));
        showToastMessage(`🎉 本地已批准 ${staffName} 老師的放假申請！`);
        window.runScheduler();
    }
};

// ==================== ⚙️ 演算法與每日排班邏輯核心 ====================
window.runScheduler = function() {
    let leavesToday = []; 
    window.state.employees.forEach(emp => { 
        if ((window.state.holidays[emp.name] || []).includes(window.state.currentDay)) {
            leavesToday.push(emp.name); 
        }
    });
    
    const dayKey = `day_${window.state.currentDay}`; 
    let report = {}; 
    let activeStaff = window.state.employees.filter(e => !(window.state.holidays[e.name] || []).includes(window.state.currentDay));
    let manicurists = activeStaff.filter(e => e.role !== '學徒'); 
    let apprentices = activeStaff.filter(e => e.role === '學徒');
    
    const totalTextEl = document.getElementById('total-working-text'); 
    const leaveBoxEl = document.getElementById('today-leave-names-box');
    
    if (window.state.overrides[dayKey]) {
        report = window.state.overrides[dayKey];
        if(totalTextEl) totalTextEl.innerHTML = `${window.state.currentMonth}月 ${window.state.currentDay} 日 (星期${window.getDayOfWeekText(window.state.currentYear, window.state.currentMonth, window.state.currentDay)}) 美甲師：<b>${manicurists.length}</b> 人 ｜ 學徒：<b>${apprentices.length}</b> 人 ｜ 總上班：<b>${activeStaff.length}</b> 人 (⚠️手動微調模式)`;
        if(leaveBoxEl) leaveBoxEl.innerHTML = `今日放假：${leavesToday.length > 0 ? leavesToday.join(', ') : '無'}`;
        window.refreshBadgesOnly(report); 
        window.renderInteractiveReport(report); 
        return;
    }
    
    let result = window.calculateDaySchedule(window.state.currentDay); 
    report = result.report;
    if(totalTextEl) totalTextEl.innerHTML = `${window.state.currentMonth}月 ${window.state.currentDay} 日 (星期${window.getDayOfWeekText(window.state.currentYear, window.state.currentMonth, window.state.currentDay)}) 美甲師：<b>${result.manicuristCount}</b> 人 ｜ 學徒：<b>${apprentices.length}</b> 人 ｜ 總上班：<b>${result.totalCount}</b> 人`;
    if(leaveBoxEl) leaveBoxEl.innerHTML = `今日放假：${leavesToday.length > 0 ? leavesToday.join(', ') : '無'}`;
    window.refreshBadgesOnly(report); 
    window.renderInteractiveReport(report);
};

window.calculateDaySchedule = function(dayNumber) {
    let report = { F79: [], GK3: [], G38: [], G2: [] }; 
    let isSun = window.isSunday(window.state.currentYear, window.state.currentMonth, dayNumber);
    
    const activeStaff = window.state.employees.filter(e => !(window.state.holidays[e.name] || []).includes(dayNumber)); 
    const manicurists = activeStaff.filter(e => e.role !== '學徒'); 
    const apprentices = activeStaff.filter(e => e.role === '學徒');
    
    let M = manicurists.length; 
    let targets = { F79: 3, G2: 3, GK3: 3, G38: 3 };
    
    if (M <= 11) {
        targets.F79 = 2; 
        let rem = M - 2; 
        targets.G2 = Math.max(0, Math.min(3, rem)); 
        rem -= targets.G2; 
        targets.GK3 = Math.max(0, Math.min(3, rem)); 
        rem -= targets.GK3; 
        targets.G38 = Math.max(0, Math.min(3, rem)); 
        rem -= targets.G38;
    } else {
        targets.F79 = 3; 
        targets.GK3 = 3; 
        let surplus = M - 12; 
        let baseSurplus = Math.floor(surplus / 2); 
        let remSurplus = surplus % 2; 
        targets.G2 = 3 + baseSurplus + remSurplus; 
        targets.G38 = 3 + baseSurplus;
    }
    
    let sortedMani = [...manicurists].sort((a,b) => (a.p_shops || 'G2').split(',').length - (b.p_shops || 'G2').split(',').length); 
    let assignment = {}; 
    let currentCounts = { F79: 0, GK3: 0, G38: 0, G2: 0 }; 
    let unassignedMani = [];
    
    sortedMani.forEach(emp => { 
        let allowed = (emp.p_shops || 'G2').split(',').map(s => s.trim()); 
        let primaryShop = allowed[0] || 'G2'; 
        if (currentCounts[primaryShop] < targets[primaryShop]) { 
            currentCounts[primaryShop]++; 
            assignment[emp.name] = primaryShop; 
        } else { 
            unassignedMani.push(emp); 
        } 
    });
    
    unassignedMani.forEach(emp => { 
        let allowed = (emp.p_shops || 'G2').split(',').map(s => s.trim()); 
        let assigned = false; 
        for (let shop of allowed) { 
            if (currentCounts[shop] < targets[shop]) { 
                currentCounts[shop]++; 
                assignment[emp.name] = shop; 
                assigned = true; 
                break; 
            } 
        } 
        if (!assigned) { 
            let primaryShop = allowed[0] || 'G2'; 
            currentCounts[primaryShop]++; 
            assignment[emp.name] = primaryShop; 
        } 
    });
    
    apprentices.forEach(app => { 
        let allowed = (app.p_shops || 'G2').split(',').map(s => s.trim()); 
        let bestShop = allowed[0] || 'G2'; 
        let minCount = 999; 
        for(let shop of allowed) { 
            if(currentCounts[shop] < minCount) { 
                minCount = currentCounts[shop]; 
                bestShop = shop; 
            } 
        } 
        assignment[app.name] = bestShop; 
        currentCounts[bestShop]++; 
    });
    
    let shopGroups = { F79: [], GK3: [], G38: [], G2: [] }; 
    activeStaff.forEach(emp => { 
        let shop = assignment[emp.name] || 'G2'; 
        shopGroups[shop].push(emp); 
    });
    
    shopGroups.F79.forEach((emp, idx) => { 
        let shift = (idx === 0) ? "早班" : "晚班"; 
        let t = window.autoExtractTime(emp, shift, isSun, 'F79'); 
        report.F79.push({ name: emp.name, time: t }); 
    });
    
    ['G2', 'GK3', 'G38'].forEach(shop => {
        let list = shopGroups[shop]; 
        if (list.length === 0) return;
        let earlyIdx = list.findIndex(emp => emp.role !== '學徒' && (emp.times || '').split(',').map(t => t.trim()).some(t => parseInt(t.split(':')[0]) < 12)); 
        if (earlyIdx === -1) earlyIdx = 0; 
        let earlyEmp = list[earlyIdx]; 
        let remainingWorkers = list.filter((_, idx) => idx !== earlyIdx);
        
        let earlyTime = window.autoExtractTime(earlyEmp, '早班', isSun, shop); 
        report[shop].push({ name: earlyEmp.name, time: earlyTime });
        
        remainingWorkers.forEach((emp, remIdx) => { 
            let shift = isSun ? "中班" : ((remIdx < Math.ceil(remainingWorkers.length / 2)) ? "中班" : "晚班"); 
            let t = window.autoExtractTime(emp, shift, isSun, shop); 
            report[shop].push({ name: emp.name, time: t }); 
        });
    });
    
    ['F79', 'GK3', 'G38', 'G2'].forEach(shop => { 
        while(report[shop].length < 6) { 
            report[shop].push({ name: '', time: '' }); 
        } 
    }); 
    return { report, manicuristCount: M, totalCount: activeStaff.length };
};

window.autoExtractTime = function(emp, shift, isSun, shop) {
    if (shop === 'F79') return (shift === '早班') ? (isSun ? '11:00' : '12:00') : '13:00';
    let userTimes = (emp.times || '').split(',').map(t => t.trim()); 
    if (isSun) return (shift === '早班') ? '10:00' : '12:00';
    
    let primaryTime = userTimes[0] || '12:00'; 
    let primaryHour = parseInt(primaryTime.split(':')[0]);
    if (shift === '早班') { 
        return primaryHour < 12 ? primaryTime : (userTimes.find(t => parseInt(t.split(':')[0]) < 12) || '11:00'); 
    } else if (shift === '中班') { 
        return primaryHour === 12 ? primaryTime : (userTimes.find(t => t === '12:00') || '12:00'); 
    } else { 
        return primaryHour >= 13 ? primaryTime : (userTimes.find(t => parseInt(t.split(':')[0]) >= 13) || '13:00'); 
    }
};

// ==================== 💾 下載與時空還原 ====================
window.downloadTimeCapsuleBackup = function() {
    const monthKey = `${window.state.currentYear}-${window.state.currentMonth < 10 ? '0'+window.state.currentMonth : window.state.currentMonth}`;
    const backupPackage = { v8_employees: window.state.employees, v8_holidays: window.state.holidays, v8_overrides: window.state.overrides, v8_settings: window.state.settings, v8_special_notes: window.state.notes };
    const blob = new Blob([JSON.stringify(backupPackage, null, 2)], { type: 'text/plain' });
    const anchor = document.createElement('a'); 
    anchor.download = `Crystal_Pavilion_V10_Backup_[${monthKey}].txt`; 
    anchor.href = window.URL.createObjectURL(blob); 
    anchor.click();
};

window.triggerBackupUploadClick = function() { 
    const fileInput = document.getElementById('time-capsule-file-injector');
    if (fileInput) fileInput.click(); 
};

window.restoreFromTimeCapsule = function(event) {
    const file = event.target.files[0]; 
    if (!file) return; 
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const pkg = JSON.parse(e.target.result); 
            if (!pkg.v8_employees || !pkg.v8_holidays) { 
                alert('❌ 備份檔格式不符！'); 
                return; 
            }
            if (confirm('確定要一鍵還原雲端所有資料？此動作無法復原！')) {
                const monthKey = `${window.state.currentYear}-${window.state.currentMonth < 10 ? '0'+window.state.currentMonth : window.state.currentMonth}`;
                if (window.isCloudMode && window.database) { 
                    window.database.ref('v8_employees').set(pkg.v8_employees); 
                    window.database.ref(`v8_holidays/${monthKey}`).set(pkg.v8_holidays); 
                    window.database.ref(`v8_overrides/${monthKey}`).set(pkg.v8_overrides || {}); 
                    window.database.ref(`v8_special_notes/${monthKey}`).set(pkg.v8_special_notes || {});
                    if(pkg.v8_settings) window.database.ref('v8_settings').set(pkg.v8_settings); 
                    alert('🟢 已完美還原覆蓋雲端！'); 
                } 
            }
        } catch(err) { alert('讀取檔案失敗。'); }
    }; 
    reader.readAsText(file);
};

// ==================== ⏰ 初始與離線校正器 ====================
window.calculateAutoDefaultDate = function() {
    const now = new Date(); 
    let year = now.getFullYear(); 
    let month = now.getMonth() + 1; 
    let day = now.getDate(); 
    let hour = now.getHours(); 
    let isJumped = false;
    
    if (hour >= 20) { 
        isJumped = true; 
        const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000); 
        year = tomorrow.getFullYear(); 
        month = tomorrow.getMonth() + 1; 
        day = tomorrow.getDate(); 
    }
    window.state.currentYear = year; 
    window.state.currentMonth = month; 
    window.state.currentDay = day;
    
    const hintBanner = document.getElementById('time-switch-hint');
    if (hintBanner) {
        if (isJumped) { 
            hintBanner.innerHTML = `🕗 系統提示：已過夜間 20:00，已自動預載【明天 ${month}月${day}日】排班表`; 
            hintBanner.style.color = "#ea580c"; 
        } else { 
            hintBanner.innerHTML = `🌞 系統提示：目前為日間時段，正顯示【今日 ${month}月${day}日】排班表`; 
            hintBanner.style.color = "#059669"; 
        }
    }
};

window.loadLocalFallbackContext = function() {
    window.calculateAutoDefaultDate(); 
    const y = window.state.currentYear; 
    const m = window.state.currentMonth; 
    const monthKey = `${y}-${m < 10 ? '0'+m : m}`;
    
    window.state.employees = JSON.parse(localStorage.getItem('v8_employees')) || JSON.parse(JSON.stringify(window.defaultEmployees));
    window.state.overrides = JSON.parse(localStorage.getItem(`v8_overrides_${monthKey}`)) || {};
    window.state.holidays = JSON.parse(localStorage.getItem(`v8_holidays_${monthKey}`)) || JSON.parse(JSON.stringify(window.defaultHolidaysData));
    window.state.notes = JSON.parse(localStorage.getItem(`v8_notes_${monthKey}`)) || {};
    window.state.localHolidaysDraft = JSON.parse(JSON.stringify(window.state.holidays));
    
    window.cloudLoads = { emp: true, hol: true, ovr: true, note: true }; 
    window.triggerSafeUIRender();
};

window.switchTab = function(tabId) {
    document.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none'); 
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
    
    const targetEl = document.getElementById(tabId);
    if(targetEl) targetEl.style.display = 'block'; 
    
    const navBtn = document.getElementById('nav-' + tabId.replace('tab-', '')); 
    if(navBtn) navBtn.classList.add('active');
    
    if(tabId === 'tab-schedule') window.runScheduler(); 
    if(tabId === 'tab-my-month') window.renderIndividualMonthCalendar(); 
    if(tabId === 'tab-analysis') window.renderMonthlyAnalysis();
};

window.triggerSafeUIRender = function() {
    if(window.cloudLoads.emp && window.cloudLoads.hol && window.cloudLoads.ovr && window.cloudLoads.note) {
        window.state.employees.forEach(e => { 
            if(!window.state.holidays[e.name]) window.state.holidays[e.name] = []; 
            if(!window.state.localHolidaysDraft[e.name]) window.state.localHolidaysDraft[e.name] = []; 
        });
        window.renderEmployeeTable(); 
        window.populateStaffDropdown(); 
        window.renderMonthlyAnalysis(); 
        window.renderIndividualMonthCalendar(); 
        window.renderHolidayTable();
        
        const ind = document.getElementById('cloud-indicator'); 
        if(ind && window.isCloudMode) { 
            ind.className = "cloud-status status-online"; 
            ind.innerText = "🟢 雲端連線成功！跨月份智能排班大腦運作中"; 
        }
        window.runScheduler();
    }
};

// ==================== 🚀 核心監聽封裝啟動入口 ====================
// 💡 全面封裝在 DOMContentLoaded 中，保證 100% 網頁 DOM 樹與 Overrides 全部載入後才初始化 Firebase 與排班！
window.addEventListener('DOMContentLoaded', () => {
    window.calculateAutoDefaultDate(); 
    window.initYearMonthDropdowns();

    if (typeof firebase !== 'undefined' && typeof window.firebaseConfig !== 'undefined') {
        try {
            if (!firebase.apps.length) firebase.initializeApp(window.firebaseConfig);
            window.database = firebase.database();
            window.database.ref(".info/connected").on("value", function(snap) { 
                if (snap.val() === true) { 
                    window.isCloudMode = true; 
                    window.setupSettingsListener(); 
                    window.handleDateContextChange(); 
                } 
            });
        } catch(e) { window.isCloudMode = false; }
    }

    setTimeout(function() {
        if (!window.isCloudMode) {
            const ind = document.getElementById('cloud-indicator'); 
            if(ind) { 
                ind.className = "cloud-status status-offline"; 
                ind.innerText = "⚠️ 獨立離線模式下運作（本地快取保護中）"; 
            }
            window.state.settings = JSON.parse(localStorage.getItem('v8_settings')) || JSON.parse(JSON.stringify(window.defaultSystemSettings)); 
            window.applyDynamicSettingsToUI(); 
            window.loadLocalFallbackContext();
        }
    }, 1500);
});

