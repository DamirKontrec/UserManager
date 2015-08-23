/**
 * Enables the editing of the currently logged in
 * user's account information. That also includes
 * the ability to change password
 */
Ext.define('App.widget.EditProfileWindow', {
    extend: 'App.widget.UserWindow',
    xtype: 'app-edit-profile-window',

    /**
     * @cfg {String} (required)
     * URL of service that will provide information
     * about the currenly logged in account
     */
    userInfoUrl: null,

    /**
     * @cfg {String}
     * Message that will be displayed when the changes
     * were successfully saved to the service
     */
    saveSuccessfulMsg: 'User settings successfully saved!',

    /**
     * @cfg {String}
     * Message that will be displayed if the error occures
     * while the account info is being loaded
     */
    loadErrorMsg: 'There was an error when trying to load current user\'s information!',

    additionalFields: [{
        name: 'password',
        inputType: 'password',
        fieldLabel: 'Password',
        minLength: 8
    }, {
        xtype: 'app-repeat-field',
        name: 'repeat-password',
        inputType: 'password',
        fieldLabel: 'Repeat password',
        boundFieldValueDifferentMsg: 'Passwords must match!',
        submitValue: false,
        minLength: 8
    }],

    show: function() {
        this.callParent(arguments);
        var maskEl = this.body.el;

        Ext.Ajax.request({
            url: this.userInfoUrl,
            callback: maskEl.unmask.bind(maskEl),
            success: this.onUserInfoLoad,
            failure: this.onUserInfoLoadError,
            scope: this
        });
    },

    /**
     * @private
     * Loads the data received from service into the form
     */
    onUserInfoLoad: function(response) {
        var userInfo = Ext.decode(response.responseText),
            userRecord = App.model.Profile.create(userInfo);

        this.load(userRecord, true);
    },

    /**
     * @private
     * Displays an error message if the load info request fails
     */
    onUserInfoLoadError: function() {
        App.Util.showError(this.loadErrorMsg);
    },

    save: function() {
        var success = this.callParent(arguments);
        if (!success) return;

        // Just a mockup message since the backend
        // persistence is not implemented
        App.Util.showInfo(this.saveSuccessfulMsg);
    }
});
