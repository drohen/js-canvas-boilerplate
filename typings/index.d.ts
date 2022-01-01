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