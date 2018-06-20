var CouseService = new CourseService();
var Detail = new DetailCourse();
var UserEdit = new User();
var maKhoaHoc = getItemLocalStorage(FE_COURSE_ID);
CouseService.detailCourse(maKhoaHoc).done(function (result) {
    Detail = result;
    $('#nameCourse').append(Detail.TenKhoaHoc);
    $('#review').append(Detail.LuotXem);
    $('#creater').append(Detail.NguoiTao);
    $('#description').append(Detail.MoTa);
    $('#my_image').attr('src', Detail.HinhAnh);
    console.log(Detail);
}).fail(function () {
    console.log(SERVER_ERROR);
});

function clearLocalStorage(key, action) {
    action == "remove" ? localStorage.removeItem(key) : localStorage.getItem(key);
}
function getItemLocalStorage(key) {
    return localStorage.getItem(key);
}
function setItemLocalstorage(key, value) {
    return localStorage.setItem(key, value);
}
//logout---------------------------
function LogoutFE() {
    GbLogOut(FE_USER_NAME);
    GbLogOut(FE_ACCOUNT);
    GbLogOut(FE_EMAIL);
    $('#logOut').css("display", "none");
    location.reload();
}

function getItemLocalStorage(key) {
    return localStorage.getItem(key);
}
//navigation login---------------------------
$("#loginRegister").click(function () {
    window.location.href = FE_LOGIN;
});

$(document).ready(function () {
    var currentUser = localStorage.getItem(FE_USER_NAME);
    if (currentUser) {
        $('#loginRegister').css("display", "none");
        $('#logOut').removeClass("hidden-logout");
        $('#li-login').html("Chào bạn,  " + " " + " " + currentUser);
    }
});
function LogoutFE() {
    GbLogOut(FE_USER_NAME);
    GbLogOut(FE_ACCOUNT);
    GbLogOut(FE_EMAIL);
    $('#logOut').css("display", "none");
    location.reload();
}
function GbLogOut(key) {
    var currentUser = localStorage.getItem(key);
    if (currentUser) {
        localStorage.removeItem(key);
    }
}
function logout() {
    GbLogOut(CURRENT_USER_NAME);
}
//show modal edit user
$('#li-login').click(function () {
    $('.modal')
        .prop('class', 'modal fade') // revert to default
        .addClass($(this).data('direction'));
    $('.modal').modal('show');
    getUserEdit();

});
//get user edit
var passwordOld;

function getUserEdit() {
    var currentUser = localStorage.getItem(FE_EMAIL);
    $.ajax({
        type: 'GET',
        url: URL_USER_LOGIN,
        dataType: 'json'
    }).done(function (result) {
        ListUser.DSND = result;
        for (var i = 0; i < result.length; i++) {
            if (currentUser === result[i].Email) {
                UserEdit.TaiKhoan = result[i].TaiKhoan;
                UserEdit.Email = result[i].Email;
                UserEdit.MatKhau = result[i].MatKhau;
                UserEdit.SoDT = result[i].SoDT;
                UserEdit.HoTen = result[i].HoTen;
                UserEdit.MaLoaiNguoiDung = result[i].MaLoaiNguoiDung;
            }
        }
        $('#txtTK').val(UserEdit.TaiKhoan);
        $('#txtEmail').val(UserEdit.Email);
        $('#txtPhone').val(UserEdit.SoDT);
        $('#slJob').val(UserEdit.MaLoaiNguoiDung);
        var password = decrypt(UserEdit.MatKhau, keyDecrypto);
        passwordOld = password;

    }).fail(function () {
        console.log(SERVER_ERROR);
    })
}
//process edit user
function EditUser() {
    UserEdit.TaiKhoan = $('#txtTK').val();
    UserEdit.Email = $('#txtEmail').val();
    UserEdit.SoDT = $('#txtPhone').val();
    UserEdit.MaLoaiNguoiDung = $('#slJob').val();
    var passwordConfirm = $('#txtMKConfirm').val();
    var passwordInput = $('#txtMK_Old').val();
    UserEdit.MatKhau = $('#txtMK').val();
    if (passwordInput != passwordOld) {
        $("#txtMK_Old").notify(
            FE_ERROR_PASSWORD, "error",
            { position: "right", autoHideDelay: 3000 }
        );
        return false;
    }
    else {
        toggleNotify();
    }
    if (passwordConfirm != passwordNew) {
        $('input[name=passwordConfirm]').css('border', '1px solid red');
        $("#txtMKConfirm").notify(
            FE_NOT_MATCH_PASSWORD_NEW, "error",
            { position: "right", autoHideDelay: 3000 }
        );
        return false;
    }
    return true;
}
//btn click to edit user
$('#btn--edit').click(function () {
    if (EditUser()) {
        var jsonUserEdit = JSON.stringify(UserEdit);
        $.ajax({
            type: "PUT",
            url: URL_USER_EDIT,
            dataType: 'json',
            contentType: "application/json",
            data: jsonUserEdit
        }).done(function (result) {
            clearLocalStorage(FE_USER_NAME, ACTION_REMOVE);
            clearLocalStorage(FE_EMAIL, ACTION_REMOVE);
            asyncCallNotify(UPDATE_SUCCESSFULLY, UPDATE_SUCCESSFULLY_CLOSE);

        }).fail(function () {
            console.log(SERVER_ERROR);
        })
    }
    else {
        $("#btn--edit").notify(
            FE_UPDATE_FAILED, "error",
            { position: "right", autoHideDelay: 3000 }
        );
    }
});



//navigation
$("#course").click(function () {
    window.location.href = FE_COURSE_OF_USER;
});
$("#home").click(function () {
    window.location.href = FE_INDEX;
});
