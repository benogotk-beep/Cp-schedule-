// 🔮 雲端資料庫連線鎖匙
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

if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// 🆔 幸運三位數員工編號矩陣 (全盤完美避開「4」字，純名字選單顯示)
const staffIds = {
    "阿平": "101", "RUBY": "102", "如意": "103", "影": "105", "慧嫻": "106",
    "二妹": "107", "TT": "108", "Cici": "109", "珍": "110", "Jackie": "111",
    "澄澄": "113", "ALICE": "115", "阿璇": "116", "Mandy婷": "117", "妙妙": "118",
    "葉子": "119", "Lucia": "120", "AMY": "121", "小茹": "122", "文君": "123"
};

// 💅 國際化中英精簡資料庫 (徹底移除面部護理、修正QQ Gel翻譯、表面完全隱藏時間標籤)
const servicesMetadata = {
    nail_hand_base: [
        { id: "h_soak", zh: "Soak off gel 手部單色", en: "Soak Off Gel (Hands)", time: 40 },
        { id: "h_hard", zh: "Hard gel 手部製作", en: "Hard Gel (Hands)", time: 60 },
        { id: "h_qq",   zh: "QQ Gel 快速手部",   en: "QQ Gel (Express Hands)", time: 20 },
        { id: "h_mani", zh: "純修手 Manicure",   en: "Manicure Care", time: 10 },
        { id: "h_rem",  zh: "純卸甲 Removal (手)", en: "Gel Removal (Hands)", time: 15 }
    ],
    nail_hand_addons: [
        { id: "h_ext",  zh: "全手延長 Extension", en: "Full Hands Extension", time: 30 },
        { id: "h_grad", zh: "漸變款式",          en: "Gradient Style", time: 10 },
        { id: "h_fren", zh: "法式指甲",          en: "French Style", time: 20 },
        { id: "h_marb", zh: "暈染款式",          en: "Marble Style", time: 20 },
        { id: "h_art",  zh: "畫花公仔款式",       en: "Cartoon Art Style", time: 30 },
        { id: "h_deco", zh: "貓眼/貝殼/金箔/貼紙",en: "Cat-Eye/Shell Deco", time: 10 }
    ],
    nail_foot_base: [
        { id: "f_pedi", zh: "純修腳 Pedicure",   en: "Pedicure Care", time: 15 },
        { id: "f_rem",  zh: "腳部卸甲/Soak off",  en: "Gel Removal (Feet)", time: 15 }
    ],
    nail_foot_addons: [
        { id: "f_grad", zh: "腳部漸變款式",       en: "Feet Gradient Style", time: 10 },
        { id: "f_fren", zh: "腳部法式指甲",       en: "Feet French Style", time: 20 },
        { id: "f_marb", zh: "腳部暈染款式",       en: "Feet Marble Style", time: 20 },
        { id: "f_art",  zh: "腳部畫花公仔款式",    en: "Feet Cartoon Art Style", time: 30 },
        { id: "f_deco", zh: "腳部貓眼/貝殼/貼紙",  en: "Feet Cat-Eye Deco", time: 10 }
    ],
    lash: [
        { id: "l_ext",  zh: "嫁接睫毛 (所有款式)", en: "Eyelash Extension", time: 60 },
        { id: "l_lift", zh: "角蛋白翹睫術 (日/普)",en: "Keratin Lash Lifting", time: 50 },
        { id: "l_brow", zh: "純修眉服務",          en: "Eyebrow Trimming", time: 10 }
    ],
    brows: [
        { id: "br_tattoo", zh: "定制紋綉 (霧眉/飄眉)",en: "Semi-Permanent Brows", time: 120 }
    ]
};

let bookingState = {
    categories: { nail: false, lash: false, brows: false },
    parts: { hand: false, foot: false },
    selectedItems: new Set(),
    employees: [], holidays: {}, overrides: {}, bookings: {},
    totalDuration: 0, selectedSlot: null
};

window.onload = function() {
    const now = new Date();
    let y = now.getFullYear(); let m = now.getMonth() + 1; let d = now.getDate();
    if (now.getHours() >= 20) {
        const tomo = new Date(now.getTime() + 24*60*60*1000);
        y = tomo.getFullYear(); m = tomo.getMonth() + 1; d = tomo.getDate();
    }
    document.getElementById('booking-date').value = `${y}-${m < 10 ? '0'+m : m}-${d < 10 ? '0'+d : d}`;
    
    // 員工選單優化：純名字顯示
    database.ref('v8_employees').once('value', (snap) => {
        if(snap.exists()) {
            bookingState.employees = snap.val();
            const selectEl = document.getElementById('booking-staff');
            bookingState.employees.forEach(e => {
                let code = staffIds[e.name] || "000";
                selectEl.innerHTML += `<option value="${e.name}">#${code} ${e.name}</option>`;
            });
        }
    });
};

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

