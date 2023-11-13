$(document).ready(function () {
  // get id user
  const idUser = 1;

  renderInfoUser();

  function renderInfoUser() {
    const idElForm = document.getElementById("formUser");

    $.ajax({
      url: `http://localhost:8080/users/id=${idUser}`,
      method: "get",
    }).done(function (data) {
      const user = data?.data;
      let htmlDisplay = "";

      htmlDisplay = `
                <div class="row">
                    <div class="mb-3 col-md-6">
                        <label for="firstName" class="form-label">First Name</label>
                        <input
                            class="form-control"
                            type="text"
                            id="firstName"
                            name="firstName"
                            value="${user.firstname ? user.firstname : ""}"
                            autofocus
                        />
                    </div>
                    <div class="mb-3 col-md-6">
                        <label for="lastName" class="form-label">Last Name</label>
                        <input
                            class="form-control"
                            type="text"
                            name="lastName"
                            id="lastName"
                            value="${user.lastName ? user.lastName : ""}"
                        />
                    </div>
                    <div class="mb-3 col-md-6">
                        <label for="email" class="form-label">E-mail</label>
                        <input
                            class="form-control"
                            type="text"
                            id="email"
                            name="email"
                            value="${user.email ? user.email : ""}"
                            placeholder="john.doe@example.com"
                            disabled
                        />
                    </div>
                    <div class="mb-3 col-md-6">
                        <label for="username" class="form-label">Username</label>
                        <input
                            type="text"
                            class="form-control"
                            id="username"
                            name="username"
                            value="${user.userName ? user.userName : ""}"
                            disabled
                        />
                    </div>
                    <div class="mb-3 col-md-6">
                        <label class="form-label" for="phone">Phone Number</label>
                        <div class="input-group input-group-merge">
                        <span class="input-group-text">VN (+84)</span>
                        <input
                            type="text"
                            id="phone"
                            name="phone"
                            class="form-control"
                            placeholder="202 555 0111"
                            value="${user.phone ? user.phone : ""}"
                        />
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="mb-3 col-md-6">
                        <label for="accountNumber" class="form-label">Account Number</label>
                        <input
                            class="form-control"
                            type="text"
                            id="accountNumber"
                            name="accountNumber"
                            value="${
                              user.accountNumber ? user.accountNumber : ""
                            }"
                            autofocus
                        />
                    </div>
                    <div class="mb-3 col-md-6">
                        <label for="amount" class="form-label">Amount ($)</label>
                        <input
                            class="form-control"
                            type="text"
                            name="amount"
                            id="amount"
                            value="${user.amount ? user.amount : 0}"
                            disabled
                        />
                    </div>
                    <div class="mb-3 col-md-6">
                        <label for="transfer" class="form-label">Transfer ($)</label>
                        <input
                            class="form-control"
                            type="text"
                            id="transfer"
                            name="transferAmount"
                            placeholder="0"
                        />
                    </div>
                </div>
                
                <div class="row m-2" style="justify-content: end;">
                    <div class="ml-2">
                        <button type="submit" class="btn btn-primary me-2 btn-save">Save changes</button>
                    </div>
                    <div class="ml-2">
                        <button type="reset" class="btn btn-outline-secondary btn-back">Cancel</button>
                    </div>
                </div>
            `;

      idElForm.innerHTML = htmlDisplay;

      displayAvatar(user?.avatar);
    });
  }

  $(document).on("click", ".btn-save", function (e) {
    e.preventDefault();

    const idElFile = document.getElementById("formAccountSettings");
    const formData = new FormData(idElFile);

    fetch(`http://localhost:8080/users/profileId=${idUser}`, {
      method: "PUT",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data?.data) {
          alert("Success");
        } else {
          alert("Error");
        }
      })
      .catch((error) => {
        console.error("Error uploading image:", error);
      });
  });

  $(document).on("click", ".btn-back", function (e) {
    // prevent reload page
    e.preventDefault();
    window.location.replace("http://127.0.0.1:5500/profile.html");
  });

  function displayAvatar(fileName) {
    const data = !!fileName
      ? `http://localhost:8080/file/pathImage=avatars&fileName=${fileName}`
      : "../img/1.png";
    const idElFile = document.getElementById("uploadedAvatar");
    idElFile.setAttribute("src", data);
  }
});
