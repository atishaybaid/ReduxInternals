import React from 'react';
import { render } from 'react-dom';
import Hello from './Hello';



//Redux impl

const initialState = {
  todoList: {},
  currId: 1,
  todoTxt:''

}

// Reducer

const addTodo = (state, action) => {
  return {
    ...state,
    todoList: { ...state.todoList, [state.currId]: { txt: action.payload.txt, status: 0 } },
    currId: state.currId + 1,
    todoTxt:''
  }

}

const toggleTodo = (state, action) => {
  return {
    ...state,
    todoList: { ...state.todoList, [action.payload.id]: { ...state.todoList[action.payload.id], status: !state.todoList[action.payload.id].status } }
  }
}


const updateTodo =(state,action)=>{
  return {
    ...state,
    todoTxt:action.payload.txt
  }
}


const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'addTodo':
      return addTodo(state, action);
    case 'toggleTodo':
      return toggleTodo(state, action)
    case 'updateTodo':
      return updateTodo(state,action)
    default:
      return state;
  }

}



//Store 

const createStore = (reducer) => {
  let state;
  let handlerList = [];
  const store = {
    dispatch: (action) => {
      state = reducer(state, action)
      handlerList.forEach((handler) => handler())
    },
    subscribe: (handler) => {
      handlerList.push(handler);
      let index = handlerList.indexOf(handler);
      return () => {
        handlerList.splice(index, 1);
      }
    },
    getState: () => state

  };
  store.dispatch({ type: 'reduxInit' })
  return store;


}


const storeInst = createStore(reducer);


const styles = {
  fontFamily: 'sans-serif',
  textAlign: 'center',
};

class App extends React.Component {

constructor(props){
  super(props);
  this.state = props.store.getState();
  this.stateChanged = this.stateChanged.bind(this);
  this.textChange = this.textChange.bind(this);
  this.addTodo = this.addTodo.bind(this);
}

componentWillMount(){
  this.props.store.subscribe(()=>this.setState(this.props.store.getState()));
}

stateChanged(){
  console.log("state have been changed");
}

renderTodo(){
  let todoList = this.state.todoList;
  let markup = [];
  
  return Object.keys(todoList).map((key)=>(<li>{todoList[key].txt}</li>))



   
}

textChange(event){
  let value = event.target.value;
  console.log(value);
 
  this.props.store.dispatch({ type:'updateTodo',payload:{txt:value}});

}


addTodo(){
  this.props.store.dispatch({ type: 'addTodo', payload: { txt: this.state.todoTxt}})
}




render(){
  return (
    <div className="app" style={styles}>
      <Hello name="CodeSandbox" />
      <h2>Todo List</h2>
      <input type="text" value={this.state.todoTxt} onChange={this.textChange}/>
      <button type="button" onClick={this.addTodo} >
      Add 
      </button>
      <ul className="todo-list">
        {this.renderTodo()}
      </ul>



    </div>
  )
}



}

render(<App store={storeInst}/>, document.getElementById('root'));
