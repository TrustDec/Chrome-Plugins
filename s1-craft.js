// ==UserScript==
// @name         Craft-auto
// @namespace    https://play.laddercaster.com/
// @version      1.0.0
// @description  try to take over the world!
// @author
// @match       https://play.laddercaster.com/
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js
// ==/UserScript==
'use strict';
function log(str) {
    console.log("%c[*lada*] " + str + ":", "color: green;font-size:15px");
}
var claimtime = null;
// 1.查询是否需要Claim 基本完成
function claim() {
    var buttons = document.querySelectorAll("._claim-kmtnpx-8");
    if (buttons.length > 0) {
        log("正在执行" + buttons.length + "个claim" + buttons)
        for (let index = 0; index < buttons.length; index++) {
            buttons[index].click();
        }
    } else {
        clearInterval(claimtime)
        log("没有claim执行")
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
            const items = document.querySelectorAll(".hhXoph")
            if(items.length){
                clearInterval(yczx)
                console.log(items)
                if (items.length >= 3) {
                    items[0].click()
                    items[1].click()
                    items[2].click()
                    document.querySelectorAll(".kXERXs")[0].click()
                    time = setInterval(() => {
                        if(document.querySelectorAll(".ctaxMU").length<1){
                            log("执行Craft完毕,开始下一个")
                            clearInterval(time)
                            resolve(true)
                        }else{
                            log("正在执行Craft")
                        }

                    }, 2000);

                } else {
                    log("装备不够,需要开宝箱")
                    // resolve(false)
                    // craftZX(craftElement)
                }
            }else{
                log("正在等待数据..")
            }

        },2000)





    })

}

// 2.查询法师中哪些是Craft 4.按顺序执行所有可Craft的法师 基本完成
const craftCX = async () => {
    // 切换到法师
    document.querySelectorAll("._item-k86mvz-1")[3].click()
    Crafts=[]
    const Craftsarray = document.querySelectorAll(".cCcBhM")
    if (Craftsarray.length) {
        for (let index = 0; index < Craftsarray.length; index++) {
            let lock = Craftsarray[index].parentNode.querySelectorAll("._lock-kmtnpx-5")
            if (Craftsarray[index].innerText === "Craft" && lock.length < 1) {
                Crafts.push(Craftsarray[index])
            }
        }

        if (Crafts.length) {
            log(Crafts.length + "个符合Craft")
            const result = await craftZX(Crafts[0])
            result && craftCX() || Chest()
        } else {
            log("没有符合的Craft")
        }

    }else{
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
function Map() {

    // 切换到地图
    document.querySelectorAll("._item-k86mvz-1")[4].click()
    // 查找第7层是否存在craft格子
    cxmap = setInterval(() => {
        const maps= document.querySelectorAll("._row-sc-196rxlk-8.dMprSq")
        if(maps.length){
            clearInterval(cxmap)
            const craftState = document.querySelectorAll("._row-sc-196rxlk-8.dMprSq")[22].childNodes;
            let elementIndex = -1;
            for (let index = 0; index < craftState.length; index++) {
                const findIndex= document.querySelectorAll("._row-sc-196rxlk-8.dMprSq")[22].childNodes[0].querySelector(".kPSOpj")
                const findIndex= document.querySelectorAll("._row-sc-196rxlk-8.dMprSq")[22].childNodes[0].querySelector(".hbGAsg")
                if(findIndex){
                    elementIndex = index

                }
            }
            if(elementIndex>-1){
                log(`${findIndex}${["A","B","C"][elementIndex]}${elementIndex+1}是Craft格子`)
            }else{
                log("没有craft格子)")
            }
        }else{
            log("正在准备数据(craft格子)")
        }
    },1000)

    // 如果存在,则查询所有不在B7并且是loot状态的法师的法师
    // 然后循环Move到B7
    // 然后重新回到craftCX

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
        Crafts=[]
        craftCX()
    })
    $('#trustMap').bind('click', function () {
        Map()
    })


})()

