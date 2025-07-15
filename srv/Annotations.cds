using material from '../db/schema';

annotate material.Material with @(

    UI.SelectionFields: [
        material,
        description,
        tipo,
        grupo
    ],

    UI.LineItem       : [
        {
            $Type: 'UI.DataField',
            Value: material,
        },
        {
            $Type: 'UI.DataField',
            Value: description,
        },
        {
            $Type: 'UI.DataField',
            Value: tipo,
        },
        {
            $Type: 'UI.DataField',
            Value: grupo,
        }
    ]


);
