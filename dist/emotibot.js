'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

var _formData = require('form-data');

var _formData2 = _interopRequireDefault(_formData);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var searchClothes = function searchClothes(file) {
  var form = new _formData2.default();
  form.append('cmd', 'getClothes');
  form.append('appid', 'fec3fdbbda9ceee74e91c1c9f3f77e92');
  form.append('userid', '01F09062F7BB952C11830BB57D65734B1');
  form.append('file', _fs2.default.createReadStream(file));
  return (0, _nodeFetch2.default)('http://idc.emotibot.com/api/ApiKey/openapi_tw.php', {
    method: 'POST',
    body: form
  }).then(function (res) {
    return res.json();
  }).then(function (json) {
    var newJson = json.data.map(function (data) {
      return data.type;
    });
    console.log('newJson', newJson);
    return newJson;
  }).catch(function (error) {
    return console.log(error);
  });
};

exports.default = searchClothes;