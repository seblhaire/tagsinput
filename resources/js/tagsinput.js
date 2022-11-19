var Tagsinput = {
  maindiv: null,
  mainid: null,
  taglist: null,
  taglistid: null,
  autocompleter:  null,
  dragelement: null,
  dragindex: -1,
  dragtag: null,
  tagevents: {
    dragstart: function(e) {
      self = e.data.self;
      self.dragelement = jQuery(this);
      self.dragindex = jQuery(this).index();
      self.dragtag = jQuery(this).children(); //copie du tag
    },
    // on passe sur un el draggable
    dragenter: function(e) {
      e.preventDefault();
      jQuery(this).css('background-color','#c9c8be !important');
    },
    // on quitte un el draggable
    dragleave: function() {
      jQuery(this).css('background-color','');
    },
    // declenche tant qu on a pas lache l el
    dragover: function(e) {
      e.preventDefault();
    },
    // lache elt
    drop: function(e) {
      self = e.data.self;
      if (self.dragelement.parents('div').attr('id') != self.divthirdid || jQuery(this).index() == self.dragindex){
        return;
      }
      jQuery(this).css('background-color','');
      if (jQuery(this).index() < self.dragindex){
        var li = jQuery('<li/>')
          .attr('draggable', true)
          .on(self.tagevents, {self : self})
          .append(self.dragtag)
          .insertBefore(jQuery(this));
      }else{
        var li = jQuery('<li/>')
          .attr('draggable', true)
          .on(self.tagevents, {self : self})
          .append(self.dragtag)
          .insertAfter(jQuery(this));
      }
      self.dragelement.remove();
      self.fillinput();
      if (self.options.tagaddcallback != null){
        self.options.tagaddcallback(self.dragtag, self.dragtag.data('tagdata'), self);
      }
    },
    // fin du drag (même sans drop)
    dragend: function() {
    }
  },
  init: function(maindiv, options){
    this.maindiv = jQuery(maindiv);
    this.mainid = this.maindiv.attr('id');
    this.taglistid = this.mainid + '_taglist';
    this.taglist = jQuery('#' + this.taglistid);
    if (this.taglist.prop('tagName') != 'UL') throw 'not a UL';
    this.acid = this.mainid + '_ac';
    this.autocompleter = jQuery('#' + this.acid);
    this.options = options;
  },
  hasValue: function(data){
    if (this.options.checkunicity){
      var field = this.options.field;
      var valtocheck = data[field];
      return this.taglist.children().filter(function(idx, elt){ return jQuery(elt).children('span').data('tagdata')[field]== valtocheck}).length > 0;
    }else{
      return false;
    }
  },
  addtolist: function(varia){
    if (typeof varia === 'object'){
      if (Array.isArray(varia)){
        for (var i = 0; i < varia.length; i++){
          var el = varia[i];
          if (typeof el != 'object'){
            jQuery.error('Not object');
          }
          if (!this.hasValue(el)){
            this.buildtag(el);
          }
        }
      }else{
        if (!this.hasValue(varia)){
          this.buildtag(varia);
        }
      }
    }else{
      jQuery.error('Add: Bad init values');
    }
  },
  buildtag: function(data){
    var li = jQuery('<li></li>')
      .attr('draggable', true)
      .on(this.tagevents, {self : this});
    var removelink = jQuery('<a></a>')
      .attr('href', '#')
      .append(
        jQuery('<i></i>').addClass(this.options.tagremovebtnclass)
    )
    tagclass = data[this.options.tagclasselement] !== undefined ? data[this.options.tagclasselement] : this.options.tagclass;
    var tag = jQuery('<span></span>')
      .addClass('badge ' + tagclass)
      .data('tagdata', data)
      .html(data[this.options.taglabelelement])
      .append(removelink);
    removelink.on('click', {li: li, data: data, self: this, tag: tag}, function(e){
      e.preventDefault();
      e.data.li.remove();
      e.data.self.fillinput();
      if (e.data.self.options.tagremovecallback != null){
        e.data.self.options.tagremovecallback(e.data.tag, e.data.data, e.data.self);
      }
    });
    li.append(tag);
    this.taglist.append(li);
    this.fillinput();
    if (this.options.tagaddcallback != null){
      this.options.tagaddcallback(tag, data, this);
    }
  },
  reset: function(){
    this.taglist.html('');
  },
  count: function(){
    return this.taglist.children().length;
  },
  getArrayValues: function(){
    var res = new Array();
    var field = this.options.field;
    this.taglist.find('span').each(function(i,el){
      res.push(jQuery(el).data('tagdata')[field]);
    });
    return res;
  },
  getCommaSepValues: function(){
    var res = '';
    var field = this.options.field;
    this.taglist.find('span').each(function(i,el){
      if (res.length > 0){
          res += ',';
      }
      res += jQuery(el).data('tagdata')[field];
    });
    return res;
  },
  fillinput: function(){
    if (this.options.hiddeninput){
      jQuery('#' + this.mainid + '-hidden').val(this.getCommaSepValues());
    }
  },
  serialize: function(sChamp){
    var str ='';
    var field = this.options.field;
    this.taglist.find('span').each(function(i,el){
      if (i > 0){
        str += '&';
      }
      str += sChamp + '[]=' + jQuery(el).data('tagdata')[field];
    });
    return str;
  }
}

if (typeof Object.create !== 'function') {
	Object.create = function(o) {
		function F() { } // optionally move this outside the declaration and into a closure if you need more speed.
		F.prototype = o;
		return new F();
	};
}
// table builder function
(function(jQuery) {
	/* Create plugin */
	jQuery.fn.tagsinput = function(options)  {
		return this.each(function() {
			var element = jQuery(this);
			if (element.prop('tagName') != 'DIV') throw 'not a DIV';
			// Return early if this element already has a plugin instance
			if (element.data('tagsinput')) return element.data('tagsinput');
			var tagsinput = Object.create(Tagsinput);
			tagsinput.init(this, options);
			// pass options to plugin constructor
			element.data('tagsinput', tagsinput);
		});
	};
})(jQuery);
