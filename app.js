
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
    passManager: "8888", passEmployee: "1234", webTitle: "分店智能排班系統 V11.0",
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
    window.cfgRef.on('value', function(snapshot) {
        var newVal = snapshot.exists() ? snapshot.val() : {};
        var mergedSettings = JSON.parse(JSON.stringify(window.defaultSystemSettings));
        for (var key in newVal) {
            if (newVal.hasOwnProperty(key)) {
                mergedSettings[key] = newVal[key];
            }
        }
        window.state.settings = mergedSettings;
        window.applyDynamicSettingsToUI();
    });
};

window.applyDynamicSettingsToUI = function() {
    var cfgMgr = document.getElementById('cfg-pass-manager');
    var cfgEmp = document.getElementById('cfg-pass-employee');
    var cfgTitle = document.getElementById('cfg-web-title');
    var cfgLock = document.getElementById('cfg-lock-day');
    var cfgMaxFt = document.getElementById('cfg-max-ft-leave');
    var cfgMaxPt = document.getElementById('cfg-max-pt-leave');
    var cfgLimitL = document.getElementById('cfg-limit-low');
    var cfgLimitH = document.getElementById('cfg-limit-high');

    if (cfgMgr) cfgMgr.value = window.state.settings.passManager || "8888";
    if (cfgEmp) cfgEmp.value = window.state.settings.passEmployee || "1234";
    if (cfgTitle) cfgTitle.value = window.state.settings.webTitle || "分店智能排班系統 V11.0";
    if (cfgLock) cfgLock.value = window.state.settings.lockDay || 26;
    if (cfgMaxFt) cfgMaxFt.value = window.state.settings.maxFtLeave || 5;
    if (cfgMaxPt) cfgMaxPt.value = window.state.settings.maxPtLeave || 20;
    if (cfgLimitL) cfgLimitL.value = window.state.settings.limitLow || 3;
    if (cfgLimitH) cfgLimitH.value = window.state.settings.limitHigh || 5;
    
    document.title = window.state.settings.webTitle || "分店智能排班系統 V11.0"; 
    var webTag = document.getElementById('web-title-tag');
    var loginTitle = document.getElementById('login-box-title');
    var mainTitle = document.getElementById('page-main-title');

    if (webTag) webTag.innerText = window.state.settings.webTitle;
    if (loginTitle) loginTitle.innerText = window.state.settings.webTitle;
    if (mainTitle) mainTitle.innerHTML = window.state.settings.webTitle + " <span style='color:var(--warning);'>[動態體]</span>";
    
    if (window.cloudLoads.emp && window.cloudLoads.hol && window.cloudLoads.ovr && window.cloudLoads.note) {
        window.runScheduler();
    }
};

window.saveGlobalSystemSettings = function() {
    if (window.state.currentRole !== 'manager') return;
    
    var cfgMgrVal = (document.getElementById('cfg-pass-manager') ? document.getElementById('cfg-pass-manager').value.trim() : "") || window.state.settings.passManager || "8888";
    var cfgEmpVal = (document.getElementById('cfg-pass-employee') ? document.getElementById('cfg-pass-employee').value.trim() : "") || window.state.settings.passEmployee || "1234";
    var cfgTitleVal = (document.getElementById('cfg-web-title') ? document.getElementById('cfg-web-title').value.trim() : "") || "分店智能排班系統 V11.0";
    var cfgLockVal = parseInt(document.getElementById('cfg-lock-day') ? document.getElementById('cfg-lock-day').value : 26);
    var cfgMaxFtVal = parseInt(document.getElementById('cfg-max-ft-leave') ? document.getElementById('cfg-max-ft-leave').value : 5);
    var cfgMaxPtVal = parseInt(document.getElementById('cfg-max-pt-leave') ? document.getElementById('cfg-max-pt-leave').value : 20);
    var cfgLimitLVal = parseInt(document.getElementById('cfg-limit-low') ? document.getElementById('cfg-limit-low').value : 3);
    var cfgLimitHVal = parseInt(document.getElementById('cfg-limit-high') ? document.getElementById('cfg-limit-high').value : 5);

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
        window.database.ref('v8_settings').set(window.state.settings).then(function() { 
            if(window.showToastMessage) window.showToastMessage('⚙️ 全局配置已成功發佈至雲端！'); 
        });
    } else {
        localStorage.setItem('v8_settings', JSON.stringify(window.state.settings)); 
        if(window.showToastMessage) window.showToastMessage('💾 配置已成功儲存至本地快取中！'); 
        window.applyDynamicSettingsToUI();
    }
};

// ==================== 📅 每日排班沙盒渲染與拖拽 ====================
window.generateTimeOptions = function(selectedValue) {
    var optionsHtml = '<option value="">無班次</option>'; 
    var tClean = selectedValue || '';
    if (tClean.indexOf('(') !== -1) { 
        var matches = tClean.match(/\(([^)]+)\)/); 
        if (matches && matches[1]) tClean = matches[1]; 
    }
    tClean = tClean.trim();
    for (var h = 9; h <= 19; h++) {
        var hStr = h < 10 ? '0' + h : h;
        var mArr = ['00', '30'];
        for (var mIdx = 0; mIdx < mArr.length; mIdx++) {
            var timeStr = hStr + ':' + mArr[mIdx];
            var isSel = (tClean === timeStr) ? 'selected' : '';
            optionsHtml += '<option value="' + timeStr + '" ' + isSel + '>' + timeStr + '</option>';
        }
    }
    return optionsHtml;
};

