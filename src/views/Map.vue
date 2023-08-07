<script setup lang="ts">
import { BaseMap } from "@/components";
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

      <BaseMap class="map" :data="gardens" />
    </ion-content>
  </ion-page>
</template>

<style scoped>
.map {
  width: 100%;
  height: 100%;
}
</style>
