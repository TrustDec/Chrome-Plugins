// ==UserScript==
// @name         Craft-auto
// @namespace    https://play.laddercaster.com/
// @version      1.0.0
// @description  try to take over the world!
// @author
// @match       https://play.laddercaster.com/
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js
// ==/UserScript==
// 顺序:claim->craft->move->craft->loot
//


'use strict';
function log(str) {
    console.log("%c[*lada*] " + str, "color: green;font-size:15px");
}

// 1.查询是否需要Claim 基本完成
function claim() {
    var box = null
    var boxtime = null
    let claimNum = 0
    box = setInterval(function () {
        if (document.querySelectorAll("._item-w7gpby-0").length > 0) {
            clearInterval(box)
            var buttons = document.querySelectorAll("._claim-kmtnpx-8");
            if (buttons.length > 0) {
                for (let index = 0; index < buttons.length; index++) {
                    buttons[index].click();
                }
                boxtime = setInterval(() => {
                    if (document.querySelectorAll(".ctaxMU").length < 1) {
                        clearInterval(boxtime)
                        claim()
                    } else {
                        log("正在执行" + buttons.length + "个claim")
                        claimNum++;
                        if (claimNum > 25) {
                            location.reload();
                        }
                    }

                }, 2000);
            } else {
                log("没有claim执行")
                craftCX()
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

var time = null;
var yczx = null;
// 某个法师执行craft操作 6.自动选入3个装备,仍然惦记Craft 基本完成
const craftZX = (craftElement) => {
    let CraftNum = 0;
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
                            // resolve(true)
                        } else {
                            log("正在执行Craft")
                            CraftNum++;
                            if (CraftNum > 5) {
                                location.reload();
                            }
                        }

                    }, 2000);

                } else {
                    log("装备不够,需要开宝箱")
                    // resolve(false)
                    // craftZX(craftElement)
                }
            } else {
                log("正在等待数据..")
            }

        }, 2000)
    })

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
            result && craftCX() || Chest()
        } else {
            log("没有Craft可执行")
            Map()
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
    craftCX()
}
var cxmap = null
// 3.查询地图7层是否有craft的格子,如果有,则移动不在craft的法师
var mapZXtime = null
const mapZX = (craftElement, text, id) => {
    return new Promise((resolve, reject) => {
        craftElement.click();
        // 点击之后查询当前在哪个格子,查询Craft格子在哪里
        //
        log(`id:${id} ${text} 开始检测...`)
        let mapTime = null
        mapTime = setInterval(function () {
            let isState = false
            const movesElement = document.querySelectorAll("._row-sc-1xdwm08-2.gQEDwo")[1].querySelector("._tiles-sc-1zb5eq-0.jxlyiU").childNodes;
            if (movesElement.length > 0) {
                clearInterval(mapTime)
                for (let index = 0; index < movesElement.length; index++) {
                    const defaultCraft = movesElement[index]
                    const ycz = defaultCraft.querySelector("._icon-hzg9if-7.kPSOpj") || defaultCraft.querySelector("._icon-hzg9if-7.hbGAsg")
                    if (ycz) {
                        isState = true
                        const textIndex = ["A", "B", "C"][index]

                        if (text.indexOf(textIndex) > -1) {
                            log("当前法师已经在Craft格子 for")
                            resolve(true)
                        } else {
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
                    } else {
                        // log("此格子不是Craft")
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
    let MapNum = 0
    const element = document.querySelectorAll("._queue-w7gpby-2 ._action-kmtnpx-1.bPyphi")
    let elementArr = []
    for (let index = 0; index < element.length; index++) {
        let lock = element[index].parentNode.querySelectorAll("._lock-kmtnpx-5")
        if (element[index].innerText === "Move" && lock.length < 1) {
            elementArr.push(element[index])
        }
    }
    console.log(elementArr)
    elementArr.length < 1 && log("没有Move可执行")
    for (let index = 0; index < elementArr.length; index++) {
        const e = elementArr[index].parentNode.parentNode.childNodes[0].childNodes[2].innerText
        const id = elementArr[index].parentNode.parentNode.parentNode.parentNode.childNodes[0].innerText.split("\n")[1]
        const lastElement = elementArr[index]
        const result = await mapZX(lastElement, e, id)
        console.log(result)
    }
    let timeEnd = null
    let timeEndOut = null
    timeEnd = setInterval(() => {
        if (document.querySelectorAll(".ctaxMU").length < 1) {
            clearInterval(timeEnd)
            clearTimeout(timeEndOut)

            timeEndOut = setTimeout(function () {
                log("开始进入下一轮...")
                claim()
            }, 10000)
        } else {
            log("等待执行完毕后进入下一轮...")
            MapNum++;
            if (MapNum > 5) {
                location.reload();
            }
        }
    }, 10000)
    // lootsFn()

}
(function () {
    const startTyple = `height:50px;position:fixed;bottom:5%;left:10%;z-index:1000;display:flex;`;
    const startTypleItem = `font-size:13px;width:80px;background-color:#188eee;border-right-width:1px;border-color:#600eee;border-right-style:solid;display:flex;justify-content:center;align-items:center;color:#fff;`;
    var toolbarbody = `
    <div style=${startTyple}>
        <div id="trustClaim" style=${startTypleItem}>Claim</div>
        <div id="trustCraftCX"  style=${startTypleItem}>Craft</div>
        <div id="trustMap"  style=${startTypleItem}>Move</div>
        <div id="trustChest"  style=${startTypleItem}>开宝箱</div>
    </div>`;
    $("body").before(toolbarbody)
    $('#trustClaim').bind('click', function () {
        claim()
    })
    $('#trustCraftCX').bind('click', function () {
        craftCX()
    })
    $('#trustMap').bind('click', function () {
        Map()
    })
    claim()
})()

