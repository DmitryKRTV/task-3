const {createHmac} = require("crypto");
const crypto = require('crypto');
const {createECDH} = require("crypto");
const prompt = require("prompt-sync")();
const cTable = require('console.table');

const ecdh = createECDH("secp256k1");
const secretKey = ecdh.generateKeys("hex");

const options = process.argv.slice(2);

if (options.length < 3) {
  console.log('Please type in three or more elements\nExample: rock paper scissors lizard Spock');
  process.exit();
}; 

if (options.length % 2 == 0) {
  console.log("Please type in an even number of rows\nExample:rock paper scissors lizard Spock");
  process.exit();
};

let duplicate = new Set(process.argv);
if(process.argv.length !== duplicate.size) {
  console.log("There can't be duplicate elements\nExample: rock paper scissors lizard Spock");
  process.exit();
}

function getMenu() {
    console.log('Available moves:');
    options.forEach(function(array_item, index) {
    console.log(`${index + 1} - ${array_item}`);
    });
    console.log('0 - exit\n? - help\n');
}

function compare(playerChoice, computerChoice) {
    const doubleoptions = options.concat(options);
    let i1 = doubleoptions.indexOf(playerChoice); 
    let i2 = doubleoptions.indexOf(computerChoice, i1);
    return i1==i2 ? 'It\'s a draw!' : i2-i1>doubleoptions.length/4 ? 'You lost!' : 'You won!';
}

function showTable() {
    let arr = [];
    for (let i = 0; i < options.length; i++) {
      arr[0] = "Draw";
      if (i > 0 && i < options.length / 2) {
        arr[i] = "Lose";
      } else if (i > options.length / 2) {
        arr[i] = "Win";
      }
  }

    let doubleArr = [];
    for (let i = 0; i < options.length; i++) {
      arr.unshift(options[i]);
      doubleArr.push([...arr]);
      arr.shift();
      arr.unshift(arr.pop());
    }
    console.table(['Helper', ...options], doubleArr);
}

function getComputerChoice() { 
    const getRandom = () => 
    crypto.webcrypto.getRandomValues(new Uint32Array(1))[0]/2**32;
    return Math.floor(getRandom() * options.length);
}

const getChoice = () => {
    playerChoice = prompt('Please enter your choice: ')
    if (+playerChoice <= options.length) return +playerChoice;
    else if (playerChoice ==='?') return playerChoice;
    else if (playerChoice === 0) return 0;
    else return '!';
}

function startGame() {

    while(true) {
    const computerChoice = getComputerChoice();

    const hmac = createHmac("SHA3-256", secretKey).update(options[computerChoice])
    .digest("hex");

    console.log(`HMAC: ${hmac}`);

    getMenu();

    const playerChoice = getChoice()
    if (+playerChoice === 0) break;
    if (playerChoice === '?') {showTable(); continue}
    if (playerChoice === '!') continue

    console.log(`Your move: ${options[playerChoice -1]}\n` +
    `Computer move: ${options[computerChoice]}\n` +
    compare(options[playerChoice - 1], options[computerChoice]));

    console.log(`HMAC key: ${secretKey}\n`);
    }	
}
startGame()

