<template>
  <component :is="artistData === undefined ? 'div' : 'b-card'">
    <!-- Alert: No item found -->
    <b-alert variant="danger" :show="artistData === undefined">
      <h4 class="alert-heading">Error obteniendo la informacion del artista</h4>
      <div class="alert-body">
        Ningun artista ha sido encontrado con este id. Verifica la
        <b-link class="alert-link" :to="{ name: 'artistas' }">
          lista de artistas
        </b-link>
        para encontrar mas.
      </div>
    </b-alert>

    <b-tabs v-if="artistData" pills>
      <!-- Tab: artista -->
      <b-tab active>
        <template #title>
          <feather-icon icon="UserIcon" size="16" class="mr-0 mr-sm-50" />
          <span class="d-none d-sm-inline">Artista</span>
        </template>
        <artist-edit :artist="artistData" class="mt-2 pt-75" />
      </b-tab>

      <!-- Tab: contratos -->
      <b-tab>
        <template #title>
          <feather-icon icon="FileIcon" size="16" class="mr-0 mr-sm-50" />
          <span class="d-none d-sm-inline">Contratos</span>
        </template>
        <artist-contract :artist="artistData" class="mt-2 pt-75" />
      </b-tab>
    </b-tabs>
  </component>
</template>

<script>
import { BTab, BTabs, BCard, BAlert, BLink } from "bootstrap-vue";
import { ref, onUnmounted } from "@vue/composition-api";
import router from "@/router";
import store from "@/store";
import artistStoreModule from "./artistStoreModule";
import ArtistEdit from "./EditarArtista.vue";
import ArtistContract from "./ContratosArtista.vue";

export default {
  components: {
    BTab,
    BTabs,
    BCard,
    BAlert,
    BLink,

    ArtistEdit,
    ArtistContract,
  },
  setup() {
    const artistData = ref(null);

    const USER_APP_STORE_MODULE_NAME = "artist";

    // Register module
    if (!store.hasModule(USER_APP_STORE_MODULE_NAME))
      store.registerModule(USER_APP_STORE_MODULE_NAME, artistStoreModule);

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(USER_APP_STORE_MODULE_NAME))
        store.unregisterModule(USER_APP_STORE_MODULE_NAME);
    });

    store
      .dispatch("artist/fetchArtist", { id: router.currentRoute.params.id })
      .then((response) => {
        if (response.status === 200) {
          artistData.value = response.data.result.artist;
        } else if (response.status === 402) {
          artistData.value = undefined;
        } else {
          artistData.value = undefined;
        }
      })
      .catch((error) => {
        if (error.response.status === 404) {
          artistData.value = undefined;
        }
      });

    return {
      artistData,
    };
  },
};
</script>

<style>
</style>
