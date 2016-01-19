!function (window, document) {
    var init = function () {
        Lib.mapInit(this);
        $('#hintContainer').attr('class', 'searchMap').show();
        keyListener.container();
        keyListener.keyborad();
        window.onload = function () {
            Lib.mapFocus();
        };
        controlStatus.status = true;

        if (Lib.getQueryString("click")) {
            $("#exit").show();
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


    var keyListener = {
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
                    controlStatus.control(function () {
                        menus_effect(true);
                        keyListener.menus();
                    }, 500)
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
                    controlStatus.control(function () {
                        menus_effect(false);
                        Lib.mapFocus();
                    }, 500)
                },
                up: function () {

                },
                down: function () {

                },
                left: function () {
                    controlStatus.control(function () {
                        menus_effect(false);
                        Pano.showPano();
                    }, 100)
                },
                right: function () {
                    controlStatus.control(function () {
                        window.location.href = '../list/list.html?id=cff4c78b6825bc3d112df4781700528c&click=true';
                    }, 500)
                },
                click: function (item) {
                    return false;
                },
                esc: function () {
                    exit();
                    return false;
                },
                back: function () {
                    controlStatus.control(function () {
                        menus_effect(false);
                        Lib.mapFocus();
                    }, 500);
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
                    controlStatus.control(function () {
                        $('#container').show();
                        $('#panoCon').hide();
                        $('#album').hide();
                        $('#hintContainer').attr('class', 'searchMap');
                        Pano.PANO.changeArea(-1);
                        Lib.mapFocus();
                    }, 100);
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
                        $("#tv_keyboard_div").css("bottom", "-384px");
                        setTimeout(function () {
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
                        keyboard.str = keyboard.str + str;
                        if (keyboard.inputObj) {
                            keyboard.inputObj.val(keyboard.str);
                        }
                    }
                },
                click: function (item) {
                    return false;
                },
                esc: function () {
                    console.log("esc");
                    return false;
                },
                back: function () {
                    console.log("back");
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
    }


    var menus_effect = function (flag) {
        var time = 500;
        if (flag) {
            $("#menus").attr("tabindex", "-1").focus().trigger("click").animate({
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

}(window, document);