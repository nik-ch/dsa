export default class Node<T> {
  value: T;
  next: Node<T> | null = null;

  constructor(value: T) {
    this.value = value;
  }
}

/**
 * Stack implementation using linked list.
 */
export class Stack<T> {
  private first: Node<T> | null = null;
  private n: number = 0;

  push(item: T): void {
    const oldFirst = this.first;
    this.first = new Node(item);
    this.first.next = oldFirst;
    this.n++;
  }

  pop(): T {
    if (this.first === null) {
      throw 'Stack is empty';
    }
    const toPop = this.first as Node<T>;
    this.first = this.first.next;
    this.n--;
    return toPop.value;
  }

  isEmpty(): boolean {
    return this.n === 0;
  }

  size(): number {
    return this.n;
  }
}