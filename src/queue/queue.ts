export default class Node<T> {
  value: T;
  next: Node<T> | null = null;

  constructor(value: T) {
    this.value = value;
  }
}

/**
 * Queue implementation using linked list.
 */
export class Queue<T> {
  private first: Node<T> | null = null;
  private last: Node<T> | null = null;
  private n: number = 0;

  enqueue(item: T): void {
    const n = new Node(item);
    const oldLast = this.last;
    this.last = n;
    if (oldLast !== null) {
      oldLast.next = this.last;
    }
    if (this.isEmpty()) {
      this.first = n;
    }
    this.n++;
  }

  dequeue(): T {
    if (this.first === null) {
      throw 'Queue is empty';
    }
    const oldFirst = this.first;
    this.first = this.first.next;
    this.n--;
    if (this.isEmpty()) {
      this.last = null;
    }
    return oldFirst.value;
  }

  isEmpty(): boolean {
    return this.n === 0;
  }

  size(): number {
    return this.n;
  }
}