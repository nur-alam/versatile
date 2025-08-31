import React from 'react';
import { __ } from '@wordpress/i18n';
import { TempLogin } from '@/services/templogin-services';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, Copy, Eye, EyeOff } from 'lucide-react';
import { formatExpirationDate, isExpired } from '@/services/templogin-services';

interface TemploginTableProps {
    tempLoginsData: { temp_logins: TempLogin[]; total_pages: number } | undefined;
    isLoading: boolean;
    rolesToUse: Record<string, string>;
    currentPage: number;
    onCopyUrl: (loginUrl: string) => void;
    onToggleStatus: (id: number, currentStatus: boolean) => void;
    onDelete: (id: number) => void;
    onPageChange: (page: number) => void;
}

const TemploginTable: React.FC<TemploginTableProps> = ({
    tempLoginsData,
    isLoading,
    rolesToUse,
    currentPage,
    onCopyUrl,
    onToggleStatus,
    onDelete,
    onPageChange
}) => {
    const getStatusBadge = (tempLogin: TempLogin) => {
        if (!tempLogin.is_active) {
            return <Badge variant="outline">{__('Inactive', 'versatile-toolkit')}</Badge>;
        }
        if (isExpired(tempLogin.expires_at)) {
            return <Badge variant="destructive">{__('Expired', 'versatile-toolkit')}</Badge>;
        }
        return <Badge variant="default">{__('Active', 'versatile-toolkit')}</Badge>;
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{__('Temporary Logins', 'versatile-toolkit')}</CardTitle>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="text-center py-8">{__('Loading...', 'versatile-toolkit')}</div>
                ) : tempLoginsData?.temp_logins.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        {__('No temporary logins found', 'versatile-toolkit')}
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{__('Name', 'versatile-toolkit')}</TableHead>
                                <TableHead>{__('Email', 'versatile-toolkit')}</TableHead>
                                <TableHead>{__('Role', 'versatile-toolkit')}</TableHead>
                                <TableHead>{__('Status', 'versatile-toolkit')}</TableHead>
                                <TableHead>{__('Expires', 'versatile-toolkit')}</TableHead>
                                <TableHead>{__('Login Count', 'versatile-toolkit')}</TableHead>
                                <TableHead>{__('Actions', 'versatile-toolkit')}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tempLoginsData?.temp_logins.map((tempLogin) => (
                                <TableRow key={tempLogin.id}>
                                    <TableCell className="font-medium">{tempLogin.display_name}</TableCell>
                                    <TableCell>{tempLogin.email || '-'}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">
                                            {(rolesToUse && (rolesToUse as Record<string, string>)[tempLogin.role]) || tempLogin.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{getStatusBadge(tempLogin)}</TableCell>
                                    <TableCell>{formatExpirationDate(tempLogin.expires_at)}</TableCell>
                                    <TableCell>{tempLogin.login_count}</TableCell>
                                    <TableCell>
                                        <div className="flex space-x-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => onCopyUrl(tempLogin.login_url)}
                                                title={__('Copy Login URL', 'versatile-toolkit')}
                                            >
                                                <Copy className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => onToggleStatus(tempLogin.id, tempLogin.is_active)}
                                                title={tempLogin.is_active ? __('Deactivate', 'versatile-toolkit') : __('Activate', 'versatile-toolkit')}
                                            >
                                                {tempLogin.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => onDelete(tempLogin.id)}
                                                title={__('Delete', 'versatile-toolkit')}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
            
            {/* Pagination */}
            {tempLoginsData && tempLoginsData.total_pages > 1 && (
                <CardContent className="pt-0">
                    <div className="flex justify-center space-x-2">
                        <Button
                            variant="outline"
                            disabled={currentPage === 1}
                            onClick={() => onPageChange(currentPage - 1)}
                        >
                            {__('Previous', 'versatile-toolkit')}
                        </Button>
                        <span className="flex items-center px-4">
                            {__('Page', 'versatile-toolkit')} {currentPage} {__('of', 'versatile-toolkit')} {tempLoginsData.total_pages}
                        </span>
                        <Button
                            variant="outline"
                            disabled={currentPage === tempLoginsData.total_pages}
                            onClick={() => onPageChange(currentPage + 1)}
                        >
                            {__('Next', 'versatile-toolkit')}
                        </Button>
                    </div>
                </CardContent>
            )}
        </Card>
    );
};

export default TemploginTable;