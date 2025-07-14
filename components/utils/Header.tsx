import { auth } from "@/auth";
import Navbar from "@/components/navbar/Navbar";

const Header = async () => {
    const session = await auth();
    const email = session?.user?.email?.toLowerCase();
    const superAdminEmails = process.env.EVENTS_ADMIN?.split(",").map(e => e.trim().toLowerCase()) || [];
    const isSuperAdmin = email ? superAdminEmails.includes(email) : false;

    return <Navbar isSuperAdmin={isSuperAdmin} />;
};

export default Header;
