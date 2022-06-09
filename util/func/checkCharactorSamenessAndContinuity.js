


const checkCharactorSamenessAndContinuity = (value) => {
  let message = {};
  // PW - 동일성, 연속성 체크
  let SamePass_0 = 0; //동일문자 카운트
  let SamePass_1 = 0; //연속성(+) 카운드
  let SamePass_2 = 0; //연속성(-) 카운드
  for (let i = 0; i < value.length; i++) {
    let chr_pass_0;
    let chr_pass_1;
    let chr_pass_2;
    if (i >= 2) {
      chr_pass_0 = value.charCodeAt(i - 2);
      chr_pass_1 = value.charCodeAt(i - 1);
      chr_pass_2 = value.charCodeAt(i);
      //동일문자 카운트
      if ((chr_pass_0 == chr_pass_1) && (chr_pass_1 == chr_pass_2)) {
        SamePass_0++;
      } else {
        SamePass_0 = 0;
      }

      //연속성(+) 카운드 // ex. 123 , abc,
      if (chr_pass_0 - chr_pass_1 == 1 && chr_pass_1 - chr_pass_2 == 1) {
        SamePass_1++;
      } else {
        SamePass_1 = 0;
      }

      //연속성(-) 카운드
      if (chr_pass_0 - chr_pass_1 == -1 && chr_pass_1 - chr_pass_2 == -1) {
        SamePass_2++;
      } else {
        SamePass_2 = 0;
      }
    }

    if (SamePass_0 > 0) {
      message.same = '동일문자를 3자 이상 연속 입력할 수 없습니다.';
    }

    if (SamePass_1 > 0 || SamePass_2 > 0) {
      message.continuity = '영문, 숫자는 3자 이상 연속 입력할 수 없습니다.';
    }
  }
  return message;
}


export default checkCharactorSamenessAndContinuity;