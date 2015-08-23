/**
 * Settings button that contains the menu with
 * options to edit profile information or manage
 * users bound to this account
 */
Ext.define('App.widget.SettingsButton', {
    extend: 'Ext.Button',
    xtype: 'app-settings-button',

    mixins: {
        canHaveDeclarableMethods: 'App.mixin.CanHaveDeclarableMethods'
    },

    /**
     * @cfg {String}
     * Configration for the window that will be used
     * for editing the profile information
     */
    editProfileWindowConfig: {
        xtype: 'app-edit-profile-window',
    },

    /**
     * @cfg {String}
     * Configration for the window that will be used
     * for managing users bound to this account
     */
    manageUsersWindowConfig: {
        xtype: 'app-manage-users-window',
    },

    /**
     * @cfg {String}
     * Configration for the bound menu
     */
    menu: [{
        iconCls: 'tool-icon edit-profile',
        text: 'Edit profile',
        type: 'editProfile',
        handler: 'editProfileHandler'
    }, {
        iconCls: 'tool-icon manage-users',
        text: 'Manage users',
        type: 'manageUsers',
        handler: 'manageUsersHandler'
    }],

    initComponent: function() {
        this.createMethodsFromDeclarations(this.menu);

        this.callParent(arguments);

        this.editProfileButton = this.menu.down('[type=editProfile]');
        this.manageUsersButton = this.menu.down('[type=manageUsers]');
    },

    /**
     * @private
     * Creates the window that is bound to each menu item
     */
    createMenuItemWindow: function(button) {
        var defaults = this[button.type + 'WindowConfig'],
            cfg = Ext.apply({
                closeAction: 'hide',
                title: button.text,
                iconCls: button.iconCls
            }, defaults);

        return Ext.widget(cfg);
    },

    /**
     * @private
     * Handler for the "Edit profile" button
     */
    editProfileHandler: function(editProfileButton) {
        if (!this.editProfileWindow)
            this.editProfileWindow = this.createMenuItemWindow(editProfileButton);

        this.editProfileWindow.show();
    },

    /**
     * @private
     * Handler for the "Manage users" button
     */
    manageUsersHandler: function(manageUsersButton) {
        if (!this.manageUsersWindow)
            this.manageUsersWindow = this.createMenuItemWindow(manageUsersButton);

        this.manageUsersWindow.show();
    }
});
