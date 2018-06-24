var Courses = new CourseService();
var objCourse = new CourseList();
var ListUser = new UserList();
var UserServices = new UserService();
var keyDecrypto = KEY_ENCRYPTO;

$('#containerAdd').fadeIn().hide();
$('#containerAddUser').fadeIn().hide();
$('#containerEdit').fadeIn().hide();
$('#containerEditUser').fadeIn().hide();
$('#divDetail').fadeIn().hide();

$(document).ready(function () {
    var role = localStorage.getItem(FE_ROLE_USER);
    if (role != "GV") {
        window.location.href = FE_ERROR_401;
    }
});

function formatNum(str) {
    var ind = str.length % 3;
    return str.length > 3 ? (str.slice(0, ind) + '.' + str.slice(ind).match(/\d{1,3}/g).join('.')) : str;
}

function GetCourses() {
    var count = 0;
    this.Courses.GetCourses()
        .done(function (result) {
            objCourse = result;
            objCourse.forEach(function (element) {
                count += element.LuotXem;
            });
            $('#totalCourse').append(objCourse.length);
            $('#totalReview').append(formatNum(count.toString()));

        }).fail(function () {
            console.log(SERVER_ERROR);
        });
}

function GetUser() {
    $.ajax({
        type: 'GET',
        url: URL_USER_LOGIN,
        dataType: 'json'
    }).done(function (result) {
        ListUser.DSND = result;
        $('#totalUser').append(ListUser.DSND.length);
    }).fail(function () {
        console.log(SERVER_ERROR);
    })
}
function GetUserStudent() {
    $.ajax({
        type: 'GET',
        url: "http://sv.myclass.vn/api/QuanLyTrungTam/DanhSachHocvien"
    }).done(function (result) {
        $('#totalStudent').append(result.length);
    }).fail(function () {
        console.log(SERVER_ERROR);
    })
}

GetCourses();
GetUser();
GetUserStudent();

var CreateTable = $(function () {
    (function (name) {
        var container = $('#pagination-' + name);
        var sources = function () {
            var result = [];

            for (var i = 0; i < objCourse.length; i++) {
                result.push(i);
            }
            return result;
        }();

        var options = {
            dataSource:
                function (done) {
                    $.ajax({
                        type: 'GET',
                        url: URL_COURSES,
                        success: function (response) {
                            localStorage.setItem('allCourse', JSON.stringify(response));
                            done(response);
                        }
                    });
                },
            pageSize: 10,
            callback: function (response, pagination) {
                var dataHtml = `
                    <thead>
                      <tr class="bg-light">
                        <th class="border-bottom-0">Số thứ tự</th>
                        <th class="border-bottom-0">Mã khóa học</th>
                        <th class="border-bottom-0" style="width: 1%;">Tên khóa học</th>
                        <th class="border-bottom-0">Lượt xem</th>
                        <th class="border-bottom-0">Giảng viên</th>
                        <th class="border-bottom-0"></th>
                        <th class="border-bottom-0"></th>
                      </tr>
                    </thead>
                `;
                $.each(response, function (index, item) {
                    dataHtml +=
                        `
                    <tr id="tr-${item.MaKhoaHoc}">
                        <td>#${index + 1}</td>
                        <td style="font-weight: 600">${item.MaKhoaHoc}</td>
                        <td>${item.TenKhoaHoc}</td>
                        <td>${item.LuotXem}</td>
                        <td>${item.NguoiTao}</td>
                        <td>
                          <button class="badge badge-info" id="${item.MaKhoaHoc}" onclick="EditCourse(this)"><i class="fa fa-edit dlt"></i></button>
                        </td>
                        <td>
                          <button class="badge badge-danger dlt" id="${item.MaKhoaHoc}" onclick="deleteCourse(this)"><i class="fa fa-times dlt"></i></button>
                        </td>
                      </tr>
                    `
                });
                container.prev().html(dataHtml);
            }
        };

        container.addHook('beforeInit', function () {
        });
        container.pagination(options);

        container.addHook('beforePageOnClick', function () {
        });
    })('demo1');
});
CreateTable;

function deleteCourse(button) {
    $.alertable.confirm('Are you sure delete this data?').then(function () {
        Courses.DeleteCourse(button.id).done(function (result) {
            $(`#tr-${button.id}`).remove();
            Courses.resultDelete = result;
            console.log(Courses.resultDelete);
            CreateTable;
        }).fail(function (result) {
            Courses.resultDelete = result;
            $(button).notify(
                "500 (Internal Server Error)", "danger",
                { position: "bottom", autoHideDelay: 3000 }
            );
            return false;
        });
    }, function () {
        return false;
    });
}

