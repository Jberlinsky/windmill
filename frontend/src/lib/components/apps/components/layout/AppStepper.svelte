<script lang="ts">
	import { getContext } from 'svelte'
	import { initOutput } from '../../editor/appUtils'
	import SubGridEditor from '../../editor/SubGridEditor.svelte'
	import type { AppViewerContext, ComponentCustomCSS } from '../../types'
	import { concatCustomCss } from '../../utils'
	import InitializeComponent from '../helpers/InitializeComponent.svelte'
	import { twMerge } from 'tailwind-merge'
	import { classNames } from '$lib/utils'
	import Button from '$lib/components/common/button/Button.svelte'
	import { RunnableComponent, RunnableWrapper } from '../helpers'
	import type { AppInput } from '../../inputType'
	import { ArrowLeftIcon, ArrowRightIcon, Loader2 } from 'lucide-svelte'

	export let id: string
	export let componentContainerHeight: number
	export let tabs: string[]
	export let customCss: ComponentCustomCSS<'steppercomponent'> | undefined = undefined
	export let render: boolean
	export let recomputeIds: string[] | undefined = undefined
	export let extraQueryParams: Record<string, any> = {}
	export let componentInput: AppInput | undefined

	const {
		app,
		worldStore,
		focusedGrid,
		selectedComponent,
		componentControl,
		connectingInput,
		mode
	} = getContext<AppViewerContext>('AppViewerContext')

	let selected: string = tabs[0]
	let tabHeight: number = 0
	let footerHeight: number = 0
	let runnableComponent: RunnableComponent
	let selectedIndex = tabs?.indexOf(selected) ?? -1
	let maxReachedIndex = -1
	let statusByStep = [] as Array<'success' | 'error' | 'pending'>

	let outputs = initOutput($worldStore, id, {
		currentStepIndex: 0,
		result: undefined,
		loading: false
	})

	async function handleTabSelection() {
		if (runnableComponent) {
			await runnableComponent?.runComponent()
		}

		selectedIndex = tabs?.indexOf(selected)
		if (selectedIndex > maxReachedIndex) {
			maxReachedIndex = selectedIndex
		}
		outputs?.currentStepIndex.set(selectedIndex)

		if ($focusedGrid?.parentComponentId != id || $focusedGrid?.subGridIndex != selectedIndex) {
			$focusedGrid = {
				parentComponentId: id,
				subGridIndex: selectedIndex
			}
		}
	}

	function getStepColor(
		index: number,
		selectedIndex: number,
		statusByStep: Array<'success' | 'error' | 'pending'>,
		maxReachedIndex: number
	) {
		if (!runnableComponent) {
			if (index === selectedIndex) {
				return 'bg-blue-500 text-white'
			} else if (index > maxReachedIndex) {
				return 'bg-gray-200'
			} else {
				return 'bg-blue-200'
			}
		}

		const current = index === selectedIndex
		if (statusByStep[index] === 'success') {
			return current
				? 'border-green-500 border bg-green-200 text-green-600'
				: 'border-green-500 border'
		} else if (statusByStep[index] === 'error') {
			return current
				? 'border-red-500 border bg-red-200 text-red-600'
				: 'border-red-500 bg-red-100 border'
		} else {
			if (index <= maxReachedIndex) {
				return current
					? 'border-blue-500 border bg-blue-200 text-blue-600'
					: 'border-blue-500 border'
			} else {
				return current
					? 'border-gray-500 border bg-gray-200 text-gray-600'
					: 'border-gray-500 border'
			}
		}
	}

	let result: { error: { name: string; message: string; stack: string } } | undefined = undefined

	async function runStep(targetIndex: number) {
		statusByStep[selectedIndex] = 'pending'

		if (runnableComponent) {
			await runnableComponent?.runComponent()
		}

		if (result?.error !== undefined) {
			statusByStep[selectedIndex] = 'error'
		} else {
			statusByStep[selectedIndex] = 'success'

			selected = tabs[targetIndex]
		}
		directionClicked = undefined
	}

	$componentControl[id] = {
		left: () => {
			const index = tabs.indexOf(selected)
			if (index > 0) {
				selected = tabs[index - 1]
				return true
			}
			return false
		},
		right: () => {
			const index = tabs.indexOf(selected)
			if (index < tabs.length - 1) {
				selected = tabs[index + 1]
				return true
			}
			return false
		},
		setTab: (tab: number) => {
			selected = tabs[tab]
			handleTabSelection()
		}
	}

	$: selected != undefined && handleTabSelection()

	$: css = concatCustomCss($app.css?.steppercomponent, customCss)
	$: lastStep = selectedIndex === tabs.length - 1

	let directionClicked: 'left' | 'right' | undefined = undefined
