const fs = require('fs');
const path = require('path');

class Storage {
  fileName;

  constructor(fileN) {
    this.fileName = fileN;
  }

  get(key) {
    let pth = this.fileName;

    if (fs.existsSync(pth)) {
      let rawdata = fs.readFileSync(pth);

      if (rawdata !== '') {
        let data = JSON.parse(rawdata);
        return data[key];
      } else return null;
    } else {
      return null;
    }
  }

  set(key, value) {
    let pth = this.fileName;

    let data = {};
    if (fs.existsSync(pth)) {
      let rawdata = fs.readFileSync(pth);
      if (rawdata != '') data = JSON.parse(rawdata);
    }
    data[key] = value;

    fs.writeFileSync(pth, JSON.stringify(data));
    return true;
  }
}

module.exports = { Storage };