function GetDataCourse() {
    var MaKhoaHoc = $('#txtMaKhoaHoc').val();
    var TenKhoaHoc = $('#txtTenKhoaHoc').val();
    var HinhAnh = $('#txtHinhAnh').val();
    var MoTa = $('#txtMoTa').val();
    var LuotXem = Math.floor(Math.random() * 1000).toString();
    var NguoiTao = localStorage.getItem(FE_ACCOUNT);
    var objCourse = new DetailCourse(MaKhoaHoc, TenKhoaHoc, MoTa, LuotXem, HinhAnh, NguoiTao);

    return objCourse;
}

function RegisterCourseServer() {
    var objCourse = GetDataCourse();

    var MaKhoaHoc = $('#txtMaKhoaHoc').val();
    var TenKhoaHoc = $('#txtTenKhoaHoc').val();
    var HinhAnh = $('#txtHinhAnh').val();
    var MoTa = $('#txtMoTa').val();

    if (MaKhoaHoc === "" || TenKhoaHoc === "" || HinhAnh === "" || MoTa === "") {
        $("#btn-submit").notify(
            "Dữ liệu không được để trống, không thể thực hiện.", "warning",
            { position: "bottom", autoHideDelay: 3000 }
        );
        return;
    }
    else {
        toggleNotify();
    }

    console.log(objCourse);
    Courses.AddCourse(objCourse).done(function (result) {
        setTimeout(function () {
            $('#divTable').show();
            $('#containerAdd').hide();
            CreateTable;
        }, 3000);

        $("#btn-submit").notify(
            "Register Successfully !", "success",
            { position: "right", autoHideDelay: 3000 }
        );
        clearInputCourse();
    }).fail(function (result) {
        $("#btn-submit").notify(
            SERVER_ERROR, "danger",
            { position: "right", autoHideDelay: 3000 }
        );
        console.log(SERVER_ERROR);
    });
}

function clearInputCourse() {
    $('#txtMaKhoaHoc').val('');
    $('#txtTenKhoaHoc').val('');
    $('#txtHinhAnh').val('');
    $('#txtMoTa').val('');
}

$('#btn-submit').click(function () {
    RegisterCourseServer();
});
$('#btnShowAdd').click(function () {
    $('#divTable').fadeIn().hide();
    $('#containerAdd').fadeIn().show();
    $('#containerEdit').fadeIn().hide();
});
$('#btn-cancel').click(function () {
    $('#divTable').fadeIn().show();
    $('#containerAdd').fadeIn().hide();
    $('#containerEdit').fadeIn().hide();
});
$('#btn-cancel-edit').click(function () {
    $('#divTable').fadeIn().show();
    $('#containerAdd').fadeIn().hide();
    $('#containerEdit').fadeIn().hide();
});





//info admin login
$('#feName').html("Chào bạn, " + localStorage.getItem(FE_USER_NAME));

function LogOut() {
    localStorage.clear();
    window.location.href = FE_INDEX;
}

var arrayListcourse = [];
var retrievedObject = localStorage.getItem('allCourse');
arrayListcourse = JSON.parse(retrievedObject);
// var couseEdit = new DetailCourse();

