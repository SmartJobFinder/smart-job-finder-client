import CompanyGuard from "@/components/recruiter/CompanyGuard";

export default function SettingsPage() {
    return (
        <CompanyGuard>
            <div className="p-4">
                <h1 className="text-xl font-semibold mb-4">Settings</h1>
                <p>Settings content here...</p>
            </div>
        </CompanyGuard>
    );
}

// "use client";

// import { useState, useEffect } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import {
//     User,
//     Bell,
//     Shield,
//     Settings,
//     Save,
//     Briefcase,
//     Mail,
//     Phone,
//     Lock,
// } from "lucide-react";
// import CompanyGuard from "@/components/recruiter/CompanyGuard";
// import { recruiterSettings } from "@/mock/data/recruiterSettings";
// import { toast } from "react-toastify";

// // Custom Toggle Switch Component
// const Toggle = ({ id, checked, onChange, disabled }) => {
//     return (
//         <div className="inline-flex items-center">
//             <div className="relative">
//                 <input
//                     type="checkbox"
//                     id={id}
//                     className="sr-only"
//                     checked={checked}
//                     onChange={onChange}
//                     disabled={disabled}
//                 />
//                 <div
//                     className={`block h-6 w-10 rounded-full ${
//                         checked ? "bg-blue-600" : "bg-gray-300"
//                     } transition-colors`}
//                 />
//                 <div
//                     className={`absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition transform ${
//                         checked ? "translate-x-4" : "translate-x-0"
//                     }`}
//                 />
//             </div>
//         </div>
//     );
// };

// export default function RecruiterSettingsPage() {
//     const [settings, setSettings] = useState(recruiterSettings);
//     const [loading, setLoading] = useState(false);
//     const [activeTab, setActiveTab] = useState("notifications");

//     const handleToggle = (section, key) => {
//         setSettings((prev) => ({
//             ...prev,
//             [section]: {
//                 ...prev[section],
//                 [key]: !prev[section][key],
//             },
//         }));
//     };

//     const handleInputChange = (section, key, value) => {
//         setSettings((prev) => ({
//             ...prev,
//             [section]: {
//                 ...prev[section],
//                 [key]: value,
//             },
//         }));
//     };

//     const handleSave = async () => {
//         setLoading(true);

//         // Simulate API call
//         setTimeout(() => {
//             setLoading(false);
//             toast.success("Settings saved successfully");
//         }, 1000);
//     };

//     return (
//         <CompanyGuard>
//             <div className="space-y-6">
//                 <div>
//                     <h1 className="text-2xl font-bold text-gray-900">
//                         Account Settings
//                     </h1>
//                     <p className="text-gray-500">
//                         Manage your account preferences and settings
//                     </p>
//                 </div>

//                 <Tabs value={activeTab} onValueChange={setActiveTab}>
//                     <TabsList className="grid grid-cols-4">
//                         <TabsTrigger
//                             value="notifications"
//                             className="flex items-center gap-2"
//                         >
//                             <Bell className="w-4 h-4" />
//                             <span className="hidden sm:inline">
//                                 Notifications
//                             </span>
//                         </TabsTrigger>
//                         <TabsTrigger
//                             value="privacy"
//                             className="flex items-center gap-2"
//                         >
//                             <Shield className="w-4 h-4" />
//                             <span className="hidden sm:inline">Privacy</span>
//                         </TabsTrigger>
//                         <TabsTrigger
//                             value="jobs"
//                             className="flex items-center gap-2"
//                         >
//                             <Briefcase className="w-4 h-4" />
//                             <span className="hidden sm:inline">
//                                 Job Preferences
//                             </span>
//                         </TabsTrigger>
//                         <TabsTrigger
//                             value="account"
//                             className="flex items-center gap-2"
//                         >
//                             <User className="w-4 h-4" />
//                             <span className="hidden sm:inline">Account</span>
//                         </TabsTrigger>
//                     </TabsList>

//                     {/* Notifications Settings */}
//                     <TabsContent value="notifications">
//                         <Card>
//                             <CardContent className="pt-6">
//                                 <div className="space-y-6">
//                                     <div>
//                                         <h3 className="text-lg font-medium mb-4">
//                                             Notification Preferences
//                                         </h3>
//                                         <p className="text-sm text-gray-500 mb-6">
//                                             Control how and when you receive
//                                             notifications about your job
//                                             postings and applications
//                                         </p>
//                                     </div>

