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

// 初始化 Firebase
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

// 📊 預約狀態暫存大腦
let bookingState = {
    selectedItems: new Set(),
    totalDuration: 0,
    selectedSlot: null
};

// 🚀 初始化綁定與動態選單渲染
window.addEventListener('DOMContentLoaded', () => {
    setupMainCategoryToggles();
    renderAllServicesCheckboxes();
    
    // 監聽日期變更自動重算空檔
    const dateInput = document.getElementById('booking-date');
    if(dateInput) {
        // 設定最少只能選今天
        const todayStr = new Date().toISOString().split('T')[0];
        dateInput.min = todayStr;
        dateInput.addEventListener('change', fetchAvailableSlotsFromCloud);
    }
});

// 🛠️ 主類別展開/收合控制引擎
function setupMainCategoryToggles() {
    const mainCats = [
        { chkId: "cat-nail", zoneId: "sub-zone-nail" },
        { chkId: "cat-lash", zoneId: "sub-zone-lash" },
        { chkId: "cat-brow", zoneId: "sub-zone-brow" }
    ];
    mainCats.forEach(cat => {
        const chk = document.getElementById(cat.chkId);
        const zone = document.getElementById(cat.zoneId);
        if(chk && zone) {
            chk.addEventListener('change', () => {
                zone.style.display = chk.checked ? "block" : "none";
                if(!chk.checked) {
                    // 如果取消大類，順便清空該大類下已選的項目
                    clearCategorySelection(cat.chkId);
                }
            });
        }
    });
}

// 📐 清空特定大類下所有勾選狀態
function clearCategorySelection(catId) {
    let targetKeys = [];
    if(catId === "cat-nail") targetKeys = ["nail_hand_base", "nail_hand_addons", "nail_foot_base", "nail_foot_addons"];
    if(catId === "cat-lash") targetKeys = ["lash"];
    if(catId === "cat-brow") targetKeys = ["brows"];

    targetKeys.forEach(key => {
        servicesMetadata[key].forEach(item => {
            bookingState.selectedItems.delete(item.id);
            const box = document.getElementById(`chk-item-${item.id}`);
            if(box) box.checked = false;
        });
    });
    recalculateTotalDuration();
}

// 🛒 動態畫出所有的細項核取方塊
function renderAllServicesCheckboxes() {
    const map = {
        "h-base-container": servicesMetadata.nail_hand_base,
        "h-add-container": servicesMetadata.nail_hand_addons,
        "f-base-container": servicesMetadata.nail_foot_base,
        "f-add-container": servicesMetadata.nail_foot_addons,
        "lash-container": servicesMetadata.lash,
        "brow-container": servicesMetadata.brows
    };

    Object.keys(map).forEach(containerId => {
        const wrapper = document.getElementById(containerId);
        if(!wrapper) return;
        wrapper.innerHTML = '';

        map[containerId].forEach(item => {
            const div = document.createElement('div');
            div.className = "service-item-row";
            div.innerHTML = `
                <label class="service-item-label" style="display:flex; align-items:center; gap:8px; margin: 6px 0; font-size:13px; cursor:pointer;">
                    <input type="checkbox" id="chk-item-${item.id}" value="${item.id}" data-duration="${item.duration}" onchange="handleItemClick('${item.id}', ${item.duration}, this.checked)">
                    <div style="flex:1;">
                        <span style="font-weight:bold; color:#1e293b;">${item.zh}</span>
                        <div style="font-size:11px; color:#64748b;">${item.en} ⏱️ ${item.duration}mins</div>
                    </div>
                </label>
            `;
            wrapper.appendChild(div);
        });
    });
}

// ⚡ 點擊項目勾選框觸發點
function handleItemClick(id, duration, isChecked) {
    if(isChecked) {
        bookingState.selectedItems.add(id);
    } else {
        bookingState.selectedItems.delete(id);
    }
    recalculateTotalDuration();
}

// 🧮 重新精算總時長
function recalculateTotalDuration() {
    let durationSum = 0;
    const allMeta = [...servicesMetadata.nail_hand_base, ...servicesMetadata.nail_hand_addons, ...servicesMetadata.nail_foot_base, ...servicesMetadata.nail_foot_addons, ...servicesMetadata.lash, ...servicesMetadata.brows];
    
    allMeta.forEach(item => {
        if(bookingState.selectedItems.has(item.id)) {
            durationSum += item.duration;
        }
    });

    bookingState.totalDuration = durationSum;
    
    // 更新排版計時UI面版
    const txtEl = document.getElementById('total-duration-text');
    if(txtEl) txtEl.innerText = durationSum;

    // 時長改變，空檔必須重新計算渲染
    fetchAvailableSlotsFromCloud();
}

