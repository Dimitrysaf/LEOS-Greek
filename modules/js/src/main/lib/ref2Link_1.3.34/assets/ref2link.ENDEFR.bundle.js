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

  // nat-ecli - only available for some countries
  if (data[_manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_NAT_ECLI */ .q0] || data["data-" + _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_NAT_ECLI */ .q0] || data["data-ref-" + _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_NAT_ECLI */ .q0]) {
    return data[_manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_NAT_ECLI */ .q0] || data["data-" + _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_NAT_ECLI */ .q0] || data["data-ref-" + _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_NAT_ECLI */ .q0];
  }
  if (data[_manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_ECLI */ .kl] || data["data-" + _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_ECLI */ .kl] || data["data-ref-" + _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_ECLI */ .kl]) {
    var ecliLinkedDataId = data[_manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_ECLI */ .kl] || data["data-" + _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_ECLI */ .kl] || data["data-ref-" + _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_ECLI */ .kl];
    // Only EU 
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
  if (data[_manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_NAT_ECLI */ .q0] || data["data-" + _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_NAT_ECLI */ .q0] || data["data-ref-" + _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_NAT_ECLI */ .q0]) {
    return _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_NAT_ECLI */ .q0;
  }
  if (data[_manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_ECLI */ .kl] || data["data-" + _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_ECLI */ .kl] || data["data-ref-" + _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_ECLI */ .kl]) {
    var ecliLinkedDataId = data[_manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_ECLI */ .kl] || data["data-" + _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_ECLI */ .kl] || data["data-ref-" + _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_ECLI */ .kl];
    // Only EU
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
  var _ref;
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
  var natEcliIds = [];
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
    natEcliIds = natEcliIds.concat(ref.data.map(function (d) {
      return d[_manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_NAT_ECLI */ .q0];
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
  natEcliIds = natEcliIds.filter(function (natEcliId) {
    return !!natEcliId;
  });
  nodes.forEach(function (ref) {
    ecliIds = ecliIds.concat(ref.data.map(function (d) {
      return d[_manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_CELEX */ .wD] ? null : d[_manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_ECLI */ .kl];
    })); //if there's a CELEX don't load anything
  });
  ecliIds = ecliIds.filter(function (ecliId) {
    return !!ecliId && String(ecliId).slice(0, 7) === "ECLI:EU"; // only use ECLI EU ids
  });
  return _ref = {}, _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_ref, _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_CELEX */ .wD, celexIds), _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_ECLI */ .kl, ecliIds), _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_ELI */ .xc, eliIds), _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_PROCEDURE */ .aO, procedureIds), _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_FINLEX */ .DZ, finlexEliIds), _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_HANDOC */ .S0, aresHandocIds), _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_CIS */ .gh, cisIds), _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_CONSIL */ .nI, consilIds), _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_OJ */ .aP, ojIds), _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_IMMC */ .pO, immcIds), _defineProperty(_ref, _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_NAT_ECLI */ .q0, natEcliIds);
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
  q0: () => (/* binding */ LD_TYPE_NAT_ECLI),
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

// UNUSED EXPORTS: Binding, CELLAR_JOINED_EUCASE_DATA_CACHE_KEY, CELLAR_JOINED_EUCASE_DATA_PROCESSED_CACHE_KEY, FORMAT_TITLE_LONG, FORMAT_TITLE_SHORT, LD_TARGET_ELI, LD_TARGET_FINLEX, LD_TARGET_KM, LD_TARGET_NAT_ECLI, SPARQL_STATUS_INIT, getCuriaEndpoint, getEurlexContentEndpoint, sanitizeLinkedDataBinding

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
  // if all the CELEX ids are either sector 6 or NON sector 6, we can use ligher versions of the query
  var hasNonCaselawIds = celexIds.find(function (c) {
    return c.slice(0, 1) !== '6';
  });
  var hasCaselawIds = celexIds.find(function (c) {
    return c.slice(0, 1) === '6';
  });
  // if there are only sector 6 CELEX ids we can use a much lighter version of the query by not looking up OJ, consolidation, repeal data
  if (!hasNonCaselawIds) {
    return getCelexCaselawQuery(celexIds, langISO3);
  }

  // if there are no sector 6 CELEX ids we can simplify the query by not looking up ECLI, dossier data
  if (!hasCaselawIds) {
    return getCelexNonCaselawQuery(celexIds, langISO3);
  }
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
  var query = "\n        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n        PREFIX cdm:<http://publications.europa.eu/ontology/cdm#>\n        PREFIX skos:<http://www.w3.org/2004/02/skos/core#>\n        PREFIX dc:<http://purl.org/dc/elements/1.1/>\n        PREFIX lang:<http://publications.europa.eu/resource/authority/language/>\n        PREFIX xsd:<http://www.w3.org/2001/XMLSchema#>\n        PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n        PREFIX owl:<http://www.w3.org/2002/07/owl#>\n\n        SELECT DISTINCT \n            ?date ?id \n            ?title \n            ?baseTitle\n            ?eli \n            ?ecli\n            ?force \n            MIN(?dateForce) as ?dateForce\n            (REPLACE(?oj, \" /, \\\\.\\\\.\", \"\", \"i\") as ?oj)\n            ?ojId \n            ?ojResourceUrl\n            ?ojDate\n            ?consolidatedDate \n            ?consolidatedEli \n            ?consolidatedId\n            MAX(?dateValidity) as ?dateValidity\n            ?repealCelexId \n            ?repealEli\n            ?lastRepealCelexId\n            ?lastRepealEli\n            ?resourceUrl\n            ?dossierTitle\n            ?lang\n{\n        SELECT \n            ?date ?workId as ?id \n            ?title \n            ?baseTitle\n            ?eli \n            ?ecli\n            ?force \n            ?dateForce \n            (IF(BOUND(?ojIdOld), ?ojIdOld, ?ojActId) as ?ojId)\n            (IF(BOUND(?ojResourceUrlOld), ?ojResourceUrlOld, ?ojActResourceUrl) as ?ojResourceUrl)\n            (IF(BOUND(?ojDateOld), ?ojDateOld, ?ojActDate) as ?ojDate)\n            (IF(BOUND(?ojOld), ?ojOld, CONCAT(CONCAT(CONCAT(CONCAT(CONCAT(REPLACE(STR(?ojCollectionDocumentIdentifier ) , \"-\", \" \", \"i\"), \" \"), CONCAT(?ojActYear, \"/\"))), CONCAT(?ojActNumber, \", \")), \n            CONCAT(CONCAT(SUBSTR(STR(?ojActDate), 9, 2), \".\"), CONCAT(CONCAT(SUBSTR(STR(?ojActDate), 6, 2), \".\")), SUBSTR(STR(?ojActDate), 1, 4)))) as ?oj)\n            ?consolidatedDate \n            ?consolidatedEli \n            ?consolidatedId\n            ?dateValidity\n            ?repealCelexId \n            ?repealEli\n            ?lastRepealCelexId\n            ?lastRepealEli\n            ?resourceUrl\n            ?dossierTitle\n            ?lang\n        WHERE {  \n            graph ?ge { \n                ?exp cdm:expression_belongs_to_work ?s .\n                ?exp cdm:expression_title ?title_ .\n                OPTIONAL {\n                    ?exp owl:sameAs ?resourceUrl .\n                    FILTER (REGEX(?resourceUrl, \"resource/oj/\"))\n                }\n            }\n            graph ?g { \n                ?exp cdm:expression_uses_language ?lang\n                ".concat(langISO3Filters, "\n            }  \n\n            ?s cdm:work_date_document ?date .\n            ?s rdf:type ?type .\n            ?s cdm:work_id_document ?workId.\n            OPTIONAL {\n                ?s2 cdm:work_id_document ?workId.\n                ?s2 cdm:work_part_of_dossier ?dossier.\n                ?dossier cdm:dossier_title ?dossierTitle\n            }\n            OPTIONAL {\n                ?s cdm:case-law_ecli ?ecli\n            }\n            OPTIONAL {\n                ?s cdm:resource_legal_date_end-of-validity ?dateValidity .\n            }\n            ").concat(filters, "\n            \n            FILTER not exists {?s cdm:work_is_member_of_complex_work ?complex. }\n            OPTIONAL {\n                # CONSOLIDATION\n                ?actConsolidated cdm:act_consolidated_based_on_resource_legal ?s .\n                ?actConsolidated cdm:act_consolidated_date ?consolidatedDate .\n                ?actConsolidated cdm:resource_legal_date_entry-into-force ?consolidatedDateEntryForce .\n                ?actConsolidated cdm:resource_legal_eli ?consolidatedEli . \n                ?actConsolidated cdm:work_id_document ?consolidatedId_ .\n                \n                # we only need results before the end of the act validity\n                ?s cdm:resource_legal_date_end-of-validity ?act_end_of_validity .\n\n                ").concat(pointInTimeFilter1, "\n                FILTER (?consolidatedDateEntryForce < ?act_end_of_validity)     \n                FILTER regex(str(?consolidatedId_), \"celex:\")     \n                # latest consolidation date only\n                FILTER not exists {\n                    ?actConsolidated2 cdm:resource_legal_date_entry-into-force ?consolidatedDateEntryForce2 .\n                    ?actConsolidated2 cdm:act_consolidated_date ?consolidatedDate2 .\n                    ?actConsolidated2 cdm:act_consolidated_based_on_resource_legal ?s .\n                    ?s cdm:resource_legal_date_end-of-validity ?act_end_of_validity2 .\n                    ").concat(pointInTimeFilter2, "\n                    FILTER (?consolidatedDateEntryForce2 > ?consolidatedDateEntryForce AND (?consolidatedDateEntryForce2 < ?act_end_of_validity2))\n                }\n\n                BIND(SUBSTR(?consolidatedId_, 7) as ?consolidatedId)\n            }\n            OPTIONAL {\n                # REPEALING\n                ?actRepeal cdm:resource_legal_repeals_resource_legal ?s .\n                ?actRepeal cdm:resource_legal_eli ?repealEli . \n                ?actRepeal cdm:work_date_document ?repealDate . \n                ?actRepeal cdm:work_id_document ?repealCelexId_.\n                ").concat(pointInTimeFilter3, "\n                FILTER regex(str(?repealCelexId_), \"celex:\")                    \n                BIND(SUBSTR(?repealCelexId_, 7) as ?repealCelexId)\n\n                OPTIONAL {\n                    # REPEALING LAST\n                    ?lastActRepeal cdm:resource_legal_repeals_resource_legal+ ?s .\n                    ?lastActRepeal cdm:resource_legal_eli ?lastRepealEli . \n                    ?lastActRepeal cdm:work_id_document ?lastRepealCelexId_.\n                    FILTER regex(str(?lastRepealCelexId_), \"celex:\")                    \n                    FILTER not exists {\n                       ?actRepeal_ cdm:resource_legal_repeals_resource_legal ?lastActRepeal .\n                       ?actRepeal_ cdm:work_date_document ?repealDate2\n                       ").concat(pointInTimeFilter4, "\n                    } \n                    BIND(SUBSTR(?lastRepealCelexId_, 7) as ?lastRepealCelexId)\n                }\n            }\n            OPTIONAL {\n                ?s cdm:resource_legal_eli ?eli .\n            }\n            OPTIONAL {\n                # FORCE\n                ?s cdm:resource_legal_in-force ?force .\n                ?s cdm:resource_legal_date_entry-into-force ?dateForce .\n            }        \n            OPTIONAL {\n                # MANIFEST \n                ?manif cdm:manifestation_manifests_expression ?exp. \n                ?manif cdm:manifestation_type ?manifType .\n                FILTER(STR(?manifType)=\"print\" || BOUND(?ojPageFirst)) .\n\n                # MANIFEST OJ PAGE (optional)\n                OPTIONAL {\n                    ?manif cdm:manifestation_official-journal_part_page_first ?ojPageFirst.\n                    ?manif cdm:manifestation_official-journal_part_page_last ?ojPageLast.\n                }\n\n                ?manif cdm:manifestation_part_of_manifestation ?parentManif.\n                OPTIONAL {\n                    ?parentManif owl:sameAs ?langSpecificManif.\n                }\n                OPTIONAL {\n                    ?manif owl:sameAs ?manifOjResourceUrl .\n                    # We need to use the MANIFEST to get to the OJ\n                    FILTER (STRSTARTS(STR(?manifOjResourceUrl), \"http://publications.europa.eu/resource/oj/\"))\n                }\n\n                # OJ info\n                ?s cdm:resource_legal_published_in_official-journal ?q .\n                ?q cdm:official-journal_part_of_collection_document ?ojPartOld .\n                ?q cdm:official-journal_number ?ojNumberOld .\n                OPTIONAL {\n                    ?q cdm:official-journal_class ?ojClassOld .\n                }\n                ?ojPartOld skos:prefLabel ?ojPartLabelOld .\n                ?q cdm:official-journal_volume ?ojVolumeOld .\n                ?q cdm:publication_general_date_publication ?ojDateOld .\n                \n                # cross match with parent OJ resource\n                ?q owl:sameAs ?mainOjResourceUrlOld .\n                ?q cdm:work_id_document ?ojIdOld.\n                \n                # multiple OJ publications can cause trouble so we cross-match the OJ url with the manifest's (where available)\n                FILTER (!BOUND(?langSpecificManif) || STRSTARTS(STR(?langSpecificManif), STR(?mainOjResourceUrlOld)) || (REGEX(STR(?langSpecificManif), 'resource/oj/DD_')))\n                FILTER (STRSTARTS(STR(?ojIdOld), \"oj:\") AND STRSTARTS(STR(?mainOjResourceUrlOld), \"http://publications.europa.eu/resource/oj/\")) \n                BIND(?mainOjResourceUrlOld as ?ojResourceUrlOld)\n\n                BIND(CONCAT(STR(DAY(?ojDateOld)), \n                \".\", \n                STR(MONTH(?ojDateOld)), \n                \".\", \n                STR(YEAR(?ojDateOld))) as ?ojDatePublicationOld)\n\n                # OJ label; do not modify as it will be processed for translation\n                BIND(IF(BOUND(?ojPartLabelOld), \n                CONCAT(CONCAT(REPLACE(REPLACE(REPLACE(?ojPartLabelOld, \" series\", \"\", \"i\"), \"Official Journal\", \"OJ\", \"i\"), \"-\", \" \", \"i\"), \" \", \n                CONCAT(?ojNumberOld, \n                CONCAT(IF (STR(?ojClassOld) != \"R\", ?ojClassOld, \"\"),\n                CONCAT(\", \", CONCAT($ojDatePublicationOld,\n                    CONCAT(IF(BOUND(?ojPageFirst), \", p. \", \"\"), \n                    CONCAT(IF(BOUND(?ojPageFirst), xsd:integer(?ojPageFirst), \"\"), \n                    CONCAT(IF(BOUND(?ojPageLast), \"-\", \"\"), IF(BOUND(?ojPageLast), xsd:integer(?ojPageLast), \"\")))))))))), \"\") as ?ojOld) .\n\n                FILTER (lang(?ojPartLabelOld) = \"en\" )\n            }\n\n            # OJ act-by-act\n            OPTIONAL {\n                FILTER NOT EXISTS {\n                    ?s cdm:resource_legal_published_in_official-journal ?_ojTemp\n                }\n                ?s cdm:official-journal-act_date_publication ?ojActDate .\n                ?s cdm:official-journal-act_part_of_collection_document ?ojCollectionDocument .\n                ?ojCollectionDocument dc:identifier ?ojCollectionDocumentIdentifier .\n                ?s cdm:official-journal-act_subsubsection_oj ?ojSubsection .\n                ?s cdm:official-journal-act_number ?ojActNumber .\n                ?s cdm:official-journal-act_year ?ojActYear .\n                \n                ?s cdm:work_id_document ?ojActId. \n                FILTER (STRSTARTS(STR(?ojActId), \"oj:\"))\n                ?s cdm:resource_legal_eli ?ojActResourceUrl . \n            } \n\n            BIND(CONCAT(?title_, IF(BOUND(?ecli), CONCAT(\"\\nECLI identifier: \", ?ecli), \"\")) as ?title) \n            BIND(?title_ as ?baseTitle)\n        }\n    }\n    ORDER BY ?id ?lang");
  return query;
};
var getCelexCaselawQuery = function getCelexCaselawQuery(celexIds, langISO3) {
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
  for (var _i2 = 0; _i2 < celexIds.length; _i2++) {
    filters += "\"celex:".concat(celexIds[_i2], "\", \"celex:").concat(celexIds[_i2], "\"^^xsd:string"); // query both types
    if (_i2 < celexIds.length - 1) {
      filters += ",";
    }
  }
  filters += "))";
  var query = "\n        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n        PREFIX cdm:<http://publications.europa.eu/ontology/cdm#>\n        PREFIX skos:<http://www.w3.org/2004/02/skos/core#>\n        PREFIX dc:<http://purl.org/dc/elements/1.1/>\n        PREFIX lang:<http://publications.europa.eu/resource/authority/language/>\n        PREFIX xsd:<http://www.w3.org/2001/XMLSchema#>\n        PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n        PREFIX owl:<http://www.w3.org/2002/07/owl#>\n\n       \n        SELECT DISTINCT\n            ?date ?workId as ?id \n            ?title \n            ?baseTitle\n            ?ecli\n            ?dossierTitle\n            ?lang\n        WHERE {  \n            graph ?ge { \n                ?exp cdm:expression_belongs_to_work ?s .\n                ?exp cdm:expression_title ?title_ .\n            }\n            graph ?g { \n                ?exp cdm:expression_uses_language ?lang\n                ".concat(langISO3Filters, "\n            }  \n\n            ?s cdm:work_date_document ?date .\n            ?s rdf:type ?type .\n            ?s cdm:work_id_document ?workId.\n            OPTIONAL {\n                ?s2 cdm:work_id_document ?workId.\n                ?s2 cdm:work_part_of_dossier ?dossier.\n                ?dossier cdm:dossier_title ?dossierTitle\n            }\n            OPTIONAL {\n                ?s cdm:case-law_ecli ?ecli\n            }\n            \n            ").concat(filters, "\n            \n            FILTER not exists {?s cdm:work_is_member_of_complex_work ?complex. }\n            \n            BIND(CONCAT(?title_, IF(BOUND(?ecli), CONCAT(\"\\nECLI identifier: \", ?ecli), \"\")) as ?title) \n            BIND(?title_ as ?baseTitle)\n        }\n        ORDER BY ?id ?lang");
  return query;
};
var getCelexNonCaselawQuery = function getCelexNonCaselawQuery(celexIds, langISO3) {
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
  for (var _i3 = 0; _i3 < celexIds.length; _i3++) {
    filters += "\"celex:".concat(celexIds[_i3], "\", \"celex:").concat(celexIds[_i3], "\"^^xsd:string"); // query both types
    if (_i3 < celexIds.length - 1) {
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
  var query = "\n        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n        PREFIX cdm:<http://publications.europa.eu/ontology/cdm#>\n        PREFIX skos:<http://www.w3.org/2004/02/skos/core#>\n        PREFIX dc:<http://purl.org/dc/elements/1.1/>\n        PREFIX lang:<http://publications.europa.eu/resource/authority/language/>\n        PREFIX xsd:<http://www.w3.org/2001/XMLSchema#>\n        PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n        PREFIX owl:<http://www.w3.org/2002/07/owl#>\n\n        SELECT DISTINCT \n            ?date ?id \n            ?title \n            ?baseTitle\n            ?eli \n            ?force \n            MIN(?dateForce) as ?dateForce\n            (REPLACE(?oj, \" /, \\\\.\\\\.\", \"\", \"i\") as ?oj)\n            ?ojId \n            ?ojResourceUrl\n            ?ojDate\n            ?consolidatedDate \n            ?consolidatedEli \n            ?consolidatedId\n            MAX(?dateValidity) as ?dateValidity\n            ?repealCelexId \n            ?repealEli\n            ?lastRepealCelexId\n            ?lastRepealEli\n            ?resourceUrl\n            ?lang\n{\n        SELECT \n            ?date ?workId as ?id \n            ?title \n            ?baseTitle\n            ?eli \n            ?force \n            ?dateForce \n            (IF(BOUND(?ojIdOld), ?ojIdOld, ?ojActId) as ?ojId)\n            (IF(BOUND(?ojResourceUrlOld), ?ojResourceUrlOld, ?ojActResourceUrl) as ?ojResourceUrl)\n            (IF(BOUND(?ojDateOld), ?ojDateOld, ?ojActDate) as ?ojDate)\n            (IF(BOUND(?ojOld), ?ojOld, CONCAT(CONCAT(CONCAT(CONCAT(CONCAT(REPLACE(STR(?ojCollectionDocumentIdentifier ) , \"-\", \" \", \"i\"), \" \"), CONCAT(?ojActYear, \"/\"))), CONCAT(?ojActNumber, \", \")), \n            CONCAT(CONCAT(SUBSTR(STR(?ojActDate), 9, 2), \".\"), CONCAT(CONCAT(SUBSTR(STR(?ojActDate), 6, 2), \".\")), SUBSTR(STR(?ojActDate), 1, 4)))) as ?oj)\n            ?consolidatedDate \n            ?consolidatedEli \n            ?consolidatedId\n            ?dateValidity\n            ?repealCelexId \n            ?repealEli\n            ?lastRepealCelexId\n            ?lastRepealEli\n            ?resourceUrl\n            ?lang\n        WHERE {  \n            graph ?ge { \n                ?exp cdm:expression_belongs_to_work ?s .\n                ?exp cdm:expression_title ?title_ .\n                OPTIONAL {\n                    ?exp owl:sameAs ?resourceUrl .\n                    FILTER (REGEX(?resourceUrl, \"resource/oj/\"))\n                }\n            }\n            graph ?g { \n                ?exp cdm:expression_uses_language ?lang\n                ".concat(langISO3Filters, "\n            }  \n\n            ?s cdm:work_date_document ?date .\n            ?s rdf:type ?type .\n            ?s cdm:work_id_document ?workId.\n            OPTIONAL {\n                ?s cdm:resource_legal_date_end-of-validity ?dateValidity .\n            }\n            ").concat(filters, "\n            \n            FILTER not exists {?s cdm:work_is_member_of_complex_work ?complex. }\n            OPTIONAL {\n                # CONSOLIDATION\n                ?actConsolidated cdm:act_consolidated_based_on_resource_legal ?s .\n                ?actConsolidated cdm:act_consolidated_date ?consolidatedDate .\n                ?actConsolidated cdm:resource_legal_date_entry-into-force ?consolidatedDateEntryForce .\n                ?actConsolidated cdm:resource_legal_eli ?consolidatedEli . \n                ?actConsolidated cdm:work_id_document ?consolidatedId_ .\n                \n                # we only need results before the end of the act validity\n                ?s cdm:resource_legal_date_end-of-validity ?act_end_of_validity .\n\n                ").concat(pointInTimeFilter1, "\n                FILTER (?consolidatedDateEntryForce < ?act_end_of_validity)     \n                FILTER regex(str(?consolidatedId_), \"celex:\")     \n                # latest consolidation date only\n                FILTER not exists {\n                    ?actConsolidated2 cdm:resource_legal_date_entry-into-force ?consolidatedDateEntryForce2 .\n                    ?actConsolidated2 cdm:act_consolidated_date ?consolidatedDate2 .\n                    ?actConsolidated2 cdm:act_consolidated_based_on_resource_legal ?s .\n                    ?s cdm:resource_legal_date_end-of-validity ?act_end_of_validity2 .\n                    ").concat(pointInTimeFilter2, "\n                    FILTER (?consolidatedDateEntryForce2 > ?consolidatedDateEntryForce AND (?consolidatedDateEntryForce2 < ?act_end_of_validity2))\n                }\n\n                BIND(SUBSTR(?consolidatedId_, 7) as ?consolidatedId)\n            }\n            OPTIONAL {\n                # REPEALING\n                ?actRepeal cdm:resource_legal_repeals_resource_legal ?s .\n                ?actRepeal cdm:resource_legal_eli ?repealEli . \n                ?actRepeal cdm:work_date_document ?repealDate . \n                ?actRepeal cdm:work_id_document ?repealCelexId_.\n                ").concat(pointInTimeFilter3, "\n                FILTER regex(str(?repealCelexId_), \"celex:\")                    \n                BIND(SUBSTR(?repealCelexId_, 7) as ?repealCelexId)\n\n                OPTIONAL {\n                    # REPEALING LAST\n                    ?lastActRepeal cdm:resource_legal_repeals_resource_legal+ ?s .\n                    ?lastActRepeal cdm:resource_legal_eli ?lastRepealEli . \n                    ?lastActRepeal cdm:work_id_document ?lastRepealCelexId_.\n                    FILTER regex(str(?lastRepealCelexId_), \"celex:\")                    \n                    FILTER not exists {\n                       ?actRepeal_ cdm:resource_legal_repeals_resource_legal ?lastActRepeal .\n                       ?actRepeal_ cdm:work_date_document ?repealDate2\n                       ").concat(pointInTimeFilter4, "\n                    } \n                    BIND(SUBSTR(?lastRepealCelexId_, 7) as ?lastRepealCelexId)\n                }\n            }\n            OPTIONAL {\n                ?s cdm:resource_legal_eli ?eli .\n            }\n            OPTIONAL {\n                # FORCE\n                ?s cdm:resource_legal_in-force ?force .\n                ?s cdm:resource_legal_date_entry-into-force ?dateForce .\n            }        \n            OPTIONAL {\n                # MANIFEST \n                ?manif cdm:manifestation_manifests_expression ?exp. \n                ?manif cdm:manifestation_type ?manifType .\n                FILTER(STR(?manifType)=\"print\" || BOUND(?ojPageFirst)) .\n\n                # MANIFEST OJ PAGE (optional)\n                OPTIONAL {\n                    ?manif cdm:manifestation_official-journal_part_page_first ?ojPageFirst.\n                    ?manif cdm:manifestation_official-journal_part_page_last ?ojPageLast.\n                }\n\n                ?manif cdm:manifestation_part_of_manifestation ?parentManif.\n                OPTIONAL {\n                    ?parentManif owl:sameAs ?langSpecificManif.\n                }\n                OPTIONAL {\n                    ?manif owl:sameAs ?manifOjResourceUrl .\n                    # We need to use the MANIFEST to get to the OJ\n                    FILTER (STRSTARTS(STR(?manifOjResourceUrl), \"http://publications.europa.eu/resource/oj/\"))\n                }\n\n                # OJ info\n                ?s cdm:resource_legal_published_in_official-journal ?q .\n                ?q cdm:official-journal_part_of_collection_document ?ojPartOld .\n                ?q cdm:official-journal_number ?ojNumberOld .\n                OPTIONAL {\n                    ?q cdm:official-journal_class ?ojClassOld .\n                }\n                ?ojPartOld skos:prefLabel ?ojPartLabelOld .\n                ?q cdm:official-journal_volume ?ojVolumeOld .\n                ?q cdm:publication_general_date_publication ?ojDateOld .\n                \n                # cross match with parent OJ resource\n                ?q owl:sameAs ?mainOjResourceUrlOld .\n                ?q cdm:work_id_document ?ojIdOld.\n                \n                # multiple OJ publications can cause trouble so we cross-match the OJ url with the manifest's (where available)\n                FILTER (!BOUND(?langSpecificManif) || STRSTARTS(STR(?langSpecificManif), STR(?mainOjResourceUrlOld)) || (REGEX(STR(?langSpecificManif), 'resource/oj/DD_')))\n                FILTER (STRSTARTS(STR(?ojIdOld), \"oj:\") AND STRSTARTS(STR(?mainOjResourceUrlOld), \"http://publications.europa.eu/resource/oj/\")) \n                BIND(?mainOjResourceUrlOld as ?ojResourceUrlOld)\n\n                BIND(CONCAT(STR(DAY(?ojDateOld)), \n                \".\", \n                STR(MONTH(?ojDateOld)), \n                \".\", \n                STR(YEAR(?ojDateOld))) as ?ojDatePublicationOld)\n\n                # OJ label; do not modify as it will be processed for translation\n                BIND(IF(BOUND(?ojPartLabelOld), \n                CONCAT(CONCAT(REPLACE(REPLACE(REPLACE(?ojPartLabelOld, \" series\", \"\", \"i\"), \"Official Journal\", \"OJ\", \"i\"), \"-\", \" \", \"i\"), \" \", \n                CONCAT(?ojNumberOld, \n                CONCAT(IF (STR(?ojClassOld) != \"R\", ?ojClassOld, \"\"),\n                CONCAT(\", \", CONCAT($ojDatePublicationOld,\n                    CONCAT(IF(BOUND(?ojPageFirst), \", p. \", \"\"), \n                    CONCAT(IF(BOUND(?ojPageFirst), xsd:integer(?ojPageFirst), \"\"), \n                    CONCAT(IF(BOUND(?ojPageLast), \"-\", \"\"), IF(BOUND(?ojPageLast), xsd:integer(?ojPageLast), \"\")))))))))), \"\") as ?ojOld) .\n\n                FILTER (lang(?ojPartLabelOld) = \"en\" )\n            }\n\n            # OJ act-by-act\n            OPTIONAL {\n                FILTER NOT EXISTS {\n                    ?s cdm:resource_legal_published_in_official-journal ?_ojTemp\n                }\n                ?s cdm:official-journal-act_date_publication ?ojActDate .\n                ?s cdm:official-journal-act_part_of_collection_document ?ojCollectionDocument .\n                ?ojCollectionDocument dc:identifier ?ojCollectionDocumentIdentifier .\n                ?s cdm:official-journal-act_subsubsection_oj ?ojSubsection .\n                ?s cdm:official-journal-act_number ?ojActNumber .\n                ?s cdm:official-journal-act_year ?ojActYear .\n                \n                ?s cdm:work_id_document ?ojActId. \n                FILTER (STRSTARTS(STR(?ojActId), \"oj:\"))\n                ?s cdm:resource_legal_eli ?ojActResourceUrl . \n            } \n\n            BIND(?title_ as ?title) \n            BIND(?title_ as ?baseTitle)\n        }\n    }\n    ORDER BY ?id ?lang");
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
  var query = "\n        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n        PREFIX cdm:<http://publications.europa.eu/ontology/cdm#>\n        PREFIX skos:<http://www.w3.org/2004/02/skos/core#>\n        PREFIX dc:<http://purl.org/dc/elements/1.1/>\n        PREFIX lang:<http://publications.europa.eu/resource/authority/language/>\n        PREFIX xsd:<http://www.w3.org/2001/XMLSchema#>\n        PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n        PREFIX owl:<http://www.w3.org/2002/07/owl#>\n\n        SELECT DISTINCT\n            ?date \n            ?id \n            ?title \n            ?eli \n            ?force \n            MIN(?dateForce) as ?dateForce \n            (REPLACE(?oj, \" /, \\\\.\\\\.\", \"\", \"i\") as ?oj)\n            ?ojResourceUrl\n            ?consolidatedDate \n            ?consolidatedEli\n            ?consolidatedId\n            ?initialEli\n            ?initialForce\n            ?initialDateValidity\n            ?finalConsolidatedEli\n            ?finalConsolidatedDate\n            MAX(?dateValidity) as ?dateValidity\n            ?repealCelexId \n            ?repealEli\n            ?lastRepealCelexId\n            ?lastRepealEli\n            ?resourceUrl\n            ?lang\n        {\n        SELECT\n            ?date ?workId as ?id \n            ?title_ as ?title \n            ?eli \n            ?force \n            ?dateForce \n\n            (IF(BOUND(?ojIdOld), ?ojIdOld, ?ojActId) as ?ojId)\n            (IF(BOUND(?ojResourceUrlOld), ?ojResourceUrlOld, ?ojActResourceUrl) as ?ojResourceUrl)\n            (IF(BOUND(?ojDateOld), ?ojDateOld, ?ojActDate) as ?ojDate)\n            (IF(BOUND(?ojOld), ?ojOld, CONCAT(CONCAT(CONCAT(CONCAT(CONCAT(REPLACE(STR(?ojCollectionDocumentIdentifier ) , \"-\", \" \", \"i\"), \" \"), CONCAT(?ojActYear, \"/\"))), CONCAT(?ojActNumber, \", \")), \n            CONCAT(CONCAT(SUBSTR(STR(?ojActDate), 9, 2), \".\"), CONCAT(CONCAT(SUBSTR(STR(?ojActDate), 6, 2), \".\")), SUBSTR(STR(?ojActDate), 1, 4)))) as ?oj)\n\n            ?consolidatedDate \n            ?consolidatedEli\n            ?consolidatedId\n            ?initialCelexId \n            ?initialEli\n            ?initialForce\n            ?initialDateValidity\n            ?finalConsolidatedEli\n            ?finalConsolidatedDate\n            ?dateValidity\n            ?repealCelexId \n            ?repealEli\n            ?lastRepealCelexId\n            ?lastRepealEli\n            ?resourceUrl\n            ?lang\n        WHERE {                  \n            graph ?ge {                     \n                ?exp cdm:expression_belongs_to_work ?s .                    \n                ?exp cdm:expression_title ?title_ .\n                OPTIONAL {\n                    ?exp owl:sameAs ?resourceUrl .\n                    FILTER (REGEX(?resourceUrl, \"resource/oj/\"))    \n                }           \n            }                \n            graph ?g {                     \n                ?exp cdm:expression_uses_language ?lang                    \n                filter(?lang=lang:".concat(langISO3, ").                  \n            }    \n\n            ?s cdm:resource_legal_eli ?eli .\n            ").concat(filters, "\n            {\n                ?s cdm:work_date_document ?date .\n                ?s rdf:type ?type .\n                ?s cdm:work_id_document ?workId\n                FILTER (STRSTARTS(?workId, \"celex:\")) . \n            }\t\t\n\n            OPTIONAL {\n                ?s cdm:case-law_ecli ?ecli\n            }\n            OPTIONAL {\n                ?s cdm:resource_legal_date_end-of-validity ?dateValidity .\n            }\n\n            OPTIONAL {\n                # INITIAL ACT\n                ?s cdm:act_consolidated_consolidates_resource_legal ?actInitial .\n                ?actInitial cdm:resource_legal_eli ?initialEli . \n                ?actInitial cdm:work_id_document ?initialCelexId .\n                # STATUS OF THE INITIAL ACT\n                ?actInitial cdm:resource_legal_in-force ?initialForce .\n\n                BIND(REPLACE(?initialEli, \"/oj\", \"\", \"i\") AS ?initialEliRaw) .\n\n                FILTER regex(str(?initialCelexId), \"celex:\") \n                # make sure we focus on the right consolidated act REFTOLINK-1310\n                FILTER STRSTARTS(?eli, ?initialEliRaw) \n\n                FILTER regex(str(?initialCelexId), \"celex:\") \n                FILTER NOT EXISTS {\n                    ?actInitial cdm:resource_legal_corrects_resource_legal ?corrigendumEli .\n                }\n\n                OPTIONAL {\n                    ?actInitial cdm:resource_legal_date_end-of-validity ?initialDateValidity .\n                }\n\n                # GET FINAL CONSOLIDATION OF INITIAL ACT\n                OPTIONAL {\n                    ?finalActConsolidated cdm:act_consolidated_based_on_resource_legal ?actInitial .\n                    ?finalActConsolidated cdm:act_consolidated_date ?finalConsolidatedDate .\n                    ?finalActConsolidated cdm:resource_legal_eli ?finalConsolidatedEli . \n                    # latest consolidation date only\n                    filter not exists {\n                        ?finalActConsolidated2 cdm:act_consolidated_based_on_resource_legal ?actInitial .\n                        ?finalActConsolidated2 cdm:act_consolidated_date ?finalConsolidatedDate2\n                        filter (?finalConsolidatedDate2 > ?finalConsolidatedDate)\n                    }\n                }\n            }\n            OPTIONAL {\n                # CONSOLIDATION\n                ?actConsolidated cdm:act_consolidated_based_on_resource_legal ?s .\n                ?actConsolidated cdm:act_consolidated_date ?consolidatedDate .\n                ?actConsolidated cdm:resource_legal_date_entry-into-force ?consolidatedDateEntryForce .\n                ?actConsolidated cdm:resource_legal_eli ?consolidatedEli . \n                ?actConsolidated cdm:work_id_document ?consolidatedId_ .\n                \n                # we only need results before the end of the act validity\n                ?s cdm:resource_legal_date_end-of-validity ?act_end_of_validity .\n\n                ").concat(pointInTimeFilter1, "\n                FILTER (?consolidatedDateEntryForce < ?act_end_of_validity)     \n                FILTER regex(str(?consolidatedId_), \"celex:\")     \n                # latest consolidation date only\n                FILTER not exists {\n                    ?actConsolidated2 cdm:resource_legal_date_entry-into-force ?consolidatedDateEntryForce2 .\n                    ?actConsolidated2 cdm:act_consolidated_based_on_resource_legal ?s .\n                    ?actConsolidated2 cdm:act_consolidated_date ?consolidatedDate2 .\n                    ?s cdm:resource_legal_date_end-of-validity ?act_end_of_validity2 .\n                    ").concat(pointInTimeFilter2, "\n                    FILTER (?consolidatedDateEntryForce2 > ?consolidatedDateEntryForce AND (?consolidatedDateEntryForce2 < ?act_end_of_validity2))\n                }\n                BIND(SUBSTR(?consolidatedId_, 7) as ?consolidatedId)\n            }\n            OPTIONAL {\n                # REPEALING\n                ?actRepeal cdm:resource_legal_repeals_resource_legal ?s .\n                ?actRepeal cdm:resource_legal_eli ?repealEli . \n                ?actRepeal cdm:work_date_document ?repealDate . \n                ?actRepeal cdm:work_id_document ?repealCelexId_.\n                ").concat(pointInTimeFilter3, "\n                FILTER regex(str(?repealCelexId_), \"celex:\")                    \n                BIND(SUBSTR(?repealCelexId_, 7) as ?repealCelexId)\n                OPTIONAL {\n                    # REPEALING LAST\n                    ?lastActRepeal cdm:resource_legal_repeals_resource_legal+ ?s .\n                    ?lastActRepeal cdm:resource_legal_eli ?lastRepealEli . \n                    ?lastActRepeal cdm:work_id_document ?lastRepealCelexId_.\n                    FILTER regex(str(?lastRepealCelexId_), \"celex:\")                    \n                    FILTER not exists {\n                       ?actRepeal_ cdm:resource_legal_repeals_resource_legal ?lastActRepeal .\n                       ?actRepeal_ cdm:work_date_document ?repealDate2\n                       ").concat(pointInTimeFilter4, "\n                    } \n                    BIND(SUBSTR(?lastRepealCelexId_, 7) as ?lastRepealCelexId)\n                }\n            }\n            OPTIONAL {\n                # FORCE\n                ?s cdm:resource_legal_in-force ?force .\n                ?s cdm:resource_legal_date_entry-into-force ?dateForce .\n            }        \n            OPTIONAL {\n                # MANIFEST \n                ?manif cdm:manifestation_manifests_expression ?exp. \n                ?manif cdm:manifestation_type ?manifType .\n                FILTER(STR(?manifType)=\"print\" || BOUND(?ojPageFirst)) .\n\n                # MANIFEST OJ PAGE\n                OPTIONAL {\n                    ?manif cdm:manifestation_official-journal_part_page_first ?ojPageFirst.\n                    ?manif cdm:manifestation_official-journal_part_page_last ?ojPageLast.\n                }\n                OPTIONAL {\n                    ?manif owl:sameAs ?manifOjResourceUrl .\n                    # We need to use the MANIFEST to get to the OJ\n                    FILTER (STRSTARTS(STR(?manifOjResourceUrl), \"http://publications.europa.eu/resource/oj/\"))\n                }\n\n                # OJ info\n                ?s cdm:resource_legal_published_in_official-journal ?q .\n                ?q cdm:official-journal_part_of_collection_document ?ojPartOld .\n                ?q cdm:official-journal_number ?ojNumberOld .\n                OPTIONAL {\n                    ?q cdm:official-journal_class ?ojClassOld .\n                }\n                ?ojPartOld skos:prefLabel ?ojPartLabelOld .\n                ?q cdm:official-journal_volume ?ojVolumeOld .\n                ?q cdm:publication_general_date_publication ?ojDateOld .\n                \n                BIND(CONCAT(STR(DAY(?ojDateOld)), \n                \".\", \n                STR(MONTH(?ojDateOld)), \n                \".\", \n                STR(YEAR(?ojDateOld))) as ?ojDatePublicationOld)\n\n                # cross match with parent OJ resource\n                ?q owl:sameAs ?mainOjResourceUrlOld .\n                ?q cdm:work_id_document ?ojIdOld.\n                \n                # multiple OJ publications can cause trouble so we cross-match the OJ url with the manifest's (where available)\n                # DISABLED - using the first result \n                # FILTER (!BOUND(?manifOjResourceUrl) || STRSTARTS(STR(?manifOjResourceUrl), STR(?mainOjResourceUrlOld)) || (REGEX(STR(?langSpecificManif), 'resource/oj/DD_')))\n                FILTER (STRSTARTS(STR(?ojIdOld), \"oj:\") AND STRSTARTS(STR(?mainOjResourceUrlOld), \"http://publications.europa.eu/resource/oj/\")) \n                BIND(?mainOjResourceUrlOld as ?ojResourceUrlOld)\n\n                # OJ label; do not modify as it will be processed for translation\n                BIND(IF(BOUND(?ojPartLabelOld), \n                CONCAT(CONCAT(REPLACE(REPLACE(REPLACE(?ojPartLabelOld, \" series\", \"\", \"i\"), \"Official Journal\", \"OJ\", \"i\"), \"-\", \" \", \"i\"), \" \", \n                CONCAT(?ojNumberOld, \n                CONCAT(IF (STR(?ojClassOld) != \"R\", ?ojClass, \"\"),\n                CONCAT(\", \", CONCAT($ojDatePublicationOld,\n                    CONCAT(IF(BOUND(?ojPageFirst), \", p. \", \"\"), \n                    CONCAT(IF(BOUND(?ojPageFirst), xsd:integer(?ojPageFirst), \"\"), \n                    CONCAT(IF(BOUND(?ojPageLast), \"-\", \"\"), IF(BOUND(?ojPageLast), xsd:integer(?ojPageLast), \"\")))))))))), \"\") as ?ojOld) .\n\n\n                FILTER ( lang(?ojPartLabelOld) = \"en\" )\n            }\n            \n            # OJ act-by-act\n            OPTIONAL {\n                FILTER NOT EXISTS {\n                    ?s cdm:resource_legal_published_in_official-journal ?_ojTemp\n                }\n                ?s cdm:official-journal-act_date_publication ?ojActDate .\n                ?s cdm:official-journal-act_part_of_collection_document ?ojCollectionDocument .\n                ?ojCollectionDocument dc:identifier ?ojCollectionDocumentIdentifier .\n                ?s cdm:official-journal-act_subsubsection_oj ?ojSubsection .\n                ?s cdm:official-journal-act_number ?ojActNumber .\n                ?s cdm:official-journal-act_year ?ojActYear .\n                \n                ?s cdm:work_id_document ?ojActId. \n                FILTER (STRSTARTS(STR(?ojActId), \"oj:\"))\n                ?s cdm:resource_legal_eli ?ojActResourceUrl . \n            } \n        }\n    }");
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
  return (0,request/* getRequestPromise */.p2)(getEndpoint(LD_TYPE_CELEX), "POST", {
    query: query,
    format: format,
    origin: '*',
    target: LD_TARGET_CELLAR
  }, null, request/* HOOK_LINKED_DATA_REQ */.ms);
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

  var searchTextEscaped = searchText ? (0,functions/* normalizeString */.J2)((0,functions/* regExpEscapeSparql */.wI)(searchText.toLowerCase())).replaceAll('"', '\\"') : null;
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

  var searchTextEscaped = searchText ? (0,functions/* normalizeString */.J2)((0,functions/* regExpEscapeSparql */.wI)(searchText.toLowerCase())).replaceAll('"', '\\"') : null;
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
    var paragraphSelector;
    if (article && paragraph && point) {
      selector = "#" + artPaddedNo + "\\." + paragraph + " table";
      fallbackSelector = paragraphSelector = "#" + artPaddedNo + "\\." + paragraph;
      isParagraph = true;
      isPoint = true;
    } else if (article && paragraph) {
      selector = paragraphSelector = "#" + artPaddedNo + "\\." + paragraph;
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
      // we failed to directly extract the subdivision, we have to go up one level
      resultString = '';
      var resultParagraphString;
      if (isParagraph) {
        if (isPoint && paragraphSelector) {
          // try the paragraphSelector to see if it exists
          resultParagraphString = $el.find(paragraphSelector).html();
        }
        if (!resultParagraphString) {
          // try to get the paragraph using the legacy method
          resultParagraphString = extractParagraphString($el.find(articleSelector).html(), paragraph);
        }
        if (resultParagraphString) {
          resultString = resultParagraphString;
        } else {
          error = ERROR_PARAGRAPH_NOT_FOUND;
        }
      }
      if (isPoint) {
        error = ERROR_POINT_NOT_FOUND;
        if (isParagraph) {
          // try to use paragraph content
          resultString = resultParagraphString; // try to get fallback content from paragraph 
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

  /** old style acts, no ELI ids in the DOM */else {
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
          var startRecording = false;
          pElements.each(function (index, elem) {
            if (elem.innerHTML.trim().replace(/&nbsp;/g, " ").match(articleRegex) && !startRecording) {
              startRecording = true;
            } else if (elem.innerHTML.trim().replace(/&nbsp;/g, " ").match(nextArticleRegex)) {
              startRecording = false;
              return false;
            }
            if (startRecording) {
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
      // secondary law extraction
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
            var _startRecording = false;
            $paragraph.children().each(function (index, currentNode) {
              var textPoint = (0,jquery.$)(currentNode).text().substring(0, 3);
              var regexPoint = new RegExp("^\\(?" + point + "\\)", "g");
              var regexNextPoint = new RegExp("^\\(?" + nextPoint + "\\)", "g");
              var regexAllPoint = new RegExp("^\\(?[a-z]\\)", "g");
              if ((0,jquery.$)(currentNode).prop("tagName") === 'P' && textPoint.match(regexPoint)) {
                _startRecording = true;
              }
              // find next point
              else if ((0,jquery.$)(currentNode).prop("tagName") === 'P' && textPoint.match(regexNextPoint)) {
                _startRecording = false;
              }
              // if last point then stop
              else if ((0,jquery.$)(currentNode).prop("tagName") === 'P' && !textPoint.match(regexAllPoint)) {
                _startRecording = false;
              }
              if (_startRecording) {
                resultString += currentNode.outerHTML;
              }
            });
          }
          if (!resultString || resultString.length < 1) {
            error = ERROR_POINT_NOT_FOUND;
            resultString = _resultParagraphString; // fallback to paragraph
          }
        } catch (e) {
          console.error('Error extracting point', e);
        }
      }
    }

    // we extract some metadata from the top-level subdivision (article)
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
      if (!header) {
        header = $article.find(".title-article-norm").text().trim();
      }
      if (header) {
        header = String(header).replace(/&nbsp;/g, " ");
      }

      // extract id
      id = $article.find(".ti-art").attr("id");
      if (!id) {
        id = $article.find(".oj-ti-art").attr("id");
      }
      if (!id) {
        id = $article.find(".title-article-norm").attr("id");
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

  // extract subdivisions for sector 3 and sector 0 (consolidations) 
  var subdivisions = sector === "3" || sector === "0" ? extractSubdivisions($el) : []; // we only extract subdivisions for sector 3

  var eurlexData = {
    id: id,
    header: header,
    subheader: subheader,
    content: parsedHtml,
    subdivisions: subdivisions,
    error: error
  };
  console.debug("Eurlex data extracted", eurlexData);
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
  return String(footnote).trim();
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
  return (0,request/* getRequestPromise */.p2)(getEndpoint(LD_TYPE_CELEX), "POST", {
    query: query,
    format: format,
    origin: '*',
    target: LD_TARGET_CELLAR
  }, null, request/* HOOK_LINKED_DATA_REQ */.ms).then(function (consolidationResponse) {
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
  var query = "\n        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n        PREFIX cdm:<http://publications.europa.eu/ontology/cdm#>\n        PREFIX skos:<http://www.w3.org/2004/02/skos/core#>\n        PREFIX dc:<http://purl.org/dc/elements/1.1/>\n        PREFIX lang:<http://publications.europa.eu/resource/authority/language/>\n        PREFIX xsd:<http://www.w3.org/2001/XMLSchema#>\n        PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n        PREFIX owl:<http://www.w3.org/2002/07/owl#>\n\n        SELECT DISTINCT \n            ?date ?id \n            ?title \n            ?baseTitle\n            ?eli \n            ?ecli\n            ?force \n            MIN(?dateForce) as ?dateForce\n            (REPLACE(?oj, \" /, \\\\.\\\\.\", \"\", \"i\") as ?oj)\n            ?ojId \n            ?ojResourceUrl\n            ?ojDate\n            ?consolidatedDate \n            ?consolidatedEli \n            ?consolidatedId\n            MAX(?dateValidity) as ?dateValidity\n            ?repealCelexId \n            ?repealEli\n            ?lastRepealCelexId\n            ?lastRepealEli\n            ?resourceUrl\n            ?lang\n{\n        SELECT \n            ?date ?workId as ?id \n            ?title \n            ?baseTitle\n            ?eli \n            ?ecli\n            ?force \n            ?dateForce \n            (IF(BOUND(?ojIdOld), ?ojIdOld, ?ojActId) as ?ojId)\n            (IF(BOUND(?ojResourceUrlOld), ?ojResourceUrlOld, ?ojActResourceUrl) as ?ojResourceUrl)\n            (IF(BOUND(?ojDateOld), ?ojDateOld, ?ojActDate) as ?ojDate)\n            (IF(BOUND(?ojOld), ?ojOld, CONCAT(CONCAT(CONCAT(CONCAT(CONCAT(REPLACE(STR(?ojCollectionDocumentIdentifier ) , \"-\", \" \", \"i\"), \" \"), CONCAT(?ojActYear, \"/\"))), CONCAT(?ojActNumber, \", \")), \n            CONCAT(CONCAT(SUBSTR(STR(?ojActDate), 9, 2), \".\"), CONCAT(CONCAT(SUBSTR(STR(?ojActDate), 6, 2), \".\")), SUBSTR(STR(?ojActDate), 1, 4)))) as ?oj)\n            ?consolidatedDate \n            ?consolidatedEli \n            ?consolidatedId\n            ?dateValidity\n            ?repealCelexId \n            ?repealEli\n            ?lastRepealCelexId\n            ?lastRepealEli\n            ?resourceUrl\n            ?lang\n        WHERE {  \n            graph ?ge { \n                ?exp cdm:expression_belongs_to_work ?s .\n                ?exp cdm:expression_title ?title_ .\n                OPTIONAL {\n                    ?exp owl:sameAs ?resourceUrl .\n                    FILTER (REGEX(?resourceUrl, \"resource/oj/\"))\n                }\n            }\n            graph ?g { \n                ?exp cdm:expression_uses_language ?lang\n                ".concat(langISO3Filters, "\n            }  \n            ?s cdm:work_date_document ?date .\n            ?s rdf:type ?type .\n            ?s cdm:work_id_document ?workId.\n            OPTIONAL {\n                ?s cdm:case-law_ecli ?ecli\n            }\n            OPTIONAL {\n                ?s cdm:resource_legal_date_end-of-validity ?dateValidity .\n            }\n            ").concat(filters, "\n\n            OPTIONAL {\n                # CONSOLIDATION\n                ?actConsolidated cdm:act_consolidated_based_on_resource_legal ?s .\n                ?actConsolidated cdm:act_consolidated_date ?consolidatedDate .\n                ?actConsolidated cdm:resource_legal_date_entry-into-force ?consolidatedDateEntryForce .\n                ?actConsolidated cdm:resource_legal_eli ?consolidatedEli . \n                ?actConsolidated cdm:work_id_document ?consolidatedId_ .\n                \n                # we only need results before the end of the act validity\n                ?s cdm:resource_legal_date_end-of-validity ?act_end_of_validity .\n\n                ").concat(pointInTimeFilter1, "\n                FILTER (?consolidatedDateEntryForce < ?act_end_of_validity)     \n                FILTER regex(str(?consolidatedId_), \"celex:\")     \n                # latest consolidation date only\n                FILTER not exists {\n                    ?actConsolidated2 cdm:resource_legal_date_entry-into-force ?consolidatedDateEntryForce2 .\n                    ?actConsolidated2 cdm:act_consolidated_date ?consolidatedDate2 .\n                    ?actConsolidated2 cdm:act_consolidated_based_on_resource_legal ?s .\n                    ?s cdm:resource_legal_date_end-of-validity ?act_end_of_validity2 .\n                    ").concat(pointInTimeFilter2, "\n                    FILTER (?consolidatedDateEntryForce2 > ?consolidatedDateEntryForce AND (?consolidatedDateEntryForce2 < ?act_end_of_validity2))\n                }\n\n                BIND(SUBSTR(?consolidatedId_, 7) as ?consolidatedId)\n            }\n            OPTIONAL {\n                # REPEALING\n                ?actRepeal cdm:resource_legal_repeals_resource_legal ?s .\n                ?actRepeal cdm:resource_legal_eli ?repealEli . \n                ?actRepeal cdm:work_date_document ?repealDate . \n                ?actRepeal cdm:work_id_document ?repealCelexId_.\n                ").concat(pointInTimeFilter3, "\n                FILTER regex(str(?repealCelexId_), \"celex:\")                    \n                BIND(SUBSTR(?repealCelexId_, 7) as ?repealCelexId)\n\n                OPTIONAL {\n                    # REPEALING LAST\n                    ?lastActRepeal cdm:resource_legal_repeals_resource_legal+ ?s .\n                    ?lastActRepeal cdm:resource_legal_eli ?lastRepealEli . \n                    ?lastActRepeal cdm:work_id_document ?lastRepealCelexId_.\n                    FILTER regex(str(?lastRepealCelexId_), \"celex:\")                    \n                    FILTER not exists {\n                       ?actRepeal_ cdm:resource_legal_repeals_resource_legal ?lastActRepeal .\n                       ?actRepeal_ cdm:work_date_document ?repealDate2\n                       ").concat(pointInTimeFilter4, "\n                    } \n                    BIND(SUBSTR(?lastRepealCelexId_, 7) as ?lastRepealCelexId)\n                }\n            }\n            OPTIONAL {\n                ?s cdm:resource_legal_eli ?eli .\n            }\n            OPTIONAL {\n                # FORCE\n                ?s cdm:resource_legal_in-force ?force .\n                ?s cdm:resource_legal_date_entry-into-force ?dateForce .\n            }        \n            OPTIONAL {\n                # MANIFEST \n                ?manif cdm:manifestation_manifests_expression ?exp. \n                ?manif cdm:manifestation_type ?manifType .\n                FILTER(STR(?manifType)=\"print\" || BOUND(?ojPageFirst)) .\n\n                # MANIFEST OJ PAGE (optional)\n                OPTIONAL {\n                    ?manif cdm:manifestation_official-journal_part_page_first ?ojPageFirst.\n                    ?manif cdm:manifestation_official-journal_part_page_last ?ojPageLast.\n                }\n\n                ?manif cdm:manifestation_part_of_manifestation ?parentManif.\n                OPTIONAL {\n                    ?parentManif owl:sameAs ?langSpecificManif.\n                }\n                OPTIONAL {\n                    ?manif owl:sameAs ?manifOjResourceUrl .\n                    # We need to use the MANIFEST to get to the OJ\n                    FILTER (STRSTARTS(STR(?manifOjResourceUrl), \"http://publications.europa.eu/resource/oj/\"))\n                }\n\n                # OJ info\n                ?s cdm:resource_legal_published_in_official-journal ?q .\n                ?q cdm:official-journal_part_of_collection_document ?ojPartOld .\n                ?q cdm:official-journal_number ?ojNumberOld .\n                OPTIONAL {\n                    ?q cdm:official-journal_class ?ojClassOld .\n                }\n                ?ojPartOld skos:prefLabel ?ojPartLabelOld .\n                ?q cdm:official-journal_volume ?ojVolumeOld .\n                ?q cdm:publication_general_date_publication ?ojDateOld .\n                \n                # cross match with parent OJ resource\n                ?q owl:sameAs ?mainOjResourceUrlOld .\n                ?q cdm:work_id_document ?ojIdOld.\n                \n                # multiple OJ publications can cause trouble so we cross-match the OJ url with the manifest's (where available)\n                FILTER (!BOUND(?langSpecificManif) || STRSTARTS(STR(?langSpecificManif), STR(?mainOjResourceUrlOld)))\n                FILTER (STRSTARTS(STR(?ojIdOld), \"oj:\") AND STRSTARTS(STR(?mainOjResourceUrlOld), \"http://publications.europa.eu/resource/oj/\")) \n                BIND(?mainOjResourceUrlOld as ?ojResourceUrlOld)\n\n                BIND(CONCAT(STR(DAY(?ojDateOld)), \n                \".\", \n                STR(MONTH(?ojDateOld)), \n                \".\", \n                STR(YEAR(?ojDateOld))) as ?ojDatePublicationOld)\n\n                # OJ label; do not modify as it will be processed for translation\n                BIND(IF(BOUND(?ojPartLabelOld), \n                CONCAT(CONCAT(REPLACE(REPLACE(REPLACE(?ojPartLabelOld, \" series\", \"\", \"i\"), \"Official Journal\", \"OJ\", \"i\"), \"-\", \" \", \"i\"), \" \", \n                CONCAT(?ojNumberOld, \n                CONCAT(IF (STR(?ojClassOld) != \"R\", ?ojClassOld, \"\"),\n                CONCAT(\", \", CONCAT($ojDatePublicationOld,\n                    CONCAT(IF(BOUND(?ojPageFirst), \", p. \", \"\"), \n                    CONCAT(IF(BOUND(?ojPageFirst), xsd:integer(?ojPageFirst), \"\"), \n                    CONCAT(IF(BOUND(?ojPageLast), \"-\", \"\"), IF(BOUND(?ojPageLast), xsd:integer(?ojPageLast), \"\")))))))))), \"\") as ?ojOld) .\n\n                FILTER (lang(?ojPartLabelOld) = \"en\" )\n            }\n\n            # OJ act-by-act\n            OPTIONAL {\n                FILTER NOT EXISTS {\n                    ?s cdm:resource_legal_published_in_official-journal ?_ojTemp\n                }\n                ?s cdm:official-journal-act_date_publication ?ojActDate .\n                ?s cdm:official-journal-act_part_of_collection_document ?ojCollectionDocument .\n                ?ojCollectionDocument dc:identifier ?ojCollectionDocumentIdentifier .\n                ?s cdm:official-journal-act_subsubsection_oj ?ojSubsection .\n                ?s cdm:official-journal-act_number ?ojActNumber .\n                ?s cdm:official-journal-act_year ?ojActYear .\n                \n                ?s cdm:work_id_document ?ojActId. \n                FILTER (STRSTARTS(STR(?ojActId), \"oj:\"))\n                ?s cdm:resource_legal_eli ?ojActResourceUrl . \n            } \n\n            BIND(CONCAT(?title_, IF(BOUND(?ecli), CONCAT(\"\\nECLI identifier: \", ?ecli), \"\")) as ?title) \n            BIND(?title_ as ?baseTitle)\n        }\n    }\n    ORDER BY ?id ?lang");
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
var LD_TYPE_NAT_ECLI = 'nat-ecli';
var LD_CELEX_SUFFIXES = ["", "-0", "-1", "-2", "-3", "-4", "-5", "-6", "-7", "-8", "-9", "-10"];
var LD_TARGET_CELLAR = 'cellar';
var LD_TARGET_FINLEX = 'finlex';
var LD_TARGET_NAT_ECLI = 'nat-ecli';
var LD_TARGET_ELI = 'eli';
var LD_TARGET_KM = 'km';
var FORMAT_TITLE_SHORT = 'short';
var FORMAT_TITLE_LONG = 'long';

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
    if (v) {
      if (typeof v.value === "string") {
        v.value = (0,functions/* sanitizeHtml */.pn)(v.value);
      } else if (!(0,functions/* isPrimitiveDataType */.ip)(v.value)) {
        v.value = null;
      }
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
var _resolveNatEcliData = /*#__PURE__*/new WeakSet();
var _resolveConsilData = /*#__PURE__*/new WeakSet();
var _resolveOjData = /*#__PURE__*/new WeakSet();
var _resolveImmcData = /*#__PURE__*/new WeakSet();
var LinkedDataManager = /*#__PURE__*/function () {
  function LinkedDataManager() {
    _classCallCheck(this, LinkedDataManager);
    _classPrivateMethodInitSpec(this, _resolveImmcData);
    _classPrivateMethodInitSpec(this, _resolveOjData);
    _classPrivateMethodInitSpec(this, _resolveConsilData);
    _classPrivateMethodInitSpec(this, _resolveNatEcliData);
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
    key: "getCuriaMetadata",
    value: function getCuriaMetadata(ecli, langISO2) {
      var queryParams = {
        ecli: ecli,
        lang: langISO2 || (0,translations/* getISO2Lang */.GB)(String(R2L.getLanguage()).toUpperCase())
      };
      var ACTION_METADATA = 'metadata';
      return (0,request/* getRequestPromise */.p2)(getCuriaEndpoint(ACTION_METADATA), "GET", queryParams, null, request/* HOOK_CURIA_REQ */.oc).then(function (response) {
        return response;
      });
    }

    /**
     * Will extract the contents of a subdivision from EUR-Lex (or Curia if an ECLI is present)
     * 
     * @param {R2LNode} node 
     * @returns {Promise<unknown>}
     */
  }, {
    key: "getEurlexContent",
    value: function getEurlexContent(node) {
      var langISO3 = R2L.getLanguage() || 'ENG';
      var langISO2 = (0,translations/* getISO2Lang */.GB)((langISO3 || "ENG").toUpperCase());
      var celex = node.data[0].celex;
      try {
        // celex id can also be present in linked data (ECLI)
        if (!celex && node.data[0].metadata && node.data[0].metadata.celexId) {
          celex = String(node.data[0].metadata.celexId.value).replace("celex:", "");
        }
        // ELI has the CELEX in the 'id' property
        if (!celex && node.data[0].metadata && node.data[0].metadata.id && node.data[0].metadata && node.data[0].metadata.id.value.indexOf("celex") === 0) {
          celex = String(node.data[0].metadata.id.value).replace("celex:", "");
        }
      } catch (e) {
        console.error(e);
        // moving on
      }
      var eliUrl;
      // pass ELI if present and point in time is enabled
      var eliUrlNode = node.urls.filter(function (url) {
        return ["eurlex.act.eli", "eurlex.oj.eli", "eurlex.intlagr.eli", "eliurl", "eurlex.eli"].indexOf(url.baseTarget) !== -1;
      }).pop();
      if (!eliUrlNode) {
        // look at linked data
        try {
          if (node.data[0].metadata && node.data[0].metadata.eli) {
            eliUrl = String(node.data[0].metadata.eli.value);
          }
        } catch (e) {
          console.error(e);
          // moving on
        }
      } else {
        eliUrl = eliUrlNode.href;
      }
      var curiaUrl = node.urls.filter(function (url) {
        return ["curia.ecli"].indexOf(url.baseTarget) !== -1;
      }).pop();

      // collect ECLI too
      var ecli = null;
      if (curiaUrl) {
        ecli = node.data && node.data[0] ? node.data[0]['ecli'] : null;
      }

      // when point in time is enabled we use the ELI
      var eli = R2L.options.pointInTime && eliUrl ? "/eli" + eliUrl.split("/eli")[1] : null;
      var linkedDataEli = node.data[0].metadata && node.data[0].metadata.eli ? node.data[0].metadata.eli.value : null;
      if (linkedDataEli && R2L.getLanguage()) {
        // target lang will be missing in linkedDataEli
        linkedDataEli += '/' + String(R2L.getLanguage()).toLowerCase();
      }

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

      // REFTOLINK-2207 pass Curia URL in case  it is used for content extraction
      if (ecli && curiaUrl) {
        queryParams.ecli = ecli;
        queryParams.curiaUrl = curiaUrl.href;
      }
      return (0,request/* getRequestPromise */.p2)(getEurlexContentEndpoint(), "GET", queryParams, null, request/* HOOK_EURLEX_REQ */.vR).then(function (response) {
        return parseContentResponse(response, node);
      });
    }
  }, {
    key: "getOjData",
    value: function getOjData(ojIds, format) {
      var langISO3 = R2L.getLanguage() || 'ENG';
      var query = getOjQuery(ojIds, langISO3);
      format = format || 'application/json';
      return (0,request/* getRequestPromise */.p2)(getEndpoint(LD_TYPE_CELEX), "POST", {
        query: query,
        format: format,
        origin: '*',
        target: LD_TARGET_CELLAR
      }, null, request/* HOOK_LINKED_DATA_REQ */.ms).then(function (response) {
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
      return (0,request/* getRequestPromise */.p2)(getEndpoint(LD_TYPE_CELEX), "POST", {
        query: query,
        format: format,
        origin: '*',
        target: LD_TARGET_CELLAR
      }, null, request/* HOOK_LINKED_DATA_REQ */.ms).then(function (response) {
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
      return (0,request/* getRequestPromise */.p2)(getEndpoint(LD_TYPE_PROCEDURE), "POST", {
        query: query,
        format: format,
        origin: '*',
        target: LD_TARGET_CELLAR
      }, null, request/* HOOK_LINKED_DATA_REQ */.ms).then(function (response) {
        return processProcResponse(response, langISO3);
      });
    }
  }, {
    key: "getEcliData",
    value: function getEcliData(ecliIds, format) {
      var query = getEcliQuery(ecliIds, R2L.getLanguage() || 'ENG');
      format = format || 'application/json';
      return (0,request/* getRequestPromise */.p2)(getEndpoint(LD_TYPE_ECLI), "POST", {
        query: query,
        format: format,
        origin: '*',
        target: LD_TARGET_CELLAR
      }, null, request/* HOOK_LINKED_DATA_REQ */.ms);
    }
  }, {
    key: "getNatEcliData",
    value: function getNatEcliData(natEcliIds, format) {
      var body = {
        ecli: natEcliIds
      };
      format = format || 'application/json';
      return (0,request/* getRequestPromise */.p2)(getEndpoint(LD_TARGET_NAT_ECLI), "POST", {
        query: JSON.stringify(body),
        format: format,
        origin: '*',
        target: LD_TARGET_NAT_ECLI
      }, null, request/* HOOK_LINKED_DATA_REQ */.ms);
    }
  }, {
    key: "getConsilData",
    value: function getConsilData(consilIds, format) {
      var langISO3 = R2L.getLanguage() || 'ENG';
      var query = getConsilQuery(consilIds, langISO3);
      format = format || 'application/json';
      return (0,request/* getRequestPromise */.p2)(getEndpoint(LD_TYPE_CELEX), "POST", {
        query: query,
        format: format,
        origin: '*',
        target: LD_TARGET_CELLAR
      }, null, request/* HOOK_LINKED_DATA_REQ */.ms).then(function (response) {
        return processConsilResponse(response, langISO3);
      });
    }
  }, {
    key: "getImmcData",
    value: function getImmcData(immcIds, format) {
      var langISO3 = R2L.getLanguage() || 'ENG';
      var query = getImmcQuery(immcIds, langISO3);
      format = format || 'application/json';
      return (0,request/* getRequestPromise */.p2)(getEndpoint(LD_TYPE_CELEX), "POST", {
        query: query,
        format: format,
        origin: '*',
        target: LD_TARGET_CELLAR
      }, null, request/* HOOK_LINKED_DATA_REQ */.ms).then(function (response) {
        return processImmcResponse(response, langISO3);
      });
    }
  }, {
    key: "getFinlexEliData",
    value: function getFinlexEliData(eliIds, format) {
      var query = getFinlexEliQuery(eliIds, R2L.getLanguage() || "ENG");
      format = format || 'application/json';
      return (0,request/* getRequestPromise */.p2)(getEndpoint(LD_TYPE_FINLEX), "POST", {
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
      return (consolidationEliIds.length > 0 ? (0,request/* getRequestPromise */.p2)(getEndpoint(LD_TYPE_ELI), "POST", {
        query: consolidationsQuery,
        format: format,
        origin: '*',
        target: LD_TARGET_ELI
      }, null, request/* HOOK_LINKED_DATA_REQ */.ms) : Promise.resolve(null)).then(function (consolidationEliResponse) {
        if (consolidationEliResponse) {
          // we override the ELI data with ids having the dates closest to ours
          computedEliIdsMap = computeEliIdsMap(eliIds, consolidationEliResponse.results.bindings);
          // we rebuild the map
          computedEliIds = Object.values(computedEliIdsMap);
        }
        var query = getEliQuery(computedEliIds, R2L.getLanguage() || "ENG");
        return (0,request/* getRequestPromise */.p2)(getEndpoint(LD_TYPE_ELI), "POST", {
          query: query,
          format: format,
          origin: '*',
          target: LD_TARGET_ELI
        }, null, request/* HOOK_LINKED_DATA_REQ */.ms);
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
        return (0,request/* getRequestPromise */.p2)(getEndpoint(LD_TYPE_HANDOC), "POST", {
          query: JSON.stringify(body),
          format: format,
          origin: '*',
          target: LD_TARGET_KM
        }, headers, request/* HOOK_LINKED_DATA_REQ */.ms).then(function (response) {
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
        return (0,request/* getRequestPromise */.p2)(getEndpoint(LD_TYPE_HANDOC), "POST", {
          query: JSON.stringify(body),
          format: format,
          origin: '*',
          target: LD_TARGET_KM
        }, headers, request/* HOOK_LINKED_DATA_REQ */.ms).then(function (response) {
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
      return (0,request/* getRequestPromise */.p2)(getEndpoint(LD_TYPE_CELEX), "POST", {
        query: query,
        format: format,
        origin: '*',
        target: LD_TARGET_CELLAR
      }, null, request/* HOOK_LINKED_DATA_REQ */.ms).then(function (response) {
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
      return (0,request/* getRequestPromise */.p2)(getEndpoint(LD_TYPE_CELEX), "POST", {
        query: query,
        format: format,
        origin: '*',
        target: LD_TARGET_CELLAR
      }, null, request/* HOOK_LINKED_DATA_REQ */.ms).then(function (response) {
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
      return (0,request/* getRequestPromise */.p2)(getEndpoint(LD_TYPE_CELEX), "POST", {
        query: query,
        format: format,
        origin: '*',
        target: LD_TARGET_CELLAR
      }, null, request/* HOOK_LINKED_DATA_REQ */.ms).then(function (response) {
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
      return (0,request/* getRequestPromise */.p2)(getEndpoint(LD_TYPE_CELEX), "POST", {
        query: query,
        format: format,
        origin: '*',
        target: LD_TARGET_CELLAR
      }, null, request/* HOOK_LINKED_DATA_REQ */.ms).then(function (response) {
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
      return (0,request/* getRequestPromise */.p2)(getEndpoint(LD_TYPE_CELEX), "POST", {
        query: query,
        format: format,
        origin: '*',
        target: LD_TARGET_CELLAR
      }, null, request/* HOOK_LINKED_DATA_REQ */.ms).then(function (response) {
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
      return (0,request/* getRequestPromise */.p2)(getEndpoint(LD_TYPE_CELEX), "POST", {
        query: query,
        format: format,
        origin: '*',
        target: LD_TARGET_CELLAR
      }, null, request/* HOOK_LINKED_DATA_REQ */.ms).then(function (response) {
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
      return (0,request/* getRequestPromise */.p2)(getEndpoint(LD_TYPE_CELEX), "POST", {
        query: query,
        format: format,
        origin: '*',
        target: LD_TARGET_CELLAR
      }, null, request/* HOOK_LINKED_DATA_REQ */.ms).then(function (response) {
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
      return (0,request/* getRequestPromise */.p2)(getEndpoint(LD_TYPE_CELEX), "POST", {
        query: query,
        format: format,
        origin: '*',
        target: LD_TARGET_CELLAR
      }, null, request/* HOOK_LINKED_DATA_REQ */.ms).then(function (response) {
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
      return (0,request/* getRequestPromise */.p2)(getEndpoint(LD_TARGET_CELLAR), "POST", {
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
      var natEcliIds = data[LD_TYPE_NAT_ECLI];

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
      }), _classPrivateMethodGet(this, _resolveNatEcliData, _resolveNatEcliData2).call(this, natEcliIds).then(function (metadata) {
        return _this3.setMetadata(metadata);
      }), _classPrivateMethodGet(this, _resolveConsilData, _resolveConsilData2).call(this, consilIds).then(function (metadata) {
        return _this3.setMetadata(metadata);
      }), _classPrivateMethodGet(this, _resolveOjData, _resolveOjData2).call(this, ojIds).then(function (metadata) {
        return _this3.setMetadata(metadata);
      }), _classPrivateMethodGet(this, _resolveImmcData, _resolveImmcData2).call(this, immcIds).then(function (metadata) {
        return _this3.setMetadata(metadata);
      })]).then(function (_) {
        _this3.status = SPARQL_STATUS_SUCCESS;
        return _this3.getMetadata([].concat(_toConsumableArray(celexIds), _toConsumableArray(ecliIds), _toConsumableArray(eliIds), _toConsumableArray(finlexEliIds), _toConsumableArray(aresHandocIds), _toConsumableArray(cisIds), _toConsumableArray(procedureIds), _toConsumableArray(natEcliIds), _toConsumableArray(consilIds), _toConsumableArray(ojIds), _toConsumableArray(immcIds)));
      })["catch"](function (e) {
        _this3.status = SPARQL_STATUS_ERROR;
        console.error(e);
        return {};
      });
    }
  }, {
    key: "formatRef",
    value:
    /**
     * Get formatted label of a R2L node
     * 
     * @param {R2LNode} node 
     * @param {string} formatType 'short'|'long'
     * @returns {string}
     */
    function formatRef(node, formatType) {
      if (!node.data[0].metadata) {
        return node.match;
      }
      try {
        var shortTitle = node.data[0].metadata.shortTitle ? node.data[0].metadata.shortTitle.value : "";
        var longTitle = node.data[0].metadata.title ? this.cleanFootnote(node.data[0].metadata.title.value) : "";
        var title = formatType === FORMAT_TITLE_LONG ? longTitle : shortTitle;
        var shortReference = node.data[0]['short-reference'] || "";
        var match = node.match;
        if (node.alias) {
          match = match.replace(node.alias.source, node.alias.replacement);
        }
        return title && shortReference ? match.replace(shortReference, title) : node.match;
      } catch (e) {
        console.error(e);
        return node.match;
      }
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
function _resolveNatEcliData2(natEcliIds) {
  var metadata = {};
  if (natEcliIds.length === 0) {
    return Promise.resolve({});
  }
  return this.getNatEcliData(natEcliIds).then(function (data) {
    if (data && data.results && data.results.bindings) {
      data.results.bindings.map(function (binding) {
        if (binding.id && binding.id.value) {
          metadata[binding.id.value] = new Binding(binding, LD_TYPE_NAT_ECLI, SPARQL_STATUS_SUCCESS);
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
function getEurlexContentEndpoint() {
  return settings/* settings */.W0.constants.R2L_CONTENT_ENDPOINT;
}
function getCuriaEndpoint(action) {
  return settings/* settings */.W0.constants.R2L_CURIA_ENDPOINT + '/' + action;
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
// EXTERNAL MODULE: ./src/lib/index.js + 15 modules
var lib = __webpack_require__(292);
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
    'R2L_VERSION': '1.3.34',
    'R2L_BUILD_INFO': 'master/5aa27063',
    'R2L_CSS_MAP': '{"ref2link.css":"LnJlZjJsaW5rLXRvb2x0aXAgewogICAgcG9zaXRpb246IGZpeGVkOwogICAgZGlzcGxheTogYmxvY2s7CiAgICBiYWNrZ3JvdW5kOiB3aGl0ZTsKICAgIGJvcmRlcjogMXB4IHNvbGlkICNlZWU7CiAgICB2aXNpYmlsaXR5OiB2aXNpYmxlOwogICAgcGFkZGluZzogMnB4OwogICAgY29sb3I6ICMzMzM7CiAgICBmb250LXNpemU6IDEuMXJlbTsKICAgIGN1cnNvcjogZGVmYXVsdDsKICAgIG92ZXJmbG93OiBoaWRkZW47CiAgICBtaW4td2lkdGg6IDE4cmVtOwogICAgbWF4LXdpZHRoOiAzMHJlbTsKICAgIC13ZWJraXQtYm94LXNoYWRvdzogMTBweCAxMHB4IDVweCAtNXB4IHJnYmEoMjgsIDI4LCAyOCwgMC41KTsKICAgIC1tb3otYm94LXNoYWRvdzogMTBweCAxMHB4IDVweCAtNXB4IHJnYmEoMjgsIDI4LCAyOCwgMC41KTsKICAgIGJveC1zaGFkb3c6IDEwcHggMTBweCA1cHggLTVweCByZ2JhKDI4LCAyOCwgMjgsIDAuNSk7Cn0KCi5yZWYybGluay10b29sdGlwIC50YWJsZSB7CiAgICBtYXJnaW4tYm90dG9tOiAwcHg7CiAgICBmb250LXNpemU6IDEycHg7CiAgICB3aWR0aDogMTAwJTsKICAgIGJvcmRlci1jb2xsYXBzZTogY29sbGFwc2U7Cn0KCi5yZWYybGluay10b29sdGlwIC5hY3RpdmUgdGQgewogICAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQgIWltcG9ydGFudDsKfQoKLnJlZjJsaW5rLXRvb2x0aXAgLnRhYmxlIC5yb3cgewogICAgYm9yZGVyLXRvcDogMXB4IHNvbGlkICNDRkNGQ0Y7CiAgICBtYXJnaW46IDAgMCA0cHggMDsKICAgIGN1cnNvcjogcG9pbnRlcjsKfQoKLnJlZjJsaW5rLXRvb2x0aXAgLnRhYmxlIC5yb3c6Zmlyc3Qtb2YtdHlwZSB7CiAgICBib3JkZXItdG9wOiBub25lICFpbXBvcnRhbnQ7Cn0KCi5yZWYybGluay10b29sdGlwIC50YWJsZSAucm93OjpiZWZvcmUgewogICAgY29udGVudDogbm9uZSAhaW1wb3J0YW50Owp9CgoucmVmMmxpbmstdG9vbHRpcCAudGFibGUgLnJvdz4qIHsKICAgIG92ZXJmbG93OiBoaWRkZW47Cn0KCi5yZWYybGluay10b29sdGlwIC50YWJsZSAucm93PnRkIHsKICAgIGJvcmRlci10b3A6IG5vbmU7CiAgICBsaW5lLWhlaWdodDogMjBweDsKICAgIHBhZGRpbmctdG9wOiAuNzVyZW07CiAgICBwYWRkaW5nLWJvdHRvbTogLjc1cmVtOwp9CgoucmVmMmxpbmstdG9vbHRpcCAucm93IC5jb2wteHMtMiB7CiAgICB3aWR0aDogMjVweDsKICAgIHRleHQtYWxpZ246IGNlbnRlcjsKfQoKLnJlZjJsaW5rLXRvb2x0aXAgLnJvdyAuY29sLXhzLTEwIHsKICAgIHdpZHRoOiBjYWxjKDEwMCUgLSAyNXB4KTsKfQoKLnJlZjJsaW5rLXRvb2x0aXAgLnJvd1tkYXRhLXN0YXRlPSIwIl0gLnIybC10b2dnbGUtaWNvbi1jb250YWluZXI6YWZ0ZXIgewogICAgY29udGVudDogIlwyNUI2IjsKfQoKLnJlZjJsaW5rLXRvb2x0aXAgLnJvd1tkYXRhLXN0YXRlPSIxIl0gLnIybC10b2dnbGUtaWNvbi1jb250YWluZXI6YWZ0ZXIgewogICAgY29udGVudDogIlwyNUJDIjsKfQoKLnJlZjJsaW5rLXRvb2x0aXAgdHIucm93W2RhdGEtZ3JvdXBdOm5vdChbZGF0YS1ncm91cD0iIl0pIC5jb2wteHMtMTAgewogICAgcGFkZGluZy1sZWZ0OiAyNXB4ICFpbXBvcnRhbnQ7Cn0KCi5yZWYybGluay10b29sdGlwIC50YWJsZS1oZWFkZXIgewogICAgY3Vyc29yOiBoZWxwOwp9CgoucmVmMmxpbmstdG9vbHRpcCAuaGVhZGluZyB7CiAgICBjdXJzb3I6IGRlZmF1bHQ7Cn0KCi5yZWYybGluay10b29sdGlwIC50YWJsZS1oZWFkZXI6aG92ZXIgewogICAgYmFja2dyb3VuZC1jb2xvcjogaW5oZXJpdCAhaW1wb3J0YW50Owp9CgoucmVmMmxpbmstdG9vbHRpcCBpW2RhdGEtYWN0aW9uPXByZXZpZXddIHsKICAgIG1pbi13aWR0aDogMjBweDsKICAgIHRleHQtYWxpZ246IGNlbnRlcjsKICAgIGhlaWdodDogMS41cmVtOwp9CgoucmVmMmxpbmstdG9vbHRpcCAuY29sLWFjdGlvbnM+KiwKLnJlZjJsaW5rLXRvb2x0aXAgaVtkYXRhLWFjdGlvbj1wcmV2aWV3XSwKLnJlZjJsaW5rLXRvb2x0aXAgaVtkYXRhLWZsYWddIHsKICAgIGRpc3BsYXk6IG5vbmU7Cn0KCi5yZWYybGluay10b29sdGlwIC5hY3RpdmUtaW5kaWNhdG9yOmhvdmVyIGlbZGF0YS1hY3Rpb249cHJldmlld10sCi5yZWYybGluay10b29sdGlwIC5hY3RpdmUgLmNvbC1hY3Rpb25zPi5ybC1saW5rLAoucmVmMmxpbmstdG9vbHRpcCAuYWN0aXZlLWluZGljYXRvcjpob3ZlciAuY29sLWFjdGlvbnM+LnJsLWxpbmssCi5yZWYybGluay10b29sdGlwIC5hY3RpdmUgW2RhdGEtZmxhZz1hY3RpdmVdIHsKICAgIGRpc3BsYXk6IGJsb2NrOwp9CgoucmVmMmxpbmstdG9vbHRpcCAuYWN0aXZlLWluZGljYXRvcjpob3ZlciBpW2RhdGEtYWN0aW9uPXByZXZpZXddIHsKICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTsKICAgIHJpZ2h0OiAwOwogICAgdG9wOiAwOwp9CgoucmVmMmxpbmstdG9vbHRpcCAudGFibGUrLnJlZjJsaW5rLXRvb2x0aXAgLnRhYmxlOmJlZm9yZSB7CiAgICBkaXNwbGF5OiBibG9jazsKICAgIGhlaWdodDogMTVweDsKICAgIGNvbnRlbnQ6ICIgIjsKICAgIGNsZWFyOiBib3RoOwp9CgovKiBMaW5rZWQgZGF0YSBDU1MgKi8KLnJlZjJsaW5rLXRvb2x0aXAgLmJpZyB7CiAgICBmb250LXNpemU6IDEzcHg7CiAgICBmb250LXdlaWdodDogNDAwOwogICAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkICNDRkNGQ0Y7Cn0KCi5yZWYybGluay10b29sdGlwIC5iaWc+dGQgewogICAgcGFkZGluZzogLjVyZW07Cn0KCi5yZWYybGluay10b29sdGlwIC5yMmwtdGl0bGUsCi5yZWYybGluay10b29sdGlwIC5yMmwtZm9yY2UgewogICAgd2hpdGUtc3BhY2U6IHByZS13cmFwOwp9CgoucmVmMmxpbmstdG9vbHRpcCAucjJsLWVsaSB7CiAgICBtYXJnaW4tdG9wOiA1cHg7Cn0KCi5yZWYybGluay10b29sdGlwIC5yMmwtZm9yY2VbZGF0YS1zdGF0dXM9JyddIHsKICAgIGRpc3BsYXk6IG5vbmU7Cn0KCi5yZWYybGluay10b29sdGlwIC5yMmwtZm9yY2UgLmJ1bGxldCB7CiAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2sgIWltcG9ydGFudDsKICAgIHdpZHRoOiAxMHB4OwogICAgaGVpZ2h0OiAxMHB4OwogICAgYm9yZGVyLXJhZGl1czogNTAlOwp9CgoucmVmMmxpbmstdG9vbHRpcCAucjJsLWZvcmNlIC5idWxsZXQ6YWZ0ZXIgewogICAgbWFyZ2luLWxlZnQ6IDVweDsKfQoKLnJlZjJsaW5rLXRvb2x0aXAgLnIybC1mb3JjZVtkYXRhLXN0YXR1cz1wZW5kaW5naW5mb3JjZV0gLmJ1bGxldCB7CiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjRURDQjA5Owp9CgoucmVmMmxpbmstdG9vbHRpcCAucjJsLWZvcmNlW2RhdGEtc3RhdHVzPWluZm9yY2VdIC5idWxsZXQgewogICAgYmFja2dyb3VuZC1jb2xvcjogIzYyOGU1NzsKfQoKLnJlZjJsaW5rLXRvb2x0aXAgLnIybC1mb3JjZVtkYXRhLXN0YXR1cz1ub3RpbmZvcmNlXSAuYnVsbGV0IHsKICAgIGJhY2tncm91bmQtY29sb3I6ICNDRkNGQ0Y7Cn0KCi5yZWYybGluay10b29sdGlwIC5yMmwtZm9yY2VbZGF0YS1zdGF0dXM9bm9sb25nZXJpbmZvcmNlXSAuYnVsbGV0IHsKICAgIGJhY2tncm91bmQtY29sb3I6ICNkYTIxMzA7Cn0KCi8qIHRpdGxlIHN0YXR1cyBDU1MgKi8KLnJlZjJsaW5rLXRvb2x0aXAgLnIybC10aXRsZS1zdGF0dXNbZGF0YS1zdGF0dXM9ZXJyb3JdIHsKICAgIGNvbG9yOiAjZGEyMTMwOwogICAgbWFyZ2luLXRvcDogNXB4Owp9CgoucmVmMmxpbmstdG9vbHRpcCAucjJsLXRpdGxlLXN0YXR1c1tkYXRhLXN0YXR1cz1wZW5kaW5nXSB7CiAgICBoZWlnaHQ6IDM1cHg7Cn0KCi5yZWYybGluay10b29sdGlwIC5yMmwtdGl0bGUtc3RhdHVzW2RhdGEtc3RhdHVzPWluZm9dIHsKICAgIG1hcmdpbi10b3A6IDVweDsKICAgIG9wYWNpdHk6IDAuNTsKfQoKLnIybC1sb2FkaW5nLWJhci1zcGlubmVyLnNwaW5uZXIgewogICAgd2lkdGg6IDIwcHg7CiAgICBoZWlnaHQ6IDIwcHg7CiAgICBtYXJnaW4tbGVmdDogLTM1cHg7CiAgICBkaXNwbGF5OiBpbmxpbmUtZmxleDsKICAgIGFuaW1hdGlvbjogbG9hZGluZy1iYXItc3Bpbm5lciA0MDBtcyBsaW5lYXIgaW5maW5pdGU7Cn0KCi5yMmwtbG9hZGluZy1iYXItc3Bpbm5lci5zcGlubmVyIC5zcGlubmVyLWljb24gewogICAgd2lkdGg6IDIwcHg7CiAgICBoZWlnaHQ6IDIwcHg7CiAgICBib3JkZXI6IHNvbGlkIDFweCB0cmFuc3BhcmVudDsKICAgIGJvcmRlci10b3AtY29sb3I6ICMwMDQ0OTQgIWltcG9ydGFudDsKICAgIGJvcmRlci1sZWZ0LWNvbG9yOiAjMDA0NDk0ICFpbXBvcnRhbnQ7CiAgICBib3JkZXItcmFkaXVzOiA1MCU7Cn0KCkBrZXlmcmFtZXMgbG9hZGluZy1iYXItc3Bpbm5lciB7CiAgICAwJSB7CiAgICAgICAgdHJhbnNmb3JtOiByb3RhdGUoMGRlZyk7CiAgICB9CgogICAgMTAwJSB7CiAgICAgICAgdHJhbnNmb3JtOiByb3RhdGUoMzYwZGVnKTsKICAgIH0KfQ=="}',
    'R2L_VIEW_OPTIONS': '{ "viewUsesTarget": true, "viewTitleSuffix": "", "viewTitlePrefix": "to", "linkClassName": "" }',
    'R2L_NAMED_PATTERNS': 'W10=',
    'R2L_TYPED_RULES': 'NobwRAxmBcAMA0kBuMBmBDANgZwKaNRgTHQBcZSAnAV30nOgxzvXQproHMAHGMMRNl7R+g0sNFhxfAWACWE2ZyKIAnjMQA7PpoD2mOZoDWsgEbYd+wycS6VYCQAoA/NADkIAMwBfRy+jAAHpuADohlGGaYUgAugA+/m4uALz+QW7xSc7J6TEAlAUFAFTOeR4+ebKUfAAWcgAmuAAEBsZmmBpSlq02YKYMYHo9sigB4AAefKjUmhCkcrqajnlNIE2UuKTUlJpNAIxNyUf7ANxN3k2ymPWT0JrUmJiInAz3j4i4MMBgRWAxiB0RLJ6vY2CIhtYzGDBlY2ogALZTGZzBZLFZrDZbHZNNxNAA8QnQu0o+lwAFoeskQmBYNSAHy4gDUTXQlE41HhuE0pGwwD2MSazLceIA9ITNHScWcLrIAPpoLB4bz/MCoOwBFWYYRvJ5gTAmO4PXU4GA6wSAvYAkEaxAQAymo0AuQO9560ZmyDVG2QRFwbzwcBQOC20ZMPAEUEMMN0OYK5iIVjsWjPJz+fymba4dDUNOuYBhaiwWDoWkhagAJlg5YAYk14rnoGFxuWAGz+dDw7gnPKlTTmLsFRl5Bv1YDoXC6GLATSUbAxZxxJC6afw+IAL22eQSrlINVwcV0qAbaQLRZLBcrNbr2+g/ibrfbne7vf73byQ93/n3cmwcTIBVKG9/AAA7ieo0nHah6zzNwAAMABaAESACTT3LUwAE40NMUxsNQNCIAADgI9ACNwssq1QAAWU9PEImiKM8AB2BiK1gPZiLLSs9iwrj2PItjPHLC9YE8ABWaDGxCZs21cDsB1KdBuF0bA32wUpjzzU9i1LNir0ku9pIfOSnx7PI+yEN8h0wdsb2AOCkNQij0N4wt0IEqtTHw5yiJIsi0Oo2j6NoliRI4sLXO4gTKyEkTxMk+9ZOgeTnzyJSVLfG8IFwfxSDiUhcDMns4kwMdcBidSCgbfMKJ0kT9KA1xEsfBTzNfQcAPbahsGwCAam6vBf38CBdHheFnDkUhSGcYBcAAS5iXBSmHVwT1q88+IahtmpM1qLIHd8VtvVxR3HSdp1nedF2XTRVziDdKC3XK9wPI9VvegJtI2vTawMpqjKSlKzP2qy8k/Vxv1/f8zMa6BQPAvNIMk+yEJQ7DXM8jz0O8tzfJ80ifKxwLGOCxjQr48KKci/i4uEvj4pvHbktMxTlNUgpKs0z71t0y9fthpmgZfSyOpsuS7IctHnMw7Csa8gjONxgncaJ1jRNJwtmNY7jFe46m9mi0S6cEiTGYBlrUvS9mntcbLcvywrloXUrxwq5bqq+3mq357bzd21KQY6yhZoWzhUS/TQe3UrmasLOrNp9j7BZZtqRcO9NM2zACClkIROmwaQgUQQvJAUTplGDMB1CLwY+AAYVG+FJoK5pDyaXdmgAJVwMPFmwJoABFcAgH9UTMCwRAbsbm9wVvUHbvcmm73vNH7oeR+wMfbBgPYi2IJxVq5jMNmzD2efqxPjqkmSLeB9r04+06JynGc5wXJcV3XTcbw716Y89i+15fY339nfNOH4ahfjiD+P8pBs6w3hhBXAUEJaoycm5GW0s5Y4yrHjJW/lnLE01hrUS5M2KU3IfrQ2sV6am0MiA5mrUrZqQ0h9Nacdvp8yAUnP2jCA732srZNIkt0GeQxu5PCCs/KEwCmrOiciyE6wimFahxsYp0P+gwoWaU2aZWGjlHcDsirOzKm7KqH1Y5ni9ltHhWiU6B0Oj2LqPU+oDVwENW2jcJpTRmvNRa7sLEAITtwq+yc9oCKOv4J+51X5XQ/rdL+j0f4vUPP/c+wS/rX2MnwsBB0IFQJgdDQCDZEGI2QcjER6NZaSJ8orXBytcGqyCgo7W7FdbsSobTOKGismAxTswjmrCr7sKsYAzJYT+HgLyGLZKqDHJVKwTU3GdTywQAaasppJMWlhXaTxFRXTaEJV4dogZNtoB20MQVYxJVTGVUiVpdJP0Qn0OydohxQ5g5+JXhHKOzg0kcOsZfF5fTwlTIzifag2cz4ArGQLY59iIkxzJIAdaBAAIBIARAJABIBIAZAJAAoBIAVAJADCBIAJCJAB4JOi2qexyp5BAJacs3h7ncxhRkuFdjQV5M6lEkOMQN6onUjeUw7i+qlWoAAH4qtgL82Bipch5H1XADQZicCWpoZajLLHxyeeM+F7LQYxwAHKaBiNC0ZLLgGvIRVMmauhKDzmjhYgADQALoAFWAC2gQAUMCAByGQADgSAAwiSSeIwgAHcgh0hiCUOkeRdD+CDSEbAIAED0pFGEBNSbvBjjJGuGIjJnBRrOWEAAdNndVQStWsotbqjqTiwj1FpfAMSDK0iFpFJk4AKKMU4oJSS8llLqX1vpVVBsgQ4hhFMHEAAJEdSswBYBknLFOOdGF8j+BHWOydBRYZrpCOOqd/geLADEmSZds7j0rtcNu3dhQzl+BOty3lfcFzpiFTUEV4qepSpldyXqe5FWaGVc4VVhQTWaq4dqtlkyOUGqNSBzh3tnmaMrZB0G1rbXOHtVfYAzr3Xev9YGkNYaI15ujbG1Nib4DJrI+mzN2bc35rNsWoqsHAUId6bfYWHKa0hDrZaRtR1gAtrbR2rFeKiVkopXHKl+QB0MuHMO0dO6N3+BnXOhdp7l1HUvRum9F6FNXv3RhQ9Z71PnugFpqd5jMNlrAxWkFyGOojjKjEy678bp3Qemc3+qS2EPOZeW81dncmg3BtASGsD4ElLAkglBwi0ELIwdgqR+MCFuSIerbZFNdmdPpmo0SPSJlmVOZzHzTLTX+dsUhoLoshEwTi9LcROElm4JWWslLlE5EkK1js5RFNVHdKORBwrujN36Ptlcp2NzXZ3OY7CgL7HU5QY+sfLMOZAmPJs3N0BHG9WPycy/Fz11P73W/s9fc3nhm+bKxtirgXtsdRC2FopOm4ZRbKTF2r8z6vVOljg1ZLX1kQE2cQjL5Csv7Jy/1s2g3WYZUGYykZoH4Pgcq3dw6Mz0BzKlhghriXanSJVrI5pIVWkUL1uDwSuWGbAvm6crKBjoB5XGwBSb5Vptrb89d0JOr7OOL+XJAarieruKyl45uviFpLUswjuDNiufQ4Wztq+0T9tv0Owk47STTt/xKxqmXQLEO3YV/dyBENoFQzgTDSLCMAhI0x6Ily32MG/bwfUtr5Y0vyOJ91qm5OYqU/y9zobsO8jFYu6VxHsvqdbaN2jmrARKlfcWT9pL+CZGEI6yDpRPvesHJNgNlHOjg907G47ZnLtWcBKs+tpHtn5vvLyJ80O4cIaR3Q3zsPuuWPI8N/X8FK2S050QF6MAU8m5TVnk0NuHcl49z5YPYeo9FjtE6AMEa09x+4ELRsFe2BC2NCgIgfofA19j5blv2ffc9/DxGF8CYSJZjzEWMsVYmJti7CoLQE43grg3D4NcMk6AKISAnwzwrwjoYAnwAQPwfwAInQ1ou8RYCYfAyClAmAuA4whaJ+M8m+++mBuAaBkwh+0IKBBBmBjc2BV+EAeBBBsgvoqoyIj+aIqw6wmwb+OIeI6A7ck0aBVIYAAAogAKqdxkgAAy6BOIgoTQwalASkjg8IDw8wIhRInAAAktgLoOWI4KyOyJyN+rOvkPADiI4G4IYW4GUCsEKNSE0PUGQOgGSBsKgGSNlAQbwZ4EyCyJoKoFoWyByLKryFRP8E0I4CyD4boTyMAExAKAUJIR4GsCIQPNAHXHwSISIQAIKdzQADx8F1zQAAAqAAmgAAp8GJHJF8EAAa5w3gIAcRCRSRKR6RmR2R0A+qAhAAsgAEJ8EZH1EVFVFWE2GkB2EOFkh6C8HuFEheHaG+F6GeCBHBHTFhG8gthREWE4gDG2H2G4COGqBZiUDjGSGTHeE6F+HAABGGELGhGnGRFNDRGWFgDWGbEjHZi7g2oUjoCCqYC8Gj7YGT7zzT7Lx8obFDFbGOEvE1A2q8E1BTTcDQAigijcDUCmAGBrKMG74oG6DcDoCFrIIigbDqHbDZQijgk2qTSqAigjSUDKQyEFRkimC6D1Dkl1wADyncVhNQDhUJMJ2AcJIoKBFI6BOJ2wmJ2JuJaBnAWAThiwBU3IIo7h8hmAihyhahGhzJlASh/6KpmhixpxsA+QMRIouR5RuR7hGw8IshQxbImw1YNq5ppAxxMx4RepeQhh9kIohajIcpgRbpGQaxbg7h1A3A3AuAlAjglpyqpANplAdpDpSx+hdxOIIozg2wcgyQvR5R0AbhhxnhsZpx5xQRIRJxehNxCZsRTQ8RpRDRGRWRORBRxRlZfR3g1RtRlZaR1ZzRrRnR3RDZlRTZ9IExVxehepMRoo6ADI0olwiA8ojAiouA/od+Ig0wD+4c6Ir+2IH+uAX+P+twHoLwLouokB3wvwmocBO8RYloJAfAQxyJIBfQ0I15aBtB9+KIT+6ILBWIuwbgPxG+fxC8zQ2+c+++i+uwegEhzIRxOpsx8xhZjpyxqxBpExOZkF4R+ZlxRZ4RJZfpbgE5cocYSoKoaoXwmo2o4B+o+5AIE8Ho2AFoVoXwYAFZ9RbZTRORnZXRPRZR5RsgDFyRTFNZeRRRJR6ZMBkA9ohoroolHomA7o4BEAXowAKoEAvosA85kA9gEAoYs5EYlcZAeFMYUYmlJAYIG5KYfAt6V8I02w00M2ZqN2deiKu2Z0KucSbmiSnmKSb0He1mNem2OSqO+SpuhSFuxSH0pSNu5Sdu8WmMTWf2+OjShOWyXumWPW5CfWhyUOBeRWQy1l5WcuBe9e6OEVieCW0VLuqyAOQO6WiVoOyVUUue6i+ehutOo2lypexU5eZipa1ekeBudlYK/O9Qk0Nqv4a+3ABU0qW42RqRg+YAecNcBcigxcC18gS1FcxA1ckg2gk8ugllv5qR1AA1pAQ18+D62gh+E8I+21lApAu1+1g1s4x1wFsg6oCB+8plh8JWFlV17e0uXete0eveDlz8F0qu8S7mJ2O47l/yV23ltl/1ESD2Zu4WluIVr2YV728edW2Ojunkzu/2buHunWiibSNVNMEOaVUevlhe1soe2VnOFNbyESBVsWn2WNSeTuKeruaeqWGeVVWelCvuRskO9N/Sw2ZyFyDORiE27VbOVeHOMNuVPe9lyUt1h1s4cQI1Y1m6k1nVct3VbGcNfVHewmXaYmvakm/adKTa7O0NetBWflnKd6fiJ1/Kz6P6b6Eqn6C4fh8qf6AGQGUul2Ee+u+tlNANHehqxq1tQdrGdtMeQ4qGdq31eY2GnqvqAaN4caoagQ4akaJGrgcaaaFG3gKa8a5G9KNGOaxGBaIQjGleP1s2sNodESXGPGDaVtmGgmsM7aaKIm3a4mfa0mltI2FixtomPaEm55FtRdQ6H05m06sAp6amS6pmc9z2c9BmRmJ6y9mmem2mw9t4XKTtwFLtrggqbtwAYqHtEM0qXt36Pt9QSqKqaqtN8twtVaD84dMGUdeuMdge9tCdbe1UKduG6dpGIQWdOdxGMa+dVGRdJdhd5ddhtGVdDGJaL9ttf9cdnUta9afG1Und1Uo9fdZtk9g909z23dnaY9/d5tZDg6cms9u9e6rgKm86i6Z6O966FmW6TDR0B6R6W9HDq6vDAd4eP93evVi2Sue2wNzlR2HmySZ2Hl6Dwdsd9eCNgVEWKN1uZU6NKMLNYi2N2MHNZV+NPNZMJOYOOeZNee6VjVotNN39v1PlDNUyTNH2WOhjbNONJjrWXN7WROFj3u/N1jFOQtPV0eTVts9OjOrVJiU2ddgd4jf1Tdhtw0l1VlTjDdCtkjiuXKjlsjrm8j4NDOkNOuXlGD8u6jJuoWiNT2CCqNujFSmNXjxVyeeOyW/j7u5jmsRNpOHSAtNCtjb9lsDjWVWTNlOTBtHK7jGNBjDu3jxjHTqeBO6egTvTljJNBsdVeWDVNOotxeLV1y0tiTYjzjjdrjUj2YB1Q16to0o17iWtdcU1hQVQ9cGTN1Nz9168j1h+gIkgAww82J++ZggLaylBN+YwYAtw9By5r5L+rB65HAW5VoML/+gB8wwBSgYBroh50BJ5Nc8Be8SBIgJBgpQLlB1B6BUIyB2wpBFLuBzh1LCIz5jBz+GIiLn5HBXBpAPB1IghwhYh4wYFUhMh3AchChcgGpqh6h2pg5TpBhRhJhOI5hMRwJwx2xTh+B6BrhiFUx8r/h0FyFvImFMRNR5ZdRPFjRfFdZglHFVR5r3FVZzFLR7RbFPZ/RDxgxGrjhYx1IeruZUFFxMFcZKxtxfp6roJZIuxrIBx4FSFBrZxRribpr9xjxIJzx1ArxlA7xnx3xHzbc1zd12Akbmb2bXJ4gvJiJyJcgqJfKQpJIWJQpeJ7il1RJJJlAZJFJNq1JZA5I9JjJIok17JnJ1I0J4gPJ8J/J9LwpTbYpPckpI03IsqcpkhCpSpmpsrap0rWpgbCrfphpxpppuA5p4r4Z1ptpZAe7vIzprpbg7pnpGQd7XpWFkhgZwZoZ57kZl79pxr8ZB7yZnbaZHFmZAbf7qFIb1x8FQojrlrzrNrAlHrTZsHrZ1rHZbr3Z6ZnrDIhxibw5Qoo5455wk5YA050YKlMLS5L5TBIAa57+yL3+qL5FYAe5YlB5dFx5sBhLZ57EJLUgHxj5RBV5Ant5dBVHbLb5dHOIDcO1hbKtR1QFm8iwTQoFYHibcxwbf7YbpZq78b+r6FhrmnKb0HOI2FxHuFM5zAyoBA6o8lAIJF4lBokllF4B1FO8tFUBTrvF6HXZ7FIhFRXFcH3ntZiHQlClElpFzobHAI0lroslRFtoSlKlQYxA6lulWlxAOlln4Y9A6XhlSYXAqYH0fBfBqRKjv9VTESAAUsySofqrkeVxI9M6DCyW0W0SobkbkSV2cgAOJ8FtF8F1cADKqRA3+qjXKTlzoMfBAA6p3IQz3SbePQPTSkPakQIUN0N3XAABIbdDd8FDdnKtcdfAB8EACTkdstNtqjmD9e7XxpfBE3LjlqHKWRT3FzL3oMIhzNnjCzbT7NyznNqz3N6zpCmz2eKVOzVOETlNAyJXfBrzggS181K+S1ZcNcq1agnQm1/BpXTQVXughg1135LcD1Snp1fQ51JXqR+PhP3ITQJPE+Pz5PT1PHr1IgaYXMZlo4R95PJ90AZ9wqF976kq19X6cqv6D9/6T9wGEzOVIzVWH9+TQNsSRT6uCjWu5273UzqTHKGj5uWjV8oVTThVrN/3PjgPpjXTBNmexNEPtVNj9Vdj+zwejjV30dTXuvoMsz+jv3mC5vSzyysVGy8VwOvNdvITkPjvuzzvkTBzzVEtTObVtypzne2TCv9tDY1P2vGfWDNXdXDXcvdNMPU3HUrX7XnX3XN4fXA3w3o3fB43Rfr9Jfn3HUs383I9i31DJD7EU9g663m3O3e3B3R3zJFfp3F3OfLf79Q493XXU/Idpfh0b3TflTeVES33Hj9u/vUV7TQfnTwPATCVQTSV9vpNYT5N0/ozsO8PhQsM/g2fq/N3lXUy+f9XC/ajES5fHXXXCP1f/Xg3fVCNzG4f9buESdvgtyobEMJ6vfOhgygH5bddum3EfjeGO65EJ+l3eupM1z53cVCD3UAS/1e6Pcn+FXdflMk35zM/eOOEqnjWt49MwewTMnKEz9zhNF+ItG/t1x1rXdSBitMFIfQWjO0n0p9F9O7Q/Ri9b6EvBVFLz9pqpRGafbAVf0V5DhoMmApJucx15L946wAG1InSAaupU6eGDOgRmzpEYo00DaAAXTLrF1YGiDLNJXXoyGRa6cgips/zIGcY/kODXjO3QEytou6RDU2jAKkyrdyGZlYRlw3nqL12GGmMIYpm4byZwhG9ARlEJXoiN963Pe9MfSEEC8RBwvK+qFhvpxBvakvR+oBmfokDPemg+HDrgjoEC3BKGbQWhgwxpBgGadfDOA0Iy51zBlg9NPAysEV06M+9ItGg3KGTdW+jiRwJ4Lbr8YCGnfKAQEJW4yYZ6V8deiwwXqqZkhnDWIWkN0wJDXA/DYzNvRiFXo7+nPRhrsOgCsMl6QjHYVsLXq8NEhBw64WZlSHNpfBkA3uvMNobBD6GEw7jLg1kxVCzm6fRQZn0BrOYQaLlDXG5SUZQ0PeowmfmDBqaPYgqz2Y3rbh+7b9qBe/ZrMH0Byh9KqJ/aqmf22bR9oebAphGM0BHyD5eIIrBj7wTxm9d+APffisziprNj+GzRgQM2YGC1L+5I6/tbEOaJ84mLODqrUN4FSMH+pXcUbkw6hv9C+7vZJs9wRHf9K+f/fwDX0AHACG+Mo5rm3zm7vCluNDUht8PgF7ch+yAw7qgLH4ndzuqgoEQoP5FKC8gc/YgYqPUE4CIkK/d0cCKdH20KBvvTEUY3liW8/Gh/bpqDy6yn9I+DvC/sM1pFw9OB16N5iIGp608ieDPcgj+WZ5bw+g/zWQICyzAQtD8hY4FtfkQCjBQA0LVliuQRYfl24DHbcn/nqAAEgCt5Vjh6Dxacc9Qp5aAC9T45ksMCs8bEgACs6epAMguvjPy4F8CzoITqSzpbksixY4onpONPyzxKWs4p8ouQYK1iOW9Y4UJwXmC8tcAvBAVqIXQKltNWTLcYLwXLAodGKaHHIvkVK5+dGy3gAeA+KtbtkWKGHN8b2W8BXjfWugONh4X06wUk2RnAzhESiJQSIJu8EzqEC9ZPFNWMbfYv62zLgS4yEkOCXGUIiwSCyf7ZdOGzVbISM2mrDtrm3wK8ECeGYxnrgCAkAEs2EJdCWAHHawl4S1bFEmQHrYYk521AFtgSUoDttmJpJUgOSUpK9taSA7Jkm0VyKyh7usoanp3FK4jttiFbDiSKG9YNsRSzbWcVpOHgigvx8HZoi+MaLJEVCVRIyS2UfE/jXWvnaABZKqLuFMAugYNCGUcCYBlS6hVIp4Bm6TQagUZGMn+2dIRswAOHcCnhwFAEdiSRHGUFOV0oUcax8LWjpywbGf5GOeoX/NFxY44t2OUBbsfmMQBEteOl5EQA+VvKmB7yInbcbC2o7st3ybBNwGmNon096J1hBfOTxU66ARWEFRNhBz/YllcJpxBCSRKFC6cwJ17Q9Mm2gn4Tbiw0vQsRNLJmd4ppHRKQRVs7EVmOZFHKSaByluc+xHnb4F5yfH2T3WQlRACdLsmsVuyFkwLqhzslmT/x902yS6yemOSRCKhYSnaCi6SVfppFWLrqHi5QFBxhadds6AUpJcAwqlSuGl2y50BCA2lfSvGFy7wyEwRlDgCZQ54NhCirIUgJoBDLYA6g4rEYcqJ5xDgZOswOQJgDOTbciQjQHAIaO76BC++7dLATSL9FYMZg1udmcX05n14AA0roExIhkeJfcD4kYEbhcgjufcBVDMl5nN9+ZESRoLqK94dQsSV1LkKyDkDQxKgSPfOCXALFo8Vq9gdarIBx64yrqBM2cMTMzHIhqZZPXMeYD4CWz8ZhM22ZTJHiYBHZS+beH2OJYOA3qB9ErK7OtlEyFAqsyoZ7Opm0z6Z+BUXphn8HLcvhiwyOWMKHDcy05CIoWSLJpJ8oJZUsyOKgNlnUys55MvICrNJkfcERGsmUtrOhhlznR6Q3nnyiyGC9X0uQsQfkPF4/opBJQ/2lwLhFkym51Qr+j6MdGf8rUDQ3QY6n0EgM2hEDUwXnQsE2DrBpdajEg3sGDCa6ww8eRzMnnuDfhrdPBnmBmGJyu+0AhYUPQYbLD7hqwyISZk2HHCeG5w/YYI2iE3DjhaQ/gTykyECochl9LuY8wkG9zfaMvZwV1VcESi8mFiGoVXI0Hpyew08wBrPJwytCjB7QkwZ0LAYIM15uC/oSg0cG7yFZa/aBdWg8F/CvB0wt4bMI+HJyTRiwm+UcKUz3z1hj85hXELOFbCHh78lIeEIgW60oFsopXnegKaq81cYNTXBDRhHlNIFPA4Rf5VqaaNkaRvRpuiK36RUJE2ImKgfzZEg8ORDA6MUwKj5xineufTKlSJcHyK9RsecWBiM0WNZtFpVMMXoqP5h9CRfNYxbGJYF8jY6UTc5DE0lpl4U+Ai7gRUMQX+Ax8jc+2o0HhDRKsGTiD6KHPdkRz4FnoqZNHJpk3g6ZmgBmQnLSBJzjRsA00YPKVHVzy5mctJbSMFnCyP2Ys1eAXLGjSzi5q8OWfEvryVy95fMg+aDFrlazO2us6asPmSU2yFAdsqmd7JzG+y8xK+PgLXLDnEyyC9szAMWL6ADB5lKS7gEsomWrLKxC5OqRJzrFsENyKLLKWixbEYs5AWLUAsxy7HCUipYAEqZl1paoFBS3AKgjOPtDziICi4jAu8s3FfKwAYnXcSlManYhDxPLPlvwSEIXjxgjEm8XeLU7QSBpxnMaTiE/E2TvxLrG6f+M9bpsfWoxECRhL05TSNOhExNtpzCn4qo2aE0CX1ORUzSIJqbdYmRIJWUSvJebakCMvDncBxlXsxiR2w0lVskS3EtEjpP4mCS22uAYkqJM7biTu2VJG1H2zpIMlySArAQvqjUmoAhV8JbSXxNFICT9J++CafSogkoroJzK+9sZOC5nTbpn05yZIVcnuTQyXkzdroF8n+TdwQUq9iFPyBhSIpkHIctFPYKxSVpJHMjrOSSk7i4WNHKTicsynXAdy4BDseATuUEtJAJUi8tVJvI0typNUlltGvqmSc0pbgblR7O2oTKOpJ1bqb1ITbQSyVaFCCZSoQqYSpp5qplYhLDUWdyOG0hLnqAc7GgnOpFFzq6AOkXlrgdFK6dir/E9kXpWKvijio+lfTwu/08SquuNCAzbQclH5a8owLgzvpUMwMGpQ0oozEZmXZGTl1jBoz8uDOTGSx2R7I9DZi1ToOj0kCY8q42PPgIIT+KoBa2Os72WOLfxYBx4X6gQj+r/VYAmggGnYMBr9n9jA52Mj6MySq5xAau/gAQgjyyGpF4QPIZEmQB5ALhUiHRTAEMOez+BDwv6keFgHaURJoNmgLAGcjo3UaqlSsqZBRr/X4Ezk2G3DV5Kmgy1YRZShBQiMcxiKDsoNVyoo21yeU5F4ShEfryRrBVVFOjdRZQKDGLMQxLIoHq4ojEGKoxRImMefx8XxjOZFigTR6OqWM048gYhxbjk01W9wxNvcPv0z2Q8ihmZihMfH2iYl5jmISzqLIsEXWK1ZIixyQITiAYayNEMWdl+CJBxBuUXIfwATOKhjgAAJzEB/DypShoSoeeUpHnQAZgqIbYXls0AFaaNhtPiXFqWCuBEtsg3efAESXSaAtsm8uX4IvmfCGF18rniVjSBwKulisnpR1AAZNDk6c89BWA0XnYKYG68uBqvIIUOD/oTg0peZtY2HzVodcOIIAEIQOICIUW2+j+th0UoEnQa1hL4R5cw7SJpV5ibIRGvaRVJtK168kRdTFEQ02U3hV7FRVJkRbzs0uKQ+7I9xZyKMXciTFRm9zSZspFmbdtYAtxlZoZGtMPtgfHEbop+36K/thi/TV4sM28jjNfizzQEu81S1fNsMQ6uDonmQ77tpeG8KBGzDjBFNpgfwDAgVTXo7tKGLLYJvSWHzJhFQX2MWkO3UjulpOlDI4GACpFBugABBBAAicDnoAAhDRlSJkgAAWtvXq1EL28dWpXf5uO3Dz/6vsEUBFodH7z+dA2zrdAGVyFMJFEmzXsoxY17bFFyIw3iBDUWvaNF72rRcyIR2sikdbigkf9rR2A7vFmOkHdjtd7jNetpChRdMmh0tM/ucOjTW7q00e6dNKOvTZ4t90Y63NMfcxTjvFqxMfNCTQrUTvV3ZahN5cjuCosp3UBqdZyWna4Hp1yBGdVug3ftv3qq6KGViprc6LV1SRgAfyeIdwtYVsN2Fn87TC/N719jDMSQgfc8P4V5Awg84GOGfIKWtb6FxSxhV3Vb0nb29XMFYX2NnR7AF0cQWADNEOGD7OFV8EcUSH8BIA5AIZOINQFZCqBloN4VANygv2dtr9pgGgHfof2RKUtMQUMnmGwDZp1aNQfeugGADcBYgnbLJZEtANyBVA+QG8CONWzQBDAcQTQMACv1+qEDDwfwAYE2CxbYDmB9sORovoABvmIHlGoDsgC4+9PAA83hBV7QslAOIBsH3rLgIARgcg7oAYPX6WDZyPQMAXoNfgmDvBm8DzwWjAAIA2aE9tweEOFRZeHdGhefLmFL6ghK+pndWh736ZXAB+vkGeli276YgtaOIJ4B318LbhrwoTIvqKWqHr5X+rrfXsIEC77DxumRuIvE1QjJNWvBw3UONwFIDeKi+3S9r0Yw6o9Luz7bHvs3abHNHiiPujpJGmL09HmoPZYpk3r77a9IyPTvzCPw6dF7uvEb9q92o7k9LmoHf7sSOg6i8CfbPfjtz3PZ89R2wvWzuCx7hS9f4cvTTrp2/gGd8hkhUIpsXx0/NIevo0FvjpRICZ6h3nJoZYVwAZoewPQ3yAXRGGTD7EMw8cKLQ8759eYQpT3xsPkNV9qRzXQkqN1b69gO+vfToaP2T7bh6x57Gfsq3QBL91+2/ZQHv370n9fiF/VfqYPv7njrxs5PCB/1/6AgAB+IH1BANgGIDMcm8OaXQNwHGNSBlA2gYwP71EDMyXA3lFhOEG5IxB6gGQYoNUGLcN4WgwVEEMQxZDrBiQxwcOoyHmDchm8PwekNCHaT+9MQ1OEkOLRSTjB5kz0dPmKGF9yh6w6zMK286+tDeocABDCBd7QhXCrQxcLWH97Ljq9YfbKbfkbCOFJwkrFvpMwgBB06plaJLqN2UM6FgpuAWcjq03hoAZybsKgxb0HGct9td8A2CxLKp+UQZdvEMMU1DcFUBUOIENyIWiMiFhkSzKrrhTFp/AeiHhGGf+iWZC0JQRxIUBn1na1BEOxw4btcCABmEAHxmwpTm+u+XKYfmKmRGyp6Y6qYn2r07h5w7U7qeP0JmQgs+nXNsZZmmmbw5p/wJaZvDWn/TVgiY8oLW2bbttPZluvWk53eGyF+2wXcLpULi78gpzLnfVtV08619hx+vIdqXA0zAzo5sPYLrmMYQ7CNQP1cHuV3+AFzg5o3dVB629HAtlQwbTzpaGGCxtHQqBjgqsG9CN5dggYdXQW2DmDtUxvdLWkZDoAhkBcWLTOBiD1BChj0dvOWaPObn+jjKZ0+4gXBunldZyL05NH3B+n5t16e/q4AQuunuA7pneZ6e9MYX/THej04OY73nmx5l5tvf/WQVDaAgd50BpNvG1PnJtuC180XVm3byvzsFkY2ZEO3r1/zgFo6MBYuhgWIL9W6CwXtZ0WarUTMy+SnKHrfn/zRURlBRd5OWGBTOxoU0dDEjABywehlsKekiIaWd5p5j6HhaQsEWULN4NCz6cwtSRGM2cA7WRr7NbaqRjZq+dPRbNnJ2z4Zz8wUG7P8XKhaYOuNPpCA67u9Mp6Y5cLVM1mKzI+0s4Wan1hARQR85QR9Dq2Lm7TRe3LfUHGOhXEFHe9ejoZ3PxAFjhh7jMYdMNPztMSKKw7pebPHn/LVpoK4ynXqnH2I5xw/U8NXqNWdLTZkpX5YtPtWbT0p2+ecPitlmizv5vhmPseEfyrjX84s8wwCDL0dT7dcs+pb1lgBh8369jVRoA2XV6NHQP5qBvA3HWoNp12DV0AXG7rC0R1/9bKCY3nW1lLy0groBHGQsqxlHEFTRzBW7AWgXIF4JAj/YGGVgkhEG/+k/AQ25iUNyULACaAAAyFG00Bhtg2ppC6KG8yExtw3E2+EqG0cGSBNBYAOFJjiIGcJeSc26BH8DyDJDfXsWtyjjvct7HwbiCvyp6yOMLSCo1QGwFsIRFzU7qvrP1gtQcr3FA32CR47gqeP5YwqhWjE767wW+vQAauhRWUEiogk4TyV0E7TgtIwqITNbkhLEuBFlCNAMAChUlYyrjJLSXSZNwwp4D9Kyg2SrKqNimTwCUAkAvBZDYWkKLuFzb2xbMIqUcAbBuAXku2GHYjs5R32HkwO5bZDvgcbbI04coUFMIigRdcpUwqkTMLp2xdWdnEDnfttuBNbfpQtAHYtvB37S8dqu1NJ1uNrQ2qxA2ya0Qnl2Tb6AM25Xatt/sG1ga8InbcMIIAmgTtmIoWnYht3mQptxwDXe7uJsDDzdvkHMXDaD3DCVEMu+PerCdxUikbCjXgFIBkgELoEme4nbnsLoF7ewJe6WS1UaTJ2fJbYAKSHGzsDVIocUou2lIrt5SkrHdlu3VLeSNCU050gaSNImlJCZpC0toQvbRkfVUU+226Q9Jeln2vpGIgGSDIeSv23q39jA4A4plkgHtkMkgGgC+3/bkhY+/aSjuAEco5Du2LHdDKkO21ydvQqNLTuJlM7yrNwEXbzsF32HudnEKXdHsV2g7Vtuh3+3rt924Ky93Wx2rRVuAJ7TQKe8I/U4MP+7Tdh28PfXt7BZH8jruyfegnz3JHcZC+yo6Htr3R7G9re/2Vw66Pg1woUNRTbWnwyo1Et0FVJ3xvg3T7+paG2gVhtuPdHCNjG0jdRvo3XH2Njx3ja8dY2/2RN/x2TbseJrj8+BGm2SDpsFxsAjNsW7lJZsFS2b3Hf2aVM5uPWmb3y0GYU6BXJTAbUnCFceKhXnjFbbt3e5sAPvoBlUR97R5g90dn39HI0y+1Su9ZRtlb1IVWzV2Pbh2KHjgGh1oTrUQSOnDd04nNOYf3t1tXDuuGYRiLG3mQaEiZ1hNOKiOtOBEmZ8WVWLO33CWjwRzo4gm92iJRjx20c5IetPQ7uAEZ5HYefR2xnqD2h3c6Tvn3U7BQdO6w+zs8P72+dthxw5xCdwVnabXpyMTwde2fbVXWR1Q5jtvPNnIThe3M5+eJlFnbD5Z6+2ZB0OEX9zx54i4/bT2Pn/UpR7yCYfov72fzwuwC5FBAv/nxdvh0KFkcbO6HCj6CTs4pUqP9nht8NmXeOcd2SXpztp+c/JfAAB7qjkeyy/HuCvO7IrqaXo95cUvunK9poCY5lcaOBHCdsh889GfjPXVMrd1Z4AAd+rTC6VthwC4b49dwXLKpoByXUljtuSvJaduSyfvNtX7mAKUsu1lKf3FSUrP++WG3aBvTXB7YB8e1PZhkIH37KB6K7jK3smgcDx9t6XvZIOhQKD4l+g5/ahvsHQHaFwQ99vDOXn4z01XGWmdiPgAaL4uyKExemFsXyD25wq/xf4vxnHLs1eK8pfVuaX3D6twy9pdMvbXMj9wmy7udtvsJ4rylQvcwoCv278rnV9bYXuSuh70rnEGPa1ezvhX87iG+W/htXP1X6j2R3i71fUOkXhrlUr5Jzfmuorlr4u9a8HcWPIpVjkcrY/M4JSHH0M/6zGoakuPwnBN3RwEWJvHBybr7s5cxxTW4tWb6a4EDx3LADiub31wtIdQPx3lPrgpBD0h9qnidJbFT7llU7lvQrBW4hRwLkWZIRXr7Tridi6/vsztG2z9z1965lKkAJp4M7+6qV/tuq5W0EwB+NPDegOT24Dq0jG+CkwPn28Dp9om9Tf6l03b7JF1m9jc5uDSgHVMshvcB8fCXrz4l6W9OI7vCbBE0tWYWre1vpOg71T+s72Kbva7Y77ZxO55cVvp3MRUz3I6FdWeg2nTxaXu5Xf+k1PLzlt0i5c8oUO33zrt1w5BeAuQvJnkj3XAfcVv+Qz7scl2rffkcP3ZT792lOCcQ2AP0T5G2jYxslvJnBj9tQV8OcY2SbOIEQriBy/pe57UTpoAE8q+/ufH8EjTFl8CcY2Gv2NwB7V5icge4nIgdFm2KaDU3WQST8YPTdSc3jmbOUtNVxwzU8dPAcHgpzzdnGFo9gwt4p0t8BXAqv3xag8bh9ltniFbl4t2yMQRXUhrVjRFT1hz7LHfNW4k4MnSvy8jTCvT3xCYxNnFkg7v+HrWwY65e6OJI0jt7wYGjZ7EHvWzxhysXPvNqIXKEnYiD+JVNANnWnvQpWHFco/+XpE6lSMXhDSkagoE7H9yHBuPfGHy6c+3bZ6cw+yQNhVQKD8Vf4Tz7aLjH5C81Z+swA33kaZEXPuWryPbEmEryT1XuvcS+k87xkRU+2sl1Vktn+D47dQ/Eykv8InsA59uf5flqkUN9ZcluSPJZ7nyX5ICkYOFP9xANRDeseEcEv9jpL/sqw/OO0v7XjLx47q9BObfibFH4B9JvZf0bwRFgup7y9g/5fz3xhwEX5fp2jPX5FZ4cGOAh+mgcQOIAWSaDe/FXfv338V7D+k23A5X1rx77WQFxciugfVByEFShkkf8viH0r4peUrEbTQS8J4Ej/R+M/6ALPzn7z8eTC/pf6X0n9K+V/Wvg3uv6QGz+5/6DTfon8r47f2favpN8sLvHLC3Ep/KwPILE+ym7k8pHwSDzN+g+5OqIC30WziQMCFpywa3+Dxt7nGlPC1hy/cU1L28niDvhHuFTd8cL9PWf3n/V0i+b98gE/FLgP/M5rdLPB3azmL2G2k+T2hXCG0V8h7MSHJ9yJRwk+8afW33Pt3/MAIJVaVeH0R9B/XkBR8F7NH0KBGfCn3x9dwPHxx9kXCGxJ8S/PkDJ9MA8AMp90Aan3h9n/DiA7cGfaHzICWfOXwpdFfZVz5AufB4gddtVCj00l+fWjz0kDACaV89NPZAJf8O3WAMM8v/A9iYC+QYv1YC9gGX1TdW1IAOH9EJVXxHF1fZ1U8k/7D1V19s3X1SvtwpAcifcYpeLzscI1Kzl7VvQLUG2kh1cShHVdQMdSOl6KILgu8quWdUukXAkXzcCxfO6RXVtpddRi5mOYGW+BQZfdUhkiAZLmPU8uM9QTAL1PSjy5EwW9WTB71UynQ19UOIGZJWiaalmpJAFHhrgn1ZanLhTZT9REANVGfHZBeNJ2XOoyg5eAeB6lVnlyd2eMAFOEw8DVQyCsg4nX11UzQ6Ba0hrHyx+FPkAAAuYgTgBwMT2WVBv1KgxYAUxi0flGAISQSgEKslUH5GD0RTUPTgsb0IYJGCxgsIkmD6lGYJDx34EMhtQlg/9BWCdtEnW6CsraADaDMggQguCugnw3jMVBb8wYtbzEbXvNWLR8zMFnzHoRm1N5D8xtNU+Jc3tMElChWPkARFMTAAagnuDqDGCZfHyC+AGYHPwKg+oJLEkQzQBRC4Q3MT2VqxY/z3E41RsUpsspVsUxZ2xRfwgJl/HsRycObVDwwJkQ7fC39D/KqTpDC0BkJ7gmQzDwBtUvXbxlsL/eWyv94VbVlvEzvTFWdYNVaABUkeuJDkAkb/QlSgCyXBe1gCMfTgN4JhfG4P1RJQvgmlCnJJsg0DNfbQJNd9A/1SMCIJfDhDVTAkD3MClQZL3xCUpQkIykmxHKXA98pI8mydZvXJyzVhOHNW+UKpLkO29mCCp1N9rQucksC7OftRsDtpewPNB3OLKUnVPAjUK1Ceub6Qi411baU3VPQOilCDJWA9QiDoZFLhDBog2MKy5jKVGWjB0ZArixlcgx9SWoCg19SUBigmuBx4xqa6hoBBOSnivJ3EVsIeBbyZ6gDkD4W8CCBJTGfTCA4gHNCGVOwguHWAewhEIBZJwqgHLB3rI/HKkuwygEXDfrC325DVyNKXjUnQhf0ydvgIbiq4yQLIgAA1WQCPCyQIblyJkwqD2Kk2ePjhbDhbJ8PFtLfcpxLUCQLEmJBSQCkGsBeCPYHpAAAYj3BHgHqVNCDHY3zFAvwuKXDV1pGzj7VrA3aVsDjQaMJmoaKOMO9AfpfwPTCgguSnCC/QfMKiDr1GIJIA4g20DIib1UsJ4B84GsNR4X1E2UrgzZLQC/VxgAqBg1JlTqSqCWItiLOsfZCnnVBKwRAgQ1mgw+B/lBBf+XPpAFBOWAVChO+mKFpeTLSqhZQWUCG4RCZknklN7ErllAnbXK0a00jLBheDirBERvM9BNBU+CV5TBUgYfgjixfN/g980IUsLJjCMjy5Icz2BvBTYwCBvLZSxCF5rZTHlMrhZayVNfIvYUWteFeqwsxEefa24iQyXiKmUKeZElmVSWViJiisAVZWXCICZKPYjdlW/DxCnHWNR3CiQ0Dz68LlNsUm9OxKkIeVrQQSOeUHrelkyizrAFWZD8nOqJ4jUoz5UP8tvItUDCPwvkOqdDva/0x9rxYULvF1QvinekrvD8VGifOc6XtZrvQaOAk6VMl1ID4AuH3v9H3bW2scBVWVV4JgADVQFl9UZkhm59UQww4DR2Hn0rZdVWwnFVn7I1UMkpo58VfFxfJsmskLWB6WnUHJXUO8B9Ql1UNDPVQKT0CsHUiUN8opOLxgju1SNVtC8o9lgdDNyBNXn9k1CkOm9qQj0MEivQvNR9CUPdGPbDOok/yls3AOKJrVwIvMmscTVRNn+903MwLgjVQTaXs5Iw3aVQjHAjCOOkEwhdRnULpZwLejWYj6M+k51EyQejGidmKnUxox6N8DbQVMONAAgt0FwiswrmzCDEuPMKPVYZE9Ry4SIrLnLCywgykSCqIh9QNlaw42VSDnDNMGyJPpI6EtMnELPlC1wtG8FSJciOIA6JTuHrniA64YAHyI5deIAHhTuAWXiA+CU7hEIhueIGrBgAFQk7h4gbbmABO4AQniAVCU7lyJ4gEQmABciAQlPD4gOSTiB9UEQjiBCiYABEJY4uIE7hmSX01O4VCL2LC0BZM5BUIhuLbRUI04guJ25N0conKI4gJIjiBBCU2OHAaoYNBiB60JiHbpLTSa3VM/Igs36s5rWK3WsUrYeKn01rfjE2tqzFaz3o2zduNl05dJBiXQi0LuLpRG0FwDxBJdUjU6C+dK4KOhJhQdCLRDIVumPia6U+JAAqIBlHSsJzeXRnNMrKFFkslta3XnMO9NYOGNrzI3RJloAccX5RSAdYxv1jAAqEAgCSX8HuAmlb42oA+oAuHbBBUVVAODnsDWXbBOAMVj3A28A4MU0PiXkHQBUtUgDXBJcLcA1l0AB4P3ing0Y2cNgAC82TNLg8hKQUdBFBUwxmLBeW+Dl5boWm0ptWwWQY5tZy2IUaEx4LHMBjIS3uERLICwxNQLcCxDJpLERnWM940UwPikzPXTITBEqix3BzBQcxL1FNMvQr0BUTo0KFa9YUy8j2tEIWcjnRYPWEtuMACzESQLW1EkTILPUyKgcLT+ntEP4q80QUTI1BQMEWLCyLYtrIiyM4s7I7hN4s+EpRPkS6En81HjhwURLEtxE2xKksoLGRJrpFE1xLossGZJJBD8rLXRKx6jDRJaMtEtox0T0wPRO6MKGIxOX0OtUxP/pOrERMsTRLfwHEsJE+JIcTg9TSyGM3E4yKdNyNInn/jAEmYCMAQErcDATUDDkE5AoEmBPtI5IeBIXBSNWGGQS5IVBKUh0E/lA9MzkbBJ/18EwhI1Mw8brRot+E5RLD0PEphI+DvEzOlYSuhVeS4suEreQ6tgQvKyaMBtUqxqT6gKxJiSbEySykSEk/hVkTn4lM3CS5E9YIEtFEnJMqSsGTRLORtEjo2r0ujAxNKSmrYa0YVvzapISFok+pNiT3k+xMSt1LRTS5gf4v+IXAAEpJKAT+kyXDiAhkiBNGS4gDMHGS4ErkGmSd5JBNZAUEtBKWhlkoi1WTzAdZIISH9YhNISwklRMUSdklxIyT7k/bTeDTIrxJYSsFdi38TbIzhIzQAQhyN4SnItpNSSVzR5ORTak6xIks7E6RK+Skk/5M/j3Eg1PaTTtLmGBSVU/SOqZyde3Sp1IU5A2hStk/k2NNmrEpV5SAU68yRTuFFFNcAGkuJI+TmkwrUMiLU5cwiRDk5oWOTJUqyLYSLkwJOuSgQlnRfixTQS18jvU6AF9T0U3VOuN9Un5NoT+U41NVTQ0s1PUSQUq1NaNbUyvWKSYU3oOdT4UipODTQQtVJTTNU15O1SmkzFJaSiLb806TXAPFPyhek4BJJSyUkZLf1oEmoFgTJk2lMQTZkxlPmTmUjBJWSbwNZNwTyDLlOvQatBsMYjkCLCOYjUxWdizBdgTP2aAvJYNCaAGgWVDkBf1EMhA1d0xtn3Su/PABaB0AE9LPTuQC9K+MGgqiH7Cg5Y8GNiVCNuPNjiuS2PVFXAG2LtiHYp2Jdi3YuIA9i+CEuJ9jkif2LiBA44ONDjw4yOLiBo4vglzj44xOOTi4gVOPTjM47ONzj84wuMG4S4gQjLibwCuKria4puO2564xuObjW4heMF0Q0dePgAe4tuP7iazQeLYVUrW4SnieFBKzniIooTLzAZ47axeFXAPuKF15dFeOPQ14gdE3jnAbeN3ic0gRK3N/oM+JviL47TMWET4/TOvjIrDKzky3YlunFNDzPZL5SDks82sz3Uo1J1xswGIFyVChOBBvBlwbYEkgGSDyQ0z9kuC0MBBzRoFbx96QLJLSIkJdkQMv3cLKmRg0AKSb12rN1MNTjI3XRSTLUwtOyTi0+tMyTQUvJPBSCku1Jr1HUrYzhT+g2TERTVEq+FxTuk/FP7TiU0BO2pwE4dLGSx0iZOSgpkqdKdMZ05KAWTuAJZLpTuddlJwS8E1dKITWQEhK7TKE6hNCSHM4yLFTPE+eQwVfE6NLlTLk+VPsieE0jVuS9IkNKtR1Ur1ObTUUt5J1TPkrNMLR0ku5PksOUC7J2yG0jLLDxzU2i3SypkMFIp0CsitKhT9E4rM8jSs7yJ+EYs67M9T9MVNPTSTsgNN11qLIVMuzlteoQYTGLLDAjSlss5N+COE/BQVTNs+lO2yNdO7L2zhEjVOeS6kn1LRSwcxK2+SGjOSxhy0zcnMTSFEotPzTnssnTLT2jD7PtSvswxN+zjE/7OyyRUgYybSCcrVMaT/U9tPMtudSbKqyuk79FqzCUvpIGTSUxrOGTIEylNHTx09rMnSZkrrKBMmnOdNZTBsxdI5Tl0jZNkE1UAYyhC+CPdKJB70o9KfTT04LPmBL06oAutEQ0lm3SPrZ3MBVcQz9y6jT/cFSSJcQUr1j8n/RRxWA5/JNVdAXQpfyyc7wx5RgBP0oSOII+oSgELR+oeoF0BkPFkOdyOSJPP2pU8/0K9y8Y8/yhVduAeFI9ufdiV5Jk81PJxIE8sgk3wiePkn/RAIkAAABScsHLBh4AwBbzywAIE7zf00okckduDIiJi9CcmJxBHPXZxiJO8mIFlDgY4wItCwYxLwhjNwgMO9zPyQQj9zjgAPM08g8poBDywPRGIqjexWPLRiRbclhdz08k/KHEXcnGOw8eoyFXw8anI73miknH6RacFXP9g6dmpOuE+kTPIfPCIl7IUDHylogAt/zeQEfLcBACvW02i5Qiym5AXjV/K3dFHBe26dloqNk+p97EaEaB4C2u0+ciA5AvoCVo2NkQDzPERyk87XJn0cJD0+UPh9/POCiQLXvOp1QBUAPewPtQJCBPz98AxNkIC5A2L3ts5Ay+3Pt/vXgpi97PfAsZtGC5gu4AknXJVYLG/AvxECEJc+wXR5pIgL2B3/SHz2cYvKtxVCzo9iVvtXXR+z4D52CUi9cl2Rjwmktff+30CgHI9j49I3OT2E8uPRViTcEHCTxfYG3ZkHGd7C6B0cKdOJT2SB28uQEc8aCwy0CJP87/L9IICsVwc8QCpNmiLLHDaLiL1oxuxiJAI5SCJ53CNgoH8ffXkC4KYvHgvPt+ClQsELOfYrwN8Yi2LxMD58s30Xzcot8J5CmpNfOT9cvQPPrV9SXfOdD98yPJX97w6AFjzYPMqUgAUyUUjPzoQCACGKq8zbxS8dvM/16j8POuCGLS83n3hIxigZWujm2RA07ZsAF+3ptN8EcWwBUAZwBRtLlRYGZIs2NfFPEDAAuFwAUbWSnQsNgPghfztXbAqd9Qi39J/z4iuMn/zR8mIoD9gCj4us9Eiitz/8WVGfPglIIy0NWkQwxxzqLpi8FXTj180m03ym/bfPaL9wqbzop0490NX9Y8+bwGLqASaCEAZCIwC5Bz8PqB5BuAGQnQBegc/PxLySokpJKNgMksJLWAXoGvyrfXkLvzeCRoBYImSikpZLGJejX3sAirAtntoJD/LeKIimIq+LwCn4usdIi8d0BLx80QpGJhS6gtJcxS14q/yVCd4qSLTiaUvlLiYxUrJi5SmIuBKkJJ/JgKqASgLWimgYIoudFHAH2gKMmKUkwK1St/MVDcC+gqfyEAm0sR9jSuANQK6/ckEYDG3BAsgK6Cx0upV6nfe24AZC/vzkLsiiVw7d8ilQsKK5A4opUKRCsgs2Joyg+ykL6gOMvYLqAvUkUKNC232UK5A/WxUKtCtNlVDuA2+1pLmS4ksxDGS6EmZKqSwtE0BMAEUEMA1wK/VyVU8x0gmgCy3vPTiDSvQl+Lvi/4uHyTS6cvCIzS6LyN9QY4MMSlIYmEu6iDxLogRLmirfNaLg8nr3hiw8zou+AuiLEp6LY89fwGLEDakiGIVlRAwLhC0VAE4BdAJAF5tKpaEGvKbUW8sLR7yicSfKXyt8tzzcYnD1mLeCFQgEIuiEQjkcRVWtje8X8t0rDKpnTUvCKjS1otQr23dCoVK/i3Ur0IFyp0pmArSkUrOdPi8VzwLsysgLQKXSr71DLnihlQjKDA70tWjh3Ygv9KUCk7yDKqCm0uCLZAitzIrzS3p1zLYy+H0yKEyqaVyKIbFMr4KyyuewzK5ArMv4qcy8QoadJCrkALLhK2Qo4LdHEspUKlCoQvLK9KueyrK5Amsrtc6y86O4Bb7T8qupUowVG7YfXJj17yuiccoC9MKgEuwqgSqAtBKII5cspj33JfLzyKnTe23KkSgv23zWvL8mWcmikKvod9y1aV680S8qKgJN7M8ujzeiosDEg+OJdjwBqZb1wLhJoLNlRACZJcNGKS5Ewr7hjxAqsWAiqoCpvyOSvD14IsquWUG9yq/KsYIiquCoMAiKuN209kK7UslK5y3kH1LZS1ypnKRq+cqgKLSitUIqEK2irFd6KgMpO9nSjAuorcXdUvbd5qtitQkmKyQj9LOXUgoUqKKjipDLVq90vDLPSyMoEqlKmMsLKsisSuTLpK3xwer4JWSuELSi8irsJBK/MpurRKiG20q5A3SpgCnqgxyMrNCt6vNKzK3Qt5Jg0aGrIJWlHKqyqKqtqvwJHyygAMkTqUmL2qW1ZkHxddnUwnLtTCQdyTzSAeEEXK57cEqqKoStcq3CNypqUKIQHf3JLcUSg8tDzdQcPMpCoCOmpSrrQWPJbA+ODYp/AKS/ai5AqNTAmwBEQb5X5rCSoWqplsSCADFqaq9kpmLOS6kElrBa4LKo0Oq1MhmrRSpCtMIJSsasGrZynCpcr3KkgoNrgAPCsmqCKuAu1riKvUtIqvS8gqlJLKKiq6r6HDauVKtqwgt9KWKvaoWrrxI6qJUuKtasbsPa96rEKmC5Su+rNKiCXEq57SSpi80ymLxerlA9H1ELPq1SujriyjtwBqVCtQpUKQaiGxMrwanQudd4SVWpoB1anWVFr4QJ6zZBC0Uaj5IfpDGrBKgY8ovJqVyvytqLqalfJxAOiG1yirGavcp3zmavfIPCwAfuq5qY8osCYg+OT1wxZd8X8trZ3yv/AXYI7HkB/LuoeYGygFa98Lqr9vakEAAkEEAAOEEABBEEAAJECaBT6wACkQQABYQQAFYQQAEYQe+sABeECvrr6wACYQe+sAAhEE1q3a9/N6qdS3iqNqK3ScplKBq6aXNrLap2stKba4OtOq5q86oYqYGpap8z/6j0tYC+KxiR9LmKxlJIL/aigsDr0Gs6swbHaxSsjrrq9SvjKY6223uqKyxOqBqRpFOrnt5Kneyuq8yzOqoaiy+Qr+qYvXOrkD86yssYbGHYusWLKPeEnnq5gReq3rl63m04ARQHrk2BUiOYAbh7Kluu8qyiiBoqK58zuvN9u65fLxjqwbUsHqWisVyhscvNwAFkBZZkmCqh69t1iqSOeKoRjx6oxqnq0q2AEIg+OX9S7LBSIwEllhbbxtII/GuwFfCe6/PNArqQQJsfyna1UvgbEKst0Ab+q42sNrzasBucrQCkBqVLw6xautrrSp4p1qSKsOoOqCVSiuWriG9aqQaCG4H29rcG0Kr9rNqwhrwBOK/JrtrcKh2ouryGiQqzqRAuOt0cE63d3oaIbZht0dWGhgooaOG6Qq4bbq36pzrhGxP0GbDKuZopdRG06MddzK2+2hrg0R8sMBSCX9RFA9mwnmJLuoEUGCaTmyWQmldqjaKkCdq32qub3Cpz3Ahca1Rw1cQS9up8qrQ1cv8rgKktSMbbG0xpIrzG9G0sbtuGxpMbdy+xoxt6vUGz/cIJGryRtUS5xvRKkq5dW6LUq2PIwgvGnZt8aISAJqxaMCIwBxbQmgxpArla1UDxa/622u6rkfRJvNqhqiBrSaYisAvSaLaiapQbcm8psKbKmhpudqrqV2spb3arls9rYfGppua8G1iqFanCIhv5anm0ho6aQSQSu6bEy3pvgl+mueyTqhmpZrYCwathvGaVKyZptKRKmhpTtZmhZv/dNW+QPNaVm+11LrxGkUE2btmnxowI9mg5rkAjmrYoJbdAEUCQBqAFSFda5ASgDP0mPWprrt9qi5tubx3HFweappOn1UdQA+5qdVpm4zindtWwwK0aO63yr0bPc75vrFoqnuw8dJdFP19z0/XNrCqC2nEEaKo/HcuRKGVKGzLa3AE0ln9R6jovHrCpQ/PYgaoiAjJAl67KAmKmo5Ai7aZGntoCLd6+ovBUC8/D3JBu25oBvKsAMRosqoa3AFMAJSAqCry1iwX2bq8AVkD6gDJIYmplBA/j3FYE2n6sQLKm2BzcBkEEwjcBBUS9skNL2zeHE97IVAEoBL2p9svauQO9swA03WXxoqCmnqr1qtSoBrzbUmzJuNKoGzyrebKi3RpqKs2gkIKjHQymwSrU1A/JydP0vYGPy/Q30PzUj/KGNhLPyFpqpbwicUoA6km4BuA7zapltNLrHCN1kJn/ZVoMdVWx6tNbnq81swpRPZNzvYnPGQl6yagHEH2rpAujpGkGO+CXVaZKljs7VbCmjp4aTWgyrNamO4GstaVHZwofa3AMkC/avPElRmbSyuTpe9tOqX1075fOgNM4M2yNTDDwAEkxGcCoPgHNZnmfbllBciDrn84qiQwjxA5AOkGs7UiWztSJPpDzqqJRQVzsMJ3O2zrSJIKpztWA1gGzr4IlJLUqqICxVQGDI/8RYGUAVKczt41ICMABc63O8Lo87IurzpUIfOpsj866QALqy6guojWSIYu4uDi60uomS/KwAazgjCRAKvyogmgMSCaAWwJoCYgmgIWwBBkIiimY5GYidUwjxYp0D4AMIfYGRs0O/YEn8L7fYGa69gVrvkD9gTro4grgDMOCD8I5SkIilYosKRk8uK9XVitYu9WojENW8E7YyS1oH7KFwAaiBNh4MkJ1zLcLYNGDXANAl2DsQ6YKGE5g44MWD7gM4JbxLcMSL/lXaIXikjPaWSMkEwFRSKehGSxuFMRclepX5QT2bgFQBcAV9CVQnoBsBPxFgJLJNTctNmEmhW5QrTx60SVYOFSrsxXBPwZgOkwbBlUTkEMBsADsFwAJLEnuhzX41FPplESYBLuQnoTuG5R1CTAEqrV4BcD4I5I3AwAB9tHoSBWpNrKezdsjlGOLNAOIGUa2WAHNBgKegmTiBFG2noaVOQQczaJ0AUXvo0agTkCegeuAQhUIsiT6X1QDuBcFZIVCBvlyIbYlQkyChuBcH84HOurjt7IonIMcBAgdA1iBKLBIECA5AKdED6kAKdFzgS4aU23iaMAACOAAQ+AgY+gAHO5oQYIAArgAGuAAe4AAXgAE+SDUVAAB/5LQAA30VEAA8vFF7TMC2K3sSPNojORsiLbibjJqFuJ65/AAWUrihuMuMb7gAOuDdiOiO2KSIjudYz4JR+wBIf5/AGbh64W4iK33oqufwG25UiRXucA/0o7mrAhuQog16POrfuKItuRvqAze+uuEdiW+2XgNNEYLNHj7E+lPvT7s+/PsL6S+8vqr6/Vaakj7BzP3piBw+xAFfVQhX2GABKss+F+F5KbHoLSFLErAFYbYsfkb664ZvqSJnmNvo76u+nvpvAfY/vpiBB+jomH7UBcfqSSx+wlMn7XAaftn6tkhftcAl+lfrX7UBDfq36euHfsziDuCKxQHD+lAb76T+4fsBEZenHOuyY4ZzNczNgM5E8zbUDzMaAgTQczCzucsno6hgsxxLp17jTgZyz68SLO5CVejqDizdwBLI7ME035P5TGUCAfr7oB2Adb7tQxAd9NkBh/j76B+ofuAzEiHAfOy8B87JQGp+mfuyISBxfuX7UiVfv3o64age37N++gf36mBsLWsHUBtgYR5igEAYZynDbmEisYgGvvszkslyNhhUBywcwGEedKwdow8LfRmsBM5+WCjR9TehEzyzcTI2sz0La3Cj5DdIaPl60YzO10OB1wD0GoBlAZgG1tOAeX7jB1wE77TB/emSH0BqwZH7cB2wayE3RIgZcH5+twYoGvBnwdoG/BvfsYGH+ZgfMHj+p2LCGGwOrTFz5huvsaGH+ZoZb74B9oegBOh7vu6GLB3odSH+huwcGHHBwgecG5+s5FIHoAcgY8HKB/wG8G/B6Yd36GBg/qCGj+0IcKAigQY0tM3LICGUjVI9SL2BZQVIlgAkADCE8B1zEEbUjcicsFlBUAPYD8aoRwNIeQgBh+PAGhCSAYb6mhwwb2H2+joaQHjhtAYwGsBl4cGH7BoYacHiBsYbIH3BzwfX63hugdmGvhq2MWHfhuoZmyEhsxJ4GoIPgfcycTIQfI0RB+nNl7QYcQfkGeciuWlk7DZAzkH4hnHvtolB6LIkHKcw6DUHgDM00SzEU2vrxGDBloaMHiRg4dJGj+lIcpHXAKLwGHbRhwYIHoAEYduGbwe4ceHmRqgdZGZhz4cCHOR+odYHlhv4YiHJRqnLWgYhuId5GVRtJOTSps3ZIjHQB67PmyjksyJOTjBKNPOTVs2NMBD/TLHMaNJBxxG3Bz+q+HHiNMG8GyGOGHk1Eyokw7KJzjsttMrHD4qKyYVIkvjIVMJ4wTLyHix1Yz3pihqsykyp9Woa5gGh/Ee2HCRtodNHDhswb9HyRvoewG7R5wBpGrhx0ZuHXBxkYmGWRmgbZHvR+Ye+GWBpYdP7GUNYZUHxzQDM2Hhx+oZ2HWhhAZJGuhi0dOGrRmwbnGFxh0adGVxh4aZHnh60amHNxgIe3HfRxyX9H9xvIH+GgRw0zCAsRoMa4HmdRRKHGjR3YbHGTBo4dvGKR6wZtGLhuccXGXxhkbfG1xj0Y3GvRn8fqGFhqce5HQJlnqTTkk3gckThRntIvpRRntPFG/MmzICylRuMciGpB+UdCyWJtLODHDoNUfqkjxocG1GNBwKwgmFB0NN0HcR/QYJHjRokYQnJx/8enGzh2cbQmVJ2keuH6Ru4fGGnhyYc9GPhgiZC0dxrkYDHwh9YYeQwx0SdlG3LQ02mzuJyCYG1Ex8NOTHI0peXTGAkuVJ4sbkrQdzSDkoHKUwQc4nLrGZLKSB10eMysZbGAorsZP0B4kKIKHZrSeLyHex8ofMQd4xsZvR6gEcR4hhwdKYwhTAJAAqG6zMyAbBAR0yY1HX4gVNEULtCEWKYpFUphkVqc7QbD15NepitxosZpnmYsjRxVd1cjOPXyNkdQoyT1YjFPXiNgdco0D1qaKzNYmeJwRDsUndRkWyMY9bqciN49aI291ijbLASMyRMaYjNcdI5hqMK8PPSyyZRvMYgRrU1wAhSWcorIrHbJsSb2yABxidmzTU5wxN03DK7RKYvMS3VKmk0pqae0Wpt7DamqBYMVxpcRCqk9wYjZzXWmRpzacwZTNe6b5H0jCPXamsRLqecVyqfEVBnVpwaZKM/dNPShn5cfxSz0glZPlqNCdQ6eVH4x5o1OmXsctN0TPskpIsnjp4xCz4Th5CZQGotCGBi1ktdLT3BI4SyzDw64WVBkJ5ZMmbYn8xuXQFmGNKqWMB96DoiJAAAR1oBBzbKFgKsAenCOnNRocD4k5oLkES0zkPiWi0FeirQS1HYWLWXSuZ8BTsh2DGIHIIeoArRvANZAwBmhXYJYkU0LKQDGGgiTOQ2plmDK9nEEKxiUbsnjxjvEom3MgQdonvMhifqnvJ5iaCyOJs5GlHhZqabyA+J5Xs+mD4oSd1HNB+mfVmAjBOYDnLM0iduybp7gaenXDS7WqnoRW7QEnERPwwU1URB3WCNMjJGfCNFp77V6nPddGaKNMZiGbKNcZjKjB1YZyMfyoEZgGfU0gZxHTbmE9fqb6YrGUoxxmA8PGcz1AlJPniZ9puo1JnJpvOcRFKZ86ZpnWcumYqzDtHoZZmH+NmdCwOZs2Z5mq5rmH5nlZoWY3mi50GC3AxZ2+byBJZowGlm5ZhWarmlZqgBVnBzTWe1mqeyLUbZ9Z2LT8R4tKrWNmf9M2cUiLZjg2tnyeM5Htm5AR2fKhnZsWm2o3Z22A9mCgL2ZpJPaa9HIwahq+coTSe7OfKmXDUTSqn1eN6bKZI5zTLgtvpu3TOn65/6bU0A+BaZRmzGSMWnmtmVKix1oZ/ufoX/MgSwyNEZwGd8ZUZgow7mBp8GcGZ/cPZjj5KjLzV2nglYmYbBHs3OYfnjcbefezd5y6a8mGFwFMKAIk7ZLkBOwF7vPT/0QoXGB70AXrAhCSGoCf1L6DkiVRpUBIFZNSoL5Dp0QyAqCZ6b9OLQwS+2eoBGwn2hnuDQbUIwG9mjerkHVoO7Xg0RSKFkqfO1wRORhoWap96f9ntFw6CYWc5l7CCM2FmzRoFgZtGcJpweAzWGme5+eb7nkjLJdlGxFkeY4Wx5vIxBmylrkSxnU9BRdj5YeRebx01F1eZJm6lhmdeybU5nP0WHUq6bIWypwY0WHLRvglZmQF9mYV7OZ3uUvnU5uhOvnxZu+eunZRp+a2XX5okHfmzkGWc0B5Z1Wa0XZRn+cFnzl++dlGAFzQB1mbwPWaWWwFiXHuNqtE2dS0YF/2jgWrZ6eBtmseu2dZAHZ0xHQWRcagCwXzkHBbyA8Fn2e7kyhbZKrmKJwUaonQ5rzOEHfM4RaYmBLeOduWGZ6QYVHcVnZYZnk55vHWWVE9OdGsRJxFP2NC53ZYoXiV8haN1npsufSWK5rw3JXGph7WUVsUlhYKXTeWHXmnmlnqdaXbeORdc0uljPVqWB58meqwZp1TSKWnFWgQc16BWRZnnsZyVaSNBRKo0JmV5jqkGWZVkWZOmmcwpNPpK0uvU5W4LJ2CZnFJ5uJPnFls+eWWL5rOdZ6SsG+d/ntlqZaTS9ll+bfmP505a/nLVgSyuW/5qufuXHlr8FPn9015cWh3lqBdNne5WBbSBLZhBdtn/AZBdQWYgMFfSYIV+4wgBoV2FbazgFQhYQBiFoNcqEldM7uhILuydOu6vwNsXu7ikR7p2CJgt7oV6Puo4IWDTgp7tCwQshIAB6+eNuQAUReUHqKE+5BSIHkEgaHrGhYewYlblChTsGR7Ue/9HR6PoTHrWW1Z11egAiegnqQTfW4npdWk09JjGhKewrRp6FUbXsZ7QLZnrpWGZtntyUOe/pK56EgHnr8Q+egXv5RheiXjF6JexwCl7BzeXsV7+J8tcQU1e/cE16L1+np16q5vXoN70AGJZN6zei3rq5rejIM7g7e+rkd7ne13sG5ciS3s971UMpNUN00SrMZWypoZaZWS5qhbSXJFdlY+nN1r6e5X/DXlfyXWpgVdCNOp5ua4W6BHhfKW4jfhYD1BF6VaxWHp50QaX2F6PWFWlpieZWnO58VdnnNVio21WVF4URz0BljRfXmyNxjd0XqZopNpmYUw9YUSZl8xfDtxg19OsX0COxcYIHF4SScXchVxf/R3FxwE8XuUHta+M/F69YCXwFoJYKgQlp6DCXOQCJcoAolmQhiWFetZHqBeDYxB5GGNg+Kj7pdJBiv7k+1Psz7c+gvuL6y+yvur77kHIDkBAATuAVCJAFPDxgQAHHgcolMxgAUrfK3yMHwDSB8tlQinAitqrcqsit+cHQMCtruIQAKgZKYghL+hPuS3b+tLYf7Mt5/otXWk2LboTUsr1dpyqNyqZo3zdG7Q5WJtlRNyWWNtEUd0FV53U42cjbjZVXeN9pe7m55xRZ6XhNwc3E3FV5GeVWojVVd4XiRATdGmhN5TZ2nVNvaf1WNNijdfiRllhd02zV/TYtXltnydtNb17OZvlz9SBfGAWUhcGABX0KcGXTVUTgHUhwFGZaRWPt8ieZXS56hdo3PDejYuXhlpjdrnntNjbe05p7bc4Wrt5aZu2+Noafu3e5+xlO2q587a23bNCI1bnRVpzXVXOl1gS2n96AmeXnRRO5ANWRNuGdyydNsZb0295gzYPm7MvFco3EVyhbm21eLHYt1Udg+NW265/leJ3BV0nak3Wd0pbFWOdypaO3ulk5CEWzt4eYk2hVyRe4XdNW7YqWad6pbp2nt3nZFETmA6ZV26Er7apmxd37Yl3/t3HfIXkdhSbmWFlzElAWVl+VA3X/drdYbB3VwWYD7n5j1YOWpZ45c/mblrTYPiQ1tAn/nZ2LWYeWgF0LCjWYtQ2cgWktBNYy0fl5NfgX/lxBaBXUCFBdBW/CF2cwW81gtcwBvZotZvo/Zw1cTnkVlzNRWPMsOYxXRBquaJXptuhIJXOJxWcWAos4DYB24LSldatM5mlcosGVsfbzTZt1JcV2Ft2qcrmQNuTXx3mp7RiJ3ZprXeZ2W5qRb6mZF23f42oeB3Zd5xplI2B3X4xnZJ2z93beu39tgHQ6XDdxTe52xaJeZd2Cdd7e73N5z3Z3nxdgxcM3wkwPaPmrBkPZ/jo18Pe5moDlRM2Xb5+Pf2W/VlPYDW09tfbD1M93A7ImD48Nfz3nlx1ZjWIFu4HjWvlxNYr28wFNer2013C2BX69p2cb2MF3Nfdn6kz2bb38F32cKAiF2TGWgN0talZCMWHf3NlLrT1xZA5gCv2vToVEG2MKZD66l38/ZFsC/STulwELHI/HifMt/+pJcxHJTcMfT2/knEdPHYJy8f2GJxskbmXzh+ccuHnx5cawm3Rj8cSIvx/CbmHCJwyeInjJguexzslihKDmUVkOYH30VsUcxWxBribwO4LCfbjmojog7oTSVp/CrmF91wFbNXAN8H1GTxw0ekm4Jq8bNGbx3cdsPlJ+w/QnHDjSZdGtJ90ZeH3DvSc8ODJv8ZCHjJoCZQPbMsyZn1jD6I4EtnsWA7OH0hgDMyG8zMscCiR4qa2StQowodSEexyTKSmGxkKcmEy1wyBCnnDGCdyPLD8cfNGiju8ZQnqRifvqG6R0Yc0nVx7SfXHfBuo45HghgCfYHVh1o6tWDRqSZHGZJ+CevHEJrY+Qm7DmkafH9j9ScOPKj44+qPPx3Sf8H6jwQm8OFJ7kZaP6tQEYCN4RsEYhGoRmEbhGVIhEaRGURtEbymptkIHAnoJySa2Hzx0cfyPrDpCZnGqRx8b2PHJA4+dH/AV0ffGdJvCfOOfRy473Hrj0hYSP19oI772QjkUfDmIjkffiOn9pNNiObwUfbZP8D6feUG998uVSPoAdI+gBMjpFYknzDtY5NG5Jmw+2OPjhw++Olxio+pOqj1w9eH6T4E4uOfh5o/+GSpmqHMnElu6YCAbJro+vMHJ4bScmkcqVL8T2EyjHcn0c4JOVS597o4LGGwTsbORhjl/t8m/zasbTSApoXPrGljpsbGPZTIM6SnihgM4cTpj0odnigp6M8HHcTs8f7yCTqw82PZl9U5KPPj8k+GGnDo4+wmTj3CbOOjTxk5NP9xm45KnVjx47yO8zwo4LP3jos81OKTn46pPXAGk5wmajoE/ZHaz3cYhPgJvJcAGjD24+MWcTpU+bP1j1U+JOlJ0k9Umvj7s+1Pfj3U/+P9T2o5rPfxpk5InWTgU5m2OToUbRW6J3+IjnIjmOZCy4jqfc0AZ9lOZ9PKhaU9lP5TyU7MTFTnI/nOVTl4/knej+8dQnSj1SYwmyzv44rOATtw6HOtxrw8aOrjsIZaPzTsIEtOFTiacFTXguHPeCnTh8xdOVstybRyNsr05zGKc6Zb5yXko7NbTIzoKcqHczaa38jJj/hUTOJjuKduEkrWU0SmHErQ/6OgIdKcynnNkcRymMThsZnM24m7P8PZR6XZMP2TrmBZXMd7fcyWQDgI+rmAqZjfV3j9zbdf3il8ebZ2wZg3ft3jtk3fp2Pz+GflXrNJna0uWlvXfZ2+F2/YMv2BJ3YAO1Nt7Y+hNFmXc+28st7J+2Bec1cmXRTq1ZgPmZuA/tXQ9l5aQPpZXmZj2tljA99XDl/1bOXFZrZcIPjzuhJIP96Mg+jXi9qg9L2aD8vYVHKTP5abgAVouXTWWDzNezXPETg+wXuD3Bd4O4V4tYDNFLyyYFHOT/gdCOLznzOH3jLrBhFPkrlRKFPZB+88fOyV588QVXzvUYVPaV8S4ZnrTqS7aO5d2S/m2PDZXcau8dmucP2lNdS7MvNLpVZKXpFtpa/3Dt3/ce2WER/amvs5l/dP2LLkVasvdLmy9JE79pRYcu+lomfU2XLzTbtPEFMA70WIDiZcMWRFj1I70AL+ZeCuED8+dWXpzsKzdWorquZ9XE9rA5vATl+K+/nEr7PcbZc9iNeAWQr8g8yuPl6BdoO8rhg8Kua9kq7r2yr9g/BXIV/NequYV2q473drQQ6fjUgUKdmu7jpzOCPWr7k6H33dlRJ6uzr1+P6vq9fk75uk0pI6Fvcx7ObGul91C78Pxb8jY32nKLfaWvFtnHbcvGNta5+mj9v6fY2Opt/fJ2ZNynYO35FrneOu4cbm7D0Lrjjd1vdry/f2ufdb/f0vjd+y+2nndpy4F3gDoXcHn4aDy9GXTV7y7+3fL3q8B3YYGYFkiIbkq3IsQgfQ8kuwJqc+SXCJuc/xOnjwk/zOpx4o5XPgLjO9AudTvs71O6T6s+HP9zus5ZO5dlm8BTmrs87aueTzq5GuERXm9lvBT2OeFOxbki5FvxT9UZrupT+LIznqVhU/uO8TnM6TvWz14/bOST60d2P8BrU8wnyzlw7zv3hvc9guDz007DuOk9o7rNOjvy99ObV2w/6OYrQY7ouh4kY8YuOx5i5yHuxhKZmPOL/6HmPKFeAEWOr7nkabPE7ls42O2z1O8LP074s4nv1zqe/AuZ7047nuC7he6LuVh7K2XvHpq+EfuB75+8XO3j0e4fHVzks8pPXxv+6rOAHmC4aPF7wCf+GoTwSxvRYT3InBHIR6EdhHhwfB9RPURowHRHMT7E8zOE7qB4XO/ztU47OP7rs9LPs7tW1zv/778ZBOiJ8E98Ojz4W5PPqoYOY5uaJsI/oneTrq/rw67lu4PiBbxUcGuJTju+dFJbnu6kfxJvu+zOm+we5fvh7t++Yex7sk6/u2Hzc5zvtz2e+4fjT0c6XukLkIBQv1H3HJmvbTje/tPML8VMWycLtMZRz3Tgi6CTPJsB/b0/Tj6ADPSx+i8fkKxixP5yW0wXIxSoz++9CmshsJ9Puop3jJinx9ZJ++ytTC+8xSBxsw+/On7hh4KO9HoPffvDHhB+MekH5w9pOuHjw6sejJ+s9AfGzrM4sPfzop//PAr5c7KeM7tc5Mfezjh/Meanhk8LvrHrB9wenEtaHAnEl2h/yf6H1p6JPYHzp/gfunxB57PkH6p9QfLHkc/qfi7s29ZvTz/vc5vwj6u6j2k0mR5pzx9xu4Gvv5tu9n2TntOa7uqVjI7+vsVj1M0eWn2ScYelzwC/Hv7Rye7AutziC53PoL/SdBO4L5k4QuzTlHbWx7H5R6qS0LvMGcfA7q1YdOmLRHM8eXJ7x7wU+hT0/8esj2M78mwz0HMCnpM4KZjPop/M34y2x3IebG0npa0inMnvMw4ucn5wBSmddNKYymMILKYEvcp/KZEuaUBAF3hZMMIBAAJ0OQF8APoYqahePb2VcDmZLjHcWvrtHfaW27nj3YP2Nbja61vNdy26uvpNnS4xn5NjVeNuF5oy9he6Rc3Yu2uNvW71e5NvS9svHbikWUXnt6o36XnLq+FcvS7yoS+uvLhg0gOpdw2Kle5X6jcVvFXhS+lejV5S6UVVLwnc1eT97V52vtLm6/1fbX+67suHXh/d2fRF81/Mv43yy72v9du642mHrk7aevVFl69dfcod65cfPr72++3vdv2992A7wR+gPAbjp7tX6hwvadXwbiK4+hY95jQcfOMOIAT3BZpPaOWEb1PYSvb5pK6beVE1K91mO3ig7jXsrtLXxv96fK9TXAVkm5BW2DyXI4PKb1vfb2CFhq7Dee98u4OexH9q6vO+Tm85kHBbxR/buVXilYefF9tR9Ne1Uya/ruD4ma4+uV7+a/lfg32hbqnck9W+YXWNmN40vLrnN+uu836y7u27XqVfTeVr866zftry7etv25227Wmjb3xRNv/95671W3bt64zfPXmt693fbn19+uAnqpJbfbV4G/beHVxA+dXu3q+F7fPVqt4RFYb4d/hv/ARG8DXX3iLJRuw1nPcAW0r+d5xvqD5d9yvV3wm5/Bib5g9JuG9nd4puW96m8LXD34K1LW2ZB960yS779/AfA3hXbN0lbpV5VuPX6t+A+8l9bYbnxF0eat2eNm3ap37buD61WTroj8QULbnW51fdd6D9uvYPlN/teBRZ28cvXtgj7dfK3pF4EsvXut/I+2c559E2qP6MbMWLFszfmALN2xadp7Fh+ls3nF8VAc2Edp6Bc3vF6vV8Wr1tDC82JcHzdwA/NhIAC3cAILZC34N3QjiXItuQymf/X/t6iH9PzfcM+Q3uhaA+VLgnd+m0aQpezfUPhN+8+k3gt8hmi3wy4Q/j3zefc+m5nbatfE3m18m+ql1N4C+edoL5deQvit9c/990XbI+fL2L+F21U6j+D2QbsPcY+SFvmehv2v6tEHfMD2K+wOkb+794mBPt741mhPvPZE/6PovfAXF3qHbL30Eug4CBpPoq6QXSrhT4I1d35T59SeDg9/4OYtrT72fhH9m+onf4wfaOf9v8uTOeGpmI8ufb3654fOlHlH4EtVHp58o+ox999kfJt1fbY+9PkrAWv/3jJd6+q5tXejehv7W8W+ydtD8nmr9hz8OujXmpdm+zd0y5CMPPyD91eVvtVbW+jd+D8C+8P/nYVG9vxD/cvDvwrIo+/XiB9bfaPxyXnewryPdVu4tqG/QOYbx75ivk9sd5wOJ3j1aneP3lK+++Mbgvb++DZgH6Nml375YJuq9om6YPt1qH+3eYfpT64P4fmq8R/4VktdvvNP437p+0wKtd5ZDAS7rAh/W+tbu6Bsh7tmhhgntcsXuQPYOs2O1xcC+7u184P7XHaAQUB7hBSSJHXxBMHtAVpBJHanXh4GHtdg4e4noXWkelHv56V10v/MpG4LHt5md1x9EJ791gnt5mwNs9fGC6ehnqZ6qfsOgLh2emXOfXHAV9YWh31tv6/W3aK/XF7u/v9fHEAN6jiA2nzsn8qEwNjXsn/L13Xv17De43oSBTe83oskrel3rQ2MNh3vs7sNrbVw38NkB6UMa0hYRI2xLh37SXAN5M/P97dfAD677Pj4vZNV4gfSz7DfFD6WvPn6ybWX6+fQt4bfIPCi/BnbIfCD6jfXN423fN4oAqb5oAmHAlvF7Y7fFX5qJHH7OiSL5Hff24nfT263Tb6gmbHP4pfTgA2LKzaogGzZ9QbL4xAXL5ObAr6hwHxaayfxbUAQJb8oYJahLGQiBbSJbRLRr4RbKLbwvT773IaPqJbfrY39VLb39DLZP9bLa5gXLYFbJrZlbFdCVbAwE1bcV4BAeraNbYrYGA2LStbGaDmAkwFn9XrZrgJLZqAu/rpbR/pZbF/owWRQGYncL5fxeW6m6dww9fQD7s/aAEWfVhbc/CRahiC/boffAF27Jz5KbFz5q/JNILfSIFfaaIH8/DD5dzLD4CLY14kA515lvXb4UApIGq7Ej7gHH3a+vBU5A7ad5h6I6Bg7Kg4Q7DBLQ7TACw7VLTw7RHaQ9AAG0/IAGKAihbM/MAGs/YIGKAjn6DfE3havSX44AqD54AmD5xAvz4K/U27FAuhIpAmz5RA63aJ6a/bU7eIF/7IUT5A/D7kAhnBhfaoGMLUoHfXcoFa/SoEGHGP7dAlJYK3foF0bSgH20YYGa3Ln5jAnn467dIFIA9YGOfWYHOfeYFzfJS5LAppa2fPbb2fQ24SrYX6O7RX6lvXYFu7BYErbY4HevY76z/cSbnfbY7wHK75dvG76RXM37eAi35w3Z77W/V76QAjlAEHVG6YkdG6kHUT7u/EvZA/HK4g/b34FXGT5+/DNbQ/SqDB/Kq6h/Gm7h/eq7I/S4FzXNH4tXDH6CDKu73A7q7N3c559XQn4KPYn5DXZI6KAin5ynOgEyvAYw0/cUE1A+n6+AxzK/vIN63A7HYig6pjmfNbbhAl4GpAlnbvAg24HXbIGCbXIGJAv4H1LLAFxvCYHS/cb6rfAgHrffz7oAyEGkAgoF7A9166fKgHwgqL6Ig7X4j3VIZog0K7XfRQFoHD1bRXPEFW/bj7jvZG6TvUkHcAckG/fLG4ZXKkFZXGkESfOkFSfH36Mgjd5yfLd5oLcm45rPd4qfWm5qffl5R/EtCm5MDTSHDFhyHR3IKHBsGxgYuBiHOYASHdEK1RQUgYsDcL6NL3IwxU5S9eSAAJOYbzJOBmwTeG5RItN0JR5a0DqHOPIdgicTLeVQ6YxC/KFocQ5biIloBVW/L1VAUKwqIUIuEeHwthbuDqeMBzisZ/zj+VHw8FM9oPsFwr2QMSC+kdOyBACdBcONwiRtJAKJle0qY1GTqwtc1qp2c+w3gyNrngo1pS+dQoSOJTopucrx8dCToXg+QosBV6oQQ+9hieFNxguGCHMgFsL6oXQCkAU8EvOI4ggQ6gK/eKZyTuVwooQu9jVgJ8HVlFRz3sQIDVgZwCvgthwDwQdzUdOCGJlHiAduSVyQQu9jbcNTosQ0CGEdXhrv5b5xsde8HNSXiGwQ/iEoBfkBoBG8EiQ5TodEf2zoQlgiRuS8E6eMUq6VW8FkQiTx8EcSHY1A9qSQwyzfgqZyquUiHsdCTw2NJSFT2Z/yv+Flr6dFux2QpMoOQgwwSOYxx+kdUJDcCCqLqCaI6tZgpEgAmQihG0r4uE8HHuHKCXghCHv5NFzp2IIAqEU8LlbLhx7AOlwvgrhw6ge9xjNXyFXUXgg6gHyFR1akBZQtKENObABIkISqDAI0DZQmMqkATKGlQt2w1dXloOEEMjC1FapNAIVBKQXAADwbag3kAACKPrTGoBkLUhSFTTqplRtaPASui+qn4CcgH3aKkPkKPFQhsJEK4hEnmu6ukOUhknTYh4UJYainWQhZkPsg2+EWhBEPkKMbWMq60LvBynX3wO0P0h1AQE6xPkOhWkK2hTf1Ohk0MTKqASIC6AU0hm0LcAI1BUgd0OWh2NmkhT0NkhpkNEh+JE+hrEOxsfULLcGkLkhKbhXE3IFlA8vSBhvUKMhZbhMhc0Psg7IDPSrQFwAcMOoCCMO08sAQhhd7FlATAMxh8hRsh5YEEKL0NEhgdk/aSkN2hbEKIhZblmhG0IphAW2DQanTDaeDREC2MNGqv4Lwk/4PNaQEKxqk0hwKrAULqqKm5hpxCWkWnVLI7kM8hM6k+ifELChqPkih/0OU6xJE0A4wE1sSkOCh6ngVhaASVh97GihsUJiA8UOYhkhFnEhRHHEKhE0AuRHMWoUJgc8bQ18P0TdUOgS9UAMR8KVKi8qI0nTaHzS7qMHUVq2ICq8YpU688LSbaJIUuUwBEG8Y4Npso3hScWrBoI04MSqs4NRa84PPIG/l7BnYKacVLAwIq4PPyoMnEOGcKnB2HXXKvdUqcB9QI8B4OgKwoTJAewF4Ij4NFax7VaKC9mGaf4KchAEJUK/MKFAqRAHqAAUeaIgRshIsItUmrQlhOlT3cLzRLqazUhqU7Go8brkMKAkno8phQ/sranxcFhVSInHjNCirFCA17gJqt7n1Qg7kPYIDj0hdhWjcevn0CeMNcKi0M8KR8Ndha8N8KODnTI0AFrhZnnZhX4PFcTcJ5hLcL5hYNU7hcrgMhfcM1aQ0iICQ8P+qI8PdhEHTnyUoG9hmbSmKRyiRY8HSKiiHQg8XRWRiq/gXB/RWzU7YXPyGHULhYTSDCEkKxhqPlxhysJTcKhCS+YREMAnAF46wELOhxMNR8ZMNPh9kCHgr9l82FCPuaNMMVcdMO08DMKOhKbmrAkgNq+kS2YR//iWhwMJmhrfiQhXCLvYA8H9at3SuUGMOphVCJWhKgTER10LcAtQSmCmgCJhbEP2hoNSURr0LiiGiMVcF0Pl8nEMZhynW7gJ+FUq9Sn0RQkNR8wkMIRd7FHwynHNhm8EYIViKd8P0NYCV4J0RokO7ga/1RAriPUhqPnBhdiIk8UvWUOfiLkR90OxsnMMI6SMJMRKbh64+JQZkhgFkRfpBFYn4IXcRAVfhszl5hTkPbh37Q06GDQ8qDkP/hrAUARfDUQk0sI6Ii6jlhuCJEC5YFWhYpSVhyMNxAfkPEIi0K1heELqRDSKmcesJFABsLihbDgShWFGM6FgXgiULBS6fbCs6awFSIdcHkk9nTw2fBCqIQRFw80bl4IsoDw0xgG585rBmR8kk+i9IG2RsyNlAyGl86sUj2sn3gS6/6Dq60MgmRlnREAKyME8ayI2RRgC2R0yMOReyPCkByPkkxyIK6sUli68XREANUPIAyXUR6qXSmRTQB2RdnQc6iyKbIQRE+RRyKq4oXQsk0AHxAR4lWR1IHWRrqmeRqzS4CYADhR7yMy64KLeR9qh+RY5DORVXQuRnAFlAW4mBRFi0mRIgDhR3yP9ATQCRRKKPbgaKNI4TyJeRhKN2RxKOnyeKN5RhHD+R1XRYkpACpR9oHq6iETAAM3VUK+wAW67XQV8+wEIg+wDG6lYAr8BwFbyFfir85YGa6pMIr8LYCuAvXT1ADMUBA/RUG6zMTeiHkKqRbMQ4ovMSYolqOqRPMQ8Cb0WyIHRFnUfgV2kUXDAATXRa6bXQ66XXSaAY3V3g+wAOAu+gr8nXXLA3XSliOUmCCQKlUARPBkIJ+FkA2YX9cuYQIiisVS4ysQRkkYD26FEUO6yQWO6zQTj+tbGrWif1rWKfwhgDa3T+Ta0z+2wWe6yXzz+HAIL+8wROCP3R7WHEx7+rJnEiQPQ7kIPRr+Y6wh6k63ucJ+FnW8PS9oi607+v6wx6ffyN+pn2E0uFhH+Q/z3WziNH+N33H+z2HPWU/05AM/15m8/wfWi/zVQL6156+gA/WQvRF6W/1/W/6yrmgGyV6w12P+oG0bglPTP+WvSg29vy6BYelg21/0Kgt/yQ2D/1Q2tvXt6WGyAEOG3d6+qAI2e1m96vvSuUUOQ1B7H0D6wfSeggQDD64GLf670GUBfW2v6KW1cBw2y0B4Yw2GMz20e0D0+eCz2+eRj1+e393+eZj0BeFj1qeWzx8OgEy0OjgOcBmGKG2mgI8ByYmfUmhzvRCIg/6X/UKCnGO2SDYF/Us4DygFJRPYcgBrRGwC9owmNpSZyDwAS7HAsjQHL04mNwAwwU5A90Hck6FiAwySH9a4FioAhPE3gNaLUxkWxngWmP8AaoEsoNQDiA8szIAnbEMx+4EeMmslMxrgF/UqAF3A6tEMA8s2UxqmP3AqAFFQmgFcxMmMVB4bw1yTKUWSkO0wSQ2U5SmyVmSEuQI0faWlyA6Qay3UAVyFKSpSrWRpSCCXUykYP+gywD+QFdDNgzySPeQwjNgywAbGhWPq0yF1I2foNBEWoIM+gQPAByr15BRwINBalzA+W12wBCALG+UwJ8+MwNQB7oOIBNoLF+syGNBywLSBqwKnmgv0tBD22tBW3yV+ruzXmeoK9uGvwumZwJ6BPI0KhpgGIS3HX54fb0MA3KBISC4DASW4AIqosnMAZADXAojACsjkV0ihwLLuOWOtO6FyRWKLwRy2Fy+CuF1cmsqV8ecaWzGQWJ72+2VlM/k1rGVFymOgmP9awFlExTcAkxS0AgsVxScxaaSb+rmUUxo3jsx6mJIscON3AOmPygJIFHgKOOMx4+Dhx5mKuolmOsxVAC8xWa3sx7mxkxj+gvSbmJHgAazJxamN8x/mJlICK0WxYAy5whWiuxSqRMWEOXuxN4AGs0t01MeZkBxlF1ieQUQ+gQmPBxZpDJxkmJhxLONkxCOIUxyCGRxKmPJxqOM0ximgxxiwSxx+mIZx+4Dxx8uMf0GTGJxt+lJxKOIcxhuLMxNOMsxdOM8xKOKZxAWIHkQZgjuouWABaaSKh42W2xWQl2xaBj8QB2Lly3UGOxy7BkIZ2PwS1dGvQPOLhQuWMF0m8gKx4pi5gxWMMgpWNPi+c2jMjb0AB2n2uBAQNemAwIgBXGOL0oQMNBGu1je4wM6xuAJiB0wJv23wISBvwKGxGOBGxgIJWBdnzWBk2LBB2HxmxuHyhByvxhBtoLx2y2PGWMX3fi1WKjGFwIbAeMjp0xJUwAqqH54tbDQI/PC2yv2M3mDKyI2Qpkee0AC5xnZkcij+hJA8IED2s6MZ+ziQwujQiwuEqWdOXjxsifwQ9OhF1xeguPxeoZ2eSMtzfRqP1PoMCDYiVmNNx1+k8xr6WFweAFG8P+Iec8wGFwqeUAJ0qC0OFdB62Vc1rQq7yQYgAAYQQACNwJdwK6GATN5CB8i0NAxkgGSAAIDVBC0GSBECZvIK6GqgBcn6lILEViLLK4AHUB5lGLE6kjRC6lFhAdi10rzjMMIi9bsa49j8e49RtG9jz8TKlL8V9isxtdjF8UpdTFgPF/zI/jVQc/iBeK/jP8R/imDF/iQCaSk6bP/jRqFfpfwMATlCfqZwCfqZBzFASzkDRh4CXgS7BMgS7BKgSa6OgTMCUgoi0LgTHAbDs7BIQTonsQTvTvnj+Rg2YOcuUlfLAvFM5jdiM8Xs9x8dXpJ8dPishLPjELPGlvsu2A41g0D+UE0CWgS5lnAAjtnAOAomPpDkj8TPIkxqfj0XhNpuCajlsXtfjgiVM9cwGhinAaoDmMRoD3AaNsdAe1tCtpYDytvxhmtiYC6th1tgAPoDyttYDk4rYCOtvYCICTbh0MQNt1AW4CRttltCtFvoRcTE9M0l/IGMRf0CiRhjBtsUS+iZ4CWXmTkiQTApzkK60jANygZoIKgjAFPjSAEgBAAIqAnW3gAFQCBW3IDHAgAEBAQqFZrRTQFwGQgKAbADFaWwGAAekBqAIABnQDgMwADHEb8HaB2FkkuzBK8JgKWexzCTPxGLwvxmRLfMfjxyJ0tzyJCWy6JLgJYxJRO0B70F0BFROa21ROMBXW1MB5RIsBzW2aJbWzsBqJIcB4xKYxUxN6JOGIZe5wiGJ9hNOyoxJZejGMKJhJOwxbGMsw420cJNWLqB/kPCxkRJ/0bQLiJkPUYJZiMmgioCF6lAFDQy6XZAjm1QSuQlyU0OKyqDQG5QMhB3eWhKxO4IWuCHpmQuimjAmipIbG3OhVJvM15Jt5U/WgpJ/0IpIR2YpMvoEpIXAUpNZMspJh+fu2OgKU0LQUBPYJ5kVOS72Mxea2Q8msMC5xpGmrB9KDZxxcw5xz2A9J9KVcsPpKiGOVjjucuxJuoWL6y4WIXScCWGyK6UIScQAAA5YygAybXQxcmBMVFIniqtIZlf4nZB/iWkTpUm6csXiCTrkocFKLPDhrJrGN98WYk/iWi9OCYCSMiT48siaCSfsUiDccnkMRCQI8fiX4Cr4KYBJCTITpCe/iieMoT5CX/jfwMSYRyaoTHmIYTs0B0SFiR1BtCXZBYCQgSrCTOSDzM9g0CSkAzCTNALCfoTs0AQSecRRdhiXsDJcSJjpcVDipMbDiLiYriwIMri9cerjLcRDRMcXpiccarijMXKpHyYwBjce/ibMfeSLcVTirca5ibcR5j8Svbi/MY7jWcVXMkCVSSbvgyQ48RqS2yRygB2OYhUgDDcv3gz8nCX6T3SR1ZI8Unj28OATKsRiMucMsB+cSIxWvnvcDsg/iuyU/i7sb2T+yT+S38bISRyb/jmKQATJySiBpySy8NCWMTFAYuTHAXoTVyVxSUCXktNydkBtydgTLCeMTrCdmhbCUeTySc9hTyXEAIcTLjocYTJPyXJjFgErilMSji1wBpjPyVrjdMdjiDMW+T9cR+SAKc5jvySTjbMSZTFwJTiCcdbj3MfTiwKczjAsQ2NA9oySmsbRScUt1ktcmFj50myk9cnGTDch0TY+jSSeiXSTRttvII8YHt5yceNCxoeNssVJBlgCni3KcGYh8RhSsknLsNsVti0EjtiZkHti/ccVAjsUAk2ItglzsZdibkumSsTgMcg0rFStBG48FshwSfEsjkgSU2SSyXwSlUsRcxCTOcOyYS8IzmLiQcRLiwcWeSxMReS5ceZT4cfJjbydpSbKbpS0cZri6gNriXycZTvMWBAzKQTjLKabjrKatT/yfZSgKY5S7cTZSHcfLij3nVSI7pzicKSB9fYCRS9TORSyLoTlwzkDiBqUfchqcJilKeeTVcbLi1KRNSNKYji7yTpS9KRNSDKTrjXyatSDcRNTCcW5irKX+S7KYpoXMbTiQKfeTjqa5TncYdoPKdWTMqfUkPcVx1cqd7j8qb7iFoP7jiqSdiQ8fT0w8WbBoqWrp4qYhTFcBmSUqc7ijoKGS3cd2lf4jVl4sQ4MZcoOl5cuSkR0tSkJ0plj6UiViBCU1d7sQytviTRTWCckTHJqkT6yekSiya6ScXmCS1sbvdyXmSSM0hSSh9DwMoSUUSiSWxi0gIAAR4EAALsCAAEOA+XjxTQqZMTwqaxjIqaIxKsUni8gH71xgBxlr4gzS0aTvI1LJ0DuqT2TncdhSbTFdTR5NBiWCe4laya9jmqc6TWqcWTuLIrTWybkSaXlJAonnJT1aXqYnEhbTuiVhjraXCSAgEbTTaU5FCxqnToSdMTiSV3tPKd7S08b7SyLOlSYMeA9qspLl2aQuBOaUlimsork0sSrkPiGrlAya5YiKd5TNctx1oyQFTYyVFiFRjXS4sQSkOaYljBktzTmskrk+aarkBaS5YV9vbSxaVWTh8SuYQ6TLSw6VwT5aZmNFUgviaaQ8kVaaplISRMS06TCSZiTltyiY0SKtjUTUSXUSGtg0TKiS1sWieiT2iZoT8SWFT06bCSX+k4lBiZYlRCfj8vKS/jfwIxTByUxT/8WOT5CUoSgCRxTQCUJSjCa/TeKdxhoCVmgBKVJS1ycYSnrFuSsCbuSrCQeSn4o9TRcTe9OidmgUgIRT4GfnSdaRFT+ifqZljlJBkdraT7SVhZ/ABQSVIG5ZFElmSr4AlSzqYBhRKTiD7aTyCqEsvSMqWkk16R49ZaYWSY0lfiWyfwS96Y3o8cpRTGQH/So5gAyJCUAypCX2wBycOSwGaxTIGSoToGeoThKTxSzqXxTxiSgyiGZHQj6euTQzKYSsGTXRJKWYzcGYVMaxgQyH9OATUaddT+MLHiUqalTcHqdTmaYjB0fuedhQbCCw9Hj8lGZUJ5HqEyjFif8bnkf8S6aNcn3mkdxrmtiU6SvT7su7dckv3ifrjF9q0jQTa0iYk1sZXSg6T+8wycrwuvvVjc8Y1iMablkWsZz9RgSXjXgUCCP9iCCLQW3icgSL9BsZgDxfo3MTQeftxsQL9QQQptwQfftPQTsDu8QtjgmUcDMmacDB8cGD3qMlAwiWySYdhySYie0CncZiDMssGSdFiatNftkys8S9Ny5rqCJmRF9C8a1jngfUyeme/sKdp/s7bkL928e0za8Z0zhseczRsaaC+mZkCDXpzs7mRCDZsV3j5sTIzLMg9i/GdIxtQeUy7gUcziPjUyRgSpp2sQ6Cy8ZMCK8T1iq8X1i5gYcFTrt2S3PvaDS8Ut9EAeaCbmVNjadsMyfmV6DoQeMze8dnNqATsz95ucCt7qiDLvuGCMQYlSsQdGDzfkO8JZviD4wTb9EwXb9kwamC53q78F3h79swV788wQyCIfrXtiweTjFPmWC4fvDiw/nwcI/r4yegae8uTue8gmWSzX4pEz/rogoImWKD/6dEySfve84mQiJ5Qe+cuGVUD0Wex91QUUyD8XszWVkrtlbpsycliczamdCyJfg0ym8cCCW8QMzDXl8zCWaizHWdNMnmeB9YWdiyusQiyJvq6D5fj8DO8cSyxmYLsMmdsyVsTMzqWcVxdfmGDyDob9/mYCIWPjGDOPuyzXADx9X0V7TQNh98zqbO8nlpSC3loKzPljmDzZpXtRWbJ9/fvJ9A/qyDpWSH9ZWZyD5WdyDqwXfcjWS5EBUkwDkvmQi2Ael9rNpl8uAfZsaAI5t8vtygvFgICivkIDPNiIDvNmIDfNhIDwltIDQtrID4li19b8aHZi0Qn9itGWibupWiIsVOsa0dn960W2sDgp90u1q2iS/s3Jy/oOsJIsD1q/vCta/vfR+5Aeih0c39yoK3951oj0l1l39OAKute/mNB+/jd9B/oL1h/suih/mP8H0c79/ABujL1tuibvruj6gI+srSdz0j0fz11/mejcANv8QOZL09/leiD/jejZQWdTT/hBtN0UWy9WYgoP0Q18v0Y4A7/shtH/jb10NgBi3/kBiP/iBiCNopY2tMvp//gGyqsUIyVzOjsQWTniwWeqy1bv191roEZNrm6yLmct9nQcgDesYQD+sVTQOmYoCAQZJtGmVczmmXizWmVaD7mTGzRmfNj42SECpmfW8KgQUzGASQirFqwDLNqOyOAeOy7Ni4sp2Xl8PFrOzXNoICPNqV9l2eV9V2ZV912VIDgtjIDYlnIC5DOhSq6ZhTOvjcDQWYczpOSUDIWU8C6mcGysWbz8w2RkDYgUiz1OSiy3eGdSdOZbsPWU0yvWS0zBmb6zHriMzdVnGz0mZZzE2QPiqWbZy22eyCO2ap9fZsJzaLiPpyrPMYDDEsY6rLdT1mdAA7jBfovjDfpP9G8Zn9K4AkAK/pvjB/oXjAqMATMukgTMAAQTEAZwTOAZf9FCZoDJiZ4TLINUDOgZqUPCY0TFfoMTAQYQDDiY8TDfoCTDQYACYyYyTNyYB9pbNqTEyYRDAloXyvdyuTG9yy/myYpDJyYeDFFyEiak8KXq2ND7u2M46UmdMUozTO6UDydPqJy0mSACJOQczlrklzVXilyNXmcz0ue6yxsc3iJsd6zPmW0zvmf6zwWRiyumdZ9G8TjzPWXjzyuT6zCeX6ztgTVzzOXVyhgQGCaAQ29haQzNrVqmyaPumyGPgyyzqVGC49iyynvnGCC2QmDFASSDBPmjdhPnyz0wf98q2dSCa2cKydCeD9G2cyCW2U3tKrlCsKwVyDO9oqyuGcqzRHpj9xHpedJHmdTNWS89tWZKCLeXF8sGKLdBzCayOeQHsVQXRzLWYoyomZqC4udnjkeQ6ySefvt0efJy2sYpyXmb0zcef0yaeQTzjOUTyCuUySzXmTzGlrpySufpyyuYZyKuXTyquUSyzOUAdCPn7yC8VZzovk1yzWSiDj5nR85eZ28I9lmzBeX28zqRx82WaLzoAIWzbftcseWTLyK2fyyxPp78V3irz8wWKzN3qwcSwVKyKruWCOQe1yFWep8awQvSeEFHc2vjVBJnkCzIHgRjCnvM8QwSRjynmRjenms8BzoCdDToA8MHsA9FWVUyxOWzcBQYEyubrnznRDbzTvsrJrebqywmfeiDWbc8+2So8EmTKckmWay3nsqcPnm08mHnA8gLp/d1+ZU9p7us9Bzjvz0HqC9MHuwNELlK8LTh0cs2T0ddfiZkMhnkN4zsnTj7rFMMngMTGXtk96xnMcqxq3Re2ZUMVjs09P+c8dv+V88djqRi1Jhuc+nv2dKziAL87mALeHk0cGnhwys2YfNiBT+cv+cvz9Hr/yfnlQKf7gC8UHvQK0HiC8mBfBdAxjg8QJqtB8HoQ8ETiQ9p7Mid1IuQ90TkRTZ+VOdZzvhiLxnM8U7iU8DHks9/+fwKKMf08qMYM957nvyRnjs9z+ZjSLECI9BQVj8JHsc8n+fbRL+fQCOUDqy73o/zD+REhHeWwKvzg8cCntoLX7roLeBZQKs7qY9jBUILt+QwLRBWCdmBZALIXkqzoXrAKrTkvTA6RazTtCIymqU6TN6RIzeCTvTMck7zX4jbBCxsJlH5KE8D7sGd7qUQSk6YlYMzl1y4zkk8qXprSIeSfcmhWJlz7qmc+xqxdcnmHgF+VoKuBToKgbhqcyjn892HrQLILgadohTw9YheIKDxmwKP+ZwLSBdwLghYs8/+aw9ABb/dgBVEKRBdMKwXmOcxnqRM5+crTpnv4LZngMKghUMLOziMLyMWMLOHhs8aMcM9tnt/9hOb3sK7oc8HBcJyXBUqC5Rrecm7h4LYmV4LYsi/y3zoULyJn4L+7ovzAhcU9LhSw9rhRvyqnlvyoLqAKYhXsKbHm7iYBWvdfBQoCBGWkKJacHSGqSkTRGRvSGyVvTJGd9jpGXi9hCX1SnqSMT54vE96hXFZGhWDzqXnfiFrOgK2hSSSR9Ey8cBVxdUpjxcOXly9BLry8HCYkLwybHyj+bViymZJzEuX19I3gN9Uua6zumSHzLmfrdrmZh8jOdNiTOTHynBXHyg2TCyMuW8C3mTlyNgdXitgTqs+dkzyc+ajy4QfnygwSmydfjzy6WRmyIwQLzTfsyycQayyaZFx8xeZyyJeaWzxRREhy2ZGt2+ZmDcbsD862fQce+WryA/gPyg/i1zteSPzKwUj9o7vDz2cfyC3haqyz+daKQmbfyPeQiJ3BdKDSfjqL68D4Ll9jDcrWekLYuYjy6sdKKUebKLbdGEDi8VjylOTiy1RVkCNRQSyM+cTzsxXBYiudrs9OaqKDOeqK0+VHz6eeaLADuosrRQmz8kgiDaAb4Li+UFdS+aDdy+cgdYeTmzheZb9R3hyzCQQGKpkJLzFAUGLMbsuKBWYry8bpJ9u+Q2ymQTGLJWXGKh+TKy8AHKy6rnrzx+cZkDhaJE/AB+K/ADILYAMpFKaZ8SrLLFiekglj6shPTksTzSWsq3SOslljXRUlSnEK4y08dNR31OtRc4Z2DPAJIdUxPWC16sodh7PIdv1K2DrqGhK/ZExANDoWjnDMPSgJWPSQJQHim6aljlcm1k26XPTQRSb9YJfhTPGdpl48SVh2GRmSysanjaGdFzrWVWLMMLYLT+dj8rBaKDr3oStcxVqyERPbyUjsCK3+buLAcovSrCfBTARFxLqqTxLBjJVipBWHhFKcpSxqd9S4cb9StKSrjVqXNSNcW5RnyUZT7yeDSNqRZiGKdtS1cbtS4aQ5TbcaBSjqeBSTqUx85kj1ltclWjIsQblRskxKNlm18+gQly6xSECA+XysFOUqKKea8yw+e8zk3sizo2dqLARTMxMWdjz4pVTzw+anzaeaOKuxQzyLRdnzQvsJyKWUmzC+YpLmdEbpsqZ7jcaYul8aftiiqY1kg8aVTQ8RdiUyZVSpXhmSLgTiKkiYwlpaUSLshSSLchc2TyRZ1TgpToM5GQDjqRc4zkzqDi3qfpLPqapTpMUZKbyUjj7yeZL9KYtTDKbrjccetS4aZtTfyebjYaWch4acBSnKR5KXKWsy4eTFzrBXxLy6Y5FcKc4YMyaRT+FHdS46WrSScvWNYYHpKPqcMEvqStLryVNT1pQDT5qZZKlqdZK9pSZiDpfZLoacdLivntSEaRdLVqcjTrpdpK5zJ4S8RcUyfUtjTfKX1k8qbINGpYdjmpSVTTsWTSLsRTSI8ZPzJRfFzaxb7yexccyopaB9MefqLMpaHzspYlK5fkdcO8alLUmVDp4+Rbt+xUnzBxSnzhxXlLNRUTzCpROLXriVKxJaWkZxYGC5xSkLpdu2ArqBPj8CP4ThTnaAgiTHSgWdQTmZGVlu7jJlxrP6Zt8aNA98XzLfSbVTKpfZMCRQNKshamNhpRmMyRR1Td6e9Kwpp2SbpQJK7pX2TVGQOT1GUOTv8eOSFCcHKdGQeA9GWgz4GUYzEGToTlyXuTzGRoSWNqJSMCTYycCfHKHGdUKTsqQSozNAAKCeRoqCSVk+gn9kGUPQSnpWKKbToIzbpcIy7ZY6d16UNK5aSNL2qfkK+LMcLmxp7KXhQ2BfZQ7B/ZcAzNGcHLwGROSoGSAT9GXAzDGTbLDoMYyiGaYzoKRYz0GdYzzCbYz05ZvJZKU4zjyRNK+QbQpcmYbKxrB4Sxcj4TkDH4SMEnTptZfPiChSES5IAszGgUsy4disyuSf7RYeY9iegZkLHSY7KG5c7K8hRjkW5WayD6fkSCSVbTP6efT6tpfTkSdVsb6XmBzAffTMSffTsSW0TcSSFSVAZbSP6WfTMBaSSZpceTL7nnSEFSfTC6fST9TPMTx5dcFhoMsTVicAB1iZsSdiXsSDiSVcjiegBTiVBBxoLJjf5tcTbiegYHic8SpwG8TE6JslGCY/KuGc/KUxpZEnZfhdRpa7Kz5bHTjoL/L36afTiSWUSgFQ/SQFZQq0SRArL6ViTWiQ1sX6ebSsFQXTdaTbTihp9LiXv2MYKUQy/5Ugqi6QhTMZcWy50fMyjZuESodtfLWgbfKkdjySF8LqSBSUKTUtIaTsAMaTxUKaS7mKvBpSX4hLSW7w0paDA1SY/FldCqTq6C4BwlVhZnAFqSbvjqT+SS3F9ScKS3Ft4q+9pKS+4AEqFoEEqatJpB6GYgyHSQIrlsh9ieCSIrFUu4SyLCFYGZaXT7pUVNLqUISpXkzTRRSrK5PpGT+smeyB6YFKEycmT6lUCEqqbligrPSYcyboA8yXWTiRW/LhFU3L80GWS0KceBKybiLLFRkKa5ai9Q6fXLxGe/LylZ/KQkiEr96b1SqKV7LKxT7L6KSTipCX3LRydoy5CVOSYGbPKo5QQrIrFV9+KSuTUGbAzZySJSTCZgyF5WnKcGcvLDyavL5KQpThqe9TRqUtLLyepS1pf9TZqYDT0cdtKQaStS1cbZKYZUTiHJTDSEZS5L9qW5KkaZ5KUaXLKIkDPLeZnBT6aYwyq5shSVoKhTvAfxKjlWklfYBdS/aYbwwlVJTIrP+K5di9LBua3KKKcDlf6dRSllYJKu5cAyA5aAz+5Zcr2KcPLI5WPLixREhJ5boTnlWYzI5UnKPlWJTU5XYyK6BnK7CerTAVQtK/pb/plpVeSFccDLIVWZLoVQtSrJbtKbKYirTpYdKzcTZTnJadLXJYjTnKRBT8pu5TO0nrK2lbOk/KY2sApSNlCEportabSSM6V/SGaWukO5UYrOGfcr7aUSq+JdDyLFa7ybWR9AapTjTFkgTLBbkTLqJS1KyZeVSOpf0qupdVSD6YfinsSsqXsXXLX5RsqplVHTsibrL2VarS0FeSS5pa9SpcSCr/pTqrwVfqqZqYaqwZdpiIZaaqwaftKLVbDKtqairHMeiqkZYdSUZdirrpSGqsKX0qK6ROceEDdTahXuy25TWqahd9L5pQ2rIcaCrxqatLW1aZK1cZtKgabCrlqTZLe1Ubj+1UdLrVSdLqcRir7VZdLHVQyS7Hi7jCmVSqJRVjTNsbVKk1XjTCZYVTiZYHjSZaTTyqZTKI8UnRqabzM6aexLvGa1YY1XfzsZWHhyJVLlKJbLkh0s3S6JRlj0/lEr15Xs9upQsq+pfDl8yWIzXTo3Ly1VIzxpViLJrD/SE6f8qV1eLig5n6r/5WfSDaSbSzaUYryGf6qAFRWM7afdjHac7TTAYRS3acWgPaZOqfadOrHpbOr81U/LC1XhqJlaWrPsVsqiLhhqeqfsryLpRqvpdRrhHrRrTFXrS8wNnSmNZgr1NdIrcFWiysZQfjKsQ9LucU+qjNZhS4NXXSiUohrJ6chqZ6QxK0NTziAkEzc2vgbzj+RmLjeRe8zefcqvheG8CxRLyYmbeiJVUCL1BkbKFQb4KUmamKrZVOL6uQrK2eQYscmQbLi5fJqAbjJhxOTWKfecZ9Spc6yoWRttWZS2KsuR8DW8SOKJZX6zeZdFrveBlLCteXjsuZXiTRclKa8aZzGecVLVfjUrq3raKlZYuq5dvvLXWhrKj5dXoT5VkI3Za6qfskXLOcgyg18RviOrGbLd8eZqeVXdLEiQWq2CY1SX5YIrJlTJrplXJrSNUuqDlYJrAGd3KGKWcqg5RcrFCVcqI5a8q/VOKrdlRPKY5UuTkGTKqZ5YnKNyQqqU5V8rlVfgTflXgyiXh8ls5UdA85T2kC5WNrf/ilrS5f7SxNXwqJNeMr1lQRrNlVtqb8VWreMu3LcVWmKDtfyre5SdqWKWdqRVWoSxVUYro5Y8qTGY9rN5HKqXtRgzFVe9ql5TYS/lfgy15fMLnCeNrXCYOgd5SJMoNXmLwHr1rD5TPihtcESiKSyT0CIszmgcszYifEShuUtrxNStrCRQ7L1tdJqylfDqlad/L4tixq6NTIr4SRfT5FWkBr6fsSlFfUSVFdAq1FYoq8ScYqpFTgrdFYpqHqT9rnqd0LmNVoqKGQGqz+vgqQtZKJbYMQq/EGsTcABsTuQBQr7AYcTSACcSziQwqiTEwqLKiwq5AGwqXiZwq28NwrxnrApK5d7Lq5ZLr7ZWtqSlS6Tt6dsqRRTdqhEkrrbdaxr6NWrq5FUiTNdSiTtdbfSMSVYD9dc/S4FWQyc9SrrcFXorl1SprpMrprj6dorKGbMTeEmzrpJeXJQiTYrBdVETOSU4qY9ZKEXFUkq+CCkqPFWkrg4CaTGgGaSslRaSiQDD95SdEq1LBEq7HqqSFSTEqO9fErEqYkqcAG4qDSZPrxSTPq/FZvB59Tu9rSbyK7SYUrVtcUqWqY2TI6VckOqZUrHpdUqSpiZrhNWZrGlaKLmle5ry5SFj3VVGT/Kbrkuld6qH9L0qJXp1LRRd1KhlQloRlWMq1lSWrYdWWrH9VXRZlRSr5lTGNFlbGqayVDqEDTLqkDZtqiNWNKRtYjqwpuxL3eV3reVScqQGfiVMdSHKIGedrRVZdq5yfcqpVXHLBKbcr5VeTq3tTuTF5T8rqdd9r+qYQyrcZqrG1dqqwVT9SIVW2q91UarwZTtLQaQiqT1WZjLVY5K1MTaqr1SOr3JWOqrpZBTFAfirYKeBZI1UMJBzKSqUgOWSKxRZq7pe/qIDXSrMyRvrGVaQyh9ayqF1aQaqRXtqUdTFqVGYdrTlRoy6DQPK2KUPLcdcwa7lU7rQlXdqnlfHLSdVYzPlbwbvlVJTVVYnSs5T9KgVYtKm1RIbt1ZpTpqbuq1MfuqYVSaqFDe+ToZX2rkVXDKL1WirbVderkZWrjUZQit0ZZGZ5tdgbFtVZYfKb3SgDSool0qAb4FXprTdVQzANcGqPDU4YQNTd8wNfHSlSQ+ro1SUycZW+rE1fjLP1Smrv1Wmq/1WVSw8VmrsxgMqaqQHScNSfjBpYga8LoQaUDenquqY0aR8ebrM5QYrWLskbRDRuq0jVuqgZZkaQZVCqO1c9B8jfCrCjfjikVVDSB1fDKh1RUbNDViqdDcXTf9UJqbDTOqWNu4zXpeYZutW4alNbTra1YlZLjeuqVKeka7jX9TpDTkbZDZ2r5Da8bTKUUbT1SUavjWUafjRobzpaOrqjeOrajQ+q+NQ0boNQfiE1XjKx0nMbFRqmriacHjljRTKg1SYtcwEMbEqSMaV9QhLINZMbt1oBL4NfXTx6dRKUsbzT0sfzS0NULT6dSxLsNctqpabXKdjfga9jXLqiDaIqv5fcqfzKca1VY3qXqTRqW9XbqAFQxqc6QEhm9SYr9NTbTzLPerlgFxrqhjxrxjVSaBNQMaQxmXSP9Z6TRNeLrIdYnrlTdLqU9RHSFaRWqKReCSPpQ3rzjSyK1NUabc9arqs6Yxrc6dSTEFVaaqGYZqFtdSqeELSqK6Z3rLeT+8rNaPTRTVRKkNbRKHNVBKO6T4yh9UCabBQEzK7lmLrzlXMAtZRygtRRz7laWKJrlybvzL7KBTWLqSsD5L6TX3TgDZMkgqaNk7ZsKbrNQ3TQJTRLJTZBL26fPSYbspLMDVsailc5MNteqaDjdtrxFVvEj6ZaaejXEMEScAqi9aAqS9eArddQ/TVFZXrtdUbrldRpqzdULjUFe4b2tTBq+VWoyMdXISsdaHLGDUEbblddrLZWEbCdVPLidQYTgjVwb55bEaPtXYIEjcpr4kkgziGdkBSGb6rozbXqbaVocaGdpKj3pnrKsr6DKtVsz4tZSyq0vxyVDHpYKsqaJpdr2bWjZ6rAqYPT96Hma6srZqwJVPSW6fRLSzbObvAYRZo8QubFTf1K/Tcnq79aSKP5eubQzRIqtzSbqdFZnSUgOrrC9XmAtdbVtjzXfS9dTYDzzd1tq9d0aRLYGrbzSPpkdQ+aD8U+ae5cdrXzfQbB5boymDV+b8dawbwjUTrIjUBaydSBaJKVTqZKTTrLdYQzoKVSBxjUpaELdeaqGchbUqcBqi0AwzeEkwyDwJVAv9UQpYYGGrQjQNoogAqreGfdj+GeLS0zavTcDcWrVTaUrgSRqbm5TsqfzXsrdtQozuVccaX1WjrnzbpbWKf4aw5dcqR5W8rvzVhbbtX+bpVRZbODVZaYjTZb+DXZbBDTSKXGSgS3GXOqPGXYJVJa7T1LORhBXgUBhXqK9TAT/qTLWFb9tGfpKLLDywpXTLsta6anWUzLYAREDlRcpzusRGy1OW6D8uRNN0LX2KrbkVrcWWLLI+WVqCpeOLXbj6CDgc+qlsQ1ysmRVLxrVnqgWfzrbFbFp7FdESRdYpEH5UUDNLf6DOtezzYYDNastaG96xY9oYAUaDnmXFL2ZaVzqeblKjrZ2Li3lpzCudVqVra2Khxe2LStbDaZvtVyipbUY4BUFb5rYEcvefsy2VjKLIpbJz1XoHyWZcHzwbSqLrXqpzcuZtaUpdtaMrbYo9RZTbE+ZTzIbTlLDrT/shmSdaVNlnzJxbLKvrQ8DWebhbrSehaueQ6KLvkuL0QRXy1xXd8a+biC82fXzG+Vyzm+VLyyQa3zgxWXyTxVmCleV3zfluu9irkWD++TeLW2XeL22Q+LO2U+L1LCmKq5XlahJdWb3habzHBeha/NYnMGzfcrZJXKD5JVLdkmdTL9tWHh/rUTaIpSzzFraDbmxUjb9rW2KPmdzbKuXDaHmdpzEbVTbVreGyXQRtao2U1qpZWdae8dOL8srOL2efOLD5mmynRXzzZbd2bEiPLb7lbXyvRfmyG+eLzKOf6K7rXkBDxS79tbR3yhWfrb62YbbIfs2zYxWbbzkM3sLbQj8u2c+Ke2Qyhszbbz7bWmBB2aQjUvuwDpgq5zuAbwCZ2X4g52bWjkDMV9hAaICFwOID/Nrwi6vuFzwtjuzUte4lK1geya1ggk61hWi0/p0rm1nWjXumoib2Z2sW0csE/usUgB1vOtu0aIJpIgUJ+0fX9Ieo39h0S3851o+h2/kBzJ0Wutp0ZXz50bBzoOUuj8enBzV0Qhz89khzz/i+jUOYlT0OZhyl/iv8KoMei8Od+tz0Tv9L0YoDr0Z4KmbUOAqOWg6Gepf84Nghtv0ff9Len+iOOZhsuOU/83enhsPes8LC5SDqGFEJy8bSJy7bQjzA7aADwpfTKgbTytTmWlyCtZHbatcVr8ebHb0+fHbuxXXjlrcnbkbaLLUbeLL0bU7dM+S1qBbW1rc7Z5dFZQXbgwTPaHOSOyBBBl9HFkvaPOXwDvOYV8N7Yuz/OdvbYEMFy97RuywuVuyIucfaYqaNqg7fay5rULbqmaTaQbU2KZHeo6o7SjaY7Q7ctrambcrZZoBZRa9Q2XI6DrVo6YbdN9dHc1qsbTLLDHXFq87SY6bOUXz28K7N7xcPbrbYzbKrYQq46T1zl0PoZFjDVZljPyAkpkx8RudNyxub8YFRu8YFoJ8Y39PNy/jNCZATGkA1uWCZVkhCYtuVAZXADCZzuVgZ9uUiYjuVgYTuXgZduaslLueQZruVvVbuXQYaTN9zMfs9yuDK9z89gyZ/ueSYzkKyYJDH9ydnYDzy7Yk8KhQmc0Bek8ORfIYFzI4zGWTPyKHdacAnfJc2fqHbQnY2KYpeTy2bVlKObZzLI2dzKtRZU6hHfzKWbbFKgXRDbk+VDaubbE7o2VnbgvudactT9aindqaAro6LpbfSyy7W87mPpXam7dXaR3nFdePp7bG7ehaW7eld5ebGtq2WeLcwReLu7eKyTbeVcB7VryqbomLdeTbb3nVU7SNsJKazaJLgndI8pJTmby5B7am7V7azqa2a/beWKKDeK7BJbay5LkZ9AbSTa5RXJzopUHzYXcVz2bQi7Obek7FHflLlHRVqoXelKknSN84WU6C1rWna6bRnazRXzb9Hbk7PrUY6fbqLb08ZYaoxguLQwSXawbgS6YJUyyheR6KReVuKfRTuKpXVS6PnTS7K2fS7TxeGKk1pGLLxYWCm2RKz2XaU6h7Y+K6brIIGbv7b/oNPzy5WoLI7uvczXR19sjqcLIRecLoRQgKrhSBdyjuELxhUC9kRbsKIBdw6RXcI6III7bMxcK66zYoDJXehbpXS2afbS+9sXQsKAhZW72njR9hhbW7RhfW67hcILNno8K6MfEK5TRiLYhnAKkhggKd7gk8hjkyL6XmxcSzK0LmRWfc46dyLqLo2MqhpaACBee6iBXQ8K3UsLBhdW7YRdO6bhbO6BnvcKhnkA8LBa27QreLbR3WcL73RcLH3V08DBWEKaBXO7thQu7P3U8KJBe3hoTtikZBfCdiHkidQRoiNkRhQ8qHlFqaHnk9y3f0KAPVW7J3TW7M7nW6wPW+753Q8KoPUu7W3WGSxwJ26vNWqye3WdS+3R86B3U3bZXe/yy3RCLcPcndAPQR6n3UR6Z3SR6TBe+6zBeAL9+SZN0RchdkhahcnHnHrLrVPIErSqaAzffqgzcRqSDQrbxVSE9wphsIInk8kYTQ5aNaRZg6hWpaGhXc7UBS0L2RUe72hSe7sBemd4nth7OPbmddHhO607sB71has8ERXQKIPeR7zBdB65hU09b3Vx6h7s57SnvoK3PdQLN+Z56kRVMK6npR7AxjpK0kEcLFdfZ6tHoF6nPT/zVhXwLQPRF6Jhbudd+aJ6v3QfyPna8Kz3nR7azVe96zTfz/hcFr0LWx6R3Rx6UvY56YHivyKBWvzDBbcLSPV56P3T57YveJ6Wlavc13VacFTRLqlTasrErUp7eLbJqEdex7WRZlYLdUIaDPflMQpgyL1rCgL4TQ866XrMcUzsugyhhgruLmmBeLpy9+LkKL71SJcA7Wd6wRLTKAbT86zqY8CMedI7Wbbq7gXfq7QXenbwXdHzIXfHqh5ha74ASk74WXVrEWQ1q8uSi7TrWi6c7fk7jHQlrVscU6aWSXz9fvyzM2XLbsQQrbPRWS6XvhS6I3UmD1bSmDNbUeLQFu3a9beeKDbYwdk3ery+7Zrzh+W1ykxWPzbbZ9723f4yT+UK6PhQI63bZvMmPfy6WPTV6h3ZT8yxSxaFXZPa6fcCzMtcHbxHeq6GxUXiAXQnzHvfC6RZYi7DXci6mtaa7afdC768WDa4XdTaZfp8DbmUo6MbXo6cneW8XXeD63XeVLJdvaLmvbzy/XauLy7euLg3ZuLyXbRyaTc6J9xWWynfhSCQxQrzdbYy6IxWD8oxVeLe7abbyfWU7M3VWCGbkVA6wYodINI2DCJTMoMJeH7vZH2D2wT2CMCOIco/elEUJeQAKxDlFfYflF6xLuFiQkN4o4WN5Y4cywMnDOD8WEnCYAMRLFwYn6NwZ2DlvCn7momnDlwZMU7QnvUlanuCy4bU4LSsNFjwV2FcIaM5WERFDFYVdDXoY+D14SKAkoWw53wfc10kT3YbIZ4B+4ec4ykeBwhOnGQqIPw1QGoI1QGgv7V/Uv6yYiv7tnBpDKEZEj38tEiUArEjxERJ5oIUf6voe/kSYQQjmkWhDI2phDsIX367YPhD5ESDDSKuf7lERRDFWB4jaEYmRaIfRCuHExDr/cIinfNNCIA8P7RITxCIkTf6nfN0iy3Kx1gkfZAdIXAHwA40ih/V4j5IYpCwA71DDESgFjERf7UA/4jznIJD1OLYjmkRZDI2lZCOYewjZiCUjeKnM4lQq3DWAlRAROsioskROVGA+BxmA5kjWAxW4xICZDXIWawxQnaiZYQ5JvIflD97K0iAoUW5+/SFCwyLoBO4KNBz9HX4R4HIAVA+aQlgBBQcyAP657AQHiAtAHlOrABKIawFkA6wEq3NW5AgLAAGIaYQhkc+C7AziAUoQGVcynjJQJPi4RKnwRWIgZD6A+NUnIdO5HA8lCjQKlCoyuw1hJBVD4fJ4HZCt4Hf2D01AvIc4gg2w4XAygUFWlEHFA14GfA0cQIEqLI2WAA0xYYw59/Yw51/UXVEg4AGnA24AUg+nV2GtlSFQo9VAasoVKgyEHXA+w1RqHUHEGmwHzWlwGi/Jq0xIPnUmg48BQgxDUlilpIRoQL5DVAIF5YXUjT/YZDjAym4FoegHeoXf65g3extoYsHLwX4GUAgAHmkSdD1g3UjIA2KVOEcojoeqQGkA6j5kA80j3odgBTg9p4tEYP7sAym5AYXsGHoYYHywEQHlEVDDRUbDDng6SpyA/WpKA3Ei72KjCkkQTIbg8j4/g+c4/oc0iCYRYswQ4R13EbxUgkdCGGZHCGUAqDC9St/7XociNJASzDQ2sG1n/J4A5/dv69Srv7kVEUGUKCUH+pJv7wOMSGJyqSHtbOSHQCof6BYQSHNg8ABmIJq06IJq1P0tyGOA2apug/4QeA/1I+A6wExIAIGRHHxVKkQ6jLJHqFakVMQ9Ax/6CAhxCVgxJ4EoX/67PLZ5InCqG3SESB1YadD1PIdQtA2oHeoHIBNA6oGdA0hQFQ8f6DA8qGHg3exTA+qHBpJqHdPPy5rA7YHjYXgHn/GyHaQ0P47Q64U8ZBrDI2pkG4g4mVvQ2J0Boep0hEQZDDA5S46EfewIg4GH7msGHowwkGIw1MGvCDkG85E/h8g4BDzWpSHdHE0jAQ64UNZImHBEcmHsg74QswzoGXigUH5fIyGqrE5Di6umGMkZ0GnIQKGZAr0H7/UWG3SNwBoYYtC0COPhKANn4lCCl8DITMHqQ6J0nIT6HQCuIF7mmbCLYVbCbYaG57YZoFl4Tr4XYfJ5jQhj4PYYw4vYZCVPmgODs2mwQA4VM4zLFl52iqHCBvPn6RvIX6C4WzUkYpVEK/SnCBimn6NwZwBM4YWh6/UuC3w5nCR2rh1pbKS0H8gNEYGpXDq4dSAH4Qj5iChzCiQ5yH6Q6v76w2v7uQxOHkVNOGziHBHtnPWGxIMyGO4V3Co2qyHSKkKH61CKHQGuKH+pHyHV/e2GqIIRGzVMRGRHKRHOXMIHV7FSphg7a19Cmu1Z4WvUGPAvCSVEvDtAqvD43OvCLXFvC9ajvCw3DYUD4QJ4IyMfCRPCgHJPJG0L4YJ5pI27DFPLfCQOBBGZ/epwYIw5DPAOhGJyghH8w2apkI2apUI1RBdI+EQxIJhHsI4XZcI7QGvwWyGOQ9pHaI/1J6I2apyI3mRKI9RHV/U5HOXC5HsJIxH93NuHQETY4xyOAj9wz7CoEalIc/YVEnGkeUW2m41K/agjvQugi0EaJwIo3jFmw9YikCgCHiA24BiEaZtZ7eQjUQ4ZYEQz3YoQ92H8Ytqxl2pV8BEaZw5Q5/6kCkiHyozwjPHUYAao5GH9A2KUZg+WBMQ6JDJEYyUyQkVHtUfgjtQyojYQmojBo2yHSYSNG9ET8H38gcHiISNGzEYXIQHeojZowgHzgyNGHEbsAnEQg7Vo56G6kXcGnfIWGcoz4j8HeEj9oy8HUfO8HXoaEjvgxdHfg6RVso8oiEkWjDkkWp00kVBGvwVpHaw4NUzI/4R9I0hHuQyZG/o4ehLI2DUTVHQGCI5yHvI2apfI3mQ3IxOUPI9yGYY9hI4Y8PlJQ2IHGiPajZYbyiMo1aH4A7o4Yw9dHRIWqGfozBIJHJYGRox4R/IW1H5A3bBDQ+aGtCCaGzQ9oH8AvjGMA015bQ+i5mkQ6GyYxYGK3FYHnwe6HBkSbCJIxzHx3AvZUIwr4qY3jJAibTHJCOWGRAmGGAg2DUMo5wVUw9zHyozyU+Sd7JFoYrGlWhrHlpHVHMw/UoQnGTG0OnmGFOn6H7IJx16TfLHmQPrHHACbG8gzWHcw05CDIwY4mw3VHd3A0HNYzlGmgHSbuOvbHBYWq0xAuJ0xY2OHxXEZGfvOa1UI30GqY2kV6eP2HNgGxFhwzxILQ8/ClQl0HY452HVYyMj8KGMiqxDci0unCj5kY50YUY4B7kRGRHkZiiuURCj8UQyiEUSSio0EKiKUVcizOiCi6UbijXkXMioUUsjHAI3HEUZ9JkUVXHNgDXHDlnXGiUTKG+UT3GlJAKjTka3G+vIl0xUc6AaURZ00uqPHIgxyja49ii1QrPGG47PHGUYKjKuv8iZqCKj241IBO47cju49yj4UUPGVCCPHUUQ8j0UZyjd46KFb4wfGP4/PGxyIvGz41+UV43V0tpCIBVUeP4K/JP5uoxX4dUa11WwGGiK/Eqi3g8PZkbJ4ADgEJBh7FH6dpFKjpunN1I0XtIvUc11xIMPZ2usxBh7EqidI+q5kbFRADgGv71XE11mulRBWulRB2ulRH1XEqjTIy11kbBZGWupP4hA7nATUU4Ep1NjHJAzainUa9JBE+6w7pCImsVC6i3UWLFPUa112up10lUYGiJuiGjpulX5VClcBPUZP5vUfIm/UUonxusGipuvsB1E3N05UUt1FUcqiWulRBVunwAFUSt0t1HRR4QHGjlZomiPgLLEcwht1Igtt1iItmjr1Pt1NYhjJ80UVxTuufbS0Zfby0aFhT2TGS77dABmAQ2j3ujvJb2S/bfur2t/uj9yu0ZX9X2XkIZIn/av2ScJp1kty/2StGEeuOjl1kRzJrOutoHdusF0XA7ZkjUnglR87j1vIREOa4BkOeg7r1lUmsHfuiThLg7fEaA6N/sKgiHeUmSHWdSyHQCLmPcg6n0ZBsaHTBsr/oxzENow6UNk/9/0aw6netxyOHV/8vek4BIMf71zfj714MaH0Q+vsn7OeZsQORH1gk5uarzcmbcMfHdNBY16iMc16p3fx6X3YJ7IhVF6dhTF6+HvRibdcpa29exipABcn7lTxi9rD/0ueD3rwdn3rhdaszZzP47RHbNa1Xb86NXWTatXRTadXULK9XTL6DXTE7NgTh9FfXJ7zXTC7AXVL71fSpzNffizMnWm9MbdLL9ffsCMXddbpmbdbxbcKYPnX47JbbSy8Xc6L+eeGq3RUG7kfSG67fU3zQ1geKXfWmDjxfj7PfQm7vfUm6jbSm62XaWDzba1zLbaPz6rjT78U6W6HbQz6nbR1dPhWK7+fVMg2fSW6OoBz6PnbV6m7Sxt0LZSrPXVPaLvd7zhfUE6JHVG88tVZ9JfeimnvZimXvXa63veVqPvWqm5VoSmXU3tbUndHakpUD7M7SD6yAWD6WeZi6ofdi7vXW284fdraEfVb7iXRanFbXXzQ3XXbfRQ3bMfcKnpeT99ZeWKnQxeJ9leUT7ffiT7rxWm7B7YqnynVm7I/r2yLU7ja2U7D6zcvD6XRdynbvkj6q7Wmma7crb67ZS6c087680879aXW793fWGLaQV7613sT6ZU6T7/fbD8M3Vbba0/wyivYby7BSbztU8z7dU1fz9U5V7CxYazOfWFq18aazsXS7yHfQ6YLDXFaBfaUzLvXamEUzd7ctQqL8tQ97XU9L6abWSmOxRSnNvio7HmSr6I7ZE6g09E6Q0/Taw04669fYUDaUwI6ypY1yTfc1zueVLaE08eKk04S6XhimmWU92nUfQSD0ff27I3fy7o3W77Y3R7743aD8p02WmZ0xWn5Uxy6KfUqmqfd2yc3fK6ueOY7Tk5Y6eUNY6svpOy3FivaFoGva3Npval2a47d7dV997ZuzGOUfbmvifaUst9R4/hfaruhEnpEcARyLaHYL2S2tc/teym0UX972W/bQOZ2iK/tkIq/tknf7XJFx1jIJ8k038Z1sA7R0WA6J0Tv8p0eByZ0Y0mYHbtHwM1ByGk/y6mk6et10dQ6t0R0md0UMQ90Zz1v2b0mzo/0n8OYRynoCMn7lWMnqvRMmT1ur1qORf9Zk3Q6b/sxyf0Uw7lkyw7X/msn2HZ/8uHXIIV8dJh+HW27UdX16RHUjzb09d77lbd7ybfd60U4Gm/vfI6I+Ua7jrSa6fU1anEnf6nBZbVnrXanbabYD7gMw66nXk66aU5hbDU06zo08mzYM7eBGMywDmM2MUx2TY72M9OyvOavafOQuy/OVdAAuf4gguY8qavgfbvHaJn5AXz7t054blXQq8GsSZ8PnZVmUU9VmiUy+mSUza6es18DGtX/s8U61nlfWo61fSnb/vetbPUzzblHai6I06SzXXbW9IfeNnofQqmExZT6eXS1nL02kwanbMZeuQ07wLE0693a066gQ5jxuQtzJuR8ZpubNzKUv07FuUM7/9IAZRnYulxnZAZ/jDAY4TLM7BbgdzkTMdycDKdz8DHCZVnWI8ruZQZNnQrjtnYc6KTPs6rnfvRjnXzmzndygLnRyZBc1UnkBbu77neZ7HnZZ6LVi86b1kr7ndQW6V0/4DCbYE670xVmH03d7FRTdnOs1597s++m0bZ+mPQQnaEbd96Osb96us19nbXb1n7XTh9/s96DI0/emxs4ymivTi74My2nE022mm7VXzWPiNnxTOhnvRZmnw3dhmB0/cq8M23ai053zCfV3bp0z3bU3RRn03dWmg/cmK+Xf7mBXbR6hQWV7FASz6lLganFc6r0mzVunXBaDBTU0ynT0+zr29BemEnUVmTsyz8pOQ6n5Rdrmn0zVnPPmaDg01zLfszr7v04nbzcyGzMuQBnNHdinTRfbnw047nAc4b7gc+67xM6dp3c+ymEMzLbLfchnrRqhn+XaS6g8yra/RWHmm7RHnC02Oni053bE3Sy6++WTdB+ZRnA/Yung/Rp8cbVya9AICIvnaq7ys03bLs8zLrswGm280aL6tY9nQ089noczXmCU7+mInR9mNHbL7h809nR86BnqU+BnhswXnsLQU6Qc67n+XV/rJTICzuYIl7tTScKHPTo8mvTwKMvaELiPdl7G3dF7aMV8nLBYVnjs/T7PNVnnu3eV7e3bunAtQ/zxk/y6y827m/3Xe7uPfh6XPaF64RRsLBBVsL3k5B7uvaQWIXiu7JPZiKA+jD6+hlu7lvREJKXrLn93WPFD3Xu6FC9PFOhbMcMzgsdo/oQK5dn0L7k2QLiMS17lnhU93PUALERZMKPkyQW4hd+65TXhicPXoXlhTCLXPTwWTC5sKzC7l7GBTMLwXjB6F4vF6EPUQ9ETqQ9FBah60TpQ8MTph71BZgWGvdgWHk7gXV+UYWABS4W+C24XgXs26xPYdmS826aNU1QX7Bc7adUxJLJ9nunyHcwWufRFrKRbcm7C9EX9C48nCPT09eC5Ri3k+YXBC/l7fPVALis6u7i3bAXZGTJ6sDWemE9SN6i1Yp6eLYRq1zVN6u0xp6lC4GdJczp78cnp75vWyqaLsZ7GRaZ61vdLmNvXWqZvRJk1C5fcucDQy2C6l6cCysK4iyB6CCx56cvSkXPk1YXRGD+6VcxA8OBWO68PcF69BWsLnC+F7Ti0QWLC4u7hC3F6vTYYci3TtrehXcX/3RwXHiyELWvVl63i9Riuvc0WevekXvhcV6VWaV6aCznni898L8876neJkXmHeSUXj02anwRVEXCMVUXYi4YXjiwJ7CC5CWRPWIKvC717KzdEMpPcrSeRr1KOLbhrodbsbkrW1TUrYcaZ85+cqhXqaIzXSLSXtu797nIW93UxcLPcoWtvV3E0zk3q9vatADvYKKeXid6RRTSXzvYL6pRVd7Bgfemw7eE7n03rn284BnO83Hbu8y9mYcwAX3s8SnPs/VnobY1mdHZSndfVAX0XZBmRbcb6xbW7m403r9Pc4hnvc+hbfc7mz00wKnVbUKnB0xrb8023zI8/vno80y7S0wWCyM377K05y793iPbeXcrmkC6umRJUz7yC1KMUS/5r6C42bGC1Fnii4enn3tz62zfK6crb0XrU6qWb0+rmn8+haX80taG8cAWonUPmgM3bmeZX/nyy21nACzqWP8wlLjRd/m+sxAWBs2BmHSxmW4CxD7p84XbJCz66OU6Xal8wG6e3qvn08+vna7Zvns09yysfbyzQy3vmCM+Ona2ZKmSM9GX483Kmz80nmIc9Rmoc3WmhDg2AdDgHNWLf+ZeNTccJ7Udn1U0aYt5SnICs8qWbU2rnvnRqXNc1qWJfR1meyxzK+y1r7jXUaX2y5XmTLu1nknQPm6s2k6wCz/nByy7dQfRPmo0/SnrOTGncS+3gBqAr0hiA2XzSyAWsUy2WvUxnyf4I7NUAPUA2tvUBMAFdQKtnlnA9vT0mgHlNc3eXLOdf1rudXPjhtWIqgWa+XktRNrwtdNrs1cVnvTdqb+FcubZdSlaRiwrrsXVNKCXveaSptpajtb4a9LcVaPzZxTjLSULTLdVb2DS8q6rdEaKdaBbbLfOB7LfN6/tf5b85ckl6K3QTdrGCbNjUyXtjf6ahi3DqOS/xbSDZE9srYcrXs54bFKz4bA5SpXhVYEb1K9xSxreha2DQ9rarc9r9KzwbGrfEavta879PVyWmjcDq3y/xWptSbLrsXvK1Zb4T2KwESeda2S+dZfKIiS9aB9e9by7bwrRKwp7HK+HTlPWnrXK4rqISVcmdzYAq9ARrrJLcXrpLWYCTzVAr5LTiSLzV0a3LdcnORdNKKNbCaqNU3rEzdgqVLQ7rs0oS6R4H40SFWQqvdbsSfddQq/dbQqA9RcTg9TcT69mHqniRHqVIFwrZBBWaEXrJ6vK7DlfTaN7Bi9VWJvfLrK1fVXUMUJakzU1XZFS1WJLQEApLTrrZLaeaK9b1XFLfBbtzVNWUFepbwzcDjDFRabhLX8n71a7jEqY9bIUzfK3rQPJnFSPBXFckr3FSMFD9dPrMlf4qz9YvrICRvq+TVvq19VEr1SavrqTZBWDIq4Bd9XqS0a54r0lb4rzSTKSF9Vz0GrgUqQlkuaASSubJK+tliNc/ruca/q3cdYar4KmSGCZ7T/8yGSya5Qakq9/EWjX5LOlYObKLVuBwDULXIDb/roDagxhlXplcyUnrb9ddXhi9zXSyfDkWUxWT2LcN7OLZdWqqzkLnK1JW7qzJXFNbCXw3odofKzQbzlW+aGDTjqgqwYyQqx86wq2uBp5STrLLVFXxKdgzYqwIb4q6ZWNVYiaDJYDK9VfcaDVTIanjU+Su1QUacTe8bijZ8bz1TtTL1YBS/jQ6qTqfE6Oy1Mh9DYlTCVeBqNzIoDTDdkBzDfbWT3hmb/SZdS7DdEqHDS5anDdVSITccJ3ZdCbq60vjO5dQaBVbQb/K9jrAqzcrgq5pWm7T7W/a4Ba9K1zprLcHX7GXFWzjb9qETSNTrjeIbbjTHXUTdkb9wLkbjVUnXsTWtTcTcoaz1VarM6+UbiTQdStDWSaATfernVdDXPy1VkZax6r/JRRbuleaaJq63r7dVFToqaLWC68XNuTTBLeTZYkINYkynyxkXZXiVhA43VL2wA1KFjSybWpeTKKqUJXVa7mrQpuVWzU2JWOaxJX2S9bWQzW5XhcSDWrdatY11cvWkTWvWPZjuqNpRibnjbvXj1QfWLKUfXVDRTjT69nWSTRfXGceSbATRgXa66ZrPTT8XYJW3WGrFCakdfg3aRSk9GACkatVQDLdVWQ3Y62iat65Q3E61iaaG6nW8TenXj605Ks685i7VVUa2G1fWvLRjKSphA2P1fVKv1YTSmpb+qSaWybw8V/X2zYkzQNdVSjDeMauzcJWAJT2k2afmabNVzS6LfZqpTbPSZTXwz1jakLFzTfrxKwQbVzfrXNTelakCxsayDaMa5va1azPYaaAa38nTTTpq368abkFbbSH1fbT7TZe7HTZyb6jS6bRy2A26lSCaRNbZWIdRVWLqwMWLa0Ir9jeE20rRnq3c3mryNbMX4mysXEmxDX7dSk2EzW/Snq4DW0LTcXgTcrW6VSA24S+mtRze43xzeKbwJdPSfG45rEEs5qb0OCn6gXDWHFQjXdDTBK2K1PiBtcgY8qzg2BeRpaFK73WXzUVaAq4ZbPzSPX5SdpXwqxwbIq9PWGrbPWVVfPWB8N/Xya2HQWgtWqRq/p65pS9XESQYCFFbUSZLWXqmiT9XYFX1WeTKzWEKf5aWGT4zym4ZB83YcLY7vPzAS+wWgvel6ji2F6BBfUX+C40XvPdCWviwyXBm1WbNU1270ywx77lWiWzq0anMS3JLCy4kzfbdN7bC1gWCSw4WgPdwXn3fCLTC5F7cW1CXKS/sKxcu0X13VOXh+tIXFiyt7Jcwk3yXpDycBRKWdvcy8BS5oXzLLsXkve88Hi+i3iS5i2jBQ27yS3l6+W/w9WBf567k5UXWW7x6nCxy26ixEKcW+4WURS27vC8bLfC0EXZBUh7Aiyh7lBaEXVBTHc/ixoKKiyy2H3aa32W88nOW64XuW9a3UiwV7CWymWPNSV7qC2S3aC4x6cy57aaW97a6W6/yGW3V7biwF77C362uC88XzW4kXsW8kWm3RcXZha0WaS4K3lZSbWfTf0XJNTDq1TVzW3STbWSXUE8ixhMXyhcKXrSe5W4m7NKXDQsWOVUsX225K3gedK2ihh0LtvVKXDFTsXARLoXjW9m2Qvbm3A2xa3tW6YLdW54XDzga23cdO3fWzx6c25l6Ti1y2zi0W3LCyW3xznC3fi8AMO6+UXmW0vzZ208Xd26SWIS8u2PC6iKWBSqWaPSS3ES7G3kS/kW7zoUWmC+nmWC1E29i1m3t23O272y8myS4+2bW2J7S25w2q8DC8ZKwyXYrWLXbZVU2a26yXU9S7KGm0caf61VKsrV230FfK3e2xLnli6urVi2FF1i+S9T3dKW+Rft6BRUd6FS8JdXnYKa769enbU9WXfy8/mtc1Vmdc+/mpfvrnus4bntHcbmBsabn7lbtagKyC6QK+SmiAZpy7S9nbUK87n0KwXyYM2Dmm04uKF8/i65y+2nA3dXyu0yj6N832mMfeuXc08GXh0zG7KDruWS07HnSM0eXT87eLz8wunlU8+LVU1S3imx2732zG3ci5unv238Lf2/mX/29iXEq9T8WK4KaH80EC88Zx3/y9q7dcxJ3nvVJ2P0zJ2YZkU3A2V2XW83x29S82WDS9r6snQ7mSWRZy0KzhbnSx66TS8zo3S+b6VxeFdk052mm2/p2Vy4Z3Q88Z2gy9j6Qy1rbtyxZ2D8zHmj83HnWXXZ3+7aeWuXZDnEy9m7r8x3oby9ks7y5YkHywI6edFZWPy7B2CbXayfyxF3ay1x2rszx3AK+l3P8wD7+y62WIXfnW3m52WzS7dmLS/BXiK13mcu2Pm8u8zzFO4V3oMy6WomxcCtm5rLj5ZxXpK2anBrLw6mdZNqiy+vj0q51TBTYyXTa8yW8DeN69aw239m7bWsrV3XBCT3W/ZUpW/K6c3B6+c2Pa6PKva/y7x6wBaYLVPXIzDPW+DSHXmrWHXWrWZXyCZQTLKy4TdjIOgwdbw3UG+Lb0GwWTQm/W3o6RD2sK2RdoeyLS6KXD3fK4KrTte+b3a8PXPa6PXQq2Zb/zRFXhKcBaHm3j2566HWF6yQSbC5vK+K192BK392tsplW2sn1rtmxxWdZdIyCq73qr5ULr4a9Cmgu+827K0D2HK9xbda1bX6m5yXSNQ1Wa9e5bdzeJb/mwebFFaXrIFeXqeq2C2/qz8mBq01Wga8NXWm922eRd72kmx/W8FTNX5y0sT5q27rSFR7ryFctXcSb7r/dfQrNq1cSQ9TtXw9RwqDq1Hqjq18TTqyV2UO9W2WS0laMO3xbRiyz3be78mum/nrXq0722q4eaOq+iS3eyC2Pe+oqq9f9XOm2xqVCynj8O3Cag++DW+m5DXzFbzNYa3r3+9Y4ruSUPqqa/vrUlaKSp9T4rj9QzXAlUzWFc+iWhwGEqCa8qSiayViSa7Ert9TBKp+6jWD9bP2j9VjXT9YzXz9V3tIW+zX6e3W2sG1b3MzS/r00AHbBa7zXPTY2nf3cA3mOz2aH64AaFM/LWX65ugla6/3McgE2YDdmTNa6MrtayE3b+w/r7+4MhyyRgaS7kh2cOwX2za9U3ze5bXkDXAO3u0ynZK+tZDm27ina33WXa/paAjcj3+e6j3Be97XhezVbbm2L36rQZWYq1L2CezL3hDZo2rjSQ3DJSiaTJRQ2E66UwXjUo3PyZDSTcRnX1G0w3NG5UbSTTo271ft3Ja1gwi6zBKS66MaoWySqGSChSq62WWDu0VmX+8bLbDevrG62YymVefLiKWcgBca4ahG/JXCB8c3CrVoyke+HKjLZc28a9c3fa5j2E5fQPA60qqjKyvLRq0kaiG8CqV65I2W1TI3N6w+SD1QIOoZco3D6/ibRB2oaNG2I3JB6w2fMew3r64+rRmw7Xpaz3TZazGT/+50bXLSH3O+30b8m8l3ElH/X20wA3CsQzSnGyx2pjTlSjG1A2TGzEAiaSTKLG21KEG2sac1dHihvVW20B2h3i+4Gbaq2X3cB7qbEjXyWrPVfBfpWIbAh5IbyG6DKLJZia4VYIOIaSobB1UIOtG1IOkh7o22e5zyaVXXW9B4wTnDXE9zBx7LhGwt6I68Q2o61I3uDjMPHjXMOqG4o2Ih0IPlh98bVhwkP/jTIOOrVzhb6/N2ah++rZjcY35jaY2f1e4sWh/A3Ch3QzWrHY3kqaXX+TZ/3RtdRbgJbRbJzRBLGLTObt5MniOh90Wgm1LqMB7U2wm+D2SNRubgeforQa+DyOmwP2q+3GazTf1X8hxk2bTQ2M7TVconaQ6bXaXOZCm2/qH1dw2O6ae2mCXn3kO6KlKqziPOa3f38R2p7ba8MPILSSPIzTYLK+yaatNfGbX6703Jq4P3ZB4q6rDRyOPTVyOxcvCOENZ42kR7M3pzYxKRa+Dq68zqCQ7ZqW/neL7ou7x3HQfx3rcw9nQK01nwKyqO9U6aX8K8d3CKx6nbcyRW/s5d3aubFqCu/AWJy+RScK/lB0AG6PdS1t3vs16Pzu7aWyK2OAKK1RWaK6QA6K+T2juY92sqwfKcq1rLXu422P+0bRUxy1Z6W7zXN8f93RtYD3uh8D2xvU5WsByKPuK7g2Zi1sPZdumBrB8pXEe7z2h62VartWj308xj3Re3Azxe4wPHm59rpe7yXftWpKyCbnLSex92Uq4r2qe9yOae0V66e/hqYByp7iDXWOkvTN6CB8VmiByc3bB+2PyB52OWDWPWaBzpXZVQHX7m4OPJe082RxyMOxx9R6rK0PQ0q5oNEG7B2nuzs3AiafKFtDr2IU6P2oU3fLsO1oOlcyJW0GwKOda5gO6m7WOtTeX2Hq41Wpq7839zXX2Xe0C2m+4/SYFa33wW+33yRwUPxRz4PRh5ea7e4NXkpo7rvS2utXdQtB3dZ7qtifH2LzYn31q8n3GFan3tq/cS9q5n33iVyTmVV0PKm4X2Qe9WOIJ0z2CRwJbLkwRPnq9X2/m1UTne4C3Oq19Xuq0/TfqwCJMJ0qPQ+/Xqvm3MXmXv33FJ532vAZs3Cq3Yr9e2s3De8YP/AAf2x9TTWMa/P3T+9krf9Mv2s2ev3AG6TX9Bzv3CaxLXVRxTXh9cjXR9ePr0a8f3Ma7Prsa+f2sOSzWfLdfrsR2BPcR4z3gzcM2qlU/3puzsPORy5YEvmLlRre923Nc0bMh4/W5a+1khzT0rVjRlWMR+vri0BrXC0ORp4DVWOLezWOcXmgaa+cbWkB7yOUB/yPUO0X3Qe5b3IJ5E3081/qWm42O5bhz3vDc7W/DWc37Bxc2Be1c3oLRPWse3c2cexL24jcwPjKy1bnGYVoJhwEPm1dMPgh7wPbhwo2Fhw8Olh/Q2VhxDS1h4kO4gDUbi6ehaFB+2mlBxv2Jx2dSK6+Sqqp9Xm6p/jb3TaU2zNQ3XWJUYTHDUboDh2YONx6z3NB3IP7bTuObB0Kq7B6Va8dVQP0eyeObm7pXxp58Pce1NPrxywPRxyQSl6/4POB9HXpGxvXVp1tLwh2aqlDXQ3oh2o3Yh+IP4hznXb1XnWPh1pPvh7Bqf+x0rsh5lOFawpP369hOEJf0bih3zhShz7n7sQ43nnc5OXR+qmGwIY2/h/UOAR40OzG8CPWTa0Ocp6WOoDcg3OJyBOGpzxOyp3xOIp6KOWe2GaVJ202ZW34PUjavWuB+vWeB7MPMZ9Q3Np3ZK8Zww3bKYTOzpefW3h6TOfpy5P7bToPfu3sOW6/OrDh19O8O6wPTh0jOtZ1MOMjejP9Z2EPDZ9jPaG1+Ttp88Pdp68Pc6ziq+JVSa0hzXWr4PzOGTf8OmTTA3mh2LPQRxybwR7Y3hjfY3oR1GqqhxTOWab2lJm2KaizVOaUR4aPZTQE2ZZ7T3QJ9AO2S7AOWp402Hu2Rq8G2rPA+6prpRz724J3KOqR3kOO+7SOdh9k3GR9xqWRwU3AG683fp8I77Z8LWy5VXPFxzXOMGwz3hR/xPlZ0MOcJ9832m1GaaR7GbgANpqem8bqsJ/3OYp1w2NR/FOY593XcLBM2aLbqOJTciPUNQs3O6TwrUp+0r+ze0b9crkORza43a6UXPCzXZrizXM2mLcV2+R7xKsNZW2uJz0PGp7xO8R8vP1x2KOYJ8JOu58dA9za1X3q+1XPq8C3UJwbqNFcH2+52Yrv6S3OPKwHb/p62O9x27WOxyDPhp7HKIZ2ePse9DPJp2Bb9yc83bx7L37tTBbnLXXp1JwzOMm55ayZ3MSa6L5bjDST2YW42n2GRCOkVhFbydVFbYJTFbap4BPzq9xPSp+BOoF0rOYFyrPNx1yrPK/n3im0QuEeyQuDLQNOUe+Vbux50W1++DOXB32O3lQOPoq0OPwLYwuJR8wv4JVHP3GSpKvGb1b10s8BGwuuDxDqt4d0i2CsJY2DvFx2EY/fhL9gA0FCICRKPmxfLde0VW9J69aDJ51O0dqrnFu4/mOOyt2ou6imYu5t3ey1/mHRzaWv08aWgF+Ho+8waKBxW+mStUJ3Eu70tfma1qDfQGPxy0V2je8iCK8xPOpkKymzfb66Ku3ZnXMzyndOzV3+U2j77fbIujUzhn087vm8fVHmO7Z12pU8fnjbb12A/Y52aM3ryXO5ov7p1kXo2zkWN08UPc87KNKW8suk5km2ZXYF3ItSF3YU6Vn2O8t2Ls6t3X8+t2YK4aKsl9t2cl8J3ZOz3mzc9BXLXZbnbR5aWkXTimO8bl2/R4Lagc6R8gx6b6iS+V24gEhmI+yhnqu6mnau72ms0/2nGu+HmRUwWmxl+GWJl5GXrO4eWeuyyC5l8nnL80j8x7TjaABlNnh2U5yrHXNm2M+5yOM0tmuMytmnHWtn66fxm12R47QufV8wtk18ElnuypM2EmZMyeyb7dEmlM/fbW1o/a1M3ezX7akn37ekmdM+3Jv7aOtDMwOjv2QUmR0W39AOVZnykzZn8fFUnnM3sCtV1Um10bDA2k9P9vM2hzfMxhzukyNhAs7hz51gMnX0EMmwsyRzSHWRyii+nmqHc+iZk4oCGOfQ7ks4sm2Oc/9OOZlngMZw7QMa27eK0pY+HdPRx57bOBfXmOFuyq7wu5UyLl2ku38xt2bRxl3QC2d3DS1k78l3dPCl68ufvbBWrc58u5fd8uTOb8vLRf8vJ84Cv6l5OXVoMSu57c5yF7fNnKV4tnnNg4752XSuSvutnGV+47BMy1HD7eyuoubdPBl252vy0ku41+dn+XXWXw7UAWCK02W011l2wK5muIK80vXR6r6Z14Pm512C6Yx1+nS19UuIM8UOoMzdaVO7GmSnVWmzyzWmCFp1yxW0dBanZVY+uY06BuS4aI+206HjB06JuadKpuQ8Zccz8Y314M7lucM7iczqNSc5tzyc9CZKc/AZ/AIgY5nYdysTMNzsDM91Gcys7F0ms78TBzmPZlzmHubs62DFSYDnRhujnR9yTnY9yf5CLnPuQDzAF9muZC1p6WLlKOYm8O3UhNDzcHh9aWZxlq1S2VmUlwmuLR1I7rl28v81x8vTu/OvHR4uvnR8+W/U6l2MlymvIxzbmdu96Pu8zuuDHTUubu4GOq17MzDi+6WDfl6X7Mx2n3RXynbff0vBU1nsNyzj7W7W13AfgT70V112bO1iuNefOncV052ky/EuhHsS3si+unL3l+2Kvb8KrngwWZQVmXE5gB22p+azXO7xKVS6x3vy8kvzlxOvLl/WXV1+6PZ10RX+N7kuTc88uxO0nbGy+uvYt5uuM17aXsnfaWnc5rmXc0evcS2V32l2Cv1N10vNN7ym9O30vMMwMvl16r1hl8Yvm7Uiutyyiudyx12zN1MvuuyfnsV9Zuz1ynmx+QSvc3ZLo78zGvTsxUzx1+nnJ19qW0u+Ju7l1GOpN1uuEt1muh1yl2juxGOZt5JuHlxUvHXshWAc/l2FN3Uu7u2RultwlO83agXC3ee3kW5m2Z2yB3b2/gX72/u33i00W9Wy+2j5/s8ES552Nl+S2m7TsuCl8amCy4BufuziWmU0B2rt5wXQO7dvwOw+3hPSu3n28u6BW2IWBvXsm4M+qdRW323xWyR325zRuJixR3geVR2J25UNFWz0LIi6q3gS+q2nk7UX825a3C28QXPi5cW/PRu2UW/sWYiypuydys9Xi/dudW0+3bW+ENJBTCdHW4h6AiwoLXW2h6VBdQ8Iiyq2SBSTvyBSzvjC2zvg2we3qdxR6CW/ZvTDq9ujee9uXN+bzvN6z6E21K79l4O6U2yCLfBcDut26Dubt2CW923LuHt3i2nt7DuJPXY86S9/LMR/ZXr+8uO656uOIm43Oly823ShdvQ226DzKhW7OEZyI371Ut6r15RuMBaKWZc+KXR25KWuhZSTJ20TuJd2i2pdzUXWd1i3KdyG3zi0e2qSw2d6d5duTdyCW8C+bu7t5buOd1B3w2y0d4vbIp0C6ovjd9e3rt6CX4i217X3UJ6yPby3V2/q3X24K6tUxrvfNVru88zrv+3XrvWPYcuyiyFp89/XvTd43uSSxDv2d5B2w2y0WEhWW34dx0XV+wxvQF7LP5F1dXFF+FPVPSougd4HumF8HuQ92S9geat7SOxsX8hlHvNvTHu5W332ZS7eA5S/R2hLoZBTvS9vld1cCR17GuzszlrE11xu817cvgK9kvpOxpyku6o7wx7F33U/F2jc5tu8gYNnoCxdaAt1vMlO3aKJs20uZyxb7Ku8vmK7VCu0MzCuM06uX4V2raTO812zO/hn2uxGXJ06rzffQnmTy6euBu+eWhuxw3nGzbhM8+sve903atl/itB9xMm8y82aR9wbuFJbiWml5GuWl4Ouat5kWTR2I77U6L7gbf86rR8murXbxuO8+lvsu5lvFtxIfmbaJvrR0ofU12lvXvfNuRO1lv5O7tvctygeutWgeQV0VvwV9p2Fy7ge184Hm6u3CujO8Qemu5uXWu81uKD2iuqDz77y07GXE8/QeEyxU7Ly4HsxuyKkJu88kpu3/qeK93vSW153Nl/3vtlzwf2fcPuD0/9uix8WW5XUxuNmY6W8t99kQ1wJyKe+VlgV8lPsjzTK2O0t341+Fu/9y3mxN7oeJN/aOQD3E7hOeJ3Ml0Af7l00fgfZAWTD9d2zD7d3D1/d2/NxHcEW6yca99Gv6vcTvk9wYXpdwkXZd0kXM94e2ad7MKP9xvLVl29v2Dz5rOD4kfuD+5uifp5uixWkfhJpkfGW5e38S5PvC9xi2Xi+nul21DvOd9B2l97B3y24ju1O30dUpnmryXufuMdycYsd5ilZW+O3rdQq2b7le7lWwCWJ91CKLjxq2rj1q3wPQIXrdx3vnt6/zDWz63zj6TvU9zLvrjzCeeWxSX4T8u6ed/B6+d/4X5BWQ9hd+63Rd163E94sLJd9Me0T7MeMTx17YT+3uYd1R6Yj2wfnN5sfXbdsfs5t9vs179uAu4Ie027iW69+CfUT3x7yd3MeC2wseFd0IXadzB3Sj6GMHdwh3Am87vgmwvOVxwMOcB2hnxi2KXJi3c7pi/Iye+2NW3pfSKw933oIplLnL97Rv4ptZ6ti/K2MzuLvKT1Mfqi6Ke099Cf6T1ifod1zvc98VnN2yieU986f0T66fW9517sT0yfvi9yOzt6vukD42mfT8Ke/T2a2F2xTubj23uQz56ebZzzPJD5QW1l2yeXbR86uD1yfkj86vUjyanR973cJj0nu0vXGeA22Ke6T0GeGTymf7j3L3aS+IXpPbPOkC0uOpNYvP659AuoJwfu1F63OCO0H2BSxRvTTwxdSR1K2fjxrPrT2O2493SLWXmkIn99lMGO6/umO64Awj3mMIj4yBeNY6Z392mfhN8OvKyxUfQt1UfxtxFup192W2j5J3gDwl3QD6bsf0ytvID6UuFHfL7+s9tvx86YfOO3kfDt5oeBjIVuMDx0vxc3YetNxVudN1Vu9N9VvRDxyhRly8txU0Rn6QdMvZU7Mvutwwfz16nnky21PUy4z74j59v0Ldyejt7yf6t75v6t+amWU+IeIL7zOv9yNuG87IfJHS6zajzof3l3ofPR3NuMt3kul12ReRN/eeLz3F2rzzAebz1tvtvm+fejx+fzD6Y6Sj0DdQVzYf2Z2Vuel9CvKt9uKsM8x66t2vuoL9jdxl6ZufD9KnbO11u2QT1u8V31uQ/byttDiLMuYEbzuZAIMODxyf8i4ulclAIMapsp2LVmufNRhG30L1G31j9me8i25vCGXmfX4vhe194Re19+U3xj+Wval0b6Dt7ClGdUUeGlwwCwyWF2f946Waj86nFDwxeGj4J2MnbAf4bUluil2zK7swJ2yl2le+L3AfhyzlvhL/0eGUwZsz5zD341ZwRmK6WXWKxmP1e893BtTmPme0Ff9ZaGvFe0+PArC+O5Tyb2Kx2b3Qp0KOuz8ouez003vpxouCl47WWxzovAZ/uP9FxQPDF6DOex6YvRp24P+xwwOrF1ePhx/DOj9zCm/LST2LK9OOFe5Fe5x4/OK5T0Wjt2GkuLQNfMG0Ne99yNem51D3dz6A2Vl9ovue67W9F8DPgjRValr84OVr1EaLxxtfYZ1teZp4T25p42e2r4UfV8T93BK+0PRRW+PNe5+OB8LroR+9Eux++s2or0BPY9edfvz/Qk5Zwouwp0vPhr61OiLxsbJFQfPYzWJaC9bX2UF/X20FyhOzzXJP8JzKOMm8pOA+wOeZLBwv0m2YrL9RVeJLqROo++ROY+5RPvdQn3Vq0n3ziQxP0AMwr0+yxPXiVn2PiYZOsb1iOoB6qe3d+qfcx6NeK+53Pkm6JOEJzTekJ1JP0FwzfPe/JPsF+Te69WvPVJ3320mzGbcFeTOpLyjfdJ2jeDJ13TKayPq99Yf2Z+0aS5+xkrfJ2f2l+3KS8a8vq7J7v2t+3hTN9Zv3uZ3ufrgsZPPJ7TWfb/TW59f5Pma1UIr+yqeb+2rfMOzwlgBy5Z+a8Vmp5w0rBHURe85z1foj02zn520asEm/P4yWAaJZyr28p2AO7gHAaVbxneS+5N7Kp1Xbqp9bLN9+Av5ZzvvCb3dfibwFf/sdMYtxzSXXr/3W2x6QuDx+QunByNPXB/9eJp5eOgbzYubx3Yu2B2I2OBxcOgh77ObhwbP7h4HPIh7jPVG6bP1Dcw3LZxHOJ1VBT/a4tf6t2KN4KWXXLp2oOyVRoPxr9mu3aQ/2npw5OrCUYPXb3w22Va7O+zwQudz14b0dQDOee9Pe5r4eOQjUL3frwvfzx0vfAb/QvpKSDf3Z2cPkZ9vflp7vf21WtP+BwHOe1UHPhByirQ54jKWG1bPI53UbPh1Hfnr9adSLVkP+6TkOa79SOcFxbemZ0UPJsmzOSJ7BLOZ2lTeb9sPnDPHPk1UnPAR4saQR5mqT5xbLI2/KbWz21P2z7W3M76X2NTw9fL98SOCG8e7xh+I3Jh0tOfZ3rO97/7OD7wQ+j78HOTZztPSHxfeSZ5HPn++qPHpzw3uRx9OyKYI3jh/2fe+xjuFpyjPLh/D9rhzg/97xtPD748OQ54SaXh8TPtDe8O08dHODG7jKvcYnOCqSI/YGxmryaenOqaaIueTdnPlB5UPYRywfxm5/OR6VfPG6TfP9R2XO/G9FbK5xvvq53jft9wTfbr2uP7r35vmm/guDT/qaxzx3Ot55prKR6k3FR5wuzFXSPB50gAmR7k2R51Q+2RwLXrH5FOym6dfyx2AvKxxU/Br+7usOxjeoJs3O7zWzeXH6MdN5yw/Sid3P2n/vONJ4fOyj0M2c78zPf9dqOCzYiP8nwxa757Y+Vz2/eLrxhee9+yfcz5yf+bgWf6t75ekD/5eozz4Di7zkf9106Wwr0lr2r5Ff5xV/3S71If4UzWX2N0imwnQBWblyUuNfXlfrS48uwD3eeID1xeoDzxfylwVeqUz0f/R3tvQrwMevz+xfZGVEgUDHhWot6tv2j7NuNt5i/PMORXKKzNBqK7RX+MPRXUC/Dfcq81eBJyweCjwRbCx6m3ixyrX850rflTyFPa523fbqy1fRr49frnzjfJr5z3epwPXZr59eNKxQuWF39eEH7Qvl78g+ILbhO7x5xKJxwDrf4kDquXyaYSlCdfjq2dflb1deRX/0Os73VXIe0A+Vj+ISJ7yQPVK3z3oH99f6t72O6B2tePB5Tqmrag+g9wBPpX4deAX1DeMjw7Our7Dff9ay/sx1r2SNd+OVm7+ODe/+P5nw5hSn3PPynzU2Zn+rfxX03Otby0+Nn4gvHe+JPEJ5JPG+3JbZJybemb9relJ5bf1Zxzebb4haPLbwvzskx85qysTo+4tWqJ4braJ3QqJb0HrGJ6HqM+3Le2J9Hrc+9jfCX/VSM34KObr7M/re4SOybzs+Kb9kAi31fTUF673y32hPDdcw/zbzeaVHycOMFQ2/7e/lMvhw7edJ89aYlyVXEa5P33b9TWj+97eT+37fLJ7kqbJ/jWQ705Pv7+dPNSWvrtSTe/p+xPrvJ+ZPH3zjWU7/kqgp2zX0767vRXy5Xdh1FOi6FY/P72/2i7wFeS761e2vnQ/0pzTOOjUw/Fa3XeQBw3f1a7AaIByVPpnzO+Bhx3eSXV3fer5M/+r1a+aqza/BhxK+935YPtx1Ne3r6QOSrRdqlX3PfKF2YuvXxYv1r0HXNr6vftr+veTyZo/Fp8ibdZ1kaMZ/o/fH4Y//HyY+SH8OqyH5feNm0Cmb7wSrDDTnOBF+XXn72Ya0KaRf0z8U2C747Pw703WOJ7q/nZ59O7X2NfCF6x/J77ouyB1A/Z7wgy4H+YvLGQDfBPyveGF2vftX4jPNZxI3tH9wPpP37O8jfg/FDYQ+nh4E+w58E/L66E/HF/Ua+H02Pv+2lPf+0/WQDdh/6Z1zfWH1GrDn1C9OHxpvyh2MauZ0l+up1zBBH4yaYn8LOgR+mr/1SsaJH9Q+xm6LSUGydXx30Z/J31vvM36R/6P0o/an7W+254NSNH1vfN1TrO0Z7o/vH7J+j1UbOPjSIP8Z4w2iTeffMVap/mD0FeTP6Cb9h63WAHzZ/D96J/B25vfI6yN/UZ1cOVp6F+d6wY+Iv0Y+iH6UaT6wt+JB7F/pB9bOEv1Q/Svwku455E/IG3JBoG7E+U53A2ANYk/gNck//66k/zpyV/BTcc+PG3k+Zm+c/pTZ1lin3lOZH0Re5H+h3rX4o+Nb7m/VZ8s/DT00+hJczft57vOFR9s/OnwZqB55xqh58yOEJc6ax5/B+YP2M+zXxM+e71M+uv52fZ37a/oJ0x/Mf40/qN4e/Bq902Cf7BPlR9T+4p3l/Sj+D+pmyXPb5zD/Ln3sDqh/fXUv9TOGH7TOAB0gtL5wiPr51D+UNZL/AydTKQFzVO2v9Hfcb51/p38z/s3xy/7q4Jb+fxSPKbzX3i3/rfS38orvqy32t373Od370bhz6MaHX8oynX31OgZ5x/HB65/57+5+55XQuvByZWiezx/I6Gwuq3/m+m35LoULZSauTWB+VB5OOhF5VkRF5nOegeIussqmn/GzPzkBxdekf30O6P6j+c331/JX3Z/ZX8QPvfwq/ff0NPuPyq/4HzQvHBDDPNX7Yu/P44kHF5Q+I1VJSerRT/drC0dS/kZeeJiZeMfmZfs85rurL6ESQlh5k7L6gfHL3tpT95y/Yjx+2sL3G2KW88+1968/dl+8/dl4FeiW8FfcX1Pn6l/8/Ib6aZq11LO2Lbr+LX+bWjf2qeev2j++v3m/1n6Jbl31Tebf0YDab+u+HfxW/0J173Ob7bfd33bWT15Nft1OYD7ELjNekD6Kvn7+BOoB/nx+Hn6IPl5+Lf6+fglW4f4kMi5aWX7//jH+cf5aSmykOpjwAKYCEfbRvi92sb670tZeUS5O3n+OSOwRLns+jm5Znt5qOZ78ut5eDdy7HlKC+x77psWe/J7DusIeKpYwFmvuB65lXvkeD475Mqp2SDYX/t3eZT6G/tdexv53/iX+JN4/yo9Wi76tPlb+Yk6rvh/+yE4bvpgubfZm3goBAAEY/h7+tSpe/vK+EAE1/pQOyr4RGrABQf4aviH+s0506iwuEf5wWloBRP5IWiy8WAEVYjgBsHj4AbYeyUD1XlzqbL7EAWfKpAE/jqjeFAHckhLa01pwpuqWYW4nnglecAIW5jxujF7QHhi+zR4COq0e024UvutunR4gZkOW2W4Kdn0eim5hXo1+6Q6RLoEB5AFJvqLqxQ6qymr2PgExvojenu533mPeFM4GAVPeH17GAQtepgHmWuYB7yrcGggBVgHRbKUAYfrBLgEuCURBLn4ubYL3WJ4unYKDAYCwXNjx+mAAHuQRRkOCcMQwsNeGE4LjeMKEZURIdIgij4bQAGEuVfrjAU36cgAreHv4j1ibgs36OHQ01GO0ETQd+tE0FPineDaUHSIKBtaG7TjSdOTCynSj+tYGFQZT+oIiGkYFhjYimrTdRn8B7YatgIDGDkKMJtyGIMYWRr0GVkbtRoqGSbREBBcG5UZX+iwiMIGzSOK4x0bKIo/69zTP+jhCigbv+o8BTaiKIn7GP/pmBhW4krg0QnRCFQagBkiBeIEGOBCGNIEjRrAG90YSVHQ0hIGvQmgGjIHuOJLCLwEpuApCRUaGOAUUI0ZsgVSBBMbwSDZCqhQjRtQG9zS2RgYi14J/AR7GOMJ/AZ5G7kbchoqBE5Qoxts4aMbmRv5Go8JShtai/nAASGVCABAZQukG6niOxoP6aAQgxpQm3IZygcPk0cbbOO2GLYCoRi2AKoEYUFW4SQamEFUG4dRuBnnscgYP+E84BobKBozG6gamhkaGGcb3ONSBf7REBDyG1sZuALzGWUachghGCMbmRnHGzoHLEGqBuFRk+G6GFQYOBuUGwQaDBi0G4zQRBh4GGQYxBlkGHMLohrMQiYGgFGmB5kYgxsRKf8JAQm6BzgbNBqkGrQZFgSaBJYEhhqSoc/r2gRqByxD1hkxA1oEYUJWBERBk+I2BAwaftPmBzBS1BlQEHMLzRp8UIMYtgIOByxDDgSxAf8IZlOOBoQaXVLq0W8bSBFyGSBQLgbaBuFTthkxAqEZMQP/CG4EBlICioJD1QrMAjULNQsGQbUIiqLgAXULYQu4gkcbzVMxGQ0J8+GMGM8J8kJMG3sawgeYGI0YLBuyBKIGouCNGawagQbHU4rjExsdCw8C8gbSBxrTRgScGa0Z9NMyBXIF3sFcGvIHlgfL4jUY5Rk8GUEEGODMGhjjRgZ8GMMLUcLyBooFdhjlGwIaziKCGqEEVNOmUI0YwhuHYRUZshha00YGUwkVGc4Hs+MxBzMKswviGe0K/AQ5C/wEiQYCBJkaHgShQwMa9BmDGEYYQxmxCrwb1hq3kCoF/AZJB/hBIxiCB1YGgFL2Bh6AYxq9EoiYSBuImuMZ1Rh1GutSRgU9Gr0KkxnGB2kYJgb0GyYGatILYDkGwQSm4qsJ6hnIi/oEhgUzGGgaeQbiBwoEJNCwGI0axgbgUOkHIJryGdkG9BimBFtRaQRbUGYFCxlmBosZRhpeCh0ZilBaBAMYOQvHG6UH2gY6BkUFMQGiBr0LEkFdQpYa1Rg7GHYG9QslBUzipQVaBucaZQQ5B2UF/wl7GEcYEhjhBg1TDgWJA0UFiQLWBOkFMQGVGOUZ4kHMARUGRhqaB6nDNQeyGrUHtQZ1B9YGqxgBB9ajdgQ5BOkEtgP2BS4ERECuBzkHPsCWGesalQQSGs0EOQuocDkGLQX/CK0FTQY1BHMLlQfOBDkFqQRbUx4GngfCBvUG9hqKiycaDhmnGo4YEhqdBJIbnQQ5BV0F/wvJU7hDzhkTwlsLWwjr0VhSCIke0WgROwuuG/0SbhoDEmjTJNHyAe4awROFGLfqjtMDYjvhoQeX4wHhxVNlIl4ZkhBHCjwDjgtHCk4JrAfHCGwGJwkgiPRQ7Acfkr4b5wsKEhwFFONMB6cLvhgXCbJSt+hcBgEb9RIeC6BBVwjXCgkGaIsJBZMaiQXzB4kHAgWTGoIEggeCBskEYBDhG38LnQjKBIkFLQUNGIkGRQfQmyoHIxr0GOkFCBsAi2hTjwmXUd9g5sDR4ukhGFG/YajQBsLxGTsL8RrqQgkabwqZw28K7wrx4EcZeFAR0N7BOFOVGbhSCIgpGUkZXwgJGN8JAcHfC6kafRrT4vMFoBMOBU0YiQRJBQMZggTJBkIGfwjZGgATyFIpBsoGqQSpBIIEaQcLB7UFqwVqBICJptKDEoUbwwZAiiMHbhFFGsCIxRqzUx5Rl+qTBqVQ7AYlGWMQr1FXBf4bnAXh000GMQcnUI0Z5RswCZCLBxqZBEsYF1NNGlUbBLO3ByIH4gSUU0YHNRiyufcHhgQc4ybTRgX1GcmYpIkKB4sbZIuBB0YGqIpYiDEG0NIu43cEnUAhBhsZxhktGTSj/sosAvIElRvHUm0bTok0AO0YuIivBI0gjQc5CLIHeIq2wlq77wRfBjDjEQT1GynS3RhRBj8GJ+L7GGEESeC9GIIYzwUKAH0ZPwv7BaAQ6QfzBaASCwSCBF0EiwcLBYsGRwXJB0gTsQjJC8cEiQRdB9SLchsnBSoSpwb0GekECJoZBdqjTxs2GHcERgWwGFkEkxsSBPdghQbZB6UH2QTtB0UEtgKtBEnjUxm0i7kEvOAzGrMZBgSzGagbsxr1CUcakISYG5CEUBvGBYUHUIRFBDkF0IbFBgAbCxvYGCUFEIcj4r0HI+JVBIIFLQRlBZMZiQFlBDkE5QXlBokIhENvUaBDBxkNBmAbmgdyGaUGqIRdBaiG1QRoh9UFHQYlBZYFf+r0G40F/wl1BPUHKItrGt5T6IZtBtiFIFGNBvQYTQcUieSLQgWPBf+TbQWTGu0E7QftBxSKHQdGBtsZBxhtB8ZSxBmOGwSGSxvNB4SF8xpEhEsHFQTYhX4I8QQwGDkFLQS2AK4EXQUxA2wZaxvHOwcYEhtkhf+SRQYuBDkEFIWuB4caZIaSo8iF/5AeBH0F/wtdBCcbjiMHGA4apxroAI4aBZC9BpFQtITtBn0HFIt9B+cahhIXGHca0otfGpcZ9xhXGm8bjxpsib8Y3xvXGvKL7IofGTcbeAIRwZKKnxq5IlyJrxqCidyJPxtXGL8Y7xta0azT8otPG6yG3xkfGvyInxsKitXQHIV3GsyELIv3Gg8ZNkIYQLKILIachE8bLIZch2HD/Ic3GOyFpdHshlKLUotciV8Ylxhsh98aPxmyiz8bbxr8h5yE4ooChM8ZfxtPGx8ZSAOSiAKIiogAmEqISAM10uiaKJgGiBiaTdKGi0qKmJvsA8qJMQAaifAAEJsQmTEAYQFcA51AcQJYmICbqouAmWqJQJnqisCZUQHQmDCZMJp10VECsJmN0YoYtdAcAWEYtdFH6A3TWgOaiBkFWokImeoG2oljGeCEZEBImHMSvSNImYXCyJthEwCZwJhX4Y3SeAEgmKCbaJlX4hIbD2K108/rD2J10dEDD2GN0n6TquFQmk/jsBlYmLXStdGJA7XRiQJ10bUEtdGN06hxtdAcAi4FtdFX4LYDNdC2A8ibtdE6BbXRKovQhHXTI2N1BHXST+ExAVfgsQB10rXQngR10nXS5QR10jKGBBCIAuUGyADGiTibxooAQjcBJou4mKaKeJlt0GaI7dOeoOaIJBIEmhXAGxF4BlQFZjkQBNQEKjI7e577O3sm+SCwkgIdQa7yPAFySdyC5wNsmH/QSFkH0RyaIYrxieQQAsPrE/GKtKs2h6soa9r4B7aEpvvueRr60Eo+O0N7K9nh+iQqS6DxAnqGIdjIu0r4F/k1O5U5E3rUBw954DngKwD7UAaA+BVpgARA+zQEODrX+/v48fqq+jf7zaM3+PQFoPiLk/2oBWqEBHM4g/saOgr6m9i7uHZ63/sX+pv7bfk4+t6FHNhX+u47gAc+hg04mAXX+ZgGQzu4Onn6eDn6+3g7IAfeOBY4jWNuhz46Rvq+O3gGtoU1efgFfjk4knaHskqUBpVbYHguObZ7zzq3eKP6Ter1+sgHZ6rj+igEv/tb+KgEG3mW+X/6bvlguf/6Nvqpa7P4NPnhO277aATH+xE4abkQqAt5tbJ2+It40TmLedE59vqikA74y3uwqw76HVhZ+l/5Cvi3ekH6sYWK+0GFs/kJOXGEFvkoBet7v/vxh9v4yTkJhmgEiYUe+fvaj3vu+ak7c/r72Q/Y3fDRhxVbj9le+Tph9oVhuVsyDoZDsVSY6/mIB6b4SAbR+N1bQfuxhV6HhKspEhRD5xJF4zJAiEEEWrzqoWlHiN6HeMkPq9P7iAb3e+N5ZvtIBpmENppxh1b6yjoW+r/58YXb+XVbu9t/+Tv7oAaJhWyRqWBfqzb6+WoZhEGEKPmxhDX5ekh4B+d4jPgc+zmqTqklOqH7lyuh+aX4ZTlh+wVI4fg1+L34nnGrWwVqEfkVOPaTEfkz+kGHt3obWa+aUfhU2DP40fqreUH7YNiVhjH6fNnBhVg4IYeA+715OfpABr6HQAe+hDf5Qzk3+wf44YaH+YN6ezoF+kn5jfiF+ej5hfud+bxoKfifepj7KfuY+IT6Pfu/0Gn4GGg/exKq6fn5s+n4UqoZ++v4f3jT+X97E1j/eb07PSpt+j64wYZ3WQAGFASABD6HTXk+hV2EtAV2Ot95r7p6+GGHevlhhvr749v6+O17oPl7OQX5Sfg8aE34/YXJ+F37/YbN+p95xDhbOS34WPmjK8f6JfmD+VM4vzlXeWU58/vAug/Zgjkh+UZ48UtcWpW5FfkA2r/JzYSru5X7vfnUOn34NDk0O5japzuI+Nj67oSIB0TbATvlhjP43/l1hJmErzsdhRI5uYZOeQ34Hfjcao37Hftg+8da4PsDSU35+PltOin7RfmY+vOEg4ZY+ID5rfiJqvDb2PkaeRw6dtu7Oe35uPpg+Oj5fYSzhZ35s4X9hHuEA4Up+vxoqfnzhFJo31gUBsc6vqrUOAs4a4ULOWuGizr9+CT5sPhnOiJ5ZzlCOaT4wjkrhYP4q/jqOkP70Whr+vjaw/lIuJT76YWBhEH6dYQdh2A73/hxh/X7s3qs+zT5P/hVs+P5SYY4BKZok/rBKOTZR/AM+RChDPv1hCH5cjuM+ef4nocxhRmFF/t1hMgHxYX3hKz4Gmms+Lv7D4fKOo+HZftaagv49YZnh585Cmtk+FEonPmr+DeElmqiORo5zCsrh3QIhjqS+f6YpbnBWKh4GHixeJuZxjugACY70vkmOKY4RXgs6zG5VlpUeY271bhNu0L7cboAel54dHteeSQHFDikB9R5rbo0eiBFdHlkB2L77/rkB+274vslMMujy6JcYwgHOGFQA0WjiSH+Ak0DAAFrM8BjzBL/MsRLOXl8+5R4hbmOuv+4cbrReiV4wvsLKj54NZs+euKZsXu1+Oa7aHklecQEpXvC+fBE/Lr6OZa55OiFeh/75ARVkIh6CEYVo3EpUWA6eFZ7fyPGe1Z5gXL/wc/RAQNB6cQBdcLoRLX55EP4AVxJ+6tjmLFrVgMM8wuhJxHphJl5t7AzIohj7gFgevMwuwJOACPQ0yFc+pWE7gDd0ZACqAJQRfuo0EVuAdBFcdC5m6ebS7PweN3ZEmNsAQ2L7gCi+qQHwEZS+GQF/7DoSl9DsFPWaV+gEvoIR7eBP6NtQLmTAbMOyBMhhEFuArICCoASUGmKW2rDyo2HBbqOucV4/PtEBnF4JEdxeCBG8XkgR4B5kvg+ecL5PnsWukspSEbuuPAFIHnwBGFag5seuRugjpjralnZd8rzM+WhY9M9gMxGdLuERR4rt2lskonpEUpERfR7REZ1cO1pQIPERqBFpAegRrRHRsqkR4qDpEb26mRFrodU6Rm62QAAAZz+AxJQKjAqgtHhObEeKKkAFpgqg2ABGACQkAF5FaAT0RJjoAI8YSJiAANSAMQCmAG+2/drYAIAAoIBRZD2sKkB/gPvQ8xFcgPxongFLkP0kfKBLcgAAp2BYTHInQKUR6BjAkRmAZyDAEH602PinSjLkfKBBUhbg32ThYSVgKBDaCAAAzzEAWJC16KGWIpCy8iKQkcDfEflo9JGXcMHAugAMkTTIimgGAHIA9sAP0PCRxWiLAMKRROQY4LecjfQiECgsPRz3BHcAFxGMoIdQ5ixqkQ+KgzrUAIAAjoAxACsSugCl9GBYvPQyktoIuxKTOvsCapEPLN34XxGw8gAY3JGlQHyR4G47gCj0USBeEFVoJUAuwKloW4DiSKoAHJE35iVgWACB4s4AaBDcAGQiEKxIchjgaBD5QCooABghkGuAJpGGkW+s/gB7gGuAzJgsbB+wgZHqECGR8hBGAOhgX4BxEglo7pFfEZXgnf7l4eDeHRGovjwRVpYSEfcyiwh2QIAAeASAALgE1ICAADgEAADVAADdB5gP8HKRK/ZIHhW8apGFXIVATHwBkTfQwZGhke3gEpAlQPuAcCDbWueeTRFovi0RiQE/ArWRaQCNkS2RHZFdkdN2yFwHzAM28uGpPgqIZhEfrjXyzgBWEZ+6NhGnhN4yX+hG6AeRUt7mET06tV75eoIQF5GK3lfA+BC3km3sUSDOEUb8MEpuEW7AhQieEb2Ruy71aGQR7MwUEbeR1BHUoIX8V1ChEYBRBS5gEYeerBHxXuwRTqYxAf3mcBHNEUkRGBEK+gIR+v4oEcleaBGpXgi+6V5ydihW754rdp+ehWjrESVemxGxEY0RexGJEekBWFEpEXZAaRGSPDhe5xHKkRQs4xEwXhOm9GEwSvMRhWgCUbzM5WjjLisRh/R/3h4e0F5qXhKm98o3fAJRcxHikQsRd95LEaJRhWitxCgMPZEH9I30h3CFeqVuDYBUUeRRxUBY0lsRHzozIHER5ZHzkZWRXy4j5h3ixxEgkWxRHzoDUNc6LFrhXp92gL65QL4RYFFUEUERUFH0ERoeE770jmWR7+Frrp/h+paqHguutpYrkXmAa5FgAG2RnZGDGMkQ8pHDkfz0o5EPOOOR4ZFTkVGRs5FTbvRRGFGMUYcRNeJRUQEAMVFxUZuRLM7bkecCu5GLEdw+rgA3kVQRFhHHkcM8T5GXkSNgZqSeUf4R4FE+USERTThhEcpRB54sEXURjeaaulcudF4iEehRC5GYUQVRv+ZCbjQ+eFGiEQRR4hE9EWOK3R4oVmLkn0hOWCNwPYAdEJkE/gBW9LtYPfwaLO1RAREQUbQRviwwUd8RsV6jbmwRkL7yHuku9F7zUfsRhFHVke96M1HfCnNR41FWUUWuNlElrn0RtRhi5NhoVxSLBB2AnxJtUeQRHVHeUZBR3VEMEUx8l1FUXoimYvqcbqNRXBEYpp9RCFYDlm2Wr1HhvO9RsL6kpotR31G9EStRAOZi5PqgkpEBKPdAa4BfEScIykT9cHTU+RD4PLKAugCUPOWA9QCUPEfhGAFdjlHOZGgLobXo1Mp8SO8RnxFVJgiRtSZcwKTR8bZKUWvu9WhkHBjgtxEfET6qclGKUVz01Mp9QHjIpiCUANiKHzpRai5ezBG1EVdRSFE3UZaOd1FjUTjRBuZ40eAWGNEtHsluIVEFrnxu4VECbplusm7OunuuAK5lAsMRiBZDHjyMuREorAz03IBhjs90N+jjAFuAqCRmXni8J7LQkN+AnABtlFuAkWyE8DyAhWih0T6YcgAR0bHRa1Ix0TAyiVKe0X3s3tFv4W3s5eiB0VOyfmyMEWvumtFMEcNu9ebE2vDRch4G0UmuyNFupqjR6a5qHqxemNGJzNjR3BFdEbwRS1G82lgRpFFCXoZRpV6u0fluTKaKstxR0lGwXsqR/gDyUcHcilFVJiJRqK5iUd8MQZI44T3sYEwXtov+rJ50AR5edBbMAYwBGexFnn9uRx6lFqhclYD+ALAATEBxALvAZ9HlgIOAk6pbnleRaeYl0ScuQvpnLseeUBGnnpNudR74UY9RptGIVubRyQGW0dFuqW5MXlS+KLIO0UNmiB67LkMR9l5ZEQjhzqoV4YA+HlFg0cdRXVFnUT1ROFE0Pr0C4QGsbpEBL9ENEbsRH9EMUQcRS5HYUU3R83x/0eS++DFPUR3RPo6E0YJeOL64EXi+/AFQMWgxkj5LluwKSpwHoafRJl7z/DWw4cgrrBGu2RHwUQNRutH1EchRj6acEbARxtG5Xt0R+NHepsQx/wKkMZ0RuNFSMWbRP1HUMVd2tDElXnkB+BFAvrj6UlGorupefFH3KqkQh1BNwBAAg5jC9CGQnACukYoCo+D5aOJIz2B09BVUC+rn4UpcQW4VTCxuT9GQEbwBr9EwEQAeEjF2jhQx0jFdiv5RghEt0SjRbdFVkZQxMm6/UY7RAxHgMb8+WjEVZDYx9GhZsEeR7abD0XoxMlG7XtURbjHgEUeenjGDEd4xCh410a+m4THWUcoxL1EW0VleNWqhUZl2ttHxbkYeIDEIHnSmfdGQMZxRBQDcoNbIYcDgXoIRZACjQHIAZyxHThpuIFFnzF5RgRGQ0cgxDBFXPkg2POKU0mqgIhxY8NX6VABZgOJIXYK1wDH6SzF+ETohcsbZwlTwYGgbMeJIWzHayk2CYADPUPBogKZl3hUBS6GNXrs27L4W4VI++FrGvkVRspww3rlOmT6tflf+6A6SAeth5uH77pbhsGF6AZ7y+Vo6Wo+hl2Ecfi+hqGFvofX+gf6dAd+hz2HWAQCqCeJ6vlOODOpuUUKYpr5jvh8xvQ5noYrOg96XoR8+16GZWACxj5r2fs6+/U7XYRCxt2FQsR0Bli7dAXCxoN506vhhIBE8vs8xO6FpklK8hAEUYauhxg4+YRe+fmGBvgFRCP4BXqehkC677tU+Q974sWVh0f4O9lVhALZgKobe9N6gtj/+pt5OYYROXfbsShJhko6znh5h/TY83q2+ZE6KYbH2S1bdvqphvb6B6hphUt5p9sxO2mGR6greElHvMQZhlr77YcZhsWE94VvhcC4WYc/+SC5vVjZhNWHSTnVhDmEYTg4Bx+Gu/hj+GrFqPhFEjWHOYV5hMNZnvrRh+k49oX/esd6mTgB+vt4n6k++1k5L6o5Okd4fvm++2bE/vu5OHt4mTne+XioJ3gv2Sd4B3gFOSCSBYQOhmABDobBR5G7Nfmm+TGFTvl8xZuEusZvhErEr6olhyWGkeKlh6WFDIKhaqd6J/uBh8j5d4fiOg2G9YafheuGnztLhO/4ofnv+JFrC4ZXeXqrYfkmSuH5ssef+dhoFTkthxU4dYaOxzrEjFuR+FqbbYUbhkWEFYSR+UgFQYXcxpf7s/kSxWloksVX+RgHgsa0BaGHtARTh/H4+voZWdLG/oW9hWj4fYY7h437O4T4+buHyfonhnOGA4SnhwOFxfqDh196T1pp+kOF7XtDh6g4GfnexgkoB4cjh2/ao4c3W704Y4S7OWOEWDqdhLH7nYSCx7H5qVvNeJOFtASL21LECfthhNOG4YaZWv7ESfqQ2AHEx4UBxk36Qyu7hxs5J4V7hQOE+4dBxFD4C4c9+QuFy/iLhK7HTYZGxqrFS4XwxCOGy4WFhwP65sY42GT4y/hV+0T4E0tV+oj464fV+07HMMUwRWGqCsVGewrEKzkouuLH8sdkRI974DtbhI7b1qucOh34ePpNSJ37fYXHhIHHs4WBxxD48cZBxfHEPfn7hd6HocZc+Ts6mDg4+oeG6emGxx+6Mce4+O96AceiafA6u4RxxoHFcceBxyeFn1p5xGw7xfiWRHeoRPtMa9JpCPlV+BeG1fpY2UnE2NmXhKT4V4cBhExpwjrXhN+H14d42Bo5FPi3h8P5NsbI+q+Gd4Qex3eEdsTv+0TYtNiFxHs5a0uVheeptPnvOFv6d9t0+pP69PsPOFP6sjlT+/uEDYboOWZpL4cehAVGXXtf+rbFjsd2e4rHtcXU+Sz5dcXt+2rE63v1x4uEesQHuPnHTceG+ZTZajhVxEP4Tmmc+jeHzNlL+OWyhTCNhcmGkEUdRnVHjMdBRKDGF0TLhiS7f7kIxQ1HIpiNRYjG+Ma3RijHt0YExzWayMXaCVTGyOjUxG67f4Q3RCW6NMSOWztEnAv3Rgx4k3v5uQFEvaqViqhH3FpLuGhFVni6eFRw6EXjxlxYGEaMMB1ElYHVRd5F6/jQ+PYCnkeYK55F2ETSRDhFvkZ+RodyXrrEmY4DuEV7QAFF+kbeoCDEvcadRb3HQ0WVWH0AGURcuxszGUbRRuDEPUeQxX9Ho0SZydlGnEYx6HFFi5BnR6oyFEcl8JRGUAGURPIAVEbuy2B7ZMfLs7jEQEddRCNEcEahRxS5A8SbRSjHf0Xt2lTG5rrEBH1GlMV9R5THLUV3RO2490eLxIl5YugVuXFHmdiZumTFj0a4AE9ENgEJRN3wz0S1u6li1nGsRLExREZLxjzLmUcFR/9HQ8foeP2Y/4UYeivEOUfy6TlGMMd8KDYBS0XEAMtH3EWlc/rQikM8RRm6vEVuW/NHWkUNy8xHgkf8R/ZR4kSCRYJEXElCRYq6wkV8RN4BC0UiRUl5mYmSRfcAYkViRZzq4kXIA+JGQoDeARJFGAOYsugCkkcAk5JHrJJSRyhHINs4YtJEOkUyRbJFYkBvxRIBB8VfAXJEOkaYRdpEqKEKRIpGQoGcg8xGk0fP8qBhR8d2R8pFJDIqRHJFMfKqRTcCDkf8YF9A6kXqRBpGsmLyAgSrxkWaRT/GGAPRo8/w78XzOcZEOkfaRDJGeYM6RJ0BWMQr0jwA/6F6RqgA+kbnx4byVZCORPYBjkf+gYZGtJhGR05HRkQQklACgCbsSX/FJkbgAKZEsGGmRIZAZkZiQ5izUADmR0kT5kW6RuMG7yGlxQP6wMQK+SfFkMXlRBDH5XnMCRVHAACVRG5EJUZpRvMz/8S/xyVGBkRgJ7IATkTgJWVFUiHORuVETUflRhDHc7HwJAgnxUbOxE14VUbZyVVF9USMalPGpMSS6J5HWEc1RvVqgclzA+gkNUVXa7eCPkbYRL5FfgMzxH5EnQF+R4PF3rM90nPF/kZxoXhEkXvAxoFHg0WMxgvF+UfWxR24CMTrRcNHmjvrRiNEA8Y7xfjGFrmjRu3YVMb/RkPH/pinxgDHJEUhWAl5qMTgRGjF4EQwxlFGx8RsR8fG95rUw0vFO8cDxETGg8d3mmfEmUdnxHFFBUZJRql4ZMaPRgtFT0QpRJWjh8bOwyxHdDOJRp17pMZHx3h4GMVJeIfEfQGHxiVIR8V4e32TqUTfximiTCfUMOlEfcbsuXMBi8eFuEvE4ytUJ6eZmUXRReDFcCQExrvFdilUJQWQq8eWKrlEzju5RPhH88RDRAQnnUezxIxp31tOuyfHW0V/hafFw8SJ2qglNkbFRggn1aIlRQQk43mPiKVHoCWlRmAnSCZlRM5FyCTlRWwmKCdwJRFHUvq8J65HqCdJxaDFaCcU6Oglr7l3+JhGuAIeRlgmGCU1RthGmCeTxbrzPcRcJwRETMb1RKIkUXmXRZo5/liIxzeZRCWhRMQk20bDxEVGN0fbxwhHFMTle/jFy8fEJbvGvniSya1EVxP4Am1HOANtRjfAtEJhoINHZJASJ/glEiULxJIl9kWSJpo4i+hXRNF4oUZsJMvHbCRyJ0m6CbsyJKomlCdbxIPG7CVQx7vHj5v9R8ICA0TYQc2qtUeKJ5wmSib5RVwlDcrDR5dHhCWbxyoklCXSJjwnRjunxTy7BMbhR8jEVkc7xcQkaifbR0TFiiFK8JNH6IOTRlNEjYNTRbRC00fTRjNFVgCzRsABs0U1hXlouCdnMPgkjMX4JJ1FSiYEJjNyocUlWb7ZObuvR3naeXpJKVXr8Hoce4WqA7qwW2n5YnPeWdjxJ4nWJC9EMYWcJvgmIMa9xOYl5iema2tHfcWEJlIkRCebx2omuiWFRDIl20UyJiQkO8bSJVvGSMXqJtvEE0YaJmQkyEQf+la7yEZUCihH6/kvxWPFnaGoRi5x48fO2WhGE8SVwRhFzMiTxhhF48RYJ95GWEcYJtglLNrVRphHgUZiJ3hHmCs1RUf5D4SkORuSdiRWWBYm0AfR6q/5fbuv+SB6b/gUu2/4TXp8+yH7fPkjx+dqJag8xm6FCAbGmrjFG8bkxiFHCMf2JzokWUQoJddFxboi+t55FCSyJ4jFTieyJNvHy8XOJ3Il/LouJdDFyEQkx9oocsTcxlGEloKPi/pFkYcuh1QFcVjU+99E//CcJob68vjNxTzzdXobxeWFnsSbhy3EtcQ3OpnHQMQSx9QGl3o0Bjn5gsShhL7GQsehh1C4PYV+hT2F0cS9hDLG6vjnK+r4sMsG+J/4mvjZWc3HU8XCWhnH93lU+Hu6iSUwx4knqLuX+PU6V/oYByGEGLhRxr7FUce+xcAHqvkg+P6EBvpxROkncvoRhYb4vMZLOUb6MSdcxH44sSUje1GGxsb5h6N7fEaexzbFRYU6x6+E/MaxJbrHm/hLhlv48YcoBsrFHmvKx6gEKWsqxO3E1vqGx4eHuYR0+wbGzEraSz+GZ4i7qCmEUTnH2xrHMHDQqprEp9haxTE6sKrLeNrHsTnYJ9rHt4cK+8UkxYYdh17G94e6xvXFLvl6x1N4+sXKxAmH2YRoBgbEqsZ5hrN5bccVJhP6lSce+zjF83tYqxQFdocEB/mHOGEmxxbF01mWxfk4VsTKJuy62ThUOod7PThHeRFh79u2mu0le3iWxD75pscB+NWizJNWxKawhYW3gcnGiAVR+u2Ejscj+CUntsUdhTc5dsbKASWHqRL2xaWEoehlhlJqBTnwuwU57sX9JfUmtcaM+fNbRTkdxC+EzsfCJwAEPcfcxKU7l3gAa8v4Dmor+785ADtxJAUmwdgthWFiFTruxjrEsYf9Jh7GbYUuWJ7GgYX1ev0mF/ojJIkltMQSx5BqL0RfhzY7EcQThoLFkcW6+Ri5k4cte92GYYfABtHHTTvRxYf5hcVHhwX7M4WxxrOHOcQnh8XFucTd+QT6p4b7hV956GuDhxdZafpXhiHFP3jDhldYocTzJlV5TqtpxDBKYceZ+L5HB4ZCaQXENjubJ7PZ8yTZJiGGE4TJJDklHjrA+MAEuSRYB7knfsZ5Jcsm2cRFxrHFRcS7hh6qxcS5xasnXfmIOt35EzlrJ/HH84RnhFUniEv/qvkoYfgr+U2GjZBJxc0n/fiGqBX57kSVxCnGg/qNqKnGCzsI+6nFxPnV+7UqzYZXO+nE7/sZJlT4s/gx+yj4nYQtJNuEiGnbh2s5Hfp4+DnGx4XIa8eEp1hzh6slxyZrJUHFecTrJ7I7oyUBqG35WfoFxcDEEcR3Jrj7ifuFxWD6RcXI20XGRyd2q0ckzfqPJBM7xyTzhN6rayenhqQ4ZcTnhCc4VyTlxIs55ca0OBXHvQIXJ1VEK4ek+1eHlcVfhIpoXcdM2d+H/zg/hFc71cW3hLMkd4fuxdMlIyQNJyUntyUVJF+574dJhB+E9zrnJ/TbDcZPhZP79PuNxo86FYpjJuOH7PqTJiH50/svhC3FNyUVhV7G/Mej+4mGQKRju+UkVYTvOh+HO/jAprWGl3r5xmo5SvKL+xc6/zqXOFz5lmm5YOmD7oRhAh6ELodRJIUlxYZ9x+Y5Msb5JXEkncQqCvEkq5twpvCkNcYj+TXHAKezJq3F4setxtn4gPlJJSGFE4c+xjknySW+xikkSyW5JtLGqSfCx6qp/odC2dyBu0slSpXHzjl1JgCk9SbTJiikXoeZJcJbmcTehH4nCOuopHslCyS5+lLEKSU9q+imPYZYBgcl04UFRG6F5MszqRGERvq8xgUktoUxJbaGhSdfx/pERSbyxUUmMbvxJsUnnsWthbbH9ScQpD/5DSVKxzVYZSRJOE0l2Yf6x00m//hQpLN7b4Vj+lJKzSTqxzb6pyQJYGPT6sTVJRrErVvVJa1aNSZLe0t5WsftWI7459rn+83HZEQQp3X5EKUlJErGP/vvhBSnWYR9Wn/5TSblJL4mTKS5hFnHOPtUpWrElSezRK0kNKZDc60kJvkEBdGHbSVVkr0nwLO9Jx0lwUY2xACnUfqzJ2LHGcWKxyikgSSTW3bFgySyQEMkIjFDJxhKWKSXJf95pKY1xLbHRYWD2SilOKSgJcgGDcX1xVmHILuNJWUmTSaUp8ylJiVGxqkqX9sOxQCkIyf8pEU4TsXneNJYMKRjJw2GrSfw+FzFuqhnJE2GYftXe02FrsXXJ+H6LYeAOy2Fa1jTJa+EOKX48R7FG1ogOEWHpKYJJfynNTgCpnMmAAVK+C3Gw9m7JF2Gkca6+3ilaVr7JeimU4ZLJ1OHSyWpJAKrByfbhvcn2cU7h4cnAcVHJqsl7ybHJB8njyclxB07JDqmJr8QnTlJeZ04KcTnKxsnIcXDhbinaDsdx085lygyqhg5o4SyquHHWfrXuZf5qKQ+xdkmaKbJJ2ik+KbopfiliqQYpUslwzrThon704e9hzHF9yQqpm8kRyVjOcXGqqQSaGskxfonJk8mnyeE+cI5LsX/2RMmZfkGxGymf1kBqBcmA/mUO8nFnSbnOSnHsCdnhvw6XyXnhlcm5cUsa4s5kqZux7x7MyZcpSKlsySipJnGcqYVJAb7Y7vt+NnGyqXZxxkphyeGpSqk7ySqpadYJce5xSXHHyUnJan7z4UjhfnE4cfPJIeGLybBhy8kD4Z2pGD4hyevJfamhDsrJyqnDya5xaqnzfhqp46kJqU6qZ8lu4uXJ5anXyTV+ValpziXhST7p/qwJmkovydjJWtE4pOdxYv6sKRL+TeHq5HD+takNyRNewymXsRvhgMm5KaQp7akbzoPhkym8/rCpqrGIKRmSU+Eu0qgpgz6TcWjJ06mL4bgpgykI4f+p3zEAyWAp4yltqTte23HrKU1hkGk0KWPhh3HTyShpp85nce/JY5osKV42f841cffOPjICHAK8ylCDWiEAIrxivGVx2WKk4VGek1pzmo/AJL6+0RwJCjG6ieUJ+ok6+n/hABHAAAy+yY5MvgRhjBL2iRSJkXZUidx2SNF4SWExZQllMbOJMjFaiS6J+EmxCfXRjInw8UGJTTG5Ht7xZwJH0kvExBGjEW18wzHLMZmJSDHSierROMklZo/RJvF60U6JojEW8dleJ3Zuicxezwmeiagxb1E+iZZRfomGaaOJxmmqMaRJ8m7kScuJlEkFMmuJNPGY8ew+x4mM7mQKu4lgdkG2RPE3iV8WpPFGEdeRd4n1UReJx5F08fl6DPGdSaFgDglOEWzxAjo4GO4JHhF4Mo1RLYkZiW2JlwnvcYxu5Gj5CdRRhQkvLonxdwmcCRCJOwnaaXsJLFEnEVnx6eY58V5JzmLaCIKMBRHWLEURsqBa8Trx2AB68cAJD9HG8XkxpvGV0ZEJ3mnVMQ8Jw4lPCUZpRh5eibNRIWnoSWFpmEnEUcYe3dHqMb3RmjG5CWf+Jl7+8Qy6TQnTES0Jk9FtCaMJHQmqUcacMfHNMTRRCfGDifpp9ImHaRFpGfGjafZRawn1bpNp3xEF8UXxCZJfgKXxWJDl8XxIlfGtdtXxa2k/EUP8fxEAkU3xoJHOZOCRbfEpJh3xYpGogIiRgKmJzIJi/fGrwIPxjQDD8drxeOnj8RfoCqBT8SSRj+jU6T1AC/ER4llhfvG8kQyR6/EskZvxgunb8ZyRxWjckQfxYAlH8aaGJ/Gk6RKRbPRX8d+y9QyaUXfxeQBKkd8Rogk/gNiR0AAAmNqRupHaCJ/xRpE/8boAppGeYITwTcCWkUAJ0Uk+pKAJ/JHckZAJNTCMkAWRcAnLpAgJSAnKkagJfwlBkQCJUgkZUZGRIIlEmPgJhAkJkav8JAlkCZTM6ayUCTfQmZE0CXQJeZH04LAJXkjMCYJxkI4hKfIJ4IkYSXUxWEmw4DCJ7wlwiVMJVSYa6Q+K4gmpUSGRgIm+6bgJ2VHv0aqJg2nqiYYesnY56aVRrKbi2oiJx67IibKJNVFoidAAGInFaVYJpWnMDAzxuInGEeeJhklAqdiJz5F2sZVp75HVaS4RN3y/kQ1pXglr5u3gdml+Ea1p2Ym2ic2JCEkIUYNR1F6Opl5pQOkaaaJpWmlESTpp44m4SYDxB+nTiWJpw2kGiSRJ0hExadkJ9DEo8d9kSwknnisJ7uJQ6WvuGwl6aRfpBEkzicfpI2lpAKxRH+lIHjDpdQk6MQ0JfQn6MbJRiVJDCbvxU9HCUd9ps9FdCfPRPQnPaXG6vFHQGfxR72mh8fAZ7QmNsJ0JCpGykbfx8wzaUSt+j3FXwC/pL9Fv6YVCwBm7Ll/paEnp6RdpmelXafsJGRHOUceRxwlHXoRazWn2aavpNontabVpHM48Vmnp1ekZ6SOJ9TH16Vuh0VFvCY3pnwnCCUNyaAle6aXpPunYCcCJUzEMGaIZTBniGVnp7MAN6R8JGClL0fWJlVE6qUesQhmd6d3pI+mJzJ8JzAwmCb3+ZgkuXBKJWYn8GcLxhLqKaQqJjonbaQOJ3+m10VoZoOkSGUi+OEn76T4Zmmku8dfpUTFRafNivIkbUVNQgok7Ua4Ae1E59qDRrYkC8WvpAhmuGRgxHjFbaUqJe+neGSUxIRn+iXXpARkvLmfp0QnA6X5pQDGYEbfpvmjGiaaJwNEnCEkZLWkpGc4ZpykNsf1RoQkOiX2JnmnUibtpUPH7abUx2hlXaSdpwWlJCR/hfRkw8X4ZOhlYvqtRIYmk0dlA4Ync6QoKNNEFELGJTNEJiVBpvvao0lzRuMk80bVefNF3ERNk8tFk6cLRJWCi0Wv+4tFIHpLRp8zS0XcRctEwGQrRuhqPicrRV1Cq0c5p6ebF0WBJ3YmUXh0ZymkoSTkZGhk6iZfpR+mciUExQWlY0WdpjBn5GeFp/hmVLrGyd+lO0RWuLtGtMfOKHtEzaZnRYRBCaTnRAdFxAEHRNl4h0fWsYdHQIEnR7izR0QSUcdH4mQnRRJlR0djisdG8zGrxZomyoBiZ/tF50WZeulFvGfBJbhkyHoqJu+ndGUEZeRmH6aEZ/+lg8bpp/xlDif0ZExlXaQjxxV53aTkJT+ltMUPRaBmEZhgZFOmbzOPR2BnDCbgZX2n4GT9p0fHHbuVRWJwr0bcJS/7q7vc+DAGPPkwBXl5mmTvRfB6WmXQkwEnv3j2AR9HaGKfR59G76FfRL2430RaJaF5sSTL+HJka5j8ZXRmqaTSJlvE/6QZpl2nUvoluTdqhMcEZ/JkFGR6J+MwZCdFp8JmyEXFpD2nKbjcJ+HF88ckZhInNGaCZWeHVihtpSEm/cVC+RTHqadGZgJkCmcCZQpmn6byZbImhmcwZ4ZmSmTkBD+kUSamZJR6PiUy2+IzsMU4kXYQCcD+AdQC8MeyZGRnuachJAZlrdmpp5+llmb/pV+mCmU6OwpnCab6JkJlhmcAxJmmI8QiZyPFImRVk9QkZgo0JSpnKkUYxfTGmMVXM5jFsgFYxZ1JJMWSQ9jGrwI4x3IA4qWmJID6gvhEBz9FeMTgxIpllGQdp7okBaUUZmV4TicGZk5l1mQMZDZkrmVKZXvEtMageRfJJMS8QBglcPr0JXh5QGVkxC7FyidIefpmpLippY5lBmT5pHo4JATwJDNomGQfEUZl8meWZsZmfmTCZ/NoxMWAxBS4QMWBZsaYdMRYxV+gAbMYx/TG0AIMxpW7L6aMxThlQ0eYpuFkq7luef4p7WAdYezEnwAcxssZHMdnC/zDfqPsxqgCHMe2EUwGPWBJZqzGp+lzYEln9gln6SMFteNC0hPgPQlHGvQYOQX/COSIYBF14bvgY2ARCbiIuQb70mAAiENgA/sSM9GcSDELcIkg4TQB1tBRC6fjBECjBnMZowZ34uADWYozIdjQGOBpgpPjwUCsAlbQuWepZirhnhp44IVmlBrjYalneOB14oTjRWRE4JllRWSeGYMJxWclZ2nh+OOFZMVm3+qlZrllluBJASVm5WRwiOVkRWetGM/gGWY20GMFLAZHCN4YxwneGJcGttDSEtISLMYJZqgBMhPJZDfoYEHJZW4JYIsS0u4KlwkBG7ME+gcdBD0IjQcpB0YG76DPUiIGCIrIhMSKo+C/BKbhodBhAGEBMQExCH8EoBMsG41moxMs4a1mGWJNGxSE5RotZGEDlgG0Qg0YVISgERwaWQdxA5YC4BrPBvUKIBtp4N0HKIhNZ8gQ52DtZ0saDwTfBynSLWRZGAsi8gU0hyzQjRt9ZTECCgdNZ/cG+WVzG38H2QBNZsAAtgCDZGSEzWSgEiEHghoDZ3ECw2YNGh8FilM4hl1nsQC2AJ1mLBlPYBiFmQa2G5sZBeGq483g4gGgQrmLKsBuQt4K7wC2A6AAkxjDZHRAVxGxBNnjRgTvClkJCuDviXCGhhmzZzDhD2LB4FNnbEKQA1NkcAIRBUHATwZ9ZLkGgyS7BGSHP+PdZBzhytB9U7DTuBsaBLziE2f5BkYF6WVS44/oVBh6BxTQR1L5CasI0+NzZoYEkFJLGZQYXgS2BurQkgFAEIgQK2Xy4VLj62QaBxUJ0xjlAGtn21GvBuSKWxoH4OYHJBs2B1QbjNNOBNpR4Ir7G7oEB2Z6BrQY7gUoEonTgQsXYztnLIWXkl0RDEOxGf4HjQhJZE0J+Qdp4o1l4QcoilxSDRl1G81l3sB2A1wY7WUNGaATUQcoixWjZQBNGNCIjRgVA1ACnWaj4F1miQk8ZsoBXWYNGDtkoBI9Zr0IoEL0x8IDt2TjZvIFd2Vq00YHZQGsgf1m0BPXZs8AQALyBRMbT2RAAg9kw2YNGSNkCQvXZyPTUAIPZ8gTo2TLBUtl3sA3ZW9ktgINGWlnvwtGBBUH3QUpCHtnUtFnGp9npIQEhWdkzlBbZZ9m6hgNBppCBgUrGfNlGxsNZU0gj2T3ZokIIkCSAr9kx2QPCktnXNN/ZSoYgIX8BSkGoRmgh0YFq+G9ZI9k0BLLBfwFBwagh+1nKIpvAnAB7RiuGBoRgwfr4rzQQNOaEwUaSgFB0VnBU1L1ZObQ2+HUiJ9mqITpZxSLa2e5ZULRZWXUiq9lSQn8BMDkj+Pb4RllnQiZZz7BmWRZZVlmrclBAtlnkQvZZjlkVeO74wVlZWTaGjDlBOJ5Zt+jeWf80I0h+WSoUdthT+EFZaVmMOGFZYTglWT8BBVm6OVM4nXg6OdI5mNnFWSY5C0b6OeY5ZwZlWUjYFVmONIeUxcHj1CyQGqh1wCoQIhCiEENwbjRodM+GJVTLKEKQclnZwr45OyjIIEpZ24JHhizB7fr+SFPxVXBCEHO0GzSLtFVGq7SjQriQqABI9D+AdrR+tFsUA1BCAF5ITJB+xJnZ4rCI9OJIKhBHgJeCrDmGWLYiQEHRgbkQ1YBr5IsGRTmqACU5vUIY2VM4f0JVOXvZEnhdcAIQTdloBC3ZynQ7cOkQXXAYgaDZgSHd2RtG0YFDjEVGv9kjRl05ZIA1OXU5fpCMgGrGGpQ32STZI0apEFdQgRJLOUpCl4I0OV849SEI2dNIT9kdOfZAqRDegds5wELv2bzZxzlf2Q0hToagOXGGoMkpYSIQjIBYQhc59zTy2eK47AQ7hvL4cMHgxGQ5XzS1VMeGVDmaWas5jcJ0OXzGDDkteJV4xlmmOXw5wADmWZZZi0BCOZ/0okK/+rW0KfhOWTl4fgCaOUYidvhk2B5ZXlmSoD5ZyjmOhjaGJEiBWTX4uLnMBGY5CVl6ORjYxjl0uYY5tLkwtGW4zToMufFZrLnZ2Sy5jXiIwjy52NiZeJlZTLl5Wfy5c0aiuaVZU/i2OQi0sUal+g1ZHoTeOVWAj4RYdBgiWHRMwapZ99lzwdfZWtm32ZDZ7DibOUcxsSH5+PEhuzlguSoUQXi3WV6Gn9lxhmc5NMY7Qlc5IbQ3OeLZ48FwgSNGhRCBYSNAusY7OfbZXzkHOWDZntkAIh/C7sYJxqWp7iFxIaWBmcYBud7ZQblphg3BREFhxlEhpSGLQqHZedS+uaM5fIDsQX05KbhyOJ0hSbnyFBm5iEgisIc5ykFoBLnZr0K5EC1Zv5BykdgA9JDYOSM5D9mzWYHBMzkVuW3AANFsRGaJg0YbWSc59bTNufPAJNE12WXZe1lNufZpv5B69N348fw9OU9Cmbn2IjUAeMghkJ3Z4zlduS2m/dnD2QSBurmtDJPZ9PgzOYeJc9kQ2XGGhhEr2bzBurnzOd05ZdktOWy5W7knucMiECImdIXGQCZSost0SqI8QBX4yNigJhqiECbaohX40CbtdPUiNKGNdFN0TKH9dHwmTMTuon9IfADaJuq4PqIKJv6iyiaGJmShJiayopShNiYiAMomBaHbqMmi8wCpopt06aKFhD4mu3R+JrmiDaFVhCOhusR0RDXA9YTuLpukTYQuyPiQ/cAbAGgQQZTyHG657iC0edqwDHlwaNVEiADnMS8MW/QBYcx5S0CRKDPA1MhKoO8ZSB50eVmAltoYLDFmjFlQIHNAWbKdKGdSomJC4MxZ1VExST8pcUn2Kc2ptynKmUpchUxqWLfEczLEdgO2YGmY7tqeHalZPDaeOAppCHp5UVhUAR8eErbGed8epnm/Hrfu/x5fyJFYLb4COgAY6NLkGYp5eADt4OuIQnnWLMJyYnlBlFskavTSeabgsnkxzIOYvnlRckFRvpngvtUeqFn/cT0ZyQljGanxH5lHaYFpXFkqJPhZtZkg6Zl5YOlPLo2ZcQDQAH5YVumo7sOAN671OtVYSOYPrvWMNxgxXkOZm2keaZ4ZqEnzmaFpi5n1mW0RyL6vmSGZBXn+aVl58ZlzYtUZ9GYlYM+u6OadOljmF4kzcmNy366Y5q/xf65E5qCY6R7JQGTm23JTOmBue3I05vM6MG6omAzmyzrncizmxvJs5jdynOYkmILmT3LYbpd573ICGDd5P3LEbgRuUWwKYDpkbem7LgcEiz4j6J8ey6mOedfu2xaDmBEACv6feSZ6RnlQKUO2E57lmI7qZ1ISkDYQt5nR7B9AJNSa1o1RDYATea+uC3mP6B+us3l9OlN5i3mpaCtyIzqreaAYwG4bedrpW3nU5oqMtOagEa4A+3nwbod5zOZIbqzm6zrs5tQY53kkbqc6V3mcGPd5dwD4blz55zrsmGz53JiY6WVY8OZ1OlVY/XIrGElMUPkUtjTOvkTVeWL5964S+XqYsmGuZij5aOZo+QM6ZmKY+V+u+Ob70EtyePn/rit5G3KQmGaR0zpU5hBuCJgK9Lt5KJhwbrEmCG5HeQz5J3lM+Wd5aG4Xedzmocy85m759Jg8+Z75RG78+U95cXkR4lCETHk9QCwQ9Hl4ALOEBYjH4OMUFJSgsFH5qxQx+Rn6ULAqWfnBxyjRRg45RMEIIiTBWwHQ2R20KxTV1An5a4J5+diQBflquf+GJcL8hCPgQxRyODR5ofnieQxIidnawUX5qdkjiIpQWxSBkK5IHdhaSKnkWxRKQOHYtbD1KAiQ9QCoAGzC9cIdBoIGYNSqdBu42AQaWT/ZGsb8gb7ZAtkHsBAA3ADuEICi+RB+wXm04Lkxud3CPCGrOfbYIgbAwQ7CFnhW2CbBRrgrwqG4V7hcOFa4okZl2NwAQ/mk1LPkxDmkOQXG1MQIRAOoPXRRhIB5sYRmoiB5kXA4RNGieETyxGmiMMjVobh5taH4efWhlYQpBCd0/Cl7NiRqAQG7KSUB8bFI7MR5HPC+9Ei5yCBjoAhis0B8EDEAJGg7oNgF5lmLQCWwBAWB9GOheyYToQhiSGLnJqR5pcBcebjJh1FWiexZxImvGd6ZiFlgvmxuSXm/GTyZuRn5eeUZaQk/0cgR4JmaGV15AFnLmREZ/RHkWdmulFkWHkXyiWnfChuJKWnByECWye4ZaeDuWWmHicTx4gp5aZ6Z5gmFaVTxK+x96TuM5WkT6W+RjhGs8TPpiVJz6dzxjWlWCemJvBlNGRxZ3wkCsW18lBleMdQZMRGA6bwFvmnvmYN5RXmnIKwZZxHsGbB2avFzaawCC2k3mX+A2vHemCtp7xH68RCuxak5MVvpP3E76U3mgZmpeaMZyh6+BRUZRDFzmf1pImmEWVCZkxkkUR7xt2kgWfdpspmPaTSRCpmTEeeKb2kFaK0JEHKamZiQBBk6mU4kbgUFMR4FtBkFLvQZHXnnaaIF4pnhmYEFyvHBBb3x4BnXGbLRDxFI6XX4BaZo6UeKGOmi6b8R9SQN8VyAeOkt8bJiROkwkVDAsukEyHA6THwokWiQtOla6TYQDOmj8SCRTOnTcizp0/Gz8aiRfcAUkQsZnVq86dyRAula2qyRwukP8bXxYun78eiJh/GCkdLphiCikWfxilEX8UMQCukrEcrpFsSq6R8FhLqF6VrpOunv8frpwekVQMaRxul4BabpFpGACUMQmOn1JDbpeAV26T/AUAnG6DAJ7pHwCflAiAm+kccuyUCe6ZIJWAnQAJORful4CbGR8ZHECa4AyZGpkUgkkelRwNQJ2ZG5kRDADAl3AIWRSelN6YV+qT63CSIZAJlTmUCZAYmbfHoZeelK6UlRN3ywhd8Rihk0hUCJDIWV6fdREoX/mYMFvAlSGcVRMhn6GS8KLem+8W95Zykd6cPphgVXiReRg+kFaeiJ94k96ViJn7rPiaYFVWkWBd+R7abWBf+RtgWOhZmZjRnZmU4FFXk1ET2J3xkoWdwF6QU1mT4FYpmFedCZJrzfmSUZk4n9efwFTFHpCSN5cm5JmUuJiJmIgrDAHQVxMV0FUvF9eX+ZA3k5BcxRgBljad0F2a6gGYKaMFkB8a9phxmzER9pTQUwSmMJgPxz0eFopgU1Ba1uZQFYGQ0FDYXnGQsJKlFIGYQZGlHEGYRMpBmsmX1R+lFdab3RAOlFCX1p4oWimeMZ0YXFBau8QBkHCaMFDaacGSG+p/72BSvpjgUsBTl52nzpmSC+BYUEWZKFFZnShSbmsoVlUV8JyoXUhd7ptIX0hRXpoIlV6VqFRYUCBTWReoX8CQaFcoV6mYXapoWtGXoJ+gVQWd4JToU4iXYZeIk7hWxZjmkdiXaJzXmFmakFw1GRbn0FEJkxmUUFgxm5mSQxIxlW0VkFUYV+BTGFhV7ZAVEZ/IkxGUKJu1GiifUZlolZmdaJAYUw0XBF2+lcmWkFaFkZBdhF8QHovthZuQXVmd4FmFlsRVCJ4gXziWMyNRltuXUZugUOGUwF0EXr6RH2CXmcBVEByXlIRfkFC5moRUuZOFl5BfOFb5m4RcWFKYVVLn9RMxlhiWuAFNELGVGJMYlBFgzRqxms0SRpy0kpidGc0v7Oybip3EoGGbzJFiCqRYmF2QXvhd8yV4WcmsNAM7nPGa7AatH/hTc+OuBORYWFSYVTUSbc7kXChVI+PFm8PgaZDEkxKcFJcAU4aXOxKLEcScyxbVjEYVEpiQXmvg6xS3FsqeehLan/Ftjh3Kn8MUtgLqlNAW6pXskwPtQObn7UcZ+xTA7+qTLJYN6IsZpJyLHCKaixppjosQMplhlL4phpWSmgKTkpHGFOqXehHimCyYKpX14iyUge5OGiqR+xVOFfsUYp9LEIsTxWggHhKX5JrLE6cR8ZsAW3MWfK8b6skom+yAUDCVw+zKlqeRkppuErcY4pnKkTKbQp8E7gqTMpagGCYWUpeUmEaXCpVSmc/mspS0mZqWH2HnmzVs0pQt61SW0p/vwNSRtWXSmWsa1J1rHy3h1JE+nfKXIpvym9SZp5ZklnRXkpr4mXRd6x10XZSbdFMKnmRW9F80lkKeNWD0WqsfbeXD48sd2hg+pG6LdJ/773vj5Oj0nJ3s4FghGnSWMaX74XSZ++PYDXSVJeJMVeTmTFgH4UxUdJeSo+YGnedim0qTDFFSrYKYGS6KkUzpipItbYqVspgLFl3uNhBMmvzmLhgA7rsatFQikUybwkVMkrYfDJTansqdfiDKlbYUyp30nG4XthGnmaxXlF7sodTjZFyX73ocCxAskCqWQuo0U8aSdJYsnQsTSxfqnA3vVFNgEBfn+xIanyqRvJm6lOcdup+9aXflF+sane4YepKXEwcbrJcHEQ4Q42Rqn3KldOr95TscjJM6k5Yi9Os5K2qYixc6kOyQup7lZmqd5WJUXSSV4ptsWUcbQOfskwsSpJkqnGKb4O1nGrqd2pocmKyYqp7HGDqTupMckxqWPJcakTyaHFAnEpycJxFd6pqdnJctG1KZLh+clHzo/Jugn5qcV+UUVlyWrhueFUhZrhN8lXqbrhCcX64eTJ0s6yKUKx8inIqUbFWnmtqSBp+GnOeZXFDOH/saGp3sXb1oPJKsmNxdGpMQ77qa3FmqmHTuOFHxlYKeIpicV2qenF7daOPmHhoGlg+Sup+8Wexb2ptcX9qfXFydb+xSPJe6lmzofJe07kPsnJJ6nFZmep08X54bPFYj7F4bl+KWnDxaSJHemlcfOxLmkFzm42uT6Xcer+9+Hlzjn+P6krxQZxa8UaxblFm8U29nhpu37GeRUpeP7UKfApAv611j0+fT7T4Qhps+FIaeRpQv4zzkQljckkJdcporGwxRQl28VUJR/FNCWtPlQpcCkZqcmJfkVBvsfOVsmKxYlFl+Gs0l/O2CVfydVxhT6MaVXuLB500qVxehHwxRBput5XRWu+N0VzKYze6xn9Nj3+Jg48Pn3+iEoeLqDIclkBLjjw4lkVucJZeiGDAbsxDYjDuS4lzQABLs9QHHnCRMYRRuisWQ5p7YkSRfeZ7AWPmfkxcTEvmchFIgWKRd15ykWcRSeFfAUuRcmFkhESBWmFsTEUWfExrZkJaeWSWWExUtuJnzxqBcXus+6k8WTxLQQnieUltoVd6faFnUU6eUYJZ5HOhT0JroVOCTVp5QFuCegAXPFehQvpLDGQRcElbWkuGQkFYeA5hVkleYVeBUklkYWLhXhFy4XDBRS2hwmiiqEFKcwa8cURUQXLaatpFXmG8VJFWDHPmbJFZ55gibElhQVKRRxFQgVYRfcJOEVTJRpFaSX8RXCZmSXSBdkllQXKbvnxHYWUHntFGm6wGaqZn2lNhYgZfQmthQhc7QVThSBZM4W9aRGF3EWLkexFJYV5gKuFbBnICZTpH0Bw6TcZUwVPEbMFKOl7pPsZmOl18RcSKwVAkc3xBOmt8dCR+cpwkUCFRxk98ftFzmIc6UcF9OmgkWcFBJET8VcFbOl98XPxdwVc6Xph1JFh4Kvx/OlS3lvxW/HQhRH2e/EMkRLp/JFS6aTReUCAhV3xwIXy6TKRw4UsbK3EaumP8Wbp6pFwhW/xeun6kUiF3/E5Kr/x6IXm6ZiFNfHYHraRYAn4hblAhIWO6YwJHpHwGN6RFIW1Xr8JEgn3hWqFT4UB6UyFqIUshdAAbIXkCRyFNABR6dyFtAm8haFg/IUJ6UWRb4nXCaKF7AnyRZ15cSViBcuRn4VqCdeF8hmJUkqFxen/CcoZD4UyCSCJMcCBRaeF2oVLhcRRYUX2RYISxoWD0fBZRclHQBaF5YpGBVbEA+ngRUPpQEUPiSBFT4nXic0lU+luhQeFcFh1aZ0lHgk88dTKQSV8GTRFIvGb6YIxvYn+mW15fxkxJa+FwUXKCfwRTaWZvKclA2liGTqFlRkJmTclUgVHbjIFBdrZhQClywlGUasJ+YXDpQuFGXnTJSwZEOlK8XMlcXlVhc8l/QmYGe2m7yXB8RqZXyVamYOFbQXS7NWFL2m7mc0JPYU4GZ8laTHfJeMJalH3BFKlWlEoDHMJ2cWLEp1p/2k9ad+Zc4X7JSOlKSUhRbZRB6XjadDp8yUcGcf+PkkIpDwZu4X+hfuFgaVsCceF26VqRRclrkWEstml+enxpUoZ6VGqGeqFz4WahTulqQmpJR+FbhLSGbCJZVGqWEYZ2gkTpdspgEV2hUVpdSX0rGPpLVH2GfiJYkUhJWkZkkV0RSkFDEWIRXslL4VUZVhZvEUJJSclP5kYWTFu1GXQZSox1yWjeaKK61HERVtRcRkiiftRoUydpXuFTmkXUSJl/aWhhaOZKXkgpYpl0mXPUSfpcmXxhb+Z6aVvhTRlxEnzpWplv+qtuSGQZoliiQ9kjhniRUJlngFbJU+ZBTHRJSGl/QVhpbOlxyXtEThlzkXqRfhlndFVGdpFooqhidEw8xmfEoZFyxnGRXGJzNFmRfQlH9abGVZF4z43FnZFr7ZppcklMWVOZQRlkaXfhS/0u9xPGWtW5UC+RaxlksVcRZZlPEXWZRnyYUUaCe/epglcaTL+RujrRbRJdyldZUlFXBkpRSzqPEkkYdhljGGHRayp0MUbxQIlJsW6eoBlmRZDRdbFM94FxU5JRcWTRa5JASkBybNFv6GNRf+hB17DZVuFeklG5AZJmLEQLkZx/CVzPvlFBHFLZVouucUaKZ7J5HHeyZVFIqneqVNF4qkzRWXFc0UmKYyxrUWiKSyxaUVkyaUe/WVcsVtFAuo7RbEuPaGpKXgpQym8JSKxA97kJfO+8gGkaVMphiWqASjFJiWVvmYlA8WUJW3+pw7oxVIlurFDcm2+C1aGsV2+v0VfhB0pAMX9vs1Jg75tSaDFo74dRRdlfd7NySb+CUX3KZKxCMUGJUjFRiVY5dCppiVE5Y9F+OXrztbeOMWeYXjFGm4ExVtJ/Sly7CzF8d4PSYv2OSoZsUHeWbFXSWHeScWXSXTFEsVWKgrlZk6pscrlVk4X9jDJV+rgfrzFzXEgKeOxgsW53qjJHCVn4e/2NxZPqWwFY2Epqel+jD4kqSTJD8WLxaUeysXsMuIu1MnZRbNlZCUfmNrFjMm6xTth+sVXKYjlpkk3ZQtlSz73ZS9ej2WeKSNFXH46Kc5JW2X+yYYpP2U/se7FTHEO4YfFG6nHxfMOp8WAJbupzcXqqVfFIcVaqZsOAjp6qVw+BqkFqTp+xqkv3mbJhUUycbIlC8XxThdJtsl/3vbJL8WOyfIyieUd6CtlLr42xWnlnqkZ5R9l22XKSYEpe2VByXnla8nR4b/FPsUnxX7F5qoqNiOpQcW8cdXlN8V6NoLhyakiccuxz9a5DjlljM6IJeFFLl7IJe3pz8lV4c7ld8XgNpPFZakwJRWpcCWacbXJVsm65eA8enHcJX+pCOVXZUjl82Xdap1xWMVWnrbhXak9yT2pUhohDsXldw5DyWXlTcUXxSAlB6naNu3FU8nDPjPJ1smzqQFx86kZmW/FO8UfxZHha6nL5XHWdcVbqQ3FCBXnxXN+yBVV5agVNeWpccnpsSrnyaWp2XFqcZWp8CXsmjepAP53qXmpxclN5Ypxr8lvMYolhc4qJeL+BT7sKYxgf8mEJRcpP0mNqXwlgBVx5YJOVuErKc9FojaiJQW+4iVbPiCpXT4T4bBpyCksJVGqlP7oKfHFE7HU9jYpDakW5Qop/MVzvkoVMTaqPqFxPXH5KcRpZ+W7PvblciVw+a9+zCk/znRpbCma/t3lVkx30Q/lax5q7hse9AHp5tvRFzxb0TaZKiSASdmudpkXXqBJQime8euloFm0AkhljzF1pEXyC6GXMdlWsSmcsfEp2nkuyfL2J2VPMalFkSkg5XxJcOUYaf/lJkktyYIpKikDRfBhfKkkcWPla2UT5cKpd2GOxTRxEql1RVKpf2UaSYdlgOpk9iIp1lZnZWhpXGWc8t1FJ0XGxcAVi2VmxWV+QLHw9mx+rRXOfutl6eWbZdPlWeXOxcJ+AakE5VNpLUXJRYDlZRXjZelFoOVBSe+O8UWbRcjeSSmExa8lelF6xQJJBsV8xXNlihXHCudFaOWIxWNJyMVQqc329WHCYeoVIbFCJQTlB74S5XUp5Ul6sdVJ30WtKaLe7Sni3maxROSaYT0prE66YRVpEMWrxVDFhsUh5a8VZv7mYcNJ3GGjSW/+3xUlKb8VAbHlKaCVeOVAlWLl9b7klaH2UuWlbjLl+yly5VzA+uUpsYneh0kq5YHeCDLB3vwVOuUo4QzFcSrfvgkqv76e3qTF90nkxUblz76tYTzF6sXyFbHl2d425cxpcH5TcZgVTYmJTh4VDm5SxW7lk2HEqcOaXuXTzl/lmFJ+5TvIqsXUqUHlmJU4sQbWBpUOmEzJPI4TFeQsUxXCSRypt2V2FVZJzqn8ycsVZLHE4a9lYM5VRcXFTsU9FS7FfRVZykGpHsUF5V7FReXyNng+v2FnxcOp+8mXxcHFdBV75cJy9eUabo3ltMVZsrHFbeUmFQqVWBVa5b3lc8k4FRnFeBVzFe3laDG8qaABVsUrFeSxckmT5RsVN95KSc5YsLHz5XThMqmQFTXFpBV/xeQVACUb5VEO3HHb5R5xu+XaqTwu6XGH5d3F7uVpqeJxkiUi5RflnWX+Rdfl/YWoJZ8pPWUZRdAlPuLMmj9+8T4f5V3l8iUTXspKv6nv3g6VVuVOlfHlwNYqFZJhIZX55XKpP8UdlavlJeXr5TjOxj59lS3FCZXrDvQVYcVuFduVuZVPxYWVA+WZxcFxoBXY/kQV1cXrqSvlsBXrTqXlPZXH3lvlz5U75YmVQ5VhPvo2p6lP5awV65Xa4UXhnBUzldwVRXH3qVYl6CXPqT2ar6m0aXqO0P6fqYLSBCUG4Uqe3UkylTHldRWusbhplJVW3uQpNJWUKSPhwuXQaboV1VJwaXk2GeFz4RipFqmF3uMVrOWFYSMpgGmc5faZG3GnlRz+kmEp0qlJLFV0JVOV7FXKlRRpwv55jl4Vpz64JT/Jho6LNrro2iVLlbolKUkHcejlfOWY5T8VGC5oxS4VuC4uLp1aViWyCEUA7r4oJYElPmWCZYMlYSVtGcGFSmmmZYOlPAUTJaClk1FjpYIFkWUhZShFhyXxJZkB8WVkWc0xFQUbmauJeSXuMgUlOPGqBTlpe4kE8b8c2Wn6VZUlR4nKBcWll4mNJdeJ+lXZVU1ptaXj6WxVGxlhPrgKiumllcAByRWv6eZpuzLFFbpJKGVrYmGSulX8FY6k7xXLSZ8VhJX85aZVxt5KsQsptCnbyOViTi41iTMx2wiD/gHMw/5AhVP+SJbj/iWJqyQ2XtP+Sm6rniLMC/6GmWvRP4mubpvRFpllidEVYejxFdK+iRUKJdVVVBm1VSUk6RUwSVzkZrLyBaPpv+UHlTUV7OXFYWJVCRWWScx+497J5cNF4+VQAR0VVLF+ld0V32W9FeXFUFrmKjSg7gHD9ucVCN4FFZTSYfoSWVJZ3iWzhE4lniX6udJZrIT2JbH5zVn2acpZ8wFwdLDEToSjgrjBBfq1WYTBJfoJwqXB2fl+JR1ZiHgtWW1ZgwEU1V1ZpwFFwuE0rMGChBXCR4KBQn65WrkeIoDZB6F7AL9ZO1kzBkXZqobsMXDZGrk/wjQ5urnQ2WjZO1lshug52NnyBMLVyzkDwUQEU7mqhqjZeNlOuYbYDzmyRtDZTEBTWfDZ7NXhEP9Zlbhc1UtZK1lFRoYGDCFQ2VtZm8H7OeNZPEBHWWrVFrnyFGe5gnQo2T1YN1mCIgTZHiFsQlfBQcFkwvv5jtimEJTZItmGEDTZjtVsQqKBMtWiQhzZNAZc2fa50ARFFGUGAtmB1cLZotlMWdbZ6ULR2XpC7YFhuZ2B27gduL7Vltm62bmBE4Hp1Q04uoYm2XHVc9gR1ZbZCdlhBrq0bYHq2V7VwCGqOQnBvtk0QnrZEdkG2bmUwdnSBI9CHiIplFbZgdkSFJnVIcYBIo25jQa11SxGw0Ip2ck5Ewbp2S1ZBTm7+U9CI0bj2egARUb81dPZ8EE7WTZCldmvQgVAi9mCREfZUtUvwuvZyCCH2dxBVrmyRgfZqNlTOT650YH52TtZhtVaIcp0Jdlm1TBBI0bV2f/BetVpuQoUZrnT2Y3Zb1nO1YUGK9VeRVvZ5YDYQfnVAIEjRufZQDklQTnVBkJKuAw0YkHWIYc5YoECFNA1L9l2uewh1CLoNfAhsbnExFv5ISGBuV258Dnq1SgE7TSQuQ5C0UEgxrGGskaYObW5GSEgwWuG+DnmlD85FLjk1NnB/zk2hIC5fsLIwRFZH9nHOW7G+lnBwpVZY9Sl+s45+qCuOe45fsReOajEmVQVqF7I/jlU1TTVx+AKNdTISjUY1WE5QLkROaXCUTlyADE5rthIoTfYC7RLtH2wSTnjBvs0aTlbFHFkU/FZOQLUuTkigF/kQ3CL1Za5hDVHubU5l7lh1VNIZ1m2Ql25XTkHwehBcYYDOZ3AQzlqdEs5+DXFBpA1yDXRgRs5uiG4AO85ZYZN1XnV8/kCwSg1+tVv+B24kdXKdDa56BAJNfDZldVmtLg1d9kP+a3UkHTjIdCUPdQLAXuEiLQk1XK5q/jQ2ZXB/HAYxCq5GMSl+XXB39X1uRS4PtVQNTE1SNXNAIa5IZDGufIU3TXRNXfZCtVFeEU1urk5NcKwWDU82fH4mTVpNT/VhtXsQighwbkzGjx0AzWUAEM1PMH+Was12/l3OU745TmeIl25AcZP5WUhLDm72WQ1hlijWQLVNsaJxtdQubkjWXNZBbnjNS7VQjVruV5FbES31ZrVzSLlucO5bcBVuTW5RUZP1UO5mzEtuSaJQkXwgG/VXtl+NT25TQB9uV/VItXZ1DbVsLX/NfPAo7mXEgeyx9loBJtGk1Dr1RQ1R7nbudvVYtV7udkQrNluNXu5HjUX1Tc5pLWeNRTE17mjIq/5VgQSAOB5BKG+okShMHlodL+5znBf+YdIwHnaoR6itiZqJrN0CHmLdHYmj7kqoi+57KGaopAmn7lIeWAAH7mkwqh5MsSPWHLEPoAKxCAFOHnqxKrEFET+JijIeaKNoSd0+mXoZYZlWUCfNS8Z2QSjoRgF1ABYBWQFuAC4BfgFpgCEBSIQxAVYBTQF+QRzoW+oHi7oSgocMNVeJThKZ1CXWH61fTUBtScxMADVRE0EKDZjES0lxujOCezxnoWeCVTF64lL6U5VAyUtGcEJrgVrpTVVWQg0GVulQVUHJWeFRFlDeaLQsyVfbghlIQWomerx82ma8aslMQXrJVURCFluVV8ZHlUQvmZlckUlZZMlu6WXJXbxiSVRZUFFUGX+VSpl4VWgMZFVMpnRVZYebKWnpXBZO/GXpVjpfYVmhc2FgrK/JcYOIyV3JWMls4UWZQAxVmWRMVk6pbXsUeuF5BnwpZMFJfFIpVuWcwVGbgsFTHwYpbJiWKVrBbilGwX4pYDqhKVipcSlhRWuCeMO5KVjgJiRdOmiGCPxY/GEkXSlM/Hs6Yylq8D3BSyly/Fy7OyljJGcpcLp3KXopV8F/KU/BZLpfwXCpQ4sOwUghdKRCSkfSCOFtxZQhZjpSoWakQiFKqVf8SiFJuk/wPKlFulYhRV5eqW26Q6R9ukukU7ppqWu6RalvPr+kXeFiaW2pbIJ9qUECcyFvPSh6eyFsySchehgnqWx6XyF8emChcqkLAm8FanpEGVSZa1lO7WRUZVlDGVCCQqFsaXypWIJChnsdaRldIXJpeoZfbUOZaOl4KWhRUp1uemMZUiseaWulpOpXD7sZTUlnGWWhblV1oW9/vpV9hENpa0llgU/kfVpNgU9JfVuwFGptakZLlVjBa5pBZn0RR4Z2RneVfp1pWV4ZeVlIJmNZQiIeXmdtUplg7XOZamFEVVmaakVK6WThSBlm6XjJRF1CXXbtRUJu7WwZeWFR26VhaNqj6XoGXuW56WDCWqZcBnvpVJei7XUgsu17YXkHjWFz6X1BfWFb6WNhR+lt6U/Jd+lRBnTCT+lD/AAZfMVphnDJVm1J1U5tZ4FG7XNZVu18nUFdZlue7WOUeW1hgmbhQ1VdaTGtdRFGGWCGR3pYoWydbhlXbWxZfHahGXyhUm1ND5WpSXp2nWPhbIJqaV7ddFlUXXKZW5FJnWyGTmllkwWdVE2dm6lkf4ABVV2BaBFjnWGFXxlnkWzuY9AIgmJeTJFEQm0mdzIWdEMaLzMnbCUmSD10kXYMRxuCBm3pNvx7XUckbDAtWVDkUNy7bW3df21ZWUPdTZlgVUdtb5VSglGdVclw7XptT8JJ0DUmWnRMEpqgHD06Jk4GEyZ3xE49ZJl+3WJdWT1PbW2ZZu1KQn5deJpF3bpJftMYuQjCTelLQWqURj1nzUHGYlST8BOULcCvMw4meblrZRXILzMMvWyMHL1eBktBaPRaPVeZYdR9mlZsj2Z3DH9mT2szubI9SLIqPVVzPuZJjFmMZ0xp5n3KueZdjGE6IeRQRGRHHlUWwAL6mdsQmmNmjFmkFnVpaVuDXVZgnJ53THeiT5VLWVgpTJlNeI0WWyAdFlXogxZAzGwwN2ligIPQIOY3ioAADt97GKu8bbFdVT1Rm6B8fRZo0BtJsrRrmLSJS4FHekwTL1aEEWoZVBFzlWU9SX1QYXNte4ZnRleVeGFM3W89XN1/PXqHhhFcjFTpQUFhbVoRYBZgvXBieplfImuAAKJpEXxGeRFIkX8ZVRFzAWGZbRFpy7DmUWZt1HV0aWZBnUDtZz1CQnc9S316Xkc9eH1L54uZQllbmUQtR5lwkUA9ZX1/SX+dTX1ghEPmZgxgWVRJbslb9GUZez1fPVhGZqJvbX5tZBl+PVJdVyJ+/WrzMTRsxlb1vpFqWVKSNGJ6WUoeiZF8YlmRROE6zHOJSG1KfpiWQJZiNVxNZH56NV+EZ+GaNXrgqE5swGZ+ljVBcE41Qh0NTXEwaTVvYgRtanCnVlU1X1kMhB4AGgNtMGyWVTV3VltNcXC47SX+OXCXfqs1a81HNUVuKW5JMao2XwQe8L4tfNUcYbPWbjZfA3EtXv5gg1XWYUQIg1XNdLVrtW76KkQUg1eNTK0RSJdudrVIhAKDXW5mrka1S65ttUm1QPA6g0dNZoNvIAgtZtZ55B1wPoNSLXxBjC14tV21cdZ5g1ztN+BM9UWNfpIGdnsDYR0qPin1ZvZN9V81QS1cYbX1UPZog3auV25bdkd2cfVFLWyRn3ZxjFgNdS1StUjRg/VVzXTOdGBr9WP1aiBH9XL1NC1kblduQ3ZAkERNW4N9FSmuaKGI0akNYoN3Lg0tXQ1idEMNRYNiZQJDV259DXAtSkN0YG1DTtZ5tUjRo0NkbRMNYaELDUlNRo0YCLP+XOQ5Dk7gpQ5BjmN2C74BLlMOcK5UHAjDYZZ1LlG1ZMNnfiFWe54kw3SuY454jXMkC45bjkeOW401UTH5DAUijUhOS1Zwtg7Deo1ew2aNT1ZAw1t+ro1frQGNXE5JjWJOcPAqdmpOb+o1jWZOVpI9jUUBI41+TmuDeQ1OLXVOVS13g0CDbJG/jUBDcTZa7lL9CE13RDktZkiAoFZnGp0XQ2ewu80YUa5wWcBkUap+YXB6fnE1YQNdTU9FNVEjTWYIi012MRpRjgi4DkvFN8NqLVgte/gi8DVgADYbcFT4IvAHpZ3pAIQilH8DZU0e7nNueSNzQB0jRbkDI3nRsUNdFSBDR81QPW/kJSNDPUMmd7IncCJ0W2Uv5DT4ByNuwBcjQ/B0g0n1dU5FbkG9ZcURvV/kMyi5uS7AJb1tbDMojb1mYhSeeJI0Q3CwqC1BzEAtT+AQLU7WdUNR7lwte5lQNFQtckNC8GkjSaNvblpDU0N79WKjWi1TQAYtaTiZJS8QuU1YYRAJpJQhqJ7SFRQ6EQ/+QK1oHm7SGt0aHnloRh5laHYecgANaGxBHWh16gGtUR5+shzUAUEdYQMRKIcVHnDAUocjYKOAPoAISy4SphK+Y2yHIWN1wB7WH2Ee8CRtYgOB5YQ/KBy/XZBHkumvPH7sud03K7J/LyuMiIKZjEmcSaqZokmz9rfdGKu7aKPsr/Iz7Jf2p3IP9o9yJ+yE6yyCLDl6GloMYeVdKnkJVfxC9KTCCfIc57s8XX15IkN9QOlYXXN9SH1s3Vh9W1lVZmb9YeNrfXHjQp1265AWXKa5XWKmZV1oQEYrg2NPfxNjTryTB6WYHeNtQVMusIcQ+BSHCMB11AVjcWNzYJ4Sv+NyA17AU9YE6jdgnsBmNV5wdAi9HCojVVZ+NU1WQTBBBAtACVEZITrAZn5RA00hDWNHbSvhst4RY1HAaQQJwEdRASNfVkV+QNZcoSCqOkGabkjQc/VKbitcEyNpSKbRs70bjkwjXKEx1Sj1R2ooDnctLcBngDqhDsitqi4qHNETtSQBDRNnTWQSHyNcYa61ZUNDrmQjYvBho3KDbq5q1mfgRchmMYZEIJNQhAiEE9E0+QxFEQ5Jvh+jZMhl8bTIVCht8ZlxtCiFwCVxschY8Y/IUshRjXvxqshVyEfItChQKG/xqChF8bFxnwA3yEIoXZNZlQoodchEKK3IT/G9yF8AICiHk2QoWCiEKLmTW8hLk1Mol8h1k1bxhiiiKF+TfvGayHOTWihJyKkom5Ny8bgoVMh68aRTYcijKKfIcPGrKJfsIshWKL2TSshU8YAoalN6KF3IZihp8aAorihAY2kUEGNxqLf+TKh6qFYqIJNXkLCJl1NzrCaTZ3A2k2ixCJQksTDdFGiHoAxouh5EMhABVh5mrUJjWAFSY0QBSmNhHnQBdWEJHketfRETaFgpnvFwalhldeVsja3lXAVEFUPlVd+FeXxlbBVr5VJlUNy0sWicSfl2H5IJIRV3hXEVddxAC6fSXBKbErKDuOO27HfqS1hhFjvKR9N3VpWVWHg6krojl9N/00wpSqZ+ZmISSF1jfX7jUxFPPXb9c/1M5mv9WeNuXUk9ZCJJ43hGaplGSWLpTjey6WQHFaVJxoMBXJA4NUroZDVYBnJViNlRxVjZRIppspmYjviO5VDZTIVUeVyFTRVHOV9RfFhjRVnYc0VlZWelVop3pU/Xu9l9ZX+KbPlu2U55Z5J302DFQa+wxUA5aMVX5X7lfn+91WEKaJVnM0SsdzNRHG8zR6VPv4CzRVFPpXCzZPWDZXJytnlANW/ZcGV/2WHFUVR02rqlSruYOUUzRDlT1pxsdDlXYWeAap5kMXqec8VWJU2FW8VeiUXRbzlXxXdVcSVZlVC5RZVOX4QKe/F1JWvRcTl9SkQle2+gt5KYdROVCqwlWph8JXhnIiVwMW9KSiV4MVVFYuNys0iVYlJa3Fc5e1VGymdVdVhxSm1YSSVd0X9VWjlSyk8SkupYNYAle3q3nn0lTcVsuWM8VfALJVsxYbl5bEclbjWXJXq5byVmHH8lUzFXD6dzWKV7MUSldZOUpWIqZYV68VezSqVwsX0KfxVIzazlTIlghW9ZSl+Y5XalXLFM2Gf5aAOBH6UqYHlnzE5RRaVoeUMyT51NpVTZe7NR0VCSUeVp0XOlabFlVWYKYsVXPYOfk9l+cXtFceOvpWZ5SXFc+USzcEprZXezgrJN5VgVVGV8BWQVY+V0FWV5S+V+07XTcUOKZWlbmmVSf4t5bDhN07D5YjhnCVWqfYaNqnYcejhz8UCNoPlnKqvVQ0B71WrZasVn80+yZ0V1UXTRbVFgZWA1YvWi+XyyUzhIC2RlTFxFBUQLWdNSBVn3nd+8aloFYmpiFVCFbdNx+UZfpOV/cUFSZhVOak8FVJet+WFqevNK5XIVZV+bBVv5ehVbQ6nFXmOP+UszY8V0eUAFXKVrP5DDqLljFWDfl3JEBVALcwth02gLWwt3ZWnTYHFMFUDlXBVteVPzXmZJTaflVwlIM32qQvJxZUzFvXNgFWryUwtn2GgVawt28lWLZF+AT79lWOp9i0MFZ3FSFWZcVE+V8lKLZepHBVWNtmpD8m5qdIto8WK4fflSRUEVdRp387qVd/JDGlfqXVx0hUHRdfNM2XmlTcpQBU+zQxVdb7LqY3N/GCsVaHNJ+GMJSNxzCXwaYYVE3HGFUpVmC1mFZlFVFU0qZbly42VLTiVyhVSVZqxahXMVX1xmhUDcbJVrhUYFcpVSgWqVU9NeS1qJRIVs8nWRXLsQi09xTqVCOkXzjktohXvqeIVfhWQzfUl85qaLSypTxUDLdYVei2a3r7NHxX+zV1VJlVBzb1VDWEKVXnJJp7u/iN1GpWj5fzN7qmCzR6+DsXULV9ltC07Fa7F0qmCUpH+uOW0lc4B++U2kjPNOn7MMoFaqf7GlV6eXDKZ/hIW36mKzSvhGJWezafN2JUwYVnFny0q4S/Ncr6lRc9lwsl2xQUuE0WbFb/N4s2mzT+xHf6MFR3p+WLAzR6Z32RqVbfhKy1HLe9NeWLtWkzO8zEfqKSw2/gbYgNQl+gs8D4uTkjCrVcovzCBLvwQ9qiSraKtuYjqgBhAuE21jWRKSy0crfRp6iXQStJ1ycVHIENVAxVSFX9Nw5XUekaZoRUb0WLR21V+duWJ7AGreYbueLw6/syt4GpSzYatgDauAZ3STiRAVW2VIFUsLVvJkam7ybGVwCXcLQnJbcVvlYFi3kpalUSpO83YheElN/WRJVklwWXE9aH1flXr9YT1vXnozUmtpPW79ZpFsJmSBaO1j+njtY7u9EmLobkVcUUbRWMpR1XHZWt1dGViKf5JhS1PtObKNs2f7raVQlUXsVhp2SnlrVzlGs1vVe6Vb80p5Z9VN2HfVb4pIs0+qTtlJs10LWbNQNUHZeZWQxXeSRkV09DtRQW6Oc1GSXnNAGkFzYNlz1WqKYNFpC1VlV6Ves1CzVQtv1U1RdYuPn4ifnsVISmLRd92pMlvgETNEop2zbzq1xVkAZtJjJXRrc2tWUXHzcHluK3ezcMtC753LZVhvGGZSQ32Ty2KsS8tYi3n5eHNBBWRzdoVdt4xzaTlX0UJzXVJf0U05fROdOXdKRnNyJXZ9u3Nbs3olR7Nly0vFV+tsC4GVXiVlmHpSdMpgc0VzcHNOOUlVeYlT0XnlY0tTb4jlTGxj61OzZe+TJUlYGPN+0kWTk9JL77clemVApX0xYapjMWClTvqwpVFsXdJHG1AfpTFVMrcxTPN1FU6LbRVciWLzat+y82zcS91uKmZLRWtmpVH5VstO82kqXvN5KmUyTuxasX9LVYVeG2FAOfNEtGXzeYVshWzzaQln63XLW3JIy3oLeWV+OHazdX+us32VeNFAK2HrTQtx60oPqCtJimALYzh/i0+rRGp4X5DqZvlcZU0FTAt4CVWdR86CC3VUUgtj94xxXp+psmmqYSt3QKixV+V1qkEUrgt35X8NoZ6r8UlldZJFZWubU+xvy17rf8t383Urf6V/1XjrWg+gW0HxeGVAS2+rWFtMZURbYGt3OFgJct+AaUH5YItEa1Zydst+3FEbYCVpDJKBe5q85VmhTIthFJ4VS7lJanrNShVyc5oVZuVqi0VFYVly8VnLdNlFy0mbfPNrck3seBtwiVWceAVVcVerSQV5i2BLX6t4W29lVAtF012LVdN8FWOLQ5Fzi2mFUHh7i24FY6pQD7eLdRunq2mLcFtZ20tbdGVlBUBredNUW2XTbAt921pcc3N+FXu4jEtH34v5RepGnEqLffJNpKpLdZ16S2PqY2tqx6YJcolqv5VcZqtqy3oanKarKVYbcQl2K24bTtt9RVFzQYtNS274eBpfs17cZCtQ3EcVQyOo3Hk/u0taCkrLnxVKpU9LWiVJO04bdttdm27bYNJ1S0DfjTtOP7DbbApWhUzLToVXS0O5VRpSiU5PjjtOCX5LVqtHClKlultmO2Znm5eRYkJHj52Hm65ll5uWJYcAcceJ6bcAXjNAVEEzb9c51VhKcUeBTLpal9x9fWcmaF13JkHjemtR43JrVmtAVVpre/1cnWXjfN1140D9aZpPz4UUc6VXMB3rXRVGm3QSdbtSvbA5XWtjM0Y7WnJ9anWbbJttRUczR2t4lWbrU0VJW29rR9VbRVfVV/NBs1jTqLNjZWlxXStks1TrfteM62VrchlQ9ALrZit+CkrrW2tvUVp7RutXa0kLT2tpLE6zeVtHm32xVVtw62fZb6pAZUgrUGVk60LRQRhVs2JZDet92Rh7dr2D60bScxtfLEvrVfN2G03zSfNFS14rWZhh9JQbcRtBJVlzZCpQG2O/v8VEy2WVVTtIu3W6qBtXC4wbZ9FkJXwbVTlC+pwlU1JqG27ViDFfSmYbYntrM02bbKV8m1AaULtuJVOFfctu+2AbeRtzy2H7VHN05X7bcCVi0lb7fRtkO19UQyVu0UHKcyVIm1x3gblbJX+3r3Nl/X6/jTF5iqRKkPNAm18bZPthtDsbaWxnG2SbdPNsMnm5cntD1VQYWipduVzLd0tjuVSPuptu5UkzXjJBKkyxaLhCta6bZ+VBB2+kkaVP01N3kR+lB0qzfDqYeUXzRHlxO08JaTt/O1r7fht722PzcVtLm3Z7WQt1ZUeqYOtXql97TPlxe1/zaXtAC2MLcQVwC1/baFtAO0cLTYt0C2g7TFtynn1bvFtfVGJbVDhKC2pbWgt6u3iEpltWC0GDjltr+3/3pjh720FRQodlsWlbfZJL2UVbaLJve2GzUXtxs3bFSetuxUJVg1t38XQFTJ+XZV71iYdoS22LeEtd20OLRDtLqp9bVpt45W9xUNt+SlZqcL+420o7SKFfBVjxcuVk2U/DvNtii2oVYXhy20KxfHttFIaLSUty+1lLTitMh32bXttIy2fbeo+xi3HbT9tLHHNbUYd4C3WLckdZh23bWDtDi3Zld7l/hUFlfltW8U8lhBty6nfbUFtAx0hbQOpwS0BxaMdN22pHRMdkS2QJTSWq5VfflXJG5U1yUkteX4TbQBFaO135Q0dtSpY7QrtdeFK7ZytpFWSFeRVS8VfSZHlWi1szXJtqe2FzentNG1jLaoKUu1iJQ0try0IKUztDtL6FW0tUR5sJZ0tyGn0Hedlb61YsezNj1VqzSop/x3hsYCdhlXOFaCdDCVwnbLtTCnqrbjtvhXPHWst4MWNtV+JWu0bVbNVW1WliVatu1Xz7CWeWR5hkrclS6X3Ja0xVu2GykbuKS1IrJ2aRamBdd3SW82RrZwdWT7y7dfhn8liFSRVN3Fa/vxp8pq3VUrNUh1zzQLtFO1/HbctHVX/7QBtdN45SSHNOJ3iLVypvh1LFUodO63ubWNFPe0F7ate/e2jrREdfm3D7WOOtgGoAewudS3JTC4BBaVQ7WRJzZkpmbKZHJ0pasiZdu2u5dkd283Cnbstop0fyW+pPhUfqVKdzFqFVUTtb+2fHR/tyJ2jKb8dG63FzURp6p1FKXvtQB3AbSAdUB1iYXqdbpVazYadPy3lRd3tlK1ebT/NNW3ArZEd/m3BlXadsFpoATqdmk7QrTwuPMXwrQBhupkUqeu2Gf48Mup6GK1ynVitfO2Kne0dgu1czfa+Th2e/tuthZ2BHcWd2a5UrRodWxWD7ZWdNp32LrytT36oiY6tX02uLoqVA1qm5HKtSJAirdKtQwGyrZZI8q3SrYCwQq27nVKtYq2u5BAQZ52mAHudl51zAbBNyI0wIngNcCIEDVhNLJD1cBUQuRBuNMqtuE2kDZyENA30sPTV2CK35FuBRtn+Qg3V/foFNdxNRASugX7Z4dl5gaXVMgZGgWzV2dVGueG5oVkKjUQ1bdVF1f7ZiF1D1Q04hYFq2aM4V9nKOCi1OtkT+ghdJdUEXZQ0qF2N1fA1FYajJKbG1ASG1Yf6QjWcge8BxdWbgZ00ylQj1QSGezkJ1VOGfwGtwoPVg0JqTa9ESKIdENl0NwRDTQ6oEcam2QZCI9lwXc0irkGwNZ74PnjQXXGQSl2F1TYGDEJXNe9Z8k3YXV25MDWbNds1mF2ENY65PI3QQeRdcYZ9QRfZQYZJNerG5F33Rs7G4cAsXe4NvtncFD7Zxl3rQZfZTdWuXdmGQkEkjei4Xl3RuWM1OQ2G1PkNTcFCXSJBfCEuQXdBal3dISGQT0H9IRzCAl1MQTFdfMHmuYIiv0HcgP9BS4ZAwYw1R/nMNVuGabDt+pRNbDWwwfCNOcHQdDgNKI0vnUXBGfmuhCPgmQRdcMaQP524Teh0yrkpRrXBxcJ8QgpdnzkOjcZdmDUsIVBd2DVVDfUNH/i6XXKQ+l0j2faBGDWFQaZdGF3KBBZdMQ37NYc5MYZxXc+wCYZLXbnVTl1/1etdH/oBXWbZ1XgeXcw4oV3mxlwNKsK+XQ5dDF05kMddCDWsXWUGF10cXVZdnLTE2UU1cdmQOWfZCV0PQT0hfSEnXQ3CgQ2fXV3BsV3WIbldpAD5XYDBdsKH+auGHQ2lXRIQvQ31dIRQzLW2JhX4w9jquL+5UqI4Ju1NfLVmohzEkl3SXVpNKYRjTXIm7LXQeSShqibGJiK183SUoeYmLKFPuZWA8rXitcq1mESHqPNNcMjatb4mpYR6tTlwqY1rTagFuQSZjZ61/K1MRGsx0KgqEIUQzJAM8EGU5ZBPpCWNkt3S3XXAst1KEMGgDQRihiqtnHmpBJ3A8wqTCC2AumQZWIZ5/u7mnuOeTnmDnhDe1e3T0Be63gAa9FANEt1S3TLdD6Sq3RH5Cfo/KAoAugCYEEGUx6ToDcgg7t2e3XgA3t2J+X9YdV3PncOCaI33hnRQghCK3W40Gt1/nS+G+JTKQP7d+BBPpDiQXphbtDUAe/h+3Yekx6Sp3XsQfUC9XYzV7fq4AGndtmyO3c0Aqt2MSGJNIdkvFNy0nE1AdBK0ODT0tKy0FPiFQowUcgBDWeP5msE4ohPCd9h+3bPVfJAl3X1AX+QzcCKAgERVSJvAEAAigEUA8JAigCJUE0hWQie0B/k4gC3kTlkwwWA0k/kwwWAUsI27htVdXDUTIUy14YSIRIGNn/n7SKGNMqG/+WmEkY3SxGzdGrVBgBeQnN0GUDq1UAW83SwAq00FooLd7rWzoVtNGPDeteKtZvQO3ZLdluSPpFs0TQDluR3YzQDmkMFsVajH0E0A2KBNAMyQQZA1JgrdAD2FEEA9Od2gPTIQ3JSQPa1GinBz4HA9CD1Qcurde8BnMdtNFiDMkJOAiD2wOhkEhRBS3UNwHXBrJrF13ep5gIUQ3AC/6Knks8A4VgjsmcT5xEkQfBADwHVwPXA6Uaptd5lnXsAA5D1f0h0Q4uYc6NH87ZnSPTfmcj18WaBoit1NAIA9h6TAPYWgGD3gPU0A2D3QPXzwsD3wPZQ9u0Yu3WMBvt2J3bg9iwBPWIY98IRQTaY9Ht3mPZiEmJCEPUHdPDXZ+vVdYd0s1E1dEeTfAFHdUt0x3cQ9Acic2H7d9j2WPU49a4K2PZQQwFAhPUg9WjW8NQBGRd2D3Tx0yt1O3U+kApSvgbwQHRAisEuwqJCOAFk93hRE2aR0IV2gNF6UU9V6FAndHt393cXded01AMPdo93j3bWwU90z3XPd38K5PfaQLT1L1TGBPDiytIU9SdguQoYQnLxt1JnBZTUMtS/5KN2H3e/5eoBtTby146jn3eGNf/lX3QAFfaiKULfdsYQP3aeo3N13qC/dFYRJBIa1600ZjXrE391etZR5G1BKPSg9aD0p3Zo9WD2sgDg9nER9wPo9yt23gbjB1j0yrT490t2qPbLd6D1gPZc9UD32Pf3AcD33PUN4Tz3qgLHdfiX0BZhgdcAQAI0ODz2P2s8wkjVWsFxyVSbhxLag8jldhHnEfBAdQhho14QIvRHQYj2TgJugEVinmJMIGEDR/Ac2fwjdbMI9rPQ4MGS9N6CEvcS94aqUvVeWtWn0vZfl9W63DHWCyj1vPQ+kHz2YPRA9Vz26PXg9Mt1QvWiE0fpzhAuIQT03PZiEayCCvU89CllivSdQnt1SvTiE2A2PnVU1+A0yuSTVLz1+PUWA5NW0sLK9kT2SvQC9TsiBPWY94r3yvQa90ygMDYXdpcKVPendZd1y3cGgqT0FQN8QmT2LANk9bT1uvS69V7BtPQA0/w3AjWENRo0UxhqGkZQlPVR4fd1ODQk9NT1j3XX49T3T3fCQTT0buO69swCevR69rT3JvTk9qb0muTiApgZkxiZCvr2GXUZdlDXouEPY/T3QwTF4fzkL5Iy1oz0tTY5wJ90hjR1Niz3jTQ29UY2LPezdd91atY/d6z3JBJs9lERHdDrEez20BbIA5HkscL/d4t0vPSo9qD1qPeg9Q8D0NXy9tz1wPZbCSABYAA0AZJDIPa89473vPec9U73lDTO9q8D6PfO9i70HUOoAfsix3YahQkSgvWkAKhByAC5kC70GAAe9GGT6oKeEuXT8PQUQCL0sPWw92UCVfGQiv4Cgybw9/D36oII9m6AqEHXAA8CMPbloOIo4vWZ1PuY0vSB9mfBMvavNArGwfT+NUUQYSuy9a72cvRu97iBbvT89u72aANe9S73iSMY9UwG6veTwhaCGALh9B70+3WU9ET3EfaR9+73Lvc49h4awdLgN7j1iNeq9/93MkJq9okABPTq9xr1yvTR9N710fWE9lH3BPXx9eH2HvacN4TlcsJcB1r2l3Uk95d0pPRxNaT3UgIB9A8DOvYm9Kb1qfSi4zI18jV3dxjWTwqG9v4HSfUPdIhAj3ZG9E90NPbG9shTz3UK4Cb3ZPRm9HT3Zvc6GDKi9PQGiJoSDPTo0hk0H3VW9g6g1va5wZ931vaTd//mTTYAF6rXABQWEC01c3Xy1JYQbPQR5UAXv3emNQt37PWR52Y0LMcc9IgCkfYTwO9SBtWl9OH0Zfb2EMACx3bHktY1DhJHcI4QhAGOE4phQhKkQVUgQAKekOX3L1AR9fADpffV9UE1NfZl9WA1J+SHd8E0NXeHdJcHZEGSASWEDwBx9hX18cB8QgBAkfTh9DdSLBMLYo31UEKR9k30ggDE9zMGSfaS0RGgzItcN8JDuSKY1K7R3DS2Ez9ibfcGgRgCoAJgAnACbYosEsoAnfdwAGEDEkNV9IoD4lIJITHitfdKoQUbb3b85u93lvdw1DH32hNjVzH3NtKX6fX3XhLeE5fr3wnvAR+QjfdV9432vlDyA6fprgjN9EP2IeAXABd0ktO36q311wEEQyjTZQKNQRIDZQNPoDfm2tJt9tw1UELt9zbD7fYd9x33VfYvZJ32YAFd9M323feNC+JAPfXV9RJDPfam0MMHaNE/55TX9DSf4Kr2vnWq9hA19fWeEQ31avWD9Y31zfY0AKADfKLD9ov24AOL94n3aNct9yP1SXaj9xHhdhDj9lU093fj9ZjU7fT2ZxP2LtAd9R30nfVD9532YQNd9gBC0/fd9PZSM/U99bn1ISJVdbP0GTcM9+92VvbTESEQ+faOofn1DdAF98z1Bfc29yz3eJhF9WagMADzdMX3bPWmNM1C0RJtNSX1FBEc9PrWyUB+9+MivgfIcsf0HUHoAlnRHvXvAsd1a3djIxX01QNVY5X123VV9gBCDeBsAB1DdSKn9wr1gTUn9k0Ap/ZVIq+DF/VX9Cf30fcn5cE3pSN19Hj3ojVhNfX0DfRx9Gf0DFLD9EACYhBSUC30w/eD9/f3zfYj95E1QqCj96312tAk5mv2E/dr9uJAk/fr9p331AEb9l30m/ZPdd330/RSQdf3x/QVA6jRwjSW9S5RDPQiNtV3Kvd99iwEsfXz9dcBXhDeE3f0+OXwAff2YhFD9030j/c/9CP2Lfeq5TA3UgCj9aP0QABj9vmbY/dP9Gv3bffP98/w6/aYAev1k/YAQFP3IkNT9N31b/V2EO/1x/dX9B/073Uf9ZNRvfdUUALmffa49od2X/b996r03/QL9c4L5fen9Qv29/W/9V+Ay/efkT/3UA+P9+9QV+b/9yv3UGMADs/2gA4h4C/0CSEv9ZP2G/Sd98AOm/YgDBcDIA8n9r4FoA699GAOP+fb9p/0VvTTEDXTH3fTEUz1HSBfdEsSBfTJQwX1LPaF9RET+/UtNQf2QBSH9At3xfZ/dRsgHPaLdJQR3kMYAMANTVPIcb8xWAwRURD1FgAuCRX2BAMOEdZijhOOEij0iAAX9NX22A//91gPNgmBNvgOWlOgNQQP+A+19wd3n/Ux9BAPwIs1dnf2dwIN9pAPA/Y4DXH0iALD9VUhj/RL94P3pA4P9DAPnDUwDiv1sA1t9m+Ba/eADi/26/aT9F31nfRd9AgOb/XT9SAOhAwRU4gPsNQM9rP1lvdgDH31N/U+dXX0/fTEDXj38EDf9AP0cfQuCx+RpA9iQL/2ZA2N96QPjA7L9sT3l+ZP9iv1//QADWP2FQIUDBP2cA6UD3APlA8v9MANG/VT9G/1m/dv9DQO+uNb9L33NAyf9NV04A50D3P2NXe39sQPEA3wQ54SJA7HdKCLC/VQQ6QNi/a/9kwNliDL9Fr1I/aXCzAO5ECr9qwNz/esDjg0z/ZADFQP9AAXARv01AwcD9QOHLHYDxwOtAy0Dpb1YA1CU/o3O/QoDPLWn3XW9Hv06oZJQTb033VoDfv3tvZF9gf3RffoD2sQ0RBtNX92R/T/d0f0+Lp6456T4fVl9eoBr1MyDYn1AvXvAlfrOA64Duf0eA5V91X2x+k1Cr6Qsg+X9rt1Mg6KDYn3pRJKDx4hifQ+dSI3XAz1949RxAwkDQP2x3TyDrwOFoGgQGQPD/WN9OoM5A5/9Zfnf/WAAU/24/fO0G33sA8UDYANggzwDlQOr/dUD+wNCA0x4soNdsMz9tv1tA5TULj3QxBf91TW8/R39AwN3/U8D3IMP/akD4P06g9MDtAPhg5vg0wO/AxP9+HjMA+j9ABLLA6r9wb2Wg0UDq7RE/WUDEIPbA//9uwOwg86DL9jsg1KDTQNVXZIDpTXufQ79FTXL5EqDbf0R3VAQ/P0PAxx9CUZagzqDHwMTA1QQbYPS/bkDOjX5AzMiQRCAg6wD5oPxORmDJQO2g1sDvAPQg/wDToN1A8IDroPyqO6DQUbSAxcDIz1yA0fdrU2u/Q4E7v3hhFhEgrVe/eoDPv3Eg6AFOgOkRM/dwf1Ug3NQ4f20g3QFUf05jal9DgAUBGEQGwBnLB/9Mq1YkKoAT4PIva+DXINFgDsBvIMlfW4DZX0Cg7+NXgNCg++DYRAsEC+D0P0HnWBN4EMCzF+D0EPrKI+D8ENQQzBNioO+g6q9yw1EA/198QMcfX+DWoMUlLqDUYNjfYRDhoMzA0t9cT3/AwUDw4M3DSCDWYObAzmDZP2D/Wv9BYOzg0x4cEOwFAhDpYNs/acDZYOVgzIDHQOdfS39PQNvnXcDt/2A/WXB1oCx3eTBBEOJ5JGD0ICw/YRDsYNkTYwD8wP9g44ASYOY/beBqYNDQiODawP0Q+CDUAMnfTsDlP2sQ+b9HENLMVBD3EPgdNb9y4N73dWDg4IYQzz9WEPX/SeETYPBg7+DFAMKQ+D9hEPtg3qDVBC+Q92DRoPtNXMDCYMLAywDcCDAgxwDBkN2g1CDoqLTgzT9hYMWQ8+DtADCA4uDtkMvuAJDjv1rg+M9O0jYg7W9eN0zPaNN+IMAyNfdO4MtvdoDpIMB/WeDlIM9vdSDfb0R/TeD9IN3gz61yUMIQ40Au7RLhOdQbUNQQx1DUt7vWD+DsAC/nf+DOf3uAxV9IEOmg2BDyEP08ClDXYQdSJ1DDX0iAD1DqUOkAH1D1MjoDctDXYRrQ+9YCoNFwrWDV/0BgzhDaoOSQ2QDRYDDQwRD9QBEQ95DJEOXQ2RDcYOqQ2FDa300Q+mD+kNcA4ZDkIPMQ46DiUNsQwiQ00OWQytDgdidQ9ZDKIPH/fxDK4N9Dd6DKfn4A36DLkOHQ4MDHkNDQ6GDJAA+Q5dD8kOP/SjD8P3Q/fdDeQNqQ0r9mkOAAysDz0Pgg69DGwPvQ7mDsAN7A99D5kN/Q7ND0IPbQ8DD5YPdDez9VYOc/Yx9bj3RA6JDfQONg48D6oN7wL+djTWKQ5dDfkPEQwFDQsNBQ+RDX/2XAQCDQINEwyAD1oOgg3t9E4MG/VODxv1Uw9v9m0N0w5sA/UMMwwQ5yIPnA/ZDGIPyAxuDigM4g4VD/n0lQ+JQhIPlQ779x4NVQ7oDFIMrTbF9vb0Jff293/TJfQKt94MWQycEV6Ssg17DiwQ+w2G1SQMvUCNDpX15/Z4Dk0OF/RZDk+D+ww7k4oNjAX7DIgwbQ39D3sOxw7tDlTVOQzcD9YPePTf9Xf0eQ8HDBEMe3WRDIsMN1IXDU33BQ4wNUsPUQ2r92sFyw5mDb0OxQ59Dm2JmQ+rDycMxwzrDNv1Lg5lD4MMOQ1z9GcPKg399gYMSQ1sBGt0vUCMDPkMe3WjDYYMkQxPDr4PYw72DuMOLA8mD2kNRQ/LDMUNKw+T9+YMzg9TDH4OyoCnD7cO8Q3b9XcP2Q6zDX31RAzDDnj3s1NnDbkM8wydDQcN7wALD48P0Ax2DJcNPwxLDxoOVw+pDg4ORQ7LDVoN1w6TDsUN8A6rDCAM/QwnDIZD7wyz9qIP6w+992UNv+XTE+UO+fbiDO4MNvWNNVsNxjRzdmaJaUNVDBgNdvfzdcX1h/TSDJgN0g4c9LUM+LhmA9QARkHfoWBDE1LKgsoCYAG4lfABkIxQjLxhUI2EQtCM+JadDCrkhw4BDYcOCg4X9jCNawy8YzVTr4KwjdCOLQ30A+1BMI6oALCM0I6IjUE38I5aQUiNZiCIjAS5pwzWDfcN1g719OcO4Q3nDTVnIw5MDdoAaOEXD10NvAwYjuoNzw/L9VENPQ9XDeP2/w2ODisOMQ/aDLENbw4cDEiMCI4ojwiMyI3sA4CMeg2iDB4ZXA+ojB0NiQ/DDvMPsQAgQY8P6I3QjmMOfAyYjkSPKQ4+dlr19g3jD//1Lw0ADP8OjgzaD9iNGQxvDpkPOI/UDriMKI9Ij0MJ0I94jncMQlN3DJ8N4A90DHMP+g2JDJAMhIwq5D8MRIxo4wsPGI7zYpiN+Q+YjlEOJIwODMsPWIxaDxMN0Q/XD68OAI83DeSPkI24jhSOiosUj6UN6w2DDBsO3uZiDxsPwI279iCMqAyN0+4NxcBoDFUMkg2s9ZIM1Q47DBgN4IzkExgMcYk1DxCMpfT618iOUI0ojMiM7MQwj+SPXIx4jRSOrgj+DOfmZ/YWi2f2hw8BDSH0Rwz4DDyOCI5MjtCOiWYlE4iPjIwUjNyPPIyED/yPuI2PgIiOrgqojjkNnw5hDF8N4sKqDmr1vI5QDESPlgFdD6MNYo2YjKkM4w49DUXhpIyTD44MOIyv9TiNqw2MjkiOAo5gA5YAlIxlDZSPHw5DDzf25+s5DKKOR3YPD6KNyNZijMSPYo5PDeiN8o1Ej5cMJIwvDGkPJI1pDqSN9I3pDgyP/w+vDJkNwA7kjwgNXI8wjEKNTI/SjMyOQI3Mj0CM9w2zD0MPIo7cDXMP3AzfDw8PnkIJEjSNCoy0juKOWo+LDnSOhQ7wQ0sNDg9KjtEPRQ0Mj5KMjI0qjTHgqozCjk0BwowyjsyPMw1lDyN05Q3Ajw6hKA/y1xUN7gwSDZUNoI2F9qz0qxMWE5IOdveeDdUOXgwQjpyMDve7DYt048J64kyPyHLmjaqMOAxfY4S6C6C4DAEP8g+NDPyPeA8KDeaMBAxKDa9S1o1edBaNPI9D9CKO9w0ij7KOGo5fD/QNHQ+ijJ70dtLD9mAABQ2XD/kPag8OjQ/12oyaDZoPOoy9DsqNko1kjjcPr/VSjc4MNo2qj/qNao4Gj5SMso10DwkPVI7DDQSNBg/UjJ73hI52DhP2vg8XDQ6PCo2/DIUNTo+FD+MMpgyvDf8Pzo5CDCqOUw8Aj5v3No7Cj3EYbowfDnoN+I0JDbKOZw5oj18N9o15D1qNjo6/DF6MfKLajBKPzw0SjPSNOo2mDAyOuo3Kj7qMqw6MjK6PGFJMj66Ogw5uj8yOefYsj1b0mwwVD0z3mw1GjpUMLPUSDc01xoxgjqoCJo/sjB3Rv3c7DJyMApqYDFHkkI+LdFJTsPZl8lUjdQySA2UA8Y0Wjw33+JaWjfINjQ/n9YEP8Y5V8mYBiI1xjAmMyY1BNcmPSYxsAaEN7QwEjhAOuQ7nD9SPCY60jcmM4o1PDw6OV5HdDsGMWI4kjj6N2IxADC6NVA03DnqMAOdxjmYA4Y5gDUCPtAxDDuAM+gx2jQGMqg1yjecOg/byjk32V5AKjikP8Y1ejk6Mfw0kjSwPLwySjc6OZIy+jeYM5I8uj7ENSYzxjjmNSA0fDOqMVI+5j7MPnw12jqKPGo+ijfRSyQ5XkVqMGY/5j0GM/AyZjXSNio1/DOkNawTYj6SMKw5ZjkIMeowljdmPyYxsAKWMVg3hjOqOGw+uDRGPLI1uDqyOzPZfd0aOUY9bDR4Ntvbsj4AV6AwcjF4O7PS7DjUOZo7eDFyM+LtD08wSqACnDOJCsRPIcq2MhkOtjMcObY9D9ryM9/U4AO2MvGIOYKcOnmGZkHGSNoOuNgEjkHQOgrGnhw0tGa2PRwyIMaP2K/XtYMEOu3adje2MiDAdj6A0/Yxtj6BCto0q96EMeY/3D2ENaY7fDI8M9/a0jJIAHY/pjgqNb4OU9rET4o/EjfwNmY1FjKGPPo8v9i6MYY0x4gONtwzEUShSMw4f92qMuY7qjp8NZYwajWcM9o8Ej0OPnkCPDWoPw48DjV6PFwyzjqONxI0iNoqPwY+KjEWNSo0hjtcMWY9mDWSOvo/jjLbAjQGtje8PE4zZDAaN2Q+lj26P7Qxpjh0N1Iwzj7EAa3RajyOMI48VjSOMc4xOIHSMVY/ajP/3hQ9Vj5mMZI41jy/3NY++j2/2E4yIMpYMk47rDG6Py4xTjPWO5Q5M9psOkY3iD5GOWwzGjs01eJrbDuyNYI9NjjGNOw/VD82PXg4tjzUPLY+LdtuMBw87IIgCx47HDryNOA+8jfgCfI9wj3yPD4NWjP2OvY3HjDygDAInjAONN/FLjMcOqY+nD4OMaI15jvaN5wynjfmPw40Yj4GP14yOjoWMrfVXDguO2I+bjIuMfQ9ZjS6PW40gDieMdY0zDzuNeg25jUMNVI9ljtOP/fYejauPyBEjDsP3w44Fj4P0L47PDhuO3o+pD96ORYzOjyGOrw26jouNxY4qjLWMD45qjuGPD4/+jkQPU452jk+N5YzXjYGMlY/DjOuPz43Y9MGPo4/GDDqMm470j7eP1Y2vDaGPxQ0AjggM/Q0fjJwMQIyfjaWMu4wsjRsN9Y2GjHuPKA0NjqgMbI0DIWyM2wxNjCaN7I9gjKaNBJmHjLGNZjUtjHsM+tYnj20PbY8Xju2MpwwQTaf3sQJqDImPp4xWjEmOF/TnjKcPzQ/1DYiP4E1rD60NQTcwTC0ON/QBjafmV4wPD1eP1IxQTcOO3QyOj7ONCExOjq+NhY2bjDWNd47jjPePi44njgMPaw8fjTmPk4yPj/iMV44EjRqPiQ+ijlfono1vgqMPno4ITIWPiE63j6+MSowTDNWPd3TXDHeNSEwxDe+MUw3ITRBMvGCnDChN7tEoTqWNMowrjo+Oso9wTGhPdo9zD2hO347rjYsM0A4YTBuMv4w9Db+Ofwx/jukMuozvjqGNZI1bj/+Pm/fIT9MNuE51jp+MOOK7joaN2BOGjYY2RoxGNI2Pe/VRj/uPIE1miqBPB4wEmoeNpow1DEeNuwzgT2aNTADagQLAFwIeAGwDAEPcAvGONE4yU3fitE9L9XIC0AEWj+EOUE2Wjo0NAQ5WjWeNCg/zYzRPXUG3AbRP9E5VI+eNdE9MTvRPtEwMTUE1TE5n4h1BPtH0THRNl42oj6hPK42JDUOOmo20gKQNI40+0iOOw/RcTxmPhE4SjkRPEo1vjQuOd47YT3eMOgzZjLWMbEz0T2xOrE1b9AaO/o74jCMFg4xfjnmO8E/TjJxMcQHPj4P0XE4vjY33QkyvjtxNwY/cTi8OSo4TDjxPWE9/jdhObwx8TTRObEysT8xOD42TjXWMU4xljY+O7oxPjwGOq4+CTFcFagxcTD+NQk4nkYRPc4xjjVWPRE7Vj/SNPEzYTZMOTg7/j4uOfEy0T3xP4k2kTQ+OgE+iD4BO9Y959xGMII2bDXuMFExRjRRNjY9RjlUOB4/bDyaO1QxgT1RPh44QjZyNmA7mNLHDPGAvqs8DyHOyA42TLsHl9QcPnQ8MTYmNjEzQTNX3Gk5aShpN1o2MBdpMGkzX9fADOk6aTexOIo8CTEOOaY9oj9SMWk60jqCSXE+D9QZM3E0yTr+PG41Yjn+OkozFjMhNvE73jSRPb/e6TLcAEk+gDKhNn40CT+qOX48BjYJO9iCPDv526E0GTMJNUEEWT8JPhkxETkZPhYykjqJPRk9FjFuPQA/vjb6OJk0gDyZOzwKmTEgPpk4CTamMHE70DfhPX4/6TgROw/UGTdJNjfcOTz+Plk3cTlZMIY9/DaJNf47vjTWPoY7ZjrZO/Ez+jwBPKE0STopMEYxATEpP9YzGE0pNII579hRMHg8UTVaGlE5gjKpPxBDNjqaNzY1gTIt3sY9HjOPA7ZpEsphQJotBD51BPk8FsL5MzAT+DJA2Wk+Wj4mPhw9WjH5OtRl+TowFfY2MBwFOgU4hDUwBCZp+T0pCvk56T7aPekzwTkON+k2rjv5OtI6gA46PRI4+U2FMio8yTRKOSExiTrxOUo33jwgOQU/BTGLDtk2cDnZOIjd2TyFO+E7ljWhMeQ1sNNJNno9BDmFPsUz2DpmNioxvjAuMxE7Oj2OOxkw2T9hO2YxRTLiZBtEATPiPOY6oTXBMITYxTnKMgYyxT98NsU5BjnFOvwy3jCv1RE4hjAlPb40+jwlPKwzyTYlOwU0YAUFPUU3xDG5NUxE7925Mf+ZKTKyP7k2sjeoAoI77jIX2KkzsjKBNTYw7DIeOHI8xjYgCJfdqT95O4E+KtqP0d2Obp9Nh5yOHC6Fji1M89IVP1AGFTlxI8SJFTJJgOA+P44S6rQALIHRCPxHbd2RAsgHFTifwJU9jBUVNiI6FThgCEUFBNJVP+YiE04QOK4+pjvZNMUwL9iABT48mEjVNaI8dDJxOpU7sBntiX6ErMbkgbgnlTlVPC2F1Ty9R6AFs0FVNlU9ejFcMrff1T4VOJU80AUVPT/QNQYcATiENT2UCEqFs0a+B8kL1Aw5TJAEYApgAwwn01KNjYAKoAhIDRkPtTcTXJAEKThJMZEz2oYpNu45uDe5Oe4weTFsMbqC5TmgNuUwHjHlMXk+REapM7PR/dflOuw3xi5yNBUyO9sVPxU7/M2MEp/c19MVO5U2DTEVPNAJDTbX0/kyC936QNgKVTP7D+dj51zgAVUzNTZITCcgjTpeDzjXaVZUxLjVctQ53qzR9tAFXx7hbdc626mG7+33mi7b95axa7xZfuuO6sXKByOsiEbGPtQ9B5YtgK6QzqktlToNP5U+DTMiKl/VDT4FMDAKFTKf3oDZLT2EKIU3qj4+M04xSTTYMtU1oTKtPHE3mTWr3avQCi+DjDU71TMtMcU6FNOtM9U6NTcVNS0/hTEZOmg9NTBVMi0/jTJbBEw4tTk0CFoCtTwZS9UxtTQqDbU5u0tmyHU1iQyQB7ACjYsszJAJ3klsJqgKkQcVMt5LAA+qAOoOHTGRQaVBm9/r132RvdkEZAIZv5eb1+kJ3kKNjZOSJwqRCPAENwlBgumGiQyQDRgBnTP4AicENwwZCPAHXAe4DsGIXTs5CLlPIUYtUAkzdTW5Pik7ZTu5NoRINj+RNzPUeTmyOHg+9TZ5N0Y3h5FRP6tUxjmBP/UwtjdRNR48DTjiWo/ZbCbETO081Uq8AKEEK98eP9Ayo9weLz01lUS9OAvadD3UYloxXEdcDRnDgwUJ3Xul9NCQAfnR5COcReMuHDOVOz04TIRtPNAJvTipDL04sTVNg/gOgNG8By07E90w042OeGTbR1U4pT6tM5OBrj/aN8cEBQjQCw1Lvg6WjC2GAzm+BZVCR9vUDcU5Vj+Hg/MNyUj9NDEIwQ8Kg/gItEj/n2DRt9MNT//XgQk90wM7lUW9OogI41P4BemF7YA4aFoK45Q3D6oJsAzgCpELKAH50XU1JTpSMU1BmTDNU/uEMNPVRowUsNHKMNg95jISO703k4fAAwMxAz8DNUEDAD0DML4OAzcDPpaDX6yHiaU6XCKDMP033ApDOLAJgz2ADYM51juDN2tDDUMAPVk5gQVBDj2WjUZ6QkM0/TjBDkM5ZZ+DjUM7Qz9DPTQEwzLDOXU2mTllNdkyBdgw1WObwzv9OiNYcTmhOUkxrTVYAnvY014jPyM71AalNiM7IzsDOX4AozjJNcMxbTqjML04VCljOogFozOjNMw8ADOACrQ+rAhEBMQMYzhDNCkON9pAB9iKoUngAUkD+ABMhMeHXAFDO2M5sANDMVxA4zjDPMM5kErDN/E2uT7hMcM+4zFDnAuTwzUFB8M3/TnMN9k72jKtODAyrTATNAM1q9J724lNCAoTOX4FlUMjMjwHIzczN9wIgzRuNgAIkzaDP1KHoz9rQEM6YzxDObM1Yz1TM2M1QzdTP2MwwzTDM7IskAOyK/nSjYTDNySAPAyQD3M8qtYkC3M80z+qBpkBXEP/i4Y/8TMlNWUyGjLv12UwNjDlOwE+sj3dMIE73TXib33bRjT93LTd5Ts2N/UzNQwt1sY0O9DIPi3Zkov5B0jRg9Jw0r0+izbcCYs381fhEpU8JjqYAvDJ8JuRA6UUx8PO2SHf2dtm2DncqdwQkKPVCEuLPzwPiz+w2Ok6vgugCuk1TYnLOf0xRDxhBYZENwfzTgtAk0gLQY2Ia0ebRQ2HiAyqImODX4X5ACs0Kz1bRIVKKzKnCx02FUkoA8QE7Y/DM5Y8h0HoQa4zpjLyi6SCNAMYNss4J9fARGs5TVJw3KMxX5DcCLIgSz4kjAA/gznLNFMxNIWIGv+jlA7Q0ceJe4OICvtKYQ77QHsJt9dlTtE2iQ+zRGgL+EBcDOANj4D9A8EBJZlPgsE5gAKNgSWRAkrTOkdAb4hHCcNd1jt1PZEyhEuRNFQ7uDspM+46NjsaMrPdCzHb2Xk3Cz15MIszOhWpOR40DTDRMYSlf42j2SsK0AxpNdQ6BoDbPgyM2zCjkpU8djfAACyNWAAshFANWAnADHfbKAkuiS6NkAyQCwAPUABsAdEHWC7bNNs6GRd1ji06yE+6g2PTGNh/hto3L9QRAY4rvg3rD2QDeISDg5eJ3A5YAiELDUdBGEyGDIX9ghuHY5uNXLAfjBqwFxwtqzmwGBM6TCZxOgyDeIl7P+uGPYRE2CkB+zq7MTU4zVIEZsDZIQO7N74LYQ+7PChBkAGPjlXf1EQRB+uBuwRrhmwUGofpAWE7p9OsEP2KnZc8Lv2EiDjbP+uKx4SHP7sNYU+8JRhvbBF/myRrLZkYZuwZA4DhTXwrm4qZB3wu4QoHN7s29CkHOy407jIpOcMx4zbBBhkHUAu7PgcyxzBBBVwoez6NjHs6ezS7Dns7OAn7MIc7uwN7N5+tVZKwFF+oQQT7NZ+S+zTOPx3Y9Yf7OSsDTBprOkEJpzKaLm0xyUQHMcwWBGdwG8c2BzQxAQc4JzaobQc/1ZsHPGEGuwV7Oes4VdZhDT/WxG/d1Yc0bBDnN4cyG4znN8DRJCpHMnwuRz58KyeJfCkMHKRuNIfhQMcyBzZnPMczeIQnNscyATHhPEk9ujUtg8cz+A5nOgGAJzHMHgNfqQR7Mns2ezxXyScyx417MXhnezt4ZE1bTjmI2pVBrjGuP/nXpz8wDtWayE9XOkTQiTy31Gc+MA86CgSExz/HNxczlzNnMUTXZz8HMBuE5zMN0qsK5zU8IGFPrBHEbGFFxGOHPFcyNzPhREc3xCAXMyRipdwXOZuKFzNHOewXRzwHB6gY543XMWc1lzHXN9c6TjrjPXUze5zdN3U4CzD1MwE53Tw2Nyk8eTY2NuRFt0ULOJjaeDaBM/U6H9xyNj07UTgNM6k/eDbRCNOS4mpaGsg4Dzs9MJoiDzgcMa47XjEgB9swOzQ7Mjs2OzE7NTszOzUIRg88DzY0BiI0WhGPPRU+lE2PO/zK4m1VNeE73UQ3Ck4mcEB3OZcwez+QBO0yiQOUBD2LvAKwCleG4AQkBVgFRAx7NihhhAuICVtKTznbDk8zFz/HOziL6QNPPL1I4AxjiJiU0UbgBJ2aMGjg0GfQIE2+AigJeAVEAK8xzzcpBas1fjIGMjM3f9atNoU+1TtePQgPjzEPNjQDX6f5SGAFj9/6hYhGoiwtgG8yWhRvPiHN40ZvOpRNvgbayrMyaDHRACEAPAPXCFEB+9pEBEw8PA+qjIIE7TXkUPOOOIk4higOhYWxSMI8GQA1AM2UNw6Fi4yC6Y+zQ5sH5C2ELw9O4QaXN8c4dzXoH+QlBzzgBwc4aBcTW74HX43ADU6LE1gRLm9BdTKwDIounzGXP2QG4GV1A583nzXiWF80IAJfN9NeXzKzjIojI4RfPjAAZ49zTV88xzWfPoEA3zjgAayHgAs9PL/Plz4nOFc7vgCl0882Qi/fP8c4PzPfMv9JIQdEDi81XzFPO18yrZ9fMCgLnzI/OsgGPz3IAT82JziwASczPzjMab824AdfMi2X6okhAIEJXzVsGufTDB+k0cc5kTmbMAs23T0qFkY/mzL1OFs0AFz3OKxK9zi03vc0PTfN0j0xqTt5PIs0hK5gNTwMGQx4iogE0AZIBNAKTzfbAsgA0A8hywC5sAu0aIC8gL6DPNAFLeQ/0/kxQTwSatcIUQfNOOAG0QvpjuDLbEA8BtEMv0G/TueVUMsHgDWuHDmAvwC8pwSAsoCwVAaAtD/cuz3LOdgAQL79P3MIILnBPn41mTIJO1NZq99SJvs+64I1BYC9K9+TiGs/cw8gu5iFaz1ThP2NP9cgvsC5oAkrSDQOY1v4GHpFsULjMdk24zTdPWUy3TEz33U+3TwLN3c3ATYLMOJieT8Y3xo2UTnlOqk1eT6pM3kz9z1bMT07WzMAtZiNwLNI1dwBfgq8AYC/4Lc8BqjYCQKzNkExGi4S51wPUAHfCRgrdjJmSOAC5odaD0oHEAlYA4MPQwTLNhC5KNi8CRCyEL7LOqNbHD6USUkLyzmWPiCz6TWE1Vc1JDWr1DEyVUieTUCYpRBw02oJY9ifzmvcYT7foskJ3ABj3tC1EACn3pMz1U3LSN3TDB0pSaC60LFT2aAKr499h1fCKA8fPuICKACD19CwDBdEGb4N3zzgCYkCoQBZRAfcIQMuMxEInT9d0glOdzsgOwIx/zUBMkY7dzebNd0w9zPdOOC+gjb3NRfW4L5bMeC5WzSLNEI/9zPrXosynkYxRhEKELyyjWEIOUvwvRCxaTA4ShCDAM14RNxIdwRoX6mb3cdNP2eR/FjNPkdszTlHY2eiS8TGVG7nrdsmD9rBCLdcCUCzNwAsiK9GtoqRADwE3EM/R1wFv0WRDQZJXE2oT0DPQMke2GyufTvpjpBOUQlAvGkKJMIkCiQPpEJ7BpwGbAbEBVgFyLq8AHQLyLgkRiQFyLJoncAKoU20wSXATWGhYh3uSq/RwR3Dro11WGQHyLngBiizyLKovmowKLGov/QHyLoouHGNyLEotUQFKL01yCll958ItfHnmYlp4XGi55M54RsYpcHItqiwaL4ovbTByL5YDai0KLmovpVOqLRosmiyI9aYAqSKeEivQDwCSL3QvQZF/kLcTGkIr0bRAkiwPAR0Tsi3xAnIvOizqLUkB8i+6LBouCi66LiYv6i6CEhouSi0vxtOQtYdRkoGK5EGNtWiyOiz6LWYtpix6LVYsiiz6L+YsvakI8gYvBi6GLrJDhixnEX53Ri7GL8Yva8BWLyYuei7qLWosZiymLHIs5izlkeYvGiwWLfyQtYXB9suB9i7mLLovbyNWLw4sDi6mLdYv9iw2LmCnNi8SLrYudwO2LkYu2xKNw3Yv6oAmLqouVi0uLQ4u5i5mLF4veixuLk4uNi9OLrq2zi5fA84vji4uL1dDLi1eLI4vZi/WL94tbiw8DLYtNxG2LA8ARi52LR4vQZD2L8Civi7nwhou1i1q9NYs3i7AAY4swS+KLm4snvDOLczETQ18LgIuyoGIjhw3XADnkUE34S98L5Qv/htMNKxCyOZy5vLnZIv0zvjP/01AQEjVSNbIAjEvrDTI1LFMBk6o1fjm4AKo0m8AGAByAe+CES4X5ajUrKNxLWSp8S7XUJEsGc5OTEBA8S9TIcgAcgIUDM7QrKFKS4kuFM3XkCOK8S/JL8IBd+T8LfhD7tF74T/giBD41ZfimEGSA59M3uBPklYDSBDZClqjR03XC74EZDbc5hznGDTrZYnimEOHTgYvR05G0z/guS3gGqDXlObQ1NEKBixUGdLhuS8vdVkv6XQFLtiJBSw8DIUt+S+k1fIBRS9RC4/rBS1f51bhhS24AXkuYgb36igb+S1vBgAapSze4z4JhSxdd+l1XwUEiJiLuSxFLHznDNc8Bb11dOFE1rkuPsFVLWb01S2xCz8GpuRJNaDUpuRI4lUvhS61LgiLUBFRBnUuGDem5CzW9S0dCLUsJQYRC40tOSwlLFrRx2elLzUv9S9NLU0KiInNLP9WIOcgGfUuZS9VLg0vwQqu5IMPrk8cLgkOtc1RL3jX4uVMN8w0G1R44pXjowfY5KFOEDSxLIhDMS6sNkjWsS5457EtIw/hLOJCyS6pLkktCS1xLf0taSwJLSjOdC1a9wMsKS2kjSksQM3JL/EsB8+pLKktaSzpLsFD6S8W4hkuJlMZLltlmS870FktCgHZLBSK8je05adNWS/ZL/F1WDU/6OUsGhlTLnSJsQklLE0uBABlLXktjgeHTHvQNtG1Lirj0yxtLXUtANXWGyUtMy3tLctlO1ehB9UuRNZyB6dgCywNLQsve1XVLGg0INR1LE0uSy6tL7UuNS/pdw0uKy8tLu0tSy5GGQ0vxudzLo0vzdLNLS0tcOFlL+0u0wkbLoss9BotLEsuay6bL0suKuD41HEH6ywg1W0v8y7bLgss6ywdLH1lP8+xzSXOyU2dL39OXS2rz9VlSC/zD8jV+OQBQgNGi1AYTnEs7KJHLbERO01jD4MvWs8JLLBBhwIDR2zOOs/4qqkv93fHLYCNcgHZUZhTbUEx4hxR3eMkA9vSdwPkQKNipkMSLp4Qo2MXkdcCygOXz14QHC0AUOICJ05c0ALT7C2zLPzO0U2f9E5P+wtdLcFCUS9MNcLSjDe74JbSQFCMNbgDXhFzz0fiTy/iB08u4i3PLVbR1NIvLJXjh+MUQZhDBy3FGX0uiQOHLccuz4FHLD5QqNdyzEctHywnLZZPxMxWTF1D/C3nLEQDmg1DUWcuaS/DLFjX3y/XkhcsrsMXLSZAJs3F05cv1cJXL1ctXMwPAdcsNy03LDzMZuIm0JDRKTX6QBwu9wnfVpZAdyxv5J7TMTYddabm+SzbLXDhkgIGLqnTeSyIEvku3WXlLNl0FS7FLaUuYK2w4uCuWyxS4XMvWBoVLW8KEK/NLNCvPgnQrVsHkK6ZLCUH3AU84P9VMKyQrp4RxS8VLy0ulS1QrVVjiy4mQGUuUK2bLirjlSyNL8suqy2wr7cvKy4q4CsvOy7rLX8HyKyp0iivx1QI0MiszS5M16isSK/bLGrSTNcIrC0ug3U1LWCuaK4s0i0smK67LGssWK3grCiLey0dLHTNI3SST7TXkS5dLcw29MzdLsw3YuQvLww0byyn4s8vV+KvLF0tLyydZISv+K6cQFEuBKziAW8uyc9mTu8vCM7+dl5RBOYo198uJy41zZ8uHy+nLl8tJy2dLazPos/fLmcvrU2JLIMu5yxfL+ctTC/PCspDfy6XLf8sVy1XLNcsgK/XLpHjgK8mzcfhKDePkCdPWSwgrsCvcwS2GJIHWIZwrOUAjKwg1PCs0QuIriUIVBmSAbMuWK1pUhsYmK7zLFLh/QjtLBiuey2xCyyt8gDeCJivSK3YrFCvzK/BIeysqK/IUyivGywcrDitKK6rLJivqy+YrFyscy1orMXjKhHLLuiuCXXcr7CuXK0Yrbyv6XY7LJEJrK4cr8nTWKy8rXsuZlG7L9isPK2tCTiuncyYLJ0uuY50DUtgeK5RLwRAkuW0008vBK5W0USuoq7Erpag6QgkrI4Jlc7VZYkuYTc1dNQs707+dGVQDFD9Lg4gtC1xLvygu85cBlE2TVNnLoEidKyUNa1132V8z8Cs8TUKAP/jfAWP5lzj7NWMrYyvItQddFF0ZS6XYY4FNyyWLAKvGtORdSyuBNWIrmsvMuIYrR8HvNbsrzwHqK8qrGytSK7LLBg2yKyk15yumEFqrCCFnKzcresuGq7w4Mqv++OarJivsQQAGO0vGq8A5zHTGK8CrbEK/K2CrbDiOq4TL8Ejuq9I4nw1atN7LmqtWq0P4UKtiXZYTrEYTc5hznEY1Kw5U+qAus12EWELYgWeC+kIrcz4UfDkiORJ4XnRX+s+CWasVBuG4eAapq9fCtl3rc2g4m3N5PdtzKkZAcCpLjnisq9Ar3SulkJyriZQ2S0bYAysp06gr4V0YQjTLozjCq1J0xCuTK0qr0ytcOFKrHXDBq9Qriyuuq4q4WysWxvsrRqujq9srIssTq8k1w8Izq5arnyscgcurJysqywarQatrq/UGqZQ6Kzg1PUvvK6urEKuFNUer+l12qx6rs6u7q86r3ysmK76rx6sl2HOrpitCNH6rEV0Bq6CrK6tPqzerBji2KwYE0lN9yycLqN1nCzkT0BMRo1cL93MFs/KTRbPuUy4LS03qxDgj4AueC4iz/lM1sx8LPi7os105hpAeNafB7rn6ABYArIOYa4IQ2GvfqG652EKp5PhrDgP9o6qtsGpHKcFhtbEspNB9rk6yBpV8f4DegVrMH0moFhH2LJ34zWydWYVbjUkFfaUhha21TfUIzVv15yUHddF1p41E9bj1q/Wf9SmtcWU/9R1QTM0Ztd5lAmVptad1efFAPGcg33U+hTYJz5G8zBSd/AzD5cdV7gWnVQZsInkLlduN8omO7XDNzu1ia+eNSM1t9S/1HfVMa1968mV7aRJrO/VYzQL1OM2rzCpr2fWMBdP1vmUBdVw+qxE3gLprDaalpX/wJgWWa2aFpmudBeZr32QBZXGtdyUJrbJrkXWSawT1MXUqRRlreXXOayjNgYkB7Q8Z5BnRta51sbVtJa4RnnXdJZprN1W+hQ4FJrUwRRvpKWtZGfZr5mXia6xFvu3t9WOJaM3e7U/1BWuVmdjNFPWrmcmZmYVziqulWXXv6Xm1ia1u7ZmtPmsLdUV1a4Wo8UEVTyUtdU+lD40ztTV1HyVddfV1n6UthcgZbYWoGWtrFXXK8tr1jQXzta0Z/vXVaBMJg3UndX+lQ3VkGfcVFBnjdWZrk3VZ9QFRvQV9a3d1WWtf9QAZkKVlhUtr7unmphetlmAbdTP1TWsp6dR6M2sXje7t82syhU91hoV3a8RlqoXl6dd1AUV5axjNQ2mFa/Dr1a1fhcp1z4sIicxlSIkIvcJKAmtZCdKZ+a3HfH9axmXCa1wFbbUSZY/132vea1eNC26d9RDxHmu9GV5ryM2Da75rw2sqVaVrcKUxtY0AlWuz6dVribW88WDrIWsYHWd1mbWTa7m1OXVfa3j193W/a8o6i3U1CQe1Uj6LJWSsyyWLabW15RFxBS+tmyU06y21dOuia+1rjmtc6wNrF4XHaWzrDMzxdZjrtelxmSRZ8B4jaxmF65lUWb7xYxFTtYHxL6UddeqZdXXQWXtrS7UHa38liwkva4lrb2vTaxjrGa2YzSzr4OmlhZDpgOuw6VcZhfEIpSe1ZfHIpW8RaKWLBdjpywW46dSl6wVEmJsFBKWd8dtruwUkpeQZBwVokV+1Q/G/tacF/7W0pcSRQHUMpbcFoHXMpVSREHVPaXzp0HXMka8FQul96yLpV7UIdTyRvwVnIMfxAIWn8S+1culSkWCF3QwQhYBkeHXq6ep1mumv8brpH/GqpaR1aIXkdRiFVpEvrTR1eIV0dQSFDunEhc7pnpFkhW7prY0fQCqFNqWo6/7pOIUOpUQJfHWshaQJAnVOmEJ10ek8hfQJ4nVMCZJ1jK04VcIZ0euza7Hrfu2XhQjrP4U3hSIJy+tF6Zp11qUcdbfrenWK63JryusKa0d1YBsQfVwyb3VDHhVV+zEjkkwqVPHl8ZFrJF7Ra1uADPERa1WlDoWPifprDwVy7IQbi+k8ZezxRmtwILzMtBssMcQbivTPiYpoLBuY02wb5WkD/HRr+gAMa+hg/ybD4ERrAhAka2BoZGtIeJRrRQvZK4o1cllcY1IbJoBES8JLFrOoDQobFGtKG0TzahMMU34z3aPPSxsNHkPUawfLchvkDXhrmhvn5D9L8htmGwRrAHMEU7wQejVXDVjj8sP93Q8N6Tk2Nek52TkjOHk5zjVPOeDJQ3C9y6YLF3PmC1dzn/Pbg45Tjb2vU9sjH1Nwa+9zCGvoE79TRgNeCxmjPgv9xMpEz0su2BrYYA2X0Y92rc3PrZXypc0anbMpguWUbYVo0+3f7SiJnsrgEnONOWKNiUsuzB2q7mum2u3YXo5R/4m7LrEVR277VQtxh1X1GwlruYVJa+zkIxWZFbGmMmCetpEeD6rATI+WgprLHY1tB00wFedtrW2A7e1twO1BrUfJES1eSuXamy05HYNtNBgKLapxNR23yfA2f96bGwGdSv7RETDt6uFw7fEtCO11HVc24pgd6HLhbU6uyO/0S8SXcGB+dRvMzemK34lj/n3uuu17HvrtBx42rfvRVYlRNnFrHxtlBSkVUVVU6/SL3p0VZCMbgDYntjlpv+085X+thSklvuXNfrGVzeZV9Z20jkBAlRsoEgOxtYmTdtDJxfVX9dDNyQUmZSJr8M3m667tMOtza3Hr2Xm5a2z1TOvc69brxXk3jf7aRuhthG+BioWg9Yj14PVVzEpjPGP92o90zAKRHFTxr+jfwH1wiAhC6AAAIzEA1YDks6yQA8CtEH+9RmXz9S15I5lm66z1jOtK6z9rKBuzmW/10OtOa11rLmv+7X5rg/V31p+NnYV3FdVRr43cuu+NGPWBHm+NwR6m9cZu62vK8t9kfNHm9YlS+EvqoEablusmm9jrJuY30Ex8XJv5KO2myFmUm6pcMXlJY5mArIL5xIUQWyTobMxkdcCdwImbp/VXwGGb8PXbJUFlSPUCm7GbLBg3gCKbyXximzKSV+iSmwwMYcSpEHKbCptDcEqbKps9cGqbbmkam4v1VdH/7qUZzJtW64UZ2EnFGYjNAZuw6/Sbw3laRb/1Urx2m4N2wR7PYL6b1UD+m51rA5sgGyJ2IZtDclmbPJsI9Tsl/JuKAoKbcZuAQAmbWySpm1v0yZsKzZybPYThm1JekZum65I6MZv2Y/iQimjFm2EQpZuBKuWbSSBSmztwspvym4qb8QMNm02bwXWiZU7tjEXUm4gbmWvM6/ObDJuGm4AbtJvAG91rkWnmmxXrGCXgGduZkBk+6/By8ZbOm0umjpvIW/abLpsa9W6bJ2td8p6bGo26rsJLfptgW8abc5uQWwubNx0RKB9Ay5uxpbyba5sI0ZebbWOIWFuAO5sURXLs1FswSmebYPX0W/mbV5ta6bebsqD3mzkqj5tbgM+bVZs1m++bypsaqI2bc/XNm/BFYmV/cdqbRtH9a4GbPOuua4ybOptIG3qbHu1DtUprMFta0WObjB4Tm2hbEyhEW0ybuptAW2RbsnaLm4S67FsRm7RbuZvrmwp5BZtMW3nEzJDpm/8m0AuyG+o1VJCfC6nLncDHm7+QZGuMW38Llaj+W3PigVvOW1RrJD3zoW18cB3OzTabd94FG2mdgB0YmxRtfVV6YWUbT1U/CXibRhLVG0lStRuBFVktwRWNG1SdPxtzVT+2rAFOrgRejJ1XVabtea0tmZ6d0Jv8VvOKcJuZWJViExugPDwd5F5HbV/F+01xHad+a+XsLSMdnuFhLYt+g5VX1rDyxxtCnacbc21ZcdUdi221HacdRxv9bYTJuR07G+cbU8VrlQtbBxvzxQTqdxuHaA8bRF5PG1BSLxuOCLWg7xv+RQ0baZYr/ptVFq20nZVbf7bVW0btB9FMnUCyPGvm7XxraRVNW4r2LVuW0GpYCJsXW2vNnxuUnd8bWx6/GywB/xtsAXvRlYltMaCbl1u9G6Ml/RurdZbdl1XDG5bQfCm5G/Adb7VpiUlbaJvpnalbwB1V6qUbZM3MSfSz2VvqLlUbY2yEm2Mby6awW6weHnZmrcWJNJ0FFg9bGNN+XjVbJu2uVe9bghEW7XVV7EnUzY1VRfKtW42Jle6TG6Nq0xuxHV4+Ssm+xUNbIS0jWykdY1trG2GtGxsrW7LFgZ3Q7RfJC23ffkttS1uMElNbA206bbNbsS3nqVcb1cmWNi++5WL3G2wKx1t6Gqdb82jnW4VbEe2a7SEV7l5M23dbLNuQ21Vb7NvPW8Cbfm5w20Db4JvZtZCbX1v1VSjbNu1C239b8JtvisoFSJv6JSibpG2PLRmdB+2OYY6dVnkU2/ib9I4i27ZVFXkta615VJuKW6yJ+WsqW6ybX5mRmcIFH/XIG9pbyXXDmxabVglK6Eebc+LZm7f18a15mxubzlvCmxeyopt8nOKbwlsa9JWbr5u1m/WbUltfmzDNP5t2a3+bBdsr9YBbLJvdm7GFZdvd9QpFIVXhpWFVulvY2wsVr5He67WFPptOmxhbqFtTouhb45u1pq6bnh6tdRtremFemxdrqmtTm45FxFv9m3SbwFsDINZbEfa2W6eb9lt39Y5b9yqbm9ebzFtuW0mbgH3zLNkQaZuT9Q2AL9tcPpxbfJvcW23bvFtnIPxbR/Pd22WbKBAiW/3b1Ztvm3WbH5vD2zJb35sUm+ebbWuT2xOZmlsWW6abrOtua4d2HWtiEYRJqltmm3zrcpoGWyheCrLGW17IplsaW9PbXZtO67DgT9ueAaA7QzFv2y3bH9tN2l/bLlssW0dwaZt5xIB9whvvMP8LYVvuIBFbvFt4SyobPlvKGxHLvACiC5mTCtOJKysNaw3SNZ9LISPIJmcTP0sKO4DLccvKO7YbFtMOG7E5Thv6C1NzljWPDRk5tjUvDTk5bw1ONSKAyZv+qyPZpIGTS+W0MiEJSzMG9qseO24AjIDTNUs5P6v+uQUNb6tEjUTLSk3qKwE7fTVBO6erjcH1q84r6ROv83RTXHODy94rRg3iuQsrtEsPSwpTz7MTM6JAYSN1c/I7WyjdWTnCXNj6OyU7wF3dM4iT+4Kd+u1zrhCCRBhAHUK76Gh0ovN7AKr9TtQs+C07AERyhD6UjTsGgbIGkF2R2JpdITud3VNdHdX4XZHZ4zSq2XRdozjWQpfV7dVcXapN4avT1QaosvPjQnJjsoBhmwrzZ0MigN07/qs+O1eriZCYNZc5412DK2bUHasHNRE79avqKyZdwTsTlJ/ZBpBq+I6oxV2/RLoEYXO0c4k7wpN+y5xz+xM6G/RLKnP5O7o7irkDFLiNPV1SS+CoUjv9wG3AAjt5C/0176tuO0c7zUgajSqwMRCZKAc7WF0Wq7iA0zWou9NZIzuueKE7lzuHOb/CX6vgoiG1c6sku8tIHn3BG3wAHLXjdNy15wtSk49T4RueojombXRIedBrfuOnk+F9pIPgBXEbn3OGA/gjNRPeC39zgVN1s7fLV1CfMMWwAcbBkNdYYdi1dIRrBbDzwHtQXzD9wEIAC+CQaPK7V1BUa8jTHPDOGGgUXVupvk21O422a3uNuDsM60pbnZvF27PbGAKBGWQ7C1EUOyXbzutFXlUmRbCq0MNQ9zCa0BNQzzCdJrK7/6gA+cHzV1CV8kfEBt3A+f22xt17foiLo55uebDAYrA3lIOYQgBzQMdYJDuw5q+tfS1mlW0d12WyHaVhIbvJC0bdZp6Ru1aLEPl0bpg7o9vYO1xbWpsWu4XbDuuOuza7GV7z2xzraXl32xBbRDsNMeybpOUZMIa7wWi525qb+dtVu1PbRdukW627IFu9azOb5Dt/6ZQ7UFvUO8P28nBq0BrQjzDeuy8wrAtKu+Cis7tqu367mruBu9BDL9MQEOCw2AAlC2Cw2JD7u6RL3hPyU7obD4aBMyzzuwEUsMe7RTh7u7HDagv35M8wDrNbNBSw/d2TUIUQMFR1sH3AIoBDcLsLZMvUOXv5/SsbuNQEPg2qOJfRBpB/u0grydPEjXyNwHs7+aB7/w2L+as4jHMJqy/6igYGuD5zWDimEEFUIkaE1Hf5+EDtM0k7Pztv85dzWbN9dGBreRMQa3YLNwvgs3cLNGMPC7q18Rtfc1eDIrugpmwgaWV00Vkbv4o5G0xtkUlxLlfMuNu2/uibRt6ZnUTbz2CZW6idcFESSUFe3y2d7UWdJp0lnSEdhe0jrWLNY61D7UjeSeKPxFoJy9HuHbqZTB1gmzHb7A7dyf0dheWDHesdiR3DW0+VYx07HRYdL63626tb2xuyYrsbcS37G3PFKxp626rbHB0zW5Udc1t7G9tb7ntblSS9lttW29+YNttnUldjZ1vcYIDbPKmuXi7bTRu/iTherRs/brvRfJ62rUIe5eZ1W2l1wdu/Wt9bpwm27ZHbhWIIm851m+1AndvtK76FG8YlxRvpW1Rtyo64m66VW63t7Y+xAR3krYXFp47VbX9VFZ3WnXgyy9HWedgBaeMoEplh11Lae1k2OWIx4q9OxJspu5jevaXtGSbrFbt9uw/1lrvmWzPbbDu2u72b9ruf0bW7q3tTGUTRlqV8zudiwnnz/FsAAySlu+SbtOvze+a7i3vVuzHrWOuTuzbrU3tVagvboaVL2+Fle/UpdbXbgXUGu2TrPbutmztpfZuzm/fbllul29sRT3uhZS97maX99dBba9tJpFO0KiiKNPH8NXRMFC6dE4WCa7N7u42eVQt7PjEdm8t7rDvEWXPbIPuNu5kFAPstu0GbbbvFa/sVq2thlghbW9vdhX7rtXU7a4HrPXVfpSWgCQCce8ZFngC/inbo+3v4JId76DNZsJLgp3tCa3N7EDuVu1d7A7s1uxO7Trv4+6ZR5ds+7UO7pPtsm+T73xFfe9t11mtIWTw7aWv39Vj7CYU4+9a723uidg27dmUKZUAbt3tS+wRF8naDmLD7imjw+weyiPs98cJl6ptyW7+b4mVi+/g7LDt6+3j7a3txhf9747vTmXd7ivtQ+xT7cKWb2211dYXo9Z11l9vZ9VdrrVAs+4sZIA1cewiM2kSc+3tYnluQAAh4R3v8+z61XAv8+3C7dsiSu23AVXCDtJ0TIgDZ+wEL/xCLwDJw+fvzwIX7eVSI06dDngAgMyJjLB1xWyxtY9FCexCpKVuie8nb4LbE27FFFxVlrYmd5NvELZJJ453ye5OdinvTnaWdHXtHrUJ+C52ae2N7fXtae3p7X+oGe/DbBnnGeyYtKx1me2sd/8WWe3Lb1nvbHYrbaR3xfkMlDntq2z57GtssFfNb2tuLW+bbnnv+ndNb785G27DtW1s3+ztbWnGJC0+LoXtIrOF7QKZ2285YDttemStrztslW6Dbll7lW752rNvWrdDbR6aw21l7Qe1I216dzVuwm4V7Q4AA247bPRs0ASDbM1VlW8zbFVue249b3tvpewKemXtc22btPNufW7l7ods00+HbaNtKlWXeLfsL7fkbqZ142537CrHd+4pavftXMf37A2XQ+3FsMnt7/nJ7bm1d7RP7R24znaEdqntaHbStdW1U234Ai/tje8v7Vttduxzteh3AVadtcxv/bcMd+/vXbSDt4x12exV5Z/vee0/7vnvG25cbbnuJLctbD/sG2+rbhx0zxQkt7+Vj0TOL3/s9Ar/7TdqRe/bb0XsYB4Z77naFiaVbYNsQB3rtibbWmYbtxAecAaQHd6FunRTrDVvsnXl73BkFe0XQ/1vR29zlcdtgqcZVtmFJ238VKdtH7QZq9XvD+7J7o/vCBwp7FK2T+8p75p2aHeEd853de1DJcgeANpQ+unuDe9DJUeIje7aa43spxZN7sp6kpca7NmvgO3Rbovva+/Zl7vvy+/77wPsy+6D7wVW99Uclb3s123pbmNP121VePPvWLBn7J3uwRY77sM1muxPb/btu+4O7gPvDuyMH/Lr26zd7juue+zt7Rokdu5ZQ5L2jdWr7HAU5m+/b9Ouu+9j7BDsre8cHBvsE+0b7nmvE+6b7dbslBacHigJW+71wIZC2+xCQSPskm/r+1/WZGXnbl3v9B8b74FufB/r7EZmvBz77DruS+18H12m7eyweVpsvJVV1XD6ztSL13XVi9YOFu1hQhKX74QvT4JX7MxPV+0X7cjs82EsHXLNp+9SHfPtl/ZuzVOOVC49L1QuavQ37Mgsac+n7DIfFA4CoZTtch/SHZAD8+wBdJjs3y4yr9TvUgEINbRBzC/nEIoCiQAM73oFDO5Q4+Lt/5G6N4ztLO0hd+fNKh6LVfau4XVRd3F3ytK2BxF12wOKzAjXaDWTG0UHTq+bG3TicXXhd1F1TO8PV2ofP+I7LS0FigQzLEzv2h2PCKzu32LwEVjvODQvVfg3yBHZj2kRqBLxDL/Mkeyk7fzssh7k7gLu6s0WAHIeiMzXBmHStNYbjbtkINexB20vj+h6QFQbEh7n7ZIe/kDX729QYwlc1MwbuOxlLTCEzNac7czVtq0MraCsSTaKB0Ut+O7DVuLsqq9c7c9jfOMIrbIaRQZaH9YYkQY+r0SFoJC2Hg0Gx02aH7TkOjexd+6t1h6NLLofmtAQiO0vZuRmIc6szh05CzytGdFWDWRMiALTdYrUPuQy7oGsXC+BrolBeohB5hKEU3UGipKGrgoeHbLtQefomZ4dU3eShzN0mJqzdCpMlEzy7k2PwawZQiGtVE8hrVbPJG4DTqRsu2G5bxkVIjLKALL6Y2/FbWIeNJu37RJUZB6SVAIhcByWtPAdcsQS9DXuZ7YodHe2FB+P7xQdiB1P7s500rep7c/u7WFp78gdJUq0H+QCoWgdbFFswapNYEtt9W1LbZBUy2xsdQCXLG51t4c5p4ccta0npyX2awi0e5cOaz/sXG6/7xx0623f7Q+qGB2JxvEcmBy/7Rx3sFQ4Hwbtf+xRHYXv7yhF7//tvG14Ha/vFW9dbH26Jey0bURU7VSEHQJtwB2QH9VsenTEH1AcXVbQHBW5wm0V7SQfJnUe+UEdkbQTbYnszSanb1L0oRzzNWe3oR2VtRQdte1Qu0/s+bbP7VQcEmzUHhWJ1B/qZigdNB3179I6kR0YOsW1Pa1cHESWtaxsH9wc6+48HuPvFtdL7+wey+8pbQwdm+ycHPIl7e2wgAWGXKOLQZ1JcO/y6/NgZMmIMJyboM2zbSB4crORR6K3G6ALU9SYxmzxIL4NBZBt7svFbe88HpK4sZoQHIBlIGFVOfGXe0XFTfhBxAJGzb6Tfu6vAcQAym/qgWRARxH+9DfAVedzb+v6822dVYIcL9QhFClubBw8Hgwc7Bwr7ewfrCZlHVrvZRyiHjZlwCq0u6InHm03bqWusnS1iDFvKYy5bB/Gq4sOzJZt2iUH1ND5yY3NAPGNbgETwCDubgGcgp4TdENWAqRDbcCpIQAhD23+9fduICDKbg9voO6qbI9tne8L7vQeY+yWZWwcS+377OUcvB6MHhPssRb77UoWnR+27LB4q++0lXQfq+6ubDlt3B1CH7wd4x+eFKIdDGWCZYwcFtRmle6WQ+9O7Vcx/B9XwAIdMlECHIXwNwFVwxg5oFMJydUcfOhzHLwy6APzHTDtLeylHHvtpR+zAHDuBdaVH1VE9BxTH22n3R0KbeVvyksAAYbto7qD5louvyMW7aVg2eUkLM+gyDBHlfJQogMVH9yqKx/Vu5UeWcpVH+UYMmX1Huy7Cx8sJDUeeG81H+ZutR6lD7UcW6x8HRweyx92APUezZjVHuy4P0OWSQ0e6ECNH36BjRwyQE0fw9NNHs0fdEFJbi0ew8stHND6rR3haMa3gh727kIeoxztH2wck+8MHPZve+x1HaoldRwHH3wcksudH1pzWxyglyse3B6rHPFuMWx3bz0dd264Z70ffCp9H30fQIEcSD5uIOwDHQMcgx2DHaDuSW5DHolswxxJbn5s528br6PtRm4lHVMec637H5cf+BcXHhvuIh5t7yIdwh42ZLFaKNNbIMl4TJpZQOmudsBmAZ1j/B/H89SRAh78g32S7x6LIfuYvPhkwksfXeyb7/scrx+w7lEdMPZmbV0crmzcHvDuQO05bvFvM1sJykpjax7IWEbsOeUW7Zt2Q+UbHN9x8YCbHYxW2eYVHFscdx+G8tcdIHrbHUab2x8wCpsZVzC7Hr+lux01HsDonm+hafJTzAG1H9ZqlxzXpy8f4RYHHaXxkriHHBS5hx2hSEceqVEsQMccDUJRo8cczR3NHyccni6nH5AcrR5QHUElZxxtH8lvFmYbRT8cwhy/H1CdYxxlHjMcV21pbcOtTu6vb7EfTXBdHXelfxzRb5McNxxebTccPRy3HWfxtx5JFyCeJzF3HmYA/R73HQlv9xzeAgMedwMDHoMcN8CPHDZtQxztwE8eOJ8PbCMdC+7PHODvzx3nHyUe7R4XHmMfwh9jHbweLxzTHRbWvx+b70xlEx52733szx6a7GPu5x+In4vuHB1Qny4X0x83RR0e6+ydHW8eEx2dSoseuADb73MeHgLzH4scCxxkwQscfTOha+SeJEKUnj8fJJ8/HqSfEUfLHnQeoJwuV9ce/x43HUDvNxxrHeNZax/m70bvNChaeBsesXLfExscFTLfRwyCIJ0WHAPkaJ2dS6Ccm9SPsVUfYJ4oCuCdUGfgnQgAex23bXsfcm726FCczpRD7cwJBxwL0QWQDR53ezCe5KKwn40ccJ2iQCcfcJwtHvCfl2mnH3woZx8lrcSftJ5r7YYUOazSbJFt7R0XH6UeHR3Incvu/J4EnZ0fhxxQsrSdmhe8nt0et2//H3ScwO53br0ftxwxbX0dmJz3HPdtWJ/4ANid2J8PHEMcz9OPHsMejx42b08erB2Pb6wcu+wvHTbtLx5vHzwdBJ7InOMdnJVSnGMcEx0r7O8dcgLfHU+yHxxFrx8czAAxonMfnxz6kl8eca89gN8flbrruh8fTm7fbjKf4x/r7zSfkGRCnrRlQp7xrd0e6J+rHdClC9n0ncdL009j+UbtUbnvQoycwJ7pkfLw2JUc9aBTI48Y7OPBQuzI7wVusg5anbcBBWw9HVGvEs6Q9DAdgR637zAfx2xjl6QcORxwHcEcSeyTbcSlk2/B9rkeaze5HzXtlRZhH3ke8ft5tQK2+baqq+UxBRyYukUeKBxRHygfY8T1be01Xlf1bjnGDW4xH5eVcLSxH9358LSon/otPzvjJd00iLeJHl/tVHf57b/uBey+Rokf3TSSpfEebW1JHyi03G1fMTgfyRz/7ikd/+/fEUXs8yKOdtx0gBxpHFl4PPuDbERUxFal7T1uhB8btXAGGR9l7Y7VQm6ZHUe2/WwkHUdsBFUAHRVs+B18bOAf+B3gHkAcEB/QncRUc23OnEQf36VEHxkdLp/zbJRVDGxZH6Nu4yYwHKSmCeywHwnv42137mQc9+36nffsQ1YGnV/UCBy5pQgeeRxGnG2Xte7hH5Z2xp8828afNB0v7DQeqlXydrV6qBydtBh0aB0MdJ03aB5FtKxtdbWxH9ntee2JHOy1Vp357rnsBexYH9/uCndYHF/u2B7Al9gcqLbJHIXtdpy4HPaduB8pH5B0xe0VFV1uYXppHt1tnGZatUAf0neT8J6fhB8yd/Cfpx4Inlu2xB9uFlQKWR2gH1keqnSXNL6cd+5qdqMXaneftXT65B4Rx3a35nR5HLXtCqfntB61lnZ17EGe+fr17tQeCcfUHE3vvKc0HSaewZ7tYDx78naj77lVeJxd7PidJJ2jHKSfUpxXHtKcAp/Sn06W+GQcnc6XvezMHEtFCEmbHr5Mi81XM8qdHbvMnuW6YJ8l8yydnUqsn7gXrJ85mLUekJ97H5Ce+x2EnffWHJ7QnvUdHpyV1pycUfucnUcc8gGwnccc3J1wnScf3J0tHwmfPJ6JnfNtxR7GtCUfkp74nAwcFx7CHNKfpJ5hF3mc99czH3bXV2zmt2Npgpw3bOyccWxr70Kd8O8Qn7ds3mwind5tvR8in3ce/R33H/0fWJ4PH9ifgx3DHeKeVm64nuKeY6T97m0diJ8v1rmcNJ+5nESf1uwiHeye+ZyzHfEVsx9En5wexJySn5bsi+yjHLmf5x+jH0qcdZ7brSHyAp1lHwKfMp4H7WbLVJ4UnbZQ8xwqMfMdlJ5ZQFSeW+0X7Kihg53UnR2eSJ40n1L6yp09rEWfZ9YqnH1vKp10neic9JwgyGqeX7lqn1G46pxgKyQtjJ3y8EEVTJ2FnigKo5wFRUWcfnjFn6JlOxwUuCWedBUlnmydOW9snRCeOURdnAwV+ZzXiRyeM5xWFBWfHsUVnlyexx9cnfKC3J5VnfXAPJ9geTyfhvC8nhWh7Z6InS/Xtm34nbWdSJ2knn2fP7Jkn0sfZJzSnoKdMJ+Cnsyd2W1onHSc6J1jnqqdFmzNnAltzZ03HKKeFm4tnlifLZ5inq2c4pxtnzifbcNtnG2cvrUrnzvtbR0lHrWdvZ7THcIedZ1313WeL2xMHoVVTBwNnI5usdVfAIqf7xykenKdfddynp8d8pweyF8eHgFfHhWgJ53fHG/4PxxKnZlu6579nMqfvx7lophHG56/bpucfJ3/Hn9tTZ2qn1A5453Z56O4/eRAnf3mYpPqnEIQxDISHE0O2p/PA9qeCYzIbafuWUGanQgsj542wJ7s7o4BjVQskq+yH+rPV+o2wIof8h6QQi+f0DcnLfUTM1awNOrDGh5Q4IUJNOQi4++d750eAB+fH50fnBLjR2Ifn2sJ5uXXZDMvZh2+CV1kdQkNDbwZtO+YQSCGNBizz2qKP55WAy1mdPbxUA9Uf51RAX+dDQ0xAv+ep1MXYABdAFxhAVECgF+tG7+eK85AX0Bd8wbnUzPPwF1WAQ0OPgtm9yBcQF2gXPCmDq5P63EBiQI/na/omuOxAqrA0XQAQioc756HYKoeRXY5Ltof6h5OBZdUoXWmHpF2GcKKrFF0ehwaHytn11VQXpofXOeaH44dtwua0NodjgbXVYF28XU6HRkvSdGor8F1NgZM7Xoc6qNLzazt+hwIEmztphzjUa0sfWW/nSBfsOYnB2b31hkJAyUuMy4yAFQZE8ClEE4FjgWGbu8LqF2fnJ+fn5xQ4l+cX56fnhLiOFw4Xzhe0y2wiN+diqyYXXDhXWSKAR1mc83zBA9WK8zs7P+f6F3p4IRff5yAX5sbngZEXQ0OIF2gEsRes86EXCRdPQsgXcRe4F5gXERfJF9/nGBdjgQQXIoDEF147abmlh0i7ql0yITQX7IZqh5urArRyBI2HGUt3O0mGjl1thwsrU4e+BggrghcvXZOHj6u/Q5QAXqsqs9Q0rjUCF7BdxDUGq1c1y4fmxnOHfjsIkH2G9zvjVJLCX8FPO+oELztw3WDBf0RKRp870Ks0U4EblwNyU639MYfYTXGHokC+Y+C7a4KYInajaYfUBD41QIEiQQYXqytZhz4XbDhuuUVHXcABW/zYao1TZvUoufteO1fnjitPQpFBY1lZF7fnjxfZ2JHHSxDtwD1I0+A/Fz54OIHX5+AhRhd352w4fee4a7xbeYcru4WHaQ30F6C4AVt2p85bufu553n7Itklh9UX6isVh0OHb9lnOzWHAqtEuwlLDYdIu82HCUGsF5JNdReLNRJNXYeatD2Hwhf0lxfJ5JcKxiOH/BdjhyMXUbnWh6yX04fSF+erpJf3NbyX3quh1Burixf0tUGjG4dSomYm4rWsoVK1YCYytYq1X7mwJhGi+qGIJsPYxqFoJsPY1iat04y79lPMuwK1R4dstdeHxKG3h/+56yNWl5B5eia2lyomRib3h7mhUqKPhw4Lz4fcu84L55MgC15TlRM+U6PTKGsA04O9qfs+tZIi+dO/kBO98t2sg1GXc0NtwLGXat1kE+JAJaO6GLuYZID7mH+hSAc/W2xk3GCFoJnjfAAJl1OESZfrvSmXccOr4EMU6TilC9WXk+cIq+KzNYbQuUE4jZcalBi5tUZjDZ+AOTmTQIq4oRR9IjYGx6B7mDmgIoBhwL3zXXjlgDvLsrnsh7DjcfnV1NndT6TXdFfgHBOF+eMU85fBoIuXpBOih9JL8xQDKNYQidGJl/PAyZd6M035/d3rrBLj3wstsB+wqpEbAK9YHtjcACKAGYCPAF8zNd3jSN6wFv2NAHqGvoG2wlY4UUIDl5mX+5iekKOX16uj2NCQJNREe987nTORh2cN/sKtl0qzzZdis6qzbZcY2HW0EjnnS92XDsGwwb+XS6BDl4BXcgBjl1KzxosDMzUjfQOkq0kDaZeJh4MUAyg82GuX13QHDdWXSd3HpLRXELs8U3MUVfmLUweXZz32vY/LyxTjFKeX06Lnl6nkl5e+LITwN5eq1A+XRoDPlxqUBpDXkATCEpKfl1nVeEJk1FhXg5dZl8OXQFcnqyy4oFcBG7CrlOMUQ9o9ZAB9QJp9NEKZoPuYr4J4Vw405JNJK2rj5FeNNUX51Fde3QuX/rQQTbwLoxT0VzRXTleETcxXSDPfEGxX+5ell4eX5ZeaC7xXFjVnl4yUF5dh2MJXUiK3l5sU95ePl5gAP/ggQiDBOYYSeGvV8ABXtDe0l7T1AG+0L7SXtJwAl7Q1AMp0JwQbABsUN7SzwKVXE9lpVxENo0A3tKfzL7Qr+WlXtACXtK5IeFehtG+XhgAflz/4KKtuDfB76l1zOye0+sJ/lzhXI5d4V8BXmlfE1NpXyTv9y9fLx4awVyKz8FcDF0WUTZcOWSn4pvgSCxiN05fxh3VzDlfrl/60P7MYEO5XD7vr5/fkbMG+85Gr/d2e031ARNTwgLWx9GicgMkA7+huSE00pgCqAFQcwaC6C+SAx6Qo2J3AVXCygFb0M3A/+O146Fe9l8pX/5dqV+ZXztgskFkQECtfl8DXiZBBAMvQuFdsOOXYfpC/y/d4t1eVfBNXEYdTV6k7wNg/gJ5IR/nJV24A6ADwAKYA8AAQAPAA9QDwAPgAqADwAJwA8AAFV8qzgNd9+RhXP0IDV9hXqleI1yHVYtkjDXsAk5eSC4YbGt2pK01z21eLl0WN2oNIALIjOnO/syLXHlfXAOLXktePu8wNnfpIY25zFjUXVzUAV1e1sd9XANchWUDXRvgg10NXo5cNq5DXfD0dK0o51LQo15AE6Nf1ACjY6Nf3VySAwaBPVy9XlBTHpJjXkFfY19U7uNeSoElXrsY4gMTXpNfk15TX1Ne01/TXofidl5AgetdKV3DXg1cc18NXY5fqs3zX61cC1+lUW1cB3Y5XjQty11JQdCOBkHtXDFfp185X8td7ADnXXldrM4yrKtdnV2rXVT2a184A2tcuSLrXzNew12zXKlcAV3HXxtfMkFDXZtfCs94zQoCJ0zjU/Vf9l+zXLdfqV0O4ltdVdMkA1te21wz09tePV/2wztccVK7X4FdXU5NXQGtjPeR7RqI5s9/z1wtQa49zMGvRGxlwX1MaxMPTX4evC6hrPgvoa+LdM3AkeHuXQgCZ+6yDl9fS3Z4bt9dQ8/GHMPNNoZfX5AsDwP4bCnEZWKtAubtAQDrdSxztgPUA9QAnxNoSWKThw/fX19eIkGX9fAuPKALUT9fpRI/XjIeg49NXaTteM30zLXgYq0PLSbDuWVg36TvTSNk7lldTl4YbevN8AMGgh1Cgy8LY5Dd2PYJLitfUgJA33wuOkAtT3fmFoNQ3ddTyNCnkdKPI9HMLTTgLC5twLw39Rt8LG4It884Av6heOFPXssxwkJfXaMt9Vys56KiCs6YQn9czXcIrG9XRgap0XrkRuV09cxdsF8CNnYeYu9a5jzVyTYS7t/lD+SjYCD1cgMkA5bm0AG7Xris1Uz2TgzMXu0C7wwN8cNQ3VDeHUPSrpLT31y+7rDcUNzag8jSg2CqNIoDg05iQVKL2O4iQoTeGC6E3ews8q5vgWleL12dzy9enS6o7ZJOK0+PUl4SAM0cX8/qBEw8AtdTUN3LXDeMiADk3Pjdi12GTqDcsV/YbJHjxENP9xaFrA/3d1Dej3WE3/Pv24wlzx0uJN3CrexciQ8RX3aPpNzrzl7sLgtMzoU36ABY9eTeiE4NTQzeYhCM3aOMDy+U31IBDcOM31TfKzLU3atfjNw03YjfSqI8YwaDbU9E3juOJc+7XuxdiC2o7a1dYTZeEuZNON0WAQtcAouM3xTdy1wXAygDfKHz0wzeHUDc3pAB3N1uXNTtgAHM3eyFBEAD9qHP1lLyQNTdmNS2EljsSqA83UwuARPs01MjrN1fomzcNAMmzADRfO0vXWNf7N8k30+esh81dJzfT4ycTWTdIS3xwRTeTN7c3wth4t083l0MEtyXXJoP31/EQA4MHcKWLCzf0EYC3XYTAt3t9h1ANN0g3K5Pwt1sXFlM6V24rU+c+E+e7dFCXhOMzmTcLgrzUeJSYALk3xLcRM4U3YrfXN8ETHjeROZU3Kn2OAGeEvzfrNP83izdmNWL9+BCYkGEQjLfE/cy34Lest803CLcJN0i3STf0U9GHfLdQEAK37kM6OwuCs9QDFKC3MreStzNQVzeTN3EzONfeV7M34zdBEMq3tLdcdBq3fROuSNwAOrd3DedXKzfgt2s3XrTQt1s3EDQO4x3DjKN7N6uDpwtYg2aXQLMWl7YLoLO0e96Xu9f90zCzoAuv3cfXiRuhl+PTorsosxxj09MZPfhKuEp1wJW3oE2pl8QLTaHiXtYeJW4qeYBeoqeyXiBe8l7GJ5vMTvqIrkOm8QXGnlfuG3p+7maeuApZU9fTNbfCgzMBsDfDwKYAxvM+3YDg87cqO+a3hzeYwf142MEEqyhNxfqVc+yHAhOshLO3udcHt2S3DKsnV0/ks7dniDW3RrfjSFKUzd0UVN36N8ZTqJqhs0SyhIxUIrQwwXG3qT2DC1BQOn3vxo+3Nbc6TTY31Lv/Mym3e4dMu/wmCYRPt4qhkibOsNImI03Ue5m329e3Cz6XTgsls3h5/LvuCwkbQruak7+H7HvDINTRA+SygJ30QEcADPh3oMcQjPqgVvTlEMZF7TuwwJJ7ze1D+2MabVt/65iCKYJnWOrQnbDm6bynOT1SrZ4RT0DpWOJA3oVDJb7n49vNZy9naudB5+En0ieeZ/VuBwfHZ0ynOScsp7Ve6hs1sXWxtGcAsoGkOVuzkoFHWdsma6tArHdYAOx3FpFcdyPAl+i8dwkA/HegBHksyndvSYIb0ut58U4HZOsNZ9nHv3teGRlnSIfydx9nD3scXtznYWW859HnpFkfe+2ZWfAajYOYqjRBs3lnON7M57su23AcgHUCJUfijcnRYsc4feek0AcjLntrRVh0Fpzn2fE09dF5jzIAW+rniOdzAhCQTShbgEkQA8DbcLP0oMcMEin7tiXV5EYANhvT06DHZICd9NW3TXctd6mXQxNnvRx7UXRkd6kQFHcVENR3X6fcBz+n4e3SewpxTHdqJ/tF+ndt7LcUnHdQGCZ3McgjYBZ3gneuzfZnDu3o5xQH6WtF5/4n7WceZ6Hn7OshJ5SnmWeTB9mtAXeBZxcZ7eDWd8cptne1a5Tpf03MHmtVDNuu2zrtAQd/G0EHBu20tjOnL1u1W/OnCAfpdUIn16dVrajbd6f0B1zwpHedwOR3lHeDd7R3/qf5Fb+noIfnThN3lqZWa9N3hndzd09AC3dmd78IIoACdwgbAuszew5n8Sdzx6J3h2evZ25nHnd7d1rnyQI65zt3GucSmbknP3XbrPwbJym3dyqZ93cad+nbuVuZ20Sbk3dyYaj3s3em8/N3PHcnCMt3VnfM9zd3ancR4rZnnQdOdyInfucHZ6rngefk9+9nlPded1oe68edRydnUnfbx0cJVAHSjaF3p/Mpd3xnlQhRdwUuMXesxuFnCXfl8WF3RvfJghVoGXfxtll3E2k5dxV6Q2L5dxJ3WWc/AsV3N/xldxV32RBVd5FEB1gD5M13njlD58PAmeT1dwu3Efc2G0yHfLPGEEfZy1cY2PM7Vg0Y2Hg3zDkClzF480HENdEQ5VnhVISGuIBltFxNq/rVF5C0QLTiQAX3iJTJ945LtxCJ12yHhhv1C1uk0fdreHV3Nht0N/0DbXdDcJxX0/31d1XkmeTms3XkAbPh9zmw9Xf+qzZCZYeay+fZgRLrK70rKfeLq8aUuofiKwL3Z1jFFxJNjsv3F4v3PHcr96NLiDkVS9MX5fdXNcs1JkJrK+obHrnT906rPMIGq8a3MKttN7pXqlnx98FUVfftq4zX/DUZ9zM0O0HZ95MNeKsz5yRX7IcyQy+GLffacznCLfdyt/1Zwfed9JxXQRCY9yq3Pd0990P3NeTOs4P3CeRkgCP376tj92UXXiVkgC2AThCb9z7Luze2N8TzqXNuAAn3/uSP97WHOffh1+0XKLWCNUIX6PhNFImJtfez5/X3gRNwDz33gTmN94nkkffHt4BGYA+d97/BzQDcd6Z30A/awbAP1eT997KQjDdLEFpITdQckMgPWxS0QWdTsoAtgLKAmPc/+EKraHtJqzCX6nges0a4RoTYe7IX57T/oIlCYSwVBqDYRg8yEBUG2xOpQgBrOxdmtx639/dRVKQP1JfP9+n3RjeZ9xC57zWf9wwPP/dMD/vL//fR99QNYT3AD1wP5V08DxAPOT0cd4L3Qg+2tCIPffdOswP3i7TSD8P31waoDySXiqtcOJP32sqYD04QEQ/L97gPrTemt+03Z0v2DyQPXKvV914rLg/m2aKr1A+lS54PRFf7o94POjs7ARc3u7v+DyaXgQ9N98EPoA8d900AfA+QDzkPDGjd9+iQog9xD+IPOEvfoFIPQ/eyDyOXiSK4AAoPSg9L91gAqg9dq/TG6g9us/YXdsDaDyqQug9uwmOBpg/WBsYPXDh7D8+CBw9sOJYPeQ8uKxz9KXNScMYQ+fcOD6UPT/ep99H4zPO1wiUPTasl91/3aLcND9ZXOwEUq/Hk/g9iQM33HQ9vNzM37ffCEOAPR5dEwzEPieRiD0x4iA8yDygP4TvxO+rGX6sZD2gQZICEhjj3GBfCK4f3SLsH2GYbZ/cyl/PB3RfnD8R7ibeFD9M3QRD2D4X3jg/Ijzn3afcROKOHbg/v98KXOfe2OXn30BeJ90X3BDVlDxY05fecjzSP0EhqOR8PBxekVxrda/Mw2QOIAA+0QYCPHA+74NKPnQ8UTaEPfA+DD7330I8jD0x4Eg96S/UAiQ9TD/IPo/epDztLAYYUuyX3c/d7VAv3SqsLD56H/qtr90i7yg84D9iPcitpD56rJ/f6AP0XPkvXKzyrqHsFwGsPrrO5S4oGmw/qENsPtHO7D4YP+w/mD4cPoY/HD+GPpw8bAFYP7DP4D/Cr1w/M8xyPrw+1F2QPUNiVtM8PD/f3D+mPNfd1DwIzsYer+GKPOwH2t38Pso+FoPKP7Q/lj5WPbff+92CPvA8zD943cA8wjyKAbUK6S+MPodO+/H2SBgDiSOd9Mw+ygJvYqRAN1Pf58TfX9wUPt/ekk6i3Io+/97+DSrnNNacXdqPSjZmIyXevpMpwbcDm9xbkYo1EmfqPVg2kl6XzBrnaN8yXuY+mjxtE5o9cOEX9RndWj++rNo+ku5j3W/eKXRqrTo/p2Pv3Do9DXZKXZhvSl1yPehA4j36rQHenC1KipiZY3YShAHmUe7mzyCN8ANaXzpectXeH6CajAGAAgaJR+ut0XLsod4x7yY3PC5h333PFt79z4ZfDvY4lKLsPFIsAB5keEPUAyAup5P+oeo3riMX7/BD4T0uwRE/0yKRP11j0SFRrIIuNtwwMLfT7cPMJY3dd57fEcIst5wzTbedM053JOO6oi1Po1dCG3e8tBOeDJ6bd7edCTzE2rNNfyJ3n/wjiOzekZvW7AARPegAmMcRPDE/kT0xPYfdCoD7d+k/Lt+Xj/zsONzqzRY/xhxxLpLBCoGuI+WiTR2t41k/heXZPCo9QqG5bHvSZBLn7S4/qT3RPuSjaT5Bo9EiftzOBoLl5vcML21SPwqP5711FPRGGC1MmiVXXs8DhM+dXVT2q+KXpqIDOAEYAqQCaj9yAaEiOeHyrEU89PXfZWUxjD/jIshRj5IB7wU9CgHkAKNiGuJ3XuDmIc50N4Ug6VxuHIHfZs6BPm9eQa7/znLuuUy+HfpcD03y7H4fMe4K7mE8/h6xj7wtiu+YDfBCoPdO3VPATT6MBP4OFfZG16/uQdSH7Z9sD/ORm5+rTpK8oxRGumwQZEVwWrieiLcQhZhA6LhgtyKA6E429ou+yuSazjdQbAYs4cntP1q4/rNZmkq7jjZkmPaJvsjkmcq7/2ojWYQEPZ+d7T2eJJ6T34nfK98HnnnfqW1LHtPeFd/5n0wd8B7H81QXHa/eNp2uQcqtPVpLrT8wC09FB6411y2vt6etHLZv7Zyrn45lk93J3KvenZzInXmeHd0T7x3dR56d3LutA67L5Ivm3rojmtViK+aTk4fbhqqr59xiTeT+umvkWEVj5c3I4+b+u+vnLeetyYzrE+Sb5ZPnm+VBudOaLOgd5Z3L0+UQYjPkobiz5LvkC+Zhu+Vwvcrhu/Obe+WrPQuZ+II95Yubup83ny9C6p6I2jnkGz8Tn2VPTT9u7X6jmz2BNDzhLt1edNs8zAbH3qlmBy7g388vYN4K5IjU5O8VEpIQi05u3D7PbtyHLHkNzT/+d9s9gUxTVIc/5KxSPpdentxKHD7cQd4UQ0ACCTVIGT+RV3f6rI0G71QDCd8EC9ExNYzu6ufY97E1P5IMQ5IBLgI69gU/RtJNdPVdT2NP5s/n+1RX4Fc+ABGyryHtlXbZzDbPuENIQshDzc7VPgXNJAGw4ZBdhq2hzqte/gR5zZhRDc/hzwbgLc9fCS3P+c2WrGFcJuGtzSkJUc0J45avmwV7B9HMgcOqE408Jz7MiMoSAdyzDdjcmT103jjdHF4V9XV3zj0lGqUYFK0uPlsgGAFnRhbkJS2nPEEGZz+fBxJdhDTsG4r3vRm3A0gRYy9I4IrDT+UoQnxByEHgETobF2H6zMRC9SC6GCpfdw41PSyOptzdzTMT9TUxQG8+JzzaiLLtqA0h3Obevh59TAZdPC0GX8LNFt0NP2BOT0+K7408Ai+2Pb5OWzyQvjpAOA5QmJaMWIIUQxqDhPJL0QhB/pAkAZ4RhDLKAZlC5EIwzXGjAAAPALrVsaR+KmqcWi63n+seQJ6kI25GUvfAAhECyYKbkqD0ZTxbPqYiyL4VP1s9bKHIvgA+AsCovSi9GT57XcHMO9Aqz4U/WeG41GY+0uGC0UCunj6nTeY90S6ZPeTtHz7ojNs9CN6fLEBAaL2DLBSsmg5fPLBxZ0U2PT9ioEKnZ3wsTgCjLYRClg2AUrctSVz3XlHT7C1LBsIFL3U+rjqhYe4tzY1fXVzvPQaPct4QPBjXGNAzUGMvnOw6UGASBWXBzrC96LzqHcHsWL57PALuHF+ZPsADULxRXdi+V5E0Lhr3IEE4vIA8UTSi7V886yGEQni+0eN4v/d3LwAPAthDdsNOmRgsrF6YvuU9LRHfZxJCiraWDZpSlgzcQ17fn96M7eU83OJvd1jj2czDBZpRlABA0Uy+WqzEv48+ewaPYBHuJL1ujBA9Jj6kv+S/ky6e06jm5Lw8DOkImL/ovDztAe0UvRDf81yEjFS+NNaDIVS9UEDUv0yjL5+Sw9S/OT8dXm+fl17rB08JWO0PP36Mdz1qQY8+dz6Nz97C2wSRz089kc3PP8kYhc4pGHsHLzztzG8+QK9cvqoe3L56PMnhd1zOUJMuEQGEv+MtvBjEU6y/xt3LjN/fJL9cPxhC6L1cvlA/mLzkvxhA52LSvQxfGNzP4KwCVeM6HjzvjlzjZXg/do6KP5zcIEAM31fqvL4APYc/fL8CPnrdXATM1khBtz+KwoK+ysGRz3c+mEL3PChd/N5PCAK+TcxKowK9zc45ziHPgr7uwvnPQryBChauewcWr88+Ir+7BHzsVqxFzODgbz8Q4hI8cDfC3DavSBDIN0jgt5ASvMy9tNDc5lkuc8yB73rma1VEvey/MowcvJag0r+kvwgSv96B0+lkcr1IX3q/cr2h0pXPyc/ezinPEq18PJxMVL80PLy9OL4h4stTUwQ4vWa+gyzmvv4Y/L0rX4hCAg6xE4KIp5A8wJE+tz2KwErDec1svy8+mEMYQyq9cF6gU97cQRlk07Dj2r3hGkS9MRrXdQdQkr7e3BBSsSISvfc9qr+hzesFar9Gr2HOSU8yA8q9sePhzy4Y8eOJGMK9Ir1avTa9Bc+avG3Prr1tzKK+Vq6vPe3Odr9y4MRCpED2vC90gOc80JI8QV0jdUC+QE6B35peXC+BP8BPZt8hP9wvAC48LZbM4LxWzeC9vCwFTZbcPk+Qvci+4SoovpC9UL7q7pEq3gMv0tsQO9Nlh7aDGoBIvxmQ1QK2gZosg+WAnCIsCT0iLsk/medOeN+6rQNBvBhFTUI/EApXiT5V54e5POpHugk+HbSiLFnlQJxlY505zC1lTmEs/I8QvwG/ATaBvlC+u3a8vjpDyWeovoMucb1obHTd7owWPpS89FILXWtOOL4WvbA+ksOKvtY9NL+4vrS+ywzDU+qgdLxY1vi+etHIvLjWlT/HTZ7QmkCm4ui/7VHArmjeBvWs50jhGb64PWoZmb1LBOY9OD2q4o8IA17EvE8/xLyRoo4/bF1y3Vw9peCyvAsbwUPGvLYC8r4fPZS9r+kjDBa9CN9Jv64KvLw0vG+ewqCKwsq/1r9JzCq9dzy2vKrBDBrpTA89ArzOvnnPzr7qvYK/seBCvcS+JkEavKauwr4Fz8K/3NAvPGxfWr4mQfhR2r7uBHRfsFyh776sjQQzCem93sAZv+K8ur+XPPq/Wb28Pu49Xr1f3bm8Urx5vB4hhrxvkIEK1q/k99au6b8p0bW+l90n3jI+Wb6yPz7kJryHCvs8pryJv/K/lL+ajwc/ZrynZH7NhbyFvAWO5r4+ztY+wc+Wv11Ch05iQTCK1r+3P2W8JbzJGSq/Jb1U0twGdr/NvLoalkGev3W9pj7ZvfW8StHXdNm+0j1U0Iwtfj+ZGnW+1lKlvFdeDzxlvw89ec/Fvi6+Ob9svK6/Ec8avxW+rc87BJaufsCjv4XNVb6pGR68db0Ndp6/nrzHBPW+OS3Zv16+It2SPwaPJt9AvD69pt0+vh5NZt5mE9HtKk5gvn6/fUxh3LHvpo8NP/68Rl+KtHG9Ai889fO+4S2QT7AY0L7eAhRBBi6mbCPDIR695yG8Ibzfcg6Cy76hv4bsFu+AnIi8yT9Rvwk+0b2iL6Iog612kn75Mb4H3QG+aL8K9rG/G73xvqi8p+ubvxu+Oz5OPvLclLxtvIu/Xu9mvX4Yyb5Q3Ja/8sPJvdeweL0pvr7teLyJLam/sPRpvhU8TSONvmtmc1RGGidPILFnRgIPRkKa4q10fXYK0CisAe5GvP4KIK59vQsKRT4W9hhAQe6Evfq/Gb0B0We+1z93LuRBtEJHvRO8XS6UNy7jxDX0rcYbqN4ePlo0Nb8yAFhQEc47BZdigVy5v1g8NT+/zTU8Ue/uHVHvPr/YLjO/Id++vEX2uC1+vR9fBlxALSRtc72hro0+6k6bvYG+sgwvvAm+zT06n2Mhb9B1CADsZBA7SZIAob8fRDNwClXWg83hIb+lYxqBK7zrH6G96x+Mcoi9gFTRvuG8OJGbPFC/87wedy+/871bvpC+FoG0PqfpOLwJvNu/uK3HTnA0+b3W0NjT+b2ZPYm/nN/Pn4W/Zr1/vYq9u7xKvpdee79fPim99I0/Lvu/tL/7vv4Gn6gsLEZDZ05gAZzmxBZJzKeTOAHVCGwC3gcmzfddyNzRCm+8VBrir4S9ky2S4dc+PNIvd/a9CgJVPyhC36M04Lkjw78vP/W+ct4NvIa85tAAfTq/TyyAf+Y/Kc6Jv1XMQH8FvXNgirwCPgF1fL3Afcm8o9dtGCm+yoG0vIpCqb7+B6m/+L9+joe/EIYAfEe+CuF7vYRAx73Eovqh7+XQfYU8FL8CNPVcnL1o3je/RVM3vLDWa10GvnhOJj55v2m8GHzn3wB+rV9/3fK+avbyhzA8yH1soUEN8oIe3IR8rQ2Ef7u9SrzFvda8Lry3v8ZDNrz3PoQb/4PJiu0YNVEmv5XMEEINZvBC+r1YfSdh+kJcvCHvMH210yzv9zxDv6W8zczGrzHi3b3Dvja/Ic5PPdsGY70WrW68Irzuvlq97r8hzO3N3wnkfSdNry8X3hR8RL0DdQ9gtgGTvJrcU73evO5MwL9YL6bfwd05TqC90e8PvDHsfr0x7ArtHI6x7OHdZo+YDA+eZgE0AazeMeXiX+x/C7z2zMVu9LbYpQh35zdhpUnsqnfjnQi/8T2rvVG8kvPju6i7L9IP0e4sN9Kz3FslgTApgIUyQ103EQAjQZNkQecR+DHVwGcTDcBhkbXBpxP5wgJ/L9FKEivQ0PXbE7vN3vdXEQ3D5EOkEMyLVxJ3AdZt5xIUQUIvRmIh9wyiHH5C3YiM2z3JjPt1bKGSfWi/QV8DYeh83L4UvEvOQ174fnw/+H4HPM5fV+hgUudccn9Ef4ocw+DeB2UBft24NLIYOlEKAjgCQ1x07mxACOwKf5DUCwheviDRRL4417deRsFXdkNfjcxqvqdkCOxNIR7haD3xGiq9CRqwr5bSiRkKfIS8bL3A1i1fD1By3h8Pjj9y3SuP27wEfanPQgJyz6jWUn2uCjp8rKM6ftY+oPUgLYhDpy5UE4cLMkOYA+Di9MS8YQEh8n41C7Lf5IimzSrBN3TEQ4p8gkCnP0Z9g72yTt9iun07Tw8CZgNdEmh9WO66fmp93OAGPlhR6DwYPu8ICO2SAazfEH9sQoZ9wty+XEZ+yn5y0US9LL5FP5U+uH8lzAh/HhrSfAXi3Lwyf7ddMn9OPrJ+BEzndBPPElInkzp/n5P2fCaKDn6VjkW/4eKrdczljnyGQIZ+kH/yfVARVn4oEowuLL8NUjZ9Ew8ekH3izn4nk/d0an/iGTZfYr6afirNdy0KAQZHKEMmzdDggwaf557gJHwm4G8JpS8Av6iJjH2OPFO/Wn7VTVi+Fj+Af5S9ij3OPyUZnz6szYC/GnyufkZ+4gPWfPT3lT+mzYBNkeyBrzU9972BP9O+Id4sfMGtAC6PvB9efh5Pv34d/r7PvAG9T03+NShyHpCWNNaNsec/X5S+v15oc/gCjcNXEeXSf16gIQujoAFOAQ3BzgKdwCzqncNtw4FSVWDMiCpuAACXAgBCuYvrSkkBLC4pR1D1uT+ifoq2K9KeEFcQgh2WVy6eGyu7Kv7osree6HFysZx3lBxUC23qFTGWTWPmlR0DEiyC0RItVcCoQJgKnhIRo7XCAn4UQhl+oktBkFcSVxIB9a2iAfXQ9JIsF8IUQC4AOdMyQlcRuW7OtZkd5AFkQiZsLgGQLWJwqEMhcN4CFENdSbJBE67JfKWqUXyhoPl95xCBhVM03p9WtNfL+AE5fhGjRX+NPecTbDCgM973iZyUoncDlEI30p4SeX1Htbl+lixNgncCg58v0hRD3BCooCQtFX3JfIGQoaEZODfCFXwI6KhB/pAei2RC2xA/w2V+UJLrvDV9mX8lf7V95xOUQ6y3i2m1fhvAPA3VfKWo+XyooKhDJX4aYIOsF8FuA7V+zX3NfEV/8VktfN4DlEFNfG18rXzDAI3C+mHXAa2gkeDtfivY63QuALjlqRJXEXXDXhB5C1YBGNOUQVcJ48XUt2J1Ge6AdPP6bPhveoSnbyoW6eQD5ANg8ARjcir22VF8YZMSLlcQvDPRfjF/MX3wQrF98EOxf6GRC6N4MuRC8XxAA/F+CX8lP0wSuT6BimQSK9OJfqRCSXxSzID7fX5FfsItOraFMul+keIr0Bl9GXyZf1cQ+XxZf2upWX5twGGRHXyzfDl93vbkQzl8YZHhsbl/UPadfkV4zX35fYEyBX3Y8wV+hX8aF1NNeX1FfZl+xX7w2xN+pVlNargApX1TfMt8JC0Cf3V8tX4D3Ydt5AHlfBV/830KYJV/XIOVfXgyVX9Vfimi1X1XtNAc6X41flNbNX8Jy418dX7MiWV+a3/rfppjS3z5fg1/FQHlfo19FeuNfKiiTX5bfXl+C3+XE81+9X1zT09CbXytfimhtXzlfiwibX/4A21+B31HtDt/wIAdfW3DHX8yQrt+5X8VAl1+83zdf5LMCEPdfeAhPX4ib2QcaFSCdb1/ZnfUt1Cm5l5FesWietn9fkJyh+hNDIE0EXyRfM7fQJO3fUwGEX1SfEn2eO5yPbZ9fDXQXs2/cOJyPzbgYexkv3r10F+nYWN9rJuF41bj43xXE898j3zxCA9+T37B7T/eis7lGYN8V96ErQh8A71vfhRDPMLvfubSvb2hB6PigH9YvgW+kN1TYQxR0VwMok58+VwMojEgcqNRIVBdCBIMv+h9OD9W4EXSSBOnY3F9cOOzLue8Or5iv9W/TLyA/Ojfeb2E7orAWkBx3dK81D6YQOID0KxK0twEJ9/kf/28ogYddyasGSxGvmn2b3+nYv99YuHS4AD9sOEA/GSG+j9g/6MvEuNRQIvOk4mYfZ98qtGUGJd/MKxUGNjTWBsyQFQZVcAlBUoFUl+2HGsEwcOpNIWgRdNAAYiaYcM+3x5fBV7+BktTbFFcUP5T7FIBgHIDkH36POD+f346vB9//34A/dLiEP3W4g7jmb7w/rRc6cDP3Qpc1F5UPpUtxhtHTmsJwP15vTIFYPy84y8J3nxbBXDhsH5gJvDcV87wflp9vn0NvTUhMr/7k498qPxivQ9/4P4mQi9/ONcC4dLiz35kEy9+X31+fkh9kX99L4xQN8TYbFht339EfO5c6yBI/qxT93dI/lxQrtHsUBxRJszf9tW9yq+A/wO+QPwtvT/pWPww/9HRpNdqfpsG6n5bBbgDOP8aTnB8vnwNvVp9eP+Coly/hr6o/uQ3D3+UP4w0YN/iAw9iJr0hNCnN1WVZX6a8vA+pzunPbVziQrmJsAPIf+1ezP8LZCz/wH64vsHPXb3KvtR8OP8XYSW9mEG2vJ3j3t0UffR/WH1A/d9mE7z3C+e98P859o8Kqnxhz7nNQ7yCv2z/6r3dv+W9Qr6uvyO+7r0vPyHNmr20fpatfPzPPt/M2r97BIHDHPzlP3I+UxhGGFz8OSyyXNz+tP3wf7T8tn9iA/LMn34PfIRQUyyPfTK+F934/VD89P4E/6Y8L3wTf898z3+Zf2N9xq2E/W9+r34X3aL8jQSQE4VQ0X4Kza9+4P1Pfm98j30ffWL+IlGi/7EH8wuFUYLicjzQ/J7iZuJU/Ke+MP66GhhBPX3cvcnOjP8mv4z/1s7CoSaJgH7E/jCabV9M/0tdp1xWXny9LP+q/j9/UgIX74yMQQ5s/cW/Dc3lvLR8Pb/s/VTSv318Q798T38y/G98EvwQ/2XR/34mQJD+mEGQ/Giuer6A/sL+GPx6/ZT9vb5G0sW90P/A/eRSW2Ug/VsG8Tfe3aD8nPwKPzcI0l5Q/j/i2v3I3QT/3sNo/xnjVuC6/OIBuv1w/ee+ZLwY/Nc/agYI/ghDCP6I/wk0vt/8v9z8WNdqvc6+4c7DvQbi5bwavkK9+c00fAL9wr2jv26//Px0f3z/7sN0fIHCRv+C/dJ+Qv7G/mg+4vwE/6L/T34mQKb8h+Gm/mj9+kFm/CHtpXcQrUS/rzwIQRb8qodvPrm8Iv54/SL+7ACi/TL94v6O/rL/hVBy/3Dlxv4K/e7+0v4XVIT/Ev4mQET/kv4y4K9+ov+vfib8EvyPfDL8Pvwm/E28H32y/x9+7vyO/3L/FeMKPXs9hwg/TmR8xwlDClXwDtPq/Qu8l+lKvCr9X39+fyr/lL6nXyd1bNGB/LlfC1+q/P5R08JV8Or9gAK1I1UZqPYa/8R+Kr3s/Kq+DWVXCsAB7xvpBUibLv9Jdb/B8PWrY7vOaiPVweKhlv1OvdHiPPzqvDa96r3W/rz9ObwVvHz9Fb82/JW+tv38/GO9Cf1DB2O8gv3tzS7/CP3R/CRAxOR7zAAjMf9d4ne/8H+4f9Yg7v9S/j78fv4KPSfgWNEe/vVd+gcO/S9VJvyKAl78UvyS/ol/L3+FUVL+cv9p/Ye/Pv/S/O98/vyZ/jn8WNOy/b797v3+/6PgAf1jBPs8gf1u3SnOscDB/aa+BMwh/vw/of8h/ddSJw4s/eddbNCnDOH9qkG9jhH/bP8R/yR8Wv23SXrgUf9a//j+uf9/fDr/7cE6/97Dpv/W0uj9FP2A/EZ/Rv2/CtzkBv8K/Fm9HwW3Vob/+kE9vlcLZf2AAvb/IKy0XMb9zSye/RLhnv9UXP9+Ov0Q/U7+kP4O4oLRzv1c/ub+k76IGVH8wdzR/+3AiP6u/Sc+sf4Cv069VH7OvNR9cfzlvS6+GrwJ/h8Lif2mrrR9lbxav1HOdv63v3b97cx1/MHtdf9V/PX9Dv/G//X8UywV/vA3Dfxo/o39+kON/eEbzv+wX038CP7N/CC/zfyUQxb9rv6p/iL/qf9xzYkIuf/vfun+0DxY0tn97354f398vv85/Wn/vvw5/SP/hVB5/UP9VPy7VPn8Xhuu3/n/Sv1kf/s9ts/K/oX/5Owh/IrcU1WuXbQvNC7F/NP/vLxTwbfdCXwgLKX9bf7x/pq9KsK2vLX+Cc+WAvBBXfyO/NkINQYZ/u+e9f+sPov/Gf9D/0EE4XeZ/Oj/VuDe/RX9mf4r/E7/YuG9/rr+DuKeE6e8oK0yPhe/5v/9/5kiA/4t/8qEzRHqBeKhO1Ja/nXNUFzS/A3/qK6kQoq2fj3YfOv9gOaU/R4/lP/c0tX/mLEG/Nj/zOE1/KW9Jn1R4ap8PP+t/mW/Vv8a/23/cHw0fiO/Lc80fnP+lb67BJ3+Lz4C/K8+7cxUQ0AAC/6c/5T+UImL/OL8KBrl/Uv+0NDL/RL+vf9e/pL9z38X/97DyDeX/jjVDf3L/av8Zvxr/Wv9A3V6/eb9uQgW/hv/A/1IGoP+bv+D/yL+Q/6j/j399P/p/J985/6e/I7/nv4X/S98WfyX/Vn8Uv/e/2P9BTwe/FjSvv/P/eD9uf0C0WP/9/7+/6EFb32DHmv8uf4G/1j8Nf9egkr9FRH5/4cKrb7K/IX8sn48vdrdIfzndjP9vhpyfsz8P/004iX8Y37sAgQuVr0uAqJDkgASXbP81v2l/bn+4b8rOb8/1bVoUiTP+SIExf7W/ye/uO/Gv+qb86/6lfz9IJFUCb+Ob94JC2IkDXqdXQP+Fb8OP5Vv3iPi8/fM+bz9G35rrw7fkn/X5+x392j6nfyT/hd/VP+6f8qv7ZIlsfrn/SX+iP91H6wAMK/lX/Er+br9kAFff0m/mgA/h+Ozd8h7d/wqxpp/Oz+aP8v76fv0PfsP/ZR+TACF/72v2CfkX/Rlwln8yX7Wfzh/p5/Mf+A39kf6f11UAXl/cQB7n9v36b/y9/kf/cgeQLRd/5aAIP/jj/YBqroYT/4jggJ/uf/AL+fs8gv4DACAjLB/GJ+tQs4n4eNDv/indNsIZCIn/4Yfy8AZciaI+YVs24L//zD/hz/TdeZr9SP4s1Q5gp4AUABye8vt5+vyz/vd/Uf+2gCYf4f+BV/sQ/ad+MRByiCN/35Vtc/XX+ZR8J15pbzW/obBaHeWW92f51HxNfgjvfj+SO9BP4kAJbfr1BdHeUbgDv6bF0k/oevGgBYACbv70AMHfowAh7+agCYAHJvzgAZO/BABbr8sgHZv30frwAuF+7j8/0ZdM2pPnBzS5e+gD8/7iwj0/kC0Az+I/8+v69ALHfhX/eQB/bhFAFl/zvfjZ/LQBCwD3PCw/yBaMv/eYBzACUgFGALiVnoAkQBXn9t/4j3xMAfv/Or+pj9g36WAN8/jYA4D+RP9CaqPs2C/k4A8n+R88FwQYtFVflq/KL+9j0fAEggPFejh/AmIwQCdv73bxI/gc/IaIgnMqIAxAPQfsTvAd+d39ugFJAMOAco4HC6aQCRv7q/z9IExCUYB2v83+55AJ/bqq3dVe5b9Id7B/xKAaH/UeePH8CAF8f3eftUA/b+tQDhP71ALbfmJ/VkBEn972CRcx7fu0ApEemD8ugFGfx6AckA6X+qQCBgGq/2dfhkAoUAhICUAFjALpAhMAi0+UwCoK5932EAQj/GQBGP8h/5j3ykASKArEBORQL35bAJ7cDsAyJ+s/99gEr/xZfmv/HEApwCbgHrAMX/uv/a4B6oD6v7n32jXsYA5q+pgCngHz9xoHsf/N4B6E1Cf6JODGfhVzRwB/URnAESH1cAcq/XeAHgDSlZG80QMJB/bkAYICc7on4E3qLGAiOeZTdJV7nmUmjsiiGMB56wk4wyrziPql/RLe6X9gAEcwTEgMiAqN+GD9uv4JAIxAWsA0UBBf9xQFsANr/lKA97+p69sgFDLym/j9vcde5IDJ16rf3Y/tSAp5+ZQDa34wgMIAYVvFkBlAC6gHKIgo5uivRoBXICsd48gJx3m0A2IBGe8IAGg2SgAfZ/MQBFwDBv71gPgAY2A/EBzYCiQFN/yd/r9/fgBFw9d55bv1mAQcA84BYoDLgGj32xfjqAzEBF4DawE62Vl/tsA6f+SgDTQEqAPNAXa/TUBJwCUf42gJrAYsA44BVwCDP5cvzuAby/N0BjwDPf6H/2dAdkvfH+voDbAGfAMC/pN4K/+AW94P7qHDQ6JGAtcQ0X848bU/1mfomAhL+qT8EOT9+UYIMiiegm0ICI/77sCSPkAAlB+lcIWwClgL7fu2fYx+6IDhQF3gI1ASwA/oBm4DBgHbgPr/n6QDogLYDZl65AJb/mSAnu6hQCewHFAL7ATW/fABOz9Gj7EANHAWyA8cBDQCTV77r2Bfq0AjMgtADywG3f0rAUxA6sBeoDHIR1gJe/g2A4r+0oC+6i8QIJdgeA9sBZK9fZaCAKKHn3/X8B2kC6X5agJvASuA0QBaj91wHp2CfAUaAl8BuwD+3Bz/zOASxA9cBGgDGX4+QNX/l+AwCB54CRX7VPwAgSoiMCBgUDngHe/2iID6A72ecED/QEyv0DAaT/IVgIYCHd6oQOeXuU7HCBjcBaf61L3ZPjlAo3mjP8cP7pgPqUMRA9/+sR8bt79gMAAY9vIsBHXMmIC0QM6/gKAisBkADEgFaQPvAf+A3SBiv8OAGDuGjgpc/VABCoDSQGJn29DgH/SkBlR9RIGcf3EgfSAySBUf8p55NANj/iJ/cgB7b8ZIHcgKTIHOAlSB/IDi+5DXQ0gRL/XUBHUCjgFdQPYAYZAtwAfUCYX6mQIwAV3/BMeQgDrIGOgItAcFA68BiJRVgEaeAH/qZ/NyBoXhFhal/xNAXsA98B0UDPwE6AO/AZoAj8BT797oEb/xsgeYAvmWEUCHgH6ALMAWFA3H+3oCYIEJQI+AUlA4n+DgDUoHF+mQgUq/VCBQq91wQ0/0TAQTIDV+2ECMP54wNq+CVAgiBGYCVOC1fCAeqRA+o+5ECuf61QKogYJzQiAjUDrv7NQPUga1AqsBz0DbQGyALYgXpArcBBkCmwFCgB3hHuAnIBbYCMAFb42EgR64HABm38poGDgMZAUQAz5+04CWj5x/wyQuVvZFeXR8D14p/w2gQuA8AB8QD2YGaQM5gX+Ag6BOtlcQFDAMHcELAuUBxID+IGHgPMgXgPS4ep4C1QGn318gZeAre+KwDbwHtQKdgQ+Awl+k/8FAEeQK+gV5As0Bv0DgYH/QKtAT+A26Bf0C/IGY/wdAY7Ap0Bor8XQGguCigb+AmGBMcDwoHwwJDhO8AnGCyMCvgEk/zlfmlAv4B1992ICZr2ygUTA3KBtMMJxDFQPp/oVA2uopcC8oEdCxcXpcBUqBREDIIYrQz2PjagDwgk+AKoHUwIqAWEAuEBPP8OYIYQGZgYL/cueO0Dxf4GwNsgYXVE2BnEDEAExEG6csLA1sB4wChoEdgKEgRUfIoBZVQQ/54AOmgcuvKoB0f95oGbr2VgZRzBP+FW9FIEtAM1gWn/TaBEL8zn6MQN2gcxAoKBrEDq/7sQMlAfzAncBQoAZ4EWwP3ASSAgSBSoDG6Ye1xmAZD/bp+XMCkf7RP1DAadDcMBEX9SWDzPzQKGt4cBBGTAcP58EAVNjTwMkOOR9+WBnwP7fhfAv0g0L9Hf7vwOtga5zKBBI+c68iGCz5IMEvKIowD8Gz5HgNJHldAgpWq98/4GGwOxARgEQBBGUCcbKSj0zyBXkNPIZY8s8gAyzb7kXkEvI3FcRQDMINVHvAPdSWDeRm8it5F78noATvI3eRW8jlf2b/iyGNSBnQCSZYLoF0mgm3chBkc9l/5UILHgRFArH+qiDwYErK2K8HQggI+qEDSx5zKDWQMLYd5Qqz82+7svxKVg3UNZAhgtQ+YBs3VrkmQQ9IIlRk2Z0QN9foKAtPes8C+IGiwOz3vC/Dx+SiDUwHb30BgZogj2BnUCrwH2X3N6McvLRB86sL75iHx3boHPVCBnjQBii1sFP1MLYRJB6Atoj6hIIHgNU3OWoDQBWG42oGuAG/MdhuFJAgyhbFEoKN6wce60qgSkFxs2cALJ9LCEVzNO4AdEHkgnEA1xB0iCeAGDQO8QcqA7+BSFMLW4lLx6bm1TML+qEDAQHQgCKbqYAPCma4IhkEjILb7gIQEQgbRAmgCYDD9bk04EEG/d1hkENN0PSDI3fWBH99/4G3wIV/lP/TYB3sDnwE8wMkCJYfF3+xEEOw4lPzoAd+PepCScCYoGGALaQV/A5FuK7cUm7qOxJqhi3IeGfSC0C64t2lbsMgxOWrzcaSgfIKoIKS3NZ+lwFJkHTIMwGFS3TF6cyDEnJAt1DbhY1JZB4LcVkE2F0cgS9A7mBH0CZ/4+wJ2QaE/VFBd8DeYGTv0OQRgg/iBzSDGkHdf0xAh6As0eXoD/1bxjztgdobLpBn58Pm7HhEFbvnA8fw7yDa6ifIJ1xmMgjSmR1deCBAoJmQUr9X1uRMMAW4rtE1bkG3ENuVBBFkGT3VhQUGUVZBV8DJUGjwP2gTQgnWyWyCMUFvQK0fhKAsr+Pr8qi7FP0q/jIg85B0D9LkGegJqHpMA25Btg8ow6rt2ZPniwP92HRAlKY3/yrAI01Ipu+7tTAB0kDKxoS3aVutqD7UFsoLrgaS0M1BZIAQUFKtweBlEPfpGOTcSW7a8VTsjCgwpBeAAJUEjwPWQdQg/UBOF15UF7ILM/oaA96BuICcUHffykQacgzVBN0ttUHEoLMXnqgz+BvzNpgGdIONQQcXD1Bpzd/gFBM0ZQU7TbXiLqD/kE/INrqM6gz5B/yC2+4eoK9QT83cFB9LcHyhQoMwPhWg4NBcKCYa5PQOgARsA5FBr4CFUHxoKVQffAlVBED81UEVfxAvmcg9NBtzkdUEkoOzQaQgm9eFKChN73L0IGh6gmZEdcA9EGs8zLQbWgqRm//1HUE1oM7QXug5xekc8TQaNoLxhkdfX1BMqMV2iGMxRJvpTZtgu6DlkHioPhQW1A6VBQSCjYHy/0+gbe/WNBiqCNwFYoPrcMQg3FBub98UGLgL9fkSgiCBESCrQ5koMUQcugg5uDyCjm7otzqQXwTNXGyr9SYQ7oKPQYjjG1BGGDSm4etzWZuegoimb0NH0FioNDQS+gjmBfaDTP4xoPcgWigq9++yDhv5JoJaQUhBb1+46Chf4XIMzQZ3BBdBNsCBAG+IOMnlSgg+edFBBHo3/Q3QVug1sAZaCEdgQABdQdIzb5QRTcxMESYP3QdEfATBnqCL0FkeAsdreggmG96DcSAyYK7Qc+gntBbsC30E3wJcgb7A79BVGC40G7IOMwYmgwDByaCnf4gYJ1gU0gwREc6Cs0EvAOKauu/HxBsGCUW5272pQQpg4tB9KCDEFSt1rqJpgv5BLzcD0EVj16gJWgwLB8mCtuCKYO+bjeEK9Barc6W4rtEhQcKgixq/mCn0EkYJ0wQigjZBBmD72CUYPegb+g57+ByCLMEMYMYcCcgjVBqICL4HgYPofrDAiwBTmDLoGuYPuQVOPS1u3wAFMEZN3pQfEgwZB0rd/MGYYPawSFgz5BOGDtF5rMwUwbMgix2wuMBJDJYOIwSuTJ6BEaC1EEf+GywXS4XLBrAD/0FjoKOQeOrErBBKDbv7lYIMAVBAm5BuaCVQFbsxd/s0NKfwKFcLK6pN1L9Na3E1GryC3gxloO8aNgAHmwLKDpW5XYJuweOTPxBJoN7sE+tx9QS2g/lBgbdtW6yoF1bik5OnoI4hVm6QtzDQb2g1cBzkDnYHGgKMwTlg4dBf6D8sFJ73HQccg1QIRj80QHrYMggbHA6DB5K8wf4VYz2wWqHRPuzX8R6iWLz4wVa3Y8IXmCUIGcfUuwX9gr5BQWD7sEU4OiPi9g4jw1LcYsHwkD5QTGDBlu7aCrHb3YIBwWgQIHBumDyMFIoJmwV7A9FBsaDzMGw4KWweqgqdBaaCMnYZoIgwZVgiGB1WDyUEngJ7/sDYWjo2ODDsF44OKXtSgnpBW6DkExk4NXgDzYApuYAAim5U4N6wT/A57Bf2D3sHOGwsauzgiNugODSMH6wJ5wfl/QzBNGCTMEC4LMwcqg2w+lmD34HWYI6AVqg2dBbGCDF6koK2wYBrQ1BXpNeMH1D2v/ihg9Q4QkA/z7VwSaaviNApWNuCpUGTYJlQVGg6bBX6DHcFzYMfgVxAvLBdGCCsEDQMYwc7/adBEuCfcFS4OTgXDAql264cjJqeTXpRCV0SLo0U0PkL4gFc6IF0HLo3nRO+4/In86GF0Bng2XRZQDBdHK6HXgxvBUXReUTZTX2QhChEyaXk0G8HV4IhGM3gk5EbeC+8Hd4KgqE2QX+MYU08UJr12DGmB3OBej7d2/5Lfz6muvg2T+tXArejyf0Y/kp/b86KC8X15D73QXt1PGFm6Hd0J4c72FdpsfZ1Ogu4Hej3XxdsNqEIbgxHci1rLNm2inspLG2wAk7I6J229Th+nTgOjggj5Cx+yv1rD3GiSSEcO07Bpw0zqGnV1SZK0dM6ULR+qvpnGf23n4Ao7WkjAmBXQbSUoxtNzzhXzPTvTbXwOYAcx06vdwhtu93AE2MAcAdxtMUwIe1bJQOUxtfFr6HTMWihnCz2iw5ECrUFUwzqxHE+SOGcrA6Oe0NthJHfiOradqM51HVIzmWnbiOE5VK06UZ1fynwQpa2txtpL5wljQIZvIHT2WJw5ABYEM7pOstaUwO+1KvYC5UxNkLlDUkQBCAjD/pyh2oBnbTOaxVayqgZwkDhadNT2Vp0tXwyELsECFHJHuOOdGNzCdzJTv7nClOZM93O6Ezyk7vt3O3WNPcCu5a92XCiV5BG2a7UkbbaMR2Uh/gpAK4EcoZ6oHHX9qoQ5K2imdsco1ey0IdoSJ2AAxxH04u3jrUnZnUmO1wdm7Y15z6Di1naEOPycAk50xyp7nhZTwhHvcTu7k9WUTk2ZC9OY2tRLz0ljO0L2NK9kwq4BxpQUWSTG2iELIVREl1oO1hJpqZtMmmQFE/kDIJnemv6eWk8ZZxncRi20jBGh0PohxXAyuDnjFtuqV3PgU29gkkgtUSD1J71ZzElScPnRO8zUROXxY72McxgACXQFpMi69NqoUt58SB2xCzADhoaWQ32Qlg7Vd3+5q+Gef4jBQUQgNd3wvhH6MCm7iUq27C7wbbqcfbIqRQFEApPrS/weLmH/BXqd306wRyptkVOeIh8EdMxx5FTAIRTNaXe6mc29qaZzDTrAQwwhah0p8pgZwMzv5HONOmTZSI4YEOptooQpzacXtQA67p3ADvunQIOuu5gg6fd30jr4KCgh4xsqCHi2xoIWoHZDO8R0GI57+02OvLbGz2R/tdjrrG2wPA2nCtO+GdRCHw7TNtuLOAQhbB1y048R05IS57E225gcZI6SELV7vHQSwh2aA5CGOAAUIeRHNXaOBDGDYjpxNMuEVY3uVvIdI50nT0jjDbI5cqvsyTaeJyJ7t4nEnuivcciHNu127kTPaTun+kiiGAz0k7j4Qm8aZFFygqLp1kCmcnN4hQRDIcqf4NCId/g+TO0Ec/8H/EOPfNoQvYEdHdB/ZBpzyDoIHAoOQGdWvYgZx8joiQpAhiAF4ZzsaixOOgQyk0ZJDOJ7eB2HThxnUdOpplx05qkJklFOnIgOJJDEUjJkNFtp1baghw35qSF0ENpITmnekhTEd807mziwzmwQgwOuGdG04iEOFIWYHYjOMkc+SFcR202jYHFshAkdpI40Z3FIdCLNEhzGUwJhykOhkpwpe/gPxDfWJ/EKrmn6QoEhamcsSF44T8OgWdMf2EZD1irGEJU9qYQqQO+EcUCFJ4kTIf17LO216B/hgIBWCIZ8Qj0hi+01u4muw27gInLbuzDsvCEU93NIe4Qr7O4ednvaR52Xtv53Kme5RCHSGU6ydISt1GohAq5Ykx1EP2CCKuJoh5wRWiELjWXWgqdWlmWbsOjqY00cAL0QyHWmhEUqq3DCGIcWQq+YoxCEKEQPAmIf3kKYhTcQZiGNeSc6mz0QTEyxD+XSrEPh6J5gLNgmxDtiE3fHp6tRwejQUiJfwAdECOITKQaKkZr4+squpyYDhFcSchInt2A7/4LgjoAQoEhQ3cEI4jdza4lxPSEhI/smvYwEI/mnnteAhQ60TCHlB1e1NuQlEh5lghyESmAxIRLfFk8T3cEvZcZz/EhqQ3jOWpDYA6kkLUoeSQlNOJZCTPZb+ya2jv7BI6jBCqCpc4VrIawQidS7BCyM6cEO7IRtbZ/KvZC20662xEjo2QjkhCowuSGm2xOOubbAchW5EEyGyEOHIfIQxQhuDxdrwmrXWqvgQzMhhBCJ05inCJIcm2L7uvtsSbz+21r6nqQtH2BpCnM5GkLxngDPAmeQM9Ve4gzwkTrkQs0h2vc7SF+ENZOsHtcOOLpCkiEw5UxBFxQt9OPFDfSFQ1n9IcCQhq8iEdwSEQEJDIQBnMMhBhCKFpvZT0zr5HGNOyJDIM6okL3IYJtCbuC5Dgbbxez8DniQ922+AdiCFQ2zS9vmQhU4hZCOrasClTThQsGiOmac6I6dlTpIdZQoHaNZDQEr2UKPUg2Qjgh5/tjA4EZ1MDu5Q8QhwkcMhxOUMuoauxZtOblDeCHXGwkIU4ODiUepkVKFJ4lHIUoQwNIjVC2A5anRKNvxQmOU2KRdCFsSX0IeGnVchRhCoyFyULnOrVtDT21QcJqEbnkHYtSWVbuBPd1u5jZyVTlr7bIh1McXCGFUIfIQUQxYEVpCCqE2kPp7op3dA08aoGQ7KT18XGWNeRedND7iHQ/RkssRNTsEVxDUAA3EIo+scBUYCf+8eW5nu1tPoHPPdu1fp2aE3EKXzhTVEWh2+B0SBVO2NwSe3TfO4hcZAyUF1mdisPb0esJdCsH+BjJjDQ1e4u/SIjYQixixLqJdLuq2/MR6rRBjuutLgwvBHBcNQ4MwO3zjSAHiAi4FO4DxhzmMOqEc+mqWFzeiAYh7IBkLKsAYoYLIxV+DmiFPVBwayhcJVD6SHl5jbQ+lGyCYUharL0RHnPA5IoGtDs+63OxOdh85ZmMPkF3cEnr2joW0XagIU6t1+6ayyGRHo3N8eT49jnaLXVuuuhdPa686DUEFzhgMAObCP6Ci4ZobqOFFMIJeAI9ASEsq4SfASKuqsXM/y4MFD4HqwI5buGHSyBbmD+aHUoP0NmxLR5eOhNjDbqNQloT3AJJ+aSth6FDEGuIZLQnD+ZjtDGq1kw4Bi4bKxqtjsPDavDW8Nr+7B/Bq9124DLD13ziUXPmyMLV495nP3eamOBRkAUoRJkGAYiG4IyAZkg1YBL6FF31ccl50C+hV9DGQC5EG24HwQRkAArA3LalcH1QIyADVQayZEoRaHELQKfQtIgbDpC0BX0JAYbfQvLofsQwGGFoGfoXwQQtA79DiiB9d0LQD/QzIIU6A0pYqNz3oRkNI+hudD/HZ9d0o7vePIDB+IEHITj9y4cLE7PF2lJdLYGQFCIYaKXDP+osIzx5I12NHpLZUXBfEIGnJNORRwbd/PIa7Kt96GkoKidoM5QD6/nBSGEZIRYYaU5CJBSsIunrVDzIHmqrHNBgeDyR51YPcwQTglwBwCCWwagu26ugBfEuuKAtGChpyzbWMkPCOhbzVuGHYMPBRN6BfBhSdDKGEp0P7Dji7aaWCdDKi4zBlQjCQEE8eW0Dhi7N/3UVsjXOJ29jDBS4poL1Vmww2RBe49yXYF0MGastdXVBJdCIF74Y1GenlNQ5CVU1e4yvIXmQglNcqak8YeUROTQJRIFNTZC2yFB8FJdGHwflNKvBZk05kKWTXeQnFNEqa3k0kpq+TTOiP5NdKajk1MpotxhCmkvGf9AuKE0mFhMPyYa/GSqaxTCEmGFTSSYfVNc5E2KFHkI1MOeQrFNYqaD8ZSprsogKYRVNFKaGU0VP4ooQxQm0wv+MhUFqUR3uV30LuHZqe8E9eEyII3gXgLEZ3oztCB4Cu0MFiAmEJ2hn0g1mFcciXUCTdHVCjpcTw43hxUTBy7R7msaJi0KJojPwah3MfebO8r8EDTw2PjPvM+uc+97wb8zEfZjizImqs09Ou5NoXTIAvEQ3C/gAMIAtBE09COecJ4DtI4b7MkFq8iAAfW6ZyBYACAsNbbORvDTAlmAM4h7i2A+kfTNugYQAyQCwsO1PCO3bT0jKBurCQ2BvAPKYBFhDYAF6AVWB0JHeuaaqrgBkcxbJD2AJiw6/c2LCQWH+AAG4FQLX0wW/QhdCYDCyINWAHrg7F8quACyCmQfqgJLC14Qk4gzcBt/GmAel63HwaMhXYxUUONwGUWV9wshYGFXSsO4HeOkiwgdJTpWDPXv5fPpELxt6VQ2eQ+gG0QRU+UVg5WHGZAi1vPwWVhfwhYPDGZE4Nh0QbbQ28gf65XwGAcGcgECWVrCGxKmsLuxnFfVVhRjRBNqtjy/yPp5LnAhWIbwCDjxPFtbEZlUbrDXDjpWFBktroJLCzC8ljhdEEjYVfcfbgmAwxJ6SPTNgI41fmOSbCXmCEWBLoGkLGsEOhJa0BdxHm8HxgJVsiZsDd6BnFpYcO3eFhL/QhdADwEKIOVsVFhKmR8rbOsKG9pSwkthYUR6WGK6AdpERoID6sCCuWE8sKmQcyQDqEWJ9yiD5EAhYev4WthoxstrANsN6KE2wjYQLbDyxhtsIHgAOwodhbdAnWFpCxdYSooMSAk7CyhRlsIrGJ3CM5AAshGzbUZD3YQnfA9hrgAj772sPqOFVweo4ILx6jjVgHqOD1weo42ZwbYhQEmtiF/XClh0AByiD1HDPXscsRM21GQv2H+AErYWcgcogP7CQMhTUHssMBwr7qoHDXADlEHA4QnPRNhi/QYOEQcLg4QnPawYnvRrYj1HHKINYMdIg5cQdbpbXyw4ZRfKjICd88OEQcPyvg8qK+Ii7Cajb1sMaDv4AJKAZlAgWEg8lHboygOuAKbCXhjMkCO4PUcGAYR3BSxaoCAvIqgIfK+qAhgPqoCEA4YkQANhLwwoOE1tyO4LdrRIgR7C8iCMcNqosxwiLW9RxOuA6ayE4bVRKDhuRAEOHVgGk4dAAasAsnD/AAKmzOQNWAJThmnCoOHVgEkesRw4dhjpomBYrsMU0ExAddhvu5N2HtMReNjWwjNALxsvAB3Y1lAGpYG8AhEAbOEcMGnYQiwxlAXRBjliScP76PawgjhTRBG+hIcOCGNtof9KenCcOFkDBi4dAADrgR3B8iBnIBEIFxw/wAOcRkuHicN24GcgOSQZyB04hcaA44f4AQogkXDCuEFcMprNpwkfqMbCRH4hcPdYfZYawYlGR/2FEcMc4UuwsdhFHDrRhecJLGHZwkzI9L0rsYkbyyFpetdc41HC4WHAsNbYWkAGZEPXB1bBVEia4WRw5dhaNCjJwXBwUSMvRXu4Vilcsxj7QKzNKw11a7eAyuBGrSSUB95bbh0ABvuB7cLpqExvL7qwcQDd5MsyJqh3fDTmwoQthZc0N05tdwof6vNClcZ41UzgQhA9beAR8G+7snwu4dT/ImqLeMY57bNwNsiMQOTEqtBQJACv2/LmZBenmT28bUCjr1VQY9CfWhLtlXH6lz006HIXT0OCocILpUF0vBFsrIeEF4EhYyayzbXtfzSQuTzVBC7Y8MkQrjwxgutF1e6pkqDh4dIGMkAPdUYeH5kCp4XXVR0OiPCnfA62AZ4fLQj7w/rR2gz0wlCKLXVGDmLc9cwFVQIAAQWAyiBi8DtYISwINgqvAmkB68DZYGVAKZAdvAxWBC0D2QGifynAStAmcBa0CpP6p/3+4U2fTcmNLtYL6971Xwf3vRC+7U8zmHW80uYW+vZY+aF9YjZ9TygCrgjXymWE82PZbH11JmwLBAWoIDFXadgCwFspwV3hpF9TIxpU2UCvWNRBYp5gP7QnT2enjKuPtE7088ky7ZzeTtjQjHOuNCxO5K9zJoZ73CLKXu0x3YE0PJoazHMohTHxhfIZlzpnrV5BmezTo2VQ+CG0sHLNW9OXVgzjDxAAuME86Cwwtd9CLT9J0NnrXNH3cTzod+L74BpsPPzK9E95wQ1gC5yXSln+D50gqAp9gCC3mADeQEIOFUdrni2ZkHMNg9YzWn3VbYCheUpZm0QnvYHRDydqjd3I3Exw6MS5AtKBYHX1AyLQLegWh3BQG6kvSmEOqgJBgS8R4AAl0Bn0HZAeisGvcy47eEOIosqLTeYwQh1DjeAD42mZAHIW7vDGCDbvTkdgILbJBILBlDbv8LFhsh4R7hH595GFAIKSBj7w6925TtlBbaC2LXlLXfauYAjdowQCJO3vzw5kAsW8iP7C8Ppgdk0BEBVtCsyALLxiIBErGGCc0hhoHlHywAVSAiaBuADnn4bwN2/syAySMqvClYGLQPj/hQAxP+LDV1eHKQNA4BA0MAo2AioH4d0PaQXcgnjBBaCGsGACMFrgWTBbwSgtn+FGPRoGoIIuAWwgiAUGARg0FkTDLQWu0Z3q5DD1TsvggycBQC9+HAQNFwEYug82CBqCYEbAax73uvXFqeMpMt67G8LQXubw5neMRs1YjW8PZ3vcwzneBC9fBbz7xRdvmHU8EX5Qkn5U8DsER8wBwRV1AbDY/g1jujRreFsICdN2GFuwePlhvKBORNMk0iAO2gGBbfH3MtfCI9zrekCEXRuTVcOZJCqoqEEwJFlTU3ILgidqBuCJ5ACSfGQ+8XA12aPWGHgKnDFBuXAj4MF+Hwxga4ArwRwc9shGQCKryIdXN1BfPCWBorf01Xs/YdWu1dcVJB1wAw0G45EGSvDC+CDJAG+rioQL6u2RA2hFpYUKIJ3CSLoWRAOiDJsxrPtyPDp6hhAMqhC2SpsijXS1ExeQ2iDDq1yIOXLAQgzDNO8FpEBm4H0I1oRg3A0sK4MJK4HC3JPBVRdpHD1y3JZrKARYRqwiu8GpEC2ERF0K4R/1cPIRtcHSIPkQGumzABUa6niA7sAu9W8CIDd136d0NvXt3vanecF8DeEIX2eprmhDqeb1Mup7XMPfDijIDC+uC8sO6QCxGnrhfIheYGhb6YwaEYIJBoVIgqCRZ4DP73cSiiIwUoqIB0RGYiOS+A4DCyMvvCx8TpgElkLvBX8AhIjdgh+A0WCJjpVdqVVCN0pTawV1inwjeO95CpO5q6wm0ucRFis9hCEk7OZ3+nvHwhHOl/DwzKPkO1zt9nY6OJed9c4M9x9Cl3rKn2sFlELY3fHvQIRPJuA7sw4+r+SHcEYX1Gky7LET4CFCEJAHMZGQgHIBibZZgF1EViQfUR2YBd8SGaydoMqI2Yy7+Iv0TqiIl4P/hLURzQVsLZwz1wtkkMKfoe4sfYjC6A5osP2ckRhcgqREbAHrRLSIguiJWsntby30V7JNbcXuqncISGlG3YoU+nN50P601Toep0L1ApnIo2GhDKNp0bWDOHiJe3mbewhuDCoCQMKL0UlI41A95Qqz3wzu2AUsRnx81pI5iN9MPmI/wAhYieoBXT0SUnx7ZJSAnsExGo5STEakHJ3sqYiqvbpiJq9pmIvTCV3d6NbRiO6oXcbSEcjgJD+HH8LrMKfwgjC5/DKE7CiLmBNfwnTyuDBlKCYG1gofbtS8h0fDNu6x8IFESaQqVOhNC3CHE0Ny8qTQoUR7IjbSFK+3tIRCbR0hVRCF1KU+xdEV+NF2aUl4lREaTxtEWqI/1oDojXMS09VIwsaI9xApoj9wAGiLm1DD3b8Reoi/xHmiIRelaI58RqoimLJxAHtET+gR0Rn4jdtawz3vEQA6LPgHoiW4hC6FwClIQ4LE2JhT6AUiN0IAGIrEREwRgxEzMWE5NXwiTOyUA/RGUiOxMoGImkRlJAC6K0dwokXhIqiRBEjc/hESI2Si/UQAA7CAxABgJHEAQAAfCDf1DiAIAALhBr6iAAB4QAQY4es+jaR6xZEZKncmeb5CcPiciPgyhrrXpKMM85RGn23hnolSJ8RfTFIJF2iLfEbBIj8RcppWQBASN/Ed7MQ0RfqdDJEUOGMkRaIxUR4EjNJHYLFfERqImdyekjj7a6MWp9s+lHo4qEivREYSIlIbUCBiRiJEmJFBiNokaNVCfSW5k6XTyiJp9u2mDSRKojbJFQSJgkZqI+CReY4DJEY4B/EeZI/8RRojEpHASIskWBIgQQ1oitJFbgBikQ5Ip0RovU7xHWm0HRMVwdyR6EifRHeYR8kVNHakRhEiApEhJDOpKRI11Iss8BeC4SN8kTVIliRdUiJPZVSPwkf5Ik4IhusOJFcSN4kfxIoSRokiPMjiSMRtpJI6bqbnc2RGuEJmSotraFK1M9lJFFSMxDmEQ7T4EUiXxHRSJ0kbFI/SROoikpFmiJMkYBItKRRkiUpGWiKykRBIqKR2kj7JFwSNRnohI4qRFVVnxieiPKkZhI2FK5EicJH+iL8kTRIvqR8/sHtouMVkzimdZMRXYjvSHTkKxNipnaDajG059r8ewTYulQ0k2YeA6qEPiNJSomIuTOAMjxJzdiPUIWlbEDazkccLCIyP+kZ2IlGRQMjmqEzkNq9qH2aKkYfpcRH1KAJEdRIqD+l3DSCBE8C8kKgkW7hgpBaZFa5HrLtwzdBu3VcOXLTDUFcoy5LlyWKshXI8yMNsJY5AZ+PisfGZq4IAERtvEkRIAjHrBMyKDJh+zfNeXNhpZHQjx+4eyg2p2bSIBeFbP2qgcgI81+dUC7xB21SogJCMXeAJrhV/IcgGoLuQwoOBTn0jLqMMIYgfbYMUMKHM7n5sf0lgb2AyaBIQDygH1vyHAXt/CgRdAjZIH5QXkgTH/I+Bs4CNeEZkHH8EtZPWR7bRDZGSEEKhHEoAa6RwiLoKngQ5LmUGG2RMZ8ww4cCKDwX3faYa7Lk+ZHUSzxXiLI1dBdfcQkYSyIpgvLI7kAdMjFZGkEFgALnXBWRsAjlZExH07ga7I01+PcDtZHUgCDkVAXfWRokB6z4RyIQavo3fYAtsjMAFjQJXgbNzYgR/YCJIGbwLl4XNAhXhu8DqBEqwIPgWrArt+GsC74RNyJDkQbItuRxsjEPZ5vUMIO07RORPwjk5FaCNXrnrw3QR8F9Wp40eyQvq+vTqevpdIRFYL3H3mALQtucIjp97WCPPrjjwKCmApAlDjI9HcQIn9SimcwBH5GQaGfkR4I06GWEZRd4NgCPCMkLOuA9XBoMi4n0QFEBAIBRpYtNzItYShCA/I6Q4X8ixEb3YPQGogo3u+W7MvyD1cHCQe+g1UOUSD8cGh4NNQceEZrB359f5G7AQNweTg/v6E4g9cEkKJ1wZgQbkAUzcnsGXAXuwWbgn7BAkhLcGFy1fJr+7KrgjjV6uClgzAaNrw352weDuBHdIPwUb03fJ2RCjj8iOt0NwcITaEA4ijycFG4L7vnhg+ZuvKD1W4L0OWbnshJMg0wBN2jUcGSACnkG2YIZAuMZXl2OpnuAOpmOT8bihoEG0UckAI8IIe8QcG9Py0bvngtuWnGDjwFJLw6fp+QSthjL9AkH6YKiKLQg6JBJcENcEeQyIUdagu7B5OCMOS74AoUQEoqhRQSjaFG4YJNwTrgxhRrOCJVAsKILRsIDCxRLijuFEtNwcUfsvBXB0nB0FHMryOETaHVXBOcj0W5E4MxboEzIhR2MDKFHXYOoUctTMLBoyDQlHlKLIUdTgiQR7fpacHNoMUUXFg5nBbaDEsG/gRYUWZTCxRECiUlH6oO2wR0g+WmRQiTUH8t0KUS8gkRRgkRmh7SKKoUVWgqRRVzcqcH1oKrkZ83ZTgdOCwUEtKP9bvFglnBHSirHagtw5wVC3Wr421MLFFKCJyUeDGdc+6gjxj7cYL6wS4ojBR7iiSKjYKNFkbgo0ZRzFM85Eii21weUo8JRsyikQg1KJuwRZUepRbfcmlHRYMYUQlg+4af2CGm4JKKY8Eko3E+fSipGE2DxkYbhgiBRNyi7oFZL2iIIAg07Bmr0iFFU/y+UbXUKnBdSjbsHYqNIUTQo91ufWColHXYNewReRRhRAqCvsE0KNiUc/YLpRb8iIVEcKN6UWco+xRZCDasGFCPqwYIoi1BauMiFE+YJdbnshB1o7yjxYbn5GmUYKo8rGNQjS4TLKO3fjygrfGTODqAZat2Dbt9gmlRD6Dw24Qt05wRs3Q5RHCjjlGYKJSaCMvZlRvCi80GoKOuUdko7VRxwjPFE4KJE3mio3xRgkRWsFYqIFUT8o3dmQqi2sH4qLCUb8oolRMtDSWi04OlUUhjWVRlKiFVHUqO2UXEo0FR4LdwVHsKNbHlCovVRzmCt5GU720EQCI/Xhj68Dw5G8NBETvXYwRsGt967nyNuYd+vF4Wv69T66ltx53uLdHhEwtQeOiB3RlWgWo2YARai4y6kXyEDKLvEQghPBviJUsz/ypBQz/aPx111o/CSNujEI+4+1+8TZ6N8NjvipYGVhgXU8Hb4zxPEbNI9CKXkjZO5DqP3EWeIwP2mfD7hBy+XJYXnwlHMz6dT9BEgAcxO+uPxA3M8KcyzgFWSLN5EWevetqfK0GmO5OiYVZInmQ8TCs+XoMIWbcjQcwAuDDnqKq0Dz5a9RR08BBDSGCi2IHwwReJmA6+FqsXyGF2o+Qsdt1S1F9QGAerOEH9R5aiKy4DACfaKQQYtR6UQQNGCkGLUX/w+xuAAjkqi+KMb9tCAb0+F6RZSQ9tBzuqU7RDRs+Awli3gW1BindNfO4qiK/JIaKw0dlAbxu4pBkNHLAwrHttQV8oT7Q07Iv2EJ4Fe3CM+Vc98GhGnwwqKcg5c+hCC7lHjSDHEEE3YHG9fkasHl4JgvjoIlfB8ajDeEgiImmsmok+RgAtc26+JkvwZmojCeDzDb5HPMJ9arQMTrg8hxlNHfnTIJn0GP+RaminoCqcIK4cpoq0QxHh0NigKJYXh5CHTR6Gw2iAGaM36JZo3EWhu8RABqaLERsu0CcQWuRmJFOaNkoIsAD8GST8BgCOaJZkdb4fBuP9MDLK6IN8UZAfNhujmi3wyUyLjAd8oELR+GgwtEuaJnoSR4bxubDc/G715GHZn2ZHSW2ABQm6euFCbo5oqiMsoB2IBUoiurm7XKC+/ssKR7TDQysh7PfJRecDCFEnFzIbhQ3UgA/QAYtFEiMi0bVo+rRzmjGtENKN0avFon3exTcCkEBN1S0d8LdLR0qhMtHSqAV8B94foA+Wi4m5d/yK0Xwo1ORbs8g5ZeKImfsUogrGAxQotEb1Fa0c/vaEAK2jC+btSJTAZEoy4CXjcutGJaLZAMlowJu/WiMtFr1FCbq2AMkAy7R0tF5aNibuNXSNRWcFLlEzAOmGvlZbORx2CHl7cqJxKC43WrRnbBflFraKpkRton7R1xIGtH87zb7vtox4mMNRDtH+N3/QCdo7vyZ2jjCgXaKYgNufa4kuWjwRh3aLArpNop7RM2j8G4xKwC0fNo4hueciLyjfaLseoVCEHRAOiatEk6OoAGToiLR7WiK/Lg6MFxpDo3xuR2jetFEyCCbjSQEJu0qhH66hN3qAIVCcbR92jMdFsqO0XtMNMKy5Wj3tFJ10J0SnXZbRQOiTRLU6INpiIANhudD8ttHhaJ20cSovbRnWiIdFbNCh0cdovrRcOjBtHnaOG0YRAZHRJok+dEY6PYZlNog1RX9NsG5jy3ulhVosPBJxNNNESjyl0R7dIQASujYtFNaOd0X9o7bRcWjmSAJaKZ0dDolLRrOjTtF66IR0cNosSALujUdEm6MK0Vjo3bB2DdmvB46PNUeIfcWRseReVFsN16gLXUf7RNOjz8ip6MUoLLo73RvuiPbpJaJZ0TUANLR8OjFh7SqG1RDTwnPRuy8HtGVFHN0Ttgy3R+Dc49Gi6MeQeLoz7Rs48gQFO0xz0RnouXR64I09G56O5PtHPG4C97d55GpEF30N1GFIWa9g9Ga+hwDoQIEVrRsldWohWM11kSKAHYCKQsnbChhxr0T0NP8eMaj716AiOE0cCI73GhgjkL4pqL3rj1PKERl6h+p7rHysEXeTRER5gN7NGsgzv0ZWok4+kG9JrC550HMBiI5XR52NsyHlyFyINrIcQoAGxclCDmE+elrpdH6JwRBzA9cDmgJoAOaA7bcPnTy6205CNne5UP+jO2BMFEHMI+BIkAXxgne71bk2AGdsbtuSlxR8AhkGx+pP1d/RLmjP9GAGPD7tXZRPO6eYZZiUAFm5BgY3gC3fD+XRAGK40MGIhN2U3VCuTwGKbtP6fef4J8pSDF9QGK0GQnUh0QucPnR4GOEkFFyPESr+iLerbaJIMVXMIAxzRt+XSUM26po8wa2IzBiq5jgGMgMdAY/l0sBi2DEG90gSJbHP8StBikDzyGOXqONQPjKRBjEU7xZy/0c6IGQx618zr7J3V82G/o9V2UjRzsbEUPTzLfTR4At3QFHKDmDI1voowcwW49I6JKGNokSwY97WITF2DHoWiL5rd0fQxoccQjGOURd7nQWS82FJQ5ABzQFIAHNAMU2CTh3DGpGMHMJ5iDRI21AI9jS9AizIIYlI8OhjRDGTWEkRDfXAqAg5gvTBTQEMTvcqBkaIgx0ORkImy4XNAbHwspIH6BxKHSzt8nU0hdPdqXxWA0WCMJyTQxYnYcDGyjEoAIMEF6Os2dMu4HCUYKFAY1Soz4o8RKmGNGMeYYwAx3L0e1HT0G7gKl0AdOTdp53pdhDmMfcqNog4nk4zZMGNokac1SgAINh+4A7GJoMtI7VRo2UAYND08HCthsYvKoQuBwS6bAHLIAkY6R22YAKJ74GNwACAYnoxVcw+jGRmSiMfy6U4xcZsDe63gSuMbkY34xERiCly3GPmAPcYvwg/8xQTHoWjlIlrMcEx2a5T4BVzGEMQQYkwxkhicE4WGOFtAMYhmYqRAgyCiqAi7gFRU3u2a4huBoGIURv/otYx6FpCiA1AFUAIdQenoxWgKTEwbF2MfiQfYxoBjvjGsGO/Mu73a0hifDudj4mL78pNHGOYSJijtwAmPxIOUY8kx+xC/jEjLjhMR86GkxdJiVIASmPooaxbSi+mJiVk7YmKwYBtiU/UyhJKTEcp2DxAu9OSWKSYzqScgDr8HsY/wx7JjFAQ/GJ2tFKY+rcG2Jwu59wFhMdgY4UxON5OQBnGKdMQFROQWDShry4Lu1s0WAAB/RsDdQtHd6MfKEaAdAa3miUFEN6LZkeQ1QhuYujc5HcqLZPmAAFbRTmivdHu6IrHtFo7vReeiDtF+6O10YHo3XRRYMQ9Ejl3w0Dlo27RBWiN9HEOTr0YMo8MxQsjDahRmJb0TGY+3R9p8KdGIeBa0UmYtcECuimzHK6PTMRro7rRheiYdE66LlqKXo+Kuw2ikdF1aNFROjoqPRgujntGzaOrMQhgyrRsT81EKBE020f3olsxFDdrtGLmLB0erohnRmujMzFF6JL0cHosvRCvMsB7XaIj0aOYksxabNo9EVmP5kRk0KcxxQjFX6lCN/Pk7oymqwOi0zHJmNJxJ7o9sx0R96dG6U3taFro7cxQejczF7mPqRMjoiyoR5jizEC6PlwZjg7BuuOjm9HTmLt0cUowWuxOi98Ck6KfMUuYynRq5iq5EfmP9/ngzTcxBejmdE9mNZ0cE3bgA3Oj4G7c6N50ceY0CxjijTwHC6Lm0QnomJBeciNbqgIPjMdLo13RbWis9GMWNQsfhoqFQ6FiRoGYWK7MThYgPRxejfzFDaL2doboxXRkeiTzGxSDLMZwIoXRVuiqLEPKLe4b4ojW6mKj5dEUNxd0YuYlixHuimLGg6LQseuYz8xjOjsLH+6Nh0X2Y3cxA5i9nZh6KAsUWYibRZuizzF6V1j0TJY23RJQif5Ea3RT0cpYrvRzZi1LGd6PT0c2YtcxPuiMzF6WKzMfxYnMxgliK9F96Or0WRY9JR4FjG9G2WOjMYwPWix7ejxaEuWLfMZUIvvRSFi4BEsDRjniPosfRJrhVCi+oL9oanZfSQc+izC6oiLIZkvolfRF9g8gDr6NCscEw4Dusai95FAiIPkQh3Q/Rx8jwRGnyNQnrCzWTR1+DsO6PMNzUbhPPgAfpjzqAP6M8EeRfZ/RMUVhu7kzXh7jLrDbapS0ttoDnWgoV0QynahG0/9rIyIAOtEQ6r2GMiy76AlXAOlSVbGK719PMISezjEa2IgXkV2NhzCm3jcWvwdTS+6PEClztxARrimJKk0pEdYtBXWMfVKRHSzI+FDsDy8iOJ7o4QvGhoSdU+G8mPHSsVQ+pO46i0+HXZwz4XuyNTRsMBxDGKAlmMTbnNUxgBjf9HIGKvRAAY6Qx3L02TFfGMUBKoYqAxFBibTGcmLBMdDYpAxbpjBCKoGKPZLOAB0xDOxcTHZzDRMUUY3TRsMAIbFwOyhsdIYsgx/fk885IHioMTQYrIxCxjwHpI2KpMTAYzGxVpjcbH6/k4MUMQbgxtNjeDGMWWtMWvuFEx1jEpZAiGJOEPpo0GxbKd1DHp5ipsTKY/l0qXd6txWGO0oehaQwx2UBy+KfGI5sfy6VGxctiMbFBGNwoiTY1+IZNihTHlGPvpsYYhIAuRAjNHg3w+gArYqQxigJVbGS3yj2isY4JY9hjZXY8gCcMYOYVwxaBA5gAeGKrmF4Y3xYtvUm7S+GMS7iBkZQxFpiubGmURFsUgeMIxjhiKvQ82JofCSZT2xrvceLbxGMSMckY7u2qRi/bHpGKrmJkY9n42RjuZiK2PTzGLYr3qoyR0TEmaNC0A2AEox0DdjbFJpAqMSeILYxTdoajFqUnpkPUYm8AbRBGjFKqFyUMbItox3JiE+ElEPuZN0YtYxZ1JLTHR2IB8sMYqoxehjxjGoAEmMbkoaYxhmiVCAWaMpsaqY+YxCNjwHpLGMHQK7YuwxVcxITFN2PQtDsYk0xrJizTGLBEOMccYz0a7iA4zbLj0uMfRoa4x0jtITEyfGS+P3AR4xCJiXjHUADeMSIY7WxgRjHTG69EvsWKY1ExLr0UojU2LYMYnY74UD9joTHfoCJsYoCV+xoDjw3il2Lt6hLYiuxjgArNEr2I/0ViY4fh4NiCTGEQKJMYIREkxR24yTGMmLv0DqYgOxtJj6TESmLOxsyYo+xihjKL4R2NHsVHYulO/dj/rHfWJmxPyYwkxyti19yNAFgcYnMUUxMdjdlwEOL5JPRQqBxZ1I5TFkOMIcUqYkbAW3BKBYNgHtseg4jkx5gAl3q8OIKXPTIXUxbER9THNszH4SyY6hx4diAjEcmMNsbNRRRx2a5bTFG9y4cZvMLAxxNiTHFKXBdMYCYkfhwZBPTEiV29MXbdP0xO7sAzHauygmqGYwTeActsG4i6PHlghXQYuS1cpWYcQEC0XnIm++DFiPbqhaIcXgmYjsx7PCZnb4dCMrmIXHi6CtC0eFxNFmqJy0BnhG5ieLH6WN7MQNov8xxljstFMQGAsaBXQCIqc8zrq6uTxkJs1M2MkoF6568jSfVtnvZOqVNkua5p1Q9qlU4sxeNTiK/B1OODqi39cYul9VoQyzNSWAGi/L+ex/8YVGnmPHMdjoiMxMEgR5azV28Zl14BXwQTjuVHON3vMaFosLekTj3zHq6OiccwXH9orTRen5s8IScRQXJJxsTiU6ZpOJ0sVhYnrRuFj/LGGWJycVlogsx+TiqwAm6KKcY1vEpxcYYynF+XT8cUhXJpxTB9qnGa2FqcbMIjpxodU3nFyTVacYLZNwAQdVU6qFQGEVgM43Vyal0FLr9OM/smjgiyBEliU5Ex6Pwbtbo1rwkuhT0jYAD78FzHCpxszj7dFTP0B0RPDerRETjmtEq6PdUfK3byxjPCmC4j1WCKB/keJxhodpnaK0P2cf1XSeqRziMnF+WJ3MRc4wcxo2iRzFXVzucTow0HBCTREhp9NSTcsufIY+FTQAXHtOJBcTHVd5xLTj8ahtOO+cRK4sFx3TjyoyQuMZjNC4x1yAeDSzFWWKdntJYkeWP4AMXFndCxcfjoj7ROLiVX54uMbMROIJZxRLionE7OJicRs4jCu1LjO6qo8KtoQy4oG6hziMLH6M2Ocd2YvixbLjBLEjaOHMbc44pxwV1HnE7828lsK4kD2HpQxXFyuIacaC4v5xlQ8I3FAuJTqlG4rpxpQ0enHUwhVcVYo2go7KtZcEJt3hcXCoqSxEViJnGIVzgrkM/QJxhrjW9HGuMQ/gs4sgAu+BCXFhOKrcVa42lxGdUOWgRgW2cQ24suq9LjbXEZIldcVxY91xLLifzEBWP10fuYq7RVbiCnHE1B5cVc7HT+/UIu3JPON8Yf0fbuuGSEJhF0nzjccC4xNxlTipXGdwSHcF84+Nx9TjOnEKuOTcUq43pxemCulbJ0KzcejgkhyIzjEXFjOKb0T44hauJ58pnHqsyYgNi44pRC4J6LELmItcbW4jIRKziyXFrOMpcSHUZtxNLjuC7gXSdcR24g5xTLi3XFfmK3Mac471xA7jLtGHmJucejosdxRbkHnGyRmncU0XF5xcFcY3HhuM+cbK4rdxPzixbKruP+cTK4wFxy7id3F2MOiVoq4nKMyrjWYyquMzcbC43ZuObiJx7uK2wbghIK8xIyi4P6zmOFbvBYl8xY9CGzFcePrcQB4ilxTbitXItuP48Yk4oDxJ1R4mj+uS7cWhzcDxvli+3HnOMEsVx4/1x9zjA3HIeODcah4s0+6HjzlGvn3o8ZSvXzRYziLYwseJ7PsE4meo8FiedHUADcbpTovjxhtkBPHStFg9sJ46zxoniO7p2lB54Q64nyxJzivXH4WMIsTfXYixm9l4PEx0zQ8XNXIZx4ljNXFkSyY8f5oqCx15i2PGlCIXBDaopSxE8MOO7ceLi8Q+Yk0SVnj8eG2eMoPv+4hzxuzixPG2lF/ca54KTxE68ZPHueIMsdk4n1xwliEvFKeN5cdYorw+pTi1PGJNQC8XO4yMMC7j6IFLuITcSR4rTxbT8z3FgWM8cfg3QxwhnieBHiyIBAfBYl3RFninaYWVFS8YbQwTxWzjMvFL8ym8bQXArxnYCivGeuJK8f2Y0Ju83Rw9GmBmU8cvVcay2c8C966uRy5s7YPzxW3jw95TuLq8RkhSZxFtd0GH/DWaRH5CfsMBNdjGEeKNucs14tgurXjt3G/OPncc049dxWHiiPFtePe8SyoiCuOninFHnS1t8CPLbBu4XjuvDUWIDnsZ4iMB95i+9E1uPcsRN46Z26zjx0H2uPkLvno4rxqWj8SChNy4kNg4vuAoTcpbwK+FCbpqYhRx6WiynEw8JKcas4DYow49CPYVWLcPuFY/Tx7s9r3HYNzK0RD42Sxiej0VGoQOPyNno2uob7iEfGfuMdcR3dE5eC3j1fq6WIx8dmY+Tx0HiqICV6IHsqJAW5xt3jVUGqN1o8QIAwHxFFimPGM+Jt0VFYmcx0XierD/nTT0bnXPXxA+i5aFD6NZqulY1vImVjJ9HcIOn0TdEWfRhIj59EpREX0cHI5fRRYBV9Hh0PHcej/Gu6w11FroaN1uUUMLEx+FDDHvG2XRGuoePRXxB7BvrBjmP40brwwTRuN1Zj4D7wZ3khPCTRI+9eXboXwv0Xbw/Be1+i81E48HzprEoI0mW0MT2DEiJeIZBvKU2uRAsiAN9GfUWRvYbhFG9ohEDJzGHHfvWPc6hZ4niKtnDhln4vPxQ+dm/G48y80bn46Km0Gj956PKMEZsMzOnGWvMe0Z0oMIUULQljgnfjhbBt+Jw/oo0AuAsSgLEG7M0MkG34gyQ2gZOHFRt1q+EPAZfxuAAVCAkmAEls4AWJQcch1/KxsH+4RnTfjwEpI+/D5+ErPmhUILx449Jj6mlxp3rAvETRB+ik1FGCIT8RbwpPx6ajD66XyMwvifXMMujvD7wYbOWkdmxvGVa//j+4CABM8EV8wvV2YUwNIZq30riDAMQCAECigJb6oGAANeEAOIO3BUNBCEGziBZo2OIOGxOuCZxDS4X13OIAp4QsOGqRCwyHe9asAMxieuDobCi9sGgaTOCNxGP5UBJoCS8MSthZIA3L4hXw8DtQE/v8LwwUNhYUKCnOwEo8hLwxPpB0C3oCRwE60YVvRZkRCBL4CdaMbgJsMleAmj8Da4OIE2QJrASAA7gMAYCa4ADlhw/UlAkyBJvAGeEFkg8gStAk9cAVEDwElQJmRAVCA9cA64LoEh/gMyILAmuASv1JoE7YYRjRhRKGBOECf3kEFo5gT6hilcCcsI4EiQJjkgK4gDcCkCTYEowJNNEKBCeBMb6Fb0BIWwQTnb6uBMckLifA+mbASAgm4n0zvrEEpwJ3RAkiB+BJDQAEE68INsRIglGNCG4IIExIJXgTqwDmX0iCRQEw6IkQSl+hZEFSCcoEpwJILQBuClBLCCdIEowJeXQPAn1BKcCU5fCoJtgS+zidwBiCRoEowJMTlrwiRBLoFipIfoJzJBAY6RBKt6OkQSIJtXBMqZ5BLOQLVwIIJzQSvAmpYVSIHTxcIJ/gAPL7TBOCvrqwyIJKkg2glGBJUkFpwzuAbRAtgnahCd6FsE4vxkQSRuCfnXOCa45LoJKwSR+qmjFuCSI/e4YDwSHejlEHd5pEEmpyYoZ3glb2G9EA8El4YS/RanJtDBmRKVwFuIHnQmWHJBLvesCE7YJGpI0gmQnFBsfv0LO+iwgDGrWBJhCQDfQch+oxeJ66x2EXtfvdXeRi1Nd7371tPOZ1bAhQO4+1HO2LkvntwzexTaAhhGnhCBIeqYSr6+JAn95UyJ3djO5AcoaeQBgDMhIBlrzQvGI6RADuDHLyWrhQPXZwiw1S3GHQy7+ogAD1BIoTfTERYIIUbOYj7hJAB8SBb4AH+pIox/6coSdgARKNV0St9FSQ/hs5QjshNTyCyrVG+w1J8a6aBHyDH6QcC+dijXfFm1FI8c65YmWte9DG73OXNDvkAxbx6JM3obABJ0PtyAKeCcwAkwY9QB38fHLKsMZ/iQyAX+P6hCKfZlRZoTQOgWhK0GlaE2SMde8XGES2TtCf0o6RhDHji4TchNcURvkLqukZjZt6Iq1iVhr4msxB6NmqZD+OVphKErlGiAAFMFCYN8UX/3BSGyoTMQiSYJh+uWExRmOH9Ewlo/UvQYxIbUJEABdQmnkgNCbe4i2uxoSgwmMtCo6Ai7GveEYSbQmAQRM3vaE9X6v8NVMHkaOGwWZ/fEgLoTSABuhNIAB6E3dmugAyz65Kx9CbIUf0J/LjAwkJn2S3swInsJVXiW7A/NXKjJGEyRWtoTiZaxhNhUfGEhFWzPjIrFZhM0JuKEsUJuENCwmShOEUUcXNqCg5M5Qk3EkuJm+EhUJYhN2LEJgw1CY2E+mQOoT4fA+13NPlGfJveBNcGD4xn2+iCG0YcJVhM5yakw2dCXIvWcJ84Sd/H09GAIL6E/YgSgjt8gbhLXutY4YMJmNQr/Fd0NTAaVoq8J0FimKajM1zCeeEB8JBYT8wlkgGLCXnInYC2MCDJG74HfCZWE2gGn4SawnRHzrCRpDBsJWoSAInNhKAieBEkCJ3c8Bl6zuIedihzKCJTGi8BGFeNHCWYTccJzxNJwkLC0QiVIid0JySNPQlEH1QibgAdCJ1U9RImqh07CZuE/Z+24TTwnub1PAew4DUJvISkK6oqKQwQ1TD5uSGDicHShPObiN9asJtqD6lFsRPcQPKE8tBc7dFlE/hIdRhqE5Em5hNH0ZjhOw0ROEhCJhU8kImqRIXCUuEnGmqIAtIn/cJNCU59cqe3YThFaWjWtCd7448JQ4SjIlqf3p8ZWYqou/XjukFWRLzCUWgopRIiifh6ORLcie+E5yJnyjUgbsRIqiVUotvuXES+KY1k0/MTJE/nGcRMwQYhRNIXmFEzWxEUSNIkxRJxXu2E3SJMRA4oksaK3CZgIgiJIXjGPH4NwysndLVFRQijxp5PhLKXi+Ex3Rcyj+VFNhMm+g84RUJlzcVol8RLWibIo1BRZ6DvW5Oxlq+Azgi36rSimFFigBWbvjAlluwe91VGwt2MFp148aJvdRiImChMh8Wk3IRRvSDiokmeIdblc3VaJeuDHW4/RObxksohRRMqilFHm4MwPis3Xvyq/jg0DThN38WRPAsod0SN34PRIvCZNE26WQHgZonPKO5UTsBWLxfKiLHqrRMqidjEzEIuMTaomAxK+bqsomlu6yj5kGbKPaUanZXZRBrdronRt1uiWwzGDB3XiStGXhOeiWz42nGlqj6IlnQz44H9E7aJOuNeYkshNdQaegy4CkqiyVHHRJ9UZ9gv1Ry4IA1GNCJVUZpvG6JcMTGYmnuMRiRU4RMJ5kSi3H8hO5cLlE6lBaKNRQlIYPFCU1g+aJhCiwlww+LLCW5ElUJcmIPwnmxK/CbWEv8JvESWQkthP1CcBEpVmekScImQRMMiaGEvcJdoSUon17z6VoJA2CJMZNm2DtRMdIJ1E5jyXoSL5YrhPjKGuEoYW2ESSEEGRNGiR4w/1e3sT+wmpRMHCU6GR0ofGjyLEZKNMiTyE5lefISHfA46JIiZF4q+G5ET/CZURNoiUdfWQAnmCionPhJNiSMDJyJdw1WIlmxJn5hWEuTBtOjJ/q+RO4icpgp/ITYTHYnCYjbCTpEyMxrsS44l4RISKJ7EmCQ+4ScoyHhNbDjBdE8JUkSHQkZg0CiUO0eSJwcSwiChxLUiYuE70J9SheonvtzXPvpE0eJWFRE4kTXUnicoiaeJ2qs0onpxKV8WkoyqxVO8d9FxqNp3gmo0TRUlBIjZIEwwXmUTIPGgZcJ96wiMGnthfJ5hN+jdSbMhKOPjKtQBJxJ8NNEsTyz+iMTL5G4xM+ABYQnhAGvgPY+oCTKy61ACJAEAk9KIICT2wjd+JDwRao2aJUoTShGWT3xiUnkFBJkLcdokbRIISegkzfAomJdomzA32iSTE/GB4sSQYlnRN2UZdEq3Baqj6YmKxLaZpnEsKxcGCOVHq4Leieio/gRX0Ston+YmISb9E76JRCSDQYAxO8iV63PZCMSiZYnKqNUUaI3bqAWYBNFHaKM3gLoo29IV1ADFGzwAnEMYo7WUZij4YkuYOZibIwnuhAAjnkH8JMCJgLEtZuLkTlok4xPESZvgLyJwsT3UEHRPzvvQk06JwKiw26qKJYSfsomFu7CTVyacJODXpSggRRvCSuVH26N/OtjAyxJxCT+YliJOESV2DMVRjiT2/SixO9QeSo8mJiTlfVFCoOpiSqoyNuCsTo4muM31UWYLKqxd8SarF76LqsfMfE/B8fimrEoT1w8h/E7BeX8Sf17XyPt4bfgwhe5gNyEnLVHkOC0knzIDgMnAZcI2oJuHDWBJ8CTUElMhLsSa0kqCa7STGgCT5xtPjrE1qmF4R9Yn3hJoibgk06GXSTSom74CwplbE5ZJ4yCq5GJhIIwfBEqcJazd14kRRLWbg3ATAoBiSo1Hvnxg0b34kuJg/iy4k0RPIiUWEyuJHkMnAb1xLciSskpuJSoSnknHoNtiQdwPyJD6MVMGyRKCiSvEnZJkLc9kk7+IOSWg0Y5Jmgj4wkTJNMSbZEwfxHqDh/GxPycBgLDOUJKySaonfIObibhTDyJfyiNkmdxIaicdE2uGS8TWonP2GdCbsk5SJc4TwonApMhbock08QYKSBlEr1y8+rf43fRD8SH/E/8yf8Ufol/xJgj/S6s7w/8QW3L/x2aif/H1E3MBn0k0aA9rgswCcPXkOIKk+EAwqSO7DeALIJgtBdMukCSM8bQJJEAOKkyVJoqSh87MhL3AFKk/wBV511UkipOlSR447uh+xceBE9Nzmie9Eo4usqTOqbRJI1SZw9EhJaH9Nom2JM0AFakshENqScP6JJLoSf+Eh1JuqT/0BSnwsprIkjJJqijmEligCqeljTOUJkAQ1m7YAH9pjkkhVgGUSMcHcJLkYeckmlByGCTibmpLEUZakz1J74ZRElCJMdSf+gVUJJLiJVFAxKdqDqkzVJnABvUk8QxSSQsglRRiwA1FHoAGSAE0I/mw8IAbii4+HLACjYfEgY8Y/aZZpIR2H67SjQZTQgoyHUy/KDWkztJtbBlqgo2BThskAdQMRxR6gCfCIExurXX2mbB9kQA1ADOWHAUHp2/iS6fGxpJMSfGksxJ9ySECCNNQFie2k6xJgzdM0lppMxSVIkj5uziT6cHupPbSSWkiao3qiGEnuJIrSWC3QNJ6d1g0luRNDSZC3cNJAdM9JqpKNZUUYk9lRcaTsEkhJMCZuak8JJqaSi0nOtx3SYekt1RciiaEkrKOlUQWkokAF6Slz44MzLSR9g4AggqDFVFyJNxIDTEh9Jtmwn0m74BfSXPiCNJH6To0kTH3+EYUkoTRjKT99HMpLE0c/4ipJifi3w7v+JhEXUkn+JOaicJ6osxx4Okgy3I8hx2Mk931IvouBcJc6SCx/jT8KG5PWou6qjaj4zqqzXo7gKxSi+dSCCgA2sIHiPJPbTA9G9XVpQhC4ye3fHd2KSDeBYDAHUyeMk//h8aSNt68ZN2AupkpO6ySCskGXQ24yW33dJBmSDT9Q5INQIPUAfJBSWj8EElINsIGUgkNB5IBtoZVIKDKDUg/7hpYNpSjQqI68Ru/ejxN/jLBbXcxmPnTvJ+JqCNj9FSaMHpp/Ez/x38T5NHp+O6sSIAYOmvPNswHXUElUZxk/zEyWTkvikTz2Qp0kxv2wSYt9B1cGrACGgIoAacQVCDVgB5GHP+I9YkQjK/Fkdmr8Yt6bLCUSpfBEV+PkLJRvdtRIyd6xJOB2UyRlkshEWWS0snATTA0KVTTLJb+9GvrdZOl4Dq3UFu6A1Bsk9ZP53pgkoJJpiS+En3JIQ0fukix6m/iMsmI40dbqtk64mkiT4klWvSSyfL0O2mwMTTolKqIwySs3RRJGijGCBaKJUgGokqkgGiTxJBEyG0SdqDemwJijKvgqQGSAIVkzuABMsywEmqNnDCU/Hh+/viFSgLwP+8eTvB6JkKT10ljKM1evkhJGGG2Sksl7pLtSZiETbJieQHEl0KNJaAjk/bJoKCyYmHZI2UW0o6WJfqTK0lnZOUSRdk1RJXxg9FFB2PuyUYop7JeiTXsnvZM+yc4g/d+me8mMHcANzwVzCD+BfmTDElZxJXQZr47putKCbW5q40hySC7GxJ8OSYclRJP5UQjkoWJyOSi7p7ZOo4P3AJJJriSsclyqNQyf6o3HJUwt8cny9EuyToom7Jucg7smGKJ0SRTk0xRVOT9UCb2BpyU1A93x5siGcl/ZLfgVGvFnJQOSLlFb6J3kVH4jeu+gi2p4spMasVEbSLJ1SSL5HcpNiyVfoqAWCWSwABJZOmybKgUB6e4BCrjpZKfaAHk+nguRBg8lv0xlSWvvD5G8qSekldZLDyWNkwPJkeSxMRJP3gGrV9JPJKWSwJpTZOTyTQojuAIeSWvqjZOzyWGYypGwyjC0ELZJCRiGhM4mBeT0uai5L1wbXk9EgMOSqEkUQzWZqnkwq4khN+7qN5LJAKVTd8ugpB297gt17yYekGNuHCS5cHs5NXSYakzlRdkTXAHV5Ioro3knEgMOS8Ynz5NFyUjk3bRpLR28k/gCCIOaQMwut9j+KZsk15IKk4bvJ2+TtgKbbyCblHk1JwveT2q795OJqJgAQfJ/mIXMkj5L8SWPkrhJBqTOm5g5P/Sfk7WfJOI1z8kL5LWyTrjZfJQuTHsFr5Pb9Bvk6XJTCpitArrD0Zofk8/J2590AAn5MoTGfktPJPeT78lX5IwIAPki36w/lh8kMxNHyUzExUuJGSpj53+JCyY/Ex/xVGTWUk0ZNf8XRkzlJDGSs1H1JLT8T7k1jJfAAVCCbFEA0Zxk5gpf6iZUlP6LMoBiwPWeZ+5CWF1ZPfUQegT9RyhYl9QSHQbUTSzJtRKJ0JMl/pxMznbdJgpfZl2CnCvTkKUTIBQpmmTmCk4aI1fqoUvsy6hTtMlnJJE3nb0CHJcZilCmtZCFDgVAekgjNF1Cli0MYKcwUmkOZhSjAAWFLw0TtkivyRhSbCnCyEGYV+Bbix/rQ+zIuFPMKVfoGjRXmSqKY3twNIFrIOYAGNcxLHX+PwKfSk++J9/iKMkGCOdyafgiLJb8S01FUFJT8SGXOgpCIiM/F8AEL9tQY6X6M+AFVofL3OoFkUtomuRTpVo/gwdAiWjPcWZASiN55gEAAOHAgAAI4EAAJHA6KBcCTDgFSFltYd2hfXD+MB1FMaKc0U5IRE0NCik5FO7gHkU+KIO7s2ib7nQLxtL9aVas2Ty8lGpMrybzkkJxGxQ2iaI4wWKdL9HNJkGTLgL9FKQAL6krJ+2wA2iYst12Kf9w9jR9tQcUF2KLySeWYsvJPCT5snoxKTSfM4j8oOxSVil4xOWKa+UVfJaoT2/QbFPRybLkimJ2OSzomPFL2KdL9ejR7r9Vz7HFPiiazkk5Je88sEniH05iXMUwImjxTnW4wlIgyXtE9YpdxSkABixIpUZLE9JJ2xTsilIAF+KViUg4pgRTAMEnFLCKcRkgTR1ViyMnRFJKSREbP/mbKTU1ED03dyRmo2pJNBSmMl8pKaSbqTAWQ0yCC8lUT1ZKX+QTkAnSSC/EfimK+tVYEUAAAABUdAfwAxjT9l1K+kKUkUp44QEhSClOQcVVwATA7GQAWRQhE5KeyUsRGrJTVSlQTXVKa//UvJFQs5snv5PmSUkDJ0CZxNHW5GABrQVXXDNJFj1TSmpn3TuqsUhEppLQVSlNOADjFU9KwgdoA6/DaM2pAKaU2UAh1AQyKL2UtflsUu9JDTd1a7OAHfSW+wV5QswAfMgjwKnvqm4UwgcQBe+asHypSMSUCqEWAB42ZMRMQ8GPXPQABMhKp4FQA7AHbXZ1xoris1ZxjwgaNKUYyJgSTpilT5JriWUvI0pFFcTSlmlJtKXjEmsp1pTbNhHpMcKVCoB0p5CJ1a5RYMbNi6UryQPUBeCCelO9KbWwWhGmX8gVFbKKVyYGUoNJIZSPChhlOWqJGUuzxXDhYymlkBRsAmUseMyZSjighpPTKYsAa4oipAjiG5lOA8eG4gsp8L9iymZRInyW/kv9JcKSZ8lKMIFyYWgK0pTQjhcmWlNrKU2U+Ep1CTLgJtlKdKTa9GXJ3ZS3Sl9lIHsgOU30pw5SkMk4EDRKWhkscp4LcgymTlNj8NOUiMpFB8zILRlJxAAuUlGuy5SkymPADXKc+kjcpmZTtyk5lKnrnmU+xh7DgUiCFlMBKTSkpNu2+iCCkMpLJKY7kw+RDVj4ilUlJP0YjIWkpXKStnpe5JvwZ1YljJ5bde2ZslO1KTKtNspnSTwAmFolExoBDSUp1IBxwhLHH5KelYYUpglTpM7+AFlKUeEBUp4DAPAZ9AQmhlxUofOWpTvkEDAGUqToUnvxf6SDSkKWJlCQ2UpoRFpTMQg3lPNKdtk8XJpcJXynq10/Kb2Uj0pP5TqBJ/lM+IP6UsGJniSsMl9QGDKR0rSCpKshoKma2VgqW4AeCpMRAlynQJETKaOk5CpqZSra6blKzKTuUrCpe5TqnEHlN4PkeUmNJr+ThN4QlPByfck0sJy2SDKkPlMurvWUq5uhlS6ylExOPSWZUqp6nZTVfqulMsqWAAfspNlShyl2VIAqaCDRhJKqiwKmuVK8cDOUjypzbj5ylxlJxAH5U9gwK5SgqnrlLRrqFUjCp8IBdynieJScZMI6KpHLdYqmERJ/SWuks8pPOSk0nUk0ESfeUxspl1c7ylpVIWqRrXJ8preSTQb5VPfKdKo4qp7pTSqnWVJ9KRVU/AgqJSUMlUqJxyR4kytJoFSJyn1VOFqFBUnECc5S2HA+VPjKf5UzqpKZTuqmniAzKVuU7Mp/VSIqmDVN/aIu4kapfmSxql/COJKaRk6PxoWSSCnPxMpKeQU9lJp+j6MkpFKn3g0k5ipv/jfLbTpm0etokz96oQtUamcgCwFo5sTpJ4CShrHa6XRqdYsRvAMQBcQ6BdWEyfKdcQpYmS11qrSObSkWLUVhb740gA2UnvJMBYVzIS1JgDCpp0iUETU1gEJNT5KJ23R+IEVcNGpONSEdhY825qegNbGpLAJ1KnglPV5uKEpqmsgB/Cb3JPwSaKtIYgwthlammIKrkaeEemwPvMUD7cWPn8ZPdLxUUbd5/g8INGgCykAdJEAA2oTq5JG4CjYIbgA8Bu4DaqGQ0Ds7SsADSCkVFoVCviV+k8fJ8VS7LEAM1mSXLUsZm01SAMkCJJmZhCA75QXvC2+6A81q+gTzIVJSAs4ojT/VN4blA47JAkgDal1fBPwK2PQqe/S8UfEEtVWcNcTEcey6Tmz6llIuKfGk3WJA/icwkK1KryWHLXv6VtNhabhwnont6jbd6iXiSACV1LhplpPWupPz0cP7h1PB5jbzHAWnY8haZN1JrqdCjOupsdTnEyR1KN5gnUsUA8jRk6mNwFTqaQvdOpLv8RoJ8VFlALLMD4gt0Mc6nP5JvicRUyIpRSTyMnklOcplDU13JiRTYanJFLWPqn43+JXViGClKpPJkd7IaQ43GSV6b6oAvqcRfcPyZBMeQbeCPiMjbETmmgxsrbrVZJayVX4t9RY7d6akLT31npfvLEJKphhk6ENinPHX47Ys2hZ9UCv1IpCQ1k3pJd9Sr6mqZJBRoKUa+pAwBkGkkXymKQXUzSpRsTYn5P1LLQYKUTrBtdR8Gkt5MlhqS0KBpuRB7KlWO0FKClg6VQZDToPYZYIwqLqohXxmLsiMkg5J0yVg001JZS8eQbH5CKbvg0iRRtqT9cHSt14aTIo4ypwBTS4QMKKqqaPUlhRkbdaGnIIOq8XMvfPBD3iAcnquJLKRzk68JXOTE0mBMx5Btukq5uRDTSEmOt10ad+Elsp+HhJVEUNJBbpkkwHB2SSZGnawLNkQw0hnJBDClGksNPPccyHPUpf6Tp8mnQx5BqUowRpZABYckCNMIad4054puaSK/JkNPeKSOUqmJ/d0qGljYJFAFY0lEBPviHnZ4NThwcw0saJTjTzim/pMSqVcUzRpIP08GneNIWUVUo6tBnZRsmnk4ICaWsUj1Rf2CQmlVVNvSZ0ooNRqqiaGk2xDoaZGg2IojDSEmluNUcad+ko1BZZTgkluNKSBjyDeix+jT/Gm5NKvKfg0oppdpSEkmnpLWUZjkz4p1VTR6mYZKySWwk5IA0TSvsmxNJcqI00kXBZU8QSngpNOSRpUtJp55T3Gl7wEUsb40/Jp+uNHVG2qPwaWtUkhp7fpgmkflKqqWkk4Cp4TSyADUNKiabU02Rp+L95Gme4JFgQkUN2pS6DWmn8KPaaZcU7ZpXTTuQZZNJN5mEoo5pvmCDml2qLFyaI0ivynqi3sFXNKAqYrklw2VTTpGmPNOsaRO44vu8TSVmnGNxaaR7U4xJk+Tgkl/NMcsXvALGJvTTDmkhE1SqWC005p78MnEkkxK9UbpTCWJJ1SpYk1VMcqTM0g5RsLd5mm05Pvnui0+xpAJQPmnA5NtyXSkoLJoRsO6ZzHwpKWCIvep5+DS2Z0lJiyYxkuLJ9BTWKmpiFR+sH5FjyYfkqJ45U0VabX5Ei+P4NuoIlo3VduH3aBA3ABgVRdyBKjqx5PAAf4BlUBw9DGjiewUZUnIBxgCkpHQZra0vtgNIjrgBMGDWQF44E4KcQBg0DwgHdabPADYkklkJanDskAIIr0B5YCjUgxEjiH3AJrYwoQQSjaTAd2CsxPTIDHApVM7mC5NDHbs2MeTJBW0BSy9nXr2qJk746khSgyFmcReqqMtDE6PpjVWk1+RC8g/UpBJzuQ1ok9QAXbhW0mPuBQi2mmYNPZ8R5DLVpksjdJC+eSOAi20mjyOH81WkltOkdspwD0s2tSVa7oZIEkFgQIq4ADlmPKUkGtkDu0RQmHbibz4+SB2fpf5IqWBp9rC4SQmdiSKzO9gvnl1Wl4ABvaCrMOHoz7Q0q7uSFj7L607mpl7Rk+bIgGS+De0UNppVdrgyVVyCUZe0E+AWVc0q6L1Lh6Je0UqmNVdcmjKdElupe0L/IttTL2gzcBOsmlXGZEn7SquA6QjSrkkQBRuzUhrlFpV22CUxCNKuHUI+u5rMMvaIVkz9pb0trbH5EDU6JJXIhBJp844mnFNpSYRjEipURSiClMpNiKaQUl3Jr8TxWlRZJqSVK0hkpMrT0im+5KS/hsADqQPJRKNFmkCpkedQOjpzQBuSjQ9GoADNyNrRmrSIN5mUBaEWhsSKw2AAFGSGQgCIDgwIl6VYwRQD91BoQKZkQkMELCJOmP8Imhmx0hjpnHTuOnP7xGKU38IvGI0ApakuNLSaVpUmeoEm8im7Q9AIaaSUUuGhjSTKkV+Wh6KY05+w0PQGm6AE2YwRT4pJpXzTU5Gg8M0+hDw7FWWZAMVaudKnvu50iXmHI96R4XmJyiW9otRpeCiNGn5OwHAkjDIzpTfwNwQ+Q1ISVF0kaAMXSSIYiNJeKaXCGb6QRBL9CcEGh6B8UpZuv4FoegAEBDIvsDOv6/UZnak2YMncco048pJWjvOmwe186UzzcBqgCC0UaNtK23g63EZI2JBjOm/RJa6aZ020pz5T3UHtEDoFlA3fn20/0I5HmkBLPgsAdTBidSlIAPl1qBvSjI76BFh6eiSFB+kLKgX2mRYBDqZKQHeIC4/ZpwDfBAIhy6Brsfz7WT6ZIBtAy8N3cyXgAa2EF/h/uHlf1xwU507FpE1TcWmXFP06SfRQSIQGT+VFtdL0aVc3Z7p5nTIWlQqBMaRI0wdp50SmWkWNNmaS0I2tQpWDhD5YtJfyTi008paTTOmmOWMmUWWg4zpeMT4unO6NyqUY03gg0PQymnjNIhQaOUipWI0A7OmOE1+xmAjRHBNXjQekBJMxwVV0uRuNXTw/CedPnlqT08Hha8jp5b+dNdnsjE7WJlxSoekGdMl0U6ozrptzdEuksINtUXD0l5uXPScP5pdMcABl0xjpoD0z0nlNMx6W/LJv4+XTxoQ0/SK6bd0ErpXuDBT48tJtyc503bB1PTNbLk9JT8HV0oUJ2YTNXoRdKWiaFNDrpvPTUUmG9LGgK106LpQzTuukJJN66TTwVlu9YTu4lIYyG6XYQX9QugAPvCKMyMZhOEubpk3TafrTdK1AOhgVbpC3TuQBLdNgACt0yQohrgOD6niE26dt0+BuBUA9ukHdIAwLJ9E7pPBAzulMNOQfms0wipubjvmn1tI5iUlUkJG+vTeVGOt2N6WM3J7pFvSkekWdM+6aM0jHJ16S3EkS9IcqRdU6ppkMTtqaA9IJ6SD0y7pYPTrukQ9Jz6R/ko4u+vSsYkI9Odbv30ilpN6NLgKo9Muaej0gNu9LT0SmS9Ox6eC3ezpLv8SYT0FFzqcVooiJ6vSIwKa9JxAJT0jGwq/StXLr9LcAPT04HxarNWfFe1MJwd30zhpjTtYenRdLF+vz0qTB0rdjOlX9Jm+gL0oUGQvSdZAi9JpaW64ulp8qip+m5dKl6UpAGXpN305elzAAV6azA33x5XS4qkr9Np5m502np2KttekvRN4Jvi01nppsTTenmkE66fzEo3pl/SgCkpdIr8g8IvrpdvSx+mO9Ja6SN013prmiWoljdLFABN0pZB+JRfemzdID6bgYIPpCBBQ+lrdOafpH0/VAW3Sdumx9I4qPH0paAifT9vAp9KaaWG/NvpxPSTykJVK76fAM+7poSMeYmvdPQGaS0uHJKAyMBmBNIr6dS0mFp4/TkMmf9JuaQGUrxJjfTYW7N9NVQQv0jOJq9SM2Yg1Lw6ZvUsipT1MIanhZOoqTh5UsIF+DzBF3MMv0UxUhTR/8T7waWv1lANP5fNGmX8XBk4+AcBkmhUkRqPknjAcz26dJdwbmeeOZeZ5yEEJzMCYADcI2AifLG+SegKb5cDckG4dvLQbhGwDT5W3ydPlCDBCaWPUU75VDcjgBiTBKzyp6EFhVWeX3IqegC5h98nz5S50bvlw4ZiI2cGa4MqCaVQzPBk6lNt3pNUhtpefSlskiAGqGWuCNoZFxc+Wm4dI3qaSUgjpMRSncnEdKoqdDU7xMVgzpNE2DLasZYI+wZ8WSz6l6gHcGdP5JSQicdkqisg1qGQT4LwZseS0wC+DKYMCEMgIZvToeZ4czz18r/oA3ygs8EgBRDImdDEM0We8QyKfJW+SegMkM9EwTOY0hnIbg2dArPbIZd3J/fIjYHyGThuQoZI2Bihmaz2pXL9yUXM5QyoQiVDLmGXUMptGIIzVhn1DNPdjd03TJevTID5tDPPyB0M1MOXQybKYCtOmPl/zcip9Vi4inlJLFaaMAUYZaHdxhn0lLk0d7kmjpMwyVhm7gAWGW4Mz4gHgyIRmkXyKQj4MokAvxh/NiLtH6dOcM2zYT0AlIAgbjkIBQEG4Zp6wEgComFUAOyM5nywowchnxlCegMASLgwUiQEgAC5klGc5sP3mooyKhlD5zJGRndGoZ4IzdwA6dJ+aTCMxtpcZj4Rn681BGZ0MiPxBSSjBm9DPRGaYMyjJkNTRWmkdNxGXeoawZ0Ij4alYX2YycjUxkGqoyagADj07gJSM/Ag1Iy1RmP1MGsRsM5dRXxh/NjcoHXUQkASB6Tmx/iKcjO3yTyMwwAPIzHgCncnZGRkM4UZrwz39BMcnFGUmMp6AAuZz1GdokfUXIYIEZioznRnoDSVGeqM7PpUPi1cYngTOJjqMvgAiIy48HIjIsFnlDNEZYRsQWalJMH3tiMy0ZUAUbRnn6KPqakUk+pLFTAN59eGdGecIvgg7oz4q5tDM1abyU1aAdxhnjBMjPm8jEMwEw7JoORnbcgjGXyM/LQ0Yze9bZgBu5AkAEUZ+fgxRn9JAlGZrgaUZmuBGgAEJHlGTmMstpswyqRnwjIGAAWMyEZfNDoRlyWLz6aP48sZrQy9RlIjINGbfEo0ZYNTiClmjPMGcMM0AKeIzep62jI7GQjUtIp3O9fcnODOOuoOM2UAYEzH6k8VLTADtQy4csxsKyEJAEsWlWQgCknC1mCFZ1lWNsf7E6kx4zYG6gTMrDMvTC8Z7gzIJn6pPB6cIM4sZJxNcoJnEyImefkIiZ+oy8CmGDJ6Ge+MwjpAwzzRniaO/GZYM60ZErT6KndvSo6cSM4CZpIzCJl4TMYIAsMjlhbozlhkCTKYutvTLpp+NSYJlUkKQzk9AeCZA1tEJlBLWQmaZiVCZtlCFvwYTJZIYFibCZO7tcJkSTKdkARMqkZREyMGmpNJosSWM/BJVEzoQA0TOfGXRMyPxJJTGJn9DIoqViMxAm42MFpq/jOT8QBM+0ZTJSbBFODPEmbkGVEAFIyxJlGTMEmYqtU6Gf4N5p63gFPJPJMxXET0ADKT+bGNxP5sa3Edt1gRnBTP0mR8vQyZHozjJm1tKz6aZMsiZgTNwpl8cEsmToAEKZtcDI57A1LsmaDUh3JpoyiOksTOoyTiM1sZYwz/xkWCLsGR1YhwZGRTexmpTP8mYsAV0Z4EyiJk/g0IgNFbESIt4B94r5fA7KrFM7dST0A91IY9xDislM3MZnUyqwz5jL8mQtMq8ZoOTbxlq4wGmZRMkqZ8UQrJlbTNWZuVMw0ZDEyqpnH4KbGS5MvumbkyOJn4jKambYM4+pDoz+Um6kz0mV1MzQA/Yzepm7TLIJoRAPjpq0AHcKwFR7KmfeG+KOkyQUYPTOWmWCM+aZQr0TJmNDLMmScTd6Zm0y0pnbTOKmTDMvaZ1YyQjZ1jKFabH4o+RQwz6plVJI8mc1Mm6Z3ky75FIDPN6ZLjYgmpeNWQZO9NM6SXjGL+pF9CIB5ZO/SIQRN2IJi5SN4ANJV3hhvAIR/BSSc5KZImhtgMmngz2NdsbwPWJmSeM0mZheMoJoCzNx6XhA4iZHfTSJlV41EGVTM40paAzCZlOE32xqgMs3pZMyiZl/YyH6ZNTa3pjwiZ8ByzMkskl/EMgQRAxfrHRKd6YQM+XJp1TGEnkDKm6fs0P3pc3SnCC0DIqhIJEQCIIBiCKhkIjbHo6QfbpRIBDumOzNOTC7MsIgkaSUmisH0naa4Ta36/xTvMmfpI40XGEjZp0tScyYVlO/PtLM6spssyPuTyzL+xgKjYWZ2syNsZc43L6cY0m3pWsyE5k6zJjhkEQGAGhsyCBku9Ld6fik0gZXvSKBlyACoGf70+bptszkgD2zM9mSwCb2ZsqA3Zn0aAAwA3M52ZhU9fZnHCP9makTIOZXmS8SmA1NBKcTzVaZ4h8GukhI1jmduk+OZ5MyQyDrZKnmSrMmeZxDTKWkazL66dzMwRGusyH5Zb4yNmS70suZ5syfemWzOoGTXM/sodsyiwAOzL8Bk7M/9ATczuQAtzI9mWfMr2ZncyB5mNPwDmd2UIKMwcyH5m8QyBqYjM5fBDkzt6kLHxI6a5MsjpdFTqClEjKmGbK0nsZM1AOul8ky2JnMTXYmJMyIFk4ky+JtAstYmlMz1hm/13ZmT8jTmZTQAoyDTE1/IIMU+YmYiNSZmQLLxJjAsq86BCz4Fn8k0QWbeQMGZN4zR5n9k3WmZAfUhZ3RNLiQ7E1oAKBkuBZjCylmI/EwhaZgMz7pWcysFmbE1/IBQs/WZ0v1C5lm9ONmdc0+Fpatdd5mUDP3mdXMm2ZR8y65nLdOtmeH01x+UfSZuDVgCUkKyAcfh9QAhRo86MvmfvYTw2uTlnABy6DUWRosqBwwWxKvg6LOwAHosruZpaSl+nTaKGUUWMqvGLPSPGjVaIBRGws6YmFCy2cZSKPcWZsTTxZ6cyPumZzM1mXws7vwAizmFn8DwLmYN0ouZCwAS5m/JOXiZyTcuZFsyZumyLMD6cfMkPpSiz2D4qLJYGcYs9RZfBBNFlXPQsWdzIKxZhU9KfCr0KMWSYs3JZZiziSjaLMKWdYs6lJ4cywSm6dJlqdg01wB9EALEk+LLHcmEs2eZSszIFmeLMXmcP0nrpQSyyFnkhxYID8TSJZoizt5me9KkWZXMmRZ1syUlkKLLSWat05RZG3SslnlLLyWeYs6pZ89i9FklLIcdvfobJZpiytFmWLNqWUrEiyB+0zXxmHTL0EdVM5iZX4yMZkng0PqdjMzsZt0zmSn3gwIWdzIFtJXthl6bnUBeWbkoN5ZC71JJka3UIgJwU1BZ5WIiQ68LO5kDPgLqmz9MQUZfLOa+BCs6V6AwBoVk/LNBmdlM/NBGoyRN6l1PWmXGYhFZ7iBAz6MEFYWd0s15Z2Kz3lm4rLVmTzjXggGCydFksEFhWQgLMMgOlM3XFbzOiWcQMj3p8kSEll7zKSWbMs2uZCBAtumrLMqWQUszZZxSyDFkUBDKWTkstZZVSzDln3zOOWbbA1XpzjTUVk0LPSafk7AFZUOSIFkErKpWRY9ZOZSqzvlmErN+WaiAIwmx6TyVlgrMRWS/wrQg//0RFnDdO3maXMyZZsVdEllWzJoGfIszlZeyyKlkHLJqWfys0pZ9qyRVm8rN0WeKsnApysTkmm6lJlWU0sjhpMczaubNdPxWRqslVZNsT7m7qrJhWTis7VZfSz1ZkSqNBWT5PA1ZqTMiYb0rPKesysqZZVcz2Vm2rJPma6snlZGyyPVmkL22WV4bIVZ+yz8ln5rKKWaQvGxZoczeWkvjPXqaiMwgpJozjplx+NOmRCInbogCy7Rnf+JLbt2MvC+biylZn09DnxKLMlempMz+1mtsD5mf1Mn0ZQKzFUkfNyzmQ6sstZmCzuZC/uxVmP3AdeZ+CyOukjrPUIHzM9KIw6yl1mizKoWZ30pWmZ2D5VkhOO3WQOshWZILTwFl9rJ3WWesuJJGcyyVlZzLJMeFbdeZ27NaVnduNTWTEskgZFqzvenSLLZWTasxbpdqzuVmOrL5WYWsgVZuyyANllrLFWZWsupZZ4SI5mNLKjmeMoo4uhEAbin4zKdplespOZMcte1nIDPXWWnMq+WASy71mazIfWdI7J9ZRqyIAAmrOd6aN081Z6azLVmsrOtWYfMv9ZOaywNnrLIg2a7MkDZJazZ1mMbKdWZBsiVZXGCfVkNDOoWf6szV6iGy2lmXrNPWX9jdrpwmzR1mibOS6fIMwJZfXSCNnLrJjhmMs01Zo3TP1kVzMzWb+sugZ9GzhVl5rKY2WEQItZhizc1mAbILWY6QKtZRPSDBkVTLfGUdMhsZIrTWJk3LLthnDUzyZnazsJ6OjPFuqTMxEgtmwgyiDrM+WR10tzZytE8ACizP6maOM28A0CiOZlZzM/du5sh9IK6yh86ubMcWB5szdZ8KzvNkxbL82XzMvdZEsy4Bn+1PlWaP46LZ4WyJwDXrMGpgls7LZG2MSVl2G1mbqFsxLZzQAiNlQ/VI2YQMj7wFGz4lkZrJmWepsiqEnKywtm+bNwAOvMvTZFARqwAYsCG4Nrk5wALWyZ3J4AHXmSZsgQZK6TPamc5LIidHM2J+uTNFVlKzJ82QNsnLZaGye9FZbNa2dhs4lxxTTl5k08H62bLdIjZESyU1lRLI9urVsgyGLKzv1k0bLkWXRs2AAgEQttmDbJjhh1s1QAXWy5gA9bO0SX1ssrZQ2yoNkqNKEGcf0q+Gd3Tptn85OQ2XNs2LZkmz+GnLbPm2RtjWNZpKyStmazKu2eVshTZe2zxlnKbMo2V+s6ZZP6zaNkabIu2VDs9rZIGz7tmkAEe2QwzdHZMcNhtnp9LjCYFk2sZDaz6xkZt0bGc2siFmzVjMZn2bPuWYBMrsZzmyceDDrPfYLgYXnmS4AxaZebL7WSzsr4wj30HAaEQGgmZOsvN2L6jMQkdqOAaTfvNmmIKz8Nnc7L1mfO9XL6q6yudlYOIBDpb9dAazOzFdls7Ll2StMthpsqypZk6VLXWdLs9XZsjRFZmYbP12Y99LhZ0my8NmybP12WvTdnZ2UBn1kzk3wGXDsogZ7vS70EqbKtWQfMs7ZqOzAIi50zV2bLs5eoeI92Ho9QGcAN7svvyIZBfdnZQBm4LuATQA1YB0tBYAAP8RhEvuZsbdrHAo2DCbrk5bDpCLjpVmOLNBJpNslpZKVSMNlHuxN2Zb9LxZyGzCoRq7NN2f4s7hZMmyaeDB7NZ2dbs3L6+czjVmKbLI2Qds2JZBKSH0H1bOR2R7sprZJ8zq9lfGDD2eSAJTGgeye9mh7Mt+hHsmoAUeyY9mYADj2QTsqdBy59k9kgbLT2Zn0lFZmezUKYBrKm2bNU7xZCuyQ9kG7J7aGJs43ZpezC9lg7OK2dOsqXZauza9nL1Eb2cbM13Z1Gz3dlzLM5WUPsygAfez/dldRKD2frsvvZo+zx9m9QFj2SD4F+ZR/iU9kUBAX2dGou3J9kzLNnk7Os2XVMlsZNOy7lnXTIeWbjMxTRPi5SZkZgE3gATIHqAGygShac7OQGYgc5JEKBy8ZDWyD52dJMwXZ4cMMFkdEG6gFgc/uAIyh5dkYHJIOcgck6mbsgD3bIbMwOdQc1A5hYzcpmSzPS2Qhs/BJCByqDnMeVQOXisyg5SBzuDk4HJnmUVsi2mRByuDkh+RGUHbsqrZxczGVku7IR2apshrZKOyu9kXbOIOfwcnqAIyhr5nKoGT2Y3LFQ5pByRlCOAB0OdQckZQzlodZbrkzCACYQAeAMhBXMQCECQ2MkAYEMZhyVVpFgDJADWNJw5e8AXDmOHIcObhNMw58AA1CA3omAIF+sMkgyQAabIAHJg2X6suDZAmzA6n0HLEOTQc62QRey89m82CiOTwc8vZ5uyIdl9dIMOcx5U+CghyjjHEbKkOeRslvZO8yqNknbJv2Rysk+ZaRy1DmZHI0OdcURxqsoBSjnYAD0OTUcow5ZhznvohAHMOZYc0gA1hzy+Z2HOaOR4ctw5c6BnDl9HI8OXvALw5Phy2xD+HPEkIEcsWywRyGlmhHKrxt9s8upG+y+DmkHJ4Obvs7EgDByBDlWyAXmVJs9bZ8azNZk1HIyOescjeZDuylNlprLq2QUcpHZp2zb9klHKiOeoczgZWhzqjlXHMyOfoc+45+xzjDlNHJaOY6I9o5DzNOjkxgQcOT0c345/RyBjmlgBMIMMcskIoxzqfBBHMJKacsutZJOzSKl9DJ/mWUkltZ1OzbllJow9yQxU6VpvEycL7tTIvWcgMiyG13Rp4LyHFc2X9DXE5pUQyCbDQwima0HF429Mymsm0cP4Ka1k1mZnecp1kYLNxkDvDengs4SZEQUHOL8oScklJbJyhZnebM5Of1Gbk5Ysy62ksHLS2Yeso4upJyeYm8nOZOatDLk5wBBeDkcnKlOUScskIZuytjlYDNC2X9DPcu/Jzw4Q0rPt2bpTN9ZMhy1MFX7MKOcks4o5F2z25kXzOKWZwMxhmt8zG5merNAvnPsuNm7cNX5lFlOrWd+3DPpEKStdnq82cWcNDMRRkpywiCKnJkRLEcrE58py/TkynJjBjhsivZFuzNtnqnP9OVqc3bZm8z9tnO7INOXIct3Zxpzs1mmnOtOR3MwtZlpyzTmcACOWQRUtqpT8zHTn9zOdOTFUoeZ+dThTkr7M1esNDSeZs2y+TnTwS6Wdicus5bYguunrVJFiWqcqU5Gpzp4IX7ImWcmc6/ZqZzztmnzMtKJmc12Z2ZyMznmnM42fmcx+ZvcyA0ZOnMnOe/MqNRxOz3cb7yIxGRTstGZzYz/5mod3bWQ5s3lJXazGdn0HOpkM2zQAJQ6yOundj0POcbvH8GGEBBplpgFpmeOEHiewuzAGmi7IPdOLshSe0CdgVkhbM1macUF5udPByESPfSk6QectuCeiz2Tm82H/Of+gI858WylZmnnLIRIAElLZn2yKIlVnN0RggckC5nABVF5G7JWOUhclC5cgyVTk8LJ2OUhchkJ9PBtTk5HKd2YdswjB7ezzjkmnMHOVNUYc5umzRzlDnPHOcZsh+Z9pygYY/7MT2cxosOZ1uSsFFunJCOcvs1yGXpzCnbBrIwOehcwqegZzELkxjNAuUJcpI5WFzK9kzINwuXIvevZJGzuzm5HI/Wb2co05WayBzk5nK2WTRcyi5dFyfZkMXMLOcxc3eJrFyjimjVLLOao00iJ3tTV9muAMvOUJsgS5olzkLlCXOWOcBc2y5qi9D9kiHKzmR0QGS5hU8FLnHHKO2aRcoo5aZyKLnnzNzORac92ZbcyxzlBXInOXacvS5CeyDLmsaMv8YPM8FJi5yrBaNrKs2TvUi0ZG5y21lYzOgOfTsx5ZPkyfWqkzKGIJwAMOAWqTjzlKzIKuUVc15uF5yPpmDhAP4ffESk5n9SRSzf1OJzvSc5IWtMz7rGS7L66T/owq5eqTYG75XKacOVclXZHXSyrl6pJgueNsxSmogyjrIyzNKuX1cp1JqFyc15dXOzScIcm+WGCzOrnlXMkOV5c99ZTKyTjmI7LU2Yoc4PpgEQhrn/oFjZp1DKpBwgtPCCUpOn2SjYaPZn+zJ9nf7JYuawfPRZWwsu5nSlDMbqYAUNpcwBciBVdEeuRGoyq6H8ypVkpNPBmWEcjyGE1y45lTXPmue+GNVZoNzyrk6rOR6SkcmngK1y24LZHK8uYmcuSJW1z5Dkd7IuORdsg65nAAjrn9QxOuQILM65oKTrfqXXIn2VPso/xD1zfEmHC0afv6fN65PfhPrkU3IJKT9cky5H2zRrl9+Lu6cDcms5yAysbkNnLGBtNc7NJLlylrlZzPhuf+gJG5hpyzjl+XIHOVjcnG51Mg8blfhFUAOdcntJV1yXWmk3LuuW1U8m5T1yk9nU3Nu6B9c4MgX1z9InznISuREU+tZMJzkrmgHNSuTZsiA5SJyGMYTDJamfCIviZcrSgzl74Bj6bOIc9G6BzgWBO3Jyfg4DGEYpIiQijidOkXu+cnAZTtygLmstw9uTycpWZwdz6bDMHIBuawc0U5ZS8vbmdUw66eHch8os1zE7kktJdSVnMtgZzQBZPpCLLymOtc/U5KNyfLmnHJ2uZ3s+ZZDAyllnMDNYGU7cuPpIVyuBlBlCT6VSkrjZ18TRtkkTNguXLUoG5x6MJTlh3PdufTYYS5Cdyu7kPlAkucM07Y5fXSM7m2vURubDso45G1zZDmo3JTOapcoPpgkRS7kZLOWWRXc0ox3EsOBnV3KO6bgAOu50+zJjnDzI9OcBjNm5wTMO7nIDJTudzcx25K9ycn4tnLOaUPcmngI9zZPoi3OUuWLc/s5qOyF7nrdPLudH0le5VdzW5k13OO6TwMhu57tTIF6G3OhOfh0k25wrSzbngHPSuZAc5E5krTPclonJAWSSM+25pMzWW74nN7uSvcz25KCzBwhLoFl0NWAIsuJfss5lIPKi2Sg82uxA1zO7moPM12boU7XZbBzY7n0LMIecKHZO5TtzlTmD3NVOZrM2+5st1ZRk53PHuU3sye5SZzqYm+XOXubXYz+5h3Tk9kZ3Nk+kq3Su5QZQPjnT7JbyJX6T2h9NkMIBkgA2mXagqlAQ/lWxCXnMp8J4AeoAYkB0ABFIVwAJ4AdAAVEAIABSPPgABYc945NhygoxSPO6Of8c3o5rhyATlFgEMecCcmREoJzxjlMWXpAO9ssbZIXTFKZenNcWQ7c1luPdySHm12Ohubes2G5g8Anbmj3LjOYcczh5edy/kk8PMLufvMvh5u3S17lf3MOKK2PMR5eABRHkf3PEeaY86365jykJZIS1kefI83eAijzKvhgkAgAKo8+oA6jzNHnaPN0efo8wx5xjyrDmZPIDRtk8lVafxzrHktPIBOXY87AAvhz7WpSgyceYTDOkArjzm7ks3K+2c0s06GUBdrLlu3JXuafcnx5/NzpJYYLJYeXgAe+509zr9lxPPYGU00S05QjyUnk5QGEeRk89vmWTzpBY5PPdQugAOR5Cjyq4RFPJUeXMYMp5GjytHliQB0eXo8gx59SIjHmtHIkeWY8vZ5TTzLHnNPLaefc8+x5fhzunngnL6eTf3RK5wWSQHmozMoqeucs6ZACzMrnW3Jxmbucu6ZzyyOulrgHweTKtUmZ8LzA7kknMBWbeAD0gdt0MFkIvJ6uXC87F54FzkBnIvNIeYKcnKZUdyRTlVnMxWbi8+h5s1zCXn+PMWuTM89O5ITys7lsPMIuVw8/O5JFyYnno3JNOS/cpgZ/8tlnmr3NWeevc7gZp3S/7mfNKu6UKc0l52EMvTn1mLiOTS84UOENyCXk+PIHuVb06+5wTyV7mhPIb2Rw86rZkTy4lkF3O2uQoc4u59Az0lmv3N5ee/c/h5CTzDulCvOT6SK8mtZYrySXl8bP3ucM8pIGPCkxnmFoFleSu0By5bryKEmbHMYedhc4e5jLygygLPN1eWjcsi5aZzuXkR9JNeVs8gV5iTzLXn13K9WScsz+Zu8jjRlk7NAeb/M9GZFty3/FQHMheTAc6F5TyyfWqAgxMmv3AWQM8hx83nrxkLed6BT25PozQ9qXylPIfDsW4yQyUKal9nRX2h+tOlmi/CjtzmxF0JGSAQAA8iCmYCLQI1IxhQW1DBdAI1w7ed28+6Rw7zXjY10D7ebYYEzAjIAx3mc1PeISeQ+faUUlaaElvNS6GW8/yE+CyebDFxkL5uW8oWZm7zIULbvPXeWQ8zZpXfSuuDRiSAYQdwKs5x6y93kFvI3BDu8tcE5Sit3m3vMPeWs/cUA6wAfwiUgGpALSAB4gyP1vQIBTxDskcIjSEvE0+2DPlDgaJIggp6VTRUClc8PPgXMvDKJ4oAiSnmbPOWcucy5ZTkzBhmgvNbWSsfNCeWbzsrmwHMcGT61GEIfSZ4ojVBH1QOCsoLM/EQRnm8lLMoGa09lOV6J7jHIkAFGdqSG6eBDpN/gEcjR6NLvetAULDFJ6WgChYaByBHEB5lDNak62+MWRPdGxKCVaHa9bhVTAkqRj5Vq4Dp4rrDL8YzMmk5jVzG+GcfPgANx8ivqk1IUyDiSCQtlRmOh24nyd9SSfOCzIQ6Fj5K6wzkAaqC24DrdWjO7HysRZmUH6gBb3KnOVvdNPkX5ls3LTUxpSlNY9PmC9H2ngZ80LMbHyuPmhu0xFj6Y/D5pHyxEbshAI+egNIL5AXyrxlIxLGceD4zMJZlyovHkfLOJqF8++CmIQJSCEtxbKI/PbVZyXzoj5lBH60YxIWFuP/1nHYHcBDmYZcuJp88Se7rcyBYbklo+QaGoTCvmxXOGiexc+6JPGyJoljONe0fHo9mJeUz8nbLWUi6al8gj5OJAEGZSYK6+aR8nr5J6DAnnQhGI+dl8uUIuXz+CD5fNCfhA0CZeQ69/Ym2tDK+XLUApBvA0qvljrxn2QPCUzZedSsomBdOt0Y+49r5l5SMQjn4G6+b180ZB/XzEvmd6Jw/mUEL0wefkDmLYSzlqDl8tSoHzcpvmlg2IkCV8kYMMwBeoBqj20lgXLfEgpHyZ6kCqxG2Vt8nrx+nig4RH9MGebwIs6GlfpSlFnfIF6EnkYSQKXyjvkDfI5IEN83DZ1IAsvnd+Qe+Q6jEUAoMczBqrfK0aGz9biGH7ciYaLfN3wBV87H5nQTnvnlFAJ+eUUIn5dizSPYIfKNucA85N5wLznJlU7MqSZbwzN5hIz2rG23IxOb7kpyQdLBcJT2qAF+SSc6CZuhQTWEZWG9YIUIbYA6LCCCAIUn1UEQoTAKUVhZxA4cVI3lfaaAALEE29iUwhUUNvgfwAGvy4gBa/MU0PvgXX5TAJ9fmOEWxDB2AYNAMMBoeh3ME7ALCRMiCgGwDiGbOzDNtiZGYe6MIhdnl+OpOW+o2k5P9S/jx2i1rMIpkgtSEapluFJsIksrfEYIaPVgpfns6IHsqjZdWgQLAHYDDwAdgAfVRwG+UAN7KH2QdgJ4NHGy6fySoCFIBNEqgYZeo8ZDZMmkzVFRGZQAmsFdBlWEgGDVhOwvFKkjUBIiGsB2Wsb2Ip38+9AEwxZUztmIA5cdurgFei7sLz24elYBK6DNTfWGkRwdNENhHhAsmT6rkm3XB8s+c/kshfDJ3mwSTCmHiw3qwb6iq+EwNJDOFV5WmeNXlxfL58Kh5EmwykgsPVVKgKS21YW9fW50IuztU6Yb1ZmYv86wx+XsB4hz/PL4X1YeQsZ/ytb5W32X+aLzVf58vk6vKMz0HPM1c6LYcxxyNAjiFJSOUNbACNrCy/lkvUAblJSLwAWbD5KksbyF+agQEk+2/hhfl2zxgBVAC8L5rMjsoks+Oi+cXEiH5Q0MZQmziDpYLbPHOEfEsEAXtxN+XnUIs6IzP0z26dVGPBBx3PggBgAB4m9l2QaDs4oHeVfd7PG5lD+3vwXfWh1o9Qig8OGaRMYQVOJZ1QLulHxIr3vqfZpEZQB9qgDOzmAFB8/LxM3j2GgSWTEBVoNRgFk3jmeFgQWR4XjwlWyxtl5AXWXUUBWTw7LxgvjLBrqAs1DkRdf95dMsXPFo+Op4VxjaQF2iCGC6ah1dsqqgvRwsgLtwJ22S3VhKXHQFabBafFA/JZifg3bxxqALWPEKMKdebns6868ktvF6YDVwBX4C96wKVjla7EAqAJqQCrWodwEKAUGADtZl4QFdpnsJaAWtuP3sPQC0oeNgLmCjMAv+cfrZNgFwkZZIxcAsPHsX4XgFsk0nmjNfzjDEICjQFGLBTAUToLSBQ04KQFqgKtLqGApR4dTwm1x46CY2jVAoVoVoCg2M5gLyC6DOzqBYsAroFDodCLqiAt6BUVghoFSgKbbKDrysBazXCQFPBd9AU6q36BQbQ2wFiPDTlbmq3mBVYQZwFOvCDpmM/OMGbCclc5YBzFj7nMJx5ph5dD5HPyoHlcTMSCOrEG25N8jphn23Ko+Wd0JoAxN1WQa3Au1Gg8C0i+S1lwlxi/OCmN6wzZovbytDibNHaYjVchXQxmAAQVLoFwJDO84EFZ6Ai0DFfTtpg2RWCAwoBw0D1oAzQGWjaEFsIK8QB0gDXiO606GokILwQUnoGxBaCC1q5EIKa6BQgupADCCuEFHGREQWpoGJBXBAVEF6IKPgXpWC+BZiCid5vwLoaj/AqzQFZpM9AWBDC0BEgrAACSC1EFZIKuQU8grRBTXQeIA3wLCQXYgpzQJCCpEFxIKUQXwgstAOSC+NAUoK4QVrxCb8bLY54FQ00HNEqgpWKEuEDvx1sha2CwApGue482L5Trz8ElPAs1BRP4jUFsAKJkFDTW58G9s/55gDylzm1WN2BWA8sgptmzKCmnAqAWdz8q4FoCye1mr02esJBoI85VPBUfq+gu9kKAEsgGwcNaxovDDiAGXEMfgTcRIwV5xFZvvtwCMFVGQ6HossJRPvywyMWzylSAkFxDf4BkEFDQyGgKAnVxHF3odfFlhvpg9xZDcBm4CSLGgYvpgUyEXXkW4ckyUPcHvzJJ5GzxP+T7820W9fifpGvdSJCW7mOIAIJ5f3S+fOABZpwurgXnRs4Cm5EDBW3da6wR5yd3Zq1IBlulEKcFgkt9QUxfKGeYN9TXmJdTaFmmo2DhvRYtWpqtStak4f01qfP8OfxJjNDJAG1LVqcbUzkAMMSOolxs3DSW2PO2p2kTw0Hc4PNrt1XdOw+3ABZA9lDyrqYQfbgD8CRQDWNGlDonRLFwY/A6XDPgp/BXL/Z3+nct7ajO/2e8ZJNC6B+gyXAWpgOMIO+C4Kok2Dfa73sCfBS+CthwcEKMx5PDzLBYSA1RBS1dMx5v8HViXNXdleQTgQIWDPzpAKTYHiASaEEYFAfwzgXjBFGBqa8YLETM2Dhns00GQQjc18C51xYhaNAGBBGz81ZFGvxl4d3AwsBltCAoS+wTFaEJE/q6Nr9+omRmMfBbBkFCFb4KyWq3gnfBVnYJCF5YKFIUigDf4KJCLbgl7R1IVpV3PYYtCcCF+ZBF36CPw7/uI/HuR9siJeH9yOlgc7IgcBZEDW94CwgofjCXEcBnsjUd64XRTcAWUsf0gQBc1aAPyPYAWrX2RPz8jv40COWgQ5CtXhvIDcd70HxEhRJCBCFbZdJIUAQtfBTiANCFz7B5IWXtF/dkpChKFqkLlOiaQpnlss4LSF21lJXECtH0hfr/DIghkLTf4qfyghcv0uweX5A/wV5xKQriErSxo5ULsIVIV0IhRjYYiFA0TR/DKogohWnA2CBSMCaIVZwNRgQTohnGwcNeVHMQsryGvgUVerIR2IXRUxCBarIhAReYCNZGwgP4hagIigooEYuYIhQrMaAwrPP+iELPwVOvzdIK1wUSER98dIWfeO5HrlC3BCxv8xH6FQtLfuDvAgR40DJeFiQIshUPI3zmXo9SACJqzWHgrAygRivCJ/TOQrwqa5C9yFpD9PIW3WQUgT5CveBk4DfoUzyKUgSfAoSFg8Sgulyy3ChUqzdOwz4Li/6bQrH4NtCrKF+HicCgHQoTCAVC98QO9yMlHGEEYmhVCotxmY8vwX4Qu8ZvVCqN+arMyIXLWU8AJRCq8MdgC1t5NDN6hTWNLGJA0KTGajQCyVuuCUaFnEL4BEwP3VkULwmaFIvCAeFoCOO5otC/I+WES9VaQwtXaYmQGGFDYC4YXSh2U6CBLXaFa7j9oUsHxxADqBBVC6MLjIXdgIdkUQI8yFdIDeIWR/wjPrZCh4CHsi26G0wLdIK9Cu9gLkLrAyfQtdft9CuWWgMLW95kAL8hZyA56FfsiGBEgwoPPqFC+S6YkKwYU42GhhRtC5N+8MLpYWIwow8byNFGFFqJN8EnQoxhZjgxqFVZjonBuAGqiKhXLGFBMLLvFVQuxhb4/D2FZsZoYXwwsAhdJwP8F6EKcQB4QpxhXNXKqFyGgE4XsyKqhcQ4WqFuMKnh7i72LhamEqqFcEKoqgiwt4ZpFC6SFMULZIWPDxiheWC6uFIRQZ/B7fLjDsHDAZBV5BZSQnU2FqK1Ze+Wz4RB4UayGHhSiEHYo1QiYblgAEBIIDRX8gAtSupByLwOyQO01Oyv8xBRYGSNmAOSQFeFWxBclZgIzcyZyQePBo8C1oVfgubhWVCk6y1bhkIWZwpnlq3C2OJkcLwYUjRJvcWDCzLwrB8qp6xOOvPv6PHU+Xc89T7NfyfPvhU+N5f1y7+5YwpqhcmE+8FNcK8YWgIpsgU2XImFD8KMrJ4gFJhVAXSlycHM64UpwtWhRFCxMg18LooW3wvrcJ34OBFHjgEEXKoiQRSEreOF9cLU4WE13WhTfC3BFlXh8EWSs0QRTKzWVmSYToEWVQpoReG0UCFGNhCEU20IYRSgitJeYCLcV4lwtYRcJC5aF+IB6EXIItghWXCvhF4kKu4VphNoRRwi0RFJCKToGdwv80YIisGF8CLSYX0IQA/gLQ3mGo8MsYnp3Xsat1Aab6tmx9EWt9yrkbxzVWg9NiQiB9QG7Gq5zH7pZiLSSAutMNAlYi+TMTlTi9Ge2F8KW4ij6u9NgsaaPACC2Dzonp5bwjtGaiQvSwWnCzBFUkKb4WxQrFhefCyUBksLlIVnwoShfFChiaf4KQOlJIpwRWp0FGwtKhXYXLQtYPms3RxB/niNPEDH18qYfYJdJlliE3n25IuWUsw/KFocKAuBNrLXOS2smIAQAA=',
    'R2L_DEFAULT_LANG_ISO3': '',
    'R2L_AI_ENDPOINT': 'https://webgate.ec.testa.eu/ref2link-api/openai',
    'R2L_FINLEX_ENDPOINT': 'https://webgate.ec.testa.eu/ref2link-api/sparql',
    //'https://ldf.fi/finlex/sparql',
    'R2L_PUBLICATIONS_ENDPOINT': 'https://webgate.ec.testa.eu/ref2link-api/sparql',
    //'http://publications.europa.eu/webapi/rdf/sparql',
    'R2L_CONTENT_ENDPOINT': 'https://webgate.ec.testa.eu/ref2link-api/eurlex',
    'R2L_CURIA_ENDPOINT': 'https://webgate.ec.testa.eu/ref2link-api/curia',
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

/***/ 292:
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
  return (0,request/* getRequestPromise */.p2)((0,manager/* getEndpoint */.yP)(manager/* LD_TYPE_CELEX */.wD), "POST", {
    query: query,
    format: format,
    origin: '*'
  }, null, request/* HOOK_LINKED_DATA_REQ */.ms).then(function (response) {
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
  // find the reference word eg. 70/2008(/EC)?
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
  return (0,request/* getRequestPromise */.p2)((0,manager/* getEndpoint */.yP)(manager/* LD_TYPE_CELEX */.wD), "POST", {
    query: query,
    format: format,
    origin: '*'
  }, null, request/* HOOK_LINKED_DATA_REQ */.ms).then(function (response) {
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
;// ./src/lib/utils/matcher.js
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var FuzzyTextMatcher = /*#__PURE__*/function () {
  function FuzzyTextMatcher() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    _classCallCheck(this, FuzzyTextMatcher);
    // Minimum word length to consider (filters out prepositions/articles)
    this.minWordLength = options.minWordLength || 4;

    // Common stop words in English and French
    this.stopWords = new Set([]);
  }

  // Normalize text: lowercase, remove punctuation, split into words
  _createClass(FuzzyTextMatcher, [{
    key: "normalizeText",
    value: function normalizeText(text) {
      return text.toLowerCase().replace(/[^\w\s-]/g, ' ') // Remove punctuation except hyphens
      .replace(/\s+/g, ' ').trim();
    }

    // Extract meaningful words from text
  }, {
    key: "extractWords",
    value: function extractWords(text) {
      var _this = this;
      var normalized = this.normalizeText(text);
      var words = normalized.split(' ');
      return words.filter(function (word) {
        return word.length >= _this.minWordLength && !_this.stopWords.has(word);
      });
    }

    // Calculate similarity score between query and target text
  }, {
    key: "calculateScore",
    value: function calculateScore(queryWords, targetWords) {
      if (queryWords.length === 0) return 0;
      var targetWordSet = new Set(targetWords);
      var matches = 0;
      var partialMatches = 0;
      var _iterator = _createForOfIteratorHelper(queryWords),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var qWord = _step.value;
          // Exact match
          if (targetWordSet.has(qWord)) {
            matches++;
          } else {
            // Partial match (substring matching for compound words)
            var _iterator2 = _createForOfIteratorHelper(targetWords),
              _step2;
            try {
              for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                var tWord = _step2.value;
                if (tWord.includes(qWord) || qWord.includes(tWord)) {
                  partialMatches += 0.5;
                  break;
                }
              }
            } catch (err) {
              _iterator2.e(err);
            } finally {
              _iterator2.f();
            }
          }
        }

        // Score: percentage of query words matched + partial matches bonus
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      var score = (matches + partialMatches) / queryWords.length;
      return score;
    }

    // Find best match from array of texts
  }, {
    key: "findBestMatch",
    value: function findBestMatch(query, candidates) {
      var _this2 = this;
      var queryWords = this.extractWords(query);
      var results = candidates.map(function (candidate, index) {
        var candidateWords = _this2.extractWords(candidate);
        var score = _this2.calculateScore(queryWords, candidateWords);
        return {
          text: candidate,
          index: index,
          score: score,
          matchedWords: queryWords.filter(function (qw) {
            return candidateWords.some(function (cw) {
              return cw === qw || cw.includes(qw) || qw.includes(cw);
            });
          })
        };
      });

      // Sort by score (highest first)
      results.sort(function (a, b) {
        return b.score - a.score;
      });
      return results;
    }

    // Find best match and return only the top result
  }, {
    key: "findOne",
    value: function findOne(query, candidates) {
      var results = this.findBestMatch(query, candidates);
      return results[0] || null;
    }

    // Find all matches above a threshold
  }, {
    key: "findMatches",
    value: function findMatches(query, candidates) {
      var threshold = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.3;
      var results = this.findBestMatch(query, candidates);
      return results.filter(function (r) {
        return r.score >= threshold;
      });
    }
  }]);
  return FuzzyTextMatcher;
}();
var fuzzyTextMatcher = new FuzzyTextMatcher();
;// ./src/lib/transformers/placeholders/rules/eurlex/external_dec.js






var AUTHOR_UNKNOWN = "[UNKNOWN]";
var MATCH_SCORE_THRESHOLD = 0.9;

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
      year: String(attributes["data-ref-year"]),
      author: String(attributes["data-ref-author"] || '')
    };
  });
  if (attributesList.length === 0) {
    return Promise.resolve(matches);
  }

  // get source language
  var lang = R2L.getConstant('R2L_DEFAULT_LANG_ISO3');
  var query = external_dec_getQuery(attributesList, lang);
  var format = 'application/json';
  return (0,request/* getRequestPromise */.p2)((0,manager/* getEndpoint */.yP)(manager/* LD_TYPE_CELEX */.wD), "POST", {
    query: query,
    format: format,
    origin: '*'
  }, null, request/* HOOK_LINKED_DATA_REQ */.ms).then(function (response) {
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

        // remove placeholder values from CELEX id
        var rawCelexId = String(celexId).replace(new RegExp('{{\\s?[A-Z:]{1,50}\\s?}}', 'gi'), '');

        // eg. if a CELEX id has both the year and the number unknown we only keep the sector:
        // 2{{ year }}D {{ number }} -> 2
        if (rawCelexId.length === 2) {
          rawCelexId = rawCelexId.slice(0, 1);
        }

        //nothing to parse
        if (celexId === rawCelexId) {
          return;
        }
        var inputText = matches[R2L.symbols.getInputText]();
        var match = offset.context || offset.match;
        var contextRight = String(inputText).slice(offset.position + offset.context.length, offset.position + offset.context.length + 100);
        // stop at any HTML tag
        contextRight = contextRight.split(/[<\n\t\v]/)[0];
        attributes['context-right'] = offset.contextRight = contextRight;

        // check if celexId is unique among the bindings
        var currentBindings = bindings.filter(function (binding) {
          if (attributes['data-ref-author'] && attributes['data-ref-author'] !== AUTHOR_UNKNOWN) {
            return binding.id.value.replace("celex:", '').indexOf(rawCelexId) === 0 && binding.author.value === attributes['data-ref-author'];
          } else {
            return binding.id.value.replace("celex:", '').indexOf(rawCelexId) === 0;
          }
        });
        var optimalBinding = external_dec_findOptimalBinding(match, currentBindings, attributes);
        //try to resolve duplicate using matched reference

        // clean unknown author
        Object.keys(offset.views).forEach(function (key) {
          offset.views[key] = String(offset.views[key]).replaceAll(" data-ref-author=\"" + AUTHOR_UNKNOWN + "\"", '');
        });
        offset.alternatives.forEach(function (alternative) {
          alternative.view = alternative.view.replaceAll(" data-ref-author=\"" + AUTHOR_UNKNOWN + "\"", '');
        });
        offset.rule.ld.forEach(function (placeholder) {
          // make sure to properly replace the decisions without author

          if (placeholder.indexOf(":DEC:NUMBER:CELEX") !== -1) {
            // use the subnumber from the optimal CELEX id
            var replacementCelex = optimalBinding ? optimalBinding.id.value.slice(6).slice(6) : '';
            if (replacementCelex) {
              offset = (0,utils/* replace */.HC)(offset, placeholder, replacementCelex);
            }
          }
          if (placeholder.indexOf(":DEC:YEAR:CELEX") !== -1) {
            // use the subnumber from the optimal CELEX id
            var _replacementCelex = optimalBinding ? optimalBinding.id.value.slice(6).slice(1, 5) : '';
            if (_replacementCelex) {
              offset = (0,utils/* replace */.HC)(offset, placeholder, _replacementCelex);
            }
          }
          if (placeholder.indexOf(":DEC:TYPE:CELEX") !== -1) {
            var _replacementCelex2 = optimalBinding ? optimalBinding.id.value.slice(6).slice(5, 6) : '';
            if (_replacementCelex2) {
              offset = (0,utils/* replace */.HC)(offset, placeholder, _replacementCelex2);
            }
          }
          if (placeholder.indexOf(":DEC:NUMBER:ELI") !== -1) {
            // use the subnumber from the optimal ELI URL
            var eliParts = optimalBinding ? (optimalBinding.eli.value || "").split("/eli/") : [];
            if (eliParts.length > 1) {
              var arr = eliParts[1].match(/^[a-z_]+\/\d+\/(.+)$/i);
              var replacementEli = arr && arr[1] ? arr[1] : "";
              if (replacementEli) {
                offset = (0,utils/* replace */.HC)(offset, placeholder, replacementEli);
              }
            }
          }
          if (placeholder.indexOf(":DEC:YEAR:ELI") !== -1) {
            // use the year from the optimal ELI URL
            var _eliParts = optimalBinding ? (optimalBinding.eli.value || "").split("/eli/") : [];
            if (_eliParts.length > 1) {
              var _arr = _eliParts[1].match(/^[a-z_]+\/(\d+)\/(.+)$/i);
              var _replacementEli = _arr && _arr[1] ? _arr[1] : "";
              if (_replacementEli) {
                offset = (0,utils/* replace */.HC)(offset, placeholder, _replacementEli);
              }
            }
          }
        });
      });
    });

    /** 
     * smooth over offsets that could not be resolved
     * it can happen that some references are present multiple times in the input text - one with context, one without
     * Example input:
     *   - Decision No 1/2025 of the EU-Türkiye Customs Cooperation Committee of 24 April 2025 on the use of A.TR movement certificates issued electronically [2025/1239]
     *   - lorem ipsum
     *   - Decision No 1/2025
     * 
     * In this example, the second 'Decision No 1/2025' ref will not have identified any optimal binding because there is no context. 
     * Below we copy the views/alternatives from the previous offset (ref), as it is the same text (grouped under the matches[key]).
     */
    Object.keys(matches).forEach(function (key) {
      matches[key].offsets.forEach(function (offset) {
        offset.isInvalid = false;

        // check if the offset has incomplete views
        offset.alternatives.forEach(function (a) {
          if (a.view.indexOf('LD:CELLAR:DEC:') > -1) {
            offset.isInvalid = true;
          }
        });
      });
      matches[key].offsets.forEach(function (offset) {
        if (offset.isInvalid) {
          // find a valid one to fill the views and alternatives
          var validOffset = matches[key].offsets.find(function (o) {
            return !o.isInvalid;
          });
          if (validOffset) {
            offset.alternatives = validOffset.alternatives;
            offset.views = validOffset.views;
          }
        }
      });
    });
    return matches;
  })["catch"](function (error) {
    console.error(error);
    return matches;
  });
};
function getFilter(attributes, queryLang) {
  var author = String(attributes.author || '');
  var filters;
  switch (author) {
    // partnership council
    case 'http://publications.europa.eu/resource/authority/corporate-body/EURUN':
      filters = "(STRSTARTS(?workId, \"celex:".concat(attributes.celexId, "\") AND \n            REGEX(?title_, \"No[\u202F\xA0 ]").concat(attributes.number, "/").concat(attributes.year, "\", \"i\"))");
      break;
    // EEA joint committee
    case 'http://publications.europa.eu/resource/authority/corporate-body/CMT_MIX_EEAREA':
      filters = "(STRSTARTS(?workId, \"celex:2\") AND \n            REGEX(?title_, \"[\u202F\xA0 ]".concat(attributes.number, "/").concat(attributes.year, "\", \"i\"))");
      break;
    // Committee of the Regions
    case 'http://publications.europa.eu/resource/authority/corporate-body/COR':
      filters = "(STRSTARTS(?workId, \"celex:3".concat(attributes.year, "\") AND \n            REGEX(?title_, \"[\u202F\xA0 ]").concat(attributes.number, "/").concat(attributes.year, "\", \"i\"))");
      break;
    // Court of the auditors
    case 'http://publications.europa.eu/resource/authority/corporate-body/ECA':
      filters = "(STRSTARTS(?workId, \"celex:3".concat(attributes.year, "Q\") AND \n            REGEX(?title_, \"[\u202F\xA0 ]").concat(attributes.number, "[/-]").concat(attributes.year, "\", \"i\"))");
      break;
    // international agreement with no known author
    case AUTHOR_UNKNOWN:
      filters = "(STRSTARTS(?workId, \"celex:2\") AND REGEX(?eli, \"^http://data.europa.eu/eli/dec/\") AND\n            REGEX(?title_, \"No[\u202F\xA0 ]".concat(attributes.number, "/").concat(attributes.year, "\", \"i\"))");
      break;
    default:
      filters = "(STRSTARTS(?workId, \"celex:".concat(attributes.celexId, "\") AND \n            REGEX(?title_, \"[\u202F\xA0 ]").concat(attributes.number, "/").concat(attributes.year, "\", \"i\"))");
      break;
  }
  return filters;
}

/**
 * Query by CELEX year prefix and ref number
 * @param {Array<Object>} attributesList
 * @returns {String}
 */
function external_dec_getQuery(attributesList, lang) {
  var filters = [];

  // only accept ENG and FRA
  var queryLang = ['ENG', 'FRA'].indexOf(String(lang).toUpperCase()) > -1 ? lang : 'ENG';
  var map = {};
  for (var i = 0; i < attributesList.length; i++) {
    var str = "\n        {\n            ?exp cdm:expression_belongs_to_work ?s .\n            ?exp cdm:expression_title ?title_ .\n            ?exp cdm:expression_uses_language ?lang .\n            ?s cdm:work_id_document ?workId . \n            OPTIONAL {\n                ?s cdm:work_created_by_agent ?author\n            }\n            filter(?lang=lang:".concat(queryLang, ").  \n            ");
    if (attributesList[i].author !== AUTHOR_UNKNOWN) {
      str += " ?s cdm:work_created_by_agent <".concat(attributesList[i].author, "> .");
    } else {
      str += " ?s cdm:resource_legal_type \"D\"^^<http://www.w3.org/2001/XMLSchema#string> .";
    }
    str += "\n            FILTER ".concat(getFilter(attributesList[i], queryLang), "\n\n            OPTIONAL {     \n                ?s cdm:resource_legal_eli ?eli.\n            }\n        }");
    if (map[str]) {
      continue;
    }
    map[str] = true;
    filters.push(str);
  }
  var query = "\nPREFIX cdm:<http://publications.europa.eu/ontology/cdm#>\nPREFIX owl:<http://www.w3.org/2002/07/owl#>\nPREFIX lang:<http://publications.europa.eu/resource/authority/language/>\n        \nSELECT DISTINCT \n    ?workId as ?id\n    ?title_ as ?title\n    ?eli\n    ?author\nWHERE {\n    ".concat(filters.join(' UNION '), " \n}");
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
  var re = new RegExp(String.fromCharCode(160), "gi");

  // use the fuzzy text matcher if there is no author
  if (attributes['data-ref-author'] === AUTHOR_UNKNOWN) {
    bindings = bindings.filter(function (b) {
      return b.title.value.replace(re, " ").toLowerCase().indexOf(' ' + attributes['data-ref-no'] + '/' + attributes['data-ref-year']) > 0;
    });

    // use the text matcher
    var titles = bindings.map(function (b) {
      return b.title.value;
    });
    // sanitize query
    var query = String(attributes['context-right']).replace(re, " ").replaceAll('&nbsp;', ' ');
    var matchResults = fuzzyTextMatcher.findBestMatch(query, titles);
    if (matchResults[0] && matchResults[0].score > MATCH_SCORE_THRESHOLD) {
      return bindings.find(function (b) {
        return b.title.value === matchResults[0].text;
      });
    } else {
      return null;
    }
  }

  // find the reference number eg. 18/2020
  return bindings.find(function (binding) {
    var upperTitle = (binding.title.value || "").toUpperCase().replace(re, " ");
    if (attributes['data-ref-author-label'] && upperTitle.indexOf(String(attributes['data-ref-author-label']).toUpperCase()) === -1) {
      return false;
    }
    var parts = (0,utils/* sanitize */.aj)(binding.title.value).split(" ").filter(function (part) {
      return String(part).match("\\d+[\\/-]\\d{4}");
    });

    //check whether parts and matchParts have a common reference {{no}}/{{year}}
    if (parts.length > 0) {
      return parts[0] === attributes['data-ref-no'] + '/' + attributes['data-ref-year'] || parts[0] === attributes['data-ref-no'] + '-' + attributes['data-ref-year'];
    }
    return false;
  });
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
  return (0,request/* getRequestPromise */.p2)((0,manager/* getEndpoint */.yP)(manager/* LD_TYPE_CELEX */.wD), "POST", {
    query: query,
    format: format,
    origin: '*'
  }, null, request/* HOOK_LINKED_DATA_REQ */.ms).then(function (response) {
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
  return (0,request/* getRequestPromise */.p2)((0,manager/* getEndpoint */.yP)(manager/* LD_TYPE_CELEX */.wD), "POST", {
    query: query,
    format: format,
    origin: '*'
  }, null, request/* HOOK_LINKED_DATA_REQ */.ms).then(function (response) {
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
    (0,request/* getRequestPromise */.p2)((0,manager/* getEndpoint */.yP)(manager/* LD_TYPE_CELEX */.wD), "POST", {
      query: query,
      format: format,
      origin: '*'
    }, null, request/* HOOK_LINKED_DATA_REQ */.ms).then(function (response) {
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
    (0,request/* getRequestPromise */.p2)((0,manager/* getEndpoint */.yP)(manager/* LD_TYPE_CELEX */.wD), "POST", {
      query: query,
      format: format,
      origin: '*'
    }, null, request/* HOOK_LINKED_DATA_REQ */.ms).then(function (response) {
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
    (0,request/* getRequestPromise */.p2)((0,manager/* getEndpoint */.yP)(manager/* LD_TYPE_CELEX */.wD), "POST", {
      query: query,
      format: format,
      origin: '*'
    }, null, request/* HOOK_LINKED_DATA_REQ */.ms).then(function (response) {
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

          // REFTOLINK-2277 - override the main Curia target's CELEX id if needed
          // use first of the finalCelexIds 
          var finalCelexIdData = finalCelexIds[0];
          if (finalCelexIdData) {
            var finalCelexId = finalCelexIdData.celexId;
            var finalLabel = finalCelexIdData.label;
            var regex = new RegExp("data-ref-label(?:-\\d+)?=\"" + (0,functions/* regExpEscape */.fI)(finalLabel) + "\"", "i");

            // raw replacement
            Object.keys(offset.views).forEach(function (key) {
              if (key === 'curia' && regex.test(String(offset.views[key]))) {
                offset.views[key] = String(offset.views[key]).replace(/data-ref-celex="[A-Z0-9]{11}{{ LD:CELLAR:EUCASE:SUBNUMBER:CELEX }}"/, "data-ref-celex=\"".concat(finalCelexId, "\""));
              }
            });
            offset.alternatives.forEach(function (alternative) {
              if (alternative.viewName === 'curia' && regex.test(String(alternative.view))) {
                alternative.view = String(alternative.view).replace(/data-ref-celex="[A-Z0-9]{11}{{ LD:CELLAR:EUCASE:SUBNUMBER:CELEX }}"/, "data-ref-celex=\"".concat(finalCelexId, "\""));
              }
            });
          }
          ;
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
    promises.push((0,request/* getRequestPromise */.p2)((0,manager/* getEndpoint */.yP)(manager/* LD_TYPE_CELEX */.wD), "POST", {
      query: query,
      format: format,
      origin: '*'
    }, null, request/* HOOK_LINKED_DATA_REQ */.ms));
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
  return (0,request/* getRequestPromise */.p2)((0,manager/* getEndpoint */.yP)(manager/* LD_TYPE_CELEX */.wD), "POST", {
    query: query,
    format: format,
    origin: '*'
  }, null, request/* HOOK_LINKED_DATA_REQ */.ms).then(function (response) {
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
  return (0,request/* getRequestPromise */.p2)((0,manager/* getEndpoint */.yP)(manager/* LD_TYPE_CELEX */.wD), "POST", {
    query: query,
    format: format,
    origin: '*'
  }, null, request/* HOOK_LINKED_DATA_REQ */.ms).then(function (response) {
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
  return (0,request/* getRequestPromise */.p2)((0,manager/* getEndpoint */.yP)(manager/* LD_TYPE_CELEX */.wD), "POST", {
    query: query,
    format: format,
    origin: '*'
  }, null, request/* HOOK_LINKED_DATA_REQ */.ms).then(function (response) {
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
function lib_typeof(o) { "@babel/helpers - typeof"; return lib_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, lib_typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = lib_toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function lib_toPropertyKey(t) { var i = lib_toPrimitive(t, "string"); return "symbol" == lib_typeof(i) ? i : String(i); }
function lib_toPrimitive(t, r) { if ("object" != lib_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != lib_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }

















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
    "FR": "En vigueur",
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
    // we accept all other 2 letters as a suffix and we keep it
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
    if (String(input).match(/^(\d+).*?quater$/i)) {
      return String(input).replace(/^(\d+).+/i, "\$1c");
    }
    if (String(input).match(/^(\d+).*?quinquies$/i)) {
      return String(input).replace(/^(\d+).+/i, "\$1d");
    }
    if (String(input).match(/^(\d+).*?sexies$/i)) {
      return String(input).replace(/^(\d+).+/i, "\$1e");
    }
    if (String(input).match(/^(\d+).*?septies$/i)) {
      return String(input).replace(/^(\d+).+/i, "\$1f");
    }
    if (String(input).match(/^(\d+).*?octies$/i)) {
      return String(input).replace(/^(\d+).+/i, "\$1g");
    }

    // check last because it is contained by 'quater'
    if (String(input).match(/^(\d+).*?ter$/i)) {
      return String(input).replace(/^(\d+).+/i, "\$1b");
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
/* harmony export */   ip: () => (/* binding */ isPrimitiveDataType),
/* harmony export */   kS: () => (/* binding */ hasTags),
/* harmony export */   oY: () => (/* binding */ buildAttributesData),
/* harmony export */   pZ: () => (/* binding */ indent),
/* harmony export */   pn: () => (/* binding */ sanitizeHtml),
/* harmony export */   pt: () => (/* binding */ extractAttributes),
/* harmony export */   q5: () => (/* binding */ simpleParse),
/* harmony export */   q6: () => (/* binding */ extractUrls),
/* harmony export */   v3: () => (/* binding */ delimiter2RegExp),
/* harmony export */   wI: () => (/* binding */ regExpEscapeSparql),
/* harmony export */   wh: () => (/* binding */ getBaseTargetName),
/* harmony export */   y$: () => (/* binding */ intersect),
/* harmony export */   zP: () => (/* binding */ getReferences)
/* harmony export */ });
/* unused harmony exports xmlEscape, mergeMatches */
/* harmony import */ var _jquery_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(953);
/* harmony import */ var _ux_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(246);
/* harmony import */ var _settings_index_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(265);
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }



function regExpEscape(pattern) {
  return pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
;
function regExpEscapeSparql(pattern) {
  return regExpEscape(pattern).replaceAll('\\', '\\\\'); // two backslashes for SPARQL queries
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
function isPrimitiveDataType(value) {
  var type = _typeof(value);
  return type === 'string' || type === 'number' || type === 'boolean' || value === null || value === undefined;
}
var _templateElement;

/**
 * Sanitizes a string to make sure it does not contain HTML markup;
 * @param {String} str 
 * @returns {String} escaped string with HTML entities decoded
 */
function sanitizeHtml(str) {
  str = String(str);
  // reuse DOM Element instead of creating a new one every time this function is called
  _templateElement = _templateElement || document.createElement('template');
  _templateElement.innerHTML = str;
  return _templateElement.content.textContent;
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
      return (0,request/* getRequestPromise */.p2)(this.getWikidataEndpoint(), "GET", {
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
        return (0,request/* getRequestPromise */.p2)(settings/* settings */.W0.constants.R2L_AI_ENDPOINT, "POST", {
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
      return (0,request/* getRequestPromise */.p2)((0,manager/* getEndpoint */.yP)(manager/* LD_TYPE_CELEX */.wD), "POST", {
        query: query,
        format: 'application/json',
        origin: '*',
        target: manager/* LD_TARGET_CELLAR */.xL
      }, null, request/* HOOK_LINKED_DATA_REQ */.ms).then(function (response) {
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
  var offsetsArr = [];
  Object.values(matches).forEach(function (match) {
    match.offsets.forEach(function (offset) {
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

  // attach the alias to the offset that contains it
  offsetsArr.forEach(function (offset, index) {
    var referenceStart = offset.position;
    var referenceEnd = referenceStart + offset.match.length;
    replaceAliasesResult.offsets.forEach(function (aliasOffset) {
      if (aliasOffset.replacementPosition >= referenceStart && aliasOffset.replacementPosition + aliasOffset.replacement.length <= referenceEnd) {
        offset.alias = _objectSpread(_objectSpread({}, aliasOffset), {
          containsAlias: true
        });
      }
    });
  });

  // temporarily set an `_alias` property to list items as we will need the data for replacement of context
  offsetsArr.forEach(function (offset, index) {
    var isListItem = offset.match !== offset.context;
    if (offset.alias && offset.alias.containsAlias && isListItem) {
      // go to the neighbours and mark them as part of the same alias   
      var indexDown = index - 1;
      var indexUp = index + 1;
      while (offsetsArr[indexDown] && offsetsArr[indexDown].context === offset.context) {
        offsetsArr[indexDown].alias = _objectSpread(_objectSpread({}, offset.alias), {
          containsAlias: false
        });
        indexDown--;
      }
      while (offsetsArr[indexUp] && offsetsArr[indexUp].context === offset.context) {
        offsetsArr[indexUp].alias = _objectSpread(_objectSpread({}, offset.alias), {
          containsAlias: false
        });
        indexUp++;
      }
    }
  });
  var lastAlias = null;
  var positionDelta = 0;
  offsetsArr.forEach(function (offset) {
    offset.position += positionDelta;
    if (offset.alias && offset.alias.containsAlias) {
      lastAlias = offset.alias;
      positionDelta += lastAlias.source.length - lastAlias.replacement.length;
    }
  });

  // we should not blindly replace everything
  offsetsArr.forEach(function (offset) {
    if (offset.alias) {
      replaceFn(offset, offset.alias.replacement, offset.alias.source);
    }
  });
  var newMatches = {};

  // replace keys and match objects
  Object.keys(matches).forEach(function (key) {
    for (var i = 0; i < matches[key].offsets.length; i++) {
      var matchOffset = matches[key].offsets[i];
      if (matchOffset.alias && matchOffset.alias.containsAlias) {
        var newKey = key.replace(matchOffset.alias.replacement, matchOffset.alias.source);
        var newMatch = matches[key];
        newMatches[newKey] = newMatch;
      } else {
        newMatches[key] = matches[key];
      }
    }
  });

  // REFTOLINK-2247
  Object.keys(newMatches).forEach(function (key) {
    // de-dupe
    if (newMatches[key].offsets.filter(function (o) {
      return o.match !== key;
    }).length > 0) {
      newMatches[key] = _objectSpread({}, newMatches[key]);
      newMatches[key].offsets = newMatches[key].offsets.filter(function (o) {
        return o.match === key;
      });
      newMatches[key].counter = newMatches[key].offsets.length;
    }
  });
  Object.keys(newMatches).forEach(function (key) {
    var aliasOffset = newMatches[key].offsets.filter(function (o) {
      return o.alias && o.alias.containsAlias;
    }).map(function (o) {
      return o.alias;
    }).pop();
    if (aliasOffset) {
      replaceFn(newMatches[key], aliasOffset.replacement, aliasOffset.source, false);
    }
  });
  return newMatches;
}

// reuse the same element
var _textarea;
var replaceFn = function replaceFn(obj, search, replace) {
  var withTargets = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
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
  if (withTargets) {
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
 * @param {String} toReplace - text to search for
 * @param {String} replacement - text to replace with
 * @param {String} context - (used only for lists, with isMain=false) the ref text where we want to replace a subdivision eg. context = 'articles 2 and 3 of the GDPR' with toReplace = 'articles 2'
 * @param {Boolean} allowAttribute
 * @param {Boolean} isMain - when replacing in the actual input text or inside a reference (for lists)
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
      offsetArr = allOffsets[offsetKeys[oIndex]];
      replacement = offsetKeys[oIndex];
      /** replace inside list in descending order **/
      offsetArr.sort(function (a, b) {
        return a.match.length > b.match.length ? -1 : 1;
      });
      var allowAttribute = true;
      for (k = 0; k < offsetArr.length; k++) {
        if (offsetArr[k].alternatives.length > 0) {
          var view = "";
          for (l = 0; l < offsetArr[k].alternatives.length; l++) {
            _alternative = offsetArr[k].alternatives[l];
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
          search = offsetArr[k].match;
          offsetArr[k].alternatives.forEach(function (alt) {
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
    offsetArr,
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
      offsetArr = allOffsets[offsetKeys[oIndex]];
      replacement = offsetKeys[oIndex];
      /** replace inside list in descending order **/
      offsetArr.sort(function (a, b) {
        return a.match.length > b.match.length ? -1 : 1;
      });
      var allowAttribute = true;
      for (k = 0; k < offsetArr.length; k++) {
        if (offsetArr[k].alternatives.length > 0) {
          var view = "";
          for (l = 0; l < offsetArr[k].alternatives.length; l++) {
            _alternative = offsetArr[k].alternatives[l];
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
          search = offsetArr[k].match;
          offsetArr[k].alternatives.forEach(function (alt) {
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
    offsetArr,
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
  html = html || "";
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
/* harmony export */   ms: () => (/* binding */ HOOK_LINKED_DATA_REQ),
/* harmony export */   oc: () => (/* binding */ HOOK_CURIA_REQ),
/* harmony export */   p2: () => (/* binding */ getRequestPromise),
/* harmony export */   vR: () => (/* binding */ HOOK_EURLEX_REQ)
/* harmony export */ });
/* harmony import */ var _jquery_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(953);
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }

var HOOK_LINKED_DATA_REQ = 'handleLinkedDataReq';
var HOOK_EURLEX_REQ = 'handleEurlexReq';
var HOOK_CURIA_REQ = 'handleCuriaReq';

/**
 * Wrapper function to call external endpoints
 * 
 * @param {String} endpoint 
 * @param {String} method 
 * @param {any} data 
 * @param {Object} headers 
 * @returns {Promise<any>}
 */
function getRequestPromise(endpoint, method, data, headers, hook) {
  /**
   * Ref2Link library consumers can hook a function to the handling of SPARQL requests in order to override default behavior. 
   * This is useful in the context of the Webservice, which integrates the library and where there is no need for the library to call the WS back for linked data (circular-dependency).
   */
  headers = headers || {};
  var allheaders = _objectSpread(_objectSpread({}, headers), R2L.ldm.getCustomHeaders());
  if (hook && R2L.hooks[hook]) {
    return R2L.hooks[hook](data, headers, false, R2L.ldm.user);
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
              (0,_jquery_js__WEBPACK_IMPORTED_MODULE_0__.$)(document).trigger('ref2link.ld', [R2L.getFormattedReferences("json"), result]);
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

// EXTERNAL MODULE: ./src/lib/index.js + 15 modules
var lib = __webpack_require__(292);
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
      node.matches.forEach(function (match, index) {
        arr.push({
          alias: match.alias,
          match: match.match,
          context: match.context,
          position: match.position,
          type: node.type,
          reference: node.reference,
          urls: node.urls,
          data: [node.data[index]]
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
    return Buffer.from(str).toString('base64');
  };
  global.R2L = lib/* R2L */.R;
}
/******/ })()
;