function LifePhoto(t, a) {
    this.mapT = t;
    this.regionId = null;
    this.container = document.getElementById("albumViewBody");
    this.swipe_photo = null;
    this.select = null;
    this.dataLoader = null;
    this.photoScroll = null;
    this.cellWidth = a.cellWidth || 59;
    this.cellPadding = a.cellPadding || 20;
    this.cellHeight = a.cellHeight || 59;
    this.photoData = a.data;
    this.scrollLeft = 0;
    this.left = 0;
    this.changeRegion(a.regionId);
}
var lifePhotoP = LifePhoto.prototype;
lifePhotoP.changeRegion = function (a, b) {
    if (this.regionId != a) {
        b && (this.photoData = b);
        this.regionId = a;
        this._draw(function () {
        });
        this.scrollTo(0);
    }
};
lifePhotoP._draw = function (a) {
    var c = this;
    $("#albumViewBody").html("");
    if (c.photoData && c.photoData.length > 0) {
        var photoLength = c.photoData.length;
        c.container.style.width = (c.cellWidth + 4 + c.cellPadding) * photoLength + "px";
        for (var e = 0; photoLength > e; e++) {
            e == c.photoData.length - 1 && (c.islast = !0);
            var f = c.photoData[e];
            if (f.index = e, c._createCell(f), e == 0) {
                var g = f.id;
                c.select = $("#" + g);
                /*var h = c.container.parentNode.offsetWidth, i = c.container.offsetWidth, j = (e + 1) * (c.cellWidth + c.cellPadding);
                 j - c.left > h && c.scrollTo(j - h)*/
            }
        }
        a && a()

        new IScroll('#viewBody_wrapper', {
            mouseWheel: true,
            click: true,
            scrollX: true,
            scrollY: false
        });
    }
};
lifePhotoP._createCell = function (a) {
    var b = document.createElement("div");
    b.className = "PanoPhotoCell";
    b.id = a.id;
    var c = this;
    b.innerHTML = '<img src="../../data/images/10721812b30128779db9ac4ed09d3189/' + a.pic + '"><div class="PanoPhotoTitle">' + a.name + "</div>", b.idx = a.index;
    function e(b) {
        b.preventDefault(), c.selectElement(a.index);
        c.mapT.enterPhoto(true);
    }

    var markers = [];
    $(b).focus(function () {
        if (a.map) {
            for (var i = 0, l = a.map.length; i < l; i++) {
                var position = new qq.maps.LatLng(a.map[i].lat, a.map[i].lng);
                var mAnchor = new qq.maps.Point(90, 120),
                    mSize = new qq.maps.Size(149, 120),
                    mOrigin = new qq.maps.Point(0, 0),
                    mIcon = new qq.maps.MarkerImage("../../data/images/10721812b30128779db9ac4ed09d3189/logo/" + a.id + ".png", mSize, mOrigin, mAnchor);

                var mMarker = new qq.maps.Marker({
                    icon: mIcon,
                    map: Lib.MAP,
                    position: position
                });

                mMarker.setTitle(i + 1);
                markers.push(mMarker);
            }
        }
    }).blur(function () {
        for (i in markers) {
            markers[i].setMap(null);
        }
        markers.length = 0;
    });

    return window.isMobile ? $(b).tap(e) : $(b).click(e), c.container.appendChild(b), b
};
lifePhotoP.scrollTo = function (a) {
    /*var b = this.container.parentNode.offsetWidth, c = this.container.offsetWidth;
     c - a >= b && (this.left = a,
     $(this.container).css({marginLeft: -a + "px"})
     )*/
    $(this.container).css({'transform': 'translate( -' + a + 'px, 0px) translateZ(0px)'});
};
lifePhotoP.scrollToIndex = function (a) {
    var b = a * (this.cellWidth + this.cellPadding);
    this.scrollTo(b)
};
lifePhotoP.selectElement = function (a) {
    var b = this, c = b.photoData[a], d = this.container.parentNode.offsetWidth, e = this.container.offsetWidth, f = (a + 1) * (this.cellWidth + this.cellPadding);
    //b.pano.setPano(c.svid), b.pano.setPov({heading: parseInt(c.heading), pitch: parseInt(c.pitch)}),
    b.select = $("#" + c.id), b.select.attr('tabindex', -1).focus();
};
lifePhotoP.nextScene = function () {
    var a = this.select[0].idx, b = this.photoData.length;
    a++, b > a && this.selectElement(a), this.scrollNext();
};
lifePhotoP.preScene = function () {
    var a = this.select[0].idx;
    a--, a >= 0 && this.selectElement(a), this.scrollPre();
};
lifePhotoP.scrollNext = function () {
    var a = this.select[0].idx, b = this.photoData.length;
    if (a < b) {
        if (a % 4 == 0) {
            var margin = parseInt(a / 4) * 1056;
            //$(this.container).css({marginLeft: -margin + "px"});
            this.scrollTo(margin);
        }
    }
};
lifePhotoP.scrollPre = function () {
    var a = this.select[0].idx, b = this.photoData.length;
    if (a > 0) {
        if (a % 4 == 3) {
            var margin = parseInt(a / 4) * 1056;
            //$(this.container).css({marginLeft: -margin + "px"});
            this.scrollTo(margin);
        }
    }
};


