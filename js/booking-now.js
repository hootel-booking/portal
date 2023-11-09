$(document).ready(function () {
  const elIdCardBooking = document.getElementById("cardBooking");
  let price = 0;
  let discount = 0;
  showFormCheckAvailability();

  function showFormCheckAvailability() {
    const elDropdownRooms = document.getElementById("idFormCheckAvalibility");
    let htmlDisplay = "";

    htmlDisplay = `
      <form>
        <div class="row m-2">
          <dt class="col-sm-2 col-form-label" for="room">Room</dt>
          <div class="col-sm-4">
              <select class="form-control form-control-line wide" id="idDropdownRooms" style="display: block;">
              </select>
          </div>

          <dt class="col-sm-2 col-form-label" for="adult">Adult</dt>
          <div class="col-sm-4">
              <input type="text" class="form-control" id="adult" />
          </div>
        </div>

        <div class="row m-2">
          <dt class="col-sm-2 col-form-label" for="checkin">
              Checkin date
          </dt>
          <div class="col-sm-4">
              <input type="date" class="form-control" class="date-input" id="date-in" />
          </div>

          <dt class="col-sm-2 col-form-label" for="child">Child</dt>
          <div class="col-sm-4">
              <input type="text" class="form-control" id="child" />
          </div>
        </div>

        <div class="row m-2">
          <dt class="col-sm-2 col-form-label" for="checkout">
              Checkout date
          </dt>
          <div class="col-sm-4">
              <input type="date" class="form-control" class="date-input" id="date-out" />
          </div>
          </div>

          <div class="row m-2">
          <dt class="col-sm-2 col-form-label" for="note">Note</dt>
          <div class="col-sm-10">
              <textarea class="form-control" id="note" rows="3"/></textarea>
          </div>
        </div>

        <div class="row m-4" style="justify-content: end;">
          <button type="submit" class="btn btn-outline-secondary btn-check-availability">Check Availability</button>
        </div>
      </form>
    `;

    elDropdownRooms.innerHTML = htmlDisplay;

    getRooms();
  }

  function getRooms() {
    $.ajax({
      url: `http://localhost:8080/rooms`,
      method: "get",
    }).done(function (data) {
      let htmDisplay = "";
      const rooms = data?.data;

      rooms.forEach((room) => {
        htmDisplay += `<option value="${room.id}">${room.name}</option>`;
      });

      idDropdownRooms.innerHTML = htmDisplay;
    });
  }

  $(document).on("click", ".btn-check-availability", function (e) {
    // prevent reload page
    e.preventDefault();

    // get id room
    const getIdElSelect = document.getElementById("idDropdownRooms");
    let idRoom = getIdElSelect.value;

    let dateCheckIn = $("#date-in").val();
    let dateCheckOut = $("#date-out").val();

    $.ajax({
      url: `http://localhost:8080/reservation/idRoom=${idRoom}`,
      method: "post",
      contentType: "application/json",
      data: JSON.stringify({
        dateCheckIn: formatDate(dateCheckIn),
        dateCheckOut: formatDate(dateCheckOut),
      }),
    }).done(function (data) {
      if (data?.data) {
        showUserInfo();
        showInfoPrice();
      } else {
        alert("This room is not available");
      }
    });
  });

  function showUserInfo() {
    // get id user
    const idUser = 1;

    $.ajax({
      url: `http://localhost:8080/users/id=${idUser}`,
      method: "get",
    }).done(function (data) {
      const user = data?.data;

      createHrEl();

      let div = document.createElement("div");
      div.classList.add("card-body");

      let htmlDisplay = `
      <small>User Information</small>
      <dl class="row mt-2">
        <dt class="col-sm-2">Full Name</dt>
        <dd class="col-sm-4">${user.firstname} ${user.lastName}</dd>

        <dt class="col-sm-2">Phone number</dt>
        <dd class="col-sm-4">${user.phone}</dd>

        <dt class="col-sm-2">Email</dt>
        <dd class="col-sm-4">${user.email}</dd>
      </dl>
    `;

      div.innerHTML = htmlDisplay;
      elIdCardBooking.appendChild(div);
    });
  }

  function showInfoPrice() {
    // get id room
    const getIdElSelect = document.getElementById("idDropdownRooms");
    let idRoom = getIdElSelect.value;

    $.ajax({
      url: `http://localhost:8080/rooms/id=${idRoom}`,
      method: "get",
    }).done(function (data) {
      const room = data?.data;
      let dateCheckIn = $("#date-in").val();
      let dateCheckOut = $("#date-out").val();
      price = room?.price;
      discount = room?.discount;

      const betwenTwoDays = canculateBetweenTwoDays(
        new Date(dateCheckIn),
        new Date(dateCheckOut)
      );
      const total = canculateTotal(betwenTwoDays, room.price, room.discount);

      createHrEl();

      let div = document.createElement("div");
      div.classList.add("card-body");
      let htmlDisplay = `
        <small>Price</small>
        <!-- Basic Layout & Basic with Icons -->
        <div class="row mt-2">
          <dt class="col-sm-2">Price ($)/ night</dt>
          <dd class="col-sm-4">${room.price}</dd>

          <dt class="col-sm-2">Discount</dt>
          <dd class="col-sm-4">${room.discount}</dd>

          <dt class="col-sm-2">TOTAL($)</dt>
          <dt class="col-sm-4">${total}</dt>
        </div>
      `;
      div.innerHTML = htmlDisplay;
      elIdCardBooking.appendChild(div);

      // create div for btn
      let divBtn = document.createElement("div");
      divBtn.classList.add("row", "m-2");
      divBtn.setAttribute("style", "justify-content: end");
      let htmlDisplayBtn = `
        <div class="ml-2">
          <input
            type="button"
            class="btn btn-primary btn-booking"
            value="Booking"
          />
        </div>
        <div class="ml-2">
          <input
            type="button"
            class="btn btn-outline-secondary btn-back"
            value="Pay In Advance"
          />
        </div>
        <div class="ml-2">
          <input
            type="button"
            class="btn btn-outline-secondary btn-back"
            value="Back"
          />
        </div>
      `;
      divBtn.innerHTML = htmlDisplayBtn;
      elIdCardBooking.appendChild(divBtn);
    });
  }

  function formatDate(date) {
    const dateUTC = new Date(date);
    const getDate = dateUTC.getDate();
    const month = dateUTC.getMonth() + 1;
    const year = dateUTC.getFullYear();
    return getDate + "-" + month + "-" + year;
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

  function createHrEl() {
    let hr = document.createElement("hr");
    hr.classList.add("m-0");
    elIdCardBooking.appendChild(hr);
  }

  $(document).on("click", ".btn-booking", function (e) {
    // prevent reload page
    e.preventDefault();

    const ID_STATUS_UNPAID = 1;

    // get value form
    const getIdElSelect = document.getElementById("idDropdownRooms");
    let idRoom = parseInt(getIdElSelect.value);
    let dateCheckIn = $("#date-in").val();
    let dateCheckOut = $("#date-out").val();
    const idUser = 1;
    let adult = $("#adult").val() ? $("#adult").val() : 0;
    let child = $("#child").val() ? $("#child").val() : 0;
    let note = $("#note").val();

    $.ajax({
      url: `http://localhost:8080/reservation`,
      method: "post",
      contentType: "application/json",
      data: JSON.stringify({
        idRoom: idRoom,
        dateCheckIn: formatDate(dateCheckIn),
        dateCheckOut: formatDate(dateCheckOut),
        adultNumber: adult,
        childNumber: child,
        price: price,
        discount: discount,
        note: note,
        idUser: idUser,
        idStatus: ID_STATUS_UNPAID,
      }),
    })
      .done(function (data) {
        const result = data?.data;
        if (result) {
          alert("Success");
          //window.location.replace("http://127.0.0.1:5500/cart.html");
        } else {
          alert("Error");
        }
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        alert("Error " + errorThrown);
      });
  });

  function reset() {}
});
