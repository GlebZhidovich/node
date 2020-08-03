const { Writable } = require('stream');
const crypto = require('crypto');

const algorithm = 'aes192';
const password = '1qaZxsw2@3edcVfr4';
const buf = Buffer.alloc(16);

const ivPromise = new Promise((resolve, reject) => crypto.randomFill(buf, (err, buf) => {
  if (err) reject(err);
  resolve(buf);
}));
const keyPromise = new Promise((resolve, reject) => crypto.scrypt(password, 'salt', 24, (err, key) => {
  if (err) reject(err);
  resolve(key);
}));

const privateKey = `-----BEGIN CERTIFICATE-----
MIICJjCCAY8CFD8wteegvvSf4n18ZD6MirMtBlHRMA0GCSqGSIb3DQEBCwUAMFIx
CzAJBgNVBAYTAlJVMQ8wDQYDVQQIDAZNb3Njb3cxDzANBgNVBAcMBk1vc2NvdzEh
MB8GA1UECgwYSW50ZXJuZXQgV2lkZ2l0cyBQdHkgTHRkMB4XDTIwMDgwMzE5MDEz
M1oXDTIwMDkwMjE5MDEzM1owUjELMAkGA1UEBhMCUlUxDzANBgNVBAgMBk1vc2Nv
dzEPMA0GA1UEBwwGTW9zY293MSEwHwYDVQQKDBhJbnRlcm5ldCBXaWRnaXRzIFB0
eSBMdGQwgZ8wDQYJKoZIhvcNAQEBBQADgY0AMIGJAoGBALdvwzvyldQ01+nl9xW5
GsD0V1n5cm2mmobOh/GgVI09EMT449y46DBuPG/lWoZpxrrlQnALAJ8lnCXPvyoW
qTr1+QyBGFVrP2qkKw53y3izJqT4tQ6xd77Qm2fOsb86sdplhRpW1ymSJ87vpuAZ
OjhjjLerSl846marJjO7+lHzAgMBAAEwDQYJKoZIhvcNAQELBQADgYEALOMy5HqE
2EuP5Shm1Cmq1BOgsBA71MciOmHobFcZInk1U3wlkjatj522d0Nmfi7+OERaVruk
MRsMsyh4jHzPVoBAL+5iGi+XP6WMPWg6DeQip2vaUHva79vO42VYsTRSjUxbFHRD
AejmL1h4drtiCl1XDj70sutaAZ9gjC8JAN4=
-----END CERTIFICATE-----`;

class AccountManager extends Writable {
     constructor(options) {
         super(options);

         this.init();
     }

     init() {
         this.on('drain', () => console.log('\n drain'));
         this.on('error', err => console.log('Error: ' + err))
     }

     async _write(chunk, encoding, callback) {
       try {
         const verify = crypto.createVerify('SHA256');
         verify.update(JSON.stringify(chunk.payload));
         verify.end();
         const a = chunk.meta.signature;
         console.log(Buffer.from(a, 'hex'))
         console.log(verify.verify(privateKey, Buffer.from(a, 'hex')));
         const iv = await ivPromise;
         const key = await keyPromise;
         const decipher = crypto.createDecipheriv(algorithm, key, chunk.meta.iv);
         let val = decipher.update(chunk.payload.password, 'hex', 'utf8');
         val += decipher.final('utf8');
         console.log(val);
         callback();
       } catch (e) {
         console.log(e)
       }
     }
}

module.exports = AccountManager;