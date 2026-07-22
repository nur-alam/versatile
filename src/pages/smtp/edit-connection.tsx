import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ConnectionType } from '@/services/smtp-services';
import EditSmtpConfig from '@pages/smtp/provider/edit-smtp-config';
import EditGmailConfig from '@pages/smtp/provider/edit-gmail-config';
import { __ } from '@wordpress/i18n';
// import EditSesConfig from '@pages/smtp/provider/edit-ses-config';

interface EmailConnectionProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	connection: ConnectionType;
}

export function EditConnectionSheet({ open, onOpenChange, connection }: EmailConnectionProps) {

	return <Sheet open={open} onOpenChange={onOpenChange}>
		<SheetContent className="sm:max-w-md overflow-y-auto" style={{ zIndex: 999999, maxWidth: '550px' }}>
			<SheetHeader>
				<SheetTitle>{__("Edit Connection", "versatile-toolkit")}</SheetTitle>
				<SheetDescription>
					{__("Update your email connection settings.", "versatile-toolkit")}
				</SheetDescription>
			</SheetHeader>

			{connection.provider === "smtp" && (
				<>
					<EditSmtpConfig connection={connection} onSuccess={() => onOpenChange(false)} />
				</>
			)}

			{/* {connection.provider === "ses" && (
				<>
					<EditSesConfig connection={connection} />
				</>
			)} */}

			{connection.provider === "gmail" && (
				<EditGmailConfig connection={connection} onSuccess={() => onOpenChange(false)} />
			)}

		</SheetContent>
	</Sheet >
}
