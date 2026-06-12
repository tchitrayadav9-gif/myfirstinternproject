const mongoose = require('mongoose');
const { JsonCollection } = require('../database/dbWrapper');

function createModel(modelName, schemaDefinition, defaultData = []) {
  let mongooseModel = null;
  let jsonCollection = null;

  const getTarget = () => {
    if (global.useJsonDb) {
      if (!jsonCollection) {
        // e.g. "User" -> "users", "Employee" -> "employees"
        const colName = modelName.toLowerCase() + 's';
        jsonCollection = new JsonCollection(colName, defaultData);
      }
      return jsonCollection;
    } else {
      if (!mongooseModel) {
        let schema;
        if (schemaDefinition instanceof mongoose.Schema) {
          schema = schemaDefinition;
        } else {
          schema = new mongoose.Schema(schemaDefinition, { timestamps: true });
        }
        
        mongooseModel = mongoose.models[modelName] || mongoose.model(modelName, schema);
        
        // Seed default database asynchronously if it is empty
        mongooseModel.countDocuments()
          .then(count => {
            if (count === 0 && defaultData.length > 0) {
              console.log(`Seeding initial data for Mongoose collection: ${modelName}s`);
              mongooseModel.insertMany(defaultData)
                .catch(err => console.error(`Error seeding Mongoose ${modelName}:`, err));
            }
          })
          .catch(err => {
            console.error(`Error checking count for seeding ${modelName}:`, err);
          });
      }
      return mongooseModel;
    }
  };

  return {
    find: async (query = {}) => {
      const target = getTarget();
      return target.find(query);
    },
    findOne: async (query = {}) => {
      const target = getTarget();
      return target.findOne(query);
    },
    findById: async (id) => {
      const target = getTarget();
      if (global.useJsonDb) {
        return target.findById(id);
      } else {
        // Handle potential invalid ObjectId crash in mongoose
        try {
          return await target.findById(id);
        } catch (e) {
          return null;
        }
      }
    },
    create: async (data) => {
      const target = getTarget();
      return target.create(data);
    },
    findByIdAndUpdate: async (id, update, options = { new: true }) => {
      const target = getTarget();
      if (global.useJsonDb) {
        return target.findByIdAndUpdate(id, update, options);
      } else {
        try {
          return await target.findByIdAndUpdate(id, update, options);
        } catch (e) {
          return null;
        }
      }
    },
    findByIdAndDelete: async (id) => {
      const target = getTarget();
      if (global.useJsonDb) {
        return target.findByIdAndDelete(id);
      } else {
        try {
          return await target.findByIdAndDelete(id);
        } catch (e) {
          return null;
        }
      }
    },
    deleteMany: async (query = {}) => {
      const target = getTarget();
      return target.deleteMany(query);
    }
  };
}

module.exports = createModel;
