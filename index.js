import React from 'react';
import { render } from 'react-dom';
import PropTypes from 'prop-types';
import Hello from './Hello';



//Redux impl
const initialState = {
  todoList: {},
  currId: 1,
  todoTxt: ''

}

// Reducer

const addTodo = (state, action) => {
  return {
    ...state,
    todoList: { ...state.todoList, [state.currId]: { txt: action.payload.txt, status: 0 } },
    currId: state.currId + 1,
    todoTxt: ''
  }

}

const toggleTodo = (state, action) => {
  return {
    ...state,
    todoList: { ...state.todoList, [action.payload.id]: { ...state.todoList[action.payload.id], status: !state.todoList[action.payload.id].status } }
  }
}


const updateTodo = (state, action) => {
  return {
    ...state,
    todoTxt: action.payload.txt
  }
}


const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'addTodo':
      return addTodo(state, action);
    case 'toggleTodo':
      return toggleTodo(state, action)
    case 'updateTodo':
      return updateTodo(state, action)
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

//connect
const Connect = (mapStateToProps, mapDispatchToProps) => (
  (Pcomponent) => {
    return class ConnectedComponent extends React.Component {
      constructor() {
        super();
        this.store = storeInst;
      }

      onStateOrPropsChange() {

        const storeState = this.store.getState();
        const stateProps = mapStateToProps(storeState);
        let strDispatch = this.store.dispatch;
        const dispatchProps = mapDispatchToProps(strDispatch);
        this.setState({ ...stateProps, ...dispatchProps });
      }

      componentWillMount() {
        this.store.subscribe(() => this.onStateOrPropsChange());
        this.onStateOrPropsChange();

      }


      render() {
        return (
          <Pcomponent {...this.state} />
        )
      }

    }
    return component;
  }
)


//Provider
class Provider extends React.Component {

  getChildContext() {
    return { store: this.props.store }
  }
  render() {
    return this.props.children
  }


}

Provider.childContextTypes = {
  store: PropTypes.object
};

//React Impl

const styles = {
  fontFamily: 'sans-serif',
  textAlign: 'center',
};

class App extends React.Component {

  constructor(props) {
    super(props);
    //this.state = props.store.getState();
    //this.stateChanged = this.stateChanged.bind(this);
    this.textChange = this.textChange.bind(this);
    this.addTodo = this.addTodo.bind(this);
  }

  

  renderTodo() {
    let todoList = this.props.todoList;
    let markup = [];

    return Object.keys(todoList).map((key) => (<li>{todoList[key].txt}</li>))




  }

  textChange(event) {
    let value = event.target.value;
    //console.log(value);

    this.props.textChange(value);

  }


  addTodo() {

    //this.props.store.dispatch({ type: 'addTodo', payload: { txt: this.props.todoTxt}})
    this.props.addTodo(this.props.todoTxt)
  }




  render() {
    return (
      <div className="app" style={styles}>
        <Hello name="CodeSandbox" />
        <h2>Todo List</h2>
        <input type="text" value={this.props.todoTxt} onChange={this.textChange} />
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

const mapStateToProps = (state) => ({
  todoTxt: state.todoTxt,
  todoList: state.todoList

})
const mapDispatchToProps = (dispatch) => ({
  addTodo: (txt) => (dispatch({ type: 'addTodo', payload: { txt: txt } })),
  textChange: (value) => (dispatch({ type: 'updateTodo', payload: { txt: value } }))
})
var ConnectedApp = Connect(mapStateToProps, mapDispatchToProps)(App);










render(<Provider store={storeInst}><ConnectedApp /></Provider>, document.getElementById('root'));