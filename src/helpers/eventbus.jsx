const index = {};

export default {
  on: (receiver, name, fn) => {
    if (!index[name]) {
      index[name] = {};
    }
    index[name][receiver] = fn;
  },
  send: (name, arg) => {
    if (index[name]) {
      for (let key in index[name]) {
        if (index[name][key]) {
          index[name][key](arg);
        }
      }
    }
  },
  remove: (name, receiver) => {
    if (index[name] && index[name][receiver]) {
      index[name][receiver] = null;
    }
  }
};
