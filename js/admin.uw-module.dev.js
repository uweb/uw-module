var ModularPages = ModularPages || {}

ModularPages.Module = Backbone.Model.extend({

  defaults : {
      id    : null,
      title : null,
      text  : null,
      link  : null,
      dark : null,
      template: 'white',
      image : '/wp-content/plugins/uw-module/assets/placeholder.png',
      mobileimage : '/wp-content/plugins/uw-module/assets/placeholder-mobile.png',
      overlayimage : '/wp-content/plugins/uw-module/assets/placeholder-overlay.png',
      side : 'left',
      overlay : 'no',
      location : 'right:0; bottom:0;'
  },

})

ModularPages.Modules = Backbone.Collection.extend({

  model : ModularPages.Module,

  parameters :
  {
    action : 'get_current_uw_module'
  },


  defaults: {
    src : '',
  },

  url : function()
  {
    return ajaxurl + '?' + jQuery.param( _.extend( this.parameters, { id : jQuery('#post_ID').val() } ) )
  },

  initialize: function()
  {
    this.fetch()
  }

})


ModularPages.View = Backbone.View.extend({

  el : '#module .inside',

  events : {
    'click .admin-module-image' : 'openMediaFrame',
    'click .admin-module-mobile-image' : 'openMobileMediaFrame',
    'click .admin-module-overlay-image' : 'openOverlayMediaFrame',
    'click #add-new-module' : 'addNewmoduleBox',
    'click .remove-module'  : 'removemodule'
  },

  frameoptions : {
    frame: 'select',
    multiple: false,
    title: 'Select an image',
  },


  template : //edit the module types here -> multiple templates? 
      '<div class="module" data-template="<%= template %>" data-index="<%= id %>">' +
        '<div class="image">' +
          '<image class="admin-module-image" src="<%= image %>" width="100%"/>' +
          '<input type="hidden" name="modules[<%= id %>][image]" value="<%= image %>"/>' +
        '</div>' +
        '<div class="mobile-image">' +
          '<image class="admin-module-mobile-image" src="<%= mobileimage %>" width="100%"/>' +
          '<input type="hidden" name="modules[<%= id %>][mobileimage]" value="<%= mobileimage %>"/>' +
        '</div>' +
        '<div class="form">' +
          '<p>Title : <input type="text" name="modules[<%= id %>][title]" value="<%- title %>" /></p>' +
          '<p>Text  : <br/><textarea type="text" name="modules[<%= id %>][text]" style="resize:none; width:100%;" ><%- text %></textarea></p>' +
          '<p>Link  :<input type="text" name="modules[<%= id %>][link]" value="<%- link %>" /></p>' +
          '<input type="hidden" name="modules[<%= id %>][id]" value="<%= id %>"/>' +
          '<input type="hidden" name="modules[<%= id %>][template]" value="<%= template %>"/>' +
          '<a class="button-secondary remove-module"> Remove </a>' +
        '</div>' +
      '</div>',

  templatewhite : //edit the module types here -> multiple templates? 
      '<div class="module" data-template="<%= template %>" data-index="<%= id %>">' +
        '<h1 style="color:rgb(51,0,111);"> Basic white </h1>' +
        '<div class="form">' +
          '<p>Text  : <br/><textarea id="arugula" type="text" name="modules[<%= id %>][text]" style="resize:none; width:100%;" ><%- text %></textarea></p>' +
          '<input type="hidden" name="modules[<%= id %>][id]" value="<%= id %>"/>' +
          '<input type="hidden" name="modules[<%= id %>][template]" value="<%= template %>"/>' +
          '<a class="button-secondary remove-module"> Remove </a>' +
        '</div>' +
      '</div>',

  templatefull : //edit the module types here -> multiple templates? 
      '<div class="module" data-template="<%= template %>" data-index="<%= id %>">' +
        '<h1 style="color:rgb(51,0,111);"> Full-page image </h1>' +
        '<div class="image">' +
          '<image class="admin-module-image" src="<%= image %>" width="100%"/>' +
          '<input type="hidden" name="modules[<%= id %>][image]" value="<%= image %>"/>' +
        '</div>' +
        '<div class="overlay-image">' +
          '<image class="admin-module-overlay-image" src="<%= overlayimage %>" width="100%"/>' +
          '<input type="hidden" name="modules[<%= id %>][overlayimage]" value="<%= overlayimage %>"/>' +
        '</div>' +
        '<div class="mobile-image">' +
          '<image class="admin-module-mobile-image" src="<%= mobileimage %>" width="100%"/>' +
          '<input type="hidden" name="modules[<%= id %>][mobileimage]" value="<%= mobileimage %>"/>' +
        '</div>' +
        '<div class="form">' +
          '<p>Title : <input type="text" name="modules[<%= id %>][title]" value="<%- title %>" /></p>' +
          '<p>Text  : <br/><textarea type="text" name="modules[<%= id %>][text]" style="resize:none; width:100%;" ><%- text %></textarea></p>' +
          '<p>Use overlay image? <input type="checkbox" name="modules[<%= id %>][overlay]" value="yes" style="width:auto" $t ></p>' +
          '<p>Location of overlay (Defaults to right:0; bottom:0;) : <input type="text" name="modules[<%= id %>][location]" value="<%- location %>" /></p>' +
          '<input type="hidden" name="modules[<%= id %>][id]" value="<%= id %>"/>' +
          '<input type="hidden" name="modules[<%= id %>][template]" value="<%= template %>"/>' +
          '<a class="button-secondary remove-module"> Remove </a>' +
        '</div>' +
      '</div>',

  templatebasic : //edit the module types here -> multiple templates? 
      '<div class="module" data-template="<%= template %>" data-index="<%= id %>">' +
        '<h1 style="color:rgb(51,0,111);"> Basic image </h1>' +
        '<div class="image">' +
          '<image class="admin-module-image" src="<%= image %>" width="100%"/>' +
          '<input type="hidden" name="modules[<%= id %>][image]" value="<%= image %>"/>' +
        '</div>' +
        '<div class="overlay-image">' +
          '<image class="admin-module-overlay-image" src="<%= overlayimage %>" width="100%"/>' +
          '<input type="hidden" name="modules[<%= id %>][overlayimage]" value="<%= overlayimage %>"/>' +
        '</div>' +
        '<div class="mobile-image">' +
          '<image class="admin-module-mobile-image" src="<%= mobileimage %>" width="100%"/>' +
          '<input type="hidden" name="modules[<%= id %>][mobileimage]" value="<%= mobileimage %>"/>' +
        '</div>' +
        '<div class="form">' +
          '<p>Title : <input type="text" name="modules[<%= id %>][title]" value="<%- title %>" /></p>' +
          '<p>Text  : <br/><textarea type="text" name="modules[<%= id %>][text]" style="resize:none; width:100%;" ><%- text %></textarea></p>' +
          '<p>Link  (optional):<input type="text" name="modules[<%= id %>][link]" value="<%- link %>" /></p>' +
          '<p>Move text to the right side? <input type="checkbox" name="modules[<%= id %>][side]" value="right" style="width:auto" $s ><br/>' +
          'Use overlay image? <input type="checkbox" name="modules[<%= id %>][overlay]" value="yes" style="width:auto" $t ></p>' +
          '<p>Location of overlay (Defaults to "right:0; bottom:0;") : <input type="text" name="modules[<%= id %>][location]" value="<%- location %>" /></p>' +
          '<input type="hidden" name="modules[<%= id %>][id]" value="<%= id %>"/>' +
          '<input type="hidden" name="modules[<%= id %>][template]" value="<%= template %>"/>' +
          '<a class="button-secondary remove-module"> Remove </a>' +
        '</div>' +
      '</div>',

  templatethin : //edit the module types here -> multiple templates? 
      '<div class="module" data-template="<%= template %>" data-index="<%= id %>">' +
        '<h1 style="color:rgb(51,0,111);"> Thinstrip </h1>' +
        '<div class="form">' +
          '<p>Text  : <br/><textarea type="text" name="modules[<%= id %>][text]" style="resize:none; width:100%;" ><%- text %></textarea></p>' +
          '<input type="hidden" name="modules[<%= id %>][id]" value="<%= id %>"/>' +
          '<input type="hidden" name="modules[<%= id %>][template]" value="<%= template %>"/>' +
          '<a class="button-secondary remove-module"> Remove </a>' +
        '</div>' +
      '</div>',

  templategive : //edit the module types here -> multiple templates? 
      '<div class="module" data-template="<%= template %>" data-index="<%= id %>">' +
        '<h1 style="color:rgb(51,0,111);"> Giving </h1>' +
        '<div class="form">' +
          '<p>Giving - Query Parameters (optional): <input type="text" name="modules[<%= id %>][title]" value="<%- title %>" />' +
          //'(for multiple codes, seperate with commas) </p>' +
          '<input type="hidden" name="modules[<%= id %>][id]" value="<%= id %>"/>' +
          '<input type="hidden" name="modules[<%= id %>][template]" value="<%= template %>"/>' +
          '<a class="button-secondary remove-module"> Remove </a>' +
        '</div>' +
      '</div>',

  initialize : function( options )
  {
    _.bindAll( this, 'render', 'addmoduleBox', 'openMediaFrame', 'openMobileMediaFrame', 'selectImage', 'reorder', 'setIndex' )

    this.options = _.extend( {}, this.settings , this.$el.data(), options )
    this.collection.on( 'sync', this.render )
    this.collection.on( 'change', this.render )
    this.collection.on( 'remove', this.render )
    this.collection.on( 'add', this.render )

    this.mediaframe = wp.media.frames.frame = wp.media( this.frameoptions )
    this.mediaframe.on( 'select', this.selectImage );

    this.$el.sortable()
    this.$el.on( 'sortstop', this.reorder )
  },

  render : function()
  {
    this.$el.find('.module').remove()
    _.each( this.collection.models, this.addmoduleBox )
  },

  addmoduleBox : function( module, index )
  {
    var template;
    switch ( module.attributes.template ){
      case "white":
        template = _.template( this.templatewhite );
        break;
      case "full":
        var full = this.templatefull;
        full = (module.attributes.overlay == "yes") ? full.replace('$t' , "checked") : full.replace('$t' , "");
        template = _.template( full );
        break;
      case "basic":
        var basic = this.templatebasic;
        basic = (module.attributes.side == "right") ? basic.replace('$s' , "checked") : basic.replace('$s' , "");
        basic = (module.attributes.overlay == "yes") ? basic.replace('$t' , "checked") : basic.replace('$t' , "");
        template = _.template( basic );
        break;
      case "thin":
        template = _.template( this.templatethin );
        break;
      case "give":
        template = _.template( this.templategive );
        break;
    } 
    template = template( module.toJSON() );
    this.$el.append( template );
  },

  openMediaFrame : function( e )
  {
    this.mobile = false;
    this.overlay = false;
    this.id = this.$( e.currentTarget ).closest('[data-index]').data().index
    this.mediaframe.open()
  },

  openMobileMediaFrame : function( e )
  {
    this.mobile = true;
    this.overlay = false;
    this.id = this.$( e.currentTarget ).closest('[data-index]').data().index
    this.mediaframe.open()
  },

  openOverlayMediaFrame : function( e )
  {
    this.mobile = false;
    this.overlay = true;
    this.id = this.$( e.currentTarget ).closest('[data-index]').data().index
    this.mediaframe.open()
  },

  selectImage : function()
  {
    var media = this.mediaframe.state().get('selection').first().toJSON()
    if ( this.mobile )
     this.collection.get( this.id ).set( 'mobileimage', media.url )
    else if ( this.overlay )
     this.collection.get( this.id ).set( 'overlayimage', media.url )
    else 
     this.collection.get( this.id ).set( 'image', media.url )
  },

  addNewmoduleBox : function( e )
  {
    var $temp = this.$( "#mod-select option:selected" ).val()
    this.collection.push( new ModularPages.Module({ id: _.uniqueId() , template: $temp }) )
  },

  removemodule : function( e ) {
    this.collection.remove( this.$( e.currentTarget ).closest('[data-index]').data().index )
  },

  reorder : function()
  {
    _.map( this.$('[data-index]'), this.setIndex )
  },

  setIndex : function( element , index )
  {
    var id = jQuery(element).data().index
      , model = this.collection.get( id )
    this.collection.remove( id )
    this.collection.add( model, { at: index } )
  }


})

jQuery(document).ready( function() {
  ModularPages.view = new ModularPages.View({  collection: ( new ModularPages.Modules() ) })
})
