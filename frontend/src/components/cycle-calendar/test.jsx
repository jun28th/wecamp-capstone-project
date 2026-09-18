const startDate = new Date(startDateStr);

    // --- [THÊM LOGIC KIỂM TRA TẠI ĐÂY] ---
    // Tìm chu kỳ gần nhất nằm SAU ngày startDate mà người dùng vừa chọn
    // cycleLogs thường đã được sắp xếp từ mới nhất -> cũ nhất, ta tìm chu kỳ có startDate > startDateStr
    const nextCycle = cycleLogs
      .slice()
      .reverse() // Đảo lại theo thứ tự thời gian tăng dần (cũ -> mới) nếu cần, hoặc lọc trực tiếp:
      .find(log => log.startDate > startDateStr);

    if (nextCycle) {
      const nextCycleStart = new Date(nextCycle.startDate);
      // Giả sử kỳ kinh nguyệt tối đa kéo dài khoảng 7-10 ngày, hoặc bắt buộc phải kết thúc trước chu kỳ sau
      // Ta tính suggestedEnd là start + 4 ngày (như cũ) nhưng không được vượt quá ngày bắt đầu của chu kỳ sau - 1 ngày
      const maxPossibleEnd = new Date(nextCycleStart);
      maxPossibleEnd.setDate(maxPossibleEnd.getDate() - 1);

      const suggestedEnd = new Date(startDate);
      suggestedEnd.setDate(startDate.getDate() + 4);

      // Nếu ngày gợi ý vượt quá chu kỳ sau, ép nó lùi lại trước chu kỳ sau
      const finalEnd = suggestedEnd > maxPossibleEnd ? maxPossibleEnd : suggestedEnd;

      setTempPastStart(startDateStr);

      const y = finalEnd.getFullYear();
      const m = String(finalEnd.getMonth() + 1).padStart(2, "0");
      const d = String(finalEnd.getDate()).padStart(2, "0");
      const suggestedStr = `${y}-${m}-${d}`;

      setPreviewEndDate(suggestedStr);
      setShowEndPopupForDate(suggestedStr);
    }
