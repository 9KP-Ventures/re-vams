"use client";

import { createEvent } from "@/actions/event";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  CreateEventData,
  createEventSchema,
} from "@/lib/requests/events/create";
import { GetSemestersDataSuccess } from "@/lib/requests/semesters/get-many";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, parse } from "date-fns";
import { CalendarIcon, Loader2, Plus, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function CreateEventView({
  semesters,
}: {
  semesters: GetSemestersDataSuccess["semesters"];
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateEventData>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      date: format(new Date(), "yyyy-MM-dd"),
      organization_id: 1,
      status: "upcoming",
    },
  });

  const onSubmit = async (data: CreateEventData) => {
    setIsSubmitting(true);
    const createData = await createEvent(data);

    if (createData && "error" in createData) {
      setIsSubmitting(false);
      form.setError("root", {
        type: "manual",
        message: createData.error.message || "Failed to create event.",
      });
      return;
    }

    if (!createData) {
      setIsSubmitting(false);
      form.setError("root", {
        type: "manual",
        message: "Failed to create event. Please try again.",
      });
    } else {
      router.push(`/admin/events/${createData.event.id}`);
    }
  };

  return (
    <div className="container py-8">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/admin">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/admin/events">Events</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Create</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-2/3">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Plus size={20} className="text-primary" />
                Create New Event
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  {/* Event Name */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel
                          aria-required
                          className="required-field gap-1"
                        >
                          Event Name
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Enter event name" {...field} />
                        </FormControl>
                        <FormDescription>
                          Provide a descriptive name for your event.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Event Date */}
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel
                          aria-required
                          className="required-field gap-1"
                        >
                          Event Date
                        </FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={`w-full pl-3 text-left font-normal ${
                                  !field.value ? "text-muted-foreground" : ""
                                }`}
                              >
                                {field.value ? (
                                  // Display the date in a readable format
                                  format(
                                    parse(
                                      field.value,
                                      "yyyy-MM-dd",
                                      new Date()
                                    ),
                                    "PPP"
                                  )
                                ) : (
                                  <span>Select a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={
                                field.value
                                  ? parse(field.value, "yyyy-MM-dd", new Date())
                                  : undefined
                              }
                              onSelect={date => {
                                // Convert Date to string in the required format
                                if (date) {
                                  field.onChange(format(date, "yyyy-MM-dd"));
                                }
                              }}
                              autoFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormDescription>
                          The date when the event will take place.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Semester */}
                  <FormField
                    control={form.control}
                    name="semester_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel
                          aria-required
                          className="required-field gap-1"
                        >
                          Semester
                        </FormLabel>
                        <Select
                          onValueChange={value =>
                            field.onChange(parseInt(value))
                          }
                          defaultValue={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a semester" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {semesters.map(semester => (
                              <SelectItem
                                key={semester.id}
                                value={semester.id.toString()}
                              >
                                {semester.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          The academic semester this event belongs to.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Email Notifications Section */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-medium mb-4">
                      Email Notifications
                    </h3>

                    {/* Email Subject */}
                    <FormField
                      control={form.control}
                      name="custom_email_subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Subject</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter email subject"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Subject line for attendance notification emails.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Email Message */}
                    <FormField
                      control={form.control}
                      name="custom_email_message"
                      render={({ field }) => (
                        <FormItem className="mt-4">
                          <FormLabel>Email Message</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter email message content"
                              className="min-h-32"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            The message content for attendance notification
                            emails.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Form error message */}
                  {form.formState.errors.root && (
                    <div className="text-destructive text-sm">
                      {form.formState.errors.root.message}
                    </div>
                  )}

                  {/* Submit and Cancel buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="sm:order-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Create Event
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.push("/admin/events")}
                      className="sm:order-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar with help information */}
        <div className="w-full md:w-1/3">
          <Card>
            <CardHeader>
              <CardTitle>Creating an Event</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm space-y-4">
                <p>
                  Events are the core component of the attendance system. Create
                  an event to track attendance for a specific occasion.
                </p>

                <div className="space-y-2">
                  <h4 className="font-medium">Required Information:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Event Name: Descriptive title for your event</li>
                    <li>Date: When the event will take place</li>
                    <li>Semester: The academic term this event belongs to</li>
                    <li>Email Content: For attendance notifications</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">After Creation:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Set up attendance time slots</li>
                    <li>Generate QR codes for check-ins</li>
                    <li>Monitor attendance in real-time</li>
                    <li>Export attendance reports</li>
                  </ul>
                </div>

                <div className="mt-4 p-3 bg-muted rounded-md">
                  <p className="text-xs text-muted-foreground">
                    Note: You can edit event details after creation if needed.
                    However, changes to an event will not be possible when the
                    even is on-going or has completed.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
