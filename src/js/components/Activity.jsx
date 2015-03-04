/** @jsx React.DOM */

var _ = require("underscore");
var React = require("react/addons");

var EventTypes = require("../constants/EventTypes");
var MesosStateStore = require("../stores/MesosStateStore");
var ResourceChart = require("./charts/ResourceChart");
var DialChart = require("./charts/DialChart");

function getMesosState() {
  return {
    tasks: MesosStateStore.getTasks(),
    totalResources: MesosStateStore.getTotalResources(),
    usedResources: MesosStateStore.getUsedResources()
  };
}

var Activity = React.createClass({

  displayName: "Activity",

  getInitialState: function () {
    return getMesosState();
  },

  componentDidMount: function () {
    MesosStateStore.addChangeListener(
      EventTypes.MESOS_STATE_CHANGE,
      this.onChange
    );
  },

  componentWillUnmount: function () {
    MesosStateStore.removeChangeListener(
      EventTypes.MESOS_STATE_CHANGE,
      this.onChange
    );
  },

  onChange: function () {
    this.setState(getMesosState());
  },

  getTasks: function () {
    return _.map(this.state.tasks, function (data, i) {
      return {colorIndex: i, name: data.state, value: data.tasks.length};
    });
  },

  render: function () {
    var state = this.state;

    /* jshint trailing:false, quotmark:false, newcap:false */
    /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    return (
      <div className="row">
        <div className="column-small-6 column-large-4">
          <ResourceChart
            totalResources={state.totalResources}
            usedResources={state.usedResources}
            mode="cpus" />
        </div>
        <div className="column-small-6 column-large-4">
          <ResourceChart
            totalResources={state.totalResources}
            usedResources={state.usedResources}
            mode="mem" />
        </div>
        <div className="column-small-6 column-large-4">
          <ResourceChart
            totalResources={state.totalResources}
            usedResources={state.usedResources}
            mode="disk" />
        </div>
        <div className="column-small-6 column-large-4">
          <DialChart
            data={this.getTasks()}
            coords={{x:100, y:100}}
            value="value"
            size={200} />
        </div>
      </div>
    );
  }

});

module.exports = Activity;
