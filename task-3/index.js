const Ui = require('./readable');
const AccountManager = require('./writable');
const Guardian = require('./transform');
const { pipeline } = require('stream');

const customers = [
    {
        name: 'Pitter Black',
        email: 'pblack@email.com',
        password: 'pblack_123'
    },
    {
        name: 'Oliver White',
        email: 'owhite@email.com',
        password: 'owhite_456'
    }
];

console.log('start');
const options = {
    objectMode: true,
};

const tOptions = {
    objectMode: true,
    readableObjectMode: true,
};

const ui = new Ui(customers, options);
const manager = new AccountManager(options);
const guardian = new Guardian(tOptions);

// ui
//     .pipe(guardian)
//     .pipe(manager);
pipeline(
    ui,
    guardian,
    manager,
    err => {
        if (err) console.log('Fail');
        else console.log('Success')
    }
)
setTimeout(() => console.log('end'));