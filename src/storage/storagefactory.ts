export abstract class Storage {
  abstract async save(key: string, value: string): Promise<void>;

  abstract async get(key: string): Promise<string>;

  abstract async delete(): Promise<void>;
}

export enum StorageType {
  LEVELDB
}

export class StorageFactory {
  static product(type: StorageType = StorageType.LEVELDB): Storage {
    switch (type) {
      case StorageType.LEVELDB:
        return null;
      default:
        throw new Error(`no support storage type: ${type}`)
    }
  }

  async test(): Promise<void> {
    return null;
  }
}