//                                     <div className="space-y-4">
//                                         {Object.entries(
//                                             settings.notifications
//                                         ).map(([key, value]) => (
//                                             <div
//                                                 key={key}
//                                                 className="flex items-center justify-between"
//                                             >
//                                                 <div>
//                                                     <Label
//                                                         htmlFor={`notification-${key}`}
//                                                         className="font-medium"
//                                                     >
//                                                         {key
//                                                             .replace(
//                                                                 /([A-Z])/g,
//                                                                 " $1"
//                                                             )
//                                                             .replace(
//                                                                 /^./,
//                                                                 (str) =>
//                                                                     str.toUpperCase()
//                                                             )}
//                                                     </Label>
//                                                     <p className="text-sm text-gray-500">
//                                                         {getNotificationDescription(
//                                                             key
//                                                         )}
//                                                     </p>
//                                                 </div>
//                                                 <Toggle
//                                                     id={`notification-${key}`}
//                                                     checked={value}
//                                                     onChange={() =>
//                                                         handleToggle(
//                                                             "notifications",
//                                                             key
//                                                         )
//                                                     }
//                                                 />
//                                             </div>
//                                         ))}
//                                     </div>

//                                     <div className="flex justify-end">
//                                         <Button
//                                             className="bg-blue-600 hover:bg-blue-700"
//                                             onClick={handleSave}
//                                             disabled={loading}
//                                         >
//                                             {loading ? (
//                                                 <>
//                                                     <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
//                                                     Saving...
//                                                 </>
//                                             ) : (
//                                                 <>
//                                                     <Save className="w-4 h-4 mr-2" />
//                                                     Save Changes
//                                                 </>
//                                             )}
//                                         </Button>
//                                     </div>
//                                 </div>
//                             </CardContent>
//                         </Card>
//                     </TabsContent>

//                     {/* Privacy Settings */}
//                     <TabsContent value="privacy">
//                         <Card>
//                             <CardContent className="pt-6">
//                                 <div className="space-y-6">
//                                     <div>
//                                         <h3 className="text-lg font-medium mb-4">
//                                             Privacy Settings
//                                         </h3>
//                                         <p className="text-sm text-gray-500 mb-6">
//                                             Manage how your company information
//                                             is displayed and shared
//                                         </p>
//                                     </div>

//                                     <div className="space-y-4">
//                                         {Object.entries(settings.privacy).map(
//                                             ([key, value]) => (
//                                                 <div
//                                                     key={key}
//                                                     className="flex items-center justify-between"
//                                                 >
//                                                     <div>
//                                                         <Label
//                                                             htmlFor={`privacy-${key}`}
//                                                             className="font-medium"
//                                                         >
//                                                             {key
//                                                                 .replace(
//                                                                     /([A-Z])/g,
//                                                                     " $1"
//                                                                 )
//                                                                 .replace(
//                                                                     /^./,
//                                                                     (str) =>
//                                                                         str.toUpperCase()
//                                                                 )}
//                                                         </Label>
//                                                         <p className="text-sm text-gray-500">
//                                                             {getPrivacyDescription(
//                                                                 key
//                                                             )}
//                                                         </p>
//                                                     </div>
//                                                     <Toggle
//                                                         id={`privacy-${key}`}
//                                                         checked={value}
//                                                         onChange={() =>
//                                                             handleToggle(
//                                                                 "privacy",
//                                                                 key
//                                                             )
//                                                         }
//                                                     />
//                                                 </div>
//                                             )
//                                         )}
//                                     </div>

//                                     <div className="flex justify-end">
//                                         <Button
//                                             className="bg-blue-600 hover:bg-blue-700"
//                                             onClick={handleSave}
//                                             disabled={loading}
//                                         >
//                                             {loading
//                                                 ? "Saving..."
//                                                 : "Save Changes"}
//                                         </Button>
//                                     </div>
//                                 </div>
//                             </CardContent>
//                         </Card>
//                     </TabsContent>

