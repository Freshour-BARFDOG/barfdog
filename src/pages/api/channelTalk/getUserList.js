import axios from 'axios';
const qs = require('qs');

const ChannelTalkUserList = async (req, res) => {
  console.log(req.body);

  try {
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'x-access-key': process.env.NEXT_PUBLIC_CHANNEL_ACCESS_KEY,
        'x-access-secret': process.env.NEXT_PUBLIC_CHANNEL_ACCESS_SECRET,
      },
    };

    const DATA = await axios({
      url: `https://api.channel.io/open/v5/user-chats`,
      method: 'GET',
      options,
    }).then((res) => {
        console.log(
          '--- AXIOS > RESPONSE',
          res,
        );
        return res.data;
      })
      .catch((err) => {
        console.error('err: ', err);

        return err.response;
      });
    console.log('---------- AXIOS > RESPONSE: ', DATA);

    res.end(JSON.stringify(DATA)); // res body > JS obj를 JSON문자열로 전달해야함. (JSON.stringify())
  } catch (err) {
    console.error(err);
  }
};


export default ChannelTalkUserList;