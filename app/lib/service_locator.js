// This module is used to manage app dependencies
function ServiceLocator() {
  this.dependencyMap = {};
  this.dependencyCache = {};
}

// Takes in the dependency name and its constructor
// then proceeds to add it to the dependencyMap
ServiceLocator.prototype.register = function (dependencyName, constructor) {
  if (typeof constructor !== "function") {
    throw new Error(
      dependencyName + ": Dependency constructor is not a function"
    );
  }

  if (!dependencyName) {
    throw new Error("Invalid dependency name provided");
  }

  this.dependencyMap[dependencyName] = constructor;
};

// Retrieves a dependecy from dependencyMap that matches the name passed
// If the requested dependency is not in the cache,
// then it initialize the dependency and adds it to the cache
// then return it
ServiceLocator.prototype.get = function (dependencyName) {
  if (this.dependencyMap[dependencyName] === undefined) {
    throw new Error(
      dependencyName + ": Attempting to retrieve unknown dependency"
    );
  }

  if (typeof this.dependencyMap[dependencyName] !== "function") {
    throw new Error(
      dependencyName + ": Dependency constructor is not a function"
    );
  }

  if (this.dependencyCache[dependencyName] === undefined) {
    const dependencyConstructor = this.dependencyMap[dependencyName];
    const dependency = dependencyConstructor(this);
    if (dependency) {
      this.dependencyCache[dependencyName] = dependency;
    }
  }

  return this.dependencyCache[dependencyName];
};

// Remove all dependencies from the map and the cache
ServiceLocator.prototype.clear = function () {
  this.dependencyCache = {};
  this.dependencyMap = {};
};

module.exports = new ServiceLocator();