//                     {/* Job Preferences */}
//                     <TabsContent value="jobs">
//                         <Card>
//                             <CardContent className="pt-6">
//                                 <div className="space-y-6">
//                                     <div>
//                                         <h3 className="text-lg font-medium mb-4">
//                                             Job Posting Preferences
//                                         </h3>
//                                         <p className="text-sm text-gray-500 mb-6">
//                                             Configure default settings for job
//                                             postings and applications
//                                         </p>
//                                     </div>

//                                     <div className="space-y-4">
//                                         <div className="flex items-center justify-between">
//                                             <div>
//                                                 <Label
//                                                     htmlFor="job-autoRenewJobs"
//                                                     className="font-medium"
//                                                 >
//                                                     Auto-renew jobs
//                                                 </Label>
//                                                 <p className="text-sm text-gray-500">
//                                                     Automatically renew job
//                                                     postings before they expire
//                                                 </p>
//                                             </div>
//                                             <Toggle
//                                                 id="job-autoRenewJobs"
//                                                 checked={
//                                                     settings.jobPreferences
//                                                         .autoRenewJobs
//                                                 }
//                                                 onChange={() =>
//                                                     handleToggle(
//                                                         "jobPreferences",
//                                                         "autoRenewJobs"
//                                                     )
//                                                 }
//                                             />
//                                         </div>

//                                         <div>
//                                             <Label
//                                                 htmlFor="job-autoRejectDays"
//                                                 className="font-medium"
//                                             >
//                                                 Auto-reject applications after
//                                                 (days)
//                                             </Label>
//                                             <p className="text-sm text-gray-500 mb-2">
//                                                 Automatically reject
//                                                 applications that haven't been
//                                                 reviewed after specified days
//                                             </p>
//                                             <Input
//                                                 id="job-autoRejectDays"
//                                                 type="number"
//                                                 min="0"
//                                                 value={
//                                                     settings.jobPreferences
//                                                         .autoRejectAfterDays
//                                                 }
//                                                 onChange={(e) =>
//                                                     handleInputChange(
//                                                         "jobPreferences",
//                                                         "autoRejectAfterDays",
//                                                         parseInt(
//                                                             e.target.value
//                                                         ) || 0
//                                                     )
//                                                 }
//                                                 className="max-w-xs"
//                                             />
//                                         </div>

//                                         <div>
//                                             <Label
//                                                 htmlFor="job-visibility"
//                                                 className="font-medium"
//                                             >
//                                                 Default job visibility
//                                             </Label>
//                                             <p className="text-sm text-gray-500 mb-2">
//                                                 Set the default visibility for
//                                                 new job postings
//                                             </p>
//                                             <select
//                                                 id="job-visibility"
//                                                 value={
//                                                     settings.jobPreferences
//                                                         .defaultJobVisibility
//                                                 }
//                                                 onChange={(e) =>
//                                                     handleInputChange(
//                                                         "jobPreferences",
//                                                         "defaultJobVisibility",
//                                                         e.target.value
//                                                     )
//                                                 }
//                                                 className="w-full max-w-xs p-2 border rounded-md"
//                                             >
//                                                 <option value="public">
//                                                     Public - Visible to everyone
//                                                 </option>
//                                                 <option value="private">
//                                                     Private - Only visible with
//                                                     direct link
//                                                 </option>
//                                                 <option value="featured">
//                                                     Featured - Highlighted on
//                                                     homepage
//                                                 </option>
//                                             </select>
//                                         </div>
//                                     </div>

//                                     <div className="flex justify-end">
//                                         <Button
//                                             className="bg-blue-600 hover:bg-blue-700"
//                                             onClick={handleSave}
//                                             disabled={loading}
//                                         >
//                                             {loading
//                                                 ? "Saving..."
//                                                 : "Save Changes"}
//                                         </Button>
//                                     </div>
//                                 </div>
//                             </CardContent>
//                         </Card>
//                     </TabsContent>

//                     {/* Account Settings */}
//                     <TabsContent value="account">
//                         <Card>
//                             <CardContent className="pt-6">
//                                 <div className="space-y-6">
//                                     <div>
//                                         <h3 className="text-lg font-medium mb-4">
//                                             Account Information
//                                         </h3>
//                                         <p className="text-sm text-gray-500 mb-6">
//                                             Update your account information and
//                                             security settings
//                                         </p>
//                                     </div>

