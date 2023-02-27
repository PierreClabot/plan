class PlanDeSalle{
  constructor(debug)
  {
  console.log("ini plan de salle");

    const shape = document.querySelector("#IMG_PLANSALLE");
    const globalContainer = document.querySelector("div[data-name=TB_PLAN_SVG]")
    const container = document.querySelector("#CONT_PLAN");
    if(debug == true)
    {
      let contenu =  `<div Class="btn-plan-container">
                      <div class="btn-plan-debug" id="PLAN-DEBUG-CLEAR">Clear Debug</div>
                      <div Class="btn-plan-debug" id="PLAN Debug ON" onClick="document.querySelector('#PLAN-DBG').style.display='block';">Dbg ON</div>
                      <div class="btn-plan-debug" id="PLAN Debug OFF" onClick="document.querySelector('#PLAN-DBG').style.display='none';">Dbg Off</div>
                    </div>`;
                    console.log(globalContainer);
      globalContainer.insertAdjacentHTML("afterbegin", contenu );
      // container.insertBefore(newNode,contenu)
      // document.querySelector(".btn-plan-container").remove();
    }
    

    this.mouseStartPosition = {x: 0, y: 0};
    this.mousePosition = {x: 0, y: 0};
    this.viewboxStartPosition = {x: 0, y: 0};
    this.viewboxPosition = {x: 0, y: 0};
    this.viewboxSize = {x: 670, y: 1010};
    this.viewboxScale = 1.0;

    this.etatJeDeplace = false;
    this.nom = "plan de salle";
    this.plan = this.initPlan();
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
    // this.coeffGlisseInitial = 0.95;
    this.scale = 1;

    this.domElement=document.querySelector("#CONT_PLAN");

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

    const svg = document.querySelector("#PLAN");
    
    //this.maxScale = 5;
    this.scaleWheelDeltaY = 1;

    // this.domElement.onload = (e)=>{
    //   //this.debug("offsetWidth : "+this.domElement.offsetWidth);
    //   //console.log("onloadP425 "+this.domElement.offsetWidth);
    // };
    this.debug("c");
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
    document.querySelector("#PLAN-ZOOM").addEventListener("click",(e)=>{
      console.log(" ***************** ZOOM");
      let zoom = true;
      let scaleWheelDeltaY = this.scale*2;

      if(scaleWheelDeltaY>8)
      {
        scaleWheelDeltaY = 8;
        zoom = false;
      }

      if(zoom)
      {
        this.transformOrigin = {
          X:50,
          Y:50
        }
        // this.domElement.style.left = "0";
        // this.domElement.style.top = "0";
        this.zoom(e,scaleWheelDeltaY);
      }
    });

  
    document.querySelector("#PLAN-DEZOOM").addEventListener("click",(e)=>{
      e.stopPropagation();
      e.preventDefault();
      console.log(" ***************** DEZOOM");
      let zoom = true;
      let scaleWheelDeltaY = this.scale/2;

      if(scaleWheelDeltaY<0.5)
      {
        scaleWheelDeltaY = 8;
        zoom = false;
      }

      if(zoom)
      {
        this.transformOrigin = { // Dezoom par rapport au centre
          X:50,
          Y:50
        }
        // this.domElement.style.left = "0";
        // this.domElement.style.top = "0";
        this.zoom(e,scaleWheelDeltaY);
      }
    })

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
    if(debug != false)
    {
      document.querySelector("#PLAN-DEBUG-CLEAR").addEventListener("click",(e)=>{
        this.debugClear();
      });
    }
    document.querySelector("#PLAN-CENTRER").addEventListener("click",(e)=>{ 
      //this.debug("Centrer !");   
      this.reset();
    });

    document.querySelector("#PLAN-CENTRER").addEventListener("touchstart",(e)=>{ 
      //this.debug("Centrer !");   
      this.reset();
    });


    svg.addEventListener("mousedown",e=>{
      this.premierAppui = {
        x:e.clientX,
        y:e.clientY,
        offsetX : e.offsetX,
        offsetY : e.offsetY
      }
      //console.log("premierAPpui",this.premierAppui);
    })
    this.debug("d");

    svg.addEventListener("touchstart",e=>{
      console.log(e);
      var rect = e.target.getBoundingClientRect();
      var offsetX = e.targetTouches[0].pageX - rect.left;
      var offsetY = e.targetTouches[0].pageY - rect.top;
      this.premierAppui = {
        x:e.touches[0].clientX,
        y:e.touches[0].clientY,
        offsetX : offsetX,
        offsetY : offsetY
      }
      console.log("premierAPpui",this.premierAppui);
    })
    this.debug("e");
    svg.addEventListener("touchend",e=>{

      let point = {
        x : e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY
      }
      console.log(this.premierAppui.x);
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
    this.debug("f");
    svg.addEventListener("mouseup",e=>{
      let point = {
        x : e.clientX,
        y: e.clientY
      }

      if((Math.abs(point.x-this.premierAppui.x)<this.toleranceMouse) && (Math.abs(point.y-this.premierAppui.y)<this.toleranceMouse))
      {
        let x = e.offsetX / svg.offsetWidth;
        let y = e.offsetY / svg.offsetHeight;
        let data = { coefX:x , coefY:y };
        this.fire(data);
      }
    })
    this.debug("g");
    container.addEventListener("touchstart",e=>{
      
      e.stopPropagation();
      e.preventDefault(); 
      
      if (e.touches.length>1) {
        this.etatJeDeplace=false;
        //this.debug("initStart");
        this.curDiffInitial=this.norme2Points( {X:e.touches[0].clientX,Y:e.touches[0].clientY }, {X:e.touches[1].clientX,Y:e.touches[1].clientY } );
        //this.debug("CUR DIF NINIT="+this.curDiffInitial);
      }

      if (e.touches.length==1) {
         this.appuiEn(e,e.clientX,e.clientY)
      }
    })
    this.debug("h");
    container.addEventListener("mousedown", e =>{
      this.appuiEn(e,e.clientX, e.clientY);
    })
    this.debug("i");
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
          // var x = e.targetTouches[0].pageX - rect.left;
          // var y = e.targetTouches[0].pageY - rect.top; 

          let offsetX = {
            touche1:e.touches[0].pageX - rect.left,
            touche2:e.touches[1].pageX - rect.left,
          }

          let offsetY = {
            touche1:e.touches[0].pageY - rect.top,
            touche2:e.touches[1].pageY - rect.top,
          }
          this.debug("rect.left"+rect.left);
          this.debug("rect.top"+rect.top);
          this.debug("touches1 : { page X : "+e.touches[0].pageX+" ,Y : "+e.touches[0].pageY+" }");
          this.debug("touches2 : { page X : "+e.touches[1].pageX+" ,Y : "+e.touches[1].pageY+" }");
          this.debug("offsettouche1 : { X : "+offsetX.touche1 + ", Y : "+offsetY.touche1+" }");
          this.debug("offsettouche2 : { X : "+offsetX.touche2 + ", Y : "+offsetY.touche2+" }");

          // this.transformOrigin = {
          //   X:((Math.abs((offsetX.touche1 + offsetX.touche2)/2)/(this.domElement.offsetWidth*this.scale))*100),
          //   Y:((Math.abs((offsetY.touche1 + offsetY.touche2)/2)/(this.domElement.offsetWidth*this.scale))*100)
          // }
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
          // this.transformOrigin = {
          //   X:((Math.abs(offsetX.touche1 - offsetX.touche2)/(this.domElement.offsetWidth*this.scale))*100),
          //   Y:(Math.abs(offsetY.touche1 - offsetY.touche2)/(this.domElement.offsetWidth*this.scale))*100
          // }

          //this.debug(`this.transformOrigin(X:${this.transformOrigin.X}, Y:${this.transformOrigin.Y})`);

          
          let coefScale = vT/this.vInit;
          let scale = this.scaleInit * coefScale;
          this.debug("Scale "+scale)
          this.debug("this.transformOriginX"+this.transformOrigin.X);
          this.debug("this.transformOriginY"+this.transformOrigin.Y);
          this.zoom(e,scale);

      }
      if(e.touches.length == 1)
      {
        // console.log(e);
        this.etatJeDeplace=true;
        this.bougerEn(e,e.touches[0].clientX , e.touches[0].clientY);
      }

    })
    container.addEventListener("wheel", e=>{
      e.stopPropagation();
      e.preventDefault();
      console.log("wheel e",e)
      let zoom = true;
      let scaleWheelDeltaY = this.scale;
      if(e.wheelDeltaY < 0) // DZZOOM
      {
        scaleWheelDeltaY = scaleWheelDeltaY / 2;
      }
      else // ZOOM
      {
        scaleWheelDeltaY = scaleWheelDeltaY * 2;
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
         // --return;
         e.stopPropagation();
         e.preventDefault(); 

        if(e.target.id == "IMG_PLANSALLE")
        {
          this.transformOrigin = {
            X:(e.offsetX*this.scale/(this.domElement.offsetWidth*this.scale))*100,
            Y:(e.offsetY*this.scale/(this.domElement.offsetHeight*this.scale))*100
          }
          //this.domElement.style.transformOrigin=`${posCurseur.X}% ${posCurseur.Y}%`;
        }

         this.bougerEn(e,e.clientX , e.clientY);
    });

    container.addEventListener("mouseup",(e)=>{
        // --return;
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
    //@---

    container.addEventListener("touchend",(e)=>{
      //this.debugL(" *te* ");
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
}


bougerEn(event,x,y)
{
  
   //this.debug("BOUGER EN x:"+x +" y"+y+" ")
   //this.debug("etatJeDeplace "+this.etatJeDeplace);
  
  if(this.etatJeDeplace)
  {
    console.log("JE DEPLACE");
    // this.boolPremierScale = true;
    // this.debug("boolPremierScale"+this.boolPremierScale);
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
    
    this.plan.bouge({x:this.vecteur.X,y:this.vecteur.Y});
    // let posActuelle=this.svgPositionDonne();
    
    // posActuelle.X+=this.vecteur.X;
    // posActuelle.Y+=this.vecteur.Y;

    // // TEST LIMITE
    // // console.log("posX",posActuelle.X);
    // //console.log(this.arrondirMillieme(this.domElement.offsetWidth*this.scale)/2);
    // console.log("posX",posActuelle.X);
    // console.log("this.scale",this.scale)
    // console.log("offsetWidth",this.domElement.offsetWidth*this.scale);
    // posActuelle = this.limiteDeplacement(posActuelle);
    // this.svgPosition(posActuelle);
  }

}

limiteDeplacement(position)
{
  let posActuelle = {
    X:position.X,
    Y:position.Y
  };
  console.log("LIMITEDEPLACEMENT")
  let style = getComputedStyle(this.domElement);
  let chaTransformOrigin = style.getPropertyValue('transform-origin');
  let tabTransformOrigin = chaTransformOrigin.split(" ");
  let transformOrigin = "";

  for(const text of tabTransformOrigin)
  {
    let transform = text.replace("px","");
    transformOrigin += transform+" ";
  }
  let objTransformOrigin = {
    X : this.arrondirMillieme(parseInt(transformOrigin.split(" ")[0],10)),
    Y : this.arrondirMillieme(parseInt(transformOrigin.split(" ")[1],10))
  }
  //console.log(objTransformOrigin);
  if(!this.domElement.style.transformOrigin)
  {
    objTransformOrigin = {
      X : 0,
      Y : 0
    } 
  }
  // console.log("posActuelleX",Math.abs(posActuelle.X)*this.scale);
  // console.log("domElement",this.domElement.offsetWidth*this.scale);
  // if(Math.abs(posActuelle.X)>(this.arrondirMillieme(this.domElement.offsetWidth*this.scale)/2)+objTransformOrigin.X)
  // {
  //   posActuelle.X = (this.arrondirMillieme(this.domElement.offsetWidth*this.scale)/2)*(posActuelle.X/Math.abs(posActuelle.X));
  //   this.stopGlisse();
  // }
  // if(Math.abs(posActuelle.Y) >(this.arrondirMillieme(this.domElement.offsetHeight*this.scale)/2)+ objTransformOrigin.Y)
  // {
  //   posActuelle.Y = (this.arrondirMillieme(this.domElement.offsetHeight*this.scale)/2)*(posActuelle.Y/Math.abs(posActuelle.Y))+objTransformOrigin.Y;
  //   this.stopGlisse();
  // }


  // if(Math.abs(posActuelle.X)>(this.arrondirMillieme(this.domElement.offsetWidth*this.scale)/2))
  // {
  //   console.log("****** LIMITE X *****");
  //   posActuelle.X = (this.arrondirMillieme(this.domElement.offsetWidth*this.scale)/2)*(posActuelle.X/Math.abs(posActuelle.X));
  //   this.stopGlisse();
  // }


  // if(Math.abs(posActuelle.Y) >(this.arrondirMillieme(this.domElement.offsetHeight*this.scale)/2))
  // {
  //   console.log("****** LIMITE Y *****");
  //   posActuelle.Y = (this.arrondirMillieme(this.domElement.offsetHeight*this.scale)/2)*(posActuelle.Y/Math.abs(posActuelle.Y));
  //   this.stopGlisse();
  // }

  return posActuelle;
}
stopGlisse(){
  if(this.myInterval)
  {
    clearInterval(this.myInterval)
    this.myInterval = 0;
    this.vecteur = {
      X:0,
      Y:0
    }
  }
}
initPlan()
{
  this.debug("initPlan");
  let ob=[];
        for (let i=0; i<5000; i++) {
            

            ob.push( { name : 'objet '+i,
                      x :Math.floor(Math.random() * 1008)+2,
                      y : Math.floor(Math.random() * 1008)+2,
                     width:  Math.floor(Math.random() * 18)+2,
                     height : Math.floor(Math.random() *18)+2

            }
            );
        }

        ob.push( { name : 'test',
                  x :40,
                  y : 40,
                  width:  40,
                  height : 40
                }
        );
        this.debug("a-b");
        let canva=document.querySelector("#PLAN");
        this.debug(canva.tagName);
        let plan=new Plan(canva,ob,1080,1080,this);
        this.debug("b");
        return plan;        
  }

zoom(e,scale)
{


  //this.scale+=scale;
  // if(e.type != "wheel")
  // {
  //   this.curDiffInitial=this.norme2Points( {X:e.touches[0].clientX,Y:e.touches[0].clientY }, {X:e.touches[1].clientX,Y:e.touches[1].clientY } );
  // }
  // if(this.scale > 4){ this.scale = 4;} // xxxxxxxxxxxxxxx

  this.scale = scale;
  if(this.scale<1)
  {
    this.plan.ezoom(0.5)
  }
  else{
    this.plan.ezoom(2);
  }
  // if(this.scale < 0.1){ this.scale = 0.1;}
  // this.scaleDOM();
  //this.lastScale=this.scale;
}







lever(e)
{
  //@MODIF
  //--this.dernierePositionSVG=this.positionSVG;
  console.log(e);
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
  this.myInterval = setInterval(this.defilementScroll.bind(planDeSalle),this.intervalAnimationMs);

}


defilementScroll()
{
  let SVGPos=this.svgPositionDonne();
  
  SVGPos = {
    X : this.vecteur.X + SVGPos.X,
    Y : this.vecteur.Y + SVGPos.Y
  }

  this.tt = Date.now();
  //console.log(this.vInit)
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

  console.log("DEFILEMENT SCROLL");
  SVGPos = this.limiteDeplacement(SVGPos);
  this.svgPosition(SVGPos);
  
  // let norme = Math.sqrt((this.vecteur.X * this.vecteur.X)+(this.vecteur.Y * this.vecteur.Y))
  // if(norme < 1)
  // {
  //   this.stopGlisse();
  //   return;
  // }

  this.dernierePositionSVG = { X:this.positionSVG.X , Y:this.positionSVG.Y };
}

scaleDOM(){
  // console.debug("transformOriginX",this.transformOrigin.X);
  // console.debug("transformOriginY",this.transformOrigin.Y);
  this.domElement.style.transformOrigin = `${this.transformOrigin.X}% ${this.transformOrigin.Y}%`
  
  this.domElement.style.transform = `scale(${this.scale})`;
  // console.log(this.domElement.offsetWidth);
  // console.log(this.domElement.offsetHeight);
  // let recalculLargeur = this.domElement.naturalWidth*this.scale;
  // let recalculHauteur = this.domElement.naturalHeight*this.scale;
  // this.debug("Hauteur"+recalculHauteur);
  // this.debug("Largeur"+recalculLargeur);
  // this.domElement.setAttribute("width",(recalculLargeur)+"px");
  // this.domElement.setAttribute("height",(recalculHauteur)+"px");
  // this.domElement.setAttribute("viewBox", `130 50 ${930/echelle} ${730/echelle}`);
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
  console.log("*****MOUSEU");
  window.removeEventListener("mouseup", this.mouseup);
  //mouseDown = false;
}




wheel(e) { // pour debug
  this.debug("***WHHHHHHH");
  return;
  var scale = (e.deltaY < 0) ? 0.8 : 1.2;
  
  if ((viewboxScale * scale < 8.0) && (viewboxScale * scale > 1.0/256.0))
  {  
    var mpos = {x: mousePosition.x * viewboxScale, y: mousePosition.y * viewboxScale};
    var vpos = {x: viewboxPosition.x, y: viewboxPosition.y};
    var cpos = {x: mpos.x + vpos.x, y: mpos.y + vpos.y}

    viewboxPosition.x = (viewboxPosition.x - cpos.x) * scale + cpos.x;
    viewboxPosition.y = (viewboxPosition.y - cpos.y) * scale + cpos.y;
    viewboxScale *= scale;
  
    this.setviewbox();
  }
}


svgPosition(point) {
  let deplacement = {
    X : point.X,
    Y : point.Y
  }
//   let container = document.querySelector("div[data-name=PLAN-SALLE]"); @TODO A REVOIR bug format desktop
//   let widthSVG = this.domElement.getBoundingClientRect().width;
//   let heightSVG = this.domElement.getBoundingClientRect().height;

//   if(Math.abs(point.X) > (widthSVG/2)-(container.offsetWidth*0.3))
//   {
//     deplacement.X = ((widthSVG/2)-(container.offsetWidth*0.3))*(Math.abs(point.X)/(point.X));
//   }
//   if(Math.abs(point.Y) > (heightSVG/2)-(container.offsetHeight*0.3))
//   {
//     deplacement.Y = ((heightSVG/2)-(container.offsetHeight*0.3))*(Math.abs(point.Y)/(point.Y));
//   }
  this.domElement.style.left = `${deplacement.X}px`;
  this.domElement.style.top  = `${deplacement.Y}px`;

}



svgPositionDonne() {
  let point= { 
                X : this.domElement.offsetLeft, 
                Y : this.domElement.offsetTop, 
              };
  return point;
}

chercheElement(point){
  //console.log(point);
  let container = document.querySelector("div[data-name=PLAN-SALLE]");
  // console.log(container.getBoundingClientRect()); @TODO
}

reset(){
  this.stopGlisse();   
  this.scale = 1;
  this.scaleDOM()
  this.positionSVG = {
    X : 0,
    Y : 0
  }

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

// Container Class
unsubscribe(fn) {
    this.observers = this.observers.filter(
        function (item) {
            if (item !== fn) {
                return item;
            }
        }
    );
}

// Container Class
fire(data) {
    this.observers.forEach(function (item) {
        item.onClick(data);
    });
}

}



