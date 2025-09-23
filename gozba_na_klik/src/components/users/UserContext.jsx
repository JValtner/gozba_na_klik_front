function logout() {
  setUsername(null);
  localStorage.removeItem("username");
  localStorage.removeItem("token"); // ako kasnije bude token
}
const isAuth = !!username;
