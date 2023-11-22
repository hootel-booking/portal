$(document).ready(function () {
  const currentUser = JSON.parse(localStorage.getItem("CURRENT_USER"));
  const idUser = currentUser?.id;
  const getElIdCartCount = document.getElementById("lblCartCount");
  const token = localStorage.getItem("TOKEN");

  getInfoUser();
  getInfoBadgeCart();

  function getInfoBadgeCart() {
    $.ajax({
      url: `http://localhost:8080/carts/badge-cart/id=${idUser}`,
      method: "get",
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .done(function (data) {
        let htmlDisplay = "";
        htmlDisplay = data?.data !== 0 ? data.data : "";

        getElIdCartCount.innerHTML = htmlDisplay;
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        displayToast("Error: " + errorThrown, 3);
      });
  }

  function getInfoUser() {
    const idUserNavEl = document.getElementById("user-nav");
    const dataImage = currentUser?.avatar
      ? `http://localhost:8080/file/pathImage=avatars&fileName=${currentUser.avatar}`
      : "../img/12.jpg";
    let htmlDisplay = "";
    htmlDisplay = `
      <img src=${dataImage} alt="avatar" />
      <span>${currentUser?.userName} <i class="fa fa-angle-down"></i></span>
      <div class="flag-dropdown">
        <ul>
          <li><a href="./profile.html">Profile</a></li>
          <li><a href="javascript:void(0)" class="logout">Logout</a></li>
        </ul>
      </div>
    `;

    idUserNavEl.innerHTML = htmlDisplay;
  }

  $(document).on("click", ".logout", function (e) {
    localStorage.removeItem("TOKEN");
    localStorage.removeItem("CURRENT_USER");
    window.location.replace("http://127.0.0.1:5500/login.html");
  });

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
});
