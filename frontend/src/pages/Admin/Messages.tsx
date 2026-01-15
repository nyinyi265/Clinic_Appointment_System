/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { deleteMessageById, getAllMessages } from "../../../services/apiSvc";
import { Loader2, Trash2 } from "lucide-react";
import ConfirmDialog from "../../components/ConfirmDialog";
import { toast } from "sonner";

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    messageId: null as number | null,
    subject: "",
  });

  const fetchMessages = async () => {
    try {
      const data = await getAllMessages();
      console.log(data);
      if (data.data) {
        setMessages(data.data);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDeleteClick = (message: any) => {
    setConfirmDialog({
      isOpen: true,
      messageId: message.id,
      subject: message.subject,
    });
  };

  const handleCloseDialog = () => {
    setConfirmDialog({ isOpen: false, messageId: null, subject: "" });
  };

  const handleConfirmDelete = async () => {
    if (!confirmDialog.messageId) return;

    setDeleteLoading(true);
    try {
      await deleteMessageById(confirmDialog.messageId);

      toast.success("Message Deleted", {
        description: `The message regarding "${confirmDialog.subject}" has been removed.`,
      });

      await fetchMessages();
      handleCloseDialog();
    } catch (err: any) {
      toast.error("Error", {
        description: err.message || "Failed to delete the message.",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div>
      {loading && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading messages...</p>
          </div>
        </div>
      )}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Messages</h1>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <table className="w-full text-left border">
          <thead>
            <tr>
              <th className="border p-2">ID</th>
              <th className="border p-2">First Name</th>
              <th className="border p-2">Last Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Subject</th>
              <th className="border p-2">Message</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {messages &&
              !loading &&
              !error &&
              messages.map((message: any) => (
                <tr key={message.id}>
                  <td className="border p-2"> {message.id} </td>
                  <td className="border p-2"> {message.first_name} </td>
                  <td className="border p-2"> {message.last_name} </td>
                  <td className="border p-2"> {message.email} </td>
                  <td className="border p-2"> {message.subject} </td>
                  <td className="border p-2 max-w-xs truncate">
                    {" "}
                    {message.message}{" "}
                  </td>
                  <td className="border p-2 flex justify-center">
                    <button
                      className="flex items-center justify-center bg-red-600 p-2 rounded-md text-white cursor-pointer hover:bg-red-700 disabled:opacity-50"
                      onClick={() => handleDeleteClick(message)}
                      disabled={deleteLoading}
                    >
                      <Trash2 className="inline-block w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}

            {messages.length === 0 && !loading && (
              <tr>
                <td colSpan={7} className="border p-2 text-center">
                  No messages found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={handleCloseDialog}
        onConfirm={handleConfirmDelete}
        title="Delete Message"
        description={`Are you sure you want to delete the message from ${confirmDialog.subject}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={deleteLoading}
      />
    </div>
  );
}
