import React from "react";

type LayoutProps = {
	children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
	return <div className="p-6">{children}</div>;
};

export default Layout;
