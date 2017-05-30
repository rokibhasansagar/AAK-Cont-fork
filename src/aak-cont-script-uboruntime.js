//Requires Core, paste after Core to make the Userscript for users that are NOT using uBO

/*=============
| uBO Runtime |
==============*/

var ubo = (function() {
    return {
        
        setTimeout_defuser(niddle, delay, scriptDropMode) {
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
            a.addScript(str, scriptDropMode);
        },
        
        abort_on_property_read(niddle, scriptDropMode) {
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
            a.addScript(str, scriptDropMode);
        },
        
        abort_on_property_write(niddle, scriptDropMode) {
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
            a.addScript(str, scriptDropMode);
        },
        
        bab_defuser(scriptDropMode) {
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
            a.addScript(str, scriptDropMode);
        },
        
        noeval(scriptDropMode) {
            var uSol = function () {
                window.eval = function (s) {
                    console.log('Document tried to eval... \n' + s);
                }.bind(window);
            };
            var str = String(uSol);
            a.addScript(str, scriptDropMode);
        }
        
    }
})();


/*======================================================================
| uBO Website Rules                                                    |
| (Please keep in alphabetical order to avoid unnecessary duplicates.) |
=======================================================================*/

if (a.domCmp("afreesms.com")) {
    ubo.noeval();
}
if (a.domCmp("androidcentral.com")) {
    //Other half of the rules are in AdBlock / ABP extension filter...
    //I couldn't think of another way...
    ubo.abort_on_property_write("adonisHash");
    ubo.setTimeout_defuser("ubo", 300);
}
if (a.domCmp("animeid.io")) {
    ubo.setTimeout_defuser("#player");
}
if (a.domCmp("appdrop.net")) {
    ubo.bab_defuser();
}
if (a.domCmp("bracknellnews.co.uk")) {
    ubo.abort_on_property_write("_sp_");
}
if (a.domCmp("chiaanime.co")) {
    ubo.setTimeout_defuser("#player");
}
if (a.domCmp("filechoco.net")) {
    ubo.noeval();
}
if (a.domCmp("finalservers.net")) {
    ubo.abort_on_property_read("_gunggo");
}
if (a.domCmp("freeomovie.com")) {
    ubo.bab_defuser();
}
if (a.domCmp("futbolchile.net")) {
    ubo.bab_defuser();
}
if (a.domCmp("gamesradar.com")) {
    ubo.abort_on_property_write("_sp_");
}
if (a.domCmp("gogoanime.ch")) {
    ubo.setTimeout_defuser("#player");
}
if (a.domCmp("hackinformer.com")) {
    ubo.abort_on_property_write("anOptions");
    ubo.setTimeout_defuser("an_message_display");
}
if (a.domCmp("hentaitake.net")) {
    ubo.abort_on_property_read("anOptions");
}
if (a.domCmp("jkanime.co")) {
    ubo.setTimeout_defuser("#player");
}
if (a.domCmp("kbb.com")) {
    ubo.abort_on_property_write("KBB.DetectBlockerExtensions");
}
if (a.domCmp("keshavcommoditycalls.com")) {
    ubo.setTimeout_defuser("an_message_display");
}
if (a.domCmp("ps4news.com")) {
    ubo.noeval();
}
if (a.domCmp("pwn.pl")) {
    ubo.abort_on_property_read("adblock");
}
if (a.domCmp("rarbgmirror.com")) {
    ubo.abort_on_property_read("open");
}
if (a.domCmp("rule34hentai.net")) {
    ubo.noeval();
}
if (a.domCmp("savetodrive.net")) {
    ubo.setTimeout_defuser("ad");
}
if (a.domCmp("skmedix.pl")) {
    ubo.bab_defuser();
}
if (a.domCmp("techdracula.com")) {
    ubo.setTimeout_defuser("an_message_display");
}
if (a.domCmp("themeslide.com")) {
    ubo.noeval();
}
if (a.domCmp("thewindowsclub.com")) {
    ubo.setTimeout_defuser("[native code]");
}
if (a.domCmp("vidlox.tv")) {
    ubo.noeval();
}
if (a.domCmp("wordsense.eu")) {
    ubo.setTimeout_defuser("ad", 2000);
}
