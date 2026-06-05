// 🔮 完美配置與排班系統直通的雲端資料庫鎖匙
const firebaseConfig = {
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

// 🗺️ 中英雙語國際化項目與時長資料庫 (完全契合水晶閣真實搏殺速度)
const servicesMetadata = {
    nail_hand_base: [
        { id: "h_soak", zh: "💅 Soak off gel 手部單色", en: "Soak Off Gel Hands (Solid)", time: 40 },
        { id: "h_hard", zh: "💅 Hard gel 手部製作", en: "Hard Gel Hands Structure", time: 60 },
        { id: "h_qq",   zh: "💅 QQ gel 快速手部",   en: "QQ Gel Express Hands", time: 20 },
        { id: "h_mani", zh: "🖐️ 純修手 Manicure",   en: "Pure Manicure Care", time: 10 },
        { id: "h_rem",  zh: "🖐️ 純卸甲 Removal 手", en: "Pure Gel Removal Hands", time: 15 }
    ],
    nail_hand_addons: [
        { id: "h_ext",  zh: "➕ 全手延長 Extension", en: "Full Hands Extension", time: 30 },
        { id: "h_grad", zh: "🎨 漸變款式",          en: "Gradient Style", time: 10 },
        { id: "h_fren", zh: "🎨 法式指甲",          en: "French Style", time: 20 },
        { id: "h_marb", zh: "🎨 暈染款式",          en: "Marble/Smudge Style", time: 20 },
        { id: "h_art",  zh: "🎨 畫花公仔款式",       en: "Cartoon Art Style", time: 30 },
        { id: "h_deco", zh: "✨ 貓眼/貝殼/金箔/貼紙",en: "Cat-Eye/Shell/Foil Deco", time: 10 }
    ],
    nail_foot_base: [
        { id: "f_pedi", zh: "🦶 純修腳 Pedicure",   en: "Pure Pedicure Care", time: 15 },
        { id: "f_rem",  zh: "🦶 腳部卸甲/Soak off",  en: "Pure Gel Removal Feet", time: 15 }
    ],
    nail_foot_addons: [
        { id: "f_grad", zh: "🎨 腳部漸變款式",       en: "Feet Gradient Style", time: 10 },
        { id: "f_fren", zh: "🎨 腳部法式指甲",       en: "Feet French Style", time: 20 },
        { id: "f_marb", zh: "🎨 腳部暈染款式",       en: "Feet Marble Style", time: 20 },
        { id: "f_art",  zh: "🎨 腳部畫花公仔款式",    en: "Feet Cartoon Art Style", time: 30 },
        { id: "f_deco", zh: "✨ 腳部貓眼/貝殼/貼紙",  en: "Feet Cat-Eye/Deco", time: 10 }
    ],
    lash: [
        { id: "l_ext",  zh: "👁️ 嫁接睫毛 (所有款式)", en: "Eyelash Extension (All)", time: 60 },
        { id: "l_lift", zh: "👁️ 角蛋白翹睫術 (日/普)",en: "Keratin Lash Lifting", time: 50 },
        { id: "l_brow", zh: "✏️ 純修眉服務",          en: "Pure Eyebrow Trimming", time: 10 }
    ],
    facial: [
        { id: "fac_basic", zh: "💆 面部護理 Facial",  en: "Professional Facial Care", time: 60 }
    ],
    brows: [
        { id: "br_tattoo", zh: "✒️ 定制紋綉 (霧眉/飄眉)",en: "Eyebrows Semi-Permanent", time: 120 }
    ]
};

// 系統核心運行狀態
let bookingState = {
    categories: { nail: false, lash: false, facial: false, brows: false },
    parts: { hand: false, foot: false },
    selectedItems: new Set(),
    employees: [], holidays: {}, overrides: {}, bookings: {},
    totalDuration: 0, selectedSlot: null
};

// 初始化與載入雲端大腦名單
window.onload = function() {
    // 預設日期為今日或明日 (比照排班主機)
    const now = new Date();
    let y = now.getFullYear(); let m = now.getMonth() + 1; let d = now.getDate();
    if (now.getHours() >= 20) {
        const tomo = new Date(now.getTime() + 24*60*60*1000);
        y = tomo.getFullYear(); m = tomo.getMonth() + 1; d = tomo.getDate();
    }
    document.getElementById('booking-date').value = `${y}-${m < 10 ? '0'+m : m}-${d < 10 ? '0'+d : d}`;
    
    // 直連 Firebase 讀取最新美甲師名單
    database.ref('v8_employees').once('value', (snap) => {
        if(snap.exists()) {
            bookingState.employees = snap.val();
            const selectEl = document.getElementById('booking-staff');
            bookingState.employees.forEach(e => {
                selectEl.innerHTML += `<option value="${e.name}">${e.name} [${e.role === '學徒' ? '學徒/Apprentice' : '美甲師/Stylist'}]</option>`;
            });
        }
    });
};

// 切換大類勾選
function toggleMainCategory(cat) {
    bookingState.categories[cat] = !bookingState.categories[cat];
    document.getElementById(`cate-card-${cat}`).classList.toggle('selected', bookingState.categories[cat]);
    document.getElementById(`main-chk-${cat}`).checked = bookingState.categories[cat];
    
    if(cat === 'nail') {
        document.getElementById('nail-part-selector-zone').style.display = bookingState.categories.nail ? 'block' : 'none';
        if(!bookingState.categories.nail) {
            bookingState.parts.hand = false; bookingState.parts.foot = false;
            document.getElementById('part-card-hand').classList.remove('selected'); document.getElementById('part-chk-hand').checked = false;
            document.getElementById('part-card-foot').classList.remove('selected'); document.getElementById('part-chk-foot').checked = false;
        }
    }
    renderSubDetails();
}

// 切換美甲手/腳部位
function toggleNailPart(part) {
    bookingState.parts[part] = !bookingState.parts[part];
    document.getElementById(`part-card-${part}`).classList.toggle('selected', bookingState.parts[part]);
    document.getElementById(`part-chk-${part}`).checked = bookingState.parts[part];
    renderSubDetails();
}

// 動態渲染款式細項多選區 (手腳分拆獨立掛鉤)
function renderSubDetails() {
    const container = document.getElementById('sub-details-render-zone');
    let html = '';

    // 渲染手部美甲細項
    if (bookingState.categories.nail && bookingState.parts.hand) {
        html += `<div class="sub-panel"><div class="sub-panel-title">🖐️ 手部美甲項目 / Hands Nail Selection</div>`;
        html += `<div class="grid-2" style="margin-bottom:8px;">` + generateCheckCardsHtml(servicesMetadata.nail_hand_base) + `</div>`;
        html += `<div style="font-size:11px; font-weight:bold; color:#be185d; margin:6px 0 4px 0;">✨ 可多選疊加手部款式 / Optional Add-ons:</div>`;
        html += `<div class="grid-3">` + generateCheckCardsHtml(servicesMetadata.nail_hand_addons) + `</div></div>`;
    }
    // 渲染腳部美甲細項
    if (bookingState.categories.nail && bookingState.parts.foot) {
        html += `<div class="sub-panel" style="border-color:#be185d;"><div class="sub-panel-title" style="background:#fce7f3; color:#be185d;">🦶 腳部美甲項目 / Feet Nail Selection</div>`;
        html += `<div class="grid-2" style="margin-bottom:8px;">` + generateCheckCardsHtml(servicesMetadata.nail_foot_base) + `</div>`;
        html += `<div style="font-size:11px; font-weight:bold; color:#be185d; margin:6px 0 4px 0;">✨ 可多選疊加腳部款式 / Optional Add-ons:</div>`;
        html += `<div class="grid-3">` + generateCheckCardsHtml(servicesMetadata.nail_foot_addons) + `</div></div>`;
    }
    // 渲染其他非美甲大類
    if (bookingState.categories.lash) html += `<div class="sub-panel"><div class="sub-panel-title">👁️ 美睫與修眉 / Eyelash & Brows</div><div class="grid-2">` + generateCheckCardsHtml(servicesMetadata.lash) + `</div></div>`;
    if (bookingState.categories.facial) html += `<div class="sub-panel"><div class="sub-panel-title">💆 面部護理 / Facial Care</div><div class="grid-2">` + generateCheckCardsHtml(servicesMetadata.facial) + `</div></div>`;
    if (bookingState.categories.brows) html += `<div class="sub-panel"><div class="sub-panel-title">✒️ 定制紋綉 / Semi-Permanent Tattoo</div><div class="grid-2">` + generateCheckCardsHtml(servicesMetadata.brows) + `</div></div>`;

    container.innerHTML = html;
    calculateTotalDuration();
}

function generateCheckCardsHtml(metaArray) {
    return metaArray.map(item => {
        let isSel = bookingState.selectedItems.has(item.id) ? 'selected' : '';
        let isChk = bookingState.selectedItems.has(item.id) ? 'checked' : '';
        return `<div class="check-card ${isSel}" onclick="handleItemClick('${item.id}')">
                    <input type="checkbox" id="chk-${item.id}" ${isChk} pointer-events="none">
                    <div class="card-name">${item.zh}<br><span style="font-size:10px; font-weight:normal; color:#6b7280;">${item.en}</span></div>
                    <div class="card-time">+${item.time}m</div>
                </div>`;
    }).join('');
}

function handleItemClick(id) {
    if (bookingState.selectedItems.has(id)) { bookingState.selectedItems.delete(id); } 
    else { bookingState.selectedItems.add(id); }
    renderSubDetails();
}

// 📐 總時長連鎖動態加總計算器
function calculateTotalDuration() {
    let sum = 0;
    const allMeta = [...servicesMetadata.nail_hand_base, ...servicesMetadata.nail_hand_addons, ...servicesMetadata.nail_foot_base, ...servicesMetadata.nail_foot_addons, ...servicesMetadata.lash, ...servicesMetadata.facial, ...servicesMetadata.brows];
    allMeta.forEach(item => { if(bookingState.selectedItems.has(item.id)) sum += item.time; });
    bookingState.totalDuration = sum;
    document.getElementById('live-timer-bar').innerText = `⏱️ 預計總時長 / Estimated Duration: ${sum} 分鐘 (mins)`;
    handleBookingDateOrStaffChange(); 
}

// 題前執行觸發日期或人員變動，從雲端拉取排班與預約數據
function handleBookingDateOrStaffChange() {
    const dateVal = document.getElementById('booking-date').value;
    if(!dateVal || bookingState.totalDuration === 0) {
        document.getElementById('time-slots-container').innerHTML = `<div style="grid-column: span 3; text-align:center; padding:20px; color:#9ca3af; font-size:13px; font-weight:bold;">請選擇服務項目與日期 / Please select services & date</div>`;
        document.getElementById('btn-submit-booking').disabled = true;
        return;
    }
    
    const parts = dateVal.split('-');
    const yearMonthKey = `${parts[0]}-${parts[1]}`;
    const dayKey = `day_${parseInt(parts[2])}`;
    
    // 一鍵同步雲端四大節點：假表、微調、歷史預約
    Promise.all([
        database.ref(`v8_holidays/${yearMonthKey}`).once('value'),
        database.ref(`v8_overrides/${yearMonthKey}/${dayKey}`).once('value'),
        database.ref(`v8_bookings/${yearMonthKey}`).once('value')
    ]).then(([holSnap, ovrSnap, bookSnap]) => {
        bookingState.holidays = holSnap.exists() ? holSnap.val() : {};
        bookingState.overrides = ovrSnap.exists() ? ovrSnap.val() : null;
        bookingState.bookings = bookSnap.exists() ? bookSnap.val() : {};
        精算可用時間空檔(parseInt(parts[2]), parts[0], parts[1]);
    });
}

// 🧠 核心：9小時班次 ＋ 10分鐘雙向重疊緩衝 ＋ 尾段30分鐘審批制演算法
function 精算可用時間空檔(dayNumber, year, month) {
    const container = document.getElementById('time-slots-container');
    container.innerHTML = '';
    
    const selectedStaff = document.getElementById('booking-staff').value;
    const dateStr = `${year}-${month}-${dayNumber < 10 ? '0'+dayNumber : dayNumber}`;
    const dayOfWeek = new Date(year, month - 1, dayNumber).getDay();
    const isSun = (dayOfWeek === 0);

    // 1. 生成全日 30 分鐘間隔的候選池 (從 10:00 到 21:30)
    let timeCandidates = [];
    for (let h = 10; h <= 21; h++) {
        ['00', '30'].forEach(m => { timeCandidates.push(`${h < 10 ? '0'+h : h}:${m}`); });
    }

    let availableSlotsData = [];

    // 2. 篩選美甲師
    let targetsStaffs = [];
    if (selectedStaff === 'auto') {
        targetsStaffs = bookingState.employees.filter(e => !(bookingState.holidays[e.name] || []).includes(dayNumber));
    } else {
        if ((bookingState.holidays[selectedStaff] || []).includes(dayNumber)) {
            container.innerHTML = `<div style="grid-column: span 3; text-align:center; padding:20px; color:var(--danger); font-weight:bold;">❌ 抱歉，該美甲師當天休假 / On Holiday</div>`;
            return;
        }
        targetsStaffs = bookingState.employees.filter(e => e.name === selectedStaff);
    }

    if(targetsStaffs.length === 0) {
        container.innerHTML = `<div style="grid-column: span 3; text-align:center; padding:20px; color:var(--danger); font-weight:bold;">❌ 當天沒有可用人手 / No staff available</div>`;
        return;
    }

    // 3. 遍歷每個時間點，精算是否撞客及班次是否吻合
    timeCandidates.forEach(slotStart => {
        let staffFoundForThisSlot = null;
        let isReviewMode = false;

        for (let staff of targetsStaffs) {
            // A. 計算該員工當天的上班與原定下班時間 (基本9小時)
            let startHour = 12; // 預設中班
            if (staff.times) {
                let pTime = staff.times.split(',')[0].trim();
                startHour = parseInt(pTime.split(':')[0]) || 12;
            }
            if (isSun) startHour = 11; // 星期日自動提早

            // 如果有經理手動微調更表，優先依循微調更表
            if (bookingState.overrides) {
                let foundInOvr = false;
                ['F79', 'GK3', 'G38', 'G2'].forEach(shop => {
                    (bookingState.overrides[shop] || []).forEach(s => {
                        if (s.name === staff.name && s.time) {
                            let tStr = s.time; if(tStr.includes('(')) tStr = tStr.match(/\(([^)]+)\)/)?.[1] || tStr;
                            startHour = parseInt(tStr.split(':')[0]) || startHour;
                            foundInOvr = true;
                        }
                    });
                });
            }

            let shiftStartMins = startHour * 60;
            let shiftEndMins = shiftStartMins + (9 * 60); // 🚀 鎖定 9 小時基本班次

            // B. 轉換當前選取時間為分鐘數
            let slotStartMins = timeToMins(slotStart);
            let slotEndMins = slotStartMins + bookingState.totalDuration;

            // 檢查：預約開始時間不能早於上班時間
            if (slotStartMins < shiftStartMins) continue;

            // C. 🔒 尾段 30 分鐘防線規則：原定下班前半小時內不接自動預約，轉為黃燈審批制
            let reviewGateMins = shiftEndMins - 30;
            let currentSlotReview = false;
            if (slotStartMins >= reviewGateMins && slotStartMins < shiftEndMins) {
                currentSlotReview = true; // 進入黃燈安全防禦閘門
            } else if (slotStartMins >= shiftEndMins) {
                continue; // 已經完全超過下班時間，不開放外網盲約
            }

            // D. 🛡️ 核心：10分鐘雙向重疊防撞演算法 (核對現有 Firebase 已存在預約)
            let isClashed = false;
            let staffExistingBookings = bookingState.bookings[staff.name]?.[`day_${dayNumber}`] || [];
            
            for (let b of staffExistingBookings) {
                let existStart = timeToMins(b.start);
                let existEnd = timeToMins(b.end);
                
                // 計算重疊區間：Overlap = max(0, min(EndA, EndB) - max(StartA, StartB))
                let overlapMins = Math.max(0, Math.min(slotEndMins, existEnd) - Math.max(slotStartMins, existStart));
                if (overlapMins > 10) { // 🚀 只要重疊超過 10 分鐘，直接判定封鎖
                    isClashed = true;
                    break;
                }
            }

            if (!isClashed) {
                staffFoundForThisSlot = staff.name;
                isReviewMode = currentSlotReview;
                break; // 找到有一位同事可以接，即可亮燈
            }
        }

        if (staffFoundForThisSlot) {
            availableSlotsData.push({ time: slotStart, staff: staffFoundForThisSlot, review: isReviewMode });
        }
    });

    // 4. 渲染按鈕到畫面
    if (availableSlotsData.length === 0) {
        container.innerHTML = `<div style="grid-column: span 3; text-align:center; padding:20px; color:#6b7280;">⚠️ 抱歉，當天此時段已約滿 / No available time slot</div>`;
        return;
    }

    availableSlotsData.forEach(item => {
        let btnClass = item.review ? 'slot-btn review-mode' : 'slot-btn';
        let displayText = item.review ? `${item.time} ⏳` : item.time;
        container.innerHTML += `<button class="${btnClass}" id="btn-slot-${item.time}" onclick="selectTimeSlot('${item.time}', '${item.staff}', ${item.review})">${displayText}</button>`;
    });
}

