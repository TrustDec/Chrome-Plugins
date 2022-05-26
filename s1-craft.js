// ==UserScript==
// @name         Craft-auto
// @namespace    https://play.laddercaster.com/
// @version      1.0.0
// @description  try to take over the world!
// @author
// @match       https://play.laddercaster.com/
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js
// ==/UserScript==
// 顺序:claim->craft->move->craft

'use strict';
function log(str) {
    console.log("%c[*lada*] " + str + ":", "color: green;font-size:15px");
}

// 1.查询是否需要Claim 基本完成
function claim() {
    var buttons = document.querySelectorAll("._claim-kmtnpx-8");
    if (buttons.length > 0) {
        log("正在执行" + buttons.length + "个claim" + buttons)
        for (let index = 0; index < buttons.length; index++) {
            buttons[index].click();
        }
    } else {
        log("没有claim执行")
        // Map()
    }
}

var Crafts = [];
var time = null;
var yczx = null;
// 某个法师执行craft操作 6.自动选入3个装备,仍然惦记Craft 基本完成
const craftZX = (craftElement) => {
    return new Promise((resolve, reject) => {
        craftElement.click();
        console.log(craftElement)
        // 循环执行,直到元素渲染完毕
        yczx = setInterval(() => {
            const items = document.querySelectorAll("._item-sc-19b2yt2-0")
            if (items.length) {
                clearInterval(yczx)
                console.log(items)
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
    Crafts = []
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
        log(Crafts)
        if (Crafts.length) {
            log(Crafts.length + "个符合Craft")
            const result = await craftZX(Crafts[0])
            result && craftCX() || Chest()
        } else {
            log("没有符合的Craft")
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
        setTimeout(function () {
            let isState = false
            const movesElement = document.querySelectorAll("._row-sc-1xdwm08-2.gQEDwo")[1].querySelector("._tiles-sc-1zb5eq-0.jxlyiU").childNodes;
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
                    log("此格子不是Craft")
                }
            }
            if (!isState) {
                log("当前法师不存在可Craft的格子")
                document.querySelectorAll("._fade-c43pys-3")[0].click()
                resolve(false)
            }
        }, 2000)
    })
}
const Map = async () => {
    const element = document.querySelectorAll("._queue-w7gpby-2 ._action-kmtnpx-1.bPyphi")

    let elementArr = []
    for (let index = 0; index < element.length; index++) {
        let lock = element[index].parentNode.querySelectorAll("._lock-kmtnpx-5")
        if (element[index].innerText === "Move" && lock.length < 1) {
            elementArr.push(element[index])
        }
    }
    console.log(elementArr)
    for (let index = 0; index < elementArr.length; index++) {
        const e = document.querySelectorAll("._queue-w7gpby-2 ._queue-kmtnpx-0.kQjnwr")[index].childNodes[0].childNodes[2].innerText
        const id = document.querySelectorAll("._overlay-k0m5r7-1.fIMthV")[index].innerText.split("\n")[1]
        const lastElement = elementArr[index]
        console.log(lastElement)
        const result = await mapZX(lastElement, e, id)
        console.log(result)
    }
  
}
(function () {
    const startTyple = `height:50px;position:fixed;bottom:5%;left:10%;z-index:1000;display:flex;`;
    const startTypleItem = `font-size:13px;width:80px;background-color:#188eee;border-right-width:1px;border-color:#600eee;border-right-style:solid;display:flex;justify-content:center;align-items:center;color:#fff;`;
    var toolbarbody = `
    <div style=${startTyple}>
        <div id="trustClaim" style=${startTypleItem}>claim</div>
        <div id="trustCraftCX"  style=${startTypleItem}>可燃烧查询</div>
        <div id="trustChest"  style=${startTypleItem}>开宝箱</div>
        <div id="trustMap"  style=${startTypleItem}>查询地图</div>
    </div>`;
    $("body").before(toolbarbody)
    $('#trustClaim').bind('click', function () {
        claim()
    })
    $('#trustCraftCX').bind('click', function () {
        Crafts = []
        craftCX()
    })
    $('#trustMap').bind('click', function () {
        Map()
    })
    // 进来之后执行 Craft
    // craftCX()
    const box = null
    box = setInterval(function(){
        if(document.querySelectorAll("._item-w7gpby-0").length>0){
            clearInterval(box)
            claim()
        }
    },1000)
})()

