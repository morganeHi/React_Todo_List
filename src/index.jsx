import React, { useState, useRef, useEffect } from "react";
import { createRoot } from "react-dom/cjs/react-dom.production.min";
import TodoList from "./components/TodoList";
import { v4 as uuidv4 } from 'uuid';
import './styles/style.css'

const root = document.getElementById('root');
const app = createRoot(root);

const LOCAL_STORAGE_KEY = 'allMyTodos'

const App = () => {

    //! Array destructuring, because useState returns an Array
    //! const [all of the todos, function to allow to update the todos] = useState( default State of the todos, here an empty array )      
    const [todos, setTodos] = useState([]);
    const todoNameRef = useRef();

    //! The empty array never changes, so the function is only called once
    //! JSON.parse converts the string to an array
    useEffect(() => {
        const storedTodos = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
        if (storedTodos) setTodos(storedTodos);
    }, [])

    //! Anytime anything changes in the array (here the todos array) , the useEffect function runs
    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todos));
    }, [todos]) 

    //! Function to toggle the todos to complete or incomplete
    function toggleTodo(id) {
        //! in order to not change the current todo list we create a copy of it
        //! In React never we should directly modify a state variable, but instead make a copy before modifying it and use that copy to set a new state
        const newTodos = [...todos];
        const todo = newTodos.find(todo => todo.id === id);
        todo.complete = !todo.complete;
        setTodos(newTodos);
    }

    function handleClick(e) {
        const name = todoNameRef.current.value;
        if (name === '' ) return;
        setTodos(previousTodos => {
            return [... previousTodos, {id:uuidv4(), name: name, complete: false}]
        })//! to clear out the input
        todoNameRef.current.value = null; 
    }

    function handleClear(e) {
        const newTodos = todos.filter(todo => !todo.complete);
        setTodos(newTodos);
    }

    //! all components have props (=property) that can be passed to them
    //! here TodoList has a prop named todos (todos=), and a variable named todos is passed to it ({todos})

    return (
        <>
            <h1>My Todo List</h1>
            <TodoList todos={todos} toggleTodo={toggleTodo}/>
            <div className='todoDiv'>
                <input ref={todoNameRef} type="text"/>
                <button onClick={handleClick} >Add Todo</button>
                <button onClick={handleClear} >Clear Completed Todos</button>
                <div>{todos.filter(todo => !todo.complete).length} Todos left</div>
            </div>
        </>
    )
}

app.render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>
)