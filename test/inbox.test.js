const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const { interface, bytecode } = require("../compile");

const web3 = new Web3(ganache.provider());

let accounts;
let inbox;
const initialMessage = "first initial message";

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  inbox = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({
      data: bytecode,
      arguments: [initialMessage],
    })
    .send({ from: accounts[0], gas: "1000000" });
});

describe("running ethereum testing : ", () => {
  it("has deployed contract", () => {
    assert.ok(inbox.options.address);
  });

  it("has initial message", async () => {
    const message = await inbox.methods.message().call();
    assert.equal(initialMessage, message);
  });

  it("can change the initial message", async () => {
    const newMessage = "bye...";
    await inbox.methods.setMessage(newMessage).send({ from: accounts[0] });
    const message = await inbox.methods.message().call();

    assert.equal(newMessage, message);
  });
});
