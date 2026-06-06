// 🔮 雲端資料庫連線鎖匙 (自動對接你水晶閣的 Firebase)
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

// 初始化 Firebase 連線
if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// 📑 項目資料庫與預計所需時長 (分鐘)
const servicesMetadata = {
    nail_hand_base: [
        { id: "h_base_1", zh: "💅 手部單色 Soak Off Gel", en: "Hand Single Color Soak Off Gel", duration: 60 },
        { id: "h_base_2", zh: "💅 手部雙色/貓眼 Soak Off Gel", en: "Hand Two-Tone/Cat Eye Soak Off", duration: 75 },
        { id: "h_base_3", zh: "💅 手部單色 Hard Gel", en: "Hand Single Color Hard Gel", duration: 75 },
        { id: "h_base_4", zh: "💅 手部雙色/貓眼 Hard Gel", en: "Hand Two-Tone/Cat Eye Hard Gel", duration: 90 }
    ],
    nail_hand_addons: [
        { id: "h_add_1", zh: "✨ 手部局部藝術款式 (2-4指)", en: "Hand Partial Art Style (2-4 fingers)", duration: 20 },
        { id: "h_add_2", zh: "✨ 手部全套複雜藝術款式", en: "Hand Full Set Complex Art Style", duration: 45 },
        { id: "h_add_3", zh: "✨ 手部水晶/聚膠全套延長", en: "Hand Full Set Extension", duration: 60 },
        { id: "h_add_4", zh: "✨ 卸除外店甲 (意向附加)", en: "Remove Professional Gel (Other Shop)", duration: 20 }
    ],
    nail_foot_base: [
        { id: "f_base_1", zh: "🦶 腳部單色 Soak Off Gel", en: "Foot Single Color Soak Off Gel", duration: 60 },
        { id: "f_base_2", zh: "🦶 腳部雙色/貓眼 Soak Off Gel", en: "Foot Two-Tone/Cat Eye Soak Off", duration: 75 },
        { id: "f_base_3", zh: "🦶 腳部單色 Hard Gel", en: "Foot Single Color Hard Gel", duration: 75 }
    ],
    nail_foot_addons: [
        { id: "f_add_1", zh: "✨ 腳部全套深層去死皮護理", en: "Foot Deep Dead Skin Care", duration: 30 },
        { id: "f_add_2", zh: "✨ 腳部全套藝術款式設計", en: "Foot Full Set Art Style Design", duration: 30 }
    ],
    lash: [
        { id: "lash_1", zh: "👁️ 日式單根自然美睫 (100根)", en: "Japanese Natural Lashes (100pcs)", duration: 60 },
        { id: "lash_2", zh: "👁️ 網紅濃密山茶花美睫 (滿種)", en: "Dense Camellia Lashes (Full)", duration: 90 },
        { id: "lash_3", zh: "👁️ 角蛋白美睫大師護理", en: "Keratin Lash Lift Master Care", duration: 60 }
    ],
    brows: [
        { id: "brow_1", zh: "✒️ 半永久韓式霧眉/絲霧眉", en: "Semi-Permanent Korean Powder Brows", duration: 120 },
        { id: "brow_2", zh: "✒️ 半永久美瞳線/隱形眼線", en: "Semi-Permanent Eyeliner", duration: 90 }
    ]
};

// 📊 預約狀態控制面板暫存大腦
let bookingState = {
    mainCategories: { nail: false, lash: false, brows: false },
    nailParts: { hand: false, foot: false },
    selectedItems: new Set(),
    selectedSlot: null,
    totalDuration: 0
};

// 🚀 網頁載入時初始化
window.addEventListener('DOMContentLoaded', () => {
    // 預設日期為今天
    const dateInput = document.getElementById('booking-date');
    if (dateInput) {
        dateInput.min = new Date().toISOString().split('T')[0];
    }
    
    // 從雲端抓取在職美甲師名單，動態填入下拉選單
    database.ref('v8_employees').once('value').then(snap => {
        const selectEl = document.getElementById('booking-staff');
        if (!selectEl) return;
        const emps = snap.exists() ? snap.val() : [];
        const cleanEmps = Array.isArray(emps) ? emps.filter(Boolean) : Object.values(emps).filter(Boolean);
        cleanEmps.forEach(e => {
            if (e && e.name && e.role !== '學徒') {
                const opt = document.createElement('option');
                opt.value = e.name;
                opt.innerText = `👤 ${e.name} [${e.role}]`;
                selectEl.appendChild(opt);
            }
        });
    });
});

