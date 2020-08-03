const { Transform } = require('stream');
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

const private_key = `-----BEGIN RSA PRIVATE KEY-----
MIICXQIBAAKBgQC3b8M78pXUNNfp5fcVuRrA9FdZ+XJtppqGzofxoFSNPRDE+OPc
uOgwbjxv5VqGaca65UJwCwCfJZwlz78qFqk69fkMgRhVaz9qpCsOd8t4syak+LUO
sXe+0JtnzrG/OrHaZYUaVtcpkifO76bgGTo4Y4y3q0pfOOpmqyYzu/pR8wIDAQAB
AoGADCikUDzsIXy/MwnDLvVuCIwpnhUiuJHqfDUEXce60wHRMr0snVzERzGHYANb
1Lz+JzU7CiIwkFv11avHiAqofNtCSyOVdHE6+z9ftCfvLI11vbB5YOJtLtiRTlgx
Ogx4Tcv02T1mPGiRz1zscBnz/8HAtkjabBr5Wb+/wRZYaMECQQDgTwZzuavXT5ef
7gBGnfdasgjJoW2/JDu/1v4PE7H9Dq0mD9CpbjlsfGd7oAQW8KM9IZshLbXN32Hk
5hMQBEQNAkEA0VpxMpRoH4V7qJoyC0Pe5FeqbscsReM7EMIesunS6oXQHsWZsTZi
x/R7zOhj4fyie7le7CIG622+7y2xDIVt/wJBAI8s4glsMmu0uiuzVym8Gu8hRMqu
58Zh8mF5caFeCPZmL89juOTtHmpI3iTi9rlN0GRs1wBOlQVb2LiqwvAuSOECQGyz
NQs6G0YinK5SQaGvv8935TpXmBlBfq2Y3S+wUJ8Mk58mokJtJqUDwDQIhbQU5Jix
CyQ4Freu5/BwHPmPXikCQQDASTf6i0lgaY7xqtDKQ27mC6lgtuksTiJvfq4cVAlP
V1vVQ3HZi+6lkuzhDwYZ6BZr9bfCrvbLDTQrYtreBID8
-----END RSA PRIVATE KEY-----`;

async function cipVal(str, iv) {
    try {
        const key = await keyPromise;
        const cipher = crypto.createCipheriv(algorithm, key, iv);
        let val = cipher.update(
          str,
          'utf8',
          'hex'
        );
        val += cipher.final('hex');
        return val;
    } catch (e) {
        return e;
    }
}

class Guardian extends Transform {
    constructor(options) {
        super(options);

        this.init();
    }

    init() {
        this.on('error', err => console.log('Error: ' + err));
    }

    async _transform(chunk, encoding, callback) {
        try {
            const sign = crypto.createSign('RSA-SHA256');
            let { password, email, name } = chunk;
            const iv = await ivPromise;
            password = await cipVal(password, iv);
            email = await cipVal(email, iv);
            const res = {
                meta: {
                    source: 'ui',
                    signature: '',
                    iv
                },
                payload: {
                    name,
                    email,
                    password
                }
            }
            sign.update(JSON.stringify(res.payload));
            sign.end();
            res.meta.signature = sign.sign(private_key).toString('hex');
            this.push(res);
            callback();
        } catch (err) {
            this.emit('error', err);
        }

    }
}

module.exports = Guardian;
