require(['api_mkt', 'mkt_info','decimal', 'mkt_trade', 'cookie'], function(api_mkt, mkt_info,decimal, mkt_trade) {
    
    function isIE() {
        if (window.navigator.userAgent.indexOf("MSIE") >= 1) {
            return true;
        } else {
            return false;
        }
    }
    if (isIE()) {
        window.location.href="./low.html";
        showWarnWin("如您是IE10及以下版本，请换到IE11或其它浏览器浏览本网站。", 100000);
    } else {
        
    }

    //mkt_info.get();
    mkt_trade.get();
    // showWarnWin("互联网万维联盟", 1e3);
    var exchangeToken = $.cookie('exchangeToken');
    var global_loginuserphone = $.cookie("global_loginuserphone");
    var global_loginusername = $.cookie("global_loginusername");
    var global_loginuseruid = $.cookie("global_loginuseruid");
    var totalAssets = $.cookie("totalAssets");
    var totalNuts = $.cookie("totalNuts");
    var mine_one = $.cookie("mine_one");
    var mine_two = $.cookie("mine_two");
    var mine_three = $.cookie("mine_three");
    var mine_four = $.cookie("mine_four");
    /**
     * 禁止输入框粘贴
     */
    $("input").on("paste", function(e) {
        return false;
    });

    var getTotalAssets = function() {
        api_mkt.totalAssets(function(data) {
            if (data.status == 200) {
                // var totalAssets = data.data.cnyBalance + data.data.cnyLock;
                // var totalNuts = data.data.gopBalance + data.data.gopLock;
                //console.log($('#thelatestprice').html());
                // var totalvalue = totalNuts * $('#thelatestprice').html() + totalAssets;

                var totalAssets = decimal.getTwoPs(decimal.floatAdd(data.data.cnyBalance , data.data.cnyLock));
                var totalNuts = decimal.getTwoPs(decimal.floatAdd(data.data.gopBalance , data.data.gopLock));
                var totalvalue = decimal.getTwoPs(decimal.floatAdd(decimal.floatMulti(totalNuts,$('#thelatestprice').html()),totalAssets));

                $('.lf_asset_center').html(decimal.getTwoPs(totalvalue)); //总资产
                $('.rg_asset_center').html(decimal.getTwoPs(totalNuts)); //总果仁
            } else {
                console.log(data.msg);
            }
        });
    }

    getTotalAssets();
    setInterval(getTotalAssets, 60000);


    var synchronous = function() {
        console.log("synchronous_index");
        $("#mybox").html("");
        api_mkt.unReadMessage({}, function(data) {
            if (data.status == 200) {
                if (data.data) {
                    var dlist = data.data.list;
                    var unReadNum = data.data.unReadNum;
                    $("#msg_num_top,#newinfor_result").html(unReadNum);
                    var dlisthtml = "";
                    if (dlist.length == 1) {
                        dlisthtml += "<div class='message_flow'><p class='message_content_p'>" + dlist[0].content + "</p><p class='message_date_p'>" + dlist[0].createDate + "</p></div>";
                        dlisthtml += "<a href='ssmessage.html' onClick='lookall()'>查看全部</a>";
                    }
                    if (dlist.length == 2) {
                        dlisthtml += "<div class='message_flow'><p class='message_content_p'>" + dlist[0].content + "</p><p class='message_date_p'>" + dlist[0].createDate + "</p></div>";
                        dlisthtml += "<div class='message_flow second_message_flow'><p class='message_content_p'>" + dlist[1].content + "</p><p class='message_date_p'>" + dlist[1].createDate + "</p></div>";
                        dlisthtml += "<a href='ssmessage.html' onClick='lookall()'>查看全部</a>";
                    }
                    $(dlisthtml).appendTo("#mybox");
                }
            } else {
                console.log(data);
            }
        });
    }
    if (!exchangeToken) { //没有token 即未登录
        $(".login_regist").show(); //显示登录注册按钮
        $('.loginarea').show(); //显示页面中的登录区块（非弹出）
    } else { //已经登录
        $(".login_regist").hide(); //隐藏登录注册按钮
        $(".login_header").show(); //顶部右上角的轮询信息
        $(".loginarea").hide(); //隐藏页面中的登录区块
        $(".afterlogin").show(); //首页的总资产区块显示

        api_mkt.realAuth({}, function(data) {
            if (data.status == 200) {
                whether_auth = true; //已经实名认证
                if (global_loginusername && global_loginusername != "") {
                    $("#whether_auth").html(global_loginusername);
                    $(".bottom_em_i")[0].style.background = "url(./images/index_already_authentication.png)";
                    // console.log("已认证");
                    $("#goone").on("click", function() {
                        $.cookie("loginfromwhichpage", "three");
                        location.href = "./cnydepositswithdrawal.html";
                    });
                    $("#gotwo").on("click", function() {
                        $.cookie("loginfromwhichpage", "three");
                        location.href = "./cnydepositswithdrawal.html?formindex='index'";
                    });
                } else {
                    $("#whether_auth").html("未认证");
                    $(".bottom_em_i")[0].style.background = "url(./images/index_no_auth.png)";
                    // console.log("未认证");
                    $("#goone").on("click", function() {
                        $.cookie("loginfromwhichpage", "three");
                        location.href = "./conditionofassets.html";
                    });
                    $("#gotwo").on("click", function() {
                        $.cookie("loginfromwhichpage", "three");
                        location.href = "./conditionofassets.html";
                    });
                }

            } else if (data.status == 305) {} else if (data.status == 400) {
                whether_auth = false;
                $("#whether_auth").html("未认证");
                // console.log("未认证");
                $(".bottom_em_i")[0].style.background = "url(./images/index_no_auth.png)";
                $("#goone").on("click", function() {
                    $.cookie("loginfromwhichpage", "three");
                    location.href = "./conditionofassets.html";
                });
                $("#gotwo").on("click", function() {
                    $.cookie("loginfromwhichpage", "three");
                    location.href = "./conditionofassets.html";
                });

            } else {}
        });

        $(".top_em").html(global_loginuserphone.substr(0, 3) + '****' + global_loginuserphone.substr(7, 4));
        // console.log("------index-------"+global_loginuserphone);
        // console.log("------index-------"+global_loginusername);
        // console.log("------index-------"+global_loginuseruid);

        //$(".lf_asset_center").html(totalAssets.toFixed(2));  //总资产
        //$(".rg_asset_center").html(totalNuts.toFixed(2));    //总果仁

        api_mkt.realAuth({}, function(data) {
            if (data.status == 200) {
                if (data.data.list.name != "") {
                    $("#logined_username").html(data.data.list.name);
                } else {
                    console.log("supin")
                    $("#logined_username").html(global_loginuserphone.substr(0, 3) + '****' + global_loginuserphone.substr(7, 4));
                }
            } else if (data.status == 305) {} else if (data.status == 400) {
                $("#logined_username").html(global_loginuserphone.substr(0, 3) + '****' + global_loginuserphone.substr(7, 4));
            } else {

            }
        });

        /*if(global_loginusername!=""&&global_loginusername){
            $("#logined_username").html(global_loginusername);
        } else {
            $("#logined_username").html(global_loginuserphone.substr(0,3)+'****'+global_loginuserphone.substr(7,4));
        }*/
        $("#uidval").html(global_loginuseruid);
        if (global_loginusername) {
            $("#whether_auth").html(global_loginusername);
            $(".bottom_em_i")[0].style.background = "url(./images/index_already_authentication.png)";
        } else {
            $("#whether_auth").html("未认证");
            $(".bottom_em_i")[0].style.background = "url(./images/index_no_auth.png)";
        }
        $(".popDiv").hide();
        $(".bg").hide();
        //synchronous();
        //setInterval(synchronous, 60000);
    }
    $(".bg").width($(document).width());
    $('.bg').height($(document).height());
    $('.bg').css('left', 0);
    $('.bg').css('top', 0);
    // var swiper = new Swiper('.swiper-container', {
    //     pagination: '.swiper-pagination',
    //     paginationClickable: true
    // });
    var ohlc = [];
    var volume = [];
    var groupingUnits = [
        [
            '周', [1]
        ],
        [
            '月', [1, 2, 3, 4, 6]
        ]
    ];
    var on_page_load = false;
    var onem;
    var fivem;
    var fifteenm;
    var thirtym;
    var sixtym;
    var oned;
    var klineapply = function(data) {
        onem = JSON.parse(data['1m']);
        fivem = JSON.parse(data['5m']);
        fifteenm = JSON.parse(data['15m']);
        thirtym = JSON.parse(data['30m']);
        sixtym = JSON.parse(data['60m']);
        if (data['1d']) {
            oned = JSON.parse(data['1d']);
        }
        //oned = JSON.parse(data['1d']);

        if (!on_page_load) {
            $(".fivteenminute").click();
            on_page_load = true;
        }
    }
    var highcharts_Rendering = function(whichday, groupingUnits) {
        Highcharts.theme = {
            // colors: ["#ee6259", "#bee8d0", "#ED561B", "#DDDF00", "#24CBE5", "#64E572", "#FF9655", "#FFF263", "#6AF9C4"],
            chart: { borderColor: "#DDD", plotShadow: !0, plotBorderWidth: 1 },
            title: { style: { color: "#000", font: 'bold 16px "Trebuchet MS", Verdana, sans-serif' } },
            subtitle: { style: { color: "#666666", font: 'bold 12px "Trebuchet MS", Verdana, sans-serif' } },
            legend: { itemStyle: { font: "9pt Trebuchet MS, Verdana, sans-serif", color: "black" }, itemHoverStyle: { color: "#039" }, itemHiddenStyle: { color: "gray" } },
            labels: { style: { color: "#99b" } },
            navigation: { buttonOptions: { theme: { stroke: "#CCCCCC" } } }
        };
        //图表设置
        //Highcharts.setOptions({ global: { useUTC: false } });
        //<li class="alt"><span><span class="tag"><</span><span class="tag-name">script</span><span>&nbsp;</span><span class="attribute">type</span><span>=</span><span class="attribute-value">"text/javascript"</span><span class="tag">></span><span>&nbsp;&nbsp;</span></span></li><li class=""><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Highcharts.setOptions({&nbsp;global:&nbsp;{&nbsp;useUTC:&nbsp;false&nbsp;}&nbsp;});&nbsp;&nbsp;&nbsp;</span></li><li class="alt"><span>&nbsp;<span class="tag"></</span><span class="tag-name">script</span><span class="tag">></span><span>&nbsp;&nbsp;</span></span></li>
        Highcharts.setOptions({
            global: { useUTC: false },
            //colors: ['#DD1111', '#FF0000', '#DDDF0D', '#7798BF', '#55BF3B', '#DF5353', '#aaeeee', '#ff0066', '#eeaaee', '#55BF3B', '#DF5353', '#7798BF', '#aaeeee'],
            lang: {
                loading: 'Loading...',
                months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
                shortMonths: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
                weekdays: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
                decimalPoint: '.',
                numericSymbols: ['k', 'M', 'G', 'T', 'P', 'E'],
                resetZoom: 'Reset zoom',
                resetZoomTitle: 'Reset zoom level 1:1',
                lang: {
                    decimalPoint: '\u066B',
                    thousandsSeparator: '\u066C'
                },
                thousandsSep: ','
            },

            credits: { enabled: false }
        });

        if(whichday=="one"){
            Highcharts.setOptions({
                rangeSelector: { buttons: [{ type: 'minute', count: 60, text: '1h' }, { type: 'minute', count: 120, text: '2h' }, { type: 'minute', count: 360, text: '6h' }, { type: 'minute', count: 720, text: '12h' }, { type: 'day', count: 1, text: '1d' }, { type: 'week', count: 1, text: '1w' }, { type: 'all', text: '所有' }], selected: 2, inputEnabled: false },
            });

        } else if(whichday=="five"){
            Highcharts.setOptions({
                rangeSelector: { buttons: [{ type: 'minute', count: 60, text: '1h' }, { type: 'minute', count: 120, text: '2h' }, { type: 'minute', count: 360, text: '6h' }, { type: 'minute', count: 720, text: '12h' }, { type: 'day', count: 1, text: '1d' }, { type: 'week', count: 1, text: '1w' }, { type: 'all', text: '所有' }], selected: 2, inputEnabled: false },
            });
        } else if(whichday=="fivteen"){
            Highcharts.setOptions({
                rangeSelector: { buttons: [{ type: 'minute', count: 60, text: '1h' }, { type: 'minute', count: 120, text: '2h' }, { type: 'minute', count: 360, text: '6h' }, { type: 'minute', count: 720, text: '12h' }, { type: 'day', count: 1, text: '1d' }, { type: 'week', count: 1, text: '1w' }, { type: 'all', text: '所有' }], selected: 2, inputEnabled: false },
            });
        } else if(whichday=="thirty"){
           Highcharts.setOptions({
                rangeSelector: { buttons: [{ type: 'minute', count: 60, text: '1h' }, { type: 'minute', count: 120, text: '2h' }, { type: 'minute', count: 360, text: '6h' }, { type: 'minute', count: 720, text: '12h' }, { type: 'day', count: 1, text: '1d' }, { type: 'week', count: 1, text: '1w' }, { type: 'all', text: '所有' }], selected: 2, inputEnabled: false },
            }); 
        } else if(whichday=="sixty"){
            Highcharts.setOptions({
                rangeSelector: { buttons: [{ type: 'minute', count: 60, text: '1h' }, { type: 'minute', count: 120, text: '2h' }, { type: 'minute', count: 360, text: '6h' }, { type: 'minute', count: 720, text: '12h' }, { type: 'day', count: 1, text: '1d' }, { type: 'week', count: 1, text: '1w' }, { type: 'all', text: '所有' }], selected: 2, inputEnabled: false },
            });
        } else if (whichday == "oneday") {
            Highcharts.setOptions({
                rangeSelector: { buttons: [{ type: 'minute', count: 60, text: '1h' }, { type: 'minute', count: 120, text: '2h' }, { type: 'minute', count: 360, text: '6h' }, { type: 'minute', count: 720, text: '12h' }, { type: 'day', count: 1, text: '1d' }, { type: 'week', count: 1, text: '1w' }, { type: 'all', text: '所有' }], selected: 'all', inputEnabled: false },
            });
        };
        ohlc = [];
        volume = [];
        if (whichday == "one") {
            for (var i = 0; i < onem.length; i++){
                ohlc.push([onem[i][0], onem[i][2], onem[i][3], onem[i][4], onem[i][5]]);
                volume.push([onem[i][0], onem[i][1]]);
                if (i < onem.length - 1) {
                    var j=onem[i][0]+60000;
                    while (j < onem[i + 1][0]) {
                        ohlc.push([j, 0, 0, 0, 0]);
                        volume.push([j, 0]);
                        j+=60000;
                    }
                }
            }
        } else if (whichday == "five") {
            for (var i = 0; i < fivem.length; i++) {
                ohlc.push([fivem[i][0], fivem[i][2], fivem[i][3], fivem[i][4], fivem[i][5]]);
                volume.push([fivem[i][0], fivem[i][1]]);
                if (i < fivem.length - 1) {
                    var j=fivem[i][0]+5*60000;
                    while (j < fivem[i + 1][0]) {
                        ohlc.push([j, 0, 0, 0, 0]);
                        volume.push([j, 0]);
                        j+=5*60000;
                    }
                }
            }
        } else if (whichday == "fivteen") {
            for (var i = 0; i < fifteenm.length; i++) {
                ohlc.push([fifteenm[i][0], fifteenm[i][2], fifteenm[i][3], fifteenm[i][4], fifteenm[i][5]]);
                volume.push([fifteenm[i][0], fifteenm[i][1]]);
                if (i < fifteenm.length - 1) {
                    var j=fifteenm[i][0]+15*60000;
                    while (j < fifteenm[i + 1][0]) {
                        ohlc.push([j, 0, 0, 0, 0]);
                        volume.push([j, 0]);
                        j+=15*60000;
                    }
                }
            }
        } else if (whichday == "thirty") {
            for (var i = 0; i < thirtym.length; i++) {
                ohlc.push([thirtym[i][0], thirtym[i][2], thirtym[i][3], thirtym[i][4], thirtym[i][5]]);
                volume.push([thirtym[i][0], thirtym[i][1]]);
                if (i < thirtym.length - 1) {
                    var j=thirtym[i][0]+30*60000;
                    while (j < thirtym[i + 1][0]) {
                        ohlc.push([j, 0, 0, 0, 0]);
                        volume.push([j, 0]);
                        j+=30*60000;
                    }
                }
            }
        } else if (whichday == "sixty") {
            for (var i = 0; i < sixtym.length; i++) {
                ohlc.push([sixtym[i][0], sixtym[i][2], sixtym[i][3], sixtym[i][4], sixtym[i][5]]);
                volume.push([sixtym[i][0], sixtym[i][1]]);
                if (i < sixtym.length - 1) {
                    var j=sixtym[i][0]+60*60000;
                    while (j < sixtym[i + 1][0]) {
                        ohlc.push([j, 0, 0, 0, 0]);
                        volume.push([j, 0]);
                        j+=60*60000;
                    }
                }
            }
        } else if (whichday == "oneday") {
            // for (var i = 1; i < 23; i++) {
            //       ohlc.push([oned[0][0]-i*60*24*60000, oned[0][2], oned[0][3], oned[0][4], oned[0][5]]);
            //     volume.push([oned[0][0]-i*60*24*60000, oned[0][1]]);
            // }
            for (var i = 0; i < oned.length; i++) {
                ohlc.push([oned[i][0], oned[i][2], oned[i][3], oned[i][4], oned[i][5]]);
                volume.push([oned[i][0], oned[i][1]]);
                if (i < oned.length - 1) {
                    var j=oned[i][0]+(60*24*60000);
                    while (j < oned[i + 1][0]) {
                        ohlc.push([j, 0, 0, 0, 0]);
                        volume.push([j, 0]);
                        j+=(60*24*60000);
                    }
                }
            }
        }
        $('#container').highcharts('StockChart', {
            // rangeSelector: { buttons: [{ type: 'minute', count: 60, text: '1h' }, { type: 'minute', count: 120, text: '2h' }, { type: 'minute', count: 360, text: '6h' }, { type: 'minute', count: 720, text: '12h' }, { type: 'day', count: 1, text: '1d' }, { type: 'week', count: 1, text: '1w' }, { type: 'all', text: '所有' }], selected: 'all', inputEnabled: false },
            global: {
                useUTC: false
            },
            credits: { enabled: false },
            colors: ['#000000', '#0000ff', '#ff00ff', '#f7a35c', '#8085e9'],
            // colors:['yellow','red'],
            title: {
                //text: '分时图',
                style: {
                    font: 'normal 14px Microsoft yahei'
                }
            },
            xAxis: {
                type: 'dataTime',
                style: {
                    font: 'normal 14px Microsoft yahei'
                },
                tickLength: 1
            },
            exporting: { enabled: false, buttons: { exportButton: { enabled: false }, printButton: { enabled: true } } },
            tooltip: { xDateFormat: '%Y-%m-%d %H:%M %A', color: '#f0f', changeDecimals: 4, borderColor: '#058dc7' },
            plotOptions: { candlestick: { color: 'green', upColor: 'red' } },
            yAxis: [
                { labels: { style: { color: '#e55600' } }, title: { text: '价格 [RMB]', style: { color: '#e55600' } }, height: 160, lineWidth: 2, gridLineDashStyle: 'Dash', showLastLabel: true }, {
                    labels: { style: { color: '#4572A7' } },
                    title: { text: '成交量 [GOP]', style: { color: '#4572A7' } },
                    top: '80%',
                    height: '18%',
                    offset: 0 /*, top: 280, height: 14*/ ,
                    lineWidth: 2,
                    gridLineDashStyle: 'Dash',
                    showLastLabel: true
                }
            ],
            tooltip: {
                formatter: function() {
                    var s = Highcharts.dateFormat('<span> %Y-%m-%d %H:%M:%S</span><br/>', this.x);
                    s += "成交数量:" + this.points[1].y;
                    s += '<br />开盘:<b>' + this.points[0].point.open + '</b><br />最高:<b>' + this.points[0].point.high + '</b><br />最低:<b>' + this.points[0].point.low + '</b><br />收盘:<b>' + this.points[0].point.close + '</b>';
                    return s;
                },
                shared: true,
                useHTML: true,
                valueDecimals: 2, //有多少位数显示在每个系列的y值
                crosshairs: [{
                    color: '#b9b9b0'
                }, {
                    color: '#b9b9b0'
                }]
            },
            scrollbar: {
                enabled: true
            },
            series: [
                { animation: true, name: '价格 [RMB]', type: 'candlestick', dataGrouping: { units: groupingUnits, enabled: false }, data: ohlc },
                { animation: true, name: '成交量 [GOP]', type: 'column', color: '#4572A7', dataGrouping: { units: groupingUnits, enabled: false }, yAxis: 1, data: volume }
            ]
        });
    }
    $(".close_btn").on("click", function() {
        $(".popDiv").hide();
        $(".bg").hide();
    });
    $(".timebar").on("click", function() {
        $(this).addClass("btn_choosed");
        $(this).siblings().removeClass("btn_choosed");
        if ($(this).hasClass("oneminute")) {
            highcharts_Rendering("one", groupingUnits);
        } else if ($(this).hasClass("fiveminute")) {
            highcharts_Rendering("five", groupingUnits);
        } else if ($(this).hasClass("fivteenminute")) {
            highcharts_Rendering("fivteen", groupingUnits);
        } else if ($(this).hasClass("thirtyminute")) {
            highcharts_Rendering("thirty", groupingUnits);
        } else if ($(this).hasClass("sixtyminute")) {
            highcharts_Rendering("sixty", groupingUnits);
        } else if ($(this).hasClass("onedayminute")) {
            highcharts_Rendering("oneday", groupingUnits);
        }
    });
    var gethomepagekline = function() {
        api_mkt.homepagekline(function(data) {
            klineapply(data);
        });
    }
    gethomepagekline();
    window.setInterval(gethomepagekline, 300000); //轮询首页的k线图

    var flag = true;
    $('.messagenum_area').on("click", function() {
        if (flag) {
            flag = false;
            $(this).css("background-color", "#ffffff");
            $(".popup_message_box").show("100");
            $(".messagenum_area em").css("color", "#333333");
            $(".msg_num").css("color", "#333333");
        } else {
            flag = true;
            $(this).css("background-color", "#282828");
            $(".popup_message_box").hide("100");
            $(".messagenum_area em").css("color", "#cccccc");
            $(".msg_num").css("color", "#cccccc");
        }
    });
    var isSubmit = function() {
        var objArr = $(".main input");
        var obj = "";
        var verEnd = "";
        for (var i = 0, l = objArr.length; i < l; i++) {
            obj = $(objArr[i]);
            if (obj.val() || i === l - 1) {
                //薪资字段为选填字段
                if (i === l - 1 && !obj.val()) {
                    return true;
                }
                verEnd = verify(obj.val(), obj.attr("id"));
                if (verEnd === true) {
                    if (i === l - 1) {
                        return true;
                    }
                } else {
                    showWarnWin(verEnd, 1000);
                    return false;
                }

            } else {
                showWarnWin("请输入" + obj.attr("placeholder"), 1000);
                return false;
            }
        }
    };


    /**
     * 输入框通用校验
     */
    $("input").on("keyup", function(e) {
        //只允许输入 ASCII的33~126的字符
        if (this.value.charCodeAt() < 33 || this.value.charCodeAt() > 126) {
            $(this).val($(this).val().replace(this.value, ""));
        }
    });

    /**
     * 手机号输入框校验
     */
    $(".phone_loginarea").on("keydown", function(e) {
        var keycode = e.which;
        if ((keycode != 8 && keycode != 9 && keycode != 16 && keycode != 20 && keycode < 48) || (keycode > 57 && keycode < 96) || keycode > 105) {
            return false;
        }
    });

    var verify = function(inputData, dataType) {
        var reg = "";
        var varMes = '';
        if (dataType === "name") {
            reg = /^[\u4E00-\u9FA5]{2,5}$/;
            varMes = "姓名请输入2~5个汉字";
        } else if (dataType === "tel") {
            reg = /^(13[0-9]|15[012356789]|17[0-9]|18[0-9]|14[57])[0-9]{8}$/;
            varMes = "请输入正确的手机号码";
        } else if (dataType === "salary") {
            reg = /^[1-9]\d{1,4}$/;
            varMes = "薪资请输入3~5位数字";
        } else if (dataType === "verCode") {
            reg = /^\d{6}$/;
            varMes = "验证码不正确";
        } else {
            reg = /^.*$/;
        }
        //如果输入数据不为空则去掉收尾空格
        if (inputData) {
            inputData = inputData.trim();
        }
        return reg.test(inputData) ? reg.test(inputData) : varMes;
    };
    String.prototype.trim = function() {
        return this.replace(/(^\s*)|(\s*$)/g, '');
    };

    $(".popuptips").hide();

    var login_area_times = 0;
    $(".indexpage_loginarea_btn").on("click", function() {

        var phone = $(".phone_loginarea").val();
        var password = $(".password_loginarea").val();
        var flag = verify(phone, "tel");
        var authcode_index = $(".authcode_index").val();
        if (flag == "请输入正确的手机号码") {
            $(".error_tips_one").show().html("请输入正确的手机号码");
            return;
        } else {
            $(".error_tips_one").hide().html("");
        }
        if (password == "") {
            $(".error_tips_index").show().html("请输入密码");
            return;
        } else if (password.length > 20 || password.length < 6) {
            $(".error_tips_index").show().html("请输入6~20位密码");
            return;
        }
        if (authcode_index == "") {
            $(".autocode_tips").show().html("请输入验证码");
            return;
        }
        if (flag == true) {
            $(".error_tips_index").hide();
            $(".autocode_tips").hide();
            api_mkt.login({
                phone: phone,
                password: password,
                code: authcode_index
            }, function(data) {
                $(".loc_img").click();
                if (data.status == 200) {
                    $.cookie("loginfromwhichpage", "");
                    // $.cookie('exchangeToken', 'logined',{"expires":"h0.5"},"guorenmarket");
                    $.cookie('exchangeToken', 'logined');
                    $(".login_regist").hide();
                    $(".login_header").show();
                    $(".popDiv").hide();
                    $(".bg").hide();

                    $("#msg_num_top").text(0);
                    global_loginuserphone = data.data.phone;
                    global_loginusername = data.data.name ? data.data.name : "";
                    global_loginuseruid = data.data.uid;
                    // $.cookie("global_loginuserphone",global_loginuserphone,{"expires":"h0.5"},"guorenmarket");
                    // $.cookie("global_loginusername",global_loginusername,{"expires":"h0.5"},"guorenmarket");
                    // $.cookie("global_loginuseruid",global_loginuseruid,{"expires":"h0.5"},"guorenmarket");
                    $.cookie("global_loginuserphone", global_loginuserphone);
                    $.cookie("global_loginusername", global_loginusername);
                    $.cookie("global_loginuseruid", global_loginuseruid);
                    synchronous();
                    setInterval(synchronous, 60000);

                    $(".top_em").html(data.data.phone.substr(0, 3) + '****' + data.data.phone.substr(7, 4));
                    $("#uidval").html(global_loginuseruid); //首页uid赋值
                    var whichpage = $.cookie("loginfromwhichpage");
                    if (whichpage == "one") {
                        location.href = "./index.html";
                    } else if (whichpage == "two") {
                        location.href = "./tradingfloor.html";
                    } else if (whichpage == "three") {
                        location.href = "./conditionofassets.html";
                    } else if (whichpage == "four") {
                        location.href = "./basicinfo.html";
                    }
                    api_mkt.totalAssets({}, function(data) {
                        if (data.status == 200) {
                            var totalAssets = data.data.cnyBalance + data.data.cnyLock;
                            var totalNuts = data.data.gopBalance + data.data.gopLock;
                            //$('#thelatestprice').html(thelatestprice); //页面顶部 最新成交价
                            var totalvalue = totalNuts * $('#thelatestprice').html() + totalAssets;
                            //$('.lf_asset_center').html(totalvalue.toFixed(2)); //总资产
                            //$('.rg_asset_center').html(totalNuts.toFixed(2)); //总果仁
                            var totalAssets = decimal.getTwoPs(decimal.floatAdd(data.data.cnyBalance , data.data.cnyLock));
                            var totalNuts = decimal.getTwoPs(decimal.floatAdd(data.data.gopBalance , data.data.gopLock));
                            var totalvalue = decimal.getTwoPs(decimal.floatAdd(decimal.floatMulti(totalNuts,$('#thelatestprice').html()),totalAssets));

                            $('.lf_asset_center').html(decimal.getTwoPs(totalvalue)); //总资产
                            $('.rg_asset_center').html(decimal.getTwoPs(totalNuts)); //总果仁

                        } else if (data.status == 305) {

                        } else if (data.status == 400) {

                        } else {

                        }
                    });
                    api_mkt.realAuth({}, function(data) {
                        if (data.status == 200) {
                            console.log("xxx")
                            if (data.data.list.name != "") {
                                $("#logined_username").html(data.data.list.name);
                            } else {
                                $("#logined_username").html(global_loginuserphone.substr(0, 3) + '****' + global_loginuserphone.substr(7, 4));
                            }
                        } else if (data.status == 305) {} else if (data.status == 400) {
                            $("#logined_username").html(global_loginuserphone.substr(0, 3) + '****' + global_loginuserphone.substr(7, 4));
                        } else {}
                    });
                    if (global_loginusername) {
                        $("#goone").on("click", function() {
                            $.cookie("loginfromwhichpage", "three");
                            location.href = "./cnydepositswithdrawal.html";
                        });
                        $("#gotwo").on("click", function() {
                            $.cookie("loginfromwhichpage", "three");
                            location.href = "./cnydepositswithdrawal.html?formindex='index'";
                        });
                        $("#whether_auth").html(global_loginusername);
                        $(".bottom_em_i")[0].style.background = "url(./images/index_already_authentication.png)";
                    } else {

                        $("#goone").on("click", function() {
                            $.cookie("loginfromwhichpage", "three");
                            location.href = "./conditionofassets.html";
                        });
                        $("#gotwo").on("click", function() {
                            $.cookie("loginfromwhichpage", "three");
                            location.href = "./conditionofassets.html";
                        });
                        // console.log("haha")
                        $("#whether_auth").html("未认证");
                        $(".bottom_em_i")[0].style.background = "url(./images/index_no_auth.png)";
                    }
                    $(".loginarea").hide();
                    $(".afterlogin").show();
                } else if (data.status == 305) {
                    showWarnWin(data.msg, 1e3)
                    login_area_times++;
                } else if (data.status == 400) {
                    if (data.msg == "登录密码错误") {
                        $(".error_tips_index").show().html("用户名或密码错误，请重新登录");
                    } else if (data.msg == "手机号未注册") {
                        $(".error_tips_one").show().html("用户名或密码错误，请重新登录");
                    } else if (data.data && data.data.num && data.data.num <= 10) {
                        if (data.data.num >= 5) {
                            if (data.data.num == 10) {
                                $(".error_tips_index").show().html("帐号已经锁定，请找回您的登录密码");
                            } else {
                                $(".error_tips_index").show().html("还有" + (10 - data.data.num) + "次输入机会");
                            }
                        } else if (data.data.num < 5 && data.data.msg == "登录密码错误") {
                            $(".error_tips_index").show().html("用户名或密码错误，请重新登录");
                        }
                    } else if (data.msg == "error" && data.data.msg == "登录密码错误") {
                        $(".error_tips").show().html("用户名或密码错误，请重新登录");
                    } else if (data.msg == "密码长度错误") {
                        $(".error_tips").show().html("用户名或密码错误，请重新登录");
                    } else {
                        $(".autocode_tips").show().html(data.msg);
                    }
                } else {
                    login_area_times++;
                    $(".error_tips_index").show().html(data.msg);
                }
            });
        }
        // if (login_area_times > 3) {
        //     $("#authcode_page").show();
        //     $(".indexpage_loginarea_btn").css("top", "244px");
        //     $(".index_bottom_btna").css("top", "280px");
        // } else {
        //     $(".indexpage_loginarea_btn").css("top", "180px");
        //     $(".index_bottom_btna").css("top", "216px");
        // }
    });
    // $("#goone").on("click", function() {
    //     location.href = "./cnydepositswithdrawal.html";
    // });
    // $("#gotwo").on("click", function() {
    //     location.href = "./cnydepositswithdrawal.html?formindex='index'";
    // });
    $(".imgOne").on("click", function() {
        location.href = "./footer.html";
    });
    var fflat = true;
    $(".eye_i").on("click", function() {
        if (fflat) {
            $(this)[0].style.background = "url(./images/index_no_eye.png)";
            fflat = false;
            $(".lf_asset_center").hide();
            $(".lf_asset_center_none").show();
            $(".rg_asset_center").hide();
            $(".rg_asset_center_none").show();
        } else {
            $(this)[0].style.background = "url(./images/index_eye_visible.png)";
            fflat = true;
            $(".lf_asset_center").show();
            $(".lf_asset_center_none").hide();
            $(".rg_asset_center").show();
            $(".rg_asset_center_none").hide();
        }
    });
    $(".loc_img").on("click", function() {
        $("#one1").html("");
        $("<img id='topbar_img'/>").attr("src", "/exchangeApi/code/getCode?v=" + Math.random()).appendTo($("#one1"));
        return false;
    });
    $(".loc_img_topbar").on("click", function() {
        $("#one2").html("");
        $("<img id='topbar_img'/>").attr("src", "/exchangeApi/code/getCode?v=" + Math.random()).appendTo($("#one2"));
        return false;
    });

    $(".loginout").on("click", function() {
        $.cookie('exchangeToken', '');
        $.cookie("global_loginuserphone", '');
        $.cookie("global_loginusername", '');
        $.cookie("global_loginuseruid", '');
        $.cookie("totalAssets", "");
        $.cookie("totalNuts", "");
        $.cookie("mine_one", "");
        $.cookie("mine_two", "");
        $.cookie("mine_three", "");
        $.cookie("mine_four", "");
        $.cookie("loginfromwhichpage", "");
        api_mkt.userlogout({}, function(data) {
            if (data.status == 200) {
                showWarnWin("退出成功", 1e3);
                window.location.href = "index.html";
            } else if (data.status == 305) {
                showWarnWin(data.msg, 1e3);
            } else {
                showWarnWin(data.msg, 1e3);
            }
        });
        setTimeout(function() {
            location.reload(true);
        }, 1000);
    });
    //显示垂直滚动条
    $('.tbone').hover(function() {
        if ($(this).children('.table_row').length > 30) {
            $(this).addClass('scrollY');
        }
    }, function() {
        $(this).removeClass('scrollY');
    });
});


window.addEventListener("keyup",function(){
    if (event.keyCode == 13) {
        event.returnValue = false;
        event.cancel = true;
        $(".indexpage_loginarea_btn").click();
    }
});