import Audio from "./Audio.js";
import AudioAnalyser from "./AudioAnalyser.js";
window.onload = function() {

    let audio = new Audio();
    let analyser = new AudioAnalyser({ audio: audio, fftSize: 1024 });

    
    audio.audioNode.addEventListener('trackset', ()=>{   
        document.querySelector(".content").classList.remove("active");
        setTimeout(() => {
          document.querySelector("h2 span").innerText = audio.getCurrentTrack().name;
          document.querySelector(".content").classList.add("active");
        }, 500);
    });

    window.addEventListener("keydown", e => {
      
    });
    let cursor = document.querySelector(".cursor");
    let mouse = {x:0, y: 0};
    let smoothedMouse = {x:0, y: 0};
    window.onmousemove = function(e){
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      cursor.style = `top:${mouse.y}px; left:${mouse.x}px`;
      if(audio.started){
        if(mouse.x < window.innerWidth/2){
          cursor.innerText = "<";
        }else{
          cursor.innerText = ">";
        }
      }
    }

    window.addEventListener("click", () => {
      if(!audio.started){
        audio.start();
        document.querySelector(".content").style = "opacity: 1";
      }else{
        if (mouse.x < window.innerWidth/2) {
          audio.previousTrack();
        }else{
          audio.nextTrack();
        }
      }  
    });
    
    // set up our WebGL context and append the canvas to our wrapper
    var webGLCurtain = new Curtains({
      container: "canvas"
    });
    
    // if there's any error during init, we're going to catch it here
    webGLCurtain.onError(function() {
      document.body.classList.add("no-curtains");
    });
  
    // get our plane element
    var planeElement = document.getElementsByClassName("plane")[0];
  
    // set our initial parameters (basic uniforms)
    var params = {
      vertexShaderID: "plane-vs", // our vertex shader ID
      fragmentShaderID: "plane-fs", // our framgent shader ID
      uniforms: {
        time: {
          name: "uTime",
          type: "1f",
          value: 0,
        },
        sliceF: {
          name: "uIntensity",
          type: "1f",
          value: 0.002,
        },
        mouse: {
          name: "uMouse",
          type: "2f",
          value: [0.5,0.5],
        },
        kick: {
          name: "uKick",
          type: "1f",
          value: 0,
        },
        volume: {
          name: "uVolume",
          type: "1f",
          value: 0,
        },
        beat: {
          name: "uBeat",
          type: "1f",
          value: 0,
        },
      }
    }
  
    // create our plane mesh
    var plane = webGLCurtain.addPlane(planeElement, params);

    // if our plane has been successfully created
    // we use the onRender method of our plane fired at each requestAnimationFrame call
    var last = Date.now();
    plane && plane.onRender(function() {
      let delta = (Date.now() - last)/1000;
      last = Date.now();

      analyser.refreshData(delta);
      //analyser.debug();

      plane.uniforms.kick.value = analyser.getKick(0,75);
      plane.uniforms.volume.value = analyser.getMoy(0,75);
      analyser.getBeat(0,50)
      plane.uniforms.beat.value = analyser.beat;

      plane.uniforms.time.value+=delta * 0.001;
      smoothedMouse.x += (mouse.x - smoothedMouse.x) * 0.1;
      smoothedMouse.y += (mouse.y - smoothedMouse.y) * 0.1;
      let mouseCoord = plane.mouseToPlaneCoords(smoothedMouse.x, smoothedMouse.y);
      plane.uniforms.mouse.value = [mouseCoord.x,mouseCoord.y]// update our time uniform value
    });
  
  }