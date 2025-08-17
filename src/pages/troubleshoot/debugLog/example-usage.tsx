import React from 'react'
import DataTable, { Column } from './dataTable'
import { Badge } from '@/components/ui/badge'

// Example data type
interface LogEntry {
	id: number
	timestamp: string
	level: 'error' | 'warning' | 'info' | 'debug'
	message: string
	file: string
	line: number
}

// Example usage component
const ExampleUsage = () => {
	// Sample data
	const logData: LogEntry[] = [
		{
			id: 1,
			timestamp: '2024-01-15 10:30:25',
			level: 'error',
			message: 'Database connection failed',
			file: 'wp-config.php',
			line: 45
		},
		{
			id: 2,
			timestamp: '2024-01-15 10:31:12',
			level: 'warning',
			message: 'Plugin deprecated function used',
			file: 'functions.php',
			line: 123
		},
		{
			id: 3,
			timestamp: '2024-01-15 10:32:05',
			level: 'info',
			message: 'User logged in successfully',
			file: 'wp-login.php',
			line: 89
		},
		// Add more sample data...
	]

	// Define columns with custom rendering
	const columns: Column<LogEntry>[] = [
		{
			key: 'timestamp',
			header: 'Timestamp',
			sortable: true,
			width: '180px'
		},
		{
			key: 'level',
			header: 'Level',
			sortable: true,
			width: '100px',
			render: (value: string) => {
				const variants = {
					error: 'destructive',
					warning: 'secondary',
					info: 'default',
					debug: 'outline'
				} as const
				
				return (
					<Badge variant={variants[value as keyof typeof variants] || 'default'}>
						{value.toUpperCase()}
					</Badge>
				)
			}
		},
		{
			key: 'message',
			header: 'Message',
			sortable: true,
			render: (value: string) => (
				<div className="max-w-md truncate" title={value}>
					{value}
				</div>
			)
		},
		{
			key: 'file',
			header: 'File',
			sortable: true,
			width: '150px',
			render: (value: string, row: LogEntry) => (
				<div className="font-mono text-sm">
					{value}:{row.line}
				</div>
			)
		}
	]

	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold mb-6">Debug Log Viewer</h1>
			
			<DataTable
				data={logData}
				columns={columns}
				searchable={true}
				searchPlaceholder="Search logs..."
				pageSize={10}
				emptyMessage="No log entries found"
				className="w-full"
			/>
		</div>
	)
}

export default ExampleUsage