import Dexie from 'dexie';

export class Database extends Dexie {
  hashes: Dexie.Table<HashTable, number>;
  icons: Dexie.Table<IconTable, number>;
  
  constructor() {  
    super("IconCache");

    this.version(1).stores({
      hashes: '&id, hash',
      icons: '&id, fullId, name, data, aliases, tags, codepoint'
    });
    
    this.hashes = this.table("hashes");
    this.icons = this.table("icons");
  }
}

interface HashTable {
  index?: number,
  id: string,
  hash: string
}

interface IconTable {
  index?: number,
  id: string,
  name: string,
  data: string,
  aliases: string,
  tags: string,
}