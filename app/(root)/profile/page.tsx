import AuthGuard from "@/lib/authGuard";

const ProfilePage = () => {
    return (
        <AuthGuard>
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="p-8 bg-white rounded-lg shadow-md">
                    <h2 className="text-xl font-bold">Profile</h2>
                    <p className="text-sm text-gray-600">Update your email and password.</p>
                </div>
            </div>
        </AuthGuard>
    );
};

export default ProfilePage;
