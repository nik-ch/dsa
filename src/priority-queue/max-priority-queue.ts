export interface Comparable {
  compareTo(other: Comparable): number;
}

/**
 * Max priority queue implementation using binary heap.
 */
export class MaxPriorityQueue<T extends Comparable> {
  private ar: T[] = [];
  private n: number = 0;

  insert(key: T): void {
    this.ar[++this.n] = key;
    this.swim(this.n);
  }

  delMax(): T {
    if (this.isEmpty()) {
      throw 'Priority queue is empty';
    }
    const max = this.ar[1];
    this.swap(1, this.n--);
    this.sink(1);
    return max;
  }

  isEmpty(): boolean {
    return this.n === 0;
  }

  size(): number {
    return this.n;
  }

  /**
   * Lifting up the key while it's parent is smaller.
   */
  private swim(ind: number): void {
    while (ind > 1) {
      const parentInd = Math.floor(ind / 2);
      if (this.ar[parentInd].compareTo(this.ar[ind]) < 0) {
        this.swap(ind, parentInd);
        ind = parentInd;
      } else {
        break;
      }
    }
  }

  /**
   * Move element down while it's smaller than it's children.
   */
  private sink(ind: number): void {
    while (2 * ind <= this.n) {
      let childInd = ind * 2;
      if (this.ar[childInd].compareTo(this.ar[childInd + 1]) < 0) { // exchanging parent with the biggest child
        childInd++;
      }
      if (this.ar[ind].compareTo(this.ar[childInd]) >= 0) {
        break;
      }
      this.swap(ind, childInd);
      ind = childInd;
    }
  }

  private swap(i: number, j: number): void {
    const oldEl = this.ar[i];
    this.ar[i] = this.ar[j];
    this.ar[j] = oldEl;
  }
}
