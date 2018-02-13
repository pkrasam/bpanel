import { expect } from 'chai';

import { addPlugin } from '../utils';

describe.only('addPlugin', () => {
  let modules;
  beforeEach(() => {
    modules = [
      {
        metadata: {
          name: 'plugin1',
          version: '0.0.1'
        }
      },
      {
        metadata: {
          name: 'plugin2',
          version: '0.1.1'
        }
      },
      {
        metadata: {
          name: 'plugin3',
          version: '0.0.1'
        }
      }
    ];
  });

  it('should push a new plugin to the end of the array', () => {
    const plugin = {
      metadata: {
        name: 'plugin4',
        version: '0.0.1'
      }
    };
    const updatedModules = addPlugin(modules, plugin);
    expect(updatedModules[updatedModules.length - 1]).to.deep.equal(plugin);
  });

  it('should replace plugin of the same name but with smaller version', () => {
    const plugin = { metadata: Object.assign({}, modules[1].metadata) };
    const newVersion = '0.10.1';
    plugin.metadata.version = newVersion;
    const updatedModules = addPlugin(modules, plugin);

    expect(updatedModules.length).to.equal(modules.length);
    expect(updatedModules[1].metadata.version).to.equal(newVersion);
  });

  it('should not add a plugin that already exists and has lesser version', () => {
    const plugin = { metadata: Object.assign({}, modules[1].metadata) };
    const newVersion = '0.0.5';
    plugin.metadata.version = newVersion;
    const updatedModules = addPlugin(modules, plugin);

    expect(updatedModules.length).to.equal(modules.length);
    expect(updatedModules[1].metadata.version).to.not.equal(newVersion);
  });
});
