import { __ } from '@wordpress/i18n';
import TempLoginTable from "@/pages/templogin/temp-login-table";
import CreateTemplogin from "@/pages/templogin/create-temp-login";

const TempLogin = () => {
    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold">{__('Temporary Logins', 'versatile-toolkit')}</h2>
                    <p className="text-gray-600 mt-2">
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
