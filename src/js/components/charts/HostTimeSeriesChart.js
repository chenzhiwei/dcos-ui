var _ = require("underscore");
var React = require("react/addons");

var Chart = require("./Chart");
var TimeSeriesChart = require("./TimeSeriesChart");
var TimeSeriesLabel = require("./TimeSeriesLabel");
var ValueTypes = require("../../constants/ValueTypes");

var HostTimeSeriesChart = React.createClass({

  displayName: "HostTimeSeriesChart",

  propTypes: {
    data: React.PropTypes.array.isRequired,
    refreshRate: React.PropTypes.number.isRequired,
    roundUpValue: React.PropTypes.number,
    minMaxY: React.PropTypes.number
  },

  getDefaultProps: function () {
    return {
      roundUpValue: 5,
      minMaxY: 10
    };
  },

  getMaxY: function () {
    var props = this.props;
    var roundUpValue = props.roundUpValue;

    var maxSlavesCount = _.max(props.data, function (slave) {
      return slave.slavesCount;
    }).slavesCount;

    var maxY = maxSlavesCount +
      (roundUpValue - (maxSlavesCount % roundUpValue));

    if (maxY < props.minMaxY) {
      maxY = props.minMaxY;
    }

    return maxY;
  },

  getData: function (props) {
    return [{
        name: "Nodes",
        colorIndex: 4,
        values: props.data
      }];
  },

  getLatest: function (data) {
    let index = _.findLastIndex(data, function (obj) {
      return obj.slavesCount != null;
    }) || 0;

    return data[index].slavesCount;
  },

  getChart: function (props) {
    return (
      <Chart>
        <TimeSeriesChart
          data={this.getData(props)}
          maxY={this.getMaxY()}
          refreshRate={props.refreshRate}
          y="slavesCount"
          yFormat={ValueTypes.ABSOLUTE} />
      </Chart>
    );
  },

  render: function () {
    var props = this.props;

    return (
      <div className="chart">
        <TimeSeriesLabel
          colorIndex={4}
          currentValue={this.getLatest(props.data)}
          subHeading={"Connected Nodes"}
          y="slavesCount" />
        {this.getChart(props)}
        <div className="timeseries-selector" />
      </div>
    );
  }
});

module.exports = HostTimeSeriesChart;
