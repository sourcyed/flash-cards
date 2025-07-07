import axios from 'axios'
const loginUrl = 'api/login/'

async function login(credentials) {
    const response = await axios.post(loginUrl, credentials)
    return response.data
}

async function verify(token) {
  if (!token || typeof token !== 'string') {
    return false;
  }

  const response = await axios.get(`${loginUrl}verify`, {
    headers: { Authorization: `Bearer ${token}` },
    validateStatus: () => true
  });
  return response.status === 200;
}

export default { login, verify }