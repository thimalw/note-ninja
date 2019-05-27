import axios from 'axios';
import './apiConfig';

const login = async (email, password) => {
  return await axios.post('/user/login', {
    email,
    password
  });
};

const signup = async (user) => {
  return await axios.post('/user', user);
};

export default {
  login,
  signup
};