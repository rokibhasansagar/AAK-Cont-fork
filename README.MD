# Anti-Adblock Killer Continued

![header](images/header.png)

### Let's revive our beloved Anti-Adblock Killer! 

### Beta test! Let us know what works / doesn't work

### We are looking for contributors, head over to Issues page and let me know. 

## Instruction

#### Are you using Chrome, uBlock Origin, and Violentmonkey? Check out [AdBlock Protector](https://jspenguin2017.github.io/AdBlockProtector/)! 

#### Step 1: Install Script Host
* ![Chrome](images/browsers/chrome.png) [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) or [Violentmonkey](https://chrome.google.com/webstore/detail/violentmonkey/jinjaccalgkegednnccohejagnlnfdag)
* ![Opera](images/browsers/opera.png) [Tampermonkey](https://addons.opera.com/extensions/details/tampermonkey-beta/) or [Violentmonkey](https://addons.opera.com/extensions/details/violent-monkey/) 
* ![FireFox](images/browsers/firefox.png) [Tampermonkey](https://addons.mozilla.org/firefox/addon/tampermonkey/) or [Greasemonkey](https://addons.mozilla.org/firefox/addon/greasemonkey/)
* ![Safari](images/browsers/safari.png) [Tampermonkey](https://safari.tampermonkey.net/tampermonkey.safariextz)
* ![Edge](images/browsers/msedge.png) [Tampermonkey](https://www.microsoft.com/store/p/tampermonkey/9nblggh5162s)

> ##### Note: After installation (which may require restarting your browser), you are now ready to install userscripts. 

#### Step 2: Install Userscript
* [Click here to install](https://gitlab.com/xuhaiyang1234/AAK-Cont/raw/master/source/anti-adblock-killer.user.js)

> ##### Note: [Test: BlockAdBlock](https://blockadblock.com/) [Test: Antiblock](http://antiblock.org/?p=v3&demo)

#### Step 3: Add Filter List
* [Subscribe from GitLab](https://xuhaiyang1234.gitlab.io/AAK-Cont/index.html#filterlist)

> ##### Note: Please first check your Adblocker settings page to see if the filter is listed. 
> ##### Note: Extension filters runs alongside core. 

## We need your help! 

This is a Merge Request driven community effort to bring back our beloved Anti-Adblock Killer. 

Every new solution are required to be "stand alone", so every part of this project can work alone. 
I know that the solutions won't be complete this way, but it is better than causing more breakage due to partial installation. 

White listing is not ideal, but in the case of AdBlock and Adblock Plus, there may not be an alternative. 
Please put those filters in the AdBlock / Adblock Plus extension filter so other users won't need to watch ads. 

Please make resonable effort to make Userscript rules compatible with Greasemonkey. 

Version number **MUST** be a valid float point with 3 digits after the decimal place. This restriction is due to a limitation in the Userscript. 

Code submitted to Merge Request will go over minimal review before being merged, your requestes will be processed fast. 
One drawback is that the merge can break the code. You may be blocked from submitting new Merge Request if your code is constantly causing problems. 

Are you a reputable developer who code a lot and want to directly write to the repository? Let me know and I will give you write access. 
Some critical files are protected (locked) and you must ask me to change them (please open an issue in this case). 

## Features
* Detect & Kill Anti-Adblockers
* Check if Anti-Adblock Killer list is installed
* Check & Notify updates
* More filters for Adblockers
* [Settings](https://xuhaiyang1234.gitlab.io/AAK-Cont/)
* [Suggest features](https://gitlab.com/xuhaiyang1234/AAK-Cont/issues)

## Help
* Check if you have only one Adblocker enabled. (Adblock, Adblock Plus or uBlock Origin)
* Check if the script manager is enabled (Greasemonkey, Tampermonkey, NinjaKit, etc...).
* Check if you have installed the latest version of Anti-Adblock Killer Script (Step 3).
* Check if you have subscribed to Anti-Adblock Killer List (Step 2).
* Check if Anti-Adblock Killer Script is enabled.
* Check if Anti-Adblock Killer List is enabled.
* Try update or re-install Anti-Adblock Killer Script.
* Try update or re-subscribe Anti-Adblock Killer List.
* Check if you have another userscript that might interfere with Anti-Adblock Killer.
* Check if one of these extensions is problematic (Disable Anti-Adblock, Ghostery, Online Security Avast, Donotrackme, Privacy Badger, Disconnect, Blur, TrackerBlock, Kaspersky Anti-Banner, Freebox (Anti-pub), No Script, YesScript, HTTPS Everywhere).
* Check if, your JavaScript is enabled [Test](http://activatejavascript.org/).
* Remove duplicates Anti-Adblock Killer (Script/List).
* Remove or disable personal filters.
* Enable only the filter lists you need, too many can make your browser unresponsive.
* Force an update Adblocker lists
* Force an update Script Manager
* Check if the site is in "Supported Sites" or in "Changelog".
  * If the site is not in it, please report it [here](https://gitlab.com/xuhaiyang1234/AAK-Cont/issues).
  * If it exists, but the script does not work, it probably means that the antiadblocker has changed, please report it [here](https://gitlab.com/xuhaiyang1234/AAK-Cont/issues)
* Try with another Browser.
* Try with another Script Manager.
* How to disable the update check [Settings](https://xuhaiyang1234.gitlab.io/AAK-Cont/)
* How to disable the list check [Settings](https://xuhaiyang1234.gitlab.io/AAK-Cont/)
* How write Adblock filters [here](https://adblockplus.org/en/filters)
* Where can report an advertisement [here](https://forums.lanik.us/)
* Consult Discussions or Issues

## Supported Browsers
* ![Chrome](images/browsers/chrome.png) Chrome &#10004;
* ![Opera](images/browsers/opera.png) Opera &#10004;
* ![FireFox](images/browsers/firefox.png) FireFox &#10004;
* ![Safari](images/browsers/safari.png) Safari &#10004;
* ![Edge](images/browsers/msedge.png) Edge &#10004;

## Supported Adblockers
* Adblock &#10004;
* Adblock Plus &#10004;
* uBlock Origin &#10004;
* Adguard &#10004;

## Anti-Adblock scripts that we kill
##### Plugins (Website)
* Antiblock.org V2 & V3
* AntiAdblock (ClemensConrads)
* AntiAdblock (ErikSwan)
* AntiAdblock (D3xt3r)
* RTK Anti Adblock
* Anti Ad Buster
* AADB Anti Ads Blocker
* AdUnBlock Free & Premium
* FuckAdBlock / BlockAdBlock (Sitexw)
* ABT - Ad Block Test
* Block Adblock (thepcspy.com)
* Remove Adblock (removeadblock.com)
* Adblock Detector
* StopAdBlock (stopadblock.org)
* No-Adblock (no-adblock.com)
* AdBuddy
* AdBlockConverter (adblockconverter.com)
* HowToRemoveAdblock (howtoremoveadblock.com)
* BlockAdblock (blockadblock.com)
* TryMask (trymask.com)

##### Plugins (Wordpress)
* AdBlock Blocker
* No Adblock (noadblock.com)
* AdBlock Alerter
* BlockAlyzer - Adblock counter
* Ad Blocking Detector
* AntiBlock (BukssaAyman)
* AdBlock Notify
* WPAdBlock
* Sorry AdBlocker
* FeatureBlock
* DeAdblocker
* NoAdblock Nice Message
* Ad Block Defender
* Ad Blocking Advisor

##### And more! 

