/**
 * Basic user model that contains basic information such as
 * an e-mail address, first name, last name, etc...
 */
Ext.define('App.model.User', {
    extend: 'Ext.data.Model',

    fields: [{
        name: 'id',
        type: 'number'
    }, {
        name: 'firstname',
        type: 'string'
    }, {
        name: 'lastname',
        type: 'string'
    }, {
        name: 'email',
        type: 'string'
    }, {
        name: 'color',
        type: 'string'
    }, {
        name: 'disabled',
        type: 'boolean'
    }]
});
