
import { Geometry } from 'geojson';
import { Block } from './block';
import { Interval } from './interval';
import { RichText } from './rich-text';


interface VideoAnnotation<T extends Geometry> {
    //unique identifier for this layer
    id: string;
    //interval of time in video over which this layer is visible
    //We could technically have a datetime interval etc. as well
    interval: Interval
    geometry: T,
    //content
    title: RichText,
    subtitle: RichText,
    body: Array<Block>
    //Information about creation of the Layer (when/by whom)
}


export type { VideoAnnotation };
