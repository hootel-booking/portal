$(document).ready(function () {
  $(document).on("click", ".btn-submit", function (e) {
    // prevent reload page
    e.preventDefault();

    let password = $("#password").val();
    let repeatPassword = $("#repeat_password").val();

    if (password.localeCompare(repeatPassword) !== 0) {
      alert("Vui lòng nhập lại password");
    } else {
      // get value form
      let username = $("#username").val();
      let email = $("#email").val();
      let phone = $("#phone").val();

      $.ajax({
        url: `http://localhost:8080/login/signup`,
        method: "post",
        contentType: "application/json",
        data: JSON.stringify({
          username: username,
          password: password,
          email: email,
          phone: phone,
        }),
      }).done(function (data) {
        if (data?.data) {
          alert("Successfully signed up.");
          resetForm();
        } else {
          alert("registration failed.");
        }
      });
    }
  });

  function resetForm() {
    document.getElementById("username").value = "";
    document.getElementById("email").value = "";
    document.getElementById("phone").value = "";
    document.getElementById("password").value = "";
    document.getElementById("repeat_password").value = "";
  }
});
