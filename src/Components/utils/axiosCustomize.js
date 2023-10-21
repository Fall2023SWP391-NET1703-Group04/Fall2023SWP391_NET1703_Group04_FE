import axios from "axios";
const instance = axios.create({
  baseURL: "http://localhost:8080/",
});

// Add a request interceptor
instance.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

//interceptor : middleware
instance.interceptors.response.use(
  //only get response.data
  function (response) {
    // console.log(">>> interceptor", response);
    return response && response.data ? response.data : response;
  },
  function (error) {
    // console.log(">>> run error: ", error.response);
    return error && error.response & error.response.data
      ? error.response.data
      : Promise.reject(error);
  }
);

export default instance;