function EditCourse(button) {
    setTimeout(function () {
        $('#divTable').fadeIn().hide();
        $('#containerEdit').fadeIn().show();
    }, 300);

    var MaKhoaHocToEdit = button.id;

    arrayListcourse.forEach(function (element) {
        if (MaKhoaHocToEdit === element.MaKhoaHoc) {
            $('#txtMaKhoaHocEdit').val(element.MaKhoaHoc);
            $('#txtTenKhoaHocEdit').val(element.TenKhoaHoc);
            $('#txtMoTaEdit').val(element.MoTa);

            localStorage.setItem("MaKhoaHoc", element.MaKhoaHoc);
            localStorage.setItem("TenKhoaHoc", element.TenKhoaHoc);
            localStorage.setItem("HinhAnh", element.HinhAnh);
            localStorage.setItem("MoTa", element.MoTa);
            console.log(element);
        }
    });
}
function SubmitEditCourse() {
    var MaKhoaHocOld = localStorage.getItem("MaKhoaHoc");
    var TenKhoaHocOld = localStorage.getItem("TenKhoaHoc");
    var HinhAnhOld = localStorage.getItem("HinhAnh");
    var MoTaOld = localStorage.getItem("MoTa");

    var MaKhoaHocNew = $('#txtMaKhoaHocEdit').val();
    var TenKhoaHocNew = $('#txtTenKhoaHocEdit').val();
    var MoTaNew = $('#txtMoTaEdit').val();

    var View = Math.floor(Math.random() * 1000).toString();
    var Creator = localStorage.getItem(FE_ACCOUNT);

    if (MaKhoaHocNew === MaKhoaHocOld && TenKhoaHocNew === TenKhoaHocOld && MoTaNew === MoTaOld) {
        $("#btn-edit").notify(
            "Dữ liệu không thay đổi, không thể thực hiện.", "warning",
            { position: "bottom", autoHideDelay: 3000 }
        );
        return;
    }
    console.log(MaKhoaHocNew);
    //id, name, description, view, creator
    Courses.EditCourse(MaKhoaHocNew, TenKhoaHocNew, MoTaNew, View, Creator)
        .done(function (result) {
            $("#btn-edit").notify(
                UPDATE_COURSE_SUCCESSFULLY, "success",
                { position: "bottom", autoHideDelay: 3000 }
            );
            setTimeout(function () {
                $('#divTable').fadeIn().show();
                $('#containerEdit').fadeIn().hide();
            }, 3200);
            CreateTable;
        }).fail(function (result) {
            console.log(SERVER_ERROR);
        });
}
$('#btn-edit').click(function () {
    SubmitEditCourse();
});



// -----------------------------------tab user----------------------------

var CreateTableUser = $(function () {
    (function (name) {
        var container = $('#pagination-' + name);
        var sources = function () {
            var result = [];

            for (var i = 0; i < objCourse.length; i++) {
                result.push(i);
            }
            return result;
        }();

        var options = {
            dataSource:
                function (done) {
                    $.ajax({
                        type: 'GET',
                        url: URL_USER_LOGIN,
                        success: function (response) {
                            localStorage.setItem('AllUser', JSON.stringify(response));
                            done(response);
                        }
                    });
                },
            pageSize: 10,
            callback: function (response, pagination) {
                var dataHtml = `
                    <thead>
                      <tr class="bg-light">
                      <th class="border-bottom-0">Số thứ tự</th>
                        <th class="border-bottom-0">Tài khoản</th>
                        <th class="border-bottom-0" style="width: 1%;">Tên người dùng</th>
                        <th class="border-bottom-0">Email</th>
                        <th class="border-bottom-0">Số điện thoại</th>
                        <th class="border-bottom-0"></th>
                        <th class="border-bottom-0"></th>
                      </tr>
                    </thead>
                `;
                $.each(response, function (index, item) {
                    dataHtml +=
                        `
                    <tr id="tr-${item.TaiKhoan}">
                        <td>#${index + 1} - ${item.TenLoaiNguoiDung}</td>
                        <td style="font-weight: 600"><a class="mt-2 text-success font-weight-bold dlt" id="${item.TaiKhoan}" title="Ấn để xem khóa học đăng ký của ${item.HoTen}" onclick="ShowDetailUser(this)">${item.TaiKhoan}</a></td>
                        <td>${item.HoTen}</td>
                        <td>${item.Email}</td>
                        <td>${item.SoDT}</td>
                        <td>
                          <button class="badge badge-info" id="${item.TaiKhoan}" onclick="EditUser(this)"><i class="fa fa-edit dlt"></i></button>
                        </td>
                        <td>
                          <button class="badge badge-danger dlt" id="${item.TaiKhoan}" onclick="deleteUser(this)"><i class="fa fa-times dlt"></i></button>
                        </td>
                      </tr>
                    `
                });
                container.prev().html(dataHtml);
            }
        };

        container.addHook('beforeInit', function () {
        });
        container.pagination(options);

        container.addHook('beforePageOnClick', function () {
        });
    })('user');
});
CreateTableUser;


$('#btnShowAddUser').click(function () {
    $('#divTableUser').fadeIn().hide();
    $('#containerAddUser').fadeIn().show();
    $('#containerEdit').fadeIn().hide();
    $('#divDetail').fadeIn().hide();
});
$('#btn-cancel--user').click(function () {
    $('#divTableUser').fadeIn().show();
    $('#containerAddUser').fadeIn().hide();
    $('#containerEdit').fadeIn().hide();
});
$('#btn-cancel--edit--user').click(function () {
    $('#divTableUser').fadeIn().show();
    $('#containerAddUser').fadeIn().hide();
    $('#containerEditUser').fadeIn().hide();
});