window.handleSlotDragStart = function(e, shop, index) {
    var cacheInput = document.getElementById('current-rendered-data-cache');
    if (!cacheInput) return;
    var report = JSON.parse(cacheInput.value);
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
    var slots = document.querySelectorAll('.slot-box');
    for (var i = 0; i < slots.length; i++) { slots[i].classList.remove('dragging'); }
    if (!window.draggedSourceData) return; 
    
    var sourceShop = window.draggedSourceData.shop; 
    var sourceIndex = window.draggedSourceData.index; 
    if (sourceShop === targetShop && sourceIndex === targetIndex) return;
    
    var dayKey = 'day_' + window.state.currentDay; 
    var cacheInput = document.getElementById('current-rendered-data-cache');
    if (!cacheInput) return;

    if (!window.state.overrides[dayKey]) { 
        window.state.overrides[dayKey] = JSON.parse(cacheInput.value); 
    }
    var temp = window.state.overrides[dayKey][targetShop][targetIndex]; 
    window.state.overrides[dayKey][targetShop][targetIndex] = window.state.overrides[dayKey][sourceShop][sourceIndex]; 
    window.state.overrides[dayKey][sourceShop][sourceIndex] = temp;
    
    var monthKey = window.state.currentYear + '-' + (window.state.currentMonth < 10 ? '0' + window.state.currentMonth : window.state.currentMonth);
    if(window.isCloudMode && window.database) { 
        window.database.ref('v8_overrides/' + monthKey + '/' + dayKey).set(window.state.overrides[dayKey]); 
    } else { 
        localStorage.setItem('v8_overrides_' + monthKey, JSON.stringify(window.state.overrides)); 
        window.runScheduler(); 
    }
    window.draggedSourceData = null;
};

window.renderMonitorBadges = function(shopCounts) {
    var monitorPanel = document.getElementById('monitor-panel'); 
    if(!monitorPanel) return; 
    monitorPanel.innerHTML = '';
    var shops = ['F79', 'GK3', 'G38', 'G2'];
    for(var k=0; k<shops.length; k++) {
        var shop = shops[k];
        var count = shopCounts[shop]; 
        var badgeClass = 'bg-ok'; 
        var txt = '正常';
        if(shop === 'F79') { 
            badgeClass = (count >= 2 && count <= 3) ? 'bg-ok' : 'bg-warn'; 
            txt = '指標:' + count + '人'; 
        } else { 
            if (count < 3) { 
                badgeClass = 'bg-warn'; 
                txt = '缺美甲師'; 
            } else if (count > 6) { 
                badgeClass = 'bg-low'; 
                txt = '爆人(多於6)'; 
            } 
        }
        monitorPanel.innerHTML += '<div class="badge ' + badgeClass + '"><div style="font-weight:bold;">' + shop + '</div><div style="font-size:18px; font-weight:900; margin:2px 0;">' + count + '人</div><div style="font-size:10px; opacity:0.8;">' + txt + '</div></div>';
    }
};

window.setupFirebaseListeners = function() {
    if(!window.database || !window.isCloudMode) return; 
    var monthKey = window.state.currentYear + '-' + (window.state.currentMonth < 10 ? '0' + window.state.currentMonth : window.state.currentMonth);
    window.cloudLoads = { emp: false, hol: false, ovr: false, note: false };
    
    if(window.empRef) window.empRef.off(); 
    if(window.holRef) window.holRef.off(); 
    if(window.ovrRef) window.ovrRef.off(); 
    if(window.appRef) window.appRef.off(); 
    if(window.noteRef) window.noteRef.off();
    
    window.empRef = window.database.ref('v8_employees');
    window.empRef.on('value', function(snapshot) { 
        var val = snapshot.exists() ? snapshot.val() : JSON.parse(JSON.stringify(window.defaultEmployees)); 
        
        var arr = [];
        for (var k in val) {
            if (val.hasOwnProperty(k) && val[k]) {
                arr.push(val[k]);
            }
        }
        window.state.employees = Array.isArray(val) ? val.filter(Boolean) : arr;
        window.cloudLoads.emp = true; 
        
        if (typeof window.renderSettingsAccountsList === 'function') {
            window.renderSettingsAccountsList(window.state.employees);
        }
        window.triggerSafeUIRender(); 
    });
    
    window.holRef = window.database.ref('v8_holidays/' + monthKey);
    window.holRef.on('value', function(snapshot) { 
        var isDefaultMonth = (window.state.currentYear === 2026 && window.state.currentMonth === 5);
        window.state.holidays = snapshot.exists() ? snapshot.val() : (isDefaultMonth ? JSON.parse(JSON.stringify(window.defaultHolidaysData)) : {});
        
        for(var i=0; i<window.state.employees.length; i++) {
            var e = window.state.employees[i];
            if (!window.state.holidays[e.name]) {
                window.state.holidays[e.name] = [];
            }
        }
        
        window.state.localHolidaysDraft = JSON.parse(JSON.stringify(window.state.holidays)); 
        window.cloudLoads.hol = true; 
        window.triggerSafeUIRender(); 
    });
    
    window.ovrRef = window.database.ref('v8_overrides/' + monthKey);
    window.ovrRef.on('value', function(snapshot) { 
        window.state.overrides = snapshot.exists() ? snapshot.val() : {}; 
        window.cloudLoads.ovr = true; 
        window.triggerSafeUIRender(); 
    });
    
    window.noteRef = window.database.ref('v8_special_notes/' + monthKey);
    window.noteRef.on('value', function(snapshot) { 
        window.state.notes = snapshot.exists() ? snapshot.val() : {}; 
        window.cloudLoads.note = true; 
        window.triggerSafeUIRender(); 
    });
    
    window.appRef = window.database.ref('v8_pending_approvals/' + monthKey); 
    window.appRef.on('value', function(snapshot) { 
        window.state.pendingApprovals = snapshot.exists() ? snapshot.val() : {}; 
        if (typeof window.renderPendingApprovalsBox === 'function') {
            window.renderPendingApprovalsBox(); 
        }
    });
};

