<template>
  <b-sidebar
    id="add-new-artist-sidebar"
    :visible="isAddNewArtistSidebarActive"
    bg-variant="white"
    sidebar-class="sidebar-lg"
    shadow
    backdrop
    no-header
    right
    @hidden="resetForm"
    @change="(val) => $emit('update:is-add-new-artist-sidebar-active', val)"
  >
    <template #default="{ hide }">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1">
        <h5 class="mb-0">
          Añadir nuevo artista
        </h5>

        <feather-icon
          class="ml-1 cursor-pointer"
          icon="XIcon"
          size="16"
          @click="hide"
        />

      </div>

      <!-- BODY -->
      <validation-observer
        #default="{ handleSubmit }"
        ref="refFormObserver"
      >
        <!-- Form -->
        <b-form
          class="p-2"
          @submit.prevent="handleSubmit(onSubmit)"
          @reset.prevent="resetForm"
        >

          <!-- nombre -->
          <validation-provider
            #default="validationContext"
            name="Nombre completo"
            rules="required"
          >
            <b-form-group
              label="Nombre completo"
              label-for="nombre-completo"
            >
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

          <!-- descripcion -->
          <validation-provider
            #default="validationContext"
            name="Descripcion"
            rules="required|alpha-num"
          >
            <b-form-group
              label="Descripcion"
              label-for="descripcion"
            >
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

          <!-- foto -->
          <validation-provider
            name="Foto"
          >
            <b-form-group
              label="Foto"
              label-for="foto"
            >
              <b-form-file
                id="foto"
                placeholder="Seleccione una foto o arrastrela..."
                drop-placeholder="Arrastre la foto aqui..."
                v-model="artistData.photo"
                :state="Boolean(artistData.photo)"
                no-drop
              />
            </b-form-group>
          </validation-provider>

          <!-- Redes sociales -->
          <validation-provider
            #default="validationContext"
            name="Redes sociales"
          >
            <b-form-group
              label="Redes sociales"
              label-for="redes-sociales"
            >
              <b-form-textarea
                id="redes-sociales"
                v-model="artistData.social_media"
                :state="getValidationState(validationContext)"
                trim
                rows="3"
              />

              <b-form-invalid-feedback>
                {{ validationContext.errors[0] }}
              </b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>

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
  BSidebar, BForm, BFormGroup, BFormInput, BFormInvalidFeedback, BButton, BFormTextarea, BFormFile, BFormDatepicker
} from 'bootstrap-vue'
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import { ref } from '@vue/composition-api'
import { required } from '@validations'
import formValidation from '@core/comp-functions/forms/form-validation'
import Ripple from 'vue-ripple-directive'
import vSelect from 'vue-select'
import store from '@/store'

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
    prop: 'isAddNewArtistSidebarActive',
    event: 'update:is-add-new-artist-sidebar-active',
  },
  props: {
    isAddNewArtistSidebarActive: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      required,
    }
  },
  setup(props, { emit }) {
    const blankArtistData = {
      name: '',
      photo: null,
      description: '',
      social_media: '',
      birth_date: '',
      birth_place: '',
    }

    const artistData = ref(JSON.parse(JSON.stringify(blankArtistData)))
    const resetartistData = () => {
      artistData.value = JSON.parse(JSON.stringify(blankArtistData))
    }

    const onSubmit = () => {
      store.dispatch('artist/addArtist', artistData.value)
        .then(() => {
          emit('refetch-data')
          emit('update:is-add-new-artist-sidebar-active', false)
        })
    }

    const {
      refFormObserver,
      getValidationState,
      resetForm,
    } = formValidation(resetartistData)

    return {
      artistData,
      onSubmit,

      refFormObserver,
      getValidationState,
      resetForm,
    }
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';

#add-new-artist-sidebar {
  .vs__dropdown-menu {
    max-height: 200px !important;
  }
}
</style>
