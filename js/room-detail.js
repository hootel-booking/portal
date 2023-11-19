$(document).ready(function () {
  // get id room
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const idRoom = Number(urlParams.get("id"));
  const currentUser = JSON.parse(localStorage.getItem("CURRENT_USER"));
  const idUser = currentUser?.id;
  const token = localStorage.getItem("TOKEN");

  $.ajax({
    url: `http://localhost:8080/rooms/id=${idRoom}`,
    method: "get",
  }).done(function (data) {
    const room = data?.data;
    const getTagIdRoom = document.getElementById("detailRoom");
    let htmlDisplay = "";
    document.getElementById("room-name").value = `${room.name}`;

    htmlDisplay = `
          <img src="img/room/room-details.jpg" alt="">
          <div class="rd-text">
              <div class="rd-title">
                  <h3>${room.name}</h3>
                  <div class="rdt-right">
                      <div class="rating">
                          <i class="icon_star"></i>
                          <i class="icon_star"></i>
                          <i class="icon_star"></i>
                          <i class="icon_star"></i>
                          <i class="icon_star-half_alt"></i>
                      </div>
                      <a href="#">Booking Now</a>
                      <a href="#" class="add-to-cart-btn">Add To Cart</a>
                  </div>
              </div>
              <h2>${room.price}$<span>/Pernight</span></h2>
              <table>
                  <tbody>
                      <tr>
                          <td class="r-o">Size:</td>
                          <td>${room.square} ft</td>
                      </tr>
                      <tr>
                          <td class="r-o">Services:</td>
                          <td>${room.nameType}</td>
                      </tr>
                  </tbody>
              </table>
              <p class="f-para">${room.description ? room.description : ""}</p>
          </div>
      `;

    getTagIdRoom.innerHTML = htmlDisplay;
  });

  $(document).on("click", ".add-to-cart-btn", function () {
    $.ajax({
      url: `http://localhost:8080/carts`,
      method: "post",
      contentType: "application/json",
      data: JSON.stringify({
        idRoom: idRoom,
        idUser: idUser,
      }),
      headers: {
        Authorization: "Bearer " + token,
      },
    }).done(function (data) {
      if (data.data) {
        const getElIdCartCount = document.getElementById("lblCartCount");
        let contentCartCount = $("#lblCartCount").text();
        if (contentCartCount === "") {
          htmlDisplay = 1 + "";
          getElIdCartCount.innerHTML = htmlDisplay;
        } else {
          htmlDisplay = Number(contentCartCount) + 1 + "";
          getElIdCartCount.innerHTML = htmlDisplay;
        }

        alert("Success");
      } else {
        alert("Error");
      }
    });
  });

  $(document).on("click", ".btn-check-availability", function (e) {
    // prevent reload page
    e.preventDefault();

    const getElModal = document.getElementById("modalReservation");

    let dateCheckIn = $("#date-in").val();
    let dateCheckOut = $("#date-out").val();

    $.ajax({
      url: `http://localhost:8080/reservation/idRoom=${idRoom}`,
      method: "post",
      contentType: "application/json",
      data: JSON.stringify({
        dateCheckIn: formatDate(dateCheckIn),
        dateCheckOut: formatDate(dateCheckOut),
      }),
    }).done(function (data) {
      if (data?.data) {
        alert("This room is available");
      } else {
        alert("This room is not available");
      }
    });
  });

  function formatDate(date) {
    const dateUTC = new Date(date);
    const getDate = dateUTC.getDate();
    const month = dateUTC.getMonth() + 1;
    const year = dateUTC.getFullYear();
    return getDate + "-" + month + "-" + year;
  }
});
