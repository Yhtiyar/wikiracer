
interface HeapNode<T> {
    key: number
    value: T
}
/**
 * Heap based priority queue, priority is from smaller one to bigger
 * 
 * @see https://en.wikipedia.org/wiki/Priority_queue 
 * 
 * Code is modified from here: @see https://itnext.io/priority-queue-in-typescript-6ef23116901
 */
class PriorityQueue<T> {
    heap: HeapNode<T>[] = []

    //Heap operations
    private parent = (index: number) => Math.floor((index - 1) / 2)
    private left = (index: number) => 2 * index + 1
    private right = (index: number) =>  2 * index + 2
    private hasLeft = (index: number) => this.left(index) < this.heap.length
    private hasRight = (index: number) => this.right(index) < this.heap.length
    private swap = (a: number, b: number) => {
        const tmp = this.heap[a]
        this.heap[a] = this.heap[b]
        this.heap[b] = tmp
    }
    //end of heap operations

    public isEmpty = () => this.heap.length == 0
    public size = () => this.heap.length;
    public front = () => this.heap.length == 0 ? null : this.heap[0].value;
    public frontPriority = () => this.heap.length == 0 ? null : this.heap[0].key;
    public push (item : T, priority : number) {
        this.heap.push({key: priority, value: item})
        let i = this.heap.length -1
        while(i > 0) {
          const p = this.parent(i)
          if(this.heap[p].key < this.heap[i].key) break
          const tmp = this.heap[i]
          this.heap[i] = this.heap[p]
          this.heap[p] = tmp
          i = p
        }
    }
    public pop () {
        if(this.heap.length == 0) return null
        this.swap(0, this.heap.length - 1)
        const item = this.heap.pop()
        
        let current = 0
        while(this.hasLeft(current)) {
          let smallerChild = this.left(current)
          if(this.hasRight(current) && this.heap[this.right(current)].key < this.heap[this.left(current)].key) 
            smallerChild = this.right(current)
  
          if(this.heap[smallerChild].key > this.heap[current].key) break
  
          this.swap(current, smallerChild)
          current = smallerChild
        }
        if (!item)
            return null;
        return item.value
      }
}

