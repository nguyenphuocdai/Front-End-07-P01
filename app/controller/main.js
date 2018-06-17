//------------------------------------------------------Global----------------------------------

var keyDecrypto = KEY_ENCRYPTO;
var CourseListFilterImage = new CourseList();
var CourseList = new CourseList();
var CouseService = new CourseService();
var UserEdit = new User();
var ListUser = new UserList();


function GbLogOut(key) {
    var currentUser = localStorage.getItem(key);
    if (currentUser) {
        localStorage.removeItem(key);
    }
}
//---------------------------------------------------------Back End--------------------------------
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
    getListUser();
});
//get ListUser
function getListUser() {
    $.ajax({
        type: 'GET',
        url: URL_USER_LOGIN,
        dataType: 'json'
    }).done(function (result) {
        ListUser.DSND = result;
    }).fail(function () {
        console.log(SERVER_ERROR);
    })
}
//encrypt decrypt
function encrypt(data, key) {
    return CryptoJS.AES.encrypt(data, key).toString();
}
function decrypt(data, key) {
    return CryptoJS.AES.decrypt(data, key).toString(CryptoJS.enc.Utf8);
}
// END decrypt encrypt
//login ---------------------------
function login() {
    var un = document.getElementById('username').value;
    var pw = document.getElementById('password').value;
    localStorage.clear();
    if (un == "") {
        $(document.getElementById('username')).notify(
            "Please, input username to login",
            { position: "left" }
        );
    }
    if (pw == "") {
        $(document.getElementById('password')).notify(
            "Please, input password to login",
            { position: "left" }
        );
    }
    for (var i = 0; i < this.ListUser.DSND.length; i++) {
        //check 
        if (un === this.ListUser.DSND[i].TaiKhoan) {
            //giải mã password
            var resultDecrypto = decrypt(this.ListUser.DSND[i].MatKhau, keyDecrypto);
            if (pw === resultDecrypto) {
                localStorage.setItem(FE_USER_NAME, this.ListUser.DSND[i].HoTen);
                localStorage.setItem(FE_ACCOUNT, this.ListUser.DSND[i].TaiKhoan);
                localStorage.setItem(FE_EMAIL, this.ListUser.DSND[i].Email);
                $("#btnLogin").notify(
                    LOGIN_SUCCESSFULLY, "success",
                    { position: "right", autoHideDelay: 3000 }
                );
                return true;
            }
        }
    }
    return false;
}
//login success---------------------------
$('#btnLogin').click(function () {
    if (login()) {
        setTimeout(function () {
            window.location.href = FE_INDEX
        }, 3000);
    }
    else {
        $("#btnLogin").notify(FE_ERRROR_LOGIN, "error");
    }
});
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
        changePage(1);
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

//show course FE---------------------------
function FilterImage() {
    var gridCourse = "";
    //$ check image valid---------------------------
    for (var i = 0; i < CourseList.listCourse.length; i++) {
        var codeLine = CourseList.listCourse[i].HinhAnh;
        if (!codeLine) {
            return;
        }
        if (codeLine) {
            var extension = codeLine.substr(codeLine.lastIndexOf("."));
        }

        if ((extension == ".jpg" || extension == ".png" || extension == ".jpeg")) {
            CourseListFilterImage.listCourse.push(CourseList.listCourse[i]);
        }
    }
}

//--------------------------------Regex-----------------------------
function checkPassword(str) {
    // at least one number, one lowercase and one uppercase letter
    // at least six characters that are letters, numbers or the underscore
    var re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])\w{6,}$/;
    return re.test(str);
}
function validatePassword() {
    var password = $('#txtMK').val();
    if (password.length >= 6) {
        if (checkPassword(password) == false) {
            $('#txtMK').notify("Please, Password at least one number, one lowercase and one uppercase letter", "error",
                { position: "bottom" }
            )
        }
        else {
            toggleNotify();
        }
    }
    else {
        $('#txtMK').notify("Please, Password at least 6 characters", "error",
            { position: "bottom" }
        )
    }

}
function validatePasswordConfirm() {
    var password = $('#txtMK').val();
    var passwordConfirm = $('#txtPasswordConfirm').val();

    if (password !== passwordConfirm) {
        $('#txtPasswordConfirm').notify("Please, Not to match password", "error",
            { position: "bottom" }
        )
    }
    else {
        toggleNotify();
    }
}
function regexEmail(email) {
    var re = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return re.test(String(email).toLowerCase());
}
function validateEmail() {
    var email = $('#txtEmail').val();
    if (regexEmail(email) == false) {
        $('#txtEmail').notify("Please, Email not to match format", "error",
            { position: "bottom" }
        )
    }
    else {
        toggleNotify();
    }
}
function onChangePhoneNumber() {
    var phones = [{ "mask": "(###)-###-####" }, { "mask": "(#####)-###-##############" }];
    $('#txtPhone').inputmask({
        mask: phones,
        greedy: false,
        definitions: { '#': { validator: "[0-9]", cardinality: 1, length: 11 } }
    });
}
function regexUserName(str) {
    var usernameRegex = /^[-\w\.\$@\*\!]{1,30}$/;
    return usernameRegex.test(str);
}
function onChangeUsername() {
    var username = $('#txtTK').val();
    if (regexUserName(username) == false) {
        $('#txtTK').notify("Please, Username not to match format", "error",
            { position: "bottom" }
        )
    }
    else {
        toggleNotify();
    }
}

