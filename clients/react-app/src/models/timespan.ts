import IntervalTree, { Interval } from "@flatten-js/interval-tree";


interface IntervalData<T, D> {
  period: T;
  data: D;
}



const convertToInterval = <D>({ period: [start, end], data }: IntervalData<[number, number], D>): IntervalData<Interval, D> => {
  return {
    period: new Interval(start, end),
    data
  }
}

const intervalTree = <D>(timespans: Array<IntervalData<[number, number], D>>) => {

  const tree = new IntervalTree<D>();
  for (const { period, data } of timespans) {
    tree.insert(period, data);
  }
  return tree;
}



// const queryNearestChapter = <D>(tree: IntervalTree<IntervalData<Interval, D>>) => {
//     tree.intersect_any([0,1000])
// }


export type { IntervalData };
export { convertToInterval, intervalTree };

