/*
 * Copyright 2023 European Commission
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy of the Licence at:
 *
 *     https://joinup.ec.europa.eu/software/page/eupl
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the Licence is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the Licence for the specific language governing permissions and limitations under the Licence.
 */
; // jshint ignore:line
define(function leosTrackChangesStyleModule(require) {
    "use strict";

    var log = require("logger");
    var trackChanges = require("./leosTrackChanges"), core = trackChanges.core;

    var style = {

        // Format styles
        FORMAT_STYLES:  [ { event: "bold", style: new CKEDITOR.style( { element: "strong" } )},
            { event: "italic", style: new CKEDITOR.style( { element: "em" } )},
            { event: "subscript", style: new CKEDITOR.style( { element: "sub" } )},
            { event: "superscript", style: new CKEDITOR.style( { element: "sup" } )} ],

        posPrecedingIdenticalContained:
            CKEDITOR.POSITION_PRECEDING | CKEDITOR.POSITION_IDENTICAL | CKEDITOR.POSITION_IS_CONTAINED,
        posFollowingIdenticalContained:
            CKEDITOR.POSITION_FOLLOWING | CKEDITOR.POSITION_IDENTICAL | CKEDITOR.POSITION_IS_CONTAINED,

        notBookmark: CKEDITOR.dom.walker.bookmark(0, 1),
        nonWhitespaces: CKEDITOR.dom.walker.whitespaces(1),

        blockElements: {
            address: 1, div: 1, h1: 1, h2: 1, h3: 1, h4: 1, h5: 1, h6: 1, p: 1,
            pre: 1, section: 1, header: 1, footer: 1, nav: 1, article: 1, aside: 1, figure: 1,
            dialog: 1, hgroup: 1, time: 1, meter: 1, menu: 1, command: 1, keygen: 1, output: 1,
            progress: 1, details: 1, datagrid: 1, datalist: 1
        },

        apply: function(editor, style) {
            // Backward compatibility.
            if (editor instanceof CKEDITOR.dom.document)
                return this.applyStyleOnSelection(editor, style);

            if (this.checkApplicable(editor.elementPath(), editor, style)) {
                var initialEnterMode = style._.enterMode;

                // See comment in removeStyle.
                if (!initialEnterMode)
                    style._.enterMode = editor.activeEnterMode;
                this.applyStyleOnSelection(editor, style);
                style._.enterMode = initialEnterMode;
            }
        },

        remove: function(editor, style) {
            // Backward compatibility.
            if (editor instanceof CKEDITOR.dom.document)
                return this.applyStyleOnSelection(editor, style, 1);

            if (this.checkApplicable(editor.elementPath(), editor, style)) {
                var initialEnterMode = style._.enterMode;

                // Before CKEditor 4.4.0 style knew nothing about editor, so in order to provide enterMode
                // which should be used developers were forced to hack the style object (see https://dev.ckeditor.com/ticket/10190).
                // Since CKEditor 4.4.0 style knows about editor (at least when it's being applied/removed), but we
                // use _.enterMode for backward compatibility with those hacks.
                // Note: we should not change style's enter mode if it was already set.
                if (!initialEnterMode)
                    style._.enterMode = editor.activeEnterMode;
                this.applyStyleOnSelection(editor, style, 1);
                style._.enterMode = initialEnterMode;
            }
        },

        checkApplicable: function(elementPath, editor, style, filter) {
            // Backward compatibility.
            if (editor && editor instanceof CKEDITOR.filter)
                filter = editor;

            if (filter && !filter.check(style))
                return false;

            switch (style.type) {
                case CKEDITOR.STYLE_OBJECT:
                    return !!elementPath.contains(style.element);
                case CKEDITOR.STYLE_BLOCK:
                    return !!elementPath.blockLimit.getDtd()[style.element];
            }

            return true;
        },

        applyStyleOnSelection: function(editor, style, remove) {
            var selection = editor.getSelection(), ranges = selection.getRanges(),
                originalRanges,
                range,
                i;

            // In case of fake table selection, we would like to apply all styles and then select
            // the original ranges. Otherwise browsers would complain about discontiguous selection.
            if (selection.isFake && selection.isInTable()) {
                originalRanges = [];

                for (i = 0; i < ranges.length; i++) {
                    originalRanges.push(ranges[i].clone());
                }
            }

            var iterator = ranges.createIterator();
            while ((range = iterator.getNextRange())) {
                if (remove) this.removeFromRange(editor, range, style)
                    else this.applyToRange(editor, range, style);
            }

            selection.selectRanges( originalRanges || ranges );
        },

        applyToRange: function(editor, range, style) {
            switch (style.type) {
                case CKEDITOR.STYLE_INLINE:
                    return this.applyInlineStyle(editor, range, style);
                case CKEDITOR.STYLE_BLOCK:
                case CKEDITOR.STYLE_OBJECT:
                    console.log("This style type not implemented for track changes!!!");
                    return;
            }
        },

        removeFromRange: function(editor, range, style) {
            switch (style.type) {
                case CKEDITOR.STYLE_INLINE:
                    return this.removeInlineStyle(editor, range, style);
                case CKEDITOR.STYLE_BLOCK:
                case CKEDITOR.STYLE_OBJECT:
                    console.log("This style type not implemented for track changes!!!");
                    return;
            }
        },

        applyInlineStyle: function(editor, range, style) {
            var document = range.document;

            if (range.collapsed) {
                // Create the element to be inserted in the DOM.
                var collapsedElement = this.getElement(style, document);

                // Insert the empty element into the DOM at the range position.
                range.insertNode(collapsedElement);

                // Place the selection right inside the empty element.
                range.moveToPosition(collapsedElement, CKEDITOR.POSITION_BEFORE_END);

                return;
            }

            var elementName = style.element,
                def = style._.definition,
                isUnknownElement;

            // Indicates that fully selected read-only elements are to be included in the styling range.
            var ignoreReadonly = def.ignoreReadonly,
                includeReadonly = ignoreReadonly || def.includeReadonly;

            // If the read-only inclusion is not available in the definition, try
            // to get it from the root data (most often it's the editable).
            if (includeReadonly == null)
                includeReadonly = range.root.getCustomData("cke_includeReadonly");

            // Get the DTD definition for the element. Defaults to "span".
            var dtd = CKEDITOR.dtd[elementName];
            if (!dtd) {
                isUnknownElement = true;
                dtd = CKEDITOR.dtd.span;
            }

            // Expand the range.
            range.enlarge(CKEDITOR.ENLARGE_INLINE, 1);
            range.trim();

            // Get the first node to be processed and the last, which concludes the processing.
            var boundaryNodes = range.createBookmark(),
                firstNode = boundaryNodes.startNode,
                lastNode = boundaryNodes.endNode,
                currentNode = firstNode,
                styleRange;

            if (!ignoreReadonly) {
                // Check if the boundaries are inside non stylable elements.
                var root = range.getCommonAncestor(),
                    firstUnstylable = this.getUnstylableParent(firstNode, root),
                    lastUnstylable = this.getUnstylableParent(lastNode, root);

                // If the first element can't be styled, we'll start processing right
                // after its unstylable root.
                if (firstUnstylable)
                    currentNode = firstUnstylable.getNextSourceNode(true);

                // If the last element can't be styled, we'll stop processing on its
                // unstylable root.
                if (lastUnstylable)
                    lastNode = lastUnstylable;
            }

            // Do nothing if the current node now follows the last node to be processed.
            if (currentNode.getPosition(lastNode) == CKEDITOR.POSITION_FOLLOWING)
                currentNode = 0;

            var isFormatStyles = this.FORMAT_STYLES.find(s => s.style === style);
            while (currentNode) {
                var applyStyle = false;

                if (currentNode.equals(lastNode)) {
                    currentNode = null;
                    applyStyle = true;
                } else {
                    var nodeName = currentNode.type == CKEDITOR.NODE_ELEMENT ? currentNode.getName() : null,
                        nodeIsReadonly = nodeName && (currentNode.getAttribute("contentEditable") == "false"),
                        nodeIsNoStyle = nodeName && currentNode.getAttribute("data-nostyle");

                    // Skip bookmarks or comments.
                    if ((nodeName && currentNode.data("cke-bookmark")) || (currentNode.type === CKEDITOR.NODE_COMMENT)) {
                        currentNode = currentNode.getNextSourceNode(true);
                        continue;
                    }

                    // Find all nested editables of a non-editable block and apply this style inside them.
                    if (nodeIsReadonly && includeReadonly && CKEDITOR.dtd.$block[nodeName])
                        this.applyStyleOnNestedEditables(editor, currentNode, style);

                    // Check if the current node can be a child of the style element.
                    if (this.checkIfNodeCanBeChildOfStyle(def, currentNode, lastNode, nodeName, dtd, nodeIsNoStyle, nodeIsReadonly, includeReadonly)) {
                        var currentParent = currentNode.getParent();

                        // Check if the style element can be a child of the current
                        // node parent or if the element is not defined in the DTD.
                        if (this.checkIfStyleCanBeChildOf(def, currentParent, elementName, isUnknownElement) &&
                            !core.isTrackChangeElement(currentParent, core.DELETE_ACTION)) {
                            // This node will be part of our range, so if it has not
                            // been started, place its start right before the node.
                            // In the case of an element node, it will be included
                            // only if it is entirely inside the range.
                            if (!styleRange && this.checkIfStartsRange(nodeName, currentNode, lastNode)) {
                                styleRange = range.clone();
                                styleRange.setStartBefore(currentNode);
                            }

                            // Non element nodes, readonly elements, or empty
                            // elements can be added completely to the range.
                            if (this.checkIfTextOrReadonlyOrEmptyElement(currentNode, nodeIsReadonly)) {
                                var includedNode = currentNode;
                                var parentNode;

                                // This node is about to be included completely, but,
                                // if this is the last node in its parent, we must also
                                // check if the parent itself can be added completely
                                // to the range, otherwise apply the style immediately.
                                while (
                                    (applyStyle = !includedNode.getNext(this.notBookmark)) &&
                                    (parentNode = includedNode.getParent(), dtd[parentNode.getName()]) &&
                                    this.checkPositionAndRule(parentNode, firstNode, def, this.posFollowingIdenticalContained)
                                    ) {
                                    includedNode = parentNode;
                                }

                                styleRange.setEndAfter(includedNode);

                            }
                        } else {
                            applyStyle = true;
                        }
                    }
                        // Style isn't applicable to current element, so apply style to
                        // range ending at previously chosen position, or nowhere if we haven't
                    // yet started styleRange.
                    else {
                        applyStyle = true;
                    }

                    // Get the next node to be processed.
                    // If we're currently on a non-editable element or non-styleable element,
                    // then we'll be moved to current node's sibling (or even further), so we'll
                    // avoid messing up its content.
                    currentNode = currentNode.getNextSourceNode(nodeIsNoStyle || nodeIsReadonly);
                }

                // Apply the style if we have something to which apply it.
                if (applyStyle && styleRange && !styleRange.collapsed) {
                    // Build the style element, based on the style object definition.
                    var styleNode = this.getElement(style, document),
                        styleHasAttrs = styleNode.hasAttributes();

                    // Get the element that holds the entire range.
                    var parent = styleRange.getCommonAncestor();

                    var removeList = {
                        styles: {},
                        attrs: {},
                        // Styles cannot be removed.
                        blockedStyles: {},
                        // Attrs cannot be removed.
                        blockedAttrs: {}
                    };

                    var attName, styleName, value;

                    // Loop through the parents, removing the redundant attributes
                    // from the element to be applied.
                    while (styleNode && parent) {
                        if (parent.getName() == elementName) {
                            for (attName in def.attributes) {
                                if (removeList.blockedAttrs[attName] || !(value = parent.getAttribute(styleName)))
                                    continue;

                                if (styleNode.getAttribute(attName) == value)
                                    removeList.attrs[attName] = 1;
                                else
                                    removeList.blockedAttrs[attName] = 1;
                            }

                            for (styleName in def.styles) {
                                if (removeList.blockedStyles[styleName] || !(value = parent.getStyle(styleName)))
                                    continue;

                                if (styleNode.getStyle(styleName) == value)
                                    removeList.styles[styleName] = 1;
                                else
                                    removeList.blockedStyles[styleName] = 1;
                            }
                        }

                        parent = parent.getParent();
                    }

                    for (attName in removeList.attrs)
                        styleNode.removeAttribute(attName);

                    for (styleName in removeList.styles)
                        styleNode.removeStyle(styleName);

                    if (styleHasAttrs && !styleNode.hasAttributes())
                        styleNode = null;

                    if (styleNode) {
                        if (!isFormatStyles) {
                            if (core.isTrackChangeElement(styleRange.startContainer, core.INSERT_ACTION) && styleRange.startContainer.$.getAttribute(core.UID_ATTR) === core.getUserAndId(editor)[1]) {
                                styleRange.extractContents();
                            } else {
                                // Move the contents of the range to the style element.
                                styleRange.extractContents().appendTo(styleNode);

                                // Insert it into the range position (it is collapsed after
                                // extractContents.
                                styleRange.insertNode(styleNode);
                            }
                        } else {
                            var content = styleRange.extractContents();
                            var tcElement = styleRange.getCommonAncestor().$.closest(core.TRACKCHANGES_ELEMENT_SELECTOR);
                            var isInsideTcInsert = tcElement && (tcElement.getAttribute(core.ACTION_ATTR) === core.INSERT_ACTION);
                            var deleteTcElement;

                            if (!isInsideTcInsert) {
                                var deleteTcStyle = new CKEDITOR.style({
                                    element: core.TRACKCHANGES_ELEMENT,
                                    attributes: core.getTrackChangeAttributes(editor, core.DELETE_ACTION)
                                });
                                deleteTcElement = this.getElement(deleteTcStyle, document);
                                content.clone(true).appendTo(deleteTcElement);
                            }

                            content.appendTo(styleNode);

                            var insertTcStyle = new CKEDITOR.style({
                                element: core.TRACKCHANGES_ELEMENT,
                                attributes: core.getTrackChangeAttributes(editor, core.INSERT_ACTION)
                            });
                            var insertTcElement = this.getElement(insertTcStyle, document);
                            insertTcElement.append(styleNode);

                            styleRange.insertNode(insertTcElement);
                            if (!isInsideTcInsert) {
                                styleRange.insertNode(deleteTcElement);
                            }
                        }

                        // Here we do some cleanup, removing all duplicated
                        // elements from the style element.
                        this.removeFromInsideElement(editor, style, styleNode);

                        // Let's merge our new style with its neighbors, if possible.
                        styleNode.mergeSiblings();

                        // As the style system breaks text nodes constantly, let's normalize
                        // things for performance.
                        // With IE, some paragraphs get broken when calling normalize()
                        // repeatedly. Also, for IE, we must normalize body, not documentElement.
                        // IE is also known for having a "crash effect" with normalize().
                        // We should try to normalize with IE too in some way, somewhere.
                        if (!CKEDITOR.env.ie)
                            styleNode.$.normalize();

                        // Remove style node if does not contain any children
                        if (styleNode.getChildCount() === 0) {
                            styleNode.remove();
                        }
                    }
                    // Style already inherit from parents, left just to clear up any internal overrides. (https://dev.ckeditor.com/ticket/5931)
                    else {
                        styleNode = new CKEDITOR.dom.element("span");
                        styleRange.extractContents().appendTo(styleNode);
                        styleRange.insertNode(styleNode);
                        this.removeFromInsideElement(editor, style, styleNode);
                        styleNode.remove(true);
                    }

                    // Style applied, let's release the range, so it gets
                    // re-initialization in the next loop.
                    styleRange = null;
                }
            }

            // Remove the bookmark nodes.
            range.moveToBookmark(boundaryNodes);

            // Minimize the result range to exclude empty text nodes. (https://dev.ckeditor.com/ticket/5374)
            range.shrink(CKEDITOR.SHRINK_TEXT);

            // Get inside the remaining element if range.shrink( TEXT ) has failed because of non-editable elements inside.
            // E.g. range.shrink( TEXT ) will not get inside:
            // [<b><i contenteditable="false">x</i></b>]
            // but range.shrink( ELEMENT ) will.
            range.shrink(CKEDITOR.NODE_ELEMENT, true);
        },

        removeInlineStyle: function(editor, range, style) {
            // Make sure our range has included all "collpased" parent inline nodes so
            // that our operation logic can be simpler.
            range.enlarge(CKEDITOR.ENLARGE_INLINE, 1);

            var bookmark = range.createBookmark(),
                startNode = bookmark.startNode,
                alwaysRemoveElement = style._.definition.alwaysRemoveElement;

            if (range.collapsed) {
                var startPath = new CKEDITOR.dom.elementPath(startNode.getParent(), range.root),
                    // The topmost element in elements path which we should jump out of.
                    boundaryElement;

                for (var i = 0, element; i < startPath.elements.length && (element = startPath.elements[i]); i++) {
                    // 1. If it's collaped inside text nodes, try to remove the style from the whole element.
                    //
                    // 2. Otherwise if it's collapsed on element boundaries, moving the selection
                    //  outside the styles instead of removing the whole tag,
                    //  also make sure other inner styles were well preserved.(https://dev.ckeditor.com/ticket/3309)
                    //
                    // 3. Force removing the element even if it's an boundary element when alwaysRemoveElement is true.
                    // Without it, the links won't be unlinked if the cursor is placed right before/after it. (https://dev.ckeditor.com/ticket/13062)
                    if (element == startPath.block || element == startPath.blockLimit) {
                        break;
                    }

                    if (this.checkElementRemovable(element, false, style)) {
                        var isStart;

                        if (!alwaysRemoveElement && range.collapsed && (range.checkBoundaryOfElement(element, CKEDITOR.END) || (isStart = range.checkBoundaryOfElement(element, CKEDITOR.START)))) {
                            boundaryElement = element;
                            boundaryElement.match = isStart ? "start" : "end";
                        } else {
                            // Before removing the style node, there may be a sibling to the style node
                            // that's exactly the same to the one to be removed. To the user, it makes
                            // no difference that they're separate entities in the DOM tree. So, merge
                            // them before removal.
                            element.mergeSiblings();
                            if (element.is(style.element)) {
                                this.removeFromElement(editor, style, element);
                            } else {
                                this.removeOverrides(element, this.getOverrides(style)[element.getName()]);
                            }
                        }
                    }
                }

                // Re-create the style tree after/before the boundary element,
                // the replication start from bookmark start node to define the
                // new range.
                if (boundaryElement) {
                    var clonedElement = startNode;
                    for (i = 0; ; i++) {
                        var newElement = startPath.elements[i];
                        if (newElement.equals(boundaryElement))
                            break;
                        // Avoid copying any matched element.
                        else if (newElement.match)
                            continue;
                        else
                            newElement = newElement.clone();
                        newElement.append(clonedElement);
                        clonedElement = newElement;
                    }
                    clonedElement[boundaryElement.match == "start" ? "insertBefore" : "insertAfter"](boundaryElement);
                }
            } else {
                // Now our range isn't collapsed. Lets walk from the start node to the end
                // node via DFS and remove the styles one-by-one.
                var endNode = bookmark.endNode,
                    me = this;

                breakNodes();

                // Now, do the DFS walk.
                var currentNode = startNode;
                while (!currentNode.equals(endNode)) {
                    // Need to get the next node first because removeFromElement() can remove
                    // the current node from DOM tree.
                    var nextNode = currentNode.getNextSourceNode();
                    if (currentNode.type == CKEDITOR.NODE_ELEMENT && this.checkElementRemovable(currentNode, false, style)) {
                        // Remove style from element or overriding element.
                        if (currentNode.getName() == style.element)
                            this.removeFromElement(editor, style, currentNode);
                        else
                            this.removeOverrides(currentNode, this.getOverrides(style)[currentNode.getName()]);

                        // removeFromElement() may have merged the next node with something before
                        // the startNode via mergeSiblings(). In that case, the nextNode would
                        // contain startNode and we'll have to call breakNodes() again and also
                        // reassign the nextNode to something after startNode.
                        if (nextNode.type == CKEDITOR.NODE_ELEMENT && nextNode.contains(startNode)) {
                            breakNodes();
                            nextNode = startNode.getNext();
                        }
                    }
                    currentNode = nextNode;
                }
            }

            range.moveToBookmark(bookmark);
            // See the comment for range.shrink in applyInlineStyle.
            range.shrink(CKEDITOR.NODE_ELEMENT, true);

            // Find out the style ancestor that needs to be broken down at startNode
            // and endNode.
            function breakNodes() {
                var startPath = new CKEDITOR.dom.elementPath(startNode.getParent()),
                    endPath = new CKEDITOR.dom.elementPath(endNode.getParent()),
                    breakStart = null,
                    breakEnd = null;

                for (var i = 0; i < startPath.elements.length; i++) {
                    var element = startPath.elements[ i ];

                    if (element == startPath.block || element == startPath.blockLimit)
                        break;

                    if (me.checkElementRemovable(element, true, style))
                        breakStart = element;
                }

                for (i = 0; i < endPath.elements.length; i++) {
                    element = endPath.elements[i];

                    if (element == endPath.block || element == endPath.blockLimit)
                        break;

                    if (me.checkElementRemovable(element, true, style))
                        breakEnd = element;
                }

                if (breakEnd)
                    endNode.breakParent(breakEnd);
                if (breakStart)
                    startNode.breakParent(breakStart);
            }
        },

        getElement: function(style, targetDocument, element) {
            var el,
                elementName = style.element;

            // The "*" element name will always be a span for this function.
            if (elementName == "*")
                elementName = "span";

            // Create the element.
            el = new CKEDITOR.dom.element(elementName, targetDocument);

            // https://dev.ckeditor.com/ticket/6226: attributes should be copied before the new ones are applied
            if (element)
                element.copyAttributes(el);

            el = this.setupElement(el, style);

            // Avoid ID duplication.
            if (targetDocument.getCustomData( "doc_processing_style") && el.hasAttribute("id"))
                el.removeAttribute("id");
            else
                targetDocument.setCustomData("doc_processing_style", 1);

            return el;
        },

        setupElement: function(el, style) {
            var def = style._.definition,
                attributes = def.attributes,
                styles = CKEDITOR.style.getStyleText(def);

            // Assign all defined attributes.
            if (attributes) {
                for (var att in attributes)
                    el.setAttribute(att, attributes[att]);
            }

            // Assign all defined styles.
            if (styles)
                el.setAttribute("style", styles);

            el.getDocument().removeCustomData("doc_processing_style");

            return el;
        },

        // Gets the parent element which blocks the styling for an element. This
        // can be done through read-only elements (contenteditable=false) or
        // elements with the "data-nostyle" attribute.
        getUnstylableParent: function(element, root) {
            var unstylable, editable;

            while ((element = element.getParent())) {
                if (element.equals(root))
                    break;

                if (element.getAttribute("data-nostyle"))
                    unstylable = element;
                else if (!editable) {
                    var contentEditable = element.getAttribute("contentEditable");

                    if (contentEditable == "false")
                        unstylable = element;
                    else if (contentEditable == "true")
                        editable = 1;
                }
            }

            return unstylable;
        },

        // Apply style to nested editables inside editablesContainer.
        // @param {CKEDITOR.dom.element} editablesContainer
        // @context CKEDITOR.style
        applyStyleOnNestedEditables: function(editor, editablesContainer, style) {
            var editables = this.findNestedEditables(editablesContainer),
                editable,
                l = editables.length,
                i = 0,
                range = l && new CKEDITOR.dom.range(editablesContainer.getDocument());

            for ( ; i < l; ++i ) {
                editable = editables[i];
                // Check if style is allowed by this editable's ACF.
                if (this.checkIfAllowedInEditable(editable, style)) {
                    range.selectNodeContents(editable);
                    this.applyInlineStyle(editor, range, style);
                }
            }
        },

        // Finds nested editables within container. Does not return
        // editables nested in another editable (twice).
        findNestedEditables: function(container) {
            var editables = [];

            container.forEach(function(element) {
                if (element.getAttribute("contenteditable") == "true") {
                    editables.push(element);
                    return false; // Skip children.
                }
            }, CKEDITOR.NODE_ELEMENT, true);

            return editables;
        },

        // Checks if style is allowed in this editable.
        checkIfAllowedInEditable: function(editable, style) {
            var filter = CKEDITOR.filter.instances[editable.data("cke-filter")];

            return filter ? filter.check(style) : 1;
        },

        // Checks if the current node can be a child of the style element.
        checkIfNodeCanBeChildOfStyle: function(def, currentNode, lastNode, nodeName, dtd, nodeIsNoStyle, nodeIsReadonly, includeReadonly) {
            // Style can be applied to text node.
            if (!nodeName)
                return 1;

            // Style definitely cannot be applied if DTD or data-nostyle do not allow.
            if (!dtd[nodeName] || nodeIsNoStyle)
                return 0;

            // Non-editable element cannot be styled is we shouldn't include readonly elements.
            if (nodeIsReadonly && !includeReadonly)
                return 0;

            // Check that we haven't passed lastNode yet and that style's childRule allows this style on current element.
            return this.checkPositionAndRule(currentNode, lastNode, def, this.posPrecedingIdenticalContained);
        },

        // Check if the style element can be a child of the current
        // node parent or if the element is not defined in the DTD.
        checkIfStyleCanBeChildOf: function(def, currentParent, elementName, isUnknownElement) {
            return currentParent &&
                ((currentParent.getDtd() || CKEDITOR.dtd.span)[elementName] || isUnknownElement) &&
                (!def.parentRule || def.parentRule(currentParent));
        },

        checkIfStartsRange: function(nodeName, currentNode, lastNode) {
            return (
                !nodeName || !CKEDITOR.dtd.$removeEmpty[nodeName] ||
                (currentNode.getPosition(lastNode) | this.posPrecedingIdenticalContained) == this.posPrecedingIdenticalContained
            );
        },

        checkIfTextOrReadonlyOrEmptyElement: function(currentNode, nodeIsReadonly) {
            var nodeType = currentNode.type;
            return nodeType == CKEDITOR.NODE_TEXT || nodeIsReadonly || (nodeType == CKEDITOR.NODE_ELEMENT && !currentNode.getChildCount());
        },

        // Checks if position is a subset of posBitFlags and that nodeA fulfills style def rule.
        checkPositionAndRule: function(nodeA, nodeB, def, posBitFlags) {
            return (nodeA.getPosition(nodeB) | posBitFlags) == posBitFlags &&
                (!def.childRule || def.childRule(nodeA));
        },

        // Get the the collection used to compare the elements and attributes,
        // defined in this style overrides, with other element. All information in
        // it is lowercased.
        // @param {CKEDITOR.style} style
        getOverrides: function(style) {
            if (style._.overrides)
                return style._.overrides;

            var overrides = (style._.overrides = {}),
                definition = style._.definition.overrides;

            if (definition) {
                // The override description can be a string, object or array.
                // Internally, well handle arrays only, so transform it if needed.
                if (!CKEDITOR.tools.isArray(definition))
                    definition = [definition];

                // Loop through all override definitions.
                for (var i = 0; i < definition.length; i++) {
                    var override = definition[i],
                        elementName,
                        overrideEl,
                        attrs;

                    // If can be a string with the element name.
                    if (typeof override == "string")
                        elementName = override.toLowerCase();
                    // Or an object.
                    else {
                        elementName = override.element ? override.element.toLowerCase() : style.element;
                        attrs = override.attributes;
                    }

                    // We can have more than one override definition for the same
                    // element name, so we attempt to simply append information to
                    // it if it already exists.
                    overrideEl = overrides[elementName] || (overrides[elementName] = {});

                    if (attrs) {
                        // The returning attributes list is an array, because we
                        // could have different override definitions for the same
                        // attribute name.
                        var overrideAttrs = (overrideEl.attributes = overrideEl.attributes || []);
                        for (var attName in attrs) {
                            // Each item in the attributes array is also an array,
                            // where [0] is the attribute name and [1] is the
                            // override value.
                            overrideAttrs.push([attName.toLowerCase(), attrs[attName]]);
                        }
                    }
                }
            }

            return overrides;
        },

        // Make the comparison of attribute value easier by standardizing it.
        normalizeProperty: function(name, value, isStyle) {
            var temp = new CKEDITOR.dom.element("span");
            temp[isStyle ? "setStyle" : "setAttribute"](name, value);
            return temp[isStyle ? "getStyle" : "getAttribute"](name);
        },

        // Removes a style from an element itself, don't care about its subtree.
        removeFromElement: function(editor, style, element, keepDataAttrs) {
            var def = style._.definition,
                attributes = def.attributes,
                styles = def.styles,
                overrides = this.getOverrides(style)[element.getName()],
                // If the style is only about the element itself, we have to remove the element.
                removeEmpty = CKEDITOR.tools.isEmpty(attributes) && CKEDITOR.tools.isEmpty(styles);

            // Remove definition attributes/style from the elemnt.
            for (var attName in attributes) {
                // The 'class' element value must match (https://dev.ckeditor.com/ticket/1318).
                if ((attName == "class" || style._.definition.fullMatch) && element.getAttribute(attName) != this.normalizeProperty(attName, attributes[attName]))
                    continue;

                // Do not touch data-* attributes (https://dev.ckeditor.com/ticket/11011) (https://dev.ckeditor.com/ticket/11258).
                if (keepDataAttrs && (attName.slice(0, 5) == "data-" || attName === "title"))
                    continue;

                removeEmpty = element.hasAttribute(attName);
                element.removeAttribute(attName);
            }

            for (var styleName in styles) {
                // Full match style insist on having fully equivalence. (https://dev.ckeditor.com/ticket/5018)
                if (style._.definition.fullMatch && element.getStyle(styleName) != this.normalizeProperty(styleName, styles[styleName], true))
                    continue;

                removeEmpty = removeEmpty || !!element.getStyle(styleName);
                element.removeStyle(styleName);
            }

            // Remove overrides, but don't remove the element if it's a block element
            this.removeOverrides(element, overrides, this.blockElements[element.getName()]);

            if (removeEmpty) {
                if (style._.definition.alwaysRemoveElement )
                    this.removeNoAttribsElement(element, 1);
                else {
                    if (!CKEDITOR.dtd.$block[element.getName()] || style._.enterMode == CKEDITOR.ENTER_BR && !element.hasAttributes())
                        this.removeNoAttribsElement(element);
                    else
                        element.renameNode(style._.enterMode == CKEDITOR.ENTER_P ? "p" : "div");
                }
            }

            if (element.getAttribute(core.ACTION_ATTR) === core.INSERT_ACTION
                && element.getAttribute(core.UID_ATTR) === core.getUserAndId(editor)[1]) {
                element.remove(false);
            }

        },

        // Removes a style from inside an element. Called on applyStyle to make cleanup
        // before apply. During clean up this function keep data-* attribute in contrast
        // to removeFromElement.
        removeFromInsideElement: function(editor, style, element) {
            var overrides = this.getOverrides(style),
                innerElements = element.getElementsByTag(style.element),
                innerElement;

            for (var i = innerElements.count(); --i >= 0;) {
                innerElement = innerElements.getItem(i);

                // Do not remove elements which are read only (e.g. duplicates inside widgets).
                if (!innerElement.isReadOnly())
                    this.removeFromElement(editor, style, innerElement, true);
            }

            // Now remove any other element with different name that is
            // defined to be overriden.
            for (var overrideElement in overrides) {
                if (overrideElement != style.element) {
                    innerElements = element.getElementsByTag(overrideElement);

                    for (i = innerElements.count() - 1; i >= 0; i--) {
                        innerElement = innerElements.getItem(i);

                        // Do not remove elements which are read only (e.g. duplicates inside widgets).
                        if (!innerElement.isReadOnly())
                            this.removeOverrides(innerElement, overrides[overrideElement]);
                    }
                }
            }
        },

        // Remove overriding styles/attributes from the specific element.
        // Note: Remove the element if no attributes remain.
        // @param {Object} element
        // @param {Object} overrides
        // @param {Boolean} Don't remove the element
        removeOverrides: function(element, overrides, dontRemove) {
            var attributes = overrides && overrides.attributes;

            if (attributes) {
                for (var i = 0; i < attributes.length; i++) {
                    var attName = attributes[i][0],
                        actualAttrValue;

                    if ((actualAttrValue = element.getAttribute(attName))) {
                        var attValue = attributes[i][1];

                        // Remove the attribute if:
                        //    - The override definition value is null ;
                        //    - The override definition valie is a string that
                        //      matches the attribute value exactly.
                        //    - The override definition value is a regex that
                        //      has matches in the attribute value.
                        if (attValue === null || (attValue.test && attValue.test(actualAttrValue)) || (typeof attValue == "string" && actualAttrValue == attValue))
                            element.removeAttribute(attName);
                    }
                }
            }

            if (!dontRemove)
                this.removeNoAttribsElement(element);
        },

        // If the element has no more attributes, remove it.
        removeNoAttribsElement: function(element, forceRemove) {
            // If no more attributes remained in the element, remove it,
            // leaving its children.
            if (!element.hasAttributes() || forceRemove
                || ((element.getAttribute(core.ACTION_ATTR) === core.DELETE_ACTION) && !element.getId())) {
                if (CKEDITOR.dtd.$block[element.getName()]) {
                    var previous = element.getPrevious(this.nonWhitespaces),
                        next = element.getNext(this.nonWhitespaces);

                    if (previous && (previous.type == CKEDITOR.NODE_TEXT || !previous.isBlockBoundary({ br: 1 })))
                        element.append("br", 1);
                    if (next && (next.type == CKEDITOR.NODE_TEXT || !next.isBlockBoundary({ br: 1 })))
                        element.append("br");

                    element.remove(true);
                } else {
                    // Removing elements may open points where merging is possible,
                    // so let's cache the first and last nodes for later checking.
                    var firstChild = element.getFirst();
                    var lastChild = element.getLast();

                    element.remove(true);

                    if (firstChild) {
                        // Check the cached nodes for merging.
                        firstChild.type == CKEDITOR.NODE_ELEMENT && firstChild.mergeSiblings();

                        if (lastChild && !firstChild.equals(lastChild) && lastChild.type == CKEDITOR.NODE_ELEMENT)
                            lastChild.mergeSiblings();
                    }

                }
            }
        },

        checkElementRemovable: function(element, fullMatch, style) {
            // Check element matches the style itself.
            if (this.checkElementMatch(element, fullMatch, style))
                return true;

            // Check if the element matches the style overrides.
            var override = this.getOverrides(style)[element.getName()];
            if (override) {
                var attribs, attName;

                // If no attributes have been defined, remove the element.
                if (!(attribs = override.attributes))
                    return true;

                for (var i = 0; i < attribs.length; i++) {
                    attName = attribs[i][0];
                    var actualAttrValue = element.getAttribute(attName);
                    if (actualAttrValue) {
                        var attValue = attribs[i][1];

                        // Remove the attribute if:
                        //    - The override definition value is null;
                        //    - The override definition value is a string that
                        //      matches the attribute value exactly.
                        //    - The override definition value is a regex that
                        //      has matches in the attribute value.
                        if (attValue === null)
                            return true;
                        if (typeof attValue == "string") {
                            if (actualAttrValue == attValue)
                                return true;
                        } else if (attValue.test(actualAttrValue)) {
                            return true;
                        }
                    }
                }
            }
            return false;
        },

        checkElementMatch: function(element, fullMatch, style) {
            var def = style._.definition;

            if (!element || !def.ignoreReadonly && element.isReadOnly())
                return false;

            var attribs,
                name = element.getName();

            // If the element name is the same as the style name.
            if (typeof style.element == "string" ? name == style.element : name in style.element) {
                // If no attributes are defined in the element.
                if (!fullMatch && !element.hasAttributes())
                    return true;

                attribs = this.getAttributesForComparison(def);

                if (attribs._length) {
                    for (var attName in attribs) {
                        if (attName == "_length")
                            continue;

                        var elementAttr = element.getAttribute(attName) || "";

                        // Special treatment for 'style' attribute is required.
                        if (attName == "style" ? this.compareCssText(attribs[attName], elementAtt ) : attribs[attName] == elementAttr) {
                            if (!fullMatch)
                                return true;
                        } else if (fullMatch) {
                            return false;
                        }
                    }
                    if (fullMatch)
                        return true;
                } else {
                    return true;
                }
            }

            return false;
        },

        getAttributesForComparison: function(styleDefinition) {
            // If we have already computed it, just return it.
            var attribs = styleDefinition._AC;
            if (attribs)
                return attribs;

            attribs = {};

            var length = 0;

            // Loop through all defined attributes.
            var styleAttribs = styleDefinition.attributes;
            if (styleAttribs) {
                for (var styleAtt in styleAttribs) {
                    length++;
                    attribs[styleAtt] = styleAttribs[styleAtt];
                }
            }

            // Includes the style definitions.
            var styleText = CKEDITOR.style.getStyleText(styleDefinition);
            if (styleText) {
                if (!attribs.style)
                    length++;
                attribs.style = styleText;
            }

            // Appends the "length" information to the object.
            attribs._length = length;

            // Return it, saving it to the next request.
            return (styleDefinition._AC = attribs);
        },

        compareCssText: function(source, target) {
            function filter(string, propertyName) {
                // In case of font-families we'll skip quotes. (https://dev.ckeditor.com/ticket/10750)
                return propertyName.toLowerCase() == "font-family" ? string.replace( /["']/g, "") : string;
            }

            if (typeof source == "string")
                source = CKEDITOR.tools.parseCssText(source);
            if (typeof target == "string")
                target = CKEDITOR.tools.parseCssText(target, true);

            for (var name in source) {
                if (!(name in target)) {
                    return false;
                }

                if (!(filter(target[name], name) == filter(source[name], name) ||
                    source[name] == "inherit" ||
                    target[name] == "inherit")) {
                    return false;
                }
            }
            return true;
        }

    };

    return {
        style : style
    };
});
