<script setup lang="ts">
import { onMounted, onUnmounted, computed, unref } from "vue";
import { useMap } from "../hooks";

const props = defineProps<{
  id: string;
  options?: any;
  beforeId?: string;
}>();

const { map } = useMap();

const options = computed(() => {
  const opts = { ...props.options, id: props.id };

  if (opts.paint === null || opts.paint === undefined) {
    delete opts.paint;
  }

  if (opts.layout === null || opts.layout === undefined) {
    delete opts.layout;
  }

  return opts;
});

const removeLayer = () => {
  if (!unref(map)?.getLayer(props.id)) {
    return;
  }

  unref(map)?.removeLayer(props.id);
};

const removeSource = () => {
  if (!unref(map)?.getSource(props.id)) {
    return;
  }

  unref(map)?.removeSource(props.id);
};

onMounted(() => {
  removeLayer();
  removeSource();

  unref(map)?.addLayer(unref(options), props.beforeId);
});

onUnmounted(() => {
  removeLayer();
  removeSource();
});
</script>

<template>
  <div :id="id" />
</template>
