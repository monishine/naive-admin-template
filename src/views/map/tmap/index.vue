<template>
  <div class="base-container">
    <tlbs-map ref="map" class="h-full" :api-key="mapKey" :center="center" :zoom="13">
    </tlbs-map>
  </div>
</template>

<script setup lang="ts">
const mapKey = 'OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77';

const center = { lat: 39.91799, lng: 116.397027 };
</script>

<style scoped></style>