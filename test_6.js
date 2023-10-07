/*
 *<現在の進捗>
 *理論上、線の消去＋0から作る　→　put_line関数でスキップできる　が時間が余ったら行う　
 *なぜか４つ目以降のnext要素を取得できない（nullが返される）
 *  
 *接続作業時：クラス名を見てどのゲートか判断
 *<解決策>
 */

function buttonClick(i){
    //div要素を作成
    set_items = document.createElement('img');

    /* 論理素子test6.js */
    let type;

    //div要素のパラメータ設定
    set_items.draggable = true;
    set_items.className = 'set_items';
    switch(i){
        case 0:
            set_items.classList.add('NOT');
            set_items.src = "NOT.png";
            type = 'not';
            break;
        case 1:
            set_items.classList.add('OR');
            set_items.src = "OR.png";
            type = 'or';
            break;
        case 2:
            set_items.classList.add('AND');
            set_items.src = "AND.png";
            type = 'and';
            break;
        case 3:
            set_items.classList.add('NOR');
            set_items.src = "NOR.png";
            type = 'nor';
            break;
        case 4:
            set_items.classList.add('NAND');
            set_items.src = "NAND.png";
            type = 'nand';
            break;
        case 5:
            set_items.classList.add('EXOR');
            set_items.src = "EXOR.png";
            type = 'xor';
            break;
        case 6:
            set_items.classList.add('Switch');
            set_items.classList.add('OFF');
            set_items.src = "Switch_OFF.png";
            type = 'button';
            break; 
        case 7:
            set_items.classList.add('LED');
            set_items.classList.add('OFF');
            set_items.src = "LED_OFF.png";
            type = 'led';
            break;
    }
    set_items.classList.add('pointer');

    /* 論理素子test6.js */
    LogicCircuit.create(set_items, type);
    console.log(LogicCircuit.allGates);

    //containerを親にして、div要素を子に設定
    container.appendChild(set_items);

    //クリックでイベントにコールバック
    set_items.addEventListener("mousedown", mdown, false);
    set_items.addEventListener("touchstart", mdown, false);
}

//リセットボタンクリックで発火
function removeClick(){
    remove_judge = true;
}


//要素に対してマウスが押された際の関数
function mdown(e) {
    //タッチイベントとマウスのイベントの差異を吸収
    if(e.type === "mousedown") {
        let event = e;
    } else {
        let event = e.changedTouches[0];
    }

    //要素内の相対座標を取得
    items_left = this.offsetLeft;
    items_top = this.offsetTop;
    x = e.pageX - items_left;
    y = e.pageY - items_top;

    if(remove_judge){
        //この要素につながる線が存在する場合すべて削除する
        if(this.classList.contains('connecting')){
            for(let i=1;i<j+1;i++){
                if(this===connecting_items[i][0]){
                    connecting_items[i][0].remove();
                    removeLines(connecting_items[i][2],connecting_items[i][3],connecting_items[i][4]);
                    //つながっていた要素の状態を変更する
                    connecting_items[i][1].classList.remove('connecting');
                    //つながっている状態の要素の配列から削除する
                    connecting_items[i].splice(0,4);
                }else if(this===connecting_items[i][1]){
                    connecting_items[i][1].remove();
                    removeLines(connecting_items[i][2],connecting_items[i][3],connecting_items[i][4]);
                    //つながっていた要素の状態を変更する
                    connecting_items[i][0].classList.remove('connecting');
                    //つながっている状態の要素の配列から削除する
                    connecting_items[i].splice(0,5);
                }
            }
        }else{
            this.remove();
        }
        remove_judge = false;
        /* 論理素子test6.js */
        LogicCircuit.allGates.find(e => e._image==this).delete();
        console.log(LogicCircuit.allGates);
    }else if(items_width/7<=x && x<=items_width*6/7){
        //クラス名に .drag を追加
        this.classList.remove("pointer");
        this.classList.add("drag");

        //ムーブイベントにコールバック
        document.body.addEventListener("mousemove", mmove, false);
        document.body.addEventListener("touchmove", mmove, false);
    }else if(x<items_width/7){
        //LEDのON,OFF制御
        if(this.classList.contains('Switch')){
            if(this.classList.contains('ON')){
                this.src = "Switch_OFF.png";
                LogicCircuit.allGates.find(e => e._image==this).set(0);
            }else{
                this.src = "Switch_ON.png";
                LogicCircuit.allGates.find(e => e._image==this).set(1);
            }
            LogicCircuit.allGates.forEach( e => console.log(e) );
            this.classList.toggle('ON');
            this.classList.toggle('OFF');
        }else{
            input_item = this;

            //線の終点決定
            x2_ = items_left;
            if(this.classList.contains('NOT') || this.classList.contains('Switch') || this.classList.contains('LED')){
                y2_ = items_top+items_height/2;
                INnum = 0;
            }else if(y<=items_height/2){
                y2_ = items_top+items_height/4;
                INnum = 1;
            }else{
                y2_ = items_top+items_height*3/4-3;
                INnum = 2;
            }
        }
    }else{
        //線の始点決定
        x1_ = items_left+items_width;
        y1_ = items_top+items_height/2;
        output_item = this;
    }
    //始点と終点が決まったら線を引く
    if(x1_ && x2_){
        newitem = true;
        make_line(x1_,y1_,x2_,y2_);
        x1_ = 0;
        y1_ = 0;
        x2_ = 0;
        y2_ = 0;
        j+=1;
        newitem = false;
    }
}

