function deleteRoom(id,element) {
    console.log($(element).parents(".col-lg-4"));
    $.ajax({
        type: 'DELETE',
        contentType: "application/json",
        url: "http://localhost:7100/modify/delete/" ,
        data: {
            "id":"1"
        },
        dataType: 'json',
        success: function (result) {
            console.log(result);
            if(result){
                $(element).parents(".col-lg-4").remove();
            }
            // (Optional) Cập nhật giao diện người dùng sau khi xóa thành công (nếu cần)
        },
        error: function (e) {
            console.log(e);
        }
    });
}

$(document).ready(function() {
    $('.delete-button').click(function() {
        var roomId = $(this).data('room-id');
        deleteRoom(roomId,$(this));
    });
});