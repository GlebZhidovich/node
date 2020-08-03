const { Transform } = require('stream');

function stringToHex(str)
{
    const buf = Buffer.from(str, 'utf8');
    return buf.toString('hex');
}

class Cipher {
    constructor(chunk) {
        this.set(chunk);
    }

    set(chunk) {
        chunk.email = stringToHex(chunk.email);
        chunk.password = stringToHex(chunk.password);
        this._chunk = chunk;
    }

    get() {
        return this._chunk;
    }

    createCipheriv() {
        return this;
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

    _transform(chunk, encoding, callback) {
        const data = new Cipher(chunk).get();
        console.log(data);
        this.push(data);
        callback();
    }
}

module.exports = Guardian;