// 🔍 連線雲端大腦，精算當天美甲師的預約空檔
function fetchAvailableSlotsFromCloud() {
    const dateVal = document.getElementById('booking-date').value;
    const slotsWrapper = document.getElementById('available-slots-pool-zone');
    if(!slotsWrapper) return;

    if(!dateVal) {
        slotsWrapper.innerHTML = `<div class="hint-alert-box">📅 請先選取預約日期 / Please select a date first.</div>`;
        return;
    }
    if(bookingState.totalDuration <= 0) {
        slotsWrapper.innerHTML = `<div class="hint-alert-box">💅 請先至少勾選一個服務項目 / Please select at least one service item.</div>`;
        return;
    }

    slotsWrapper.innerHTML = `<div style="text-align:center; padding:15px; color:#64748b; font-weight:bold;">⚡ 水晶閣雲端雷達精算空檔中...</div>`;

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

        // 過濾當天有上班的員工（沒放假、且不是學徒）
        const cleanEmployees = Array.isArray(employees) ? employees.filter(Boolean) : Object.values(employees).filter(Boolean);
        const workingStaffs = cleanEmployees.filter(e => e && e.name && e.role !== '學徒' && !(holidays[e.name] || []).includes(dayNum));

        // 產生全天 30 分鐘一格的時間軸 (09:00 - 22:00 可供預約起始)
        let timeSlots = [];
        for (let h = 9; h <= 21; h++) {
            ['00', '30'].forEach(m => { timeSlots.push(`${String(h).padStart(2,'0')}:${m}`); });
        }

        let validSlotsPool = [];

        // 雙重迴圈交叉比對人手空檔
        workingStaffs.forEach(staff => {
            let staffRawBookings = bookings[staff.name]?.[dayKey] || {};
            let staffBookedList = Array.isArray(staffRawBookings) ? staffRawBookings : Object.values(staffRawBookings);
            staffBookedList = staffBookedList.filter(Boolean);

            timeSlots.forEach(slotTime => {
                let startMins = timeToMins(slotTime);
                let endMins = startMins + bookingState.totalDuration;

                // 限制最晚不能超過 23:30 完工
                if(endMins > 1410) return; 

                // 檢查是否與現有預約重疊
                let isOverlap = staffBookedList.some(b => {
                    let bStart = timeToMins(b.start);
                    let bEnd = timeToMins(b.end);
                    return Math.max(startMins, bStart) < Math.min(endMins, bEnd);
                });

                if(!isOverlap) {
                    // 根據完工時間給予優化評級狀態標籤
                    let isReview = (endMins > 1200); // 超過 20:00 屬於接近下班線
                    let isCustom = false; // 系統預留常規

                    validSlotsPool.push({
                        staff: staff.name,
                        time: slotTime,
                        isReview: isReview,
                        isCustom: isCustom
                    });
                }
            });
        });

        renderAvailableSlotsGrid(validSlotsPool);
    }).catch(err => {
        slotsWrapper.innerHTML = `<div style="color:red; font-weight:bold; padding:10px;">❌ 雲端雷達連線失敗：${err.message}</div>`;
    });
}

// 🎨 渲染出精美彩色、可點選的時間空檔網格
function renderAvailableSlotsGrid(slots) {
    const wrapper = document.getElementById('available-slots-pool-zone');
    if(!wrapper) return;
    wrapper.innerHTML = '';

    if(slots.length === 0) {
        wrapper.innerHTML = `<div class="hint-alert-box" style="color:#ef4444; border-color:#fca5a5; background:#fdf2f2;">⚠️ 抱歉！當天此時段已被約滿，請更換其他日期試試。</div>`;
        return;
    }

    // 依時間排序
    slots.sort((a,b) => timeToMins(a.time) - timeToMins(b.time));

    const grid = document.createElement('div');
    grid.className = "slots-flex-grid";
    grid.style.display = "grid";
    grid.style.gridTemplateColumns = "repeat(auto-fill, minmax(130px, 1fr))";
    grid.style.gap = "8px";
    grid.style.marginTop = "10px";

    slots.forEach((slot, index) => {
        const btn = document.createElement('div');
        btn.className = "slot-select-card";
        
        let badgeText = "🟢 吉時";
        let cardStyle = "background:white; border:2px solid #cbd5e1; border-radius:10px; padding:8px; text-align:center; cursor:pointer;";
        if(slot.isReview) {
            badgeText = "⏳ 需批";
            cardStyle += " border-color:#fef08a; background:#fffdf5;";
        }

        btn.style.cssText = cardStyle;
        btn.innerHTML = `
            <div style="font-size:14px; font-weight:900; color:#1e293b;">${slot.time}</div>
            <div style="font-size:11px; color:#475569; margin:2px 0;">美甲師: ${slot.staff}</div>
            <span style="display:inline-block; font-size:9px; padding:1px 4px; border-radius:4px; font-weight:bold; background:#e2fbf0; color:#10b981;">${badgeText}</span>
        `;

        btn.addEventListener('click', () => {
            // 清除先前選取的樣式
            document.querySelectorAll('.slot-select-card').forEach(el => {
                el.style.borderColor = el.innerHTML.includes('⏳ 需批') ? "#fef08a" : "#cbd5e1";
                el.style.background = el.innerHTML.includes('⏳ 需批') ? "#fffdf5" : "white";
            });
            // 高亮選中
            btn.style.borderColor = "#db2777";
            btn.style.background = "#fdf2f8";
            
            bookingState.selectedSlot = slot;
            
            // 啟用底部發送按鈕
            const submitBtn = document.getElementById('whatsapp-submit-btn');
            if(submitBtn) {
                submitBtn.disabled = false;
                submitBtn.style.opacity = 1;
                submitBtn.style.background = "#25D366";
            }
        });

        grid.appendChild(btn);
    });

    wrapper.appendChild(grid);
}

