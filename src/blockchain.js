
export class Block {
    constructor(index, timestamp, data, prevHash = '') {
      this.index = index;
      this.timestamp = timestamp;
      this.data = data;
      this.prevHash = prevHash;
      this.hash = this.calculateHash();
    }
  
    calculateHash() {
      return btoa(
        this.index +
        this.timestamp +
        JSON.stringify(this.data) +
        this.prevHash
      );
    }
  }
  
  export class Blockchain {
    constructor() {
      this.chain = [this.createGenesisBlock()];
    }
  
    createGenesisBlock() {
      return new Block(0, Date.now(), { message: 'Genesis Block' }, '0');
    }
  
    getLatestBlock() {
      return this.chain[this.chain.length - 1];
    }
  
    addBlock(data) {
      const prevBlock = this.getLatestBlock();
      const newBlock = new Block(
        this.chain.length,
        Date.now(),
        data,
        prevBlock.hash
      );
      this.chain.push(newBlock);
      return newBlock;
    }
  }