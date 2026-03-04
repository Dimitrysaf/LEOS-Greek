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

  // collect IMMC ids
  id = data[_manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_IMMC */ .pO] || data["data-" + _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_IMMC */ .pO] || data["data-ref-" + _manager_index_js__WEBPACK_IMPORTED_MODULE_0__/* .LD_TYPE_IMMC */ .pO];
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

var getCelexCaselawQuery = function getCelexCaselawQuery(celexIds, langISO3) {
  var langISO3Parsed = langISO3 ? String(langISO3).toUpperCase() : "ENG";

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
  var query = "\n        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n        PREFIX cdm:<http://publications.europa.eu/ontology/cdm#>\n        PREFIX skos:<http://www.w3.org/2004/02/skos/core#>\n        PREFIX dc:<http://purl.org/dc/elements/1.1/>\n        PREFIX lang:<http://publications.europa.eu/resource/authority/language/>\n        PREFIX xsd:<http://www.w3.org/2001/XMLSchema#>\n        PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n        PREFIX owl:<http://www.w3.org/2002/07/owl#>\n       \n        SELECT DISTINCT\n            ?workId as ?id \n            ?date \n            ?title \n            ?baseTitle\n            ?ecli\n            ?dossierTitle\n            ?lang\n        WHERE {  \n\n            {\n                SELECT ?workId (MIN(?priority) as ?minPriority)\n                WHERE {\n                    ?exp cdm:expression_belongs_to_work ?s .\n                    ?exp cdm:expression_uses_language ?langValue .\n                    FILTER(?langValue IN (lang:".concat(langISO3Parsed, ", lang:FRA))\n                    ?s cdm:work_id_document ?workId.\n                    BIND(IF(?langValue = lang:").concat(langISO3Parsed, ", 1, 2) AS ?priority)\n                    ").concat(filters, "\n                    FILTER not exists {?s cdm:work_is_member_of_complex_work ?complex. }\n                }\n                GROUP BY ?workId\n            }\n\n\n            ?exp cdm:expression_belongs_to_work ?s .\n            ?exp cdm:expression_uses_language ?lang .\n            FILTER(?lang IN (lang:").concat(langISO3Parsed, ", lang:FRA))\n\n            BIND(IF(?lang = lang:").concat(langISO3Parsed, ", 1, 2) AS ?priority)\n            FILTER(?priority = ?minPriority)\n\n            ?exp cdm:expression_title ?title_ .\n\n            ?s cdm:work_date_document ?date .\n            ?s rdf:type ?type .\n            ?s cdm:work_id_document ?workId.\n\n            OPTIONAL {\n                ?s2 cdm:work_id_document ?workId.\n                ?s2 cdm:work_part_of_dossier ?dossier.\n                ?dossier cdm:dossier_title ?dossierTitle\n            }\n            OPTIONAL {\n                ?s cdm:case-law_ecli ?ecli\n            }\n            ").concat(filters, "\n            FILTER not exists {?s cdm:work_is_member_of_complex_work ?complex. }\n            \n            BIND(CONCAT(?title_, IF(BOUND(?ecli), CONCAT(\"\\nECLI identifier: \", ?ecli), \"\")) as ?title) \n            BIND(?title_ as ?baseTitle)\n        }\n\n        ORDER BY ?id ?priority");
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
  var query = "\n        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n        PREFIX cdm:<http://publications.europa.eu/ontology/cdm#>\n        PREFIX skos:<http://www.w3.org/2004/02/skos/core#>\n        PREFIX dc:<http://purl.org/dc/elements/1.1/>\n        PREFIX lang:<http://publications.europa.eu/resource/authority/language/>\n        PREFIX xsd:<http://www.w3.org/2001/XMLSchema#>\n        PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n        PREFIX owl:<http://www.w3.org/2002/07/owl#>\n\n        SELECT DISTINCT \n            ?date ?id \n            ?title \n            ?baseTitle\n            ?eli \n            ?force \n            MIN(?dateForce) as ?dateForce\n            (REPLACE(?oj, \" /, \\\\.\\\\.\", \"\", \"i\") as ?oj)\n            ?ojId \n            ?ojResourceUrl\n            ?ojDate\n            ?consolidatedDate \n            ?consolidatedEli \n            ?consolidatedId\n            MAX(?dateValidity) as ?dateValidity\n            ?repealCelexId \n            ?repealEli\n            ?lastRepealCelexId\n            ?lastRepealEli\n            ?resourceUrl\n            ?immcId\n            ?lang\n{\n        SELECT \n            ?date ?workId as ?id \n            ?title \n            ?baseTitle\n            ?eli \n            ?force \n            ?dateForce \n            (IF(BOUND(?ojIdOld), ?ojIdOld, ?ojActId) as ?ojId)\n            (IF(BOUND(?ojResourceUrlOld), ?ojResourceUrlOld, ?ojActResourceUrl) as ?ojResourceUrl)\n            (IF(BOUND(?ojDateOld), ?ojDateOld, ?ojActDate) as ?ojDate)\n            (IF(BOUND(?ojOld), ?ojOld, CONCAT(CONCAT(CONCAT(CONCAT(CONCAT(REPLACE(STR(?ojCollectionDocumentIdentifier ) , \"-\", \" \", \"i\"), \" \"), CONCAT(?ojActYear, \"/\"))), CONCAT(?ojActNumber, \", \")), \n            CONCAT(CONCAT(SUBSTR(STR(?ojActDate), 9, 2), \".\"), CONCAT(CONCAT(SUBSTR(STR(?ojActDate), 6, 2), \".\")), SUBSTR(STR(?ojActDate), 1, 4)))) as ?oj)\n            ?consolidatedDate \n            ?consolidatedEli \n            ?consolidatedId\n            ?dateValidity\n            ?repealCelexId \n            ?repealEli\n            ?lastRepealCelexId\n            ?lastRepealEli\n            ?resourceUrl\n            ?immcId\n            ?lang\n        WHERE {  \n            graph ?ge { \n                ?exp cdm:expression_belongs_to_work ?s .\n                ?exp cdm:expression_title ?title_ .\n                OPTIONAL {\n                    ?exp owl:sameAs ?resourceUrl .\n                    FILTER (REGEX(?resourceUrl, \"resource/oj/\"))\n                }\n            }\n            graph ?g { \n                ?exp cdm:expression_uses_language ?lang\n                ".concat(langISO3Filters, "\n            }  \n\n            ?s cdm:work_date_document ?date .\n            ?s rdf:type ?type .\n            ?s cdm:work_id_document ?workId.\n            OPTIONAL {\n                ?s cdm:resource_legal_date_end-of-validity ?dateValidity .\n            }\n            ").concat(filters, "\n            \n            FILTER not exists {?s cdm:work_is_member_of_complex_work ?complex. }\n            OPTIONAL {\n                ?s cdm:work_id_document ?immcId\n                FILTER(REGEX(?immcId, \"^immc:\"))\n            }\n            OPTIONAL {\n                # CONSOLIDATION\n                ?actConsolidated cdm:act_consolidated_based_on_resource_legal ?s .\n                ?actConsolidated cdm:act_consolidated_date ?consolidatedDate .\n                ?actConsolidated cdm:resource_legal_date_entry-into-force ?consolidatedDateEntryForce .\n                ?actConsolidated cdm:resource_legal_eli ?consolidatedEli . \n                ?actConsolidated cdm:work_id_document ?consolidatedId_ .\n                \n                # we only need results before the end of the act validity\n                ?s cdm:resource_legal_date_end-of-validity ?act_end_of_validity .\n\n                ").concat(pointInTimeFilter1, "\n                FILTER (?consolidatedDateEntryForce < ?act_end_of_validity)     \n                FILTER regex(str(?consolidatedId_), \"celex:\")     \n                # latest consolidation date only\n                FILTER not exists {\n                    ?actConsolidated2 cdm:resource_legal_date_entry-into-force ?consolidatedDateEntryForce2 .\n                    ?actConsolidated2 cdm:act_consolidated_date ?consolidatedDate2 .\n                    ?actConsolidated2 cdm:act_consolidated_based_on_resource_legal ?s .\n                    ?s cdm:resource_legal_date_end-of-validity ?act_end_of_validity2 .\n                    ").concat(pointInTimeFilter2, "\n                    FILTER (?consolidatedDateEntryForce2 > ?consolidatedDateEntryForce AND (?consolidatedDateEntryForce2 < ?act_end_of_validity2))\n                }\n\n                BIND(SUBSTR(?consolidatedId_, 7) as ?consolidatedId)\n            }\n            OPTIONAL {\n                # REPEALING\n                ?actRepeal cdm:resource_legal_repeals_resource_legal ?s .\n                ?actRepeal cdm:resource_legal_eli ?repealEli . \n                ?actRepeal cdm:work_date_document ?repealDate . \n                ?actRepeal cdm:work_id_document ?repealCelexId_.\n                ").concat(pointInTimeFilter3, "\n                FILTER regex(str(?repealCelexId_), \"celex:\")                    \n                BIND(SUBSTR(?repealCelexId_, 7) as ?repealCelexId)\n\n                OPTIONAL {\n                    # REPEALING LAST\n                    ?lastActRepeal cdm:resource_legal_repeals_resource_legal+ ?s .\n                    ?lastActRepeal cdm:resource_legal_eli ?lastRepealEli . \n                    ?lastActRepeal cdm:work_id_document ?lastRepealCelexId_.\n                    FILTER regex(str(?lastRepealCelexId_), \"celex:\")                    \n                    FILTER not exists {\n                       ?actRepeal_ cdm:resource_legal_repeals_resource_legal ?lastActRepeal .\n                       ?actRepeal_ cdm:work_date_document ?repealDate2\n                       ").concat(pointInTimeFilter4, "\n                    } \n                    BIND(SUBSTR(?lastRepealCelexId_, 7) as ?lastRepealCelexId)\n                }\n            }\n            OPTIONAL {\n                ?s cdm:resource_legal_eli ?eli .\n            }\n            OPTIONAL {\n                # FORCE\n                ?s cdm:resource_legal_in-force ?force .\n                ?s cdm:resource_legal_date_entry-into-force ?dateForce .\n            }        \n            OPTIONAL {\n                # MANIFEST \n                ?manif cdm:manifestation_manifests_expression ?exp. \n                ?manif cdm:manifestation_type ?manifType .\n                FILTER(STR(?manifType)=\"print\" || BOUND(?ojPageFirst)) .\n\n                # MANIFEST OJ PAGE (optional)\n                OPTIONAL {\n                    ?manif cdm:manifestation_official-journal_part_page_first ?ojPageFirst.\n                    ?manif cdm:manifestation_official-journal_part_page_last ?ojPageLast.\n                }\n\n                ?manif cdm:manifestation_part_of_manifestation ?parentManif.\n                OPTIONAL {\n                    ?parentManif owl:sameAs ?langSpecificManif.\n                }\n                OPTIONAL {\n                    ?manif owl:sameAs ?manifOjResourceUrl .\n                    # We need to use the MANIFEST to get to the OJ\n                    FILTER (STRSTARTS(STR(?manifOjResourceUrl), \"http://publications.europa.eu/resource/oj/\"))\n                }\n\n                # OJ info\n                ?s cdm:resource_legal_published_in_official-journal ?q .\n                ?q cdm:official-journal_part_of_collection_document ?ojPartOld .\n                ?q cdm:official-journal_number ?ojNumberOld .\n                OPTIONAL {\n                    ?q cdm:official-journal_class ?ojClassOld .\n                }\n                ?ojPartOld skos:prefLabel ?ojPartLabelOld .\n                ?q cdm:official-journal_volume ?ojVolumeOld .\n                ?q cdm:publication_general_date_publication ?ojDateOld .\n                \n                # cross match with parent OJ resource\n                ?q owl:sameAs ?mainOjResourceUrlOld .\n                ?q cdm:work_id_document ?ojIdOld.\n                \n                # multiple OJ publications can cause trouble so we cross-match the OJ url with the manifest's (where available)\n                FILTER (!BOUND(?langSpecificManif) || STRSTARTS(STR(?langSpecificManif), STR(?mainOjResourceUrlOld)) || (REGEX(STR(?langSpecificManif), 'resource/oj/DD_')))\n                FILTER (STRSTARTS(STR(?ojIdOld), \"oj:\") AND STRSTARTS(STR(?mainOjResourceUrlOld), \"http://publications.europa.eu/resource/oj/\")) \n                BIND(?mainOjResourceUrlOld as ?ojResourceUrlOld)\n\n                BIND(CONCAT(STR(DAY(?ojDateOld)), \n                \".\", \n                STR(MONTH(?ojDateOld)), \n                \".\", \n                STR(YEAR(?ojDateOld))) as ?ojDatePublicationOld)\n\n                # OJ label; do not modify as it will be processed for translation\n                BIND(IF(BOUND(?ojPartLabelOld), \n                CONCAT(CONCAT(REPLACE(REPLACE(REPLACE(?ojPartLabelOld, \" series\", \"\", \"i\"), \"Official Journal\", \"OJ\", \"i\"), \"-\", \" \", \"i\"), \" \", \n                CONCAT(?ojNumberOld, \n                CONCAT(IF (STR(?ojClassOld) != \"R\", ?ojClassOld, \"\"),\n                CONCAT(\", \", CONCAT($ojDatePublicationOld,\n                    CONCAT(IF(BOUND(?ojPageFirst), \", p. \", \"\"), \n                    CONCAT(IF(BOUND(?ojPageFirst), xsd:integer(?ojPageFirst), \"\"), \n                    CONCAT(IF(BOUND(?ojPageLast), \"-\", \"\"), IF(BOUND(?ojPageLast), xsd:integer(?ojPageLast), \"\")))))))))), \"\") as ?ojOld) .\n\n                FILTER (lang(?ojPartLabelOld) = \"en\" )\n            }\n\n            # OJ act-by-act\n            OPTIONAL {\n                FILTER NOT EXISTS {\n                    ?s cdm:resource_legal_published_in_official-journal ?_ojTemp\n                }\n                ?s cdm:official-journal-act_date_publication ?ojActDate .\n                ?s cdm:official-journal-act_part_of_collection_document ?ojCollectionDocument .\n                ?ojCollectionDocument dc:identifier ?ojCollectionDocumentIdentifier .\n                ?s cdm:official-journal-act_subsubsection_oj ?ojSubsection .\n                ?s cdm:official-journal-act_number ?ojActNumber .\n                ?s cdm:official-journal-act_year ?ojActYear .\n                \n                ?s cdm:work_id_document ?ojActId. \n                FILTER (STRSTARTS(STR(?ojActId), \"oj:\"))\n                ?s cdm:resource_legal_eli ?ojActResourceUrl . \n            } \n\n            BIND(?title_ as ?title) \n            BIND(?title_ as ?baseTitle)\n        }\n    }\n    ORDER BY ?id ?lang");
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
  var langISO3Parsed = langISO3 ? String(langISO3).toUpperCase() : "ENG";
  ecliIds = ecliIds.filter(function (v, i, a) {
    return a.indexOf(v) === i;
  });
  var filters = "FILTER (";
  for (var i = 0; i < ecliIds.length; i++) {
    filters += "?ecli=\"".concat(ecliIds[i], "\"^^xsd:string");
    if (i < ecliIds.length - 1) {
      filters += " || ";
    }
  }
  filters += ")";
  var query = "\n        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n        PREFIX cdm:<http://publications.europa.eu/ontology/cdm#>\n        PREFIX skos:<http://www.w3.org/2004/02/skos/core#>\n        PREFIX dc:<http://purl.org/dc/elements/1.1/>\n        PREFIX lang:<http://publications.europa.eu/resource/authority/language/>\n        PREFIX xsd:<http://www.w3.org/2001/XMLSchema#>\n        PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n        PREFIX owl:<http://www.w3.org/2002/07/owl#>\n\n        SELECT DISTINCT ?workId as ?celexId ?date ?ecli as ?id ?title_ as ?title ?force ?dossierTitle ?lang WHERE {   \n            {\n                SELECT ?ecli (MIN(?priority) as ?minPriority)\n                WHERE {\n                    ?exp cdm:expression_belongs_to_work ?s .\n                    ?exp cdm:expression_uses_language ?langValue .\n                    FILTER(?langValue IN (lang:".concat(langISO3Parsed, ", lang:FRA))\n                    BIND(IF(?langValue = lang:").concat(langISO3Parsed, ", 1, 2) AS ?priority)\n                    ?s cdm:case-law_ecli ?ecli .\n                    ").concat(filters, "\n                    FILTER not exists {?s cdm:work_is_member_of_complex_work ?complex. }\n                }\n                GROUP BY ?ecli\n            }\n\n            ?exp cdm:expression_belongs_to_work ?s .\n            ?exp cdm:expression_title ?title_ .\n            ?exp cdm:expression_uses_language ?lang\n            FILTER(?lang IN (lang:").concat(langISO3Parsed, ", lang:FRA))\n            BIND(IF(?lang = lang:").concat(langISO3Parsed, ", 1, 2) AS ?priority)\n            FILTER(?priority = ?minPriority)\n        \n            ?s cdm:case-law_ecli ?ecli .\n            ?s cdm:work_date_document ?date .\n            ?s cdm:work_id_document ?workId.\n\n            OPTIONAL {\n                ?s2 cdm:case-law_ecli ?ecli .\n                ?s2 cdm:work_part_of_dossier ?dossier.\n                ?dossier cdm:dossier_title ?dossierTitle\n            }\n\n            ").concat(filters, " .\n            FILTER not exists {?s cdm:work_is_member_of_complex_work ?complex. }\n            FILTER regex(str(?workId), \"celex\")\n            FILTER (!regex(str(?workId), \"_\"))\n            OPTIONAL {\n                ?s cdm:resource_legal_in-force ?force .\n            }\n        }\n        ORDER BY ?id ?lang\n    ");
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
  // also support search through target fragment
  var searchFilter = searchTextEscaped ? "FILTER(regex(?title, \"".concat(searchTextEscaped, "\", \"i\" ) OR regex(?fragmentCitedTarget, \"").concat((0,functions/* regExpEscapeSparql */.wI)(searchText.toLowerCase()).toUpperCase(), "\"))") : "";
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
  content = content.replace(/\s{2,}/gi, " ");

  // extract paragraphs
  var reg = /(?:<P class="C0\d(?:Titre\d)">(?:[\s\S]+?)<\/P>)?<P class="C0(?:\d)Point(?:numerote)?AltN">(?:(?:<A NAME="point(\d+)">)|(?:(\d+)))(?:[\s\S]+?)<\/P>(?:<P class="C\d\d(Niveau\dTitre\d|Tiretlong|Alinea(?:[^"][\s\S]*?)|Marge(?:[^"][\s\S]*?))">([\s\S]+?)<\/P>)*/gim;
  var allMatches = [];
  var match;
  while ((match = reg.exec(content)) !== null) {
    allMatches.push(match);
  }
  if (allMatches.length === 0) {
    // try the legacy pattern: <dt>3. <dd>bla bla
    // see REFTOLINK-2331
    var regLegacy = /<DT>(\d+)\.?\s?(?:<\/DT>)?(?:\r\n|\r|\n)?<DD>(?:<\/DD><\/DT>)?(?:[\s\S]+?)(?=(?:<P><P><P>)|(?:<p><\/p><p><\/p><p>)|(?:<DT>\d))/gim;
    while ((match = regLegacy.exec(content)) !== null) {
      allMatches.push(match);
    }
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
  var start = Number(paragraph);
  var end = paragraphEnd ? Number(paragraphEnd) : parseInt(paragraph);

  // we use Curia content for ECLI data so we try to extract using the Curia extractor
  var contents = extractParagraphRange(response, start, end);
  if (!contents) {
    // Curia extraction failed, try the legacy extractor
    var legacyRegex = /\s(name|id)="point\d/gi;
    if (!legacyRegex.test(response)) {
      contents = extractLegacyParagraphRange(response, start, end);
    }
  }
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
 * Extract a paragraph range from EUR-Lex content (old caselaw content)
 * @param {String} response 
 * @param {number} start 
 * @param {number} end 
 * @returns 
 */
function extractLegacyParagraphRange(response, start, end) {
  var doc = document.implementation.createHTMLDocument('virtual');
  var $el = (0,jquery.$)("<div>" + response + "</div>", doc);

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
  return resultString;
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
  var isCaselaw = celex.slice(0, 1) === "6";

  // N 03 or P3 04 05-07 08 ...  (only digits, dashes and spaces)
  var paragraphRegex = /^(?:N|P)\s?([0-9-\s\.]+)$/g;
  var matches = paragraphRegex.exec(fragment);
  if (Array.isArray(matches) && matches[1]) {
    var ref = matches[1];
    ref = ref.replace(/\s?-\s?/gi, "-").trim();
    var nums = ref.split(" ");
    nums = nums.map(function (num) {
      num = num.replace(/\d+/g, function (match) {
        return parseInt(match).toString();
      });
      return num;
    });
    var labels = ["par. ", "par. "];
    // sectors 1-5 use "N" for 'Annex'. Only sector 6 uses "N" for paragraphs.
    if (fragment.slice(0, 1) === "N" && celex && !isCaselaw) {
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
    parsed = (!isCaselaw ? "anx. " : "par. ") + (matchesP3[1] || '1');
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
      num = num.replace(/\d+/g, function (match) {
        return parseInt(match).toString();
      });
      return num;
    });
    parsed = (numsR.length < 2 ? "rct. " : "rct. ") + numsR.join(", ");
    return parsed;
  }

  // A02P1; A02P1LB; A13LBLDPT5
  var artRegex = /^A(\d+(?:BIS)?)(?:(?:P|\.)(\d+))?(?:L(\d+|[A-Z]))?(?:L(\d+|[A-Z]))?(?:PT(\d+|[A-Z]))?(?:T(\d+))?/g;
  var matchesArt = artRegex.exec(fragment);
  if (Array.isArray(matchesArt) && matchesArt[1]) {
    if (matchesArt[1].slice(0, 1) === '0') {
      matchesArt[1] = matchesArt[1].slice(1);
    }
    parsed = "art. " + matchesArt[1];
    if (matchesArt[2]) {
      parsed += " par. " + parseInt(matchesArt[2]);
    }
    if (matchesArt[3]) {
      // we use subpar. for letters and Al. for numeric values
      if (!isNaN(matchesArt[3])) {
        parsed += " al. " + matchesArt[3];
      } else {
        parsed += " subpar. " + String(matchesArt[3]).toLowerCase();
      }
    }
    if (matchesArt[4]) {
      parsed += " letter " + String(matchesArt[4]).toLowerCase();
    }
    if (matchesArt[5]) {
      parsed += " pnt. " + String(matchesArt[5]).toLowerCase();
    }
    if (matchesArt[6]) {
      parsed += " indent " + parseInt(matchesArt[6]);
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
  var query = getCelexNonCaselawQuery(celexIds, langISO3);
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
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
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
      format = format || 'application/json';

      // if all the CELEX ids are either sector 6 or NON sector 6, we can use ligher versions of the query
      var nonCaselawIds = celexIds.filter(function (c) {
        return c.slice(0, 1) !== '6';
      });
      var caselawIds = celexIds.filter(function (c) {
        return c.slice(0, 1) === '6';
      });
      var promises = [];
      if (caselawIds.length > 0) {
        var query = getCelexCaselawQuery(caselawIds, langISO3);
        promises.push((0,request/* getRequestPromise */.p2)(getEndpoint(LD_TYPE_CELEX), "POST", {
          query: query,
          format: format,
          origin: '*',
          target: LD_TARGET_CELLAR
        }, null, request/* HOOK_LINKED_DATA_REQ */.ms));
      }
      if (nonCaselawIds.length > 0) {
        var _query = getCelexNonCaselawQuery(nonCaselawIds, langISO3);
        promises.push((0,request/* getRequestPromise */.p2)(getEndpoint(LD_TYPE_CELEX), "POST", {
          query: _query,
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
        }));
      }
      return Promise.all(promises).then(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
          res1 = _ref2[0],
          res2 = _ref2[1];
        // merge results
        if (res1 && res2) {
          try {
            res1.head.vars = res1.head.vars.concat(res2.head.vars).filter(function (v, i, a) {
              return a.indexOf(v) === i;
            });
            res1.results.bindings = res1.results.bindings.concat(res2.results.bindings);
          } catch (e) {
            console.error(e);
          }
          return res1;
        } else {
          return res1;
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
      return this.getKMData(body, format);
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
    console.error(err);
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
    console.error(err);
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
    console.error(err);
    finlexEliIds.forEach(function (finlexEliId) {
      metadata[finlexEliId] = new Binding(null, LD_TYPE_FINLEX, SPARQL_STATUS_ERROR);
    });
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
    console.error(err);
    eliIds.forEach(function (eliId) {
      metadata[eliId] = new Binding(null, LD_TYPE_ELI, SPARQL_STATUS_ERROR);
    });
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
          if (binding.saveNumber && binding.saveNumber.value && binding.id.value !== binding.saveNumber.value) {
            metadata[binding.saveNumber.value] = new Binding(binding, binding.type.value, SPARQL_STATUS_SUCCESS);
          }
        }
      });
    }
    return metadata;
  })["catch"](function (err) {
    aresHandocIds.forEach(function (aresHandocId) {
      metadata[aresHandocId] = new Binding(null, LD_TYPE_HANDOC, SPARQL_STATUS_ERROR);
    });
    cisIds.forEach(function (cisId) {
      metadata[cisId] = new Binding(null, LD_TYPE_CIS, SPARQL_STATUS_ERROR);
    });
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
    procedureIds.forEach(function (procedureId) {
      metadata[procedureId] = new Binding(null, LD_TYPE_PROCEDURE, SPARQL_STATUS_ERROR);
    });
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
    natEcliIds.forEach(function (natEcliId) {
      metadata[natEcliId] = new Binding(null, LD_TYPE_NAT_ECLI, SPARQL_STATUS_ERROR);
    });
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
    consilIds.forEach(function (consilId) {
      metadata[consilId] = new Binding(null, LD_TYPE_CONSIL, SPARQL_STATUS_ERROR);
    });
    return metadata;
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
    console.error(err);
    //set false when failed to fetch metadata
    ojIds.forEach(function (ojId) {
      metadata[ojId] = new Binding(null, LD_TYPE_OJ, SPARQL_STATUS_ERROR);
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
    console.error(err);
    immcIds.forEach(function (immcId) {
      metadata[immcId] = new Binding(null, LD_TYPE_IMMC, SPARQL_STATUS_ERROR);
    });
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
  TD: () => (/* binding */ addStyle),
  cg: () => (/* binding */ bindTooltips),
  Gp: () => (/* binding */ getTriggers),
  Y3: () => (/* binding */ orderSorter),
  Ep: () => (/* binding */ resetTooltips)
});

// UNUSED EXPORTS: getTableViewReference, hideTooltipHandler, positionHandler, repositionTooltipHandler, showTooltipHandler

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
      // silent failure
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
var RULE_KEYMAP = {
  "casesensitive": "c",
  "converter": "cv",
  "forced": "f",
  "allowTitle": "at",
  "customTitle": "ct",
  "allowAttribute": "aa",
  "guard-pattern": "gp",
  "skip-pattern": "sp",
  "strict-pattern": "stp",
  "trim-pattern": "tp",
  "item-pattern": "ip",
  "itemForced": "g",
  "itemType": "y",
  "name": "n",
  "base": "bs",
  "order": "o",
  "pattern": "p",
  "ruleLibelle": "r",
  "baseLibelle": "bl",
  "type": "t",
  "baseType": "bt",
  "subtype": "st",
  "views": "v",
  "footnotes": "fo",
  "prefix": "lp",
  "skip": "lk",
  "shared": "ls",
  "slots": "sl",
  "ld": "ld",
  "coreIdentifiers": "cli",
  "identifiers": "li",
  "vars": "lv",
  "commonRules": "cr",
  "common": "cm"
};
var VIEW_KEYMAP = {
  "condition": "x",
  "ldCondition": "ldx",
  "groupTarget": "gt",
  "environments": "e",
  "libelle": "l",
  "order": "d",
  "target": "a",
  "baseTarget": "ba",
  "template": "m",
  "_default": "_"
};

/**
 * Ref2Link settings are stored in this variable, also accessible via the API at `R2L.settings`;
 */
var settings = {
  /**
   * The constants are parameters loaded from a compiled rules JSON file. They contain the rule patterns, language and view options.
   */
  constants: {
    'R2L_RULE_MAP': JSON.stringify(RULE_KEYMAP),
    'R2L_VIEW_MAP': JSON.stringify(VIEW_KEYMAP),
    'R2L_VIEW_OPTIONS': '{ "viewUsesTarget": true, "viewTitleSuffix": "", "viewTitlePrefix": "to", "linkClassName": "" }',
    'R2L_CSS_MAP': '{"ref2link.css":"LnJlZjJsaW5rLXRvb2x0aXAgewogICAgcG9zaXRpb246IGZpeGVkOwogICAgZGlzcGxheTogYmxvY2s7CiAgICBiYWNrZ3JvdW5kOiB3aGl0ZTsKICAgIGJvcmRlcjogMXB4IHNvbGlkICNlZWU7CiAgICB2aXNpYmlsaXR5OiB2aXNpYmxlOwogICAgcGFkZGluZzogMnB4OwogICAgY29sb3I6ICMzMzM7CiAgICBmb250LXNpemU6IDEuMXJlbTsKICAgIGN1cnNvcjogZGVmYXVsdDsKICAgIG92ZXJmbG93OiBoaWRkZW47CiAgICBtaW4td2lkdGg6IDE4cmVtOwogICAgbWF4LXdpZHRoOiAzMHJlbTsKICAgIC13ZWJraXQtYm94LXNoYWRvdzogMTBweCAxMHB4IDVweCAtNXB4IHJnYmEoMjgsIDI4LCAyOCwgMC41KTsKICAgIC1tb3otYm94LXNoYWRvdzogMTBweCAxMHB4IDVweCAtNXB4IHJnYmEoMjgsIDI4LCAyOCwgMC41KTsKICAgIGJveC1zaGFkb3c6IDEwcHggMTBweCA1cHggLTVweCByZ2JhKDI4LCAyOCwgMjgsIDAuNSk7Cn0KCi5yZWYybGluay10b29sdGlwIC50YWJsZSB7CiAgICBtYXJnaW4tYm90dG9tOiAwcHg7CiAgICBmb250LXNpemU6IDEycHg7CiAgICB3aWR0aDogMTAwJTsKICAgIGJvcmRlci1jb2xsYXBzZTogY29sbGFwc2U7Cn0KCi5yZWYybGluay10b29sdGlwIC5hY3RpdmUgdGQgewogICAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQgIWltcG9ydGFudDsKfQoKLnJlZjJsaW5rLXRvb2x0aXAgLnRhYmxlIC5yb3cgewogICAgYm9yZGVyLXRvcDogMXB4IHNvbGlkICNDRkNGQ0Y7CiAgICBtYXJnaW46IDAgMCA0cHggMDsKICAgIGN1cnNvcjogcG9pbnRlcjsKfQoKLnJlZjJsaW5rLXRvb2x0aXAgLnRhYmxlIC5yb3c6Zmlyc3Qtb2YtdHlwZSB7CiAgICBib3JkZXItdG9wOiBub25lICFpbXBvcnRhbnQ7Cn0KCi5yZWYybGluay10b29sdGlwIC50YWJsZSAucm93OjpiZWZvcmUgewogICAgY29udGVudDogbm9uZSAhaW1wb3J0YW50Owp9CgoucmVmMmxpbmstdG9vbHRpcCAudGFibGUgLnJvdz4qIHsKICAgIG92ZXJmbG93OiBoaWRkZW47Cn0KCi5yZWYybGluay10b29sdGlwIC50YWJsZSAucm93PnRkIHsKICAgIGJvcmRlci10b3A6IG5vbmU7CiAgICBsaW5lLWhlaWdodDogMjBweDsKICAgIHBhZGRpbmctdG9wOiAuNzVyZW07CiAgICBwYWRkaW5nLWJvdHRvbTogLjc1cmVtOwp9CgoucmVmMmxpbmstdG9vbHRpcCAucm93IC5jb2wteHMtMiB7CiAgICB3aWR0aDogMjVweDsKICAgIHRleHQtYWxpZ246IGNlbnRlcjsKfQoKLnJlZjJsaW5rLXRvb2x0aXAgLnJvdyAuY29sLXhzLTEwIHsKICAgIHdpZHRoOiBjYWxjKDEwMCUgLSAyNXB4KTsKfQoKLnJlZjJsaW5rLXRvb2x0aXAgLnJvd1tkYXRhLXN0YXRlPSIwIl0gLnIybC10b2dnbGUtaWNvbi1jb250YWluZXI6YWZ0ZXIgewogICAgY29udGVudDogIlwyNUI2IjsKfQoKLnJlZjJsaW5rLXRvb2x0aXAgLnJvd1tkYXRhLXN0YXRlPSIxIl0gLnIybC10b2dnbGUtaWNvbi1jb250YWluZXI6YWZ0ZXIgewogICAgY29udGVudDogIlwyNUJDIjsKfQoKLnJlZjJsaW5rLXRvb2x0aXAgdHIucm93W2RhdGEtZ3JvdXBdOm5vdChbZGF0YS1ncm91cD0iIl0pIC5jb2wteHMtMTAgewogICAgcGFkZGluZy1sZWZ0OiAyNXB4ICFpbXBvcnRhbnQ7Cn0KCi5yZWYybGluay10b29sdGlwIC50YWJsZS1oZWFkZXIgewogICAgY3Vyc29yOiBoZWxwOwp9CgoucmVmMmxpbmstdG9vbHRpcCAuaGVhZGluZyB7CiAgICBjdXJzb3I6IGRlZmF1bHQ7Cn0KCi5yZWYybGluay10b29sdGlwIC50YWJsZS1oZWFkZXI6aG92ZXIgewogICAgYmFja2dyb3VuZC1jb2xvcjogaW5oZXJpdCAhaW1wb3J0YW50Owp9CgoucmVmMmxpbmstdG9vbHRpcCBpW2RhdGEtYWN0aW9uPXByZXZpZXddIHsKICAgIG1pbi13aWR0aDogMjBweDsKICAgIHRleHQtYWxpZ246IGNlbnRlcjsKICAgIGhlaWdodDogMS41cmVtOwp9CgoucmVmMmxpbmstdG9vbHRpcCAuY29sLWFjdGlvbnM+KiwKLnJlZjJsaW5rLXRvb2x0aXAgaVtkYXRhLWFjdGlvbj1wcmV2aWV3XSwKLnJlZjJsaW5rLXRvb2x0aXAgaVtkYXRhLWZsYWddIHsKICAgIGRpc3BsYXk6IG5vbmU7Cn0KCi5yZWYybGluay10b29sdGlwIC5hY3RpdmUtaW5kaWNhdG9yOmhvdmVyIGlbZGF0YS1hY3Rpb249cHJldmlld10sCi5yZWYybGluay10b29sdGlwIC5hY3RpdmUgLmNvbC1hY3Rpb25zPi5ybC1saW5rLAoucmVmMmxpbmstdG9vbHRpcCAuYWN0aXZlLWluZGljYXRvcjpob3ZlciAuY29sLWFjdGlvbnM+LnJsLWxpbmssCi5yZWYybGluay10b29sdGlwIC5hY3RpdmUgW2RhdGEtZmxhZz1hY3RpdmVdIHsKICAgIGRpc3BsYXk6IGJsb2NrOwp9CgoucmVmMmxpbmstdG9vbHRpcCAuYWN0aXZlLWluZGljYXRvcjpob3ZlciBpW2RhdGEtYWN0aW9uPXByZXZpZXddIHsKICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTsKICAgIHJpZ2h0OiAwOwogICAgdG9wOiAwOwp9CgoucmVmMmxpbmstdG9vbHRpcCAudGFibGUrLnJlZjJsaW5rLXRvb2x0aXAgLnRhYmxlOmJlZm9yZSB7CiAgICBkaXNwbGF5OiBibG9jazsKICAgIGhlaWdodDogMTVweDsKICAgIGNvbnRlbnQ6ICIgIjsKICAgIGNsZWFyOiBib3RoOwp9CgovKiBMaW5rZWQgZGF0YSBDU1MgKi8KLnJlZjJsaW5rLXRvb2x0aXAgLmJpZyB7CiAgICBmb250LXNpemU6IDEzcHg7CiAgICBmb250LXdlaWdodDogNDAwOwogICAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkICNDRkNGQ0Y7Cn0KCi5yZWYybGluay10b29sdGlwIC5iaWc+dGQgewogICAgcGFkZGluZzogLjVyZW07Cn0KCi5yZWYybGluay10b29sdGlwIC5yMmwtdGl0bGUsCi5yZWYybGluay10b29sdGlwIC5yMmwtZm9yY2UgewogICAgd2hpdGUtc3BhY2U6IHByZS13cmFwOwp9CgoucmVmMmxpbmstdG9vbHRpcCAucjJsLWVsaSB7CiAgICBtYXJnaW4tdG9wOiA1cHg7Cn0KCi5yZWYybGluay10b29sdGlwIC5yMmwtZm9yY2VbZGF0YS1zdGF0dXM9JyddIHsKICAgIGRpc3BsYXk6IG5vbmU7Cn0KCi5yZWYybGluay10b29sdGlwIC5yMmwtZm9yY2UgLmJ1bGxldCB7CiAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2sgIWltcG9ydGFudDsKICAgIHdpZHRoOiAxMHB4OwogICAgaGVpZ2h0OiAxMHB4OwogICAgYm9yZGVyLXJhZGl1czogNTAlOwp9CgoucmVmMmxpbmstdG9vbHRpcCAucjJsLWZvcmNlIC5idWxsZXQ6YWZ0ZXIgewogICAgbWFyZ2luLWxlZnQ6IDVweDsKfQoKLnJlZjJsaW5rLXRvb2x0aXAgLnIybC1mb3JjZVtkYXRhLXN0YXR1cz1wZW5kaW5naW5mb3JjZV0gLmJ1bGxldCB7CiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjRURDQjA5Owp9CgoucmVmMmxpbmstdG9vbHRpcCAucjJsLWZvcmNlW2RhdGEtc3RhdHVzPWluZm9yY2VdIC5idWxsZXQgewogICAgYmFja2dyb3VuZC1jb2xvcjogIzYyOGU1NzsKfQoKLnJlZjJsaW5rLXRvb2x0aXAgLnIybC1mb3JjZVtkYXRhLXN0YXR1cz1ub3RpbmZvcmNlXSAuYnVsbGV0IHsKICAgIGJhY2tncm91bmQtY29sb3I6ICNDRkNGQ0Y7Cn0KCi5yZWYybGluay10b29sdGlwIC5yMmwtZm9yY2VbZGF0YS1zdGF0dXM9bm9sb25nZXJpbmZvcmNlXSAuYnVsbGV0IHsKICAgIGJhY2tncm91bmQtY29sb3I6ICNkYTIxMzA7Cn0KCi8qIHRpdGxlIHN0YXR1cyBDU1MgKi8KLnJlZjJsaW5rLXRvb2x0aXAgLnIybC10aXRsZS1zdGF0dXNbZGF0YS1zdGF0dXM9ZXJyb3JdIHsKICAgIGNvbG9yOiAjZGEyMTMwOwogICAgbWFyZ2luLXRvcDogNXB4Owp9CgoucmVmMmxpbmstdG9vbHRpcCAucjJsLXRpdGxlLXN0YXR1c1tkYXRhLXN0YXR1cz1wZW5kaW5nXSB7CiAgICBoZWlnaHQ6IDM1cHg7Cn0KCi5yZWYybGluay10b29sdGlwIC5yMmwtdGl0bGUtc3RhdHVzW2RhdGEtc3RhdHVzPWluZm9dIHsKICAgIG1hcmdpbi10b3A6IDVweDsKICAgIG9wYWNpdHk6IDAuNTsKfQoKLnIybC1sb2FkaW5nLWJhci1zcGlubmVyLnNwaW5uZXIgewogICAgd2lkdGg6IDIwcHg7CiAgICBoZWlnaHQ6IDIwcHg7CiAgICBtYXJnaW4tbGVmdDogLTM1cHg7CiAgICBkaXNwbGF5OiBpbmxpbmUtZmxleDsKICAgIGFuaW1hdGlvbjogbG9hZGluZy1iYXItc3Bpbm5lciA0MDBtcyBsaW5lYXIgaW5maW5pdGU7Cn0KCi5yMmwtbG9hZGluZy1iYXItc3Bpbm5lci5zcGlubmVyIC5zcGlubmVyLWljb24gewogICAgd2lkdGg6IDIwcHg7CiAgICBoZWlnaHQ6IDIwcHg7CiAgICBib3JkZXI6IHNvbGlkIDFweCB0cmFuc3BhcmVudDsKICAgIGJvcmRlci10b3AtY29sb3I6ICMwMDQ0OTQgIWltcG9ydGFudDsKICAgIGJvcmRlci1sZWZ0LWNvbG9yOiAjMDA0NDk0ICFpbXBvcnRhbnQ7CiAgICBib3JkZXItcmFkaXVzOiA1MCU7Cn0KCkBrZXlmcmFtZXMgbG9hZGluZy1iYXItc3Bpbm5lciB7CiAgICAwJSB7CiAgICAgICAgdHJhbnNmb3JtOiByb3RhdGUoMGRlZyk7CiAgICB9CgogICAgMTAwJSB7CiAgICAgICAgdHJhbnNmb3JtOiByb3RhdGUoMzYwZGVnKTsKICAgIH0KfQ=="}',
    'R2L_VERSION': '',
    'R2L_BUILD_INFO': '',
    'R2L_NAMED_PATTERNS': 'W10=',
    'R2L_TYPED_RULES': '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',
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
 * @param {Array<String>} ids - an aggregate list of CELEX/ECLI/ELI/HANDOC/CIS/PROC/CONSIL/IMMC ids
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
 * Remove targets that need filtering (ld-condition="ld-active") 
 * Used when LD is not available/enabled)
 * 
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
// EXTERNAL MODULE: ./src/lib/utils/base64.js
var base64 = __webpack_require__(910);
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
 * @deprecated
 * 
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
  var currentStyles = this.getConstant('R2L_CSS_MAP');
  if (!currentStyles || currentStyles === '{{R2L_CSS_MAP}}') {
    this.setConstant('R2L_CSS_MAP', constants.R2L_CSS_MAP);
    var cssMap = {};
    try {
      cssMap = JSON.parse(constants.R2L_CSS_MAP);
    } catch (e) {
      // silent failure
    }
    for (var cssIndex in cssMap) {
      (0,ux/* addStyle */.TD)(base64/* Base64 */.o.decode(cssMap[cssIndex]), cssIndex, jquery.$); // css injection
    }
  }
  this.version = this.version || constants.R2L_VERSION;
  this.build = this.build || constants.R2L_BUILD_INFO;
  this.setConstant('R2L_VERSION', constants.R2L_VERSION);
  this.setConstant('R2L_DEFAULT_LANG_ISO3', lang);
  this.setConstant('R2L_BUILD_INFO', constants.R2L_BUILD_INFO);
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
/* harmony import */ var _ux_index_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(246);
/* harmony import */ var _utils_converters_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(560);
/* harmony import */ var _utils_lzstring_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(34);
/* harmony import */ var _utils_list_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(577);
/* harmony import */ var _utils_functions_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(588);
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
    // non blocking error if the library is imoprted without the injected rules. 
    console.warn(e);
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
    var lookahead = (0,_utils_functions_js__WEBPACK_IMPORTED_MODULE_5__/* .getLookAhead */ .VC)(letterPattern);
    var lookbehind = (0,_utils_functions_js__WEBPACK_IMPORTED_MODULE_5__/* .getLookBehind */ .Wq)(letterPattern);
    return {
      'pattern': new RegExp('(?![\r\n\v\f])' + lookbehind + joinedPattern + lookahead, 'ig'),
      'rules': rules
    };
  };
  R2L.addRules = function (rules) {
    // Only IE11 lacks Regex negative lookbehind - still in use in Word2016
    var hasNegativeLookbehind = (0,_utils_functions_js__WEBPACK_IMPORTED_MODULE_5__/* .supportNegativeLookbehind */ .UJ)();
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
    this.addRules(JSON.parse(_utils_lzstring_js__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .A.decompressFromBase64(R2L.getConstant("R2L_TYPED_RULES"))));
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
    return _ref2linkRules || [];
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
            hasEnv = isPublic || !!(0,_utils_functions_js__WEBPACK_IMPORTED_MODULE_5__/* .intersect */ .y$)(filters.environments, _view.environments).length,
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
          views.sort(_ux_index_js__WEBPACK_IMPORTED_MODULE_2__/* .orderSorter */ .Y3);
          rules.push(rule);
        }
      }
    });
    rules.sort(_ux_index_js__WEBPACK_IMPORTED_MODULE_2__/* .orderSorter */ .Y3);
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
    var lookahead = (0,_utils_functions_js__WEBPACK_IMPORTED_MODULE_5__/* .getLookAhead */ .VC)(letterPattern);
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
        var searchRegExp = new RegExp((0,_utils_functions_js__WEBPACK_IMPORTED_MODULE_5__/* .regExpEscape */ .fI)(optimizer.searchSubpattern), 'g');
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
        var typePattern = '(' + (rule.forced && !R2L.options.enableSpecialRules ? '1jqgk' : (0,_utils_functions_js__WEBPACK_IMPORTED_MODULE_5__/* .regExpEscape */ .fI)(rule.type)) + ')';
        var simplifiedPattern = (0,_utils_functions_js__WEBPACK_IMPORTED_MODULE_5__/* .getNonCapturingPattern */ .T0)(rule.pattern.source || rule.pattern);
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
      rule.views.sort(_ux_index_js__WEBPACK_IMPORTED_MODULE_2__/* .orderSorter */ .Y3);
      rule.views.forEach(function (_view) {
        // use R2L.converters.* to prefix functions
        var converterNames = Object.keys(_utils_converters_js__WEBPACK_IMPORTED_MODULE_3__/* .converters */ .m).sort(function (a, b) {
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
        var listRef = (0,_utils_list_js__WEBPACK_IMPORTED_MODULE_6__/* .getListCore */ .Ku)(history[index].rule, history[index].matches);
        if (listRef.length > 0) {
          (0,_utils_list_js__WEBPACK_IMPORTED_MODULE_6__/* .cloneListCore */ .nH)(history[index], ref2link);
          (0,_utils_list_js__WEBPACK_IMPORTED_MODULE_6__/* .cloneListIdentifiers */ .ck)(history[index], ref2link);
          break;
        }
      }
      args = ref2link.matches;
    }

    /** Could be an inverted list so if the item still has no prefix/data don't bother */
    if (rule.isListItem) {
      var listRef = (0,_utils_list_js__WEBPACK_IMPORTED_MODULE_6__/* .getListCore */ .Ku)(rule, ref2link.matches);
      if (listRef.length === 0) {
        /** Cannot render item, we need to get to the end of the list */
        return ref2link;
      }
    }
    rule.views.sort(_ux_index_js__WEBPACK_IMPORTED_MODULE_2__/* .orderSorter */ .Y3);
    var contextObj = {
      data: {}
    };
    rule.views.forEach(function (_view) {
      var viewName = _view.target;
      var isEnabled = ((0,_utils_functions_js__WEBPACK_IMPORTED_MODULE_5__/* .intersect */ .y$)(R2L.filters.environments, _view.environments).length || _view.environments.indexOf('*') >= 0) && (!R2L.filters.targets || !R2L.filters.targets.length || R2L.filters.targets.indexOf(_view.target) >= 0) && (!R2L.filters.types || !R2L.filters.types.length || R2L.filters.types.indexOf(rule.type) >= 0);

      // Check if there are any custom target options to be applied
      var _currentViewAttributes = R2L.getViewAttributes(_view.baseTarget || _view.target);
      if (isEnabled && _view.condition.apply(contextObj, args)) {
        ref2link.views[viewName] = _view.template.apply(contextObj, args);

        // append the attributes of the view to the args so they can be subsequently reused
        var attributes = (0,_utils_functions_js__WEBPACK_IMPORTED_MODULE_5__/* .extractAttributes */ .pt)(Object.values(ref2link.views));
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
          $view.attr('id', 'r2l-' + (0,_utils_functions_js__WEBPACK_IMPORTED_MODULE_5__/* .getUuid */ .YJ)());
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
    if (R2L.getConstant("R2L_TYPED_RULES")) {
      R2L.addRules(JSON.parse(_utils_lzstring_js__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .A.decompressFromBase64(R2L.getConstant("R2L_TYPED_RULES"))));
    }
  } catch (e) {
    // failed to parse rules
    console.warn("Failed to parse 'R2L_TYPED_RULES'. Please provide a valid ruleset.");
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
  if (!_jquery_js__WEBPACK_IMPORTED_MODULE_0__.$.fn) {
    console.warn("Cannot bind JQuery fn");
    return;
  }

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
  var isBrowser = new Function("try { return this === window; } catch(e){ return false; }").call();
  R2L.getInitialFilters = function () {
    var filters = {};
    /** Only in browser env we try to read querystring params of the library */
    if (!isBrowser) {
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
  if (isBrowser) {
    // when document is ready reset the filters
    (0,lib_jquery.$)(R2L.resetFilters);
  }
}
// EXTERNAL MODULE: ./src/lib/ux/index.js + 1 modules
var ux = __webpack_require__(246);
// EXTERNAL MODULE: ./src/lib/alias/index.js + 1 modules
var alias = __webpack_require__(819);
;// ./src/base.js













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
lib/* R2L */.R.triggers = {};
bindFilters(lib/* R2L */.R);
bindFormatters(lib/* R2L */.R);
(0,rules/* bindRules */.$9)(lib/* R2L */.R);

/** expose linked data methods on top level API */
lib/* R2L */.R.getCelexData = lib/* R2L */.R.ldm.getCelexData.bind(lib/* R2L */.R.ldm);
lib/* R2L */.R.getEliData = lib/* R2L */.R.ldm.getEliData.bind(lib/* R2L */.R.ldm);
lib/* R2L */.R.getAresData = lib/* R2L */.R.ldm.getAresData.bind(lib/* R2L */.R.ldm);
lib/* R2L */.R.getActsCitedByAct = lib/* R2L */.R.ldm.getActsCitedByAct.bind(lib/* R2L */.R.ldm);
lib/* R2L */.R.getActsCitingAct = lib/* R2L */.R.ldm.getActsCitingAct.bind(lib/* R2L */.R.ldm);
lib/* R2L */.R.getBasisActsByAct = lib/* R2L */.R.ldm.getBasisActsByAct.bind(lib/* R2L */.R.ldm);
lib/* R2L */.R.getActsByBasisAct = lib/* R2L */.R.ldm.getActsByBasisAct.bind(lib/* R2L */.R.ldm);
lib/* R2L */.R.getEurlexContent = lib/* R2L */.R.ldm.getEurlexContent.bind(lib/* R2L */.R.ldm);
(0,jquery/* bindJquery */.a8)(lib/* R2L */.R);
if (isBrowser) {
  lib/* R2L */.R.triggers = (0,ux/* getTriggers */.Gp)(lib/* R2L */.R);

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
  global.btoa = function (str) {
    return Buffer.from(str).toString('base64');
  };
  global.R2L = lib/* R2L */.R;
}
/* harmony default export */ const base = (lib/* R2L */.R);
;// ./src/index.js


/**
 * Will bootstrap the Ref2Link library in the environment it's been loaded (server-side or client-side).
 */
var src_isBrowser = new Function("try { return this === window; } catch(e){ return false; }").call();
if (!src_isBrowser) {
  /** Server-side bindings */
  module.exports = {
    ref2link: base
  };
  global.btoa = function (str) {
    return Buffer.from(str).toString('base64');
  };
  global.R2L = base;
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
//ADDED FOR LEOS LOADING: END