import React, { useState, useEffect } from 'react';

const TodoApp = () => {
  const [todos, setTodos] = useState([]); // State to store todos
  const [newTodo, setNewTodo] = useState(''); // State for new todo input
  const [editingTodo, setEditingTodo] = useState(null); // State for editing todo
  const [editInput, setEditInput] = useState(''); // State for edit input
  const API_URL = 'http://localhost:5000/api/todos'; // Backend API URL

  // Fetch all todos on component mount
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error('Failed to fetch todos');
        }
        const data = await response.json();
        setTodos(data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchTodos();
  }, []);

  // Add a new todo
  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTodo, completed: false }),
      });

      if (!response.ok) {
        throw new Error('Failed to add todo');
      }

      const createdTodo = await response.json();
      setTodos([...todos, createdTodo]);
      setNewTodo(''); // Clear input field
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Update a todo's completion status
  const handleToggleComplete = async (id, completed) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !completed }),
      });

      if (!response.ok) {
        throw new Error('Failed to update todo');
      }

      const updatedTodo = await response.json();
      setTodos(todos.map((todo) => (todo._id === id ? updatedTodo : todo)));
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Edit a todo
  const handleEditTodo = (todo) => {
    setEditingTodo(todo);
    setEditInput(todo.title);
  };

  const handleSaveEdit = async () => {
    if (!editInput.trim() || !editingTodo) return;

    try {
      const response = await fetch(`${API_URL}/${editingTodo._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editInput }),
      });

      if (!response.ok) {
        throw new Error('Failed to edit todo');
      }

      const updatedTodo = await response.json();
      setTodos(todos.map((todo) => (todo._id === editingTodo._id ? updatedTodo : todo)));
      setEditingTodo(null);
      setEditInput('');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Delete a todo
  const handleDeleteTodo = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete todo');
      }

      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <h1>To-Do List</h1>

      {/* Form to add new todo */}
      <form onSubmit={handleAddTodo} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Add a new to-do"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          style={{ padding: '10px', width: '80%', marginRight: '10px' }}
        />
        <button type="submit" style={{ padding: '10px' }}>Add</button>
      </form>

      {/* Edit todo form */}
      {editingTodo && (
        <div style={{ marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Edit to-do"
            value={editInput}
            onChange={(e) => setEditInput(e.target.value)}
            style={{ padding: '10px', width: '80%', marginRight: '10px' }}
          />
          <button onClick={handleSaveEdit} style={{ padding: '10px' }}>Save</button>
          <button onClick={() => setEditingTodo(null)} style={{ padding: '10px', marginLeft: '10px' }}>Cancel</button>
        </div>
      )}

      {/* List of todos */}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {todos.map((todo) => (
          <li
            key={todo._id}
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '10px',
              textDecoration: todo.completed ? 'line-through' : 'none',
            }}
          >
            <span style={{ flex: 1 }}>{todo.title}</span>
            <button
              onClick={() => handleToggleComplete(todo._id, todo.completed)}
              style={{ marginRight: '10px' }}
            >
              {todo.completed ? 'Undo' : 'Complete'}
            </button>
            <button
              onClick={() => handleEditTodo(todo)}
              style={{ marginRight: '10px' }}
            >
              Edit
            </button>
            <button onClick={() => handleDeleteTodo(todo._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoApp;
