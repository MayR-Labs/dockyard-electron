export default class Store {
  data;

  constructor(_options?) {
    this.data = new Map();
  }

  get(key, defaultValue?) {
    return this.data.has(key) ? this.data.get(key) : defaultValue;
  }

  set(key, value) {
    this.data.set(key, value);
  }

  delete(key) {
    this.data.delete(key);
  }

  clear() {
    this.data.clear();
  }

  has(key) {
    return this.data.has(key);
  }
}
