// Generated by CoffeeScript 1.7.1
var cachedCurrentSectionTop, closestSection, gScrollTo, makeSectionObj, navPadding, navPillSelectedOn, navScroller, selectNavPill;

TimelineLite.prototype.addDelay = function(delay, position) {
  switch ($.type(position)) {
    case 'undefined':
    case 'null':
      return this.set({}, {}, "+=" + delay);
    case 'string':
      return this.set({}, {}, "" + position + "+=" + delay);
    case 'number':
      return this.set({}, {}, delay + position);
    default:
      return console.log("BAD POSITION TYPE for addDelay!");
  }
};

gScrollTo = function(target, shouldFlashCb) {
  var $t, faq, hash, options;
  if (target) {
    if (typeof target !== 'string') {
      $t = target;
    } else if (target.indexOf('#') === 0) {
      if (($t = $(target)).length === 0) {
        $t = $("[name='" + (target.slice(1)) + "']");
      }
    } else if (($t = $("[name='" + target + "']")).length === 0) {
      $t = $('#' + target);
    }
    if ($t.length === 0) {
      return console.log("ERROR: can't find: " + target + "!");
    } else {
      hash = '#' + ($t.attr('id') || $t.attr('name'));
      faq = $t.hasClass('faq_question');
      options = {
        duration: 500,
        onAfter: function() {
          var hTgt, highlight;
          window.location.hash = hash;
          if (!faq && shouldFlashCb && !shouldFlashCb()) {
            return;
          }
          hTgt = faq ? $t.parent().next() : $t;
          highlight = function() {
            var color;
            color = $(this).css('background-color');
            return TweenMax.to($(this), 0.5, {
              backgroundColor: "yellow",
              onComplete: (function(_this) {
                return function() {
                  return TweenMax.to($(_this), 0.5, {
                    backgroundColor: color
                  });
                };
              })(this)
            });
          };
          if (faq && hTgt.is(':hidden')) {
            return $t.trigger('click', {
              done: highlight
            });
          } else {
            return highlight.call(hTgt);
          }
        }
      };
      if (faq) {
        $.extend(options, {
          margin: true
        });
      }
      $.scrollTo($t, options);
      return false;
    }
  }
};

cachedCurrentSectionTop = void 0;

navScroller = void 0;

navPadding = 0;

navPillSelectedOn = 0;



makeSectionObj = function(el) {
  return {
    el: el,
    top: $(el).offset().top
  };
};

closestSection = function() {
  var closest, o, offsets, pos, _i, _len;
  pos = $(window).scrollTop() + ($(window).height() / 2);
  offsets = $('section.nav').map(function() {
    return makeSectionObj(this);
  }).get().sort(function(a, b) {
    return a.top - b.top;
  });
  for (_i = 0, _len = offsets.length; _i < _len; _i++) {
    o = offsets[_i];
    if (pos >= o.top) {
      closest = o;
    } else {
      break;
    }
  }
  return closest != null ? closest : offsets[0];
};

