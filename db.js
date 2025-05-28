const mongoose = require('mongoose');

const uri = `mongodb+srv://ashwathamanr6:0EqI3qLt4i8f1ix3@cluster0.82ryhpa.mongodb.net/`;



mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));
