export default class AudioAnalyser{
    constructor({audio, fftSize}){
        this.audio = audio;
        this.context = new AudioContext();
        this.src = this.context.createMediaElementSource(this.audio.audioNode);
        this.analyser = this.context.createAnalyser();
        this.src.connect(this.analyser);

        this.analyser.connect(this.context.destination);
        this.analyser.fftSize = fftSize;
        this.bufferLength = this.analyser.frequencyBinCount;
        this.dataArray = new Uint8Array(this.bufferLength);

        this.audio.audioNode.addEventListener('trackset', ()=>{
            this.context.resume();
        });

        /*
            DEBUGGER
        */
        let debugCanvas = document.createElement("canvas");
        debugCanvas.width = window.innerWidth;
        debugCanvas.height = window.innerHeight;
        debugCanvas.style = `
            position: absolute;
            top: 0;
            left: 0;
            z-index: 9999;
            pointer-events: none;
        `;
        document.querySelector("body").append(debugCanvas);
        this.debugger = {
            canvas: debugCanvas,
            ctx: debugCanvas.getContext("2d")
        }
  
        this.beat = 0;
    }

    refreshData(deltaTime){
        this.analyser.getByteFrequencyData(this.dataArray);
        if(this.beat > 0){
           this.beat -= deltaTime;
        }else{
            this.beat = 0;
        }
    }

    debug(){
        this.debugger.canvas.width = window.innerWidth;
        this.debugger.canvas.height = window.innerHeight;
        this.debugger.ctx.clearRect(0,0,window.innerWidth, window.innerHeight);
        this.debugger.ctx.fillStyle = "#FF0000";

        let width = window.innerWidth/this.dataArray.length;
        for(let i = 0; i<this.dataArray.length; i++){
            let height = this.dataArray[i]/255 * window.innerHeight * 0.2;
            this.debugger.ctx.fillRect(width * i,window.innerHeight - height, width - 2, height);
        }
    }
    
    extractData(min,max){
        let _min = Math.floor(min/100 * this.dataArray.length);
        let _max = Math.ceil(max/100 * this.dataArray.length);
        return this.dataArray.slice(_min, _max);
    }
      
    getMoy(min,max){
        let array = this.extractData(min,max);
        let moy = 0;
        for(let i = 0; i<array.length;i++){
            moy += array[i];
        }
        return (moy/array.length)/255;
    }
    
    getMax(min,max){
        let array = this.extractData(min,max);
        return Math.max( ...array)/255;
    }

    getQuartile(min,max,q) {
        let array = this.extractData(min,max);
        array = Array_Sort_Numbers(array);
        var pos = ((array.length) - 1) * q;
        var base = Math.floor(pos);
        var rest = pos - base;
        if ((array[base + 1] !== undefined)) {
            return array[base] + rest * (array[base + 1] - array[base]);
        } else {
            return array[base];
        }

        function Array_Sort_Numbers(inputarray) {
            return inputarray.sort(function (a, b) {
                return a - b;
            });
        }
    }

    getKick(min, max) {
        return this.getQuartile(min,max,0.75) / 255 + this.getQuartile(min,max,0.25) / 255;
    }

    getBeat(min,max){
        let val = this.getKick(min,max);
        if(this.beat == 0 && val > 1.0){
            this.beat = 0.1;
            return true;
        }
        return false;
    }
}
    
  
   
      

   