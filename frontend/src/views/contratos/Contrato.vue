<template>
  <component :is="contract === undefined ? 'div' : 'b-card'">
    <!-- Alert: No item found -->
    <b-alert variant="danger" :show="contract === undefined">
      <h4 class="alert-heading">Error obteniendo el contrato</h4>
      <div class="alert-body">
        Ningun contrato ha sido encontrado con el id. Verifica la
        <b-link class="alert-link" :to="{ name: 'contratos' }">
          lista de contratos
        </b-link>
        para ver otros.
      </div>
    </b-alert>

    <div v-if="contract">
      <!-- Contrato -->
      <editar-contrato :contract="contract" />
    </div>
  </component>
</template>

<script>
import { BTab, BTabs, BCard, BAlert, BLink } from "bootstrap-vue";
import { ref, onUnmounted } from "@vue/composition-api";
import router from "@/router";
import store from "@/store";
import contractStoreModule from "./contractStoreModule";
import EditarContrato from "./EditarContrato.vue";

export default {
  components: {
    BTab,
    BTabs,
    BCard,
    BAlert,
    BLink,

    EditarContrato,
  },
  setup() {
    const contract = ref(null);

    const USER_APP_STORE_MODULE_NAME = "contract";

    // Register module
    if (!store.hasModule(USER_APP_STORE_MODULE_NAME))
      store.registerModule(USER_APP_STORE_MODULE_NAME, contractStoreModule);

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(USER_APP_STORE_MODULE_NAME))
        store.unregisterModule(USER_APP_STORE_MODULE_NAME);
    });

    store
      .dispatch("contract/fetchContract", { id: router.currentRoute.params.id })
      .then((response) => {
        if (response.status === 200) {
          contract.value = response.data.result.contract;
        } else if (response.status === 204) {
          contract.value = undefined;
        }
      })
      .catch((error) => {
        console.log(error);
        if (error.response.status === 404) {
          contract.value = undefined;
        }
      });

    return {
      contract,
    };
  },
};
</script>

<style>
</style>
