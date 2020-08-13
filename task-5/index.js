const fs = require('fs');
const fsPromise = fs.promises;
const path = require('path');

class Json2csv {

  constructor() {
    this.header = [];
    this.body = [];
    this.enableFields = ['postId', 'name', 'body'];
  }

  async readJson() {
    try {
      const data = await fsPromise.readFile(path.join(__dirname, '/data/comments.json'));
      const dataObj = JSON.parse(data.toString());
      Object.keys(dataObj[0]).forEach((value) => {
            if (this.enableFields.includes(value)) {
              this.header.push(value);
            }
          });
      dataObj.forEach(obj => {
        const jsonData = [];
        this.body.push(jsonData);
            Object.entries(obj).forEach(((arr) => {
              const [name, value] = arr;
              if (this.enableFields.includes(name)) {
                jsonData.push(value);
              }
            }))
          })
    } catch (e) {
      console.log(e);
    }
  }

  async writeCsv() {
    try {
      let csv = '';
      csv += this.header.join(';') + '\n';
      this.body.forEach(arr =>{
        csv += arr.join(';') + '\n';
      })
      fsPromise.writeFile(path.join(__dirname, '/data/comments.csv'), csv);
    } catch (e) {
      console.log(e);
    }
  }

  async jsonToCsv() {
    await this.readJson();
    await this.writeCsv();
  }
}

const json2csv = new Json2csv()
  .jsonToCsv();

  // .then(data => {
  //   const dataObj = JSON.parse(data.toString());
  //   let csv, header, body;
  //   csv = header = body = '';
  //   Object.keys(dataObj[0]).forEach((value, index, array) => {
  //     if (index === array.length - 1) {
  //       header += value + '\n';
  //       return;
  //     }
  //     header += value + ';'
  //   });
  //   dataObj.forEach(obj => {
  //     Object.values(obj).forEach(((value, index, array) => {
  //       if (index === array.length - 1) {
  //         body += value + '\n';
  //         return;
  //       }
  //       body += value + ';'
  //     }))
  //   })
  //   csv = header + body;
  //
  //   console.log(header);
  // })
  // .catch(err => console.log(err));
