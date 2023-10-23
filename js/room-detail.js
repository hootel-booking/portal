$(document).ready(function () {
  // get id room
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const idRoom = Number(urlParams.get("id"));
  const idUser = 1;

  $.ajax({
    url: `http://localhost:8080/rooms/id=${idRoom}`,
    method: "get",
  }).done(function (data) {
    const room = data?.data;
    const getTagIdRoom = document.getElementById("detailRoom");
    let htmlDisplay = "";

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
              <h2>159$<span>/Pernight</span></h2>
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
              <p class="f-para">${room.description}</p>
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
});
