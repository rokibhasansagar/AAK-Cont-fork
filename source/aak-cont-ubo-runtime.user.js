// ==UserScript==
// @name AAK-Cont uBlock Origin Runtime for AdBlock / Adblock Plus
// @namespace https://userscripts.org/scripts/show/155840
// @description Helps AdBlock / Adblock Plus to handle uBlock Origin filters
// @author jspenguin2017, based on work of gorhill
// @version 1.002
// @encoding utf-8
// @license https://github.com/uBlockOrigin/uAssets/blob/master/LICENSE
// @icon https://gitlab.com/xuhaiyang1234/AAK-Cont/raw/master/images/icon.png
// @homepage https://xuhaiyang1234.gitlab.io/AAK-Cont/
// @supportURL https://gitlab.com/xuhaiyang1234/AAK-Cont/issues
// @updateURL https://gitlab.com/xuhaiyang1234/AAK-Cont/raw/master/source/aak-cont-ubo-runtime.user.js
// @downloadURL https://gitlab.com/xuhaiyang1234/AAK-Cont/raw/master/source/aak-cont-ubo-runtime.user.js
// @include http://*/*
// @include https://*/*
// @grant none
// @run-at document-start
// @connect *
// ==/UserScript==

(function () {
    var util = {
        dropScript: function (txt, scriptDropMode) {
            //scriptDropMode: undefined = autodetect, 1 for force eval, 2 for force drop element
            var forceEval = function (txt) {
                unsafeWindow.eval(txt);
            };
            var forceDrop = function (txt) {
                var script = document.createElement('script');
                script.type = "text/javascript";
                script.innerHTML = "(" + String(txt) + ")();";
                if (body) {
                    document.body.appendChild(script);
                } else {
                    document.head.appendChild(script);
                }
                script.remove();
            };
            if (!scriptDropMode) {
                if (unsafeWindow && util.getScriptManager() === "Tampermonkey") {
                    forceEval(txt);
                } else {
                    forceDrop(txt);
                }
            } else if (scriptDropMode === 1) {
                forceEval(txt);
            } else {
                forceDrop(txt);
            }
        },
        getScriptManager: function () {
            if (typeof GM_info == 'object') {
                // Greasemonkey (Firefox)
                if (typeof GM_info.uuid != 'undefined') {
                    return 'Greasemonkey';
                } // Tampermonkey (Chrome/Opera)
                else if (typeof GM_info.scriptHandler != 'undefined') {
                    return 'Tampermonkey';
                }
            } else {
                // Scriptish (Firefox)
                if (typeof GM_getMetadata == 'function') {
                    return 'Scriptish';
                } // NinjaKit (Safari/Chrome)
                else if (typeof GM_setValue != 'undefined' &&
                    typeof GM_getResourceText == 'undefined' &&
                    typeof GM_getResourceURL == 'undefined' &&
                    typeof GM_openInTab == 'undefined' &&
                    typeof GM_setClipboard == 'undefined') {
                    return 'NinjaKit';
                } else { // Native
                    return 'Native';
                }
            }
        },
        domCmp: function (domain) {
            return domain === location.hostname || location.hostname.endsWith("." + domain);
        }
    };
    var ubo = {
        setTimeout_defuser: function (niddle, delay, scriptDropMode) {
            var uSol = function () {
                var z = window.setTimeout,
                    needle = '{{1}}',
                    delay = parseInt('{{2}}', 10);
                if (needle === '') {  // || needle === '{{1}}' ) {
                    needle = '.?';
                } else if (needle.slice(0, 1) === '/' && needle.slice(-1) === '/') {
                    needle = needle.slice(1, -1);
                } else {
                    needle = needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                }
                needle = new RegExp(needle);
                window.setTimeout = function (a, b) {
                    if ((isNaN(delay) || b == delay) && needle.test(a.toString())) {
                        return 0;
                    }
                    return z(a, b);
                }.bind(window);
            };
            var str = String(uSol).replace("{{1}}", String(niddle || "")).replace("{{2}}", String(delay));
            util.dropScript(str, scriotDropMode);
        },
        abort_on_property_read: function (niddle, scriptDropMode) {
            var uSol = function () {
                var magic = String.fromCharCode(Date.now() % 26 + 97) +
                    Math.floor(Math.random() * 982451653 + 982451653).toString(36);
                var abort = function () {
                    throw new ReferenceError(magic);
                };
                var chain = '{{1}}', owner = window, pos, desc;
                var makeProxy = function (owner, chain) {
                    pos = chain.indexOf('.');
                    if (pos === -1) {
                        desc = Object.getOwnPropertyDescriptor(owner, chain);
                        if (!desc || desc.get !== abort) {
                            Object.defineProperty(owner, chain, { get: abort, set: function () { } });
                        }
                        return;
                    }
                    var prop = chain.slice(0, pos),
                        v = owner[prop];
                    chain = chain.slice(pos + 1);
                    if (v !== undefined) {
                        makeProxy(v, chain);
                        return;
                    }
                    desc = Object.getOwnPropertyDescriptor(owner, prop);
                    if (desc && desc.set && desc.set.hasOwnProperty(magic)) {
                        return;
                    }
                    var setter = function (a) {
                        v = a;
                        if (a instanceof Object) {
                            makeProxy(a, chain);
                        }
                    };
                    setter[magic] = undefined;
                    Object.defineProperty(owner, prop, {
                        get: function () { return v; },
                        set: setter
                    });
                };
                makeProxy(owner, chain);
                var oe = window.onerror;
                window.onerror = function (msg, src, line, col, error) {
                    if (typeof msg === 'string' && msg.indexOf(magic) !== -1) {
                        return true;
                    }
                    if (oe instanceof Function) {
                        return oe(msg, src, line, col, error);
                    }
                }.bind();
            };
            var str = String(uSol).replace("{{1}}", String(niddle));
            util.dropScript(str, scriotDropMode);
        },
        abort_on_property_write: function (niddle, scriptDropMode) {
            var uSol = function () {
                var magic = String.fromCharCode(Date.now() % 26 + 97) +
                    Math.floor(Math.random() * 982451653 + 982451653).toString(36);
                var prop = '{{1}}',
                    owner = window,
                    pos;
                for (; ;) {
                    pos = prop.indexOf('.');
                    if (pos === -1) { break; }
                    owner = owner[prop.slice(0, pos)];
                    if (owner instanceof Object === false) { return; }
                    prop = prop.slice(pos + 1);
                }
                delete owner[prop];
                Object.defineProperty(owner, prop, {
                    set: function () {
                        throw new ReferenceError(magic);
                    }
                });
                var oe = window.onerror;
                window.onerror = function (msg, src, line, col, error) {
                    if (typeof msg === 'string' && msg.indexOf(magic) !== -1) {
                        return true;
                    }
                    if (oe instanceof Function) {
                        return oe(msg, src, line, col, error);
                    }
                }.bind();
            };
            var str = String(uSol).replace("{{1}}", String(niddle));
            util.dropScript(str, scriotDropMode);
        }
    };
    //Rules
    if (util.domCmp("thewindowsclub.com")) {
        ubo.setTimeout_defuser("[native code]");
    }
    if (util.domCmp("kbb.com")) {
        ubo.abort_on_property_write("KBB.DetectBlockerExtensions");
    }
    if (util.domCmp("gamesradar.com")) {
        ubo.abort-on-property-write("_sp_");
    }
    if (util.domCmp("pwn.pl")) {
        ubo.abort_on_property_read("adblock");
    }

})();
