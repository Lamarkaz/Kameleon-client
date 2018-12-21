# Kameleon Javascript Client
[Kameleon](https://github.com/Lamarkaz/Kameleon) is a Javascript framework for private and public blockchains powered by Tendermint consensus.

This package is a Javascript client that connects with Kameleon nodes from Node.js or the browser. It is intended to be used to be used to build wallets, web applications and dApps that interact with Kameleon-based blockchains.

This project is work in progress.

# Features
* Wallet keypair and address generation
* Ethereum-style keystore encryption and decryption
* Construct, sign & send transactions
* Ethereum transaction format and RLP+Msgpack serialization
* Automatic valid transaction nonce query 
* Query state or arbitrary info from Kameleon query handlers

# Installation


```bash
npm install --save kameleon-client
```

# Usage

```javascript
(async function() { // Allows async/await

    let KameleonClient = require('kameleon-client')

    let client = new KameleonClient('http://localhost:26657')

    let wallet = client.generateWallet()

    await client.send(wallet, {key:"value"}, "0000000000000000000000000000000000000001", '2')
        
    let nonce = await client.getNonce('nonce', wallet.getAddress())

    console.log(nonce) // prints new nonce after transaction is sent

})();
```

# API

API docs will be deployed on a separate site soon.

# Node

Kameleon-client requires an RPC endpoint of a Kameleon node to connect to. Please visit the [Kameleon package](https://github.com/Lamarkaz/Kameleon-client) for more info.

# Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

# License

[GNU GPLv3](https://choosealicense.com/licenses/gpl-3.0/)