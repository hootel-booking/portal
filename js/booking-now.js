$(document).ready(function () {
  // get id room
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const idRoom = Number(urlParams.get("idRoom"));
  const idCart = Number(urlParams.get("idCart"));
  const token = localStorage.getItem("TOKEN");
  const currentUser = JSON.parse(localStorage.getItem("CURRENT_USER"));
  const idUser = currentUser?.id;

  const elIdCardBooking = document.getElementById("cardBooking");
  let price = 0;
  let discount = 0;
  let total = 0;
  showFormCheckAvailability();

  function showFormCheckAvailability() {
    const elDropdownRooms = document.getElementById("idFormCheckAvalibility");
    let htmlDisplay = "";

    htmlDisplay = `
      <form>
        <div class="row m-2">
          <dt class="col-sm-2 col-form-label" for="room">Room<label style="color: red;">*</label></label></dt>
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
              Checkin date <label style="color: red;">*</label></label>
          </dt>
          <div class="col-sm-4">
              <input type="date" class="form-control" class="date-input" name="date-in" id="date-in" />
          </div>

          <dt class="col-sm-2 col-form-label" for="child">Child</dt>
          <div class="col-sm-4">
              <input type="text" class="form-control" id="child" />
          </div>
        </div>

        <div class="row m-2">
          <dt class="col-sm-2 col-form-label" for="checkout">
              Checkout date <label style="color: red;">*</label></label>
          </dt>
          <div class="col-sm-4">
              <input type="date" class="form-control" class="date-input" name="date-out" id="date-out" />
          </div>
          </div>

          <div class="row m-2">
          <dt class="col-sm-2 col-form-label" for="note">Note</dt>
          <div class="col-sm-10">
              <textarea class="form-control" id="note" rows="3"/></textarea>
          </div>
        </div>

        <div class="row m-4" style="justify-content: end;">
          <div class="ml-2">
            <button type="submit" class="btn btn-primary btn-check-availability">Check Availability</button>
          </div>
          <div class="ml-2">
            <button type="submit" class="btn btn-outline-secondary btn-reset" disabled>Reset</button>
          </div>
          </div>
      </form>
    `;

    elDropdownRooms.innerHTML = htmlDisplay;
    disableInputDate("date-in");
    disableInputDate("date-out");
    getRooms(idRoom);
  }

  function getRooms(idRoom) {
    $.ajax({
      url: `http://localhost:8080/rooms`,
      method: "get",
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .done(function (data) {
        let htmDisplay = "";
        const rooms = data?.data;

        if (idRoom) {
          const getIdElSelect = document.getElementById("idDropdownRooms");
          getIdElSelect.disabled = true;
          rooms.forEach((room) => {
            htmDisplay += `<option ${
              idRoom == room.id ? "selected" : ""
            } value="${room.id}">${room.name}</option>`;
          });
        } else {
          rooms.forEach((room) => {
            htmDisplay += `<option value="${room.id}">${room.name}</option>`;
          });
        }

        idDropdownRooms.innerHTML = htmDisplay;
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        displayToast("Error: " + errorThrown, 3);
      });
  }

  $(document).on("click", ".btn-check-availability", function (e) {
    // prevent reload page
    e.preventDefault();

    if (validateForm() === 1) {
      return;
    }

    // get id room
    const getIdElSelect = document.getElementById("idDropdownRooms");
    let idRoomX = getIdElSelect.value;

    let dateCheckIn = $("#date-in").val();
    let dateCheckOut = $("#date-out").val();

    $.ajax({
      url: `http://localhost:8080/reservation/idRoom=${idRoomX}`,
      method: "post",
      contentType: "application/json",
      data: JSON.stringify({
        dateCheckIn: formatDate(dateCheckIn),
        dateCheckOut: formatDate(dateCheckOut),
      }),
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .done(function (data) {
        if (data?.data) {
          showUserInfo();
          showInfoPrice();

          // disable btn check availability
          let elCheck = document.getElementsByClassName(
            "btn-check-availability"
          );
          elCheck[0].disabled = true;

          // enable btn reset
          let elReset = document.getElementsByClassName("btn-reset");
          elReset[0].disabled = false;

          // disable form booking
          document.getElementById("idDropdownRooms").disabled = true;
          document.getElementById("date-in").disabled = true;
          document.getElementById("date-out").disabled = true;
        } else {
          displayToast("This room is not available.", 2);
        }
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        displayToast("Error: " + errorThrown, 3);
      });
  });

  function showUserInfo() {
    $.ajax({
      url: `http://localhost:8080/users/id=${idUser}`,
      method: "get",
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .done(function (data) {
        const user = data?.data;

        createHrEl();

        let div = document.createElement("div");
        div.classList.add("card-body");

        let htmlDisplay = `
      <small>User Information</small>
      <dl class="row mt-2">
        <dt class="col-sm-2">Full Name</dt>
        <dd class="col-sm-4"> ${showFullName(
          user.firstname,
          user.lastName
        )}</dd>

        <dt class="col-sm-2">Phone number</dt>
        <dd class="col-sm-4">${user.phone}</dd>

        <dt class="col-sm-2">Email</dt>
        <dd class="col-sm-4">${user.email}</dd>
      </dl>
    `;

        div.innerHTML = htmlDisplay;
        elIdCardBooking.appendChild(div);
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        displayToast("Error: " + errorThrown, 3);
      });
  }

  function showFullName(firstName, lastName) {
    let fullname = "";
    if (firstName) {
      fullname += firstName;
    }

    if (lastName) {
      fullname += " " + lastName;
    }

    return fullname;
  }

  function showInfoPrice() {
    // get id room
    const getIdElSelect = document.getElementById("idDropdownRooms");
    let idRoomX = getIdElSelect.value;

    $.ajax({
      url: `http://localhost:8080/rooms/id=${idRoomX}`,
      method: "get",
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .done(function (data) {
        const room = data?.data;
        let dateCheckIn = $("#date-in").val();
        let dateCheckOut = $("#date-out").val();
        price = room?.price;
        discount = room?.discount;

        const betwenTwoDays = canculateBetweenTwoDays(
          new Date(dateCheckIn),
          new Date(dateCheckOut)
        );
        total = canculateTotal(betwenTwoDays, room.price, room.discount);

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
            class="btn btn-warning btn-pay"
            data-toggle="modal" data-target="#payModal"
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
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        displayToast("Error: " + errorThrown, 3);
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
    let idRoomX = parseInt(getIdElSelect.value);
    let dateCheckIn = $("#date-in").val();
    let dateCheckOut = $("#date-out").val();
    let adult = $("#adult").val() ? $("#adult").val() : 0;
    let child = $("#child").val() ? $("#child").val() : 0;
    let note = $("#note").val();

    $.ajax({
      url: `http://localhost:8080/reservation`,
      method: "post",
      contentType: "application/json",
      data: JSON.stringify({
        idRoom: idRoomX,
        dateCheckIn: formatDate(dateCheckIn),
        dateCheckOut: formatDate(dateCheckOut),
        adultNumber: adult,
        childNumber: child,
        price: price,
        discount: discount,
        note: note,
        idUser: idUser,
        idStatus: ID_STATUS_UNPAID,
        idCart: idCart,
      }),
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .done(function (data) {
        const result = data?.data;
        if (result) {
          window.location.replace(
            "http://127.0.0.1:5500/your-reservation.html"
          );
        } else {
          displayToast("Booking failed", 3);
        }
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        displayToast("Error: " + errorThrown, 3);
      });
  });

  $(document).on("click", ".btn-reset", function (e) {
    e.preventDefault();

    // remove btn
    removeChildEl();

    // remove price
    removeChildEl();

    // remove hr tag
    removeChildEl();

    // remove user info
    removeChildEl();

    // remove hr tag
    removeChildEl();

    // reset form value
    document.getElementById("date-in").value = "";
    document.getElementById("date-out").value = "";
    const getIdElSelect = document.getElementById("idDropdownRooms");
    getIdElSelect.selectedIndex = 0;

    // enable btn check availability
    let elCheck = document.getElementsByClassName("btn-check-availability");
    elCheck[0].disabled = false;

    // disable btn reset
    let elReset = document.getElementsByClassName("btn-reset");
    elReset[0].disabled = true;

    // enable form booking
    document.getElementById("idDropdownRooms").disabled = false;
    document.getElementById("adult").disabled = false;
    document.getElementById("child").disabled = false;
    document.getElementById("note").disabled = false;
    document.getElementById("date-in").disabled = false;
    document.getElementById("date-out").disabled = false;

    // reset modal
    document.getElementById("total").value = "";
    document.getElementById("accountNumber").value = "";
    document.getElementById("deposit").value = "";
    let ele = document.getElementsByName("methodRadio");
    ele[0].checked = true;
    ele[1].checked = false;
    document.getElementById("deposit-field").style.display = "none";
  });

  function removeChildEl() {
    let childEl = elIdCardBooking.lastElementChild;
    elIdCardBooking.removeChild(childEl);
  }

  $(document).on("click", ".btn-pay", function (e) {
    e.preventDefault();
    document.getElementById("total").value = total;

    let radiosEl = document.payForm.methodRadio;
    let prev = null;
    for (let i = 0; i < radiosEl.length; i++) {
      radiosEl[i].addEventListener("change", function () {
        prev ? prev.value : null;
        if (this !== prev) {
          prev = this;
        }

        if (parseInt(this.value) === 1) {
          document.getElementById("deposit").value = total / 2;
          document.getElementById("deposit-field").style.display = "flex";
        } else {
          document.getElementById("deposit-field").style.display = "none";
        }
      });
    }
  });

  $(document).on("click", ".btn-submit", function (e) {
    // prevent reload page
    e.preventDefault();

    let accountNumber = $("#accountNumber").val();
    if (invalidModal(accountNumber) == 1) {
      return;
    } else {
      $.ajax({
        url: `http://localhost:8080/bank_account/idUser=${idUser}`,
        method: "post",
        contentType: "application/json",
        data: JSON.stringify({
          accountNumber: accountNumber,
        }),
        headers: {
          Authorization: "Bearer " + token,
        },
      })
        .done(function (data) {
          const result = data?.data;
          if (result) {
            deposit(accountNumber);
          } else {
            displayToast("Wrong account number", 3);
            return;
          }
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
          displayToast("Error: " + errorThrown, 3);
          return;
        });
    }
  });

  function deposit(accountNumber) {
    const ID_STATUS_PAID = 2;
    const ID_STATUS_DEPOSIT = 5;

    //get value form
    const getIdElSelect = document.getElementById("idDropdownRooms");
    let idRoomX = parseInt(getIdElSelect.value);
    let dateCheckIn = $("#date-in").val();
    let dateCheckOut = $("#date-out").val();
    let adult = $("#adult").val() ? $("#adult").val() : 0;
    let child = $("#child").val() ? $("#child").val() : 0;
    let note = $("#note").val();
    let method = document.querySelector(
      'input[name="methodRadio"]:checked'
    ).value;

    $.ajax({
      url: `http://localhost:8080/reservation`,
      method: "post",
      contentType: "application/json",
      data: JSON.stringify({
        idRoom: idRoomX,
        dateCheckIn: formatDate(dateCheckIn),
        dateCheckOut: formatDate(dateCheckOut),
        adultNumber: adult,
        childNumber: child,
        price: price,
        discount: discount,
        note: note,
        idUser: idUser,
        idStatus: parseInt(method) === 0 ? ID_STATUS_PAID : ID_STATUS_DEPOSIT,
        deposit: parseInt(method) === 0 ? total : total / 2,
        accountNumber: accountNumber,
        idCart: idCart,
      }),
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .done(function (data) {
        const result = data?.data;
        if (result) {
          window.location.replace(
            "http://127.0.0.1:5500/your-reservation.html"
          );
        } else {
          displayToast("Booking failed", 3);
        }
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        displayToast("Error: " + errorThrown, 3);
      });
  }

  function invalidModal(accountNumber) {
    if (!accountNumber) {
      displayToast("Account number is required", 2);
      return 1;
    }

    return 0;
  }

  function validateForm() {
    let checkIn = $("#date-in").val();
    let checkOut = $("#date-out").val();
    let adult = $("#adult").val();
    let child = $("#child").val();

    if (!checkIn || !checkIn) {
      displayToast("date checkin/ checkout is required", 2);
      return 1;
    }

    let currentDate = new Date().getTime();
    let date1 = new Date(checkIn).getTime();
    let date2 = new Date(checkOut).getTime();

    if (date1 <= currentDate || date2 <= currentDate) {
      displayToast("date checkin/ date checkout invalid", 2);
      return 1;
    } else if (date1 >= date2) {
      displayToast("date checkin/ date checkout invalid", 2);
      return 1;
    }

    if (adult) {
      if (isNaN(adult)) {
        displayToast("Adult number is invalid. Please input a number", 2);
        return 1;
      } else if (adult < 0 || adult > 5) {
        displayToast("Adult number is invalid.", 2);
        return 1;
      }
    }

    if (child) {
      if (isNaN(child)) {
        displayToast("Child number is invalid. Please input a number", 2);
        return 1;
      } else if (child < 0 || child > 5) {
        displayToast("Child number is invalid.", 2);
        return 1;
      }
    }

    return 0;
  }

  function disableInputDate(nameEl) {
    let today = new Date().toISOString().split("T")[0];
    document.getElementsByName(nameEl)[0].setAttribute("min", today);
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
