   

    onmessage = (e) => {
        console.log('Message received from main script');
        console.log("Datas worker CMD=",e.data[0]);
        console.log("Datas worker obj=",e.data[1]);
        console.log("Datas worker view=",e.data[2]);
        console.log("Datas worker output width=",e.data[3]);
        console.log("Datas worker output height=",e.data[4]);
        console.log("Datas quadTree=",e.data[5]);
        let workerResult=dessineOffLine(e.data);
        
        postMessage(workerResult);
    }

    dessineOffLine=function(datas) {

        let objets=datas[0];
        let domRect=datas[1];
        let lar=datas[2];
        let hau=datas[3];
        let qt=datas[4];
        
        const offCan=new OffscreenCanvas(lar,hau);
        const ctx=offCan.getContext('2d');
        
        let zoom=lar/domRect.width;
        
        ctx.clearRect(0,0,lar,hau);

        ctx.fillStyle = "gray";
        ctx.strokeStyle = "black";
        ctx.font = "48px serif";
        ctx.fillText("Hello world "+obj.length, 10, 50);
         
         
         for (var i=0; i<obj.length; i++) {
            ctx.fillRect  ((objets[i].x-domRect.x)*zoom,(objets[i].y-domRect.y)*zoom,objets[i].width*zoom,objets[i].height*zoom);
            ctx.strokeRect((objets[i].x-domRect.x)*zoom,(objets[i].y-domRect.y)*zoom,objets[i].width*zoom,objets[i].height*zoom);
         }

         let img=ctx.getImageData(0,0,lar,hau);

         return img;
      
    }

