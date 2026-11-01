/**
 * 🔮 分店智能排班系統 V11.5-Ultimate Pro - 核心邏輯引擎 (app.js - 支援 G19B 五店完全體)
 */

// ==================== 1. 全域狀態管理與預設資料 ====================
window.state = {
    employees: [],
    currentYear: 2026,
    currentMonth: 5,
    currentDay: 1,
    holidays: {},
    overrides: {},
    notes: {},
    pendingApprovals: {},
    currentRole: 'none', // 'none' | 'employee' | 'manager'
    localHolidaysDraft: {},
    settings: {
        webTitle: "分店智能排班系統 V11.5-Ultimate Pro",
        lockDay: 26,
        maxFtLeave: 4,
        maxPtLeave: 10,
        limitLow: 12,  // 告急線：美甲師 <= 12 人
        limitHigh: 15, // 充沛線：美甲師 >= 15 人
        passEmployee: "1234",
        passManager: "8888"
    }
};

window.isCloudMode = false;
window.database = null;

// 預設員工名單 (預設支援店鋪已加入 G19B)
const defaultEmployeesList = [
    { id: "101", name: "阿平", role: "Full-time", p_shops: "G2, G38, GK3, F79, G19B", times: "12:00, 13:00", password: "101" },
    { id: "102", name: "RUBY", role: "Part-time", p_shops: "G2, G38, GK3, G19B", times: "11:00, 18:00", password: "102" },
    { id: "103", name: "如意", role: "Full-time", p_shops: "F79, G19B", times: "12:00", password: "103" },
    { id: "104", name: "影", role: "Full-time", p_shops: "F79, G19B", times: "13:00, 14:00", password: "104" },
    { id: "105", name: "慧嫻", role: "Full-time", p_shops: "F79, G19B", times: "13:00", password: "105" },
    { id: "106", name: "二妹", role: "Full-time", p_shops: "G2, G38, GK3, G19B", times: "12:00, 11:00, 13:00", password: "106" },
    { id: "107", name: "TT", role: "Part-time", p_shops: "G38, G19B", times: "10:30, 11:00", password: "107" },
    { id: "108", name: "Cici", role: "Full-time", p_shops: "G38, G19B", times: "11:00, 12:00, 10:30", password: "108" },
    { id: "109", name: "珍", role: "Full-time", p_shops: "GK3, G2, G38, G19B", times: "11:00, 12:00, 13:00", password: "109" },
    { id: "110", name: "Jackie", role: "Part-time", p_shops: "G38, G19B", times: "13:00, 14:00", password: "110" },
    { id: "111", name: "澄澄", role: "Full-time", p_shops: "G2, GK3, G19B", times: "11:00", password: "111" },
    { id: "112", name: "ALICE", role: "Full-time", p_shops: "G2, G38, GK3, G19B", times: "12:00, 13:00", password: "112" },
    { id: "113", name: "阿璇", role: "Full-time", p_shops: "G2, G38, GK3, F79, G19B", times: "13:00, 12:00", password: "113" },
    { id: "114", name: "Mandy婷", role: "Full-time", p_shops: "G2, GK3, G38, F79, G19B", times: "12:00, 11:00, 13:00", password: "114" },
    { id: "115", name: "妙妙", role: "Part-time", p_shops: "G2, GK3, F79, G38, G19B", times: "13:00, 12:00", password: "115" },
    { id: "116", name: "葉子", role: "Full-time", p_shops: "GK3, G38, G2, G19B", times: "12:00, 13:00", password: "116" },
    { id: "117", name: "Lucia", role: "Full-time", p_shops: "GK3, G38, G2, F79, G19B", times: "13:00, 12:00", password: "117" },
    { id: "118", name: "AMY", role: "Full-time", p_shops: "G2, G38, GK3, G19B", times: "13:00, 12:00", password: "118" },
    { id: "119", name: "小茹", role: "學徒", p_shops: "G2, G38, GK3, F79, G19B", times: "13:00", password: "119" },
    { id: "120", name: "文君", role: "學徒", p_shops: "G2, G38, GK3, G19B", times: "11:00, 12:00, 13:00", password: "120" }
];

// 所有分店列表
const ALL_SHOPS = ['F79', 'GK3', 'G38', 'G2', 'G19B'];

// ==================== 2. Firebase 初始化與數據閘 ====================
let empRef, holRef, ovrRef, appRef, noteRef, cfgRef;
let cloudLoads = { emp: false, hol: false, ovr: false, note: false, cfg: false };

function initFirebaseConnection() {
    if (typeof firebase !== 'undefined') {
        try {
            if (!firebase.apps.length) {
                firebase.initializeApp({
                    apiKey: "AIzaSyCsfaqMDLYAxXMW5ivDHAgJEwnFA5MuvqM",
                    authDomain: "cp-schedule.firebaseapp.com",
                    databaseURL: "https://cp-schedule-default-rtdb.firebaseio.com/",
                    projectId: "cp-schedule",
                    storageBucket: "cp-schedule.firebasestorage.app",
                    messagingSenderId: "136891249500",
                    appId: "1:136891249500:web:f3278b3ce642dc8d454799"
                });
            }
            window.database = firebase.database();
            
            window.database.ref(".info/connected").on("value", function(snap) {
                const ind = document.getElementById('cloud-indicator');
                if (snap.val() === true) {
                    window.isCloudMode = true;
                    if (ind) {
                        ind.className = "cloud-status status-online";
                        ind.innerText = "🟢 雲端天線連線成功！五店智能排班晶片運作中";
                    }
                    handleDateContextChange();
                } else {
                    window.isCloudMode = false;
                    if (ind) {
                        ind.className = "cloud-status status-offline";
                        ind.innerText = "⚠️ 離線模式下運作（本地快取保護中）";
                    }
                }
            });
        } catch (e) {
            console.error("Firebase 初始化失敗：", e);
            loadLocalFallbackContext();
        }
    } else {
        loadLocalFallbackContext();
    }
}

