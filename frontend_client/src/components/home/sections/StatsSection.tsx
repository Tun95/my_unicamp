import { Users, GraduationCap, Globe2, Award } from "lucide-react";

const StatsSection = () => {
  const stats = [
    {
      icon: Users,
      number: "50,000+",
      label: "Active Students",
    },
    {
      icon: GraduationCap,
      number: "10,000+",
      label: "Courses Available",
    },
    {
      icon: Globe2,
      number: "500+",
      label: "Partner Universities",
    },
    {
      icon: Award,
      number: "95%",
      label: "Success Rate",
    },
  ];

  return (
    <section className="py-16 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-8 max-900px:px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="bg-blue-100 dark:bg-blue-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <stat.icon
                  className="text-blue-600 dark:text-blue-400"
                  size={32}
                />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600 dark:text-gray-400 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
