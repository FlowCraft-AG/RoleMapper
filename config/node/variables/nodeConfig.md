[**RoleMapper Backend API Documentation v2024.11.28**](../../../README.md)

***

[RoleMapper Backend API Documentation](../../../modules.md) / [config/node](../README.md) / nodeConfig

# Variable: nodeConfig

> `const` **nodeConfig**: `object`

Defined in: [src/config/node.ts:14](https://github.com/FlowCraft-AG/RoleMapper/blob/bd02a9f13cb3346480f35c2638b81cb7d31e5c1f/backend/src/config/node.ts#L14)

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