function setupFirebaseListeners() {
    if (!window.database || !window.isCloudMode) return;
    const monthKey = `${window.state.currentYear}-${window.state.currentMonth < 10 ? '0' + window.state.currentMonth : window.state.currentMonth}`;
    cloudLoads = { emp: false, hol: false, ovr: false, note: false, cfg: false };

    if (empRef) empRef.off();
    if (holRef) holRef.off();
    if (ovrRef) ovrRef.off();
    if (appRef) appRef.off();
    if (noteRef) noteRef.off();
    if (cfgRef) cfgRef.off();

    empRef = window.database.ref('v8_employees');
    empRef.on('value', (snapshot) => {
        if (snapshot.exists()) {
            window.state.employees = snapshot.val();
        } else {
            window.state.employees = JSON.parse(JSON.stringify(defaultEmployeesList));
            window.database.ref('v8_employees').set(window.state.employees);
        }
        cloudLoads.emp = true;
        triggerSafeUIRender();
    });

    holRef = window.database.ref(`v8_holidays/${monthKey}`);
    holRef.on('value', (snapshot) => {
        window.state.holidays = snapshot.exists() ? snapshot.val() : {};
        window.state.localHolidaysDraft = JSON.parse(JSON.stringify(window.state.holidays));
        cloudLoads.hol = true;
        triggerSafeUIRender();
    });

    ovrRef = window.database.ref(`v8_overrides/${monthKey}`);
    ovrRef.on('value', (snapshot) => {
        window.state.overrides = snapshot.exists() ? snapshot.val() : {};
        cloudLoads.ovr = true;
        triggerSafeUIRender();
    });

    noteRef = window.database.ref(`v8_special_notes/${monthKey}`);
    noteRef.on('value', (snapshot) => {
        window.state.notes = snapshot.exists() ? snapshot.val() : {};
        cloudLoads.note = true;
        triggerSafeUIRender();
    });

    cfgRef = window.database.ref('v8_settings');
    cfgRef.on('value', (snapshot) => {
        if (snapshot.exists()) {
            window.state.settings = Object.assign({}, window.state.settings, snapshot.val());
        }
        cloudLoads.cfg = true;
        triggerSafeUIRender();
    });

    appRef = window.database.ref(`v8_pending_approvals/${monthKey}`);
    appRef.on('value', (snapshot) => {
        window.state.pendingApprovals = snapshot.exists() ? snapshot.val() : {};
        if (typeof window.renderPendingApprovalsBox === 'function') {
            window.renderPendingApprovalsBox();
        }
    });
}

function triggerSafeUIRender() {
    // 🛡️ 1. 安全防線：確保全域物件存在，防止 TypeError 崩潰
    window.state = window.state || {};
    window.state.holidays = window.state.holidays || {};
    window.state.localHolidaysDraft = window.state.localHolidaysDraft || {};
    window.state.employees = window.state.employees || [];

    // 📅 2. 強制優先初始化年月選單
    if (typeof initYearMonthDropdowns === 'function') {
        initYearMonthDropdowns();
    }

    // ☁️ 3. 雲端資料載入檢查與防禦呼叫
    const isCloudReady = typeof cloudLoads === 'undefined' || 
        (cloudLoads.emp && cloudLoads.hol && cloudLoads.ovr && cloudLoads.note && cloudLoads.cfg);

    if (isCloudReady) {
        (window.state.employees || []).forEach(e => {
            if (e && e.name) {
                if (!window.state.holidays[e.name]) window.state.holidays[e.name] = [];
                if (!window.state.localHolidaysDraft[e.name]) window.state.localHolidaysDraft[e.name] = [];
            }
        });

        // 4. 容錯執行各模組渲染，即使單個模組出錯也不影響其他區塊
        if (typeof renderEmployeeTable === 'function') renderEmployeeTable();
        if (typeof populateStaffDropdown === 'function') populateStaffDropdown();
        if (typeof runScheduler === 'function') runScheduler();
        if (typeof renderMonthlyAnalysis === 'function') renderMonthlyAnalysis();
        if (typeof renderIndividualMonthCalendar === 'function') renderIndividualMonthCalendar();
        if (typeof renderHolidayTable === 'function') renderHolidayTable();
        if (typeof syncSettingsToForm === 'function') syncSettingsToForm();
    }
}


// ==================== 3. 日期 context 與選單控制 ====================
function calculateAutoDefaultDate() {
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
            hintBanner.innerHTML = `🌞 系統提示：目前為日間時段，正顯示【今日 ${month}月${day}日】排班表（今晚 20:00 自動切換）`;
            hintBanner.style.color = "#059669";
        }
    }
}

function initYearMonthDropdowns() {
    const yrSel = document.getElementById('schedule-year-select');
    const moSel = document.getElementById('schedule-month-select');
    if (!yrSel || !moSel) return;

    yrSel.innerHTML = '';
    moSel.innerHTML = '';

    for (let y = 2026; y <= 2028; y++) {
        yrSel.innerHTML += `<option value="${y}">${y} 年</option>`;
    }
    for (let m = 1; m <= 12; m++) {
        moSel.innerHTML += `<option value="${m}">${m} 月</option>`;
    }

    yrSel.value = window.state.currentYear;
    moSel.value = window.state.currentMonth;
    syncDayDropdown();
}

function syncDayDropdown() {
    const daySel = document.getElementById('schedule-day-select');
    if (!daySel) return;

    daySel.innerHTML = '';
    let totalDays = window.getDaysInMonthFallback(window.state.currentYear, window.state.currentMonth);
    for (let d = 1; d <= totalDays; d++) {
        daySel.innerHTML += `<option value="${d}">${d} 日 (星期${window.getDayOfWeekText(window.state.currentYear, window.state.currentMonth, d)})</option>`;
    }
    daySel.value = window.state.currentDay;
    daySel.onchange = function() {
        window.state.currentDay = parseInt(this.value);
        runScheduler();
    };
}

