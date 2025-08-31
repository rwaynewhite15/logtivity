import { useEffect, useState } from 'react';
import axios from 'axios';

// Point Axios at our API
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

function App() {
  const [exercise, setExercise] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [duration, setDuration] = useState('');
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load existing workouts on first render
  useEffect(() => {
    api.get('/workouts')
      .then(res => setWorkouts(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // Handle form submit
  const addWorkout = async (e) => {
    e.preventDefault();
    const name = exercise.trim();
    if (!name) return;

    try {
      const payload = { 
        exercise: String(name),
        sets: sets ? parseInt(sets) : 0,
        reps: reps ? parseInt(reps) : 0,
        weight: weight ? parseInt(weight) : 0,
        duration: weight ? parseInt(duration) : 0
      };
      
      const res = await api.post('/workouts', payload);
      setWorkouts([res.data, ...workouts]);
      
      // Clear form
      setExercise('');
      setSets('');
      setReps('');
      setWeight('');
      setDuration('');
    } catch (err) {
      console.error(err);
      alert('Failed to save workout');
    }
  };

  // Delete workout function
  const deleteWorkout = async (id) => {
    if (!window.confirm('Are you sure you want to delete this activity?')) {
      return;
    }

    try {
      await api.delete(`/workouts/${id}`);
      setWorkouts(workouts.filter(w => w._id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete activity');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  return (
    <div style={{ maxWidth: 1600, margin: 'auto', fontFamily: 'system-ui, Arial, sans-serif' }}>
      <h1
      style={{   color: '#3acf84ff'}}>Logtivity</h1>
      <h2
      style={{   color: '#3acf84ff'}}>Log your Personal Best Activity</h2>

      <form onSubmit={addWorkout} style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 100px',
        gap: 8, 
        marginBottom: 24,
        alignItems: 'end'
      }}>
        <input
          placeholder="Exercise (e.g., Push-ups)"
          value={exercise}
          onChange={(e) => setExercise(e.target.value)}
          style={{ padding: 8, border: '1px solid #ccc', borderRadius: 4 }}
          required
        />
        <input
          placeholder="Sets"
          type="number"
          value={sets}
          onChange={(e) => setSets(e.target.value)}
          style={{ padding: 8, border: '1px solid #ccc', borderRadius: 4 }}
        />
        <input
          placeholder="Reps"
          type="number"
          value={reps}
          onChange={(e) => setReps(e.target.value)}
          style={{ padding: 8, border: '1px solid #ccc', borderRadius: 4 }}
        />
        <input
          placeholder="Weight (lbs)"
          type="number"
          step="5"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          style={{ padding: 8, border: '1px solid #ccc', borderRadius: 4 }}
        />
        <input
          placeholder="Duration (mins)"
          type="number"
          step="0.5"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          style={{ padding: 8, border: '1px solid #ccc', borderRadius: 4 }}
        />
        <button type="submit" style={{color: '#3acf84ff', padding:'8px 12px', border: '1px solid #ccc'}}>Add</button>
      </form>

      {loading ? (
        <p>Loading...</p>
      ) : workouts.length === 0 ? (
        <p>No workouts yet. Add your first one!</p>
      ) : (
        <div>
          {workouts.map(w => (
            <div key={w._id} style={{ 
              marginBottom: 16, 
              padding: 16,
              backgroundColor: '#191949ff',
              borderRadius: 8,
              border: '1px solid #e9ecef',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start'
            }}>
              <div style={{ flex: 1}}>
                <h3 style={{ margin: '0 0 8px 0', color: '#3acf84ff' }}>
                  {w.exercise}
                </h3>
                
                <div style={{ 
                  display: 'flex', 
                  gap: 16, 
                  marginBottom: 8,
                  flexWrap: 'wrap'
                }}>
                  {w.sets > 0 && (
                    <span style={{ 
                      backgroundColor: '#1c6359ff', 
                      padding: '4px 8px', 
                      borderRadius: 4,
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}>
                      {w.sets} sets
                    </span>
                  )}
                  
                  {w.reps > 0 && (
                    <span style={{ 
                      backgroundColor: '#1c6359ff', 
                      padding: '4px 8px', 
                      borderRadius: 4,
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}>
                      {w.reps} reps
                    </span>
                  )}
                  
                  {w.weight > 0 && (
                    <span style={{ 
                      backgroundColor: '#1c6359ff', 
                      padding: '4px 8px', 
                      borderRadius: 4,
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}>
                      {w.weight} lbs
                    </span>
                  )}

                  {w.duration > 0 && (
                    <span style={{ 
                      backgroundColor: '#1c6359ff', 
                      padding: '4px 8px', 
                      borderRadius: 4,
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}>
                      {w.duration} mins
                    </span>
                  )}
                </div>

                <small style={{ color: '#666' }}>
                  Date Created: {formatDate(w.date)}
                </small>
              </div>
              
              <button 
                onClick={() => deleteWorkout(w._id)}
                style={{ 
                  color: '#e8f5e8', 
                  border: '1px solid #dc3545', 
                  background: '#1c6359ff', 
                  cursor: 'pointer',
                  padding: '6px 10px',
                  borderRadius: 4,
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}
                title="Delete workout"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      {workouts.length > 0 && (
        <div style={{ 
          marginTop: 32, 
          padding: 16, 
          backgroundColor: '#341a66ff', 
          borderRadius: 8,
          border: '1px solid #ffeaa7' 
        }}>
          <h3 style={{ margin: '0 0 8px 0' }}>📊 Summary</h3>
          <p style={{ margin: 0 }}>
            <strong>{workouts.length}</strong> total workouts • 
            <strong> {workouts.reduce((sum, w) => sum + (w.sets || 0), 0)}</strong> total sets • 
            <strong> {workouts.reduce((sum, w) => sum + (w.reps || 0), 0)}</strong> total reps
          </p>
        </div>
      )}
    </div>
  );
}

export default App;