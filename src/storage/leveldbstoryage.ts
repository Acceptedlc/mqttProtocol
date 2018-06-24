import {Storage} from "./storagefactory";



export class LevelDbStorage extends Storage {
    async save(key: string, value: string): Promise<void> {

    }

    async get(key: string): Promise<string> {
        return '';
    }

    async delete(): Promise<void> {

    }
}