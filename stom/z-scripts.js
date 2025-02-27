if (
    ((function (a) {
        "use strict";
        function r(t) {
            return t.is('[type="checkbox"]') ? t.prop("checked") : t.is('[type="radio"]') ? !!a('[name="' + t.attr("name") + '"]:checked').length : t.val();
        }
        var n = function (t, e) {
            (this.options = e),
                (this.validators = a.extend({}, n.VALIDATORS, e.custom)),
                (this.$element = a(t)),
                (this.$btn = a('button[type="submit"], input[type="submit"]')
                    .filter('[form="' + this.$element.attr("id") + '"]')
                    .add(this.$element.find('input[type="submit"], button[type="submit"]'))),
                this.update(),
                this.$element.on("input.bs.validator change.bs.validator focusout.bs.validator", a.proxy(this.onInput, this)),
                this.$element.on("submit.bs.validator", a.proxy(this.onSubmit, this)),
                this.$element.on("reset.bs.validator", a.proxy(this.reset, this)),
                this.$element.find("[data-match]").each(function () {
                    var e = a(this),
                        t = e.data("match");
                    a(t).on("input.bs.validator", function (t) {
                        r(e) && e.trigger("input.bs.validator");
                    });
                }),
                this.$inputs
                    .filter(function () {
                        return r(a(this));
                    })
                    .trigger("focusout"),
                this.$element.attr("novalidate", !0),
                this.toggleSubmit();
        };
        function e(s) {
            return this.each(function () {
                var t = a(this),
                    e = a.extend({}, n.DEFAULTS, t.data(), "object" == typeof s && s),
                    i = t.data("bs.validator");
                (i || "destroy" != s) && (i || t.data("bs.validator", (i = new n(this, e))), "string" == typeof s && i[s]());
            });
        }
        (n.VERSION = "0.11.5"),
            (n.INPUT_SELECTOR = ':input:not([type="hidden"], [type="submit"], [type="reset"], button)'),
            (n.FOCUS_OFFSET = 20),
            (n.DEFAULTS = { delay: 500, html: !1, disable: !0, focus: !0, custom: {}, errors: { match: "Does not match", minlength: "Not long enough" }, feedback: { success: "glyphicon-ok", error: "glyphicon-remove" } }),
            (n.VALIDATORS = {
                native: function (t) {
                    var e = t[0];
                    if (e.checkValidity) return !e.checkValidity() && !e.validity.valid && (e.validationMessage || "error!");
                },
                match: function (t) {
                    var e = t.data("match");
                    return t.val() !== a(e).val() && n.DEFAULTS.errors.match;
                },
                minlength: function (t) {
                    var e = t.data("minlength");
                    return t.val().length < e && n.DEFAULTS.errors.minlength;
                },
            }),
            (n.prototype.update = function () {
                return (this.$inputs = this.$element.find(n.INPUT_SELECTOR).add(this.$element.find('[data-validate="true"]')).not(this.$element.find('[data-validate="false"]'))), this;
            }),
            (n.prototype.onInput = function (t) {
                var e = this,
                    i = a(t.target),
                    s = "focusout" !== t.type;
                this.$inputs.is(i) &&
                    this.validateInput(i, s).done(function () {
                        e.toggleSubmit();
                    });
            }),
            (n.prototype.validateInput = function (e, i) {
                r(e);
                var s = e.data("bs.validator.errors");
                e.is('[type="radio"]') && (e = this.$element.find('input[name="' + e.attr("name") + '"]'));
                var n = a.Event("validate.bs.validator", { relatedTarget: e[0] });
                if ((this.$element.trigger(n), !n.isDefaultPrevented())) {
                    var o = this;
                    return this.runValidators(e).done(function (t) {
                        e.data("bs.validator.errors", t),
                            t.length ? (i ? o.defer(e, o.showErrors) : o.showErrors(e)) : o.clearErrors(e),
                            (s && t.toString() === s.toString()) ||
                                ((n = t.length ? a.Event("invalid.bs.validator", { relatedTarget: e[0], detail: t }) : a.Event("valid.bs.validator", { relatedTarget: e[0], detail: s })), o.$element.trigger(n)),
                            o.toggleSubmit(),
                            o.$element.trigger(a.Event("validated.bs.validator", { relatedTarget: e[0] }));
                    });
                }
            }),
            (n.prototype.runValidators = function (s) {
                var n = [],
                    e = a.Deferred();
                function o(t) {
                    return (
                        (i = t),
                        s.data(i + "-error") ||
                            ((e = s[0].validity).typeMismatch
                                ? s.data("type-error")
                                : e.patternMismatch
                                ? s.data("pattern-error")
                                : e.stepMismatch
                                ? s.data("step-error")
                                : e.rangeOverflow
                                ? s.data("max-error")
                                : e.rangeUnderflow
                                ? s.data("min-error")
                                : e.valueMissing
                                ? s.data("required-error")
                                : null) ||
                            s.data("error")
                    );
                    var e, i;
                }
                return (
                    s.data("bs.validator.deferred") && s.data("bs.validator.deferred").reject(),
                    s.data("bs.validator.deferred", e),
                    a.each(
                        this.validators,
                        a.proxy(function (t, e) {
                            var i = null;
                            (r(s) || s.attr("required")) && (s.data(t) || "native" == t) && (i = e.call(this, s)) && ((i = o(t) || i), !~n.indexOf(i) && n.push(i));
                        }, this)
                    ),
                    !n.length && r(s) && s.data("remote")
                        ? this.defer(s, function () {
                              var t = {};
                              (t[s.attr("name")] = r(s)),
                                  a
                                      .get(s.data("remote"), t)
                                      .fail(function (t, e, i) {
                                          n.push(o("remote") || i);
                                      })
                                      .always(function () {
                                          e.resolve(n);
                                      });
                          })
                        : e.resolve(n),
                    e.promise()
                );
            }),
            (n.prototype.validate = function () {
                var e = this;
                return (
                    a
                        .when(
                            this.$inputs.map(function (t) {
                                return e.validateInput(a(this), !1);
                            })
                        )
                        .then(function () {
                            e.toggleSubmit(), e.focusError();
                        }),
                    this
                );
            }),
            (n.prototype.focusError = function () {
                if (this.options.focus) {
                    var t = a(".has-error:first :input");
                    0 !== t.length && (a("html, body").animate({ scrollTop: t.offset().top - n.FOCUS_OFFSET }, 250), t.focus());
                }
            }),
            (n.prototype.showErrors = function (t) {
                var e = this.options.html ? "html" : "text",
                    i = t.data("bs.validator.errors"),
                    s = t.closest(".form-group"),
                    n = s.find(".help-block.with-errors"),
                    o = s.find(".form-control-feedback");
                i.length &&
                    ((i = a("<ul/>")
                        .addClass("list-unstyled")
                        .append(
                            a.map(i, function (t) {
                                return a("<li/>")[e](t);
                            })
                        )),
                    void 0 === n.data("bs.validator.originalContent") && n.data("bs.validator.originalContent", n.html()),
                    n.empty().append(i),
                    s.addClass("has-error has-danger"),
                    s.hasClass("has-feedback") && o.removeClass(this.options.feedback.success) && o.addClass(this.options.feedback.error) && s.removeClass("has-success"));
            }),
            (n.prototype.clearErrors = function (t) {
                var e = t.closest(".form-group"),
                    i = e.find(".help-block.with-errors"),
                    s = e.find(".form-control-feedback");
                i.html(i.data("bs.validator.originalContent")),
                    e.removeClass("has-error has-danger has-success"),
                    e.hasClass("has-feedback") && s.removeClass(this.options.feedback.error) && s.removeClass(this.options.feedback.success) && r(t) && s.addClass(this.options.feedback.success) && e.addClass("has-success");
            }),
            (n.prototype.hasErrors = function () {
                return !!this.$inputs.filter(function () {
                    return !!(a(this).data("bs.validator.errors") || []).length;
                }).length;
            }),
            (n.prototype.isIncomplete = function () {
                return !!this.$inputs.filter("[required]").filter(function () {
                    var t = r(a(this));
                    return !("string" == typeof t ? a.trim(t) : t);
                }).length;
            }),
            (n.prototype.onSubmit = function (t) {
                this.validate(), (this.isIncomplete() || this.hasErrors()) && t.preventDefault();
            }),
            (n.prototype.toggleSubmit = function () {
                this.options.disable && this.$btn.toggleClass("disabled", this.isIncomplete() || this.hasErrors());
            }),
            (n.prototype.defer = function (t, e) {
                if (((e = a.proxy(e, this, t)), !this.options.delay)) return e();
                window.clearTimeout(t.data("bs.validator.timeout")), t.data("bs.validator.timeout", window.setTimeout(e, this.options.delay));
            }),
            (n.prototype.reset = function () {
                return (
                    this.$element.find(".form-control-feedback").removeClass(this.options.feedback.error).removeClass(this.options.feedback.success),
                    this.$inputs.removeData(["bs.validator.errors", "bs.validator.deferred"]).each(function () {
                        var t = a(this),
                            e = t.data("bs.validator.timeout");
                        window.clearTimeout(e) && t.removeData("bs.validator.timeout");
                    }),
                    this.$element.find(".help-block.with-errors").each(function () {
                        var t = a(this),
                            e = t.data("bs.validator.originalContent");
                        t.removeData("bs.validator.originalContent").html(e);
                    }),
                    this.$btn.removeClass("disabled"),
                    this.$element.find(".has-error, .has-danger, .has-success").removeClass("has-error has-danger has-success"),
                    this
                );
            }),
            (n.prototype.destroy = function () {
                return (
                    this.reset(),
                    this.$element.removeAttr("novalidate").removeData("bs.validator").off(".bs.validator"),
                    this.$inputs.off(".bs.validator"),
                    (this.options = null),
                    (this.validators = null),
                    (this.$element = null),
                    (this.$btn = null),
                    this
                );
            });
        var t = a.fn.validator;
        (a.fn.validator = e),
            (a.fn.validator.Constructor = n),
            (a.fn.validator.noConflict = function () {
                return (a.fn.validator = t), this;
            }),
            a(window).on("load", function () {
                a('form[data-toggle="validator"]').each(function () {
                    var t = a(this);
                    e.call(t, t.data());
                });
            });
    })(jQuery),
    (function (u) {
        "use strict";
        var n = function (t, e) {
            (this.options = u.extend({}, u.fn.bfhphone.defaults, e)),
                (this.$element = u(t)),
                (this.$element.is('input[type="text"]') || this.$element.is('input[type="tel"]')) && this.addFormatter(),
                this.$element.is("span") && this.displayFormatter();
        };
        function p(t, e) {
            var i, s, n, o;
            for (i = "", e = String(e).replace(/\D/g, ""), n = s = 0; s < t.length; s += 1)
                /\d/g.test(t.charAt(s))
                    ? t.charAt(s) === e.charAt(n)
                        ? ((i += e.charAt(n)), (n += 1))
                        : (i += t.charAt(s))
                    : "d" !== t.charAt(s)
                    ? ("" === e.charAt(n) && "+" !== t.charAt(s)) || (i += t.charAt(s))
                    : "" === e.charAt(n)
                    ? (i += "")
                    : ((i += e.charAt(n)), (n += 1));
            return "d" !== (o = t.charAt(i.length)) && (i += o), i;
        }
        n.prototype = {
            constructor: n,
            addFormatter: function () {
                var t;
                "" !== this.options.country &&
                    (0 !== (t = u(document).find("#" + this.options.country)).length
                        ? ((this.options.format = BFHPhoneFormatList[t.val()]), t.on("change", { phone: this }, this.changeCountry))
                        : (this.options.format = BFHPhoneFormatList[this.options.country])),
                    this.$element.on("keyup.bfhphone.data-api", n.prototype.change),
                    this.loadFormatter();
            },
            loadFormatter: function () {
                var t;
                (t = p(this.options.format, this.$element.val())), this.$element.val(t);
            },
            displayFormatter: function () {
                var t;
                "" !== this.options.country && (this.options.format = BFHPhoneFormatList[this.options.country]), (t = p(this.options.format, this.options.number)), this.$element.html(t);
            },
            changeCountry: function (t) {
                var e, i;
                (e = u(this)), (i = t.data.phone).$element.val(String(i.$element.val()).replace(/\+\d*/g, "")), (i.options.format = BFHPhoneFormatList[e.val()]), i.loadFormatter();
            },
            change: function (t) {
                var e, i, s, n, o, a, r, l, d, c;
                return !(
                    !(e = u(this).data("bfhphone")).$element.is(".disabled") &&
                    void 0 === e.$element.attr("disabled") &&
                    ((s = !1),
                    (l = e.$element[0]),
                    (c = 0),
                    document.selection ? (l.focus(), (d = document.selection.createRange()).moveStart("character", -l.value.length), (c = d.text.length)) : (l.selectionStart || 0 === l.selectionStart) && (c = l.selectionStart),
                    (i = c) === e.$element.val().length && (s = !0),
                    8 === t.which && "d" !== e.options.format.charAt(e.$element.val().length) && e.$element.val(String(e.$element.val()).substring(0, e.$element.val().length - 1)),
                    (n = p(e.options.format, e.$element.val())) === e.$element.val() ||
                        (e.$element.val(n),
                        s && (i = e.$element.val().length),
                        (o = e.$element[0]),
                        (a = i),
                        document.selection
                            ? (o.focus(), (r = document.selection.createRange()).moveStart("character", -o.value.length), r.moveStart("character", a), r.moveEnd("character", 0), r.select())
                            : (o.selectionStart || 0 === o.selectionStart) && ((o.selectionStart = a), (o.selectionEnd = a), o.focus())),
                    0)
                );
            },
        };
        var t = u.fn.bfhphone;
        (u.fn.bfhphone = function (s) {
            return this.each(function () {
                var t, e, i;
                (e = (t = u(this)).data("bfhphone")), (i = "object" == typeof s && s), e || t.data("bfhphone", (e = new n(this, i))), "string" == typeof s && e[s].call(t);
            });
        }),
            (u.fn.bfhphone.Constructor = n),
            (u.fn.bfhphone.defaults = { format: "", number: "", country: "" }),
            (u.fn.bfhphone.noConflict = function () {
                return (u.fn.bfhphone = t), this;
            }),
            u(document).ready(function () {
                u('form input[type="text"].bfh-phone, form input[type="tel"].bfh-phone, span.bfh-phone').each(function () {
                    var t;
                    (t = u(this)).bfhphone(t.data());
                });
            });
    })(window.jQuery),
    "undefined" == typeof jQuery)
)
    throw new Error("Bootstrap's JavaScript requires jQuery");
