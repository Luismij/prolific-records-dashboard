import { ref, watch, computed } from '@vue/composition-api'
import store from '@/store'

// Notification
import { useToast } from 'vue-toastification/composition'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

export default function useArtistList() {
  // Use toast
  const toast = useToast()

  const refArtistListTable = ref(null)

  // Table Handlers
  const tableColumns = [
    { key: 'name', label: 'Nombre', sortable: true },
    { key: 'description', label: 'Descripcion' },
    { key: 'social_media', label: 'Redes sociales' },
    { key: 'birth_date', label: 'Fecha de nacimiento', sortable: true },
    { key: 'birth_place', label: 'Lugar de nacimiento', sortable: true },
    { key: 'actions', label: 'Operaciones' },
  ]
  const perPage = ref(10)
  const totalArtist = ref(0)
  const currentPage = ref(1)
  const perPageOptions = [10, 25, 50, 100]
  const searchQuery = ref('')
  const sortBy = ref('id')
  const isSortDirDesc = ref(true)

  const dataMeta = computed(() => {
    const localItemsCount = refArtistListTable.value ? refArtistListTable.value.localItems.length : 0
    return {
      from: perPage.value * (currentPage.value - 1) + (localItemsCount ? 1 : 0),
      to: perPage.value * (currentPage.value - 1) + localItemsCount,
      of: totalArtist.value,
    }
  })

  const refetchData = () => {
    refArtistListTable.value.refresh()
  }

  watch([currentPage, perPage, searchQuery], () => {
    refetchData()
  })

  const fetchArtist = (ctx, callback) => {
    store
      .dispatch('artist/fetchAllArtist', {
        q: searchQuery.value,
        perPage: perPage.value,
        page: currentPage.value,
        sortBy: sortBy.value,
        sortDesc: isSortDirDesc.value,
      })
      .then(response => {
        const { artist } = response.data.result

        callback(artist)
        totalArtist.value = artist.length
      })
      .catch((err) => {
        toast({
          component: ToastificationContent,
          props: {
            title: 'Error fetching users list',
            icon: 'AlertTriangleIcon',
            variant: 'danger',
          },
        })
        console.log(err)
      })
  }

  // *===============================================---*
  // *--------- UI ---------------------------------------*
  // *===============================================---*


  return {
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
  }
}