window.initYearMonthDropdowns = function() {
    var yrSel = document.getElementById('schedule-year-select'); 
    var moSel = document.getElementById('schedule-month-select'); 
    if(!yrSel || !moSel) return;
    
    yrSel.innerHTML = ''; 
    moSel.innerHTML = ''; 
    for(var y=2026; y<=2028; y++) { 
        yrSel.innerHTML += '<option value="' + y + '">' + y + ' 年</option>'; 
    }
    for(var m=1; m<=12; m++) { 
        moSel.innerHTML += '<option value="' + m + '">' + m + ' 月</option>'; 
    }
    yrSel.value = window.state.currentYear; 
    moSel.value = window.state.currentMonth; 
    window.syncDayDropdown();
};

window.syncDayDropdown = function() {
    var daySel = document.getElementById('schedule-day-select'); 
    if(!daySel) return; 
    daySel.innerHTML = ''; 
    var totalDays = window.getDaysInMonth(window.state.currentYear, window.state.currentMonth);
    for(var d = 1; d <= totalDays; d++) { 
        daySel.innerHTML += '<option value="' + d + '">' + d + ' 日 (星期' + window.getDayOfWeekText(window.state.currentYear, window.state.currentMonth, d) + ')</option>'; 
    }
    daySel.value = window.state.currentDay; 
    daySel.onchange = function() { 
        window.state.currentDay = parseInt(this.value); 
        window.runScheduler(); 
    };
};

window.handleDateContextChange = function() {
    var yrSel = document.getElementById('schedule-year-select'); 
    var moSel = document.getElementById('schedule-month-select'); 
    if(!yrSel || !moSel) return;
    
    window.state.currentYear = parseInt(yrSel.value) || 2026; 
    window.state.currentMonth = parseInt(moSel.value) || 5;
    
    if (window.database && window.isCloudMode) { 
        window.setupFirebaseListeners(); 
    } else { 
        window.loadLocalFallbackContext(); 
    }
    window.syncDayDropdown(); 
    
    var titleEl = document.getElementById('holiday-title-text'); 
    if(titleEl) {
        titleEl.innerText = window.state.currentYear + "年" + window.state.currentMonth + "月份放假表 (管理層大表)";
    }
};

window.populateStaffDropdown = function() {
    var sel = document.getElementById('my-month-staff-select'); 
    if(!sel) return; 
    var currentSelected = sel.value; 
    sel.innerHTML = '';
    
    var found = false;
    for(var i=0; i<window.state.employees.length; i++) {
        var e = window.state.employees[i];
        sel.innerHTML += '<option value="' + e.name + '">' + e.name + ' [' + e.role + ']</option>'; 
        if(e.name === currentSelected) found = true;
    }
    if (currentSelected && found) { 
        sel.value = currentSelected; 
    }
};

window.getDaysInMonth = function(year, month) { return new Date(year, month, 0).getDate(); };
window.getDayOfWeekText = function(year, month, day) { return ['日', '一', '二', '三', '四', '五', '六'][new Date(year, month - 1, day).getDay()]; };
window.isSunday = function(year, month, day) { return new Date(year, month - 1, day).getDay() === 0; };

window.renderInteractiveReport = function(report) {
    var cacheInput = document.getElementById('current-rendered-data-cache');
    if(!cacheInput) { 
        cacheInput = document.createElement('input'); 
        cacheInput.id = 'current-rendered-data-cache'; 
        cacheInput.type = 'hidden'; 
        document.body.appendChild(cacheInput); 
    }
    cacheInput.value = JSON.stringify(report); 
    var reportContainer = document.getElementById('shops-report-container'); 
    if(!reportContainer) return; 
    reportContainer.innerHTML = '';
    
    var headerColors = { F79: '#4f46e5', GK3: '#9333ea', G38: '#d97706', G2: '#0d9488' };
    var nameOptionsHtml = '<option value="">-- 空缺 --</option>'; 
    for(var idx=0; idx<window.state.employees.length; idx++) {
        var e = window.state.employees[idx];
        nameOptionsHtml += '<option value="' + e.name + '">' + e.name + '</option>'; 
    }
    
    var isManager = (window.state.currentRole === 'manager');
    var shops = ['F79', 'GK3', 'G38', 'G2'];
    
    for(var sIdx=0; sIdx<shops.length; sIdx++) {
        var shop = shops[sIdx];
        var slotsHtml = '';
        for (var i = 0; i < 6; i++) {
            var slot = report[shop][i] || { name: '', time: '' }; 
            var currentSelectHtml = nameOptionsHtml.replace('value="' + slot.name + '"', 'value="' + slot.name + '" selected');
            var isDisabled = !isManager ? 'disabled style="opacity:0.8; background:#f3f4f6;"' : ''; 
            var noteTextHtml = '';
            
            if (slot.name && window.state.notes[slot.name] && window.state.notes[slot.name]['day_' + window.state.currentDay]) { 
                noteTextHtml = '<div class="slot-note-text" title="' + window.state.notes[slot.name]['day_' + window.state.currentDay] + '">📝 ' + window.state.notes[slot.name]['day_' + window.state.currentDay] + '</div>'; 
            }
            var timeDropdownHtml = '<select class="manual-time-select" ' + isDisabled + ' onchange="window.handleManualSlotChange(\'' + shop + '\', ' + i + ', \'time\', this.value)">' + window.generateTimeOptions(slot.time) + '</select>';
            var dragAttributes = isManager ? 'draggable="true" ondragstart="window.handleSlotDragStart(event, \'' + shop + '\', ' + i + ')" ondragover="window.handleSlotDragOver(event)" ondragleave="window.handleSlotDragLeave(event)" ondrop="window.handleSlotDrop(event, \'' + shop + '\', ' + i + ')"' : '';
            slotsHtml += '<div class="slot-box" ' + dragAttributes + ' data-shop="' + shop + '" data-index="' + i + '">' +
                            '<select class="manual-name-select" ' + isDisabled + ' onchange="window.handleManualSlotChange(\'' + shop + '\', ' + i + ', \'name\', this.value)">' + currentSelectHtml + '</select>' +
                            timeDropdownHtml +
                            noteTextHtml +
                         '</div>';
        }
        var currentCount = 0; 
        for(var rIdx=0; rIdx<report[shop].length; rIdx++) {
            if(report[shop][rIdx].name) currentCount++;
        }
        reportContainer.innerHTML += '<div class="shop-box">' +
                                        '<div class="shop-header" style="background: ' + headerColors[shop] + ';">' +
                                            '<span>' + shop + ' 店鋪</span>' +
                                            '<span>當前共：' + currentCount + ' 人</span>' +
                                        '</div>' +
                                        '<div class="grid-6">' + slotsHtml + '</div>' +
                                     '</div>';
    }
};

