export default function authHeader() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user && user.data.accessToken) {
    return { Authorization: "Bearer " + user.data.accessToken };
  } else {
    return {};
  }
}
