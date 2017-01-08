//1. we need to keep track of imports so that we can:
//  a. map source <-> specifer (ember <-> Ember) (for destructuring)
//  b. add call paths to remove (if we import Em from 'ember', we may have multiple paths to watch out for)

//2. we need to support nested destructuring
//  a. destructuring means additional call paths
//  b. support the recursive case

//3. we need to support scopes?
//  a. paths could be locally clobbered
//  b. paths can be reassigned
//  c. do we need to maintain a stack of scopes?

export default class State {
  constructor(configuration) {
    this.configuration = configuration;
    this.callPathsToRemove = new Set();
    this.importLocalToSourceMap = new Map();
  }

  enter() {
    this.callPathsToRemove.clear();
    this.importLocalToSourceMap.clear();

    this.configuration.removals.forEach(removal => {
      if(removal.global) {
        removal.paths.forEach(method => this.callPathsToRemove.add(`${removal.global}.${method}`));
      }
    });
  }

  exit() {

  }

  importSpecifier(type, source, local) {
    if(type === 'ImportDefaultSpecifier') {
      this.importLocalToSourceMap[local] = source;

      this.configuration.removals.forEach(removal => {
        if(removal.module === source) {
          removal.paths.forEach(method => this.callPathsToRemove.add(`${local}.${method}`));
        }
      });
    }
  }

  getImportSourceFromLocal(local) {
    // eg. `import Ember from 'ember';`
    // 'ember' is the source
    // 'Ember' is the local
    return this.importLocalToSourceMap[local];
  }

  shouldRemoveCallPath(path) {
    return this.callPathsToRemove.has(path);
  }
};
