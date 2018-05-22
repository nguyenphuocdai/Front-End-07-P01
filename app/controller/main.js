function CheckInfoUserLocal(){
    var currentUser = localStorage.getItem(CURRENT_USER_NAME);
    if(!currentUser){
        window.location.href = 'login.html';
    }
    return false;
}