function deleteUser(button) {
    $.alertable.confirm('Are you sure delete this data?').then(function () {
        Courses.DeleteUser(button.id).done(function (result) {
            $(`#tr-${button.id}`).remove();
            Courses.resultDelete = result;
            console.log(Courses.resultDelete);
            CreateTableUser;
        }).fail(function (result) {
            Courses.resultDelete = result;
            $(button).notify(
                "500 (Internal Server Error)", "danger",
                { position: "bottom", autoHideDelay: 3000 }
            );
            return false;
        });
    }, function () {
        return false;
    });
}

function validatePassword() {
    var password = $('#txtpassword').val();
    var passwordConfirm = $('#txtpasswordConfirm').val();

    if (passwordConfirm != password) {
        $("#txtpasswordConfirm").notify(
            "Mật khẩu chưa khớp nhau, vui lòng nhập lại", "warning",
            { position: "bottom", autoHideDelay: 3000 }
        );
        return;
    }
    else {
        toggleNotify();
    }

}

function GetDataUserForm() {
    var TaiKhoan = $('#txtTaiKhoan').val();
    var password = $('#txtpassword').val();
    var passwordConfirm = $('#txtpasswordConfirm').val();
    var HoTen = $('#txtHoTen').val();
    var Email = $('#txtEmail').val();
    var PhoneNumber = $('#txtPhoneNumber').val();
    var Job = $('#slJob').val();

    if (passwordConfirm != password) {
        $("#txtpasswordConfirm").notify(
            "Mật khẩu chưa khớp nhau, vui lòng nhập lại", "warning",
            { position: "bottom", autoHideDelay: 3000 }
        );
        return;
    }
    //   ------------------Encrypto password----------------------  

    var passwordEncrypted = encrypt(password, keyDecrypto);
    var decrypted = decrypt(passwordEncrypted, keyDecrypto);

    // ---------------end Encrypto---------------------

    var objUser = new User(TaiKhoan, passwordEncrypted, HoTen, Email, PhoneNumber, Job);

    return objUser;
}

function RegisterUserServer() {
    var objUser = GetDataUserForm();

    var TaiKhoan = $('#txtTaiKhoan').val();
    var password = $('#txtpassword').val();
    var passwordConfirm = $('#txtpasswordConfirm').val();
    var HoTen = $('#txtHoTen').val();
    var Email = $('#txtEmail').val();
    var PhoneNumber = $('#txtPhoneNumber').val();
    var Job = $('#slJob').val();

    if (TaiKhoan === "" || password === "" || HoTen === "" || Email === "" || PhoneNumber === "") {
        $("#btn-submit--user").notify(
            "Dữ liệu không được để trống, không thể thực hiện.", "warning",
            { position: "bottom", autoHideDelay: 3000 }
        );
        return;
    }

    console.log(objUser);
    UserServices.addUserAjax(objUser).done(function (result) {
        setTimeout(function () {
            $('#divTableUser').show();
            $('#containerAddUser').hide();
            CreateTableUser;
        }, 3000);

        $("#btn-submit--user").notify(
            "Register Successfully !", "success",
            { position: "right", autoHideDelay: 3000 }
        );
    }).fail(function (result) {
        $("#btn-submit--user").notify(
            SERVER_ERROR, "danger",
            { position: "right", autoHideDelay: 3000 }
        );
        console.log(SERVER_ERROR);
    });
}
$('#btn-submit--user').click(function () {
    RegisterUserServer();
});

//encrypt decrypt
function encrypt(data, key) {
    return CryptoJS.AES.encrypt(data, key).toString();
}
function decrypt(data, key) {
    return CryptoJS.AES.decrypt(data, key).toString(CryptoJS.enc.Utf8);
}
// END decrypt encrypt

function toggleNotify() {
    $('.notifyjs-wrapper').css("display", "none");
}
function clearInputUserAdd() {
    $('#txtTaiKhoan').val('');
    $('#txtpassword').val('');
    $('#txtpasswordConfirm').val('');
    $('#txtHoTen').val('');
    $('#txtEmail').val('');
    $('#txtPhoneNumber').val('');
}



