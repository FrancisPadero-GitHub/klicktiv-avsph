import { create } from "zustand";
import type { Database } from "@/database.types";

type FormMode = "add" | "edit";

export interface JobFormValues {
  // identity – only populated in edit mode
  work_order_id?: string;
  // work order fields
  work_title: string;
  work_order_date: string;
  technician_id: string;
  address: string;
  category: string;
  description: string;
  notes: string;
  region: string;
  contact_no: string;
  contact_email: string;
  // job fields
  subtotal: number;
  parts_total_cost: number;
  payment_method_id: string;
  /** Name of the payment method – supplied by the view row; used to resolve id on edit */
  payment_method?: string | null;
  status: Database["public"]["Enums"]["job_status_enum"];
  name: string;
  tip_amount: number;
}

interface JobStore {
  form: JobFormValues;
  mode: FormMode;
  isDialogOpen: boolean;
  isSubmitting: boolean;
  openAdd: () => void;
  openEdit: (data: JobFormValues & { work_order_id: string }) => void;
  closeDialog: () => void;
  resetForm: () => void;

  setIsSubmitting: (value: boolean) => void;
}

const getLocalISOTime = () => {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
};

export const defaultJobForm: JobFormValues = {
  work_order_id: undefined,
  work_title: "",
  work_order_date: getLocalISOTime(),
  technician_id: "",
  address: "",
  category: "",
  description: "",
  notes: "",
  region: "",
  contact_no: "",
  contact_email: "",
  subtotal: 0,
  parts_total_cost: 0,
  payment_method_id: "",
  payment_method: null,
  status: "pending",
  name: "",
  tip_amount: 0,
};

export const useJobStore = create<JobStore>((set) => ({
  form: { ...defaultJobForm },
  mode: "add",
  isDialogOpen: false,
  isSubmitting: false,

  openAdd: () =>
    set({
      form: { ...defaultJobForm, work_order_date: getLocalISOTime() },
      mode: "add",
      isDialogOpen: true,
      isSubmitting: false,
    }),

  openEdit: (data) => {
    let localDate = data.work_order_date;
    if (localDate) {
      const d = new Date(localDate);
      if (!isNaN(d.getTime())) {
        localDate = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
          .toISOString()
          .slice(0, 16);
      }
    }
    set({
      form: { ...defaultJobForm, ...data, work_order_date: localDate },
      mode: "edit",
      isDialogOpen: true,
      isSubmitting: false,
    });
  },

  closeDialog: () =>
    set({
      isDialogOpen: false,
    }),

  resetForm: () =>
    set({
      form: { ...defaultJobForm },
      mode: "add",
      isSubmitting: false,
    }),

  setIsSubmitting: (value) => set({ isSubmitting: value }),
}));
