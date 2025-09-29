//ADDED FOR LEOS LOADING: START
(function($, window, define) {
  //ADDED FOR LEOS LOADING: END

/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 13:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LO: () => (/* binding */ extractLinkedDataType),
/* harmony export */   Tc: () => (/* binding */ extractLinkedDataIds),
/* harmony export */   V7: () => (/* binding */ extractIdList),
/* harmony export */   gI: () => (/* binding */ extractCelexAttributes),
/* harmony export */   gq: () => (/* binding */ extractLinkedDataId),
/* harmony export */   gy: () => (/* binding */ extractCelexIdList),
/* harmony export */   ip: () => (/* binding */ extractCelexId)
/* harmony export */ });
/* unused harmony export extractId */
/* harmony import */ var _manager_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(33);
/* harmony import */ var _utils_functions_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(588);
/* harmony import */ var _settings_index_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(265);
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }




/**
 * Extract CELEX id from attributes map
 * @param {Object} data
 * @returns {String|null} celex id if found 
 */
var extractCelexId = function extractCelexId(data) {
  for (var i = 0; i < _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_CELEX_SUFFIXES */ .zB.length; i++) {
    var suffix = _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_CELEX_SUFFIXES */ .zB[i];
    if (data[_manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_CELEX */ .wD + suffix] || data["data-" + _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_CELEX */ .wD + suffix] || data["data-ref-" + _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_CELEX */ .wD + suffix]) {
      return data[_manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_CELEX */ .wD + suffix] || data["data-" + _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_CELEX */ .wD + suffix] || data["data-ref-" + _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_CELEX */ .wD + suffix];
    }
  }
  return null;
};

/**
 * Returns a list of celex ids from the attributes (sometimes views have different celex id variants eg. Compos/AG)
 * @param {Object} data
 * @returns {Array<string>} 
 */
var extractCelexIdList = function extractCelexIdList(data) {
  var ids = [];
  var suffixes = _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_CELEX_SUFFIXES */ .zB;
  Object.keys(data).forEach(function (key) {
    suffixes.forEach(function (suffix) {
      var id = data[_manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_CELEX */ .wD + suffix] || data["data-" + _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_CELEX */ .wD + suffix] || data["data-ref-" + _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_CELEX */ .wD + suffix];
      if (id) {
        ids.push(id);
      }
    });
  });

  //unique ids only
  return ids.filter(function (v, i, a) {
    return a.indexOf(v) === i;
  });
};
var extractIdList = function extractIdList(data) {
  var ids = [];
  var id;

  // collect CELEX ids
  var suffixes = _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_CELEX_SUFFIXES */ .zB;
  Object.keys(data).forEach(function (key) {
    suffixes.forEach(function (suffix) {
      id = data[_manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_CELEX */ .wD + suffix] || data["data-" + _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_CELEX */ .wD + suffix] || data["data-ref-" + _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_CELEX */ .wD + suffix];
      if (id) {
        ids.push(id);
      }
    });
  });

  // collect ELI ids
  id = data[_manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_ELI */ .xc] || data["data-" + _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_ELI */ .xc] || data["data-ref-" + _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_ELI */ .xc];
  if (id) {
    ids.push(id);
  }

  // collect ECLI ids
  id = data[_manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_ECLI */ .kl] || data["data-" + _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_ECLI */ .kl] || data["data-ref-" + _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_ECLI */ .kl];
  if (id) {
    ids.push(id);
  }

  // collect OJ ids
  id = data[_manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_OJ */ .aP] || data["data-" + _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_OJ */ .aP] || data["data-ref-" + _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_OJ */ .aP];
  if (id) {
    ids.push(id);
  }

  // collect PROC ids
  id = data[_manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_PROCEDURE */ .aO] || data["data-" + _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_PROCEDURE */ .aO] || data["data-ref-" + _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_PROCEDURE */ .aO];
  if (id) {
    ids.push(id);
  }

  // collect CONSIL ids
  id = data[_manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_CONSIL */ .nI] || data["data-" + _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_CONSIL */ .nI] || data["data-ref-" + _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_CONSIL */ .nI];
  if (id) {
    ids.push(id);
  }

  // collect CIS ids
  id = data[_manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_CIS */ .gh] || data["data-" + _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_CIS */ .gh] || data["data-ref-" + _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_CIS */ .gh];
  if (id) {
    ids.push(id);
  }

  // collect HANDOC ids
  id = data[_manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_HANDOC */ .S0] || data["data-" + _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_HANDOC */ .S0] || data["data-ref-" + _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_HANDOC */ .S0];
  if (id) {
    ids.push(id);
  }

  //unique ids only
  ids = ids.filter(function (v, i, a) {
    return a.indexOf(v) === i;
  });
  return ids;
};

/**
 * Extract the id from a target attributes (CELEX/ELI/ECLI/HANDOC/CIS/PROCDOC/CONSIL)
 * @param {Object} data
 * @returns {String|null} celex id if found 
 */
var extractId = function extractId(data) {
  var id;
  for (var i = 0; i < LD_CELEX_SUFFIXES.length; i++) {
    var suffix = LD_CELEX_SUFFIXES[i];
    if (data[LD_TYPE_CELEX + suffix] || data["data-" + LD_TYPE_CELEX + suffix] || data["data-ref-" + LD_TYPE_CELEX + suffix]) {
      id = data[LD_TYPE_CELEX + suffix] || data["data-" + LD_TYPE_CELEX + suffix] || data["data-ref-" + LD_TYPE_CELEX + suffix];
    }
  }
  if (id) {
    return id;
  }

  // collect ELI ids
  id = data[LD_TYPE_ELI] || data["data-" + LD_TYPE_ELI] || data["data-ref-" + LD_TYPE_ELI];
  if (id) {
    return id;
  }

  // collect ECLI ids
  id = data[LD_TYPE_ECLI] || data["data-" + LD_TYPE_ECLI] || data["data-ref-" + LD_TYPE_ECLI];
  if (id) {
    return id;
  }

  // collect PROC ids
  id = data[LD_TYPE_PROCEDURE] || data["data-" + LD_TYPE_PROCEDURE] || data["data-ref-" + LD_TYPE_PROCEDURE];
  if (id) {
    return id;
  }

  // collect CONSIL ids
  id = data[LD_TYPE_CONSIL] || data["data-" + LD_TYPE_CONSIL] || data["data-ref-" + LD_TYPE_CONSIL];
  if (id) {
    return id;
  }

  // collect CIS ids
  id = data[LD_TYPE_CIS] || data["data-" + LD_TYPE_CIS] || data["data-ref-" + LD_TYPE_CIS];
  if (id) {
    return id;
  }

  // collect HANDOC ids
  id = data[LD_TYPE_HANDOC] || data["data-" + LD_TYPE_HANDOC] || data["data-ref-" + LD_TYPE_HANDOC];
  if (id) {
    return id;
  }

  // collect OJ ids
  id = data[LD_TYPE_OJ] || data["data-" + LD_TYPE_OJ] || data["data-ref-" + LD_TYPE_OJ];
  if (id) {
    return id;
  }
  return null;
};

/**
 * Used to extract target attributes from matches marked with a specific LD type
 * @param {Object} matches
 * @param {String} type LD_CELLAR_NUMBER_CELEX|LD_CELLAR_SUBNUMBER_CELEX
 * @returns {Array<Object>} list of attributes 
 */
var extractCelexAttributes = function extractCelexAttributes(matches, type) {
  var attributesList = [];
  Object.keys(matches).forEach(function (key) {
    matches[key].offsets.forEach(function (offset) {
      var attributes = (0,_utils_functions_js__WEBPACK_IMPORTED_MODULE_1__/* .extractAttributes */ .pt)(offset.views);
      var celexId = extractCelexId(attributes);
      //if the rule has linked-data markings we add the celexId 
      if (offset.rule.ld.length > 0 && offset.rule.ld.indexOf(type) !== -1 && celexId) {
        attributesList.push(attributes);
      }
    });
  });
  return attributesList;
};

/**
 * Extract property to be used as identifier (of a supported type) from target attributes
 * @param {Object} data
 * @returns {String|null} unique linked data identifier 
 */
function extractLinkedDataId(data) {
  // attributes might contain multiple celex ids (suffixed by numbers eg. data-ref-celex-1)
  var celexId = extractCelexId(data);
  if (celexId) {
    return celexId;
  }
  if (data[_manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_ECLI */ .kl] || data["data-" + _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_ECLI */ .kl] || data["data-ref-" + _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_ECLI */ .kl]) {
    var ecliLinkedDataId = data[_manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_ECLI */ .kl] || data["data-" + _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_ECLI */ .kl] || data["data-ref-" + _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_ECLI */ .kl];
    // For non-EU ECLI ids we don't have linked data
    if (ecliLinkedDataId && String(ecliLinkedDataId).slice(0, 5) === "ECLI:" && String(ecliLinkedDataId).slice(0, 7) !== "ECLI:EU") {
      return null;
    }
    return ecliLinkedDataId;
  }
  if (data[_manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_OJ */ .aP] || data["data-" + _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_OJ */ .aP] || data["data-ref-" + _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_OJ */ .aP]) {
    var eliId = data[_manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_OJ */ .aP] || data["data-" + _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_OJ */ .aP] || data["data-ref-" + _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_OJ */ .aP];
    return eliId;
  }
  if (data[_manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_ELI */ .xc] || data["data-" + _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_ELI */ .xc] || data["data-ref-" + _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_ELI */ .xc]) {
    var _eliId = data[_manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_ELI */ .xc] || data["data-" + _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_ELI */ .xc] || data["data-ref-" + _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_ELI */ .xc];
    return _eliId;
  }
  if (data[_manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_PROCEDURE */ .aO] || data["data-" + _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_PROCEDURE */ .aO] || data["data-ref-" + _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_PROCEDURE */ .aO]) {
    return data[_manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_PROCEDURE */ .aO] || data["data-" + _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_PROCEDURE */ .aO] || data["data-ref-" + _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_PROCEDURE */ .aO];
  }
  if (data[_manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_CONSIL */ .nI] || data["data-" + _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_CONSIL */ .nI] || data["data-ref-" + _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_CONSIL */ .nI]) {
    return data[_manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_CONSIL */ .nI] || data["data-" + _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_CONSIL */ .nI] || data["data-ref-" + _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_CONSIL */ .nI];
  }
  if (data[_manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_IMMC */ .pO] || data["data-" + _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_IMMC */ .pO] || data["data-ref-" + _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_IMMC */ .pO]) {
    return data[_manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_IMMC */ .pO] || data["data-" + _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_IMMC */ .pO] || data["data-ref-" + _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_IMMC */ .pO];
  }
  if (data[_manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_FINLEX */ .DZ] || data["data-" + _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_FINLEX */ .DZ] || data["data-ref-" + _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_FINLEX */ .DZ]) {
    return data[_manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_FINLEX */ .DZ] || data["data-" + _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_FINLEX */ .DZ] || data["data-ref-" + _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_FINLEX */ .DZ];
  }
  if (R2L.hasLinkedDataMode(_settings_index_js__WEBPACK_IMPORTED_MODULE_2__/* .LD_ADVANCED_MODE_KM_HANDOC */ .n_)) {
    if (data[_manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_HANDOC */ .S0] || data["data-" + _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_HANDOC */ .S0] || data["data-ref-" + _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_HANDOC */ .S0]) {
      return data[_manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_HANDOC */ .S0] || data["data-" + _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_HANDOC */ .S0] || data["data-ref-" + _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_HANDOC */ .S0];
    }
  }
  if (R2L.hasLinkedDataMode(_settings_index_js__WEBPACK_IMPORTED_MODULE_2__/* .LD_ADVANCED_MODE_KM_CIS */ .PR)) {
    if (data[_manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_CIS */ .gh] || data["data-" + _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_CIS */ .gh] || data["data-ref-" + _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_CIS */ .gh]) {
      return data[_manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_CIS */ .gh] || data["data-" + _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_CIS */ .gh] || data["data-ref-" + _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_CIS */ .gh];
    }
  }
  return null;
}
function extractLinkedDataType(data) {
  // attributes might contain multiple celex ids (suffixed by numbers eg. data-ref-celex-1)
  var celexId = extractCelexId(data);
  if (celexId) {
    return _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_CELEX */ .wD;
  }
  if (data[_manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_ECLI */ .kl] || data["data-" + _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_ECLI */ .kl] || data["data-ref-" + _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_ECLI */ .kl]) {
    var ecliLinkedDataId = data[_manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_ECLI */ .kl] || data["data-" + _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_ECLI */ .kl] || data["data-ref-" + _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_ECLI */ .kl];
    // For non-EU ECLI ids we don't have linked data
    if (ecliLinkedDataId && String(ecliLinkedDataId).slice(0, 5) === "ECLI:" && String(ecliLinkedDataId).slice(0, 7) !== "ECLI:EU") {
      return null;
    }
    return _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_ECLI */ .kl;
  }
  if (data[_manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_ELI */ .xc] || data["data-" + _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_ELI */ .xc] || data["data-ref-" + _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_ELI */ .xc]) {
    return _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_ELI */ .xc;
  }
  if (data[_manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_PROCEDURE */ .aO] || data["data-" + _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_PROCEDURE */ .aO] || data["data-ref-" + _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_PROCEDURE */ .aO]) {
    return _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_PROCEDURE */ .aO;
  }
  if (data[_manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_FINLEX */ .DZ] || data["data-" + _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_FINLEX */ .DZ] || data["data-ref-" + _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_FINLEX */ .DZ]) {
    return _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_FINLEX */ .DZ;
  }
  if (data[_manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_HANDOC */ .S0] || data["data-" + _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_HANDOC */ .S0] || data["data-ref-" + _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_HANDOC */ .S0]) {
    return _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_HANDOC */ .S0;
  }
  if (data[_manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_CIS */ .gh] || data["data-" + _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_CIS */ .gh] || data["data-ref-" + _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_CIS */ .gh]) {
    return _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_CIS */ .gh;
  }
  if (data[_manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_CONSIL */ .nI] || data["data-" + _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_CONSIL */ .nI] || data["data-ref-" + _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_CONSIL */ .nI]) {
    return _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_CONSIL */ .nI;
  }
  if (data[_manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_OJ */ .aP] || data["data-" + _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_OJ */ .aP] || data["data-ref-" + _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_OJ */ .aP]) {
    return _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_OJ */ .aP;
  }
  if (data[_manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_IMMC */ .pO] || data["data-" + _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_IMMC */ .pO] || data["data-ref-" + _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_IMMC */ .pO]) {
    return _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_IMMC */ .pO;
  }
  return null;
}

/**
 * Collect linked data ids by type from nodes
 * @param {Array<Object>} nodes
 * 
 * @returns {Object} map of identifiers
 */
function extractLinkedDataIds(nodes) {
  var celexIds = [];
  var ecliIds = [];
  var eliIds = [];
  var procedureIds = [];
  var finlexEliIds = [];
  var aresHandocIds = [];
  var cisIds = [];
  var consilIds = [];
  var ojIds = [];
  var immcIds = [];
  nodes.forEach(function (ref) {
    celexIds = celexIds.concat(ref.data.map(function (d) {
      return extractCelexId(d);
    }));
    eliIds = eliIds.concat(ref.data.map(function (d) {
      return d[_manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_ELI */ .xc];
    }));
    procedureIds = procedureIds.concat(ref.data.map(function (d) {
      return d[_manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_PROCEDURE */ .aO];
    }));
    finlexEliIds = finlexEliIds.concat(ref.data.map(function (d) {
      return d[_manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_FINLEX */ .DZ];
    }));
    aresHandocIds = aresHandocIds.concat(ref.data.map(function (d) {
      return d[_manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_HANDOC */ .S0];
    }));
    cisIds = cisIds.concat(ref.data.map(function (d) {
      return d[_manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_CIS */ .gh];
    }));
    consilIds = consilIds.concat(ref.data.map(function (d) {
      return d[_manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_CONSIL */ .nI];
    }));
    ojIds = ojIds.concat(ref.data.map(function (d) {
      return d[_manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_OJ */ .aP];
    }));
    immcIds = immcIds.concat(ref.data.map(function (d) {
      return d[_manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_IMMC */ .pO];
    }));
  });
  celexIds = celexIds.filter(function (celexId) {
    return !!celexId;
  });
  eliIds = eliIds.filter(function (eliId) {
    return !!eliId;
  });
  procedureIds = procedureIds.filter(function (procedureId) {
    return !!procedureId;
  });
  finlexEliIds = finlexEliIds.filter(function (finlexEliId) {
    return !!finlexEliId;
  });
  aresHandocIds = aresHandocIds.filter(function (aresId) {
    return !!aresId;
  });
  consilIds = consilIds.filter(function (consilId) {
    return !!consilId;
  });
  cisIds = cisIds.filter(function (cisId) {
    return !!cisId;
  });
  ojIds = ojIds.filter(function (ojId) {
    return !!ojId;
  });
  immcIds = immcIds.filter(function (immcId) {
    return !!immcId;
  });
  nodes.forEach(function (ref) {
    ecliIds = ecliIds.concat(ref.data.map(function (d) {
      return d[_manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_CELEX */ .wD] ? null : d[_manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_ECLI */ .kl];
    })); //if there's a CELEX don't load anything
  });
  ecliIds = ecliIds.filter(function (ecliId) {
    return !!ecliId && String(ecliId).slice(0, 7) === "ECLI:EU"; // only use ECLI EU ids
  });
  return _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty({}, _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_CELEX */ .wD, celexIds), _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_ECLI */ .kl, ecliIds), _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_ELI */ .xc, eliIds), _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_PROCEDURE */ .aO, procedureIds), _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_FINLEX */ .DZ, finlexEliIds), _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_HANDOC */ .S0, aresHandocIds), _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_CIS */ .gh, cisIds), _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_CONSIL */ .nI, consilIds), _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_OJ */ .aP, ojIds), _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_IMMC */ .pO, immcIds);
}

/***/ }),

/***/ 33:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  zB: () => (/* binding */ LD_CELEX_SUFFIXES),
  xL: () => (/* binding */ LD_TARGET_CELLAR),
  wD: () => (/* binding */ LD_TYPE_CELEX),
  gh: () => (/* binding */ LD_TYPE_CIS),
  nI: () => (/* binding */ LD_TYPE_CONSIL),
  kl: () => (/* binding */ LD_TYPE_ECLI),
  xc: () => (/* binding */ LD_TYPE_ELI),
  DZ: () => (/* binding */ LD_TYPE_FINLEX),
  S0: () => (/* binding */ LD_TYPE_HANDOC),
  pO: () => (/* binding */ LD_TYPE_IMMC),
  aP: () => (/* binding */ LD_TYPE_OJ),
  aO: () => (/* binding */ LD_TYPE_PROCEDURE),
  Q8: () => (/* binding */ LinkedDataManager),
  WV: () => (/* binding */ SPARQL_STATUS_ERROR),
  Nl: () => (/* binding */ SPARQL_STATUS_PENDING),
  X: () => (/* binding */ SPARQL_STATUS_SUCCESS),
  S_: () => (/* binding */ cleanLinkedDataBinding),
  yP: () => (/* binding */ getEndpoint),
  QT: () => (/* binding */ getLinkedDataLanguage)
});

// UNUSED EXPORTS: Binding, CELLAR_JOINED_EUCASE_DATA_CACHE_KEY, CELLAR_JOINED_EUCASE_DATA_PROCESSED_CACHE_KEY, LD_TARGET_ELI, LD_TARGET_FINLEX, LD_TARGET_KM, SPARQL_STATUS_INIT, getEurlexContentEndpoint, sanitizeLinkedDataBinding

// EXTERNAL MODULE: ./src/lib/settings/index.js
var settings = __webpack_require__(265);
// EXTERNAL MODULE: ./src/lib/translations/index.js + 1 modules
var translations = __webpack_require__(337);
;// ./src/lib/manager/query/celex.js
/**
 * Query by CELEX ids
 * @param {Array<String>} celexIds 
 * @param {String} langISO3 (optional, will default to ENG)
 * 
 * @returns {String}
 */
var getCelexQuery = function getCelexQuery(celexIds, langISO3) {
  var langISO3s = langISO3 ? [String(langISO3).toUpperCase()] : ["ENG", "FRA"]; // default to english or french
  var langISO3Filters = "FILTER (?lang IN (";
  for (var i = 0; i < langISO3s.length; i++) {
    langISO3Filters += "lang:".concat(langISO3s[i]);
    if (i < langISO3s.length - 1) {
      langISO3Filters += ",";
    }
  }
  langISO3Filters += "))";

  // unique ids only
  celexIds = celexIds.filter(function (v, i, a) {
    return a.indexOf(v) === i;
  });
  var filters = "FILTER (?workId IN (";
  for (var _i = 0; _i < celexIds.length; _i++) {
    filters += "\"celex:".concat(celexIds[_i], "\", \"celex:").concat(celexIds[_i], "\"^^xsd:string"); // query both types
    if (_i < celexIds.length - 1) {
      filters += ",";
    }
  }
  filters += "))";
  var pointInTimeFilter1 = '';
  var pointInTimeFilter2 = '';
  var pointInTimeFilter3 = '';
  var pointInTimeFilter4 = '';
  if (R2L.options.pointInTime) {
    pointInTimeFilter1 = "FILTER(?consolidatedDate < \"".concat(R2L.options.pointInTime, "\"^^xsd:date)");
    pointInTimeFilter2 = "FILTER(?consolidatedDate2 < \"".concat(R2L.options.pointInTime, "\"^^xsd:date)");
    pointInTimeFilter3 = "FILTER(?repealDate < \"".concat(R2L.options.pointInTime, "\"^^xsd:date)");
    pointInTimeFilter4 = "FILTER(?repealDate2 < \"".concat(R2L.options.pointInTime, "\"^^xsd:date)");
  }
  var query = "\n        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n        PREFIX cdm:<http://publications.europa.eu/ontology/cdm#>\n        PREFIX skos:<http://www.w3.org/2004/02/skos/core#>\n        PREFIX dc:<http://purl.org/dc/elements/1.1/>\n        PREFIX lang:<http://publications.europa.eu/resource/authority/language/>\n        PREFIX xsd:<http://www.w3.org/2001/XMLSchema#>\n        PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n        PREFIX owl:<http://www.w3.org/2002/07/owl#>\n\n        SELECT DISTINCT \n            ?date ?id \n            ?title \n            ?baseTitle\n            ?eli \n            ?ecli\n            ?force \n            MIN(?dateForce) as ?dateForce\n            (REPLACE(?oj, \" /, \\\\.\\\\.\", \"\", \"i\") as ?oj)\n            ?ojId \n            ?ojResourceUrl\n            ?ojDate\n            ?consolidatedDate \n            ?consolidatedEli \n            ?consolidatedId\n            MAX(?dateValidity) as ?dateValidity\n            ?repealCelexId \n            ?repealEli\n            ?lastRepealCelexId\n            ?lastRepealEli\n            ?resourceUrl\n            ?dossierTitle\n            ?lang\n{\n        SELECT \n            ?date ?workId as ?id \n            ?title \n            ?baseTitle\n            ?eli \n            ?ecli\n            ?force \n            ?dateForce \n            (IF(BOUND(?ojIdOld), ?ojIdOld, ?ojActId) as ?ojId)\n            (IF(BOUND(?ojResourceUrlOld), ?ojResourceUrlOld, ?ojActResourceUrl) as ?ojResourceUrl)\n            (IF(BOUND(?ojDateOld), ?ojDateOld, ?ojActDate) as ?ojDate)\n            (IF(BOUND(?ojOld), ?ojOld, CONCAT(CONCAT(CONCAT(CONCAT(CONCAT(REPLACE(STR(?ojCollectionDocumentIdentifier ) , \"-\", \" \", \"i\"), \" \"), CONCAT(?ojActYear, \"/\"))), CONCAT(?ojActNumber, \", \")), \n            CONCAT(CONCAT(SUBSTR(STR(?ojActDate), 9, 2), \".\"), CONCAT(CONCAT(SUBSTR(STR(?ojActDate), 6, 2), \".\")), SUBSTR(STR(?ojActDate), 1, 4)))) as ?oj)\n            ?consolidatedDate \n            ?consolidatedEli \n            ?consolidatedId\n            ?dateValidity\n            ?repealCelexId \n            ?repealEli\n            ?lastRepealCelexId\n            ?lastRepealEli\n            ?resourceUrl\n            ?dossierTitle\n            ?lang\n        WHERE {  \n            graph ?ge { \n                ?exp cdm:expression_belongs_to_work ?s .\n                ?exp cdm:expression_title ?title_ .\n                OPTIONAL {\n                    ?exp owl:sameAs ?resourceUrl .\n                    FILTER (REGEX(?resourceUrl, \"resource/oj/\"))\n                }\n            }\n            graph ?g { \n                ?exp cdm:expression_uses_language ?lang\n                ".concat(langISO3Filters, "\n            }  \n\n            ?s cdm:work_date_document ?date .\n            ?s rdf:type ?type .\n            ?s cdm:work_id_document ?workId.\n            OPTIONAL {\n                ?s2 cdm:work_id_document ?workId.\n                ?s2 cdm:work_part_of_dossier ?dossier.\n                ?dossier cdm:dossier_title ?dossierTitle\n            }\n            OPTIONAL {\n                ?s cdm:case-law_ecli ?ecli\n            }\n            OPTIONAL {\n                ?s cdm:resource_legal_date_end-of-validity ?dateValidity .\n            }\n            ").concat(filters, "\n            \n            FILTER not exists {?s cdm:work_is_member_of_complex_work ?complex. }\n            OPTIONAL {\n                # CONSOLIDATION\n                ?actConsolidated cdm:act_consolidated_based_on_resource_legal ?s .\n                ?actConsolidated cdm:act_consolidated_date ?consolidatedDate .\n                ?actConsolidated cdm:resource_legal_date_entry-into-force ?consolidatedDateEntryForce .\n                ?actConsolidated cdm:resource_legal_eli ?consolidatedEli . \n                ?actConsolidated cdm:work_id_document ?consolidatedId_ .\n                \n                # we only need results before the end of the act validity\n                ?s cdm:resource_legal_date_end-of-validity ?act_end_of_validity .\n\n                ").concat(pointInTimeFilter1, "\n                FILTER (?consolidatedDateEntryForce < ?act_end_of_validity)     \n                FILTER regex(str(?consolidatedId_), \"celex:\")     \n                # latest consolidation date only\n                FILTER not exists {\n                    ?actConsolidated2 cdm:resource_legal_date_entry-into-force ?consolidatedDateEntryForce2 .\n                    ?actConsolidated2 cdm:act_consolidated_date ?consolidatedDate2 .\n                    ?actConsolidated2 cdm:act_consolidated_based_on_resource_legal ?s .\n                    ?s cdm:resource_legal_date_end-of-validity ?act_end_of_validity2 .\n                    ").concat(pointInTimeFilter2, "\n                    FILTER (?consolidatedDateEntryForce2 > ?consolidatedDateEntryForce AND (?consolidatedDateEntryForce2 < ?act_end_of_validity2))\n                }\n\n                BIND(SUBSTR(?consolidatedId_, 7) as ?consolidatedId)\n            }\n            OPTIONAL {\n                # REPEALING\n                ?actRepeal cdm:resource_legal_repeals_resource_legal ?s .\n                ?actRepeal cdm:resource_legal_eli ?repealEli . \n                ?actRepeal cdm:work_date_document ?repealDate . \n                ?actRepeal cdm:work_id_document ?repealCelexId_.\n                ").concat(pointInTimeFilter3, "\n                FILTER regex(str(?repealCelexId_), \"celex:\")                    \n                BIND(SUBSTR(?repealCelexId_, 7) as ?repealCelexId)\n\n                OPTIONAL {\n                    # REPEALING LAST\n                    ?lastActRepeal cdm:resource_legal_repeals_resource_legal+ ?s .\n                    ?lastActRepeal cdm:resource_legal_eli ?lastRepealEli . \n                    ?lastActRepeal cdm:work_id_document ?lastRepealCelexId_.\n                    FILTER regex(str(?lastRepealCelexId_), \"celex:\")                    \n                    FILTER not exists {\n                       ?actRepeal_ cdm:resource_legal_repeals_resource_legal ?lastActRepeal .\n                       ?actRepeal_ cdm:work_date_document ?repealDate2\n                       ").concat(pointInTimeFilter4, "\n                    } \n                    BIND(SUBSTR(?lastRepealCelexId_, 7) as ?lastRepealCelexId)\n                }\n            }\n            OPTIONAL {\n                ?s cdm:resource_legal_eli ?eli .\n            }\n            OPTIONAL {\n                # FORCE\n                ?s cdm:resource_legal_in-force ?force .\n                ?s cdm:resource_legal_date_entry-into-force ?dateForce .\n            }        \n            OPTIONAL {\n                # MANIFEST \n                ?manif cdm:manifestation_manifests_expression ?exp. \n                ?manif cdm:manifestation_type ?manifType .\n                FILTER(STR(?manifType)=\"print\" || BOUND(?ojPageFirst)) .\n\n                # MANIFEST OJ PAGE (optional)\n                OPTIONAL {\n                    ?manif cdm:manifestation_official-journal_part_page_first ?ojPageFirst.\n                    ?manif cdm:manifestation_official-journal_part_page_last ?ojPageLast.\n                }\n\n                ?manif cdm:manifestation_part_of_manifestation ?parentManif.\n                OPTIONAL {\n                    ?parentManif owl:sameAs ?langSpecificManif.\n                }\n                OPTIONAL {\n                    ?manif owl:sameAs ?manifOjResourceUrl .\n                    # We need to use the MANIFEST to get to the OJ\n                    FILTER (STRSTARTS(STR(?manifOjResourceUrl), \"http://publications.europa.eu/resource/oj/\"))\n                }\n\n                # OJ info\n                ?s cdm:resource_legal_published_in_official-journal ?q .\n                ?q cdm:official-journal_part_of_collection_document ?ojPartOld .\n                ?q cdm:official-journal_number ?ojNumberOld .\n                OPTIONAL {\n                    ?q cdm:official-journal_class ?ojClassOld .\n                }\n                ?ojPartOld skos:prefLabel ?ojPartLabelOld .\n                ?q cdm:official-journal_volume ?ojVolumeOld .\n                ?q cdm:publication_general_date_publication ?ojDateOld .\n                \n                # cross match with parent OJ resource\n                ?q owl:sameAs ?mainOjResourceUrlOld .\n                ?q cdm:work_id_document ?ojIdOld.\n                \n                # multiple OJ publications can cause trouble so we cross-match the OJ url with the manifest's (where available)\n                FILTER (!BOUND(?langSpecificManif) || STRSTARTS(STR(?langSpecificManif), STR(?mainOjResourceUrlOld)) || (REGEX(STR(?langSpecificManif), 'resource/oj/DD_')))\n                FILTER (STRSTARTS(STR(?ojIdOld), \"oj:\") AND STRSTARTS(STR(?mainOjResourceUrlOld), \"http://publications.europa.eu/resource/oj/\")) \n                BIND(?mainOjResourceUrlOld as ?ojResourceUrlOld)\n\n                BIND(CONCAT(STR(DAY(?ojDateOld)), \n                \".\", \n                STR(MONTH(?ojDateOld)), \n                \".\", \n                STR(YEAR(?ojDateOld))) as ?ojDatePublicationOld)\n\n                # OJ label; do not modify as it will be processed for translation\n                BIND(IF(BOUND(?ojPartLabelOld), \n                CONCAT(CONCAT(REPLACE(?ojPartLabelOld, \"-\", \" \", \"i\"), \" \", \n                CONCAT(?ojNumberOld, \n                CONCAT(IF (STR(?ojClassOld) != \"R\", ?ojClassOld, \"\"),\n                CONCAT(\", \", CONCAT($ojDatePublicationOld,\n                    CONCAT(IF(BOUND(?ojPageFirst), \", p. \", \"\"), \n                    CONCAT(IF(BOUND(?ojPageFirst), xsd:integer(?ojPageFirst), \"\"), \n                    CONCAT(IF(BOUND(?ojPageLast), \"-\", \"\"), IF(BOUND(?ojPageLast), xsd:integer(?ojPageLast), \"\")))))))))), \"\") as ?ojOld) .\n\n                FILTER (lang(?ojPartLabelOld) = \"en\" )\n            }\n\n            # OJ act-by-act\n            OPTIONAL {\n                FILTER NOT EXISTS {\n                    ?s cdm:resource_legal_published_in_official-journal ?_ojTemp\n                }\n                ?s cdm:official-journal-act_date_publication ?ojActDate .\n                ?s cdm:official-journal-act_part_of_collection_document ?ojCollectionDocument .\n                ?ojCollectionDocument dc:identifier ?ojCollectionDocumentIdentifier .\n                ?s cdm:official-journal-act_subsubsection_oj ?ojSubsection .\n                ?s cdm:official-journal-act_number ?ojActNumber .\n                ?s cdm:official-journal-act_year ?ojActYear .\n                \n                ?s cdm:work_id_document ?ojActId. \n                FILTER (STRSTARTS(STR(?ojActId), \"oj:\"))\n                ?s cdm:resource_legal_eli ?ojActResourceUrl . \n            } \n\n            BIND(CONCAT(?title_, IF(BOUND(?ecli), CONCAT(\"\\nECLI identifier: \", ?ecli), \"\")) as ?title) \n            BIND(?title_ as ?baseTitle)\n        }\n    }\n    ORDER BY ?id ?lang");
  return query;
};
;// ./src/lib/manager/query/eli.js
/**
 * Query by ELI ids
 * @param {Array<String>} eliIds
 * @param {String} langISO3
 *
 * @returns {String}
 */
var getEliQuery = function getEliQuery(eliIds, langISO3) {
  langISO3 = langISO3 || 'ENG';
  langISO3 = String(langISO3).toUpperCase();
  eliIds = eliIds.filter(function (v, i, a) {
    return a.indexOf(v) === i;
  });
  var filters = "FILTER (";
  for (var i = 0; i < eliIds.length; i++) {
    // provides better perfs for small eli sets but is unreliable. @TODO verify . 
    if (eliIds.length < 10) {
      filters += "?eli = \"".concat(eliIds[i], "\"^^<http://www.w3.org/2001/XMLSchema#anyURI>");
    } else {
      filters += "(STR(?eli) = \"".concat(eliIds[i], "\")");
    }
    if (i < eliIds.length - 1) {
      filters += " || ";
    }
  }
  filters += ")";
  var pointInTimeFilter1 = '';
  var pointInTimeFilter2 = '';
  var pointInTimeFilter3 = '';
  var pointInTimeFilter4 = '';
  if (R2L.options.pointInTime) {
    pointInTimeFilter1 = "FILTER(?consolidatedDate < \"".concat(R2L.options.pointInTime, "\"^^xsd:date)");
    pointInTimeFilter2 = "FILTER(?consolidatedDate2 < \"".concat(R2L.options.pointInTime, "\"^^xsd:date)");
    pointInTimeFilter3 = "FILTER(?repealDate < \"".concat(R2L.options.pointInTime, "\"^^xsd:date)");
    pointInTimeFilter4 = "FILTER(?repealDate2 < \"".concat(R2L.options.pointInTime, "\"^^xsd:date)");
  }
  var query = "\n        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n        PREFIX cdm:<http://publications.europa.eu/ontology/cdm#>\n        PREFIX skos:<http://www.w3.org/2004/02/skos/core#>\n        PREFIX dc:<http://purl.org/dc/elements/1.1/>\n        PREFIX lang:<http://publications.europa.eu/resource/authority/language/>\n        PREFIX xsd:<http://www.w3.org/2001/XMLSchema#>\n        PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n        PREFIX owl:<http://www.w3.org/2002/07/owl#>\n\n        SELECT DISTINCT\n            ?date \n            ?id \n            ?title \n            ?eli \n            ?force \n            MIN(?dateForce) as ?dateForce \n            (REPLACE(?oj, \" /, \\\\.\\\\.\", \"\", \"i\") as ?oj)\n            ?ojResourceUrl\n            ?consolidatedDate \n            ?consolidatedEli\n            ?consolidatedId\n            ?initialEli\n            ?initialForce\n            ?initialDateValidity\n            ?finalConsolidatedEli\n            ?finalConsolidatedDate\n            MAX(?dateValidity) as ?dateValidity\n            ?repealCelexId \n            ?repealEli\n            ?lastRepealCelexId\n            ?lastRepealEli\n            ?resourceUrl\n            ?lang\n        {\n        SELECT\n            ?date ?workId as ?id \n            ?title_ as ?title \n            ?eli \n            ?force \n            ?dateForce \n\n            (IF(BOUND(?ojIdOld), ?ojIdOld, ?ojActId) as ?ojId)\n            (IF(BOUND(?ojResourceUrlOld), ?ojResourceUrlOld, ?ojActResourceUrl) as ?ojResourceUrl)\n            (IF(BOUND(?ojDateOld), ?ojDateOld, ?ojActDate) as ?ojDate)\n            (IF(BOUND(?ojOld), ?ojOld, CONCAT(CONCAT(CONCAT(CONCAT(CONCAT(REPLACE(STR(?ojCollectionDocumentIdentifier ) , \"-\", \" \", \"i\"), \" \"), CONCAT(?ojActYear, \"/\"))), CONCAT(?ojActNumber, \", \")), \n            CONCAT(CONCAT(SUBSTR(STR(?ojActDate), 9, 2), \".\"), CONCAT(CONCAT(SUBSTR(STR(?ojActDate), 6, 2), \".\")), SUBSTR(STR(?ojActDate), 1, 4)))) as ?oj)\n\n            ?consolidatedDate \n            ?consolidatedEli\n            ?consolidatedId\n            ?initialCelexId \n            ?initialEli\n            ?initialForce\n            ?initialDateValidity\n            ?finalConsolidatedEli\n            ?finalConsolidatedDate\n            ?dateValidity\n            ?repealCelexId \n            ?repealEli\n            ?lastRepealCelexId\n            ?lastRepealEli\n            ?resourceUrl\n            ?lang\n        WHERE {                  \n            graph ?ge {                     \n                ?exp cdm:expression_belongs_to_work ?s .                    \n                ?exp cdm:expression_title ?title_ .\n                OPTIONAL {\n                    ?exp owl:sameAs ?resourceUrl .\n                    FILTER (REGEX(?resourceUrl, \"resource/oj/\"))    \n                }           \n            }                \n            graph ?g {                     \n                ?exp cdm:expression_uses_language ?lang                    \n                filter(?lang=lang:".concat(langISO3, ").                  \n            }    \n\n            ?s cdm:resource_legal_eli ?eli .\n            ").concat(filters, "\n            {\n                ?s cdm:work_date_document ?date .\n                ?s rdf:type ?type .\n                ?s cdm:work_id_document ?workId\n                FILTER (STRSTARTS(?workId, \"celex:\")) . \n            }\t\t\n\n            OPTIONAL {\n                ?s cdm:case-law_ecli ?ecli\n            }\n            OPTIONAL {\n                ?s cdm:resource_legal_date_end-of-validity ?dateValidity .\n            }\n\n            OPTIONAL {\n                # INITIAL ACT\n                ?s cdm:act_consolidated_consolidates_resource_legal ?actInitial .\n                ?actInitial cdm:resource_legal_eli ?initialEli . \n                ?actInitial cdm:work_id_document ?initialCelexId .\n                # STATUS OF THE INITIAL ACT\n                ?actInitial cdm:resource_legal_in-force ?initialForce .\n\n                BIND(REPLACE(?initialEli, \"/oj\", \"\", \"i\") AS ?initialEliRaw) .\n\n                FILTER regex(str(?initialCelexId), \"celex:\") \n                # make sure we focus on the right consolidated act REFTOLINK-1310\n                FILTER STRSTARTS(?eli, ?initialEliRaw) \n\n                FILTER regex(str(?initialCelexId), \"celex:\") \n                FILTER NOT EXISTS {\n                    ?actInitial cdm:resource_legal_corrects_resource_legal ?corrigendumEli .\n                }\n\n                OPTIONAL {\n                    ?actInitial cdm:resource_legal_date_end-of-validity ?initialDateValidity .\n                }\n\n                # GET FINAL CONSOLIDATION OF INITIAL ACT\n                OPTIONAL {\n                    ?finalActConsolidated cdm:act_consolidated_based_on_resource_legal ?actInitial .\n                    ?finalActConsolidated cdm:act_consolidated_date ?finalConsolidatedDate .\n                    ?finalActConsolidated cdm:resource_legal_eli ?finalConsolidatedEli . \n                    # latest consolidation date only\n                    filter not exists {\n                        ?finalActConsolidated2 cdm:act_consolidated_based_on_resource_legal ?actInitial .\n                        ?finalActConsolidated2 cdm:act_consolidated_date ?finalConsolidatedDate2\n                        filter (?finalConsolidatedDate2 > ?finalConsolidatedDate)\n                    }\n                }\n            }\n            OPTIONAL {\n                # CONSOLIDATION\n                ?actConsolidated cdm:act_consolidated_based_on_resource_legal ?s .\n                ?actConsolidated cdm:act_consolidated_date ?consolidatedDate .\n                ?actConsolidated cdm:resource_legal_date_entry-into-force ?consolidatedDateEntryForce .\n                ?actConsolidated cdm:resource_legal_eli ?consolidatedEli . \n                ?actConsolidated cdm:work_id_document ?consolidatedId_ .\n                \n                # we only need results before the end of the act validity\n                ?s cdm:resource_legal_date_end-of-validity ?act_end_of_validity .\n\n                ").concat(pointInTimeFilter1, "\n                FILTER (?consolidatedDateEntryForce < ?act_end_of_validity)     \n                FILTER regex(str(?consolidatedId_), \"celex:\")     \n                # latest consolidation date only\n                FILTER not exists {\n                    ?actConsolidated2 cdm:resource_legal_date_entry-into-force ?consolidatedDateEntryForce2 .\n                    ?actConsolidated2 cdm:act_consolidated_based_on_resource_legal ?s .\n                    ?actConsolidated2 cdm:act_consolidated_date ?consolidatedDate2 .\n                    ?s cdm:resource_legal_date_end-of-validity ?act_end_of_validity2 .\n                    ").concat(pointInTimeFilter2, "\n                    FILTER (?consolidatedDateEntryForce2 > ?consolidatedDateEntryForce AND (?consolidatedDateEntryForce2 < ?act_end_of_validity2))\n                }\n                BIND(SUBSTR(?consolidatedId_, 7) as ?consolidatedId)\n            }\n            OPTIONAL {\n                # REPEALING\n                ?actRepeal cdm:resource_legal_repeals_resource_legal ?s .\n                ?actRepeal cdm:resource_legal_eli ?repealEli . \n                ?actRepeal cdm:work_date_document ?repealDate . \n                ?actRepeal cdm:work_id_document ?repealCelexId_.\n                ").concat(pointInTimeFilter3, "\n                FILTER regex(str(?repealCelexId_), \"celex:\")                    \n                BIND(SUBSTR(?repealCelexId_, 7) as ?repealCelexId)\n                OPTIONAL {\n                    # REPEALING LAST\n                    ?lastActRepeal cdm:resource_legal_repeals_resource_legal+ ?s .\n                    ?lastActRepeal cdm:resource_legal_eli ?lastRepealEli . \n                    ?lastActRepeal cdm:work_id_document ?lastRepealCelexId_.\n                    FILTER regex(str(?lastRepealCelexId_), \"celex:\")                    \n                    FILTER not exists {\n                       ?actRepeal_ cdm:resource_legal_repeals_resource_legal ?lastActRepeal .\n                       ?actRepeal_ cdm:work_date_document ?repealDate2\n                       ").concat(pointInTimeFilter4, "\n                    } \n                    BIND(SUBSTR(?lastRepealCelexId_, 7) as ?lastRepealCelexId)\n                }\n            }\n            OPTIONAL {\n                # FORCE\n                ?s cdm:resource_legal_in-force ?force .\n                ?s cdm:resource_legal_date_entry-into-force ?dateForce .\n            }        \n            OPTIONAL {\n                # MANIFEST \n                ?manif cdm:manifestation_manifests_expression ?exp. \n                ?manif cdm:manifestation_type ?manifType .\n                FILTER(STR(?manifType)=\"print\" || BOUND(?ojPageFirst)) .\n\n                # MANIFEST OJ PAGE\n                OPTIONAL {\n                    ?manif cdm:manifestation_official-journal_part_page_first ?ojPageFirst.\n                    ?manif cdm:manifestation_official-journal_part_page_last ?ojPageLast.\n                }\n                OPTIONAL {\n                    ?manif owl:sameAs ?manifOjResourceUrl .\n                    # We need to use the MANIFEST to get to the OJ\n                    FILTER (STRSTARTS(STR(?manifOjResourceUrl), \"http://publications.europa.eu/resource/oj/\"))\n                }\n\n                # OJ info\n                ?s cdm:resource_legal_published_in_official-journal ?q .\n                ?q cdm:official-journal_part_of_collection_document ?ojPartOld .\n                ?q cdm:official-journal_number ?ojNumberOld .\n                OPTIONAL {\n                    ?q cdm:official-journal_class ?ojClassOld .\n                }\n                ?ojPartOld skos:prefLabel ?ojPartLabelOld .\n                ?q cdm:official-journal_volume ?ojVolumeOld .\n                ?q cdm:publication_general_date_publication ?ojDateOld .\n                \n                BIND(CONCAT(STR(DAY(?ojDateOld)), \n                \".\", \n                STR(MONTH(?ojDateOld)), \n                \".\", \n                STR(YEAR(?ojDateOld))) as ?ojDatePublicationOld)\n\n                # cross match with parent OJ resource\n                ?q owl:sameAs ?mainOjResourceUrlOld .\n                ?q cdm:work_id_document ?ojIdOld.\n                \n                # multiple OJ publications can cause trouble so we cross-match the OJ url with the manifest's (where available)\n                # DISABLED - using the first result \n                # FILTER (!BOUND(?manifOjResourceUrl) || STRSTARTS(STR(?manifOjResourceUrl), STR(?mainOjResourceUrlOld)) || (REGEX(STR(?langSpecificManif), 'resource/oj/DD_')))\n                FILTER (STRSTARTS(STR(?ojIdOld), \"oj:\") AND STRSTARTS(STR(?mainOjResourceUrlOld), \"http://publications.europa.eu/resource/oj/\")) \n                BIND(?mainOjResourceUrlOld as ?ojResourceUrlOld)\n\n                # OJ label; do not modify as it will be processed for translation\n                BIND(IF(BOUND(?ojPartLabelOld), \n                CONCAT(CONCAT(REPLACE(?ojPartLabelOld, \"-\", \" \", \"i\"), \" \", \n                CONCAT(?ojNumberOld, \n                CONCAT(IF (STR(?ojClassOld) != \"R\", ?ojClass, \"\"),\n                CONCAT(\", \", CONCAT($ojDatePublicationOld,\n                    CONCAT(IF(BOUND(?ojPageFirst), \", p. \", \"\"), \n                    CONCAT(IF(BOUND(?ojPageFirst), xsd:integer(?ojPageFirst), \"\"), \n                    CONCAT(IF(BOUND(?ojPageLast), \"-\", \"\"), IF(BOUND(?ojPageLast), xsd:integer(?ojPageLast), \"\")))))))))), \"\") as ?ojOld) .\n\n\n                FILTER ( lang(?ojPartLabelOld) = \"en\" )\n            }\n            \n            # OJ act-by-act\n            OPTIONAL {\n                FILTER NOT EXISTS {\n                    ?s cdm:resource_legal_published_in_official-journal ?_ojTemp\n                }\n                ?s cdm:official-journal-act_date_publication ?ojActDate .\n                ?s cdm:official-journal-act_part_of_collection_document ?ojCollectionDocument .\n                ?ojCollectionDocument dc:identifier ?ojCollectionDocumentIdentifier .\n                ?s cdm:official-journal-act_subsubsection_oj ?ojSubsection .\n                ?s cdm:official-journal-act_number ?ojActNumber .\n                ?s cdm:official-journal-act_year ?ojActYear .\n                \n                ?s cdm:work_id_document ?ojActId. \n                FILTER (STRSTARTS(STR(?ojActId), \"oj:\"))\n                ?s cdm:resource_legal_eli ?ojActResourceUrl . \n            } \n        }\n    }");
  return query;
};
var getEliConsolidationsQuery = function getEliConsolidationsQuery(eliIds) {
  // remove last segment
  eliIds = eliIds.map(function (eid) {
    return eid.split("/").slice(0, -1).join("/") + "/";
  });
  // unique values
  eliIds = eliIds.filter(function (v, i, a) {
    return a.indexOf(v) === i;
  });
  var filters = "FILTER (";
  for (var i = 0; i < eliIds.length; i++) {
    filters += "(STRSTARTS(STR(?eli), \"".concat(eliIds[i], "\"))");
    if (i < eliIds.length - 1) {
      filters += " || ";
    }
  }
  filters += ")";
  var query = "\n    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n    PREFIX cdm:<http://publications.europa.eu/ontology/cdm#>\n    PREFIX skos:<http://www.w3.org/2004/02/skos/core#>\n    PREFIX dc:<http://purl.org/dc/elements/1.1/>\n    PREFIX lang:<http://publications.europa.eu/resource/authority/language/>\n    PREFIX xsd:<http://www.w3.org/2001/XMLSchema#>\n    PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n    PREFIX owl:<http://www.w3.org/2002/07/owl#>\n\n    SELECT DISTINCT\n        ?eli \n    WHERE {                  \n        ?exp cdm:expression_belongs_to_work ?s .                                       \n        ?s cdm:resource_legal_eli ?eli .\n        ".concat(filters, "\n\n        ?s cdm:work_id_document ?workId .\n        FILTER (STRSTARTS(?workId, \"celex:\")) . \n}");
  return query;
};
var computeEliIdsMap = function computeEliIdsMap(eliIds, consolidationEliIds) {
  consolidationEliIds = consolidationEliIds.map(function (item) {
    return item.eli.value;
  });
  consolidationEliIds.sort(function (a, b) {
    return a < b ? -1 : 1;
  });
  var computedEliIds = eliIds.map(function (eliId) {
    var eliRoot = eliId.split("/").slice(0, -1).join("/") + "/";
    var filtered = consolidationEliIds.filter(function (consEliId) {
      return consEliId.indexOf(eliRoot) === 0;
    });
    var found = filtered[filtered.length - 1] || eliId; // default is last one - the `/oj`
    // return last element from filtered smaller than our eliId
    if (eliId.slice(-3) !== "/oj") {
      for (var i = 0; i < filtered.length; i++) {
        if (filtered[i] <= eliId) {
          found = filtered[i];
        }
        if (filtered[i] > eliId) {
          break;
        }
      }
    }
    return [eliId, found];
  });
  console.debug("Computed ELI ids", computedEliIds);
  var map = {};
  computedEliIds.forEach(function (item) {
    map[item[0]] = item[1];
  });
  return map;
};
;// ./src/lib/manager/query/ecli.js
/**
 * ECLI ids query
 * @param {Array<String>} ecliIds 
 * @param {String} langISO3 
 * 
 * @returns {String}
 */
var getEcliQuery = function getEcliQuery(ecliIds, langISO3) {
  var langISO3s = langISO3 ? [String(langISO3).toUpperCase()] : ["ENG", "FRA"]; // default to english or french
  var langISO3Filters = "FILTER (?lang IN (";
  for (var i = 0; i < langISO3s.length; i++) {
    langISO3Filters += "lang:".concat(langISO3s[i]);
    if (i < langISO3s.length - 1) {
      langISO3Filters += ",";
    }
  }
  langISO3Filters += "))";
  ecliIds = ecliIds.filter(function (v, i, a) {
    return a.indexOf(v) === i;
  });
  var filters = "FILTER (";
  for (var _i = 0; _i < ecliIds.length; _i++) {
    filters += "?ecli=\"".concat(ecliIds[_i], "\"^^xsd:string");
    if (_i < ecliIds.length - 1) {
      filters += " || ";
    }
  }
  filters += ")";
  var query = "\n        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n        PREFIX cdm:<http://publications.europa.eu/ontology/cdm#>\n        PREFIX skos:<http://www.w3.org/2004/02/skos/core#>\n        PREFIX dc:<http://purl.org/dc/elements/1.1/>\n        PREFIX lang:<http://publications.europa.eu/resource/authority/language/>\n        PREFIX xsd:<http://www.w3.org/2001/XMLSchema#>\n        PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n        PREFIX owl:<http://www.w3.org/2002/07/owl#>\n\n        SELECT DISTINCT ?workId as ?celexId ?date ?ecli as ?id ?title_ as ?title ?force ?dossierTitle ?lang WHERE {   \n            graph ?ge { \n                ?exp cdm:expression_belongs_to_work ?s .\n                ?exp cdm:expression_title ?title_\n            }\n            graph ?g { \n                ?exp cdm:expression_uses_language ?lang\n                ".concat(langISO3Filters, "\n            }       \n        \n            ?s cdm:case-law_ecli ?ecli .\n            ?s cdm:work_date_document ?date .\n            ?s cdm:work_id_document ?workId.\n\n            OPTIONAL {\n                ?s2 cdm:case-law_ecli ?ecli .\n                ?s2 cdm:work_part_of_dossier ?dossier.\n                ?dossier cdm:dossier_title ?dossierTitle\n            }\n\n            ").concat(filters, " .\n            FILTER not exists {?s cdm:work_is_member_of_complex_work ?complex. }\n            FILTER regex(str(?workId), \"celex\")\n            FILTER (!regex(str(?workId), \"_\"))\n            OPTIONAL {\n                ?s cdm:resource_legal_in-force ?force .\n            }\n        }\n        ORDER BY ?id ?lang\n    ");
  return query;
};
;// ./src/lib/manager/query/finlex.js
var getFinlexEliQuery = function getFinlexEliQuery(eliIds, langISO3) {
  langISO3 = String(langISO3).toUpperCase();
  // unique ids only
  eliIds = eliIds.filter(function (v, i, a) {
    return a.indexOf(v) === i;
  });
  var filters = "FILTER (";
  for (var i = 0; i < eliIds.length; i++) {
    filters += "?eli = <".concat(eliIds[i], ">");
    if (i < eliIds.length - 1) {
      filters += " || ";
    }
  }
  filters += ")";
  var query = "\n    prefix xsd: <http://www.w3.org/2001/XMLSchema#>\n    prefix dct: <http://purl.org/dc/terms/>\n    prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n    prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n    prefix owl: <http://www.w3.org/2002/07/owl#>\n    prefix skos: <http://www.w3.org/2004/02/skos/core#>\n    prefix foaf: <http://xmlns.com/foaf/0.1/>\n    prefix eli: <http://data.europa.eu/eli/ontology#>\n    \n    SELECT distinct ?title ?date ?publicationDate ?id {\n        \n        ?eli eli:date_document ?date .\n        ?eli eli:date_publication ?publicationDate .\n        ?eli eli:is_realized_by ?eliFin .\n        ?eliFin eli:language <http://publications.europa.eu/resource/authority/language/FIN> .\n        ?eliFin eli:title ?t .\n        BIND (?eli as ?id) .\n        BIND (CONCAT(STR(?t), \n            CONCAT(\n                CONCAT(\"\\n\\nPublication date: \", STR(?publicationDate) ), \n                CONCAT(\"\\nDocument date: \", STR(?date) ) \n            )\n        ) as ?title)\n        ".concat(filters, "\n    }\n   ");
  return query;
};
// EXTERNAL MODULE: ./src/lib/utils/request.js
var request = __webpack_require__(948);
;// ./src/lib/manager/data/corrections.js


function appendCorrectionsData(response, langISO3) {
  var celexIds = [];
  if (!response || !response.results || !response.results.bindings) {
    return Promise.resolve(response);
  }
  response.results.bindings.forEach(function (binding) {
    var idList = binding && binding.id ? binding.id.value : "";
    var ids = String(idList || "").split(",").filter(function (id) {
      return !!id;
    }).map(function (id) {
      return id.replace("celex:", "");
    });
    celexIds = celexIds.concat(ids);
  });
  // unique ids only
  celexIds = celexIds.filter(function (v, i, a) {
    return a.indexOf(v) === i;
  });
  // remove ids which are already corrections (ending with 'R(01)')
  celexIds = celexIds.filter(function (id) {
    return !/R\(\d+\)$/.test(id);
  });
  if (celexIds.length === 0) {
    return Promise.resolve(response);
  }
  return getCorrectionsData(celexIds, langISO3).then(function (correctionsResponse) {
    try {
      var correctionCelexIds = correctionsResponse.results.bindings.map(function (res) {
        return res.correctionCelexId.value;
      });
      response.results.bindings = response.results.bindings.map(function (binding) {
        // append correction data
        binding["correctionCelexIds"] = {
          datatype: "http://www.w3.org/2001/XMLSchema#string",
          type: "typed-literal",
          value: correctionCelexIds.filter(function (id) {
            return id.indexOf(binding.id.value.replace("celex:", "") + "R(") === 0;
          }).join(",")
        };
        return binding;
      });
    } catch (e) {
      console.error(e);
    }
    return response;
  }, function (err) {
    console.error(err);
    return response;
  });
}
function getCorrectionsData(celexIds, langISO3) {
  var query = getCorrectionsQuery(celexIds, langISO3);
  var format = 'application/json';
  return (0,request/* getRequestPromise */.p)(getEndpoint(LD_TYPE_CELEX), "POST", {
    query: query,
    format: format,
    origin: '*',
    target: LD_TARGET_CELLAR
  });
}

/**
 * Build query for corrections data
 * @param {Array<string>} celexIds 
 * @param {string} langISO3
 * @returns 
 */
function getCorrectionsQuery(celexIds, langISO3) {
  langISO3 = langISO3 || "ENG";
  langISO3 = String(langISO3).toUpperCase();
  var filters = "FILTER (?workId IN (";
  for (var i = 0; i < celexIds.length; i++) {
    filters += "\"celex:".concat(celexIds[i], "\", \"celex:").concat(celexIds[i], "\"^^xsd:string"); // query both types
    if (i < celexIds.length - 1) {
      filters += ",";
    }
  }
  filters += "))";
  var query = "\n    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n    PREFIX cdm:<http://publications.europa.eu/ontology/cdm#>\n    PREFIX skos:<http://www.w3.org/2004/02/skos/core#>\n    PREFIX dc:<http://purl.org/dc/elements/1.1/>\n    PREFIX lang:<http://publications.europa.eu/resource/authority/language/>\n    PREFIX xsd:<http://www.w3.org/2001/XMLSchema#>\n    PREFIX owl:<http://www.w3.org/2002/07/owl#>\n\n    SELECT DISTINCT \n        ?corrCelexId as ?correctionCelexId\n        \n    WHERE {  \n        ?s cdm:work_id_document ?workId.\n        ".concat(filters, "\n\n        # CORRECTIONS\n        ?corr cdm:resource_legal_corrects_resource_legal ?s .\n        ?corr cdm:resource_legal_id_celex ?corrCelexId .\n        FILTER exists {\n            ?expCorr cdm:expression_belongs_to_work ?corr .\n            ?expCorr cdm:expression_uses_language lang:").concat(langISO3, "\n        }\n    }");
  return query;
}
// EXTERNAL MODULE: ./src/lib/utils/data.js
var utils_data = __webpack_require__(13);
;// ./src/lib/manager/data/short_titles.js
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function appendShortTitlesData(response, langISO3) {
  if (!response || !response.results || !response.results.bindings) {
    return Promise.resolve(response);
  }
  var fullTitlesMap = {};
  response.results.bindings.forEach(function (binding) {
    var id = binding && binding.id ? binding.id.value : "";
    id = id.replace("celex:", "");
    if (binding.title && binding.title.value) {
      fullTitlesMap[id] = binding.title.value;
    }
  });
  if (Object.keys(fullTitlesMap).length === 0) {
    return Promise.resolve(response);
  }
  var treatyShortTitlesMap = R2L.alias.extractTreatyShortTitlesMap(Object.keys(fullTitlesMap), langISO3);
  return R2L.alias.extractShortTitlesMap(fullTitlesMap).then(function (shortTitlesMap) {
    // append results to response
    shortTitlesMap = _objectSpread(_objectSpread({}, shortTitlesMap), treatyShortTitlesMap);
    try {
      response.results.bindings = response.results.bindings.map(function (binding) {
        var id = (binding && binding.id ? binding.id.value : "").replace("celex:", "");
        if (shortTitlesMap[id]) {
          binding.shortTitle = {
            datatype: "http://www.w3.org/2001/XMLSchema#string",
            type: "typed-literal",
            value: shortTitlesMap[id]
          };
        }
        return binding;
      });
    } catch (e) {
      console.error(e);
    }
    return response;
  })["catch"](function (err) {
    console.error(err);
    return response;
  });
}
// EXTERNAL MODULE: ./src/lib/utils/functions.js
var functions = __webpack_require__(588);
;// ./src/lib/manager/data/oj.js


/**
 * Extracts information from the OJ label returned by SPARQL queries 
 * Example: OJ L 119, 4.5.2016, p. 1–88
 * @param {String} ojLabel 
 * @returns {Object} 
 */
function extractOjData(ojLabel) {
  var regex = /OJ ([a-zA-Z-]+) (\d+(?:[a-zA-Z]+)?), (\d{1,2}\.\d{1,2}\.\d{4}), p\. (\d+)-(\d+)/i;
  var regexActByAct = /OJ ([a-zA-Z-]+) (\d{4})\/(\d+(?:[a-zA-Z]+)?), (\d{1,2}\.\d{1,2}\.\d{4})/i;
  var regexWithoutPage = /OJ ([a-zA-Z-]+) (\d+(?:[a-zA-Z]+)?), (\d{1,2}\.\d{1,2}\.\d{4})/i;
  var matches = regex.exec(ojLabel);
  if (!matches) {
    matches = regexActByAct.exec(ojLabel);
    if (!matches) {
      matches = regexWithoutPage.exec(ojLabel);
      if (!matches) {
        return null;
      } else {
        return {
          ojPart: matches[1],
          ojNumber: matches[2],
          ojPublicationDate: matches[3],
          ojPublicationDateDay: matches[3].split(".")[0],
          ojPublicationDateMonth: matches[3].split(".")[1],
          ojPublicationDateYear: matches[3].split(".")[2],
          isActByAct: false,
          isNoPage: true
        };
      }
    } else {
      return {
        ojPart: matches[1],
        ojPartPrefix: matches[1] === 'C' ? 'C/' : '',
        ojYear: matches[2],
        ojNumber: matches[3],
        ojPublicationDate: matches[4],
        ojPublicationDateDay: matches[4].split(".")[0],
        ojPublicationDateMonth: matches[4].split(".")[1],
        ojPublicationDateYear: matches[4].split(".")[2],
        isActByAct: true,
        isNoPage: false
      };
    }
  } else {
    return {
      ojPart: matches[1],
      ojNumber: matches[2],
      ojPublicationDate: matches[3],
      ojPublicationDateDay: matches[3].split(".")[0],
      ojPublicationDateMonth: matches[3].split(".")[1],
      ojPublicationDateYear: matches[3].split(".")[2],
      ojPageFirst: matches[4],
      ojPageLast: matches[5],
      isActByAct: false,
      isNoPage: false
    };
  }
}

/**
 * Translate OJ label
 * @param {*} response 
 * @param {*} langISO2 
 * @returns 
 */
function translateOjData(response, langISO2) {
  if (!response || !response.results || !response.results.bindings) {
    return response;
  }
  response.results.bindings = response.results.bindings.map(function (binding) {
    try {
      if (!binding.oj || !binding.oj.value) {
        return binding;
      }
      var ojString = binding.oj.value;
      var ojData = extractOjData(ojString);
      if (ojData) {
        if (ojData.isActByAct) {
          binding.oj.value = (0,translations/* getTranslation */.sC)('official.journal.label.new', langISO2, ojData);
        } else if (ojData.isNoPage) {
          binding.oj.value = (0,translations/* getTranslation */.sC)('official.journal.label.nopage', langISO2, ojData);
        } else {
          binding.oj.value = (0,translations/* getTranslation */.sC)('official.journal.label', langISO2, ojData);
        }
      }
      return binding;
    } catch (e) {
      console.debug(e); //missing OJ data; moving on;
      return binding;
    }
  });
  return response;
}
// EXTERNAL MODULE: ./src/lib/manager/ecas.js
var ecas = __webpack_require__(279);
;// ./src/lib/manager/query/cluster.js


/**
 * Build query to retrieve all the acts cited by a specific CELEX id
 * @param {String} celexIds
 * @param {String} langISO3
 * @param {String} searchText (optional)
 * @param {String} documentType (optional) - celex sector number (3 for legal acts, 6 for case law)
 * @returns {String} 
 */
function getActsCitedByActQuery(celexId, langISO3, searchText, documentType) {
  var filters = "FILTER (?workId IN (\"celex:".concat(celexId, "\", \"celex:").concat(celexId, "\"^^xsd:string))"); // query both types

  var searchTextEscaped = searchText ? (0,functions/* normalizeString */.J2)((0,functions/* regExpEscape */.fI)(searchText.toLowerCase())).replaceAll('"', '\\"') : null;
  var searchFilter = searchTextEscaped ? "FILTER(regex(?title, \"".concat(searchTextEscaped, "\", \"i\" ))") : "";
  var docTypeFilter = documentType ? "FILTER(STRSTARTS(?citedWorkId, \"celex:".concat(documentType, "\"))") : "FILTER(STRSTARTS(?citedWorkId, \"celex\"))";
  var searchTriples = searchTextEscaped ? "\n        ?exp cdm:expression_belongs_to_work ?citedWork .\n        ?exp cdm:expression_title ?title .\n        ?exp cdm:expression_uses_language ?lang .\n        filter(?lang=lang:".concat(langISO3.toUpperCase(), ").") : "";
  var query = "\n        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n        PREFIX cdm:<http://publications.europa.eu/ontology/cdm#>\n        PREFIX skos:<http://www.w3.org/2004/02/skos/core#>\n        PREFIX dc:<http://purl.org/dc/elements/1.1/>\n        PREFIX lang:<http://publications.europa.eu/resource/authority/language/>\n        PREFIX xsd:<http://www.w3.org/2001/XMLSchema#>\n        PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n        PREFIX owl:<http://www.w3.org/2002/07/owl#>\n\n        SELECT DISTINCT \n            ?workId as ?id ?citedWorkId ?citedWorkEcli ?fragmentCitedTarget ?fragmentCitedSource\n        WHERE {  \n            ?exp cdm:expression_belongs_to_work ?s .\n\n            ?s cdm:work_cites_work ?citedWork .\n            OPTIONAL {\n                ?citedWork cdm:case-law_ecli ?citedWorkEcli\n            }\n            ?citedWork cdm:work_id_document ?citedWorkId .\n            ".concat(searchTriples, "\n            OPTIONAL{\n                ?bn owl:annotatedSource ?s.\n                ?bn owl:annotatedTarget ?citedWork.\n                ?bn owl:annotatedProperty <http://publications.europa.eu/ontology/cdm#work_cites_work>.\n                OPTIONAL{\n                   ?bn <http://publications.europa.eu/ontology/annotation#fragment_cited_target> ?fragmentCitedTarget.\n                }\n                OPTIONAL{\n                   ?bn <http://publications.europa.eu/ontology/annotation#fragment_citing_source> ?fragmentCitedSource.\n                }\n          }\n            ");
  query += " \n            ?s cdm:work_id_document ?workId.\n            ".concat(filters, ".\n            ").concat(searchFilter, "\n            ").concat(docTypeFilter, "\n        }\n        order by ?citedWorkId  ?fragmentCitedTarget ?fragmentCitedSource\n        LIMIT 501\n        ");
  return query;
}

/**
 * Build list of acts citing a specific CELEX id
 * @param {String} celexIds
 * @param {String} langISO3
 * @param {String} searchText (optional)
 * @param {String} documentType - celex sector number (3 for legal acts, 6 for case law)
 * @returns {String} 
 */
function getActsCitingActQuery(celexId, langISO3, searchText, documentType) {
  var filters = "FILTER (?workId IN (\"celex:".concat(celexId, "\", \"celex:").concat(celexId, "\"^^xsd:string))"); // query both types

  var searchTextEscaped = searchText ? (0,functions/* normalizeString */.J2)((0,functions/* regExpEscape */.fI)(searchText.toLowerCase())).replaceAll('"', '\\"') : null;
  var searchFilter = searchTextEscaped ? "FILTER(regex(?title, \"".concat(searchTextEscaped, "\", \"i\" ))") : "";
  var docTypeFilter = documentType ? "FILTER(STRSTARTS(?citingWorkId, \"celex:".concat(documentType, "\"))") : "FILTER(STRSTARTS(?citingWorkId, \"celex\"))";
  var searchTriples = searchTextEscaped ? "\n        ?exp cdm:expression_belongs_to_work ?citingWork .\n        ?exp cdm:expression_title ?title .\n        ?exp cdm:expression_uses_language ?lang .\n        filter(?lang=lang:".concat(langISO3.toUpperCase(), ").") : "";
  var query = "\n        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n        PREFIX cdm:<http://publications.europa.eu/ontology/cdm#>\n        PREFIX skos:<http://www.w3.org/2004/02/skos/core#>\n        PREFIX dc:<http://purl.org/dc/elements/1.1/>\n        PREFIX lang:<http://publications.europa.eu/resource/authority/language/>\n        PREFIX xsd:<http://www.w3.org/2001/XMLSchema#>\n        PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n        PREFIX owl:<http://www.w3.org/2002/07/owl#>\n\n        SELECT DISTINCT \n            ?workId as ?id ?citingWorkId ?citingWorkEcli ?fragmentCitedTarget ?fragmentCitedSource\n        WHERE {  \n            ".concat(searchTriples, "\n            ?citingWork cdm:work_cites_work ?s .\n            OPTIONAL {\n                ?citingWork cdm:case-law_ecli ?citingWorkEcli\n            }\n            ?citingWork cdm:work_id_document ?citingWorkId .\n            OPTIONAL{\n                ?bn owl:annotatedSource ?citingWork.\n                ?bn owl:annotatedTarget ?s.\n                ?bn owl:annotatedProperty <http://publications.europa.eu/ontology/cdm#work_cites_work>.\n                OPTIONAL{\n                   ?bn <http://publications.europa.eu/ontology/annotation#fragment_cited_target> ?fragmentCitedTarget.\n                }\n                OPTIONAL{\n                   ?bn <http://publications.europa.eu/ontology/annotation#fragment_citing_source> ?fragmentCitedSource.\n                }\n          }\n            ");
  query += " \n            ?s cdm:work_id_document ?workId.\n            ".concat(filters, "\n            ").concat(searchFilter, "\n            ").concat(docTypeFilter, "\n            FILTER(!regex(?citingWorkId, \"_SUM$\") AND !regex(?citingWorkId, \"_INF$\"))\n        }\n        order by ?citingWorkId  ?fragmentCitedTarget ?fragmentCitedSource\n        LIMIT 501\n        ");
  return query;
}

/**
* Build query to retrieve all the acts that this act is based on
* @param {String} celexId
* @param {String} langISO3
* @returns {String} 
*/
function getBasisActsByActQuery(celexId, langISO3) {
  var filters = "FILTER (?workId IN (\"celex:".concat(celexId, "\", \"celex:").concat(celexId, "\"^^xsd:string))"); // query both types

  var query = "\n       PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n       PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n       PREFIX cdm:<http://publications.europa.eu/ontology/cdm#>\n       PREFIX skos:<http://www.w3.org/2004/02/skos/core#>\n       PREFIX dc:<http://purl.org/dc/elements/1.1/>\n       PREFIX lang:<http://publications.europa.eu/resource/authority/language/>\n       PREFIX xsd:<http://www.w3.org/2001/XMLSchema#>\n       PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n       PREFIX owl:<http://www.w3.org/2002/07/owl#>\n\n       SELECT DISTINCT \n       ?workId as ?id ?basisWorkId\n        WHERE {  \n            ?exp cdm:expression_belongs_to_work ?s .\n\n            ?s cdm:resource_legal_based_on_resource_legal ?basisWork .\n            ?basisWork cdm:work_id_document ?basisWorkId .\n            FILTER(STRSTARTS(?basisWorkId, \"celex\")) .\n            ?s cdm:work_id_document ?workId.";
  query += " \n        ".concat(filters, ".\n    }\n    order by ?basisWorkId\n    LIMIT 501\n    ");
  return query;
}

/**
* Build query to retrieve all the acts that use this act as a legal basis
* @param {String} celexId
* @param {String} langISO3
* @returns {String} 
*/
function getActsByBasisActQuery(celexId, langISO3) {
  var filters = "FILTER (?workId IN (\"celex:".concat(celexId, "\", \"celex:").concat(celexId, "\"^^xsd:string))"); // query both types

  var query = "\n       PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n       PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n       PREFIX cdm:<http://publications.europa.eu/ontology/cdm#>\n       PREFIX skos:<http://www.w3.org/2004/02/skos/core#>\n       PREFIX dc:<http://purl.org/dc/elements/1.1/>\n       PREFIX lang:<http://publications.europa.eu/resource/authority/language/>\n       PREFIX xsd:<http://www.w3.org/2001/XMLSchema#>\n       PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n       PREFIX owl:<http://www.w3.org/2002/07/owl#>\n\n       SELECT DISTINCT \n       ?workId as ?id ?resultingWorkId\n        WHERE {  \n            ?exp cdm:expression_belongs_to_work ?s .\n\n            ?resultingWork cdm:resource_legal_based_on_resource_legal ?s .\n            ?resultingWork cdm:work_id_document ?resultingWorkId .\n            FILTER(STRSTARTS(?resultingWorkId, \"celex\")) .\n            ?s cdm:work_id_document ?workId.";
  query += " \n        ".concat(filters, ".\n    }\n    order by ?resultingWorkId\n    LIMIT 501\n    ");
  return query;
}
;// ./src/lib/manager/query/classifications.js
function getEurovocQuery(celexId, langISO2) {
  var filters = "FILTER (?workId IN (\"celex:".concat(celexId, "\", \"celex:").concat(celexId, "\"^^xsd:string))"); // query both types

  var query = "\n    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n    PREFIX cdm:<http://publications.europa.eu/ontology/cdm#>\n    PREFIX skos:<http://www.w3.org/2004/02/skos/core#>\n    PREFIX dc:<http://purl.org/dc/elements/1.1/>\n    PREFIX lang:<http://publications.europa.eu/resource/authority/language/>\n    PREFIX xsd:<http://www.w3.org/2001/XMLSchema#>\n    PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n    PREFIX owl:<http://www.w3.org/2002/07/owl#>\n    PREFIX skos-xl: <http://www.w3.org/2008/05/skos-xl#>\n    PREFIX core: <http://www.w3.org/2004/02/skos/core#>\n    SELECT  \n    DISTINCT ?eurovoc ?eurovocLabel\n    WHERE {  \n      ?exp cdm:expression_belongs_to_work ?s .\n      ?exp cdm:expression_title ?title_ . \n      ?s cdm:work_id_document ?workId.\n      ?s cdm:work_is_about_concept_eurovoc ?eurovoc .\n      ?eurovoc skos:prefLabel ?eurovocLabel.  \n        ".concat(filters, ".\n        FILTER (lang(?eurovocLabel) = \"").concat(String(langISO2).toLowerCase(), "\")\n    }");
  return query;
}
function getSubjectMatterQuery(celexId, langISO2) {
  var filters = "FILTER (?workId IN (\"celex:".concat(celexId, "\", \"celex:").concat(celexId, "\"^^xsd:string))"); // query both types

  var query = "\n    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n    PREFIX cdm:<http://publications.europa.eu/ontology/cdm#>\n    PREFIX skos:<http://www.w3.org/2004/02/skos/core#>\n    PREFIX dc:<http://purl.org/dc/elements/1.1/>\n    PREFIX lang:<http://publications.europa.eu/resource/authority/language/>\n    PREFIX xsd:<http://www.w3.org/2001/XMLSchema#>\n    PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n    PREFIX owl:<http://www.w3.org/2002/07/owl#>\n    PREFIX skos-xl: <http://www.w3.org/2008/05/skos-xl#>\n    PREFIX core: <http://www.w3.org/2004/02/skos/core#>\n    SELECT  \n    DISTINCT ?subjectMatter ?subjectMatterLabel\n    WHERE {  \n      ?exp cdm:expression_belongs_to_work ?s .\n      ?exp cdm:expression_title ?title_ . \n      ?s cdm:work_id_document ?workId.\n      ?s cdm:resource_legal_is_about_subject-matter ?subjectMatter .\n      ?subjectMatter skos:prefLabel ?subjectMatterLabel. \n        ".concat(filters, ".\n        FILTER (lang(?subjectMatterLabel) = \"").concat(String(langISO2).toLowerCase(), "\")\n    }");
  return query;
}
function getDirectoryCodeQuery(celexId, langISO2) {
  var filters = "FILTER (?workId IN (\"celex:".concat(celexId, "\", \"celex:").concat(celexId, "\"^^xsd:string))"); // query both types

  var query = "\n    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n    PREFIX cdm:<http://publications.europa.eu/ontology/cdm#>\n    PREFIX skos:<http://www.w3.org/2004/02/skos/core#>\n    PREFIX dc:<http://purl.org/dc/elements/1.1/>\n    PREFIX lang:<http://publications.europa.eu/resource/authority/language/>\n    PREFIX xsd:<http://www.w3.org/2001/XMLSchema#>\n    PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n    PREFIX owl:<http://www.w3.org/2002/07/owl#>\n    PREFIX skos-xl: <http://www.w3.org/2008/05/skos-xl#>\n    PREFIX core: <http://www.w3.org/2004/02/skos/core#>\n    SELECT  \n    DISTINCT ?directoryCode ?directoryCodeLabel \n      ?parent1 ?parent1Label \n      ?parent2 ?parent2Label\n      ?parent3 ?parent3Label \n      ?parent4 ?parent4Label\n\n    WHERE {  \n      ?exp cdm:expression_belongs_to_work ?s .\n      ?exp cdm:expression_title ?title_ . \n      ?s cdm:work_id_document ?workId.\n      ?s cdm:resource_legal_is_about_concept_directory-code ?directoryCode .\n        ?directoryCode skos:prefLabel ?directoryCodeLabel. \n    \n      OPTIONAL {\n        ?directoryCode skos:broader ?parent1 .\n        ?parent1 skos:prefLabel ?parent1Label . \n        FILTER (lang(?parent1Label) = \"".concat(String(langISO2).toLowerCase(), "\")         \n        \n        OPTIONAL {\n          ?parent1 skos:broader ?parent2 .\n          ?parent2 skos:prefLabel ?parent2Label . \n          FILTER (lang(?parent2Label) = \"").concat(String(langISO2).toLowerCase(), "\")         \n          \n          OPTIONAL {\n            ?parent2 skos:broader ?parent3 .\n            ?parent3 skos:prefLabel ?parent3Label . \n            FILTER (lang(?parent3Label) = \"").concat(String(langISO2).toLowerCase(), "\")    \n            \n            OPTIONAL {\n              ?parent3 skos:broader ?parent4 .\n              ?parent4 skos:prefLabel ?parent4Label . \n              FILTER (lang(?parent4Label) = \"").concat(String(langISO2).toLowerCase(), "\")         \n            }\n          }\n        }  \n      }\n      ").concat(filters, ".\n      FILTER (lang(?directoryCodeLabel) = \"").concat(String(langISO2).toLowerCase(), "\")\n    }");
  return query;
}
// EXTERNAL MODULE: ./src/lib/jquery.js
var jquery = __webpack_require__(953);
;// ./src/lib/manager/parser/curia.js
/**
 * 
 * @param {String} content - the Curia webpage content
 * @param {String|Number} start - starting paragraph number
 * @param {String|Number} end - ending paragraph number (included)
 * @returns {String} - extracted content HTML
 */
function extractParagraphRange(content, start, end) {
  // extract paragraphs
  var reg = /(?:<P class="C0\d(?:Titre\d)">(?:[\s\S]+?)<\/P>)?<P class="C0(?:\d)Point(?:numerote)?AltN"><A NAME="point(\d+)">(?:[\s\S]+?)<\/P>(?:<P class="C\d\d(Niveau\dTitre\d|Tiretlong|Alinea(?:[^"][\s\S]*?)|Marge(?:[^"][\s\S]*?))">([\s\S]+?)<\/P>)*/gim;
  var allMatches = [];
  var match;
  while ((match = reg.exec(content)) !== null) {
    allMatches.push(match);
  }
  var selected = [];
  var inside = false;

  // Process matches to select content between start and end points
  for (var i = 0; i < allMatches.length; i++) {
    var currentMatch = allMatches[i];
    var pointNumber = parseInt(currentMatch[1], 10);
    if (pointNumber === start) {
      inside = true;
    }
    if (inside) {
      selected.push(currentMatch[0]);
    }
    if (pointNumber === end) {
      inside = false;
    }
  }
  var contents = selected.join("");

  // Replace non-breaking space (U+00A0) with regular space
  contents = contents.replace(/\u00A0/g, " ");

  // Remove href attributes
  contents = contents.replace(/ href="(.*?)"/gi, '');
  return contents;
}
;// ./src/lib/manager/parser/eurlex.js


var ERROR_PARAGRAPH_NOT_FOUND = 'paragraph.not.found';
var ERROR_ARTICLE_NOT_FOUND = 'article.not.found';
var ERROR_POINT_NOT_FOUND = 'point.not.found';
var ERROR_SUBDIVISION_NOT_FOUND = 'subdivision.not.found';
var ARTICLE_LABEL_REGEX = 'Член|Artículo|Článek|Artikel|Artikel|Artikkel|Άρθρο|Article|Airteagal|Članak|Articolo|pants|straipsnis|cikk|Artikolu|Artykuł|Artigo|Articolul|Článok|Člen|artikla';
var ANNEX_LABEL_REGEX = 'ПРИЛОЖЕНИЕ|ANEXO|PŘÍLOHA|BILAG|ANHANG|LISA|ΠΑΡΑΡΤΗΜΑ|ANNEXE|ANNEX|IARSCRÍBHINN|PRILOG|ALLEGATO|PIELIKUMS|PRIEDAS|MELLÉKLET|ANNESS|BIJLAGE|ZAŁĄCZNIK|ANEXA|PRÍLOHA|PRILOG|LIITE|BILAGA';
var ROMAN_LABEL_REGEX = '(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})(\\.?)';
var ANNEX_NUMBER_REGEX = '(?:(' + ROMAN_LABEL_REGEX + ')|\\d+)';
var UNIQUE_ANNEX_REGEX = new RegExp("^(" + ANNEX_LABEL_REGEX + ")$", "gi");
function isEUTreaty(node) {
  return String(node.data[0].celex).substr(0, 1) === '1';
}

/**
 * Extract subdivision up to point level. Only works on the new XHTML generation of acts.
 * Content is sourced from EUR-Lex or Curia, depending on the reference type
 * 
 * @param {String} response 
 * @param {R2LNode} node 
 * 
 * @return String
 */
function parseContentResponse(response, node) {
  var celex = node.data[0]['celex'] || null;
  var sector = celex ? celex.substr(0, 1) : null;

  // annexes, recitals and articles are top-level subdivisions for sectors 1,2,3,4,5
  var annex = node.data[0]['offset-annex'] || null;
  var recital = node.data[0]['offset-rct'] || null;
  var article = node.data[0]['offset-art'] || null;

  // case law (ECLI) has paragraphs as top-level subidvisions
  var paragraph = node.data[0]['offset-p'] || null;
  var point = node.data[0]['offset-pt'] || null;
  response = cleanHtmlContent(response || '');
  if (!article && !annex && !recital) {
    // no top-level subdivision found, can only be and ECLI with paragraphs
    if (node.type === 'ecli') {
      return parseEcliResponse(response, node);
    } else {
      return {
        id: null,
        header: null,
        subheader: null,
        content: null,
        subdivisions: [],
        error: ERROR_SUBDIVISION_NOT_FOUND
      };
    }
  }
  if (paragraph) {
    paragraph = String(paragraph).padStart(3, '0');
  }
  if (point) {
    point = point.toLowerCase();
  }
  var doc = document.implementation.createHTMLDocument('virtual');
  var $el = (0,jquery.$)("<div>" + response + "</div>", doc);

  // ELI urls return the full page
  if ($el.find("#textTabContent").length > 0) {
    $el = (0,jquery.$)("<div>" + $el.find("#textTabContent").html() + "</div>", doc);
  }
  var resultString;
  var articleResultString;
  var selector;
  var id; // article or annex HTML attribute to extract, will be used as anchor for direct links
  var header; // article title/header
  var subheader; // article subheader

  var isPoint = false;
  var isParagraph = false;
  var error = null;
  var articleIdentifier = getArticleIdentifier($el, article);
  var isNewTemplate = articleIdentifier ? true : false;

  // annex finder
  if (annex) {
    // ELI lookup first
    var annexSelectorEli = "#anx_" + annex;
    var $foundEl = $el.find(annexSelectorEli);
    if ($foundEl.length > 0) {
      resultString = $foundEl[0].innerHTML;
    } else {
      // legacy content
      // selector for 'Annex X' titles
      var annexSelector = ".oj-doc-ti, .doc-ti";
      var annexRegex = new RegExp("^(?:((" + ANNEX_LABEL_REGEX + ")\\s" + ANNEX_NUMBER_REGEX + ")|(" + ANNEX_NUMBER_REGEX + "\\s(" + ANNEX_LABEL_REGEX + ")))$", "gi");
      var res = $el.find(annexSelector);
      var castAnnexNumber = R2L.converters.roman(annex);
      res.each(function (index, elem) {
        var txt = elem.textContent.trim().replace(/&nbsp;/g, " ");
        if (txt.match(annexRegex)) {
          // get content
          var annexRomanNumber = txt.replace(new RegExp("/^" + ANNEX_LABEL_REGEX, "gi"), '').replace('.', '').trim();
          var annexNumber = R2L.converters.roman(annexRomanNumber);
          // should work for both roman and arabic numbers
          if (String(annexNumber) === String(castAnnexNumber)) {
            id = elem.getAttribute("id");
            var $parent = $el.find('#' + id).parent();
            if ($parent.length) {
              resultString = $parent[0].outerHTML;
            }
            // break
            return false;
          }
        }

        // could be an unique annex
        if (String(castAnnexNumber) === '1' && txt.match(UNIQUE_ANNEX_REGEX)) {
          // unique annex will have no number in the table of contents but Ref2Link considers it as Annex 1
          id = elem.getAttribute("id");
          var _$parent = $el.find('#' + id).parent();
          if (_$parent.length) {
            resultString = _$parent[0].outerHTML;
          }
          return false;
        }
      });
    }
  }
  // recital finder
  else if (recital) {
    // ELI lookup first
    var recitalSelectorEli = "#rct_" + recital;
    var _$foundEl = $el.find(recitalSelectorEli);
    if (_$foundEl.length > 0) {
      resultString = _$foundEl[0].innerHTML;
    } else {
      // legacy content 
      $el.find("table").each(function (index, elem) {
        var $cols = (0,jquery.$)(elem).find("col[width='4%'], col[width='96%']");
        var $recitalElem = (0,jquery.$)(elem).find("td:first-child p");
        var recitalNumber = $recitalElem.text().replace('(', '').replace(')', '');
        if ($cols.length === 2 && String(recitalNumber) === String(recital)) {
          var $recitalVal = (0,jquery.$)(elem).find("td:last-child p");
          resultString = '<p>' + $recitalVal.text() + '</p>';
          // break
          return false;
        }
      });
    }
  } else if (isNewTemplate) {
    // article finder
    var articleSelector = articleIdentifier ? "#" + articleIdentifier : null;
    var artPaddedNo = String(article).padStart(3, '0');
    var fallbackSelector;
    if (article && paragraph && point) {
      selector = "#" + artPaddedNo + "\\." + paragraph + " table";
      fallbackSelector = "#" + artPaddedNo + "\\." + paragraph;
      isParagraph = true;
      isPoint = true;
    } else if (article && paragraph) {
      selector = "#" + artPaddedNo + "\\." + paragraph;
      fallbackSelector = "#" + articleIdentifier;
      isParagraph = true;
    } else if (article && point) {
      selector = "#" + articleIdentifier + " table";
      fallbackSelector = "#" + articleIdentifier;
      isPoint = true;
    } else if (article) {
      selector = "#" + articleIdentifier;
    }

    // we need the article selector just to get the title and id for the anchor;
    var _res = selector ? $el.find(selector) : null;
    var articleRes = null;
    if (articleSelector) {
      articleRes = $el.find(articleSelector);
    }
    if (_res && _res.length > 0) {
      // remove header/subheader from content
      resultString = isPoint ? '' : _res[0].outerHTML;
      // get the point using the index (each <table> should be a point)
      var pointMap = {};
      if (isPoint) {
        // create a map eg. { 'a': [p0], 'b': [p1, p2], 'c': [p3], ...}
        _res.each(function (index, currentNode) {
          var matchPoint = currentNode.textContent.trim().match(/^\(([a-z])+\)/)[1];
          if (matchPoint) {
            pointMap[matchPoint] = pointMap[String(matchPoint).toLowerCase()] || [];
            pointMap[matchPoint].push(currentNode);
          }
        });
        if (pointMap[point]) {
          resultString = '';
          pointMap[point].forEach(function (node) {
            resultString += node.outerHTML;
          });
        } else {
          // fallback to parent
          resultString = $el.find(fallbackSelector).html();
          error = ERROR_POINT_NOT_FOUND;
        }
      }
    } else {
      resultString = '';
      if (isParagraph) {
        // try to get the paragraph using the legacy method
        var resultParagraphString = extractParagraphString($el.find(fallbackSelector).html(), paragraph);
        if (resultParagraphString) {
          resultString = resultParagraphString;
        } else {
          error = ERROR_PARAGRAPH_NOT_FOUND;
        }
      }
      if (isPoint) {
        error = ERROR_POINT_NOT_FOUND;
        if (isParagraph) {
          resultString = $el.find(fallbackSelector).html(); // try to get fallback content
        }
      }
    }
    if (articleRes && articleRes.length > 0) {
      articleResultString = articleRes[0].outerHTML;
    }
    if (articleResultString) {
      // extract header and id
      header = (0,jquery.$)(articleResultString).find(".oj-ti-art").text().trim();
      if (!header) {
        header = (0,jquery.$)(articleResultString).find(".ti-art").text().trim();
      }
      if (header) {
        header = String(header).replace(/&nbsp;/g, " ");
      }
      id = (0,jquery.$)(articleResultString).find(".oj-ti-art").attr("id");
      if (!id) {
        id = (0,jquery.$)(articleResultString).find(".ti-art").attr("id");
      }
      subheader = (0,jquery.$)(articleResultString).find(".oj-sti-art").text().trim();
      if (!subheader) {
        subheader = (0,jquery.$)(articleResultString).find(".sti-art").text().trim();
      }
      if (!subheader) {
        subheader = (0,jquery.$)(articleResultString).find(".eli-title").text().trim();
      }
    } else {
      error = ERROR_ARTICLE_NOT_FOUND;
    }
    if (!resultString && articleResultString) {
      //return article contents instead
      resultString = articleResultString;
    }
  }

  /** old style acts, no indexed ids */else {
    var customHeaderSelector = null;
    // Old treaties use this structure: #TexteOnly
    if ($el.find('#TexteOnly').length > 0) {
      if (isEUTreaty(node)) {
        resultString = $el.find('#TexteOnly')[0] ? $el.find('#TexteOnly')[0].innerHTML : '';
      } else {
        if (article) {
          var articleNumber = parseInt(article);
          var nextArticleNumber = articleNumber + 1;
          var articleRegex = new RegExp("^(?:((" + ARTICLE_LABEL_REGEX + ")\\s" + articleNumber + " ?\\.?o?°?)|(" + articleNumber + "\\.?\\s(" + ARTICLE_LABEL_REGEX + ")))$", "gi");
          var nextArticleRegex = new RegExp("^(?:((" + ARTICLE_LABEL_REGEX + ")\\s" + nextArticleNumber + " ?\\.?o?°?)|(" + nextArticleNumber + "\\.?\\s?(" + ARTICLE_LABEL_REGEX + ")))$", "gi");

          // get All p
          var pElements = $el.find("#TexteOnly p");
          var _res2 = '';
          var _startRecording = false;
          pElements.each(function (index, elem) {
            if (elem.innerHTML.trim().replace(/&nbsp;/g, " ").match(articleRegex) && !_startRecording) {
              _startRecording = true;
            } else if (elem.innerHTML.trim().replace(/&nbsp;/g, " ").match(nextArticleRegex)) {
              _startRecording = false;
              return false;
            }
            if (_startRecording) {
              _res2 += elem.outerHTML;
            }
          });
          resultString = _res2;
        } else {
          resultString = '';
        }
      }
      customHeaderSelector = 'p > strong';
    } else {
      selector = '.ti-art';
      try {
        var articleElements = $el.find(selector);
        var startElem;
        var stopElem;
        var _articleNumber = node.data[0]['offset-art'];
        var _articleRegex = new RegExp("^(?:((" + ARTICLE_LABEL_REGEX + ")\\s" + _articleNumber + " ?\\.?o?°?)|(" + _articleNumber + "\\.?\\s(" + ARTICLE_LABEL_REGEX + ")))$", "gi");
        if (articleElements.length === 0) {
          articleElements = $el.find(".oj-ti-art"); // try second selector
        }
        if (articleElements.length === 0) {
          articleElements = $el.find(".title-article-norm"); // try the revision selector
        }
        articleElements.each(function (index, elem) {
          var txt = elem.innerHTML.trim().replace(/&nbsp;/g, " ");
          if (txt.match(_articleRegex)) {
            startElem = elem;
          } else if (startElem && !stopElem) {
            stopElem = elem;
          }
        });
        if (!stopElem) {
          stopElem = $el.find('hr');
        }
        if (startElem) {
          resultString = startElem.outerHTML;
          var ongoing = true;
          $el.find(startElem).nextUntil(stopElem).each(function (index, elem) {
            if ((0,jquery.$)(elem).prop("tagName") !== 'P' && (0,jquery.$)(elem).prop("tagName") !== 'DIV' && (0,jquery.$)(elem).prop("tagName") !== 'TABLE' && !(0,jquery.$)(elem).hasClass('norm') && !(0,jquery.$)(elem).hasClass('modref')) {
              ongoing = false;
            } else {
              if ((0,jquery.$)(elem).attr('id')) {
                ongoing = false;
              }
            }
            if (ongoing) {
              resultString += elem.outerHTML;
            }
          });
        }
      } catch (e) {
        console.error('Error extracting article', e);
      }
    }

    // can't move forward without the article
    if (!resultString) {
      return {
        id: id || null,
        header: null,
        subheader: null,
        content: null,
        subdivisions: [],
        error: ERROR_ARTICLE_NOT_FOUND
      };
    }
    var $article = (0,jquery.$)("<div>" + resultString + "</div>", doc);

    // go deeper to paragraph level
    if (paragraph && resultString) {
      var _resultParagraphString = extractParagraphString(resultString, paragraph);
      if (_resultParagraphString) {
        resultString = _resultParagraphString;
      } else {
        error = ERROR_PARAGRAPH_NOT_FOUND;
      }

      // we can have points without paragraphs (not supported for legacy HTML structure)
      if (point && paragraph) {
        var $paragraph = (0,jquery.$)("<div>" + _resultParagraphString + "</div>");
        // try to find paragraph
        try {
          var _pointMap = {};
          // create a map eg. { 'a': [p0], 'b': [p1, p2], 'c': [p3], ...}
          $paragraph.find("table").each(function (index, currentNode) {
            var matchPoint = currentNode.textContent.trim().match(/^\(?([a-z])+\)/)[1];
            if (matchPoint) {
              _pointMap[matchPoint] = _pointMap[String(matchPoint).toLowerCase()] || [];
              _pointMap[matchPoint].push(currentNode);
            }
          });
          if (_pointMap[point]) {
            resultString = '';
            _pointMap[point].forEach(function (node) {
              resultString += node.outerHTML;
            });
          } else {
            // try to get <P> starting with eg: (a) or a) eg: Framework Decision 2002/584/JHA – Article 27 par 3 pt g
            resultString = '';
            var nextPoint = String.fromCharCode(point.charCodeAt(0) + 1);
            $paragraph.children().each(function (index, currentNode) {
              var textPoint = (0,jquery.$)(currentNode).text().substring(0, 3);
              var regexPoint = new RegExp("^\\(?" + point + "\\)", "g");
              var regexNextPoint = new RegExp("^\\(?" + nextPoint + "\\)", "g");
              var regexAllPoint = new RegExp("^\\(?[a-z]\\)", "g");
              if ((0,jquery.$)(currentNode).prop("tagName") === 'P' && textPoint.match(regexPoint)) {
                startRecording = true;
              }
              // find next point
              else if ((0,jquery.$)(currentNode).prop("tagName") === 'P' && textPoint.match(regexNextPoint)) {
                startRecording = false;
              }
              // if last point then stop
              else if ((0,jquery.$)(currentNode).prop("tagName") === 'P' && !textPoint.match(regexAllPoint)) {
                startRecording = false;
              }
              if (startRecording) {
                resultString += currentNode.outerHTML;
              }
            });
          }
          if (!resultString || resultString.length < 1) {
            error = ERROR_POINT_NOT_FOUND;
          }
        } catch (e) {
          console.error('Error extracting point', e);
        }
      }
    }
    if ($article.html()) {
      if (customHeaderSelector) {
        header = $el.find(customHeaderSelector).first().text().trim();
      } else {
        // extract header
        header = $article.find(".ti-art").text().trim();
      }
      if (!header) {
        header = $article.find(".oj-ti-art").text().trim();
      }
      if (header) {
        header = String(header).replace(/&nbsp;/g, " ");
      }

      // extract id
      id = $article.find(".ti-art").attr("id");
      if (!id) {
        id = $article.find(".oj-ti-art").attr("id");
      }
      if (!customHeaderSelector) {
        subheader = $article.find(".sti-art").text().trim();
        if (!subheader) {
          subheader = $article.find(".oj-sti-art").text().trim();
        }
        if (!subheader) {
          subheader = $article.find('.stitle-article-norm').text().trim();
        }
      }
    }
  }
  var $result = (0,jquery.$)("<div>" + resultString + "</div>", doc);

  // remove header/subheader from content
  $result.find(".ti-art,.sti-art,.oj-ti-art,.oj-sti-art,.eli-title").remove();
  var parsedHtml = $result.html();
  var subdivisions = sector === "3" ? extractSubdivisions($el) : []; // we only extract subdivisions for sector 3

  var eurlexData = {
    id: id,
    header: header,
    subheader: subheader,
    content: parsedHtml,
    subdivisions: subdivisions,
    error: error
  };
  console.debug("Eurlex data", eurlexData);
  return eurlexData;
}
function extractSubdivisions($el) {
  var selector = '.ti-art';
  var subdivisions = [];
  var articleElements = $el.find(selector);
  if (articleElements.length === 0) {
    articleElements = $el.find(".title-article-norm"); // try the revision selector
  }
  articleElements.each(function (index, elem) {
    if (elem.textContent.trim().match(new RegExp(ARTICLE_LABEL_REGEX, 'gi'))) {
      var txt = elem.innerHTML.trim().replace(/&nbsp;/g, " ");
      var currentArticleNumber = txt.replace(new RegExp(ARTICLE_LABEL_REGEX, 'gi'), '').replace('.', '').replace('°', '').trim();
      // collect all article/id pairs
      subdivisions.push({
        type: 'article',
        offset: String(currentArticleNumber),
        id: (0,jquery.$)(elem).attr('id')
      });
    }
  });
  var annexSelector = ".oj-doc-ti, .doc-ti";
  var annexRegex = new RegExp("^(?:((" + ANNEX_LABEL_REGEX + ")\\s" + ANNEX_NUMBER_REGEX + ")|(" + ANNEX_NUMBER_REGEX + "\\s(" + ANNEX_LABEL_REGEX + ")))$", "gi");
  var res = $el.find(annexSelector);
  res.each(function (index, elem) {
    if (elem.textContent.trim().match(annexRegex) || elem.textContent.trim().match(UNIQUE_ANNEX_REGEX)) {
      // get content
      // get content
      var annexRomanNumber = elem.textContent.trim().replace(new RegExp("/^" + ANNEX_LABEL_REGEX, "gi"), '').replace('.', '').trim();
      if (!annexRomanNumber) {
        annexRomanNumber = 'I'; // default to 1
      }
      var annexNumber = R2L.converters.roman(annexRomanNumber);

      // collect all article/id pairs
      subdivisions.push({
        type: 'annex',
        offset: String(annexNumber),
        id: (0,jquery.$)(elem).attr('id')
      });
    }
  });
  return subdivisions;
}
function parseLegacyEcliResponse(response, node) {
  var doc = document.implementation.createHTMLDocument('virtual');
  var $el = (0,jquery.$)("<div>" + response + "</div>", doc);
  var paragraph = node.data[0]['offset-p'] || null;
  if (!paragraph) {
    return {
      id: null,
      header: null,
      subheader: null,
      content: null,
      subdivisions: [],
      error: ERROR_SUBDIVISION_NOT_FOUND
    };
  }
  var paragraphEnd = node.data[0]['offset-p-end'] || null;
  var start = Number(paragraph);
  var end = paragraphEnd ? Number(paragraphEnd) : parseInt(paragraph);

  // legacy ECLI acts, we need to extract paragraphs
  var $elements = $el.find("#TexteOnly").children();
  var paragraphs = [];
  var isNext = false;
  var stop = false;
  $elements.each(function (index, elem) {
    var $el = (0,jquery.$)(elem);
    if (elem.nodeName === 'P' && $el.find("a[name=MO]").length > 0) {
      isNext = true;
      // next '<em>' contains the paragraphs
    }
    if (isNext && elem.nodeName === 'EM' && !stop) {
      var ps = (0,jquery.$)(elem).children("P");
      ps.each(function (index, para) {
        paragraphs.push(para);
      });
    }
    if (elem.nodeName === 'P' && $el.find("a[name=DI]").length > 0) {
      stop = true;
    }
  });
  console.debug("We have extracted paragraphs", paragraphs);
  var numberedParagraphs = [];
  var matches;
  var currentNumber = 0;
  paragraphs.forEach(function (para) {
    var txt = para.textContent;
    if (matches = txt.match(/^(\d+)\.?\s/)) {
      // next paragraph coming, increment index
      if (parseInt(matches[1]) === currentNumber + 2) {
        currentNumber++;
      }
      if (parseInt(matches[1]) === currentNumber + 1) {
        numberedParagraphs[currentNumber] = [];
        numberedParagraphs[currentNumber].push(para);
      }
    } else {
      // multiple paragraphs for this number, we push to the arr
      if (numberedParagraphs[currentNumber]) {
        numberedParagraphs[currentNumber].push(para);
      }
    }
  });
  var resultString = '';

  // iterate the entire range
  if (start <= end) {
    for (var i = start; i <= end; i++) {
      if (numberedParagraphs[i - 1]) {
        numberedParagraphs[i - 1].forEach(function (p) {
          resultString += p.outerHTML;
        });
      }
    }
  }
  resultString = resultString.replace(/\u00A0/g, " ");
  return {
    id: "point" + start,
    header: null,
    subheader: null,
    content: resultString,
    subdivisions: [],
    error: null
  };
}

/**
 * Will extract a paragraph range from an ECLI document content
 * 
 * We use Curia as a source for ECLI content
 * 
 * @param {String} response 
 * @param {R2LNode} node 
 * @returns {Object}
 */
function parseEcliResponse(response, node) {
  var paragraph = node.data[0]['offset-p'] || null;
  if (!paragraph) {
    return {
      id: null,
      header: null,
      subheader: null,
      content: null,
      subdivisions: [],
      error: ERROR_SUBDIVISION_NOT_FOUND
    };
  }
  var paragraphEnd = node.data[0]['offset-p-end'] || null;
  var legacyRegex = /\s(name|id)="point\d/gi;
  if (!legacyRegex.test(response)) {
    return parseLegacyEcliResponse(response, node);
  }
  var start = Number(paragraph);
  var end = paragraphEnd ? Number(paragraphEnd) : parseInt(paragraph);

  // we use Curia content for ECLI data
  var contents = extractParagraphRange(response, start, end);
  return {
    id: "point" + paragraph,
    header: null,
    subheader: null,
    content: contents,
    subdivisions: [],
    error: null
  };
}

/**
 * Will extract specific paragraph content from an article content
 * 
 * @param {String} resultString 
 * @param {String} paragraph 
 */
function extractParagraphString(resultString, paragraph) {
  var startRecording = false;
  var resultParagraphString = '';
  var $article = (0,jquery.$)("<div>" + resultString + "</div>");
  try {
    $article.children().each(function (index, currentNode) {
      // paragraph needs to start with one of the following formats: 
      //  - 2. lorem ipsum...
      //  - (2) lorem ipsum...
      if (((0,jquery.$)(currentNode).prop("tagName") === 'P' || (0,jquery.$)(currentNode).prop("tagName") !== 'TABLE') && ((0,jquery.$)(currentNode).text().trim().startsWith(parseInt(paragraph) + '.') || (0,jquery.$)(currentNode).text().trim().startsWith('(' + parseInt(paragraph) + ')'))) {
        startRecording = true;
      }

      // find next paragraph 
      else if (((0,jquery.$)(currentNode).prop("tagName") === 'P' || (0,jquery.$)(currentNode).prop("tagName") !== 'TABLE') && ((0,jquery.$)(currentNode).text().trim().startsWith(parseInt(paragraph) + 1 + '.') || (0,jquery.$)(currentNode).text().trim().startsWith('(' + (parseInt(paragraph) + 1) + ')'))) {
        startRecording = false;
      }

      // if last paragraph then stop
      else if ((0,jquery.$)(currentNode).prop("tagName") === 'P' && (0,jquery.$)(currentNode).attr('id')) {
        startRecording = false;
      } else if ((0,jquery.$)(currentNode).prop("tagName") !== 'P' && (0,jquery.$)(currentNode).prop("tagName") !== 'TABLE') {
        startRecording = false;
      }
      if (startRecording) {
        resultParagraphString += (0,jquery.$)(currentNode).get(-1).outerHTML;
      }
    });
  } catch (e) {
    console.error('Error extracting paragraph', e);
  }
  return resultParagraphString;
}

/**
 * Parse subdivision fragment from Cellar
 * Example: A02P1 => article 2 paragraph 1
 *           N 32 => paragraph 32
 *   Lists:  N 02 05 07 => paragraphs 2, 5, 7
 * @param {String} fragment
 * @param {String} celex
 * 
 * @return {String} 
 */
function parseFragment(fragment, celex) {
  var parsed = fragment;

  // N 03 or P3 04 05-07 08 ...  (only digits, dashes and spaces)
  var paragraphRegex = /^(?:N|P)\s?([0-9-\s\.]+)$/g;
  var matches = paragraphRegex.exec(fragment);
  if (Array.isArray(matches) && matches[1]) {
    var ref = matches[1];
    ref = ref.replace(/\s?-\s?/gi, "-").trim();
    var nums = ref.split(" ");
    nums = nums.map(function (num) {
      if (num.substr(0, 1) === '0') {
        num = num.substr(1);
      }
      return num;
    });
    var labels = ["par. ", "par. "];
    // secondary law (directives/regulations use N for annex)
    if (fragment.substr(0, 1) === "N" && celex && ["1", "2", "3"].indexOf(celex.substr(0, 1)) !== -1) {
      labels = ["anx. ", "anx. "];
    }
    parsed = (nums.length < 2 ? labels[0] : labels[1]) + nums.join(", ");
    return parsed;
  }

  // P1L3
  var paragraph2Regex = /^P(\d+)(?:L(\d+))?$/g;
  var matchesP2 = paragraph2Regex.exec(fragment);
  if (Array.isArray(matchesP2) && matchesP2[1]) {
    parsed = "par. " + matchesP2[1];
    if (matchesP2[2]) {
      parsed += " al. " + parseInt(matchesP2[2]);
    }
    return parsed;
  }

  // N6PT1; N1A09; N
  var paragraph3Regex = /^N(\d+|)(?:A(\d+))?(?:P(\d+))?(?:L(\d+))?(?:PT(\d+))?$/g;
  var matchesP3 = paragraph3Regex.exec(fragment);
  if (Array.isArray(matchesP3) && (matchesP3[1] || matchesP3[1] === '')) {
    parsed = (celex && ["1", "2", "3"].indexOf(celex.substr(0, 1)) !== -1 ? "anx. " : "par. ") + (matchesP3[1] || '1');
    if (matchesP3[2]) {
      parsed += " art. " + parseInt(matchesP3[2]);
    }
    if (matchesP3[3]) {
      parsed += " par. " + parseInt(matchesP3[3]);
    }
    if (matchesP3[4]) {
      parsed += " al. " + parseInt(matchesP3[4]);
    }
    if (matchesP3[5]) {
      parsed += " pnt. " + parseInt(matchesP3[5]);
    }
    return parsed;
  }

  // C1
  var recitalRegex = /^(?:C)((?:\s?\d{1,6}(?:\s-\s\d{1,6})?){1,4})$/g;
  var matchesRecital = recitalRegex.exec(fragment);
  if (Array.isArray(matchesRecital) && matchesRecital[1]) {
    var refR = matchesRecital[1];
    refR = refR.replace(/\s-\s/gi, "-").trim();
    var numsR = refR.split(" ");
    numsR = numsR.map(function (num) {
      if (num.substr(0, 1) === '0') {
        num = num.substr(1);
      }
      return num;
    });
    parsed = (numsR.length < 2 ? "rct. " : "rct. ") + numsR.join(", ");
    return parsed;
  }

  // A02P1; A02P1LB; 
  var artRegex = /^A(\d+(?:BIS)?)(?:(?:P|\.)(\d+))?(?:L(\d+|[A-Z]))?/g;
  var matchesArt = artRegex.exec(fragment);
  if (Array.isArray(matchesArt) && matchesArt[1]) {
    if (matchesArt[1].substr(0, 1) === '0') {
      matchesArt[1] = matchesArt[1].substr(1);
    }
    parsed = "art. " + matchesArt[1];
    if (matchesArt[2]) {
      parsed += " par. " + parseInt(matchesArt[2]);
    }
    if (matchesArt[3]) {
      // we use Pt. for letters and Al. for numeric values
      if (!isNaN(matchesArt[3])) {
        parsed += " al. " + matchesArt[3];
      } else {
        parsed += " pnt. " + String(matchesArt[3]).toLowerCase();
      }
    }
    return parsed;
  }
  var lineRegex = /^L(\d+)$/g;
  var matchesLine = lineRegex.exec(fragment);
  if (Array.isArray(matchesLine) && matchesLine[1]) {
    parsed = "al. " + matchesLine[1];
    return parsed;
  }
  var titRegex = /^TIT(\d+)$/g;
  var matchesTit = titRegex.exec(fragment);
  if (Array.isArray(matchesTit) && matchesTit[1]) {
    parsed = "tit. " + matchesTit[1];
    return parsed;
  }
  return parsed;
}
function getArticleIdentifier($el, artNo) {
  var articleIdentifier = null;

  // We check the ELI identifier if nothing found above
  // Note: article numbers can have suffixes eg. '21a'; 
  var testNewTemplate = $el.find("#art_" + artNo);
  if (testNewTemplate.length > 0) {
    articleIdentifier = "art_" + artNo;
  } else {
    var artPaddedNo = String(artNo).padStart(3, '0');
    testNewTemplate = $el.find("#" + artPaddedNo);
    if (testNewTemplate.length > 0) {
      // id is the art number
      articleIdentifier = artPaddedNo;
    }
  }
  return articleIdentifier;
}

/**
 * EUR-Lex HTML content cleaner
 * @param {String} content 
 */
function cleanHtmlContent(content) {
  content = content.replaceAll('<span class="super">o</span>', '°');
  var doc = document.implementation.createHTMLDocument('virtual');
  var $el = (0,jquery.$)("<div>" + content + "</div>", doc);
  $el.find('a').each(function (index, anchor) {
    // we only keep hrefs to legal-content, where we replace the root with the eurlex domain

    var href = anchor.href;
    if (/\.\/(?:\.\.\/)+legal-content\//gi.test(href)) {
      href = 'https://eur-lex.europa.eu/legal-content/' + href.split('/legal-content/')[1];
      anchor.href = href;
    } else {
      anchor.removeAttribute("href");
    }
  });

  // remove all images, scripts
  $el.find('script,img,meta').each(function (index, elem) {
    elem.parentNode.removeChild(elem);
  });

  // remove all "src"'s
  $el.find('[src]').each(function (index, elem) {
    elem.removeAttribute("src");
  });
  return $el.html();
}
;// ./src/lib/manager/modifiers/footnote.js
var ANY_CHAR = "[a-zа-яα-ωÄäÅåáàâĂăĄąĀāĊċĆćČčçĎďĐđĘęĖėëéèêĒēĚěĢģĠġĦħïÎîÌìÍíĪīĮΊίįĶķŁłĹĺĽľĻļŃńŇňÑñŅņöÔôÓóŐőÒòÕõØøŔŕŘřŚśŠšȘșẞßȚțŤťüŮůùÚúŰűûŪūŲųŸÿŻżŹźŽžŒœÆæΐ]";

/**
 * We should NOT indicate the jurisdiction when querying titles in Cellar. We apply a regex to remove it in all languages.
 * 
 * Cellar: Judgment of the Court (Fifth Chamber) of 14 December 2000. # Italian Republic v Commission of the European
 * Correct format: Judgment of 14 December 2000. # Italian Republic v Commission of the European
 * 
 * @param {String} title
 * @param {String} langISO2
 * 
 * @return {String} title 
 */
function fixCaseLawCitation(title, langISO2) {
  title = String(title);
  langISO2 = langISO2 || 'EN';
  var regex;
  // EN
  switch (langISO2) {
    case 'EN':
      regex = new RegExp("^(?:Judgment)\\s(?:of)(.*?)\\s\\d{1,2}\\s" + ANY_CHAR + "+\\s\\d{4}", "gi");
      // Judgment of the General Court (Fourth Chamber), 11 December 2013
      break;
    case 'FR':
      regex = new RegExp("^(?:Arrêt)(.*?)\\s(?:du)\\s\\d{1,2}\\s" + ANY_CHAR + "+\\s\\d{4}", 'gi');
      // Arrêt du Tribunal (quatrième chambre) du 11 décembre 2013
      break;
    case 'DE':
      // Urteil des Gerichts (Vierte Kammer) vom 11. Dezember 2013
      regex = new RegExp("^(?:Urteil)(.*?)\\s(?:vom)\\s\\d{1,2}\\.?\\s" + ANY_CHAR + "+\\s\\d{4}", "gi");
      break;
    case 'ES':
      // Sentencia del Tribunal General (Sala Cuarta) de 11 de diciembre de 2013.
      regex = new RegExp("^(?:Sentencia)(.*?)\\s(?:de)\\s\\d{1,2}\\s(?:de)\\s" + ANY_CHAR + "+\\s(?:de)\\s\\d{4}", "gi");
      break;
    case 'PT':
      // Acórdão do Tribunal de Justiça (Primeira Secção) de 29 de outubro de 2015
      regex = new RegExp("^(?:Acórdão)(.*?)\\s(?:de)\\s\\d{1,2}\\s(?:de)\\s" + ANY_CHAR + "+\\s(?:de)\\s\\d{4}", "gi");
      break;
    case 'NL':
      // Arrest van het Gerecht (Vierde kamer) van 11 december 2013  
      regex = new RegExp("^(?:Arrest)(.*?)\\s(?:van)\\s\\d{1,2}\\s" + ANY_CHAR + "+\\s\\d{4}", "gi");
      break;
    case 'IT':
      // Sentenza del Tribunale (Quarta Sezione) dell’11 dicembre 2013. (del 14 dicembre)
      regex = new RegExp("^(?:Sentenza)(.*?)\\s(?:del(?:l’|\\s))\\d{1,2}\\s" + ANY_CHAR + "+\\s\\d{4}", "gi");
      break;
    case 'DA':
      // Domstolens dom (Første Afdeling) af 29. oktober 2015. => Dom af 29. oktober 2015.
      regex = new RegExp("^(.*?)\\s(?:dom(?=\\s))(.*?)\\s(?:af)\\s\\d{1,2}\\.?\\s" + ANY_CHAR + "+\\s\\d{4}", "gi");
      break;
    case 'CS':
      // Rozsudek Soudního dvora (prvního senátu) ze dne 29. října 2015.
      regex = new RegExp("^(?:Rozsudek)(.*?)\\s(?:ze\\sdne)\\s\\d{1,2}\\.?\\s" + ANY_CHAR + "+\\s\\d{4}", "gi");
      break;
    case 'HR':
      // Presuda Suda (prvo vijeće) od 29. listopada 2015.
      regex = new RegExp("^(?:Presuda)(.*?)\\s(?:od)\\s\\d{1,2}\\.?\\s" + ANY_CHAR + "+\\s\\d{4}", "gi");
      break;
    case 'SL':
      // Sodba Sodišča (prvi senat) z dne 29. oktobra 2015.
      regex = new RegExp("^(?:Sodba)(.*?)\\s(?:z\\sdne)\\s\\d{1,2}\\.?\\s" + ANY_CHAR + "+\\s\\d{4}", "gi");
      break;
    case 'SK':
      // Rozsudok Súdneho dvora (prvá komora) z 29. októbra 2015
      regex = new RegExp("^(?:Rozsudok)(.*?)\\s(?:zo?)\\s\\d{1,2}\\.?\\s" + ANY_CHAR + "+\\s\\d{4}", "gi");
      break;
    case 'ET':
      // Kohtuotsus, Euroopa Kohus, 12. juuli 2005... => Kohtuotsus 12. juuli 2005...
      // Euroopa Kohtu otsus (esimene koda), 29.10.2015... => Otsus, 29.10.2015.
      regex = new RegExp("^(?:(.*?)\\s)?(?:(?:Kohtu)?otsus)(.*?),\\s\\d{1,2}\\.(?:\\d{1,2}\\.|\\s" + ANY_CHAR + "+\\s)\\d{4}", "gi");
      break;
    case 'FI':
      // Unionin tuomioistuimen tuomio (ensimmäinen jaosto) 29.10.2015. => Tuomio 29.10.2015.
      regex = new RegExp("^(.*?)(?:tuomio)(.*?)\\s\\d{1,2}(?:\\.\\d{1,2}\\.|\\s(?:päivänä)\\s" + ANY_CHAR + "+\\s)\\d{4}", "gi");
      break;
    case 'SV':
      // Domstolens dom (första avdelningen) av den 29 oktober 2015. => Dom av den 29 oktober 2015.
      // Personaldomstolens dom av den 30 januari 2013, Wahlström/Frontex => Dom av den 30 januari 2013, Wahlström/Frontex
      regex = new RegExp("^(.*?)\\s(?:dom(?=\\s))(.*?)\\s(?:(?:av\\s)?den)\\s\\d{1,2}\\.?\\s" + ANY_CHAR + "+\\s\\d{4}", "gi");
      break;
    case 'LV':
      // Tiesas spriedums (pirmā palāta) 2015. gada 29. oktobrī. => Spriedums 2015. gada 29. oktobrī.
      // Vispārējās tiesas 2013. gada 15. janvāra spriedums Spānija/Komisija T-54/11, ECLI:EU:T:2013:10, 29. punkts. => 2013. gada 15. janvāra spriedums Spānija/Komisija T-54/11, ECLI:EU:T:2013:10, 29. punkts.
      regex = new RegExp("^(.*?)(?:(?:(?:spriedums)(.*?)\\s\\d{4}\\.\\s(?:gada)\\s\\d{1,2}\\.\\s?" + ANY_CHAR + "+\\.)|(?:\\d{4}\\.\\s(?:gada)\\s\\d{1,2}\\.\\s?" + ANY_CHAR + "+\\.?\\s(?:spriedums)))", "gi");
      break;
    case 'LT':
      // 2015 m. spalio 29 d. Teisingumo Teismo (pirmoji kolegija) sprendimas.
      regex = new RegExp("^\\d{4}\\sm\\.\\s" + ANY_CHAR + "+\\s(?:\\d{1,2})\\s(?:d\\.)(.*?)\\s(?:sprendimas)", "gi");
      break;
    case 'MT':
      // Sentenza tal-Qorti tal-Ġustizzja (L-Ewwel Awla) tad-29 ta’ Ottubru 2015.
      regex = new RegExp("^(?:Sentenza)(.*?)\\s(?:ta[dlst]-)\\d{1,2}\\s(?:ta[’'])\\s" + ANY_CHAR + "+\\s\\d{4}", "gi");
      break;
    case 'PL':
      // Wyrok Trybunału (pierwsza izba) z dnia 29 października 2015 
      regex = new RegExp("^(?:Wyrok)(.*?)\\s(?:z\\sdnia)\\s\\d{1,2}\\.?\\s" + ANY_CHAR + "+\\s\\d{4}", "gi");
      break;
    case 'RO':
      // Hotărârea Tribunalului (Camera a patra) din 11 decembrie 2013
      regex = new RegExp("^(?:Hotărârea)(.*?)\\s(?:din(?:\\sdata\\sde)?)\\s\\d{1,2}\\s" + ANY_CHAR + "+\\s\\d{4}", "gi");
      break;
    case 'BG':
      // Решение на Съда (първи състав) от 29 октомври 2015 г
      regex = new RegExp("^(?:Решение)(.*?)\\s(?:от)\\s\\d{1,2}\\s" + ANY_CHAR + "+\\s\\d{4}", "gi");
      break;
    case 'EL':
      // Απόφαση του Δικαστηρίου (τμήμα μείζονος συνθέσεως) της 19ης Ιανουαρίου 2010.
      regex = new RegExp("^(?:Απόφαση)(.*?)\\s(?:της)\\s\\d{1,2}(?:" + ANY_CHAR + "{1,7})?\\s" + ANY_CHAR + "+\\s\\d{4}", "gi");
      break;
    case 'HU':
      // A Törvényszék 2013. január 15-i ítélete, Spanyolország kontra Bizottság, => 2013. január 15-i ítélete, Spanyolország kontra Bizottság, .
      regex = new RegExp("^(.*?)(?:(?:\\d{4}\\.\\s" + ANY_CHAR + "+\\s\\d{1,2}-i\\s(?:ítélete?)))", "gi");

      // custom treatment for HU: #REFTOLINK-2132
      var regexCustom1 = /(A\s(?:Bíróság|Törvényszék)\s(.+?\s\d+)\.-i\sítélete?:\s(\d{4})\.?)/gi;
      var parts1 = regexCustom1.exec(title);
      if (parts1) {
        title = title.replace(parts1[1], parts1[3] + '. ' + parts1[2] + '-i ítélet');
      }
      var regexCustom2 = /(A\s(?:Bíróság|Törvényszék)\sítélete?,?\s(?:\(.+?\),\s)?(\d{4}\.?\s.+?\s\d+\.?))/gi;
      var parts2 = regexCustom2.exec(title);
      if (parts2) {
        title = title.replace(parts2[1], parts2[2] + '-i ítélet');
      }

      // no ending 'e'
      title = title.replace(/\sítélete,/gi, ' ítélet,');
      break;
    default:
      return title;
  }
  var parts = regex.exec(title);
  if (parts) {
    if (parts[1]) {
      title = title.replace(parts[1], "");
    }
    if (parts[2]) {
      title = title.replace(parts[2], "");
    }
  }
  title = title.trim();
  return title.charAt(0).toUpperCase() + title.slice(1);
}

// Remove unwanted text: (recast | text with EEA relevance)
var FOOTNOTE_BLACKLIST = [{
  match: /(?:\(преработен текст\)|\(?Текст от значение за ЕИП\.?\s?\)?)/g,
  replace: '',
  applyForAll: false
},
// BG
{
  match: /(?:\(versión refundida\)|\(?Texto pertinente a efectos del EEE\.?\s?\)?)/g,
  replace: '',
  applyForAll: false
},
// ES
{
  match: /(?:\(přepracované znění\)|\(?Text s významem pro EHP\.?\s?\)?)/g,
  replace: '',
  applyForAll: false
},
// CS
{
  match: /(?:\(omarbejdning\)|\(?EØS-relevant tekst\.?\s?\)?)/g,
  replace: '',
  applyForAll: false
},
// DA
{
  match: /(?:\(Neufassung\)|\(?Text von Bedeutung für den EWR\.?\s?\)?)/g,
  replace: '',
  applyForAll: false
},
// DE
{
  match: /(?:\(uuesti sõnastatud\)|\(?EMPs kohaldatav tekst\.?\s?\)?)/g,
  replace: '',
  applyForAll: false
},
// ET
{
  match: /(?:\(αναδιατύπωση\)|\(?Κείμενο που παρουσιάζει ενδιαφέρον για τον ΕΟΧ\.?\s?\)?)/g,
  replace: '',
  applyForAll: false
},
// EL
{
  match: /(?:\(recast\)|\(?Text with EEA relevance\.?\s?\)?)/g,
  replace: '',
  applyForAll: false
},
// EN
{
  match: /(?:\(refonte\)|\(?Texte présentant de l'intérêt pour l'EEE\.?\s?\)?)/g,
  replace: '',
  applyForAll: false
},
// FR
{
  match: /(?:\(preinaka\)|\(?Tekst značajan za EGP\.?\s?\)?)/g,
  replace: '',
  applyForAll: false
},
// HR
{
  match: /(?:\(rifusione\)|\(?Testo rilevante ai fini del SEE\.?\s?\)?)/g,
  replace: '',
  applyForAll: false
},
// IT
{
  match: /(?:\(pārstrādāta redakcija\)|\(?Dokuments attiecas uz EEZ\.?\s?\)?)/g,
  replace: '',
  applyForAll: false
},
// LV
{
  match: /(?:\(nauja redakcija\)|\(?Tekstas svarbus EEE\.?\s?\)?)/g,
  replace: '',
  applyForAll: false
},
// LT
{
  match: /(?:\(átdolgozás\)|\(?EGT-vonatkozású szöveg\.?\s?\)?)/g,
  replace: '',
  applyForAll: false
},
// HU
{
  match: /(?:\(riformulazzjoni\)|\(?Test b'rilevanza għaż-ŻEE\.?\s?\)?)/g,
  replace: '',
  applyForAll: false
},
// MT
{
  match: /(?:\(herschikking\)|\(?Voor de EER relevante tekst\.?\s?\)?)/g,
  replace: '',
  applyForAll: false
},
// NL
{
  match: /(?:\(przekształcenie\)|\(?Tekst mający znaczenie dla EOG\.?\s?\)?)/g,
  replace: '',
  applyForAll: false
},
// PL
{
  match: /(?:\(reformulação\)|\(?Texto relevante para efeitos do EEE\.?\s?\)?)/g,
  replace: '',
  applyForAll: false
},
// PT
{
  match: /(?:\(reformare\)|\(?Text cu relevanță pentru SEE\.?\s?\)?)/g,
  replace: '',
  applyForAll: false
},
// RO
{
  match: /(?:\(prepracované znenie\)|\(?Text s významom pre EHP\.?\s?\)?)/g,
  replace: '',
  applyForAll: false
},
// SK
{
  match: /(?:\(prenovitev\)|\(?Besedilo velja za EGP\.?\s?\)?)/g,
  replace: '',
  applyForAll: false
},
// SL
{
  match: /(?:\(uudelleenlaadittu\)|\(?ETA:n kannalta merkityksellinen teksti\.?\s?\)?)/g,
  replace: '',
  applyForAll: false
},
// FI
{
  match: /(?:\(omarbetning\)|\(?Text av betydelse för EES\.?\)?)/g,
  replace: '',
  applyForAll: false
},
// SV
{
  match: '<i></i>,',
  replace: ',',
  applyForAll: true
}, {
  match: '. )',
  replace: ')',
  applyForAll: true
}, {
  match: '.).',
  replace: ')',
  applyForAll: true
}, {
  match: ', ,',
  replace: ',',
  applyForAll: true
}, {
  match: '  .',
  replace: '.',
  applyForAll: true
}, {
  match: ' .',
  replace: '.',
  applyForAll: true
}, {
  match: ' , ',
  replace: ', ',
  applyForAll: true
}, {
  match: '. (',
  replace: ' (',
  applyForAll: true
}, {
  match: '( ',
  replace: '(',
  applyForAll: true
}, {
  match: ' )',
  replace: ')',
  applyForAll: true
}, {
  match: / n\. o /g,
  replace: ' n.º ',
  applyForAll: true
}, {
  match: /[\u00a0\u202F ][\u00a0\u202F ]+/g,
  replace: ' ',
  applyForAll: true
} // multiple spaces
];
function cleanFootnote(footnote, onlyApplyForAll) {
  for (var i = 0; i < FOOTNOTE_BLACKLIST.length; i++) {
    if (onlyApplyForAll) {
      if (FOOTNOTE_BLACKLIST[i].applyForAll) {
        footnote = footnote.replace(FOOTNOTE_BLACKLIST[i].match, FOOTNOTE_BLACKLIST[i].replace);
      }
    } else {
      footnote = footnote.replace(FOOTNOTE_BLACKLIST[i].match, FOOTNOTE_BLACKLIST[i].replace);
    }
  }
  return footnote;
}
function getJoinedCasesTranslation(caseLabels, langISO2) {
  var andOperator = ', ';
  switch (langISO2.toUpperCase()) {
    case 'BG':
      andOperator = ' и ';
      break;
    case 'CS':
      andOperator = ' a ';
      break;
    case 'DA':
      andOperator = ' og ';
      break;
    case 'EL':
      andOperator = ' και ';
      break;
    case 'EN':
      andOperator = ' and ';
      break;
    case 'ES':
      andOperator = ' y ';
      break;
    case 'DE':
      andOperator = ' und ';
      break;
    case 'ET':
      andOperator = ' ja ';
      break;
    case 'FR':
      andOperator = ' et ';
      break;
    case 'GA':
      andOperator = ' agus ';
      break;
    case 'HR':
      andOperator = ' i ';
      break;
    case 'HU':
      andOperator = ' és ';
      break;
    case 'IT':
      andOperator = ' e ';
      break;
    case 'MT':
      andOperator = ' u ';
      break;
    case 'NL':
      andOperator = ' en ';
      break;
    case 'PL':
      andOperator = ' i ';
      break;
    case 'PT':
      andOperator = ' e ';
      break;
    case 'RO':
      andOperator = ' și ';
      break;
    case 'SK':
      andOperator = ' a ';
      break;
    case 'SL':
      andOperator = ' in ';
      break;
    case 'FI':
      andOperator = ' ja ';
      break;
    case 'SV':
      andOperator = ' och ';
      break;
  }
  var str = '';
  caseLabels.forEach(function (label, index) {
    if (index < caseLabels.length - 2) {
      str += label + ', ';
    } else if (index < caseLabels.length - 1) {
      str += label + andOperator;
    } else {
      str += label;
    }
  });
  return str;
}
;// ./src/lib/manager/query/proc.js
/**
 * Parlamentary Procedure ids query
 * @param {Array<String>} procIds 
 * @param {String} langISO3 
 * 
 * @returns {String}
 */
var getProcedureQuery = function getProcedureQuery(procIds, langISO3) {
  var langISO3Filters = "FILTER (?workLang IN (lang:".concat(String(langISO3).toUpperCase(), ", lang:ENG, lang:FRA))");
  procIds = procIds.filter(function (v, i, a) {
    return a.indexOf(v) === i;
  });
  var filters = "FILTER (";
  for (var i = 0; i < procIds.length; i++) {
    filters += "?id=\"".concat(procIds[i], "\"^^xsd:string");
    if (i < procIds.length - 1) {
      filters += " || ";
    }
  }
  filters += ")";
  var query = "\n    PREFIX cdm: <http://publications.europa.eu/ontology/cdm#>\n    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n    PREFIX lang:<http://publications.europa.eu/resource/authority/language/>\n        SELECT DISTINCT\n            ?id\n            ?workLang as ?lang\n            ?dateAdopted\n            ?isAdopted\n            ?publishedWorkId\n            ?workTitle as ?baseTitle\n            CONCAT((CONCAT(?dossierType, CONCAT(CONCAT('(', CONCAT(?dossierYear, ')'), ?dossierRef)))), CONCAT(': ', ?workTitle)) AS ?title\n            (CONCAT(?dossierType, CONCAT(CONCAT('(', CONCAT(?dossierYear, ')'), ?dossierRef)))) AS ?reference\n        WHERE {\n            ?s cdm:procedure_code_interinstitutional_reference_procedure ?id\n            ".concat(filters, "\n            ?s cdm:dossier_contains_work ?work .\n            OPTIONAL {\n                ?s cdm:dossier_date_adopted ?dateAdopted.    \n            }\n            ?s cdm:dossier_adopted-proposal ?isAdopted .\n\n            # find OJ publication\n            OPTIONAL {\n                ?s cdm:dossier_contains_event ?evt .\n                ?evt cdm:event_legal_has_type_concept_type_event_legal <http://publications.europa.eu/resource/authority/event/PUB_OJ> .\n                ?evt cdm:event_legal_contains_work ?publishedWork .\n                ?publishedWork cdm:work_id_document ?publishedWorkId \n                FILTER regex(str(?publishedWorkId), \"celex\")\n            }\n\n            ?s cdm:dossier_number_reference ?dossierRef.   \n            ?s cdm:dossier_type_reference ?dossierType.  \n            ?s cdm:dossier_year_reference ?dossierYear.  \n            ?s cdm:dossier_contains_work ?work.\n\n            ?work cdm:work_id_document ?workId.\n            ?work cdm:work_date_document ?workDate\n            FILTER NOT EXISTS {\n                ?s cdm:dossier_contains_work ?work2.\n                ?work2 cdm:work_date_document ?workDate2\n                FILTER (?workDate2 > ?workDate)\n            }\n   \n            ?exp cdm:expression_belongs_to_work ?work .\n            ?exp cdm:expression_title ?workTitle .\n            ?exp cdm:expression_uses_language ?workLang .\n            ").concat(langISO3Filters, "\n        }\n        ORDER BY ?id ?lang\n    ");
  return query;
};
var processProcResponse = function processProcResponse(response, langISO3) {
  // resolve language
  var idMap = {};
  response.results.bindings = response.results.bindings.map(function (binding) {
    if (binding.title && binding.title.value) {
      binding.title.value = binding.title.value.replace(new RegExp("&#13;\n", 'g'), ' ');
      // add status
      if (binding.isAdopted.value === '1') {
        binding.title.value += '\n' + "✔ Completed";
        if (binding.publishedWorkId) {
          binding.title.value += " (Adopted act: ".concat(String(binding.publishedWorkId.value).replace("celex:", ""), ")");
        }
      } else {
        binding.title.value += '\n' + "↻ Ongoing";
      }
    }
    if (!idMap[binding.id.value]) {
      idMap[binding.id.value] = [];
    }
    idMap[binding.id.value].push(binding);
    return binding;
  });
  var newBindings = [];
  // default to english or french
  Object.keys(idMap).forEach(function (id) {
    var foundLang = idMap[id].filter(function (m) {
      return m.lang.value === 'http://publications.europa.eu/resource/authority/language/' + String(langISO3).toUpperCase();
    }).pop();
    if (!foundLang) {
      foundLang = idMap[id].filter(function (m) {
        return m.lang.value === 'http://publications.europa.eu/resource/authority/language/ENG';
      }).pop();
    }
    if (!foundLang) {
      foundLang = idMap[id].filter(function (m) {
        return m.lang.value === 'http://publications.europa.eu/resource/authority/language/FRA';
      }).pop();
    }
    if (foundLang) {
      newBindings.push(foundLang);
    }
  });
  response.results.bindings = newBindings;
  return response;
};
;// ./src/lib/manager/data/pit.js
function pit_typeof(o) { "@babel/helpers - typeof"; return pit_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, pit_typeof(o); }
function pit_ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function pit_objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? pit_ownKeys(Object(t), !0).forEach(function (r) { pit_defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : pit_ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function pit_defineProperty(obj, key, value) { key = pit_toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function pit_toPropertyKey(t) { var i = pit_toPrimitive(t, "string"); return "symbol" == pit_typeof(i) ? i : String(i); }
function pit_toPrimitive(t, r) { if ("object" != pit_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != pit_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }






/**
 * Will apply the Point-in-time parameter to the Cellar response by overriding the linked-data of the original acts with the consolidated acts if needed. 
 * Example: 
 *   pointInTime = 2023-01-01; 
 *   text = 32006R0765; 
 * 
 * Output: 
 *   title: Consolidated text: Council Regulation (EC) No 765/2006 of 18 May 2006 concerning restrictive measures in view of the situation in Belarus and the involvement of Belarus in the Russian aggression against Ukraine
 *   eli: http://data.europa.eu/eli/reg/2006/765/2022-07-20
 * 
 * @param {R2LCellarResponse} response 
 * @param {String} langISO3 
 * 
 * @return {Promise<R2LCellarResponse>}
 */
function appendPointInTimeData(response, langISO3) {
  var celexIds = [];
  if (!response || !response.results || !response.results.bindings) {
    return Promise.resolve(response);
  }
  response.results.bindings.forEach(function (binding) {
    var idList = binding && binding.consolidatedId ? binding.consolidatedId.value : "";
    var ids = String(idList || "").split(",").filter(function (id) {
      return !!id;
    }).map(function (id) {
      return id.replace("celex:", "");
    });
    celexIds = celexIds.concat(ids);
  });
  // unique ids only
  celexIds = celexIds.filter(function (v, i, a) {
    return a.indexOf(v) === i;
  });
  console.debug("Extracted CELEX ids", celexIds);
  if (celexIds.length === 0) {
    return Promise.resolve(response);
  }

  // load linked data for all these CELEX ids
  var query = getCelexQuery(celexIds, langISO3);
  var format = 'application/json';
  return (0,request/* getRequestPromise */.p)(getEndpoint(LD_TYPE_CELEX), "POST", {
    query: query,
    format: format,
    origin: '*',
    target: LD_TARGET_CELLAR
  }).then(function (consolidationResponse) {
    // apply OJ translations
    var langISO2 = (0,translations/* getISO2Lang */.GB)((langISO3 || "ENG").toUpperCase());
    consolidationResponse = translateOjData(consolidationResponse, langISO2);

    // merge the data
    var celexDataMap = {};
    consolidationResponse.results.bindings.forEach(function (binding) {
      var id = String(binding && binding.id ? binding.id.value : "").replace("celex:", "");
      if (binding.title && binding.title.value) {
        binding.title.value = (0,translations/* getTranslation */.sC)('eurlex.consolidated.text', langISO2) + ': ' + binding.title.value;
      }
      celexDataMap[id] = binding;
    });
    response.results.bindings = response.results.bindings.map(function (binding) {
      // override data if found in the consolidation map
      if (binding.consolidatedId && celexDataMap[binding.consolidatedId.value]) {
        var _binding = celexDataMap[binding.consolidatedId.value];
        // add a  property to keep track of the original CELEX id and the consolidation CELEX id
        if (binding.id) {
          _binding.originalId = {
            type: 'xsd: string',
            value: binding.id.value
          };
        }
        if (binding.eli) {
          _binding.originalEli = {
            type: 'xsd: string',
            value: binding.eli.value
          };
        }

        // we merge some data from the main act
        var obj = pit_objectSpread(pit_objectSpread({}, _binding), {
          force: binding.force,
          dateForce: binding.dateForce,
          dateValidity: binding.dateValidity,
          repealCelexId: binding.repealCelexId,
          repealEli: binding.repealEli,
          lastRepealCelexId: binding.lastRepealCelexId,
          lastRepealEli: binding.lastRepealEli
        });
        return obj;
      }
      return binding;
    });
    return response;
  })["catch"](function (e) {
    console.error(e);
    return response;
  });
}
;// ./src/lib/manager/query/consil.js
/**
 * Consil ids query
 * @param {Array<String>} consilIds 
 * @param {String} langISO3 
 * 
 * @returns {String}
 */
var getConsilQuery = function getConsilQuery(consilIds, langISO3) {
  var langISO3Filters = "FILTER (?workLang IN (lang:".concat(String(langISO3).toUpperCase(), ", lang:ENG, lang:FRA))");
  consilIds = consilIds.filter(function (v, i, a) {
    return a.indexOf(v) === i;
  });
  var filters = "FILTER (";
  for (var i = 0; i < consilIds.length; i++) {
    filters += "?id=\"consil:".concat(consilIds[i], "\"^^xsd:string");
    if (i < consilIds.length - 1) {
      filters += " || ";
    }
  }
  filters += ")";
  var query = "\n    PREFIX cdm: <http://publications.europa.eu/ontology/cdm#>\n    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n    PREFIX lang:<http://publications.europa.eu/resource/authority/language/>\n        SELECT DISTINCT\n            ?id\n            ?title\n            ?date\n            ?workLang as ?lang\n        WHERE {\n            \n            ".concat(filters, "\n        \n            ?work cdm:work_id_document ?id .\n            ?work cdm:work_date_document ?date .\n   \n            ?exp cdm:expression_belongs_to_work ?work .\n            ?exp cdm:expression_title ?title .\n            ?exp cdm:expression_uses_language ?workLang .\n            ").concat(langISO3Filters, "\n        }\n        ORDER BY ?id ?workLang\n    ");
  return query;
};
var processConsilResponse = function processConsilResponse(response, langISO3) {
  // resolve language
  var idMap = {};
  response.results.bindings = response.results.bindings.map(function (binding) {
    if (binding.title && binding.title.value) {
      binding.title.value = binding.title.value.replace(new RegExp("&#13;\n", 'g'), ' ');
    }
    if (!idMap[binding.id.value]) {
      idMap[binding.id.value] = [];
    }
    idMap[binding.id.value].push(binding);
    return binding;
  });
  var newBindings = [];
  // default to english or french
  Object.keys(idMap).forEach(function (id) {
    var foundLang = idMap[id].filter(function (m) {
      return m.lang.value === 'http://publications.europa.eu/resource/authority/language/' + String(langISO3).toUpperCase();
    }).pop();
    if (!foundLang) {
      foundLang = idMap[id].filter(function (m) {
        return m.lang.value === 'http://publications.europa.eu/resource/authority/language/ENG';
      }).pop();
    }
    if (!foundLang) {
      foundLang = idMap[id].filter(function (m) {
        return m.lang.value === 'http://publications.europa.eu/resource/authority/language/FRA';
      }).pop();
    }
    if (foundLang) {
      newBindings.push(foundLang);
    }
  });
  response.results.bindings = newBindings;
  return response;
};
;// ./src/lib/manager/query/oj.js
/**
 * Query by OJ ids
 * @param {Array<String>} ojIds 
 * @param {String} langISO3 (optional, will default to ENG)
 * 
 * @returns {String}
 */
var getOjQuery = function getOjQuery(ojIds, langISO3) {
  var langISO3s = langISO3 ? [String(langISO3).toUpperCase()] : ["ENG", "FRA"]; // default to english or french
  var langISO3Filters = "FILTER (?lang IN (";
  for (var i = 0; i < langISO3s.length; i++) {
    langISO3Filters += "lang:".concat(langISO3s[i]);
    if (i < langISO3s.length - 1) {
      langISO3Filters += ",";
    }
  }
  langISO3Filters += "))";

  // unique ids only
  ojIds = ojIds.filter(function (v, i, a) {
    return a.indexOf(v) === i;
  });
  var filters = "FILTER (?workId IN (";
  for (var _i = 0; _i < ojIds.length; _i++) {
    filters += "\"oj:".concat(ojIds[_i], "\", \"oj:").concat(ojIds[_i], "\"^^xsd:string"); // query both types
    if (_i < ojIds.length - 1) {
      filters += ",";
    }
  }
  filters += "))";
  var pointInTimeFilter1 = '';
  var pointInTimeFilter2 = '';
  var pointInTimeFilter3 = '';
  var pointInTimeFilter4 = '';
  if (R2L.options.pointInTime) {
    pointInTimeFilter1 = "FILTER(?consolidatedDate < \"".concat(R2L.options.pointInTime, "\"^^xsd:date)");
    pointInTimeFilter2 = "FILTER(?consolidatedDate2 < \"".concat(R2L.options.pointInTime, "\"^^xsd:date)");
    pointInTimeFilter3 = "FILTER(?repealDate < \"".concat(R2L.options.pointInTime, "\"^^xsd:date)");
    pointInTimeFilter4 = "FILTER(?repealDate2 < \"".concat(R2L.options.pointInTime, "\"^^xsd:date)");
  }
  var query = "\n        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n        PREFIX cdm:<http://publications.europa.eu/ontology/cdm#>\n        PREFIX skos:<http://www.w3.org/2004/02/skos/core#>\n        PREFIX dc:<http://purl.org/dc/elements/1.1/>\n        PREFIX lang:<http://publications.europa.eu/resource/authority/language/>\n        PREFIX xsd:<http://www.w3.org/2001/XMLSchema#>\n        PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n        PREFIX owl:<http://www.w3.org/2002/07/owl#>\n\n        SELECT DISTINCT \n            ?date ?id \n            ?title \n            ?baseTitle\n            ?eli \n            ?ecli\n            ?force \n            MIN(?dateForce) as ?dateForce\n            (REPLACE(?oj, \" /, \\\\.\\\\.\", \"\", \"i\") as ?oj)\n            ?ojId \n            ?ojResourceUrl\n            ?ojDate\n            ?consolidatedDate \n            ?consolidatedEli \n            ?consolidatedId\n            MAX(?dateValidity) as ?dateValidity\n            ?repealCelexId \n            ?repealEli\n            ?lastRepealCelexId\n            ?lastRepealEli\n            ?resourceUrl\n            ?lang\n{\n        SELECT \n            ?date ?workId as ?id \n            ?title \n            ?baseTitle\n            ?eli \n            ?ecli\n            ?force \n            ?dateForce \n            (IF(BOUND(?ojIdOld), ?ojIdOld, ?ojActId) as ?ojId)\n            (IF(BOUND(?ojResourceUrlOld), ?ojResourceUrlOld, ?ojActResourceUrl) as ?ojResourceUrl)\n            (IF(BOUND(?ojDateOld), ?ojDateOld, ?ojActDate) as ?ojDate)\n            (IF(BOUND(?ojOld), ?ojOld, CONCAT(CONCAT(CONCAT(CONCAT(CONCAT(REPLACE(STR(?ojCollectionDocumentIdentifier ) , \"-\", \" \", \"i\"), \" \"), CONCAT(?ojActYear, \"/\"))), CONCAT(?ojActNumber, \", \")), \n            CONCAT(CONCAT(SUBSTR(STR(?ojActDate), 9, 2), \".\"), CONCAT(CONCAT(SUBSTR(STR(?ojActDate), 6, 2), \".\")), SUBSTR(STR(?ojActDate), 1, 4)))) as ?oj)\n            ?consolidatedDate \n            ?consolidatedEli \n            ?consolidatedId\n            ?dateValidity\n            ?repealCelexId \n            ?repealEli\n            ?lastRepealCelexId\n            ?lastRepealEli\n            ?resourceUrl\n            ?lang\n        WHERE {  \n            graph ?ge { \n                ?exp cdm:expression_belongs_to_work ?s .\n                ?exp cdm:expression_title ?title_ .\n                OPTIONAL {\n                    ?exp owl:sameAs ?resourceUrl .\n                    FILTER (REGEX(?resourceUrl, \"resource/oj/\"))\n                }\n            }\n            graph ?g { \n                ?exp cdm:expression_uses_language ?lang\n                ".concat(langISO3Filters, "\n            }  \n            ?s cdm:work_date_document ?date .\n            ?s rdf:type ?type .\n            ?s cdm:work_id_document ?workId.\n            OPTIONAL {\n                ?s cdm:case-law_ecli ?ecli\n            }\n            OPTIONAL {\n                ?s cdm:resource_legal_date_end-of-validity ?dateValidity .\n            }\n            ").concat(filters, "\n\n            OPTIONAL {\n                # CONSOLIDATION\n                ?actConsolidated cdm:act_consolidated_based_on_resource_legal ?s .\n                ?actConsolidated cdm:act_consolidated_date ?consolidatedDate .\n                ?actConsolidated cdm:resource_legal_date_entry-into-force ?consolidatedDateEntryForce .\n                ?actConsolidated cdm:resource_legal_eli ?consolidatedEli . \n                ?actConsolidated cdm:work_id_document ?consolidatedId_ .\n                \n                # we only need results before the end of the act validity\n                ?s cdm:resource_legal_date_end-of-validity ?act_end_of_validity .\n\n                ").concat(pointInTimeFilter1, "\n                FILTER (?consolidatedDateEntryForce < ?act_end_of_validity)     \n                FILTER regex(str(?consolidatedId_), \"celex:\")     \n                # latest consolidation date only\n                FILTER not exists {\n                    ?actConsolidated2 cdm:resource_legal_date_entry-into-force ?consolidatedDateEntryForce2 .\n                    ?actConsolidated2 cdm:act_consolidated_date ?consolidatedDate2 .\n                    ?actConsolidated2 cdm:act_consolidated_based_on_resource_legal ?s .\n                    ?s cdm:resource_legal_date_end-of-validity ?act_end_of_validity2 .\n                    ").concat(pointInTimeFilter2, "\n                    FILTER (?consolidatedDateEntryForce2 > ?consolidatedDateEntryForce AND (?consolidatedDateEntryForce2 < ?act_end_of_validity2))\n                }\n\n                BIND(SUBSTR(?consolidatedId_, 7) as ?consolidatedId)\n            }\n            OPTIONAL {\n                # REPEALING\n                ?actRepeal cdm:resource_legal_repeals_resource_legal ?s .\n                ?actRepeal cdm:resource_legal_eli ?repealEli . \n                ?actRepeal cdm:work_date_document ?repealDate . \n                ?actRepeal cdm:work_id_document ?repealCelexId_.\n                ").concat(pointInTimeFilter3, "\n                FILTER regex(str(?repealCelexId_), \"celex:\")                    \n                BIND(SUBSTR(?repealCelexId_, 7) as ?repealCelexId)\n\n                OPTIONAL {\n                    # REPEALING LAST\n                    ?lastActRepeal cdm:resource_legal_repeals_resource_legal+ ?s .\n                    ?lastActRepeal cdm:resource_legal_eli ?lastRepealEli . \n                    ?lastActRepeal cdm:work_id_document ?lastRepealCelexId_.\n                    FILTER regex(str(?lastRepealCelexId_), \"celex:\")                    \n                    FILTER not exists {\n                       ?actRepeal_ cdm:resource_legal_repeals_resource_legal ?lastActRepeal .\n                       ?actRepeal_ cdm:work_date_document ?repealDate2\n                       ").concat(pointInTimeFilter4, "\n                    } \n                    BIND(SUBSTR(?lastRepealCelexId_, 7) as ?lastRepealCelexId)\n                }\n            }\n            OPTIONAL {\n                ?s cdm:resource_legal_eli ?eli .\n            }\n            OPTIONAL {\n                # FORCE\n                ?s cdm:resource_legal_in-force ?force .\n                ?s cdm:resource_legal_date_entry-into-force ?dateForce .\n            }        \n            OPTIONAL {\n                # MANIFEST \n                ?manif cdm:manifestation_manifests_expression ?exp. \n                ?manif cdm:manifestation_type ?manifType .\n                FILTER(STR(?manifType)=\"print\" || BOUND(?ojPageFirst)) .\n\n                # MANIFEST OJ PAGE (optional)\n                OPTIONAL {\n                    ?manif cdm:manifestation_official-journal_part_page_first ?ojPageFirst.\n                    ?manif cdm:manifestation_official-journal_part_page_last ?ojPageLast.\n                }\n\n                ?manif cdm:manifestation_part_of_manifestation ?parentManif.\n                OPTIONAL {\n                    ?parentManif owl:sameAs ?langSpecificManif.\n                }\n                OPTIONAL {\n                    ?manif owl:sameAs ?manifOjResourceUrl .\n                    # We need to use the MANIFEST to get to the OJ\n                    FILTER (STRSTARTS(STR(?manifOjResourceUrl), \"http://publications.europa.eu/resource/oj/\"))\n                }\n\n                # OJ info\n                ?s cdm:resource_legal_published_in_official-journal ?q .\n                ?q cdm:official-journal_part_of_collection_document ?ojPartOld .\n                ?q cdm:official-journal_number ?ojNumberOld .\n                OPTIONAL {\n                    ?q cdm:official-journal_class ?ojClassOld .\n                }\n                ?ojPartOld skos:prefLabel ?ojPartLabelOld .\n                ?q cdm:official-journal_volume ?ojVolumeOld .\n                ?q cdm:publication_general_date_publication ?ojDateOld .\n                \n                # cross match with parent OJ resource\n                ?q owl:sameAs ?mainOjResourceUrlOld .\n                ?q cdm:work_id_document ?ojIdOld.\n                \n                # multiple OJ publications can cause trouble so we cross-match the OJ url with the manifest's (where available)\n                FILTER (!BOUND(?langSpecificManif) || STRSTARTS(STR(?langSpecificManif), STR(?mainOjResourceUrlOld)))\n                FILTER (STRSTARTS(STR(?ojIdOld), \"oj:\") AND STRSTARTS(STR(?mainOjResourceUrlOld), \"http://publications.europa.eu/resource/oj/\")) \n                BIND(?mainOjResourceUrlOld as ?ojResourceUrlOld)\n\n                BIND(CONCAT(STR(DAY(?ojDateOld)), \n                \".\", \n                STR(MONTH(?ojDateOld)), \n                \".\", \n                STR(YEAR(?ojDateOld))) as ?ojDatePublicationOld)\n\n                # OJ label; do not modify as it will be processed for translation\n                BIND(IF(BOUND(?ojPartLabelOld), \n                CONCAT(CONCAT(REPLACE(?ojPartLabelOld, \"-\", \" \", \"i\"), \" \", \n                CONCAT(?ojNumberOld, \n                CONCAT(IF (STR(?ojClassOld) != \"R\", ?ojClassOld, \"\"),\n                CONCAT(\", \", CONCAT($ojDatePublicationOld,\n                    CONCAT(IF(BOUND(?ojPageFirst), \", p. \", \"\"), \n                    CONCAT(IF(BOUND(?ojPageFirst), xsd:integer(?ojPageFirst), \"\"), \n                    CONCAT(IF(BOUND(?ojPageLast), \"-\", \"\"), IF(BOUND(?ojPageLast), xsd:integer(?ojPageLast), \"\")))))))))), \"\") as ?ojOld) .\n\n                FILTER (lang(?ojPartLabelOld) = \"en\" )\n            }\n\n            # OJ act-by-act\n            OPTIONAL {\n                FILTER NOT EXISTS {\n                    ?s cdm:resource_legal_published_in_official-journal ?_ojTemp\n                }\n                ?s cdm:official-journal-act_date_publication ?ojActDate .\n                ?s cdm:official-journal-act_part_of_collection_document ?ojCollectionDocument .\n                ?ojCollectionDocument dc:identifier ?ojCollectionDocumentIdentifier .\n                ?s cdm:official-journal-act_subsubsection_oj ?ojSubsection .\n                ?s cdm:official-journal-act_number ?ojActNumber .\n                ?s cdm:official-journal-act_year ?ojActYear .\n                \n                ?s cdm:work_id_document ?ojActId. \n                FILTER (STRSTARTS(STR(?ojActId), \"oj:\"))\n                ?s cdm:resource_legal_eli ?ojActResourceUrl . \n            } \n\n            BIND(CONCAT(?title_, IF(BOUND(?ecli), CONCAT(\"\\nECLI identifier: \", ?ecli), \"\")) as ?title) \n            BIND(?title_ as ?baseTitle)\n        }\n    }\n    ORDER BY ?id ?lang");
  return query;
};
;// ./src/lib/manager/query/joined_eucase.js
function getJoinedCaseQuery() {
  return "\n    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n    PREFIX cdm:<http://publications.europa.eu/ontology/cdm#>\n    PREFIX skos:<http://www.w3.org/2004/02/skos/core#>\n    PREFIX dc:<http://purl.org/dc/elements/1.1/>\n    PREFIX lang:<http://publications.europa.eu/resource/authority/language/>\n    PREFIX xsd:<http://www.w3.org/2001/XMLSchema#>\n    PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n    PREFIX owl:<http://www.w3.org/2002/07/owl#>\n\n    SELECT DISTINCT \n        ?workId as ?id ?title\n    WHERE {  \n        ?exp cdm:expression_belongs_to_work ?s .\n        ?exp cdm:expression_title ?title .\n        ?exp cdm:expression_uses_language ?lang\n        FILTER (?lang IN (lang:FRA))\n          \n        ?s cdm:work_id_document ?workId.\n        ?s cdm:resource_legal_type ?type .\n        ?s cdm:resource_legal_id_sector \"6\"^^xsd:string .         \n        FILTER (?type IN (\"TA\"^^xsd:string, \"CA\"^^xsd:string))\n        FILTER (REGEX(?title, \"^Affaires.jointes\") AND REGEX(STR(?workId), \"^celex:6\"))\n    }";
}
;// ./src/lib/manager/data/joined_eucase.js
/**
 * Process Cellar response - format joined cases as CSV with first case being the one with the judgement;
 * Example: 
 *     id: `celex:62011CA0229`
 *     title: `C-229/11,C-230/11`
 * @param {CellarResponse} response 
 * 
 * @return {CellarResponse}
 */
function parseJoinedCaseResponse(response) {
  response.results.bindings = response.results.bindings.map(function (result) {
    var parts = result.title.value.split(":");
    var title = parts[0] || '';
    title = title.replaceAll("‑", "-").replace("Affaires jointes ", "").replace(/\s?et\sles\saffaires\sjointes\s?/g, "");
    title = title.replace(/\s?(?:à|et)\s?/g, ",").replace(".", "");
    title = title.split(",").map(function (item) {
      return item.trim().replace("affaire ", "").replace(/\s/, " ");
    }).filter(function (caseLabel) {
      return caseLabel.indexOf('C-') === 0 || caseLabel.indexOf('T-') === 0;
    }).join(",");
    result.title.value = title;
    return result;
  });
  return response;
}
;// ./src/lib/manager/query/immc.js
/**
 * Query by immc ids
 * @param {Array<String>} immcIds 
 * @param {String} langISO3 (optional, will default to ENG)
 * 
 * @returns {String}
 */
var getImmcQuery = function getImmcQuery(immcIds, langISO3) {
  var langISO3s = langISO3 ? [String(langISO3).toUpperCase()] : ["ENG", "FRA"]; // default to english or french
  var langISO3Filters = "FILTER (?workLang IN (";
  for (var i = 0; i < langISO3s.length; i++) {
    langISO3Filters += "lang:".concat(langISO3s[i]);
    if (i < langISO3s.length - 1) {
      langISO3Filters += ",";
    }
  }
  langISO3Filters += "))";

  // unique ids only
  immcIds = immcIds.filter(function (v, i, a) {
    return a.indexOf(v) === i;
  });
  var filters = "FILTER (?id IN (";
  for (var _i = 0; _i < immcIds.length; _i++) {
    filters += "\"immc:".concat(immcIds[_i], "\", \"immc:").concat(immcIds[_i], "\"^^xsd:string"); // query both types
    if (_i < immcIds.length - 1) {
      filters += ",";
    }
  }
  filters += "))";
  var query = "\n    PREFIX cdm: <http://publications.europa.eu/ontology/cdm#>\n    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n    PREFIX lang:<http://publications.europa.eu/resource/authority/language/>\n        SELECT DISTINCT\n            ?id\n            ?celexId\n            ?title\n            ?date\n            ?workLang as ?lang\n        WHERE {\n            \n            ".concat(filters, "\n        \n            ?work cdm:work_id_document ?id .\n            OPTIONAL {\n                ?work cdm:work_id_document ?celexId .\n                FILTER (STRSTARTS(?celexId, \"celex:\"))\n            }\n            ?work cdm:work_date_document ?date .\n   \n            ?exp cdm:expression_belongs_to_work ?work .\n            ?exp cdm:expression_title ?title .\n            ?exp cdm:expression_uses_language ?workLang .\n            ").concat(langISO3Filters, " .\n\n        }\n        ORDER BY ?id ?workLang\n    ");
  return query;
};
var processImmcResponse = function processImmcResponse(response, langISO3) {
  // resolve language
  var idMap = {};
  response.results.bindings = response.results.bindings.map(function (binding) {
    if (binding.title && binding.title.value) {
      binding.title.value = binding.title.value.replace(new RegExp("&#13;\n", 'g'), ' ');
    }
    if (!idMap[binding.id.value]) {
      idMap[binding.id.value] = [];
    }
    idMap[binding.id.value].push(binding);
    return binding;
  });
  var newBindings = [];
  // default to english or french
  Object.keys(idMap).forEach(function (id) {
    var foundLang = idMap[id].filter(function (m) {
      return m.lang.value === 'http://publications.europa.eu/resource/authority/language/' + String(langISO3).toUpperCase();
    }).pop();
    if (!foundLang) {
      foundLang = idMap[id].filter(function (m) {
        return m.lang.value === 'http://publications.europa.eu/resource/authority/language/ENG';
      }).pop();
    }
    if (!foundLang) {
      foundLang = idMap[id].filter(function (m) {
        return m.lang.value === 'http://publications.europa.eu/resource/authority/language/FRA';
      }).pop();
    }
    if (foundLang) {
      newBindings.push(foundLang);
    }
  });
  response.results.bindings = newBindings;
  return response;
};
;// ./src/lib/manager/index.js
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function manager_ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function manager_objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? manager_ownKeys(Object(t), !0).forEach(function (r) { manager_defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : manager_ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function manager_defineProperty(obj, key, value) { key = manager_toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _classPrivateMethodInitSpec(obj, privateSet) { _checkPrivateRedeclaration(obj, privateSet); privateSet.add(obj); }
function _checkPrivateRedeclaration(obj, privateCollection) { if (privateCollection.has(obj)) { throw new TypeError("Cannot initialize the same private elements twice on an object"); } }
function _classPrivateMethodGet(receiver, privateSet, fn) { if (!privateSet.has(receiver)) { throw new TypeError("attempted to get private field on non-instance"); } return fn; }
function manager_typeof(o) { "@babel/helpers - typeof"; return manager_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, manager_typeof(o); }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, manager_toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function manager_toPropertyKey(t) { var i = manager_toPrimitive(t, "string"); return "symbol" == manager_typeof(i) ? i : String(i); }
function manager_toPrimitive(t, r) { if ("object" != manager_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != manager_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

























var SPARQL_STATUS_INIT = 'init';
var SPARQL_STATUS_SUCCESS = 'success';
var SPARQL_STATUS_PENDING = 'pending';
var SPARQL_STATUS_ERROR = 'error';
var CELLAR_JOINED_EUCASE_DATA_CACHE_KEY = 'CELLAR:JOINED_EUCASE_DATA';
var CELLAR_JOINED_EUCASE_DATA_PROCESSED_CACHE_KEY = 'CELLAR:JOINED_EUCASE_PROCESSED_DATA';
var LD_TYPE_CELEX = 'celex';
var LD_TYPE_IMMC = 'immc';
var LD_TYPE_OJ = 'oj';
var LD_TYPE_ECLI = 'ecli';
var LD_TYPE_ELI = 'eli';
var LD_TYPE_PROCEDURE = 'procedure';
var LD_TYPE_CONSIL = 'consil';
var LD_TYPE_HANDOC = 'handoc';
var LD_TYPE_CIS = 'cis';
var LD_TYPE_FINLEX = 'finlex-eli';
var LD_CELEX_SUFFIXES = ["", "-0", "-1", "-2", "-3", "-4", "-5", "-6", "-7", "-8", "-9", "-10"];
var LD_TARGET_CELLAR = 'cellar';
var LD_TARGET_FINLEX = 'finlex';
var LD_TARGET_ELI = 'eli';
var LD_TARGET_KM = 'km';

/**
 * Holds metadata associated to a reference
 */
var Binding = /*#__PURE__*/_createClass(
/**
 * Constructs a binding object. Holds error state. 
 * @param {Object} data - Data object as returned by the SPARQL query @CELLAR
 * @param {string} type   
 * @param {string} status 
 */
function Binding(data, type, status) {
  _classCallCheck(this, Binding);
  this.data = data;
  this.type = type;
  this.status = status;
});

/**
 * 
 * @param {Binding} binding 
 * @returns {Object}
 */
function cleanLinkedDataBinding(binding) {
  var data = binding.data;
  Object.keys(data).forEach(function (key) {
    var v = data[key];
    if (v) {
      delete v.datatype;
      data[key] = v;
    }
  });
  return data;
}

/**
 * 
 * @param {Binding} binding 
 * @returns 
 */
function sanitizeLinkedDataBinding(binding) {
  if (manager_typeof(binding) !== 'object' || manager_typeof(binding.data) !== 'object') {
    return binding;
  }
  Object.keys(binding.data || {}).forEach(function (key) {
    var v = binding.data[key];
    if (v && typeof v.value === "string") {
      v.value = (0,functions/* sanitizeHtml */.pn)(v.value);
    }
  });
  return binding;
}

/**
 * The LinkedDataManager is responsible for fetching linked-data from external repositories
 * It can fetch data based on: 
 *   - CELEX and ECLI identifiers - using the Publication Office Cellar repository
 *   - Finnish ELI identifiers - using the Finlex Graph
 * 
 * DO NOT TRUST THE DATA
 * Make sure the data is sanitized and contains no HTML entities
 */
var _resolveCelexData = /*#__PURE__*/new WeakSet();
var _resolveEcliData = /*#__PURE__*/new WeakSet();
var _resolveFinlexData = /*#__PURE__*/new WeakSet();
var _resolveEliData = /*#__PURE__*/new WeakSet();
var _resolveHandocData = /*#__PURE__*/new WeakSet();
var _resolveProcedureData = /*#__PURE__*/new WeakSet();
var _resolveConsilData = /*#__PURE__*/new WeakSet();
var _resolveOjData = /*#__PURE__*/new WeakSet();
var _resolveImmcData = /*#__PURE__*/new WeakSet();
var LinkedDataManager = /*#__PURE__*/function () {
  function LinkedDataManager() {
    _classCallCheck(this, LinkedDataManager);
    _classPrivateMethodInitSpec(this, _resolveImmcData);
    _classPrivateMethodInitSpec(this, _resolveOjData);
    _classPrivateMethodInitSpec(this, _resolveConsilData);
    _classPrivateMethodInitSpec(this, _resolveProcedureData);
    _classPrivateMethodInitSpec(this, _resolveHandocData);
    _classPrivateMethodInitSpec(this, _resolveEliData);
    _classPrivateMethodInitSpec(this, _resolveFinlexData);
    _classPrivateMethodInitSpec(this, _resolveEcliData);
    _classPrivateMethodInitSpec(this, _resolveCelexData);
    /* Holds raw linked-data object (KV) */
    this._metadata = {};
    this.status = SPARQL_STATUS_INIT;
    this.supportedTypes = [LD_TYPE_CELEX, LD_TYPE_IMMC, LD_TYPE_OJ, LD_TYPE_CONSIL, LD_TYPE_CIS, LD_TYPE_PROCEDURE, LD_TYPE_ECLI, LD_TYPE_ELI, LD_TYPE_FINLEX, LD_TYPE_HANDOC];
    this.proxyTicket = null;
    this.user = null;
    this._customHeaders = {};
    this._localCache = {};
  }
  _createClass(LinkedDataManager, [{
    key: "getCustomHeaders",
    value: function getCustomHeaders() {
      return this._customHeaders;
    }
  }, {
    key: "setCustomHeaders",
    value: function setCustomHeaders(customHeaders) {
      this._customHeaders = customHeaders;
    }
  }, {
    key: "getStatus",
    value: function getStatus() {
      return this.status;
    }
  }, {
    key: "setProxyTicket",
    value: function setProxyTicket(proxyTicket) {
      this.proxyTicket = proxyTicket;
    }
  }, {
    key: "setUser",
    value: function setUser(user) {
      this.user = user;
    }

    /**
     * @param {String} id
     * @returns {Binding|null} 
     */
  }, {
    key: "getMetadataById",
    value: function getMetadataById(id) {
      return this._metadata[id];
    }
  }, {
    key: "getMetadata",
    value:
    /**
     * Get metadata by a list of ids 
     * @param {string[]} ids 
     */
    function getMetadata(ids) {
      var _this = this;
      if (Array.isArray(ids)) {
        var data = {};
        ids.forEach(function (id) {
          if (_this._metadata[id]) {
            data[id] = _this._metadata[id];
          }
        });
        return data;
      } else {
        return this._metadata;
      }
    }
  }, {
    key: "setMetadata",
    value: function setMetadata(metadata) {
      // sanitize all strings coming from Cellar (REFTOLINK-1523)
      Object.keys(metadata).forEach(function (key) {
        metadata[key] = sanitizeLinkedDataBinding(metadata[key]);
      });
      this._metadata = manager_objectSpread(manager_objectSpread({}, this._metadata), metadata);
    }
  }, {
    key: "clearCache",
    value: function clearCache() {
      this._metadata = {};
    }
  }, {
    key: "getEurlexContent",
    value: function getEurlexContent(node) {
      var langISO3 = R2L.getLanguage() || 'ENG';
      var langISO2 = (0,translations/* getISO2Lang */.GB)((langISO3 || "ENG").toUpperCase());
      var celex = node.data[0].celex;
      // celex id can also be present in linked data (ECLI)
      if (!celex && node.data[0].metadata && node.data[0].metadata.celexId) {
        celex = String(node.data[0].metadata.celexId.value).replace("celex:", "");
      }

      // pass ELI if present and point in time is enabled
      var eliUrl = node.urls.filter(function (url) {
        return ["eurlex.act.eli", "eurlex.oj.eli", "eurlex.intlagr.eli", "eliurl"].indexOf(url.baseTarget) !== -1;
      }).pop();
      var curiaUrl = node.urls.filter(function (url) {
        return ["curia.ecli"].indexOf(url.baseTarget) !== -1;
      }).pop();
      var ecli = null;
      if (curiaUrl) {
        ecli = node.data && node.data[0] ? node.data[0]['ecli'] : null;
      }

      // when point in time is enabled we use the ELI
      var eli = R2L.options.pointInTime && eliUrl ? "/eli" + eliUrl.href.split("/eli")[1] : null;
      var linkedDataEli = node.data[0].metadata && node.data[0].metadata.eli ? node.data[0].metadata.eli.value : null;

      // if no CELEX then use eli if available
      if (eli) {
        // use the linked data ELI if present as it will contain the latest consolidation URL
        var href = linkedDataEli || eli;
        eli = "/eli" + href.split("/eli")[1];
      }
      var queryParams = {
        lang: langISO2,
        celex: celex,
        eli: eli
      };

      // REFTOLINK-2207 pass Curia URL in case  it is used for content extractions
      if (ecli && curiaUrl) {
        queryParams.ecli = ecli;
        queryParams.curiaUrl = curiaUrl.href;
      }
      return (0,request/* getEurlexRequestPromise */.I)(getEurlexContentEndpoint(), "GET", queryParams).then(function (response) {
        return parseContentResponse(response, node);
      });
    }
  }, {
    key: "getOjData",
    value: function getOjData(ojIds, format) {
      var langISO3 = R2L.getLanguage() || 'ENG';
      var query = getOjQuery(ojIds, langISO3);
      format = format || 'application/json';
      return (0,request/* getRequestPromise */.p)(getEndpoint(LD_TYPE_CELEX), "POST", {
        query: query,
        format: format,
        origin: '*',
        target: LD_TARGET_CELLAR
      }).then(function (response) {
        // apply OJ translations
        var langISO2 = (0,translations/* getISO2Lang */.GB)((langISO3 || "ENG").toUpperCase());
        response = translateOjData(response, langISO2);
        var promises = [];

        // explicit LD_ADVANCED_MODE_CORRECTIONS mode (must be set via the API)
        // Note: it will not be included in the "all" mode

        if (R2L.options.pointInTime) {
          promises.push(appendPointInTimeData(response, langISO3));
        }
        if (langISO3 && R2L.options.linkedDataMode.indexOf(settings/* LD_ADVANCED_MODE_CORRECTIONS */.s5) !== -1) {
          promises.push(appendCorrectionsData(response, langISO3));
        }

        // explicit LD_ADVANCED_MODE_SHORT_TITLES mode (must be set via the API)
        // Note: it will not be included in the "all" mode
        // Note: The SHORT TITLES mode is not compatible with the JQuery tooltips. Tooltips will be reset when performing an extra R2L scan.
        if (langISO3 && R2L.options.linkedDataMode.indexOf(settings/* LD_ADVANCED_MODE_SHORT_TITLES */.Zj) !== -1) {
          promises.push(appendShortTitlesData(response, langISO3));
        }
        if (promises.length) {
          return Promise.all(promises).then(function (responses) {
            return responses[promises.length - 1];
          })["catch"](function (err) {
            console.error(err);
            return response;
          });
        } else {
          return response;
        }
      });
    }
  }, {
    key: "getCelexData",
    value: function getCelexData(celexIds, format) {
      var langISO3 = R2L.getLanguage() || 'ENG';
      var query = getCelexQuery(celexIds, langISO3);
      format = format || 'application/json';
      return (0,request/* getRequestPromise */.p)(getEndpoint(LD_TYPE_CELEX), "POST", {
        query: query,
        format: format,
        origin: '*',
        target: LD_TARGET_CELLAR
      }).then(function (response) {
        // apply OJ translations
        var langISO2 = (0,translations/* getISO2Lang */.GB)((langISO3 || "ENG").toUpperCase());
        response = translateOjData(response, langISO2);
        var promises = [];

        // explicit LD_ADVANCED_MODE_CORRECTIONS mode (must be set via the API)
        // Note: it will not be included in the "all" mode

        if (R2L.options.pointInTime) {
          promises.push(appendPointInTimeData(response, langISO3));
        }
        if (langISO3 && R2L.options.linkedDataMode.indexOf(settings/* LD_ADVANCED_MODE_CORRECTIONS */.s5) !== -1) {
          promises.push(appendCorrectionsData(response, langISO3));
        }

        // explicit LD_ADVANCED_MODE_SHORT_TITLES mode (must be set via the API)
        // Note: it will not be included in the "all" mode
        // Note: The SHORT TITLES mode is not compatible with the JQuery tooltips. Tooltips will be reset when performing an extra R2L scan.
        if (langISO3 && R2L.options.linkedDataMode.indexOf(settings/* LD_ADVANCED_MODE_SHORT_TITLES */.Zj) !== -1) {
          promises.push(appendShortTitlesData(response, langISO3));
        }
        if (promises.length) {
          return Promise.all(promises).then(function (responses) {
            return responses[promises.length - 1];
          })["catch"](function (err) {
            console.error(err);
            return response;
          });
        } else {
          return response;
        }
      });
    }
  }, {
    key: "getProcedureData",
    value: function getProcedureData(procedureIds, format) {
      var langISO3 = R2L.getLanguage() || 'ENG';
      var query = getProcedureQuery(procedureIds, langISO3);
      format = format || 'application/json';
      return (0,request/* getRequestPromise */.p)(getEndpoint(LD_TYPE_PROCEDURE), "POST", {
        query: query,
        format: format,
        origin: '*',
        target: LD_TARGET_CELLAR
      }).then(function (response) {
        return processProcResponse(response, langISO3);
      });
    }
  }, {
    key: "getEcliData",
    value: function getEcliData(ecliIds, format) {
      var query = getEcliQuery(ecliIds, R2L.getLanguage() || 'ENG');
      format = format || 'application/json';
      return (0,request/* getRequestPromise */.p)(getEndpoint(LD_TYPE_ECLI), "POST", {
        query: query,
        format: format,
        origin: '*',
        target: LD_TARGET_CELLAR
      });
    }
  }, {
    key: "getConsilData",
    value: function getConsilData(consilIds, format) {
      var langISO3 = R2L.getLanguage() || 'ENG';
      var query = getConsilQuery(consilIds, langISO3);
      format = format || 'application/json';
      return (0,request/* getRequestPromise */.p)(getEndpoint(LD_TYPE_CELEX), "POST", {
        query: query,
        format: format,
        origin: '*',
        target: LD_TARGET_CELLAR
      }).then(function (response) {
        return processConsilResponse(response, langISO3);
      });
    }
  }, {
    key: "getImmcData",
    value: function getImmcData(immcIds, format) {
      var langISO3 = R2L.getLanguage() || 'ENG';
      var query = getImmcQuery(immcIds, langISO3);
      format = format || 'application/json';
      return (0,request/* getRequestPromise */.p)(getEndpoint(LD_TYPE_CELEX), "POST", {
        query: query,
        format: format,
        origin: '*',
        target: LD_TARGET_CELLAR
      }).then(function (response) {
        return processImmcResponse(response, langISO3);
      });
    }
  }, {
    key: "getFinlexEliData",
    value: function getFinlexEliData(eliIds, format) {
      var query = getFinlexEliQuery(eliIds, R2L.getLanguage() || "ENG");
      format = format || 'application/json';
      return (0,request/* getRequestPromise */.p)(getEndpoint(LD_TYPE_FINLEX), "POST", {
        query: query,
        format: format,
        origin: '*',
        target: LD_TARGET_FINLEX
      });
    }
  }, {
    key: "getEliData",
    value: function getEliData(eliIds, format) {
      var langISO3 = R2L.getLanguage() || "ENG";
      // filter out /eli/L/ ids because they are not in Cellar
      eliIds = eliIds.filter(function (eliId) {
        return eliId.indexOf('/eli/L/') === -1;
      });
      format = format || 'application/json';
      var computedEliIdsMap = {};
      var computedEliIds = eliIds;
      eliIds.forEach(function (eliId) {
        computedEliIdsMap[eliId] = eliId;
      });

      // get all ELI consolidations first
      // we don't need to lookup eli ids with /oj
      var consolidationEliIds = eliIds.filter(function (eid) {
        return eid.slice(-3) !== '/oj';
      });
      var consolidationsQuery = getEliConsolidationsQuery(consolidationEliIds);
      return (consolidationEliIds.length > 0 ? (0,request/* getRequestPromise */.p)(getEndpoint(LD_TYPE_ELI), "POST", {
        query: consolidationsQuery,
        format: format,
        origin: '*',
        target: LD_TARGET_ELI
      }) : Promise.resolve(null)).then(function (consolidationEliResponse) {
        if (consolidationEliResponse) {
          // we override the ELI data with ids having the dates closest to ours
          computedEliIdsMap = computeEliIdsMap(eliIds, consolidationEliResponse.results.bindings);
          // we rebuild the map
          computedEliIds = Object.values(computedEliIdsMap);
        }
        var query = getEliQuery(computedEliIds, R2L.getLanguage() || "ENG");
        return (0,request/* getRequestPromise */.p)(getEndpoint(LD_TYPE_ELI), "POST", {
          query: query,
          format: format,
          origin: '*',
          target: LD_TARGET_ELI
        });
      }).then(function (response) {
        if (langISO3 && R2L.options.linkedDataMode.indexOf(settings/* LD_ADVANCED_MODE_CORRECTIONS */.s5) !== -1) {
          return appendCorrectionsData(response, langISO3);
        } else {
          return Promise.resolve(response);
        }
      }).then(function (response) {
        // explicit LD_ADVANCED_MODE_SHORT_TITLES mode (must be set via the API)
        // Note: it will not be included in the "all" mode
        // Note: The SHORT TITLES mode is not compatible with the JQuery tooltips. Tooltips will be reset when performing an extra R2L scan.
        if (langISO3 && R2L.options.linkedDataMode.indexOf(settings/* LD_ADVANCED_MODE_SHORT_TITLES */.Zj) !== -1) {
          return appendShortTitlesData(response, langISO3);
        } else {
          return Promise.resolve(response);
        }
      }).then(function (response) {
        var langISO2 = (0,translations/* getISO2Lang */.GB)((langISO3 || "ENG").toUpperCase());
        response = translateOjData(response, langISO2);
        response._computedEliIdsMap = computedEliIdsMap;
        return response;
      });
    }

    /**
     * Retrieve ARES data from ULM's KM api 
     * 
     * @param {Array<String>} aresHandocIds 
     * @param {String} format
     * 
     * @return Promise<Object> 
     */
  }, {
    key: "getAresData",
    value: function getAresData(aresHandocIds, format) {
      var body = {
        handoc: aresHandocIds
      };
      format = format || 'application/json';
      return (0,ecas/* getEcasTicket */.T)(getEndpoint(LD_TYPE_HANDOC), this.proxyTicket).then(function (proxyTicket) {
        var headers = {
          Authorization: proxyTicket
        };
        return (0,request/* getRequestPromise */.p)(getEndpoint(LD_TYPE_HANDOC), "POST", {
          query: JSON.stringify(body),
          format: format,
          origin: '*',
          target: LD_TARGET_KM
        }, headers).then(function (response) {
          return response;
        });
      })["catch"](function (err) {
        console.error(err);
        throw err;
      });
    }

    /**
     * Retrieve data for multiple types from ULM's KM api 
     * 
     * @param {Object} body - Example: { handoc: ["id1", "id2"], cis: ["id3", "id4"]} 
     * @param {String} format
     * 
     * @return Promise<Object> 
     */
  }, {
    key: "getKMData",
    value: function getKMData(body, format) {
      format = format || 'application/json';
      return (0,ecas/* getEcasTicket */.T)(getEndpoint(LD_TYPE_HANDOC), this.proxyTicket).then(function (proxyTicket) {
        var headers = {
          Authorization: proxyTicket
        };
        return (0,request/* getRequestPromise */.p)(getEndpoint(LD_TYPE_HANDOC), "POST", {
          query: JSON.stringify(body),
          format: format,
          origin: '*',
          target: LD_TARGET_KM
        }, headers).then(function (response) {
          return response;
        });
      })["catch"](function (err) {
        console.error(err);
        throw err;
      });
    }

    /**
     * Returns a list of citations with titles for a CELEX id
     * @param {String} celexId 
     * @param {String} searchText (optional) 
     * @param {String} documentType (optional) - celex sector number (3 for legal acts, 6 for case law) 
     */
  }, {
    key: "getActsCitedByAct",
    value: function getActsCitedByAct(celexId, searchText, documentType) {
      var query = getActsCitedByActQuery(celexId, R2L.getLanguage() || "ENG", searchText, documentType);
      var format = 'application/json';
      return (0,request/* getRequestPromise */.p)(getEndpoint(LD_TYPE_CELEX), "POST", {
        query: query,
        format: format,
        origin: '*',
        target: LD_TARGET_CELLAR
      }).then(function (response) {
        return response;
      })["catch"](function (err) {
        console.error(err);
        throw err;
      });
    }

    /**
     * Returns a list of acts that cite this act (CELEX id)
     * @param {String} celexId 
     * @param {String} searchText (optional)
     * @param {String} documentType (optional) - celex sector number (3 for legal acts, 6 for case law)
     */
  }, {
    key: "getActsCitingAct",
    value: function getActsCitingAct(celexId, searchText, documentType) {
      var query = getActsCitingActQuery(celexId, R2L.getLanguage() || "ENG", searchText, documentType);
      var format = 'application/json';
      return (0,request/* getRequestPromise */.p)(getEndpoint(LD_TYPE_CELEX), "POST", {
        query: query,
        format: format,
        origin: '*',
        target: LD_TARGET_CELLAR
      }).then(function (response) {
        return response;
      })["catch"](function (err) {
        console.error(err);
        throw err;
      });
    }

    /**
     * Returns a list of acts that are based on this act
     * @param {String} celexId 
     * @param {String} searchText  (optional)
     */
  }, {
    key: "getActsByBasisAct",
    value: function getActsByBasisAct(celexId, searchText) {
      var query = getActsByBasisActQuery(celexId, R2L.getLanguage() || "ENG", searchText);
      var format = 'application/json';
      return (0,request/* getRequestPromise */.p)(getEndpoint(LD_TYPE_CELEX), "POST", {
        query: query,
        format: format,
        origin: '*',
        target: LD_TARGET_CELLAR
      }).then(function (response) {
        return response;
      })["catch"](function (err) {
        console.error(err);
        throw err;
      });
    }

    /**
     * Returns the base acts for this act (CELEX id)
     * @param {String} celexId 
     * @param {String} searchText
     */
  }, {
    key: "getBasisActsByAct",
    value: function getBasisActsByAct(celexId, searchText) {
      var query = getBasisActsByActQuery(celexId, R2L.getLanguage() || "ENG", searchText);
      var format = 'application/json';
      return (0,request/* getRequestPromise */.p)(getEndpoint(LD_TYPE_CELEX), "POST", {
        query: query,
        format: format,
        origin: '*',
        target: LD_TARGET_CELLAR
      }).then(function (response) {
        return response;
      })["catch"](function (err) {
        console.error(err);
        throw err;
      });
    }

    /**
     * Returns directory code for a CELEX id
     * @param {String} celexId 
     * @param {String} format (optional) - defaults to 'application/json'
     */
  }, {
    key: "getDirectoryCode",
    value: function getDirectoryCode(celexId, format) {
      // ISO2 language
      var query = getDirectoryCodeQuery(celexId, getLinkedDataLanguage());
      format = format || 'application/json';
      return (0,request/* getRequestPromise */.p)(getEndpoint(LD_TYPE_CELEX), "POST", {
        query: query,
        format: format,
        origin: '*',
        target: LD_TARGET_CELLAR
      }).then(function (response) {
        return response;
      })["catch"](function (err) {
        console.error(err);
        throw err;
      });
    }

    /**
     * Returns EUROVOC descriptors for a CELEX id
     * @param {String} celexId 
     * @param {String} format (optional) - defaults to 'application/json'
     */
  }, {
    key: "getEurovoc",
    value: function getEurovoc(celexId, format) {
      // ISO2 language
      var query = getEurovocQuery(celexId, getLinkedDataLanguage());
      format = format || 'application/json';
      return (0,request/* getRequestPromise */.p)(getEndpoint(LD_TYPE_CELEX), "POST", {
        query: query,
        format: format,
        origin: '*',
        target: LD_TARGET_CELLAR
      }).then(function (response) {
        return response;
      })["catch"](function (err) {
        console.error(err);
        throw err;
      });
    }

    /**
     * Returns subject matter for a CELEX id
     * @param {String} celexId 
     * @param {String} format (optional) - defaults to 'application/json'
     */
  }, {
    key: "getSubjectMatter",
    value: function getSubjectMatter(celexId, format) {
      // ISO2 language
      var query = getSubjectMatterQuery(celexId, getLinkedDataLanguage());
      format = format || 'application/json';
      return (0,request/* getRequestPromise */.p)(getEndpoint(LD_TYPE_CELEX), "POST", {
        query: query,
        format: format,
        origin: '*',
        target: LD_TARGET_CELLAR
      }).then(function (response) {
        return response;
      })["catch"](function (err) {
        console.error(err);
        throw err;
      });
    }
  }, {
    key: "getJoinedCaseDataByCaseLabel",
    value: function getJoinedCaseDataByCaseLabel(caseLabel) {
      var processedData = this._localCache[CELLAR_JOINED_EUCASE_DATA_PROCESSED_CACHE_KEY];
      if (!processedData) {
        var data = this._localCache[CELLAR_JOINED_EUCASE_DATA_CACHE_KEY];
        if (!data) {
          return null;
        }
        processedData = {};

        // create a map for fast lookups
        data.results.bindings.map(function (binding) {
          var caseLabels = binding.title.value.split(",").map(function (cl) {
            return cl.replace(/\s/g, "").replace("‑", "-");
          });
          caseLabels.forEach(function (caseLabel) {
            processedData[caseLabel] = binding.title.value.split(",");
          });
        });
        this._localCache[CELLAR_JOINED_EUCASE_DATA_PROCESSED_CACHE_KEY] = processedData;
      }
      var rawCaseLabel = String(caseLabel).replace(/\s/g, "").replaceAll("‑", "-");
      // look for the label in the joined cases list
      var item = processedData[rawCaseLabel];
      console.debug("Getting joined case data by case", rawCaseLabel, item);
      return item;
    }
  }, {
    key: "getJoinedCaseData",
    value: function getJoinedCaseData() {
      var _this2 = this;
      if (this._localCache[CELLAR_JOINED_EUCASE_DATA_CACHE_KEY]) {
        return Promise.resolve(this._localCache[CELLAR_JOINED_EUCASE_DATA_CACHE_KEY]);
      }
      var query = getJoinedCaseQuery();
      var format = 'application/json';
      return (0,request/* getRequestPromise */.p)(getEndpoint(LD_TYPE_CELEX), "POST", {
        query: query,
        format: format,
        origin: '*',
        target: LD_TARGET_CELLAR
      }).then(function (response) {
        var parsedResponse = parseJoinedCaseResponse(response);
        _this2._localCache[CELLAR_JOINED_EUCASE_DATA_CACHE_KEY] = parsedResponse;
        return parsedResponse;
      })["catch"](function (err) {
        console.error(err);
        throw err;
      });
    }

    /**
     * Checks whether the external linked data respositories are up by running a dummy query/request.
     * @param {string} ldTarget
     * 
     * @return {Promise<boolean>} 
     */
  }, {
    key: "checkHealth",
    value: function checkHealth(ldTarget) {
      ldTarget = ldTarget || LD_TARGET_CELLAR; // default to Cellar

      if (ldTarget !== LD_TARGET_CELLAR) {
        //@TODO implement health check for other targets (Finlex/HRS)
        return Promise.resolve(true);
      }
      var query = "SELECT * WHERE {\n            ?s ?p ?o\n        }\n        LIMIT 1";
      var format = 'application/json';
      return (0,request/* getRequestPromise */.p)(getEndpoint(LD_TARGET_CELLAR), "POST", {
        query: query,
        format: format,
        origin: '*',
        target: LD_TARGET_CELLAR
      }).then(function (response) {
        return response && response.results && response.results.bindings && response.results.bindings.length === 1 ? true : false;
      })["catch"](function (err) {
        console.error(err);
        return false;
      });
    }

    /**
     * Main linked-data retrieval method - will fetch data for all supported node types. A map of linked data ids can directly be passed as `defaultData`.
     * 
     * @param {Array<R2LNode>} nodes 
     * @param {Object} defaultData - pre-defined map of linked data ids (optional)
     * 
     * @returns {Object} A key-value map of linked-data ids (CELEX/ECLI/ELI...) => data 
     */
  }, {
    key: "fetch",
    value: function fetch(nodes, defaultData) {
      var _this3 = this;
      this.status = SPARQL_STATUS_PENDING;
      var data = defaultData || (0,utils_data/* extractLinkedDataIds */.Tc)(nodes);
      var celexIds = data[LD_TYPE_CELEX];
      var ecliIds = data[LD_TYPE_ECLI];
      var consilIds = data[LD_TYPE_CONSIL];
      var immcIds = data[LD_TYPE_IMMC];
      var eliIds = data[LD_TYPE_ELI];
      var procedureIds = data[LD_TYPE_PROCEDURE];
      var finlexEliIds = data[LD_TYPE_FINLEX];
      var aresHandocIds = data[LD_TYPE_HANDOC];
      var cisIds = data[LD_TYPE_CIS];
      var ojIds = data[LD_TYPE_OJ];

      // if the METADATA mode is off we don't load anything 
      if (!R2L.hasLinkedDataMode(settings/* LD_MODE_METADATA */.XS)) {
        return new Promise(function (resolve, reject) {
          resolve({});
        });
      }

      // group all promises
      return Promise.all([_classPrivateMethodGet(this, _resolveCelexData, _resolveCelexData2).call(this, celexIds).then(function (metadata) {
        return _this3.setMetadata(metadata);
      }), _classPrivateMethodGet(this, _resolveEcliData, _resolveEcliData2).call(this, ecliIds).then(function (metadata) {
        return _this3.setMetadata(metadata);
      }), _classPrivateMethodGet(this, _resolveEliData, _resolveEliData2).call(this, eliIds).then(function (metadata) {
        return _this3.setMetadata(metadata);
      }), _classPrivateMethodGet(this, _resolveFinlexData, _resolveFinlexData2).call(this, finlexEliIds).then(function (metadata) {
        return _this3.setMetadata(metadata);
      }), _classPrivateMethodGet(this, _resolveHandocData, _resolveHandocData2).call(this, aresHandocIds, cisIds).then(function (metadata) {
        return _this3.setMetadata(metadata);
      }), _classPrivateMethodGet(this, _resolveProcedureData, _resolveProcedureData2).call(this, procedureIds).then(function (metadata) {
        return _this3.setMetadata(metadata);
      }), _classPrivateMethodGet(this, _resolveConsilData, _resolveConsilData2).call(this, consilIds).then(function (metadata) {
        return _this3.setMetadata(metadata);
      }), _classPrivateMethodGet(this, _resolveOjData, _resolveOjData2).call(this, ojIds).then(function (metadata) {
        return _this3.setMetadata(metadata);
      }), _classPrivateMethodGet(this, _resolveImmcData, _resolveImmcData2).call(this, immcIds).then(function (metadata) {
        return _this3.setMetadata(metadata);
      })]).then(function (_) {
        _this3.status = SPARQL_STATUS_SUCCESS;
        return _this3.getMetadata([].concat(_toConsumableArray(celexIds), _toConsumableArray(ecliIds), _toConsumableArray(eliIds), _toConsumableArray(finlexEliIds), _toConsumableArray(aresHandocIds), _toConsumableArray(cisIds), _toConsumableArray(procedureIds), _toConsumableArray(consilIds), _toConsumableArray(ojIds), _toConsumableArray(immcIds)));
      })["catch"](function (e) {
        _this3.status = SPARQL_STATUS_ERROR;
        console.error(e);
        return {};
      });
    }
  }]);
  return LinkedDataManager;
}();

// bind functions
function _resolveCelexData2(celexIds) {
  var metadata = {};
  if (celexIds.length === 0) {
    return Promise.resolve({});
  }
  return this.getCelexData(celexIds).then(function (data) {
    if (data && data.results && data.results.bindings) {
      data.results.bindings.map(function (binding) {
        if (binding.originalId && binding.originalId.value && !metadata[binding.originalId.value.replace("celex:", "")]) {
          metadata[binding.originalId.value.replace("celex:", "")] = new Binding(binding, LD_TYPE_CELEX, SPARQL_STATUS_SUCCESS);
        }

        // only first result is relevant in case of duplication
        if (binding.id && binding.id.value && !metadata[binding.id.value.replace("celex:", "")]) {
          metadata[binding.id.value.replace("celex:", "")] = new Binding(binding, LD_TYPE_CELEX, SPARQL_STATUS_SUCCESS);
        }
      });
    }
    return metadata;
  })["catch"](function (err) {
    //set false when failed to fetch metadata
    celexIds.forEach(function (celexId) {
      metadata[celexId] = new Binding(null, LD_TYPE_CELEX, SPARQL_STATUS_ERROR);
    });
    return metadata;
  });
}
function _resolveEcliData2(ecliIds) {
  var metadata = {};
  if (ecliIds.length === 0) {
    return Promise.resolve({});
  }
  return this.getEcliData(ecliIds).then(function (data) {
    if (data && data.results && data.results.bindings) {
      data.results.bindings.map(function (binding) {
        if (binding.id && binding.id.value && !metadata[binding.id.value]) {
          metadata[binding.id.value] = new Binding(binding, LD_TYPE_ECLI, SPARQL_STATUS_SUCCESS);
        }
      });
    }
    return metadata;
  })["catch"](function (err) {
    //set false when failed to fetch metadata
    ecliIds.forEach(function (ecliId) {
      metadata[ecliId] = new Binding(null, LD_TYPE_ECLI, SPARQL_STATUS_ERROR);
    });
    return metadata;
  });
}
function _resolveFinlexData2(finlexEliIds) {
  var metadata = {};
  if (finlexEliIds.length === 0) {
    return Promise.resolve({});
  }
  return this.getFinlexEliData(finlexEliIds).then(function (data) {
    if (data && data.results && data.results.bindings) {
      data.results.bindings.map(function (binding) {
        if (binding.id && binding.id.value) {
          metadata[binding.id.value] = new Binding(binding, LD_TYPE_FINLEX, SPARQL_STATUS_SUCCESS);
        }
      });
    }
    return metadata;
  })["catch"](function (err) {
    return {};
  });
}
function _resolveEliData2(eliIds) {
  var metadata = {};
  if (eliIds.length === 0) {
    return Promise.resolve({});
  }
  return this.getEliData(eliIds).then(function (response) {
    if (response) {
      var computedEliIdsMap = response._computedEliIdsMap;
      if (response && response.results && response.results.bindings) {
        Object.keys(computedEliIdsMap).forEach(function (key) {
          // find the right binding
          var binding = response.results.bindings.filter(function (b) {
            return b && b.eli && b.eli.value === computedEliIdsMap[key];
          }).pop();
          if (binding) {
            metadata[key] = new Binding(binding, LD_TYPE_ELI, SPARQL_STATUS_SUCCESS);
          }
        });
      }
    }
    return metadata;
  })["catch"](function (err) {
    return {};
  });
}
function _resolveHandocData2(aresHandocIds, cisIds) {
  var metadata = {};
  var hasHandocData = true;
  var hasCisData = true;
  if (R2L.options.linkedDataMode.indexOf(settings/* LD_ADVANCED_MODE_KM_HANDOC */.n_) === -1 || aresHandocIds.length === 0) {
    hasHandocData = false;
  }
  if (R2L.options.linkedDataMode.indexOf(settings/* LD_ADVANCED_MODE_KM_CIS */.PR) === -1 || cisIds.length === 0) {
    hasCisData = false;
  }
  if (!hasHandocData && !hasCisData) {
    return Promise.resolve({});
  }
  return this.getKMData(manager_defineProperty(manager_defineProperty({}, LD_TYPE_HANDOC, aresHandocIds), LD_TYPE_CIS, cisIds)).then(function (data) {
    if (data && data.results && data.results.bindings) {
      data.results.bindings.map(function (binding) {
        if (binding.id && binding.id.value) {
          metadata[binding.id.value] = new Binding(binding, binding.type.value, SPARQL_STATUS_SUCCESS);
        }
      });
    }
    return metadata;
  })["catch"](function (err) {
    console.error(err);
    return {};
  });
}
function _resolveProcedureData2(procedureIds) {
  var metadata = {};
  if (procedureIds.length === 0) {
    return Promise.resolve({});
  }
  return this.getProcedureData(procedureIds).then(function (data) {
    if (data && data.results && data.results.bindings) {
      data.results.bindings.map(function (binding) {
        if (binding.id && binding.id.value) {
          metadata[binding.id.value] = new Binding(binding, LD_TYPE_PROCEDURE, SPARQL_STATUS_SUCCESS);
        }
      });
    }
    return metadata;
  })["catch"](function (err) {
    console.error(err);
    return {};
  });
}
function _resolveConsilData2(consilIds) {
  var metadata = {};
  if (consilIds.length === 0) {
    return Promise.resolve({});
  }
  return this.getConsilData(consilIds).then(function (data) {
    if (data && data.results && data.results.bindings) {
      data.results.bindings.map(function (binding) {
        if (binding.id && binding.id.value) {
          metadata[binding.id.value.replace("consil:", "")] = new Binding(binding, LD_TYPE_CONSIL, SPARQL_STATUS_SUCCESS);
        }
      });
    }
    return metadata;
  })["catch"](function (err) {
    console.error(err);
    return {};
  });
}
function _resolveOjData2(ojIds) {
  var metadata = {};
  if (ojIds.length === 0) {
    return Promise.resolve({});
  }
  return this.getOjData(ojIds).then(function (data) {
    if (data && data.results && data.results.bindings) {
      data.results.bindings.map(function (binding) {
        if (binding.originalId && binding.originalId.value && !metadata[binding.originalId.value.replace("oj:", "")]) {
          metadata[binding.originalId.value.replace("oj:", "")] = new Binding(binding, LD_TYPE_OJ, SPARQL_STATUS_SUCCESS);
        }

        // only first result is relevant in case of duplication
        if (binding.id && binding.id.value && !metadata[binding.id.value.replace("oj:", "")]) {
          metadata[binding.id.value.replace("oj:", "")] = new Binding(binding, LD_TYPE_OJ, SPARQL_STATUS_SUCCESS);
        }
      });
    }
    return metadata;
  })["catch"](function (err) {
    //set false when failed to fetch metadata
    celexIds.forEach(function (celexId) {
      metadata[celexId] = new Binding(null, LD_TYPE_OJ, SPARQL_STATUS_ERROR);
    });
    return metadata;
  });
}
function _resolveImmcData2(immcIds) {
  var metadata = {};
  if (immcIds.length === 0) {
    return Promise.resolve({});
  }
  return this.getImmcData(immcIds).then(function (data) {
    if (data && data.results && data.results.bindings) {
      data.results.bindings.map(function (binding) {
        if (binding.id && binding.id.value) {
          metadata[binding.id.value.replace("immc:", "")] = new Binding(binding, LD_TYPE_IMMC, SPARQL_STATUS_SUCCESS);
        }
      });
    }
    return metadata;
  })["catch"](function (err) {
    return metadata;
  });
}
LinkedDataManager.prototype.fixCaseLawCitation = fixCaseLawCitation;
LinkedDataManager.prototype.cleanFootnote = cleanFootnote;
LinkedDataManager.prototype.parseFragment = parseFragment;
LinkedDataManager.prototype.getJoinedCasesTranslation = getJoinedCasesTranslation;
LinkedDataManager.prototype.extractParagraphRange = extractParagraphRange;
LinkedDataManager.prototype.FOOTNOTE_BLACKLIST = FOOTNOTE_BLACKLIST;

/**
 * Target language takes priority over source language
 * @returns {string} Language ISO2 format
 */
function getLinkedDataLanguage() {
  var langMap = R2L.getConstant('R2L_EULANG');
  return langMap.get(String(R2L.getLanguage().toUpperCase()) || "ENG");
}
function getEndpoint(type) {
  if (type === LD_TYPE_FINLEX) {
    return settings/* settings */.W0.constants.R2L_FINLEX_ENDPOINT;
  } else {
    return settings/* settings */.W0.constants.R2L_PUBLICATIONS_ENDPOINT;
  }
}
function getEurlexContentEndpoint(type) {
  return settings/* settings */.W0.constants.R2L_CONTENT_ENDPOINT;
}

/***/ }),

/***/ 34:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// Copyright (c) 2013 Pieroxy <pieroxy@pieroxy.net>
// This work is free. You can redistribute it and/or modify it
// under the terms of the WTFPL, Version 2
// For more information see LICENSE.txt or http://www.wtfpl.net/
//
// For more information, the home page:
// http://pieroxy.net/blog/pages/lz-string/testing.html
//
// LZ-based compression algorithm, version 1.4.5
var LZString = function () {
  // private property
  var f = String.fromCharCode;
  var keyStrBase64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  var keyStrUriSafe = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$";
  var baseReverseDic = {};
  function getBaseValue(alphabet, character) {
    if (!baseReverseDic[alphabet]) {
      baseReverseDic[alphabet] = {};
      for (var i = 0; i < alphabet.length; i++) {
        baseReverseDic[alphabet][alphabet.charAt(i)] = i;
      }
    }
    return baseReverseDic[alphabet][character];
  }
  var LZString = {
    compressToBase64: function compressToBase64(input) {
      if (input == null) return "";
      var res = LZString._compress(input, 6, function (a) {
        return keyStrBase64.charAt(a);
      });
      switch (res.length % 4) {
        // To produce valid Base64
        default: // When could this happen ?
        case 0:
          return res;
        case 1:
          return res + "===";
        case 2:
          return res + "==";
        case 3:
          return res + "=";
      }
    },
    decompressFromBase64: function decompressFromBase64(input) {
      if (input == null) return "";
      if (input == "") return null;
      return LZString._decompress(input.length, 32, function (index) {
        return getBaseValue(keyStrBase64, input.charAt(index));
      });
    },
    compressToUTF16: function compressToUTF16(input) {
      if (input == null) return "";
      return LZString._compress(input, 15, function (a) {
        return f(a + 32);
      }) + " ";
    },
    decompressFromUTF16: function decompressFromUTF16(compressed) {
      if (compressed == null) return "";
      if (compressed == "") return null;
      return LZString._decompress(compressed.length, 16384, function (index) {
        return compressed.charCodeAt(index) - 32;
      });
    },
    //compress into uint8array (UCS-2 big endian format)
    compressToUint8Array: function compressToUint8Array(uncompressed) {
      var compressed = LZString.compress(uncompressed);
      var buf = new Uint8Array(compressed.length * 2); // 2 bytes per character

      for (var i = 0, TotalLen = compressed.length; i < TotalLen; i++) {
        var current_value = compressed.charCodeAt(i);
        buf[i * 2] = current_value >>> 8;
        buf[i * 2 + 1] = current_value % 256;
      }
      return buf;
    },
    //decompress from uint8array (UCS-2 big endian format)
    decompressFromUint8Array: function decompressFromUint8Array(compressed) {
      if (compressed === null || compressed === undefined) {
        return LZString.decompress(compressed);
      } else {
        var buf = new Array(compressed.length / 2); // 2 bytes per character
        for (var i = 0, TotalLen = buf.length; i < TotalLen; i++) {
          buf[i] = compressed[i * 2] * 256 + compressed[i * 2 + 1];
        }
        var result = [];
        buf.forEach(function (c) {
          result.push(f(c));
        });
        return LZString.decompress(result.join(''));
      }
    },
    //compress into a string that is already URI encoded
    compressToEncodedURIComponent: function compressToEncodedURIComponent(input) {
      if (input == null) return "";
      return LZString._compress(input, 6, function (a) {
        return keyStrUriSafe.charAt(a);
      });
    },
    //decompress from an output of compressToEncodedURIComponent
    decompressFromEncodedURIComponent: function decompressFromEncodedURIComponent(input) {
      if (input == null) return "";
      if (input == "") return null;
      input = input.replace(/ /g, "+");
      return LZString._decompress(input.length, 32, function (index) {
        return getBaseValue(keyStrUriSafe, input.charAt(index));
      });
    },
    compress: function compress(uncompressed) {
      return LZString._compress(uncompressed, 16, function (a) {
        return f(a);
      });
    },
    _compress: function _compress(uncompressed, bitsPerChar, getCharFromInt) {
      if (uncompressed == null) return "";
      var i,
        value,
        context_dictionary = {},
        context_dictionaryToCreate = {},
        context_c = "",
        context_wc = "",
        context_w = "",
        context_enlargeIn = 2,
        // Compensate for the first entry which should not count
        context_dictSize = 3,
        context_numBits = 2,
        context_data = [],
        context_data_val = 0,
        context_data_position = 0,
        ii;
      for (ii = 0; ii < uncompressed.length; ii += 1) {
        context_c = uncompressed.charAt(ii);
        if (!Object.prototype.hasOwnProperty.call(context_dictionary, context_c)) {
          context_dictionary[context_c] = context_dictSize++;
          context_dictionaryToCreate[context_c] = true;
        }
        context_wc = context_w + context_c;
        if (Object.prototype.hasOwnProperty.call(context_dictionary, context_wc)) {
          context_w = context_wc;
        } else {
          if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate, context_w)) {
            if (context_w.charCodeAt(0) < 256) {
              for (i = 0; i < context_numBits; i++) {
                context_data_val = context_data_val << 1;
                if (context_data_position == bitsPerChar - 1) {
                  context_data_position = 0;
                  context_data.push(getCharFromInt(context_data_val));
                  context_data_val = 0;
                } else {
                  context_data_position++;
                }
              }
              value = context_w.charCodeAt(0);
              for (i = 0; i < 8; i++) {
                context_data_val = context_data_val << 1 | value & 1;
                if (context_data_position == bitsPerChar - 1) {
                  context_data_position = 0;
                  context_data.push(getCharFromInt(context_data_val));
                  context_data_val = 0;
                } else {
                  context_data_position++;
                }
                value = value >> 1;
              }
            } else {
              value = 1;
              for (i = 0; i < context_numBits; i++) {
                context_data_val = context_data_val << 1 | value;
                if (context_data_position == bitsPerChar - 1) {
                  context_data_position = 0;
                  context_data.push(getCharFromInt(context_data_val));
                  context_data_val = 0;
                } else {
                  context_data_position++;
                }
                value = 0;
              }
              value = context_w.charCodeAt(0);
              for (i = 0; i < 16; i++) {
                context_data_val = context_data_val << 1 | value & 1;
                if (context_data_position == bitsPerChar - 1) {
                  context_data_position = 0;
                  context_data.push(getCharFromInt(context_data_val));
                  context_data_val = 0;
                } else {
                  context_data_position++;
                }
                value = value >> 1;
              }
            }
            context_enlargeIn--;
            if (context_enlargeIn == 0) {
              context_enlargeIn = Math.pow(2, context_numBits);
              context_numBits++;
            }
            delete context_dictionaryToCreate[context_w];
          } else {
            value = context_dictionary[context_w];
            for (i = 0; i < context_numBits; i++) {
              context_data_val = context_data_val << 1 | value & 1;
              if (context_data_position == bitsPerChar - 1) {
                context_data_position = 0;
                context_data.push(getCharFromInt(context_data_val));
                context_data_val = 0;
              } else {
                context_data_position++;
              }
              value = value >> 1;
            }
          }
          context_enlargeIn--;
          if (context_enlargeIn == 0) {
            context_enlargeIn = Math.pow(2, context_numBits);
            context_numBits++;
          }
          // Add wc to the dictionary.
          context_dictionary[context_wc] = context_dictSize++;
          context_w = String(context_c);
        }
      }

      // Output the code for w.
      if (context_w !== "") {
        if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate, context_w)) {
          if (context_w.charCodeAt(0) < 256) {
            for (i = 0; i < context_numBits; i++) {
              context_data_val = context_data_val << 1;
              if (context_data_position == bitsPerChar - 1) {
                context_data_position = 0;
                context_data.push(getCharFromInt(context_data_val));
                context_data_val = 0;
              } else {
                context_data_position++;
              }
            }
            value = context_w.charCodeAt(0);
            for (i = 0; i < 8; i++) {
              context_data_val = context_data_val << 1 | value & 1;
              if (context_data_position == bitsPerChar - 1) {
                context_data_position = 0;
                context_data.push(getCharFromInt(context_data_val));
                context_data_val = 0;
              } else {
                context_data_position++;
              }
              value = value >> 1;
            }
          } else {
            value = 1;
            for (i = 0; i < context_numBits; i++) {
              context_data_val = context_data_val << 1 | value;
              if (context_data_position == bitsPerChar - 1) {
                context_data_position = 0;
                context_data.push(getCharFromInt(context_data_val));
                context_data_val = 0;
              } else {
                context_data_position++;
              }
              value = 0;
            }
            value = context_w.charCodeAt(0);
            for (i = 0; i < 16; i++) {
              context_data_val = context_data_val << 1 | value & 1;
              if (context_data_position == bitsPerChar - 1) {
                context_data_position = 0;
                context_data.push(getCharFromInt(context_data_val));
                context_data_val = 0;
              } else {
                context_data_position++;
              }
              value = value >> 1;
            }
          }
          context_enlargeIn--;
          if (context_enlargeIn == 0) {
            context_enlargeIn = Math.pow(2, context_numBits);
            context_numBits++;
          }
          delete context_dictionaryToCreate[context_w];
        } else {
          value = context_dictionary[context_w];
          for (i = 0; i < context_numBits; i++) {
            context_data_val = context_data_val << 1 | value & 1;
            if (context_data_position == bitsPerChar - 1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            } else {
              context_data_position++;
            }
            value = value >> 1;
          }
        }
        context_enlargeIn--;
        if (context_enlargeIn == 0) {
          context_enlargeIn = Math.pow(2, context_numBits);
          context_numBits++;
        }
      }

      // Mark the end of the stream
      value = 2;
      for (i = 0; i < context_numBits; i++) {
        context_data_val = context_data_val << 1 | value & 1;
        if (context_data_position == bitsPerChar - 1) {
          context_data_position = 0;
          context_data.push(getCharFromInt(context_data_val));
          context_data_val = 0;
        } else {
          context_data_position++;
        }
        value = value >> 1;
      }

      // Flush the last char
      while (true) {
        context_data_val = context_data_val << 1;
        if (context_data_position == bitsPerChar - 1) {
          context_data.push(getCharFromInt(context_data_val));
          break;
        } else context_data_position++;
      }
      return context_data.join('');
    },
    decompress: function decompress(compressed) {
      if (compressed == null) return "";
      if (compressed == "") return null;
      return LZString._decompress(compressed.length, 32768, function (index) {
        return compressed.charCodeAt(index);
      });
    },
    _decompress: function _decompress(length, resetValue, getNextValue) {
      var dictionary = [],
        next,
        enlargeIn = 4,
        dictSize = 4,
        numBits = 3,
        entry = "",
        result = [],
        i,
        w,
        bits,
        resb,
        maxpower,
        power,
        c,
        data = {
          val: getNextValue(0),
          position: resetValue,
          index: 1
        };
      for (i = 0; i < 3; i += 1) {
        dictionary[i] = i;
      }
      bits = 0;
      maxpower = Math.pow(2, 2);
      power = 1;
      while (power != maxpower) {
        resb = data.val & data.position;
        data.position >>= 1;
        if (data.position == 0) {
          data.position = resetValue;
          data.val = getNextValue(data.index++);
        }
        bits |= (resb > 0 ? 1 : 0) * power;
        power <<= 1;
      }
      switch (next = bits) {
        case 0:
          bits = 0;
          maxpower = Math.pow(2, 8);
          power = 1;
          while (power != maxpower) {
            resb = data.val & data.position;
            data.position >>= 1;
            if (data.position == 0) {
              data.position = resetValue;
              data.val = getNextValue(data.index++);
            }
            bits |= (resb > 0 ? 1 : 0) * power;
            power <<= 1;
          }
          c = f(bits);
          break;
        case 1:
          bits = 0;
          maxpower = Math.pow(2, 16);
          power = 1;
          while (power != maxpower) {
            resb = data.val & data.position;
            data.position >>= 1;
            if (data.position == 0) {
              data.position = resetValue;
              data.val = getNextValue(data.index++);
            }
            bits |= (resb > 0 ? 1 : 0) * power;
            power <<= 1;
          }
          c = f(bits);
          break;
        case 2:
          return "";
      }
      dictionary[3] = c;
      w = c;
      result.push(c);
      while (true) {
        if (data.index > length) {
          return "";
        }
        bits = 0;
        maxpower = Math.pow(2, numBits);
        power = 1;
        while (power != maxpower) {
          resb = data.val & data.position;
          data.position >>= 1;
          if (data.position == 0) {
            data.position = resetValue;
            data.val = getNextValue(data.index++);
          }
          bits |= (resb > 0 ? 1 : 0) * power;
          power <<= 1;
        }
        switch (c = bits) {
          case 0:
            bits = 0;
            maxpower = Math.pow(2, 8);
            power = 1;
            while (power != maxpower) {
              resb = data.val & data.position;
              data.position >>= 1;
              if (data.position == 0) {
                data.position = resetValue;
                data.val = getNextValue(data.index++);
              }
              bits |= (resb > 0 ? 1 : 0) * power;
              power <<= 1;
            }
            dictionary[dictSize++] = f(bits);
            c = dictSize - 1;
            enlargeIn--;
            break;
          case 1:
            bits = 0;
            maxpower = Math.pow(2, 16);
            power = 1;
            while (power != maxpower) {
              resb = data.val & data.position;
              data.position >>= 1;
              if (data.position == 0) {
                data.position = resetValue;
                data.val = getNextValue(data.index++);
              }
              bits |= (resb > 0 ? 1 : 0) * power;
              power <<= 1;
            }
            dictionary[dictSize++] = f(bits);
            c = dictSize - 1;
            enlargeIn--;
            break;
          case 2:
            return result.join('');
        }
        if (enlargeIn == 0) {
          enlargeIn = Math.pow(2, numBits);
          numBits++;
        }
        if (dictionary[c]) {
          entry = dictionary[c];
        } else {
          if (c === dictSize) {
            entry = w + w.charAt(0);
          } else {
            return null;
          }
        }
        result.push(entry);

        // Add w+entry[0] to the dictionary.
        dictionary[dictSize++] = w + entry.charAt(0);
        enlargeIn--;
        w = entry;
        if (enlargeIn == 0) {
          enlargeIn = Math.pow(2, numBits);
          numBits++;
        }
      }
    }
  };
  return LZString;
}();
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (LZString);

/***/ }),

/***/ 228:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   M: () => (/* binding */ letters)
/* harmony export */ });
var letters = {
  latin: "a-zA-Z",
  cyrillic: "ЁёА-я",
  greek: "Α-ω",
  specialChars: "ÄäÅåÁáÀàÂâĂăĄąĀāĊċĆćČčÇçĎďĐđĘęĖėËëÉéÈèÊêĒēĚěĢģĠġĦħÏïÎîÌìÍíĪīĮįĶķŁłĹĺĽľĻļŃńŇňÑñŅņÖöÔôÓóŐőÒòÕõØøŔŕŘřŚśŠšȘșẞßȚțŤťÜüŮůÙùÚúŰűÛûŪūŲųŸÿŻżŹźŽžŒœÆæ"
};

/***/ }),

/***/ 246:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  cg: () => (/* binding */ bindTooltips),
  Gp: () => (/* binding */ getTriggers),
  Y3: () => (/* binding */ orderSorter),
  Ep: () => (/* binding */ resetTooltips)
});

// UNUSED EXPORTS: addStyle, getTableViewReference, hideTooltipHandler, positionHandler, repositionTooltipHandler, showTooltipHandler

// EXTERNAL MODULE: ./src/lib/jquery.js
var jquery = __webpack_require__(953);
// EXTERNAL MODULE: ./src/lib/utils/functions.js
var functions = __webpack_require__(588);
// EXTERNAL MODULE: ./src/lib/utils/base64.js
var base64 = __webpack_require__(910);
// EXTERNAL MODULE: ./src/lib/manager/index.js + 19 modules
var manager = __webpack_require__(33);
// EXTERNAL MODULE: ./src/lib/index.js + 14 modules
var lib = __webpack_require__(979);
// EXTERNAL MODULE: ./src/lib/translations/index.js + 1 modules
var translations = __webpack_require__(337);
;// ./src/lib/ux/lib/tooltip.js



var STATUS_IN_FORCE = "inforce";
var STATUS_NOT_IN_FORCE = "notinforce";
var STATUS_NO_LONGER_IN_FORCE = "nolongerinforce";
var STATUS_PENDING_IN_FORCE = "pendinginforce";
function buildConsolidationLabel(binding) {
  var metadata = binding ? binding.data : null;
  var result = '';
  if (!metadata) {
    return result;
  }
  if (!metadata.consolidatedEli || !metadata.consolidatedDate) {
    return result;
  }
  result += (0,translations/* getTranslation */.sC)('eurlex.act.changed', (0,manager/* getLinkedDataLanguage */.QT)()) + " <a href=\"".concat(metadata.consolidatedEli.value, "\" target=\"_blank\">").concat(toPrettyDate(metadata.consolidatedDate.value), "</a>");
  return result;
}
function buildOjLabel(binding) {
  var metadata = binding ? binding.data : null;
  return metadata && metadata.oj && metadata.oj.value ? "<br>" + (String(metadata.oj.value) + "<br>") : "";
}
function buildForceLabel(binding) {
  var status = buildForceStatus(binding);
  var consolidationLabel = buildConsolidationLabel(binding);
  var content = "";
  if (!binding || !binding.data) {
    return content;
  }
  if (status === STATUS_IN_FORCE) {
    content += (0,translations/* getTranslation */.sC)('eurlex.act.in.force', (0,manager/* getLinkedDataLanguage */.QT)());
    if (binding.data.initialEli && binding.data.initialEli.value) {
      var suffixLabel = "(<a target=\"_blank\" href=\"".concat(binding.data.initialEli.value, "\">") + (0,translations/* getTranslation */.sC)('eurlex.act.initial', (0,manager/* getLinkedDataLanguage */.QT)()) + "</a>)";
      content = content + ' ' + suffixLabel;
    }
  }
  if (status === STATUS_NOT_IN_FORCE) {
    content += (0,translations/* getTranslation */.sC)('eurlex.act.not.in.force', (0,manager/* getLinkedDataLanguage */.QT)());
    if (binding.data.initialEli && binding.data.initialEli.value) {
      var _suffixLabel = "(<a target=\"_blank\" href=\"".concat(binding.data.initialEli.value, "\">") + (0,translations/* getTranslation */.sC)('eurlex.act.initial', (0,manager/* getLinkedDataLanguage */.QT)()) + "</a>)";
      content = content + ' ' + _suffixLabel;
    }
  }
  if (status === STATUS_NO_LONGER_IN_FORCE && binding) {
    content += (0,translations/* getTranslation */.sC)('eurlex.act.no.longer.in.force', (0,manager/* getLinkedDataLanguage */.QT)());
    if (binding.data.dateValidity) {
      content += ", " + (0,translations/* getTranslation */.sC)('eurlex.act.validity.date.end', (0,manager/* getLinkedDataLanguage */.QT)());
      content += " " + toPrettyDate(binding.data.dateValidity.value);
    }

    // used by ELI queries
    if (binding.data.initialEli && binding.data.initialEli.value) {
      var _suffixLabel2 = "(<a target=\"_blank\" href=\"".concat(binding.data.initialEli.value, "\">") + (0,translations/* getTranslation */.sC)('eurlex.act.initial', (0,manager/* getLinkedDataLanguage */.QT)()) + "</a>)";
      content = content + ' ' + _suffixLabel2;
    }
  }
  if ((status === STATUS_NOT_IN_FORCE || status === STATUS_NO_LONGER_IN_FORCE) && binding && binding.data.repealCelexId && binding.data.repealEli) {
    content += "; " + (0,translations/* getTranslation */.sC)('eurlex.act.repealed.by', (0,manager/* getLinkedDataLanguage */.QT)()) + " <a href=\"".concat(binding.data.repealEli.value, "\" target=\"_blank\">").concat(binding.data.repealCelexId.value, "</a>");
  }
  if (status === STATUS_PENDING_IN_FORCE) {
    content += (0,translations/* getTranslation */.sC)('eurlex.act.notification.pending', (0,manager/* getLinkedDataLanguage */.QT)()) + binding.data.dateForce.value;
  }
  if (consolidationLabel) {
    content += "\r\n" + consolidationLabel;
  }

  // used by CELEX queries (Point in time)
  if (binding.data.originalEli) {
    content += "\r\n<a target=\"_blank\" href=\"".concat(binding.data.originalEli.value, "\">") + (0,translations/* getTranslation */.sC)('eurlex.act.original', (0,manager/* getLinkedDataLanguage */.QT)()) + "</a>";
  } else if (binding.data.originalId) {
    var url = "https://eur-lex.europa.eu/legal-content/".concat((0,manager/* getLinkedDataLanguage */.QT)() || 'EN', "/AUTO/?uri=").concat(binding.data.originalId.value);
    content += "\r\n<a target=\"_blank\" href=\"".concat(url, "\">") + (0,translations/* getTranslation */.sC)('eurlex.act.original', (0,manager/* getLinkedDataLanguage */.QT)()) + "</a>";
  }

  /**
   * if this is a consolidation but there's a newer one available show a link to the latest version
   * eg. http://data.europa.eu/eli/dec/2006/415/2015-12-02
   */
  if (binding && binding.data && binding.data.initialEli && binding.data.initialEli.value) {
    // check if the final consolidation is older than current act
    if (binding.data.finalConsolidatedEli && binding.data.finalConsolidatedDate && binding.data.date && binding.data.finalConsolidatedDate.value > binding.data.date.value) {
      var finalLabel = (0,translations/* getTranslation */.sC)('eurlex.act.access.current.version', (0,manager/* getLinkedDataLanguage */.QT)()) + " (".concat(toPrettyDate(binding.data.finalConsolidatedDate.value), ")");
      content = content + '\r\n' + "<a href=\"".concat(binding.data.finalConsolidatedEli.value, "\" target=\"_blank\">").concat(finalLabel, "</a>");
    }
  }
  return content;
}
function buildDate(binding) {
  var metadata = binding ? binding.data : null;
  if (!metadata) {
    return "";
  }
  try {
    return new Date(metadata.date.value.slice(0, 10)).toISOString().slice(0, 10);
  } catch (e) {
    return "";
  }
}
function buildForceStatus(binding) {
  var metadata = binding ? binding.data : null;
  var today = new Date().toISOString().slice(0, 10);
  if (!metadata || !metadata.force || metadata.force.value === "") {
    if (metadata && metadata.initialForce && metadata.initialForce.value) {
      // "0" or "1"
      if (parseInt(metadata.initialForce.value)) {
        return STATUS_IN_FORCE;
      } else {
        //  check the initial act
        if (metadata.initialDateValidity && metadata.initialDateValidity.value < today) {
          return STATUS_NO_LONGER_IN_FORCE;
        }
        return STATUS_NOT_IN_FORCE;
      }
    }
    return "";
  } else {
    if (metadata.force && parseInt(metadata.force.value)) {
      return STATUS_IN_FORCE;
    } else {
      // check current act
      if (metadata.dateForce && metadata.dateForce.value && String(metadata.dateForce.value).slice(0, 10) > today) {
        return STATUS_PENDING_IN_FORCE;
      } else {
        if (metadata.dateValidity && metadata.dateValidity.value < today) {
          return STATUS_NO_LONGER_IN_FORCE;
        } else {
          return STATUS_NOT_IN_FORCE;
        }
      }
    }
  }
}
function buildEliLabel(binding) {
  if (!binding || !binding.data || !binding.data.eli) {
    return "";
  }
  return "ELI: <a href=\"".concat(binding.data.eli.value, "\" target=\"_blank\">").concat(binding.data.eli.value, "</a>");
}
function buildTitleLabel(binding, defaultTitle, linkedDataId) {
  var title = binding && binding.data && binding.data.title ? String(binding.data.title.value).replace(/#/g, "<br>") : defaultTitle;
  if (lib/* R2L */.R.options.metadata) {
    // if there's a Linked Data id we can add state info
    if (linkedDataId && (!binding || !binding.data) && lib/* R2L */.R.ldm.getStatus() === manager/* SPARQL_STATUS_PENDING */.Nl) {
      title += "<br><div data-status=\"".concat(lib/* R2L */.R.ldm.getStatus(), "\" class=\"r2l-title-status\">\n            <div class=\"r2l-loading-bar-spinner spinner\">\n                    <div class=\"spinner-icon\"></div>\n                </div>\n            </div>");
    }
    if (linkedDataId && (!binding || binding.status === manager/* SPARQL_STATUS_ERROR */.WV)) {
      if (!binding && lib/* R2L */.R.ldm.getStatus() !== manager/* SPARQL_STATUS_PENDING */.Nl) {
        title += "<br><div data-status=\"info\" class=\"r2l-title-status\">" + (0,translations/* getTranslation */.sC)('ld.not.found', (0,manager/* getLinkedDataLanguage */.QT)()) + "</div>";
      }
      if (binding) {
        title += "<br><div data-status=\"error\" class=\"r2l-title-status\">" + (0,translations/* getTranslation */.sC)('ld.connection.failure', (0,manager/* getLinkedDataLanguage */.QT)()) + "</div>";
      }
    }
  }
  return title;
}

/**
 * Turns 2020-05-21 into 21/05/2020
 * @param {string} str 
 */
function toPrettyDate(str) {
  return (str || "").split("-").reverse().join("/");
}
// EXTERNAL MODULE: ./src/lib/settings/index.js
var settings = __webpack_require__(265);
// EXTERNAL MODULE: ./src/lib/utils/data.js
var data = __webpack_require__(13);
;// ./src/lib/ux/index.js








var TOOLTIP_CLASS = ".ref2link-tooltip";
function orderSorter(left, right) {
  // common rules always go last
  if (left.common && !right.common) {
    return 1;
  }
  if (!left.common && right.common) {
    return -1;
  }
  return left.order - right.order;
}
;
var alternativesUnion = function alternativesUnion(left, right) {
  var viewKeys = {},
    alternativeWalker = function alternativeWalker(_value) {
      var viewKey = [_value.match, _value.rule.type, _value.view].join('-----');
      if (viewKeys.hasOwnProperty(viewKey)) {
        return;
      }
      viewKeys[viewKey] = _value;
    };
  left.forEach(alternativeWalker);
  right.forEach(alternativeWalker);
  return jquery.$.map(viewKeys, function (alternative) {
    return alternative;
  }).sort(orderSorter);
};
var stopEvent = function stopEvent(ev) {
  ev.preventDefault();
  ev.stopPropagation();
  ev.stopImmediatePropagation();
  return false;
};
function resetTooltips() {
  //reinitialize tooltips
  (0,jquery.$)(lib/* R2L */.R.settings["class"]).data('tooltip', null);
  (0,jquery.$)(TOOLTIP_CLASS).remove();
}
function hideTooltipHandler(e) {
  (0,jquery.$)(document).find(TOOLTIP_CLASS).each(function (index, el) {
    (0,jquery.$)(el).removeAttr('data-state').hide();
  });
}
;
function repositionTooltipHandler($el, $tooltip) {
  var zIndex = 1,
    offset = $el.offset();
  $el.parents().each(function () {
    zIndex = Math.max(parseInt((0,jquery.$)(this).css('z-index').replace(/\D+/g, ''), 10) || 1, zIndex);
  });

  // find optimal position to place the element

  var scrollTop = (0,jquery.$)(window).scrollTop();
  var scrollLeft = (0,jquery.$)(window).scrollLeft();
  var distanceTop = offset.top - scrollTop;
  var distanceBottom = window.innerHeight - distanceTop + $el[0].offsetHeight;
  var distanceLeft = offset.left - scrollLeft;
  var distanceRight = window.innerWidth - distanceLeft;
  setTimeout(function () {
    // by default it goes towards the right of the page, starting at the same left offset
    var left = distanceLeft;
    // if no room we show it on the left part
    if ($tooltip.outerWidth() > distanceRight && $tooltip.outerWidth() <= distanceLeft) {
      left -= $tooltip.outerWidth() - $el.outerWidth();
    }
    var top = distanceTop + $el.outerHeight();
    var spacing = lib/* R2L */.R.viewOptions.bottomSpacing || 60;
    // by default it goes below the element, unless there is no room
    if ($tooltip.outerHeight() > distanceBottom - spacing && $tooltip.outerHeight() <= distanceTop) {
      top -= $tooltip.outerHeight() + $el.outerHeight();
    }
    $tooltip.css({
      zIndex: zIndex + 100,
      top: top,
      left: left,
      visibility: 'visible'
    });
  }, 1);
}
;
var positionHandler = function positionHandler() {
  (0,jquery.$)(TOOLTIP_CLASS).each(function () {
    var $tooltip = (0,jquery.$)(this),
      $el = $tooltip.data('ref2link');
    repositionTooltipHandler($el, $tooltip);
  });
};

/**
 * Rules with multiple CELEX attributes also have multiple linked-data bindings. This function will load an id on the fly if * another target has been selected.
 * @param {String} linkedDataId 
 * @param {String} linkedDataType
 * 
 * @return {Promise<Binding>} 
 */
function loadMetadata(linkedDataId, linkedDataType) {
  return new Promise(function (resolve, reject) {
    var currentBinding = linkedDataId ? lib/* R2L */.R.ldm.getMetadataById(linkedDataId) : null;

    // no support for other linked data types reloading other than CELEX
    if (linkedDataType !== manager/* LD_TYPE_CELEX */.wD || !lib/* R2L */.R.options.metadata || !lib/* R2L */.R.hasLinkedDataMode(settings/* LD_MODE_METADATA */.XS)) {
      resolve(currentBinding);
      return;
    }
    if (currentBinding) {
      resolve(currentBinding);
      return;
    } else {
      var linkedDataIds = (0,data/* extractLinkedDataIds */.Tc)([]);
      linkedDataIds[linkedDataType] = [linkedDataId];
      lib/* R2L */.R.ldm.fetch([], linkedDataIds).then(function (_) {
        console.debug("Done fetching metadata");
        resolve(lib/* R2L */.R.ldm.getMetadataById(linkedDataId));
      })["catch"](function (err) {
        resolve(null);
        console.error(err);
      });
    }
  });
}
function showTooltipHandler(ev, $target) {
  $target = $target || (0,jquery.$)(ev.target);
  var $tooltip;
  // min number of targets to use grouping. When disable we set the value very large
  var GROUP_TARGET_MIN = lib/* R2L */.R.viewOptions.useTargetGrouping ? 2 : 10000000;
  if ($target.attr('title')) {
    $target.data('_title', $target.attr('title'));
  }
  if (lib/* R2L */.R.options.tooltipTrigger === 'notooltip') {
    $target.attr('title', $target.data('_title'));
    return;
  }
  var $self = $target.closest(lib/* R2L */.R.settings["class"] + ', ' + TOOLTIP_CLASS).parents(lib/* R2L */.R.settings["class"] + ', ' + TOOLTIP_CLASS).last();
  if (!$self.length) {
    $self = $target.closest(lib/* R2L */.R.settings["class"] + ', ' + TOOLTIP_CLASS);
  }
  if ($self.is(TOOLTIP_CLASS)) {
    $self = $self.data('ref2link');
    $tooltip = $self.data('tooltip');
  }
  var ref2link = $self.getRef2linkMatch();
  if (!ref2link.alternatives) {
    return;
  }
  $tooltip = $self.data('tooltip');
  var alternatives = alternativesUnion(ref2link.alternatives, []);
  if (alternatives.length < 1 && 'view' == (lib/* R2L */.R.options.mode || lib/* R2L */.R.viewOptions.mode)) {
    return;
  }
  alternatives.sort(orderSorter);
  hideTooltipHandler();
  if ($tooltip && $tooltip.length && $tooltip[0] && $tooltip[0].ownerDocument.body.contains($tooltip[0])) {
    $target.removeAttr('title');
    $tooltip.attr('data-state', 'active');
    $tooltip.show();
    repositionTooltipHandler($self, $tooltip);
    return;
  }
  ref2link = Object.assign({}, ref2link);
  $tooltip = (0,jquery.$)((0,functions/* simpleParse */.q5)(lib/* R2L */.R.options.tooltip || lib/* R2L */.R.viewOptions.tooltip, ref2link));
  var $table = $tooltip.find('.table');
  var lastRule = null,
    lastMatch = null,
    renderedViews = [],
    hasRows = false;
  var attributesList = (0,functions/* extractOrderedAttributes */.EG)(ref2link.alternatives);
  var attributes = (0,functions/* buildAttributesData */.oY)(attributesList);
  var groups = {};

  // REFTOLINK-1974 get attributes from selected view (lazy-load)
  var currentViewAttributes = {};
  (0,jquery.$)($self[0].attributes).each(function (index, el) {
    // skip nulls, non-data attributes        
    if (el.nodeName.slice(0, 4) !== 'data') {
      return;
    }
    if (!el.value || el.value === "null") {
      return;
    }
    currentViewAttributes[el.nodeName] = el.value;
  });
  var currentViewLinkedDataId = (0,data/* extractLinkedDataId */.gq)(currentViewAttributes);
  var currentViewLinkedDataType = (0,data/* extractLinkedDataType */.LO)(currentViewAttributes);
  loadMetadata(currentViewLinkedDataId, currentViewLinkedDataType).then(function (globalBinding) {
    alternatives.forEach(function (_alternative) {
      if (_alternative.viewName === "table") {
        return;
      }
      var viewKey = [_alternative.rule.ruleLibelle, _alternative.view].join('-----');
      if (renderedViews.indexOf(viewKey) >= 0) {
        return;
      }
      var tpl,
        groupTpl,
        $row,
        $view = (0,jquery.$)(_alternative.view),
        $viewLink = $view.is(lib/* R2L */.R.settings.classSimple) ? $view : $view.find(lib/* R2L */.R.settings.classSimple);
      if (!lastMatch) {
        lastMatch = _alternative.reference;
      }
      var linkedDataId = (0,data/* extractLinkedDataId */.gq)(attributes);
      var renderedLinkedData = false;
      if (!globalBinding) {
        var binding = linkedDataId ? lib/* R2L */.R.ldm.getMetadataById(linkedDataId) : null;
        globalBinding = binding;
      } else {
        linkedDataId = currentViewLinkedDataId;
      }
      if (_alternative.rule.ruleLibelle !== lastRule) {
        tpl = lib/* R2L */.R.options.ruleHeading || lib/* R2L */.R.viewOptions.ruleHeading;
        if (!renderedLinkedData && globalBinding) {
          // make sure all data is sanitized and safe to be injected into the HTML
          $row = (0,jquery.$)((0,functions/* simpleParse */.q5)(tpl, {
            ruleLibelle: _alternative.rule.ruleLibelle,
            match: ref2link.reference,
            status: lib/* R2L */.R.ldm.getStatus(),
            forceStatus: buildForceStatus(globalBinding),
            forceLabel: buildForceLabel(globalBinding),
            title: buildTitleLabel(globalBinding, ref2link.reference, linkedDataId),
            date: buildDate(globalBinding),
            oj: buildOjLabel(globalBinding),
            eli: buildEliLabel(globalBinding)
          }));
          $table.append($row);
          renderedLinkedData = true;
        }
        lastRule = _alternative.rule.ruleLibelle;
      }
      tpl = lib/* R2L */.R.options.rule || lib/* R2L */.R.viewOptions.rule;
      groupTpl = lib/* R2L */.R.options.groupRule || lib/* R2L */.R.viewOptions.groupRule;
      var title = $viewLink.attr('title');
      var href = $viewLink.attr('href') || $viewLink.find("a").attr('href');
      var selfHref = $self.attr('href') || $self.find("a").attr('href');
      if (!title) {
        return;
      }
      var groupTitleWithPrefix = (0,functions/* getFullTitle */.AB)(title, _alternative.groupTarget);
      hasRows = _alternative;
      var counter = alternatives.filter(function (a) {
        return a.groupTarget === _alternative.groupTarget;
      }).length;
      $row = (0,jquery.$)((0,functions/* simpleParse */.q5)(tpl, {
        title: _alternative.groupTarget && counter < GROUP_TARGET_MIN ? groupTitleWithPrefix : title,
        href: href,
        group: _alternative.groupTarget && counter >= GROUP_TARGET_MIN ? _alternative.groupTarget : ""
      }));
      $row.data('alternative', _alternative);
      if (href === selfHref && $viewLink.html() === $self.html()) {
        if ($row.is('.active-indicator')) {
          $row.addClass('active').attr('title', 'Current link');
        }
      }
      if (_alternative.groupTarget && counter >= GROUP_TARGET_MIN) {
        if (!groups[_alternative.groupTarget]) {
          var $groupRow = (0,jquery.$)((0,functions/* simpleParse */.q5)(groupTpl, {
            title: _alternative.groupTarget
          }));
          $groupRow.attr("data-state", 0);
          $groupRow.click(function (e) {
            e.preventDefault();
            var $items = (0,jquery.$)("[data-group='" + _alternative.groupTarget + "']", $table);
            $items.toggle();
            $groupRow.attr("data-state", $items.css('display') === 'none' ? 0 : 1);
            return false;
          });
          $table.append($groupRow);
          // append fake row to expand/collapse grouped rows
          groups[_alternative.groupTarget] = true;
        }
        $row.css("display", "none");
      }
      $table.append($row);
      renderedViews.push(viewKey);
    });
    if ('edit' == (lib/* R2L */.R.options.mode || lib/* R2L */.R.viewOptions.mode)) {
      hasRows = true;
      var $row = (0,jquery.$)((0,functions/* simpleParse */.q5)(lib/* R2L */.R.options.rule, {
        title: 'No link',
        href: ''
      }));
      $row.attr('title', 'Remove link');
      $table.append($row.removeClass('active-indicator').attr('data-action', 'remove'));
    }
    if (!hasRows) {
      return;
    }
    $tooltip.on('click', '[data-action]', function (ev2) {
      var $this = (0,jquery.$)(this),
        $row = $this.closest('.row'),
        alternative = $row.length ? $row.data('alternative') : {},
        $view = alternative ? (0,jquery.$)(alternative.view) : (0,jquery.$)(''),
        $viewLink = $view.is(lib/* R2L */.R.settings.classSimple) ? $view : $view.find(lib/* R2L */.R.settings.classSimple),
        action = $this.attr('data-action');
      var href = $viewLink.attr('href') || $viewLink.find("a").attr('href');
      var selfHref = $self.attr('href') || $self.find("a").attr('href');
      switch (action) {
        case 'preview':
          if ($viewLink.length) {
            window.open(href);
          }
          break;
        case 'use':
          if ($view.length) {
            $self.setAlternative(alternative);
            $tooltip.remove();
            var id = $view.attr('id');
            setTimeout(function () {
              showTooltipHandler(null, (0,jquery.$)('#' + id));
            }, 1);
          }
          break;
        case 'default-preview':
          window.open(selfHref);
          break;
        case 'remove':
          $self.removeReference();
          break;
        case 'close':
          $tooltip.hide();
          break;
      }
      hideTooltipHandler();
      return stopEvent(ev2);
    });
    var uuid = 'r2l-tooltip-' + (0,functions/* getUuid */.YJ)();
    $target.attr('title', '').attr('aria-describedby', uuid);
    $tooltip.attr('id', uuid);
    repositionTooltipHandler($self, $tooltip);
    $tooltip.css('visibility', 'hidden');

    // make sure that only one element with this selector exist
    if ((0,jquery.$)(lib/* R2L */.R.settings.tooltipContainerSelector).length === 1) {
      (0,jquery.$)(lib/* R2L */.R.settings.tooltipContainerSelector).append($tooltip);
    } else {
      // Otherwhise insert in body
      (0,jquery.$)('body').append($tooltip);
    }
    $self.data('tooltip', $tooltip);
    $tooltip.data('tooltip', $tooltip);
    $tooltip.data('ref2link', $self);
    $tooltip.attr('data-state', 'active');

    // cleanup attributes
    var nodeAttributes = (0,functions/* cleanAttributes */.J1)(currentViewAttributes);
    nodeAttributes.tooltipUuid = uuid;

    // we need to pass the R2LOrderedNode in the event
    var nodes = lib/* R2L */.R.getNodes({
      0: ref2link
    });
    nodes = nodes.filter(function (node) {
      var filteredMatches = node.matches.filter(function (match) {
        return match.context === ref2link.context && match.match === ref2link.match;
      });
      return filteredMatches.length > 0;
    });
    var orderedNodes = lib/* R2L */.R.getOrderedNodes(nodes);
    if (orderedNodes.length > 0) {
      nodeAttributes.node = orderedNodes[0];
    }

    // overwrite linked data in case target has changed
    if (globalBinding && globalBinding.data && nodeAttributes.node && nodeAttributes.node.data) {
      if (nodeAttributes.node.data[0]) {
        nodeAttributes.node.data[0].metadata = globalBinding.data;
      }
      if (!nodeAttributes.node.data[0].celex && globalBinding.data.celexId) {
        nodeAttributes.node.data[0].celex = String(globalBinding.data.celexId.value).replace("celex:", "");
      }
      if (globalBinding.data.id && globalBinding.data.id.value.indexOf("celex:") === 0) {
        nodeAttributes.node.data[0].celex = globalBinding.data.id.value.replace("celex:", "");
      }
    }
    (0,jquery.$)(document).trigger('r2l.tooltip.create', nodeAttributes);
  });
}
;

/**
 * Get the table view (or the match text if no table view present)
 * @param {Object} ref2link
 * 
 * @return {String} 
 */
function getTableViewReference(ref2link) {
  var label = ref2link.reference;
  Object.keys(ref2link.views).forEach(function (_view) {
    var view = ref2link.views[_view];
    if (!view) {
      return;
    }
    if (String(_view) === "table") {
      label = view;
    }
  });
  return label;
}
function addStyle(styleText, styleName, $) {
  var styleFileName = styleName.split('/').pop() /** filename */.split('?').shift() /** strip query string */.replace('ref2link-', ''),
    /** ref2link version of some common packages */
    unMinifiedStyleFileName = styleFileName.replace('.min', '');
  /** attempt to see if the style is already loaded and if not so add the style to the page */
  if (!$('link[href*="' + styleFileName + '"]').length && !$('link[href*="' + unMinifiedStyleFileName + '"]').length && styleText) {
    $('head').append($('<style type="text/css"></style>').html(styleText));
  }
}
;
function getTriggers(R2L) {
  return {
    'mouseenter': {
      show: ['mouseenter', R2L.settings["class"] + ', ' + TOOLTIP_CLASS, showTooltipHandler],
      hide: ['mouseleave', R2L.settings["class"] + ', ' + TOOLTIP_CLASS, hideTooltipHandler]
    },
    'focus': {
      show: ['focus', R2L.settings["class"] + ', ' + TOOLTIP_CLASS, showTooltipHandler],
      hide: ['focusout', R2L.settings["class"] + ', ' + TOOLTIP_CLASS, hideTooltipHandler]
    },
    'notooltip': {
      show: null,
      hide: null
    }
  };
}
;

/**
 * Bind the tooltip events and API methods. Only to be used for browser integration.
 *  
 * @param {Object} R2L 
 */
function bindTooltips(R2L) {
  R2L.bindTooltips = function () {
    if (this.options.tooltipTrigger === 'notooltip' || this.tooltipInitialized) {
      return this;
    }
    this.tooltipInitialized = true;
    this.resetFilters();
    var cssMap = {};
    try {
      cssMap = JSON.parse(R2L.getConstant("R2L_CSS_MAP"));
    } catch (e) {
      console.error(e);
    }
    for (var cssIndex in cssMap) {
      addStyle(base64/* Base64 */.o.decode(cssMap[cssIndex]), cssIndex, jquery.$); // css injection
    }
    var trigger = this.triggers[this.options.tooltipTrigger || this.viewOptions.tooltipTrigger];
    var $selector = (0,jquery.$)(trigger.show[4] || trigger.selector || document);
    $selector.on.apply($selector, trigger.show);
    $selector.on.apply($selector, trigger.hide);

    // also bind accessibility triggers (focus)
    trigger = this.triggers['focus'];
    if (trigger) {
      $selector = (0,jquery.$)(trigger.show[4] || trigger.selector || document);
      $selector.on.apply($selector, trigger.show);
      $selector.on.apply($selector, trigger.hide);
    }
    (0,jquery.$)(window).off('resize', positionHandler).on('resize', positionHandler);
  };
  R2L.unbindTooltips = function () {
    var trigger = this.triggers[this.options.tooltipTrigger || this.viewOptions.tooltipTrigger];
    var $selector = (0,jquery.$)(trigger.show[4] || trigger.selector || document);
    $selector.off.apply($selector, trigger.show);
    $selector.off.apply($selector, trigger.hide);
    (0,jquery.$)(window).off('resize', positionHandler);
    this.tooltipInitialized = false;
  };
  R2L.bindTooltips();
}
;

/***/ }),

/***/ 265:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   IG: () => (/* binding */ viewOptions),
/* harmony export */   Mu: () => (/* binding */ TARGET_FORMAT_HTML),
/* harmony export */   Np: () => (/* binding */ LD_MODE_CHECK_EXISTS),
/* harmony export */   PR: () => (/* binding */ LD_ADVANCED_MODE_KM_CIS),
/* harmony export */   VN: () => (/* binding */ LD_ADVANCED_MODE_EUCASE_JOINED_JUDGEMENT),
/* harmony export */   W0: () => (/* binding */ settings),
/* harmony export */   XS: () => (/* binding */ LD_MODE_METADATA),
/* harmony export */   Zj: () => (/* binding */ LD_ADVANCED_MODE_SHORT_TITLES),
/* harmony export */   l7: () => (/* binding */ TARGET_FORMAT_PDF),
/* harmony export */   n_: () => (/* binding */ LD_ADVANCED_MODE_KM_HANDOC),
/* harmony export */   s5: () => (/* binding */ LD_ADVANCED_MODE_CORRECTIONS),
/* harmony export */   yg: () => (/* binding */ TARGET_FORMAT_XML),
/* harmony export */   z4: () => (/* binding */ LD_MODE_SEQ_NUMBER),
/* harmony export */   zP: () => (/* binding */ LD_MODE_ALL)
/* harmony export */ });
/* unused harmony exports SPARQL_OPTIMAL_MODE, SPARQL_FAST_MODE, SPARQL_SLOW_MODE, SPARQL_EXPERT_MODE */
/**
 * Pattern optimizers!
 */
var PATTERN_OPTIMIZERS = {
  /** 
   * Checks if other char codes than '32' have been used for space within the text.
   * If not, we can reduce the {{ non_breaking_space }} pattern to just `(?: )`
   * 
   * NOTE: The `searchSubpattern` must match the defined {{ non_breaking_space }} pattern. 
   * 
   * IMPORTANT! Do not modify the {{ non_breaking_space }} pattern definition without modifying the optimizer. If done so the optimizers will never be used. 
   */
  space: [{
    guardRegExp: /(?:[\u00a0\u202F]|(?:\x26(?:amp;)?nbsp;))/,
    searchSubpattern: "(?:[\\u00a0\\u202F ]|(?:(?:\\x26(?:amp;)?)nbsp;))",
    replaceSubpattern: "(?: )"
  }, {
    guardRegExp: /(?:[\u00a0\u202F]|(?:(?:\x26)amp;nbsp;))/,
    searchSubpattern: "(?:[\\u00a0\\u202F ]|(?:(?:\\x26(?:amp;)?)nbsp;))",
    replaceSubpattern: "(?: |(?:\\x26nbsp;))"
  }],
  quote: [{
    guardRegExp: /[\u02b9\u02bb\u02bf\u02c8\u02ca\u02cb\u02f4\u0384\u0374\u2018\u2019\u201b\u2032\u2035]/,
    searchSubpattern: "\\u02b9\\u02bb\\u02bf\\u02c8\\u02ca\\u02cb\\u02f4\\u0384\\u0374\\u2018\\u2019\\u201b\\u2032\\u2035",
    replaceSubpattern: ""
  }]
};

/**
 * Ref2Link settings are stored in this variable, also accessible via the API at `R2L.settings`;
 */
var settings = {
  /**
   * The constants are parameters loaded from a compiled rules JSON file. They contain the rule patterns, language and view options.
   */
  constants: {
    'R2L_RULE_MAP': '{"casesensitive":"c","converter":"cv","forced":"f","allowTitle":"at","customTitle":"ct","allowAttribute":"aa","guard-pattern":"gp","skip-pattern":"sp","strict-pattern":"stp","trim-pattern":"tp","item-pattern":"ip","itemForced":"g","itemType":"y","name":"n","base":"bs","order":"o","pattern":"p","ruleLibelle":"r","baseLibelle":"bl","type":"t","baseType":"bt","subtype":"st","views":"v","footnotes":"fo","prefix":"lp","skip":"lk","shared":"ls","slots":"sl","ld":"ld","coreIdentifiers":"cli","identifiers":"li","vars":"lv","commonRules":"cr","common":"cm"}',
    'R2L_VIEW_MAP': '{"condition":"x","ldCondition":"ldx","groupTarget":"gt","environments":"e","libelle":"l","order":"d","target":"a","baseTarget":"ba","template":"m","_default":"_"}',
    'R2L_VERSION': '1.3.30',
    'R2L_BUILD_INFO': 'master/c6981179',
    'R2L_CSS_MAP': '{"ref2link.css":"LnJlZjJsaW5rLXRvb2x0aXAgewogICAgcG9zaXRpb246IGZpeGVkOwogICAgZGlzcGxheTogYmxvY2s7CiAgICBiYWNrZ3JvdW5kOiB3aGl0ZTsKICAgIGJvcmRlcjogMXB4IHNvbGlkICNlZWU7CiAgICB2aXNpYmlsaXR5OiB2aXNpYmxlOwogICAgcGFkZGluZzogMnB4OwogICAgY29sb3I6ICMzMzM7CiAgICBmb250LXNpemU6IDEuMXJlbTsKICAgIGN1cnNvcjogZGVmYXVsdDsKICAgIG92ZXJmbG93OiBoaWRkZW47CiAgICBtaW4td2lkdGg6IDE4cmVtOwogICAgbWF4LXdpZHRoOiAzMHJlbTsKICAgIC13ZWJraXQtYm94LXNoYWRvdzogMTBweCAxMHB4IDVweCAtNXB4IHJnYmEoMjgsIDI4LCAyOCwgMC41KTsKICAgIC1tb3otYm94LXNoYWRvdzogMTBweCAxMHB4IDVweCAtNXB4IHJnYmEoMjgsIDI4LCAyOCwgMC41KTsKICAgIGJveC1zaGFkb3c6IDEwcHggMTBweCA1cHggLTVweCByZ2JhKDI4LCAyOCwgMjgsIDAuNSk7Cn0KCi5yZWYybGluay10b29sdGlwIC50YWJsZSB7CiAgICBtYXJnaW4tYm90dG9tOiAwcHg7CiAgICBmb250LXNpemU6IDEycHg7CiAgICB3aWR0aDogMTAwJTsKICAgIGJvcmRlci1jb2xsYXBzZTogY29sbGFwc2U7Cn0KCi5yZWYybGluay10b29sdGlwIC5hY3RpdmUgdGQgewogICAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQgIWltcG9ydGFudDsKfQoKLnJlZjJsaW5rLXRvb2x0aXAgLnRhYmxlIC5yb3cgewogICAgYm9yZGVyLXRvcDogMXB4IHNvbGlkICNDRkNGQ0Y7CiAgICBtYXJnaW46IDAgMCA0cHggMDsKICAgIGN1cnNvcjogcG9pbnRlcjsKfQoKLnJlZjJsaW5rLXRvb2x0aXAgLnRhYmxlIC5yb3c6Zmlyc3Qtb2YtdHlwZSB7CiAgICBib3JkZXItdG9wOiBub25lICFpbXBvcnRhbnQ7Cn0KCi5yZWYybGluay10b29sdGlwIC50YWJsZSAucm93OjpiZWZvcmUgewogICAgY29udGVudDogbm9uZSAhaW1wb3J0YW50Owp9CgoucmVmMmxpbmstdG9vbHRpcCAudGFibGUgLnJvdz4qIHsKICAgIG92ZXJmbG93OiBoaWRkZW47Cn0KCi5yZWYybGluay10b29sdGlwIC50YWJsZSAucm93PnRkIHsKICAgIGJvcmRlci10b3A6IG5vbmU7CiAgICBsaW5lLWhlaWdodDogMjBweDsKICAgIHBhZGRpbmctdG9wOiAuNzVyZW07CiAgICBwYWRkaW5nLWJvdHRvbTogLjc1cmVtOwp9CgoucmVmMmxpbmstdG9vbHRpcCAucm93IC5jb2wteHMtMiB7CiAgICB3aWR0aDogMjVweDsKICAgIHRleHQtYWxpZ246IGNlbnRlcjsKfQoKLnJlZjJsaW5rLXRvb2x0aXAgLnJvdyAuY29sLXhzLTEwIHsKICAgIHdpZHRoOiBjYWxjKDEwMCUgLSAyNXB4KTsKfQoKLnJlZjJsaW5rLXRvb2x0aXAgLnJvd1tkYXRhLXN0YXRlPSIwIl0gLnIybC10b2dnbGUtaWNvbi1jb250YWluZXI6YWZ0ZXIgewogICAgY29udGVudDogIlwyNUI2IjsKfQoKLnJlZjJsaW5rLXRvb2x0aXAgLnJvd1tkYXRhLXN0YXRlPSIxIl0gLnIybC10b2dnbGUtaWNvbi1jb250YWluZXI6YWZ0ZXIgewogICAgY29udGVudDogIlwyNUJDIjsKfQoKLnJlZjJsaW5rLXRvb2x0aXAgdHIucm93W2RhdGEtZ3JvdXBdOm5vdChbZGF0YS1ncm91cD0iIl0pIC5jb2wteHMtMTAgewogICAgcGFkZGluZy1sZWZ0OiAyNXB4ICFpbXBvcnRhbnQ7Cn0KCi5yZWYybGluay10b29sdGlwIC50YWJsZS1oZWFkZXIgewogICAgY3Vyc29yOiBoZWxwOwp9CgoucmVmMmxpbmstdG9vbHRpcCAuaGVhZGluZyB7CiAgICBjdXJzb3I6IGRlZmF1bHQ7Cn0KCi5yZWYybGluay10b29sdGlwIC50YWJsZS1oZWFkZXI6aG92ZXIgewogICAgYmFja2dyb3VuZC1jb2xvcjogaW5oZXJpdCAhaW1wb3J0YW50Owp9CgoucmVmMmxpbmstdG9vbHRpcCBpW2RhdGEtYWN0aW9uPXByZXZpZXddIHsKICAgIG1pbi13aWR0aDogMjBweDsKICAgIHRleHQtYWxpZ246IGNlbnRlcjsKICAgIGhlaWdodDogMS41cmVtOwp9CgoucmVmMmxpbmstdG9vbHRpcCAuY29sLWFjdGlvbnM+KiwKLnJlZjJsaW5rLXRvb2x0aXAgaVtkYXRhLWFjdGlvbj1wcmV2aWV3XSwKLnJlZjJsaW5rLXRvb2x0aXAgaVtkYXRhLWZsYWddIHsKICAgIGRpc3BsYXk6IG5vbmU7Cn0KCi5yZWYybGluay10b29sdGlwIC5hY3RpdmUtaW5kaWNhdG9yOmhvdmVyIGlbZGF0YS1hY3Rpb249cHJldmlld10sCi5yZWYybGluay10b29sdGlwIC5hY3RpdmUgLmNvbC1hY3Rpb25zPi5ybC1saW5rLAoucmVmMmxpbmstdG9vbHRpcCAuYWN0aXZlLWluZGljYXRvcjpob3ZlciAuY29sLWFjdGlvbnM+LnJsLWxpbmssCi5yZWYybGluay10b29sdGlwIC5hY3RpdmUgW2RhdGEtZmxhZz1hY3RpdmVdIHsKICAgIGRpc3BsYXk6IGJsb2NrOwp9CgoucmVmMmxpbmstdG9vbHRpcCAuYWN0aXZlLWluZGljYXRvcjpob3ZlciBpW2RhdGEtYWN0aW9uPXByZXZpZXddIHsKICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTsKICAgIHJpZ2h0OiAwOwogICAgdG9wOiAwOwp9CgoucmVmMmxpbmstdG9vbHRpcCAudGFibGUrLnJlZjJsaW5rLXRvb2x0aXAgLnRhYmxlOmJlZm9yZSB7CiAgICBkaXNwbGF5OiBibG9jazsKICAgIGhlaWdodDogMTVweDsKICAgIGNvbnRlbnQ6ICIgIjsKICAgIGNsZWFyOiBib3RoOwp9CgovKiBMaW5rZWQgZGF0YSBDU1MgKi8KLnJlZjJsaW5rLXRvb2x0aXAgLmJpZyB7CiAgICBmb250LXNpemU6IDEzcHg7CiAgICBmb250LXdlaWdodDogNDAwOwogICAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkICNDRkNGQ0Y7Cn0KCi5yZWYybGluay10b29sdGlwIC5iaWc+dGQgewogICAgcGFkZGluZzogLjVyZW07Cn0KCi5yZWYybGluay10b29sdGlwIC5yMmwtdGl0bGUsCi5yZWYybGluay10b29sdGlwIC5yMmwtZm9yY2UgewogICAgd2hpdGUtc3BhY2U6IHByZS13cmFwOwp9CgoucmVmMmxpbmstdG9vbHRpcCAucjJsLWVsaSB7CiAgICBtYXJnaW4tdG9wOiA1cHg7Cn0KCi5yZWYybGluay10b29sdGlwIC5yMmwtZm9yY2VbZGF0YS1zdGF0dXM9JyddIHsKICAgIGRpc3BsYXk6IG5vbmU7Cn0KCi5yZWYybGluay10b29sdGlwIC5yMmwtZm9yY2UgLmJ1bGxldCB7CiAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2sgIWltcG9ydGFudDsKICAgIHdpZHRoOiAxMHB4OwogICAgaGVpZ2h0OiAxMHB4OwogICAgYm9yZGVyLXJhZGl1czogNTAlOwp9CgoucmVmMmxpbmstdG9vbHRpcCAucjJsLWZvcmNlIC5idWxsZXQ6YWZ0ZXIgewogICAgbWFyZ2luLWxlZnQ6IDVweDsKfQoKLnJlZjJsaW5rLXRvb2x0aXAgLnIybC1mb3JjZVtkYXRhLXN0YXR1cz1wZW5kaW5naW5mb3JjZV0gLmJ1bGxldCB7CiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjRURDQjA5Owp9CgoucmVmMmxpbmstdG9vbHRpcCAucjJsLWZvcmNlW2RhdGEtc3RhdHVzPWluZm9yY2VdIC5idWxsZXQgewogICAgYmFja2dyb3VuZC1jb2xvcjogIzYyOGU1NzsKfQoKLnJlZjJsaW5rLXRvb2x0aXAgLnIybC1mb3JjZVtkYXRhLXN0YXR1cz1ub3RpbmZvcmNlXSAuYnVsbGV0IHsKICAgIGJhY2tncm91bmQtY29sb3I6ICNDRkNGQ0Y7Cn0KCi5yZWYybGluay10b29sdGlwIC5yMmwtZm9yY2VbZGF0YS1zdGF0dXM9bm9sb25nZXJpbmZvcmNlXSAuYnVsbGV0IHsKICAgIGJhY2tncm91bmQtY29sb3I6ICNkYTIxMzA7Cn0KCi8qIHRpdGxlIHN0YXR1cyBDU1MgKi8KLnJlZjJsaW5rLXRvb2x0aXAgLnIybC10aXRsZS1zdGF0dXNbZGF0YS1zdGF0dXM9ZXJyb3JdIHsKICAgIGNvbG9yOiAjZGEyMTMwOwogICAgbWFyZ2luLXRvcDogNXB4Owp9CgoucmVmMmxpbmstdG9vbHRpcCAucjJsLXRpdGxlLXN0YXR1c1tkYXRhLXN0YXR1cz1wZW5kaW5nXSB7CiAgICBoZWlnaHQ6IDM1cHg7Cn0KCi5yZWYybGluay10b29sdGlwIC5yMmwtdGl0bGUtc3RhdHVzW2RhdGEtc3RhdHVzPWluZm9dIHsKICAgIG1hcmdpbi10b3A6IDVweDsKICAgIG9wYWNpdHk6IDAuNTsKfQoKLnIybC1sb2FkaW5nLWJhci1zcGlubmVyLnNwaW5uZXIgewogICAgd2lkdGg6IDIwcHg7CiAgICBoZWlnaHQ6IDIwcHg7CiAgICBtYXJnaW4tbGVmdDogLTM1cHg7CiAgICBkaXNwbGF5OiBpbmxpbmUtZmxleDsKICAgIGFuaW1hdGlvbjogbG9hZGluZy1iYXItc3Bpbm5lciA0MDBtcyBsaW5lYXIgaW5maW5pdGU7Cn0KCi5yMmwtbG9hZGluZy1iYXItc3Bpbm5lci5zcGlubmVyIC5zcGlubmVyLWljb24gewogICAgd2lkdGg6IDIwcHg7CiAgICBoZWlnaHQ6IDIwcHg7CiAgICBib3JkZXI6IHNvbGlkIDFweCB0cmFuc3BhcmVudDsKICAgIGJvcmRlci10b3AtY29sb3I6ICMwMDQ0OTQgIWltcG9ydGFudDsKICAgIGJvcmRlci1sZWZ0LWNvbG9yOiAjMDA0NDk0ICFpbXBvcnRhbnQ7CiAgICBib3JkZXItcmFkaXVzOiA1MCU7Cn0KCkBrZXlmcmFtZXMgbG9hZGluZy1iYXItc3Bpbm5lciB7CiAgICAwJSB7CiAgICAgICAgdHJhbnNmb3JtOiByb3RhdGUoMGRlZyk7CiAgICB9CgogICAgMTAwJSB7CiAgICAgICAgdHJhbnNmb3JtOiByb3RhdGUoMzYwZGVnKTsKICAgIH0KfQ=="}',
    'R2L_VIEW_OPTIONS': '{ "viewUsesTarget": true, "viewTitleSuffix": "", "viewTitlePrefix": "to", "linkClassName": "" }',
    'R2L_NAMED_PATTERNS': 'W10=',
    'R2L_TYPED_RULES': 'NobwRAxmBcAMA0kBuMBmBDANgZwKaNRgTHQBcZSAnAV30nOgxzvXQproHMAHGMMRNl7R+g0sNFhxfAWACWE2ZyKIAnjMQA7PpoD2mOZoDWsgEbYd+wycS6VYCQAoA/NADkIAMwBfRy+jAAHpuADohlGGaYUgAugA+/m4uALz+QW7xSc7J6TEAlAUFAFTOeR4+ebKUfAAWcgAmuAAEBsZmmBpSlq02YKYMYHo9sigB4AAefKjUmhCkcrqajnlNIE2UuKTUlJpNAIxNyUf7ANxN3k2ymPWT0JrUmJiInAz3j4i4MMBgRWAxiB0RLJ6vY2CIhtYzGDBlY2ogALZTGZzBZLFZrDZbHZNNxNAA8QnQu0o+lwAFoeskQmBYNSAHy4gDUTXQlE41HhuE0pGwwD2MSazLceIA9ITNHScWcLrIAPpoLB4bz/MCoOwBFWYYRvJ5gTAmO4PXU4GA6wSAvYAkEaxAQAymo0AuQO9560ZmyDVG2QRFwbzwcBQOC20ZMPAEUEMMN0OYK5iIVjsWjPJz+fymba4dDUNOuYBhaiwWDoWkhagAJlg5YAYk14rnoGFxuWAGz+dDw7gnPKlTTmLsFRl5Bv1YDoXC6GLATSUbAxZxxJC6afw+IAL22eQSrlINVwcV0qAbaQLRZLBcrNbr2+g/ibrfbne7vf73byQ93/n3cmwcTIBVKG9/AAA7ieo0nHah6zzNwAAMABaAESACTT3LUwAE40NMUxsNQNCIAADgI9ACNwssq1QAAWU9PEImiKM8AB2BiK1gPZiLLSs9iwrj2PItjPHLC9YE8ABWaDGxCZs21cDsB1KdBuF0bA32wUpjzzU9i1LNir0ku9pIfOSnx7PI+yEN8h0wdsb2AOCkNQij0N4wt0IEqtTHw5yiJIsi0Oo2j6NoliRI4sLXO4gTKyEkTxMk+9ZOgeTnzyJSVLfG8IFwfxSDiUhcDMns4kwMdcBidSCgbfMKJ0kT9KA1xEsfBTzNfQcAPbahsGwCAam6vBf38CBdHheFnDkUhSGcYBcAAS5iXBSmHVwT1q88+IahtmpM1qLIHd8VtvVxR3HSdp1nedF2XTRVziDdKC3XK9wPI9VvegJtI2vTawMpqjKSlKzP2qy8k/Vxv1/f8zMa6BQPAvNIMk+yEJQ7DXM8jz0O8tzfJ80ifKxwLGOCxjQr48KKci/i4uEvj4pvHbktMxTlNUgpKs0z71t0y9fthpmgZfSyOpsuS7IctHnMw7Csa8gjONxgncaJ1jRNJwtmNY7jFe46m9mi0S6cEiTGYBlrUvS9mntcbLcvywrloXUrxwq5bqq+3mq357bzd21KQY6yhZoWzhUS/TQe3UrmasLOrNp9j7BZZtqRcO9NM2zACClkIROmwaQgUQQvJAUTplGDMB1CLwY+AAYVG+FJoK5pDyaXdmgAJVwMPFmwJoABFcAgH9UTMCwRAbsbm9wVvUHbvcmm73vNH7oeR+wMfbBgPYi2IJxVq5jMNmzD2efqxPjqkmSLeB9r04+06JynGc5wXJcV3XTcbw716Y89i+15fY339nfNOH4ahfjiD+P8pBs6w3hhBXAUEJaoycm5GW0s5Y4yrHjJW/lnLE01hrUS5M2KU3IfrQ2sV6am0MiA5mrUrZqQ0h9Nacdvp8yAUnP2jCA732srZNIkt0GeQxu5PCCs/KEwCmrOiciyE6wimFahxsYp0P+gwoWaU2aZWGjlHcDsirOzKm7KqH1Y5ni9ltHhWiU6B0Oj2LqPU+oDVwENW2jcJpTRmvNRa7sLEAITtwq+yc9oCKOv4J+51X5XQ/rdL+j0f4vUPP/c+wS/rX2MnwsBB0IFQJgdDQCDZEGI2QcjER6NZaSJ8orXBytcGqyCgo7W7FdbsSobTOKGismAxTswjmrCr7sKsYAzJYT+HgLyGLZKqDHJVKwTU3GdTywQAaasppJMWlhXaTxFRXTaEJV4dogZNtoB20MQVYxJVTGVUiVpdJP0Qn0OydohxQ5g5+JXhHKOzg0kcOsZfF5fTwlTIzifag2cz4ArGQLY59iIkxzJIAdaBAAIBIARAJABIBIAZAJAAoBIAVAJADCBIAJCJAB4JOi2qexyp5BAJacs3h7ncxhRkuFdjQV5M6lEkOMQN6onUjeUw7i+qlWoAAH4qtgL82Bipch5H1XADQZicCWpoZajLLHxyeeM+F7LQYxwAHKaBiNC0ZLLgGvIRVMmauhKDzmjhYgADQALoAFWAC2gQAUMCAByGQADgSAAwiSSeIwgAHcgh0hiCUOkeRdD+CDSEbAIAED0pFGEBNSbvBjjJGuGIjJnBRrOWEAAdNndVQStWsotbqjqTiwj1FpfAMSDK0iFpFJk4AKKMU4oJSS8llLqX1vpVVBsgQ4hhFMHEAAJEdSswBYBknLFOOdGF8j+BHWOydBRYZrpCOOqd/geLADEmSZds7j0rtcNu3dhQzl+BOty3lfcFzpiFTUEV4qepSpldyXqe5FWaGVc4VVhQTWaq4dqtlkyOUGqNSBzh3tnmaMrZB0G1rbXOHtVfYAzr3Xev9YGkNYaI15ujbG1Nib4DJrI+mzN2bc35rNsWoqsHAUId6bfYWHKa0hDrZaRtR1gAtrbR2rFeKiVkopXHKl+QB0MuHMO0dO6N3+BnXOhdp7l1HUvRum9F6FNXv3RhQ9Z71PnugFpqd5jMNlrAxWkFyGOojjKjEy678bp3Qemc3+qS2EPOZeW81dncmg3BtASGsD4ElLAkglBwi0ELIwdgqR+MCFuSIerbZFNdmdPpmo0SPSJlmVOZzHzTLTX+dsUhoLoshEwTi9LcROElm4JWWslLlE5EkK1js5RFNVHdKORBwrujN36Ptlcp2NzXZ3OY7CgL7HU5QY+sfLMOZAmPJs3N0BHG9WPycy/Fz11P73W/s9fc3nhm+bKxtirgXtsdRC2FopOm4ZRbKTF2r8z6vVOljg1ZLX1kQE2cQjL5Csv7Jy/1s2g3WYZUGYykZoH4Pgcq3dw6Mz0BzKlhghriXanSJVrI5pIVWkUL1uDwSuWGbAvm6crKBjoB5XGwBSb5Vptrb89d0JOr7OOL+XJAarieruKyl45uviFpLUswjuDNiufQ4Wztq+0T9tv0Owk47STTt/xKxqmXQLEO3YV/dyBENoFQzgTDSLCMAhI0x6Ily32MG/bwfUtr5Y0vyOJ91qm5OYqU/y9zobsO8jFYu6VxHsvqdbaN2jmrARKlfcWT9pL+CZGEI6yDpRPvesHJNgNlHOjg907G47ZnLtWcBKs+tpHtn5vvLyJ80O4cIaR3Q3zsPuuWPI8N/X8FK2S050QF6MAU8m5TVnk0NuHcl49z5YPYeo9FjtE6AMEa09x+4ELRsFe2BC2NCgIgfofA19j5blv2ffc9/DxGF8CYSJZjzEWMsVYmJti7CoLQE43grg3D4NcMk6AKISAnwzwrwjoYAnwAQPwfwAInQ1ou8RYCYfAyClAmAuA4whaJ+M8m+++mBuAaBkwh+0IKBBBmBjc2BV+EAeBBBsgvoqoyIj+aIqw6wmwb+OIeI6A7ck0aBVIYAAAogAKqdxkgAAy6BOIgoTQwalASkjg8IDw8wIhRInAAAktgLoOWI4KyOyJyN+rOvkPADiI4G4IYW4GUCsEKNSE0PUGQOgGSBsKgGSNlAQbwZ4EyCyJoKoFoWyByLKryFRP8E0I4CyD4boTyMAExAKAUJIR4GsCIQPNAHXHwSISIQAIKdzQADx8F1zQD6oCEACyAAQnwRkUkSIXwQABrnDeBWE2GkB2EOFkh6C8HuFEheHaG+F6GeCBHBEdFhG8gthREWE4i1G2H2G4COGqBZiUAtGSFtHeE6F+HAABGGG9GhFLGRFNDRGWFgDWFjGNHZi7g2oUjoCCqYC8Gj7YGT7zzT7Lx8qjH1HjGOGHE1A2q8E1BTTcDQAigijcDUCmAGBrKMG74oG6DcDoCFrIIigbDqHbDZQigvE2qTSqAigjSUDKQyEFRkimC6D1Aol1wADyncVhNQDh7xnx2A3xIoKBFI6BkJ2wYJEJUJaBnAWAThiwBU3IIo7h8hmAihyhahGhBJlASh/6gpmhfRSxsA+QMRIoAAKhUXKe4RsPCLIfUWyJsNWDaqqaQAsZ0eEdKXkIYfZCKIWoyNyYESaRkMMW4O4dQNwNwLgJQI4OqcqqQFqZQDqXqf0fodsTiCKM4NsHIMkGUZUdAG4XMZ4d6UsSsUESEYsXoZsX6bEU0PEYkckWkRkVkTkXkUUSUemeUVUd4DUWAAyHMesXodKTEaKOgAyNKJcIgPKIwIqLgP6HfiINMA/uHOiK/tiB/rgF/j/rcB6C8C6LqJAd8L8JqHATvEWJaCQHwPUQCSAX0NCEuWgbQffiiE/uiCwViLsG4JcRvtcQvM0NvnPvvovrsHoBIcyPMZKV0T0fGfqQMUMbKa0VGQ+eEbGWsQmeEUmTaW4PWXKHGEqCqGqF8JqNqOAfqGOQCBPB6NgBaFaF8GAGmWUZmZkdkbkQUcUaUckZUTAZAPaIaK6CRR6JgO6OARAF6MACqBAL6LAG2ZAPYBAKGC2RGJXGQKBTGFGBxSQGCP2SmHwLelfHwXwakTNmajdnXhEgAFIEkqH6pylSXlZy4F716En5H5EqFylyniVnIADifB+RfBSlAAyqkaZfqqpZzlHjkqjkOHwQAOqdzVTCZdpia9qSb9p0oMqpECHmXmV1wAASgV5lfB5lZyWlulwAfBAAk8auzldjXptg5THkODpYqXwbZalTJdHvXlkblZHgbrJVMiIbFp9tjo7p5M7v9m7h7p1oom0j1uQn1oclDgXgMuJXwYULnIoGIANVIENWXDXBXMQNXJINoCIOJakU0HJboIYKQE0EeS3PPg+toIfhPPwRJfNYtdyCteQceevFebIOqAgfvCJYfCVqJaOH4htfys+j+m+hKp+guH4fKn+gBkBlLpdhHvrmxgVYirtmdCrnEm5okp5ikm9B3tZnlepT3hEg9mbuFpbh9KUjbuUnbvFpjE1n9vjo0oTlsl7plq1VFLnuovnobkVkMsVQDQVo5dMnHijFVWIjVdjCnq7mnqlhniTaDmTTTBDh1fZScsNmchcgzkYhNuXmYqWtXiVYDelb3h9LNXTaxgzRlXkApUpSpclf9erYHozVpTpXpQZTeMZaZRZVZXwTZXrXrgbfLvXi5W5RYh5aJj2hJnOb5RRv5eFaFeFZFdFQSSbXFYlWrd3mVRyllfpeHbXkDVMkVXbV3nHUrREhVR9ljmzUnk7pzasgDkDulnzVnpQr7kbJDiLf0sNj1YULDP4KrUnbNvlanVMtrcpbHWlW8hEsbbpfpb1ebSZWZfqpZdZe3U3Z3VMs7e5WiiJt2uJn2tJn5XkAFUFf7UFYHTeDFXKaHUlVXhzvDRXVWodNHTlQ3dJQjZHaDInbvSlQrRrfXunfHnVtVdnbVbna1tze1kTmTCTmDjnkLXnp1dTVXQZXLXvbfYbZrbdfeleY9a4IKs9cAGKq9RDNKu9d+p9fUEqiqmqr9eHvbRHfHYth3oajvdLsnR3Zahyqhnau3mkNhp6r6gGjeHGqGoEOGpGiRq4HGmmj7SmvGuRvSjRjmsRgWiEIxpXmQ43efYQ6DFxjxg2k2nmIJrDO2tPZ5R7fPTSovXJh9OZtOrAKempkuqZno89nowZkZiesY5pnptptelUHwLNXtUtYdevmtSdZvEvofoCJIAMLPBCfvmYH41mJQTfmMGALcPQV2TuS/qwX2RwIOVaJE//oAfMMAUoGAa6BOdAdOTXPAXvEgSICQXSf44WgAFb7WkBkFuOzyUGQn2hEHIHbCkGlMVNLXVOn61O4H4HOgIhbmMHP4YhxMHkcFcGkA8HUiCHCFiHjAPENETFOH4HoG8HlitEVnhESQxEDwgBxEJEYXpFYU5m4X5mhlFkll7GPGNHNHUhrN/n+ECg7EXPzOTHTGzF3nrO8ibOPN1HPMAHUBHGUAnFnG8ELUuOrWzxzNPF/MAvkniBUl/EAlyBAl8r0kkjgn0nQnuK6Bwm4AIn/OvGUDImok2oYlkDkg4l4kih1z5FymyhZWyizWdwSUklknUgfFws/E/OouMkYs9Mij77cnll3OHoPP+k7Opl7MZkHPZk4V5kZHJEqHVHuGYC6DBpOmOCYACnqGpGeDOWTQ1Aelelfm8iGk2n0i3Mvn6HVkIl1nnANlgBNnRjMWROdnblMEgC9nv4JPf5JNwVgCjmkXjmoVTmwF5OznsSFNSCnEbmNMiDrkrl0GusDO7mes4hOOgsHXgvNCXmePXm6C3nPk+kBHvlCuWtfM4hAV2sgXNnMDKgEDqh0UAjQVkUGgUUIXgFIU7woVQHoVStZnYW5l4UFmEWIC9spHSsDvHPysiEqFEV2jOiBtOh+uUV+s0WoXFMYG8nzBzuMXMVBjEBsU8WcXEDcU1vhj0BHsCVJhcBDV5w1wFxDUlyyCjWSDjVqCdDTX8ECHXGoBItyBYBNAVNv5YDjyOPfuHi/sjwAdAc7AgfbzQAXWICpgfQElyVxAKX+ACG9VPquCpHwg8gAlkA8gLipGFGYBFojYlYQd/tYCj3SPN0coweaBYBnJMe0en1qUH085DjUcjz4FnJ4cEeatTRs5h6SNn1cdVYPxK57YXSq7xLuYnY7jQ3/I3300QP17I2FIW7FLo2vaY3vaP2s0O4v0c147JYf3u683f3e4l1/0U7l2lXR403w5/X4Mp3j0cro7Y2J4JZ40u550NXWeazNWk4dKl00IAOScw7WzF6XKl7FQy13JOI65w3gOO3A1iUCFxBYfPZfgMncBfhEhxDcpcj+CaCOwlfoAAAnMQP48qgGEjbn5DY9lDiuMwqIlHV8HXiwoDanDtGlmXoJ3ApXSwrgFXRU16le8AKXsN8t6nGXUyKjbts93lXtC9PtuDXM1UJDdH0Xmt1Dbe1U9DuGTDpGIQrD7DxGMaXDVGvDd3gjdhtGIjDGJae3TnDHsjtDdccQgAhCBxAiF9f60EOfcdSlC0OpfzcDeI1Wrbd3qg1yfg1HYebJJnYw3veK2efBYm6hYo1PYIL6dlSGcs2Z0md+fJ7mep4E7p5f0hc/0C0GwU15ZU005i2h4Y930RLeeVWk+YLk852U9c3U8820+kL0/Z5tVM9U4fei1F6jbxfXJJfLSwykA3dzdgMLeDdTIdxo0vbZjjC6fQCmD+AwIKrXoc8acRJNd4Mtf0dY/Vp/K1r1oVC+zFoQ829SP7f15/LACpFmWAAIIIAInA56AAhDRqkWSAAFrWOzeGRu/+Azex+Q8a/Q8X1g++wih5fNee8y9tfp83Xw/PyI+ubI9KcM4qfJ/9cg/2+HRafm4RZ6fW5E8VJP1Z38+v2C+BeWeNWZ4tUS/k3/2U2AOs/B7s8cd2W5+H2CLiw8/258+40U/LIE0bJE3A5F1992eS+D/M/D/Odi1xeS1M6Je3LK8Niq+qfA8ed5+197i6+gT6+G/G+uCm9yDm/j/72T/cdFQ3iJ/Pad45+Y9r+Q4JPlJGAB/J5M66PdK4BUzzpF0Z6GxpAK66rpbGUAhDoZiPRWN4ByAxAQUDCDzgY4yjKep2ndpz0fKG3QdH/zS6a8YenGLmOY1cB7BZ0ewBdHEFgAzRrG2AxTBZlhhlMiQ/gJAHICdJxBqArIVQKf1cCoBuU/AwlkINMA0BRB4g6APCDHC1dnSeYbANmjiB9Quu6AYANwFiCEtMAZyVUsADkCqB8gN4MpqtmgCGA4gmgUwdSlY4PB/ABgTYCVzMH5Azk6AfwMuGoAABvmIHlGoDsgC4XXPANwAKjwgn+oWSgHEA2BddlwEAIwIEN0DRChB8Qs5HoGAJRCvwsQjITeDuoLRgAEAbNLgByEQw8hhUYDBYkIGu01GJAtbuxG9oUCVGVA1PjI2rQQCuBR0NgXyDPQldmBMQWtHEE8BMCTGKAyzAJlbTLd6hq3T2k0PIGyZFBcPD3hJ0/5Schw7vRzAj1iQl91cKPLXOdgt6LcOUdfVGobxAiE9bcs/HGhIkX7NZl+gOVfoXRs6k1++gtBzsLXWExcWErnVYZx2+Ga1ueGdOfjjn871Vu+wXMXrZzJz2c/cjnQAUwn37y9D+CXExFNmWE7g1exwrXqcNv6G97+1AA3mcmiEv83+19S/hQyn7GIcRNAlDFEgq60i0+vOLofplcC9C9g/QvkAumGGjD2I4wnAUWnd5TChMswryvMKkxaNNulAqHtXyAFbddGEw/dEwJYG9COBumQUWIwuGuBeBY3aAAIKEEiDKAYgrrpIL8TSDBBsQuQUaJNHGCVBMQNQQEA0HxBtBXgvQQYLkBGCbwJgjwU4JN6aA7BDgzwZYOcGuBXBeUUweYJ0E+DEGAQoISEItw3hwhkQtIZUISHFDkhqvVMXEKqE3gshZQ7MfkK5R+JihpQ8oTEJzHkjm00wogTPXFGaMZMSA7PmsMRFf8AIYQMAaJVZFKZoBBjVTHAI0ycCr0ZjJUQwPQHGZ1RZmCYU2Kvj0CAgxjEAIOiHHaYXAIfFYao2IFzCGxi9H/mcmgBnJuwr3GUSnzlHUj3wDYcEsqn5QOl28FHQ3uZQVQFQ4g5lOPtULDwUdDIlmRPnCmLT+A9EPCX8f9EsyFoSgjiQoHgK2HNiARrYjYbN0ADMIAPjNidi6Bo46ADAKMZYCNR3QkcYgIsYYCBxAo7CThO6FpAFxS4rCcOLyAQSkUYojRmQKlGDpdxN4fcTeEPGviaU6aJkR0PTg/d/ugPLiaD0OiO9uMzvJtL7wD7B8mMBfKSPH1cCJ9hRbQ08V/3d5LgjBr4gSTXyHCOA+hGEOwjUE8G00AJs3eSRpPlErCduMGd/ul1xEoZgANqGhsd1dQMM8MzDAjGwyIxRo1e3DARt4D4Y8NHuWaYRvRnYnW9/+LYznlahAHmNa0jIdAEMgLglcZwMQeoHECdKzdTGR0O8aZOpEXj0AV4hcDeNfH3jHx+4F8f9EYwzj/Al49xAVO4C3ixGuvB8ZNFKnsSQBWUqydQOZHADIJmGXbh1PaGCTNhdktDBhjoZOTTu+GC7oRg4ZeSHuvkuaUIzoxdcKOUkike5ypHKSopSomKXFKOgJSLoyU1KY9HbwZSL+601rtSOFErd6x9ExsdlOUkxTJurvWbiKJmGbibp63BibJn8BiRgA5YfoS2FPSRFGUH4/qUpNgm5T8pcQQqeVMaklTnxrUsyODzy68SAefwjcXWLomfTGxTE/wCxL/GiNGMPk+6RDNWh1wqJIQTPuAMVG4TexhjAiQgOwlbpUJB6fCSZkZmUSwgIoRwI9IbAzcFJsoq/jlJOiMiwZQstse73MYciuRgw3kWMI5kridc10rGQsK+lnIZuzEg8YTNwbmNGB7EVUewMwlTicBNE96SrMlE4yE+e4rWUeK7E0ySJdM/sezOXHcDuxqA1mROKNkZTmZtM+cWekXGKNjZREybpUCHxgcf2NHTAIB2xawcOg3jcObx3/ZRy2OccroEU2aZ0lE5WAWUCnKCZNNUCmcspmE1AARN+m3ZZgqmxaBcgXgkCY1tyJlKSEq5/6T8HXL2DdEVgTQSULACaAAAyHuU0Cbk1zoyehBdB3OZCDyW5HzYAIRAblHBkgTQWAMBV9YiBnCmrQFugR/A8gyQugIuaAT9bZMQ2eoGcghwKYLl05BcjAjvMLSCo1QGwFsIRChD5zSCO8zch2QYLlyhm+5dgpwXmDjNcAvBKZqIXQKQtGiO83gjvOgAKUAACrKA/LtEp5EkVYoWyWKDEtiSCuuQBRiKwLJC4JcCLKEaAYAFCw88It0XQVTzl0WxI0gvMMKeAbSsoYkrsR+ZQsgyeASgEgF4KodC0UC9wvgomLZg+SjgDYNwE1Z2whFIinKPaUdLOleFhCgRXXJ/LIK9Cu8IYlQrcAih/e3JUwqkTMKmERQgfTRTiG0WqLYFNpQtDwoIX8LdSMiyxcQs+ZPk65qCgoGQuFaYKhQZinBegDwUWKiFdc0hXGTrkUKnF1CpoLQpiKFp2I7i5kLgscDWKfFU8wYc4stZtyhihhBAE0CoimKIl1YTuKkUhYQc8ApAMkNVLeZNBYlci+JQukSU+lkllCmIiywmKwtuAlJH4jSRaYFcmS1AEUCyTZIjRuQsqQVsyC3ZyBRSqhdQuWGFIjLxSti30rKQVJKlJCKpNUtoU1LakyA0yw0saTUVmkLSmyi0oBUkKSL1WrpFZZ6TWV1zTWspQMoS2SAsKnSSAaAJwu4WSEylupMRYARyhvK7Yhy6Rd4vKXCsFFrcqsoUF0UaKTChinRf6X0Vgq3ARi0wiYrCXmK+FRCl5dMsQX+Kp5jiqhb+UtauKcQkSpoNEpRW+L7F5ClJcEtCVuKIl7hQlb8t1KtzKl6K4VjUqCVpKMlYSrJTkvNaltqlorYUDa0rYyhGyPFZ1mXJiafy2CE82uRUobnjy0CzcqVUyvbkDyu5vc/uZKumWjyB5sq6uZPOFYzyO5XcpeXqF/wrz8Ca8skBvILjYBt5u8/1pkyDZQFD5PjYEOG3nLEEM5l821aYHdUXzC0L8vpm/Oibus9ybBYUD/O4L/zJmQhIBbM0YVjF8lmwIpXlMjVgBEVsiuldKqqVLFmVZrONZcwWZgLqQEChSsqVwDCL3ljgb5VoU/JTyGV2Kn0jPMoWqKRQv3AxYeTMJYL3CUxVkNWvgXCs0V9alBVESzWJkVFnajxV4qRV/LLWfiwdXoUCVUK0lFKnENguZAorPlHysteIsrUOl1WRKqeQCviVAqglai0FVoohVqKoV561RZ3A7XfN9iCzW5Wwo4VyV8VG6ndVIt7UaqSVeqlRbotbXQq64d6its8tpWCKt1Fa99VWv3X/Kf1SS49c2rPXgrm1V65DXCuA1uB8V3an5VOqsVga65A6xReEUxUjr/yY6txdSs8UxL8NU82dURt5ALrUlNCzJXsHxU0rcN0yhJYyqSXdFKFTG9JSxvxXrqINXy3dc6U1ZiltWngdZZ4NMJczoVF6m2oZQw31LUAjS5pdSW2C0kMCw3DpV0p7g9KOS/SnkgoWGVashSIpczRKSnmGlZlipUtaqUK7HL3SqyjNcKw2VNATS2yjILsutIxE7SYml0sspc2nK3NlrC5UKADJBkblhLVhfcs4Wlry1omz9feVrVwaG1f6/0gBtMJAb9la6sDe+qg2BaYNlrQ9UyoQ0gq21sKyFVVovXwqKNkhbDdRo40lafShGhxWSrnVkam1CKidc1vTXTK6NASslUusE2UbJ1A2+leluzW8aWVhhNlZStY1pqbFRWz9RJtGW6AdWMmk9fJtMKKb9Uym3NWWXeZMreVNZW1oKodbCqAwpcwNW60GYhrsQ6q1uQEQ7lzyF5Rq64MOXAIBsPQB8ois6sQD5MqwkbDdn6rKaFpVeB+Vck/MLmQ7dA0OxNu/LFWPaRm4av+QAujUzMgicpAkuTNU3qaqSrSkpu0oxbdLMA7JPpVyRM18kzNkmizZMrGXba7N8y5kIsqc3BbDWZymzQYU81bLzSPmvnXsv80HLAtzmrnWFp9IRb/SVy4Mqh3cALKRNEiwLaluFZ1r6N084dTiG4UnqW1ba3LTEQV3MgmtKK1rUsXa0YrOtGugCjaSN0EqqNZux8qRoY0jbmNIutnUrvA1Jbldn6x3d+Wm1KKKt/pJDTCovV6Lattu3HXXC5UnaklZ2/lUasdYtkRVd25NhXOGYDy5VQ8l7Q3JVV9yB5Va1XUkrK3F6x1hwY4G4BEK4h89z2+JfquVULzVVmenVQqqSUaYG93cmvVnt1WWtKwuej7VW2XnGqACQBZoKvNZAWrxgm861c4XQIZN95wbAHcfIQKeBQdHq8HfUzkCFo9gj88+c/Ih09NX5UTe7Smwz1hqxmEzL9tM2AV5rfms+8YLwXFZjtMK8u05tURAULNSAqgR0iUqL3VKS9/+t8vevzWOEemZIL/T/puaRk+1SSi3Uys2bJkP9oBgwGSGw2/6a1TKwYs7r5CYq6lt+qFmgagPG7piX6uuX3uwN96etwB35vCA5I1ASltB7kLXIwNt6A94RHiORpGL4HGiNhVQOgZgPVKZ52BjiEAa4NPMoW1zVNdAc42RFhDuK0ILsVJINK2WnxKkly1028sDAIoJ/ZK3HYZF5dcpAAJpQK+C0ABVtUQGUeEBD2arA9xuqW4HItcCmQ2wd5B7B5DIoHecq1Vbqt1tgpHVnq13AS7ttR2i1jyuta1kBV9rJPbWxu0utkdwayud3tb2AGDVjervS3o1W2by988zvf3OCIsFvdH69Vn/uzUAHSjmWtRdlpxAG7sj1R3EHEDiBxkmghelg4AeEPFtCgA897ZXur15GB5ayAuHKV0D6oOQgqZ0iUaUW2GutrhzFakcvCeAmgDRpowMdIBDGRjUQ4o60ZsMuGcDZe97fMab1NAVjax0Y5sesNKLZDdh7NTbuVXzzywu8csFsSeMrA8gn2k1SOXtUfBF9uTSQMDqohr7fVV8npoWnLC76IC6+oEw0zABI6g1D21Nuft/mX7AFMzJAzapKWrazjnGso0oo6O66qj7auhaEe2Pu77d4EVuZcbSViRc14hxohAZTVOGc97R0QwoZpMLNCDUh4gz2omPhFyDVxkeQhrwOsnHCjB3cAwboOkH4ly6YQwuupNMKeD6APg0QasOcahDfJ9g42sQPcGFmkhhk/EsuPTG+Q8hgnSoY5b8tbC3LdFlCT5aJbt1LR84+wexMOmKjeuwDRhssPcmZjOxvYA4f9K6mmV+pjXW4eZMeGymXhtVuJvM3+H9WQR85Z4LwPHbAz8eiI4nuFXgUG2UFZdq2xgrttXQnbBDt22+DP6Dmr+gihUVkBFn9DclaAEYZMNmGZ2c7cijBQXYUUqKroNdlATB1DKd2RAPdqxXYrxhVQkYS9rGDPYsBBKHAYSiIDtnQAoFrIUgBV1nB1BCuYsjabBIbjIhPRZyEKkSEaA4Bax6jUgdjMXokzGaMwa3OJ2gkRSOUAAaV0BgknSZAPlKcSMCNwuQ0VPuAqhmQXmJ+MExmo0BPOa1wSlATkqyH/YW5Q5YAO9pIAfYr4RqQ1N9lXA/Z8BZzwFhc9gCXOHUNzUcjxlvD6DbUUL85p0uhYUCYXZgno9aqdXg6IcHAV1W8FzAItoWlzAFzStizItej/A25zQLuclR1CzZh51WXdJXMXSv+Z55ixElvP3nMST50wC+bGhvmN6H5z0WJamT/mhLdveUUBZAuEtoYylqDMWIWgPUcORvF9C9Q/QoMv0cqX9Jg3/TYM3x35j/r+cgY64+pa023l7yt7DSHJjqcaYw0mmXcPJnDaAN5PTR+SfJi0l7iFNwZhTLzlvKZHI3rR8Zqxoovi40ItnaNpzc49CQzJdkzi5xHszAYOIol2Mb0+lnlDAyMvwNhUiDd9DxdCyoNUp6DKy1g0a52WoJP5q84rgsmkM2rDljq2D08tHdvLOGXy65KmnuSZp53fyfNP4bUYnuQU5aQ1NWn2XrJdIh3jzJEm8ZA5r0/cw0IlHNDvpbs/RvTOdlFXXZ9stkWgMsbZXTrrV/4e1ditEMuUOwg7Ap0hqo9tc6vKvuLNglnD8eVuaLC32M7z87hAvJfhZ2F6f1iarw/mu8MZ7b9pejllzmdLcuAj68wIozrzzBH3D8a4NwmjTyht08YR4XOEWXS+GI3kRtsenIzjREs5ZaulxXGPnpsdRGg8IJmyyI+gMWiLTFtS+5amTrm2LW5nc/gVqtpBlZ/FtK5tzZtDhRLPN1G+JbvNSLHzfcZ86+cjgKXV4n5qW3kFUuuWABfVw6Jpa5CgXoYfVMOSIE5uLmSL/NkeNhYXy5tl8NcAYJpcYsKAyCWF0JofidtzmXb3AN22xY9tgBRgJcuI7CZ7IZ7+yiTY1ck3qAj60mK5X7eAX+0/GXVJ8xAmfPBO+ruAVBbplCe9Ww6MCWdupofoDXH6094q7EAiYjWY7r9saoU4sxcLUhVm0h+RTsfkPbNdmBZTCjK0HYnNSz7+rU44R1PN3aNOxn0yyblNsnXmSpj08sVbvMnUTiJQFpq2BbUgLbxF7gKRZtsL38WbxE018R+IItASSt1eBab00wkY58JRe0SzRKkssSFLFElMwEL6pjTYAdlvvbNP1FT7mhuQPy2HjumtjehR07yHcM6HO7E7I5nKzrOKtiyYZnw5Gd1bRnXNwR+M0ScrJJmLtUR67e2VLsfzU2Edn1lHb9YJ2sm3x0Nr8ddWRt42YJqhyXaTYfzUd2u721zatusWbb1hO26iCaA3k/TM60e8GZ4dFs57tSoUJEerZOs0zkFJtpmeXY5ndQeZ+ctcFQoVnDmsrIdqc3LO6Gu7k7SBwqwbPNmmzy7Vs7qHbPfBOzpm7s36Bu37sQwl7QgFxT4oDmRz0YBMOOeTD+tkO0AJ+3EAJJ5FB8kF29k+2LhwXy49gSarIE/ZP2Z87IYTrhfMB8BIny8B4MfbOrhtLqU566mHi8c+OBC6MxSd9cZpvTMZ4t/a1VE+QAALmIJwBcFlDZUwgmJ4sAUzFp+UwBEkJQHqD3B/0PyQyXdd6sPXZGQEcp5U+qdhE6nx9xpyHnfhOkbU7TpVF06B7nT1Lwszx/qm8e+OtbCogIC5eWudTuJQ0+yYNcwwncRr53fyxNdu4zX7uFzgKc92CmwylrPVla11M6hO9NrptsAMPgSc9wknjBB274z4AzBz80T5J57f+eaBAX3z3C0Hewd0OxVeD71kOT/wx3UmcgdJnvMXYQFSHR8sNqnZPb53C0AL7fJvrBNg6CXPcIl7Q/iNwmz9ozREymuRM36679+x/R3f2YZEn70AJloZWHZnNUTQ9u8gA/93YHcTgppQ2pupCgPWXyzjl3wS5fmGYHkhFVuGY1bwPkHOxBM7GfCMYOxHye2I6KvdZwvP8BDr7UQ8+MYvHVS+7FwgTdWLlo2K5PO3G1tdH6YXCRs/aI6FWjm62qodM1I/RewVfXsj80F22NVKPNHBzdl5y70fLt9HZFIx7aFooZ3SCXZ+iruysd9nbHQb09kJQvajmXH17Sc9BYCePtgnY1UJ0hbjbuJlqNAGNnhcXIVv1gDwFcudVPkHxbwQQDsXgLCBxAc0fj4fAVALj1vq3AJFfLW4LiUBywqco/OW9Hfjvi50Lyl2Ha/n4OEX6L4hw6u+DmU5KZILIgADVZAG7skOZTlKGULX5DnF5Q4rfUOL3FL0O+nq/nChxQ6wUkBSGsC8E9g9IAAMR7hHg+bVB+wfj3igtX7r8R/W0kd6hm2xoLM2RQDeQXkKwb70POyjeGPV2tFZNz2dTeVxD2Obwc/Y+HMOPz2iYBnBOfcf5xC3sFzoC+2nPbdsiM7I6PuKcQNhBCOXPuv4FSJyk4ghROKoZXiB1xgAhhyPvEAHhxVrz8QPgnFRELmV4g1YYACoU7jxAQqwATuAIXiAqE4qcpeICIWABykBC27+IDSziD6oRCcQKBcABEJqe4gncAks+LioqFhPOXa82chULmUAeKhfT5Z9CqboKiFROIEkTiCCFaPw4GqMGhiD1omIgc/cZR5uvKY+xsAk60HOHE+yHZl1tmZOO9mHXSJ/s8iXF7sZ4yAvEfSPk9yXRFpgvdKRtC4DxAh8VpyNvW304cz/R5Gg6ItIZHq8MpGvdXkAFRBa+UztJeX/IMJPqDdTcngs1c4zXbz8ytbPUqqT4KWr8pSAQo4QcYAKiARYSv4e4HJatHUA+oBcdsIKlVTjPnsQF9sJwBkLcA9wbecZ4b1OK8gaugQtcJLi3BAX0A8zlG45e97ritnDznZ4NJ7ADXRpeYI5y5JOfTTruk1nyaFdmuBSlp2s+5z08ee7OkZaXnafFIjFJSUpaUk6dOKFFVfwpNXoSVj5isnD6RJWc/pX0pHCWfr+Is5ISOJECoTev4M3jOIxkHnUrJTp79V4J9g9GU0U7jLFKR+JTbUqP46TlZLS11nLlk3W9j/Z9CSfvwo/72d3OenPgf5zqa2D59rhXbnMkt7rLZe9W8tpuExH3tOR/8+jp6UjH1qLx/3XJfmw83708t8gDco2IrX/rYgSl4bwVPx/rT9Smv8GfYt5n4sKit5PhvB3Tn9tO5+7T/A+0lH8b/R84CzIz0gWSePycHcLxU379AuFm9aj5vRgRb1uGW92COQnIdb5t91JyQdvC4FabDAO9yQjvSkU7/yjvFeDzA9o0gLd5wZZ9epYv7ZwNM0nff9nv3gILL78tA/PJIPkKwtLmuQ+jxoUgP2T5G+6+SJ+v8P4b8Olo+hfmPknws95tUNrfsPr7z1OJ+fXSfizr/jrwJF/giR7v5/nT699/8ffe1v36z4l82SOfCP0P7z4OkC+TfMftVNqLDzLnoAlTGbzm8ZgLP0lw4gXP1W8C/OIAzAi/bby5Ay/Rawr8e1Kv2O9a/eALd4G/K71q5m/O72hlWQR73G83vDvw+8u/eUUO4+/LDB8sAfeXyH9ArYK0ucprNXwWtxGf3yG8Z/IP0lkQ/frzD9XACPyN8V/G6wplC0HqWisLfJ/1x91/Z7yd87fLEW39PvbvxP9KfM/2p90wD33p8b/WiWKd7/cb2D89fV/wN8+fZf0F8BA7/nMk8wd7xh85A0gOl9HJYayoCgrNySu5h/JX1B8x/CHwis7nKf1YCj/WCXB4X/LgLf9I/fgKy8LMNfwP8N/OW1h4JAtnzECrfInwd9xffHxiCwYCn1d8lAi/xsEr/Guh2stxW6XStHfHH02EdA+fz0DF/AwI/9o/IiW6d2pBINEDVrcQKvg//AALT8gAhb1ADwA/P1kENvGoC28S/OAL29EAx0TykUApaDr8GpC70b9rvbAJwZW/JQFLcimBDy0BHGArizBdgAY2aBNWYNCaAGgWVDkBf2J0lA4ZqZYKJAjjdADwAWgdAE2Dtg7kF2DLRFJ2gAqIZt1otjwajxUJ/PejxVpsuXLhvBWPdj049uPXj3484gQTz4JbPUT2SIJPOICk8ZPOTwU8lPOIBU8+CMzw08tPHTziA9PAzyM8TPMzws8rPMyls8BCezxvBHPZz1c9vPEKg88vPHzz88cvbSRDRiveAFC9/PCL2CCjrJ2RS9pxBLwut8ra6xZDcrVCRMwA5BWQswmQ33ij4CvY9CK8B0Ur2cByvSryiDH/OoK0k2vRela8pIZr0ECmvdr069uZUUP485GAb1kCSAy6VMCLAo0OUkY4bMBiAuLVKTgQbwXwVtQ7QxoEdEtbQwC1tGgVvC65XQ/INt9elKwVhNvQpIODR9WLrg1kCZB/0SDFQ3XgIC4gw0PBlGaBQNSCH+EkVUDr/QpyZ87/NWXDDagp5ydgVhRoOm9mgjP2ADs/MAOxYVvDoML9ug4v2ShS/foNylBg6vxO8RgtAN15LvJvxb9N0B7yzCbfJIIm8zAogNNC4wg7msChrZyTl97Asa0cDaAuaRV9rneayh9PAhP0D9veOf30wF/HgKX9yg1fzN95QiMJzDYwxP1e8Yw3cOzC4fBMMuEkwmn0v9PfLIN4sinX30zDtAvwJ599A9/yj8hfEwOkk0gcwJECewyMLICZfSgPHCWGGgNmkrnaawYDx/dwI19ofX8J39u/XwPOslMdcOgBeAwwM/9sJUIOjCwgyQIKDpAhnHiDO/IcM04Ugi8PP9kw68LUC0w3a23FpRJ8KQi90FCLQitw4wKqCxg7CMm9XAJoPygWgkAKW8ywvPzW8oAroJ6CawvoPL96ww72GCzvevxvA2wyYI7DCgNVEKCHGQ4LRYVgk4LOCNgrYPdD5gPYOqB45R22QIFgvoD8YTIqF1u0cHFHXhMkiXEHe1mjFXRHsVgN42+1XQVdy+NzXZOyB0YAB4LTtiCPqEoBC0fqHqAEdYlwCigo6gBCjEdPVypc73GlyrtqQMKgHg8dF+zfsqSYKIR1IScKJGhN8JampJ/0d9xAAAAUnLBywYeAMASo8sACBKol4PTIzDUKgyJf3OxUN0mo4AFQUhQSqJiASydV3iV0HN1yu0PXXV1T16HeE0EI7I44AciUtJyKaAXIk1wX1PIshxTtfI61z30SmEyPtcE3NaKhMYTE/VvdQ1eKIx0o1Gu1RNyo4MiVM/dXkAZU3AF4Iw07dYlRajuVGMl5U7ohBWejWo9qLEMJ7RwhGgZgKgEVMOTUpRo1hWIbRHthHT6IfVvomOUKURoRoBKULo2e2wNZtWUwhjUDKewBimtAjRlJqDKFjWCmiXQDhigYy1imMNdJGMFMmFBNUKVuAEpVW8xjCU2FYpTNU1cN+QNBUZi+QWbWEMEDOQ04Nx7eNVQBUAApSKULVLi2pjTjcYwFdXDaUmEMF0FmINM9gDo2ENHFYQw1NNTJoFFdCdFpS002lNFj01ydSnU5JSASw18MmdWMxtJ5SezUV1HNILQ1IQtI1h50qFLzQF1LSNRT80RHUXU/VxdJBxNjTY2XWSBTou3Xhirom6Nt1Wo3jSFAXo2DQejY9NrTejHovQg+i3Ad92UglqdwhpjMTYbWENmYrFUDN2Y1mL2BOY3OJuM1XVqOZihQc7X6jojJUCGirIl1zvcxo2o0mjijaaNmiV3U1yTtFo7yPuCiwcsEjYIAIMiZJ1o6EF7jtLLKO2iYo0/Tij0dS/Trg+41KNUMfiIeP/Yv7KEisFYtLpU3lN8MpmwBUAZwB7lkXRYAJJ/mNfH/kDAAuFwAe5GimakNgPgnnZkgZbTiU1dQImui64GdluiQ4mOKjinoyOI11y2NwHDiiY3lRj1EzTV3LisHSyOddYoiVUL1popoBD555Q8j4JejOMigTgYhuVgS02AQnqNGjBuPGMD1VBLgSlSV40H1CHFuPmjJyE9yWiiwVfXTtyQKwQLgkWTfFOjiXMkFoT5gbKBHjemaEzHi9oiuwOjL9GhO6hWE5oAxJ6icjkUNWWV+wpIqSNVlMBWSAqCyil4zpVOixQaYj6hf7eok9FLDdnQ1ZvDMWPtNeQEGJQSm1TZWQQTCNwEFRTEkoVMTN4QXXshUASgFMS7E0xK5ArEzABdjfTUDQ40yDR+KDiv4+6LDjWo4tn8TY4jZnfiNdeOMATW5PqJTNBoudxvdy7A8gM9xo+eWwTBtGUmbiPjUhLAADPchI7jfI/43TtqASaCEAZCIwC5Bz8PqB5BuAGQnQBegDaMKTKkkpLKSNgCpOKTWAXoB2iy7Bh0rtDosAEaAWCFpKqS2kk6JvjzowmJ9JA45+JUJX44JP0TQklu18TXohZOFZwkge3ZJfo40QJjPEke0Rj57VZJ+jgLdklhjRkrZNg0dksGJ5iQDVGNZASlDGNejkYy5Nxi+XQGJOT/4s5JVjyYvmIFiqYpU1TjdE6ZQZjZYzOOEMc42WPzjZYwuPBjHiCmMFiuQeoBFiNjP5MBUvTaWKzic9GWMDNFY3OOVjqTNWL3sNNepNaTSksF2aSPiVpJqTC0TQEwARQQwDXBBBLiwR19SCaDhTaogzz/jBHJZLLY5ky3RQcZkvkCiSiEiuNbIq48BPHjQ1YoiSSC9RyJQTnIohONcSE9F2yZiiHJN6SfIosDEhI2KwWESsAcpgETC0VAE4BdAJAGvk7XaEE1SbUERJ1SC4PVINSjUwVCdd53bhLR0L9FNRUIBCYohEICVf4kBJhkgwE2TJtNLVMIfEoJI/jHyDlPZTg07+K5TlkgBL2TWLP6L9SbFYlTeT7ku/ShjDk+kw8T/U05NZjSY7GMaJ2TLtRINMYlNJxjTg8kCeT4Y4mPuj3k3mP5jE1b5IBjfkumMtYAUwMyBTc4kFMDMwUwMwhSLkuwmhTuAIWLhSfk0WObTqlSWNziUUpk3RTW5TFNljsUkV3ES37DTTNTgLbVMFRiWKnQNjao4ojZTP4iNMxiw0odR5SQ0v92ATokp1mFSHU+JJxBslCVJSTiVDuXz1DyIDXrjkE0rTSTZU94x+1W41CmyVlU60F8iWwHuMUsKdXpToStgRggq4J3QeNAzKdCDP+ZUQaDPtS4krpN4SU1cDM/MjjPuF/lEMxYGgyfUs6IBiA47xMmTpk09NmSj0wByjTOUqjOI0Y0xlzjSNk45KzTeHZNLJiUY/ZOhjcSDNPy0XkwR3Yy80ye2uSlTW5P7UsYyFLv0y0vGITT7415JzTdk8QwHT4U2mJntW01uXbTZYztNblu08k25i8lT5PrSh0lTLTij1ZFK11ZY+WNzi50wMwXTHmXFIkTxADTWDQXMsgg1tPReDNwyoM/Aj1TKAX+w2p3TRZMcNFdQow61TCMxT21TFD4nhAIk3qPPSBU0BJDtdom9LcAoFeZXsj30n0iVV0kn9MyS0sgDNVTYAJiA1SWFKpMiiuQKDkwJsAREFjYwAFeJ/Ays90MqyIAarJQzkstDMniU1erOKTyssi1IhVk06Nkzp1cZNIyX44ON5TQ4nED3TqMujOaiD07lKEzIY9ZP+i744bKWIDE3h3OTUTLjPTShsyXSejBMyTIIM0YwtK5M7kjjIeTpMitLGSh1Q7L7Tt5QzMpiTMxFNJUM4izOzj3snTM+y9TfTPwMB04zJHSEUsdOzUJ02WKnTc4qzNlibM1uTsyxDBzOXSqSbrMayKsxeJaz4QP1TZBC0CIWpJ52QLNO0T0oBNLiE9BLJiSwE69K6TCiZTTfSpU3hxlTLtOVIySFU1CkpyCszuNgBCISNnJ1UmXfBYT6EsEy5y5gHnIES+c693az4TdDN4JAAJBBAADhBAAQRBAACRAmgWXMAApEEAAWEEABWEEABGEHVzAAXhAlc5XMAAmEHVzAAIRBCMvbO/VA0sjPGyKM4AEmzf4gJJozo42bLaiGMr6LWTuQZjOIybsp3QUyts2NO2BuMo5K9z+Mg7N9ya0y5ILTGtItPOzFspwiuz8YljMTTLdO7IMy60p7MBzVM8WOAB1M+JU0yPsmdPiVdMn7KoMjs/7NhTns4HMD1zMgvKZVIcjFO+ymVWHJZN4cyRJ+IBcnkEtTBE6+U4ARQQyk2BUiOYAbgt0vHLj0CcyJPizLtQVJT1q4iBIrtqwKZOpypo6VIHln0682vMCSe9MyynounPtYGc3LKZyoCefNZzfIjCEjZf2SlLpIjAF8zBNz80givy7AUXM6TxczrN4Jb8hlzdzBsxPLkyRsy3LGzncu3Omz/dZ3J/jAC18guzU05bPNyk0sPJLTGiHbJhjeM55NYyBMmAvALjskTPRjo88TNgKFmR5ITzg85AtuzUC7GOUyM80zPpivTPPNbltMwvIbyklXtNTyvkgHMbTR0me2UUpYugsAMa8pJWhy69X7NVil01vJFAXM4ND1TDAUgl/YRQSQsWpSk7qBFB78+QpfNLDMTM5TTY07JwTsCkk2iUws4JQW0uDHqPxyic5MxJzL02JLFyz9efM3yacrLIblV8kKg3zF8xuNg0n0tVSSNplevU7kB9enO/S3I39MPzZ2LyJVTO43eDPzxCy/NeIb8sIowIjACIsfyRo6lxfzqQN/NrsP8kZIIKk8h+N/ypk63JJjHc/dKmzWokAvejXczjKYyVszNIyK2M4gqOy4CtNIQKoC3BJTzVkyPM5MNC1QrQK4C+PIaLo0poqUzHsopQry1Mygs4KZtEYqUUi8/034KPktPJhThYsgpezytavNRT4lOvNnSxi9U34KW8pzKkTXM5IrEKpCn+xkLkEbAHkLXiEUCQBqAFSDkAjAOQEoBeBA2PULUVCTOdio8s7M0LXYqJSo065VU0pM8tFoB0TK8sjWwMGC0smLj+UyfMSyuEj1nDt4XZeUZy/tTF0B0gih4L2AVoqNmXJqHR1ziLrI11wqLv8pYgmS/8+bMMTiSj9OAK8iuON5UHNWQiGK3s7guqUaC+A3WLXDACl2VvNJ2Pt0ZCRsJqAcQZ4oEcliHPKZUqC+JUZLYDZksNNmTaksK42C0HMDNwcyzPFLvTRUuVi2Sx2M2UyQNxNtJh7RYo4L6S8oz1LJjZUslKL05PQkdwmSIXLUCoPgHFY64VIgipZQOUl0pyiaokMI8QOQDpAbSu0r4JZQVIhnY7S6olFB3Swwk9L7StIndSXS1YDWBbS+0peDqiWQDpM/8RYGUBmKC0uE5ICMADdKPSqMq9KfSv0vMoAy6lLpBgy7MtDLSOZIjjLi4b/XTL0Lc1LABPXLUD4AFjKiCaAxIJoBbAmgJiCaAH5AEEg9jQaD3kcCzeikbMyKBdjAAMIfYG7lUS/YEeM25fYGbK84/YHbK3DfYG7K3QZD1A8GKND0DA03LDzscT2PD14pL2AjyzceAESjTBCWCpNaA6UhcHqBbir8FH1Rg9AISBBnKpzDEanbkFGdGCcZ2acpnNpw6dXy0LA9CEgUq0MsBUEy2qtkGOqwssf0BVGstvqNVGfLh4RuFMQuLY+35QyhbgFQBcAV9CVQnoBsBPxeuLWyqkri4EkxFoANmEmg+UbpzgjLApZxPwZgXMQbBlUTkEMBsADsFwADpaiun9vAxmkX8dzP4gW9kuBIE7huUdQkwA8M1eAXA+CRq1cEAAfdwqEgDNmrCiIw8IiQ94gMQHyBmAMMjD6KirjiA+8litXh2KrW3yJ0AWSuY4agTkCehDKAQhUIsiGdn1RIqBcCJIVCG2jlJWPFQh8dzKBcHKInSpSlcq3nKC0cBAgUwViB1nBIECA5AKdAiqkAKdFzgS4O2XK8aMAACOAAQ+AhkqgAHO5oMpwAArgAGuAAe4AAXgAE+/BUVAAB/6rgAA30VEAA8vFkrTMBjyEJWPYOjORsiYKm89siVIl89DKfwGvMnPcyns8Oq4ADrh+PQonY8kiaKiFE+CWarm866fwGcpDKXz3JkuuOSg4teq1ImcBXg6KmrBzKKBX0q7Sw6pMNgqDqs+DmPVwFE864Lj26rqhNcURgs0NKoyrsqvKqKqyqiquqq6qxqs8E/HBKq1tQqmIDirEACjzTBfYYAHwiz4dazopuw+CNICuYKZjar8iDqrrguqpIltK+qgaqGqRqm8GuqJqqasurEieaq1E5qjP0WrXAZatWrbwyBU2q4gbat2qN6fasOrDKY6qM9IqcmVxqLq0apuruPXqj+EVK5cKt4LQqCGtDNgM5HtDJIHjOdDtKp5y9Cagv8Ked3Qz8JsE9RAWrYD68X0MpcZauHyDDdwEMK1lYa2is2kWqnJVx1ka3GtRqfudGt6qZXLGufEcauujGr8awommqN6YmqEDSaoQNxqlqlauyJqajatcAQqLap2quuOuCZqjqg6rZqzqzmqY9ua26umrigQ2rNCfAtaApkYgZquIDiIiJGew8amIEmqXa3qi5lOUErEytovDCUKteQzkJ7EkvT2QrrUvBiP4wyJQOVOl/oTPnWt5GDrxBlKZfmqurWqs2pRq0anqsxrXAQavtquuXOvzrXa/wGj0Sa92qMsT6aAEpq/a9atpr6a0OvDqWayOtOqOauui5rcasavjq+avmSTqs6yIKy5Ta9qotrB6jGttqR67GvHqnavOoJqZq2etfqva8msXrfatarOQA66ACDq6akOr2rI6zepOr2a86tjr96nmrurE62bn3FkZICFlBZQcyhEICSOUj2AfS2ACQAMITwDUlEG5BtQbywWUFQA9gK/MwbKpB5GhrevBGr7rL6uuktruqm+v6q76seu5rnaqetcAZ6j2rnrvaimq/r/a1esAbGa4BtZrt68Bq+DHaqBoTr1xbis39CfDvEtDRa20JjFtgSWqdCDwwWqmQ5atWp4rNaJWsUEtGzOtUqpkTWv9D5auGupFdamoH1rWJFgKXD1anXxNqkageqtqh62+ugBR64aofrxqp+oLqX6rhrfr56n2qpqV6wOuDqGa6eo3qRGsBpjrxGq6oPreawoCKAT6oxq381sNOozrBwlJpQx4faSWAAfwmRoiCqGEcMOcgIwf3GtFfCcOV9XAm5yYDNfMxqNrYJG2Aeqr4bkPZkbwLK3ZlbrLn38DXwwIKMDeQwyDbqUJX2Q6b2QnASrr3ZccQKtCJSiQmbG6jL2brpxLurbqSsRGv7qr6lxsYa7azxtYafG9hqJqAmz2sCbeG4Jp/qBG8Jo4bImreuibd6iBokbD63Bhm4OI3uovrzauhuvqbaphvcb763ZsnrCazhucAjmo5p4bP605pvBf6/+rXqgG5mqibo625tiazDeJuga8gJJvgbpGkIEobkmjRqoZ8ItZtoarq+hutrh675pYbIGthv+a564Fo/ql67+vBbzm9euEbrmuFt7q7muJskaj63JoKbtfM+uqgFG1HyUauIxBgdCfBNRpPCFauHwMbMm7FtBg9Gz0NVrDG6Vo6gTG+7W1qvvSxusaww+iPPqnGjZoYbPm7Zodq2W8lr8bAW7hupa+GkJr/qwmhlphamWnepZaEW66oebE655u5h0mrFvsbIpbpy6txvYprGlbA4CIcCArMCKqbwIxgIXDbGr60VahJIoLXCSgjcLKD3w4wMGadGMPFLrjrMZqZk0vMcSutYveutnF+QpuqFD7qoupvR6gMph4hhwctowhTAJADfE8BWPw+g4G11u0bZG/PjE5C+ZzHk4IaDXCho0edRs9a8RApHr4ow1wAxpm+Hzmfp2+MzjBsqePGxF4CbaETeFN+Afk+EouQESRsxW8xq/50bEnlBF2aeWE7536CGys5ReLrGXbYRLfjXah+fblpwURam0V4T+GcX38tbc8LHa0giiIyCbw26xork62f0hqt2hppG8VhZXGL41cRTk1xlOftsA6/2zWl+sdOZ7HHbrhEEVuFGsbGwC5j2+dshs1+aG2LpL21dvhEybDWk3acI6IMjDd2hPCnaF+UGweFcbFfnxscOwmwvbibK9sI7128mzl5KbEvEfaMRZ9sIiFWwdux4XfMiOUC4GFMKrEBOnRpXCQBCeoJrcagriK4Axarnq49wSOCIqSsOuFlQZCL80k622xxDiBI+LTpY5vVYwC65CiIkAABHWgC1tsoD3KwB6cVtsKbQYYbjmguQCbjORhuRTpK4/EMrnG5Kue0RU7bLM5AzEYgcgh6hOuG8CAsDAGaFdh+iQ3h+jAMYaCTEqhT0TiE1lcyzVQTQ39tPrUm+RpFr+W8WqFbVG9Vhg6cu0GElbsurJuZs3zfRvlapWwTqVbFgP0JVb6m2Dvrx1W9WQNrtA1oS8C9O7qXRa7GqTqFrpJUDt2FwOt60OF0eVVvkCceR7AQ6CeJvmQ6MbfdtM5D22dqF4sO09sXbz2mGxXaPhNjpvaN2tnm9bdOpzuqwZ+FDt85qOjvnW6u+E9p751+MLj2QSbSLkO6OO2LnvapaMvCfbnsF9um75RN9r15yIq8K/a1Aj1qG7IpGTsfq/m+TrRYvO5Tpgq1O/7qWcGwTTrs6dO+roh7OMAzqM6jBEzqMAzOyzus7ker/ls6qAezq1sXOtzsYqIYBTohhiuUbnK5/O670C6WrYLqSFQu6eHC7euSLtZBou0xDi7xabFkS7bYZLoKBUuzEjepr0cjE7r1Ojtsx6+ugDugBRul6x7aDhKDo+tX22brx55u/6zexAbTGwPa6qR4QLpPcXDo358O/btJt2O4juO7BvQbsV6KO1vjJ5rumdto652+joXbGOpdt27LeuG2vad+W9optzkKmy+7j+Xjt+7+OhXrO6b+YTvfbLwlQMojr/cHsV7v/SGrkBOwNAjCJDATgFSlxge9AkqwIOEhqBJBJBlJIlUaVASBChGIFKgvkE3idICoTiuEFSuM7zJZ6gEbDsT2K4NBtQjANLssquQLQU8UMhbQL7DSOhUP3CRu2TjG7XrXtvesjhEnvJ9h284UQ6rhLGhuErukGxu73ejbs97sOl4SY7feljoI7ret7tt7R+E7uj7uWrzmZpKOtvld61u7fru7Nuh7vN6nu7LAD6EbM/o+6uOhXmlofulXij7Ku6Nud87+D9pB6yRH9q5apA3MJVpoeuTrro6e0LGK4Ee+VCR7Wusrtq8w8NHvJ6MeoAYa79OwzvR68gfHsJ7NAKzoc7Tuq/tBgye7TooHL+qQKp7NAdzpvBPO+noDFGevzuKgAumCrZ67IDnrC7c2M5Ci65AGLvKhBekXGoARe85DF68gCXvS6oKzLq/DKB6AeFqrQgrrtCiux0JK6x+vcIla6uvAax6ZWmrrlabOprq1r0BqrsOgOu3GVcA3wbrvWdR+gwdT6QOqftV7S+SDvL5oOnQdPCvveDob4r4JDrX7Luqjs363enGw96nhBjv36fevDqP6re17sD6ju8/vt6o2/Aen5ZkdfpCG0OmjvCGd+yIa97ohnbtiHnu1jpP7Eh97v/EQ+7jr/6I+gAYHbDB43Dj6ge0TqN5xOyAd66Y+woKh7vGmHoQG4etgbiAUB1TpT7Ohv4WwHtO8KsIGcB4gaJACes5HM6yB4nosHgBvIBoGKehfsZpGB5gfy5+hpAfYGfOvUQm4FwbgYa4fqPgeSEBBiLqqk+ekQYF6/CeLuF69RCABkG5B6sPcQQ5GXsDlHOqgbWtVoC8o+IryvoNvLHRYeDjtHyy3BfLhnWpwhcGnCjh/LWnGZ06cW8S3BAryrMCoQYkGMywUGGrSy1grmrH6iehmk5CtdhUK0itSlOwLCpwr/0PCo+gCKtAe+GpA4is3hSKmcQoqWRuXt0qaeq+GYqFUIys5BOKkYZ+HpOAuH4riwoSscARKvxDEqJK/lGkrLLOSoUrHAJSq1t1Kumpa6GRvCM5H9Kmp1YrjKjYc1pTK8yvQB++6ytsr7KpSicrvHTuFcrlKDyq8qfKsyjlIHKgKvVRb/BsXTR8IpwdGHhAqAbwjR+lXu7b3Bvts179RkiKX6/rRvgBtJ2u/tCGH+3Iaf7d+rbu96ihi3riH/eg7vKGv+34XqHHem/ud7gbbIa374xzDsTGX+g/uKH3+jMc/6IGO9p/7URHjorw+OnMdGHAet30/aIByNsP9U+zqFWgM+4RXfL5gf9Dz6C+r8swZKAPqFL7xUcvv/RK+xwGr7a+0OHr7gLDiqSkFwagBb7+UNvo76ZCTkG77KAXvpkJ++gMTWR6gDIWMQe65YbSHU2srzD4nuZ6qyqcqgqpKryqqqtqqGqpqvuQcgOQEABO4BUIkAbd3GBAAceAKiUzGAAgJkCfIwfANIB/GVCKcH/HwJ+IGAB/x+cFMFfx4LwQAKgcxGaaUq9KofG3q58c+q3xn6vJFqgjUdt82/L0aFHYg+XoDGkefYTL4vMKbsvGGhm/nDHdeyMf17oxl3tjHjeujvyG9+s3vLHUxkoeP6Eh6sflwSOrWyd6gbLGxyGMO/OmeFBJmIeEnKxsofEmuqYPoloH2mocbHI+5saonkgpobbHwBzIPaGHe70YZ9fR8idEo+BPzvGBmwkrlfQpwa71VROAdSCC6ex7wfFbd/fSZUHJ+560DH6JjwcYnfJvCL8HR2l7EW6gh5btQ7ccW7pLH+JpMcKHQuX+lKGxJgPAkm7e0Kdt9pJw3tW7eJiIdN6mqcXj270xtSYymNJzjqqHf+77tqGz+QAasmkg1sbAHE+0HuT7tApXrInewlwYCm6JiDuDH5+5icV7wpn/0CHieW/u4nCxsIfkmguM9pSmGedqht6axrKdK7LB9IYxxMhmMamm4xmachE5pkqb97Fp0/uWmqprSbD70RXSbqHVplYeamE+sTqT6JO+gb9HPJiRvJbYesEnh7Au+keUG8IrmHGH2OIadGGtwKYe06Zh0zvmGieugcompAtYbQJKegrlc6mBrkdYG9h7zolxDh5ntq5Wes4bSB+BrnsEHee1AluHYu+4aF7JBp4ZeHMANLreHUGW62ynupnXD5abQwrpUatB6WsBmDJirsanIw2VrOQuZjoYMnlWrSo5mpA6watkbGwUegHjxVIZYn+uzloFm/JmidcHAp/qbn6mJrqcjCRplfqinxp/Mdkmix3afu6oRFMbf6Iuf3BZ49+ZIfpnyOvMZkmjet+gUmohpSZNnUp0SfNnd+dKlrHqp+sZ0nZaK6a8nt28nyMmWp+6banHp6Geenuht6b6GPpgYaGG3zOXtR7ceyYdx6wZuYZvAFh8gZs7ceqGe5mnnLYeRnEBlYLRnFoDGa4GWengZxm8wPGabhuetW2uGiZ0QZiBxB4aEeGku8PxS6qZyXoy7pehAE7qioWYMrhJqMHVSYQTcJ3DlydFkDmAmgUEy2oJ5gzSjlUmGebuCWwR4KnNcwZpsWNo2ruohrR+taExaW2l5p1b3mzZv1bmGnZrJa9milsOaFqq6qCbl6s5tCaAGi5sSIrm0BuZazDPevuaEmi8YjnbfYQKZmxajQdZmRW7QZdD9BvObh9eZm8H5nzJwWbMHTGjWaecxZuSS67Qxhxo+DXm5xr1biWjxsNbEWnoefq3am+bJq75k5ofm6Wp+ahahG21vfn7Wz+dZaCF51pRbJZv0dTq8BDJr/mkgnOrgHfG0tupk021CVGavZDkOzaa66ZuLa+Q32QFDMvFuqkg26l53gBZenhBWb5evFreaCWj5twWfmy+b+aTWoFtvmzDe+dpb/ACFutboWiOroWxGwmqdaf54+tdb1F7BaJa3GvBa8bjW4hf8bPF45tBaKF0xfpaLFkBqjr6Fxj0dakWhOpYXYGpGRvQ8GlBrQaMGrBpwbhwGJYIaiGkhqMAyGiibCBMWnqUcXdW5xa+bXF35qIXp6ylsMWF6mlv4aqFwRoibGWqxZiabFsJY5b5erhf/DVBxRpZnhWriNFaA5oDs1pYFmWcV7oF/0VMHNAZruFmkFnWuDDOuiWa1bd6rBbyXXGgpZ0XXpq+f0WzWshZ8WTF1wDMXn5m1ssWgl6xbjqf5lhddaaod1pH6levJoHCWlnML9a/vUptGsFfJwMqaXAsNqgj1fFaUXCBloGe3BmmvCVrqLBKLwzb4BLps4CXw0oLfCgg0xhTbmQ9NrZCRF8ZrEXWmzNtmaxFmRcWaY/DPj+Fclk+ZwWXF5ZaNbVljxdNaAmkFoqXLWyFuqXLm2pYOX6lo5egb7F9BZ5aj59ZtxX8lg1rcWiVkpZIX36jZfJXH5q1t2WAl2FuCWv5tluYXUWiKahqOxThcgXd/XFpoaNF+qK0X8V0lpWW9F4lYMXSFoxfIWtlmmqqWX5sOppXRGulcgbnWgbu+WDJgBfy7mZ4Bc6X//bpfAW3Q4wb5mIFhWc1GEF9UZ+nbfFBegBQw2wc7Hwgq1cZQcVzRdPntFtVcJWNV7la8WqWvlYtaBVylcNW352lfhaGl9lsSbWF/+bPhzlplZxaL+78OuW5VhCLuX+/B5cB9ym55boDKMN5bcCPlxay+WuxiyefDuA1CM3Ck23kMylu62FaEWy6nkNMY5m/5YkWPwwdbzAi2j8NXFS2oCHLbK2ucbKYa2utsswG2oZGbbrpq8ay7i1+Gv8mi+afrV6GJivh6W2upGm17tOfwcuEdZg3pW7p2naYhEjZ/aaJsRJ+Ifdmg+q2bXXZZpmgu6Ypjfu2mCpvIaKne+U2Ze7n1pIe/7vZ7SdqnLp+qetmnnW6eB7WpjsazXewl6ajX4Bq6qLnkBr6cQ3Iwv6eTm81/pxBnjO2YdIGs5vDaVac5+GbRZEZ7Ydp7dh4uY4G7gTGbq5K5xQRC7Lhnnobn+ekmdT8yZqQeeGO58Xq7n5B94cUH5eiZZ8nGZm1aAXlG+1alroNvQedWPQ11ZGWxl5vBFm8I31f9XoAOwdI2Y2nrrgWpAy5c3XjQ7da7a+pibo17BpsTZm62Js9ffaL1riYLG4px/oSn/1x7tdmn1hESzG4cOTa+9cpq9fv7f1hMcSmyx5ScA20p4DYqGuuM6aP4Lpv2ag2314adIj4+uDdDmENjqfd5ZOguvem//Yufjnvpp6dt8cN9HpTmiBkgYhnFh3OfdWfQ8jZ02hwAua64UZujYOGme8uaxnmNrrlY38Zq4dcBhBpuZbnPEcmfbmeAzuepmpewoE+GoUbID8AfNhCLaX1B6TeK72ZqzflF+lptYMmhl5/jdX9Nj1dGXzB5bYsaplmwa03A13CP/nDNqrYZmlZ3qb2FVZybpm2Aek9ZHbRp1ft1m7Z/KYdnZp7bvmnYbI6czGTp62DH41NnKdtm8p69cC2XNxSeKmH11SfSmLZz2c0nQ+mLdps7kf2a17g5u6daGHpsyctWpZ57BmAGrLDaedkN0AU6mKGmVcJ24fHJcVWnFxZY5Wil3xs1X1lnVc2XKlwVeoWal2hdTWHW9NfNX5Z7bezWJNtQdtWFttmfu3qRVbaDWpAjbZVrlNvbe9XAww7fFnNW2rcbbtW1lbDW8VpZcjWCF9xZjWSVrxbJWE1yhbZ2qV1+eNWbm7nfpXwlpJuwizljhYp2vvHhcIW+F7uveDBFkZr7W820RYbqh1/taWbR1v2WXRBQiddbrhwRReUWucVReob5ltldp3z5/Bcy39mgFq1XeV5nf5XjdpNb2XAlk1bTWrdppatkHF6nYWWtm+Pc5Xo1jhtKXtV8paN2/Fg1az2RVw5bNXjlpJsiW0W1aGSW4l1IkwbsG3BqQbYlwhuIbSGxdZF9uYbJej3j5jXfZXS9+naT3K91Per2wW2vZN3k183Y/mQlnnbsW+dnHbYXBd9pbtXFtsXa/4Jd07aSDpd4/bI6nnIWdU39tr/g020FoHaQ3HG9XeVXw11VYvn1V4pYr2eV7xfT2l9zPeFW7Wxve/nkWm3ZV2BZXNYf3/wnJuaX8mi7f/DS1igIDaymqcJDbXlyCLrXam2CKM22xX5YbBkV+AXabPdmPh1kwV1teYiO16FdD2e1j3eBW6673YLbfZfA7oOY/APfRXJF5ZuxWi92PZL2SW9/ZQ2GdvXZT2f9mve2X/Fmhf2Wc9y3ab2GVj6CeawDp/fxaX9zXbp3dFz/YObY1speMXWd//fEPs9i3YYXQljNcTq295payXydkfvH3n9zqtf2tdvg512uVr/Y0Oq9rQ4pXzF3Q4b3TV4A6kat9tbcVneWyTYFb//TQdAWlt+XcjDz98fqgWXVmBa23t9n0M9XxlsI+QXFd1BZmWwDkNa4PJ9uPd4OE93hdn3v9w3cX3RDuvYAO6l3PekPrdh3dm20m+3YuXCA7qwK3ewhA4H9Hl0CJH96AsK3eXMDxtcl3npltYCC+A/prkWi66g8S9hF5g6zafdnNuS8EVoiVYPx15NucAKvV3enWK2jCCrb512tvraQgXrwKByMXeFkwwgEAAnQ5AXwCbaQBG5cp3D9lOpM2waG7fM3PBkMcgOYNx7eX6FuqMc2nJppzeLHHZgoednvt0qd+31JoBlfXD1jAdjxP1vdtinwRE3sh2AN9zbKnYdj2dl5QN6LZpsleJsYS2WxpLeaH0gtLfSPSd546uPbjsDpn71ex48s2kjs8NeOIxgIZe3L16E/Q7b15/uNmATw6al4KpkE4B2L+y4982Qd/zZ4mPtvaa+2DptMaBPOTkflRPEd9E//74tsE7WnDJ0AYx3SRUyZO2L9yneJ3E9vgmy3PpxHqqOzJDTtw2iTx3Zx7StojfK2SN40+79YZyrf52kg+rY870N/YfRmWt44YrnThljZrmfwAmY43iZsQdJmJB3jcpnRtnuY2dD5m3ACOOlg/axPOZ2I98O8Is/bjPej+I923EFqk7VaUjv1fv2b9nwOln4z8iccHsDm46u2d1twaCmBp9WfTPrN03FPWIpsaYZPv1748NmWT+9eY7H1xE4i2vNiZxSH8zpIL83GTuSeZPSx1k9FP2z8U7h2UTyobROGxuLY+g/uq04e30dlLcx2w57Hd7OoDqOavmdTuOcw3E5j6H+ncBos8ZpgZ1ObK2M5yGezn0e207iP7ThGep6Gtp05LnfOhjda2mNj0462vTuuaEGbhvrYDPW5wbdF7+N2QcE2aZj4b7mvhqs4NPTDuA4n6Sz0zfuPZ+u7ZjOpArWfePOJz48c2YTvidc3X+hE/HPkTyulBOpJ/k4HODZoc+C2Rz6HbNnPN/7anPpTmc5R25TtHaVPlzlU+/a1TyI/lXs4Cbz7Gs+nYKHH0CEcdRAi+8cZL6IK6cbcmnoece5QAKy0Ub7Vx5vp87W+gqHb6noTvt3Ge+vvt0JB+08aqELDpQYXPjNuC7uPxuxC4s3Kzxo81maT9ibpP7NjC/1npp8i5wuhJsLbdmaLzKaIuVd/s8bOsLwqbhO3NhaY5OJzwi6lPqhiDdnOr4ec5zP4wnE+Mn4N1U/1PLpTU7yPtTmOZy2MNvU73Or4A85K3phs8/8BM5pYeivNaG04o2wSKjcLnaNhnua3OBt07a33z9nouGut9jZ62fzu4e43AzimaAvXhsbYvHiro8Ly6hdqTcFaQFrpbAWVdiI90GvvRM9l20zyy+SO9a6ZeV3DLzaT02bzyMPO27T1pZJPd1oMbVnrjmK5s26z+k4c2HLm9dhOnZqHbbOYdzs9ovvN5C7wjvLrIabOnL/y9wvAr+GwlPLZ0K5qnw+yDbnOGpmC+pOlzlobYuwe9LYY8Ur7c9Rm8txK6/4itnAdyvQZ/K9cBCr68/XPL9mrZWvYJB05YHHz+jaOGqueq9O8q5gIE/OfT1q8bn2r4jh42ur4bYE2QzhQd7mlFiC/mu4fWPn+HxmQwGvKwIO8ohgHylsOKRIRt8pGcYRgMThHJnBEf/K5nYCrvR7qNEaeoqrTEdqthNnEZgqvqDycQqT8FCrqIqK8kcwrsK8SupHZbq+DpG4b0mXIqSKqitZGrbx9HNveKzxDGgGKmcR5HdR/kdXH7bpyzbXRRwSoQqJR0Sv0AZRqSpkrBBeSuNulRyphVG3WNUcSO2br7y1GDK3kbYrOQEyrMqLKqyoSAbKuyoVZHK7yqtGbR9ysdL7RgHkdHnR/PbzA3R26Q9GfRoG/E35TlYf9HlZszbMuKTiy95Pqz3HlrPntuy+CGtpl64uu/jq68P6xzoK4IukRTy+xvGaJ677vfLv9beuXLvC9HuX1n659nwrxi4BuDruDtiuQ5lc/xPJ7oP1j5eLgcZz7hx+6kL6xxicfEuaAGcakvuUBcaGdn+BvpXG0MRS4lxlL3AFUuEgdS9wA9xg8eNHtLk8bPGC1lXdzAkqu8dwnXqp8Y+rXx76o/HcwL8d/H4J4CZXQwJ5B8gmzjgIBgm4JgCeQeSuZCZmgsH9B/uqIIJ6ogfHx96pfGvq98d+qipcKs3uBrrmFomEL8k5CmHr231Qu9egzgbPnr2e6C3nL0LcXvPr4K/HvuTns+TO+zki58umTge4Emh7iseouiOu6/Fp6L32fXvIrwG62uXjkG7xOErjqbWuMb9m/bAMZ+ybO9gAJyftFXJ9ybZ7PRo86T82Hy7cYem75h/3WvBrXqOvu7j497uvj3h4h3Lr+E4+uP+r6/h2J7/q655JHnh+kfsL+e4EeAnqsaCfJzqLZUe17siqivIL6kVg3QbtoY4uprhCOJ36H4buMvSTvdeCmD1tx5rOnt7Wc8ev1iJ8HOZHpKf+PRzm6/cvKp0R/yepkae+8fInvy78eArn7aXuQNui7Cu/riK/t82nvEW0f2x3R4JOMtqG7SvdT1Ac9vlaLAaNPQnuK1NO8r80/POKty85wH0b8R8jDcbnYdjnUZgm8Y3sZz06ava5im/Iq2rrjZpvOrobdQiRt7uaZuwz+Q9335tka5k3HVia6TOT9nmeiPhllXav2n8FXbv20j/e5XD9H/Z6J3Cz2u+qPCn3a/LP9r+x6sv3Hyp/QuvHzC66e57np/eu+noR7HvLYFafrurxjp+xfanqJ7xeF72J/KnhH4l9Omkn4Z7UfRn1F60eWLzJ6x3snnwdyfNz3obQ2qrpTt3OQHw0+K2Vdk87NPwZrZ8tPVnjlFKuVdw55o3jnprZdParom7fOSbi5856rn7rZueqbu58qgHnwC/pvgLxm+E3mb/ueWhVIr9irlWSReennZ5voB8ZBCW14A5UmeMrxdR5x18ndNojAndfEACyKSyy7A1wHIjXE1UgAzVCfUtUt5e/Xn0D8shMCLrQVeb8jPXuYE30x52rJHm034u04ThonEonjnU6uxjVtspZgf0lTPt1IBu4Qoy0SZ7e4x2M63vjSF12SzZTEhrSXRUCAJ0NtTcI/ijGKzyNsp3OWLf1A0vYMgVOks6MPilgkti2CqtPiUSNJt7VK+dKvT5KLYmkqzygzLmMbeHYnZT51b1Zd+ZAK3/VF0BK3z3XmIa3td7gNe9Od63ebEtwGrA23rFLJU1FQIGrBnATt+hUB4DDSlLAS1w0FLWDTd/51t3+yBCpNSr99rfZSsg2PVVSwD+uiQPld+lKs8ut4oNM4+2IA+b3wom4U93yd9Xe9Ev6XV0yDFFJQ/TSBd/sgEEzD7PecP8sH7eCSpGKg+b3jfMw/tCrPKAcXc4d+AdxSwJV1K5tATRiIJXPtmgBzKN1J7t8KQsn7s+imYqJAKuMt4Bj31Ct6rft1Wt4DMyDFUv9IggFQm3cQJttT2Aw9Dt7bUdQFTT+z+iuc14IdQRgvrTjPo0FM/ClbAH+IG0kz4M+ZiiIXM/HgSFhrKDkhwidIKsxAqFQlIXAAHhsWZcgABFS4r7dv3v6XrfNiwQtNN1DUnStMtDUD7XeZ3zAzJVr3p2OBHYPj3Sne13xT+LyglFL82Vt8dL6w/4PnD5EMlY5L9Q/Uv4eEK/yPzjV/fqlRjXnfoPokeq+yhbD8yN63yD8a+b3tfDZgWvzL4o/+QJD/K+iPpr/cQ+vtr/w/63gj9o+nYtpm5BZQdSvG/ivjVSo+R5Gj66+nY9kG2DWgXACW/Qv5JQoNcTGb82VZQXi72+2C5j/LAEDQj+be+dXhVcSyP1r+W+vsigyveKvk7/Uvg0TUuUKi0vt52MJiy1g1NhDUd9zjkPtQu1KP07A14KXFdj8VKCPnj5Zc+PgT8KIhPqByVY4P0L/LBsvtXWU+8voXSJBxgWBUw/ZPk94Q/sf3vWU+1FVT/U+YgTT8/fJCHpigVKmFQk0A5SDPpygTYkk0Vc4HenSjNAjT2LtjqTAwtHyjCwDwGjTCsnNQzEjDIwg/+9ReS/To7WOxRcx9SN/Xkp9K1Xrs59NFwRKForF1Pdk3tEqzeqmPKWoI6Sb159VSCUeZN/Y37Eprj9oxIqv1i3vZNLeyQPYF4JW314oWKqig0wB+MtVj75AQfwFO5jUiKnM+KyTJj74d/fpMmwMOPydNd1uP+zMi+mlInU1iSdbWLJ0F5vWOM1pDd9SNjNtazXc1edUIEpkFNVRRto3TOZS/ePY0LW21jvoXUK+q1av9tjC/5Mii1rlU5mgAPf1otC/VvkJP9+gf3OMD+204P9D/STUL+Y/ofnFVh//fwYUbfWVIX7BLNXKUBMKdXMwuDeYSw12Xd4SxO0RLj5ZN+7j07Ghxh0HXDEtt/Z8g8ni+Sv3v8uijvjb82UVCTPuPv/0Xkr+Kavxk1Zirv4b9u/7IIeG6UVLl/5JMb/1oKr3y/+xH1veO4x/uPfQABE7yABSXwVioAOg+A8FuKoI2V+53yy+XplZKd/x3eXznqcmgDQBJX1VM86QQBN7xwsiwHwBtXy9MDXzx+9kG7gJ+FhSx9nIBsvwoMnX2oBh5EbgiwCaATP2ZGqIEYBtakG+H/2Q+dfxoBWLHEqjBF4Baujw+tamm+WAPsgSlSnmYgMe+/XxW+9b3W+rAMMohSV3MhgF2+zxQLYvbxw+1/xFY/f0VKQ/w0y3MX/sOHwn+4pWj+rMVj+YOWZMvHz0M/H0E+U7DR+8rgy+E31rU5P3GSuP3e+fOg8Ikn2gBIGn3eFbjk+FagU+9b0p+IoGp+Gn2hUWn0AoJpVrYZpRLkqZTJY1pTWAqRDrgtLEdKToz4I1RCCINLmC0vBFlAhHGMAL9nFYGQNpYcrm6i5QMyBsoFQ4BZVrIEFgTKIgBVY/6DrKN2hSBVpREABQOtiRQJKBRgDKB6QNqBVQPpANQNpY9QOLI52njKVZT4Arn3IAKZQwqaZTSBTQAqBDpSdKuQOLIQRDGBdQLkoEZQVY0AHxAP8kKB1IGKBEmgGBYiWUMYAG2BIwNLI1wJnYDQKjQ0wMdIiZX/QsoEP0CwMz6qQJEA2wImB/oCaA+wMOB7cGOBDrH6BgwJWBwwPuBxZFGBQwMqBkIO8AUwMrKzwJEAcwLeB9oHrKEgFnKcsX2ArZW9M+wE7KHEH2A45UrAM8wOApURnmCxnLAzZSu+M8xbAVwF7K8FD9YeZgP+ijh7YobgyIyP1R+6jlHYbIKcBKPxcBujm5BYDnlYdcEKI3LkjcvrlHKTZRbKbZQ7KXZSaA45V3g+wAOAzAhnmnZXLAq5RXY6LhMc0JlUAS1BkIJ+FkAZjlp0FjiYo6HgPY/ZnPYe5QTAB5VtANoKvYhHjccp5XXmfwyRYAI25uQIz5uoWAFu53kJGs0AqcAFT4uH5TFu35Ulu0zmluyI2KQqI1zYsDGMsGIxqsb1DVuGDHxGftyJGY0B1uaFXeoFI0Nuio3wq7APy27dygubI2tu+3ltuklUWemXE5GLtx1GfI2fu84HLBYKA3CPtyz84o0lGC0GlGZIzlGz1FDuio2VGKu1VGmlWv2aT1J6jcAYq2o0Mqydz2e/zyecho3TuhUEzuZoxzuloxcqblTtGQ9AdGflX1QLowgsQVRCqKLgaOBYLPEEVSiqT0ECAsVW3B/1XegYD1IeL1XIeBExge1D04OMeyyOPB0KWqhwEOjh312n4MKOvi2KOy+3r2gB08O4q2OWq4hIea4HvGkDwoehE1gev1SaBHjlleoMEBqwNXkAcEJuoDYF/Ys4DygVSTKEcgD9BDoiWgR0lPiQGGS6vShSkjQCJEOENwAFTk5A90DVYzUiIhz0FuKKUioAi1E3guEOohp4xng9EIkEUMRqAcQCs6ZAEJYbEP3ABomXGXEMYAuwV3AWgkMAVnQohVEP3AqAFFQmgFQAnJBE28EMwGDcykiNfgcmskW28mARu8d3n28KfmI4PESLCrQX4i3UEEikAWgCVYVgCu3jlCkL0y4WSycQQjDNg/Xg2cFHDNgywC7WbkNm4YQDyeQ4Itujj2u2plxYepTxV2HDw4mXD1Ou9syPavx1ke/jwJegT3peQeFaebLzh85LzOu4Ozih9TzkeKkwUeS0w8uK93A2zLxSeGj3Wu7L1P8ypyye9YJxaKwms+pgAe83JRjBAM0MA3KEe8C4GW8W4F+iD5nMAZADXAuDHxkHgWwiTkL3m/YX3Btj294zR3LW1AUrW04XAis4QzQXRwjaNUOyaHAV9kTEXbWUK392aENuKCUiwhTcFwhGwHeoGELgCZyDwAJELAgyCCn0QkJohJUjEhu4EYh+UBJAo8BuhHEPHwYkLVAAeV4h/EKoAskObmwkLkup0JvAv7GUhvEJHgiwz+h1EIUhSkJUhdM3eeXOBnEg0JgiSkTb8hkGWAN4EoODkK9awzUS8G0MTaW0MRWH0HQhe0JVIf0KOhBENhhxEMWApEKuhkMP3Aa4FohlMIYhbTiehLELphYEEJY70MN4n0OAs30JEEv0JuhIkKZhEggkhYMOkhhSRuh0MOUhp0KXWIQGJ2pEwChwHQ+g9UMahKAWahMyFahfiHahpYW6gXUL6UMhF6hzflEY16BRhcKGWAPvDmsrkOAEXMA8haMNlhPkPqk4cwmhmXG2EpZxVmDx1YepL3fWEUNsuVTyhOUj0pe3T0HuCUMBO/T0i23ZzGeoMAyhMUPim2UJC2Ls1peSJ2Xugz1+usWxZeMgTShvg23uVUK5eFx2dh2MIMuDYDnMJvFKSmAFVQMYKRYaBBjBny25e3kwRepsnvCGYUtkqRxy8NjSPEwMJJA8IGJ2B4PNCuTVgOmj0p2U0KQOrR1mhqB1H8taxqay0P0uDB2KC/Xl5aWaEAADCCAARuBnJoFIf/GpDDoKYAfwCBCVdrWgZxEWgbuMkAyQABAaoIWgyQDvQhGEIw0+hCs+mtD51JK4AHUHaE+/KLYNAg+FGxO1CpuKjCLEP3DyoYPDe/IBFh4RWsUDu0ca1ugdJ4ZP5a4YHNZ/GtDZ4YyB54WuBl4avDs0OvDFYZrQt4TxY/lqgj68HvDnsAfCUgMfDvvEWhz4aBCkEXWDJtm2t8YcdJIEb0sGHneF0wrRFGJK3CwwvH5f4XXdi4c/xS4eXCjLJXCapBAjqakXDjHg5MzHpgBnJrVxLHs4AgullcfWmAch4WOFkDsG0QERBFOjhgcp4ekcBFjeMcJjeD8JtA8qHsRN4HqhM/xjg8QJvxgEJug9oJmhMkJkYjEJvg8DEehN4AJhMVoNhNwHloioHpQ8iJh+MpFrjD42hQjIVkMclmjvCbcNeC8Jq4ioIQ+CsJlhEsES7DbYNcUjANygZoIKgjAGXDSAEgBAAIqAdiIqAvPW5AY4EAAgIDWfZuaG8UdzoABQDYATQC3DOQCAAekBqAIABnQHMEwAAqYb8Cse16BH20iKxhRTX/hNgTkRI8OARzgXHhYCPnCfCIsOoD1vGQSIghd4N0RcD3egCD0MRCExMRaDwwmGD1sRliIQmeDx08BDzQmRDywmoEPAht4J0R7iN+qAezxhviIwilEgCRmiOCRkEPvBxE1lhsklaRiuFsmDGxMe/KGERoiKtCzgDcmEiOseX8I5cC+BESso0oAoaGu87IBnGR3ggqXFnwh4GQaA3KBkI3Gy1sWSz68SoQ18zgD8hhvDhR7dQRRd4mRRcvVoBk0EVAUlX+R9oiBRbkxBRSDDBRC4AhR1fWhRNN0emk6zEYe8I6RE0i6RCiJ6RHR3B84CIbASMJWkHEh9okcPban4mewHKMWs3Fx5R9QTG88MJNCGkOQCWkJkiYwQwC7YRwCAAHLGUAKjxGMNCMWrrxbYeNxVQroA7IC0cgEUyiXlr0jlEZPCJnOs54cPUdfWu0jRwgyi9UWc4DUSyjVfEtCBkWoixFjFJ4EYgir4Zkt4XvKJ0EQEiN4UOAcET+JD4QQiZoEQiL4XNYPUeQjyDmj4ZxMTDMIaTDDofhCiLMLCnnhdCyIddDKIf9DboXRDDeA9CWYcxCXoRmj2IZzDk0TzDJIT9DBIYWiAYU/cPoaLCpIRDDJYYpDpYQSNhUUOAhGL6jIkQ2CHVlbCu1oBJbkR1AKWOYhUgOK9Nrqwj64UBJ+UVD5TYWjD28EIwKZE0iVhE5CMYdOJp4c+E3USvCPUSPse4bBIfUUsdYUdxh94WIwg0SfDQ0SQiI0arso0VQjYYLGjoZPGiM0eTCk0UDCO5qmjaYTdCGYXdCc0XUA80c9DWIZWiOYZxDuYTxC+IfzCK0XJDFwIDCa0aDC60TJCG0TDCZYV2t5YexExUSVhK/MlBuStpCZUXJEJglgFFIqcjnEecixkXsjqan5CTYTY8vUcZtmmnIc+0dJwnIU150UXLCvxHnCyMb3D5eirC8Ak1CjLC1D7BFrDioJ1D5vAVADYWxUjYUqiFwqqjzYcyFC1uNCmMT4FZEdaiZod0i7UaAijUf0jIrCtCOfDAiLrIcjb4RUFUVkTDdoXGjsIQmjjoYRCCkUhVrQmmj2YW+js0VDRHofmif0aBi3oSWjAMeWj2YULDH0SLDIMeDDoMb+ipYbDC3nnHcx0VJBEYZOjbNu+I1UUuiTZM6iS6qQcBjuhFtMdpgr0Xpib0QZi70YmiToWJDzodTDLoeRDX0YzC3MeXwbMd+j2YQ5i8saWi+YQJCXMeBjuYbWjPMRLDvMY2jfMfBi2pIhiqMdRNw/DZ82MWrCOMRrCuMQtBtYbxjuoQJi+ocbCSMRDwKMapjqMWqjaMY1ijoKKiWsUr18wqn4TIV7Viwm0EBIhAFOgjAFegnZCEAnbDxsdRMRoeaiZEZaiSmoAi5Mfqjq1kojWUcpiPAtQij1tjCXUd4iL0ccj4sRaERkTsi3EdBCjoIAAR4CkkTiLex2iI+xYSNwYxGLthoVXGA9IQ68fKKaxxaEekNdwHhddz5RsMGVRn8OaR38KLWUmJG8MmOOcZ2NtRF2IWh4bSdRc2N8CD2J6aN8MGOz2LOs8jX+xISMuREyOgAP2ICQf2LAhZDwBxoSKuRGzi3RSsIRhE6KPE3cPzhuXQWxxkPT8y2LMhOfjWxFYWEim2LEi22Iqk3F3Ia8vRQxQwSlR4I3GCekKmCXXEFxgAVMhfETFxFkPWxlYVEipxHEigqIcGdsMcGP8IMeu/ixxdgRAio8MUR+OMdRKmMGRl4OGRzOJcRFyPGRGdSmRSD2MRaQFMR8yPMRsEyWRuD0sRKE0Ie8yOIej1Tdx+GN2Rn2Plxc4ldRFiCe47qLmsKCP8x3qO3hu6N3h+6NwRh6PwRx6LEYxCKjxpCOvhCbSORLGzmsKQGIxmyKjx2yNZxtOJoeSx1UWxGNGxRaDpRsMn8Aj8JUgyMh6kGqKvglGL9RPYCiAeePFenkL8xEmItRI0gARnSJtRFTTxx1TWuxMER6OU4I1O6mOQi3PjXRJeM9R8OO78O6MwR6eOpEAaNd4R6MIRheLDRgUjPRMWPKCm6FnRfKPd4NGOLx3aOmxyMnHxHaNy6/hyGugRwlqou0zh3fkmuPL3lEM12BeCR0HBB+Nv2mZ0022myJx2+NHRW6zDwqTzAJQcw5eOj3Yu1ERyCR5joi0z3DOnOLseiLzLOt23MuLaOSC6LzQuUUPsuMcOc2ccMou113yhx00Kh2Y1/x8omjh721ihn22TGbJzFOYcK7OB/GKhacNKhRBIyeKBPBuWBLYQRjyZ6jyOOG5jxcmbyKsezaJFe8vQQJOBJIiEzxMmqBNdh8FxChLjyeOg+J9h56z9hE0wpeZFzqe8cI4JI90JeycPuuXsNzGkJwMJmUKFOd6xFOVFyA2zTy5OKcNXuJULXOML3ZuiEVE2SGLDwTD00JJT1ce4UOsuIWPrO0UJYJscLYJyU0aetBL+29BMsJxFxsJeswoJPx2iJDTycJ4WxcJkpzcJvBOR2/BMYJ6T2zhrF2qhEN1gGzux88czx3OmV3kJSczFec2IleGzyleBVwvOwLyxug+MVeoWHxuNVxfOdVw1eQXXOG2r29Our1621N0Ne/5yDO3VxAuvVw3WGONwJH+L32IuxCORBP/xdcMAJgL022s1y9WiBMZo4L2Wug+J/8ShOzqcLx3xcBKChbsObuoUOCJc2N0Jdm30JKRMiJlBPSJuUNcuHm0UeCRIjhhRJ3a4TxnuOLz4e0TwThiULieyUJ+EiTyGefBMxOVhOxOKhPiu7Fz2xNInKJ0cwFeyrwyuCzykRHDRWeb+Pw2p502eLRO2ebRKvOZV24AFVwfOgryfOZcz6J5zw/Olz2GJLVz1enG39OHVwmJdNyeeDNxee5r3G24F3hJ6fUf+2fQEu+fTPuo42L6k4xiAEl1nG0lzr6j92XGTfXXGSl03GKl23GXfU0uh4wAeQ/T0ukWNvAnN0BGu3mBG95TBGgt19BGaIDBA40/Kwlwlui4F/KiIwAqxgxNu1fVAqit1fQEFSxGqtw+oTVhss1jy1uxI3KgpIz1uGFUpGRt04ANI1NueYPhJTI0oqdtxLB3ALtuHIxHB1G25G1YInBAozl6Ioy4sAlWbBft1bBFUEDuHYJDuuADDugZMUqkdz7B0dwHBoLzmxCdwTJeozmxM4P/uc4McAWd3NGud2cq1oxXBRdzXBJdw3BLo2yCH0gEs1dyIJcONgJRl3OJGhLJOWhMpOOxK3uJBM4eE7XIJjxLSJwp3YJsROcJ7xJaeDBKhJBk2YJYO3sJLZ0cJNBOXJBUNXJYJNTh+RMhJzF0qhJRNzhZRNvAR9z5JufUEugpOEuF9zEuZfWvuklyr6d9xkuS43kuL91lJb93lJH90VJGl33GWlwH6gDyqEI6MtxAWPUJJl1HJQRO0JWJONwU5MihM5KxedhNYJC5JiJmRLcuK5NcJiRK8uPxM6egcNxewcN6eocPMJAzyPJ7hIhJeky+JSBPPJnL1XOt2PBOXQ3bwCXRZJeADZJQm1pmRBJxhF1mlky6AGEPIm4wIwnlkQviyuuon4ElomEECglNEUglcASABkEVonkExokUEygmu8jomAAzoi0EVjTdE+ggdEm5m9Eugl9EIYn9EgYkEEwYn8AVghmQ4YncEUYi8EyjTjEwggTEYQjLUKYlyElYkK6HPSzE7lKLE43ENSBYh8pXI2r6pYkWg5YnSE4FPRJLISBW8KwmO8XiRWUzT92MfhmxcuMip/ZJ6mFxOcecFPHJRxO14oROOuPd2qevxKIp/xOpeMTyBJdLyJeKULXJSRIyGqFNSJzZ2HOrZ2HuTTxwpORMopeRIxONFPXJKF2KJDFL3uBxOSuFRNSuyJPSuQrxqJc2IRuEw1HxBGzx6uJNRurRPLJ7RIQph0E6JjW2quqr16J6rypJjVyGJX50JmDJP+hTJIG2kxJNePV1DOfV2WprWKTxkZ332P+O6peEVWJUCN0aGxJl2wBNTO2xJypHKD2JAa3hJhxP5xX3AtWkFLOJJWACJsFIrOAhLypHj0xehVMIpRhKpeJFPxeZFKShlVNBJnxPupwO2SJb2y3J6FIcJi5KwpbxIPJuFOUe4JJPJXVLPJigRzhjFN+pg1KRJZhkfOsN0ipOV2mpOJOaJ81PxJi1MJJCrzvOSM1JJKJOdOpc1dOW1Pa2O1LY29c0puB1P625yDbmxr1ZJpr3ZJtM05JLN25J9+JCAu81mJB8z8Jcywn2Shyn2ORzL2ah2T2TOwX2P4P1Wf4NKOXOwMOG+xkO0F1OJQ5Oupn+KjOd1KdWKuyAJ5ZJAJZZMHx31OO21NIUOSq2sOyh2n2b4PyOTh3n2Lh0TWbhw52Eh30O6+zz2ma1t2fkNqOo+MhuQ1IpkmfDd2Yi3GOMzRexUx3EWiVLmOaKwWOnaxhW4e1ZuIx2kkoax1p2R1fBH+3fB6h0/BcazT2Ih1NpOh0jpehzX2YqyYWm+37xv1N9pNOxfBBK3sO5ezrpQh2/Beqx2W7O2pWnO0kOltNjpMDXbwcDSjCHe3QaXewSWve3wacpAH2aSwyWm6LMOqtKoaqzUyOldP7p2uy1Oay1JW5rSKOzdIjpk9Kjp7dMYWti2tpaVI+ewuy+e0Z3RpSQUepNCIiQrtMHxILz+e6pwzOi1yO2UBIGpvdOL2Z8z1pM+2vmIdOEOl9PHppuyNWU9OjpHdIfplR1OWCdJ2OsqzmJK4R8J0GEkxttOUk1uMDak4XOxM4QXxE/idxSdKzxLTQSpbTWipMXmIOsbXXxpOLLxWmLEpVB14p1dUzpkiwD2TByzpwoXmOCzXYOWK0sOih39putOrp/B2Dp9dM0Ouq20O19LN2SDLvphh1523dML2T4KPpEDMkZg9INpc+1gZJtPgZK+yUZoq3vpjS0zWJhzSQGtOgJVOw0Z4jKrpA9NPpjO3Pp8azgZYh1bpHh3KOXh3Lu79O2ug10WJr9KdpvzwU2ytU/pd2Lle7tP/pnF278XtJAZl1NV2WtKsOhLXsZJ9JSuZ9IN2F9IMZbjJvpbdJMZKjOb2PdJqOmDOppwD02c6OIIZ0mOOx/rRnxOOLnxZDInhi+JrhPtJ92mmPJxcWOFCMK04ZqAm4ZQvl4ZtDJRWdjEEZQe1kW/iKWOU6zTAM63WOc6wXW2x12OYjxXxCOJ8OXhIWZ/hKcegRPBptFMOu5TzeO05KW6/sJqecNKDh8UNIp7J3Ip4cMB2g+M3JAW23JjVN3JzVLiJwJzapxNOPJnVNR2IRJhJqWyme0BL5eqGzppZJIZptRP3OmJInJ9eEaJyNzmp0ADRuOz1oGRJJJJjpzJJpz1fO21MGJotO/O+r0ZJ9z2ZJjzw4pctK4pT0gMun1LkaCxM+eQR1GuDq3Guc2NCZzFO1sL1MpZCpz/pWthiZTFIVOf1OwZxxMBpSzKgpINAypazJRePjJeOSFN9h0NL2ZRVIOZxFKOZiNJOZyNIsJaNJqpG0zqpc5IapFFyap8j33JdBMPJTzKoppNNeZNxN6pQhPamIhLEoszxGp8z2GGjNKBZBLOrQ6zzBZrNIhZC1N/pS1OBZESFWp3RI2phNxOGmr2pJu1OueoxINeDwwAu0gymJZrwVpexy5JUSxH2HYkJONUCsZBxNEZftKSZx9LsOjjMEORtLDpGewUZiDNvpuTKtp3hxtpg5OYxRLJfpJLO+e5LMHxtLJWGP9LiZ9LLBeEBOzOcTO6cFdLsZCbNyOKdKcZ6TJcZmTJKO7hwAhnjKAhIBwKZbrUTpDRNhgp9P4Woxwus3TIECvTNza/TIEZBdKEZIe3kWYew2sStJEZ5dMPpjbK0ZDjNSZrbK/BGTLHpWTMUZmbKAOvbJzZBez8JDbPjZm7JSZLbOTZzjMbprjM7Z7jO7ZUhy8Zma1b2i9L72qDWXp3e0SWMSk/ZG9NSWQ+3lxUbPJ2NjO1pG7IjWibO3Zt7LbZ97I7ZZtK7ZZRxfZJ7O8Z2BMAWX+OCOY11COjrM0akTJye6xMU2MRy2JsdwtZVgxrZEL1AZmC3A5l7Mg5zbN12H4JHpe7PkZQq0Q5FtJjpFRz5qJyz8JduyKZFy3NxZTLzZFTKnx9KOxxE4SeWc0NDafSIoZN2O5JuBw+gfDLOQ3DNBWugRYZPiLYZAgQ6ZUWJoOMVP4ZniK5CfTNmOOmJnhF1jYOC7JhWB9NsZNHLf2dHIcOw9JTZcjNcOLHKfZSHJnpHHMea/bISZYjKs5thxs5Q9MNpd7ONp+7MfZ2TI8ZyHM7pfbIsZkPGjZdbIVWlnJVWPnP1ptdP85sHMC5zHInph7JyZx7PC5p7I2Z8xPtp/jKLZb9Odpc2IrZOHPCZ71JI5/1I6gjLKaZauy858XJUONdOkZjHPbZQXIQ5znLY5KDLMZLrW45GDPTqxTN/mFuI5ZVgUqZ9y1OxYnLaOzKMUxV2Ok5S+KZZDdyYZjEUexm0L8RmKw4ZWnLGORB0M52dOM51dQU5I6znZQzIxWREhpRadNWOs62raWx1lhszIr8RkK1xIuJ1xOsPLCQkWshhuNrC9kMHxZuO0kc1mmxEFgQsw83X0o808A48xmo37EnmS82B5c81B5rr3tey1Eh5YAHVATEDXmYAHExPWzu5hYQe5JYXaCL3JEi1YSNxMuPm5663+gYmMfxU2L+EfeKch3kLlmgWIgpw3LtpmGHQ5jtOWJuXPrwZbKvGpXNI5Q4CrZc2Jq5WrQOxpPLq81sJKwFPLVRVPM8mLeKlWIsIwhSWIOhKWKMxyaIyxZmJfRv6MsxyaNzRTEMKxr0OLRJWKcxwGIqx1aKqxHmPFh7MJ8xMsKyuiuLQx0qKfKukLlRODFSpXLJHJxT3WZfLOpOArL0JQrNsJ9VNeupVMBJSNOBJKNMLwqUJd5fJ0xpoOyuZONJ3JeNL3JWRNap311yJ50y1ZTFzeZyBMmecJNmWJWFYxXJU6xckW6xbUJ4xZYT1h/GMu8Q2OExk/lExkbKG58zJLWo3LLW43Ntx8mPnx9TNm5jTJXRkXkF5ZBxW5FOP4RUvJJhyWIqc96LSxJmOfR2WJV5uWPuhn6I15bMK15/6LOQpWKAx5WMFhlWNn51WON5MGKbRqkJZ5BT0Rx7KOCxkvK5w6MPYZ1jM6ZVPI75lCK75z2GvR+0LJhqWOMxZ0NMxNMJH5oGNV5eWPV5rMILR9mO15H0N15C/N/RrmIgxkkJqxJvPqxcGLvxcfldamfKVxJ3nVh/ojz5HUIL5fGJ6hgmP6hZsBIxpuJ2u+BI9hYUJ1ZbvLuJHvIeJ2NKiJGFIyJ0fOwphNMeZ5zLiZlzMFOEfJuZUfLuZqrPiJ6rJ4JCfJeZSfJ1Z7zN3unzIGpuDIMu7CJsEnCLO8JvDtAvCMoZROPXEldwwJjCJbhrgCRhbEjucHcNGgfONZZzK2IYAnKBpl0iIZ8iNxxdTKk50ERb5GpJysaKM3xG6KIJe+L3Rn92Px+eNPxZ8PPx2aEvxvTVaZ7kIakneKfhwgQkFAlkXoH8KnR+LMr5ADOr5wnKtRonPr5pDPmh5DL0FDa0J576x4FUVMTxDPMXh66NTxMBPUFX/DMF2eIsFAEhPxIaLPxp6MSFkaM75y+L8FwNMww7golsUgugAsgqUF5TK5xfAuuK+BC4RMC2EF1cIiF3fKvg9yMk+QiKkJYiJkJHyJ+o9vNKZ+DME5mOJr5iB2qZE3LtxU3MuxDqJURhOO4FiVVdxdeJpxnuM/GBiJ9xoE39x9iIWRWD2DxIExWRYePWREeJrxgSOjxoyNjxQOIORy3LP5bTMjxRwoWFHuMIx4SJ3CE1NpGMSLiRwAASRSSNSR6SIZQmSNIAOSLyR40DOh5PWKRpSIIelSJqRU4HqRNDAMhXyInxR2ICFJ2NGFwQu0FoQqb54QuYCxTLmFZyJOFgOL0RkyJWFViNmREEwDxeYC2Fqwt2FayNgmGyMcRWyJZxiwvuFxEg0xFwvLxIeyZxtwoIxceJ7RjGKqFXtzaF6BA6FIiIse3Qo8mXyOxRvyLxRAKNq4hKOwAxKPFQpKK0EfcEhRfiEpRgO055FMhcAaKM5FSKLlhKKIxa8KM1FmKPkJootxRvnnxRgKIr6MorUG4KIVFFKKJAVKLhhyx0LQ7eIRFsmLGFDfJ0FSmNm5TCLucXKPpQT9O5xSOOCx0QpjZqCxYRyQuLO4qMpumkKbCVvNbCWGP0hyvEVRO/LL58MJGh2sjzEWqJ1R00NdFIQsk5HopEYJqOHRx4EOxROM0FjKORFuYpm5aIrqaswpzpsQtAhKeLXhSQrp5KQszx++NVFR+IyFVgqyFNgpyFjYryFlwpjRiWKv5hmIpheWMV5D/PTRT/LH5H6IKxU/N/RxWK/5X0Pn5AsN/5S/OBhK/PrRdWNgxchOD53fjbR1DM+5XS27R98LmxA6JWgQ6IaJtPKr5RQuIxAYt5x/g1RRxeLnRLQt9gB/I05BguaZG+KTx8Qq3xO9OUFHKFSFc2I7FXOD9UXYtPhReKOFW+P7F5eIv5Q4tvR/fJv5CvPv5WWMnFmaOf54/NnF7/MzRC4oAxS4ucxi/IN5y/KN5m4tAxpvJ3FLeLAFmtI+gFvOkiKuNlRCkTu8uGOpxdwo5FKApGxT9LGxcvQfxaoToxb4lmxwYpYx7WKz5NfmgFm21gFT3ML5iApL5SYpCk5fPURovgGFYYqGF8IqqZLoqRFtTJRFugvrW6Itb5UVPb5V+IoO20N0x0vOHFcvNHF6WOQl5mJyx76OsxX6LnFH/Jn5wMO/5K4tAxf/MN5AAtX5W4vX5cMLEFPCCCx94r35dsPCx2El0lhgpaZsWJ6ZO0JMl8Erwh8vLHFlkuV5U4pslySEwldmOwln/NwlvMOXFIGMzRbkqIlHkpIlmaLIlImwolRklDFzYvDFPASElkAu6CXWJgF3GLgFusIQFg2KNhbEpNho2LPZTwqkgywCmxUOKtk5UuvF9POT8XEQLCS2LXGouKe5lkI2xNkK2xLYVEYXkLklxYoOJpYtnxVa3dFlYu0l1Ypi58kr0lPEtP5zIsnZr2OOF72LZxdOIZxhwqxFJ0obxj0xBxxPLyAYOIhxGD2rxKtJhx3PlIx3ItoRNPLvFiMjTxLSOWlwwt1RNTLWlmkrzFm0qwO/4tWhGVlQk4UpYildSOlbItOFuIvpxv2JpF7uPZFQOLmZhQvp5t4pkl3oq5FgwtwJmuIx540se52PKshuPNshc0pRhASFSAEYrK5hLPy5xLO/xzPN3FK2zw5ABOpEHPKq5h0G55ntPI5+xJi5f4o+lW/I3um/NypHArBuqYW7J5shZ8HUxkw6VMd5e1yQurMqKJOAsim9xKxp4fMIFuNMwpJAoJparKJpFAvpl53VqpMNMMJjl2MJ1BPoFMfLIFcfPapLAtlOospVlx/l1ZqfOEJR/N4FwFhLhdQsEFz/EaFRln0FvkuaWJQpKcR2wqF7cP8AdiUUF+MqUleXNUFikoqlykq8szoqCFQbXLFaB1Bl3R0iF3YzXxS3Lnh34oQRCQsbFQsoJl9eEAlg+OAlcfEyF4EtsFUEvPR+QqcFvaMfhPgmfhFd1fhTcM8FIcl+laOITlg0sIZAMqzF6kuBlFYqmFbKJk5uku6acCILlDYuQRTYr7l26NbF5goPRoEuyAwaJrlvYtnl0Eq0x2cu9GDcPoRuQU24msglmA0qxlzGJqFAgorh/sr4R8uN5FEhMcmAoukJ7yMkRALPjlk+OTlqktTlJDPTlhqI2lWcoxFQyMul9eKWF+iJgmqwsJFXwsDx2D2WRoeIpFXwuuFgCrpFrEpJx4K1YZrTJZFqMpjxOIo8RjiIiRxsuk4w0BeFfiHiRuAESR3IE+FRDx+FfwqggAIqTEQIqaUIItMEYItqRkIrbw0ItRx7fl7lp8qE578rG5iIrTlGkpHlc4Wb5zQudxx0CvBx0qAVhGJAViDwJFfuLmRGwsgV2wusRqyNsRVIqYlEisQVZwuQV+0vU5RdOoZCCpYlQONoe8hNvl/IpeR4iOFF7CqNFOAHFFBKPNFwcBJRjQDJR1oqhRtopVF3Mv9Ruoo1FRUmRR80r1FPiu1FWKJ+Rxor4IposlF9itBRTivlFq8EVFC0GVFrfk0gDoqdFH8ptx/CuHlGct/lPONakxMjFl7+PHR30rxlQYrrZ/UvDOeYSQCqGNolBpMwxauMUicQETF5x2TFQctTFr3HTFYjB8EmYrr5aSok5GStHl84QLFl4qLFfcLUFicuHCA8s6VX8oEVPSqEVVYvBlwsoLhu3NQEdYqjxM8rrBJctjlZcsXlaQuXl1cpPRxePsFZONixg4uilffNil5kqH5mWKslo/OSlzMMn5WEqLRjksjlzkpyl1ELyl64uIlXmNIlwAp3FANUrxB4riZIrWPFHeJV2Z4pSApqJOJpcpFlX0txlyMIfFXiqfF1eK+Ri6MP5NYvd2sCOMFiQrWVIyo2VGCKXlueJXlR8ILxPYr2VuQvrlA4oSxxytl5CErilFkuH5qEuoh6EpnFdkruV+4Bwls/KeV+vNEh7krFhhUqhhXypKl9GJelMcqxVkKskikqOjFdEuqVtvIuleGOxFp0v2RUOKm4HEs6lh4u6lYvL6lIYtKVVUoahHWJEldUrElDUoklzUuL5QmOhVny0WlS0rrZK0qBl3Sp/lvSuEVOko/Fu0phlhkpYOUUt75lKtOVD6JpVFysSlaEunFtktuVaUvuVXMLZVeEr15BEs5V+Uu5VHyqKlfKp8lAku35DSsRkgUrulwUuHEoUsi8zqoJhkxyvgl/JilA/Nv5VMKV5j/L9V1yuU4qUqKxGUtDVWUvwlq4sIlbyoKlMat5V24v5VCGJuRCaq1VqsN1VOfPqlvWPz5TUoGxxquQFCqqUiG82VV/yrulvUvHRyVJPlUTKKFw0v/8o0uFxJMqx54uJx5UuPx5c0rHx/bP55MB2GV88qTlBzhSVxDPE5Y8PtR0yrBlBQrnVSVx2lCeKZFuioHW8MtpFhiqRl50upFteOfV6MvZxXdVlhywAel9aEhx06sFVsOL9FiaqvgyOO8FvhP6Fb8qPVvCrUlXSrPV03LtVMyqvV+HJvVUMvWh96rQVh0sZmzEq/VZ0pRlH6rRliMuwVmMuvV+bPyVpqsFRQqoPVhMvR5Y0sz8q6r1xEuNe5ePPe51GqiWMIuKVz9OGuhXMCZFLPZlaxM5lNLME1T1I1qETIZZ/Mp+p9g3egbYo8VPYB3RWZ1nVaGvhuBlxolyuKqVNvIYligiJlDGpWx5kOe55Mo3V7Goqk6zi+5Qys4V5Gu4VsGtr5fComV6SttVF6r/loio0RMqqulwCrxFoCtkVeYHWFUExJFFiLJFMCtUVBwvfVNws/VJGvlVG3MZF+criFhct/Fpgs2VQEpzxgaLAluysgl+ytQVhyuC6vyqpA9GOlVeGoi191WbxAqo5x8mr38ZUPWVx6wllWTzQJPZNKF30gJOX0hNC6mvFVmmpL8NSpwCnEUXVi2OXVjGtWxzGvXVM0ulxVMrQFqqv45lmpU11mvICgMuzF38vPVi0OmFogtmFACrc1kis+x0iumRyD3AVZiP81QeMC1NiPDxGwvgVq2s0V7OJH2d6pi19YqLls8sxVtGuxV7aLwVnivSFIEp2V2QuJVfYtJVMEuy1gUirxeWtC1Bivw1jeJD4xWuQ2SSv3RJ4q7xlUCKVGvlhgA+LrZw+JXlQ7N2xWXV8FVmsPV02sHlCGvtxYQsvVO8uDWucqXZl2uWV12tWVCWpxVWyrxVr2qJV6WpJVBkujRW4Fvx46JVpPUoF5PEtlh1MsVpBx1wEIQGOOpxxKVsmvG8vAjM1L8qes3LLBpvLLKendwqepBJQpZsrQp2ssj5usutlpAoNl5Ap5O8mqoFP62uZSrNuZKrJtlqurtlGrI6pjsvUeENOq1l5MdVqop6kpitMenQteRT8rZ6fQsUJ8msEJbsqllDvJgpTvIl1IRLVl4RNnJBAqeJRApeJgjylZFFJlZ+FND5Apy11NAp11dAr11KusYFRNOYFSO06pytMjZZWoVlnuqVlhBNyV2PF91J1391WssD1OsuIFyuv1lierV1ZGsm1U9wIp5svOu8NPFZNL3KpScLD1yeplOdUydl5NMTCF5KppV5Ka5w1N+ZfNMGGwry6ldRMRuzNMle6czxJMr0rZDrNVFzrPhZPRLdZ7pw9ZItOauYtPpJfp0OpGLOOp7FOeeuLI35ubMq1KgoggN1KWJWHJWJomq/pKlhE1xHNAJqot556R2hed2rZZizJf1J+o91RT2z1rdwhp+eoKpwrNhpFsob1OUJDhkrP950rKNlqos11/d2ANJhKXJ+uor1hurb1DFwKJzsropFNJ71/VJi53zKy2VRJhuI+pVVY+qmpQ7Jmpac2I2RV1n1nNLmxC+qH1CLMpJwtORZ6+tRZEtL/Ou+qxZ++tAuODAm2ymo5lFGuGQN5P4ud5IFJBlnPuwpKvuFfVvufiHvuslyfuMpI3GC4C3GalwgBv9xApx4zVJeOqlmtDC1J7oJ1JnoJQBwBAlVgilwhxpNFuuAJDBFpKluszgjBQZLtJCtzgY4FWVuCYNdJeI3dJBI09JaYJJGut0fQ+t39JOYNpGIZLl6RYIjJFflLB7iohlmA0rBz2FduNYKTJ8hJTJ9QDTJdouEqAd1EBet07BwqG7B4d17Bc2P7BH1Pk1FZPHBVZMHxNZJNG84OzuDlSXBLZNtGbZLzuvlSdG/lW8ZjPhoiVd024A5OP1eSqDlw5Kz1yL2Vlkurm6YRIL18rID185JL1wesTht1w+JkBo11tevl1xesV1pevj15eoeZSBs+6KepN1rLzQNMV3N1veoNZjgAEN1wX5JQlwacT5JFJYpMkNC0GkNX5NrBa43kNsCAApShqVJwFJVJoFPUN/kM6NINNWZ4ut6NPuq2ZtJ3d5ZBKGNRepGN8xrGNzeomN6rKmN4RohOpsoANdeqyhzxNANnBNOZ3BNWN7ev+uputz1jQxT5qhPdlA1Nm4bFPYNnFM4NVet4NgUJzp/FMQmssmEpfIn5Aki3Ep9yJEh0lJUpslPNE8lMUpUAWUptom9E9og0pWlNdEckXdE+lPYsrgB9EUYhMpm2zMpjghDE1lMEEEYl9E9lJGujlOCEAiRcpEQgCpFQg8pGgy8pqQkCpXXHzEYVLTEZyGCpJQlCphYgipIurb5aEi25sVJ25hgumOAK3YOyVKiWfQs1VyvU+NXuu+N2At+NNl3+NsuthNsxuBNtAqV1ixo7O2RMN1kJrmV1/Uj1pFyANhzJANxzKRNoevDhyBtUeqBq71InT1ZTsKhNLFOTptNL4I9NIINE6uWe9RMHxoLMI2NrMhZBJN2eMLPvOcLNoNS+rOeDBtxmNJL2pvp1/OR1Klp/rL42p1OmJ51NmJkZoZlDPLP1ATJZlxXMHxXMuzNqwwk11bKAZSu2k1T+tG1oGo+NwUK+NOes2Nk5O9NAxv/1nvIVZ3vIRpTer95FVIgN6usnN0Bp8eVBOVZeUIYFyxuCeRUIdlHeoxN65uUJ2JthJuJuwNMzyGp0N1y2hZse1Yw3NZ8mrLNs1IrNdrMoN1Zq5plG1rNeN0X1rrMbNDV0YNOrzpJPrPRZ4xLYNMtOxZZ1NeeIbJXZ4rxVpatPxZu9Jhq4ZwvZDXMDp/erSZu7Na5aXIQZKa2np7HNfZv8wz1PGow5pLNk2mJsOgbPPfWE5oHNjXQq59+vk1j+ugJYDO4OV7Kg5N7IY59nJZ2jnPS5GbMy5gEOy5nHNAOQcp45/XLoeiJNWWo7OP59DPLqunIZFe3IM5NptnZOdNM5ix0XZ7dQA1pdO7Wa7Li5Nh0a5UjOgZMjOcODnPDpTnJC5z7Nc59FsZW7xs/m1loDpkDKDp9lpa5cHLa5LdNctLnLotKHLfZ89LDZaYCXp8Sx72SS3/Zm9KA5nqLH2FnOo5JFr8tZFp3ZDdNS5Uluotq+yzZs9PZZ7+o6Np+odpt1NHNQTJdpt+repKmw9pcTIEtlHLq5cbIyt2jKTZ4loC5qbL/26bJotyDNMZRhy45XluUtWDO4tMbWh1sIpLFYyrs1p6ux1qItx1snIe1CnMIOtBxgh/RwcFEUvfFpls0tjsgYZ23MpxdptzpXu1dVRlsLpci3M5YeGItNltItdlvItOVq6tv4JCtGXNC57loitjKDh1v5oy267O85tlp0ZSXL0Zo9KotRjKPZcltQZCluit8s2i5H1ti56VqutmVput2VtkZkluct0lt6tyjOzZqHKolEZ3Kt5+rJZ2HNVFHFsGWNVrdpvFvqtv5satMXKEtz4JEtvnN0ZBRyY5eVqBtslp7Z8lrjpvXLlhg7O4Fg3P3VXCvR10+Pg19mptV82oJxS2optn4tU5T2KuFssKGaUWq4Z1pp0tU7JmOBlpaFc4mMteiuWOZ3PGZaxw2O0zOu58TJflY4GHNfGsqtAmuCZh+tVF4NXT1GLXMOmNsutvlrat0HI6tKXPutV9JctT1rct4VpZtDFsnN1q2xtI5ov1bFqHABNtGGXFohVxjWnNPPKk13tPT53lphtdtq3ZYlrs5nVqctabNdtMluetHttBtrNqUtfXJGtodux6uZvUtrux2lB1onZcMpzp+3OMCgzOC8wzLW5plpLpHBxWEttokZ8dvo5idqdtydu6tqdtRthVrc5b1o85LK3q5sNvttCduS5FFqCtgNv/BYVq65A1pb2UVosZsVpXp8Vr/Z69KSt6S2H2ljNA5sbL7p1NsS5zXIktv+wetPVoKtWXMztXttGtV1KHNvtqNt/tqfNESCDt62yJtv9PDtfMtnN0gqjt6R0ptmjNo5u9oCt+9qbphjMntnXP6tEq37tA7N45aiMuWqOur1oypUlcGs/lM1omFDuMW148qoZ++KWtWloZkynNgROiuw1AzXW5qKvHZctp4Z8VOnZe1uVthbXnZJlvOtn9og51nJ/tt1sRtB9pdtKNuPtINu65nlo7VMdsSZrVpbttnNHtd1o7th9q7trDuZtp9pYWkXLm4kNqt10Nu4dQ9t4dfnP+t9NuRt+VuMZJ9vYdb+p5tccrKtBXOZlN9rHNcTJDt7RuoGz9oatkdtiZUNpod31uutv1r3tSdqRtKdpYdqjrYdM9tAdw1oG5Fqo+tVqtm1kysc1C2rHlc3Nq5YUqw1G1r0VW1pltXTKIdkUvLt+lp0tultQEqtpbq6tqQEEzO1tV3K7WszLaNwqo/1t9uydousVlPRrXNfRp16W5o1lYfOoFCuqDNCxqvNCBpvNCT3D1c2LPNfxN8e+5rKph5pb1yZtRNKBtPJyfPopmZs8JJVuyaOBsqJxrOqJaJItNiRH/Nk5sAtZBotOFBt/N8r2oN3NLjJa1P5pz52X1xNwGJzZq9ZIxNueyFr9ZJ1NlpGFo5JF1I+tc20LZujtxtl+tNtJg1qtcuzJtZjo0Nz02f1mjpBZ4KqMdvKOXNYuo9NhTp+NUuu2ZyFN2ZO5uGNirP4evvLANR5rD1EZrztUcJmNXvMtll5teJoZtj5t5vj5axofNGxvTNyWz6pXAvfNBdv5eg+tGpw+vGphBsBZJZriZ0zpRutrPZp9rKoNHRKWdlV3rNMFsRZTZurmLZu9Zuzu31KFs7NBzvQtvZswtXKMtePbnnmdr3kBISl+cLr3B5sYGLgqbyqY8PJ9eRv1nckv2SyIb0jscqQjejwCje6vxjepbzjeOvwTe7cSCKSPJTeq0T9e2bwMAhaDldFvzpIo8xzeHSXiKBb1pcRbxRMzvwbsAMRJ+1bye+mP0IBGunVBxAKdirbyL+IoB0+0Km7eJJj0Bg2mY+ngEn+WWVsBGuiogwpX+U8pTjdqxQPU0bpjIsboI0CbrLYBH1f+nrtreBgMo+frs2US71zdSgLIMl31v+rAN3efxQPeR71CBdsFPeeboQ+kgOBiqgN8B9kDvevOgNMn/0beT7xfeb71MIH71LdHgLV0iX0veRbr50wH0UBI7t70XgIJKmANYBpH2Hdz31rU3rqU+E7vsg6H3EBvejq+BJSoB7bpg+07pXdwMXA+tGhYBB7vo+fxUY++gIveWWWsBBpjog4pQeCT7tFKRbF9+MZHvdcboH+PvxMBCCnW+8/wR+ErCFBvIM5BfdihB9nwFiEn2WYSpkK0nulV4ncFGgfAlOCI8DkACHtVISwHvIUZFgBrBmlMG7rcAsAHveBpkwBBpmxSzakCAsAAHdOIDiB7b0o9bgD0+JaWhSRnxg9nul+SfBHGAdKizyt7uPSg73oKzpmDdphHo9aBWhS441IA6JhY9osTY9HHpw+u7qryRiX9I/HpxAgnpIK/RQbSNpgrUrHvY9X6lW8D5gGYXiR491Sizd1SiTdMOT49tHqU9peX6KKsP4MnGgMBcsS10dHqNA+nzE+XyVE909j++QrkVK77sNK/vzEgOcQc9jwCc9WxXfs0X3T+sXx/sl/2UBFBjbdI3xveaXyPdmPwrdeHoK+8XtreXHpHk13yEBbgH3w27vGSY7ty9SXqQqOXvnd9bwXdB7p6+KkCK9I8jXdq7oK92AEq9PJhk9DXrw9c31IAC3zdY9Xv0Sp7pPdeHq2+mgIq4HXr+kXXpnUggJkBbgFO+mfQG9iHxzS0gNYB930m9LbpnU0Xu/+Y3s++330eKM9k8AkbrTdXRAzdB6kM9MZGM9B6hTd/ym2935F29/an29ehDEgObpLY/LhvdOxmYg4pUfd/v2fdL3tfdMZC8935E/d8im/d38V/d/alzSOIAcBmFA5B/ILhBEXsbdZbslMlALw9Wny7d1uit03xTw9CJE0AhPxa+hRng9iHow9vUDkAqHqx9pBiw9TbpK+jXp/eeHoI98PowUiPqnkpHvbeFHrp+y7tC+aXvoyM/1K9MXqdiCJGAsRPz+KGnqk9TxSh+ipV7SEPteyg/2R9Inq59JJh59oXxJ9Af25iEXu09UlifwenrHenHzK+/7zZ9uyiAs4vonekvvmI8vuPs36n092aku97BkO9jeVl9GPw29OxmO9YpRn+p3s+YlboPdvxHm+hXzQI4+EoAQxiUIg4x7+Vvs89ipTt9h6FxMfxUZ+zP1Z+7P2Z0E725+EZl5+CDn5+Nfy9igpmF+YRlF+ICVJyQb3tdEqjcKZBmBkHembiw+mRcwBCOMqv0n00+k1+hBDtUmSSdUx8iNdhv0B5ab2t+pbwtdxLlr9xv04ApvzL9drvze9v0LeR0Sd+jLhd+bv2pAXfyaA4bt8UW3qe953tK0xvv8IpvtK01vqLY/vqogE/ra0U/sPQN3qFAIf3G0PfyZ9+iW+9tGl+98in+9pWne9gDk+9/hF39/yn39CCkP9bWn/d82hxSSfw00xOh00MX06UusV6U+sXMBXum3Uef1SIBf3C0Rf120FbDL++qAr+5sXcBHOmtiMZjtimXuF0E70b+nOgF+Lf29i0Wg7+Q/pH9tGjH9/v08AS/pjIK/qogM/qLYc/pjIC/pwDV3pX913pH+m/o292/tty5/pnUl/v+U1/pjIx/u/Ip/uWIdAaLYDAbLYTAau9t/oT+YhkT92anQcy/whKqfqhKKrrDerkV1A7kTNc+rr1+KdiNdB/zXIWJWP+6JWrcHfrt+FdiF9auiG9WWXPd6vr50D/37Gt5MCBWpXADmP34BD7pG9rAN/+Bmn/+83oe9M3oPd1YGUNUAMm9BbqW9YAKQBzSTjsk3sS9avuW9iTlwBk3poDPbty+B7tIBeAJS9CHzy9BJTe+BgeEBdAJ9JZAOiDFHzndI8lZ9y3tHwHAK4B4ZKiDDPtre1Xpx+eHu7g7YJ4BqQY1U0vvLA+7oSDbgDkBi3wqDvil0D62X0Dy3vUB23y0BmpV0Bv330BmAcN9O3qfdeAYIDMZCIDgDhID4pTEg5AbX97iTu9g2hoDj3qwDXAaLYPAe/ILAf8IbAaogHAZjISwfN0Kwc+YgPpTIyjlB9OjnB9Fvs/IhPqh9TKml9HBgCDYALh9/Qe60QShI9eHv8B4hHR926kx96Hq0IOPrx9Xwcw9XhGw99Xxh9tweg+5PoeDbH0bezwabUZHrp9sQPp+5gZnsNAf99QZhBDN7xCIrCTQIpgZTiEns09iIcj+4IYlKJeTMDRXyl9XplaDYAP6SOKKjkhXx19WeWuDAphgBRPscAevt09aWgJDqJTh+RpVRDHJS7VJ3ixDkhFpDXhBZD4cCV9oP05DM/yby2gZ40Xpgd9tQaaAEAu5K/IdmD1BRlDkpTOD+gJ99M/zYDSpR89soeW9BKkqYSoarkbvo99j5gw97ntZiowfYM2of99YkED9/mgSBYFBA85pUWBXwKuBMILWBOQLyBjgB6BbpD6BZwLBBqwJuBWZXBB4wN2BkwJtYTQJmBLQKTK7QPAAnQPTK2wOyBzpU2BjgB+B4Yb+BAIN9DmwH9Dsw0DDEIOgc1QI9DVQPO0UYaRBeoCTKqIOdAHwMtK6ZWzDrnpBBAYYuBYrndDoYYZYcIOhBbYd+BCIKkA0YcgsBLHmBHQNdDXQNbDqwN+BhhCzDRwN6BJwNBBzYeZcbYeDDdwMLDPYeaB/YfNSVYbrKGZhEAxIPuMM80eMlHxnmVINbKrYFVBM80IgM83HKngG7kngAOAQkBCU8PL9cYABVBWII4gVwG2om3pCUrZSjdISk7KdEBCU45QeC6SgOA+AfSUTZWbKVEFbKVEHbKmwfSU54cX9LZW7kkwZbKjxl89ucEBAzIOtAhZh5BxwbUcpZg0cwHpwj+ZAFBaFB5B2RFFB6jiHKo5VbK7ZU7K54YVBk5WVBM5QWMcsSuAo5UeMUoOojsoLojE5SVB05X2AzEfnKOIKXK+IPPDPEBbKVECuAowCfDIkdkA2oPhAuoLs6BoI+A6+iTctoBTc25Qw8FoLoAVoJIAdoKcc/FGPKRHidBKPPPKroK5upSI9BII29BOkOFu0AEDBQQjMN5pJacYYKsNgFRRGctwMsdhtjBSt3jBGXUTBbpPgqWQVTBalO9JXhskqPhuzB4d1zBY0EIq8hKCNZYMjJeQbCN59qOgkRthg0RsTJHt2TJ9RFTJYowzJKRqDuvnlzJ+ZKeg2RsHxuRsq5k5oKNSdyKNcTJKNGd3rJC4IqNed2XB1Rs8q7ZLqNZd0CqTgF3BYVSTpkVWiqwVTPBR4N5JghvPBKEPEVCMqwVGTU85LVrkd17Nbt/DsYd/9oPZadvdt09uYW6iqmjcqvsYQTjPKKu0QhEFlBqqELkggiNt1D8q6FDut6FGjrR1Wjs/1SLwIJP+oDtxBM3N+VNKdUepgNcZrgN+NKRdtspRdeFIadsLt3N8Lt111ToT1tTpCuqLrRNIzwzhOTvGeL5o+ZafIJOzztujILKV6Wpy/NqJNNZ4zqZpJBpZpU+rZpM+vmdc+vk1NBsJddBqFpcFq2dKLP2pW+slpBJrQtHBrG2/ZuhdHzsvtOjsw5lzuej99ql2j9srZJjvudr9qzOFHMFli5uejjdxXN3zqejcMbz1r0ahpAJrl1cLtgNVspDN+F2PNJJqE13xOjNAcNFZJVJadYLsTN4Btb1nTtTN3TvYFCMc4FSMa+ZH5rzNBZuJdRZqINAM1LNVrPLNBMapdRMdVFCzrpdEFp5pdZvJjDZuZdVMdZd2zsQtHLvpj0tIDZPZqDZYF2wtDRPGtdlsxjY1LGdo+tJd4+rxjk+vINk4JedESC9jcTLJjXnQpj7rM2dwcZpjbZrGJ+zr31RJuZj+Fu9tZzt41FztYtMsY6gPMYTOfMfmdAsYf1DzuppKMegdrzuKt2cdydnbW6Nj0c9hRTq7uGLwVj/pqVjX0ZVjYMaWN8T0hjAMYuZQMeBde5sb1rTvBd7TpRNdY2N16LthjmLtxObuqzNKUZgGhrM/NeBu/N9sd/Nk1Kdj5LpdjQFrdjlZo5pYFsWdPseWdLrIFparyLjvA2pjTBtpj7Zp313LsrjOLOJNitIj2pZuLtvY1GjBxqENRxoDEJxvENN93fJUhs/JUpO/JV0F/J/iH/JFgu/uKhueNaht0ujzrO2WhrMj2pJvKehusjGGKMNRpKhGQYMcjDUnhGLkaRGbkcjBHkbKs0YIqsDht8j2I2cNGtw9J4Gm1unhozBEUapGBZOnMZt0CNoRrIq8UeSjrMek4aUaYqlZPduaGFDJjYNyjvtyyCmZLKD3hvSNr6EyNYibKjcTIqjfFqqjsZP3AidzduWcdRjESHqjdZIbJi4JajVRsLu7UdqNpdwaNUVhDl0mD7J4saXNKzMlj3+tHjvzv6Nb0bwFmsvKdcxsqdoJrad4JsNlJ5pSjjTuKpzTvXjBsbMJSZu3jYG3vN6JoxdPTowN2LqtjeJtoY+xsHGsCYfJxxrENL5IkNyCYuNqCZsEshoUumCYcmihq/urgaeNtZIITQD37j1icHjbpv8TBTuljY8el1OzOimU8eBjysYRdIeqNjZzLiTcifWmERNXjIMbj1c8d+jBuv+jRusyTMMYIiZuotjksuPjMyYRJQCcJNICal6PFPCdPQhmgnIgEp9cjlk/IjpNL8okp8lKkpNokUEZogWgFolkEnJtUpPJrSAfJp0pApr0phgmMERlLFNllOsEtgnsE5lK64VlJcEsptspFlLkgDlMCETlJVNd/LVNBps1NMYm1NZpr1N/lLRTvlLdNJYhNN6porEZ40ipcK12tStridR0ArtnaydNyMhdNmNrydw8cwF1xJ0JkNInjfpqBdQJpBdAJNMJLVL+jdTqhd7zuhNcrMVjoyZnj4yfGNYZtWTKZuSeZsdZT2xqwNUNqGdA+vzNfzJ/N5ttFeacedjpBspdT8ZpdL8e9j5V0gtRz39jTLvoNQcbJubLp2daLM5dFccOTRzuDZLMaFTF9u0dTMs5jjcf0dv5sMdWTvK5dVqv1YTNBg5NqhtPcdJNx5zedPqcHN0FK/1fScCTXpr+dfxtwFk8c5T4ScDNseuDNSybVjkLumTzqY/WMJuTT0eoqdaaaqdiLszTHTp3j6yfThmyeejrupxN+rOtjeLp+ZqqaH1/zJTj2V0mdKUYpd4LL1ToFuhZ4FqNTvsagtjLs/jm1O/jpN062CFo31SFttTtN3tTfLuOdArtZuqoqT4IfD0AfwlBpUsdjTrKb/170ZjN9evFToMZLTXBKUegqYjTJspFTIyfmTYyYPTEyYhdZaYyTaLqyT+8ZyT3eryTb5qhtuFsttUjsYtF1q+tPDoWjfDsUdlFoZtgDtotG0a7pviddT5zvdTPzxNt1VsI5QL2Jtfqck1QscgJRCcf2VHNkdcdv/TCjrptQGeUdjNvTtYGb7Z8dPZt4DqR1alr0WGltOTGDqOtOaoOt1KfzaB1oSdIzLrty7PATVBystsdubt2GdptMDIBtwGfNpoGeAd4GdQW6jK4zyTNEti0cAz49oEzrHKEzeTL7Z77IuEC9p/Za9P72gHLXtwHIIt+9J/TPlu4zkmYAzuGZkz+GZAzfVoUzOXKbj9QQLZ9cegzJbLiZLcdt83qYGdPFqQzM5t+Tc5vftglowzg9qwzBmZwzfGaUdDjpUdwNtEd3XMGtnDrcdfHI8dVuq8dQ8sFtSGqc1qiPIzaDpidinKIdWDrja4tvyFh/JGO21qtNK1uId0TtIdFKcpT6XiO5wjJUWj4PEzTbPodCNsct9js7tjjpCzYXNPtHDu41zVu3t39qgZDDvqzTDoAdgmbMz6NvMZKatH21to9lumeqzO9u6zdWdDpgjuYdwWaZtLWfUdR+tPTVmcZlUGZYtMGdLZ/qapZTmYHjvqbudncZQztbIsd3mbmjvmZptf1qMzuVpMzA2bRts9PCz7WfYWZGc5t0WbK1sWax1iDpx1zmo/tYtpQVanNwdwx27WeWdLtj6qKzittidVduD2ixySdZbS1tUzLSdhkFmZEGZ8T6AvdhLd03TcTNuJ6stCTZToLTESaLTUSc3jMScr1RBISTusaST8ZolZhsdvT6SenOpsbJpz6YzNR8f6d+2cGdNsa3OF8axjCcxxj7ab2TnaeAt1Lp7T6w1fj/affj0FuHT6zv6JP8ZLjf8bLjvrJnTjMarjfZprjJ8brjzFuLZeNvk1DmdP2bcc9jHcf4tXcZk1ccc6TvcZFV90YwFGOawFW6blj7KcBd+Aq5Ta8apzB5uJzUqYFT2adWzsycL1Kae5TPvN5T9zIXjIjyhjXTsZz5sd6dLObQzG5w5z+LqbThLpbTJLrbTZLt/NAucfjIFuJjtLrzj9Lt5ppqclzsFtX18FtpJk6bDjrBoOTSuaOT51IXTxOy3m+A3qkaKOelx9R4NmscqlAQE8TPooZQjebE15uZk4vSZHj1uaxzbKZl19ubCT+OdTToLv9z15sDzDLyD5srLmTjuYWT6acPTyJqUeMqY8JoeflT2ydKJGpNvKAYnqI3uZHzvuf1j4+Zqdk+aqpnmBi6qAHqAKE3qAmAGAsoE1bzIAjYqTQDraYsag158p9ll8qrhAcpEVmNqaN6BI8Fh8o8z4ctklDKbGhMGox14yoQdCmMmFiWZmF20tXR08pJ1aeNVF5criZlcvKkVOogll8Np161uvx5POcFD8NcFe8uaNkgoZQXgpCxeDLALfNvgdk3KgLSDv8dgcpRVQTqJ1RwpWVSBfk1KBd/NaBZkkGBdrlGWoBzWWuwJreebhwsa9Fx20aVAkrfzZcN9lNgivlKmJvlZ0aeRduosVjuvGdE1v+lsDts1/NsgLjfK0lP2aP5K2oK100eWFXmpmRciqJFCit21UCpDxB2v2FR2vy1GipfV2CvOFWWcuF6CqI1mCp2jDwqECWVxHgV+VeF7wrIVaSIoV1wyyR6AFyR1CoKRdCpKRZSKYVEIpUgUIpwY7CrULlqqmtWhZoLOhczlSWeW1LuIB1hWo21YCrMLECssLSivJFwWrsL/2pO1jhci1CypP5dOtW5J3P0VlRcB12x3bVRZpt1ihYuj9utkJiRZWE1ir+REosqcESscVVopiVNophR2ePVFvMlhkWovVRXiqmLiKINFXUr6LtirNFwKIcVsoqiV5KNcV3G2pRozNpR4OsCFqSoFtiGugLfjsXxohc5ROSsszF9pxlSasKV70r2To3ho1bObZjzWvKVNUvQx1vPa1Uqq3A9SvA1ImJTFaqJ1FxaFaVhaHaVx6q0FPjqFtS0P6VpZrNRFmsoLInKOL2hfWlyGvmtE8uhlX4ti1rBbnlLxc3hiWorlyWssFq8sJVmBfDR2BYOVuBfJV7quv51KvOVxarpV9MP9VKUqZVQapZVVaqclYap/5rkrXFkco3FTavkhcatK1k5v3FcmsnNAKqnVGvi1sIKqm2w6PDTzmbWzUKruLMKtmL6ovhVf2vYVSKs2tjBb+z6KuLlZOoe17YqJLnYpJL1grJLF+IpLmWuvx1Jf0xHqoLVSEtpVFmOZLNyrf5bJb/RIas5LNavDVdasjVDaujVtWM+VLau2ObaueLXSdKt1EveLlvMMN3xe019he2j10oWsJGIeLOab5wnEvkJ3EvmL1eP51XlobACoez57YFz5Bqv6x+sKHVA0IBLTSqBLqPOg1cIp4VmheoL4wtoL32ayLcBdrFwTthljGZ75tpdpLZyrv5jpeslVmJZLgasrVDyu4hXJZcluUt5L7mMbVAZdjVQZb8xVut9g/kuTV3ctVVaasVk42bWtlJZdVdGc7LMvO7LXqvpLE4qdLZavyxrJeHLHpceVY5eeVVaN9LfJfeVM5ebV3kvZ10ONDLZuZUFeZe7VBZd7VMQD6x8AsHVhsOHV06sVVAutEz6ZcmxgvOmx2Zc4dC6u4ivWv01uuMM100re5xuMYw26sWlCJZrLNmpGFaRYbLGRcyVsBffTGGq8RLhYOlZdqpxDheaL/gDfVW0fC1Rhdust0tVV/6stAgGpp5L5ZA1qOf9FVGtlxK5eSLnjtSL9ZbdFIMvwrItsIr2irqL5/M3RTRbyLrgGorjRcMLnheFLaub8lWSsKV2EV01cFYmlZMqQrbGpQr7UqjCYhLsmZisFFV0cP1KqskL9QqEFn+YIr5tqWVLBcQLuJbDLoMA4LRpee1VctS1b2pp1H2qdgo6uejgypqLtGJwdITtS8+Re81AQF81mwoC1ViNKLh2ocRv1DB17fQh1B4Ch15401LqtM/TY2egrA9vOz+mcuztjvbtDWaEdTWcWzL1s9tpudDTd0axtHMc2zdmd/NOuYBe8Gc2JtzrmuR2fczb9vMd0jssdf6b8zvGYcts2YKr82YIz60eEzxGfhhkWaoZZ8eNaVGYIdstoKzUTv8r9puHWldsO51duO5JyKoO9dtXZai1/T80e6rV2YCzeGaCzg1antw1Ysz71oXLZ2c6zdDumzMHLHtN2cOrpmfuzvdoiWc9o/Z69O/Zq9IStK9o0z29I3te9JkdPmZyrtWZurAjv6r/Wbkzg2aKtN0bfL4ZcqrbqeqrWucnNdVcVqeufyNBucnNQaY6rF1fAZXWf8tPWb6rfWdWj3drUdLjvQZpGZUtEDvG1iJcOLJ6vSLqJZgLIlaXTcnJoZxWcBWO1u0tj00nlgVfbLy6PwdGdMidOGvmrh1pnZ5DukWp1pYz1DqxrwlpxrWVuBry0YfZ7XNCtQDvMz3jLOr36dmjl1YS511cdtt1edtYNY658maGzxhxGzIHL+rGaq4dANYkzuVd/tdjoJrwXLdtx1eVr85bVr62Zsz8NaudcGZCZO2bpZaNZSjGNbK1GRz0zltaBr2tZBrttYVr9taVrhtcezpzsKZ5NesZXNom15Vcmh/FeRLtNaEraJb0LTVqYL/2YltC7Nyz1GbZredLip4OYdNB3JOtlDrVtYzNWgKToRzi63SdetpzLHFa6N0ad7zLKf7z26dxzH0fPNCJoTNqScmTXZxPTCpa9zgJp9zTue+jesuWTiBulTJsdlTa+f7zCqZxdSqejzjabtjycYTz09T5zOaZTzmcahZIucNTxJONTSrxzzazrzzxcctTIcaLzNqfDjXZuDO8tLxZUGvOrfjLhrmufdrJXJRrpiZJtXtZWGfte9teZ09zbxsyr3ea+dASb7zv5uxzfupHr++bHrs8cXzaSePTHuaHruafPT+ac+jYrOdzG8ZpzW8eXzM9dXz2rPXz4edrTuyZTLNNM5zIzvwNV8Y1TxZq1Td8Z1TXabTznsZJjk5vzjAw0LjK+rPr46cLzzBrpjJeYZjkccOdc6eDZleZAE1eZYmteZik9eabrbcpSsTcO8TjdaAb+Ttbr8FLAbA+aGTr2zxzqDb1jySaPz4MZPzqNMHreJeHroqcvT+6cWTsDf7r2DfLTD6Y2TzusnNNadfNdaZ1L8vXMr0hZ4RTQodVcjd/zdWtDlgBZtkwBbkbvFZizKdZpruFbprZxftVW0sIrupYQL8Wuejzlfk1XBbwRppe7F5pbsFlpf4LuBZth+BegAzcq4ircpbz7coYRpBa7lXGurLk1o0L2FYErOYqmVYTZQ1keZzCq4WYZU8uxL9ldu1BjeIGBJdQLxpZe17lep1WBa8rOBaj8dTeJOHeCELO4h8bbcL8bEha9lHCPfz3CNkLMnPkL4hKMrj8u6LQza+8b2e9tH2eOLs1t0LzZdErORakrRhZCrphZ818ir81mD0ir0CpsLlIpC1NFeI1dFdKz+koGb2arWrrItorClZpR3hZflvhdiRRCreFJCo+FQRYjxlCrCL/wsiLMhGBFMReqRzCviLrCp6LPgu5tjlf6sQTchLDmuhLyDoCdLmplC8wveb10uObW2sKLO2oube2qirQWpirsmAqL8lYTLjzb2l4lcltlLYorhWuuRr5aTrmXHaLkhM6LyhYJGIouCVNipNFAxalFForlFWxaVFbiq4qk5tRRmZbGCvis8h/iumLixZVVyxf5bdirWLkSpGLm8DGLdooVE8VfVQM2rizJxboL5xZkFk6KuLrrVuL/xfvF0Osfr/EqezhcMjFYqtQCPoMlVsZd+LpfMmb7WeaVr4lBL4JbgdqdZCb6dcSzsJfJd8Jb3VidabzvNqRLwTcErgipqb6JcdVF2qabV2pib1xfab5OqS1rlfQLPTZSbdcrpbRyppLI4oPLvZZ9VJavpVzpfLVZ5en5F5dHLXpe5LE5frVd5enLQArnLGsc7zUyFFLcvVxIgKqlLwKtxIg6LBVZVfDbccvNbFxY41OorVLkEufF8uKClyKpbL01bzlibeJ1ybelLHTc4LXTbcrSTfXl72s3ln2u3lNpb3LBbcH5RbYZLx5YHLLpdsx55ccxV5Y5VJaP5LD5cFLzbdAFZUtdNLWsdbOkJjL2GMYlclcZbDzbalwFZTbqZfHV18cnVEFfVVSmtdNH5agFeqpVq4kuLLRfIArZZfELHrcrLGzZPjWzZRLAbdjbmddnbB1qzV9RaM5fJYpV+5cPbRaqPL/ZbV5E/NdLF7Z15V7YjVN7fvLTbafLZ9seLi5ZUrKpZXLWpbwdG5b+zXNe3LxddzVcEpOV9pfilfZauVp7fLbQ5crbl7Zrb45ZeVk5fEh9HbX5DWMfbIEpZbg7c+lEHdqlPav1VfasallfX/LSAuGx7UrHVoFa6lGZbeloHZtbMdYVx9Go0rpMrXVRmqG1m6rrCd0p3VlZYwrZTdrLFTb9b0beqbwtpQd+hdbLJFYfV9B3gR8ZY81yMsZxGCtlV1LZ/VXaz/VKLnBx5lqhxwGrelmTsQbKtKXL9xaSLoBcwr4BemtadZjbfncxbzqLErzzbw7tpoLlYXakVMlcI1YWvubClZbb1+o6Nw7eNblrbUrNnd4iTGsQrBuJ0rBPM/h3ley7PSeAbMadAbqovAbgxqMbc+avTpjZvTWDcmNCDbab5OdjNaDfHrZesnrEMaDz9sqsblaZsbKUbsbiMbfT0jvbw2+fyg3gkgbGjcpzq3dVjR6YSJP8HPzl+Zmg1+dvz/GHvzo0OSg0zf4FszYaFVlYZrzteKFBTYPlZQs02QBaGhIBdKb6hc87erc+zjZbmtWHcib/ldsrNGBxLrTaRb+JbTbhJYzb3BazbvBbSbEtsblR0Byb//jybnjZllfvjILI2YCb72ZRbZYqhLCWcw7ezaO78BeabS7eBVK7Zcr2yux7G8rIRO7ccFoDpfh0jcKbS11a7BMkQ7VnecbH+ZEFCzbb87Lfvl5iqFFKhdbTf0pSL5Tah72za+zsPYZ7/tfklk0dxb4XZSA+IpObYVbObEVZJbVzZUV5LeO1VLaWFenOrquHfP5DLaq7HIs+bHeaa7nVmiRfhb+bAReSRQLaO1ILfCL+SMBFELfoVULfBFdSNhbjSJfFCkqprKcu87VTd8dRXYYLcBYML37Z2j+Ld9xpzfML5zcWR+2vN7thYcRdzY8L1LecLOdeyzMOai77mvpFxiq6lMveeRxldWbkfavgSrdCVAraGLGxfVbsSodEYrfhJkrfM78re1Ffiu8VffdU7rbaIYTfbCVgxdVbwxecVoxe2LWrdc4OrcjbqLfizpxaK7I7Yqkprb8JLXfKFgYuTL/9aeLLvYDTrxbU1kZcqVTra01H7YTFbrdB7FZfNhaYvK4GYohLNPbRbdPfDaQbeTzIbYoLuXaoLsfbm1L/cdx/nccbCbb1LN2oNLfytXbmPcSbBKrNLOPf6bW5fp1e7dMlVKp7LJHZQlJ7fI7Fask71Hek715bAx9banL/pYY7Sneej7bfkJnbclLoMlPFvbfPF/bahrrLZUFW/Yg1kGsfFE7YRVqVbfFnHccb2deAHpOtibbPfiba7czbG7bS1fTe3bubYQH+asQlwneLbjJazR6A4rb84o5Ll5ewH17ZKxt7cIHIAqZ1lEv8b9rYqVGmrP777fjFcZd179It/bPlf/bASNVr4peA7bOos7w/dd7R/avgGndEl0HaLLf5ZLL8Hav7S+PNV7nYh7WFdV76HcK7//eK7XHadVbZd47AzLdVXZYPbhaqfR0g7QHL/Io757cwHi4uUHtHdUHCna8lRA5Wz6XZY7BSrY7iKrCxM7fh7m5atL4Q/2tu5cQHnquI7sQ+PbZHYSHGA4UHI5cYA7KrSH//IIHinY0HNPMFVB/apZ7vCcHUHc1hOncNV+naGxpg9B1gHcobZnbchtg56HzLLzCHXe1xXXamlPXcplzndVVrnZJ5obej7j/dWly/cNb4TdmVjxfTplprt7ktskrVveq7EXaMH9XZi7LHdBxCXcelyXeek7FfMHylbyHnKIp7OXY87fg8x1avZh7uzesrWvaIr0WpL7rhYFroXeMH62pq7kXfcL0Xet7ileY7bw64rf7YEl6lc67/Wu67kuMc7Jmr0rZFTKVDYVP7b7ZrCHWp01Cw8x5GI+WHWI+QrfXeVp5mq2HX/cX7T/b2HTZcBHv9e17OLZuHeveyABvYJbGfaKLxLasLOwrJbefYpbBfbhHJg7yziPeTxLTdAHYpZSjCTZHxUA+SbMA9EHZXeVq+4ty1b/DebnI8r7TeMaxreP2LCVaBV2TaSrPeMybIJbazH1oR18QUZryOoRbYbZH7tkmp7uw4NbLI9+7bI6Z7SbZMFvA/R7nTYgHio7Xlwg/JLsA9KH8A8Z1XQ9fF/GEthZPOS7Icj+5cwV9ehaFHmO+kWC0PMldy1BTHNbjTHC81FdmY/VAhEGR5YNQ+gNfaUL8veuj2Q7abEseG7ijeypLupUbALuGTKDe7rQesRNfddpz8Dca7h/eFTs+dHr8+eLTs3ZJzKxssb0MZ27FWv/r+3ctjh3f9rf9cQbADYTjXOaTj2McV7GJKTzjNdobguY9j+RsYbKUeYbJzwDj5qfzzv8YnTXDYATXLt4b3Zv4b0cet4KOdhrG2Zfr3Ma/r7PPfrKUd5lpjuOzIseDTL+ddN66ZAbbdeUbHdaTTDud7H03YXzA47dzi8fqdy8e1j+zOW7mjfQbKSb5TKybqdK+eopeDfnrG+Yt19aYozK9bVTFDfk1N8cPOUzvvjMzuleczoYbGed/Nu45VeuecDjh49lzx4//j5ccVzfDd5dV44tei6YAt41qKTJ93vJIhqFJol1ONr5PFJH5MlJtSelJ9SduNTSccAuCeVJbSZ0uw/QMF2hosjuhqsj+pLP7tkfsjppNhGDCdDBf5VcjNpKgY8tw4T6Ix8jkFRdJjVhcNgUZGwwUfTBZIz9JkUbET0UcYMqictuUZISjIRrcnsiZzTrcyducZP8AGUfYqsRq6l8RsSNLYIKjOZPlG+idKjRZJyNJZLyNpid8n5iaUTViehroMFsTpo3KNFo0cTBd1XBric7JjRqELsjewJf3ajTD0eZTSjbG79Y8FZgE+HzF3YvN16clTyLvdznY6pZS3b3TK3ZgbYE6anEE5QnifM71TOaxdfTrWbvL0KT0CeKTp9z4nj5PKTU4yEn5xpr6NScBhchrlJChoVJDxqApf9yPG8k/Ap8pcrHmepbr5U9rHtjaqnvpqHz6jebHoxtbHiE6nrzU7JzK8am7JjdAnjU/5TPU5wbqE7YF+DdyTQ0+pp+JojjF49Ynd9YW7qPYRRYiwpNglKGE1JtEp2pYdjOogZNjyZkps/Lkp+onZN1onhn3JvUp3yc0E/JvbAgpoBThlMjErNegAVglMp4KalNIKZlNbgnxn0YkVNiKeVNoQhRTblI1NeKcSEmYh1NjM65G+pqxTRpu5QIVKJT4VNZzQM7+EZKfZrc1fozqWY/CtKYbrlDadTe/b2nZU6tzf48qnAE45TQE6gbfY6JzmDcHHqyf0bAs7an8JpbHvdaunG3anzweYZzaE+UbC9fyTuLuwnuBrIbl8bXr0M8Tz1DeTzxE91T9Da3HFE/n1Web9jBcf3HlMbon59dLj4tO4bHZvPHt9YP18ap/zjPIqtejqqtb9Yarr1MQzh2cNz744Fln45wtA7cdHDg8ZT+0/lnFU7rHSs9OnXdaad9U5m7T06QnEE+1nqU7PTPY9VnIE/7HZc+unL0+HHIebNnlU4tnU49/ryqcTjRLvtnQHaobxBu1T+MZ3rVZt7TouYPrA6ZNTPs7NTfs/Yb5N2tTLBpDnv07DnoCawt7GeTzo2NXTzdblnVxLznR04LnjY5VndU57r1ObbHc3YhNgM6rn3Y73zR8/1nJ88NnujcD5Js9nrrc7rH7c4cb2Hf+geFofr2mb57WVY1rP1vatbdp1rc2b1ritYNrkNYrHAs59tVVfvHKbaRrUR3jn8C/juPtb2TP9ZPjAdcmz0tfhtstd6zK0btra0YdrUdcUtAkrGr5GYmrhdrTpkCd2loOZC7lpoYzRksFrzGdrtIxw2rlWcbt21YuzwdaAXodbwX4dYIXkdYgXEw7+7TdqDrWte4Xctfg5j1v4X4C6ers9py889v/Z71aXtHe1XtP1ai5m9rStmGcBrYi6WjuC/lrUi6JrzjtUZN44NtV9objW2fszj484tz472Tr48FjrVZEL85q8zHWexrV1dxrM2f0ZwVqPtTjtCzJNbZtEB05tlNYZH1NaX7ro417rI47TTNd92dDMLrnTRIOKnNBHpFcxh+dbnbrIXJT8tpIdEOfYOUOZrtDRcj2VWa0Xoi/cXOC/xrvC4MXIjqWzRh0tHj9fVrri81rxS5DrEi68Xwjp8XlS5AdEjulWptcdVtS6lrbi5lrjS70Xki+8XzWZKrrWdoHana7zpi5gXRXNjn45psXOabsXLVY1aTi6zrf87qXAC4dt4i8GXzS6KrhGZOrYNtJrAS+2lCde2HvrajbcffRb9Be/zzi+zrPHZeb2Xl5rOdJoXhMMFr9C+OtjC7Fra3Nhz53MmZl3LrrSOYbrgDe/H7pt/Hu8727x08TTys9qn505BNl04DzIJMfnS8coFd0+AnD0/rnYJvAnm3bWT23bTNA08PjhDf5nl85zN1s+GdBLpNZPOeXHEztXHAFpdndDaFz6eYNTmebfjDLuPrFJJnnMuYDncuaDnp47tTZeYdT99Yzn9g8VLkGddrsC89Tqor2zAs8WXyc4cXqGe7jX47B7P45G7Cs/zntucHzB8+hXxc+PnLuY1nmK+NnSK9/Nus+11Y+fgNOjYRXXs3pzz8/en6E4Ib9jaIbe/ZIbMedXrS4/XrK46dna46HnszpSndA7le2472TVE/WpNE4PHs86tTocavrPDaXngbIBn7E6rzlgzEb3PgkbUGrQ5htvMXNVfxtVi8JtiC4zXow2lX6NaNzC5skbj5oPjcVwO77uv+7AvcB7DWqwnHjZKnFufRzO88On4K/3najaLniSZLnj04xX3U6xXlc59XMLugnIrNgnl3c6nDc6Nnp+exXI49xXYec+nEee+nH6be7JtcItNto4X2i4aXWy9KX+i+GXxVYzty2ZMXUc5xtHqdmXBjvmX/9dzXvtfzXNy7WXvS/qX/S7XXni4ntd2Z7t9Fujrj9dIXzsYbTLu0oXY7JmrOnMKzry7FnS1fLr5Wbzr3a1YX+S/YXgdZqzOi+kzd1cazC2b2Xjtb7tYmcKXkG9XXui/XXQy5aXIy+3XLjqUz0S0UXcVt/ZKi++r69vUXf1bA5yG6mzqG+g3utcJrFS9GXO68LXIq41zMy9gzcc89rd+tJtSy6F7nmdWX5teyrRS5vXaG7vXsmf1rENdkXrjpztA3KCX3w7y7OFZ878faCHifedni1tSzy1p/XGWcabdy/K7FmE05qS5ozwtZpbby/zpgG5WrFWbA3mi4trKG8E31G5AXtG9aX9G6qXsh1AdIi6s32C4GX6G52XcG6GrCG/EdxtZ/nZtZc3lG+s312Zo3+C8MXvi+MXjG8RgKa9szCNZSjSC+78kq6JXU5s/ryGdlXJ2cxrLi6vXGy5HtNm9Brdm6w3RGbQZ/i45txy5Q7jxbQ7BXd87im+uXvG85rdLeA30tr03sS4M3CttLrAG4+XFdcSdVddvANdb+XMzIbrIjb068a/68z0vPEUW9eHeBPrXY5Lbuqq/jTPpshXhc93Tes4unBs/hXAfMkmEerzTh85hXkSbhXE+fNXCOxJprAv6nU65fTX0771849tn3OfzB+E81TA85obnq9In3q4mXxjT9XOaYDXqzrZXo6a1egc831PK+Ynf06ZjKue/ntcaYtTPJjnrG7mXWa4432a4MmaC6OHIade3nGB2nUC9lnluYbXs273naq9Ub3DwHX7U7gnV3YzTN3fPnLU4VORq5j1Jq5+jpabpzTLzenp24+n525nXl25sdKqedXFK9dXVK/dXNK/XHqefpX5E8ZXlE69ng6dZXgtJ+3nrL+3U6evrPLuB3/Lom2o7U3mlgy5gvGrPM4tQsXtVbh3vMaAqRj3b6doQ8GOybfEQ25j6THZTL6uYh3XMbgXmu9bjMO6ar8U7PXKc5WXosYm3u3b2TE44N36gQrXJBeGnpAUqFiI78T1Y4OnWO6bXOO4bHLa+W3xq55Tpq/njh25CeyK/7XgBoJ3Q64lTna+enWK96nJ26LXeK5LXk4+T6sw4buuZc4Iz+fTnnsurCtQqkLEvbcbETZqXdCOIL/+aB71sgmb1/aBXXw98Hsm8qbv/ZX7NW/cbgA7BW3A7YLk5ribErYEHWPaEHHlZEH3PdzbeBablhBaVkAPa935PZ4rLe+V7kPd+HAQ+q3GLaU3jPaibzPe9HKbcH38o+H3kA8DHY++DHqo7gHVCN/n+Tc93de++F4zZF77rbF7H3bL3Flb9lP3al7I+xLHnLbLHqGt7X6kKj7wS5j75y473+w9qb/8oObFw6hHx0G9xoVdQemfZN7go+UVewpub5RbFHFfaQVgXcSXwXa+X5fbW1Rir2LXzdbTPzf8LALcCLcCr97YLcD7RSOD7oIuhbcRYaRHyPnR9o9OXdZZ/7tPc73G+9q3SffAPKfbxbnmpkVhvdgP/I+z7pLeubcCuuHhffhHxfa039vdQPuB/ZxVfbMrChY5bcvZMrjB/l6Y/Zb7k/bb70/Y1bs/a8n/9Z770w6H7Y7blbCxcCVhot5b/RZVbRKPWLlop0PHffiVJsMSVbeIOLgB9CXOzcyL7w8FRG/a8tDA537aXd2nGqrB7XMBfbnxdjFJI83QfxbX7vu9N3d0uBLmQgf7Zy/cP6vd2bb/aXTH/f/3Mm+/7QB7YPIB7jbIQ6AH0Td33y7d9H4A457o+96bp+4n3ao7IqeasE7kg+9VtQ9E7cg4k7jQ6rbzQ5o7Ppbo7jbY6H3yoOjvyrlHeyYlLIHeNHg+JlLF4rhLqO+S3GXdY7Hw9VLM6J+5rA4XRhQ6hnxQ+33Xo4xVso9xVKWoqP2bb4LePfEH9R7pLR7dI7zR/qH8g4cl7R7n5tap5LeA/k7PR8yHnQ9KlKnbz3V41H6oR5jFquJ+Lsh9O1ThZHVbxvOraZdM74FZsH06qgrtrbDw/Q607Lg6GHsHaklJquVLZqsBLYmPK3KZcq3/rcCHHB+73H89CHQXcBzDC4I7+bbMlhbZQHlyqSlYndPLrR8uPUnbLR3pduPt5fwHUGLvbcQGKlEc6s7YGuiPKOOWP7A8xhnA8zVYQ/uX5Q/EhhHeiHDpbiHdQ4wlFx/SlTQ+uPdJ7rbDJ/uP7Q8eP5EoFVWg84dUJ6/L2nZ/L/ar077g4M7Yw+XTQi6sHqqvIHeWvBP7J+QxZI5XVFI/1xVI967W6rtHN/cgdiLemP6J/k3ly4aZnB/2bgtdOHIs8q7kI4fBVFdq7uRYebsXfuHSAES7zFaeleWpS7bkICPaO6RHiJ+o1i+/B7y+5+HEBaq3Cm6xPVe6BHpXfP3ElafVOo8gPsle1HEh/pFZO/z3iZ4tbP0va7I0p616I4M1lI9Y1qw7mPdKdVzfu+szzG/4122eudSm1t3lUft36W4/H0jpR70x65gLu5zTbu5q10ss0Cj4QJOrpub3Q3YUbge9/1Ie+qnUK7OnWq9vnOq9Pnms5unz0Yp3haap3E9Zp3FjfvTE67lTNq+nXBK+936GpOgtgl3z53d23hOf23x+Zj37MDu7Y4AvzV+ZvzpADvzc+9VkhJ3F7czbf3wQ8AbJPdnPwheB7vjab3EJ6V7fFZV7q+8zPHp4OHP++R3kMvWPi7eKPrPdKP7Pcp1nPa3b1R/zP14+NHhPe7xRBb/z9WrSgxTcG7VywdHQq72ciF4zPGJ/X3Vy+xPax5iFWJY2P+pZ9Hhpf4H/o/xVx+8qPFpZDH6TcGbl+4gvb8LGbb9pB7Xg/hhwF++7kvYCdizcMr50ZUP9fb6FdF+YPXnZyPz/fYPbF5zPHo+T7jvcDPfB8216faN7cB8UVOfaQPYh4d7AZ7O1eZ9DH2m8t7PB/hHzvZ8LhCoWgxCtIV3vbIPIRd+FoLYiLlB8hbNB9D7LCoj7U7Z7l2l/8HyF7/72Z8OHxDfZHIZ9T7Zl4KLfI6Jbwh7N7tl7UVX7ZMvjl4wP0h/pbPx6qLLRbsHXY4RRn+/UvPQvhb6h8sPKxfCVWh7sP0St0PorfGLSWsmLvfbMP8x8H73V9eP7638AGh+sP0otsPwrZcVbV7n7zh8NHuraQvLF6zP/js5Pbed8Tfh8tbu/ZyHQR+0HCuJP7eg6JH8kQv7kR88HSJ6dP8R+9bXEQ6V+XbmvKF/zF5AQAtGR9flAB52H1qrCXAI/dH6C4J1tGL73DleS3++72TCo8EvpJZVHRF+cvytUJPUQ+JP1Q+G2InfJPLR8o7yQ8yltJ9rbsnbuPIMIePgZcY7RBJIHXUrIHIx+7blA9UuoKrlLgq4qvTWMy7+Q9lbJCMnbBQ55PPNZCHXA6KPmx94vYA7wvOx6VHm7c8rZ++BvP/jqPdpYaPh5dQHEp8ZVVJ+lPVx5aHXR/SHqN9nL6N80HT7bB7Hx+jLxI++PeV4cvfx6ArZg+jCQJ5VVUw94lDGP6vzg2kkGp7kghZdhPbg7g7BncOvDa28H9I6yPjI5dHHh+ErAA5xPCbaKvZdf47Ip/BvMQ8hv4p7OPkp6FvwappPZWJk7N5e6PSp7RvWQ+Wv9GK8PsuJGzHHd5POJ9uXDW/BHFQ4kHxx9JPvqtLbJ5df5SQ7aP/t+ylKg7aHTJ/UHKp5DLut93lysOql7GOhPgw+1PuncklLUsArrFZRH1DMsHKUbthpp74l5V96H8w7rPQuIbPCFabPFMtmlaw8p56Fatvre+yPyR/+Hnh9evRw9vVmJbxPQVdoXsWvyvBGphHdXbLPHIrDPd0qYrLNyeHRkheHZrYjvyI8g1qJ737bp4uX8V4MviV4dXs98w189+5rLy4hHRZ9MvVw/svT9+/V4d9JvHw5LvVqy61sFd7vk0ttPzZ8HvrZ5BvwR50HHxc+P9Ev2vQgytPfWsbPgD4Hvw2r28tI7iPJ9/S7Z9+APbo4dv3p9c1EB+fv+vZMLvI8svQh9JFIh9z7yB/z7St7fvKt+a3PEs+vo59/3aPb4vQ+4EvPBa57peLEv8A5IRv2q1HOB9+PQOpB1y6ZcPRo9xvkOrNHwvIaksOt+p1o9Ut6w5R1Lp8YfjF5X3zF/dPF989P7F633CPa4vWF4Zve+74HLD/KPrN6DHIl45vnD4v3VXECk+o8jHJCKfxsY9b8STVluiu+jayu8COqu+7Pli+udckS4s4tX13m+YOBlg2vGE26mXz9ZY3PZ49rtXVh3aW+WXPG6d3k2+tX5s4wnjFNq1pPbnP1a4Elu6s/71t5CXTI+evU9+wfjPeMvyt69xPI4svgh8yvpD+yvsCtyvpZ/FH6B9ofUo5/F2F9PF+j4P3rD4Iv7N6BvZj/VHOWoRVJV+aLWE0Ef9UnQCi4ngAGDwTzCl8srSl8aZXj6Wbal7r7NV7ssRN87v4O+jnFu/FX8mqS3ij5S3rmYjtDu5ifac7ifDO6vPTO5vPyT8gveQTSfSHc2HmT7HvNt6evdt4zrmvaMv3B+XvxT8IfpT/Cr1l7IfOV9ubVD/XvWioLrdD/pvPF70fuF/4vhj6Evex9x7Dcu+12aB4frl9efRWqsf0xZpQ3cTGfDs4mfr+6mfzQpmfql46L1V+FFp8cipSq5rHQe9d3EK5xzNU83Pba+1XGDd3Peq7HXPa/Qv1c+vnz5+PPa3dPPHxPT36xqfTZ2+ZzN547vcw9Ojsz/xf8z+flKbfbAT+4vlIF+xfGj/wnDT7i1TT7GPLT9+vh+4DHAN/YfKMKiW1rwldOY6XmmY6Hc2Y5Fd/rzTkiY+THechNdSY6ldgdlvwSrvX+i7lhKxCXVd5qmjeM+h1d2vx3+uvyRK1oALHxrrNfZrq30Br6tdprqqYtrqhKHWW79jv2ddfftdd7hHdd26kBD2agW9Rnrw9AbrI9tHtDdE73QDZvuYB4pULd/vzCDIAJe9Vof8I4wZ89UwfN9CIazy6QceDN3zABJbsABTIaR92Bh8BtQerdJJlrdx71CyFwZndPpFiDFxjw9nboJDDXz7dr7zbUQ7sbflwfg0ZIbw9U7oKDa70sDw/25DmyiXdk797fSb6WKdb+g+W7saDIpS9Mngeg+q78ZDU77aMEOTw9l7q0KXxTXeVQZX9pUTzfJb7+kWwZP9T7qff35B2DV3r2Dh6D4DehUOD2EecBkDjf04Huc9iaiY90n3E9CKUk9XrvrepAe/IQwYmDD77EgbAZbA/vpbAr7+Ac2KRo9un0c9DHsM+SMyk+antEUcHt0AaHqQ9PwZI/5oYBDTb4DSlofJDoIcI9JMU/fN4ZfdEwdtDaH7ai77+I0MphhDtHuo98nrM92H6E9/RRE9YnsKMgocG0yb/WyawcPQHH8+YMH+Acn76YgYP0w/0KnM992VIKYH9E/OId59o/oe9SH8/fLYBX9TEGGDiZCk/TEBlMyn4E9An+U9MxSs9bnv0B/b5IUcn7aixn+I0pn4ffTEHzi/ntcSOH4c+DYf5KXRCKDM6ic/LYAffLYDYDTEH99TEGsBXn6c9TCjmBTxA8+swC8+vUB8+fny9SuACC+R73cQ3vuTS9/suBaUU5Y5pg0MYXs0SVH5h+wJTw9cXvnfOH0C/fv3CDtQeS91X/+SOxhqDy3uy9u751KIvuXffOma+HX6SUi79MB3X/sg5Xrq9fX5TfnHy3fN7xhIA3oO+HaWa9lTDa9CgKa/7/wVKQ37cAvXp6Y/XrG/oeVBSeHvG9wigG9NAZ1D9X+W9c3u2/lJQ3eJ37ABRDR3GX32eKP3y5Ma71q/BJU/f+b4JDhb4/+C/offUEafdTn8mDEwemDLxWVD0PqG+Bb5c/l0TY/lIKfdGwbY/VEBk/h6E/fvnvsBiP0cBhEenYhYYi9ib5HkVvto/N73uDiMUY/eAak/YkFY/4pXvkZP9a/YAJR9aPse+GPuI/+PuQ9uPvI/X6ix/PJhx/ZPvo/TQae9RP5Y/EwbY/5P/9+LYC4/tPp4/8IZJDhQeg/gwafd4P4D9EwaQ/KH7Y/TEFbfy3o59rXppDWn6g/FBic/8bul/8H7l/ZP4V/VgMlD6ofE/D3uJ/8P7EgTn6R5VgOsDjvrF96v4g/uIb7eEn66I5v4mDVv4U/YPzXfx7pnUkbr0/ZP8M/Mv6Ygpn8p/0H1+IrIC19QQK4cGv429fv7J/+n8D/VgJD/lb/F/fb2e/AwcF/oX/C/kX8yDVP+4Azvsw+rvv4xpoa99G3vT/jn7J/Wf6sBOf5T/wfqWoLPzZ+Kd05+EfoBKP/pj9BrEQD//s1MggaUU4JUwcYgbzemgd2AteiFKcv1z9KTFH0hfo1davxL9Nv3L98bxyYBrp9fc5ABMlvzr9rfvv02+ib9vqit+G//dfubxnyoqR4SDv3pcKRU4y/fvd+63qe/HXzzfUn4+/3bq+/T7rLfBIf+/PnsB/G/r60bBRvfeb5l/UP4LfsP5h/J90Lf0R/b988vxbDBHINYiXsNP4eWGZITP53/Wz+WYNc/kjMP/0pdAADEv5IskDSEANTYkr+DH4m/m50Fv4YAwb+MXQEAzj9QX5LlBQDUsxO/iv/AgEb/wLfO/82A1bAJ91vv2f/bAxX/xf/d/9R/mvdCgFQf3e/X/8H3yx+aH8X3yAAiYMQAPj+H98rCB7/M9JRfhEDfv8JfjT9WFwN/lDeLf598j1dRf95Aw7iX18lAxtcU/5VAyP+DQNz/ij/Vn97mA5iPD0jA3sjHPojQyMAkVh4ATW/WwNZEg/uSwCyv3kycFJB3xaTIwBHAJPfDYghHCu/RAFkAVH0Ab1y/15AZX8wASCDBgFzv3CIaX1Q/xIBDhwUg2W/MzJgfhKDJCo5LGSDfINvf32+Ab9c8jw9bINdgFyDJb80gLYKF38TfUSA7RNUgOPfdd8lFFs9A98b3nqDdr1wgNcMZj47PTW/doM+vW0BG0hug0e/GgDc3zoAvN8GAMf/F70WANZiNgDWAMB/T/1W5G//MH973zzfAAChAJe9YACJgwODYH0DmDR/VwFvAEx/JwCf8ho/WH1OfzPdbn9mPx89Un9Bf3h/IX8Xgyg9cYBHALp/Zn9Gf1+DJD0e3x9/DYCDTFe9HwCb3jBDAn9dgLe9Xn8fPX5/I4Dhf3k9WENTCDiBfICEPkCAv6Rtfzg/XUN9f0F/Q38o/mCA6D50Qx4RI0MxP3XdLX8pfxe9GX87QwhAgkNkPzJ/RX9jfyrffQFCgP0SN38fPQ9/G38Xg2aSKkMEQJj/Z38zfwmDC38SQKj+L38ygLuA9bI4/0F/BP8rASD/ZP81v05KGqVKQMd/bT8MA10/eP8A/w5ApP8rARlMQED7Pwe9fn8ZfxbANz8rAQy9Ub15Q3LvFAIjQw29Bz8d/TJ/WUD5QKj+a75JQMG0YEDsA0r/Mn9s/ysBXP9YQKTiA6gXfU2AYv9dAE99V0Iy/we9YL8q/yj+Gv8iQxT9YDwvXFtfBMNlgVWBZMMNgQuAH0Mpwz9DGcMmwwEKS4Elw37sEMMxwwzDUsMngXTKVoFkyiHDT4ERw3rDXMNSgTnDcVxiww7DW4EPQ27DG1h4wNmBAcM4wykAYcNEww9Df0DvQ3TDPYEZ2AOBNMDQwLzDTMDRwwLDKMDIwIjDRoFCwJjDV4F3gWTA2sNfQNqBccN/gVrAwEFnNHTA84FwwJbDNsCiwwXDOEEVwz7DFEF3gS3DMABmyk4jWiN5QR4jKcpnwwEjbEFFyjxBOkFGyi/DTsozPzfDPgACQTEjHcNSQX3DCkEjwxpBU8MqIHAjSCNoI07KOH90lHHKMSBEIwOAa70Wynh5Aco4PCwjAiN/31wjQsh8I0lcZYDiI2UcMiMxQUojRDxtwzPDC8MQlGvDW8N2IwWMD8NxIBCUdspmIBCUc8NsA3SUbuR43XSUR4wqIAWMO0MWylbKEn8Wyk7KMSBzw0t/Nspu5AM/NspHjDlAtspmyjC/Nsp2ylQ/NspzwyF/Dspu5EU/DspHjGD/Dspmyg8/DsoaIyPA88NjwIBAKSMlf1kjeNx5Iz1BQAhG4ENBFSNzHFQ8SxwNI3NBdNwcPCw8fSMBzEMjR0EPHExfGQtQL2mfAysHkWWbS6N6+0i6EkBVeFY2R4APkTuQfqgRKF6jei9ibxPBY8EYqiQhGCxHbGLcEyM7WzDwIyDXGy/zOV8wdxGbAC8qLzDlGC85L18lEPgeIDEgJiATlwevJI8cnwefemt8nyBHTC87KxZ7Zp8wXwMffC9dj0BvDh88ey7qafdu8QQxHqUpW2PvHwc0zzb3Vg89LzyPOHtNHzpvHfddHxKPZh9WnwhfDV9CLyKgmF9BC3Cg7xsZLyigo68pm1L3aV9FL0r3SbgP9yUPWXsxXwV7TndKe02bZ0d7nxSPPJ8wLy4PMRUOR3+fJGUCH34PIh8yn2JFAUcSi2FHCh9RRz+fWp8AXx9PAU8XL3EPc6D5D3wPb+9GRmeFD3tvL3+bXy9yFWBbAK8qFQD7WhUg+2iLMK8YW3oPNhV5H1cg3ocMH1yPLB81oJwfbFsUr14PKA8SnzWFY3svn0qfMotKHxqfNA8LoJw7K6CZDzOg9GC7oMRROXoqr1mg7lsK/Bsg5mdQunsg5sIXJwyfTI9bn2yfW28VoPtvSGDGe15kRBooFAs8KPQCSBEIf9lVdgl5M2FCdW1vL5EtLySglg9dL2ZHcJdp7y3rZK9Dm1SvOGD3nwRgqy9iixsvKp9fnzRguQ8aH0ekXYsF+zpg5aDJ70Zgxa8fD04dFa8fpTWvQI8wOzAfX/xtr1a1fQcFbxdbOpVzbxVRZE9ZiwtHTVE2lTOvR69vHXqgpss0j1uvPysbnxqg8e8UoIZgx58IlxnvZBV6Hy2PCnUWb0hfQqCUYWIvPNswbyQHEk8ah1OPaG9zj19vdksZT1Fvek9g7wLvXo9TKziZTG8VVWxvUE9cbzGPKgcCb0vFKY8tnxmPSO89K3JvdUs1D0ybam8IsVpvfk9mCyR7GUdGb0GPHNM/rzYfbqDY4M5vWCU3b0TgiG8U0S9vVOCfb1hvbO8sBwRvQO9cBwVPFG8Q70lvLIdnjwUPOC8IywJHHa8qEwMHdXFX7y2g9WC/tTVvd54NbyLNLW9IKw2vRc8Db2SgI29q72GHPU9pJSTPB2DjryrLIWCsnzcPQODdYODgiWDr7ycvLp96W0OPHm8U72Tg/m9vb0FvKeDqTxnggO8cB1eVBtsl4MfLMO9C1yNgvGVo7xWPDgc47zbgzA98TwfvJO8jj2QHYBCyT1LVCk9M7015aeCUh1ng6BC5O0Xg3ODlT1bVF8sHoJ32RwcVQM/LQ29vy1/LAdV74Nalf49DTxM7TW8QT0qgnW9n21gfeCsAHxY1RB8nOwkiFzsR7z9ghC9lHwuvVR99L3UfQy83r2BHW3ssYLOHQs994NMwEs8+H1Kveit6MXDPSM8d7yA1Z4dUuw/vWY9kzxKbV+DaYPfg+mDP4LSgpmDcz0KvBO8yK0fvTRDvsWDPaWDbh0QQw+9H4MbvKzs0R0WHG09REOM1XSt+u3c5ehCBdiVwB88zu0m7VFcOp2T3aJMGX1BJT890AG/PR7tfz3/Pa/dJRC+REl8Vz2rTCl8IG1iQ2uc0V3Vnel8u131XSCc49223TVcaX23POl9753fPJ+dcG3ifNudEn3xOV3E8vEnEApMTQioAIrgv9D/ASaBgAFc6CwQWnHJ6d5ETdxlnNHNLiRm3Vc95txKdTutw90p3SPdqdxJ3WJMKzzJeFFdikPiQhqcU93LnNPdXpz6nTPc+X0GnZndkY1NRPmC8nmy3afYkBBKXYTctwF7oNaogIFfZOIB9KEeQqstdaGgACFtfhVZNOONqwHKOP3htPEbg6SR8CEuhKmYokH3ADnd5CRdgScB0KiMESWdOJ1ygEEYyAFUAAZDfhWGQrcBRkK5KfQ9EGxNCUm18GyTEbYAaqX3AVl8tz1W3O+d1t2lZYLokGFpiF2lBBEJXauDI5TskEWoWuhPuCrgwiC3AVkBBUCKSWiFsWUipavd/d2XPXOdG13JfZtc8dwT3FbdYVzW3A7cNtxJeGfMSUNqQslCdzwaQmVDGXmO3Hl8q0xTbKc9MJ26Q4FCP4xPrWidxXxVVHrhI4Dx2UpFYoy6lYbg6DWpqGOl5cTxQm1cCUPZmKA0oEHlQinN213RXRJDykLHXKlDxUBpQkrk6UNvPVTUr4BRmDHAAADOfwFKSRQQFUG1iWcYj6xUgP2MFUGwAIwBHvBcnfwBjUK5dNioDRHBTQABqQBiAUwBTF3TQwABQQD9CACoVID/ALrhjUK5AUTgE807ILPw+UDUpAABT5KQ6yROgTlDTBBzQjMAzkGAIa4oM+l0AWfliwj5QNXFwLAPRa58SsBQIOyQAAGeYgHBIV/hB00ZIOs1GSBNQrK4OuAnQnehg4F0ASdCjBEN4AwA5AHtgTBhy0LNQ0pE+KjsESaC66BEIEQYc6hycO4AA0LJNAiIM+jvQjiluTWoAQABHQBiAWJFdABqqZKRRKihROyQ0kWFNW9Cm4CYGU4J6iGvQh25ITzXAFdDSoHXQgmcCoBx4PEhyuBKgF2BauC3AL/RVABNQlB8AoPEqVBg0CG4AHPpJBn8nDHA0CHygXXgNBCdIcDDdADSRavparD3ANcBKxB/8KRRdYXQwMEgM+moAIwB0MC/ACRF4MI1dOppV4LArFnUPGybHUlDJUPJQ6VCLCWELYABAADwCQABcAmpAQAAcAgAAaoAAboMkU9Dz0Ll6VXg70NrmQqAsriwABjDsMNww9vBWSBKgfcA4EB5OATCFUKEwpVCKUIopMTCpMNkwxTDlMPFjPyF0tgRHbydrBw+Qr5DEZwgTP5CpDgBQ7dxn8RGwFYR3MKKRb5DXk2L3VzlBCD8whvsGwBBQ3cwChAhQ/LYVVWhQt2BUpDhQ8VsO03bwXpD6en6Q4LChkOpQCw0xkOxQtpt0d2m3LKkyX0nPApCJuwvTe6dtkNLnXZDG527XC+ctn0PPAnN2X2u7JfMuXwOQjPdsk2OQ/Fc7VxaFO1CEnyMsaz5HUOmNU3AXUMHXN1DSkOVQylC7IGpQ8lkJV39QkDCKq0nnFhtfZ3F3FydjUJnETbC5ektQ/cdrUK5qKK8g0L1Q77c2Gzmgos1NsNNQzrgdsIK4K1CZxD88XGoz0MN4e7C66CioJ2tjTwbAAbDWkKGwwlCtt2JQp89BML23KVC3zxVQ62BvUNzQ+bCNn0WwhwYPd0bhQXsjoEywpAZssMGQ9FD8sKxQxrDmXwmxPjDwLzMw11DaXwQnKzDIthsw6TCwAHkwpTDPJmSIVTCX5R0wrDCy1H0w/DCjMKIw0zCdtwBwl88gcLNXEHDuwCJwuzCycJNgqBcnMOmeFzD/61bvVwAgsMGQn5CIE3KOCLD/MKDJM/gkUKRwtFC8sMxQvKRCsIFnUqcMdxmQ/JDRUJrnG+dFUPqQgnCB63RwzOcr53+w8zDAcOEw4HDpWW5fCPpsIhnYMqR+PlSIHsBCiB8cfwBHKhDkE25ZcL6QlFCcsJRwpXDxkKyuXJChULKw8ccKsO3NZnDTcNZw83D2cPVjW6d49zhNCPc/cyj3dbsH5wtXOndSaWwiPDhT4jacDsB50XHPOXCvcORwxXCG+jRwlNCh4xznTHdZkOCTeWMNz1bXXHC6kPxwkTCs03WQ99ZmsNHzZZCTz1WQx5krcN0mbCJ9UB3Qymx7oDXAZNCsgkQaEyg0skMMDvZZQF0AdJZywHqAdJYboNxgjxE78Ty4OmVX+FG1YbgE0KTQjbCD0MrQvEdn+GCZNfDEBlDQ8NDP2y6lNNCzbQRQ22AagDnMUxBKABKZVUUGHwxwl1M612mQ0rCK8OKdEJMqXxrwibC8cO0baPcOcINXJ1DY8IDNA/MtG0Twzl8mBU6w9VCJz2Dwt+d7V3S7Nk9JBGxYNQZ2Km5AGJCqZiJELcAjvFV3LVorIw+Ib8BOAFJSLcBTxkWoHkAZxFwIp8Q5AAII0giOYRII6VA5ekQI/LoUCMfPOyNhBHGATAjr7lUuCZDEGwfwo3Cn8PkbJlNA8Lfw8eN1VzD3HWNv8Lrw3/Ck8MaQgAjRsOqQ6l9a8N1w+vCLcONjZudTZxaQ1+c2kMXraR0/MRWdckkxd1Ow8scjUIPQrbDjCOuwtFhbsMOWIVFxl14InsAsljNrcC891z9tNZ9D1y9TY9dEG1PXVBdz124FSsB/ACKyOIBd4H8I8sBBwD9FMbdT+Glnda9DnwFQgQjy8M1wtc8Tpw1XeQjxCMUIyQjwCLWQmPC5CK/wxPdJsNfPKPCVCPPPFud1CKOnWAj6UMfw/ZNhcNbgwjxPcNRQ3LCRkKLw5XDDcIYvJXoA8JiIzVCQ8J3TMQisiJ/wsAiO8PDNBojibxbwkAj4JxSInojp61UIq1cjn0Gw688+sKWw6ToIkO4WT615ljigpiAR9grcaNgfwDqAakZ4zzHPKZDMqWd5AZN/nXXPJbcOiIlQs3DLMIbwqZMm8OsJDIjFkKPPNvCOXxGI5CdICL3jDVDi1x3ud3dvpxWwvcdp53WwrWxUiFV4JuAIAC1saSonSE4ALwgVdlHwDrgv9GewVipcMltFQV8VhhvHbOdt5w1w1oitcPGwzoiJCO6I9rDSd3SI5Bsw8IUIizC9cPOI2nc1UOeI6AjEGy1QnY0vmQhI5jh/mE8wos1dCNYbDZ0zsM2vZoiUSP2IhNNKX2rwm4iWsLuItrC4G3m7S4jRhgGI6BsEkNdzT1DUaS7w6xsxxwpI12UBXw6mblAFzDDgF7cbCLIAUaA5AHIGHyVKGwRwrMB5cJqIjFC6iPGQwFckOy1fEbE3nH+5PFwqAF1I1QAM3lrgaHkrSORQuEDhBWXmKHkbXgdIr/QnSMxDR15zqGosFCEk12LHKV8vu0mfCaC0LxsItwV+oL98SKDG92igxc8rEP9gu58PYLFgl690oI9HTKCO4Oyg5V9coI6g/KCjHxP3Ex9On2Kg80cCexn3MKCskJKcBfdLEKgdauCwYM9g8WCUyOUQtMjpRwzIuJkfrx7gtV9/r2gHTV8t5V57PqCyyMjIu/cA1lF7R+tAoPmbZS9pe2mg2vsVmwWfEvD7rzfg92D9W1Sg+nsQ4KSvTEVPEK5HaA8BD0+fRWDvn2VglA8cYLVg6otMYLvvMocEXyKfEtpHhQTzIg9PexIPPy9gi1auUIt/exoVRfxfoIYVCpFaDzD7QGDarzQfSscayKTI1aDN90cQjaCYYPXI+GDttQOgrK9rC3IfOy8+nyZbGltfTzL7WEcF8MbxfGCTFQnI0sdVDyiw1wAhr1WLGw81W3sPTVsVcOS3Qw86MTd4GVtp0V6vDFFzDyWLeq9lWxwoka88KJavBw8u+yBQ8ipSYLsgzAAHILSwoY9UH2qgmRD0zzkQ8+8FENQvGYidfH8VVmD2YLx0TmDuYKGQCXl5+2EfGa8VH0EohqDzEPX7TiRvEM/vCxCtiIZQi+D14Kg1OW82tRtg6B87YKPvOYjfGU9bWGRTr3/8c685NyUor2CbrymdO694L0CbJi8BKMwfOsiHENTIy6D24KbIpV8WyJVfNsi2nwKgrsieeyy1ABCiOw9vMeCmjwngsBCs7wgQshCoELzvLlVqENDvTocflR+1Jm87ty7RU09e0TLg/G9ZS0rgpZ8hX04rXxCuT2J5BY9LHyWPaSQY7xpvPk9OL28oxp9WoJwvdqDVX0Co3MjhL1SbUS8Dj0iHfdt3bzFPKKjCEJhvWKjhbxzvG495TxzgwAU84ODLOhDn20tg19tt4MMowwc94Nugg+Ckyy0o0oiAOx4Q0+C+EK6vLMsdKItPSE8mEMg7Su8esVvguE867wQ7B/dH6wOxb8ioF1/I3J9GYIAozyijyMwQhe93l1BvHqiR4Iio8cUQEOiogNVwEOGoyBDc71aHJKiJqJoQtk9+UKQQsm9uTzOQWO8OL3jvGo8/T2FPIk9PqL6olOCBqLTg/6i/b0Bo0aikbwXgtQdJqOfLbodwBUOozTtNTxhPU6iTb3hPeu8EVSPgk+C+5zPgmYdBEO7ve7lrT3gfYJDsR1CQtCtHYOk3axD5yOh7PCsv4PrI0ODf4NzrRO8l7zPIoM9V72Ao8s87hy3vB4cku2MQve9TEPUolSjSqIfrKsj1qLuoxciE+y9PAp8nEIRosWidEMoraEd58IPI3Yt9qMhor+9az261Hu9AkLZowbVqRyplFKlJkWZCSzspZ2kkHUjkUOqIn3DDSKNlRc82SNfw2Ii5kI/w7kjjiPjww/MsSIFInEiDz02QnXDCSKUI3Ii700tXZpCJiK+wqYjS1zgIysdLJgcoi5C7fCuQyBkbkPc3O5CXkPEoN5CMnEztEui3kMCw/wAPMPFw8l1nAG8w1zlfMJYo5XcqZliw8FCCdhOTOyMxwBhQ96hUsPQwz2i9SJ9o4Cxi8PpTf/w6unxQtrERsNPNZ1CTcIJI04iiSOUI8OEwcN9Q8c0ocPhhBgirQhZQocY2UNlQDlDKAC5QnkAeUPVJSld+ULVwkrC9iKCTd/Cq8KOImCcMSOSIyOjzG0FI3EjtcLZfPkjid2xIpPUniMfTF4is9zeIvx8dUPl6Rki1sIMI0MjGiNTQ4wjLsPNQlVVdsLNTfbDY6ltQiej7UKnoolDX6JZw1rCP6KjoomkV6Ihwyc1bynNNVtNg0LiAMNDE0M61CGBbikZIGNCuiTRYONCRdw3w5NCl0IPQ9ND0AEzQttDc0PzQgpEi0NcjUtDk0JvACtCEoyyuGtDgSAbQptCjTVbQuQB20MhQG8Au0JuKWgw+0IW8AdCm/CHQ3PER0LDwMdCoMOnQ+dDwSC0YokARKM7RCBicISgwmuiIMN14bdDd0MhQM5BjUL7w725j0L9uK6pHsIvQvIAr0JnI9TCm4E0wu0Rn0NfQuyQP0Mow79DyMJr6TzBFqAAw5jgRRj0Yx6xlYTIwjdCV0M8wbCookDBIu4AEMPtEZDDVAFQwkoibCPwianCewD0w/9A8MNcAQzDCMJMws6FbvEoAMjCKMNEqfwBqMNow/bwnSAYw9QgcMPkIVjCVbg4w8bgEMOTQyvAeMOBPLHDdKKqwuJDCd2HXOrDR11BJLnCScPsw8nCHGLUwoJj70K0wqnDMMKyY2nCcmIMwgjDjMONIopC46IXohOi/8NEw6S8AgFswkZiecLWosMj+cOtjQXCcULcwmuicsLro9edG6PY5ZujYxxlwkrBRcJCwkGCFTlm4djkpcMwooNC26JBQjujIUK6lJLDYUPIRCXCdwDzw72jC8JHo+oiZyPPol/DL6LjTSvC7cwSIzIiTiIjws4il6INwoUiNyVjot+iE8JWQz+jO8O/o6Uitk1tXDOj+sKQYwbCHUNQY9EikWIwYsxt2xw+JHBjp6JSjfBjM6ITPIBjjsP0I5kjDCPOwyBjYYG2w+QlYGKDXeBjcuEOwz4jqJ31Q4NcWSMobC7CeWNMIvlibsL2wu7CcnAew89DOag6qV7CuCKKwqjhSWK+w8ljfsLQY8PDqWK6nVPcKkPpYt0J16LjjGHD95S93eHCQWO9wsFiCsL6IqllyiOxw/EikiPjo4YjcWLtlYZjScIcwusxKcNbTTJjnAGyY9kBFmIZwwpiY4Bxw11j1mPdYrBi2qS9Y0ZjecOmPI5iCkxOYjViTTxFw85ixcNCwk3MpDilwu5j3cLnOG1iC8NqI8Fi/cJflAOiYWJtzYOib6IRYnkjW8OxY9vCPWK1nB1jyd0xY9Bj36JpYs+cv6LGI1fMbcMc8fwBLKEdw53DXAFdwnotc8KqI21ji2PtYmcjy2O91WFjr6PhY0Qi76KpY9tjDWL2QipCmXxsIkUi1ZxyIzZi8iOTo6il08PhATPCbCC7hLIIx2Kyw/PCFcMnY0eiy2JBXZVcwVxFQuIjFtxrYsOilkPrY+4jG2P3PFNst2LrnKbD9cLPPfdi08PhhXvD9EAHwofCRsBHw/Igx8InwqfCqwFnw2ABTaP4fQmj0WMegyoiL2NBY69iIWMbaCY8gn0cI6+1nCKh3I9cbd0TnZqsZV2ifdqt/a1NPOvM5YTRhcRsStVMop5wVhEHoy9j9SNRwiFjCqMrPKbdoWNnYyti4WJEIsVC48LfYiOicWJjY3oiUOMeuVtj9WJXYkddk8KO3Z5koCJlItptKSMVTbQikd3SYlRij4LosKm0us0Lo29d+M3uQ0ujdOIro15DdOMeY+kirmP+Q95iSrHTY1wBa6KzYoFjwsMBQ08jqH08EJfDNOOTXMxdYt1fraHd2N37PExNBz3I4sJjsmh4IxojytUJY9Oic9xaFSS8O5UwJL5lESNLw5EjA6NRIp9iuSNvo/Hdl2PfY/kin6Ojo79jJOPno5FjF6MTokkj5OLJIxTiBZ2U4rQjpx3bwEciTIOaFN7suYBq42V8lEI7PGvdKLwGgxxdt+2jI4aDdKIWg1DsloMTI+6jBaI8ohsitH3qoxV9GqJyg5qiAqM6gzsj+4O7IgQsJH2n3FuVwyL7ItWQKyNovDWiwyK1ooOD7EMeokbjmoO4vEAcu4O2PYks2qKhfTqjeoJ/zUZsAC0GgrriLb3kvQMjy9xlfEMiW6OFfPF9lDyJgsBjibxuo109+uIXInbilyO/g+AipYLwfbaDuRzlgsCiLC0OgpWCUYNOg1WCkOJt7RZU1ELcLNe9lqKB1XBV3aPOQLy8UJi97d6Dfe0+goK9voOfIqg8/oMYVd8iIrwYPD5jeuIq3P7j+aNCbHWiQoOUQwp8XOOMLXaCPn0Rg7cjkYIt7RDjdELgo5HiEKNR4pCiyrwY4uHwzIPaFOZ8pyMsVXosaKOb7Ya8hW02Lca84lS77PdFOryMPPq8B+ylbUiiqKMVbGXjx+0FbUa8FeJn7Ca9kuFZGNij+BgpgtvAqYLc7Ue94yO1ggbjtaK73ZriVyJZg2UA2YNQaSSiuYPXpHmCStTko6a8EyP+4uxDAeJKopa8VaNrg6mU/RTdo2tc9KNmosI8vj1tgqI9he1gvKztzKJh1e/tXYKsovmi/hwFowNt7KI7TRyjor2FgnS8J72z4oPjhuNDgjA9w4OO4yODTuOjg4KjJ9zCo0U8pB36o9O8iEMSHEhC4qPhvBKjgaKjVZKjl4NSo/o90qO7goXCjxWyo+ElxjxoHSBdtiOKo6s9kEJMPCm9KqPl6aqiW4NqoyeVK+NBfKbiDD3bIvuCOnx6gslVuqMqHITtGjzRolvjBqPb4gGj4qKBosW9871BolKii72mo2W8Y+MgfZ1toHxgon9suEIOY0LiLByt4vjD+EJnVcDsSaOcHKu82EN1PU28H4Jn4mMirn2OHWcjeaOSg2xCS+IZ4p3if4P1o4i8Xb3eog/jebxOPH6j0aMngoaisaIv4nGig73FvOBD72ylvSfjtKOn4xa9yCx4QZuCQpW6XDBDnbzFo7m9wqNRorAST+Ixo3ASM4JFvTo9s4KIE3vj4EKePVU8Zby8tK+DOMRg7SmjzqINPDqVNqPpo7ai1eN2os2DNrwCQ8kd7aIc7R2ih71F5KRCaYNt4mxCdYPgEx3ir72B4lRCkeOPIwU9gOTXIy4dtEMQos2i9EN/Ve6V5aKjPXe8VO33vTfsfEPAEr+9KyIUfTWjaeKz4+nj9BK+43ocoBKdvZxCwc3IrRF9JaJ54/p8U2JZYjk9E+JhVEXi67iUE1mi+7wQfEJCaRzlxHTBYoIwgeKCTnUlfUaCgyKxfF7iJL2u4+vcj5Xv3JPjATyWIxKC5yNgE3QTfBISvfwTmWQabeds1+LagjKi8oKjgrqCd+IHgv+DgcSybMR9yoP5g/zCNuM8ErbjvBLX3ea9FEIMErOj3rwVfZHsI4PTbGbjlRzr4mo8guIcHaLjBeyjIsoSIBMf3PISnuPGg4KDEJAa4tCiv9wwozS9NuNC47bjA+IQEqYSoF2OHHXsWeLT7eWCSH0ubSCifnz3I+HjeeKkPYISRmQ+EyISPL2+bbHifL0Bbfy97yMCvR8jwWxJ418jYiw/IhItXuOgE7QTM+PGEq698j2yLICjzBMgPHaDzLyeE8p8XhKFHUQ9qnyNo2CivhINotW1CRIebNeC+50JgyXjPkRJgo94yYP0ADijKYK4la3jpEOco2RCbKLco5Miy+Od48ztxKPd4wkhPeNiWb3iQsRoxX/j2FTjIvijaoNFgwbjduN1ohFDmeLcQx4TIeKz7Cp9XhN3I1GCyRIUrJ/F7RXko/3i6eIw7VftYhMuLNSjIiMtozSiI+PhIt486ZQlRXQcrYN2vOMVd4OMokqj4hIReFPi+8QR1H1sRYOL4uoTjUVz4/nN8+I4VGK9Zr3kQ5SjlyKQEryiF2yyg3yjfzVbIzfjWqNr4ubiQqKpLffjk7zwQz29m+KZLDO82+Pslc/jO+Mv4ngTr+M8lW/j84N/NQuCizWLgzXix+PLg/KjJjw44q0Sqz0oEnq8G4I+YpfjaBIqI1fjgXyO49fi2hOzIjoTZuK6E+bjrSxTE3BCk4PTE4/jMxNb4hocO+OrVchDEqJ74m/i++Lv4omiH+M3gu0T5qL2vRajX+K1E9/ilVWkEyYdZBIFg808z6LLvbVVhJSOosmigBJ1PWu9Sy3tgmI9JkLG1F+DzhOJvACI9RJ8Eg0S/BNWEsa0RaNL7TtYG+N6opvjxxNkHdgSz+LwEvMSCBPng8aiixMXEksTDYNcExsT2O1QQ2GimoO47b4TsEKRohOCqhy+ohKUS2wnE0/icxNAkmcSu+Kv4kGioJP4EpcS1TwhPEQSb4OAE68T4O0kE4zsszmZEn/idqLNPPajjxIaCIRDNK3s7bSsWzx2xSRDuaJ+46sixhLivISjQDyxbXE8XqPvvHctxaIeEk2ilqKF4mwS4uzsEiM9Hh0VopwTlaNNEuCSjRIsQ4YTnmIbuS4S9BPqEz8TCghvvYitJJJPIiiZ0ROfvSwTBeOsEqISp+JiEzriaz3hhRIS4H2SE9mi1BJAfVvx9jiYobnVedUDkSPirByH49LshdXFeEcBokMpY8OjQCJE47LjcKRSQtJDgACe7P88XuwjIw7CZ2M9NXjj52P44vVj8uINYmTjpCMqQw1c8uMjYgriNmKkI//Dx1wKI1OiNCKJYyLj7qnD4KPgukKtnKDVmOIw4g0iS2L9onriEuPVwpLiOSIW3VLiX2KXYqKShiMfo2licuLlQueiSpLykgZjZONVQkrif6PJIpTi5SOmI76c1OMaI4dD3OPzowpZdOKE3fTiS6OXqJ5CIrUrogLDpJDM4y5il0wboyzinOOFYiGAvmLBQk6B4sPE4wrYwxB7o5LD+OHhQqZ0MsMLYq9j2pKnYsejPsJqknVjAYzGwyaT76LdY0aTO2MeZE1jaUIIYgSVN6NMaVlCBxn3ow+jsAGPo4ySnpIceT51BUJaIvqT5kM/w2tjBiKJ3Dti9zwrnZtiVhh/YkpCd2PKky3D8WNHHcLiTnxWklndosLZYr+NQGPRkgxjeuCgY27djT35YsVjBWM45EfYAZKKI4qAUGN1YyKShOOikhtjRONWTaGS/UNhkh2ciGJIYiNCGtgoY8EgqGOG4WhiTU3oY9mSPoDPws6EWGLpSNhi80MtCQtDi0JblMtDLGO3wgRiX5SEYutCxwEbQxoAxGIPoo2SpGP4EBVBZGN7Q4GF+0L7gQdCTYT5g0fp1GMnQzRjZ0O0YkOTdGJnI5dCjGNs4kxit0Nx9cxj90NRAaxiRRlsY61CHGOHZS9DF0JflVxipmI8Yl9C30J8Yr9ClRR/QgJif4EmYwDDQmMhYngJImPmnKDCYmNgw+JiAxEeAJJj8oBSYtDCFV2vg3TD5mODY+nCCmOIw4pjSmM/QqUYKmNwAGjD4hDowmpjUGDqY5jDGmPYw+nBG5M1YbjDBBIlfawdnWJqQ3KTpOJmk6Qi42P2YlTCuKNcw/9Cc5O0w2ZjA2K7k3JjoAHyY5ZimcLXkqaSN5I9Qo1jT823kn1jxvCTY9817JK2fcoizpPs4+ujrmL3qW5igNROk+XpP5L0kq8ZXmL3qKziSmxiw75iHpM7o3ysXpPQAXuiUsMBY+ujEUPHYotjfpJvYylckSJ6kitj26xS4wpCemK2QvpixSN1XCUjEV0KkwAjriNfY24jMuMwY2KS8WO7Y+ncjkMZ3fl8VpNhgIWTwV0q4UWTgZNx4cWTqFOE4qWS6FMN1WWS16PApS/cRWMDXMVj2V05YvucpWIbAXliLULlYuBjx6gOwiBSWZJHTNmSt8M64LmSXJ15kikkWhWew+xjlWN3qVVjwaMyoj7CtWMBkrhSoJx4U0GSMuP4Uj9jpZLqdYRSDHTNYiBMLWNr3Ki9rWNQUn6S2ONLY5eS02P4wl1iwZKjYiGSSZM27R+SxmL9Y8Z9j5KDYs+SL5MZw9GQI2OCU0qTo2MEU/6MIlITY6uCX5KXrN+TSiI/kjNinmNG1N5jAULzY5kJWpInY9BT2ONvYnvM8kOS4qtiF2IE44AjRSJ2Qu+S12MZfMmSNkKAI6eMasI7XVpT6sIqQqUiq0PazW3D+2Idw5wAncNtoXIhsOBzwonxvpNY433DCKPfk5/DdiJ443BT6lOyk3hTeSJoU4mSkkLIUjdjGiIpknpT3UPFI++TJSNpkhoTOOIzw/jET2JmU+Ak5lOHov6TqlID3QQig6L443HccpJvk7ZTV2P6U9pSMZJtmLpSxUyOUv9jiSIA41PDOqR7w6xjsoDA4v2S/2VHwowwYOOnw+DiIhKZbJfDa6BXw9DD18PDQ/AJ5CX4YytMTeH3wsLDFZOPwi5SieWgAPWT0ZPxNK/DgLBvwu/D5NRC458TisO44jKS1lLeU0PdGlO6UohSWlJOUtpS9Gw6U5vDipOSU6aS+lMGYshTBlMnXZhSTkPlIxrUVhHhkk9jZUDQI1gj2COwI37NPkPvKPAjoECoIyvpiCKKSMgi1VIoIzVSiCOehUgj6CKZQ5AiwiAVUjAi4gCwI7x83sJSjelTlny44lZTmVP/HPBTKsKSUuxTJZIcUtJSv2Imk1ZisWPsUrLixpK7Y/Ii1COqk4WTapPeIjqYLxmAY74iNFLl6WRTdZJlYhRTzCPlYywjoDn7JOwi6BI8bPDjU1zi3PZMEtwI5XziSOLt3Twi9nwo4tkcfCPZEZYiAiOYEYIiOK1CIgBS6xKiFeLilz2iI9kir6OEI95TNlLrYgNTaFKDU0nMY6IBU4xsgVKpk1Ij6FJDU8YimFOOfFhTiWPRkol8V5PQQtDjEcJY4h5SMFOBXGpSXlLqU1lTDiMGk9LjhpKJk75SRVM23bhS8SOvkwVTb5O5Un5SzlIYUw5DusIlU3rDZ1NnXF/NcliWIlYiRRkRYYixNiJbU9KSfnTnYztS2VI+U89SvlPykiqT9lP6IgVSPVJGkmKT+1KHHCdSU6KnUyYiGZMfUjqZxFK+3dljpc2kU1UU/iPVIwEiVdmBItkB4mMHxGkjkSGhI1eBYSO5AS0SBrwm3LBSL6NWUl1T1lK7U2xT91P6Y4VTZpOnzLbdT1MSIoDTe1J2U0hSU8NJIhaSyuOS3CrjLZyVTGkjDiHM4yhsY1KDXKRSSL32oqFinVN/UzKT/1J3Uxdi91IlkqDSBFJg0pti/lKecQ5TOVNqw1jSCpLFUy89ENJnUuqS51IKARUiQSMEEFUZ/iI1I2gAtSMyo8pS0FN8Uu5A+VL1vVitW/BNhHV9v2HdI1QBPSOaAb15nXj80k+APSLnMHhEPXktffzTbSPlddfR/NMVdeQCh/2b0eVRMfk1DF/8yfysBYwEy9Dz0NVQa3j4Bdn0QqkwAEQhsAAk8Dio8kTfeJ2Ih3wHkNBJb3kQSPwAR/1YMVIxcjAHkXAB+IT3MLfIlFA0wXD1alBWAJYxgiEz9H7Ix5BS07PQ+CmG0xrTxkiyMbVRUtLIMWk0tVBG0nvRxkk1URuRBtLV0JVQVtJl+WtRXtHm0ibSCSgkgcbTVtPHdA7TNtLV0bP0VgC7kQhJvCkiYcfQZ/w1+Of8ZAzbidQCgilRKU+Rg30h0MLSbSOBMc35LSI+08lwD/xFSR1Jv5EjfU/8S3ljfE39JvgoMJwNag2YEIsAmIAbfJkDMfg8DWH0eIAwgJiAP3jqAv6R/AyeAp2IYdPYgIDQMdM/+CgxFQNYBVEoMIAwgcsB8iEm9DUC/pHiDZb0YdOYEDD44gNO0kr1YfW4gFsBtFAx09d4C4mR0rIS9gGvMGb9gQJEMNb9SdPigo99DAPWA7NRrgyiAnHTKwFgAFsAxdOJDKwDeTG7dXH8ZdPYgeXTJvQyAtXRbf2h0tnTKdPi9aJREQOo/B4DstLk9JdRTCDQIZSEwVH7IQj5d4BbAdABoPjt0wohHPEO/fENJvydiEAMGPio0TuEbgJw+JENMtDSUbuIcQEt00gBrdI4AJnSp/gq/Nb8RQDd42AMo/xnsGt8IQ3DyftJDPmAsET9t1CN0zIpLQ1N04FQ+Pyw/AL0fP0g9VH1rPR90ij8+fVZiWYxLPwL0wT8HPhJAaz0E9O8A1RRVP0s+AYpmPU0/fkCcvxsBRUoV/Vn+XPSn3n4/avTrPwFiWz8AYjYKWz0rMhi/QvT60j8/CH5qlCO/TFJJ9MXSfL854g/sDpRQvUUSLQx/NNK/TwCR5AJA3D48PRPidwMVATw9DsBRvwj08ZIsdPd0zZRSkWygEIN63mJ0g90CoGoAKnT63lp0sAE+oAj/biBVmAJ0xPTH3zw9FAg1SPhAWUA2dJm/X/SUQ2x0zZRsoDWQAXSvTBhAm94W4AgAGb8pdLw9AqAIAGAMosAWwEm9ZoN+TBQMrCpqAHQM70xNdPreHXTlvSf0ggzMDIJ09LSEgOj0ucxI/2JDTPTe9CoMrr9x3nF0nfSQkn59GgzUfToM5UgGf049N3Tz9K8AqPSIDKF0KpJdAG4M2fTBDNZidwwpQyBDLoD3v1vff30BALW/TwxOdLAM+H87326Agt9+AIf02oNN4E4AUoCo/0j9ZVxo/VVcfQpWoirIaQCPQNX+O190/Se0TP0EPiYMn35MtKj+HPToiE8KFrTntAQ+bAyeTAUMqYCctLSMPLS83QK03ZQitJK0srTNKSggSrTNlGq0mBI4EjveJvQGtMO0oENmtMOMNrSRBA606wpJdIp9aH1etMWMRowBtJO03j1jtJm0sbSdtKSMl78ZVAW05IwCSjm0jbSSjNHdSozdtIyDGUhztIXkS7Td8h8KaQM/Cm+AQkgn7DrgFQgRCFZyF7SI2HTsH6J/bGQQGLTvtJXkVhxPRHpIBLSz/iP/J1JHXWpAPVgbijkoIQhZ4m2KH4hpEnsA+RJiv06UVABMKh/AYQpu0JOKW8ohAE1YfEhxPG302QgMKi/0FQgjwDA+WgCngwR9Nb85SGrAMaJ4vTuM1QAHjIsDYgyqfRh+N4zPjIEMkeRqdMYAtb9QqHSIfSh23wR08IEKDHNAm951FgG9X/SETKdifSgBCDJAd4zgTJiIRkAZDIJKRwzAzFV0zZRUiGAsHhFcTMw+Wt4CTKRSc5I8TKu9N3TMvVSIPD9yTNf+Xgy/dP4M/UDKfSEMq/S+dDd4jmCRCEZAQ95mTJJMBvSuTLHyOLJk/UdDIVI1/lsM4f97DIo+KkzFkkxArLSZ/gFMdwzDjHy07XTCtOAAYrTStMWgCIygamg+GIzatPiM/PREjMKM5IyO9FSM9rTJUE609gxutNziBdQnjH60poz2DGz9OozRtLN9YoyPTN70KbSqjI1UWozptO9MpbTGjPKMtb4QzPNMgkpttPdMxbS9tPDM+oyjtLKMiMzmjJeMdwz2jOUA3woK/SGMhAgtAJP+QdxlAx0A/QDFjNYM8oC2fw89FUy8PRJMjENmgAd/MYxIP0pMssz2QwZDYszmQLpMjgzhDPsgRkyAgWq+Vkzy9INMWYwOTKnkFEy8PSgUUmCRoGpDCkzq30b0gcyUEhj+bvTxQ3bM3EBeQx5KGsynSDrMi0MDTCc/DkMZ/kB/Wkz2DHH0l4MNOzVAtd59zJpM8HTgAWsyF4NLQOWoQr42Cnn05kwC2CV0vfSNDIXMuUgPtJPIM9DsABxIAwzFdIl0sMyovTw9V8zrSJPIK5SnSBPYvwN63j1DMAFALMdItuBe8Nv0gnTQgx0M5b1oLI9ItuBTKiAwzm4X9KLfBcy64CpU/jFJvV/0pQyFzNVTQAzQDIwBLICeqhgM1X0XzNLopAzgQxos/HSQTJ5MbwzLoiJMvnQsTIwSAnStdN70EgyoLOxMkRxJTM9cCChvQAbKEQBlyjPAokFu5F3DMkEDw0pBGeZjw3bKLH59wJEAZiNHXhNAdFwmQUHKW0BhymNANiMQlHSUaUEaIzlBeiNeIy3AucodwO9MSSM+AHojWSD12BUg40E1INNBDSCbHF3KIcwdILtBfSCb2BI8fOBAnGGocjx4LATHEHkwABHM9xB+4A2ANAgy0gOCYKyYSDCspZhIrKosWXS0nD8grAZDqgvEGKyloH8ATphPRCVQe1SFTnCsrMBsWSF6XycHNKgQOaB4SR1sQfEsISFwJzT3sIL46oSvRI/gwyTL7xJU99ZY/EekLmQix1ofZ5dpJLysf9dfxOWraHMaUxvQdqyuvAycPmtZqzFo3qyWa2yXAazcl0okQQIP+OJvDQQFYT7nKqR0rPbwLKyAyVyslYZ8rLLSampdKhKs03AyrOdWLWwqrMKsy/cf1P6TDtTBkwA07tTCZJY0y9Sj1NlQjjTANMg0g9SQNJpkm9SXmWgAXcRK5L03UGcrkwhnG5NtwiECC6y72NJfIQibrNU09lTAVIM03pTHrLY06qkXrLus5pTDNIRs4zTzlIpUqhd7k31EOGdmTQRnH5CFKSkpFGd8bLRnVQQMZxdEBxddBH+TAylMrKBTAmciZwlNEmc4U0JnUMQ7IxhTSmcFTRJZJU1nKXpnXmdDTS1NFmdOZzzEHFNhbNKsHmdcU3ApBTB1Ql00uHxxnCMEtJdhZ0mslmQ+rLOtFXYIgHmohWz9NzIdQzdVbKWaXBVB8VZIGwhKNMV6LmAYsnT4iXCGwBxsxk0nkxZNLNiibPeTW2y7RHRndQRMZypsnGdabJFNemy/RCZsoMRIUzZsmylObLkiBFN4xGRTZLpUUzFswVpMU11NTIRRbJjsgoRuZ0JTSWzmWOS3NLwAbKpNFKQaTR0tA2yDHSJHNOzzkxlkISlM7MhnXkIMePwnK2zYZ0NEVGdGUMJs5GcPky64NSlybNdsymydBA9sv9DRTQZs0FMAxGZs/2zyZzlNOylg7OpnUOy6Z3DshmdiUy5GMmDvKTZnbFNshEjs/FMihCTszmcky2teEKyeoBYICKy8AF+cKLTIAD7iLHIDIlMiY/Bd7KqSRLTxA0UA1V1OjI9fEhwvX2X0RKye4iPs/eyNogXiCEhj7IWMwHTukiniPuICVBis9eyCrNwATYzk/nniXez9jJFAMpgGKBOKe0gVWE8UflgEdBOKJSBhFCRYY+xfiHqAVAAHvy9+GwpWAO5iDUo+tBFMZgwcPjAMz98c1EXUQwggiNlICABuAHcIOYFDDB6DVJIMHPdAz/8HDIbMohz+A2JDIwzhNEKMH/0UAKlINAC21H20MwhTFG4AZBzYskMKdghiclEDT0DhLMbYMDxpHH9cRkFYPBZBSRyEPAlBJDwtQRQ8NSMtyhYoTSMtIP3KXDwjylccLyznQXe7XYSX92MgprjlaipEyyDpyO3BHqNNKTK06gAx0BPBWaA+CBr6exyIqm1MkQhFoGwAFxzgqkBqOh4BoxPBM8F4qiLcfyz9o39IlqT7lLtYtdTqNO6k2jTnVMVnV1TQ8LPUt6yHrJIU05S9lI804UiINOY04hSykNSc/jT5pIJY/JDiiMs0mcc2mw2ky5DtOKurHaS8t3T2B5CjOLMZY6T7mLDwIBSHBh/kiBpm6Kp426TQULiwmBT/FP+YvuikFPXnFBT0OIqUtzS95OH4qDV2FPJfThSqpQZYvZMZkD+wv1S22OA0zeSKpOcUr1NXFPazeGTt6Nz6XeiKNL/AA+jHxFRkhNCT6M53diSaNKZUpTSWVKykxjTFnKk45ZyjNNA09JyMWKHU6rC4bOOUlJyeVNFUzGy56zM0yVTGZN2NUdC1FKlzbal41O5YuRSk1JgYxRSBWOUUhBi2/Emc8rDpnNQiH7DuFIWcghS1mJSU0JTdlNOQNZyFsPlk1ayj61sgJWSyGNCwVWTTgj9jTWSj621kiOSmGIKRA2SuQCNkjhizoS4Y5hMeGITkxYAd8J1k3NVvZNXgERjHZIKEcRjJGM7Q92Se0PkY2tCfZKUYmFTqBKV6QOSp0KKRHRidGMzk1tNI5MnQ4xioMM3Qs5AzGMMQPdDLZMTko9DFNg6qNOSWqicYxVyE82zk9xjH0Lzk7xjB5LbBPxjf0MCYu9Dy5OAwv6yNBAgw6Jif4FiYk6AG5MSY67xkmNSYrGyGuJiU0+SQ2N7kgpF+5OLkyjDh5NHkpoYqpAnkqOAmMIaYtjCIYGaYhJiuMNWkDpjeEK6Y+TSmNI0096yVnK2Ym7idmOJw71jIlLGc05iD5PcYo+TO5JwwhZie5MvkxJSglKSc7JzpsOsw7ZiJMKLc+NjFrN6HbJTtCLk0/cS+MOacnC1WnK+CP+SvNMbUh5iClMk0i/DHOMiwm6TQsDuk7pzfmMSw16SAWI+k9LChnOXUtqTRnL+s85zFNKusv9SobPiItTTxUKycrlSPnKvUtJzZbJD5ShShpJzc5JycnM+cvJzNWS6w3l971Oz3d4i2FIsU8NSgZOsU1Fz3VJPctGyz3Kes4PAcXMhw0RTXTWk0yRSfiJxUsFzE1Kuw2ViU1KUUtNTBuwg8k7COWJas02zXAATU7rgIXIZIqFy+ZIVYg1yjFN7qExTbVO4osPB4XJgIkWSZnIpY7Ny+FM9UwNTIZKEU2bCfUNwYxliNnPXndxS2uK0CYFjvFPmU32innNQ47iVV5K40xtzT3Pvc89yBkAyU9vAKcNLc1NiCyyrcunC8mKWYhJTw2Ibc/9z4bMA8xGy1ZDsgXZji3MyU9aju3Kq43JSbCPyU2ziLmK/kwZyc2JKU/+TGnPXc60jN3IWU2TzVcOWUnllYnLm3bdTD3Jhs4dS3nOBU1FiOxxfolGzt2LZw3dik6LBUn7pe2LtwgdjxlKHYqZS3cLKU8JzMOL8UhPNLrMxzejSPPOfYo9zBOLo8zTSvVO00n1TkbNo8rZSeNMPUrTzKpIZzQ9jj2Ozws9jZlN481dSqlNbTFLzRu3c865zbrMK8ntT6PL7UxjydNIC8trz7rKbc/9iOsK+s8LzgOMhU+mFB8JhUyDjoOP/ZSfDEVLnw+STrBKXwlNpd8LIE9ajdsU7coqjqoD/c29z+vJBUhIkMlLd2D/TqVNdgW/DjPM/4nXAtvOy83NyHnPzcsoU23O5w36p1vM44sbd27xdEn3d6uLkgR7jjHKCgsMSIiJnPKS8C3OgvO7in4NjIp8TQYOEky681H2EojEVGyIaokF9WhOCktpte4Pafcfdd+K+1IsiXBWW4ii8vGzJ7Gi9gYKDExSjORP/IuUSnqIwQloSmqJ7ElqjFhLZvFHzuhMLIq7jUpKgvBvcthO64nYTvZT2E4MiDhLi8krBzHK6LacizhJGEi4TwfJDEiGC9uOFol58JaLSvGA8tyOh4ncjYeOc4txDEeNqLEkTEnU1E6lt/hMIPQETXoOBEu8ibngfIig8foMhEkPsAYNhEjpzUz0lEgOC4BJ9EyYT0PIsmEHi3L0uHTET0r2IfHETTezVEuXzkVLf45ATObxR46Wine2mLAmDjhIJfGkTpeJHgMUVaKMavXCip+0YogiinPKIouYsWJK14nq9KxJmLV7ylnGwoiPz6KKj8kVsleJ2LHUS/eLt4gPimrKNbJyTvRQNgiE8zRO4rfTywyKPEqPj8RyjFOaiviwWox0SE+JL87YSrqKBLO/sXYLBLN2CahPt4gHjX+z9EresAxOp4tE8hfNso9yjRfJXIivjOxJ4HbsSEfIFnJHygqMTE+vjhxMAQtMTIqMAkhlU/qI4E90sRqLlPXGjIJJ5VEgSEELmxMsS+5wrEhPyqxLyonDj3+yrg1byGxO0kqO85+ObEw7DWxPTVLNSOxJaguHzyfPn8uPz4xM6EmnzBxMGbP8SUaIAk1gTcJOAk/CTOBL38xG9CBMLEo/yWTyFLZF8Xjxmo1cSG/PCPRW9fhKJEncTUczpovty1VTBPNiTa/M7VHVVzxJYQrU8aJKNVDwcTKMtvVkSqexcojkTwYIn84nz9uJOHfnj+rOMlZGjMJJYEghC2BJwEkCToAuxo/fy4ApIkhALWT1I82I8KBMf8uuDoaLXLHTcP/OixZXzF7yYExvij+PACoCT+AqgC3fyhAtgCiCTeBIXEsiTaEOXE4QSABIGHE6jKApGHThDVb3GHPcTMqIZowgKFBMXPVyThEK0rFYdgHz4kuR8BJN4otkT+KMYC2siuRMn8n+DvxLBHFxD/T1kkl+8txK8Q7nEDENUkrzSTELjPMxCw+KoE+ETzfNfEpETIfLEkkrsvfL/gxGjVfPC7GyTffIxlRIKj7zvEiIjnAq4kgbVVBPtPZB85cW2s+sTQsQqgliT+EQVEtHjWeKxE5UT4DyOg/ESVYLyCiUcIKy7qZiS5BJjPZezngATHMHQYtMzHT9gXXn80wLT9gCis6YK3zIi050i8xx3gW+yaLAMc60SePOGc1zTHPPVY6ISsZLbU3qTrrIOIzzzXrPU895zxPKA89jST1LOC7byxPObc0LyBNIKc1oiinNWk85DIx3Kcr+1KnOs4vTjAs1qcn4LjOIOk95CJ3POkzich3L7odpzZ3MgU+6Tlekekrui+nMQU1dz+cy+k2ryInPq8+aCPoAo82UjEXOGwmjzbnPXk+5z0bNWc5jzwcNmcnNMmWLnUxlCkCIRkneikZP2clGS0ZL+ss5zonIucvdzlNIPcjLyvPNecpPd7goG88aSCvPxCz5TivI+svdiwvNK4+mTzNMjUgFy1GKBc0+sJWMyorDyOZO5klu8j6wsIulZEGMJY79yqkN/ctTy7goA8y4LSvJA8vBj2PMx4olTSGMjQ0lz1ZIK4ClzqGPvMLFTOXKVC5hjWGIkY9hiTZM4Ys2TcmwtkvhirZKGU/FzGAG5c6rJ7ZNEY/lznZJdCjtDpGOFcuRivZIUY8VzJgmUY/2SVhBlc4OSjnjnQsOSTXIdnZVzV0JjkjVy45K1cixjvQt1cxsEU5PHqQ1yPgmNch0KsRA0wn8Bm0KUERBhLXPfQ61yKoFtckuT7fAdckJinXMipF1y1XLdc3KAPXOV6L1ym5J9cluS/XPQwouFA3Orc7uSlPNDYvuTSMPDc8pjXAEqYseTqmJoASeT43JYwxNzQsGTc+eS2mMJoruihPO6Yi7yivI683jTcnOGwKTzd5JcnM1zqwpnIgNjYlODcutzVPMSc84LfPKK4u65zwscwmjiBcMvc7vxTPM+Q8zzgFNasy6SfMNzYmzz82KackEKLPIukyXDrpIgU+dyfmISwos0EQvek2Pytn1m4FzSfFN2CvoVGvJVXbHcGNNa8wULuNOPCkryCpLA01qdMnL1CjTyDQoxsobzxQsKczQi4SQ/czUKrFO1C24LLvLvch4KuziNCtjywPLB7FDz0NJBc6DytFOlYuDzk1LBINULc9ihC2UKDUPlC409FQsw8nDy+510U1059FMVYi8KVWNxqNVim1Iw88jzP3I4UqjykXLJC/+t5nNYio8KcvIY8sJTjWJJC1eiXFLxci6TOPOx81J90Ir48jqSBPN+mBdSs3IIi0Tz9Qo4it8LW3N08jtyLwsrcmnCJwriU5Tyw2PO83UK2Ip28vzy9vL8i9tyd5I/C2ddTvO+4s5izPMzYgCLFelAUiBoQItHc2zytgo3ckZzMIqeU7GT21P3ck4LOQpMi9ryzIs68iyLflJ68zyLnwtHUh4im5zg0g9j4YRGU1wAovImUl3DplOq8u5TUQsS8xZS8lJc81c02QquclTTTgsC839imos/Y0mTvwqYJciKoot5C3byICJoi7vD4YRAsrPDT2LHcyK4EvMqUpLyHZ2wih9jysLRI3rzUbMoinyLn6MHU69z1NKWi7yK+QuDUwDjwVJG80Di1wHG8+dFJvPhU6bzYOJnwubzIgut7RbzQ9hTPdvyvIUe8+oLNvMii0yKrvKJCm7zb9zzAfyKecIO8vCyaVOSih1SIYqfCiiKLgsuiw8l9vLBi5tSbPL/482CGuM+8lxtRyMCC37zWuIcixnzShMHIy6jiArN8nwKpRO9E98SjJOh80bjIxPTI6MTkC38ouMSqfOMfDqjTHzp80LEluNybFbjYcMrXai9pgg8EjKLvRgMkq3yofIxLBJcyfMm4inzpuJzIhMSBxKTE8S9eyPFir3dNhNpi8oTv00a4woSVL3MgiXiLHMNQh2cnKPoC9kT29yYCgIKWArF8tETQeLpxR3ypfI54mXyueJFHeXzWgsV8gKtUJIaLLALyRPugzy9noJx4m8i8eIyRAnjwRJCvag8yePCvcPtKeNnciUTGYot82oSWYuasyzS7fLCEyXzNyI9iiCi8RKgogkSrBIR4vniTBOug+bzS4opEyhsefK5bL8iSsHT8iftI/O0PaPy9DxQi0ojiKP1Ffvtyb2T8hVsizUbi/XiGKOz8zvtc/O1bXUSC/P1EzE8Fr2kCrC1fRVD4koL01PhhQKSlK1Ccm0SIH3lvDcTm/NvEk2zS7zG1Tvy7gESPBqzLfIzivpVB/P/rLbhBJK8EhgK7Yv8ConzGePL4iMTlYszIjfjEG0X8s7iY4KACrh9OAowkw/i+b14CiALNAuZVbQL8BOECvQL4AoFLRAKH22IHAY8O2xSkUfjpS2rEm/z0jzv86vyH/Nb8kB964JYHDUtZAqKHZCT2YqfivyisyMp89WKAAqqPVHzd21X85gSwAv/ijQKYqIEC4BKwJNASmBDGTwMC4/yBBOLvVAL6/Nj4qB9NxP3I0uL6JNwCo08VQoCU3/ia/NCgrmAqJNYQq8SqArNvGgKBJMvi0YTr4rqgv8iHqMdiqfyIxIYEjgLXby4C3+LMBJoSrfzBy0xowQKQEt0C5hLFTz4EthK+j00kjSin/KpvGGiaqMXU+rclArQklQL/xLUC/RKy20pPIxKGEsIk/MSxqP0C0iTLEqMCiiT9qMkSigLpEssC6mjD4JsCxiTeMIIC1isxEpXikI9OJLs7SoKeJPcC1CtHT3SfFkStBNSCieK3xKni63ys4q1sp5sUBMNokuLSr3CEyuLeeM3vRit7BKMQuIKlaISC+eLg+M+HBmKbYt8Cm+KVEqG48mLphJKS2ltnEukk3oLizw8Ql2LVrRaStwTkz2tov+87aPckh2jqgq8kk512JOCfO8dQnw8fcJ8bnWLUgc9S1KHPVOcRzxvHRaTyuOWk2dSzn3+8igQUNP8g3IS2fK+8smK1EvvEv7yYuJKE0Qs5BTb8+mKU4o6SpmLGrPlizIKCj173Gfz+9xSjWMTX4q345HyyEtp8y7jhYuLIzHzZ91W49+FcfKYPQvjYrwh80SSURMdvP5Kv/K7E+HyTuJNLd+LlhLjgooSGfO2YwHzmfPu4oOVjYs58+uLWhUD8z7iKwpSC1OK0gpEk0MSgeL6SloKheKVEwltwKNVEwuK3hI1EipLIhOJEspLSRL5S2Cj1fMvIzXzceJ97KOLQRK+gp8iNwhfIo3y6DxN85OLQfOZZOWKT4oVirILnYvt8jETweLZ47ETOUtxExA91RLh44ZKMYLYC8uLsYKDij5t/fNQokV8PuOpE4mCQ/KpDKw86KPl49vsY/O77ePyhgsT8ufje4u14/uLdeM0PZuLmr2Hixw9NYPHinQS+/KuEoId9YJNEg+8bEv67C0TU/L4NN4s0Au4S5/jFqKdEyZLgfMgEk680+O78jPje/ML875L80G9ghyjfYNyS+lL8kvSClFLGoIygx+L/kq+vLZ8gUsR8kFKl/M1ilfzv4o+o7gLqErTvABK6Eq0C1lVPS1nE7vi/SwsSyBLSBLSouF9VYvGci/zvUqv8vttCb2sIs7ypAvQS0dsB+xf8uxK5AuKS6jNZhM7gufzsUu6bdtLAAq1i6NEQAp7S9xK+0toS7fz6EqHSpQcR0uIk+cTAkonSleCl5Ori+mL9KOtgzeKcMT4Sz4ScAteHPAK7AoPE8+DHAq6kpFzTxJqlQATzAoiSjhD+oW3i5NLizmuo7wKPkrTiqNKi/I1S35Lb73Mk0wT44O7S3RLU7xwk69LDEp38u9Lq2wfSgsTRAogS8QK9gockyjVWkpQQmgT3/PbExQLBUpCEtATUxNHEjfz1AoMSs9tb0sUHMjKiJIoyp9KxAqQC5Tt30vESkgKzxNJo8gLyaIsC2DLDO0bvQDLjT3sChJKiAoky3/wUkqWHFISOaL67Lmjn4OQyxaClEulEh3jWYvEkoITBkr47VxDWgqqS/6KZaOUrGIKFaMaS9STmkusS1WiqoJt4vJLI0uLS9VKfktRE56jNErYysILFRLkk2zKN72KC1pKEMq5xcoLUksxHIB8kH0WStvxRRKaC3TjcH21S/B9dUvaCjlKoeILio1L3fOqS/lKYxylctu8B8BRaF+K5PI9ovaKt3K0i3eKt52wUujS4nLwi6GzKor685aKYov5Cm4Kpospk4LzqZNFCp4K6ZLoiiNSAGOwNNaS3II04z4LaHU1rKpyQt2Ttf4LDpJZtBpy5soHc35CrpJncxbKIIpligyYsoq+CcBTQsrCRQGLF2TsYlbzUEvgJITStnxE0qiIHkrhw6O12JKSyoYLmgvF88IK3YrzihWDPYrd87nj8suwC/oLrHxxvZ7ymxCcffAYXH0tk3XdjbTCfNjcLvG8fPXdTkP8fbeYX4Kj4lZLRVzWSjXdezyI5PzjONzI47jdy1PQXOoL8YpOyiUK/nJOSy7KJYvlXMLC6AsMy22LlEplE0vjektuEmYTtHyjEibjn4pnS4FL//P7Ek9LJ9yKkVF9RnwJgkmKK9wpSkYL3nHDkGYKlgsxDA18QtPbgRYLSTOEFbezxgt+0g18/GHi0j7ST7MH/QZgJA2XcZ19NXVn/ff8HtN3+S1w1gre0mLTgTCDfH7TrSL+0wsy37IlyHv1o3zdyJlxmPTYMy6JwvmF0uKC+dIG9AwEqgJx0pYiFdN3M4wDs9OF02XSNdIx0mgMkLLuDNnTPcrPMnooK9NZ09XT9dKYstj4uTMy9XHS4dICAnYw4DPdysnS0dIG9SIDI8rx0mb8WLJl9R3KydIp0mb9uLIM9SPKGdMK+Q3SqQJK+PfTmVCJ0gPSaFAt0iYhQ9MMIG3TpzNL0EwC1v090q91vdJ7Mlb8u0jrymeYG8qt05vLw9Jr0yD009Lb0jPTK8s40avL6ANM9fPTvP1HykD9i9Ls/QRQe8pWKL0xrvib0qz8LPQc+dPT1PSnykz0etPe/QP0LP0U9bfK1P0s9Gz569NrUXPKG3i3ywfSd8pc9a/KJAWP0lmJF9MT+ZfSoviK/F/1qSE30j7SbjJbM0syP/jw9KAz0ABdyh70UDNngRAyMdOY+SCzoPlQM9Ay5dNd02hyFzNIAPAzyDIG9anS39PgK5BAMCox0ocy1v0P0jHTgQJTyzZRT9Izylr88PRv01oDW8vHSGd81vyf0ovLhijW/Q7yCDO/0mPL65GBSHoDkfVoMlczKADXMqvL9324Kuhy8QKxMDfKeCq4M7sy/gzXeBoDN8tu9VP8LAX++Zwz2Q14s6D4VDI4KvfTTP3FKeH9NzLYs+yA9DO/M2Bwo/Q20LbR4/UeYSQDXDGEDKwyYjGlMzv07DJl+Pgy2zLHeNwzDVAV+OaIF/16M/VB+jMGMxN5VgpX/UYyZjMwAOYzZcrBMMYybbGCK60i2sifyBIpI31WMuQB1jIYUCcD1YmEKXAAZEjJYPYyf8sOM39gTiiDCG4ozjIayS4yqWGuMr3LrAMGAgCyPjM4sjgqsCoAs/izmzPSA5gqcLKDqTuBoTM1KXEyw8qSUGfLhCoXMysyyTL4KgQrp8qEKgt85CthMmQrxCrW/Tsz0CCFMmAE18tryMYqWDIUMCwq+UgnyWQDrDKS0lXKz7MkDdwrVAMr9XXKu4kocFQMNoj0A8N94TBKKrjQtMi6K7kyOzMlyzEM+iqd/QQquCqGKlP8rALs9dvLuirw/SwCZirby3OJhirqKtgpBdKc/P/8FzJ5AxUNbioFAnN8HTMmAkQqFCva+HgDLitxAQ8ybzK8M/4zTzNEKiHSP/jdyzZQDQxcYREqKPifMg4MHzN/M9gxi8qN9LIC8LKdIZEzG9My9FCyAtLbgD8yvzKTylt8ALLfMtuBNorAsjHTM8reM5kr54DgsmgqRipK+XPLlFE5KoCy0LNYAUdwzI0m9B3KcLMosjHTXcpqK7IgBvVgKmorGLNoK83QlCreMiorMCvpM0b10TJA+QSykgSXA9iMDLNXA4yyNwMzHP1w22FkcoNx5HOggpRyxLKYjcyyFylxBcSzRI0kskkE9w3JBQ8N5LKss7cMjw1ssjsx7LO3YRyzezE0c1yztIOccbNxwys8s/NxRKCciurzxkKygZGLjvKteQQBrHN1M5BAvHJCqXAAnHPI4HdAHHOK0jxz7HMCcsjwa4BfYQeYJqDLcN0iJcqrMsV1XSIWCoCzhcuaAeHl1QESspKzxMUTCuCLoFMXcxCLl3P6cpELJYLs8r2jCov487dzMQt0iqZz9ItxCsWSzoqC8yPCQvM4iqyLWPL2TCkL+2S2c4WZEZPZQ+kLDnMZCvlD6YqOi4VCTovic9oib3Luii6KHooHU3LiXnN6YnkL7opWix6KxQsE0vHKH1Is0p9TdUIlzSDy41MEizmThIugY3DyEPOhcpDyuYCxCpaScQuRcn9zmsvOirGKzyqY8tIA5sMMixBtlyqyuM0LlZI86S0LyXKtC9SJ7Qupc624kxDpc7NDXQqggU2TuGKhgNlyKuGtk1tNbZL7gXlyawpsIUMLBXIjC7tCowsjlAMLfZJYo6mCZQrXQoOS5XLDkhVzaUszC1VyN0NMY3MLJaG1cgsLFgCTk+ohiwsI8n/w/PGcYrK4rwofQzKy6wq8YhsLfGKLk/xi/0Ozkx1yGGPGdLsKomNrk91z65M4wxDCLBBQwtuSScuLHccLFPPPksKKZwpKYucKh5IXCkeSqmIr8WNzGMPqY9cKmmLnk1pjF5IBPIDLM3OWSw8KqouhizTyt5Lii+7yS3MvCyZiK3JmYhTya3KnCkNz63Ixik8rIKtvK2Niwqr2Yp+SwDkM8zucSxPwC/wAlsq8wlbKhhM6s1uiunPgi+aKlnCQi/ujRtVjKtEKDor9ChTTXPMuctLyWvKayzrKR1O6ysdSxOPqitFz/VKIikULHgvyc/rKXgvoisHpGIoGyrUKipJBkhqLMYpfCucqlHi4ipcrFsLEUglzVsNjUtDzOXLkislSFIqk0vDy9FJhcoVjVFLfK1DyMNJt8gyYlQpMIkSLIXL/K/DzHGKVYp7DVIquqTSLl0pSinSKmIuo8qcqZquSquaqesuXohcq4KrabBCqcLXsilJ9GxC8U7YKMIuHKvcKQT2E8xFjGos6q5qLwlPSqvTzpPPGYmKrgoqsq+JTwoo7wQKqWspvKtrLcKXfC/9tsqvQXAVc4kvyq9bKilLAU6zzR3LAi4aAySsegNTCmvNwiuFj6CLPMJgiWODl6QlgDVKZqnCLg93qUswj7zF0Y0FyhIvwqMkqZyPwU3GqIKp+qrqruvOuizjS4atmqmaLHFJaip6Kn2jl6bVTjVPkJNUBUKnNUlwRFVIlqt1TIYqCq9iKoKrlqi8qbouPcpWqEatmi/ZC1orMQbCJ5FOuqsSL5WNhgQ7zgMI1q0xBEeDWZOXprVJEfElIrkE9q12BvarBpQWqRuDZkkWrOZJ2ixFDrSPhJVYiP1I2IgCp5UzDqlYJ4SWw0gEigSKVIwjS4mWI0qEiVeA8w9FDwFgQyW0UpJhiQp+1fJwk00EKeZL2q5SKTrK23XqqlnOFCvNyKKWs0tkBbNL7BezTNSNhgIqK5sQegLWwZRQAAHbUGVyM5lwBq5zzbQvDqjaq7NNGgDKMP9OUhVGKFTnKIxxZYxzpq/KL7PKHKlyLp2PBs2pTcZJDotLirau+q5WrvVLminqqpapnKlFjXwsG81qKgOKDlDqL7cMHYyZSR2NuUj3CIaucix5SGvO3qzdTd6urYzLymlPPqwrj5qquii2qFaoJk6Wqj6ry81Wr7yrpsDaKj2OuUqrzo6rXqwcqdgqhq4qLDgpwUlqqJooqi9qqfPPAarrz8vI6y6crpoptqlWq7auvq56Kg5RA4/vC3ovA4p6BPovHw76LZvIQ4t5xh8DrKx0iGyprKp15BcqrKyLTpXWi037S5XXly31R5jJtfcJg1ioXcNggl3DhKFQDPXzkDb18YABbK1f86SBi0k7wZCDwARv1M3gVyk3Kw32Vyosz37LpcLHR38nP/MHTUSuN0n11S8vl0s2IlSBlKiArfcqjyyxqFSvS0uEr6dPLAKBR7GoDytUqFzOca1Ig3GqqKrUqSdNl0uHSfGpVK0dQ48tG9UnTUdIHgIJq+SvcKZPKs8r2AOuAomt+KukNKCvzy8nT8iESa5vIk/jUMb/L19N/yn+wt9JKKp8zcDNwKkAzrGuTSTL0yDNKajgrFSpYKqlS2CuQKsoq1vwAM/4j6mox06orCCp/ACkrQmtYBcgriCtiatb9qCooK2cyGCpMSe79CmpsagkMEPzw9dQrgmvoyNsy4SoMKrpqpDLw9RZq+msZKtb9Vmo4KjkqFzM2arn5W/xVcMwqzDN5SEuIRHNrIGQDtXBsKmwy7CtlMpMz6Mje0Y4APDNDMsjR7mpyMQ4wnmqCA2eQHmrea25qXdBearwoOjKkDS+y13BHwAkg+jIGM1nJErLRKMIrZjImMxXLasmhaoIrYWsiK1+yUsgtysAA4ioSK/+znMlSK3Yzh4AUSKQojjJyK04z+WAKKhUwiivMoAAq0tIoMcoraip/Mu3LbcgmauEqdSpgKxxrMvUhM5oqSiAaapwy1vyRM54ohHJF+U5qxfinyK9I4klVyqRqMzIX/HYrT3ESsnMy1AxNSbQD1A2OK3EoTGqz07t0mSuFK9/BF4GrAeIwLAKnwReBY8w0iAQgD0PAK8prtSuZKzVrmgANa44IjWvKDaprWWtG9XCy5zCdIE8htWt1q+VSo5E7gSgjSUhPIafArWt2AG1rYgNmauxQUCqZat8z46pPiROrTyH+BI4JdgHTqpFh/gSzq1xh5CFKRL/RNSvmaqkquStTIH8B6SvwKykqzWuFK+eBWSo7ABkrWYlIK9izM2p5KoZqu9KFKmCz54HQssUqKkl1Klf5EgWdDSRzRLIooekE9QH7KORzMIxtKiiho3GNAWNxPQDss31RVIx9AdRzrHGQALRzrQR0crDwoyuI8e9hSPB8g4JyS3CHmCsrdX2NfaeZHAH0Advp5grB5PV8t2p3aiCwm3D3gVsq/Kw4bL84gyVDnKNdw539cl0FLyh0NchNVJ2V+Qw0NJxNJYMEnI0tJcMEWExsNaBhjJwdJUywVbnqsXhM4KmFFfnyNsugGNVLCkqh849DTcUUWRKw9iyj2VBqy8NKi9kLyooGk3+qOVOvK08rUqu6q+WrwKv/qsqTZaseI+2rfQsfrPiLWZI2q2Pgjx04bK9rI1yjjaNdLMAo69RSqOuTKgXKjXzdeQ9rrgAgsQ18bXnTHaXLm/T9URRwQXEtfE19A3lPsh19N/iH0G7Ti/Tu00t4WgCRcUfRdXRkatQC5GpxcP18jfnTeHdrt/zX/UN9R4h0a83KT/wMas/9LkkXsMT16Wr30str7IC0oE1rq2pwsryoBjM1KXlx8Cn8/IEplmr9yGN9oPTAATwBFgIyICoFVHF7sET4gPzdyOkxzOpLM73KTdLW/eHSkmrZMkNrMvRhMmLrplHaahcz0dLAA+cNlHH86oQgRCBWA/lrUAOWKi5qnQy9Al0MUwPLAtsNKwNTDesDGw0bApIqswJnAwsNOwxjAh4EywwTA2MMawyWBboFgwJzDBsCMwJq65sDYQXq63MCuw1jAgsDEQWrKYsC2urdDJMN1gSrAvMCMwwnDYcDKutOBarqHMinAhrqWwPbAx4FRupeBTgANwwm6kcNqwOLIebqVCDrAzrqGwyW6nrqVuuzAgbrowPW6+EERut7DcsMFwLRBLcMO2pkcS0r8zD/AkiNgPX860D1gIMFBSVxMus7gbLrdHD7agxxfXCHa7UEjQUDKtRz1II0czSDQyu0c9yzdHLzcBdqC3B8soJySyr9IitL0JLwyjASCMpkHHjLxO28S0jKOj1SHR9Kx0tYSl9L++L9Cz9L7RIiPVkZNMqCQ+ZLeJMYwJiTnIWjHL7LFuPmle2FqeV5gyMcLYUCkWx8uer0yjWDHYTSY8BiDgpQ6o4Kyos5IyWrjarxqnDqCavPK31SG6rucpurrvN6yoarxVOnU/HLnysiy9gJNgsMc65LSYtq4++LJAqx80GqiUqZ8g2KYIgUFU9j9es+la2Kycs6SinKTMszitmKDuJ0fb/yVYt/8rZ834o1itnKVhKn3KFLRYot6859NuHW4vHzEUuDE8fyHYrN68MTPevpy73rGct96juK20txS5fyg+p1iy1ib92t672kHeoKeclLr5XHIu1KZoIdSs6rUONJyvrijMuZi6DrfMvWg1LKc4tlgvVKOgqRgt7LvYo987cTsgtFooVLbJKrikOKARLDioETSDx188Eg9fOCvA3zQr3ji43y4WzhEp3rq+vJy4zL+/I/EsA8tUqb6p7K9oOl8nLLoqw76j7LPfI0SgOLXm1NSvGCVrJri6lLy+rn6rCjA0rl4g3j3Urbiz1LVeJIo2wju4vIov1Kd4vOqq/rQ/JCVPXjW+xDSxXiR4smvHzAtYK8yyeLWL2L8xgcy/ItorSS10sr8vGLPNOXilrjQnNp69cSHRNqVFvyINQL6s+o3RMkffNLPRKL4r5KfMtLSs+LZx2H8pfdPMsRExlKRfLuSwwTp/IxS2fysUur4nFKA+rBSz+LzH0oS1QK/4qvSwnqvEpIy/jLSevIy/xLwEuZPajKMbxgS0gc4Ep+yrJtcqMXSgqiXqrRiujLs0pkCsqj5+OwSqqjEJIcSuGjSfMbS7HLFehbShfz0+uYG/MjyEscFc9L8MvwQrgbPEuIQwdK+BtlPUxLKEPxosGjdwqEEpwLH+I3i1AbP2ytSovt/0vVvIRKyPJUy+QSEBvN6jPlTAuOosQT2ENAEhE9FBvf6xWYkMo8yqtKQBoKSsAaMMp73LDKAsoJPHBC1/M4y76iPEqzEqcTcxN8S8CSzEqoQynqRBrkGjbyFBvgkrdLcEvrSkoccgsYEgTtMhtHg7IaLBtyGqU8CJOHSwTLBBsoy4QbRMulvFAK/CTCS2TKYMoiGqJLVqIYk5u8/BuAyxmjZb0Z6lQT0kviyjwLh7y8CuIaUMoZS5FKmUqFolcjggqSXRe9j+pXvTvqogr5RBzKHBLUk18RnBN8PaAbGBzaS95Lnes+S4+K6+tRSqGCJJLSGtCS9hq0Q0ZK0svfvCZLKBMwGgXFZhrmSqoKWetxHWdy14qjLAyjv0uJc6LKtMo8khZKTcTCwtir5+pp4mvqCBoeGutLnnzX6iXzm+syyjK8DUtd87lLjUp9ihSS2/EKPOgaAUr2TPQa//L5ivMiBYoLImF87IB6fP7Vdsrug4HVkAs+bJ0UKB36E6HU+8V8GlMsZH3GrJYb1aIF858SoOqSG+vqOL0/8w7j6Bp/8w9L12wz6jtKg+osfbNBWRusHFyFCstHcylKoRqZ6wEaMks5cg7FwxwRVMsr32CKYc116oVvKAQR7bFTHfgh7gVNGlFxKLCzHK0bFWBtG80bcLHVADCBT2rTsLHrqJX+GkRDmep1G7/iXpA56tnVg+pF6t6VfITfS3DiYtzdrB8dkcoQzJ+1UtzczQLjauV3VVUbOeshSkMaHYSXwtPFXEtACy9LCMu4GqwagEpJ62wa54KKGhwbixNpS5AbG/IhGu3lVCxZC3dzUvIay9LyMOq5Cq8rsiOIa4+qGsIqqrWNLaqy8qGLTatw60YiyGoU4x8q33KGy99NCTiuSmZt2fIKEvnKVqqv3XWLc+v1isQt2JDt60oLTYKr6pEbF+tr60UbHhrwSiUavesxS6UbGBqPSuUbA+vxS9HyCC2hS0siFxqovSPqEUvqs/Ab7hp3GtEbWArqojmKfKIZywhKysv0GlnKlhMz688b6fNhS7ZiKhWiGhhCi+rkLEvr3uLL6i2KZIuESjcbR/ORGp8aJhOSGhvroYKsksHiNyM36/OKuUtyy97KmRpoffzLD+oeXTwb3LwH6jXyh+q18kfqPoOlSwnjZUrbWeVL/oMVS2frTfJuGhfqXeqX66NLTMs1SxvrMRo369niXsu3646DoKN/SgrLu+p/ElXzhUuDilCjq+3P6mCbHUukkAeLf+rGvI3ic/JpuFXjTD0oopPzL/JT8oJUv+r5bWXjXUtv6/Cj7+vDS/PyEhprSjYaohpD41zKkgsXioOVAhvuS/yDKxowC+Pj4MrklfeKPRJ78o+L04tRGwZBTUWx6xEaEJq3GlEbnxqefV8aSRslGskac0wpGv3qDBtISowbwUoHFIeCdErx68wa8xssG7MTCxpsGrOCuhuEyqjLehpTbM/zKGznSp/qEEuv8ifjwsqsm2FVx21nRBfim4PsS5fjHEvRSyKam0tKImKa0+t/G6nyWBtPSy9F2BrcSzgb0ptaG9OCfEo6GvxKD/ICSkTKoEojHZwawMucmuPiX+JEmz7KG73c47jUlMuES/wbWJNAyjyK2sQgyiu8LxOgymu8ZErAEzk9fhrkaWIb4JtPvMfzCfNUS+PqaBoP6izKIhy7S9ASgELHE7jKMpryG9ob70s6G8aahBsLvGCTy/MuG3fkEJMYy9csV+JYy73z6huHgi9KBpoJ696a2huMSxhK7BuRvMsboJKmo4wL1TxCG/aawhpAEqmiFMtponkbxnI2ml7ymaJtolmi3JJ9G7UaFhsyS/iT9MpWG24bUMu8y3yafvJZSsSaQgsCymSTgsoiCxabQz1loupKVJMcyxNczho0k+NK3MuSCwKbLpsQmnybQpuZmmnL+kvgo0IKOZusykLLuZoa7SqafhumSpdV/71cCu08gRrCQnITumJzUrzjoxo2Svs8tkv84nZLExuNzcM5DkuE045KLNNOSx5Kq1zxNeWUdiKaqsaKMGo5C5saCOqIa2crfqrRY0+r5erAa9saIGtIatWraIpGqwbLtUMXUouEecue42cbXTXWEiWKlxpeSiRDGAE7hNcb9grpS1Ybq0soG5gLbpr6SmHzxuOT6r8amctbSzqb+YpzbLPqueox80PqYUpvG8sj4UsFGiDq/RhFG5CaxRr3G5qaDxqlGn3qZRsEHU8bupvZywCb65v7I2IS3wFOm9tpwJvf3I4TS+snIuSaK+rciuma2JruGqWa25t3GwCieJseyjLKnfP2g7LKcJp36k6DCRrskgVKIZt76woLmRrLs2qyseIomiVKQRN18sET9fOJ4qfq3yITiz8jL+sDE6PqCfPtiu+LEBMME1lKzaPZSnEbd5sNS/ebhJpImvoL7ptYyn4S3huF4gPyZ5vQo+vtDsMUmpq9lJtavVSahopsIzuKAlS0m+dKdJosPPSaXUoz8t1LjJuN4hJUgBojSigb1hohg2NLuUW+GmeKrCMm3ByaKYqQG1wbwRvcGy/s5EuOvDybD4sfGlebkRMKAYgbSnNIG9pL6ZrWG4Xy85p/mguaG0tJG1qabCPamjBa4ptZygeaFRr6mnMaYZviHQBK3SyLGnKafpu6Gv6aarJSjIqbMqJKmzkUyppkG2sSyhs44xySrhqbErBK35rf80GampqVi7Qb5hIx7Kkb2qMrmuODTBtSm16achsnE+GaRpq+msaaRArymnoappo6Y0/qP0pYWr9K2FoOGyQ9vBuPggmay3KJmgRCwe0GGy8TDpsiSi6jDYtCg86bK0uzm8ybc5rj6iRbZZtZmnYa3qIyGqhLcxthmoabieuym7gTcpop659LShqOyldKrFqBmqobVjzwS+GjIFpcShobKlrUWgW8b0usGzOD6lp0WkJa9FqcG/oaTAt2m/MsZMvSWu+CRhrxmmJKJhv3k5JbCYsUE70btZriy8RDFho0E5YaLpvQfK6av5pum4pbpj0CEue9sMuug84dPhv2GvfrVZvsyuWj+ZpOGpzKhZpcykWbbJuBilVL9JKOW2+KTlpuEs5bTJJBHF4ahkskmmWCCgvQm0jU1ZroW0CbIkM1GuYa3Aqpm4EbLELhyw2aoxst3GMbGqzNmtHK81zLUyzSdBpqysNS9IsjmpJ9CcqtY9PlU+rDIxTVGFvKyra800qf48/tM0t/vTWbZkopm+YadltM1MKSeKMXmzcb2Ju3G1eaXxqdijebOZr4m/VKgFrxG3Cbd+vwmw8jaBpam/FaDJjkWxoj/evimmkbjBtCo7h9sgF6fFWa1fL1HNziDktOy0ojzsrLXfnth5tSfPE0mtWP7Ola3Bvp6yLpNlu4khFb2VvF6tyDa82dPZub/5lbmvhawpsFWtCaxkraC7eat+r3moSbi4r76v9LAXz3S5siYxJ5i5nK3FvO4wWK6RvVWzUdD5v76lkaxMvwPdka+hNNHOyavW2qXMrU+RrIXAUaFEsF8yWa0MpLSgVb1EsT6zmLPxojWohK1Yr7Ev8b5RvxSxUbTMHCWkE8UxqDGux9OdV8knV9rRv+IM0a7Rt468wwnRrtGvxgTRp7W20aLRoPs40at9EHW8dbxOoM66EpJOqUA8VqujMySQkhlKEqIOUhWcjdG90bFGp00XOw3tO0aw/9DOuA/QpRTgL3y0RRPip9IX/SMPzz0lT9z8pb00D8CPxygBgzqlF/0pD858tvWh/KL8pmKYT8J8v3yjvTaSmYM3XQFPXfyx/KzPl/Wu2AxP2FDRX1r/2pauT0g/m3M99aq9IXyofTp9Ofy73443V99W3083xB+EDbMmojAjux9gUKIL0pPHCB69H5zA1L00L4r1sy0VgFqf3EMj3Rq3gvWyQyoQz70oN1YQw4KrnTuWqVMmgzOfVBK/b5X1uUK5MgSivpDUX05gDo26P9/1uSa6gz5irl9XwgFfTL0w/LgCrg2pd92Qyh0lX9NfV423X1ZNv19P4rJSpeMwb8VNqeKwkrZkgbM14qbAPe/PQq1FHz/NX9C/xtAp0gS/wdA9cyMNq1DP31sNtr/AwAmfnr/UP0m/ztiPZqlXDb/UwyWTGWMqN8b9EWKk5q+VGMKMRzViok6iRrHXz3yCVrVANXW/ShFSE3W90a0SiP+Q4qVAzNylLIv3go2kUzS2uo2x30CfjE2wrRGNpCa/La5PSfeNjag2olKFAr02tG9VX8xNufW64wPGvmarZr6CoXM6EhRNo02yTbANqa/KDb5Nr4KWDbc9Pg2gzbo9PU2zD5INq023T0YNsU24bblNom/DgqDAQffPOIXNoLfCzanfWs2v4oi/zs2u0CzQ070yLr2QxtDVzaoSrr/bkAG/zD9Zv9DDP2akwzDmtxAawrCuokcpcDSQX0siSMeylPAjUFu2qtKzCMvusI24jasuvFBftq+AGNK7iNFQU3A+0qXwyEjPEEVykJBGeZYAG9K6SMVyj9KhRz1Izh6lyzwyp0jTNwiPF0g/Dw9HPzcJyD72F8s3yzSytGCtdqa4CmC2yooFAJIFagy0lTIC4I92pUISnbqdrOCJQhg0DuCd8D3RrPazuAe6UUWFsBtQn6S7qzLMroXPWza7WNWnPqqLzMtPYBvAH0qIV1QeQZ2qna64Bp2lnat7N4a8EwFAF0ATAgy0g2CC19VduUgDXa8AC12gN5bXzEa2JgF1vPswFr5/1UAwQg5dtZydnbt1uoSQpJddrWCDYJISAfEVkA+oCb9NXa9dvwIC4IXdpUSGoAoiplMoHSgttwAV3bRLiZ25oAWdtRMULrp7DS0DoptTBc6ibISigjyE7JeUkCSGooFmGs+PmI5AHw/XlIf4ixalP5PduAckPa/dufiZygRQHfcb1RN4AgAEUAigB+IEUBfkksMbQptkl0KG0gSoniMm3I09rcALBybcjz20Epjmr7/ArrWyH1Kn1xXupkcjSye2o3KHSyl2HB69cp4PBR2oMB5yEw8dHa3LKzcbHaxzBR64yN8dugsQnbfIMNGxCwydrA4OXamgAZ2zSJ1gh92poBXzM8UZoBVSH3GdhwHqCaAbFAmgAJIB0hSwXp2xnaT9rWCc4JRCgv2mQg+khv29wCc2DnwR/bn9vijNna94F9IkJzqoAJIScAX9rcnbxwoFEp28yhdKHajLsaLbmAAKBRuAAdEBHRZ4G3zNyYjPAs8JIg+CAHgJShDKFewuAbRhgkxYABoDv2RQogU0MUWF3gScvoOjidPpIl2uwtfNKP2j/aadud2n/ar9qaAf/a79pgYB/an9tgOvINldtNfZBBPdsAOxYA/VBEOn5wROp129XapDrBcMEhQDsN20RrotviYKTriEm3+K+zvgCt2ynabdvAO17SmmEkOmIDlDtkO2Jx3VFMOjagZDtUO/7TycmfySN9i9rd2nkoFduZ2i4JnOoKgXghCiALYXpQgSEcAPw78AMYM01qDtrS6vFIC9t12ovbQ9r6gUvby9sr2pFga9rr2hvbN/UCO3UhUjqpanEACPQJDdb5Qjv40dY4xTOEc8LahWtTMVtqXupgoTtr1LMQoCfb4PCn2vUAB2qkg2fbkdonaoNwl9v4oDHaGAFX2jyzcdtR6rfaiyuXazHqQnFJ2qahD9vf2qBRT9q/2wtAeDr/21kAADrMO/uBH9oV2pL8NXTkO+0b9Dqp2zg6tInP2y/bpjtv2pQ75jup2pY7cATAOruJCx3XEOuAIAB/LQ46xnFtKLwqpWDbJFycFPFtQNIyK3HM8PggAviw4Q9wHjpIYKg7JwE3QcmQiKkUWDCBWbk+5J3hMJnIO86rQTqWEYazl2SBO1A7eKkhO3yrxSwROqvzGiO/qdg7RjvGO7g7tjuv2mY6BDujBIQ7FjvH0FY7eOoE66w6ryA12q47iTvlysk7c2ApOok7IXCN2jQ6vWC0OuLbl1oX/NY7DDpOOjTqHdsUOsw66TsjeYk6rDt12pQ7+TuWO3CwstojfYPbojtcOxXaPDtWSPQAvDupAOuBfDsWAfw70jvVO1U61lHSOrxIQjqc2vTbFTK42/U7ATJViIL1H/R5O/FrnDtEuWI6K9tOCBI7a9p+IZI6+tA1O2YAtTs1OtI63ToCOj076zMyOiFQH3QBMskojTtoyQM6+339Oy9b4/nyOouJ+9vy6oDxTSlKOkfbyjre68favtsn2+o66juUcj0ATHCDK9DxF9q0jY9gZ2odBQ8o52u6OzfaUyvR64srS4ACsoY6grLWO4/axjs/27g6h4AMKvE6gDuP2zQAkACwABoBkSDf29Y66zq4O8/bGzsoI3YA9jqEOln52zoMAW8ov9GOO0SBTjtyaFQg5ACtCMc7Ozv6QpSht3F9KOypdKEMMB46MDqwO7KAP7hz6X8A3eMIO4g6DtFew+EI64AHgOE6vbjovH47MquvjQE7gTv+VZE7wTsZGJ86Zdq/YDg7ezs2O7/aBzv0M5s6+4BHOts6OzonO9QBDIj+cdOQaTtRAQtBDAEXO4C7tdokO4U6+TuguoC6uzrUO4OwmTvFylk6L7It2lTqOTt8Kzv494CvDbk6ILukOpC7xzpQu1QN4Lt5Omw7SLqXOkC77Dql+GIqpTr928PbaduDQTw6XUnPOlU6XTvdO7i6LchgKRhyl9PAAoQpKLotO6U7rTviO6vb7Tvr20WJG9qo0Z07/Du9O/D1fTtyKSEM9TqYciM6jmptyMLay4j1KuM6pHN9cCo7Pto+660rtLNTO2o7NQQzO1Rzx2th6ydrWjoHMOxw3VA6OrHaujo3229gl2t8YXfaSdvLKg/aRAGguxahsoCisvy6RcgR5GABbdt8iM9q23FVpDtwQgC7cYARrXlSIb1QIAC2CNs7/LrtcJEoBgCCugK75DsyulchZ1sPW+daYtswu83btcqgIbIgyQDZggeBOTtgAcK7I2FOIQAgoLrbOveyQQFqyOq6qCGgupq6A9uuaoPaEojAAUjgMgXz27YycWvSKvFqK3j00aRJg0CMAVABMAE4ABqE2nFlAGa7uAAwgBEhErpFAQpJMWALgalIUrvoSEfIk/U0uwnJBWvu2qUyrmv1cDYr0zLZOy3a64APcI9wqruWiWq7Eroauo1IeQHIAFq77rvaup67OruS0vRreCD6u5U7HAAHybKAIhCJAbKAqJCbAiACUirSKuRIRrtWIjFhxrsmu6a7ErrQMma7MACWu1q7Vrp/sGEgDYhyuna6hAwKOgVqijsOu6fIAdIKuzQ7F1u0O6RrdDv4IS66d3BuuvYr07Fauh66r8BQAF676rvauxoAmbvou8woHXR6un66cdArcEG7eurBunYzhrqoIUa6YbtSKia6prpmup675rswgZa7ACDRu9a7Mbq2u+EhF/kjOrS6B9pjOltqiurba8Dw3trH2qo7kzpqOsy6zLoh6qy7Nyhsuncpl9o+6zHa3HDX23NwCzrx20s6Cdox6is7Bju8u4Y6V5A2ACc6FTrtcbagaKD3O+cwsvynO23akODPKSK6aoHBnWK63zoSuwAgjjC9uyaAuHCDu0C7t7P9u726k7onWz0AA7p9upXL8rrFasm74tpwuy66KrqqukO66bvuuiAAwXCqSZq7VA3puiu6OrpRayU7ubqI26PRQbqEKIW7IbpFu6G6oSFhuyW7ZrvqAGW7Frrlu6va1roxu1Eh47sDugqBsbt7/XG7drvxuwSyRWuVdU66l1qBajyI9Dsuuw9xj3Dwu23b2drRKWu6wXHeu5m6qCDrug+6ObuiKrm6ekh5uv66IAABunKNgboGu8G7cWs7ukUYxbtMACW74bsAIRG6ASBRula6R7orcMe6s7qy/Ke6pAL2u8fIJTObayuJbCpOu03bNivlSC66t3D4IXdwt7r3gdnbZWr3uxm6wTDQetm6ProMAr67qQEvuuUg+bvvu9u6GEifuz+xu7vFuuG6pboLgGW7v7vlu3+6NrtTuyaAfbqAeywqZ7pxusB7Itq1ux7b4zpbYRM6DbuMu3trTLpgglsxGjqzO5yyp2tDKxy6Uertu+0ETyjcuss7+jtdu1dr3bqCs/HoP7rjSKKy1HuvujR74OFt25N4IrsCAdtwdjk7cbtwILGHwGO6krq0esYznrs4aoyIRACsenR6M7oce36Ic7qJuvO7WTpXu2QNKbvKuzuBKrqQejAzjDpEAem7vVHrumu77rpCequ7sHt0atFqfrqIeoa6O7sh0Lu7OlB7u+G6q7oHu2h7h7vRuv+7nHup0KM61bv2uue7wHqOu43bibuZO0m6PHuwuim6yro3uqq6Dfjuu+q6QnpPujaJgnohIE+6JTscOoLbL7v+u1ykgbsKgOJ6IbpIexJ7n7vIe1+7KHoRumW7kbqHuhW7R7pyeh4o8npAe8UyDrvnuyB71iuges67PHuyYMq7qbv8euXTabuhAFp70HsPu6+QAmFwAdm72nsYupu6MgV5u0IR+nsfuoZ6yHuSeih7e7uluma6Mnume7J7ZhnUe36IWHqWK/J7QHqWeop6hLO9cfS7R9otKpM6BHpTO4R6YKFNujcp59stuto6M3Ccu226XLoduno6nbu32l27n2ErOlR7LRvJ0HYJJztdIvF7rggJekK78Lth0047w7uiuqO6zHr4ACx6YeSaAfF66LpJOlXaiXt/kJl6BgFZe8i68rrcepe787vOuwu6fHr8epf9Qrr3gI11cXCCe+660CFCe5p7JXs3wSJ6G7o6ey56W7oFutu74nsGe0W6Rnrfuha65roWut576HoNiTl6v9B+esLbcuvYegF7OHoge467VnsKu8p6sLpKute6rrs3u4V6yXqKyfwr9ntleyHQC4Awej162nqVa8+7L9C6e6+6enqS/fm7TTqkSNV75Eg1ex57Rnt7uj+6Jnr1erJ6NrsNelEhVboWewo6dLsBehe77Xxtes3atioFe7Z7nXtt2xQN6nqoIKV6sHqOest7Tnqieo9bOnubu6564EFue4W77nrGup574bpee2W7Ubv1e/TQ7XkZe416Y0lC2jW7xfljO7W6yjt4e/W6O2GqOhRzzLpNu0R6Yeqcs1HaJHqtuqR7UXpke+dqSzv8cBR6PLpXa19hArMtG8EhVADCIDYByBi9e10j93sPe546T3tJe23bfXwMeox7I7tMe+K7Ervt0A97ZUBYIY96bHuZe018z3q06C96P3q9sF96Pcl/e1x7r0nceu17ujO8e4u6dnpvekt697Ole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',
    'R2L_DEFAULT_LANG_ISO3': '',
    'R2L_AI_ENDPOINT': 'https://webgate.ec.testa.eu/ref2link-api/openai',
    'R2L_FINLEX_ENDPOINT': 'https://webgate.ec.testa.eu/ref2link-api/sparql',
    //'https://ldf.fi/finlex/sparql',
    'R2L_PUBLICATIONS_ENDPOINT': 'https://webgate.ec.testa.eu/ref2link-api/sparql',
    //'http://publications.europa.eu/webapi/rdf/sparql',
    'R2L_CONTENT_ENDPOINT': 'https://webgate.ec.testa.eu/ref2link-api/eurlex',
    'R2L_ALIAS_MAP': {},
    'R2L_EULANG': new Map([['GLE', 'GA'], ['HRV', 'HR'], ['HUN', 'HU'], ['ITA', 'IT'], ['LAV', 'LV'], ['LIT', 'LT'], ['CES', 'CS'], ['POL', 'PL'], ['SLK', 'SK'], ['BUL', 'BG'], ['MLT', 'MT'], ['NLD', 'NL'], ['SLV', 'SL'], ['SPA', 'ES'], ['SWE', 'SV'], ['POR', 'PT'], ['RON', 'RO'], ['DAN', 'DA'], ['DEU', 'DE'], ['ELL', 'EL'], ['ENG', 'EN'], ['EST', 'ET'], ['FIN', 'FI'], ['FRA', 'FR']])
  },
  dataInitialAttribute: 'data-ref2link-initial',
  dataContextAttribute: 'data-ref2link-context',
  parsedAttribute: 'ref2link-parsed',
  dataAttribute: 'data-ref2link',
  "class": 'a.ref2link-generated, [role-link].ref2link-generated',
  classSimple: 'a, [role-link]',
  generatedClassName: 'ref2link-generated',
  multipleGeneratedClassName: 'ref2link-multiple',
  tooltipContainerSelector: 'body',
  maxReferenceLength: 255,
  maxTitleLength: 255,
  views: true,
  viewAttributes: {},
  sort: "position.asc",
  // by default Ref2Link operates in HTML mode. For raw text mode set the `R2L.settings.htmlMode=false`
  htmlMode: true,
  patternOptimizers: PATTERN_OPTIMIZERS,
  getConstant: function getConstant(name) {
    return this.constants[name];
  },
  setConstant: function setConstant(name, value) {
    this.constants[name] = value;
  }
};

/**
 * Ref2Link tooltip template and configuration. Accessible via the API using `R2L.viewOptions`.
 * 
 * Uses moustache templates for variable injection eg. `{{ $title }}`
 */
var viewOptions = {
  useTargetGrouping: true,
  tooltipTrigger: 'mouseenter',
  tooltip: "<div role=\"tooltip\" class=\"ref2link-tooltip\" title=\"\">\n                <div class=\"clearfix\"><div class=\"table-responsive\"><table class=\"table table-condensed table-hover\"></table></div></div>\n            </div>",
  bottomSpacing: 75,
  enhancedHeading: "<thead class=\"row table-header hidden-xs\">\n                        <tr class=\"big r2l-celex\">\n                            <td colspan=\"2\">\n                                <div class=\"r2l-title\">{{ $title }}</div>\n                                <div class=\"r2l-oj\">{{ $oj }}</div>\n                                <div class=\"r2l-force\" data-status=\"{{ $forceStatus }}\"><span class=\"bullet\"></span> <span class=\"label\">{{ $forceLabel }}</span></div>\n                                <div class=\"r2l-eli\">{{ $eli }}</div>\n                            </td>\n                        </tr>\n                    </thead>",
  ruleHeading: '',
  groupRule: "<tr class=\"row active-indicator\" style=\"margin: 5px 0\" data-action=\"toggle\">\n            <td class=\"col-xs-2 r2l-toggle-icon-container\"></td>\n            <td class=\"col-xs-10\">{{ $title }}</td>\n        </tr>",
  rule: "\n        <tr class=\"row active-indicator\" style=\"margin:5px 0\" data-group=\"{{$group}}\">\n            <td class=\"col-xs-2\"></td>\n            <td class=\"col-xs-10\" data-action=\"preview\" title=\"Open link\">\n                <a href=\"{{$href}}\">{{$title}}</a>\n            </td>\n        </tr>",
  alert: '<div class="alert alert-dismissable alert-{{ $alertType }}" role="role"><button type="button" class="close" data-dismiss="alert" aria-label="Close">' + '<span aria-hidden="true">&times;</span>' + '</button>' + '{{ $msg }}' + '</div>',
  mode: 'view'
};

/** DEPRECATED SPARQL query modes */
var SPARQL_OPTIMAL_MODE = 1;
var SPARQL_FAST_MODE = 2;
var SPARQL_SLOW_MODE = 3;
var SPARQL_EXPERT_MODE = 4;

/**
 * The user can granularly configure the linked-data mode option by combining the below modes:
 *   R2L.setOptions({ linkedDataMode: ['metadata', 'check-exist', 'seq-number']});
 * By default all options are enabled
 *   R2L.setOptions({ linkedDataMode: 'all' });
 */

// only fetch linked data (metadata) information
var LD_MODE_METADATA = 'metadata';
// filter non-existing targets (CELEX/OJ)
var LD_MODE_CHECK_EXISTS = 'check-exist';
// fill placeholders for ambiguos references 
var LD_MODE_SEQ_NUMBER = 'seq-number';
// all of the above
var LD_MODE_ALL = 'all';

// fetch corrections along metadata (not enabled by default)
var LD_ADVANCED_MODE_CORRECTIONS = 'corrections';
// Re-parses Cellar titles to extract a shorter form of the legal reference. Example: 
// Title: `Directive 2013/34/EU of the European Parliament and of the Council of 26 June 2013 on the annual financial statements, consolidated financial statements and related reports of certain types of undertakings, amending Directive 2006/43/EC of the European Parliament and of the Council and repealing Council Directives 78/660/EEC and 83/349/EEC`
// Short title: `Directive 2013/34/EU`
var LD_ADVANCED_MODE_SHORT_TITLES = 'short-titles';

// advanced mode - fetches ECAS protected data from ULM's KM API 
var LD_ADVANCED_MODE_KM_HANDOC = 'km-handoc';
var LD_ADVANCED_MODE_KM_CIS = 'km-cis';

// advanced mode - load judgements for joined cases
var LD_ADVANCED_MODE_EUCASE_JOINED_JUDGEMENT = 'eucase-joined-judgement';
var TARGET_FORMAT_PDF = 'PDF';
var TARGET_FORMAT_XML = 'XML';
var TARGET_FORMAT_HTML = 'HTML';

/***/ }),

/***/ 279:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   T: () => (/* binding */ getEcasTicket)
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
/**
 * Fetch ECAS ticket for a target url
 * @param {String} targetUrl 
 * @param {String} forcedProxyTicket 
 * 
 * @return {Promise<String>} ECAS proxy ticket
 */
function getEcasTicket(targetUrl, forcedProxyTicket) {
  return new Promise(function (resolve, reject) {
    if (forcedProxyTicket) {
      resolve(forcedProxyTicket);
      return;
    }
    if ((typeof OpenIdConnect === "undefined" ? "undefined" : _typeof(OpenIdConnect)) === 'object' && typeof OpenIdConnect.getAuthorizationHeaders === 'function') {
      OpenIdConnect.getAuthorizationHeaders(targetUrl, function (res) {
        var ticket = res ? (res.Authorization || "").replace("cas_ticket ", "") : "";
        if (!ticket) {
          reject(new Error("No ticket retrieved"));
        } else {
          resolve(ticket);
        }
      }, function (err) {
        console.error(err);
        reject(err);
      });
    } else {
      reject(new Error("Failed to retrieve ECAS ticket"));
    }
  });
}

/***/ }),

/***/ 337:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  GB: () => (/* binding */ getISO2Lang),
  sC: () => (/* binding */ getTranslation)
});

// UNUSED EXPORTS: DEFAULT_LD_LANG, getISO3Lang

;// ./src/lib/translations/config/params.js
/**
 * Translations map
 * Used by the linked-data feature to build tooltip labels
 * Supports templated strings:
 *   # translation definition
 *   "my.translation.tag": { "EN": "{{ organization }} not found" }
 *
 *   # returns `EU COMM not found`
 *   getTranslation("my.translation.tag", "EN", { organization: "EU COMM"});
 */
var TRANSLATIONS = {
  "ld.not.found": {
    "EN": "No linked data found"
  },
  "ld.connection.failure": {
    "EN": "Linked data connection failure"
  },
  "eurlex.act.original": {
    "EN": "Access initial legal act",
    "BG": "Достъп до първоначалния правен акт",
    "ES": "Acceder al acto jurídico inicial",
    "CS": "Jít na původní právní akt",
    "DA": "Adgang til den oprindelige retsakt",
    "DE": "Zum ursprünglichen Rechtsakt",
    "ET": "Esialgse õigusakti juurde",
    "EL": "Πρόσβαση στην αρχική νομική πράξη",
    "FR": "Accéder à l’acte juridique initial",
    "GA": "Téigh chuig an ngníomh dlí tosaigh",
    "HR": "Pristup početnom pravnom aktu",
    "IT": "Accedi all'atto giuridico iniziale",
    "LV": "Aplūkot sākotnējo tiesību aktu",
    "LT": "Žiūrėti pradinį teisės aktą",
    "HU": "Hozzáférés az eredeti jogi aktushoz",
    "MT": "Aċċessa l-att legali inizjali",
    "NL": "Naar de oorspronkelijke rechtshandeling",
    "PL": "Dostęp do pierwotnego aktu prawnego",
    "PT": "Aceder ao ato jurídico original",
    "RO": "Actul juridic inițial",
    "SK": "Prejsť na pôvodný právny akt",
    "SL": "Dostop do prvotnega pravnega akta",
    "FI": "Siirry alkuperäiseen säädökseen",
    "SV": "Gå till ursprunglig rättsakt"
  },
  "eurlex.consolidated.text": {
    "EN": "Consolidated text",
    "BG": "Консолидиран текст",
    "ES": "Texto consolidado",
    "CS": "Konsolidovaný text",
    "DA": "Konsolideret tekst",
    "DE": "Konsolideeritud tekst",
    "ET": "Konsolideeritud tekst",
    "EL": "Ενοποιημένο κείμενο",
    "FR": "Texte consolidé",
    "GA": "Téacs comhdhlúite",
    "HR": "Pročišćeni tekst",
    "IT": "Testo consolidato",
    "LV": "Konsolidēts teksts",
    "LT": "Konsoliduotas tekstas",
    "HU": "Egységes szerkezetbe foglalt szöveg",
    "MT": "Test konsolidat",
    "NL": "Geconsolideerde tekst",
    "PL": "Tekst skonsolidowany",
    "PT": "Texto consolidado",
    "RO": "Text consolidat",
    "SK": "Konsolidované znenie",
    "SL": "Konsolidirano besedilo",
    "FI": "Konsolidoitu teksti",
    "SV": "Konsoliderad text"
  },
  "eurlex.act.changed": {
    "EN": "This act has been changed. Current consolidated version:",
    "FR": "Cet acte a été modifié. Version consolidée actuelle:",
    "DE": "Dieser Rechtsakt wurde geändert. Aktuelle konsolidierte Fassung:",
    "ES": "Este acto se ha modificado. Versión consolidada actual:",
    "BG": "Този акт е изменен. Настояща консолидирана версия:",
    "CS": "Tento akt byl změněn. Stávající konsolidované znění:",
    "DA": "Denne retsakt er ændret. Nuværende konsoliderede version:",
    "ET": "Seda akti on muudetud. Praegune konsolideeritud versioon:",
    "EL": "Η πράξη αυτή έχει τροποποιηθεί. Τρέχουσα ενοποιημένη έκδοση:",
    "GA": "thraíodh an gníomh seo. Leagan comhdhlúite reatha:",
    "HR": "Ovaj je akt izmijenjen. Trenutačni pročišćeni tekst:",
    "IT": "Questo atto è stato modificato. Versione consolidata attuale:",
    "LV": "Šis tiesību akts ticis izmainīts. Pašreizējā konsolidētā versija:",
    "LT": "Šis aktas pakeistas. Dabartinė konsoliduota redakcija:",
    "HU": "Ez a jogi aktus módosult. Jelenlegi egységes szerkezetbe foglalt változat:",
    "MT": "Danl-attinbidel. Verżjoni kkonsolidata kurrenti:",
    "NL": "Deze handeling is gewijzigd. Huidige geconsolideerde versie:",
    "PL": "Tenaktzostałzmieniony. Aktualna wersja skonsolidowana:",
    "PT": "Este ato foi alterado. Versão consolidada atual:",
    "RO": "Acest act a fost modificat. Versiunea actuală consolidată:",
    "SK": "Tentoaktbolzmenený. Aktuálne konsolidované znenie:",
    "SL": "Ta akt je bil spremenjen. Trenutna prečiščena različica:",
    "FI": "Tätä säädöstä on muutettu. Viimeisin konsolidoitu versio:",
    "SV": "Den här rättsakten har ändrats. Aktuell konsoliderad version:"
  },
  "eurlex.act.initial": {
    "EN": "Access initial legal act",
    "FR": "Accéder à l’acte juridique initial",
    "DE": "Zum ursprünglichen Rechtsakt",
    "ES": "Acceder al acto jurídico inicial",
    "BG": "Достъп до първоначалния правен акт",
    "CS": "Jít na původní právní akt",
    "DA": "Adgang til den oprindelige retsakt",
    "ET": "Esialgse õigusakti juurde",
    "EL": "Πρόσβαση στην αρχική νομική πράξη",
    "GA": "Téigh chuig an ngníomh dlí tosaigh",
    "HR": "Pristup početnom pravnom aktu",
    "IT": "Accedi all'atto giuridico iniziale",
    "LV": "Aplūkot sākotnējo tiesību aktu",
    "LT": "Pradinis teisės aktas",
    "HU": "Hozzáférés az eredeti jogi aktushoz",
    "MT": "Aċċessa l-att legali inizjali",
    "NL": "Naar de oorspronkelijke rechtshandeling",
    "PL": "Dostęp do pierwotnego aktu prawnego",
    "PT": "Aceder ao ato jurídico original",
    "RO": "Actul juridic inițial",
    "SK": "Prejsť na pôvodný právny akt",
    "SL": "Dostop do prvotnega pravnega akta",
    "FI": "Siirry alkuperäiseen säädökseen",
    "SV": "Gå till ursprunglig rättsakt"
  },
  "eurlex.act.in.force": {
    "EN": "In force",
    "FR": "En vigeur",
    "DE": "In Kraft",
    "ES": "Vigente",
    "BG": "В сила",
    "CS": "platné",
    "DA": "I kraft",
    "ET": "Kehtivad",
    "EL": "Ισχύει",
    "GA": "I bhfeidhm",
    "HR": "Na snazi",
    "IT": "In vigore",
    "LV": "Spēkā",
    "LT": "Galioja",
    "HU": "Hatályos",
    "MT": "Fis-seħħ",
    "NL": "Van kracht",
    "PL": "Obowiązujące",
    "PT": "Em vigor",
    "RO": "care este în vigoare",
    "SK": "Účinné",
    "SL": "V veljavi",
    "FI": "Voimassa",
    "SV": "Gällande"
  },
  "eurlex.act.not.in.force": {
    "EN": "Not in force",
    "FR": "Pas en vigueur",
    "DE": "Nicht in Kraft",
    "ES": "No está vigente",
    "BG": "Не е в сила",
    "CS": "Není v platné",
    "DA": "Ikke i kraft",
    "ET": "Ei kehti",
    "EL": "Δεν ισχύει",
    "GA": "Níl sé i bhfeidhm",
    "HR": "Nije na snazi",
    "IT": "Non in vigore",
    "LV": "Nav spēkā",
    "LT": "Negalioja",
    "HU": "Nincs érvényben",
    "MT": "Mhux fis-seħħ",
    "NL": "Niet van kracht",
    "PL": "Nie obowiązuje",
    "PT": "Não está em vigor",
    "RO": "Nu este în vigoare",
    "SK": "Neplatná",
    "SL": "Ni v veljavi",
    "FI": "Ei voimassa",
    "SV": "Ej i kraft"
  },
  "eurlex.act.no.longer.in.force": {
    "EN": "No longer in force",
    "FR": "Plus en vigueur",
    "DE": "Nicht mehr in Kraft",
    "ES": "Ya no está vigente",
    "BG": "Вече не е в сила",
    "CS": "Již není platné",
    "DA": "Ikke længere i kraft",
    "ET": "Kehtetud",
    "EL": "Δεν ισχύει πλέον",
    "GA": "Gan a bheith i bhfeidhm a thuilleadh",
    "HR": "Više nije na snazi",
    "IT": "Non più in vigore",
    "LV": "Vairs nav spēkā",
    "LT": "Nebegalioja",
    "HU": "Már nem hatályos",
    "MT": "M’għadux fis-seħħ",
    "NL": "Niet meer van kracht",
    "PL": "Już nie obowiązuje",
    "PT": "Já não está em vigor",
    "RO": "Nu mai este în vigoare",
    "SK": "Už nie je účinné",
    "SL": "Ne velja več",
    "FI": "Ei enää voimassa",
    "SV": "Inte längre i kraft"
  },
  "eurlex.act.validity.date.end": {
    "EN": "Date of end of validity:",
    "FR": "Date de fin de validité:",
    "DE": "Datum des Endes der Gültigkeit:",
    "ES": "Fecha de fin de validez:",
    "BG": "Дата на изтичане на валидността:",
    "CS": "Datum konce platnosti:",
    "DA": "Gyldighedsperiodens slutdato:",
    "ET": "Kehtetuks muutumise kuupäev:",
    "EL": "Ημερομηνία λήξης ισχύος:",
    "GA": "Deireadh bailíochta:",
    "HR": "Datum isteka:",
    "IT": "Data di fine della validità:",
    "LV": "Datums, līdz kuram ir spēkā:",
    "LT": "Galiojimo pabaigos data:",
    "HU": "Érvényesség vége:",
    "MT": "Data tat-tmiem tal-validitàà:",
    "NL": "Datum einde geldigheid:",
    "PL": "Data zakończenia ważności:",
    "PT": "Data do termo de validade:",
    "RO": "Data încetării:",
    "SK": "Dátum ukončenia platnosti:",
    "SL": "Datum konca veljavnosti:",
    "FI": "Voimassaolon päättymispäivämäärä:",
    "SV": "Sista giltighetsdag:"
  },
  "eurlex.act.repealed.by": {
    "EN": "Repealed and replaced by",
    "FR": "abrogé et remplacé par",
    "DE": "Aufgehoben und ersetzt durch",
    "ES": "derogado y sustituido por",
    "BG": "отменен и заместен от",
    "CS": "Zrušeno a nahrazeno",
    "DA": "ophævet og erstattet af",
    "ET": "kehtetuks tunnistatud ja asendatud",
    "EL": "καταργήθηκε και αντικαταστάθηκε από",
    "GA": "Arna aisghairm agus arna ionadú ag",
    "HR": "Stavljeno izvan snage i zamijenjeno",
    "IT": "abrogato e sostituito da",
    "LV": "Atcelts un aizstāts ar",
    "LT": "pakeitė ir anuliavo",
    "HU": "hatályon kívül helyzete és felváltotta",
    "MT": "Revokat u sostitwit bi",
    "NL": "afgeschaft en vervangen door",
    "PL": "Uchylony i zastąpiony przez",
    "PT": "revogado e substituído por",
    "RO": "abrogat şi înlocuit prin",
    "SK": "Zrušil a nahradil",
    "SL": "se razveljavijo in nadomestijo z",
    "FI": "Kumoava ja korvaava",
    "SV": "upphävd och ersatt av"
  },
  "eurlex.act.access.current.version": {
    "EN": "Access current version",
    "FR": "Accéder à la version actuelle",
    "DE": "Zur geltenden Fassung",
    "ES": "Acceder a la versión actual",
    "BG": "Достъп до настоящата версия",
    "CS": "Jít na aktuální verzi",
    "DA": "Adgang til nuværende version",
    "ET": "Praeguse versiooni juurde",
    "EL": "Πρόσβαση στην τρέχουσα έκδοση",
    "HR": "Pristup verziji koja je trenutačno na snazi",
    "IT": "Accedi alla versione attuale",
    "LV": "Aplūkot spēkā esošo versiju",
    "LT": "Dabartinė redakcija",
    "HU": "Hozzáférés a jelenlegi változathoz",
    "MT": "Aċċessa l-verżjoni kurrenti",
    "NL": "Huidige versie",
    "PL": "Dostęp do aktualnej wersji",
    "PT": "Aceder à versão atual",
    "RO": "Versiunea actuală",
    "SK": "Prejsť k aktuálnej verzii",
    "SL": "Dostop do trenutne različice",
    "FI": "Siirry nykyiseen versioon",
    "SV": "Gå till aktuell version"
  },
  "eurlex.act.notification.pending": {
    "EN": "Date of entry into force unknown (pending notification) or not yet in force. Date of effect: ",
    "FR": "Date d’entrée en vigueur inconnue (en attente de notification) ou pas encore en vigueur. Date de prise d'effet: ",
    "DE": "Datum des Inkrafttretens unbekannt (wg. ausstehender Mitteilung) oder Rechtsakt noch nicht in Kraft. Datum des Wirksamwerdens: ",
    "ES": "Fecha de entrada en vigor desconocida (pendiente de notificación) o aún no está en vigor. Fecha de efecto: ",
    "BG": "Датата на влизане в сила не е известна (предстоящо уведомление) или документът все още не е в сила., Дата на влизане в сила: ",
    "CS": "Datum vstupu dokumentu v platnost není známo (až do jeho oznámení), nebo dokument dosud nevstoupil v platnost., Datum nabytí účinku: ",
    "DA": "Dato for ikrafttrædelse kendes ikke (afventer meddelelse), eller retsakten er endnu ikke trådt i kraft., Ikrafttrædelsesdato: ",
    "ET": "Jõustumiskuupäev teadmata (teate ootel) või veel ei kehti., Jõustumise kuupäev: ",
    "EL": "Η ημερομηνία έναρξης ισχύος δεν είναι γνωστή (εν αναμονή της κοινοποίησης) ή δεν έχει ακόμη τεθεί σε ισχύ., Ημερομηνία θέσης σε ισχύ: ",
    "GA": "Níl an dáta teacht i bhfeidhm ar eolas (táthar ag fanacht lena fhógairt), sin nó níl sé i bhfeidhm fós., Teacht i bhfeidhm: ",
    "HR": "Datum stupanja na snagu nije poznat (u iščekivanju obavijesti) ili akt nije još stupio na snagu., Datum stupanja na snagu: ",
    "IT": "Data di entrata in vigore sconosciuta (in attesa di notifica) o non ancora in vigore., Data di entrata in vigore: ",
    "LV": "Stāšanās spēkā datums nav zināms (gaidāms paziņojums) vai vēl nav spēkā. Spēkā stāšanās datums: ",
    "LT": "Įsigaliojimo data nežinoma (dar negautas pranešimas) arba dar neįsigaliojo., Įsigaliojimo data: ",
    "HU": "Még nem lehet tudni, mikor lép hatályba (értesítés folyamatban), vagy még nem lépett hatályba., Hatálybalépés időpontja: ",
    "MT": "Data tad-dħul fis-seħħ mhux magħrufa (notifika pendenti) jew għada mhux fis-seħħ., Data tal-effett: ",
    "NL": "Nog niet in werking of datum inwerkingtreding onbekend (in afwachting van kennisgeving)., Datum inwerkingtreding: ",
    "PL": "Data wejścia w życie nieznana (jeszcze niezgłoszona) lub jeszcze nie obowiązuje., Data wejściawżycie: ",
    "PT": "Data de entrada em vigor desconhecida (na pendência de notificação) ou ainda não em vigor., Data de efeito: ",
    "RO": "Nu se cunoaște data intrării în vigoare (în așteptarea notificării) sau nu a intrat încă în vigoare., Dataintrăriiînvigoare: ",
    "SK": "Dátum nadobudnutia platnosti dokumentu nie je známy (až do jeho oznámenia) alebo dokument ešte nenadobudol účinnosť., Dátum nadobudnutia účinnosti: ",
    "SL": "Datum začetka veljavnosti ni znan (do uradnega obvestila) oziroma še ne velja., Datum začetka učinkovanja: ",
    "FI": "Voimaantulopäivä tuntematon (ilmoitusmenettely kesken) tai ei vielä voimassa., Voimaantulopäivämäärä: ",
    "SV": "Dag för ikraftträdande okänd (i avvaktan på delgivning) eller rättsakten har ännu inte trätt i kraft., Dag för ikraftträdande: "
  },
  'official.journal.label': {
    "EN": "OJ {{ ojPart }} {{ ojNumber }}, {{ ojPublicationDate }}, p. {{ ojPageFirst }}",
    "FR": "JO {{ ojPart }} {{ ojNumber }} du {{ ojPublicationDate }}, p. {{ ojPageFirst }}",
    "DE": "ABl. {{ ojPart }} {{ ojNumber }} vom {{ ojPublicationDate }}, S. {{ ojPageFirst }}",
    "ES": "DO {{ ojPart }} {{ ojNumber }} de {{ ojPublicationDate }}, p. {{ ojPageFirst }}",
    "BG": "OB {{ ojPart }} {{ ojNumber }}, {{ ojPublicationDate }}г., стр. {{ ojPageFirst }}",
    "CS": "Úř. věst. {{ ojPart }} {{ ojNumber }}, {{ ojPublicationDate }}, s. {{ ojPageFirst }}",
    "DA": "EUT {{ ojPart }} {{ ojNumber }} af {{ ojPublicationDate }}, s. {{ ojPageFirst }}",
    "ET": "ELT {{ ojPart }} {{ ojNumber }}, {{ ojPublicationDate }}, lk {{ ojPageFirst }}",
    "EL": "ΕΕ {{ ojPart }} {{ ojNumber }} της {{ ojPublicationDate }}, σ. {{ ojPageFirst }}",
    "GA": "IO {{ ojPart }} {{ ojNumber }}, {{ ojPublicationDate }}, lgh. {{ ojPageFirst }}",
    "HR": "SL {{ ojPart }} {{ ojNumber }}, {{ ojPublicationDate }}., str. {{ ojPageFirst }}",
    "IT": "GU {{ ojPart }} {{ ojNumber }} del {{ ojPublicationDate }}, pagg. {{ ojPageFirst }}",
    "LV": "OV {{ ojPart }} {{ ojNumber }}, {{ ojPublicationDate }}., {{ ojPageFirst }}. lpp.",
    "LT": "OL {{ ojPart }} {{ ojNumber }}, {{ ojPublicationDateYear }} {{ ojPublicationDateMonth }} {{ ojPublicationDateDay }}, p. {{ ojPageFirst }}",
    "HU": "HL {{ ojPart }} {{ ojNumber }}, {{ ojPublicationDateYear }}.{{ ojPublicationDateMonth }}.{{ ojPublicationDateDay }}., {{ ojPageFirst }} o.",
    "MT": "ĠU {{ ojPart }} {{ ojNumber }}, {{ ojPublicationDate }}, p. {{ ojPageFirst }}",
    "NL": "PB {{ ojPart }} {{ ojNumber }} van {{ ojPublicationDate }}, blz. {{ ojPageFirst }}",
    "PL": "Dz.U. {{ ojPart }} {{ ojNumber }} z {{ ojPublicationDate }}, str. {{ ojPageFirst }}",
    "PT": "JO {{ ojPart }} {{ ojNumber }} de {{ ojPublicationDate }}, p. {{ ojPageFirst }}",
    "RO": "JO {{ ojPart }} {{ ojNumber }}, {{ ojPublicationDate }}, p. {{ ojPageFirst }}",
    "SK": "Ú. v. EÚ {{ ojPart }} {{ ojNumber }}, {{ ojPublicationDate }}, s. {{ ojPageFirst }}",
    "SL": "UL {{ ojPart }} {{ ojNumber }}, {{ ojPublicationDate }}, str. {{ ojPageFirst }}",
    "FI": "EUVL {{ ojPart }} {{ ojNumber }}, {{ ojPublicationDate }}, s. {{ ojPageFirst }}",
    "SV": "EUT {{ ojPart }} {{ ojNumber }}, {{ ojPublicationDate }}, s. {{ ojPageFirst }}"
  },
  'official.journal.label.nopage': {
    "EN": "OJ {{ ojPart }} {{ ojNumber }}, {{ ojPublicationDate }}",
    "FR": "JO {{ ojPart }} {{ ojNumber }} du {{ ojPublicationDate }}",
    "DE": "ABl. {{ ojPart }} {{ ojNumber }} vom {{ ojPublicationDate }}",
    "ES": "DO {{ ojPart }} {{ ojNumber }} de {{ ojPublicationDate }}",
    "BG": "OB {{ ojPart }} {{ ojNumber }}, {{ ojPublicationDate }}г.",
    "CS": "Úř. věst. {{ ojPart }} {{ ojNumber }}, {{ ojPublicationDate }}",
    "DA": "EUT {{ ojPart }} {{ ojNumber }} af {{ ojPublicationDate }}",
    "ET": "ELT {{ ojPart }} {{ ojNumber }}, {{ ojPublicationDate }}",
    "EL": "ΕΕ {{ ojPart }} {{ ojNumber }} της {{ ojPublicationDate }}",
    "GA": "IO {{ ojPart }} {{ ojNumber }}, {{ ojPublicationDate }}",
    "HR": "SL {{ ojPart }} {{ ojNumber }}, {{ ojPublicationDate }}",
    "IT": "GU {{ ojPart }} {{ ojNumber }} del {{ ojPublicationDate }}",
    "LV": "OV {{ ojPart }} {{ ojNumber }}, {{ ojPublicationDate }}.",
    "LT": "OL {{ ojPart }} {{ ojNumber }}, {{ ojPublicationDateYear }} {{ ojPublicationDateMonth }} {{ ojPublicationDateDay }}",
    "HU": "HL {{ ojPart }} {{ ojNumber }}, {{ ojPublicationDateYear }}.{{ ojPublicationDateMonth }}.{{ ojPublicationDateDay }}.",
    "MT": "ĠU {{ ojPart }} {{ ojNumber }}, {{ ojPublicationDate }}",
    "NL": "PB {{ ojPart }} {{ ojNumber }} van {{ ojPublicationDate }}",
    "PL": "Dz.U. {{ ojPart }} {{ ojNumber }} z {{ ojPublicationDate }}",
    "PT": "JO {{ ojPart }} {{ ojNumber }} de {{ ojPublicationDate }}",
    "RO": "JO {{ ojPart }} {{ ojNumber }}, {{ ojPublicationDate }}",
    "SK": "Ú. v. EÚ {{ ojPart }} {{ ojNumber }}, {{ ojPublicationDate }}",
    "SL": "UL {{ ojPart }} {{ ojNumber }}, {{ ojPublicationDate }}",
    "FI": "EUVL {{ ojPart }} {{ ojNumber }}, {{ ojPublicationDate }}",
    "SV": "EUT {{ ojPart }} {{ ojNumber }}, {{ ojPublicationDate }}"
  },
  'official.journal.label.new': {
    "EN": "OJ {{ ojPart }}, {{ ojPartPrefix }}{{ ojYear }}/{{ ojNumber }}, {{ ojPublicationDate }}",
    "FR": "JO {{ ojPart }}, {{ ojPartPrefix }}{{ ojYear }}/{{ ojNumber }}, {{ ojPublicationDate }}",
    "DE": "ABl. {{ ojPart }}, {{ ojPartPrefix }}{{ ojYear }}/{{ ojNumber }}, {{ ojPublicationDate }}",
    "ES": "DO {{ ojPart }}, {{ ojPartPrefix }}{{ ojYear }}/{{ ojNumber }}, {{ ojPublicationDate }}",
    "BG": "OB {{ ojPart }}, {{ ojPartPrefix }}{{ ojYear }}/{{ ojNumber }}, {{ ojPublicationDate }}",
    "CS": "Úř. věst. {{ ojPart }}, {{ ojPartPrefix }}{{ ojYear }}/{{ ojNumber }}, {{ ojPublicationDate }}",
    "DA": "EUT {{ ojPart }}, {{ ojPartPrefix }}{{ ojYear }}/{{ ojNumber }}, {{ ojPublicationDate }}",
    "ET": "ELT {{ ojPart }}, {{ ojPartPrefix }}{{ ojYear }}/{{ ojNumber }}, {{ ojPublicationDate }}",
    "EL": "ΕΕ {{ ojPart }}, {{ ojPartPrefix }}{{ ojYear }}/{{ ojNumber }}, {{ ojPublicationDate }}",
    "GA": "IO {{ ojPart }}, {{ ojPartPrefix }}{{ ojYear }}/{{ ojNumber }}, {{ ojPublicationDate }}",
    "HR": "SL {{ ojPart }}, {{ ojPartPrefix }}{{ ojYear }}/{{ ojNumber }}, {{ ojPublicationDate }}",
    "IT": "GU {{ ojPart }}, {{ ojPartPrefix }}{{ ojYear }}/{{ ojNumber }}, {{ ojPublicationDate }}",
    "LV": "OV {{ ojPart }}, {{ ojPartPrefix }}{{ ojYear }}/{{ ojNumber }}, {{ ojPublicationDate }}",
    "LT": "OL {{ ojPart }}, {{ ojPartPrefix }}{{ ojYear }}/{{ ojNumber }}, {{ ojPublicationDate }}",
    "HU": "HL {{ ojPart }}, {{ ojPartPrefix }}{{ ojYear }}/{{ ojNumber }}, {{ ojPublicationDate }}",
    "MT": "ĠU {{ ojPart }}, {{ ojPartPrefix }}{{ ojYear }}/{{ ojNumber }}, {{ ojPublicationDate }}",
    "NL": "PB {{ ojPart }}, {{ ojPartPrefix }}{{ ojYear }}/{{ ojNumber }}, {{ ojPublicationDate }}",
    "PL": "Dz.U. {{ ojPart }}, {{ ojPartPrefix }}{{ ojYear }}/{{ ojNumber }}, {{ ojPublicationDate }}",
    "PT": "JO {{ ojPart }}, {{ ojPartPrefix }}{{ ojYear }}/{{ ojNumber }}, {{ ojPublicationDate }}",
    "RO": "JO {{ ojPart }}, {{ ojPartPrefix }}{{ ojYear }}/{{ ojNumber }}, {{ ojPublicationDate }}",
    "SK": "Ú. v. EÚ {{ ojPart }}, {{ ojPartPrefix }}{{ ojYear }}/{{ ojNumber }}, {{ ojPublicationDate }}",
    "SL": "UL {{ ojPart }}, {{ ojPartPrefix }}{{ ojYear }}/{{ ojNumber }}, {{ ojPublicationDate }}",
    "FI": "EUVL {{ ojPart }}, {{ ojPartPrefix }}{{ ojYear }}/{{ ojNumber }}, {{ ojPublicationDate }}",
    "SV": "EUT {{ ojPart }}, {{ ojPartPrefix }}{{ ojYear }}/{{ ojNumber }}, {{ ojPublicationDate }}"
  }
};
var params_LANGUAGE_MAP = new Map([
// tslint:disable-next-line:max-line-length
['BG', {
  iso3: 'BUL',
  officialName: 'български (BG)'
}], ['ES', {
  iso3: 'SPA',
  officialName: 'Español (ES)'
}], ['CS', {
  iso3: 'CES',
  officialName: 'Čeština (CS)'
}], ['DA', {
  iso3: 'DAN',
  officialName: 'Dansk (DA)'
}], ['DE', {
  iso3: 'DEU',
  officialName: 'Deutsch (DE)'
}], ['ET', {
  iso3: 'EST',
  officialName: 'Eesti (ET)'
}], ['EL', {
  iso3: 'ELL',
  officialName: 'ελληνικά (EL)'
}], ['EN', {
  iso3: 'ENG',
  officialName: 'English (EN)'
}], ['FR', {
  iso3: 'FRA',
  officialName: 'Français (FR)'
}], ['GA', {
  iso3: 'GLE',
  officialName: 'Gaeilge (GA)'
}], ['HR', {
  iso3: 'HRV',
  officialName: 'Hrvatski (HR)'
}], ['IT', {
  iso3: 'ITA',
  officialName: 'Italiano (IT)'
}], ['LV', {
  iso3: 'LAV',
  officialName: 'Latviešu (LV)'
}], ['LT', {
  iso3: 'LIT',
  officialName: 'Lietuvių (LT)'
}], ['HU', {
  iso3: 'HUN',
  officialName: 'Magyar (HU)'
}], ['MT', {
  iso3: 'MLT',
  officialName: 'Malti (MT)'
}], ['NL', {
  iso3: 'NLD',
  officialName: 'Nederlands (NL)'
}], ['PL', {
  iso3: 'POL',
  officialName: 'Polski (PL)'
}], ['PT', {
  iso3: 'POR',
  officialName: 'Português (PT)'
}], ['RO', {
  iso3: 'RON',
  officialName: 'Română (RO)'
}], ['SK', {
  iso3: 'SLK',
  officialName: 'Slovenčina (SK)'
}], ['SL', {
  iso3: 'SLV',
  officialName: 'Slovenščina (SL)'
}], ['FI', {
  iso3: 'FIN',
  officialName: 'Suomi (FI)'
}], ['SV', {
  iso3: 'SWE',
  officialName: 'Svenska (SV)'
}]]);
;// ./src/lib/translations/index.js

var DEFAULT_LD_LANG = "EN";

/**
 * Resolves a translation tag in the language of choice. Supports templating eg. "Repealed by {{ date }} immediately"
 * 
 * Usage: 
 *   getTranslation("eurlex.act.no.longer.in.force", "FR")
 * 
 * @param {String} name 
 * @param {String} language ISO2 language
 * @param {Object} params { key: value } pairs to inject into the templated strings
 * 
 * @returns {String}
 */
var getTranslation = function getTranslation(name, language, params) {
  if (!TRANSLATIONS[name]) {
    return null;
  }
  language = String(language).toUpperCase();
  var str = TRANSLATIONS[name][language] || TRANSLATIONS[name][DEFAULT_LD_LANG];
  if (!str) {
    return null;
  }
  params = params || {};
  Object.keys(params).forEach(function (key) {
    try {
      str = str.replace(new RegExp("{{\\s?" + key + "\\s?}}", 'gi'), params[key]);
    } catch (e) {
      console.error(e);
    }
  });
  return str;
};

/**
 * Language conversion utility function ISO2 -> ISO3
 * @param {String} iso3 
 * @returns {String}
 */
function getISO2Lang(iso3) {
  var iso2 = null;
  params_LANGUAGE_MAP.forEach(function (value, key) {
    if (value.iso3 === iso3) {
      iso2 = key;
    }
  });
  return iso2;
}

/**
 * Language conversion utility function ISO3 -> ISO2
 * @param {String} iso2 
 * @returns {String}
 */
function getISO3Lang(iso2) {
  var data = LANGUAGE_MAP.get(iso2);
  return data ? data.iso3 : null;
}

/***/ }),

/***/ 358:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CZ: () => (/* binding */ replaceStr),
/* harmony export */   Ev: () => (/* binding */ LD_CONSIL_CONDITION),
/* harmony export */   HC: () => (/* binding */ replace),
/* harmony export */   KA: () => (/* binding */ LD_ACTIVE),
/* harmony export */   Kq: () => (/* binding */ LD_CELLAR_UN_REG),
/* harmony export */   NA: () => (/* binding */ LD_CELEX_CONDITION),
/* harmony export */   Nh: () => (/* binding */ LD_CELLAR_SUBNUMBER_CELEX),
/* harmony export */   Ur: () => (/* binding */ clearPlaceholders),
/* harmony export */   Wx: () => (/* binding */ LD_CELLAR_EUCASE_SUBNUMBER_CELEX),
/* harmony export */   aj: () => (/* binding */ sanitize),
/* harmony export */   b0: () => (/* binding */ LD_CELLAR_UN_REG_ELI),
/* harmony export */   dq: () => (/* binding */ LD_OJ_CONDITION),
/* harmony export */   i0: () => (/* binding */ LD_CELLAR_EUCASE_JOINED_JUDGEMENT),
/* harmony export */   iN: () => (/* binding */ LD_CELLAR_EP_ACT_CELEX),
/* harmony export */   iO: () => (/* binding */ LD_CELLAR_DEC_NUMBER_CELEX),
/* harmony export */   jw: () => (/* binding */ LD_CELLAR_ACT_URL_ELI),
/* harmony export */   oO: () => (/* binding */ LD_CELLAR_UN_REG_CELEX),
/* harmony export */   u2: () => (/* binding */ LD_ELI_BASE_URL),
/* harmony export */   ud: () => (/* binding */ LD_CELLAR_ECB_CELEX),
/* harmony export */   vv: () => (/* binding */ LD_CELLAR_OJ_CELEX),
/* harmony export */   wP: () => (/* binding */ hasItem)
/* harmony export */ });
/* unused harmony exports LD_CELLAR_ACT_NUMBER_CELEX, LD_CELLAR_DEC_NUMBER_ELI, LD_CELLAR_OJ_TYPE_ELI, LD_CELLAR_ECB_ELI, LD_CELLAR_CONSOLIDATION_CELEX, LD_CELLAR_CONSOLIDATION_ELI, LD_CELLAR_EP_ACT, LD_CELEX_IF_NONE_CONDITION */
// legacy act rule 
var LD_CELLAR_ACT_NUMBER_CELEX = "LD:CELLAR:ACT:NUMBER:CELEX";
var LD_CELLAR_ACT_URL_ELI = "LD:CELLAR:ACT:URL:ELI";
var LD_CELLAR_DEC_NUMBER_CELEX = "LD:CELLAR:DEC:NUMBER:CELEX";
var LD_CELLAR_DEC_NUMBER_ELI = "LD:CELLAR:DEC:NUMBER:ELI";

// OJ ELI target
var LD_CELLAR_OJ_CELEX = "LD:CELLAR:OJ:CELEX";
var LD_CELLAR_OJ_TYPE_ELI = "LD:CELLAR:OJ:TYPE:ELI";

// ECB ELI target
var LD_CELLAR_ECB_CELEX = "LD:CELLAR:ECB:CELEX";
var LD_CELLAR_ECB_ELI = "LD:CELLAR:ECB:ELI";

// EUCASE Order subnumber
var LD_CELLAR_EUCASE_SUBNUMBER_CELEX = "LD:CELLAR:EUCASE:SUBNUMBER:CELEX";

// generic marking used for act rule, celex rule
var LD_CELLAR_SUBNUMBER_CELEX = "LD:CELLAR:SUBNUMBER:CELEX";

// marking used in subdivision rule
var LD_ELI_BASE_URL = "LD:ELI:BASE:URL";
var LD_CELLAR_EUCASE_JOINED_JUDGEMENT = "LD:CELLAR:EUCASE:JOINED:JUDGEMENT";

// staff regs rule
var LD_CELLAR_CONSOLIDATION_CELEX = "LD:CELLAR:CONSOLIDATION:CELEX";
var LD_CELLAR_CONSOLIDATION_ELI = "LD:CELLAR:CONSOLIDATION:ELI";
var LD_CELLAR_UN_REG = "LD:CELLAR:UN:REG";
var LD_CELLAR_UN_REG_CELEX = "LD:CELLAR:UN:REG:CELEX";
var LD_CELLAR_UN_REG_ELI = "LD:CELLAR:UN:REG:ELI";

// EP acts
var LD_CELLAR_EP_ACT = "LD:CELLAR:EP:ACT";
var LD_CELLAR_EP_ACT_CELEX = "LD:CELLAR:EP:ACT:CELEX";

// filter markings
var LD_ACTIVE = "ld-active";
var LD_CELEX_CONDITION = "cellar-exists-celex";
var LD_CELEX_IF_NONE_CONDITION = "cellar-if-none-celex";
var LD_OJ_CONDITION = "cellar-exists-oj";
var LD_CONSIL_CONDITION = "cellar-exists-consil";

/**
 * Clears placeholders
 * @param {Object} matches 
 * @param {String|null} type (LD:CELLAR:COR:NUMBER:CELEX, LD:CELLAR:SUBNUMBER:CELEX)
 * @param {String} replacement
 * 
 * @returns {Object} matches 
 */
function clearPlaceholders(matches, type, replacement) {
  replacement = replacement || "";

  // go through matches and fill LD placeholders
  Object.keys(matches).forEach(function (key) {
    if (matches[key].offsets) {
      matches[key].offsets.forEach(function (offset) {
        var rule = offset.rule;
        if (rule.ld && rule.ld.length > 0) {
          if (!type || rule.ld.indexOf(type) !== -1) {
            rule.ld.forEach(function (placeholder) {
              offset = replace(offset, placeholder, replacement);
            });
          }
        }
      });
    }
  });
  return matches;
}

/**
 * Replace linked-data placeholders in the match object
 * @param {Object} match 
 * @param {String} placeholder LD:CELLAR:NUMBER:CELEX|LD:CELLAR:SUBNUMBER:ELI
 * @param {String} replacement (defaults to '')
 * @returns {Object} match
 */
var replace = function replace(match, placeholder, replacement) {
  Object.keys(match.views).forEach(function (key) {
    match.views[key] = replaceStr(String(match.views[key]), placeholder, replacement);
  });
  match.alternatives.forEach(function (alternative) {
    alternative.view = replaceStr(alternative.view, placeholder, replacement);
  });
  return match;
};

/**
 * Replace placeholder in string
 * @param {String} str 
 * @param {String} placeholder 
 * @param {String} replacement
 * 
 * @returns {String}  
 */
var replaceStr = function replaceStr(str, placeholder, replacement) {
  replacement = replacement || '';
  // if the placeholder provides a default and we have no replacement then use it
  // eg. {{ LD:CELLAR:CONSOLIDATION:CELEX|2020-01-01 }} 
  var regex = new RegExp('{{\\s?' + placeholder + '(?:\\|([^\\s}]*))?\\s?}}', 'gi');
  return String(str).replace(regex, function (match, capture) {
    return capture && !replacement ? capture : replacement;
  });
};

/**
 * Smooth over spaces and odd chars
 * @param {String} str
 * @returns {String} 
 */
var sanitize = function sanitize(str) {
  str = str.replace(/[\u202F\u00A0]/g, " ");
  return str;
};
var hasItem = function hasItem(str, item) {
  if (!str) {
    return false;
  }
  var items = String(str).split(" ").filter(function (l) {
    return !!l;
  }).map(function (l) {
    return l.trim();
  });
  return items.indexOf(item) !== -1;
};

/***/ }),

/***/ 500:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   L: () => (/* binding */ sharedCtx)
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
/**
 * Used to store Web worker regular expression matching results.
 * Stores a `cursor` index to allow iterating results
 */
var SharedCtx = /*#__PURE__*/_createClass(function SharedCtx() {
  _classCallCheck(this, SharedCtx);
  var data = {};
  this.getData = function (text) {
    var items = Object.values(data).filter(function (v) {
      return v && v.text === text && v.cursor !== undefined;
    });
    return items[0];
  };
  this.setMatches = function (uuid, text, matches) {
    if (!data[uuid]) {
      data[uuid] = {};
    }
    data[uuid].cursor = 0;
    data[uuid].uuid = uuid;
    data[uuid].text = text;
    data[uuid].matches = matches;
  };
  this.setCallback = function (uuid, text, fn) {
    if (!data[uuid]) {
      data[uuid] = {
        text: text,
        fns: []
      };
    }
    data[uuid].fns.push(fn);
  };
  this.callback = function (uuid, text) {
    if (data[uuid] && data[uuid].fns) {
      data[uuid].fns.forEach(function (callable) {
        callable.call();
      });
    }
  };
  this.reset = function (uuid) {
    data[uuid] = null;
  };
  this.clear = function () {
    data = {};
  };
});
var sharedCtx = new SharedCtx();


/***/ }),

/***/ 560:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   m: () => (/* binding */ converters)
/* harmony export */ });
/**
 * Converter pipes to be used in rules.
 * Usage: 
 * {{ $3|replace:'str1':'str2' }}  // will call R2L.converters.replace(backref3, 'str1', 'str2')
 */
var converters = {
  // Outputs the target language ISO3 eg: `/eng`. Defaults to empty string if target lang is configured by the user.
  lang: function lang() {
    if (R2L.options && R2L.options.language && typeof R2L.options.language === "string") {
      return '/' + R2L.options.language;
    } else {
      return '';
    }
  },
  targetFormat: function targetFormat() {
    return R2L.getTargetFormat() || '';
  },
  wrap: function wrap(str, startStr, endStr) {
    if (!str) {
      return '';
    }
    return startStr + String(str) + endStr;
  },
  multiLangIso2OrLangIso2: function multiLangIso2OrLangIso2(str) {
    return R2L.converters.multiLangIso2() || R2L.converters.langIso2() || 'EN';
  },
  // Outputs the target language ISO2 eg: `FR`.
  langIso2: function langIso2(str, defaultLang) {
    var lang = R2L.getLanguage();
    if (typeof lang === "string") {
      if (R2L.getConstant("R2L_EULANG").has(lang.toUpperCase())) {
        return R2L.getConstant("R2L_EULANG").get(lang.toUpperCase());
      }
      return defaultLang || 'EN';
    } else {
      return defaultLang || 'EN';
    }
  },
  // Outputs the language ISO2 eg: `FR`.
  multiLangIso2: function multiLangIso2(str) {
    var lang = R2L.getMultiLanguage();
    if (typeof lang === "string") {
      var parts = lang.split("-");
      parts = parts.map(function (part) {
        if (R2L.getConstant("R2L_EULANG").has(part.toUpperCase())) {
          return R2L.getConstant("R2L_EULANG").get(part.toUpperCase());
        }
        return null;
      });
      parts = parts.filter(function (part) {
        return !!part;
      });
      if (parts.length === 0) {
        return '';
      } else {
        return parts.join("-");
      }
    } else {
      return '';
    }
  },
  // returns `/` prefixed language ISO2 eg: /DE
  langIsoA2: function langIsoA2() {
    var lang = R2L.getLanguage();
    if (typeof lang === "string") {
      if (R2L.getConstant("R2L_EULANG").has(lang.toUpperCase())) {
        return '/' + R2L.getConstant("R2L_EULANG").get(lang.toUpperCase());
      }
      return '';
    } else {
      return '';
    }
  },
  // returns raw language ISO3
  langIso3: function langIso3(str, defaultLang) {
    var lang = R2L.getLanguage();
    if (typeof lang === "string") {
      if (R2L.getConstant("R2L_EULANG").has(lang.toUpperCase())) {
        return lang;
      }
      return defaultLang || 'ENG';
    } else {
      return defaultLang || 'ENG';
    }
  },
  // returns language ISO3 prefixed by `/` eg: /FRA 
  langIsoA3: function langIsoA3() {
    var lang = R2L.getLanguage();
    if (typeof lang === "string") {
      if (R2L.getConstant("R2L_EULANG").has(lang.toUpperCase())) {
        return '/' + lang;
      }
      return '';
    } else {
      return '';
    }
  },
  // returns language ISO3 and format prefixed by `/` eg: `/fra/pdf` . Will default to 'eng' if format is present. 
  langIsoA3WithFormat: function langIsoA3WithFormat() {
    var segment = '';
    var targetFormat = R2L.getTargetFormat();
    var lang = R2L.getLanguage();
    if (typeof lang === "string" && lang) {
      if (R2L.getConstant("R2L_EULANG").has(lang.toUpperCase())) {
        segment = '/' + lang;
        if (targetFormat) {
          segment += '/' + targetFormat.toLowerCase();
        }
      }
    } else {
      // fallback to source lang
      var srcLang = R2L.getConstant("R2L_DEFAULT_LANG_ISO3");
      if (targetFormat && srcLang && R2L.getConstant("R2L_EULANG").has(srcLang.toUpperCase())) {
        segment = '/' + srcLang.toLowerCase() + '/' + targetFormat.toLowerCase();
      } else if (targetFormat) {
        // default to ENG
        segment = '/eng/' + targetFormat.toLowerCase();
      }
    }
    return segment;
  },
  trimEli: function trimEli(url) {
    url = String(url);
    url = url.replace(/^https/gi, 'http');
    url = url.replace(/eur\-lex/gi, 'data');
    url = url.replace(/\/art\_[^\/]+/gi, '');
    url = url.replace(/\/anx\_[^\/]+/gi, '');
    url = url.replace(/\/rec\_[^\/]+/gi, '');
    url = url.replace(/\/rct\_[^\/]+/gi, '');
    url = url.replace(/\/par\_[^\/]+/gi, '');
    url = url.replace(/\/pnt\_[^\/]+/gi, '');
    url = url.replace(/\/[a-z]{3,4}$/gi, ''); // ending segment (can be language or format)
    url = url.replace(/\/[a-z]{3}$/gi, ''); // ending segment (can be language or format)
    return url;
  },
  trimEliTreaty: function trimEliTreaty(url) {
    url = String(url);
    url = url.replace(/^https/gi, 'http');
    url = url.replace(/eur\-lex/gi, 'data');
    url = url.replace(/\/anx\_[^\/]+/gi, '');
    url = url.replace(/\/rec\_[^\/]+/gi, '');
    url = url.replace(/\/rct\_[^\/]+/gi, '');
    url = url.replace(/\/par\_[^\/]+/gi, '');
    url = url.replace(/\/pnt\_[^\/]+/gi, '');
    url = url.replace(/\/[a-z]{3,4}$/gi, ''); // ending segment (can be language or format)
    url = url.replace(/\/[a-z]{3}$/gi, ''); // ending segment (can be language or format)
    return url;
  },
  // returns the pre-configured date to use as an ELI point in time. Format: `/YYYY-MM-DD`. Defaults to `/oj`.
  eliPointInTime: function pointInTime(reference, defaultDate) {
    var pointInTime = R2L.options.pointInTime || null;
    var d = new Date(String(pointInTime));
    if (!pointInTime || d.toString() === "Invalid Date") {
      return defaultDate !== undefined ? "/" + defaultDate : "/oj";
    }

    // ELI date should have format: `YYYY-MM-DD`
    var dateStr = d.toISOString().split('T')[0];
    return "/" + dateStr;
  },
  // maps a month label to a number. Example: `November`|month returns `11`
  month: function month(str) {
    if (str && !isNaN(str)) {
      return str;
    }
    var converterRule = R2L.getConverterRules().filter(function (r) {
      return r.type === 'label_month';
    })[0];
    if (!converterRule) {
      return '';
    }
    str = str ? String(str) : "";
    var matches = str.match(new RegExp(converterRule.pattern.source, "im"));
    if (matches && matches.length > 0) {
      for (var i = 1; i <= 12; i++) {
        if (matches[i]) {
          return String(i);
        }
      }
    }
    return '';
  },
  // inverse of the 'month' converter, will return the month label for an index
  // @TODO implement other languages
  monthLabel: function monthLabel(monthNo, locale) {
    locale = String(locale || 'en').toLowerCase();
    monthNo = Number(monthNo);
    if (isNaN(monthNo) || monthNo < 1 || monthNo > 12) {
      return '';
    }
    var date = new Date();
    date.setMonth(monthNo - 1);
    return date.toLocaleString(locale, {
      month: 'long'
    });
  },
  // maps a numeration label to a number. Example: `second`|numeration returns `2`. Only works until 5.
  numeration: function numeration(str) {
    if (String(str).length > 0 && !isNaN(str)) {
      return str;
    }
    var converterRule = R2L.getConverterRules().filter(function (r) {
      return r.type === 'label_numeration';
    })[0];
    if (!converterRule) {
      return '';
    }
    str = str ? String(str) : "";
    var matches = str.match(new RegExp(converterRule.pattern.source, "im"));
    if (matches && matches.length > 0) {
      for (var i = 1; i <= 5; i++) {
        if (matches[i]) {
          return String(i);
        }
      }
    }
    return '';
  },
  // pad a string. 
  pad: function pad(str, _pad, len, position, strict) {
    str = str || '';
    if (strict && !str) {
      return '';
    }
    len = len || 0;
    _pad = (_pad === 0 ? '0' : _pad) || '';
    var chars = len - ('' + str).length;
    if (chars > 0) {
      switch (position) {
        case 'right':
          return str + ('' + _pad).repeat(chars);
        case 'left':
        default:
          return ('' + _pad).repeat(chars) + str;
      }
    }
    return str;
  },
  // convert a 2-digit year into a 4-digit year; Works between 1958 - 2057;
  year: function year(str) {
    str = str || '';
    if (('' + str).length === 4 && !isNaN(str)) {
      return Number(str);
    }
    if (('' + str).length == 2) {
      var y = parseInt(str, 10);
      if (y <= 57) {
        return Number('20' + str);
      } else {
        return Number('19' + str);
      }
    }
    if (!str) {
      return Number(new Date().getFullYear());
    }
  },
  // convert a 4-digit year into a 2-digit year; Works between 1958 - 2057;
  shortYear: function shortYear(str) {
    str = str || '';
    if (('' + str).length === 2) {
      return Number(str);
    }
    if (('' + str).length === 4) {
      return Number(str.substr(2, 3));
    }
  },
  // trims a string (optional list of chars to trim)
  trim: function trim(str, chars) {
    var regExpEscape = function regExpEscape(pattern) {
      return pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    };
    str = str || '';
    chars = chars || '';
    if (chars.trim()) {
      var re = new RegExp("^[" + regExpEscape(chars) + "]+|[" + regExpEscape(chars) + "]+$", "g");
      return str.replace(re, '');
    } else {
      return str.replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').trim();
    }
  },
  // Replace string in string; The `what` parameter can be a regular expression string (eg. /1[23]/) or a normal string;
  replace: function replace(str, what, replacement, isRegexp) {
    return (String(str) || '').replace(R2L.delimiter2RegExp(what), replacement === undefined ? '' : replacement);
  },
  // Returns length of Array
  length: function length(obj) {
    return obj && obj.hasOwnProperty('length') ? obj.length : 0;
  },
  // Splits a string using a delimiter; Accepts both a regex string eg. `/1[23]/` or a regular string eg. `12`. 
  split: function split(str, delimiter) {
    return (str || '').split(R2L.delimiter2RegExp(delimiter));
  },
  // 
  // @deprecated
  _default: function _default(str, defaultValue) {
    return (str === 0 ? '0' : str) || (defaultValue ? encodeURIComponent(defaultValue) : '') || '';
  },
  // logical OR operator. Usage: {{ $1|any:($2):($3):($4) }} # will return the first non-empty string among the 4 backreferences;
  any: function any() {
    for (var i = 0; i < arguments.length; i++) {
      if (typeof arguments[i] === "number") {
        return String(arguments[i]);
      }
      if (typeof arguments[i] !== "string") {
        continue;
      }
      if (arguments[i].length > 0) {
        return arguments[i];
      }
    }
    return '';
  },
  // Logical operator: returns empty string if any of the args is not false(y); Usage: 
  // {{ $1|emptyIf:($2):($3):($4) }} === $1    # IF $2 AND $3 AND $4 are not empty return $1;
  emptyIf: function emptyIf() {
    for (var i = 1; i < arguments.length; i++) {
      if (arguments[i]) {
        return "";
      }
    }
    return arguments[0];
  },
  // parse a number which contains a suffix;
  numberExt: function numberExt(input) {
    // support numeral labels like 'first', 'second' etc.
    if (/^[^0-9]/.test(input)) {
      return R2L.converters.numeration(input) || 1;
    }

    // can handle subpart suffixes like '23 bis', '23a', '23.a', '23b' (REFTOLINK-1115)
    if (/^\d+$/.test(input)) {
      return parseInt(input, 10);
    }

    // we clear out suffixes like 'nd', 'rd', 'st', 'er': 
    if (/^\d+(st|nd|rd|er)$/i.test(input)) {
      var parsedInput = input.replace(/(st|nd|rd|er)$/i, '');
      return parseInt(parsedInput, 10);
    }
    var cleanedInput = input.replace(/[аα]/gi, 'a');
    // we accept all other letters as a suffix and we keep it
    if (/^(\d+)[a-z][a-z]?$/i.test(String(cleanedInput))) {
      return cleanedInput;
    }
    if (!R2L.settings.constants.R2L_DEFAULT_LANG_ISO3 || R2L.settings.constants.R2L_DEFAULT_LANG_ISO3 === 'POR') {
      // handling of PT style suffixes (using a dot): artigo 12.o-F do Regulamento de Execução (UE) n.o 725/2011 
      if (/^(\d+)(\.[o°])?-[a-z][a-z]?$/i.test(String(cleanedInput))) {
        var parts = cleanedInput.split("-");
        var digits = parts[0].split(".");
        return digits[0] + String(parts[1]).toLowerCase();
      }

      // handling of PT style suffixes (using a dot): artigo 12.o
      if (/^(\d+)(\.[o°])$/i.test(String(cleanedInput))) {
        var _parts = cleanedInput.split(".");
        return _parts[0];
      }
    }

    // handling of LV style suffixes (using a dot): Komisijas Īstenošanas regulas (ES) Nr. 725/2011 12.t pantam
    if (/^(\d+)\.[a-z][a-z]?$/i.test(String(cleanedInput))) {
      var _parts2 = cleanedInput.split(".");
      return _parts2[0] + String(_parts2[1]).toLowerCase();
    }

    // every other suffix will be turned into an "a"
    return String(input).replace(/^(\d+).+/i, "\$1a");
  },
  // Parse a roman number into arabic. {{ 'IV'|number }} === '4'
  number: function number(input) {
    var romans = {
        ι: 1,
        i: 1,
        v: 5,
        χ: 10,
        x: 10,
        l: 50,
        c: 100,
        d: 500,
        m: 1000
      },
      pos = 0,
      _char,
      nextchar,
      thisSum,
      result = 0;
    input = (input || '').toLowerCase();
    if (/^\d+$/.test(input)) {
      return parseInt(input, 10);
    }
    while (pos < input.length) {
      _char = input[pos];
      // are we NOT at the end?
      if (pos != input.length) {
        // check next character - if bigger, replace with a sub
        nextchar = input[pos + 1];
        if (romans[_char] < romans[nextchar]) {
          thisSum = romans[nextchar] - romans[_char];
          result += thisSum;
          pos += 2;
        } else {
          result += romans[_char];
          pos++;
        }
      } else {
        result += romans[_char];
        pos++;
      }
    }
    return result ? result : '';
  },
  asciiRoman: function asciiRoman(input) {
    if (!input) {
      return input;
    }
    input = input.replace(/ι/gi, 'I');
    input = input.replace(/χ/gi, 'X');
    input = input.replace(/Ι/gi, 'I');
    return input.toUpperCase();
  },
  castToNumber: function castToNumber(num) {
    return Number(num);
  },
  toRoman: function toRoman(num) {
    if (!num || !/^\d+$/.test(String(num)) || Number(num) === 0) {
      return num;
    }
    num = Number(num);
    var roman = {
      M: 1000,
      CM: 900,
      D: 500,
      CD: 400,
      C: 100,
      XC: 90,
      L: 50,
      XL: 40,
      X: 10,
      IX: 9,
      V: 5,
      IV: 4,
      I: 1
    };
    var str = '';
    for (var _i = 0, _Object$keys = Object.keys(roman); _i < _Object$keys.length; _i++) {
      var i = _Object$keys[_i];
      var q = Math.floor(num / roman[i]);
      num -= q * roman[i];
      str += i.repeat(q);
    }
    return str;
  },
  roman: function roman(input) {
    var romans = {
        ι: 1,
        i: 1,
        v: 5,
        χ: 10,
        x: 10,
        l: 50,
        c: 100,
        d: 500,
        m: 1000
      },
      pos = 0,
      _char2,
      nextchar,
      thisSum,
      result = 0;

    // Can be used as connector words (and, or)
    if (input === 'i' || input === 'v') {
      return '';
    }
    input = (input || '').toLowerCase();
    if (/^\d+$/.test(input)) {
      return parseInt(input, 10);
    }
    while (pos < input.length) {
      _char2 = input[pos];
      // are we NOT at the end?
      if (pos != input.length) {
        // check next character - if bigger, replace with a sub
        nextchar = input[pos + 1];
        if (romans[_char2] < romans[nextchar]) {
          thisSum = romans[nextchar] - romans[_char2];
          result += thisSum;
          pos += 2;
        } else {
          result += romans[_char2];
          pos++;
        }
      } else {
        result += romans[_char2];
        pos++;
      }
    }
    return result ? result : '';
  },
  // Turns cyrilic/greek letters into latin equivalents. Example: 
  // {{ 'в'|letterToLatin }} === 'b'
  letterToLatin: function letterToLatin(characters) {
    var letters = R2L.letters;
    var ReCyrillic = new RegExp("[" + letters.cyrillic + "]");
    var ReGreek = new RegExp("[" + letters.greek + "]");
    var latinCodes = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
    var latinTranslation = "";
    characters = characters.toLowerCase();
    if (ReCyrillic.test(characters)) {
      var cyrilicCodes = ["а", "б", "в", "г", "д", "е", "ж", "з", "и", "й", "к", "л", "м", "н", "о", "п", "р", "с", "т", "у", "ф", "х", "ц", "ч", "ш", "щ"];
      var i = characters.length;
      var index = 0;
      while (i--) {
        index = cyrilicCodes.indexOf(characters.charAt(i));
        latinTranslation = latinCodes[index] + latinTranslation;
      }
      return latinTranslation;
    } else if (ReGreek.test(characters)) {
      var greekSingleCodes = ["α", "β", "γ", "δ", "ε", "στ", "ζ", "η", "θ"];
      var greekTensCodes = ["", "ι", "κ", "λ", "μ"];
      var _i2 = characters.length;
      var _index = 0;
      while (_i2--) {
        var letter = characters.charAt(_i2);
        if (characters.charAt(_i2) == "τ") {
          _i2--;
          letter = characters.charAt(_i2) + letter;
        }
        ;
        if (greekSingleCodes.indexOf(letter) > 0) {
          _index = _index + greekSingleCodes.indexOf(letter);
        }
        ;
        if (greekTensCodes.indexOf(letter) >= 0) {
          _index = _index + greekTensCodes.indexOf(letter) * (greekSingleCodes.length + 1);
        }
        ;
      }
      var firstLetter = parseInt(_index / latinCodes.length) - 1;
      var secondLetter = _index % latinCodes.length;
      if (firstLetter >= 0) {
        return latinCodes[firstLetter] + latinCodes[secondLetter];
      } else {
        return latinCodes[secondLetter];
      }
    }
    ;
    return characters;
  },
  // Replace string with replacement value if the input passes the regex test. Example:
  // {{ 'er123'|testReplace:'/r\d+/':'444' }} === '444'    # passes the test
  // {{ 'er123'|testReplace:'/x\d+/':'444' }} === 'er123'  # fails the test
  testReplace: function testReplace(str, what, replacement) {
    var reg = R2L.delimiter2RegExp(what);
    str = String(str) || '';
    if (reg.test(str)) {
      return replacement === undefined ? '' : replacement;
    }
    return str;
  },
  // Replace string with replacement value if the input does NOT the regex test. Example:
  // {{ 'er123'|testNotReplace:'/r\d+/':'444' }} === 'er123'    # passes the test
  // {{ 'er123'|testNotReplace:'/x\d+/':'444' }} === '444'      # fails the test
  testNotReplace: function testNotReplace(str, what, replacement) {
    var reg = R2L.delimiter2RegExp(what);
    str = String(str) || '';
    if (!reg.test(str)) {
      return replacement === undefined ? '' : replacement;
    }
    return str;
  },
  replaceIf: function replaceIf(str, what, replacement) {
    str = String(str) || '';
    if (what) {
      return replacement;
    }
    return str;
  },
  // Decrement number by 1;
  dec: function dec(n) {
    if (!isNaN(n)) {
      return --n;
    }
    return NaN;
  },
  // Uppercase string
  upper: function upper(t) {
    return (t || '').toUpperCase();
  },
  // Lowercase string
  lower: function lower(t) {
    return (t || '').toLowerCase();
  },
  // Slice string. Usage: {{ 'mike'|slice:1:3 }} === 'ik'
  slice: function slice(t, start, end) {
    return t.slice(start, end);
  },
  // URL encode string
  urlencode: function urlencode(url) {
    return encodeURIComponent(url || '');
  },
  // Uppercase first letter only
  ucfirst: function ucfirst(str) {
    return ((str || '')[0] || '').toUpperCase() + ((str || '').substring(1) || '');
  },
  // Checks if string is part of a comma-separated list;
  is: function is(str, list) {
    return list.split(',').indexOf(str) >= 0;
  },
  // Checks if a string matches a regex; returns a boolean. 
  // Example: {{ '123a|match:'/[a-h]$/i' }} === true
  match: function match(str, expr) {
    var e = R2L.delimiter2RegExp(expr);
    if (e) {
      return e.test(str);
    }
  },
  // Check if string is valid year: Works between 1958 - 2057
  isYear: function isYear(str) {
    var no = R2L.converters.number(str),
      year = new Date().getFullYear();
    if (('' + no).length === 2 || ('' + no).length === 1 && '0' + no === str) {
      return no >= 58 || no >= 0 && no <= year % 2000;
    }
    if (('' + no).length === 4) {
      return no >= 1958 && no <= year;
    }
    return false;
  },
  // Negate 
  not: function not(bool) {
    return !bool;
  },
  // Remap function; takes an Array of regexes and an Array of output strings as params. 
  // Example: {{ $1|remap:['/M/','/SA/']:['_M','_SA'] }}}}
  remap: function remap(val, map, dest) {
    if (!Array.isArray(map)) {
      map = [map];
    }
    if (!Array.isArray(dest)) {
      dest = [dest];
    }
    if (map.length !== dest.length) {
      throw '"remap" map.length !== dest.length';
    }
    for (var i = 0; i < map.length; i++) {
      var e = R2L.delimiter2RegExp(map[i]);
      if (e && e.test(val)) {
        return dest[i];
      }
    }
    return val;
  },
  // Compare 2 values. Returns true if they are equal;
  equals: function equals(strFirst, strSecond) {
    return strFirst === strSecond;
  },
  // Compare 2 values; Returns false if they are equal;
  nequals: function nequals(strFirst, strSecond) {
    return strFirst !== strSecond;
  },
  // Encode string as base64
  base64: function base64(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function toSolidBytes(match, p1) {
      return String.fromCharCode('0x' + p1);
    }).replace('%20', ' '));
  },
  // Concatenate 2 strings. Example: {{ $1|concat:($2) }} === $1 + $2
  concat: function concat(strFirst, strSecond) {
    strFirst = strFirst || '';
    strSecond = strSecond || '';
    return strFirst.concat(strSecond);
  },
  debug: function debug(val) {
    debugger;
    return val;
  },
  // Sums 2 numbers;
  sum: function sum(intFirst, intSecond) {
    var result = Number(intFirst) + Number(intSecond);
    return isNaN(result) ? 0 : result;
  },
  // Returns true if a string is a numeric value
  isNumeric: function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  },
  escapeDoubleQuotes: function escapeDoubleQuotes(str) {
    return str.replaceAll('"', '&quot;');
  },
  /**
   * 5th EP
   * 20 July 1999 – 5 May 2004
   * 
   * 6th EP
   * 20 July 2004 – 7 May 2009
   * 
   * 7th EP
   * 14 July 2009 – 17 April 2014
   * 
   * 8th EP
   * 1 July 2014 – 18 April 2019
   * 
   * 9th EP
   * 2 July 2019 – 15 July 2024
   * 
   * 10th EP
   * 16 July 2024 – TBD
   * 
   * @param {String} str 
   * @param {String} year 
   * @param {String} month 
   * @param {String} day 
   */
  parliamentTerm: function parliamentTerm(str, year, month, day) {
    var ymd = R2L.converters.year(year) + '-' + String(month).padStart(2, '0') + '-' + String(day).padStart(2, '0');
    var intervals = [['1999-07-20', '2004-05-05'],
    // 5th term
    ['2004-07-20', '2009-05-07'], ['2009-07-14', '2014-04-17'], ['2014-07-01', '2019-04-18'], ['2019-07-02', '2024-07-15'], ['2024-07-16', '2029-06-01']];
    for (var i = 0; i < intervals.length; i++) {
      var interval = intervals[i];
      if (ymd < interval[0]) {
        return i + 4;
      } else if (ymd < interval[1]) {
        return i + 5;
      }
    }

    // current term if none matches
    return 10;
  }
};


/***/ }),

/***/ 567:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   $9: () => (/* binding */ bindRules),
/* harmony export */   n3: () => (/* binding */ clearRuntimeRules)
/* harmony export */ });
/* unused harmony export clearRef2LinkRules */
/* harmony import */ var _jquery_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(953);
/* harmony import */ var _utils_letters_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(228);
/* harmony import */ var _utils_base64_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(910);
/* harmony import */ var _ux_index_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(246);
/* harmony import */ var _utils_converters_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(560);
/* harmony import */ var _utils_lzstring_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(34);
/* harmony import */ var _utils_list_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(577);
/* harmony import */ var _utils_functions_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(588);
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }









/**
 * Internal variables to store rules/patterns
 */
var _ref2linkRules = [];
var _runtimeRules = [];
var _namedPatterns = {};
function clearRuntimeRules() {
  _runtimeRules = [];
}
function clearRef2LinkRules() {
  _ref2linkRules = [];
}

/**
 * Binds the API functions to work with rules
 * @param {Object} R2L 
 */
function bindRules(R2L) {
  var rK, rV;
  try {
    rK = JSON.parse(R2L.getConstant("R2L_RULE_MAP"));
    rV = JSON.parse(R2L.getConstant("R2L_VIEW_MAP"));
  } catch (e) {
    rK = {};
    rV = {};
    console.error(e);
  }
  R2L.compileGlobalRule = function (rules) {
    var patterns = [];
    var offset = 0;
    rules.forEach(function (_rule) {
      if (_rule.hasOwnProperty('views') && _rule.views && _rule.views.hasOwnProperty('length') && _rule.views.length) {
        offset += parseInt(_rule.slots);
        var p = '' + (_rule.fullPattern.source || _rule.fullPattern);
        var nonCapturing = R2L.getNonCapturingPattern(p);
        nonCapturing = nonCapturing.replace('{$i}', offset);
        patterns.push('(' + nonCapturing + ')');
      }
    });
    var joinedPattern = '(?:' + patterns.join('|') + ')';
    var letterPattern = "[/0-9" + _utils_letters_js__WEBPACK_IMPORTED_MODULE_1__/* .letters */ .M.latin + _utils_letters_js__WEBPACK_IMPORTED_MODULE_1__/* .letters */ .M.cyrillic + _utils_letters_js__WEBPACK_IMPORTED_MODULE_1__/* .letters */ .M.greek + _utils_letters_js__WEBPACK_IMPORTED_MODULE_1__/* .letters */ .M.specialChars + "]";
    var lookahead = (0,_utils_functions_js__WEBPACK_IMPORTED_MODULE_6__/* .getLookAhead */ .VC)(letterPattern);
    var lookbehind = (0,_utils_functions_js__WEBPACK_IMPORTED_MODULE_6__/* .getLookBehind */ .Wq)(letterPattern);
    return {
      'pattern': new RegExp('(?![\r\n\v\f])' + lookbehind + joinedPattern + lookahead, 'ig'),
      'rules': rules
    };
  };
  R2L.addRules = function (rules) {
    // Only IE11 lacks Regex negative lookbehind - still in use in Word2016
    var hasNegativeLookbehind = (0,_utils_functions_js__WEBPACK_IMPORTED_MODULE_6__/* .supportNegativeLookbehind */ .UJ)();
    console.debug("Negative lookbehind support", hasNegativeLookbehind);
    _runtimeRules = [];
    rules.forEach(function (_rule) {
      // Our patterns use negative lookbehind for improved detection. 
      // If it is not supported by the underlying platform we need to remove these parts from the patterns as they will not compile.
      if (!hasNegativeLookbehind) {
        var r = new RegExp("\\(\\?<!((?!\\)).)+\\)", "g");
        //replace pattern
        _rule.p = _rule.p.replace(r, "");
        if (_rule.ip) {
          //replace item pattern
          _rule.ip = _rule.ip.replace(r, "");
        }
      }
      R2L.addRule(_rule);
    });
    R2L.getAllRules().map(function (rule) {
      // append common targets if needed
      if (rule.commonRules.length > 0) {
        rule.views = rule.views.map(function (v) {
          v.common = false;
          return v;
        });
        rule.commonRules.map(function (commonRuleType) {
          var commonRule = R2L.getAllRules().filter(function (r) {
            return r.type === commonRuleType;
          }).pop();
          var views = commonRule ? commonRule.views : null;
          if (views) {
            views = views.map(function (v) {
              // common views have a flag
              v.common = true;
              return v;
            });
            rule.views = rule.views.concat(views);
            if (rule.itemRule) {
              rule.itemRule.views = rule.views;
            }
          }
        });
      } else {
        rule.views = rule.views.map(function (view) {
          view.common = false;
          return view;
        });
      }
    });
  };
  R2L.reloadRules = function () {
    _ref2linkRules = [];
    this.addRules(JSON.parse(_utils_lzstring_js__WEBPACK_IMPORTED_MODULE_5__/* ["default"] */ .A.decompressFromBase64(R2L.getConstant("R2L_TYPED_RULES"))));
  };
  R2L.addRule = function (ruleSpecs) {
    var rule = R2L.compileRule(ruleSpecs);
    if (!rule) {
      return;
    }
    rule.allowTitle = !!rule.allowTitle && R2L.options.enableSpecialRules;
    _ref2linkRules.push(rule);
    R2L.globalMatches = {}; // at least one rule changed; reset all matches
  };
  R2L.getNamedRule = function (name) {
    if (_namedPatterns.hasOwnProperty(name)) {
      return _namedPatterns[name];
    }
    var namedRule;
    _ref2linkRules.forEach(function (rule, i) {
      if (rule.name === name) {
        namedRule = rule;
        return false;
      }
    });
    if (namedRule) {
      return namedRule;
    }
    return null;
  };
  R2L.getRules = function (filters) {
    if (!_runtimeRules.length) {
      _runtimeRules = R2L.getFilteredRules(filters || R2L.filters, true);
    }
    return _runtimeRules;
  };
  R2L.getAllRules = function () {
    return _ref2linkRules;
  };
  R2L.getConverterRules = function () {
    var rules = [];
    _ref2linkRules.forEach(function (_ref2linkRule) {
      if (_ref2linkRule.converter) {
        rules.push(_ref2linkRule);
      }
    });
    return rules;
  };
  R2L.getFilteredRules = function (filters, includePublic) {
    var _this = this;
    var rules = [];
    _ref2linkRules.forEach(function (_ref2linkRule) {
      if (!_this.options.enableSpecialRules && _ref2linkRule.forced) {
        return;
      }
      if (_ref2linkRule.converter) {
        return;
      }

      /** filter rules */
      if (!filters.hasOwnProperty('types') || !filters.types || !filters.types.length || filters.types.indexOf(_ref2linkRule.type) >= 0) {
        var rule = Object.assign({}, _ref2linkRule),
          views = [],
          foundView = false;
        rule.views = views;
        (_ref2linkRule.views || []).forEach(function (_view) {
          /** if filters types is false then include it if has the right env */
          var isPublic = includePublic && _view.environments.indexOf('*') >= 0,
            hasEnv = isPublic || !!(0,_utils_functions_js__WEBPACK_IMPORTED_MODULE_6__/* .intersect */ .y$)(filters.environments, _view.environments).length,
            hasTarget = !filters.hasOwnProperty('targets') || !filters.targets || !filters.targets.length || filters.targets.indexOf(_view.target) >= 0,
            isTargetAllowed = hasEnv && filters.types === false;
          if ((hasEnv || isPublic) && (hasTarget || isTargetAllowed)) {
            views.push(Object.assign({}, _view));
            foundView = true;
          }
        });

        // only table view - do not include rule
        if (views.length === 1 && views[0].target === "table") {
          foundView = false;
        }
        if (foundView) {
          views.sort(_ux_index_js__WEBPACK_IMPORTED_MODULE_3__/* .orderSorter */ .Y3);
          rules.push(rule);
        }
      }
    });
    rules.sort(_ux_index_js__WEBPACK_IMPORTED_MODULE_3__/* .orderSorter */ .Y3);
    return rules;
  };
  R2L.getGlobalTypes = function () {
    var types = {};
    _ref2linkRules.forEach(function (_ref2linkRule) {
      if (!_ref2linkRule.type) {
        return;
      }
      types[_ref2linkRule.type] = _ref2linkRule.ruleLibelle || _ref2linkRule.name;
    });
    return types;
  };
  R2L.getGlobalTargets = function () {
    var targets = {};
    _ref2linkRules.forEach(function (_ref2linkRule) {
      _ref2linkRule.views.forEach(function (_view) {
        targets[_view.target] = _view.target;
      });
    });
    return targets;
  };
  R2L.getGlobalTypeTargets = function () {
    var data = {};
    _ref2linkRules.forEach(function (_ref2linkRule) {
      if (!_ref2linkRule.type) {
        return;
      }
      var type = _ref2linkRule.type;
      var label = _ref2linkRule.ruleLibelle || _ref2linkRule.name;
      data[type] = [];
      _ref2linkRule.views.forEach(function (_view) {
        // we exclude the common views
        if (_ref2linkRule.common || !_view.common) {
          data[type].push({
            target: _view.target,
            label: label
          });
        }
      });
    });
    return data;
  };
  R2L.getBaseTypeTargets = function () {
    var data = {};
    _ref2linkRules.forEach(function (_ref2linkRule) {
      if (!_ref2linkRule.type) {
        return;
      }
      var baseType = _ref2linkRule.baseType || _ref2linkRule.type;
      var label = _ref2linkRule.baseLibelle || _ref2linkRule.ruleLibelle || _ref2linkRule.name;
      data[baseType] = data[baseType] || {
        targets: [],
        types: [],
        label: label
      };
      data[baseType].types.push(_ref2linkRule.type);
      _ref2linkRule.views.forEach(function (_view) {
        if (_ref2linkRule.common || !_view.common) {
          data[baseType].targets.push({
            target: _view.target,
            baseTarget: _view.baseTarget,
            baseLabel: label,
            label: _ref2linkRule.ruleLibelle || _ref2linkRule.name
          });
        }
      });
    });
    return data;
  };
  R2L.getFiltersWithDependencies = function () {
    var byEnv = {};
    var byRule = {};
    _ref2linkRules.forEach(function (_ref2linkRule) {
      var rule = _ref2linkRule;
      if (!byRule.hasOwnProperty(rule.type)) {
        byRule[rule.type] = [];
      }
      (_ref2linkRule.views || []).forEach(function (_view) {
        var view = _view;
        (_view.environments || []).forEach(function (_env) {
          if (!byEnv.hasOwnProperty(_env)) {
            byEnv[_env] = {
              types: [],
              targets: []
            };
          }
          if (byEnv[_env].types.indexOf(rule.type) < 0) {
            byEnv[_env].types.push(rule.type);
          }
          if (byEnv[_env].targets.indexOf(view.target) < 0) {
            byEnv[_env].targets.push(view.target);
          }
        });
        byRule[rule.type].push(view.target);
      });
    });
    return {
      byEnvironment: byEnv,
      byRule: byRule
    };
  };
  R2L.getGlobalEnvironments = function () {
    var envs = {};
    _ref2linkRules.forEach(function (_ref2linkRule) {
      _ref2linkRule.views.forEach(function (_view) {
        _view.environments.forEach(function (_env) {
          envs[_env] = _env;
        });
      });
    });
    envs['*'] = 'Public';
    return envs;
  };
  R2L.compileGuards = function (rules) {
    var map = {};
    for (var i = 0; i < rules.length; i++) {
      if (rules[i]["guard-pattern"]) {
        if (!map[rules[i]["guard-pattern"]]) {
          map[rules[i]["guard-pattern"]] = {
            ruleTypes: [],
            found: false
          };
        }
        map[rules[i]["guard-pattern"]].ruleTypes.push(rules[i].type);
      }
    }
    return map;
  };

  /**
   * Optimize detection by dropping useless rules according to guard patterns.
   * Use case: 
   *   The EUR-Lex act rule has a guard pattern that looks for a (directive|regulation|resolution|common position) label in the input text. 
   *   If the input text does not contain this label it makes no sense to attempt matching the EUR-Lex act rule at all as it will definitely not find anything.
   *   This quick lookup for the label is very fast and can improve detection speed significantly.  
   * 
   * @see <guard-pattern> definitions in the XML rules (eg. `eurlex/rule_act.xml`)
   * 
   * @param string text
   * @param Object[] rules
   */
  R2L.runGuards = function (text, rules) {
    var letterPattern = "[0-9" + _utils_letters_js__WEBPACK_IMPORTED_MODULE_1__/* .letters */ .M.latin + _utils_letters_js__WEBPACK_IMPORTED_MODULE_1__/* .letters */ .M.cyrillic + _utils_letters_js__WEBPACK_IMPORTED_MODULE_1__/* .letters */ .M.greek + _utils_letters_js__WEBPACK_IMPORTED_MODULE_1__/* .letters */ .M.specialChars + "]";
    var lookahead = (0,_utils_functions_js__WEBPACK_IMPORTED_MODULE_6__/* .getLookAhead */ .VC)(letterPattern);
    var guards = this.compileGuards(rules);
    for (var pattern in guards) {
      var reg = new RegExp(pattern + lookahead, "i");
      if (!reg.test(text)) {
        rules = rules.filter(function (rule) {
          return guards[pattern].ruleTypes.indexOf(rule.type) === -1;
        });
      }
    }
    console.debug("Guard check done");
    // applying pattern optimizers based on text. 
    // @see R2L.settings.patternOptimizers

    var t0 = performance.now();
    Object.keys(R2L.settings.patternOptimizers || {}).forEach(function (optimizerKey) {
      var optimizers = R2L.settings.patternOptimizers[optimizerKey];
      console.debug("[PATTERN OPTIMIZERS] Running for key:", optimizerKey);
      // Each optmizer runs only once
      var handled = false;
      optimizers.forEach(function (optimizer) {
        if (handled) {
          return;
        }
        var found = optimizer.guardRegExp.test(text);
        console.debug("[PATTERN OPTIMIZERS] Found extended pattern?", found, optimizer.guardRegExp);
        if (found) {
          return;
        }
        console.debug("[PATTERN OPTIMIZERS] Proceed with replacement");
        var searchRegExp = new RegExp((0,_utils_functions_js__WEBPACK_IMPORTED_MODULE_6__/* .regExpEscape */ .fI)(optimizer.searchSubpattern), 'g');
        var replaceSubpattern = optimizer.replaceSubpattern;
        handled = true;
        rules = rules.map(function (rule) {
          // don't deep copy unless needed
          if (!rule.pattern.source.match(searchRegExp)) {
            return rule;
          }
          var newRule = _objectSpread({}, rule); //deep copy
          var replacedPatternSource = newRule.pattern.source.replace(searchRegExp, replaceSubpattern);
          var replacedFullPatternSource = newRule.fullPattern.source.replace(searchRegExp, replaceSubpattern);
          newRule.pattern = new RegExp(replacedPatternSource, newRule.pattern.flags);
          newRule.fullPattern = new RegExp(replacedFullPatternSource, newRule.fullPattern.flags);
          if (newRule["item-pattern"]) {
            var replacedItemPattern = newRule["item-pattern"].replace(searchRegExp, replaceSubpattern);
            newRule["item-pattern"] = replacedItemPattern;

            // Update Item rule
            if (newRule.itemRule) {
              var replacedItemPatternSource = newRule.itemRule.pattern.source.replace(searchRegExp, replaceSubpattern);
              var replacedFullItemPatternSource = newRule.itemRule.fullPattern.source.replace(searchRegExp, replaceSubpattern);
              newRule.itemRule = _objectSpread({}, newRule.itemRule); // deep copy
              newRule.itemRule.pattern = new RegExp(replacedItemPatternSource, newRule.itemRule.pattern.flags);
              newRule.itemRule.fullPattern = new RegExp(replacedFullItemPatternSource, newRule.itemRule.fullPattern.flags);
            }
          }

          // deep copy
          return newRule;
        });
      });
    });
    console.debug("[PATTERN OPTIMIZERS] DONE", performance.now() - t0, "ms");
    return rules;
  };
  R2L.lintRule = function (rule) {
    var result = {
      warnings: [],
      errors: []
    };
    try {
      rule.pattern = new RegExp(rule.pattern, "gm" + (rule.casesensitive ? '' : 'i'));
      if (rule.hasOwnProperty('fullPattern') && rule.fullPattern) {
        rule.fullPattern = new RegExp(rule.fullPattern, 'gm' + (rule.casesensitive ? '' : 'i'));
      }
    } catch (e) {
      if (('' + e).toLowerCase().indexOf('invalid escape') >= 0) {
        result.warnings.push('' + e);
      } else {
        result.errors.push('' + e);
      }
    }
    return result;
  };
  R2L.compileRule = function (rule, noUnpacking) {
    rule.allowTitle = rule.allowTitle && R2L.options.enableSpecialRules !== false;
    var unpack = noUnpacking ? false : true;
    if (unpack) {
      var unpackedRule = {};
      Object.keys(rK).forEach(function (destKey) {
        unpackedRule[destKey] = rule[rK[destKey]];
      });
      if (unpackedRule.hasOwnProperty('views') && Array.isArray(unpackedRule.views)) {
        var unpackedViews = [],
          unpackedView;
        unpackedRule['views'].forEach(function (_view) {
          var view = _view;
          unpackedView = {};
          Object.keys(rV).forEach(function (destKey) {
            unpackedView[destKey] = view[rV[destKey]];
          });
          unpackedViews.push(unpackedView);
        });
        unpackedRule['views'] = unpackedViews;
      }
      rule = unpackedRule;
    }
    var linterResult = R2L.lintRule(rule);
    rule.errors = linterResult.errors;
    rule.warnings = linterResult.warnings;
    var fullPatternCompiler = function fullPatternCompiler(rule) {
      if (rule.hasOwnProperty('type') && rule.type) {
        rule.allowTitle = !!rule.allowTitle && R2L.options.enableSpecialRules;
        var forced = rule.hasOwnProperty('forced') && rule.forced ? '' : '?';
        var typePattern = '(' + (rule.forced && !R2L.options.enableSpecialRules ? '1jqgk' : (0,_utils_functions_js__WEBPACK_IMPORTED_MODULE_6__/* .regExpEscape */ .fI)(rule.type)) + ')';
        var simplifiedPattern = (0,_utils_functions_js__WEBPACK_IMPORTED_MODULE_6__/* .getNonCapturingPattern */ .T0)(rule.pattern.source || rule.pattern);
        var titlePattern = '[^\\]]+?';
        var beginning = rule.allowTitle ? '\\[' + forced : '';
        var ending = rule.allowTitle ? '\\]' + forced : '';

        /**
         * $1 - type, $2 - match, $3 - title, $4 - match
         */
        var expr;
        // forced rules must NOT explicitly have `allow-title=false` (which is enabled by default). Example: kmtheme[principe de non discrimination]
        if (rule.allowTitle) {
          expr = '(?:' + typePattern + forced + '(?:' + '(?:' + '\\[' + '(' + simplifiedPattern + ')' + '\\s?\\|\\s?' + '(' + titlePattern + ')' + '\\s?\\]' + ')' + '|' + '(?:' + beginning + '(' + simplifiedPattern + ')' + ending + ')' + ')' + ')';
        } else {
          expr = '(' + '(' + '(' + '(' + simplifiedPattern + ')' + ')' + ')' + ')';
        }
        try {
          return new RegExp(expr, 'gi');
        } catch (e) {
          console.error(rule.type, e);
          return null;
        }
      }
      return rule.pattern;
    };
    rule.fullPattern = fullPatternCompiler(rule);
    if (!rule.fullPattern) {
      return null;
    }
    rule.matches = function (text) {
      return rule.pattern.test(text);
    };
    if (rule["item-pattern"]) {
      rule.itemRule = R2L.compileRule({
        name: rule.name + '-item',
        pattern: rule["item-pattern"],
        skipPattern: rule["skip-pattern"],
        trimPattern: rule["trim-pattern"],
        fullPattern: fullPatternCompiler({
          force: rule.itemForced,
          pattern: rule['item-pattern']
        }),
        type: rule['itemType'],
        ld: rule['ld'],
        baseType: rule["baseType"],
        baseLibelle: rule["baseLibelle"],
        forced: rule['itemForced'],
        ruleLibelle: rule["ruleLibelle"] + ' item',
        prefix: rule["prefix"],
        skip: rule["skip"],
        vars: rule["vars"],
        identifiers: rule["identifiers"],
        coreIdentifiers: rule["coreIdentifiers"],
        commonRules: rule["commonRules"],
        shared: rule["shared"],
        views: rule.views,
        isListItem: true
      }, true);
    }
    if (rule.hasOwnProperty('views') && Array.isArray(rule.views)) {
      rule.views.sort(_ux_index_js__WEBPACK_IMPORTED_MODULE_3__/* .orderSorter */ .Y3);
      rule.views.forEach(function (_view) {
        // use R2L.converters.* to prefix functions
        var converterNames = Object.keys(_utils_converters_js__WEBPACK_IMPORTED_MODULE_4__/* .converters */ .m).sort(function (a, b) {
          return a.length > b.length ? -1 : 1;
        });
        if (_view.template !== "function(){return '{{ $match }}';}") {
          if (typeof _view.template === 'string') {
            converterNames.forEach(function (converterName) {
              _view.template = _view.template.replace(new RegExp('(?<!\\.)' + converterName + '\\(', 'g'), 'R2L.converters.' + converterName + '(');
            });
          }
          try {
            eval(' _view.template = function(){ return (' + _view.template + ').apply(this, arguments);}');
          } catch (e) {
            console.error(e);
            throw e;
          }
        } else {
          _view.template = function () {
            return arguments;
          };
        }
        if (_view.hasOwnProperty('condition')) {
          if (typeof _view.condition === 'string') {
            converterNames.forEach(function (converterName) {
              _view.condition = _view.condition.replace(new RegExp('(?<!\\.)' + converterName + '\\(', 'g'), 'R2L.converters.' + converterName + '(');
            });
          }
          try {
            eval('_view.condition = function(){ return (' + (_view.condition ? _view.condition : 'function(){return true;}') + ').apply(this, arguments);}');
          } catch (e) {
            console.error(e);
            throw e;
          }
        } else {
          _view.condition = function () {
            return true;
          };
        }
      });
    }
    rule.compiled = true;
    return rule;
  };
  R2L.applyRule = function (text, rule, overrideTitle, wholeMatch, history, overrideMatches) {
    var rawReference = text.trim();
    wholeMatch = wholeMatch.trim();
    var p = rule.pattern.source;
    if (rule.forced) {
      p = '(?:' + rule.type + '\\s*\\[\\s*(?:' + p + '(?:\\s*\\|\\s*(?:[^\\]]+))?' + ')\\s*\\])';
    }
    var pattern = new RegExp(p, 'gm' + (rule.casesensitive ? '' : 'i')),
      args = overrideMatches ? overrideMatches : pattern.exec(rawReference),
      ref2link = {
        rule: rule,
        match: rawReference,
        views: {},
        alternatives: [],
        matches: [],
        offsets: [],
        counter: 0,
        reference: text,
        link: overrideTitle || text,
        wholeMatch: wholeMatch || text
      };
    if (!args) {
      return null;
    }
    ref2link.reference = args[1];
    ref2link.matches = args;
    if (history.length > 0) {
      for (var index = history.length - 1; index >= 0; index--) {
        var listRef = (0,_utils_list_js__WEBPACK_IMPORTED_MODULE_7__/* .getListCore */ .Ku)(history[index].rule, history[index].matches);
        if (listRef.length > 0) {
          (0,_utils_list_js__WEBPACK_IMPORTED_MODULE_7__/* .cloneListCore */ .nH)(history[index], ref2link);
          (0,_utils_list_js__WEBPACK_IMPORTED_MODULE_7__/* .cloneListIdentifiers */ .ck)(history[index], ref2link);
          break;
        }
      }
      args = ref2link.matches;
    }

    /** Could be an inverted list so if the item still has no prefix/data don't bother */
    if (rule.isListItem) {
      var listRef = (0,_utils_list_js__WEBPACK_IMPORTED_MODULE_7__/* .getListCore */ .Ku)(rule, ref2link.matches);
      if (listRef.length === 0) {
        /** Cannot render item, we need to get to the end of the list */
        return ref2link;
      }
    }
    rule.views.sort(_ux_index_js__WEBPACK_IMPORTED_MODULE_3__/* .orderSorter */ .Y3);
    var contextObj = {
      data: {}
    };
    rule.views.forEach(function (_view) {
      var viewName = _view.target;
      var isEnabled = ((0,_utils_functions_js__WEBPACK_IMPORTED_MODULE_6__/* .intersect */ .y$)(R2L.filters.environments, _view.environments).length || _view.environments.indexOf('*') >= 0) && (!R2L.filters.targets || !R2L.filters.targets.length || R2L.filters.targets.indexOf(_view.target) >= 0) && (!R2L.filters.types || !R2L.filters.types.length || R2L.filters.types.indexOf(rule.type) >= 0);

      // Check if there are any custom target options to be applied
      var _currentViewAttributes = R2L.getViewAttributes(_view.baseTarget || _view.target);
      if (isEnabled && _view.condition.apply(contextObj, args)) {
        ref2link.views[viewName] = _view.template.apply(contextObj, args);

        // append the attributes of the view to the args so they can be subsequently reused
        var attributes = (0,_utils_functions_js__WEBPACK_IMPORTED_MODULE_6__/* .extractAttributes */ .pt)(Object.values(ref2link.views));
        Object.keys(attributes).forEach(function (key) {
          var cleanKey = key.replace('data-ref-', '');
          cleanKey = cleanKey.replace('data-', '');
          contextObj.data[cleanKey] = attributes[key];
        });

        /**                
         * keep a map of initial match and what was rendered
         * han and curiaj rule render something different than it matches
         */
        var $rendered = (0,_jquery_js__WEBPACK_IMPORTED_MODULE_0__.$)('<div></div>').append(ref2link.views[viewName]),
          renderedText;
        $rendered.find(R2L.settings.classSimple).each(function () {
          var $view = (0,_jquery_js__WEBPACK_IMPORTED_MODULE_0__.$)(this);
          $view.addClass(R2L.settings.generatedClassName);
          $view.attr('id', 'r2l-' + (0,_utils_functions_js__WEBPACK_IMPORTED_MODULE_6__/* .getUuid */ .YJ)());
          R2L.linkClassName && $view.addClass(R2L.linkClassName);
          if (R2L.viewUsesTarget) {
            ($view.is(R2L.settings.classSimple) ? $view : $view.find(R2L.settings.classSimple)).attr('target', '_blank');
          } else {
            ($view.is(R2L.settings.classSimple) ? $view : $view.find(R2L.settings.classSimple)).removeAttr('target');
          }
          if ((R2L.viewTitlePrefix || R2L.viewTitleSuffix) && $view.attr('title')) {
            var titleParts = [(R2L.viewTitlePrefix || '').toString(), $view.attr('title').toString(), (R2L.viewTitleSuffix || '').toString()];
            $view.attr('title', titleParts.join(' ').trim());
          }
          if (overrideTitle) {
            ($view.is(R2L.settings.classSimple) ? $view : $view.find(R2L.settings.classSimple)).html(overrideTitle);
          }
          $view.attr(R2L.settings.dataInitialAttribute, wholeMatch);
          if (_currentViewAttributes && _typeof(_currentViewAttributes) === 'object') {
            Object.keys(_currentViewAttributes).forEach(function (key) {
              $view.attr(key, _currentViewAttributes[key]);
            });
          }
        });
        ref2link.views[viewName] = $rendered.html();
        ref2link.alternatives.push({
          rule: _objectSpread(_objectSpread({}, rule), {
            pattern: null,
            fullPattern: null
          }),
          view: ref2link.views[viewName],
          viewName: viewName,
          match: text,
          order: _view.order,
          common: _view.common,
          groupTarget: _view.groupTarget,
          reference: args[1],
          link: overrideTitle || text,
          wholeMatch: wholeMatch || text
        });
        renderedText = overrideTitle || $rendered.find('[href]').text();
        R2L.globalViews[renderedText] = wholeMatch || text;
      }
    });
    return ref2link;
  };
  R2L.getGlobalMatch = function (match, context) {
    return this.globalMatches[context] && this.globalMatches[context][match] ? this.globalMatches[context][match] : {};
  };
  R2L.setGlobalMatches = function (matches) {
    var _this2 = this;
    Object.keys(matches).forEach(function (_match) {
      var offsets = matches[_match] ? matches[_match].offsets : [];
      for (var i = 0; i < offsets.length; i++) {
        var offset = offsets[i];
        if (!_this2.globalMatches[offset.context]) {
          _this2.globalMatches[offset.context] = {};
        }

        /** Deep clone the match **/
        var newMatch = {
          alternatives: offset.alternatives,
          views: offset.views,
          context: offset.context,
          rule: _objectSpread(_objectSpread({}, matches[_match].rule), {
            pattern: null,
            fullPattern: null
          }),
          //without patterns
          match: matches[_match].match,
          offsets: matches[_match].offsets,
          reference: matches[_match].reference
        };
        _this2.globalMatches[offset.context][offset.match] = newMatch;
      }
    });
  };
  try {
    R2L.addRules(JSON.parse(_utils_lzstring_js__WEBPACK_IMPORTED_MODULE_5__/* ["default"] */ .A.decompressFromBase64(R2L.getConstant("R2L_TYPED_RULES"))));
  } catch (e) {
    console.error(e);
  }
}

/***/ }),

/***/ 577:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Ku: () => (/* binding */ getListCore),
/* harmony export */   T8: () => (/* binding */ cloneCoreIdentifiers),
/* harmony export */   ak: () => (/* binding */ getCoreIdentifiers),
/* harmony export */   ck: () => (/* binding */ cloneListIdentifiers),
/* harmony export */   eJ: () => (/* binding */ getOffsetMap),
/* harmony export */   nH: () => (/* binding */ cloneListCore),
/* harmony export */   ts: () => (/* binding */ getListIdentifiers)
/* harmony export */ });
/* unused harmony exports getListShared, getListVars, getListSkips, getSubpartIdentifiers */
/**
 * Utility functions that operate on `list` rules. 
 * 
 * List rules are the rules that capture lists of subdivisions (EU legal acts, treaties). 
 * Example:
 *     articles 101 and 102 of the TFEU    # The engine will detect 2 nodes: `articles 101`, `102 of the TFEU`
 * 
 * Within a reference block containing multiple nodes (subdivision), some will capture more information than others, which means the data needs to be shared between the items.
 * In our example above, the first node `articles 101` does not 'know' we are referring to the TFEU treaty, hence why we need to share the information from the second item to the first.
 * 
 * Data will be shared between nodes based on the `list-prefix` / `list-shared` / `list-identifiers` / `list-vars` / `list-skip` attributes of the XML rule declaration.
 * Only particular offsets should be shared in order to ensure consistency. In the example below: 
 * 
 *     Article 25(6), (7) and (8) of Regulation (EU) 2018/1725
 * 
 *     Detects 3 nodes: 
 *         `Article 25(6)`             # Contains 'article' and 'paragraph' information, but is missing act type/year/number (Regulation/2018/1725);
 *         `(7)`                       # Contains 'paragraph' information, needs 'article' information from node #1 and act type/year/number from node #3;
 *         `(8) of Regulation (EU) 2018/1725` # Contains all information except the 'article' number from node #1;
 * 
 * Note that data needs to be shared between both left-hand nodes and right-hand nodes. 
 * 
 * In the example above, the attributes should be defined as follows:
 *   - `list-prefix` offsets should point to the capture group of the act label: "Regulation";
 *      This data is always copied between nodes;
 * 
 *   - `list-shared` offsets should point to the year and number of the act: "2018" and "1725";
 *      This data is copied only when missing from target nodes;
 * 
 *   - `list-identifiers` offsets should point to the article number: "25";
 *      All division-specific (article/annex and deeper) offsets are identifiers. This data is copied only when missing from target nodes;
 * 
 *   - `list-vars` offsets are a sub-part of identifier offsets, used for nodes which are ambiguous, like a single number. Examples: 
 *        - articles 2, 3 and 4 of TFUE;           # '3' is a variable offset, representing an article number
 *        - article 1 paragraph 2, 3 and 4 of TFUE   # '4' is a variable offset, representing a paragraph number
 * 
 *      Special treatment is required to evaluate what subdivision level a variable offset represents;
 * 
 *   - `list-skip` offsets are used to skip certain identifier offsets from copying left or right;
 *       
 */

/**
 * Copy the identifiers of a subpart - Exclude point level
 * @param {Object} sourceRef match object 
 * @param {Object} destRef match object
 *
 * @returns {Boolean} result
 */
function cloneCoreIdentifiers(sourceRef, destRef) {
  var sourceIds = getSubpartIdentifiers(sourceRef.rule, sourceRef.matches);
  var coreIndexes = sourceRef.rule.coreIdentifiers ? String(sourceRef.rule.coreIdentifiers).split(" ") : [];
  var destVar = null;
  var destVars = getListVars(destRef.rule, destRef.matches);

  /* Constructs like "32.4" number.number (SV) should not clone identifiers */
  if (/^\d+\.\d+/.test(sourceRef.matches[0])) {
    return true;
  }

  /* Constructs with brackets like "13(b)" article(point letter) should not clone identifiers */
  if (destVars.length === 1 && !/^\d+\([a-z0-9]+\)/.test(destRef.matches[0])) {
    destVar = destVars[0].match;
    destRef.matches[parseInt(destVars[0].index)] = undefined;
  }
  var filteredSourceVars = [];
  for (var i = 0; i < sourceIds.length; i++) {
    if (coreIndexes.indexOf(sourceIds[i].index) !== -1) {
      filteredSourceVars.push(sourceIds[i]);
    } else {
      if (destVar) {
        destRef.matches[parseInt(sourceIds[i].index)] = destVar;
      }
    }
  }
  for (var i = 0; i < filteredSourceVars.length; i++) {
    if (!destRef.matches[parseInt(filteredSourceVars[i].index)]) {
      destRef.matches[parseInt(filteredSourceVars[i].index)] = filteredSourceVars[i].match;
    }
  }
  return true;
}

/**
 * Adjust destRef identifiers in case of standalone numbers by merging with source
 * @param {Object} sourceRef match object 
 * @param {Object} destRef match object
 *
 * @returns {Boolean} result
 */
function cloneListIdentifiers(sourceRef, destRef) {
  if (!sourceRef.rule || !sourceRef.rule.type) {
    return false;
  }
  var destVars = getListVars(destRef.rule, destRef.matches);
  var destCoreIds = getListCore(destRef.rule, destRef.matches);
  var destIds = getListIdentifiers(destRef.rule, destRef.matches);
  destIds = destIds.filter(function (id) {
    return id.type === 'identifiers';
  });

  // default behavior "article 5 paragraphs 3 and 4" (copy-right)
  if (destVars.length === 1 && destIds.length === 1) {
    /* This match has variable offsets, meaning we need the context from source
     * Merge the variable value into the matches of the source. 
     */

    /* Don't overwrite prefix data */
    var sourceIds = getSubpartIdentifiers(sourceRef.rule, sourceRef.matches);
    var skipVars = getListSkips(sourceRef.rule, sourceRef.matches);
    var skipIndexes = skipVars.map(function (skipVar) {
      return skipVar.index;
    });

    /** 
     * If the source looks like this: "article 15 (4)" or "article 16(b)" then we need to analyse the destination 
     * in order to find the correct offsets
     */
    if (/\d{1,6}\s?\(([a-z]|[0-9]+)\)/.test(sourceRef.matches[0])) {
      /**
       * Constructs with brackets like "article 3(12) and 4 of Dir 497/2018" should not clone identifiers 
       */
      if (/^\d{1,6}(\(\w\))?$/.test(destRef.matches[0])) {
        // include all but the first sourceId as skip indexes
        for (var skipIndex = 1; skipIndex < sourceIds.length; skipIndex++) {
          skipIndexes.push(sourceIds[skipIndex].index);
        }
      }
    }

    /** If the raw reference (destination) is wrapped in brackets eg "art. 14(3) and (4)" we don't use skip vars */
    if (/^\(\d{1,6}(?:[a-z])?\)/.test(destRef.matches[0].trim())) {
      skipIndexes = [];
    }

    /** 
     * If the raw reference is a letter we don't use skip vars as it will be last-level
     * Example: article 15 point a) and b)
     */
    if (/^\(?[a-z]/.test(destRef.matches[0])) {
      skipIndexes = [];
    }

    /** 
     * Source constructs like article.paragraph should be handled differently. 
     * All raw subparts after them should be 1st level (SV) 
     */
    if (/\d{1,6}\.[a-nA-N0-9]/.test(sourceRef.matches[0])) {
      for (var _skipIndex = 1; _skipIndex < sourceIds.length; _skipIndex++) {
        skipIndexes.push(sourceIds[_skipIndex].index);
      }
    }
    var filteredSourceIds = sourceIds.filter(function (sourceId) {
      return skipIndexes.indexOf(sourceId.index) === -1;
    });
    if (filteredSourceIds.length > 0) {
      destRef.matches[parseInt(destVars[0].index)] = undefined;

      /** 
       * Find a position to insert the variable. 
       * Usually it's last level eg. article 5 paragraphs 1 and 2
       * Sometimes it's one to the left eg. article 5 paragraphs 1(a) and 2(b)
       * If there is a mismatch between type (letter vs number) we can move one position to the left
       */
      var selectedSlot = filteredSourceIds.length - 1;
      if (filteredSourceIds.length > 1 && /\d+/.test(destVars[0].match) && /[a-z]/.test(filteredSourceIds[filteredSourceIds.length - 1].match)) {
        selectedSlot--;
        filteredSourceIds.splice(-1, 1);
      }
      filteredSourceIds[selectedSlot].match = destVars[0].match;
      for (var i = 0; i < filteredSourceIds.length; i++) {
        destRef.matches[parseInt(filteredSourceIds[i].index)] = filteredSourceIds[i].match;
      }
    }
  }

  // right-hand element needs core matches and identifiers
  // REFTOLINK-1184
  if (destIds.length === 0 && destVars.length === 0) {
    var sourceIds = getSubpartIdentifiers(sourceRef.rule, sourceRef.matches);
    for (var i = 0; i < sourceIds.length; i++) {
      destRef.matches[parseInt(sourceIds[i].index)] = sourceIds[i].match;
    }
  }
  return true;
}
;

/**
 * Copy prefix matches from one object to the other
 * @param {Object} sourceRef match object 
 * @param {Object} destRef match object
 *
 * @returns {Boolean} result
 */
function cloneListCore(sourceRef, destRef) {
  if (!sourceRef.rule || !sourceRef.rule.type || !sourceRef.rule.prefix) {
    return false;
  }
  var indexes;
  var listRef = getListCore(destRef.rule, destRef.matches);
  if (listRef.length === 0 && sourceRef.rule.prefix) {
    var indexes = String(sourceRef.rule.prefix).split(" ");
    for (var i = 0; i < indexes.length; i++) {
      if (typeof sourceRef.matches[indexes[i]] === "string" && typeof destRef.matches[indexes[i]] === "undefined") {
        destRef.matches[indexes[i]] = sourceRef.matches[indexes[i]];
      }
    }
  }
  var sharedRef = getListShared(destRef.rule, destRef.matches);
  if (sharedRef.length === 0 && sourceRef.rule.shared) {
    indexes = String(sourceRef.rule.shared).split(" ");
    for (var i = 0; i < indexes.length; i++) {
      if (typeof sourceRef.matches[indexes[i]] === "string" && typeof destRef.matches[indexes[i]] === "undefined") {
        destRef.matches[indexes[i]] = sourceRef.matches[indexes[i]];
      }
    }
  }
  return true;
}
;

/**
 * Get map of offsets for lists
 * @param {Array<Object>} references
 * 
 * @returns {Object} map of full list matches
 */
function getOffsetMap(references) {
  var allOffsets = {};
  for (var i = 0; i < references.length; i++) {
    if (!Array.isArray(references[i].offsets)) {
      continue;
    }
    for (var j = 0; j < references[i].offsets.length; j++) {
      if (!allOffsets[references[i].offsets[j].context]) {
        allOffsets[references[i].offsets[j].context] = new Array();
      }
      allOffsets[references[i].offsets[j].context].push(references[i].offsets[j]);
    }
  }
  return allOffsets;
}
;

/**
 * Get base list information from the matches.
 * 
 * @param {Object} rule
 * @param {Array<String>} matches
 * 
 * @returns {Array<String>} 
 */
function getListCore(rule, matches) {
  var arr = new Array();
  if (rule.prefix) {
    rule.prefix = String(rule.prefix);
    var indexes = rule.prefix.split(" ");
    for (var i = 0; i < indexes.length; i++) {
      if (matches[indexes[i]]) {
        arr.push({
          'index': indexes[i],
          'match': matches[indexes[i]],
          'type': 'prefix'
        });
      }
    }
  }
  return arr;
}
;

/**
 * Get shared list information from the matches.
 * 
 * @param {Object} $rule
 * @param {Array<String>} matches
 * 
 * @returns {Array<String>} 
 */
function getListShared(rule, matches) {
  var arr = new Array();
  if (rule.shared) {
    rule.shared = String(rule.shared);
    var indexes = rule.shared.split(" ");
    for (var i = 0; i < indexes.length; i++) {
      if (matches[indexes[i]]) {
        arr.push({
          'index': indexes[i],
          'match': matches[indexes[i]],
          'type': 'shared'
        });
      }
    }
  }
  return arr;
}
;
function getCoreIdentifiers(rule, matches) {
  var arr = new Array();
  if (rule.coreIdentifiers) {
    rule.coreIdentifiers = String(rule.coreIdentifiers);
    var indexes = rule.coreIdentifiers.split(" ");
    for (var i = 0; i < indexes.length; i++) {
      if (matches[indexes[i]]) {
        arr.push({
          'index': indexes[i],
          'match': matches[indexes[i]],
          'type': 'core-identifiers'
        });
      }
    }
  }
  return arr;
}
;

/**
 * Get variables list information from the matches.
 * 
 * @param {Object} rule
 * @param {Array<String>} matches
 * 
 * @returns {Array<String>} 
 */
function getListVars(rule, matches) {
  var arr = new Array();
  if (rule.vars) {
    rule.vars = String(rule.vars);
    var indexes = rule.vars.split(" ");
    for (var i = 0; i < indexes.length; i++) {
      if (matches[indexes[i]]) {
        arr.push({
          'index': indexes[i],
          'match': matches[indexes[i]],
          'type': 'vars'
        });
      }
    }
  }
  return arr;
}
;

/**
 * Get skip list information from the matches.
 * 
 * @param {Object} $rule
 * @param {Array<String>} matches
 * 
 * @returns {Array<String>} 
 */
function getListSkips(rule, matches) {
  var arr = new Array();
  if (rule.skip) {
    rule.skip = String(rule.skip);
    var indexes = rule.skip.split(" ");
    for (var i = 0; i < indexes.length; i++) {
      if (matches[indexes[i]]) {
        arr.push({
          'index': indexes[i],
          'match': matches[indexes[i]],
          'type': 'skip'
        });
      }
    }
  }
  return arr;
}
;

/**
 * Get subpart specific information from the matches
 * @param {Object} $rule
 * @param {Array<String>} matches
 * 
 * @returns {Array<String>} 
 */
function getSubpartIdentifiers(rule, matches) {
  var arr = new Array();
  if (rule.identifiers) {
    rule.identifiers = String(rule.identifiers);
    var indexes = rule.identifiers.split(" ");
    for (var i = 0; i < indexes.length; i++) {
      if (matches[indexes[i]]) {
        arr.push({
          'index': indexes[i],
          'match': matches[indexes[i]],
          'type': 'identifiers'
        });
      }
    }
  }
  return arr;
}
;

/**
 * Get list-item specific information from the matches
 * @param {Object} rule
 * @param {Array<String>} matches
 * 
 * @returns {Array<String>} 
 */
function getListIdentifiers(rule, matches) {
  var arr = new Array();
  if (rule.shared) {
    rule.shared = String(rule.shared);
    var indexes = rule.shared.split(" ");
    for (var i = 0; i < indexes.length; i++) {
      if (matches[indexes[i]]) {
        arr.push({
          'index': indexes[i],
          'match': matches[indexes[i]],
          'type': 'shared'
        });
      }
    }
  }
  if (rule.identifiers) {
    rule.identifiers = String(rule.identifiers);
    var indexes = rule.identifiers.split(" ");
    for (var i = 0; i < indexes.length; i++) {
      if (matches[indexes[i]]) {
        arr.push({
          'index': indexes[i],
          'match': matches[indexes[i]],
          'type': 'identifiers'
        });
      }
    }
  }
  return arr;
}
;

/***/ }),

/***/ 588:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AB: () => (/* binding */ getFullTitle),
/* harmony export */   An: () => (/* binding */ getAllViewTargetMap),
/* harmony export */   DJ: () => (/* binding */ buildDocumentObject),
/* harmony export */   EG: () => (/* binding */ extractOrderedAttributes),
/* harmony export */   J1: () => (/* binding */ cleanAttributes),
/* harmony export */   J2: () => (/* binding */ normalizeString),
/* harmony export */   Rl: () => (/* binding */ cleanMatches),
/* harmony export */   T0: () => (/* binding */ getNonCapturingPattern),
/* harmony export */   UJ: () => (/* binding */ supportNegativeLookbehind),
/* harmony export */   VC: () => (/* binding */ getLookAhead),
/* harmony export */   Wq: () => (/* binding */ getLookBehind),
/* harmony export */   YJ: () => (/* binding */ getUuid),
/* harmony export */   YW: () => (/* binding */ getTextNodesIn),
/* harmony export */   Zn: () => (/* binding */ escapeHTML),
/* harmony export */   fI: () => (/* binding */ regExpEscape),
/* harmony export */   kS: () => (/* binding */ hasTags),
/* harmony export */   oY: () => (/* binding */ buildAttributesData),
/* harmony export */   pZ: () => (/* binding */ indent),
/* harmony export */   pn: () => (/* binding */ sanitizeHtml),
/* harmony export */   pt: () => (/* binding */ extractAttributes),
/* harmony export */   q5: () => (/* binding */ simpleParse),
/* harmony export */   q6: () => (/* binding */ extractUrls),
/* harmony export */   v3: () => (/* binding */ delimiter2RegExp),
/* harmony export */   wh: () => (/* binding */ getBaseTargetName),
/* harmony export */   y$: () => (/* binding */ intersect),
/* harmony export */   zP: () => (/* binding */ getReferences)
/* harmony export */ });
/* unused harmony exports xmlEscape, matchIdentity, identity, mergeMatches */
/* harmony import */ var _jquery_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(953);
/* harmony import */ var _ux_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(246);
/* harmony import */ var _settings_index_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(265);
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }



function regExpEscape(pattern) {
  return pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
;
function xmlEscape(unsafe) {
  return unsafe.replace(/[<>&'"]/g, function (c) {
    switch (c) {
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '&':
        return '&amp;';
      case '\'':
        return '&apos;';
      case '"':
        return '&quot;';
    }
  });
}
function supportNegativeLookbehind() {
  try {
    var r = new RegExp("(?<!1)");
    return true;
  } catch (e) {
    return false;
  }
}
;
function intersect(a, b) {
  var t;
  if (b.length > a.length) t = b, b = a, a = t; // indexOf to loop over shorter
  return a.filter(function (e) {
    return b.indexOf(e) > -1;
  });
}
;
function getLookBehind(pattern) {
  return supportNegativeLookbehind() ? '(?<!' + pattern + ')' : '';
}
;
function getLookAhead(pattern) {
  return '(?!' + pattern + ')';
}
;
function delimiter2RegExp(delimiter) {
  var expr = null;
  if (Object.prototype.toString.call(delimiter) !== "[object RegExp]") {
    if (R2L.getNamedRule(delimiter)) {
      expr = R2L.getNamedRule(delimiter).pattern;
    }
    if (!expr && delimiter) {
      if (delimiter[0] === '/' && delimiter.length > 1) {
        var parts = delimiter.split('/');
        parts.shift();
        var modifiers = parts.pop();
        expr = new RegExp(parts.join('/'), modifiers);
      }
    }
    if (!expr && delimiter) {
      expr = new RegExp(regExpEscape(delimiter), 'gi');
    }
  } else {
    expr = delimiter;
  }
  return expr;
}
;
var _div;
/**
 * Sanitizes a string to make sure it does not contain HTML markup;
 * @param {String} str 
 * @returns {String} HTML encoded string
 */
function sanitizeHtml(str) {
  str = String(str);
  // reuse DOM Element instead of creating a new one every time this function is called
  _div = _div || document.createElement('div');
  _div.innerHTML = str;
  return _div.textContent;
}
function simpleParse(tpl, data) {
  return tpl.replace(/\{\{\s*\$([^}]{1,50}?)\s*\}\}/ig, function (match, varName) {
    return varName && data.hasOwnProperty(varName) ? data[varName] : '';
  });
}
;
function getNonCapturingPattern(pattern) {
  return pattern.replace(/\((?!\?[<!=:])/g, function (match, position) {
    if (position > 3) {
      if (pattern[position - 3] + pattern[position - 2] + pattern[position - 1] === '(?=') {
        return match;
      }
    }
    if (position == 0 || position > 0 && pattern[position - 1] !== '\\') {
      return '(?:';
    }
    return match;
  });
}
;
function matchIdentity() {
  var match = {
      count: this.counter,
      match: this.match,
      wholeMatch: this.wholeMatch,
      type: this.rule.type,
      label: this.rule.ruleLibelle,
      views: [],
      rule: this.rule
    },
    renderedViews = [];
  this.alternatives.sort(orderSorter);
  var defaultRendered = false;
  this.alternatives.reverse.forEach(function (_alternative) {
    if (_alternative.viewName == '_default' || !String(_alternative.view || '').trim() || renderedViews.indexOf(_alternative.view) >= 0) {
      return;
    }
    match.views.push({
      target: _alternative.viewName,
      view: _alternative.view,
      _default: !defaultRendered,
      order: _alternative.order
    });
    defaultRendered = true;
    renderedViews.push(_alternative.view);
  });
  return match;
}
function identity(inTextMatches) {
  var result = [];
  Object.keys(inTextMatches || {}).forEach(function (_matchKey) {
    result.push(matchIdentity.call(inTextMatches[_matchKey]));
  });
  return result;
}
;
function getReferences() {
  var $this = (0,_jquery_js__WEBPACK_IMPORTED_MODULE_0__.$)(this),
    inTextMatches = {},
    $ref2links = $this.find(".".concat(_settings_index_js__WEBPACK_IMPORTED_MODULE_2__/* .settings */ .W0.generatedClassName));
  ;
  if (!$ref2links.length && !(0,_jquery_js__WEBPACK_IMPORTED_MODULE_0__.$)($this).attr(_settings_index_js__WEBPACK_IMPORTED_MODULE_2__/* .settings */ .W0.parsedAttribute)) {
    // parsing should already have happened
    return {};
  }
  $ref2links.each(function () {
    var reference = (0,_jquery_js__WEBPACK_IMPORTED_MODULE_0__.$)(this).getRef2linkMatch();
    if (!reference || !reference.reference) {
      return;
    }
    if (!inTextMatches.hasOwnProperty(reference.reference)) {
      inTextMatches[reference.reference] = Object.assign({}, reference);
      inTextMatches[reference.reference].counter = 0;
    } else {
      // the reference offsets should already be grouped, but not in the case of aliases
      reference.offsets.forEach(function (offset) {
        var existing = inTextMatches[reference.reference].offsets.filter(function (o) {
          return o.position === offset.position;
        }).length > 0;
        if (!existing) {
          inTextMatches[reference.reference].offsets.push(offset);
        }
      });
    }
    inTextMatches[reference.reference].counter++;
  });
  return inTextMatches;
}
;
function mergeMatches(matches1, matches2) {
  Object.keys(matches1).forEach(function (key) {
    if (matches2[key]) {
      // add offsets
      matches1[key].offsets = matches1[key].offsets.concat(matches2[key].offsets);
      matches1[key].counter += matches2[key].counter;
    }
  });
  return _objectSpread(_objectSpread({}, matches2), matches1);
}
function buildAttributesData(attributesList) {
  var data = {};
  // custom handling for CELEX ids
  var celexIds = [];
  attributesList.forEach(function (attrItem) {
    var attrKey = attrItem.key;
    var attrValue = attrItem.value;
    var key = attrKey.replace("data-ref-", "");
    key = key.replace("data-", "");

    // a ref might have multiple (CELEX) ids (celex-1, celex-2 ...), add them all to an array
    if (key.match(/celex-\d+$/)) {
      celexIds.push(attrValue);
    } else {
      data[key] = attrValue;
      // add main celex id if any
      if (key === 'celex') {
        celexIds.push(data[key]);
      }
    }
  });
  if (celexIds.length > 0) {
    data['celexIds'] = celexIds.filter(function (value, index, array) {
      return array.indexOf(value) === index;
    });
    //REFTOLINK-1474
    data['celex'] = celexIds[0];
  }
  return data;
}

/**
 * Returns an ordered list of attribute data
 * @param {Array<Object>} alternatives 
 * @returns {Array<Object}
 */
function extractOrderedAttributes(alternatives) {
  var attributes = [];
  var keys = [];
  alternatives.forEach(function (alternative) {
    if (alternative.viewName === "table") {
      return;
    }
    var view = alternative.view || "";
    if (!view) {
      return;
    }

    // extract attributes from HTML using a REGEX
    var regex = /\s(data-(?:[^=]+))="([^"]+)"/gi;
    var result;
    while ((result = regex.exec(view)) !== null) {
      if (!result) {
        continue;
      }
      var name = result[1] || "";
      var value = result[2] || "";
      if (name.slice(0, 4) !== 'data') {
        continue;
      }
      if (!value || value === "null") {
        continue;
      }
      if (keys.indexOf(name) === -1 && ['data-debug', 'data-ref2link-initial', 'data-ref2link-context'].indexOf(name) === -1) {
        attributes.push({
          key: name,
          value: value
        });
        keys.push(name);
      }
    }
  });
  return attributes;
}
function extractUrls(views) {
  var urls = [];
  Object.keys(views).forEach(function (_view) {
    if (_view === "table") {
      return;
    }
    var view = views[_view];
    if (!view) {
      return;
    }

    // extract attributes from HTML using a REGEX
    var regex = /\shref="([^"]+)"/gi;
    var result;
    while ((result = regex.exec(view)) !== null) {
      if (!result) {
        continue;
      }
      var url = result[1] || "";
      if (url) {
        urls.push(url);
      }
    }
  });
  return urls;
}
;

/**
 * Extract data-* attributes from views
 * @param {Array<Object>} views 
 * 
 * @returns {Object} map of attr => values
 */
function extractAttributes(views) {
  var attributes = {};
  Object.keys(views).forEach(function (_view) {
    if (_view === "table") {
      return;
    }
    var view = views[_view];
    if (!view) {
      return;
    }

    // extract attributes from HTML using a REGEX
    var regex = /\s(data-(?:[^=]+))="([^"]+)"/gi;
    var result;
    while ((result = regex.exec(view)) !== null) {
      if (!result) {
        continue;
      }
      var name = result[1] || "";
      var value = result[2] || "";
      if (name.slice(0, 4) !== 'data') {
        continue;
      }
      if (!value || value === "null") {
        continue;
      }
      if (['data-debug', 'data-ref2link-initial', 'data-ref2link-context'].indexOf(name) === -1) {
        attributes[name] = value;
      }
    }
  });
  return attributes;
}
;

/**
 * Remove CELEX suffixes `-0`, `-1` from attributes `data-ref-celex-0`, `data-ref-celex-1` ...
 * @param {Object} attributes
 * 
 * @return {Object}  
 */
function cleanAttributes(attributes) {
  var newAttributes = {};
  Object.keys(attributes).reverse().forEach(function (key) {
    newAttributes[key.replace(/-\d+$/, '')] = attributes[key];
  });
  return newAttributes;
}

/**
 * Remove top-level match info as we manage the data using the offsets property
 * @param {Object} matches
 * @returns {Object} matches 
 */
function cleanMatches(matches) {
  Object.keys(matches).forEach(function (key) {
    matches[key].alternatives = null;
    matches[key].views = null;
    matches[key].startPosition = null;
    matches[key].rule = null;
    matches[key].matches = null;
  });
  return matches;
}
function indent(indent, text) {
  return ' '.repeat(2 * indent) + text + '\r\n';
}
function getUuid() {
  return 'xxxx-xxxx-xxxx-xxxx'.replace(/[x]/g, function (c) {
    var r = Math.floor(Math.random() * 16);
    return r.toString(16);
  });
}
function escapeHTML(text) {
  return (0,_jquery_js__WEBPACK_IMPORTED_MODULE_0__.$)('<div><div>').text(text).html();
}

/**
 * Check if a string is HTML/XML by looking for ending tags. 
 * Parsing the string using DOMParser might return false positives by randomly using `<` or `>` tags.
 * Example: "He said <hello world>!" 
 * @param {String} str 
 * @returns {Boolean}
 */
function hasTags(str) {
  // remove <ref2link-object> tags first
  var regex = /<ref2link-object oid="N\d+N"><\/ref2link-object>/g;
  str = str.replace(regex, '');

  // detects closing tags: </element>
  var hasClosingTags = /<\/[a-zA-Z]\w{0,12}([-_.:]\w{1,10})*\s*>/g.test(str);

  // detects self closing tabs: <element />
  var hasSelfClosingTags = /<[a-zA-Z]\w{0,12}([-_.:]\w{1,10})*\s*\/>/g.test(str);
  return hasClosingTags || hasSelfClosingTags;
}

/**
 * Returns the document element built from the input string (if valid HTML)
 * 
 * @param {String} str 
 * @returns {HTMLElement|null}
 */
function buildDocumentObject(str) {
  if (!window || !global || !global.window) {
    return null;
  }
  try {
    var doc = new (window || global.window).DOMParser().parseFromString(str, "text/html");
    var hasNodes = Array.from(doc.body.childNodes).some(function (node) {
      return node.nodeType === 1;
    });
    return hasNodes ? doc : null;
  } catch (e) {
    console.error(e);
    return null;
  }
}
function getTextNodesIn(node, includeWhitespaceNodes) {
  var textNodes = [],
    nonWhitespaceMatcher = /\S/;
  function getTextNodes(node) {
    if (node.nodeType == 3) {
      if (includeWhitespaceNodes || nonWhitespaceMatcher.test(node.nodeValue)) {
        textNodes.push(node);
      }
    } else {
      for (var i = 0, len = node.childNodes.length; i < len; ++i) {
        // we don't parse anchor nodes as we cannot replace inside them
        if (node.localName !== "a") {
          getTextNodes(node.childNodes[i]);
        }
      }
    }
  }
  getTextNodes(node);
  return textNodes;
}
var _allTargets = {};

/**
 * Returns a map of `target: baseTarget` for easy lookups
 * @param {Boolean} refresh 
 * @returns {Object}
 */
function getAllViewTargetMap(refresh) {
  if (!refresh && Object.keys(_allTargets).length) {
    return _allTargets;
  }
  var rules = R2L.getAllRules();
  _allTargets = {};
  rules.forEach(function (rule) {
    rule.views.forEach(function (view) {
      _allTargets[view.target] = view.baseTarget;
    });
  });
  return _allTargets;
}
function getBaseTargetName(targetName) {
  var allViewTargets = getAllViewTargetMap();
  return allViewTargets[targetName] || targetName;
}

// if no grouping happens but it's part of a group we need to move the prefix in front
// Example: 'EUR-Lex to Judgement' => 'to EUR-Lex Judgement'
function getFullTitle(title, groupTarget) {
  var fullTitle = title;
  if (groupTarget && R2L.viewTitlePrefix) {
    var prefix = R2L.viewTitlePrefix + " ";
    if (title.indexOf(prefix) === 0) {
      fullTitle = prefix + groupTarget + " " + fullTitle.replace(prefix, "");
    }
  }
  return fullTitle;
}
function normalizeString(str) {
  return str.replace(/[εέ]/g, "[εέ]").replace(/[ύυ]/g, "[υύ]").replace(/[οό]/g, "[οό]").replace(/[ωώ]/g, "[ωώ]").replace(/[αά]/g, "[αά]").replace(/[ιί]/g, "[ιί]").replace(/[ηή]/g, "[ηή]").replace(/\n/g, " ").replace(/[aáãăâ]/g, "[aáãăâ]").replace(/[eéèê]/g, "[eéèê]").replace(/[iíîïì]/g, "[iíîïì]").replace(/[oóôõ]/g, "[oóôõ]").replace(/[sș]/g, "[sș]").replace(/[tț]/g, "[tț]").replace(/[uúü]/g, "[uúü]").replace(/[cç]/g, "[cç]");
}

/***/ }),

/***/ 819:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  Y0: () => (/* binding */ AliasManager),
  oM: () => (/* binding */ replaceAliasMatches),
  BS: () => (/* binding */ replaceAliases)
});

// UNUSED EXPORTS: calculateSubAlias, getCelexFullTitlesQuery

// EXTERNAL MODULE: ./src/lib/jquery.js
var jquery = __webpack_require__(953);
// EXTERNAL MODULE: ./src/lib/utils/functions.js
var functions = __webpack_require__(588);
// EXTERNAL MODULE: ./src/lib/settings/index.js
var settings = __webpack_require__(265);
// EXTERNAL MODULE: ./src/lib/utils/letters.js
var letters = __webpack_require__(228);
// EXTERNAL MODULE: ./src/lib/manager/index.js + 19 modules
var manager = __webpack_require__(33);
// EXTERNAL MODULE: ./src/lib/transformers/utils/index.js
var utils = __webpack_require__(358);
// EXTERNAL MODULE: ./src/lib/utils/processor.js
var processor = __webpack_require__(825);
// EXTERNAL MODULE: ./src/lib/utils/request.js
var request = __webpack_require__(948);
// EXTERNAL MODULE: ./src/lib/manager/ecas.js
var ecas = __webpack_require__(279);
// EXTERNAL MODULE: ./src/lib/translations/index.js + 1 modules
var translations = __webpack_require__(337);
;// ./src/lib/manager/data/treaty.js

var SHORT_TITLE_WITH_ARTICLE_TEMPLATE = {
  'EN': 'Article {{ TREATY_ARTICLE_NO }} {{ TREATY_ACRONYM }}',
  'FR': 'Article {{ TREATY_ARTICLE_NO }} {{ TREATY_ACRONYM }}',
  'DE': 'Artikel {{ TREATY_ARTICLE_NO }} {{ TREATY_ACRONYM }}'
};
var SHORT_TITLE_WITH_ANNEX_TEMPLATE = {
  'EN': 'Annex {{ TREATY_ANNEX_NO }} {{ TREATY_ACRONYM }}',
  'FR': 'Annexe {{ TREATY_ANNEX_NO }} {{ TREATY_ACRONYM }}',
  'DE': 'ANHANG {{ TREATY_ANNEX_NO }} {{ TREATY_ACRONYM }}'
};
var SHORT_TITLE_TEMPLATE = {
  'EN': '{{ TREATY_ACRONYM }}',
  'FR': '{{ TREATY_ACRONYM }}',
  'DE': '{{ TREATY_ACRONYM }}'
};
var TEU_TRANSLATIONS = {
  'EN': 'TEU',
  'FR': 'TUE',
  'DE': 'EUV'
};
var TEU_TRANSLATIONS_LONG = {
  'EN': 'Treaty on European Union',
  'FR': 'Traité sur l\'Union européenne',
  'DE': 'Vertrag über die Europäische Union'
};
var TFEU_TRANSLATIONS = {
  'EN': 'TFEU',
  'FR': 'TFUE',
  'DE': 'AEUV'
};
var TFEU_TRANSLATIONS_LONG = {
  'EN': 'Treaty on the Functioning of the EU',
  'FR': 'Traité sur le fonctionnement de l\'UE',
  'DE': 'Vertrag über die Arbeitsweise der EU'
};
var EURATOM_TRANSLATIONS = {
  'EN': 'EAEC',
  'FR': 'CEEA',
  'DE': 'EAG'
};
var EURATOM_TRANSLATIONS_LONG = {
  'EN': 'EAEC Treaty',
  'FR': 'traité CEEA',
  'DE': 'EAG-Vertrag'
};
var LISBON_TRANSLATIONS = {
  'EN': 'Treaty of Lisbon',
  'FR': 'Traité de Lisbonne',
  'DE': 'Vertrag von Lissabon'
};
var LISBON_TRANSLATIONS_LONG = LISBON_TRANSLATIONS;
var ECSC_TREATY = {
  'EN': 'ECSC',
  'FR': 'CECA',
  'DE': 'EGKS'
};
var ECSC_TREATY_LONG = {
  'EN': 'ECSC Treaty',
  'FR': 'traité CECA',
  'DE': 'EGKS-Vertrag'
};
function getAcronym(celexId, langISO2) {
  var root = String(celexId).slice(1, 6);
  var hasSubdivision = getAnnexNo(celexId) || getArticleNo(celexId);
  if (root === '2016M') {
    return hasSubdivision ? TEU_TRANSLATIONS[langISO2] : TEU_TRANSLATIONS_LONG[langISO2];
  }
  if (root === '2016E') {
    return hasSubdivision ? TFEU_TRANSLATIONS[langISO2] : TFEU_TRANSLATIONS_LONG[langISO2];
  }
  if (root === '2016A') {
    return hasSubdivision ? EURATOM_TRANSLATIONS[langISO2] : EURATOM_TRANSLATIONS_LONG[langISO2];
  }
  if (root === '2007L') {
    return hasSubdivision ? LISBON_TRANSLATIONS[langISO2] : LISBON_TRANSLATIONS_LONG[langISO2];
  }
  if (root === '1951K') {
    return hasSubdivision ? ECSC_TREATY[langISO2] : ECSC_TREATY_LONG[langISO2];
  }
  return null;
}
function getArticleNo(celexId) {
  var digits = String(celexId).slice(-3);
  if (/^\d+$/gi.exec(digits)) {
    return String(parseInt(digits));
  }
  return null;
}
function getAnnexNo(celexId) {
  var matches = /N(\d+)$/gi.exec(String(celexId));
  if (matches && matches[1]) {
    return String(parseInt(matches[1]));
  }
  return null;
}

/**
 * Returns a short title for an EU treaty, based on the CELEX id.
 * @param {String} celexId 
 * @param {String} langISO3
 * 
 * @return {String|null} 
 */
function getEUTreatyShortTitle(celexId, langISO3) {
  langISO3 = langISO3 || 'ENG';
  var langISO2 = (0,translations/* getISO2Lang */.GB)(langISO3);
  var articleNo = getArticleNo(celexId);
  var annexNo = getAnnexNo(celexId);
  var annexNoRoman = R2L.converters.toRoman(annexNo);
  var acronym = getAcronym(celexId, langISO2);
  var tmpl = SHORT_TITLE_TEMPLATE;
  if (articleNo) {
    tmpl = SHORT_TITLE_WITH_ARTICLE_TEMPLATE;
  }
  if (annexNoRoman) {
    tmpl = SHORT_TITLE_WITH_ANNEX_TEMPLATE;
  }
  if (acronym && tmpl[langISO2]) {
    return tmpl[langISO2].replace('{{ TREATY_ACRONYM }}', acronym).replace('{{ TREATY_ARTICLE_NO }}', articleNo).replace('{{ TREATY_ANNEX_NO }}', annexNoRoman);
  }
  return null;
}
;// ./src/lib/alias/index.js
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }











/**
 * The ALIAS feature tricks Ref2Link into detecting legal references in the text by applying the rules 
 *   on a different text than the original input text. Once detected, the engine will revert to the original (alias reference) instead of the captured reference and continues its processing pipeline.
 * 
 * Example: 
 *     Input text: `Article 3 of GDPR is now repealed`;
 *     ALIAS_MAP: { GDPR: "Regulation (EU) 2016/679" }     # We define here that `GDPR` in text actually means `Regulation (EU) 2016/679`
 * 
 *     Text that Ref2Link will process: `Article 3 of Regulation (EU) 2016/679 is now repealed`;  # GDPR has been replaced by the formal legal reference so that Ref2Link can detect it.
 *     Detected reference (includes subdivision): `Article 3 of Regulation (EU) 2016/679`
 *     Processed reference (includes subdivision): `Article 3 of GDPR`
 * 
 * Prerequisite:
 *    It is important to remember that Ref2Link processes input in 2 steps: 
 *        1. Apply regular expressions to the text and replace detected references with intermediary `<ref2link-object oid="*"></ref2link-object>` nodes.
 *           This allows the engine to isolate references and avoid overlapping;
 *        2. Replace all intermediary nodes with the final hyperlinks;
 *  
 * 
 * Enabling aliases adds extra steps to the pipeline. Here is how it works:
 * 
 * 1. Submit input text for processing;
 *    Example input text: `C-99/99 lorem ipsum GDPR`
 * 
 * 2. If the ALIAS feature is enabled and we have aliases defined we proceed with the ALIAS replacement - @see `replaceAliases` function:
 *    ALIAS_MAP = { GDPR: "Regulation (EU) 2016/679" }
 *    
 *    Text now becomes: `C-99/99 lorem ipsum Regulation (EU) 2016/679`;
 *     
 *    *If we have no aliases enabled we skip this step and move to step 6;
 * 
 * 3. Parse the text.
 *    Text now becomes: `<ref2link-object oid="1"></ref2link-object> lorem ipsum <ref2link-object oid="2"></ref2link-object>`;
 *    
 * 4. Process the results of the parse operation - replace the detected back-references with their aliases - @see `replaceAliasMatches` function
 * 
 * 5. Post-process the input text and replace all `<ref2link-object>` intermediary elements with hyperlinks;
 * 
 */

var WIKIDATA_ENDPOINT = "https://query.wikidata.org/sparql";

/**
* Aliases manager
* 
* Provides the API methods to get/set alias maps (key => value pairs)
* The manager also provides functionality to load Aliases from Wikidata, for a specific language, using SPARQL queries.
* 
*/
var AliasManager = /*#__PURE__*/function () {
  function AliasManager() {
    _classCallCheck(this, AliasManager);
    this.endpoint = WIKIDATA_ENDPOINT;

    /** 
     * Internal map used for aliases from text
     * Example local alias: 'contested act' which maps to a specific legal act.
     */
    this.localMap = {};

    /**
     * Internal map used to store aliases extracted by AI
     * 
     * This map needs to be reset before each parse operation
     */
    this.aiMap = {};

    /**
     * Knowing that aliases are mapped to CELEX ids, ELIs and eurlex acts we can exclude rest of the target types
     */
    this.includeTypes = ['eurlex.act.1', 'eurlex.act.3', 'eurlex.celexId', 'ecli', 'eucase', 'eli.url', 'genericurl'];
  }
  _createClass(AliasManager, [{
    key: "getWikidataEndpoint",
    value: function getWikidataEndpoint() {
      return this.endpoint;
    }
  }, {
    key: "setEndpoint",
    value: function setEndpoint(endpoint) {
      this.endpoint = endpoint;
    }
  }, {
    key: "enable",
    value: function enable() {
      R2L.options.aliases = true;
    }
  }, {
    key: "disable",
    value: function disable() {
      R2L.options.aliases = false;
    }

    /**
     * 
     * @returns 
     */
  }, {
    key: "__getMap",
    value: function __getMap() {
      return R2L.getConstant("R2L_ALIAS_MAP") || {};
    }
  }, {
    key: "__setMap",
    value: function __setMap(map) {
      R2L.setConstant("R2L_ALIAS_MAP", map);
    }
  }, {
    key: "set",
    value: function set(key, value) {
      this.__setMap(_objectSpread(_objectSpread({}, this.__getMap()), _defineProperty({}, key, value)));
    }
  }, {
    key: "setLocal",
    value: function setLocal(key, value) {
      this.localMap = _objectSpread(_objectSpread({}, this.localMap), _defineProperty({}, key, value));
      return this.localMap;
    }
  }, {
    key: "add",
    value: function add(obj) {
      this.__setMap(_objectSpread(_objectSpread({}, this.__getMap()), obj));
      return this.__getMap();
    }
  }, {
    key: "addLocal",
    value: function addLocal(obj) {
      this.localMap = _objectSpread(_objectSpread({}, this.localMap), obj);
      return this.localMap;
    }
  }, {
    key: "addAI",
    value: function addAI(obj) {
      this.aiMap = _objectSpread(_objectSpread({}, this.aiMap), obj);
      return this.aiMap;
    }
  }, {
    key: "getAll",
    value: function getAll() {
      return this.__getMap();
    }
  }, {
    key: "getAllLocal",
    value: function getAllLocal() {
      return this.localMap;
    }
  }, {
    key: "getAllAI",
    value: function getAllAI() {
      return this.aiMap;
    }
  }, {
    key: "get",
    value: function get(key) {
      return this.__getMap()[key];
    }
  }, {
    key: "getLocal",
    value: function getLocal(key) {
      return this.localMap[key];
    }
  }, {
    key: "reset",
    value: function reset() {
      this.__setMap({});
      this.localMap = {};
    }
  }, {
    key: "resetAI",
    value: function resetAI() {
      this.aiMap = {};
    }
  }, {
    key: "resetLocal",
    value: function resetLocal() {
      this.localMap = {};
    }
  }, {
    key: "remove",
    value: function remove(key) {
      var map = this.__getMap();
      delete map[key];
      this.__setMap(map);
    }
  }, {
    key: "removeLocal",
    value: function removeLocal(key) {
      delete this.localMap[key];
    }

    /**
     * Runs a SPARQL query against Wikidata to fetch aliases
     * @param {String} type 'eurlex.act|eucase'
     * @param {String} langISO2 en/fr... 
     * @param {String} langISO3 eng/fra... 
     * @returns {Promise<Object>}
     */
  }, {
    key: "fetch",
    value: function fetch(type, langISO2, langISO3) {
      return (0,request/* getRequestPromise */.p)(this.getWikidataEndpoint(), "GET", {
        query: this.buildQuery(type, langISO2, langISO3)
      }, {
        accept: 'application/sparql-results+json'
      });
    }

    /**
     * Will load aliases into the engine
     * @param {String} type 
     * @param {String} langISO2 
     * @param {String} langISO3
     * @returns {Promise<Object>}
     */
  }, {
    key: "load",
    value: function load(type, langISO2, langISO3) {
      var _this = this;
      return this.fetch(type, langISO2).then(function (response) {
        console.debug(type, "Loaded aliases for lang", langISO2, langISO3, response);

        // process result
        return _this.processResponse(response, langISO3).then(function (aliasMap) {
          _this.add(aliasMap);
        });
      });
    }
  }, {
    key: "processResponse",
    value: function processResponse(response, langISO2, langISO3) {
      var map = {};
      try {
        var items = response.results.bindings.map(function (item) {
          return {
            celexId: item.celexId.value,
            label: item.label.value
          };
        });
        items.forEach(function (item) {
          map[item.label] = item.celexId;
        });
      } catch (e) {
        console.error(e);
      }
      return this.getShortTitles(Object.values(map), langISO3).then(function (titleMap) {
        //Turns Celex ids into an act eg: 32006L0066 => Directive 2006/66/EC which can be captured by the act rule (with subdivisions)
        Object.keys(map).forEach(function (aliasTitle) {
          // if refrence not found then fallback to the Celex
          map[aliasTitle] = titleMap[map[aliasTitle]] || map[aliasTitle];
        });
        return map;
      })["catch"](function (err) {
        console.error(err);
        return map;
      });
    }
  }, {
    key: "buildQuery",
    value: function buildQuery(type, langISO2, langISO3) {
      langISO2 = String(langISO2).toLowerCase();
      return "\n            SELECT DISTINCT ?label (MAX(?celex) as ?celexId)\n            WHERE \n            {\n            ?act wdt:P476 ?celex .\n            OPTIONAL {\n                ?act rdfs:label ?label .\n                FILTER (lang(?label) = '".concat(langISO2, "') .\n            }\n            FILTER (REGEX(?celex, \"^3....[LRD]....\")) .\n            FILTER (REGEX(?label, \"^.\")) .\n            FILTER (!REGEX(?label, \"[0-9]\")) .\n            }\n            GROUP BY ?label\n        ");
    }

    /**
     * When the AI feature is enabled, AI aliases are extracted from text using LLM prompting
     * Alternatively, local aliases can be preset using the API: R2L.alias.setLocal('my regulation', 'Regulation 679/2016')
     * 
     * This method returns the aggregate map of local and AI aliases
     * This method is called every time a 'parse' operation is performed
     * 
     * @param {String} text 
     * @returns {Promise<Object>}
     */
  }, {
    key: "loadCustomAliases",
    value: function loadCustomAliases(text) {
      var _this2 = this;
      if (!R2L.options.ai) {
        this.resetAI();
        return Promise.resolve(this.getAllLocal());
      } else {
        return this.extractAIAliases(text).then(function (aiAliasMap) {
          // note that using the AI option will reset existing aliases
          _this2.resetAI();
          _this2.addAI(aiAliasMap);
          return _objectSpread(_objectSpread({}, aiAliasMap), _this2.getAllLocal());
        });
      }
    }

    /**
     * Will run an LLM prompt over the text to extract the aliases
     * @param {String} text 
     * @returns {Promise<Object>} Example: { 'contested act': 'Regulation 679/2016', ... }
     */
  }, {
    key: "extractAIAliases",
    value: function extractAIAliases(text) {
      var aiAliasMap = {};
      if (!R2L.options.ai) {
        //if we already have local aliases return them
        return Promise.resolve({});
      }
      return (0,ecas/* getEcasTicket */.T)(settings/* settings */.W0.constants.R2L_AI_ENDPOINT, R2L.ldm.proxyTicket).then(function (proxyTicket) {
        var headers = {
          Authorization: proxyTicket
        };
        return (0,request/* getRequestPromise */.p)(settings/* settings */.W0.constants.R2L_AI_ENDPOINT, "POST", {
          inputtext: text
        }, headers);
      }).then(function (response) {
        var localAliasItems = response && response.items ? response.items : [];
        // API will return the following format: { items: [ { context: 'my regulation', act: 'Regulation 2016/786' }, ... ]}
        // we convert to a KV map
        localAliasItems.forEach(function (item) {
          aiAliasMap[item.context] = item.act;
        });
        return aiAliasMap;
      })["catch"](function (err) {
        console.error(err);
        return {};
      });
    }

    /**
     * Turns Celex ids into an act eg: 32006L0066 => Directive 2006/66/EC which can be captured by the act rule (with subdivisions)
     *
     * @param {Array<String>} celexIds 
     * @param {String} langISO3 
     * @returns {Promise<Object>} Returns a KV map { [celexId] => short title }
     */
  }, {
    key: "getShortTitles",
    value: function getShortTitles(celexIds, langISO3) {
      var _this3 = this;
      // sector 1 is handled differently
      var treatyShortTitlesMap = this.extractTreatyShortTitlesMap(celexIds);
      // full titles required to extract short titles for sector 3
      return this.getFullTitles(celexIds, langISO3).then(function (titleMap) {
        return _this3.extractShortTitlesMap(titleMap);
      }).then(function (shortTitleMap) {
        return _objectSpread(_objectSpread({}, shortTitleMap), treatyShortTitlesMap);
      })["catch"](function (err) {
        console.error(err);
        return {};
      });
    }
  }, {
    key: "extractTreatyShortTitlesMap",
    value: function extractTreatyShortTitlesMap(celexIds, langISO3) {
      celexIds = celexIds.filter(function (celexId) {
        return celexId.slice(0, 1) === '1';
      });
      console.debug("Extract treaty short titles", celexIds, langISO3);
      var map = {};
      celexIds.forEach(function (celexId) {
        var title = getEUTreatyShortTitle(celexId, langISO3);
        if (title) {
          map[celexId] = title;
        }
      });
      return map;
    }

    /**
     * Process full title map and return the short titles
     * @param {Object} titleMap - { KV map of [celexId] => title }
     * @returns {Promise<Object>} - { KV map of [celexId] => shortTitle }
     */
  }, {
    key: "extractShortTitlesMap",
    value: function extractShortTitlesMap(fullTitlesMap) {
      /**
       * We need to tune Ref2Link for parsing the titles effectively
       *   - Only use eurlex.act rules
       *   - disable linked data 
       */
      var _metadata = R2L.options.metadata;
      var _targets = R2L.filters.targets;
      var allTargets = [];
      R2L.getAllRules().forEach(function (r) {
        r.views.forEach(function (v) {
          allTargets.push(v.target);
        });
      });
      R2L.options.metadata = false;

      // eliminate eurlex.act.3 as it only deals with subdivisions in addition to the other act targets
      R2L.setFilter('targets', allTargets.filter(function (t) {
        return t.indexOf('eurlex.act') === 0 && t.indexOf('eurlex.act.3' !== 0);
      }), true);
      var inputs = [];
      // Ref2link will only process titles for Celex ids starting with "3"
      // for the others it will use placeholders 
      Object.keys(fullTitlesMap).forEach(function (celexId) {
        if (celexId.charAt(0) === '3') {
          inputs.push(fullTitlesMap[celexId]);
        } else {
          inputs.push("");
        }
      });

      // concatenate everything together for Ref2Link to process
      var inputText = inputs.map(function (input) {
        // sanitize input
        return (0,utils/* sanitize */.aj)(input);
      }).join("\t\t\t\t");
      return R2L.parse(inputText, "html").then(function (response) {
        // restore settings
        R2L.options.metadata = _metadata;
        R2L.setFilter('targets', _targets, true);

        // split back content and get first ref.
        var matches = response.result.split("\t\t\t\t").map(function (item, index) {
          // return first captured text from each part
          var regex = /<a[^>]*?data-short-reference=(["\'])?((?:.(?!\1|>))*.?)\1?/;
          var matches = item.match(regex);
          var match = matches ? matches[2] || null : null;
          // it's a short title only if the match is at the beginning

          var srcText = inputs[index].replace(new RegExp(String.fromCharCode(160), "g"), " ");
          // if the match is close to the beginning we use it
          if (match && srcText.indexOf(match) < 30) {
            return match;
          }
          return null;
        });

        // merge results together
        var shortTitlesMap = {};
        Object.keys(fullTitlesMap).forEach(function (celexId, index) {
          shortTitlesMap[celexId] = matches[index];
        });
        return shortTitlesMap;
      });
    }

    /**
     * Get full act titles from Cellar
     * @param {Array<String>} celexIds
     * @param {String} langISO3
     * 
     * @returns {Object} Returns a KV map: { [celexId] => title }   
     */
  }, {
    key: "getFullTitles",
    value: function getFullTitles(celexIds, langISO3) {
      // first we query the titles from Cellar
      var query = getCelexFullTitlesQuery(celexIds, langISO3);
      return (0,request/* getRequestPromise */.p)((0,manager/* getEndpoint */.yP)(manager/* LD_TYPE_CELEX */.wD), "POST", {
        query: query,
        format: 'application/json',
        origin: '*',
        target: manager/* LD_TARGET_CELLAR */.xL
      }).then(function (response) {
        var map = {};
        // fill map with empty values as some ids might not be found
        celexIds.forEach(function (celexId) {
          map[celexId.toUpperCase()] = null;
        });
        try {
          response.results.bindings.forEach(function (binding) {
            map[binding.id.value.replace("celex:", "").toUpperCase()] = (0,utils/* sanitize */.aj)(binding.title.value);
          });
        } catch (e) {
          console.error(e);
        }
        return map;
      });
    }
  }]);
  return AliasManager;
}();

/**
 * Add tolerance to alias definitions (replace " ", "&" with all variants)
 * 
 * @param {String} alias 
 * @param {boolean} isRaw - whether to escape the pattern or not
 * 
 * @returns {String} 
 */
function getRegExp(alias, isRaw) {
  // use the full space pattern
  var spacePattern = "(?:(?:(?:[\\u00a0\\u202F ]|(?:\\u2003|(?:(?:\\x26(?:amp;)?)emsp;))|(?:\\u2002|(?:(?:\\x26(?:amp;)?)ensp;))|(?:\\u2005|(?:(?:\\x26(?:amp;)?)emsp14;))|(?:(?:\\x26(?:amp;)?)nbsp;))+))";
  var ampPattern = "&(?:amp;)?";
  var quotePattern = "(?:['`’])";
  if (!isRaw) {
    alias = (0,functions/* regExpEscape */.fI)(alias);
  }
  return alias.replace(new RegExp(" ", 'g'), spacePattern).replace(new RegExp("&", 'g'), ampPattern).replace(new RegExp("'", 'g'), quotePattern);
}
function getCelexFullTitlesQuery(celexIds, langISO3) {
  langISO3 = String(langISO3 || "ENG").toUpperCase(); // default to english
  // unique ids only
  celexIds = celexIds.filter(function (v, i, a) {
    return a.indexOf(v) === i;
  });

  //only support acts for now (ids starting with '3')
  celexIds = celexIds.filter(function (id) {
    return id.slice(0, 1) === '3';
  });
  var filters = "FILTER (?workId IN (";
  for (var i = 0; i < celexIds.length; i++) {
    filters += "\"celex:".concat(celexIds[i], "\", \"celex:").concat(celexIds[i], "\"^^xsd:string"); // query both types
    if (i < celexIds.length - 1) {
      filters += ",";
    }
  }
  filters += "))";
  var query = "\n    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n    PREFIX cdm:<http://publications.europa.eu/ontology/cdm#>\n    PREFIX skos:<http://www.w3.org/2004/02/skos/core#>\n    PREFIX dc:<http://purl.org/dc/elements/1.1/>\n    PREFIX lang:<http://publications.europa.eu/resource/authority/language/>\n    PREFIX xsd:<http://www.w3.org/2001/XMLSchema#>\n    PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n    PREFIX owl:<http://www.w3.org/2002/07/owl#>\n\n    SELECT DISTINCT \n        ?workId as ?id \n        ?title \n        WHERE {  \n            graph ?ge { \n                ?exp cdm:expression_belongs_to_work ?s .\n                ?exp cdm:expression_title ?title\n            }\n            graph ?g { \n                ?exp cdm:expression_uses_language lang:".concat(langISO3, " . \n            }  \n            ?s cdm:work_id_document ?workId.\n            ").concat(filters, "\n        }    \n    ");
  return query;
}

/**
 * Alias replacement in text, based on the Alias maps provided as input to Ref2Link.
 * 
 * Example: 
 *     Input text: "GDPR is now in use."
 *     Defined alias map: { "GDPR": "Regulation (EU) 2016/679"}
 * 
 *     Output text: "Regulation (EU) 2016/679 is now in use."
 * 
 * This result will be again submitted for parsing and the newly detected references will be merged with the previous parsing results.
 * 
 * @param {String} text - Input text
 * 
 * @returns {Object} text with replaced aliases
 */
function replaceAliases(text) {
  text = text || '';
  var letterPattern = "[/0-9" + letters/* letters */.M.latin + letters/* letters */.M.cyrillic + letters/* letters */.M.greek + letters/* letters */.M.specialChars + "]";
  var lookahead = (0,functions/* getLookAhead */.VC)(letterPattern);
  var lookbehind = (0,functions/* getLookBehind */.Wq)(letterPattern);
  var offsets = [];

  // we keep the local aliases separately (in `localMap` and `aiMap`)
  // here we merge the 3 maps together
  // the AI engine should have populated the AI map if any were detected and `R2L.options.ai = true`
  var map = {};

  // if the option is disabled we don't load the aliases
  if (R2L.options.aliases) {
    map = _objectSpread(_objectSpread({}, map), R2L.alias.getAll());
    map = _objectSpread(_objectSpread({}, map), R2L.alias.getAllLocal());
  }
  if (R2L.options.ai) {
    map = _objectSpread(_objectSpread({}, map), R2L.alias.getAllAI());
  }

  // build global pattern of aliases
  var globalPatterns = [];
  var args;
  var sortedKeys = Object.keys(map).sort(function (a, b) {
    return a.length > b.length ? -1 : 1;
  });
  sortedKeys.forEach(function (key) {
    var isRegex = key.substr(0, 1) === "/" && key.substr(key.length - 1, 1) === "/";
    var r = isRegex ? key.substr(1, key.length - 2) : getRegExp(key);
    var slots = 1;
    //clean internal capture groups
    if (isRegex) {
      r = r.replace(new RegExp("\\((?!\\?:)", "g"), function (match, index) {
        if (index >= 1 && r[index - 1] !== "\\") {
          return "(?:";
        } else {
          return match;
        }
      });
    }
    globalPatterns.push({
      key: key,
      regexp: '(' + r + ')',
      value: map[key],
      slots: slots,
      isRegex: isRegex
    });
  });
  if (globalPatterns.length === 0) {
    return {
      text: text,
      offsets: offsets
    };
  }
  var globalPattern = new RegExp('(?![\r\n\v\f])' + lookbehind + "(?:".concat(globalPatterns.map(function (g) {
    return g.regexp;
  }).join('|'), ")") + lookahead, 'ig');
  while (args = globalPattern.exec(text)) {
    var index = null;
    for (var i = 1; i < args.length; i++) {
      if (args[i]) {
        index = i;
        break;
      }
    }
    var reg = void 0;
    var key = globalPatterns[index - 1].key;
    if (globalPatterns[index - 1].isRegex) {
      key = key.substr(1, key.length - 2);
      reg = new RegExp((0,functions/* regExpEscape */.fI)(key));
    } else {
      reg = new RegExp(globalPatterns[index - 1].regexp);
    }
    var matches = reg.exec(args[0]);
    var pattern = globalPatterns[index - 1];
    var offset = {
      source: args[0],
      replacement: pattern.isRegex ? replaceBackrefs(matches, pattern.value) : pattern.value,
      position: args.index
    };
    offsets.push(offset);
  }
  var cursorOffset = 0;
  // Add after-replacement offsets too
  offsets.map(function (o, index) {
    o.replacementPosition = o.position + cursorOffset;
    cursorOffset += o.replacement.length - o.source.length;
  });
  var currentDelta = 0;
  var currentCursor = 0;
  offsets.forEach(function (offset) {
    currentCursor = offset.position + currentDelta;
    text = text.slice(0, currentCursor) + offset.replacement + text.slice(currentCursor + offset.source.length, text.length);
    currentDelta += offset.replacement.length - offset.source.length;
  });
  return {
    text: text,
    offsets: offsets
  };
}
var replaceBackrefs = function replaceBackrefs(args, val) {
  if (!args) {
    return val;
  }
  for (var i = 0; i < args.length; i++) {
    if (!args[i]) {
      continue;
    }
    var regex = new RegExp("\\{\\{\\s?\\$" + i + "\\s?\\}\\}", "g");
    val = val.replace(regex, args[i]);
  }
  return val;
};

/**
 * Mutates the `matches` (Ref2Link processing result) object to merge the alias processing result
 * @param {Object} matches 
 * @param {Object} replaceAliasesResult 
 * @returns {Object} matches
 */
function replaceAliasMatches(matches, replaceAliasesResult) {
  var offsets = _toConsumableArray(replaceAliasesResult.offsets);
  offsets = offsets.sort(function (a, b) {
    return a.replacement.length > b.replacement.length ? -1 : 1;
  });

  // we need to replace the match (+ its offsets and its key) back with the alias

  // all the matches should be alias-based
  Object.keys(matches).forEach(function (key) {
    var newMatch = matches[key];
    newMatch.offsets = newMatch.offsets.map(function (matchOffset) {
      var aliasOffset = null;
      if (matchOffset.context.indexOf(matchOffset.match) === -1) {
        return matchOffset;
      }

      // get the correct offset using the replacementPosition of the alias offsets
      var referenceStart = matchOffset.position - matchOffset.context.indexOf(matchOffset.match);
      var referenceEnd = referenceStart + matchOffset.context.length;
      for (var i = 0; i < replaceAliasesResult.offsets.length; i++) {
        if (replaceAliasesResult.offsets[i].replacementPosition >= referenceStart && replaceAliasesResult.offsets[i].replacementPosition < referenceEnd) {
          // can also be the next alias offset
          aliasOffset = replaceAliasesResult.offsets[i];
          break;
        }
      }
      if (aliasOffset) {
        matchOffset = replaceFn(matchOffset, aliasOffset.replacement, aliasOffset.source);
        matchOffset.alias = aliasOffset;
        //adjust position by applying the delta of its aliasOffset
        matchOffset.position += aliasOffset.position - aliasOffset.replacementPosition;
        matchOffset.positionDelta = aliasOffset.source.length - aliasOffset.replacement.length;
      }
      return matchOffset;
    });
  });
  var newMatches = {};

  // replace keys and match objects
  Object.keys(matches).forEach(function (key) {
    for (var i = 0; i < matches[key].offsets.length; i++) {
      var matchOffset = matches[key].offsets[i];
      if (matchOffset.alias) {
        var newKey = key.replace(matchOffset.alias.replacement, matchOffset.alias.source);
        var newMatch = matches[key];
        newMatches[newKey] = replaceFn(newMatch, matchOffset.alias.replacement, matchOffset.alias.source);
        break;
      } else {
        newMatches[key] = matches[key];
      }
    }
  });

  // we also need to adjust the offsets for refs that are not aliases now
  var offsetsArr = [];
  // apply all position deltas caused by aliases
  Object.values(newMatches).forEach(function (match) {
    match.offsets.forEach(function (offset) {
      // find all matches with a lower position and apply delta
      offsetsArr.push(offset);
    });
  });
  // sort matches by position
  offsetsArr.sort(function (off1, off2) {
    if (off1.alias && !off2.alias) {
      return off1.alias.replacementPosition < off2.position ? -1 : 1;
    }
    if (off2.alias && !off1.alias) {
      return off1.position < off2.alias.replacementPosition ? -1 : 1;
    }
    return off1.position < off2.position ? -1 : 1;
  });
  offsetsArr.forEach(function (offset, index) {
    for (var idx = 0; idx < index; idx++) {
      // apply all deltas from aliases
      if (!offset.alias && offsetsArr[idx].positionDelta) {
        offset.position += offsetsArr[idx].positionDelta;
      }
    }
  });
  return newMatches;
}

// reuse the same element
var _textarea;
var replaceFn = function replaceFn(obj, search, replace) {
  var subAlias = calculateSubAlias(search, replace, obj.context);
  console.debug("Subalias", subAlias);
  search = subAlias.search;
  replace = subAlias.replace;
  var searchRegexp = new RegExp((0,functions/* regExpEscape */.fI)(search), 'g');

  // use a text area which is not vulnerable to XSS injection as it will not process tags (only entities)
  _textarea = _textarea || document.createElement("textarea");
  _textarea.innerHTML = replace;
  var replaceTextContent = _textarea.value;
  obj.match = obj.match.replace(searchRegexp, replace);
  if (obj.reference) {
    obj.reference = obj.reference.replace(searchRegexp, replace);
  }
  if (obj.wholeMatch) {
    obj.wholeMatch = obj.wholeMatch.replace(searchRegexp, replace);
  }
  if (obj.context) {
    obj.context = obj.context.replace(searchRegexp, replace);
  }
  if (obj.link) {
    obj.link = obj.link.replace(searchRegexp, replace);
  }
  if (obj.views) {
    Object.keys(obj.views).forEach(function (k) {
      if (k === 'table') {
        return;
      }

      // Only replace the content and some attributes. We must be careful not to replace inside hrefs.
      try {
        var $el = (0,jquery.$)(obj.views[k]);
        if ($el.length) {
          $el[0].textContent = $el[0].textContent.replace(searchRegexp, replaceTextContent);
          //$el.html($el.html().replace(searchRegexp, replace));

          if ($el.attr(R2L.dataRef2linkInitialAttribute)) {
            $el.attr(R2L.dataRef2linkInitialAttribute, $el.attr(R2L.dataRef2linkInitialAttribute).replace(searchRegexp, replace));
          }
          obj.views[k] = $el[0].outerHTML;
        } else {
          obj.views[k] = obj.views[k].replace(searchRegexp, replace);
        }
      } catch (e) {
        // table view, ignore
      }
    });
  }
  if (obj.alternatives) {
    obj.alternatives = obj.alternatives.map(function (alt) {
      try {
        var $el = (0,jquery.$)(alt.view);
        if ($el.length) {
          // replace textContent as it is not escaped
          $el[0].textContent = $el[0].textContent.replace(searchRegexp, replaceTextContent);
          //$el.html($el.html().replace(searchRegexp, replace));
          if ($el.attr(R2L.dataRef2linkInitialAttribute)) {
            $el.attr(R2L.dataRef2linkInitialAttribute, $el.attr(R2L.dataRef2linkInitialAttribute).replace(searchRegexp, replace));
          }
          if ($el.attr(R2L.dataRef2linkContextAttribute)) {
            $el.attr(R2L.dataRef2linkContextAttribute, $el.attr(R2L.dataRef2linkContextAttribute).replace(searchRegexp, replace));
          }
          alt.view = $el[0].outerHTML;
        } else {
          alt.view = alt.view.replace(searchRegexp, replace);
        }
      } catch (e) {
        // table view, ignore
      }
      alt.reference = alt.reference.replace(searchRegexp, replace);
      alt.match = alt.match.replace(searchRegexp, replace);
      alt.wholeMatch = alt.wholeMatch.replace(searchRegexp, replace);
      alt.context = alt.context.replace(searchRegexp, replace);
      alt.link = alt.link.replace(searchRegexp, replace);
      return alt;
    });
  }
  return obj;
};
AliasManager.prototype.getEUTreatyShortTitle = getEUTreatyShortTitle;

/**
 * Substract the common block from 2 strings. Example: 
 *   str1 = 'Article 12(4) and (5) of Directive 2004/109/EC of the European Commission regarding bla bla'
 *   str2 = 'Article 12(4) and (5) of that Directive'
 *   context = 'Article 12(4) and (5) of Directive 2004/109/EC'
 * Returns: { search: 'that Directive', replace: 'Directive 2004/109/EC' }
 * @param {String} str1 
 * @param {String} str2 
 * 
 * @returns {Object}
 */
function calculateSubAlias(str1, str2, context) {
  // if the alias coming from OpenAI is too verbose and Ref2Link only matches a part of it we drop the ending
  if (str1.indexOf(context) === 0 && str1.length > context.length) {
    str1 = context;
  }
  var length1 = str1.length;
  var length2 = str2.length;
  var minLength = length1 < length2 ? length1 : length2;
  var stopper = 0;
  for (var i = 0; i < minLength; i++) {
    if (str1[i] !== str2[i]) {
      stopper = i;
      break;
    }
  }
  return {
    search: str1.substr(stopper),
    replace: str2.substr(stopper)
  };
}

/***/ }),

/***/ 825:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   B5: () => (/* binding */ replaceHtmlNodes),
/* harmony export */   PU: () => (/* binding */ unExtractRaw),
/* harmony export */   Sm: () => (/* binding */ clearExtracts),
/* harmony export */   Zc: () => (/* binding */ jqReplaceDOMNodes),
/* harmony export */   gx: () => (/* binding */ jqUnExtractNode),
/* harmony export */   iJ: () => (/* binding */ clearTextCaches),
/* harmony export */   zr: () => (/* binding */ getExtracts)
/* harmony export */ });
/* unused harmony exports _replaceTextInNode, _replaceHtmlInNode, replaceBoundariedWords, setExtracts, padCounter, unpadCounter, extract */
/* harmony import */ var _jquery_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(953);
/* harmony import */ var _functions_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(588);
/* harmony import */ var _letters_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(228);
/* harmony import */ var _list_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(577);




function _replaceTextInNode(node, search, replacement) {
  var newTextContent = node.textContent.replace(new RegExp(regExpEscape(search), 'g'), replacement); // only set the prop when updated to avoid re-drawing
  if (newTextContent !== node.textContent) {
    node.textContent = newTextContent;
  }
  return node;
}
function _replaceHtmlInNode(node, search, replacement) {
  var newInnerHTML = node.innerHTML.replace(new RegExp((0,_functions_js__WEBPACK_IMPORTED_MODULE_1__/* .regExpEscape */ .fI)(search), 'g'), replacement); // only set the prop when updated to avoid re-drawing
  if (newInnerHTML !== node.innerHTML) {
    node.innerHTML = newInnerHTML;
  }
  return node;
}

/**
 * Text replace function; Works on both raw text and HTML input which will require building a DOM tree and replacing only leaf text nodes;
 * Replaces only where the search string is neighboured by boundaries
 * @param {String} toReplace
 * @param {String} replacement
 * @param {String} context
 * @param {Boolean} allowAttribute
 * @param {Boolean} isMain
 * @param {Array<HTMLElement>} prevTextNodes - array of text nodes (leaf nodes) extracted from input (to be reused by subsequent calls)
 * @param {HTMLElement} prevCtx - wrapper node (to be reused by subsequent calls)
 *
 * @returns {Object}  
 *   { 
 *     content: replaced text,
 *     textNodes: HTML nodes parsed from input (used for caching) 
 *     ctx: HTML element wrapper (used for caching)
 *   }
 */
function replaceBoundariedWords(toReplace, replacement, context, allowAttribute, isMain, prevTextNodes, prevCtx) {
  if (allowAttribute !== false) {
    allowAttribute = true;
  }
  var letterPattern = "[/0-9" + _letters_js__WEBPACK_IMPORTED_MODULE_2__/* .letters */ .M.latin + _letters_js__WEBPACK_IMPORTED_MODULE_2__/* .letters */ .M.cyrillic + _letters_js__WEBPACK_IMPORTED_MODULE_2__/* .letters */ .M.greek + _letters_js__WEBPACK_IMPORTED_MODULE_2__/* .letters */ .M.specialChars + (allowAttribute ? '' : '"') + "]";
  var lookahead = (0,_functions_js__WEBPACK_IMPORTED_MODULE_1__/* .getLookAhead */ .VC)(letterPattern);
  var lookbehind = (0,_functions_js__WEBPACK_IMPORTED_MODULE_1__/* .getLookBehind */ .Wq)(letterPattern);
  toReplace = lookbehind + toReplace + lookahead;

  // doc can be an HTMLElement or an HTMLDocument (with body)
  var doc = prevCtx;
  if (R2L.settings.htmlMode && isMain && (prevCtx || (0,_functions_js__WEBPACK_IMPORTED_MODULE_1__/* .hasTags */ .kS)(context) && (doc = (0,_functions_js__WEBPACK_IMPORTED_MODULE_1__/* .buildDocumentObject */ .DJ)(context)))) {
    // we parse the HTML content so we need to only replace text while preserving attributes
    try {
      var textNodes = prevTextNodes || (0,_functions_js__WEBPACK_IMPORTED_MODULE_1__/* .getTextNodesIn */ .YW)(doc.body || doc, false);
      var i = textNodes.length;
      var node;
      var escapedToReplace = toReplace.replace(/&nbsp;/g, String.fromCharCode(160)).replace(/&amp;/g, "&");
      var escapedReplacement = replacement.replace(/&nbsp;/g, String.fromCharCode(160)).replace(/&amp;/g, "&");
      var toReplaceRegexp = new RegExp(escapedToReplace, 'g');
      while (i--) {
        node = textNodes[i]; // handle &nbsp; in textContent

        var newTextContent = (node.r2lTextContent || node.textContent).replace(toReplaceRegexp, escapedReplacement); // only set the prop when updated to avoid re-drawing

        if (newTextContent !== node.textContent) {
          node.r2lTextContent = newTextContent;
        }
      }
      return {
        toRender: true,
        content: null,
        // let the caller calculate content as it is a heavy computation
        ctx: doc,
        textNodes: textNodes
      };
    } catch (e) {
      //console.error(e, "Cannot be parsed as HTML content");
      // not HTML content, move on.
    }
  }
  return {
    ctx: prevCtx,
    content: context.replace(new RegExp(toReplace, 'g'), replacement)
  };
}
;

/**
 * Will replace detected references with <ref2link> nodes, operating on the current HTMLElement.
 * This preserves existing DOM events.
 * Used by the JQuery API only: $('.selector').parseDeferred();
 * 
 * @param {HTMLElement} node 
 * @param {Object} matches 
 * @returns {HTMLElement}
 */
function jqReplaceDOMNodes(node, matches) {
  var et1 = performance.now();
  console.debug("Start replace DOM nodes", et1);
  var keys = Object.keys(matches);
  keys.sort(function (left, right) {
    return right.length - left.length;
  });
  var allOffsets = (0,_list_js__WEBPACK_IMPORTED_MODULE_3__/* .getOffsetMap */ .eJ)(Object.values(matches));
  /** replace keys in descending order */
  var offsetKeys = Object.keys(allOffsets);
  offsetKeys.sort(function (a, b) {
    return a.length < b.length ? 1 : -1;
  });
  var _loop = function _loop() {
      offset = allOffsets[offsetKeys[oIndex]];
      replacement = offsetKeys[oIndex];
      /** replace inside list in descending order **/
      offset.sort(function (a, b) {
        return a.match.length > b.match.length ? -1 : 1;
      });
      var allowAttribute = true;
      for (k = 0; k < offset.length; k++) {
        if (offset[k].alternatives.length > 0) {
          var view = "";
          for (l = 0; l < offset[k].alternatives.length; l++) {
            _alternative = offset[k].alternatives[l];
            if (_alternative.view && _alternative.viewName !== "table") {
              view = _alternative.view;
              break;
            }
          }
          ;
          if (!view) {
            continue;
          }
          $view = (0,_jquery_js__WEBPACK_IMPORTED_MODULE_0__.$)('<div>' + view + '</div>');
          extract($view, R2L.settings["class"], false);
          viewHtml = $view.html();
          search = offset[k].match;
          offset[k].alternatives.forEach(function (alt) {
            if (alt.rule && alt.rule.allowAttribute === false) {
              allowAttribute = false;
            }
          });
          if (search.length > 0) {
            replacement = replaceBoundariedWords((0,_functions_js__WEBPACK_IMPORTED_MODULE_1__/* .regExpEscape */ .fI)(search), viewHtml, replacement, allowAttribute, false, null, node).content;
          }
        }
      }

      /** replace all */
      var toReplace = (0,_functions_js__WEBPACK_IMPORTED_MODULE_1__/* .regExpEscape */ .fI)(offsetKeys[oIndex]);
      var replacementResult = replaceBoundariedWords(toReplace, replacement, "", allowAttribute, true, null, node);
      node = replacementResult.ctx;
    },
    offset,
    replacement,
    k,
    l,
    _alternative,
    $view,
    viewHtml,
    search;
  for (var oIndex = 0; oIndex < offsetKeys.length; oIndex++) {
    _loop();
  }
  ;
  var et2 = performance.now();
  console.debug("Stop replace DOM nodes", et2);
  return node;
}

/**
 * First step of replacement. Will replace the initial content with <ref2link oid="$id"></ref2link> nodes 
 * Used by the R2L programatic API eg: R2L.parse('<div><span>C-99/99</span></div>', 'html');
 * @param {String} html 
 * @param {Object} matches
 * 
 * @returns {String} - content with <ref2link></ref2link> nodes 
 */
function replaceHtmlNodes(html, matches) {
  var _cachedTextNodes = null;
  var _cachedCtx = null;
  var _toRender = false;
  var _originalHtml = html;
  var keys = Object.keys(matches);
  keys.sort(function (left, right) {
    return right.length - left.length;
  });
  var allOffsets = (0,_list_js__WEBPACK_IMPORTED_MODULE_3__/* .getOffsetMap */ .eJ)(Object.values(matches));
  /** replace keys in descending order */
  var offsetKeys = Object.keys(allOffsets);
  offsetKeys.sort(function (a, b) {
    return a.length < b.length ? 1 : -1;
  });
  var _loop2 = function _loop2() {
      offset = allOffsets[offsetKeys[oIndex]];
      replacement = offsetKeys[oIndex];
      /** replace inside list in descending order **/
      offset.sort(function (a, b) {
        return a.match.length > b.match.length ? -1 : 1;
      });
      var allowAttribute = true;
      for (k = 0; k < offset.length; k++) {
        if (offset[k].alternatives.length > 0) {
          var view = "";
          for (l = 0; l < offset[k].alternatives.length; l++) {
            _alternative = offset[k].alternatives[l];
            if (_alternative.view && _alternative.viewName !== "table") {
              view = _alternative.view;
              break;
            }
          }
          ;
          if (!view) {
            continue;
          }
          $view = (0,_jquery_js__WEBPACK_IMPORTED_MODULE_0__.$)('<div>' + view + '</div>');
          extract($view, R2L.settings["class"], false);
          viewHtml = $view.html();
          search = offset[k].match;
          offset[k].alternatives.forEach(function (alt) {
            if (alt.rule && alt.rule.allowAttribute === false) {
              allowAttribute = false;
            }
          });
          if (search.length > 0) {
            replacement = replaceBoundariedWords((0,_functions_js__WEBPACK_IMPORTED_MODULE_1__/* .regExpEscape */ .fI)(search), viewHtml, replacement, allowAttribute).content;
          }
        }
      }

      /** replace all */
      var toReplace = (0,_functions_js__WEBPACK_IMPORTED_MODULE_1__/* .regExpEscape */ .fI)(offsetKeys[oIndex]);
      var replacementResult = replaceBoundariedWords(toReplace, replacement, html, allowAttribute, true, _cachedTextNodes, _cachedCtx);
      // content might be empty as we don't want to re-calculate after each replacement
      html = replacementResult.content;
      _toRender = replacementResult.toRender || false;
      // cache the tree (expensive to re-calculate after each ref replacement)
      _cachedTextNodes = replacementResult.textNodes;
      _cachedCtx = replacementResult.ctx;
    },
    offset,
    replacement,
    k,
    l,
    _alternative,
    $view,
    viewHtml,
    search;
  for (var oIndex = 0; oIndex < offsetKeys.length; oIndex++) {
    _loop2();
  }
  ;

  // only render HTML output once for perf improvements
  if (_toRender && _cachedCtx && _cachedCtx.body) {
    // generate HTML from r2lTextContent props
    _cachedTextNodes.forEach(function (textNode) {
      if (textNode.r2lTextContent && textNode.r2lTextContent !== textNode.textContent) {
        textNode.textContent = textNode.r2lTextContent;
      }
    });

    // if  the input contains a <head> and <body> we replace only inside the <body> contents
    var bodyMatches = /<body[^>]*>([\s\S]*)<\/body>/gi.exec(_originalHtml);
    if (bodyMatches && bodyMatches[1]) {
      html = _originalHtml.replace(bodyMatches[1], _cachedCtx.body.innerHTML);
    } else {
      html = _cachedCtx.body.innerHTML;
    }
  }
  return html;
}

/**
 * 2nd step of the replacement: 
 *   - takes as input a string containing <ref2link-object> nodes and replaces them with the final links (from extracts)
 * @param {String} html 
 * @returns {String} html string with final links
 */
function unExtractRaw(html) {
  var parsedHtml = html;
  if (html.indexOf('ref2link-object') === -1) {
    return parsedHtml;
  }
  var extracts = getExtracts();
  for (var i = extracts.length - 1; i >= 0; i--) {
    var $node = extracts[i].$this;
    var outerHTML = $node.prop('outerHTML');
    var replacement = outerHTML;
    var search = new RegExp("(?:<|&lt;)ref2link-object oid=\"".concat(padCounter(i), "\"(?:>|&gt;)(?:<|&lt;)/ref2link-object(?:>|&gt;)"), 'g');
    replacement = outerHTML;
    parsedHtml = parsedHtml.split(search).join(replacement);
  }
  return parsedHtml;
}

/**
 * Remove extracts 
 * @param {int} age - in miliseconds, remove only if all of them are older than `now() - age` 
 */
function clearExtracts(age) {
  if (!age) {
    setExtracts([]);
  }
  var t = new Date().getTime();
  var isExpired = getExtracts().filter(function (extract) {
    return t - extract.t < age;
  }).length === 0;
  if (isExpired) {
    setExtracts([]);
  }
}

// @deprecated
var textCaches = {};

// Used for pre-processing
var _extracts = [];
function clearTextCaches() {
  textCaches = {};
}
function getExtracts() {
  return _extracts;
}
function setExtracts(extracts) {
  _extracts = extracts;
}
function padCounter(counter) {
  return 'N' + counter + 'N';
}
;
function unpadCounter(paddedCounter) {
  return ("" + paddedCounter).substr(1, paddedCounter.length - 1);
}
;
function extract($node, selector, whole) {
  var extracts = getExtracts();
  var extractCounter = extracts.length;
  $node.find(selector).each(function () {
    var $this = (0,_jquery_js__WEBPACK_IMPORTED_MODULE_0__.$)(this),
      html = '<ref2link-object oid="' + padCounter(extractCounter) + '">';
    if (whole) {
      html += $this.html();
    }
    html += '</ref2link-object>';
    $this.replaceWith(html);
    var e = {
      $this: $this,
      whole: whole,
      t: new Date().getTime()
    };
    extracts.push(e);
    extractCounter++;
  });
}
;
var _tempEl = document.createElement("p");

/**
 * Used only by the JQuery API to operate on DOM nodes 
 * Example: $('.selector').parseReferences();
 * 
 * @param {HTMLElement} node 
 * @returns {HTMLElement}
 */
function jqUnExtractNode(node) {
  var textNodes = (0,_functions_js__WEBPACK_IMPORTED_MODULE_1__/* .getTextNodesIn */ .YW)(node, false);
  var j = textNodes.length;
  while (j--) {
    // we use a new prop to mark that the node needs Ref2Link treatment
    var initialTextContent = textNodes[j].r2lTextContent;
    if (!initialTextContent) {
      continue;
    } else {
      _tempEl = _tempEl || document.createElement("p");
      _tempEl.textContent = initialTextContent;

      // We need the HTML encoded data
      var convertedTextContent = _tempEl.innerHTML;
      textNodes[j].innerHTML = convertedTextContent;
      var extracts = getExtracts();
      for (var i = extracts.length - 1; i >= 0; i--) {
        var $node = extracts[i].$this;
        var outerHTML = $node.prop('outerHTML');
        var replacement = outerHTML;
        var search = "&lt;ref2link-object oid=\"".concat(padCounter(i), "\"&gt;&lt;/ref2link-object&gt;");
        replacement = outerHTML;
        textNodes[j] = _replaceHtmlInNode(textNodes[j], search, replacement);
      }

      // if the textNode has links we re-create the children
      var span = document.createElement("span");
      span.innerHTML = textNodes[j].innerHTML;
      span.childNodes.forEach(function (childNode) {
        var newNode = childNode.cloneNode(true);
        textNodes[j].parentNode.insertBefore(newNode, textNodes[j]);
      });
      textNodes[j].parentNode.removeChild(textNodes[j]);
      delete textNodes[j].r2lTextContent;
    }
  }
  return node;
}

/***/ }),

/***/ 910:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   o: () => (/* binding */ Base64)
/* harmony export */ });
var Base64 = {
  _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
  encode: function encode(r) {
    var t,
      e,
      o,
      a,
      h,
      n,
      c,
      d = "",
      C = 0;
    for (r = Base64._utf8_encode(r); C < r.length;) t = r.charCodeAt(C++), e = r.charCodeAt(C++), o = r.charCodeAt(C++), a = t >> 2, h = (3 & t) << 4 | e >> 4, n = (15 & e) << 2 | o >> 6, c = 63 & o, isNaN(e) ? n = c = 64 : isNaN(o) && (c = 64), d = d + this._keyStr.charAt(a) + this._keyStr.charAt(h) + this._keyStr.charAt(n) + this._keyStr.charAt(c);
    return d;
  },
  decode: function decode(r) {
    var t,
      e,
      o,
      a,
      h,
      n,
      c,
      d = "",
      C = 0;
    for (r = r.replace(/[^A-Za-z0-9\+\/\=]/g, ""); C < r.length;) a = this._keyStr.indexOf(r.charAt(C++)), h = this._keyStr.indexOf(r.charAt(C++)), n = this._keyStr.indexOf(r.charAt(C++)), c = this._keyStr.indexOf(r.charAt(C++)), t = a << 2 | h >> 4, e = (15 & h) << 4 | n >> 2, o = (3 & n) << 6 | c, d += String.fromCharCode(t), 64 != n && (d += String.fromCharCode(e)), 64 != c && (d += String.fromCharCode(o));
    return d = Base64._utf8_decode(d);
  },
  _utf8_encode: function _utf8_encode(r) {
    r = r.replace(/\r\n/g, "\n");
    for (var t = "", e = 0; e < r.length; e++) {
      var o = r.charCodeAt(e);
      128 > o ? t += String.fromCharCode(o) : o > 127 && 2048 > o ? (t += String.fromCharCode(o >> 6 | 192), t += String.fromCharCode(63 & o | 128)) : (t += String.fromCharCode(o >> 12 | 224), t += String.fromCharCode(o >> 6 & 63 | 128), t += String.fromCharCode(63 & o | 128));
    }
    return t;
  },
  _utf8_decode: function _utf8_decode(r) {
    var c1, c2, c3;
    for (var t = "", e = 0, o = c1 = c2 = 0; e < r.length;) o = r.charCodeAt(e), 128 > o ? (t += String.fromCharCode(o), e++) : o > 191 && 224 > o ? (c2 = r.charCodeAt(e + 1), t += String.fromCharCode((31 & o) << 6 | 63 & c2), e += 2) : (c2 = r.charCodeAt(e + 1), c3 = r.charCodeAt(e + 2), t += String.fromCharCode((15 & o) << 12 | (63 & c2) << 6 | 63 & c3), e += 3);
    return t;
  }
};


/***/ }),

/***/ 948:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   I: () => (/* binding */ getEurlexRequestPromise),
/* harmony export */   p: () => (/* binding */ getRequestPromise)
/* harmony export */ });
/* harmony import */ var _jquery_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(953);
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }


/**
 * Wrapper function to call the linked data query endpoint
 * 
 * @param {String} endpoint 
 * @param {String} method 
 * @param {any} data 
 * @param {Object} headers 
 * @returns {Promise<any>}
 */
function getRequestPromise(endpoint, method, data, headers) {
  /**
   * Ref2Link library consumers can hook a function to the handling of SPARQL requests in order to override default behavior. 
   * This is useful in the context of the Webservice, which integrates the library and where there is no need for the library to call the WS back for linked data (circular-dependency).
   */

  if (!headers) {
    headers = {};
  }
  var allheaders = _objectSpread(_objectSpread({}, headers), R2L.ldm.getCustomHeaders());
  if (R2L.hooks.handleLinkedDataReq) {
    return R2L.hooks.handleLinkedDataReq(data, headers, false, R2L.ldm.user);
  }
  return new Promise(function (resolve, reject) {
    _jquery_js__WEBPACK_IMPORTED_MODULE_0__.$.ajax({
      url: endpoint,
      method: method,
      data: data,
      headers: allheaders,
      success: function success(response) {
        resolve(response);
      },
      error: function error(_error) {
        reject(_error);
      }
    });
  });
}

/**
 * Wrapper function to call the Eurlex content extraction endpoint
 * 
 * @param {String} endpoint 
 * @param {String} method 
 * @param {any} data 
 * @param {Object} headers 
 * @returns {Promise<any>}
 */
function getEurlexRequestPromise(endpoint, method, data, headers) {
  if (!headers) {
    headers = {};
  }
  var allheaders = _objectSpread(_objectSpread({}, headers), R2L.ldm.getCustomHeaders());
  if (R2L.hooks.handleEurlexReq) {
    return R2L.hooks.handleEurlexReq(endpoint, method, data, headers);
  }
  return new Promise(function (resolve, reject) {
    _jquery_js__WEBPACK_IMPORTED_MODULE_0__.$.ajax({
      url: endpoint,
      method: method,
      data: data,
      headers: allheaders,
      success: function success(response) {
        resolve(response);
      },
      error: function error(_error2) {
        reject(_error2);
      }
    });
  });
}

/***/ }),

/***/ 953:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   $: () => (/* binding */ $)
/* harmony export */ });
// Confluence binding
var _jQuery = typeof AJS !== "undefined" && AJS.$ ? AJS.$ : typeof jQuery !== "undefined" ? jQuery : null;
if (!_jQuery && typeof $ !== "undefined") {
  _jQuery = $;
}
var $ = _jQuery;

/***/ }),

/***/ 979:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  R: () => (/* binding */ lib_R2L)
});

// EXTERNAL MODULE: ./src/lib/jquery.js
var jquery = __webpack_require__(953);
// EXTERNAL MODULE: ./src/lib/utils/functions.js
var functions = __webpack_require__(588);
// EXTERNAL MODULE: ./src/lib/utils/letters.js
var letters = __webpack_require__(228);
// EXTERNAL MODULE: ./src/lib/utils/processor.js
var processor = __webpack_require__(825);
// EXTERNAL MODULE: ./src/lib/utils/list.js
var list = __webpack_require__(577);
// EXTERNAL MODULE: ./src/lib/ux/index.js + 1 modules
var ux = __webpack_require__(246);
// EXTERNAL MODULE: ./src/lib/settings/index.js
var settings = __webpack_require__(265);
// EXTERNAL MODULE: ./src/lib/alias/index.js + 1 modules
var alias = __webpack_require__(819);
// EXTERNAL MODULE: ./src/lib/utils/shared.js
var shared = __webpack_require__(500);
// EXTERNAL MODULE: ./src/lib/transformers/utils/index.js
var utils = __webpack_require__(358);
// EXTERNAL MODULE: ./src/lib/utils/data.js
var data = __webpack_require__(13);
// EXTERNAL MODULE: ./src/lib/manager/index.js + 19 modules
var manager = __webpack_require__(33);
// EXTERNAL MODULE: ./src/lib/utils/request.js
var request = __webpack_require__(948);
;// ./src/lib/transformers/placeholders/rules/eurlex/act.js






/**
 * Will resolve CELEX and ELI ambiguous references in CELEX-based rules (EUR-Lex acts).
 * Processes placeholders: LD_CELLAR_SUBNUMBER_CELEX, LD_CELLAR_SUBNUMBER_ELI
 * 
 * Example: `Decision No 70/2008/EC of the European Parliament and of the Council` - 32008D0070(01) - http://data.europa.eu/eli/dec/2008/70(1)/oj 
 * 
 * @param {Object} matches
 * @returns {Promise<Object>}  
 */
var resolveCelexSubnumber = function resolveCelexSubnumber(matches) {
  // fill CELEX placeholders
  var celexIds = (0,data/* extractCelexAttributes */.gI)(matches, utils/* LD_CELLAR_SUBNUMBER_CELEX */.Nh).map(function (attributes) {
    // strip placeholders
    var id = (0,data/* extractCelexId */.ip)(attributes);
    return id.replace(new RegExp('{{\\s?[A-Z:]+\\s?}}', 'gi'), '');
  });

  // nothing to check
  if (celexIds.length === 0) {
    return Promise.resolve(matches);
  }
  var query = getQuery(celexIds, R2L.getLanguage() || "ENG");
  var format = 'application/json';
  return (0,request/* getRequestPromise */.p)((0,manager/* getEndpoint */.yP)(manager/* LD_TYPE_CELEX */.wD), "POST", {
    query: query,
    format: format,
    origin: '*'
  }).then(function (response) {
    if (!response || !response.results) {
      return matches;
    }

    // de-duplicate celex ids
    var bindings = response.results.bindings;
    Object.keys(matches).forEach(function (key) {
      matches[key].offsets.forEach(function (offset) {
        var attributes = (0,functions/* extractAttributes */.pt)(offset.views);
        var celexId = (0,data/* extractCelexId */.ip)(attributes);
        if (!celexId) {
          return;
        }
        var rawCelexId = String(celexId).replace(new RegExp('{{\\s?[A-Z:]{1,50}\\s?}}', 'gi'), '');

        //nothing to parse
        if (celexId === rawCelexId) {
          return;
        }
        var match = offset.context || offset.match;
        var celexIdVariation = getCelexIdVariation(rawCelexId);

        // check if celexId is unique among the bindings
        var currentBindings = bindings.filter(function (binding) {
          if (celexIdVariation) {
            return binding.id.value.includes(rawCelexId) || binding.id.value.includes(celexIdVariation);
          } else {
            return binding.id.value.includes(rawCelexId);
          }
        });
        if (currentBindings.length >= 1) {
          var optimalBinding = findOptimalBinding(match, currentBindings);
          //try to resolve duplicate using matched reference

          offset.rule.ld.forEach(function (placeholder) {
            if (placeholder.indexOf(":SUBNUMBER:CELEX") !== -1) {
              // replace CELEX id entirely
              var replacementCelex = optimalBinding ? optimalBinding.id.value.slice(6) : '';
              Object.keys(offset.views).forEach(function (key) {
                offset.views[key] = String(offset.views[key]).replaceAll(celexId, replacementCelex);
              });
              offset.alternatives.forEach(function (alternative) {
                alternative.view = String(alternative.view).replaceAll(celexId, replacementCelex);
              });
            }
            if (placeholder.indexOf(":SUBNUMBER:ELI") !== -1) {
              // use the subnumber from the optimal ELI URL
              var eliParts = optimalBinding && optimalBinding.eli ? (optimalBinding.eli.value || "").split("/eli/") : [];
              if (eliParts.length > 1) {
                var arr = eliParts[1].match(/^[a-z_]+\/\d+\/\d+(\(\d+\))/i);
                var replacementEli = arr && arr[1] ? arr[1] : "";
                offset = (0,utils/* replace */.HC)(offset, placeholder, replacementEli);
              }
            }
          });
        }
      });
    });
    return matches;
  })["catch"](function (error) {
    console.error(error);
    return matches;
  });
};
function getCelexIdVariation(celexId) {
  var year = parseInt(celexId.slice(1, 5));
  var type = celexId.slice(5, 6);
  // ECSC celex ids can use an 'S' instead of 'D'
  if (year <= 2002 && type === 'D') {
    var ecscCelexId = celexId.replace('D', 'S');
    return ecscCelexId;
  }
  return null;
}

/**
 * Query by CELEX ids (CONTAINS)
 * @param {Array<String>} celexIds 
 * @returns {String}
 */
function getQuery(celexIds, langISO3) {
  langISO3 = langISO3 || "ENG";
  langISO3 = String(langISO3).toUpperCase();

  // unique ids only
  celexIds = celexIds.filter(function (v, i, a) {
    return a.indexOf(v) === i;
  });
  var filters = "";
  for (var i = 0; i < celexIds.length; i++) {
    if (i > 0) {
      filters += " UNION ";
    }
    var celexIdVariationFilter = "";
    var celexIdVariation = getCelexIdVariation(celexIds[i]);
    if (celexIdVariation) {
      celexIdVariationFilter = ",  \"celex:".concat(celexIdVariation, "\", \"celex:").concat(celexIdVariation, "\"^^xsd:string");
    }
    filters += "{\n            ?s cdm:work_id_document ?workId. \n\n            FILTER (?workId IN (\n                \"celex:".concat(celexIds[i], "\", \"celex:").concat(celexIds[i], "\"^^xsd:string, \n                \"celex:").concat(celexIds[i], "(01)\", \"celex:").concat(celexIds[i], "(01)\"^^xsd:string,\n                \"celex:").concat(celexIds[i], "(02)\", \"celex:").concat(celexIds[i], "(02)\"^^xsd:string,\n                \"celex:").concat(celexIds[i], "(03)\", \"celex:").concat(celexIds[i], "(03)\"^^xsd:string\n                ").concat(celexIdVariationFilter, "\n            ))\n        }");
  }
  var query = "\n        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n        PREFIX cdm:<http://publications.europa.eu/ontology/cdm#>\n        PREFIX skos:<http://www.w3.org/2004/02/skos/core#>\n        PREFIX dc:<http://purl.org/dc/elements/1.1/>\n        PREFIX lang:<http://publications.europa.eu/resource/authority/language/>\n        PREFIX xsd:<http://www.w3.org/2001/XMLSchema#>\n        PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n        PREFIX owl:<http://www.w3.org/2002/07/owl#>\n\n        SELECT DISTINCT \n            ?workId as ?id \n            ?title_ as ?title\n            ?eli\n        WHERE {  \n            graph ?ge { \n                ?exp cdm:expression_belongs_to_work ?s .\n                ?exp cdm:expression_title ?title_\n            }\n            graph ?g { \n                ?exp cdm:expression_uses_language ?lang\n                filter(?lang=lang:".concat(langISO3, ").  \n            } \n            OPTIONAL {\n                ?s cdm:resource_legal_eli ?eli .\n            }\n\n            ").concat(filters, "   \n        }\n        \n        ORDER BY DESC(?workId)\n        ");
  return query;
}

/**
 * Find the best subnumber binding to use for the match.
 * @param {String} match (reference) 
 * @param {Array} bindings
 * 
 * @returns {Object} binding
 */
function findOptimalBinding(match, bindings) {
  // find the reference word eg. 70/2008(/EC)
  var optimalBinding = bindings.filter(function (binding) {
    var parts = (0,utils/* sanitize */.aj)(binding.title.value).split(" ").filter(function (part) {
      return String(part).match("\\d{1,8}\\/\\d{1,8}");
    });
    var matchParts = (0,utils/* sanitize */.aj)(match).split(" ").filter(function (part) {
      return String(part).match("\\d{1,8}\\/\\d{1,8}");
    });

    //check whether parts and matchParts have a common reference token
    if (parts.length > 0 && matchParts.length > 0) {
      // in old acts we might find a colon at the end eg: '2003/426/EC:
      var str = String(parts[0]).slice(-1) === ':' ? String(parts[0]).slice(0, -1) : String(parts[0]);
      var matchStr = String(matchParts[0]).slice(-1) === ':' ? String(matchParts[0]).slice(0, -1) : String(matchParts[0]);
      return str === matchStr;
    }
    return false;
  }).pop();
  if (!optimalBinding) {
    return bindings[0];
  }
  return optimalBinding;
}
;// ./src/lib/transformers/placeholders/rules/eurlex/act_legacy.js






/**
 * Resolve legacy act ELIs (urls). Very old acts (before 1962) do not reference the year so we need to query Cellar for it. 
 * Example: `Règlement n 12 de la Commission` - http://data.europa.eu/eli/reg/1961/12/oj
 * 
 * Processes placeholders: LD_CELLAR_ACT_NUMBER_CELEX, LD_CELLAR_ACT_URL_ELI
 * @param {Object} matches
 * @returns {Promise<Object>}  
 */
var resolveLegacyActs = function resolveLegacyActs(matches) {
  // fill CELEX placeholders
  var attributesList = (0,data/* extractCelexAttributes */.gI)(matches, utils/* LD_CELLAR_ACT_URL_ELI */.jw).map(function (attributes) {
    // strip placeholders
    return {
      number: attributes["data-ref-no"],
      author: attributes["data-ref-author"],
      type: attributes["data-ref-type"],
      celexId: String(attributes['data-ref-celex']).replace(new RegExp('{{\\s?[A-Z:]+\\s?}}', 'gi'), '')
    };
  });
  if (attributesList.length === 0) {
    return Promise.resolve(matches);
  }
  var query = act_legacy_getQuery(attributesList);
  var format = 'application/json';
  return (0,request/* getRequestPromise */.p)((0,manager/* getEndpoint */.yP)(manager/* LD_TYPE_CELEX */.wD), "POST", {
    query: query,
    format: format,
    origin: '*'
  }).then(function (response) {
    if (!response || !response.results) {
      return matches;
    }

    // de-duplicate celex ids
    var bindings = response.results.bindings;
    Object.keys(matches).forEach(function (key) {
      matches[key].offsets.forEach(function (offset) {
        var attributes = (0,functions/* extractAttributes */.pt)(offset.views);
        var celexId = (0,data/* extractCelexId */.ip)(attributes);
        if (!celexId) {
          return;
        }
        var rawCelexId = String(celexId).replace(new RegExp('{{\\s?[A-Z:]{1,50}\\s?}}', 'gi'), '');
        var optimalBinding = act_legacy_findOptimalBinding(attributes, bindings);
        //try to resolve duplicate using matched reference

        offset.rule.ld.forEach(function (placeholder) {
          if (placeholder.indexOf(":ACT:NUMBER:CELEX") !== -1) {
            // use the subnumber from the optimal CELEX id
            var replacementCelex = optimalBinding ? optimalBinding.id.value.slice(6).replace(rawCelexId, '') : '';
            offset = (0,utils/* replace */.HC)(offset, placeholder, replacementCelex);
          }
          if (placeholder.indexOf(":ACT:URL:ELI") !== -1) {
            var replacementEliUrl = optimalBinding ? optimalBinding.eli.value : '';
            offset = (0,utils/* replace */.HC)(offset, placeholder, replacementEliUrl);
          }
        });
      });
    });
    return matches;
  })["catch"](function (error) {
    console.error(error);
    return matches;
  });
};

/**
 * Query by CELEX year prefix and ref number
 * @param {Array<Object>} attributesList
 * @returns {String}
 */
function act_legacy_getQuery(attributesList) {
  var filters = "";
  for (var i = 0; i < attributesList.length; i++) {
    if (i > 0) {
      filters += " || ";
    }
    filters += "(STRSTARTS(?workId, \"celex:\") AND STR(?year)<'1962-01-01' AND ?author=<http://publications.europa.eu/resource/authority/corporate-body/".concat(attributesList[i].author, "> AND ?type='").concat(attributesList[i].type, "'^^xsd:string AND ?no = ").concat(attributesList[i].number, ")");
  }
  var query = "\n    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n    PREFIX cdm:<http://publications.europa.eu/ontology/cdm#>\n    PREFIX skos:<http://www.w3.org/2004/02/skos/core#>\n    PREFIX dc:<http://purl.org/dc/elements/1.1/>\n    PREFIX lang:<http://publications.europa.eu/resource/authority/language/>\n    PREFIX xsd:<http://www.w3.org/2001/XMLSchema#>\n    PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n    PREFIX owl:<http://www.w3.org/2002/07/owl#>\n    \n    SELECT DISTINCT \n        ?workId as ?id \n        ?eli\n        ?year\n        ?type\n        ?author\n        ?no\n        ?title_ as ?title\n    WHERE {  \n        graph ?ge { \n            ?exp cdm:expression_belongs_to_work ?s .\n            ?exp cdm:expression_title ?title_\n        }\n        graph ?g { \n            ?exp cdm:expression_uses_language ?lang\n            filter(?lang=lang:FRA).  \n        } \n    \n        ?s cdm:resource_legal_eli ?eli.\n        ?s cdm:work_id_document ?workId. \n        ?s cdm:resource_legal_type ?type .\n        ?s cdm:resource_legal_number_natural ?no .\n        ?s cdm:resource_legal_year ?year .\n        ?s cdm:work_created_by_agent ?author\n    \n    FILTER (".concat(filters, ") \n}");
  return query;
}

/**
 * Find the best binding to use for the match.
 * 
 * @param {Object} attributes
 * @param {Array} bindings
 * 
 * @returns {Object} binding
 */
function act_legacy_findOptimalBinding(attributes, bindings) {
  // find the right ref
  return bindings.filter(function (binding) {
    return binding.author.value === "http://publications.europa.eu/resource/authority/corporate-body/" + attributes['data-ref-author'] && binding.no.value === attributes['data-ref-no'] && binding.type.value === attributes['data-ref-type'];
  }).pop();
}
;// ./src/lib/transformers/placeholders/rules/eurlex/external_dec.js






/**
 * EEA Joint committee decisions use a different register for numbering acts which does not correspond to the URL:
 * 
 * Example: `DECISION OF THE EEA JOINT COMMITTEE No 188/2019` - http://data.europa.eu/eli/dec/2019/1401/oj
 * 
 * The Committee of the Regions uses a different register for act numbering and thus the captured number does not correspond the ELI/CELEX.
 * 
 * Example: `COMMITTEE OF THE REGIONS DECISION No 18/2020` - https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32020Q1120(01)
 * 
 * Partnership Council decisions use a different register for the act numbering so we need Cellar to resolve the correct identifier/URL.
 * 
 * Example: `Décision No 1/2021 du Conseil de partenariat` -  http://data.europa.eu/eli/dec/2021/356/oj
 * 
 * 
 * Processes placeholders: LD_CELLAR_DEC_NUMBER_CELEX, LD_CELLAR_DEC_NUMBER_ELI
 * @param {Object} matches
 * @returns {Promise<Object>} matches 
 */
var resolveDecisionNumber = function resolveDecisionNumber(matches) {
  // fill CELEX placeholders
  var attributesList = (0,data/* extractCelexAttributes */.gI)(matches, utils/* LD_CELLAR_DEC_NUMBER_CELEX */.iO).map(function (attributes) {
    // strip placeholders
    return {
      number: attributes["data-ref-no"],
      celexId: String(attributes['data-ref-celex']).replace(new RegExp('{{\\s?[A-Z:]+\\s?}}', 'gi'), ''),
      year: String(attributes["data-ref-celex"]).slice(1, 5),
      author: String(attributes["data-ref-author"])
    };
  });
  if (attributesList.length === 0) {
    return Promise.resolve(matches);
  }
  var query = external_dec_getQuery(attributesList);
  var format = 'application/json';
  return (0,request/* getRequestPromise */.p)((0,manager/* getEndpoint */.yP)(manager/* LD_TYPE_CELEX */.wD), "POST", {
    query: query,
    format: format,
    origin: '*'
  }).then(function (response) {
    if (!response || !response.results) {
      return matches;
    }

    // de-duplicate celex ids
    var bindings = response.results.bindings;
    Object.keys(matches).forEach(function (key) {
      matches[key].offsets.forEach(function (offset) {
        var attributes = (0,functions/* extractAttributes */.pt)(offset.views);
        var celexId = (0,data/* extractCelexId */.ip)(attributes);
        if (!celexId) {
          return;
        }
        var rawCelexId = String(celexId).replace(new RegExp('{{\\s?[A-Z:]{1,50}\\s?}}', 'gi'), '');

        //nothing to parse
        if (celexId === rawCelexId) {
          return;
        }
        var match = offset.context || offset.match;
        // check if celexId is unique among the bindings
        var currentBindings = bindings.filter(function (binding) {
          return binding.id.value.includes(rawCelexId);
        });
        var optimalBinding = external_dec_findOptimalBinding(match, currentBindings, attributes);
        //try to resolve duplicate using matched reference

        offset.rule.ld.forEach(function (placeholder) {
          if (placeholder.indexOf(":DEC:NUMBER:CELEX") !== -1) {
            // use the subnumber from the optimal CELEX id
            var replacementCelex = optimalBinding ? optimalBinding.id.value.slice(6).replace(rawCelexId, '') : '';
            offset = (0,utils/* replace */.HC)(offset, placeholder, replacementCelex);
          }
          if (placeholder.indexOf(":DEC:NUMBER:ELI") !== -1) {
            // use the subnumber from the optimal ELI URL
            var eliParts = optimalBinding ? (optimalBinding.eli.value || "").split("/eli/") : [];
            if (eliParts.length > 1) {
              var arr = eliParts[1].match(/^[a-z_]+\/\d+\/(.+)$/i);
              var replacementEli = arr && arr[1] ? arr[1] : "";
              offset = (0,utils/* replace */.HC)(offset, placeholder, replacementEli);
            }
          }
        });
      });
    });
    return matches;
  })["catch"](function (error) {
    console.error(error);
    return matches;
  });
};
function getFilter(attributes) {
  var author = attributes.author;
  var filters = "(STRSTARTS( ?workId, \"celex:".concat(attributes.celexId, "\") AND \n            REGEX(?title_, \"[\u202F\xA0 ]").concat(attributes.number, "/").concat(attributes.year, "\"))");
  switch (author) {
    // partnership council
    case 'http://publications.europa.eu/resource/authority/corporate-body/EURUN':
      filters = "(STRSTARTS( ?workId, \"celex:".concat(attributes.celexId, "\") AND \n            REGEX(?title_, \"^Decision.No.").concat(attributes.number, "/").concat(attributes.year, "\"))");
      break;
    default:
      break;
  }
  return filters;
}

/**
 * Query by CELEX year prefix and ref number
 * @param {Array<Object>} attributesList
 * @returns {String}
 */
function external_dec_getQuery(attributesList) {
  var filters = [];
  for (var i = 0; i < attributesList.length; i++) {
    filters.push("\n        {\n            ?exp cdm:expression_belongs_to_work ?s .\n            ?exp cdm:expression_title ?title_ .\n            ?exp cdm:expression_uses_language ?lang .\n            ?s cdm:work_id_document ?workId . \n            filter(?lang=lang:ENG).  \n\n            ?s cdm:work_created_by_agent <".concat(attributesList[i].author, ">\n            FILTER ").concat(getFilter(attributesList[i]), "\n\n            OPTIONAL {     \n                ?s cdm:resource_legal_eli ?eli.\n            }\n        }"));
  }
  var query = "\nPREFIX cdm:<http://publications.europa.eu/ontology/cdm#>\nPREFIX owl:<http://www.w3.org/2002/07/owl#>\nPREFIX lang:<http://publications.europa.eu/resource/authority/language/>\n        \nSELECT DISTINCT \n    ?workId as ?id\n    ?title_ as ?title\n    ?eli    \nWHERE {\n    ".concat(filters.join(' UNION '), " \n}");
  return query;
}

/**
 * Find the best binding to use for the match.
 * 
 * @param {String} match
 * @param {Array} bindings
 * @param {Object} attributes
 * 
 * @returns {Object} binding
 */
function external_dec_findOptimalBinding(match, bindings, attributes) {
  // find the reference number eg. 18/2020
  return bindings.filter(function (binding) {
    var re = new RegExp(String.fromCharCode(160), "gi");
    var upperTitle = (binding.title.value || "").toUpperCase().replace(re, " ");
    if (attributes['data-ref-author-label'] && upperTitle.indexOf(String(attributes['data-ref-author-label']).toUpperCase()) === -1) {
      return false;
    }
    var parts = (0,utils/* sanitize */.aj)(binding.title.value).split(" ").filter(function (part) {
      return String(part).match("\\d+\\/\\d+");
    });
    var matchParts = (0,utils/* sanitize */.aj)(match).split(" ").filter(function (part) {
      return String(part).match("\\d+\\/\\d+");
    });

    //check whether parts and matchParts have a common reference {{no}}/{{year}}
    if (parts.length > 0 && matchParts.length > 0) {
      return parts[0] === matchParts[0];
    }
    return false;
  }).pop();
}
;// ./src/lib/transformers/placeholders/rules/eurlex/united_nations_reg.js






/**
 * The UN uses a different register for act numbering so we need CELLAR to resolve the correct identifier/URL.
 * Example: `UN Regulation No 155` - http://data.europa.eu/eli/reg/2021/387/oj
 * 
 * Processes placeholders: LD_CELLAR_UN_REG_CELEX, LD_CELLAR_UN_REG_ELI
 * @param {Object} matches
 * @returns {Promise<Object>} matches 
 */
var resolveUnitedNationsRegulationActs = function resolveUnitedNationsRegulationActs(matches) {
  // fill CELEX/ELI placeholders
  var attributesList = (0,data/* extractCelexAttributes */.gI)(matches, utils/* LD_CELLAR_UN_REG */.Kq).map(function (attributes) {
    // strip placeholders
    return {
      number: attributes["data-ref-no"]
    };
  });
  if (attributesList.length === 0) {
    return Promise.resolve(matches);
  }
  var query = united_nations_reg_getQuery(attributesList);
  var format = 'application/json';
  return (0,request/* getRequestPromise */.p)((0,manager/* getEndpoint */.yP)(manager/* LD_TYPE_CELEX */.wD), "POST", {
    query: query,
    format: format,
    origin: '*'
  }).then(function (response) {
    if (!response || !response.results) {
      return matches;
    }

    // de-duplicate celex ids
    var bindings = response.results.bindings;
    Object.keys(matches).forEach(function (key) {
      matches[key].offsets.forEach(function (offset) {
        var attributes = (0,functions/* extractAttributes */.pt)(offset.views);
        var celexId = (0,data/* extractCelexId */.ip)(attributes);
        if (!celexId) {
          return;
        }
        var rawCelexId = String(celexId).replace(new RegExp('{{\\s?[A-Z:]{1,50}\\s?}}', 'gi'), '');

        //nothing to parse
        if (celexId === rawCelexId) {
          return;
        }
        var match = offset.context || offset.match;
        // check if celexId is unique among the bindings
        var currentBindings = bindings.filter(function (binding) {
          return binding.id.value.includes(rawCelexId);
        });
        var optimalBinding = united_nations_reg_findOptimalBinding(match, attributes, currentBindings);
        //try to resolve duplicate using matched reference

        // use the optimal CELEX id
        var replacementCelex = (optimalBinding ? optimalBinding.id.value : '').replace("celex:", "");
        offset = (0,utils/* replace */.HC)(offset, utils/* LD_CELLAR_UN_REG_CELEX */.oO, replacementCelex);

        // use optimal ELI url
        var replacementEli = optimalBinding ? optimalBinding.eli.value : "";
        offset = (0,utils/* replace */.HC)(offset, utils/* LD_CELLAR_UN_REG_ELI */.b0, replacementEli);
      });
    });
    return matches;
  })["catch"](function (error) {
    console.error(error);
    return matches;
  });
};

/**
 * Query by ref number and author
 * @param {Array<Object>} attributesList
 * @returns {String}
 */
function united_nations_reg_getQuery(attributesList) {
  var filters = "";
  for (var i = 0; i < attributesList.length; i++) {
    if (i > 0) {
      filters += " || ";
    }
    filters += "(?type='X'^^xsd:string AND REGEX(?title_, '\\\\bRegulation[\u202F\xA0 ]No[\u202F\xA0 ]".concat(attributesList[i].number, "\\\\b', \"i\"))");
  }
  var query = "\nPREFIX cdm:<http://publications.europa.eu/ontology/cdm#>\nPREFIX owl:<http://www.w3.org/2002/07/owl#>\nPREFIX lang:<http://publications.europa.eu/resource/authority/language/>\n        \nSELECT DISTINCT \n    ?workId as ?id\n    ?title_ as ?title\n    ?eli    \nWHERE {  \n    graph ?ge { \n        ?exp cdm:expression_belongs_to_work ?s .\n        ?exp cdm:expression_title ?title_\n    }\n    graph ?g { \n        ?exp cdm:expression_uses_language ?lang\n        filter(?lang=lang:ENG).  \n    } \n    ?s cdm:resource_legal_eli ?eli.\n    ?s cdm:resource_legal_type ?type .\n    ?s cdm:work_created_by_agent <http://publications.europa.eu/resource/authority/corporate-body/UNECE> . \n    ?s cdm:work_id_document ?workId . \n    FILTER (".concat(filters, ") \n    FILTER (STRSTARTS( ?workId, \"celex:\"))\n}");
  return query;
}

/**
 * Find the best binding to use for the match.
 * 
 * @param {String} match
 * @param {Array} bindings
 * 
 * @returns {Object} binding
 */
function united_nations_reg_findOptimalBinding(match, attributes, bindings) {
  // find the reference number eg. "Regulation No 155"
  return bindings.filter(function (binding) {
    return (0,utils/* sanitize */.aj)(binding.title.value).match("^(UN )?Regulation No " + attributes["data-ref-no"] + "\\b");
  }).pop();
}
;// ./src/lib/transformers/placeholders/rules/eurlex/oj_eli.js






/**
 * Will query Cellar to retrieve the ELI of the act behind an OJ reference - REFTOLINK-1516
 * 
 * Processes placeholders: LD_CELLAR_OJ_CELEX, LD_CELLAR_OJ_TYPE_ELI
 * @param {Object} matches
 * @returns {Promise<Object>} matches 
 */
var resolveOjEli = function resolveOjEli(matches) {
  // fill CELEX placeholders
  var attributesList = (0,data/* extractCelexAttributes */.gI)(matches, utils/* LD_CELLAR_OJ_CELEX */.vv).map(function (attributes) {
    // strip placeholders
    return {
      no: attributes['data-ref-no'],
      eliType: attributes['data-ref-eli-type'],
      year: attributes['data-ref-year'],
      month: attributes['data-ref-month'],
      day: attributes['data-ref-day'],
      date: "".concat(attributes['data-ref-year'], "-").concat(String(attributes['data-ref-month']).padStart(2, '0'), "-").concat(String(attributes['data-ref-day']).padStart(2, '0'))
    };
  });
  if (attributesList.length === 0) {
    return Promise.resolve(matches);
  }
  var query = oj_eli_getQuery(attributesList);
  var format = 'application/json';
  return (0,request/* getRequestPromise */.p)((0,manager/* getEndpoint */.yP)(manager/* LD_TYPE_CELEX */.wD), "POST", {
    query: query,
    format: format,
    origin: '*'
  }).then(function (response) {
    if (!response || !response.results) {
      return matches;
    }

    // de-duplicate celex ids
    var bindings = response.results.bindings;
    Object.keys(matches).forEach(function (key) {
      matches[key].offsets.forEach(function (offset) {
        var attributes = (0,functions/* extractAttributes */.pt)(offset.views);
        var celexId = (0,data/* extractCelexId */.ip)(attributes);
        if (!celexId) {
          return;
        }
        var rawCelexId = String(celexId).replace(new RegExp('{{\\s?[A-Z:]{1,50}\\s?}}', 'gi'), '');

        //nothing to parse
        if (celexId === rawCelexId) {
          return;
        }
        var match = offset.context || offset.match;
        // check if celexId is unique among the bindings
        var currentBindings = bindings.filter(function (binding) {
          return binding.id.value.includes(rawCelexId);
        });
        var optimalBinding = oj_eli_findOptimalBinding(attributes, currentBindings);
        //try to resolve duplicate using matched reference

        offset.rule.ld.forEach(function (placeholder) {
          if (placeholder.indexOf(":OJ:CELEX") !== -1) {
            // use the celex id
            var replacementCelex = optimalBinding ? optimalBinding.id.value.replace('celex:', '') : 'INVALID'; // 'INVALID' will be discarded by the `cellar-exists-celex` attribute
            offset = (0,utils/* replace */.HC)(offset, placeholder, replacementCelex);
          }
          if (placeholder.indexOf(":OJ:TYPE:ELI") !== -1) {
            if (attributes.eliType) {
              offset = (0,utils/* replace */.HC)(offset, placeholder, attributes.eliType);
            } else {
              // use the type from the optimal ELI URL
              var eliParts = optimalBinding ? (optimalBinding.eli.value || "").split("/eli/") : [];
              if (eliParts.length > 1) {
                var arr = eliParts[1].match(/^([a-z_]+)\/\d+\/.+$/i);
                var replacementEli = arr && arr[1] ? arr[1] : "";
                offset = (0,utils/* replace */.HC)(offset, placeholder, replacementEli);
              }
            }
          }
        });
      });
    });
    return matches;
  })["catch"](function (error) {
    console.error(error);
    return matches;
  });
};

/**
 * Query by CELEX year prefix and ref number
 * @param {Array<Object>} attributesList
 * @returns {String}
 */
function oj_eli_getQuery(attributesList) {
  var filters = "";
  for (var i = 0; i < attributesList.length; i++) {
    if (i > 0) {
      filters += " || ";
    }
    filters += "(?natNumber IN (".concat(attributesList[i].no, ") AND (STR(?ojDatePublication) = '").concat(attributesList[i].date, "') AND regex(str(?workId), \"celex:\"))");
  }
  var query = "\n    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n    PREFIX cdm:<http://publications.europa.eu/ontology/cdm#>\n    PREFIX skos:<http://www.w3.org/2004/02/skos/core#>\n    PREFIX dc:<http://purl.org/dc/elements/1.1/>\n    PREFIX lang:<http://publications.europa.eu/resource/authority/language/>\n    PREFIX xsd:<http://www.w3.org/2001/XMLSchema#>\n    PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n    PREFIX owl:<http://www.w3.org/2002/07/owl#>\n\n    SELECT DISTINCT \n        ?workId as ?id \n        ?ojDatePublication\n        ?year\n        ?natNumber\n        ?eli\n    WHERE {  \n        graph ?ge { \n            ?exp cdm:expression_belongs_to_work ?s .\n            ?exp cdm:expression_title ?title_\n        } \n        ?s cdm:resource_legal_year ?year .\n        ?s cdm:resource_legal_number_natural ?natNumber .\n        ?s cdm:work_id_document ?workId.\n        ?s cdm:resource_legal_eli ?eli .\n        OPTIONAL {\n            ?s cdm:resource_legal_published_in_official-journal ?q .\n            ?q cdm:publication_general_date_publication ?ojDatePublicationOld .\n        }\n        OPTIONAL {\n            FILTER (!BOUND(?ojDatePublicationOld))\n            ?s cdm:official-journal-act_date_publication ?ojDatePublicationNew .\n        }\n        BIND(IF(BOUND(?ojDatePublicationOld), ?ojDatePublicationOld, ?ojDatePublicationNew) as ?ojDatePublication)\n\n        FILTER (".concat(filters, ") \n}");
  return query;
}

/**
 * Find the best binding to use for the match.
 * 
 * @param {String} match
 * @param {Array} bindings
 * 
 * @returns {Object} binding
 */
function oj_eli_findOptimalBinding(attributes, bindings) {
  return bindings.filter(function (binding) {
    return binding.ojDatePublication.value === "".concat(attributes['data-ref-year'], "-").concat(String(attributes['data-ref-month']).padStart(2, '0'), "-").concat(String(attributes['data-ref-day']).padStart(2, '0')) && binding.year.value === String(attributes['data-ref-year']) && binding.natNumber.value === String(attributes['data-ref-no']);
  }).pop();
}
;// ./src/lib/transformers/filters/celex.js






/**
 * All targets that have a CELEX id (EU legal acts, EU Treaties, EU Case law) will be checked against the Cellar graph.
 * When not found the targets will be discarded (removed from the detection results).
 * @param {Object} matches
 * @returns {Promise<Object>} - the filtered `matches 
 */
function filterCelexTargets(matches) {
  return new Promise(function (resolve, reject) {
    // first remove empty ones
    matches = removeCelexIds(matches, [""]);
    // collect targets that need to be checked
    var celexIds = [];
    var celexActiveIds = []; // if request fails we will automatically remove these
    Object.keys(matches).forEach(function (key) {
      matches[key].offsets.forEach(function (offset) {
        // targets to be inspected
        var targets = offset.rule.views.filter(function (v) {
          return (0,utils/* hasItem */.wP)(v.ldCondition, utils/* LD_CELEX_CONDITION */.NA) || (0,utils/* hasItem */.wP)(v.ldCondition, utils/* LD_ACTIVE */.KA);
        }).map(function (t) {
          return t.target;
        });
        var filteredViews = {};
        Object.keys(offset.views).forEach(function (target) {
          if (targets.indexOf(target) !== -1) {
            filteredViews[target] = offset.views[target];
          }
        });
        var attributes = (0,functions/* extractAttributes */.pt)(filteredViews);
        var extractedCelexIds = (0,data/* extractCelexIdList */.gy)(attributes);
        celexIds = celexIds.concat(extractedCelexIds);
      });
    });
    if (celexIds.length === 0) {
      resolve(matches);
      return;
    }

    // unique ids only
    celexIds = celexIds.filter(function (v, i, a) {
      return a.indexOf(v) === i;
    });
    var query = getCelexLookupQuery(celexIds, R2L.getLanguage() || "ENG");
    var format = 'application/json';
    (0,request/* getRequestPromise */.p)((0,manager/* getEndpoint */.yP)(manager/* LD_TYPE_CELEX */.wD), "POST", {
      query: query,
      format: format,
      origin: '*'
    }).then(function (response) {
      if (!response || !response.results) {
        resolve(matches);
        return;
      }
      var foundIds = response.results.bindings.map(function (binding) {
        var id = binding && binding.id ? binding.id.value : null;
        return id.replace("celex:", "");
      });
      var missingIds = celexIds.filter(function (id) {
        return foundIds.indexOf(id) === -1;
      });

      // remove missing celex ids
      matches = removeCelexIds(matches, missingIds);
      resolve(matches);
    })["catch"](function (err) {
      console.error(err);
      // remove them all if the request fails
      var activeCelexIds = []; // if request fails we will automatically remove these
      Object.keys(matches).forEach(function (key) {
        matches[key].offsets.forEach(function (offset) {
          // targets to be inspected
          var activeTargets = offset.rule.views.filter(function (v) {
            return (0,utils/* hasItem */.wP)(v.ldCondition, utils/* LD_ACTIVE */.KA);
          }).map(function (t) {
            return t.target;
          });
          var activeFilteredViews = {};
          Object.keys(offset.views).forEach(function (target) {
            if (activeTargets.indexOf(target) !== -1) {
              activeFilteredViews[target] = offset.views[target];
            }
          });
          var activeAttributes = (0,functions/* extractAttributes */.pt)(activeFilteredViews);
          var activeExtractedCelexIds = (0,data/* extractCelexIdList */.gy)(activeAttributes);
          activeCelexIds = activeCelexIds.concat(activeExtractedCelexIds);
        });
      });
      matches = removeCelexIds(matches, activeCelexIds);
      resolve(matches);
    });
  });
}

/**
 * Build CELEX lookup query
 * @param {Array<string>} celexIds 
 * @returns {String} 
 */
function getCelexLookupQuery(celexIds, langISO3) {
  // unique ids only
  celexIds = celexIds.filter(function (v, i, a) {
    return a.indexOf(v) === i;
  });
  var filters = "FILTER (?workId IN (";
  for (var i = 0; i < celexIds.length; i++) {
    filters += "\"celex:".concat(celexIds[i], "\", \"celex:").concat(celexIds[i], "\"^^xsd:string"); // query both types
    if (i < celexIds.length - 1) {
      filters += ",";
    }
  }
  filters += "))";
  var query = "\n        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n        PREFIX cdm:<http://publications.europa.eu/ontology/cdm#>\n        PREFIX skos:<http://www.w3.org/2004/02/skos/core#>\n        PREFIX dc:<http://purl.org/dc/elements/1.1/>\n        PREFIX lang:<http://publications.europa.eu/resource/authority/language/>\n        PREFIX xsd:<http://www.w3.org/2001/XMLSchema#>\n        PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n        PREFIX owl:<http://www.w3.org/2002/07/owl#>\n\n        SELECT DISTINCT \n            ?workId as ?id \n        WHERE {  \n            graph ?ge { \n                ?exp cdm:expression_belongs_to_work ?s .\n                ?exp cdm:expression_title ?title_\n            }";

  // disable the language filter - do not exclude the act if the specific language does not exist. REFTOLINK-2016
  if (langISO3 && false) // removed by dead control flow
{}
  query += " \n            ?s cdm:work_id_document ?workId.\n            ".concat(filters, "   \n        }");
  return query;
}

/**
 * Remove LD_ACTIVE targets which have the ids we are looking for
 * @param {Object} matches 
 * @param {Array<String>} ids - an aggregate list of CELEX/ECLI/ELI/HANDOC/CIS/PROC/CONSIL ids
 * 
 * @return {Object} matches
 */
function removeIds(matches, ids) {
  Object.keys(matches).forEach(function (key) {
    matches[key].offsets.forEach(function (offset) {
      // targets to be inspected
      var targets = offset.rule.views.filter(function (v) {
        return (0,utils/* hasItem */.wP)(v.ldCondition, utils/* LD_ACTIVE */.KA);
      }).map(function (t) {
        return t.target;
      });
      ids.forEach(function (id) {
        // build a regex str  
        var regexStr = new RegExp("=\"".concat((0,functions/* regExpEscape */.fI)(id), "\""));
        offset.alternatives = offset.alternatives.filter(function (alt) {
          return targets.indexOf(alt.viewName) === -1 || regexStr.test(alt.view) === false;
        });
        offset.alternatives.map(function (alternative) {
          // remove the celex id from the view
          alternative.view = alternative.view.replace(regexStr, "");
        });
        var newViews = {};
        Object.keys(offset.views).forEach(function (target) {
          if (targets.indexOf(target) === -1 || regexStr.test(offset.views[target]) === false) {
            newViews[target] = offset.views[target].replace(regexStr, "");
          }
        });
        offset.views = newViews;
      });
    });
  });
  return matches;
}

/**
 * @param {Object} matches 
 * @param {Array<string>} celexIds
 * @returns {Object} matches 
 */
function removeCelexIds(matches, celexIds) {
  Object.keys(matches).forEach(function (key) {
    matches[key].offsets.forEach(function (offset) {
      // targets to be inspected
      var targets = offset.rule.views.filter(function (v) {
        return (0,utils/* hasItem */.wP)(v.ldCondition, utils/* LD_CELEX_CONDITION */.NA) || (0,utils/* hasItem */.wP)(v.ldCondition, utils/* LD_ACTIVE */.KA);
      }).map(function (t) {
        return t.target;
      });
      celexIds.forEach(function (celexId) {
        // celex are not unique across views. might use ordinal suffixes eg. data-ref-celex-1, data-ref-celex-2 etc.
        // build a regex str for all possible CELEX suffixes 
        var regexCelexStr = new RegExp("data-ref-celex(?:".concat(manager/* LD_CELEX_SUFFIXES */.zB.join("|"), ")=\"").concat((0,functions/* regExpEscape */.fI)(celexId), "\""));
        offset.alternatives = offset.alternatives.filter(function (alt) {
          return targets.indexOf(alt.viewName) === -1 || regexCelexStr.test(alt.view) === false;
        });
        offset.alternatives.map(function (alternative) {
          // remove the celex id from the view
          alternative.view = alternative.view.replace(regexCelexStr, "");
        });
        var newViews = {};
        Object.keys(offset.views).forEach(function (target) {
          if (targets.indexOf(target) === -1 || regexCelexStr.test(offset.views[target]) === false) {
            newViews[target] = offset.views[target].replace(regexCelexStr, "");
          }
        });
        offset.views = newViews;
      });
    });
  });
  return matches;
}
;// ./src/lib/transformers/filters/oj.js





/**
 * Official Journal targets that have a `uriserv` URI will be checked against the Cellar graph.
 * When not found the targets will be discarded (removed from detection results). 
 * @param {Object} matches
 * @returns {Promise<Object>} - the filtered `matches 
 */
function filterOjTargets(matches) {
  return new Promise(function (resolve, reject) {
    // collect targets that need to be checked
    var attributesList = [];
    Object.keys(matches).forEach(function (key) {
      matches[key].offsets.forEach(function (offset) {
        // targets to be inspected
        var targets = offset.rule.views.filter(function (v) {
          return v.ldCondition === utils/* LD_OJ_CONDITION */.dq;
        }).map(function (t) {
          return t.target;
        });
        var filteredViews = {};
        Object.keys(offset.views).forEach(function (target) {
          if (targets.indexOf(target) !== -1) {
            filteredViews[target] = offset.views[target];
          }
        });
        var attributes = (0,functions/* extractAttributes */.pt)(filteredViews);
        if (attributes["data-ref-oj"] && attributes["data-ref-uriserv"]) {
          attributesList.push({
            oj: attributes["data-ref-oj"],
            uriserv: attributes["data-ref-uriserv"]
          });
        }
      });
    });
    if (attributesList.length === 0) {
      resolve(matches);
      return;
    }
    var query = oj_getQuery(attributesList);
    var format = 'application/json';
    (0,request/* getRequestPromise */.p)((0,manager/* getEndpoint */.yP)(manager/* LD_TYPE_CELEX */.wD), "POST", {
      query: query,
      format: format,
      origin: '*'
    }).then(function (response) {
      if (!response || !response.results) {
        resolve(matches);
        return;
      }
      var missingItems = attributesList.filter(function (item) {
        var found = response.results.bindings.filter(function (binding) {
          var ojId = binding && binding.ojId ? binding.ojId.value : null;
          var uriserv = binding && binding.uriserv ? binding.uriserv.value : null;
          return ojId === item.oj && uriserv.indexOf(item.uriserv) !== -1;
        }).length;
        return !found;
      });

      // remove missing items
      matches = removeOjTargets(matches, missingItems);
      matches = appendCelexIds(matches, response);
      resolve(matches);
    })["catch"](function (err) {
      console.error(err);
      // no removal
      resolve(matches);
    });
  });
}

/**
 * Eliminate OJ targets which don't have a valid URL
 * @param {Object} matches 
 * @param {Array<object>} items 
 */
function removeOjTargets(matches, items) {
  Object.keys(matches).forEach(function (key) {
    matches[key].offsets.forEach(function (offset) {
      // targets to be inspected
      var targets = offset.rule.views.filter(function (v) {
        return v.ldCondition === utils/* LD_OJ_CONDITION */.dq;
      }).map(function (t) {
        return t.target;
      });
      items.forEach(function (item) {
        var ojStr = "data-ref-uriserv=\"".concat(item.uriserv, "\"");
        offset.alternatives = offset.alternatives.filter(function (alt) {
          return targets.indexOf(alt.viewName) === -1 || alt.view.indexOf(ojStr) === -1;
        });
        offset.alternatives.map(function (alternative) {
          // remove the oj id from the view
          alternative.view = alternative.view.replace(ojStr, "");
        });
        var newViews = {};
        Object.keys(offset.views).forEach(function (target) {
          if (targets.indexOf(target) === -1 || offset.views[target].indexOf(ojStr) === -1) {
            newViews[target] = offset.views[target].replace(ojStr, "");
          }
        });
        offset.views = newViews;
      });
    });
  });
  return matches;
}

/**
 * Append CELEX ids to the targets
 * @param {Object} matches 
 * @param {Object} items 
 */
function appendCelexIds(matches, response) {
  Object.keys(matches).forEach(function (key) {
    matches[key].offsets.forEach(function (offset) {
      response.results.bindings.forEach(function (binding) {
        if (!binding.celexId || !binding.celexId.value) {
          return;
        }
        var celexId = String(binding.celexId.value).toUpperCase().replace("CELEX:", "");
        var uriservUrlValue = String(binding.uriserv ? binding.uriserv.value : '').split('.').slice(0, -1).join('.');
        var uriservValue = uriservUrlValue.split('/uriserv/')[1] || '';
        var ojStr = "data-ref-uriserv=\"".concat(uriservValue, "\"");
        offset.alternatives = offset.alternatives.map(function (alt) {
          alt.view;
          if (alt.view.indexOf(ojStr) > -1) {
            alt.view = alt.view.replace(ojStr, ojStr + " data-ref-celex=\"" + celexId + "\"");
          }
          return alt;
        });
        var newViews = {};
        Object.keys(offset.views).forEach(function (target) {
          if (offset.views[target].indexOf(ojStr) > -1) {
            newViews[target] = offset.views[target].replace(ojStr, ojStr + " data-ref-celex=\"" + celexId + "\"");
          } else {
            newViews[target] = offset.views[target];
          }
        });
        offset.views = newViews;
      });
    });
  });
  return matches;
}

/**
 * Build OJ uri lookup query
 * @param {Array<Object>} ojItems 
 * @returns {String}
 */
function oj_getQuery(ojItems) {
  var idFilters = "";
  var uriFilters = "";
  for (var i = 0; i < ojItems.length; i++) {
    idFilters += "\"".concat(ojItems[i].oj, "\"^^xsd:string");
    uriFilters += "(REGEX(?manifUrl, \"".concat(ojItems[i].uriserv, "\"))");
    if (i < ojItems.length - 1) {
      idFilters += ",";
      uriFilters += " || ";
    }
  }
  var query = "\nPREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\nPREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\nPREFIX cdm:<http://publications.europa.eu/ontology/cdm#>\nPREFIX skos:<http://www.w3.org/2004/02/skos/core#>\nPREFIX dc:<http://purl.org/dc/elements/1.1/>\nPREFIX lang:<http://publications.europa.eu/resource/authority/language/>\nPREFIX xsd:<http://www.w3.org/2001/XMLSchema#>\nPREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>\nPREFIX owl:<http://www.w3.org/2002/07/owl#>\n\nSELECT DISTINCT ?celexId ?ojId ?manifUrl as ?uriserv WHERE {\n    graph ?ge { \n        ?exp cdm:expression_belongs_to_work ?s \n    }\n   \n    # MANIFEST \n    ?manif cdm:manifestation_manifests_expression ?exp. \n    ?manif owl:sameAs ?manifUrl .\n\n    OPTIONAL {\n        ?s owl:sameAs ?celexResourceUrl .\n        FILTER (REGEX(?celexResourceUrl, \"/celex/\"))\n        ?celexWork owl:sameAs ?celexResourceUrl .\n        ?celexWork cdm:work_id_document ?celexId .\n        FILTER (REGEX(STR(?celexId), \"celex:\"))\n    }\n\n    ?s cdm:resource_legal_published_in_official-journal ?q .\n    ?q cdm:work_id_document ?ojId\n     \n    # first filter on all OJ ids         \n    FILTER (?ojId IN (".concat(idFilters, "))\n   \n    # filter urls\n    FILTER (\n        ").concat(uriFilters, "\n    )\n}\n    ");
  return query;
}
;// ./src/lib/transformers/filters/consil.js





/**
 * Official Journal targets that have a `consil` identifier will be checked against the Cellar graph.
 * When not found the targets will be discarded (removed from detection results). 
 * @param {Object} matches
 * @returns {Promise<Object>} - the filtered `matches 
 */
function filterConsilTargets(matches) {
  return new Promise(function (resolve, reject) {
    // collect targets that need to be checked
    var attributesList = [];
    Object.keys(matches).forEach(function (key) {
      matches[key].offsets.forEach(function (offset) {
        // targets to be inspected
        var targets = offset.rule.views.filter(function (v) {
          return v.ldCondition === utils/* LD_CONSIL_CONDITION */.Ev;
        }).map(function (t) {
          return t.target;
        });
        var filteredViews = {};
        Object.keys(offset.views).forEach(function (target) {
          if (targets.indexOf(target) !== -1) {
            filteredViews[target] = offset.views[target];
          }
        });
        var attributes = (0,functions/* extractAttributes */.pt)(filteredViews);
        if (attributes["data-ref-consil"]) {
          attributesList.push({
            consil: attributes["data-ref-consil"]
          });
        }
      });
    });
    if (attributesList.length === 0) {
      resolve(matches);
      return;
    }
    var query = consil_getQuery(attributesList);
    var format = 'application/json';
    (0,request/* getRequestPromise */.p)((0,manager/* getEndpoint */.yP)(manager/* LD_TYPE_CELEX */.wD), "POST", {
      query: query,
      format: format,
      origin: '*'
    }).then(function (response) {
      if (!response || !response.results) {
        resolve(matches);
        return;
      }
      var missingItems = attributesList.filter(function (item) {
        var found = response.results.bindings.filter(function (binding) {
          var consilId = binding && binding.id ? binding.id.value : null;
          return consilId === "consil:" + item.consil;
        }).length;
        return !found;
      });

      // remove missing items
      matches = removeConsilTargets(matches, missingItems);
      resolve(matches);
    })["catch"](function (err) {
      console.error(err);
      // no removal
      resolve(matches);
    });
  });
}

/**
 * Eliminate Consil targets which don't have a valid URL
 * @param {Object} matches 
 * @param {Array<object>} items 
 */
function removeConsilTargets(matches, items) {
  Object.keys(matches).forEach(function (key) {
    matches[key].offsets.forEach(function (offset) {
      // targets to be inspected
      var targets = offset.rule.views.filter(function (v) {
        return v.ldCondition === utils/* LD_CONSIL_CONDITION */.Ev;
      }).map(function (t) {
        return t.target;
      });
      items.forEach(function (item) {
        var consilStr = "data-ref-consil=\"".concat(item.consil, "\"");
        offset.alternatives = offset.alternatives.filter(function (alt) {
          return targets.indexOf(alt.viewName) === -1 || alt.view.indexOf(consilStr) === -1;
        });
        offset.alternatives.map(function (alternative) {
          // remove the consil id from the view
          alternative.view = alternative.view.replace(consilStr, "");
        });
        var newViews = {};
        Object.keys(offset.views).forEach(function (target) {
          if (targets.indexOf(target) === -1 || offset.views[target].indexOf(consilStr) === -1) {
            newViews[target] = offset.views[target].replace(consilStr, "");
          }
        });
        offset.views = newViews;
      });
    });
  });
  return matches;
}

/**
 * Build lookup query
 * @param {Array<Object>} consilItems 
 * @returns {String}
 */
function consil_getQuery(consilItems) {
  var idFilters = "";
  if (consilItems.length === 0) {
    idFilters = "?id = 0";
  }
  for (var i = 0; i < consilItems.length; i++) {
    idFilters += "?id = \"consil:".concat(consilItems[i].consil, "\"^^xsd:string");
    if (i < consilItems.length - 1) {
      idFilters += " || ";
    }
  }
  var query = "\nPREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\nPREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\nPREFIX cdm:<http://publications.europa.eu/ontology/cdm#>\nPREFIX skos:<http://www.w3.org/2004/02/skos/core#>\nPREFIX dc:<http://purl.org/dc/elements/1.1/>\nPREFIX lang:<http://publications.europa.eu/resource/authority/language/>\nPREFIX xsd:<http://www.w3.org/2001/XMLSchema#>\nPREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>\nPREFIX owl:<http://www.w3.org/2002/07/owl#>\n\nSELECT DISTINCT ?id WHERE {\n\n    ?s cdm:work_id_document ?id\n            \n    FILTER (".concat(idFilters, ")\n\n}\n    ");
  return query;
}
;// ./src/lib/transformers/filter.js








/**
 * Will filter targets annotated with an `ld-condition` which are not found in the Cellar graph. Targets filtered: 
 *   - CELEX - views annotated with (ld-condition="cellar-exists-celex") - will lookup the CELEX id in the graph and remove the target if not found
 *   - OJ - views annotated with (ld-condition="cellar-exists-oj") - will lookup the manifest URL in the graph and remove the target if not found
 *   - CONSIL - views annotated with (ld-condition="cellar-exists-consil") - will lookup the CONSIL id in the graph and remove the target if not found
 * 
 * @param {Object} matches
 * @returns {Promise<Object>} - the filtered `matches`
 */
function filterTargets(matches) {
  if (!R2L.options.metadata || !R2L.hasLinkedDataMode(settings/* LD_MODE_CHECK_EXISTS */.Np)) {
    var result = clearLdTargets(matches);
    return Promise.resolve(result);
  } else {
    // sequential filtering - first filter CELEX targets then OJ
    return filterCelexTargets(matches).then(function (matches) {
      return filterOjTargets(matches);
    }).then(function (matches) {
      return filterConsilTargets(matches);
    }).then(function (matches) {
      return matches;
    })["catch"](function (err) {
      console.error(err);
      return matches;
    });
  }
}

/**
 * Remove targets that need filtering (ld-condition="ld-active") (used when LD is not available)
 * @param {Object} matches
 * @returns {Object} filtered matches 
 */
function clearLdTargets(matches) {
  // collect targets that need to be checked
  var ids = [];
  Object.keys(matches).forEach(function (key) {
    matches[key].offsets.forEach(function (offset) {
      // targets to be inspected
      var targets = offset.rule.views.filter(function (v) {
        return (0,utils/* hasItem */.wP)(v.ldCondition, utils/* LD_ACTIVE */.KA);
      }).map(function (t) {
        return t.target;
      });
      var filteredViews = {};
      var hasItems = false;
      Object.keys(offset.views).forEach(function (target) {
        if (targets.indexOf(target) !== -1) {
          filteredViews[target] = offset.views[target];
          hasItems = true;
        }
      });
      if (hasItems) {
        var attributes = (0,functions/* extractAttributes */.pt)(filteredViews);
        var _ids = (0,data/* extractIdList */.V7)(attributes);
        ids = ids.concat(_ids);
      }
    });
  });
  if (ids.length === 0) {
    return matches;
  }

  // unique ids only
  ids = ids.filter(function (v, i, a) {
    return a.indexOf(v) === i;
  });
  matches = removeIds(matches, ids);
  return matches;
}
;// ./src/lib/transformers/placeholders/rules/eurlex/subdivision.js

/**
 * Resolve subdivisions - inject a context legal act (ELI) to use with detected subdivisions
 * The base ELI is fetched from the $LD_ELI_BASE_URL global (@see R2L.settings.constants)
 * 
 * Processes placeholders: ELI_BASE_URL
 * @param {Object} matches
 * @returns {Promise<Object>}  
 */
var resolveEliBaseUrl = function resolveEliBaseUrl(matches) {
  Object.keys(matches).forEach(function (key) {
    matches[key].offsets.forEach(function (offset) {
      offset.rule.ld.forEach(function (placeholder) {
        if (placeholder === utils/* LD_ELI_BASE_URL */.u2) {
          var replacementEliUrl = R2L.getConstant(utils/* LD_ELI_BASE_URL */.u2) || "";
          offset = (0,utils/* replace */.HC)(offset, placeholder, replacementEliUrl);
        }
      });
    });
  });
  return Promise.resolve(matches);
};
;// ./src/lib/transformers/placeholders/rules/eucase/eucase.js






var BATCH_SIZE = 60;

/**
 * The CELEX ids of EU cases is not deterministic for Orders, Judgments, Opinions. For example: 
 *   `T-184/01` order has CELEX id 62001TO0184(02)
 *   `T-184/01 R` order has CELEX id 62001TO0184
 * 
 * This transformer will:
 *   - query all CELEX orders which contain '62001TO0184';
 *   - match the titles with the case label eg. 'T-184/01 R';
 *   - resolve the correct CELEX ids matching the case label;
 * 
 * @param {Object} matches
 * 
 * @return {Promise<Object>} 
 */
var resolveEucaseCelexIds = function resolveEucaseCelexIds(matches) {
  // fill CELEX placeholders
  var attributesArr = (0,data/* extractCelexAttributes */.gI)(matches, utils/* LD_CELLAR_EUCASE_SUBNUMBER_CELEX */.Wx);
  var celexMap = {};
  attributesArr.forEach(function (attributes) {
    var celexId = null;
    Object.keys(attributes).forEach(function (key) {
      if (attributes[key].indexOf(utils/* LD_CELLAR_EUCASE_SUBNUMBER_CELEX */.Wx) > -1) {
        celexId = attributes[key];
        var suffix = key.split("celex")[1] || '';
        celexMap[celexId] = celexMap[celexId] || [];
        if (attributes['data-ref-label' + suffix]) {
          celexMap[celexId].push(attributes['data-ref-label' + suffix]);
        }
      }
    });
  });

  // nothing to check
  if (Object.keys(celexMap).length === 0) {
    return Promise.resolve(matches);
  }
  return getBatchRequestPromise(celexMap, BATCH_SIZE).then(function (response) {
    if (!response || !response.results) {
      return matches;
    }
    var newCelexMap = {};
    Object.keys(celexMap).forEach(function (celexId) {
      var labels = celexMap[celexId];
      labels.forEach(function (label) {
        // reconcile the celex ids with the case labels (with/without the 'R' suffix)
        response.results.bindings.forEach(function (binding) {
          // we look for the pattern: `<caseLabel>.` (with an ending dot). Example: 
          //   Affaire C-78/14 P-R.

          if (!binding.title || !binding.title.value) {
            return;
          }

          // clean spaces
          var val = String(binding.title.value).split("#").pop().replace(/[\u202F\u00A0-]/g, " ").replace(/ /g, "");
          if (val.indexOf(String(label).replace(/[\s-]/g, '') + '.') > -1 && celexId.slice(0, 10) === binding.id.value.replace("celex:", "").slice(0, 10)) {
            //matched
            newCelexMap[celexId] = newCelexMap[celexId] || [];
            newCelexMap[celexId].push({
              celexId: binding.id.value.replace('celex:', ''),
              label: label
            });
          }
          // if there is no label match we will keep the Order/Judgment/Opinion document of the main CELEX id, there is no target filtering happening here
        });
      });
    });
    Object.keys(matches).forEach(function (key) {
      matches[key].offsets.forEach(function (offset) {
        var attributes = (0,functions/* extractAttributes */.pt)(offset.views);
        var celexIds = (0,data/* extractCelexIdList */.gy)(attributes);
        celexIds = celexIds.filter(function (celexId) {
          return celexId.indexOf(utils/* LD_CELLAR_EUCASE_SUBNUMBER_CELEX */.Wx) > -1;
        });
        if (celexIds.length === 0) {
          return;
        }
        celexIds.forEach(function (celexId) {
          // find in newCelexMap
          var finalCelexIds = newCelexMap[celexId] || [];
          finalCelexIds.forEach(function (finalCelexIdData) {
            var finalCelexId = finalCelexIdData.celexId;
            var finalLabel = finalCelexIdData.label;
            var regex = new RegExp("data-ref-label(?:-\\d+)?=\"" + (0,functions/* regExpEscape */.fI)(finalLabel) + "\"", "i");

            // raw replacement
            Object.keys(offset.views).forEach(function (key) {
              if (regex.test(String(offset.views[key]))) {
                offset.views[key] = String(offset.views[key]).replaceAll(celexId, finalCelexId);
              }
            });
            offset.alternatives.forEach(function (alternative) {
              if (regex.test(String(alternative.view))) {
                alternative.view = String(alternative.view).replaceAll(celexId, finalCelexId);
              }
            });
          });
        });
      });
    });
    return matches;
  })["catch"](function (error) {
    console.error(error);
    return matches;
  });
};
function getBatchRequestPromise(celexMap, batchSize) {
  var promises = [];
  var celexIds = Object.keys(celexMap);
  var format = 'application/json';
  var chunks = [];
  for (var i = 0; i < celexIds.length; i += batchSize) {
    chunks.push(celexIds.slice(i, i + batchSize));
  }
  chunks.forEach(function (chunk) {
    var query = eucase_getQuery(chunk);
    promises.push((0,request/* getRequestPromise */.p)((0,manager/* getEndpoint */.yP)(manager/* LD_TYPE_CELEX */.wD), "POST", {
      query: query,
      format: format,
      origin: '*'
    }));
  });
  return Promise.all(promises).then(function (responses) {
    // merge all results together
    var aggResponse = {
      results: {
        head: responses[0] ? responses[0].head : {},
        bindings: [],
        ordered: true,
        distinct: false
      }
    };
    responses.forEach(function (response) {
      if (response && response.results) {
        aggResponse.results.bindings = aggResponse.results.bindings.concat(response.results.bindings);
      }
    });
    return aggResponse;
  });
}
function eucase_getQuery(celexIds) {
  var filters = "";
  var i = 0;
  celexIds.forEach(function (celexId) {
    if (i > 0) {
      filters += " || ";
    }
    filters += "(STRSTARTS(STR(?workId), \"celex:".concat(celexId.replace('{{ LD:CELLAR:EUCASE:SUBNUMBER:CELEX }}', ''), "\"))");
    i++;
  });
  var str = "\n    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n    PREFIX cdm:<http://publications.europa.eu/ontology/cdm#>\n    PREFIX skos:<http://www.w3.org/2004/02/skos/core#>\n    PREFIX dc:<http://purl.org/dc/elements/1.1/>\n    PREFIX lang:<http://publications.europa.eu/resource/authority/language/>\n    PREFIX xsd:<http://www.w3.org/2001/XMLSchema#>\n    PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n    PREFIX owl:<http://www.w3.org/2002/07/owl#>\n\n    SELECT DISTINCT \n        ?workId as ?id ?title\n    WHERE {  \n        graph ?ge { \n            ?exp cdm:expression_belongs_to_work ?s .\n            ?exp cdm:expression_title ?title .\n            ?exp cdm:expression_uses_language ?lang\n            FILTER (?lang IN (lang:FRA))\n        } \n        ?s cdm:resource_legal_id_sector \"6\"^^xsd:string .\n        ?s cdm:work_has_resource-type ?resourceType .\n        FILTER (\n            ?resourceType=<http://publications.europa.eu/resource/authority/resource-type/ORDER> || \n            ?resourceType=<http://publications.europa.eu/resource/authority/resource-type/OPIN_JUR> ||\n            ?resourceType=<http://publications.europa.eu/resource/authority/resource-type/JUDG> \n        )  .\n        \n        ?s cdm:work_id_document ?workId.\n\n        FILTER ((".concat(filters, ") AND !REGEX(STR(?workId), \"_INF\", \"i\")) \n    }\n    ORDER BY ?workId\n");
  return str;
}
var removeEucaseJoinedJudgements = function removeEucaseJoinedJudgements(matches) {
  var regex = new RegExp("{{\\s?" + utils/* LD_CELLAR_EUCASE_JOINED_JUDGEMENT */.i0 + "\\s?}}");
  Object.keys(matches).forEach(function (key) {
    matches[key].offsets.forEach(function (offset) {
      var newViews = {};
      var newAlternatives = [];
      // raw replacement
      Object.keys(offset.views).forEach(function (key) {
        if (!regex.test(offset.views[key])) {
          newViews[key] = offset.views[key];
        }
      });
      offset.views = newViews;
      offset.alternatives.forEach(function (alternative) {
        if (!regex.test(String(alternative.view))) {
          newAlternatives.push(alternative);
        }
        offset.alternatives = newAlternatives;
      });
    });
  });
  return matches;
};
var resolveEucaseJoinedJudgements = function resolveEucaseJoinedJudgements(matches) {
  return new Promise(function (resolve, reject) {
    // advanced linked data mode must be enabled
    if (R2L.options.linkedDataMode.indexOf(settings/* LD_ADVANCED_MODE_EUCASE_JOINED_JUDGEMENT */.VN) === -1) {
      // clean them up first
      return resolve(removeEucaseJoinedJudgements(matches));
    }

    // get joined case data
    R2L.ldm.getJoinedCaseData().then(function (joinedCaseData) {
      // loop matches and see if they're in the joined cases list
      // build a map for fast lookup
      var fastCaseLabelLookupMap = {};
      joinedCaseData.results.bindings.map(function (binding) {
        var caseLabels = binding.title.value.split(",").map(function (cl) {
          return cl.replace(/\s/g, "").replace("‑", "-");
        });
        // we are not interested in the first item of the list (check if position > 0) as that is the main case. 
        caseLabels.forEach(function (caseLabel, index) {
          if (index > 0) {
            fastCaseLabelLookupMap[caseLabel] = (binding.id ? binding.id.value : '').replace('celex:', '');
          }
        });
      });
      Object.keys(matches).forEach(function (key) {
        matches[key].offsets.forEach(function (offset) {
          var attributes = (0,functions/* extractAttributes */.pt)(offset.views);
          var celexIds = (0,data/* extractCelexIdList */.gy)(attributes);
          celexIds = celexIds.filter(function (celexId) {
            return celexId.indexOf(utils/* LD_CELLAR_EUCASE_JOINED_JUDGEMENT */.i0) > -1;
          });
          if (celexIds.length === 0) {
            return;
          }
          var currentLabel = String(attributes['data-ref-label']).replace(/\s/g, "").replace("‑", "-");

          // look for the label in the joined cases list
          var mainJudgementCelexId = fastCaseLabelLookupMap[currentLabel];
          var regex = new RegExp("{{\\s?" + utils/* LD_CELLAR_EUCASE_JOINED_JUDGEMENT */.i0 + "\\s?}}");
          var newViews = {};
          var newAlternatives = [];
          // raw replacement
          Object.keys(offset.views).forEach(function (key) {
            if (regex.test(offset.views[key])) {
              if (mainJudgementCelexId) {
                newViews[key] = String(offset.views[key]).replace(new RegExp("{{\\s?" + utils/* LD_CELLAR_EUCASE_JOINED_JUDGEMENT */.i0 + "\\s?}}", "g"), mainJudgementCelexId);
              }
            } else {
              newViews[key] = offset.views[key];
            }
          });
          offset.views = newViews;
          offset.alternatives.forEach(function (alternative) {
            if (regex.test(String(alternative.view))) {
              if (mainJudgementCelexId) {
                alternative.view = String(alternative.view).replace(new RegExp("{{\\s?" + utils/* LD_CELLAR_EUCASE_JOINED_JUDGEMENT */.i0 + "\\s?}}", "g"), mainJudgementCelexId);
                newAlternatives.push(alternative);
              }
            } else {
              newAlternatives.push(alternative);
            }
            offset.alternatives = newAlternatives;
          });
        });
      });
      resolve(matches);
    })["catch"](function (err) {
      console.error(err);
      resolve(matches);
    });
  });
};
;// ./src/lib/transformers/placeholders/rules/ecb/ecb_eli.js






/**
 * Will query Cellar to retrieve the ELI of the act behind an ECB reference - REFTOLINK-1978
 * 
 * Processes placeholders: LD_CELLAR_ECB_CELEX, LD_CELLAR_ECB_ELI
 * @param {Object} matches
 * @returns {Promise<Object>} matches 
 */
var resolveEcbEli = function resolveEcbEli(matches) {
  // we lookup matches that have the LD_CELLAR_ECB_CELEX marking and have a valid 'data-ref-ecb' attribute
  var attributesList = (0,data/* extractCelexAttributes */.gI)(matches, utils/* LD_CELLAR_ECB_CELEX */.ud).map(function (attributes) {
    return {
      no: attributes['data-ref-no'],
      year: attributes['data-ref-year'],
      ecb: attributes['data-ref-ecb']
    };
  }).filter(function (attr) {
    return attr.ecb;
  });
  if (attributesList.length === 0) {
    return Promise.resolve(matches);
  }
  var query = ecb_eli_getQuery(attributesList);
  var format = 'application/json';
  return (0,request/* getRequestPromise */.p)((0,manager/* getEndpoint */.yP)(manager/* LD_TYPE_CELEX */.wD), "POST", {
    query: query,
    format: format,
    origin: '*'
  }).then(function (response) {
    if (!response || !response.results) {
      return matches;
    }

    // de-duplicate celex ids
    var bindings = response.results.bindings;
    Object.keys(matches).forEach(function (key) {
      matches[key].offsets.forEach(function (offset) {
        var attributes = (0,functions/* extractAttributes */.pt)(offset.views);
        var celexId = (0,data/* extractCelexId */.ip)(attributes);
        if (!celexId) {
          return;
        }
        var currentBindings = bindings;
        var optimalBinding = ecb_eli_findOptimalBinding(attributes, currentBindings);
        //try to resolve duplicate using matched reference

        offset.rule.ld.forEach(function (placeholder) {
          if (placeholder.indexOf(":ECB:CELEX") !== -1) {
            // use the celex id
            var replacementCelex = optimalBinding ? optimalBinding.id.value.replace('celex:', '') : 'INVALID'; // 'INVALID' will be discarded by the `cellar-exists-celex` attribute
            offset = (0,utils/* replace */.HC)(offset, placeholder, replacementCelex);
          }
          if (placeholder.indexOf(":ECB:ELI") !== -1 && optimalBinding) {
            var targetLang = R2L.getLanguage();
            offset = (0,utils/* replace */.HC)(offset, placeholder, optimalBinding.eli ? optimalBinding.eli.value + (targetLang ? '/' + targetLang : '') : optimalBinding.ojUrl.value);
          }
        });
      });
    });
    return matches;
  })["catch"](function (error) {
    console.error(error);
    return matches;
  });
};

/**
 * Cache old ECB Guideline acts internally 
 */
var __oldEcbGuidelineActs;
function getOldEcbGuidelineActs() {
  if (__oldEcbGuidelineActs) {
    return Promise.resolve(__oldEcbGuidelineActs);
  }
  var query = getOldEcbGuidelineActsQuery();
  var format = 'application/json';
  return (0,request/* getRequestPromise */.p)((0,manager/* getEndpoint */.yP)(manager/* LD_TYPE_CELEX */.wD), "POST", {
    query: query,
    format: format,
    origin: '*'
  }).then(function (response) {
    __oldEcbGuidelineActs = response;
    return __oldEcbGuidelineActs;
  })["catch"](function (err) {
    console.error(err);
    return __oldEcbGuidelineActs;
  });
}
/**
 * Will query Cellar to retrieve the CELEX of the act behind an ECB act - REFTOLINK-1978
 * 
 * @param {Object} matches
 * @returns {Promise<Object>} matches 
 */
var resolveEcbActCelex = function resolveEcbActCelex(matches) {
  // check if we have ECB acts to avoid querying CELLAR for no reason
  var foundGuidelines = false;
  Object.keys(matches).forEach(function (key) {
    matches[key].offsets.forEach(function (offset) {
      var urls = (0,functions/* extractUrls */.q6)(offset.views);
      urls.forEach(function (url) {
        var match = /https?:\/\/data.europa.eu\/eli\/guideline\/(\d+)\/(\d+)/gi.exec(url);
        if (match) {
          foundGuidelines = true;
        }
      });
    });
  });
  if (!foundGuidelines) {
    return Promise.resolve(matches);
  }
  return getOldEcbGuidelineActs().then(function (response) {
    if (!response || !response.results) {
      return matches;
    }
    var bindings = response.results.bindings;
    Object.keys(matches).forEach(function (key) {
      matches[key].offsets.forEach(function (offset) {
        var attributes = (0,functions/* extractAttributes */.pt)(offset.views);
        var celexId = (0,data/* extractCelexId */.ip)(attributes);
        var urls = (0,functions/* extractUrls */.q6)(offset.views);
        if (!celexId) {
          return;
        }

        // find the eli fragment and compare to the celex 
        var eliUrlData;
        var celexData;
        urls.forEach(function (url) {
          var match = /https?:\/\/data.europa.eu\/eli\/guideline\/(\d+)\/(\d+)/gi.exec(url);
          if (match) {
            eliUrlData = {
              year: match[1],
              no: match[2],
              root: match[0]
            };
          }
        });
        var match = /^3(\d{4})O(\d{4})/gi.exec(celexId);
        if (match) {
          celexData = {
            year: match[1],
            no: String(parseInt(match[2])),
            root: match[0]
          };
        }
        if (celexData && eliUrlData) {
          // we need to adjust the CELEX id as it does not follow the same numbering. the ELI is the correct one. See example: https://eur-lex.europa.eu/eli/guideline/2014/528/oj

          bindings.forEach(function (binding) {
            if (binding.eli.value.indexOf(eliUrlData.root + "/") > -1) {
              // find the right CELEX number
              var bindingCelexId = binding.id.value.replace("celex:", "");
              if (bindingCelexId !== celexData.root) {
                // raw replacement
                Object.keys(offset.views).forEach(function (key) {
                  if (String(offset.views[key]).indexOf(celexData.root) > -1) {
                    offset.views[key] = String(offset.views[key]).replaceAll(celexData.root, bindingCelexId);
                  }
                });
                offset.alternatives.forEach(function (alternative) {
                  if (String(alternative.view).indexOf(celexData.root) > -1) {
                    alternative.view = String(alternative.view).replaceAll(celexData.root, bindingCelexId);
                  }
                });
              }
            }
          });
        }
      });
    });
    return matches;
  })["catch"](function (error) {
    console.error(error);
    return matches;
  });
};

/**
 * Query by CELEX year prefix and ref number
 * @param {Array<Object>} attributesList
 * @returns {String}
 */
function ecb_eli_getQuery(attributesList) {
  var filters = "";
  for (var i = 0; i < attributesList.length; i++) {
    if (i > 0) {
      filters += " || ";
    }
    var regexCelexId = 'celex:[2345]' + attributesList[i].year + '.{1,2}' + String(attributesList[i].no).padStart(4, '0');
    filters += "(REGEX(STR(?workId), '".concat(regexCelexId, "$') || (STR(?ecbRef) = '").concat(attributesList[i].ecb, "' AND REGEX(STR(?workId), 'celex:')))");
  }
  var query = "\n    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n    PREFIX cdm:<http://publications.europa.eu/ontology/cdm#>\n    PREFIX skos:<http://www.w3.org/2004/02/skos/core#>\n    PREFIX dc:<http://purl.org/dc/elements/1.1/>\n    PREFIX lang:<http://publications.europa.eu/resource/authority/language/>\n    PREFIX xsd:<http://www.w3.org/2001/XMLSchema#>\n    PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n    PREFIX owl:<http://www.w3.org/2002/07/owl#>\n\n    SELECT DISTINCT \n        ?workId as ?id \n        ?eli\n        ?ecbRef\n        ?ojUrl\n    WHERE {  \n        graph ?ge { \n            ?exp cdm:expression_belongs_to_work ?s .\n            ?exp cdm:expression_title ?title_\n        } \n        ?s cdm:work_id_document ?workId.\n        OPTIONAL {\n            ?s cdm:resource_legal_published_in_official-journal ?ojUrl\n        }\n        OPTIONAL {\n            ?s cdm:resource_legal_manuscript_ref ?ecbRef .\n        }\n        ?s cdm:work_created_by_agent <http://publications.europa.eu/resource/authority/corporate-body/ECB> .\n        OPTIONAL {\n            ?s cdm:resource_legal_eli ?eli .\n        }\n        FILTER (".concat(filters, ") \n}\nORDER BY ASC(?workId)\n");
  return query;
}

/**
 * Query by CELEX year prefix and ref number
 * @param {Array<Object>} attributesList
 * @returns {String}
 */
function getOldEcbGuidelineActsQuery() {
  var query = "\n    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n    PREFIX cdm:<http://publications.europa.eu/ontology/cdm#>\n    PREFIX skos:<http://www.w3.org/2004/02/skos/core#>\n    PREFIX dc:<http://purl.org/dc/elements/1.1/>\n    PREFIX lang:<http://publications.europa.eu/resource/authority/language/>\n    PREFIX xsd:<http://www.w3.org/2001/XMLSchema#>\n    PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n    PREFIX owl:<http://www.w3.org/2002/07/owl#>\n\n    SELECT DISTINCT \n        ?workId as ?id \n        ?eli\n    WHERE {  \n        ?s cdm:work_id_document ?workId.\n        ?s cdm:work_created_by_agent <http://publications.europa.eu/resource/authority/corporate-body/ECB> .\n        ?s cdm:resource_legal_eli ?eli .\n        ?s cdm:resource_legal_year ?year\n        FILTER (STR(?year) < \"2020\" AND REGEX(STR(?eli), \"http://data.europa.eu/eli/guideline/\") AND !REGEX(STR(?eli), \"corrigendum\") AND REGEX(STR(?workId), \"celex:3\")) \n    }";
  return query;
}

/**
 * Find the best binding to use for the match.
 * 
 * @param {String} match
 * @param {Array} bindings
 * 
 * @returns {Object} binding
 */
function ecb_eli_findOptimalBinding(attributes, bindings) {
  var found = bindings.filter(function (binding) {
    return attributes['data-ref-ecb'] === String(binding.ecbRef ? binding.ecbRef.value : "");
  }).shift();
  if (!found) {
    var regexCelexId = 'celex:[2345]' + attributes['data-ref-year'] + '.{1,2}' + String(attributes['data-ref-no']).padStart(4, '0');
    found = bindings.filter(function (binding) {
      var pattern = new RegExp(regexCelexId, 'gi');
      return pattern.test(String(binding.id.value));
    }).shift();
  }
  return found && (found.eli || found.ojUrl) ? found : null;
}
;// ./src/lib/transformers/placeholders/rules/eurlex/ep_act.js






/**
 * The EP uses non-deterministic references for their acts, often multiple ones on the same (vote) date.
 * Example: `European Parliament resolution of 14 May 2020 on the draft Commission implementing decision authorising ...` - https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A52020IP0069
 * 
 * Processes placeholders: LD_CELLAR_EP_ACT_CELEX
 * @param {Object} matches
 * @returns {Promise<Object>} matches 
 */
var resolveEpActs = function resolveEpActs(matches) {
  var inputText = matches[R2L.symbols.getInputText]();
  // fill CELEX placeholders
  var attributesList = (0,data/* extractCelexAttributes */.gI)(matches, utils/* LD_CELLAR_EP_ACT_CELEX */.iN).map(function (attributes) {
    // for now we only handle resolutions so we care about the date
    return {
      dateVote: attributes["data-ref-date-vote"],
      type: attributes["data-ref-type"]
    };
  });
  if (attributesList.length === 0) {
    return Promise.resolve(matches);
  }
  var query = ep_act_getQuery(attributesList);
  var format = 'application/json';
  return (0,request/* getRequestPromise */.p)((0,manager/* getEndpoint */.yP)(manager/* LD_TYPE_CELEX */.wD), "POST", {
    query: query,
    format: format,
    origin: '*'
  }).then(function (response) {
    if (!response || !response.results) {
      return matches;
    }
    var bindings = response.results.bindings;
    var countMap = {};

    /** 
     * We will discard multiple occurences of an act from the same date if the context following it is different as we cannot manage the ref replacement: 
     * OK (a single ref for this date): 
     *     European Parliament resolution of 19 December 2024 on the human rights situation in Kyrgyzstan, in particular the case of Temirlan Sultanbekov. 
     *     lorem ipsum ...
     *     European Parliament resolution of 19 December 2024 on the human rights situation in Kyrgyzstan, in particular the case of Temirlan Sultanbekov. 
     * 
     * 
     * NOT OK (multiple refs for the same date present in text) - we discard both of these
     *     European Parliament resolution of 19 December 2024 on the human rights situation in Kyrgyzstan, in particular the case of Temirlan Sultanbekov. 
     *     lorem ipsum
     *     European Parliament resolution of 19 December 2024 on the continued repression of civil society and independent media in Azerbaijan and the cases of Dr Gubad Ibadoghlu, Anar Mammadli, Kamran Mammadli, Rufat Safarov and Meydan TV
     */

    Object.keys(matches).forEach(function (key) {
      matches[key].offsets.forEach(function (offset) {
        if (offset.rule.ld.indexOf(utils/* LD_CELLAR_EP_ACT_CELEX */.iN) === -1) {
          return;
        }
        var attributes = (0,functions/* extractAttributes */.pt)(offset.views);
        var key = getKey(offset, attributes, inputText);
        var contextLength = (attributes['data-ref-context'] || offset.context).length;
        var contextExt = inputText.substr(offset.position + contextLength, 30);
        if (!countMap[key]) {
          countMap[key] = {
            count: 1,
            contextExt: contextExt
          };
        } else {
          // we only count it if the extended context is different. if the same ref is present twice we do not need to discard it
          if (contextExt !== countMap[key].contextExt) {
            countMap[key].count++;
          }
        }
      });
    });
    Object.keys(matches).forEach(function (key) {
      matches[key].offsets.forEach(function (offset) {
        if (offset.rule.ld.indexOf(utils/* LD_CELLAR_EP_ACT_CELEX */.iN) === -1) {
          return;
        }
        var attributes = (0,functions/* extractAttributes */.pt)(offset.views);
        var celexId = (0,data/* extractCelexId */.ip)(attributes);
        if (!celexId) {
          return;
        }

        /* avoid duplicates */
        var key = getKey(offset, attributes, inputText);
        if (countMap[key] && countMap[key].count > 1) {
          return;
        }
        var optimalBinding = ep_act_findOptimalBinding(offset, attributes, bindings, inputText);
        //try to resolve duplicate using matched reference

        if (optimalBinding) {
          // use the optimal CELEX id
          var replacementCelex = optimalBinding.id.value.replace("celex:", "");
          Object.keys(offset.views).forEach(function (key) {
            offset.views[key] = (0,utils/* replaceStr */.CZ)(String(offset.views[key]), utils/* LD_CELLAR_EP_ACT_CELEX */.iN, replacementCelex);
          });
          offset.alternatives.forEach(function (alternative) {
            alternative.view = (0,utils/* replaceStr */.CZ)(alternative.view, utils/* LD_CELLAR_EP_ACT_CELEX */.iN, replacementCelex);
          });
        }
      });
    });
    return matches;
  })["catch"](function (error) {
    console.error(error);
    return matches;
  });
};

/**
 * Query by ref number and author
 * @param {Array<Object>} attributesList
 * @returns {String}
 */
function ep_act_getQuery(attributesList) {
  var filters = "";
  for (var i = 0; i < attributesList.length; i++) {
    if (i > 0) {
      filters += " || ";
    }
    filters += "STRSTARTS(STR(?dateVote), \"".concat(attributesList[i].dateVote, "\")");
  }
  var query = "\nPREFIX cmr:<http://publications.europa.eu/ontology/cdm/cmr#>\nPREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\nPREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\nPREFIX cdm:<http://publications.europa.eu/ontology/cdm#>\nPREFIX skos:<http://www.w3.org/2004/02/skos/core#>\nPREFIX dc:<http://purl.org/dc/elements/1.1/>\nPREFIX lang:<http://publications.europa.eu/resource/authority/language/>\nPREFIX xsd:<http://www.w3.org/2001/XMLSchema#>\nPREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>\nPREFIX owl:<http://www.w3.org/2002/07/owl#>\n\nSELECT DISTINCT \n    ?workId as ?id ?title ?dateVote\nWHERE {  \n    graph ?ge { \n        ?exp cdm:expression_belongs_to_work ?s .\n        ?exp cdm:expression_title ?title .\n        ?exp cdm:expression_uses_language ?lang .\n        FILTER (?lang IN (lang:ENG, lang:FRA, lang:DEU))\n    } \n    ?s cdm:work_id_document ?workId.\n    ?s cdm:work_date_document ?dateVote .\n\n    ?s cdm:resource_legal_type \"IP\"^^xsd:string .\n    ?s cdm:work_created_by_agent <http://publications.europa.eu/resource/authority/corporate-body/EP> .\n    FILTER (".concat(filters, ") \n    FILTER (STRSTARTS( ?workId, \"celex:\"))\n}");
  return query;
}
function getKey(offset, attributes, inputText) {
  var re = new RegExp(String.fromCharCode(160), "gi");
  var key = attributes['data-ref-type'] + ':' + attributes['data-ref-date-vote'];
  key = key.toLowerCase().replace(re, " ");
  return key;
}

/**
 * Find the best binding to use for the match.
 * 
 * @param {String} offset
 * @param {Array} bindings
 * 
 * @returns {Object} binding
 */
function ep_act_findOptimalBinding(offset, attributes, bindings, inputText) {
  // first filter by dateVote
  var filtered = bindings.filter(function (binding) {
    return binding.dateVote.value === attributes['data-ref-date-vote'];
  });

  // if there is a single id we return it
  var ids = filtered.map(function (f) {
    return f.id.value;
  }).filter(function (value, index, array) {
    return array.indexOf(value) === index;
  });
  if (ids.length === 1) {
    return filtered[0]; // return any of the items
  }
  var re = new RegExp(String.fromCharCode(160), "gi");

  // use the year 
  var year = String(attributes['data-ref-date-vote']).slice(0, 4);
  var contextLength = (attributes['data-ref-context'] || offset.context).length;
  var textToSearch = year + inputText.substr(offset.position + contextLength, 30);
  var foundItems = filtered.filter(function (binding) {
    var lowerTitle = String(binding.title.value || "").toLowerCase().replace(re, " ");
    textToSearch = textToSearch.toLowerCase().replace(re, " ");
    return lowerTitle.indexOf(textToSearch) > -1;
  });
  if (foundItems.length === 1) {
    return foundItems[0];
  }
  return null;
}
;// ./src/lib/transformers/index.js













/**
 * Will settle (fill or remove) CELEX and ELI placeholders {{ LD:CELLAR:NUMBER:CELEX}}, {{ LD:CELLAR:SUBNUMBER:CELEX }} in case of ambiguos identifiers
 * `Decision No 70/2008/EC` will resolve to CELEX id `32008D0070(01)` and ELI `/eli/dec/2008/70(1)/oj`
 * The filling is done by looking up information on the matched text in Cellar and resolving the ambiguity
 * 
 * @param {Object} matches 
 * @returns {Promise<Object>} - the settled `matches 
 */
function fillPlaceholders(matches) {
  return new Promise(function (resolve, reject) {
    var promises = [];
    if (!R2L.options.metadata || !R2L.hasLinkedDataMode(settings/* LD_MODE_SEQ_NUMBER */.z4)) {
      matches = clearLdTargets(matches);
      matches = (0,utils/* clearPlaceholders */.Ur)(matches);
      resolve(matches);
      return;
    }

    // will mutate the matches object
    promises.push(fillEliBaseUrls(matches));
    promises.push(fillLegacyActsPlaceholders(matches));
    promises.push(fillCelexConsolidationPlaceholders(matches));
    promises.push(fillEcbIds(matches));
    promises.push(fillCelexSubnumberPlaceholders(matches));
    promises.push(fillCelexNumberPlaceholders(matches));
    promises.push(fillUnitedNationsRegulationPlaceholders(matches));
    promises.push(fillEpActsPlaceholders(matches));
    promises.push(fillOjEli(matches));
    promises.push(fillEucaseCelexIds(matches));
    promises.push(fillEucaseJoinedJudgements(matches));
    Promise.all(promises).then(function (_) {
      // clear remaining placeholders
      matches = (0,utils/* clearPlaceholders */.Ur)(matches);
      resolve(matches);
    })["catch"](function (e) {
      console.error(e);
      // can't do much
      matches = (0,utils/* clearPlaceholders */.Ur)(matches);
      resolve(matches);
    });
  });
}
function fillEucaseCelexIds(matches) {
  return resolveEucaseCelexIds(matches);
}
function fillEucaseJoinedJudgements(matches) {
  return resolveEucaseJoinedJudgements(matches);
}
function fillEcbIds(matches) {
  return resolveEcbEli(matches).then(function (matches) {
    return resolveEcbActCelex(matches);
  });
}

/**
 * Resolve CELEX subnumber placeholders eg: 32008D0070 {{ (01) }}
 * @param {Object} matches
 * @returns {Promise<Object>} 
 */
function fillCelexSubnumberPlaceholders(matches) {
  return resolveCelexSubnumber(matches);
}

/**
 * Resolve ELIs for OJ new references
 * @param {Object} matches
 * @returns {Promise<Object>} 
 */
function fillOjEli(matches) {
  return resolveOjEli(matches);
}

/**
 * Resolve CELEX number placeholders eg: 32020{{ Q1120(01) }}
 * @param {Object} matches
 * @returns {Promise<Object>} 
 */
function fillCelexNumberPlaceholders(matches) {
  return resolveDecisionNumber(matches);
}

/**
 * Resolve CELEX number & ELI url placeholders for legacy acts eg: 3{{ 1959R0007 }}
 * @param {Object} matches
 * @returns {Promise<Object>} 
 */
function fillLegacyActsPlaceholders(matches) {
  //legacy acts with missing year
  return resolveLegacyActs(matches);
}

/**
 * Resolve CELEX number & ELI url placeholders for UN regulations eg: 3{{ 1959R0007 }}
 * @param {Object} matches
 * @returns {Promise<Object>} 
 */
function fillUnitedNationsRegulationPlaceholders(matches) {
  return resolveUnitedNationsRegulationActs(matches);
}

/**
 * Resolve CELEX number for EP resolutions
 * @param {Object} matches
 * @returns {Promise<Object>} 
 */
function fillEpActsPlaceholders(matches) {
  return resolveEpActs(matches);
}

/**
 * Resolve CELEX consolidation placeholders eg: 01962R0031{{ -20200101 }}
 * @param {Object} matches
 * @returns {Promise<Object>} 
 */
function fillCelexConsolidationPlaceholders(matches) {
  return new Promise(function (resolve, reject) {
    resolve(matches);
    /**
     * staff regs consolidation numbers
     * currently disabled as we use default values
    resolveStaffRegsConsolidation(matches).then(matches => {
        resolve(matches);
    })
    */
  });
}
function fillEliBaseUrls(matches) {
  return resolveEliBaseUrl(matches);
}
// EXTERNAL MODULE: ./src/lib/translations/index.js + 1 modules
var translations = __webpack_require__(337);
// EXTERNAL MODULE: ./src/lib/jquery/index.js
var lib_jquery = __webpack_require__(994);
;// ./src/lib/index.js
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }

















// R2L global. Must be exposed globally: `window.R2L` (browser) or `global.R2L` (server-side)
var lib_R2L = {};

// Confluence binding
var _jQuery = jquery.$;

// We can't do much without JQuery
if (!_jQuery) {
  throw new Error("JQuery is not loaded.");
}

// alias function
lib_R2L.getJQuery = lib_R2L.getJquery = function () {
  return _jQuery;
};

/**
 * Inject JQuery dependency
 * @param {JQuery} jQuery 
 */
lib_R2L.setJQuery = function (jQuery) {
  _jQuery = jQuery;
};

/**
 * Constants are properties pre-set by the JSON rules file loaded into the library. Source language and the corresponding base64-encoded rules are among them.
 * @see R2L.settings.constants  
 * @param {String} name
 * 
 * @returns
 */
lib_R2L.getConstant = function (name) {
  var isBrowser = new Function("try { return this === window; } catch(e){ return false; }").call();
  if (!isBrowser && global && global["R2L_CONSTANTS"]) {
    // defaults
    if (name === "R2L_EULANG") {
      return settings/* settings */.W0.constants[name];
    }
    return global["R2L_CONSTANTS"][name];
  }
  return settings/* settings */.W0.constants[name];
};
lib_R2L.setConstant = function (name, value) {
  var isBrowser = new Function("try { return this === window; } catch(e){ return false; }").call();
  if (!isBrowser && global && global["R2L_CONSTANTS"]) {
    global["R2L_CONSTANTS"][name] = value;
  }
  settings/* settings */.W0.constants[name] = value;
};

/**
 * Apply rules to text 
 * @param {String} text
 * @param {Object} globalRule (optional)
 * @param {Boolean} isAlias (optional) - when it's an alias parse we need to polish the matches before saving them
 * 
 * @returns {Promise<Object>} returns a `matches` object
 */
lib_R2L.applyGlobalRule = function (text, globalRule, isAlias) {
  var matches = {};
  try {
    if (!globalRule) {
      /** Guard checks optimization */
      var rules = this.runGuards(text, this.getRules());
      globalRule = this.compileGlobalRule(rules);
    }
    matches = (0,functions/* cleanMatches */.Rl)(lib_R2L.applyMultipleRules(text, globalRule, [], 0));
    matches[lib_R2L.symbols.getInputText] = function () {
      return text;
    };
  } catch (e) {
    console.error(e);
  }

  // linked-data processing
  return fillPlaceholders(matches).then(function (matches) {
    return filterTargets(matches).then(function (matches) {
      if (!isAlias) {
        lib_R2L.setGlobalMatches(matches);
      }
      return matches;
    });
  });
};

/**
 * Synchronous parsing API (will clear linked-data placeholders)
 * @param {string} text 
 * @param {Object} globalRule 
 * @param {boolean} isAlias 
 */
lib_R2L.applyGlobalRuleSync = function (text, globalRule, isAlias) {
  if (!globalRule) {
    /** Guard checks optimization */
    var rules = this.runGuards(text, this.getRules());
    globalRule = this.compileGlobalRule(rules);
  }
  var matches = lib_R2L.applyMultipleRules(text, globalRule, [], 0);
  matches = (0,functions/* cleanMatches */.Rl)(matches);
  matches = clearLdTargets(matches);
  matches = (0,utils/* clearPlaceholders */.Ur)(matches);
  if (!isAlias) {
    lib_R2L.setGlobalMatches(matches);
  }
  return matches;
};

/**
 * Iterator function that abstracts over the webworker execution, making it behave like a Regexp iterator
 * 
 * @param {String} text 
 * @param {RegExp} multiMatchPattern 
 * @param {Number} level
 * 
 * @returns {Array<String>} Regex matches
 */
var _executor = function _executor(text, multiMatchPattern, level) {
  var data = level === 0 ? shared/* sharedCtx */.L.getData(text) : null;
  if (lib_R2L.options.worker && level === 0 && data && Array.isArray(data.matches)) {
    if (data.matches.length > data.cursor) {
      data.cursor++;
      multiMatchPattern.lastIndex = data.matches[data.cursor - 1].lastIndex;
      return data.matches[data.cursor - 1].args;
    } else {
      // we reached the end of the matches
      return false;
    }
  } else {
    return multiMatchPattern.exec(text);
  }
};

/**
 * Actual parsing function. Calls itself recursively in case of lists
 * Should not be called from the outside
 * @param {String} text - text to parse
 * @param {RegExp} multiMatchRule - For level 0 it is the compiled global rule (celex|ecli|act|eucase...). For level 1 it is the list-item pattern.
 * @param {Array<Ref2link>} history - list items are stored for passing data in-between 
 * @param {Number} level - the recursion level (0 or 1)
 * 
 * @returns {Object} matches - map of matches
 */
lib_R2L.applyMultipleRules = function (text, multiMatchRule, history, level) {
  var args,
    matches = {};
  var rules = multiMatchRule.rules,
    multiMatchPattern = multiMatchRule.pattern,
    lastIndex = 0;
  if (!rules.length) {
    return {};
  }
  if (!history) {
    history = [];
  }
  if (!level) {
    level = 0;
  }
  detection: while (args = _executor(text, multiMatchPattern, level)) {
    var match = args[0],
      startPosition = multiMatchPattern.lastIndex - match.length;
    if (!match) {
      /** pattern matched empty string; the regexp will infinitely recurse */
      multiMatchPattern.lastIndex++;
      lastIndex = multiMatchPattern.lastIndex;
    }
    if (level === 0) {
      //polyfill for engines not supporting negative lookbehind 
      if (startPosition > 1) {
        var letterPattern = "[/0-9" + letters/* letters */.M.latin + letters/* letters */.M.cyrillic + letters/* letters */.M.greek + letters/* letters */.M.specialChars + "]";
        if (new RegExp(letterPattern, 'i').test(text[startPosition - 1])) {
          console.debug("Discarding match because of left neighbour", text[startPosition - 1]);
          continue;
        }
      }

      /** smooth over args since some rules have multiple groups */
      var offset = 0;
      for (var i = 0; i < rules.length; i++) {
        offset += rules[i].slots;
        if (rules[i].slots === 2) {
          args.splice(offset, 1);
          offset -= 1;
        }
      }
    }

    /** scan which of the arguments is not empty and apply respective rule */
    for (var i = 1; i <= args.length; i++) {
      if (args[i] && i - 1 < rules.length) {
        var itemMatches = {},
          rule = rules[i - 1];
        var trimPattern = rule ? rule.trimPattern || rule["trim-pattern"] : null;
        if (trimPattern) {
          try {
            var trimRegex = new RegExp(trimPattern);
            match = match.replace(trimRegex, '');
          } catch (e) {
            // move on
          }
        }

        /** check the skip rule */
        var skipPattern = rule ? rule.skipPattern || rule["skip-pattern"] : null;
        if (skipPattern) {
          try {
            var skipRegex = new RegExp(skipPattern);
            if (skipRegex.test(match)) {
              multiMatchPattern.lastIndex = multiMatchPattern.lastIndex - match.length + 1;
              lastIndex = multiMatchPattern.lastIndex;
              continue detection;
            }
          } catch (e) {
            // move on
          }
        }

        /** check the strict rule settings and patterns */
        var strictPattern = rule ? rule.strictPattern || rule["strict-pattern"] : null;
        if (level === 0 && strictPattern && lib_R2L.options.strictRules && (lib_R2L.options.strictRules[rule.baseType] || lib_R2L.options.strictRules[rule.type])) {
          try {
            var strictRegex = new RegExp(strictPattern, "i");
            if (!strictRegex.test(match)) {
              // no need to move cursor back, let detection skip this ref
              //multiMatchPattern.lastIndex = multiMatchPattern.lastIndex - match.length + 1;
              //lastIndex = multiMatchPattern.lastIndex;
              continue detection;
            }
          } catch (e) {
            // move on
          }
        }
        var ruleType = rule.type;
        var title = match;
        var reference = match;
        if (rule.allowTitle) {
          var normalizePattern = function normalizePattern(p, iFlag, surroundAndEscape) {
            surroundAndEscape = surroundAndEscape || false;
            var pattern = (p.source || p).replace(/^\/|\/[giumxns]*$/g, '');
            if (surroundAndEscape) {
              pattern = '(' + (0,functions/* getNonCapturingPattern */.T0)(pattern) + ')';
            }
            return new RegExp(pattern, 'gm' + iFlag);
          };
          var fullPattern = normalizePattern(rule.fullPattern, rule.casesensitive ? '' : 'i');
          var fullArgs = fullPattern.exec(args[i]);
          var controlExpr = "(?:[^\\]\\|\\r\\n\\v]*)";
          ruleType = String(fullArgs ? fullArgs[1] || '' : '').trim();
          reference = fullArgs ? fullArgs[2] || fullArgs[4] || '' : '';
          title = fullArgs ? fullArgs[3] || '' : '';
          if (!reference || reference.length > lib_R2L.settings.maxReferenceLength || ruleType && rule.type.toLowerCase() !== ruleType.toLowerCase()) {
            multiMatchPattern.lastIndex = startPosition + 1;
            continue detection;
          }
          if (title) {
            if (title.length > lib_R2L.settings.maxTitleLength) {
              title = match = reference;
              multiMatchPattern.lastIndex = startPosition + reference.length;
            } else {
              controlExpr = "\\[" + controlExpr + "\\s*\\|\\s*(?:[^\\]\\n\\r\\v]*?)\\]";
            }
          } else {
            if (!rule.forced && !ruleType) {
              match = String(lib_R2L.converters.trim(reference, '[]') || '').trim();
              reference = match;
            }
          }
          controlExpr = '(' + (0,functions/* regExpEscape */.fI)(rule.type) + ')' + (rule.forced ? '' : '?') + "[\t ]*" + controlExpr;
          controlExpr = new RegExp(controlExpr, 'i');
          if (!controlExpr.test(match)) {
            multiMatchPattern.lastIndex = ++lastIndex;
            continue detection;
          }
        } else {
          if (level === 1) {
            title = null;
          }
        }
        lastIndex = multiMatchPattern.lastIndex;
        if (level === 0) {
          history = [];
        }

        /** If there's an itemRule go straight to item matching */
        if (rule.itemRule) {
          var itemMultiMatchRule = lib_R2L.compileGlobalRule([rule.itemRule]);
          itemMatches = lib_R2L.applyMultipleRules(match, itemMultiMatchRule, history, 1);
        } else {
          var appliedRule = lib_R2L.applyRule(match, rule, rule.customTitle ? null : title, match, history);
          if (appliedRule) {
            match = appliedRule.wholeMatch;
            appliedRule.startPosition = startPosition;
            if (!rule.itemRule) {
              itemMatches[match] = appliedRule;
              if (level === 1) {
                history.push(appliedRule);
              }
            }
          } else {
            console.debug('Multi match, no rule match', i, match, rule, appliedRule);
          }
        }
        if (level === 0 && history.length > 1) {
          var listRef = (0,list/* getListCore */.Ku)(history[0].rule, history[0].matches);
          if (listRef.length === 0) {
            /** Inverted lists might need some help */
            for (var hI = 0; hI < history.length; hI++) {
              if (hI > 0) {
                /**
                 * We clone identifiers forward eg:
                 * articles 5 paragraphs 6, 7       # 6 & 7 are paragraphs of art. 5
                 */
                (0,list/* cloneListIdentifiers */.ck)(history[hI - 1], history[hI]);
              }
              if (hI < history.length - 1) {
                /**
                 * We clone list core data from the last element in the case of inverted lists
                 * 
                 * articles 5, 6, 7 of Dir. 78/99   # articles 5, 6 need directive info
                 */
                (0,list/* cloneListCore */.nH)(history[history.length - 1], history[hI]);

                /** 
                 * If identifiers are not complete we copy those also 
                 */
                var identifiers = (0,list/* getListIdentifiers */.ts)(history[history.length - 1].rule, history[history.length - 1].matches);

                /**
                 * points 5 and 7 of article 2(3) Dir. 78/99      # point 5 & 7 belongs to an article
                 */
                var coreIdentifiers = (0,list/* getCoreIdentifiers */.ak)(history[hI].rule, history[hI].matches);
                if (coreIdentifiers.length === 0 && identifiers.length > 0) {
                  (0,list/* cloneCoreIdentifiers */.T8)(history[history.length - 1], history[hI]);
                }
              }
              var hItem = history[hI];

              /** Re-render */
              var sPos = hItem.startPosition;
              var appliedRule = lib_R2L.applyRule(hItem.reference, hItem.rule, hItem.link, hItem.wholeMatch, [], history[hI].matches);
              if (appliedRule) {
                match = appliedRule.wholeMatch;
                appliedRule.startPosition = sPos;
                itemMatches[match] = appliedRule;
              }
            }
          }
        }
        if (level === 0 && rule["item-pattern"]) {
          Object.keys(itemMatches).forEach(function (itemKey) {
            var itemReference = itemMatches[itemKey];
            itemReference.startPosition = startPosition + itemReference.startPosition;
          });
        }
        Object.keys(itemMatches).forEach(function (_itemMatch) {
          var _item = itemMatches[_itemMatch];
          if (!matches.hasOwnProperty(_itemMatch)) {
            if (Object.keys(_item.views).length > 0) {
              matches[_itemMatch] = _item;
            }
          }
        });
        if (level === 0 && Object.keys(itemMatches).length > 0) {
          Object.keys(itemMatches).forEach(function (_itemMatch) {
            var _item = itemMatches[_itemMatch];
            if (!matches[_itemMatch]) {
              return;
            }
            matches[_itemMatch].offsets.push({
              matches: _item.matches,
              match: _itemMatch,
              position: _item.startPosition,
              views: _item.views,
              rule: rule,
              counter: 1,
              alternatives: _item.alternatives,
              context: args[0]
            });
            matches[_itemMatch].counter++;
          });
          Object.keys(itemMatches).forEach(function (_itemMatch) {
            var _item = itemMatches[_itemMatch];
            if (!matches[_itemMatch]) {
              return;
            }
            Object.keys(_item.alternatives).forEach(function (_index) {
              var _alternative = _item.alternatives[_index];
              _alternative.context = args[0];
              try {
                if (_alternative.viewName === 'table') {
                  return;
                }
                var _v = (0,jquery.$)(_alternative.view);
                _v.attr(lib_R2L.dataRef2linkContextAttribute, args[0]);
                _alternative.view = _v[0].outerHTML;
              } catch (e) {
                console.error(e);
              }
            });
          });
        }
      }
    }
  }
  return matches;
};

/**
 * Apply sort over a list of nodes
 * @param {Array<Object>} list - list of nodes
 * 
 * @returns {Array<Object>} sorted list
 */
lib_R2L.applySort = function (nodes) {
  if (nodes.length < 2) {
    return nodes;
  }

  /* Supported sort fields */
  var fields = new Array("count", "position", "reference", "type", "libelle");
  var sort = settings/* settings */.W0.sort.toLowerCase();
  if (typeof sort !== "string") {
    return nodes;
  }
  var pieces = sort.split(".");
  var direction = "asc";
  var field = pieces[0];
  if (fields.indexOf(field) === -1) {
    return nodes;
  }
  if (pieces.length > 1) {
    direction = pieces[1] === "asc" || pieces[1] === "desc" ? pieces[1] : direction;
  }
  nodes.sort(function (a, b) {
    if (direction === "asc") {
      return a[field] < b[field] ? -1 : 1;
    } else {
      return a[field] > b[field] ? -1 : 1;
    }
  });
  return nodes;
};

/**
 * (DEPRECATED) Helper function to get the last results. Previous parsing is required.
 * @param {String} format - xml/json/html
 * 
 * @returns {Object|null} - result 
 */
lib_R2L.getFormattedReferences = function (format) {
  format = format || 'html';
  if (format === 'ref2table') {
    format = 'xml';
  }
  if (!this.$el) {
    return null;
  }
  var formatter = format,
    references = this.$el.getReferences();
  ;
  if (Object.prototype.toString.call(format) === "[object String]") {
    formatter = this.formatters[format];
  }
  if (format === 'html') {
    // we already have the html content from the parsed node
    return {
      result: this.$el.html(),
      type: 'text/html',
      ext: 'html'
    };
  } else {
    return formatter(references);
  }
};

/**
 * Removes anchor links which contain an annotation eg: "(12)"
 * NOT IN USE
 * @param {String} text 
 * @returns {String} 
 */
lib_R2L.parseAnnotations = function (text) {
  var $el = (0,jquery.$)("<div>" + text + "</div>");
  var links = $el.find("a").toArray();
  links = links.filter(function (link) {
    return /\(\d+\)/.test((0,jquery.$)(link).text());
  });
  links.map(function (link) {
    text = text.replace(new RegExp((0,functions/* regExpEscape */.fI)(link.outerHTML), 'g'), "");
  });
  return text;
};

/**
 * Replace the default link with an alternative
 * @param {Object} target - the ref2link object 
 * @param {Object} alternative - the rendered alternative object
 */
lib_R2L.setAlternative = function (target, alternative) {
  try {
    var $self = (0,jquery.$)(target).closest(lib_R2L.settings["class"] + ', .ref2link-tooltip'),
      $parents = $self.parents(lib_R2L.settings["class"] + ', .ref2link-tooltip').last(),
      $view = (0,jquery.$)(alternative.view);
    if ($parents.length) {
      $self = $parents;
    }
    if (!$self.length || !$view.length) {
      return;
    }
    var reference = $self.getRef2linkMatch();
    $view.setRef2linkMatch(reference);
    $self.replaceWith($view);
  } catch (e) {}
};

/**
 * Remove the link from a reference
 */
lib_R2L.removeReference = function (target) {
  var $container = (0,jquery.$)(target).parentsUntil(":not(.".concat(settings/* settings */.W0.generatedClassName, ")"));
  if ($container.length) {
    return $container.unparseTextRules();
  }
  return (0,jquery.$)(target).unparseTextRules();
};

/**
 * Fetch linked data
 * @param {Array<Ref2Link>} nodes from the scan
 * 
 * @returns {Promise<Object>} Key-value object with CELEX/ELI identifiers as keys
 */
lib_R2L.loadMetadata = function (nodes) {
  return this.ldm.fetch(nodes).then(function (data) {
    (0,ux/* resetTooltips */.Ep)();
    return data;
  })["catch"](function (e) {
    console.error(e);
  });
};

/**
 * Expose label translation fn
 */
lib_R2L.getTranslation = translations/* getTranslation */.sC;

/**
 * Apply an order map to ref2link
 * 
 *  { ruletype1: [target1, target2 ...], ruletype2: [target3, target1, target2], ... }
 * 
 * @param {Object} order
 */
lib_R2L.setViewOrder = function (order) {
  var rules = this.getRules();
  var _loop = function _loop(ruleType) {
    rules.filter(function (r) {
      return r.type === ruleType || r.baseType === ruleType;
    }).map(function (rule) {
      rule.views.map(function (view) {
        var index = order[ruleType].indexOf(view.target);
        view.order = index === -1 ? view.order + order[ruleType].length : index;
        return view;
      });
      // child rule update
      if (rule.itemRule && rule.itemRule.views) {
        rule.itemRule.views.map(function (view) {
          var index = order[ruleType].indexOf(view.baseTarget);
          if (index === -1) {
            index = order[ruleType].indexOf(view.target);
          }
          view.order = index === -1 ? view.order + order[ruleType].length : index;
          return view;
        });
      }
    });
  };
  for (var ruleType in order) {
    _loop(ruleType);
  }
};

/**
 * Apply an order map to ref2link
 * @deprecated use `R2L.setViewOrder()`
 */
lib_R2L.applyViewOrder = lib_R2L.setViewOrder;

/**
 * Set view options (attributes) eg: 'target=_self'
 * { 
 *   ruletype1: { target1: {target: '_self'}, target2: {target: '_blank'} ...}, 
 *   ruletype2: {target3: {target: '_self'}...}
 * }
 */
lib_R2L.setViewAttributes = function (viewAttributes) {
  this.settings.viewAttributes = viewAttributes;
};

/**
 * Returns view attribute settings. Pass a view name (target) to return attributes for that target only
 * @param {String} viewName (optional) 
 * @returns 
 */
lib_R2L.getViewAttributes = function (viewName) {
  if (!viewName) {
    return this.settings.viewAttributes || null;
  }
  if (this.settings.viewAttributes) {
    var viewAttributes = this.settings.viewAttributes;
    try {
      for (var _ruleType in viewAttributes) {
        if (viewAttributes[_ruleType] && viewAttributes[_ruleType][viewName]) {
          return viewAttributes[_ruleType][viewName];
        }
      }
    } catch (e) {
      console.error(e);
      // move on
    }
  }
  return null;
};

/**
 * Direct parse API method
 * @param {String} text
 * @param {String} format (html|xml|json)
 * @param {Object} opts @see R2L.options
 * 
 * @returns {Promise<Object>}
 */
lib_R2L.parse = function (text, format, opts) {
  if (opts) {
    this.setOptions(opts);
  }
  format = String(format).toLowerCase();
  return new Promise(function (resolve, reject) {
    // we first process aliases and then we do a single global parse

    var replaceAliasesResult;
    (lib_R2L.options.aliases ? lib_R2L.alias.loadCustomAliases(text) : Promise.resolve({})).then(function (_) {
      replaceAliasesResult = (0,alias/* replaceAliases */.BS)(text);
      var tempText = replaceAliasesResult.text;

      // run parser again after replacing aliases
      var rules = lib_R2L.getRules();
      rules = lib_R2L.runGuards(tempText, rules);
      var globalRule = lib_R2L.compileGlobalRule(rules);
      return lib_R2L.applyGlobalRule(tempText, globalRule, true);
    }).then(function (newMatches) {
      newMatches = (0,alias/* replaceAliasMatches */.oM)(newMatches, replaceAliasesResult);
      lib_R2L.setGlobalMatches(newMatches);
      resolver(format, text, newMatches, resolve);
    })["catch"](function (e) {
      console.error("Failed to apply globalRule", e);
      resolver(format, text, {}, resolve);
    });
  });
};

/**
 * Expose function to directly replace a string
 * @param {String} html
 * @param {Object} matches
 * 
 * @returns {String} Final content with links
 */
lib_R2L.replaceHtml = function (html, matches) {
  var temp = (0,processor/* replaceHtmlNodes */.B5)(html, matches);
  return (0,processor/* unExtractRaw */.PU)(temp);
};

/**
 * Will replace detected references with <a> tags, operating on the current node.
 * This helps preserve existing DOM events.
 * 
 * @param {HTMLElement} node 
 * @param {Object} matches 
 * @returns {HTMLElement} Node with (detected) text nodes replaced as `<a>` tags 
 */
lib_R2L.replaceDOM = function (node, matches) {
  node = (0,processor/* jqReplaceDOMNodes */.Zc)(node, matches);
  if (node) {
    (0,processor/* jqUnExtractNode */.gx)(node);
  }
  return node;
};

/**
 * Import new rules object (result of the compilation) 
 * @param {Object} constants
 * 
 * @returns {Boolean}
 */
lib_R2L.importRules = function (constants) {
  var lang = constants.R2L_DEFAULT_LANG_ISO3 || null;
  var langMap = lib_R2L.getConstant('R2L_EULANG');
  if (lang && !langMap.get(String(lang).toUpperCase())) {
    return false;
  }
  this.setConstant('R2L_DEFAULT_LANG_ISO3', lang);
  this.setConstant('R2L_TYPED_RULES', constants.R2L_TYPED_RULES);
  this.clearCache();
  this.reloadRules();
  return true;
};
lib_R2L.clearCache = function () {
  this.globalMatches = {};
  this.globalViews = {};
  (0,processor/* clearTextCaches */.iJ)();
  (0,processor/* clearExtracts */.Sm)();
  // the Shared Context object should not be exposed
  shared/* sharedCtx */.L.clear();
  (0,lib_jquery/* clearTooltips */.wE)();
  this.ldm.clearCache();
};
lib_R2L.unbind = function () {
  this.unbindTooltips();
};

/**
 * Configuration of options
 * @param ${options} object 
 */
lib_R2L.setOptions = function (options) {
  if (!options) {
    return;
  }
  if (options.worker !== undefined) {
    options.worker = Boolean(options.worker);
    if (Boolean(lib_R2L.options.worker) !== Boolean(options.worker)) {
      if (options.worker) {
        lib_R2L.registerWorker();
      } else {
        lib_R2L.destroyWorker();
      }
    }
  }
  if (options.enableSpecialRules !== undefined) {
    options.enableSpecialRules = Boolean(options.enableSpecialRules);
    if (Boolean(lib_R2L.options.enableSpecialRules) !== options.enableSpecialRules) {
      lib_R2L.options.enableSpecialRules = options.enableSpecialRules;
      lib_R2L.reloadRules();
    }
  }

  // linkeddata/metadata equivalency
  if (options.linkeddata !== undefined && options.metadata === undefined) {
    options.metadata = options.linkeddata;
  }
  if (options.metadata !== undefined) {
    options.metadata = Boolean(options.metadata);
    if (Boolean(lib_R2L.options.metadata) !== options.metadata) {
      lib_R2L.options.ruleHeading = options.metadata ? lib_R2L.viewOptions.enhancedHeading : '';
    }
  }
  if (options.linkedDataMode) {
    var ldOpts = [settings/* LD_MODE_ALL */.zP, settings/* LD_ADVANCED_MODE_SHORT_TITLES */.Zj, settings/* LD_ADVANCED_MODE_CORRECTIONS */.s5, settings/* LD_MODE_METADATA */.XS, settings/* LD_ADVANCED_MODE_KM_HANDOC */.n_, settings/* LD_ADVANCED_MODE_KM_CIS */.PR, settings/* LD_ADVANCED_MODE_EUCASE_JOINED_JUDGEMENT */.VN, settings/* LD_MODE_SEQ_NUMBER */.z4, settings/* LD_MODE_CHECK_EXISTS */.Np];
    if (Array.isArray(options.linkedDataMode)) {
      options.linkedDataMode = options.linkedDataMode.filter(function (o) {
        return ldOpts.indexOf(o) !== -1;
      });
    } else if (typeof options.linkedDataMode === "string" && ldOpts.indexOf(options.linkedDataMode) > -1) {
      options.linkedDataMode = [options.linkedDataMode];
    } else {
      options.linkedDataMode = [settings/* LD_MODE_ALL */.zP];
    }
  }
  if (options.pointInTime !== undefined) {
    lib_R2L.ldm.clearCache();
  }
  lib_R2L.options = _objectSpread(_objectSpread({}, lib_R2L.options), options);
  console.debug("Configured R2L options", lib_R2L.options);
};

/**
 * Check if a certain linked-data mode is active
 * @param {String} mode
 * @returns {Boolean} 
 */
lib_R2L.hasLinkedDataMode = function (mode) {
  // LD_MODE_ALL does not include advanced modes
  if ([settings/* LD_ADVANCED_MODE_CORRECTIONS */.s5, settings/* LD_ADVANCED_MODE_KM_HANDOC */.n_, settings/* LD_ADVANCED_MODE_SHORT_TITLES */.Zj, settings/* LD_ADVANCED_MODE_EUCASE_JOINED_JUDGEMENT */.VN].indexOf(mode) !== -1) {
    return this.options.linkedDataMode.indexOf(mode) > -1;
  }
  return Array.isArray(this.options.linkedDataMode) && (this.options.linkedDataMode.indexOf(mode) > -1 || this.options.linkedDataMode.indexOf(settings/* LD_MODE_ALL */.zP) > -1);
};

/** 
 * Set target language
 * @param {string} - ISO 3 language 
 */
lib_R2L.setLanguage = function (language) {
  var parts = String(language).split("-");
  if (parts.length > 1) {
    this.options.language = parts[0];
    // multi language detected
    this.options.multiLanguage = language;
  } else {
    this.options.language = language;
  }
};

/** 
 * Get current target language
 * @returns {String} - ISO 3 language (or empty string)
 */
lib_R2L.getLanguage = function () {
  var lang = this.options.language;
  return lang || '';
};

/** 
 * Set multi language 
 * @param {string} - ISO 3 language list separated by dash or comma eg: ENG-FRA
 */
lib_R2L.setMultiLanguage = function (multiLanguage) {
  if (multiLanguage) {
    multiLanguage = String(multiLanguage).replace(/,/g, "-");
  }
  this.options.multiLanguage = multiLanguage;
};

/** 
 * Get current multi-language
 * @returns {String} - ISO 3 language list separated by dash eg: ENG-FRA (or empty string)
 */
lib_R2L.getMultiLanguage = function () {
  var lang = this.options.multiLanguage;
  return lang || '';
};

/** 
 * Set target format
 * @param {string} - eg. 'PDF'
 */
lib_R2L.setTargetFormat = function (targetFormat) {
  if ([settings/* TARGET_FORMAT_PDF */.l7, settings/* TARGET_FORMAT_HTML */.Mu, settings/* TARGET_FORMAT_XML */.yg].indexOf(String(targetFormat).toUpperCase()) === -1) {
    targetFormat = '';
  }
  this.options.targetFormat = targetFormat;
};

/** 
 * Get target format
 * @returns {String} - eg. 'PDF' (or empty string)
 */
lib_R2L.getTargetFormat = function () {
  return this.options.targetFormat || '';
};
lib_R2L.registerWorker = function () {
  if (this.worker || !window.Worker) {
    return false;
  }

  // URL.createObjectURL
  window.URL = window.URL || window.webkitURL;
  var response = "\n    self.addEventListener('message', function(event) {\n        var matches = [];\n        while((args = event.data.pattern.exec(event.data.text))) {\n            matches.push({\n                args: args,\n                lastIndex: event.data.pattern.lastIndex\n            });\n        }\n        postMessage({ uuid: event.data.uuid, text: event.data.text, matches: matches });\n    });";
  var blob;
  try {
    blob = new Blob([response], {
      type: 'application/javascript'
    });
  } catch (e) {
    // Backwards-compatibility
    window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder;
    blob = new BlobBuilder();
    blob.append(response);
    blob = blob.getBlob();
  }

  // init worker
  this.worker = new Worker(URL.createObjectURL(blob));
  this.worker.onmessage = function (e) {
    if (e.data) {
      shared/* sharedCtx */.L.setMatches(e.data.uuid, e.data.text, e.data.matches);
      shared/* sharedCtx */.L.callback(e.data.uuid, e.data.text);
      shared/* sharedCtx */.L.reset(e.data.uuid);
    }
  };
};
lib_R2L.destroyWorker = function () {
  if (this.worker) {
    this.worker.terminate();
    this.worker = null;
  }
};

/**
 * Utility function used by the `R2L.parse()` API to resolve a promise with data 
 */
function resolver(format, text, matches, resolve) {
  // send results
  switch (format) {
    case "html":
      if (lib_R2L.options && lib_R2L.options.metadata) {
        // linked data is enabled?
        lib_R2L.loadMetadata(lib_R2L.getNodes(matches)).then(function (linkedData) {
          resolve(lib_R2L.formatters.html(matches, text, linkedData));
        })["catch"](function (e) {
          console.error("Failed to load metadata", e);
          resolve(lib_R2L.formatters.html(matches, text, {}));
        });
      } else {
        resolve(lib_R2L.formatters.html(matches, text));
      }
      break;
    case "xml":
      // no linked-data
      resolve(lib_R2L.formatters.xml(matches, text));
      break;
    case "json":
      if (lib_R2L.options && lib_R2L.options.metadata) {
        // linked data is enabled?
        lib_R2L.loadMetadata(lib_R2L.getNodes(matches)).then(function (linkedData) {
          resolve(lib_R2L.formatters.json(matches, text)); // will include linked data 
        })["catch"](function (e) {
          console.error("Failed to load metadata", e);
          resolve(lib_R2L.formatters.json(matches, text));
        });
      } else {
        resolve(lib_R2L.formatters.json(matches, text));
      }
      break;
    default:
      resolve(text);
      break;
  }
}


/***/ }),

/***/ 994:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   a8: () => (/* binding */ bindJquery),
/* harmony export */   wE: () => (/* binding */ clearTooltips)
/* harmony export */ });
/* unused harmony export R2L_INITIAL_DATA_ATTR */
/* harmony import */ var _jquery_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(953);
/* harmony import */ var _ux_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(246);
/* harmony import */ var _utils_functions_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(588);
/* harmony import */ var _utils_processor_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(825);
/* harmony import */ var _alias_index_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(819);
/* harmony import */ var _settings_index_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(265);
/* harmony import */ var _utils_shared_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(500);
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }







function clearTooltips() {
  (0,_jquery_js__WEBPACK_IMPORTED_MODULE_0__.$)('.ref2link-tooltip').remove();
}
var R2L_INITIAL_DATA_ATTR = "initial";

/**
 * Binds the JQuery API to the `$` prototype, allowing users to call Ref2Link-specific methods on JQuery nodes:
 *   $('.selector').parseDeferred()
 *  
 * @param {Object} R2L 
 */
function bindJquery(R2L) {
  /**
   * Parses one JQuery object with a set of rules
   * @param {Array} rules
   * @param {Boolean} useWorker - whether to use the WebWorker (needs to be enabled)
   * @param {Boolean} withLinkedData - whether to preload metadata (needs to be enabled)
   * @returns {Promise<JQuery>} 
   */
  _jquery_js__WEBPACK_IMPORTED_MODULE_0__.$.fn.parseReferences = function (rules, useWorker, withLinkedData) {
    rules = rules || R2L.getRules();
    clearTooltips();
    // reset extracts (keep last 30 seconds extracts to avoid removing items from a parallel search)
    (0,_utils_processor_js__WEBPACK_IMPORTED_MODULE_3__/* .clearExtracts */ .Sm)(30000);
    console.debug("Extracts size", (0,_utils_processor_js__WEBPACK_IMPORTED_MODULE_3__/* .getExtracts */ .zr)());
    (0,_ux_index_js__WEBPACK_IMPORTED_MODULE_1__/* .bindTooltips */ .cg)(R2L);
    var $self = (0,_jquery_js__WEBPACK_IMPORTED_MODULE_0__.$)(this);
    var initialContent = $self.html();
    $self.data(R2L_INITIAL_DATA_ATTR, initialContent);
    var html = '';
    $self.each(function () {
      // REFTOLINK-1367 - use tabs instead of spaces
      html += (0,_jquery_js__WEBPACK_IMPORTED_MODULE_0__.$)(this).html() + "\t";
    });

    /** Guard checks optimization */
    rules = R2L.runGuards(html, rules);
    var globalRule = R2L.compileGlobalRule(rules);
    if (useWorker && R2L.worker) {
      return new Promise(function (resolve, reject) {
        var uuid = (0,_utils_functions_js__WEBPACK_IMPORTED_MODULE_2__/* .getUuid */ .YJ)();
        _utils_shared_js__WEBPACK_IMPORTED_MODULE_6__/* .sharedCtx */ .L.setCallback(uuid, html, function () {
          var promises = [];

          // if aliases are enabled we parse each node separately inside parseNodeReferences()
          (R2L.options.aliases ? Promise.resolve({}) : R2L.applyGlobalRule(html, globalRule)).then(function (matches) {
            $self.each(function () {
              promises.push((0,_jquery_js__WEBPACK_IMPORTED_MODULE_0__.$)(this).parseNodeReferences(matches));
            });
            Promise.all(promises).then(function (values) {
              if (R2L.options.metadata && withLinkedData) {
                setTimeout(function () {
                  R2L.loadMetadata($self.getFormattedReferences("json").result).then(function (result) {
                    resolve($self);
                  })["catch"](function (e) {
                    console.error(e);
                    resolve($self);
                  });
                }, 0);
              } else {
                resolve($self);
              }
            });
          });
        });
        R2L.worker.postMessage({
          text: html,
          uuid: uuid,
          pattern: globalRule.pattern
        });
      });
    } else {
      return new Promise(function (resolve, reject) {
        var promises = [];
        (R2L.options.aliases ? Promise.resolve({}) : R2L.applyGlobalRule(html, globalRule)).then(function (matches) {
          $self.each(function () {
            promises.push((0,_jquery_js__WEBPACK_IMPORTED_MODULE_0__.$)(this).parseNodeReferences(matches));
          });
          Promise.all(promises).then(function () {
            if (R2L.options.metadata && withLinkedData) {
              setTimeout(function () {
                R2L.loadMetadata($self.getFormattedReferences("json").result).then(function (result) {
                  resolve($self);
                })["catch"](function (e) {
                  console.error(e);
                  resolve($self);
                });
              }, 0);
            } else {
              resolve($self);
            }
          });
        });
      });
    }
  };

  /**
   * Performs the replacement of parsed content into a JQuery node
   * Runs an extra parse operation if aliases are enabled
   * @param {Object} matches 
   * @returns {Promise<JQuery>}
   */
  _jquery_js__WEBPACK_IMPORTED_MODULE_0__.$.fn.parseNodeReferences = function (matches) {
    var _this = this;
    return new Promise(function (resolve, reject) {
      var $self = (0,_jquery_js__WEBPACK_IMPORTED_MODULE_0__.$)(_this);
      if (!R2L.options.aliases) {
        //already parsed
        $self = (0,_jquery_js__WEBPACK_IMPORTED_MODULE_0__.$)(R2L.replaceDOM($self[0], matches));
        $self.attr(_settings_index_js__WEBPACK_IMPORTED_MODULE_5__/* .settings */ .W0.parsedAttribute);
        resolve(_this);
        return;
      } else {
        var replaceAliasesResult;
        R2L.alias.loadCustomAliases($self.text()).then(function (_) {
          // parsing will follow
          var html = $self.html();
          replaceAliasesResult = (0,_alias_index_js__WEBPACK_IMPORTED_MODULE_4__/* .replaceAliases */ .BS)(html);
          var tempHtml = replaceAliasesResult.text;
          var rules = R2L.getRules();
          rules = R2L.runGuards(tempHtml, rules);
          var globalRule = R2L.compileGlobalRule(rules);
          return R2L.applyGlobalRule(tempHtml, globalRule, true);
        }).then(function (newMatches) {
          newMatches = (0,_alias_index_js__WEBPACK_IMPORTED_MODULE_4__/* .replaceAliasMatches */ .oM)(newMatches, replaceAliasesResult);
          R2L.setGlobalMatches(newMatches);
          $self = (0,_jquery_js__WEBPACK_IMPORTED_MODULE_0__.$)(R2L.replaceDOM($self[0], newMatches));
          $self.attr(_settings_index_js__WEBPACK_IMPORTED_MODULE_5__/* .settings */ .W0.parsedAttribute);
          resolve(_this);
        });
      }
    });
  };
  _jquery_js__WEBPACK_IMPORTED_MODULE_0__.$.fn.reverse = _jquery_js__WEBPACK_IMPORTED_MODULE_0__.$.fn.reverse || [].reverse;

  /**
   * @returns {Array<Object>} 
   */
  _jquery_js__WEBPACK_IMPORTED_MODULE_0__.$.fn.getReferences = function () {
    var inTextMatches = _utils_functions_js__WEBPACK_IMPORTED_MODULE_2__/* .getReferences */ .zP.call(this);
    var asArray = [];
    Object.keys(inTextMatches || {}).forEach(function (_matchKey) {
      asArray.push(inTextMatches[_matchKey]);
    });
    return asArray;
  };

  /**
   * Returns formatted references object (json/xml/html)
   * @param {String} format 
   * @returns {Object}
   */
  _jquery_js__WEBPACK_IMPORTED_MODULE_0__.$.fn.getFormattedReferences = function (format) {
    format = format || 'identity';
    var formatter = format,
      references = (0,_jquery_js__WEBPACK_IMPORTED_MODULE_0__.$)(this).getReferences();
    ;
    if (Object.prototype.toString.call(format) === "[object String]") {
      formatter = R2L.formatters[format];
    }
    return formatter(references, (0,_jquery_js__WEBPACK_IMPORTED_MODULE_0__.$)(this).data(R2L_INITIAL_DATA_ATTR) || "");
  };
  _jquery_js__WEBPACK_IMPORTED_MODULE_0__.$.fn.setAlternative = function (alternative) {
    R2L.setAlternative.call(R2L, this, alternative);
  };
  _jquery_js__WEBPACK_IMPORTED_MODULE_0__.$.fn.removeReference = function () {
    return R2L.removeReference(this);
  };
  _jquery_js__WEBPACK_IMPORTED_MODULE_0__.$.fn.getR2L = function () {
    return R2L;
  };
  _jquery_js__WEBPACK_IMPORTED_MODULE_0__.$.fn.setRef2linkMatch = function (ref2link) {
    var isMultiple = 0;
    ref2link.alternatives.sort(_ux_index_js__WEBPACK_IMPORTED_MODULE_1__/* .orderSorter */ .Y3);
    for (var i = 0; i < ref2link.alternatives.length; i++) {
      isMultiple++;
      if (isMultiple >= 2) {
        break;
      }
    }
    ;
    (0,_jquery_js__WEBPACK_IMPORTED_MODULE_0__.$)(this).data(R2L.settings.dataAttribute, ref2link);
    if (isMultiple >= 2) {
      (0,_jquery_js__WEBPACK_IMPORTED_MODULE_0__.$)(this).addClass(_settings_index_js__WEBPACK_IMPORTED_MODULE_5__/* .settings */ .W0.multipleGeneratedClassName);
    }
    return (0,_jquery_js__WEBPACK_IMPORTED_MODULE_0__.$)(this).addClass(_settings_index_js__WEBPACK_IMPORTED_MODULE_5__/* .settings */ .W0.generatedClassName);
  };
  _jquery_js__WEBPACK_IMPORTED_MODULE_0__.$.fn.getRef2linkMatch = function () {
    var $this = (0,_jquery_js__WEBPACK_IMPORTED_MODULE_0__.$)(this),
      ref2link = $this.data(R2L.settings.dataAttribute) || {};
    if (_jquery_js__WEBPACK_IMPORTED_MODULE_0__.$.isEmptyObject(ref2link)) {
      ref2link = R2L.getGlobalMatch($this.attr(R2L.dataRef2linkInitialAttribute), $this.attr(R2L.dataRef2linkContextAttribute));
    }
    if (_jquery_js__WEBPACK_IMPORTED_MODULE_0__.$.isEmptyObject(ref2link)) {
      /** not parsed or no matches */
      return ref2link;
    }
    ref2link.reference = ref2link.hasOwnProperty('match') ? ref2link.match : $this.html();
    return ref2link;
  };
  _jquery_js__WEBPACK_IMPORTED_MODULE_0__.$.fn.unparseTextRules = function () {
    /** undo all links with their initial full match */
    ((0,_jquery_js__WEBPACK_IMPORTED_MODULE_0__.$)(this).is(".".concat(_settings_index_js__WEBPACK_IMPORTED_MODULE_5__/* .settings */ .W0.generatedClassName)) ? (0,_jquery_js__WEBPACK_IMPORTED_MODULE_0__.$)(this) : (0,_jquery_js__WEBPACK_IMPORTED_MODULE_0__.$)(this).find(".".concat(_settings_index_js__WEBPACK_IMPORTED_MODULE_5__/* .settings */ .W0.generatedClassName))).each(function () {
      var $ref2linkContainer = (0,_jquery_js__WEBPACK_IMPORTED_MODULE_0__.$)(this).parentsUntil(":not(.".concat(_settings_index_js__WEBPACK_IMPORTED_MODULE_5__/* .settings */ .W0.generatedClassName, ")"));
      if (!$ref2linkContainer.length) {
        $ref2linkContainer = (0,_jquery_js__WEBPACK_IMPORTED_MODULE_0__.$)(this);
      }
      var reference = $ref2linkContainer.attr(R2L.settings.dataInitialAttribute);
      (0,_jquery_js__WEBPACK_IMPORTED_MODULE_0__.$)(this).replaceWith(reference);
    });
    (0,_utils_processor_js__WEBPACK_IMPORTED_MODULE_3__/* .clearTextCaches */ .iJ)();
    clearTooltips();
  };

  /**
   * Wrapper parser of multiple JQuery objects with a set of rules
   * Will also load linked-data (asynchronously) if the option is enabled
   * @param {Array} rules
   * @returns {Array<Promise<JQuery>>} 
   */
  _jquery_js__WEBPACK_IMPORTED_MODULE_0__.$.fn.parseDeferred = function (rules) {
    if (!Array.isArray(rules) || !rules.length) {
      rules = R2L.getRules();
    }
    var s = new Date().getTime();
    var stack = [];
    // store the element 
    R2L.$el = (0,_jquery_js__WEBPACK_IMPORTED_MODULE_0__.$)(this);
    (0,_jquery_js__WEBPACK_IMPORTED_MODULE_0__.$)(this).each(function () {
      var self = this,
        $self = (0,_jquery_js__WEBPACK_IMPORTED_MODULE_0__.$)(self);
      var p = new Promise(function (resolve, reject) {
        if ((0,_jquery_js__WEBPACK_IMPORTED_MODULE_0__.$)(self).is("[".concat(_settings_index_js__WEBPACK_IMPORTED_MODULE_5__/* .settings */ .W0.parsedAttribute, "]"))) {
          return reject(false);
        }
        var text = $self.html();
        setTimeout(function () {
          $self.parseReferences(rules, R2L.worker ? true : false).then(function ($el) {
            (0,_jquery_js__WEBPACK_IMPORTED_MODULE_0__.$)(self).trigger('before-replace.ref2link').attr(_settings_index_js__WEBPACK_IMPORTED_MODULE_5__/* .settings */ .W0.parsedAttribute, true).trigger('after-replace.ref2link');
            resolve((0,_jquery_js__WEBPACK_IMPORTED_MODULE_0__.$)(self));
          });
        }, 1);
      });
      stack.push(p);
    });
    stack = stack.map(function (promise) {
      var resolver, rejecter;
      var parser = new Promise(function (resolve, reject) {
        resolver = resolve;
        rejecter = reject;
      });
      return {
        p: promise,
        resolver: resolver,
        rejecter: rejecter,
        parser: parser
      };
    });
    var elements = _toConsumableArray(stack);
    Promise.all(stack.map(function (item) {
      return item.p;
    })).then(function (values) {
      setTimeout(function () {
        /** now that processing has finished reset parsed nodes status */
        (0,_jquery_js__WEBPACK_IMPORTED_MODULE_0__.$)("[".concat(_settings_index_js__WEBPACK_IMPORTED_MODULE_5__/* .settings */ .W0.parsedAttribute, "]")).addClass('ref2link-container').removeAttr(_settings_index_js__WEBPACK_IMPORTED_MODULE_5__/* .settings */ .W0.parsedAttribute);
        var duration = new Date().getTime() - s;
        console.debug('Parsed in ', duration, 'ms');
        elements.forEach(function (p, index) {
          p.resolver(values[index]);
        });

        // linked data is fetched independently from the parsing 
        if (R2L.options.metadata) {
          setTimeout(function () {
            R2L.loadMetadata(R2L.getFormattedReferences("json").result).then(function (result) {
              (0,_jquery_js__WEBPACK_IMPORTED_MODULE_0__.$)(document).trigger('ref2link.ld', true);
            })["catch"](function (e) {
              (0,_jquery_js__WEBPACK_IMPORTED_MODULE_0__.$)(document).trigger('ref2link.ld', false);
              console.error(e);
            });
          }, 0);
        }
      }, 0);
    });
    return stack.map(function (item) {
      return item.parser;
    });
  };
  _jquery_js__WEBPACK_IMPORTED_MODULE_0__.$.fn.parseTextRules = _jquery_js__WEBPACK_IMPORTED_MODULE_0__.$.fn.parseDeferred;
}

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};

// EXTERNAL MODULE: ./src/lib/index.js + 14 modules
var lib = __webpack_require__(979);
// EXTERNAL MODULE: ./src/lib/utils/converters.js
var converters = __webpack_require__(560);
// EXTERNAL MODULE: ./src/lib/utils/letters.js
var letters = __webpack_require__(228);
// EXTERNAL MODULE: ./src/lib/rules/index.js
var rules = __webpack_require__(567);
// EXTERNAL MODULE: ./src/lib/jquery/index.js
var jquery = __webpack_require__(994);
// EXTERNAL MODULE: ./src/lib/jquery.js
var lib_jquery = __webpack_require__(953);
// EXTERNAL MODULE: ./src/lib/settings/index.js
var settings = __webpack_require__(265);
// EXTERNAL MODULE: ./src/lib/manager/index.js + 19 modules
var manager = __webpack_require__(33);
// EXTERNAL MODULE: ./src/lib/utils/functions.js
var functions = __webpack_require__(588);
// EXTERNAL MODULE: ./src/lib/utils/data.js
var utils_data = __webpack_require__(13);
;// ./src/lib/utils/decorators.js






/**
 * Embed linked-data into HTML content based on CELLAR identifiers
 * @param {String} html 
 * @param {Object} linkedData 
 * 
 * @returns {String} HTML content enriched with `data-ref2link-ld` attributes for detected references
 */
function insertLinkedData(html, linkedData) {
  var $container = (0,lib_jquery.$)("<div>".concat(html, "</div>"));
  var $nodes = (0,lib_jquery.$)(".".concat(settings/* settings */.W0.generatedClassName), $container);
  $nodes.each(function (idx, node) {
    var initialHtml = node.outerHTML;
    var data = buildAttributesMap(node);
    var linkedDataId = (0,utils_data/* extractLinkedDataId */.gq)(data);
    if (linkedData[linkedDataId] && linkedData[linkedDataId].status === manager/* SPARQL_STATUS_SUCCESS */.X) {
      // set linked data object
      (0,lib_jquery.$)(node).attr("data-ref2link-ld", JSON.stringify((0,manager/* cleanLinkedDataBinding */.S_)(linkedData[linkedDataId])));
      // replace in content
      html = html.split(initialHtml).join(node.outerHTML);
    }
  });
  return html;
}

/**
 * 
 * @param {String} html content 
 * @param {Object} references 
 * 
 * @returns {String} HTML content with additional `data-ref2link-*` attributes containing all targets.
 */
function insertNodeData(html, references) {
  var matchNodes = R2L.getNodes(references);
  var $container = (0,lib_jquery.$)("<div>".concat(html, "</div>"));
  var $nodes = (0,lib_jquery.$)(".".concat(settings/* settings */.W0.generatedClassName), $container);
  $nodes.each(function (idx, node) {
    var initialHtml = node.outerHTML;
    var data = buildAttributesMap(node);

    // find the right node match using the context/matched-text pair
    var foundMatchNode = matchNodes.filter(function (matchNode) {
      var foundOffset = matchNode.matches.filter(function (offset) {
        return offset.context === data['data-ref2link-context'] && (offset.match === data['data-ref2link-initial'] || offset.match === node.textContent || offset.match.replace(/&nbsp;/g, String.fromCharCode(160)) === node.textContent);
      }).pop();
      return !!foundOffset;
    }).pop();
    if (foundMatchNode) {
      // set linked data object
      (0,lib_jquery.$)(node).attr("data-ref2link-urls", JSON.stringify(foundMatchNode.urls.map(function (url) {
        return {
          title: url.title,
          href: url.href
        };
      })));
      (0,lib_jquery.$)(node).attr("data-ref2link-type", foundMatchNode.type);
      (0,lib_jquery.$)(node).attr("data-ref2link-uuid", (0,functions/* getUuid */.YJ)());

      // replace in content (only first occurence because the uuid is different even for duplicate matches)
      html = html.replace(initialHtml, node.outerHTML);
    } else {
      console.debug("Node not found", data);
    }
  });
  return html;
}
function buildAttributesMap(node) {
  if (!node.attributes) {
    return {};
  }
  var data = {};
  try {
    for (var i = 0; i < node.attributes.length; i++) {
      data[node.attributes[i].name] = node.attributes[i].value;
    }
    return data;
  } catch (e) {
    return data;
  }
}
;// ./src/lib/formatters/index.js





function bindFormatters(R2L) {
  /**
  * Build output nodes from the references map. Group/count accordingly.
  *
  * @param {Object} references
  */
  R2L.getNodes = function (references) {
    var _this = this;
    var idx = 0;
    var rendered = {};
    var nodes = new Array();
    // compute targets list 
    var _allViewTargets = (0,functions/* getAllViewTargetMap */.An)(true);
    Object.keys(references).forEach(function (_refKey) {
      if (!references[_refKey]) {
        return;
      }
      var _ref = references[_refKey];
      for (var k = 0; k < _ref.offsets.length; k++) {
        var views = [];
        var offsetUid = _ref.match;
        var urls = [];
        var attributesList = (0,functions/* extractOrderedAttributes */.EG)(_ref.offsets[k].alternatives);
        var label = _ref.match;
        if (Object.keys(_ref.offsets[k].views).length === 0 || Object.keys(_ref.offsets[k].views).length === 1 && _ref.offsets[k].views['table']) {
          // skipping invalid ref or ref filtered by linked data
          continue;
        }
        Object.keys(_ref.offsets[k].views).forEach(function (_view) {
          var view = _ref.offsets[k].views[_view];
          if (!view) {
            return;
          }
          if (String(_view) === "table") {
            label = view;
            offsetUid = view;
          } else {
            views.push('<view target="' + (0,functions/* escapeHTML */.Zn)(_view) + '"' + '>' + '<![CDATA[' + view + ']]>' + '</view>');
            var $view = (0,lib_jquery.$)(view);
            if ($view.attr("href")) {
              if (urls.indexOf($view.attr("href")) === -1) {
                urls.push({
                  title: $view.attr("title"),
                  href: $view.attr("href"),
                  target: _view,
                  fullTitle: (0,functions/* getFullTitle */.AB)($view.attr("title"), _ref.offsets[k].alternatives.filter(function (a) {
                    return a.viewName === _view;
                  }).map(function (a) {
                    return a.groupTarget;
                  }).pop()),
                  baseTarget: (0,functions/* getBaseTargetName */.wh)(_view),
                  position: _ref.offsets[k].position
                });
              }
            } else {
              // can be a nested link
              $view = (0,lib_jquery.$)(view).children("a");
              if ($view.attr("href")) {
                if (urls.indexOf($view.attr("href")) === -1) {
                  urls.push({
                    title: $view.attr("title"),
                    fullTitle: (0,functions/* getFullTitle */.AB)($view.attr("title"), _ref.offsets[k].alternatives.filter(function (a) {
                      return a.viewName === _view;
                    }).map(function (a) {
                      return a.groupTarget;
                    }).pop()),
                    href: $view.attr("href"),
                    target: _view,
                    baseTarget: (0,functions/* getBaseTargetName */.wh)(_view),
                    position: _ref.offsets[k].position
                  });
                }
              }
            }
          }
        });
        var data = (0,functions/* buildAttributesData */.oY)(attributesList);
        var linkedDataId = (0,utils_data/* extractLinkedDataId */.gq)(data);
        if (linkedDataId) {
          var binding = _this.ldm.getMetadataById(linkedDataId);
          data.metadata = binding && binding.data ? binding.data : {};
        }
        if (rendered[offsetUid]) {
          rendered[offsetUid].data.push(data);
          rendered[offsetUid].urls = urls;
          rendered[offsetUid].matches.push({
            uuid: (0,functions/* getUuid */.YJ)(),
            views: views,
            position: _ref.offsets[k].position,
            positionDelta: _ref.offsets[k].alias ? _ref.offsets[k].alias.source.length - _ref.offsets[k].alias.replacement.length : 0,
            match: _ref.offsets[k].match,
            context: _ref.offsets[k].context,
            alias: _ref.offsets[k].alias
          });
          rendered[offsetUid].count++;
          continue;
        }
        var node = {
          output: "",
          number: idx + 1,
          count: 1,
          data: [],
          urls: urls,
          reference: label.trim(),
          type: _ref.offsets[k].rule.baseType ? _ref.offsets[k].rule.baseType : _ref.offsets[k].rule.type,
          libelle: _ref.offsets[k].rule.baseLibelle ? _ref.offsets[k].rule.baseLibelle : _ref.offsets[k].rule.ruleLibelle,
          matches: []
        };
        node.data.push(data);
        node.output += (0,functions/* indent */.pZ)(1, '<record number="$nodeNumber">');
        node.output += (0,functions/* indent */.pZ)(2, '<reference count="$nodeCounter' + (idx + 1) + '">' + node.reference + '</reference>');
        node.output += (0,functions/* indent */.pZ)(2, '<type>' + (0,functions/* escapeHTML */.Zn)(node.type) + '</type>');
        node.output += (0,functions/* indent */.pZ)(2, '<libelle>' + (0,functions/* escapeHTML */.Zn)(node.libelle) + '</libelle>');
        if (settings/* settings */.W0.views) {
          node.output += '$matches' + (idx + 1);
          node.output += '$urls' + (idx + 1);
        }
        node.output += (0,functions/* indent */.pZ)(1, '</record>');
        idx++;
        rendered[offsetUid] = node;
        node.matches.push({
          uuid: (0,functions/* getUuid */.YJ)(),
          views: views,
          position: _ref.offsets[k].position,
          positionDelta: _ref.offsets[k].alias ? _ref.offsets[k].alias.source.length - _ref.offsets[k].alias.replacement.length : 0,
          match: _ref.offsets[k].match,
          context: _ref.offsets[k].context,
          alias: _ref.offsets[k].alias
        });
        nodes.push(node);
      }
    });
    for (var i = nodes.length - 1; i >= 0; i--) {
      var matchStr = "";
      matchStr += (0,functions/* indent */.pZ)(2, "<matches>");
      nodes[i].output = nodes[i].output.replace("$nodeCounter" + (i + 1), nodes[i].count);
      nodes[i].matches.sort(function (a, b) {
        return a.position < b.position ? -1 : 1;
      });
      for (var mI = 0; mI < nodes[i].matches.length; mI++) {
        var m = nodes[i].matches[mI];
        if (mI === 0) {
          nodes[i].position = m.position;
        }
        matchStr += (0,functions/* indent */.pZ)(3, "<match position='".concat(m.position, "' context='").concat((0,functions/* escapeHTML */.Zn)(m.context), "' reference='").concat((0,functions/* escapeHTML */.Zn)(m.match), "'>"));
        for (var vI = 0; vI < m.views.length; vI++) {
          matchStr += (0,functions/* indent */.pZ)(4, m.views[vI]);
        }
        matchStr += (0,functions/* indent */.pZ)(3, "</match>");
      }
      matchStr += (0,functions/* indent */.pZ)(2, "</matches>");
      var urlStr = "";
      if (nodes[i].urls.length > 0) {
        urlStr += (0,functions/* indent */.pZ)(2, '<urls>');
        for (var urlIndex = 0; urlIndex < nodes[i].urls.length; urlIndex++) {
          urlStr += (0,functions/* indent */.pZ)(3, "<url position=\"".concat(nodes[i].urls[urlIndex].position, "\" target=\"").concat(nodes[i].urls[urlIndex].target, "\">").concat(nodes[i].urls[urlIndex].href, "</url>"));
        }
        urlStr += (0,functions/* indent */.pZ)(2, '</urls>');
      }
      nodes[i].output = nodes[i].output.replace("$urls" + (i + 1), urlStr);
      nodes[i].output = nodes[i].output.replace("$matches" + (i + 1), matchStr);
    }
    nodes = R2L.applySort(nodes);
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].output = nodes[i].output.replace("$nodeNumber", i + 1);
    }
    return nodes;
  };
  R2L.formatters = {
    xml: function xml(references, text) {
      var nodes = R2L.getNodes(references);
      return {
        result: "<resultset size=\"".concat(nodes.length, "\">\r\n\n                    ").concat(nodes.map(function (node) {
          return node.output;
        }).join(""), "\r\n\n                    </resultset>"),
        type: 'application/xml',
        nodes: nodes,
        ext: 'xml'
      };
    },
    json: function json(references, text) {
      var nodes = R2L.getNodes(references);
      return {
        result: nodes.map(function (node) {
          // filter out data which can't be grouped by. this data belong to the 'matches' sub-elements
          delete node["output"];
          delete node["position"];
          return node;
        }),
        size: nodes.length,
        type: 'application/json',
        ext: 'json'
      };
    },
    html: function html(references, text, linkedData) {
      var html = linkedData ? insertLinkedData(R2L.replaceHtml(text, references), linkedData) : R2L.replaceHtml(text, references);
      html = insertNodeData(html, references);
      return {
        result: html,
        type: 'text/html',
        ext: 'html'
      };
    }
  };

  /**
   * Will flatten the Ref2Link JSON data structure, which groups references by their 'match'
   * The ordered nodes will not perform any grouping and will return 
   *   each detected reference (subdivision) in order, including duplicates
   * 
   * @param {Array<R2LNode>} nodes expects as input the JSON nodes list
   * @returns {Array<R2LOrderedNode>} 
   */
  R2L.getOrderedNodes = function (nodes) {
    var arr = [];
    nodes.forEach(function (node) {
      node.matches.forEach(function (match) {
        arr.push({
          alias: match.alias,
          match: match.match,
          context: match.context,
          position: match.position,
          type: node.type,
          reference: node.reference,
          urls: node.urls,
          data: node.data
        });
      });
    });
    arr.sort(function (a, b) {
      return a.position < b.position ? -1 : 1;
    });
    // add local position
    var currentContext;
    var currentContextPosition = -1;
    for (var i = 0; i < arr.length; i++) {
      if (currentContext !== arr[i].context) {
        arr[i].localPosition = 0;
        currentContextPosition = arr[i].position;
        currentContext = arr[i].context;
      } else if (arr[i - 1] && arr[i].position < arr[i - 1].position - arr[i - 1].localPosition + arr[i - 1].context.length) {
        arr[i].localPosition = arr[i].position - currentContextPosition;
      } else {
        arr[i].localPosition = 0;
        currentContextPosition = arr[i].position;
        currentContext = arr[i].context;
      }
    }
    return arr;
  };
}
;
;// ./src/lib/filters/index.js



var _filterInitialized = false;
function bindFilters(R2L) {
  R2L.getInitialFilters = function () {
    var filters = {};
    /** Only in browser env we try to read querystring params of the library */
    if (typeof window === "undefined") {
      return filters;
    }
    try {
      var scriptSrc = (0,lib_jquery.$)('script[src*="ref2link"]').first().attr('src');
      var sqv = decodeURIComponent(scriptSrc.indexOf('?') >= 0 ? scriptSrc.split('?').pop() : '');
      var lqv = decodeURIComponent(document.location.href.indexOf('?') >= 0 ? document.location.href.split('?').pop() : '');
      var qv = [sqv, lqv].join('&');
      if (qv) {
        var parts = qv.split('&');
        for (var i = 0; i < parts.length; i++) {
          var p = parts[i].split('=');
          if (p && p.length > 1 && p[1] && p[1] !== '_default') {
            if (p[0] == 're' || p[0] == 'ruleenvironment') {
              filters['environments'] = p[1].split(',');
            }
            if (p[0] == 'rt' || p[0] == 'ruletarget') {
              filters['targets'] = p[1].split(',');
            }
            if (p[0] == 'rr' || p[0] == 'ruletype') {
              filters['types'] = p[1].split(',');
            }
            if (p[0] == 'sort') {
              filters['sort'] = p[1];
            }
            if (p[0] == 'views' && !isNaN(p[1])) {
              filters['views'] = parseInt(p[1]);
            }
          }
        }
      }
    } catch (e) {}
    return filters;
  };
  R2L.resetFilters = function () {
    if (_filterInitialized) {
      return;
    }
    _filterInitialized = true;
    var filters = R2L.getInitialFilters();
    R2L.filters = R2L.defaultFilters;
    Object.keys(filters, function (filterName) {
      var filterValue = filters[filterName];
      R2L.setFilter(filterName, filterValue);
    });
  };
  R2L.setFilter = function (searchedField, searchValue, preserveRuntime) {
    if (Array.isArray(searchValue)) {
      _filterInitialized = true;
      if (searchedField == 'environments') {
        // always add public rules
        (0,rules/* clearRuntimeRules */.n3)();
        var filteredEnvironments = [],
          globalEnvironments = Object.keys(R2L.getGlobalEnvironments());
        searchValue.forEach(function (_searchVal) {
          if (globalEnvironments.indexOf('' + _searchVal) >= 0) {
            filteredEnvironments.push('' + _searchVal);
          }
        });
        if (filteredEnvironments.indexOf('*') < 0) {
          filteredEnvironments.push('*');
        }
        searchValue = filteredEnvironments;
        R2L.filters['environments'] = searchValue;
      }
      R2L.filters[searchedField] = searchValue;
      /** see what targets match now that the env changed; reset targets with views that are in environment */
      var filteredRules = R2L.getAllRules(),
        availableTargets = [];
      filteredRules.forEach(function (_filteredRule) {
        _filteredRule.views.forEach(function (_view) {
          var targetName = _view.target;
          if (availableTargets.indexOf(targetName) < 0) {
            availableTargets.push(targetName);
          }
        });
      });
      if (R2L.filters['targets'] && R2L.filters['targets'].length) {
        R2L.filters['targets'] = (0,functions/* intersect */.y$)(R2L.filters['targets'], availableTargets);
      } else {
        R2L.filters['targets'] = availableTargets;
      }
      if (R2L.filters['targets'].indexOf('table') === -1) {
        R2L.filters['targets'].push('table');
      }
      if (R2L.filters.hasOwnProperty('targets') && R2L.filters.targets.length === 0 || R2L.filters.hasOwnProperty('types') && R2L.filters.types.length === 0) {
        R2L.filters['targets'] = ['NONEOFTHISMATCHES'];
      }
      if (R2L.filters.hasOwnProperty('excludetargets')) {
        R2L.filters['excludetargets'].map(function (excludeTarget) {
          R2L.filters['targets'] = R2L.filters['targets'].filter(function (t) {
            return t.indexOf(excludeTarget) === -1;
          });
        });
      }
      (0,rules/* clearRuntimeRules */.n3)();
      if (!preserveRuntime) {
        R2L.clearCache();
      }
    }
  };

  /** application parameters placeholders ; the generated file might have other values set in parameters.xml **/
  var _viewOptions = {};
  try {
    _viewOptions = JSON.parse(R2L.getConstant("R2L_VIEW_OPTIONS"));
  } catch (e) {
    console.error(e);
  }
  R2L.linkClassName = _viewOptions['linkClassName'];
  R2L.viewUsesTarget = _viewOptions['viewUsesTarget'];
  R2L.viewTitlePrefix = _viewOptions['viewTitlePrefix'];
  R2L.viewTitleSuffix = _viewOptions['viewTitleSuffix'];

  // when document is ready reset the filters
  (0,lib_jquery.$)(R2L.resetFilters);
}
// EXTERNAL MODULE: ./src/lib/ux/index.js + 1 modules
var ux = __webpack_require__(246);
// EXTERNAL MODULE: ./src/lib/alias/index.js + 1 modules
var alias = __webpack_require__(819);
;// ./src/index.js













/**
 * Will bootstrap the Ref2Link library in the environment it's been loaded (server-side or client-side).
 */
var isBrowser = new Function("try { return this === window; } catch(e){ return false; }").call();

/**
 * Prevent double inclusion - CONFLUENCE
 */
if (isBrowser) {
  var isAlreadyIncluded = false;
  try {
    isAlreadyIncluded = window.R2L && window.R2L.version === lib/* R2L */.R.getConstant("R2L_VERSION");
  } catch (e) {}
  if (isAlreadyIncluded) {
    throw new Error("Already included R2L library");
  }
}
console.debug("Initializing R2L");
lib/* R2L */.R.$el = null;
lib/* R2L */.R.version = lib/* R2L */.R.getConstant("R2L_VERSION");
lib/* R2L */.R.build = lib/* R2L */.R.getConstant("R2L_BUILD_INFO");
lib/* R2L */.R.info = "<p>Ref2link version: ".concat(lib/* R2L */.R.version, "</p>");
lib/* R2L */.R.errors = [];
lib/* R2L */.R.delimiter2RegExp = functions/* delimiter2RegExp */.v3;
lib/* R2L */.R.getNonCapturingPattern = functions/* getNonCapturingPattern */.T0;
lib/* R2L */.R.letters = letters/* letters */.M;
lib/* R2L */.R.filters = lib/* R2L */.R.defaultFilters = {
  environments: ['*']
};
lib/* R2L */.R.settings = settings/* settings */.W0;
lib/* R2L */.R.dataRef2linkInitialAttribute = settings/* settings */.W0.dataInitialAttribute;
lib/* R2L */.R.dataRef2linkContextAttribute = settings/* settings */.W0.dataContextAttribute;
lib/* R2L */.R.ref2linkDataAttribute = settings/* settings */.W0.dataAttribute;
lib/* R2L */.R.maxReferenceLength = settings/* settings */.W0.maxReferenceLength;
lib/* R2L */.R.maxTitleLength = settings/* settings */.W0.maxTitleLength;
lib/* R2L */.R.editOptions = settings/* viewOptions */.IG; //DEPRECATED
lib/* R2L */.R.viewOptions = settings/* viewOptions */.IG;
lib/* R2L */.R.converters = converters/* converters */.m;
lib/* R2L */.R.notooltipOptions = {
  tooltipTrigger: 'notooltip'
};
lib/* R2L */.R.options = {
  //defaults
  worker: false,
  // use the WebWorker when supported in the Browser
  aliases: false,
  // Boolean to turn the aliases on/off
  ai: false,
  // Boolean to enable AI feature and detect orphan subdivisions
  metadata: false,
  // equivalent with `linkeddata`
  /**
   * Possible values: [ 
   *     LD_MODE_ALL,             # Enables LD_MODE_* options below
   *     LD_MODE_METADATA,        # Load metadata (titles, OJ, dates) from Cellar
   *     LD_MODE_SEQ_NUMBER,      # Resolve ambiguos references
   *     LD_MODE_CHECK_EXISTS,    # Check existing CELEX ids and remove non-existent ones
   *     LD_ADVANCED_MODE_SHORT_TITLES,  # Advanced mode, needs to be explicitly enabled. Will parse the long titles extracted from Cellar to generate shorter references. 
   *     LD_ADVANCED_MODE_CORRECTIONS,   # Will query each act's corrections
   *     LD_ADVANCED_MODE_KM_HANDOC # Will query ULM's API for ARES data; Requires a valid ECAS ticket.
   * ]
   */
  linkedDataMode: [settings/* LD_MODE_ALL */.zP],
  // does not include the LD_ADVANCED_MODE_* features
  enableSpecialRules: true,
  language: false,
  // TARGET language iso3; 
  multiLanguage: false,
  // iso3 language list (separated by dash) for the EUR-Lex side-by-side. Example: 'ENG-FRA-SPA'
  targetFormat: null,
  // allow for a different format to be injected in URLs eg. 'PDF'
  pointInTime: null,
  // an optional YYYY-MM-DD date to append to ELI urls (instead of the default `/oj`)
  strictRules: {} // a map with rule types as keys which applies the `strict-pattern`. Example value: `{ "eurlex.act": true }`
};
lib/* R2L */.R.alias = new alias/* AliasManager */.Y0();
lib/* R2L */.R.ldm = new manager/* LinkedDataManager */.Q8();
lib/* R2L */.R.hooks = {};
lib/* R2L */.R.symbols = {
  getInputText: Symbol("__getInputText")
};
lib/* R2L */.R.globalMatches = lib/* R2L */.R.globalViews = {};
bindFilters(lib/* R2L */.R);
bindFormatters(lib/* R2L */.R);
(0,rules/* bindRules */.$9)(lib/* R2L */.R);
(0,jquery/* bindJquery */.a8)(lib/* R2L */.R);
lib/* R2L */.R.triggers = (0,ux/* getTriggers */.Gp)(lib/* R2L */.R);

/** expose linked data methods on top level API */
lib/* R2L */.R.getCelexData = lib/* R2L */.R.ldm.getCelexData.bind(lib/* R2L */.R.ldm);
lib/* R2L */.R.getEliData = lib/* R2L */.R.ldm.getEliData.bind(lib/* R2L */.R.ldm);
lib/* R2L */.R.getAresData = lib/* R2L */.R.ldm.getAresData.bind(lib/* R2L */.R.ldm);
lib/* R2L */.R.getActsCitedByAct = lib/* R2L */.R.ldm.getActsCitedByAct.bind(lib/* R2L */.R.ldm);
lib/* R2L */.R.getActsCitingAct = lib/* R2L */.R.ldm.getActsCitingAct.bind(lib/* R2L */.R.ldm);
lib/* R2L */.R.getBasisActsByAct = lib/* R2L */.R.ldm.getBasisActsByAct.bind(lib/* R2L */.R.ldm);
lib/* R2L */.R.getActsByBasisAct = lib/* R2L */.R.ldm.getActsByBasisAct.bind(lib/* R2L */.R.ldm);
lib/* R2L */.R.getEurlexContent = lib/* R2L */.R.ldm.getEurlexContent.bind(lib/* R2L */.R.ldm);
if (isBrowser) {
  /** For client env only */
  window.R2L = lib/* R2L */.R;
  if (window.$ && window.$.fn) {
    window.$.fn.ref2link = lib/* R2L */.R;
  }
  if (lib/* R2L */.R.options.worker && window.Worker) {
    lib/* R2L */.R.registerWorker();
  }

  // only bind tooltips when the library is integrated in a Browser. Server-side it does not make any sense, even if we have a virtual DOM set up.
  (0,ux/* bindTooltips */.cg)(lib/* R2L */.R);
} else {
  /** Server-side bindings */
  module.exports = lib/* R2L */.R;
  global.btoa = function (str) {
    return new Buffer(str).toString('base64');
  };
  global.R2L = lib/* R2L */.R;
}
/******/ })()
;

//ADDED FOR LEOS LOADING: START
define(function(require, exports) {
  $ = require('jquery');
  // nothing to export really as it's jQuery plugin
});
})(jQuery, window, typeof define === 'function' && define.amd ? define : function(factory) {
if (typeof exports !== 'undefined') {
  factory(require, exports);
}
}
);