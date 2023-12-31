$(document).ready(function () {
  const initPageNumber = 0;
  const idElRow = document.getElementById("rowRoom");
  const token = localStorage.getItem("TOKEN");
  renderListRoom(initPageNumber);

  function renderListRoom(pageNumber) {
    $.ajax({
      url: `http://localhost:8080/rooms/page=${pageNumber}`,
      method: "get",
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .done(function (data) {
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
              <img id="uploadedImage" src=${
                room?.image
                  ? `http://localhost:8080/file/pathImage=rooms&fileName=${room?.image}`
                  : "img/room/room-details.jpg"
              } alt="${room.name}" />
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
                <a href="./room-details.html?id=${
                  room.id
                }" class="primary-btn">More Details</a>
              </div>
            </div>
          `;

          idElRoom.innerHTML = htmlDisplay;
        });

        if (rooms.length > 0) {
          displayPagination(totalPage, pageNumber);
        }
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        displayToast("Error: " + errorThrown, 3);
      });
  }

  function displayPagination(totalPage, currentPage) {
    currentPage = parseInt(currentPage);
    let htmlPage = "";
    for (let page = 0; page < totalPage; page++) {
      htmlPage += `<a href="#" class="btn-page" id-page="${page}" style="${
        currentPage === page ? "background-color: #efd4b9; color: white" : ""
      }">${page + 1}</a>`;
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
    // reset total rooms
    $(idElRow).empty();

    let pageNumber = $(this).attr("id-page");
    renderListRoom(pageNumber);
  });
});
