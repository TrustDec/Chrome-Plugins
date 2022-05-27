// ==UserScript==
// @name         Craft-auto
// @namespace    https://play.laddercaster.com/
// @version      1.0.0
// @description  try to take over the world!
// @author
// @match       https://play.laddercaster.com/
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js
// ==/UserScript==
// 顺序:claim->craft->move->craft->把处于A、C位置的move到 B
// 顺序:claim->craft->move->craft->lootsFn
'use strict';
function log(str) {
    console.log("%c[*lada*] " + str, "color: green;font-size:15px");
}
var globalNum = 0 // 计算当前是第几轮
// 1.查询是否需要Claim 基本完成
function claim() {
    let box = null
    let boxtime = null
    let claimNum = 0
    box = setInterval(function () {
        if (document.querySelectorAll("._item-w7gpby-0").length > 0) {
            clearInterval(box)
            let buttons = document.querySelectorAll("._claim-kmtnpx-8");
            if (buttons.length > 0) {
                for (let index = 0; index < buttons.length; index++) {
                    buttons[index].click();
                }
                boxtime = setInterval(() => {
                    if (document.querySelectorAll(".ctaxMU").length < 1) {
                        clearInterval(boxtime)
                        $('#trustClaim').click()
                    } else {
                        claimNum++;
                        if (claimNum > 25) {
                            location.reload();
                        }
                        log("正在执行" + buttons.length + "个claim:" + claimNum)

                    }

                }, 1000);
            } else {
                log("没有claim执行")
                $('#trustCraftCX').click()
            }
        }
    }, 1000)


}
function lootsFn() {
    const gZYwHU = document.querySelectorAll("._action-kmtnpx-1>.gZYwHU")
    const FPVGs = document.querySelectorAll("._action-kmtnpx-1>.FPVGs")
    const iRJfGY = document.querySelectorAll("._action-kmtnpx-1>.iRJfGY")
    const newArr = [...gZYwHU, ...FPVGs, ...iRJfGY];
    let element = [];
    for (let i = 0; i < newArr.length; i++) {
        let lock = newArr[i].parentNode.querySelectorAll("._lock-kmtnpx-5")
        if (lock.length < 1) {
            element.push(newArr[i])
        }
    }
    element.length < 1 && log("没有loots可执行")
    if (element.length > 0) {
        log(element.length + "个loots开始执行")
        for (let index = 0; index < element.length; index++) {
            element[index].click();
        }
    }


}


