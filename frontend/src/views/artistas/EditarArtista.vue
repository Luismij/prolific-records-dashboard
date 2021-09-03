<template>
  <div>
    <!-- Media -->
    <b-media class="mb-2">
      <template #aside>
        <b-avatar
          ref="previewEl"
          :src="artist.photo"
          :text="avatarText(artistData.name)"
          variant="light-success"
          size="90px"
          rounded
        />
      </template>
      <h4 class="mb-1">
        {{ artistData.fullName }}
      </h4>
      <div class="d-flex flex-wrap">
        <b-button variant="primary" @click="$refs.refInputEl.click()">
          <input
            ref="refInputEl"
            type="file"
            class="d-none"
            v-on:change="onFileChange"
            @input="inputImageRenderer"
          />
          <span class="d-none d-sm-inline">Cambiar</span>
          <feather-icon icon="EditIcon" class="d-inline d-sm-none" />
        </b-button>
      </div>
    </b-media>
    <validation-observer #default="{ handleSubmit }" ref="refFormObserver">
      <!-- User Info: Input Fields -->
      <b-form
        @submit.prevent="handleSubmit(onSubmit)"
        @reset.prevent="resetForm"
      >
        <b-row>
          <b-col cols="12" md="12">
            <!-- descripcion -->
            <validation-provider
              #default="validationContext"
              name="Descripcion"
              rules="required"
            >
              <b-form-group label="Descripcion" label-for="descripcion">
                <b-form-textarea
                  id="descripcion"
                  v-model="artistData.description"
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
            <!-- nombre -->
            <validation-provider
              #default="validationContext"
              name="Nombre completo"
              rules="required"
            >
              <b-form-group label="Nombre completo" label-for="nombre-completo">
                <b-form-input
                  id="nombre-completo"
                  v-model="artistData.name"
                  autofocus
                  :state="getValidationState(validationContext)"
                  trim
                  placeholder="Shakira Isabel Mebarak Ripoll"
                />

                <b-form-invalid-feedback>
                  {{ validationContext.errors[0] }}
                </b-form-invalid-feedback>
              </b-form-group>
            </validation-provider>
          </b-col>

          <b-col cols="12" md="4">
            <!-- Fecha de nacimiento -->
            <validation-provider
              #default="validationContext"
              name="Fecha de nacimiento"
            >
              <b-form-group
                label="Fecha de nacimiento"
                label-for="fecha-nacimiento"
              >
                <b-form-datepicker
                  id="fecha-nacimiento"
                  v-model="artistData.birth_date"
                  placeholder="Fecha de nacimiento"
                  local="en"
                />

                <b-form-invalid-feedback>
                  {{ validationContext.errors[0] }}
                </b-form-invalid-feedback>
              </b-form-group>
            </validation-provider>
          </b-col>

          <b-col cols="12" md="4">
            <!-- Lugar de nacimiento -->
            <validation-provider
              #default="validationContext"
              name="Lugar de nacimiento"
            >
              <b-form-group
                label="Lugar de nacimiento"
                label-for="lugar-nacimiento"
              >
                <b-form-input
                  id="lugar-nacimiento"
                  v-model="artistData.birth_place"
                  autofocus
                  :state="getValidationState(validationContext)"
                  trim
                />

                <b-form-invalid-feedback>
                  {{ validationContext.errors[0] }}
                </b-form-invalid-feedback>
              </b-form-group>
            </validation-provider>
          </b-col>
          <b-col cols="12" md="6">
            <!-- Facebook -->
            <b-form-group label="Facebook" label-for="facebook">
              <b-input-group class="input-group-merge">
                <b-input-group-prepend is-text>
                  <feather-icon size="16" icon="FacebookIcon" />
                </b-input-group-prepend>
                <b-form-input
                  id="facebook"
                  v-model="artistData.facebook"
                  type="url"
                />
              </b-input-group>
            </b-form-group>
          </b-col>
          <b-col cols="12" md="6">
            <!-- Instagram -->
            <b-form-group label="Instagram" label-for="instagram">
              <b-input-group class="input-group-merge">
                <b-input-group-prepend is-text>
                  <feather-icon size="16" icon="InstagramIcon" />
                </b-input-group-prepend>
                <b-form-input
                  id="instagram"
                  v-model="artistData.instagram"
                  type="url"
                />
              </b-input-group>
            </b-form-group>
          </b-col>
          <b-col cols="12" md="6">
            <!-- Twitter -->
            <b-form-group label="Twitter" label-for="twitter">
              <b-input-group class="input-group-merge">
                <b-input-group-prepend is-text>
                  <feather-icon size="16" icon="TwitterIcon" />
                </b-input-group-prepend>
                <b-form-input
                  id="twitter"
                  v-model="artistData.twitter"
                  type="url"
                />
              </b-input-group>
            </b-form-group>
          </b-col>
          <b-col cols="12" md="6">
            <!-- Youtube -->
            <b-form-group label="Youtube" label-for="youtube">
              <b-input-group class="input-group-merge">
                <b-input-group-prepend is-text>
                  <feather-icon size="16" icon="YoutubeIcon" />
                </b-input-group-prepend>
                <b-form-input
                  id="youtube"
                  v-model="artistData.youtube"
                  type="url"
                />
              </b-input-group>
            </b-form-group>
          </b-col>
        </b-row>
        <!-- Action Buttons -->
        <b-button
          variant="primary"
          type="submit"
          class="mb-1 mb-sm-0 mr-0 mr-sm-1"
          :block="$store.getters['app/currentBreakPoint'] === 'xs'"
        >
          Guardar
        </b-button>
        <b-button
          variant="outline-secondary"
          type="reset"
          :block="$store.getters['app/currentBreakPoint'] === 'xs'"
        >
          Reiniciar
        </b-button>
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
  BForm,
  BTable,
  BCard,
  BCardHeader,
  BCardTitle,
  BFormCheckbox,
  BFormTextarea,
  BFormInvalidFeedback,
  BFormDatepicker,
  BInputGroup,
  BInputGroupPrepend,
} from "bootstrap-vue";
import { avatarText } from "@core/utils/filter";
import { useInputImageRenderer } from "@core/comp-functions/forms/form-utils";
import { ref } from "@vue/composition-api";
import { ValidationProvider, ValidationObserver } from "vee-validate";
import formValidation from "@core/comp-functions/forms/form-validation";
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
    BFormInput,
    BForm,
    BTable,
    BCard,
    BCardHeader,
    BCardTitle,
    BFormCheckbox,
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
    artist: {
      type: Object,
      required: true,
    },
  },
  methods: {
    onFileChange(e) {
      var files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      this.artistData.photo = files[0];
    },
  },
  setup(props, { root }) {
    const blankArtistData = {
      id: props.artist.id,
      photo: null,
      name: props.artist.name,
      description: props.artist.description,
      facebook: props.artist.facebook !== null ? props.artist.facebook : "",
      instagram: props.artist.instagram !== null ? props.artist.instagram : "",
      twitter: props.artist.twitter !== null ? props.artist.twitter : "",
      youtube: props.artist.youtube !== null ? props.artist.youtube : "",
      birth_date:
        props.artist.birth_date !== null ? props.artist.birth_date : "",
      birth_place:
        props.artist.birth_place !== null ? props.artist.birth_place : "",
    };

    const artistData = ref(JSON.parse(JSON.stringify(blankArtistData)));
    const resetartistData = () => {
      artistData.value = JSON.parse(JSON.stringify(blankArtistData));
    };

    const { refFormObserver, getValidationState, resetForm } =
      formValidation(resetartistData);

    const onSubmit = () => {
      store.dispatch("artist/updateArtist", artistData.value).then(() => {
        root.$router.go();
      });
    };

    // ? Demo Purpose => Update image on click of update
    const refInputEl = ref(null);
    const previewEl = ref(null);

    const { inputImageRenderer } = useInputImageRenderer(
      refInputEl,
      (base64) => {
        // eslint-disable-next-line no-param-reassign
        props.artist.photo = base64;
      }
    );

    return {
      avatarText,
      artistData,
      onSubmit,

      refFormObserver,
      getValidationState,
      resetForm,

      //  ? Demo - Update Image on click of update button
      refInputEl,
      previewEl,
      inputImageRenderer,
    };
  },
};
</script>

<style lang="scss">
@import "@core/scss/vue/libs/vue-select.scss";
</style>
