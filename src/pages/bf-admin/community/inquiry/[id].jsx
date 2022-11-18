import React from "react";
import {getDataSSR} from "/src/pages/api/reqData";

export default function ReadInquiryPage (props) {
  return <></>;
}



export async function getServerSideProps ({ query}) {
  const {id} = query;
  const isAvailableQuery = typeof Number(id) !== 'number';
  if(!isAvailableQuery){
    return {
      redirect:{
        destination: '/bf-admin/community/inquiry'
      }
    }
  }
  
  
  let DATA = null;
  const apiUrl = '/api/_____';
  const res = await getDataSSR(req, apiUrl);
  if(res.status === 200 && res.data){
    DATA = {
    
    }
  }
  
  
  
  return {
    props: {data: DATA}
  }
}