function handleDateContextChange() {
    const yrSel = document.getElementById('schedule-year-select');
    const moSel = document.getElementById('schedule-month-select');
    if (yrSel && moSel) {
        window.state.currentYear = parseInt(yrSel.value);
        window.state.currentMonth = parseInt(moSel.value);
    }

    if (window.database && window.isCloudMode) {
        setupFirebaseListeners();
    } else {
        loadLocalFallbackContext();
    }
    syncDayDropdown();

    const holTitle = document.getElementById('holiday-title-text');
    if (holTitle) {
        holTitle.innerText = `${window.state.currentYear}年${window.state.currentMonth}月份放假表 (管理層審閱大表)`;
    }
}

function populateStaffDropdown() {
    const sel = document.getElementById('my-month-staff-select');
    if (!sel) return;

    const currentSelected = sel.value;
    sel.innerHTML = '';
    (window.state.employees || []).forEach(e => {
        sel.innerHTML += `<option value="${e.name}">${e.name} [${e.role}]</option>`;
    });

    if (currentSelected && window.state.employees.some(e => e.name === currentSelected)) {
        sel.value = currentSelected;
    }
}

// ==================== 4. 核心動態排班演算法 (包含 G19B) ====================
function calculateDaySchedule(dayNumber) {
    let report = { F79: [], GK3: [], G38: [], G2: [], G19B: [] };
    let isSun = window.isSunday ? window.isSunday(window.state.currentYear, window.state.currentMonth, dayNumber) : (new Date(window.state.currentYear, window.state.currentMonth - 1, dayNumber).getDay() === 0);
    
    const activeStaff = (window.state.employees || []).filter(e => !(window.state.holidays[e.name] || []).includes(dayNumber));
    const manicurists = activeStaff.filter(e => e.role !== '學徒');
    const apprentices = activeStaff.filter(e => e.role === '學徒');
    let M = manicurists.length;

    // 定義五店目標人數
    let targets = { F79: 3, G2: 3, GK3: 3, G38: 3, G19B: 3 };
    if (M <= 14) {
        targets.F79 = 2;
        let rem = M - 2;
        targets.G2 = Math.max(0, Math.min(3, rem)); rem -= targets.G2;
        targets.GK3 = Math.max(0, Math.min(3, rem)); rem -= targets.GK3;
        targets.G38 = Math.max(0, Math.min(3, rem)); rem -= targets.G38;
        targets.G19B = Math.max(0, Math.min(3, rem)); rem -= targets.G19B;
    } else {
        targets.F79 = 3;
        targets.GK3 = 3;
        let surplus = M - 15;
        let baseSurplus = Math.floor(surplus / 3);
        let remSurplus = surplus % 3;
        targets.G2 = 3 + baseSurplus + (remSurplus > 0 ? 1 : 0);
        targets.G38 = 3 + baseSurplus + (remSurplus > 1 ? 1 : 0);
        targets.G19B = 3 + baseSurplus;
    }

    let sortedMani = [...manicurists].sort((a,b) => (a.p_shops || 'G2').split(',').length - (b.p_shops || 'G2').split(',').length);
    let assignment = {};
    let currentCounts = { F79: 0, GK3: 0, G38: 0, G2: 0, G19B: 0 };
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

    // 分配學徒至最缺人手店鋪
    apprentices.forEach(app => {
        let allowed = (app.p_shops || 'G2').split(',').map(s => s.trim());
        let bestShop = allowed[0] || 'G2';
        let minCount = 999;
        for (let shop of allowed) {
            if ((currentCounts[shop] || 0) < minCount) {
                minCount = currentCounts[shop] || 0;
                bestShop = shop;
            }
        }
        assignment[app.name] = bestShop;
        currentCounts[bestShop] = (currentCounts[bestShop] || 0) + 1;
    });

    let shopGroups = { F79: [], GK3: [], G38: [], G2: [], G19B: [] };
    activeStaff.forEach(emp => {
        let shop = assignment[emp.name] || 'G2';
        if (!shopGroups[shop]) shopGroups[shop] = [];
        shopGroups[shop].push(emp);
    });

    // 班次時間填寫
    shopGroups.F79.forEach((emp, idx) => {
        let shift = (idx === 0) ? "早班" : "晚班";
        let t = autoExtractTime(emp, shift, isSun, 'F79');
        report.F79.push({ name: emp.name, time: `${shift} (${t})` });
    });

    ['G2', 'GK3', 'G38', 'G19B'].forEach(shop => {
        let list = shopGroups[shop] || [];
        if (list.length === 0) return;
        let earlyIdx = list.findIndex(emp => emp.role !== '學徒' && (emp.times || '').split(',').map(t => t.trim()).some(t => parseInt(t.split(':')[0]) < 12));
        if (earlyIdx === -1) earlyIdx = 0;
        let earlyEmp = list[earlyIdx];
        let remainingWorkers = list.filter((_, idx) => idx !== earlyIdx);

        let earlyTime = autoExtractTime(earlyEmp, '早班', isSun, shop);
        report[shop].push({ name: earlyEmp.name, time: `早班 (${earlyTime})` });
        remainingWorkers.forEach((emp, remIdx) => {
            let shift = isSun ? "中班" : ((remIdx < Math.ceil(remainingWorkers.length / 2)) ? "中班" : "晚班");
            let t = autoExtractTime(emp, shift, isSun, shop);
            report[shop].push({ name: emp.name, time: `${shift} (${t})` });
        });
    });

    ALL_SHOPS.forEach(shop => {
        while (report[shop].length < 6) {
            report[shop].push({ name: '', time: '' });
        }
    });

    return { report, manicuristCount: M, totalCount: activeStaff.length };
}

function autoExtractTime(emp, shift, isSun, shop) {
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
}