window.invertIndividualEmployeeHolidays = function() {
    var staffName = document.getElementById('my-month-staff-select') ? document.getElementById('my-month-staff-select').value : null; 
    if(!staffName) return; 
    var isManager = (window.state.currentRole === 'manager');
    var totalDays = window.getDaysInMonth(window.state.currentYear, window.state.currentMonth); 
    if (!window.state.localHolidaysDraft[staffName]) window.state.localHolidaysDraft[staffName] = []; 
    var inverted = [];
    
    var hols = window.state.holidays[staffName] || [];
    var drafts = window.state.localHolidaysDraft[staffName] || [];
    
    for (var d = 1; d <= totalDays; d++) {
        var isPastDay = (window.state.currentYear < 2026 || (window.state.currentYear === 2026 && window.state.currentMonth < 5) || (window.state.currentYear === 2026 && window.state.currentMonth === 5 && d < 1));
        if (isPastDay && !isManager) { 
            if (hols.indexOf(d) !== -1) inverted.push(d); 
        } else { 
            if (drafts.indexOf(d) === -1) inverted.push(d); 
        }
    }
    window.state.localHolidaysDraft[staffName] = inverted; 
    if(typeof window.renderIndividualMonthCalendar === 'function') window.renderIndividualMonthCalendar();
};

window.applyColumnFilter = function(type) {
    var btns = document.querySelectorAll('.btn-filter');
    for(var b=0; b<btns.length; b++) { btns[b].classList.remove('active'); }
    var filterBtn = document.getElementById('filter-' + type);
    if (filterBtn) filterBtn.classList.add('active');
    
    if(type === 'all') {
        var allCols = document.querySelectorAll('.col-mani, .col-app, .col-shops');
        for(var i=0; i<allCols.length; i++) allCols[i].style.display = '';
    } else if(type === 'mani') { 
        var mCols = document.querySelectorAll('.col-mani');
        for(var i=0; i<mCols.length; i++) mCols[i].style.display = '';
        var hidden1 = document.querySelectorAll('.col-app, .col-shops');
        for(var i=0; i<hidden1.length; i++) hidden1[i].style.display = 'none';
    } else if(type === 'app') { 
        var aCols = document.querySelectorAll('.col-app');
        for(var i=0; i<aCols.length; i++) aCols[i].style.display = '';
        var hidden2 = document.querySelectorAll('.col-mani, .col-shops');
        for(var i=0; i<hidden2.length; i++) hidden2[i].style.display = 'none';
    } else if(type === 'shops') { 
        var sCols = document.querySelectorAll('.col-shops');
        for(var i=0; i<sCols.length; i++) sCols[i].style.display = '';
        var hidden3 = document.querySelectorAll('.col-mani, .col-app');
        for(var i=0; i<hidden3.length; i++) hidden3[i].style.display = 'none';
    }
};

