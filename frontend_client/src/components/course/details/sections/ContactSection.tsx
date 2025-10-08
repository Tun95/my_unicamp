import { Globe, Mail, Phone } from "lucide-react";

interface ContactSectionProps {
  website?: string;
  email?: string;
}

const ContactSection = ({ website, email }: ContactSectionProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Contact Information
      </h3>

      <div className="space-y-4">
        {website && (
          <a
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors group"
          >
            <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
              <Globe size={18} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Website
              </p>
              <p className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">
                {website.replace(/^https?:\/\//, "")}
              </p>
            </div>
          </a>
        )}

        {email && (
          <a
            href={`mailto:${email}`}
            className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors group"
          >
            <div className="bg-green-100 dark:bg-green-900 p-2 rounded-lg">
              <Mail size={18} className="text-green-600 dark:text-green-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
              <p className="font-medium text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 truncate">
                {email}
              </p>
            </div>
          </a>
        )}

        {/* General Contact */}
        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-lg">
            <Phone size={18} className="text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Admissions Office
            </p>
            <p className="font-medium text-gray-900 dark:text-white">
              +1 (555) 123-4567
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;
