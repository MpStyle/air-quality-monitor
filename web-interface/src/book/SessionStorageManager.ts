import { StorageManager } from "./StorageManager";

class SessionStorageManager extends StorageManager {
    protected getStorage(): Storage {
        return sessionStorage;
    }
}

export const sessionStorageManager = new SessionStorageManager();