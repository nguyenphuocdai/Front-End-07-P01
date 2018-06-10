function CourseService() {
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
}
