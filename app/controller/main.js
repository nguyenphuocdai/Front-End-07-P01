//global----------------------------------

var keyDecrypto = KEY_ENCRYPTO;
var CourseListFilterImage = new CourseList();
var CourseList = new CourseList();
var UserEdit = new User();
var ListUser = new UserList();

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
//-------------------------------------------------------Front End------------------------------------------------


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
//encrypt decrypt
function encrypt(data, key) {
    return CryptoJS.AES.encrypt(data, key).toString();
}
function decrypt(data, key) {
    return CryptoJS.AES.decrypt(data, key).toString(CryptoJS.enc.Utf8);
}
// END decrypt encrypt
//login ---------------------------
function validateForm() {
    var un = document.getElementById('username').value;
    var pw = document.getElementById('password').value;
    if (un == "" || pw == "") {
        localStorage.clear();
    }
    for (var i = 0; i < this.ListUser.DSND.length; i++) {
        //check 
        if (un === this.ListUser.DSND[i].TaiKhoan) {
            //giải mã password
            var resultDecrypto = decrypt(this.ListUser.DSND[i].MatKhau, keyDecrypto);
            if (pw === resultDecrypto) {
                localStorage.setItem(FE_USER_NAME, this.ListUser.DSND[i].HoTen);
                localStorage.setItem(FE_EMAIL, this.ListUser.DSND[i].Email);
                return true;
            }
        }
    }
    alert(LOGIN_FAILED);
    return false;
}
//login success---------------------------
$('#btnLogin').click(function () {
    validateForm();
    asyncCall();
});
// async await 
async function asyncCall() {
    swal({
        title: LOGIN_SUCCESSFULLY,
        text: TEXT_SUCCESSFULLY_CLOSE,
        timer: 3000,
        onOpen: () => {
            swal.showLoading()
        }
    }).then((result) => {
        if (
            result.dismiss === swal.DismissReason.timer
        ) {
            console.log(TEXT_ERROR_SWAL)
        }
    });
    var result = await resolveAfter2Seconds();
}
// expected output: "navigation page index"
function resolveAfter2Seconds() {
    return new Promise(resolve => {
        setTimeout(() => {
            var currentUser = localStorage.getItem(FE_USER_NAME);
            if (currentUser) {
                window.location.href = FE_INDEX
            }
        }, 3000);
    });
}
//show login logout index
$(document).ready(function () {
    var currentUser = localStorage.getItem(FE_USER_NAME);
    if (currentUser) {
        $('#loginRegister').css("display", "none");
        $('#logOut').removeClass("hidden-logout");
        $('#li-login').html("Chào bạn,  " + " " + " " + currentUser);
    }
});
//get course
$(document).ready(function () {
    $.ajax({
        type: 'GET',
        url: URL_COURSES,
        dataType: 'JSON'
    }).done(function (result) {
        CourseList.listCourse = result;
        FilterImage();
    }).fail(function () {
        console.log(SERVER_ERROR);
    })
});
//logout---------------------------
function LogoutFE() {
    GbLogOut(FE_USER_NAME);
    GbLogOut(FE_EMAIL);
    $('#logOut').css("display", "none");
    location.reload();
}

//show course FE---------------------------
function FilterImage() {
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
            title: PW_NOT_MATCHING,
            text: TEXT_PW_NOT_MATCHING,
            footer: `<a href>Why don't you check this password?</a>`,
        })
        return;
    }
    //   ------------------Encrypto password----------------------  

    var passwordEncrypted = encrypt(password, keyDecrypto);
    var decrypted = decrypt(passwordEncrypted, keyDecrypto);

    // ---------------end Encrypto---------------------
    //add user to Obj
    var user = new User(username, passwordEncrypted, fullname, email, phone, job);

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

//pagination -----------------------------------
var current_page = 1;
var records_per_page = 10;


function prevPage() {
    if (current_page > 1) {
        current_page--;
        changePage(current_page);
    }
}

