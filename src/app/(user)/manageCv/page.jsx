// "use client";

// import ManageCv from "./components/ManageCv";

// export default function ManageCvPage() {
//     return <ManageCv />;
// }
"use client";
import { useSelector } from "react-redux";
import { selectProfileCompletion } from "@/features/profile/profileSlice";
import ManageCv from "./components/ManageCv";
import { cvData } from "@/mock/data/cvData";

export default function ManageCvPage() {
    const completion = useSelector(selectProfileCompletion);

    return <ManageCv mockData={cvData} />;
}
