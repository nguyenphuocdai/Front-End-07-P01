function UserService(){
    this.LayDanhSachNguoiDung = function(){
        var urlDSND = "http://sv.myclass.vn/api/QuanLyTrungTam/DanhSachNguoiDung";
        return $.ajax({
            type:"GET",
            url:urlDSND,
            dataType:'json'
        })
    }
    this.addUserAjax = function(data){
        var urlAddUser = "http://sv.myclass.vn/api/QuanLyTrungTam/ThemNguoiDung";
        return $.ajax({
            type:"POST",
            url:urlAddUser,
            dataType:'json',
            data : data
        })
    }
}
