function generateFullPreview(start,end, size, gfont, tfont,color) {
    var canvas = document.createElement('canvas');
    var len = end-start;
    var gridWidth = 20;
    var gridHeight = Math.floor(len/gridWidth);
    canvas.width = size*gridWidth;
    canvas.height = (size+40)*(gridHeight+1);
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = color;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    var ctx = canvas.getContext('2d');
    ctx.translate(size/2,size/2);
    for(var i=0; i<len; i++) {
        var x = i%gridWidth;
        var y = Math.floor(i/20);
        ctx.save();
        ctx.translate(size*x,(size+40)*y);
        drawGlyph(ctx,start+i,size,gfont,tfont);
        ctx.restore();
    }
    var data = canvas.toDataURL("image/png");
    return data.substring(22);
}

function drawGlyph(ctx,num,size,gfont,tfont) {
    ctx.font = tfont;
    ctx.fillText(""+(num).toString(16),0,size/2+20)
    ctx.font = gfont;
    ctx.fillText(String.fromCharCode(num),0,0);
}

function generateGlyph(num, w, h, gfont, color) {
    var canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = color;
    //ctx.font = (w*0.9)+'px "FontAwesome"';
    ctx.font = gfont;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    //ctx.strokeRect(1,1,w-3,h-3);
    ctx.translate(w/2,h/2);
    ctx.fillText(String.fromCharCode(num),0,0);
    var data = canvas.toDataURL("image/png");
    return data.substring(22);
}

function generateDownload(gfont,color,size,start,end,retina,rfont) {
    var zip = new JSZip();
    zip.file("README.txt", "Individual glyphs are in the images directory \nby hex name. See the preview image.\n");
    var can = document.getElementById('canvas');
    var dataURL = can.toDataURL("image/png");
    zip.file("preview.png",
        generateFullPreview(start, end, size, gfont, tfont,color),
        {base64: true}
        );
    var img = zip.folder("images");
    for(var i=start; i<=end; i++) {
        img.file('glyph_'+i.toString(16)+'.png',
            generateGlyph(i,size,size,gfont,color),
            {base64:true}
            );
        if(retina) {
            img.file('glyph_'+i.toString(16)+'@2x.png',
                generateGlyph(i,size*2,size*2,rfont,color),
                {base64:true}
                );
        }
    }
    return zip.generate();
}

