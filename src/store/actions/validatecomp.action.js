
// export const validateRoute=(vliad)=>{
//  return {
//      type: ,
//      payload: val
//  }
// }

export const validateRoute = data => {
    return {
        type: 'SET_ROUTE',
        payload: data,
    };
};