!(function (t) {
    "use strict";
    var e = jQuery.fn.jquery.split(" ")[0].split(".");
    if ((e[0] < 2 && e[1] < 9) || (1 == e[0] && 9 == e[1] && e[2] < 1) || 2 < e[0]) throw new Error("Bootstrap's JavaScript requires jQuery version 1.9.1 or higher, but lower than version 3");
})(),
    (function (s) {
        "use strict";
        (s.fn.emulateTransitionEnd = function (t) {
            var e = !1,
                i = this;
            return (
                s(this).one("bsTransitionEnd", function () {
                    e = !0;
                }),
                setTimeout(function () {
                    e || s(i).trigger(s.support.transition.end);
                }, t),
                this
            );
        }),
            s(function () {
                (s.support.transition = (function () {
                    var t = document.createElement("bootstrap"),
                        e = { WebkitTransition: "webkitTransitionEnd", MozTransition: "transitionend", OTransition: "oTransitionEnd otransitionend", transition: "transitionend" };
                    for (var i in e) if (void 0 !== t.style[i]) return { end: e[i] };
                    return !1;
                })()),
                    s.support.transition &&
                        (s.event.special.bsTransitionEnd = {
                            bindType: s.support.transition.end,
                            delegateType: s.support.transition.end,
                            handle: function (t) {
                                if (s(t.target).is(this)) return t.handleObj.handler.apply(this, arguments);
                            },
                        });
            });
    })(jQuery),
    (function (o) {
        "use strict";
        var e = '[data-dismiss="alert"]',
            a = function (t) {
                o(t).on("click", e, this.close);
            };
        (a.VERSION = "3.3.6"),
            (a.TRANSITION_DURATION = 150),
            (a.prototype.close = function (t) {
                var e = o(this),
                    i = e.attr("data-target");
                i || (i = (i = e.attr("href")) && i.replace(/.*(?=#[^\s]*$)/, ""));
                var s = o(i);
                function n() {
                    s.detach().trigger("closed.bs.alert").remove();
                }
                t && t.preventDefault(),
                    s.length || (s = e.closest(".alert")),
                    s.trigger((t = o.Event("close.bs.alert"))),
                    t.isDefaultPrevented() || (s.removeClass("in"), o.support.transition && s.hasClass("fade") ? s.one("bsTransitionEnd", n).emulateTransitionEnd(a.TRANSITION_DURATION) : n());
            });
        var t = o.fn.alert;
        (o.fn.alert = function (i) {
            return this.each(function () {
                var t = o(this),
                    e = t.data("bs.alert");
                e || t.data("bs.alert", (e = new a(this))), "string" == typeof i && e[i].call(t);
            });
        }),
            (o.fn.alert.Constructor = a),
            (o.fn.alert.noConflict = function () {
                return (o.fn.alert = t), this;
            }),
            o(document).on("click.bs.alert.data-api", e, a.prototype.close);
    })(jQuery),
    (function (o) {
        "use strict";
        var n = function (t, e) {
            (this.$element = o(t)), (this.options = o.extend({}, n.DEFAULTS, e)), (this.isLoading = !1);
        };
        function i(s) {
            return this.each(function () {
                var t = o(this),
                    e = t.data("bs.button"),
                    i = "object" == typeof s && s;
                e || t.data("bs.button", (e = new n(this, i))), "toggle" == s ? e.toggle() : s && e.setState(s);
            });
        }
        (n.VERSION = "3.3.6"),
            (n.DEFAULTS = { loadingText: "loading..." }),
            (n.prototype.setState = function (t) {
                var e = "disabled",
                    i = this.$element,
                    s = i.is("input") ? "val" : "html",
                    n = i.data();
                (t += "Text"),
                    null == n.resetText && i.data("resetText", i[s]()),
                    setTimeout(
                        o.proxy(function () {
                            i[s](null == n[t] ? this.options[t] : n[t]), "loadingText" == t ? ((this.isLoading = !0), i.addClass(e).attr(e, e)) : this.isLoading && ((this.isLoading = !1), i.removeClass(e).removeAttr(e));
                        }, this),
                        0
                    );
            }),
            (n.prototype.toggle = function () {
                var t = !0,
                    e = this.$element.closest('[data-toggle="buttons"]');
                if (e.length) {
                    var i = this.$element.find("input");
                    "radio" == i.prop("type")
                        ? (i.prop("checked") && (t = !1), e.find(".active").removeClass("active"), this.$element.addClass("active"))
                        : "checkbox" == i.prop("type") && (i.prop("checked") !== this.$element.hasClass("active") && (t = !1), this.$element.toggleClass("active")),
                        i.prop("checked", this.$element.hasClass("active")),
                        t && i.trigger("change");
                } else this.$element.attr("aria-pressed", !this.$element.hasClass("active")), this.$element.toggleClass("active");
            });
        var t = o.fn.button;
        (o.fn.button = i),
            (o.fn.button.Constructor = n),
            (o.fn.button.noConflict = function () {
                return (o.fn.button = t), this;
            }),
            o(document)
                .on("click.bs.button.data-api", '[data-toggle^="button"]', function (t) {
                    var e = o(t.target);
                    e.hasClass("btn") || (e = e.closest(".btn")), i.call(e, "toggle"), o(t.target).is('input[type="radio"]') || o(t.target).is('input[type="checkbox"]') || t.preventDefault();
                })
                .on("focus.bs.button.data-api blur.bs.button.data-api", '[data-toggle^="button"]', function (t) {
                    o(t.target)
                        .closest(".btn")
                        .toggleClass("focus", /^focus(in)?$/.test(t.type));
                });
    })(jQuery),
    (function (u) {
        "use strict";
        var p = function (t, e) {
            (this.$element = u(t)),
                (this.$indicators = this.$element.find(".carousel-indicators")),
                (this.options = e),
                (this.paused = null),
                (this.sliding = null),
                (this.interval = null),
                (this.$active = null),
                (this.$items = null),
                this.options.keyboard && this.$element.on("keydown.bs.carousel", u.proxy(this.keydown, this)),
                "hover" == this.options.pause && !("ontouchstart" in document.documentElement) && this.$element.on("mouseenter.bs.carousel", u.proxy(this.pause, this)).on("mouseleave.bs.carousel", u.proxy(this.cycle, this));
        };
        function a(n) {
            return this.each(function () {
                var t = u(this),
                    e = t.data("bs.carousel"),
                    i = u.extend({}, p.DEFAULTS, t.data(), "object" == typeof n && n),
                    s = "string" == typeof n ? n : i.slide;
                e || t.data("bs.carousel", (e = new p(this, i))), "number" == typeof n ? e.to(n) : s ? e[s]() : i.interval && e.pause().cycle();
            });
        }
        (p.VERSION = "3.3.6"),
            (p.TRANSITION_DURATION = 600),
            (p.DEFAULTS = { interval: 5e3, pause: "hover", wrap: !0, keyboard: !0 }),
            (p.prototype.keydown = function (t) {
                if (!/input|textarea/i.test(t.target.tagName)) {
                    switch (t.which) {
                        case 37:
                            this.prev();
                            break;
                        case 39:
                            this.next();
                            break;
                        default:
                            return;
                    }
                    t.preventDefault();
                }
            }),
            (p.prototype.cycle = function (t) {
                return t || (this.paused = !1), this.interval && clearInterval(this.interval), this.options.interval && !this.paused && (this.interval = setInterval(u.proxy(this.next, this), this.options.interval)), this;
            }),
            (p.prototype.getItemIndex = function (t) {
                return (this.$items = t.parent().children(".item")), this.$items.index(t || this.$active);
            }),
            (p.prototype.getItemForDirection = function (t, e) {
                var i = this.getItemIndex(e);
                if ((("prev" == t && 0 === i) || ("next" == t && i == this.$items.length - 1)) && !this.options.wrap) return e;
                var s = (i + ("prev" == t ? -1 : 1)) % this.$items.length;
                return this.$items.eq(s);
            }),
            (p.prototype.to = function (t) {
                var e = this,
                    i = this.getItemIndex((this.$active = this.$element.find(".item.active")));
                if (!(t > this.$items.length - 1 || t < 0))
                    return this.sliding
                        ? this.$element.one("slid.bs.carousel", function () {
                              e.to(t);
                          })
                        : i == t
                        ? this.pause().cycle()
                        : this.slide(i < t ? "next" : "prev", this.$items.eq(t));
            }),
            (p.prototype.pause = function (t) {
                return t || (this.paused = !0), this.$element.find(".next, .prev").length && u.support.transition && (this.$element.trigger(u.support.transition.end), this.cycle(!0)), (this.interval = clearInterval(this.interval)), this;
            }),
            (p.prototype.next = function () {
                if (!this.sliding) return this.slide("next");
            }),
            (p.prototype.prev = function () {
                if (!this.sliding) return this.slide("prev");
            }),
            (p.prototype.slide = function (t, e) {
                var i = this.$element.find(".item.active"),
                    s = e || this.getItemForDirection(t, i),
                    n = this.interval,
                    o = "next" == t ? "left" : "right",
                    a = this;
                if (s.hasClass("active")) return (this.sliding = !1);
                var r = s[0],
                    l = u.Event("slide.bs.carousel", { relatedTarget: r, direction: o });
                if ((this.$element.trigger(l), !l.isDefaultPrevented())) {
                    if (((this.sliding = !0), n && this.pause(), this.$indicators.length)) {
                        this.$indicators.find(".active").removeClass("active");
                        var d = u(this.$indicators.children()[this.getItemIndex(s)]);
                        d && d.addClass("active");
                    }
                    var c = u.Event("slid.bs.carousel", { relatedTarget: r, direction: o });
                    return (
                        u.support.transition && this.$element.hasClass("slide")
                            ? (s.addClass(t),
                              s[0].offsetWidth,
                              i.addClass(o),
                              s.addClass(o),
                              i
                                  .one("bsTransitionEnd", function () {
                                      s.removeClass([t, o].join(" ")).addClass("active"),
                                          i.removeClass(["active", o].join(" ")),
                                          (a.sliding = !1),
                                          setTimeout(function () {
                                              a.$element.trigger(c);
                                          }, 0);
                                  })
                                  .emulateTransitionEnd(p.TRANSITION_DURATION))
                            : (i.removeClass("active"), s.addClass("active"), (this.sliding = !1), this.$element.trigger(c)),
                        n && this.cycle(),
                        this
                    );
                }
            });
        var t = u.fn.carousel;
        (u.fn.carousel = a),
            (u.fn.carousel.Constructor = p),
            (u.fn.carousel.noConflict = function () {
                return (u.fn.carousel = t), this;
            });
        var e = function (t) {
            var e,
                i = u(this),
                s = u(i.attr("data-target") || ((e = i.attr("href")) && e.replace(/.*(?=#[^\s]+$)/, "")));
            if (s.hasClass("carousel")) {
                var n = u.extend({}, s.data(), i.data()),
                    o = i.attr("data-slide-to");
                o && (n.interval = !1), a.call(s, n), o && s.data("bs.carousel").to(o), t.preventDefault();
            }
        };
        u(document).on("click.bs.carousel.data-api", "[data-slide]", e).on("click.bs.carousel.data-api", "[data-slide-to]", e),
            u(window).on("load", function () {
                u('[data-ride="carousel"]').each(function () {
                    var t = u(this);
                    a.call(t, t.data());
                });
            });
    })(jQuery),
    (function (a) {
        "use strict";
        var r = function (t, e) {
            (this.$element = a(t)),
                (this.options = a.extend({}, r.DEFAULTS, e)),
                (this.$trigger = a('[data-toggle="collapse"][href="#' + t.id + '"],[data-toggle="collapse"][data-target="#' + t.id + '"]')),
                (this.transitioning = null),
                this.options.parent ? (this.$parent = this.getParent()) : this.addAriaAndCollapsedClass(this.$element, this.$trigger),
                this.options.toggle && this.toggle();
        };
        function n(t) {
            var e,
                i = t.attr("data-target") || ((e = t.attr("href")) && e.replace(/.*(?=#[^\s]+$)/, ""));
            return a(i);
        }
        function l(s) {
            return this.each(function () {
                var t = a(this),
                    e = t.data("bs.collapse"),
                    i = a.extend({}, r.DEFAULTS, t.data(), "object" == typeof s && s);
                !e && i.toggle && /show|hide/.test(s) && (i.toggle = !1), e || t.data("bs.collapse", (e = new r(this, i))), "string" == typeof s && e[s]();
            });
        }
        (r.VERSION = "3.3.6"),
            (r.TRANSITION_DURATION = 350),
            (r.DEFAULTS = { toggle: !0 }),
            (r.prototype.dimension = function () {
                return this.$element.hasClass("width") ? "width" : "height";
            }),
            (r.prototype.show = function () {
                if (!this.transitioning && !this.$element.hasClass("in")) {
                    var t,
                        e = this.$parent && this.$parent.children(".panel").children(".in, .collapsing");
                    if (!(e && e.length && (t = e.data("bs.collapse")) && t.transitioning)) {
                        var i = a.Event("show.bs.collapse");
                        if ((this.$element.trigger(i), !i.isDefaultPrevented())) {
                            e && e.length && (l.call(e, "hide"), t || e.data("bs.collapse", null));
                            var s = this.dimension();
                            this.$element.removeClass("collapse").addClass("collapsing")[s](0).attr("aria-expanded", !0), this.$trigger.removeClass("collapsed").attr("aria-expanded", !0), (this.transitioning = 1);
                            var n = function () {
                                this.$element.removeClass("collapsing").addClass("collapse in")[s](""), (this.transitioning = 0), this.$element.trigger("shown.bs.collapse");
                            };
                            if (!a.support.transition) return n.call(this);
                            var o = a.camelCase(["scroll", s].join("-"));
                            this.$element.one("bsTransitionEnd", a.proxy(n, this)).emulateTransitionEnd(r.TRANSITION_DURATION)[s](this.$element[0][o]);
                        }
                    }
                }
            }),
            (r.prototype.hide = function () {
                if (!this.transitioning && this.$element.hasClass("in")) {
                    var t = a.Event("hide.bs.collapse");
                    if ((this.$element.trigger(t), !t.isDefaultPrevented())) {
                        var e = this.dimension();
                        this.$element[e](this.$element[e]())[0].offsetHeight,
                            this.$element.addClass("collapsing").removeClass("collapse in").attr("aria-expanded", !1),
                            this.$trigger.addClass("collapsed").attr("aria-expanded", !1),
                            (this.transitioning = 1);
                        var i = function () {
                            (this.transitioning = 0), this.$element.removeClass("collapsing").addClass("collapse").trigger("hidden.bs.collapse");
                        };
                        if (!a.support.transition) return i.call(this);
                        this.$element[e](0).one("bsTransitionEnd", a.proxy(i, this)).emulateTransitionEnd(r.TRANSITION_DURATION);
                    }
                }
            }),
            (r.prototype.toggle = function () {
                this[this.$element.hasClass("in") ? "hide" : "show"]();
            }),
            (r.prototype.getParent = function () {
                return a(this.options.parent)
                    .find('[data-toggle="collapse"][data-parent="' + this.options.parent + '"]')
                    .each(
                        a.proxy(function (t, e) {
                            var i = a(e);
                            this.addAriaAndCollapsedClass(n(i), i);
                        }, this)
                    )
                    .end();
            }),
            (r.prototype.addAriaAndCollapsedClass = function (t, e) {
                var i = t.hasClass("in");
                t.attr("aria-expanded", i), e.toggleClass("collapsed", !i).attr("aria-expanded", i);
            });
        var t = a.fn.collapse;
        (a.fn.collapse = l),
            (a.fn.collapse.Constructor = r),
            (a.fn.collapse.noConflict = function () {
                return (a.fn.collapse = t), this;
            }),
            a(document).on("click.bs.collapse.data-api", '[data-toggle="collapse"]', function (t) {
                var e = a(this);
                e.attr("data-target") || t.preventDefault();
                var i = n(e),
                    s = i.data("bs.collapse") ? "toggle" : e.data();
                l.call(i, s);
            });
    })(jQuery),
    (function (a) {
        "use strict";
        var r = '[data-toggle="dropdown"]',
            s = function (t) {
                a(t).on("click.bs.dropdown", this.toggle);
            };
        function l(t) {
            var e = t.attr("data-target");
            e || (e = (e = t.attr("href")) && /#[A-Za-z]/.test(e) && e.replace(/.*(?=#[^\s]*$)/, ""));
            var i = e && a(e);
            return i && i.length ? i : t.parent();
        }
        function o(s) {
            (s && 3 === s.which) ||
                (a(".dropdown-backdrop").remove(),
                a(r).each(function () {
                    var t = a(this),
                        e = l(t),
                        i = { relatedTarget: this };
                    e.hasClass("open") &&
                        ((s && "click" == s.type && /input|textarea/i.test(s.target.tagName) && a.contains(e[0], s.target)) ||
                            (e.trigger((s = a.Event("hide.bs.dropdown", i))), s.isDefaultPrevented() || (t.attr("aria-expanded", "false"), e.removeClass("open").trigger(a.Event("hidden.bs.dropdown", i)))));
                }));
        }
        (s.VERSION = "3.3.6"),
            (s.prototype.toggle = function (t) {
                var e = a(this);
                if (!e.is(".disabled, :disabled")) {
                    var i = l(e),
                        s = i.hasClass("open");
                    if ((o(), !s)) {
                        "ontouchstart" in document.documentElement && !i.closest(".navbar-nav").length && a(document.createElement("div")).addClass("dropdown-backdrop").insertAfter(a(this)).on("click", o);
                        var n = { relatedTarget: this };
                        if ((i.trigger((t = a.Event("show.bs.dropdown", n))), t.isDefaultPrevented())) return;
                        e.trigger("focus").attr("aria-expanded", "true"), i.toggleClass("open").trigger(a.Event("shown.bs.dropdown", n));
                    }
                    return !1;
                }
            }),
            (s.prototype.keydown = function (t) {
                if (/(38|40|27|32)/.test(t.which) && !/input|textarea/i.test(t.target.tagName)) {
                    var e = a(this);
                    if ((t.preventDefault(), t.stopPropagation(), !e.is(".disabled, :disabled"))) {
                        var i = l(e),
                            s = i.hasClass("open");
                        if ((!s && 27 != t.which) || (s && 27 == t.which)) return 27 == t.which && i.find(r).trigger("focus"), e.trigger("click");
                        var n = i.find(".dropdown-menu li:not(.disabled):visible a");
                        if (n.length) {
                            var o = n.index(t.target);
                            38 == t.which && 0 < o && o--, 40 == t.which && o < n.length - 1 && o++, ~o || (o = 0), n.eq(o).trigger("focus");
                        }
                    }
                }
            });
        var t = a.fn.dropdown;
        (a.fn.dropdown = function (i) {
            return this.each(function () {
                var t = a(this),
                    e = t.data("bs.dropdown");
                e || t.data("bs.dropdown", (e = new s(this))), "string" == typeof i && e[i].call(t);
            });
        }),
            (a.fn.dropdown.Constructor = s),
            (a.fn.dropdown.noConflict = function () {
                return (a.fn.dropdown = t), this;
            }),
            a(document)
                .on("click.bs.dropdown.data-api", o)
                .on("click.bs.dropdown.data-api", ".dropdown form", function (t) {
                    t.stopPropagation();
                })
                .on("click.bs.dropdown.data-api", r, s.prototype.toggle)
                .on("keydown.bs.dropdown.data-api", r, s.prototype.keydown)
                .on("keydown.bs.dropdown.data-api", ".dropdown-menu", s.prototype.keydown);
    })(jQuery),
    (function (o) {
        "use strict";
        var a = function (t, e) {
            (this.options = e),
                (this.$body = o(document.body)),
                (this.$element = o(t)),
                (this.$dialog = this.$element.find(".modal-dialog")),
                (this.$backdrop = null),
                (this.isShown = null),
                (this.originalBodyPad = null),
                (this.scrollbarWidth = 0),
                (this.ignoreBackdropClick = !1),
                this.options.remote &&
                    this.$element.find(".modal-content").load(
                        this.options.remote,
                        o.proxy(function () {
                            this.$element.trigger("loaded.bs.modal");
                        }, this)
                    );
        };
        function r(s, n) {
            return this.each(function () {
                var t = o(this),
                    e = t.data("bs.modal"),
                    i = o.extend({}, a.DEFAULTS, t.data(), "object" == typeof s && s);
                e || t.data("bs.modal", (e = new a(this, i))), "string" == typeof s ? e[s](n) : i.show && e.show(n);
            });
        }
        (a.VERSION = "3.3.6"),
            (a.TRANSITION_DURATION = 300),
            (a.BACKDROP_TRANSITION_DURATION = 150),
            (a.DEFAULTS = { backdrop: !0, keyboard: !0, show: !0 }),
            (a.prototype.toggle = function (t) {
                return this.isShown ? this.hide() : this.show(t);
            }),
            (a.prototype.show = function (i) {
                var s = this,
                    t = o.Event("show.bs.modal", { relatedTarget: i });
                this.$element.trigger(t),
                    this.isShown ||
                        t.isDefaultPrevented() ||
                        ((this.isShown = !0),
                        this.checkScrollbar(),
                        this.setScrollbar(),
                        this.$body.addClass("modal-open"),
                        this.escape(),
                        this.resize(),
                        this.$element.on("click.dismiss.bs.modal", '[data-dismiss="modal"]', o.proxy(this.hide, this)),
                        this.$dialog.on("mousedown.dismiss.bs.modal", function () {
                            s.$element.one("mouseup.dismiss.bs.modal", function (t) {
                                o(t.target).is(s.$element) && (s.ignoreBackdropClick = !0);
                            });
                        }),
                        this.backdrop(function () {
                            var t = o.support.transition && s.$element.hasClass("fade");
                            s.$element.parent().length || s.$element.appendTo(s.$body), s.$element.show().scrollTop(0), s.adjustDialog(), t && s.$element[0].offsetWidth, s.$element.addClass("in"), s.enforceFocus();
                            var e = o.Event("shown.bs.modal", { relatedTarget: i });
                            t
                                ? s.$dialog
                                      .one("bsTransitionEnd", function () {
                                          s.$element.trigger("focus").trigger(e);
                                      })
                                      .emulateTransitionEnd(a.TRANSITION_DURATION)
                                : s.$element.trigger("focus").trigger(e);
                        }));
            }),
            (a.prototype.hide = function (t) {
                t && t.preventDefault(),
                    (t = o.Event("hide.bs.modal")),
                    this.$element.trigger(t),
                    this.isShown &&
                        !t.isDefaultPrevented() &&
                        ((this.isShown = !1),
                        this.escape(),
                        this.resize(),
                        o(document).off("focusin.bs.modal"),
                        this.$element.removeClass("in").off("click.dismiss.bs.modal").off("mouseup.dismiss.bs.modal"),
                        this.$dialog.off("mousedown.dismiss.bs.modal"),
                        o.support.transition && this.$element.hasClass("fade") ? this.$element.one("bsTransitionEnd", o.proxy(this.hideModal, this)).emulateTransitionEnd(a.TRANSITION_DURATION) : this.hideModal());
            }),
            (a.prototype.enforceFocus = function () {
                o(document)
                    .off("focusin.bs.modal")
                    .on(
                        "focusin.bs.modal",
                        o.proxy(function (t) {
                            this.$element[0] === t.target || this.$element.has(t.target).length || this.$element.trigger("focus");
                        }, this)
                    );
            }),
            (a.prototype.escape = function () {
                this.isShown && this.options.keyboard
                    ? this.$element.on(
                          "keydown.dismiss.bs.modal",
                          o.proxy(function (t) {
                              27 == t.which && this.hide();
                          }, this)
                      )
                    : this.isShown || this.$element.off("keydown.dismiss.bs.modal");
            }),
            (a.prototype.resize = function () {
                this.isShown ? o(window).on("resize.bs.modal", o.proxy(this.handleUpdate, this)) : o(window).off("resize.bs.modal");
            }),
            (a.prototype.hideModal = function () {
                var t = this;
                this.$element.hide(),
                    this.backdrop(function () {
                        t.$body.removeClass("modal-open"), t.resetAdjustments(), t.resetScrollbar(), t.$element.trigger("hidden.bs.modal");
                    });
            }),
            (a.prototype.removeBackdrop = function () {
                this.$backdrop && this.$backdrop.remove(), (this.$backdrop = null);
            }),
            (a.prototype.backdrop = function (t) {
                var e = this,
                    i = this.$element.hasClass("fade") ? "fade" : "";
                if (this.isShown && this.options.backdrop) {
                    var s = o.support.transition && i;
                    if (
                        ((this.$backdrop = o(document.createElement("div"))
                            .addClass("modal-backdrop " + i)
                            .appendTo(this.$body)),
                        this.$element.on(
                            "click.dismiss.bs.modal",
                            o.proxy(function (t) {
                                this.ignoreBackdropClick ? (this.ignoreBackdropClick = !1) : t.target === t.currentTarget && ("static" == this.options.backdrop ? this.$element[0].focus() : this.hide());
                            }, this)
                        ),
                        s && this.$backdrop[0].offsetWidth,
                        this.$backdrop.addClass("in"),
                        !t)
                    )
                        return;
                    s ? this.$backdrop.one("bsTransitionEnd", t).emulateTransitionEnd(a.BACKDROP_TRANSITION_DURATION) : t();
                } else if (!this.isShown && this.$backdrop) {
                    this.$backdrop.removeClass("in");
                    var n = function () {
                        e.removeBackdrop(), t && t();
                    };
                    o.support.transition && this.$element.hasClass("fade") ? this.$backdrop.one("bsTransitionEnd", n).emulateTransitionEnd(a.BACKDROP_TRANSITION_DURATION) : n();
                } else t && t();
            }),
            (a.prototype.handleUpdate = function () {
                this.adjustDialog();
            }),
            (a.prototype.adjustDialog = function () {
                var t = this.$element[0].scrollHeight > document.documentElement.clientHeight;
                this.$element.css({ paddingLeft: !this.bodyIsOverflowing && t ? this.scrollbarWidth : "", paddingRight: this.bodyIsOverflowing && !t ? this.scrollbarWidth : "" });
            }),
            (a.prototype.resetAdjustments = function () {
                this.$element.css({ paddingLeft: "", paddingRight: "" });
            }),
            (a.prototype.checkScrollbar = function () {
                var t = window.innerWidth;
                if (!t) {
                    var e = document.documentElement.getBoundingClientRect();
                    t = e.right - Math.abs(e.left);
                }
                (this.bodyIsOverflowing = document.body.clientWidth < t), (this.scrollbarWidth = this.measureScrollbar());
            }),
            (a.prototype.setScrollbar = function () {
                var t = parseInt(this.$body.css("padding-right") || 0, 10);
                (this.originalBodyPad = document.body.style.paddingRight || ""), this.bodyIsOverflowing && (this.$body.css("padding-right", t + this.scrollbarWidth), o("#header-navbar").css("padding-right", t + this.scrollbarWidth));
            }),
            (a.prototype.resetScrollbar = function () {
                this.$body.css("padding-right", this.originalBodyPad), o("#header-navbar").css("padding-right", this.originalBodyPad);
            }),
            (a.prototype.measureScrollbar = function () {
                var t = document.createElement("div");
                (t.className = "modal-scrollbar-measure"), this.$body.append(t);
                var e = t.offsetWidth - t.clientWidth;
                return this.$body[0].removeChild(t), e;
            });
        var t = o.fn.modal;
        (o.fn.modal = r),
            (o.fn.modal.Constructor = a),
            (o.fn.modal.noConflict = function () {
                return (o.fn.modal = t), this;
            }),
            o(document).on("click.bs.modal.data-api", '[data-toggle="modal"]', function (t) {
                var e = o(this),
                    i = e.attr("href"),
                    s = o(e.attr("data-target") || (i && i.replace(/.*(?=#[^\s]+$)/, ""))),
                    n = s.data("bs.modal") ? "toggle" : o.extend({ remote: !/#/.test(i) && i }, s.data(), e.data());
                e.is("a") && t.preventDefault(),
                    s.one("show.bs.modal", function (t) {
                        t.isDefaultPrevented() ||
                            s.one("hidden.bs.modal", function () {
                                e.is(":visible") && e.trigger("focus");
                            });
                    }),
                    r.call(s, n, this);
            });
    })(jQuery),
    (function (v) {
        "use strict";
        var g = function (t, e) {
            (this.type = null), (this.options = null), (this.enabled = null), (this.timeout = null), (this.hoverState = null), (this.$element = null), (this.inState = null), this.init("tooltip", t, e);
        };
        (g.VERSION = "3.3.6"),
            (g.TRANSITION_DURATION = 150),
            (g.DEFAULTS = {
                animation: !0,
                placement: "top",
                selector: !1,
                template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
                trigger: "hover focus",
                title: "",
                delay: 0,
                html: !1,
                container: !1,
                viewport: { selector: "body", padding: 0 },
            }),
            (g.prototype.init = function (t, e, i) {
                if (
                    ((this.enabled = !0),
                    (this.type = t),
                    (this.$element = v(e)),
                    (this.options = this.getOptions(i)),
                    (this.$viewport = this.options.viewport && v(v.isFunction(this.options.viewport) ? this.options.viewport.call(this, this.$element) : this.options.viewport.selector || this.options.viewport)),
                    (this.inState = { click: !1, hover: !1, focus: !1 }),
                    this.$element[0] instanceof document.constructor && !this.options.selector)
                )
                    throw new Error("`selector` option must be specified when initializing " + this.type + " on the window.document object!");
                for (var s = this.options.trigger.split(" "), n = s.length; n--; ) {
                    var o = s[n];
                    if ("click" == o) this.$element.on("click." + this.type, this.options.selector, v.proxy(this.toggle, this));
                    else if ("manual" != o) {
                        var a = "hover" == o ? "mouseenter" : "focusin",
                            r = "hover" == o ? "mouseleave" : "focusout";
                        this.$element.on(a + "." + this.type, this.options.selector, v.proxy(this.enter, this)), this.$element.on(r + "." + this.type, this.options.selector, v.proxy(this.leave, this));
                    }
                }
                this.options.selector ? (this._options = v.extend({}, this.options, { trigger: "manual", selector: "" })) : this.fixTitle();
            }),
            (g.prototype.getDefaults = function () {
                return g.DEFAULTS;
            }),
            (g.prototype.getOptions = function (t) {
                return (t = v.extend({}, this.getDefaults(), this.$element.data(), t)).delay && "number" == typeof t.delay && (t.delay = { show: t.delay, hide: t.delay }), t;
            }),
            (g.prototype.getDelegateOptions = function () {
                var i = {},
                    s = this.getDefaults();
                return (
                    this._options &&
                        v.each(this._options, function (t, e) {
                            s[t] != e && (i[t] = e);
                        }),
                    i
                );
            }),
            (g.prototype.enter = function (t) {
                var e = t instanceof this.constructor ? t : v(t.currentTarget).data("bs." + this.type);
                if (
                    (e || ((e = new this.constructor(t.currentTarget, this.getDelegateOptions())), v(t.currentTarget).data("bs." + this.type, e)),
                    t instanceof v.Event && (e.inState["focusin" == t.type ? "focus" : "hover"] = !0),
                    e.tip().hasClass("in") || "in" == e.hoverState)
                )
                    e.hoverState = "in";
                else {
                    if ((clearTimeout(e.timeout), (e.hoverState = "in"), !e.options.delay || !e.options.delay.show)) return e.show();
                    e.timeout = setTimeout(function () {
                        "in" == e.hoverState && e.show();
                    }, e.options.delay.show);
                }
            }),
            (g.prototype.isInStateTrue = function () {
                for (var t in this.inState) if (this.inState[t]) return !0;
                return !1;
            }),
            (g.prototype.leave = function (t) {
                var e = t instanceof this.constructor ? t : v(t.currentTarget).data("bs." + this.type);
                if (
                    (e || ((e = new this.constructor(t.currentTarget, this.getDelegateOptions())), v(t.currentTarget).data("bs." + this.type, e)),
                    t instanceof v.Event && (e.inState["focusout" == t.type ? "focus" : "hover"] = !1),
                    !e.isInStateTrue())
                ) {
                    if ((clearTimeout(e.timeout), (e.hoverState = "out"), !e.options.delay || !e.options.delay.hide)) return e.hide();
                    e.timeout = setTimeout(function () {
                        "out" == e.hoverState && e.hide();
                    }, e.options.delay.hide);
                }
            }),
            (g.prototype.show = function () {
                var t = v.Event("show.bs." + this.type);
                if (this.hasContent() && this.enabled) {
                    this.$element.trigger(t);
                    var e = v.contains(this.$element[0].ownerDocument.documentElement, this.$element[0]);
                    if (t.isDefaultPrevented() || !e) return;
                    var i = this,
                        s = this.tip(),
                        n = this.getUID(this.type);
                    this.setContent(), s.attr("id", n), this.$element.attr("aria-describedby", n), this.options.animation && s.addClass("fade");
                    var o = "function" == typeof this.options.placement ? this.options.placement.call(this, s[0], this.$element[0]) : this.options.placement,
                        a = /\s?auto?\s?/i,
                        r = a.test(o);
                    r && (o = o.replace(a, "") || "top"),
                        s
                            .detach()
                            .css({ top: 0, left: 0, display: "block" })
                            .addClass(o)
                            .data("bs." + this.type, this),
                        this.options.container ? s.appendTo(this.options.container) : s.insertAfter(this.$element),
                        this.$element.trigger("inserted.bs." + this.type);
                    var l = this.getPosition(),
                        d = s[0].offsetWidth,
                        c = s[0].offsetHeight;
                    if (r) {
                        var u = o,
                            p = this.getPosition(this.$viewport);
                        (o = "bottom" == o && l.bottom + c > p.bottom ? "top" : "top" == o && l.top - c < p.top ? "bottom" : "right" == o && l.right + d > p.width ? "left" : "left" == o && l.left - d < p.left ? "right" : o),
                            s.removeClass(u).addClass(o);
                    }
                    var h = this.getCalculatedOffset(o, l, d, c);
                    this.applyPlacement(h, o);
                    var f = function () {
                        var t = i.hoverState;
                        i.$element.trigger("shown.bs." + i.type), (i.hoverState = null), "out" == t && i.leave(i);
                    };
                    v.support.transition && this.$tip.hasClass("fade") ? s.one("bsTransitionEnd", f).emulateTransitionEnd(g.TRANSITION_DURATION) : f();
                }
            }),
            (g.prototype.applyPlacement = function (t, e) {
                var i = this.tip(),
                    s = i[0].offsetWidth,
                    n = i[0].offsetHeight,
                    o = parseInt(i.css("margin-top"), 10),
                    a = parseInt(i.css("margin-left"), 10);
                isNaN(o) && (o = 0),
                    isNaN(a) && (a = 0),
                    (t.top += o),
                    (t.left += a),
                    v.offset.setOffset(
                        i[0],
                        v.extend(
                            {
                                using: function (t) {
                                    i.css({ top: Math.round(t.top), left: Math.round(t.left) });
                                },
                            },
                            t
                        ),
                        0
                    ),
                    i.addClass("in");
                var r = i[0].offsetWidth,
                    l = i[0].offsetHeight;
                "top" == e && l != n && (t.top = t.top + n - l);
                var d = this.getViewportAdjustedDelta(e, t, r, l);
                d.left ? (t.left += d.left) : (t.top += d.top);
                var c = /top|bottom/.test(e),
                    u = c ? 2 * d.left - s + r : 2 * d.top - n + l,
                    p = c ? "offsetWidth" : "offsetHeight";
                i.offset(t), this.replaceArrow(u, i[0][p], c);
            }),
            (g.prototype.replaceArrow = function (t, e, i) {
                this.arrow()
                    .css(i ? "left" : "top", 50 * (1 - t / e) + "%")
                    .css(i ? "top" : "left", "");
            }),
            (g.prototype.setContent = function () {
                var t = this.tip(),
                    e = this.getTitle();
                t.find(".tooltip-inner")[this.options.html ? "html" : "text"](e), t.removeClass("fade in top bottom left right");
            }),
            (g.prototype.hide = function (t) {
                var e = this,
                    i = v(this.$tip),
                    s = v.Event("hide.bs." + this.type);
                function n() {
                    "in" != e.hoverState && i.detach(), e.$element.removeAttr("aria-describedby").trigger("hidden.bs." + e.type), t && t();
                }
                if ((this.$element.trigger(s), !s.isDefaultPrevented()))
                    return i.removeClass("in"), v.support.transition && i.hasClass("fade") ? i.one("bsTransitionEnd", n).emulateTransitionEnd(g.TRANSITION_DURATION) : n(), (this.hoverState = null), this;
            }),
            (g.prototype.fixTitle = function () {
                var t = this.$element;
                (t.attr("title") || "string" != typeof t.attr("data-original-title")) && t.attr("data-original-title", t.attr("title") || "").attr("title", "");
            }),
            (g.prototype.hasContent = function () {
                return this.getTitle();
            }),
            (g.prototype.getPosition = function (t) {
                var e = (t = t || this.$element)[0],
                    i = "BODY" == e.tagName,
                    s = e.getBoundingClientRect();
                null == s.width && (s = v.extend({}, s, { width: s.right - s.left, height: s.bottom - s.top }));
                var n = i ? { top: 0, left: 0 } : t.offset(),
                    o = { scroll: i ? document.documentElement.scrollTop || document.body.scrollTop : t.scrollTop() },
                    a = i ? { width: v(window).width(), height: v(window).height() } : null;
                return v.extend({}, s, o, a, n);
            }),
            (g.prototype.getCalculatedOffset = function (t, e, i, s) {
                return "bottom" == t
                    ? { top: e.top + e.height, left: e.left + e.width / 2 - i / 2 }
                    : "top" == t
                    ? { top: e.top - s, left: e.left + e.width / 2 - i / 2 }
                    : "left" == t
                    ? { top: e.top + e.height / 2 - s / 2, left: e.left - i }
                    : { top: e.top + e.height / 2 - s / 2, left: e.left + e.width };
            }),
            (g.prototype.getViewportAdjustedDelta = function (t, e, i, s) {
                var n = { top: 0, left: 0 };
                if (!this.$viewport) return n;
                var o = (this.options.viewport && this.options.viewport.padding) || 0,
                    a = this.getPosition(this.$viewport);
                if (/right|left/.test(t)) {
                    var r = e.top - o - a.scroll,
                        l = e.top + o - a.scroll + s;
                    r < a.top ? (n.top = a.top - r) : l > a.top + a.height && (n.top = a.top + a.height - l);
                } else {
                    var d = e.left - o,
                        c = e.left + o + i;
                    d < a.left ? (n.left = a.left - d) : c > a.right && (n.left = a.left + a.width - c);
                }
                return n;
            }),
            (g.prototype.getTitle = function () {
                var t = this.$element,
                    e = this.options;
                return t.attr("data-original-title") || ("function" == typeof e.title ? e.title.call(t[0]) : e.title);
            }),
            (g.prototype.getUID = function (t) {
                for (; (t += ~~(1e6 * Math.random())), document.getElementById(t); );
                return t;
            }),
            (g.prototype.tip = function () {
                if (!this.$tip && ((this.$tip = v(this.options.template)), 1 != this.$tip.length)) throw new Error(this.type + " `template` option must consist of exactly 1 top-level element!");
                return this.$tip;
            }),
            (g.prototype.arrow = function () {
                return (this.$arrow = this.$arrow || this.tip().find(".tooltip-arrow"));
            }),
            (g.prototype.enable = function () {
                this.enabled = !0;
            }),
            (g.prototype.disable = function () {
                this.enabled = !1;
            }),
            (g.prototype.toggleEnabled = function () {
                this.enabled = !this.enabled;
            }),
            (g.prototype.toggle = function (t) {
                var e = this;
                t && ((e = v(t.currentTarget).data("bs." + this.type)) || ((e = new this.constructor(t.currentTarget, this.getDelegateOptions())), v(t.currentTarget).data("bs." + this.type, e))),
                    t ? ((e.inState.click = !e.inState.click), e.isInStateTrue() ? e.enter(e) : e.leave(e)) : e.tip().hasClass("in") ? e.leave(e) : e.enter(e);
            }),
            (g.prototype.destroy = function () {
                var t = this;
                clearTimeout(this.timeout),
                    this.hide(function () {
                        t.$element.off("." + t.type).removeData("bs." + t.type), t.$tip && t.$tip.detach(), (t.$tip = null), (t.$arrow = null), (t.$viewport = null);
                    });
            });
        var t = v.fn.tooltip;
        (v.fn.tooltip = function (s) {
            return this.each(function () {
                var t = v(this),
                    e = t.data("bs.tooltip"),
                    i = "object" == typeof s && s;
                (!e && /destroy|hide/.test(s)) || (e || t.data("bs.tooltip", (e = new g(this, i))), "string" == typeof s && e[s]());
            });
        }),
            (v.fn.tooltip.Constructor = g),
            (v.fn.tooltip.noConflict = function () {
                return (v.fn.tooltip = t), this;
            });
    })(jQuery),
    (function (n) {
        "use strict";
        var o = function (t, e) {
            this.init("popover", t, e);
        };
        if (!n.fn.tooltip) throw new Error("Popover requires tooltip.js");
        (o.VERSION = "3.3.6"),
            (o.DEFAULTS = n.extend({}, n.fn.tooltip.Constructor.DEFAULTS, {
                placement: "right",
                trigger: "click",
                content: "",
                template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>',
            })),
            (((o.prototype = n.extend({}, n.fn.tooltip.Constructor.prototype)).constructor = o).prototype.getDefaults = function () {
                return o.DEFAULTS;
            }),
            (o.prototype.setContent = function () {
                var t = this.tip(),
                    e = this.getTitle(),
                    i = this.getContent();
                t.find(".popover-title")[this.options.html ? "html" : "text"](e),
                    t.find(".popover-content").children().detach().end()[this.options.html ? ("string" == typeof i ? "html" : "append") : "text"](i),
                    t.removeClass("fade top bottom left right in"),
                    t.find(".popover-title").html() || t.find(".popover-title").hide();
            }),
            (o.prototype.hasContent = function () {
                return this.getTitle() || this.getContent();
            }),
            (o.prototype.getContent = function () {
                var t = this.$element,
                    e = this.options;
                return t.attr("data-content") || ("function" == typeof e.content ? e.content.call(t[0]) : e.content);
            }),
            (o.prototype.arrow = function () {
                return (this.$arrow = this.$arrow || this.tip().find(".arrow"));
            });
        var t = n.fn.popover;
        (n.fn.popover = function (s) {
            return this.each(function () {
                var t = n(this),
                    e = t.data("bs.popover"),
                    i = "object" == typeof s && s;
                (!e && /destroy|hide/.test(s)) || (e || t.data("bs.popover", (e = new o(this, i))), "string" == typeof s && e[s]());
            });
        }),
            (n.fn.popover.Constructor = o),
            (n.fn.popover.noConflict = function () {
                return (n.fn.popover = t), this;
            });
    })(jQuery),
    (function (o) {
        "use strict";
        function n(t, e) {
            (this.$body = o(document.body)),
                (this.$scrollElement = o(t).is(document.body) ? o(window) : o(t)),
                (this.options = o.extend({}, n.DEFAULTS, e)),
                (this.selector = (this.options.target || "") + " .nav li > a"),
                (this.offsets = []),
                (this.targets = []),
                (this.activeTarget = null),
                (this.scrollHeight = 0),
                this.$scrollElement.on("scroll.bs.scrollspy", o.proxy(this.process, this)),
                this.refresh(),
                this.process();
        }
        function e(s) {
            return this.each(function () {
                var t = o(this),
                    e = t.data("bs.scrollspy"),
                    i = "object" == typeof s && s;
                e || t.data("bs.scrollspy", (e = new n(this, i))), "string" == typeof s && e[s]();
            });
        }
        (n.VERSION = "3.3.6"),
            (n.DEFAULTS = { offset: 10 }),
            (n.prototype.getScrollHeight = function () {
                return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight);
            }),
            (n.prototype.refresh = function () {
                var t = this,
                    s = "offset",
                    n = 0;
                (this.offsets = []),
                    (this.targets = []),
                    (this.scrollHeight = this.getScrollHeight()),
                    o.isWindow(this.$scrollElement[0]) || ((s = "position"), (n = this.$scrollElement.scrollTop())),
                    this.$body
                        .find(this.selector)
                        .map(function () {
                            var t = o(this),
                                e = t.data("target") || t.attr("href"),
                                i = /^#./.test(e) && o(e);
                            return (i && i.length && i.is(":visible") && [[i[s]().top + n, e]]) || null;
                        })
                        .sort(function (t, e) {
                            return t[0] - e[0];
                        })
                        .each(function () {
                            t.offsets.push(this[0]), t.targets.push(this[1]);
                        });
            }),
            (n.prototype.process = function () {
                var t,
                    e = this.$scrollElement.scrollTop() + this.options.offset,
                    i = this.getScrollHeight(),
                    s = this.options.offset + i - this.$scrollElement.height(),
                    n = this.offsets,
                    o = this.targets,
                    a = this.activeTarget;
                if ((this.scrollHeight != i && this.refresh(), s <= e)) return a != (t = o[o.length - 1]) && this.activate(t);
                if (a && e < n[0]) return (this.activeTarget = null), this.clear();
                for (t = n.length; t--; ) a != o[t] && e >= n[t] && (void 0 === n[t + 1] || e < n[t + 1]) && this.activate(o[t]);
            }),
            (n.prototype.activate = function (t) {
                (this.activeTarget = t), this.clear();
                var e = this.selector + '[data-target="' + t + '"],' + this.selector + '[href="' + t + '"]',
                    i = o(e).parents("li").addClass("active");
                i.parent(".dropdown-menu").length && (i = i.closest("li.dropdown").addClass("active")), i.trigger("activate.bs.scrollspy");
            }),
            (n.prototype.clear = function () {
                o(this.selector).parentsUntil(this.options.target, ".active").removeClass("active");
            });
        var t = o.fn.scrollspy;
        (o.fn.scrollspy = e),
            (o.fn.scrollspy.Constructor = n),
            (o.fn.scrollspy.noConflict = function () {
                return (o.fn.scrollspy = t), this;
            }),
            o(window).on("load.bs.scrollspy.data-api", function () {
                o('[data-spy="scroll"]').each(function () {
                    var t = o(this);
                    e.call(t, t.data());
                });
            });
    })(jQuery),
    (function (r) {
        "use strict";
        var a = function (t) {
            this.element = r(t);
        };
        function e(i) {
            return this.each(function () {
                var t = r(this),
                    e = t.data("bs.tab");
                e || t.data("bs.tab", (e = new a(this))), "string" == typeof i && e[i]();
            });
        }
        (a.VERSION = "3.3.6"),
            (a.TRANSITION_DURATION = 150),
            (a.prototype.show = function () {
                var t = this.element,
                    e = t.closest("ul:not(.dropdown-menu)"),
                    i = t.data("target");
                if ((i || (i = (i = t.attr("href")) && i.replace(/.*(?=#[^\s]*$)/, "")), !t.parent("li").hasClass("active"))) {
                    var s = e.find(".active:last a"),
                        n = r.Event("hide.bs.tab", { relatedTarget: t[0] }),
                        o = r.Event("show.bs.tab", { relatedTarget: s[0] });
                    if ((s.trigger(n), t.trigger(o), !o.isDefaultPrevented() && !n.isDefaultPrevented())) {
                        var a = r(i);
                        this.activate(t.closest("li"), e),
                            this.activate(a, a.parent(), function () {
                                s.trigger({ type: "hidden.bs.tab", relatedTarget: t[0] }), t.trigger({ type: "shown.bs.tab", relatedTarget: s[0] });
                            });
                    }
                }
            }),
            (a.prototype.activate = function (t, e, i) {
                var s = e.find("> .active"),
                    n = i && r.support.transition && ((s.length && s.hasClass("fade")) || !!e.find("> .fade").length);
                function o() {
                    s.removeClass("active").find("> .dropdown-menu > .active").removeClass("active").end().find('[data-toggle="tab"]').attr("aria-expanded", !1),
                        t.addClass("active").find('[data-toggle="tab"]').attr("aria-expanded", !0),
                        n ? (t[0].offsetWidth, t.addClass("in")) : t.removeClass("fade"),
                        t.parent(".dropdown-menu").length && t.closest("li.dropdown").addClass("active").end().find('[data-toggle="tab"]').attr("aria-expanded", !0),
                        i && i();
                }
                s.length && n ? s.one("bsTransitionEnd", o).emulateTransitionEnd(a.TRANSITION_DURATION) : o(), s.removeClass("in");
            });
        var t = r.fn.tab;
        (r.fn.tab = e),
            (r.fn.tab.Constructor = a),
            (r.fn.tab.noConflict = function () {
                return (r.fn.tab = t), this;
            });
        var i = function (t) {
            t.preventDefault(), e.call(r(this), "show");
        };
        r(document).on("click.bs.tab.data-api", '[data-toggle="tab"]', i).on("click.bs.tab.data-api", '[data-toggle="pill"]', i);
    })(jQuery),
    (function (l) {
        "use strict";
        var d = function (t, e) {
            (this.options = l.extend({}, d.DEFAULTS, e)),
                (this.$target = l(this.options.target).on("scroll.bs.affix.data-api", l.proxy(this.checkPosition, this)).on("click.bs.affix.data-api", l.proxy(this.checkPositionWithEventLoop, this))),
                (this.$element = l(t)),
                (this.affixed = null),
                (this.unpin = null),
                (this.pinnedOffset = null),
                this.checkPosition();
        };
        function i(s) {
            return this.each(function () {
                var t = l(this),
                    e = t.data("bs.affix"),
                    i = "object" == typeof s && s;
                e || t.data("bs.affix", (e = new d(this, i))), "string" == typeof s && e[s]();
            });
        }
        (d.VERSION = "3.3.6"),
            (d.RESET = "affix affix-top affix-bottom"),
            (d.DEFAULTS = { offset: 0, target: window }),
            (d.prototype.getState = function (t, e, i, s) {
                var n = this.$target.scrollTop(),
                    o = this.$element.offset(),
                    a = this.$target.height();
                if (null != i && "top" == this.affixed) return n < i && "top";
                if ("bottom" == this.affixed) return null != i ? !(n + this.unpin <= o.top) && "bottom" : !(n + a <= t - s) && "bottom";
                var r = null == this.affixed,
                    l = r ? n : o.top;
                return null != i && n <= i ? "top" : null != s && t - s <= l + (r ? a : e) && "bottom";
            }),
            (d.prototype.getPinnedOffset = function () {
                if (this.pinnedOffset) return this.pinnedOffset;
                this.$element.removeClass(d.RESET).addClass("affix");
                var t = this.$target.scrollTop(),
                    e = this.$element.offset();
                return (this.pinnedOffset = e.top - t);
            }),
            (d.prototype.checkPositionWithEventLoop = function () {
                setTimeout(l.proxy(this.checkPosition, this), 1);
            }),
            (d.prototype.checkPosition = function () {
                if (this.$element.is(":visible")) {
                    var t = this.$element.height(),
                        e = this.options.offset,
                        i = e.top,
                        s = e.bottom,
                        n = Math.max(l(document).height(), l(document.body).height());
                    "object" != typeof e && (s = i = e), "function" == typeof i && (i = e.top(this.$element)), "function" == typeof s && (s = e.bottom(this.$element));
                    var o = this.getState(n, t, i, s);
                    if (this.affixed != o) {
                        null != this.unpin && this.$element.css("top", "");
                        var a = "affix" + (o ? "-" + o : ""),
                            r = l.Event(a + ".bs.affix");
                        if ((this.$element.trigger(r), r.isDefaultPrevented())) return;
                        (this.affixed = o),
                            (this.unpin = "bottom" == o ? this.getPinnedOffset() : null),
                            this.$element
                                .removeClass(d.RESET)
                                .addClass(a)
                                .trigger(a.replace("affix", "affixed") + ".bs.affix");
                    }
                    "bottom" == o && this.$element.offset({ top: n - t - s });
                }
            });
        var t = l.fn.affix;
        (l.fn.affix = i),
            (l.fn.affix.Constructor = d),
            (l.fn.affix.noConflict = function () {
                return (l.fn.affix = t), this;
            }),
            l(window).on("load", function () {
                l('[data-spy="affix"]').each(function () {
                    var t = l(this),
                        e = t.data();
                    (e.offset = e.offset || {}), null != e.offsetBottom && (e.offset.bottom = e.offsetBottom), null != e.offsetTop && (e.offset.top = e.offsetTop), i.call(t, e);
                });
            });
    })(jQuery),
    (function (H) {
        var Z = {
            mode: "horizontal",
            slideSelector: "",
            infiniteLoop: !0,
            hideControlOnEnd: !1,
            speed: 500,
            easing: null,
            slideMargin: 0,
            startSlide: 0,
            randomStart: !1,
            captions: !1,
            ticker: !1,
            tickerHover: !1,
            adaptiveHeight: !1,
            adaptiveHeightSpeed: 500,
            video: !1,
            useCSS: !0,
            preloadImages: "visible",
            responsive: !0,
            slideZIndex: 50,
            wrapperClass: "bx-wrapper",
            touchEnabled: !0,
            swipeThreshold: 50,
            oneToOneTouch: !0,
            preventDefaultSwipeX: !0,
            preventDefaultSwipeY: !1,
            ariaLive: !0,
            ariaHidden: !0,
            keyboardEnabled: !1,
            pager: !0,
            pagerType: "full",
            pagerShortSeparator: " / ",
            pagerSelector: null,
            buildPager: null,
            pagerCustom: null,
            controls: !0,
            nextText: "Next",
            prevText: "Prev",
            nextSelector: null,
            prevSelector: null,
            autoControls: !1,
            startText: "Start",
            stopText: "Stop",
            autoControlsCombine: !1,
            autoControlsSelector: null,
            auto: !1,
            pause: 4e3,
            autoStart: !0,
            autoDirection: "next",
            stopAutoOnClick: !1,
            autoHover: !1,
            autoDelay: 0,
            autoSlideForOnePage: !1,
            minSlides: 1,
            maxSlides: 1,
            moveSlides: 0,
            slideWidth: 0,
            shrinkItems: !1,
            onSliderLoad: function () {
                return !0;
            },
            onSlideBefore: function () {
                return !0;
            },
            onSlideAfter: function () {
                return !0;
            },
            onSlideNext: function () {
                return !0;
            },
            onSlidePrev: function () {
                return !0;
            },
            onSliderResize: function () {
                return !0;
            },
            onAutoChange: function () {
                return !0;
            },
        };
        H.fn.bxSlider = function (e) {
            if (0 === this.length) return this;
            if (1 < this.length)
                return (
                    this.each(function () {
                        H(this).bxSlider(e);
                    }),
                    this
                );
            var u = {},
                p = this,
                s = H(window).width(),
                n = H(window).height();
            if (!H(p).data("bxSlider")) {
                var o = function () {
                        H(p).data("bxSlider") ||
                            ((u.settings = H.extend({}, Z, e)),
                            (u.settings.slideWidth = parseInt(u.settings.slideWidth)),
                            (u.children = p.children(u.settings.slideSelector)),
                            u.children.length < u.settings.minSlides && (u.settings.minSlides = u.children.length),
                            u.children.length < u.settings.maxSlides && (u.settings.maxSlides = u.children.length),
                            u.settings.randomStart && (u.settings.startSlide = Math.floor(Math.random() * u.children.length)),
                            (u.active = { index: u.settings.startSlide }),
                            (u.carousel = 1 < u.settings.minSlides || 1 < u.settings.maxSlides),
                            u.carousel && (u.settings.preloadImages = "all"),
                            (u.minThreshold = u.settings.minSlides * u.settings.slideWidth + (u.settings.minSlides - 1) * u.settings.slideMargin),
                            (u.maxThreshold = u.settings.maxSlides * u.settings.slideWidth + (u.settings.maxSlides - 1) * u.settings.slideMargin),
                            (u.working = !1),
                            (u.controls = {}),
                            (u.interval = null),
                            (u.animProp = "vertical" === u.settings.mode ? "top" : "left"),
                            (u.usingCSS =
                                u.settings.useCSS &&
                                "fade" !== u.settings.mode &&
                                (function () {
                                    for (var t = document.createElement("div"), e = ["WebkitPerspective", "MozPerspective", "OPerspective", "msPerspective"], i = 0; i < e.length; i++)
                                        if (void 0 !== t.style[e[i]]) return (u.cssPrefix = e[i].replace("Perspective", "").toLowerCase()), (u.animProp = "-" + u.cssPrefix + "-transform"), !0;
                                    return !1;
                                })()),
                            "vertical" === u.settings.mode && (u.settings.maxSlides = u.settings.minSlides),
                            p.data("origStyle", p.attr("style")),
                            p.children(u.settings.slideSelector).each(function () {
                                H(this).data("origStyle", H(this).attr("style"));
                            }),
                            t());
                    },
                    t = function () {
                        var t = u.children.eq(u.settings.startSlide);
                        p.wrap('<div class="' + u.settings.wrapperClass + '"><div class="bx-viewport"></div></div>'),
                            (u.viewport = p.parent()),
                            u.settings.ariaLive && !u.settings.ticker && u.viewport.attr("aria-live", "polite"),
                            (u.loader = H('<div class="bx-loading" />')),
                            u.viewport.prepend(u.loader),
                            p.css({ width: "horizontal" === u.settings.mode ? 1e3 * u.children.length + 215 + "%" : "auto", position: "relative" }),
                            u.usingCSS && u.settings.easing ? p.css("-" + u.cssPrefix + "-transition-timing-function", u.settings.easing) : u.settings.easing || (u.settings.easing = "swing"),
                            u.viewport.css({ width: "100%", overflow: "hidden", position: "relative" }),
                            u.viewport.parent().css({ maxWidth: l() }),
                            u.children.css({ float: "horizontal" === u.settings.mode ? "left" : "none", listStyle: "none", position: "relative" }),
                            u.children.css("width", d()),
                            "horizontal" === u.settings.mode && 0 < u.settings.slideMargin && u.children.css("marginRight", u.settings.slideMargin),
                            "vertical" === u.settings.mode && 0 < u.settings.slideMargin && u.children.css("marginBottom", u.settings.slideMargin),
                            "fade" === u.settings.mode && (u.children.css({ position: "absolute", zIndex: 0, display: "none" }), u.children.eq(u.settings.startSlide).css({ zIndex: u.settings.slideZIndex, display: "block" })),
                            (u.controls.el = H('<div class="bx-controls" />')),
                            u.settings.captions && $(),
                            (u.active.last = u.settings.startSlide === f() - 1),
                            u.settings.video && p.fitVids(),
                            "none" === u.settings.preloadImages ? (t = null) : ("all" === u.settings.preloadImages || u.settings.ticker) && (t = u.children),
                            u.settings.ticker
                                ? (u.settings.pager = !1)
                                : (u.settings.controls && x(),
                                  u.settings.auto && u.settings.autoControls && y(),
                                  u.settings.pager && _(),
                                  (u.settings.controls || u.settings.autoControls || u.settings.pager) && u.viewport.after(u.controls.el)),
                            null === t ? r() : a(t, r);
                    },
                    a = function (t, e) {
                        var i = t.find('img:not([src=""]), iframe').length,
                            s = 0;
                        0 !== i
                            ? t.find('img:not([src=""]), iframe').each(function () {
                                  H(this)
                                      .one("load error", function () {
                                          ++s === i && e();
                                      })
                                      .each(function () {
                                          (this.complete || "" == this.src) && H(this).trigger("load");
                                      });
                              })
                            : e();
                    },
                    r = function () {
                        if (u.settings.infiniteLoop && "fade" !== u.settings.mode && !u.settings.ticker) {
                            var t = "vertical" === u.settings.mode ? u.settings.minSlides : u.settings.maxSlides,
                                e = u.children.slice(0, t).clone(!0).addClass("bx-clone"),
                                i = u.children.slice(-t).clone(!0).addClass("bx-clone");
                            u.settings.ariaHidden && (e.attr("aria-hidden", !0), i.attr("aria-hidden", !0)), p.append(e).prepend(i);
                        }
                        u.loader.remove(),
                            g(),
                            "vertical" === u.settings.mode && (u.settings.adaptiveHeight = !0),
                            u.viewport.height(h()),
                            p.redrawSlider(),
                            u.settings.onSliderLoad.call(p, u.active.index),
                            (u.initialized = !0),
                            u.settings.responsive && H(window).on("resize", U),
                            u.settings.auto && u.settings.autoStart && (1 < f() || u.settings.autoSlideForOnePage) && P(),
                            u.settings.ticker && N(),
                            u.settings.pager && q(u.settings.startSlide),
                            u.settings.controls && A(),
                            u.settings.touchEnabled && !u.settings.ticker && M(),
                            u.settings.keyboardEnabled && !u.settings.ticker && H(document).keydown(O);
                    },
                    h = function () {
                        var e = 0,
                            t = H();
                        if ("vertical" === u.settings.mode || u.settings.adaptiveHeight)
                            if (u.carousel) {
                                var s = 1 === u.settings.moveSlides ? u.active.index : u.active.index * v();
                                for (t = u.children.eq(s), i = 1; i <= u.settings.maxSlides - 1; i++) t = s + i >= u.children.length ? t.add(u.children.eq(i - 1)) : t.add(u.children.eq(s + i));
                            } else t = u.children.eq(u.active.index);
                        else t = u.children;
                        return (
                            "vertical" === u.settings.mode
                                ? (t.each(function (t) {
                                      e += H(this).outerHeight();
                                  }),
                                  0 < u.settings.slideMargin && (e += u.settings.slideMargin * (u.settings.minSlides - 1)))
                                : (e = Math.max.apply(
                                      Math,
                                      t
                                          .map(function () {
                                              return H(this).outerHeight(!1);
                                          })
                                          .get()
                                  )),
                            "border-box" === u.viewport.css("box-sizing")
                                ? (e += parseFloat(u.viewport.css("padding-top")) + parseFloat(u.viewport.css("padding-bottom")) + parseFloat(u.viewport.css("border-top-width")) + parseFloat(u.viewport.css("border-bottom-width")))
                                : "padding-box" === u.viewport.css("box-sizing") && (e += parseFloat(u.viewport.css("padding-top")) + parseFloat(u.viewport.css("padding-bottom"))),
                            e
                        );
                    },
                    l = function () {
                        var t = "100%";
                        return 0 < u.settings.slideWidth && (t = "horizontal" === u.settings.mode ? u.settings.maxSlides * u.settings.slideWidth + (u.settings.maxSlides - 1) * u.settings.slideMargin : u.settings.slideWidth), t;
                    },
                    d = function () {
                        var t = u.settings.slideWidth,
                            e = u.viewport.width();
                        if (0 === u.settings.slideWidth || (u.settings.slideWidth > e && !u.carousel) || "vertical" === u.settings.mode) t = e;
                        else if (1 < u.settings.maxSlides && "horizontal" === u.settings.mode) {
                            if (e > u.maxThreshold) return t;
                            e < u.minThreshold
                                ? (t = (e - u.settings.slideMargin * (u.settings.minSlides - 1)) / u.settings.minSlides)
                                : u.settings.shrinkItems && (t = Math.floor((e + u.settings.slideMargin) / Math.ceil((e + u.settings.slideMargin) / (t + u.settings.slideMargin)) - u.settings.slideMargin));
                        }
                        return t;
                    },
                    c = function () {
                        var t = 1,
                            e = null;
                        return (
                            "horizontal" === u.settings.mode && 0 < u.settings.slideWidth
                                ? (t =
                                      u.viewport.width() < u.minThreshold
                                          ? u.settings.minSlides
                                          : u.viewport.width() > u.maxThreshold
                                          ? u.settings.maxSlides
                                          : ((e = u.children.first().width() + u.settings.slideMargin), Math.floor((u.viewport.width() + u.settings.slideMargin) / e) || 1))
                                : "vertical" === u.settings.mode && (t = u.settings.minSlides),
                            t
                        );
                    },
                    f = function () {
                        var t = 0,
                            e = 0,
                            i = 0;
                        if (0 < u.settings.moveSlides) {
                            if (!u.settings.infiniteLoop) {
                                for (; e < u.children.length; ) ++t, (e = i + c()), (i += u.settings.moveSlides <= c() ? u.settings.moveSlides : c());
                                return i;
                            }
                            t = Math.ceil(u.children.length / v());
                        } else t = Math.ceil(u.children.length / c());
                        return t;
                    },
                    v = function () {
                        return 0 < u.settings.moveSlides && u.settings.moveSlides <= c() ? u.settings.moveSlides : c();
                    },
                    g = function () {
                        var t, e, i;
                        u.children.length > u.settings.maxSlides && u.active.last && !u.settings.infiniteLoop
                            ? "horizontal" === u.settings.mode
                                ? ((t = (e = u.children.last()).position()), m(-(t.left - (u.viewport.width() - e.outerWidth())), "reset", 0))
                                : "vertical" === u.settings.mode && ((i = u.children.length - u.settings.minSlides), (t = u.children.eq(i).position()), m(-t.top, "reset", 0))
                            : ((t = u.children.eq(u.active.index * v()).position()),
                              u.active.index === f() - 1 && (u.active.last = !0),
                              void 0 !== t && ("horizontal" === u.settings.mode ? m(-t.left, "reset", 0) : "vertical" === u.settings.mode && m(-t.top, "reset", 0)));
                    },
                    m = function (t, e, i, s) {
                        var n, o;
                        u.usingCSS
                            ? ((o = "vertical" === u.settings.mode ? "translate3d(0, " + t + "px, 0)" : "translate3d(" + t + "px, 0, 0)"),
                              p.css("-" + u.cssPrefix + "-transition-duration", i / 1e3 + "s"),
                              "slide" === e
                                  ? (p.css(u.animProp, o),
                                    0 !== i
                                        ? p.on("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function (t) {
                                              H(t.target).is(p) && (p.off("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd"), k());
                                          })
                                        : k())
                                  : "reset" === e
                                  ? p.css(u.animProp, o)
                                  : "ticker" === e &&
                                    (p.css("-" + u.cssPrefix + "-transition-timing-function", "linear"),
                                    p.css(u.animProp, o),
                                    0 !== i
                                        ? p.on("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function (t) {
                                              H(t.target).is(p) && (p.off("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd"), m(s.resetValue, "reset", 0), L());
                                          })
                                        : (m(s.resetValue, "reset", 0), L())))
                            : (((n = {})[u.animProp] = t),
                              "slide" === e
                                  ? p.animate(n, i, u.settings.easing, function () {
                                        k();
                                    })
                                  : "reset" === e
                                  ? p.css(u.animProp, t)
                                  : "ticker" === e &&
                                    p.animate(n, i, "linear", function () {
                                        m(s.resetValue, "reset", 0), L();
                                    }));
                    },
                    b = function () {
                        for (var t = "", e = "", i = f(), s = 0; s < i; s++)
                            (e = ""),
                                (u.settings.buildPager && H.isFunction(u.settings.buildPager)) || u.settings.pagerCustom
                                    ? ((e = u.settings.buildPager(s)), u.pagerEl.addClass("bx-custom-pager"))
                                    : ((e = s + 1), u.pagerEl.addClass("bx-default-pager")),
                                (t += '<div class="bx-pager-item"><a href="" data-slide-index="' + s + '" class="bx-pager-link">' + e + "</a></div>");
                        u.pagerEl.html(t);
                    },
                    _ = function () {
                        u.settings.pagerCustom
                            ? (u.pagerEl = H(u.settings.pagerCustom))
                            : ((u.pagerEl = H('<div class="bx-pager" />')), u.settings.pagerSelector ? H(u.settings.pagerSelector).html(u.pagerEl) : u.controls.el.addClass("bx-has-pager").append(u.pagerEl), b()),
                            u.pagerEl.on("click touchend", "a", T);
                    },
                    x = function () {
                        (u.controls.next = H('<a class="bx-next" href="">' + u.settings.nextText + "</a>")),
                            (u.controls.prev = H('<a class="bx-prev" href="">' + u.settings.prevText + "</a>")),
                            u.controls.next.on("click touchend", w),
                            u.controls.prev.on("click touchend", S),
                            u.settings.nextSelector && H(u.settings.nextSelector).append(u.controls.next),
                            u.settings.prevSelector && H(u.settings.prevSelector).append(u.controls.prev),
                            u.settings.nextSelector ||
                                u.settings.prevSelector ||
                                ((u.controls.directionEl = H('<div class="bx-controls-direction" />')),
                                u.controls.directionEl.append(u.controls.prev).append(u.controls.next),
                                u.controls.el.addClass("bx-has-controls-direction").append(u.controls.directionEl));
                    },
                    y = function () {
                        (u.controls.start = H('<div class="bx-controls-auto-item"><a class="bx-start" href="">' + u.settings.startText + "</a></div>")),
                            (u.controls.stop = H('<div class="bx-controls-auto-item"><a class="bx-stop" href="">' + u.settings.stopText + "</a></div>")),
                            (u.controls.autoEl = H('<div class="bx-controls-auto" />')),
                            u.controls.autoEl.on("click", ".bx-start", C),
                            u.controls.autoEl.on("click", ".bx-stop", z),
                            u.settings.autoControlsCombine ? u.controls.autoEl.append(u.controls.start) : u.controls.autoEl.append(u.controls.start).append(u.controls.stop),
                            u.settings.autoControlsSelector ? H(u.settings.autoControlsSelector).html(u.controls.autoEl) : u.controls.el.addClass("bx-has-controls-auto").append(u.controls.autoEl),
                            E(u.settings.autoStart ? "stop" : "start");
                    },
                    $ = function () {
                        u.children.each(function (t) {
                            var e = H(this).find("img:first").attr("title");
                            void 0 !== e && ("" + e).length && H(this).append('<div class="bx-caption"><span>' + e + "</span></div>");
                        });
                    },
                    w = function (t) {
                        t.preventDefault(), u.controls.el.hasClass("disabled") || (u.settings.auto && u.settings.stopAutoOnClick && p.stopAuto(), p.goToNextSlide());
                    },
                    S = function (t) {
                        t.preventDefault(), u.controls.el.hasClass("disabled") || (u.settings.auto && u.settings.stopAutoOnClick && p.stopAuto(), p.goToPrevSlide());
                    },
                    C = function (t) {
                        p.startAuto(), t.preventDefault();
                    },
                    z = function (t) {
                        p.stopAuto(), t.preventDefault();
                    },
                    T = function (t) {
                        var e, i;
                        t.preventDefault(),
                            u.controls.el.hasClass("disabled") ||
                                (u.settings.auto && u.settings.stopAutoOnClick && p.stopAuto(),
                                void 0 !== (e = H(t.currentTarget)).attr("data-slide-index") && (i = parseInt(e.attr("data-slide-index"))) !== u.active.index && p.goToSlide(i));
                    },
                    q = function (i) {
                        var t = u.children.length;
                        if ("short" === u.settings.pagerType) return 1 < u.settings.maxSlides && (t = Math.ceil(u.children.length / u.settings.maxSlides)), void u.pagerEl.html(i + 1 + u.settings.pagerShortSeparator + t);
                        u.pagerEl.find("a").removeClass("active"),
                            u.pagerEl.each(function (t, e) {
                                H(e).find("a").eq(i).addClass("active");
                            });
                    },
                    k = function () {
                        if (u.settings.infiniteLoop) {
                            var t = "";
                            0 === u.active.index
                                ? (t = u.children.eq(0).position())
                                : u.active.index === f() - 1 && u.carousel
                                ? (t = u.children.eq((f() - 1) * v()).position())
                                : u.active.index === u.children.length - 1 && (t = u.children.eq(u.children.length - 1).position()),
                                t && ("horizontal" === u.settings.mode ? m(-t.left, "reset", 0) : "vertical" === u.settings.mode && m(-t.top, "reset", 0));
                        }
                        (u.working = !1), u.settings.onSlideAfter.call(p, u.children.eq(u.active.index), u.oldIndex, u.active.index);
                    },
                    E = function (t) {
                        u.settings.autoControlsCombine ? u.controls.autoEl.html(u.controls[t]) : (u.controls.autoEl.find("a").removeClass("active"), u.controls.autoEl.find("a:not(.bx-" + t + ")").addClass("active"));
                    },
                    A = function () {
                        1 === f()
                            ? (u.controls.prev.addClass("disabled"), u.controls.next.addClass("disabled"))
                            : !u.settings.infiniteLoop &&
                              u.settings.hideControlOnEnd &&
                              (0 === u.active.index
                                  ? (u.controls.prev.addClass("disabled"), u.controls.next.removeClass("disabled"))
                                  : u.active.index === f() - 1
                                  ? (u.controls.next.addClass("disabled"), u.controls.prev.removeClass("disabled"))
                                  : (u.controls.prev.removeClass("disabled"), u.controls.next.removeClass("disabled")));
                    },
                    I = function () {
                        p.startAuto();
                    },
                    D = function () {
                        p.stopAuto();
                    },
                    P = function () {
                        0 < u.settings.autoDelay ? setTimeout(p.startAuto, u.settings.autoDelay) : (p.startAuto(), H(window).focus(I).blur(D)),
                            u.settings.autoHover &&
                                p.hover(
                                    function () {
                                        u.interval && (p.stopAuto(!0), (u.autoPaused = !0));
                                    },
                                    function () {
                                        u.autoPaused && (p.startAuto(!0), (u.autoPaused = null));
                                    }
                                );
                    },
                    N = function () {
                        var t,
                            e,
                            i,
                            s,
                            n,
                            o,
                            a,
                            r,
                            l = 0;
                        "next" === u.settings.autoDirection
                            ? p.append(u.children.clone().addClass("bx-clone"))
                            : (p.prepend(u.children.clone().addClass("bx-clone")), (t = u.children.first().position()), (l = "horizontal" === u.settings.mode ? -t.left : -t.top)),
                            m(l, "reset", 0),
                            (u.settings.pager = !1),
                            (u.settings.controls = !1),
                            (u.settings.autoControls = !1),
                            u.settings.tickerHover &&
                                (u.usingCSS
                                    ? ((s = "horizontal" === u.settings.mode ? 4 : 5),
                                      u.viewport.hover(
                                          function () {
                                              (e = p.css("-" + u.cssPrefix + "-transform")), (i = parseFloat(e.split(",")[s])), m(i, "reset", 0);
                                          },
                                          function () {
                                              (r = 0),
                                                  u.children.each(function (t) {
                                                      r += "horizontal" === u.settings.mode ? H(this).outerWidth(!0) : H(this).outerHeight(!0);
                                                  }),
                                                  (n = u.settings.speed / r),
                                                  (o = "horizontal" === u.settings.mode ? "left" : "top"),
                                                  (a = n * (r - Math.abs(parseInt(i)))),
                                                  L(a);
                                          }
                                      ))
                                    : u.viewport.hover(
                                          function () {
                                              p.stop();
                                          },
                                          function () {
                                              (r = 0),
                                                  u.children.each(function (t) {
                                                      r += "horizontal" === u.settings.mode ? H(this).outerWidth(!0) : H(this).outerHeight(!0);
                                                  }),
                                                  (n = u.settings.speed / r),
                                                  (o = "horizontal" === u.settings.mode ? "left" : "top"),
                                                  (a = n * (r - Math.abs(parseInt(p.css(o))))),
                                                  L(a);
                                          }
                                      )),
                            L();
                    },
                    L = function (t) {
                        var e,
                            i,
                            s = t || u.settings.speed,
                            n = { left: 0, top: 0 },
                            o = { left: 0, top: 0 };
                        "next" === u.settings.autoDirection ? (n = p.find(".bx-clone").first().position()) : (o = u.children.first().position()),
                            (e = "horizontal" === u.settings.mode ? -n.left : -n.top),
                            (i = "horizontal" === u.settings.mode ? -o.left : -o.top),
                            m(e, "ticker", s, { resetValue: i });
                    },
                    O = function (t) {
                        var e,
                            i,
                            s,
                            n,
                            o = document.activeElement.tagName.toLowerCase();
                        if (
                            null == new RegExp(o, ["i"]).exec("input|textarea") &&
                            ((e = p),
                            (s = { top: (i = H(window)).scrollTop(), left: i.scrollLeft() }),
                            (n = e.offset()),
                            (s.right = s.left + i.width()),
                            (s.bottom = s.top + i.height()),
                            (n.right = n.left + e.outerWidth()),
                            (n.bottom = n.top + e.outerHeight()),
                            !(s.right < n.left || s.left > n.right || s.bottom < n.top || s.top > n.bottom))
                        ) {
                            if (39 === t.keyCode) return w(t), !1;
                            if (37 === t.keyCode) return S(t), !1;
                        }
                    },
                    M = function () {
                        (u.touch = { start: { x: 0, y: 0 }, end: { x: 0, y: 0 } }),
                            u.viewport.on("touchstart MSPointerDown pointerdown", R),
                            u.viewport.on("click", ".bxslider a", function (t) {
                                u.viewport.hasClass("click-disabled") && (t.preventDefault(), u.viewport.removeClass("click-disabled"));
                            });
                    },
                    R = function (t) {
                        if ("touchstart" === t.type || 0 === t.button)
                            if ((t.preventDefault(), u.controls.el.addClass("disabled"), u.working)) u.controls.el.removeClass("disabled");
                            else {
                                u.touch.originalPos = p.position();
                                var e = t.originalEvent,
                                    i = void 0 !== e.changedTouches ? e.changedTouches : [e];
                                if ("function" == typeof PointerEvent && void 0 === e.pointerId) return;
                                (u.touch.start.x = i[0].pageX),
                                    (u.touch.start.y = i[0].pageY),
                                    u.viewport.get(0).setPointerCapture && ((u.pointerId = e.pointerId), u.viewport.get(0).setPointerCapture(u.pointerId)),
                                    (u.originalClickTarget = e.originalTarget || e.target),
                                    (u.originalClickButton = e.button),
                                    (u.originalClickButtons = e.buttons),
                                    (u.originalEventType = e.type),
                                    (u.hasMove = !1),
                                    u.viewport.on("touchmove MSPointerMove pointermove", W),
                                    u.viewport.on("touchend MSPointerUp pointerup", j),
                                    u.viewport.on("MSPointerCancel pointercancel", F);
                            }
                    },
                    F = function (t) {
                        t.preventDefault(),
                            m(u.touch.originalPos.left, "reset", 0),
                            u.controls.el.removeClass("disabled"),
                            u.viewport.off("MSPointerCancel pointercancel", F),
                            u.viewport.off("touchmove MSPointerMove pointermove", W),
                            u.viewport.off("touchend MSPointerUp pointerup", j),
                            u.viewport.get(0).releasePointerCapture && u.viewport.get(0).releasePointerCapture(u.pointerId);
                    },
                    W = function (t) {
                        var e = t.originalEvent,
                            i = void 0 !== e.changedTouches ? e.changedTouches : [e],
                            s = Math.abs(i[0].pageX - u.touch.start.x),
                            n = Math.abs(i[0].pageY - u.touch.start.y),
                            o = 0,
                            a = 0;
                        (u.hasMove = !0),
                            n < 3 * s && u.settings.preventDefaultSwipeX ? t.preventDefault() : s < 3 * n && u.settings.preventDefaultSwipeY && t.preventDefault(),
                            "touchmove" !== t.type && t.preventDefault(),
                            "fade" !== u.settings.mode &&
                                u.settings.oneToOneTouch &&
                                ((o = "horizontal" === u.settings.mode ? ((a = i[0].pageX - u.touch.start.x), u.touch.originalPos.left + a) : ((a = i[0].pageY - u.touch.start.y), u.touch.originalPos.top + a)), m(o, "reset", 0));
                    },
                    j = function (t) {
                        t.preventDefault(), u.viewport.off("touchmove MSPointerMove pointermove", W), u.controls.el.removeClass("disabled");
                        var e = t.originalEvent,
                            i = void 0 !== e.changedTouches ? e.changedTouches : [e],
                            s = 0,
                            n = 0;
                        (u.touch.end.x = i[0].pageX),
                            (u.touch.end.y = i[0].pageY),
                            "fade" === u.settings.mode
                                ? (n = Math.abs(u.touch.start.x - u.touch.end.x)) >= u.settings.swipeThreshold && (u.touch.start.x > u.touch.end.x ? p.goToNextSlide() : p.goToPrevSlide(), p.stopAuto())
                                : ((s = "horizontal" === u.settings.mode ? ((n = u.touch.end.x - u.touch.start.x), u.touch.originalPos.left) : ((n = u.touch.end.y - u.touch.start.y), u.touch.originalPos.top)),
                                  !u.settings.infiniteLoop && ((0 === u.active.index && 0 < n) || (u.active.last && n < 0))
                                      ? m(s, "reset", 200)
                                      : Math.abs(n) >= u.settings.swipeThreshold
                                      ? (n < 0 ? p.goToNextSlide() : p.goToPrevSlide(), p.stopAuto())
                                      : m(s, "reset", 200)),
                            u.viewport.off("touchend MSPointerUp pointerup", j),
                            u.viewport.get(0).releasePointerCapture && u.viewport.get(0).releasePointerCapture(u.pointerId),
                            !1 !== u.hasMove || (0 !== u.originalClickButton && "touchstart" !== u.originalEventType) || H(u.originalClickTarget).trigger({ type: "click", button: u.originalClickButton, buttons: u.originalClickButtons });
                    },
                    U = function (t) {
                        if (u.initialized)
                            if (u.working) window.setTimeout(U, 10);
                            else {
                                var e = H(window).width(),
                                    i = H(window).height();
                                (s === e && n === i) || ((s = e), (n = i), p.redrawSlider(), u.settings.onSliderResize.call(p, u.active.index));
                            }
                    },
                    B = function (t) {
                        var e = c();
                        u.settings.ariaHidden && !u.settings.ticker && (u.children.attr("aria-hidden", "true"), u.children.slice(t, t + e).attr("aria-hidden", "false"));
                    };
                return (
                    (p.goToSlide = function (t, e) {
                        var i,
                            s,
                            n,
                            o,
                            a,
                            r = !0,
                            l = 0,
                            d = { left: 0, top: 0 },
                            c = null;
                        if (
                            ((u.oldIndex = u.active.index),
                            (u.active.index = (a = t) < 0 ? (u.settings.infiniteLoop ? f() - 1 : u.active.index) : a >= f() ? (u.settings.infiniteLoop ? 0 : u.active.index) : a),
                            !u.working && u.active.index !== u.oldIndex)
                        ) {
                            if (((u.working = !0), void 0 !== (r = u.settings.onSlideBefore.call(p, u.children.eq(u.active.index), u.oldIndex, u.active.index)) && !r)) return (u.active.index = u.oldIndex), void (u.working = !1);
                            "next" === e
                                ? u.settings.onSlideNext.call(p, u.children.eq(u.active.index), u.oldIndex, u.active.index) || (r = !1)
                                : "prev" === e && (u.settings.onSlidePrev.call(p, u.children.eq(u.active.index), u.oldIndex, u.active.index) || (r = !1)),
                                (u.active.last = u.active.index >= f() - 1),
                                (u.settings.pager || u.settings.pagerCustom) && q(u.active.index),
                                u.settings.controls && A(),
                                "fade" === u.settings.mode
                                    ? (u.settings.adaptiveHeight && u.viewport.height() !== h() && u.viewport.animate({ height: h() }, u.settings.adaptiveHeightSpeed),
                                      u.children.filter(":visible").fadeOut(u.settings.speed).css({ zIndex: 0 }),
                                      u.children
                                          .eq(u.active.index)
                                          .css("zIndex", u.settings.slideZIndex + 1)
                                          .fadeIn(u.settings.speed, function () {
                                              H(this).css("zIndex", u.settings.slideZIndex), k();
                                          }))
                                    : (u.settings.adaptiveHeight && u.viewport.height() !== h() && u.viewport.animate({ height: h() }, u.settings.adaptiveHeightSpeed),
                                      !u.settings.infiniteLoop && u.carousel && u.active.last
                                          ? "horizontal" === u.settings.mode
                                              ? ((d = (c = u.children.eq(u.children.length - 1)).position()), (l = u.viewport.width() - c.outerWidth()))
                                              : ((i = u.children.length - u.settings.minSlides), (d = u.children.eq(i).position()))
                                          : u.carousel && u.active.last && "prev" === e
                                          ? ((s = 1 === u.settings.moveSlides ? u.settings.maxSlides - v() : (f() - 1) * v() - (u.children.length - u.settings.maxSlides)), (d = (c = p.children(".bx-clone").eq(s)).position()))
                                          : "next" === e && 0 === u.active.index
                                          ? ((d = p.find("> .bx-clone").eq(u.settings.maxSlides).position()), (u.active.last = !1))
                                          : 0 <= t && ((o = t * parseInt(v())), (d = u.children.eq(o).position())),
                                      void 0 !== d && ((n = "horizontal" === u.settings.mode ? -(d.left - l) : -d.top), m(n, "slide", u.settings.speed)),
                                      (u.working = !1)),
                                u.settings.ariaHidden && B(u.active.index * v());
                        }
                    }),
                    (p.goToNextSlide = function () {
                        if ((u.settings.infiniteLoop || !u.active.last) && !0 !== u.working) {
                            var t = parseInt(u.active.index) + 1;
                            p.goToSlide(t, "next");
                        }
                    }),
                    (p.goToPrevSlide = function () {
                        if ((u.settings.infiniteLoop || 0 !== u.active.index) && !0 !== u.working) {
                            var t = parseInt(u.active.index) - 1;
                            p.goToSlide(t, "prev");
                        }
                    }),
                    (p.startAuto = function (t) {
                        u.interval ||
                            ((u.interval = setInterval(function () {
                                "next" === u.settings.autoDirection ? p.goToNextSlide() : p.goToPrevSlide();
                            }, u.settings.pause)),
                            u.settings.onAutoChange.call(p, !0),
                            u.settings.autoControls && !0 !== t && E("stop"));
                    }),
                    (p.stopAuto = function (t) {
                        u.autoPaused && (u.autoPaused = !1), u.interval && (clearInterval(u.interval), (u.interval = null), u.settings.onAutoChange.call(p, !1), u.settings.autoControls && !0 !== t && E("start"));
                    }),
                    (p.getCurrentSlide = function () {
                        return u.active.index;
                    }),
                    (p.getCurrentSlideElement = function () {
                        return u.children.eq(u.active.index);
                    }),
                    (p.getSlideElement = function (t) {
                        return u.children.eq(t);
                    }),
                    (p.getSlideCount = function () {
                        return u.children.length;
                    }),
                    (p.isWorking = function () {
                        return u.working;
                    }),
                    (p.redrawSlider = function () {
                        u.children.add(p.find(".bx-clone")).outerWidth(d()),
                            u.viewport.css("height", h()),
                            u.settings.ticker || g(),
                            u.active.last && (u.active.index = f() - 1),
                            u.active.index >= f() && (u.active.last = !0),
                            u.settings.pager && !u.settings.pagerCustom && (b(), q(u.active.index)),
                            u.settings.ariaHidden && B(u.active.index * v());
                    }),
                    (p.destroySlider = function () {
                        u.initialized &&
                            ((u.initialized = !1),
                            H(".bx-clone", this).remove(),
                            u.children.each(function () {
                                void 0 !== H(this).data("origStyle") ? H(this).attr("style", H(this).data("origStyle")) : H(this).removeAttr("style");
                            }),
                            void 0 !== H(this).data("origStyle") ? this.attr("style", H(this).data("origStyle")) : H(this).removeAttr("style"),
                            H(this).unwrap().unwrap(),
                            u.controls.el && u.controls.el.remove(),
                            u.controls.next && u.controls.next.remove(),
                            u.controls.prev && u.controls.prev.remove(),
                            u.pagerEl && u.settings.controls && !u.settings.pagerCustom && u.pagerEl.remove(),
                            H(".bx-caption", this).remove(),
                            u.controls.autoEl && u.controls.autoEl.remove(),
                            clearInterval(u.interval),
                            u.settings.responsive && H(window).off("resize", U),
                            u.settings.keyboardEnabled && H(document).off("keydown", O),
                            H(this).removeData("bxSlider"),
                            H(window).off("blur", D).off("focus", I));
                    }),
                    (p.reloadSlider = function (t) {
                        void 0 !== t && (e = t), p.destroySlider(), o(), H(p).data("bxSlider", this);
                    }),
                    o(),
                    H(p).data("bxSlider", this),
                    this
                );
            }
        };
    })(jQuery),
    (function (t) {
        var e = (function (s, h, o) {
            "use strict";
            var f, v;
            if (
                ((function () {
                    var t,
                        e = {
                            lazyClass: "lazyload",
                            loadedClass: "lazyloaded",
                            loadingClass: "lazyloading",
                            preloadClass: "lazypreload",
                            errorClass: "lazyerror",
                            autosizesClass: "lazyautosizes",
                            fastLoadedClass: "ls-is-cached",
                            iframeLoadMode: 0,
                            srcAttr: "data-src",
                            srcsetAttr: "data-srcset",
                            sizesAttr: "data-sizes",
                            minSize: 40,
                            customMedia: {},
                            init: !0,
                            expFactor: 1.5,
                            hFac: 0.8,
                            loadMode: 2,
                            loadHidden: !0,
                            ricTimeout: 0,
                            throttleDelay: 125,
                        };
                    for (t in ((v = s.lazySizesConfig || s.lazysizesConfig || {}), e)) t in v || (v[t] = e[t]);
                })(),
                !h || !h.getElementsByClassName)
            )
                return { init: function () {}, cfg: v, noSupport: !0 };
            var i,
                a,
                n,
                t,
                g,
                m,
                b,
                _,
                e,
                x,
                y,
                $,
                w,
                S,
                C,
                z,
                r,
                l,
                d,
                c,
                u,
                p,
                T,
                q,
                k,
                E,
                A,
                I,
                D,
                P,
                N,
                L,
                O,
                M,
                R,
                F,
                W,
                j,
                U,
                B,
                H,
                Z,
                V,
                Q,
                K,
                Y,
                X,
                J,
                G,
                tt,
                et = h.documentElement,
                it = s.HTMLPictureElement,
                st = "addEventListener",
                nt = "getAttribute",
                ot = s[st].bind(s),
                at = s.setTimeout,
                rt = s.requestAnimationFrame || at,
                lt = s.requestIdleCallback,
                dt = /^picture$/i,
                ct = ["load", "error", "lazyincluded", "_lazyloaded"],
                ut = {},
                pt = Array.prototype.forEach,
                ht = function (t, e) {
                    return ut[e] || (ut[e] = new RegExp("(\\s|^)" + e + "(\\s|$)")), ut[e].test(t[nt]("class") || "") && ut[e];
                },
                ft = function (t, e) {
                    ht(t, e) || t.setAttribute("class", (t[nt]("class") || "").trim() + " " + e);
                },
                vt = function (t, e) {
                    var i;
                    (i = ht(t, e)) && t.setAttribute("class", (t[nt]("class") || "").replace(i, " "));
                },
                gt = function (e, i, t) {
                    var s = t ? st : "removeEventListener";
                    t && gt(e, i),
                        ct.forEach(function (t) {
                            e[s](t, i);
                        });
                },
                mt = function (t, e, i, s, n) {
                    var o = h.createEvent("Event");
                    return i || (i = {}), (i.instance = f), o.initEvent(e, !s, !n), (o.detail = i), t.dispatchEvent(o), o;
                },
                bt = function (t, e) {
                    var i;
                    !it && (i = s.picturefill || v.pf) ? (e && e.src && !t[nt]("srcset") && t.setAttribute("srcset", e.src), i({ reevaluate: !0, elements: [t] })) : e && e.src && (t.src = e.src);
                },
                _t = function (t, e) {
                    return (getComputedStyle(t, null) || {})[e];
                },
                xt = function (t, e, i) {
                    for (i = i || t.offsetWidth; i < v.minSize && e && !t._lazysizesWidth; ) (i = e.offsetWidth), (e = e.parentNode);
                    return i;
                },
                yt =
                    ((X = []),
                    (J = Y = []),
                    ((tt = function (t, e) {
                        Q && !e ? t.apply(this, arguments) : (J.push(t), K || ((K = !0), (h.hidden ? at : rt)(G)));
                    })._lsFlush = G = function () {
                        var t = J;
                        for (J = Y.length ? X : Y, K = !(Q = !0); t.length; ) t.shift()();
                        Q = !1;
                    }),
                    tt),
                $t = function (i, t) {
                    return t
                        ? function () {
                              yt(i);
                          }
                        : function () {
                              var t = this,
                                  e = arguments;
                              yt(function () {
                                  i.apply(t, e);
                              });
                          };
                },
                wt = function (t) {
                    var e,
                        i,
                        s = function () {
                            (e = null), t();
                        },
                        n = function () {
                            var t = o.now() - i;
                            t < 99 ? at(n, 99 - t) : (lt || s)(s);
                        };
                    return function () {
                        (i = o.now()), e || (e = at(n, 99));
                    };
                },
                St =
                    ((q = /^img$/i),
                    (k = /^iframe$/i),
                    (E = "onscroll" in s && !/(gle|ing)bot/.test(navigator.userAgent)),
                    (D = -1),
                    (P = function (t) {
                        I--, (!t || I < 0 || !t.target) && (I = 0);
                    }),
                    (N = function (t) {
                        return null == z && (z = "hidden" == _t(h.body, "visibility")), z || !("hidden" == _t(t.parentNode, "visibility") && "hidden" == _t(t, "visibility"));
                    }),
                    (L = function (t, e) {
                        var i,
                            s = t,
                            n = N(t);
                        for ($ -= e, C += e, w -= e, S += e; n && (s = s.offsetParent) && s != h.body && s != et; )
                            (n = 0 < (_t(s, "opacity") || 1)) && "visible" != _t(s, "overflow") && ((i = s.getBoundingClientRect()), (n = S > i.left && w < i.right && C > i.top - 1 && $ < i.bottom + 1));
                        return n;
                    }),
                    (r = O = function () {
                        var t,
                            e,
                            i,
                            s,
                            n,
                            o,
                            a,
                            r,
                            l,
                            d,
                            c,
                            u,
                            p = f.elements;
                        if ((_ = v.loadMode) && I < 8 && (t = p.length)) {
                            for (e = 0, D++; e < t; e++)
                                if (p[e] && !p[e]._lazyRace)
                                    if (!E || (f.prematureUnveil && f.prematureUnveil(p[e]))) B(p[e]);
                                    else if (
                                        (((r = p[e][nt]("data-expand")) && (o = 1 * r)) || (o = A),
                                        d ||
                                            ((d = !v.expand || v.expand < 1 ? (500 < et.clientHeight && 500 < et.clientWidth ? 500 : 370) : v.expand),
                                            (c = (f._defEx = d) * v.expFactor),
                                            (u = v.hFac),
                                            (z = null),
                                            A < c && I < 1 && 2 < D && 2 < _ && !h.hidden ? ((A = c), (D = 0)) : (A = 1 < _ && 1 < D && I < 6 ? d : 0)),
                                        l !== o && ((x = innerWidth + o * u), (y = innerHeight + o), (a = -1 * o), (l = o)),
                                        (i = p[e].getBoundingClientRect()),
                                        (C = i.bottom) >= a && ($ = i.top) <= y && (S = i.right) >= a * u && (w = i.left) <= x && (C || S || w || $) && (v.loadHidden || N(p[e])) && ((m && I < 3 && !r && (_ < 3 || D < 4)) || L(p[e], o)))
                                    ) {
                                        if ((B(p[e]), (n = !0), 9 < I)) break;
                                    } else !n && m && !s && I < 4 && D < 4 && 2 < _ && (g[0] || v.preloadAfterLoad) && (g[0] || (!r && (C || S || w || $ || "auto" != p[e][nt](v.sizesAttr)))) && (s = g[0] || p[e]);
                            s && !n && B(s);
                        }
                    }),
                    (d = I = A = 0),
                    (c = v.throttleDelay),
                    (u = v.ricTimeout),
                    (p = function () {
                        (l = !1), (d = o.now()), r();
                    }),
                    (T =
                        lt && 49 < u
                            ? function () {
                                  lt(p, { timeout: u }), u !== v.ricTimeout && (u = v.ricTimeout);
                              }
                            : $t(function () {
                                  at(p);
                              }, !0)),
                    (M = function (t) {
                        var e;
                        (t = !0 === t) && (u = 33), l || ((l = !0), (e = c - (o.now() - d)) < 0 && (e = 0), t || e < 9 ? T() : at(T, e));
                    }),
                    (F = $t(
                        (R = function (t) {
                            var e = t.target;
                            e._lazyCache ? delete e._lazyCache : (P(t), ft(e, v.loadedClass), vt(e, v.loadingClass), gt(e, W), mt(e, "lazyloaded"));
                        })
                    )),
                    (W = function (t) {
                        F({ target: t.target });
                    }),
                    (j = function (t) {
                        var e,
                            i = t[nt](v.srcsetAttr);
                        (e = v.customMedia[t[nt]("data-media") || t[nt]("media")]) && t.setAttribute("media", e), i && t.setAttribute("srcset", i);
                    }),
                    (U = $t(function (e, t, i, s, n) {
                        var o, a, r, l, d, c, u, p, h;
                        (d = mt(e, "lazybeforeunveil", t)).defaultPrevented ||
                            (s && (i ? ft(e, v.autosizesClass) : e.setAttribute("sizes", s)),
                            (a = e[nt](v.srcsetAttr)),
                            (o = e[nt](v.srcAttr)),
                            n && (l = (r = e.parentNode) && dt.test(r.nodeName || "")),
                            (c = t.firesLoad || ("src" in e && (a || o || l))),
                            (d = { target: e }),
                            ft(e, v.loadingClass),
                            c && (clearTimeout(b), (b = at(P, 2500)), gt(e, W, !0)),
                            l && pt.call(r.getElementsByTagName("source"), j),
                            a
                                ? e.setAttribute("srcset", a)
                                : o && !l && (k.test(e.nodeName) ? ((p = o), 0 == (h = (u = e).getAttribute("data-load-mode") || v.iframeLoadMode) ? u.contentWindow.location.replace(p) : 1 == h && (u.src = p)) : (e.src = o)),
                            n && (a || l) && bt(e, { src: o })),
                            e._lazyRace && delete e._lazyRace,
                            vt(e, v.lazyClass),
                            yt(function () {
                                var t = e.complete && 1 < e.naturalWidth;
                                (c && !t) ||
                                    (t && ft(e, v.fastLoadedClass),
                                    R(d),
                                    (e._lazyCache = !0),
                                    at(function () {
                                        "_lazyCache" in e && delete e._lazyCache;
                                    }, 9)),
                                    "lazy" == e.loading && I--;
                            }, !0);
                    })),
                    (B = function (t) {
                        if (!t._lazyRace) {
                            var e,
                                i = q.test(t.nodeName),
                                s = i && (t[nt](v.sizesAttr) || t[nt]("sizes")),
                                n = "auto" == s;
                            ((!n && m) || !i || (!t[nt]("src") && !t.srcset) || t.complete || ht(t, v.errorClass) || !ht(t, v.lazyClass)) &&
                                ((e = mt(t, "lazyunveilread").detail), n && Ct.updateElem(t, !0, t.offsetWidth), (t._lazyRace = !0), I++, U(t, e, n, s, i));
                        }
                    }),
                    (H = wt(function () {
                        (v.loadMode = 3), M();
                    })),
                    (V = function () {
                        m || (o.now() - e < 999 ? at(V, 999) : ((m = !0), (v.loadMode = 3), M(), ot("scroll", Z, !0)));
                    }),
                    {
                        _: function () {
                            (e = o.now()),
                                (f.elements = h.getElementsByClassName(v.lazyClass)),
                                (g = h.getElementsByClassName(v.lazyClass + " " + v.preloadClass)),
                                ot("scroll", M, !0),
                                ot("resize", M, !0),
                                ot("pageshow", function (t) {
                                    if (t.persisted) {
                                        var e = h.querySelectorAll("." + v.loadingClass);
                                        e.length &&
                                            e.forEach &&
                                            rt(function () {
                                                e.forEach(function (t) {
                                                    t.complete && B(t);
                                                });
                                            });
                                    }
                                }),
                                s.MutationObserver ? new MutationObserver(M).observe(et, { childList: !0, subtree: !0, attributes: !0 }) : (et[st]("DOMNodeInserted", M, !0), et[st]("DOMAttrModified", M, !0), setInterval(M, 999)),
                                ot("hashchange", M, !0),
                                ["focus", "mouseover", "click", "load", "transitionend", "animationend"].forEach(function (t) {
                                    h[st](t, M, !0);
                                }),
                                /d$|^c/.test(h.readyState) ? V() : (ot("load", V), h[st]("DOMContentLoaded", M), at(V, 2e4)),
                                f.elements.length ? (O(), yt._lsFlush()) : M();
                        },
                        checkElems: M,
                        unveil: B,
                        _aLSL: (Z = function () {
                            3 == v.loadMode && (v.loadMode = 2), H();
                        }),
                    }),
                Ct =
                    ((a = $t(function (t, e, i, s) {
                        var n, o, a;
                        if (((t._lazysizesWidth = s), (s += "px"), t.setAttribute("sizes", s), dt.test(e.nodeName || ""))) for (o = 0, a = (n = e.getElementsByTagName("source")).length; o < a; o++) n[o].setAttribute("sizes", s);
                        i.detail.dataAttr || bt(t, i.detail);
                    })),
                    (n = function (t, e, i) {
                        var s,
                            n = t.parentNode;
                        n && ((i = xt(t, n, i)), (s = mt(t, "lazybeforesizes", { width: i, dataAttr: !!e })).defaultPrevented || ((i = s.detail.width) && i !== t._lazysizesWidth && a(t, n, s, i)));
                    }),
                    {
                        _: function () {
                            (i = h.getElementsByClassName(v.autosizesClass)), ot("resize", t);
                        },
                        checkElems: (t = wt(function () {
                            var t,
                                e = i.length;
                            if (e) for (t = 0; t < e; t++) n(i[t]);
                        })),
                        updateElem: n,
                    }),
                zt = function () {
                    !zt.i && h.getElementsByClassName && ((zt.i = !0), Ct._(), St._());
                };
            return (
                at(function () {
                    v.init && zt();
                }),
                (f = { cfg: v, autoSizer: Ct, loader: St, init: zt, uP: bt, aC: ft, rC: vt, hC: ht, fire: mt, gW: xt, rAF: yt })
            );
        })(t, t.document, Date);
        (t.lazySizes = e), "object" == typeof module && module.exports && (module.exports = e);
    })("undefined" != typeof window ? window : {});




var screen_w = screen.width;                          // ширина экрана
var brow_w = document.body.clientWidth;               // ширина окна браузера


/* --- плавное перемещение к якорю --- */
$('.scroll-link').on('click', function(e){
  e.preventDefault();
  $('#topnav.in').removeClass('in');
  $('#header-navbar.navbar-open').removeClass('navbar-open');
  var idName = $(this).attr('href');
  var controlIdName = idName.replace(/^#/, '');
  if(controlIdName && document.getElementById(controlIdName)){
    var window_top = $(window).scrollTop();
    var anchor_top = $(idName).offset().top;
    if (typeof anchor_top !== 'undefined' && anchor_top > 0) {
      anchor_top -= 80;
      if (anchor_top < 0) {
        anchor_top = 0;
      }
    }
    if(idName == '#top') anchor_top == 0;
    var scrollTime = Math.abs(window_top - anchor_top) / 3;
    if(scrollTime < 300) scrollTime = 300;
    $('html,body').animate( { scrollTop: anchor_top }, scrollTime );
  }
});
/* end --- плавное перемещение к якорю --- end */






/* --- фиксируем меню при скроллинге --- */

var wr_navbar = $('#header-navbar');
var page_window = $(window);
function navbar_bg_scroll(){
  var navbar_top = 0;
  if(page_window.scrollTop() > navbar_top){
    if(!wr_navbar.hasClass('navbar-fixed-top')){
      wr_navbar.addClass('navbar-fixed-top');
    };
  }else{
    if(wr_navbar.hasClass('navbar-fixed-top')){
      wr_navbar.removeClass('navbar-fixed-top');
    };
  };
};
page_window.scroll(function(){
  navbar_bg_scroll();
});
navbar_bg_scroll();
/* end --- фиксируем меню при скроллинге --- end */



/* --- Контроль ввода цифр --- */

function getChar(event) {        // Кросс-браузерная функция для получения символа из события keypress:
  if (event.which == null) {                     // IE
    if (event.keyCode < 32) return null;         // спец. символ
    return String.fromCharCode(event.keyCode)
  }
  if (event.which != 0 && event.charCode != 0) { // все кроме IE
    if (event.which < 32) return null;           // спец. символ
    return String.fromCharCode(event.which);     // остальные
  }
  return null;                                   // спец. символ
};

$('.only_number, .bfh-phone, .only_number20').on('keypress', function(e){     // ВВОД ТОЛЬКО ЦИФР
  e = e || event;
  if (e.ctrlKey || e.altKey || e.metaKey) return;
  var chr = getChar(e);
  // с null надо осторожно в неравенствах,
  // т.к. например null >= '0' => true
  // на всякий случай лучше вынести проверку chr == null отдельно
  if (chr == null) return;

  if (chr < '0' || chr > '9') {
    return false;
  }
});

$('.float_number').on('keypress', function(e){     // ВВОД ЧИСЕЛ ТИПА FLOAT
  e = e || event;
  if (e.ctrlKey || e.altKey || e.metaKey) return;
  var chr = getChar(e);
  // с null надо осторожно в неравенствах,
  // т.к. например null >= '0' => true
  // на всякий случай лучше вынести проверку chr == null отдельно
  if (chr == null) return;

  if( chr != '.'){
    if (chr < '0' || chr > '9') {
      return false;
    }
  }
});


$('.float_number').on('keyup', function(){
  if( $(this).val().match(/\.\d*\./) ){
    var float_value = parseFloat( $(this).val() ) | 0;
    $(this).val( float_value );
  }
});

/* end --- Контроль ввода цифр --- end */





/* --- Показываем/скрываем "+7" в поле ввода телефона --- */
setTimeout(function(){
  $('.bfh-phone').each(function(){  
    if($(this).val() == '+7 ') $(this).val('');
  });
}, 200);
$('.bfh-phone').on('focus', function(){
  if($(this).val() == '') $(this).val('+7 ');
});

$('.bfh-phone').on('blur', function(){
  if($(this).val() == '+7 ') $(this).val('');
});
/* end --- Показываем/скрываем "+7" в поле ввода телефона --- end */


/* --- валидация форм --- */
setTimeout(function(){
  $('.form-validator').validator({
    'focus' : false
  });
}, 250);
/* end --- валидация форм --- end */



/* --- блокируем выделение кнопок при клике --- */

// блокируем выделение кнопок в IE
$('button').on('selectstart', function(){
  return false;
});

// блокируем выделение кнопок в браузерах (кроме IE)
$('button').on('mousedown', function(){
  return false;
});

/* end --- блокируем выделение кнопок при клике --- end */

function LdgZero(n) {
    return "0".substring(n >= 10) + n;
}

/* --- Инициализируем Bxslider "Отзывы" --- */
var bxslider_reviews = "";
var delay_reload_slider_reviews;
var control_bxslider_reviews = document.getElementById('bxslider-reviews');
var bxslider_container_reviews = $('#bxslider-container-reviews');

if(control_bxslider_reviews){

  bxslider_reviews = $('#bxslider-reviews').bxSlider({
      auto: false,
      touchEnabled: true,
      infiniteLoop: true,
      //mode: 'fade',
      speed: 300,
      pause: 5000,
      minSlides: 1,
      maxSlides: 1,
      moveSlides: 1,
      slideWidth: 550,
      slideMargin: 0,
      easing: 'ease',
      controls: false,
      pager: false,
      nextText: '',
      prevText: '',
      onSliderLoad: function($currentIndex){
        if (bxslider_reviews) {
          var slideCount = bxslider_reviews.getSlideCount();
          slideCount = LdgZero(slideCount);
          var currentSlide = bxslider_reviews.getCurrentSlide();
          currentSlide++;
          currentSlide = LdgZero(currentSlide);
          setTimeout(function(){
            $('.b-reviews__slider-pages-count').text(slideCount);
            $('.b-reviews__slider-pages-current').text(currentSlide);
          }, 300);
        }
      },
      onSlideBefore: function($slideElement, oldIndex, newIndex){
        if (bxslider_reviews) {
          var slideCount = bxslider_reviews.getSlideCount();
          slideCount = LdgZero(slideCount);
          var currentSlide = newIndex;
          currentSlide++;
          currentSlide = LdgZero(currentSlide);
          $('.b-reviews__slider-pages-count').text(slideCount);
          $('.b-reviews__slider-pages-current').text(currentSlide);
        }
      }
    });

  if(screen_w >= 768){
    $(window).resize(function(){
      clearTimeout(delay_reload_slider_reviews);
      delay_reload_slider_reviews = setTimeout(function(){
        bxslider_reviews.reloadSlider({
            auto: false,
            touchEnabled: true,
            infiniteLoop: true,
            //mode: 'fade',
            speed: 300,
            pause: 5000,
            minSlides: 1,
            maxSlides: 1,
            moveSlides: 1,
            slideWidth: 550,
            slideMargin: 0,
            easing: 'ease',
            controls: false,
            pager: false,
            nextText: '',
            prevText: '',
            onSliderLoad: function($currentIndex){
              if (bxslider_reviews) {
                var slideCount = bxslider_reviews.getSlideCount();
                slideCount = LdgZero(slideCount);
                var currentSlide = bxslider_reviews.getCurrentSlide();
                currentSlide++;
                currentSlide = LdgZero(currentSlide);
                setTimeout(function(){
                  $('.b-reviews__slider-pages-count').text(slideCount);
                  $('.b-reviews__slider-pages-current').text(currentSlide);
                }, 300);
              }
            },
            onSlideBefore: function($slideElement, oldIndex, newIndex){
              if (bxslider_reviews) {
                var slideCount = bxslider_reviews.getSlideCount();
                slideCount = LdgZero(slideCount);
                var currentSlide = newIndex;
                currentSlide++;
                currentSlide = LdgZero(currentSlide);
                $('.b-reviews__slider-pages-count').text(slideCount);
                $('.b-reviews__slider-pages-current').text(currentSlide);
              }
            }
          });
      }, 500);
    });
  }

  $(document).on('click', '.b-reviews__slider-prev', function(){
    if (typeof bxslider_reviews.goToPrevSlide === 'function') {
      bxslider_reviews.goToPrevSlide();
    }
  });
  $(document).on('click', '.b-reviews__slider-next', function(){
    if (typeof bxslider_reviews.goToNextSlide === 'function') {
      bxslider_reviews.goToNextSlide();
    }
  });

}
/* end --- Инициализируем Bxslider "Отзывы" --- end */


/* --- Инициализируем Bxslider "Кейсы" --- */
var bxslider_cases = "";
var delay_reload_slider_cases;
var control_bxslider_cases = document.getElementById('bxslider-cases');
var bxslider_container_cases = $('#bxslider-container-cases');


/* end --- Инициализируем Bxslider "Кейсы" --- end */

/* --- Кнопка "Читать далее" --- */
$(document).on('click', '.b-cases__item-link-more', function(){
  $('.b-cases__item-text-wrap').addClass('active');
  bxslider_cases.redrawSlider();
});
/* end --- Кнопка "Читать далее" --- end */


/* --- закрываем модальные окна при клике вне --- */
$('.modal[role="dialog"]').mouseup(function (e){
  var div = $('.modal-dialog');
  if (!div.is(e.target) && div.has(e.target).length === 0) {
    $(this).modal('hide');
  }
});
/* end --- закрываем модальные окна при клике вне --- end */



/* --- Выбираем окно Спасибо при открытии окна с формой --- */
$('[data-target="#form-modal"]').on('click', function(){
  if ($('#popap-success').length = 1) {
    var success_modal = $(this).attr('data-success') || null;
    var default_modal = $('#popap-success').attr('data-default') || null;
    if (success_modal){
      $('#popap-success').val(success_modal);
    } else if (default_modal) {
      $('#popap-success').val(default_modal);
    }
  }
});
$('[data-target="#fileform-modal"]').on('click', function(){
  if ($('#fileform-success').length = 1) {
    var success_modal = $(this).attr('data-success') || null;
    var default_modal = $('#fileform-success').attr('data-default') || null;
    if (success_modal){
      $('#fileform-success').val(success_modal);
    } else if (default_modal) {
      $('#fileform-success').val(default_modal);
    }
  }
});
/* end --- Выбираем окно Спасибо при открытии окна с формой --- end */


/* --- Отправляем заявку --- */

var block_send = 0; // переменная для блокировки повторной отправки

function send_mail_application(input_name, input_phone, input_email, input_phone_email, input_message, input_subject, input_business, input_type, input_room, input_conclusion,input_city,input_businessstom,input_xray,type_, input_send, input_success, project_name){    // отправка сообщения
  if(block_send == 1) return false;
  block_send = 1; // блокируем повторую отправку

  if(typeof input_name === 'undefined') input_name = '';
  if(typeof input_phone === 'undefined') input_phone = '';
  if(typeof input_email === 'undefined') input_email = '';
  if(typeof input_phone_email === 'undefined') input_phone_email = '';
  if(typeof input_message === 'undefined') input_message = '';
  if(typeof input_subject === 'undefined') input_subject = '';
  if(typeof input_business === 'undefined') input_business = '';
  if(typeof input_type === 'undefined') input_type = '';
  if(typeof input_room === 'undefined') input_room = '';
  if(typeof input_conclusion === 'undefined') input_conclusion = '';
  if(typeof input_city === 'undefined') input_city = '';
  if(typeof input_businessstom === 'undefined') input_businessstom = '';
  if(typeof input_xray === 'undefined') input_xray = '';
  if(typeof input_send === 'undefined') input_send = '';
  if(typeof project_name === 'undefined') project_name = '';

  var name = "",
      phone = "",
      email = "",
      phone_email = "",
      message = "",
      subject = "",
      business = "",
      type = "",
      room = "",
      conclusion = "",
	  city = "",
	  businessstom = "",
	  xray = "",
      send = "",
      projectName = "";

  if(input_name) name = input_name.val();
  if(input_phone) phone = input_phone.val();
  if(input_email) email = input_email.val();
  if(input_phone_email) phone_email = input_phone_email.val();
  if(input_message) message = input_message.val();
  if(input_subject) subject = input_subject.val();
  if(input_business) business = input_business.val();
  if(input_type) type = input_type.val();
  if(input_room) room = input_room.val();
  if(input_conclusion) conclusion = input_conclusion.val();
  if(input_city) city = input_city.val();
  if(input_businessstom)  businessstom = input_businessstom.val();
  if(input_xray) xray = input_xray.val();
  if(input_send) send = input_send.val();
  if(project_name) projectName = project_name.val();
    
  var formData = new FormData();
  formData.append('name', name);                         // Имя
  formData.append('phone', phone);                       // Телефон
  formData.append('email', email);                       // E-mail
  formData.append('phone-email', phone_email);           // Телефон или E-mail
  formData.append('message', message);                   // Сообщение
  formData.append('subject', subject);                   // Тема сообщения
  formData.append('business', business);
  formData.append('type_', type_);
  formData.append('landing_page', document.location.pathname);
  if(typeof type !== 'undefined'){
	formData.append('type', type);
  }
  if(typeof room !== 'undefined'){
	formData.append('room', room);
  }
  if(typeof conclusion !== 'undefined'){
	formData.append('conclusion', conclusion);
  }
  if(typeof city !== 'undefined'){
	formData.append('city', city);
  }
  if(typeof businessstom !== 'undefined'){
	formData.append('businessstom', businessstom);
  }
  if(typeof xray !== 'undefined'){
	formData.append('xray', xray);
  }
  formData.append('send', send);                         // Тип сообщения
  formData.append('project-name', projectName);                         // Тип сообщения

  for (var pair of formData.entries()) {
    console.log(pair[0]+ ', ' + pair[1]);
    }

  formData.append('ajax', '1');                          // индикатор ajax запроса
  $.ajax({                                               // отправляем запрос
    url:  "/send/send.php",
    type: 'POST',
    dataType: 'text',
    cache: false,
    contentType: false,
    processData: false,
    data: formData,
    success: function(data){
      if(data === 'ok'){            // если письмо отправлено
      console.log('Письмо отправлено успешно')
        $('.modal:visible').modal('hide');
        setTimeout(function(){
          if (typeof input_success !== 'undefined' && input_success.length == 1) {
            var success_modal_selector = input_success.val() || '#success-modal';
          } else {
            var success_modal_selector = '#success-modal';
          }
          $(success_modal_selector).modal('show');
          setTimeout(function(){
            if($(success_modal_selector).css('display') !== 'none'){
              // $(success_modal_selector).modal('hide');
            }
          }, 3000);    
        }, 500); 
        // очищаем поля для ввода
        if(input_name) input_name.val('');
        if(input_phone) input_phone.val('');
        if(input_email) input_email.val('');
        if(input_phone_email) input_phone_email.val('');
        if(input_message) input_message.val('');
        block_send = 0; // снимаем блокировку повторной отправки
        bitrixSend();

        // localStorage.setItem("formSended", 1);
        sessionStorage.setItem("formSended", 1);
        console.log('Отправили в crm');
      }else if(data === 'error'){    // не удалось отправить письмо
        block_send = 0; // снимаем блокировку повторной отправки
        console.log('Не удалось отправить сообщение');
      }
    }
  });

function bitrixSend() {
    $.ajax({                                               // отправляем запрос
    url:  "/send/bitrix-send.php",
    type: 'POST',
    dataType: 'text',
    cache: false,
    contentType: false,
    processData: false,
    data: formData,
    success: function(data){
        console.log(data)
    }
  });
}
};


$('#popap-form, #contactsform, #quizform, #fileform, #popap-form20').on('submit', function(e){
  e.preventDefault();
  var formId = '#' + $(this).attr('id');
  var input_name = $((formId + ' [name = "name"]'));
  var input_phone = $((formId + ' [name = "phone"]'));
  var input_email = $((formId + ' [name = "email"]'));
  var input_phone_email = $((formId + ' [name = "phone-email"]'));
  var input_message = $((formId + ' [name = "message"]'));
  var input_subject = $((formId + ' [name = "subject"]'));
  var input_business = $((formId + ' [name = "business"]'));
  var input_type = $((formId + ' [name = "type"]'));
  var input_room = $((formId + ' [name = "room"]'));
  var input_conclusion = $((formId + ' [name = "conclusion"]'));
  var input_city = $((formId + ' [name = "city"]'));
  var input_businessstom = $((formId + ' [name = "businessstom"]'));
  var input_xray = $((formId + ' [name = "xray"]'));
  var input_send = $((formId + ' [name = "send"]'));
  var input_success = $((formId + ' [name = "success"]'));
  var project_name = $((formId + ' [name = "project_name"]'));
  var type = quiz['step-1']['type'];
  if(!input_name[0].value) {
      console.log("проблема имя");
    return false;
  } else {
      $(formId +' [name = "send"]').removeClass('disabled');
  }
  
  if(input_phone[0].value.indexOf('_')+1){
        const inputPhone = document.getElementById("popap-phone-wrap");
        // const inputPhone = $((formId + '.popap-phone-wrap'));
        setTimeout(function(){
            inputPhone.classList.add("has-error","has-danger","workIt")
        }, 300);
        console.log("проблема телефон");
        return false;
  } else {
        $(formId +' [name = "send"]').removeClass('disabled');
  }
  

  if(!$((formId +' [name="agreement"]')).is(":checked") && formId != '#quizform') {
      $(formId +' [name = "send"]').addClass('disabled');
  }


//   if(input_phone[0].value && input_phone[0].value.match(/^[0-9]+$/) == null) {
//         const inputPhone = document.getElementById("popap-phone-wrap");
//         // const inputPhone = $((formId + '.popap-phone-wrap'));
//         setTimeout(function(){
//             inputPhone.classList.add("has-error","has-danger","workIt")
//         }, 300);
//         console.log("проблема телефон");
//         return false;
//   }


  if($((formId +' [name = "send"]')).hasClass('disabled')) return false;
  
  send_mail_application(input_name, input_phone, input_email, input_phone_email, input_message, input_subject, input_business, input_type, input_room, input_conclusion,input_city,input_businessstom,input_xray,type, input_send, input_success,project_name);  
  yaCounter66464410.reachGoal('submitrequest');
//   ym(66464410,'reachGoal','submitrequest');
});

/* end --- Отправляем заявку --- end */


function custom_checkbox(name, value, text, checked, data){
  var data_str = '';
  if (typeof data === 'object') {
    for(one in data){
      data_str += ' data-'+one+'="'+data[one]+'" ';
    }
  }
  var res = '<div class="b-quiz__form-checkbox">';
      res += ' <label>';
      res += '  <input type="checkbox" '+data_str+' name="'+name+'" value="'+value+'" '+checked+'>';
      res += '  <span class="custom-checkbox-input"></span>';
      res += '  <span class="custom-checkbox-text">'+text+'</span>';
      res += ' </label>';
      res += '</div>';
  return res;
};


function custom_radio(name, value, text, checked, data){
  var data_str = '';
  if (typeof data === 'object') {
    for(one in data){
      data_str += ' data-'+one+'="'+data[one]+'" ';
    }
  }
  var res = '<div class="b-quiz__form-radio">';
      res += ' <label>';
      res += '  <input type="radio" '+data_str+' name="'+name+'" value="'+value+'" '+checked+'>';
      res += '  <span class="custom-checkbox-input"></span>';
      res += '  <span class="custom-checkbox-text">'+text+'</span>';
      res += ' </label>';
      res += '</div>';
  return res;
};





/* --- QUIZ --- */

var quiz_var_business = null;
var quiz_var_type = null;
var quiz_var_room = null;
var quiz_var_conclusion = null;
var quiz_var_city = null;
var quiz_var_businessstom = null;
var quiz_var_xray = null;

let quiz_results;

if(quiz['step-1']['type'] == "stom"){
	quiz_results = {
    'quiz_var_businessstom' : {
        'value' : null,
        'step' : null
    },
    'quiz_var_city' : {
        'value' : null,
        'step' : null
    },
    'quiz_var_xray' : {
        'value' : null,
        'step' : null
    },
    'quiz_var_conclusion' : {
        'value' : null,
        'step' : null
    },
}
}else{

quiz_results = {
    'quiz_var_business' : {
        'value' : null,
        'step' : null
    },
    'quiz_var_type' : {
        'value' : null,
        'step' : null
    },
    'quiz_var_room' : {
        'value' : null,
        'step' : null
    },
    'quiz_var_conclusion' : {
        'value' : null,
        'step' : null
    },
	'quiz_var_city' : {
        'value' : null,
        'step' : null
    },
}
}
function quiz_fill_hidden_fields(){
  var text_business = '';
  var text_type = new Array;
  var text_room = '';
  var text_conclusion = '';
  var text_city = '';
  var text_businessstom = '';
  var text_xray = '';

  if(quiz['business']) {
        text_business = quiz['business'];
  }
  if (typeof quiz_var_business !== 'undefined' && quiz_var_business) {
      
    if (typeof quiz['step-2'][quiz_var_business.val()]['business'] !== 'undefined') {
      text_business = quiz['step-2'][quiz_var_business.val()]['business'];
    }
  }
  
  if (typeof quiz_var_type !== 'undefined' && quiz_var_type) {
      var quiz_var_type_arr;
    if(/^[,]+$/.test(quiz_var_type)) {
        quiz_var_type_arr = quiz_var_type.split(',');
    } else {
        quiz_var_type_arr = quiz_var_type;
    }
	let stepCon;
	if(quiz['step-1']['type'] == "stom"){
		stepCon = quiz_results['quiz_var_city']['step'];
	}else if(quiz['step-1']['type'] == "education"){
		stepCon = quiz_results['quiz_var_room']['step'];
	}else{
		stepCon = quiz_results['quiz_var_type']['step'];
	}
    if (typeof quiz_var_type_arr === 'object') {
      for(quiz_var_type_arr_i in quiz_var_type_arr){
        if('list' in quiz[stepCon]) {
            quizType(quiz[stepCon]['list']['items'])
        } else if (typeof quiz[stepCon][quiz_var_business.val()]['list']['items'] !== 'undefined') {
          quizType( quiz[stepCon][quiz_var_business.val()]['list']['items'],'branching')
        }
        function quizType(currentElem, currentAction) {
            
            switch(currentAction) {
              case 'branching': 
               currentElem.forEach(function(item, i, arr){
                if (typeof item.value !== 'undefined' && item.value == quiz_var_type_arr[quiz_var_type_arr_i].value && typeof item.text !== 'undefined') {
                    text_type.push(item.text);
                }
                }); 
                break;

              default:
                //text_type = quiz['step-2'].currentElem.text; 
                currentElem.forEach(function(item, i, arr){
                if (typeof item.value !== 'undefined' && item.value == quiz_var_type_arr[quiz_var_type_arr_i].value && typeof item.text !== 'undefined') {
                    text_type.push(item.text);
                }
                }); 
                break;
            }     
            // if(currentAction == 'simple')  {
                  
            // } else {
               
            // }
        }
      }
    }
  }
  text_type = text_type.join(', ');
  
  if(quiz['step-1']['type']=="stom"){
	  if (typeof quiz_var_businessstom !== 'undefined' && quiz_var_businessstom) {
      let stepCon = quiz_results['quiz_var_businessstom']['step'];
    if (typeof quiz[stepCon]['list']['items'] !== 'undefined') {
      quiz[stepCon]['list']['items'].forEach(function(item, i, arr) {
        if (typeof item.value !== 'undefined' && item.value == quiz_var_businessstom.val() && typeof item.text !== 'undefined') {
          text_businessstom += item.text;
        }
      });
    }
  }
  if(typeof quiz_var_city !== 'undefined' && quiz_var_city) {
    let stepCon = quiz_results['quiz_var_city']['step'];
    if (typeof quiz[stepCon]['list']['items'] !== 'undefined') {
      quiz[stepCon]['list']['items'].forEach(function(item, i, arr) {
        if (typeof item.value !== 'undefined' && item.value == quiz_var_city.val() && typeof item.text !== 'undefined') {
          text_city += item.text;
        }
      });
    }
  }
  if (typeof quiz_var_xray !== 'undefined' && quiz_var_xray) {
      let stepCon = quiz_results['quiz_var_xray']['step'];
    if (typeof quiz[stepCon]['list']['items'] !== 'undefined') {
      quiz[stepCon]['list']['items'].forEach(function(item, i, arr) {
        if (typeof item.value !== 'undefined' && item.value == quiz_var_xray.val() && typeof item.text !== 'undefined') {
          text_xray += item.text;
        }
      });
    }
  }
  if (typeof quiz_var_conclusion !== 'undefined' && quiz_var_conclusion) {
    let stepCon = quiz_results['quiz_var_conclusion']['step'];
    if (typeof quiz[stepCon]['list']['items'] !== 'undefined') {
      quiz[stepCon]['list']['items'].forEach(function(item, i, arr) {
        if (typeof item.value !== 'undefined' && item.value == quiz_var_conclusion.val() && typeof item.text !== 'undefined') {
          text_conclusion += item.text;
        }
      });
    }
  }
  
    
  
  

//console.log(text_businessstom)
//console.log(text_city)
//console.log(text_xray)
//console.log(text_conclusion)
//console.log(quiz_results)
  
  $('#quizform-businessstom').val(text_businessstom);
  $('#quizform-city').val(text_city);
  $('#quizform-xray').val(text_xray);
  $('#quizform-conclusion').val(text_conclusion);
  
  }else{

  if (typeof quiz_var_room !== 'undefined' && quiz_var_room) {
      let stepCon = quiz_results['quiz_var_room']['step'];
    if (typeof quiz[stepCon]['list']['items'] !== 'undefined') {
      quiz[stepCon]['list']['items'].forEach(function(item, i, arr) {
        if (typeof item.value !== 'undefined' && item.value == quiz_var_room && typeof item.text !== 'undefined') {
          text_room += item.text;
        }
      });
    }
  }
  if (typeof quiz_var_type !== 'undefined' && quiz_var_type) {
      let stepCon = quiz_results['quiz_var_type']['step'];
    if (typeof quiz[stepCon]['list']['items'] !== 'undefined') {
      quiz[stepCon]['list']['items'].forEach(function(item, i, arr) {
        if (typeof item.value !== 'undefined' && item.value == quiz_var_type.val() && typeof item.text !== 'undefined') {
          text_type = item.text;
        }
      });
    }
  }
    
  if (typeof quiz_var_conclusion !== 'undefined' && quiz_var_conclusion) {
    let stepCon = quiz_results['quiz_var_conclusion']['step'];
    if (typeof quiz[stepCon]['list']['items'] !== 'undefined') {
      quiz[stepCon]['list']['items'].forEach(function(item, i, arr) {
        if (typeof item.value !== 'undefined' && item.value == quiz_var_conclusion.val() && typeof item.text !== 'undefined') {
          text_conclusion += item.text;
        }
      });
    }
  }
  if(typeof quiz_var_city !== 'undefined' && quiz_var_city) {
    let stepCon = quiz_results['quiz_var_city']['step'];
    if (typeof quiz[stepCon]['list']['items'] !== 'undefined') {
      quiz[stepCon]['list']['items'].forEach(function(item, i, arr) {
        if (typeof item.value !== 'undefined' && item.value == quiz_var_city.val() && typeof item.text !== 'undefined') {
          text_city += item.text;
        }
      });
    }
  }

//console.log(text_business)
//console.log(text_type)
//console.log(text_room)
//console.log(text_conclusion)
//console.log(text_city)
//console.log(quiz_results)
  $('#quizform-business').val(text_business);
  $('#quizform-type').val(text_type);
  $('#quizform-room').val(text_room);
  $('#quizform-conclusion').val(text_conclusion);
  $('#quizform-city').val(text_city);
}
}

function quiz_step_n(){
  if (typeof quiz === 'object') {
    var step_number = quiz['step-n']['step-number'] || 0;
    var title = quiz['step-n']['title'] || '';
    var step_count = quiz['step-n']['step-count'] || 0;
    var coupon_text = quiz['step-n'].coupon.text || '';
    var coupon_discount = quiz['step-n'].coupon.discount || '';
    var list = quiz['step-n'].list || null;
    var next_step = quiz['step-n'].next || null;
    var prev_step = quiz['step-n'].prev || null;

    var btn_business = null;
    var btn_price = null;
    var btn_roomassistanceprice = null;
    var btn_roomassistance = null;
    var btn_assistanceprice = null;
    var btn_assistance = null;

    var checkbox = '';
    if (list) {
      for(one in list.items){
        var one_name = list.name || '';
        var one_text = list.items[one].text || '';
        var one_value = list.items[one].value || '';
        var one_checked = '';
        if (checkbox === '') {
          one_checked = 'checked';
        }
        if (one_checked === 'checked') {
          btn_business = one_value;
        }
        var one_data = {
          'next' : list.items[one].next,
          'business' : one_value,
          'price' : null,
          'assistanceprice' : null,
          'roomassistanceprice' : null,
        }
        if (list.type === 'radio') {
          checkbox += custom_radio(one_name, one_value, one_text, one_checked, one_data);
        } else if (list.type === 'checkbox') {
          checkbox += custom_checkbox(one_name, one_value, one_text, one_checked, one_data);
        }
      }
    }

    step_number = LdgZero(step_number);
    step_count = '/ ' + LdgZero(step_count);

    $('.b-quiz__item-title').html(title);
    $('.b-quiz__counter-active').html(step_number);
    $('.b-quiz__counter-all').html(step_count);
    $('.b-quiz__coupon-text').html(coupon_text);
    $('.b-quiz__coupon-num').html(coupon_discount);

    $('.b-quiz__btn.quiz-btn-prev').attr('data-business', btn_business).attr('data-price', btn_price).attr('data-roomassistanceprice', btn_roomassistanceprice).attr('data-roomassistance', btn_roomassistance).attr('data-assistanceprice', btn_assistanceprice).attr('data-assistance', btn_assistance);
    $('.b-quiz__btn.quiz-btn-next').attr('data-business', btn_business).attr('data-price', btn_price).attr('data-roomassistanceprice', btn_roomassistanceprice).attr('data-roomassistance', btn_roomassistance).attr('data-assistanceprice', btn_assistanceprice).attr('data-assistance', btn_assistance).attr('data-step', '0');

    if (next_step) {
      $('.b-quiz__btn.quiz-btn-next').attr('data-next', next_step).removeClass('hidden');
    } else {
      $('.b-quiz__btn.quiz-btn-next').attr('data-next', '').addClass('hidden');
    }

    if (prev_step) {
      $('.b-quiz__btn.quiz-btn-prev').attr('data-prev', prev_step).removeClass('hidden');
    } else {
      $('.b-quiz__btn.quiz-btn-prev').attr('data-prev', '').addClass('hidden');
    }

    $('.b-quiz__progress .progress-bar').css('width', '0').attr('aria-valuenow', '0');
    $('.b-quiz__progress-num').html('0%');

    $('.b-quiz__form-checkbox-list').html(checkbox);

    quiz_var_business = null;
    quiz_var_type = null;
    quiz_var_room = null;
    quiz_var_conclusion = null;
	quiz_var_city = null;
  }
}

function quiz_step_0(business){
  if (typeof quiz === 'object') {
    var step_number = quiz['step-0'][business]['step-number'] || 0;
    var title = quiz['step-0'][business]['title'] || '';
    var step_count = quiz['step-0'][business]['step-count'] || 0;

    if (step_count == 0) {
      progress = 0;
    } else {
      var progress = (step_number - 1) / step_count * 100;
      progress = Math.ceil(progress);
      if (progress > 100) {
        progress = 100;
      } else if (progress < 0) {
        progress = 0;
      }
    }

    var roomassistanceprice = quiz['step-0'][business].roomassistanceprice || null;
    var assistanceprice = quiz['step-0'][business].assistanceprice || null;
    var coupon_text = quiz['step-0'][business].coupon.text || '';
    var coupon_discount = quiz['step-0'][business].coupon.discount || '';
    var list = quiz['step-0'][business].list || null;
    var next_step = quiz['step-0'][business].next || null;
    var prev_step = quiz['step-0'][business].prev || null;
    var btn_price = null;
    var btn_roomassistance = null;
    var btn_assistance = null;

    var checkbox = '';
    if (list) {
      for(one in list.items){
        var one_name = list.name || '';
        var one_text = list.items[one].text || '';
        var one_value = list.items[one].value || '';
        var one_price = list.items[one].price || '';


        var one_checked = '';
        if (checkbox === '') {
          one_checked = 'checked';
        }
        if (one_checked === 'checked') {
          btn_price = one_price;
        }
        var one_data = {
          'next' : list.items[one].next,
          'business' : business,
          'price' : one_price,
          'roomassistanceprice' : roomassistanceprice,
          'assistanceprice' : assistanceprice
        }
        if (list.type === 'radio') {
          checkbox += custom_radio(one_name, one_value, one_text, one_checked, one_data);
        } else if (list.type === 'checkbox') {
          checkbox += custom_checkbox(one_name, one_value, one_text, one_checked, one_data);
        }
      }
    }

    step_number = LdgZero(step_number);
    step_count = '/ ' + LdgZero(step_count);

    $('.b-quiz__item-title').html(title);
    $('.b-quiz__counter-active').html(step_number);
    $('.b-quiz__counter-all').html(step_count);
    $('.b-quiz__coupon-text').html(coupon_text);
    $('.b-quiz__coupon-num').html(coupon_discount);

    $('.b-quiz__btn.quiz-btn-prev').attr('data-business', business).attr('data-price', btn_price).attr('data-roomassistanceprice', roomassistanceprice).attr('data-roomassistance', btn_roomassistance).attr('data-assistanceprice', assistanceprice).attr('data-assistance', btn_assistance);
    $('.b-quiz__btn.quiz-btn-next').attr('data-business', business).attr('data-price', btn_price).attr('data-roomassistanceprice', roomassistanceprice).attr('data-roomassistance', btn_roomassistance).attr('data-assistanceprice', assistanceprice).attr('data-assistance', btn_assistance).attr('data-step', '1');

    if (next_step) {
      $('.b-quiz__btn.quiz-btn-next').attr('data-next', next_step).removeClass('hidden');
    } else {
      $('.b-quiz__btn.quiz-btn-next').attr('data-next', '').addClass('hidden');
    }

    if (prev_step) {
      $('.b-quiz__btn.quiz-btn-prev').attr('data-prev', prev_step).removeClass('hidden');
    } else {
      $('.b-quiz__btn.quiz-btn-prev').attr('data-prev', '').addClass('hidden');
    }

    $('.b-quiz__progress .progress-bar').attr('aria-valuenow', progress);
    progress = progress + '%';
    $('.b-quiz__progress .progress-bar').css({'width' : progress});
    $('.b-quiz__progress-num').html(progress);

    $('.b-quiz__form-checkbox-list').html(checkbox);

    quiz_var_business = business;
    quiz_var_type = null;
    quiz_var_room = null;
    quiz_var_conclusion = null;
	quiz_var_city = null;
  }
}

function quiz_step_1(business, price, roomassistanceprice, assistanceprice){
  if (typeof quiz === 'object') {
    var step_number = quiz['step-1']['step-number'] || 0;
    var title = quiz['step-1']['title'] || '';
    var step_count = quiz['step-1']['step-count'] || 0;


    progress = 0;

    var coupon_text = quiz['step-1'].coupon.text || '';
    var coupon_discount = quiz['step-1'].coupon.discount || '';
    var list = quiz['step-1'].list || null;
    var next_step = quiz['step-1'].next || null;
    var prev_step = quiz['step-1'].prev || null;
    var btn_roomassistance = null;

    var checkbox = '';
    if (list) {
      for(one in list.items){
        var one_name = list.name || '';
        var one_text = list.items[one].text || '';
        var one_value = list.items[one].value || '';
        var one_checked = '';
        if (checkbox === '') {
          one_checked = 'checked';
        }
        if (one_checked === 'checked') {
          btn_roomassistance = list.items[one].roomassistance;
        }
        var one_data = {
          'next' : list.items[one].next,
          'business' : business,
          'roomassistance' : list.items[one].roomassistance,
          'price' : price,
          'roomassistanceprice' : roomassistanceprice,
          'assistanceprice' : assistanceprice,
        }
        if (list.type === 'radio') {
          checkbox += custom_radio(one_name, one_value, one_text, one_checked, one_data);
        } else if (list.type === 'checkbox') {
          checkbox += custom_checkbox(one_name, one_value, one_text, one_checked, one_data);
        }
      }
    }

    step_number = LdgZero(step_number);
    step_count = '/ ' + LdgZero(step_count);

    $('.b-quiz__item-title').html(title);
    $('.b-quiz__counter-active').html(step_number);
    $('.b-quiz__counter-all').html(step_count);
    $('.b-quiz__coupon-text').html(coupon_text);
    $('.b-quiz__coupon-num').html(coupon_discount);

    $('.b-quiz__btn.quiz-btn-prev').attr('data-business', business).attr('data-price', price).attr('data-roomassistanceprice', roomassistanceprice).attr('data-roomassistance', btn_roomassistance).attr('data-assistanceprice', assistanceprice);
    $('.b-quiz__btn.quiz-btn-next').attr('data-business', business).attr('data-price', price).attr('data-roomassistanceprice', roomassistanceprice).attr('data-roomassistance', btn_roomassistance).attr('data-assistanceprice', assistanceprice).attr('data-step', '2');

    if (next_step) {
      $('.b-quiz__btn.quiz-btn-next').attr('data-next', next_step).removeClass('hidden');
    } else {
      $('.b-quiz__btn.quiz-btn-next').attr('data-next', '').addClass('hidden');
    }

    if (prev_step) {
      $('.b-quiz__btn.quiz-btn-prev').attr('data-prev', prev_step).removeClass('hidden');
    } else {
      $('.b-quiz__btn.quiz-btn-prev').attr('data-prev', '').addClass('hidden');
    }

    $('.b-quiz__progress .progress-bar').attr('aria-valuenow', progress);
    progress = progress + '%';
    $('.b-quiz__progress .progress-bar').css({'width' : progress});
    $('.b-quiz__progress-num').html(progress);

    $('.b-quiz__form-checkbox-list').html(checkbox);


    $(".b-quiz__btn.quiz-btn-next").attr("id", `dalee-1-2`),
    $(".b-quiz__form-checkbox-list .b-quiz__form-radio input").each(function (index) {
        $(this).attr("id", `answer-1-${index + 1}`);
    });
  }
}


function quiz_step_2(business, price, roomassistanceprice, roomassistance, assistanceprice){
    const inputChecked = $('.b-quiz input[name="business"]:checked');
    
  if (typeof quiz === 'object') {
    //   if(inputChecked.length != 0) {
    //       quiz_var_business = inputChecked;
    //   }
      if(inputChecked.length == 0 && !quiz_var_business) {
            for (let key in quiz) {
              if(quiz[key].branching == 1) {
                  quiz_step_1(business, price, roomassistanceprice, assistanceprice);
                  return false;
              }
            }
      }
    var step_number,title,step_count,coupon_text,coupon_discount,list,next_step,prev_step,btn_assistance;
    
    if(quiz['step-2']) {
       if(quiz['step-2']['branching'] == '1') {
        inputCheckedValue(quiz['step-2'][quiz_var_business.val()]);
        } else {
            inputCheckedValue(quiz['step-2']);
        } 
    }
    
    
    function inputCheckedValue(quizData) {
         step_number = quizData['step-number'] || 0;
         title = quizData['title'] || '';
         step_count = quizData['step-count'] || 0;
    
        progress = 50;
    
         coupon_text = quizData.coupon.text || '';
         coupon_discount = quizData.coupon.discount || '';
         list = quizData.list || null;
         next_step = quizData.next || null;
         prev_step = quizData.prev || null;
         btn_assistance = null;
    }
    
    // var step_number = quiz['step-2']['step-number'] || 0;
    // var title = quiz['step-2']['title'] || '';
    // var step_count = quiz['step-2']['step-count'] || 0;

    // progress = 50;

    // var coupon_text = quiz['step-2'].coupon.text || '';
    // var coupon_discount = quiz['step-2'].coupon.discount || '';
    // var list = quiz['step-2'].list || null;
    // var next_step = quiz['step-2'].next || null;
    // var prev_step = quiz['step-2'].prev || null;
    // var btn_assistance = null;

    var checkbox = '';
    if (list) {
      for(one in list.items){
        var one_name = list.name || '';
        var one_text = list.items[one].text || '';
        var one_value = list.items[one].value || '';
        var one_checked = '';
        if (checkbox === '') {
          one_checked = 'checked';
        }
        if (one_checked === 'checked') {
          btn_assistance = list.items[one].assistance;
        }
        var one_data = {
          'next' : list.items[one].next,
          'business' : business,
          'roomassistance' : roomassistance,
          'roomassistanceprice' : roomassistanceprice,
          'assistance' : list.items[one].assistance,
          'price' : price,
          'assistanceprice' : assistanceprice
        }
        if (list.type === 'radio') {
          checkbox += custom_radio(one_name, one_value, one_text, one_checked, one_data);
        } else if (list.type === 'checkbox') {
          checkbox += custom_checkbox(one_name, one_value, one_text, one_checked, one_data);
        }
      }
    }

    step_number = LdgZero(step_number);
    step_count = '/ ' + LdgZero(step_count);

    $('.b-quiz__item-title').html(title);
    $('.b-quiz__counter-active').html(step_number);
    $('.b-quiz__counter-all').html(step_count);
    $('.b-quiz__coupon-text').html(coupon_text);
    $('.b-quiz__coupon-num').html(coupon_discount);

    $('.b-quiz__btn.quiz-btn-prev').attr('data-business', business).attr('data-price', price).attr('data-roomassistanceprice', roomassistanceprice).attr('data-roomassistance', roomassistance).attr('data-assistanceprice', assistanceprice).attr('data-assistance', btn_assistance);
    $('.b-quiz__btn.quiz-btn-next').attr('data-business', business).attr('data-price', price).attr('data-roomassistanceprice', roomassistanceprice).attr('data-roomassistance', roomassistance).attr('data-assistanceprice', assistanceprice).attr('data-assistance', btn_assistance).attr('data-step', '3');

    if (next_step) {
      $('.b-quiz__btn.quiz-btn-next').attr('data-next', next_step).removeClass('hidden');
    } else {
      $('.b-quiz__btn.quiz-btn-next').attr('data-next', '').addClass('hidden');
    }

    if (prev_step) {
      $('.b-quiz__btn.quiz-btn-prev').attr('data-prev', prev_step).removeClass('hidden');
    } else {
      $('.b-quiz__btn.quiz-btn-prev').attr('data-prev', '').addClass('hidden');
    }

    $('.b-quiz__progress .progress-bar').attr('aria-valuenow', progress);
    progress = progress + '%';
    $('.b-quiz__progress .progress-bar').css({'width' : progress});
    $('.b-quiz__progress-num').html(progress);

    $('.b-quiz__form-checkbox-list').html(checkbox);
    $(".b-quiz__btn.quiz-btn-next").attr("id", `dalee-2-3`),
    $(".b-quiz__form-checkbox-list .b-quiz__form-radio input").each(function (index) {
        $(this).attr("id", `answer-2-${index + 1}`);
    });
  }
}

function quiz_step_3(business, price, assistanceprice){
  if (typeof quiz === 'object') {
      const inputChecked = $('.b-quiz input[name="type"]:checked');
	  if(quiz['step-1']['type']!="med"){
		quiz_var_type = inputChecked;
	  }
    
    if(quiz['step-3']) {
        var step_number = quiz['step-3']['step-number'] || 0;
        var title = quiz['step-3']['title'] || '';
        var step_count = quiz['step-3']['step-count'] || 0;
        
        var coupon_text = quiz['step-3'].coupon.text || '';
        var coupon_discount = quiz['step-3'].coupon.discount || '';
        var list = quiz['step-3'].list || null;
        var next_step = quiz['step-3'].next || null;
        var prev_step = quiz['step-3'].prev || null;
        var btn_assistance = null;
    }
    
    
    if (step_count == 0) {
      progress = 0;
    } else {
      var progress = step_number / step_count * 100;
      progress = Math.ceil(progress);
      if (progress > 100) {
        progress = 100;
      } else if (progress < 0) {
        progress = 0;
      }
    }

    

    var checkbox = '';
    if (list) {
      for(one in list.items){
        var one_name = list.name || '';
        var one_text = list.items[one].text || '';
        var one_value = list.items[one].value || '';
        var one_checked = '';
        if (checkbox === '') {
          one_checked = 'checked';
        }
        if (one_checked === 'checked') {
          btn_assistance = list.items[one].assistance;
        }
        var one_data = {
          'next' : list.items[one].next,
          'business' : business,
          'assistance' : list.items[one].assistance,
          'price' : price,
          'assistanceprice' : assistanceprice
        }
        if (list.type === 'radio') {
          checkbox += custom_radio(one_name, one_value, one_text, one_checked, one_data);
        } else if (list.type === 'checkbox') {
          checkbox += custom_checkbox(one_name, one_value, one_text, one_checked, one_data);
        }
      }
    }

    step_number = LdgZero(step_number);
    step_count = '/ ' + LdgZero(step_count);

    $('.b-quiz__item-title').html(title);
    $('.b-quiz__counter-active').html(step_number);
    $('.b-quiz__counter-all').html(step_count);
    $('.b-quiz__coupon-text').html(coupon_text);
    $('.b-quiz__coupon-num').html(coupon_discount);

    $('.b-quiz__btn.quiz-btn-prev').attr('data-business', business).attr('data-price', price).attr('data-assistanceprice', assistanceprice).attr('data-assistance', btn_assistance);
    $('.b-quiz__btn.quiz-btn-next').attr('data-business', business).attr('data-price', price).attr('data-assistanceprice', assistanceprice).attr('data-assistance', btn_assistance).attr('data-step', '4');

    if (next_step) {
      $('.b-quiz__btn.quiz-btn-next').attr('data-next', next_step).removeClass('hidden');
    } else {
      $('.b-quiz__btn.quiz-btn-next').attr('data-next', '').addClass('hidden');
    }

    if (prev_step) {
      $('.b-quiz__btn.quiz-btn-prev').attr('data-prev', prev_step).removeClass('hidden');
    } else {
      $('.b-quiz__btn.quiz-btn-prev').attr('data-prev', '').addClass('hidden');
    }

    $('.b-quiz__progress .progress-bar').attr('aria-valuenow', progress);
    progress = progress + '%';
    $('.b-quiz__progress .progress-bar').css({'width' : progress});
    $('.b-quiz__progress-num').html(progress);

    $('.b-quiz__form-checkbox-list').html(checkbox);
    
    
    $(".b-quiz__btn.quiz-btn-next").attr("id", `dalee-3`);
    
    
  }
}

function quiz_step_4(business, price, assistanceprice, assistance, step){
    
//   const inputChecked = $('.b-quiz input[name="conclusion"]:checked');
//   quiz_var_conclusion = inputChecked;

  if (typeof quiz === 'object') {
      const inputChecked = $('.b-quiz input[name="type"]:checked');
      //quiz_var_type = inputChecked;
    
    if(quiz['step-4']) {
        var step_number = quiz['step-4']['step-number'] || 0;
        var title = quiz['step-4']['title'] || '';
        var step_count = quiz['step-4']['step-count'] || 0;
        
        var coupon_text = quiz['step-4'].coupon.text || '';
        var coupon_discount = quiz['step-4'].coupon.discount || '';
        var list = quiz['step-4'].list || null;
        var next_step = quiz['step-4'].next || null;
        var prev_step = quiz['step-4'].prev || null;
        var btn_assistance = null;
    }
    
    
    if (step_count == 0) {
      progress = 0;
    } else {
      var progress = step_number / step_count * 100;
      progress = Math.ceil(progress);
      if (progress > 100) {
        progress = 100;
      } else if (progress < 0) {
        progress = 0;
      }
    }

    

    var checkbox = '';
    if (list) {
      for(one in list.items){
        var one_name = list.name || '';
        var one_text = list.items[one].text || '';
        var one_value = list.items[one].value || '';
        var one_checked = '';
        if (checkbox === '') {
          one_checked = 'checked';
        }
        if (one_checked === 'checked') {
          btn_assistance = list.items[one].assistance;
        }
        var one_data = {
          'next' : list.items[one].next,
          'business' : business,
          'assistance' : list.items[one].assistance,
          'price' : price,
          'assistanceprice' : assistanceprice
        }
        if (list.type === 'radio') {
          checkbox += custom_radio(one_name, one_value, one_text, one_checked, one_data);
        } else if (list.type === 'checkbox') {
          checkbox += custom_checkbox(one_name, one_value, one_text, one_checked, one_data);
        }
      }
    }

    step_number = LdgZero(step_number);
    step_count = '/ ' + LdgZero(step_count);

    $('.b-quiz__item-title').html(title);
    $('.b-quiz__counter-active').html(step_number);
    $('.b-quiz__counter-all').html(step_count);
    $('.b-quiz__coupon-text').html(coupon_text);
    $('.b-quiz__coupon-num').html(coupon_discount);

    $('.b-quiz__btn.quiz-btn-prev').attr('data-business', business).attr('data-price', price).attr('data-assistanceprice', assistanceprice).attr('data-assistance', btn_assistance);
    $('.b-quiz__btn.quiz-btn-next').attr('data-business', business).attr('data-price', price).attr('data-assistanceprice', assistanceprice).attr('data-assistance', btn_assistance).attr('data-step', '5');

    if (next_step) {
      $('.b-quiz__btn.quiz-btn-next').attr('data-next', next_step).removeClass('hidden');
    } else {
      $('.b-quiz__btn.quiz-btn-next').attr('data-next', '').addClass('hidden');
    }

    if (prev_step) {
      $('.b-quiz__btn.quiz-btn-prev').attr('data-prev', prev_step).removeClass('hidden');
    } else {
      $('.b-quiz__btn.quiz-btn-prev').attr('data-prev', '').addClass('hidden');
    }

    $('.b-quiz__progress .progress-bar').attr('aria-valuenow', progress);
    progress = progress + '%';
    $('.b-quiz__progress .progress-bar').css({'width' : progress});
    $('.b-quiz__progress-num').html(progress);

    $('.b-quiz__form-checkbox-list').html(checkbox);
    
    
    $(".b-quiz__btn.quiz-btn-next").attr("id", `dalee-4`);
    
    
  }

  
}
function quiz_step_5(business, price, assistanceprice, assistance, step,fin){
    
//   const inputChecked = $('.b-quiz input[name="conclusion"]:checked');
//   quiz_var_conclusion = inputChecked;
var total = 0;
  if (typeof price !== 'undefined') {
    price = parseInt(price);
    total += price;
  }
  if (typeof assistance !== 'undefined' && assistance == 1) {
    if (typeof assistanceprice !== 'undefined') {
      assistanceprice = parseInt(assistanceprice);
      total += assistanceprice;
    }
  }

  if (typeof step !== 'undefined') {
    step = parseInt(step);
    var step_number = 0;
     step_number = step;
    step_number = LdgZero(step_number);
    var step_count = '/ ' + step_number;
    $('.b-quiz__counter-active').html(step_number);
    $('.b-quiz__counter-all').html(step_count);
  }

  $('.b-quiz__final-total').html(total);
  $('.b-quiz__coupon-num').html('10');

  $('.b-quiz__progress .progress-bar').css('width', '100%').attr('aria-valuenow', '100');
  $('.b-quiz__progress-num').html('100%');

  if (total > 0) {
    $('.b-quiz__item-undertitle').removeClass('hidden');
  } else {
    $('.b-quiz__item-undertitle').addClass('hidden');
  }

  $('.b-quiz__tabs').addClass('hidden');
  $('.b-quiz__final').removeClass('hidden');
  quiz_fill_hidden_fields();
}


$(document).on('click', '.quiz-btn-next, .quiz-btn-prev', function(){
    let inputChecked,
    currectStep =`step-${(+$('.b-quiz__btn.quiz-btn-next').attr('data-step') - 1)}`;
    console.log(quiz_results);
	var type = quiz['step-2']['type'];

	if(type == "stom"){
		if($('.b-quiz input[name="businessstom"]:checked').length > 0) {
        inputChecked = $('.b-quiz input[name="businessstom"]:checked');
        quiz_var_businessstom = inputChecked;
        quiz_results['quiz_var_businessstom']['value'] = inputChecked;
        quiz_results['quiz_var_businessstom']['step'] = currectStep;
    }
    
    if($('.b-quiz input[name="city"]:checked').length > 0) {
        inputChecked = $('.b-quiz input[name="city"]:checked');
        quiz_var_city = inputChecked;
        quiz_results['quiz_var_city']['value'] = inputChecked;
        quiz_results['quiz_var_city']['step'] = currectStep;
    }
	if($('.b-quiz input[name="xray"]:checked').length > 0) {
        inputChecked = $('.b-quiz input[name="xray"]:checked');
        quiz_var_xray = inputChecked;
        quiz_results['quiz_var_xray']['value'] = inputChecked;
        quiz_results['quiz_var_xray']['step'] = currectStep;
    }
    if($('.b-quiz input[name="conclusion"]:checked').length > 0) {
        inputChecked = $('.b-quiz input[name="conclusion"]:checked');
        quiz_var_conclusion = inputChecked;
        quiz_results['quiz_var_conclusion']['value'] = inputChecked;
        quiz_results['quiz_var_conclusion']['step'] = currectStep;
    }
	}
	else{
    if($('.b-quiz input[name="business"]:checked').length > 0) {
        inputChecked = $('.b-quiz input[name="business"]:checked');
        if(inputChecked.length != 0) {
              quiz_var_business = inputChecked;
              
              quiz_results['quiz_var_business']['value'] = inputChecked;
              quiz_results['quiz_var_business']['step'] = currectStep;
        }
    }
    
    if($('.b-quiz input[name="type"]:checked').length > 0) {
        inputChecked = $('.b-quiz input[name="type"]:checked');
        quiz_var_type = inputChecked;
        quiz_results['quiz_var_type']['value'] = inputChecked;
        quiz_results['quiz_var_type']['step'] = currectStep;
    }
    
    if($('.b-quiz input[name="conclusion"]:checked').length > 0) {
        inputChecked = $('.b-quiz input[name="conclusion"]:checked');
        quiz_var_conclusion = inputChecked;
        quiz_results['quiz_var_conclusion']['value'] = inputChecked;
        quiz_results['quiz_var_conclusion']['step'] = currectStep;
    }
	if($('.b-quiz input[name="city"]:checked').length > 0) {
        inputChecked = $('.b-quiz input[name="city"]:checked');
        quiz_var_city = inputChecked;
        quiz_results['quiz_var_city']['value'] = inputChecked;
        quiz_results['quiz_var_city']['step'] = currectStep;
    }
    if($('.b-quiz input[name="room"]:checked').length > 0) {
        inputChecked = $('.b-quiz input[name="room"]:checked');
        quiz_var_conclusion = inputChecked;
        quiz_results['quiz_var_room']['value'] = inputChecked;
        quiz_results['quiz_var_room']['step'] = currectStep;
    }
	}

  var data_next = $(this).attr('data-next') || null;

  if (!data_next) { 
    if($(this).hasClass('quiz-btn-prev')) {
      data_next = $(this).attr('data-prev') || null;
    }
  }

  var business = $(this).attr('data-business') || null;
  var price = $(this).attr('data-price') || null;
  var roomassistanceprice = $(this).attr('data-roomassistanceprice') || null;
  var roomassistance = $(this).attr('data-roomassistance') || null;
  var assistanceprice = $(this).attr('data-assistanceprice') || null;
  var assistance = $(this).attr('data-assistance') || null;
  var step = $(this).attr('data-step') || null;

  if ($('.b-quiz__form-radio input[name="activity"]').length > 0) {
    quiz_var_type = $('.b-quiz__form-radio input[name="activity"]:checked').val();
    quiz_results['quiz_var_type']['value'] = quiz_var_type;
    quiz_results['quiz_var_type']['step'] = currectStep;
  } else if ($('.b-quiz__form-checkbox input[name="activity"]').length > 0) {
    var quiz_var_type_arr = new Array();
    $('.b-quiz__form-checkbox input[name="activity"]:checked').each(function(){
      var quiz_var_type_arr_one = $(this).val();
      quiz_var_type_arr.push(quiz_var_type_arr_one);
    });
    quiz_var_type = quiz_var_type_arr.join(',');
    
    quiz_results['quiz_var_type']['value'] = quiz_var_type_arr;
    quiz_results['quiz_var_type']['step'] = currectStep;
  }
  if ($('.b-quiz__form-radio input[name="room"]').length > 0) {
    quiz_var_room = $('.b-quiz__form-radio input[name="room"]:checked').val();
  }
  if ($('.b-quiz__form-radio input[name="conclusion"]').length > 0) {
    quiz_var_conclusion = $('.b-quiz__form-radio input[name="conclusion"]:checked');
  }
  if ($('.b-quiz__form-radio input[name="city"]').length > 0) {
    quiz_var_city = $('.b-quiz__form-radio input[name="city"]:checked');
  }
  if ($('.b-quiz__form-radio input[name="businessstom"]').length > 0) {
    quiz_var_businessstom = $('.b-quiz__form-radio input[name="businessstom"]:checked');
  }
  if ($('.b-quiz__form-radio input[name="xray"]').length > 0) {
    quiz_var_xray = $('.b-quiz__form-radio input[name="xray"]:checked');
  }

  if (data_next == 'step-n') {

    quiz_step_n();

  } else if (data_next == 'step-0') {

    quiz_step_0(business);

  } else if (data_next == 'step-1') {

    quiz_step_1(business, price, roomassistanceprice, assistanceprice);

  } else if (data_next == 'step-2') {


quiz_step_2(business, price, roomassistanceprice, roomassistance, assistanceprice);
    // quiz_var_type = 1; // стоматология
    // if (quiz_var_type) {
    //   quiz_step_2(business, price, roomassistanceprice, roomassistance, assistanceprice);
    // }

  } else if (data_next == 'step-3') {
     quiz_step_3(business, price, roomassistanceprice, roomassistance, assistanceprice, assistance, step);
      
  } else if (data_next == 'step-4') {
      
    quiz_step_4(business, price, assistanceprice, assistance, step)
  }else if(data_next == 'final'){
	  let fin_number = 4;
	   if($('.b-quiz__btn.quiz-btn-next').attr('data-step') == 3) {
          fin_number = 3
      }
	   quiz_step_5(business, price, assistanceprice, assistance, step,fin_number);
  }

});


$(document).on('click', '.b-quiz__form-radio input:checked', function(){
  $(this).trigger('change');
});


$(document).on('change', '.b-quiz__form-radio input', function(){
  var name = $(this).prop('name') || null;
  if (name) {
    var selector = '.b-quiz__form-radio input[name="'+name+'"]:checked';
    var input = $(selector);
    if (input.length > 0) {
      var business = input.attr('data-business') || null;
      var price = input.attr('data-price') || null;
      var assistanceprice = input.attr('data-assistanceprice') || null;
      var roomassistanceprice = input.attr('data-roomassistanceprice') || null;
      var roomassistance = input.attr('data-roomassistance') || null;
      var assistance = input.attr('data-assistance') || null;
      var next = input.attr('data-next') || null;

      $('.b-quiz__btn.quiz-btn-prev').attr('data-business', business).attr('data-price', price).attr('data-roomassistanceprice', roomassistanceprice).attr('data-roomassistance', roomassistance).attr('data-assistanceprice', assistanceprice).attr('data-assistance', assistance);
      $('.b-quiz__btn.quiz-btn-next').attr('data-business', business).attr('data-price', price).attr('data-roomassistanceprice', roomassistanceprice).attr('data-roomassistance', roomassistance).attr('data-assistanceprice', assistanceprice).attr('data-assistance', assistance).attr('data-next', next);
      
      if($(this).prop('name') !== 'room' && $(this).prop('name') !== 'conclusion' && $(this).prop('name') !== 'city'){
        //$('.b-quiz__btn.quiz-btn-next').click();
      }
    }
  }
});


$(document).on('change', '.b-quiz__form-checkbox input', function(){
  var name = $(this).prop('name') || null;
  if (name) {
    var selector = '.b-quiz__form-checkbox input[name="'+name+'"]:checked';
    var input = $(selector);
    if (input.length > 0) {

      var business = null;
      var price = null;
      var roomassistanceprice = null;
      var roomassistance = null;
      var assistanceprice = null;
      var assistance = null;
      var next = null;
      var price_total = 0;

      input.each(function(){
        business = $(this).attr('data-business') || null;
        price = $(this).attr('data-price') || null;
        roomassistanceprice = $(this).attr('data-roomassistanceprice') || null;
        roomassistance = $(this).attr('data-roomassistance') || null;
        assistanceprice = $(this).attr('data-assistanceprice') || null;
        assistance = $(this).attr('data-assistance') || null;
        next = $(this).attr('data-next') || null;
        if (price) {
          price = parseInt(price);
          price_total += price;
        }
      });

      $('.b-quiz__btn.quiz-btn-prev').attr('data-business', business).attr('data-price', price_total).attr('data-roomassistanceprice', roomassistanceprice).attr('data-roomassistance', roomassistance).attr('data-assistanceprice', assistanceprice).attr('data-assistance', assistance);
      $('.b-quiz__btn.quiz-btn-next').attr('data-business', business).attr('data-price', price_total).attr('data-roomassistanceprice', roomassistanceprice).attr('data-roomassistance', roomassistance).attr('data-assistanceprice', assistanceprice).attr('data-assistance', assistance).attr('data-next', next);
    }
  }
});


quiz_step_1('med', 100000, 50000, 70000);

/* end --- QUIZ --- end */


/* --- Навигация между "Кейсы" --- */

$(document).on('click', '.b-cases__slider-next', function(){
	var current = Number(document.getElementsByClassName("b-cases__slider-pages-current")[0].innerText);
	var last = Number(document.getElementsByClassName("b-cases__slider-pages-count")[0].innerText);
	if(current < last){
		document.getElementsByClassName("slide")[current-1].style.display = "none";
		document.getElementsByClassName("slide")[current].style.display = "block";
		if(current < 9){
			current += 1;
			current = "0" + String(current);
		}else{
			current += 1;
		}
		document.getElementsByClassName("b-cases__slider-pages-current")[0].innerText = current;
	}
});
$(document).on('click', '.b-cases__slider-prev', function(){
	var current = Number(document.getElementsByClassName("b-cases__slider-pages-current")[0].innerText);
	var last = Number(document.getElementsByClassName("b-cases__slider-pages-count")[0].innerText);
	if(current != 1){
		document.getElementsByClassName("slide")[current-1].style.display = "none";
		document.getElementsByClassName("slide")[current-2].style.display = "block";
		if(current < 11){
			current -= 1;
			current = "0" + String(current);
		}else{
			current -= 1;
		}
		document.getElementsByClassName("b-cases__slider-pages-current")[0].innerText = current;
	}
});
/* end --- Навигация между "Кейсы" --- end */

 /*  Initialize Swiper */
if ($('.slide').length > 0) {
    let myswiper = 1;
	let myswiper1 = 2;
	let button_ = 1;
	for(let i=0;i<$('.slide').length;i++){
		if(i == 0){
			var swiper = new Swiper(".mySwiper", {
				spaceBetween: 10,
				slidesPerView: 4,
				freeMode: true,
				watchSlidesProgress: true,
			});
			var swiper2 = new Swiper(".mySwiper"+myswiper1, {
				spaceBetween: 10,
				navigation: {
					nextEl: ".swiper-button-next",
					prevEl: ".swiper-button-prev",
				},
				thumbs: {
					swiper: swiper,
				},
			});
			myswiper1+=1;
		}else{
			var swiper = new Swiper(".mySwiper"+myswiper, {
				spaceBetween: 10,
				slidesPerView: 4,
				freeMode: true,
				watchSlidesProgress: true,
			});
			var swiper2 = new Swiper(".mySwiper"+myswiper1, {
				spaceBetween: 10,
				navigation: {
					nextEl: ".swiper-button-next"+button_,
					prevEl: ".swiper-button-prev"+button_,
				},
				thumbs: {
					swiper: swiper,
				},
			});
			button_++;
			myswiper1 +=2;
			if(i != 1){
				myswiper +=2;
				
			}else{
				myswiper +=3;
			}
		}
	}
	
}
 /*  Initialize Swiper */
 
 
  /*  faq */
$(document).on('click', '.faq-block-flex', function(){
	var faq = this.parentElement.children[1];
	if(faq.classList.contains('faq-show')){
		faq.classList.remove("faq-show");
		this.children[0].src = "img/faq/faq.webp"
		$(".faq-hidden").eq($(".faq-block-flex").index(this)).slideToggle("slow");
	}else{
		faq.classList.add("faq-show");
		this.children[0].src = "img/faq/faq-minus.webp";
		$(".faq-hidden").eq($(".faq-block-flex").index(this)).slideToggle("slow");
	}
});
  /*  faq */
  
 //team
 
 $(document).on('click', '.b-team__hide_or_show', function(){
	 console.log($('.b-team__hide_or_show').index(this));
	 console.log(this.dataset.show);
	 if(this.dataset.show == 0){
		 this.innerHTML = "Свернуть";
		 $(".b-team__info-hide").eq($(".b-team__hide_or_show").index(this)).slideToggle("slow");
		  $(".b-team__prof-comp").eq($(".b-team__hide_or_show").index(this)).slideToggle("slow");
		 this.dataset.show = 1;
		 this.classList.add("b-team__hide_or_show-hide");
	 }else{
		 this.innerHTML = "Подробнее";
		$(".b-team__info-hide").eq($(".b-team__hide_or_show").index(this)).slideToggle("slow");
		  $(".b-team__prof-comp").eq($(".b-team__hide_or_show").index(this)).slideToggle("slow");
		 this.dataset.show = 0;
		 this.classList.remove("b-team__hide_or_show-hide");
	 }
 });
 //team
 
 //mobile faq
  $(document).on('click', '.faq-mobile-button', function(){
	  $(".hidden-mobile-faq").slideToggle("slow");
	  if(this.dataset.status == 0){
		  this.innerHTML = "Скрыть часть вопросов";
		  this.dataset.status = 1;
	  }else{
		  this.innerHTML = "Показать еще вопросы";
		  this.dataset.status = 0;
	  }
  });
 //mobile faq
 
 //delete input phone
 let customInput = $('.custom-input-email');
 let lengthCustomInput = customInput.length;
 for(let i=0;i<lengthCustomInput;i++){customInput[i].style="display: none;"};
 //delete input phone