var uAgent = navigator.userAgent || "";

var browser = {
  version: (uAgent.match(/.+(?:me|ox|on|rv|it|era|ie)[\/: ]([\d.]+)/) || [
    0,
    "0"
  ])[1],
  opera: /opera/i.test(uAgent),
  msie: /msie/i.test(uAgent) && !/opera/i.test(uAgent),
  msie6: /msie 6/i.test(uAgent) && !/opera/i.test(uAgent),
  msie7: /msie 7/i.test(uAgent) && !/opera/i.test(uAgent),
  msie8: /msie 8/i.test(uAgent) && !/opera/i.test(uAgent),
  msie9: /msie 9/i.test(uAgent) && !/opera/i.test(uAgent),
  msie10: /msie 10/i.test(uAgent) && !/opera/i.test(uAgent),
  mozilla: /firefox/i.test(uAgent),
  chrome: /chrome/i.test(uAgent),
  safari: !/chrome/i.test(uAgent) && /webkit|safari|khtml/i.test(uAgent),
  iphone: /iphone/i.test(uAgent),
  ipod: /ipod/i.test(uAgent),
  iphone4: /iphone.*OS 4/i.test(uAgent),
  ipod4: /ipod.*OS 4/i.test(uAgent),
  ipad: /ipad/i.test(uAgent),
  ios: /ipad|ipod|iphone/i.test(uAgent),
  android: /android/i.test(uAgent),
  bada: /bada/i.test(uAgent),
  mobile: /iphone|ipod|ipad|opera mini|opera mobi|iemobile/i.test(uAgent),
  msie_mobile: /iemobile/i.test(uAgent),
  safari_mobile: /iphone|ipod|ipad/i.test(uAgent),
  opera_mobile: /opera mini|opera mobi/i.test(uAgent),
  opera_mini: /opera mini/i.test(uAgent),
  mac: /mac/i.test(uAgent),
  webkit: /webkit/i.test(uAgent),
  android_version: parseFloat(uAgent.slice(uAgent.indexOf("Android") + 8)) || 0
};

export default browser;
