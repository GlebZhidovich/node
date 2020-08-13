const zlib = require('zlib');
const fs = require('fs');
const path = require('path');
const { pipeline } = require('stream');

class Archiver {

  constructor(algorithm) {
    this.algorithm = algorithm;
  }

  zipScv() {
    let gzip = zlib.createGzip();
    if (this.algorithm === 'deflate') {
      gzip = zlib.createDeflate();
    }
    const r = fs.createReadStream(path.join(__dirname, '/data/comments.csv'));
    const w = fs.createWriteStream(path.join(__dirname, '/data/comments.gz'));
    pipeline(r, gzip, w,
      (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log('success');
        }
      });
  }

  unZipScv() {
    let unZip = zlib.createGunzip(); // деархиватор
    if (this.algorithm === 'deflate') {
      unZip = zlib.createUnzip();
    }
    const r = fs.createReadStream(path.join(__dirname, '/data/comments.gz'));
    const w = fs.createWriteStream(path.join(__dirname, '/data/comments2.csv'));
    pipeline(r, unZip, w,
      (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log('success');
        }
      });
  }
}

const arch = new Archiver('deflate')
  .unZipScv();
