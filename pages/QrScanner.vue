<template>
  <div>
    <h2>Scan Your QR Code</h2>
    <QrScanner />
  </div>
</template>

<script>
import QrScanner from '~/components/QrScanner.vue'

export default {
  components: { QrScanner }
}
</script>
