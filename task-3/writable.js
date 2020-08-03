const { Writable } = require('stream');

function hexToString(str)
{
    const buf = Buffer.from(str, 'hex');
    return buf.toString('utf8');
}

class AccountManager extends Writable {
     constructor(options) {
         super(options);

         this.init();
     }

     init() {
         this.on('drain', () => console.log('\n drain'));
         this.on('error', err => console.log('Error: ' + err))
     }

     _write(chunk, encoding, callback) {
         let { name, email, password } = chunk;
         email = hexToString(email);
         password = hexToString(password);
         const decodedData = {
             name,
             email,
             password
         }
         console.log(decodedData);
         callback();
     }
}

module.exports = AccountManager;