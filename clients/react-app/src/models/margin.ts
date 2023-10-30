
export interface Margin {
  top: number;
  bottom: number;
  left: number;
  right: number;
}


function computeMarginForAspectRatio(
    containerWidth: number,
    containerHeight: number,
    aspectWidth = 4,
    aspectHeight = 3
  ): Margin {
    let targetWidth: number;
    let targetHeight: number;

    if (containerWidth / containerHeight > aspectWidth / aspectHeight) {
      // Screen is wider than the target aspect ratio, so height is the constraining dimension.
      targetHeight = containerHeight;
      targetWidth = (aspectWidth / aspectHeight) * targetHeight;
    } else {
      // Screen is narrower than or equal to the target aspect ratio, so width is the constraining dimension.
      targetWidth = containerWidth;
      targetHeight = (aspectHeight / aspectWidth) * targetWidth;
    }

    const marginTopBottom = (containerHeight - targetHeight) / 2;
    const marginLeftRight = (containerWidth - targetWidth) / 2;

    return {
      top: marginTopBottom,
      bottom: marginTopBottom,
      left: marginLeftRight,
      right: marginLeftRight,
    };
  }


  export { computeMarginForAspectRatio };
