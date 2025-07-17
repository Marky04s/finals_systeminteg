<template>
  <div>
    <h3>QR Scanner</h3>

    <!-- CAMERA SCANNER -->
    <div id="reader" style="width: 100%; max-width: 400px; margin: auto;"></div>

    <!-- IMAGE UPLOAD SCANNER -->
    <input
      type="file"
      accept="image/*"
      @change="onFileChange"
      style="margin-top: 20px; display: block;"
    />

    <!-- Optional: Show result -->
    <div v-if="scannedText" style="margin-top: 10px;">
      <strong>Scanned QR Code:</strong>
      <p>{{ scannedText }}</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      qrScanner: null,
      scannedText: null
    }
  },

  mounted() {
    if (!this.$Html5QrcodeScanner || !this.$Html5Qrcode) {
      console.error("html5-qrcode plugin not loaded")
      return
    }

    const onScanSuccess = (decodedText) => {
      console.log("Camera QR Code Scanned:", decodedText)

      this.scannedText = decodedText

      // Emit to parent instead of redirecting here
      this.$emit('scan-success', decodedText)

      // Optionally stop scanner
      this.qrScanner.clear()
    }

    const onScanFailure = () => {}

    this.qrScanner = new this.$Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    )

    this.qrScanner.render(onScanSuccess, onScanFailure)
  },

  methods: {
    async onFileChange(e) {
      const file = e.target.files[0]
      if (!file) return

      if (this.qrScanner) {
        await this.qrScanner.clear()
      }

      const html5QrCode = new this.$Html5Qrcode("reader")
      try {
        const result = await html5QrCode.scanFile(file, true)
        console.log("Image QR Code Scanned:", result)
        this.scannedText = result
        this.$emit('scan-success', result)
      } catch (err) {
        console.error("Failed to scan image:", err)
      }
    }
  },

  beforeDestroy() {
    if (this.qrScanner) {
      this.qrScanner.clear()
    }
  }
}
</script>