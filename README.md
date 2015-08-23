# User Manager
An example application for managing user account and licenses.

Window for managing the main account enables the user to change his icon color (either by selection it from a dropdown menu or by entering a CSS color value), update his name, email and password. Password fields contain validation mechanisms preventing the user from entering a password shorter that 8 letters, and prevents accidental wrong password input by asking the user to repeat the password. Saving the changes is not possible until the form is correctly filled.

A grid for managing licences bound to the main account lists the licenses currently in use, and enables the user to select a license and disable it if needed. Adding new licenses is allowed, but a limit is set for maximum licenses that can be active at a certain time. If the user wishes to add aditional licenses, they must first disable some active ones, in order to be inside the maximum allowd license quota.

# Technical details
This example application was written using the ExtJS 4.2.1 framework, and was intended to present a proof-of-concept for a client. It has no data persistence, since it only consists of a front-end code.

**NOTICE** - this application must be run from a server. If it is run directly from filesystem, it will not work.

![Main account settings](http://s6.postimg.org/7o3afduw1/Risk_Ident1.png)
![Main account settings](http://s6.postimg.org/nnlxyxqxt/Risk_Ident2.png)
