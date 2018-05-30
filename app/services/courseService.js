function CourseService() {
    // this.LayDanhSachNguoiDung = function(){
    //     var urlDSND = "http://sv.myclass.vn/api/QuanLyTrungTam/DanhSachNguoiDung";
    //     return $.ajax({
    //         type:"GET",
    //         url:urlDSND,
    //         dataType:'json'
    //     })
    // }
    // this.addUserAjax = function(data){
    //     var urlAddUser = "http://sv.myclass.vn/api/QuanLyTrungTam/ThemNguoiDung";
    //     return $.ajax({
    //         type:"POST",
    //         url:urlAddUser,
    //         dataType:'json',
    //         data : data
    //     })
    // }
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
}
