var userService = new UserService();
var allCourseByUser = new CourseList();
var ListUser = new UserList();
var UserEdit = new User();

var account = getItemLocalStorage(FE_ACCOUNT);
//get course
$(document).ready(function () {
    userService.GetCourseByUser(account).done(function (result) {
        if (result == "Did not find the course") {
            $('#notifyCourse').append("Did not find the course");
            return;
        }
        $('#notifyCourse').append("All Course of User");
        CreateTableCourse(result);
    }).fail(function () {
        console.log(SERVER_ERROR);
    })
});

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
        $('#navigateDashboard').css("display", "none");
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

function CreateTableCourse(arrayCourse) {
    var tablee = "";
    var count = 0;
    for (let i = 0; i < arrayCourse.length; i++) {
        var element = arrayCourse[i];
        NgayGhiDanhFormatted = formatDate(element.NgayGhiDanh);
        tablee +=
            `
        <ul class="row check-item">
            <li class="col-xs-2">
                <p>${count + 1}</p>
            </li>
            <li class="col-xs-2">
                <p>${element.MaKhoaHoc}</p>
            </li>
            <li class="col-xs-4">
                <p>${element.TenKhoaHoc}</p>
            </li>
            <li class="col-xs-2 text-center">
                <p>${NgayGhiDanhFormatted}</p>
            </li>
            <li class="col-xs-2 text-center">
                <p>${element.GiaoVu}</p>
            </li>
      </ul>
        `
        count++;
    }
    $('#tableContainer').append(tablee);
    $('#count').append(count);
}
function formatDate(date) {
    var dateFotmated = new Date(date);
    return (dateFotmated.getMonth() + 1) + '/' + dateFotmated.getDate() + '/' + dateFotmated.getFullYear() + " " + dateFotmated.getHours() + ":" + dateFotmated.getMinutes();
}