window.renderMonthlyAnalysis = function() {
    var tbody = document.getElementById('analysis-table-body'); 
    if(!tbody) return; 
    tbody.innerHTML = '';
    
    var lowBody = document.getElementById('low-staff-table-body'); 
    var highBody = document.getElementById('high-staff-table-body'); 
    if(lowBody) lowBody.innerHTML = ''; 
    if(highBody) highBody.innerHTML = '';
    
    var totalDays = window.getDaysInMonth(window.state.currentYear, window.state.currentMonth); 
    var lowStaffHtml = ""; 
    var highStaffHtml = ""; 
    var attendanceCounters = {};
    
    for(var e=0; e<window.state.employees.length; e++) {
        var empInfo = window.state.employees[e];
        attendanceCounters[empInfo.name] = { totalLeave: 0, totalWork: 0, role: empInfo.role || 'Full-time' }; 
    }
    
    for (var d = 1; d <= totalDays; d++) {
        var dayKey = 'day_' + d; 
        var finalCounts = { F79: 0, GK3: 0, G38: 0, G2: 0 }; 
        var totalWorkingApprentices = 0; 
        var dayReport = window.state.overrides[dayKey] || window.calculateDaySchedule(d).report;
        
        var shops = ['F79', 'GK3', 'G38', 'G2'];
        for(var s=0; s<shops.length; s++) {
            var shopName = shops[s];
            if (dayReport[shopName]) {
                for(var st=0; st<dayReport[shopName].length; st++) {
                    var slot = dayReport[shopName][st];
                    if(slot.name) { 
                        var staffMatch = window.state.employees.filter(function(emp) { return emp.name.replace(/\s+/g, '') === slot.name.replace(/\s+/g, ''); })[0];
                        if(staffMatch) { 
                            if(staffMatch.role === '學徒') totalWorkingApprentices++; 
                            else finalCounts[shopName]++; 
                        } 
                    } 
                }
            }
        }
        
        for(var a=0; a<window.state.employees.length; a++) {
            var empName = window.state.employees[a].name;
            var hols = window.state.holidays[empName] || [];
            if (hols.indexOf(d) !== -1) { 
                if(attendanceCounters[empName]) attendanceCounters[empName].totalLeave++; 
            } else { 
                if(attendanceCounters[empName]) attendanceCounters[empName].totalWork++; 
            } 
        }
        
        var totalWorkingMani = finalCounts.F79 + finalCounts.GK3 + finalCounts.G38 + finalCounts.G2;
        var alertBgClass = totalWorkingMani <= window.state.settings.limitLow ? "bg-alert-red" : (totalWorkingMani >= window.state.settings.limitHigh ? "bg-alert-darkgreen" : "bg-alert-lightgreen");
        var isWknd = window.getDayOfWeekText(window.state.currentYear, window.state.currentMonth, d) === '日' ? 'background:#fef2f2; font-weight:bold; color:var(--danger);' : '';
        
        var rowHtml = '<tr>' +
                        '<td style="text-align:center; font-weight:bold; width:65px;">' + d + ' 日</td>' +
                        '<td style="text-align:center; ' + isWknd + ' width:55px;">' + window.getDayOfWeekText(window.state.currentYear, window.state.currentMonth, d) + '</td>' +
                        '<td class="col-mani ' + alertBgClass + '" style="width:100px;">' + totalWorkingMani + ' 師</td>' +
                        '<td class="col-app" style="text-align:center; background:#f0fdf4; font-weight:bold; color:#0d9488; width:100px;">' + totalWorkingApprentices + ' 徒</td>' +
                        '<td class="col-shops normal-cell">' + finalCounts.F79 + '人</td>' +
                        '<td class="col-shops normal-cell">' + finalCounts.GK3 + '人</td>' +
                        '<td class="col-shops normal-cell">' + finalCounts.G38 + '人</td>' +
                        '<td class="col-shops normal-cell">' + finalCounts.G2 + '人</td>' +
                      '</tr>';
        tbody.innerHTML += rowHtml; 
        
        if(totalWorkingMani <= window.state.settings.limitLow) lowStaffHtml += rowHtml; 
        if(totalWorkingMani >= window.state.settings.limitHigh) highStaffHtml += rowHtml;
    }
    
    if(lowBody) lowBody.innerHTML = lowStaffHtml || "<tr><td style='text-align:center; padding:10px; color:#9ca3af;'>🙌 本月人手充裕。</td></tr>";
    if(highBody) highBody.innerHTML = highStaffHtml || "<tr><td style='text-align:center; padding:10px; color:#9ca3af;'>📊 本月無充沛日子。</td></tr>";
    
    var summaryBody = document.getElementById('staff-month-summary-body');
    if(summaryBody) {
        summaryBody.innerHTML = ''; 
        var attKeys = Object.keys(attendanceCounters);
        for(var y=0; y<attKeys.length; y++) {
            var n = attKeys[y];
            var info = attendanceCounters[n];
            summaryBody.innerHTML += '<tr>' +
                                        '<td style="padding:6px 10px; font-weight:bold;">' + n + '</td>' +
                                        '<td style="text-align:center;">' + info.role + '</td>' +
                                        '<td style="text-align:center; color:var(--success);">' + info.totalWork + ' 天</td>' +
                                        '<td style="text-align:center; color:var(--danger);">' + info.totalLeave + ' 天</td>' +
                                      '</tr>';
        }
    }
    window.applyColumnFilter('all'); 
};

window.renderHolidayTable = function() {
    var headerRow = document.getElementById('holiday-table-header-row'); 
    var tbody = document.getElementById('holiday-table-body'); 
    if(!headerRow || !tbody) return; 
    headerRow.innerHTML = ''; 
    tbody.innerHTML = '';
    
    var totalDays = window.getDaysInMonth(window.state.currentYear, window.state.currentMonth); 
    headerRow.innerHTML += '<th class="sticky-col">員工放假總覽 📊</th>';
    
    for(var d=1; d<=totalDays; d++) { 
        var dayReport = window.state.overrides['day_' + d] || window.calculateDaySchedule(d).report; 
        var tApp = 0; 
        var activeUniqueManiArr = [];
        
        if (dayReport['F79']) {
            var combinedSlots = dayReport['F79'].concat(dayReport['GK3'] || [], dayReport['G38'] || [], dayReport['G2'] || []);
            for(var st=0; st<combinedSlots.length; st++) {
                var slot = combinedSlots[st];
                if(slot.name) { 
                    var staff = window.state.employees.filter(function(e) { return e.name.replace(/\s+/g, '') === slot.name.replace(/\s+/g, ''); })[0];
                    if(staff) { 
                        if(staff.role === '學徒') {
                            tApp++; 
                        } else {
                            if(activeUniqueManiArr.indexOf(staff.name) === -1) activeUniqueManiArr.push(staff.name);
                        }
                    } 
                } 
            }
        }
        headerRow.innerHTML += '<th style="text-align:center; min-width:42px; background:#f8fafc;">' +
                                '<span style="color:var(--primary); display:block;">' + activeUniqueManiArr.length + '師</span>' +
                                '<span style="color:#0d9488; display:block;">' + tApp + '徒</span>' +
                                '<b>' + d + '</b><br>' +
                                '<span style="font-size:9px; font-weight:normal;">' + window.getDayOfWeekText(window.state.currentYear, window.state.currentMonth, d) + '</span>' +
                               '</th>'; 
    }
    
    for(var e=0; e<window.state.employees.length; e++) {
        var emp = window.state.employees[e];
        var dotsHtml = ''; 
        var userHols = window.state.holidays[emp.name] || [];
        for(var hd = 1; hd <= totalDays; hd++) { 
            var isActive = (userHols.indexOf(hd) !== -1) ? 'active' : ''; 
            var dotText = (userHols.indexOf(hd) !== -1) ? '假' : '-'; 
            dotsHtml += '<td><span class="holiday-display-dot ' + isActive + '">' + dotText + '</span></td>'; 
        }
        tbody.innerHTML += '<tr>' +
                            '<td class="sticky-col">' +
                                '<span class="count-badge">' + userHols.length + '天</span>' +
                                '<b>' + emp.name + '</b>' +
                            '</td>' +
                            dotsHtml +
                           '</tr>';
    }
};

