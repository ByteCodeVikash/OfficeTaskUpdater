import React, { useState } from 'react';
import { FaPencilAlt, FaTrash } from 'react-icons/fa';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './Tasks.css';

const initialColumns = {
  'High Priority': [
    { id: 1, content: 'Task 1', completed: false },
    { id: 2, content: 'Task 2', completed: false },
  ],
  // Define initial tasks for other priorities if needed
};

const Tasks = () => {
  const [columns, setColumns] = useState(initialColumns);

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const { source, destination } = result;

    if (source.droppableId === destination.droppableId) {
      const updatedTasks = reorder(
        columns[source.droppableId],
        source.index,
        destination.index
      );

      setColumns({
        ...columns,
        [source.droppableId]: updatedTasks,
      });
    } else {
      // Logic to move tasks between different columns
      const sourceTasks = Array.from(columns[source.droppableId]);
      const destinationTasks = Array.from(columns[destination.droppableId]);
      const [removed] = sourceTasks.splice(source.index, 1);
      destinationTasks.splice(destination.index, 0, removed);

      setColumns({
        ...columns,
        [source.droppableId]: sourceTasks,
        [destination.droppableId]: destinationTasks,
      });
    }
  };

  const addTask = (column) => {
    const taskName = prompt('New Task:');
    if (taskName) {
      const newTask = { id: Date.now(), content: taskName, completed: false };
      setColumns({
        ...columns,
        [column]: [...columns[column], newTask]
      });
    }
  };

  const deleteTask = (columnKey, taskId) => {
    const updatedTasks = columns[columnKey].filter(task => task.id !== taskId);
    setColumns({ ...columns, [columnKey]: updatedTasks });
  };

  const editTask = (columnKey, task) => {
    const newContent = prompt('Edit Task:', task.content);
    if (newContent !== null) {
      const updatedTasks = columns[columnKey].map(t => {
        if (t.id === task.id) {
          return { ...t, content: newContent };
        }
        return t;
      });
      setColumns({ ...columns, [columnKey]: updatedTasks });
    }
  };

  const toggleCompleteTask = (columnKey, task) => {
    const updatedTasks = columns[columnKey].map(t => {
      if (t.id === task.id) {
        return { ...t, completed: !t.completed };
      }
      return t;
    });
    setColumns({ ...columns, [columnKey]: updatedTasks });
  };

  const addColumn = () => {
    const columnName = prompt('New Column Name:');
    if (columnName) {
      setColumns({ ...columns, [columnName]: [] });
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="task-board-wrapper">
        <div className="task-board">
          {Object.keys(columns).map((columnKey, columnIndex) => (
            <Droppable droppableId={columnKey} key={columnKey}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="column"
                >
                  <div className="column-header">
                    {columnKey} ({columns[columnKey].length} tasks)
                    <button onClick={() => addTask(columnKey)}>+</button>
                  </div>
                  {columns[columnKey].map((task, taskIndex) => (
                    <Draggable key={task.id} draggableId={String(task.id)} index={taskIndex}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`task ${task.completed ? 'completed' : ''}`}
                        >
                          <input 
                            type="checkbox" 
                            checked={task.completed} 
                            onChange={() => toggleCompleteTask(columnKey, task)} 
                          />
                          <span>{task.content}</span>
                          <FaPencilAlt onClick={() => editTask(columnKey, task)} />
                          <FaTrash onClick={() => deleteTask(columnKey, task.id)} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
        <button className="create-board-button" onClick={addColumn}>
          + Create a new board
        </button>
      </div>
    </DragDropContext>
  );
};

export default Tasks;
