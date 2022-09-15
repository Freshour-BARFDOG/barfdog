export const gradeTransferFilter = function (grade) {
    // 브론즈, 실버, 골드, 플래티넘, 다이아몬드, 더바프

    switch (grade) {
      case 'BRONZE':
        return '브론즈';
      case 'SILVER':
        return '실버';
      case 'GOLD':
        return '골드';
      case 'PLATINUM':
        return '플래티넘';
      case 'DIA':
        return '다이아';
      case 'THEBARF':
        return '더바프';
            
      default:
        return grade;
    }
  }