// 某个法师执行craft操作 6.自动选入3个装备,仍然惦记Craft 基本完成
const craftZX = (craftElement) => {
    let CraftNum = 0;
    let time = null;
    let yczx = null;
    return new Promise((resolve, reject) => {
        craftElement.click();
        // 循环执行,直到元素渲染完毕
        yczx = setInterval(() => {
            const items = document.querySelectorAll("._item-sc-19b2yt2-0")
            if (items.length) {
                clearInterval(yczx)
                if (items.length >= 3) {
                    items[0].click()
                    items[1].click()
                    items[2].click()
                    document.querySelectorAll(".kXERXs")[0].click()
                    time = setInterval(() => {
                        if (document.querySelectorAll(".ctaxMU").length < 1) {
                            log("执行Craft完毕,开始下一个")
                            clearInterval(time)
                            location.reload();
                        } else {
                            log("正在执行Craft")
                            CraftNum++;
                            if (CraftNum > 30) {
                                location.reload();
                            }
                        }

                    }, 2000);

                } else {
                    log("装备不够,需要开宝箱")
                }
            } else {
                log("正在等待数据..")
            }

        }, 2000)
    })

}
// 将处于A、C位置的move到 B
const moveAllToBZX = (moveElement, e, id) => {
    let CraftNum = 0;
    let time = null;
    let yczx = null;
    return new Promise((resolve, reject) => {
        moveElement.click();
        if (e.indexOf("A") > -1 || e.indexOf("C") > -1) {
            yczx = setInterval(() => {
                let movesElement = document.querySelectorAll("._row-sc-1xdwm08-2.gQEDwo")[1].querySelector("._tiles-sc-1zb5eq-0.jxlyiU").childNodes;
                if (movesElement.length > 0) {
                    clearInterval(yczx)
                    movesElement[1].childNodes[0].childNodes[1].click()
                    if (document.querySelector("._button-t7f8y3-3.gHfmBw")) {
                        log("正在Move")
                        document.querySelector("._button-t7f8y3-3.gHfmBw").click()
                        resolve(true)
                    } else {
                        log("距离太远 无法Move")
                        document.querySelectorAll("._fade-c43pys-3")[0].click()
                        resolve(false)
                    }
                } else {
                    log("等待格子数据加载...")
                }
            }, 2000)
        } else {
            log("此法师正在B位,无需移动...")
            document.querySelectorAll("._fade-c43pys-3")[0].click()
            resolve(true)
        }

    })

}
const moveAllToB = async () => {
    let element = [];
    const moveArr = document.querySelectorAll("._queue-w7gpby-2 ._action-kmtnpx-1.bPyphi")
    for (let index = 0; index < moveArr.length; index++) {
        let lock = moveArr[index].parentNode.querySelectorAll("._lock-kmtnpx-5")
        if (moveArr[index].innerText === "Move" && lock.length < 1) {
            element.push(moveArr[index])
        }
    }
    for (let index = 0; index < element.length; index++) {
        const e = element[index].parentNode.parentNode.childNodes[0].childNodes[2].innerText
        const id = element[index].parentNode.parentNode.parentNode.parentNode.childNodes[0].innerText.split("\n")[1]
        const lastElement = element[index]
        const result = await moveAllToBZX(lastElement, e, id)
        console.log(result)
    }
    /*let timeEnd = null
    let timeEndOut = null
    let moveAllToBNum =0
    globalNum++;
    timeEnd = setInterval(() => {
        if (document.querySelectorAll(".ctaxMU").length < 1) {
            clearInterval(timeEnd)
            clearTimeout(timeEndOut)
            timeEndOut = setTimeout(function () {
                log(`开始进入第${globalNum}轮...`)
                if (globalNum > 5) {
                    location.reload();
                } else {
                    $('#trustClaim').click()
                }

            }, 3000)
        } else {
            log("等待执行完毕后进入下一轮...")
            moveAllToBNum++;
            if (moveAllToBNum > 50) {
                location.reload();
            }
        }
    }, 1000)*/
}

// 2.查询法师中哪些是Craft 4.按顺序执行所有可Craft的法师 基本完成
const craftCX = async () => {
    // 切换到法师
    document.querySelectorAll("._item-k86mvz-1")[3].click()
    let Crafts = []
    // craft装备类型,
    const Craftsarray = document.querySelectorAll(".cCcBhM") || []
    //  craft宝箱类型,
    const CraftsBoxarray = document.querySelectorAll(".gdnuZM") || []
    const newCaftBoxArr = [...Craftsarray, ...CraftsBoxarray]
    if (newCaftBoxArr.length) {
        for (let index = 0; index < newCaftBoxArr.length; index++) {
            let lock = newCaftBoxArr[index].parentNode.querySelectorAll("._lock-kmtnpx-5")
            if (newCaftBoxArr[index].innerText === "Craft" && lock.length < 1) {
                Crafts.push(newCaftBoxArr[index])
            }
        }
        if (Crafts.length) {
            log(Crafts.length + "个符合Craft")
            const result = await craftZX(Crafts[0])
            result && $('#trustCraftCX').click() || Chest()
        } else {
            log("没有Craft可执行")
            $('#trustMap').click()
        }

    } else {
        log("没有加载完毕")
    }

}
// 5.自动开宝箱
function Chest() {
    // 切换到宝箱
    document.querySelectorAll("._item-k86mvz-1")[1].click()
    // 打开宝箱列表页面
    document.querySelectorAll("._container-igacaa-3")[1].click()
    // 所有宝箱元素
    document.querySelectorAll("._grid_item-y6j7dy-6._grid_item_selectable-y6j7dy-7.pSdbJ.bdKZmt")

    $('#trustCraftCX').click()
}
// 3.查询地图7层是否有craft的格子,如果有,则移动不在craft的法师
const mapZX = (craftElement, text, id) => {
    return new Promise((resolve, reject) => {
        craftElement.click();
        // 点击之后查询当前在哪个格子,查询Craft格子在哪里
        log(`id:${id} ${text} 开始检测...`)
        let mapTime = null
        mapTime = setInterval(function () {
            let isState = false
            const movesElement = document.querySelectorAll("._row-sc-1xdwm08-2.gQEDwo")[1].querySelector("._tiles-sc-1zb5eq-0.jxlyiU").childNodes;
            if (movesElement.length > 0) {
                clearInterval(mapTime)
                const currentIndex = ["A","B","C"].indexOf("B8".split("")[0])

                if( movesElement[currentIndex].querySelector("._icon-hzg9if-7.kPSOpj")){
                     log("当前法师已经在Craft格子 for")
                            document.querySelectorAll("._fade-c43pys-3")[0].click()
                      isState = true
                            resolve(true)
                }
                for (let index = 0; index < movesElement.length; index++) {
                    const ycz = movesElement[index].querySelector("._icon-hzg9if-7.hbGAsg");
                    const textIndex = ["A", "B", "C"][index]

                    if (ycz) {
                          isState = true
                         log(`${id}存在Craft格子,${text}准备迁移到${textIndex}`)
                         ycz.parentNode.parentNode.click()
                        if (document.querySelector("._button-t7f8y3-3.gHfmBw")) {
                                log("正在Move")
                                document.querySelector("._button-t7f8y3-3.gHfmBw").click()
                                resolve(true)
                            } else {
                                log("距离太远 无法Move")
                                document.querySelectorAll("._fade-c43pys-3")[0].click()
                                resolve(false)
                            }
                    }
                }
                if (!isState) {
                    log("当前法师不存在Craft的格子")
                    document.querySelectorAll("._fade-c43pys-3")[0].click()
                    resolve(false)
                }
            } else {
                log("等待格子数据加载...")
            }
        }, 2000)
    })
}

