CouseService.detailCourse(maKhoaHoc).done(function(result){
    console.log(result);
}).fail(function(){
    console.log(SERVER_ERROR);
});