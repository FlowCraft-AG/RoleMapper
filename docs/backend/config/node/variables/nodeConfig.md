[**RoleMapper Backend API Documentation v2024.11.28**](../../../README.md)

***

[RoleMapper Backend API Documentation](../../../modules.md) / [config/node](../README.md) / nodeConfig

# Variable: nodeConfig

> `const` **nodeConfig**: `object`

Defined in: [src/config/node.ts:14](https://github.com/FlowCraft-AG/RoleMapper/blob/de0e51be3f89e6fa69f76597242a3d3e3b4ee01f/backend/src/config/node.ts#L14)

## Type declaration

### databaseName

> **databaseName**: `string`

### host

> `readonly` **host**: `string` = `computername`

### httpsOptions

> **httpsOptions**: `object`

#### httpsOptions.cert

> **cert**: `undefined` \| `Buffer`\<`ArrayBufferLike`\>

#### httpsOptions.key

> **key**: `undefined` \| `Buffer`\<`ArrayBufferLike`\>

### nodeEnv

> `readonly` **nodeEnv**: `undefined` \| `"test"` \| `"development"` \| `"PRODUCTION"` \| `"production"`

### port

> **port**: `number`

### resourcesDir

> `readonly` **resourcesDir**: `string` = `RESOURCES_DIR`
