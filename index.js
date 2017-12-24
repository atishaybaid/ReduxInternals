
const initialState = {
    todoList:{},
    currId:1,

}

// Reducer

const addTodo = (state,action) =>{
    return {
        ...state,
        todoList:{...state.todoList,[state.currId]:{txt:action.payload.txt,status:0}},
        currId:state.currId + 1
    }
    
}

const toggleTodo = (state,action)=>{
    return {
        ...state,
        todoList:{...state.todoList,[action.payload.id]:{...state.todoList[action.payload.id],status:!state.todoList[action.payload.id].status}}
    }
}


const reducer = (state=initialState,action)=>{
 switch (action.type){
    case 'addTodo':
        return addTodo(state,action);
    case 'toggleTodo':
        return toggleTodo(state,action)
    default:
        return state;
 }   

}



//Store 

 const createStore =(reducer)=>{
    let state;
    const store = {
        dispatch:(action)=>{
            state = reducer(state,action)
        },
        getState:()=>state

    };
    return store;


 }



//Driver code

var storeInst = createStore(reducer);
storeInst.dispatch({type:'addTodo',payload:{txt:'watch match',status:0}})
storeInst.getState();
storeInst.dispatch({type:'addTodo',payload:{txt:'watch Despicable Me',status:0}})
storeInst.getState();
storeInst.dispatch({type:'toggleTodo',payload:{id:2}})
storeInst.getState();





















