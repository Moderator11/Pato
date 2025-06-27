(() => {
    //#region Vector2
    
    class Vector2 {
        /**@param {Number} x @param {Number} y*/
        constructor(x, y) {
            this.x = x;
            this.y = y;
        }
        
        MultiplyScalar(value) {
            this.x *= value;
            this.y *= value;
            return this;
        }
        
        AddWithScalar(vector, value) {
            this.x += vector.x * value;
            this.y += vector.y * value;
            return this;
        }
        
        Magnitude() {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        }
        
        Normalize() {
            let l2norm = this.Magnitude();
            if(l2norm == 0) return this;
            this.x /= l2norm;
            this.y /= l2norm;
            return this;
        }
    }
    
    /**@param {Vector2} x @param {Vector2} y*/
    function Add(x, y) {
        return new Vector2(x.x + y.x, x.y + y.y);
    }
    
    /**@param {Vector2} v @param {Number} x*/
    function MultiplyScalar(v, x) {
        return new Vector2(v.x * x, v.y * x);
    }
    
    /**@param {Vector2} v*/
    function Normalize(v) {
        let l2norm = v.Magnitude();
        return new Vector2(v.x / l2norm, v.y / l2norm);
    }
    
    /**@param {Vector2} v1*/
    /**@param {Vector2} v2*/
    function Distance(v1, v2) {
        return new Vector2(v1.x - v2.x, v1.y - v2.y).Magnitude();
    }

    /**@param {Number} rot*/
    function RotationToVector(rot) {
        return new Vector2(Math.cos(rot), Math.sin(rot));
    }
    
    //#endregion Vector2
    //#region PhysicEngine2D
    
    class PhysicEngine2D {
        /**
        * @param {Number} dW domain width
        * @param {Number} dH domain height
        * @param {Number} dT delta time between frame
        * @param {Number} mTP meter to pixel constant
        * @param {Number} typeCount ball type count
        * */
        constructor(dW, dH, dT, mTP, typeCount) {
            this.domain = new Vector2(dW, dH);
            this.deltaTime = dT;
            this.meterToPixel = mTP;
            /**@type {Array<Ball>}*/ 
            this.physicPool = [];
            
            //Experimental2!!!!
            window.addEventListener("resize", () => {
                this.domain.x = window.innerWidth;
                this.domain.y = window.innerHeight;
            });
            //Experimental2!!!!
        }
        
        /**@param {Ball} b*/
        AddNewBall(b) {
            this.physicPool.push(b);
        }
        
        /**@param {Ball} b*/
        RemoveBall(b) {
            this.physicPool = this.physicPool.filter(ball => ball !== b);
        }
        
        UpdatePhysics() {
            const stepRandomScale = 5;//1;
            const footSpread = 25;
            const footForward = 20 * 1.5;
            const headForward = 40;
            const cockForward = 20;
            const footStepLength = 25;
            const footStepAhead = 1.75;//1.5;
            const eyeSpread = 10;
            const eyeForward = 10;
            
            for (let i = 0; i < this.physicPool.length; i++) {
                const o = this.physicPool[i];
                switch(o.name) {
                    case "body":
                    if(state == DuckState.IDLING) {
                        var h = this.physicPool.find(o => o.name === "head");
                        o.desiredPosition.x = duckTargetX;
                        o.desiredPosition.y = duckTargetY;
                        //o.rotation = Math.atan2(mouseY - o.position.y, mouseX - o.position.x);
                        if(Math.abs(h.rotation - o.rotation) > 0.1) o.desiredRotation = Math.atan2(duckTargetY - o.position.y, duckTargetX - o.position.x);
                    }
                    break;
                    case "foot1":
                    var b = this.physicPool.find(o => o.name === "body");
                    var bdpx = b.position.x + Math.cos(b.rotation + 90) * footSpread + Math.cos(b.rotation) * footForward;
                    var bdpy = b.position.y + Math.sin(b.rotation + 90) * footSpread + Math.sin(b.rotation) * footForward;
                    if(new Vector2(bdpx - o.desiredPosition.x, bdpy - o.desiredPosition.y).Magnitude() > footStepLength - Math.random() * stepRandomScale) {
                        o.desiredPosition.x += (bdpx - o.desiredPosition.x) * footStepAhead;
                        o.desiredPosition.y += (bdpy - o.desiredPosition.y) * footStepAhead;
                    }
                    break;
                    case "foot2":
                    var b = this.physicPool.find(o => o.name === "body");
                    var bdpx = b.position.x + Math.cos(b.rotation - 90) * footSpread + Math.cos(b.rotation) * footForward;
                    var bdpy = b.position.y + Math.sin(b.rotation - 90) * footSpread + Math.sin(b.rotation) * footForward;
                    if(new Vector2(bdpx - o.desiredPosition.x, bdpy - o.desiredPosition.y).Magnitude() > footStepLength + Math.random() * stepRandomScale) {
                        o.desiredPosition.x += (bdpx - o.desiredPosition.x) * footStepAhead;
                        o.desiredPosition.y += (bdpy - o.desiredPosition.y) * footStepAhead;
                    }
                    break;
                    case "head":
                    var b = this.physicPool.find(o => o.name === "body");
                    o.desiredPosition.x = b.position.x + Math.cos(b.rotation) * headForward;
                    o.desiredPosition.y = b.position.y + Math.sin(b.rotation) * headForward;
                    if(state == DuckState.IDLING) o.desiredRotation = Math.atan2(duckTargetY - o.position.y, duckTargetX - o.position.x);
                    break;
                    case "cock":
                    var h = this.physicPool.find(o => o.name === "head");
                    o.desiredPosition.x = h.position.x + Math.cos(h.rotation) * cockForward;
                    o.desiredPosition.y = h.position.y + Math.sin(h.rotation) * cockForward;
                    o.rotation = h.rotation;
                    break;
                    case "eye1":
                    var h = this.physicPool.find(o => o.name === "head");
                    var bdpx = h.position.x + Math.cos(h.rotation + 90) * eyeSpread + Math.cos(h.rotation) * eyeForward;
                    var bdpy = h.position.y + Math.sin(h.rotation + 90) * eyeSpread + Math.sin(h.rotation) * eyeForward;
                    o.desiredPosition.x += (bdpx - o.desiredPosition.x) * 1.5;
                    o.desiredPosition.y += (bdpy - o.desiredPosition.y) * 1.5;
                    o.rotation = h.rotation;
                    break;
                    case "eye2":
                    var h = this.physicPool.find(o => o.name === "head");
                    var bdpx = h.position.x + Math.cos(h.rotation - 90) * eyeSpread + Math.cos(h.rotation) * eyeForward;
                    var bdpy = h.position.y + Math.sin(h.rotation - 90) * eyeSpread + Math.sin(h.rotation) * eyeForward;
                    o.desiredPosition.x += (bdpx - o.desiredPosition.x) * 1.5;
                    o.desiredPosition.y += (bdpy - o.desiredPosition.y) * 1.5;
                    o.rotation = h.rotation;
                    break;
                }
                let v1 = new Vector2(o.desiredPosition.x - o.position.x, o.desiredPosition.y - o.position.y);
                let d = v1.Magnitude();
                switch(o.name) {
                    case "body":
                    o.AddForce(this.deltaTime * this.meterToPixel, v1.Normalize().MultiplyScalar(duckDistancePolicy(d / 200, 1.5)));
                    o.UpdatePosition(this.deltaTime * this.meterToPixel);
                    o.velocity.MultiplyScalar(0.8);
                    
                    var deltaRotation = o.desiredRotation - o.rotation;
                    deltaRotation = (deltaRotation + Math.PI) % (2 * Math.PI) - Math.PI;
                    o.angularVelocity = deltaRotation / 10;
                    o.UpdateRotation(this.deltaTime * this.meterToPixel);
                    break;
                    case "foot1":
                    case "foot2":
                    o.AddForce(this.deltaTime * this.meterToPixel, v1.Normalize().MultiplyScalar(d / 5));
                    o.UpdatePosition(this.deltaTime * this.meterToPixel);
                    o.velocity.MultiplyScalar(0.5);
                    break;
                    case "head":
                    var deltaRotation = o.desiredRotation - o.rotation;
                    deltaRotation = (deltaRotation + Math.PI) % (2 * Math.PI) - Math.PI;
                    o.angularVelocity = deltaRotation / 2;
                    o.UpdateRotation(this.deltaTime * this.meterToPixel);
                    o.position.x = o.desiredPosition.x;
                    o.position.y = o.desiredPosition.y;
                    break;
                    case "cock":
                    case "eye1":
                    case "eye2":
                    o.position.x = o.desiredPosition.x;
                    o.position.y = o.desiredPosition.y;
                    break;
                    case "food":
                    o.UpdatePosition(this.deltaTime * this.meterToPixel);
                    o.velocity.MultiplyScalar(0.9);
                    break;
                }
            }
        }
    }
    
    class Ball {
        /**@param {Number} mass*/
        /**@param {Number} radius*/
        /**@param {String} name*/
        /**@param {Vector2} position*/
        /**@param {Vector2} velocity*/
        constructor(mass, radius, position, velocity, name, color) {
            /**@type {Number}*/ this.mass = mass;
            /**@type {Number}*/ this.radius = radius;
            /**@type {Vector2}*/ this.position = position;
            /**@type {Vector2}*/ this.velocity = velocity;
            /**@type {String}*/ this.name = name;
            /**@type {String}*/ this.color = color;
            
            /**@type {Number}*/ this.desiredRotation = 0;
            /**@type {Number}*/ this.rotation = 0;
            /**@type {Number}*/ this.angularVelocity = 0;
            
            /**@param {Vector2}*/ this.desiredPosition = new Vector2(0, 0);
        }
        
        UpdatePosition(timeElapsed) {
            this.position.AddWithScalar(this.velocity, timeElapsed);
        }
        
        UpdateRotation(timeElapsed) {
            this.rotation += this.angularVelocity * timeElapsed;
        }
        
        AddForce(timeElapsed, acceleration) {
            this.velocity.AddWithScalar(acceleration.MultiplyScalar(1 / this.mass), timeElapsed);
        }
    }
    //#endregion PhysicEngine2D
    //#region RenderEngine2D
    
    function blendColor(r1, g1, b1, r2, g2, b2, x) {
        let rr = r1 + (r2 - r1) * x;  
        let rg = g1 + (g2 - g1) * x;
        let rb = b1 + (b2 - b1) * x;
        return [rr, rg, rb]; 
    }
    
    let heatmapColorScheme = [
        [0, 0, 255],
        [0, 255, 255],
        [0, 255, 0],
        [255, 255, 0],
        [255, 0, 0]
    ];
    
    function getHeatmapRGB(x) {
        let range = heatmapColorScheme.length - 1;
        let c1 = heatmapColorScheme[Math.floor(x * range)];
        let c2 = heatmapColorScheme[Math.floor(x * range) + 1];
        return blendColor(c1[0], c1[1], c1[2], c2[0], c2[1], c2[2], x % (1 / range) * range);
    }
    
    class RenderEngine2D {
        /**@param {Window} w*/
        constructor(w) {
            this.window = w;
            /**@type {Array<Ball>}*/ this.renderPool = null;
            /**@type {HTMLCanvasElement}*/ this.cvs = this.CreateCanvas();
            /**@type {CanvasRenderingContext2D}*/ this.ctx = this.cvs.getContext("2d");//https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext
            document.body.appendChild(this.cvs);
            this.window.addEventListener("resize", () => {
                let inMemCvs = document.createElement('canvas');
                let inMemCtx = inMemCvs.getContext('2d');
                inMemCvs.width = this.cvs.width;
                inMemCvs.height = this.cvs.height;
                inMemCtx.drawImage(this.cvs, 0, 0);
                
                this.cvs.width = window.innerWidth;
                this.cvs.height = window.innerHeight;
                this.ctx.drawImage(inMemCvs, 0, 0);
                
                inMemCvs.remove();
            });
        }
        
        InitializeRenderer(renderPool) {
            this.renderPool = renderPool;
        }
        
        CreateCanvas() {
            let canvas = document.createElement("canvas");
            canvas.id = "cursorTrail";
            canvas.style.setProperty("position", "fixed");
            canvas.style.setProperty("left", "0");
            canvas.style.setProperty("top", "0");
            canvas.style.setProperty("width", "100%");
            canvas.style.setProperty("height", "100%");
            canvas.style.setProperty("z-index", "10");
            canvas.style.setProperty("pointer-events", "none");//https://stackoverflow.com/questions/5398787/how-can-i-pass-a-click-through-an-element
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            return canvas;
        }
        
        Render() {
            this.ctx.clearRect(0, 0, this.cvs.width, this.cvs.height);
            for (let i = 0; i < this.renderPool.length; i++) {
                const o = this.renderPool[i];
                if(o.radius <= 0) continue;
                
                switch(o.name) {
                    case "body":
                    // this.ctx.beginPath();
                    // this.ctx.moveTo(o.position.x, o.position.y);
                    // this.ctx.lineTo(mouseX, mouseY);
                    // this.ctx.closePath();
                    // this.ctx.stroke();

                    this.ctx.fillStyle = o.color;
                    var backward = 15;
                    var wideness = 15;
                    var pointbackward = 30;
                    var tailSplit = 5 + Math.sin(Date.now() / 400) / 2;
                    var left = RotationToVector(o.rotation - 90);
                    var right = RotationToVector(o.rotation + 90);
                    var back = RotationToVector(o.rotation).MultiplyScalar(-1);
                    this.ctx.beginPath();
                    this.ctx.moveTo(o.position.x + right.x * wideness + back.x * backward, o.position.y + right.y * wideness + back.y * backward);
                    this.ctx.lineTo(o.position.x + left.x * wideness + back.x * backward, o.position.y + left.y * wideness + back.y * backward);
                    this.ctx.lineTo(o.position.x + back.x * (pointbackward + backward) + left.x * tailSplit, o.position.y + back.y * (pointbackward + backward) + left.y * tailSplit);
                    this.ctx.lineTo(o.position.x + back.x * (pointbackward + backward) + back.x * -tailSplit, o.position.y + back.y * (pointbackward + backward) + back.y * -tailSplit);
                    this.ctx.lineTo(o.position.x + back.x * (pointbackward + backward) + right.x * tailSplit, o.position.y + back.y * (pointbackward + backward) + right.y * tailSplit);
                    this.ctx.moveTo(o.position.x + right.x * wideness + back.x * backward, o.position.y + right.y * wideness + back.y * backward);
                    this.ctx.closePath();
                    this.ctx.fill();
                    
                    this.ctx.fillStyle = o.color;
                    this.ctx.beginPath();
                    if(state == DuckState.SWALLOWING) {
                        this.ctx.ellipse(o.position.x, o.position.y, 30 * o.radius + Math.sin(Date.now() / 100), 20 * o.radius + Math.cos(Date.now() / 100), o.rotation, 0, Math.PI * 2);
                    } else {
                        o.rotation += Math.sin((o.position.x + o.position.y) / 10) / 50;
                        this.ctx.ellipse(o.position.x, o.position.y, 30 * o.radius + Math.sin(Date.now() / 400), 20 * o.radius + Math.sin(Date.now() / 400), o.rotation, 0, Math.PI * 2);
                    }
                    this.ctx.closePath();
                    this.ctx.fill();
                    break;
                    case "head":
                    this.ctx.fillStyle = o.color;
                    this.ctx.beginPath();
                    if(state == DuckState.SWALLOWING) {
                        this.ctx.ellipse(o.position.x, o.position.y, 15 * o.radius + Math.cos(Date.now() / 100), 12 * o.radius + Math.sin(Date.now() / 100), o.rotation, 0, Math.PI * 2);
                    } else {
                        var forward = RotationToVector(o.rotation).MultiplyScalar(Math.sin(Date.now() / 400));
                        this.ctx.ellipse(o.position.x + forward.x, o.position.y + forward.y, 15 * o.radius, 12 * o.radius, o.rotation, 0, Math.PI * 2);
                    }
                    this.ctx.closePath();
                    this.ctx.fill();
                    break;
                    case "cock":
                    this.ctx.fillStyle = o.color;
                    this.ctx.beginPath();
                    if(state == DuckState.EATING) {
                        this.ctx.ellipse(o.position.x, o.position.y, 10 * o.radius + Math.sin(Date.now() / 50), 8 * o.radius + Math.cos(Date.now() / 50), o.rotation, 0, Math.PI * 2);
                    } else {
                        var forward = RotationToVector(o.rotation).MultiplyScalar(Math.sin(Date.now() / 400));
                        this.ctx.ellipse(o.position.x + forward.x, o.position.y + forward.y, 10 * o.radius, 8 * o.radius, o.rotation, 0, Math.PI * 2);
                    }
                    this.ctx.closePath();
                    this.ctx.fill();
                    break;
                    case "foot1":
                    case "foot2":
                    var b = this.renderPool.find(o => o.name === "body");
                    this.ctx.strokeStyle = o.color;
                    this.ctx.lineWidth = o.radius;
                    this.ctx.beginPath();
                    this.ctx.moveTo(b.position.x, b.position.y);
                    this.ctx.lineTo(o.position.x - Math.cos(b.rotation) * 5, o.position.y - Math.sin(b.rotation) * 5);
                    this.ctx.closePath();
                    this.ctx.stroke();
                    
                    this.ctx.lineWidth = o.radius * 2;
                    this.ctx.beginPath();
                    this.ctx.moveTo(o.position.x - Math.cos(b.rotation) * 5, o.position.y - Math.sin(b.rotation) * 5);
                    this.ctx.lineTo(o.position.x, o.position.y);
                    this.ctx.closePath();
                    this.ctx.stroke();
                    
                    this.ctx.fillStyle = o.color;
                    this.ctx.beginPath();
                    this.ctx.arc(o.position.x - Math.cos(b.rotation) * 5, o.position.y - Math.sin(b.rotation) * 5, o.radius * 1.2, 0, 2 * Math.PI);
                    this.ctx.closePath();
                    this.ctx.fill();
                    case "eye1":
                    case "eye2":
                    var forward = RotationToVector(o.rotation).MultiplyScalar(Math.sin(Date.now() / 400));
                    this.ctx.fillStyle = o.color;
                    this.ctx.beginPath();
                    this.ctx.ellipse(o.position.x + forward.x, o.position.y + forward.y, o.radius, o.radius / 2, o.rotation, 0, 2 * Math.PI);
                    this.ctx.closePath();
                    this.ctx.fill();
                    break;
                    default:
                    this.ctx.fillStyle = o.color;
                    this.ctx.beginPath();
                    this.ctx.arc(o.position.x, o.position.y, o.radius, 0, 2 * Math.PI);
                    this.ctx.closePath();
                    this.ctx.fill();
                    break;
                }
            }
            //requestAnimationFrame(Render);
        }
    }
    
    //#endregion RenderEngine2D
    //#region GameEngine2D
    
    let fps = 60;
    let desiredFrameTime = 1 / fps * 1000;
    let render = new RenderEngine2D(window);
    let physic = new PhysicEngine2D(render.cvs.width, render.cvs.height, desiredFrameTime / 1000, 50);
    render.InitializeRenderer(physic.physicPool);
    
    /**@type {Number}*/ let duckTargetX = 0;//0;
    /**@type {Number}*/ let duckTargetY = window.innerHeight / 2;//0;
    /**@type {Number}*/ let mouseX = window.innerWidth / 4;//0;
    /**@type {Number}*/ let mouseY = window.innerHeight / 2;//0;
    
    let mouseDown = false;
    let initialPosition = new Vector2(-100 , window.innerHeight / 2);//new Vector2(render.window.innerWidth / 2 , window.innerHeight / 2);
    physic.physicPool.push(new Ball(1, 5, new Vector2(initialPosition.x, initialPosition.y), new Vector2(0, 0), "foot1", "orange"));
    physic.physicPool.push(new Ball(1, 5, new Vector2(initialPosition.x, initialPosition.y), new Vector2(0, 0), "foot2", "orange"));
    physic.physicPool.push(new Ball(1, 1, new Vector2(initialPosition.x, initialPosition.y), new Vector2(0, 0), "body", "rgb(239, 228, 176)"));
    //physic.physicPool.push(new Ball(1, 3, new Vector2(initialPosition.x, initialPosition.y), new Vector2(0, 0), "body", "rgb(239, 228, 176)"));//Big Duck
    physic.physicPool.push(new Ball(1, 1, new Vector2(initialPosition.x, initialPosition.y), new Vector2(0, 0), "cock", "orange"));
    physic.physicPool.push(new Ball(1, 1, new Vector2(initialPosition.x, initialPosition.y), new Vector2(0, 0), "head", "rgb(239, 228, 176)"));
    physic.physicPool.push(new Ball(1, 3, new Vector2(initialPosition.x, initialPosition.y), new Vector2(0, 0), "eye1", "black"));
    physic.physicPool.push(new Ball(1, 3, new Vector2(initialPosition.x, initialPosition.y), new Vector2(0, 0), "eye2", "black"));
    
    initialPosition.AddWithScalar(new Vector2(100, 100), 1);
    
    const DuckState = {
        NONE: -1,
        IDLING: 0,
        EATING: 1,
        SWALLOWING: 2,
        QUACKING: 3
    };
    Object.freeze(DuckState);
    let state = DuckState.IDLING;
    
    let duckDistancePolicy = followWhileKeepingDistance;
    
    function followWhileKeepingDistance(x, y) {
        if(x >= 0 && x < 1) { return y * (x - 1); }
        else if (x >= 1 && x < 2) { return y * (x - 1); }
        else if (x >= 2 && x < 3) { return -y * (x - 3); }
        else { return 0; }
    }
    
    function followUntilReach(x, y) {
        if(0 <= x && x < 1) {
            return x * y;
        } else {
            return 1 * y;
        }
    }
    
    setInterval(() => {
        physic.UpdatePhysics();
        render.Render();
        //===============================DuckState
        var food = physic.physicPool.find(o => o.name === "food");
        var c = physic.physicPool.find(o => o.name === "cock");
        var b = physic.physicPool.find(o => o.name === "body");
        
        if(food != null) {
            duckTargetX = food.position.x;
            duckTargetY = food.position.y;
            duckDistancePolicy = followUntilReach;
        } else {
            if(!mouseDown) {
                duckTargetX = mouseX;
                duckTargetY = mouseY;
            }
        }
        
        if(food != null && Distance(food.position, c.position) < 10) {
            physic.physicPool.splice(physic.physicPool.indexOf(food), 1);
            state = DuckState.EATING;
            setTimeout(() => {
                state = DuckState.SWALLOWING;
                setTimeout(() => {
                    state = DuckState.NONE;
                    setTimeout(() => {
                        state = DuckState.IDLING;
                        duckDistancePolicy = followWhileKeepingDistance;
                    }, 300);
                }, 500);
            }, 1000);
        }
        
        let v = new Vector2(mouseX - b.position.x, mouseY - b.position.y);
        if(v.Magnitude() < 150) {
            physic.physicPool.find(o => o.name === "eye1").radius = 3 * 1.5;
            physic.physicPool.find(o => o.name === "eye2").radius = 3 * 1.5;
        } else {
            physic.physicPool.find(o => o.name === "eye1").radius = 3;
            physic.physicPool.find(o => o.name === "eye2").radius = 3;
        }
        //===============================DuckState
    }, desiredFrameTime);
    
    window.addEventListener("keydown", e => {
        switch (e.key) {
            case 'f':
            physic.physicPool.push(new Ball(1, 5, new Vector2(mouseX, mouseY), new Vector2((1 - 2 * Math.random()) * 1, (1 - 2 * Math.random()) * 1), "food", "yellow"));
            break;
            
            default:
            break;
        }
    });
    
    window.addEventListener("mousemove", e => {
        if(mouseDown) return;
        mouseX = e.x;
        mouseY = e.y;
    });
    
    let timer = null;
    
    window.addEventListener("mousedown", e => {
        if(!mouseDown) {
            timer = setInterval(() => {
                duckTargetX = window.innerWidth * Math.random();
                duckTargetY = window.innerHeight * Math.random();
            }, 3000);
        } else {
            clearInterval(timer);
        }
        mouseDown = !mouseDown;
        mouseX = e.x;
        mouseY = e.y;
    });
    
    //#endregion GameEngine2D
})();