import React, { useState } from "react";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { AlertTriangle } from "lucide-react";
import { __ } from "@wordpress/i18n";
import toast from "react-hot-toast";
import config from "@/config";
import { ConnectionType } from "@/services/smtp-services";
import { SetStateAction, Dispatch } from "react";
import { VersatileResponseType } from "@/utils/versatile-declaration";
interface DeleteConnectionSheetProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	connection: ConnectionType;
	setInitialConnections?: Dispatch<SetStateAction<ConnectionType[]>>;
}

export function DeleteConnectionSheet({
	open,
	onOpenChange,
	connection,
	setInitialConnections
}: DeleteConnectionSheetProps) {
	const [isDeleting, setIsDeleting] = useState(false);

	const handleDelete = async () => {
		if (!connection) return;

		setIsDeleting(true);
		try {
			const formData = new FormData();
			formData.append("action", "delete_email_config");
			formData.append("trigger_nonce", config.nonce_value);
			formData.append("provider", connection.provider);

			const response = await fetch(config.ajax_url, {
				method: "POST",
				body: formData,
			});

			const responseData = await response.json() as VersatileResponseType;
			if (responseData?.status_code === 200) {
				if (setInitialConnections && Array.isArray(responseData.data)) {
					setInitialConnections(responseData.data);
				}

				toast.success(responseData.message || __("Connection deleted successfully!"));
			} else {
				toast.error(responseData.message || __("Failed to delete connection. Please try again.", "trigger"));
			}
		} catch (error) {
			toast.error(__("An unexpected error occurred. Please try again.", "trigger"));
			console.error("Error deleting connection:", error);
		} finally {
			setIsDeleting(false);
			onOpenChange(false);
		}
	};

	return (
		<ConfirmationDialog
			open={open}
			onOpenChange={onOpenChange}
			title={__('Delete Connection', 'trigger')}
			description={__('Are you sure you want to delete this connection? This action cannot be undone.', 'trigger')}
			icon={<AlertTriangle className="h-5 w-5 text-destructive" />}
			variant="danger"
			confirmText={__('Delete', 'trigger')}
			cancelText={__('Cancel', 'trigger')}
			onConfirm={handleDelete}
			loading={isDeleting}
			loadingText={__('Deleting...', 'trigger')}
		>
			{connection && (
				<div className="space-y-2 mt-2 mb-4">
					<div className="grid grid-cols-2 gap-2">
						<div>
							<span className="font-medium">{__('Provider:', 'trigger')}</span>
							<p className="text-sm text-muted-foreground">{connection.provider}</p>
						</div>
						<div>
							<span className="font-medium">{__('Email:', 'trigger')}</span>
							<p className="text-sm text-muted-foreground">{connection.fromEmail}</p>
						</div>
					</div>
				</div>
			)}
		</ConfirmationDialog>
	);
} 