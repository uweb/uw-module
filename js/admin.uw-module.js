var ModularPages=ModularPages||{};ModularPages.Module=Backbone.Model.extend({defaults:{id:null,title:null,text:null,link:null,dark:null,template:"white",image:"/wp-content/plugins/uw-modules/assets/placeholder.png",mobileimage:"/wp-content/plugins/uw-modules/assets/placeholder-mobile.png"}}),ModularPages.Modules=Backbone.Collection.extend({model:ModularPages.Module,parameters:{action:"get_current_uw_module"},defaults:{src:""},url:function(){return ajaxurl+"?"+jQuery.param(_.extend(this.parameters,{id:jQuery("#post_ID").val()}))},initialize:function(){this.fetch()}}),ModularPages.View=Backbone.View.extend({el:"#module .inside",events:{"click .admin-module-image":"openMediaFrame","click .admin-module-mobile-image":"openMobileMediaFrame","click #add-new-module":"addNewmoduleBox","click .remove-module":"removemodule"},frameoptions:{frame:"select",multiple:!1,title:"Select an image"},template:'<div class="module" data-template="<%= template %>" data-index="<%= id %>"><div class="image"><image class="admin-module-image" src="<%= image %>" width="100%"/><input type="hidden" name="modules[<%= id %>][image]" value="<%= image %>"/></div><div class="mobile-image"><image class="admin-module-mobile-image" src="<%= mobileimage %>" width="100%"/><input type="hidden" name="modules[<%= id %>][mobileimage]" value="<%= mobileimage %>"/></div><div class="form"><p>Title : <input type="text" name="modules[<%= id %>][title]" value="<%- title %>" /></p><p>Text  : <br/><textarea type="text" name="modules[<%= id %>][text]" style="resize:none; width:100%;" ><%- text %></textarea></p><p>Link  :<input type="text" name="modules[<%= id %>][link]" value="<%- link %>" /></p><input type="hidden" name="modules[<%= id %>][id]" value="<%= id %>"/><input type="hidden" name="modules[<%= id %>][template]" value="<%= template %>"/><a class="button-secondary remove-module"> Remove </a></div></div>',templatewhite:'<div class="module" data-template="<%= template %>" data-index="<%= id %>"><h1 style="color:rgb(51,0,111);"> Basic white </h1><div class="form"><p>Text  : <br/><textarea id="arugula" type="text" name="modules[<%= id %>][text]" style="resize:none; width:100%;" ><%- text %></textarea></p><input type="hidden" name="modules[<%= id %>][id]" value="<%= id %>"/><input type="hidden" name="modules[<%= id %>][template]" value="<%= template %>"/><a class="button-secondary remove-module"> Remove </a></div></div>',templatefull:'<div class="module" data-template="<%= template %>" data-index="<%= id %>"><h1 style="color:rgb(51,0,111);"> Full-page image </h1><div class="image"><image class="admin-module-image" src="<%= image %>" width="100%"/><input type="hidden" name="modules[<%= id %>][image]" value="<%= image %>"/></div><div class="mobile-image"><image class="admin-module-mobile-image" src="<%= mobileimage %>" width="100%"/><input type="hidden" name="modules[<%= id %>][mobileimage]" value="<%= mobileimage %>"/></div><div class="form"><p>Title : <input type="text" name="modules[<%= id %>][title]" value="<%- title %>" /></p><p>Text  : <br/><textarea type="text" name="modules[<%= id %>][text]" style="resize:none; width:100%;" ><%- text %></textarea></p><input type="hidden" name="modules[<%= id %>][id]" value="<%= id %>"/><input type="hidden" name="modules[<%= id %>][template]" value="<%= template %>"/><a class="button-secondary remove-module"> Remove </a></div></div>',templatebasic:'<div class="module" data-template="<%= template %>" data-index="<%= id %>"><h1 style="color:rgb(51,0,111);"> Basic image </h1><div class="image"><image class="admin-module-image" src="<%= image %>" width="100%"/><input type="hidden" name="modules[<%= id %>][image]" value="<%= image %>"/></div><div class="mobile-image"><image class="admin-module-mobile-image" src="<%= mobileimage %>" width="100%"/><input type="hidden" name="modules[<%= id %>][mobileimage]" value="<%= mobileimage %>"/></div><div class="form"><p>Title : <input type="text" name="modules[<%= id %>][title]" value="<%- title %>" /></p><p>Text  : <br/><textarea type="text" name="modules[<%= id %>][text]" style="resize:none; width:100%;" ><%- text %></textarea></p><p>Link  (optional):<input type="text" name="modules[<%= id %>][link]" value="<%- link %>" /></p><input type="hidden" name="modules[<%= id %>][id]" value="<%= id %>"/><input type="hidden" name="modules[<%= id %>][template]" value="<%= template %>"/><a class="button-secondary remove-module"> Remove </a></div></div>',templatethin:'<div class="module" data-template="<%= template %>" data-index="<%= id %>"><h1 style="color:rgb(51,0,111);"> Thinstrip </h1><div class="form"><p>Text  : <br/><textarea type="text" name="modules[<%= id %>][text]" style="resize:none; width:100%;" ><%- text %></textarea></p><input type="hidden" name="modules[<%= id %>][id]" value="<%= id %>"/><input type="hidden" name="modules[<%= id %>][template]" value="<%= template %>"/><a class="button-secondary remove-module"> Remove </a></div></div>',templategive:'<div class="module" data-template="<%= template %>" data-index="<%= id %>"><h1 style="color:rgb(51,0,111);"> Giving </h1><div class="form"><p>Giving - Fund Code (optional): <input type="text" name="modules[<%= id %>][title]" value="<%- title %>" /></p><input type="hidden" name="modules[<%= id %>][id]" value="<%= id %>"/><input type="hidden" name="modules[<%= id %>][template]" value="<%= template %>"/><a class="button-secondary remove-module"> Remove </a></div></div>',initialize:function(a){_.bindAll(this,"render","addmoduleBox","openMediaFrame","openMobileMediaFrame","selectImage","reorder","setIndex"),this.options=_.extend({},this.settings,this.$el.data(),a),this.collection.on("sync",this.render),this.collection.on("change",this.render),this.collection.on("remove",this.render),this.collection.on("add",this.render),this.mediaframe=wp.media.frames.frame=wp.media(this.frameoptions),this.mediaframe.on("select",this.selectImage),this.$el.sortable(),this.$el.on("sortstop",this.reorder)},render:function(){this.$el.find(".module").remove(),_.each(this.collection.models,this.addmoduleBox)},addmoduleBox:function(a,b){switch(a.attributes.template){case"white":this.$el.append(_.template(this.templatewhite,a.toJSON()));break;case"full":this.$el.append(_.template(this.templatefull,a.toJSON()));break;case"basic":this.$el.append(_.template(this.templatebasic,a.toJSON()));break;case"thin":this.$el.append(_.template(this.templatethin,a.toJSON()));break;case"give":this.$el.append(_.template(this.templategive,a.toJSON()))}},openMediaFrame:function(a){this.mobile=!1,this.id=this.$(a.currentTarget).closest("[data-index]").data().index,this.mediaframe.open()},openMobileMediaFrame:function(a){this.mobile=!0,this.id=this.$(a.currentTarget).closest("[data-index]").data().index,this.mediaframe.open()},selectImage:function(){var a=this.mediaframe.state().get("selection").first().toJSON();this.mobile?this.collection.get(this.id).set("mobileimage",a.url):this.collection.get(this.id).set("image",a.url)},addNewmoduleBox:function(a){var b=this.$("#mod-select option:selected").val();this.collection.push(new ModularPages.Module({id:_.uniqueId(),template:b}))},removemodule:function(a){this.collection.remove(this.$(a.currentTarget).closest("[data-index]").data().index)},reorder:function(){_.map(this.$("[data-index]"),this.setIndex)},setIndex:function(a,b){var c=jQuery(a).data().index,d=this.collection.get(c);this.collection.remove(c),this.collection.add(d,{at:b})}}),jQuery(document).ready(function(){ModularPages.view=new ModularPages.View({collection:new ModularPages.Modules})});