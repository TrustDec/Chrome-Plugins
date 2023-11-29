var globalJD = null;
const localKey = "P-JD"
function log(str) {
    console.log("%c[*lada*] " + str, "color: green;font-size:15px");
}
function claim() {
    let allClaim = document.querySelectorAll("._claim-kmtnpx-8");
    if (allClaim.length > 0) {
        globalJD = 1;
        localStorage.setItem(localKey, JSON.stringify({ globalJD: 1 }));//转换成json字符串序
        for (let index = 0; index < allClaim.length; index++) {
            allClaim[index].click();
        }
    } else {
        log("没有claim执行")
        craftCX()
    }
}
const craftZX = (craftElement) => {
    let CraftNum = 0;
    let time = null;
    let yczx = null;
    let ddTime = null;
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
const mapZX = (craftElement, text, id) => {
    return new Promise((resolve, reject) => {
        setTimeout(function () {
            craftElement.click();
            // 点击之后查询当前在哪个格子,查询Craft格子在哪里
            log(`id:${id} ${text} 开始检测...`)
            let mapTime = null
            mapTime = setInterval(function () {
                let isState = false
                const movesElement = document.querySelectorAll("._row-sc-1xdwm08-2.gQEDwo")[1].querySelector("._tiles-sc-1zb5eq-0.jxlyiU").childNodes;
                if (movesElement.length > 0) {
                    clearInterval(mapTime)
                    const currentIndex = ["A", "B", "C"].indexOf(text.split("")[0])
                    if (movesElement[currentIndex].querySelector("._icon-hzg9if-7.kPSOpj") || movesElement[currentIndex].querySelector("._icon-hzg9if-7.iExdcW")) {
                        log("当前法师已经在Craft格子 for")
                        document.querySelectorAll("._fade-c43pys-3")[0].click()
                        isState = true
                        resolve(true)
                    }
                    for (let index = 0; index < movesElement.length; index++) {
                        const textIndex = ["A", "B", "C"][index]
                        if (currentIndex == index) {
                            continue
                        }
                        const ycz = movesElement[index].querySelector("._icon-hzg9if-7.kPSOpj") || movesElement[index].querySelector("._icon-hzg9if-7.hbGAsg") || movesElement[index].querySelector("._icon-hzg9if-7.iExdcW")
                        if (ycz) {
                            isState = true
                            log(`${id}存在Craft格子,${text}准备迁移到${textIndex}`)
                            ycz.parentNode.click()
                            if (document.querySelector("._button-t7f8y3-3.gHfmBw")) {
                                log("正在Move")
                                document.querySelector("._button-t7f8y3-3.gHfmBw").click()
                                resolve(true)
                            } else {
                                log("距离太远 无法Move")
                                document.querySelectorAll("._fade-c43pys-3")[0].click()
                                resolve(true)
                            }
                            break
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
        }, 1000)

    })
}
const Map = async () => {
    const element = document.querySelectorAll("._queue-w7gpby-2 ._action-kmtnpx-1.bPyphi")
    for (let index = 0; index < element.length; index++) {
        if (element[index].innerText === "Move") {
            let lock = element[index].querySelectorAll("._lock-kmtnpx-5")
            if (lock.length < 1) {
                let e = element[index].parentNode.parentNode.childNodes[0].childNodes[2].innerText
                let idtemp = element[index].parentNode.parentNode.parentNode.parentNode.childNodes[0].innerText.split("\n")[1]
                await mapZX(element[index], e, idtemp)
            }
        }
    }

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
            }, 3000)
        } else {
            log("等待执行完毕后进入下一轮...")
        }
    }, 1000)

}
function loot() {
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
(function () {
    let box = null
   

    box = setInterval(function () {
         if (localStorage.getItem(localKey)) {
        globalJD = JSON.parse(localStorage.getItem(localKey)).globalJD
    }
        const isLoding = document.querySelectorAll("._container-sc-1bc6xa5-4.gwUNKT") // 查看当前是否有loding
        let Allfs = document.querySelectorAll("._queue-w7gpby-2");// 所有的法师
        if (isLoding.length < 1 && Allfs.length > 0) {
            if (globalJD === 1) {
                console.log("当前正在执行claim")
            } else {
                claim()
            }
        } else {
            console.log("正在加载数据")
        }

    }, 1000)
})()