/**
 * An application that reads the "locale"
 * query parameter, and if it is set, loads
 * the appropriate locale file.
 */
Ext.application({
    name: 'App',
    models: ['App.model.User'],
    autoCreateViewport: true
});
