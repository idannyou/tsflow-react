import * as tf from '@tensorflow/tfjs';
import * as tfd from '@tensorflow/tfjs-data';

export async function loadTruncatedMobileNet() {
  const mobilenet = await tf.loadLayersModel(
    'https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json'
  );

  const layer = mobilenet.getLayer('conv_pw_13_relu');
  return tf.model({ inputs: mobilenet.inputs, outputs: layer.output });
}

export async function loadWebcam(videoRef, truncatedMobileNet) {
  if (!videoRef) return;
  let webcam;
  try {
    webcam = await tfd.webcam(videoRef);
  } catch (e) {
    console.error(e);
  }
  truncatedMobileNet = await loadTruncatedMobileNet();
  const screenShot = await webcam.capture();
  truncatedMobileNet.predict(screenShot.expandDims(0));
  screenShot.dispose();
  return webcam;
}
