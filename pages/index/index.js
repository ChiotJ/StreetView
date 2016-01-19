!function (window, document) {
    var cloud = function () {
        this.size = 0;
    };
    cloud.prototype = {
        create: function (l, t, s) {
            var id = "cloud" + this.size;
            var c = document.createElement("div");
            c.setAttribute("id", id);
            $(c).addClass("cloud");
            $("#cloud").append($(c));
            $(c).css("left", l + "px").css("top", t + "px").css("transition", "all " + s + "s linear");


            setTimeout(function () {
                $(c).css("left", (l + 100) + "px");
            }, 500);
            setTimeout(function () {
                $(c).css("left", (l) + "px");
            }, 1000 * s);

            setInterval(function () {
                $(c).css("left", (l + 100) + "px");
                setTimeout(function () {
                    $(c).css("left", l + "px");
                }, 1000 * s);
            }, 2000 * s);

            this.size++;
        }
    };

    var c = new cloud();
    c.create(900, 80, 10);
    c.create(80, 120, 12);
    c.create(1000, 180, 15);


    var menuDot = doT.template($('#menuDot').text());


    var Menu = function () {
        this.menuList = null;
        this.size = 0;
        this.lineNum = 0;
    };
    Menu.prototype = {
        init: function () {
            this.getMenuList();
        },
        getMenuList: function () {
            var self = this;
            $.ajax({
                url: "../../data/json/list.json",
                type: "GET",
                async: false,
                success: function (data) {
                    var json = data;
                    if (json.status == 1) {
                        self.menuList = json.list;
                        self.size = self.menuList.length;
                        if (self.size % 2 == 0) {
                            self.lineNum = self.size / 2;
                        } else {
                            self.lineNum = (self.size + 1) / 2;
                        }
                        var $menu = $("#menu");
                        $menu.css("width", self.lineNum * 210 + "px").css("left", (1280 - self.lineNum * 210) / 2 + "px").html(menuDot(self.menuList));
                        self.menuKeyListener();
                        var f = GHSMLib.utils.getQueryString("id");
                        if (f) {
                            $($("#" + f)[0]).focus();
                        } else {
                            $($menu.find("li")[0]).focus();
                        }

                    }
                }
            });
        },
        menuKeyListener: function () {
            var self = this;
            GHSMLib.keyCon.listKeyListener({
                id: "menu",
                columnNum: self.lineNum,
                label: "li",
                focus: function (item) {
                    var idx = $(item).index();
                    var m = self.menuList[idx];
                    $(item).find(".buttonName").css("color", m.color).css("border-bottom", "7px solid " + m.color);
                },
                left: {
                    before: function (item) {
                        var idx = $(item).index();
                        if (idx == 0) {
                            $($("#menu").find("li")[self.size - 1]).focus();
                        }
                    }
                },
                right: {
                    before: function (item) {
                        var idx = $(item).index();
                        if (idx == self.size - 1) {
                            $($("#menu").find("li")[0]).focus();
                        }
                    }
                },
                blur: function (item) {
                    $(item).find(".buttonName").removeAttr("style");
                },
                enter: function (item) {
                    var idx = $(item).index();
                    var m = self.menuList[idx];
                    var type = m.type;
                    var dataId = m.id;
                    if (type == 1) {
                        if (dataId == "d7b6338e720fe92bbd31e1ae52e56a5e") {
                            window.location.href = "../search/search.html";
                        }
                    } else if (type == 2) {
                        window.location.href = "../list/list.html?id=" + dataId;
                    }
                },
                click: function (item) {
                    var idx = $(item).index();
                    var m = self.menuList[idx];
                    var type = m.type;
                    var dataId = m.id;
                    if (type == 1) {
                        if (dataId == "d7b6338e720fe92bbd31e1ae52e56a5e") {
                            window.location.href = "../search/search.html?click=true";
                        }
                    } else if (type == 2) {
                        window.location.href = "../list/list.html?id=" + dataId + "&click=true";
                    }
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
    var menu = new Menu();
    menu.init();
}(window, document);