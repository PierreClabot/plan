class Plan {

    constructor(canvas,objets,largeur,hauteur,objClient) {
        
        this.planReady=false;

        this.objets=objets;
        this.zoomBuffer=1;
        this.zoom=1;
        this.objClient = objClient;
        this.canvas=canvas;
        this.ctx2d=canvas.getContext('2d');
        
        this.canvasB1=document.createElement('canvas');
        this.canvasB1.width=largeur;
        this.canvasB1.height=hauteur;
        this.ctx2dB1=this.canvasB1.getContext('2d');

        this.canvasBHR=document.createElement('canvas');
        this.canvasBHR.width=largeur;
        this.canvasBHR.height=hauteur;
        this.ctx2dBHR=this.canvasBHR.getContext('2d');
                
        this.domDbg=document.getElementById('DBG');
        
        this.bounds={
            x:0,y:0,width:this.canvas.width,height:this.canvas.height
        }

        this.boundsB1={
            x:0,y:0,width:this.canvasB1.width,height:this.canvasB1.height
        }
        this.boundsBHR={
            x:0,y:0,width:this.canvasBHR.width,height:this.canvasBHR.height
        }

        this.viewPort=new DOMRect(0,0,this.boundsB1.width,this.boundsB1.height);
                
        this.abortController=null;
        
        this.qt=new Quadtree(this.bounds,150,4);
        window.URL = window.URL || window.webkitURL;
        let response2=this.workerJob.toString().replace('workerJob()', '');
        try {
           this.blob = new Blob([response2], {type: 'application/javascript'});
        } catch (e) { // Backwards-compatibility
            this.objClient.debug("R3");
            window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder;
            this.blob = new BlobBuilder();
            this.blob.append(response2);
            this.blob = this.blob.getBlob();
            this.objClient.debug("R4");
        }
        
        this.prepare();
    }

    /* ne pas modifier le nom de cette fonction Cf : let response2=this.workerJob.toString().replace('workerJob()', ''); */
    /* Routine utilisée par le worker */
    workerJob() {
        let nbObjDessines=0;
        onmessage = (e) => {
            //console.log('**Message received from main script');
            //console.log("**Datas worker datas=",e.data);
            //console.log("**Datas commabd=",e.data[0]);
            //console.log("**Datas worker obj len="+e.data[1].length);
            //console.log("**Datas worker view=",e.data[2]);
            //console.log("**Datas worker zoom=",e.data[3]);
            //console.log("**Datas QTObs=",e.data[4]);
            
            if(e.data[0]=='Hello') {
                self.postMessage(['hello']);
                return;
            }

            if(e.data[0]=='Draw' || e.data[0]=='Init' ) {
                drw_plan_cancel=false;
                let workerResult=dessineOffLine(e.data);
                if (workerResult!=null) {
                    dd=[e.data[0],workerResult,e.data[1].length];
                    self.postMessage(dd);
                    return;
                } 
                self.close();
                return;
            }

            postMessage(['err','commande de worker non connue']);
        }
    
    
        dessineOffLine=function(datas) {
            
            let objets=datas[1];
            let domRect=datas[2];
            let zoom=datas[3];
            
            let lar=Math.floor(domRect.width*zoom);
            let hau=Math.floor(domRect.height*zoom);
            
            let offCan=new OffscreenCanvas(lar,hau);
            let ctx=offCan.getContext('2d');
            
                        
            ctx.clearRect(0,0,lar,hau);
    
            ctx.fillStyle = "#D0D0D0";
            ctx.strokeStyle = "#808080";
            ctx.font = (Math.floor(48*zoom))+"px serif";
            
            //ctx.fillText("Hello world "+objets.length, 10*zoom, 50*zoom);
             
            // objet trouvé dans le viewport
            //         let bb={x:e.offsetX/this.zoom,y:e.offsetY/this.zoom,width:0,height:0};
            //         
            //         this.dessineTrouve(rs,this.zoom);
            nbObjDessines=0;
            if (objets!=null && objets.length>0) {
                    for (var i=0; (i<objets.length) ; i++) {
                        ctx.fillRect  ((objets[i].x-domRect.x)*zoom,(objets[i].y-domRect.y)*zoom,objets[i].width*zoom,objets[i].height*zoom);
                        ctx.strokeRect((objets[i].x-domRect.x)*zoom,(objets[i].y-domRect.y)*zoom,objets[i].width*zoom,objets[i].height*zoom);
                        nbObjDessines++;
                        //   for (var z=1; (z<200) && (drw_plan_cancel==false); z++) {
                        //       for (var xx=1; (xx<500) && (drw_plan_cancel==false); xx++) {
                        //   }
                        //   }
                    }
            }
            //console.log("finishen the job");

                      
             return ctx.getImageData(0,0,lar,hau);
             
        }
    }

    workerPrepare() {
        //console.log("preapring wrker");
        this.objClient.debug("WP1");
        this.worker = new Worker(URL.createObjectURL(this.blob));
        this.objClient.debug("WP2");
        this.worker.onmessage= (e)=> {
            this.objClient.debug("ONMESSAGE");
            this.objClient.debug(e);
            //console.log('Message received from worker',e.data);
            
            if (e.data[0]=='cancel') {
                console.log("CLIENT worked has cancelled treatùet");
                this.worker=null;
                return;
            }
            if (e.data[0]=='Draw') {
                this.objClient.debug("onDraw");
                this.worker.terminate();
                this.worker=null;
                //console.log("IMG finalized");
                
                 this.ctx2dBHR.putImageData(e.data[1],0,0);
                                 
                //     console.log("K");
                this.renderFinal();
               
                this.zoomBuffer=this.zoom;
                
                return;
            }
            if (e.data[0]=='Init') {
                this.objClient.debug("onInit");
                console.log("WRK RET INIt");
                this.worker=null;
                //console.log("IMG finalized");
                this.ctx2dB1.putImageData(e.data[1],0,0);
                this.planReady=true;
                this.onReady();
                return;
            }
            if (e.data[0]=='Hello') {
                this.objClient.debug("Hello");
                return;
            }
            if (e.data[0]=='Stop') {
                console.log("woerker respond stop!");
                //this.worker.terminate();
                //this.worker=null;
                return;
            }
            console.log("retour non traité");            
            
            
        };
        

        //this.worker.postMessage(["hello"]);
    }

    onReady() {
        this.objClient.debug("onReady");
        this.dessineThread();
    }

    debugClear(cha) {
        this.domDbg.innerHTML='';
    }
    debug(cha) {
        this.domDbg.innerHTML=`<pre>${cha}</pre>`;
    }

    prepare() {
        // Buff
        // Quad Tree
        this.objClient.debug("Z");
        for (var i=0; i<this.objets.length; i++) {
            this.qt.insert(this.objets[i]);      
        }
        this.objClient.debug("A");
        this.recentre();
        this.objClient.debug("B");
        this.calculeViewPort();
        this.objClient.debug("C");
        this.dessinePlanB1();
        this.objClient.debug("D");
    }

    update() {
        this.ctx2d.clearRect(0,0,this.bounds.width,this.bounds.height);
        // copier le viewport de buffer dans bounds complet du canvas final utilisé pour affichage

        this.ctx2d.drawImage(this.canvasB1,this.viewPort.x,this.viewPort.y,this.viewPort.width,this.viewPort.height,
            0,0,this.bounds.width,this.bounds.height);


        
        
    }

    dessinePlanB1() {
        this.objClient.debug("0");
        this.workerPrepare();
        // console.log(" request init thread with zoom="+this.zoom,this.boundsB1);
        // let qtObjs=this.qt.retrieve(this.viewPort);
        // console.log("QtObs=",qtObjs);
        this.objClient.debug("1");
        this.worker.postMessage(['Hello',this.objets,this.boundsB1,1]);
        this.objClient.debug("2");
        this.worker.postMessage(['Init',this.objets,this.boundsB1,1]);
        this.objClient.debug("3");
    }
    
    dessineThread () {
      

        if (this.worker==null) {
            this.workerPrepare();
        } else {
            //this.worker.postMessage(['Stop']);
            this.worker.terminate();
            this.workerPrepare();
        }
        
        //let view=new DOMRect(0,0,this.bounds.width/this.zoom,this.bounds.height/this.zoom);
        //console.log(" request draw thread with zoom="+this.zoom,this.viewPort);
        let vport={
            x:this.viewPort.x,
            y:this.viewPort.y,
            width:this.viewPort.width,
            height:this.viewPort.height
        }
        
        //let qtObjs=this.qt.retrieve(this.viewPort);
        
        //let dats=['Draw',this.objets,vport,this.zoom,qtObjs];
        let dats=['Draw',this.objets,vport,this.zoom];
        //console.log("Dats=",dats);
        this.worker.postMessage(dats);

    }

    renderFinal() {
        this.ctx2d.clearRect(0,0,this.bounds.width,this.bounds.height);

        this.ctx2d.drawImage(this.canvasBHR,0,0,this.canvasBHR.width,this.canvasBHR.height,
                        0,0,this.bounds.width,this.bounds.height);

               
        this.renderQuad();
    }

    objetXY(x,y,tbNode) {
        if(tbNode==null) {
            return null;
        }
        for (let i=0; i<tbNode.length; i++) {
            if ( (y>=tbNode[i].y) && (y<tbNode[i].y+tbNode[i].height) && (x>=tbNode[i].x) && (x<tbNode[i].x+tbNode[i].width) ) {
                return tbNode[i];
          }

        }
        return null;
    }

    drawNode(node,zzoom)    {
        
        var bnounds =  node.bounds ;
        this.ctx2d.strokeRect(
                Math.floor(bnounds.x)*this.zoom-this.viewPort.x*this.zoom,
                Math.floor(bnounds.y)*this.zoom-this.viewPort.y*this.zoom,
                Math.floor(bnounds.width *this.zoom),
                Math.floor(bnounds.height*this.zoom)
            );
        
         for(var i = 0; i < node.nodes.length; i++)
         {
             this.drawNode(node.nodes[i],zzoom);
         }
        
    }

    renderQuad() {
        this.ctx2d.strokeStyle="#FF40FF";
        this.drawNode(this.qt);
    }

    dessineObjet(rs,fill,stroke) {
        this.ctx2d.fillStyle = stroke;
        this.ctx2d.fillStyle = fill;
        this.ctx2d.strokeStyle = stroke;
        let xshape=(rs.x-this.viewPort.x)*this.zoom;
        let yshape=(rs.y-this.viewPort.y)*this.zoom;
        let wshape=rs.width*this.zoom;
        let hshape=rs.height*this.zoom;
        this.ctx2d.fillRect  (xshape,yshape,wshape,hshape);
        this.ctx2d.strokeRect(xshape,yshape,wshape,hshape);
   }

    aim(x,y) {
        this.renderFinal();


        // objet trouvé en XY en rouge
        let xP=(x/this.zoom)+this.viewPort.x; 
        let yP=(y/this.zoom)+this.viewPort.y; 
               
        let bb={x:xP,y:yP,width:0,height:0};
        let rs=this.qt.retrieve(bb);
        this.dessineTrouve(rs);

        let ob=this.objetXY(xP,yP,rs);
       
         if (ob!=null) {
            
               this.dessineObjet(ob,"red","#400");
               //this.dessineObjet(ob,this.zoom);
        }
        this.ctx2d.strokeStyle = "#DD0";
        this.ctx2d.beginPath(); 
        this.ctx2d.moveTo(0, y); 
        this.ctx2d.lineTo (this.bounds.width,y);
        this.ctx2d.stroke();
        this.ctx2d.beginPath(); 
        this.ctx2d.moveTo(x, 0); 
        this.ctx2d.lineTo (x,this.bounds.height);
        this.ctx2d.stroke();
    }

    dessineTrouve(rs,zzoom) {
        //this.ctx2d.fillStyle = "blue";
        //this.ctx2d.strokeStyle = "#4040FF";
        for (var i=0; i<rs.length; i++) {
            this.dessineObjet(rs[i],"blue","cyan");
            // let xshape=(rs[i].x-this.viewPort.x)*this.zoom;
            // let yshape=(rs[i].y-this.viewPort.y)*this.zoom;
            // let wshape=rs[i].width*this.zoom;
            // let hshape=rs[i].height*this.zoom;
            
            // this.ctx2d.fillRect  (xshape,yshape,wshape,hshape);
            // this.ctx2d.strokeRect(xshape,yshape,wshape,hshape);
        }
        this.renderQuad();

    }

    recentre() {
       this.zoom=this.bounds.width/this.boundsB1.width;
       console.log("eoom reccenre=",this.zoom);
       console.log("this.bounds",this.bounds);
       console.log("this.boundB1",this.boundsB1);
       console.log("zoom=",this.zoom);
       this.viewPort=new DOMRect(
        0,
        0,
        this.bounds.width*this.zoom,
        this.bounds.height*this.zoom
    );
    }

    calculeViewPort() {
        
        //console.log("ivew por=",this.viewPort);
        //console.log("ùzoom=",this.zoom);
        this.viewPort.width=this.bounds.width/this.zoom;
        this.viewPort.height=this.bounds.height/this.zoom;
        //console.log("new ivew por=",this.viewPort);
    }

    ezoom(newZoom) {
        this.zoom*=newZoom;
        // calculer new view port
        this.calculeViewPort();
        this.update();
        this.dessineThread();
    }

    bouge(vect) {
        this.viewPort.x+=vect.x/this.zoom;
        this.viewPort.y+=vect.y/this.zoom;
        this.update();
        this.dessineThread();
    }

}