/**
 * Represents any textfield that has to have the
 * same value as some other field. If the values
 * don't match, it fails validation. Useful for
 * creating "Repeat password" fields.
 *
 * It is important that the original field this
 * field binds to is its sibling, and that both
 * fields are added one after another in their
 * parent container.
 */
Ext.define('App.widget.RepeatField', {
    extend: 'Ext.form.TextField',
    xtype: 'app-repeat-field',

    /**
     * @cfg {String} (required)
     * ComponentQuery selector for getting the
     * original field this field will bind to
     */
    boundFieldSelector: null,

    /**
     * @cfg {String}
     * Validation message to be shown if this field's
     * value differs from the bound field's value
     */
    boundFieldValueDifferentMsg: 'This field\'s value differs from the value in field "{boundFieldLabel}"!',

    /**
     * @cfg {Boolean}
     * Whether or not will this field get validated if
     * if it is empty
     */
    validateBoundValueIfEmpty: false,

    afterRender: function() {
        this.callParent(arguments);
        this.bindToField();
    },

    /**
     * @private
     * Binds this field to the original one
     */
    bindToField: function() {
        this.boundField = this.next(this.boundFieldSelector) || this.prev(this.boundFieldSelector);
        if (!this.boundField) return;

        this.boundField.on({
            change: this.onBoundFieldChange,
            scope: this
        });
    },

    /**
     * @private
     * Gets run when the original field's value is changed.
     * Runs the validation
     */
    onBoundFieldChange: function() {
        if (this.validateBoundValueIfEmpty || !Ext.isEmpty(this.value))
            this.validate();
    },

    validator: function() {
        if (!this.boundField) return true;

        var boundValue = this.boundField.getValue(),
            doValuesMatch = this.value === boundValue;

        if (!doValuesMatch) {
            var msg = this.boundFieldValueDifferentMsg.replace('{boundFieldLabel}', this.boundField.fieldLabel);
            return msg;
        }

        return true;
    }
});
