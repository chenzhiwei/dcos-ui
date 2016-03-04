import mixin from 'reactjs-mixin';
import {Modal} from 'reactjs-components';
/*eslint-disable no-unused-vars*/
import React from 'react';
/*eslint-enable no-unused-vars*/
import {StoreMixin} from 'mesosphere-shared-reactjs';

import ACLDirectoriesStore from '../stores/ACLDirectoriesStore';

const buttonDefinition = [
  {
    text: 'Close',
    className: 'button button-medium',
    isClose: true
  },
  {
    text: 'Test Connection',
    className: 'button button-success button-medium',
    isSubmit: true
  }
];

const METHODS_TO_BIND = [
  'changeFormModalOpenState',
  'handleFormModalSubmit',
  'handleSuccessModalClose'
];

let SDK = require('../../../SDK').getSDK();

module.exports = class DirectoryActionButtons extends mixin(StoreMixin) {
  constructor() {
    super(...arguments);

    this.state = {
      formModalDisabled: false,
      formModalOpen: false,
      successModalOpen: false
    };

    this.store_listeners = [
      {
        name: 'aclDirectories',
        events: ['testSuccess', 'testError']
      }
    ];

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  componentDidMount() {
    super.componentDidMount(...arguments);
    ACLDirectoriesStore.fetchDirectories();
  }

  onAclDirectoriesStoreTestSuccess() {
    this.setState({
      formModalOpen: false,
      formModalDisabled: false,
      successModalOpen: true
    });
  }

  onAclDirectoriesStoreTestError() {
    this.setState({formModalDisabled: false});
  }

  handleDirectoryDelete() {
    ACLDirectoriesStore.deleteDirectory();
  }

  handleSuccessModalClose() {
    this.setState({successModalOpen: false});
  }

  handleFormModalSubmit(formData) {
    ACLDirectoriesStore.testDirectoryConnection(formData);
    this.setState({formModalDisabled: true});
  }

  changeFormModalOpenState(open) {
    this.setState({formModalOpen: open, formModalDisabled: false});
  }

  getModalFormDefinition() {
    return [
      {
        fieldType: 'text',
        name: 'uid',
        placeholder: 'LDAP Username',
        required: true,
        showLabel: false,
        writeType: 'input',
        validation: function () { return true; },
        value: ''
      },
      {
        fieldType: 'text',
        name: 'password',
        placeholder: 'LDAP Password',
        required: true,
        showLabel: false,
        writeType: 'input',
        validation: function () { return true; },
        value: ''
      }
    ];
  }

  render() {
    let FormModal = SDK.get('FormModal');
    return (
      <div>
        <div className="button-collection">
          <button
            className="button button-primary"
            onClick={this.changeFormModalOpenState.bind(null, true)}>
            Test Connection
          </button>
          <button
            className="button button-danger button-margin-left"
            onClick={this.handleDirectoryDelete}>
            Delete Directory
          </button>
        </div>

        <FormModal
          buttonDefinition={buttonDefinition}
          definition={this.getModalFormDefinition()}
          disabled={this.state.formModalDisabled}
          onClose={this.changeFormModalOpenState.bind(null, false)}
          onSubmit={this.handleFormModalSubmit}
          open={this.state.formModalOpen}>
          <h2 className="modal-header-title text-align-center flush-top">
            Test External Directory
          </h2>
        </FormModal>

        <Modal
          headerClass="modal-header modal-header-white"
          maxHeightPercentage={0.9}
          modalClass="modal"
          onClose={this.handleSuccessModalClose}
          open={this.state.successModalOpen}
          showCloseButton={true}
          showHeader={false}
          showFooter={false}>
          Connection with LDAP server was successful
        </Modal>
      </div>
    );
  }
};