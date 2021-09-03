<template>
  <div>
    <nuevo-artista
      :is-add-new-artist-sidebar-active.sync="isAddNewArtistSidebarActive"
      @refetch-data="refetchData"
    />

    <!-- Table Container Card -->
    <b-card no-body class="mb-0">
      <div class="m-2">
        <!-- Table Top -->
        <b-row>
          <!-- Per Page -->
          <b-col
            cols="12"
            md="6"
            class="d-flex align-items-center justify-content-start mb-1 mb-md-0"
          >
            <label>Mostrar</label>
            <v-select
              v-model="perPage"
              :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
              :options="perPageOptions"
              :clearable="false"
              class="per-page-selector d-inline-block mx-50"
            />
            <label>por pagina</label>
          </b-col>

          <!-- Search -->
          <b-col cols="12" md="6">
            <div class="d-flex align-items-center justify-content-end">
              <b-form-input
                v-model="searchQuery"
                class="d-inline-block mr-1"
                placeholder="Buscar..."
              />
              <b-button
                variant="primary"
                @click="isAddNewArtistSidebarActive = true"
              >
                <span class="text-nowrap">Añadir artista</span>
              </b-button>
            </div>
          </b-col>
        </b-row>
      </div>

      <b-table
        ref="refArtistListTable"
        class="position-relative"
        :items="fetchArtist"
        responsive
        :fields="tableColumns"
        primary-key="id"
        :sort-by.sync="sortBy"
        show-empty
        empty-text="No hay artistas registrados"
        :sort-desc.sync="isSortDirDesc"
      >
        <!-- Column: Artist -->
        <template #cell(name)="data">
          <b-media vertical-align="center">
            <template #aside>
              <b-avatar
                size="32"
                :src="data.item.photo"
                :text="avatarText(data.item.name)"
                variant="light-success"
              />
            </template>
            <div class="font-weight-bold d-block">
              {{ data.item.name }}
            </div>
          </b-media>
        </template>

        <!-- Column: Social Media -->
        <template #cell(social_media)="data">
          <div class="d-flex">
            <b-link
              :href="data.item.facebook"
              target="_blank"
              v-if="data.item.facebook"
            >
              <b-button variant="outline-primary" class="btn-icon mr-25">
                <feather-icon icon="FacebookIcon" />
              </b-button>
            </b-link>
            <b-link
              :href="data.item.instagram"
              target="_blank"
              v-if="data.item.instagram"
            >
              <b-button variant="outline-warning" class="btn-icon mr-25">
                <feather-icon icon="InstagramIcon" />
              </b-button>
            </b-link>
            <b-link
              :href="data.item.twitter"
              target="_blank"
              v-if="data.item.twitter"
            >
              <b-button variant="outline-info" class="btn-icon mr-25">
                <feather-icon icon="TwitterIcon" />
              </b-button>
            </b-link>
            <b-link
              :href="data.item.youtube"
              target="_blank"
              v-if="data.item.youtube"
            >
              <b-button variant="outline-danger" class="btn-icon">
                <feather-icon icon="YoutubeIcon" />
              </b-button>
            </b-link>
          </div>
        </template>

        <!-- Column: Actions -->
        <template #cell(actions)="data">
          <div class="d-flex">
            <b-button
              variant="outline-primary"
              size="sm"
              :to="{ name: 'artista', params: { id: data.item.id } }"
              class="mr-25 text-nowrap"
            >
              Ver mas
            </b-button>
            <b-button
              variant="outline-danger"
              size="sm"
              @click="deleteArtist(data.item.id)"
            >
              Borrar
            </b-button>
          </div>
        </template>
      </b-table>
      <div class="mx-2 mb-2">
        <b-row>
          <b-col
            cols="12"
            sm="6"
            class="
              d-flex
              align-items-center
              justify-content-center justify-content-sm-start
            "
          >
            <span class="text-muted"
              >Mostrando desde {{ dataMeta.from }} hasta {{ dataMeta.to }} de
              {{ dataMeta.of }} registros</span
            >
          </b-col>
          <!-- Pagination -->
          <b-col
            cols="12"
            sm="6"
            class="
              d-flex
              align-items-center
              justify-content-center justify-content-sm-end
            "
          >
            <b-pagination
              v-model="currentPage"
              :total-rows="totalArtist"
              :per-page="perPage"
              first-number
              last-number
              class="mb-0 mt-1 mt-sm-0"
              prev-class="prev-item"
              next-class="next-item"
            >
              <template #prev-text>
                <feather-icon icon="ChevronLeftIcon" size="18" />
              </template>
              <template #next-text>
                <feather-icon icon="ChevronRightIcon" size="18" />
              </template>
            </b-pagination>
          </b-col>
        </b-row>
      </div>
    </b-card>
  </div>
</template>

<script>
import {
  BCard,
  BRow,
  BCol,
  BFormInput,
  BButton,
  BTable,
  BMedia,
  BAvatar,
  BLink,
  BBadge,
  BPagination,
} from "bootstrap-vue";
import vSelect from "vue-select";
import store from "@/store";
import { ref, onUnmounted } from "@vue/composition-api";
import { avatarText } from "@core/utils/filter";
import useArtistList from "./useArtistList";
import artistStoreModule from "./artistStoreModule";
import NuevoArtista from "./NuevoArtista.vue";

export default {
  components: {
    NuevoArtista,

    BCard,
    BRow,
    BCol,
    BFormInput,
    BButton,
    BTable,
    BMedia,
    BAvatar,
    BLink,
    BBadge,
    BPagination,

    vSelect,
  },
  setup(props, { root }) {
    const USER_APP_STORE_MODULE_NAME = "artist";

    // Register module
    if (!store.hasModule(USER_APP_STORE_MODULE_NAME))
      store.registerModule(USER_APP_STORE_MODULE_NAME, artistStoreModule);

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(USER_APP_STORE_MODULE_NAME))
        store.unregisterModule(USER_APP_STORE_MODULE_NAME);
    });

    const deleteArtist = (id) => {
      store.dispatch("artist/deleteArtist", id).then(() => {
        root.$router.go();
      });
    };

    const isAddNewArtistSidebarActive = ref(false);

    const {
      fetchArtist,
      tableColumns,
      perPage,
      currentPage,
      totalArtist,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refArtistListTable,
      refetchData,
    } = useArtistList();

    return {
      // Sidebar
      isAddNewArtistSidebarActive,

      fetchArtist,
      tableColumns,
      perPage,
      currentPage,
      totalArtist,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refArtistListTable,
      refetchData,

      deleteArtist,

      // Filter
      avatarText,
    };
  },
};
</script>

<style lang="scss" scoped>
.per-page-selector {
  width: 90px;
}
</style>

<style lang="scss">
@import "@core/scss/vue/libs/vue-select.scss";
</style>