// --------------------------------------------------------------------


//add user---------------------------
var userSevices = new UserService();
var listUser = new UserList();
function getElementById(Id) {
    return $(Id);
}
function registerUser() {
    var username = $('#txtTK').val();
    var password = $('#txtMK').val();
    var passwordConfirm = $('#txtPasswordConfirm').val();
    var fullname = $('#txtHT').val();
    var email = $('#txtEmail').val();
    var phone = $('#txtPhone').val().replace(/[-()]/g, "");
    var job = $('#slJob').val();
    var arrayInput = [getElementById("#txtTK"), getElementById("#txtMK"), getElementById("#txtHT"), getElementById("#txtEmail"), getElementById("#txtPhone")];
    //check valid input
    if (!CheckInput(arrayInput)) return;
    //check password confirm

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
        $("#btn-register").notify(
            REGISTER_USER_SUCCESSFULLY, "success",
            { position: "right", autoHideDelay: 3000 }
        );
        clearInput();
        $('#username').val(username);
        $('#password').val(password);
        $('#btnLogin').focus();
        getListUser();
        login();
    })
    resultAddUser.fail(function (resultAdd) {
        console.log(resultAdd)
    });

}
// btn register---------------------------
$('#btn-register').on({
    'click': registerUser
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
        array[i].focus();
        if (array[i].val() == "") {
            array[i].css('border', '1px solid red');
            return false;
        };
    }
    return true;
}

//---------------------------random price---------------------------
function randomNumberFromRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
// -----------------------------------------------------------------
//pagination -----------------------------------
var current_page = 1;
var records_per_page = 5;


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
    var paginationNumber = "";
    // Validate page
    if (page < 1) page = 1;
    if (page > numPages()) page = numPages();

    listing_table.innerHTML = "";

    for (let i = 0; i < numPages(); i++) {
        paginationNumber += `
        <li class="page-item">
            <a class="page-link" id="page-${i + 1}">${i}</a>
        </li>
        `
        $('#pagination').appendTo(paginationNumber);
    }
    for (var i = (page - 1) * records_per_page; i < (page * records_per_page); i++) {
        var itemCourse = CourseListFilterImage.listCourse[i];
        if (!itemCourse || itemCourse === undefined) {
            break;
        }
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
            <span class="tag">${itemCourse.NguoiTao} - ${itemCourse.MaKhoaHoc}</span>
            <a href="#." class="tittle btn--detail" data-value="${itemCourse.MaKhoaHoc}">${itemCourse.TenKhoaHoc}</a>
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
            <a class="cart-btn cart-register" id="${itemCourse.MaKhoaHoc}">
                <i class="icon-basket-loaded"></i>
            </a>
            </article>
        </div>
        `
    }
}

function numPages() {
    return Math.ceil(CourseListFilterImage.listCourse.length / records_per_page);
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

// ---------------------------------Promise register Course--------------------------------------

// register course 
var CourseIdCLicked;

$('body').delegate('.cart-register', 'click', function () {
    CourseIdCLicked = $(this).attr('id');
    asyncCallRegister();
});

async function asyncCallRegister() {
    // registerConfirm();
    if (confirm(FE_CONFIRM)) {
        var result = await resolveRegisterAlter2Second();
    } else {
        alert(FE_CONFIRM_NO)
    }

}
// expected output: "navigation page index"
function resolveRegisterAlter2Second() {
    return new Promise(resolve => {
        setTimeout(() => {
            var getAcountCurrent = getItemLocalStorage(FE_ACCOUNT);
            CouseService.registerCourse(CourseIdCLicked, getAcountCurrent)
                .done(function (result) {
                    console.log(result);
                    $(`#$CourseIdCLicked}`).notify(
                        REGISTER_SUCCESSFULLY, "success",
                        { position: "right" }
                    );
                }).fail(function () {
                    console.log(SERVER_ERROR);
                })
        }, 2000);
    });
}
// detail-course
$('body').delegate('.btn--detail', 'click', function () {
    var maKhoaHoc = $(this).attr('data-value');
    window.location.assign(`detail-course.html?${maKhoaHoc}`);
    setItemLocalstorage(FE_COURSE_ID, maKhoaHoc);
})



























//-------------------------------------------------------------------------

// optimize code
function Notify(title, text) {
    swal({
        title: title,
        text: text,
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
    })
}
function clearLocalStorage(key, action) {
    action == "remove" ? localStorage.removeItem(key) : localStorage.getItem(key);
}
function getItemLocalStorage(key) {
    return localStorage.getItem(key);
}
function setItemLocalstorage(key, value) {
    return localStorage.setItem(key, value);
}
function navigationWindow(key) {
    window.location.href = key;
}
async function asyncCallNotify(key, text) {
    Notify(key, text);
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
function toggleNotify() {
    $('.notifyjs-wrapper').css("display", "none");
}
// end optimize