export abstract class StorageManager {
    readonly length = this.getStorage().length;

    setItem<TValue>(key: string, value: TValue) {
        this.getStorage().setItem(key, JSON.stringify(value));
    }

    getItem<TValue>(key: string): TValue | null {
        const value = this.getStorage().getItem(key);

        if (value) {
            return JSON.parse(value) as TValue;
        }

        return null;
    }

    key<TValue>(index: number): TValue | null {
        const value = this.getStorage().key(index);

        if (value) {
            return JSON.parse(value) as TValue;
        }

        return null;
    }

    removeItem(key: string) {
        this.getStorage().removeItem(key);
    }

    removeAll() {
        this.getStorage().clear();
    }

    protected abstract getStorage(): Storage;
}