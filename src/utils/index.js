export default {
  local: {
    set (name, item) {
      if (typeof (item) === 'object') {
        localStorage.setItem(name, JSON.stringify(item))
      } else {
        localStorage.setItem(name, item)
      }
    },
    get (name) {
      return localStorage.getItem(name)
    },
    remove (name) {
      localStorage.removeItem(name)
    }
  },
  session: {
    set (name, item) {
      if (typeof (item) === 'object') {
        sessionStorage.setItem(name, JSON.stringify(item))
      } else {
        sessionStorage.setItem(name, item)
      }
    },
    get (name) {
      return sessionStorage.getItem(name)
    }
  }
}
