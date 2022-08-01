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
      if (res?.status === 200){
        DATA = {
          userType: auth.userType || userType.MEMBER,
          birthday: res.data.birthday,
          gender: res.data.gender,
          name: res.data.name,
          phoneNumber: res.data.phoneNumber,
          email: res.data.email,
          grade: res.data.grade || '웰컴',
          address: {
            zipcode: res.data.address.zipcode,
            city: res.data.address.city,
            street: res.data.address.street,
            detailAddress: res.data.address.detailAddress,
          },
        };
      }
     
      setUserData(DATA);
    })();
  }, [auth]);



  return userData;
}

