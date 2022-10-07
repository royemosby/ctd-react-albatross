import React, { useEffect, useState } from 'react';
import TodoList from './components/TodoList';
import AddTodoForm from './components/AddTodoForm';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import albatross from './assets/albatross.svg';

function App() {
  const url = `https://api.airtable.com/v0/${process.env.REACT_APP_AIRTABLE_BASE_ID}/Default`;

  const [todoList, setTodoList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_AIRTABLE_API_KEY}`,
      },
    };
    fetch(url, options)
      .then((resp) => resp.json())
      .then((data) => {
        const todos = data.records.map((item) => ({
          id: item.id,
          title: item.fields.Title,
        }));
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
    const body = {
      fields: {
        Title: newTodo.title,
      },
    };
    const options = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_AIRTABLE_API_KEY}`,
        'Content-type': 'application/json',
      },
      body: JSON.stringify(body),
    };
    const todo = {};
    fetch(url, options)
      .then((resp) => resp.json())
      .then((data) => {
        todo.id = data.id;
        todo.title = data.fields.Title;
        setTodoList([...todoList, todo]);
      });
  }

  function removeTodo(id) {
    const options = {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_AIRTABLE_API_KEY}`,
        'Content-type': 'application/json',
      },
    };
    fetch(`${url}/${id}`, options)
      .then((resp) => resp.json())
      .then((data) => {
        if (data.deleted) {
          setTodoList(todoList.filter((todo) => todo.id !== data.id));
        }
      });
  }

  function updateTodo(
    todo,
    callback = function () {
      console.log('updated');
    }
  ) {
    const body = {
      records: [
        {
          id: todo.id,
          fields: {
            Title: todo.title,
          },
        },
      ],
    };
    const options = {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_AIRTABLE_API_KEY}`,
        'Content-type': 'application/json',
      },
      body: JSON.stringify(body),
    };
    fetch(url, options)
      .then((resp) => resp.json())
      .then((data) => {
        const updatedTodo = {
          title: data.records[0].fields.Title,
          id: data.records[0].id,
        };
        const updatedTodoList = todoList.map((todo) => {
          if (todo.id === updatedTodo.id) {
            return updatedTodo;
          } else {
            return todo;
          }
        });
        setTodoList([...updatedTodoList]);
        callback();
      });
  }

  function appSubComponent() {
    return (
      <div>
        <h1>
          Todo List
          <img src={albatross} alt="" />
        </h1>
        <AddTodoForm onAddTodo={addTodo} />
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <TodoList
            todoList={todoList}
            onRemoveTodo={removeTodo}
            onUpdateTodo={updateTodo}
          />
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