const Map = async () => {
    const element = document.querySelectorAll("._queue-w7gpby-2 ._action-kmtnpx-1.bPyphi")
    for (let index = 0; index < element.length; index++) {
        let lock = element[index].parentNode.querySelectorAll("._lock-kmtnpx-5")
        if (element[index].innerText === "Move") {
            if (lock.length < 1) {
                let e = element[index].parentNode.parentNode.childNodes[0].childNodes[2].innerText
                let idtemp = element[index].parentNode.parentNode.parentNode.parentNode.childNodes[0].innerText.split("\n")[1]
                const result = await mapZX(element[index], e, idtemp)
                console.log(result)
            }
        }
    }
    globalNum >= 4 && lootsFn()

    let timeEnd = null
    let timeEndOut = null
    let moveAllToBNum = 0
    globalNum++;
    timeEnd = setInterval(() => {
        if (document.querySelectorAll(".ctaxMU").length < 1) {
            clearInterval(timeEnd)
            clearTimeout(timeEndOut)
            timeEndOut = setTimeout(function () {
                log(`开始进入第${globalNum}轮...`)
                if (globalNum > 6) {
                    location.reload();
                }
                $('#trustClaim').click()

            }, 3000)
        } else {
            log("等待执行完毕后进入下一轮...")
            moveAllToBNum++;
            if (moveAllToBNum > 50) {
                location.reload();
            }
        }
    }, 1000)

}
(function () {
    const startTyple = `height:35px;position:fixed;bottom:10%;left:50%;margin-left:-160px;z-index:1000;display:flex;border-radius:5px;overflow:hidden;`;
    const startTypleItem = `font-size:13px;width:80px;background-color:#188eee;display:flex;justify-content:center;align-items:center;color:#fff;font-weight:bolder;`;
    const toolbarbody = `
    <div style=${startTyple}>
        <div id="trustClaim" style=${startTypleItem}>Claim</div>
        <div id="trustCraftCX"  style=${startTypleItem}>Craft</div>
        <div id="trustMap"  style=${startTypleItem}>Move</div>
        <div id="trustChest"  style=${startTypleItem}>开宝箱</div>

    </div>`;
    $("body").before(toolbarbody)
    document.getElementById("trustClaim").style.background = "#8e44ad"
    document.getElementById("trustClaim").style.color = "#a29bfe"
    document.getElementById("trustCraftCX").style.background = "#16a085"
    document.getElementById("trustCraftCX").style.color = "#00b894"
    document.getElementById("trustMap").style.background = "#d35400"
    document.getElementById("trustMap").style.color = "#ff7675"
    document.getElementById("trustChest").style.background = "#f39c12"
    document.getElementById("trustChest").style.color = "#fdcb6e"
    $('#trustClaim').bind('click', function () {
        claim()
    })
    $('#trustCraftCX').bind('click', function () {
        craftCX()
    })
    $('#trustMap').bind('click', function () {
        Map()
    })
    $('#trustClaim').click()
})()

