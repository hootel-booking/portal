$(document).ready(function () {
  const initPageNumber = 0;
  renderListRoom(initPageNumber);
  const idElRow = document.getElementById("rowRoom");

  function renderListRoom(pageNumber) {
    $.ajax({
      url: `http://localhost:8080/rooms/page=${pageNumber}`,
      method: "get",
    }).done(function (data) {
      let rooms = [];
      totalPage = data?.data?.totalPages;
      rooms = data?.data?.content;

      rooms.forEach((room) => {
        let htmlDisplay = "";

        // create div element
        let div = document.createElement("div");
        div.classList.add("col-lg-4", "col-md-6");
        div.setAttribute("id", `idRoom-${room.id}`);

        idElRow.appendChild(div);
        const idElRoom = document.getElementById(`idRoom-${room.id}`);

        htmlDisplay = `
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
              <a href="./room-details.html?id=${room.id}" class="primary-btn">More Details</a>
            </div>
          </div>
        `;

        idElRoom.innerHTML = htmlDisplay;
      });

      if (rooms.length > 0) {
        displayPagination(totalPage);
      }
    });
  }

  function displayPagination(totalPage) {
    let htmlPage = "";
    for (let page = 0; page < totalPage; page++) {
      htmlPage += `<a href="#" class="btn-page" id-page="${page}">${
        page + 1
      }</a>`;
    }

    let htmlDisplay = `
    <div class="room-pagination">
      ${htmlPage}
    </div>
    `;

    // create div element
    let div = document.createElement("div");
    div.classList.add("col-lg-12");
    div.setAttribute("id", "pagination");

    idElRow.appendChild(div);

    const idElPagination = document.getElementById("pagination");
    idElPagination.innerHTML = htmlDisplay;
  }

  $(document).on("click", ".btn-page", function () {
    $(idElRow).empty();
    let pageNumber = $(this).attr("id-page");
    renderListRoom(pageNumber);
  });
});
