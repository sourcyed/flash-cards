import axios from 'axios'
const baseUrl = 'api/auth/'

async function auth(credentials) {
    const response = await axios.post(baseUrl, credentials)
    return response.data
}

export default { auth }