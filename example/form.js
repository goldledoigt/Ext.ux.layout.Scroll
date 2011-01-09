var form = new Ext.FormPanel({
    labelWidth: 75,
	padding:"5",
	border:false,
    defaults: {anchor:"0"},
    defaultType: 'textfield',
    items: [{
            fieldLabel: 'First Name',
            name: 'first',
            allowBlank:false
        },{
            fieldLabel: 'Last Name',
            name: 'last'
        },{
            fieldLabel: 'Company',
            name: 'company'
        }, {
            fieldLabel: 'Email',
            name: 'email',
            vtype:'email'
        }, new Ext.form.TimeField({
            fieldLabel: 'Time',
            name: 'time',
            minValue: '8:00am',
            maxValue: '6:00pm'
        })
    ],

    buttons: [{
        text: 'Save'
    },{
        text: 'Cancel'
    }]
});
