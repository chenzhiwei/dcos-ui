/* eslint-disable no-unused-vars */
import React from 'react';
/* eslint-enable no-unused-vars */

import General from './service-schema/general';
import Optional from './service-schema/optional';

let SERVICE_SCHEMA = {
  type: 'object',
  properties: {
    General: General,
    'Container Settings': {
      description: 'Configure your Docker Container',
      type: 'object',
      properties: {
        image: {
          description: 'name of your docker image',
          type: 'string',
          getter: function (service) {
            let container = service.getContainerSettings();
            if (container && container.docker && container.docker.image) {
              return container.docker.image;
            }
            return null;
          }
        }
      },
      required: []
    },
    'Optional': Optional
  },
  required: [
    'General'
  ]
};

module.exports = SERVICE_SCHEMA;
