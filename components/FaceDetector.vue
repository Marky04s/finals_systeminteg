<template>
  <div class="text-center">
    <v-card class="pa-4 mx-auto" max-width="500">
      <v-card-title>Face Detector</v-card-title>
      <v-card-text>
        <video ref="video" autoplay playsinline width="100%" @loadedmetadata="onVideoReady" />
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
      intervalId: null
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
      if (video && !video.paused && !video.ended) {
        const detections = await this.$faceapi.detectAllFaces(
          video,
          new this.$faceapi.TinyFaceDetectorOptions()
        )
        this.faceCount = detections.length
      }
    },
    onVideoReady() {
      // Check every second
      this.intervalId = setInterval(this.detectFaces, 1000)
    }
  },
  async mounted() {
    await this.startVideo()
  },
  beforeDestroy() {
    clearInterval(this.intervalId)
    const stream = this.$refs.video?.srcObject
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
    }
  }
}
</script>

<style scoped>
video {
  border-radius: 8px;
  border: 2px solid #ccc;
}
</style>