const compiledContract = require('../compile');
const assert = require('assert');
const ganache = require('ganache');
const {Web3} = require('web3');

const web3 =  new Web3(ganache.provider());

let accounts;
let lotteryContract;

describe('test lottery contract', () => {
    beforeEach('Get a list account and deploy contract', async () => {
        accounts = await web3.eth.getAccounts();

        lotteryContract = await new web3.eth.Contract(compiledContract.abi)
            .deploy({data: compiledContract.evm.bytecode.object})
            .send({from: accounts[0], gas: '1000000'});
    });


    it('get a list account', () => {
        console.log(accounts[0]);
        assert.ok(lotteryContract.options.address);
    });

    it("allows one account to enter", async () => {
        await lotteryContract.methods.enter()
            .send({
                from: accounts[1],
                value: web3.utils.toWei(1, 'ether')
            });

        const players = await lotteryContract.methods.getPlayers().call({
            from: accounts[0]
        });


        assert.equal(players[0], accounts[1]);
        assert.equal(players.length, 1);
    });

    it("allows multiple accounts to enter", async () => {

        let i;
        for(i = 0; i < 10; i++){
            await lotteryContract.methods.enter()
                .send({
                    from: accounts[i],
                    value: web3.utils.toWei(1, 'ether')
                })

                console.log(accounts);
        }

        const players = await lotteryContract.methods.getPlayers()
            .call({
                from: accounts[0]
            });

        let y;
        for(y = 0; y < players.length; y++){
            assert.equal(accounts[y], players[y]);
            console.log(accounts);
        }
    });

    it("requires a 1 Ether to enter", async () => {
      try {
        await lotteryContract.methods.enter()
        .send({
          from:accounts[1],
          value: web3.utils.toWei(3, 'ether')
        });

        throw false;    //if enter is'n fail ==> throw false ==> assert(false);
      } catch (error) {
        assert(error);  //error is object ==> truthy ==> assert: passing;
      }                 //or error === false ==> falsy ==> assert: failing;
    });

    it("only manager can call pickWinner", async () => {  //If players.length == 0 --> random % 0 --> error ==> contract is revert.
      let i;
      for(i = 0; i < 10; i++){
          await lotteryContract.methods.enter()
              .send({
                  from: accounts[i],
                  value: web3.utils.toWei(1, 'ether')
              })
      }

      try {
        await lotteryContract.methods.pickWinner()
          .send({
            from: accounts[1],
          });
          throw false;
      } catch (error) {
        //console.log("\x1b[31m%s\x1b[0m", "This is a error: " + error);
        console.error("this is a error: ", error);
        assert(error);
      }
    });

    it("checks there no player after pick winner", async () => {
      let i;
      for(i = 0; i < accounts.length; i++) {
        await lotteryContract.methods.enter()
          .send({
            from: accounts[i],
            value: web3.utils.toWei(1, 'ether')
          });
      }

      const gasEstimate = await lotteryContract.methods.pickWinner()
        .estimateGas({
          from: accounts[0]
        });
      console.log(gasEstimate);
      const amountInit = await lotteryContract.methods.getPlayers()
        .call({
          from: accounts[0]
        });

      console.log("\x1b[34m%s\x1b[0m", "So luong players: ", amountInit.length);

      await lotteryContract.methods.pickWinner()
        .send({
          from: accounts[0],
          gas: '1000000'
        });

      const amountAfter = await lotteryContract.methods.getPlayers()
        .call({
          from: accounts[0]
        });

        console.log("\x1b[34m%s\x1b[0m", "So luong players: ", amountAfter.length);

        assert(amountAfter.length == 0);
    });
})
  
  
  
  
  