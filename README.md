# UW moduleshow plugin for WordPress

This is the moduler behind [UW.edu](http://uw.edu) as well as many other sites across the UW WordPress network 
such as [the IMA](http://uw.edu/ima). 

The default layout is the one that appears on the IMA website. 


The plugin creates a private custom post type with an drag and drop interface for arranging modules. 
Each module has a designated shortcode that can be used.


There is a method that creates a JSON feed of the moduleshows allowing the creation of the custom templates.
The function `UW_moduleshow::get_latest_moduleshow()` returns a JSON object of the most recently created moduleshow 
which can be used in any template file. You can loop through the individual modules and template them accordingly. 
