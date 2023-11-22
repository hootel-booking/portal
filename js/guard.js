$(document).ready(function () {
  const token = localStorage.getItem("TOKEN");

  if (!token) {
    window.location.replace("http://127.0.0.1:5500/login.html");
  }
});
