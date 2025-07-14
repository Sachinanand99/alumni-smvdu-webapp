import CampusVisitForm from "@/components/forms/CampusVisitForm";
import UserModel, { UserDocument } from "@/MongoDb/models/User";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

const Page = async () => {
    const session = await auth();

    if (!session?.user) {
        redirect("/auth/login");
    }

    const contactEmail = process.env.REACT_APP_CONTACT_EMAIL || "N/A";
    const contactPhone = process.env.REACT_APP_CONTACT_PHONE || "N/A";

    const user: UserDocument = JSON.parse(
        JSON.stringify(
            await UserModel.findOne({
                name: session.user.name,
                personalEmail: session.user.email,
            })
        )
    );

    return (
        <>
            <section className="orange_container pattern !min-h-[230px]">
                <h1 className={"heading"}>Campus Visit Form</h1>
                <p className="sub-heading !max-w-3xl">
                    For Faculty Guest houses queries, please contact :<br />
                    {contactEmail} or call to {contactPhone}
                </p>
            </section>
            <CampusVisitForm user={user} />
        </>
    );
};

export default Page;
