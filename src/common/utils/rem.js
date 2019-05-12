! function () {
    function e() {
        var e = document.documentElement.clientWidth,
            t = document.querySelector("html"),
            f = e / 120;
        window.fontSize = f;
        t.style.fontSize = f + "px"
    }
    e(), window.addEventListener("resize", e);
}();


// export default {
//     adaptive: function (max, min) {
//         var min = min || 1027;
//         var max = max || 1330;
//         !function () {
//             function e() {
//                 var e = document.documentElement.clientWidth, t = document.querySelector("html"),
//                     f = (e > max ? max : ((e < min) ? min : e)) / 20;
//                 window.fontSize = f;
//                 t.style.fontSize = f + "px"
//             }

//             e(), window.addEventListener("resize", e);
//         }();
//     }
// }




