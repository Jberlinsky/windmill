<script lang="ts">
	const pkStringGenerator = () => (Math.random() + 1).toString(36).substring(7)
	import type { UserEdgeType, UserNodeType } from '../../types/types'

	import {
		createStoreEmpty,
		populateSvelvetStoreFromUserInput
	} from '../../store/controllers/storeApi'
	import { afterUpdate, onMount, getContext } from 'svelte'
	import GraphView from './GraphView.svelte'
	import { sanitizeCanvasOptions, sanitizeUserNodesAndEdges } from '../controllers/middleware'
	import { SVELVET_CONTEXT_KEY, type SvelvetSettingsContext } from '../models'

	const settings = getContext<SvelvetSettingsContext | undefined>(SVELVET_CONTEXT_KEY)

	export let nodes: UserNodeType[]
	export let edges: UserEdgeType[]
	export let bgColor = '#ffffff' // this is used to set the background color of the the Svelvet canvas
	export let width: number = 600
	export let height: number = 600
	export let background: boolean = true
	export let movement: boolean = true
	export let canvasId: string = pkStringGenerator()
	export let snap: boolean = false
	export let snapTo: number = 30
	export let nodeCreate: boolean = false
	export let boundary = false
	export let collapsible = false
	export let locked: boolean = false // if true, node movement is disabled
	export let editable: boolean = false
	export let highlightEdges: boolean = true
	export let scroll: boolean = false
	export let download: boolean = false

	const fullHeight = settings?.fullHeight ?? false
	// generates a unique string for each svelvet component's unique store instance
	// creates a store that uses the unique sting as the key to create and look up the corresponding store
	// this way we can have multiple Svelvet Components on the same page and prevent overlap of information
	const store = createStoreEmpty(canvasId)
	// stores (state) within stores, so that we cannot access values from everywhere
	//   const { widthStore, heightStore, nodesStore, derivedEdges } = svelvetStore;

	let error = ''
	// sets the state of the store to the values passed in from the Svelvet Component on initial render
	onMount(() => {
		try {
			// sanitize user input
			let output = sanitizeUserNodesAndEdges(nodes, edges)
			const userNodes = output['userNodes']
			const userEdges = output['userEdges']

			// set canvas related stores. you need to do this before setting node/edge related stores because
			// initializing nodes/edges might read relevant options from the store.
			store.widthStore.set(width)
			store.heightStore.set(height)
			store.backgroundStore.set(background)
			store.movementStore.set(movement)
			const optionsObj = { snap, snapTo } // TODO: rename to snap
			store.options.set(optionsObj) //
			store.nodeCreate.set(nodeCreate)
			store.boundary.set(boundary)
			store.collapsibleOption.set(collapsible)
			store.lockedOption.set(locked)
			store.editableOption.set(editable)
			store.highlightEdgesOption.set(highlightEdges)

			// make sure that all canvas options are compatible
			sanitizeCanvasOptions(store)
			// set node/edge related stores
			populateSvelvetStoreFromUserInput(canvasId, userNodes, userEdges)
			error = ''
		} catch (e) {
			error = 'There was an error displaying the flow. Please report the error.' + e.message
			console.error(e)
		}
	})
	// // enables data reactivity. TODO: this needs to be added back in
	// Probably need to use findStore, not create store
	afterUpdate(() => {
		try {
			// sanitize user input
			let output = sanitizeUserNodesAndEdges(nodes, edges)
			const userNodes = output['userNodes']
			const userEdges = output['userEdges']

			// set canvas related stores. you need to do this before setting node/edge related stores because
			// initializing nodes/edges might read relevant options from the store.
			store.widthStore.set(width)
			store.heightStore.set(height)
			store.backgroundStore.set(background)
			store.movementStore.set(movement)
			const optionsObj = { snap, snapTo } // TODO: rename to snap
			store.options.set(optionsObj) //
			store.nodeCreate.set(nodeCreate)
			store.boundary.set(boundary)
			store.collapsibleOption.set(collapsible)
			store.lockedOption.set(locked)
			store.editableOption.set(editable)
			store.highlightEdgesOption.set(highlightEdges)

			// make sure that all canvas options are compatible
			sanitizeCanvasOptions(store)
			// set node/edge related stores
			populateSvelvetStoreFromUserInput(canvasId, userNodes, userEdges)
			error = ''
		} catch (e) {
			error = 'There was an error displaying the flow. Please report the error.' + e.message
			console.error(e)
		}
	})
</script>

<!-- Now that a store has been created from the initial nodes and initial edges we drill props from the store down to the D3 GraphView along with the unique key -->
<div
	class="Svelvet"
	style={`width: ${width}px; height: ${
		fullHeight ? '100%' : height + 'px'
	}; background-color: ${bgColor};`}
>
	{#if error != ''}
		<div class="error text-red-600 center-center p-4">{error}</div>
	{:else}
		<GraphView on:expand {download} {scroll} {canvasId} {width} {height} {boundary} />
	{/if}
</div>

<style>
	.Svelvet {
		position: relative;
		overflow: hidden;
		display: grid;
		font-family: 'Segoe UI', sans-serif;
		z-index: 1;
	}
</style>
