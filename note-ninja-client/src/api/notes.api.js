import axios from 'axios';
import './apiConfig';

const instance = axios.create();
instance.interceptors.request.use(
  config => {
    config.headers.authorization = `bearer ${localStorage.getItem("jwtToken")}`;
    return config;
  },
  error => Promise.reject(error)
);

const get = async (id) => {
  return await instance.get(`/notes/${id}`);
};

const list = async () => {
  return await instance.get('/notes');
};

const update = async (id, title, body) => {
  return await instance.put(`/notes/${id}`, {
    title,
    body
  });
};

export default {
  get,
  list,
  update
};