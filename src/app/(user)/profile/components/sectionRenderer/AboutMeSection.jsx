export default function AboutMeSection({ data }) {
  // if (!data || !data.text) {
  //   return (
  //     <p className="text-sm text-gray-800 ">
  //       Provides evidence of your specific expertise and skills
  //     </p>
  //   );
  // }
  return <p className="text-lg font-medium text-gray-700">{data.text}</p>;
}
