class PlanDeSalle{
  constructor()
  {
  console.log("ini plan de salle");
  this.debugL("A")
    const shape = document.querySelector("#IMG_PLANSALLE");


    this.mouseStartPosition = {x: 0, y: 0};
    this.mousePosition = {x: 0, y: 0};
    this.viewboxStartPosition = {x: 0, y: 0};
    this.viewboxPosition = {x: 0, y: 0};
    this.viewboxSize = {x: 670, y: 1010};
    this.viewboxScale = 1.0;

    this.etatJeDeplace = false;
    this.nom = "plan de salle";
    this.debugL("B");
    this.calculHauteur();
    this.debugL("C");
    window.onresize = this.calculHauteur;
    this.debugL("D");
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
    // this.transformOrigin = {x:0,y:0}; // Ajout
    this.myInterval = 0 ;
    this.dernierePositionSVG = {
      X:0,
      Y:0
    };
    this.boolPremierDeplacement = true;
    this.pointReferenceInit = 0;
    this.maxY = 100;
    this.maxX = 200;
    this.clicSouris = false;
    this.curDiffInitial=1;
    this.prevDiff = -1;
    this.coeffGlisse = 0.70;
    // this.coeffGlisseInitial = 0.95;
    this.scale = 1;
    this.debugL("E");
    this.domElement=document.querySelector("#IMG_PLANSALLE");
    this.debugL("F");
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
    this.debugL("G");
    const svg = document.querySelector("#IMG_PLANSALLE");
    const container = document.querySelector("div[data-name=PLAN-SALLE]");
    //this.maxScale = 5;
    this.scaleWheelDeltaY = 1;
    this.debugL("H");
    this.domElement.onload = (e)=>{
      this.debug("offsetWidth : "+this.domElement.offsetWidth);
      //console.log("onloadP425 "+this.domElement.offsetWidth);
    };

    

    document.addEventListener("touchmove",(e)=>{
      if(e.touches.length>1)
      {
        e.stopPropagation();
        e.preventDefault();
        this.debugL(" !tmd! ");
      }
    })

    //@MODIF
    document.querySelector("#PLAN-DEBUG-CLEAR").addEventListener("click",(e)=>{
      this.debugClear();
    });

    //@MODIF
    document.querySelector("#TEST-POSITION").addEventListener("click",(e)=>{
      console.log("TST POS");
      this.svgPosition({X:50,Y:50});
      
      // dbg--
      let p=this.svgPositionDonne();
      this.debug("pos svg="+this.pointVersChaine("Sbg pos_1=",p));
      //--dbg
    });
    document.querySelector("#TEST-OFFSET").addEventListener("click",(e)=>{
      console.log(this.domElement.offsetWidth);
    });

    document.querySelector("#PLAN-CENTRER").addEventListener("click",(e)=>{
      this.debug("Centrer !");   
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

    });
    svg.addEventListener("mousedown",e=>{
      this.premierAppui = {
        x:e.clientX,
        y:e.clientY,
        offsetX : e.offsetX,
        offsetY : e.offsetY
      }
      console.log("premierAPpui",this.premierAppui);
    })

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
        this.debug(`data -> X: ${data.coefX} Y:${data.coefY}`);
      }
    })

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
    
    // svg.addEventListener("touchend",e=>{
    //   let point = {
    //     x : e.clientX,
    //     y: e.clientY
    //   }

    //   if((Math.abs(point.x-this.premierAppui.x)<this.toleranceMouse) && (Math.abs(point.y-this.premierAppui.y)<this.toleranceMouse))
    //   {
    //     let x = e.offsetX / svg.offsetWidth;
    //     let y = e.offsetY / svg.offsetHeight;
    //     let data = { coefX:x , coefY:y };
    //     this.fire(data);
    //   }
    // })
    // svg.addEventListener("click",e=>{
    //   // Calcul position
    //   // let x = e.offsetX / svg.offsetWidth;
    //   // let y = e.offsetY / svg.offsetHeight;
    //   // let data = { coefX:x , coefY:y };
    //   // this.fire(data);
    //   //console.log("x :"+x+" y :"+y);

    //   // console.log("width img * scale "+svg.offsetWidth*this.scale);
    //   // console.log("height img * scale "+svg.offsetHeight*this.scale);
    //   // console.log(x*this.scale, y*this.scale);
    //   //console.log(e);
    // })
    // AJOUT
    // svg.addEventListener("mousemove",e=>{
    //   // this.transformOrigin = {x:e.offsetX,y:e.offsetY}
    //   // console.log(this.transformOrigin);
    // })
    container.addEventListener("touchstart",e=>{
      
      e.stopPropagation();
      e.preventDefault(); 
      
      if (e.touches.length>1) {
        this.etatJeDeplace=false;
        this.debug("initStart");
        this.curDiffInitial=this.norme2Points( {X:e.touches[0].clientX,Y:e.touches[0].clientY }, {X:e.touches[1].clientX,Y:e.touches[1].clientY } );
        this.debug("CUR DIF NINIT="+this.curDiffInitial);
      }

      if (e.touches.length==1) {
         this.appuiEn(e,e.clientX,e.clientY)
      }
    })


    container.addEventListener("mousedown", e =>{
      this.appuiEn(e,e.clientX, e.clientY);
    })
    container.addEventListener("touchmove",(e)=>{
      //this.debugL(" *tm* ");

        
      e.stopPropagation();
      e.preventDefault(); 

      if(e.touches.length > 1) // Plusieurs doigts simultanés
      {
        if(this.boolPremierDeplacement)
        {
          this.pointReferenceInit = this.pointReference({x:e.touches[0].clientX,y:e.touches[0].clientY }, {x:e.touches[1].clientX,y:e.touches[1].clientY });
          this.boolPremierDeplacement = false;
        }
        let pointReference = this.pointReference({x:e.touches[0].clientX,y:e.touches[0].clientY }, {x:e.touches[1].clientX,y:e.touches[1].clientY });
        if(Math.abs(pointReference.x-this.pointReferenceInit.x)<10 && Math.abs(pointReference.y-this.pointReferenceInit.y)<10) // Point de référence identique, on se déplace
        {
            // @TODO
            let deplacement = {
              x:e.touches[0].clientX,
              y:e.touches[0].clientY
            }
            this.debugL(" -deplacement.x:"+deplacement.x);
            this.debugL(" -deplacement.y:"+deplacement.y);
            this.bougerEn(e,deplacement.x,deplacement.y);
            // this.debug("JE ME DEPLACE");
            this.pointReferenceInit = this.pointReference({x:e.touches[0].clientX,y:e.touches[0].clientY }, {x:e.touches[1].clientX,y:e.touches[1].clientY });

        }
        else
        {
          this.pointReferenceInit = this.pointReference({x:e.touches[0].clientX,y:e.touches[0].clientY }, {x:e.touches[1].clientX,y:e.touches[1].clientY });
          this.debug("JE VEUX ZOOM");
          if(this.boolPremierScale)
          {
            this.vInit =this.norme2Points( {X:e.touches[0].clientX,Y:e.touches[0].clientY }, {X:e.touches[1].clientX,Y:e.touches[1].clientY } );
            this.scaleInit=this.scale;
            this.boolPremierScale = false;
          }
          let vT = this.norme2Points( {X:e.touches[0].clientX,Y:e.touches[0].clientY }, {X:e.touches[1].clientX,Y:e.touches[1].clientY } );
          let coefScale = vT/this.vInit;
          let scale = this.scaleInit * coefScale;
          this.zoom(e,scale);
        }
        // if(this.boolPremierScale)
        // {
        //   this.vInit =this.norme2Points( {X:e.touches[0].clientX,Y:e.touches[0].clientY }, {X:e.touches[1].clientX,Y:e.touches[1].clientY } );
        //   this.scaleInit=this.scale;
        //   this.boolPremierScale = false;
        // }
        // let vT = this.norme2Points( {X:e.touches[0].clientX,Y:e.touches[0].clientY }, {X:e.touches[1].clientX,Y:e.touches[1].clientY } );
        // let coefScale = vT/this.vInit;
        // let scale = this.scaleInit * coefScale;


        // let curDiff=this.norme2Points( {X:e.touches[0].clientX,Y:e.touches[0].clientY }, {X:e.touches[1].clientX,Y:e.touches[1].clientY } );
        // let scaleFacteur=curDiff-this.curDiffInitial;
        // let paramScale = 0;
        // if (scaleFacteur>0.2) { paramScale=0.05;}
        // if (scaleFacteur<0.2) { paramScale=-0.05;}
        // this.debugL(" vInit "+this.vInit+" ");
        // this.debugL(" vT "+vT+" ");
        // this.debugL(" scaleInit "+this.scaleInit+" ");
        // this.debugL(" vs:"+this.arrondirMillieme(scale)+" ");

        //this.curDiffInitial=this.norme2Points( {X:e.touches[0].clientX,Y:e.touches[0].clientY }, {X:e.touches[1].clientX,Y:e.touches[1].clientY } );
        
        this.zoom(e,scale);

      }
      if(e.touches.length == 1)
      {
        this.bougerEn(e,e.touches[0].clientX , e.touches[0].clientY);
      }

    })
    container.addEventListener("wheel", e=>{
      this.debug(`e wheel deltay=${e.wheelDeltaY}`);
      console.log("wheel e",e)
      e.stopPropagation();
      e.preventDefault();
      // this.domElement.style.transformOrigin = `${this.transformOrigin.x}px ${this.transformOrigin.y}px `; //AJOUT
      this.debug("deltaY",e.wheelDeltaY);
      this.zoom(e,e.wheelDeltaY/480);
      return;
      
      if(e.wheelDeltaY < 0) // DZZOOM
      {
        scaleWheelDeltaY -= 0.1;
      }
      else // ZOOM
      {
        scaleWheelDeltaY += 0.1;
      }

      this.zoom(e,scaleWheelDeltaY);
    })

    //@MODIF
     container.addEventListener("mousemove",(e)=>{
         // --return;
         e.stopPropagation();
         e.preventDefault(); 
         // this.afficheHeure(); debug ralentissement firefox au chargement
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


    
    //shape.addEventListener("mousemove", ()=>{this.mousemove});
    //shape.addEventListener("mousedown", ()=>{this.mousedown});
    //shape.addEventListener("wheel", ()=>{this.wheel});

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
   this.debug("BOUGER EN x:"+x +" y"+y+" ")
   this.debug("etatJeDeplace "+this.etatJeDeplace);
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
    
    
    let posActuelle=this.svgPositionDonne();
    
    posActuelle.X+=this.vecteur.X;
    posActuelle.Y+=this.vecteur.Y;
    this.svgPosition(posActuelle);
  }

}


