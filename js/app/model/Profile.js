/**
 * A model that defines profile information. Contains
 * all the information of a user with addition of password.
 */
Ext.define('App.model.Profile', {
    extend: 'App.model.User',

    fields: [{
        name: 'password',
        type: 'string'
    }]
});