function nextPage() {
    if (current_page < numPages()) {
        current_page++;
        changePage(current_page);
    }
}

function changePage(page) {
    var btn_next = document.getElementById("btn_next");
    var btn_prev = document.getElementById("btn_prev");
    var listing_table = document.getElementById("gridCourse");
    var page_span = document.getElementById("page");

    // Validate page
    if (page < 1) page = 1;
    if (page > numPages()) page = numPages();

    listing_table.innerHTML = "";

    for (var i = (page - 1) * records_per_page; i < (page * records_per_page); i++) {
        var itemCourse = CourseListFilterImage.listCourse[i];
        var price = randomNumberFromRange(100, 200);
        var percentPromotion = (randomNumberFromRange(50, 100));
        var pricePromotion = (price - (price * percentPromotion / 100)).toFixed(0);

        listing_table.innerHTML +=
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
    page_span.innerHTML = page;

    // if (page == 1) {
    //     btn_prev.style.visibility = "hidden";
    // } else {
    //     btn_prev.style.visibility = "visible";
    // }

    // if (page == numPages()) {
    //     btn_next.style.visibility = "hidden";
    // } else {
    //     btn_next.style.visibility = "visible";
    // }
}

function numPages() {
    return Math.ceil(CourseListFilterImage.listCourse.length / records_per_page);
}
$('#li-login').click(function () {
    $('.modal')
        .prop('class', 'modal fade') // revert to default
        .addClass($(this).data('direction'));
    $('.modal').modal('show');

    getUserEdit();


});
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
        var password = decrypt(UserEdit.MatKhau, keyDecrypto);
        $('#txtMK').val(password);
        $('#txtMKConfirm').val(password);
        $('#txtEmail').val(UserEdit.Email);
        $('#txtPhone').val(UserEdit.SoDT);
        $('#slJob').val(UserEdit.MaLoaiNguoiDung);
    }).fail(function () {
        console.log(SERVER_ERROR);
    })
}
function EditUser() {
    UserEdit.TaiKhoan = $('#txtTK').val();
    UserEdit.MatKhau = $('#txtMK').val();
    var passwordConfirm = $('#txtMKConfirm').val();
    UserEdit.Email = $('#txtEmail').val();
    UserEdit.SoDT = $('#txtPhone').val();
    UserEdit.MaLoaiNguoiDung = $('#slJob').val();

    var passwordEncrypted = encrypt(UserEdit.MatKhau, keyDecrypto);

    if (passwordConfirm != UserEdit.MatKhau) {
        $('input[name=passwordConfirm]').css('border', '1px solid red');
        swal({
            type: 'error',
            title: PW_NOT_MATCHING,
            text: TEXT_PW_NOT_MATCHING,
            footer: `<a href>Why don't you check this password?</a>`,
        })
        return;
    }
    else {
        UserEdit.MatKhau = passwordEncrypted;
    }
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
        asyncCallNotification(UPDATE_SUCCESSFULLY, UPDATE_SUCCESSFULLY_CLOSE);

    }).fail(function () {
        console.log(SERVER_ERROR);
    })
}
$('#btn--edit').click(function () {
    EditUser();
});
// optimize code
function Notification(title, text) {
    swal({
        title: title,
        text: text,
        timer: 3000,
        onOpen: () => {
            swal.showLoading()
        }
    })
}
function clearLocalStorage(key, action) {
    action == "remove" ? localStorage.removeItem(key) : localStorage.getItem(key);
}
function navigationWindow(key) {
    window.location.href = key;
}
async function asyncCallNotification(key, text) {
    Notification(key, text);
    var result = await resolveNavigation();
}
// expected output: "navigation page index"
function resolveNavigation() {
    return new Promise(resolve => {
        setTimeout(() => {
            navigationWindow(FE_LOGIN);
        }, 3000);
    });
}
// end optimize