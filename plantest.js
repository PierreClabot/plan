class PlanDeSalle{
    constructor(debug)
    {
    console.log("ini plan de salle");
  
      const shape = document.querySelector("#IMG_PLANSALLE");
      const globalContainer = document.querySelector("div[data-name=TB_PLAN_SVG]")
      const container = document.querySelector("div[data-name=PLAN-SALLE]");
      if(debug == true)
      {
        let contenu =  `<div Class="btn-plan-container">
                        <div class="btn-plan-debug" id="PLAN-DEBUG-CLEAR">Clear Debug</div>
                        <div Class="btn-plan-debug" id="PLAN Debug ON" onClick="document.querySelector('#PLAN-DBG').style.display='block';">Dbg ON</div>
                        <div class="btn-plan-debug" id="PLAN Debug OFF" onClick="document.querySelector('#PLAN-DBG').style.display='none';">Dbg Off</div>
                      </div>`;
        globalContainer.insertAdjacentHTML("afterbegin", contenu );
      }
      this.svg = document.querySelector("#IMG_PLANSALLE");
      this.planDeSalle = this;
      this.mouseStartPosition = {x: 0, y: 0};
      this.mousePosition = {x: 0, y: 0};
      this.viewboxStartPosition = {x: 0, y: 0};
      this.viewboxPosition = {x: 0, y: 0};
      this.viewboxSize = {x: 670, y: 1010};
      this.viewboxScale = 1.0;
      this.echelleZoom = 1.5; 
      this.etatJeDeplace = false;
      this.nom = "plan de salle";
  
      this.calculHauteur();
  
      window.onresize = this.calculHauteur;
      this.scale = 1;
      this.boolZoom = false;
      this.lastScale = 1;
      this.boolPremierScale = true;
      this.positionSVG = {
        X : 0,
        Y : 0,
      };
  
      this.vecteur = {
          X:0,
          Y:0
      }
      this.historiquePos=[{x:0,y:0},{x:0,y:0}];
      this.transformOrigin = {x:0,y:0}; // Ajout
      this.myInterval = 0 ;
      this.dernierePositionSVG = {
        X:0,
        Y:0
      };
      this.boolPremierDeplacement = true;
      this.pointReferenceInit = 0;
      this.toleranceTouchMove = 5; // A CHANGER
      this.maxY = 100;
      this.maxX = 200;
      this.clicSouris = false;
      this.curDiffInitial=1;
      this.prevDiff = -1;
      this.coeffGlisse = 0.70;
      this.scale = 1;
      this.echelleScale = (this.svg.width.baseVal.value)/10;
      this.domElement=document.querySelector("#IMG_PLANSALLE");
  
      this.premierAppui = {x:0,y:0};
      this.observers = [];
      this.t1 ;
      this.tt;
      this.vInit = 0;
      this.scaleInit = 0;
      this.intervalAnimationMs = 1;
      this.tempsGlisse = 500;
      this.sourisGlisseMax = 50;
      this.toleranceMouse = 5;
      this.toleranceTouch = 5;
      
      this.scaleWheelDeltaY = 1;
  
      document.addEventListener("touchstart",(e)=>{
        if(e.touches.length>1)
        {
          e.stopPropagation();
          e.preventDefault();
          this.debugL(" !touchemovedocument! ");
        }
      })
      document.addEventListener("touchmove",(e)=>{
        if(e.touches.length>1)
        {
          e.stopPropagation();
          e.preventDefault();
          this.debugL(" !touchemovedocument! ");
        }
      });
      /* TEST APPLE AJOUT */
      document.addEventListener('gesturestart', function (e) {
        e.preventDefault();
    });
    //   document.querySelector("#PLAN-ZOOM").addEventListener("click",(e)=>{
        
    //     let zoom = true;
    //     let scaleWheelDeltaY = this.scale*this.echelleZoom;
  
    //     if(scaleWheelDeltaY>8)
    //     {
    //       scaleWheelDeltaY = 8;
    //       zoom = false;
    //     }
  
    //     if(zoom)
    //     {
    //       // this.transformOrigin = 
    //       // {
    //       //   X:50,
    //       //   Y:50
    //       // }
    //       // transformOrigin = ancien transformOrigin actif attribut
    //       let test = this.domElement.style.transformOrigin;
    //       test = test.replaceAll("%","");
    //       test = test.split(" ");
    //       this.transformOrigin = {X:test[0],Y:test[1]};
    //       console.log(" ***** TEST *******",test);
    //       this.zoom(e,scaleWheelDeltaY);
    //     }
    //   });
  
    
    //   document.querySelector("#PLAN-DEZOOM").addEventListener("click",(e)=>{
    //     e.stopPropagation();
    //     e.preventDefault();
    //     console.log(" ***************** DEZOOM");
    //     let zoom = true;
    //     let scaleWheelDeltaY = this.scale/this.echelleZoom;
  
    //     if(scaleWheelDeltaY<0.5)
    //     {
    //       scaleWheelDeltaY = 8;
    //       zoom = false;
    //     }
  
    //     if(zoom)
    //     {
    //       // this.transformOrigin = { // Dezoom par rapport au centre
    //       //   X:50,
    //       //   Y:50
    //       // }
    //       this.domElement.style.left = "0";
    //       this.domElement.style.top = "0";
    //       this.zoom(e,scaleWheelDeltaY);
    //     }
    //   })
  
      window.addEventListener("mouseup", (e)=>{
        this.etatJeDeplace = false;
      });
  
      document.addEventListener("touchstart",(e)=>{
        if(e.touches.length>1)
        {
          e.stopPropagation();
          e.preventDefault();
          this.debugL(" !touchemovedocument! ");
        }
      })
      document.addEventListener("touchmove",(e)=>{
        if(e.touches.length>1)
        {
          e.stopPropagation();
          e.preventDefault();
          this.debugL(" !touchemovedocument! ");
        }
      });
      /* TEST APPLE */
      document.addEventListener('gesturestart', function (e) {
        e.preventDefault();
    });
  
  
      //@MODIF
    //   if(debug != false)
    //   {
    //     document.querySelector("#PLAN-DEBUG-CLEAR").addEventListener("click",(e)=>{
    //       this.debugClear();
    //     });
    //   }
    //   document.querySelector("#PLAN-CENTRER").addEventListener("click",(e)=>{ 
    //     this.reset();
    //   });
  
    //   document.querySelector("#PLAN-CENTRER").addEventListener("touchstart",(e)=>{ 
    //     this.reset();
    //   });
  
  
      this.svg.addEventListener("mousedown",e=>{
        this.premierAppui = {
          x:e.clientX,
          y:e.clientY,
          offsetX : e.offsetX,
          offsetY : e.offsetY
        }
        
      })
  
      this.svg.addEventListener("touchstart",e=>{
  
        var rect = e.target.getBoundingClientRect();
        var offsetX = e.targetTouches[0].pageX - rect.left;
        var offsetY = e.targetTouches[0].pageY - rect.top;
        this.premierAppui = {
          x:e.touches[0].clientX,
          y:e.touches[0].clientY,
          offsetX : offsetX,
          offsetY : offsetY
        }
  
      })
  
      this.svg.addEventListener("touchend",e=>{
  
        let point = {
          x : e.changedTouches[0].clientX,
          y: e.changedTouches[0].clientY
        }
  
        if((Math.abs(point.x-this.premierAppui.x)<this.toleranceTouch) && (Math.abs(point.y-this.premierAppui.y)<this.toleranceTouch))
        {
          let x = (this.premierAppui.offsetX/this.scale) / svg.offsetWidth;
          let y = (this.premierAppui.offsetY/this.scale) / svg.offsetHeight;
          let data = { coefX:x , coefY:y };
          this.fire(data);
          this.stopGlisse();
          this.debug(`data -> X: ${data.coefX} Y:${data.coefY}`);
        }
      })
  
      this.svg.addEventListener("mouseup",e=>{
        let point = {
          x : e.clientX,
          y: e.clientY
        }
        
        if((Math.abs(point.x-this.premierAppui.x)<this.toleranceMouse) && (Math.abs(point.y-this.premierAppui.y)<this.toleranceMouse))
        {
          let x = e.offsetX / this.svg.offsetWidth;
          let y = e.offsetY / this.svg.offsetHeight;
          let data = { coefX:x , coefY:y };
          this.fire(data);
        }
      })
      
      container.addEventListener("touchstart",e=>{
        
        e.stopPropagation();
        e.preventDefault(); 
        
        if (e.touches.length>1) {
          this.etatJeDeplace=false;
          this.curDiffInitial=this.norme2Points( {X:e.touches[0].clientX,Y:e.touches[0].clientY }, {X:e.touches[1].clientX,Y:e.touches[1].clientY } );
        }
  
        if (e.touches.length==1) {
            this.appuiEn(e,e.clientX,e.clientY)
        }
      })
  
      container.addEventListener("mousedown", e =>{
        this.appuiEn(e,e.clientX, e.clientY);
        return;
      })
      container.addEventListener("touchmove",(e)=>{
  
        e.stopPropagation();
        e.preventDefault(); 
  
        if(e.touches.length > 1) // Plusieurs doigts simultanés
        {
            if(this.boolPremierScale)
            {
              this.vInit =this.norme2Points( {X:e.touches[0].clientX,Y:e.touches[0].clientY }, {X:e.touches[1].clientX,Y:e.touches[1].clientY } );
              this.scaleInit=this.scale;
              this.boolPremierScale = false;
            }
            let vT = this.norme2Points( {X:e.touches[0].clientX,Y:e.touches[0].clientY }, {X:e.touches[1].clientX,Y:e.touches[1].clientY } );
            
            var rect = e.target.getBoundingClientRect();
  
            let offsetX = {
              touche1:e.touches[0].pageX - rect.left,
              touche2:e.touches[1].pageX - rect.left,
            }
  
            let offsetY = {
              touche1:e.touches[0].pageY - rect.top,
              touche2:e.touches[1].pageY - rect.top,
            }
  
            this.transformOrigin = {
              X:((Math.abs((offsetX.touche1 + offsetX.touche2)/2)/(this.domElement.offsetWidth*this.scale))*100),
              Y:((Math.abs((offsetY.touche1 + offsetY.touche2)/2)/(this.domElement.offsetWidth*this.scale))*100)
            }
            if(this.transformOrigin.X>100)
            {
              this.transformOrigin.X = 100;
            }
            if(this.transformOrigin.X<0)
            {
              this.transformOrigin.X = 0;
            }
            if(this.transformOrigin.Y>100)
            {
              this.transformOrigin.Y = 100;
            }
            if(this.transformOrigin.Y<0)
            {
              this.transformOrigin.Y= 0;
            }
  
            let coefScale = vT/this.vInit;
            let scale = this.scaleInit * coefScale;
            this.debug("Scale "+scale)
            this.debug("this.transformOriginX"+this.transformOrigin.X);
            this.debug("this.transformOriginY"+this.transformOrigin.Y);
            this.zoom(e,scale);
        }
        if(e.touches.length == 1)
        {
          this.etatJeDeplace=true;
          this.bougerEn(e,e.touches[0].clientX , e.touches[0].clientY);
        }
  
      })
      container.addEventListener("wheel", e=>{
        e.stopPropagation();
        e.preventDefault();
  
        let zoom = true;
        let scaleWheelDeltaY = this.scale;
        if(e.wheelDeltaY < 0) // DZZOOM
        {
          scaleWheelDeltaY = scaleWheelDeltaY / 2;
          console.log("reset Transform Origin");
          this.echelleScale = Math.abs(this.echelleScale);
        }
        else // ZOOM
        {
          scaleWheelDeltaY = scaleWheelDeltaY * 2;
          this.echelleScale = -Math.abs(this.echelleScale);
        }
        if(scaleWheelDeltaY<0.5)
        {
          scaleWheelDeltaY = 0.5;
          zoom = false;
        }
        else if(scaleWheelDeltaY>8)
        {
          scaleWheelDeltaY = 8;
          zoom = false;
        }
  
        if(zoom)
        {
          this.zoom(e,scaleWheelDeltaY);
        }
      })
  
      //@MODIF
      container.addEventListener("mousemove",(e)=>{
          
          e.stopPropagation();
          e.preventDefault(); 
  
          if(e.target.id == "IMG_PLANSALLE")
          {
            this.transformOrigin = 
            {
              X:(e.offsetX*this.scale/(this.domElement.offsetWidth*this.scale))*100,
              Y:(e.offsetY*this.scale/(this.domElement.offsetHeight*this.scale))*100
            }
          }
          //console.log(`e:{x${e.pageX}, y:${e.pageY}}`);
          this.bougerEn(e,e.clientX , e.clientY);
          return;
      });
  
      container.addEventListener("mouseup",(e)=>{
  
          e.stopPropagation();
          e.preventDefault(); 
  
          let norme = Math.sqrt((this.vecteur.X * this.vecteur.X)+(this.vecteur.Y * this.vecteur.Y)); // utiliser methode
          if(norme > this.sourisGlisseMax)
          {
            this.vecteur.X = this.vecteur.X/norme;
            this.vecteur.Y = this.vecteur.Y/norme;
            this.vecteur.X = this.vecteur.X * this.sourisGlisseMax;
            this.vecteur.Y = this.vecteur.Y * this.sourisGlisseMax;
          }
          this.vInit = {
            x:this.vecteur.X,
            y:this.vecteur.Y
          }
  
          this.lever(e);
      });
      
  
      container.addEventListener("touchend",(e)=>{
        e.stopPropagation();
        e.preventDefault(); 
        this.boolPremierScale = true;
        this.boolPremierDeplacement = true;
        let norme = Math.sqrt((this.vecteur.X * this.vecteur.X)+(this.vecteur.Y * this.vecteur.Y)); // utiliser methode
        if(norme > this.sourisGlisseMax)
        {
          this.vecteur.X = this.vecteur.X/norme;
          this.vecteur.Y = this.vecteur.Y/norme;
          this.vecteur.X = this.vecteur.X * this.sourisGlisseMax;
          this.vecteur.Y = this.vecteur.Y * this.sourisGlisseMax;
        }
        this.vInit = {
          x:this.vecteur.X,
          y:this.vecteur.Y
        }
        this.lever(e);   
      })  
    }
  
    mousedown(e) {
      this.debug('*************"MOUSE DOWN "');
      mouseStartPosition.x = e.pageX;
      mouseStartPosition.y = e.pageY;
  
      viewboxStartPosition.x = viewboxPosition.x;
      viewboxStartPosition.y = viewboxPosition.y;
  
      window.addEventListener("mouseup", this.mouseup);
  }
  
  afficheHeure(){
    let date = new Date();
    console.log(date)
  }
  
  
  calculHauteur(){
    let divTop = document.querySelector("div[data-name=PLAN-SALLE]").offsetTop;
    let hauteurEcran = document.documentElement.clientHeight;
    let difference = hauteurEcran - divTop;
    document.querySelector("div[data-name=PLAN-SALLE]").style.height = difference+"px";
  }
  
  
  
  appuiEn(e,x,y){
      this.historiquePos[0]={
        X: x,
        Y: y,
      }
  
      this.historiquePos[1]={
        X: x,
        Y: y,
      }
  
      this.etatJeDeplace=true;
      this.stopGlisse();
      return;
  }
  
  
  bougerEn(event,x,y)
  {
    if(this.etatJeDeplace)
    {
      this.historiquePos[0]={
        X : this.historiquePos[1].X ,
        Y : this.historiquePos[1].Y
      }
      this.historiquePos[1]={
        X : x,
        Y : y
      }
  
      this.vecteur={
        X:this.historiquePos[1].X - this.historiquePos[0].X,
        Y:this.historiquePos[1].Y - this.historiquePos[0].Y,
      }
      
      let viewBox = this.getViewBox(this.svg);
      viewBox.x -= this.vecteur.X;
      viewBox.y -= this.vecteur.Y;
      this.setViewBox(this.svg,viewBox);
      //let posActuelle=this.svgPositionDonne();      
      //posActuelle.X+=this.vecteur.X;
      //posActuelle.Y+=this.vecteur.Y;
      //posActuelle = this.limiteDeplacement(posActuelle);
      //this.svgPosition(posActuelle);
  
    }
    return;
  }
  
  limiteDeplacement(position)
  {
    let posActuelle = {
      X:position.X,
      Y:position.Y
    };
    let style = getComputedStyle(this.domElement);
    let chaTransformOrigin = style.getPropertyValue('transform-origin');
    let widthReel = Math.round(this.domElement.getBoundingClientRect().width);
    let heightReel = Math.round(this.domElement.getBoundingClientRect().height);
    //console.log("********* WIDTHREEL **********",widthReel);
    //console.log("********* HEIGHTREEL **********",heightReel);
    let tabTransformOrigin = chaTransformOrigin.split(" ");
    let transformOrigin = "";
  
    for(const text of tabTransformOrigin)
    {
      let transform = text.replace("px","");
      transformOrigin += transform+" ";
    }
    let objTransformOrigin = {
      X : this.arrondirMillieme(parseInt(transformOrigin.split(" ")[0],10)/this.domElement.offsetWidth*100),
      Y : this.arrondirMillieme(parseInt(transformOrigin.split(" ")[1],10)/this.domElement.offsetHeight*100)
    }
    //console.log("objTransformOrigin",objTransformOrigin);
  
    let theorieLimiteX = (((objTransformOrigin.X-50)/100)*(widthReel/2))+(widthReel/2);
    let theorieLimiteY = (((objTransformOrigin.Y-50)/100)*(heightReel/2))+(heightReel/2);
  
    //console.log("posActuelle X",posActuelle.X);
    //console.log("theorieLimiteX Gauche",theorieLimiteX);
    //console.log("theorieLimiteX Droite",theorieLimiteX-widthReel);
  
    if(posActuelle.X>theorieLimiteX || posActuelle.X<theorieLimiteX-widthReel)
    {
      if(posActuelle.X>theorieLimiteX)
      {
        posActuelle.X = theorieLimiteX;
      }
      else{
        posActuelle.X = theorieLimiteX-widthReel;
      }
      console.log("*************** LIMITE X *************");
      // posActuelle.X = theorieLimiteX * (Math.abs(posActuelle.X)/posActuelle.X);
    }
  
    if(posActuelle.Y>theorieLimiteY || posActuelle.Y<theorieLimiteY-heightReel)
    {
      if(posActuelle.Y>theorieLimiteY)
      {
        posActuelle.Y = theorieLimiteY;  
      }
      else{
        posActuelle.Y=theorieLimiteY-heightReel
      }
      console.log("*************** LIMITE Y *************");
      // posActuelle.Y = theorieLimiteY * (Math.abs(posActuelle.Y)/posActuelle.Y);
    }
    return posActuelle;
  }
  stopGlisse(){
    if(this.myInterval)
    {
      clearInterval(this.myInterval);
      this.myInterval = 0;
      this.vecteur = {
        X:0,
        Y:0
      }
    }
  }
  
  
  zoom(e,scale)
  {
    console.log("ZOOOM")
    let viewBox = this.getViewBox(this.svg); // objViewBox
    viewBox.width += this.echelleScale;
    viewBox.height += this.echelleScale;
    viewBox.x -= this.echelleScale/2;
    viewBox.y -= this.echelleScale/2;
    this.setViewBox(this.svg,viewBox);
    // this.scale = scale;
    // if(this.scale < 0.1){ this.scale = 0.1;}
    // this.scaleDOM();
  }
  
  
  lever(e)
  {
    this.etatJeDeplace=false;
    this.boolZoom = true;
    this.lastScale = 1;
    this.clicSouris = false;
  
    if(e.target == document.querySelector("#PLAN-ZOOM") || e.target == document.querySelector("#PLAN-DEZOOM"))
    {
      return;
    }
    this.t1 = Date.now();
    this.stopGlisse();
    this.myInterval = setInterval(this.defilementScroll.bind(this.planDeSalle),this.intervalAnimationMs);
  }
  
  
  defilementScroll()
  {
    let SVGPos=this.getViewBox(this.svg);
    console.log("DEFILEMENT")
    // SVGPos = {
    //   X : this.vecteur.X + SVGPos.x,
    //   Y : this.vecteur.Y + SVGPos.y
    // }
    SVGPos = {
        X : SVGPos.x - this.vecteur.X,
        Y : SVGPos.y - this.vecteur.Y
      }
  
    this.tt = Date.now();
    let t = (this.tt-this.t1)/this.tempsGlisse;
    let sinus = Math.sin((Math.PI/4)*(1-t))
  
    this.vecteur = {
      X : this.vInit.x * sinus * this.coeffGlisse,
      Y : this.vInit.y * sinus * this.coeffGlisse
    }
  
    if(this.tt-this.t1 >= this.tempsGlisse)
    {
      clearInterval(this.myInterval);
      this.myInterval = 0;
    }
  
    // SVGPos = this.limiteDeplacement(SVGPos);
    console.log("SVG POS",SVGPos);
    let objViewBox = this.getViewBox(this.svg);
    objViewBox.x = SVGPos.X;
    objViewBox.y = SVGPos.Y;
    // this.svgPosition(SVGPos);
    this.setViewBox(this.svg,objViewBox);
    this.dernierePositionSVG = { X:this.positionSVG.X , Y:this.positionSVG.Y };
  }
  
  scaleDOM(){
    this.domElement.style.transformOrigin = `${this.transformOrigin.X}% ${this.transformOrigin.Y}%` 
    this.domElement.style.transform = `scale(${this.scale})`;
    this.domElement.style.left = `0px`;
    this.domElement.style.top = `0px`;
  }
  
  setviewbox() // inutile ?
  {
    console.log("****** SET VIEW BOX");
    var vp = {x: viewboxPosition.x ,  y:viewboxPosition.y};
    var vs = {x: viewboxSize.x * viewboxScale , y:  viewboxSize.y * viewboxScale};
    shape = document.getElementsByTagName("svg")[0];
    shape.setAttribute("viewBox", vp.x + " " + vp.y + " " + vs.x + " " + vs.y);
  }
  
  
  
  mousemove(e) // debug
  {
    console.log("******** MOUS  MOVE");
    mousePosition.x = e.offsetX;
    mousePosition.y = e.offsetY;
    
    if (mouseDown)
    {
      viewboxPosition.x = viewboxStartPosition.x + (mouseStartPosition.x - e.pageX) * viewboxScale;
      viewboxPosition.y = viewboxStartPosition.y + (mouseStartPosition.y - e.pageY) * viewboxScale;
  
      this.setviewbox();
    }
    
    var mpos = {x: mousePosition.x * viewboxScale, y: mousePosition.y * viewboxScale};
    var vpos = {x: viewboxPosition.x, y: viewboxPosition.y};
    var cpos = {x: mpos.x + vpos.x, y: mpos.y + vpos.y}
  }
  
  
  
  mouseup(e) { // debug
    window.removeEventListener("mouseup", this.mouseup);
  }
  
  
  svgPosition(point) {
    let deplacement = {
      X : point.X,
      Y : point.Y
    }
  
    this.domElement.style.left = `${deplacement.X}px`;
    this.domElement.style.top  = `${deplacement.Y}px`;
  }
  
  svgPositionDonne() {
    let point = { 
                  X : this.domElement.offsetLeft, 
                  Y : this.domElement.offsetTop, 
                };
    //console.log("svgPositionDonne",point);
    return point;
  }
  
  reset(){
    this.stopGlisse();   
    this.scale = 1;
    this.scaleDOM()
    this.positionSVG = {
      X : 0,
      Y : 0
    }
    this.transformOrigin = { X:50, Y:50 }
    this.domElement.style.transformOrigin = "50% 50%";
    this.svgPosition({X:0,Y:0});
    this.scale = 1
    this.lastScale = 1;
  }
  
  debug(chaine)
  {
    console.log(chaine);
    document.querySelector(".event").innerHTML += "<br>"+chaine;
  }
  debugL(chaine)
  {
    console.log(chaine);
    document.querySelector(".event").innerHTML += chaine;
  }
  
  arrondirMillieme(valeur){
    let val = (Math.round(valeur*1000))/1000
    return val;
  }
  
  
  
  pointVersChaine(chaInfo,p) {
    let chaRet=`${chaInfo}=(${p.X},${p.Y})`;
    return chaRet;
  }
  
  debugClear()
  {
    document.querySelector(".event").innerHTML = ""
  }
  
  norme2Points(p1,p2) {
    let norme= Math.sqrt(  (p1.X - p2.X)*(p1.X - p2.X) + (p1.Y - p2.Y)*(p1.Y - p2.Y) );
    return norme;
  }
  pointReference(p1,p2){
    let pointReference = { x:Math.abs(p1.x-p2.x), y:Math.abs(p1.y-p2.y) }
    return pointReference;
  }
  
  subscribe(fn)
  {
      this.observers.push(fn);
  }
  
  unsubscribe(fn) {
      this.observers = this.observers.filter(
          function (item) {
              if (item !== fn) {
                  return item;
              }
          }
      );
  }
  
    fire(data) {
        this.observers.forEach(function (item) {
            item.onClick(data);
        });
    }
    getViewBox(domSvg)
    {
        let viewBox = domSvg.getAttribute("viewBox");
        viewBox = viewBox.split(' ');
        let objViewBox = {
            x : parseInt(viewBox[0],10),
            y : parseInt(viewBox[1],10),
            width : parseInt(viewBox[2],10),
            height : parseInt(viewBox[3],10)
        }
        return objViewBox;
    }

    setViewBox(domSvg, objViewBox)
    {
        let chaViewBox = `${objViewBox.x} ${objViewBox.y} ${objViewBox.width} ${objViewBox.height}`;
        domSvg.setAttribute("viewBox",chaViewBox);
        return;
    }
}