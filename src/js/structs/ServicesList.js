import _ from "underscore";

import List from "./List";
import MesosSummaryUtil from "../utils/MesosSummaryUtil";
import Service from "./Service";
import StringUtil from "../utils/StringUtil";

export default class ServicesList extends List {
  constructor() {
    super(...arguments);

    // Replace list items instances of Service
    this.list = this.list.map(function (item) {
      if (item instanceof Service) {
        return item;
      } else {
        return new Service(item);
      }
    });
  }

  filter(filters) {
    let services = this.getItems();

    if (filters) {
      if (filters.ids) {
        services = _.filter(services, function (service) {
          return this.ids.indexOf(service.id) !== -1;
        }, {ids: filters.ids});
      }

      if (filters.name) {
        services = StringUtil.filterByString(services, "name", filters.name);
      }

      if (filters.health != null) {
        services = MesosSummaryUtil.filterServicesByHealth(
          services, filters.health
        );
      }
    }

    return new ServicesList({items: services});
  }

  sumUsedResources() {
    let services = this.getItems();
    let resourcesList = _.pluck(services, "used_resources");
    return MesosSummaryUtil.sumResources(resourcesList);
  }
}
