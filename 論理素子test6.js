class LogicElements{

    constructor(image, input=[]){
        this._image = image;
        this._inPins = [];
        this._inVals;//要素の数が異なるのと、buttonでは必要ない??
        this._outVal = false;
    }

    set inPins(pins=[]){}

    set inVals(vals=[]){
        this._inVals = vals;
    }

    set outVal(val){
        this._outVal = val;
    }

    get inPins(){
        return this._inPins;
    }
    get inVals(){
        return this._inVals;
    }
    get outVal(){
        return this._outVal;
    }
    write_inVals(){}
    write_outVal(){}
    set(){}
}

class Button{

    constructor(image, value=false){
        this._image = image;
        this._inPins = [];
        this._outVal = Boolean(value);
    }

    set outVal(value=null){
        if(value==null){
            this._outVal = !this.outVal;
        }else{
            this._outVal = Boolean(value);
        }
    }

    get inPins(){
        return this._inPins;
    }

    get outVal(){
        return this._outVal;
    }

    set(value=null){
        if(this.outVal!=(this.outVal=value)){
            //出力値の更新前後を比べ異なっていたら、出力値を変更すべき素子をqueueGatesに追加する
            LogicCircuit.enqueue(this);
            return LogicCircuit.update_outVal();
        }
    }

    delete(){
        LogicCircuit.delete(this);
    }
}

class LED{
    
    constructor(image, pins=[]){
        this._image = image;
        this._inPins = pins;
        this._inVals = [];
        this._outVal = false;
        this.write_inVals();
        this.write_outVal();
    }

    set inPins(pin=[]){
        switch(pin.length){
            case 0://0の場合は1と同じ処理
            case 1:
                this._inPins = pin;
                break;
            default:
                break;
        }
    }

    get inPins(){
        return this._inPins;
    }

    set inVals(vals = []){
        this._inVals = vals;
    }

    get inVals(){
        return this._inVals;
    }

    set outVal(val){
        this._outVal = val;
    }

    get outVal(){
        return this._outVal;
    }

    write_inVals(){
        // _inValsの更新
        switch(this.inPins.length){
            case 0:
                this.inVals = [false];
                break;
            case 1:
                this.inVals = [ Boolean(this.inPins[0].outVal) ];
                break;
        }
    }

    write_outVal(){
        let judge = this.outVal != (this.outVal = this.inVals[0]);
        if (judge){
            if (this.outVal){
                this._image.src = "LED_ON.png";
                
            }else{
                this._image.src = "LED_OFF.png";
                
            }
            this._image.classList.toggle('ON');
            this._image.classList.toggle('OFF');
        }
        return judge;
    }

    set(pins=[]){
        switch(pins.length){
            case 0:
                this.inPins = [];
                break;
            case 1:
                this.inPins = pins;
                break;
        }
        this.inPins = pins;
        this.write_inVals();
        if(this.write_outVal()){
            //出力値の更新前後を比べ異なっていたら、出力値を変更すべき素子をqueueGatesに追加する
            LogicCircuit.enqueue(this);
            return LogicCircuit.update_outVal();
        }
        return true;
    }

    delete(){
        LogicCircuit.delete(this);
    }
}

class Gate extends LogicElements{

    constructor(image, input=[]){
        super();
        this._image = image;
        this._inPins = input;
        this._inVals = [];
        this._outVal = false;
        this.write_inVals();//_inValsを最新のものに更新
        this.write_outVal();//_outValを最新のものに更新
    }

    set inPins(pins=[]){
        this._pins = pins;
    }
    
    get inPins(){
        return super.inPins;
    }

    write_inVals(){
        // _inValsの更新
        switch(this.inPins.length){
            case 0:
                this.inVals = [false, false];
                break;
            case 1:
                this.inVals = [ Boolean(this.inPins[0].outVal), false ];
                break;
            case 2:
                this.inVals = [];
                this.inPins.forEach(pins => this.inVals.push( Boolean(pins.outVal) ));
                break;
        }
    }

    write_outVal(newVal){
        // outVal の値が変更されたときに true を返す
        return this.outVal != (this.outVal = newVal);
    }

    set(pins=[]){//端子への接続
        switch(pins.length){
            case 0:
                this.inPins = [];
                break;
            case 1:
                if (this.inPins.length==2){
                    this.inPins = pins;
                }else{
                    this.inPins.push(...pins);
                }
                break;
            case 2:
                this.inPins = [...pins];
                break;
            default:
                break;
        }
        this.inPins = pins;
        this.write_inVals();
        if(this.write_outVal()){
            //出力値の更新前後を比べ異なっていたら、出力値を変更すべき素子をqueueGatesに追加する
            LogicCircuit.enqueue(this);
            return LogicCircuit.update_outVal();
        }
        return true;
    }

    disconnect(pin=false){
        if (pin){
            switch(this.inPins.length){
                case 0:
                case 1:
                    this.inPins = [];
                    break;
                case 2:
                    this.inPins = this.inPins.filter(e => e!=pin);
                    break;
            }
            this.write_inVals();
            if(this.write_outVal()){
                LogicCircuit.enqueue(this);
                LogicCircuit.update_outVal();
            }
        }
    }

    delete(){
        LogicCircuit.delete(this);
    }
}

class NotGate extends Gate{

    set inPins(pin=[]){
        switch(pin.length){
            case 0://0の場合は1と同じ処理
            case 1:
                super._inPins = pin;
                break;
            default:
                break;
        }
    }

