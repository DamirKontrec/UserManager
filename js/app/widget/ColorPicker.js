/**
 * A dropdown field that enables user to Picker
 * desired color from it's dropdown menu. Also
 * supports entering the color inside the text
 * field in CSS notation.
 */
Ext.define('App.widget.ColorPicker', {
    extend: 'Ext.form.field.Picker',
    xtype: 'app-color-picker',

    /**
     * @cfg {String}
     * Template for creating CSS that will be
     * applied to the textfield of this dropdown
     * menu, and will indicate which color is
     * currently chosen
     */
    styleTpl: 'background-color: {newColor};',

    pickerConfig: {
        resizable: false
    },

    createPicker: function() {
        return Ext.create('Ext.picker.Color', Ext.apply(this.pickerConfig, {
            floating: true,
            select: this.onSelect.bind(this)
        }));
    },

    /**
     * @private
     * Gets run when the user selects the color from dropdown menu,
     * and sets this field's value.
     */
    onSelect: function(selectedColor) {
        var hexColor = "#"+ selectedColor;
        this.setValue(hexColor);
        this.collapse();
    },

    onChange: function() {
        this.callParent(arguments);
        var newStyle = this.styleTpl.replace('{newColor}', this.value);
        this.setFieldStyle(newStyle);
    }
});
