import { AlumniDocument } from "@/MongoDb/models/Alumni";
import Image from "next/image";

const colorPalette = [
    "#F97316", "#3B82F6", "#10B981", "#E11D48", "#6366F1", "#14B8A6", "#EF4444",
    "#22C55E", "#D946EF", "#2563EB", "#FACC15", "#EC4899", "#A78BFA", "#FCD34D",
    "#4ADE80", "#E879F9", "#1E40AF", "#DB2777", "#059669", "#F472B6", "#C084FC",
    "#7C3AED", "#6EE7B7", "#DC2626", "#93C5FD", "#EA580C"
];

const getInitials = (fullName: string) => {
    const nameParts = fullName.trim().split(" ");
    const firstInitial = nameParts.length > 0 ? nameParts[0].charAt(0).toUpperCase() : "";
    const lastInitial = nameParts.length > 1 ? nameParts[nameParts.length - 1].charAt(0).toUpperCase() : "";
    return `${firstInitial}${lastInitial}`;
};

const getColorByInitials = (initials: string) => {
    const sum = initials
        .split("")
        .reduce((acc, char) => acc + (char.charCodeAt(0) - 65), 0); // Convert A-Z to 0-25
    return colorPalette[sum % 26];
};

const AlumniCard = ({ alumni }: { alumni: AlumniDocument }) => {
    const initials = getInitials(alumni.fullName);
    const bgColor = getColorByInitials(initials);
    const imageSrc = alumni.profilePicture
        ? alumni.profilePicture
        : `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200">
        <rect width="300" height="200" fill="${bgColor}"/>
        <text x="50%" y="50%" font-size="48" font-family="Arial" fill="white" text-anchor="middle" dominant-baseline="middle">
          ${initials}
        </text>
      </svg>
    `)}`;
    const graduationYear = `20${parseInt(alumni.entryNumber.slice(0, 2)) + 4}`;

    return (
        <li className="alumni-card place-self-center">
            <div className=" w-full h-[60%]">
                <Image
                    src={imageSrc}
                    alt={`${alumni.fullName}'s profile picture`}
                    width={300}
                    height={200}
                    className="w-full h-full object-cover rounded-t-lg"
                />
            </div>

            <div className="flex flex-col justify-between h-[40%] p-2">
                <h3 className="text-lg font-bold">{alumni.fullName}</h3>
                <p className="text-sm text-gray-600">Passed out batch of {graduationYear}</p>
                <p className="text-sm text-gray-800 font-medium">Company: {alumni.companyOrInstitute}</p>
                <p className="text-xs text-gray-500">{alumni.professionalSector}</p>
            </div>
        </li>
    );
};

export default AlumniCard;