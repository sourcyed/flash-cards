import axios from 'axios'
const loginUrl = 'api/login/'

async function login(credentials) {
    const response = await axios.post(loginUrl, credentials)
    return response.data
}

export default { login }