$(function() {
  var $firstImg, $firstTxt, $service, $slides, $subtitle, $tagline, IMG_WIDTH, SLIDE_IMG_CENTER, SLIDE_PADDING, SLIDE_TXT_CENTER, SLIDE_TXT_LEFT, SLIDE_TXT_PADDING, STAGGER_AMOUNT, TIME_FOR_IMG_DISPLAY, TIME_PER_ANIMATION, TXT_MARGIN, debug, fadeIn, fadeOut, navBoundary, navNeedsUpdate, tl, winHash;
  $("a[href^='#']:not(.fancybox)").click(function() {
    var target;
    if ((target = $(this).attr('href').slice(1)) !== '') {
      return gScrollTo(target, function() {
        return !selectNavPill(target, true);
      });
    }
  });
  $(".faq h3").next().hide();
  $(".faq h3").wrap('<a href="#"></a>').click(function(a, obj) {
    var _ref;
    $(this).parent().next().slideToggle({
      duration: "fast",
      complete: (_ref = obj != null ? obj.done : void 0) != null ? _ref : function() {}
    });
    return false;
  });

  $service = $('#service');
  $subtitle = $('#subtitle');
  $tagline = $('#serviceTagline');
  $firstImg = $('.slideshow img').first();
  $firstTxt = $('.slideshow span').first();
  debug = void 0;
  TIME_PER_ANIMATION = 1;
  TIME_FOR_IMG_DISPLAY = 5;
  STAGGER_AMOUNT = TIME_PER_ANIMATION + TIME_FOR_IMG_DISPLAY;
  SLIDE_PADDING = 100;
  SLIDE_TXT_PADDING = $firstTxt.outerHeight(true);
  TXT_MARGIN = ($tagline.outerHeight(true) - $tagline.outerHeight(false)) / 2;
  SLIDE_TXT_CENTER = $subtitle.outerHeight(true) + TXT_MARGIN;
  SLIDE_TXT_LEFT = $service.offset().left;
  IMG_WIDTH = $firstImg.width();
  if ($firstImg.parent().offset().left === $subtitle.offset().left) {
    SLIDE_IMG_CENTER = Math.max($subtitle.width() / 2 - IMG_WIDTH / 2, 0);
  } else {
    SLIDE_IMG_CENTER = 0;
  }
  tl = new TimelineMax({
    repeat: -1,
    paused: true
  });
  fadeIn = function(elements, endLocs, t) {
    var $el, idx, _i, _len, _ref, _results;
    if (elements.length == null) {
      _ref = [[elements], [endLocs]], elements = _ref[0], endLocs = _ref[1];
    }
    _results = [];
    for (idx = _i = 0, _len = elements.length; _i < _len; idx = ++_i) {
      $el = elements[idx];
      if ($el.css('visibility') === 'hidden') {
        if (debug != null) {
          console.log("" + t + ": " + (new Date()) + " fadeIn : " + ($el.attr('src')));
        }
        _results.push(TweenMax.to($el, TIME_PER_ANIMATION, $.extend({}, endLocs[idx], {
          autoAlpha: 1
        })));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };
  fadeOut = function(elements, endLocs, t) {
    var _$el, _i, _idx, _len, _ref, _results;
    if (elements.length == null) {
      _ref = [[elements], [endLocs]], elements = _ref[0], endLocs = _ref[1];
    }
    _results = [];
    for (_idx = _i = 0, _len = elements.length; _i < _len; _idx = ++_i) {
      _$el = elements[_idx];
      _results.push((function() {
        var $el, dir, idx, resetLoc, _ref1;
        _ref1 = [_$el, _idx], $el = _ref1[0], idx = _ref1[1];
        if ($el.css('visibility') !== 'hidden') {
          if (debug != null) {
            console.log("" + t + ": " + (new Date()) + " fadeOut: " + ($el.attr('src')));
          }
          resetLoc = $.extend({}, endLocs[idx]);
          dir = Object.keys(resetLoc)[0];
          resetLoc[dir] = endLocs[idx][dir] + 2 * ($el.position()[dir] - endLocs[idx][dir]);
          return TweenMax.to($el, TIME_PER_ANIMATION, $.extend({}, endLocs[idx], {
            autoAlpha: 0,
            onComplete: function() {
              return $el.css(resetLoc);
            }
          }));
        } else if (debug != null) {
          return console.log("" + t + ": " + (new Date()) + " fadeOut: " + ($el.attr('src')) + " SKIPPING CAUSE: " + ($el.css('visibility')));
        }
      })());
    }
    return _results;
  };
  $slides = $('.slideshow > div');
  $slides.each(function(idx, el) {
    var $img, $text, endImgLoc, endTxtLoc, objs, pt1, pt2, startImgLoc, startTxtLoc, _ref, _ref1;
    _ref = objs = [$(el).find('img'), $(el).find('span')], $img = _ref[0], $text = _ref[1];
    _ref1 = [idx * STAGGER_AMOUNT, STAGGER_AMOUNT + (idx * STAGGER_AMOUNT)], pt1 = _ref1[0], pt2 = _ref1[1];
    if (debug != null) {
      console.log("" + idx + ": [pt1=" + pt1 + ", pt2=" + pt2 + "]");
    }
    $img.css({
      left: startImgLoc = IMG_WIDTH + SLIDE_PADDING
    });
    $text.css({
      top: startTxtLoc = SLIDE_TXT_CENTER + SLIDE_TXT_PADDING
    });
    $text.offset({
      left: SLIDE_TXT_LEFT
    });
    endImgLoc = -startImgLoc;
    endTxtLoc = startTxtLoc - 2 * SLIDE_TXT_PADDING;
    tl.addCallback(fadeIn, pt1, [
      objs, [
        {
          left: SLIDE_IMG_CENTER
        }, {
          top: SLIDE_TXT_CENTER
        }
      ], pt1
    ]);
    if (idx + 1 === $slides.length) {
      tl.addCallback(fadeOut, 0, [
        objs, [
          {
            left: endImgLoc
          }, {
            top: endTxtLoc
          }
        ], 0
      ]);
      return tl.addDelay(TIME_FOR_IMG_DISPLAY, pt1);
    } else {
      return tl.addCallback(fadeOut, pt2, [
        objs, [
          {
            left: endImgLoc
          }, {
            top: endTxtLoc
          }
        ], pt2
      ]);
    }
  });
  tl.play();
  winHash = window.location.hash.slice(1);
  return gScrollTo(winHash, function() {
    return !selectNavPill(winHash, true);
  });

});