// --------edit user -----------------
var EditUserServices = new UserService();
var arrayListUser = [];
var retrievedObject = localStorage.getItem('AllUser');
arrayListUser = JSON.parse(retrievedObject);

function EditUser(button) {
    setTimeout(function () {
        $('#divTableUser').fadeIn().hide();
        $('#containerEditUser').fadeIn().show();
    }, 300);

    var MaKhoaHocToEdit = button.id;

    arrayListUser.forEach(function (element) {
        if (MaKhoaHocToEdit === element.TaiKhoan) {
            $('#txtTaiKhoanEdit').val(element.TaiKhoan);

            $('#txtHoTenEdit').val(element.HoTen);
            $('#txtPhoneNumberEdit').val(element.SoDT);
            $('#txtEmailEdit').val(element.Email);
            if (element.MaLoaiNguoiDung == null) {
                $('#slJobEdit').val("HV");
            }
            else {
                $('#slJobEdit').val(element.MaLoaiNguoiDung);
            }
            localStorage.setItem("TaiKhoanEdit", element.TaiKhoan);
            localStorage.setItem("HoTenEdit", element.HoTen);
            localStorage.setItem("PhoneNumberEdit", element.SoDT);
            localStorage.setItem("EmailEdit", element.Email);
        }
    });
}
function validatePasswordEdit() {
    var password = $('#txtpasswordEditNew').val();
    var passwordConfirm = $('#txtpasswordConfirmEditNew').val();

    if (passwordConfirm != password) {
        $("#txtpasswordConfirmEditNew").notify(
            "Mật khẩu chưa khớp nhau, vui lòng nhập lại", "warning",
            { position: "bottom", autoHideDelay: 3000 }
        );
        return;
    }
    else {
        toggleNotify();
    }
}
function SubmitEditUser() {
    var HoTenEditOld = localStorage.getItem("HoTenEdit");
    var PhoneNumberEditOld = localStorage.getItem("PhoneNumberEdit");
    var EmailEditOld = localStorage.getItem("EmailEdit");
    var TaiKhoanEdit = localStorage.getItem("TaiKhoanEdit");

    var txtHoTenEdit = $('#txtHoTenEdit').val();
    var txtPhoneNumberEdit = $('#txtPhoneNumberEdit').val();
    var txtEmailEdit = $('#txtEmailEdit').val();
    var passwordEditNew = $('#txtpasswordEditNew').val();
    var passwordConfirmEditNew = $('#txtpasswordConfirmEditNew').val();

    if (passwordConfirmEditNew != passwordEditNew) {
        $("#txtpasswordConfirmEditNew").notify(
            "Mật khẩu chưa khớp nhau, vui lòng nhập lại", "warning",
            { position: "bottom", autoHideDelay: 3000 }
        );
        return;
    }
    else {
        toggleNotify();
    }

    if (passwordEditNew === "") {
        $("#btn-edit--user").notify(
            "Vui lòng nhập mật khẩu mới", "warning",
            { position: "bottom", autoHideDelay: 3000 }
        );
        return;
    }
    else {
        toggleNotify();
    }
    var passwordNewEncrypt = encrypt(passwordEditNew, keyDecrypto);
    var job = $('#slJobEdit').val();

    EditUserServices.EditUserServer(TaiKhoanEdit, passwordNewEncrypt, txtEmailEdit, txtPhoneNumberEdit, job)
        .done(function (result) {
            $("#btn-edit--user").notify(
                UPDATE_COURSE_SUCCESSFULLY, "success",
                { position: "bottom", autoHideDelay: 3000 }
            );
            setTimeout(function () {
                $('#divTableUser').fadeIn().show();
                $('#containerEditUser').fadeIn().hide();
            }, 3200);
            CreateTableUser;
        }).fail(function (result) {
            console.log(SERVER_ERROR);
        });
}
$('#btn-edit--user').click(function () {
    SubmitEditUser();
});

// ----------------------------------------------------------------------------------

var retrievedObject = localStorage.getItem('AllUser');
arrayAccount = JSON.parse(retrievedObject);
var _options = ""
var index = 0;
$.each(arrayAccount, function (i, value) {
    index += 1;
    _options += ('<option value="' + value.TaiKhoan + '">' + "#" + index + " - " + value.TaiKhoan + " - " + value.HoTen + " ( " + value.Email + " )" + '</option>');
});
$('#account').append(_options);


