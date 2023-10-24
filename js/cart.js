$(document).ready(function () {
  const idUser = 1;
  const idElTable = document.getElementById("idTable");

  $.ajax({
    url: `http://localhost:8080/carts/idUser=${idUser}`,
    method: "get",
  }).done(function (data) {
    const rooms = data?.data;

    rooms.forEach((room) => {
      let htmlDisplay = "";
      let total =
        room.discount != 0 ? (room.price * room.discount) / 100 : room.price;

      // create tr element
      let tr = document.createElement("tr");
      tr.classList.add("table_row");
      tr.setAttribute("id", `idRoom-${room.id}`);

      idElTable.appendChild(tr);
      const idElRoom = document.getElementById(`idRoom-${room.id}`);

      htmlDisplay = `
        <td class="column-1">
            <div class="how-itemcart1">
                <img src="images/item-cart-04.jpg" alt="IMG" />
            </div>
        </td>
        <td class="column-2">${room.nameRoom}</td>
        <td class="column-3">$ ${room.price}/Pernight</td>
        <td class="column-3">${room.discount}%</td>
        <td class="column-3">${total}</td>
        <th class="column-5">
            <button type="button" class="btn btn-info btn-booking" id-room="${room.id}">
                <i class="fa fa-calendar-check-o" aria-hidden="true"></i>
            </button>
            <button type="button" class="btn btn-danger btn-delete" id-room="${room.id}">
                <i class="fa fa-trash" aria-hidden="true"></i>
            </button>
        </th>
      `;

      idElRoom.innerHTML = htmlDisplay;
    });
  });

  $(document).on("click", ".btn-booking", function () {
    let idRoom = $(this).attr("id-room");

    // $.ajax({
    //     url: `http://localhost:8080/carts/id=${idRoom}`,
    //     method: "delete",
    // }).done(function (data) {

    // });
  });

  $(document).on("click", ".btn-delete", function () {
    let idRoom = $(this).attr("id-room");

    $.ajax({
      url: `http://localhost:8080/carts/id=${idRoom}`,
      method: "delete",
    }).done(function (data) {
      if (data?.data === true) {
        alert("Success");

        const childRemoved = document.getElementById(`idRoom-${idRoom}`);
        idElTable.removeChild(childRemoved);
      } else {
        alert("Error");
      }
    });
  });

  // delete all
  $(document).on("click", ".delete-all", function () {
    $.ajax({
      url: `http://localhost:8080/carts/idUser=${idUser}`,
      method: "delete",
    }).done(function (data) {
      console.log(data);
    });
  });
});
