module.exports = function(app, sync) {

    /*
    where: {
    id: {
      $and: {a: 5}           // AND (a = 5)
      $or: [{a: 5}, {a: 6}]  // (a = 5 OR a = 6)
      $gt: 6,                // id > 6
      $gte: 6,               // id >= 6
      $lt: 10,               // id < 10
      $lte: 10,              // id <= 10
      $ne: 20,               // id != 20
      $between: [6, 10],     // BETWEEN 6 AND 10
      $notBetween: [11, 15], // NOT BETWEEN 11 AND 15
      $in: [1, 2],           // IN [1, 2]
      $notIn: [1, 2],        // NOT IN [1, 2]
      $like: '%hat',         // LIKE '%hat'
      $notLike: '%hat'       // NOT LIKE '%hat'
      $iLike: '%hat'         // ILIKE '%hat' (case insensitive)  (PG only)
      $notILike: '%hat'      // NOT ILIKE '%hat'  (PG only)
      $overlap: [1, 2]       // && [1, 2] (PG array overlap operator)
      $contains: [1, 2]      // @> [1, 2] (PG array contains operator)
      $contained: [1, 2]     // <@ [1, 2] (PG array contained by operator)
      $any: [2,3]            // ANY ARRAY[2, 3]::INTEGER (PG only)
    },
    status: {
      $not: false,           // status NOT FALSE
    }
  }


    */
    var sequelize = app.sequelize;
    var dataTypes = app.Sequelize;


    var packs = sequelize.define('packs', {
        sku: dataTypes.STRING(255),
        title: dataTypes.STRING(255),
        outstanding: dataTypes.BOOLEAN,
        hits: dataTypes.INTEGER,
        price: dataTypes.INTEGER,
        setup: dataTypes.JSON,
        bonus_discount: dataTypes.INTEGER,
        bonus_hits: dataTypes.INTEGER,
        description: dataTypes.TEXT,
        currency: dataTypes.STRING(10)
    }, {
        tableName: 'packs'
    });

    var invoice = sequelize.define('invoice', {
        price: dataTypes.STRING(255),
        payment: dataTypes.ENUM('webpay'),
        status: dataTypes.ENUM('pending', 'accepted', 'rejected'),
        currency: dataTypes.STRING(10),
    }, {
        tableName: 'invoice'
    });



    var sales = sequelize.define('sales', {
        ESTADO: dataTypes.STRING(255),
        TBK_ORDEN_COMPRA: dataTypes.STRING(255),
        TBK_TIPO_TRANSACCION: dataTypes.STRING(255),
        TBK_RESPUESTA: dataTypes.STRING(255),
        TBK_MONTO: dataTypes.STRING(255),
        TBK_CODIGO_AUTORIZACION: dataTypes.STRING(255),
        TBK_FINAL_NUMERO_TARJETA: dataTypes.STRING(255),
        TBK_FECHA_CONTABLE: dataTypes.STRING(255),
        TBK_FECHA_TRANSACCION: dataTypes.STRING(255),
        TBK_HORA_TRANSACCION: dataTypes.STRING(255),
        TBK_ID_SESION: dataTypes.STRING(255),
        TBK_ID_TRANSACCION: dataTypes.STRING(255),
        TBK_TIPO_PAGO: dataTypes.STRING(255),
        TBK_NUMERO_CUOTAS: dataTypes.STRING(255),
        TBK_VCI: dataTypes.STRING(255),
        TBK_MAC: dataTypes.STRING(255),
        COMENTARIO_TRANSACCION: dataTypes.STRING(255),
        USING_CREDITS: dataTypes.STRING(255),
        ORIGIN: dataTypes.ENUM('web', 'app'),
        CURRENCY: dataTypes.STRING(10)
    }, {
        tableName: 'sales'
    });


    // packs

    packs.hasMany(sales, {
        foreignKey: 'id_packs',
        as: 'sales'
    });

    // sales

    sales.belongsTo(packs, {
        foreignKey: 'id_packs',
        as: 'sales'
    });

    sales.belongsTo(invoice, {
        foreignKey: 'id_invoice',
        as: 'invoice'
    });

    //invoice

    invoice.hasMany(sales, {
        foreignKey: 'id_invoice',
        as: 'sales'
    });



    app.schemas = {
        invoice: invoice,
        sales: sales,
        packs: packs
    };

    //para sincronizar base de datos descomentar esta lineas


/*
    
    sequelize.drop({ force: true }).then(function() {
        console.log("Database dropped");
        sequelize.sync({ force: true }).then(function() {
            console.log("Database create");
            app.schemas.packs.bulkCreate([{
                sku: 'BRONCLP',
                title: 'Pack Bronce',
                outstanding: 0,
                description: 'Incluye 4 cosas',
                hits: 4,
                price: 1000,
                currency: 'CLP',
                bonus_discount: 0,
                bonus_hits: 0
            }, {
                sku: 'SILVERCLP',
                title: 'Pack Plata',
                outstanding: 1,
                description: 'Incluye 10 cosas, mas 2 de regalo',
                hits: 10,
                price: 2500,
                currency: 'CLP',
                bonus_discount: 0,
                bonus_hits: 2
            }, {
                sku: 'GOLDCLP',
                title: 'Pack Gold',
                outstanding: 0,
                description: 'Incluye 15 cosas.',
                hits: 15,
                price: 4000,
                currency: 'CLP',
                bonus_discount: 0,
                bonus_hits: 0
            }, {
                sku: 'PLATCLP',
                title: 'Pack Platino',
                outstanding: 0,
                description: 'Incluye 40 cosas y 7% de descuento',
                hits: 40,
                price: 10000,
                currency: 'CLP',
                bonus_discount: 7,
                bonus_hits: 0
            }])

        });
    });
    
    */

};
