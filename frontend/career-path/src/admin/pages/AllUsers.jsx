import UserAccordions from "../components/UserAccordions";
import UserAccordionsPlaceholder from "../components/UserAccordionsPlaceholder";
import { useOutletContext } from "react-router-dom";

export default function AllUsers() {
    const { users, setUsers, isLoading } = useOutletContext();

    return isLoading ? (
        <UserAccordionsPlaceholder />
    ) : (
        <UserAccordions users={users} setUsers={setUsers} />
    );
}