// 🛠️ 1. 控制三大主類別展開/收合 (對應 HTML onclick="toggleMainCategory")
function toggleMainCategory(cat) {
    bookingState.mainCategories[cat] = !bookingState.mainCategories[cat];
    
    const card = document.getElementById(`cate-card-${cat}`);
    const chk = document.getElementById(`main-chk-${cat}`);
    
    if (chk) chk.checked = bookingState.mainCategories[cat];
    if (card) {
        if (bookingState.mainCategories[cat]) card.classList.add('selected');
        else card.classList.remove('selected');
    }

    // 如果是美甲，聯動顯示/隱藏手腳部位選擇區
    if (cat === 'nail') {
        const partZone = document.getElementById('nail-part-selector-zone');
        if (partZone) partZone.style.display = bookingState.mainCategories.nail ? "block" : "none";
        if (!bookingState.mainCategories.nail) {
            // 取消美甲時，清空手腳勾選
            clearNailParts();
        }
    }

    // 如果取消勾選，順便清空該大類下已勾選的項目
    if (!bookingState.mainCategories[cat]) {
        clearSelectedItemsByCat(cat);
    }

    renderSubDetailsAndRecalc();
}

// 🛠️ 2. 控制美甲手腳部位選擇 (對應 HTML onclick="toggleNailPart")
function toggleNailPart(part) {
    bookingState.nailParts[part] = !bookingState.nailParts[part];
    
    const card = document.getElementById(`part-card-${part}`);
    const chk = document.getElementById(`part-chk-${part}`);
    
    if (chk) chk.checked = bookingState.nailParts[part];
    if (card) {
        if (bookingState.nailParts[part]) card.classList.add('selected');
        else card.classList.remove('selected');
    }

    if (!bookingState.nailParts[part]) {
        clearSelectedItemsByPart(part);
    }

    renderSubDetailsAndRecalc();
}

function clearNailParts() {
    bookingState.nailParts.hand = false;
    bookingState.nailParts.foot = false;
    document.querySelectorAll('#nail-part-selector-zone .check-card').forEach(el => el.classList.remove('selected'));
    document.querySelectorAll('#nail-part-selector-zone input').forEach(el => el.checked = false);
    clearSelectedItemsByPart('hand');
    clearSelectedItemsByPart('foot');
}

function clearSelectedItemsByCat(cat) {
    let keys = [];
    if (cat === 'lash') keys = ['lash'];
    if (cat === 'brows') keys = ['brows'];
    keys.forEach(k => servicesMetadata[k].forEach(item => bookingState.selectedItems.delete(item.id)));
}

function clearSelectedItemsByPart(part) {
    let keys = [];
    if (part === 'hand') keys = ['nail_hand_base', 'nail_hand_addons'];
    if (part === 'foot') keys = ['nail_foot_base', 'nail_foot_addons'];
    keys.forEach(k => servicesMetadata[k].forEach(item => bookingState.selectedItems.delete(item.id)));
}

// 🎨 3. 核心選單嚙合點：根據勾選動態渲染所有細項 (使用 HTML 既有的 addon-card 樣式)
function renderSubDetailsAndRecalc() {
    const zone = document.getElementById('sub-details-render-zone');
    if (!zone) return;
    zone.innerHTML = '';

    let activeSections = [];
    if (bookingState.mainCategories.nail && bookingState.nailParts.hand) {
        activeSections.push({ title: "💅 手部美甲服務 (Hand Services)", data: [...servicesMetadata.nail_hand_base, ...servicesMetadata.nail_hand_addons] });
    }
    if (bookingState.mainCategories.nail && bookingState.nailParts.foot) {
        activeSections.push({ title: "🦶 腳部美甲服務 (Foot Services)", data: [...servicesMetadata.nail_foot_base, ...servicesMetadata.nail_foot_addons] });
    }
    if (bookingState.mainCategories.lash) {
        activeSections.push({ title: "👁️ 嫁接美睫項目 (Eyelash Services)", data: servicesMetadata.lash });
    }
    if (bookingState.mainCategories.brows) {
        activeSections.push({ title: "✒️ 定制紋綉項目 (Brows Tattoo)", data: servicesMetadata.brows });
    }

    activeSections.forEach(sec => {
        const panel = document.createElement('div');
        panel.className = "sub-panel";
        panel.style.marginBottom = "12px";
        
        let html = `<div class="sub-panel-title">${sec.title}</div>`;
        html += `<div class="grid-2" style="gap:6px; margin-top:4px;">`;
        
        sec.data.forEach(item => {
            const isChecked = bookingState.selectedItems.has(item.id);
            const selClass = isChecked ? "selected" : "";
            const chkAttr = isChecked ? "checked" : "";
            html += `
                <div class="addon-card ${selClass}" id="card-item-${item.id}" onclick="handleSubItemToggle('${item.id}')">
                    <input type="checkbox" id="chk-item-${item.id}" ${chkAttr} style="pointer-events:none;">
                    <div style="font-weight:bold;">${item.zh}</div>
                    <div style="font-size:9px; opacity:0.7; font-weight:normal;">⏱️ ${item.duration} mins</div>
                </div>
            `;
        });
        html += `</div>`;
        panel.innerHTML = html;
        zone.appendChild(panel);
    });

    recalcDurationAndSlots();
}

