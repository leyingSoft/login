function alert(msg) {
    document.getElementById("alert").hidden = false;
    document.getElementById("alertText").innerHTML = msg;
    setTimeout(function () {
        document.getElementById("alert").hidden = true;
    }, 3000);
}
function success(msg) {
    document.getElementById("success").hidden = false;
    document.getElementById("successText").innerHTML = msg;
    setTimeout(function () {
        document.getElementById("success").hidden = true;
    }, 3000);
}

// 登录界面
var login = new Vue({
    el: "#login",
    data: {
        username: "",
        password: ""
    },
    methods: {
        login: function () {
            Ajax.post("users/login", {
                "username": this.username,
                "password": this.password
            },
                function (msg) {
                    // console.log(msg);
                    msg = JSON.parse(msg);
                    if (msg.code == "00000") {
                        success(msg.msg);
                        setTimeout(function () {
                            location.href = "/";
                        }, 1000);
                    }
                    else {
                        alert(msg.msg);
                    }
                });
        }
    }
});