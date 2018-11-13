import axios from 'axios';

const baseUrl = 'http://localhost:3000/api/v1';

const login = async (email, password) => {
  return await axios.post(`${baseUrl}/user/login`, {
    email,
    password
  });
};

export default {
  login
};