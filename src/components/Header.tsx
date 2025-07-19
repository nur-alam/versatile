import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { HomeIcon, SettingsIcon, LinkIcon, MailIcon } from "lucide-react";
import { __ } from "@wordpress/i18n";

interface MenuItem {
	id: string;
	label: string;
	path: string;
	badge?: string;
	icon?: React.ReactNode;
}

const menuItems: MenuItem[] = [
	{ id: "dashboard", label: "Dashboard", path: "/dashboard", icon: <HomeIcon /> },
	{ id: "email_logs", label: "Email Logs", path: "/email_logs", icon: <MailIcon /> },
	{ id: "connections", label: "Connections", path: "/connections", icon: <LinkIcon /> },
	{ id: "settings", label: "Settings", path: "/settings", icon: <SettingsIcon /> },
	// { id: "general", label: "General", path: "/general" },
	// { id: "add-connection", label: "Add Connection", path: "/add-connection", badge: "Coming Soon" },
];

const Header = () => {
	const location = useLocation();

	return (
		<div className="border-b">
			<div className="flex h-16 items-center px-4">
				<nav className="flex items-center space-x-6">
					{menuItems.map((item) => (
						<Link
							key={item.id}
							to={item.path}
							className={cn(
								"flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary",
								(location.pathname === item.path || (location.pathname === "/" && item.path === "/dashboard"))
									// (location.pathname === item.path || location.pathname === "/")
									? "text-primary"
									: "text-muted-foreground"
							)}
						>
							{item.label}
							{item.badge && (
								<span className="ml-2 rounded-md bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
									{item.badge}
								</span>
							)}
						</Link>
					))}
				</nav>
				<div className="ml-auto flex items-center space-x-4">
					<span className="text-sm text-muted-foreground">{__('V-1.0.0', 'Versatile')}</span>
					{/* <button className="size-8 rounded-full border border-input bg-background hover:bg-accent hover:text-accent-foreground">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4 m-auto">
							<circle cx="12" cy="12" r="4" />
							<path d="M12 2v2" />
							<path d="M12 20v2" />
							<path d="m4.93 4.93 1.41 1.41" />
							<path d="m17.66 17.66 1.41 1.41" />
							<path d="M2 12h2" />
							<path d="M20 12h2" />
							<path d="m6.34 17.66-1.41 1.41" />
							<path d="m19.07 4.93-1.41 1.41" />
						</svg>
					</button> */}
				</div>
			</div>
		</div>
	);
};

export default Header;