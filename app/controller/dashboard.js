var Courses = new CourseService();
var objCourse = new CourseList();
var ListUser = new UserList();


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

$(function () {
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
                            done(response);
                        }
                    });
                },
            pageSize: 6,
            callback: function (response, pagination) {
                var dataHtml = `
                    <thead>
                      <tr class="bg-light">
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
                        <td style="font-weight: 600">#${item.MaKhoaHoc}</td>
                        <td>${item.TenKhoaHoc}</td>
                        <td>${item.LuotXem}</td>
                        <td>${item.NguoiTao}</td>
                        <td>
                          <button class="badge badge-info" id="del-${item.MaKhoaHoc}"><i class="fa fa-edit"></i></button>
                        </td>
                        <td>
                          <button class="badge badge-danger dlt" id="del-${item.MaKhoaHoc}"><i class="fa fa-times dlt"></i></button>
                        </td>
                      </tr>
                    `
                });
                container.prev().html(dataHtml);
            }
        };

        //$.pagination(container, options);

        container.addHook('beforeInit', function () {
        });
        container.pagination(options);

        container.addHook('beforePageOnClick', function () {
        });
    })('demo1');
});

$("#grdTable").on('click', 'tr', function (e) {
    var that = this;
    $.alertable.confirm('Are you sure delete this data?').then(function () {
        that.closest('tr').remove();
        $(function () {
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
                                    done(response);
                                }
                            });
                        },
                    pageSize: 6,
                    pageNumber: container.pagination('getSelectedPageNum'),
                    callback: function (response, pagination) {
                        var dataHtml = `
                            <thead>
                              <tr class="bg-light">
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
                                <td style="font-weight: 600">#${item.MaKhoaHoc}</td>
                                <td>${item.TenKhoaHoc}</td>
                                <td>${item.LuotXem}</td>
                                <td>${item.NguoiTao}</td>
                                <td>
                                  <button class="badge badge-info" id="del-${item.MaKhoaHoc}"><i class="fa fa-edit"></i></button>
                                </td>
                                <td>
                                  <button class="badge badge-danger dlt" id="del-${item.MaKhoaHoc}"><i class="fa fa-times dlt"></i></button>
                                </td>
                              </tr>
                            `
                        });
                        container.prev().html(dataHtml);
                    }
                };
    
                //$.pagination(container, options);
    
                container.addHook('beforeInit', function () {
                });
                container.pagination(options);
    
                container.addHook('beforePageOnClick', function () {
                });
            })('demo1');
        });
    }, function () {
        return false;
    });
}); 