function selectTimeSlot(time, staff, isReview) {
    bookingState.selectedSlot = { time, staff, isReview };
    document.querySelectorAll('.slot-btn').forEach(b => b.classList.remove('selected'));
    document.getElementById(`btn-slot-${time}`).classList.add('selected');
    document.getElementById('btn-submit-booking').disabled = false;
}

function toggleQuickTag(tagId) {
    const chk = document.getElementById(`chk-tag-rush` ? `chk-tag-${tagId}` : `chk-tag-${tagId}`);
    if(!chk) return;
    chk.checked = !chk.checked;
    document.getElementById(`tag-${tagId}`).classList.toggle('active', chk.checked);
}

// 🚀 最終站：打包所有多選項目，一鍵無縫跳轉 WhatsApp 發送
function executeWhatsAppBooking() {
    if(!bookingState.selectedSlot) return;
    
    const dateVal = document.getElementById('booking-date').value;
    const staffName = bookingState.selectedSlot.staff;
    const timeVal = bookingState.selectedSlot.time;
    const isRev = bookingState.selectedSlot.isReview;

    // 彙整所有勾選的項目名稱
    let zhItems = []; let enItems = [];
    const allMeta = [...servicesMetadata.nail_hand_base, ...servicesMetadata.nail_hand_addons, ...servicesMetadata.nail_foot_base, ...servicesMetadata.nail_foot_addons, ...servicesMetadata.lash, ...servicesMetadata.facial, ...servicesMetadata.brows];
    allMeta.forEach(item => {
        if(bookingState.selectedItems.has(item.id)) {
            zhItems.push(item.zh.split('(')[0].trim());
            enItems.push(item.en.split('(')[0].trim());
        }
    });

    // 備註標籤
    let rushChecked = document.getElementById('chk-tag-rush').checked ? "⚠️ [特別趕時間 / Very Tight Schedule]" : "";
    let noRemoveChecked = document.getElementById('chk-tag-noremove').checked ? "🚫 [免拆甲 / No Gel Removal]" : "";
    let customRem = document.getElementById('custom-remarks').value.trim();

    // 👑 組合極致精美的中英對照確認信範本
    let msg = `✨ 水晶閣新預約申請 / New Appointment Request ✨\n`;
    msg += `------------------------------------\n`;
    msg += `📅 日期 / Date: ${dateVal}\n`;
    msg += `🕒 時間 / Time: ${timeVal} ${isRev ? '(⏳ 需店舖確認 / Pending Approval)' : '(🟢 綠色吉時)'}\n`;
    msg += `👤 指定員工 / Stylist: ${staffName}\n`;
    msg += `⏱️ 預計時長 / Duration: ${bookingState.totalDuration} 分鐘 (mins)\n\n`;
    msg += `🎁 預約項目 / Services:\n🔹 ${zhItems.join('\n🔹 ')}\n`;
    msg += `🔹 ${enItems.join('\n🔹 ')}\n\n`;
    
    if(rushChecked || noRemoveChecked || customRem) {
        msg += `📝 特別備註 / Remarks:\n`;
        if(rushChecked) msg += `${rushChecked}\n`;
        if(noRemoveChecked) msg += `${noRemoveChecked}\n`;
        if(customRem) msg += `✍️ ${customRem}\n`;
    }
    msg += `------------------------------------\n`;
    msg += `（此訊息由系統根據排班大腦即時生成，請傳送以鎖定空檔）`;

    // 跳轉至水晶閣官方 WhatsApp 介面
    const shopWhatsAppNumber = "85293436973"; // 價目表名片上的官方 WhatsApp
    const encodedMsg = encodeURIComponent(msg);
    window.open(`https://api.whatsapp.com/send?phone=${shopWhatsAppNumber}&text=${encodedMsg}`, '_blank');
}

// 小工具：時間轉分鐘
function timeToMins(tStr) {
    let p = tStr.split(':');
    return (parseInt(p[0]) * 60) + (parseInt(p[1]) || 0);
}

