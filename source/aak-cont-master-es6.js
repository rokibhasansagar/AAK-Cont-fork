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
        
        generic: undefined, // TODO
        
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
        
        nativePlayer() {
            
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
        
        sha256() {
            
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
        
        uid() {
            
        },
        
        videoJS() {
            
        },
        
        /**
         * The unsafe window.
         * @property window
         */
        win: unsafeWindow
        
    };
    
    // Defaults for config
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
    
    // Defaults for observe
    aak.observe.init = () => {
        const observer = new this.win.MutationObserver(function(mutations) {
            for (let i=0; i<mutations.length; i++) {
                if (mutations[i].addedNodes.length) {
                    for (let ii=0; ii<this.observe.insertCallbacks.length; ii++) {
                        for (let iii=0; iii<mutations[i].addedNodes.length; iii++) {
                            this.observe.insertCallbacks[ii](mutations[i].addedNodes[iii]);
                        }
                    }
                }
                if (mutations[i].removedNodes.length) {
                    for (let ii = 0; ii < this.observe.removeCallbacks.length; ii++) {
                        for (let iii = 0; iii < mutations[i].removedNodes.length; iii++) {
                            this.observe.removeCallbacks[ii](mutations[i].removedNodes[iii]);
                        }
                    }
                }
            }
        });
        observer.observe(this.doc, {
            childList: true,
            subtree: true
        });
    };
    aak.observe.init.done = false;
    aak.observe.insertCallbacks = [];
    aak.observe.removeCallbacks = [];
    
    // Defaults for protectFunc
    aak.protectFunc.enabled = false;
    aak.protectFunc.pointers = [];
    aak.protectFunc.masks = [];

    return aak;

})(window);

/* Website Rules */