window.handleManualSlotChange = function(shop, index, field, value) {
    var dayKey = 'day_' + window.state.currentDay; 
    var cacheInput = document.getElementById('current-rendered-data-cache');
    if (!cacheInput) return;

    if (!window.state.overrides[dayKey]) { 
        window.state.overrides[dayKey] = JSON.parse(cacheInput.value); 
    }
    window.state.overrides[dayKey][shop][index][field] = value; 
    var monthKey = window.state.currentYear + '-' + (window.state.currentMonth < 10 ? '0' + window.state.currentMonth : window.state.currentMonth);
    if(window.isCloudMode && window.database) { 
        window.database.ref('v8_overrides/' + monthKey + '/' + dayKey).set(window.state.overrides[dayKey]); 
    } else { 
        localStorage.setItem('v8_overrides_' + monthKey, JSON.stringify(window.state.overrides)); 
        window.refreshBadgesOnly(window.state.overrides[dayKey]); 
    }
};

window.resetCurrentDayToAuto = function() {
    var monthKey = window.state.currentYear + '-' + (window.state.currentMonth < 10 ? '0' + window.state.currentMonth : window.state.currentMonth);
    if(window.isCloudMode && window.database) { 
        window.database.ref('v8_overrides/' + monthKey + '/day_' + window.state.currentDay).remove(); 
    } else { 
        if(window.state.overrides['day_' + window.state.currentDay]) { 
            delete window.state.overrides['day_' + window.state.currentDay]; 
            localStorage.setItem('v8_overrides_' + monthKey, JSON.stringify(window.state.overrides)); 
            window.runScheduler(); 
        } 
    }
};

window.refreshBadgesOnly = function(reportData) {
    var shopCounts = { F79: 0, GK3: 0, G38: 0, G2: 0 }; 
    var shops = ['F79', 'GK3', 'G38', 'G2'];
    for(var s=0; s<shops.length; s++) {
        var shop = shops[s];
        if (reportData[shop]) {
            for(var r=0; r<reportData[shop].length; r++) {
                if(reportData[shop][r].name) shopCounts[shop]++; 
            }
        }
    }
    window.renderMonitorBadges(shopCounts);
};

window.actionApproveHoliday = function(key, staffName, requestedHolidays) {
    if (window.state.currentRole !== 'manager') return;
    var monthKey = window.state.currentYear + '-' + (window.state.currentMonth < 10 ? '0' + window.state.currentMonth : window.state.currentMonth);
    
    var currentHols = window.state.holidays[staffName] || [];
    for(var i=0; i<requestedHolidays.length; i++) {
        if (currentHols.indexOf(requestedHolidays[i]) === -1) {
            currentHols.push(requestedHolidays[i]);
        }
    }
    window.state.holidays[staffName] = currentHols.sort(function(a, b) { return a - b; });
    
    if (window.isCloudMode && window.database) {
        window.database.ref('v8_holidays/' + monthKey + '/' + staffName).set(window.state.holidays[staffName])
        .then(function() {
            return window.database.ref('v8_pending_approvals/' + monthKey + '/' + key).remove();
        })
        .then(function() {
            if(window.showToastMessage) window.showToastMessage("🎉 已批准 " + staffName + " 老師的放假申請！");
        })
        .catch(function(err) {
            alert("審批失敗: " + err.message);
        });
    } else {
        localStorage.setItem('v8_holidays_' + monthKey, JSON.stringify(window.state.holidays));
        if(window.showToastMessage) window.showToastMessage("🎉 本地已批准 " + staffName + " 老師的放假申請！");
        window.runScheduler();
    }
};

window.runScheduler = function() {
    var leavesToday = []; 
    for(var i=0; i<window.state.employees.length; i++) {
        var emp = window.state.employees[i];
        if ((window.state.holidays[emp.name] || []).indexOf(window.state.currentDay) !== -1) {
            leavesToday.push(emp.name); 
        }
    }
    
    var dayKey = 'day_' + window.state.currentDay; 
    var report = {}; 
    var activeStaff = [];
    for(var i=0; i<window.state.employees.length; i++) {
        if((window.state.holidays[window.state.employees[i].name] || []).indexOf(window.state.currentDay) === -1) {
            activeStaff.push(window.state.employees[i]);
        }
    }
    
    var manicurists = [];
    var apprentices = [];
    for(var i=0; i<activeStaff.length; i++) {
        if(activeStaff[i].role === '學徒') apprentices.push(activeStaff[i]);
        else manicurists.push(activeStaff[i]);
    }
    
    var totalTextEl = document.getElementById('total-working-text'); 
    var leaveBoxEl = document.getElementById('today-leave-names-box');
    
    if (window.state.overrides[dayKey]) {
        report = window.state.overrides[dayKey];
        if(totalTextEl) {
            totalTextEl.innerHTML = window.state.currentMonth + "月 " + window.state.currentDay + " 日 (星期" + window.getDayOfWeekText(window.state.currentYear, window.state.currentMonth, window.state.currentDay) + ") 美甲師：<b>" + manicurists.length + "</b> 人 ｜ 學徒：<b>" + apprentices.length + "</b> 人 ｜ 總上班：<b>" + activeStaff.length + "</b> 人 (⚠️手動微調模式)";
        }
        if(leaveBoxEl) {
            leaveBoxEl.innerHTML = "今日放假：" + (leavesToday.length > 0 ? leavesToday.join(', ') : '無');
        }
        window.refreshBadgesOnly(report); 
        window.renderInteractiveReport(report); 
        return;
    }
    
    var result = window.calculateDaySchedule(window.state.currentDay); 
    report = result.report;
    if(totalTextEl) {
        totalTextEl.innerHTML = window.state.currentMonth + "月 " + window.state.currentDay + " 日 (星期" + window.getDayOfWeekText(window.state.currentYear, window.state.currentMonth, window.state.currentDay) + ") 美甲師：<b>" + result.manicuristCount + "</b> 人 ｜ 學徒：<b>" + apprentices.length + "</b> 人 ｜ 總上班：<b>" + result.totalCount + "</b> 人";
    }
    if(leaveBoxEl) {
        leaveBoxEl.innerHTML = "今日放假：" + (leavesToday.length > 0 ? leavesToday.join(', ') : '無');
    }
    window.refreshBadgesOnly(report); 
    window.renderInteractiveReport(report);
};

