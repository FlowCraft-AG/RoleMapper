[**RoleMapper Backend API Documentation v2024.11.28**](../../../../../README.md)

***

[RoleMapper Backend API Documentation](../../../../../modules.md) / [role-mapper/service/pipeline/retiring-users.pipeline](../README.md) / retiringUsersPipeline

# Function: retiringUsersPipeline()

> **retiringUsersPipeline**(`now`, `lookaheadDate`): `PipelineStage`[]

Defined in: [src/role-mapper/service/pipeline/retiring-users.pipeline.ts:14](https://github.com/FlowCraft-AG/RoleMapper/blob/536244048d4b335d6a9047c5d05cfa1a8bc97efb/backend/src/role-mapper/service/pipeline/retiring-users.pipeline.ts#L14)

Erstellt eine Aggregationspipeline, um Funktionen und Benutzer mit einer
verbleibenden Zeit (`timeLeft`) innerhalb des angegebenen `lookaheadPeriod` zu finden.

## Parameters

### now

`Date`

Das aktuelle Datum.

### lookaheadDate

`Date`

Das Enddatum basierend auf `lookaheadPeriod`.

## Returns

`PipelineStage`[]

Die Aggregationspipeline.