//マウスカーソルが動いたときに発火
function mmove(e) {

    //ドラッグしている要素を取得
    let drag = document.getElementsByClassName("drag")[0];

    //同様にマウスとタッチの差異を吸収
    if(e.type === "mousemove") {
        let event = e;
    } else {
        let event = e.changedTouches[0];
    }

    //フリックしたときに画面を動かさないようにデフォルト動作を抑制
    e.preventDefault();

    //マウスが動いた場所に要素を動かす
    drag.style.top = e.pageY - y + "px";
    drag.style.left = e.pageX - x + "px";

    //マウスボタンが離されたとき、またはカーソルが外れたとき発火
    drag.addEventListener("mouseup", mup, false);
    document.body.addEventListener("mouseleave", mup, false);
    drag.addEventListener("touchend", mup, false);
    document.body.addEventListener("touchleave", mup, false);
}

//マウスボタンが上がったら発火
function mup(e) {
    let drag = document.getElementsByClassName("drag")[0];


    //動かしている要素が線とつながっているときに発火
    for(let i=1;i<j+1;i++){
        if(this===connecting_items[i][0]){
            if(connecting_items[i][2].classList.contains('IN0')){
                INnum = 0;
                y2_ = connecting_items[i][1].offsetTop+items_height/2;
            }else if(connecting_items[i][2].classList.contains('IN1')){
                INnum = 1;
                y2_ = connecting_items[i][1].offsetTop+items_height/4;
            }else{
                INnum = 2;
                y2_ = connecting_items[i][1].offsetTop+items_height*3/4-3;
            }
            x1_ = this.offsetLeft+items_width;
            y1_ = this.offsetTop+items_height/2;
            x2_ = connecting_items[i][1].offsetLeft;
            removeLines(connecting_items[i][2],connecting_items[i][3],connecting_items[i][4]);
            make_line(x1_, y1_, x2_, y2_);
            connecting_items[i][2] = yline_memory;
            connecting_items[i][3] = yline2_memory;
            connecting_items[i][4] = xline_memory;
        }else if(this===connecting_items[i][1]){
            if(connecting_items[i][2].classList.contains('IN0')){
                INnum = 0;
                y2_ = connecting_items[i][1].offsetTop+items_height/2;
            }else if(connecting_items[i][2].classList.contains('IN1')){
                INnum = 1;
                y2_ = this.offsetTop+items_height/4;
            }else{
                INnum = 2;
                y2_ = this.offsetTop+items_height*3/4-3;
            }
            x1_ = connecting_items[i][0].offsetLeft+items_width;
            y1_ = connecting_items[i][0].offsetTop+items_height/2;
            x2_ = this.offsetLeft;
            removeLines(connecting_items[i][2],connecting_items[i][3],connecting_items[i][4]);
            make_line(x1_, y1_, x2_, y2_);
            connecting_items[i][2] = yline_memory;
            connecting_items[i][3] = yline2_memory;
            connecting_items[i][4] = xline_memory;
        }
    }
    x1_=y1_=x2_=y2_=0;

    //ムーブベントハンドラの消去
    document.body.removeEventListener("mousemove", mmove, false);
    drag.removeEventListener("mouseup", mup, false);
    document.body.removeEventListener("touchmove", mmove, false);
    drag.removeEventListener("touchend", mup, false);

    //クラス名 .drag も消す
    drag.classList.remove("drag");
    drag.classList.add("pointer");
}


