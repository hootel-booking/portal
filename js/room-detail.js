$(document).ready(function () {
  const id = 1;
  $.ajax({
    url: `http://localhost:8080/rooms/id=${id}`,
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
});
