<template>
  <div>
    <nuevo-contrato
      :is-add-new-contract-sidebar-active.sync="isAddNewContractSidebarActive"
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
                @click="isAddNewContractSidebarActive = true"
              >
                <span class="text-nowrap">Añadir contrato</span>
              </b-button>
            </div>
          </b-col>
        </b-row>
      </div>

      <b-table
        ref="refContractListTable"
        class="position-relative"
        :items="fetchAllContract"
        responsive
        :fields="tableColumns"
        primary-key="id"
        :sort-by.sync="sortBy"
        show-empty
        empty-text="No hay contratos registrados"
        :sort-desc.sync="isSortDirDesc"
      >
        <!-- Column: artist -->
        <template #cell(artist)="data">
          <b-media vertical-align="center" class="d-flex align-items-center">
            <template #aside>
              <b-avatar
                size="32"
                :src="data.item.artist.photo"
                :text="avatarText(data.item.artist.name)"
                variant="light-success"
              />
            </template>
            <div class="font-weight-bold d-block">
              {{ data.item.artist.name }}
            </div>
          </b-media>
        </template>

        <!-- Column: contrato -->
        <template #cell(contract)="data">
          <div>
            <b-link
              v-if="data.item.contract !== null"
              :href="data.item.contract"
              class="font-weight-bold"
              target="_blank"
            >
              <b-button variant="info" size="sm"> Ver contrato </b-button>
            </b-link>
            <b-badge v-else variant="light-secondary"> Sin documento </b-badge>
          </div>
        </template>

        <!-- Column: Actions -->
        <template #cell(actions)="data">
          <div class="d-flex flex-row justify-content-center">
            <b-button
              variant="outline-primary"
              class="btn-icon"
              size="sm"
              :to="{ name: 'contrato', params: { id: data.item.id } }"
            >
              <span class="align-middle">Editar</span>
            </b-button>
            <b-button
              variant="outline-danger"
              class="btn-icon"
              size="sm"
              @click="deleteContract(data.item.id)"
            >
              <span class="align-middle">Eliminar</span>
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
              :total-rows="totalContract"
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
  BDropdown,
  BDropdownItem,
  BPagination,
} from "bootstrap-vue";
import vSelect from "vue-select";
import store from "@/store";
import { ref, onUnmounted } from "@vue/composition-api";
import { avatarText } from "@core/utils/filter";
import useContractList from "./useContractList";
import contractStoreModule from "./contractStoreModule";
import NuevoContrato from "./NuevoContrato.vue";

export default {
  components: {
    NuevoContrato,

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
    BDropdown,
    BDropdownItem,
    BPagination,

    vSelect,
  },
  setup(props, { root }) {
    const USER_APP_STORE_MODULE_NAME = "contract";

    // Register module
    if (!store.hasModule(USER_APP_STORE_MODULE_NAME))
      store.registerModule(USER_APP_STORE_MODULE_NAME, contractStoreModule);

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(USER_APP_STORE_MODULE_NAME))
        store.unregisterModule(USER_APP_STORE_MODULE_NAME);
    });

    const deleteContract = (id) => {
      store.dispatch("contract/deleteContract", id).then(() => {
        root.$router.go();
      });
    };

    const isAddNewContractSidebarActive = ref(false);

    const {
      fetchAllContract,
      tableColumns,
      perPage,
      currentPage,
      totalContract,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refContractListTable,
      refetchData,
    } = useContractList();

    return {
      // Sidebar
      isAddNewContractSidebarActive,

      fetchAllContract,
      tableColumns,
      perPage,
      currentPage,
      totalContract,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refContractListTable,
      refetchData,

      deleteContract,

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

.btn-icon {
  margin: 2px;
}
</style>
