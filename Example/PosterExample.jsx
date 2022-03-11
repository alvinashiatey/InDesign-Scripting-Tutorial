/* 

Script by: Alvin Ashiatey
This script generates random posters for the short tutorial for Mindy Seu class "On-gathering"[https://on-gathering.com/yale-spring22/index.html] organized on the 16th March 2022.

*/
var hex = [
  "#FFC600",
  "#5800FF",
  "#CD1818",
  "#914E72",
  "#00A95C",
  "#F15060",
  "#765BA7",
  "#FFE800",
  "#FF48B0",
  "#0074A2",
  "#9D7AD2",
  "#FFB511",
  "#5EC8E5",
  "#FF4C65",
  "#44D62C",
];
function main() {
  var doc = setup();
  var page_dim = addPage(doc).page_dim;
  background(page_dim);
  circle();
  titleText(page_dim);
  footerText(page_dim);
}
function titleText(page_dim) {
  var fontsize = page_dim.height / 2;
  var bounds = [page_dim.top, page_dim.left, page_dim.bottom, page_dim.right];
  var _tf = text(bounds, "InDesign Scripting by Alvin Ashiatey", fontsize);
  var randomFontIndex = Math.floor(Math.random() * app.fonts.length);
  var randomFonts = app.fonts[randomFontIndex].name;
  _tf.paragraphs[0].appliedFont = randomFonts;
}
function footerText(page_dim) {
  var y2 = page_dim.top;
  var bounds = [page_dim.top, page_dim.left, page_dim.bottom, page_dim.right];
  var _tf = text(bounds, "16-03-2022 ZOOM\r");
  _tf.paragraphs.everyItem().justification = Justification.FULLY_JUSTIFIED;
  _tf.paragraphs.everyItem().fillColor = colors("#FEFEFE");
  _tf.paragraphs.everyItem().leading = (20 / 75) * 100;
  while (y2 < page_dim.bottom) {
    _tf.contents += "16-03-2022 ZOOM\r";
    y2 += 8;
  }
}
function text(position, text, size) {
  if (size === void 0) {
    size = 20;
  }
  var doc = app.activeDocument;
  var layer;
  if (doc.layers.item(text) == null) {
    layer = doc.layers.add({
      name: text,
    });
  } else {
    layer = doc.layers.item(text);
  }
  var textFrame = doc.textFrames.add(layer);
  textFrame.textFramePreferences.verticalJustification =
    VerticalJustification.TOP_ALIGN;
  textFrame.contents = text;
  textFrame.visibleBounds = position;
  textFrame.paragraphs.everyItem().appliedFont = "Arial";
  textFrame.paragraphs.everyItem().justification = Justification.LEFT_ALIGN;
  textFrame.paragraphs.everyItem().pointSize = size;
  textFrame.paragraphs.everyItem().leading = (size / 130) * 100;
  textFrame.paragraphs.everyItem().capitalization = Capitalization.ALL_CAPS;
  colorText(textFrame);
  return textFrame;
}
function outlineText(text) {
  text.paragraphs.everyItem().fillColor = "None";
  text.paragraphs.everyItem().strokeColor = colors(
    hex[Math.floor(Math.random() * hex.length)]
  );
  return text;
}
function colorText(text) {
  text.paragraphs.everyItem().fillColor = colors(
    hex[Math.floor(Math.random() * hex.length)]
  );
  return text;
}
function colors(clr) {
  var doc = app.activeDocument;
  if (doc.colors.item(clr) == null) {
    doc.colors.add({
      name: clr,
      model: ColorModel.PROCESS,
      colorValue: hexToCMYK(clr),
    });
  }
  return doc.colors.item(clr);
}
function hexToCMYK(clr) {
  var r = parseInt(clr.substr(1, 2), 16);
  var g = parseInt(clr.substr(3, 2), 16);
  var b = parseInt(clr.substr(5, 2), 16);
  var c = 1 - r / 255;
  var m = 1 - g / 255;
  var y = 1 - b / 255;
  var k = Math.min(c, m, y);
  c = Math.round(((c - k) / (1 - k)) * 100);
  m = Math.round(((m - k) / (1 - k)) * 100);
  y = Math.round(((y - k) / (1 - k)) * 100);
  k = Math.round(k * 100);
  return [c, m, y, k];
}
function setup() {
  try {
    var d = app.documents.length > 0 ? app.activeDocument : app.documents.add();
    app.activeDocument.viewPreferences.horizontalMeasurementUnits =
      MeasurementUnits.MILLIMETERS;
    app.activeDocument.viewPreferences.verticalMeasurementUnits =
      MeasurementUnits.MILLIMETERS;
    d.marginPreferences.top = "5mm";
    d.marginPreferences.bottom = "5mm";
    d.marginPreferences.left = "5mm";
    d.marginPreferences.right = "5mm";
    d.textPreferences.smartTextReflow = true;
    d.textPreferences.limitToMasterTextFrames = true;
    d.textPreferences.addPages = AddPageOptions.END_OF_STORY;
    return d;
  } catch (e) {
    alert(e);
  }
}
function addPage(document) {
  var pg = document.pages.length ? document.pages[0] : document.pages.add();
  var pg_dim = {
    width: parseFloat(document.documentPreferences.pageWidth.toString()),
    height: parseFloat(document.documentPreferences.pageHeight.toString()),
    top: parseFloat(document.marginPreferences.top.toString()),
  };
  pg_dim.bottom =
    pg_dim.height - parseFloat(document.marginPreferences.bottom.toString());
  if (pg.side === PageSideOptions.LEFT_HAND) {
    pg_dim.left = parseFloat(document.marginPreferences.right.toString());
    pg_dim.right =
      pg_dim.width - parseFloat(document.marginPreferences.left.toString());
  } else {
    pg_dim.left = parseFloat(document.marginPreferences.left.toString());
    pg_dim.right =
      pg_dim.width - parseFloat(document.marginPreferences.right.toString());
  }
  return {
    page: pg,
    page_dim: pg_dim,
  };
}
function background(page_dim) {
  var doc = app.activeDocument;
  var layer;
  if (doc.layers.item("background") == null) {
    layer = doc.layers.add({
      name: "background",
    });
  } else {
    layer = doc.layers.item("background");
  }
  var _rect = doc.rectangles.add(layer);
  _rect.geometricBounds = [0, 0, page_dim.height, page_dim.width];
  _rect.fillColor = colors(hex[Math.floor(Math.random() * hex.length)]);
}
function circle() {
  var doc = app.activeDocument;
  var layer;
  if (doc.layers.item("circle") == null) {
    layer = doc.layers.add({
      name: "circle",
    });
  } else {
    layer = doc.layers.item("circle");
  }
  var w = parseFloat(doc.documentPreferences.pageWidth.toString()) - 10;
  var h = parseFloat(doc.documentPreferences.pageHeight.toString()) - 10;
  var y1 = 10;
  var y2 = 40;
  for (var i = 0; i < 4; i++) {
    var _circle = doc.ovals.add(layer);
    _circle.geometricBounds = [y1, 10, y2, w];
    _circle.fillColor = "None";
    _circle.strokeColor = colors("#fefefe");
    _circle.strokeWeight = 1;
    var rotation = app.transformationMatrices.add({
      counterclockwiseRotationAngle: Math.random() * 360 * (Math.PI / 120),
    });
    _circle.transform(
      CoordinateSpaces.PASTEBOARD_COORDINATES,
      AnchorPoint.CENTER_ANCHOR,
      rotation,
      []
    );
    y1 += h / 4;
    y2 += h / 4;
  }
}
main();
