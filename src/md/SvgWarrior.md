===

- the globally available Ethereum API (window.ethereum) that identifies the users of web3-compatible browsers (like MetaMask users), and whenever you request a transaction signature

- API layer - The Graph Protocol

- The Graph is an indexing protocol for querying blockchain data that enables the creation of fully decentralized applications and solves this problem, exposing a rich GraphQL query layer that apps can consume

- build blockchain APIs using The Graph, check out Building GraphQL APIs on Ethereum

Now, we can deploy this new contract to the local or Ropsten network:
npx hardhat run scripts/deploy.js --network localhost
Once the contract is deployed, you can start sending these tokens to other addresses.

To do so, let's update the client code we will need in order to make this work:

```js
import { useState } from "react"
import { ethers } from "ethers"

function App() {
  const [userAccount, setUserAccount] = useState()
  const [amount, setAmount] = useState()

  async function getBalance() {
    if (typeof window.ethereum !== "undefined") {
      const [account] = await window.ethereum.request({ method: "eth_requestAccounts" })
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(tokenAddress, Token.abi, provider)
      const balance = await contract.balanceOf(account)
      console.log("Balance: ", balance.toString())
    }
  }

  async function sendCoins() {
    if (typeof window.ethereum !== "undefined") {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(tokenAddress, Token.abi, signer)
      const transation = await contract.transfer(userAccount, amount)
      await transation.wait()
      console.log(`${amount} Coins successfully sent to ${userAccount}`)
    }
  }

  return (
    <div className="App">
      <button onClick={getBalance}>Get Balance</button>
      <button onClick={sendCoins}>Send Coins</button>
      <input onChange={(e) => setUserAccount(e.target.value)} placeholder="Account ID" />
      <input onChange={(e) => setAmount(e.target.value)} placeholder="Amount" />
    </div>
  )
}

export default App
```

We should be able to click on Get Balance and see that we have 1,000,000 coins in our account logged out to the console.

You should also be able to view them in MetaMask by clicking on import tokens:

Import Tokens

Next click on Custom Token and enter the token contract address and then Add Custom Token. (if asked for token decimals, choose 0) Now the tokens should be available in your wallet:

NDT

Next, let's try to send those coins to another address.

To do so, copy the address of another account and send them to that address using the updated React UI. When you check the token amount, it should be equal to the original amount minus the amount you sent to the address.

ERC20 Token
The ERC20 Token Standard defines a set of rules that apply to all ERC20 tokens which allow them to easily interact with each other. ERC20 makes it really easy for someone to mint their own tokens that will have interoperability with others on the Ethereum blockchain.

Let's look at how we may build our own token using the ERC20 standard.

First, install the OpenZepplin smart contract library where we will be importing the base ERC20 Token:
npm install @openzeppelin/contracts
Next, we'll create our token by extending (or inheriting from) the ERC20 contract:
//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract NDToken is ERC20 {
constructor(string memory name, string memory symbol) ERC20(name, symbol) {
\_mint(msg.sender, 100000 \* (10 \*\* 18));
}
}
The constructor allows you to set the token name and symbol, and the \_mint function allows you to mint the tokens and set the amount.

