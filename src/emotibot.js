import fetch from 'node-fetch';
import FormData from 'form-data';
import fs from 'fs';

const searchClothes = (file) => {
  let form = new FormData();
  form.append('cmd', 'getClothes');
  form.append('appid', 'fec3fdbbda9ceee74e91c1c9f3f77e92');
  form.append('userid', '01F09062F7BB952C11830BB57D65734B1');
  form.append('file', fs.createReadStream(file));
  return fetch('http://idc.emotibot.com/api/ApiKey/openapi_tw.php', {
    method: 'POST',
    body: form
  }).then(res => {
    return res.json();
  }).then(json => {
    let newJson = json.data.map(data => {
      return data.type;
    })
    console.log('newJson', newJson)
    return newJson;
  })
  .catch(error => console.log(error));
}

export default searchClothes;