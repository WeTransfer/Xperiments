function generateAction(type, ...props) {
  if (!props.length) throw 'ActionTypeMissing';

  return (...args) => {
    let action = {
      type: props[0]
    };

    for (let name of props) {
      if (name === action.type) continue;
      action[name] = args.shift();
    }

    return action;
  };
}

export default class ReduxActions {
  static types(map) {
    const result = {};

    for (let type of map) {
      result[type] = type;
    }

    return result;
  }

  static generate(map) {
    const types = Object.keys(map);

    for (let type of types) {
      map[type] = 
        typeof map[type] === 'function' 
        ? map[type] 
        : generateAction(type, ...map[type]);
    }

    return map;
  }
}