import React from 'react';
import ToDoListItem from './TodoListItem';
import PropTypes from 'prop-types';

export default function TodoList({ todoList, onRemoveTodo, onUpdateTodo }) {
  return (
    <ul>
      {todoList.map((todo) => (
        <ToDoListItem
          key={todo.id}
          todo={todo}
          onRemoveTodo={onRemoveTodo}
          onUpdateTodo={onUpdateTodo}
        />
      ))}
    </ul>
  );
}

TodoList.propTypes = {
  todoList: PropTypes.array,
  onRemoveTodo: PropTypes.func,
};
