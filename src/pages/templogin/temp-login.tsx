import { __ } from '@wordpress/i18n';
import TempLoginTable from "@/pages/templogin/temp-login-table";
import CreateTemplogin from "@/pages/templogin/create-temp-login";

const TempLogin = () => {
    return (
        <div className="vt-p-6 vt-space-y-6">
            {/* Header */}
            <div className="vt-flex vt-justify-between vt-items-center">
                <div>
                    <h2 className="vt-text-2xl vt-font-bold">{__('Temporary Logins', 'versatile-toolkit')}</h2>
                    <p className="vt-text-gray-600 vt-mt-2">
                        {__('Create and manage temporary login access for users', 'versatile-toolkit')}
                    </p>
                </div>
                <div>
                    <CreateTemplogin />
                </div>
            </div>
            <TempLoginTable />
        </div>
    )
};

export default TempLogin;
