<script setup lang="ts">
import mapboxgl, { Map, MapboxOptions } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { onBeforeMount, onMounted, onUnmounted, ref, watch } from "vue";
import { IonSpinner, IonText } from "@ionic/vue";

const props = defineProps<{
  options?: MapboxOptions;
  data?: any;
}>();

const mapRef = ref<HTMLElement | null>(null);
const isMapLoading = ref<boolean>(false);
const map = ref<Map | null>(null);

onBeforeMount(() => {
  isMapLoading.value = true;
});

watch(
  [() => props.data, () => map.value],
  ([value]) => {
    console.log("value update 1");
    console.log(!map.value);
    console.log(value);
    if (map.value?.loaded && value) {
      console.log("value update");

      map.value.addSource("gardens", {
        type: "geojson",
        data: value,
        cluster: true,
        clusterMaxZoom: 14, // Max zoom to cluster points on
        clusterRadius: 50, // Radius of each cluster when clustering points (defaults to 50)
      });

      map.value.addLayer({
        id: "clusters",
        type: "circle",
        source: "gardens",
        filter: ["has", "point_count"],
        paint: {
          // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
          // with three steps to implement three types of circles:
          //   * Blue, 20px circles when point count is less than 100
          //   * Yellow, 30px circles when point count is between 100 and 750
          //   * Pink, 40px circles when point count is greater than or equal to 750
          "circle-color": [
            "step",
            ["get", "point_count"],
            "#51bbd6",
            100,
            "#f1f075",
            750,
            "#f28cb1",
          ],
          "circle-radius": [
            "step",
            ["get", "point_count"],
            20,
            100,
            30,
            750,
            40,
          ],
        },
      });

      map.value.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "gardens",
        filter: ["has", "point_count"],
        layout: {
          "text-field": ["get", "point_count_abbreviated"],
          "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
          "text-size": 12,
        },
      });

      map.value.addLayer({
        id: "unclustered-point",
        type: "circle",
        source: "gardens",
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-color": "#11b4da",
          "circle-radius": 4,
          "circle-stroke-width": 1,
          "circle-stroke-color": "#fff",
        },
      });
    }
  },
  { immediate: true }
);

const renderMap = () => {
  if (!mapRef.value) {
    return;
  }

  map.value = new mapboxgl.Map({
    container: mapRef.value,
    style: "mapbox://styles/mapbox/streets-v12",
    zoom: 3,
    testMode: true,
    // minZoom: 6,
    center: [3.729407, 51.065587],
    // overwrite default options
    ...props.options,
  });

  map.value?.once("load", () => {
    map.value?.resize();
    isMapLoading.value = false;
  });
};

onMounted(() => {
  mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_API_TOKEN;

  renderMap();
});

onUnmounted(() => {
  // destroy mapboxgl.Map instance
  map.value?.remove();
  map.value = null;
});
</script>

<template>
  <div class="map">
    <Transition name="fade">
      <div class="map__loader" v-show="isMapLoading">
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