// ⚡ 4. 點擊細項卡片切換
function handleSubItemToggle(id) {
    const chk = document.getElementById(`chk-item-${id}`);
    const card = document.getElementById(`card-item-${id}`);
    if (!chk) return;

    chk.checked = !chk.checked;
    if (chk.checked) {
        bookingState.selectedItems.add(id);
        if (card) card.classList.add('selected');
    } else {
        bookingState.selectedItems.delete(id);
        if (card) card.classList.remove('selected');
    }

    recalcDurationAndSlots();
}

// 🧮 5. 精算預計總時長
function recalcDurationAndSlots() {
    let durationSum = 0;
    const allMeta = [...servicesMetadata.nail_hand_base, ...servicesMetadata.nail_hand_addons, ...servicesMetadata.nail_foot_base, ...servicesMetadata.nail_foot_addons, ...servicesMetadata.lash, ...servicesMetadata.brows];
    
    allMeta.forEach(item => {
        if (bookingState.selectedItems.has(item.id)) {
            durationSum += item.duration;
        }
    });

    bookingState.totalDuration = durationSum;
    const bar = document.getElementById('live-timer-bar');
    if (bar) bar.innerText = `⏱️ 預計總時長 / Estimated Duration: ${durationSum} 分鐘 (mins)`;

    fetchAvailableSlotsFromCloud();
}

// 📅 6. 日期或美甲師變更觸發 (對應 HTML onchange="handleBookingDateOrStaffChange")
function handleBookingDateOrStaffChange() {
    fetchAvailableSlotsFromCloud();
}

// 🔍 7. 連線雲端雷達計算空檔
function fetchAvailableSlotsFromCloud() {
    const dateVal = document.getElementById('booking-date').value;
    const staffChoice = document.getElementById('booking-staff').value;
    const container = document.getElementById('time-slots-container');
    if (!container) return;

    if (!dateVal) {
        container.innerHTML = `<div style="grid-column:span 3; text-align:center; padding:15px; color:#9ca3af; font-size:12px; font-weight:bold;">📅 請先選取預約日期<br>Please select a date first</div>`;
        return;
    }
    if (bookingState.totalDuration <= 0) {
        container.innerHTML = `<div style="grid-column:span 3; text-align:center; padding:15px; color:#9ca3af; font-size:12px; font-weight:bold;">💅 請先選好服務項目<br>Please select services first</div>`;
        return;
    }

    container.innerHTML = `<div style="grid-column:span 3; text-align:center; padding:15px; color:#db2777; font-size:12px; font-weight:bold;">⚡ 水晶閣雲端雷達精算空檔中...</div>`;

    const parts = dateVal.split('-');
    const yearMonthKey = `${parts[0]}-${parts[1]}`;
    const dayNum = parseInt(parts[2]);
    const dayKey = `day_${dayNum}`;

    Promise.all([
        database.ref('v8_employees').once('value'),
        database.ref(`v8_holidays/${yearMonthKey}`).once('value'),
        database.ref(`v8_bookings/${yearMonthKey}`).once('value')
    ]).then(([empSnap, holSnap, bookSnap]) => {
        const employees = empSnap.exists() ? empSnap.val() : [];
        const holidays = holSnap.exists() ? holSnap.val() : {};
        const bookings = bookSnap.exists() ? bookSnap.val() : {};

        const cleanEmployees = Array.isArray(employees) ? employees.filter(Boolean) : Object.values(employees).filter(Boolean);
        
        // 篩選出上班人手
        let workingStaffs = cleanEmployees.filter(e => e && e.name && e.role !== '學徒' && !(holidays[e.name] || []).includes(dayNum));
        if (staffChoice !== 'auto') {
            workingStaffs = workingStaffs.filter(e => e.name === staffChoice);
        }

        // 產生可選時間範圍格 (09:00 - 22:00)
        let timeSlots = [];
        for (let h = 9; h <= 21; h++) {
            ['00', '30'].forEach(m => { timeSlots.push(`${String(h).padStart(2,'0')}:${m}`); });
        }

        let validSlotsPool = [];

        workingStaffs.forEach(staff => {
            let staffRawBookings = bookings[staff.name]?.[dayKey] || {};
            let staffBookedList = Array.isArray(staffRawBookings) ? staffRawBookings : Object.values(staffRawBookings);
            staffBookedList = staffBookedList.filter(Boolean);

            timeSlots.forEach(slotTime => {
                let startMins = timeToMins(slotTime);
                let endMins = startMins + bookingState.totalDuration;

                if (endMins > 1410) return; // 最晚不跨過 23:30

                let isOverlap = staffBookedList.some(b => {
                    let bStart = timeToMins(b.start);
                    let bEnd = timeToMins(b.end);
                    return Math.max(startMins, bStart) < Math.min(endMins, bEnd);
                });

                if (!isOverlap) {
                    validSlotsPool.push({
                        staff: staff.name,
                        time: slotTime,
                        isReview: (endMins > 1200), // 超過20:00需審批
                        isCustom: false
                    });
                }
            });
        });

        // 如果是智能分流模式，合併相同時間段
        let uniqueTimesMap = new Map();
        validSlotsPool.forEach(s => {
            if (!uniqueTimesMap.has(s.time)) uniqueTimesMap.set(s.time, s);
        });
        let uniqueSlots = Array.from(uniqueTimesMap.values()).sort((a,b) => timeToMins(a.time) - timeToMins(b.time));

        renderSlotsGridUI(uniqueSlots);
    }).catch(err => {
        container.innerHTML = `<div style="grid-column:span 3; color:red; text-align:center; font-size:12px;">❌ 連線失敗: ${err.message}</div>`;
    });
}

