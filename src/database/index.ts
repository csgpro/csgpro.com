'use strict';

import * as Sequelize from 'sequelize';
import * as conf from 'nconf';

conf.env().file({ file: __dirname + '/../../settings.json' });

const DB_DIALECT    = conf.get('DB_DIALECT'),
      DB_HOST       = conf.get('DB_HOST'),
      DB_PORT       = conf.get('DB_PORT'),
      DB_DATABASE   = conf.get('DB_DATABASE'),
      DB_USER       = conf.get('DB_USER'),
      DB_PASSWORD   = conf.get('DB_PASSWORD');
      

export var sequelize: Sequelize.Sequelize = new Sequelize(DB_DATABASE, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: DB_DIALECT,
    dialectOptions: {
        encrypt: true
    }
});

export function columnExists(table: string, column: string): Promise<boolean> {
    let query = `SELECT column_name 
                 FROM information_schema.columns 
                 WHERE table_name='${table}' and column_name='${column}'`;
    
    return sequelize.query(query).spread<boolean>((results: any, metadata: any) => {
        return (results && results.length);
    });
}