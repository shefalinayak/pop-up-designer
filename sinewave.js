var pxPerInch = 72;
var h = 11 * pxPerInch;
var w = 8.5 * pxPerInch;

var page = new Path.Rectangle(new Point(0,0),new Size(w,h));
page.fillColor = 'whitesmoke';
page.strokeColor = 'black';

var gutter = new Path.Line(new Point(0,h/2),new Point(w,h/2));
gutter.strokeColor = 'pink';

var sineWave = new Path();

var numSegments = 20;
var margin = 1;
var distFromGutter = 2.5;
var amplitude = 1;
var stripLength = 5;

margin *= pxPerInch;
distFromGutter *= pxPerInch;
amplitude *= pxPerInch;
stripLength *= pxPerInch;

var waveWidth = w - (2*margin);
for (var i = 0; i <= numSegments; i++) {
  var x = margin + (waveWidth * i / numSegments);
  var y = amplitude * Math.sin(2*Math.PI*i/numSegments);
  y += h/2 - distFromGutter;
  sineWave.add(new Point(x,y));
}
sineWave.strokeColor = 'red';

var disjointSineWaveTop = [];
var disjointSineWaveMiddle = [];
var disjointSineWaveBottom = [];
var segVector = new Point(waveWidth / numSegments,0);

for (var i = 0; i < numSegments; i++) {
  var startPt = sineWave.segments[i].point;
  var heightFromGutter = h/2 - startPt.y;
  var segTop = new Path.Line(startPt, startPt + segVector);
  segTop.strokeColor = 'blue';
  var segBottom = segTop.clone();
  segBottom.translate(0,stripLength);
  var segMiddle = segTop.clone();
  segMiddle.translate(0,stripLength-heightFromGutter);
  segMiddle.strokeColor = 'red';
  disjointSineWaveTop.push(segTop);
  disjointSineWaveBottom.push(segBottom);
  disjointSineWaveMiddle.push(segMiddle);
}

var cuts = [];

var cutline = new Path.Line(
  disjointSineWaveTop[0].firstSegment.point,
  disjointSineWaveBottom[0].firstSegment.point);
cutline.strokeColor = '#00ff00';
cuts.push(cutline);

for (var i = 1; i < numSegments; i++) {
  var topLeft = disjointSineWaveTop[i-1].lastSegment.point;
  var topRight = disjointSineWaveTop[i].firstSegment.point;
  var bottomLeft = disjointSineWaveBottom[i-1].lastSegment.point;
  var bottomRight = disjointSineWaveBottom[i].firstSegment.point;
  var top = (topLeft.y < topRight.y) ? topLeft : topRight;
  var bottom = (bottomLeft.y > bottomRight.y) ? bottomLeft : bottomRight;
  cutline = new Path.Line(top,bottom);
  cutline.strokeColor = '#00ff00';
  cuts.push(cutline);
}

cutline = new Path.Line(
  disjointSineWaveTop[numSegments-1].lastSegment.point,
  disjointSineWaveBottom[numSegments-1].lastSegment.point);
cutline.strokeColor = '#00ff00';
cuts.push(cutline);


gutterLeft = new Path.Line(new Point(0,h/2),new Point(margin,h/2));
gutterLeft.strokeColor = 'blue';
gutterRight = new Path.Line(new Point(w-margin,h/2), new Point(w,h/2));
gutterRight.strokeColor = 'blue';

sineWave.remove();
gutter.remove();

var exportOptions = {
  bounds: 'content',
  asString: true,
}

page.onClick = function(event) {
  svg = project.exportSVG(exportOptions);
  window.alert(svg);
};
