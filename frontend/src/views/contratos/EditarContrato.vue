<template>
  <div>
    <!-- Media -->
    <b-media class="mb-2">
      <template #aside>
        <b-avatar
          ref="previewEl"
          :src="contract.artist.photo"
          :text="avatarText(contract.artist.name)"
          variant="light-success"
          size="90px"
          rounded
        />
      </template>
      <h4 class="mb-1">
        {{ contract.artist.name }}
      </h4>
    </b-media>

    <!-- Contract Info: Input Fields -->
    <validation-observer #default="{ handleSubmit }" ref="refFormObserver">
      <b-form
        @submit.prevent="handleSubmit(onSubmit)"
        @reset.prevent="resetForm"
      >
        <b-row>
          <!-- Descripcion -->
          <b-col cols="12" md="12">
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
          </b-col>
          <b-col cols="12" md="4">
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
          </b-col>
          <b-col cols="12" md="4">
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
          </b-col>
          <!-- Valor-->
          <b-col cols="12" md="4">
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
          </b-col>
          <!-- Contrato -->
          <b-col cols="12" md="12">
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
          </b-col>

          <!-- Action Buttons -->
          <b-col cols="12" md="12">
            <b-button
              variant="primary"
              type="submit"
              class="mb-1 mb-sm-0 mr-0 mr-sm-1"
              :block="$store.getters['app/currentBreakPoint'] === 'xs'"
            >
              Guardar cambios
            </b-button>
            <b-button
              variant="outline-secondary"
              type="reset"
              @click="resetForm"
              :block="$store.getters['app/currentBreakPoint'] === 'xs'"
            >
              Resetear
            </b-button>
          </b-col>

          <b-col cols="12" md="12" class="mt-1 mb-1">
            <b>Contrato actual</b>
            <iframe
              :src="contract.contract"
              style="width: 100%; height: 600px; border: none"
            >
              Oops! an error has occurred.
            </iframe>
          </b-col>
        </b-row>
      </b-form>
    </validation-observer>
  </div>
</template>

<script>
import {
  BButton,
  BMedia,
  BAvatar,
  BRow,
  BCol,
  BFormGroup,
  BFormInput,
  BFormTextarea,
  BForm,
  BFormInvalidFeedback,
  BFormDatepicker,
  BInputGroup,
  BInputGroupPrepend,
  BFormFile,
} from "bootstrap-vue";
import { ValidationProvider, ValidationObserver } from "vee-validate";
import formValidation from "@core/comp-functions/forms/form-validation";
import { avatarText } from "@core/utils/filter";
import { ref } from "@vue/composition-api";
import { required } from "@validations";
import store from "@/store";

export default {
  components: {
    BButton,
    BMedia,
    BAvatar,
    BRow,
    BCol,
    BFormGroup,
    BFormFile,
    BFormInput,
    BForm,
    BInputGroup,
    BInputGroupPrepend,
    BFormDatepicker,
    BFormTextarea,
    BFormInvalidFeedback,

    // Form Validation
    ValidationProvider,
    ValidationObserver,
    required,
  },
  props: {
    contract: {
      type: Object,
      required: true,
    },
  },
  setup(props, { root }) {
    const blankContractData = {
      id: props.contract.id,
      start_date: props.contract.start_date,
      end_date: props.contract.end_date !== null ? props.contract.end_date : "",
      value: props.contract.value !== null ? props.contract.value : "",
      notes: props.contract.notes !== null ? props.contract.notes : "",
      contract: null,
    };

    const contractData = ref(JSON.parse(JSON.stringify(blankContractData)));
    const resetcontractData = () => {
      contractData.value = JSON.parse(JSON.stringify(blankContractData));
    };

    const { refFormObserver, getValidationState, resetForm } =
      formValidation(resetcontractData);

    // ? Demo Purpose => Update image on click of update
    const previewEl = ref(null);

    const onSubmit = () => {
      store.dispatch("contract/updateContract", contractData.value).then(() => {
        root.$router.go();
      });
    };

    return {
      avatarText,
      contractData,
      onSubmit,

      refFormObserver,
      getValidationState,
      resetForm,

      //  ? Demo - Update Image on click of update button
      previewEl,
    };
  },
};
</script>

<style lang="scss">
@import "@core/scss/vue/libs/vue-select.scss";
</style>
