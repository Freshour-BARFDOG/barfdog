import {getData} from './reqData';

export const getMemberList = async (idList) => {
  // 테스트계정id: 8,9,10,11 존재함
  let memberList = [];
  
  try {
    for (const id of idList) {
      const res = await getData( `/api/admin/members/${id}` );
      // console.log( res );
      if ( res.status === 200 ) {
        const DATA = res.data.memberDto;
        const newItem = {
          id: DATA.id,
          grade: DATA.grade,
          name: DATA.name,
          email: DATA.email,
          phoneNumber: DATA.phoneNumber,
          dogName: res.dogName?.length > 0 ? res.dogName[0] : '없음', // 반려견 이름 리스트 [0번 인덱스가 대표견 이름]
          accumulatedAmount: DATA.accumulatedAmount,
          subscribe: DATA.subscribe,
          longUnconnected: DATA.longUnconnected,
        };
        memberList.push( newItem );
      }
    }
  } catch (err) {
    console.error( err );
  }
  return memberList;
};