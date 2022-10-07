import React, { useState, useRef, useEffect } from 'react';

export default function EditTodoItem({ todo, onUpdateTodo, closeEdit }) {
  const [todoTitle, updateTitle] = useState(todo.title);

  const inputRef = useRef();

  useEffect(() => {
    inputRef.current.focus();
  });

  const handleUpdateTodo = (evt) => {
    evt.preventDefault();
    const updatedTodo = {
      id: todo.id,
      title: todoTitle,
    };
    onUpdateTodo(updatedTodo, closeEdit);
  };

  const handleCancel = () => {
    closeEdit();
  };

  return (
    <form onSubmit={(evt) => handleUpdateTodo(evt)}>
      <label htmlFor="item">Editing: </label>
      <input
        ref={inputRef}
        type="text"
        value={todoTitle}
        onChange={(evt) => updateTitle(evt.target.value)}
      />
      <input type="submit" value="Update" />
      <button type="button" onClick={handleCancel}>
        Cancel
      </button>
    </form>
  );
}
