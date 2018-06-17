function UserService() {
    this.LayDanhSachNguoiDung = function () {
        var urlDSND = "http://sv.myclass.vn/api/QuanLyTrungTam/DanhSachNguoiDung";
        return $.ajax({
            type: "GET",
            url: urlDSND,
            dataType: 'json'
        })
    }
    this.addUserAjax = function (data) {
        var urlAddUser = "http://sv.myclass.vn/api/QuanLyTrungTam/ThemNguoiDung";
        return $.ajax({
            type: "POST",
            url: urlAddUser,
            dataType: 'json',
            data: data
        })
    }
    this.GetCourseByUser = function (account) {
        var url = `http://sv.myclass.vn/api/QuanLyTrungTam/LayThongtinKhoaHoc?taikhoan=${account}`
        return $.ajax({
            type: "GET",
            url: url,
        });
    }
}
