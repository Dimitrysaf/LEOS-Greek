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
//ADDED FOR LEOS LOADING: END
