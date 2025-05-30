export interface I_Notification {
	id: string // nanoid(10)
	title: string
	subtitle: string
	status: 'success' | 'error' | 'info' | 'warning'
	duration?: number
}
