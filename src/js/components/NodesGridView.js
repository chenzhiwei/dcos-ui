/** @jsx React.DOM */

var _ = require("underscore");
var React = require("react/addons");

var EventTypes = require("../constants/EventTypes");
var InternalStorageMixin = require("../mixins/InternalStorageMixin");
var MesosStateStore = require("../stores/MesosStateStore");
var NodesGridDials = require("./NodesGridDials");
var RequestErrorMsg = require("./RequestErrorMsg");

var MAX_SERVICES_TO_SHOW = 8;
var OTHER_SERVICES_COLOR = 8;

var NodesGridView = React.createClass({

  propTypes: {
    hosts: React.PropTypes.array.isRequired,
    selectedResource: React.PropTypes.string.isRequired
  },

  mixins: [InternalStorageMixin],

  getInitialState: function () {
    return {
      hiddenServices: [],
      mesosStateErrorCount: 0,
      showServices: false
    };
  },

  componentWillMount: function () {
    this.internalStorage_set({
      serviceColors: {},
      resourcesByFramework: {}
    });

    MesosStateStore.addChangeListener(
      EventTypes.MESOS_STATE_CHANGE,
      this.onMesosStateChange
    );

    MesosStateStore.addChangeListener(
      EventTypes.MESOS_STATE_REQUEST_ERROR,
      this.onMesosStateRequestError
    );
  },

  componentWillUnmount: function () {
    MesosStateStore.removeChangeListener(
      EventTypes.MESOS_STATE_CHANGE,
      this.onMesosStateChange
    );

    MesosStateStore.removeChangeListener(
      EventTypes.MESOS_STATE_REQUEST_ERROR,
      this.onMesosStateRequestError
    );
  },

  /**
   * Updates metadata on services when services are added/removed
   *
   * @param  {Object} props
   */
  componentWillReceiveProps: function (props) {
    var ids = _.pluck(props.services, "id");
    var serviceColors = this.internalStorage_get().serviceColors;

    if (!_.isEqual(Object.keys(serviceColors), ids)) {
      this.computeServiceColors(props.services);
      this.computeShownServices(props.services);
    }
  },

  onMesosStateChange: function () {
    var data = this.internalStorage_get();
    var resourcesByFramework = data.resourcesByFramework;
    // Maps the usage of each service per node
    // This can change at anytime. This info is only available in state.json
    var slaves = MesosStateStore.getHostResourcesByFramework(
      data.hiddenServices
    );

    if (!_.isEqual(resourcesByFramework, slaves)) {
      this.internalStorage_update({resourcesByFramework: slaves});
    }
  },

  onMesosStateRequestError: function () {
    this.setState({mesosStateErrorCount: this.state.mesosStateErrorCount + 1});
  },

  computeServiceColors: function (services) {
    // {service.id: colorIndex}
    var colors = {};

    services.forEach(function (service) {
      // Drop all others into the same "other" color
      if (service.colorIndex < MAX_SERVICES_TO_SHOW) {
        colors[service.id] = service.colorIndex;
      } else {
        colors.other = OTHER_SERVICES_COLOR;
      }
    });

    this.internalStorage_update({serviceColors: colors});
  },

  computeShownServices: function (services) {
    var hidden = _.map(services.slice(MAX_SERVICES_TO_SHOW),
      function (service) {
      return service.id;
    });

    this.internalStorage_update({hiddenServices: hidden});
  },

  handleShowServices: function (e) {
    this.setState({showServices: e.currentTarget.checked});
  },

  hasLoadingError: function () {
    return this.state.mesosStateErrorCount >= 3;
  },

  getLoadingScreen: function () {
    var hasLoadingError = this.hasLoadingError();
    var errorMsg = null;
    if (hasLoadingError) {
      errorMsg = <RequestErrorMsg />;
    }

    var loadingClassSet = React.addons.classSet({
      "hidden": hasLoadingError
    });

    return (
      <div className="text-align-center vertical-center">
        <div className="row">
          <div className={loadingClassSet}>
            <div className="ball-scale">
              <div />
            </div>
          </div>
          {errorMsg}
        </div>
      </div>
    );
  },

  getServicesList: function (props) {
    var items = _.map(props.services.slice(0, MAX_SERVICES_TO_SHOW),
      function (service) {
      var className = "service-legend-color service-color-" +
        service.colorIndex;

      return (
        <li key={service.id}>
          <span className={className}></span>
          <span>{service.name}</span>
        </li>
      );
    });

    if (props.services.length > MAX_SERVICES_TO_SHOW) {
      var classNameOther = "service-legend-color service-color-" +
        OTHER_SERVICES_COLOR;
      items.push(
        <li key="other">
          <span className={classNameOther}></span>
          <span>Other</span>
        </li>
      );
    }

    return (
      <ul className="list list-unstyled nodes-grid-service-list">
      {items}
      </ul>
    );
  },

  getNodesGrid: function () {
    var data = this.internalStorage_get();
    var props = this.props;
    var state = this.state;

    var classSet = React.addons.classSet({
      "nodes-grid-legend": true,
      "disabled": !state.showServices
    });

    return (
      <div className="nodes-grid">

        <div className={classSet}>
          <h5 className="show-services-label flush-top">
            <input type="checkbox"
              name="nodes-grid-show-services"
              checked={state.showServices}
              onChange={this.handleShowServices} />
            Show Services by Share
          </h5>

          {this.getServicesList(props)}
        </div>

        <NodesGridDials
          hosts={props.hosts}
          selectedResource={props.selectedResource}
          serviceColors={data.serviceColors}
          resourcesByFramework={data.resourcesByFramework}
          showServices={state.showServices} />
      </div>
    );
  },

  render: function () {
    var showLoading = this.hasLoadingError() ||
      Object.keys(MesosStateStore.getLastMesosState()).length === 0;

    if (showLoading) {
      return this.getLoadingScreen();
    } else {
      return this.getNodesGrid();
    }
  }

});

module.exports = NodesGridView;
