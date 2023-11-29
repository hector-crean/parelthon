import { Feature, Geometry } from "geojson";
import { CSSProperties } from "react";

export type Quadrant = `${"top" | "bottom"}-${"left" | "right"}`;

/**
 * The Geometry gives us the focus point. The geometry style gives information as to how to style the geometry.
 *
 */
type AnnotationProps = {
  note: Note;
  subject: Subject;
};

type Subject = {
  style: CSSProperties;
};

type Note = {
  style: CSSProperties;
};

const renderHtmlAnnotation = (
  annotation: Feature<Geometry, AnnotationProps>
) => {
  switch (annotation.geometry.type) {
    case "Point":
      return <div></div>;
    case "LineString":
      return <div></div>;
    case "Polygon":
      return <div></div>;
    default:
      return <div></div>;
  }
};

export { renderHtmlAnnotation };
