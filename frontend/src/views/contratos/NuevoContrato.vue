<template>
  <b-sidebar
    id="add-new-artist-sidebar"
    :visible="isAddNewContractSidebarActive"
    bg-variant="white"
    sidebar-class="sidebar-lg"
    shadow
    backdrop
    no-header
    right
    @hidden="resetForm"
    @change="(val) => $emit('update:is-add-new-contract-sidebar-active', val)"
  >
    <template #default="{ hide }">
      <!-- Header -->
      <div
        class="
          d-flex
          justify-content-between
          align-items-center
          content-sidebar-header
          px-2
          py-1
        "
      >
        <h5 class="mb-0">Añadir nuevo contrato</h5>

        <feather-icon
          class="ml-1 cursor-pointer"
          icon="XIcon"
          size="16"
          @click="hide"
        />
      </div>

      <!-- BODY -->
      <validation-observer #default="{ handleSubmit }" ref="refFormObserver">
        <!-- Form -->
        <b-form
          class="p-2"
          @submit.prevent="handleSubmit(onSubmit)"
          @reset.prevent="resetForm"
        >
          <!-- artista -->
          <validation-provider
            #default="validationContext"
            name="Artista"
            rules="required"
          >
            <b-form-group label="Artista" label-for="artista">
              <v-select
                v-model="contractData.artist"
                :options="allArtist"
                label="name"
                :reduce="(val) => val.id"
                :clearable="false"
                input-id="artista"
              />
              <b-form-invalid-feedback>
                {{ validationContext.errors[0] }}
              </b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>

          <!-- Fecha de inicio -->
          <validation-provider
            #default="validationContext"
            name="Fecha de inicio"
          >
            <b-form-group label="Fecha de inicio" label-for="fecha-inicio">
              <b-form-datepicker
                id="fecha-inicio"
                v-model="contractData.start_date"
                placeholder="Fecha de inicio"
                local="en"
              />

              <b-form-invalid-feedback>
                {{ validationContext.errors[0] }}
              </b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>

          <!-- Fecha de finaliacion -->
          <validation-provider
            #default="validationContext"
            name="Fecha de finalizacion"
          >
            <b-form-group label="Fecha de finalizacion" label-for="fecha-fin">
              <b-form-datepicker
                id="fecha-fin"
                v-model="contractData.end_date"
                placeholder="Fecha de finalizacion"
                local="en"
              />

              <b-form-invalid-feedback>
                {{ validationContext.errors[0] }}
              </b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>

          <!-- Valor -->

          <validation-provider #default="validationContext" name="Valor">
            <b-form-group label="Valor" label-for="valor">
              <b-form-input
                id="valor"
                v-model="contractData.value"
                :state="getValidationState(validationContext)"
                trim
              />
              <b-form-invalid-feedback>
                {{ validationContext.errors[0] }}
              </b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>

          <!-- notas -->
          <validation-provider #default="validationContext" name="Notas">
            <b-form-group label="Notas" label-for="notas">
              <b-form-textarea
                id="notas"
                v-model="contractData.notes"
                :state="getValidationState(validationContext)"
                trim
                rows="3"
              />
              <b-form-invalid-feedback>
                {{ validationContext.errors[0] }}
              </b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>

          <!-- contrato -->
          <validation-provider name="Contrato">
            <b-form-group label="Contrato" label-for="contrato">
              <b-form-file
                id="contrato"
                placeholder="Seleccione un contrato o arrastrelo..."
                drop-placeholder="Arrastre el contrato aqui..."
                v-model="contractData.contract"
                :state="Boolean(contractData.contract)"
                no-drop
              />
            </b-form-group>
          </validation-provider>

          <!-- Form Actions -->
          <div class="d-flex mt-2">
            <b-button
              v-ripple.400="'rgba(255, 255, 255, 0.15)'"
              variant="primary"
              class="mr-2"
              type="submit"
            >
              Añadir
            </b-button>
            <b-button
              v-ripple.400="'rgba(186, 191, 199, 0.15)'"
              type="button"
              variant="outline-secondary"
              @click="hide"
            >
              Cancelar
            </b-button>
          </div>
        </b-form>
      </validation-observer>
    </template>
  </b-sidebar>
</template>

<script>
import {
  BSidebar,
  BForm,
  BFormGroup,
  BFormInput,
  BFormInvalidFeedback,
  BButton,
  BFormTextarea,
  BFormFile,
  BFormDatepicker,
} from "bootstrap-vue";
import { ValidationProvider, ValidationObserver } from "vee-validate";
import { ref } from "@vue/composition-api";
import { required } from "@validations";
import formValidation from "@core/comp-functions/forms/form-validation";
import Ripple from "vue-ripple-directive";
import vSelect from "vue-select";
import store from "@/store";
import useContractList from "./useContractList";

export default {
  components: {
    BSidebar,
    BFormTextarea,
    BFormFile,
    BFormDatepicker,
    BForm,
    BFormGroup,
    BFormInput,
    BFormInvalidFeedback,
    BButton,
    vSelect,

    // Form Validation
    ValidationProvider,
    ValidationObserver,
  },
  directives: {
    Ripple,
  },
  model: {
    prop: "isAddNewContractSidebarActive",
    event: "update:is-add-new-contract-sidebar-active",
  },
  props: {
    isAddNewContractSidebarActive: {
      type: Boolean,
      required: true,
    },
  },
  mounted() {
    store.dispatch("contract/listAllArtists").then((res) => {
      this.allArtist = res.result.artist;
    });
  },
  data() {
    return {
      required,
      allArtist: [],
    };
  },
  setup(props, { emit }) {
    const blankContractData = {
      artist: "",
      start_date: "",
      end_date: "",
      value: "",
      notes: "",
      contract: null,
    };

    const contractData = ref(JSON.parse(JSON.stringify(blankContractData)));
    const resetcontractData = () => {
      contractData.value = JSON.parse(JSON.stringify(blankContractData));
    };

    const { data } = useContractList();

    const onSubmit = () => {
      store.dispatch("contract/addContract", contractData.value).then(() => {
        emit("refetch-data");
        emit("update:is-add-new-contract-sidebar-active", false);
      });
    };

    const { refFormObserver, getValidationState, resetForm } =
      formValidation(resetcontractData);

    return {
      contractData,
      onSubmit,

      refFormObserver,
      getValidationState,
      resetForm,
    };
  },
};
</script>

<style lang="scss">
@import "@core/scss/vue/libs/vue-select.scss";

#add-new-artist-sidebar {
  .vs__dropdown-menu {
    max-height: 200px !important;
  }
}
</style>
