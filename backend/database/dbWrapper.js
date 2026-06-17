const fs = require('fs');
const path = require('path');

const JSON_DB_DIR = path.join(__dirname, 'json');

// Ensure JSON directory exists
if (!fs.existsSync(JSON_DB_DIR)) {
  fs.mkdirSync(JSON_DB_DIR, { recursive: true });
}

// Helper to read a collection file and ensure all items have IDs
function readCollection(collectionName) {
  const filePath = path.join(JSON_DB_DIR, `${collectionName}.json`);
  if (!fs.existsSync(filePath)) {
    // If file doesn't exist, return empty array
    return [];
  }
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    const parsed = JSON.parse(data);
    
    // Ensure every item has a unique ID to prevent saving failure
    let needsRewrite = false;
    const fixed = parsed.map(item => {
      if (!item._id && !item.id) {
        needsRewrite = true;
        return {
          _id: 'seed-' + Math.random().toString(36).substring(2, 11),
          ...item
        };
      }
      return item;
    });

    if (needsRewrite) {
      // Synchronously write back the modified items with IDs
      const tempPath = path.join(JSON_DB_DIR, `${collectionName}.json`);
      fs.writeFileSync(tempPath, JSON.stringify(fixed, null, 2), 'utf8');
    }

    return fixed;
  } catch (err) {
    console.error(`Error reading collection ${collectionName}:`, err);
    return [];
  }
}

// Helper to write a collection file
function writeCollection(collectionName, data) {
  const filePath = path.join(JSON_DB_DIR, `${collectionName}.json`);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error(`Error writing collection ${collectionName}:`, err);
  }
}

class JsonCollection {
  constructor(name, defaultData = []) {
    this.name = name;
    // Seed default data if file does not exist or is empty
    const filePath = path.join(JSON_DB_DIR, `${name}.json`);
    if (!fs.existsSync(filePath) || fs.readFileSync(filePath, 'utf8').trim() === '' || fs.readFileSync(filePath, 'utf8').trim() === '[]') {
      writeCollection(name, defaultData);
    }
  }

  async find(query = {}) {
    const data = readCollection(this.name);
    return data.filter(item => {
      for (let key in query) {
        if (query[key] !== item[key]) return false;
      }
      return true;
    });
  }

  async findOne(query = {}) {
    const data = readCollection(this.name);
    return data.find(item => {
      for (let key in query) {
        if (query[key] !== item[key]) return false;
      }
      return true;
    }) || null;
  }

  async findById(id) {
    const data = readCollection(this.name);
    const idStr = String(id);
    return data.find(item => String(item._id || item.id) === idStr) || null;
  }

  async create(doc) {
    const data = readCollection(this.name);
    const newDoc = {
      _id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
      ...doc,
      createdAt: new Date().toISOString()
    };
    data.push(newDoc);
    writeCollection(this.name, data);
    return newDoc;
  }

  async findByIdAndUpdate(id, update, options = { new: true }) {
    const data = readCollection(this.name);
    const idStr = String(id);
    const index = data.findIndex(item => String(item._id || item.id) === idStr);
    if (index === -1) return null;

    // Apply updates
    const updatedDoc = {
      ...data[index],
      ...update,
      updatedAt: new Date().toISOString()
    };
    data[index] = updatedDoc;
    writeCollection(this.name, data);
    return updatedDoc;
  }

  async findByIdAndDelete(id) {
    const data = readCollection(this.name);
    const idStr = String(id);
    const index = data.findIndex(item => String(item._id || item.id) === idStr);
    if (index === -1) return null;

    const deletedDoc = data[index];
    const filtered = data.filter(item => String(item._id || item.id) !== idStr);
    writeCollection(this.name, filtered);
    return deletedDoc;
  }

  async deleteMany(query = {}) {
    let data = readCollection(this.name);
    data = data.filter(item => {
      for (let key in query) {
        if (query[key] === item[key]) return false; // Delete matched
      }
      return true;
    });
    writeCollection(this.name, data);
    return { deletedCount: data.length };
  }
}

module.exports = {
  JsonCollection,
  readCollection,
  writeCollection
};
