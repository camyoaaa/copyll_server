const typeobj = {
    taobao: {
        flow: {
            app: 0,
            pc: 1,
            shop: 2,
            product: 3
        },
        favorite: {
            shop: 6,
            product: 7,
            search: 9,
            like: 17,
            remind: 15
        },
        cart: {
            search: 11,
            product: 10,
            PanicBuying: 20
        },
        live: {
            talent: 12,
            watch: 14,
            weitao: 13

        },
        article: {
            number: 21,
            people: 22,
            guide: 23
        }
    }
}

module.exports = function getLieliuType(platform, category, type) {
    return typeobj[platform][category][type]
}