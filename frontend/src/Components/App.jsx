import React, { useState, useEffect } from "react";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { BsCheckLg } from "react-icons/bs";
import {
  retrieveAllTask,
  createTask,
  deleteTask,
  updateTask,
} from "../Constants/Api";

// Utility function to format date
const formatDate = (date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

const App = () => {
  const [isCompleteScreen, setIsCompleteScreen] = useState(false);
  const [allTodos, setTodos] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newStatus, setNewStatus] = useState("pending");
  const [newDueDate, setNewDueDate] = useState("");
  const [completedTodos, setCompletedTodos] = useState([]);
  const [currentEdit, setCurrentEdit] = useState(-1);
  const [currentEditedItem, setCurrentEditedItem] = useState({});

  useEffect(() => {
    RetrieveApiCall();
  }, []);

  const RetrieveApiCall = async () => {
    try {
      const response = await fetch(retrieveAllTask, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to retrieve tasks");
      } else {
        const responseData = await response.json();
        console.log("Response data:", responseData);
        setTodos(responseData?.message);
      }
    } catch (error) {
      console.error("Error retrieving tasks:", error);
    }
  };

  useEffect(() => {
    const savedTodo = JSON.parse(localStorage.getItem("todolist"));
    const savedCompletedTodo = JSON.parse(localStorage.getItem("completedTodos"));

    if (savedTodo) {
      setTodos(savedTodo);
    }
    if (savedCompletedTodo) {
      setCompletedTodos(savedCompletedTodo);
    }
  }, []);

  const handleAddTodo = async () => {
    const newTodoItem = {
      title: newTitle,
      description: newDescription,
      status: newStatus,
      dueDate: newDueDate,
    };

    try {
      const response = await fetch(createTask, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTodoItem),
      });

      if (!response.ok) {
        throw new Error("Failed to add task");
      } else {
        const responseData = await response.json();
        console.log(responseData);
        setTodos([...allTodos, responseData.message]); // Ensure you update the state with the response data
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
    setNewTitle("");
    setNewDescription("");
    setNewStatus("pending");
    setNewDueDate("");
  };

  const handleDeleteTodo = (index, _id) => {
    const reducedTodo = allTodos.filter((_, i) => i !== index);
    setTodos(reducedTodo);
    localStorage.setItem("todolist", JSON.stringify(reducedTodo));
    deleteapi(_id);
  };

  const handleComplete = (index) => {
    const now = new Date();
    const completedOn = `${now.getDate()}-${
      now.getMonth() + 1
    }-${now.getFullYear()} at ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;

    const filteredItem = {
      ...allTodos[index],
      status: "completed",
      completedOn,
    };
    const updatedCompletedArr = [...completedTodos, filteredItem];
    setCompletedTodos(updatedCompletedArr);
    handleDeleteTodo(index, allTodos[index]._id);
    localStorage.setItem("completedTodos", JSON.stringify(updatedCompletedArr));
  };

  const handleDeleteCompletedTodo = (index, _id) => {
    const reducedTodo = completedTodos.filter((_, i) => i !== index);
    setCompletedTodos(reducedTodo);
    localStorage.setItem("completedTodos", JSON.stringify(reducedTodo));
    deleteapi(_id);
  };

  const deleteapi = async (_id) => {
    try {
      const response = await fetch(deleteTask + _id, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete task");
      } else {
        const responseData = await response.json();
        console.log("Response received after deletion:", responseData);
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleEdit = (index, item) => {
    setCurrentEdit(index);
    setCurrentEditedItem(item);
  };

  const handleUpdateTitle = (value) => {
    setCurrentEditedItem((prev) => ({ ...prev, title: value }));
  };

  const handleUpdateDescription = (value) => {
    setCurrentEditedItem((prev) => ({ ...prev, description: value }));
  };

  const handleUpdateStatus = (value) => {
    setCurrentEditedItem((prev) => ({ ...prev, status: value }));
  };

  const handleUpdateDueDate = (value) => {
    setCurrentEditedItem((prev) => ({ ...prev, dueDate: value }));
  };

  const handleUpdateToDo = () => {
    const newToDo = [...allTodos];
    newToDo[currentEdit] = currentEditedItem;
    setTodos(newToDo);
    localStorage.setItem("todolist", JSON.stringify(newToDo));
    setCurrentEdit(-1);
    updateApi(currentEditedItem._id);
  };

  const updateApi = async (_id) => {
    try {
      console.log("Current edited item:", currentEditedItem);
      const response = await fetch(updateTask + _id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(currentEditedItem),
      });

      if (!response.ok) {
        throw new Error("Failed to update task");
      } else {
        const responseData = await response.json();
        console.log("Response received after update:", responseData);
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-3xl text-center mb-8">My Todos</h1>
      <div className="max-w-lg mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="mb-4">
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Title</label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="What's the task title?"
              className="w-full p-2 rounded bg-gray-700 text-white"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Description</label>
            <input
              type="text"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="What's the task description?"
              className="w-full p-2 rounded bg-gray-700 text-white"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Status</label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white"
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="in-progress">In Progress</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Due Date</label>
            <input
              type="date"
              value={newDueDate}
              onChange={(e) => setNewDueDate(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white"
            />
          </div>
          <button
            type="button"
            onClick={handleAddTodo}
            className="w-full bg-green-500 hover:bg-green-400 text-white p-2 rounded"
          >
            Add
          </button>
        </div>

        <div className="flex justify-between mb-4">
          <button
            className={`w-full p-2 rounded mr-2 ${
              !isCompleteScreen ? "bg-blue-500" : "bg-gray-700"
            }`}
            onClick={() => setIsCompleteScreen(false)}
          >
            To Do List
          </button>
          <button
            className={`w-full p-2 rounded ${
              isCompleteScreen ? "bg-blue-500" : "bg-gray-700"
            }`}
            onClick={() => setIsCompleteScreen(true)}
          >
            Completed
          </button>
        </div>

        <div className="space-y-4">
          {!isCompleteScreen &&
            allTodos.map((item, index) => {
              if (currentEdit === index) {
                return (
                  <div className="p-4 bg-gray-700 rounded-lg" key={index}>
                    <input
                      placeholder="Updated Title"
                      onChange={(e) => handleUpdateTitle(e.target.value)}
                      value={currentEditedItem.title}
                      className="w-full mb-2 p-2 rounded bg-gray-600 text-white"
                    />
                    <textarea
                      placeholder="Updated Description"
                      rows={4}
                      onChange={(e) => handleUpdateDescription(e.target.value)}
                      value={currentEditedItem.description}
                      className="w-full mb-2 p-2 rounded bg-gray-600 text-white"
                    />
                    <select
                      value={currentEditedItem.status}
                      onChange={(e) => handleUpdateStatus(e.target.value)}
                      className="w-full p-2 rounded bg-gray-600 text-white"
                    >
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                      <option value="in-progress">In-Progress</option>
                    </select>
                    <input
                      type="date"
                      value={currentEditedItem.dueDate}
                      onChange={(e) => handleUpdateDueDate(e.target.value)}
                      className="w-full p-2 rounded bg-gray-600 text-white"
                    />
                    <button
                      type="button"
                      onClick={handleUpdateToDo}
                      className="w-full bg-green-500 hover:bg-green-400 text-white p-2 rounded"
                    >
                      Update
                    </button>
                  </div>
                );
              } else {
                return (
                  <div
                    className="p-4 bg-gray-700 rounded-lg flex justify-between items-center"
                    key={index}
                  >
                    <div>
                      <h3 className="text-xl text-green-500 font-bold">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {item.description}
                      </p>
                      <p className="text-sm text-gray-400">
                        Status: {item.status}
                      </p>
                      <p className="text-sm text-gray-400">
                        Due Date: {formatDate(item.dueDate)}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <AiOutlineDelete
                        className="text-red-500 cursor-pointer"
                        onClick={() => handleDeleteTodo(index, item._id)}
                        title="Delete?"
                      />
                      {item.status !== "completed" && (
                        <BsCheckLg
                          className="text-green-500 cursor-pointer"
                          onClick={() => handleComplete(index)}
                          title="Complete?"
                        />
                      )}
                      <AiOutlineEdit
                        className="text-blue-500 cursor-pointer"
                        onClick={() => handleEdit(index, item)}
                        title="Edit?"
                      />
                    </div>
                  </div>
                );
              }
            })}

          {isCompleteScreen &&
            completedTodos.map((item, index) => (
              <div
                className="p-4 bg-gray-700 rounded-lg flex justify-between items-center"
                key={index}
              >
                <div>
                  <h3 className="text-xl text-green-500 font-bold">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-400">{item.description}</p>
                  <p className="text-sm text-gray-400">Status: {item.status}</p>
                  <p className="text-xs text-gray-500">
                    Completed on: {item.completedOn}
                  </p>
                </div>
                <AiOutlineDelete
                  className="text-red-500 cursor-pointer"
                  onClick={() => handleDeleteCompletedTodo(index, item._id)}
                  title="Delete?"
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default App;
