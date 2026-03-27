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
/* harmony import */ var _manager_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(741);
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

/***/ 154:
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
// EXTERNAL MODULE: ./src/lib/manager/index.js + 20 modules
var manager = __webpack_require__(741);
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
 * @returns {Object|null} binding
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
 * @returns {Object|null} binding
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
var resolveExternalDecisionNumber = function resolveExternalDecisionNumber(matches) {
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
 * @returns {Object|null} binding
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
    filters += "(REGEX(?title_, '\\\\bRegulation[\u202F\xA0 ]No[\u202F\xA0 ]".concat(attributesList[i].number, "\\\\b', \"i\"))");
  }
  var query = "\nPREFIX cdm:<http://publications.europa.eu/ontology/cdm#>\nPREFIX owl:<http://www.w3.org/2002/07/owl#>\nPREFIX lang:<http://publications.europa.eu/resource/authority/language/>\n        \nSELECT DISTINCT \n    ?workId as ?id\n    ?title_ as ?title\n    ?eli    \n    ?date\nWHERE {  \n    graph ?ge { \n        ?exp cdm:expression_belongs_to_work ?s .\n        ?exp cdm:expression_title ?title_\n    }\n    graph ?g { \n        ?exp cdm:expression_uses_language ?lang\n        filter(?lang=lang:ENG).  \n    } \n    ?s cdm:resource_legal_eli ?eli.\n    ?s cdm:resource_legal_type ?type .\n    ?s cdm:work_date_document ?date .\n    ?s cdm:work_created_by_agent <http://publications.europa.eu/resource/authority/corporate-body/UNECE> . \n    ?s cdm:work_id_document ?workId . \n    FILTER (".concat(filters, ") \n    FILTER (?type='X'^^xsd:string)\n    FILTER (STRSTARTS( ?workId, \"celex:\"))\n}\nORDER BY DESC(?date)    \n");
  return query;
}

/**
 * Find the best binding to use for the match.
 * 
 * @param {String} match
 * @param {Array} bindings
 * 
 * @returns {Object|null} binding
 */
function united_nations_reg_findOptimalBinding(match, attributes, bindings) {
  // find the reference number eg. "Regulation No 155"
  // return first element
  return bindings.find(function (binding) {
    return (0,utils/* sanitize */.aj)(binding.title.value).match("^(UN )?Regulation No " + attributes["data-ref-no"] + "\\b");
  });
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
  var query = "\n    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n    PREFIX cdm:<http://publications.europa.eu/ontology/cdm#>\n    PREFIX skos:<http://www.w3.org/2004/02/skos/core#>\n    PREFIX dc:<http://purl.org/dc/elements/1.1/>\n    PREFIX lang:<http://publications.europa.eu/resource/authority/language/>\n    PREFIX xsd:<http://www.w3.org/2001/XMLSchema#>\n    PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n    PREFIX owl:<http://www.w3.org/2002/07/owl#>\n\n    SELECT DISTINCT \n        ?workId as ?id \n        ?ojDatePublication\n        ?year\n        ?natNumber\n        ?eli\n    WHERE {  \n        graph ?ge { \n            ?exp cdm:expression_belongs_to_work ?s .\n            ?exp cdm:expression_title ?title_\n        } \n        ?s cdm:resource_legal_year ?year .\n        ?s cdm:resource_legal_number_natural ?natNumber .\n        ?s cdm:work_id_document ?workId.\n        ?s cdm:resource_legal_eli ?eli .\n        OPTIONAL {\n            ?s cdm:resource_legal_published_in_official-journal ?q .\n            ?q cdm:publication_general_date_publication ?ojDatePublicationOld .\n        }\n        OPTIONAL {\n            ?s cdm:official-journal-act_date_publication ?ojDatePublicationNew .\n        }\n        BIND(IF(BOUND(?ojDatePublicationOld), ?ojDatePublicationOld, ?ojDatePublicationNew) as ?ojDatePublication)\n\n        FILTER (".concat(filters, ") \n}");
  return query;
}

/**
 * Find the best binding to use for the match.
 * 
 * @param {Object} attributes
 * @param {Array} bindings
 * 
 * @returns {Object|null} binding
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
 * Will query Cellar to retrieve the ELI of the act behind an ECB reference eg. `ECB/2013/52` - REFTOLINK-1978
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
var resolveEcbGuidelineCelex = function resolveEcbGuidelineCelex(matches) {
  // check if we have ECB guideline acts to avoid querying CELLAR for no reason
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
 * @returns {Object|null} binding
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
;// ./src/lib/transformers/placeholders/rules/eurlex/ecb_dec_eli.js




/**
 * Will query Cellar to handle ECB decisions prior to 2020 which had their own register
 * 
 * 
 * @param {Object} matches
 * @returns {Promise<Object>} matches 
 */
