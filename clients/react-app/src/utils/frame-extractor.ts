function captureVideoFrame(videoEl: HTMLVideoElement): string {
    videoEl.crossOrigin = 'anonymous'
    const canvas = document.createElement("canvas");

    canvas.width = videoEl.videoWidth;
    canvas.height = videoEl.videoHeight;
    const canvasContext = canvas.getContext("2d")!;
    canvasContext.drawImage(videoEl, 0, 0);


    return canvas.toDataURL('image/png');
}

export { captureVideoFrame };

