$(document).ready(function () {
  const idUser = 1;
  const idElTable = document.getElementById("idTable");
  const token = localStorage.getItem("TOKEN");

  $.ajax({
    url: `http://localhost:8080/carts/idUser=${idUser}`,
    method: "get",
    headers: {
      Authorization: "Bearer " + token,
    },
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
        <td class="column-3">$${room.price}/Pernight</td>
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

    if (rooms.length > 0) {
      const idElParentTable = document.getElementById("idParentTable");

      let divParentBtnDeleteAll = document.createElement("div");
      divParentBtnDeleteAll.setAttribute("id", "idParentBtnDelete");
      divParentBtnDeleteAll.classList.add(
        "flex-w",
        "flex-sb-m",
        "bor15",
        "p-t-18",
        "p-b-15",
        "p-lr-40",
        "p-lr-15-sm"
      );

      let divChildBtnDeleteAll = document.createElement("div");
      divChildBtnDeleteAll.classList.add(
        "flex-c-m",
        "stext-101",
        "cl2",
        "size-119",
        "bg8",
        "bor13",
        "hov-btn3",
        "p-lr-15",
        "trans-04",
        "pointer",
        "m-tb-10",
        "delete-all"
      );
      divChildBtnDeleteAll.innerHTML = "Delete All";

      divParentBtnDeleteAll.appendChild(divChildBtnDeleteAll);

      idElParentTable.appendChild(divParentBtnDeleteAll);
    }
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
      headers: {
        Authorization: "Bearer " + token,
      },
    }).done(function (data) {
      if (data?.data === true) {
        alert("Success");

        const childRemoved = document.getElementById(`idRoom-${idRoom}`);
        idElTable.removeChild(childRemoved);

        // hide btn Delete All
        hideDeleteAllBtn();
        handleCartCount();
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
      headers: {
        Authorization: "Bearer " + token,
      },
    }).done(function (data) {
      if (data?.data === 0) {
        // remove all child
        while (idElTable.childNodes.length > 1) {
          idElTable.removeChild(idElTable.lastChild);
        }

        // hide btn Delete All
        const idElParentTable = document.getElementById("idParentTable");
        const childRemoved = document.getElementById("idParentBtnDelete");
        idElParentTable.removeChild(childRemoved);

        // set = 0 cart count
        const getElIdCartCount = document.getElementById("lblCartCount");
        getElIdCartCount.innerHTML = "";
      }
    });
  });

  function hideDeleteAllBtn() {
    let numb = document.getElementById("idTable").childElementCount;
    if (numb <= 1) {
      const idElParentTable = document.getElementById("idParentTable");
      const childRemoved = document.getElementById("idParentBtnDelete");
      idElParentTable.removeChild(childRemoved);
    }
  }

  function handleCartCount() {
    const getElIdCartCount = document.getElementById("lblCartCount");
    let contentCartCount = $("#lblCartCount").text();
    if (contentCartCount !== "") {
      htmlDisplay = Number(contentCartCount) - 1 + "";
      getElIdCartCount.innerHTML = htmlDisplay;
    }
  }
});
