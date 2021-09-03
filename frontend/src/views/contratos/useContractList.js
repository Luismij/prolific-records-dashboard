import { ref, watch, computed } from '@vue/composition-api'
import store from '@/store'

// Notification
import { useToast } from 'vue-toastification/composition'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

export default function useContractList() {
  // Use toast
  const toast = useToast()

  const refContractListTable = ref(null)

  // Table Handlers
  const tableColumns = [
    { key: 'artist', label: 'Artista', sortable: true },
    { key: 'start_date', label: 'Fecha de inicio', sortable: true },
    { key: 'end_date', label: 'Fecha de finalizacion', sortable: true },
    { key: 'value', label: 'Valor' },
    { key: 'notes', label: 'Notas' },
    { key: 'contract', label: 'Contrato' },
    { key: 'actions', label: 'Operaciones' },
  ]
  const perPage = ref(10)
  const totalContract = ref(0)
  const currentPage = ref(1)
  const perPageOptions = [10, 25, 50, 100]
  const searchQuery = ref('')
  const sortBy = ref('id')
  const isSortDirDesc = ref(true)

  const dataMeta = computed(() => {
    const localItemsCount = refContractListTable.value ? refContractListTable.value.localItems.length : 0
    return {
      from: perPage.value * (currentPage.value - 1) + (localItemsCount ? 1 : 0),
      to: perPage.value * (currentPage.value - 1) + localItemsCount,
      of: totalContract.value,
    }
  })

  const refetchData = () => {
    refContractListTable.value.refresh()
  }

  watch([currentPage, perPage, searchQuery], () => {
    refetchData()
  })

  const fetchAllContract = (ctx, callback) => {
    store
      .dispatch('contract/fetchAllContract', {
        q: searchQuery.value,
        perPage: perPage.value,
        page: currentPage.value,
        sortBy: sortBy.value,
        sortDesc: isSortDirDesc.value,
      })
      .then(response => {
        const { contract } = response.data.result

        callback(contract)
        totalContract.value = contract.length
      })
      .catch((err) => {
        toast({
          component: ToastificationContent,
          props: {
            title: 'Error fetching contract list',
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
  }
}
