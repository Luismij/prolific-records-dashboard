import axios from '@axios'

export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    fetchAllArtist(ctx, queryParams) {
      return new Promise((resolve, reject) => {
        axios
          .get('/api/artist', { params: queryParams })
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    fetchArtist(ctx, { id }) {
      return new Promise((resolve, reject) => {
        axios
          .get(`/api/artist/get/${id}`)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    addArtist(ctx, artistData) {
      let formData = new FormData();
      formData.append('name', artistData.name);
      formData.append('photo', artistData.photo);
      formData.append('description', artistData.description);
      formData.append('social_media', artistData.social_media);
      formData.append('birth_date', artistData.birth_date);
      formData.append('birth_place', artistData.birth_place);

      return new Promise((resolve, reject) => {
        axios
          .post('/api/artist/create', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    updateArtist(ctx, artistData) {
      let formData = new FormData();
      formData.append('name', artistData.name);
      formData.append('photo', artistData.photo);
      formData.append('description', artistData.description);
      formData.append('facebook', artistData.facebook);
      formData.append('instagram', artistData.instagram);
      formData.append('twitter', artistData.twitter);
      formData.append('youtube', artistData.youtube);
      formData.append('birth_date', artistData.birth_date);
      formData.append('birth_place', artistData.birth_place);

      return new Promise((resolve, reject) => {
        axios
          .post(`/api/artist/update/${artistData.id}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    deleteArtist(ctx, id) {
      return new Promise((resolve, reject) => {
        axios
          .post(`/api/artist/delete/${id}`)
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
