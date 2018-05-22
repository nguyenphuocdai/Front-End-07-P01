
function validateForm() {
    var un = document.getElementById('usr').value;
    var pw = document.getElementById('pword').value;

    var username = "vicente001";
    var password = "qqq111!!!";
    if ((un == username) && (pw == password)) 
    {
        localStorage.setItem(CURRENT_USER_NAME,username);   
        return true;
    }
    else {
        alert("Login was unsuccessful, please check your username and password");
        return false;
    }
}