function toggleNailPart(part) {
    bookingState.parts[part] = !bookingState.parts[part];
    document.getElementById(`part-card-${part}`).classList.toggle('selected', bookingState.parts[part]);
    document.getElementById(`part-chk-${part}`).checked = bookingState.parts[part];
    renderSubDetails();
}

function renderSubDetails() {
    const container = document.getElementById('sub-details-render-zone');
    let html = '';

    if (bookingState.categories.nail && bookingState.parts.hand) {
        html += `<div class="sub-panel"><div class="sub-panel-title">🖐️ 手部美甲 / Hands Nail</div>`;
        html += `<div class="grid-2" style="margin-bottom:6px;">` + generateCheckCardsHtml(servicesMetadata.nail_hand_base, false) + `</div>`;
        html += `<div class="grid-3">` + generateCheckCardsHtml(servicesMetadata.nail_hand_addons, true) + `</div></div>`;
    }
    if (bookingState.categories.nail && bookingState.parts.foot) {
        html += `<div class="sub-panel" style="border-color:#be185d;"><div class="sub-panel-title" style="background:#fce7f3; color:#be185d;">🦶 腳部美甲 / Feet Nail</div>`;
        html += `<div class="grid-2" style="margin-bottom:6px;">` + generateCheckCardsHtml(servicesMetadata.nail_foot_base, false) + `</div>`;
        html += `<div class="grid-3">` + generateCheckCardsHtml(servicesMetadata.nail_foot_addons, true) + `</div></div>`;
    }
    if (bookingState.categories.lash) html += `<div class="sub-panel"><div class="sub-panel-title">👁️ 美睫 / Eyelash</div><div class="grid-2">` + generateCheckCardsHtml(servicesMetadata.lash, false) + `</div></div>`;
    if (bookingState.categories.brows) html += `<div class="sub-panel"><div class="sub-panel-title">✒️ 定制紋綉 / Brows Tattoo</div><div class="grid-2">` + generateCheckCardsHtml(servicesMetadata.brows, false) + `</div></div>`;

    container.innerHTML = html;
    calculateTotalDuration();
}

function generateCheckCardsHtml(metaArray, isAddon) {
    return metaArray.map(item => {
        let isSel = bookingState.selectedItems.has(item.id) ? 'selected' : '';
        let isChk = bookingState.selectedItems.has(item.id) ? 'checked' : '';
        if(isAddon) {
            return `<div class="addon-card ${isSel}" onclick="handleItemClick('${item.id}')">
                        <input type="checkbox" id="chk-${item.id}" ${isChk} pointer-events="none">
                        <div>${item.zh}<br><span style="font-size:9px; font-weight:normal; color:#6b7280;">${item.en}</span></div>
                    </div>`;
        } else {
            return `<div class="check-card ${isSel}" onclick="handleItemClick('${item.id}')">
                        <input type="checkbox" id="chk-${item.id}" ${isChk} pointer-events="none">
                        <div class="card-name">${item.zh}<br><span style="font-size:10px; font-weight:normal; color:#6b7280;">${item.en}</span></div>
                    </div>`;
        }
    }).join('');
}

function handleItemClick(id) {
    if (bookingState.selectedItems.has(id)) { bookingState.selectedItems.delete(id); } 
    else { bookingState.selectedItems.add(id); }
    renderSubDetails();
}

// 📐 總時長連鎖動態加總計算器 (手腳同做 Max 折減算法)
function calculateTotalDuration() {
    let handSum = 0; let footSum = 0; let otherSum = 0;

    servicesMetadata.nail_hand_base.forEach(item => { if(bookingState.selectedItems.has(item.id)) handSum += item.time; });
    servicesMetadata.nail_hand_addons.forEach(item => { if(bookingState.selectedItems.has(item.id)) handSum += item.time; });
    servicesMetadata.nail_foot_base.forEach(item => { if(bookingState.selectedItems.has(item.id)) footSum += item.time; });
    servicesMetadata.nail_foot_addons.forEach(item => { if(bookingState.selectedItems.has(item.id)) footSum += item.time; });
    servicesMetadata.lash.forEach(item => { if(bookingState.selectedItems.has(item.id)) otherSum += item.time; });
    servicesMetadata.brows.forEach(item => { if(bookingState.selectedItems.has(item.id)) otherSum += item.time; });

    const sameDayChecked = document.getElementById('chk-tag-sameday') && document.getElementById('chk-tag-sameday').checked;
    
    if (sameDayChecked) {
        bookingState.totalDuration = Math.max(handSum, footSum) + otherSum; // 🤝 手腳同做：取兩者最大值疊加其他項目
    } else {
        bookingState.totalDuration = handSum + footSum + otherSum; // 👣 預設：手腳時間獨立分開完整累加
    }

    document.getElementById('live-timer-bar').innerText = `⏱️ 預計總時長 / Estimated Duration: ${bookingState.totalDuration} 分鐘 (mins)`;
    handleBookingDateOrStaffChange(); 
}

