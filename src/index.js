var axios = require('axios')
var Transaction = require('ethereumjs-tx')
var Wallet = require('ethereumjs-wallet')
var { encode, decode } = require('msgpack-lite')

class KameleonClient {
  constructor(rpc) {
    this.rpc = rpc
  }

  generateWallet(privKey = false) {
    if(privKey) {
      if(Buffer.isBuffer(privKey)) {
        return Wallet.fromPrivateKey(privKey)
      } else{
        return Wallet.fromPrivateKey(Buffer.from(privKey, 'hex'))
      }
    }else{
      return Wallet.generate()
    }
  }

  decrypt(keystore, password) {
    return Wallet.fromV3(keystore, password)
  }

  query(path, data = false) {
    var self = this;
    return new Promise(function(resolve, reject){
      var params = { path: '"'+path+'"'}
      if(data) {
        params.data = '0x'+encode(data).toString('hex') 
      }
      return axios
        .get(parseHttpUri(self.rpc) + '/abci_query', {params})
        .then(function(res){
          resolve(decode(Buffer.from(res.data.result.response.info.slice(2), 'hex')))
        })
        .catch(reject)
    })
  }

  getNonce(address) {
    address = address.toString('hex')
    var self = this;
    return new Promise(function(resolve, reject){
      self.query('nonce', address).then(resolve).catch(reject)
    })
  }

  tx(obj) {
    return new Transaction(obj)
  }

  broadcast(tx) {
    var self = this;
    return new Promise(function(resolve, reject){
      let txBytes = '0x' + tx

      return axios
        .get(parseHttpUri(self.rpc) + '/broadcast_tx_commit', {
          params: { tx: txBytes }
        })
        .then(function(res){
          resolve(res.data.result)
        })
        .catch(reject)
    })
  }

  send(wallet, data = {}, recipient = false, value = '0') {
    var self = this;
    return new Promise(async function(resolve, reject){
      try {
        var tx = self.tx()
        tx.nonce = await self.getNonce(wallet.getAddress())
        tx.value = value;
        tx.data = encode(data).toString('hex');
        if(recipient) {
          if(recipient.startsWith('0x')) {
            tx.to = recipient
          }else{
            tx.to = '0x'+recipient
          }
        }
        tx.sign(wallet.privKey)
        tx = tx.serialize().toString('hex')
        resolve(await self.broadcast(tx))
      } catch(e) {
        reject(e)
      }
    })
  }

}

function parseHttpUri(wsUri) {
  return wsUri.replace('ws', 'http').split('/websocket')[0]
}

module.exports = KameleonClient