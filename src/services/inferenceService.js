const tf = require('@tensorflow/tfjs-node');
const InputError = require('../exceptions/InputError');

async function predictClassification(model, image) {
  try {
    const tensor = tf.node
      .decodeJpeg(image)
      .resizeNearestNeighbor([224, 224])
      .expandDims()
      .toFloat();

    const prediction = model.predict(tensor);
    const score = await prediction.data();
    const confidenceScore = Math.max(...score) * 100;

    console.log('PREDICTION RESULT : ', prediction);
    console.log('SCORE : ', score);
    console.log('CONFIDENCE SCORE : ', confidenceScore);

    const label = confidenceScore > 50 ? 'Cancer' : 'Non-cancer';

    let suggestion;

    if (label == 'Cancer') {
      suggestion = 'Segera periksa ke dokter!';
    } else {
      suggestion = 'Anda sehat!';
    }

    return { confidenceScore, label, suggestion };
  } catch (error) {
    throw new InputError(`Terjadi kesalahan dalam melakukan prediksi`);
  }
}

module.exports = predictClassification;
