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
    }).done(function (data) {
      let htmlDisplay = "";
      htmlDisplay = data?.data !== 0 ? data.data : "";

      getElIdCartCount.innerHTML = htmlDisplay;
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
});
