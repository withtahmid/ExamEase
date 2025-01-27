const { MongoClient } = require('mongodb');

// Replace 'your_database_name' with the name of your database
const databaseName = 'your_database_name';

async function dropAllCollections() {
  const uri = `mongodb+srv://withtahmid:MONGOPASS@cluster0.fenp9sy.mongodb.net/?retryWrites=true&w=majority`;

  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await client.connect();

    const database = client.db(databaseName);
    const collections = await database.listCollections().toArray();
    
    for (let collection of collections) {
      await database.collection(collection.name).drop();
      console.log(`Dropped collection: ${collection.name}`);
    }

    console.log('All collections dropped.');
  } catch (error) {
    console.error('Error dropping collections:', error);
  } finally {
    await client.close();
  }
}

// Call the function to drop collections
dropAllCollections();