function LifeRegionList(a, b) {
    this.container = null;
    this.photo = a;
    this.data = b;
    this.select = null;
    this.swipe_Title = null;
    this.regionScroll = null;
    var c = this;
    this.init(function () {
    });
    this.setFloorData(b);
}
var LifeRP = LifeRegionList.prototype;
LifeRP.init = function (a) {
    var b = this, c = document.createElement("ul");
    this.container = c;
    var d = document.getElementById("albumTitleBody");
    d.appendChild(c), a && a()
}, LifeRP._createLi = function (a) {
    var b = this, c = document.createElement("li");
    c.innerHTML = a.name;
    c.id = "floor_" + a.index;
    c.index = a.index;
    var d = a.id;
    return window.isMobile ? $(c).tap(function (a) {
        a.preventDefault(), b.selectFloor(this.index, !0)
    }) : $(c).click(function (a) {
        a.preventDefault(), b.selectFloor(this.index, !0)
    }), b.container.appendChild(c), $(c).width()
}, LifeRP.selectFloor = function (a, b) {
    var c = this;
    c.select && c.select.removeClass("select"), c.select = $("#floor_" + a), c.select.addClass("select"), c.select.attr('tabindex', -1).focus();
    //切换
    b && (c.data[a].photo ? 1 : c.data[a].photo = []) && c.photo.changeRegion(c.select[0].index, c.data[a].photo);
}, LifeRP.nextFloor = function () {
    var a = this.select[0].index, b = this.data.length;
    a++, b > a && this.selectFloor(a, !0)
}, LifeRP.preFloor = function () {
    var a = this.select[0].index;
    a--, a >= 0 && this.selectFloor(a, !0)
}, LifeRP.draw = function () {
    var a = document.getElementById("albumTitleBody"), b = 0, c = this, width = 0, w = 0;
    c.container.innerHTML = "";
    for (var d = 0; d < c.data.length; d++) {
        var e = !1;
        0 === d && (e = !0), c.data[d].index = d, w = c._createLi(c.data[d], e), b += w, width = width + w + 22;
    }
    $("#albumTitleBody").width(width);
    new IScroll('#albumTitle_wrapper', {
        mouseWheel: true,
        click: true,
        scrollX: true,
        scrollY: false
    });
}, LifeRP.setFloorData = function (a) {
    this.data = a, this.draw()
};

/*修改地址姓名电话*/
function changeAdress(options) {
    $('#address').html(options.address);
    $('#name').html(options.name);
    $('#tel').html(options.tel);
}