var retrievedObject = localStorage.getItem('allCourse');
arrayCourse = JSON.parse(retrievedObject);
var _options = ""
var index = 0;
$.each(arrayCourse, function (i, value) {
    index += 1;
    _options += ('<option value="' + value.MaKhoaHoc + '">' + "#" + index + " - " + value.MaKhoaHoc + " - " + value.TenKhoaHoc + " ( " + "Lượt xem: " + " " + value.LuotXem + " - " + "Giảng viên: " + " " + value.NguoiTao + " )" + '</option>');
});
$('#course').append(_options);

$("ul[role='menu']").css("display", "none")
$('a[role="menuitem"][href="#finish"]').css("pointer-events", "none");
$('a[role="menuitem"][href="#finish"]').css("color", "#ccc");

$('a[role="menuitem"][href="#next"]').css("pointer-events", "none");
$('a[role="menuitem"][href="#next"]').css("color", "#ccc");
var valueAccount;
function getval(sel) {
    if (sel.value) {
        $("ul[role='menu']").css("display", "inline-block");
        $('a[role="menuitem"][href="#next"]').css("pointer-events", "auto");
        $('a[role="menuitem"][href="#next"]').css("color", "#fff");
        valueAccount = sel.value;
    }
}
var valueCourse;
function seletedCourse(sel) {
    if (sel.value) {
        valueCourse = sel.value;
    }
    showFinish();
    // $('a[role="menuitem"][href="#finish"]').css("pointer-events", "none");
}
function showFinish() {
    // var checkCourse = $('#course').value;
    var a = $('#chkYes').attr('checked');
    if (a == "checked" && valueCourse != undefined) {
        $('a[role="menuitem"][href="#finish"]').css("pointer-events", "auto");
        $('a[role="menuitem"][href="#finish"]').css("color", "#fff");
    }
    else {
        $('a[role="menuitem"][href="#finish"]').css("pointer-events", "none");
        $('a[role="menuitem"][href="#finish"]').css("color", "#ccc");
    }
}


$('a[role="menuitem"][href="#finish"]').click(function () {
    Courses.RegisterUserToCourse(valueCourse, valueAccount)
        .done(function (result) {
            $.notify(result, "success");
            setTimeout(function () {
                window.location.reload();
            }, 3200);
        }).fail(function (result) {
            $.notify("500 (Internal Server Error)", "error");
        });
});
// --------------------------------------------------------------click info account --------------------------------

function ShowDetailUser(button) {
    var account;
    setTimeout(function () {
        $('#divTableUser').fadeIn().hide();
        $('#divDetail').fadeIn().show();
    }, 300);
    var MaKhoaHocToEdit = button.id;
    arrayListUser.forEach(function (element) {
        if (MaKhoaHocToEdit === element.TaiKhoan) {
            account = element;
            $('#txtTaiKhoanDetail').html("Tài khoản :" + " " + element.TaiKhoan);
            $('#txtHoTenDetail').html("Họ tên :" + " " + element.HoTen);
            $('#txtEmailDetail').html("Email :" + " " + element.Email);
            $('#txtPhoneNumber123').html("Số điện thoại :" + " " + element.SoDT);
            $('#txtLoaiNguoiDung').html("Loại tài khoản :" + " " + element.TenLoaiNguoiDung);
        }

    });
    Courses.GetCourseByUser(account.TaiKhoan)
        .done(function (result) {
            console.log(result);
            CreateTableDetail(result);
        }).fail(function (result) {
            console.log(result);
        });
}
function CreateTableDetail(array) {
    var content = "";
    var count = 0;

    for (let i = 0; i < array.length; i++) {
        count += 1;
        var item = array[i];
        content += `
        <tr class="text-right">
            <td class="text-left">${count}</td>
            <td class="text-left">${item.MaKhoaHoc}</td>
            <td>${item.TenKhoaHoc}</td>
            <td>${item.GiaoVu}</td>
            <td>${formatDate(item.NgayGhiDanh)}</td>
        </tr>
        `
    }
    $('#containerDetailUser').append(content);
}

function formatDate(date) {
    var dateFotmated = new Date(date);
    return (dateFotmated.getMonth() + 1) + '/' + dateFotmated.getDate() + '/' + dateFotmated.getFullYear() + " " + dateFotmated.getHours() + ":" + dateFotmated.getMinutes();
}

$('#come-back').click(function () {
    $('#divTableUser').fadeIn().show();
    $('#divDetail').fadeIn().hide();
});