//                                     <div className="space-y-4">
//                                         <div>
//                                             <Label
//                                                 htmlFor="account-email"
//                                                 className="font-medium"
//                                             >
//                                                 Email Address
//                                             </Label>
//                                             <div className="flex gap-2 mt-1">
//                                                 <div className="relative flex-1">
//                                                     <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
//                                                     <Input
//                                                         id="account-email"
//                                                         type="email"
//                                                         value={
//                                                             settings.account
//                                                                 .email
//                                                         }
//                                                         onChange={(e) =>
//                                                             handleInputChange(
//                                                                 "account",
//                                                                 "email",
//                                                                 e.target.value
//                                                             )
//                                                         }
//                                                         className="pl-10"
//                                                     />
//                                                 </div>
//                                                 <Button variant="outline">
//                                                     Verify
//                                                 </Button>
//                                             </div>
//                                         </div>

//                                         <div>
//                                             <Label
//                                                 htmlFor="account-phone"
//                                                 className="font-medium"
//                                             >
//                                                 Phone Number
//                                             </Label>
//                                             <div className="flex gap-2 mt-1">
//                                                 <div className="relative flex-1">
//                                                     <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
//                                                     <Input
//                                                         id="account-phone"
//                                                         type="tel"
//                                                         value={
//                                                             settings.account
//                                                                 .phoneNumber
//                                                         }
//                                                         onChange={(e) =>
//                                                             handleInputChange(
//                                                                 "account",
//                                                                 "phoneNumber",
//                                                                 e.target.value
//                                                             )
//                                                         }
//                                                         className="pl-10"
//                                                     />
//                                                 </div>
//                                                 <Button variant="outline">
//                                                     Verify
//                                                 </Button>
//                                             </div>
//                                         </div>

//                                         <div className="pt-4 border-t">
//                                             <div className="flex items-center justify-between">
//                                                 <div>
//                                                     <Label
//                                                         htmlFor="account-2fa"
//                                                         className="font-medium"
//                                                     >
//                                                         Two-Factor
//                                                         Authentication
//                                                     </Label>
//                                                     <p className="text-sm text-gray-500">
//                                                         Add an extra layer of
//                                                         security to your account
//                                                     </p>
//                                                 </div>
//                                                 <Toggle
//                                                     id="account-2fa"
//                                                     checked={
//                                                         settings.account
//                                                             .twoFactorEnabled
//                                                     }
//                                                     onChange={() =>
//                                                         handleToggle(
//                                                             "account",
//                                                             "twoFactorEnabled"
//                                                         )
//                                                     }
//                                                 />
//                                             </div>
//                                         </div>

//                                         <div className="pt-4">
//                                             <Button
//                                                 variant="outline"
//                                                 className="w-full sm:w-auto"
//                                             >
//                                                 <Lock className="w-4 h-4 mr-2" />
//                                                 Change Password
//                                             </Button>
//                                         </div>
//                                     </div>

//                                     <div className="flex justify-end">
//                                         <Button
//                                             className="bg-blue-600 hover:bg-blue-700"
//                                             onClick={handleSave}
//                                             disabled={loading}
//                                         >
//                                             {loading
//                                                 ? "Saving..."
//                                                 : "Save Changes"}
//                                         </Button>
//                                     </div>
//                                 </div>
//                             </CardContent>
//                         </Card>
//                     </TabsContent>
//                 </Tabs>
//             </div>
//         </CompanyGuard>
//     );
// }

// function getNotificationDescription(key) {
//     const descriptions = {
//         newApplications:
//             "Get notified when candidates apply to your job postings",
//         interviewReminders: "Receive reminders about upcoming interviews",
//         accountUpdates: "Updates about your account status and subscription",
//         marketingEmails: "Promotional emails about new features and offers",
//         jobExpiration:
//             "Get notified when your job postings are about to expire",
//         dailySummary: "Receive a daily summary of your account activity",
//     };
//     return descriptions[key] || "";
// }

// function getPrivacyDescription(key) {
//     const descriptions = {
//         showCompanyContact:
//             "Display company contact information on job postings",
//         allowProfileViewing: "Allow candidates to view your company profile",
//         showSocialMedia: "Display your company's social media links",
//     };
//     return descriptions[key] || "";
// }
