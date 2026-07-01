import './App.css';
import logo from './logo.svg';
import { useState, useEffect, useCallback } from 'react';
import {fetchTodos,createTodo} from './api';

export function App() {

 const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const loadTodos = useCallback(() => {
    setIsLoading(true);
    return fetchTodos()
      .then((data) => {
        setTodos(data);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;

    setIsSubmitting(true);
    createTodo(trimmed)
      .then(() => {
        setText('');
        return loadTodos();
      })
      .catch((err) => setError(err.message))
      .finally(() => setIsSubmitting(false));
  };



   return (
    <div className="App">
      <div>
        <h1>List of TODOs</h1>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <ul>
            {todos.length === 0 && <li>No todos yet</li>}
            {todos.map((todo) => (
              <li key={todo.id}>{todo.text}</li>
            ))}
          </ul>
        )}
      </div>
      <div>
        <h1>Create a ToDo</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="todo">ToDo: </label>
            <input
              id="todo"
              type="text"
              value={text}
              onChange={(event) => setText(event.target.value)}
            />
          </div>
          <div style={{ marginTop: '5px' }}>
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add ToDo!'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;