// 🎨 8. 動態畫出符合 HTML 樣式的時間按鈕
function renderSlotsGridUI(slots) {
    const container = document.getElementById('time-slots-container');
    if (!container) return;
    container.innerHTML = '';

    if (slots.length === 0) {
        container.innerHTML = `<div style="grid-column:span 3; text-align:center; padding:15px; color:#ef4444; font-size:12px; font-weight:bold; background:#fdf2f2; border:1px solid #fca5a5; border-radius:10px;">⚠️ 抱歉！當天此項目已被約滿，請另選日期。</div>`;
        return;
    }

    slots.forEach(slot => {
        const btn = document.createElement('button');
        btn.type = "button";
        btn.className = "slot-btn";
        if (slot.isReview) btn.classList.add('review-mode');
        btn.innerText = slot.time;

        btn.onclick = () => {
            document.querySelectorAll('.slot-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            
            bookingState.selectedSlot = {
                staff: slot.staff,
                time: slot.time,
                isReview: slot.isReview,
                isCustom: false
            };

            // 清空自選特殊時間選單的數值
            document.getElementById('custom-time-select').value = "";
            unlockSubmitButton();
        };

        container.appendChild(btn);
    });
}

// 📌 9. 處理自選特殊時間段 (對應 HTML onchange="handleCustomTimeSelectChange")
function handleCustomTimeSelectChange() {
    const customTime = document.getElementById('custom-time-select').value;
    const staffChoice = document.getElementById('booking-staff').value;
    if (!customTime) return;

    // 清空常規時間按鈕的高亮
    document.querySelectorAll('.slot-btn').forEach(b => b.classList.remove('selected'));

    bookingState.selectedSlot = {
        staff: (staffChoice === 'auto') ? "由店鋪分派" : staffChoice,
        time: customTime,
        isReview: false,
        isCustom: true
    };

    unlockSubmitButton();
}

function unlockSubmitButton() {
    const submitBtn = document.getElementById('btn-submit-booking');
    if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.style.backgroundColor = "#25D366"; // 變成亮麗的 WhatsApp 綠色
    }
}

// 🏷️ 10. 處理備註貼心標籤 (對應 HTML onclick="toggleQuickTag")
function toggleQuickTag(tag) {
    const chk = document.getElementById(`chk-tag-${tag}`);
    const btn = document.getElementById(`tag-${tag}`);
    if (!chk) return;

    chk.checked = !chk.checked;
    if (chk.checked) {
        if (btn) btn.classList.add('active');
    } else {
        if (btn) btn.classList.remove('active');
    }
}

