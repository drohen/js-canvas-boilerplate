interface Observer<T>
{
	next?(data: T): void
	complete?(): void
	error?(error: Error): void
}

type MountFn = <T extends HTMLElement>( instance: T ) => void

interface ClickObservable
{
	readonly onClick: {
		subscribe(clickObserver: Observer<void>): void
	}
}

interface UpdateLoopObservable
{
	readonly onUpdate: {
		subscribe(updateLoopObserver: Observer<UpdateLoop>): void
	}
}

interface UpdateLoop
{
	delta: number
	ctx: CanvasRenderingContext2D
}

interface InputObservable
{
	readonly onInput: {
		subscribe(inputObserver: Observer<GenericInputEvent<T>>): void
	}
}

interface GenericInputEvent<T>
{
	type: string
	data: T
}