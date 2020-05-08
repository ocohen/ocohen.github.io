registerCanvas = function(canvas)
{
    canvas.addEventListener('mousedown', e => {
        onClick(e.clientX, e.clientY);
    });
}

getContext = function(canvas)
{
    return canvas.getContext("2d");
}

drawText = function(canvas, text, pt, size, color, align, valign)
{
    let ctx = getContext(canvas);
    ctx.font =size+"px Arial";
    ctx.fillStyle = color;
    ctx.textAlign = align;
    ctx.textBaseline = valign;
    ctx.fillText(text, pt[0], pt[1]); 
}

drawLine = function(canvas, start, end, color)
{
    let ctx = getContext(canvas);
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(start[0], start[1]);
    ctx.lineTo(end[0], end[1]);
    ctx.stroke();
}

drawPoint = function(canvas, pt, color, size)
{
    let ctx = getContext(canvas);
    ctx.fillStyle = color;

    ctx.beginPath(); //Start path
    ctx.arc(pt[0], pt[1], size, 0, Math.PI * 2, true);
    ctx.fill(); // Close the path and fill.
}

clear = function(canvas)
{
    getContext(canvas).clearRect(0,0,canvas.width,canvas.height);
}

getTransform = function(canvas, tl, br)
{
    //want br to snap to canvas.width,canvas.height
    //want tl to snap to 0,0
    //T(br) = (w,h)
    //T(tl) = 0
    //=> Tbr + c = w,h
    //   Ttl + c = 0,0
    //   br[0]a + c = w
    //   tl[0]a + c = 0
    //   => a = w/(br[0]-tl[0])
    //   c = -tl[0]a
    //   br[1]b + d = h
    //   tl[1]b + d = 0
    //   => b = h/(br[1]-tl[1])
    //   d = -tl[1]b
    let xScale = canvas.width/(br[0]-tl[0]);
    let yScale = canvas.height/(br[1]-tl[1]);
    let c = -xScale * tl[0];
    let d = -yScale * tl[1];

    return [xScale, yScale, c, d];
}

tmPoint = function(tm, pt)
{
    let x = tm[0]* pt[0] + tm[2];
    let y = tm[1]* pt[1] + tm[3];
    return [x,y];
}

invTmPoint = function(tm, pt)
{
    let x = (pt[0]-tm[2])/xScale;
    let y = (pt[1]-tm[3])/yScale;
    return [x,y];
}

plotList = function(canvas, data, tl, br, color)
{
    let pts = [];
    for(let i=0; i<data.length; i++)
    {
        pts.push([i,data[i]]);
    }
    plotPoints(canvas, pts, tl, br, color);

}

plotPoints = function(canvas, pts, tl, br, color)
{
    tm = getTransform(canvas, tl, br);
    let scaled = [];
    for(let i=0; i<pts.length; i++)
    {
        scaled.push(tmPoint(tm, pts[i]));
    }

    for(let i=0;i<scaled.length-1;i++)
    {
        drawLine(canvas, scaled[i], scaled[i+1], color);
    }
}

plotPointsNoLine = function(canvas, pts, tl, br, color, size)
{
    tm = getTransform(canvas, tl, br);
    let scaled = [];
    for(let i=0; i<pts.length; i++)
    {
        drawPoint(canvas, tmPoint(tm, pts[i]), color, size);
    }
}

plotGrid = function(canvas, tl, br, color)
{
    tm = getTransform(canvas, tl, br);

    let midY = canvas.height / 2;
    let midX = canvas.width / 2;

    let numXTicks = 10;
    let numYTicks = 10;
    let tickHalfSize = 2;

    drawLine(canvas, [0, midY], [canvas.width, midY], color);
    drawLine(canvas, [midX, 0], [midX, canvas.height], color);

    let dy = canvas.height / numYTicks;
    for(let i=0; i<numYTicks; i++)
    {
        drawLine(canvas, [midX-tickHalfSize, i*dy], [midX+tickHalfSize, i*dy], color);
    }

    drawText(canvas, tl[0], [0,midY],12, color, "left", "bottom");
    drawText(canvas, br[0], [canvas.width,midY],12, color, "right", "bottom");

    let dx = canvas.width / numXTicks;
    for(let i=0; i<numXTicks; i++)
    {
        drawLine(canvas, [i*dx, midY-tickHalfSize], [i*dx, midY+tickHalfSize], color);
    }

    drawText(canvas, tl[1], [midX+tickHalfSize, 0],12, color, "left", "top");
    drawText(canvas, br[1], [midX+tickHalfSize, canvas.height],12, color, "left", "bottom");

}

document.addEventListener("DOMContentLoaded", function()
{
    init();
    setInterval(update, h);
});
