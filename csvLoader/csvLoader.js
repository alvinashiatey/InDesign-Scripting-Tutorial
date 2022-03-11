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
  var csvFilter = function (file) {
      return /\.csv$/i.test(file.name);
    },
    f = File.openDialog("Kindly select your CSV file", csvFilter, false),
    docsData = [],
    delimiter = ",";
  if (!f) return;
  f.open("r");
  var text = f.read();
  docsData = convert(text, delimiter);
  var doc = setupDoc();
  var layer_1 = doc.layers[0];
  var _loop_1 = function (item) {
    var txt = "";
    var textFrame = addPageTextFrame(doc, layer_1);
    Object.keys(item).forEach(function (key) {
      if (item[key] === "" || item[key] === " ") return;
      txt += "".concat(key, ": ").concat(item[key], "\n");
    });
    textFrame.contents = txt;
  };
  for (var _i = 0, docsData_1 = docsData; _i < docsData_1.length; _i++) {
    var item = docsData_1[_i];
    _loop_1(item);
  }
  doc.documentPreferences.facingPages = true;
}
function setupDoc() {
  try {
    var doc =
      app.documents.length > 0 ? app.activeDocument : app.documents.add();
    doc.documentPreferences.facingPages = false;
    return doc;
  } catch (e) {
    alert(e);
  }
}
function addPageTextFrame(document, layer, page, newPage) {
  if (page === void 0) {
    page = document.pages[0];
  }
  if (newPage === void 0) {
    newPage = true;
  }
  var np = newPage ? document.pages.add() : page;
  var pg = {
    width: parseFloat(document.documentPreferences.pageWidth.toString()),
    height: parseFloat(document.documentPreferences.pageHeight.toString()),
    y1: parseFloat(np.marginPreferences.top.toString()),
  };
  pg["y2"] = pg["height"] - parseFloat(np.marginPreferences.bottom.toString());
  if (np.side === PageSideOptions.LEFT_HAND) {
    pg["x1"] = parseFloat(np.marginPreferences.right.toString());
    pg["x2"] = pg["width"] - parseFloat(np.marginPreferences.left.toString());
  } else {
    pg["x1"] = parseFloat(np.marginPreferences.left.toString());
    pg["x2"] = pg["width"] - parseFloat(np.marginPreferences.right.toString());
  }
  var textFrame = np.textFrames.add(layer);
  textFrame.geometricBounds = [pg.y1, pg.x1, pg.y2, pg.x2];
  return textFrame;
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
var csvParser = function (strData, header) {
  if (header === void 0) {
    header = true;
  }
  var objPattern = /(\,|\r?\n|\r|^)(?:"((?:\\.|""|[^\\"])*)"|([^\,"\r\n]*))/gi;
  var headers = strData.split("\n")[0].split(",");
  var data = strData.slice(strData.indexOf("\n") + 1);
  var arrMatches = null,
    arrData = [[]];
  while ((arrMatches = objPattern.exec(data))) {
    if (
      arrMatches[1] !== undefined &&
      arrMatches[1].length &&
      arrMatches[1] !== ","
    )
      arrData.push([]);
    arrData[arrData.length - 1].push(
      arrMatches[2] ? arrMatches[2].replace(/[\\"](.)/g, "$1") : arrMatches[3]
    );
  }
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
