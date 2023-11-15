$(document).ready(function () {
  const idUser = 1;
  const getElIdCartCount = document.getElementById("lblCartCount");
  let htmlDisplay = "";
  const token = localStorage.getItem("TOKEN");

  $.ajax({
    url: `http://localhost:8080/carts/badge-cart/id=${idUser}`,
    method: "get",
    headers: {
      Authorization: "Bearer " + token,
    },
  }).done(function (data) {
    htmlDisplay = data?.data !== 0 ? data.data : "";

    getElIdCartCount.innerHTML = htmlDisplay;
  });
});
