import React, { useState } from 'react';
import style from './TodoListItem.module.css';
import PropTypes from 'prop-types';
import EditTodoItem from './EditTodoItem';

export default function ToDoListItem({ todo, onRemoveTodo, onUpdateTodo }) {
  const { title, id } = todo;
  const [isEditable, setIsEditable] = useState(false);

  const toggleEdit = (evt) => {
    if (evt.detail == 2) {
      setIsEditable(!isEditable);
    }
  };

  const renderByEditablility = () => {
    if (!isEditable) {
      return (
        <>
          <span onClick={(evt) => toggleEdit(evt)}>{title}</span>
          <button onClick={() => onRemoveTodo(id)}>Remove</button>
        </>
      );
    } else {
      return (
        <EditTodoItem
          todo={todo}
          onUpdateTodo={onUpdateTodo}
          closeEdit={setIsEditable}
        />
      );
    }
  };

  return (
    <li className={style.ListItem} key={id}>
      {renderByEditablility()}
    </li>
  );
}

ToDoListItem.propTypes = {
  todo: PropTypes.object,
  onRemoveTodo: PropTypes.func,
};