stopGlisse(){
  if(this.myInterval)
  {
    clearInterval(this.myInterval)
    this.myInterval = 0;
    console.log("stopGlisse");
    this.vecteur = {
      X:0,
      Y:0
    }
  }
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
  if(this.scale < 0.1){ this.scale = 0.1;}
  //this.debugL(" s:"+this.scale+" ");

  this.scaleDOM();
  //this.lastScale=this.scale;
}







lever(e)
{
  //@MODIF
  //--this.dernierePositionSVG=this.positionSVG;
  
  this.etatJeDeplace=false;
  this.t1 = Date.now();
  // let norme = Math.sqrt((this.vecteur.X * this.vecteur.X)+(this.vecteur.Y * this.vecteur.Y)); // utiliser methode
  // if(norme > 10)
  // {
  //   this.vecteur.X = this.vecteur.X/norme;
  //   this.vecteur.Y = this.vecteur.Y/norme;
  //   this.vecteur.X = this.vecteur.X * 10;
  //   this.vecteur.Y = this.vecteur.Y * 10;
  // }
  // Calculer le vecteur vitesse
  // mémoriser la position du svg
  this.stopGlisse();
  // this.coeffGlisse = this.coeffGlisseInitial;
  console.log("startGlisse");
  this.myInterval = setInterval(this.defilementScroll.bind(planDeSalle),this.intervalAnimationMs);

  this.boolZoom = true;
  this.lastScale = 1;
  this.clicSouris = false;
  //console.log(e);
  // let point = {X : , Y: }
  // this.chercheElement(point)
}







defilementScroll()
{
  //console.log("*=",this.vecteur);

  let SVGPos=this.svgPositionDonne();
  
  SVGPos = {
    X : this.vecteur.X + SVGPos.X,
    Y : this.vecteur.Y + SVGPos.Y
  }

  this.tt = Date.now();
  //console.log(this.vInit)
  let t = (this.tt-this.t1)/this.tempsGlisse;
  let sinus = Math.sin((Math.PI/4)*(1-t))
  // this.vecteur = {
  //   X : this.vInit.x * (1-t),
  //   Y : this.vInit.y * (1-t)
  // }
  this.vecteur = {
    X : this.vInit.x * sinus * this.coeffGlisse,
    Y : this.vInit.y * sinus * this.coeffGlisse
  }
  // this.vecteur = {
  //   X : this.vecteur.X * this.coeffGlisse, // 0.95
  //   Y : this.vecteur.Y * this.coeffGlisse  // 0.95
  // }
  if(this.tt-this.t1 >= this.tempsGlisse)
  {
    clearInterval(this.myInterval);
    this.myInterval = 0;
  }
  // this.coeffGlisse = this.coeffGlisse * 0.95;
  

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



