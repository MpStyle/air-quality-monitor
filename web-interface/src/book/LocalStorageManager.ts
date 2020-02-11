import { StorageManager } from "./StorageManager";

class LocalStorageManager extends StorageManager {
    protected getStorage(): Storage {
        return localStorage;
    }
}

export const localStorageManager = new LocalStorageManager();