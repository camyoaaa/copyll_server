function getRandomNumber(start, end, fixed = 0) {
    let differ = end - start
    let random = Math.random()
    return Number((start + differ * random).toFixed(fixed))
}

function getScore() {
    let arr = ['4.7', '4.8', '4.9'];
    return arr[getRandomNumber(0, arr.length - 1)];
}

function toNormalNumber(str, int = true) {
    if (!int) {
        return Number(String(str).replace(',', ''));
    }
    return parseInt(String(str).replace(',', ''));
}

function getGrade() {
    let grade = [{

            g: 'LV4',
            max: '99,999.1'
        },
        {
            g: 'LV5',
            max: '99,999.1'
        }
    ]
    grade = grade.map((i) => {
        let d = getRandomNumber(toNormalNumber(i.max) / 5, toNormalNumber(i.max));
        return {
            ...i,
            d: d.toLocaleString(),
            c: Number(toNormalNumber(i.max, false) - d).toLocaleString()
        }
    });
    return grade[getRandomNumber(0, grade.length - 1)]
}


function getPDDTitle() {
    var randomTitle = ['南极人卡尚莱品专卖店', '潇潇男鞋', '创美益服饰专营店', '匹跑服饰专营店', '香约纸品专卖店', 'U哈家纺', '卡信互联图书专营店'];
    return randomTitle[getRandomNumber(0, randomTitle.length)];
}

function getTBTitle() {
    var randomTitle = ['旺仔是条狗 唯一店铺', ' 宿本 与世界温柔相拥', '港仔风文艺男 店铺', '8杯水2号店铺', 'EDTG韩国女装批发店铺', '茉莉雅集高端品质女装', '知名度原创店铺'];
    return randomTitle[getRandomNumber(0, randomTitle.length)];
}