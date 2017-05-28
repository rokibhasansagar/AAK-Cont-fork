// ==UserScript==
// @name AAK-Cont uBlock Origin Runtime for AdBlock / Adblock Plus
// @namespace https://userscripts.org/scripts/show/155840
// @description Helps AdBlock / Adblock Plus to handle uBlock Origin filters
// @author jspenguin2017, based on work of gorhill
// @version 1.003
// @encoding utf-8
// @license https://github.com/uBlockOrigin/uAssets/blob/master/LICENSE
// @icon https://gitlab.com/xuhaiyang1234/AAK-Cont/raw/master/images/icon.png
// @homepage https://xuhaiyang1234.gitlab.io/AAK-Cont/
// @supportURL https://gitlab.com/xuhaiyang1234/AAK-Cont/issues
// @updateURL https://gitlab.com/xuhaiyang1234/AAK-Cont/raw/master/source/aak-cont-ubo-runtime.user.js
// @downloadURL https://gitlab.com/xuhaiyang1234/AAK-Cont/raw/master/source/aak-cont-ubo-runtime.user.js
// @include http://*/*
// @include https://*/*
// @grant unsafeWindow
// @run-at document-start
// @connect *
// ==/UserScript==

(function () {
    //=====START UTIL=====
    var util = {
        dropScript: function (txt, scriptDropMode) {
            //scriptDropMode: undefined = autodetect, 1 for force eval, 2 for force drop element
            var forceEval = function (txt) {
                unsafeWindow.eval("(" + txt + ")();");
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
            if (typeof GM_info === 'object') {
                // Greasemonkey (Firefox)
                if (typeof GM_info.uuid !== 'undefined') {
                    return 'Greasemonkey';
                } // Tampermonkey (Chrome/Opera)
                else if (typeof GM_info.scriptHandler !== 'undefined') {
                    return 'Tampermonkey';
                }
            } else {
                // Scriptish (Firefox)
                if (typeof GM_getMetadata === 'function') {
                    return 'Scriptish';
                } // NinjaKit (Safari/Chrome)
                else if (typeof GM_setValue !== 'undefined' &&
                    typeof GM_getResourceText === 'undefined' &&
                    typeof GM_getResourceURL === 'undefined' &&
                    typeof GM_openInTab === 'undefined' &&
                    typeof GM_setClipboard === 'undefined') {
                    return 'NinjaKit';
                } else { // Native
                    return 'Native';
                }
            }
        },
        domCmp: function (domain) {
            return domain === location.hostname || location.hostname.endsWith("." + domain);
        },
        patchToString: function () {
            //Implementation wanted.
            //Patch Function.prototype.toString so our modification can't be detected by the page script
        }
    };
    //=====START CORE RUNTIME=====
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
            util.dropScript(str, scriptDropMode);
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
            util.dropScript(str, scriptDropMode);
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
            util.dropScript(str, scriptDropMode);
        },
        bab_defuser: function (scriptDropMode) {
            var uSol = function () {
                var sto = window.setTimeout,
                    re = /\.bab_elementid.$/;
                window.setTimeout = function (a, b) {
                    if (typeof a !== 'string' || !re.test(a)) {
                        return sto(a, b);
                    }
                }.bind(window);
                var signatures = [
                    ['blockadblock'],
                    ['babasbm'],
                    [/getItem\('babn'\)/],
                    [
                        'getElementById',
                        'String.fromCharCode',
                        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
                        'charAt',
                        'DOMContentLoaded',
                        'AdBlock',
                        'addEventListener',
                        'doScroll',
                        'fromCharCode',
                        '<<2|r>>4',
                        'sessionStorage',
                        'clientWidth',
                        'localStorage',
                        'Math',
                        'random'
                    ]
                ];
                var check = function (s) {
                    var tokens, match, j, token, pos;
                    for (var i = 0; i < signatures.length; i++) {
                        tokens = signatures[i];
                        match = 0;
                        for (j = 0, pos = 0; j < tokens.length; j++) {
                            token = tokens[j];
                            pos = token instanceof RegExp ? s.search(token) : s.indexOf(token);
                            if (pos !== -1) { match += 1; }
                        }
                        if ((match / tokens.length) >= 0.8) { return true; }
                    }
                    return false;
                };
                var realEval = window.eval;
                window.eval = function (a) {
                    if (!check(a)) {
                        return realEval(a);
                    }
                    var el = document.body;
                    if (el) {
                        el.style.removeProperty('visibility');
                    }
                    el = document.getElementById('babasbmsgx');
                    if (el) {
                        el.parentNode.removeChild(el);
                    }
                }.bind(window);
            };
            var str = String(uSol);
            util.dropScript(str, scriptDropMode);
        },
        noeval: function (scriptDropMode) {
            var uSol = function () {
                window.eval = function (s) {
                    console.log('Document tried to eval... \n' + s);
                }.bind(window);
            };
            var str = String(uSol);
            util.dropScript(str, scriptDropMode);
        }
    };
    //=====START RULES=====
    if (util.domCmp("finalservers.net")) {
        ubo.abort_on_property_read("_gunggo");
    }
    if (util.domCmp("pwn.pl")) {
        ubo.abort_on_property_read("adblock");
    }
    if (util.domCmp("hentaitake.net")) {
        ubo.abort_on_property_read("anOptions");
    }
    if (util.domCmp("rarbgmirror.com")) {
        ubo.abort_on_property_read("open");
    }
    if (util.domCmp("bracknellnews.co.uk")) {
        ubo.abort_on_property_write("_sp_");
    }
    if (util.domCmp("hackinformer.com")) {
        ubo.abort_on_property_write("anOptions");
    }
    if (util.domCmp("techdracula.com")) {
        ubo.setTimeout_defuser("an_message_display");
    }
    if (util.domCmp("keshavcommoditycalls.com")) {
        ubo.setTimeout_defuser("an_message_display");
    }
    if (util.domCmp("animeid.io")) {
        ubo.setTimeout_defuser("#player");
    }
    if (util.domCmp("jkanime.co")) {
        ubo.setTimeout_defuser("#player");
    }
    if (util.domCmp("gogoanime.ch")) {
        ubo.setTimeout_defuser("#player");
    }
    if (util.domCmp("chiaanime.co")) {
        ubo.setTimeout_defuser("#player");
    }
    if (util.domCmp("savetodrive.net")) {
        ubo.setTimeout_defuser("ad");
    }
    if (util.domCmp("wordsense.eu")) {
        ubo.setTimeout_defuser("ad", 2000);
    }
    if (util.domCmp("hackinformer.com")) {
        ubo.setTimeout_defuser("an_message_display");
    }
    if (util.domCmp("futbolchile.net")) {
        ubo.bab_defuser();
    }
    if (util.domCmp("freeomovie.com")) {
        ubo.bab_defuser();
    }
    if (util.domCmp("appdrop.net")) {
        ubo.bab_defuser();
    }
    if (util.domCmp("skmedix.pl")) {
        ubo.bab_defuser();
    }
    if (util.domCmp("ps4news.com")) {
        ubo.noeval();
    }
    if (util.domCmp("filechoco.net")) {
        ubo.noeval();
    }
    if (util.domCmp("rule34hentai.net")) {
        ubo.noeval();
    }
    if (util.domCmp("afreesms.com")) {
        ubo.noeval();
    }
    if (util.domCmp("vidlox.tv")) {
        ubo.noeval();
    }
    if (util.domCmp("themeslide.com")) {
        ubo.noeval();
    }
    if (util.domCmp("thewindowsclub.com")) {
        ubo.setTimeout_defuser("[native code]");
    }
    if (util.domCmp("kbb.com")) {
        ubo.abort_on_property_write("KBB.DetectBlockerExtensions");
    }
    if (util.domCmp("gamesradar.com")) {
        ubo.abort_on_property_write("_sp_");
    }
    if (util.domCmp("androidcentral.com")) {
        //Other half of the rules are in AdBlock / ABP extension filter...
        //I couldn't think of another way...
        ubo.abort_on_property_write("adonisHash");
        ubo.setTimeout_defuser("ubo", 300);
    }
})();
