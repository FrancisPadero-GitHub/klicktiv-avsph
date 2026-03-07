import { FeedbacksTable } from "@/components/super-admin/feedbacks/feedbacks-table";

// export const metadata = {
//   title: "Feedbacks | Klicktiv Admin",
//   description: "Manage user feedbacks and bug reports.",
// };

export default function FeedbacksPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Feedback & Bug Reports
        </h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          View and manage user-submitted feedback and bug reports across the
          platform. Use this information to identify common issues and improve
          the user experience.
        </p>
      </div>
      <FeedbacksTable />
    </div>
  );
}
