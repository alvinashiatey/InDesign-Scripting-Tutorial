"use strict";
Object.prototype.keys = function (obj) {
  var keys = [];
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      keys.push(key);
    }
  }
  return keys;
};
Array.prototype.forEach = function (callbackfn, thisArg) {
  var arr = this;
  for (var i = 0; i < arr.length; i++) {
    callbackfn.call(thisArg, arr[i], i, arr);
  }
};
Array.prototype.map = function (callbackfn, thisArg) {
  var newArray = [];
  for (var i = 0; i < this.length; i++) {
    newArray.push(callbackfn(this[i], i, this));
  }
  return newArray;
};
Array.prototype.entries = function () {
  var arr = this;
  return arr.map(function (value, index) {
    return [index, value];
  });
};
Array.prototype.reduce = function (callbackfn, initialValue) {
  var arr = this;
  var accumulator = initialValue;
  for (var i = 0; i < arr.length; i++) {
    accumulator = callbackfn(accumulator, arr[i], i, arr);
  }
  return accumulator;
};
Array.prototype.join = function (separator) {
  return this.reduce(function (acc, value) {
    return acc + value + separator;
  }, "");
};
String.prototype.trim = function () {
  return this.replace(/^\s+|\s+$/g, "");
};
function main() {
  var f = File.openDialog("Kindly select your CSV file", false),
    docsData = [],
    delimiter = ",";
  if (!f) return;
  if (!/\.csv$/i.test(f.name)) {
    alert("Please select a CSV file");
    return;
  }
  f.open("r");
  var text = f.read();
  docsData = convert(text, delimiter);
  setupDoc();
  var _loop_1 = function (index, item) {
    var pg = index === 0 ? addPage(false) : addPage();
    var moveBottom = 0;
    Object.keys(item).forEach(function (key) {
      if (item[key] === "" || item[key] === " ") return;
      var dim = [pg.dim.TOP + moveBottom, pg.dim.LEFT, 40, pg.dim.RIGHT];
      var _t = addText(pg.page, dim, item[key]);
      moveBottom +=
        parseFloat(_t.geometricBounds[2].toString()) -
        parseFloat(_t.geometricBounds[0].toString());
    });
    moveBottom = 0;
  };
  for (var _i = 0, _a = docsData.entries(); _i < _a.length; _i++) {
    var _b = _a[_i],
      index = _b[0],
      item = _b[1];
    _loop_1(index, item);
  }
}
function setupDoc() {
  try {
    var doc =
      app.documents.length > 0 ? app.activeDocument : app.documents.add();
    // needed when working with spreads.
    doc.viewPreferences.rulerOrigin = RulerOrigin.PAGE_ORIGIN;
    app.activeDocument.viewPreferences.horizontalMeasurementUnits =
      MeasurementUnits.MILLIMETERS;
    app.activeDocument.viewPreferences.verticalMeasurementUnits =
      MeasurementUnits.MILLIMETERS;
    doc.textPreferences.smartTextReflow = true;
    doc.textPreferences.limitToMasterTextFrames = true;
    doc.textPreferences.addPages = AddPageOptions.END_OF_STORY;
    return doc;
  } catch (e) {
    alert(e);
  }
}
function addPage(newPage) {
  if (newPage === void 0) {
    newPage = true;
  }
  if (app.activeDocument) {
    var doc = app.activeDocument;
    var page = newPage ? doc.pages.add() : doc.pages[0];
    var dim = {
      WIDTH: parseFloat(doc.documentPreferences.pageWidth.toString()),
      HEIGHT: parseFloat(doc.documentPreferences.pageHeight.toString()),
      TOP: parseFloat(doc.marginPreferences.top.toString()),
    };
    dim.BOTTOM =
      dim.HEIGHT - parseFloat(doc.marginPreferences.bottom.toString());
    if (page.side === PageSideOptions.LEFT_HAND) {
      dim.LEFT = parseFloat(doc.marginPreferences.right.toString());
      dim.RIGHT = dim.WIDTH - parseFloat(doc.marginPreferences.left.toString());
    } else {
      dim.LEFT = parseFloat(doc.marginPreferences.left.toString());
      dim.RIGHT =
        dim.WIDTH - parseFloat(doc.marginPreferences.right.toString());
    }
    return { page: page, dim: dim };
  }
}
function addText(page, position, text) {
  if (app.activeDocument) {
    var doc = app.activeDocument;
    var layer = void 0;
    if (doc.layers.item("CSV") == null) {
      layer = doc.layers.add({ name: "CSV" });
    } else {
      layer = doc.layers.item("CSV");
    }
    var _tf = page.textFrames.add(layer);
    _tf.contents = text;
    _tf.visibleBounds = position;
    _tf.textFramePreferences.autoSizingReferencePoint =
      AutoSizingReferenceEnum.TOP_LEFT_POINT;
    _tf.textFramePreferences.autoSizingType = AutoSizingTypeEnum.HEIGHT_ONLY;
    return _tf;
  }
}
function detectSeparator(csvFile) {
  var separators = [",", ";", "\t"];
  var counts = {},
    sepMax;
  for (var _i = 0, separators_1 = separators; _i < separators_1.length; _i++) {
    var sep = separators_1[_i];
    var re = new RegExp(sep, "g");
    counts[sep] = (csvFile.match(re) || []).length;
    sepMax = !sepMax || counts[sep] > counts[sepMax] ? sep : sepMax;
  }
  return sepMax;
}
function csvToArray(text) {
  var p = "",
    row = [""],
    ret = [row],
    i = 0,
    r = 0,
    s = !0,
    l;
  for (var _i = 0, text_1 = text; _i < text_1.length; _i++) {
    l = text_1[_i];
    if ('"' === l) {
      if (s && l === p) row[i] += l;
      s = !s;
    } else if ("," === l && s) l = row[++i] = "";
    else if ("\n" === l && s) {
      if ("\r" === p) row[i] = row[i].slice(0, -1);
      row = ret[++r] = [(l = "")];
      i = 0;
    } else row[i] += l;
    p = l;
  }
  return ret;
}
var csvParser = function (strData, header) {
  if (header === void 0) {
    header = true;
  }
  var headers = strData.split("\n")[0].split(",");
  var data = strData.slice(strData.indexOf("\n") + 1);
  var arrData = csvToArray(data);
  if (header) {
    return arrData.map(function (row) {
      var i = 0;
      return headers.reduce(function (acc, key) {
        acc[key] = (row[i++] || "").trim().replace(/(^")|("$)/g, "");
        return acc;
      }, {});
    });
  } else {
    return arrData;
  }
};
var convert = function (csvData, delimiter) {
  if (csvData.length == 0) throw Error("CSV data is empty");
  var separator = delimiter || detectSeparator(csvData);
  if (!separator) throw Error("Separator not found");
  var a = [];
  a = csvParser(csvData, true);
  return a;
};
main();