function runScheduler() {
    let leavesToday = [];
    (window.state.employees || []).forEach(emp => {
        if ((window.state.holidays[emp.name] || []).includes(window.state.currentDay)) {
            leavesToday.push(emp.name);
        }
    });

    const dayKey = `day_${window.state.currentDay}`;
    let report = {};
    let activeStaff = (window.state.employees || []).filter(e => !(window.state.holidays[e.name] || []).includes(window.state.currentDay));
    let manicurists = activeStaff.filter(e => e.role !== '學徒');
    let apprentices = activeStaff.filter(e => e.role === '學徒');

    if (window.state.overrides[dayKey]) {
        report = window.state.overrides[dayKey];
        const txtEl = document.getElementById('total-working-text');
        if (txtEl) {
            txtEl.innerHTML = `${window.state.currentMonth}月 ${window.state.currentDay} 日 (星期${window.getDayOfWeekText(window.state.currentYear, window.state.currentMonth, window.state.currentDay)}) 核心美甲師：<b>${manicurists.length}</b> 人 ｜ 學徒：<b>${apprentices.length}</b> 人 ｜ 總上班：<b>${activeStaff.length}</b> 人 (⚠️手動微調模式)`;
        }
        const leaveEl = document.getElementById('today-leave-names-box');
        if (leaveEl) {
            leaveEl.innerHTML = `今日放假：${leavesToday.length > 0 ? leavesToday.join(', ') : '無'}`;
        }
        refreshBadgesOnly(report);
        renderInteractiveReport(report);
        return;
    }

    let result = calculateDaySchedule(window.state.currentDay);
    report = result.report;

    const txtEl = document.getElementById('total-working-text');
    if (txtEl) {
        txtEl.innerHTML = `${window.state.currentMonth}月 ${window.state.currentDay} 日 (星期${window.getDayOfWeekText(window.state.currentYear, window.state.currentMonth, window.state.currentDay)}) 核心美甲師：<b>${result.manicuristCount}</b> 人 ｜ 學徒：<b>${apprentices.length}</b> 人 ｜ 總上班：<b>${result.totalCount}</b> 人`;
    }
    const leaveEl = document.getElementById('today-leave-names-box');
    if (leaveEl) {
        leaveEl.innerHTML = `今日放假：${leavesToday.length > 0 ? leavesToday.join(', ') : '無'}`;
    }

    refreshBadgesOnly(report);
    renderInteractiveReport(report);
}

function refreshBadgesOnly(reportData) {
    let shopCounts = { F79: 0, GK3: 0, G38: 0, G2: 0, G19B: 0 };
    ALL_SHOPS.forEach(shop => {
        (reportData[shop] || []).forEach(slot => { if (slot.name) shopCounts[shop]++; });
    });
    renderMonitorBadges(shopCounts);
}

function renderMonitorBadges(shopCounts) {
    const monitorPanel = document.getElementById('monitor-panel');
    if (!monitorPanel) return;
    monitorPanel.innerHTML = '';

    ALL_SHOPS.forEach(shop => {
        const count = shopCounts[shop] || 0;
        let badgeClass = 'bg-ok';
        let txt = '正常';
        if (shop === 'F79') {
            badgeClass = (count >= 2 && count <= 3) ? 'bg-ok' : 'bg-warn';
            txt = `指標:${count}人`;
        } else {
            if (count < 3) { badgeClass = 'bg-warn'; txt = '缺美甲師'; }
            else if (count > 6) { badgeClass = 'bg-low'; txt = '爆人(多於6)'; }
        }
        monitorPanel.innerHTML += `<div class="badge ${badgeClass}"><div style="font-weight:bold;">${shop}</div><div style="font-size:18px; font-weight:900; margin:2px 0;">${count}人</div><div style="font-size:10px; opacity:0.8;">${txt}</div></div>`;
    });
}

function renderInteractiveReport(report) {
    const reportContainer = document.getElementById('shops-report-container');
    if (!reportContainer) return;
    reportContainer.innerHTML = '';

    const headerColors = { F79: '#4f46e5', GK3: '#9333ea', G38: '#d97706', G2: '#0d9488', G19B: '#e11d48' };
    let nameOptionsHtml = `<option value="">-- 空缺 --</option>`;
    (window.state.employees || []).forEach(e => {
        nameOptionsHtml += `<option value="${e.name}">${e.name}</option>`;
    });

    ALL_SHOPS.forEach(shop => {
        let slotsHtml = '';
        for (let i = 0; i < 6; i++) {
            let slot = (report[shop] && report[shop][i]) ? report[shop][i] : { name: '', time: '' };
            let currentSelectHtml = nameOptionsHtml.replace(`value="${slot.name}"`, `value="${slot.name}" selected`);
            const isDisabled = (window.state.currentRole !== 'manager') ? 'disabled style="opacity:0.8; background:#f3f4f6;"' : '';

            let noteTextHtml = '';
            if (slot.name && window.state.notes[slot.name] && window.state.notes[slot.name][`day_${window.state.currentDay}`]) {
                let matchedNote = window.state.notes[slot.name][`day_${window.state.currentDay}`];
                noteTextHtml = `<div class="slot-note-text" title="${matchedNote}">📝 ${matchedNote}</div>`;
            }

            let tClean = slot.time;
            if (tClean.includes('(')) {
                let matches = tClean.match(/\(([^)]+)\)/);
                if (matches && matches[1]) tClean = matches[1];
            }

            slotsHtml += `<div class="slot-box"><select class="manual-name-select" ${isDisabled} onchange="handleManualSlotChange('${shop}', ${i}, 'name', this.value)">${currentSelectHtml}</select><input type="text" class="manual-time-input" ${isDisabled} value="${tClean}" placeholder="無班次" onchange="handleManualSlotChange('${shop}', ${i}, 'time', this.value)">${noteTextHtml}</div>`;
        }
        let currentCount = 0;
        (report[shop] || []).forEach(s => { if (s.name) currentCount++; });
        reportContainer.innerHTML += `<div class="shop-box"><div class="shop-header" style="background: ${headerColors[shop]};"><span>${shop} 店鋪</span><span>當前共：${currentCount} 人</span></div><div class="grid-6">${slotsHtml}</div></div>`;
    });
}

