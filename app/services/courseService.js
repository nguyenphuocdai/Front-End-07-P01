function CourseService() {
    var resultDelete = [];
    this.registerCourse = function (CourseID, UserName) {
        var data = JSON.stringify({ MaKhoaHoc: CourseID, TaiKhoan: UserName });
        var urlAddUserToCourse = "http://sv.myclass.vn/api/QuanLyTrungTam/GhiDanhKhoaHoc";
        return $.ajax({
            type: "POST",
            contentType: "application/json",
            url: urlAddUserToCourse,
            dataType: 'JSON',
            data: data
        })
    }
    this.detailCourse = function (id) {
        var urlDetailCourse = `http://sv.myclass.vn/api/QuanLyTrungTam/ChiTietKhoaHoc/${id}`;
        return $.ajax({
            type: "GET",
            url: urlDetailCourse
        })
    }
    this.GetCourses = function () {
        var url = "http://sv.myclass.vn/api/QuanLyTrungTam/DanhSachKhoaHoc";
        return $.ajax({
            type: "GET",
            url: url
        })
    }
    this.DeleteCourse = function (MaKhoaHoc) {

        var url = `http://sv.myclass.vn/api/QuanLyTrungTam/XoaKhoaHoc/${MaKhoaHoc}`;
        return $.ajax({
            type: "DELETE",
            url: url
        });
    }
    this.AddCourse = function (course) {
        var url = `http://sv.myclass.vn/api/QuanLyTrungTam/ThemKhoaHoc`;
        return $.ajax({
            type: "POST",
            url: url,
            dataType: "json",
            data: course
        });
    }
    this.EditCourse = function (id, name, description, view, creator) {
        var strCourse = JSON.stringify({ MaKhoaHoc: id, TenKhoaHoc: name, MoTa: description, LuotXem: view, NguoiTao: creator });
        var url = `http://sv.myclass.vn/api/QuanLyTrungTam/CapNhatKhoaHoc`;
        return $.ajax({
            type: "PUT",
            url: url,
            contentType: "application/json",
            dataType: "json",
            data: strCourse
        });
    }
    this.DeleteUser = function (TaiKhoan) {

        var url = `http://sv.myclass.vn/api/QuanLyTrungTam/XoaNguoiDung/${TaiKhoan}`;
        return $.ajax({
            type: "DELETE",
            url: url
        });
    }
    this.RegisterUserToCourse = function (MaKhoaHoc, TaiKhoan) {
        var strCourse = JSON.stringify({ MaKhoaHoc: MaKhoaHoc, TaiKhoan: TaiKhoan });
        var url = ` http://sv.myclass.vn/api/QuanLyTrungTam/GhiDanhKhoaHoc`;
        return $.ajax({
            type: "POST",
            url: url,
            contentType: "application/json",
            dataType: "json",
            data: strCourse
        });
    }
    this.GetCourseByUser = function (account) {
        var url = `http://sv.myclass.vn/api/QuanLyTrungTam/LayThongtinKhoaHoc?taikhoan=${account}`
        return $.ajax({
            type: "GET",
            url: url,
        });
    }
}