window.calculateDaySchedule = function(dayNumber) {
    var report = { F79: [], GK3: [], G38: [], G2: [] }; 
    var isSun = window.isSunday(window.state.currentYear, window.state.currentMonth, dayNumber);
    
    var activeStaff = [];
    for(var e=0; e<window.state.employees.length; e++) {
        if((window.state.holidays[window.state.employees[e].name] || []).indexOf(dayNumber) === -1) {
            activeStaff.push(window.state.employees[e]);
        }
    }
    
    var manicurists = [];
    var apprentices = [];
    for(var e=0; e<activeStaff.length; e++) {
        if(activeStaff[e].role === '學徒') apprentices.push(activeStaff[e]);
        else manicurists.push(activeStaff[e]);
    }
    
    var M = manicurists.length; 
    var targets = { F79: 3, G2: 3, GK3: 3, G38: 3 };
    
    if (M <= 11) {
        targets.F79 = 2; 
        var rem = M - 2; 
        targets.G2 = Math.max(0, Math.min(3, rem)); 
        rem -= targets.G2; 
        targets.GK3 = Math.max(0, Math.min(3, rem)); 
        rem -= targets.GK3; 
        targets.G38 = Math.max(0, Math.min(3, rem)); 
    } else {
        targets.F79 = 3; 
        targets.GK3 = 3; 
        var surplus = M - 12; 
        var baseSurplus = Math.floor(surplus / 2); 
        var remSurplus = surplus % 2; 
        targets.G2 = 3 + baseSurplus + remSurplus; 
        targets.G38 = 3 + baseSurplus;
    }
    
    var sortedMani = [].concat(manicurists).sort(function(a, b) { 
        return (a.p_shops || 'G2').split(',').length - (b.p_shops || 'G2').split(',').length; 
    }); 
    var assignment = {}; 
    var currentCounts = { F79: 0, GK3: 0, G38: 0, G2: 0 }; 
    var unassignedMani = [];
    
    for(var m=0; m<sortedMani.length; m++) {
        var emp = sortedMani[m];
        var allowedRaw = (emp.p_shops || 'G2').split(',');
        var allowed = [];
        for(var i=0; i<allowedRaw.length; i++) allowed.push(allowedRaw[i].trim());
        
        var primaryShop = allowed[0] || 'G2'; 
        if (currentCounts[primaryShop] < targets[primaryShop]) { 
            currentCounts[primaryShop]++; 
            assignment[emp.name] = primaryShop; 
        } else { 
            unassignedMani.push(emp); 
        } 
    }
    
    for(var u=0; u<unassignedMani.length; u++) {
        var empU = unassignedMani[u];
        var allowedRaw2 = (empU.p_shops || 'G2').split(',');
        var allowed2 = [];
        for(var i=0; i<allowedRaw2.length; i++) allowed2.push(allowedRaw2[i].trim());
        
        var assigned = false; 
        for (var i = 0; i < allowed2.length; i++) {
            var shop = allowed2[i];
            if (currentCounts[shop] < targets[shop]) { 
                currentCounts[shop]++; 
                assignment[empU.name] = shop; 
                assigned = true; 
                break; 
            } 
        } 
        if (!assigned) { 
            var primaryShop2 = allowed2[0] || 'G2'; 
            currentCounts[primaryShop2]++; 
            assignment[empU.name] = primaryShop2; 
        } 
    }
    
    for(var a=0; a<apprentices.length; a++) {
        var app = apprentices[a];
        var allowedRaw3 = (app.p_shops || 'G2').split(',');
        var allowed3 = [];
        for(var i=0; i<allowedRaw3.length; i++) allowed3.push(allowedRaw3[i].trim());
        
        var bestShop = allowed3[0] || 'G2'; 
        var minCount = 999; 
        for(var i = 0; i < allowed3.length; i++) {
            var shop3 = allowed3[i];
            if(currentCounts[shop3] < minCount) { 
                minCount = currentCounts[shop3]; 
                bestShop = shop3; 
            } 
        } 
        assignment[app.name] = bestShop; 
        currentCounts[bestShop]++; 
    }
    
    var shopGroups = { F79: [], GK3: [], G38: [], G2: [] }; 
    for(var x=0; x<activeStaff.length; x++) {
        var shopG = assignment[activeStaff[x].name] || 'G2'; 
        shopGroups[shopG].push(activeStaff[x]); 
    }
    
    for(var i=0; i<shopGroups.F79.length; i++) {
        var emp = shopGroups.F79[i];
        var shift = (i === 0) ? "早班" : "晚班"; 
        var t = window.autoExtractTime(emp, shift, isSun, 'F79'); 
        report.F79.push({ name: emp.name, time: t }); 
    }
    
    var ordinaryShops = ['G2', 'GK3', 'G38'];
    for(var o=0; o<ordinaryShops.length; o++) {
        var shopO = ordinaryShops[o];
        var list = shopGroups[shopO]; 
        if (list.length === 0) continue;
        
        var earlyIdx = -1;
        for(var l=0; l<list.length; l++) {
            var empL = list[l];
            if(empL.role !== '學徒') {
                var tArr = (empL.times || '').split(',');
                var hasEarly = false;
                for(var y=0; y<tArr.length; y++) {
                    if(parseInt(tArr[y].trim().split(':')[0]) < 12) { hasEarly = true; break; }
                }
                if(hasEarly) { earlyIdx = l; break; }
            }
        }
        if (earlyIdx === -1) earlyIdx = 0; 
        var earlyEmp = list[earlyIdx]; 
        
        var remainingWorkers = [];
        for(var l=0; l<list.length; l++) {
            if(l !== earlyIdx) remainingWorkers.push(list[l]);
        }
        
        var earlyTime = window.autoExtractTime(earlyEmp, '早班', isSun, shopO); 
        report[shopO].push({ name: earlyEmp.name, time: earlyTime });
        
        for(var r=0; r<remainingWorkers.length; r++) {
            var empR = remainingWorkers[r];
            var shift2 = isSun ? "中班" : ((r < Math.ceil(remainingWorkers.length / 2)) ? "中班" : "晚班"); 
            var t2 = window.autoExtractTime(empR, shift2, isSun, shopO); 
            report[shopO].push({ name: empR.name, time: t2 }); 
        }
    }
    
    var allShops = ['F79', 'GK3', 'G38', 'G2'];
    for(var a=0; a<allShops.length; a++) {
        var shop = allShops[a];
        while(report[shop].length < 6) { 
            report[shop].push({ name: '', time: '' }); 
        } 
    } 
    return { report: report, manicuristCount: M, totalCount: activeStaff.length };
};

