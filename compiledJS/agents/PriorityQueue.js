"use strict";
/**
 * Heap based priority queue, priority is from smaller one to bigger
 *
 * @see https://en.wikipedia.org/wiki/Priority_queue
 */
class PriorityQueue {
    constructor() {
        this.heap = [];
        //Heap operations
        this.parent = (index) => Math.floor((index - 1) / 2);
        this.left = (index) => 2 * index + 1;
        this.right = (index) => 2 * index + 2;
        this.hasLeft = (index) => this.left(index) < this.heap.length;
        this.hasRight = (index) => this.right(index) < this.heap.length;
        this.swap = (a, b) => {
            const tmp = this.heap[a];
            this.heap[a] = this.heap[b];
            this.heap[b] = tmp;
        };
        //end of heap operations
        this.isEmpty = () => this.heap.length == 0;
        this.size = () => this.heap.length;
        this.front = () => this.heap.length == 0 ? null : this.heap[0].value;
    }
    push(item, priority) {
        this.heap.push({ key: priority, value: item });
        let i = this.heap.length - 1;
        while (i > 0) {
            const p = this.parent(i);
            if (this.heap[p].key < this.heap[i].key)
                break;
            const tmp = this.heap[i];
            this.heap[i] = this.heap[p];
            this.heap[p] = tmp;
            i = p;
        }
    }
    pop() {
        if (this.heap.length == 0)
            return null;
        this.swap(0, this.heap.length - 1);
        const item = this.heap.pop();
        let current = 0;
        while (this.hasLeft(current)) {
            let smallerChild = this.left(current);
            if (this.hasRight(current) && this.heap[this.right(current)].key < this.heap[this.left(current)].key)
                smallerChild = this.right(current);
            if (this.heap[smallerChild].key > this.heap[current].key)
                break;
            this.swap(current, smallerChild);
            current = smallerChild;
        }
        if (!item)
            return null;
        return item.value;
    }
}
class Example {
    constructor(x) {
        this.x = x;
    }
}