</script>

<InitializeComponent {id} />
<RunnableWrapper
	{recomputeIds}
	{render}
	bind:runnableComponent
	{componentInput}
	{id}
	{extraQueryParams}
	autoRefresh={false}
	forceSchemaDisplay={true}
	runnableClass="!block"
	{outputs}
	triggerable
	bind:result
	errorHandledByComponent={true}
>
	<div class="w-full overflow-auto">
		<div bind:clientHeight={tabHeight}>
			<div class="flex justify-between">
				<ol
					class={twMerge(
						'relative z-20 flex justify-between items-centers text-sm font-medium text-gray-500',
						css?.selectedStep?.class
					)}
					style={css?.stepsRow?.style}
				>
					{#each tabs ?? [] as step, index}
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<li
							class={classNames(
								'flex items-center gap-2 px-2 py-1 hover:bg-gray-1200 rounded-md m-0.5',
								index <= maxReachedIndex ? 'cursor-pointer' : 'cursor-not-allowed'
							)}
							on:click={() => {
								if (index <= maxReachedIndex || $mode === 'dnd') {
									runStep(index)
								}
							}}
						>
							{#if statusByStep[index] === 'pending'}
								<Loader2 class="h-6 w-6 animate-spin" />
							{:else}
								<span
									class={classNames(
										'h-6 w-6 rounded-full flex items-center justify-center text-xs',
										getStepColor(index, selectedIndex, statusByStep, maxReachedIndex)
									)}
									class:font-bold={selectedIndex === index}
								>
									{index + 1}
								</span>
							{/if}

							<span
								class={classNames(
									'hidden sm:block',
									selectedIndex === index
										? 'font-semibold text-gray-900'
										: 'font-normal text-gray-600'
								)}
							>
								{step}
							</span>
						</li>
						{#if index !== (tabs ?? []).length - 1}
							<li class="flex items-center">
								<div class="h-0.5 w-4 bg-blue-200" />
							</li>
						{/if}
					{/each}
				</ol>
			</div>
		</div>

		<div class="w-full">
			{#if $app.subgrids}
				{#each tabs ?? [] as _res, i}
					<SubGridEditor
						{id}
						visible={render && i === selectedIndex}
						subGridId={`${id}-${i}`}
						class={css?.container?.class}
						style={css?.container?.style}
						containerHeight={componentContainerHeight - tabHeight - footerHeight}
						on:focus={() => {
							if (!$connectingInput.opened) {
								$selectedComponent = [id]
								handleTabSelection()
							}
						}}
					/>
				{/each}
			{/if}
		</div>

		<div bind:clientHeight={footerHeight}>
			<div class="flex justify-between h-10 p-2">
				<div class="flex items-center gap-2">
					<span class="text-sm font-medium text-gray-500">
						Step {selectedIndex + 1} of {tabs.length}
					</span>
				</div>
				<div class="flex items-center gap-2">
					<Button
						size="xs"
						color="light"
						variant="contained"
						disabled={selectedIndex === 0}
						on:click={() => {
							directionClicked = 'left'
							runStep(selectedIndex - 1)
						}}
					>
						<div class="flex flex-row gap-2">
							{#if statusByStep[selectedIndex] === 'pending' && directionClicked === 'left'}
								<Loader2 class="w-4 h-4 animate-spin" />
							{:else}
								<ArrowLeftIcon class="w-4 h-4" />
							{/if}
							Previous
						</div>
					</Button>

					<Button
						size="xs"
						color="dark"
						variant="contained"
						disabled={lastStep}
						on:click={() => {
							directionClicked = 'right'
							runStep(selectedIndex + 1)
						}}
					>
						<div class="flex flex-row gap-2">
							Next
							{#if statusByStep[selectedIndex] === 'pending' && directionClicked === 'right'}
								<Loader2 class="w-4 h-4 animate-spin" />
							{:else}
								<ArrowRightIcon class="w-4 h-4" />
							{/if}
						</div>
					</Button>
				</div>
			</div>
		</div>
	</div>
</RunnableWrapper>
