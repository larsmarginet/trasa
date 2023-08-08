import { Map } from "mapbox-gl";
import { inject } from "vue";

export function useMap() {
  const map: Map | undefined = inject("mapbox-map");

  return {
    map,
  };
}
