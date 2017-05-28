// ==UserScript==
// @name AAK-Cont Userscript
// @namespace https://userscripts.org/scripts/show/155840
// @description Helps you keep your Ad-Blocker active, when you visit a website and it asks you to disable.
// @author Originally by Reek, revived by jspenguin2017
// @version 1.005
// @encoding utf-8
// @license https://creativecommons.org/licenses/by-sa/4.0/
// @icon https://gitlab.com/xuhaiyang1234/AAK-Cont/raw/master/images/icon.png
// @homepage https://xuhaiyang1234.gitlab.io/AAK-Cont/
// @supportURL https://gitlab.com/xuhaiyang1234/AAK-Cont/issues
// @updateURL https://gitlab.com/xuhaiyang1234/AAK-Cont/raw/master/source/aak-cont-script.user.js
// @downloadURL https://gitlab.com/xuhaiyang1234/AAK-Cont/raw/master/source/aak-cont-script.user.js
// @include http://*/*
// @include https://*/*
// @grant unsafeWindow
// @grant GM_addStyle
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_xmlhttpRequest
// @grant GM_registerMenuCommand
// @grant GM_deleteValue
// @grant GM_listValues
// @grant GM_getResourceText
// @grant GM_getResourceURL
// @grant GM_log
// @grant GM_openInTab
// @grant GM_setClipboard
// @grant GM_info
// @grant GM_getMetadata
// @run-at document-start
// @connect *
// ==/UserScript==
/*jshint evil:true newcap:false*/
/*global unsafeWindow, GM_addStyle, GM_getValue, GM_setValue, GM_xmlhttpRequest, GM_registerMenuCommand, GM_deleteValue, GM_listValues, GM_getResourceText, GM_getResourceURL, GM_log, GM_openInTab, GM_setClipboard, GM_info, GM_getMetadata, $, document, console, location, setInterval, setTimeout, clearInterval*/
/*=====================================================
  Thanks
======================================================

  Donors: M. Howard, Shunjou, Charmine, Kierek93, G. Barnard, H. Young, Seinhor9, ImGlodar, Ivanosevitch, HomeDipo, R. Martin, DrFiZ, Tippy, B. Rohner, P. Kozica, M. Patel, W4rell, Tscheckoff, AdBlock Polska, AVENIR INTERNET, coolNAO, Ben, J. Park, C. Young, J. Bou, M. Cano, J. Jung, A. Sonino, J. Litten, M. Schrumpf, G. Pepe, A. Trufanov, R. Palmer, J. Rautiainen, S. Blystone, M. Silveira, K. MacArthur, M. Ivanov, A. Schmidt, A. Waage, F. Tismer, S. Ehnert, J. Corpus, J. Dluhos, Maklemenz, Strobelix, Modellpilot.EU, E. Benedetti, V. Venditti, Shakos, A. Eliason, A. Saloranta, S. Geiger, A. Otterloo, M. Coppen, S. Fischer, H. Becker, D. Ackerman, S. Pitsch, K. Pertcheck, S. Abel, K. O'Connor, B. Obrien, S. Vogler, S. Goebl, A. Biar, S. Scott, Bassmobile.org, S. Große, M. Peot, R. Chan Balam, L. Bond-Kennedy, R. Emond, A. Pavlov, W. Tracey, A. Sergey, R. López López, R. Reddy Kasireddy, A. Moujeer, M. Betz, M. Lefèvre, R. McCurdy, LR Geeks, M. Beauregard, CasperTech Ltd, M. Dudas, S. Scharf, S. Prokhorov, K. Papalias, J. Wojnowski, B. Curtis, D. Lawrence, D. He, N. Kelsall, Idogewallet, J. Spaulding, S. Lafon, Mat, H. Roberts, C. Hedlund, J. Hawkins, J. Andersen, M. Bjorksten, B. Wolfe III, T. Yocom, Š. Intas, S. Moenich, J. Chang, C. Munk, A. Naruta, Б. Михаил, J. Benz, F. Sloot, J. Creed, M. Gillam, C. Leicht, A. Gnana, S. Sundaram, A. Koller, M. Kotlar, S. Abel, T. Flanagan, M. Arduini, P. Stackhouse, B. Oliver, M. Johnson, R. Mannert, E. Siordia

  Collaborators: InfinityCoding, Couchy, Dindog, Floxflob, U Bless, Watilin, @prdonahue, Hoshie, 3lf3nLi3d, Alexo, Crits, Noname120, Crt32, JixunMoe, Athorcis, Killerbadger, SMed79, Alexander255, Anonsubmitter, RaporLoLpro, Maynak00, Robotex, Vinctux, Blahx, MajkiIT, F4z, Angelsl, Mikhaelk, Marek, Hamsterbacke, Gorhill, Hacker999, xxcriticxx, Skr4tchGr3azyMonkiBallllllZzzz, Giwayume, MrSherlockHolmes, xDarkARG, Noahp78, Mapx-

  Users: Thank you to all those who use Anti Adblock Killer, who report problems, who write the review, which add to their favorites, making donations, which support the project and help in its development or promote.

=======================================================
  Mirrors
=======================================================

  Github: http://tinyurl.com/mcra3dn
  Greasyfork: http://tinyurl.com/pbbdnh6
  Openuserjs: http://tinyurl.com/nnqje32
  MonkeyGuts: http://tinyurl.com/ka5fcqm
  Userscripts: http://tinyurl.com/q8xcejl

=======================================================
  Documentation
=======================================================

  Greasemonkey: http://tinyurl.com/yeefnj5
  Scriptish: http://tinyurl.com/cnd9nkd
  Tampermonkey: http://tinyurl.com/pdytfde
  Violentmonkey: http://tinyurl.com/n34wn6j
  NinjaKit: http://tinyurl.com/pkkm9ug

=======================================================
  Script
======================================================*/

