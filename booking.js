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

    // 🌐 建立寫入雲端的核心資料結構
    let cloudBookingData = {
        customer: "WhatsApp 客人",
        item: zhItems.join(' + '),
        start: timeVal,
        end: endTimeStr,
        status: isCust ? "⏳ 特殊" : (isRev ? "⏳ 待審" : "🟢 吉時"),
        remarks: allRemarks
    };

    // 分拆日期鎖定 Firebase 路徑
    const parts = dateVal.split('-');
    const yearMonthKey = `${parts[0]}-${parts[1]}`;
    const dayKey = `day_${parseInt(parts[2])}`;

    // 🔒 第一步：直接向雲端資料庫「插旗寫入」紀錄
    database.ref(`v8_bookings/${yearMonthKey}/${staffName}/${dayKey}`).push(cloudBookingData).then(() => {
        
        // 🔒 第二步：雲端寫入成功後，隨即喚醒 WhatsApp 傳送對數訊息
        let timeStatusText = isCust ? '⏳ 自選特殊時段 (⚠️非保證)' : (isRev ? '⏳ 接近下班安全線 (⚠️需審批)' : '🟢 系統自動即時預留');
        let msg = `✨ 水晶閣新預約申請 / New Appointment ✨\n------------------------------------\n📅 日期 / Date: ${dateVal}\n🕒 時間 / Time: ${timeVal}\n📊 狀態 / Status: ${timeStatusText}\n👤 指定員工 / Stylist: ${staffName}\n⏱️ 預計時長 / Duration: ${bookingState.totalDuration} 分鐘 (mins)\n\n🎁 預約項目 / Services:\n🔹 ${zhItems.join('\n🔹 ')}\n🔹 ${enItems.join('\n🔹 ')}\n\n`;
        if(allRemarks) msg += `📝 特別備註 / Remarks:\n${allRemarks}\n`;
        msg += `------------------------------------\n（此訊息由系統排班大腦生成，請按傳送，我們將為您核對確認。）`;

        const shopWhatsAppNumber = "85293436973";
        window.open(`https://api.whatsapp.com/send?phone=${shopWhatsAppNumber}&text=${encodeURIComponent(msg)}`, '_blank');
    }).catch(err => alert("雲端同步失敗，請檢查網路：" + err));
}
