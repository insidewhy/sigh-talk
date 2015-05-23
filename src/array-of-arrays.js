export default class {
  constructor() {
    this.array = []
  }

  add(key, item) {
    var existing = this.array[key]
    if (existing)
      existing.push(item)
    else
      this.array[key] = [ item ]
  }

  get(key) { return this.array[key] }

  get length() { return this.array.length }
}