By default, ERC20 sets the number of decimals to 18, so in our \_mint function we multiply 100,000 by 10 to the 18 power to mint a total of 100,000 tokens, each with 18 decimal places (similarly to how 1 Eth is made up of 10 to the 18 wei.

To deploy, we need to pass in the constructor values (name and symbol), so we might do something like this in our deploy script:
const NDToken = await hre.ethers.getContractFactory("NDToken");
const ndToken = await NDToken.deploy("Nader Dabit Token", "NDT");
By extending the original ERC20 token, your token will inherit all of the following functions and functionality:
function name() public view returns (string)
function symbol() public view returns (string)
function decimals() public view returns (uint8)
function totalSupply() public view returns (uint256)
function balanceOf(address \_owner) public view returns (uint256 balance)
function transfer(address \_to, uint256 \_value) public returns (bool success)
function transferFrom(address \_from, address \_to, uint256 \_value) public returns (bool success)
function approve(address \_spender, uint256 \_value) public returns (bool success)
function allowance(address \_owner, address \_spender) public view returns (uint256 remaining)
Once deployed, you can use any of these functions to interact with the new smart contract. For another example of an ERC20 token, check out [Solidity by example)(https://solidity-by-example.org/app/erc20/)

Conclusion
Ok, we covered a lot here but for me this is kind of the bread and butter / core of getting started with this stack and is kind of what I wanted to have not only as someone who was learning all of this stuff, but also in the future if I ever need to reference anything I may need in the future. I hope you learned a lot.

If you want to support multiple wallets in addition to MetaMask, check out Web3Modal which makes it easy to implement support for multiple providers in your app with a fairly simple and customizable configuration.

In my future tutorials and guides I'll be diving into more complex smart contract development and also how to deploy them as subgraphs to expose a GraphQL API on top of them and implement things like pagination and full text search.

I'll also be going into how to use technologies like IPFS and Web3 databases to store data in a decentralized way.

If you have any questions or suggestions for future tutorials, drop some comments here and let me know.

Discussion (107)
Subscribe
pic
Add to the discussion

horaceshmorace profile image
Horace Nelson
•
Apr 14 '21

Any idea why getBalance in App.js would throw

Error: call revert exception (method="balanceOf(address)", errorSignature=null, errorArgs=[null], reason=null, code=CALL_EXCEPTION, version=abi/5.1.0)

sendCoins works fine.

6

niroshans profile image
Niroshan Sooriyakumar
•
Apr 22 '21 • Edited on Apr 22

Not sure if this will help but I had the same error while working on my own project. I used this blog post as a starting point and my code is slightly different but I was also getting this error on a read-only transaction. The code was working the day before and I was really consued.

After some failed googling, I saw that metamask was still pointing to mainnet (I had switched away from localhost to mainnet later that day). After switching back to localhost things just started working!

Not sure if this will help your particular issue but thought I'd post this here if someone else is also googling this error. Hopes this helps someone out there!

4

horaceshmorace profile image
Horace Nelson
•
Apr 14 '21 • Edited on Apr 14

Here's the deploy output:
Starting: scripts/deploy.js --network localhost
Deploying contracts with the account: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Deploying a Greeter with greeting: Hello, World!
Greeter deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
Token deployed to: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
And here's my App.js:
import './App.css';
import { useState } from 'react';
import { ethers } from 'ethers'
import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json'
import Token from './artifacts/contracts/Token.sol/Token.json'
const greeterAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
const tokenAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"

function App() {
const [greeting, setGreetingValue] = useState()
const [userAccount, setUserAccount] = useState()
const [amount, setAmount] = useState()

async function requestAccount() {
await window.ethereum.request({ method: 'eth_requestAccounts' });
}

async function fetchGreeting() {
if (typeof window.ethereum !== 'undefined') {
const provider = new ethers.providers.Web3Provider(window.ethereum)
console.log({ provider })
const contract = new ethers.Contract(greeterAddress, Greeter.abi, provider)
try {
const data = await contract.greet()
console.log('data: ', data)
} catch (err) {
console.log("Error: ", err)
}
}  
 }

async function getBalance() {
if (typeof window.ethereum !== 'undefined') {
const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' })
console.log({ account }) // outputs { account: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266" }
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner()
const contract = new ethers.Contract(tokenAddress, Token.abi, signer)

      // THIS THROWS
      contract.balanceOf(account)
        .then(data => {
          console.log("data: ", data.toString())
        })
    }

}

async function setGreeting() {
if (!greeting) return
if (typeof window.ethereum !== 'undefined') {
await requestAccount()
const provider = new ethers.providers.Web3Provider(window.ethereum);
console.log({ provider })
const signer = provider.getSigner()
const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer)
const transaction = await contract.setGreeting(greeting)
await transaction.wait()
fetchGreeting()
}
}

async function sendCoins() {
if (typeof window.ethereum !== 'undefined') {
await requestAccount()
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner()
const contract = new ethers.Contract(tokenAddress, Token.abi, signer)
contract.transfer(userAccount, amount).then(data => console.log({ data }))
}
}

return (

<div className="App">
<header className="App-header">
<button onClick={fetchGreeting}>Fetch Greeting</button>
<button onClick={setGreeting}>Set Greeting</button>
<input onChange={e => setGreetingValue(e.target.value)} placeholder="Set greeting" />

        <br />
        <button onClick={getBalance}>Get Balance</button>
        <button onClick={sendCoins}>Send Coins</button>
        <input onChange={e => setUserAccount(e.target.value)} placeholder="Account ID" />
        <input onChange={e => setAmount(e.target.value)} placeholder="Amount" />
      </header>
    </div>

);
}

export default App;

1

smrnjeet222 profile image
Simranjeet Singh
•
Jul 15 '21

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner(); // remove this
const contract = new ethers.Contract(tokenAddress, Token.abi, signer); // replace signer with provider
signing is not required here!

2
Thread
jamiescript profile image
Jamiebones
•
Sep 19 '21

Signing is required.

1

sprtd profile image
Dav
•
Aug 11 '21 • Edited on Aug 12

I faced the same issue too and figured it out. First, make sure you've selected the right MetaMask network. If you deployed to a local node, make sure the selected MetaMask network on your browser is Localhost: 8545. If you deployed to ropsten, make sure you've selected Ropsten Test Network. Secondly, each time you successfully deploy your contract, make sure you correctly copy and reference the generated contract address if you intend to interact with the newly deployed contract without errors. Just like @richardmelko advised, make sure that your tokenAddress is pointing the Token contract address you copied after deployment.

3

dabit3 profile image
Nader Dabit
•
Apr 14 '21

Hey, not sure why you would run into that, did you figure it out?

1
Thread
dominicwong profile image
Dominic Wong
•
Apr 19 '21

I am running into the same issue

1
Thread
dominicwong profile image
Dominic Wong
•
Apr 19 '21

It worked when I called balanceOf inside deploy.js, just not when calling from App.js

1
Thread
enemycnt profile image
Nikolay
•
Apr 26 '21

Stuck with the same issue. After some deep dive into hardhat docs finally, I've found the cause.
It looks like instead
npx run scripts/deploy.js --network localhost
should be
npx run hardhat scripts/deploy.js --network localhost
@dabit3 could you please correct it?

5

richardmelko profile image
Richard Melkonian
•
May 30 '21

I had this error after switching to live test nets then back to local host. The error originates from these line of code in your react components.

const greeterAddress = "{address that you copied in from the local node instance}"

const tokenAddress = "{address that you copied in from the local node instance}"

If you're deploying on Ropsten for example, you will need to manually update this line of code, changing the address to the deployed address that hardhat will supply in the terminal after successfully deploying. So when switching from local to test net, this line needs to be changed!

2

gautham profile image
Gautham 🌶
•
Apr 19 '21

Hi Horace, I was getting this same error - my issue was that I had re-deployed my contracts and their addresses had changed, so I had to copy-paste the new addresses to the top of App.js.

1

nmassi profile image
Nico
•
Apr 10 '21

Nice run Nader – thanks for this.
I am a newbie in Ethereum and I got this error after make some tx with the same account:
Nonce too high. Expected nonce to be 0 but got 4. Note that transactions can't be queued when automining.
If you got this, I figured that there is a limit (I think it's 4 per block) on the number transactions the same address can have on the transaction pool, so just by adding another account in metamask works again :)

7

dabit3 profile image
Nader Dabit
•
Apr 11 '21

Good call out. You can also go to advanced settings and reset the account which will fix this as well.

17

lpatipat profile image
lpatipat
•
Jun 20 '21

Hi Nader,

Likewise, thanks for this great post. I had the same issue and did resolve it using the methods above. Could you elaborate further on the problem here? Is this just a quirk for the hardhat local network or is this something related to ethereum in general?

Thanks in advance.

1
Thread
dabit3 profile image
Nader Dabit
•
Jun 20 '21

I believe it has something to do with the nonce being out of sync, but I don't know a lot more than that.

1

emanuel_hodl profile image
Emanuel
•
Apr 11 '21 • Edited on Apr 11

If you have this problem at the beginning:

\*\*Is because you're using an account address instead of the contract address that was prompted in the terminal when you deployed it.
Error: Error: network does not support ENS (operation="ENS", network="unknown", code=UNSUPPORTED_OPERATION, version=providers/5.1.0)
at Logger.makeError (index.ts:205)
at Logger.throwError (index.ts:217)
at Web3Provider.<anonymous> (base-provider.ts:1407)
at Generator.next (<anonymous>)
at fulfilled (base-provider.ts:2)```

5

wschwab profile image
wschwab
•
Apr 12 '21

I usually get that when I put in a signer instead of the signer's address. The basic idea is that you're putting in something other than a hex address, so the compiler's first thought is that it must be an ENS address (ENS addresses are a way to attach a url-like identifier to an address, like vitalik.eth).

3

nmassi profile image
Nico
•
Apr 11 '21 • Edited on Apr 11

or if you leave "your-contract-address" as I forgot to change the const :)
Looks like any string (if it isn't a contract address) assume it's an ens domain.

3

mayassalman profile image
mayas salman
•
Apr 9 '21

thank you Nader
I will consider this as my first step to blockchain domain
all the best

8

bdougieyo profile image
Brian Douglas
•
Apr 11 '21

This is such a great run-through on such a complex topic. I was aware of a lot of these tools but never leveraged them because of how dense the docs and content usually are. I am looking forward to learning more about this space from you. Keep it up!

5

dabit3 profile image
Nader Dabit
•
Apr 11 '21

Thanks Brian, happy to hear this 🙏

1

preciouschicken profile image
Precious Chicken
•
Apr 10 '21

Great run though, thank you. Do you have any particular reason for preferring hardhat over ganache / truffle? I think the latter is probably more popular (?), not of course that is any reason to prefer it. I hadn't heard of hardhat previously, so will give it a whirl.

I too prefer ethers to web3; I liked the documentation more. Often with these choices though, you just have to choose and go. Otherwise you can spend your entire time choosing rather than actually coding...

3

dabit3 profile image
Nader Dabit
•
Apr 11 '21

I think either are good choices, but after talking with a few people in the space and hearing that some projects like Aave, Decentraland, PoolTogether, Synthetix, and others were now using it I decided to go with Hardhat.

6

preciouschicken profile image
Precious Chicken
•
Apr 11 '21

Hmmm, interesting. I will defo take a look next time.

2

nirajkamdar profile image
Niraj Kamdar
•
May 5 '21 • Edited on May 5

I am a long-time truffle user but planning to switch over hardhat for a couple of reasons. In hardhat, you have support for multiple solidity compilers simultaneously, it's really helpful say if you have a 0.5 and 0.8 contract in the same codebase. Truffle will refuse to compile and you have to perform some hacks to make it work. Hardhat also has this nice collection of extensions like: console.log, auto compile & deployment while solidity code changes, etc. which are super useful while developing. I also found some minor problems in the truffle development chain like they set a hard block limit which is lesser than the main net limit which may result in your transaction being reverted.

2

preciouschicken profile image
Precious Chicken
•
May 14 '21

console.log would be very useful...

2

nickytonline profile image
Nick Taylor (he/him)
•
Aug 9 '21

I went to the faucet site, but it contains a certificate error. Maybe that faucet is no longer valid?

Ropsten Faucet Site has an invalid certificate

If you continue to the site it returns the following JSON response.
{
code: "ResourceNotFound",
message: "/ does not exist"
}
I'm going to try out the one mentioned here

tysonwynne\_ profile image
Tyson Wynne
•
May 29
The Ropsten Ethereum Faucet said I was spamming, so I just ended up using this one instead -- faucet.dimensions.network/

3

nickytonline profile image
Nick Taylor (he/him)
•
Aug 22 '21

Looks like the test faucet in the tutorial is working again. I guess they updated their certificate. 😎

1

arielbk profile image
arielbk
•
Dec 18 '21

I used NextJS as the React framework, added some styling and refactored the code a bit.

Check it out: react-eth.netlify.app/

All of the code for this is on GitHub also.

The token on that extends the ERC20 standard, and I ran into some issues here. Since there are 18 decimal places for the token I would try to transfer something like 500 \* 10 \*\* 18 and would get an overflow error.

To resolve this I just had to put it into a JavaScript BigInt like so:
const wholeTokens = BigInt(amount \* 10 \*\* 18)

Hope this helps someone!

3

robertosnap profile image
RobertoSnap
•
Apr 10 '21

👏 check out npmjs.com/package/@symfoni/hardhat...

5

chiranz profile image
Chiranjibi Poudyal
•
May 23 '21

I am doing this project in typescript, when I run "npx hardhat node" it throws an error saying
An unexpected error occurred:

/home/chiranz/programming/blockchain/smartcontracts/tutorials/react-dapp/hardhat.config.ts:12
export default config;

SyntaxError: Unexpected token 'export'
What am I missing here ?
import { HardhatUserConfig } from "hardhat/types";
const config: HardhatUserConfig = {
solidity: {
compilers: [{ version: "0.8.3", settings: {} }],
},
paths: { artifacts: "./src/artifacts" },
networks: {
hardhat: {
chainId: 1337,
},
},
};

export default config;

1

lpatipat profile image
lpatipat
•
Jul 1 '21

I also ran into this with typescript for hardhat. Did you ever find a solution?

1

lpatipat profile image
lpatipat
•
Jul 1 '21

Update:

just found a fix:

update the hardhat.config.ts file with

"module": "commonjs"

1

tanyeun profile image
tanyeun
•
Dec 5 '21 • Edited on Dec 5

Help! I got stuck at this step:

After I import private key, I got the following error message:

Expected private key to be an Uint8Array with length 32

Expected private key to be an Uint8Array with length 32

2

lhultqvist profile image
Lucas
•
Jan 11

I have the same error... Have you found a solution yet?

1

ockhamsrazor profile image
OckhamsRazor
•
Feb 5 • Edited on Feb 5

Maybe you copied this contract address,

you should choose one from these 20 accounts' keys

1

horaceshmorace profile image
Horace Nelson
•
Apr 10 '21 • Edited on Apr 10

Wow. This is the best full-stack dApp tutorial I've seen. I wish I had this a few months ago (before I already learned it). The only thing I think is really missing for a starter tutorial (in a future post maybe?) is to touch on ERC standards. But really, well done.

3

dabit3 profile image
Nader Dabit
•
Apr 11 '21

Thanks Horace, I now plan on updating this with more info based on feedback I've received and also doing a part two that goes into more depth, I appreciate your feedback 🙏

4

thasquirrie profile image
Zulu™#July25th
•
Apr 15 '21

Can't wait for it. Thanks Nader. One more question tho. I'm a backend dev with Node.js and I'd love to get started with blockchain how and what resources should I get started with. Thanks

1

iamjasonlevin profile image
Jason LΞvin
•
Oct 30 '21

I'm getting this error. Source "hardhat/console.sol" not found: File import callback not supported And when I do npx hardhat compile it says there's nothing to compile. Any idea how to fix this?

1

palodean profile image
PaloDean
•
Nov 27 '21

ethereum.stackexchange.com/questio...

1

colnnn profile image
Colnnn
•
Nov 1 '21

hi have you figured it out? I'm getting the same error too

1

pureblack profile image
Pure Black
•
Aug 6 '21

This is the problem of my newspaper. Why is it like this? Can it solve this problem? I have followed the steps in the tutorial and refactored it several times. The errors are the same. thank you

./src/App.js
Module not found: Can't resolve './artifacts/contracts/Greeter.sol/Greeter.json' in '/Users/liuminghui/Desktop/react/react-dapp/src'

img

2

braifz profile image
Braian Fernandez
•
Nov 17 '21

Verify your hardhat.config.js, in my case my issue was a typo in paths :D

1

steadylearner profile image
Steadylearner
•
May 26 '21 • Edited on May 26

I wrote a blog post "How to make a fullstack dapp with React, Hardhat and Ethers js" following this.

You will have the React frontend examaple along with it.

cover

2

nickytonline profile image
Nick Taylor (he/him)
•
Aug 9 '21

I'm going through the post building things out and when I compiled via npx hardhat compile, I had a look at the outputted JSON and it got me thinking about ASTs and then I discovered AST Explorer support Solidity for anyone interested.

A Solidity file in AST Explorer

It also got me thinking that you could probably write codemods for Solidity files. Anyways, small brainfart lol.

1

tangonan profile image
Tango (he/him)
•
Dec 15 '21

When I run the React server to test the greeting, the "Fetch greeting" button does not prompt Metamask to sign. The "Set greeting" also does not prompt MM.

I've started the tutorial from scratch three times with the same result.

What could I have done incorrectly?

1

codybreene profile image
Cody Breene
•
Jan 1

I ran into the same issue - you'll just need to reconnect MetaMask: ethereum.stackexchange.com/questio...

1

ockhamsrazor profile image
OckhamsRazor
•
Feb 5 • Edited on Feb 5

Maybe you need to keep "npx hardhat node" running when you are using react-app. If I don't keep it running, there will be no sign in a moment, after that, errors happen.

1

ramvi profile image
Jon Ramvi
•
Apr 12 '21

Thanks for the perfectly detailed introduction to dapp development!

How do you feel about the hardhat-react plugin? Is that something that could be included in this guide? npmjs.com/package/@symfoni/hardhat...

It autogenerates typed React hooks integrated into the Hardhat smart contract watch pipeline and gives you hot reloading while developing contracts

2

elm3nt0r profile image
elm3nt0r
•
Apr 24 '21

So symfoni makes it easier to connect the back-end dapp code (eg. the smart contract) to the front-end? So for example, wanted to make a website the will result in exchanging an NFT for ether, symfoni would make it easier?

2

ramvi profile image
Jon Ramvi
•
Apr 24 '21

That's right. Symfoni, together with Hardhat, does all the heavy lifting and repetitive tasks for you.

2

nicebardo profile image
niceBardo
•
Apr 20 '21

This is n awesome tutorial, thanks!
I am stuck while trying to set the greeting, I have this error in my console:

Object { code: -32603, message: "Error: [ethjs-query] while formatting outputs from RPC '{\"value\":{\"code\":-32603,\"data\":{\"code\":-32602,\"message\":\"Trying to send an incompatible EIP-155 transaction, signed for another chain.\"}}}'" }

and this in my terminal:

eth_blockNumber (2)
eth_sendRawTransaction

Trying to send an incompatible EIP-155 transaction, signed for another chain.

Can anybody help?
Thanks!

1

a_regularjeff profile image
Jeff
•
May 16 '21 • Edited on May 16

Verify your hardhat.config.js, in my case my issue was a typo around network

1

charles_lukes profile image
Son DotCom 🥑💙
•
Apr 21 '21

I had this error too, I resolved it by connecting my meta mask, you'll see the connect button on meta mask click on it.

1

fwalker profile image
Francine Walker
•
Jan 14

Almost a year old and this is still the best tutorial out there, IMO.
But I am stuck in a VERY frustrating aspect. When I run:
npx hardhat run scripts/deploy.js --network localhost
It returns with no error, but also no console output, and no console output on the terminal with the hardhart node running.
I don't know what to do, I can't find an answer online.
Has anyone encounter this frustrating problem.
I am new to this, but have been at it for several months with different projects and i think I got the basics down.
But this one is stumping me ! :(
I am running on a Linux machine on AWS.

2

drinkius profile image
Alexander Telegin
•
Mar 11 • Edited on Mar 12

Same here actually. Execution just stops on getContractFactory, no output, try/catch doesn't help, no info on the web - just your comment. JS works just fine, TS has such unexpected undebuggable issues

UPD: ok, as usual it turned out to be a simple missing await but one level higher that I've forgotten to look at :)

1

brianfakhoury profile image
Brian Fakhoury
•
Apr 12 '21

This was great -- really enjoyed the walkthrough.

I'm running into an issue where the deployed contract addresses have already been used previously. What's a straightforward way to force the contract to deploy to another address? I tried changing the solidity files slightly and re-compiling them, but no luck.

2

dominicwong profile image
Dominic Wong
•
Apr 19 '21

I did the same thing and no luck as well. Tried restarting the node and the contracts were deployed to the same address.

1

huudyy profile image
PabloHoudini
•
Jun 11 '21 • Edited on Jun 12

Great job!

I am also trying to deploy such full stack react application to fleek, but the problem I have is that artifacts folder is in .gitignore so I do not have access to it like I do in the local environment:
import Election from '../../artifacts/contracts/Election.sol/Election.json';
From hardhat docs it is recommended NOT to add that folder as it might get HUGE...
Has someone tried that, maybe ?
any help appreciated;)

```!!!UPDATE!!!!~~~~~~~
So, on fleek.co you can actually run 'npx hardhat compile' to create artifact directory for you and make the above import work correctly again, something like this:
alt text



kacemlight profile image
Kacem AIT OUAL
•
Sep 17 '21

Hello,
I got this error when I update my app.tsx :
Property 'ethereum' does not exist on type 'Window & typeof globalThis'

And I cannot even compile my code:
Failed to compile.

/workspace/template-typescript-react/src/App.tsx
TypeScript error in /workspace/template-typescript-react/src/App.tsx(15,18):
Property 'ethereum' does not exist on type 'Window & typeof globalThis'. TS2339

13 |   // request access to the user's MetaMask account
14 |   async function requestAccount() {
15 | await window.ethereum.request({ method: 'eth_requestAccounts' });
| ^
16 | }
17 |
18 | // call the smart contract, read the current greeting value

I'm working on a running node on gitpod.


1

deer26 profile image
deer
•
May 9

Hi all, any thoughts on the following error? Happening when first trying to set the greeting.
Error: Transaction reverted: function selector was not recognized and there's no fallback function
at Greeter. (contracts/Greeter.sol:6)

Thought I would jump into the web3 world with what seemed like a popular tutorial, but sadly not making it very far.


2

jyt profile image
JT
•
May 12

I am getting the same issue. Have you been able to resolve this?


1

deer26 profile image
deer
•
May 13

Nope. I moved on, although I would like to revisit if someone knows what to do. Maybe I'll learn enough with other tutorials to unblock myself here. Will comment if I figure it out.


1

marlonaesparza profile image
Marlon
•
Apr 6

Is it just me, or are none of the ropsten faucets working at the moment? Should I adjust and just switch test networks, or what should i do? Thanks. :)

Will improvise on a new branch until I figure it out lol...


1

greent3 profile image
greent3
•
Jan 19

To anyone receiving an error when importing "hardhat/console.sol" in VS code.. this error is caused by the solidity extension in VS code (version 0.0.136). In order to fix the error, simply go to your extensions manager in VS code, click on the solidity extension (should be Juan Blanco), click the down-arrow on the "uninstall" button, click "install another version", and then click 0.0.135.
After restarting your VS code application, the error should be gone. Anything Blockchain explains it in the video below.
youtube.com/watch?v=5qTdQNCMwk8


1

camerenisonfire profile image
Cameren Dolecheck
•
May 5 '21

Thank you for this well done tutorial. I've done a few tutorial dapps from Dapp University's guides. Those all use Ganache, so it was cool finding this one that used Hardhat. Hardhat feels more streamlined and easier to use.

I look forward to going through your other blockchain tutorials.


1

mwarger profile image
Mat Warger
•
May 30 '21

I wasn't able to send myself any test ether using the link provided, but I was able to find another way to get some. If you go to MetaMask for the Ropsten test account and hit the "Buy" button, it will give you the option for a test faucet at the bottom of the panel. You can click that button and it will direct you to a webpage that will let you send some test ether to your account - it even fills in the address for you.

button image


1

arielbk profile image
arielbk
•
Dec 15 '21

Such a good 'Hello world' introduction to fullstack Ethereum development.

I'm looking forward to trying out CryptoZombies to get the hang of Solidity, and going through the docs for Hardhat and ethers.js.


1

tysonwynne_ profile image
Tyson Wynne
•
May 29 '21

The Ropsten Ethereum Faucet said I was spamming, so I just ended up using this one instead -- faucet.dimensions.network/


3
View full discussion (107 comments)
Code of Conduct • Report abuse
Read next
ethanchenyenpeng profile image
Painless development setup for React Part 2: Linting & Formatting
Yenpeng chen (Ethan) - May 17

prems5 profile image
Where Should you use async and defer ? Good SEO-practices
PREM KUMAR - May 17

virejdasani profile image
Tell me a stupid app idea and I'll make it
Virej Dasani - May 10

andrewbaisden profile image
The Complete Modern React Developer 2022
Andrew Baisden - May 10


Nader Dabit
Follow
Web and mobile developer specializing in cross-platform, cloud-enabled, and Web3 application development.
LOCATION
Madison, MS USA
WORK
DevRel Engineer at Edge & Node / The Graph Protocol
JOINED
7 Jan 2019
More from Nader Dabit
The Complete Guide to Full Stack Web3 Development
#web3 #blockchain #solidity #webdev
Defining the web3 stack
#web3 #blockchain #ethereum
Building and Testing Smart Contracts with Foundry by Paradigm
#solidity #web3 #blockchain #webdev
DEV Community — A constructive and inclusive social network for software developers. With you every step of your journey.

Built on Forem — the open source software that powers DEV and other inclusive communities.

Made with love and Ruby on Rails. DEV Community © 2016 - 2022.

===
```
