import * as tfd from '@tensorflow/tfjs-data';

export async function loadWebcam(videoRef) {
  let webcam;
  try {
    webcam = await tfd.webcam(videoRef);
  } catch (e) {
    console.error(e);
  }

  const screenShot = await webcam.capture();
  screenShot.dispose();
  return webcam;
}
