$(document).ready(function () {
  $(document).on("click", ".btn-submit", function (e) {
    // prevent reload page
    e.preventDefault();

    let password = $("#password").val();
    let repeatPassword = $("#repeat_password").val();

    if (password.localeCompare(repeatPassword) !== 0) {
      displayToast("Please recheck your password", 2);
    } else {
      if (validateForm() === 1) {
        return;
      }
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
          displayToast("Successfully signed up.", 1);
          resetForm();
        } else {
          displayToast("Registration failed.", 3);
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

  function validateForm() {
    let username = $("#username").val();
    let phoneNumber = $("#phone").val();
    let email = $("#email").val();
    let password = $("#password").val();

    if (!username) {
      displayToast("Username is required", 2);
      return 1;
    }

    const patternEmail = /\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/i;
    if (!email) {
      displayToast("Email is required", 2);
      return 1;
    } else if (!patternEmail.test(email)) {
      displayToast("Email is invalid", 2);
      return 1;
    }

    const patternPhoneNumber =
      /^\s*(?:\+?(\d{1,3}))?([-. (]*(\d{3})[-. )]*)?((\d{3})[-. ]*(\d{2,4})(?:[-.x ]*(\d+))?)\s*$/i;
    if (phoneNumber && !patternPhoneNumber.test(phoneNumber)) {
      displayToast("Phone number is invalid", 2);
      return 1;
    }

    const patternPassword =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/i;
    if (!password) {
      displayToast("Password is required", 2);
      return 1;
    } else if (!patternPassword.test(password)) {
      displayToast("Password is invalid", 2);
      return 1;
    }

    return 0;
  }

  function displayToast(content, status) {
    let title = "Successful";
    const idEl = document.getElementById("toastMessage");

    switch (status) {
      case 1:
        // SUCCESS
        idEl.classList.remove("alert-warning");
        idEl.classList.remove("alert-danger");

        idEl.classList.add("alert-success");
        idEl.style.display = "block";
        break;
      case 2:
        // WARNING
        title = "Warning";
        idEl.classList.remove("alert-danger");
        idEl.classList.remove("alert-success");

        idEl.classList.add("alert-warning");
        idEl.style.display = "block";
        break;
      case 3:
        // DANGER
        title = "Error";
        idEl.classList.remove("alert-success");
        idEl.classList.remove("alert-warning");

        idEl.classList.add("alert-danger");
        idEl.style.display = "block";
        break;
    }

    let htmlDisplay = `
      <button
        type="button"
        class="close close-btn"
      >
        <span aria-hidden="true">&times;</span>
      </button>
      <strong>${title}!</strong> ${content}
    `;
    idEl.innerHTML = htmlDisplay;
  }

  $(document).on("click", ".close-btn", function (e) {
    const idEl = document.getElementById("toastMessage");
    idEl.style.display = "none";
  });
});
