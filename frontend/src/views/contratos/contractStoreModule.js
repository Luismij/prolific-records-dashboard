import axios from '@axios'

export default {
    namespaced: true,
    state: {},
    getters: {},
    mutations: {},
    actions: {
        fetchAllContract(ctx, queryParams) {
            return new Promise((resolve, reject) => {
                axios
                    .get('/api/contract', { params: queryParams })
                    .then(response => resolve(response))
                    .catch(error => reject(error))
            })
        },
        async listAllArtists(ctx) {
            try {
                const response = await axios.get('/api/artist');
                return response.data
            }
            catch (error) {
                return Promise.reject();
            }
        },
        fetchContract(ctx, { id }) {
            return new Promise((resolve, reject) => {
                axios
                    .get(`/api/contract/get/${id}`)
                    .then(response => resolve(response))
                    .catch(error => reject(error))
            })
        },
        addContract(ctx, contractData) {
            let formData = new FormData();
            formData.append('artist', contractData.artist);
            formData.append('start_date', contractData.start_date);
            formData.append('end_date', contractData.end_date);
            formData.append('value', contractData.value);
            formData.append('notes', contractData.notes);
            formData.append('contract', contractData.contract);

            return new Promise((resolve, reject) => {
                axios
                    .post('/api/contract/create', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    })
                    .then(response => resolve(response))
                    .catch(error => reject(error))
            })
        },
        updateContract(ctx, contractData) {
            let formData = new FormData();
            formData.append('artist', contractData.artist);
            formData.append('start_date', contractData.start_date);
            formData.append('end_date', contractData.end_date);
            formData.append('value', contractData.value);
            formData.append('notes', contractData.notes);
            formData.append('contract', contractData.contract);

            return new Promise((resolve, reject) => {
                axios
                    .post(`/api/contract/update/${contractData.id}`, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    })
                    .then(response => resolve(response))
                    .catch(error => reject(error))
            })
        },
        deleteContract(ctx, id) {
            return new Promise((resolve, reject) => {
                axios
                    .post(`/api/contract/delete/${id}`)
                    .then(response => resolve(response))
                    .catch(error => reject(error))
            })
        },
    },
}
