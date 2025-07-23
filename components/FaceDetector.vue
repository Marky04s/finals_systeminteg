<template>
  <div class="text-center">
    <v-card class="pa-4 mx-auto" max-width="500">
      <v-card-title>Face Detector</v-card-title>
      <v-card-text>
        <div style="position: relative">
          <video ref="video" autoplay playsinline width="100%" @loadedmetadata="onVideoReady" />
          <canvas ref="overlay" class="overlay-canvas" />
        </div>
        <p v-if="faceCount !== null" class="mt-3">
          Detected Faces: <strong>{{ faceCount }}</strong>
        </p>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      faceCount: null,
      rafId: null,
    }
  },
  methods: {
    async startVideo() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: {} })
        this.$refs.video.srcObject = stream
      } catch (error) {
        console.error('Camera error:', error)
      }
    },
    async detectFaces() {
      const video = this.$refs.video
      const canvas = this.$refs.overlay

      if (video && !video.paused && !video.ended) {
        const detections = await this.$faceapi.detectAllFaces(
          video,
          new this.$faceapi.TinyFaceDetectorOptions()
        )

        this.faceCount = detections.length

        // Resize canvas to match video
        const displaySize = { width: video.videoWidth, height: video.videoHeight }
        this.$faceapi.matchDimensions(canvas, displaySize)

        const resizedDetections = this.$faceapi.resizeResults(detections, displaySize)

        const ctx = canvas.getContext('2d')
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        this.$faceapi.draw.drawDetections(canvas, resizedDetections)
      }
    },
    async detectLoop() {
      await this.detectFaces()
      this.rafId = requestAnimationFrame(this.detectLoop)
    },
    onVideoReady() {
      this.detectLoop()
    },
  },
  async mounted() {
    await this.startVideo()
  },
  beforeDestroy() {
    cancelAnimationFrame(this.rafId)
    const stream = this.$refs.video?.srcObject
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
    }
  },
}
</script>

<style scoped>
video {
  border-radius: 8px;
  border: 2px solid #ccc;
}

.overlay-canvas {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>