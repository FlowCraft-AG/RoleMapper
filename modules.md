[**RoleMapper Backend API Documentation v2024.11.28**](README.md)

***

# RoleMapper Backend API Documentation v2024.11.28

## Modules

- [app.module](app.module/README.md)
- [camunda/camunda.module](camunda/camunda.module/README.md)
- [camunda/controller/processes.controller](camunda/controller/processes.controller/README.md)
- [camunda/resolver/camunda-mutation.resolver](camunda/resolver/camunda-mutation.resolver/README.md)
- [camunda/resolver/camunda-query.resolver](camunda/resolver/camunda-query.resolver/README.md)
- [camunda/resolver/processes.resolver](camunda/resolver/processes.resolver/README.md)
- [camunda/service/camunda-read.service](camunda/service/camunda-read.service/README.md)
- [camunda/service/camunda-write.service](camunda/service/camunda-write.service/README.md)
- [camunda/types/delete-instance.payload](camunda/types/delete-instance.payload/README.md)
- [camunda/types/flownode.type](camunda/types/flownode.type/README.md)
- [camunda/types/incident.type](camunda/types/incident.type/README.md)
- [camunda/types/input-filter/base-filter](camunda/types/input-filter/base-filter/README.md)
- [camunda/types/input-filter/flownode-filter](camunda/types/input-filter/flownode-filter/README.md)
- [camunda/types/input-filter/incident-filter](camunda/types/input-filter/incident-filter/README.md)
- [camunda/types/input-filter/process-definition-filter](camunda/types/input-filter/process-definition-filter/README.md)
- [camunda/types/input-filter/process-instance-filter](camunda/types/input-filter/process-instance-filter/README.md)
- [camunda/types/input-filter/task-filter](camunda/types/input-filter/task-filter/README.md)
- [camunda/types/input-filter/variable-filter](camunda/types/input-filter/variable-filter/README.md)
- [camunda/types/process-instance.type](camunda/types/process-instance.type/README.md)
- [camunda/types/process-variable.type](camunda/types/process-variable.type/README.md)
- [camunda/types/task.type](camunda/types/task.type/README.md)
- [config/app](config/app/README.md)
- [config/cors](config/cors/README.md)
- [config/deployment](config/deployment/README.md)
- [config/environment](config/environment/README.md)
- [config/graphql](config/graphql/README.md)
- [config/health](config/health/README.md)
- [config/https](config/https/README.md)
- [config/keycloak](config/keycloak/README.md)
- [config/logger](config/logger/README.md)
- [config/mail](config/mail/README.md)
- [config/mongo-database](config/mongo-database/README.md)
- [config/node](config/node/README.md)
- [config/paths](config/paths/README.md)
- [config/zeebe](config/zeebe/README.md)
- [logger/banner.service](logger/banner.service/README.md)
- [logger/logger](logger/logger/README.md)
- [logger/logger.module](logger/logger.module/README.md)
- [logger/request-logger.middleware](logger/request-logger.middleware/README.md)
- [logger/response-time.interceptor](logger/response-time.interceptor/README.md)
- [main](main/README.md)
- [role-mapper/controller/read.controller](role-mapper/controller/read.controller/README.md)
- [role-mapper/controller/write.controller](role-mapper/controller/write.controller/README.md)
- [role-mapper/error/errors](role-mapper/error/errors/README.md)
- [role-mapper/error/exceptions](role-mapper/error/exceptions/README.md)
- [role-mapper/model/dto/create.dto](role-mapper/model/dto/create.dto/README.md)
- [role-mapper/model/dto/data.dto](role-mapper/model/dto/data.dto/README.md)
- [role-mapper/model/dto/delete.dto](role-mapper/model/dto/delete.dto/README.md)
- [role-mapper/model/dto/mutation.input](role-mapper/model/dto/mutation.input/README.md)
- [role-mapper/model/dto/update.dto](role-mapper/model/dto/update.dto/README.md)
- [role-mapper/model/entity/entities.entity](role-mapper/model/entity/entities.entity/README.md)
- [role-mapper/model/entity/mandates.entity](role-mapper/model/entity/mandates.entity/README.md)
- [role-mapper/model/entity/org-unit.entity](role-mapper/model/entity/org-unit.entity/README.md)
- [role-mapper/model/entity/process.entity](role-mapper/model/entity/process.entity/README.md)
- [role-mapper/model/entity/roles.entity](role-mapper/model/entity/roles.entity/README.md)
- [role-mapper/model/entity/user.entity](role-mapper/model/entity/user.entity/README.md)
- [role-mapper/model/input/add-user.input](role-mapper/model/input/add-user.input/README.md)
- [role-mapper/model/input/create-data.input](role-mapper/model/input/create-data.input/README.md)
- [role-mapper/model/input/create.input](role-mapper/model/input/create.input/README.md)
- [role-mapper/model/input/data.input](role-mapper/model/input/data.input/README.md)
- [role-mapper/model/input/filter.input](role-mapper/model/input/filter.input/README.md)
- [role-mapper/model/input/get-roles.input](role-mapper/model/input/get-roles.input/README.md)
- [role-mapper/model/input/pagination-parameters](role-mapper/model/input/pagination-parameters/README.md)
- [role-mapper/model/input/query-stage.input](role-mapper/model/input/query-stage.input/README.md)
- [role-mapper/model/input/save-query.input](role-mapper/model/input/save-query.input/README.md)
- [role-mapper/model/input/sort.input](role-mapper/model/input/sort.input/README.md)
- [role-mapper/model/input/update.input](role-mapper/model/input/update.input/README.md)
- [role-mapper/model/payload/auth-token-result](role-mapper/model/payload/auth-token-result/README.md)
- [role-mapper/model/payload/data.payload](role-mapper/model/payload/data.payload/README.md)
- [role-mapper/model/payload/get-users.payload](role-mapper/model/payload/get-users.payload/README.md)
- [role-mapper/model/payload/mandate.payload](role-mapper/model/payload/mandate.payload/README.md)
- [role-mapper/model/payload/mutation-payload](role-mapper/model/payload/mutation-payload/README.md)
- [role-mapper/model/payload/mutation.payload](role-mapper/model/payload/mutation.payload/README.md)
- [role-mapper/model/payload/role-payload.type](role-mapper/model/payload/role-payload.type/README.md)
- [role-mapper/model/payload/saved-query.payload](role-mapper/model/payload/saved-query.payload/README.md)
- [role-mapper/model/payload/unassigned-functions.payload](role-mapper/model/payload/unassigned-functions.payload/README.md)
- [role-mapper/model/types/filter.type](role-mapper/model/types/filter.type/README.md)
- [role-mapper/model/types/link.type](role-mapper/model/types/link.type/README.md)
- [role-mapper/model/types/map.type](role-mapper/model/types/map.type/README.md)
- [role-mapper/resolver/entity-result.resolver](role-mapper/resolver/entity-result.resolver/README.md)
- [role-mapper/resolver/mutation.resolver](role-mapper/resolver/mutation.resolver/README.md)
- [role-mapper/resolver/query.resolver](role-mapper/resolver/query.resolver/README.md)
- [role-mapper/role-mapper.module](role-mapper/role-mapper.module/README.md)
- [role-mapper/service/pipeline/retiring-users.pipeline](role-mapper/service/pipeline/retiring-users.pipeline/README.md)
- [role-mapper/service/read.service](role-mapper/service/read.service/README.md)
- [role-mapper/service/write.service](role-mapper/service/write.service/README.md)
- [role-mapper/utils/http-exception.filter](role-mapper/utils/http-exception.filter/README.md)
- [role-mapper/utils/konstanten](role-mapper/utils/konstanten/README.md)
- [role-mapper/utils/uri-helper](role-mapper/utils/uri-helper/README.md)
- [security/http/helmet.handler](security/http/helmet.handler/README.md)
- [security/keycloak/keycloak.module](security/keycloak/keycloak.module/README.md)
- [security/keycloak/keycloak.service](security/keycloak/keycloak.service/README.md)
- [security/keycloak/token.controller](security/keycloak/token.controller/README.md)
- [security/keycloak/token.resolver](security/keycloak/token.resolver/README.md)
- [ZeebeService](ZeebeService/README.md)