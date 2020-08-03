const { Readable } = require('stream');

class Ui extends Readable {
    constructor(data, options) {
        super(options);

        this.data = data;
        this.init();
    }

    init() {
        this.on('data', chunk => {
            // console.log(chunk)
        });
        this.on('error', err => console.log('Error: ' + err));
    }

    _read(size) {
        const data = this.data.shift();
        if (data) {
            this.push(data);
        } else {
            this.push(null);
        }
    }
}

module.exports = Ui;