import fetch from 'node-fetch';
import FormData from 'form-data';
import fs from 'fs';

const searchClothes = async (file) => {
  let clothesTypes = {
    bag: '手提包',
    hat: '草帽', 
    shoes: '布鞋',
    dress: '洋裝',
    skirt: '裙子',
    pants: '長褲',
    shorts: '短褲',
    tops: '上衣',
    suit: '西裝',
    outerwear: '外套'
  };
  let form = new FormData();
  form.append('cmd', 'getClothes');
  form.append('appid', 'fec3fdbbda9ceee74e91c1c9f3f77e92');
  form.append('userid', '01F09062F7BB952C11830BB57D65734B1');
  form.append('file', fs.createReadStream(file));
  return fetch('http://idc.emotibot.com/api/ApiKey/openapi_tw.php', {
    method: 'POST',
    body: form
  })
  .then(res => {
    return res.json();
  })
  .then(json => {
    let newJson = {
      return : json.return,
      data: json.data.map(data => {
        return clothesTypes[data.type];
      })
    } 
    return newJson;
  })
  .catch(error => console.log(error));
}

export default searchClothes;