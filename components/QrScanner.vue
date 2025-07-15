<template>
  <div>
    <p>QR Scanner Ready</p>
    <div id="reader" style="width: 100%; max-width: 400px; margin: auto;"></div>
  </div>
</template>

<script>
export default {
  mounted() {
    console.log("Component mounted")

    if (!this.$Html5QrcodeScanner) {
      console.error("❌ this.$Html5QrcodeScanner not found. Plugin not working.")
      return
    }

    console.log("this.$Html5QrcodeScanner is available")

    const onScanSuccess = (decodedText, decodedResult) => {
      console.log("QR Code Scanned:", decodedText)
      this.qrScanner.clear()
    }

    const onScanFailure = error => {
      console.warn("Scan failed:", error)
    }

    this.qrScanner = new this.$Html5QrcodeScanner(
      "reader",
      {
        fps: 10,
        qrbox: { width: 250, height: 250 }
      },
      false
    )

    console.log("⚙️ Rendering scanner...")
    this.qrScanner.render(onScanSuccess, onScanFailure)
  },

  beforeDestroy() {
    if (this.qrScanner) {
      console.log("🧹 Clearing QR scanner")
      this.qrScanner.clear()
    }
  }
}
</script>