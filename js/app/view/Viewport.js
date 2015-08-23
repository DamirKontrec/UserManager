Ext.define('App.view.Viewport', {
	extend: 'Ext.container.Viewport',

	layout: 'fit',

	items: {
		xtype: 'panel',
		title: 'Frida settings',
		html: 'This would normally be a grid as seen in screenshots provided in an assignment',
		bodyStyle: {
			padding: '10px'
		},

		tbar: ['->', {
			xtype: 'app-settings-button',
			iconCls: 'tool-icon settings',
			text: 'Frida settings',

		    editProfileWindowConfig: {
		        xtype: 'app-edit-profile-window',
		        userInfoUrl: 'api/user/update.json',
		        width: 320,
		        modal: true
		    },

		    manageUsersWindowConfig: {
		        xtype: 'app-manage-users-window',
		        userListUrl: 'api/user/list.json',
				maxLicensesUrl: 'api/user/license.json',
		        width: 640,
		        height: 480,
		        minWidth: 640,
		        minHeight: 480,
		        modal: true,
		        collapsible: true,
		        maximizable: true
		    }
		}]
	}
});
