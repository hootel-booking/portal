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
    headers: {
      Authorization: "Bearer " + token,
    },
  }).done(function (data) {
    const room = data?.data;
    const getTagIdRoom = document.getElementById("detailRoom");
    let htmlDisplay = "";
    document.getElementById("room-name").value = `${room.name}`;

    htmlDisplay = `
          <img src=${
            room?.image
              ? `http://localhost:8080/file/pathImage=rooms&fileName=${room?.image}`
              : "img/room/room-details.jpg"
          } alt="">
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
                      <a href="./booking-now.html">Booking Now</a>
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
    })
      .done(function (data) {
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

          displayToast("Success", 1);
        } else {
          displayToast("Your cart already have this room", 2);
        }
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        displayToast("Error: " + errorThrown, 3);
      });
  });

  $(document).on("click", ".btn-check-availability", function (e) {
    // prevent reload page
    e.preventDefault();

    let dateCheckIn = $("#date-in").val();
    let dateCheckOut = $("#date-out").val();

    if (!validateForm(dateCheckIn, dateCheckOut)) {
      return;
    }

    $.ajax({
      url: `http://localhost:8080/reservation/idRoom=${idRoom}`,
      method: "post",
      contentType: "application/json",
      data: JSON.stringify({
        dateCheckIn: formatDate(dateCheckIn),
        dateCheckOut: formatDate(dateCheckOut),
      }),
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .done(function (data) {
        if (data?.data) {
          displayToast("This room is available", 1);
        } else {
          displayToast("This room is not available", 2);
        }
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        displayToast("Error: " + errorThrown, 3);
      });
  });

  function formatDate(date) {
    const dateUTC = new Date(date);
    const getDate = dateUTC.getDate();
    const month = dateUTC.getMonth() + 1;
    const year = dateUTC.getFullYear();
    return getDate + "-" + month + "-" + year;
  }

  function validateForm(checkIn, checkOut) {
    if (!checkIn || !checkIn) {
      displayToast("date checkin/ checkout is required", 2);
      return false;
    }

    let currentDate = new Date().getTime();
    let date1 = new Date(checkIn).getTime();
    let date2 = new Date(checkOut).getTime();

    if (date1 <= currentDate || date2 <= currentDate) {
      displayToast("date checkin/ date checkout invalid", 2);
      return false;
    } else if (date1 >= date2) {
      displayToast("date checkin/ date checkout invalid", 2);
      return false;
    }
    return true;
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