/* AAK/uBP API */
var a = (function(window) {
    "use strict";
    
    var unsafeWindow = (typeof unsafeWindow !== "undefined") ? unsafeWindow : window;
    
    var aak = {
        
        /**
         * Runs a function on DOM & window load.
         * @method always
         * @param func {Function} The function to run.
         * @param capture {Boolean} Dispatches event to the listener (func) before the event target.
         */
        always(func, capture) {
            func();
            this.on("DOMContentLoaded", func, capture);
            this.on("load", func, capture);
        },
        
        /**
         * String content matching across an array of strings. Returns true if any string in the args array is matched.
         * @method applyMatch
         * @param args {Array} The strings to match against.
         * @param method {Number} The method to match with. Defined in the enum (aak.matchMethod).
         * @param filter {String|RegExp} The matching criteria.
         * @return {Boolen} True if any string match, false otherwise.
         */
        applyMatch(args, method, filter) {
            switch (method) {
                case this.matchMethod.string:
                    for (let i=0; i<args.length; i++) {
                        if (String(args[i]).includes(filter)) {
                            return true;
                        }
                    }
                    break;
                case this.matchMethod.stringExact:
                    for (let i=0; i<args.length; i++) {
                        if (filter === String(args[i])) {
                            return true;
                        }
                    }
                    break;
                case this.matchMethod.RegExp:
                    for (let i=0; i<args.length; i++) {
                        if (filter.test(String(args[i]))) {
                            return true;
                        }
                    }
                    break;
                case this.matchMethod.callback:
                    return filter(args);
                default:
                    return true;
            }
            return false;
        },
        
        /**
         * Adds an HTML element to the page for scripts checking an element's existence.
         * @method bait
         * @param type {String} The element tag name.
         * @param identifier {String} CSS selector for adding an ID or class to the element.
         */
        bait(type, identifier) {
            let elem = this.$(`<${type}>`);
            if (identifier.startsWith("#") {
                elem.attr("id", identifier.substr(1));
            } else if (identifier.startsWith(".")) {
                elem.addClass(identifier.substr(1));
            }
            elem.html("<br>").prependTo("html");
        },
        
        /**
         * Configuration for this script.
         * @method config
         * @type Object
         */
        config() {
            this.config.debugMode = GM_getValue("config_debugMode", this.config.debugMode);
            this.config.allowExperimental = GM_getValue("config_allowExperimental", this.config.allowExperimental);
            this.config.aggressiveAdflySkipper = GM_getValue("config_aggressiveAdflySkiper", this.config.aggressiveAdflySkipper);
            this.mods.Facebook_JumpToTop = GM_getValue("mods_Facebook_JumpToTop", this.mods.Facebook_JumpToTop);
            this.mods.Blogspot_AutoNCR = GM_getValue("mods_Blogspot_AutoNCR", this.mods.Blogspot_AutoNCR);
            this.mods.NoAutoplay = GM_getValue("mods_NoAutoplay", this.mods.NoAutoplay);
        },
        
        /**
         * Sets or gets a cookie, depending on whether the value is provided or not.
         * @method cookie
         * @param key {String} The cookie name.
         * @param val {String} The cookie value. Leave out to retrieve the current value.
         * @param time {Number} Number of milliseconds in which to expire the cookie.
         * @param path {String} The cookie path.
         * @return {String} The value of the cookie, if "val" parameter is omitted.
         */
        cookie(key, val, time, path) {
            if (typeof val === "undefined") {
                const value = "; " + this.doc.cookie;
                let parts = value.split("; " + key + "=");
                if (parts.length == 2) {
                    return parts.pop().split(";").shift();
                } else {
                    return null;
                }
            } else {
                let expire = new this.win.Date();
                expire.setTime((new this.win.Date()).getTime() + (time || 31536000000));
                this.doc.cookie = key + "=" + this.win.encodeURIComponent(val) + ";expires=" + expire.toGMTString() + ";path=" + (path || "/");
            }
        },
        
        /**
         * Removes an inline script on the page, using the sample string.
         * @method crashScript
         * @param sample {String} Sample function string.
         */
        crashScript(sample) {
            this.patchHTML((html) => {
                return html.replace(sample, "])} \"'` ])} \n\r \r\n */ ])}");
            });
        },
        
        /**
         * Adds CSS styles to the page.
         * @method css
         * @param str {String} The CSS string to add.
         */
        css(str) {
            let temp = str.split(";");
            for (let i=0; i<temp.length-1; i++) {
                if (!temp[i].endsWith("!important")) {
                    temp[i] += " !important";
                }
            }
            GM_addStyle(temp.join(";"));
        },
        
        /**
         * The document of the unsafe window.
         * @property doc
         */
        doc: unsafeWindow.document,
        
        /**
         * The domain name of the unsafe window.
         * @property dom
         */
        dom: unsafeWindow.document.domain,
        
        /**
         * Compares the current domain to a list of domains, returns true if in that list.
         * @method domCmp
         * @param domList {Array} The list of domain names to check against.
         * @param noErr {Boolean} Don't display errors in debug mode.
         * @return {Boolean} true if the current domain is in the domain list.
         */
        domCmp(domList, noErr) {
            for (let i=0; i<domList.length; i++) {
                if (this.dom === domList[i] || this.dom.endsWith("." + domList[i])) {
                    if (this.config.debugMode && !noErr) {
                        this.err();
                    }
                    return true;
                }
            }
            return false;
        },
        
        /**
         * Checks if the current domain string is included as a sub domain or partial domain in the list.
         * @method domInc
         * @param domList {Array} The list of domain names to check against.
         * @param noErr {Boolean} Don't display errors in debug mode.
         * @return {Boolean} True if the current domain is included in the domain list.
         */
        domInc(domList, noErr) {
            for (let i=0; i<domList.length; i++) {
                if (this.dom.startsWith(domList[i] + ".") || this.dom.includes("." + domList[i] + ".")) {
                    if (this.config.debugMode && !noErr) {
                        this.err();
                    }
                    return true;
                }
            }
            return false;
        },
        
        /**
         * Displays a console error.
         * @method err
         * @param name {String} Descriptive type of error.
         */
        err(name) {
            if (name) {
                name = name + " ";
            } else {
                name = ""
            }
            this.out.error(`Uncaught AdBlock Error: ${name}AdBlocker detectors are not allowed on this device! `);
        },
        
        /**
         * Replaces a global function with a version that can stop or modify its execution based on the arguments passed.
         * @method filter
         * @param func {String} The name of the function (or dot separate path to the function) to be replaced. Starts at the global context.
         * @param method {Number} The method to match function arguments with. Defined in the enum (aak.matchMethod).
         * @param filter {String|RegExp} This string or regex criteria that determines a match. If this matches, the original function is not executed.
         * @param onMatch {Function} Callback when the "filter" argument matches. The return value of this function is used instead of the original function's return value.
         * @param onAfter {Function} Callback that fires every time original function is called. The first argument is whether or not the flter matched. The second argument is the args passed into the original function.
         * @return {Boolean} True if errors did not occur.
         */
        filter(func, method, filter, onMatch, onAfter) {
            let original = this.win;
            let parent;
            const newFunc = (...args) => {
                if (this.config.debugMode) {
                    this.out.warn(func + "is called with these arguments: ");
                    for (let i=0; i<args.length; i++) {
                        this.out.warn(String(args[i]));
                    }
                }
                if (!method || this.applyMatch(args, method, filter)) {
                    this.config.debugMode && this.err();
                    let ret = undefined;
                    if (onMatch) {
                        ret = onMatch(args);
                    }
                    onAfter && onAfter(true, args);
                    return ret;
                }
                this.config.debugMode && this.out.info("Tests passed.");
                onAfter && onAfter(false, args);
                return original.apply(parent, args);
            };
            try {
                let stack = func.split(".");
                let current;
                while (current = stack.shift()) {
                    parent = original;
                    original = parent[current];
                    if (!stack.length) {
                        parent[current] = newFunc;
                    }
                }
                if (this.protectFunc.enabled) {
                    this.protectFunc.pointers.push(newFunc);
                    this.protectFunc.masks.push(String(original));
                }
                this.config.debugMode && this.out.warn("Filter activated on " + func);
            } catch(err) {
                this.config.debugMode && this.out.error("AAK failed to activate fitler on " + func + "!");
                return false;
            }
            return true;
        },
        
        /**
         * Generic anti-adblocking solutions that run on every page.
         * @method generic
         */
        generic() {
            //@pragma-keepline Based on generic solutions of Anti-Adblock Killer
            //@pragma-keepline License: https://github.com/reek/anti-adblock-killer/blob/master/LICENSE
            if (this.config.allowGeneric && !this.config.domExcluded) {
                const data = {};
                this.generic.FuckAdBlock("FuckAdBlock", "fuckAdBlock");
                this.generic.FuckAdBlock("BlockAdBlock", "blockAdBlock");
                this.readOnly("canRunAds", true);
                this.readOnly("canShowAds", true);
                this.readOnly("isAdBlockActive", false);
                let playwireZeus;
                this.win.Object.defineProperty(this.win, "Zeus", {
                    configurable: false,
                    set: function (val) {
                        playwireZeus = val;
                    },
                    get: function () {
                        this.config.debugMode && this.err("Playwire");
                        try {
                            playwireZeus.AdBlockTester = {
                                check: function (a) { a(); }
                            };
                        } catch (err) { }
                        return playwireZeus;
                    }
                });
                this.ready(function () {
                    if (this.win.XenForo && typeof this.win.XenForo.rellect === "object") {
                        this.config.debugMode && this.err("XenForo");
                        this.win.XenForo.rellect = {
                            AdBlockDetector: {
                                start: function () { }
                            }
                        };
                    }
                    if (typeof this.win.closeAdbuddy === "function") {
                        this.config.debugMode && this.err("Adbuddy");
                        this.win.closeAdbuddy();
                    }
                    if (this.$("div.adb_overlay > div.adb_modal_img").length > 0) {
                        this.config.debugMode && this.err("AdBlock Alerter");
                        this.$("div.adb_overlay").remove();
                        this.css("html,body {height:auto; overflow: auto;}");
                    }
                    if (this.$("#blockdiv").html() === "disable ad blocking or use another browser without any adblocker when you visit") {
                        this.config.debugMode && this.out.err("Uncaught AdBlock Error: Generic block screens are not allowed on this device! ");
                        this.$("#blockdiv").remove();
                    }
                    const styles = document.querySelectorAll("style");
                    for (let i = 0; i < styles.length; i++) {
                        const style = styles[i];
                        const cssRules = style.sheet.cssRules;
                        for (var j = 0; j < cssRules.length; j++) {
                            const cssRule = cssRules[j];
                            const cssText = cssRule.cssText;
                            const pattern = /^#([a-z0-9]{4,10}) ~ \* \{ display: none; \}/;
                            if (pattern.test(cssText)) {
                                const id = pattern.exec(cssText)[1];
                                if (this.$("script:contains(w.addEventListener('load'," + id + ",false))")) {
                                    this.config.debugMode && this.err("Antiblock.org v2");
                                    data.abo2 = id;
                                    break;
                                }
                            }
                        }
                    }
                    for (let prop in this.win) {
                        try {
                            if (!prop.startsWith("webkit") && /^[a-z0-9]{4,12}$/i.test(prop) && prop !== "document" && (this.win[prop] instanceof this.win.HTMLDocument) === false && this.win.hasOwnProperty(prop) && typeof this.win[prop] === "object") {
                                const method = this.win[prop];
                                if (method.deferExecution &&
                                    method.displayMessage &&
                                    method.getElementBy &&
                                    method.getStyle &&
                                    method.insert &&
                                    method.nextFunction) {
                                    if (method.toggle) {
                                        this.config.debugMode && this.err("BetterStopAdblock");
                                        data.bsa = prop;
                                    } else {
                                        this.config.debugMode && this.err("Antiblock.org v3");
                                        data.abo3 = prop;
                                    }
                                    this.win[prop] = null;
                                }
                                if (method.bab) {
                                    this.config.debugMode && this.err("BlockAdBlock");
                                    this.win[prop] = null;
                                } else if (this.win.Object.keys(method).length === 3 && this.win.Object.keys(method).join().length === 32) {
                                    this.config.debugMode && this.err("BlockAdBlock");
                                    this.win[prop] = null;
                                }
                            }
                        } catch (err) { }
                    }
                });
                const onInsertHandler = function (insertedNode) {
                    if (insertedNode.nodeName === "DIV" &&
                        insertedNode.id &&
                        insertedNode.id.length === 4 &&
                        /^[a-z0-9]{4}$/.test(insertedNode.id) &&
                        insertedNode.firstChild &&
                        insertedNode.firstChild.id &&
                        insertedNode.firstChild.id === insertedNode.id &&
                        insertedNode.innerHTML.includes("no-adblock.com")) {
                        this.config.debugMode && this.err("No-Adblock");
                        insertedNode.remove();
                    }
                    if (insertedNode.nodeName === "DIV" &&
                        insertedNode.id &&
                        insertedNode.id.length === 7 &&
                        /^a[a-z0-9]{6}$/.test(insertedNode.id) &&
                        insertedNode.parentNode &&
                        insertedNode.parentNode.id &&
                        insertedNode.parentNode.id === insertedNode.id + "2" &&
                        insertedNode.innerHTML.includes("stopadblock.org")) {
                        this.config.debugMode && this.err("StopAdblock");
                        insertedNode.remove();
                    }
                    const reIframeId = /^(zd|wd)$/;
                    const reImgId = /^(xd|gd)$/;
                    const reImgSrc = /\/ads\/banner.jpg/;
                    const reIframeSrc = /(\/adhandler\/|\/adimages\/|ad.html)/;
                    if (insertedNode.id &&
                        reImgId.test(insertedNode.id) &&
                        insertedNode.nodeName === "IMG" &&
                        reImgSrc.test(insertedNode.src) ||
                        insertedNode.id &&
                        reIframeId.test(insertedNode.id) &&
                        insertedNode.nodeName === "IFRAME" &&
                        reIframeSrc.test(insertedNode.src)) {
                        this.config.debugMode && this.err("AntiAdblock");
                        insertedNode.remove();
                    }
                    const reId = /^[a-z]{8}$/;
                    const reClass = /^[a-z]{8} [a-z]{8}/;
                    const reBg = /^[a-z]{8}-bg$/;
                    if (typeof this.win.vtfab !== "undefined" &&
                        typeof this.win.adblock_antib !== "undefined" &&
                        insertedNode.parentNode &&
                        insertedNode.parentNode.nodeName === "BODY" &&
                        insertedNode.id &&
                        reId.test(insertedNode.id) &&
                        insertedNode.nodeName === "DIV" &&
                        insertedNode.nextSibling &&
                        insertedNode.nextSibling.className &&
                        insertedNode.nextSibling.nodeName === "DIV") {
                        if (insertedNode.className &&
                            reClass.test(insertedNode.className) &&
                            reBg.test(insertedNode.nextSibling.className) &&
                            insertedNode.nextSibling.style &&
                            insertedNode.nextSibling.style.display !== "none") {
                            this.config.debugMode && this.err("Adunblock Premium");
                            insertedNode.nextSibling.remove();
                            insertedNode.remove();
                        } else if (insertedNode.nextSibling.id &&
                            reId.test(insertedNode.nextSibling.id) &&
                            insertedNode.innerHTML.includes("Il semblerait que vous utilisiez un bloqueur de publicité !")) {
                            this.config.debugMode && this.err("Adunblock Free");
                            insertedNode.remove();
                        }
                    }
                    const reMsgId = /^[a-z0-9]{4,10}$/i;
                    const reTag1 = /^(div|span|b|i|font|strong|center)$/i;
                    const reTag2 = /^(a|b|i|s|u|q|p|strong|center)$/i;
                    const reWords1 = /ad blocker|ad block|ad-block|adblocker|ad-blocker|adblock|bloqueur|bloqueador|Werbeblocker|adblockert|&#1570;&#1583;&#1576;&#1604;&#1608;&#1603; &#1576;&#1604;&#1587;|блокировщиком/i;
                    const reWords2 = /kapat|disable|désactivez|désactiver|desactivez|desactiver|desative|desactivar|desactive|desactiva|deaktiviere|disabilitare|&#945;&#960;&#949;&#957;&#949;&#961;&#947;&#959;&#960;&#959;&#943;&#951;&#963;&#951;|&#1079;&#1072;&#1087;&#1088;&#1077;&#1097;&#1072;&#1090;&#1100;|állítsd le|publicités|рекламе|verhindert|advert|kapatınız/i;
                    if (insertedNode.parentNode &&
                        insertedNode.id &&
                        insertedNode.style &&
                        insertedNode.childNodes.length &&
                        insertedNode.firstChild &&
                        !insertedNode.firstChild.id &&
                        !insertedNode.firstChild.className &&
                        reMsgId.test(insertedNode.id) &&
                        reTag1.test(insertedNode.nodeName) &&
                        reTag2.test(insertedNode.firstChild.nodeName)) {
                        this.config.debugMode && this.err("Antiblock.org");
                        const audio = insertedNode.querySelector("audio[loop]");
                        if (audio) {
                            audio.pause();
                            audio.remove();
                        } else if ((data.abo2 && insertedNode.id === data.abo2) ||
                            (insertedNode.firstChild.hasChildNodes() && reWords1.test(insertedNode.firstChild.innerHTML) && reWords2.test(insertedNode.firstChild.innerHTML))) {
                            insertedNode.remove();
                        } else if ((data.abo3 && insertedNode.id === data.abo3) ||
                            (insertedNode.firstChild.hasChildNodes() && insertedNode.firstChild.firstChild.nodeName === "IMG" && insertedNode.firstChild.firstChild.src.startsWith("data:image/png;base64"))) {
                            a.win[data.abo3] = null;
                            insertedNode.remove();
                        } else if (data.bsa && insertedNode.id === data.bsa) {
                            this.win[data.bsa] = null;
                            insertedNode.remove();
                        }
                    }
                };
                this.observe("insert", onInsertHandler);
            } else if (this.config.debugMode) {
                this.out.warn("Generic solutions are disabled on this domain. ");
            }
        },
        
        /**
         * Match enum for the "applyMatch" method.
         * @property matchMethod
         * @type Object
         */
        matchMethod: {
            matchAll: 0, // Match all, this is default.
            string: 1, // Substring match
            stringExact: 2, // Exact string match, will result in match if one or more arguments matches the filter
            RegExp: 3, // Regular expression
            callback: 4 // Callback, arguments list will be supplied as an array. Retrun true for match, false for no match.
        },
        
        /**
         * Creates a native video player.
         * @method nativePlayer
         * @param source {String} The source URL of the video stream.
         * @param [typeIn] {String} Specify a video MIME type.
         * @param [widthIn] {String} Specify a custom width.
         * @param [heightIn] {String} Specify a custom height.
         */
        nativePlayer(source, typeIn, widthIn, heightIn) {
            let type;
            if (typeIn) {
                type = typeIn;
            } else {
                const temp = source.split(".");
                switch (temp[temp.length - 1]) {
                    case "webm":
                        type = "video/webm";
                        break;
                    case "mp4":
                        type = "video/mp4";
                        break;
                    case "ogg":
                        type = "video/ogg";
                        break;
                    default:
                        type = "video/mp4";
                        break;
                }
            }
            const width = widthIn || "100%";
            const height = heightIn || "auto";
            return `<video width='${width}' height='${height}' controls><source src='${source}' type='${type}'></video>`;
        },
        
        /**
         * Blocks scripts from accessing a global property.
         * @method noAccess
         * @param name {String} The name of the property to deny access to. Using "." will traverse an object's properties. Starts at the global context.
         */
        noAccess(name) {
            const errMsg = "AdBlock Error: This property may not be accessed!";
            try {
                let property = this.win;
                let parent;
                let stack = name.split(".");
                let current;
                while (current = stack.shift()) {
                    parent = property;
                    property = parent[current];
                    if (!stack.length) {
                        this.win.Object.defineProperty(parent, current {
                            configurable: false,
                            set: function() {
                                throw errMsg;
                            },
                            get: function() {
                                throw errMsg;
                            }
                        });
                    }
                }
            } catch(err) {
                this.config.debugMode && this.out.error("AAK failed to define non-accessible property " + name + "!");
                return false;
            }
            return true;
        },
        
        /**
         * Shorthand function for observing and reacting to DOM mutations.
         * @method observe
         * @param type {String} The type of mutation to observe, "insert" or "remove".
         * @param callback {Function} The callback function that fires when the mutation occurs.
         */
        observe(type, callback) {
            if (!this.observe.init.done) {
                this.observe.init.done = true;
                this.observe.init();
            }
            switch(type) {
                case "insert":
                    this.observe.insertCallbacks.push(callback);
                    break;
                case "remove": 
                    this.observe.removeCallbacks.push(callback);
                    break;
            }
        },
        
        /**
         * Shorthand function for unsafeWindow.attachEventListener.
         * @method on
         * @param event {String} The event to listen to.
         * @param func {Function} The callback that fires when the event occurs.
         * @param capture {Boolean} "useCapture".
         */
        on(event, func, capture) {
            this.win.addEventListener(event, func, capture);
        },
        
        /** 
         * The console of the unsafe window
         * @property out
         */
        out: unsafeWindow.console,
        
        /**
         * Modify the HTML of the entire page before it loads.
         * @method patchHTML
         * @param patcher {Function} Function that is passed the HTML of the page, and returns the replacement.
         */
        patchHTML(patcher) {
            this.win.stop();
            GM_xmlhttpRequest({
                method: "GET",
                url: this.doc.location.href,
                headers: {
                    "Referer": this.doc.referer
                },
                onload: (result) => {
                    this.doc.write(patcher(result.responseText));
                }
            });
        },
        
        /**
         * Stops websites from detecting function modifications by utilizing the toString method of the function. Used in conjunction with "filter".
         * @method protectFunc
         */
        protectFunc() {
            this.protectFunc.enabled = true;
            const original = this.win.Function.prototype.toString;
            const newFunc = () => {
                const index = this.protectFunc.pointers.indexOf(this);
                if (index === -1) {
                    return original.apply(this);
                } else {
                    return this.protectFunc.masks[index];
                }
            };
            try {
                this.win.Function.prototype.toString = newFunc;
                this.protectFunc.pointers.push(newFunc);
                this.protectFunc.masks.push(String(original));
                this.config.debugMode && this.out.warn("Functions protected.");
            } catch(err) {
                this.config.debugMode && this.out.error("AAK failed to protect functions!");
                return false;
            }
            return true;
        },
        
        /**
         * Makes it so a global property is not modifiable by further scripts.
         * @method noAccess
         * @param name {String} The name of the property to make read-only. Using "." will traverse an object's properties. Starts at the global context.
         * @param val {Any} The desired value of the read-only property.
         */
        readOnly(name, val) {
            try {
                let property = this.win;
                let parent;
                let stack = name.split(".");
                let current;
                while (current = stack.shift()) {
                    parent = property;
                    property = parent[current];
                    if (!stack.length) {
                        this.win.Object.defineProperty(parent, current {
                            configurable: false,
                            set: function() {},
                            get: function() {
                                return val;
                            }
                        });
                    }
                }
            } catch(err) {
                this.config.debugMode && this.out.error("AAK failed to define read-only property " + name + "!");
                return false;
            }
            return true;
        },
        
        /**
         * Fires when the DOM is ready for modification.
         * @method ready
         * @param func {Function} Callback to fire when DOM is ready.
         * @param capture {Boolean} Whether or not the callback should fire before event target.
         */
        ready(func, capture) {
            this.on("DOMContentLoaded", func, capture);
        },
        
        /**
         * The unsafe window's setTimeout.
         * @property setTimeout
         */
        setTimeout: unsafeWindow.setTimeout,
        
        /**
         * The unsafe window's setInterval.
         * @property setInterval
         */
        setInterval: unsafeWindow.setInterval,
        
        /**
         * Creates a SHA-256 hash signature of provided string.
         * @method sha256
         * @param r {String} The string to encrypt.
         */
        sha256(r) {
            //@pragma-keepline Based on work of Angel Marin and Paul Johnston
            //@pragma-keepline More information: http://www.webtoolkit.info/javascript-sha256.html
            function n(r, n) {
                var t = (65535 & r) + (65535 & n),
                    e = (r >> 16) + (n >> 16) + (t >> 16);
                return e << 16 | 65535 & t;
            }
            function t(r, n) {
                return r >>> n | r << 32 - n;
            }
            function e(r, n) {
                return r >>> n;
            }
            function o(r, n, t) {
                return r & n ^ ~r & t;
            }
            function u(r, n, t) {
                return r & n ^ r & t ^ n & t;
            }
            function a(r) {
                return t(r, 2) ^ t(r, 13) ^ t(r, 22);
            }
            function f(r) {
                return t(r, 6) ^ t(r, 11) ^ t(r, 25);
            }
            function c(r) {
                return t(r, 7) ^ t(r, 18) ^ e(r, 3);
            }
            function i(r) {
                return t(r, 17) ^ t(r, 19) ^ e(r, 10);
            }
            function h(r, t) {
                var e, h, C, g, d, v, A, l, m, S, y, w, b = new Array(1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298),
                    p = new Array(1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225),
                    s = new Array(64);
                r[t >> 5] |= 128 << 24 - t % 32, r[(t + 64 >> 9 << 4) + 15] = t;
                for (m = 0; m < r.length; m += 16) {
                    e = p[0], h = p[1], C = p[2], g = p[3], d = p[4], v = p[5], A = p[6], l = p[7];
                    for (S = 0; 64 > S; S++) 16 > S ? s[S] = r[S + m] : s[S] = n(n(n(i(s[S - 2]), s[S - 7]), c(s[S - 15])), s[S - 16]), y = n(n(n(n(l, f(d)), o(d, v, A)), b[S]), s[S]), w = n(a(e), u(e, h, C)), l = A, A = v, v = d, d = n(g, y), g = C, C = h, h = e, e = n(y, w);
                    p[0] = n(e, p[0]), p[1] = n(h, p[1]), p[2] = n(C, p[2]), p[3] = n(g, p[3]), p[4] = n(d, p[4]), p[5] = n(v, p[5]), p[6] = n(A, p[6]), p[7] = n(l, p[7]);
                }
                return p;
            }
            function C(r) {
                for (var n = Array(), t = (1 << v) - 1, e = 0; e < r.length * v; e += v) n[e >> 5] |= (r.charCodeAt(e / v) & t) << 24 - e % 32;
                return n;
            }
            function g(r) {
                r = r.replace(/\r\n/g, "\n");
                for (var n = "", t = 0; t < r.length; t++) {
                    var e = r.charCodeAt(t);
                    128 > e ? n += String.fromCharCode(e) : e > 127 && 2048 > e ? (n += String.fromCharCode(e >> 6 | 192), n += String.fromCharCode(63 & e | 128)) : (n += String.fromCharCode(e >> 12 | 224), n += String.fromCharCode(e >> 6 & 63 | 128), n += String.fromCharCode(63 & e | 128));
                }
                return n;
            }
            function d(r) {
                for (var n = A ? "0123456789ABCDEF" : "0123456789abcdef", t = "", e = 0; e < 4 * r.length; e++) t += n.charAt(r[e >> 2] >> 8 * (3 - e % 4) + 4 & 15) + n.charAt(r[e >> 2] >> 8 * (3 - e % 4) & 15);
                return t;
            }
            var v = 8,
                A = 0;
            return r = g(r), d(h(C(r), r.length * v));
        },
        
        /**
         * Similar to "filter", except all arguments are multiplied by a "ratio" for detection on the next call. Usually used on "setInterval". 
         * @method timewarp
         */
        timewarp(func, method, filter, onMatch, onAfter, ratio) {
            ratio = ratio || 0.02;
            const original = this.win[func];
            const newFunc = (...args) => {
                if (this.config.debugMode) {
                    this.out.warn("Timewarpped " + func + " is called with these arguments: ");
                    for (let i = 0; i < args.length; i++) {
                        this.out.warn(String(args[i]));
                    }
                }
                if (!method || this.applyMatch(args, method, filter)) {
                    this.config.debugMode && this.out.warn("Timewarpped. ");
                    onMatch && onMatch(args);
                    onAfter && onAfter(true, args);
                    args[1] = args[1] * ratio;
                    return original.apply(this.win, args);
                } else {
                    this.config.debugMode && this.out.info("Not timewarpped. ");
                    onAfter && onAfter(false, args);
                    return original.apply(this.win, args);
                }
            };
            try {
                this.win[func] = newFunc;
                if (this.protectFunc.enabled) {
                    this.protectFunc.pointers.push(newFunc);
                    this.protectFunc.masks.push(String(original));
                }
                this.config.debugMode && this.out.warn("Timewarp activated on " + func);
            } catch (err) {
                this.config.debugMode && this.out.error("uBlock Protector failed to apply timewarp on " + func + "! ");
                return false;
            }
            return true;
        },
        
        /**
         * Generated a unique ID string.
         * @method uid
         * @return {String} The unique id.
         */
        uid() {
            const chars = "abcdefghijklnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
            let str = "";
            for (let i = 0; i < 10; i++) {
                str += chars.charAt(this.win.Math.floor(this.win.Math.random() * chars.length));
            }
            this.uid.counter++;
            return str + this.uid.counter.toString();
        },
        
        /**
         * Creates a videoJS player.
         * @method videoJS
         * 
         */
        videoJS(sources, types, width, height) {
            let html = `<video id="uBlock_Protector_Video_Player" class="video-js vjs-default-skin" controls preload="auto" width="${width}" height="${height}" data-setup="{}">`;
            for (let i = 0; i < sources.length; i++) {
                html += `<source src="${sources[i]}" type="${types[i]}">`;
            }
            html += `</video>`;
            return html;
        },
        
        /**
         * The unsafe window.
         * @property window
         */
        win: unsafeWindow
        
    };
    
    // Static properties for aak.config
    aak.config.aggressiveAdflySkipper = true;
    aak.config.allowExperimental = true;
    aak.config.allowGeneric = true;
    aak.config.debugMode = false;
    aak.config.domExcluded = null;
    aak.config.update = (id, val) => {
        const names = [
            "config_debugMode",
            "config_allowExperimental",
            "config_aggressiveAdflySkiper",
            "mods_Facebook_JumpToTop",
            "mods_Blogspot_AutoNCR",
            "mods_NoAutoplay"
        ];
        if (names.includes(id)) {
            GM_setValue(id, Boolean(val));
        }
    };
    
    // Static properties for aak.observe
    aak.observe.init = () => {
        const observer = new aak.win.MutationObserver(function(mutations) {
            for (let i=0; i<mutations.length; i++) {
                if (mutations[i].addedNodes.length) {
                    for (let ii=0; ii<aak.observe.insertCallbacks.length; ii++) {
                        for (let iii=0; iii<mutations[i].addedNodes.length; iii++) {
                            aak.observe.insertCallbacks[ii](mutations[i].addedNodes[iii]);
                        }
                    }
                }
                if (mutations[i].removedNodes.length) {
                    for (let ii = 0; ii < aak.observe.removeCallbacks.length; ii++) {
                        for (let iii = 0; iii < mutations[i].removedNodes.length; iii++) {
                            aak.observe.removeCallbacks[ii](mutations[i].removedNodes[iii]);
                        }
                    }
                }
            }
        });
        observer.observe(aak.doc, {
            childList: true,
            subtree: true
        });
    };
    aak.observe.init.done = false;
    aak.observe.insertCallbacks = [];
    aak.observe.removeCallbacks = [];
    
    // Static properties for aak.protectFunc
    aak.protectFunc.enabled = false;
    aak.protectFunc.pointers = [];
    aak.protectFunc.masks = [];

    // Static properties for aak.uuid
    aak.uuid.counter = 0;
    
    // Static properties for aak.videoJS
    aak.videoJS.init = (...args) => {
        try {
            aak.win.HELP_IMPROVE_VIDEOJS = false;
        } catch (err) { }
        let plugins = args.join();
        aak.$("head").append(`<link href="//vjs.zencdn.net/5.4.6/video-js.min.css" rel="stylesheet"><script src="//vjs.zencdn.net/5.4.6/video.min.js"><\/script>${plugins}`);
    };
    aak.videoJS.plugins = {};
    aak.videoJS.plugins.hls = `<script src="//cdnjs.cloudflare.com/ajax/libs/videojs-contrib-hls/5.4.0/videojs-contrib-hls.min.js"><\/script>`;
    
    return aak;

})(window);

/* Website Rules */
