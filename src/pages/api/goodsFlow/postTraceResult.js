import axios from 'axios';

export default async function handler(req, res){
  console.log(req.method);

  if(req.method != 'POST'){
    res.status(401).end();
  }
  console.log(req);
  console.log(req.body);

  try {
    
    return req.body;
    
  } catch (err) {
    console.error(err);
    res.json(err);
    res.status(405).end();
  }
};