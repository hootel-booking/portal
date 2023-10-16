$(document).ready(function () {
  let pageNumber = 0;
  let rooms = [];

  $.ajax({
    url: `http://localhost:8080/rooms/${pageNumber}`,
    method: "get",
  }).done(function (data) {
    rooms = data?.data?.content;
    const totalPage = data?.data?.totalPages;

    let idRow = document.getElementById("rowRoom");
    let htmlDisplay = "";
    //const lengthData = rooms.length;

    rooms.forEach((room) => {
      htmlDisplay += `
        <div class="col-lg-4 col-md-6">
          <div class="room-item">
            <img src="img/room/room-3.jpg" alt="" />
            <div class="ri-text">
              <h4>${room.name}</h4>
              <h3>${room.price}$<span>/Pernight</span></h3>
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
              <a href="./room-details.html/${room.id}" class="primary-btn">More Details</a>
            </div>
          </div>
        </div>
      `;
    });

    // pagination
    htmlDisplay += `
      <div class="col-lg-12">
        <div class="room-pagination">
          <a href="#">Prev <i class="fa fa-long-arrow-left"></i></a>
          <a href="#">1</a>
          <a href="#">2</a>
          <a href="#">Next <i class="fa fa-long-arrow-right"></i></a>
        </div>
      </div>
    `;

    idRow.innerHTML = htmlDisplay;
  });
});
