import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { axiosUserConfig } from '/api/axios.config';


export default function useUserData() {
  const [userData, setUserData] = useState();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    (async () => {
      const res = await axios
        .get('/api/members', axiosUserConfig())
        .catch((err) => {
          console.log(err);
      });
      if (res?.status !== 200) return;
      const data = {
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
      setUserData(data);
    })();
  }, [auth]);

  return userData;
}