window.autoExtractTime = function(emp, shift, isSun, shop) {
    if (shop === 'F79') return (shift === '早班') ? (isSun ? '11:00' : '12:00') : '13:00';
    var userTimesRaw = (emp.times || '').split(',');
    var userTimes = [];
    for(var i=0; i<userTimesRaw.length; i++) userTimes.push(userTimesRaw[i].trim());
    
    if (isSun) return (shift === '早班') ? '10:00' : '12:00';
    
    var primaryTime = userTimes[0] || '12:00'; 
    var primaryHour = parseInt(primaryTime.split(':')[0]);
    
    if (shift === '早班') { 
        if(primaryHour < 12) return primaryTime;
        for(var i=0; i<userTimes.length; i++) {
            if(parseInt(userTimes[i].split(':')[0]) < 12) return userTimes[i];
        }
        return '11:00';
    } else if (shift === '中班') { 
        if(primaryHour === 12) return primaryTime;
        for(var i=0; i<userTimes.length; i++) {
            if(userTimes[i] === '12:00') return '12:00';
        }
        return '12:00';
    } else { 
        if(primaryHour >= 13) return primaryTime;
        for(var i=0; i<userTimes.length; i++) {
            if(parseInt(userTimes[i].split(':')[0]) >= 13) return userTimes[i];
        }
        return '13:00';
    }
};

window.downloadTimeCapsuleBackup = function() {
    var monthKey = window.state.currentYear + '-' + (window.state.currentMonth < 10 ? '0' + window.state.currentMonth : window.state.currentMonth);
    var backupPackage = { v8_employees: window.state.employees, v8_holidays: window.state.holidays, v8_overrides: window.state.overrides, v8_settings: window.state.settings, v8_special_notes: window.state.notes };
    var blob = new Blob([JSON.stringify(backupPackage, null, 2)], { type: 'text/plain' });
    var anchor = document.createElement('a'); 
    anchor.download = "Crystal_Pavilion_V11_Backup_[" + monthKey + "].txt"; 
    anchor.href = window.URL.createObjectURL(blob); 
    anchor.click();
};

window.triggerBackupUploadClick = function() { 
    var fileInput = document.getElementById('time-capsule-file-injector');
    if (fileInput) fileInput.click(); 
};

window.restoreFromTimeCapsule = function(event) {
    var file = event.target.files[0]; 
    if (!file) return; 
    var reader = new FileReader();
    reader.onload = function(e) {
        try {
            var pkg = JSON.parse(e.target.result); 
            if (!pkg.v8_employees || !pkg.v8_holidays) { 
                alert('❌ 備份檔格式不符！'); 
                return; 
            }
            if (confirm('確定要一鍵還原雲端所有資料？此動作無法復原！')) {
                var monthKey = window.state.currentYear + '-' + (window.state.currentMonth < 10 ? '0' + window.state.currentMonth : window.state.currentMonth);
                if (window.isCloudMode && window.database) { 
                    window.database.ref('v8_employees').set(pkg.v8_employees); 
                    window.database.ref('v8_holidays/' + monthKey).set(pkg.v8_holidays); 
                    window.database.ref('v8_overrides/' + monthKey).set(pkg.v8_overrides || {}); 
                    window.database.ref('v8_special_notes/' + monthKey).set(pkg.v8_special_notes || {});
                    if(pkg.v8_settings) window.database.ref('v8_settings').set(pkg.v8_settings); 
                    alert('🟢 已完美還原覆蓋雲端！'); 
                } 
            }
        } catch(err) { alert('讀取檔案失敗。'); }
    }; 
    reader.readAsText(file);
};