(function () {

    var house = (function () {
        return {
            CUR_BLOCK: 'INDEX',
            PANO: null,
            MARKERSARRAY: [],//地图上标记列
            TEMPLATE_HOUSE: doT.template($('#template-house').text()),//房源列表模板
            TEMPLATE_HOUSE_DETAIL: doT.template($('#template-house-detail').text()),//房源详情模板
            TEMPLATE_ITEM: doT.template($('#template-item').text()),//菜品模板
            TEMPLATE_ORDER: doT.template($('#template-order').text()),//订单模板
            HOUSE_INDEX: 0,//找房当前选中列表位置
            AREA: 0,//相册状
            DATA: null,
            count: new Array(),//存储菜单购买数量数组
            price: [11, 9, 28, 9.5],//菜单价
            CART_LIST: [],//购物车列表
            MENU_DATA: [
                {
                    name: '热销菜品',
                    num: 6,
                    page: 2,
                    list: [{
                        name: '经典麦辣鸡腿汉堡',
                        sold: 318,
                        price: 11,
                        num: 0,
                        image: 'images/p_01.png'
                    }, {
                        name: '麦辣鸡翅2块',
                        sold: 148,
                        price: 9,
                        num: 0,
                        image: 'images/p_02.png'
                    }, {
                        name: '经典麦辣鸡腿汉堡中薯中可',
                        sold: 138,
                        price: 28,
                        num: 0,
                        image: 'images/p_03.png'
                    }, {
                        name: '麦乐鸡5块',
                        sold: 88,
                        price: 9.5,
                        num: 0,
                        image: 'images/p_04.png'
                    }, {
                        name: '麦乐鸡5块',
                        sold: 88,
                        price: 9.5,
                        num: 0,
                        image: 'images/p_04.png'
                    },
                        {
                            name: '经典麦辣鸡腿汉堡中薯中可',
                            sold: 138,
                            price: 28,
                            num: 0,
                            image: 'images/p_03.png'
                        }]
                },
                {
                    name: '超值套餐',
                    num: 4,
                    page: 1,
                    list: [{
                        name: '麦乐鸡5块',
                        sold: 88,
                        price: 9.5,
                        num: 0,
                        image: 'images/p_04.png'
                    }, {
                        name: '经典麦辣鸡腿汉堡',
                        sold: 318,
                        price: 11,
                        num: 0,
                        image: 'images/p_01.png'
                    }, {
                        name: '麦辣鸡翅2块',
                        sold: 148,
                        price: 9,
                        num: 0,
                        image: 'images/p_02.png'
                    },
                        {
                            name: '经典麦辣鸡腿汉堡中薯中可',
                            sold: 138,
                            price: 28,
                            num: 0,
                            image: 'images/p_03.png'
                        }]
                },
                {
                    name: '开心乐园餐',
                    num: 4,
                    page: 1,
                    list: [{
                        name: '经典麦辣鸡腿汉堡中薯中可',
                        sold: 138,
                        price: 28,
                        num: 0,
                        image: 'images/p_03.png'
                    }, {
                        name: '麦乐鸡5块',
                        sold: 88,
                        price: 9.5,
                        num: 0,
                        image: 'images/p_04.png'
                    }, {
                        name: '经典麦辣鸡腿汉堡',
                        sold: 318,
                        price: 11,
                        num: 0,
                        image: 'images/p_01.png'
                    }, {
                        name: '麦辣鸡翅2块',
                        sold: 148,
                        price: 9,
                        num: 0,
                        image: 'images/p_02.png'
                    }]
                }

            ],
            ICON: {
                center: {
                    path: 'images/center.png',
                    width: 56,
                    height: 56
                },
                houseLoc: {
                    path: 'images/houseLoc.png',
                    width: 52,
                    height: 57
                },
                houseFocus: {
                    path: 'images/houseLoc.png',
                    width: 52,
                    height: 57
                }
            },
            init: function () {
                this.mapInit(39.9489391276258, 116.42458676023809);
                this.search();
                this.keyListener();
                Lib["TYPE_INDEX"] = 0;
                Lib["PRODUCT_INDEX"] = 0;
                this.WEB_SOCKET = new webSocket();
                this.WEB_SOCKET.connect();
                if (Lib.getQueryString("click")) {
                    $("#hintContainer").hide();
                }
                var $viewQrCode = $("#viewQrCode");
                var viewQrCodeSrc = $viewQrCode.attr("src");
                $viewQrCode.attr("src", TXConneturl + viewQrCodeSrc);

                var $DDCode = $("#DDCode");
                var DDCodeSrc = $DDCode.attr("src");
                $DDCode.attr("src", TXConneturl + DDCodeSrc);
            },
            mapInit: function (lat, lng) {
                var that = this;

                //平面地图初始�?
                var center = new qq.maps.LatLng(lat, lng);
                Lib.MAP = new qq.maps.Map(document.getElementById('container'), {
                    center: center,
                    zoom: 15,
                    disableDefaultUI: true
                });
                var circle = new qq.maps.Circle({
                    center: center,
                    radius: 1000,
                    map: Lib.MAP
                });


                var marker = that.layMarker(lat, lng, 'center');
                qq.maps.event.addListener(Lib.MAP, 'center_changed', function () {
                    //房源列表只显示红点，不显示蓝色中心点
                    if (Lib.MAP_CENTER) {
                        marker.setPosition(Lib.MAP.getCenter());
                        circle.setVisible(false);
                    }
                });


            },
            control: function (e) {
                var that = this;

                //选点搜索
                if (that.CUR_BLOCK == 'INDEX') {
                    if (e && e.keyCode == 27) { // �?Esc/返回
                        //返回首页
                        window.location.href = '../index/index.html?id=10721812b30128779db9ac4ed09d3189'
                    }
                    else if (e && e.keyCode == 13) {//enter �?
                        that.search();
                    }
                    Lib.zoomListener(e);
                    return false;
                }
                //商品列表
                else if (that.CUR_BLOCK == 'LIST') {
                    switch (that.AREA) {
                        case 1:
                            switch (e.keyCode) {
                                case 13:
                                    break;
                                case 40:
                                    that.changeArea(2);
                                    break;
                                case 37:
                                    that.changeFloor(0);
                                    break;
                                case 39:
                                    that.changeFloor(1);
                                    break;
                                case 27:
                                    window.location.href = '../index/index.html?id=10721812b30128779db9ac4ed09d3189'
                                    break;
                            }
                            break;
                        case 2:
                            switch (e.keyCode) {
                                case 38:
                                    that.changeArea(1);
                                    break;
                                case 13:
                                    that.enterPhoto();
                                    break;
                                case 37:
                                    that.changePhoto(0);
                                    break;
                                case 39:
                                    that.changePhoto(1);
                                    break;
                                case 27:
                                    window.location.href = '../index/index.html?id=10721812b30128779db9ac4ed09d3189'
                                    break;
                            }
                            break;
                    }
                    Lib.zoomListener(e);
                }
                else if (that.CUR_BLOCK == 'DETAIL') {
                    if (e && e.keyCode == 27) { // �?Esc/返回
                        $(".detailImg").css("top", "720px");
                        $("#detailStreet").css("top", "720px");
                        that.CUR_BLOCK = 'LIST';
                    } else if (e && e.keyCode == 13) {//enter �?
                        var p = $(that.photo.select)[0];
                        var index = p.idx;
                        var content = that.photo.photoData[index].content;
                        if (content) {
                            var c = content.split(",");
                            if (c.length > 1) {
                                $(".detailImg > img").attr("src", "../../data/images/10721812b30128779db9ac4ed09d3189/" + c[1]);
                            }
                        }
                    }
                }
                //麦当劳购买
                else if (that.CUR_BLOCK == 'BUY') {
                    Lib.listListener({
                        e: e,
                        listName: 'type',
                        num: 6,
                        down: function () {
                            $($('#productList li')[0]).attr('tabindex', -1).focus();
                            that.CUR_BLOCK = "BUYLIST";
                        }
                    });
                    if (e && e.keyCode == 27) { // �?Esc/返回
                        $(".detailImg").css("top", "720px");
                        $($('#albumViewBody .PanoPhotoCell')[0]).attr('tabindex', -1).focus();
                        that.CUR_BLOCK = 'LIST';
                    }
                }
                //菜单列表
                else if (that.CUR_BLOCK == 'BUYLIST') {
                    Lib.listListener({
                        e: e,
                        listName: 'product',
                        num: 4,
                        columnNum: 2,
                        height: 138,
                        enter: function () {
                            $($('#productList li')[Lib["PRODUCT_INDEX"]]).addClass('sel');
                            that.originNum = $($('#productList li')[Lib["PRODUCT_INDEX"]]).find('.count').val();
                            that.CUR_BLOCK = 'NUM';
                        },
                        up: function () {
                            var column1 = 2, listDom = $('#productList li');//列表dom节点数组;
                            if (Lib["PRODUCT_INDEX"] > column1 - 1) {
                                Lib["PRODUCT_INDEX"] -= column1;
                                $(listDom[Lib["PRODUCT_INDEX"]]).attr('tabindex', -1).focus();
                            } else {
                                $($('#typeList li')[Lib["TYPE_INDEX"]]).attr('tabindex', -1).focus();
                                that.CUR_BLOCK = 'BUY';
                            }
                        },
                        down: function () {
                            var column1 = 2, listDom = $('#productList li');//列表dom节点数组;
                            if (Lib["PRODUCT_INDEX"] < listDom.length - column1) {
                                Lib["PRODUCT_INDEX"] += column1;
                                $(listDom[Lib["PRODUCT_INDEX"]]).attr('tabindex', -1).focus();
                            } else {
                                $('.cart').attr('tabindex', -1).focus();
                                that.CUR_BLOCK = 'CARTBTN';
                            }
                        }
                    });
                    if (e && e.keyCode == 27) { // Esc返回
                        $(".detailImg").css("top", "720px");
                        $($('#albumViewBody .PanoPhotoCell')[0]).attr('tabindex', -1).focus();
                        that.CUR_BLOCK = 'LIST';
                    }
                    else if (e && e.keyCode == 34) {//PgDn，下一页
                        var curPage = $('#curPage'), page = Number(curPage.html());
                        if (page < that.MENU_DATA[Lib["TYPE_INDEX"]].page) {
                            that.initMenuList({
                                index: Lib["TYPE_INDEX"],
                                page: ++page
                            });
                            curPage.html(page);
                            $($('#productList li')[0]).attr('tabindex', -1).focus();
                        }
                    }
                    else if (e && e.keyCode == 33) {//PgUp，上一页
                        var curPage2 = $('#curPage'), page2 = Number(curPage2.html());
                        if (page2 > 1) {
                            that.initMenuList({
                                index: Lib["TYPE_INDEX"],
                                page: --page2
                            });
                            curPage2.html(page2);
                            $($('#productList li')[0]).attr('tabindex', -1).focus();
                        }
                    }
                }
                //修改数量
                else if (that.CUR_BLOCK == 'NUM') {
                    var count = $($('#productList li')[Lib["PRODUCT_INDEX"]]).find('.count');
                    var num = count.val();
                    var offset = (Number($('#curPage').html()) - 1) * 4;
                    if (e && e.keyCode == 40) {//下键减少
                        if (num > 0) {
                            count.val(--num);
                            if ($('.shoppingCart').length == 1) {
                                var temp = that.CART_LIST[Lib["PRODUCT_INDEX"]];
                                that.MENU_DATA[temp.x].list[temp.y].num = num;
                            } else {
                                that.MENU_DATA[Lib["TYPE_INDEX"]].list[Lib["PRODUCT_INDEX"] + offset].num = num;
                            }
                        }
                    }
                    else if (e && e.keyCode == 38) {//上键增加
                        count.val(++num);
                        if ($('.shoppingCart').length == 1) {
                            var temp = that.CART_LIST[Lib["PRODUCT_INDEX"]];
                            that.MENU_DATA[temp.x].list[temp.y].num = num;
                        } else {
                            that.MENU_DATA[Lib["TYPE_INDEX"]].list[Lib["PRODUCT_INDEX"] + offset].num = num;
                        }
                    }
                    else if (e && e.keyCode == 27) { // esc返回
                        $($('#productList li')[Lib["PRODUCT_INDEX"]]).removeClass('sel').attr('tabindex', -1).focus();
                        count.val(that.originNum);
                        that.CUR_BLOCK = 'BUYLIST';
                    }
                    else if (e && e.keyCode == 13) { // 回车确定
                        window['count_' + Lib["PRODUCT_INDEX"]] = count.val();
//                            that.count[Lib["PRODUCT_INDEX"]] = count.val();
                        // 自定义一个事件，事件名为firework
                        var evt = new CustomEvent('firework', {'detail': 'count'});
                        window.dispatchEvent(evt);
                        $($('#productList li')[Lib["PRODUCT_INDEX"]]).removeClass('sel').attr('tabindex', -1).focus();
                        that.CUR_BLOCK = 'BUYLIST';
                    }
                }
                //购物车按键
                else if (that.CUR_BLOCK == 'CARTBTN') {
                    if (e && e.keyCode == 27) { // Esc返回
                        $(".detailImg").css("top", "720px");
                        $($('#albumViewBody .PanoPhotoCell')[0]).attr('tabindex', -1).focus();
                        that.CUR_BLOCK = 'LIST';
                    }
                    else if (e && e.keyCode == 38) {//上键回到菜单
                        $($('#productList li')[Lib["PRODUCT_INDEX"]]).attr('tabindex', -1).focus();
                        that.CUR_BLOCK = 'BUYLIST';
                    } else if (e && e.keyCode == 13) { // 回车确定
                        //提交订单
                        if ($('.shoppingCart').length == 1) {
                            $('#dialog').html('提交成功').show();
                            setTimeout(function () {
                                $('#dialog').hide();
                                $(".detailImg").css("top", "720px");
                                $('.shoppingCart').removeClass('shoppingCart');
                            }, 2000);
                            $($('#albumViewBody .PanoPhotoCell')[0]).attr('tabindex', -1).focus();
                            that.CUR_BLOCK = 'LIST';
                        } else {
                            $('.detailContent').addClass('shoppingCart');
                            $('#productList').html(that.TEMPLATE_ITEM(that.CART_LIST));
                            that.CUR_BLOCK = 'CART';
                        }
                    }
                }
                //购物车列表
                else if (that.CUR_BLOCK == 'CART') {
                    if (e && e.keyCode == 27) { // esc返回
                        $('.detailContent').removeClass('shoppingCart');
                        that.initMenuList({
                            index: Lib["TYPE_INDEX"],
                            page: 1
                        });
                        that.CUR_BLOCK = 'CARTBTN';
                    } else if (e && e.keyCode == 38) {//上键
                        Lib["PRODUCT_INDEX"] = 0;
                        $($('#productList li')[Lib["PRODUCT_INDEX"]]).attr('tabindex', -1).focus();
                        that.CUR_BLOCK = 'BUYLIST';
                    } else if (e && e.keyCode == 13) { // 回车确定
                        $('#dialog').html('提交成功').show();
                        setTimeout(function () {
                            $('#dialog').hide();
                            $(".detailImg").css("top", "720px");
                            $('.shoppingCart').removeClass('shoppingCart');
                        }, 2000);
                        $($('#albumViewBody .PanoPhotoCell')[0]).attr('tabindex', -1).focus();
                        that.CUR_BLOCK = 'LIST';
                    }
                }
                //订单详情
                else if (that.CUR_BLOCK == 'ORDERDETAIL') {
                    if (e && e.keyCode == 27) { // Esc返回
                        $(".detailImg").css("top", "720px");
                        setTimeout(function () {
                            $('.orderDetail').removeClass('orderDetail');
                        }, 500);
                        $($('#albumViewBody .PanoPhotoCell')[0]).attr('tabindex', -1).focus();
                        that.CUR_BLOCK = 'LIST';
                    } else if (e && e.keyCode == 13) { // 回车重新选择菜品
                        $('.detailContent').removeClass('orderDetail');
                        //菜单选择清零
                        for (var i = 0; i < that.MENU_DATA.length; i++) {
                            var list = that.MENU_DATA[i].list;
                            for (var j = 0; j < list.length; j++) {
                                if (list[j].num > 0) {
                                    list[j].num = 0;
                                }
                            }
                        }
                        that.initMenuList({
                            index: 0,
                            page: 1,
                            first: true
                        });
                        $('.sel').removeClass('sel');
                        $($('.detailContent .menu li')[0]).attr('tabindex', -1).focus();
                        $('#count, #money').html(0);
                        that.CUR_BLOCK = "BUY";
                    }
                }
            },
            keyListener: function () {
                var that = this;
                //菜单数量价格监听
                window.addEventListener('firework', function (evt) {
                    that.CART_LIST = new Array();
                    if (evt.detail == 'count') {
                        var sum = 0, total = 0;
                        for (var i = 0; i < that.MENU_DATA.length; i++) {
                            var list = that.MENU_DATA[i].list;
                            for (var j = 0; j < list.length; j++) {
                                if (list[j].num > 0) {
                                    list[j].x = i;
                                    list[j].y = j;
                                    that.CART_LIST.push(list[j]);
                                }
                                sum += Number(list[j].num);
                                total += Number(list[j].price) * Number(list[j].num);
                            }
                        }
                        $('#count').html(sum + "份");
                        $('#money').html(total);
                    }
                });

                document.onkeydown = function (event) {
                    var e = event || window.event || arguments.callee.caller.arguments[0];
                    that.control(e);
                };

                $("#cart").click(function () {
                    //提交订单
                    console.log($('.shoppingCart'))
                    if ($('.shoppingCart').length == 1) {
                        $('#dialog').html('提交成功').show();
                        setTimeout(function () {
                            $('#dialog').hide();
                            $(".detailImg").css("top", "720px");
                            $('.shoppingCart').removeClass('shoppingCart');
                        }, 2000);
                        $($('#albumViewBody .PanoPhotoCell')[0]).attr('tabindex', -1).focus();
                        that.CUR_BLOCK = 'LIST';
                    } else {
                        $('.detailContent').addClass('shoppingCart');
                        $('#productList').html(that.TEMPLATE_ITEM(that.CART_LIST));
                        that.CUR_BLOCK = 'CART';
                    }
                });

                if (Lib.getQueryString("click")) {
                    $("#exit").show().click(function () {
                        var e = event || window.event || arguments.callee.caller.arguments[0];
                        e.keyCode = 27;
                        that.control(e);
                    });
                }
            },
            //请求商家列表
            search: function () {
                this.CUR_BLOCK = 'LIST';
                $("#viewQrCodeContainer").show();
                var t = this;
                $.ajax({
                    url: "../../data/json/10721812b30128779db9ac4ed09d3189/search.json",
                    type: "GET",
                    async: false,
                    success: function (data) {
                        t.DATA = data;
                        if (data.status == 1) {
                            t.photo = new LifePhoto(t, {
                                regionId: 0,
                                cellWidth: 240,
                                cellHeight: 160,
                                data: data.floor[0].photo
                            });
                            t.regeionList = new LifeRegionList(t.photo, data.floor);
                            t.regeionList.selectFloor(0);
                            t.changeArea(2);
                        }
                    }
                });

            },
            changeArea: function (area) {
                this.AREA = area;
                if (area === 0) {
                    this.PANO.panoObj.focusSwf();
                    $('#album').css("left", "-1280px");
                } else if (area === 1) {
                    $('#album').css("left", "0");
                    $(this.regeionList.select[0]).attr('tabindex', -1).focus();
                } else if (area === 2) {
                    $('#album').css("left", "0");
                    var margin = parseInt(this.photo.select[0].idx / 4) * 1056;
                    $(this.photo.container).css({marginLeft: -margin + "px"});
                    this.photo.selectElement(this.photo.select[0].idx);
                }
            },
            changePhoto: function (a) {
                a ? this.photo.nextScene() : this.photo.preScene();
            },
            enterPhoto: function () {
                var that = this, p = $(this.photo.select)[0];
                var index = p.idx;
                var content = this.photo.photoData[index].content;
                if (content) {
                    if ($(this.regeionList.select)[0].index == 0) {
                        $("#detailStreet > .title > img").attr("src", "../../data/images/10721812b30128779db9ac4ed09d3189/" + this.photo.photoData[index].pic);
                        $("#detailStreet > .title > div").html(this.photo.photoData[index].name);
                        $("#detailStreet > .content").html(content);
                        $("#detailStreet").css("top", "0");
                        this.CUR_BLOCK = "DETAIL";
                    } else {
                        $(".detailImg").css("top", "0");
                        //进入麦当劳
                        if ($(p).attr('id') == '13') {
                            $(".detailImg > img").hide();
                            $(".detailBg").show();
                            that.CUR_BLOCK = "BUY";
                            var typeContent = '';
                            for (var i = 0; i < that.MENU_DATA.length; i++) {
                                typeContent += '<li tabindex="-1" data-id="' + i + '">' + that.MENU_DATA[i].name + '</li>'
                            }
                            that.initMenuList({
                                index: 0,
                                page: 1,
                                first: true
                            });
                            $('#typeList').html(typeContent);
                            $('#typeList li').focus(function () {
                                Lib["TYPE_INDEX"] = $(this).attr("data-id");
                                $('#typeList li').removeClass('sel');
                                $(this).addClass('sel');
                                that.initMenuList({
                                    index: Lib["TYPE_INDEX"],
                                    page: 1
                                });
                                $('#totalPage').html(that.MENU_DATA[Lib["TYPE_INDEX"]].page);
                                $('#curPage').html(1);
                            });

                            $("#pagePrevious").click(function () {
                                var curPage2 = $('#curPage'), page2 = Number(curPage2.html());
                                if (page2 > 1) {
                                    that.initMenuList({
                                        index: Lib["TYPE_INDEX"],
                                        page: --page2
                                    });
                                    curPage2.html(page2);
                                }
                            });

                            $("#pageNext").click(function () {
                                var curPage = $('#curPage'), page = Number(curPage.html());
                                if (page < that.MENU_DATA[Lib["TYPE_INDEX"]].page) {
                                    that.initMenuList({
                                        index: Lib["TYPE_INDEX"],
                                        page: ++page
                                    });
                                    curPage.html(page);
                                }
                            });

                            setTimeout(function () {
                                $($('.detailContent .menu li')[0]).attr('tabindex', -1).focus();
                            }, 1000);
                        } else if ($(p).attr('id') == '31') {//进入订单详情
                            $(".detailImg > img").hide();
                            $(".detailBg").show();
                            $('.detailContent').addClass('orderDetail');
                            setTimeout(function () {
                                $('.cart').attr('tabindex', -1).focus();
                            }, 1000);
                            $('.boughtList').html(that.TEMPLATE_ORDER(that.CART_LIST));
                            this.CUR_BLOCK = "ORDERDETAIL";
                        } else {
                            $(".detailBg").hide();
                            var c = content.split(",");
                            $(".detailImg > img").attr("src", "../../data/images/10721812b30128779db9ac4ed09d3189/" + c[0]).show();
                            this.CUR_BLOCK = "DETAIL";
                        }
                    }

                }
            },
            /*菜单内容生成，根据类别改变*/
            initMenuList: function (options) {
                var that = this, list = that.MENU_DATA[options.index].list;
                if (options.page == 0 || options.page) {
                    var start = 4 * (options.page - 1), end = 4 * options.page > list.length ? list.length : 4 * options.page;
                    list = list.slice(start, end);
                }
                /*for(var i=0; i<list.length; i++){
                 typeContent += '<li>'+list[i].name+'</li>'
                 }*/
                $('#productList').html(that.TEMPLATE_ITEM(list));
                $('#totalPage').html(that.MENU_DATA[options.index].page);
                Lib["PRODUCT_INDEX"] = 0;

                $('#productList li').click(function () {
                    $('#productList li').removeClass('sel');
                    $($('#productList li')[$(this).attr("data-id")]).addClass('sel');
                    that.originNum = $($('#productList li')[Lib["PRODUCT_INDEX"]]).find('.count').val();
                    that.CUR_BLOCK = 'NUM';
                });
            },
            changeFloor: function (a) {
                a ? this.regeionList.nextFloor() : this.regeionList.preFloor();
            },
            /*地图上换标记图标*/
            changeMarker: function (index, iconType) {
                var that = this, iconPath = that.ICON[iconType].path, iconWidth = that.ICON[iconType].width, iconHeight = that.ICON[iconType].height;
                var anchor = new qq.maps.Point(iconWidth / 2, iconHeight),
                    size = new qq.maps.Size(iconWidth, iconHeight),
                    origin = new qq.maps.Point(0, 0),
                    icon = new qq.maps.MarkerImage(iconPath, size, origin, anchor);
                that.MARKERSARRAY[index].setIcon(icon);
            },
            /*地图上标记点*/
            layMarker: function (lat, lng, iconType) {
                var that = this, center = new qq.maps.LatLng(lat, lng), marker = null,
                    iconPath = that.ICON[iconType].path, iconWidth = that.ICON[iconType].width, iconHeight = that.ICON[iconType].height;
                if (iconPath) {
                    var anchor = new qq.maps.Point(iconWidth / 2, iconHeight),
                        size = new qq.maps.Size(iconWidth, iconHeight),
                        origin = new qq.maps.Point(0, 0),
                        icon = new qq.maps.MarkerImage(iconPath, size, origin, anchor);
                    marker = new qq.maps.Marker({
                        icon: icon,
                        position: center,
                        map: Lib.MAP
                    });
                } else {
                    marker = new qq.maps.Marker({
                        position: center,
                        map: Lib.MAP
                    });
                }
                return marker;
            },
            deleteOverlays: function () {
                var that = this;
                if (that.MARKERSARRAY) {
                    for (i in that.MARKERSARRAY) {
                        that.MARKERSARRAY[i].setMap(null);
                    }
                    that.MARKERSARRAY.length = 0;
                }
            }
        }
    })();

    house.init();

})();

