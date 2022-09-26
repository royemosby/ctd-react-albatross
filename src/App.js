import React, { useEffect, useState } from 'react';
import TodoList from './components/TodoList';
import AddTodoForm from './components/AddTodoForm';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  const url = `https://api.airtable.com/v0/${process.env.REACT_APP_AIRTABLE_BASE_ID}/Default`;

  const [todoList, setTodoList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
    };
    fetch(url, options)
      .then((resp) => resp.json())
      .then((data) => {
        const todos = data.records.map((item) => ({
          id: item.id,
          title: item.fields.Title,
        }));
        const sortedTodos = todos.sort((a, b) => {
          if (a.title < b.title) {
            return -1;
          } else if (a.title > b.title) {
            return 1;
          } else {
            return 0;
          }
        });
        setTodoList([...todos]);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('savedTodoList', JSON.stringify(todoList));
    }
  }, [todoList, isLoading]);

  function addTodo(newTodo) {
    const title = newTodo.title;
    const postBody = {
      fields: {
        Title: title,
      },
      typecast: true,
    };
    const options = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postBody),
    };
    let todo = {};
    fetch(url, options)
      .then((resp) => resp.json())
      .then((data) => {
        todo.id = data.records[0].id;
        todo.title = data.records[0].fields.Title;
        console.log(todo);
      });
    setTodoList([...todoList, newTodo]);
  }

  function removeTodo(id) {
    setTodoList(todoList.filter((todo) => todo.id !== id));
  }

  function appSubComponent() {
    return (
      <div>
        <h1>Todo List</h1>
        <AddTodoForm onAddTodo={addTodo} />
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <TodoList todoList={todoList} onRemoveTodo={removeTodo} />
        )}
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={appSubComponent()}></Route>
        <Route path="/new" element={<h1>New todo list</h1>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
