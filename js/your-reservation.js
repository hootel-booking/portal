$(document).ready(function () {
  const idUser = 1;
  const idElTable = document.getElementById("idTable");

  $.ajax({
    url: `http://localhost:8080/reservation/idUser=${idUser}`,
    method: "get",
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

      htmlDisplay = `
            <td class="column-1">${reservation.roomName}</td>
            <td class="column-3">${displayDate(reservation.dateCheckIn)}t</td>
            <td class="column-3">${displayDate(reservation.dateCheckout)}</td>
            <td class="column-3">${reservation.price}$/Pernigh</td>
            <td class="column-3">${reservation.discount}%</td>
            <td class="column-3">${total}$</td>
            <td class="column-3">${reservation.status}</td>
            <th class="column-5">
                <button type="button" class="btn btn-info btn-booking" id-reservation="${
                  reservation.id
                }">
                    <i class="fa fa-calendar-check-o" aria-hidden="true"></i>
                </button>
                <button type="button" class="btn btn-danger btn-delete" id-reservation="${
                  reservation.id
                }">
                    <i class="fa fa-trash" aria-hidden="true"></i>
                </button>
            </th>
        `;

      idElReservation.innerHTML = htmlDisplay;
    });
  });

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
