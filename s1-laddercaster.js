// ==UserScript==
// @name         laddercaster-auto
// @namespace    https://play.laddercaster.com/
// @version      1.0.0
// @description  try to take over the world!
// @author
// @match        https://play.laddercaster.com/
// ==/UserScript==
function log(str){
    console.log("%c[*lada*] " + str + ":", "color: green;font-size:15px");
}
(function() {
    'use strict';
    var time = 4000
    var Interval
    var number = 0;
    var number100 = 0;
    log('脚本开始执行！')
    setInterval(() => {
        if(document.querySelectorAll(".ctaxMU").length<1){
            claim()
        }else{
            log("正在执行中..."+number100)
            number100++;
            if(number100>50){
                location.reload();
            }
        }
    }, time)

    function claim() {
        var buttons = document.querySelectorAll("._claim-kmtnpx-8");
        if (buttons.length > 0) {
            log("正在执行"+buttons.length + "个claim"+buttons)
            for (let index = 0; index < buttons.length; index++) {
                buttons[index].click();
            }
            lootsFn()
        } else {
            log("没有claim执行,开始检查未loot数量")
            lootsFn()
        }

    }
    function lootsFn() {
        const gZYwHU = document.querySelectorAll("._action-kmtnpx-1>.gZYwHU")
        const FPVGs = document.querySelectorAll("._action-kmtnpx-1>.FPVGs")
        const iRJfGY = document.querySelectorAll("._action-kmtnpx-1>.iRJfGY")
        const newArr = [...gZYwHU, ...FPVGs, ...iRJfGY];
        let element = [];
        for (let i = 0; i < newArr.length; i++) {
            let lock = newArr[i].parentNode.querySelectorAll("._lock-kmtnpx-5")
            if(lock.length<1){
                element.push(newArr[i])
            }
        }
        if (element.length > 0) {
            log(element.length + "个loots开始执行")
            for (let index = 0; index < element.length; index++) {
                element[index].click();
            }
        } else {
            log("没有loots可执行"+number)
            number++;
            if(number>50){
                location.reload();
            }
        }
    }
})();