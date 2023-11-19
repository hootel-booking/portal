$(document).ready(function () {
  const currentUser = JSON.parse(localStorage.getItem("CURRENT_USER"));
  const idUser = currentUser?.id;
  const idElTable = document.getElementById("idTable");
  const token = localStorage.getItem("TOKEN");

  $.ajax({
    url: `http://localhost:8080/reservation/idUser=${idUser}`,
    method: "get",
    headers: {
      Authorization: "Bearer " + token,
    },
  }).done(function (data) {
    const listReservation = data?.data;

    listReservation.forEach((reservation) => {
      let htmlDisplay = "";
      const betwenTwoDays = canculateBetweenTwoDays(
        new Date(reservation.dateCheckIn),
        new Date(reservation.dateCheckout)
      );
      const total = canculateTotal(
        betwenTwoDays,
        reservation.price,
        reservation.discount
      );

      // create tr element
      let tr = document.createElement("tr");
      tr.classList.add("table_row");
      tr.setAttribute("id", `idReservation-${reservation.id}`);

      idElTable.appendChild(tr);
      const idElReservation = document.getElementById(
        `idReservation-${reservation.id}`
      );

      // date checkin
      const convertDateCheckIn = new Date(reservation.dateCheckIn);

      htmlDisplay = `
            <td class="column-1">${reservation.roomName}</td>
            <td class="column-3">${displayDate(reservation.dateCheckIn)}</td>
            <td class="column-3">${displayDate(reservation.dateCheckout)}</td>
            <td class="column-3">${reservation.price}$/Pernigh</td>
            <td class="column-3">${reservation.discount}%</td>
            <td class="column-3">${total}$</td>
            <td class="column-3">${reservation.status}</td>
            <th class="column-5">
                <button type="button" class="btn btn-info btn-detail" id-reservation="${
                  reservation.id
                }">
                    <i class="fa fa-info-circle" aria-hidden="true"></i>
                </button>
                <button type="button" class="btn btn-danger btn-delete" id-reservation="${
                  reservation.id
                }" ${
        disableBtnDelete(reservation.status, convertDateCheckIn)
          ? "disabled"
          : ""
      }
                  >
                    <i class="fa fa-trash" aria-hidden="true"></i>
                </button>
            </th>
        `;

      idElReservation.innerHTML = htmlDisplay;
    });
  });

  $(document).on("click", ".btn-detail", function () {
    // get id room
    let idReservation = $(this).attr("id-reservation");
    window.location.replace(
      `http://127.0.0.1:5500/reservation-detail.html?id=${idReservation}`
    );
  });

  $(document).on("click", ".btn-delete", function () {
    const ID_STATUS_CANCEL = 3;
    // get id room
    let idReservation = $(this).attr("id-reservation");

    $.ajax({
      url: `http://localhost:8080/reservation/id=${idReservation}`,
      method: "put",
      contentType: "application/json",
      data: JSON.stringify({
        idUser: idUser,
        idStatus: ID_STATUS_CANCEL,
      }),
      headers: {
        Authorization: "Bearer " + token,
      },
    }).done(function (data) {
      if (data?.data) {
        alert("Hủy thành công");
        location.reload();
      } else {
        alert("Hủy thất bại");
      }
    });
  });

  function disableBtnDelete(status, dateCheckIn) {
    // yesterday
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 1);
    return (
      status !== "UNPAID" ||
      Math.round(canculateBetweenTwoDays(currentDate, dateCheckIn)) <= 2
    );
  }

  function canculateBetweenTwoDays(date1, date2) {
    const diffInTime = date2.getTime() - date1.getTime();
    return diffInTime / (1000 * 3600 * 24);
  }

  function canculateTotal(betwenTwoDays, price, discount) {
    if (discount === 0) {
      return betwenTwoDays * price;
    }

    return ((100 - discount) * (betwenTwoDays * price)) / 100;
  }

  function displayDate(date) {
    const dateUTC = new Date(date);
    const getDate = dateUTC.getDate();
    const day = getDate >= 10 ? getDate : "0" + getDate;
    const month = dateUTC.getMonth() + 1;
    const year = dateUTC.getFullYear();
    return day + "-" + month + "-" + year;
  }
});
