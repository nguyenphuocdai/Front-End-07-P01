var CouseService = new CourseService();

 var maKhoaHoc = getItemLocalStorage(FE_COURSE_ID);
CouseService.detailCourse(maKhoaHoc).done(function(result){
    console.log(result);
}).fail(function(){
    console.log(SERVER_ERROR);
});  


function clearLocalStorage(key, action) {
    action == "remove" ? localStorage.removeItem(key) : localStorage.getItem(key);
}
function getItemLocalStorage(key) {
    return localStorage.getItem(key);
}
function setItemLocalstorage(key, value) {
    return localStorage.setItem(key, value);
}