function handleManualSlotChange(shop, index, field, value) {
    const dayKey = `day_${window.state.currentDay}`;
    if (!window.state.overrides[dayKey]) {
        let curReport = calculateDaySchedule(window.state.currentDay).report;
        window.state.overrides[dayKey] = JSON.parse(JSON.stringify(curReport));
    }
    window.state.overrides[dayKey][shop][index][field] = value;
    const monthKey = `${window.state.currentYear}-${window.state.currentMonth < 10 ? '0' + window.state.currentMonth : window.state.currentMonth}`;
    
    if (window.isCloudMode && window.database) {
        window.database.ref(`v8_overrides/${monthKey}/${dayKey}`).set(window.state.overrides[dayKey]);
    } else {
        localStorage.setItem(`v8_overrides_${monthKey}`, JSON.stringify(window.state.overrides));
        refreshBadgesOnly(window.state.overrides[dayKey]);
    }
}

function resetCurrentDayToAuto() {
    const monthKey = `${window.state.currentYear}-${window.state.currentMonth < 10 ? '0' + window.state.currentMonth : window.state.currentMonth}`;
    if (window.isCloudMode && window.database) {
        window.database.ref(`v8_overrides/${monthKey}/day_${window.state.currentDay}`).remove();
    } else {
        if (window.state.overrides[`day_${window.state.currentDay}`]) {
            delete window.state.overrides[`day_${window.state.currentDay}`];
            localStorage.setItem(`v8_overrides_${monthKey}`, JSON.stringify(window.state.overrides));
            runScheduler();
        }
    }
}

