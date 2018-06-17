var userService = new UserService();
var allCourseByUser = new CourseList();

var account = getItemLocalStorage(FE_ACCOUNT);
//get course
$(document).ready(function () {
    userService.GetCourseByUser(account).done(function (result) {
        allCourseByUser.listCourse = result;
        console.log(listCourse);
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