function timeToMins(tStr) {
    if (!tStr) return 0;
    let p = tStr.split(':');
    return (parseInt(p[0]) * 60) + (parseInt(p[1]) || 0);
}

// 🚀 11. 最終站：先寫入雲端鎖時，再跳轉 WhatsApp (對應 HTML onclick="executeWhatsAppBooking")
function executeWhatsAppBooking() {
    if (!bookingState.selectedSlot) return;
    
    const dateVal = document.getElementById('booking-date').value;
    const staffName = bookingState.selectedSlot.staff;
    const timeVal = bookingState.selectedSlot.time;
    const isRev = bookingState.selectedSlot.isReview;
    const isCust = bookingState.selectedSlot.isCustom;

    let zhItems = []; let enItems = [];
    const allMeta = [...servicesMetadata.nail_hand_base, ...servicesMetadata.nail_hand_addons, ...servicesMetadata.nail_foot_base, ...servicesMetadata.nail_foot_addons, ...servicesMetadata.lash, ...servicesMetadata.brows];
    allMeta.forEach(item => {
        if (bookingState.selectedItems.has(item.id)) {
            zhItems.push(item.zh.replace('💅','').replace('🦶','').replace('👁️','').replace('✒️','').replace('✨','').trim());
            enItems.push(item.en.trim());
        }
    });

    let rushChecked = document.getElementById('chk-tag-rush').checked ? "⚡[趕時間]" : "";
    let noRemoveChecked = document.getElementById('chk-tag-noremove').checked ? "🚫[免拆甲]" : "";
    let sameDayChecked = document.getElementById('chk-tag-sameday').checked ? "🤝[手腳同做]" : "";
    let customRem = document.getElementById('custom-remarks').value.trim();
    let allRemarks = [rushChecked, noRemoveChecked, sameDayChecked, customRem].filter(Boolean).join(' ');

    // 計算結束時間
    let startMins = timeToMins(timeVal);
    let endMins = startMins + bookingState.totalDuration;
    let endH = Math.floor(endMins / 60);
    let endM = endMins % 60;
    let endTimeStr = `${String(endH).padStart(2,'0')}:${String(endM).padStart(2,'0')}`;

    let cloudBookingData = {
        customer: "WhatsApp 客人",
        item: zhItems.join(' + '),
        start: timeVal,
        end: endTimeStr,
        status: isCust ? "⏳ 特殊" : (isRev ? "⏳ 待審" : "🟢 吉時"),
        remarks: allRemarks
    };

    const parts = dateVal.split('-');
    const yearMonthKey = `${parts[0]}-${parts[1]}`;
    const dayKey = `day_${parseInt(parts[2])}`;

    // 🔒 互鎖防線：必須先成功向 Firebase 插旗，才准跳轉 WhatsApp
    database.ref(`v8_bookings/${yearMonthKey}/${staffName}/${dayKey}`).push(cloudBookingData).then(() => {
        
        // 實時跳窗肉眼確證連結成功
        alert("✅ 預約已成功同步至水晶閣雲端大腦！\n(點擊確定開啟 WhatsApp 發送對數訊息)");

        let timeStatusText = isCust ? '⏳ 自選特殊時段 (⚠️非保證)' : (isRev ? '⏳ 接近下班安全線 (⚠️需審批)' : '🟢 系統自動即時預留');
        let msg = `✨ 水晶閣新預約申請 / New Appointment ✨\n------------------------------------\n📅 日期 / Date: ${dateVal}\n🕒 時間 / Time: ${timeVal}\n📊 狀態 / Status: ${timeStatusText}\n👤 指定員工 / Stylist: ${staffName}\n⏱️ 預計時長 / Duration: ${bookingState.totalDuration} 分鐘 (mins)\n\n🎁 預約項目 / Services:\n🔹 ${zhItems.join('\n🔹 ')}\n🔹 ${enItems.join('\n🔹 ')}\n\n`;
        if (allRemarks) msg += `📝 特別備註 / Remarks:\n${allRemarks}\n`;
        msg += `------------------------------------\n（此訊息由系統排班大腦生成，請按傳送，我們將為您核對確認。）`;

        const shopWhatsAppNumber = "85293436973";
        // 採用 location.href，完美避開 iPad/手機 的彈出視窗封鎖機制
        window.location.href = `https://api.whatsapp.com/send?phone=${shopWhatsAppNumber}&text=${encodeURIComponent(msg)}`;
    }).catch(err => alert("❌ 雲端寫入失敗，請檢查網路：" + err));
}
