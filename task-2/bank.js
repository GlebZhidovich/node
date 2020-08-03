const EventEmitter = require('events');

class Bank extends EventEmitter{
  constructor() {
    super();
    this.contractors = [];
  }

  register(obj) {
    const exist = this.contractors.find(el => el.name === obj.name);
    if (exist) throw new Error('Contractor is exist');
    if (obj.balance <= 0) throw new Error('Wrong amount of money');
    this.contractors.push(obj);
    obj.id = this.contractors.length;
    return obj.id;
  }
}

const bank = new Bank();

const personId = bank.register({
  name: 'Pitter Black',
  balance: 100
});

const personSecondId = bank.register({
  name: 'Oliver White',
  balance: 700
});

const personFirstId = bank.register({
  name: 'Pitter Orange',
  balance: 100
});

bank.on('error', data => console.log(data.toString()));

bank.on('add', function (id, val) {
  if (val <= 0) bank.emit('error', new Error('Wrong amount of money'));
  const contractor = this.contractors.find(el => el.id === id);
  if (!contractor) bank.emit('error', new Error('No exist contractor'));
  contractor.balance += val;
});

bank.on('get', function (id, cb) {
  const contractor = this.contractors.find(el => el.id === id);
  if (!contractor) bank.emit('error', new Error('No exist contractor'));
  cb(contractor.balance);
});

bank.on('withdraw', function (id, val) {
  if (val <= 0) bank.emit('error', new Error('Wrong amount of money'));
  const contractor = this.contractors.find(el => el.id === id);
  if (!contractor) bank.emit('error', new Error('No exist contractor'));
  if (contractor.balance < val) bank.emit('error', new Error('Wrong amount of money'));
  contractor.balance -= val;
});

bank.on('send', function (sendId, acceptId, amount) {
  const sendContractor = this.contractors.find(el => el.id === sendId);
  const acceptContractor = this.contractors.find(el => el.id === acceptId);
  if (!sendContractor || !acceptContractor) bank.emit('error', new Error('No exist contractor'));
  sendContractor.balance -= amount;
  acceptContractor.balance += amount;
});

bank.on('changeLimit', function (id, cb) {
  const contractor = this.contractors.find(el => el.id === id);
  contractor.limit = cb;
})

bank.emit('add', personId, 20);
bank.emit('get', personId, (balance) => {
  console.log(`I have ${balance}$`); // I have 120?
});
bank.emit('withdraw', personId, 50);

bank.emit('get', personId, (balance) => {
  console.log(`I have ${balance}$`); // I have 70?
});

bank.emit('send', personFirstId, personSecondId, 50);
bank.emit('get', personSecondId, (balance) => {
  console.log(`I have ${balance}$`); // I have 750$
});