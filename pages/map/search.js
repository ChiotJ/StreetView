/**
 * Created by 英硕 on 2015/8/31.
 */
(function () {

    var view = (function () {
        return {
            CUR_BLOCK: 'MENU',
            MENU_INDEX: 0,
            MENU_LENGTH: 5,
            PANO: null,
            KEYBOARD: null,
            SEARCH_INDEX: 0,
            //搜索进程，SEARCH输入及搜索，SEARCHLIST搜索结果列表，SEARCHMAP通过结果列表进入地图，SEARCHPANO地图切换到街景
            SEARCH_PROCESS: 'SEARCH',
            TEMPLATE_SEARCH: doT.template($('#template-search').text()),//搜索结果模板
            init: function () {
                Lib.mapInit(this);
                this.keyboardInit();
                this.keyListener();
                $(".search").attr('tabindex', -1).focus();
                setTimeout(function () {
                    $(".sInput").focus();
                }, 500);

            },
            hideMenu: function () {
                $("#tv_keyboard_div").css("bottom", "-384px");
                $("#resultContainer").css("top", "720px");
                $('.search').css('top', '-148px');
            },
            showMenu: function () {
                $('.search').css('top', '0px');
            },
            showPano: function () {
                var that = this;
                //街景初始化
                if ($('#panoCon').html() == '') {
                    that.PANO = new mapT();
                    that.PANO.init();
                } else {
                    that.PANO.reInit();
                }
                var result = that.PANO.toPano(Lib.MAP.getCenter().getLat(), Lib.MAP.getCenter().getLng());
//                Lib.MAP.setOptions({keyboardShortcuts:false});
                if (!result) {
                    that.PANO.changeArea(-1);
                    return false;
                }
                $('#container').hide();
                $('#panoCon').show();
                $('#album').show();
                $('#_panoSwf_0').focus().trigger('click');
                return true;
            },
            markClick: function () {
                this.showPano();
                var rlt = this.showPano();
                if (rlt) {
                    this.hideMenu();
                    //$('#hintContainer').attr('class', 'searchPano').show();
                    this.CUR_BLOCK = 'PANO';
                }
            },
            control: function (e) {
                var that = this;
                console.log(that.CUR_BLOCK + "-" + e.keyCode);
                //菜单
                if (that.CUR_BLOCK == 'MENU') {
                    if (e && e.keyCode == 27) { // 按 Esc/返回
                        //返回首页
                        window.location.href = '../index/index.html';
                    } else if (e && e.keyCode == 39) {//右键
                        if ((that.MENU_INDEX + 1) < that.MENU_LENGTH) {
                            that.MENU_INDEX++;
                            $("#search_" + that.MENU_INDEX).focus();
                        }
                    } else if (e && e.keyCode == 37) {//左键
                        if (that.MENU_INDEX > 0) {
                            that.MENU_INDEX--;
                            $("#search_" + that.MENU_INDEX).focus();
                        }
                    } else if (e && e.keyCode == 40) {//下键
                        if ($("#tv_keyboard_div").css("bottom") == "0px") {
                            that.CUR_BLOCK = 'SEARCH';
                            that.KEYBOARD.changeItem();
                        }
                    } else if (e && e.keyCode == 13) {//enter 键
                        if (that.MENU_INDEX == 0) {
                            if (Lib.getQueryString("click")) {
                                var time = 1000;
                                that.CUR_BLOCK = 'SEARCH';
                                that.SEARCH_PROCESS = 'SEARCHLIST';
                                if ($("#tv_keyboard_div").css("bottom") == "0px") {
                                    $("#tv_keyboard_div").css("bottom", "-384px");
                                } else {
                                    time = 0;
                                }
                                setTimeout(function () {
                                    $("#resultContainer").css("top", "148px");
                                    $('#searchList').html('<li style="text-align: center;">搜索中，请稍候。。。</li>');
                                    setTimeout(function () {
                                        $($('#searchList li')[0]).attr('tabindex', -1).focus();
                                    }, 2100);
                                }, time);
                                setTimeout(function () {
                                    that.search();
                                }, 2500 + time);
                            } else {
                                that.CUR_BLOCK = 'SEARCH';
                                $("#tv_keyboard_div").css("bottom", "0px");
                                setTimeout(function () {
                                    if ($("#tv_keyboard_div").css("bottom") == "0px") {
                                        that.KEYBOARD.changeItem();
                                    }
                                }, 1100);
                            }
                        } /*else if (that.MENU_INDEX == 1) {
                         that.KEYBOARD.backspace();
                         }*/ else if (that.MENU_INDEX == 1) {
                            var time = 1000;
                            that.CUR_BLOCK = 'SEARCH';
                            that.SEARCH_PROCESS = 'SEARCHLIST';
                            if ($("#tv_keyboard_div").css("bottom") == "0px") {
                                $("#tv_keyboard_div").css("bottom", "-384px");
                            } else {
                                time = 0;
                            }
                            setTimeout(function () {
                                $("#resultContainer").css("top", "148px");
                                $('#searchList').html('<li style="text-align: center;">搜索中，请稍候。。。</li>');
                                setTimeout(function () {
                                    $($('#searchList li')[0]).attr('tabindex', -1).focus();
                                }, 2100);
                            }, time);
                            setTimeout(function () {
                                that.search();
                            }, 2500 + time);
                        } else if (that.MENU_INDEX == 2) {
                            that.hideMenu();
                            Lib.mapFocus();
                            Lib.MAP.setOptions({keyboardShortcuts: true});
                            $('#hintContainer').attr('class', 'searchMap').show();
                            that.CUR_BLOCK = 'MAP';
                        } else if (that.MENU_INDEX == 3) {
                            window.location.href = '../community/community.html';
                        } else if (that.MENU_INDEX == 4) {
                            window.location.href = '../list/list.html?id=cff4c78b6825bc3d112df4781700528c';
                        }
                    }
                }
                //搜索
                else if (that.CUR_BLOCK == 'SEARCH') {
                    if (that.SEARCH_PROCESS == 'SEARCH') {
                        if (e && e.keyCode == 27) { // 按 Esc/返回
                            $("#tv_keyboard_div").css("bottom", "-384px");
                            that.CUR_BLOCK = 'MENU';
                            $("#search_" + that.MENU_INDEX).focus();
                        }
                    } else if (that.SEARCH_PROCESS == 'SEARCHLIST') {
                        if (e.target.id != 'enterKey') {
                            Lib.listListener({
                                e: e,
                                listName: 'search',
                                num: 5,
                                height: 400,
                                type: 'button',
                                enter: function (lib) {
                                    var obj = $('#searchList button')[lib.SEARCH_INDEX];
                                    if (obj) {
                                        Lib.MAP.panTo(new qq.maps.LatLng($(obj).attr('data-lat'), $(obj).attr('data-lng')));
                                        Lib.mapFocus();
                                        that.hideMenu();
                                        $("#resultContainer").css("top", "720px");
                                        Lib.MAP.setOptions({keyboardShortcuts: true});
                                        $('#hintContainer').attr('class', 'searchMap').show();
                                        that.SEARCH_PROCESS = 'SEARCHMAP';
                                    } else {
                                        $("#resultContainer").css("top", "720px");
                                        Lib.SEARCH_INDEX = 0;
                                        that.CUR_BLOCK = 'MENU';
                                        that.SEARCH_PROCESS = 'SEARCH';
                                        $("#search_" + that.MENU_INDEX).focus();
                                    }
                                },
                                up: 'default',
                                down: 'default',
                                esc: function () {
                                    $("#resultContainer").css("top", "720px");
                                    Lib.SEARCH_INDEX = 0;
                                    that.CUR_BLOCK = 'MENU';
                                    that.SEARCH_PROCESS = 'SEARCH';
                                    $("#search_" + that.MENU_INDEX).focus();
                                    that.KEYBOARD.clear();
                                }
                            });
                            return false;
                        }
                    } else if (that.SEARCH_PROCESS == 'SEARCHMAP') {
                        if (e && e.keyCode == 13) {//enter 键
                            var result = that.showPano();
                            if (result) {
                                $('#_panoSwf_0').focus();
                                $('#hintContainer').attr('class', 'searchPano').show();
                                that.SEARCH_PROCESS = 'SEARCHPANO';
                            }
                        } else if (e && e.keyCode == 27) { // 按 Esc/返回
                            that.showMenu();
                            $("#resultContainer").css("top", "148px");
                            setTimeout(function () {
                                $("#search_0").trigger("click");
                                $($('#searchList button')[Lib.SEARCH_INDEX]).attr('tabindex', -1).focus();
                            }, 2100);
                            $('#hintContainer').hide();
                            that.SEARCH_PROCESS = 'SEARCHLIST';
                        }
                        Lib.zoomListener(e);
                        return false;
                    } else if (that.SEARCH_PROCESS == 'SEARCHPANO') {
                        if (e && e.keyCode == 27) { // 按 Esc/返回
                            $('#container').show();
                            $('#panoCon').hide();
                            $('#album').hide();
                            that.PANO.changeArea(-1);
                            Lib.MAP.setOptions({keyboardShortcuts: true});
                            Lib.mapFocus();
                            $('#hintContainer').attr('class', 'searchMap').show();
                            that.SEARCH_PROCESS = 'SEARCHMAP';
                        }
                    }
                }
                //地图
                else if (that.CUR_BLOCK == 'MAP') {
                    if (e && e.keyCode == 27) { // 按 Esc/返回
                        that.showMenu();
                        $("#search_" + that.MENU_INDEX).focus().trigger('click');
                        $('#hintContainer').hide();
                        that.CUR_BLOCK = 'MENU';
                    } else if (e && e.keyCode == 13) {//enter 键
                        that.showPano();
                        var rlt = that.showPano();
                        if (rlt) {
                            $('#hintContainer').attr('class', 'searchPano').show();
                            that.CUR_BLOCK = 'PANO';
                        }
                    }
                    Lib.zoomListener(e);
                    return false;
                }
                //街景
                else if (that.CUR_BLOCK == 'PANO') {
                    if (e && e.keyCode == 27) { // 按 Esc/返回
                        $('#container').show();
                        $('#panoCon').hide();
                        $('#album').hide();
                        that.PANO.changeArea(-1);
                        Lib.MAP.setOptions({keyboardShortcuts: true});
                        Lib.mapFocus();
                        that.CUR_BLOCK = 'MAP';
                    }
                }
            },
            keyListener: function () {
                var that = this;
                document.onkeydown = function (event) {
                    var e = event || window.event || arguments.callee.caller.arguments[0];
                    that.control(e);
                };
                $(".search div").click(function () {
                    var index = parseInt($(this).attr("id").replace("search_", ""));
                    if (index == 1) {
                        var time = 1000;
                        that.CUR_BLOCK = 'SEARCH';
                        that.SEARCH_PROCESS = 'SEARCHLIST';
                        if ($("#tv_keyboard_div").css("bottom") == "0px") {
                            $("#tv_keyboard_div").css("bottom", "-384px");
                        } else {
                            time = 0;
                        }
                        setTimeout(function () {
                            $("#resultContainer").css("top", "148px");
                            $('#searchList').html('<li style="text-align: center;">搜索中，请稍候。。。</li>');
                            setTimeout(function () {
                                $($('#searchList li')[0]).attr('tabindex', -1).focus();
                            }, 2000);
                        }, time);
                        setTimeout(function () {
                            that.search();
                        }, 2500 + time);
                    } else if (index == 2) {
                        if ($("#resultContainer").css("top") == "148px") {
                            $("#resultContainer").css("top", "720px");
                            Lib.SEARCH_INDEX = 0;
                            that.SEARCH_PROCESS = 'SEARCH';
                        }
                        that.KEYBOARD.clear();
                        that.hideMenu();
                        Lib.mapFocus();
                        Lib.MAP.setOptions({keyboardShortcuts: true});
                        //$('#hintContainer').attr('class', 'searchMap').show();
                        that.CUR_BLOCK = 'MAP';
                    } else if (index == 3) {
                        window.location.href = '../community/community.html?click=true';
                    } else if (index == 4) {
                        window.location.href = '../list/list.html?id=cff4c78b6825bc3d112df4781700528c&click=true';
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
            /*搜索*/
            search: function () {
                var that = this, input = $('#search_input').val(), lat1, lng1;
                lat1 = Lib.MAP.getCenter().getLat();
                lng1 = Lib.MAP.getCenter().getLng();
                var result = that.suggestion(input, lat1, lng1);
                if (result.status == 0) {
                    var count = result.count;
                    if (count == 0) {
                        $('#searchList').html('<li style="text-align: center;">未找到相关地点</li>');
                        $($('#searchList li')[0]).attr('tabindex', -1).focus();
                    } else {
                        $('#searchList').html(that.TEMPLATE_SEARCH(result.data));
                        that.bindFocus('.search_item');
                        $($('#searchList button')[0]).focus();

                        $(".search_item").click(function () {
                            var obj = $(this);
                            Lib.SEARCH_INDEX = $(this).attr("data-index");
                            $($('#searchList button')[Lib.SEARCH_INDEX]).attr('tabindex', -1).focus();
                            Lib.MAP.panTo(new qq.maps.LatLng($(obj).attr('data-lat'), $(obj).attr('data-lng')));
                            Lib.mapFocus();
                            that.hideMenu();
                            $("#resultContainer").css("top", "720px");
                            Lib.MAP.setOptions({keyboardShortcuts: true});
                            //  $('#hintContainer').attr('class', 'searchMap').show();
                            that.SEARCH_PROCESS = 'SEARCHMAP';
                        });
                    }

                    new IScroll('#resultContainer', {mouseWheel: true, click: true});
                } else {
                    $('#searchList').html('<li style="text-align: center;">未找到相关地点</li>');
                    $($('#searchList li')[0]).attr('tabindex', -1).focus();
                }
            },
            /*绑定焦点事件*/
            bindFocus: function (name) {
                $(name).focus(function () {
                    $(this).addClass('cur');
                }).blur(function () {
                    $(this).removeClass('cur');
                });
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
                var that = this, city = '';
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
                return that.getSuggestionByCity(keyword, city);
            },
            keyboard: function (col, row, inputObj) {
                this.str = "";
                col ? this.col = col : this.col = 0;
                row ? this.row = row : this.row = 0;
                inputObj ? this.inputObj = inputObj : null;
            },
            keyboardInit: function () {
                var that = this;
                that.keyboard.prototype = {
                    init: function () {
                        this.changeItem();
                        this.keyListener();
                    },
                    changeItem: function () {
                        if (document.all)
                            var it = document.getElementById("tv_keyboard").children[0];
                        else
                            var it = document.getElementById("tv_keyboard");
                        for (i = 0; i < it.rows.length; i++) {
                            it.rows[i].className = "";
                        }
                        if (this.row < 0) {
                            $("#search_" + that.MENU_INDEX).focus();
                            that.CUR_BLOCK = "MENU";
                            this.row = 0;
                            return;
                        }
                        if (this.row == it.rows.length) {
                            this.row = it.rows.length - 1;
                        }

                        var objtab = document.all.tv_keyboard;
                        var objrow = objtab.rows[this.row].getElementsByTagName("a");

                        if (this.col < 0) {
                            this.col = objrow.length - 1;
                        }
                        if (this.col == objrow.length) {
                            this.col = 0;
                        }
                        this.f = objrow[this.col];
                        this.f.focus();
                    },
                    keyListener: function () {
                        var t = this;
                        document.getElementById("tv_keyboard").onkeydown = function (e) {
                            e = window.event || e;
                            switch (e.keyCode) {
                                case 37: //左键
                                    t.col--;
                                    break;
                                case 38: //向上键
                                    t.row--;
                                    break;
                                case 39: //右键
                                    t.col++;
                                    break;
                                case 40: //向下键
                                    t.row++;
                                    break;
                                case 13:
                                    var str = t.f.innerHTML;
                                    if (str == "删除") {
                                        t.backspace();
                                    } else if (str == "搜索") {
                                        $("#tv_keyboard_div").css("bottom", "-384px");
                                        setTimeout(function () {
                                            that.CUR_BLOCK = 'SEARCH';
                                            that.SEARCH_PROCESS = 'SEARCHLIST';
                                            $("#resultContainer").css("top", "148px");
                                            $('#searchList').html('<li style="text-align: center;">搜索中，请稍候。。。</li>');
                                            setTimeout(function () {
                                                $($('#searchList li')[0]).attr('tabindex', -1).focus();
                                            }, 2100);
                                        }, 1000);
                                        setTimeout(function () {
                                            that.search();
                                        }, 3500);
                                    } else {
                                        t.str = t.str + str;
                                        if (t.inputObj) {
                                            t.inputObj.val(t.str);
                                        }
                                    }
                                    return false;
                                default:
                                    break;
                            }
                            t.changeItem();
                        };
                    },
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
                that.KEYBOARD = new that.keyboard(0, 0, $('#search_input'));
                that.KEYBOARD.init();
            }

        }
    })();

    view.init();

})();