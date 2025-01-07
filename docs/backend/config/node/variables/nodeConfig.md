[**RoleMapper Backend API Documentation v2024.11.28**](../../../README.md)

***

[RoleMapper Backend API Documentation](../../../modules.md) / [config/node](../README.md) / nodeConfig

# Variable: nodeConfig

> `const` **nodeConfig**: `object`

Defined in: [src/config/node.ts:14](https://github.com/FlowCraft-AG/RoleMapper/blob/cdd9e5010cc7adeee46f58ea0abd91d186332c1d/backend/src/config/node.ts#L14)

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