//縦線要素に対してマウスが押された際の関数
function yline_down(e){
    
    //クラス名に .drag を追加
    this.classList.remove("pointer");
    this.classList.add("drag");

    //タッチイベントとマウスのイベントの差異を吸収
    if(e.type === "mousedown") {
        let event = e;
    } else {
        let event = e.changedTouches[0];
    }
    
    //要素内の相対座標を取得
    items_left = this.offsetLeft;
    items_top = this.offsetTop;
    x = e.pageX - items_left;
    y = e.pageY - items_top;


    //リセットが押されると1セットの線要素を削除
    if(remove_judge){
        for(let i=1;i<j+1;i++){
            if(this===connecting_items[i][2]){
                removeLines(connecting_items[i][2],connecting_items[i][3],connecting_items[i][4]);
                //つながっていた要素の状態を変更する
                connecting_items[i][0].classList.remove('connecting');
                connecting_items[i][1].classList.remove('connecting');
                //つながっている状態の要素の配列から削除する
                connecting_items[i].splice(0,4);
                /* 論理素子test6.js */
                LogicCircuit.allGates.find(e => e._image==connecting_items[i][1]).disconnect(connecting_items[i][0]);
                console.log(LogicCircuit.allGates);
                // [0]がoutputと[1]がinput
            }
        }
        remove_judge = false;
    }else{
        //ムーブイベントにコールバック
        document.body.addEventListener("mousemove", yline_move, false);
        document.body.addEventListener("touchmove", yline_move, false);
    }
}

//縦線要素に対してマウスカーソルが動いたときに発火
function yline_move(e) {

    //ドラッグしている要素を取得
    let drag = document.getElementsByClassName("drag")[0];

    //同様にマウスとタッチの差異を吸収
    if(e.type === "mousemove") {
        let event = e;
    } else {
        let event = e.changedTouches[0];
    }

    //フリックしたときに画面を動かさないようにデフォルト動作を抑制
    e.preventDefault();

    //マウスが動いた場所に要素を動かす
    drag.style.left = e.pageX - x + "px"; 

    output_left = parseInt(drag.previousElementSibling.style.left);
    output_top = parseInt(drag.previousElementSibling.style.top);
    input_right = parseInt(drag.nextElementSibling.style.left) + parseInt(drag.nextElementSibling.style.width);
    input_top = parseInt(drag.nextElementSibling.style.top);
    //アウトプット線よりもインプット線が高いときに入れ替える
    if(input_top - output_top < 0){
        let changeitems = output_top;
        output_top = input_top;
        input_top = changeitems;
    }

    //元の線要素の高さと幅からマウスが外れた場合に動かなくする
    if(e.pageX - x <= output_left || input_right <= e.pageX - x || e.pageY <= output_top || input_top <= e.pageY){
        document.body.removeEventListener("mousemove", yline_move, false);
        document.body.removeEventListener("touchmove", yline_move, false);
        drag.classList.remove("drag");
        drag.classList.add('pointer');
    }

    //横線の幅と座標調整
    drag.previousElementSibling.style.width = e.pageX - x - output_left + "px";
    drag.nextElementSibling.style.left = e.pageX - x + "px";
    drag.nextElementSibling.style.width = input_right - (e.pageX - x) + "px";
    
    //マウスボタンが離されたとき、またはカーソルが外れたとき発火
    drag.addEventListener("mouseup", yline_up, false);
    document.body.addEventListener("mouseleave", yline_up, false);
    drag.addEventListener("touchend", yline_up, false);
    document.body.addEventListener("touchleave", yline_up, false);
}

