export default class Store {
  private data: Map<string, any>;

  constructor(_options?: any) {
    this.data = new Map();
  }

  get(key: string, defaultValue?: any): any {
    return this.data.has(key) ? this.data.get(key) : defaultValue;
  }

  set(key: string, value: any): void {
    this.data.set(key, value);
  }

  delete(key: string): void {
    this.data.delete(key);
  }

  clear(): void {
    this.data.clear();
  }

  has(key: string): boolean {
    return this.data.has(key);
  }
}
