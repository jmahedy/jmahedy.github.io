"use strict";define(["jquery"],function(s){function t(t,e){this.$el=t,this.defaults={selectors:{searchInput:'input[name="q"]',noJsInput:'input[name="nojs"]'},class:{errorSearchInput:"search__input--error-search"},dtmNavLevel:"navLevel",dtmPageName:"pageName"},this.settings=s.extend({},this.defaults,e)}return t.prototype={init:function(){return!!this.$el.length&&(this.$searchInput=this.$el.find(this.settings.selectors.searchInput),this.$el.find(this.settings.selectors.noJsInput).remove(),this.bindEvents(),this)},bindEvents:function(){this.$el.on("submit",this.onFormSubmit.bind(this))},onFormSubmit:function(t){t.preventDefault(),this.$searchInput.hasClass(this.settings.class.errorSearchInput)||this.savePageName(),window.location=this.$el.attr("action")+"#"+this.$searchInput.attr("name")+"="+encodeURIComponent(this.$searchInput.val())},savePageName:function(){void 0!==window.digitalData&&void 0!==window.digitalData.page&&sessionStorage.setItem(this.settings.dtmPageName,this.getPageName(window.digitalData.page))},getPageName:function(t){var e=[];for(var s in t){var n=t[s];0===s.indexOf(this.settings.dtmNavLevel)&&e.push(n)}return e.join(":")}},t});