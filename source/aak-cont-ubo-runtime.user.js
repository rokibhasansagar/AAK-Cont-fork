// ==UserScript==
// @name AAK-Cont uBlock Origin Runtime for AdBlock / Adblock Plus
// @namespace https://userscripts.org/scripts/show/155840
// @description Helps AdBlock / Adblock Plus to handle uBlock Origin filters
// @author jspenguin2017, based on work of gorhill
// @version 1.001
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
    dropScript: function(txt){
      var script = document.createElement('script');
      script.type = "text/javascript";
      script.innerHTML = "(" + String(txt) + ")();";
      if (body) {
        document.body.appendChild(script);
      } else {
        document.head.appendChild(script);
      }
      script.remove();
    }
  };
  var ubo = {
    setTimeout_defuser: function(niddle, delay){
      var uSol = function(){
	    var z = window.setTimeout,
		needle = '{{1}}',
		delay = parseInt('{{2}}', 10);
	    if ( needle === ''){  // || needle === '{{1}}' ) {
		needle = '.?';
        } else if ( needle.slice(0,1) === '/' && needle.slice(-1) === '/' ) {
		needle = needle.slice(1,-1);
	} else {
		needle = needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	}
	needle = new RegExp(needle);
	window.setTimeout = function(a, b) {
		if ( (isNaN(delay) || b == delay) && needle.test(a.toString()) ) {
			return 0;
		}
		return z(a, b);
	}.bind(window);
};
    var str = String(uSol).replace("{{1}}", String(niddle)).replace("{{2}}", String(delay));
    util.dropScript(str);
    }
  
  };



})();
