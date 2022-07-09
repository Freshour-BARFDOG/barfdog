import {getData} from "/api/reqData";
import {useEffect, useState} from "react";


export const useMemberList = (idList)=>{
  const [memberList, setMemberList] = useState( [] );
  const getListApiUrl = '/api/admin/members';

  useEffect( () => {
    if(memberList.length) return;
    const testArr = [];
    for (let i =8; i < 12; i++) {
      testArr.push(i)
    }
  
    testArr.forEach(id=>{
      (async () => {
        try {
          const res = await getData(`${getListApiUrl}/${id}`);
          console.log(res);
          if( res.status === 200){
            const DATA = res.data.memberDto;
            const newItem = {
              id: DATA.id,
              grade: DATA.grade,
              name: DATA.name,
              email: DATA.email,
              phoneNumber: DATA.phoneNumber,
              dogName: res.dogName?.length > 0 ? res.dogName[0] : '대표반려견 없음',  // 반려견 이름 리스트 [0번 인덱스가 대표견 이름]
              accumulatedAmount: DATA.accumulatedAmount,
              subscribe: DATA.subscribe,
              longUnconnected: DATA.longUnconnected
            }
            setMemberList(prevState => prevState.concat(newItem));
          }
        } catch (err) {
          console.error(err);
          // alert('데이터를 가져올 수 없습니다.');
        }
      })();
    })
    
  }, [] );
  
  return memberList;
  
}

// export const TEST_MEMBERS = [
//   {
//     id: 1,
//     grade: '실버',
//     name: '김바프',
//     email: 'email@gmail.com',
//     phoneNumber: '010-22-4567',
//     dogName: '스칼렛 ',
//     accumulatedAmount: 1234123,
//     subscribe: true,
//     longUnconnected: false,
//   },
//   {
//     id: 2,
//     grade: '골드',
//     name: '이바프',
//     email: 'ema@gmail.com',
//     phoneNumber: '010-2234-4567',
//     dogName: '멍멍 ',
//     accumulatedAmount: 43421,
//     subscribe: true,
//     longUnconnected: false,
//   },
//   {
//     id: 3,
//     grade: '플래티넘',
//     name: '삼식이',
//     email: 'na@gmail.com',
//     phoneNumber: '010-22-4567',
//     dogName: '킁킁 ',
//     accumulatedAmount: 43421,
//     subscribe: false,
//     longUnconnected: true,
//   },
//   {
//     id: 4,
//     grade: '실버',
//     name: '김바프',
//     email: 'email@gmail.com',
//     phoneNumber: '010-22-4567',
//     dogName: '스칼렛 ',
//     accumulatedAmount: 1234123,
//     subscribe: true,
//     longUnconnected: false,
//   },
//   {
//     id: 10,
//     grade: '골드',
//     name: '이바프',
//     email: 'ema@gmail.com',
//     phoneNumber: '010-2234-4567',
//     dogName: '멍멍 ',
//     accumulatedAmount: 43421,
//     subscribe: true,
//     longUnconnected: false,
//   },
//   {
//     id: 11,
//     grade: '플래티넘',
//     name: '삼식이',
//     email: 'na@gmail.com',
//     phoneNumber: '010-22-4567',
//     dogName: '킁킁 ',
//     accumulatedAmount: 43421,
//     subscribe: false,
//     longUnconnected: true,
//   }
// ];
//
// export const TEST_MEMBERS = useMemberList();


