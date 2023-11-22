$(document).ready(function () {
  const currentUser = JSON.parse(localStorage.getItem("CURRENT_USER"));
  const idUser = currentUser?.id;
  const idElTable = document.getElementById("idTable");
  const token = localStorage.getItem("TOKEN");

  $.ajax({
    url: `http://localhost:8080/carts/idUser=${idUser}`,
    method: "get",
    headers: {
      Authorization: "Bearer " + token,
    },
  })
    .done(function (data) {
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
        <td class="column-1">${room.nameRoom}</td>
        <td class="column-3">$${room.price}/Pernight</td>
        <td class="column-3">${room.discount}%</td>
        <td class="column-3">${total}</td>
        <td class="column-5">
            <button type="button" class="btn btn-info btn-booking" id-room="${room.idRoom}" id-cart="${room.id}">
                <i class="fa fa-calendar-check-o" aria-hidden="true"></i>
            </button>
            <button type="button" class="btn btn-danger btn-delete" data-toggle="modal" data-target="#modalDelete" id-cart="${room.id}" name-room=${room.nameRoom}>
                <i class="fa fa-trash" aria-hidden="true"></i>
            </button>
        </td>
      `;

        idElRoom.innerHTML = htmlDisplay;
      });

      if (rooms.length > 0) {
        const idElParentTable = document.getElementById("idParentTable");

        let divParentBtnDeleteAll = document.createElement("div");
        divParentBtnDeleteAll.setAttribute("id", "idParentBtnDelete");
        divParentBtnDeleteAll.setAttribute("data-toggle", "modal");
        divParentBtnDeleteAll.setAttribute("data-target", "#modalDelete");
        divParentBtnDeleteAll.classList.add(
          "flex-w",
          "flex-sb-m",
          "bor15",
          "p-t-18",
          "p-b-15",
          "p-lr-40",
          "p-lr-15-sm"
        );

        let divChildBtnDeleteAll = document.createElement("button");
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
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      displayToast("Error: " + errorThrown, 3);
    });

  $(document).on("click", ".btn-booking", function () {
    let idRoom = $(this).attr("id-room");
    let idCart = $(this).attr("id-cart");

    window.location.href = `http://127.0.0.1:5500/booking-now.html?idRoom=${idRoom}&idCart=${idCart}`;
  });

  $(document).on("click", ".btn-delete", function () {
    let idCart = $(this).attr("id-cart");
    let nameRoom = $(this).attr("name-room");
    const idModal = document.getElementById("modalNotify");

    let htmlDisplay = `
      <div class="modal-header">
        <h4 class="modal-title" id="modalLabel">Notify</h4>
        <button
          type="button"
          class="close"
          data-dismiss="modal"
          aria-label="Close"
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">Are you sure want to delete room ${nameRoom}?</div>
      <div class="modal-footer">
        <button
          type="button"
          class="btn btn-primary btn-ok"
          data-dismiss="modal"
          id-cart=${idCart}
        >
          OK
        </button>
        <button
          type="button"
          class="btn btn-secondary close-modal"
          data-dismiss="modal"
        >
          Close
        </button>
      </div>
    `;

    idModal.innerHTML = htmlDisplay;
  });

  $(document).on("click", ".btn-ok", function () {
    let idCart = $(this).attr("id-cart");

    $.ajax({
      url: `http://localhost:8080/carts/id=${idCart}`,
      method: "delete",
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .done(function (data) {
        if (data?.data === true) {
          displayToast("Delete successful", 1);

          const childRemoved = document.getElementById(`idRoom-${idCart}`);
          idElTable.removeChild(childRemoved);

          // hide btn Delete All
          hideDeleteAllBtn();
          handleCartCount();
        } else {
          displayToast("Delete failed", 3);
        }
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        displayToast("Error: " + errorThrown, 3);
      });
  });

  // delete all
  $(document).on("click", ".delete-all", function (e) {
    // prevent reload page
    e.preventDefault();

    const idModal = document.getElementById("modalNotify");

    let htmlDisplay = `
      <div class="modal-header">
        <h4 class="modal-title" id="modalLabel">Notify</h4>
        <button
          type="button"
          class="close"
          data-dismiss="modal"
          aria-label="Close"
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">Are you sure want to delete all rooms?</div>
      <div class="modal-footer">
        <button
          type="button"
          class="btn btn-primary btn-yes"
          data-dismiss="modal"
        >
          OK
        </button>
        <button
          type="button"
          class="btn btn-secondary close-modal"
          data-dismiss="modal"
        >
          Close
        </button>
      </div>
    `;

    idModal.innerHTML = htmlDisplay;
  });

  $(document).on("click", ".btn-yes", function () {
    $.ajax({
      url: `http://localhost:8080/carts/idUser=${idUser}`,
      method: "delete",
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .done(function (data) {
        if (data?.data === 0) {
          displayToast("Delete successful", 1);

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
        } else {
          displayToast("Delete failed", 3);
        }
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        displayToast("Error: " + errorThrown, 3);
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
