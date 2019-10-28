import * as tf from '@tensorflow/tfjs';

import { getImage } from './webcam';

export async function train(
  controllerDataset,
  truncatedMobileNet,
  setTrainStatus
) {
  if (controllerDataset.xs == null) {
    throw new Error('Add some examples before training!');
  }

  let model = tf.sequential({
    layers: [
      tf.layers.flatten({
        inputShape: truncatedMobileNet.outputs[0].shape.slice(1)
      }),
      tf.layers.dense({
        units: 100,
        activation: 'relu',
        kernelInitializer: 'varianceScaling',
        useBias: true
      }),
      tf.layers.dense({
        units: 2,
        kernelInitializer: 'varianceScaling',
        useBias: false,
        activation: 'softmax'
      })
    ]
  });

  const optimizer = tf.train.adam(0.0001);
  model.compile({ optimizer: optimizer, loss: 'categoricalCrossentropy' });

  const batchSize = Math.floor(controllerDataset.xs.shape[0] * 0.4);
  if (!(batchSize > 0)) {
    throw new Error(
      `Batch size is 0 or NaN. Please choose a non-zero fraction.`
    );
  }

  await model.fit(controllerDataset.xs, controllerDataset.ys, {
    batchSize,
    epochs: 20,
    callbacks: {
      onBatchEnd: async (_, logs) => {
        setTrainStatus('Loss: ' + logs.loss.toFixed(5));
      }
    }
  });

  return model;
}

export async function predict(webcamRef, truncatedMobileNetRef, modelRef) {
  const img = await getImage(webcamRef.current);
  const embeddings = truncatedMobileNetRef.current.predict(img);
  const predictions = modelRef.current.predict(embeddings);
  const predictedClass = predictions.as1D().argMax();
  const classId = (await predictedClass.data())[0];
  img.dispose();
  await tf.nextFrame();
  return classId;
}
