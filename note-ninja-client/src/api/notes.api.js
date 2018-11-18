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

const add = async (note) => {
  return await instance.post('/notes', note);
};

const get = async (id) => {
  return await instance.get(`/notes/${id}`);
};

const list = async () => {
  return await instance.get('/notes');
};

const update = async (id, note) => {
  return await instance.put(`/notes/${id}`, note);
};

const remove = async (id) => {
  return await instance.delete(`/notes/${id}`);
};

export default {
  add,
  get,
  list,
  update,
  remove
};