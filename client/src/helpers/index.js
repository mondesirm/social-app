export const format = date => {
	date = new Date(Date.now() - new Date(date).getTime())
	if (date.getTime() < 10000) return 'now'
	if (date.getTime() < 60000) return `${date.getMinutes()} s ago`
	if (date.getTime() < 3600000) return `${date.getHours()} min ago`
	if (date.getTime() < 86400000) return `${date.getDate()}h ago`
	return date.getDate() - 1 < 1 ? 'yesterday' : `${date.getDate() - 1}d+ ago`
}