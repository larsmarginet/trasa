<script setup lang="ts">
import mapboxgl, { Map, MapboxOptions } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { onMounted, onUnmounted, ref } from 'vue';

const props = defineProps<{
    options?: MapboxOptions;
}>();

const mapRef = ref<HTMLElement | null>(null);
const map = ref<Map | null>(null);

onMounted(() => {
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_API_TOKEN;

    if (!mapRef.value) {
        return;
    }

    map.value = new mapboxgl.Map({
        container: mapRef.value,
        style: 'mapbox://styles/mapbox/streets-v12',
        zoom: 9,
        testMode: true,
        minZoom: 6,
        center: [3.729407, 51.065587],
        // overwrite default options
        ...props.options
    });

    map.value?.once('render', () => {
        map.value?.resize()
    });
});
</script>

<template>
    <div ref="mapRef" class="map" />
</template>

<style scoped>
.map {
  width: 100%;
  height: 100%;
}
</style>