import { __ } from '@wordpress/i18n'
import { ArrowLeft } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'
import MaintenanceSettings from './maintenance-settings'

const Maintenance = () => {
	return (
		<div className="p-4 space-y-6">
			<MaintenanceSettings />
		</div>
	)
}

export default Maintenance