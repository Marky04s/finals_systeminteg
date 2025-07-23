import * as faceapi from 'face-api.js'

export default async ({ app }, inject) => {
  // Load the Tiny Face Detector model from static folder
  await faceapi.nets.tinyFaceDetector.loadFromUri('/models/tiny_face_detector')

  // Optionally load more models
  // await faceapi.nets.faceLandmark68Net.loadFromUri('/models')
  // await faceapi.nets.faceRecognitionNet.loadFromUri('/models')

  // Make faceapi available in context as $faceapi
  inject('faceapi', faceapi)
}