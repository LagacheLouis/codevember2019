window.onload = function() {
  
    let mouse = {x:0, y: 0};
    let smoothedMouse = {x:0, y: 0};
    window.onmousemove = function(e){
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }
    
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
        }
      }
    }
  
    // create our plane mesh
    var plane = webGLCurtain.addPlane(planeElement, params);
  
    // if our plane has been successfully created
    // we use the onRender method of our plane fired at each requestAnimationFrame call
    var last = Date.now();
    plane && plane.onRender(function() {
      let delta = Date.now() - last;
      last = Date.now();
      plane.uniforms.time.value+=delta * 0.001;
      smoothedMouse.x += (mouse.x - smoothedMouse.x) * 0.1;
      smoothedMouse.y += (mouse.y - smoothedMouse.y) * 0.1;
      let mouseCoord = plane.mouseToPlaneCoords(smoothedMouse.x, smoothedMouse.y);
      plane.uniforms.mouse.value = [mouseCoord.x,mouseCoord.y]// update our time uniform value
    });
  
  }