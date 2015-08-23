/**
 * Enables user management by disabling existing users
 * and adding new ones. It will prevent new users from
 * being created if the maximum number of available
 * licenses is reached.
 */
Ext.define('App.widget.ManageUsersWindow', {
    extend: 'Ext.Window',
    xtype: 'app-manage-users-window',

    mixins: {
        canHaveDeclarableMethods: 'App.mixin.CanHaveDeclarableMethods'
    },

    /**
     * @cfg {String} (required)
     * URL of service that will provide a list of users
     * associated with the currently logged in account
     */
    userListUrl: null,

    /**
     * @cfg {String} (required)
     * URL of service that will provide maximum number
     * of users supported by this the currently logged
     * in account
     */
    maxLicensesUrl: null,

    /**
     * @cfg {Object}
     * Optional additional grid configuration
     */
    gridConfig: {},

    /**
     * @cfg {String}
     * Text that will be displayed while number of licenses
     * is being loaded
     */
    maxLicenseLoadingText: 'Loading...',

    /**
     * @cfg {String}
     * Error message text that will be displayed if an error
     * occures when trying to load number of available licenses
     */
    maxLicenseLoadErrorMessage: 'An error occured while loading data.',

    /**
     * @cfg {String}
     * A template for the toolbar info containing the maximum number
     * of licenses, and also used and remaining licenses count
     */
    maxLicensesTpl: 'Max. licenses: {maxLicenseCount} (used: {usedLicenseCount}, remaining: {remainingLicenseCount})',

    /**
     * @cfg {String}
     * Configuration for window that will be used for adding new users
     * to the account
     */
    addUserWindowConfig: {
        xtype: 'app-user-window',
        title: 'Add new user',
        closeAction: 'hide',
        modal: true,

        saveButtonLabel: 'Create',

        additionalFields: [{
            xtype: 'checkbox',
            name: 'disabled',
            fieldLabel: 'Disabled',
            inputValue: true,
            uncheckedValue: false
        }]
    },

    /**
     * @cfg {String}
     * Template that will be used to generate color icon cell appearance
     */
    iconColorSyleTpl: 'background: {background-color}; border-right: 1px solid #CCC',

    /**
     * @cfg {String}
     * Text that will be disabled in "Status" column if the user is disabled
     */
    disabledLabel: 'Disabled',

    /**
     * @cfg {String}
     * Text that will be disabled in "Status" column if the user is enabled
     */
    enabledLabel: 'Enabled',

    /**
     * @cfg {String}
     * CSS that will be applied to the #disabledLabel
     */
    disabledStyle: 'color: red;',

    /**
     * @cfg {String}
     * CSS that will be applied to the #enabledLabel
     */
    enabledStyle: 'color: green;',

    minWidth: 480,
    minHeight: 320,
    layout: 'fit',

    items: {
        xtype: 'grid',
        border: false,

        viewConfig: {
            deferEmptyText: false,
            emptyText: 'No users are assigned to this account...',
        },

        store: {
            model: 'App.model.User',
            autoLoad: false,

            proxy: {
                type: 'ajax',
                reader: {
                    type: 'json',
                    root: 'results'
                }
            }
        },

        columns: [{
            xtype: 'rownumberer',
            align: 'right',
            text: '#',
            width: 30
        }, {
            dataIndex: 'color',
            renderer: 'colorRenderer',
            menuDisabled: true,
            resizable: false,
            sortable: false,
            width: 22
        }, {
            dataIndex: 'firstname',
            text: 'First name',
            flex: 1
        }, {
            dataIndex: 'lastname',
            text: 'Last name',
            flex: 2
        }, {
            dataIndex: 'email',
            text: 'E-mail',
            flex: 2
        }, {
            dataIndex: 'disabled',
            renderer: 'disabledRenderer',
            text: 'Status',
            align: 'center',
            width: 75
        }]
    },

    bbar: [{
        xtype: 'tbtext',
        type: 'max-license-count'
    }, '->', {
        iconCls: 'tool-icon delete',
        type: 'toggle-user-status',
        text: 'Toggle status',
        handler: 'toggleUserStatus',
        disabled: true
    }, '-', {
        iconCls: 'tool-icon add',
        type: 'add-user',
        text: 'Add user',
        handler: 'addUserHandler'
    }],

    /**
     * @property {Number}
     * Maximum number of licenses available for this account
     */
    maxLicenseCount: 0,

    /**
     * @property {Number}
     * Number of used licenses
     */
    usedLicenseCount: 0,

    /**
     * @property {Number}
     * Number of remaining licenses
     */
    remainingLicenseCount: 0,

    initComponent: function() {
        this.items = Ext.Object.merge({}, this.items, this.gridConfig);
        this.items.store.proxy.url = this.userListUrl;
        this.createMethodsFromDeclarations(this.items.columns, 'renderer');
        this.createMethodsFromDeclarations(this.bbar);
        this.callParent(arguments);

        this.grid = this.down('grid');
        this.store = this.grid.store;
        this.maxLicenseCountText = this.down('[type=max-license-count]');
        this.toggleUserStatusButton = this.down('button[type=toggle-user-status]');
        this.addUserButton = this.down('button[type=add-user]');

        this.store.on({
            add: this.updateMaxLicenseCount,
            update: this.updateMaxLicenseCount,
            scope: this
        });

        this.grid.on({
            selectionchange: this.handleToggleStatusButton,
            scope: this
        });
    },

    afterRender: function() {
        this.callParent(arguments);
        this.loadMaxLicensesCount();
    },

    /**
     * @private
     * Loads the maximum number of licenses for the currently
     * logged in account
     */
    loadMaxLicensesCount: function() {
        var maskEl = this.body.el;

        maskEl.mask(this.maxLicenseLoadingText);

        Ext.Ajax.request({
            url: this.maxLicensesUrl,
            callback: maskEl.unmask.bind(maskEl),
            success: this.onMaxLicenseCountLoad,
            failure: this.onMaxLicenseCountError,
            scope: this
        });
    },

    /**
     * @private
     * Sets the loaded maximum number of licenses after it was loaded
     */
    onMaxLicenseCountLoad: function(response) {
        var result = Ext.decode(response.responseText),
            maxLicenseCount = this.maxLicenseCount = result.maxLicense;

        this.store.load({
            scope: this,
            callback: this.updateMaxLicenseCount
        });
    },

    /**
     * @private
     * Displays an error message if the maximum license number request
     * was unsuccessful
     */
    onMaxLicenseCountError: function(response) {
        App.Util.showError(response.message || this.maxLicenseLoadErrorMessage);
    },

    /**
     * Gets the enabled users currently loaded in this grid
     */
    getEnabledUsers: function() {
        return this.store.getRange().filter(function(user) {
            return user.data.disabled === false;
        });
    },

    /**
     * Updates the maximum, remaining and used licenses count
     */
    updateMaxLicenseCount: function() {
        var maxLicenseCount = this.maxLicenseCount,
            usedLicenseCount = this.usedLicenseCount = this.getEnabledUsers().length,
            remainingLicenseCount = this.remainingLicenseCount = maxLicenseCount - usedLicenseCount,
            newText = this.maxLicensesTpl
                        .replace('{maxLicenseCount}', maxLicenseCount)
                        .replace('{usedLicenseCount}', usedLicenseCount)
                        .replace('{remainingLicenseCount}', remainingLicenseCount);

        this.maxLicenseCountText.update(newText);
        this.addUserButton.setDisabled(remainingLicenseCount === 0);
    },

    /**
     * @private
     * Renderer for the icon color column
     */
    colorRenderer: function(hexColor, metadata) {
        metadata.style = this.iconColorSyleTpl.replace('{background-color}', hexColor);
        return null;
    },

    /**
     * @private
     * Renderer for the status column
     */
    disabledRenderer: function(disabled, metadata) {
        var userFriendlyValue = disabled ? this.disabledLabel : this.enabledLabel;
        metadata.style = disabled ? this.disabledStyle : this.enabledStyle;
        return userFriendlyValue;
    },

    /**
     * @private
     * Creates the window for adding new users
     */
    createAddUserWindow: function() {
        var win = Ext.widget(this.addUserWindowConfig);

        win.on({
            save: this.onUserAddComplete,
            scope: this
        });

        return win;
    },

    /**
     * @private
     * Adds the newly created user into the grid
     */
    onUserAddComplete: function(win, newValues) {
        this.store.add(newValues);
        this.addUserWindow.form.reset();
    },

    /**
     * Gets the selected user
     *
     * @ return {App.model.User}
     * Currently selected user
     */
    getSelectedUser: function() {
        return this.grid.selModel.getSelection()[0];
    },

    /**
     * @private
     * Triggers when the "Add user" button is clicked
     */
    addUserHandler: function() {
        if (!this.addUserWindow)
            this.addUserWindow = this.createAddUserWindow();

        this.addUserWindow.show();
    },

    /**
     * @private
     * Toggles the currently selected user's status
     */
    toggleUserStatus: function() {
        var selectedUser = this.getSelectedUser(),
            oldStatus = selectedUser.get('disabled'),
            newStatus = !oldStatus;

        selectedUser.set({ disabled: newStatus });
        // Since there is no actual backend that should
        // persist data, this example code only commits
        // the model.
        selectedUser.commit();
    },

    /**
     * @private
     * Disables the "Toggle status" button, if there are no
     * more available licenses left, and the selected user
     * was about to be enabled
     */
    handleToggleStatusButton: function(selModel, selection) {
        var selectedUser = selection[0],
            isUserDisabled = !!selectedUser && selectedUser.get('disabled'),
            shouldDisable = isUserDisabled && this.remainingLicenseCount < 1;

        this.toggleUserStatusButton.setDisabled(shouldDisable);
    }
});
