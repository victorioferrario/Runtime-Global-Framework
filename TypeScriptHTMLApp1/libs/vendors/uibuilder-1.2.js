var UIBuilder;
(function (UIBuilder) {
    var Component = (function () {
        function Component(props) {
            this.props = props;
        }
        Component.prototype.render = function () {
            return null;
        };
        return Component;
    }());
    UIBuilder.Component = Component;
    function createElement(type, props) {
        var children = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            children[_i - 2] = arguments[_i];
        }
        var node;
        if (typeof type === 'function') {
            var _props = UIBuilder.clone(props);
            _props.children = children;
            var component = new type(_props);
            node = component.render();
        }
        else {
            node = document.createElement(type);
            applyProps(node, props);
            for (var _a = 0, children_1 = children; _a < children_1.length; _a++) {
                var child = children_1[_a];
                if (child instanceof Node) {
                    node.appendChild(child);
                }
                else if (Array.isArray(child)) {
                    for (var _b = 0, child_1 = child; _b < child_1.length; _b++) {
                        var item = child_1[_b];
                        node.appendChild(item);
                    }
                }
                else {
                    node.appendChild(document.createTextNode(child));
                }
            }
        }
        return node;
    }
    UIBuilder.createElement = createElement;
    function applyProps(node, props) {
        for (var prop in props) {
            if (prop === 'ref') {
                if (typeof props[prop] === 'function') {
                    props[prop](node);
                }
                else {
                    throw new Error("'prop' must be a function");
                }
            }
            else if (eventMap.hasOwnProperty(prop)) {
                node[eventMap[prop]] = props[prop];
            }
            else if (prop === 'style') {
                var style = props[prop];
                for (var styleName in style) {
                    node.style[styleName] = style[styleName];
                }
            }
            else {
                var attrib = attribMap.hasOwnProperty(prop) ? attribMap[prop] : prop;
                node.setAttribute(attrib, props[prop]);
            }
        }
    }
    var attribMap = {
        'htmlFor': 'for',
        'className': 'class',
        'defaultValue': 'value',
        'defaultChecked': 'checked'
    };
    var eventMap = {
        // Clipboard events
        'onCopy': 'oncopy',
        'onCut': 'oncut',
        'onPaste': 'onpaste',
        // Keyboard events
        'onKeyDown': 'onkeydown',
        'onKeyPress': 'onkeypress',
        'onKeyUp': 'onkeyup',
        // Focus events
        'onFocus': 'onfocus',
        'onBlur': 'onblur',
        // Form events
        'onChange': 'onchange',
        'onInput': 'oninput',
        'onSubmit': 'onsubmit',
        // Mouse events
        'onClick': 'onclick',
        'onContextMenu': 'oncontextmenu',
        'onDoubleClick': 'ondblclick',
        'onDrag': 'ondrag',
        'onDragEnd': 'ondragend',
        'onDragEnter': 'ondragenter',
        'onDragExit': 'ondragexit',
        'onDragLeave': 'ondragleave',
        'onDragOver': 'ondragover',
        'onDragStart': 'ondragstart',
        'onDrop': 'ondrop',
        'onMouseDown': 'onmousedown',
        'onMouseEnter': 'onmouseenter',
        'onMouseLeave': 'onmouseleave',
        'onMouseMove': 'onmousemove',
        'onMouseOut': 'onmouseout',
        'onMouseOver': 'onmouseover',
        'onMouseUp': 'onmouseup',
        // Selection events
        'onSelect': 'onselect',
        // Touch events
        'onTouchCancel': 'ontouchcancel',
        'onTouchEnd': 'ontouchend',
        'onTouchMove': 'ontouchmove',
        'onTouchStart': 'ontouchstart',
        // UI events
        'onScroll': 'onscroll',
        // Wheel events
        'onWheel': 'onwheel',
        // Media events
        'onAbort': 'onabort',
        'onCanPlay': 'oncanplay',
        'onCanPlayThrough': 'oncanplaythrough',
        'onDurationChange': 'ondurationchange',
        'onEmptied': 'onemptied',
        'onEncrypted': 'onencrypted',
        'onEnded': 'onended',
        'onLoadedData': 'onloadeddata',
        'onLoadedMetadata': 'onloadedmetadata',
        'onLoadStart': 'onloadstart',
        'onPause': 'onpause',
        'onPlay': 'onplay',
        'onPlaying': 'onplaying',
        'onProgress': 'onprogress',
        'onRateChange': 'onratechange',
        'onSeeked': 'onseeked',
        'onSeeking': 'onseeking',
        'onStalled': 'onstalled',
        'onSuspend': 'onsuspend',
        'onTimeUpdate': 'ontimeupdate',
        'onVolumeChange': 'onvolumechange',
        'onWaiting': 'onwaiting',
        // Image events
        'onLoad': 'onload',
        'onError': 'onerror'
    };
})(UIBuilder || (UIBuilder = {}));
var UIBuilder;
(function (UIBuilder) {
    function clone(obj) {
        var target = {};
        for (var field in obj) {
            if (obj.hasOwnProperty(field)) {
                target[field] = obj[field];
            }
        }
        return target;
    }
    UIBuilder.clone = clone;
})(UIBuilder || (UIBuilder = {}));
