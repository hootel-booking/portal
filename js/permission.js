$(document).ready(function () {
  $(document).on("click", ".btn-submit", function (e) {
    // prevent reload page
    e.preventDefault();
    localStorage.removeItem("TOKEN");
    localStorage.removeItem("CURRENT_USER");
    window.location.replace("http://127.0.0.1:5500/login.html");
  });
});
