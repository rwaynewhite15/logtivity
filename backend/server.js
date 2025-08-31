import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log("MongoDB Connected"))
.catch(err => console.error(err));

// Schema
const activitySchema = new mongoose.Schema({
  exercise: String,
  sets: Number,
  reps: Number,
  weight: Number,
  duration: Number,
  date: { type: Date, default: Date.now }
});

const Workout = mongoose.model("Workout", activitySchema);

// Routes
app.get("/api/workouts", async (req, res) => {
  const workouts = await Workout.find();
  res.json(workouts);
});

// app.post("/api/workouts", async (req, res) => {
//   const workout = new Workout(req.body);
//   await workout.save();
//   res.json(workout);
// });
app.post('/api/workouts', async (req, res) => {
  try {
    console.log('Received data:', req.body); // Debug log
    
    const workout = new Workout({
      exercise: req.body.exercise,
      sets: req.body.sets || 0,
      reps: req.body.reps || 0,
      weight: req.body.weight || 0,
      duration: req.body.duration || 0 // Make sure this is here
    });
    
    const savedWorkout = await workout.save();
    console.log('Saved workout:', savedWorkout); // Debug log
    res.json(savedWorkout);
  } catch (error) {
    console.error('Save error:', error);
    res.status(500).json({ error: error.message });
  }
});


app.delete('/api/workouts/:id', async (req, res) => {
  try {
    await Workout.findByIdAndDelete(req.params.id);
    res.json({ message: 'Workout deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
