//global
function GbLogOut(key) {
    var currentUser = localStorage.getItem(key);
    if (currentUser) {
        localStorage.removeItem(key);
    }
}
//backend
function CheckInfoUserLocal() {
    var currentUser = localStorage.getItem(CURRENT_USER_NAME);
    if (!currentUser) {
        window.location.href = BE_LOGIN;
    }
    return false;
}
function logout(){
    GbLogOut(CURRENT_USER_NAME);
}
$("#log-out").click(function () {
    Logout();
    CheckInfoUserLocal();
});
//front end 
var ListUser = new UserList();

//navigation login
$("#loginRegister").click(function () {
    window.location.href = FE_LOGIN;
});
//get user login
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

//login 
function validateForm() {
    var un = document.getElementById('username').value;
    var pw = document.getElementById('password').value;

    for (var i = 0; i < this.ListUser.DSND.length; i++) {
        if (un === this.ListUser.DSND[i].TaiKhoan && pw === this.ListUser.DSND[i].MatKhau) {
            localStorage.setItem(FE_USER_NAME, this.ListUser.DSND[i].HoTen);
            return true;
        }
    }
    alert("Login was unsuccessful, please check your username and password");
    return false;
}
//login success
$('#btnLogin').click(function () {
    validateForm();
    window.location.href = FE_INDEX;

});
$(document).ready(function () {
    var currentUser = localStorage.getItem(FE_USER_NAME);
    if (currentUser) {
        $('#loginRegister').css("display", "none");
        $('#logOut').removeClass("hidden-logout");
        $('#li-login').html("Chào, " + " " + currentUser);
    }
});
//logout
function LogoutFE(){
    GbLogOut(FE_USER_NAME);
    $('#logOut').css("display", "none");
    location.reload();
    
}


//get course
var CourseList = new CourseList();
$(document).ready(function () {
    $.ajax({
        type: 'GET',
        url: URL_COURSES,
        dataType: 'json'
    }).done(function (result) {
        CourseList.listCourse = result;
        createGridCourse();
        console.log(result);
    }).fail(function () {
        console.log(SERVER_ERROR);
    })
});

//show course FE
function createGridCourse() {
    var gridCourse = "";

    for (var i = 0; i < CourseList.listCourse.length; i++) {
        var itemCourse = CourseList.listCourse[i];
        var price = randomNumberFromRange(100, 200);
        var pricePromotion = randomNumberFromRange(50, 100);
        var percentPromotion = (price * 100) % pricePromotion;
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
//random price
function randomNumberFromRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
