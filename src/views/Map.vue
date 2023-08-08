<script setup lang="ts">
import { BaseMap, MapLayer, MapSource } from "@/components";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
} from "@ionic/vue";
import { onMounted, ref } from "vue";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

const FIREBASE_CONFIG = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DB_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(FIREBASE_CONFIG);
const db = getFirestore(app);

const gardens = ref<any>({});

const getAllListedGardens = async () => {
  const q = query(collection(db, "campsites"), where("listed", "==", true));

  const querySnapshot = await getDocs(q);

  gardens.value = {
    type: "FeatureCollection",
    features: querySnapshot.docs.map((doc) => ({
      type: "Feature",
      properties: {
        id: doc.id,
      },
      geometry: {
        type: "Point",
        coordinates: [
          doc.data().location.longitude,
          doc.data().location.latitude,
        ],
      },
    })),
  };
};

onMounted(async () => {
  await getAllListedGardens();
});
</script>

<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Map</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Map</ion-title>
        </ion-toolbar>
      </ion-header>

      <BaseMap class="map">
        <MapSource
          id="gardens"
          :options="{
            type: 'geojson',
            data: gardens,
            cluster: true,
            clusterMaxZoom: 14,
            clusterRadius: 50,
          }"
        />

        <MapLayer
          id="clusters"
          :options="{
            type: 'circle',
            source: 'gardens',
            filter: ['has', 'point_count'],
            paint: {
              'circle-color': [
                'step',
                ['get', 'point_count'],
                '#51bbd6',
                100,
                '#f1f075',
                750,
                '#f28cb1',
              ],
              'circle-radius': [
                'step',
                ['get', 'point_count'],
                20,
                100,
                30,
                750,
                40,
              ],
            },
          }"
        />

        <MapLayer
          id="cluster-count"
          :options="{
            type: 'symbol',
            source: 'gardens',
            filter: ['has', 'point_count'],
            layout: {
              'text-field': ['get', 'point_count_abbreviated'],
              'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
              'text-size': 12,
            },
          }"
        />

        <MapLayer
          id="cunclustered-point"
          :options="{
            type: 'circle',
            source: 'gardens',
            filter: ['!', ['has', 'point_count']],
            paint: {
              'circle-color': '#11b4da',
              'circle-radius': 4,
              'circle-stroke-width': 1,
              'circle-stroke-color': '#fff',
            },
          }"
        />
      </BaseMap>
    </ion-content>
  </ion-page>
</template>

<style scoped>
.map {
  width: 100%;
  height: 100%;
}
</style>
