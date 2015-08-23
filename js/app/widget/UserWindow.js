/**
 * Window that enables the creation and editing of various
 * user information. It can be extended with additional
 * fields to allow for managing additional user parameters
 * in its subclasses.
 */
Ext.define('App.widget.UserWindow', {
    extend: 'Ext.Window',
    xtype: 'app-user-window',

    mixins: {
        canHaveDeclarableMethods: 'App.mixin.CanHaveDeclarableMethods'
    },

    /**
     * @cfg {Object[]}
     * Optional configuration for additional fields
     */
    additionalFields: [],

    /**
     * @cfg {Object[]}
     * Label for the save button
     */
    saveButtonLabel: 'Save',

    /**
     * @cfg {Object[]}
     * Label for the cancel button
     */
    cancelButtonLabel: 'Cancel',

    layout: 'fit',

    minWidth: 300,
    resizable: false,

    items: {
        xtype: 'form',
        bodyPadding: 10,
        border: false,

        defaults: {
            xtype: 'textfield',
            msgTarget: 'side',
            allowBlank: false,
            labelWidth: 125,
            maxLength: 25
        },

        layout: {
            type: 'vbox',
            pack: 'start',
            align: 'stretch'
        },

        items: [{
            name: 'id',
            value : '0',
            hidden: true
        }, {
            xtype: 'app-color-picker',
            fieldLabel: 'Icon color',
            name: 'color'
        }, {
            name: 'firstname',
            fieldLabel: 'First name'
        }, {
            name: 'lastname',
            fieldLabel: 'Last name'
        }, {
            name: 'email',
            fieldLabel: 'E-mail',
            vtype: 'email'
        }],

        bbar: [{
            type: 'cancel',
            iconCls: 'tool-icon no',
            handler: 'cancel'
        }, '->', {
            formBind: true,
            type: 'save',
            iconCls: 'tool-icon yes',
            handler: 'save'
        }]
    },

    initComponent: function() {
        this.addEvents({
            /**
             * @event save
             * Fires when user clicks the save button
             *
             * @param {App.widget.EditProfileWindow} this
             * An Edit profile window that initiated the event
             *
             * @param {Object[]} values
             * New values inside the window's form
             */
            save: true
        });

        this.createMethodsFromDeclarations(this.items.bbar);
        this.callParent(arguments);

        this.formPanel = this.down('form');
        this.form = this.formPanel.form;
        this.saveButton = this.down('button[type=save]');
        this.cancelButton = this.down('button[type=cancel]');

        if (!Ext.isEmpty(this.additionalFields))
            this.formPanel.add(this.additionalFields);

        this.saveButton.setText(this.saveButtonLabel);
        this.cancelButton.setText(this.cancelButtonLabel);
    },

    afterRender: function () {
        this.callParent(arguments);

        this.keyMap.addBinding({
            key: Ext.EventObject.ENTER,
            fn: this.save,
            scope: this
        });
    },

    /**
     * Saves the account information currently in the form.
     * Gets run only if the form is valid
     *
     * @return {Boolean} success
     * Is the form valid
     */
    save: function() {
        if (!this.form.isValid()) return false;
        this.fireEvent('save', this, this.form.getValues());
        this.close();
        return true;
    },

    /**
     * Clears the changes in this form and closes this window
     */
    cancel: function() {
        this.form.reset();
        this.close();
    },

    /**
     * Clears the changes in this form and closes this window
     *
     * @param {App.model.User} user
     * User model to be loaded into this form
     *
     * @param {Boolean} [preventShow=false]
     * Should the showing of the window be prevented
     * after the user is loaded
     */
    load: function(user, preventShow) {
        this.form.loadRecord(user);
        if (!preventShow) this.show();
    },

    show: function() {
        this.callParent(arguments);
        this.focusFirstVisibleField();
    },

    /**
     * Focuses the first visible field in this window's form
     */
    focusFirstVisibleField: function() {
        this.firstVisibleField = this.firstVisibleField || this.formPanel.down('field{isVisible()}');
        this.firstVisibleField.focus(true, true);
    }
});