// ⏳ 輔助函數：時間字串轉分鐘數
function timeToMins(tStr) {
    if(!tStr) return 0;
    let p = tStr.split(':');
    return (parseInt(p[0]) * 60) + (parseInt(p[1]) || 0);
}

// 🚀 最終站：打包所有項目，先寫入 Firebase 鎖定時段，再跳轉 WhatsApp
function executeWhatsAppBooking() {
    if(!bookingState.selectedSlot) return;
    
    const dateVal = document.getElementById('booking-date').value;
    const staffName = bookingState.selectedSlot.staff;
    const timeVal = bookingState.selectedSlot.time;
    const isRev = bookingState.selectedSlot.isReview;
    const isCust = bookingState.selectedSlot.isCustom;

    let zhItems = []; let enItems = [];
    const allMeta = [...servicesMetadata.nail_hand_base, ...servicesMetadata.nail_hand_addons, ...servicesMetadata.nail_foot_base, ...servicesMetadata.nail_foot_addons, ...servicesMetadata.lash, ...servicesMetadata.brows];
    allMeta.forEach(item => {
        if(bookingState.selectedItems.has(item.id)) {
            zhItems.push(item.zh.replace('💅','').replace('👁️','').replace('✒️','').trim());
            enItems.push(item.en.trim());
        }
    });

    let rushChecked = document.getElementById('chk-tag-rush').checked ? "⚡[趕時間]" : "";
    let noRemoveChecked = document.getElementById('chk-tag-noremove').checked ? "🚫[免拆甲]" : "";
    let sameDayChecked = document.getElementById('chk-tag-sameday').checked ? "🤝[手腳同做]" : "";
    let customRem = document.getElementById('custom-remarks').value.trim();
    let allRemarks = [rushChecked, noRemoveChecked, sameDayChecked, customRem].filter(Boolean).join(' ');

    // 計算預計結束時間
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

    // 🔒 核心重組：必須先成功寫入 Firebase，才准跳轉 WhatsApp
    database.ref(`v8_bookings/${yearMonthKey}/${staffName}/${dayKey}`).push(cloudBookingData).then(() => {
        
        // 彈窗實時肉眼實證連結成功
        alert("✅ 預約已成功同步至水晶閣雲端大腦！\n(Click OK to open WhatsApp)");

        let timeStatusText = isCust ? '⏳ 自選特殊時段 (⚠️非保證)' : (isRev ? '⏳ 接近下班安全線 (⚠️需審批)' : '🟢 系統自動即時預留');
        let msg = `✨ 水晶閣新預約申請 / New Appointment ✨\n------------------------------------\n📅 日期 / Date: ${dateVal}\n🕒 時間 / Time: ${timeVal}\n📊 狀態 / Status: ${timeStatusText}\n👤 指定員工 / Stylist: ${staffName}\n⏱️ 預計時長 / Duration: ${bookingState.totalDuration} 分鐘 (mins)\n\n🎁 預約項目 / Services:\n🔹 ${zhItems.join('\n🔹 ')}\n🔹 ${enItems.join('\n🔹 ')}\n\n`;
        if(allRemarks) msg += `📝 特別備註 / Remarks:\n${allRemarks}\n`;
        msg += `------------------------------------\n（此訊息由系統排班大腦生成，請按傳送，我們將為您核對確認。）`;

        const shopWhatsAppNumber = "85293436973";
        // 使用 location.href 完美避開 iPad 彈出視窗攔截器
        window.location.href = `https://api.whatsapp.com/send?phone=${shopWhatsAppNumber}&text=${encodeURIComponent(msg)}`;
    }).catch(err => alert("❌ 雲端寫入失敗，請檢查網路：" + err));
}
