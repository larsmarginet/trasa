<script setup lang="ts">
import mapboxgl, { Map, MapboxOptions } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { onBeforeMount, onMounted, onUnmounted, ref } from 'vue';
import { IonSpinner, IonText } from '@ionic/vue';

const props = defineProps<{
    options?: MapboxOptions;
}>();

const mapRef = ref<HTMLElement | null>(null);
const isMapLoading = ref<boolean>(false);
const map = ref<Map | null>(null);

onBeforeMount(() => {
    isMapLoading.value = true
});

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

    map.value?.once('load', () => {
        map.value?.resize();
        isMapLoading.value = false;
    });
});

onUnmounted(() => {
    // destroy mapboxgl.Map instance
    map.value?.remove();
    map.value = null;
})
</script>

<template>
    <div class="map">
        <Transition name="fade">
            <div class="map__loader" v-show="isMapLoading" >
                <ion-spinner name="circular" />

                <p class="map__loader-message"><ion-text>loading map...</ion-text></p>
            </div>
        </Transition>

        <div ref="mapRef" class="map__map" />
    </div>
</template>

<style scoped>
.map {
    position: relative;
}

.map__map {
    width: 100%;
    height: 100%;
}

.map__loader {
    position: absolute;
    z-index: 1;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    background-color: white;
}

.map__loader-message {
    margin-top: 8px;
    font-size: 12px;
} 

/* TRANSITION */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 300ms ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>