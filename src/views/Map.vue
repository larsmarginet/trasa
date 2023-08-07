<script setup lang="ts">
import { BaseMap } from "@/components";
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
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

      <BaseMap class="map" />

    </ion-content>
  </ion-page>
</template>

<style scoped>
.map {
  width: 100%;
  height: 100%;
}
</style>


