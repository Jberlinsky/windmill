<script lang="ts">
	import { getContext } from 'svelte'
	import type { App, AppViewerContext } from '../types'
	import { allItems } from '../utils'
	import { findGridItem } from './appUtils'
	import PanelSection from './settingsPanel/common/PanelSection.svelte'
	import ComponentPanel from './settingsPanel/ComponentPanel.svelte'
	import InputsSpecsEditor from './settingsPanel/InputsSpecsEditor.svelte'
	import BackgroundScriptSettings from './settingsPanel/script/BackgroundScriptSettings.svelte'
	import Recompute from './settingsPanel/Recompute.svelte'

	const { selectedComponent, app, stateId } = getContext<AppViewerContext>('AppViewerContext')

	$: hiddenInlineScript = $app?.hiddenInlineScripts
		?.map((x, i) => ({ script: x, index: i }))
		.find(({ script, index }) => $selectedComponent?.includes(`bg_${index}`))

	$: componentSettings = findComponentSettings($app, $selectedComponent?.[0])
	$: tableActionSettings = findTableActionSettings($app, $selectedComponent?.[0])

	function findTableActionSettings(app: App, id: string | undefined) {
		return allItems(app.grid, app.subgrids)
			.map((x) => {
				if (x?.data?.type === 'tablecomponent') {
					if (x?.data?.actionButtons) {
						const tableAction = x.data.actionButtons.find((x) => x.id === id)
						if (tableAction) {
							return { item: { data: tableAction, id: tableAction.id }, parent: x.data.id }
						}
					}
				}
			})
			.find((x) => x)
	}

	function findComponentSettings(app: App, id: string | undefined) {
		if (!id) return undefined
		if (app?.grid) {
			const gridItem = app.grid.find((x) => x.data?.id === id)
			if (gridItem) {
				return { item: gridItem, parent: undefined }
			}
		}

		if (app?.subgrids) {
			for (const key of Object.keys(app.subgrids ?? {})) {
				const gridItem = app.subgrids[key].find((x) => x.data?.id === id)
				if (gridItem) {
					return { item: gridItem, parent: key }
				}
			}
		}

		return undefined
	}
</script>

{#if componentSettings}
	{#key componentSettings?.item?.id}
		<ComponentPanel bind:componentSettings />
	{/key}
{:else if tableActionSettings}
	{#key tableActionSettings?.item?.data?.id}
		<ComponentPanel
			noGrid
			rowColumns
			bind:componentSettings={tableActionSettings}
			duplicateMoveAllowed={false}
			onDelete={() => {
				if (tableActionSettings) {
					const parent = findGridItem($app, tableActionSettings.parent)
					if (!parent) return

					if (parent.data.type === 'tablecomponent') {
						parent.data.actionButtons = parent.data.actionButtons.filter(
							(x) => x.id !== tableActionSettings?.item.id
						)
					}
				}
			}}
		/>
	{/key}
{:else if hiddenInlineScript}
	{@const id = `bg_${hiddenInlineScript.index}`}
	<BackgroundScriptSettings bind:runnable={hiddenInlineScript.script} {id} />

	<div class="mb-8">
		{#if Object.keys(hiddenInlineScript.script.fields).length > 0}
			<PanelSection title={`Inputs`}>
				{#key $stateId}
					<InputsSpecsEditor
						displayType
						{id}
						shouldCapitalize={false}
						bind:inputSpecs={hiddenInlineScript.script.fields}
						userInputEnabled={false}
					/>
				{/key}
			</PanelSection>
		{/if}
	</div>
	<Recompute bind:recomputeIds={hiddenInlineScript.script.recomputeIds} ownId={id} />
	<div class="grow shrink" />
{/if}
