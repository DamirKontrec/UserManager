/**
 * This mixin enables, for example, a panel to have it's
 * toolbar buttons' handlers be defined as string. After
 * the panel is created, a #createMethodsFromDeclarations
 * method is called and all the handler string values are
 * substituted by panel's methods scoped to that same panel.
 */
Ext.define('App.mixin.CanHaveDeclarableMethods', {
    /**
     * @cfg {String} [defaultDeclarableMethodName="handler"]
     * Default method name to be sustituted for an actual
     * method. Can be, for example, "handler", or "renderer"
     * (handy when providing grid column renderer methods as
     * strings), etc...
     */
    defaultDeclarableMethodName: 'handler',

    /**
     * Should be run in a class that implements this mixin,
     * since it does the actual work of replacing string
     * values of method properties with actual methods
     *
     * @param {Object[]} list
     * A list of eg. button configurations, that contain
     * strings with method names for their handler values
     *
     * @param {String} [methodName=#defaultDeclarableMethodName]
     * A name of the property inside the provided configurations
     * that will have thier string values substituted for actual
     * methods
     */
    createMethodsFromDeclarations: function(list, methodName) {
        methodName = methodName || this.defaultDeclarableMethodName;

        list.forEach(function(item) {
            if (!Ext.isObject(item) || !item[methodName]) return;
            item[methodName] = this[item[methodName]];
            item.scope = this;
        }, this);
    }
});
