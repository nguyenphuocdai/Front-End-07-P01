//global----------------------------------
function GbLogOut(key) {
    var currentUser = localStorage.getItem(key);
    if (currentUser) {
        localStorage.removeItem(key);
    }
}
//backend--------------------------------
function CheckInfoUserLocal() {
    var currentUser = localStorage.getItem(CURRENT_USER_NAME);
    if (!currentUser) {
        window.location.href = BE_LOGIN;
    }
    return false;
}
function logout() {
    GbLogOut(CURRENT_USER_NAME);
}
$("#log-out").click(function () {
    Logout();
    CheckInfoUserLocal();
});
//front end -------------------------------
var ListUser = new UserList();

//navigation login---------------------------
$("#loginRegister").click(function () {
    window.location.href = FE_LOGIN;
});
//get user login---------------------------
$(document).ready(function () {
    $.ajax({
        type: 'GET',
        url: URL_USER_LOGIN,
        dataType: 'json'
    }).done(function (result) {
        ListUser.DSND = result;
    }).fail(function () {
        console.log(SERVER_ERROR);
    })
});

//login ---------------------------
function validateForm() {
    var un = document.getElementById('username').value;
    var pw = document.getElementById('password').value;
    if (un == "" || pw == "") {
        localStorage.removeItem(FE_USER_NAME);
    }
    for (var i = 0; i < this.ListUser.DSND.length; i++) {
        if (un === this.ListUser.DSND[i].TaiKhoan && pw === this.ListUser.DSND[i].MatKhau) {
            localStorage.setItem(FE_USER_NAME, this.ListUser.DSND[i].HoTen);
            return true;
        }
    }
    alert("Login was unsuccessful, please check your username and password");
    return false;
}
//login success---------------------------
$('#btnLogin').click(function () {
    validateForm();
    var currentUser = localStorage.getItem(FE_USER_NAME);
    if (currentUser) {
        window.location.href = FE_INDEX;
    }
});
$(document).ready(function () {
    var currentUser = localStorage.getItem(FE_USER_NAME);
    if (currentUser) {
        $('#loginRegister').css("display", "none");
        $('#logOut').removeClass("hidden-logout");
        $('#li-login').html("Chào, " + " " + currentUser);
    }
});
//logout---------------------------
function LogoutFE() {
    GbLogOut(FE_USER_NAME);
    $('#logOut').css("display", "none");
    location.reload();
}

//get course---------------------------
var CourseListFilterImage = new CourseList();
var CourseList = new CourseList();

$(document).ready(function () {
    $.ajax({
        type: 'GET',
        url: URL_COURSES,
        dataType: 'json'
    }).done(function (result) {
        CourseList.listCourse = result;
        createGridCourse();
    }).fail(function () {
        console.log(SERVER_ERROR);
    })
});

//show course FE---------------------------
function createGridCourse() {
    var gridCourse = "";
    //$ check image valid---------------------------
    for (var i = 0; i < CourseList.listCourse.length; i++) {
        var codeLine = CourseList.listCourse[i].HinhAnh;
        if (codeLine) {
            var extension = codeLine.substr(codeLine.lastIndexOf("."));
        }
        if ((extension == ".jpg" || extension == ".png" || extension == ".jpeg")) {
            CourseListFilterImage.listCourse.push(CourseList.listCourse[i]);
        }
    }
    // binding product---------------------------
    for (var i = 0; i < CourseListFilterImage.listCourse.length; i++) {
        var itemCourse = CourseListFilterImage.listCourse[i];

        var price = randomNumberFromRange(100, 200);
        var percentPromotion = (randomNumberFromRange(50, 100));
        var pricePromotion = (price - (price * percentPromotion / 100)).toFixed(0);

        gridCourse +=
            `
            <div class="product">
                <article>
                <img class="img-responsive" src="${itemCourse.HinhAnh}" alt="" width="184" height="106">
                <span class="sale-tag">-${percentPromotion}%</span>

                <!-- Content -->
                <span class="tag">${itemCourse.NguoiTao}</span>
                <a href="#." class="tittle">${itemCourse.TenKhoaHoc}</a>
                <!-- Reviews -->
                <p class="rev">
                    <i class="fa fa-star"></i>
                    <i class="fa fa-star"></i>
                    <i class="fa fa-star"></i>
                    <i class="fa fa-star"></i>
                    <i class="fa fa-star"></i>
                    <span class="margin-left-10">${itemCourse.LuotXem} Review(s)</span>
                </p>
                <div class="price">$${pricePromotion}
                    <span>$${price}</span>
                </div>
                <a href="#." class="cart-btn">
                    <i class="icon-basket-loaded"></i>
                </a>
                </article>
            </div>
            `
    }
    $('#gridCourse').html(gridCourse);
}
//random price---------------------------
function randomNumberFromRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
//add user---------------------------
var userSevices = new UserService();
var listUser = new UserList();
function getElementById(Id) {
    return $(Id);
}
function addUser() {
    var username = $('#txtTK').val();
    var password = $('#txtMK').val();
    var passwordConfirm = $('#txtPasswordConfirm').val();
    var fullname = $('#txtHT').val();
    var email = $('#txtEmail').val();
    var phone = $('#txtPhone').val();
    var job = $('#slJob').val();
    var arrayInput = [getElementById("#txtTK"), getElementById("#txtMK"), getElementById("#txtHT"), getElementById("#txtEmail"), getElementById("#txtPhone")];
    //check valid input
    if (!CheckInput(arrayInput)) return;
    //check password confirm
    if (password !== passwordConfirm) {
        $('input[name=passwordConfirm]').css('border', '1px solid red');
        swal({
            type: 'error',
            title: 'Not Matching',
            text: 'Something went wrong!',
            footer: `<a href>Why don't you check this password?</a>`,
        })
        return;
    }
    //add user to Obj
    var user = new User(username, password, fullname, email, phone, job);

    //add user to server
    var resultAddUser = userSevices.addUserAjax(user)
    resultAddUser.done(function (resultAdd) {
        listUser.DSND = resultAdd;
        swal({
            type: 'success',
            title: 'Your work has been saved',
            showConfirmButton: false,
            timer: 1500
        });
        clearInput();
        $('#username').val(username);
        $('#password').val(password);
    })
    resultAddUser.fail(function (resultAdd) {
        console.log(resultAdd)
    });

}
// btn register---------------------------
$('#btn-register').on({
    'click': addUser
});

//clear input function ---------------------------
function clearInput() {
    var username = $('#txtTK').val("");
    var password = $('#txtMK').val("");
    var passwordConfirm = $('#txtPasswordConfirm').val("");
    var fullname = $('#txtHT').val("");
    var email = $('#txtEmail').val("");
    var phone = $('#txtPhone').val("");
    var job = $('#slJob').val("HV");
    $('input[name=passwordConfirm]').css('border', '1px solid #e2e2e2');
}
// check input invalid---------------------------
function CheckInput(array) {
    for (var i = 0; i < array.length; i++) {
        array[i].css('border', '1px solid #e2e2e2');
        if (array[i].val() == "") {
            array[i].css('border', '1px solid red');
            return false;
        };
    }
    return true;
}