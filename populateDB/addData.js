const XLSX = require('xlsx');
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

// Connection URL and database name
const url = 'mongodb+srv://amoghsv:m9Niqwi33oTc9r1t@cluster0.cwqcvrn.mongodb.net/?retryWrites=true&w=majority';
const dbName = 'TradeTrove';

// Create a new MongoClient instance
const client = new MongoClient(url);

// Excel sheet file path
const filePath = 'output.xlsx';

// Excel sheet column names to MongoDB field name mapping
const fieldMapping = {
  'product_name': 'title',
  'image': 'image',
  'description': 'description',
  'retail_price': 'price',
  'brand': 'uploader'
};

// Function to read data from Excel sheet and insert into MongoDB
// Function to read data from Excel sheet and insert into MongoDB
async function readExcelAndInsertIntoMongoDB() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(dbName);

    // Read data from Excel sheet
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // Insert data into MongoDB
    const collection = db.collection('items');
    const result = await collection.insertMany(
      sheetData.map((row) => {
        const mappedRow = {};
        for (const [key, value] of Object.entries(row)) {
          if (key in fieldMapping) {
            if (key === 'image') {
              mappedRow[fieldMapping[key]] = value.split(',')[0].trim().replace(/"|]/g, '').replace("[", "");
            } else {
              mappedRow[fieldMapping[key]] = value;
            }
          }
        }
        return mappedRow;
      })
    );
    console.log(`Inserted ${result.insertedCount} documents into the collection`);
  } catch (error) {
    console.error(error);
  } finally {
    // Close the client connection
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}


// Call the function to read data from Excel sheet and insert into MongoDB
readExcelAndInsertIntoMongoDB();
