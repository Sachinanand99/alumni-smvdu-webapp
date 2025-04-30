import { Alumni } from "@sanity/types";

export type AlumniTypeCard = Alumni;

const AlumniCard = ({ event }: { event: AlumniTypeCard }) => {

    return (
        <li className="flex flex-col md:flex-row gap-4 w-33% border border-gray-300 rounded-lg p-4 m-4 bg-white shadow-sm">
            Alumni Card
        </li>
    );
};

export default AlumniCard;