    get inPins(){
        return super.inPins;
    }

    write_inVals(){
        // _inValsの更新
        switch(super.inPins.length){
            case 0:
                super.inVals = [false];
                break;
            case 1:
                super.inVals = [ Boolean(super.inPins[0].outVal) ];
                break;
        }
    }

    write_outVal(){
        return super.write_outVal( !super.inVals[0] );
    }

}

class AndGate extends Gate{

    write_outVal(){
        return super.write_outVal( super.inVals[0] && super.inVals[1] );
    }
}

class OrGate extends Gate{
    write_outVal(){
        return super.write_outVal( super.inVals[0] || super.inVals[1] );
    }
}

class XorGate extends Gate{
    write_outVal(){
        return super.write_outVal( super.inVals[0] != super.inVals[1] );
    }
}

class NandGate extends Gate{
    write_outVal(){
        return super.write_outVal( !(super.inVals[0] && super.inVals[1]) );
    }
}

class NorGate extends Gate{
    write_outVal(){
        return super.write_outVal( !(super.inVals[0] || super.inVals[1]) );
    }
}

class FlipFlop{}

class LogicCircuit{

    static allGates = [];// 全ての素子を格納
    static queueGates = [];// 入力端子の変化の影響を受ける素子を格納
    static processNum = 0;

    static create(image, type, input){
        let e;
        switch(type){
            case 'button':
                e = new Button(image, input);
                break;
            case 'not':
                e = new NotGate(image, input);
                break;
            case 'and':
                e = new AndGate(image, input);
                break;
            case 'or':
                e = new OrGate(image, input);
                break;
            case 'xor':
                e = new XorGate(image, input);
                break;
            case 'nand':
                e = new NandGate(image, input);
                break;
            case 'nor':
                e = new NorGate(image, input);
                break;
            case 'led':
                e = new LED(image, input);
                break;
        }
        LogicCircuit.allGates.push(e);
        return e;
    }

    static enqueue(element){
        // 入力端子や出力値の更新に伴い、
        // 出力値の更新が必要な素子を探す
        // ある素子の出力値が求められた際に queueGates に素子を追加する
        let connected = LogicCircuit.allGates.filter(
            e => e.inPins.includes(element) && !LogicCircuit.queueGates.includes(e)
        );
        // 追加される時点での入力値を設定
        connected.forEach( e => e.write_inVals() );
        LogicCircuit.queueGates.push( ...connected );
        // allGates のうち入力端子に接続する素子かつ
        // queueGates にまだ追加されていない素子を追加
    }

    static update_outVal(){
        // 各素子の出力値の更新を行なっていく
        LogicCircuit.processNum = 0;

        while(true){
            // LogicCircuit.queueGates.forEach( e => console.log(e) );
            if ( !LogicCircuit.queueGates.length ){
                return true;
            }
            LogicCircuit.processNum++;
            let _element = LogicCircuit.queueGates.shift();
            if ( _element.write_outVal() ){
                // 出力値が変更されたら
                LogicCircuit.enqueue(_element);
                // console.log('enqueue')
            }
            if(LogicCircuit.processNum > 1000){
                return false;
            }
        }
    }

    static delete(element){
        // 入力端子や出力値の更新に伴い、
        // 出力値の更新が必要な素子を探す
        // ある素子の出力値が求められた際に queueGates に素子を追加する
        let connected = LogicCircuit.allGates.filter(
            e => e.inPins.includes(element) && !LogicCircuit.queueGates.includes(e)
        );
        // queueGates に追加された素子の inPins から element を削除し、 inVals を更新
        connected.forEach(e => {
            e.inPins.splice( e.inPins.indexOf(element), 1 );
            e.write_inVals();
        });
        LogicCircuit.queueGates.push( ...connected );
        // allGates のうち入力端子に接続する素子かつ
        // queueGates にまだ追加されていない素子を追加
        LogicCircuit.update_outVal();
        // element を allGates から削除
        LogicCircuit.allGates.splice( LogicCircuit.allGates.indexOf(element), 1);
    }
}
/*
let j = LogicCircuit.create('button',0);
let k = LogicCircuit.create('button',0);
let c = LogicCircuit.create('button',0);
let and_j = LogicCircuit.create('and');
let and_k = LogicCircuit.create('and');
let nand_j = LogicCircuit.create('nand',[and_j,c]);
let nand_k = LogicCircuit.create('nand',[and_k,c]);
let nand_s = LogicCircuit.create('nand');
let nand_r = LogicCircuit.create('nand', [nand_s, nand_k]);
nand_s.set([nand_j,nand_r]);
and_j.set([j,nand_r]);
and_k.set([k,nand_s]);

console.log("(j,k)=(0,0)", nand_s.outVal, nand_r.outVal);

k.set(1);
c.set(1);
console.log("(j,k)=(0,1)", nand_s.outVal, nand_r.outVal);

c.set(0);
k.set(0);
c.set(1);
console.log("(j,k)=(0,0)", nand_s.outVal, nand_r.outVal);

c.set(0);
j.set(1);
c.set(1);
console.log("(j,k)=(1,0)", nand_s.outVal, nand_r.outVal);

k.set(1);
c.set(0);
c.set(1);
console.log("(j,k)=(1,1)", nand_s.outVal, nand_r.outVal);
*/