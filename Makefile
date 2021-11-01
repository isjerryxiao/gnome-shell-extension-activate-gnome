schemdir = ./activate_gnome@isjerryxiao/schemas
$(schemdir)/gschemas.compiled: $(schemdir)/org.gnome.shell.extensions.activate_gnome.gschema.xml
	glib-compile-schemas $(schemdir)/
clean:
	rm $(schemdir)/gschemas.compiled
