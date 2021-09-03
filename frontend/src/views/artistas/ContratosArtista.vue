<template>
  <div>
    <!-- Media -->
    <b-media class="mb-2">
      <template #aside>
        <b-avatar
          ref="previewEl"
          :src="artist.photo"
          :text="avatarText(artist.name)"
          variant="light-success"
          size="90px"
          rounded
        />
      </template>
      <h4 class="mb-1">
        {{ artist.name }}
      </h4>
    </b-media>
    <b-row>
      <b-col>
        <b-table
          responsive
          :items="items"
          :fields="tableColumns"
          class="position-relative"
          show-empty
          empty-text="No hay contratos registrados"
        >
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
              <b-badge v-else variant="light-secondary">
                Sin documento
              </b-badge>
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
          <!-- Optional default data cell scoped slot -->
          <template #cell()="data">
            {{ data.value }}
          </template>
        </b-table>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import {
  BButton,
  BMedia,
  BAvatar,
  BRow,
  BCol,
  BTable,
  BLink,
  BBadge,
} from "bootstrap-vue";
import { avatarText } from "@core/utils/filter";
import { ref } from "@vue/composition-api";
import store from "@/store";

export default {
  components: {
    BButton,
    BMedia,
    BAvatar,
    BRow,
    BCol,
    BTable,
    BLink,
    BBadge,
  },
  props: {
    artist: {
      type: Object,
      required: true,
    },
  },
  setup(props, { root }) {
    const tableColumns = [
      { key: "start_date", label: "Fecha de inicio", sortable: true },
      { key: "end_date", label: "Fecha de finalizacion", sortable: true },
      { key: "value", label: "Valor" },
      { key: "notes", label: "Notas" },
      { key: "contract", label: "Contrato" },
      { key: "actions", label: "Operaciones" },
    ];
    const items = ref(JSON.parse(JSON.stringify(props.artist.contracts)));
    // ? Demo Purpose => photo
    const previewEl = ref(null);

    const deleteContract = (id) => {
      store.dispatch("artist/deleteContract", id).then(() => {
        root.$router.go();
      });
    };

    return {
      avatarText,
      previewEl,

      tableColumns,
      items,

      deleteContract,
    };
  },
};
</script>

<style lang="scss">
@import "@core/scss/vue/libs/vue-select.scss";

.btn-icon {
  margin: 2px;
}
</style>
