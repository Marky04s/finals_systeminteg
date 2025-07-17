<template>
  <div>
    <h2>Scan Your QR Code</h2>
    <QrScanner @scan-success="handleScanSuccess" />
  </div>
</template>

<script>
import QrScanner from '~/components/QrScanner.vue'

export default {
  components: { QrScanner },
  methods: {
    handleScanSuccess(scannedData) {
      // Open scanned QR data in new tab if it's a valid link
      if (scannedData.startsWith('http')) {
        window.open(scannedData, '_blank')
      } else {
        alert('Scanned text is not a valid URL:\n' + scannedData)
      }
    }
  }
}
</script>