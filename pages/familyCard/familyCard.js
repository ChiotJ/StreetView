/**
 * Created by jian_ on 2016/4/26.
 */
!function (window, document) {
    var INF_URL = "http://172.16.188.26/family/";

    var showFamilyCard = function () {
        $.ajax({
            url: INF_URL + "lottery/getFamilyCards?deviceNo=" + GHSMLib.cardId,
            type: "GET",
            success: function (data) {
                if (data.success) {
                    var result = data.result;
                    if (result.length === 3) {
                        for (var i in result) {
                            var obj = result[i];
                            $("#" + obj.id + "-num").html("×" + obj.count);
                        }
                        $("#fc-list").css("opacity", "1");
                    } else {
                        console.error("获取亲情卡数量失败");
                    }

                } else {
                    console.error("获取亲情卡数量失败");
                }
            }
        });

        $.ajax({
            url: INF_URL + "lottery/getFamilyTimes?deviceNo=" + GHSMLib.cardId,
            type: "GET",
            success: function (data) {
                if (data.success) {
                    $("#lotteryTimes").html(data.result);
                    $(".lotteryTimes").css("opacity", "1");
                } else {
                    console.error("获取抽奖次数失败");
                }
            }
        });
    };


    var radix = 0, timestamp = "", cardId = "", FCList = [];
    var getFamilyCard = function () {
        var lookedScene = parseInt(window.sessionStorage.getItem("lookedScene" + GHSMLib.cardId));
        //console.log("lookedScene:" + lookedScene + " === timestamp:" + timestamp);
        if (lookedScene && lookedScene > 2) {
            var ran = parseInt(Math.random() * 10);
            //console.log("ran:" + ran + " === isGeting:" + familyCard.isGeting + " === radix:" + radix);
            if (ran < radix && !familyCard.isGeting) {
                clearInterval(familyCard.getInterval);
                if (timestamp) {
                    showGetFamilyCard();
                    familyCard.hideTimeout = setTimeout(function () {
                        hideGetFamilyCard();
                    }, 15000);
                } else {
                    $.ajax({
                        url: INF_URL + "lottery/generateGettingCard?deviceNo=" + GHSMLib.cardId,
                        type: "GET",
                        async: false,
                        success: function (data) {
                            if (data.success) {
                                //console.log(data);
                                var result = data.result;
                                timestamp = result.timestamp;
                                cardId = result.familyCard.id;
                                FCList = result.fclist;
                                showGetFamilyCard(cardId);
                                familyCard.hideTimeout = setTimeout(function () {
                                    hideGetFamilyCard();
                                }, 15000);
                            } else {
                                hideGetFamilyCard();
                            }
                        },
                        error: function () {
                            hideGetFamilyCard();
                        }
                    });
                }

            } else {
                if (radix < 5) {
                    radix++;
                }
            }
        }
    };

    var showGetFamilyCard = function (id) {
        radix = 0;
        familyCard.isGeting = true;
        var ranTop = parseInt(Math.random() * 250);
        if (ranTop < 60) {
            ranTop = 60;
        }

        var ranLeft = 0;
        if (ranTop < 200) {
            ranLeft = parseInt(Math.random() * 710);
        } else {
            ranLeft = parseInt(Math.random() * 1020);
        }

        if (ranLeft < 60) {
            ranLeft = 60;
        }

        $("#getFamilyCard").css("left", ranLeft).css("top", ranTop);
        if (id) {
            $($("#getFamilyCard").find("img")[0]).attr("src", "../familyCard/images-FC/" + id + "@3x.png");
        }
        setTimeout(function () {
            $("#getFamilyCard").css("opacity", "1");
        }, 1000);

    };

    var hideGetFamilyCard = function () {
        familyCard.isGeting = false;
        familyCard.getInterval = getIntervalFun();
        $("#getFamilyCard").css("opacity", "0");
    };

    var getIntervalFun = function () {
        return setInterval(function () {
            getFamilyCard();
        }, 4000);
    };

    var getQRCode = function (index) {
        $.ajax({
            type: "GET",
            url: INF_URL + "stb/deviceNoEscape?deviceNo=" + GHSMLib.cardId,
            success: function (data) {
                if (data && data.success) {
                    var escapeDeviceNo = data.result.encryStr;
                    var downloadurl = "http://t.cn/RG8jxjR";
                    var qrurl = "http://172.16.188.13/api/common/Image/qrCode.png?text="
                        + downloadurl + "?stbid=" + escapeDeviceNo + "%26isOpen=false&size=150";

                    if (index) {
                        $("#familyCardQRCode").attr("src", qrurl);
                    } else {
                        $($("#finishGetFamilyCard").find("img")[1]).attr("src", qrurl);
                    }

                }
            }, error: function (err) {
                console.error(err);
            }
        });
    };

    var getFamilyUsers = function () {
        var result = 0;
        $.ajax({
            type: "GET",
            async: false,
            url: INF_URL + "user/tv/listStbUser?deviceNo=" + GHSMLib.cardId,
            success: function (data) {
                if (data) {
                    result = data.result.length;
                } else {
                    result = 0;
                }
            }, error: function (err) {
                result = 0;
            }
        });
        return result;
    };


    window.familyCard = {
        isGeting: false,
        isFailed: false,
        getInterval: null,
        hideTimeout: null,
        init: function (option) {
            var self = this;
            if (option) {
                if (option.show) {
                    showFamilyCard();

                    var sock = new SockJS(INF_URL + "tvapi?token=" + GHSMLib.cardId);
                    var client = Stomp.over(sock);

                    client.debug = function (msg) {
                        //console.debug(msg)
                    };

                    client.connect({}, function () {
                        client.subscribe('/user/topic/receive', function (data) {
                            data = eval("[" + data.body + "]")[0];
                            if (data && data.subject == "activity") {
                                if (data.cmdType == "reduceTimes") {
                                    showFamilyCard();
                                } else if (data.cmdType == "firstBind") {
                                    if (self.isFailed) {
                                        getFamilyCard();
                                    }
                                }
                            }

                        });

                    });


                    $(document).unload(function () {

                        client.disconnect(function () {

                            sock.close();
                        });
                    });
                }
                if (option.getFamilyCard) {
                    getQRCode();
                    this.getInterval = getIntervalFun();
                }

                if (option.getQR) {
                    GHSMLib.keyCon.keyListener({
                        id: "familyCardLogo",
                        enter: function (item) {
                            window.location.href = "http://172.16.188.26/web/family/pages/familyCard/index.html";
                            return false;
                        },
                        right: function (item) {
                            $("#menu").find("li")[GHSMLib.keyCon.index["menu"]].focus();
                        },
                        esc: function () {
                            if (typeof CyberCloud != "undefined") {
                                CyberCloud.ExitApp();
                            }
                            return false;
                        },
                        back: function () {
                            GHSMLib.backYunPage("http://172.16.188.26/web/flytvYun/pages/index/index.html");

                            return false;
                        }
                    });
                    getQRCode(true);
                }
            }
        },
        getFamilyCard: function () {
            clearTimeout(this.hideTimeout);
            $("#getFamilyCard").css("opacity", "0");
            var canGet = getFamilyUsers();

            var self = this, $finishGetFamilyCard = $("#finishGetFamilyCard"), failedFun = function () {
                self.isFailed = true;
                $($finishGetFamilyCard.find("img")[0]).attr("src", "../familyCard/images-FC/failedGetCard.png");
                $($finishGetFamilyCard.find("img")[1]).css("top", "130px").css("left", "500px").show();

                setTimeout(function () {
                    $finishGetFamilyCard.css("opacity", "1");
                }, 500);
            };
            if (canGet > 0) {
                $.ajax({
                    type: "GET",
                    async: false,
                    url: INF_URL + "lottery/saveGettingCard?deviceNo=" + GHSMLib.cardId + "&timestamp=" + timestamp,
                    success: function (data) {
                        if (data && data.success) {
                            var isAddTimes = 0;
                            var count = parseInt($("#" + cardId + '-num').html().replace("×", "")) + 1;
                            $("#" + cardId + '-num').html("×" + count);
                            for (var i in FCList) {
                                var obj = FCList[i];
                                if (obj.id !== cardId && count - obj.count == 0) {
                                    isAddTimes++;
                                }
                            }
                            if (isAddTimes == 2) {
                                $($finishGetFamilyCard.find("img")[0]).attr("src", "../familyCard/images-FC/getLotteryTimes.png");
                                $($finishGetFamilyCard.find("img")[1]).hide();
                                $("#lotteryTimes").html(parseInt($("#lotteryTimes").html()) + 1);
                            } else {
                                $($finishGetFamilyCard.find("img")[0]).attr("src", "../familyCard/images-FC/getFamilyCard.png");
                                $($finishGetFamilyCard.find("img")[1]).hide();
                            }
                            self.isFailed = false;

                            setTimeout(function () {
                                $finishGetFamilyCard.css("opacity", "1");
                            }, 500);
                        } else {
                            failedFun();
                        }
                    }, error: function (err) {
                        failedFun();
                    }
                });
            } else {
                failedFun();
            }
        },
        failedGet: function () {
            familyCard.isGeting = false;
            self.isFailed = false;
            familyCard.getInterval = getIntervalFun();
            $("#finishGetFamilyCard").css("opacity", "0");
        },
        finishGet: function () {
            cardId = "";
            timestamp = "";
            familyCard.isGeting = false;
            familyCard.getInterval = getIntervalFun();
            $("#finishGetFamilyCard").css("opacity", "0");
            window.sessionStorage.setItem("lookedScene" + GHSMLib.cardId, 0);
        }
    }
}(window, document);