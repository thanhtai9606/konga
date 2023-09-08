'use strict';

var _ = require("lodash");
var async = require("async");

/**
 * Default model configuration
 * (sails.config.models)
 *
 * Unless you override them, the following properties will be included
 * in each of your models.
 *
 * For more info on Sails models, see:
 * http://sailsjs.org/#/documentation/concepts/ORM
 */
module.exports.models = {
    datastore: 'default',
    migrate: 'alter',
    fetchRecordsOnUpdate: true,
    fetchRecordsOnDestroy: true,
    fetchRecordsOnCreate: true,
    fetchRecordsOnCreateEach: true,

    updateOrCreate: function(criteria, values, cb){
        var self = this; // reference for use by callbacks
        // If no values were specified, use criteria
        if (!values) values = criteria.where ? criteria.where : criteria;

        this.findOne(criteria, function (err, result){
            if(err) return cb(err, false);

            if(result){
                self.update(criteria, values, cb);
            }else{
                self.create(values, cb);
            }
        });
    },

    /**
     * This method adds records to the database
     *
     * To use add a variable 'seedData' in your model and call the
     * method in the bootstrap.js file
     */
    seed: async function () {
        var self = this;
        var modelName = this.identity.charAt(0).toUpperCase() + this.identity.slice(1);
        
        if (!self.seedData) {
            sails.log.debug('No data available to seed ' + modelName);            
            return;
        }

        var count = await self.count();            

        if(count === 0) {
            sails.log.debug('Seeding ' + modelName + '...');
            if (self.seedData instanceof Array) {
                await self.seedArray();
            } else {
                await self.seedObject();
            }
        }else{
            if(modelName === 'Emailtransport') {
                // Update records
                await self.updateRecords();
            }else{
                sails.log.debug(modelName + ' had models, so no seed needed');                   
            }
        }
    },

    updateRecords : async function () {
        var self = this;
        var results = await self.find({});

        var data = [];

        self.seedData.forEach(function (seed) {

            const updateItem = _.find(results, (item) => {
                return item.name === seed.name;
            })

            if(updateItem) data.push(_.merge(seed, updateItem));
        });

        data.forEach(async function (item) {            
            await self.update({
                id :item.id
            },_.omit(item, ["id"]));            
        });
    },

    seedArray: async function () {
        var self = this;
        var modelName = self.identity.charAt(0).toUpperCase() + self.identity.slice(1);
        await self.createEach(self.seedData)
        sails.log.debug(modelName + ' seed planted');                
    },
    seedObject: async function () {
        var self = this;
        var modelName = self.identity.charAt(0).toUpperCase() + self.identity.slice(1);
        await self.create(self.seedData);
        sails.log.debug(modelName + ' seed planted');      
    }
};
