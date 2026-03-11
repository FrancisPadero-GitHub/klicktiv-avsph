"use client";
import { useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Briefcase } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
// import { ChevronDownIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

// Zustand store
import {
  useJobStore,
  type JobFormValues,
} from "@/features/store/jobs/useFormJobStore";

// Hooks
import { useAddJob } from "@/hooks/jobs/useAddJobs";
import { useEditJob } from "@/hooks/jobs/useEditJob";
import { useFetchTechnicians } from "@/hooks/technicians/useFetchTechnicians";
import { useFetchPaymentMethods } from "@/hooks/payment-methods/useFetchPaymentMethods";

// Data
import { CLEANING_CATEGORY_GROUPS } from "@/data/jobs";

const JOB_STATUSES = ["pending", "done", "cancelled"] as const;
const categoryLabels = CLEANING_CATEGORY_GROUPS.map((group) => group.label); // for the work title place holder

interface LogJobDialogProps {
  showTrigger?: boolean;
}

export function LogJobDialog({ showTrigger = true }: LogJobDialogProps) {
  // Zustand store
  const {
    form,
    mode,
    isDialogOpen,
    isSubmitting,
    openAdd,
    resetForm,
    closeDialog,
    setIsSubmitting,
  } = useJobStore();

  const isEdit = mode === "edit";

  // TanStack Query data
  const { data: technicians = [] } = useFetchTechnicians();
  const { data: paymentMethods = [] } = useFetchPaymentMethods();
  const activeTechnicians = technicians.filter(
    (technician) => technician.deleted_at === null,
  );
  const activePaymentMethods = paymentMethods.filter(
    (method) => method.deleted_at === null,
  );

  // TanStack Query mutations
  const {
    mutate: addJob,
    isPending: isAddPending,
    reset: resetAddMutation,
  } = useAddJob();

  const {
    mutate: editJob,
    isPending: isEditPending,
    reset: resetEditMutation,
  } = useEditJob();
  const isPending = isEdit ? isEditPending : isAddPending;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    trigger,
    formState: { errors, isDirty },
  } = useForm<JobFormValues>({
    defaultValues: form,
    shouldFocusError: false,
  });

  const technicianId = useWatch({ control, name: "technician_id" });
  const categoryValue = useWatch({ control, name: "category" });
  const paymentMethodId = useWatch({ control, name: "payment_method_id" });
  const status = useWatch({ control, name: "status" });

  // Sync form when dialog opens; resolve payment_method_id from name when editing
  useEffect(() => {
    if (!isDialogOpen) return;

    let resolvedPaymentMethodId = form.payment_method_id || "";

    // In edit mode v_jobs only supplies the payment method name, not the id.
    // Resolve it once payment methods are loaded.
    if (isEdit && !resolvedPaymentMethodId && form.payment_method) {
      const match = paymentMethods.find(
        (pm) =>
          (pm.name || "").toLowerCase() ===
          (form.payment_method || "").toLowerCase(),
      );
      if (match) resolvedPaymentMethodId = match.id;
    }

    reset({ ...form, payment_method_id: resolvedPaymentMethodId });
  }, [
    isDialogOpen,
    paymentMethods.length,
    form,
    reset,
    isEdit,
    paymentMethods,
  ]);

  // Form Controls
  const onSubmit = (data: JobFormValues) => {
    setIsSubmitting(true);

    // `work_order_date` comes from local UI controls without timezone info.
    // Convert to explicit UTC ISO before persisting to `timestamptz`.
    const normalizedWorkOrderDate = data.work_order_date
      ? new Date(data.work_order_date).toISOString()
      : new Date().toISOString();

    const workOrder = {
      work_title: data.work_title,
      work_order_date: normalizedWorkOrderDate,
      technician_id: data.technician_id,
      address: data.address || null,
      category: data.category || null,
      description: data.description || null,
      notes: data.notes || null,
      region: data.region || null,
      contact_no: data.contact_no || null,
      contact_email: data.contact_email || null,
    };

    const promotedAt =
      data.status === "done" && form.status !== "done"
        ? new Date().toISOString()
        : undefined;

    const job = {
      subtotal: Number(data.subtotal),
      parts_total_cost: Number(data.parts_total_cost) || 0,
      payment_method_id: data.payment_method_id || null,
      status: data.status,
      name: data.name,
      tip_amount: Number(data.tip_amount) || 0,
      promoted_at: promotedAt,
    };

    if (isEdit) {
      editJob(
        { workOrderId: form.work_order_id || "", workOrder, job },
        {
          onSuccess: () => {
            closeDialog();
            setTimeout(() => {
              resetEditMutation();
              resetForm();
              reset();
              setIsSubmitting(false);
            }, 300);
          },
          onError: () => {
            setIsSubmitting(false);
          },
        },
      );
    } else {
      addJob(
        { workOrder, job },
        {
          onSuccess: () => {
            closeDialog();
            setTimeout(() => {
              resetAddMutation();
              resetForm();
              reset();
              setIsSubmitting(false);
            }, 300);
          },
          onError: () => {
            setIsSubmitting(false);
          },
        },
      );
    }
  };

  /**
   * Date picker stuff
   */
  const [open, setOpen] = useState(false);
  const workOrderDateValue = useWatch({ control, name: "work_order_date" });
  const displayDate = workOrderDateValue
    ? new Date(workOrderDateValue)
    : undefined;
  const isDateValid = displayDate && !isNaN(displayDate.getTime());
  const finalDisplayDate = isDateValid ? displayDate : new Date();

  const displayTime = isDateValid
    ? `${String(finalDisplayDate.getHours()).padStart(2, "0")}:${String(
        finalDisplayDate.getMinutes(),
      ).padStart(2, "0")}:${String(finalDisplayDate.getSeconds()).padStart(
        2,
        "0",
      )}`
    : "10:30:00";
  // For the date select
  const handleDateSelect = (newDate: Date | undefined) => {
    if (!newDate) return;
    const current = finalDisplayDate;
    current.setFullYear(
      newDate.getFullYear(),
      newDate.getMonth(),
      newDate.getDate(),
    );

    const year = current.getFullYear();
    const month = String(current.getMonth() + 1).padStart(2, "0");
    const day = String(current.getDate()).padStart(2, "0");
    const hours = String(current.getHours()).padStart(2, "0");
    const mins = String(current.getMinutes()).padStart(2, "0");
    const secs = String(current.getSeconds()).padStart(2, "0");

    setValue(
      "work_order_date",
      `${year}-${month}-${day}T${hours}:${mins}:${secs}`,
      { shouldDirty: true, shouldValidate: true },
    );
    setOpen(false);
  };

  // For the time select
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const timeValue = e.target.value;
    if (!timeValue) return;

    const [hours, minutes, seconds = "00"] = timeValue.split(":");
    const current = finalDisplayDate;

    current.setHours(
      parseInt(hours, 10),
      parseInt(minutes, 10),
      parseInt(seconds, 10),
    );

    const year = current.getFullYear();
    const month = String(current.getMonth() + 1).padStart(2, "0");
    const day = String(current.getDate()).padStart(2, "0");
    const hrs = String(current.getHours()).padStart(2, "0");
    const mins = String(current.getMinutes()).padStart(2, "0");
    const secs = String(current.getSeconds()).padStart(2, "0");

    setValue(
      "work_order_date",
      `${year}-${month}-${day}T${hrs}:${mins}:${secs}`,
      { shouldDirty: true, shouldValidate: true },
    );
  };
  // End of date picker stuff

  return (
    <Dialog
      modal
      open={isDialogOpen}
      onOpenChange={(newOpen) => {
        if (newOpen) {
          resetAddMutation();
          resetEditMutation();
          openAdd();
        } else {
          closeDialog();
        }
      }}
    >
      {showTrigger ? (
        <DialogTrigger asChild>
          <Button onClick={openAdd}>
            <Briefcase className="mr-2 h-4 w-4" />
            Log Job
          </Button>
        </DialogTrigger>
      ) : null}

      <DialogContent
        className="w-[calc(100vw-1rem)] p-4 sm:w-full sm:max-w-3xl sm:p-6 md:max-w-5xl lg:max-w-7xl max-h-[90vh] flex flex-col overflow-hidden break-all"
        onCloseAutoFocus={(event) => {
          // Prevent auto-focus on close to avoid scroll jump
          event.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Job" : "Log New Job"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the work order and job details below."
              : "Fill in the work order and job details below."}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault(); // Prevent default form submission to avoid page reload
            void handleSubmit(onSubmit)(); // Returns a void promise, so we can safely call it without awaiting.
          }}
          className="flex flex-col flex-1 min-h-0"
        >
          <div className="overflow-auto no-scrollbar flex-1 grid gap-6">
            <FieldGroup>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-1">
                  <FieldSet>
                    <FieldLegend className="uppercase text-xs font-semibold mb-2 text-muted-foreground">
                      Work Order
                    </FieldLegend>
                    <FieldDescription className="text-[14px] text-muted-foreground">
                      Basic details about the work performed and customer
                      information.
                    </FieldDescription>
                    <FieldGroup>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Work Title */}
                        <Field
                          data-invalid={!!errors.work_title}
                          orientation="vertical"
                        >
                          <FieldLabel htmlFor="job-work-title">
                            Work Title <span className="text-red-500">*</span>
                          </FieldLabel>
                          <Input
                            id="job-work-title"
                            placeholder={`e.g. ${categoryLabels.join(", ")}`}
                            aria-invalid={!!errors.work_title}
                            disabled={isPending}
                            {...register("work_title", {
                              required: "Work title is required",
                            })}
                          />
                          <FieldError>
                            {" "}
                            {errors.work_title && (
                              <p className="text-xs text-red-500">
                                {errors.work_title.message}
                              </p>
                            )}
                          </FieldError>
                        </Field>
                        {/* Category */}
                        <Field data-invalid={!!errors.category}>
                          <FieldLabel>
                            Category
                            <span className="text-muted-foreground text-xs">
                              (optional)
                            </span>
                          </FieldLabel>
                          <Select
                            disabled={isPending}
                            value={categoryValue}
                            onValueChange={(v) =>
                              setValue("category", v, {
                                shouldDirty: true,
                              })
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                              {CLEANING_CATEGORY_GROUPS.map((group) => (
                                <SelectGroup key={group.label}>
                                  <SelectLabel>{group.label}</SelectLabel>

                                  {group.items.map((item) => (
                                    <SelectItem key={item} value={item}>
                                      {item}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              ))}
                            </SelectContent>
                          </Select>
                          <input type="hidden" {...register("category")} />
                          <FieldError>
                            {" "}
                            {errors.category && (
                              <p className="text-xs text-red-500">
                                {errors.category.message}
                              </p>
                            )}
                          </FieldError>
                        </Field>

                        {/* Date & Time */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-1 lg:grid-cols-2">
                          <Field>
                            <FieldLabel htmlFor="date-picker-optional">
                              Date <span className="text-red-500">*</span>
                            </FieldLabel>
                            <Popover open={open} onOpenChange={setOpen}>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  id="date-picker-optional"
                                  className="w-full sm:w-44 justify-between font-normal"
                                  disabled={isPending}
                                >
                                  {format(finalDisplayDate, "PPP")}
                                  {/* <ChevronDownIcon className="h-4 w-4 opacity-50" /> */}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto overflow-hidden p-0"
                                align="start"
                              >
                                <Calendar
                                  mode="single"
                                  selected={finalDisplayDate}
                                  captionLayout="dropdown"
                                  defaultMonth={finalDisplayDate}
                                  onSelect={handleDateSelect}
                                />
                              </PopoverContent>
                            </Popover>
                            <FieldError>
                              {errors.work_order_date && (
                                <p className="text-xs text-red-500">
                                  {errors.work_order_date.message}
                                </p>
                              )}
                            </FieldError>
                          </Field>
                          <Field className="w-full">
                            <FieldLabel htmlFor="time-picker-optional">
                              Time <span className="text-red-500">*</span>
                            </FieldLabel>
                            <Input
                              type="time"
                              id="time-picker-optional"
                              step="1"
                              value={displayTime}
                              onChange={handleTimeChange}
                              disabled={isPending}
                              className="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none w-full"
                            />
                            <input
                              type="hidden"
                              {...register("work_order_date", {
                                required: "Date and time are required",
                              })}
                            />
                          </Field>
                        </div>

                        {/*Technician*/}
                        <Field data-invalid={!!errors.technician_id}>
                          <FieldLabel htmlFor="job-technician">
                            Technician <span className="text-red-500">*</span>
                          </FieldLabel>
                          <Select
                            disabled={
                              isPending || activeTechnicians.length === 0
                            }
                            value={technicianId}
                            onValueChange={(v) =>
                              setValue("technician_id", v, {
                                shouldDirty: true,
                              })
                            }
                          >
                            <SelectTrigger
                              id="job-technician"
                              className="w-full"
                            >
                              <SelectValue
                                placeholder={
                                  activeTechnicians.length === 0
                                    ? "No technician available"
                                    : "Select technician"
                                }
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {activeTechnicians.length > 0 ? (
                                technicians.map((t) => (
                                  <SelectItem key={t.id} value={t.id || ""}>
                                    {t.name}
                                  </SelectItem>
                                ))
                              ) : (
                                <SelectItem value="__no_technician__" disabled>
                                  No technician available
                                </SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                          <input
                            type="hidden"
                            {...register("technician_id", {
                              required: "Technician is required",
                            })}
                          />
                          <FieldError>
                            {errors.technician_id && (
                              <p className="text-xs text-red-500">
                                {errors.technician_id.message}
                              </p>
                            )}
                          </FieldError>
                        </Field>

                        {/* Address */}
                        <Field>
                          <FieldLabel htmlFor="job-address">
                            Address{" "}
                            <span className="text-muted-foreground text-xs">
                              (optional)
                            </span>
                          </FieldLabel>
                          <Input
                            id="job-address"
                            placeholder="123 Main St"
                            disabled={isPending}
                            {...register("address")}
                          />
                        </Field>

                        {/*Region/State */}
                        <Field>
                          <FieldLabel htmlFor="job-region">
                            Region/State{" "}
                            <span className="text-muted-foreground text-xs">
                              (optional)
                            </span>
                          </FieldLabel>
                          <Input
                            id="job-region"
                            placeholder="e.g. North"
                            disabled={isPending}
                            {...register("region")}
                          />
                        </Field>

                        {/* Contact */}
                        <Field>
                          <FieldLabel htmlFor="job-contact-no">
                            Contact Number{" "}
                            <span className="text-muted-foreground text-xs">
                              (optional)
                            </span>
                          </FieldLabel>
                          <Input
                            id="job-contact-no"
                            placeholder="e.g. +1 555 123 4567"
                            disabled={isPending}
                            {...register("contact_no")}
                          />
                        </Field>

                        {/* Contact Email*/}
                        <Field>
                          <FieldLabel htmlFor="job-contact-email">
                            Contact Email{" "}
                            <span className="text-muted-foreground text-xs">
                              (optional)
                            </span>
                          </FieldLabel>
                          <Input
                            id="job-contact-email"
                            type="email"
                            placeholder="customer@example.com"
                            disabled={isPending}
                            {...register("contact_email")}
                          />
                        </Field>
                      </div>

                      {/* Description */}
                      <Field>
                        <FieldLabel htmlFor="job-description">
                          Description{" "}
                          <span className="text-muted-foreground text-xs">
                            (optional)
                          </span>
                        </FieldLabel>
                        <Textarea
                          id="job-description"
                          placeholder="Describe the work performed..."
                          disabled={isPending}
                          {...register("description")}
                        />
                      </Field>

                      {/* Notes */}
                      <Field>
                        <FieldLabel htmlFor="job-notes">
                          Notes{" "}
                          <span className="text-muted-foreground text-xs">
                            (optional)
                          </span>
                        </FieldLabel>
                        <Textarea
                          id="job-notes"
                          placeholder="Any additional notes..."
                          disabled={isPending}
                          {...register("notes")}
                        />
                      </Field>
                    </FieldGroup>
                  </FieldSet>
                  <FieldSeparator className="my-5 sm:hidden" />
                </div>

                <div className="sm:col-span-1">
                  <FieldSet>
                    <FieldLegend className="uppercase text-xs font-semibold mb-2 text-muted-foreground">
                      Job Financials
                    </FieldLegend>
                    <FieldDescription className="text-[14px] text-muted-foreground">
                      Details about the job&apos;s financials and status.
                    </FieldDescription>
                    <FieldGroup>
                      {/* Subtotal & Parts Cost */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field
                          data-invalid={!!errors.subtotal}
                          orientation="vertical"
                        >
                          <FieldLabel htmlFor="job-subtotal">
                            Subtotal ($) <span className="text-red-500">*</span>
                          </FieldLabel>
                          <Input
                            id="job-subtotal"
                            type="number"
                            inputMode="decimal"
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                            aria-invalid={!!errors.subtotal}
                            disabled={isPending}
                            {...register("subtotal", {
                              required: "Subtotal is required",
                              min: {
                                value: 0,
                                message: "Subtotal must be ≥ 0",
                              },
                              valueAsNumber: true,
                              // triggers validation for parts_total_cost when subtotal changes
                              onChange: () => {
                                void trigger("parts_total_cost");
                              },
                            })}
                          />
                          <FieldError>
                            {errors.subtotal && (
                              <p className="text-xs text-red-500">
                                {errors.subtotal.message}
                              </p>
                            )}{" "}
                          </FieldError>
                        </Field>
                        {/* Parts Cost */}
                        <Field>
                          <FieldLabel htmlFor="job-parts-cost">
                            Parts Cost ($){" "}
                            <span className="text-muted-foreground text-xs">
                              (optional)
                            </span>
                          </FieldLabel>
                          <Input
                            id="job-parts-cost"
                            type="number"
                            inputMode="decimal"
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                            disabled={isPending}
                            {...register("parts_total_cost", {
                              min: {
                                value: 0,
                                message: "Parts cost must be ≥ 0",
                              },
                              valueAsNumber: true,
                              validate: (value, formValues) => {
                                const subtotal =
                                  Number(formValues.subtotal) || 0;
                                const partsCost = Number(value) || 0;

                                if (partsCost > subtotal) {
                                  return "Parts cost cannot be more than the subtotal!";
                                }
                                return true;
                              },
                            })}
                          />
                          <FieldError>
                            {errors.parts_total_cost && (
                              <p className="text-xs text-red-500">
                                {errors.parts_total_cost.message}
                              </p>
                            )}
                          </FieldError>
                        </Field>
                        {/* Tip & Payment Method */}
                        <Field>
                          <FieldLabel htmlFor="job-tip">
                            Tip ($){" "}
                            <span className="text-muted-foreground text-xs">
                              (optional)
                            </span>
                          </FieldLabel>
                          <Input
                            id="job-tip"
                            type="number"
                            inputMode="decimal"
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                            disabled={isPending}
                            {...register("tip_amount", {
                              min: { value: 0, message: "Tip must be ≥ 0" },
                              valueAsNumber: true,
                            })}
                          />
                        </Field>

                        <Field data-invalid={!!errors.payment_method}>
                          <FieldLabel htmlFor="job-payment-method">
                            Payment Method{" "}
                            <span className="text-red-500">*</span>
                          </FieldLabel>
                          <Select
                            disabled={
                              isPending || activePaymentMethods.length === 0
                            }
                            value={paymentMethodId}
                            onValueChange={(v) =>
                              setValue("payment_method_id", v, {
                                shouldDirty: true,
                              })
                            }
                          >
                            <SelectTrigger
                              id="job-payment-method"
                              className="w-full"
                            >
                              <SelectValue
                                placeholder={
                                  activePaymentMethods.length === 0
                                    ? "No payment method available"
                                    : "Select payment"
                                }
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {activePaymentMethods.length > 0 ? (
                                paymentMethods.map((pm) => (
                                  <SelectItem key={pm.id} value={pm.id}>
                                    {pm.name}
                                  </SelectItem>
                                ))
                              ) : (
                                <SelectItem
                                  value="__no_payment_method__"
                                  disabled
                                >
                                  No payment method available
                                </SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                          <input
                            type="hidden"
                            {...register("payment_method_id", {
                              required: "Payment method is required",
                            })}
                          />

                          <FieldError>
                            {errors.payment_method_id && (
                              <p className="text-xs text-red-500">
                                {errors.payment_method_id.message}
                              </p>
                            )}
                          </FieldError>
                        </Field>

                        {/* Status */}
                        <Field>
                          <FieldLabel htmlFor="job-status">
                            Status <span className="text-red-500">*</span>
                          </FieldLabel>
                          <Select
                            disabled={isPending}
                            value={status}
                            onValueChange={(v) =>
                              setValue(
                                "status",
                                v as (typeof JOB_STATUSES)[number],
                                {
                                  shouldDirty: true,
                                },
                              )
                            }
                          >
                            <SelectTrigger id="job-status" className="w-full">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              {JOB_STATUSES.map((s) => (
                                <SelectItem key={s} value={s}>
                                  {s.charAt(0).toUpperCase() + s.slice(1)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </Field>

                        {/* Name / Handled by */}
                        <Field data-invalid={!!errors.name}>
                          <FieldLabel htmlFor="job-name">
                            Name / Handled By
                            <span className="text-red-500">*</span>
                          </FieldLabel>
                          <Input
                            id="job-name"
                            placeholder="e.g. John Doe"
                            aria-invalid={!!errors.name}
                            disabled={isPending}
                            {...register("name", {
                              required: "Name required",
                            })}
                          />
                          <FieldError>
                            {" "}
                            {errors.name && (
                              <p className="text-xs text-red-500">
                                {errors.name.message}
                              </p>
                            )}
                          </FieldError>
                        </Field>
                      </div>
                    </FieldGroup>
                  </FieldSet>
                </div>
              </div>
            </FieldGroup>
          </div>
          <DialogFooter className="pt-5">
            <div className="flex w-full flex-col-reverse gap-2 sm:flex-row sm:justify-between">
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto"
                disabled={isSubmitting || isPending}
                onClick={() => {
                  closeDialog();
                  resetForm();
                  reset();
                }}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                className="w-full sm:w-auto"
                disabled={isSubmitting || isPending || !isDirty}
              >
                {isSubmitting || isPending
                  ? isEdit
                    ? "Saving..."
                    : "Logging..."
                  : isEdit
                    ? "Save Changes"
                    : "Log Job"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
