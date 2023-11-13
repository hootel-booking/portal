$(document).ready(function() {
    $(".btn-manage").hide();
    var role = localStorage.getItem("role");
    console.log("role is "+ role);

    if(role == "ROLE_ADMIN"){
        $(".btn-manage").show();
    }
})