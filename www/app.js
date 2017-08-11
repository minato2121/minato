
var app = angular.module('myApp',['ngResource','onsen','ui.bootstrap'])
    /*
    app.factory('Data',function(){
        var data = {login:{},datepicker:{}};
        //data.login = {}
        data.login.db = "irvine1";
        data.login.id = "irvine1_main";
        data.login.name = "仁";
        data.login.pass = "4MD8V8tp42";//"aaa11"
        data.login.rank = data.login.id.indexOf("_main");
        data.datepicker.format = 'yyyyMMdd';
        //data.datepicker.time = Data.login.ymd
        data.datepicker.open = false;
        return data;
    });
    */
    .value('Data',{
        
        login : {db:"irvine1",id:"irvine1_main",name:"仁",pass:"4MD8V8tp42",rank:"irvine1_main".indexOf("_main")},
        datepicker : {format:'yyyyMMdd',open:false}
        //login.db : "irvine1";
        //login[id] : "irvine1_main";
        //login[name] : "仁";
        //login[pass] : "4MD8V8tp42";//"aaa11"
        //login[rank] : data.login.id.indexOf("_main");
        //datepicker[format] : 'yyyyMMdd';
        //data.datepicker.time = Data.login.ymd
        //datepicker[open] : false;
        
    })
    .factory('myFactory', ['$resource','Data','$q','$interval',function($resource,Data,$q,$interval){
        return{
            my_get:function(url,date){
                var r = $resource('http://localhost/:work',
                                {work:url},
                                {'save':  {method:'POST',headers:  {'Content-Type' : 'application/x-www-form-urlencoded;application/json;charset=utf-8'}},
                                'delete': {method:'DELETE',headers:{'Content-Type' : 'application/x-www-form-urlencoded;application/json;charset=utf-8'}}} 
                                );/*
                var r = $resource('https://minato2121.xsrv.jp/script/:work',
                                {work:url},
                                {'save':  {method:'POST',headers:  {'Content-Type' : 'application/x-www-form-urlencoded;application/json;charset=utf-8'}},
                                'delete': {method:'DELETE',headers:{'Content-Type' : 'application/x-www-form-urlencoded;application/json;charset=utf-8'}}} 
                                );*/
                var d = $q.defer();
                if(url == "option.php" || url == "option_itm.php"  || url == "menu.php" || url == "login.php"){
                    item = r.query({params:date})
                }else if(url == "cre.php" || url == "pay.php"){
                    let log = itmGet(Data)
                    log.key_ym = String(Data.op.key)
                    log.key_y = String(Data.op.key).substr(0,4)
                    if(date == undefined){
                        item = r.query({params:log})
                    }else{
                        log.key_y = ""
                        item = r.query({params:log})
                    }
                }else if(url == "orders.php"){
                    date.no = Data.no
                    item = r.query({params:date})
                }else if(url == "order.php"){
                    let log = itmGet(Data)
                    if(date == undefined){
                        log.no = ""
                        item = r.query({params:log})
                    }else{
                        log.no = date
                        item = r.query({params:log})   
                    }//編集済み
                }else if(url == "cast_c.php" || url == "dat.php"  || url == "dp.php" || url == "hen.php" || url == "sak.php" || url == "no_t.php"){
                    if(date == undefined){
                        //item = r.query({params:Data.time.ymd})
                    }else{
                        item = r.query({params:date})
                    }
                }else if(url == "dat_sou.php" || url == "dat_dil.php" || url == "cast.php" || url == "schedule.php" || url == "cost.php" || url =="cp.php" || url == "pay_s.php"){
                    item = r.query({params:date})
                }else if(url == "salary_s.php"){
                    date.myid = date.id
                    item = r.query({params:date})
                    
                }else if(url == "dat_syo.php" ){
                    if(date == undefined){
                        let w = {}
                        w.name = Data.casts
                        w = Object.assign(Data.login,w)
                        item = r.query({params:w})
                    }else{
                        date.name = Data.casts
                        item = r.query({params:date})
                    }
                }
                $interval(function(){
                    if(item === undefined || item === ''){
                        d.reject('取得に失敗しました');
                    }else{
                        d.resolve(item); //非同期処理完了時の値をresolveメソッドに渡す
                    }
                },500)
                return d.promise;
            },
            my_r:function(url,data,method){
                var r = $resource('http://localhost/:work',
                                    {work:url},
                                    {'save':  {method:'POST',headers:  {'Content-Type' : 'application/x-www-form-urlencoded;application/json;charset=utf-8'}},
                                    'delete': {method:'DELETE',headers:{'Content-Type' : 'application/x-www-form-urlencoded;application/json;charset=utf-8'}}}
                                );/*
                var r = $resource('https://minato2121.xsrv.jp/script/:work',
                                    {work:url},
                                    {'save':  {method:'POST',headers:  {'Content-Type' : 'application/x-www-form-urlencoded;application/json;charset=utf-8'}},
                                    'delete': {method:'DELETE',headers:{'Content-Type' : 'application/x-www-form-urlencoded;application/json;charset=utf-8'}}}
                                );*/
                if(method == "save"){    
                    var d = $q.defer();
                    item = r.save(data)
                    $interval(function(){
                        if(item === undefined || item === ''){
                            d.reject('取得に失敗しました');
                        }else{
                            d.resolve(item); //非同期処理完了時の値をresolveメソッドに渡す
                        }
                    },500)//:;
                    return d.promise
                }
            }
        }
    }])
    //home.html php test5
    .controller('home_Controller',['$scope','$resource','Data','myFactory',function($scope,$resource,Data,myFactory){
        
        if(Data.login.rank != -1){
            $scope.show = true
        }
        myFactory.my_get("option.php",Data.login).then(function(op){
            if(op[0][0] != undefined){
                Data.op = op[0][0]
                Data.cos = op[1]
                Data.pay_s = op[2]
                let time = getTime(Data)
                Data.login.y = time.y
                Data.login.ym = time.ym
                Data.login.ymd = time.ymd
                if(Data.login.rank != -1){
                    myFactory.my_get("cast.php",Data.login).then(function(casts){
                        Data.casts = castGet(casts)
                        myFactory.my_get("option_itm.php",Data.login).then(function(itm){
                            for(let i=0;i<itm.length;i++){
                                if(itm[i].flg == 1){
                                    itm.splice(i,1)
                                    i--
                                }
                            }
                        Data.op_itm = itm
                        })
                    })
                }
            }else{
                myAlert("エラー","オプションの設定を行ってください","OK")
                $scope.nav.pushPage('option.html')
            }
            console.log(Data)
        })
        $scope.on1 = function(){
            $scope.nav.pushPage('slip_mane.html');
        }
        $scope.on2 = function(){
            $scope.nav.pushPage('no_t.html');
        }
        $scope.on3 = function(){
            $scope.nav.pushPage('cre.html');
        }
        $scope.on4 = function(){
            $scope.nav.pushPage('pay_s.html');
        }
        $scope.on5 = function(){
            $scope.nav.pushPage('dat.html');
        }
        $scope.on6 = function(){
            $scope.nav.pushPage('dat_syo.html');
        }
        $scope.on7 = function(){
            $scope.nav.pushPage('dat_sou.html');
        }
        $scope.on8 = function(){
            $scope.nav.pushPage('dat_dil.html');
        }
        $scope.on9 = function(){
            $scope.nav.pushPage('cast.html');
        }
        $scope.on10 = function(){
            $scope.nav.pushPage('pay_s_sou.html');
        }
        $scope.on11 = function(){
            $scope.nav.pushPage('salary_s.html');
        }
        $scope.on12 = function(){
            $scope.nav.pushPage('option.html');
        }
        $scope.on13 = function(){
            $scope.nav.pushPage('schedule.html');
        }
        $scope.on14 = function(){
            $scope.nav.pushPage('cast_c.html');
        }
        $scope.on15 = function(){
            $scope.nav.pushPage('menu.html');
        }
    }])
    //pay_s_sou.html pay_s_sou.php//test5
    .controller('pay_s_sou_Controller',['$scope','$resource','Data','$q','myFactory','$uibModal','uibDateParser',function($scope,$resource,Data,$q,myFactory,$uibModal,uibDateParser){
        let w = {}
        myFactory.my_get("salary_s.php",Data.login).then(function(salary_s){
            $scope.pay_s = {nam:""}
            $scope.pay_s.nam = Data.casts[0]
            w = Data.login
            w.name = Data.casts
            w.last_ym = next_m(Data.login.ym)
            w.last_y = w.last_ym.substr(0,4)
            $scope.pay_s.fe = Data.pay_s
            $scope.pay_s_ym = pay_s_ymGet(Data.op.key,Data.login.ym)
            $scope.key = $scope.pay_s_ym[0]
            $scope.salary_s = salary_s
            $scope.total = []
            $scope.allsum = 0
            myFactory.my_get("pay_s.php",w).then(function(pay_s){
                for(let i=0;i<pay_s.length;i++){
                    let work = my_split(pay_s,"syo")
                    $scope.pay_s.sub = objAdd(pay_s[i].sub,"sub","1",w.name[i])//売上
                    $scope.pay_s.sub_bac = valueCondition($scope.salary_s,$scope.pay_s.sub,"a",true)//売上%
                    $scope.pay_s.sub_pri = $scope.pay_s.sub * ($scope.pay_s.sub_bac * 0.01)//売上バック
                    $scope.pay_s.syu = objAdd(pay_s[i].syu,"cnt","2")//出勤日数
                    $scope.pay_s.day_s = $scope.pay_s.syu * valueCondition($scope.salary_s,$scope.pay_s.sub,"a")//日給総額
                    $scope.pay_s.s_cnt = objAdd(pay_s[i].sub,"cnt","1",w.name[i])//本指名数
                    $scope.pay_s.s_pri = $scope.pay_s.s_cnt * valueCondition($scope.salary_s,$scope.pay_s.s_cnt,"b")//本指名バック
                    $scope.pay_s.d_cnt = objAdd(pay_s[i].sub,"dou","1",w.name[i])//同伴本数
                    $scope.pay_s.d_pri = $scope.pay_s.d_cnt * valueCondition($scope.salary_s,$scope.pay_s.d_cnt,"d")//同伴バック
                    $scope.pay_s.j_cnt = objAdd(pay_s[i].jou,"jou","2")//場内指名数
                    $scope.pay_s.j_pri = $scope.pay_s.j_cnt * valueCondition($scope.salary_s,$scope.pay_s.j_cnt,"e")//場内バック
                    $scope.pay_s.h_cnt = objAdd(pay_s[i].her,"her","2")//ヘルプ指名数
                    $scope.pay_s.h_pri = $scope.pay_s.h_cnt * valueCondition($scope.salary_s,$scope.pay_s.h_cnt,"e")//ヘルプバック
                    $scope.pay_s.pay = dcd(pay_s[i].pay,Data.op.op8,Data.login.ym,Data.login.next_m)//入金
                    $scope.pay_s.syo_cnt = work[i].syo//紹介本数
                    $scope.pay_s.syo_pri = $scope.pay_s.syo_cnt * valueCondition($scope.salary_s,$scope.pay_s.syo_cnt,"c")//紹介バック
                    $scope.pay_s.pen = valueCondition($scope.salary_s,$scope.pay_s.sub,"a") * (objAdd(pay_s[i].pen,"pen","1") * 0.01)//ペナルティ
                    $scope.pay_s.cre = objAdd(pay_s[i].sub,"cre","1",w.name[i])//売掛
                    $scope.pay_s.dp = objAdd(pay_s[i].dp,"pri","1")//日払い
                    $scope.pay_s.jib = objAdd(pay_s[i].sub,"jib","1",w.name[i])//自腹
                    //■■■■■■■■■■■■
                    work = m_cosGet(pay_s[i].etc)
                    $scope.pay_s.d_cle = objAdd(pay_s[i].d_cle,"pri","1")//日別クリーニング
                    $scope.pay_s.d_mei = objAdd(pay_s[i].d_mei,"pri","1")//日別名刺
                    $scope.pay_s.d_ren = objAdd(pay_s[i].d_ren,"pri","1")//日別レンタル
                    $scope.pay_s.d_ryo = objAdd(pay_s[i].d_ryo,"pri","1")//日別寮
                    $scope.pay_s.d_set = objAdd(pay_s[i].d_set,"pri","1")//日別ヘアセット
                    $scope.pay_s.d_sou = objAdd(pay_s[i].d_sou,"pri","1")//日別送迎
                    $scope.pay_s.d_cp = objAdd(pay_s[i].d_cp,"pri","1")//即日キャンペーン
                    $scope.pay_s.cp = work.cp//キャンペーン
                    $scope.pay_s.cle = work.cle//クリーニング
                    $scope.pay_s.mei = work.mei//名刺
                    $scope.pay_s.ren = work.ren//レンタル
                    $scope.pay_s.ryo = work.ryo//寮
                    $scope.pay_s.set = work.set//ヘアセット
                    $scope.pay_s.sou = work.sou//送迎
                    $scope.pay_s.exc = objAdd(work.exc,"pri","1")//その他
                    $scope.pay_s.min = checkFalse(pay_s[i].min)//給与マイナス
                    $scope.pay_s.cos = $scope.pay_s.d_cle + $scope.pay_s.d_mei + $scope.pay_s.d_ren + $scope.pay_s.d_ryo + $scope.pay_s.d_set + $scope.pay_s.d_sou + 
                        $scope.pay_s.cle + $scope.pay_s.mei + $scope.pay_s.ren + $scope.pay_s.ryo + $scope.pay_s.set + $scope.pay_s.sou + $scope.pay_s.exc//経費
                    //■■■■■■■■■■■■
                    $scope.pay_s.total_s = $scope.pay_s.sub_pri + $scope.pay_s.day_s + $scope.pay_s.s_pri + $scope.pay_s.d_pri + $scope.pay_s.j_pri + $scope.pay_s.h_pri + 
                        $scope.pay_s.syo_pri + $scope.pay_s.cp //給与総額(日給総額+売上･指名･同伴･場内･ヘル指･紹介バック+月別キャンペーン)
                    $scope.pay_s.n_income = $scope.pay_s.total_s + $scope.pay_s.pay- $scope.pay_s.pen - $scope.pay_s.cre - $scope.pay_s.jib - $scope.pay_s.dp - $scope.pay_s.cos - $scope.pay_s.min - objAdd($scope.pay_s.fe,"pri","1")//手取り
                    if(Data.op.op21 == "a" && Data.op.op22 == "a"){
                        $scope.pay_s.gen = $scope.pay_s.total_s + $scope.pay_s.d_cp + $scope.pay_s.dp + $scope.pay_s.pay - $scope.pay_s.cre - $scope.pay_s.jib//源泉
                    }else if(Data.op.op21 == "a" && Data.op.op22 == "b"){
                        $scope.pay_s.gen = $scope.pay_s.n_income
                    }
                    if($scope.pay_s.gen >= 10){
                        $scope.pay_s.gen = Math.floor($scope.pay_s.gen * 0.1021)
                        $scope.pay_s.n_income -= $scope.pay_s.gen
                    }else{
                        $scope.pay_s.gen = 0
                    }
                    $scope.total.push({nam:pay_s[i].nam,pri:$scope.pay_s.n_income})
                    $scope.allsum += $scope.pay_s.n_income
                }
            })
        })
    }])
    //schedule.html schedule.php
    .controller('schedule_Controller',['$scope','$resource','Data','$q','myFactory','$uibModal','uibDateParser',function($scope,$resource,Data,$q,myFactory,$uibModal,uibDateParser){
        $scope.schedule = itmGet(Data)
        myFactory.my_get("schedule.php",Data.login).then(function(schedule){
            $scope.datepicker = Data.datepicker
            $scope.datepicker.time = getTime(Data,"1",undefined)
            $scope.itm = schedule
            if(Data.casts != undefined){
                $scope.casts = Data.casts
                $scope.schedule.nam = $scope.casts[0]
            }else{
                $scope.casts = Data.login.name
                $scope.schedule.nam = Data.login.name
            }
            
        })
        $scope.toggleDatePicker = function($event) {
            // これが重要！！！
            $event.stopPropagation();
            $scope.datePickerOpen = !$scope.datePickerOpen;
        };
        $scope.schedule_show = function(){
            $scope.schedule = Object.assign($scope.schedule,getTime(undefined,undefined,$scope.datepicker.time))
            /*
            $scope.schedule.y = getTime(undefined,"y",$scope.datepicker.time)
            $scope.schedule.ym = getTime(undefined,"ym",$scope.datepicker.time)
            $scope.schedule.ymd = getTime(undefined,"ymd",$scope.datepicker.time)
            */
            myFactory.my_get("schedule.php",$scope.schedule).then(function(schedule){
                $scope.itm = schedule
            })
        }
        
        $scope.onadd = function(){
            $scope.schedule.flg = "0"
            //$scope.schedule.nam = Data.login.name
            if($scope.schedule.min == ""){
                $scope.schedule.min = "00"
            }
            $scope.schedule.tim = $scope.schedule.tim + ":" + $scope.schedule.min 
            if($scope.schedule.dou == false){
                $scope.schedule.dou = ""
            }else{
                $scope.schedule.dou = "○"
            }
            if($scope.schedule.sin == false){
                $scope.schedule.sin = ""
            }else{
                $scope.schedule.sin = "○"
            }
            if($scope.schedule.bug == ""){
                $scope.schedule.bug = 0
            }
            myFactory.my_r("schedule.php",$scope.schedule,"save").then(function(){
                $scope.schedule.dou = false
                $scope.schedule.sin = false
                $scope.schedule.tim = ""
                $scope.schedule.min = ""
                $scope.schedule.gue = ""
                $scope.schedule.bug = ""
                $scope.schedule.rem = ""
                myFactory.my_get("schedule.php",$scope.schedule).then(function(schedule){
                    $scope.itm = schedule
                })
            })
        }
        $scope.hold = function(itm){
            ons.notification.confirm({
                message: '項目を削除してもよろしいですか？',
                title: '確認',
                buttonLabels: ['NO','YES'],
                animation: 'default',
                callback: function(myflg) {
                    if(myflg == 1){
                        itm = Object.assign(itm,Data.login)
                        itm.flg = "1"
                        myFactory.my_r("schedule.php",itm,"save").then(function(){
                            myFactory.my_get("schedule.php",$scope.schedule).then(function(schedule){
                                $scope.itm = schedule
                            })
                        })
                    }
                }
            })
        }
    }])
    //pay_s.html pay_s.php
    .controller('pay_s_Controller',['$scope','$resource','Data','$q','myFactory','$uibModal',function($scope,$resource,Data,$q,myFactory,$uibModal){
        let w = {}
        myFactory.my_get("salary_s.php",Data.login).then(function(salary_s){
            $scope.pay_s = {nam:""}
            
            if(Data.login.rank != -1){
                $scope.casts = Data.casts
                $scope.pay_s.nam = $scope.casts[0]
                w = Object.assign(w,Data.login)
                w.name = Data.casts
            }else{
                $scope.pay_s.nam = Data.login.name
                w = Object.assign(w,Data.login)
            }
            w.last_ym = next_m(Data.login.ym)
            w.last_y = w.last_ym.substr(0,4)
            $scope.pay_s.fe = Data.pay_s
            $scope.pay_s_ym = pay_s_ymGet(Data.op.key,Data.login.ym)
            $scope.key = $scope.pay_s_ym[0]
            $scope.salary_s = salary_s
            myFactory.my_get("pay_s.php",w).then(function(pay_s){
                if(pay_s[0] != undefined){
                    if(Data.login.rank == -1){
                        for(let i=0;i<pay_s.length;i++){
                            if(pay_s[i].nam != Data.login.name){
                                pay_s.splice(i,1)
                                i--
                            }
                        }
                    }
                    let work = my_split(pay_s,"syo")
                    $scope.pay_s.sub = objAdd(pay_s[0].sub,"sub","1",$scope.pay_s.nam[0])//売上
                    $scope.pay_s.sub_bac = valueCondition($scope.salary_s,$scope.pay_s.sub,"a",true)//売上%
                    $scope.pay_s.sub_pri = $scope.pay_s.sub * ($scope.pay_s.sub_bac * 0.01)//売上バック
                    $scope.pay_s.syu = objAdd(pay_s[0].syu,"cnt","2")//出勤日数
                    $scope.pay_s.day_s = $scope.pay_s.syu * valueCondition($scope.salary_s,$scope.pay_s.sub,"a")//日給総額
                    $scope.pay_s.s_cnt = objAdd(pay_s[0].sub,"cnt","1",$scope.pay_s.nam[0])//本指名数
                    $scope.pay_s.s_pri = $scope.pay_s.s_cnt * valueCondition($scope.salary_s,$scope.pay_s.s_cnt,"b")//本指名バック
                    $scope.pay_s.d_cnt = objAdd(pay_s[0].sub,"dou","1",$scope.pay_s.nam[0])//同伴本数
                    $scope.pay_s.d_pri = $scope.pay_s.d_cnt * valueCondition($scope.salary_s,$scope.pay_s.d_cnt,"d")//同伴バック
                    $scope.pay_s.j_cnt = objAdd(pay_s[0].jou,"jou","2")//場内指名数
                    $scope.pay_s.j_pri = $scope.pay_s.j_cnt * valueCondition($scope.salary_s,$scope.pay_s.j_cnt,"e")//場内バック
                    $scope.pay_s.h_cnt = objAdd(pay_s[0].her,"her","2")//ヘルプ指名数
                    $scope.pay_s.h_pri = $scope.pay_s.h_cnt * valueCondition($scope.salary_s,$scope.pay_s.h_cnt,"e")//ヘルプバック
                    $scope.pay_s.pay = dcd(pay_s[0].pay,Data.op.op8,Data.login.ym,Data.login.next_m)//入金
                    $scope.pay_s.syo_cnt = work[0].syo//紹介本数
                    $scope.pay_s.syo_pri = $scope.pay_s.syo_cnt * valueCondition($scope.salary_s,$scope.pay_s.syo_cnt,"c")//紹介バック
                    $scope.pay_s.pen = valueCondition($scope.salary_s,$scope.pay_s.sub,"a") * (objAdd(pay_s[0].pen,"pen","1") * 0.01)//ペナルティ
                    $scope.pay_s.cre = objAdd(pay_s[0].sub,"cre","1",$scope.pay_s.nam[0])//売掛
                    $scope.pay_s.dp = objAdd(pay_s[0].dp,"pri","1")//日払い
                    $scope.pay_s.jib = objAdd(pay_s[0].sub,"jib","1",$scope.pay_s.nam[0])//自腹
                    //■■■■■■■■■■■■
                    work = m_cosGet(pay_s[0].etc)
                    $scope.pay_s.d_cle = objAdd(pay_s[0].d_cle,"pri","1")//日別クリーニング
                    $scope.pay_s.d_mei = objAdd(pay_s[0].d_mei,"pri","1")//日別名刺
                    $scope.pay_s.d_ren = objAdd(pay_s[0].d_ren,"pri","1")//日別レンタル
                    $scope.pay_s.d_ryo = objAdd(pay_s[0].d_ryo,"pri","1")//日別寮
                    $scope.pay_s.d_set = objAdd(pay_s[0].d_set,"pri","1")//日別ヘアセット
                    $scope.pay_s.d_sou = objAdd(pay_s[0].d_sou,"pri","1")//日別送迎
                    $scope.pay_s.d_cp = objAdd(pay_s[0].d_cp,"pri","1")//即日キャンペーン
                    $scope.pay_s.cp = work.cp//キャンペーン
                    $scope.pay_s.cle = work.cle//クリーニング
                    $scope.pay_s.mei = work.mei//名刺
                    $scope.pay_s.ren = work.ren//レンタル
                    $scope.pay_s.ryo = work.ryo//寮
                    $scope.pay_s.set = work.set//ヘアセット
                    $scope.pay_s.sou = work.sou//送迎
                    $scope.pay_s.exc = objAdd(work.exc,"pri","1")//その他
                    $scope.pay_s.min = checkFalse(pay_s[0].min)//給与マイナス
                    $scope.pay_s.cos = $scope.pay_s.d_cle + $scope.pay_s.d_mei + $scope.pay_s.d_ren + $scope.pay_s.d_ryo + $scope.pay_s.d_set + $scope.pay_s.d_sou + 
                        $scope.pay_s.cle + $scope.pay_s.mei + $scope.pay_s.ren + $scope.pay_s.ryo + $scope.pay_s.set + $scope.pay_s.sou + $scope.pay_s.exc//経費
                    //■■■■■■■■■■■■
                    $scope.pay_s.total_s = $scope.pay_s.sub_pri + $scope.pay_s.day_s + $scope.pay_s.s_pri + $scope.pay_s.d_pri + $scope.pay_s.j_pri + $scope.pay_s.h_pri + 
                        $scope.pay_s.syo_pri + $scope.pay_s.cp //給与総額(日給総額+売上･指名･同伴･場内･ヘル指･紹介バック+月別キャンペーン)
                    $scope.pay_s.n_income = $scope.pay_s.total_s + $scope.pay_s.pay- $scope.pay_s.pen - $scope.pay_s.cre - $scope.pay_s.jib - $scope.pay_s.dp - $scope.pay_s.cos - $scope.pay_s.min - objAdd($scope.pay_s.fe,"pri","1")//手取り
                    if(Data.op.op21 == "a" && Data.op.op22 == "a"){
                        $scope.pay_s.gen = $scope.pay_s.total_s + $scope.pay_s.d_cp + $scope.pay_s.dp + $scope.pay_s.pay - $scope.pay_s.cre - $scope.pay_s.jib//源泉
                    }else if(Data.op.op21 == "a" && Data.op.op22 == "b"){
                        $scope.pay_s.gen = $scope.pay_s.n_income
                    }
                    if($scope.pay_s.gen >= 10){
                        $scope.pay_s.gen = Math.floor($scope.pay_s.gen * 0.1021)
                        $scope.pay_s.n_income -= $scope.pay_s.gen
                    }else{
                        $scope.pay_s.gen = 0
                    }
                }
            })
        })
             //})
        //})
        $scope.pay_s_show = function(){
            w.ym = $scope.key
            w.y = $scope.key.substr(0,4)
            w.last_ym = next_m($scope.key)
            w.last_y = w.last_ym.substr(0,4)
            myFactory.my_get("pay_s.php",w).then(function(pay_s){
                let cnt = 0
                for(let i=0;$scope.pay_s.nam != pay_s[i].nam;i++){
                    cnt = i + 1
                }
                let work = my_split(pay_s,"syo")
                $scope.pay_s.sub = objAdd(pay_s[cnt].sub,"sub","1",$scope.pay_s.nam)//売上
                $scope.pay_s.sub_bac = valueCondition($scope.salary_s,$scope.pay_s.sub,"a",true)//売上%
                $scope.pay_s.sub_pri = $scope.pay_s.sub * ($scope.pay_s.sub_bac * 0.01)//売上バック
                $scope.pay_s.syu = objAdd(pay_s[cnt].syu,"cnt","2")//出勤日数
                $scope.pay_s.day_s = $scope.pay_s.syu * valueCondition($scope.salary_s,$scope.pay_s.sub,"a")//日給総額
                $scope.pay_s.s_cnt = objAdd(pay_s[cnt].sub,"cnt","1",$scope.pay_s.nam)//本指名数
                $scope.pay_s.s_pri = $scope.pay_s.s_cnt * valueCondition($scope.salary_s,$scope.pay_s.s_cnt,"b")//本指名バック
                $scope.pay_s.d_cnt = objAdd(pay_s[cnt].sub,"dou","1",$scope.pay_s.nam)//同伴本数
                $scope.pay_s.d_pri = $scope.pay_s.d_cnt * valueCondition($scope.salary_s,$scope.pay_s.d_cnt,"d")//同伴バック
                $scope.pay_s.j_cnt = objAdd(pay_s[cnt].jou,"jou","2")//場内指名数
                $scope.pay_s.j_pri = $scope.pay_s.j_cnt * valueCondition($scope.salary_s,$scope.pay_s.j_cnt,"e")//場内バック
                $scope.pay_s.h_cnt = objAdd(pay_s[cnt].her,"her","2")//ヘルプ指名数
                $scope.pay_s.h_pri = $scope.pay_s.h_cnt * valueCondition($scope.salary_s,$scope.pay_s.h_cnt,"e")//ヘルプバック
                $scope.pay_s.pay = dcd(pay_s[cnt].pay,Data.op.op8,Data.login.ym,Data.login.next_m)//入金
                $scope.pay_s.syo_cnt = work[0].syo//紹介本数
                $scope.pay_s.syo_pri = $scope.pay_s.syo_cnt * valueCondition($scope.salary_s,$scope.pay_s.syo_cnt,"c")//紹介バック
                $scope.pay_s.pen = valueCondition($scope.salary_s,$scope.pay_s.sub,"a") * (objAdd(pay_s[cnt].pen,"pen","1") * 0.01)//ペナルティ
                $scope.pay_s.cre = objAdd(pay_s[cnt].sub,"cre","1",$scope.pay_s.nam)//売掛
                $scope.pay_s.dp = objAdd(pay_s[cnt].dp,"pri","1")//日払い
                $scope.pay_s.jib = objAdd(pay_s[cnt].sub,"jib","1",$scope.pay_s.nam)//自腹
                //■■■■■■■■■■■■
                work = m_cosGet(pay_s[cnt].etc)
                $scope.pay_s.d_cle = objAdd(pay_s[cnt].d_cle,"pri","1")//日別クリーニング
                $scope.pay_s.d_mei = objAdd(pay_s[cnt].d_mei,"pri","1")//日別名刺
                $scope.pay_s.d_ren = objAdd(pay_s[cnt].d_ren,"pri","1")//日別レンタル
                $scope.pay_s.d_ryo = objAdd(pay_s[cnt].d_ryo,"pri","1")//日別寮
                $scope.pay_s.d_set = objAdd(pay_s[cnt].d_set,"pri","1")//日別ヘアセット
                $scope.pay_s.d_sou = objAdd(pay_s[cnt].d_sou,"pri","1")//日別送迎
                $scope.pay_s.d_cp = objAdd(pay_s[cnt].d_cp,"pri","1")//即日キャンペーン
                $scope.pay_s.cp = work.cp//キャンペーン
                $scope.pay_s.cle = work.cle//クリーニング
                $scope.pay_s.mei = work.mei//名刺
                $scope.pay_s.ren = work.ren//レンタル
                $scope.pay_s.ryo = work.ryo//寮
                $scope.pay_s.set = work.set//ヘアセット
                $scope.pay_s.sou = work.sou//送迎
                $scope.pay_s.exc = objAdd(work.exc,"pri","1")//その他
                $scope.pay_s.min = checkFalse(pay_s[cnt].min)//給与マイナス
                $scope.pay_s.cos = $scope.pay_s.d_cle + $scope.pay_s.d_mei + $scope.pay_s.d_ren + $scope.pay_s.d_ryo + $scope.pay_s.d_set + $scope.pay_s.d_sou + 
                    $scope.pay_s.cle + $scope.pay_s.mei + $scope.pay_s.ren + $scope.pay_s.ryo + $scope.pay_s.set + $scope.pay_s.sou + $scope.pay_s.exc//経費
                //■■■■■■■■■■■■
                $scope.pay_s.total_s = $scope.pay_s.sub_pri + $scope.pay_s.day_s + $scope.pay_s.s_pri + $scope.pay_s.d_pri + $scope.pay_s.j_pri + $scope.pay_s.h_pri + 
                    $scope.pay_s.syo_pri + $scope.pay_s.cp //給与総額(日給総額+売上･指名･同伴･場内･ヘル指･紹介バック+月別キャンペーン)
                $scope.pay_s.n_income = $scope.pay_s.total_s + $scope.pay_s.pay- $scope.pay_s.pen - $scope.pay_s.cre - $scope.pay_s.jib - $scope.pay_s.dp - $scope.pay_s.cos - $scope.pay_s.min - objAdd($scope.pay_s.fe,"pri","1")//手取り
                if(Data.op.op21 == "a" && Data.op.op22 == "a"){
                    $scope.pay_s.gen = $scope.pay_s.total_s + $scope.pay_s.d_cp + $scope.pay_s.dp + $scope.pay_s.pay - $scope.pay_s.cre - $scope.pay_s.jib//源泉
                }else if(Data.op.op21 == "a" && Data.op.op22 == "b"){
                    $scope.pay_s.gen = $scope.pay_s.n_income
                }
                if($scope.pay_s.gen >= 10){
                    $scope.pay_s.gen = Math.floor($scope.pay_s.gen * 0.1021)
                    $scope.pay_s.n_income -= $scope.pay_s.gen
                }else{
                    $scope.pay_s.gen = 0
                }
            })
        }
        $scope.simu = function(){
                //$scope.pay_s.sub = objAdd(pay_s[cnt].sub,"sub","1")//売上
                $scope.pay_s.sub_bac = valueCondition($scope.salary_s,$scope.pay_s.sub,"a",true)//売上%
                $scope.pay_s.sub_pri = $scope.pay_s.sub * ($scope.pay_s.sub_bac * 0.01)//売上バック
                //$scope.pay_s.syu = objAdd(pay_s[cnt].syu,"cnt","2")//出勤日数
                $scope.pay_s.day_s = $scope.pay_s.syu * valueCondition($scope.salary_s,$scope.pay_s.sub,"a")//日給総額
                //$scope.pay_s.s_cnt = objAdd(pay_s[cnt].sub,"cnt","1")//本指名数
                $scope.pay_s.s_pri = $scope.pay_s.s_cnt * valueCondition($scope.salary_s,$scope.pay_s.s_cnt,"b")//本指名バック
                //$scope.pay_s.d_cnt = objAdd(pay_s[cnt].sub,"dou","1")//同伴本数
                $scope.pay_s.d_pri = $scope.pay_s.d_cnt * valueCondition($scope.salary_s,$scope.pay_s.d_cnt,"d")//同伴バック
                //$scope.pay_s.j_cnt = objAdd(pay_s[cnt].jou,"jou","2")//場内指名数
                $scope.pay_s.j_pri = $scope.pay_s.j_cnt * valueCondition($scope.salary_s,$scope.pay_s.j_cnt,"e")//場内バック
                //$scope.pay_s.h_cnt = objAdd(pay_s[cnt].her,"her","2")//ヘルプ指名数
                $scope.pay_s.h_pri = $scope.pay_s.h_cnt * valueCondition($scope.salary_s,$scope.pay_s.h_cnt,"e")//ヘルプバック
                //$scope.pay_s.pay = dcd(pay_s[cnt].pay,Data.op.op8,Data.login.ym,Data.login.next_m)//入金
                //$scope.pay_s.syo_cnt = work[0].syo//紹介本数
                $scope.pay_s.syo_pri = $scope.pay_s.syo_cnt * valueCondition($scope.salary_s,$scope.pay_s.syo_cnt,"c")//紹介バック
                //$scope.pay_s.pen = valueCondition($scope.salary_s,$scope.pay_s.sub,"a") * (objAdd(pay_s[cnt].pen,"pen","1") * 0.01)//ペナルティ
                //$scope.pay_s.cre = objAdd(pay_s[cnt].sub,"cre","1")//売掛
                //$scope.pay_s.dp = objAdd(pay_s[cnt].dp,"pri","1")//日払い
                //$scope.pay_s.jib = objAdd(pay_s[cnt].sub,"jib","1")//自腹
                //■■■■■■■■■■■■
                //work = m_cosGet(pay_s[cnt].etc)
                //$scope.pay_s.d_cle = objAdd(pay_s[cnt].d_cle,"pri","1")//日別クリーニング
                //$scope.pay_s.d_mei = objAdd(pay_s[cnt].d_mei,"pri","1")//日別名刺
                //$scope.pay_s.d_ren = objAdd(pay_s[cnt].d_ren,"pri","1")//日別レンタル
                //$scope.pay_s.d_ryo = objAdd(pay_s[cnt].d_ryo,"pri","1")//日別寮
                //$scope.pay_s.d_set = objAdd(pay_s[cnt].d_set,"pri","1")//日別ヘアセット
                /*
                $scope.pay_s.d_sou = objAdd(pay_s[cnt].d_sou,"pri","1")//日別送迎
                $scope.pay_s.d_cp = objAdd(pay_s[cnt].d_cp,"pri","1")//即日キャンペーン
                $scope.pay_s.cp = work.cp//キャンペーン
                $scope.pay_s.cle = work.cle//クリーニング
                $scope.pay_s.mei = work.mei//名刺
                $scope.pay_s.ren = work.ren//レンタル
                $scope.pay_s.ryo = work.ryo//寮
                $scope.pay_s.set = work.set//ヘアセット
                $scope.pay_s.sou = work.sou//送迎
                $scope.pay_s.exc = objAdd(work.exc,"pri","1")//その他
                $scope.pay_s.min = checkFalse(pay_s[cnt].min)//給与マイナス
                
                $scope.pay_s.cos = $scope.pay_s.d_cle + $scope.pay_s.d_mei + $scope.pay_s.d_ren + $scope.pay_s.d_ryo + $scope.pay_s.d_set + $scope.pay_s.d_sou + 
                    $scope.pay_s.cle + $scope.pay_s.mei + $scope.pay_s.ren + $scope.pay_s.ryo + $scope.pay_s.set + $scope.pay_s.sou + $scope.pay_s.exc//経費
                //■■■■■■■■■■■■
                */
                $scope.pay_s.total_s = $scope.pay_s.sub_pri + $scope.pay_s.day_s + $scope.pay_s.s_pri + $scope.pay_s.d_pri + $scope.pay_s.j_pri + $scope.pay_s.h_pri + 
                    $scope.pay_s.syo_pri + $scope.pay_s.cp //給与総額(日給総額+売上･指名･同伴･場内･ヘル指･紹介バック+月別キャンペーン)
                $scope.pay_s.n_income = $scope.pay_s.total_s + $scope.pay_s.pay- $scope.pay_s.pen - $scope.pay_s.cre - $scope.pay_s.jib - $scope.pay_s.dp - $scope.pay_s.cos - $scope.pay_s.min - objAdd($scope.pay_s.fe,"pri","1")//手取り
                if(Data.op.op21 == "a" && Data.op.op22 == "a"){
                    $scope.pay_s.gen = $scope.pay_s.total_s + $scope.pay_s.d_cp + $scope.pay_s.dp + $scope.pay_s.pay - $scope.pay_s.cre - $scope.pay_s.jib//源泉
                }else if(Data.op.op21 == "a" && Data.op.op22 == "b"){
                    $scope.pay_s.gen = $scope.pay_s.n_income
                }
                if($scope.pay_s.gen >= 10){
                    $scope.pay_s.gen = Math.floor($scope.pay_s.gen * 0.1021)
                    $scope.pay_s.n_income -= $scope.pay_s.gen
                }else{
                    $scope.pay_s.gen = 0
                }
                
        }
    }])
    //cast_c.html cast_c.php
    .controller('cast_c_Controller',['$scope','$resource','Data','$q','myFactory','$uibModal',function($scope,$resource,Data,$q,myFactory,$uibModal){
                    $scope.cast = Data.casts
                    $scope.one = itmGet(Data)
                    $scope.one.nam = $scope.cast[0]
                    $scope.one.itm = ""
                    $scope.one.pri = ""
                    myFactory.my_get("cast_c.php",$scope.one).then(function(cast_c){
                        $scope.cast_c = []
                        $scope.exc = []
                        for(let i=0;i<$scope.cast.length;i++){
                            $scope.cast_c[i] = {nam:$scope.cast[i],min:"",set:"",ryo:"",ren:"",sou:"",cle:"",mei:"",cp:""}
                        }
                        for(let i=0;i<cast_c.length;i++){
                            let y = 0
                            while(cast_c[i].nam != $scope.cast_c[y].nam){
                                y++
                            }
                            if(cast_c[i].itm == "給料マイナス"){
                                $scope.cast_c[y].min = cast_c[i].pri
                            }else if(cast_c[i].itm == "ヘアセット"){
                                $scope.cast_c[y].set = cast_c[i].pri
                            }else if(cast_c[i].itm == "寮"){
                                $scope.cast_c[y].ryo = cast_c[i].pri
                            }else if(cast_c[i].itm == "レンタル"){
                                $scope.cast_c[y].ren = cast_c[i].pri
                            }else if(cast_c[i].itm == "送迎"){
                                $scope.cast_c[y].sou = cast_c[i].pri
                            }else if(cast_c[i].itm == "クリーニング"){
                                $scope.cast_c[y].cle = cast_c[i].pri
                            }else if(cast_c[i].itm == "名刺"){
                                $scope.cast_c[y].mei = cast_c[i].pri
                            }else if(cast_c[i].itm == "キャンペーン"){
                                $scope.cast_c[y].cp = cast_c[i].pri
                            }else{
                                $scope.exc.push({nam:cast_c[i].nam,itm:cast_c[i].itm,pri:cast_c[i].pri})
                            }
                        }
                    })
                    
                    
                    
                 //})
             
        //})
        $scope.one_add = function(){
            console.log($scope.one)
            if($scope.one.itm != "" && $scope.one.pri != ""){
                $scope.one.flg = "1"
                myFactory.my_r("cast_c.php",$scope.one,"save").then(function(){
                    myFactory.my_get("cast_c.php",$scope.one).then(function(cast_c){
                        $scope.cast_c = []
                        $scope.exc = []
                        for(let i=0;i<$scope.cast.length;i++){
                            $scope.cast_c[i] = {nam:$scope.cast[i],min:"",set:"",ryo:"",ren:"",sou:"",cle:"",mei:"",cp:""}
                        }
                        for(let i=0;i<cast_c.length;i++){
                            let y = 0
                            while(cast_c[i].nam != $scope.cast_c[y].nam){
                                y++
                            }
                            if(cast_c[i].itm == "給料マイナス"){
                                $scope.cast_c[y].min = cast_c[i].pri
                            }else if(cast_c[i].itm == "ヘアセット"){
                                $scope.cast_c[y].set = cast_c[i].pri
                            }else if(cast_c[i].itm == "寮"){
                                $scope.cast_c[y].ryo = cast_c[i].pri
                            }else if(cast_c[i].itm == "レンタル"){
                                $scope.cast_c[y].ren = cast_c[i].pri
                            }else if(cast_c[i].itm == "送迎"){
                                $scope.cast_c[y].sou = cast_c[i].pri
                            }else if(cast_c[i].itm == "クリーニング"){
                                $scope.cast_c[y].cle = cast_c[i].pri
                            }else if(cast_c[i].itm == "名刺"){
                                $scope.cast_c[y].mei = cast_c[i].pri
                            }else if(cast_c[i].itm == "キャンペーン"){
                                $scope.cast_c[y].cp = cast_c[i].pri
                            }else{
                                $scope.exc.push({nam:cast_c[i].nam,itm:cast_c[i].itm,pri:cast_c[i].pri})
                            }
                        }
                    })
                })
            }else{
                ons.notification.alert({
                    title: 'エラー',
                    messageHTML: '項目名と金額を入力してください。',
                    buttonLabel: 'OK'
                })
            }
        }
        $scope.one_del = function(){
            let w = itmGet(Data)
            w.del = []
            for(let i=0;i<$scope.exc.length;i++){
                if($scope.exc[i].del == true){
                    w.del.push($scope.exc[i])
                }
            }
            if(w.del.length != "0"){
                w.flg = "2"
                /*
                w.y = Data.time.y
                w.ym = Data.time.ym
                w.ymd = Data.time.ymd
                */
                myFactory.my_r("cast_c.php",w,"save").then(function(){
                    myFactory.my_get("cast_c.php",$scope.one).then(function(cast_c){
                        $scope.cast_c = []
                        $scope.exc = []
                        for(let i=0;i<$scope.cast.length;i++){
                            $scope.cast_c[i] = {nam:$scope.cast[i],min:"",set:"",ryo:"",ren:"",sou:"",cle:"",mei:"",cp:""}
                        }
                        for(let i=0;i<cast_c.length;i++){
                            let y = 0
                            while(cast_c[i].nam != $scope.cast_c[y].nam){
                                y++
                            }
                            if(cast_c[i].itm == "給料マイナス"){
                                $scope.cast_c[y].min = cast_c[i].pri
                            }else if(cast_c[i].itm == "ヘアセット"){
                                $scope.cast_c[y].set = cast_c[i].pri
                            }else if(cast_c[i].itm == "寮"){
                                $scope.cast_c[y].ryo = cast_c[i].pri
                            }else if(cast_c[i].itm == "レンタル"){
                                $scope.cast_c[y].ren = cast_c[i].pri
                            }else if(cast_c[i].itm == "送迎"){
                                $scope.cast_c[y].sou = cast_c[i].pri
                            }else if(cast_c[i].itm == "クリーニング"){
                                $scope.cast_c[y].cle = cast_c[i].pri
                            }else if(cast_c[i].itm == "名刺"){
                                $scope.cast_c[y].mei = cast_c[i].pri
                            }else if(cast_c[i].itm == "キャンペーン"){
                                $scope.cast_c[y].cp = cast_c[i].pri
                            }else{
                                $scope.exc.push({nam:cast_c[i].nam,itm:cast_c[i].itm,pri:cast_c[i].pri})
                            }
                        }
                    })
                })
            }else{
                ons.notification.alert({
                    title: 'エラー',
                    messageHTML: '削除する項目にチェックを入れてください。',
                    buttonLabel: 'OK'
                })
            }
        }
        $scope.cast_c_add = function(){
            let work = itmGet(Data)
            work.cast_c = []
            for(let i=0;i<$scope.cast_c.length;i++){
                for(let key in $scope.cast_c[i]){
                    if($scope.cast_c[i][key] != "" && key != "nam" && key != "$$hashKey"){
                        if(key == "min"){
                            work.cast_c.push({no:Data.time.ym,nam:$scope.cast_c[i].nam,itm:"給料マイナス",pri:$scope.cast_c[i][key]})
                        }else if(key == "set"){
                            work.cast_c.push({no:Data.time.ym,nam:$scope.cast_c[i].nam,itm:"ヘアセット",pri:$scope.cast_c[i][key]})
                        }else if(key == "ryo"){
                            work.cast_c.push({no:Data.time.ym,nam:$scope.cast_c[i].nam,itm:"寮",pri:$scope.cast_c[i][key]})
                        }else if(key == "ren"){
                            work.cast_c.push({no:Data.time.ym,nam:$scope.cast_c[i].nam,itm:"レンタル",pri:$scope.cast_c[i][key]})
                        }else if(key == "sou"){
                            work.cast_c.push({no:Data.time.ym,nam:$scope.cast_c[i].nam,itm:"送迎",pri:$scope.cast_c[i][key]})
                        }else if(key == "cle"){
                            work.cast_c.push({no:Data.time.ym,nam:$scope.cast_c[i].nam,itm:"クリーニング",pri:$scope.cast_c[i][key]})
                        }else if(key == "mei"){
                            work.cast_c.push({no:Data.time.ym,nam:$scope.cast_c[i].nam,itm:"名刺",pri:$scope.cast_c[i][key]})
                        }else if(key == "cp"){
                            work.cast_c.push({no:Data.time.ym,nam:$scope.cast_c[i].nam,itm:"キャンペーン",pri:$scope.cast_c[i][key]})
                        }
                    }
                }
            }
            work.flg = "0"
            myFactory.my_r("cast_c.php",work,"save").then(function(){
                ons.notification.alert({
                    message: '変更を完了しました。',
                    title: '確認',
                    buttonLabel: 'OK',
                    animation: 'default',
                    callback: function() {
                    }
                })
            })
        }
        /*
        $scope.cast_c_del = function(){
            
        }*/
    }])
    //no_t.html no_t.php
    .controller('no_t_Controller',['$scope','$resource','Data','$q','myFactory','$uibModal',function($scope,$resource,Data,$q,myFactory,$uibModal){
        let w = Data.login
        w.nam = Data.casts
        myFactory.my_get("no_t.php",w).then(function(no){
            no = my_split(no,"syo")
            no = my_split(no,"oku")
            for(let i=0;i<no.length;i++){
                for(let key in no[i]){
                    if(no[i][key] == null || no[i][key].length == "0"){
                        no[i][key] = 0
                    }else if(key == "sub_a" && no[i][key] != null){
                        no[i]['sub'] += no[i][key]
                    }else if(key == "id" && Data.op.op22 == "b"){
                        if(no[i][key].indexOf('main') != -1){
                            no.splice(i,1)
                            i--
                        }
                    }
                }
                no[i].sub = 0
                no[i].dou = 0
                no[i].new = 0
                no[i].cnt = 0
                for(let y=0;y<no[i].dat.length;y++){
                    if(no[i].dat[y].nam.split("･").length == 1 && no[i].dat[y].nam == w.nam[i]){
                        if(no[i].dat[y].sub != null){
                            no[i].sub += Number(no[i].dat[y].sub)
                        }
                        if(no[i].dat[y].dou != null){
                            no[i].dou += Number(no[i].dat[y].dou)
                        }
                        if(no[i].dat[y].new != null){
                            no[i].new += Number(no[i].dat[y].new)
                        }
                        if(no[i].dat[y].cnt != null){
                            no[i].cnt += Number(no[i].dat[y].cnt)
                        }
                    }else{
                        let nam_a = no[i].dat[y].nam.split("･")
                        for(let z=0;z<nam_a.length;z++){
                            if(nam_a[z] == w.nam[i]){
                                if(no[i].dat[y].sub != null){
                                    no[i].sub += Number(no[i].dat[y].sub / no[i].dat[y].many)
                                }
                                if(no[i].dat[y].dou != null){
                                    no[i].dou += Number(no[i].dat[y].dou)
                                }
                                if(no[i].dat[y].new != null){
                                    no[i].new += Number(no[i].dat[y].new)
                                }
                                if(no[i].dat[y].cnt != null){
                                    no[i].cnt += Number(no[i].dat[y].cnt)
                                }
                            }
                        }
                    }
                }
                /*
                if(no[i].many[0] != undefined && no[i].nam == w.nam[i]){
                    for(let y=0;y<no[i].many.length;y++){
                        no[i].sub -= Number(no[i].many[y].sub / no[i].many[y].many)
                    }
                }*/
            }
             
                //console.log(no)
            uri = ObjArraySort(no,"sub","desc")
            sim = ObjArraySort(no,"cnt","desc")
            sin = ObjArraySort(no,"new","desc")
            syo = ObjArraySort(no,"syo","desc")
            oku = ObjArraySort(no,"oku","desc")
            $scope.no_t = []//{uri:{},sim:{},syo:{},new:{},oku:{}}
            for(let i=0;i<no.length;i++){
                $scope.no_t[i] = {}
                $scope.no_t[i].uri = uri[i].nam + " ： " + uri[i].sub.toLocaleString();
                $scope.no_t[i].sim = sim[i].nam + " ： " + sim[i].cnt
                $scope.no_t[i].sin = sin[i].nam + " ： " + sin[i].new
                $scope.no_t[i].syo = syo[i].nam + " ： " + syo[i].syo
                $scope.no_t[i].oku = oku[i].nam + " ： " + oku[i].oku
            }
        })
    }])
    //salary_s.html salary_s.php
    .controller('salary_s_Controller',['$scope','$resource','Data','$q','myFactory','$uibModal',function($scope,$resource,Data,$q,myFactory,$uibModal){
        myFactory.my_get("salary_s.php",Data.login).then(function(sys){
            $scope.a = []
            $scope.b = []
            $scope.c = []
            $scope.d = []
            $scope.e = []
            for(let i=0;i<sys.length;i++){
                if(sys[i].id == "a"){
                    $scope.a.push(sys[i])
                }else if(sys[i].id == "b"){
                    $scope.b.push(sys[i])
                }else if(sys[i].id == "c"){
                    $scope.c.push(sys[i])
                }else if(sys[i].id == "d"){
                    $scope.d.push(sys[i])
                }else if(sys[i].id == "e"){
                    $scope.e.push(sys[i])
                }
            }
        })
        $scope.s_add = function(){
            $scope.s.flg = 0
            $scope.s.myid = Data.login.id
            $scope.s.db = Data.login.db
            $scope.s.pass = Data.login.pass
            $scope.s.y = Data.login.y
            $scope.s.ym = Data.login.ym
            $scope.s.ymd = Data.login.ymd
            myFactory.my_r("salary_s.php",$scope.s,"save").then(function(salary_s){
                $scope.s.min = ""
                $scope.s.max = ""
                $scope.s.pri = ""
                $scope.s.bac = ""
                myFactory.my_get("salary_s.php",Data.login).then(function(sys){
                    $scope.a = []
                    $scope.b = []
                    $scope.c = []
                    $scope.d = []
                    $scope.e = []
                    for(let i=0;i<sys.length;i++){
                        if(sys[i].id == "a"){
                            $scope.a.push(sys[i])
                        }else if(sys[i].id == "b"){
                            $scope.b.push(sys[i])
                        }else if(sys[i].id == "c"){
                            $scope.c.push(sys[i])
                        }else if(sys[i].id == "d"){
                            $scope.d.push(sys[i])
                        }else if(sys[i].id == "e"){
                            $scope.e.push(sys[i])
                        }
                    }
                })
            })
        }
        $scope.s_era = function(){
            $scope.s.min = ""
            $scope.s.max = ""
            $scope.s.pri = ""
            $scope.s.bac = ""
            $scope.type = "a"
        }
        $scope.h_s = function(s){
            ons.notification.confirm({
                message: '項目を削除してもよろしいですか？',
                title: '確認',
                buttonLabels: ['NO','YES'],
                animation: 'default',
                callback: function(itm) {
                    if(itm == 1){
                        s.flg = "1"
                        s.myid = Data.login.id
                        s.db = Data.login.db
                        s.pass = Data.login.pass
                        s.y = Data.login.y
                        s.ym = Data.login.ym
                        s.ymd = Data.login.ymd
                        myFactory.my_r("salary_s.php",s,"save").then(function(){
                            myFactory.my_get("salary_s.php",Data.login).then(function(sys){
                                $scope.a = []
                                $scope.b = []
                                $scope.c = []
                                $scope.d = []
                                $scope.e = []
                                for(let i=0;i<sys.length;i++){
                                    if(sys[i].id == "a"){
                                        $scope.a.push(sys[i])
                                    }else if(sys[i].id == "b"){
                                        $scope.b.push(sys[i])
                                    }else if(sys[i].id == "c"){
                                        $scope.c.push(sys[i])
                                    }else if(sys[i].id == "d"){
                                        $scope.d.push(sys[i])
                                    }else if(sys[i].id == "e"){
                                        $scope.e.push(sys[i])
                                    }
                                }
                            })
                        })
                    }
                }
            })
        }
    }])
    //dat_dil.html dat_dil.php
    .controller('dat_dil_Controller',['$scope','$resource','Data','$q','myFactory','$uibModal',function($scope,$resource,Data,$q,myFactory,$uibModal){
        //moment(Data.time.ymd,'YYYYMMDD').endOf('month').format("DD"))月日数
        /*myFactory.my_get("option.php").then(function(op){
            Data.op = op[0][0]
            Data.time = getTime(Data)*/
            //let w ={}
            $scope.dil = Data.login
            $scope.dil.m_days = moment(Data.login.ymd,'YYYYMMDD').endOf('month').format("DD")
            //myFactory.my_get("dat_dil.php",Data.time.ymd+(moment(Data.time.ymd,'YYYYMMDD').endOf('month').format("DD"))).then(function(dil){
            myFactory.my_get("dat_dil.php",$scope.dil).then(function(dil){
                $scope.pay_s_ym = pay_s_ymGet(Data.op.key,Data.login.ym)
                $scope.key = $scope.pay_s_ym[0]
                $scope.sum = {mai:0,car:0,cre:0,dp:0,jib:0,cos:0,sak:0,cp:0,hen:0,this:0,this_c:0,last:0,last_c:0,to:0}
                /*
                $scope.sum.mai = 0
                $scope.sum.car = 0
                $scope.sum.cre = 0
                $scope.sum.dp = 0
                $scope.sum.jib = 0
                $scope.sum.cos = 0
                $scope.sum.sak = 0
                $scope.sum.cp = 0
                $scope.sum.hen = 0
                $scope.sum.this = 0
                $scope.sum.this_c = 0
                $scope.sum.last = 0
                $scope.sum.last_c = 0
                $scope.sum.to = 0
                */
                for(let i in dil[0]){
                    for(let key in dil[0][i]){
                        if(dil[0][i][key] == null){
                           dil[0][i][key] = "" 
                        }
                    }
                    dil[0][i].to = dil[0][i].mai - Number(dil[0][i].car) - Number(dil[0][i].cos) - Number(dil[0][i].cp) - Number(dil[0][i].cre) - Number(dil[0][i].dp) + Number(dil[0][i].hen) - Number(dil[0][i].jib) - Number(dil[0][i].sak)
                    if(Data.op.op12 == "a"){
                        dil[0][i].to = Number(dil[0][i].to) + Number(dil[0][i].this) + Number(dil[0][i].this_c)
                    }
                    if(Data.op.op13 == "a"){
                        dil[0][i].to = Number(dil[0][i].to) + Number(dil[0][i].last) + Number(dil[0][i].last_c)
                    }
                    if(isNaN(Number(dil[0][i].mai)) != true){
                        $scope.sum.mai += Number(dil[0][i].mai)
                    }
                    if(isNaN(Number(dil[0][i].car)) != true){
                        $scope.sum.car += Number(dil[0][i].car)
                    }
                    if(isNaN(Number(dil[0][i].cre)) != true){
                        $scope.sum.cre += Number(dil[0][i].cre)
                    }
                    if(isNaN(Number(dil[0][i].dp)) != true){
                        $scope.sum.dp += Number(dil[0][i].dp)
                    }
                    if(isNaN(Number(dil[0][i].jib)) != true){
                        $scope.sum.jib += Number(dil[0][i].jib)
                    }
                    if(isNaN(Number(dil[0][i].cos)) != true){
                        $scope.sum.cos += Number(dil[0][i].cos)
                    }
                    if(isNaN(Number(dil[0][i].sak)) != true){
                        $scope.sum.sak += Number(dil[0][i].sak)
                    }
                    if(isNaN(Number(dil[0][i].cp)) != true){
                        $scope.sum.cp += Number(dil[0][i].cp)
                    }
                    if(isNaN(Number(dil[0][i].hen)) != true){
                        $scope.sum.hen += Number(dil[0][i].hen)
                    }
                    if(isNaN(Number(dil[0][i].this)) != true){
                        $scope.sum.this += Number(dil[0][i].this)
                    }
                    if(isNaN(Number(dil[0][i].this_c)) != true){
                        $scope.sum.this_c += Number(dil[0][i].this_c)
                    }
                    if(isNaN(Number(dil[0][i].last)) != true){
                        $scope.sum.last += Number(dil[0][i].last)
                    }
                    if(isNaN(Number(dil[0][i].last_c)) != true){
                        $scope.sum.last_c += Number(dil[0][i].last_c)
                    }
                    if(isNaN(Number(dil[0][i].to)) != true){
                        $scope.sum.to += Number(dil[0][i].to)
                    }
                }
                $scope.dils = dil[0]
            })
        //})
        $scope.dat_dil_show = function(){
            $scope.dil.ym = $scope.key
            $scope.dil.m_days = moment($scope.key,'YYYYMMDD').endOf('month').format("DD")
            myFactory.my_get("dat_dil.php",$scope.dil).then(function(dil){
                //$scope.pay_s_ym = pay_s_ymGet(Data.op.key,Data.time.ym)
                //$scope.key = $scope.pay_s_ym[0]
                $scope.sum = {mai:0,car:0,cre:0,dp:0,jib:0,cos:0,sak:0,cp:0,hen:0,this:0,this_c:0,last:0,last_c:0,to:0}
                /*{}
                $scope.sum.mai = 0
                $scope.sum.car = 0
                $scope.sum.cre = 0
                $scope.sum.dp = 0
                $scope.sum.jib = 0
                $scope.sum.cos = 0
                $scope.sum.sak = 0
                $scope.sum.cp = 0
                $scope.sum.hen = 0
                $scope.sum.this = 0
                $scope.sum.this_c = 0
                $scope.sum.last = 0
                $scope.sum.last_c = 0
                $scope.sum.to = 0
                */
                for(let i in dil[0]){
                    for(let key in dil[0][i]){
                        if(dil[0][i][key] == null){
                           dil[0][i][key] = "" 
                        }
                    }
                    dil[0][i].to = dil[0][i].mai - Number(dil[0][i].car) - Number(dil[0][i].cos) - Number(dil[0][i].cp) - Number(dil[0][i].cre) - Number(dil[0][i].dp) + Number(dil[0][i].hen) - Number(dil[0][i].jib) - Number(dil[0][i].sak)
                    if(Data.op.op12 == "a"){
                        dil[0][i].to = Number(dil[0][i].to) + Number(dil[0][i].this) + Number(dil[0][i].this_c)
                    }
                    if(Data.op.op13 == "a"){
                        dil[0][i].to = Number(dil[0][i].to) + Number(dil[0][i].last) + Number(dil[0][i].last_c)
                    }
                    if(isNaN(Number(dil[0][i].mai)) != true){
                        $scope.sum.mai += Number(dil[0][i].mai)
                    }
                    if(isNaN(Number(dil[0][i].car)) != true){
                        $scope.sum.car += Number(dil[0][i].car)
                    }
                    if(isNaN(Number(dil[0][i].cre)) != true){
                        $scope.sum.cre += Number(dil[0][i].cre)
                    }
                    if(isNaN(Number(dil[0][i].dp)) != true){
                        $scope.sum.dp += Number(dil[0][i].dp)
                    }
                    if(isNaN(Number(dil[0][i].jib)) != true){
                        $scope.sum.jib += Number(dil[0][i].jib)
                    }
                    if(isNaN(Number(dil[0][i].cos)) != true){
                        $scope.sum.cos += Number(dil[0][i].cos)
                    }
                    if(isNaN(Number(dil[0][i].sak)) != true){
                        $scope.sum.sak += Number(dil[0][i].sak)
                    }
                    if(isNaN(Number(dil[0][i].cp)) != true){
                        $scope.sum.cp += Number(dil[0][i].cp)
                    }
                    if(isNaN(Number(dil[0][i].hen)) != true){
                        $scope.sum.hen += Number(dil[0][i].hen)
                    }
                    if(isNaN(Number(dil[0][i].this)) != true){
                        $scope.sum.this += Number(dil[0][i].this)
                    }
                    if(isNaN(Number(dil[0][i].this_c)) != true){
                        $scope.sum.this_c += Number(dil[0][i].this_c)
                    }
                    if(isNaN(Number(dil[0][i].last)) != true){
                        $scope.sum.last += Number(dil[0][i].last)
                    }
                    if(isNaN(Number(dil[0][i].last_c)) != true){
                        $scope.sum.last_c += Number(dil[0][i].last_c)
                    }
                    if(isNaN(Number(dil[0][i].to)) != true){
                        $scope.sum.to += Number(dil[0][i].to)
                    }
                }
                $scope.dils = dil[0]
            })
        }
    }])
    //cre.html cre.php
    .controller('cre_Controller',['$scope','$resource','Data','$q','myFactory','$uibModal',function($scope,$resource,Data,$q,myFactory,$uibModal){
        myFactory.my_get("cre.php").then(function(cres){
            if(Data.login.rank != -1){
                $scope.casts = Data.casts
                $scope.r_cre = {}
                $scope.r_cre.nam = $scope.casts[0]
                $scope.show = true
            }else{
                $scope.r_cre = {}
                $scope.r_cre.nam = Data.login.name
                $scope.show = false
            }
            $scope.cres = cres[0]
            myFactory.my_get("pay.php").then(function(pays){
                $scope.pays = pays[0]
                $scope.mycre = addAry(creSum(creGet(angular.copy($scope.cres),$scope.r_cre.nam,$scope.r_cre.gue,Data),"all"),paySum(payGet(angular.copy($scope.pays),$scope.r_cre.nam,$scope.r_cre.gue,Data),"all"))
                $scope.sum = {}
                $scope.sum.cre = 0
                $scope.sum.pay = 0
                for(let i=0;i<$scope.mycre.length;i++){
                    $scope.sum.cre += $scope.mycre[i].cre
                    if($scope.mycre[i].pay != undefined){
                        $scope.sum.pay += $scope.mycre[i].pay
                    }
                }
                $scope.switch = {}
                $scope.switch._0 = true
                $scope.switch._1 = true
                $scope.switch._2 = true
            })
            $scope.my_years = []
            if(String(Data.op.key).substr(0,4) == Data.login.y){
                $scope.my_years[0] = Number(Data.login.y)
                $scope.my_year = Number(Data.login.y)
            }else{
                for(let i=Number(String(Data.op.key).substr(0,4)),y=0;i<Data.login.y;i++,y++){
                    $scope.my_years[y] = i
                }
                $scope.my_years.push(Number(Data.login.y))
                $scope.my_year = Number(Data.login.y)
                
            }
         })
        $scope.cre_show = function(){
            $scope.switch._0 = true
            $scope.switch._1 = true
            $scope.switch._2 = true
            $scope.mycre = addAry(creSum(creGet(angular.copy($scope.cres),$scope.r_cre.nam,$scope.r_cre.gue,Data),"all"),paySum(payGet(angular.copy($scope.pays),$scope.r_cre.nam,$scope.r_cre.gue,Data),"all"))
            $scope.sum.cre = 0
            $scope.sum.pay = 0
            for(let i=0;i<$scope.mycre.length;i++){
                $scope.sum.cre += $scope.mycre[i].cre
                if($scope.mycre[i].pay != undefined){
                    $scope.sum.pay += $scope.mycre[i].pay
                }
            }
        }
        $scope.cre_show_this = function(){
            $scope.switch._0 = true
            $scope.switch._1 = true
            $scope.switch._2 = true
            $scope.mycre = addAry(creSum(creGet(angular.copy($scope.cres),$scope.r_cre.nam,$scope.r_cre.gue,Data),"this",Data),paySum(payGet(angular.copy($scope.pays),$scope.r_cre.nam,$scope.r_cre.gue,Data),"this",Data))
        }
        $scope.cre_show_last = function(){
            $scope.switch._0 = true
            $scope.switch._1 = true
            $scope.switch._2 = true
            $scope.mycre = addAry(creSum(creGet(angular.copy($scope.cres),$scope.r_cre.nam,$scope.r_cre.gue,Data),"last",Data),paySum(payGet(angular.copy($scope.pays),$scope.r_cre.nam,$scope.r_cre.gue,Data),"last",Data))
        }
        $scope.cre_syo = function(){
            $scope.switch._0 = false
            $scope.switch._1 = true
            $scope.switch._2 = false
            $scope.mycre = creGet(angular.copy($scope.cres),$scope.r_cre.nam,$scope.r_cre.gue,Data)
        }
        $scope.pay_syo = function(){
            $scope.switch._0 = false
            $scope.switch._1 = false
            $scope.switch._2 = true
            $scope.mycre = payGet(angular.copy($scope.pays),$scope.r_cre.nam,$scope.r_cre.gue,Data)
            $scope.sum.pay = 0
            for(let i=0;$scope.mycre.length;i++){
                $scope.sum.pay += $scope.mycre[i].pay
            }
        }
        $scope.pay_add = function(){
            var modalInstance = $uibModal.open({
                backdrop: 'false',
                templateUrl: 'pay.html',
                controller: 'pay_Controller',
                backdrop : 'static',
                scope: $scope,
                size: 'sm'
            })
            //callback
            modalInstance.result.then(
                function(result){
                         myFactory.my_get("cre.php").then(function(cres){
                            $scope.cres = cres[0]
                            myFactory.my_get("pay.php").then(function(pays){
                                $scope.pays = pays[0]
                                $scope.mycre = addAry(creSum(creGet(angular.copy($scope.cres),$scope.r_cre.nam,$scope.r_cre.gue,Data),"all"),paySum(payGet(angular.copy($scope.pays),$scope.r_cre.nam,$scope.r_cre.gue,Data),"all"))
                                $scope.sum = {}
                                $scope.sum.cre = 0
                                $scope.sum.pay = 0
                                for(let i=0;i<$scope.mycre.length;i++){
                                    $scope.sum.cre += $scope.mycre[i].cre
                                    if($scope.mycre[i].pay != undefined){
                                        $scope.sum.pay += $scope.mycre[i].pay
                                    }
                                }
                                $scope.switch = {}
                                $scope.switch._0 = true
                                $scope.switch._1 = true
                                $scope.switch._2 = true
                            })
                            $scope.my_years = []
                            if(String(Data.op.key).substr(0,4) == Data.login.y){
                                $scope.my_years[0] = Number(Data.login.y)
                                $scope.my_year = Number(Data.login.y)
                            }else{
                                for(let i=Number(String(Data.op.key).substr(0,4)),y=0;i<Data.login.y;i++,y++){
                                    $scope.my_years[y] = i
                                }
                                $scope.my_years.push(Number(Data.login.y))
                                $scope.my_year = Number(Data.login.y)
                                
                            }
                         })
                     //})
                 //})
                },
                function(result){
                    
                }
            )
        }
     }])
     //pay.html pay.php
    .controller('pay_Controller', ['$scope','$uibModalInstance','Data','myFactory','$resource',function($scope,$uibModalInstance,Data,myFactory,$resource){
        myFactory.my_get("pay.php","1").then(function(pays){
            for(let i=0;i<pays.length;i++){
                if(pays[i].car == "0"){
                    pays[i].car = false
                }else{
                    pays[i].car = true
                }
                if(pays[i].flg == "0"){
                    pays[i].flg = false
                }else{
                    pays[i].flg = true
                }
            }
            $scope.pays = pays
            $scope.pay.m = 1
        })
        $scope.payadd = function(){
            $scope.pay.nam = $scope.r_cre.nam
            if($scope.pay.ymd == ""){
                $scope.pay.y = Number(Data.login.y)
                $scope.pay.ym = Number(Data.login.ym)
                $scope.pay.ymd = Number(Data.login.ymd)
            }else if(String($scope.pay.ymd).length == "8"){
                $scope.pay.y = Number(String($scope.pay.ymd).substr(0,4))
                $scope.pay.ym = Number(String($scope.pay.ymd).substr(0,6))
            }else{
                ons.notification.alert({
                    title: 'エラー',
                    messageHTML: '日付を正確に入力してください。',
                    buttonLabel: 'OK'
                })
                return
            }
            if($scope.pay.gue != "" && $scope.pay.pri != ""){
                $scope.pay.myflg = "0"
                if($scope.pay.car == false){
                    $scope.pay.car = "0"
                }else{
                    $scope.pay.car = "1"
                }
                $scope.pay.db = Data.login.db
                $scope.pay.id = Data.login.id
                $scope.pay.pass = Data.login.pass
                myFactory.my_r("pay.php",$scope.pay,"save").then(function(){
                    $scope.pay.ymd = ""
                    $scope.pay.gue = ""
                    $scope.pay.pri = ""
                    $scope.pay.car = false
                    myFactory.my_get("pay.php","1").then(function(pays){
                        for(let i=0;i<pays.length;i++){
                            if(pays[i].flg == "0"){
                                pays[i].flg = false
                            }else{
                                pays[i].flg = true
                            }
                            if(pays[i].car == "0"){
                                pays[i].car = false
                            }else{
                                pays[i].car = true
                            }
                        }
                        $scope.pays = pays
                    })
                })
            }else{
                ons.notification.alert({
                    title: 'エラー',
                    messageHTML: '入力に誤りがあります。',
                    buttonLabel: 'OK'
                })
                return
            }
        }
        $scope.paycls = function(){
            $uibModalInstance.close();
        }
        $scope.p_hold = function(pay){
            ons.notification.confirm({
                message: '項目を削除してもよろしいですか？',
                title: '確認',
                buttonLabels: ['NO','YES'],
                animation: 'default',
                callback: function(itm) {
                    if(itm == 1){
                        if(pay.car == true){
                            pay.car = "1"
                        }else{
                            pay.car = "0"
                        }
                        if(pay.flg == true){
                            pay.flg = "1"
                        }else{
                            pay.flg = "0"
                        }
                        pay.y = Data.login.y
                        pay.ym = Data.login.ym
                        pay.ymd = Data.login.ymd
                        pay.myflg = "1"
                        pay.db = Data.login.db
                        pay.id = Data.login.id
                        pay.pass = Data.login.pass
                        myFactory.my_r("pay.php",pay,"save").then(function(){
                            myFactory.my_get("pay.php","1").then(function(pays){
                                
                                $scope.pays = pays
                            })
                        })
                    }
                }
            })
        }
    }])
    //dat_sou.html dat_sou.php
    .controller('dat_sou_Controller',['$scope','$resource','Data','$q','myFactory','$uibModal',function($scope,$resource,Data,$q,myFactory,$uibModal){
        myFactory.my_get("dat_sou.php",Data.login).then(function(itms){
            $scope.datepicker = Data.datepicker
            $scope.datepicker.time = getTime(Data,"1",undefined)
            $scope.dat_sou = Data.op_itm
            for(let i=0;i<$scope.dat_sou.length;i++){
                if($scope.dat_sou[i].itm == "カード"){
                    $scope.dat_sou[i].pri = itms[0].car
                }else if($scope.dat_sou[i].itm == "掛け"){
                    $scope.dat_sou[i].pri = itms[0].cre
                }else if($scope.dat_sou[i].itm == "日払い"){
                    let w = 0
                    for(let i=0;i<itms[0].dp.length;i++){
                        if(itms[0].dp[i].id == "0"){
                            w += Number(itms[0].dp[i].pri)
                        }else if(itms[0].dp[i].id == "1" && Data.op.op14 == "a"){
                            w += Number(itms[0].dp[i].pri)
                        }else if(itms[0].dp[i].id == "2" && Data.op.op15 == "a"){
                            w += Number(itms[0].dp[i].pri)
                        }else if(itms[0].dp[i].id == "3" && Data.op.op16 == "a"){
                            w += Number(itms[0].dp[i].pri)
                        }else if(itms[0].dp[i].id == "4" && Data.op.op17 == "a"){
                            w += Number(itms[0].dp[i].pri)
                        }else if(itms[0].dp[i].id == "5" && Data.op.op18 == "a"){
                            w += Number(itms[0].dp[i].pri)
                        }else if(itms[0].dp[i].id == "6" && Data.op.op19 == "a"){
                            w += Number(itms[0].dp[i].pri)
                        }else if(itms[0].dp[i].id == "7" && Data.op.op20 == "a"){
                            w += Number(itms[0].dp[i].pri)
                        }
                    }
                    $scope.dat_sou[i].pri = w
                }else if($scope.dat_sou[i].itm == "経費"){
                    $scope.dat_sou[i].pri = itms[0].cos
                }else if($scope.dat_sou[i].itm == "総合売上"){
                    $scope.dat_sou[i].pri = itms[0].mai
                    if(itms[0].car != null && Data.op.op11 == "a"){
                        $scope.dat_sou[i].pri += getCard2(itms[0].car,Data)
                    }
                }else if($scope.dat_sou[i].itm == "自腹"){
                    $scope.dat_sou[i].pri = itms[0].jib
                }else if($scope.dat_sou[i].itm == "酒代"){
                    $scope.dat_sou[i].pri = itms[0].sak
                }else if($scope.dat_sou[i].itm == "キャンペーン"){
                    $scope.dat_sou[i].pri = itms[0].cp
                }else if($scope.dat_sou[i].itm == "返金"){
                    $scope.dat_sou[i].pri = itms[0].hen
                }else if($scope.dat_sou[i].itm == "今月入金"){
                    $scope.dat_sou[i].pri = itms[0].this
                }else if($scope.dat_sou[i].itm == "今月カード"){
                    $scope.dat_sou[i].pri = itms[0].this_c
                }else if($scope.dat_sou[i].itm == "先月入金"){
                    $scope.dat_sou[i].pri = itms[0].last
                }else if($scope.dat_sou[i].itm == "先月カード"){
                    $scope.dat_sou[i].pri = itms[0].last_c
                }/*else if($scope.dat_sou[i].itm == "持ち帰り"){
                    $scope.dat_sou[i].pri = 0
                    for(let key in itms[0]){
                        if([key] == "mai" || [key] == "hen"){
                            $scope.dat_sou[i].pri += itms[0][key]
                        }else if(isNaN(itms[0][key]) == false && itms[0][key] != null){
                            $scope.dat_sou[i].pri -= itms[0][key]
                        }
                    }
                }*/
            }
            let sum = 0
            let flg = 0
            for(let i=0;i<$scope.dat_sou.length;i++){
                if($scope.dat_sou[i].itm != "持ち帰り" && $scope.dat_sou[i].itm != "総合売上" && $scope.dat_sou[i].itm != "返金" && $scope.dat_sou[i].itm != "今月入金" && $scope.dat_sou[i].itm != "今月カード" && $scope.dat_sou[i].itm != "先月入金" && $scope.dat_sou[i].itm != "先月カード" && $scope.dat_sou[i].pri != null){
                    sum -= Number($scope.dat_sou[i].pri)
                }else if($scope.dat_sou[i].itm == "総合売上" || $scope.dat_sou[i].itm == "返金" && $scope.dat_sou[i].pri != null){
                    sum += Number($scope.dat_sou[i].pri)
                }else if($scope.dat_sou[i].itm == "今月入金" || $scope.dat_sou[i].itm == "今月カード" || $scope.dat_sou[i].itm == "先月入金" || $scope.dat_sou[i].itm == "先月カード"){
                    //op12:今月,op13:先月
                    if($scope.dat_sou[i].itm == "今月入金" && Data.op.op12 == "a" || $scope.dat_sou[i].itm == "今月カード" && Data.op.op12 == "a"){
                        sum += Number($scope.dat_sou[i].pri)
                    }else if($scope.dat_sou[i].itm == "先月入金" && Data.op.op13 == "a" || $scope.dat_sou[i].itm == "先月カード" && Data.op.op13 == "a"){
                        sum += Number($scope.dat_sou[i].pri)
                    }
                }else if($scope.dat_sou[i].itm == "持ち帰り"){
                    flg = i
                }
            }
            if(Data.op.op11 == "b"){//カード手数料
                $scope.dat_sou[flg].pri = sum + getCard2(itms[0].car,Data)
            }else{
                $scope.dat_sou[flg].pri = sum
            }
        })
        $scope.toggleDatePicker = function($event) {//datepicker_toggle
            // これが重要！！！
            $event.stopPropagation();
            $scope.datepicker.open = !$scope.datepicker.open;
        };
        $scope.hold = function(itm){
            if(itm == '経費'){
                var modalInstance = $uibModal.open({
                    backdrop: 'false',
                    windowClass : 'all_t',
                    templateUrl: 'cost.html',
                    controller: 'cost_Controller',
                    backdrop : 'static',//背景クリックで閉じない
                    scope: $scope,
                    size: 'sm'
                })
                //callback
                modalInstance.result.then(
                    function(result){
                        for(let i=0;i<$scope.dat_sou.length;i++){
                            if($scope.dat_sou[i].itm == "経費"){
                                $scope.dat_sou[i].pri = result
                            }
                        }
                    },
                    function(result){
                        
                    }
                )
            }else if(itm == '酒代'){
                ons.notification.confirm({
                messageHTML: '<input type="text" id="sak" placeholder="酒代">',
                title: '入力',
                buttonLabels: ['CAN','OK'],
                cancelable: true,
                callback: function(itm) {
                    let sak = {}
                    if($scope.r == undefined){
                        sak = Data.login
                    }else{
                        sak = $scope.r
                    }
                    if(itm == 1){
                        sak.pri = document.getElementById('sak').value
                        if(String(sak.pri).indexOf('+') != -1){
                            sak.pri = sak.pri.split('+').map(function (element) { return Number(element); }).reduce(function(x, y) { return x + y; })
                       }else{
                            sak.pri = Number(sak.pri)
                       }
                       if(isNaN(sak.pri) == true){
                           ons.notification.alert({
                                message: '入力に誤りがあります。',
                                title: 'エラー',
                                buttonLabel: 'OK',
                                animation: 'default'
                            })
                       }else if(sak.pri == 0){
                           ons.notification.alert({
                                message: '入力値が「 0 」です。',
                                title: 'エラー',
                                buttonLabel: 'OK',
                                animation: 'default'
                            })
                       }else{
                           myFactory.my_r("sak.php",sak,"save").then(function(){
                                myFactory.my_get("sak.php",sak).then(function(sak){
                                    for(let i=0;i<$scope.dat_sou.length;i++){
                                       if($scope.dat_sou[i].itm == "酒代"){
                                          $scope.dat_sou[i].pri = sak[0].pri 
                                           return
                                       }
                                    }
                                })
                           })
                        }
                    }
                }})
            }else if(itm == '日払い'){
                var modalInstance = $uibModal.open({
                    backdrop: 'false',
                    templateUrl: 'dp.html',
                    controller: 'dp_Controller',
                    scope: $scope,
                    size: 'sm'
                })
                //callback
                modalInstance.result.then(
                    function(dp){
                        let w = 0
                        let t= 0
                        for(let i=0;i<dp.length;i++){
                            if(dp[i].id == "0"){
                                w += Number(dp[i].pri)
                            }else if(dp[i].id == "1" && Data.op.op14 == "a"){
                                w += Number(dp[i].pri)
                            }else if(dp[i].id == "2" && Data.op.op15 == "a"){
                                w += Number(dp[i].pri)
                            }else if(dp[i].id == "3" && Data.op.op16 == "a"){
                                w += Number(dp[i].pri)
                            }else if(dp[i].id == "4" && Data.op.op17 == "a"){
                                w += Number(dp[i].pri)
                            }else if(dp[i].id == "5" && Data.op.op18 == "a"){
                                w += Number(dp[i].pri)
                            }else if(dp[i].id == "6" && Data.op.op19 == "a"){
                                w += Number(dp[i].pri)
                            }else if(dp[i].id == "7" && Data.op.op20 == "a"){
                                w += Number(dp[i].pri)
                            }else if(dp[i].id == "8" && Data.op.op20 == "a"){
                                t += Number(dp[i].pri)
                            }
                        }
                        for(let i=0;i<$scope.dat_sou.length;i++){
                            if($scope.dat_sou[i].itm == "日払い"){
                                $scope.dat_sou[i].pri = w
                            }else if($scope.dat_sou[i].itm == "キャンペーン"){
                                $scope.dat_sou[i].pri = t
                            }
                        }
                    },
                    function(result){
                        
                    }
                )
            }else if(itm == 'キャンペーン'){
                var modalInstance = $uibModal.open({
                    backdrop: 'false',
                    templateUrl: 'dp.html',
                    controller: 'dp_Controller',
                    backdrop : 'static',
                    scope: $scope,
                    size: 'sm'
                })
                //callback
                modalInstance.result.then(
                    function(dp){
                        let w = 0
                        let t= 0
                        for(let i=0;i<dp.length;i++){
                            if(dp[i].id == "0"){
                                w += Number(dp[i].pri)
                            }else if(dp[i].id == "1" && Data.op.op14 == "a"){
                                w += Number(dp[i].pri)
                            }else if(dp[i].id == "2" && Data.op.op15 == "a"){
                                w += Number(dp[i].pri)
                            }else if(dp[i].id == "3" && Data.op.op16 == "a"){
                                w += Number(dp[i].pri)
                            }else if(dp[i].id == "4" && Data.op.op17 == "a"){
                                w += Number(dp[i].pri)
                            }else if(dp[i].id == "5" && Data.op.op18 == "a"){
                                w += Number(dp[i].pri)
                            }else if(dp[i].id == "6" && Data.op.op19 == "a"){
                                w += Number(dp[i].pri)
                            }else if(dp[i].id == "7" && Data.op.op20 == "a"){
                                w += Number(dp[i].pri)
                            }else if(dp[i].id == "8" && Data.op.op20 == "a"){
                                t += Number(dp[i].pri)
                            }
                        }
                        for(let i=0;i<$scope.dat_sou.length;i++){
                            if($scope.dat_sou[i].itm == "日払い"){
                                $scope.dat_sou[i].pri = w
                            }else if($scope.dat_sou[i].itm == "キャンペーン"){
                                $scope.dat_sou[i].pri = t
                            }
                        }
                    },
                    function(result){
                        
                    }
                )
            }else if(itm == '返金'){
            let hen = {}
            if($scope.r == undefined){
                hen = Data.login
            }else{
                hen = $scope.r
            }
                ons.notification.confirm({
                messageHTML: '<input type="text" id="hen" placeholder="金額">',
                title: '入力',
                buttonLabels: ['CAN','OK'],
                cancelable: true,
                callback: function(myflg) {
                    if(myflg == 1){
                        hen.pri = document.getElementById('hen').value
                        if(String(hen.pri).indexOf('+') != -1){
                            hen.pri = hen.pri.split('+').map(function (element) { return Number(element); }).reduce(function(x, y) { return x + y; })
                       }else{
                            hen.pri = Number(hen.pri)
                       }
                       if(isNaN(hen.pri) == true){
                           ons.notification.alert({
                                message: '入力に誤りがあります。',
                                title: 'エラー',
                                buttonLabel: 'OK',
                                animation: 'default'
                            })
                       }else if(hen.pri == 0){
                           ons.notification.alert({
                                message: '入力値が「 0 」です。',
                                title: 'エラー',
                                buttonLabel: 'OK',
                                animation: 'default'
                            })
                       }else{
                           myFactory.my_r("hen.php",hen,"save").then(function(){
                               myFactory.my_get("hen.php",hen).then(function(hen){
                                   for(let i=0;i<$scope.dat_sou.length;i++){
                                       if($scope.dat_sou[i].itm == "返金"){
                                          $scope.dat_sou[i].pri = hen[0].pri 
                                           return
                                       }
                                   }
                               })
                           })
                        }
                    }
                }})
            }
        }
        $scope.show_this_dat_sou = function(){
            $scope.r = getTime(undefined,undefined,$scope.datepicker.time)
            $scope.r.db = Data.login.db
            $scope.r.id = Data.login.id
            $scope.r.pass = Data.login.pass
            myFactory.my_get("dat_sou.php",$scope.r).then(function(itms){
                for(let i=0;i<$scope.dat_sou.length;i++){
                    if($scope.dat_sou[i].itm == "カード"){
                        $scope.dat_sou[i].pri = itms[0].car
                    }else if($scope.dat_sou[i].itm == "掛け"){
                        $scope.dat_sou[i].pri = itms[0].cre
                    }else if($scope.dat_sou[i].itm == "日払い"){
                        let w = 0
                        for(let i=0;i<itms[0].dp.length;i++){
                            if(itms[0].dp[i].id == "0"){
                                w += Number(itms[0].dp[i].pri)
                            }else if(itms[0].dp[i].id == "1" && Data.op.op14 == "a"){
                                w += Number(itms[0].dp[i].pri)
                            }else if(itms[0].dp[i].id == "2" && Data.op.op15 == "a"){
                                w += Number(itms[0].dp[i].pri)
                            }else if(itms[0].dp[i].id == "3" && Data.op.op16 == "a"){
                                w += Number(itms[0].dp[i].pri)
                            }else if(itms[0].dp[i].id == "4" && Data.op.op17 == "a"){
                                w += Number(itms[0].dp[i].pri)
                            }else if(itms[0].dp[i].id == "5" && Data.op.op18 == "a"){
                                w += Number(itms[0].dp[i].pri)
                            }else if(itms[0].dp[i].id == "6" && Data.op.op19 == "a"){
                                w += Number(itms[0].dp[i].pri)
                            }else if(itms[0].dp[i].id == "7" && Data.op.op20 == "a"){
                                w += Number(itms[0].dp[i].pri)
                            }
                        }
                        $scope.dat_sou[i].pri = w
                    }else if($scope.dat_sou[i].itm == "経費"){
                        $scope.dat_sou[i].pri = itms[0].cos
                    }else if($scope.dat_sou[i].itm == "総合売上"){
                        $scope.dat_sou[i].pri = itms[0].mai
                    }else if($scope.dat_sou[i].itm == "自腹"){
                        $scope.dat_sou[i].pri = itms[0].jib
                    }else if($scope.dat_sou[i].itm == "酒代"){
                        $scope.dat_sou[i].pri = itms[0].sak
                    }else if($scope.dat_sou[i].itm == "キャンペーン"){
                        $scope.dat_sou[i].pri = itms[0].cp
                    }else if($scope.dat_sou[i].itm == "返金"){
                        $scope.dat_sou[i].pri = itms[0].hen
                    }else if($scope.dat_sou[i].itm == "入金"){
                        $scope.dat_sou[i].pri = itms[0].pay
                    }/*else if($scope.dat_sou[i].itm == "持ち帰り"){
                        $scope.dat_sou[i].pri = 0
                        for(let key in itms[0]){
                            if([key] == "mai" || [key] == "hen"){
                                $scope.dat_sou[i].pri += itms[0][key]
                            }else if(isNaN(itms[0][key]) == false && itms[0][key] != null){
                                $scope.dat_sou[i].pri -= itms[0][key]
                            }
                        }
                    }*/
                    let sum = 0
                    let flg = 0
                    for(let i=0;i<$scope.dat_sou.length;i++){
                        if($scope.dat_sou[i].itm != "持ち帰り" && $scope.dat_sou[i].itm != "総合売上" && $scope.dat_sou[i].itm != "返金" && $scope.dat_sou[i].itm != "今月入金" && $scope.dat_sou[i].itm != "今月カード" && $scope.dat_sou[i].itm != "先月入金" && $scope.dat_sou[i].itm != "先月カード" && $scope.dat_sou[i].pri != null){
                            sum -= Number($scope.dat_sou[i].pri)
                        }else if($scope.dat_sou[i].itm == "総合売上" || $scope.dat_sou[i].itm == "返金" && $scope.dat_sou[i].pri != null){
                            sum += Number($scope.dat_sou[i].pri)
                        }else if($scope.dat_sou[i].itm == "今月入金" || $scope.dat_sou[i].itm == "今月カード" || $scope.dat_sou[i].itm == "先月入金" || $scope.dat_sou[i].itm == "先月カード"){
                            //op12:今月,op13:先月
                            if($scope.dat_sou[i].itm == "今月入金" && Data.op.op12 == "a" || $scope.dat_sou[i].itm == "今月カード" && Data.op.op12 == "a"){
                                sum += Number($scope.dat_sou[i].pri)
                            }else if($scope.dat_sou[i].itm == "先月入金" && Data.op.op13 == "a" || $scope.dat_sou[i].itm == "先月カード" && Data.op.op13 == "a"){
                                sum += Number($scope.dat_sou[i].pri)
                            }
                        }else if($scope.dat_sou[i].itm == "持ち帰り"){
                            flg = i
                        }
                    }
                    if(Data.op.op11 == "b"){//カード手数料
                        $scope.dat_sou[flg].pri = sum + getCard2(itms[0].car,Data)
                    }else{
                        $scope.dat_sou[flg].pri = sum
                    }
                }
            })
        }
    }])
    
    //CPダイアログ
    .controller('cp_Controller', ['$scope','$uibModalInstance','Data','myFactory','$resource',function($scope,$uibModalInstance,Data,myFactory,$resource){
        let work
        if($scope.r == undefined){
            work = Data.login
        }else{
            work = $scope.r
        }
        $scope.cp = []
        myFactory.my_get("cp.php",work).then(function(itms){
            for(let i=0;i<Data.casts.length;i++){
                $scope.cp[i] = {nam:Data.casts[i],pri:""}
            }
            for(let i=0;i<itms.length;i++){
                $scope.cp[itms[i].no.substr(9)].sum = itms[i].pri
            }
        })
        
        $scope.cpadd = function(){
            //let work = itmGet(Data)
            work.cp = []
            for(let i=0;i<$scope.cp.length;i++){
                if($scope.cp[i].pri != ""){
                    work.cp.push({no:work.ymd+"_"+i,nam:$scope.cp[i].nam,pri:$scope.cp[i].pri})
                }
            }
            if(work.cp.length != 0){
                work.flg = "0"
                myFactory.my_r("cp.php",work,"save").then(function(itm){
                    for(let i=0;i<$scope.cp.length;i++){
                        $scope.cp[i].pri = ""
                        $scope.cp[i].sum = ""
                    }
                    myFactory.my_get("cp.php",Data.login).then(function(itms){
                        for(let i=0;i<itms.length;i++){
                            $scope.cp[itms[i].no.substr(9)].sum = itms[i].pri
                        }
                    })
                })
            }else{
                myAlert("エラー","入力項目がありません。","OK")
            }
            
        }
        $scope.cpdel = function(){
            //let w = itmGet(Data)
            work.flg = "1"
            work.cp = []
            for(let i=0;i<$scope.cp.length;i++){
                if($scope.cp[i].chk == true){
                    work.cp.push($scope.cp[i].nam)
                }
            }
            myFactory.my_r("cp.php",work,"save").then(function(){
                myFactory.my_get("cp.php",work).then(function(itms){
                    for(let i=0;i<Data.casts.length;i++){
                        $scope.cp[i] = {nam:Data.casts[i],pri:""}
                    }
                    for(let i=0;i<itms.length;i++){
                        $scope.cp[itms[i].no.substr(9)].sum = itms[i].pri
                    }
                })
            })
            /*
            for(let i=0;i<$scope.cp.length;i++){
                $scope.cp[i].pri = ""    
            }*/
        }
        $scope.cpcls = function(){
            let w = 0
            for(let i=0;i<$scope.cp.length;i++){
                if($scope.cp[i].sum != undefined){
                    w += Number($scope.cp[i].sum)
                }
            }
            $uibModalInstance.close(w);
        }
    }])
    //日払いダイアログ
    .controller('dp_Controller', ['$scope','$uibModalInstance','Data','myFactory','$resource',function($scope,$uibModalInstance,Data,myFactory,$resource){
        let work = {dp:[]}
        $scope.dp = []
        if($scope.r == undefined){
            work = Object.assign(work,Data.login)
        }else{
            work = Object.assign(work,$scope.r)
        }
        myFactory.my_get("dp.php",work).then(function(itms){
            for(let i=0;i<Data.casts.length;i++){
                $scope.dp[i] = {nam:Data.casts[i],dp:"",set:"",ren:"",sou:"",ryo:"",cle:"",mei:"",etc:"",cp:""}
            }
            for(let i=0;i<itms.length;i++){
                for(let y=0;y<$scope.dp.length;y++){
                    if($scope.dp[y].nam == itms[i].nam){
                       if(itms[i].id == "0"){
                           $scope.dp[y].dp = itms[i].pri
                       }else if(itms[i].id == "1"){
                           $scope.dp[y].set = itms[i].pri
                       }else if(itms[i].id == "2"){
                           $scope.dp[y].ren = itms[i].pri
                       }else if(itms[i].id == "3"){
                           $scope.dp[y].sou = itms[i].pri
                       }else if(itms[i].id == "4"){
                           $scope.dp[y].ryo = itms[i].pri
                       }else if(itms[i].id == "5"){
                           $scope.dp[y].cle = itms[i].pri
                       }else if(itms[i].id == "6"){
                           $scope.dp[y].mei = itms[i].pri
                       }else if(itms[i].id == "7"){
                           $scope.dp[y].etc = itms[i].pri
                       }else if(itms[i].id == "8"){
                           $scope.dp[y].cp = itms[i].pri
                       }
                    }
                }
            }
        })
            //})
        
        $scope.dpadd = function(){
            for(let i=0;i<$scope.dp.length;i++){
                if($scope.dp[i].dp != "" && $scope.dp[i].dp != undefined){
                    work.dp.push({no:work.ymd,nam:$scope.dp[i].nam,id:"0",pri:$scope.dp[i].dp})
                }
                if($scope.dp[i].set != "" && $scope.dp[i].set != undefined){
                    work.dp.push({no:work.ymd,nam:$scope.dp[i].nam,id:"1",pri:$scope.dp[i].set})
                }
                if($scope.dp[i].ren != "" && $scope.dp[i].ren != undefined){
                    work.dp.push({no:work.ymd,nam:$scope.dp[i].nam,id:"2",pri:$scope.dp[i].ren})
                }
                if($scope.dp[i].sou != "" && $scope.dp[i].sou != undefined){
                    work.dp.push({no:work.ymd,nam:$scope.dp[i].nam,id:"3",pri:$scope.dp[i].sou})
                }
                if($scope.dp[i].ryo != "" && $scope.dp[i].ryo != undefined){
                    work.dp.push({no:work.ymd,nam:$scope.dp[i].nam,id:"4",pri:$scope.dp[i].ryo})
                }
                if($scope.dp[i].cle != "" && $scope.dp[i].cle != undefined){
                    work.dp.push({no:work.ymd,nam:$scope.dp[i].nam,id:"5",pri:$scope.dp[i].cle})
                }
                if($scope.dp[i].mei != "" && $scope.dp[i].mei != undefined){
                    work.dp.push({no:work.ymd,nam:$scope.dp[i].nam,id:"6",pri:$scope.dp[i].mei})
                }
                if($scope.dp[i].etc != "" && $scope.dp[i].etc != undefined){
                    work.dp.push({no:work.ymd,nam:$scope.dp[i].nam,id:"7",pri:$scope.dp[i].etc})
                }
                if($scope.dp[i].cp != "" && $scope.dp[i].cp != undefined){
                    work.dp.push({no:work.ymd,nam:$scope.dp[i].nam,id:"8",pri:$scope.dp[i].cp})
                }
            }
            work.flg = "0"
            
            myFactory.my_r("dp.php",work,"save").then(function(){
                myFactory.my_get("dp.php",work).then(function(dp){
                    $uibModalInstance.close(dp);
                })
                ons.notification.alert({
                    message: '変更を完了しました。',
                    title: '確認',
                    buttonLabel: 'OK',
                })
            })/*.then(function(itm){
                for(let i=0;i<$scope.dp.length;i++){
                    $scope.dp[i].pri = ""    
                }
                for(let i=0;i<$scope.dp.length;i++){
                    $scope.dp[i].sum = ""    
                }
                myFactory.my_get("dp.php").then(function(itms){
                    for(let i=0,y=0;i<itm.length;i++){         
                        if(itm[i].NAME != ""){
                            $scope.dp[y] = {nam:itm[i].NAME,pri:""}
                            y++
                        }
                    }
                    for(let i=0;i<itms.length;i++){
                        $scope.dp[itms[i].no.substr(9)].sum = itms[i].pri
                    }
                })
            })*/
        }
        /*
        $scope.dpdel = function(){
            for(let i=0;i<$scope.dp.length;i++){
                $scope.dp[i].pri = ""    
            }
        }*/
        $scope.dpcls = function(){
            myFactory.my_get("dp.php",work).then(function(dp){
                $uibModalInstance.close(dp);
            })
        }
    }])
    //経費ダイアログ
    .controller('cost_Controller', ['$scope','$uibModalInstance','Data','myFactory','$resource',function($scope,$uibModalInstance,Data,myFactory,$resource){
        let mycos = {}
        if($scope.r == undefined){
            mycos = Data.login
        }else{
            mycos = $scope.r
        }
        mycos.itm = []
        mycos.pri = []
        mycos.fn = []
        //{itm:[],pri:[],fn:[]}
        /*
        myFactory.my_get("option.php").then(function(itm){
            if(itm[0][0].OP1!=""){
                Data.op = itm[0][0]
                Data.time = getTime(Data)
                */
        if(Data.cos.itm != ""){
            Data.cos = ObjArraySort(Data.cos,"pri","desc")
            for(let i=0;i<Object.keys(Data.cos).length;i++){
                if(Data.cos[i].pri == 0){
                    Data.cos[i].pri = ""
                }
            }
            $scope.cos_itm = Data.cos
        }
            //}
        myFactory.my_get("cost.php",mycos).then(function(itm){
            $scope.cos_s = itm
        })
        //})
        $scope.cosadd = function(){
            let my_flg = false
           for(let i=0;i<Object.keys($scope.cos_itm).length;i++){
               if($scope.cos_itm[i].chk == true){
                   my_flg = true
                   mycos.itm.push($scope.cos_itm[i].itm)
                   if(String($scope.cos_itm[i].pri).indexOf('+') != -1){
                       mycos.pri.push($scope.cos_itm[i].pri.split('+').map(function (element) { return Number(element); }).reduce(function(x, y) { return x + y; }))
                   }else{
                    mycos.pri.push(Number($scope.cos_itm[i].pri))
                   }
                   if(isNaN(mycos.pri[mycos.pri.length-1])){
                       ons.notification.alert({
                            message: '入力に誤りがあります。',
                            title: 'エラー',
                            buttonLabel: 'OK',
                            animation: 'default'
                        })
                       return
                   }
               }
           }
           if($scope.cos_my != undefined){
               if($scope.cos_my.chk == true){
                   my_flg = true
                   mycos.itm.push($scope.cos_my.itm)
                   if(String($scope.cos_my.pri).indexOf('+') != -1){
                       mycos.pri.push($scope.cos_my.pri.split('+').map(function (element) { return Number(element); }).reduce(function(x, y) { return x + y; }))
                   }else{
                    mycos.pri.push(Number($scope.cos_my.pri))
                   }
                   if(isNaN(mycos.pri[mycos.pri.length-1])){
                       ons.notification.alert({
                            message: '入力に誤りがあります。',
                            title: 'エラー',
                            buttonLabel: 'OK',
                            animation: 'default'
                        })
                       exit
                   }
               }
           }
           mycos.flg = "0"
           mycos.fn = FreeNumber($scope.cos_s)
           
           if(mycos.pri[0] != undefined && my_flg == true){
                myFactory.my_r("cost.php",mycos,"save").then(function(itm){
                    mycos.itm = []
                    mycos.pri = []
                    mycos.fn = []
                    for(let i=0;i<Object.keys($scope.cos_itm).length;i++){
                        $scope.cos_itm[i].pri = ""
                        $scope.cos_itm[i].chk = ""
                    }
                    if($scope.cos_my != undefined){
                        $scope.cos_my.itm = ""
                        $scope.cos_my.pri = ""
                        $scope.cos_my.chk = ""
                    }
                    myFactory.my_get("cost.php",mycos).then(function(itms){
                        $scope.cos_s = itms
                    })
                })
           }else{
               myAlert("エラー","どの項目にもチェックが入っていません。","OK")
               return
           }
        };
        
        $scope.cosdel = function(){
            for(let i=0;i<Object.keys($scope.cos_itm).length;i++){
                $scope.cos_itm[i].pri = ""
                $scope.cos_itm[i].chk = ""
            }
            if($scope.cos_my != undefined){
                $scope.cos_my.itm = ""
                $scope.cos_my.pri = ""
                $scope.cos_my.chk = ""
            }
        };
        $scope.coscls = function(){
            let w = 0
            for(let i=0;i<$scope.cos_s.length;i++){
                w += $scope.cos_s[i].pri
            }
            $uibModalInstance.close(w);
        }
        //項目削除
        $scope.hold = function(cos){
         ons.notification.confirm({
                message: '項目を削除してもよろしいですか？',
                title: '確認',
                buttonLabels: ['NO','YES'],
                animation: 'default',
                callback: function(itm) {
                    if(itm =="1"){
                        let mycos = itmGet(Data)
                        //let cos_s = {}
                        mycos.no = cos
                        mycos.flg = "1"
                        myFactory.my_r("cost.php",mycos,"save").then(function(){
                            mycos.itm = []
                            mycos.pri = []
                            mycos.fn = []
                            myFactory.my_get("cost.php",mycos).then(function(itms){
                                $scope.cos_s = itms
                            })
                        })
                    }
                }
            })
            
        }
    }])
    //dat_syo.html dat_syo.php
    .controller('dat_syo_Controller',['$scope','$resource','Data','$q','$uibModal','myFactory',function($scope,$resource,Data,$q,$uibModal,myFactory){
        var r = $resource('http://localhost/:work',
                                    {work:'login.php'},
                                    {'save':  {method:'POST',headers:  {'Content-Type' : 'application/x-www-form-urlencoded;application/json;charset=utf-8'}},
                                    'delete': {method:'DELETE',headers:{'Content-Type' : 'application/x-www-form-urlencoded;application/json;charset=utf-8'}}}         
                                );
        /*myFactory.my_get("option.php").then(function(op){
            if(op[0][0].op1 != ""){
                Data.op = op[0][0]
                Data.time = getTime(Data)
            }*/
            //0,null文字を""に変換
            myFactory.my_get("dat_syo.php").then(function(itm){
                $scope.datepicker = Data.datepicker
                $scope.datepicker.time = getTime(Data,"1",undefined)
                for(let i=itm.length-1;-1<i;i--){
                    for(var key in itm[i]){
                        if(itm[i][key] == null){
                            itm[i][key] = ""
                        }else if(itm[i][key] == 0){
                            itm[i][key] = ""
                        }else if(itm[i][key] == undefined){
                            itm[i][key] = ""
                        }else if(itm[i][key] == false){
                            itm[i][key] = ""
                        }
                        
                    }
                    if(itm[i].sub_a != 0){
                        itm[i].sub += itm[i].sub_a
                    }
                    if(itm[i].many[0] != undefined){
                        for(let y=0;y<itm[i].many.length;y++){
                            itm[i].sub -= itm[i].many[y].sub / itm[i].many[y].many
                            if(itm[i].many[y].cre != null){
                                itm[i].cre -= itm[i].many[y].cre / itm[i].many[y].many
                            }
                            if(itm[i].many[y].jib != null){
                                itm[i].jib -= itm[i].many[y].jib / itm[i].many[y].many
                            }
                        }
                    }
                  //  console.log(itm[i])
                }
                //console.log(itm)
                //$scope.dat_syo = my_split(itm,"")
                $scope.dat_syo = my_split(itm,"oku")
                $scope.dat_syo = my_split(itm,"syo")
                for(let i=0;i<itm.length;i++){
                    let w = 0
                    if(itm[i].dp != ""){
                        w += Number(itm[i].dp)
                    }
                    if(itm[i].set != "" && Data.op.op14 == "a"){
                        w += Number(itm[i].set)
                    }
                    if(itm[i].ren != "" && Data.op.op15 == "a"){
                        w += Number(itm[i].ren)
                    }
                    if(itm[i].sou != "" && Data.op.op16 == "a"){
                        w += Number(itm[i].sou)
                    }
                    if(itm[i].ryo != "" && Data.op.op17 == "a"){
                        w += Number(itm[i].ryo)
                    }
                    if(itm[i].cle != "" && Data.op.op18 == "a"){
                        w += Number(itm[i].cle)
                    }
                    if(itm[i].mei != "" && Data.op.op19 == "a"){
                        w += Number(itm[i].mei)
                    }
                    if(itm[i].etc != "" && Data.op.op20 == "a"){
                        w += Number(itm[i].etc)
                    }
                    if(w != 0){
                        $scope.dat_syo[i].dp = w
                    }
                }
            })
        //})
        $scope.toggleDatePicker = function($event) {//datepicker_toggle
            // これが重要！！！
            $event.stopPropagation();
            $scope.datepicker.open = !$scope.datepicker.open;
        };
        $scope.show_this_dat_syo = function(){
            $scope.r = getTime(undefined,undefined,$scope.datepicker.time)
            $scope.r.db = Data.login.db
            $scope.r.id = Data.login.id
            $scope.r.pass = Data.login.pass
            myFactory.my_get("dat_syo.php",$scope.r).then(function(itm){
                for(let i=itm.length-1;-1<i;i--){
                    for(var key in itm[i]){
                        if(itm[i][key] == null){
                            itm[i][key] = ""
                        }else if(itm[i][key] == 0){
                            itm[i][key] = ""
                        }else if(itm[i][key] == undefined){
                            itm[i][key] = ""
                        }
                    }
                    if(itm[i].sub_a != 0){
                        itm[i].sub += itm[i].sub_a
                    }
                    if(itm[i].many[0] != undefined){
                        for(let y=0;y<itm[i].many.length;y++){
                            itm[i].sub -= itm[i].many[y].sub / itm[i].many[y].many
                            if(itm[i].many[y].cre != null){
                                itm[i].cre -= itm[i].many[y].cre / itm[i].many[y].many
                            }
                            if(itm[i].many[y].jib != null){
                                itm[i].jib -= itm[i].many[y].jib / itm[i].many[y].many
                            }
                        }
                    }
                }
                $scope.dat_syo = my_split(itm,"oku")
                $scope.dat_syo = my_split(itm,"syo")
                for(let i=0;i<itm.length;i++){
                    if(itm[i].set != "" && Data.op.op14 == "a"){
                        $scope.dat_syo[i].dp += Number(itm[i].set)
                    }
                    if(itm[i].ren != "" && Data.op.op15 == "a"){
                        $scope.dat_syo[i].dp += Number(itm[i].ren)
                    }
                    if(itm[i].sou != "" && Data.op.op16 == "a"){
                        $scope.dat_syo[i].dp += Number(itm[i].sou)
                    }
                    if(itm[i].ryo != "" && Data.op.op17 == "a"){
                        $scope.dat_syo[i].dp += Number(itm[i].ryo)
                    }
                    if(itm[i].cle != "" && Data.op.op18 == "a"){
                        $scope.dat_syo[i].dp += Number(itm[i].cle)
                    }
                    if(itm[i].mei != "" && Data.op.op19 == "a"){
                        $scope.dat_syo[i].dp += Number(itm[i].mei)
                    }
                    if(itm[i].etc != "" && Data.op.op20 == "a"){
                        $scope.dat_syo[i].dp += Number(itm[i].etc)
                    }
                }
            })
        
        }
        $scope.show = function(itm){
            ons.notification.confirm({
                message: '選択してください。',
                title: '　',
                buttonLabels: ['出勤','日払い','CAN'],
                animation: 'default',
                callback: function(flg) {
                    if(flg == 0){
                        var modalInstance = $uibModal.open({
                            templateUrl: 'attendance.html',
                            controller: 'modal_Controller',
                            scope: $scope,
                            size: 'sm',
                            backdropClass: 'test'
                        })
                        modalInstance.result.then(
                            function(itm){
                                
                            }
                        )
                    }else if(flg == 1){
                        var modalInstance = $uibModal.open({
                            templateUrl: 'dp.html',
                            controller: 'dp_Controller',
                            scope: $scope,
                            size: 'sm',
                            backdropClass: 'test'
                        })
                        modalInstance.result.then(
                            function(dp){
                                for(let y=0;y<$scope.dat_syo.length;y++){
                                    let w = 0
                                    for(let i=0;i<dp.length;i++){
                                        if(dp[i].nam == $scope.dat_syo[y].nam && dp[i].id == "0"){
                                            w += Number(dp[i].pri)
                                        }else if(dp[i].nam == $scope.dat_syo[y].nam && dp[i].id == "1" && Data.op.op14 == "a"){
                                            w += Number(dp[i].pri)
                                        }else if(dp[i].nam == $scope.dat_syo[y].nam && dp[i].id == "2" && Data.op.op15 == "a"){
                                            w += Number(dp[i].pri)
                                        }else if(dp[i].nam == $scope.dat_syo[y].nam && dp[i].id == "3" && Data.op.op16 == "a"){
                                            w += Number(dp[i].pri)
                                        }else if(dp[i].nam == $scope.dat_syo[y].nam && dp[i].id == "4" && Data.op.op17 == "a"){
                                            w += Number(dp[i].pri)
                                        }else if(dp[i].nam == $scope.dat_syo[y].nam && dp[i].id == "5" && Data.op.op18 == "a"){
                                            w += Number(dp[i].pri)
                                        }else if(dp[i].nam == $scope.dat_syo[y].nam && dp[i].id == "6" && Data.op.op19 == "a"){
                                            w += Number(dp[i].pri)
                                        }else if(dp[i].nam == $scope.dat_syo[y].nam && dp[i].id == "7" && Data.op.op20 == "a"){
                                            w += Number(dp[i].pri)
                                        }
                                    }
                                    if(w != 0){
                                        $scope.dat_syo[y].dp = w
                                    }
                                }
                            }
                        )
                    }
                }
            })
        }
   
    }])
    //出勤ダイアログ
    .controller('modal_Controller', ['$scope','$uibModalInstance','Data','myFactory','$resource',function($scope,$uibModalInstance,Data,myFactory,$resource){
        $scope.syu_add = function(){
            let work = {syu:[],pen:[],nam:[]}
            for(let i=0;i<$scope.dat_syo.length;i++){
                if(document.getElementById('syu4'+i).checked == false){
                    let y = 1
                    while(document.getElementById('syu'+y+i).checked == false){
                        y++
                    }
                    work.syu.push(document.getElementById('syu'+y+i).value)
                    work.pen.push(document.getElementById('pen'+i).value)
                    work.nam.push($scope.dat_syo[i].nam)
                }
            }
            work.flg = "0"
            if($scope.r == undefined){
                work = Object.assign(work,Data.login)
            }else{
                work = Object.assign(work,$scope.r)
            }
            myFactory.my_r("dat_syo.php",work,"save")
            ons.notification.alert({
                message: '変更を完了しました。',
                title: '確認',
                buttonLabel: 'OK',
            })
            $uibModalInstance.close()
        };
        $scope.syu_can = function(){
            $uibModalInstance.dismiss();
        };
        
      }])
    //dat.html dat.php
    .controller('dat_Controller',['$scope','$resource','Data','$q','myFactory',function($scope,$resource,Data,$q,myFactory){
            myFactory.my_get("dat.php",Data.login).then(function(itm){
                $scope.datepicker = Data.datepicker
                $scope.datepicker.time = getTime(Data,"1",undefined)
                itm = timeSort(itm,Data.op)
                let myary = []
                for(let i=itm.length-1;-1<i;i--){
                    for(let key in itm[i]){
                        if(itm[i][key] == null){
                            itm[i][key] = ""
                        }
                    }
                    myary.unshift(itm[i])
                }
                
                $scope.dat = myary
                $scope.con = {}
             })
        //})
        $scope.toggleDatePicker = function($event) {//datepicker_toggle
            // これが重要！！！
            $event.stopPropagation();
            $scope.datepicker.open = !$scope.datepicker.open;
        };
        $scope.show_d = function(){
            $scope.con = getTime(undefined,undefined,$scope.datepicker.time)
            $scope.con.db = Data.login.db
            $scope.con.id = Data.login.id
            $scope.con.pass = Data.login.pass
            /*
            if($scope.mydate.year && $scope.mydate.month && $scope.mydate.day != ''){
                $scope.mydate.ymd = $scope.mydate.year + $scope.mydate.month + $scope.mydate.day
                myFactory.my_get("option.php").then(function(itm){
                    if(itm[0][0].op1!=""){
                        Data.op = itm[0][0]
                        Data.time = getTime(Data)
                    }*/
                     myFactory.my_get("dat.php",$scope.con).then(function(itm){
                         let myary = []
                        for(let i=itm.length-1;-1<i;i--){
                            for(let key in itm[i]){
                                if(itm[i][key] == null){
                                    itm[i][key] = ""
                                }
                            }
                            myary.unshift(itm[i])
                            //myary[itm[i].no.substr(9)-1] = itm[i]
                        }
                        $scope.dat = myary
                        /*
                        $scope.mydate.year = ""
                        $scope.mydate.month = ""
                        $scope.mydate.day = ""
                        $scope.mydate.ymd = ""
                        */
                     })
                //})
            
            //}
        }
        $scope.show = function(data){
            Data.no = data.no;
            $scope.nav.pushPage('slip.html');
        }
        $scope.show_1 = function(data){
            ons.notification.confirm({
                messageHTML:'<input type="number" id="d_dou" placeholder="同伴">'+
                            '<input type="number" id="d_new" placeholder="新規">'+
                            '<input type="text" id="d_nam" placeholder="本指名">'+
                            '<input type="text" id="d_gue" placeholder="お客様名">'+
                            '<input type="text" id="d_tab" placeholder="卓番">'+
                            '<input type="number" id="d_cnt" placeholder="人数">'+
                            '<input type="text" id="d_in" placeholder="IN時間">'+
                            '<input type="text" id="d_syo" placeholder="紹介者名">'+
                            '枝:<input type="checkbox" id="d_flg">'+
                            '<input type="text" id="d_her" placeholder="ヘルプ指名">'+
                            '<input type="text" id="d_jou" placeholder="場内指名">'+
                            '<input type="number" id="d_sub" placeholder="売上">'+
                            '<input type="number" id="d_mai" placeholder="合計">'+
                            '<input type="number" id="d_car" placeholder="カード">'+
                            '<input type="number" id="d_cre" placeholder="売掛">'+
                            '<input type="number" id="d_jib" placeholder="自腹">'+
                            '<input type="text" id="d_bik" placeholder="備考">'+
                            '<input type="text" id="d_oku" placeholder="送り">'+
                            '</br><label><input type="checkbox" id="d_can"> チェック取消</label>'+
                            '</br><label><input type="checkbox" id="d_del"> データ削除</label>',
                title:'編集',
                callback:function(itm){
                    if(itm == '1'){
                        $scope.con.no = data.no
                        $scope.con.dou = document.getElementById('d_dou').value
                        $scope.con.new = document.getElementById('d_new').value
                        $scope.con.gue = document.getElementById('d_gue').value
                        $scope.con.syo = document.getElementById('d_syo').value
                        $scope.con.her = document.getElementById('d_her').value
                        $scope.con.jou = document.getElementById('d_jou').value
                        $scope.con.car = document.getElementById('d_car').value
                        $scope.con.cre = document.getElementById('d_cre').value
                        $scope.con.jib = document.getElementById('d_jib').value
                        $scope.con.bik = document.getElementById('d_bik').value
                        $scope.con.oku = document.getElementById('d_oku').value
                        $scope.con.can = document.getElementById('d_can').checked
                        $scope.con.del = document.getElementById('d_del').checked
                        if($scope.con.oku != ""){
                            $scope.con.oku = my_replace($scope.con.oku)
                        }
                        if($scope.con.cre != "" && $scope.con.gue == ""){
                            myAlert("エラー","お客様名を入力してください。","OK")
                            return
                        }
                        if(document.getElementById('d_nam').value != ""){
                            $scope.con.nam = document.getElementById('d_nam').value
                            if($scope.con.nam == "初回"){
                                $scope.con.flg = "0"
                            }else if($scope.con.nam == "フリー" && Data.op.op10 == "a"){
                                if($scope.con.syo == ""){
                                    ons.notification.alert({
                                        message: '「紹介者名」を入力してください。',
                                        title: 'エラー',
                                        buttonLabel: 'OK',
                                        animation: 'default',
                                        callback: function() {
                                        }
                                    });
                                    return
                                }else{
                                    $scope.con.flg = "0"
                                }
                            }else{
                                $scope.con.flg = ""
                            }
                        }else{
                            $scope.con.nam = data.nam
                            if($scope.con.nam == "初回"){
                                $scope.con.flg = "0"
                            }else if($scope.con.nam == "フリー" && Data.op.op10 == "a"){
                                if($scope.con.syo == ""){
                                    ons.notification.alert({
                                        message: '「紹介者名」を入力してください。',
                                        title: 'エラー',
                                        buttonLabel: 'OK',
                                        animation: 'default',
                                        callback: function() {
                                        }
                                    });
                                    return
                                }else{
                                    $scope.con.flg = "0"
                                }
                            }else{
                                $scope.con.flg = ""
                            }
                        }
                        if(document.getElementById('d_flg').checked == true){
                            if($scope.con.syo == "" || $scope.con.nam != "フリー" || $scope.con.nam != "初回"){
                                ons.notification.alert({
                                    message: '「本指名」に"フリー"または"初回"と入力し「紹介者名」を入力してください。',
                                    title: 'エラー',
                                    buttonLabel: 'OK',
                                    animation: 'default',
                                    callback: function() {
                                    }
                                });
                                return
                            }else if($scope.con.nam == '初回' && Data.op.op4 == "a" || $scope.nam.syo == 'フリー' && Data.op.op5 == "a"){
                                $scope.con.flg = "0"
                            }else if($scope.con.nam == '初回' && Data.op.op4 == "b" || $scope.nam.syo == 'フリー' && Data.op.op5 == "b"){
                                $scope.con.flg = "1"
                            }
                        }
                        if(document.getElementById('d_tab').value != ""){
                            $scope.con.tab = document.getElementById('d_tab').value
                        }else{
                            $scope.con.tab = data.tab
                        }
                        if(document.getElementById('d_in').value != ""){
                            $scope.con.in = document.getElementById('d_in').value
                        }else{
                            $scope.con.in = data.in
                        }
                        if(document.getElementById('d_sub').value != ""){
                            $scope.con.sub = document.getElementById('d_sub').value
                        }else{
                            $scope.con.sub = data.sub
                        }
                        if(document.getElementById('d_mai').value != ""){
                            $scope.con.mai = document.getElementById('d_mai').value
                        }else{
                            $scope.con.mai = data.mai
                        }
                        if(document.getElementById('d_cnt').value != ""){
                            $scope.con.cnt = document.getElementById('d_cnt').value
                        }else{
                            $scope.con.cnt = data.cnt
                        }
                        if($scope.con.car != ""){
                            $scope.con.car = getCard($scope.con.car,Data)
                        }
                        //let work = {}
                        if(getTime(Data).ymd == data.no.substr(0,8)){/*
                            $scope.con = Object.assign($scope.con,getTime(undefined,"1",data.no.substr(0,8)))
                        }else{*/
                            $scope.con = Object.assign($scope.con,Data.login)
                        }
                        myFactory.my_r("dat.php",$scope.con,"save").then(function(){
                            /*
                            myFactory.my_get("option.php").then(function(itm){
                                if(itm[0][0].op1!=""){
                                    Data.op = itm[0][0]
                                    Data.time = getTime(Data)
                                }*/
                                 myFactory.my_get("dat.php",$scope.con).then(function(itm){
                                    let myary = []
                                    for(let i=itm.length-1;-1<i;i--){
                                        for(let key in itm[i]){
                                            if(itm[i][key] == null){
                                                itm[i][key] = ""
                                            }
                                        }
                                        myary.unshift(itm[i])
                                        //myary[itm[i].no.substr(9)-1] = itm[i]
                                    }
                                    $scope.dat = myary
                                 })
                            //})
                        })
                    }
                }
            })
        }
    }])
    //login.html login.php
    .controller('login_Controller',['$scope','$resource','Data','$q','myFactory',function($scope,$resource,Data,$q,myFactory){
        
        $scope.onlog = function(){
            let w = $scope.login.id.split("_")
            $scope.login.db = w[0]
            myFactory.my_get("login.php",$scope.login).then(function(data){
                if(data[0]=="true"){
                    Data.login = $scope.login
                    $scope.nav.insertPage('home.html');
                    $scope.nav.pushPage('home.html');
                }else{
                    myAlert("エラー","NameまたはIDまたはPASSが一致しません。","OK")
                }
                
            })
        };
        $scope.onpass = function(){
            if(Data.time.length == 0){
                myFactory.my_get("option.php").then(function(op){
                    Data.op = op[0][0]
                    Data.time = getTime(Data)
                })
            }
            if($scope.pass1 == $scope.pass2){
                Data.login.newpass = $scope.pass1
                r.save(Data.login,function(){
                    Data.login.pass = Data.login.newpass
                    $scope.log = 'パスワードを変更しました'
                })
            }else{
                $scope.data = 'パスワードが一致しません'
            }
        }
    }])
    //cast.html cast.php
    .controller('cast_Controller',['$scope','$resource','Data','$q','myFactory',function($scope,$resource,Data,$q,myFactory){
        $scope.user = itmGet(Data)
        myFactory.my_get("cast.php",$scope.user).then(function(casts){
            $scope.users = casts
            $scope.user.myid = casts[0].ID
        })
        $scope.onadd = function(){
            $scope.user.flag = 0
            if($scope.user.mypass1 != $scope.user.mypass2 && $scope.user.mypass1 != ""){
                myAlert("エラー","同じパスワードを入力してください。","OK")
                return
            }
            myFactory.my_r("cast.php",$scope.user,"save").then(function(){
                myFactory.my_get("cast.php",$scope.user).then(function(casts){
                    $scope.users = casts
                    ons.notification.confirm({
                        message:'続けて追加しますか？',
                        title: '確認',
                        buttonLabels: ['NO','YES'],
                        callback: function(itm) {
                            if(itm == '1'){
                                let w
                                for(let i=0;i<casts.length&&casts[i].NAME != "";i++){
                                    w = i + 1
                                }
                                $scope.user.myid = casts[w].ID
                                $scope.user.myname = ""
                            }else{
                                $scope.nav.insertPage('home.html');
                                $scope.nav.pushPage('home.html');
                            }
                        }
                    })
                })
            })
        };
        $scope.ondel = function(){
            $scope.user.flag = 1
            $scope.user.myname = ""
            myFactory.my_r("cast.php",$scope.user,"save").then(function(){
                myFactory.my_get("cast.php",$scope.user).then(function(cast){
                    $scope.users = cast
                })
            })
            
        };
    }])
    /*
    $scope.op.key = itm[0][0].key//開始年月
    $scope.op.op1 = itm[0][0].op1//tax
    $scope.op.op2 = itm[0][0].op2//下〇桁
    $scope.op.op3 = itm[0][0].op3//切り上下
    $scope.op.op4 = itm[0][0].op4//枝初回
    $scope.op.op5 = itm[0][0].op5//枝フリー
    $scope.op.op6 = itm[0][0].op6//営業時間
    $scope.op.op7 = itm[0][0].op7//カード
    $scope.op.op8 = itm[0][0].op8//入金締日
    $scope.op.op9 = itm[0][0].op9//複数入店
    $scope.op.op10 = itm[0][0].op10//フリー初回
    $scope.op.op11 = itm[0][0].op11//手数料の振り分け
    */
    //option.html option.php
    .controller('option_Controller',['$scope','$resource','Data','$q','myFactory',function($scope,$resource,Data,$q,myFactory){
        var r = $resource('http://localhost/:work',
                                    {work:'option.php'},
                                    {'save':  {method:'POST',headers:  {'Content-Type' : 'application/x-www-form-urlencoded;application/json;charset=utf-8'}},
                                    'delete': {method:'DELETE',headers:{'Content-Type' : 'application/x-www-form-urlencoded;application/json;charset=utf-8'}}}         
                                );
        myFactory.my_get("option.php",Data.login).then(function(itm){
            if(itm[0][0] != undefined){
                $scope.op = itm[0][0]
                $scope.op.flag = "1"
                if(itm[1].length != undefined){
                    itm[1] = ObjArraySort(itm[1],"pri")
                    for(let i=0;i<Object.keys(itm[1]).length;i++){
                        if(itm[1][i].pri == 0){
                            itm[1][i].pri = ""
                        }
                    }
                    $scope.cos_itm = itm[1]
                    //$scope.cos.sel = itm[1][0]
                }
                if(itm[2].length != undefined){
                    $scope.pay_s_itm = itm[2]
                }
            }
            myFactory.my_get("option_itm.php",Data.login).then(function(itm){
                
                if(itm[0] != undefined){
                    $scope.op.itm = itm
                }
                //$scope.itm.fn = FreeNumber2(itm,"ord")
            })
        })
        $scope.pay_s_add = function(){
            
            $scope.pay_s.flag = "4"
            if($scope.pay_s.itm == ""){
                myAlert("エラー","項目名を入力してください。","OK")
            }else if($scope.pay_s.pri == ""){
                myAlert("エラー","金額を入力してください。","OK")
            }
            $scope.pay_s = Object.assign($scope.pay_s,Data.login)
            myFactory.my_r("option.php",$scope.pay_s,"save").then(function(){
                myFactory.my_get("option.php",Data.login).then(function(op){
                    if(op[2].length != 0){
                        $scope.pay_s_itm = op[2]
                    }
                })
            })
        }
        $scope.pay_s_del = function(){
            $scope.pay_s.flag = "5"
            if($scope.pay_s.sel != undefined){
                $scope.pay_s = Object.assign($scope.pay_s,Data.login)
                myFactory.my_r("option.php",$scope.pay_s,"save").then(function(){
                    myFactory.my_get("option.php",Data.login).then(function(op){
                        if(op[2].length != 0){
                            $scope.pay_s_itm = op[2]
                        }
                    })
                })
            }else{
                myAlert("エラー","削除する項目を選択してください。","OK")
            }
        }
        $scope.configadd = function(){
            if($scope.op.key == undefined){
                $scope.op.flag = 1
                $scope.op.key = getTime().ym
            }
            let flg
            for(let i=1;i<22;i++){
                if($scope.op['op'+i] == undefined){
                    flg = true
                }
            }
            if(flg == true){
                ons.notification.alert({
                  message: '記入していない項目があります。',
                  title: '確認',
                  buttonLabel: 'OK',
                  animation: 'default',
                  callback: function() {
                  }
                })
            }else{
                $scope.op = Object.assign($scope.op,Data.login)
                if($scope.op.op23 == undefined){
                    $scope.op.op23 = "a"
                }
                myFactory.my_r("option.php",$scope.op,"save").then(function(){
                    myFactory.my_get("option.php",$scope.op).then(function(op){
                        Data.op = op[0][0]
                        ons.notification.alert({
                          message: '設定を変更しました。',
                          title: '確認',
                          buttonLabel: 'OK',
                          animation: 'default',
                          callback: function() {
                          }
                        })
                    })
                })
            }
            
        }
        $scope.configback = function(){
            myFactory.my_get("option.php",Data.login).then(function(itm){
                if(itm[0][0].op1!=""){
                    $scope.op = itm[0][0]
                    $scope.op.flag = "1"
                }
            })
        }
        
        $scope.itm_flg = function(){
            let work = {}
            work.dis = ObjArraySort($scope.op.itm,"ord","asc")
            work.flg = "1"
            work = Object.assign(work,Data.login)
            myFactory.my_r("option_itm.php",work,"save").then(function(){
                ons.notification.alert({
                    message: '設定を更新しました。',
                    title: '確認',
                    buttonLabel: 'OK',
                    animation: 'default',
                });
            })
        }
        $scope.itm_up = function(){
            $scope.itm.flg = "2"
            $scope.itm = Object.assign($scope.itm,Data.login)
            for(let i=0;i<$scope.op.itm.length-1;i++){
                if($scope.op.itm[i].itm == $scope.itm.n1){
                    if($scope.op.itm[i].ord == 1){
                        exit
                    }
                    $scope.itm.f1 = $scope.op.itm[i].ord
                    $scope.itm.f2 = $scope.op.itm[i].ord - 1
                    for(let y=0;y<$scope.op.itm.length;y++){
                        if($scope.op.itm[y].ord == $scope.itm.f2){
                            $scope.itm.n2 = $scope.op.itm[y].itm
                        }
                    }
                   break
                }
            }
            if($scope.itm.n2 != undefined){
                myFactory.my_r("option_itm.php",$scope.itm,"save").then(function(){
                //r.save({work:'option_itm.php'},$scope.itm,function(itm){
                    myFactory.my_get("option_itm.php",Data.login).then(function(itm){
                        if(itm != ""){
                            $scope.op.itm = itm
                            $scope.itm.n2 = undefined
                        }
                    })
                })
            }
        }
        $scope.itm_down = function(){
            $scope.itm.flg = "3"
            $scope.itm = Object.assign($scope.itm,Data.login)
            for(let i=0;i<$scope.op.itm.length;i++){
                if($scope.op.itm[i].itm == $scope.itm.n1){
                    $scope.itm.f1 = $scope.op.itm[i].ord
                    $scope.itm.f2 = $scope.op.itm[i].ord + 1
                    for(let y=0;y<$scope.op.itm.length;y++){
                        if($scope.op.itm[y].ord == $scope.itm.f2){
                            $scope.itm.n2 = $scope.op.itm[y].itm
                        }
                    }
                   break
                }
            }
            if($scope.itm.n2 != undefined){
                r.save({work:'option_itm.php'},$scope.itm,function(itm){
                    myFactory.my_get("option_itm.php",Data.login).then(function(itm){
                        if(itm != ""){
                            $scope.op.itm = itm
                            $scope.itm.n2 = undefined
                        }
                    })
                })
            }
        }
        $scope.cos_add = function(){
            $scope.cos.flag = "2"
            $scope.cos = Object.assign($scope.cos,Data.login)
            if($scope.cos.itm != ""){
                myFactory.my_r("option.php",$scope.cos,"save").then(function(){
                //r.save($scope.cos,function(itm){
                    myFactory.my_get("option.php",Data.login).then(function(itm){
                        if(itm[0][0].op1!=""){
                            $scope.op = itm[0][0]
                            $scope.op.flag = "1"
                            if(itm[1][0].itm != ""){
                                itm[1] = ObjArraySort(itm[1],"pri")
                                for(let i=0;i<Object.keys(itm[1]).length;i++){
                                    if(itm[1][i].pri == 0){
                                        itm[1][i].pri = ""
                                    }
                                }
                                $scope.cos_itm = itm[1]
                            }
                        }
                    })
                })
            }else{
                ons.notification.alert({
                    message: '入力項目が不足しています。',
                    title: 'エラー',
                    buttonLabel: 'OK',
                    animation: 'default',
                });
            }
        }
        $scope.cos_del = function(){
            $scope.cos.flag = "3"
            $scope.cos = Object.assign($scope.cos,Data.login)
            if($scope.cos.sel != undefined){
                myFactory.my_r("option.php",$scope.cos,"save").then(function(){
                //r.save($scope.cos,function(itm){
                    myFactory.my_get("option.php",Data.login).then(function(itm){
                        if(itm[0][0].op1!=""){
                            $scope.op = itm[0][0]
                            $scope.op.flag = "1"
                            if(itm[1][0].itm != ""){
                                itm[1] = ObjArraySort(itm[1],"pri")
                                for(let i=0;i<Object.keys(itm[1]).length;i++){
                                    if(itm[1][i].pri == 0){
                                        itm[1][i].pri = ""
                                    }
                                }
                                $scope.cos_itm = itm[1]
                            }
                        }
                    })
                })
            }else{
                ons.notification.alert({
                    message: '削除する項目を選択してください。',
                    title: 'エラー',
                    buttonLabel: 'OK',
                    animation: 'default',
                    callback: function() {
                    }
                });
                exit;
            }
                
        }
    }])
    //slip.html slip.php
    .controller('PageController',['$scope','$resource','Data','$q','myFactory',function($scope,$resource,Data,$q,myFactory){
        var resource = $resource('http://localhost/:work',
                                    {work:'order.php'},
                                    {'save':  {method:'POST',headers:  {'Content-Type' : 'application/x-www-form-urlencoded;application/json;charset=utf-8'}},
                                    'delete': {method:'DELETE',headers:{'Content-Type' : 'application/x-www-form-urlencoded;application/json;charset=utf-8'}}}         
                                )
        myFactory.my_get("order.php",Data.no).then(function(simeis){
            $scope.simeis = simeis
            myFactory.my_get("menu.php",Data.login).then(function(menus){
                $scope.menus = menus
                myFactory.my_get("orders.php",Data.login).then(function(itms){
                    $scope.orders = itms
                    $scope.order.total = my_sum(itms,Data)
                })
            })
        })
        //オーダー追加
        $scope.orderadd = function(){
            myFactory.my_get("order.php",Data.no).then(function(itm){
                let flag = 0;
                let y = 0;
                $scope.order.item = [];
                $scope.order.cnt = [];
                $scope.order.price = [];
                $scope.order.class = [];
                for(i=3;i<document.order_form.length;i++){//フォームより上に入力欄を作った場合[i]を変更
                    if(document.order_form.elements[i].value!="" && document.order_form.elements[i].value!="0"){
                        if(document.order_form.elements[i].name.substr(0,document.order_form.elements[i].name.indexOf("Д")) == "場内指名" || document.order_form.elements[i].name.substr(0,document.order_form.elements[i].name.indexOf("Д")) == "ヘルプ指名"){
                            if(flag == 0 && $scope.order.exc.price == "" && $scope.order.exc.cnt == ""){
                                if(document.order_form.elements[i].value === "1" || document.order_form.elements[i].value === "-1"){
                                    if($scope.order.exc.item != ""){
                                        flag = 1//場内、ヘルプ指の同時処理はNG
                                        $scope.order.cnt[y] = document.order_form.elements[i].value;
                                        $scope.order.item[y] = document.order_form.elements[i].name.substr(0,document.order_form.elements[i].name.indexOf("Д"))
                                        $scope.order.price[y] = document.order_form.elements[i].name.substr(document.order_form.elements[i].name.indexOf("Д")+1,document.order_form.elements[i].name.lastIndexOf("Д") - (document.order_form.elements[i].name.indexOf("Д")+1))
                                        $scope.order.class[y] = document.order_form.elements[i].name.substr(document.order_form.elements[i].name.lastIndexOf("Д")+1)
                                        y++;
                                    }else{
                                        ons.notification.alert({
                                            message: '場内、ヘルプ指名はフォームの「品名」に名前を入力してください。',
                                            title: 'エラー',
                                            buttonLabel: 'OK',
                                            animation: 'default',
                                            callback: function() {
                                            }
                                        });
                                        exit;
                                    } 
                                }else{
                                    ons.notification.alert({
                                      message: '場内、ヘルプ指名は一人ずつ入力してください。',
                                      title: 'エラー',
                                      buttonLabel: 'OK',
                                      animation: 'default',
                                      callback: function() {
                                      }
                                    });
                                    exit;
                                }
                            }else{
                                ons.notification.alert({
                                    message: '場内、ヘルプ指名は同時に入力することができません。また、例外品と同時に入力することもできません。',
                                    title: 'エラー',
                                    buttonLabel: 'OK',
                                    animation: 'default',
                                    callback: function() {
                                    }
                                });
                                exit;
                            }
                        }else{
                            $scope.order.cnt[y] = document.order_form.elements[i].value;
                            $scope.order.item[y] = document.order_form.elements[i].name.substr(0,document.order_form.elements[i].name.indexOf("Д"))
                            $scope.order.price[y] = document.order_form.elements[i].name.substr(document.order_form.elements[i].name.indexOf("Д")+1,document.order_form.elements[i].name.lastIndexOf("Д") - (document.order_form.elements[i].name.indexOf("Д")+1))
                            $scope.order.class[y] = document.order_form.elements[i].name.substr(document.order_form.elements[i].name.lastIndexOf("Д")+1)
                            y++;
                        }
                    }   
                }
                if($scope.order.item[0] == null && $scope.order.exc.cnt == ""){
                    ons.notification.alert({
                        message: '個数が入力されてません。',
                        title: 'エラー',
                        buttonLabel: 'OK',
                        animation: 'default',
                        callback: function() {
                        }
                    });
                    exit;
                }else if($scope.order.item[0] == null && $scope.order.exc.item == ""){
                    ons.notification.alert({
                        message: '品名が入力されてません。',
                        title: 'エラー',
                        buttonLabel: 'OK',
                        animation: 'default',
                        callback: function() {
                        }
                    });
                    exit;
                }else if($scope.order.item[0] == null && $scope.order.exc.price == ""){
                    ons.notification.alert({
                        message: '単価が入力されてません。',
                        title: 'エラー',
                        buttonLabel: 'OK',
                        animation: 'default',
                        callback: function() {
                        }
                    });
                    exit;
                }
                $scope.order = Object.assign($scope.order,Data.login)
                if(itm[0].mai == ""){
                    myFactory.my_r("orders.php",$scope.order,"save").then(function(){
                    //resource.save({work:'orders.php'},$scope.order,function(){
                        myFactory.my_get("orders.php",Data.login).then(function(itm){
                            $scope.order.total = my_sum(itm,Data)
                            $scope.orders = itm
                        })
                        
                    });
                }else{
                    ons.notification.confirm({
                        message:'この伝票はチェック済みです。オーダーを追加してよろしいですか？',
                        title: '確認',
                        callback: function(itm) {
                            if(itm == '1'){
                                myFactory.my_r("orders.php",$scope.order,"save").then(function(){
                                //resource.save({work:'orders.php'},$scope.order,function(){
                                    myFactory.my_get("orders.php",Data.login).then(function(itm){
                                        $scope.order.total = my_sum(itm,Data)
                                        $scope.orders = itm
                                    })
                                    
                                });
                            }
                        }
                    });
                }
            })
        }
        $scope.orderclr = function(){
            for(i=0;i<document.order_form.length;i++){
                if(document.order_form.elements[i].value!="" && document.order_form.elements[i].value!="0"){
                    document.order_form.elements[i].value = ""
                }
            $scope.order.exc.item = ""
            $scope.order.exc.price = ""
            $scope.order.exc.cnt = ""
            }
        }
        
        //■■■■■■■■■■
        $scope.fillshow = function(){
            ons.notification.confirm({
            messageHTML:'<input type="text" id="guest" placeholder="お客様名　*掛けの場合必須">'+
                        '<br/>全掛け：<input type="checkbox" id="all"><br/>'+
                        '<input type="number" id="pay" placeholder="現金入金額　*任意入力">'+
                        '<input type="number" id="card" placeholder="カード入金額　*任意入力">'+
                        '<input type="number" id="ahead" placeholder="自腹額　*任意入力">'+
                        '<input type="text" id="bik" placeholder="備考　*任意入力">'+
                        '<input type="text" id="oku" placeholder="送り　複数名の場合「.」または「。」で区切り　*任意入力">',
            title:'記入',
            callback:function(myflg){
                if(myflg == '1'){
                    $scope.order.guest = document.getElementById('guest').value
                    $scope.order.pay = document.getElementById('pay').value
                    $scope.order.card = document.getElementById('card').value
                    $scope.order.ahead = document.getElementById('ahead').value
                    $scope.order.bik = document.getElementById('bik').value
                    $scope.order.oku = document.getElementById('oku').value
                    $scope.order.all = document.getElementById('all').checked
                        myFactory.my_get("orders.php",Data.login).then(function(itm){
                            $scope.order.total = my_sum(itm,Data)
                            if($scope.order.total != Number($scope.order.pay) + Number($scope.order.card) + Number($scope.order.ahead) && Number($scope.order.pay) + Number($scope.order.card) + Number($scope.order.ahead) != 0){
                                if($scope.order.pay > $scope.order.total){
                                    ons.notification.alert({
                                        message: '入金額が会計額以上です。',
                                        title: 'エラー',
                                        buttonLabel: 'OK',
                                        animation: 'default'
                                    });
                                    exit;
                                }else if($scope.order.card > $scope.order.total){
                                    ons.notification.alert({
                                        message: 'カード入金額が会計額以上です。',
                                        title: 'エラー',
                                        buttonLabel: 'OK',
                                        animation: 'default'
                                    });
                                    exit;
                                }else if($scope.order.ahead > $scope.order.total){
                                    ons.notification.alert({
                                        message: '自腹額が会計額以上です。',
                                        title: 'エラー',
                                        buttonLabel: 'OK',
                                        animation: 'default'
                                    });
                                    exit;
                                }else if(Number($scope.order.pay) + Number($scope.order.card) + Number($scope.order.ahead) > $scope.order.total){
                                    ons.notification.alert({
                                        message: '合計額が会計額以上です。',
                                        title: 'エラー',
                                        buttonLabel: 'OK',
                                        animation: 'default'
                                    });
                                    exit;
                                }else if($scope.order.guest == ""){
                                    ons.notification.alert({
                                        message: 'お客様名が入力されていません。',
                                        title: 'エラー',
                                        buttonLabel: 'OK',
                                        animation: 'default'
                                    });
                                    exit;
                                }            
                                }else if($scope.order.all == true && $scope.order.guest == ""){
                                    ons.notification.alert({
                                        message: 'お客様名が入力されていません。',
                                        title: 'エラー',
                                        buttonLabel: 'OK',
                                        animation: 'default'
                                    });
                                    exit;
                                }else if($scope.order.total == 0){
                                    ons.notification.alert({
                                            message: '会計額が0です。',
                                            title: 'エラー',
                                            buttonLabel: 'OK',
                                            animation: 'default'
                                        });
                                        exit;
                                }
                                
                                if($scope.order.oku != ""){
                                    $scope.order.oku = my_replace($scope.order.oku)
                                }
                            //売上計算
                            let sub = 0
                            for(var i=0;i<itm.length;i++){
                                if(itm[i].cls != 0 && itm[i].cls != 2){
                                    sub += itm[i].pri * itm[i].cnt
                                }
                            }//========
                            if(getCard($scope.order.card,Data) != 0){
                                $scope.order.card2 = getCard($scope.order.card,Data)
                            }else{
                                $scope.order.card2 = ""
                            }
                            $scope.order.sub = sub
                            $scope.order.chk = 1
                            $scope.order = Object.assign($scope.order,Data.login)
                            if($scope.order.pay + $scope.order.card + $scope.order.ahead > 0){
                                cre = ($scope.order.total-$scope.order.pay-$scope.order.card-$scope.order.ahead)
                            }else{
                                cre = ""
                            }
                            
                            $scope.order.del = '0'
                            //チェックデータ送信
                            myFactory.my_r("order.php",$scope.order,"save").then(function(){
                            //resource.save($scope.order,function(){
                                if($scope.order.all == true){
                                    ons.notification.confirm({
                                        messageHTML:'お客様：'+$scope.order.guest+'</br>売上：'+$scope.order.sub+'</br>合計：'+$scope.order.total+'</br>掛額：'+ $scope.order.total,
                                        title: '確認',
                                        callback: function(itm) {
                                            if(itm == '1'){
                                                document.order_form.remove()
                                                $scope.nav.insertPage('home.html');
                                                $scope.nav.pushPage('home.html');
                                            }
                                        }
                                    });
                                }else{
                                    ons.notification.confirm({
                                        messageHTML:'お客様：'+$scope.order.guest+'</br>売上：'+$scope.order.sub+'</br>合計：'+$scope.order.total+'</br>掛額：'+ cre,
                                        title: '確認',
                                        callback: function(itm) {
                                            if(itm == '1'){
                                                document.order_form.remove()
                                                $scope.nav.pushPage('home.html');
                                            }
                                        }
                                    });
                                }
                                $scope.order.guest = ""
                                $scope.order.pay = ""
                                $scope.order.card = ""
                                $scope.order.card2 = ""
                                $scope.order.ahead = ""
                                $scope.order.bik = ""
                                $scope.order.oku = ""
                                $scope.order.all = false
                            })
                        })
                }
            }
            
        })}
          //■■■■■■■■■■

        $scope.orderchk = function(){
        }
    }])

    .controller('menu_Controller', ['$q','$scope','Data','myFactory',function($q,$scope,Data,myFactory){
        
        myFactory.my_get("menu.php",Data.login).then(function(menus){
            $scope.menus = menus
        })
        
        $scope.onadd = function(){
            $scope.menu = Object.assign($scope.menu,Data.login)
            myFactory.my_r("menu.php",$scope.menu,"save").then(function(){
                myFactory.my_get("menu.php",Data.login).then(function(menus){
                    $scope.menus = menus
                })
                //$scope.result = data;//戻り値確認用
                $scope.menu.item = ""
                $scope.menu.price = ""
                $scope.menu.class = ""
            });
        };
        $scope.ondel = function(){
            let obj = new Object();
            obj = {"item":"del"}
            obj.del = []
                for(i=0;i<document.menu_form.length;i++){
                    if(document.menu_form.elements[i].checked == true){
                        obj.del.push(document.menu_form.elements[i].value)
                    };
                };
            obj = Object.assign(obj,Data.login)
            myFactory.my_r("menu.php",obj,"save").then(function(){
                //$scope.result = data;//戻り値確認用
                myFactory.my_get("menu.php",Data.login).then(function(menus){
                    $scope.menus = menus
                })
            });
            
        };
    }])
        
    //slip_mane.html order.php
    .controller('DialogController',['$scope','$resource','Data','$q','myFactory',function($scope,$resource,Data,$q,myFactory){
        myFactory.my_get("order.php").then(function(order){
            $scope.simei = {}
            $scope.flg = {}
            if(Data.login.rank != -1){
                $scope.show = true
                $scope.casts = Data.casts
                $scope.simei.nam = $scope.casts[0]
                $scope.flg.syo = false
                let f = false
                for(let i=0;i<$scope.casts.length;i++){
                    if($scope.casts[i] == "初回"){
                        f = true
                    }
                }
                if(f == false){
                    $scope.casts.push("フリー")
                    $scope.casts.push("初回")
                }
            }
            order = timeSort(order,Data.op)
            $scope.simei.fn = FreeNumber(order,"slip")
            for(let i=0;i<order.length;i++){
                if(order[i].mai != ""){
                    order.splice(i,1)
                    i--
                }
            }
            $scope.simeis = order
        })
        $scope.slip_c = function(){
            if($scope.simei.nam == "初回" || $scope.simei.nam == "フリー"){
                $scope.flg.syo = true
            }else{
                $scope.flg.syo = false
            }
            if($scope.simei.fw == true){
                $scope.flg.w = true
            }else{
                $scope.flg.w = false
            }
        }
        $scope.simeiadd = function(){
            $scope.simei.chk = ""
            if($scope.simei.nam == '初回' && $scope.simei.syo == "" && $scope.simei.flag == false){
                ons.notification.alert({
                    message: '「紹介者」を入力してください。',
                    title: 'Error',
                    buttonLabel: 'OK',
                    animation: 'default',
                    callback: function() {
                    }
                });
                exit;
            }else if($scope.simei.nam == 'フリー' && Data.op.op10 == "a" && $scope.simei.syo == "" && $scope.simei.flag == false){
                ons.notification.alert({
                    message: '「紹介者」を入力してください。',
                    title: 'Error',
                    buttonLabel: 'OK',
                    animation: 'default',
                    callback: function() {
                    }
                });
                exit;
            }else if($scope.simei.flag === true){
                if($scope.simei.nam != 'フリー' && $scope.simei.name != '初回'){
                    ons.notification.alert({
                        message: '枝の場合は「担当名」を「初回」または「フリー」と入力してください。',
                        title: 'Error',
                        buttonLabel: 'OK',
                        animation: 'default',
                        callback: function() {
                        }
                    });
                    exit;
                }else if($scope.simei.syo == ""){
                    ons.notification.alert({
                        message: '紹介者名に幹の担当名を入力してください。',
                        title: 'Error',
                        buttonLabel: 'OK',
                        animation: 'default',
                        callback: function() {
                        }
                    });
                    exit;
                }else if($scope.simei.nam == '初回' && Data.op.op4 == "a" || $scope.simei.name == 'フリー' && Data.op.op5 == "a"){
                    $scope.simei.flag = "0"
                }else if($scope.simei.nam == '初回' && Data.op.op4 == "b" || $scope.simei.name == 'フリー' && Data.op.op5 == "b"){
                    $scope.simei.flag = "1"
                }
            }else if($scope.simei.nam == 'フリー' && Data.op.op10 == "a"){
                $scope.simei.flag = "0"
            }else if($scope.simei.nam == '初回'){
                $scope.simei.flag = "0"
            }
            $scope.simei.del = '0'
            if($scope.simei.syo != ""){
                $scope.simei.syo = my_replace($scope.simei.syo)
            }
            if($scope.simei.w != ""){
                $scope.simei.nam = my_replace($scope.simei.w)
                $scope.simei.w = $scope.simei.nam.split("･").length
            }
            $scope.simei = Object.assign($scope.simei,itmGet(Data))
            //送信
            
            myFactory.my_r("order.php",$scope.simei,"save").then(function(){
                myFactory.my_get("order.php").then(function(order){
                    order = timeSort(order,Data.op)
                    $scope.simei.fn = FreeNumber(order,"slip")
                    for(let i=0;i<order.length;i++){
                        if(order[i].mai != ""){
                            order.splice(i,1)
                            i--
                        }
                    }
                    $scope.simeis = order
                })
                //$scope.result = data;//戻り値確認用
                $scope.simei.nam = ""
                $scope.simei.table = ""
                $scope.simei.do = ""
                $scope.simei.new = ""
                $scope.simei.syo = ""
                $scope.simei.in = ""
                $scope.simei.flag = false
                $scope.simei.w = ""
                $scope.simei.fw = false
                $scope.simei.cnt = "1"
                
            });
        };
        $scope.simeicle = function(){
           $scope.simei.nam = ""
           $scope.simei.table = ""
           $scope.simei.do = ""
           $scope.simei.new = ""
           $scope.simei.syo = ""
           $scope.simei.flag = false
        };
        $scope.show_s = function(data){
            Data.no = data
            $scope.nav.pushPage('slip.html');
            
        };
        $scope.hold = function(simei){
            ons.notification.confirm({
                message: '項目を削除してもよろしいですか？',
                title: '確認',
                buttonLabels: ['NO','YES'],
                callback: function(itm) {
                    if(itm == 1){
                        simei = Object.assign(simei,itmGet(Data))
                        if(simei.nam == '初回'){
                            simei.del = '1'
                            myFactory.my_r("order.php",simei,"save").then(function(){
                                myFactory.my_get("order.php").then(function(order){
                                    order = timeSort(order,Data.op)
                                    $scope.simei.fn = FreeNumber(order,"slip")
                                    for(let i=0;i<order.length;i++){
                                        if(order[i].mai != ""){
                                            order.splice(i,1)
                                        }
                                    }
                                    $scope.simeis = order
                                })
                            })
                        }else{
                            simei.del = '2'
                            myFactory.my_r("order.php",simei,"save").then(function(){
                                myFactory.my_get("order.php").then(function(order){
                                    $scope.simei.fn = FreeNumber(order,"slip")
                                    for(let i=0;i<order.length;i++){
                                        if(order[i].mai != ""){
                                            order.splice(i,1)
                                        }
                                    }
                                    $scope.simeis = order
                                })
                            })
                        }
                    }
                }
            });
        }
    }])
    //test.html
    .controller('test_Controller',['$scope','$resource','Data','$q','myFactory',function($scope,$resource,Data,$q,myFactory){
        myFactory.my_get("option.php").then(function(op){
            if(Object.keys(op[0][0]).length != 0){
                Data.op = op[0][0]
                Data.time = getTime(Data)
            }else{
                //OP飛ばして入力させる
            }
            
        })
        var r = $resource('http://localhost/:work',
                                    {work:'dat_syo.php'},
                                    {'save':  {method:'POST',headers:  {'Content-Type' : 'application/x-www-form-urlencoded;application/json;charset=utf-8'}},
                                    'delete': {method:'DELETE',headers:{'Content-Type' : 'application/x-www-form-urlencoded;application/json;charset=utf-8'}}}         
                                );
                                /*
        $scope.on_add = function(){
            $scope.nav.pushPage('slip_mane.html');
        }
        $scope.on_del = function(){
            $scope.nav.pushPage('slip_mane.html');
        }*/
        $scope.on1 = function(){
            modal.show();
    setTimeout('modal.hide()', 2000);
            //$scope.nav.pushPage('slip_mane.html');
        }
        $scope.on2 = function(){
            $scope.nav.pushPage('dat.html');
        }
        $scope.on3 = function(){
            $scope.nav.pushPage('dat_syo.html');
        }
        $scope.on4 = function(){
            $scope.nav.pushPage('dat_sou.html');
        }
        $scope.on5 = function(){
            $scope.nav.pushPage('option.html');
        }
        $scope.on6 = function(){
            $scope.nav.pushPage('cast.html');
        }
        $scope.on7 = function(){
            $scope.nav.pushPage('cre.html');
        }
        $scope.on8 = function(){
            $scope.nav.pushPage('dat_dil.html');
        }
        $scope.on9 = function(){
            $scope.nav.pushPage('salary_s.html');
        }
        $scope.on10 = function(){
            $scope.nav.pushPage('no_t.html');
        }
        $scope.on11 = function(){
            $scope.nav.pushPage('pay_s.html');
        }
        $scope.on12 = function(){
            $scope.nav.pushPage('cast_c.html');
        }
        $scope.on13 = function(){
            $scope.nav.pushPage('login.html');
        }
        $scope.on14 = function(){
            $scope.nav.pushPage('pass_change.html');
        }
        $scope.on15 = function(){
            $scope.nav.pushPage('home.html');
        }
    }])
    
    
    //-------------------------------------------
    //オプションにある営業時間を参照し、日にちを返す
    //Data : オプション , my_now : 給料計算用
    //-------------------------------------------
    function getTime(Data,key,my_now){
        if(Data != undefined){
            moment.defaultFormat = 'YYYYMMDD'
            let now = moment()
            let time = new Array
            if(Data.op.op6 - 1 > now.hours()){
                time.ymd = now.clone().add('days',-1).format()
            }else{
                time.ymd = now.format()
            }
            
            if(Data.op.op6 - 1 > now.hours() && now.date() == 1){
                time.ym = now.clone().add('month',-1).format('YYYYMM')
            }else{
                time.ym = now.format('YYYYMM')
            }
            
            if(Data.op.op6 - 1 > now.hours() && now.month()+1 == 1){
                if(now.date() == 1){
                    time.y = now.clone().add('year',-1).format('YYYY')    
                }else{
                    time.y = now.format('YYYY')
                }
            }else{
                time.y = now.format('YYYY')
            }
            if(my_now != undefined){//来月
                now = moment(my_now,'YYYYMMDD')
                time.next_m = now.clone().add('month',1).format('YYYYMM')
            }
            if(key != undefined){//データ型で渡す
                time = moment(time.ymd,"YYYYMMDD")
            }
            return time
        }else{//渡されたdateオブジェクトを分割して返す
            let w = {}
            if(key == undefined){
                if(my_now != undefined){
                    w.y = String(my_now.getFullYear())
                    if(my_now.getMonth()+1 < 10){
                        w.ym = w.y + "0" + String((my_now.getMonth()+1))
                    }else{
                        w.ym = w.y + String((my_now.getMonth()+1))
                    }
                    if(my_now.getDate() < 10){
                        w.ymd = w.ym + "0" + String(my_now.getDate())
                    }else{
                        w.ymd = w.ym + String(my_now.getDate())
                    }
                }else{
                    let now = moment()
                    w.ymd = now.format('YYYYMMDD')
                    w.ym = now.format('YYYYMM')
                    w.y = now.format('YYYY')
                    return w
                }
            }else{//渡された文字列を分割して返す
                w.y = my_now.substr(0,4)
                w.ym = my_now.substr(0,6)
            }
            return w
        }
    }

    //文字列を"･"に置き換える
    function my_replace(str){
        while(str.indexOf("。",0) != -1){
            str = str.replace("。","･")
        }
        while(str.indexOf("｡",0) != -1){
            str = str.replace("｡","･")
        }
        while(str.indexOf(".",0) != -1){
            str = str.replace(".","･")
        }
        return str
    }
    //文字列を"･"で分割
    function my_split(itm,word){
        for(let i=0;i<itm.length;i++){
            let cnt = 0
            if(itm[i][word].length > 0){
                for(let y=0;y<itm[i][word].length;y++){
                    let work = []
                    if(itm[i][word][y][word] === itm[i].nam){
                        cnt += itm[i][word][y].cnt
                    }else{
                        work = itm[i][word][y][word].split("･")
                        for(let z=0;z<work.length;z++){
                            if(work[z] === itm[i].nam){
                                cnt++
                            }
                        }
                    }
                }
                itm[i][word] = cnt
            }
        }
        return itm
    }
    //日付修正
    function my_time(itm,Data){
        if(itm.month < 10 && itm.month != ''){
            itm.month = '0' + itm.month
        }else if(itm.month == ''){
            itm.month = getTime(Data).ym.substr(4)
        }
        if(itm.day < 10 && itm.day != ''){
            itm.day = '0' + itm.day
        }else if(itm.day == ''){
            itm.day = getTime(Data).ymd.substr(6)
        }
        if(itm.year == '' && itm.month != '' && itm.day != ''){
            itm.year = getTime(Data).y
        }
        return itm
    }
    //合計
    function my_sum(orders,itm){
        let t1 = 0
        let t2 = 0
        let total = 0
        for(let i=0;i<orders.length;i++){
            if(orders[i].cls == 0 || orders[i].cls == 1){
                t1 += orders[i].pri * orders[i].cnt
            }else{
                t2 += orders[i].pri * orders[i].cnt
            }
        }
        if(itm.op.op1 < 10){
            total = t1 + (t2 * ("1.0" + itm.op.op1))
        }else if(itm.op.op1 > 9){
            total = t1 + (t2 * ("1." + itm.op.op1))
        }
        if(itm.op.op3 == "a"){//上げ
            if(itm.op.op2 == 1){
                total = Math.ceil(total / 10)
                total *= 10
            }else if(itm.op.op2 == 2){
                total = Math.ceil(total / 100)
                total *= 100
            }else if(itm.op.op2 == 3){
                total = Math.ceil(total / 1000)
                total *= 1000
            }
        }else if(itm.op.op3 == "b"){//捨て
            if(itm.op.op2 == 1){
                total = Math.floor(total / 10)
                total *= 10
            }else if(itm.op.op2 == 2){
                total = Math.floor(total / 100)
                total *= 100
            }else if(itm.op.op2 == 3){
                total = Math.floor(total / 1000)
                total *= 1000
            }
        }else if(itm.op.op3 == "c"){//五入
            if(itm.op.op2 == 1){
                total = Math.floor(total / 10)
                total *= 10
            }else if(itm.op.op2 == 2){
                total = Math.floor(total / 100)
                total *= 100
            }else if(itm.op.op2 == 3){
                total = Math.floor(total / 1000)
                total *= 1000
            }
        }
        return total
    }
    //--------------------------------------------
    // Sort Object's Array by key
    //   ary   : Array [{},{},{}...]
    //   key   : string
    //   order : string "asc"(default) or "desc"
    //--------------------------------------------
    function getCard(card,Data){
        let card2 = 0
        if(Data.op.op7 < 10){
            card2 = card * ("1.0" + Data.op.op7)
        }else if(Data.op.op7 > 9){
            card2 = card * ("1." + Data.op.op7)
        }
        if(Data.op.op3 == "a"){//上げ
            if(Data.op.op2 == 1){
                card2 = Math.ceil(card2 / 10)
                card2 *= 10
            }else if(Data.op.op2 == 2){
                card2 = Math.ceil(card2 / 100)
                card2 *= 100
            }else if(Data.op.op2 == 3){
                card2 = Math.ceil(card2 / 1000)
                card2 *= 1000
            }
        }else if(Data.op.op3 == "b"){//捨て
            if(Data.op.op2 == 1){
                card2 = Math.floor(card2 / 10)
                card2 *= 10
            }else if(Data.op.op2 == 2){
                card2 = Math.floor(card2 / 100)
                card2 *= 100
            }else if(Data.op.op2 == 3){
                card2 = Math.floor(card2 / 1000)
                card2 *= 1000
            }
        }else if(Data.op.op3 == "c"){//五入
            if(Data.op.op2 == 1){
                card2 = Math.floor(card2 / 10)
                card2 *= 10
            }else if(Data.op.op2 == 2){
                card2 = Math.floor(card2 / 100)
                card2 *= 100
            }else if(Data.op.op2 == 3){
                card2 = Math.floor(card2 / 1000)
                card2 *= 1000
            }
        }
        return card2
    }
    //--------------------------------------------
    // カード手数料分を返す
    //   card   : str
    //   Data   : obj
    //   flg : int
    //--------------------------------------------
    function getCard2(card,Data){
        let card2 = 0
        if(Data.op.op7 < 10){
            card2 = card - (card / ("1.0" + Data.op.op7))
        }else if(Data.op.op7 > 9){
            card2 = card - (card / ("1." + Data.op.op7))
        }
        if(Data.op.op3 == "a"){//上げ
            if(Data.op.op2 == 1){
                card2 = Math.ceil(card2 / 10)
                card2 *= 10
            }else if(Data.op.op2 == 2){
                card2 = Math.ceil(card2 / 100)
                card2 *= 100
            }else if(Data.op.op2 == 3){
                card2 = Math.ceil(card2 / 1000)
                card2 *= 1000
            }
        }else if(Data.op.op3 == "b"){//捨て
            if(Data.op.op2 == 1){
                card2 = Math.floor(card2 / 10)
                card2 *= 10
            }else if(Data.op.op2 == 2){
                card2 = Math.floor(card2 / 100)
                card2 *= 100
            }else if(Data.op.op2 == 3){
                card2 = Math.floor(card2 / 1000)
                card2 *= 1000
            }
        }else if(Data.op.op3 == "c"){//五入
            if(Data.op.op2 == 1){
                card2 = Math.floor(card2 / 10)
                card2 *= 10
            }else if(Data.op.op2 == 2){
                card2 = Math.floor(card2 / 100)
                card2 *= 100
            }else if(Data.op.op2 == 3){
                card2 = Math.floor(card2 / 1000)
                card2 *= 1000
            }
        }
        return card2
    }
    //--------------------------------------------
    // Sort Object's Array by key
    //   ary   : Array [{},{},{}...]
    //   key   : string
    //   order : string "asc"(default) or "desc"
    //--------------------------------------------
    function ObjArraySort(ary, key, order) {
        let reverse = 1;
        let obj = {}
        if(order && order.toLowerCase() == "desc") 
            reverse = -1;
        ary = Object.keys(ary).map(function(key,work){
            if(isNaN(key) == false){
                return ary[key]
            }
        })
        ary.some(function(v,i){
            if(v == undefined )ary.splice(i,5)
        })
        ary.sort(function(a,b) {
            if(a[key] < b[key])
                return -1 * reverse;
            else if(a[key] == b[key])
                return 0;
            else
                return 1 * reverse;
        });
        for(let key in ary){
            obj[key] = ary[key]
        }
         return obj
    }
    //----------------------------------
    //配列の空き番号を出力
    //ary : 配列 itm : str
    //---------------------------------
    function FreeNumber(ary,itm){
        let work = []
        let cnt = 0
        let y = 0
        let i
        if(itm == "slip"){
            i = 1
        }else{
            work = []
            i = 0
        }
        for(;cnt<ary.length;i++){
            if(ary[cnt].no.substr(9) != i){
                for(y=i;y<ary[cnt].no.substr(9);y++){
                    work.push(y)
                }
                i = y
            }
            cnt++
        }
        return work
    }
    //----------------------------------
    //配列の空き番号を出力
    //ary : 配列,itm : 文字列
    //---------------------------------
    function timeSort(ary,op){
        let work = []
        ary.sort(function(a,b){
            return(a.in>b.in ? 1:-1)
        })
        for(let i=0;i<ary.length;i++){
            if(ary[i].in < op.op6+":00"){
                work.push(ary[i])
                ary.splice(i,1)
                i--
                
            }
        }
        for(let i=0;i<work.length;i++){
            ary.push(work[i])
        }
        return ary
    }
    //----------------------------------
    //引き渡された様々な情報を取得
    //itm : etc
    //---------------------------------
    function log(itm){
        let work = {}
        console.log(itm)
        work.name = "itm = "+itm
        work.type = typeof itm
        work.len = itm.length
        work.objlen = Object.keys(itm).length
        return work
    }
    //----------------------------------
    //使用されているキャストを配列に納める
    //itm : array,obj
    //---------------------------------
    function castGet(itm){
        let work = []
        for(let i=0;i<itm.length;i++){          
            if(itm[i].NAME != ""){       
                work.push(itm[i].NAME)
            }
        }
        return work
    }
    //----------------------------------
    //掛け表を配列に納める
    //ary : objarray, my_nam : name 
    //my_gue : guest, Data : Data
    //---------------------------------
    function creGet(ary,my_nam,my_gue,Data){
        let cre = []
        if(my_gue == undefined){
            my_gue = ""
        }
        for(let y=String(Data.op.key).substr(0,4);y<=Data.login.y;y++){
            Object.keys(ary[y]).forEach(function(key){
                for(let i=0;i<ary[y][key].length&&i<10;i++){//
                    console.log(i)
                    if(ary[y][key][i].nam.split("･").length > 1){
                        let w = ary[y][key][i].nam.split("･")
                        for(let z=0;z<w.length;z++){
                            //ary[y][key].splice(i,1,{no:ary[y][key][i].no,nam:w[z],cre:ary[y][key][i].cre/w.length,gue:ary[y][key][i].gue})
                            ary[y][key].push({no:ary[y][key][i].no,nam:w[z],cre:ary[y][key][i].cre/w.length,gue:ary[y][key][i].gue})
                        }
                    }
                    if(ary[y][key][i].nam == my_nam && my_gue == ""){
                        ary[y][key][i].no = ary[y][key][i].no.substr(0,8)
                        cre.push(ary[y][key][i])
                    }else if(ary[y][key][i].nam == my_nam && ary[y][key][i].gue == my_gue){
                        cre.push(ary[y][key][i])
                    }
                    
                }
            })
        }
        return cre
    }
    //----------------------------------
    //掛け表の重複指名を一つにまとめ合計を加算
    //ary : objarray, method : all,this,last
    //---------------------------------
    function creSum(ary,method,Data){
        if(method == "this"){
            let cre = []
            let work = []
            for(let i=ary.length-1;i != -1 && ary[i].no.substr(0,6) == Data.login.ym;i--){
                work.push(ary[i])
            }
            ary = work
            
        }else if(method == "last"){
            let cre = []
            for(let i=ary.length-1;0 <= i && ary[i].no.substr(0,6) == Data.login.ym;i--){
                ary.splice(i,1)
            }
        }
        for(let i=0;i<ary.length;i++){
            for(let y=i+1;y<ary.length;y++){
                if(ary[i].gue == ary[y].gue){
                    ary[i].cre += ary[y].cre
                    ary.splice(y,1)
                    y--
                }
            }
        }
        return ary
    }
        //----------------------------------
    //入金を配列に納める
    //ary : objarray, my_nam : name
    //my_gue : guest, Data : Data
    //---------------------------------
    function payGet(ary,my_nam,my_gue,Data){
        let pay = []
        if(my_gue == undefined){
            my_gue = ""
        }
        for(let y=String(Data.op.key).substr(0,4);y<=Data.login.y;y++){
            for(let i=0;i<ary[y].length;i++){
                if(ary[y][i].nam == my_nam && my_gue == ""){
                    ary[y][i].no = ary[y][i].no.substr(0,8)
                    pay.push(ary[y][i])
                }else if(ary[y][i].nam == my_nam && ary[y][i].gue == my_gue){
                    pay.push(ary[y][i])
                }
            }
        }
        return pay
    }
    //----------------------------------
    //入金の重複指名を一つにまとめ合計を加算
    //ary : objarray, my_nam : name my_gue : guest
    //---------------------------------
    function paySum(ary,method,Data){
        if(ary.length != 0){
            if(method == "this"){
                let cre = []
                let work = []
                for(let i=ary.length-1;i != -1 && ary[i].no.substr(0,6) == Data.login.ym ;i--){
                    if(ary[i].flg == "0"){
                        work.push(ary[i])
                    }
                }
                ary = work
            }else if(method == "last"){
                let cre = []
                for(let i=ary.length-1;0<=i && ary[i].no.substr(0,6) == Data.login.ym;i--){
                    if(ary[i].flg == "0"){
                        ary.splice(i,1)
                    }
                }
            }
            for(let i=0;i<ary.length;i++){
                for(let y=i+1;y<ary.length;y++){
                    if(ary[i].gue == ary[y].gue){
                        ary[i].pay += ary[y].pay
                        ary.splice(y,1)
                        y--
                    }
                }
            }
        }
        return ary
    }
        /*
        if(method == "all"){
            for(let i=0;i<ary.length;i++){
                for(let y=i+1;y<ary.length;y++){
                    if(ary[i].gue == ary[y].gue){
                        ary[i].pay += ary[y].pay
                        ary.splice(y,1)
                    }
                }
            }
        }else if(method == "this"){
            for(let i=ary.length-1;ary[i].no.substr(0,6) == Data.login.ym;i--){
                for(let y=i-1;y<=0;y--){
                    if(ary[i].gue == ary[y].gue){
                        ary[i].cre += ary[y].cre
                        ary.splice(y,1)
                    }
                }
            }
        }else if(method == "last"){
            for(let i=0;ary[i].no.substr(0,6) != Data.login.ym;i++){
                for(let y=i+1;y<ary.length;y++){
                    if(ary[i].gue == ary[y].gue){
                        ary[i].cre += ary[y].cre
                        ary.splice(y,1)
                    }
                }
            }
        }
        return ary
    }*/
    //----------------------------------
    //掛けと入金のゲストの名前が一致するするものを掛配列に移す
    //cre : crearray, pay : payarray, method :str, Data : Data
    //---------------------------------
    function addAry(cre,pay,method,Data){
        let work = pay
            for(let i=0;i<cre.length;i++){
                for(let y=0;y<work.length;y++){
                    if(cre[i].gue == work[y].gue){
                        cre[i].pay = work[y].pay
                        cre[i].rem = cre[i].cre - cre[i].pay
                        work.splice(y,1)
                    }
                }
            }
        return cre
    }
    //----------------------------------
    //オブジェクトの特定keyを加算する
    //obj : object , key : string
    //flg : 1 or 2(数値or文字列)
    //---------------------------------
    function objAdd(obj,key,flg,nam){//test5
        let work = 0
        if(obj.length != 0 && obj.length != undefined){
            if(flg == "1"){
                if(key != "sub" && key != "cnt" && key != "dou" && key != "cre" && key != "jib"){
                    for(let i=0;i<obj.length;i++){
                        work += Number(obj[i][key])
                    }
                }else if(key == "sub" || key == "cre" || key == "jib"){
                    for(let i=0;i<obj.length;i++){
                        if(obj[i].nam == nam && obj[i].many == null){
                            work += Number(obj[i][key])
                        }else{
                            let w = obj[i].nam.split("･")
                            for(let z=0;z<w.length;z++){
                                if(w[z] == nam){
                                    work += Number(obj[i][key] / obj[i].many)
                                }
                            }
                        }
                    }
                }else{
                    for(let i=0;i<obj.length;i++){
                        if(obj[i].nam == nam && obj[i].many == null){
                            work += Number(obj[i][key])
                        }else{
                            let w = obj[i].nam.split("･")
                            for(let z=0;z<w.length;z++){
                                if(w[z] == nam){
                                    work += Number(obj[i][key])
                                }
                            }
                        }
                    }
                }
            }else if(flg == "2"){
                work = obj.length
            }
        }else if(Object.keys(obj).length != 0){
            Object.keys(obj).forEach(function(i){
                work +=obj[i].pri
            })
        }
        return Number(work)
    }
    //----------------------------------
    //給料システムの条件に合う値を返す
    //obj : 給料システム , sub : 値
    //id : str , flg : 売上バック
    //---------------------------------
    function valueCondition(obj,sub,id,bac){
        let flg = 0
        let work
        if(bac != undefined){
            for(let i=0;i<obj.length;i++){
                if(obj[i].id == id && sub >= obj[i].min && sub <= obj[i].max){
                    work = obj[i].bac
                    flg = 1
                }
            }
        }else{
            for(let i=0;i<obj.length;i++){
                if(obj[i].id == id && sub >= obj[i].min && sub <= obj[i].max){
                    work = obj[i].pri
                    flg = 1
                }
            }
        }
        if(flg == 0){
            work = 0
        }
        return Number(work)
    }
    //----------------------------------
    //入金締日範囲内の数値を返す
    //obj : 入金データ , op : 入金締日
    //mon : 今月 , next_m : 来月
    //---------------------------------
    function dcd(obj,op,this_m,next_m){
        let work = 0
        for(let i=0;i<obj.length;i++){
            if(obj[i].no.substr(0,6) == this_m){
                work += obj[i].pay
            }else if(obj[i].no <= next_m + op){
                work += obj[i].pay
            }
        }
        return Number(work)
    }
    //----------------------------------
    //文字列がfalseなら0を返す
    //str : 文字列
    //---------------------------------
    function checkFalse(str){
        let work = 0
        if(str != false && str != undefined){
            work = str
        }
        return work
    }
    //----------------------------------
    //アラート
    //myTitle : title , str : アラート文字列
    //btn : クリック文字
    //---------------------------------
    function myAlert(myTitle,str,btn){
        if(myTitle != undefined && str != undefined && btn != undefined){
            ons.notification.alert({
                title: myTitle,
                messageHTML: str,
                buttonLabel: btn
            })
        }
    }
    //----------------------------------
    //月別経費を分ける
    //obj : etc
    //---------------------------------
    function m_cosGet(obj){
        let work = {min:0,set:0,ryo:0,ren:0,sou:0,cle:0,mei:0,cp:0,exc:[]}
        for(let i=0;i<obj.length;i++){
            if(obj[i].itm == "給料マイナス"){
                work.min = obj[i].pri
            }else if(obj[i].itm == "ヘアセット"){
                work.set = obj[i].pri
            }else if(obj[i].itm == "寮"){
                work.ryo = obj[i].pri
            }else if(obj[i].itm == "レンタル"){
                work.ren = obj[i].pri
            }else if(obj[i].itm == "送迎"){
                work.sou = obj[i].pri
            }else if(obj[i].itm == "クリーニング"){
                work.cle = obj[i].pri
            }else if(obj.itm == "名刺"){
                work.mei = obj[i].pri
            }else if(obj[i].itm == "キャンペーン"){
                work.cp = obj[i].pri
            }else{
                work.exc.push({nam:obj[i].nam,itm:obj[i].itm,pri:obj[i].pri})
            }
        }
        return work
    }
    //----------------------------------
    //開始年月から現在年月までの月を返す
    //start : 開始年月 , ym : 現在年月
    //---------------------------------
    function pay_s_ymGet(start,ym){
        let w = []
        for(let now = moment(start,"YYYYMM").subtract("month",1);now.format("YYYYMM") != ym;){
            w.unshift(now.add("month",1).format("YYYYMM"))
        }
        return w
    }
    //----------------------------------
    //来月を返す
    //str : 年月
    //---------------------------------
    function next_m(str){
        let now = moment(str,"YYYYMM")
         return now.add("month",1).format("YYYYMM")
    }
    //----------------------------------
    //送信物の前準備
    //Data : option
    //---------------------------------
    function itmGet(Data){
        let w = {}
        w.y = Data.login.y
        w.ym = Data.login.ym
        w.ymd = Data.login.ymd
        w.db = Data.login.db
        w.id = Data.login.id
        w.pass = Data.login.pass
        return w
    }