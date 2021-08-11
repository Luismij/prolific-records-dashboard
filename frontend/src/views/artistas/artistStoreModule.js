import axios from '@axios'

export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    fetchArtist(ctx, queryParams) {
      return new Promise((resolve, reject) => {
        axios
          .get('/api/artist', { params: queryParams })
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    fetchUser(ctx, { id }) {
      return new Promise((resolve, reject) => {
        axios
          .get(`/apps/user/users/${id}`)
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
          }})
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
  },
}