//縦線要素に対してマウスボタンが上がったら発火
function yline_up(e) {
    let drag = document.getElementsByClassName("drag")[0];

    //ムーブベントハンドラの消去
    document.body.removeEventListener("mousemove", yline_move, false);
    drag.removeEventListener("mouseup", yline_up, false);
    document.body.removeEventListener("touchmove", yline_move, false);
    drag.removeEventListener("touchend", yline_up, false);

    //クラス名 .drag も消す
    drag.classList.remove("drag");
    drag.classList.add("pointer");
}


//線要素の生成
function make_line(x1,y1,x2,y2){
    let xy_line = [];
    if(x1<x2){
        for(let i=0;i<3;i++){
            xy_line[i] = document.createElement('div');
            if(i===1){                               //線要素2つ目のみ縦線設定
                xy_line[i].className = 'y_lines';
                xy_line[i].classList.add('pointer');
                lines_container.appendChild(xy_line[i]);
            }else{                                  //線要素1,3つ目横線設定
                xy_line[i].className = 'x_lines';
                lines_container.appendChild(xy_line[i]);
            }
        }

        //縦線にクリックイベントを追加
        xy_line[1].addEventListener("mousedown", yline_down, false);

        xy_line[3] = xy_line[4] = null;
    }else{
        for(let i=0;i<5;i++){
            xy_line[i] = document.createElement('div');
            if(i===1 || i===3){                               //線要素2つ目のみ縦線設定
                xy_line[i].className = 'y_lines';
                lines_container.appendChild(xy_line[i]);
            }else{                                  //線要素1,3つ目横線設定
                xy_line[i].className = 'x_lines';
                lines_container.appendChild(xy_line[i]);
            }
        }
    }

    let lines_ = xy_line;

    //線がつながってるかどうか区別するクラス追加
    output_item.classList.add('connecting');
    input_item.classList.add('connecting');

    //どちらの入力につながってるか判別
    if(INnum===0){
        xy_line[1].classList.add('IN0');
    }else if(INnum===1){
        xy_line[1].classList.add('IN1');
    }else if(INnum===2){
        xy_line[1].classList.add('IN2');
    }
    
    if(newitem){
        //つながっていなかったら配列に追加
        connecting_items.push([output_item,input_item,xy_line[1],xy_line[3],xy_line[4]]);
        /* 論理素子test6.js */
        LogicCircuit.allGates.find(e => e._image==input_item).set(
            [LogicCircuit.allGates.find(e => e._image==output_item)]
        );
        console.log(LogicCircuit.allGates.find( e => e._image==output_item ));
        console.log('connect!, ', LogicCircuit.allGates.find(e => e._image==input_item).inPins);
    }

    //要素移動時に縦線と要素を紐づけるための記憶
    yline_memory = xy_line[1];
    yline2_memory = xy_line[3];
    xline_memory = xy_line[4];
    
    //線要素に長さと座標設定
    put_line(x1,y1,x2,y2,lines_);
}

