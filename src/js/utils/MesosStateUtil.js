var _ = require("underscore");

var MesosStateStore = require("../stores/MesosStateStore");

const MesosStateUtil = {

  /**
   * @param  {Array} filter Allows us to filter by framework id
   *   All other frameworks will be put into an "other" category
   * @returns {Object} A map of frameworks running on host
   */
  getHostResourcesByFramework: function (filter) {
    var state = MesosStateStore.get("lastMesosState");

    return _.foldl(state.frameworks, function (memo, framework) {
      _.each(framework.tasks, function (task) {
        if (memo[task.slave_id] == null) {
          memo[task.slave_id] = {};
        }

        var frameworkKey = task.framework_id;
        if (_.contains(filter, framework.id)) {
          frameworkKey = "other";
        }

        var resources = _.pick(task.resources, "cpus", "disk", "mem");
        if (memo[task.slave_id][frameworkKey] == null) {
          memo[task.slave_id][frameworkKey] = resources;
        } else {
          // Aggregates used resources from each executor
          _.each(resources, function (value, key) {
            memo[task.slave_id][frameworkKey][key] += value;
          });
        }
      });

      return memo;
    }, {});
  }

};

module.exports = MesosStateUtil;