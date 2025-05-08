import { auth, signIn } from "@/auth";

const Page = async () => {
    const session = await auth();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            {session && session.user ? (
                <div className="p-8 bg-white rounded-lg shadow-md">
                    <p className="text-lg font-semibold">User Logged In!</p>
                    <a href="/public">Add your Profile</a>
                </div>
            ) : (
                <div className="p-8 bg-white rounded-lg shadow-md space-y-4 w-80">
                    <h2 className="text-xl font-bold text-center">Login</h2>
                    <form
                        action={async () => {
                            "use server";
                            await signIn("google");
                        }}
                    >
                        <button
                            type="submit"
                            className="w-full py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
                        >
                            Connect with your university id's.
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Page;
