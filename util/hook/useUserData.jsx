import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { axiosUserConfig } from '/src/pages/api/axios.config';


export default function useUserData() {
  const [userData, setUserData] = useState(null);
  const auth = useSelector((state) => state.auth);

  // console.log('useUserData.js\n',auth)
  useEffect(() => {
    
    // ADMIN
    if(auth.isAdmin){
      let adminDATA = {
        name: '관리자',
        email: 'admin@gmail.com',
        grade: 'ADMIN',
      };
      setUserData(adminDATA)
    }
    
    // MEMBER
    if(!auth.isAuth || userData)return;
    (async () => {
      let memberDATA = null
      const res = await axios
        .get('/api/members', axiosUserConfig())
        .catch((err) => {
          console.log(err.response);
      });
      if (res?.status === 200){
        memberDATA = {
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
          authState:{
            autoLogin: auth.autoLogin,
            isAdmin: auth.isAdmin,
          }
        };
      };
      setUserData(memberDATA);
    })();
  }, [auth]);



  return userData;
}

