const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://withtahmid:MONGOPASS@cluster0.fenp9sy.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Bokra = require('./models/Cohort');


// (async () => {
//     try {
//       const result = await Bokra.deleteMany({});
//       console.log('Deleted', result.deletedCount, 'documents in the collection.');
//     } catch (error) {
//       console.error('Error deleting documents:', error);
//     } finally {
//       mongoose.connection.close();
//     }
//   })();
  

//   const User = Bokra

// // Drop the existing index on the "email" field
// User.collection.dropIndex({ "email": 1 }, (err, result) => {
//   if (err) {
//     console.error("Error dropping index:", err);
//   } else {
//     console.log("Index dropped successfully:", result);

//     // Recreate the unique index on the "email" field
//     User.collection.createIndex({ "email": 1 }, { unique: true }, (err, result) => {
//       if (err) {
//         console.error("Error creating index:", err);
//       } else {
//         console.log("Index created successfully:", result);
//       }
//     });
//   }
// });

// Replace 'your_database_name' with the name of your database
// const databaseName = 'your_database_name';

// // Connect to the MongoDB database
// mongoose.connect(`mongodb://localhost/${databaseName}`, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// Function to drop all collections in the database
// async function dropAllCollections() {
//   try {
//     // Wait for the database connection to be established
//     await mongoose.connection;

//     const collections = await mongoose.connection.db.listCollections().toArray();

//     for (let collection of collections) {
//       await mongoose.connection.db.dropCollection(collection.name);
//       console.log(`Dropped collection: ${collection.name}`);
//     }

//     console.log('All collections dropped.');
//   } catch (error) {
//     console.error('Error dropping collections:', error);
//   } finally {
//     // Close the database connection
//     mongoose.connection.close();
//   }
// }

// // Call the function to drop collections
// dropAllCollections();


async function printAllDocuments() {
  try {
    // Use the find method to retrieve all documents in the collection
    const allDocuments = await Bokra.find({});

    // Print each document
    allDocuments.forEach((document) => {
      console.log(document);
    });

    console.log('All documents printed.');
  } catch (error) {
    console.error('Error:', error);
  }
}

// Call the async function to print all documents
printAllDocuments();
  
  
  
  
  