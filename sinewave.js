var pxPerInch = 72;
var h = 11 * pxPerInch;
var w = 8.5 * pxPerInch;

var page = new Path.Rectangle(new Point(0,0),new Size(w,h));
page.fillColor = 'whitesmoke';
page.strokeColor = 'black';

var gutter = h/2;

var gutterLine = new Path.Line(new Point(0,gutter),new Point(w,gutter));
gutterLine.strokeColor = 'pink';

var numSegments = 25;
var margin = 1;
var distFromGutter = 2.5;
var stripLength = 5;

margin *= pxPerInch;
distFromGutter *= pxPerInch;
stripLength *= pxPerInch;

var waveWidth = w - (2*margin);

function makeCurve(curveFunction) {
  var myCurve = new Path();
  for (var i = 0; i <= numSegments; i++) {
    var x = margin + (waveWidth * i / numSegments);
    var y = gutter + curveFunction(i,numSegments);
    myCurve.add(new Point(x,y));
  }
  myCurve.strokeColor = 'pink';
  return myCurve;
}

function sine(i,numSegments) {
  var amplitude_px = 1 * pxPerInch;
  return amplitude_px * Math.sin(2 * Math.PI * i / numSegments);
}

function cosine(i,numSegments) {
  var amplitude_px = 1 * pxPerInch;
  return amplitude_px * Math.cos(2 * Math.PI * i / numSegments);
}

function approximate(curve,displacement) {
  var disjoint = [];
  var segments = curve.segments;
  var segmentDist = new Point(waveWidth / numSegments,0);
  for (var i = 0; i < numSegments; i++) {
    var startPt = curve.segments[i].point.clone() + displacement;
    var seg = new Path.Line(startPt,startPt + segmentDist);
    seg.strokeColor = 'blue';
    disjoint.push(seg);
  }
  return disjoint;
}

function calculateMidlines(segsTop, segsBottom) {
  var disjointMiddle = [];
  for (var i = 0; i < numSegments; i++) {
    var gutterToTop = segsTop[i].firstSegment.point.y - gutter;
    var midSeg = segsBottom[i].clone();
    midSeg.translate(0,gutterToTop);
    midSeg.strokeColor = 'red';
    disjointMiddle.push(midSeg);
  }
  return disjointMiddle;
}

function calculateCutlines(segsTop, segsBottom) {
  var cuts = [];

  var cutline = new Path.Line(
    segsTop[0].firstSegment.point,
    segsBottom[0].firstSegment.point);
  cutline.strokeColor = '#00ff00';
  cuts.push(cutline);

  for (var i = 1; i < numSegments; i++) {
    var topLeft = segsTop[i-1].lastSegment.point;
    var topRight = segsTop[i].firstSegment.point;
    var bottomLeft = segsBottom[i-1].lastSegment.point;
    var bottomRight = segsBottom[i].firstSegment.point;
    var top = (topLeft.y < topRight.y) ? topLeft : topRight;
    var bottom = (bottomLeft.y > bottomRight.y) ? bottomLeft : bottomRight;
    cutline = new Path.Line(top,bottom);
    cutline.strokeColor = '#00ff00';
    cuts.push(cutline);
  }

  cutline = new Path.Line(
    segsTop[numSegments-1].lastSegment.point,
    segsBottom[numSegments-1].lastSegment.point);
  cutline.strokeColor = '#00ff00';
  cuts.push(cutline);

  return cuts;
}

var myCurve = makeCurve(cosine);

var disjointTop = approximate(myCurve, new Point(0,-2.5*pxPerInch));
var disjointBottom = approximate(myCurve, new Point(0,2.5*pxPerInch));

var disjointMiddle = calculateMidlines(disjointTop,disjointBottom);
var cuts = calculateCutlines(disjointTop,disjointBottom);

gutterLeft = new Path.Line(new Point(0,gutter),new Point(margin,gutter));
gutterLeft.strokeColor = 'blue';
gutterRight = new Path.Line(new Point(w-margin,gutter), new Point(w,gutter));
gutterRight.strokeColor = 'blue';

gutterLine.remove();
myCurve.remove();

var exportOptions = {
  bounds: 'content',
  asString: true,
}

page.onClick = function(event) {
  svg = project.exportSVG(exportOptions);
  window.alert(svg);
};
