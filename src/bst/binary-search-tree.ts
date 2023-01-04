export interface Comparable {
  compareTo(other: Comparable): number;
}

export class Node<K extends Comparable, V> {
  public left: Node<K, V> | null;
  public right: Node<K, V> | null;
  public key: K;
  public value: V;
  public count = 0;

  constructor(key: K, value: V) {
    this.key = key;
    this.value = value;
  }
}

export class BinarySearchTree<K extends Comparable, V> {
  private root: Node<K, V> | null = null;

  /**
   * Returns symbol table value by it's key, null if key is not presented in the symbol table.
   */
  public get(key: K): V | null {
    let x = this.root;
    while (x !== null) {
      const cmp = x.key.compareTo(key);
      if (cmp === 0) {
        return x.value;
      } else if (cmp > 0) {
        x = x.left;
      } else {
        x = x.right;
      }
    }
    return null;
  }

  /**
   * Puts a new value to the symbol table. If that key is already exists, updates it's value.
   */
  public put(key: K, val: V): void {
    this.root = this._put(this.root, key, val);
  }

  private _put(node: Node<K, V> | null, key: K, val: V): Node<K, V> {
    if (node === null) {
      return new Node(key, val);
    }
    const cmp = node.key.compareTo(key);
    if (cmp === 0) {
      node.value = val;
    } else if (cmp > 0) {
      node.left = this._put(node.left, key, val);
    } else {
      node.right = this._put(node.right, key, val);
    }
    node.count = 1 + this._size(node.left) + this._size(node.right);
    return node;
  }

  /**
   * Returns the smallest key in the symbol table.
   */
  public min(): K {
    if (this.root === null) {
      throw 'Symbol table is empty';
    }
    return this._min(this.root).key;
  }

  private _min(node: Node<K, V>): Node<K, V> {
    let x = node;
    while (x.left !== null) {
      x = x.left;
    }
    return x;
  }

  /**
   * Returns the biggest key in the symbol table.
   */
  public max(): K | null {
    if (this.root === null) {
      throw 'Symbol table is empty';
    }
    return this._max(this.root).key;
  }

  private _max(node: Node<K, V>): Node<K, V> {
    let x = node;
    while (x.right !== null) {
      x = x.right;
    }
    return x;
  }

  /**
   * Returns biggest value <= given key.
   */
  public floor(key: K): V | null {
    return this._floor(this.root, key);
  }

  private _floor(node: Node<K, V> | null, key: K): V | null {
    if (node === null) {
      return null;
    }
    const cmp = node.key.compareTo(key);
    if (cmp === 0) {
      return node.value;
    } else if (cmp > 0) {
      return this._floor(node.left, key);
    } else {
      const t = this._floor(node.right, key);
      return t || node.value;
    }
  }

  /**
   * Returns smalest value >= given key.
   */
  public ceiling(key: K): V | null {
    return this._ceiling(this.root, key);
  }

  private _ceiling(node: Node<K, V> | null, key: K): V | null {
    if (node === null) {
      return null;
    }
    const cmp = node.key.compareTo(key);
    if (cmp === 0) {
      return node.value;
    } else if (cmp < 0) {
      return this._ceiling(node.right, key);
    } else {
      const t = this._ceiling(node.left, key);
      return t || node.value;
    }
  }

  /**
   * Returns number of keys in the symbol table strictly less than given key.
   */
  public rank(key: K): number {
    return this._rank(this.root, key);
  }

  private _rank(node: Node<K, V> | null, key: K): number {
    if (node === null) {
      return 0;
    }
    const cmp = node.key.compareTo(key);
    if (cmp === 0) {
      return this._size(node.left);
    } else if (cmp > 0) {
      return this._rank(node.left, key);
    } else {
      return 1 + this._size(node.left) + this._rank(node.right, key);
    }
  }

  /**
   * Returns all the keys in the symbol table in ascending order (from left to right).
   */
  public keys(): K[] {
    const keys: K[] = [];
    this._keys(this.root, keys);
    return keys;
  }

  private _keys(node: Node<K, V> | null, ar: K[]): void {
    if (node === null) {
      return;
    }
    this._keys(node.left, ar);
    ar.push(node.key);
    this._keys(node.right, ar);
  }

  /**
   * Returns the key of the given rank. This key has the property that
   * there are {rank} keys in the symbol table that are smaller.
   */
  public select(rank: number): K | null {
    if (rank < 0 || rank >= this.size()) {
      throw 'Rank should be < than the current symbol table size and >= 0';
    }
    return this._select(this.root, rank);
  }

  private _select(node: Node<K, V> | null, rank: number): K | null {
    if (node === null) {
      return null;
    }
    const leftSize = this._size(node.left);
    if (leftSize === rank) {
      return node.key;
    } else if (leftSize > rank) {
      return this._select(node.left, rank);
    } else {
      return this._select(node.right, rank - 1 - leftSize);
    }
  }

  /**
   * Removes the smallest key from the symbol table.
   */
  public delMin(): void {
    if (this.root === null) {
      throw 'Symbol table is empty';
    }
    this.root = this._delMin(this.root);
  }

  private _delMin(node: Node<K, V>): Node<K, V> | null {
    if (node.left === null) {
      return node.right;
    }
    node.left = this._delMin(node.left);
    node.count = 1 + this._size(node.left) + this._size(node.right);
    return node;
  }

  /**
   * Removes the biggest key from the symbol table.
   */
  public delMax(): void {
    if (this.root === null) {
      throw 'Symbol table is empty';
    }
    this.root = this._delMax(this.root);
  }

  private _delMax(node: Node<K, V>): Node<K, V> | null {
    if (node.right === null) {
      return node.left;
    }
    node.right = this._delMax(node.right);
    node.count = 1 + this._size(node.left) + this._size(node.right);
    return node;
  }

  /**
   * Removes entry by the given key. Hibbard deletion algorithm.
   */
  public delete(key: K): void {
    this.root = this._delete(this.root, key);
  }

  private _delete(node: Node<K, V> | null, key: K): Node<K, V> | null {
    if (node === null) {
      return null;
    }
    const cmp = node.key.compareTo(key);
    if (cmp > 0) {
      node.left = this._delete(node.left, key);
    } else if (cmp < 0) {
      node.right = this._delete(node.right, key);
    } else {
      if (node.left === null) {
        return node.right;
      } else if (node.right === null) {
        return node.left;
      }
      const oldNode = node;
      node = this._min(oldNode.right);
      node.right = this._delMin(oldNode.right);
      node.left = oldNode.left;
    }
    node.count = this._size(node.left) + this._size(node.right) + 1;
    return node;
  }

  public size(): number {
    return this._size(this.root);
  }

  private _size(node: Node<K, V> | null): number {
    return node === null ? 0 : node.count;
  }

}
