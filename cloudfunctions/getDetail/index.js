// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const axios = require('axios')
//var rp = require('request-promise');
/*
// 云函数入口函数
exports.main = async (event, context) => {

  return await rp(`https://frodo.douban.com/api/v2/movie/${event.movieid}?apiKey=054022eaeae0b00e0fc068c0c0a2102a`)
    .then(function (res) {
      return res;
    })
    .catch(function (err) {
      // Crawling failed...
    });
}
*/
// 云函数入口函数

exports.main = async (event, context) => {
  try {
    const {
      data
    } = await axios({
      url: `https://frodo.douban.com/api/v2/movie/${event.movieid}?apiKey=054022eaeae0b00e0fc068c0c0a2102a`,
      method: 'get',
      headers: {
        "Host": "frodo.douban.com",
        "Connection": "keep-alive",
        'content-type': 'application/json',
        'Accept-Encoding': 'gzip,compress,br,deflate',
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.2(0x18000236) NetType/WIFI Language/zh_CN',
        'Referer': 'https://servicewechat.com/wx2f9b06c1de1ccfca/81/page-frame.html'
      }
    })
    return data
  } catch (e) {
    console.log(e)
  }
}