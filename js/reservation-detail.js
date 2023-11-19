$(document).ready(function () {
  // get id reservation
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const idReservation = Number(urlParams.get("id"));
  const idElReservation = document.getElementById("reservationInfo");
  const token = localStorage.getItem("TOKEN");

  $.ajax({
    url: `http://localhost:8080/reservation/id=${idReservation}`,
    method: "get",
    headers: {
      Authorization: "Bearer " + token,
    },
  }).done(function (data) {
    const reservation = data?.data;
    const betwenTwoDays = canculateBetweenTwoDays(
      new Date(reservation.dateCheckIn),
      new Date(reservation.dateCheckout)
    );
    let htmlDisplay = "";

    htmlDisplay = `
            <div class="card">
                <h5 class="card-header">Room: ${reservation.roomName}</h5>
                <div class="card-body">
                    <small class="text-light fw-semibold">Booking Information</small>
                    <dl class="row mt-2">
                        <dt class="col-sm-2">Checkin date</dt>
                        <dd class="col-sm-4">${displayDate(
                          reservation.dateCheckIn
                        )}</dd>

                        <dt class="col-sm-2">Adult</dt>
                        <dd class="col-sm-4">${reservation.adultNumber}</dd>

                        <dt class="col-sm-2">Checkout date</dt>
                        <dd class="col-sm-4">${displayDate(
                          reservation.dateCheckout
                        )}</dd>

                        <dt class="col-sm-2 text-truncate">Child</dt>
                        <dd class="col-sm-4">${reservation.childNumber}</dd>

                        <dt class="col-sm-2 text-truncate">Create Date</dt>
                        <dd class="col-sm-4">${displayDate(
                          reservation.createDate
                        )}</dd>

                        <dt class="col-sm-2 text-truncate">Status</dt>
                        <dd class="col-sm-4">${reservation.status}</dd>

                        <dt class="col-sm-2">Note</dt>
                        <dd class="col-sm-10">${
                          reservation.note ? reservation.note : ""
                        }</dd>
                    </dl>
                </div>
                <hr class="m-0" />
                <div class="card-body">
                    <small class="text-light fw-semibold">User Information</small>
                    <dl class="row mt-2">
                        <dt class="col-sm-2">Full Name</dt>
                        <dd class="col-sm-4">${reservation.firstName} ${
      reservation.lastName
    }</dd>

                        <dt class="col-sm-2">Phone number</dt>
                        <dd class="col-sm-4">${reservation.phoneUser}</dd>


                        <dt class="col-sm-2">Email</dt>
                        <dd class="col-sm-4">${reservation.emailUser}</dd>
                    </dl>
                </div>
                <hr class="m-0" />
                <div class="card-body">
                    <small class="text-light fw-semibold">Price</small>
                    <dl class="row mt-2 text-end">
                        <dt class="col-sm-10">Price</dt>
                        <dd class="col-sm-2">${reservation.price}$/night</dd>

                        <dt class="col-sm-10">Discount</dt>
                        <dd class="col-sm-2">${reservation.discount}</dd>

                        <dt class="col-sm-10">Total</dt>
                        <dt class="col-sm-2">${canculateTotal(
                          betwenTwoDays,
                          reservation.price,
                          reservation.discount
                        )}$</dt>
                    </dl>
                </div>
                <div class="m-2 text-end" style="text-align: right;">
                  <button type="reset" class="btn btn-outline-secondary btn-back">Back</button>
                </div>
            </div>
        `;

    idElReservation.innerHTML = htmlDisplay;
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

  $(document).on("click", ".btn-back", function (e) {
    // prevent reload page
    e.preventDefault();
    window.location.replace(`http://127.0.0.1:5500/your-reservation.html`);
  });
});
