[**RoleMapper Backend API Documentation v2024.11.28**](../../../../../README.md)

***

[RoleMapper Backend API Documentation](../../../../../modules.md) / [role-mapper/model/types/link.type](../README.md) / Links

# Type Alias: Links

> **Links**: `object`

Defined in: [src/role-mapper/model/types/link.type.ts:8](https://github.com/FlowCraft-AG/RoleMapper/blob/da8087f9c63e7aa49e7a655f3f13ecbe5687d6eb/backend/src/role-mapper/model/types/link.type.ts#L8)

Links für HATEOAS

## Type declaration

## Index Signature

\[`roleName`: `string`\]: `undefined` \| [`Link`](Link.md) \| `Record`\<`string`, [`Link`](Link.md)\>

### add?

> `readonly` `optional` **add**: [`Link`](Link.md)

Optionaler Linke für add

### list?

> `readonly` `optional` **list**: [`Link`](Link.md)

Optionaler Linke für list

### remove?

> `readonly` `optional` **remove**: [`Link`](Link.md)

Optionaler Linke für remove

### self

> `readonly` **self**: [`Link`](Link.md)

self-Link

### update?

> `readonly` `optional` **update**: [`Link`](Link.md)

Optionaler Linke für update
