/**
 * Created by chancejoy on 2015/8/3.
 */
(function () {
    var list = (function () {
        return {
            TEMPLATE_LIST: doT.template($('#template-list').text()),//列表模板
            TEMPLATE_MENU_LIST: doT.template($('#template-menu-list').text()),//菜单模板
            MENU: null,
            CUR_BLOCK: 'MENU',
            DATAID: null,
            DATA: null,
            ListScroll: null,
            init: function () {
                var that = this;
                that.initContent();
                that.keyListener();
            },
            //菜单和列表
            initContent: function () {
                var id = Lib.getQueryString('id');
                this.getMenuData(id);
                Lib['MENU_INDEX'] = 0;
            },
            control: function (e) {
                var that = this;
                //console.log(that.CUR_BLOCK + "-" + e.keyCode);
                if (that.CUR_BLOCK == 'MENU') {
                    if (e && e.keyCode == 39) {//右键
                        that.CUR_BLOCK = 'LIST';
                        $($('#viewList').find("li")[Lib.VIEW_INDEX]).focus();
                    } else if (e && e.keyCode == 27) {
                        that.exit();
                        return false;
                    } else if (e && e.keyCode == 8) {
                        that.exit();
                        return false;
                    } else {
                        if (e && e.keyCode == 40) {//下键
                            if ((Lib["MENU_INDEX"] + 1) % 6 == 0) {
                                $("#menuList").css("margin-top", "-" + parseInt((Lib["MENU_INDEX"] + 1) / 6) * 486 + "px");
                            }
                        } else if (e && e.keyCode == 38) {//上键
                            if ((Lib["MENU_INDEX"]) % 6 == 0) {
                                $("#menuList").css("margin-top", "-" + parseInt((Lib["MENU_INDEX"] - 1) / 6) * 486 + "px");
                            }
                        }
                        Lib.listAreaListener({
                            e: e,
                            columnNum: 1,
                            type: 'menu',
                            enter: function () {
                                if (!$(e.target).attr("data-id")) {
                                    window.location.href = that.MENU.searchUrl;
                                }
                            }
                        });
                    }
                } else if (that.CUR_BLOCK == 'LIST') {
                    if (e && (e.keyCode == 40 || e.keyCode == 39 && Lib.VIEW_INDEX % 9 == 8)) {//下键
                        if (Lib.VIEW_INDEX % 9 > 5 && Lib.VIEW_INDEX % 9 < 9 && (that.ListScroll.currentPage.pageY + 1) < that.ListScroll.pages[0].length) {
                            that.ListScroll.next(0);
                        }
                    } else if (e && e.keyCode == 38) {//上键
                        if (Lib.VIEW_INDEX % 9 > -1 && Lib.VIEW_INDEX % 9 < 3 && Lib.VIEW_INDEX > 3) {
                            that.ListScroll.prev(0);
                        }
                    } else if (e && e.keyCode == 37) {
                        if (Lib.VIEW_INDEX % 3 == 0) {
                            that.CUR_BLOCK = 'MENU';
                            $($("#menuList").find("li")[Lib["menu".toUpperCase() + '_INDEX']]).focus();
                            return false;
                        }
                    } else if (e && e.keyCode == 27) {
                        that.exit();
                        return false;
                    } else if (e && e.keyCode == 8) {
                        that.exit();
                        return false;
                    }

                    Lib.listAreaListener({
                        e: e,
                        columnNum: 3,
                        type: 'view',
                        enter: function () {
                            var id = Lib.getQueryString('id');
                            if (id == "cff4c78b6825bc3d112df4781700528c") {
                                var house = that.list[$(e.target).attr('data-index')];
                                window.location.href = '../house/house.html?hid=' + house.hid + '&tel=' + house.tel + '&lat=' + house.lat + '&lng=' + house.lng + "&" + $(e.target).attr('data-pano').split('#')[1];
                            } else {
                                window.location.href = '../view/view.html?id=' + id + '&cid=' + that.DATAID + "&" + $(e.target).attr('data-pano').split('#')[1];
                            }
                        }
                    });
                } else if (that.CUR_BLOCK == 'PAGE_BODY') {
                    if (e && e.keyCode == 27 || e && e.keyCode == 8) {
                        return false;
                    }
                }
            },
            keyListener: function () {
                var that = this;
                document.onkeydown = function (event) {
                    var e = event || window.event || arguments.callee.caller.arguments[0];
                    return that.control(e);
                };
                if (Lib.getQueryString("click")) {
                    $("#exit").show().click(function () {
                        var e = event || window.event || arguments.callee.caller.arguments[0];
                        e.keyCode = 27;
                        that.control(e);
                    });
                }


            },
            getMenuData: function (id) {
                var that = this;
                Lib.getData(Lib.DATA_PATH['subject'] + id + '.json', function (result) {
                    if (result.status == 1) {
                        that.MENU = result;
                        $("#listTitle > img").attr("src", "../../data/images/" + result.icon);
                        $("#listTitle > div").html(result.name);
                        $("#menuList").html(that.TEMPLATE_MENU_LIST(result.list));
                        that.bindFocus("#menuList li");
                        $('#menuList li:first-child').attr('tabindex', -1).focus();
                        $('#menuList li').focus(function () {
                            var src = $('#menuList li:last-child').find("img").attr("src").replace("_02", "_01");
                            $('#menuList li:last-child').find("img").attr("src", src);
                        }).click(function () {
                            $(this).focus();
                        });
                        $('#menuList li:last-child').focus(function () {
                            var src = $(this).find("img").attr("src").replace("_01", "_02");
                            $(this).find("img").attr("src", src);
                        }).click(function () {
                            window.location.href = that.MENU.searchUrl + "?click=true";
                        });

                        new IScroll('#menu_wrapper', {mouseWheel: true, click: true});

                    }
                });
            },
            //获取列表数据
            getListData: function (id) {
                var that = this;
                Lib.getData(Lib.DATA_PATH['subject'] + Lib.getQueryString('id') + "/" + id + '.json', function (result) {
                    if (result.status == 1) {
                        that.DATA = result;
                        that.list = result.list;
                        $(".iScrollVerticalScrollbar").remove();
                        $('#viewList').html(that.TEMPLATE_LIST(result));
                        Lib.VIEW_INDEX = 0;

                        $("#viewList li").click(function () {
                            var id = Lib.getQueryString('id');
                            if (id == "cff4c78b6825bc3d112df4781700528c") {
                                var house = that.list[$(this).attr('data-index')];
                                window.location.href = '../house/house.html?hid=' + house.hid + '&tel=' + house.tel + '&lat=' + house.lat + '&lng=' + house.lng + "&" + $(this).attr('data-pano').split('#')[1] + "&click=true";
                            } else {
                                window.location.href = '../view/view.html?id=' + id + '&cid=' + that.DATAID + '&' + $(this).attr('data-pano').split('#')[1] + "&click=true";
                            }
                        });

                        that.ListScroll = new IScroll('#view_wrapper', {
                            mouseWheel: true,
                            click: true,
                            scrollbars: true,
                            snap: true
                        });
                    }
                });
            },
            /*绑定焦点事件*/
            bindFocus: function (name) {
                var that = this;
                $(name).focus(function () {
                    $(".cur").removeClass('cur');
                    $(this).addClass('cur');
                    if ($(this).attr("data-id") && that.DATAID != $(this).attr("data-id")) {
                        that.DATAID = $(this).attr("data-id");
                        that.getListData($(this).attr("data-id"));

                    }
                });
            },
            exit: function () {
                window.location.href = '../index/index.html?id=' + Lib.getQueryString('id');
            }
        }
    })();
    list.init();

    var musicList = [
        "../../audio/ajdwh.mp3",
        "../../audio/cidm.mp3",
        "../../audio/rtl.mp3",
        "../../audio/sndqd.mp3",
        "../../audio/Refrain.mp3"
    ];

    new GHSMLib.AudioPlayer(musicList, 2);
})();