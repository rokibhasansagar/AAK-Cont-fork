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
         * Adds an HTML element to the page for scripts checking an element's existence.
         * @method bait
         * @param type {String} The element tag name.
         * @param identifier {String} CSS selector for adding an ID or class to the element.
         */
        bait(type, identifier) {
            let elem = a.$(`<${type}>`);
            if (identifier.startsWith("#") {
                elem.attr("id", identifier.substr(1));
            } else if (identifier.startsWith(".")) {
                elem.addClass(identifier.substr(1));
            }
            elem.html("<br>").prependTo("html");
        },
        
        /**
         * Configuration for this script.
         * @property config
         * @type Object
         */
        config: {
            aggressiveAdflySkipper: true,
            allowExperimental: true,
            allowGeneric: true,
            debugMode: false,
            domExcluded: null,
            init() {
                this.debugMode = GM_getValue("config_debugMode", this.debugMode);
                this.allowExperimental = GM_getValue("config_allowExperimental", this.allowExperimental);
                this.aggressiveAdflySkipper = GM_getValue("config_aggressiveAdflySkiper", this.aggressiveAdflySkipper);
                aak.mods.Facebook_JumpToTop = GM_getValue("mods_Facebook_JumpToTop", aak.mods.Facebook_JumpToTop);
                aak.mods.Blogspot_AutoNCR = GM_getValue("mods_Blogspot_AutoNCR", aak.mods.Blogspot_AutoNCR);
                aak.mods.NoAutoplay = GM_getValue("mods_NoAutoplay", aak.mods.NoAutoplay);
            },
            update(id, val) {
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
            }
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
                const value = "; " + a.doc.cookie;
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
        
        filter(func, method, filter, onMatch, onAfter) {
            
        },
        
        generic: undefined,
        
        noAccess() {
        
        },
        
        observe() {
            
        },
        
        on() {
        
        },
        
        /** 
         * The console of the unsafe window
         * @property out
         */
        out: unsafeWindow.console,
        
        patchHTML() {
            
        },
        
        protectFunc() {
        
        },
        
        readOnly() {
        
        },
        
        ready() {
        
        },
        
        timewarp() {
        
        },
        
        /**
         * The unsafe window.
         * @property window
         */
        win: unsafeWindow
        
    };

    return aak;

})(window);

/* Website Rules */
