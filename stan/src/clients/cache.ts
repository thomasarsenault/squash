export class Cache {
    private cache: Map<string, any> = new Map();

    public async get<T>(key: string, expiryTime: number, asyncFn: () => Promise<T>): Promise<T> {
        const cachedItem = this.cache.get(key);
        
        if (cachedItem && cachedItem.expiresAt > Date.now()) {
            return cachedItem.value;
        }
        
        const result = await asyncFn();
        
        this.cache.set(key, {
            value: result,
            expiresAt: Date.now() + expiryTime
        });
        
        return result;
    }
}

export default new Cache();