function handleBookingDateOrStaffChange() {
    const dateVal = document.getElementById('booking-date').value;
    if(!dateVal || bookingState.totalDuration === 0) {
        document.getElementById('time-slots-container').innerHTML = `<div style="grid-column: span 3; text-align:center; padding:15px; color:#9ca3af; font-size:12px; font-weight:bold;">請選擇服務項目與日期 / Please select services & date</div>`;
        document.getElementById('btn-submit-booking').disabled = true;
        return;
    }
    const parts = dateVal.split('-');
    const yearMonthKey = `${parts[0]}-${parts[1]}`;
    const dayKey = `day_${parseInt(parts[2])}`;
    
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

// 🧠 精算可用時間空檔 (常態9小時制 ＋ 10分鐘緩衝 ＋ 系統分配零沙漏防線)
function 精算可用時間空檔(dayNumber, year, month) {
    const container = document.getElementById('time-slots-container');
    container.innerHTML = '';
    
    const selectedStaff = document.getElementById('booking-staff').value;
    const dayOfWeek = new Date(year, month - 1, dayNumber).getDay();
    const isSun = (dayOfWeek === 0);

    let timeCandidates = [];
    for (let h = 10; h <= 21; h++) {
        ['00', '30'].forEach(m => { timeCandidates.push(`${h < 10 ? '0'+h : h}:${m}`); });
    }

    let availableSlotsData = [];
    let targetsStaffs = [];

    if (selectedStaff === 'auto') {
        targetsStaffs = bookingState.employees.filter(e => !(bookingState.holidays[e.name] || []).includes(dayNumber));
    } else {
        if ((bookingState.holidays[selectedStaff] || []).includes(dayNumber)) {
            container.innerHTML = `<div style="grid-column: span 3; text-align:center; padding:15px; color:#ef4444; font-weight:bold; font-size:12px;">❌ 抱歉，該美甲師當天休假 / On Holiday</div>`;
            return;
        }
        targetsStaffs = bookingState.employees.filter(e => e.name === selectedStaff);
    }

    timeCandidates.forEach(slotStart => {
        let staffFoundForThisSlot = null;
        let isReviewMode = false;

        for (let staff of targetsStaffs) {
            let startHour = 12;
            if (staff.times) startHour = parseInt(staff.times.split(',')[0].trim().split(':')[0]) || 12;
            if (isSun) startHour = 11;

            if (bookingState.overrides) {
                ['F79', 'GK3', 'G38', 'G2'].forEach(shop => {
                    (bookingState.overrides[shop] || []).forEach(s => {
                        if (s.name === staff.name && s.time) {
                            let tStr = s.time; if(tStr.includes('(')) tStr = tStr.match(/\(([^)]+)\)/)?.[1] || tStr;
                            startHour = parseInt(tStr.split(':')[0]) || startHour;
                        }
                    });
                });
            }

            let shiftStartMins = startHour * 60;
            let shiftEndMins = shiftStartMins + (9 * 60);
            let slotStartMins = timeToMins(slotStart);
            let slotEndMins = slotStartMins + bookingState.totalDuration;

            if (slotStartMins < shiftStartMins) continue;

            let reviewGateMins = shiftEndMins - 30;
            let currentSlotReview = false;
            
            if (slotStartMins >= reviewGateMins && slotStartMins < shiftEndMins) {
                currentSlotReview = true;
            } else if (slotStartMins >= shiftEndMins) {
                continue;
            }

            // 🌟 核心修正：系統分配時，直接隱藏、剔除所有需人工審批的沙漏時段 (零沙漏)
            if (selectedStaff === 'auto' && currentSlotReview) continue; 

            // 🛡️ 10分鐘雙向防撞算法
            let isClashed = false;
            let staffExistingBookings = bookingState.bookings[staff.name]?.[`day_${dayNumber}`] || [];
            
            for (let b of staffExistingBookings) {
                let existStart = timeToMins(b.start);
                let existEnd = timeToMins(b.end);
                let overlapMins = Math.max(0, Math.min(slotEndMins, existEnd) - Math.max(slotStartMins, existStart));
                if (overlapMins > 10) { isClashed = true; break; }
            }

            if (!isClashed) { staffFoundForThisSlot = staff.name; isReviewMode = currentSlotReview; break; }
        }

        if (staffFoundForThisSlot) {
            availableSlotsData.push({ time: slotStart, staff: staffFoundForThisSlot, review: isReviewMode });
        }
    });

    if (availableSlotsData.length === 0) {
        container.innerHTML = `<div style="grid-column: span 3; text-align:center; padding:15px; color:#6b7280; font-size:12px;">⚠️ 抱歉，當天此時段已約滿 / No available time slot</div>`;
        return;
    }

    availableSlotsData.forEach(item => {
        let btnClass = item.review ? 'slot-btn review-mode' : 'slot-btn';
        let displayText = item.review ? `${item.time} ⏳` : item.time;
        container.innerHTML += `<button class="${btnClass}" id="btn-slot-${item.time}" onclick="selectTimeSlot('${item.time}', '${item.staff}', ${item.review})">${displayText}</button>`;
    });
}

