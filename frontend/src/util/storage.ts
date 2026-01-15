export const getStorage = (): Storage => {
  return localStorage.getItem("token") ? localStorage : sessionStorage;
};

export default getStorage;