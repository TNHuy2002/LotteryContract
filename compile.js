const path = require('path');
const fs = require('fs');
const solc = require('solc');

const lotteryPath = path.resolve(__dirname, 'Contracts', 'lottery.sol'); // Điều chỉnh đường dẫn phù hợp
const source = fs.readFileSync(lotteryPath, 'utf8');

const input = {
    language: 'Solidity',
    sources: {
        'lottery.sol': {
            content: source
        }
    },
    settings: {
        outputSelection: {
            '*': {
                '*': ['*']
            }
        }
    }
};

//console.log(JSON.parse(solc.compile(JSON.stringify(input))).contracts['lottery.sol'].Lottery.abi);

const output = JSON.parse(solc.compile(JSON.stringify(input)));

module.exports = output.contracts['lottery.sol'].Lottery;