var resolveEcbDecisions = function resolveEcbDecisions(matches) {
  var foundElis = extractElis(matches);
  console.debug("Potentially invalid ELI decisions", foundElis);
  if (foundElis.length === 0) {
    return Promise.resolve(matches);
  }
  var query = ecb_dec_eli_getQuery();
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

    // collect ELIs again because they might have been modified by another transformer

    var foundElis = extractElis(matches);
    Object.keys(matches).forEach(function (key) {
      matches[key].offsets.forEach(function (offset) {
        var eliUrl;
        if (offset.rule.ld.indexOf(utils/* LD_CELLAR_ECB_CELEX */.ud) === -1) {
          return;
        }
        offset.alternatives.forEach(function (alternative) {
          var extractedUrl = extractEliDecisionUrl(alternative.view);
          if (extractedUrl) {
            eliUrl = extractedUrl;
          }
        });
        if (!eliUrl || foundElis.indexOf(eliUrl) === -1) {
          return;
        }
        var optimalBinding = ecb_dec_eli_findOptimalBinding(eliUrl, bindings);
        if (!optimalBinding) {
          return;
        }
        var eliParts = eliUrl.split("/");
        var lastSegment = "/" + eliParts[eliParts.length - 1];
        offset.alternatives.forEach(function (alternative) {
          // replace CELEX AND ELI potentially (if there is a sub-number) from binding

          // replace `data-ref-celex="*"' 
          alternative.view = alternative.view.replace(/data-ref-celex=".+?"/, 'data-ref-celex="' + String(optimalBinding.id.value).replace("celex:", "") + '"');

          // replace `href="{ELI}" but keep last segment (/oj or /point-in-time)
          alternative.view = alternative.view.replace(/href=".+?"/, 'href="' + String(optimalBinding.eli.value).replace(/\/oj$/, lastSegment) + '"');
        });
        Object.keys(offset.views).forEach(function (viewKey) {
          offset.views[viewKey] = offset.views[viewKey].replace(/data-ref-celex=".+?"/, 'data-ref-celex="' + String(optimalBinding.id.value).replace("celex:", "") + '"');
          offset.views[viewKey] = offset.views[viewKey].replace(/href=".+?"/, 'href="' + String(optimalBinding.eli.value).replace(/\/oj$/, lastSegment) + '"');
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
 * Query all acts at once 
 * @returns {String}
 */
function ecb_dec_eli_getQuery() {
  var query = "\nPREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\nPREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\nPREFIX cdm:<http://publications.europa.eu/ontology/cdm#>\nPREFIX skos:<http://www.w3.org/2004/02/skos/core#>\nPREFIX dc:<http://purl.org/dc/elements/1.1/>\nPREFIX lang:<http://publications.europa.eu/resource/authority/language/>\nPREFIX xsd:<http://www.w3.org/2001/XMLSchema#>\nPREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>\nPREFIX owl:<http://www.w3.org/2002/07/owl#>\n\nSELECT DISTINCT \n    ?workId as ?id \n    ?eli\n    ?no\n    ?celexNo\n    ?title\nWHERE {  \n    ?exp cdm:expression_belongs_to_work ?s .\n    ?exp cdm:expression_title ?title .\n    ?exp cdm:expression_uses_language ?lang\n    filter(?lang=lang:ENG).  \n    OPTIONAL {\n        ?s cdm:resource_legal_eli ?eli .\n    }\n\n    {\n        ?s cdm:work_id_document ?workId. \n        ?s cdm:resource_legal_type \"D\"^^xsd:string .\n        ?s cdm:resource_legal_number_natural_celex ?celexNo .\n        ?s cdm:resource_legal_number_natural ?no .\n        ?s cdm:work_created_by_agent <http://publications.europa.eu/resource/authority/corporate-body/ECB>\n        FILTER (REGEX(?workId, \"^celex:3\"))\n    }   \n}";
  return query;
}

/**
 * Find the best binding to use for the match.
 * 
 * @param {String} eliUrl
 * @param {Array} bindings
 * 
 * @returns {Object|null} binding
 */
function ecb_dec_eli_findOptimalBinding(eliUrl, bindings) {
  var regexMatches = /((https?:\/\/data\.europa\.eu\/eli\/dec\/\d+\/\d+).+?)/.exec(eliUrl);
  var eliUrlRoot = regexMatches ? regexMatches[2] : null;
  if (!eliUrlRoot) {
    return null;
  }

  /**
   * There are a few exceptions where the ELI does not match the year number in the reference. Example:
   * '2014/55/EU: Decision of the European Central Bank of 27 December 2013' => http://data.europa.eu/eli/dec/2013/55(2)/oj
   */
  if (CUSTOM_ELI_ECB_MAP[eliUrlRoot]) {
    eliUrlRoot = CUSTOM_ELI_ECB_MAP[eliUrlRoot].split("(")[0];
  }
  return bindings.filter(function (binding) {
    return binding.eli.value.indexOf(eliUrlRoot) === 0 && ["(", "/"].indexOf(String(binding.eli.value).slice(eliUrlRoot.length, eliUrlRoot.length + 1)) > -1;
  }).pop();
}
function extractEliDecisionUrl(view) {
  var regexMatches = /href="((https?:\/\/data\.europa\.eu\/eli\/dec\/\d+\/\d+).+?)"/.exec(view);
  return regexMatches ? regexMatches[1] : null;
}

/**
 * Extract the ELI urls that can be invalid
 * @param {Object} matches 
 * @returns {Array<String>} array of ELIs that could be ECB decisions 
 */
function extractElis(matches) {
  var ecbPattern = R2L.getConverterRules().filter(function (r) {
    return r.type === 'label_ecb';
  })[0].pattern;

  // get all ELIs first to see if there is a need to query
  var foundElis = [];
  Object.keys(matches).forEach(function (key) {
    matches[key].offsets.forEach(function (offset) {
      // we only process rules with this linked data marking 
      if (offset.rule.ld.indexOf(utils/* LD_CELLAR_ECB_CELEX */.ud) === -1) {
        return;
      }

      // we check that the matched reference contains ECB
      ecbPattern.lastIndex = 0;
      if (!ecbPattern.test(offset.context)) {
        return;
      }

      // we check that the ELI is a decision
      offset.alternatives.forEach(function (alternative) {
        var eliUrl = extractEliDecisionUrl(alternative.view);
        if (eliUrl) {
          foundElis.push(eliUrl);
        }
      });
    });
  });
  return foundElis;
}

// Exceptions
var CUSTOM_ELI_ECB_MAP = {
  "http://data.europa.eu/eli/dec/2014/34": "http://data.europa.eu/eli/dec/2013/34(3)",
  "http://data.europa.eu/eli/dec/2016/188": "http://data.europa.eu/eli/dec/2015/188",
  "http://data.europa.eu/eli/dec/2016/187": "http://data.europa.eu/eli/dec/2015/187",
  "http://data.europa.eu/eli/dec/2014/29": "http://data.europa.eu/eli/dec/2013/29(2)",
  "http://data.europa.eu/eli/dec/2014/31": "http://data.europa.eu/eli/dec/2013/31(3)",
  "http://data.europa.eu/eli/dec/2016/244": "http://data.europa.eu/eli/dec/2015/244",
  "http://data.europa.eu/eli/dec/2016/3": "http://data.europa.eu/eli/dec/2015/3",
  "http://data.europa.eu/eli/dec/2014/30": "http://data.europa.eu/eli/dec/2013/30(2)",
  "http://data.europa.eu/eli/dec/2016/21": "http://data.europa.eu/eli/dec/2015/21",
  "http://data.europa.eu/eli/dec/2014/33": "http://data.europa.eu/eli/dec/2013/33(3)",
  "http://data.europa.eu/eli/dec/2014/28": "http://data.europa.eu/eli/dec/2013/28(3)",
  "http://data.europa.eu/eli/dec/2014/106": "http://data.europa.eu/eli/dec/2013/106(3)",
  "http://data.europa.eu/eli/dec/2014/55": "http://data.europa.eu/eli/dec/2013/55(2)",
  "http://data.europa.eu/eli/dec/2014/4": "http://data.europa.eu/eli/dec/2013/4(3)",
  "http://data.europa.eu/eli/dec/2014/32": "http://data.europa.eu/eli/dec/2013/32(3)"
};
;// ./src/lib/transformers/index.js














/**
 * Will settle (fill or remove) CELEX and ELI placeholders {{ LD:CELLAR:NUMBER:CELEX}}, {{ LD:CELLAR:SUBNUMBER:CELEX }} in case of ambiguos identifiers
 * `Decision No 70/2008/EC` will resolve to CELEX id `32008D0070(01)` and ELI `/eli/dec/2008/70(1)/oj`
 * The filling is done by looking up information on the matched text in Cellar and resolving the ambiguity
 * 
 * @param {Object} matches - result map produced by the detection
 * @returns {Promise<Object>} - corrected `matches` result map
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
    return resolveEcbGuidelineCelex(matches);
  });
}

/**
 * Resolve CELEX subnumber placeholders eg: 32008D0070 {{ (01) }}
 * @param {Object} matches
 * @returns {Promise<Object>} 
 */
function fillCelexSubnumberPlaceholders(matches) {
  // the ECB Decisions resolver must run before
  return resolveEcbDecisions(matches).then(function (matches) {
    return resolveCelexSubnumber(matches);
  });
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
  return resolveExternalDecisionNumber(matches);
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
  if (!currentStyles || currentStyles === '{"ref2link.css":"LnJlZjJsaW5rLXRvb2x0aXAgewogICAgcG9zaXRpb246IGZpeGVkOwogICAgZGlzcGxheTogYmxvY2s7CiAgICBiYWNrZ3JvdW5kOiB3aGl0ZTsKICAgIGJvcmRlcjogMXB4IHNvbGlkICNlZWU7CiAgICB2aXNpYmlsaXR5OiB2aXNpYmxlOwogICAgcGFkZGluZzogMnB4OwogICAgY29sb3I6ICMzMzM7CiAgICBmb250LXNpemU6IDEuMXJlbTsKICAgIGN1cnNvcjogZGVmYXVsdDsKICAgIG92ZXJmbG93OiBoaWRkZW47CiAgICBtaW4td2lkdGg6IDE4cmVtOwogICAgbWF4LXdpZHRoOiAzMHJlbTsKICAgIC13ZWJraXQtYm94LXNoYWRvdzogMTBweCAxMHB4IDVweCAtNXB4IHJnYmEoMjgsIDI4LCAyOCwgMC41KTsKICAgIC1tb3otYm94LXNoYWRvdzogMTBweCAxMHB4IDVweCAtNXB4IHJnYmEoMjgsIDI4LCAyOCwgMC41KTsKICAgIGJveC1zaGFkb3c6IDEwcHggMTBweCA1cHggLTVweCByZ2JhKDI4LCAyOCwgMjgsIDAuNSk7Cn0KCi5yZWYybGluay10b29sdGlwIC50YWJsZSB7CiAgICBtYXJnaW4tYm90dG9tOiAwcHg7CiAgICBmb250LXNpemU6IDEycHg7CiAgICB3aWR0aDogMTAwJTsKICAgIGJvcmRlci1jb2xsYXBzZTogY29sbGFwc2U7Cn0KCi5yZWYybGluay10b29sdGlwIC5hY3RpdmUgdGQgewogICAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQgIWltcG9ydGFudDsKfQoKLnJlZjJsaW5rLXRvb2x0aXAgLnRhYmxlIC5yb3cgewogICAgYm9yZGVyLXRvcDogMXB4IHNvbGlkICNDRkNGQ0Y7CiAgICBtYXJnaW46IDAgMCA0cHggMDsKICAgIGN1cnNvcjogcG9pbnRlcjsKfQoKLnJlZjJsaW5rLXRvb2x0aXAgLnRhYmxlIC5yb3c6Zmlyc3Qtb2YtdHlwZSB7CiAgICBib3JkZXItdG9wOiBub25lICFpbXBvcnRhbnQ7Cn0KCi5yZWYybGluay10b29sdGlwIC50YWJsZSAucm93OjpiZWZvcmUgewogICAgY29udGVudDogbm9uZSAhaW1wb3J0YW50Owp9CgoucmVmMmxpbmstdG9vbHRpcCAudGFibGUgLnJvdz4qIHsKICAgIG92ZXJmbG93OiBoaWRkZW47Cn0KCi5yZWYybGluay10b29sdGlwIC50YWJsZSAucm93PnRkIHsKICAgIGJvcmRlci10b3A6IG5vbmU7CiAgICBsaW5lLWhlaWdodDogMjBweDsKICAgIHBhZGRpbmctdG9wOiAuNzVyZW07CiAgICBwYWRkaW5nLWJvdHRvbTogLjc1cmVtOwp9CgoucmVmMmxpbmstdG9vbHRpcCAucm93IC5jb2wteHMtMiB7CiAgICB3aWR0aDogMjVweDsKICAgIHRleHQtYWxpZ246IGNlbnRlcjsKfQoKLnJlZjJsaW5rLXRvb2x0aXAgLnJvdyAuY29sLXhzLTEwIHsKICAgIHdpZHRoOiBjYWxjKDEwMCUgLSAyNXB4KTsKfQoKLnJlZjJsaW5rLXRvb2x0aXAgLnJvd1tkYXRhLXN0YXRlPSIwIl0gLnIybC10b2dnbGUtaWNvbi1jb250YWluZXI6YWZ0ZXIgewogICAgY29udGVudDogIlwyNUI2IjsKfQoKLnJlZjJsaW5rLXRvb2x0aXAgLnJvd1tkYXRhLXN0YXRlPSIxIl0gLnIybC10b2dnbGUtaWNvbi1jb250YWluZXI6YWZ0ZXIgewogICAgY29udGVudDogIlwyNUJDIjsKfQoKLnJlZjJsaW5rLXRvb2x0aXAgdHIucm93W2RhdGEtZ3JvdXBdOm5vdChbZGF0YS1ncm91cD0iIl0pIC5jb2wteHMtMTAgewogICAgcGFkZGluZy1sZWZ0OiAyNXB4ICFpbXBvcnRhbnQ7Cn0KCi5yZWYybGluay10b29sdGlwIC50YWJsZS1oZWFkZXIgewogICAgY3Vyc29yOiBoZWxwOwp9CgoucmVmMmxpbmstdG9vbHRpcCAuaGVhZGluZyB7CiAgICBjdXJzb3I6IGRlZmF1bHQ7Cn0KCi5yZWYybGluay10b29sdGlwIC50YWJsZS1oZWFkZXI6aG92ZXIgewogICAgYmFja2dyb3VuZC1jb2xvcjogaW5oZXJpdCAhaW1wb3J0YW50Owp9CgoucmVmMmxpbmstdG9vbHRpcCBpW2RhdGEtYWN0aW9uPXByZXZpZXddIHsKICAgIG1pbi13aWR0aDogMjBweDsKICAgIHRleHQtYWxpZ246IGNlbnRlcjsKICAgIGhlaWdodDogMS41cmVtOwp9CgoucmVmMmxpbmstdG9vbHRpcCAuY29sLWFjdGlvbnM+KiwKLnJlZjJsaW5rLXRvb2x0aXAgaVtkYXRhLWFjdGlvbj1wcmV2aWV3XSwKLnJlZjJsaW5rLXRvb2x0aXAgaVtkYXRhLWZsYWddIHsKICAgIGRpc3BsYXk6IG5vbmU7Cn0KCi5yZWYybGluay10b29sdGlwIC5hY3RpdmUtaW5kaWNhdG9yOmhvdmVyIGlbZGF0YS1hY3Rpb249cHJldmlld10sCi5yZWYybGluay10b29sdGlwIC5hY3RpdmUgLmNvbC1hY3Rpb25zPi5ybC1saW5rLAoucmVmMmxpbmstdG9vbHRpcCAuYWN0aXZlLWluZGljYXRvcjpob3ZlciAuY29sLWFjdGlvbnM+LnJsLWxpbmssCi5yZWYybGluay10b29sdGlwIC5hY3RpdmUgW2RhdGEtZmxhZz1hY3RpdmVdIHsKICAgIGRpc3BsYXk6IGJsb2NrOwp9CgoucmVmMmxpbmstdG9vbHRpcCAuYWN0aXZlLWluZGljYXRvcjpob3ZlciBpW2RhdGEtYWN0aW9uPXByZXZpZXddIHsKICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTsKICAgIHJpZ2h0OiAwOwogICAgdG9wOiAwOwp9CgoucmVmMmxpbmstdG9vbHRpcCAudGFibGUrLnJlZjJsaW5rLXRvb2x0aXAgLnRhYmxlOmJlZm9yZSB7CiAgICBkaXNwbGF5OiBibG9jazsKICAgIGhlaWdodDogMTVweDsKICAgIGNvbnRlbnQ6ICIgIjsKICAgIGNsZWFyOiBib3RoOwp9CgovKiBMaW5rZWQgZGF0YSBDU1MgKi8KLnJlZjJsaW5rLXRvb2x0aXAgLmJpZyB7CiAgICBmb250LXNpemU6IDEzcHg7CiAgICBmb250LXdlaWdodDogNDAwOwogICAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkICNDRkNGQ0Y7Cn0KCi5yZWYybGluay10b29sdGlwIC5iaWc+dGQgewogICAgcGFkZGluZzogLjVyZW07Cn0KCi5yZWYybGluay10b29sdGlwIC5yMmwtdGl0bGUsCi5yZWYybGluay10b29sdGlwIC5yMmwtZm9yY2UgewogICAgd2hpdGUtc3BhY2U6IHByZS13cmFwOwp9CgoucmVmMmxpbmstdG9vbHRpcCAucjJsLWVsaSB7CiAgICBtYXJnaW4tdG9wOiA1cHg7Cn0KCi5yZWYybGluay10b29sdGlwIC5yMmwtZm9yY2VbZGF0YS1zdGF0dXM9JyddIHsKICAgIGRpc3BsYXk6IG5vbmU7Cn0KCi5yZWYybGluay10b29sdGlwIC5yMmwtZm9yY2UgLmJ1bGxldCB7CiAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2sgIWltcG9ydGFudDsKICAgIHdpZHRoOiAxMHB4OwogICAgaGVpZ2h0OiAxMHB4OwogICAgYm9yZGVyLXJhZGl1czogNTAlOwp9CgoucmVmMmxpbmstdG9vbHRpcCAucjJsLWZvcmNlIC5idWxsZXQ6YWZ0ZXIgewogICAgbWFyZ2luLWxlZnQ6IDVweDsKfQoKLnJlZjJsaW5rLXRvb2x0aXAgLnIybC1mb3JjZVtkYXRhLXN0YXR1cz1wZW5kaW5naW5mb3JjZV0gLmJ1bGxldCB7CiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjRURDQjA5Owp9CgoucmVmMmxpbmstdG9vbHRpcCAucjJsLWZvcmNlW2RhdGEtc3RhdHVzPWluZm9yY2VdIC5idWxsZXQgewogICAgYmFja2dyb3VuZC1jb2xvcjogIzYyOGU1NzsKfQoKLnJlZjJsaW5rLXRvb2x0aXAgLnIybC1mb3JjZVtkYXRhLXN0YXR1cz1ub3RpbmZvcmNlXSAuYnVsbGV0IHsKICAgIGJhY2tncm91bmQtY29sb3I6ICNDRkNGQ0Y7Cn0KCi5yZWYybGluay10b29sdGlwIC5yMmwtZm9yY2VbZGF0YS1zdGF0dXM9bm9sb25nZXJpbmZvcmNlXSAuYnVsbGV0IHsKICAgIGJhY2tncm91bmQtY29sb3I6ICNkYTIxMzA7Cn0KCi8qIHRpdGxlIHN0YXR1cyBDU1MgKi8KLnJlZjJsaW5rLXRvb2x0aXAgLnIybC10aXRsZS1zdGF0dXNbZGF0YS1zdGF0dXM9ZXJyb3JdIHsKICAgIGNvbG9yOiAjZGEyMTMwOwogICAgbWFyZ2luLXRvcDogNXB4Owp9CgoucmVmMmxpbmstdG9vbHRpcCAucjJsLXRpdGxlLXN0YXR1c1tkYXRhLXN0YXR1cz1wZW5kaW5nXSB7CiAgICBoZWlnaHQ6IDM1cHg7Cn0KCi5yZWYybGluay10b29sdGlwIC5yMmwtdGl0bGUtc3RhdHVzW2RhdGEtc3RhdHVzPWluZm9dIHsKICAgIG1hcmdpbi10b3A6IDVweDsKICAgIG9wYWNpdHk6IDAuNTsKfQoKLnIybC1sb2FkaW5nLWJhci1zcGlubmVyLnNwaW5uZXIgewogICAgd2lkdGg6IDIwcHg7CiAgICBoZWlnaHQ6IDIwcHg7CiAgICBtYXJnaW4tbGVmdDogLTM1cHg7CiAgICBkaXNwbGF5OiBpbmxpbmUtZmxleDsKICAgIGFuaW1hdGlvbjogbG9hZGluZy1iYXItc3Bpbm5lciA0MDBtcyBsaW5lYXIgaW5maW5pdGU7Cn0KCi5yMmwtbG9hZGluZy1iYXItc3Bpbm5lci5zcGlubmVyIC5zcGlubmVyLWljb24gewogICAgd2lkdGg6IDIwcHg7CiAgICBoZWlnaHQ6IDIwcHg7CiAgICBib3JkZXI6IHNvbGlkIDFweCB0cmFuc3BhcmVudDsKICAgIGJvcmRlci10b3AtY29sb3I6ICMwMDQ0OTQgIWltcG9ydGFudDsKICAgIGJvcmRlci1sZWZ0LWNvbG9yOiAjMDA0NDk0ICFpbXBvcnRhbnQ7CiAgICBib3JkZXItcmFkaXVzOiA1MCU7Cn0KCkBrZXlmcmFtZXMgbG9hZGluZy1iYXItc3Bpbm5lciB7CiAgICAwJSB7CiAgICAgICAgdHJhbnNmb3JtOiByb3RhdGUoMGRlZyk7CiAgICB9CgogICAgMTAwJSB7CiAgICAgICAgdHJhbnNmb3JtOiByb3RhdGUoMzYwZGVnKTsKICAgIH0KfQ=="}') {
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
// EXTERNAL MODULE: ./src/lib/manager/index.js + 20 modules
var manager = __webpack_require__(741);
// EXTERNAL MODULE: ./src/lib/index.js + 16 modules
var lib = __webpack_require__(154);
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
    'R2L_CSS_MAP': '{{R2L_CSS_MAP}}',
    'R2L_VERSION': '',
    'R2L_BUILD_INFO': '',
    'R2L_NAMED_PATTERNS': 'W10=',
    'R2L_TYPED_RULES': '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oOWjvjKskFI61b4x3hAMVAE4BdAJADwcg5aEGGqOygOPGrCpKapmq5q3OKarpg9wp6Jlifok5JhiBlxw0POKGVmKcKupwtd8KmcoormXG6uNLyqyivXKeKyqsvVf5YSvOqqPOCmXdLitiNer7iy6EeLRKoEozl9K36oWCVK14ParC5Sn0vUVs8kG0qmgTUuABGA5EtBKYNcEtcq8SryodKV3J0rpLuvfGuP9CaktycqBKnErcqCSzyuv97S8yv289yPyuJq1/EKvpDmai6TCrH/CKpnjFPRaoDoA4wtDC5tPJHxSLOSIqu2K7qs0vFqgNIUJ4qaq+VzqrZA/TXvjAy1wpxBunVqoD9IypPy8pe3LwLarkXS8qrkWg/QqSk6qbpz6rEy0wrEhIeXLjwB/5LTx3g7oUzlRBX5VqKzLPFLkq/gepJ2sWAXazatGLtq4fx6IbawhXyDPax2oaIXa06roqXgxGt0rdibUuYrWK0qqipJasWoeq9i1OstLsSifzeqzioGtwrLixSrBq//JVhkqPq2z319Qazf1IiIapoDUroa5ypU4tKn9RjqkalGsW80avp0xrjK7GtprHShEsZrJnOytt8HKqktJrsSoyqGdKa3urhKXHemsRD/KikNZqBXfh0RD2awzk5qEZRT2PQd60ogTU7am2q9qI6vIkmrKAJeOCpoEjOtYCtfet2BKcQCJ2m9wnKMnhAbfSQN9K4EhquDjKioMsPUCSerg0KNai8qjKrylot1BYy2CMiI/682utBTClsEh5vjELnfK1aLkH+0MibAERAw3BBp/A/y5Br/ksyCAHQa/agsoLidq6kCwakG03P+0o6gwHLqpynEGur06n6sYbly5hvK9M6w4rJqc6mYHer86i6uo8i66uqkr/q+slkqdKsSrg8BGxuuFJa6+urNKpGkaThqAS3hs+q9KyRrJrJ6kyupriS2epNIrK23xsqqS4eovtR6zEp/90ajUg0bp6rRrMqdG1F3JLB6swOXqS3VeqpL16xkuxCt6nsnIacGyhurKCG+EBwc2QQDB1peyReUvriircuqrdy+WvKKlao8q812SWT11rAG6jwNr7uI2pvK34xJugaTCosCYhIeDTyPYdCFao855q3wmy4LHHkEAwSm7KCIa4Kw9QQqT1QACQQQAA4QQAEEQQAAkQJoDabAAKRBAAFhBAAVh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',
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

/***/ 337:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  GB: () => (/* binding */ getISO2Lang),
  Xj: () => (/* binding */ getISO3Lang),
  sC: () => (/* binding */ getTranslation)
});

// UNUSED EXPORTS: DEFAULT_LD_LANG

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
var LANGUAGE_MAP = new Map([
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
  LANGUAGE_MAP.forEach(function (value, key) {
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

/***/ 741:
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

// UNUSED EXPORTS: Binding, CELLAR_JOINED_EUCASE_DATA_CACHE_KEY, CELLAR_JOINED_EUCASE_DATA_PROCESSED_CACHE_KEY, FORMAT_TITLE_FULL, FORMAT_TITLE_SHORT, LD_TARGET_ELI, LD_TARGET_FINLEX, LD_TARGET_KM, LD_TARGET_NAT_ECLI, SPARQL_STATUS_INIT, getCuriaEndpoint, getEurlexContentEndpoint, sanitizeLinkedDataBinding

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
  var query = "\n        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n        PREFIX cdm:<http://publications.europa.eu/ontology/cdm#>\n        PREFIX skos:<http://www.w3.org/2004/02/skos/core#>\n        PREFIX dc:<http://purl.org/dc/elements/1.1/>\n        PREFIX lang:<http://publications.europa.eu/resource/authority/language/>\n        PREFIX xsd:<http://www.w3.org/2001/XMLSchema#>\n        PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n        PREFIX owl:<http://www.w3.org/2002/07/owl#>\n\n        SELECT DISTINCT \n            ?date ?id \n            ?title \n            ?baseTitle\n            ?eli \n            ?force \n            MIN(?dateForce) as ?dateForce\n            (REPLACE(?oj, \" /, \\\\.\\\\.\", \"\", \"i\") as ?oj)\n            ?ojId \n            ?ojResourceUrl\n            ?ojDate\n            ?consolidatedDate \n            ?consolidatedEli \n            ?consolidatedId\n            ?dateValidity\n            ?repealCelexId \n            ?repealEli\n            ?lastRepealCelexId\n            ?lastRepealEli\n            ?resourceUrl\n            ?immcId\n            ?lang\n{\n        SELECT \n            ?date ?workId as ?id \n            ?title \n            ?baseTitle\n            ?eli \n            ?force \n            ?dateForce \n            (IF(BOUND(?ojIdOld), ?ojIdOld, ?ojActId) as ?ojId)\n            (IF(BOUND(?ojResourceUrlOld), ?ojResourceUrlOld, ?ojActResourceUrl) as ?ojResourceUrl)\n            (IF(BOUND(?ojDateOld), ?ojDateOld, ?ojActDate) as ?ojDate)\n            (IF(BOUND(?ojOld), ?ojOld, CONCAT(CONCAT(CONCAT(CONCAT(CONCAT(REPLACE(STR(?ojCollectionDocumentIdentifier ) , \"-\", \" \", \"i\"), \" \"), CONCAT(?ojActYear, \"/\"))), CONCAT(?ojActNumber, \", \")), \n            CONCAT(CONCAT(SUBSTR(STR(?ojActDate), 9, 2), \".\"), CONCAT(CONCAT(SUBSTR(STR(?ojActDate), 6, 2), \".\")), SUBSTR(STR(?ojActDate), 1, 4)))) as ?oj)\n            ?consolidatedDate \n            ?consolidatedEli \n            ?consolidatedId\n            ?dateValidity\n            ?repealCelexId \n            ?repealEli\n            ?lastRepealCelexId\n            ?lastRepealEli\n            ?resourceUrl\n            ?immcId\n            ?lang\n        WHERE {  \n            graph ?ge { \n                ?exp cdm:expression_belongs_to_work ?s .\n                ?exp cdm:expression_title ?title_ .\n                OPTIONAL {\n                    ?exp owl:sameAs ?resourceUrl .\n                    FILTER (REGEX(?resourceUrl, \"resource/oj/\"))\n                }\n            }\n            graph ?g { \n                ?exp cdm:expression_uses_language ?lang\n                ".concat(langISO3Filters, "\n            }  \n\n            ?s cdm:work_date_document ?date .\n            ?s rdf:type ?type .\n            ?s cdm:work_id_document ?workId.\n            OPTIONAL {\n                ?s cdm:resource_legal_date_end-of-validity ?dateValidity .\n            }\n            ").concat(filters, "\n            \n            FILTER not exists {?s cdm:work_is_member_of_complex_work ?complex. }\n            OPTIONAL {\n                ?s cdm:work_id_document ?immcId\n                FILTER(REGEX(?immcId, \"^immc:\"))\n            }\n            OPTIONAL {\n                # CONSOLIDATION\n                ?actConsolidated cdm:act_consolidated_based_on_resource_legal ?s .\n                ?actConsolidated cdm:act_consolidated_date ?consolidatedDate .\n                ?actConsolidated cdm:resource_legal_date_entry-into-force ?consolidatedDateEntryForce .\n                ?actConsolidated cdm:resource_legal_eli ?consolidatedEli . \n                ?actConsolidated cdm:work_id_document ?consolidatedId_ .\n                \n                # we only need results before the end of the act validity\n                ?s cdm:resource_legal_date_end-of-validity ?act_end_of_validity .\n\n                ").concat(pointInTimeFilter1, "\n                FILTER (?consolidatedDateEntryForce < ?act_end_of_validity)     \n                FILTER regex(str(?consolidatedId_), \"celex:\")     \n                # latest consolidation date only\n                FILTER not exists {\n                    ?actConsolidated2 cdm:resource_legal_date_entry-into-force ?consolidatedDateEntryForce2 .\n                    ?actConsolidated2 cdm:act_consolidated_date ?consolidatedDate2 .\n                    ?actConsolidated2 cdm:act_consolidated_based_on_resource_legal ?s .\n                    ?s cdm:resource_legal_date_end-of-validity ?act_end_of_validity2 .\n                    ").concat(pointInTimeFilter2, "\n                    FILTER (?consolidatedDateEntryForce2 > ?consolidatedDateEntryForce AND (?consolidatedDateEntryForce2 < ?act_end_of_validity2))\n                }\n\n                BIND(SUBSTR(?consolidatedId_, 7) as ?consolidatedId)\n            }\n            OPTIONAL {\n                # REPEALING\n                ?actRepeal cdm:resource_legal_repeals_resource_legal ?s .\n                ?actRepeal cdm:resource_legal_eli ?repealEli . \n                ?actRepeal cdm:work_date_document ?repealDate . \n                ?actRepeal cdm:work_id_document ?repealCelexId_.\n                ").concat(pointInTimeFilter3, "\n                FILTER regex(str(?repealCelexId_), \"celex:\")                    \n                BIND(SUBSTR(?repealCelexId_, 7) as ?repealCelexId)\n\n                OPTIONAL {\n                    # REPEALING LAST\n                    ?lastActRepeal cdm:resource_legal_repeals_resource_legal+ ?s .\n                    ?lastActRepeal cdm:resource_legal_eli ?lastRepealEli . \n                    ?lastActRepeal cdm:work_id_document ?lastRepealCelexId_.\n                    FILTER regex(str(?lastRepealCelexId_), \"celex:\")                    \n                    FILTER not exists {\n                       ?actRepeal_ cdm:resource_legal_repeals_resource_legal ?lastActRepeal .\n                       ?actRepeal_ cdm:work_date_document ?repealDate2\n                       ").concat(pointInTimeFilter4, "\n                    } \n                    BIND(SUBSTR(?lastRepealCelexId_, 7) as ?lastRepealCelexId)\n                }\n            }\n            OPTIONAL {\n                ?s cdm:resource_legal_eli ?eli .\n            }\n            OPTIONAL {\n                # FORCE\n                ?s cdm:resource_legal_in-force ?force .\n                ?s cdm:resource_legal_date_entry-into-force ?dateForce .\n            }        \n            OPTIONAL {\n                # MANIFEST \n                ?manif cdm:manifestation_manifests_expression ?exp. \n                ?manif cdm:manifestation_type ?manifType .\n                FILTER(STR(?manifType)=\"print\" || BOUND(?ojPageFirst)) .\n\n                # MANIFEST OJ PAGE (optional)\n                OPTIONAL {\n                    ?manif cdm:manifestation_official-journal_part_page_first ?ojPageFirst.\n                    ?manif cdm:manifestation_official-journal_part_page_last ?ojPageLast.\n                }\n\n                ?manif cdm:manifestation_part_of_manifestation ?parentManif.\n                OPTIONAL {\n                    ?parentManif owl:sameAs ?langSpecificManif.\n                }\n                OPTIONAL {\n                    ?manif owl:sameAs ?manifOjResourceUrl .\n                    # We need to use the MANIFEST to get to the OJ\n                    FILTER (STRSTARTS(STR(?manifOjResourceUrl), \"http://publications.europa.eu/resource/oj/\"))\n                }\n\n                # OJ info\n                ?s cdm:resource_legal_published_in_official-journal ?q .\n                ?q cdm:official-journal_part_of_collection_document ?ojPartOld .\n                ?q cdm:official-journal_number ?ojNumberOld .\n                OPTIONAL {\n                    ?q cdm:official-journal_class ?ojClassOld .\n                }\n                ?ojPartOld skos:prefLabel ?ojPartLabelOld .\n                ?q cdm:official-journal_volume ?ojVolumeOld .\n                ?q cdm:publication_general_date_publication ?ojDateOld .\n                \n                # cross match with parent OJ resource\n                ?q owl:sameAs ?mainOjResourceUrlOld .\n                ?q cdm:work_id_document ?ojIdOld.\n                \n                # multiple OJ publications can cause trouble so we cross-match the OJ url with the manifest's (where available)\n                FILTER (!BOUND(?langSpecificManif) || STRSTARTS(STR(?langSpecificManif), STR(?mainOjResourceUrlOld)) || (REGEX(STR(?langSpecificManif), 'resource/oj/DD_')))\n                FILTER (STRSTARTS(STR(?ojIdOld), \"oj:\") AND STRSTARTS(STR(?mainOjResourceUrlOld), \"http://publications.europa.eu/resource/oj/\")) \n                BIND(?mainOjResourceUrlOld as ?ojResourceUrlOld)\n\n                BIND(CONCAT(STR(DAY(?ojDateOld)), \n                \".\", \n                STR(MONTH(?ojDateOld)), \n                \".\", \n                STR(YEAR(?ojDateOld))) as ?ojDatePublicationOld)\n\n                # OJ label; do not modify as it will be processed for translation\n                BIND(IF(BOUND(?ojPartLabelOld), \n                CONCAT(CONCAT(REPLACE(REPLACE(REPLACE(?ojPartLabelOld, \" series\", \"\", \"i\"), \"Official Journal\", \"OJ\", \"i\"), \"-\", \" \", \"i\"), \" \", \n                CONCAT(?ojNumberOld, \n                CONCAT(IF (STR(?ojClassOld) != \"R\", ?ojClassOld, \"\"),\n                CONCAT(\", \", CONCAT($ojDatePublicationOld,\n                    CONCAT(IF(BOUND(?ojPageFirst), \", p. \", \"\"), \n                    CONCAT(IF(BOUND(?ojPageFirst), xsd:integer(?ojPageFirst), \"\"), \n                    CONCAT(IF(BOUND(?ojPageLast), \"-\", \"\"), IF(BOUND(?ojPageLast), xsd:integer(?ojPageLast), \"\")))))))))), \"\") as ?ojOld) .\n\n                FILTER (lang(?ojPartLabelOld) = \"en\" )\n            }\n\n            # OJ act-by-act\n            OPTIONAL {\n                FILTER NOT EXISTS {\n                    ?s cdm:resource_legal_published_in_official-journal ?_ojTemp\n                }\n                ?s cdm:official-journal-act_date_publication ?ojActDate .\n                ?s cdm:official-journal-act_part_of_collection_document ?ojCollectionDocument .\n                ?ojCollectionDocument dc:identifier ?ojCollectionDocumentIdentifier .\n                ?s cdm:official-journal-act_subsubsection_oj ?ojSubsection .\n                ?s cdm:official-journal-act_number ?ojActNumber .\n                ?s cdm:official-journal-act_year ?ojActYear .\n                \n                ?s cdm:work_id_document ?ojActId. \n                FILTER (STRSTARTS(STR(?ojActId), \"oj:\"))\n                ?s cdm:resource_legal_eli ?ojActResourceUrl . \n            } \n\n            BIND(?title_ as ?title) \n            BIND(?title_ as ?baseTitle)\n        }\n    }\n    ORDER BY ?id ?lang");
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
  var query = "\n        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n        PREFIX cdm:<http://publications.europa.eu/ontology/cdm#>\n        PREFIX skos:<http://www.w3.org/2004/02/skos/core#>\n        PREFIX dc:<http://purl.org/dc/elements/1.1/>\n        PREFIX lang:<http://publications.europa.eu/resource/authority/language/>\n        PREFIX xsd:<http://www.w3.org/2001/XMLSchema#>\n        PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n        PREFIX owl:<http://www.w3.org/2002/07/owl#>\n\n        SELECT DISTINCT\n            ?date \n            ?id \n            ?title \n            ?eli \n            ?force\n            MIN(?dateForce) as ?dateForce\n            (REPLACE(?oj, \" /, \\\\.\\\\.\", \"\", \"i\") as ?oj)\n            ?ojResourceUrl\n            ?consolidatedDate \n            ?consolidatedEli\n            ?consolidatedId\n            ?initialEli\n            ?initialForce\n            ?initialDateValidity\n            ?finalConsolidatedEli\n            ?finalConsolidatedDate\n            ?dateValidity\n            ?repealCelexId \n            ?repealEli\n            ?lastRepealCelexId\n            ?lastRepealEli\n            ?resourceUrl\n            ?lang\n        {\n        SELECT\n            ?date ?workId as ?id \n            ?title_ as ?title \n            ?eli \n            ?force \n            ?dateForce \n\n            (IF(BOUND(?ojIdOld), ?ojIdOld, ?ojActId) as ?ojId)\n            (IF(BOUND(?ojResourceUrlOld), ?ojResourceUrlOld, ?ojActResourceUrl) as ?ojResourceUrl)\n            (IF(BOUND(?ojDateOld), ?ojDateOld, ?ojActDate) as ?ojDate)\n            (IF(BOUND(?ojOld), ?ojOld, CONCAT(CONCAT(CONCAT(CONCAT(CONCAT(REPLACE(STR(?ojCollectionDocumentIdentifier ) , \"-\", \" \", \"i\"), \" \"), CONCAT(?ojActYear, \"/\"))), CONCAT(?ojActNumber, \", \")), \n            CONCAT(CONCAT(SUBSTR(STR(?ojActDate), 9, 2), \".\"), CONCAT(CONCAT(SUBSTR(STR(?ojActDate), 6, 2), \".\")), SUBSTR(STR(?ojActDate), 1, 4)))) as ?oj)\n\n            ?consolidatedDate \n            ?consolidatedEli\n            ?consolidatedId\n            ?initialCelexId \n            ?initialEli\n            ?initialForce\n            ?initialDateValidity\n            ?finalConsolidatedEli\n            ?finalConsolidatedDate\n            ?dateValidity\n            ?repealCelexId \n            ?repealEli\n            ?lastRepealCelexId\n            ?lastRepealEli\n            ?resourceUrl\n            ?lang\n        WHERE {                  \n            graph ?ge {                     \n                ?exp cdm:expression_belongs_to_work ?s .                    \n                ?exp cdm:expression_title ?title_ .\n                OPTIONAL {\n                    ?exp owl:sameAs ?resourceUrl .\n                    FILTER (REGEX(?resourceUrl, \"resource/oj/\"))    \n                }           \n            }                \n            graph ?g {                     \n                ?exp cdm:expression_uses_language ?lang                    \n                filter(?lang=lang:".concat(langISO3, ").                  \n            }    \n\n            ?s cdm:resource_legal_eli ?eli .\n            ").concat(filters, "\n            {\n                ?s cdm:work_date_document ?date .\n                ?s rdf:type ?type .\n                ?s cdm:work_id_document ?workId\n                FILTER (STRSTARTS(?workId, \"celex:\")) . \n            }\t\t\n\n            OPTIONAL {\n                ?s cdm:case-law_ecli ?ecli\n            }\n            OPTIONAL {\n                ?s cdm:resource_legal_date_end-of-validity ?dateValidity .\n            }\n\n            OPTIONAL {\n                # INITIAL ACT\n                ?s cdm:act_consolidated_consolidates_resource_legal ?actInitial .\n                ?actInitial cdm:resource_legal_eli ?initialEli . \n                ?actInitial cdm:work_id_document ?initialCelexId .\n                # STATUS OF THE INITIAL ACT\n                ?actInitial cdm:resource_legal_in-force ?initialForce .\n                ?s cdm:resource_legal_eli ?eli1 .\n                BIND(REPLACE(?initialEli, \"/oj\", \"\", \"i\") AS ?initialEliRaw) .\n\n                FILTER regex(str(?initialCelexId), \"celex:\") \n                # make sure we focus on the right consolidated act REFTOLINK-1310\n                FILTER STRSTARTS(?eli1, ?initialEliRaw) \n \n                FILTER NOT EXISTS {\n                    ?actInitial cdm:resource_legal_corrects_resource_legal ?corrigendumEli .\n                }\n\n                OPTIONAL {\n                    ?actInitial cdm:resource_legal_date_end-of-validity ?initialDateValidity .\n                }\n\n                # GET FINAL CONSOLIDATION OF INITIAL ACT\n                OPTIONAL {\n                    ?finalActConsolidated cdm:act_consolidated_based_on_resource_legal ?actInitial .\n                    ?finalActConsolidated cdm:act_consolidated_date ?finalConsolidatedDate .\n                    ?finalActConsolidated cdm:resource_legal_eli ?finalConsolidatedEli . \n                    # latest consolidation date only\n                    filter not exists {\n                        ?finalActConsolidated2 cdm:act_consolidated_based_on_resource_legal ?actInitial .\n                        ?finalActConsolidated2 cdm:act_consolidated_date ?finalConsolidatedDate2\n                        filter (?finalConsolidatedDate2 > ?finalConsolidatedDate)\n                    }\n                }\n            }\n            OPTIONAL {\n                # CONSOLIDATION\n                ?actConsolidated cdm:act_consolidated_based_on_resource_legal ?s .\n                ?actConsolidated cdm:act_consolidated_date ?consolidatedDate .\n                ?actConsolidated cdm:resource_legal_date_entry-into-force ?consolidatedDateEntryForce .\n                ?actConsolidated cdm:resource_legal_eli ?consolidatedEli . \n                ?actConsolidated cdm:work_id_document ?consolidatedId_ .\n                \n                # we only need results before the end of the act validity\n                ?s cdm:resource_legal_date_end-of-validity ?act_end_of_validity .\n\n                ").concat(pointInTimeFilter1, "\n                FILTER (?consolidatedDateEntryForce < ?act_end_of_validity)     \n                FILTER regex(str(?consolidatedId_), \"celex:\")     \n                # latest consolidation date only\n                FILTER not exists {\n                    ?actConsolidated2 cdm:resource_legal_date_entry-into-force ?consolidatedDateEntryForce2 .\n                    ?actConsolidated2 cdm:act_consolidated_based_on_resource_legal ?s .\n                    ?actConsolidated2 cdm:act_consolidated_date ?consolidatedDate2 .\n                    ?s cdm:resource_legal_date_end-of-validity ?act_end_of_validity2 .\n                    ").concat(pointInTimeFilter2, "\n                    FILTER (?consolidatedDateEntryForce2 > ?consolidatedDateEntryForce AND (?consolidatedDateEntryForce2 < ?act_end_of_validity2))\n                }\n                BIND(SUBSTR(?consolidatedId_, 7) as ?consolidatedId)\n            }\n            OPTIONAL {\n                # REPEALING\n                ?actRepeal cdm:resource_legal_repeals_resource_legal ?s .\n                ?actRepeal cdm:resource_legal_eli ?repealEli . \n                ?actRepeal cdm:work_date_document ?repealDate . \n                ?actRepeal cdm:work_id_document ?repealCelexId_.\n                ").concat(pointInTimeFilter3, "\n                FILTER regex(str(?repealCelexId_), \"celex:\")                    \n                BIND(SUBSTR(?repealCelexId_, 7) as ?repealCelexId)\n                OPTIONAL {\n                    # REPEALING LAST\n                    ?lastActRepeal cdm:resource_legal_repeals_resource_legal+ ?s .\n                    ?lastActRepeal cdm:resource_legal_eli ?lastRepealEli . \n                    ?lastActRepeal cdm:work_id_document ?lastRepealCelexId_.\n                    FILTER regex(str(?lastRepealCelexId_), \"celex:\")                    \n                    FILTER not exists {\n                       ?actRepeal_ cdm:resource_legal_repeals_resource_legal ?lastActRepeal .\n                       ?actRepeal_ cdm:work_date_document ?repealDate2\n                       ").concat(pointInTimeFilter4, "\n                    } \n                    BIND(SUBSTR(?lastRepealCelexId_, 7) as ?lastRepealCelexId)\n                }\n            }\n            OPTIONAL {\n                # FORCE\n                ?s cdm:resource_legal_in-force ?force .\n                ?s cdm:resource_legal_date_entry-into-force ?dateForce .\n            }        \n            OPTIONAL {\n                # MANIFEST \n                ?manif cdm:manifestation_manifests_expression ?exp. \n                ?manif cdm:manifestation_type ?manifType .\n                FILTER(STR(?manifType)=\"print\" || BOUND(?ojPageFirst)) .\n\n                # MANIFEST OJ PAGE\n                OPTIONAL {\n                    ?manif cdm:manifestation_official-journal_part_page_first ?ojPageFirst.\n                    ?manif cdm:manifestation_official-journal_part_page_last ?ojPageLast.\n                }\n                OPTIONAL {\n                    ?manif owl:sameAs ?manifOjResourceUrl .\n                    # We need to use the MANIFEST to get to the OJ\n                    FILTER (STRSTARTS(STR(?manifOjResourceUrl), \"http://publications.europa.eu/resource/oj/\"))\n                }\n\n                # OJ info\n                ?s cdm:resource_legal_published_in_official-journal ?q .\n                ?q cdm:official-journal_part_of_collection_document ?ojPartOld .\n                ?q cdm:official-journal_number ?ojNumberOld .\n                OPTIONAL {\n                    ?q cdm:official-journal_class ?ojClassOld .\n                }\n                ?ojPartOld skos:prefLabel ?ojPartLabelOld .\n                ?q cdm:official-journal_volume ?ojVolumeOld .\n                ?q cdm:publication_general_date_publication ?ojDateOld .\n                \n                BIND(CONCAT(STR(DAY(?ojDateOld)), \n                \".\", \n                STR(MONTH(?ojDateOld)), \n                \".\", \n                STR(YEAR(?ojDateOld))) as ?ojDatePublicationOld)\n\n                # cross match with parent OJ resource\n                ?q owl:sameAs ?mainOjResourceUrlOld .\n                ?q cdm:work_id_document ?ojIdOld.\n                \n                # multiple OJ publications can cause trouble so we cross-match the OJ url with the manifest's (where available)\n                # DISABLED - using the first result \n                # FILTER (!BOUND(?manifOjResourceUrl) || STRSTARTS(STR(?manifOjResourceUrl), STR(?mainOjResourceUrlOld)) || (REGEX(STR(?langSpecificManif), 'resource/oj/DD_')))\n                FILTER (STRSTARTS(STR(?ojIdOld), \"oj:\") AND STRSTARTS(STR(?mainOjResourceUrlOld), \"http://publications.europa.eu/resource/oj/\")) \n                BIND(?mainOjResourceUrlOld as ?ojResourceUrlOld)\n\n                # OJ label; do not modify as it will be processed for translation\n                BIND(IF(BOUND(?ojPartLabelOld), \n                CONCAT(CONCAT(REPLACE(REPLACE(REPLACE(?ojPartLabelOld, \" series\", \"\", \"i\"), \"Official Journal\", \"OJ\", \"i\"), \"-\", \" \", \"i\"), \" \", \n                CONCAT(?ojNumberOld, \n                CONCAT(IF (STR(?ojClassOld) != \"R\", ?ojClass, \"\"),\n                CONCAT(\", \", CONCAT($ojDatePublicationOld,\n                    CONCAT(IF(BOUND(?ojPageFirst), \", p. \", \"\"), \n                    CONCAT(IF(BOUND(?ojPageFirst), xsd:integer(?ojPageFirst), \"\"), \n                    CONCAT(IF(BOUND(?ojPageLast), \"-\", \"\"), IF(BOUND(?ojPageLast), xsd:integer(?ojPageLast), \"\")))))))))), \"\") as ?ojOld) .\n\n\n                FILTER ( lang(?ojPartLabelOld) = \"en\" )\n            }\n            \n            # OJ act-by-act\n            OPTIONAL {\n                FILTER NOT EXISTS {\n                    ?s cdm:resource_legal_published_in_official-journal ?_ojTemp\n                }\n                ?s cdm:official-journal-act_date_publication ?ojActDate .\n                ?s cdm:official-journal-act_part_of_collection_document ?ojCollectionDocument .\n                ?ojCollectionDocument dc:identifier ?ojCollectionDocumentIdentifier .\n                ?s cdm:official-journal-act_subsubsection_oj ?ojSubsection .\n                ?s cdm:official-journal-act_number ?ojActNumber .\n                ?s cdm:official-journal-act_year ?ojActYear .\n                \n                ?s cdm:work_id_document ?ojActId. \n                FILTER (STRSTARTS(STR(?ojActId), \"oj:\"))\n                ?s cdm:resource_legal_eli ?ojActResourceUrl . \n            } \n        }\n    }");
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
;// ./src/lib/manager/utils/footnote.js

var FOOTNOTE_TYPE_LONG = 'long';
var FOOTNOTE_TYPE_SHORT = 'short';
var FOOTNOTE_TYPE_LONG_ELI = 'long_eli';
var FOOTNOTE_TYPE_SHORT_ELI = 'short_eli';
var FOOTNOTE_STYLE_DEFAULT = 'eurlex';
var FOOTNOTE_STYLE_CURIA = 'curia';
var FOOTNOTE_TYPE_DEFAULT = (/* unused pure expression or super */ null && (FOOTNOTE_TYPE_LONG));
var DEFAULT_LANG_ISO2 = 'en';
function resolveFootnoteValueSync(node, type, style) {
  var supportsCuriaData = false;
  var ecli = null;
  // Check if we have an ECLI
  if (node.data && node.data[0]) {
    ecli = node.data[0].ecli;
    if (!ecli && node.data[0].metadata && node.data[0].metadata.ecli) {
      ecli = String(node.data[0].metadata.ecli.value);
    }
    if (ecli) {
      node.data[0].ecli = ecli;
    }
  }

  // we only support Curia data for EU ECLI
  if (ecli && String(ecli).slice(0, 8) === "ECLI:EU:") {
    supportsCuriaData = true;
  }
  return getFootnoteSuggestion(node, type, style);
}
function resolveFootnoteValue(node, type, style) {
  return new Promise(function (resolve, reject) {
    var supportsCuriaData = false;
    var ecli = null;
    // Check if we have an ECLI
    if (node.data && node.data[0]) {
      ecli = node.data[0].ecli;
      if (!ecli && node.data[0].metadata && node.data[0].metadata.ecli) {
        ecli = String(node.data[0].metadata.ecli.value);
      }
      if (ecli) {
        node.data[0].ecli = ecli;
      }
    }

    // we only support Curia data for EU ECLI
    if (ecli && String(ecli).slice(0, 8) === "ECLI:EU:") {
      supportsCuriaData = true;
    }
    if (ecli && !node.curiaData && supportsCuriaData && style === FOOTNOTE_STYLE_CURIA) {
      var langISO3 = R2L.getLanguage() || R2L.getConstant("R2L_DEFAULT_LANG_ISO3");
      var langISO2 = (0,translations/* getISO2Lang */.GB)(langISO3) || DEFAULT_LANG_ISO2;
      R2L.ldm.getCuriaMetadata(ecli, langISO2)["catch"](function (err) {
        console.error("Failed to retrieve Curia metadata", err);
        return null;
      }).then(function (curiaData) {
        node.curiaData = curiaData;
        var footnoteValue = getFootnoteSuggestion(node, type, style);
        resolve(footnoteValue);
      });
    } else {
      var footnoteValue = getFootnoteSuggestion(node, type, style);
      resolve(footnoteValue);
    }
  });
}
function getFootnoteSuggestion(node, type, style) {
  type = type || FOOTNOTE_TYPE_LONG;
  var lookupType = node.type;
  try {
    if (node.type === 'eurlex.celexId') {
      var sector = String(node.data[0].celex).slice(0, 1);
      if (sector === '3') {
        lookupType = 'eurlex.act';
      }
      if (sector === '6') {
        lookupType = 'eucase';
      }
    }
  } catch (e) {
    console.error(e);
    return '';
  }

  // for eurlex act we use long_eli and short_eli templates
  if (lookupType === 'eurlex.act') {
    if (type === FOOTNOTE_TYPE_SHORT) {
      type = FOOTNOTE_TYPE_SHORT_ELI;
    } else if (type === FOOTNOTE_TYPE_LONG) {
      type = FOOTNOTE_TYPE_LONG_ELI;
    }
  }
  var footnoteTemplates = getFootnoteTemplates(lookupType);
  var footnote = footnoteTemplates.filter(function (f) {
    return f.type === type;
  }).pop();

  // prepare data for footnote template
  var data = getData(node, style);
  if (!footnote || !data) {
    return '';
  }
  return parseFootnoteTemplate(footnote, data);
}
function getFootnoteTemplates(type) {
  return R2L.getRules().filter(function (rule) {
    return rule.baseType === type || rule.type === type;
  }).map(function (rule) {
    return rule.footnotes;
  }).pop();
}
function parseFootnoteTemplate(footnote, data) {
  var template = footnote.template;
  data = data || {};
  if (Object.keys(data).length === 0) {
    return '';
  }
  Object.keys(data).forEach(function (key) {
    if (!data[key]) {
      // replace trailing comma too
      template = template.replaceAll(new RegExp('{{ ' + key + ' }}, ?', 'gi'), data[key]);
    } else {
      template = template.replaceAll("{{ ".concat(key, " }}"), data[key]);
    }
  });

  // only if all vars have been replaced we return the template
  if (template.indexOf('{{') !== -1) {
    return '';
  }
  template = cleanFootnoteData(template, data['LANG']);
  return template;
}
function getData(node, style) {
  var data = (node.data || [])[0] || {};
  var metadata = data.metadata || {};
  var title = '';
  var langISO3 = R2L.getLanguage() || R2L.getConstant("R2L_DEFAULT_LANG_ISO3");
  var langISO2 = (0,translations/* getISO2Lang */.GB)(langISO3) || DEFAULT_LANG_ISO2;
  if (metadata.baseTitle && metadata.baseTitle.value) {
    title = metadata.baseTitle.value;
  } else if (node.type === 'ecli' && metadata.title && metadata.title.value) {
    title = metadata.title.value;
  } else {
    // missing linked data
    return null;
  }
  var tplData;
  try {
    switch (node.type) {
      case 'eucase':
      case 'ecli':
        var parts = title.split('#').map(function (part) {
          return part.trim().replace(/\.$/g, '');
        });
        var ecli = '';
        ecli = metadata.ecli && metadata.ecli.value ? metadata.ecli.value.trim() : '';
        if (ecli === '' && node.type === 'ecli') {
          ecli = metadata.id && metadata.id.value ? metadata.id.value : '';
        }
        var curiaTitle = style === FOOTNOTE_STYLE_CURIA && node.curiaData ? node.curiaData.title : null;
        var casePart = parts[4] || parts[3] || parts[2];
        // EFTA cases have a different structure eg:  
        // "Request for an Advisory Opinion from the EFTA Cour…er v Swiss Life (Liechtenstein) AG (Case E-16/15)"
        if (!casePart) {
          var matches = /\(([^)]+)\)$/gi.exec(title);
          casePart = matches && matches[1] ? matches[1] : node.reference;
        }

        // remove content inside parentheses from CASE_TITLE
        var caseTitle = parts[0] ? parts[0].replace(/ ?\([^)]*\)/g, '') : '«CASE TITLE»';
        var joinedCaseLabels = R2L.ldm.getJoinedCaseDataByCaseLabel(metadata.dossierTitle ? metadata.dossierTitle.value : casePart);
        var caseLabel = metadata.dossierTitle ? metadata.dossierTitle.value : casePart;
        if (joinedCaseLabels && joinedCaseLabels.length > 1) {
          caseLabel = R2L.ldm.getJoinedCasesTranslation(joinedCaseLabels, langISO2);
        }
        if (!caseLabel) {
          console.error("Failed to retrieve case label", node);
          caseLabel = '';
        } else {
          caseLabel = caseLabel.replace('Case ', '');
        }
        tplData = {
          CASE_TITLE: caseTitle.trim(),
          CASE_ALIAS: curiaTitle || parts[1] || '',
          CASE_LABEL: caseLabel,
          CASE_ECLI: ecli || '',
          LANG: langISO2
        };
        return tplData;
      case 'eurlex.act':
        tplData = {
          ACT_TITLE: node.data[0].metadata.title.value.trim() + '.',
          ACT_ELI: node.data[0].metadata.eli ? node.data[0].metadata.eli.value : '',
          ACT_OJ: node.data[0].metadata.oj ? node.data[0].metadata.oj.value.trim() : '',
          LANG: langISO2
        };
        return tplData;
      case 'eurlex.celexId':
        var sector = node.data[0].celex.substr(0, 1);

        // only sector 3 has templated footnotes for now
        if (sector === "3" && node.data[0].metadata.eli) {
          tplData = {
            ACT_TITLE: node.data[0].metadata.title.value.trim() + '.',
            ACT_ELI: node.data[0].metadata.eli.value,
            ACT_OJ: node.data[0].metadata.oj ? node.data[0].metadata.oj.value.trim() : '',
            LANG: langISO2
          };
          return tplData;
        } else if (sector === "6") {
          var _parts = title.split('#').map(function (part) {
            return part.trim().replace(/\.$/g, '');
          });
          var _ecli = '';
          _ecli = metadata.ecli && metadata.ecli.value ? metadata.ecli.value.trim() : '';
          var _curiaTitle = style === FOOTNOTE_STYLE_CURIA && node.curiaData ? node.curiaData.title : null;
          var _casePart = _parts[4] || _parts[3] || _parts[2];
          // remove content inside parentheses from CASE_TITLE
          var _caseTitle = _parts[0] ? _parts[0].replace(/ ?\([^)]*\)/g, '') : '«CASE TITLE»';
          var _joinedCaseLabels = R2L.ldm.getJoinedCaseDataByCaseLabel(metadata.dossierTitle ? metadata.dossierTitle.value : _casePart);
          var _caseLabel = metadata.dossierTitle ? metadata.dossierTitle.value : _casePart;
          if (_joinedCaseLabels && _joinedCaseLabels.length > 1) {
            _caseLabel = R2L.ldm.getJoinedCasesTranslation(_joinedCaseLabels, langISO2 || 'EN');
          }
          tplData = {
            CASE_TITLE: _caseTitle.trim(),
            CASE_ALIAS: _curiaTitle || _parts[1] || '',
            CASE_LABEL: _caseLabel,
            CASE_ECLI: _ecli || '',
            LANG: langISO2
          };
          return tplData;
        } else {
          return null;
        }
      default:
        return null;
    }
  } catch (e) {
    console.error(e);
    return null;
  }
}
function cleanFootnoteData(data, langISO2) {
  data = R2L.ldm.cleanFootnote(data);
  data = data.trim();
  // remove first charachter if === ','
  if (data[0] === ',') {
    data = data.substr(1, data.length - 1);
  }

  // remove last charachter if === ','
  if (data[data.length - 1] === ',') {
    data = data.substr(0, data.length - 1);
  }

  // remove court label from title
  return R2L.ldm.fixCaseLawCitation(data, langISO2);
}
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
var FORMAT_TITLE_FULL = 'full';

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
  }, {
    key: "getFormattedRef",
    value: function getFormattedRef(node, type, langISO2) {
      if (!node.data || !node.data[0] || !node.data[0].celex) {
        return Promise.resolve('');
      }
      var langISO3 = (0,translations/* getISO3Lang */.Xj)(langISO2);
      if (!langISO3) {
        return Promise.resolve('');
      }
      return R2L.alias.getShortTitles([node.data[0].celex], langISO3).then(function (shortTitlesMap) {
        var shortTitle = shortTitlesMap[node.data[0].celex];
        var longTitle = node.data[0].metadata.title ? cleanFootnote(node.data[0].metadata.title.value) : "";
        return type === FORMAT_TITLE_FULL ? longTitle : shortTitle;
      });
    }

    /**
     * Get footnote value for a node
     * 
     * @param {R2LOrderedNode} node 
     * @param {string} type - 'short'|'long'
     * @param {string} style - 'curia'
     * @returns {Promise<string>}
     */
  }, {
    key: "getFootnote",
    value: function getFootnote(node, type, style) {
      return resolveFootnoteValue(node, type, style);
    }

    /**
     * Get footnote (sync API) - will not resolve footnotes requiring external data 
     * 
     * @param {R2LOrderedNode} node 
     * @param {string} type - 'short'|'long'
     * @param {string} style - 'curia'
     * @returns {Promise<string>}
     */
  }, {
    key: "getFootnoteSync",
    value: function getFootnoteSync(node, type, style) {
      return resolveFootnoteValueSync(node, type, style);
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
    key: "getFormattedRefSync",
    value:
    /**
     * Get formatted label of a R2L ordered node
     * 
     * @param {R2LNode} node 
     * @param {string} formatType 'short'|'long'
     * @returns {string}
     */
    function getFormattedRefSync(node, formatType) {
      if (!node.data[0].metadata) {
        return node.match;
      }
      try {
        var shortTitle = node.data[0].metadata.shortTitle ? node.data[0].metadata.shortTitle.value : "";
        var longTitle = node.data[0].metadata.title ? this.cleanFootnote(node.data[0].metadata.title.value) : "";
        var title = formatType === FORMAT_TITLE_FULL ? longTitle : shortTitle;
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
// EXTERNAL MODULE: ./src/lib/manager/index.js + 20 modules
var manager = __webpack_require__(741);
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
  _jquery_js__WEBPACK_IMPORTED_MODULE_0__.$.fn.getOrderedNodes = function () {
    var format = 'json';
    var references = (0,_jquery_js__WEBPACK_IMPORTED_MODULE_0__.$)(this).getReferences();
    var formatter = R2L.formatters[format];
    var res = formatter(references, (0,_jquery_js__WEBPACK_IMPORTED_MODULE_0__.$)(this).data(R2L_INITIAL_DATA_ATTR) || "");
    return R2L.getOrderedNodes(res.result || []);
  };

  /**
   * Returns formatted references object (json/xml/html)
   * @param {String} format 
   * @returns {Object}
   */
  _jquery_js__WEBPACK_IMPORTED_MODULE_0__.$.fn.getFormattedReferences = function (format) {
    format = format || 'json';
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

// EXTERNAL MODULE: ./src/lib/index.js + 16 modules
var lib = __webpack_require__(154);
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
// EXTERNAL MODULE: ./src/lib/manager/index.js + 20 modules
var manager = __webpack_require__(741);
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
