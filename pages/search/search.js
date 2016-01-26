!function (window, document) {
    var init = function () {
        this.u = true;
        Lib.mapInit(this);
        vicinity.getData();
        $('#hintContainer').attr('class', 'searchMap').show();
        keyListener.container();
        keyListener.keyborad();
        keyListener.pageBody();
        Lib.mapFocus();
        controlStatus.status = true;

        if (Lib.getQueryString("click")) {
            $("#exit").show();
        }

        changeAdd();
    };

    var changeAdd = function () {
        var sock = new SockJS('http://wx.digital-media.com.cn/wx/tvapi?token=card1');
        var stompClient = Stomp.over(sock);
        stompClient.debug = function (str) {
            //console.log(str);
        };
        stompClient.connect({}, function (frame) {
            stompClient.subscribe("/topic/address", function (data) {
                data = JSON.parse(data.body);
                if (data) {
                    $("#address").html(data.address);
                    $("#name").html(data.name);
                    $("#tel").html(data.phone);
                }
            });
        }, function (msg) {
            //console.log(msg)
        });
    };

    var vicinity = {
        data: null,
        label: [],
        vicinityDot: doT.template($('#vicinityDot').text()),
        getData: function () {
            var self = this;
            $.ajax({
                url: "../../data/json/vicinity.json",
                dataType: "json",
                success: function (data) {
                    self.data = data.list;
                    if (data.status == 1) {
                        self.showLabel(data.list);
                        $("#vicinityList").html(self.vicinityDot(data.list))
                        self.keyListener();

                        var qr = "http://172.16.188.13/api/common/Image/qrCode.png?text=http://211.99.155.46/web/StreetView/pages/position/index.html?cardId=" + Lib.user.CardID + "&size=300";
                        $("#DDCode").attr("src", qr);
                        var qr2 = "http://172.16.188.13/api/common/Image/qrCode.png?text=http://211.99.155.46/web/StreetView/pages/position/index.html?cardId=" + Lib.user.CardID + "&size=250";
                        $("#vicinityDetailQr").attr("src", qr2);
                    }
                }
            });
        },
        showLabel: function (list) {
            var Label = function (opts) {
                qq.maps.Overlay.call(this, opts);
            };

            //继承Overlay基类
            Label.prototype = new qq.maps.Overlay();
            //定义construct,实现这个接口来初始化自定义的Dom元素
            Label.prototype.construct = function () {
                this.dom = document.createElement('div');
                this.dom.style.cssText =
                    'position:absolute;' +
                    'text-align:center;' +
                    'width:206px' +
                    'height:122px';
                this.dom.innerHTML = '<img src="' + this.image + '" style="position: absolute;top:0 ;z-index: 1"/><img src="images/ad.png" style="position: absolute;top: 0;left: 0;;">';

                this.getPanes().overlayMouseTarget.appendChild(this.dom);
                //设置自定义覆盖物点击事件
                this.dom.onclick = function () {
                }
            };
            //绘制和更新自定义的dom元素
            Label.prototype.draw = function () {
                //获取地理经纬度坐标
                var position = this.get('position');
                if (position) {
                    var d = this.dom;
                    var pixel = this.getProjection().fromLatLngToDivPixel(position);
                    d.style.left = pixel.getX() - 63 + 'px';
                    d.style.top = pixel.getY() - 122 + 'px';
                }
            };

            Label.prototype.destroy = function () {
                //移除dom
                this.dom.parentNode.removeChild(this.dom);
            };

            for (var i = 0; i < list.length; i++) {
                var label = new Label({
                    map: Lib.MAP,
                    position: new qq.maps.LatLng(list[i].map.lat, list[i].map.lng),
                    id: list[i].id,
                    image: "../../data/images/vicinity/" + list[i].id + "_m.png"
                });
                this.label.push(label);
            }
        },
        keyListener: function () {
            var self = this;
            GHSMLib.keyCon.listKeyListener({
                id: "vicinityList",
                columnNum: 6,
                label: "li",
                enter: function (item) {
                    var idx = $(item).index();
                    var id = self.data[idx].id;
                    if (id == 1 || id == 3 || id == 7) {
                        $("#pageBody").focus();
                        $($("#vicinityDetail").css("left", "0").find("img")[0]).attr("src", "../../data/images/vicinity/" + id + "_d.png");
                        setTimeout(function () {
                            $("#vicinityDetail").attr("tabindex", "-1").focus();
                        }, 1000);
                    } else if (id == 4 || id == 5) {
                        $("#pageBody").focus();
                        /*view.getView(self.data[idx]);
                         $("#viewDetail").css("left", "0");
                         setTimeout(function () {
                         $($("#viewDetailMenuList").find("li")[0]).focus();
                         }, 1000)*/
                        window.location.href = self.data[idx].url;
                    } else if (id == 2) {
                        $("#pageBody").focus();
                        buy.init();
                    }
                },
                esc: function () {
                    exit();
                    return false;
                },
                back: function () {
                    Lib.mapFocus();
                    $("#pageBody").focus();
                    $("#vicinity").css("bottom", "-250px");
                    return false;
                }
            });
            GHSMLib.keyCon.keyListener({
                id: "vicinityDetail",
                enter: function (item) {
                    $("#pageBody").focus();
                    $("#vicinityDetail").css("left", "1280px");
                    setTimeout(function () {
                        $("#vicinityList").find("li")[GHSMLib.keyCon.index["vicinityList"]].focus();
                    }, 1000)
                },
                esc: function () {
                    exit();
                    return false;
                },
                back: function () {
                    $("#pageBody").focus();
                    $("#vicinityDetail").css("left", "1280px");
                    setTimeout(function () {
                        $("#vicinityList").find("li")[GHSMLib.keyCon.index["vicinityList"]].focus();
                    }, 1000)
                    return false;
                }
            });
        }
    };

    var buy = {
        count: [],//存储菜单购买数量数组
        price: [11, 9, 28, 9.5],//菜单价
        CART_LIST: [],//购物车列表
        CUR_BLOCK: null,
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
        TEMPLATE_ITEM: doT.template($('#template-item').text()),
        init: function () {
            var that = this;

            var user = Lib.getUserPosition();
            $("#address").html(user.address);
            $("#name").html(user.name);
            $("#tel").html(user.phone);

            $(".detailImg").css("left", "0");
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
            that.CUR_BLOCK = "BUY";
            that.keyListener();
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

        },
        /*菜单内容生成，根据类别改变*/
        initMenuList: function (options) {
            var that = this, list = that.MENU_DATA[options.index].list;
            if (options.page == 0 || options.page) {
                var start = 4 * (options.page - 1), end = 4 * options.page > list.length ? list.length : 4 * options.page;
                list = list.slice(start, end);
            }
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
        control: function (e) {
            var that = this;

            //麦当劳购买
            if (that.CUR_BLOCK == 'BUY') {
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
                    exit();
                }
                if (e && e.keyCode == 8) { // 返回
                    controlStatus.control(function () {
                        $(".detailImg").css("left", "1280px");
                        that.CUR_BLOCK = 'LIST';
                        setTimeout(function () {
                            $("#vicinityList").find("li")[GHSMLib.keyCon.index["vicinityList"]].focus();
                        }, 1000)
                    }, 1000);
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
                if (e && e.keyCode == 27) { // �?Esc/返回
                    exit();
                }
                if (e && e.keyCode == 8) { // 返回
                    controlStatus.control(function () {
                        $(".detailImg").css("left", "1280px");
                        that.CUR_BLOCK = 'LIST';
                        setTimeout(function () {
                            $("#vicinityList").find("li")[GHSMLib.keyCon.index["vicinityList"]].focus();
                        }, 1000)
                    }, 1000);
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
                if (e && e.keyCode == 27) { // �?Esc/返回
                    exit();
                }
                if (e && e.keyCode == 8) { // 返回
                    controlStatus.control(function () {
                        $(".detailImg").css("left", "1280px");
                        that.CUR_BLOCK = 'LIST';
                        setTimeout(function () {
                            $("#vicinityList").find("li")[GHSMLib.keyCon.index["vicinityList"]].focus();
                        }, 1000)
                    }, 1000);
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
                if (e && e.keyCode == 27) { // �?Esc/返回
                    exit();
                }
                if (e && e.keyCode == 8) { // 返回
                    controlStatus.control(function () {
                        $(".detailImg").css("left", "1280px");
                        that.CUR_BLOCK = 'LIST';
                        setTimeout(function () {
                            $("#vicinityList").find("li")[GHSMLib.keyCon.index["vicinityList"]].focus();
                        }, 1000)
                    }, 1000);
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
                if (e && e.keyCode == 27) { // �?Esc/返回
                    exit();
                }
                if (e && e.keyCode == 8) { // esc返回
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
                        $('.shoppingCart').removeClass('shoppingCart');
                        controlStatus.control(function () {
                            $(".detailImg").css("left", "1280px");
                            that.CUR_BLOCK = 'LIST';
                            setTimeout(function () {
                                $("#vicinityList").find("li")[GHSMLib.keyCon.index["vicinityList"]].focus();
                            }, 1000)
                        }, 1000);
                    }, 2000);
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
                return that.control(e);
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
        }
    };

    var view = {
        viewDetailDot: doT.template($('#viewDetailDot').text()),
        navDetailDot: doT.template($('#navDetailDot').text()),
        ICON: {
            viewCenter: {
                path: 'images/viewCenter.png',
                width: 56,
                height: 56
            }
        },
        POSITION_MAP: null,
        getView: function (v) {
            $('#viewDetail').html(this.viewDetailDot(v));
            this.getPositionMap(v);
            this.getNav(v);
            this.keyListener();
        },
        keyListener: function () {
            var self = this;
            GHSMLib.keyCon.listKeyListener({
                id: "viewDetailMenuList",
                columnNum: 2,
                label: "li",
                focus: function (item) {
                    var idx = $(item).index();
                    $(item).find("img").attr("src", "images/view_detail_0" + (idx + 1) + "_focus.png");
                },
                blur: function (item) {
                    var idx = $(item).index();
                    $(item).find("img").attr("src", "images/view_detail_0" + (idx + 1) + ".png");
                },
                enter: function (item) {
                    var idx = $(item).index();
                    if (idx == 0) {
                        $('#positionMap').css('left', '0');
                        setTimeout(function () {
                            $($($($('#positionMap').attr("tabindex", "-1").focus().children().children()[0]).children().children()[2]).children()[1]).trigger('click');
                            $('#hintContainer').css("z-index", "5");
                        }, 1000);
                    } else if (idx == 1) {
                        $('#navMap').css('left', '0');
                        setTimeout(function () {
                            $($('#navMenuList').find("li")[0]).focus();
                        }, 500)
                    }

                },
                esc: function () {
                    exit();
                    return false;
                },
                back: function () {
                    controlStatus.control(function () {
                        $("#viewDetail").css("left", "1280px");
                        setTimeout(function () {
                            $("#vicinityList").find("li")[GHSMLib.keyCon.index["vicinityList"]].focus();
                        }, 1000);
                        self.POSITION_MAP = null;
                        $("#positionMap").html("");
                    }, 1000);
                    return false;
                }
            });
            GHSMLib.keyCon.keyListener({
                id: "positionMap",
                pageUp: function () {
                    self.POSITION_MAP.setZoom(self.POSITION_MAP.getZoom() + 1);
                },
                pageDown: function () {
                    self.POSITION_MAP.setZoom(self.POSITION_MAP.getZoom() - 1);
                },
                click: function () {
                    return false;
                },
                esc: function () {
                    exit();
                    return false;
                },
                back: function () {
                    controlStatus.control(function () {
                        $("#positionMap").css("left", "1280px");
                        $('#hintContainer').css("z-index", "");
                        setTimeout(function () {
                            $("#viewDetail").trigger("click");
                            $("#viewDetailMenuList").find("li")[0].focus();
                        }, 1000)
                    }, 1000);
                    return false;
                }
            });
            GHSMLib.keyCon.listKeyListener({
                id: "navMenuList",
                columnNum: 1,
                label: "li",
                focus: function (item) {
                    var idx = $(item).index();
                    var src = $(item).find("img").attr("src").replace("_focus.png", ".png").replace(".png", "_focus.png");
                    $(item).find("img").attr("src", src);
                    $("#navContent_" + idx).show();
                },
                blur: function (item) {
                    var idx = $(item).index();
                    var src = $(item).find("img").attr("src").replace("_focus.png", ".png");
                    $(item).find("img").attr("src", src);
                    $("#navContent_" + idx).hide();
                },
                enter: function (item) {
                },
                esc: function () {
                    exit();
                    return false;
                },
                back: function () {
                    controlStatus.control(function () {
                        $("#navMap").css("left", "1280px");
                        setTimeout(function () {
                            $("#viewDetailMenuList").find("li")[1].focus();
                        }, 1000)
                    }, 1000);
                    return false;
                }
            });
        },
        getPositionMap: function (v) {
            //位置地图初始化
            var center = new qq.maps.LatLng(v.map.lat, v.map.lng);
            if (!this.POSITION_MAP) {
                //平面地图初始化
                this.POSITION_MAP = new qq.maps.Map(document.getElementById('positionMap'), {
                    center: center,
                    zoom: v.map.zoom,
                    disableDefaultUI: true
                });
            } else {
                this.POSITION_MAP.panTo(center);
            }

            var iconType = "viewCenter", iconPath = this.ICON[iconType].path, iconWidth = this.ICON[iconType].width, iconHeight = this.ICON[iconType].height;
            var anchor = new qq.maps.Point(iconWidth / 2, iconHeight),
                size = new qq.maps.Size(iconWidth, iconHeight),
                origin = new qq.maps.Point(0, 0),
                icon = new qq.maps.MarkerImage(iconPath, size, origin, anchor);
            var marker = new qq.maps.Marker({
                icon: icon,
                position: center,
                map: this.POSITION_MAP
            });
        },
        getNav: function (v) {
            var uP = Lib.getUserPosition();
            var nav = {};
            nav.start = uP.address;
            nav.end = v.name;
            $("#navMapContent").html(this.navDetailDot(nav));
            this.transfer(uP.map.lat, uP.map.lng, v.map.lat, v.map.lng);
            this.driving(uP.map.lat, uP.map.lng, v.map.lat, v.map.lng);
        },
        transfer: function (sLat, sLng, eLat, eLng) {
            var map,
                transfer_plans,
                start_marker,
                end_marker,
                station_markers = [],
                transfer_lines = [],
                walk_lines = [],
                that = this;

            var transferService = new qq.maps.TransferService({
                location: "北京",
                complete: function (result) {
                    result = result.detail;
                    var start = result.start,
                        end = result.end;
                    var anchor = new qq.maps.Point(12, 0),
                        size = new qq.maps.Size(24, 36),
                        start_icon = new qq.maps.MarkerImage(
                            'images/busmarker.png',
                            size
                        ),
                        end_icon = new qq.maps.MarkerImage(
                            'images/busmarker.png',
                            size,
                            new qq.maps.Point(24, 0)
                        );

                    start_marker && start_marker.setMap(null);
                    end_marker && end_marker.setMap(null);
                    start_marker = new qq.maps.Marker({
                        icon: start_icon,
                        position: start.latLng,
                        map: map
                    });
                    end_marker = new qq.maps.Marker({
                        icon: end_icon,
                        position: end.latLng,
                        map: map
                    });

                    transfer_plans = result.plans;
                    var plans_desc = [];
                    var actions = transfer_plans[0].actions;
                    for (var j = 0; j < actions.length; j++) {
                        var action = actions[j],
                            img_position;
                        action.type == qq.maps.TransferActionType.BUS && (
                            img_position = '-38px 0px'
                        );
                        action.type == qq.maps.TransferActionType.SUBWAY && (
                            img_position = '-57px 0px'
                        );
                        action.type == qq.maps.TransferActionType.WALK && (
                            img_position = '-76px 0px'
                        );

                        var action_img = '<li><span style="margin-bottom: -4px;' +
                            'display:inline-block;background:url(images/busicon.png) ' +
                            'no-repeat ' + img_position +
                            ';width:19px;height:19px"></span>&nbsp;&nbsp;';
                        plans_desc.push(action_img + action.instructions + "</li>");
                    }

                    document.getElementById('busPlan').innerHTML = plans_desc.join('');
                    //渲染到地图上
                    renderPlan(0);
                    new IScroll('#bus_wrapper', {mouseWheel: true, click: true});
                },
                error: function () {
                    that.transfer(sLat, sLng, eLat, eLng)
                }
            });

            function init() {
                map = new qq.maps.Map(document.getElementById("transferMap"), {
                    // 地图的中心地理坐标。
                    center: new qq.maps.LatLng(eLat, eLng),
                    disableDefaultUI: true
                });
                that.TRANSFER_MAP = map;
                calcPlan();
            }

            function calcPlan() {
                transferService.search(new qq.maps.LatLng(sLat, sLng), new qq.maps.LatLng(eLat, eLng));
                //transferService.setPolicy(qq.maps.TransferActionType.LEAST_TIME);
            }

            //清除地图上的marker
            function clearOverlay(overlays) {
                var overlay;
                while (overlay = overlays.pop()) {
                    overlay.setMap(null);
                }
            }

            function renderPlan(index) {
                var plan = transfer_plans[index],
                    lines = plan.lines,
                    walks = plan.walks,
                    stations = plan.stations;
                map.fitBounds(plan.bounds);

                //clear overlays;
                clearOverlay(station_markers);
                clearOverlay(transfer_lines);
                clearOverlay(walk_lines);
                var anchor = new qq.maps.Point(6, 6),
                    size = new qq.maps.Size(24, 36),
                    bus_icon = new qq.maps.MarkerImage(
                        'images/busmarker.png',
                        size,
                        new qq.maps.Point(48, 0)
                    ),
                    subway_icon = new qq.maps.MarkerImage(
                        'images/busmarker.png',
                        size,
                        new qq.maps.Point(72, 0)
                    );
                //draw station marker
                for (var j = 0; j < stations.length; j++) {
                    var station = stations[j];
                    if (station.type == qq.maps.PoiType.SUBWAY_STATION) {
                        var station_icon = subway_icon;
                    } else {
                        var station_icon = bus_icon;
                    }
                    var station_marker = new qq.maps.Marker({
                        icon: station_icon,
                        position: station.latLng,
                        map: map,
                        zIndex: 0
                    });
                    station_markers.push(station_marker);
                }

                //draw bus line
                for (var j = 0; j < lines.length; j++) {
                    var line = lines[j];
                    var polyline = new qq.maps.Polyline({
                        path: line.path,
                        strokeColor: '#3893F9',
                        strokeWeight: 6,
                        map: map
                    });
                    transfer_lines.push(polyline);
                }

                //draw walk line
                for (var j = 0; j < walks.length; j++) {
                    var walk = walks[j];
                    var polyline = new qq.maps.Polyline({
                        path: walk.path,
                        strokeColor: '#3FD2A3',
                        strokeWeight: 6,
                        map: map
                    });
                    walk_lines.push(polyline);
                }
            }

            init();
        },
        driving: function (sLat, sLng, eLat, eLng) {
            var map,
                directions_routes,
                directions_placemarks = [],
                directions_labels = [],
                start_marker,
                end_marker,
                route_lines = [],
                step_line,
                route_steps = [],
                that = this;

            var directionsService = new qq.maps.DrivingService({
                location: "北京",
                complete: function (result) {
                    result = result.detail;
                    var start = result.start,
                        end = result.end;
                    var anchor = new qq.maps.Point(6, 6),
                        size = new qq.maps.Size(24, 36),
                        start_icon = new qq.maps.MarkerImage(
                            'images/busmarker.png',
                            size
                        ),
                        end_icon = new qq.maps.MarkerImage(
                            'images/busmarker.png',
                            size,
                            new qq.maps.Point(24, 0)
                        );

                    start_marker && start_marker.setMap(null);
                    end_marker && end_marker.setMap(null);
                    start_marker = new qq.maps.Marker({
                        icon: start_icon,
                        position: start.latLng,
                        map: map,
                        zIndex: 1
                    });
                    end_marker = new qq.maps.Marker({
                        icon: end_icon,
                        position: end.latLng,
                        map: map,
                        zIndex: 1
                    });


                    directions_routes = result.routes;
                    var routes_desc = [];
                    //所有可选路线方案
                    var route = directions_routes[0],
                        legs = route;
                    //调整地图窗口显示所有路线
                    map.fitBounds(result.bounds);
                    //所有路程信息
                    //for(var j = 0 ; j < legs.length; j++){
                    var steps = legs.steps;
                    route_steps = steps;
                    polyline = new qq.maps.Polyline(
                        {
                            path: route.path,
                            strokeColor: '#3893F9',
                            strokeWeight: 6,
                            map: map
                        }
                    );
                    route_lines.push(polyline);
                    //所有路段信息
                    for (var k = 0; k < steps.length; k++) {
                        var step = steps[k];
                        //路段途经地标
                        directions_placemarks.push(step.placemarks);
                        //转向
                        var turning = step.turning,
                            img_position;
                        switch (turning.text) {
                            case '左转':
                                img_position = '0px 0px'
                                break;
                            case '右转':
                                img_position = '-19px 0px'
                                break;
                            case '直行':
                                img_position = '-38px 0px'
                                break;
                            case '偏左转':
                            case '靠左':
                                img_position = '-57px 0px'
                                break;
                            case '偏右转':
                            case '靠右':
                                img_position = '-76px 0px'
                                break;
                            case '左转调头':
                                img_position = '-95px 0px'
                                break;
                            default:
                                mg_position = ''
                                break;
                        }
                        var turning_img = '<span' +
                            ' style="margin-bottom: -3px;' +
                            'display:inline-block;background:' +
                            'url(images/turning.png) no-repeat ' +
                            img_position + ';width:19px;height:' +
                            '19px"></span>&nbsp;';
                        routes_desc.push("<li>" + turning_img + step.instructions + "</li>");
                    }
                    //方案文本描述
                    document.getElementById('carPlan').innerHTML = routes_desc.join('');
                    new IScroll('#car_wrapper', {mouseWheel: true, click: true});
                },
                error: function () {
                    that.driving(sLat, sLng, eLat, eLng)
                }
            });

            function init() {
                map = new qq.maps.Map(document.getElementById("drivingMap"), {
                    // 地图的中心地理坐标。
                    center: new qq.maps.LatLng(eLat, eLng),
                    disableDefaultUI: true
                });
                that.DRIVING_MAP = map;
                calcRoute();
            }

            function calcRoute() {
                route_steps = [];
                //directionsService.setPolicy(qq.maps.DrivingPolicy["LEAST_TIME"]);
                directionsService.search(new qq.maps.LatLng(sLat, sLng), new qq.maps.LatLng(eLat, eLng));
            }

            //清除地图上的marker
            function clearOverlay(overlays) {
                var overlay;
                while (overlay = overlays.pop()) {
                    overlay.setMap(null);
                }
            }

            init();
        }
    };

    var Pano = {
        PANO: null,
        showPano: function () {
            var $pannoCon = $('#panoCon');
            //街景初始化
            if ($pannoCon.html() == '') {
                this.PANO = new mapT();
                this.PANO.init();
            } else {
                this.PANO.reInit();
            }
            var result = this.PANO.toPano(Lib.MAP.getCenter().getLat(), Lib.MAP.getCenter().getLng());
            if (!result) {
                this.PANO.changeArea(-1);
                return false;
            }
            $('#container').hide();
            $pannoCon.show();
            $('#album').show();
            $('#hintContainer').attr('class', 'panoMap');
            $('#_panoSwf_0').focus().trigger('click');
            keyListener.pano();
            return true;
        }
    };

    var map = {
        searchDot: doT.template($('#searchDot').text()),
        search: function () {
            var input = $('#search_input').val(), lat1, lng1;
            lat1 = Lib.MAP.getCenter().getLat();
            lng1 = Lib.MAP.getCenter().getLng();
            var result = this.suggestion(input, lat1, lng1);
            var $searchList = $('#searchList');
            if (result.status == 0) {
                var count = result.count;
                if (count == 0) {
                    $searchList.html('<li style="text-align: center;">未找到相关地点</li>');
                } else {
                    $searchList.html(this.searchDot(result.data));
                }
                new IScroll('#resultContainer', {mouseWheel: true, click: true});
            } else {
                $searchList.html('<li style="text-align: center;">未找到相关地点</li>');
            }
            keyListener.searchList();
            $($searchList.find("li")[0]).focus();
        },
        getSuggestionByCity: function (keyword, city) {
            var r = new Object();
            $.ajax({
                url: TXConneturl + "http://apis.map.qq.com/ws/place/v1/suggestion?",
                type: "GET",
                async: false,
                data: ({
                    region: city,
                    keyword: keyword,
                    output: "json",
                    key: "4F5BZ-ZQSCP-FM6DI-VT2TU-HDRU7-OWBBU"
                }),
                success: function (data) {
                    r = data;

                }
            });
            return r;
        },
        suggestion: function (keyword, lat, lng) {
            var city = '';
            $.ajax({
                url: TXConneturl + "http://apis.map.qq.com/ws/geocoder/v1?",
                type: "GET",
                async: false,
                data: ({
                    location: lat + ',' + lng,
                    get_poi: 0,
                    key: "4F5BZ-ZQSCP-FM6DI-VT2TU-HDRU7-OWBBU"
                }),
                success: function (data) {
                    if (data.status == 0) {
                        city = data.result.address_component.city;
                    } else {
                        city = '北京市';
                    }
                },
                error: function () {
                    city = '北京市';
                }
            });
            return this.getSuggestionByCity(keyword, city);
        }
    };


    var keyListener = {
        pageBody: function () {
            GHSMLib.keyCon.keyListener({
                id: "pageBody",
                esc: function () {
                    return false;
                },
                back: function () {
                    return false;
                }
            });
        },
        container: function () {
            GHSMLib.keyCon.keyListener({
                id: "container",
                pageUp: function () {
                    Lib.MAP.setZoom(Lib.MAP.getZoom() + 1);
                },
                pageDown: function () {
                    Lib.MAP.setZoom(Lib.MAP.getZoom() - 1);
                },
                enter: function () {
                    $("#pageBody").focus();
                    menus_effect(true);
                    keyListener.menus();
                    setTimeout(function () {
                        $("#menus").attr("tabindex", "-1").focus().trigger("click");
                    }, 500);
                },
                click: function () {
                    return false;
                },
                esc: function () {
                    exit();
                    return false;
                },
                back: function () {
                    exit();
                    return false;
                }
            });
        },
        menus: function () {
            GHSMLib.keyCon.keyListener({
                id: "menus",
                enter: function () {
                    $("#pageBody").focus();
                    menus_effect(false);
                    Lib.mapFocus();
                },
                up: function () {
                    $("#pageBody").focus();
                    $("#search").css("top", "0");
                    $("#tv_keyboard").css("bottom", "0");
                    menus_effect(false);
                    setTimeout(function () {
                        $($("#tv_keyboard").find("li")[0]).focus();
                    }, 1000);
                },
                down: function () {
                    $("#pageBody").focus();
                    $("#vicinity").css("bottom", "0");
                    menus_effect(false);
                    setTimeout(function () {
                        $($("#vicinityList").find("li")[0]).focus();
                    }, 1000);
                },
                left: function () {
                    controlStatus.control(function () {
                        menus_effect(false);
                        Pano.showPano();
                    }, 100)
                },
                right: function () {
                    $("#pageBody").focus();
                    window.location.href = '../list/list.html?id=cff4c78b6825bc3d112df4781700528c&click=true';
                },
                click: function (item) {
                    return false;
                },
                esc: function () {
                    exit();
                    return false;
                },
                back: function () {
                    $("#pageBody").focus();
                    menus_effect(false);
                    Lib.mapFocus();
                    return false;
                }
            });
        },
        pano: function () {
            GHSMLib.keyCon.keyListener({
                id: "_panoSwf_0",
                click: function () {
                    return false;
                },
                esc: function () {
                    exit();
                    return false;
                },
                back: function () {
                    $("#pageBody").focus();
                    $('#container').show();
                    $('#panoCon').hide();
                    $('#album').hide();
                    $('#hintContainer').attr('class', 'searchMap');
                    Pano.PANO.changeArea(-1);
                    Lib.mapFocus();
                    return false;
                }
            });
        },
        keyborad: function () {
            GHSMLib.keyCon.listKeyListener({
                id: "tv_keyboard",
                columnNum: 10,
                label: "li",
                enter: function (item) {
                    var str = $(item).html();
                    if (str == "删除") {
                        keyboard.backspace();
                    } else if (str == "搜索") {
                        $("#pageBody").focus();
                        $("#tv_keyboard").css("bottom", "-384px");
                        setTimeout(function () {
                            $("#resultContainer").css("top", "148px");
                            $('#searchList').html('<li style="text-align: center;">搜索中，请稍候。。。</li>');
                        }, 1000);
                        setTimeout(function () {
                            map.search();
                        }, 3500);
                    } else {
                        keyboard.str = keyboard.str + str;
                        if (keyboard.inputObj) {
                            keyboard.inputObj.val(keyboard.str);
                        }
                    }
                },
                esc: function () {
                    exit();
                    return false;
                },
                back: function () {
                    $("#pageBody").focus();
                    $("#search").css("top", "-148px");
                    $("#tv_keyboard").css("bottom", "-384px");
                    keyboard.clear();
                    Lib.mapFocus();
                    return false;
                }
            });
        },
        searchList: function () {
            GHSMLib.keyCon.listKeyListener({
                id: "searchList",
                columnNum: 1,
                label: "li",
                focus: function (item) {
                    var b = $(item).find("button");
                    if (b.length > 0)
                        b.addClass("cur");
                },
                blur: function (item) {
                    var b = $(item).find("button");
                    if (b.length > 0)
                        b.removeClass("cur");
                },
                enter: function (item) {
                    var obj = $(item).find("button")[0];
                    if (obj) {
                        $("#pageBody").focus();
                        Lib.MAP.panTo(new qq.maps.LatLng($(obj).attr('data-lat'), $(obj).attr('data-lng')));
                        $("#search").css("top", "-148px");
                        $("#resultContainer").css("top", "720px");
                        keyboard.clear();
                        Lib.mapFocus();
                    } else {
                        $("#pageBody").focus();
                        $("#resultContainer").css("top", "720px");
                        setTimeout(function () {
                            $("#tv_keyboard").css("bottom", "0");
                            setTimeout(function () {
                                $($("#tv_keyboard").find("li")[39]).focus();
                            }, 1000);
                        }, 2000);
                    }
                },
                esc: function () {
                    exit();
                    return false;
                },
                back: function () {
                    $("#pageBody").focus();
                    $("#resultContainer").css("top", "720px");
                    setTimeout(function () {
                        $("#tv_keyboard").css("bottom", "0");
                        setTimeout(function () {
                            $($("#tv_keyboard").find("li")[39]).focus();
                        }, 1000);
                    }, 2000);
                    return false;
                }
            });
        }


    };

    var keyboard = {
        str: "",
        inputObj: $('#search_input'),
        clear: function () {
            this.str = "";
            if (this.inputObj) {
                this.inputObj.val(this.str);
            }
        },
        backspace: function () {
            if (this.str.length > 0)
                this.str = this.str.substring(0, this.str.length - 1);
            if (this.inputObj) {
                this.inputObj.val(this.str);
            }
        }
    };


    var menus_effect = function (flag) {
        var time = 500;
        if (flag) {
            $("#menus").animate({
                width: "300px",
                height: "300px",
                top: "210px",
                left: "490px",
                opacity: "1"
            }, time);
            $("#menus_top").animate({
                width: "98px",
                height: "88px",
                top: "6px",
                left: "101px"
            }, time);

            $("#menus_zuo").animate({
                width: "98px",
                height: "88px",
                top: "112px",
                left: "0"
            }, time);

            $("#menus_you").animate({
                width: "98px",
                height: "88px",
                top: "112px",
                right: "0"
            }, time);

            $("#menus_xia").animate({
                width: "98px",
                height: "88px",
                bottom: "0",
                left: "101px"
            }, time);

            $("#menus_zhong").animate({
                width: "76px",
                height: "76px",
                top: "112px",
                left: "112px"
            }, time);
        } else {
            $("#menus").animate({
                width: "0",
                height: "0",
                top: "360px",
                left: "640px",
                opacity: "0"
            }, time);
            $("#menus_top").animate({
                width: "0",
                height: "0",
                top: "0",
                left: "0"
            }, time);

            $("#menus_zuo").animate({
                width: "0",
                height: "0",
                top: "0",
                left: "0"
            }, time);

            $("#menus_you").animate({
                width: "0",
                height: "0",
                top: "0",
                right: "0"
            }, time);

            $("#menus_xia").animate({
                width: "0",
                height: "0",
                bottom: "0",
                left: "0"
            }, time);

            $("#menus_zhong").animate({
                width: "0",
                height: "0",
                top: "0",
                left: "0"
            }, time);
        }
    };

    var controlStatus = {
        status: false,
        control: function (fun, time) {
            var self = this;
            if (this.status) {
                this.status = false;
                fun();
                if (time && time > 0) {
                    setTimeout(function () {
                        self.status = true;
                    }, time)
                }

            }
        }

    };

    var exit = function () {
        window.location.href = '../index/index.html';
    };

    init();

    var musicList = [
        "../../audio/ajdwh.mp3",
        "../../audio/cidm.mp3",
        "../../audio/rtl.mp3",
        "../../audio/sndqd.mp3",
        "../../audio/Refrain.mp3"
    ];

    new GHSMLib.AudioPlayer(musicList, 2);

}(window, document);