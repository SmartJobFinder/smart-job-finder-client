// import React from "react";
//
// const VacanciesSection = () => {
//     const vacancies = [
//         { title: "Anesthesiologists", positions: "45,904 Open Positions" },
//         { title: "Surgeons", positions: "50,364 Open Positions" },
//         {
//             title: "Obstetricians-Gynecologists",
//             positions: "4,339 Open Positions",
//         },
//         { title: "Orthodontists", positions: "20,079 Open Positions" },
//         { title: "Maxillofacial Surgeons", positions: "74,875 Open Positions" },
//         { title: "Software Developer", positions: "43359 Open Positions" },
//         { title: "Psychiatrists", positions: "18,599 Open Positions" },
//         { title: "Data Scientist", positions: "28,200 Open Positions" },
//         { title: "Financial Manager", positions: "61,391 Open Positions" },
//         { title: "Management Analysis", positions: "93,046 Open Positions" },
//         { title: "IT Manager", positions: "50,963 Open Positions" },
//         {
//             title: "Operations Research Analysis",
//             positions: "16,627 Open Positions",
//         },
//     ];
//
//     return (
//         <section className="py-8 sm:py-12 lg:py-16">
//             <div className="container px-2 mx-auto sm:px-4">
//                 <h2 className="mb-8 text-xl font-bold text-gray-900 sm:mb-12 sm:text-2xl lg:text-3xl">
//                     Most Popular Vacancies
//                 </h2>
//
//                 <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
//                     {vacancies.map((vacancy, index) => (
//                         <div
//                             key={index}
//                             className="p-2 transition-colors bg-white rounded-lg cursor-pointer sm:p-3 lg:p-4 group hover:bg-blue-600"
//                         >
//                             <h3
//                                 className={`font-semibold text-sm sm:text-base mb-2 group-hover:text-white`}
//                             >
//                                 {vacancy.title}
//                             </h3>
//                             <p className="text-xs text-gray-600 sm:text-sm group-hover:text-white">
//                                 {vacancy.positions}
//                             </p>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </section>
//     );
// };
//
// export default VacanciesSection;
