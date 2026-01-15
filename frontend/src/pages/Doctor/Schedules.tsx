/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Navbar from "../../components/common/navbar";
import Footer from "../../components/common/footer";
import LoadingOverlay from "../../components/common/LoadingOverlay";
import { Calendar, Plus, Edit, Trash2, Loader2 } from "lucide-react";
import {
  getSchedulesByDoctor,
  createDoctorSchedule,
  updateDoctorSchedule,
  deleteDoctorSchedule,
  getClinicsByDoctor,
  type DoctorSchedule,
  type DoctorClinic,
} from "../../../services/apiSvc";
import { getStorage } from "../../util/storage";
import { toast } from "sonner";

const Schedules = () => {
  const [schedules, setSchedules] = useState<DoctorSchedule[]>([]);
  const [clinics, setClinics] = useState<DoctorClinic[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<DoctorSchedule | null>(
    null
  );
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [idToDelete, setIdToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formatDate = (dateStr: string) =>
    dateStr.includes("T") ? dateStr.split("T")[0] : dateStr;
  const formatTime = (timeStr: string) =>
    timeStr.includes("T")
      ? timeStr.split("T")[1].slice(0, 5)
      : timeStr.slice(0, 5);
  const [formData, setFormData] = useState({
    clinic_id: "",
    date: "",
    start_time: "",
    end_time: "",
    slot_duration: 30,
    is_active: true,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const user = JSON.parse(getStorage().getItem("user") || "{}");
      const userId = user.data.profile.id;
      const schedulesData = await getSchedulesByDoctor(userId);
      setSchedules(schedulesData.data.data);
      const clinicsData = await getClinicsByDoctor(userId);
      setClinics(clinicsData.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const user = JSON.parse(getStorage().getItem("user") || "{}");
      const doctor_profile_id = user.data.profile.id;
      const data = {
        ...formData,
        date: formData.date,
        doctor_profile_id,
        clinic_id: parseInt(formData.clinic_id),
      };
      if (editingSchedule) {
        await updateDoctorSchedule(editingSchedule.id, data);
        toast.success("Schedule Updated", {
          description:
            "The clinic availability has been modified successfully.",
        });
      } else {
        await createDoctorSchedule(data);
        toast.success("Schedule Created", {
          description: "New working hours have been added to your calendar.",
        });
      }
      await fetchData();
      setShowForm(false);
      setEditingSchedule(null);
      setFormData({
        clinic_id: "",
        date: "",
        start_time: "",
        end_time: "",
        slot_duration: 30,
        is_active: true,
      });
    } catch (error) {
      console.error("Error saving schedule:", error);
      toast.error("Save Failed", {
        description:
          "There was an error saving your schedule. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (schedule: DoctorSchedule) => {
    setEditingSchedule(schedule);

    setFormData({
      clinic_id: schedule.clinic_id.toString(),
      date: formatDate(schedule.date),
      start_time: formatTime(schedule.start_time),
      end_time: formatTime(schedule.end_time),
      slot_duration: schedule.slot_duration,
      is_active: schedule.is_active,
    });
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    setIdToDelete(id);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!idToDelete) return;
    setIsDeleting(true);
    try {
      await deleteDoctorSchedule(idToDelete);
      toast.success("Schedule Deleted", {
        description: "The time slot is no longer available for booking.",
      });
      await fetchData();
      setShowDeleteDialog(false);
      setIdToDelete(null);
    } catch (error) {
      console.error("Error deleting schedule:", error);
      toast.error("Delete Failed", {
        description:
          "Could not remove the schedule. It may be linked to active appointments.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar role="doctor" />

      {loading && <LoadingOverlay message="Loading schedules..." />}

      {!loading && (
        <main className="container mx-auto py-10 px-4 space-y-8">
          <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight text-foreground/90">
                My Schedules
              </h1>
              <p className="text-muted-foreground">
                Manage your availability and working hours at different clinics.
              </p>
            </div>
            <Dialog open={showForm} onOpenChange={setShowForm}>
              <DialogTrigger asChild>
                <Button className="shadow-sm gap-2 bg-brandBlue hover:bg-brandBlue/90 text-white cursor-pointer">
                  <Plus className="h-4 w-4" />
                  Add Schedule
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    {editingSchedule ? "Edit Schedule" : "Add Schedule"}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="clinic">Clinic</Label>
                    <Select
                      value={formData.clinic_id}
                      onValueChange={(value) =>
                        setFormData({ ...formData, clinic_id: value })
                      }
                      disabled={loading}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            loading ? "Loading clinics..." : "Select clinic"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {clinics.map((clinic) => (
                          <SelectItem
                            key={clinic.id}
                            value={clinic.clinic.id.toString()}
                          >
                            {clinic.clinic.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="start">Start Time</Label>
                      <Input
                        id="start"
                        type="time"
                        value={formData.start_time}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            start_time: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="end">End Time</Label>
                      <Input
                        id="end"
                        type="time"
                        value={formData.end_time}
                        onChange={(e) =>
                          setFormData({ ...formData, end_time: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="slot">Slot Duration (minutes)</Label>
                    <Input
                      id="slot"
                      type="number"
                      value={formData.slot_duration}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          slot_duration: parseInt(e.target.value),
                        })
                      }
                      min="1"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      id="active"
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          is_active: e.target.checked,
                        })
                      }
                    />
                    <Label htmlFor="active">Active</Label>
                  </div>
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full bg-brandBlue hover:bg-brandBlue/90 text-white cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {editingSchedule ? "Updating..." : "Creating..."}
                      </>
                    ) : editingSchedule ? (
                      "Update Schedule"
                    ) : (
                      "Create Schedule"
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            {/* Delete Confirmation Dialog */}
            <Dialog
              open={showDeleteDialog}
              onOpenChange={(open) => !isDeleting && setShowDeleteDialog(open)}
            >
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle className="text-xl">
                    Confirm Deletion
                  </DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  <p className="text-muted-foreground">
                    Are you sure you want to delete this schedule? This action
                    cannot be undone.
                  </p>
                </div>
                <div className="flex justify-end gap-3 mt-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowDeleteDialog(false)}
                    disabled={isDeleting}
                    className="cursor-pointer"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleConfirmDelete}
                    disabled={isDeleting}
                    className="bg-red-600 hover:bg-red-700 cursor-pointer text-white"
                  >
                    {isDeleting ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Deleting...
                      </div>
                    ) : (
                      "Delete"
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </section>

          <Card className="overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow ring-1 ring-border/50">
            <CardHeader>
              <div className="space-y-1">
                <CardTitle className="text-xl font-semibold tracking-tight">
                  Schedule Management
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Add, edit, or remove your schedules.
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {schedules.map((schedule) => (
                  <div
                    key={schedule.id}
                    className="flex items-center justify-between p-4 border rounded-lg bg-card"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span className="font-medium">
                          {schedule.clinic?.name}
                        </span>
                        <Badge
                          className={`${
                            schedule.is_active
                              ? "bg-blue-100 border border-blue-200 text-blue-800 hover:bg-blue-200"
                              : "bg-red-100 border border-red-200 text-red-800 hover:bg-red-200"
                          }  px-2.5 py-0.5 font-medium`}
                        >
                          {schedule.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(schedule.date)} •{" "}
                        {formatTime(schedule.start_time)} -{" "}
                        {formatTime(schedule.end_time)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="cursor-pointer hover:bg-blue-100"
                        onClick={() => handleEdit(schedule)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="cursor-pointer hover:bg-red-100 text-red-600 border-red-200 hover:text-red-700"
                        onClick={() => handleDelete(schedule.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {schedules.length === 0 && (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground">
                      No schedules yet
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </main>
      )}

      <Footer />
    </div>
  );
};

export default Schedules;
