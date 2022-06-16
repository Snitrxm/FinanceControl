import axios from 'axios'
const Api = axios.create({baseURL: 'https://finances-backend-app.herokuapp.com/'});
export default Api;