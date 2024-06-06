/**
 * shadowdom 改造方案
 * 1. 利用document查询元素：应该用shadowRoot
 * 2. 利用document注册事件，获取document子元素距离，获取document的cookie：应该用宿主document元素
 * 3. 正则写法\u005c\，需要修改--线上不用改，因为mock才有问题
 */
export default `
var eLogAndPv = {
  addHandler: function(element, type, handler) {
      if (element.addEventListener) {
          element.addEventListener(type, handler, false)
      } else if (element.attachEvent) {
          element.attachEvent("on" + type, handler)
      } else {
          element["on" + type] = handler
      }
  },
  removeHandler: function(element, type, handler) {
      if (element.removeEventListener) {
          element.removeEventListener(type, handler, false)
      } else if (element.detachEvent) {
          element.detachEvent("on" + type, handler)
      } else {
          element["on" + type] = null
      }
  },
  eCookie: {
      get: function(e) {
          var t = e + "=",
              n = t.length,
              r = document.cookie.length,
              i = 0;
          while (i < r) {
              var s = i + n;
              if (document.cookie.substring(i, s) == t) {
                  return this.getVal(s)
              }
              i = document.cookie.indexOf(" ", i) + 1;
              if (i == 0) {
                  break
              }
          }
          return null
      },
      set: function(e, t) {
          var n = this.set.arguments,
              r = this.set.arguments.length,
              i = r > 2 ? n[2] : null,
              s = r > 3 ? n[3] : null,
              o = r > 4 ? n[4] : null,
              u = r > 5 ? n[5] : !1;
          document.cookie = e + "=" + escape(t) + (i == null ? "" : "; expires=" + i.toGMTString()) + (s == null ? "" : "; path=" + s) + (o == null ? "" : "; domain=" + o) + (u == 1 ? "; secure" : "")
      },
      del: function(e) {
          var t = new Date;
          t.setTime(t.getTime() - 1);
          var n = 0;
          document.cookie = e + "=" + n + "; expires=" + t.toGMTString()
      },
      getVal: function(e) {
          var t = document.cookie.indexOf(";", e);
          return t == -1 && (t = document.cookie.length), unescape(document.cookie.substring(e, t))
      }
  },
  sendlog: function(e) {
      if (e && (this.getElementByIdForShadow(e) || typeof e == "object")) {
          var t = this.getElementByIdForShadow(e) || e,
              alla = t.getElementsByTagName("a"),
              alen = alla.length,
              n = this,
              __this = this,
              r, i, s, o, u = (new Date).getTime();
          for (var allakey = 0; allakey < alen; allakey++) {
              if (alla[allakey].getAttribute("e_href")) {
                  alla[allakey].setAttribute("e_href", alla[allakey].getAttribute("href"))
              }
          }

          function a(e) {
              function r(e, t, n) {
                  e.addEventListener ? e.addEventListener(t, n, !1) : e.attachEvent ? e.attachEvent("on" + t, n) : e["on" + t] = n
              }

              function k(e, t, n) {
                  e.removeEventListener ? e.removeEventListener(t, n, !1) : e.detachEvent ? e.detachEvent("on" + t, n) : e["on" + t] = null
              }
              var tps, i, s, formLogSrc, st = new Date().getTime(),
                  ts, ud, dd, urlTarget, ckEnter = '-1.-1.-1.-1.-1.-1',
                  ckDown = '-1.-1.-1.-1.-1.-1';

              function mouseEnter(e) {
                  k(t, "mouseenter", mouseEnter);
                  ts = new Date().getTime();
                  ckEnter = [e.pageX || -1, e.pageY || -1, e.clientX || -1, e.clientY || -1, e.screenX || -1, e.screenY || -1].join('.')
              }

              function mouseDown(e) {
                  urlTarget = undefined;
                  dd = new Date().getTime();
                  ckDown = [e.pageX || -1, e.pageY || -1, e.clientX || -1, e.clientY || -1, e.screenX || -1, e.screenY || -1].join('.');
                  var scrollLeft = document.body.scrollLeft || document.documentElement.scrollLeft;
                  var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
                  var scrollDom = document.getElementById(window.scrollDomId);
                  if (scrollDom) {
                      scrollLeft = scrollDom.scrollLeft;
                      scrollTop = scrollDom.scrollTop
                  }
                  var r, e = window.event || e,
                      s = e.srcElement || e.target,
                      u = e.pageX ? e.pageX : e.clientX + scrollLeft,
                      a = e.pageY ? e.pageY : e.clientY + scrollTop,
                      f = t.offsetWidth,
                      c = t.offsetHeight,
                      h = u - __this.getOffsetLeft(t),
                      p = a - __this.getOffsetTop(t);
                  if (s.nodeName == "INPUT" && s.getAttribute("type") == "submit") {
                      var dataCommerceUrl = t.getAttribute("data-commerce-url");
                      formLogSrc = dataCommerceUrl + "&st=" + st + "&dd=" + dd + "&cl=" + l("ecl") + "&cr=" + l("ecr") + "&dw=" + f + "&dh=" + c + "&px=" + h + "&py=" + p + "&kd=" + l("kd") + "&p1=" + l("p1") + "&p2=" + l("p2") + "&p3=" + l("p3") + "&p4=" + l("p4");
                      if (e.stopPropagation) {
                          e.stopPropagation()
                      } else {
                          e.cancelBubble = true
                      }
                  } else {
                      for (var d = 1; d < 15; d++) {
                          if (s.getAttribute("e_href") || s.getAttribute("data-e_href")) {
                              urlTarget = s;
                              break
                          }
                          s = s.parentNode;
                          if (s == t || s.nodeName == "BODY") {
                              return
                          }
                      }
                      r = s.getAttribute("e_href") || s.getAttribute("data-e_href");
                      tps = "&st=" + st + "&dd=" + dd + "&cl=" + l("ecl") + "&cr=" + l("ecr") + "&dw=" + f + "&dh=" + c + "&px=" + h + "&py=" + p + "&kd=" + l("kd") + "&p1=" + l("p1") + "&p2=" + l("p2") + "&p3=" + l("p3") + "&p4=" + l("p4");
                      s.setAttribute("href", r)
                  }
              }

              function mouseUp(e) {
                  ud = new Date().getTime();
                  var e = window.event || e,
                      r = e.srcElement || e.target;
                  if (r.nodeName == "INPUT" && r.getAttribute("type") == "submit") {
                      var nimage = new Image;
                      nimage.src = formLogSrc + "&ud=" + ud;
                      if (e.stopPropagation) {
                          e.stopPropagation()
                      } else {
                          e.cancelBubble = true
                      }
                  }
              }

              function mouseClick(e) {
                  var cd = new Date().getTime();
                  var encodeBase64 = (((window.So || {})["lib"] || {}).Base64 || {}).encode;
                  var macroStr = "";
                  if (urlTarget) {
                      var eHref = urlTarget.getAttribute("href") || '';
                      urlTarget.setAttribute("href", "javascript:;");
                      tps += "&ud=" + ud;
                      var cht = (getQuery(eHref) || {}).cht;
                      if (cht == '1') {
                          var ckClick = [e.pageX || -1, e.pageY || -1, e.clientX || -1, e.clientY || -1, e.screenX || -1, e.screenY || -1].join('.');
                          tps += "&ck=" + [ckClick, ckDown, ckEnter].join(".");
                          tps += "&tm=" + [cd, ts, ud, st, dd].join(".");
                          tps += "&scr=" + [document.body.clientWidth || -1, document.body.clientHeight || -1, window.screenTop || -1, window.screenLeft || -1, window.screen.height || -1, window.screen.width || -1].join('.')
                      } else if (cht == '100') {
                          var adTarget, currentTarget = urlTarget;
                          for (var d = 1; d < 15; d++) {
                              if (currentTarget.nodeName == "LI" && currentTarget.getAttribute("clks")) {
                                  adTarget = currentTarget;
                                  break
                              }
                              currentTarget = currentTarget.parentNode;
                              if (currentTarget == t || currentTarget.nodeName == "BODY") {
                                  return
                              }
                          }
                          if (adTarget) {
                              var adTargetBCR = adTarget.getBoundingClientRect();
                              var macro = {
                                  __EVENT_TIME_START__: dd,
                                  __EVENT_TIME_END__: ud,
                                  __OFFSET_X__: Math.floor(Math.max(0, e.clientX - adTargetBCR.left)),
                                  __OFFSET_Y__: Math.floor(Math.max(0, e.clientY - adTargetBCR.top)),
                                  __ADSPACE_W__: Math.floor(adTargetBCR.width),
                                  __ADSPACE_H__: Math.floor(adTargetBCR.height)
                              };
                              eHref = getReplaceUrl(eHref, macro);
                              macroStr = JSON.stringify(macro);
                              macroStr = "&macro=" + (typeof encodeBase64 === 'function' ? encodeBase64(macroStr, true) : macroStr);
                              var clks = (adTarget.getAttribute('clks') || '').split(',');
                              (Array.isArray(clks) ? clks : []).forEach(function(url, idx) {
                                  sendImgLog(getReplaceUrl(url, macro), "li_clks_" + idx + "_")
                              })
                          }
                      }
                      if (~eHref.indexOf('/link?m=') && typeof encodeBase64 === 'function') {
                          urlTarget.setAttribute("href", eHref + '.' + encodeBase64(tps, true))
                      } else {
                          urlTarget.setAttribute("href", eHref + tps + macroStr)
                      }
                  }
              }

              function getQuery(url) {
                  var search = window.location.search || '';
                  if (url) {
                      var idx = url.indexOf('?');
                      if (~idx) {
                          search = url.slice(idx)
                      }
                  }
                  var qs = (search.length ? search.substring(1) : ''),
                      args = {},
                      items = qs.length ? qs.split("&") : [],
                      item = null,
                      name = null,
                      value = null,
                      i = 0,
                      len = items.length;
                  for (i = 0; i < len; i++) {
                      item = items[i].split("=");
                      name = decodeURIComponent(item[0]);
                      value = decodeURIComponent(item[1]);
                      if (name.length) {
                          args[name] = value
                      }
                  }
                  return args
              }

              function sendImgLog(url, id, cb) {
                  var _r = new Date().getTime();
                  id = (id || 'send_log_') + _r;
                  if (!!url) {
                      var img = new Image;
                      window[id] = img;
                      img.onload = img.onerror = function() {
                          window[id] = null;
                          typeof cb === 'function' && cb()
                      };
                      img.src = url + (~url.indexOf("?") ? "&" : "?") + "_r=" + _r
                  }
              }

              function getReplaceUrl(url, pa) {
                  pa = typeof pa === 'object' ? pa : {};
                  return ((url || '').replace(/__EVENT_TIME_START__/g, pa['__EVENT_TIME_START__']).replace(/__EVENT_TIME_END__/g, pa['__EVENT_TIME_END__']).replace(/__OFFSET_X__/g, pa['__OFFSET_X__']).replace(/__OFFSET_Y__/g, pa['__OFFSET_Y__']).replace(/__ADSPACE_W__/g, pa['__ADSPACE_W__']).replace(/__ADSPACE_H__/g, pa['__ADSPACE_H__']))
              }
              r(t, "mouseenter", mouseEnter);
              r(t, "mousedown", mouseDown);
              r(t, "mouseup", mouseUp);
              r(t, "click", mouseClick)
          }

          function f(e, t) {
              var r = document.body.offsetWidth,
                  i = n.getClientHeight(),
                  s = r / 2,
                  o = i / 2;
              return e < s ? t < o ? 1 : 4 : t < o ? 2 : 3
          }

          function l(e) {
              var t = n.eCookie.get("erules");
              if (t && t.search(e + "-") >= 0) {
                  var r = new RegExp("(" + e + "\\u005c\-)(\\u005c\d+)");
                  return (t.match(r) || [])[2]
              }
              return 0
          }

          function c(e) {
              var t = n.eCookie.get("erules"),
                  r = new Date,
                  i = r.getHours(),
                  s = r.getMinutes(),
                  o = r.getSeconds(),
                  u = i * 3600 + s * 60 + o,
                  a = 86400 - u,
                  f;
              r.setTime(r.getTime() + a * 1e3);
              if (t) {
                  if (t.search(e + "-") >= 0) {
                      var l = new RegExp("(" + e + "\\u005c\-)(\\u005c\d+)"),
                          c = t.match(l) || [],
                          h = parseInt(c[2]) + 1,
                          f = t.replace(l, "$1" + h)
                  } else {
                      f = t + "|" + e + "-1"
                  }
                  n.eCookie.set("erules", f, r)
              } else {
                  n.eCookie.set("erules", e + "-1", r)
              }
          }
          if (!window.eLogAlready) {
              var setcok = function(e) {
                      var t, n = navigator.userAgent.toLowerCase(),
                          e = window.event || e;
                      /msie/.test(n) && (t = parseInt(n.match(/msie.([\d.]+)/)[1])), e.button == 2 ? c("ecr") : (t <= 10 && e.button == 1 || e.button == 0) && c("ecl")
                  },
                  setkd = function(e) {
                      var e = window.event || e;
                      e.keyCode && c("kd")
                  },
                  setpos = function(e) {
                      var t = (new Date).getTime(),
                          e = window.event || e;
                      t - u >= 400 && (u = t, i = e.x ? e.x : e.pageX, s = e.y ? e.y : e.pageY, o = f(i, s), o && c("p" + o))
                  };
              this.addHandler(document, "mousedown", setcok);
              this.addHandler(document, "keydown", setkd);
              this.addHandler(document, "mousemove", setpos);
              window.eLogAlready = 1
          }
          a(e)
      }
  },
  // 影子下获取Element函数
  getElementByIdForShadow: function(id) {
    var shadowDocument = window.ad_document
    if (!shadowDocument) {
      return null
    }
    return shadowDocument.getElementById(id)
  },
  getOffsetLeft: function(o) {
      var left = 0;
      while (o != null && o != document.body && o != document.getElementById("container")) {
          left += o.offsetLeft;
          o = o.offsetParent
      }
      return left
  },
  getOffsetTop: function(o) {
      var top = 0;
      while (o != null && o != document.body) {
          top += o.offsetTop;
          o = o.offsetParent
      }
      return top
  },
  sendpv: function(e) {
    console.trace()
    console.log("sendpv349------", e)
      if (this.getElementByIdForShadow(e)) {
        this.getElementByIdForShadow(e).submit()
      }
  },
  getClientHeight: function() {
      var e = 0;
      return document.body.clientHeight && document.documentElement.clientHeight ? e = document.body.clientHeight < document.documentElement.clientHeight ? document.body.clientHeight : document.documentElement.clientHeight : e = document.body.clientHeight > document.documentElement.clientHeight ? document.body.clientHeight : document.documentElement.clientHeight, e
  }
};
`;