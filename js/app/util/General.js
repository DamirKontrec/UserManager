/**
 * A general utility library with few
 * convinience methods.
 */
Ext.define('App.util.General', {
    alternateClassName: 'App.Util',
    singleton: true,

    /**
     * @cfg {String} [defaultInfoTitle="Info"]
     * Default title for info MessageBox
     */
    defaultInfoTitle: 'Info',

    /**
     * @cfg {String} [defaultWarningTitle="Warning"]
     * Default title for warning MessageBox
     */
    defaultWarningTitle: 'Warning',

    /**
     * @cfg {String} [defaultErrorTitle="Error"]
     * Default title for error MessageBox
     */
    defaultErrorTitle: 'Error',

    /**
     * Shows message box with some predefined
     * properties (eg. fixed witdh, etc.)
     *
     * @param {String} msg
     * A warning message to be displayed
     *
     * @param {Object} [icon=Ext.MessageBox.INFO]
     * An icon to be displayed in the messagebox
     *
     * @param {String} [title=#defaultInfoTitle]
     * Title of the messagebox
     */
    showInfo: function(msg, icon, title) {
    	Ext.Msg.show({
			msg: msg,
			title: title || this.defaultInfoTitle,
			icon: icon || Ext.MessageBox.INFO,
			buttons: Ext.MessageBox.OK,
			maxWidth: 300
		});
    },

    /**
     * Shows a warning message
     *
     * @param {String} msg
     * A message to be displayed
     *
     * @param {String} [title=#defaultWarningTitle]
     * Title of the messagebox
     */
    showWarning: function(msg, title) {
        title = title || this.defaultWarningTitle;
    	this.showInfo(msg, Ext.MessageBox.WARNING, title);
    },

    /**
     * Shows an error message
     *
     * @param {String} msg
     * An error message to be displayed
     *
     * @param {String} [title=#defaultErrorTitle]
     * Title of the messagebox
     */
    showError: function(msg, title) {
        title = title || this.defaultErrorTitle;
    	this.showInfo(msg, Ext.MessageBox.ERROR, title);
    }
});
