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

export async function getImage(webcam) {
  const img = await webcam.capture();
  const processedImg = tf.tidy(() =>
    img
      .expandDims(0)
      .toFloat()
      .div(127)
      .sub(1)
  );
  img.dispose();
  return processedImg;
}

export function draw(image, canvas) {
  const [width, height] = [224, 224];
  const ctx = canvas.getContext('2d');
  const imageData = new ImageData(width, height);
  const data = image.dataSync();
  for (let i = 0; i < height * width; ++i) {
    const j = i * 4;
    imageData.data[j + 0] = (data[i * 3 + 0] + 1) * 127;
    imageData.data[j + 1] = (data[i * 3 + 1] + 1) * 127;
    imageData.data[j + 2] = (data[i * 3 + 2] + 1) * 127;
    imageData.data[j + 3] = 255;
  }
  ctx.putImageData(imageData, 0, 0);
}
