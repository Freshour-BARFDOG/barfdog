import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { axiosUserConfig } from '/src/pages/api/axios.config';
import {userType} from "@store/TYPE/userAuthType";
import {getData} from "@src/pages/api/reqData";


export default function useUserData() {
  
  const [userData, setUserData] = useState(null);
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    // MEMBER
    if(auth.userType === userType.NON_MEMBER || userData)return;
    (async () => {
      let DATA = null;
      const url = '/api/members'
      const res = await getData(url);
      // console.log('User Data : ',res)
      if (res?.status === 200){
        const data = res.data;
        DATA = {
          memberId: data.memberId,
          userType: auth.userType || userType.MEMBER,
          birthday: data.birthday,
          gender: data.gender,
          name: data.name,
          phoneNumber: data.phoneNumber,
          email: data.email,
          grade: data.grade || '웰컴',
          address: {
            zipcode: data.address.zipcode,
            city: data.address.city,
            street: data.address.street,
            detailAddress: data.address.detailAddress,
          },
        };
      }
     
      setUserData(DATA);
    })();
  }, [auth]);



  return userData;
}