// ==================== 5. 渲染表格 UI (個人月曆、放假表、人手分析) ====================
function renderIndividualMonthCalendar() {
    const tbody = document.getElementById('my-month-calendar-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    const staffSelect = document.getElementById('my-month-staff-select');
    const staffName = staffSelect ? staffSelect.value : null;
    if (!staffName) return;

    let totalDays = window.getDaysInMonthFallback(window.state.currentYear, window.state.currentMonth);
    const realToday = new Date();
    const realDayNum = realToday.getDate();
    const realMonthNum = realToday.getMonth() + 1;
    const realYearNum = realToday.getFullYear();
    const isManager = (window.state.currentRole === 'manager');

    for (let d = 1; d <= totalDays; d++) {
        let isWknd = window.getDayOfWeekText(window.state.currentYear, window.state.currentMonth, d) === '日' ? 'background:#fef2f2; font-weight:bold; color:var(--danger);' : '';
        let assignedShop = '<span style="color:#9ca3af;">-</span>';
        let assignedTime = '<span style="color:#9ca3af;">-</span>';

        let isPastDay = (window.state.currentYear < realYearNum || 
                        (window.state.currentYear === realYearNum && window.state.currentMonth < realMonthNum) || 
                        (window.state.currentYear === realYearNum && window.state.currentMonth === realMonthNum && d < realDayNum));

        let dayKey = `day_${d}`;
        let dayReport = window.state.overrides[dayKey] || calculateDaySchedule(d).report;
        let activeManiCount = 0;

        ALL_SHOPS.forEach(s => {
            (dayReport[s] || []).forEach(slot => {
                if (slot.name) {
                    const staff = window.state.employees.find(e => e.name.replace(/\s+/g, '') === slot.name.replace(/\s+/g, ''));
                    if (staff && staff.role !== '學徒') activeManiCount++;
                }
            });
        });

        const isHolidayDraft = (window.state.localHolidaysDraft[staffName] || []).includes(d);
        if (isHolidayDraft) {
            assignedShop = '<span style="color:var(--danger); font-weight:bold;">放假要求 🏖️</span>';
            assignedTime = '<span style="color:var(--danger); font-size:11px;">(待存/放假)</span>';
        } else {
            ALL_SHOPS.forEach(s => {
                if (dayReport[s]) {
                    dayReport[s].forEach(slot => {
                        if (slot.name && slot.name.replace(/\s+/g, '') === staffName.replace(/\s+/g, '')) {
                            assignedShop = `<b style="color:var(--primary);">${s} 店</b>`;
                            let tClean = slot.time;
                            if (tClean.includes('(')) {
                                let m = tClean.match(/\(([^)]+)\)/);
                                if (m && m[1]) tClean = m[1];
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
            btnHtml = `<button class="holiday-btn ${activeClass}" onclick="toggleLocalHolidayDraft('${staffName}', ${d}, this)">放假</button>`;
        }

        let maniBadgeStyle = "background:#cef7e5; color:#03543f;";
        if (activeManiCount <= (window.state.settings.limitLow || 12)) maniBadgeStyle = "background:#fde8e8; color:#9b1c1c; font-weight:bold;";

        tbody.innerHTML += `<tr><td style="text-align:center; font-weight:bold; ${isPastDay?'color:#9ca3af;':''}">${isPastDay ? '🔒 ' : ''}${d} 日</td><td style="text-align:center; ${isWknd}">${window.getDayOfWeekText(window.state.currentYear, window.state.currentMonth, d)}</td><td style="text-align:center;"><span style="padding:2px 6px; border-radius:6px; font-size:11px; ${maniBadgeStyle}">${activeManiCount} 師</span></td><td style="text-align:center;">${assignedShop}</td><td style="text-align:center;">${assignedTime}</td><td style="text-align:center;">${btnHtml}</td><td><input type="text" class="calendar-special-note-input" data-day="${d}" data-staff="${staffName}" ${inputDisabledHtml} value="${currentNote}" placeholder="鍵入特殊備註..."></td></tr>`;
    }
}

function renderHolidayTable() {
    const headerRow = document.getElementById('holiday-table-header-row');
    const tbody = document.getElementById('holiday-table-body');
    if (!headerRow || !tbody) return;

    headerRow.innerHTML = '';
    tbody.innerHTML = '';
    let totalDays = window.getDaysInMonthFallback(window.state.currentYear, window.state.currentMonth);
    headerRow.innerHTML += `<th class="sticky-col">員工放假總覽 📊</th>`;

    for (let d = 1; d <= totalDays; d++) {
        let dayKey = `day_${d}`;
        let dayReport = window.state.overrides[dayKey] || calculateDaySchedule(d).report;
        let tMani = 0, tApp = 0;
        ALL_SHOPS.forEach(s => {
            (dayReport[s] || []).forEach(slot => {
                if (slot.name) {
                    const staff = window.state.employees.find(e => e.name.replace(/\s+/g, '') === slot.name.replace(/\s+/g, ''));
                    if (staff && staff.role === '學徒') tApp++;
                    else if (staff && staff.role !== '學徒') tMani++;
                }
            });
        });
        headerRow.innerHTML += `<th style="text-align:center; min-width:42px; background:#f8fafc; padding:6px 4px;"><span style="font-size:9px; color:var(--primary); display:block; font-weight:900;">${tMani}師</span><span style="font-size:9px; color:#0d9488; display:block; font-weight:900; margin-bottom:2px;">${tApp}徒</span><b style="font-size:12px; color:#111827;">${d}</b><br><span style="font-size:9px; font-weight:normal; color:#6b7280;">${window.getDayOfWeekText(window.state.currentYear, window.state.currentMonth, d)}</span></th>`;
    }

    (window.state.employees || []).forEach(emp => {
        let dotsHtml = '';
        const userHols = window.state.holidays[emp.name] || [];
        for (let d = 1; d <= totalDays; d++) {
            let isActive = userHols.includes(d) ? 'active' : '';
            let dotText = userHols.includes(d) ? '假' : '-';
            dotsHtml += `<td><span class="holiday-display-dot ${isActive}">${dotText}</span></td>`;
        }
        tbody.innerHTML += `<tr><td class="sticky-col"><span class="count-badge">${userHols.length}天</span><b style="font-size:13px;">${emp.name}</b></td>${dotsHtml}</tr>`;
    });
}

function renderMonthlyAnalysis() {
    const tbody = document.getElementById('analysis-table-body');
    const lowBody = document.getElementById('low-staff-table-body');
    const highBody = document.getElementById('high-staff-table-body');
    if (!tbody) return;

    tbody.innerHTML = '';
    if (lowBody) lowBody.innerHTML = '';
    if (highBody) highBody.innerHTML = '';

    let totalDays = window.getDaysInMonthFallback(window.state.currentYear, window.state.currentMonth);
    let lowStaffHtml = "";
    let highStaffHtml = "";

    for (let d = 1; d <= totalDays; d++) {
        let dayKey = `day_${d}`;
        let finalCounts = { F79: 0, GK3: 0, G38: 0, G2: 0, G19B: 0 };
        let totalWorkingApprentices = 0;
        let dayReport = window.state.overrides[dayKey] || calculateDaySchedule(d).report;

        ALL_SHOPS.forEach(s => {
            (dayReport[s] || []).forEach(slot => {
                if (slot.name) {
                    const staff = window.state.employees.find(e => e.name.replace(/\s+/g, '') === slot.name.replace(/\s+/g, ''));
                    if (staff && staff.role === '學徒') totalWorkingApprentices++;
                    else if (staff && staff.role !== '學徒') finalCounts[s]++;
                }
            });
        });

        let totalWorkingMani = finalCounts.F79 + finalCounts.GK3 + finalCounts.G38 + finalCounts.G2 + finalCounts.G19B;
        let alertBgClass = "bg-alert-red";
        if (totalWorkingMani > (window.state.settings.limitLow || 12)) alertBgClass = "bg-alert-lightgreen";
        if (totalWorkingMani >= (window.state.settings.limitHigh || 15)) alertBgClass = "bg-alert-darkgreen";

        let isWknd = window.getDayOfWeekText(window.state.currentYear, window.state.currentMonth, d) === '日' ? 'background:#fef2f2; font-weight:bold; color:var(--danger);' : '';
        let rowHtml = `<tr><td style="text-align:center; font-weight:bold; width:65px;">${d} 日</td><td style="text-align:center; ${isWknd} width:55px;">${window.getDayOfWeekText(window.state.currentYear, window.state.currentMonth, d)}</td><td class="col-mani ${alertBgClass}" style="width:100px;">${totalWorkingMani} 師</td><td class="col-app" style="text-align:center; background:#f0fdf4; font-weight:bold; color:#0d9488; width:100px;">${totalWorkingApprentices} 徒</td><td class="col-shops normal-cell">${finalCounts.F79}人</td><td class="col-shops normal-cell">${finalCounts.GK3}人</td><td class="col-shops normal-cell">${finalCounts.G38}人</td><td class="col-shops normal-cell">${finalCounts.G2}人</td><td class="col-shops normal-cell">${finalCounts.G19B}人</td></tr>`;

        tbody.innerHTML += rowHtml;
        if (totalWorkingMani <= (window.state.settings.limitLow || 12)) lowStaffHtml += rowHtml;
        if (totalWorkingMani >= (window.state.settings.limitHigh || 15)) highStaffHtml += rowHtml;
    }

    if (lowBody) lowBody.innerHTML = lowStaffHtml || "<tr><td style='text-align:center; padding:10px; color:#9ca3af;'>🙌 本月無美甲師 <= 告急線的日子</td></tr>";
    if (highBody) highBody.innerHTML = highStaffHtml || "<tr><td style='text-align:center; padding:10px; color:#9ca3af;'>📊 本月無美甲師 >= 充沛線的日子</td></tr>";
    
    renderStaffMonthSummaryTable();
}

function renderStaffMonthSummaryTable() {
    const summaryBody = document.getElementById('staff-month-summary-body');
    if (!summaryBody) return;
    summaryBody.innerHTML = '';

    let totalDays = window.getDaysInMonthFallback(window.state.currentYear, window.state.currentMonth);

    (window.state.employees || []).forEach(emp => {
        let leaveDays = (window.state.holidays[emp.name] || []).length;
        let workDays = totalDays - leaveDays;
        summaryBody.innerHTML += `<tr><td style="padding:6px 10px; font-weight:bold;">${emp.name}</td><td style="text-align:center; padding:6px 10px;"><span class="count-badge">${emp.role}</span></td><td style="text-align:center; padding:6px 10px; font-weight:bold; color:var(--success);">${workDays} 天</td><td style="text-align:center; padding:6px 10px; font-weight:bold; color:var(--danger);">${leaveDays} 天</td></tr>`;
    });
}

// ==================== 6. 員工管理與帳號密碼控制台 ====================
function renderEmployeeTable() {
    const tbody = document.getElementById('employee-table-body');
    if (!tbody) return;
    tbody.innerHTML = '';
    const isReadonly = (window.state.currentRole !== 'manager') ? 'disabled' : '';

    (window.state.employees || []).forEach((emp) => {
        let currentRole = emp.role || 'Full-time';
        tbody.innerHTML += `<tr>
            <td style="text-align:center;"><input type="text" class="emp-id-input" ${isReadonly} value="${emp.id || ''}" style="width:60px; text-align:center;"></td>
            <td><input type="text" class="emp-name-input" ${isReadonly} value="${emp.name}"></td>
            <td><select class="emp-type-select" ${isReadonly}><option value="Full-time" ${currentRole === 'Full-time' ? 'selected' : ''}>Full-time</option><option value="Part-time" ${currentRole === 'Part-time' ? 'selected' : ''}>Part-time</option><option value="學徒" ${currentRole === '學徒' ? 'selected' : ''}>學徒</option></select></td>
            <td><input type="text" class="emp-shops-input" ${isReadonly} value="${emp.p_shops || ''}"></td>
            <td><input type="text" class="emp-times-input" ${isReadonly} value="${emp.times || ''}"></td>
            <td style="text-align:center;"><input type="text" class="emp-pass-input" ${isReadonly} value="${emp.password || ''}" style="width:100px; text-align:center;"></td>
            <td><button class="btn btn-del" ${isReadonly} onclick="this.closest('tr').remove()">刪除</button></td>
        </tr>`;
    });
}

function addEmployeeRow() {
    if (window.state.currentRole !== 'manager') return;
    const tbody = document.getElementById('employee-table-body');
    if (!tbody) return;

    const nextId = 101 + (window.state.employees || []).length;
    tbody.innerHTML += `<tr>
        <td style="text-align:center;"><input type="text" class="emp-id-input" value="${nextId}" style="width:60px; text-align:center;"></td>
        <td><input type="text" class="emp-name-input" placeholder="新姓名"></td>
        <td><select class="emp-type-select"><option value="Full-time" selected>Full-time</option><option value="Part-time">Part-time</option><option value="學徒">學徒</option></select></td>
        <td><input type="text" class="emp-shops-input" value="G2, G38, GK3, F79, G19B"></td>
        <td><input type="text" class="emp-times-input" value="11:00, 12:00, 13:00"></td>
        <td style="text-align:center;"><input type="text" class="emp-pass-input" value="${nextId}" style="width:100px; text-align:center;"></td>
        <td><button class="btn btn-del" onclick="this.closest('tr').remove()">刪除</button></td>
    </tr>`;
}

function saveEmployeeData() {
    if (window.state.currentRole !== 'manager') return;
    const rows = document.querySelectorAll('#employee-table-body tr');
    let newEmps = [];
    rows.forEach(row => {
        const id = row.querySelector('.emp-id-input').value.trim();
        const name = row.querySelector('.emp-name-input').value.trim();
        if (!name) return;
        const role = row.querySelector('.emp-type-select').value;
        const p_shops = row.querySelector('.emp-shops-input').value;
        const times = row.querySelector('.emp-times-input').value;
        const password = row.querySelector('.emp-pass-input').value.trim() || id;

        newEmps.push({ id, name, role, p_shops, times, password });
    });

    window.state.employees = newEmps;
    if (window.isCloudMode && window.database) {
        window.database.ref('v8_employees').set(window.state.employees);
        if (typeof window.showToastMessage === 'function') window.showToastMessage('👥 員工名單與權限變更成功！');
    } else {
        localStorage.setItem('v8_employees', JSON.stringify(window.state.employees));
        if (typeof window.showToastMessage === 'function') window.showToastMessage('💾 本地儲存成功！');
        populateStaffDropdown();
    }
}

// 微調設定頁面的帳密控制台
window.renderSettingsAccountsList = function(empList) {
    const tbody = document.getElementById('settings-accounts-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    (empList || []).forEach(emp => {
        tbody.innerHTML += `<tr>
            <td style="padding:10px; font-weight:bold;">${emp.name}</td>
            <td style="padding:10px; text-align:center;"><input type="text" class="cfg-acc-id" data-name="${emp.name}" value="${emp.id || ''}" style="width:80px; text-align:center; font-weight:bold;"></td>
            <td style="padding:10px; text-align:center;"><input type="text" class="cfg-acc-pass" data-name="${emp.name}" value="${emp.password || ''}" style="width:100px; text-align:center; font-weight:bold; color:var(--primary);"></td>
            <td style="padding:10px; text-align:center;"><button class="btn" style="padding:2px 8px; font-size:11px; background:#64748b; color:white;" onclick="this.closest('tr').querySelector('.cfg-acc-pass').value = this.closest('tr').querySelector('.cfg-acc-id').value">預設與工號相同</button></td>
        </tr>`;
    });
};

function triggerRegenerateAllPasswords() {
    if (confirm("是否要將全體員工的密碼重置為其對應的【員工編號】？")) {
        const rows = document.querySelectorAll('#settings-accounts-tbody tr');
        rows.forEach(r => {
            const idInput = r.querySelector('.cfg-acc-id');
            const passInput = r.querySelector('.cfg-acc-pass');
            if (idInput && passInput) passInput.value = idInput.value;
        });
    }
}

function saveEmployeesAccountsFromSettings() {
    const rows = document.querySelectorAll('#settings-accounts-tbody tr');
    rows.forEach(r => {
        const idInp = r.querySelector('.cfg-acc-id');
        const passInp = r.querySelector('.cfg-acc-pass');
        if (idInp && passInp) {
            const name = idInp.getAttribute('data-name');
            const targetEmp = (window.state.employees || []).find(e => e.name === name);
            if (targetEmp) {
                targetEmp.id = idInp.value.trim();
                targetEmp.password = passInp.value.trim();
            }
        }
    });

    if (window.isCloudMode && window.database) {
        window.database.ref('v8_employees').set(window.state.employees);
        if (typeof window.showToastMessage === 'function') window.showToastMessage("💾 全員帳號與密碼已成功發佈至雲端！");
    } else {
        localStorage.setItem('v8_employees', JSON.stringify(window.state.employees));
        if (typeof window.showToastMessage === 'function') window.showToastMessage("💾 已成功儲存至本地");
    }
    renderEmployeeTable();
}

function syncSettingsToForm() {
    const s = window.state.settings || {};
    const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };

    setVal('cfg-web-title', s.webTitle || "分店智能排班系統 V11.5-Ultimate Pro");
    setVal('cfg-lock-day', s.lockDay || 26);
    setVal('cfg-max-ft-leave', s.maxFtLeave || 4);
    setVal('cfg-max-pt-leave', s.maxPtLeave || 10);
    setVal('cfg-limit-low', s.limitLow || 12);
    setVal('cfg-limit-high', s.limitHigh || 15);

    const titleEl = document.getElementById('web-title-tag');
    if (titleEl) titleEl.innerText = s.webTitle || "分店智能排班系統 V11.5-Ultimate Pro";
    const mainTitleEl = document.getElementById('page-main-title');
    if (mainTitleEl) mainTitleEl.innerText = s.webTitle || "分店智能排班系統 V11.5-Ultimate Pro";
}

function saveGlobalSystemSettings() {
    const getVal = (id) => { const el = document.getElementById(id); return el ? el.value : null; };

    window.state.settings.webTitle = getVal('cfg-web-title') || "分店智能排班系統 V11.5-Ultimate Pro";
    window.state.settings.lockDay = parseInt(getVal('cfg-lock-day')) || 26;
    window.state.settings.maxFtLeave = parseInt(getVal('cfg-max-ft-leave')) || 4;
    window.state.settings.maxPtLeave = parseInt(getVal('cfg-max-pt-leave')) || 10;
    window.state.settings.limitLow = parseInt(getVal('cfg-limit-low')) || 12;
    window.state.settings.limitHigh = parseInt(getVal('cfg-limit-high')) || 15;

    if (window.isCloudMode && window.database) {
        window.database.ref('v8_settings').set(window.state.settings);
        if (typeof window.showToastMessage === 'function') window.showToastMessage("⚙️ 系統核心參數已順利覆蓋並更新！");
    } else {
        localStorage.setItem('v8_settings', JSON.stringify(window.state.settings));
        if (typeof window.showToastMessage === 'function') window.showToastMessage("💾 本地微調設定已儲存");
    }
    syncSettingsToForm();
    runScheduler();
    renderMonthlyAnalysis();
}

// ==================== 7. 本地降級模式與時空膠囊備份 ====================
function loadLocalFallbackContext() {
    calculateAutoDefaultDate();
    const y = window.state.currentYear;
    const m = window.state.currentMonth;
    const monthKey = `${y}-${m < 10 ? '0' + m : m}`;

    window.state.employees = JSON.parse(localStorage.getItem('v8_employees')) || JSON.parse(JSON.stringify(defaultEmployeesList));
    window.state.overrides = JSON.parse(localStorage.getItem(`v8_overrides_${monthKey}`)) || {};
    window.state.holidays = JSON.parse(localStorage.getItem(`v8_holidays_${monthKey}`)) || {};
    window.state.notes = JSON.parse(localStorage.getItem(`v8_notes_${monthKey}`)) || {};
    window.state.settings = JSON.parse(localStorage.getItem('v8_settings')) || window.state.settings;
    window.state.localHolidaysDraft = JSON.parse(JSON.stringify(window.state.holidays));

    cloudLoads = { emp: true, hol: true, ovr: true, note: true, cfg: true };
    triggerSafeUIRender();
}

function downloadTimeCapsuleBackup() {
    const monthKey = `${window.state.currentYear}-${window.state.currentMonth < 10 ? '0' + window.state.currentMonth : window.state.currentMonth}`;
    const backupPackage = {
        v8_employees: window.state.employees,
        v8_holidays: window.state.holidays,
        v8_overrides: window.state.overrides,
        v8_special_notes: window.state.notes,
        v8_settings: window.state.settings
    };
    const blob = new Blob([JSON.stringify(backupPackage, null, 2)], { type: 'text/plain' });
    const anchor = document.createElement('a');
    anchor.download = `Crystal_Pavilion_Backup_[${monthKey}].txt`;
    anchor.href = window.URL.createObjectURL(blob);
    anchor.click();
}

function triggerBackupUploadClick() {
    const el = document.getElementById('time-capsule-file-injector');
    if (el) el.click();
}

function restoreFromTimeCapsule(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const pkg = JSON.parse(e.target.result);
            if (!pkg.v8_employees || !pkg.v8_holidays) {
                if (typeof window.showSafeAlert === 'function') window.showSafeAlert('❌ 備份檔格式不符', '無法解析備份檔案內容。', '⚠️');
                return;
            }
            if (confirm('確定要從備份檔案全盤覆蓋雲端數據？')) {
                const monthKey = `${window.state.currentYear}-${window.state.currentMonth < 10 ? '0' + window.state.currentMonth : window.state.currentMonth}`;
                if (window.isCloudMode && window.database) {
                    window.database.ref('v8_employees').set(pkg.v8_employees);
                    window.database.ref(`v8_holidays/${monthKey}`).set(pkg.v8_holidays);
                    window.database.ref(`v8_overrides/${monthKey}`).set(pkg.v8_overrides || {});
                    window.database.ref(`v8_special_notes/${monthKey}`).set(pkg.v8_special_notes || {});
                    if (pkg.v8_settings) window.database.ref('v8_settings').set(pkg.v8_settings);
                    if (typeof window.showToastMessage === 'function') window.showToastMessage('🟢 數據時空膠囊已全盤覆蓋雲端！');
                }
            }
        } catch (err) {
            if (typeof window.showSafeAlert === 'function') window.showSafeAlert('❌ 讀取失敗', '讀取備份檔案發生錯誤。', '⚠️');
        }
    };
    reader.readAsText(file);
}

// 頁面加載啟動引擎
window.onload = function() {
    calculateAutoDefaultDate();
    initYearMonthDropdowns();
    initFirebaseConnection();
};
