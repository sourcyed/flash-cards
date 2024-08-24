import axios from 'axios'
const baseUrl = 'api/auth/'

function auth(password) {
    const request = axios.get(baseUrl + password)
    return request.then(r => r.data)
}

export default { auth }