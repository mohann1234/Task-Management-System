import React from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { useTask } from '../../context/TaskContext';
import TaskCard from './TaskCard';
import { TaskStatus } from '../../types';
import { getStatusTitle, getStatusColor } from '../../utils/taskUtils';

const columns: { id: TaskStatus; title: string }[] = [
  { id: 'todo', title: 'To Do' },
  { id: 'inProgress', title: 'In Progress' },
  { id: 'done', title: 'Done' }
];

function TaskBoard() {
  const { getTasksByStatus, dispatch } = useTask();
  
  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    
    // If no destination or dropped in the same place
    if (!destination || 
        (destination.droppableId === source.droppableId && 
         destination.index === source.index)) {
      return;
    }
    
    // Update task status
    dispatch({
      type: 'MOVE_TASK',
      payload: {
        taskId: draggableId,
        newStatus: destination.droppableId as TaskStatus
      }
    });
    
    // Mark task as completed if moved to "done"
    if (destination.droppableId === 'done') {
      dispatch({ type: 'COMPLETE_TASK', payload: draggableId });
    }
    
    // Mark task as not completed if moved from "done"
    if (source.droppableId === 'done' && destination.droppableId !== 'done') {
      dispatch({ type: 'UNCOMPLETE_TASK', payload: draggableId });
    }
  };
  
  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {columns.map((column) => {
          const tasks = getTasksByStatus(column.id);
          
          return (
            <div 
              key={column.id}
              className={`rounded-lg p-4 ${getStatusColor(column.id)}`}
            >
              <h2 className="font-bold mb-3 flex items-center justify-between">
                <span>{column.title}</span>
                <span className="bg-gray-500 bg-opacity-20 text-sm px-2 py-0.5 rounded-full">
                  {tasks.length}
                </span>
              </h2>
              
              <Droppable droppableId={column.id}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="min-h-[200px]"
                  >
                    {tasks.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              ...provided.draggableProps.style,
                              opacity: snapshot.isDragging ? '0.8' : '1',
                            }}
                            className="mb-3"
                          >
                            <TaskCard task={task} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
}

export default TaskBoard;