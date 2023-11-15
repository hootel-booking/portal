$(document).ready(function () {
  class User {
    constructor(id, email, role) {
      this.id = id;
      this.email = email;
      this.role = role;
    }
  }

  $(document).on("click", ".btn-login", function (e) {
    // prevent reload page
    e.preventDefault();

    let email = $("#email").val();
    let password = $("#password").val();
    $.ajax({
      url: `http://localhost:8080/login/signin`,
      method: "post",
      contentType: "application/json",
      data: JSON.stringify({
        email: email,
        password: password,
      }),
    }).done(function (data) {
      if (data?.statusCode === 200) {
        const response = data?.data;
        const user = new User(
          response.user.id,
          response.user.email,
          response.user.roleName
        );
        localStorage.setItem("TOKEN", response.token);
        localStorage.setItem("CURRENT_USER", JSON.stringify(user));
        window.location.href = "http://127.0.0.1:5500/index.html";
      } else if (data?.statusCode === 403) {
        alert("Access Denied");
      } else if (data?.statusCode === 401) {
        alert("Invalid username or password");
      }
    });
  });
});
