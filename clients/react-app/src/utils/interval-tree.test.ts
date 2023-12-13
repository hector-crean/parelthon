import { Interval, IntervalTree } from './interval-tree'


interface StringInterval extends Interval {
    data: string
}

const tree = new IntervalTree<StringInterval, number>()


const values: [number, number, string][] = [
    [50, 150, 'data1'],
    [75, 100, 'data2'],
    [40, 100, 'data3'],
    [60, 150, 'data4'],
    [80, 90, 'data5'],
]

values.map(([low, high, value]) => ({ low, high, data: value })).forEach(i => tree.insert(i))

tree.search(2, 30)

/* Usage:
insert - intervalTree.insert(low: number, high: number, data: T) =>
         inserts based on shallow equality
         true if success, false if nothing inserted (duplicate item)
search - intervalTree.search(low: number, high: number) => [ data, data, data, ... ] =>
         empty array if no result
remove - intervalTree.remove(low: number, high: number, data: T) =>
         removes based on shallow equality
         true if success, false if nothing removed
*/