function selectTimeSlot(time, staff, isReview) {
    bookingState.selectedSlot = { time, staff, isReview, isCustom: false };
    document.querySelectorAll('.slot-btn').forEach(b => b.classList.remove('selected'));
    if(document.getElementById(`btn-slot-${time}`)) document.getElementById(`btn-slot-${time}`).classList.add('selected');
    document.getElementById('custom-time-select').value = ""; // 選取標準按鈕時，清空下方自選特殊時間下拉選單
    document.getElementById('btn-submit-booking').disabled = false;
}

function handleCustomTimeSelectChange() {
    const customVal = document.getElementById('custom-time-select').value;
    if(!customVal) return;
    document.querySelectorAll('.slot-btn').forEach(b => b.classList.remove('selected'));
    const selectedStaff = document.getElementById('booking-staff').value;
    let assignedStaff = selectedStaff === 'auto' ? "🌟 系統彈性指派 (Auto)" : selectedStaff;
    bookingState.selectedSlot = { time: customVal, staff: assignedStaff, isReview: true, isCustom: true };
    document.getElementById('btn-submit-booking').disabled = false;
}

function toggleQuickTag(tagId) {
    const chk = document.getElementById(`chk-tag-${tagId}`);
    if(!chk) return;
    chk.checked = !chk.checked;
    document.getElementById(`tag-${tagId}`).classList.toggle('active', chk.checked);
    if(tagId === 'sameday') calculateTotalDuration(); // 即時重算手腳同做之Max值
}

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
        if(bookingState.selectedItems.has(item.id)) { zhItems.push(item.zh); enItems.push(item.en); }
    });

    let rushChecked = document.getElementById('chk-tag-rush').checked ? "⚠️ [特別趕時間 / Tight Schedule]" : "";
    let noRemoveChecked = document.getElementById('chk-tag-noremove').checked ? "🚫 [免拆甲 / No Removal]" : "";
    let sameDayChecked = document.getElementById('chk-tag-sameday').checked ? "🤝 [手腳同做 / Simultaneous Service]" : "";
    let customRem = document.getElementById('custom-remarks').value.trim();

    let timeStatusText = '🟢 系統自動即時預留 (Instant Blocked)';
    if (isCust) {
        timeStatusText = '⏳ 自選特殊時段 (⚠️ 非保證時段，以店舖人員 WhatsApp 確認為準)';
    } else if (isRev) {
        timeStatusText = '⏳ 接近下班安全線 (⚠️ 需待經理人工審批確認 / Pending Approval)';
    }

    let msg = `✨ 水晶閣新預約申請 / New Appointment ✨\n`;
    msg += `------------------------------------\n`;
    msg += `📅 日期 / Date: ${dateVal}\n`;
    msg += `🕒 時間 / Time: ${timeVal}\n`;
    msg += `📊 狀態 / Status: ${timeStatusText}\n`;
    msg += `👤 指定員工 / Stylist: ${staffName}\n`;
    msg += `⏱️ 預計時長 / Duration: ${bookingState.totalDuration} 分鐘 (mins)\n\n`;
    msg += `🎁 預約項目 / Services:\n🔹 ${zhItems.join('\n🔹 ')}\n`;
    msg += `🔹 ${enItems.join('\n🔹 ')}\n\n`;
    
    if(rushChecked || noRemoveChecked || sameDayChecked || customRem) {
        msg += `📝 特別備註 / Remarks:\n`;
        if(rushChecked) msg += `${rushChecked}\n`;
        if(noRemoveChecked) msg += `${noRemoveChecked}\n`;
        if(sameDayChecked) msg += `${sameDayChecked}\n`;
        if(customRem) msg += `✍️ ${customRem}\n`;
    }
    msg += `------------------------------------\n`;
    msg += `（此訊息由系統排班大腦生成，請按傳送，我們將為您核對確認。）`;

    const shopWhatsAppNumber = "85293436973";
    window.open(`https://api.whatsapp.com/send?phone=${shopWhatsAppNumber}&text=${encodeURIComponent(msg)}`, '_blank');
}

function timeToMins(tStr) {
    let p = tStr.split(':');
    return (parseInt(p[0]) * 60) + (parseInt(p[1]) || 0);
}
