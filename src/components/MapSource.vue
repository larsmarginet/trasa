<script setup lang="ts">
import { onMounted, watch, unref } from "vue";
import { useMap } from "../hooks";

const props = defineProps<{
  id: string;
  options?: any;
}>();

const { map } = useMap();

watch(
  () => props.options.data,
  (newData) => {
    const source = unref(map)?.getSource(props.id);

    if (!(source && source.type === "geojson")) {
      return;
    }

    // when the data from props updates, reset the data for the source
    source.setData(newData);
  }
);

onMounted(() => {
  unref(map)?.addSource(props.id, props.options);
});
</script>

<template>
  <div :id="id" />

  <p>hello world</p>
</template>
