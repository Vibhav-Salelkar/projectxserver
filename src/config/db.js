const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://projectx:projectx321@projectx.3ipk1az.mongodb.net/ProjectX");
}

module.exports = { connectDB };
