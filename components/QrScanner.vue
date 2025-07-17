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

    // ✅ Use arrow function to preserve "this"
    const onScanSuccess = (decodedText) => {
      console.log("Camera QR Code Scanned:", decodedText)
      this.scannedText = decodedText

      // ✅ Emit to parent to handle redirect
      this.$emit('scan-success', decodedText)

      this.qrScanner.clear() // Optional: stop scanning after success
    }

    const onScanFailure = error => {
      // You can log scan failures here if needed
    }

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

      // Clear camera scanner before scanning file
      if (this.qrScanner) {
        await this.qrScanner.clear()
      }

      const html5QrCode = new this.$Html5Qrcode("reader")
      try {
        const result = await html5QrCode.scanFile(file, true)
        console.log("Image QR Code Scanned:", result)
        this.scannedText = result

        // ✅ Emit result from file upload scan
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