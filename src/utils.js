// polyfills
NodeList.prototype[Symbol.iterator] = [][Symbol.iterator]
NodeList.prototype.map = [].map
NodeList.prototype.forEach = [].forEach

// utils
export var all = (node, sel) => sel ? node.querySelectorAll(sel) : document.querySelectorAll(node)
export var one = (node, sel) => sel ? node.querySelector(sel) : document.querySelector(node)