//線を引く
function put_line(x1,y1,x2,y2,list){
    let line_height = y2-y1;

    //線要素3つの時
    if(list[3]===null){
        let line_width = (x2-x1)/2;

        //横線要素(1)の座標計算
        list[0].style.left = x1+"px";
        list[0].style.top = y1+"px";
        //横線要素(1)の長さ設定
        list[0].style.width = line_width+"px";

        //高さの絶対値算出
        if(line_height<0){
            line_height = -line_height+2;
            y1 = y2;
        }

        //縦線要素の座標計算
        list[1].style.left = (x2+x1)/2+"px";
        list[1].style.top = y1+"px";
        //縦線要素の長さ設定
        list[1].style.height = line_height+"px";
        
        //横線要素(2)の座標計算
        list[2].style.left = (x2+x1)/2+"px";
        list[2].style.top = y2+"px";
        //横線要素(2)の長さ設定
        list[2].style.width = line_width+"px";
    }else{
        let line_width = x1-x2+items_width*2/7;
        let IN_pos;

        //INピンの座標確認
        if(list[1].classList.contains('IN1')){
            IN_pos = items_height/4;
        }else{
            IN_pos = items_height*3/4;
        }

        if(line_height<0){
            //高さの絶対値算出
            line_height = -line_height+2;

            if(line_height<items_height*12/7-IN_pos){
                //線の高さを要素の上端を超えるようにする
                line_height = line_height + IN_pos + items_height*2/7;
                
                //縦線要素(1)の座標計算
                list[1].style.top = y1-line_height+2+"px";
                //縦線要素(1)の長さ設定
                list[1].style.height = line_height+"px";
                
                //横線要素(2)の座標計算
                list[2].style.top = y1-line_height+"px";
                        
                //縦線要素(2)の座標計算
                list[3].style.top = y1-line_height+"px";
                //縦線要素(2)の長さ設定
                list[3].style.height = line_height+y2-y1+"px";
            }else{
                //線の高さを要素の下端と上端の幅にする
                line_height = line_height - items_height*3/2 + IN_pos;
                
                //縦線要素(1)の座標計算
                list[1].style.top = y1-line_height/2-items_height/2+"px";
                //縦線要素(1)の長さ設定
                list[1].style.height = line_height/2+items_height/2+2+"px";
                
                //横線要素(2)の座標計算
                list[2].style.top = y1-line_height/2-items_height/2+"px";
                
                //縦線要素(2)の座標計算
                list[3].style.top = y2+"px";
                //縦線要素(2)の長さ設定
                list[3].style.height = line_height/2+items_height-IN_pos+"px";
            }
        }else{
            if(line_height<items_height*5/7+IN_pos){
                //線の高さを要素の下端を超えるようにする
                line_height = line_height - IN_pos + items_height*8/7;
                
                //縦線要素(1)の長さ設定
                list[1].style.height = line_height+"px";
                
                //横線要素(2)の座標計算
                list[2].style.top = y1+line_height+"px";
                
                //縦線要素(2)の座標計算
                list[3].style.top = y2+"px";
                //縦線要素(2)の長さ設定
                list[3].style.height = line_height+y1-y2+"px";
            }else{
                //線の高さを要素の下端と上端の幅にする
                line_height = line_height - items_height/2 - IN_pos;
                
                //縦線要素(1)の長さ設定
                list[1].style.height = line_height/2+items_height/2+"px";
                
                //横線要素(2)の座標計算
                list[2].style.top = y1+line_height/2+items_height/2+"px";
                
                //縦線要素(2)の座標計算
                list[3].style.top = y1+line_height/2+items_height/2+"px";
                //縦線要素(2)の長さ設定
                list[3].style.height = line_height/2+IN_pos+"px";
            }
            //縦線要素(1)の座標計算
            list[1].style.top = y1+"px";
        }
        
        //横線要素(1)の座標計算
        list[0].style.left = x1+"px";
        list[0].style.top = y1+"px";
        //横線要素(1)の長さ設定
        list[0].style.width = items_width/7+"px";

        //縦線要素(1)の座標計算
        list[1].style.left = x1+items_width/7+"px";
        
        //横線要素(2)の座標計算
        list[2].style.left = x2-items_width/7+"px";
        //横線要素(2)の長さ設定
        list[2].style.width = line_width+2+"px";

        //縦線要素(2)の座標計算
        list[3].style.left = x2-items_width/7+"px";
        
        //横線要素(3)の座標計算
        list[4].style.left = x2-items_width/7+"px";
        list[4].style.top = y2+"px";
        //横線要素(3)の長さ設定
        list[4].style.width = items_width/7+"px";
    }
}


//線要素の削除
function removeLines(yline,yline2,xline){
    yline.nextElementSibling.remove();
    yline.previousElementSibling.remove();
    yline.remove();
    if(yline2!=null){
        yline2.remove();
        xline.remove();
    }
}



let remove_judge = false;
let j = 0;

//要素の大きさ
let items_width = 70;
let items_height = 70;

//新要素の判別
let newitem = false;

//要素の座標
let x;
let y;
let items_left;
let items_top;

//線要素の座標
let output_left;
let input_right;
let output_top;
let input_top;

// 0…NOT'sIN1 1…IN1 2…IN2
let INnum;

//線の座標 ~1_:要素の左(入力)　~2_:要素の右(出力)
let x1_=x2_=y1_=y2_=0;

//線と要素の接続
let output_item;
let input_item;
let connecting_items = [[]];

//縦線の記憶用変数
let yline_memory;

//親要素
const $ = (id) => document.getElementById(id);
const container = $('container');
const lines_container = $('lines');

// 線の始点・終点を設定するタイミングで、set()をする
// オブジェクトを消す時点で、delete()をする