const mongoose = require('mongoose');

// 1. Connect to MongoDB
mongoose.connect("mongodb+srv://pratik:pratik123@cluster0.r2w5uow.mongodb.net/testdb?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Connected'))
.catch((err) => console.error('❌ MongoDB Connection Error:', err));

// 2. Define Schema
const Schema = mongoose.Schema;
const userSchema = new Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  company: String,
  verified: String
});

// 3. Create Model
const User = mongoose.model('Users', userSchema);


module.exports = User;
